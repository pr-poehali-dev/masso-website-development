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

ALLOWED_SALON_FIELDS = {
    "name", "city", "owner_name", "phone", "email",
    "description", "techniques", "tariff", "status",
    "rating", "is_published", "inspection_date", "full_access",
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
    """Список салонов с пагинацией, фильтрами и поиском."""
    status_filter = params.get("status")
    search = params.get("search")
    page = int(params.get("page", 1))
    per_page = int(params.get("per_page", 20))
    offset = (page - 1) * per_page

    where_parts = []
    query_params = []

    if status_filter:
        where_parts.append("s.status = %s")
        query_params.append(status_filter)

    if search:
        where_parts.append(
            "(s.name ILIKE %s OR s.city ILIKE %s OR s.owner_name ILIKE %s OR s.email ILIKE %s)"
        )
        like = f"%{search}%"
        query_params.extend([like, like, like, like])

    where_clause = ""
    if where_parts:
        where_clause = "WHERE " + " AND ".join(where_parts)

    # Count total
    count_sql = f"SELECT COUNT(*) AS cnt FROM salons s {where_clause}"
    cur.execute(count_sql, query_params)
    total = cur.fetchone()["cnt"]

    # Fetch salons with specialist count
    list_sql = (
        f"SELECT s.*, COUNT(sp.id) AS specialist_count "
        f"FROM salons s "
        f"LEFT JOIN specialists sp ON sp.salon_id = s.id "
        f"{where_clause} "
        f"GROUP BY s.id "
        f"ORDER BY s.created_at DESC "
        f"LIMIT %s OFFSET %s"
    )
    cur.execute(list_sql, query_params + [per_page, offset])
    salons = cur.fetchall()

    return respond(200, {
        "salons": salons,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page else 1,
    })


def handle_get_single(cur, salon_id):
    """Один салон со специалистами, комментариями и доступами."""
    cur.execute("SELECT * FROM salons WHERE id = %s", (salon_id,))
    salon = cur.fetchone()

    if not salon:
        return respond(404, {"error": "Салон не найден"})

    cur.execute(
        "SELECT id, name, email, experience_years, training_status, created_at "
        "FROM specialists WHERE salon_id = %s ORDER BY created_at DESC",
        (salon_id,),
    )
    specialists = cur.fetchall()

    cur.execute(
        "SELECT sc.id, sc.text, sc.created_at, au.name AS author_name "
        "FROM salon_comments sc "
        "LEFT JOIN admin_users au ON au.id = sc.author_id "
        "WHERE sc.salon_id = %s ORDER BY sc.created_at DESC",
        (salon_id,),
    )
    comments = cur.fetchall()

    cur.execute(
        "SELECT id, specialist_id, email, status, issued_at, activated_at "
        "FROM dok_dialog_access WHERE salon_id = %s ORDER BY issued_at DESC",
        (salon_id,),
    )
    access_list = cur.fetchall()

    salon["specialists"] = specialists
    salon["comments"] = comments
    salon["access_list"] = access_list

    return respond(200, {"salon": salon})


def handle_post(cur, body):
    """Создание нового салона."""
    name = (body.get("name") or "").strip()
    if not name:
        return respond(400, {"error": "Название салона обязательно"})

    fields = []
    values = []
    placeholders = []

    for key in ALLOWED_SALON_FIELDS:
        if key in body:
            fields.append(key)
            values.append(body[key])
            placeholders.append("%s")

    if not fields:
        return respond(400, {"error": "Нет данных для создания"})

    sql = (
        f"INSERT INTO salons ({', '.join(fields)}) "
        f"VALUES ({', '.join(placeholders)}) "
        f"RETURNING *"
    )
    cur.execute(sql, values)
    salon = cur.fetchone()

    return respond(201, {"salon": salon})


def handle_delete(cur, params):
    """Удаление салона по id."""
    salon_id = params.get("id")
    if not salon_id:
        return respond(400, {"error": "id салона обязателен"})

    cur.execute("DELETE FROM salons WHERE id = %s RETURNING id", (int(salon_id),))
    row = cur.fetchone()
    if not row:
        return respond(404, {"error": "Салон не найден"})

    return respond(200, {"deleted_id": row["id"]})


def handle_put(cur, body):
    """Обновление салона по id. Обновляются только переданные поля."""
    salon_id = body.get("id")
    if not salon_id:
        return respond(400, {"error": "id салона обязателен"})

    updates = []
    values = []

    for key in ALLOWED_SALON_FIELDS:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key])

    if not updates:
        return respond(400, {"error": "Нет данных для обновления"})

    updates.append("updated_at = NOW()")
    values.append(salon_id)

    sql = f"UPDATE salons SET {', '.join(updates)} WHERE id = %s RETURNING *"
    cur.execute(sql, values)
    salon = cur.fetchone()

    if not salon:
        return respond(404, {"error": "Салон не найден"})

    return respond(200, {"salon": salon})


def handler(event: dict, context) -> dict:
    """CRUD-операции для управления салонами: список, просмотр, создание, обновление."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn, cur = get_conn()

    if method == "GET":
        salon_id = params.get("id")
        if salon_id:
            result = handle_get_single(cur, int(salon_id))
        else:
            result = handle_get_list(cur, params)
    elif method == "POST":
        body = json.loads(event.get("body") or "{}")
        result = handle_post(cur, body)
    elif method == "PUT":
        body = json.loads(event.get("body") or "{}")
        result = handle_put(cur, body)
    elif method == "DELETE":
        result = handle_delete(cur, params)
    else:
        result = respond(405, {"error": "Метод не поддерживается"})

    cur.close()
    conn.close()
    return result