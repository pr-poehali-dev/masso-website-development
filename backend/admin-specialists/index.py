import json
import os
from datetime import date, datetime
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

ALLOWED_SPECIALIST_FIELDS = {
    "name", "email", "salon_id", "experience_years",
    "training_status",
}


def serialize(obj):
    """Рекурсивно конвертирует datetime и Decimal в JSON-совместимые типы."""
    if isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize(i) for i in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    return obj


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"], options=f"-c search_path={SCHEMA}")
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)
    return conn, cur


def respond(status_code, body):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": serialize(body),
    }


def handle_get_list(cur, params):
    """Список специалистов с пагинацией, фильтрами и поиском."""
    training_status = params.get("training_status")
    search = params.get("search")
    page = int(params.get("page", 1))
    per_page = int(params.get("per_page", 20))
    offset = (page - 1) * per_page

    where_parts = []
    query_params = []

    if training_status:
        where_parts.append("sp.training_status = %s")
        query_params.append(training_status)

    if search:
        where_parts.append(
            "(sp.name ILIKE %s OR sp.email ILIKE %s OR s.name ILIKE %s)"
        )
        like = f"%{search}%"
        query_params.extend([like, like, like])

    where_clause = ""
    if where_parts:
        where_clause = "WHERE " + " AND ".join(where_parts)

    # Count total
    count_sql = (
        f"SELECT COUNT(*) AS cnt "
        f"FROM specialists sp "
        f"LEFT JOIN salons s ON s.id = sp.salon_id "
        f"{where_clause}"
    )
    cur.execute(count_sql, query_params)
    total = cur.fetchone()["cnt"]

    # Fetch specialists with salon name
    list_sql = (
        f"SELECT sp.id, sp.name, sp.email, sp.salon_id, s.name AS salon_name, "
        f"sp.experience_years, sp.training_status, sp.created_at "
        f"FROM specialists sp "
        f"LEFT JOIN salons s ON s.id = sp.salon_id "
        f"{where_clause} "
        f"ORDER BY sp.created_at DESC "
        f"LIMIT %s OFFSET %s"
    )
    cur.execute(list_sql, query_params + [per_page, offset])
    specialists = cur.fetchall()

    return respond(200, {
        "specialists": specialists,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page else 1,
    })


def handle_get_single(cur, specialist_id):
    """Один специалист со всеми полями и названием салона."""
    cur.execute(
        "SELECT sp.*, s.name AS salon_name "
        "FROM specialists sp "
        "LEFT JOIN salons s ON s.id = sp.salon_id "
        "WHERE sp.id = %s",
        (specialist_id,),
    )
    specialist = cur.fetchone()

    if not specialist:
        return respond(404, {"error": "Специалист не найден"})

    return respond(200, {"specialist": specialist})


def handle_post(cur, body):
    """Создание нового специалиста."""
    name = (body.get("name") or "").strip()
    if not name:
        return respond(400, {"error": "Имя специалиста обязательно"})

    fields = []
    values = []
    placeholders = []

    for key in ALLOWED_SPECIALIST_FIELDS:
        if key in body:
            fields.append(key)
            values.append(body[key])
            placeholders.append("%s")

    if not fields:
        return respond(400, {"error": "Нет данных для создания"})

    sql = (
        f"INSERT INTO specialists ({', '.join(fields)}) "
        f"VALUES ({', '.join(placeholders)}) "
        f"RETURNING *"
    )
    cur.execute(sql, values)
    specialist = cur.fetchone()

    return respond(201, {"specialist": specialist})


def recalc_salon_rating(cur, salon_id):
    """Пересчёт рейтинга салона: офлайн 100%=4.0, онлайн 100%=+0.5, техники учитываются в индексе."""
    if not salon_id:
        return
    cur.execute("SELECT COUNT(*) AS total FROM specialists WHERE salon_id = %s", (salon_id,))
    total = cur.fetchone()["total"]
    if total == 0:
        cur.execute("UPDATE salons SET rating = 0 WHERE id = %s", (salon_id,))
        return
    cur.execute(
        "SELECT COUNT(*) AS cnt FROM specialists WHERE salon_id = %s AND training_status IN ('offline_trained', 'in_progress', 'completed', 'certified')",
        (salon_id,),
    )
    offline = cur.fetchone()["cnt"]
    cur.execute(
        "SELECT COUNT(*) AS cnt FROM specialists WHERE salon_id = %s AND training_status IN ('completed', 'certified')",
        (salon_id,),
    )
    trained = cur.fetchone()["cnt"]
    offline_pct = offline / total * 100
    trained_pct = trained / total * 100
    rating_5 = (offline_pct / 100 * 4.0) + (trained_pct / 100 * 1.0)
    rating_5 = round(min(rating_5, 5.0), 1)
    cur.execute("UPDATE salons SET rating = %s WHERE id = %s", (rating_5, salon_id))


def handle_put(cur, body):
    """Обновление специалиста по id. Обновляются только переданные поля. Автопересчёт рейтинга салона."""
    specialist_id = body.get("id")
    if not specialist_id:
        return respond(400, {"error": "id специалиста обязателен"})

    status_changed = "training_status" in body

    updates = []
    values = []

    for key in ALLOWED_SPECIALIST_FIELDS:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key])

    if not updates:
        return respond(400, {"error": "Нет данных для обновления"})

    updates.append("updated_at = NOW()")
    values.append(specialist_id)

    sql = f"UPDATE specialists SET {', '.join(updates)} WHERE id = %s RETURNING *"
    cur.execute(sql, values)
    specialist = cur.fetchone()

    if not specialist:
        return respond(404, {"error": "Специалист не найден"})

    if status_changed and specialist.get("salon_id"):
        recalc_salon_rating(cur, specialist["salon_id"])

    return respond(200, {"specialist": specialist})


def handler(event: dict, context) -> dict:
    """CRUD-операции для управления специалистами: список, просмотр, создание, обновление."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn, cur = get_conn()

    if method == "GET":
        specialist_id = params.get("id")
        if specialist_id:
            result = handle_get_single(cur, int(specialist_id))
        else:
            result = handle_get_list(cur, params)
    elif method == "POST":
        body = json.loads(event.get("body") or "{}")
        result = handle_post(cur, body)
    elif method == "PUT":
        body = json.loads(event.get("body") or "{}")
        result = handle_put(cur, body)
    else:
        result = respond(405, {"error": "Метод не поддерживается"})

    cur.close()
    conn.close()
    return result