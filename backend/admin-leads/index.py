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

ALLOWED_LEAD_FIELDS = {
    "name", "salon_name", "phone", "email",
    "source", "status", "comment",
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
    """Список лидов с пагинацией, фильтрами и поиском."""
    status_filter = params.get("status")
    search = params.get("search")
    page = int(params.get("page", 1))
    per_page = int(params.get("per_page", 20))
    offset = (page - 1) * per_page

    where_parts = []
    query_params = []

    if status_filter:
        where_parts.append("l.status = %s")
        query_params.append(status_filter)

    if search:
        where_parts.append(
            "(l.name ILIKE %s OR l.salon_name ILIKE %s OR l.phone ILIKE %s OR l.email ILIKE %s)"
        )
        like = f"%{search}%"
        query_params.extend([like, like, like, like])

    where_clause = ""
    if where_parts:
        where_clause = "WHERE " + " AND ".join(where_parts)

    # Count total
    count_sql = f"SELECT COUNT(*) AS cnt FROM leads l {where_clause}"
    cur.execute(count_sql, query_params)
    total = cur.fetchone()["cnt"]

    # Fetch leads
    list_sql = (
        f"SELECT l.* "
        f"FROM leads l "
        f"{where_clause} "
        f"ORDER BY l.created_at DESC "
        f"LIMIT %s OFFSET %s"
    )
    cur.execute(list_sql, query_params + [per_page, offset])
    leads = cur.fetchall()

    return respond(200, {
        "leads": leads,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page else 1,
    })


def handle_post(cur, body):
    """Создание нового лида."""
    name = (body.get("name") or "").strip()
    if not name:
        return respond(400, {"error": "Имя лида обязательно"})

    fields = []
    values = []
    placeholders = []

    for key in ALLOWED_LEAD_FIELDS:
        if key in body:
            fields.append(key)
            values.append(body[key])
            placeholders.append("%s")

    if not fields:
        return respond(400, {"error": "Нет данных для создания"})

    sql = (
        f"INSERT INTO leads ({', '.join(fields)}) "
        f"VALUES ({', '.join(placeholders)}) "
        f"RETURNING *"
    )
    cur.execute(sql, values)
    lead = cur.fetchone()

    return respond(201, {"lead": lead})


def handle_put(cur, body):
    """Обновление лида по id. Обновляются только переданные поля."""
    lead_id = body.get("id")
    if not lead_id:
        return respond(400, {"error": "id лида обязателен"})

    updates = []
    values = []

    for key in ALLOWED_LEAD_FIELDS:
        if key in body:
            updates.append(f"{key} = %s")
            values.append(body[key])

    if not updates:
        return respond(400, {"error": "Нет данных для обновления"})

    updates.append("updated_at = NOW()")
    values.append(lead_id)

    sql = f"UPDATE leads SET {', '.join(updates)} WHERE id = %s RETURNING *"
    cur.execute(sql, values)
    lead = cur.fetchone()

    if not lead:
        return respond(404, {"error": "Лид не найден"})

    return respond(200, {"lead": lead})


def handler(event: dict, context) -> dict:
    """CRUD-операции для управления лидами: список, создание, обновление."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn, cur = get_conn()

    if method == "GET":
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
