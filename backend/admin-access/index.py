import json
import os
import string
import random
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

ALLOWED_ACCESS_FIELDS = {
    "specialist_id", "salon_id", "email", "status",
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
    """Список записей доступа с пагинацией, фильтрами и поиском."""
    status_filter = params.get("status")
    search = params.get("search")
    page = int(params.get("page", 1))
    per_page = int(params.get("per_page", 20))
    offset = (page - 1) * per_page

    where_parts = []
    query_params = []

    if status_filter:
        where_parts.append("da.status = %s")
        query_params.append(status_filter)

    if search:
        where_parts.append(
            "(sp.name ILIKE %s OR da.email ILIKE %s OR s.name ILIKE %s)"
        )
        like = f"%{search}%"
        query_params.extend([like, like, like])

    where_clause = ""
    if where_parts:
        where_clause = "WHERE " + " AND ".join(where_parts)

    # Count total
    count_sql = (
        f"SELECT COUNT(*) AS cnt "
        f"FROM dok_dialog_access da "
        f"LEFT JOIN specialists sp ON sp.id = da.specialist_id "
        f"LEFT JOIN salons s ON s.id = da.salon_id "
        f"{where_clause}"
    )
    cur.execute(count_sql, query_params)
    total = cur.fetchone()["cnt"]

    # Fetch access records with specialist and salon names
    list_sql = (
        f"SELECT da.id, da.specialist_id, sp.name AS specialist_name, "
        f"da.email, da.salon_id, s.name AS salon_name, "
        f"da.status, da.issued_at, da.activated_at "
        f"FROM dok_dialog_access da "
        f"LEFT JOIN specialists sp ON sp.id = da.specialist_id "
        f"LEFT JOIN salons s ON s.id = da.salon_id "
        f"{where_clause} "
        f"ORDER BY da.issued_at DESC "
        f"LIMIT %s OFFSET %s"
    )
    cur.execute(list_sql, query_params + [per_page, offset])
    access = cur.fetchall()

    return respond(200, {
        "access": access,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page else 1,
    })


def handle_post(cur, body):
    """Создание новой записи доступа."""
    email = (body.get("email") or "").strip()
    if not email:
        return respond(400, {"error": "Email обязателен"})

    # If specialist_id provided but no salon_id, auto-fill from specialist
    specialist_id = body.get("specialist_id")
    if specialist_id and not body.get("salon_id"):
        cur.execute("SELECT salon_id FROM specialists WHERE id = %s", (specialist_id,))
        spec = cur.fetchone()
        if spec and spec["salon_id"]:
            body["salon_id"] = spec["salon_id"]

    fields = []
    values = []
    placeholders = []

    for key in ALLOWED_ACCESS_FIELDS:
        if key in body:
            fields.append(key)
            values.append(body[key])
            placeholders.append("%s")

    if not fields:
        return respond(400, {"error": "Нет данных для создания"})

    sql = (
        f"INSERT INTO dok_dialog_access ({', '.join(fields)}) "
        f"VALUES ({', '.join(placeholders)}) "
        f"RETURNING *"
    )
    cur.execute(sql, values)
    access = cur.fetchone()

    return respond(201, {"access": access})


def handle_put(cur, body):
    """Обновление записи доступа по id."""
    access_id = body.get("id")
    if not access_id:
        return respond(400, {"error": "id записи доступа обязателен"})

    updates = []
    values = []

    # When status changes to 'activated', auto-set activated_at if not provided
    if body.get("status") == "activated" and "activated_at" not in body:
        body["activated_at"] = None  # Will use NOW() below

    allowed_update_fields = {"status", "activated_at"}

    for key in allowed_update_fields:
        if key in body:
            if key == "activated_at" and body[key] is None and body.get("status") == "activated":
                updates.append("activated_at = NOW()")
            else:
                updates.append(f"{key} = %s")
                values.append(body[key])

    if not updates:
        return respond(400, {"error": "Нет данных для обновления"})

    values.append(access_id)

    sql = f"UPDATE dok_dialog_access SET {', '.join(updates)} WHERE id = %s RETURNING *"
    cur.execute(sql, values)
    access = cur.fetchone()

    if not access:
        return respond(404, {"error": "Запись доступа не найдена"})

    return respond(200, {"access": access})


def handler(event: dict, context) -> dict:
    """CRUD-операции для управления доступами Dok Dialog: список, создание, обновление."""
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