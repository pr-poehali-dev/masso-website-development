import json
import os
from datetime import date, datetime
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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


def handler(event: dict, context) -> dict:
    """Возвращает агрегированную статистику для дашборда админ-панели."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if event.get("httpMethod") != "GET":
        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": {"error": "Метод не поддерживается"},
        }

    conn, cur = get_conn()

    # Total salons
    cur.execute("SELECT COUNT(*) AS cnt FROM salons")
    total_salons = cur.fetchone()["cnt"]

    # Connected salons
    cur.execute("SELECT COUNT(*) AS cnt FROM salons WHERE status = 'connected'")
    connected_salons = cur.fetchone()["cnt"]

    # Total specialists
    cur.execute("SELECT COUNT(*) AS cnt FROM specialists")
    total_specialists = cur.fetchone()["cnt"]

    # Total access
    cur.execute("SELECT COUNT(*) AS cnt FROM dok_dialog_access")
    total_access = cur.fetchone()["cnt"]

    # Total calculations
    cur.execute("SELECT COALESCE(SUM(calculations_count), 0) AS total FROM analytics")
    total_calculations = cur.fetchone()["total"]

    # Total tests
    cur.execute("SELECT COALESCE(SUM(tests_count), 0) AS total FROM analytics")
    total_tests = cur.fetchone()["total"]

    # Recent leads
    cur.execute(
        "SELECT id, name, salon_name, phone, status, created_at "
        "FROM leads ORDER BY created_at DESC LIMIT 5"
    )
    recent_leads = cur.fetchall()

    # Recent salons
    cur.execute(
        "SELECT id, name, city, status, created_at "
        "FROM salons ORDER BY created_at DESC LIMIT 5"
    )
    recent_salons = cur.fetchall()

    # Recent specialists
    cur.execute(
        "SELECT id, name, training_status, created_at "
        "FROM specialists ORDER BY created_at DESC LIMIT 5"
    )
    recent_specialists = cur.fetchall()

    cur.close()
    conn.close()

    result = {
        "total_salons": total_salons,
        "connected_salons": connected_salons,
        "total_specialists": total_specialists,
        "total_access": total_access,
        "total_calculations": int(total_calculations),
        "total_tests": int(total_tests),
        "recent_leads": serialize(recent_leads),
        "recent_salons": serialize(recent_salons),
        "recent_specialists": serialize(recent_specialists),
    }

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": result,
    }
