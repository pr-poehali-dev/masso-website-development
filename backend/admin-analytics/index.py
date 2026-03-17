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
    """Возвращает аналитику: сводные метрики и данные по салонам за периоды."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if event.get("httpMethod") != "GET":
        return {"statusCode": 405, "headers": CORS_HEADERS, "body": {"error": "Method not allowed"}}

    params = event.get("queryStringParameters") or {}
    salon_id = params.get("salon_id")

    conn, cur = get_conn()

    cur.execute("SELECT COUNT(*) AS cnt FROM salons")
    total_salons = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM salons WHERE status = 'connected'")
    connected = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM salons WHERE status = 'training'")
    training = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM salons WHERE status = 'certified'")
    certified = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM specialists")
    total_specs = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM specialists WHERE training_status = 'certified'")
    certified_specs = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM dok_dialog_access WHERE status = 'activated'")
    active_access = cur.fetchone()["cnt"]

    cur.execute("SELECT COUNT(*) AS cnt FROM leads WHERE status = 'new'")
    new_leads = cur.fetchone()["cnt"]

    cur.execute("""
        SELECT status, COUNT(*) AS cnt FROM salons GROUP BY status ORDER BY cnt DESC
    """)
    salon_by_status = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT training_status, COUNT(*) AS cnt FROM specialists GROUP BY training_status ORDER BY cnt DESC
    """)
    specs_by_status = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT s.name AS salon_name, s.city, s.status,
               COUNT(sp.id) AS specialist_count,
               s.rating
        FROM salons s
        LEFT JOIN specialists sp ON sp.salon_id = s.id
        GROUP BY s.id, s.name, s.city, s.status, s.rating
        ORDER BY s.rating DESC
        LIMIT 10
    """)
    top_salons = [dict(r) for r in cur.fetchall()]

    analytics_rows = []
    if salon_id:
        cur.execute("""
            SELECT * FROM analytics WHERE salon_id = %s ORDER BY period_start DESC LIMIT 12
        """, (int(salon_id),))
        analytics_rows = [dict(r) for r in cur.fetchall()]
    else:
        cur.execute("""
            SELECT
                COALESCE(SUM(revenue), 0) AS total_revenue,
                COALESCE(AVG(avg_check), 0) AS avg_check,
                COALESCE(AVG(specialist_load), 0) AS avg_load,
                COALESCE(AVG(client_return_rate), 0) AS avg_return,
                COALESCE(SUM(calculations_count), 0) AS total_calcs,
                COALESCE(SUM(tests_count), 0) AS total_tests
            FROM analytics
        """)
        row = cur.fetchone()
        analytics_rows = [dict(row)] if row else []

    cur.execute("""
        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
        FROM leads
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY day
    """)
    leads_by_day = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
        FROM salons
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY day
    """)
    salons_by_day = [dict(r) for r in cur.fetchall()]

    cur.close()
    conn.close()

    result = serialize({
        "summary": {
            "total_salons": total_salons,
            "connected": connected,
            "training": training,
            "certified": certified,
            "total_specialists": total_specs,
            "certified_specialists": certified_specs,
            "active_access": active_access,
            "new_leads": new_leads,
        },
        "salon_by_status": salon_by_status,
        "specs_by_status": specs_by_status,
        "top_salons": top_salons,
        "analytics": analytics_rows,
        "leads_by_day": leads_by_day,
        "salons_by_day": salons_by_day,
    })

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": result}
