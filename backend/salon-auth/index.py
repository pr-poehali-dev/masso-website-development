import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date
from decimal import Decimal

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def serialize(obj):
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
    return conn, conn.cursor(cursor_factory=RealDictCursor)


def handler(event: dict, context) -> dict:
    """Авторизация салона: вход по email+пароль, регистрация нового салона."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": {"status": "ok"}}

    if method != "POST":
        return {"statusCode": 405, "headers": CORS_HEADERS, "body": {"error": "Метод не поддерживается"}}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "login")

    conn, cur = get_conn()

    if action == "register":
        email = (body.get("email") or "").strip().lower()
        password = (body.get("password") or "").strip()
        salon_name = (body.get("salon_name") or "").strip()
        owner_name = (body.get("owner_name") or "").strip()
        city = (body.get("city") or "").strip()
        phone = (body.get("phone") or "").strip()

        if not email or not password or not salon_name:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"success": False, "error": "Email, пароль и название салона обязательны"}}

        cur.execute("SELECT id FROM salon_users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"success": False, "error": "Email уже зарегистрирован"}}

        password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

        cur.execute(
            "INSERT INTO salons (name, city, owner_name, phone, email, status) VALUES (%s, %s, %s, %s, %s, 'new') RETURNING id",
            (salon_name, city or None, owner_name or None, phone or None, email),
        )
        salon_id = cur.fetchone()["id"]

        cur.execute(
            "INSERT INTO salon_users (salon_id, email, password_hash, name, role) VALUES (%s, %s, %s, %s, 'owner') RETURNING id",
            (salon_id, email, password_hash, owner_name or salon_name),
        )
        user_id = cur.fetchone()["id"]

        cur.execute(
            "INSERT INTO salon_settings (salon_id) VALUES (%s)",
            (salon_id,),
        )

        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": CORS_HEADERS, "body": serialize({
            "success": True,
            "user": {"id": user_id, "email": email, "name": owner_name or salon_name, "role": "owner", "salon_id": salon_id},
            "salon": {"id": salon_id, "name": salon_name, "status": "new"},
        })}

    email = (body.get("email") or "").strip().lower()
    password = (body.get("password") or "").strip()

    if not email or not password:
        cur.close()
        conn.close()
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"success": False, "error": "Email и пароль обязательны"}}

    password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

    cur.execute(
        "SELECT su.id, su.email, su.name, su.role, su.password_hash, su.is_active, su.salon_id FROM salon_users su WHERE su.email = %s",
        (email,),
    )
    user = cur.fetchone()

    if not user:
        cur.close()
        conn.close()
        return {"statusCode": 401, "headers": CORS_HEADERS, "body": {"success": False, "error": "Неверный email или пароль"}}

    if not user["is_active"]:
        cur.close()
        conn.close()
        return {"statusCode": 403, "headers": CORS_HEADERS, "body": {"success": False, "error": "Аккаунт деактивирован"}}

    if user["password_hash"] != password_hash:
        cur.close()
        conn.close()
        return {"statusCode": 401, "headers": CORS_HEADERS, "body": {"success": False, "error": "Неверный email или пароль"}}

    cur.execute("SELECT id, name, status, tariff FROM salons WHERE id = %s", (user["salon_id"],))
    salon = cur.fetchone()

    cur.close()
    conn.close()

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({
        "success": True,
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"], "salon_id": user["salon_id"]},
        "salon": dict(salon) if salon else None,
    })}
