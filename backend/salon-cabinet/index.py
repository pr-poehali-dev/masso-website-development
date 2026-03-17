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
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Salon-Id",
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


def handle_dashboard(cur, salon_id):
    """Главная: индекс развития, показатели, обучение, посты."""
    cur.execute("SELECT * FROM salons WHERE id = %s", (salon_id,))
    salon = cur.fetchone()
    if not salon:
        return {"error": "Салон не найден"}

    cur.execute("SELECT * FROM salon_settings WHERE salon_id = %s", (salon_id,))
    settings = cur.fetchone()

    cur.execute("SELECT COUNT(*) AS total FROM specialists WHERE salon_id = %s", (salon_id,))
    total_specs = cur.fetchone()["total"]
    cur.execute("SELECT COUNT(*) AS cnt FROM specialists WHERE salon_id = %s AND training_status IN ('completed', 'certified')", (salon_id,))
    trained = cur.fetchone()["cnt"]
    s = settings or {}
    specs = int(s.get("specialists_count") or 1)
    cpd = int(s.get("clients_per_day") or 0)
    price = float(s.get("avg_price") or 0)
    days = int(s.get("working_days") or 22)
    course = float(s.get("procedure_course") or 1)
    dur = float(s.get("procedure_duration") or 1.5)
    hours = float(s.get("working_hours") or 8)

    revenue = cpd * price * days * specs
    clients = cpd * days * specs
    potential = clients * course * price
    lost = (course - 1) * price * clients if course > 1 else 0
    load = (cpd * dur / hours * 100) if hours > 0 else 0
    return_rate = 0
    dev_index = min((load + return_rate + (course / 5 * 100) + (potential / max(revenue, 1) * 25)) / 4, 100) if revenue > 0 else 0

    cur.execute("""
        SELECT id, title, body, category, created_at FROM content_posts
        WHERE status = 'published' ORDER BY is_pinned DESC, created_at DESC LIMIT 5
    """)
    posts = [dict(r) for r in cur.fetchall()]

    return {
        "salon": dict(salon),
        "settings": dict(s) if s else None,
        "metrics": {
            "dev_index": round(dev_index, 1),
            "revenue": revenue,
            "potential": potential,
            "lost_income": lost,
            "clients": clients,
            "specialist_load": round(load, 1),
        },
        "training": {
            "total": total_specs,
            "trained": trained,
        },
        "posts": posts,
    }


def handle_analytics(cur, salon_id, params):
    """Аналитика: метрики за периоды."""
    months = int(params.get("months", 1))
    cur.execute("""
        SELECT * FROM salon_metrics
        WHERE salon_id = %s AND period >= (CURRENT_DATE - INTERVAL '%s months')
        ORDER BY period
    """ % (salon_id, months))
    rows = [dict(r) for r in cur.fetchall()]

    cur.execute("SELECT * FROM salon_settings WHERE salon_id = %s", (salon_id,))
    settings = cur.fetchone()

    return {"metrics": rows, "settings": dict(settings) if settings else None}


def handle_specialists(cur, salon_id, method, body):
    """CRUD специалистов салона."""
    if method == "GET":
        cur.execute("""
            SELECT s.*, d.status AS access_status, d.issued_at
            FROM specialists s
            LEFT JOIN dok_dialog_access d ON d.specialist_id = s.id
            WHERE s.salon_id = %s ORDER BY s.id
        """, (salon_id,))
        return {"specialists": [dict(r) for r in cur.fetchall()]}

    if method == "POST":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip()
        if not name:
            return {"error": "Имя обязательно"}
        cur.execute(
            "INSERT INTO specialists (name, email, salon_id) VALUES (%s, %s, %s) RETURNING *",
            (name, email or None, salon_id),
        )
        return {"specialist": dict(cur.fetchone())}

    if method == "DELETE":
        spec_id = body.get("id")
        if spec_id:
            cur.execute("DELETE FROM dok_dialog_access WHERE specialist_id = %s AND salon_id = %s", (int(spec_id), salon_id))
            cur.execute("DELETE FROM specialists WHERE id = %s AND salon_id = %s", (int(spec_id), salon_id))
        return {"success": True}

    return {"error": "Method not supported"}


def handle_training(cur, salon_id):
    """Обучение: статус специалистов в Док Диалог."""
    cur.execute("""
        SELECT s.id, s.name, s.email, s.training_status,
               d.status AS access_status, d.password AS access_password, d.issued_at, d.activated_at
        FROM specialists s
        LEFT JOIN dok_dialog_access d ON d.specialist_id = s.id AND d.salon_id = %s
        WHERE s.salon_id = %s ORDER BY s.id
    """, (salon_id, salon_id))
    return {"specialists": [dict(r) for r in cur.fetchall()]}


def handle_knowledge(cur, params):
    """База знаний: статьи по категориям."""
    category = params.get("category")
    if category:
        cur.execute(
            "SELECT * FROM knowledge_articles WHERE is_published = true AND category = %s ORDER BY sort_order, created_at DESC",
            (category,),
        )
    else:
        cur.execute("SELECT * FROM knowledge_articles WHERE is_published = true ORDER BY sort_order, created_at DESC")
    return {"articles": [dict(r) for r in cur.fetchall()]}


def handle_rating(cur, salon_id):
    """Рейтинг салона: офлайн 100% = 4.0, онлайн завершили 100% = +1.0. Итого макс 5.0."""
    cur.execute("SELECT COUNT(*) AS total FROM specialists WHERE salon_id = %s", (salon_id,))
    total = cur.fetchone()["total"]
    cur.execute("SELECT COUNT(*) AS cnt FROM specialists WHERE salon_id = %s AND training_status IN ('offline_trained', 'in_progress', 'completed', 'certified')", (salon_id,))
    offline = cur.fetchone()["cnt"]
    cur.execute("SELECT COUNT(*) AS cnt FROM specialists WHERE salon_id = %s AND training_status IN ('completed', 'certified')", (salon_id,))
    trained = cur.fetchone()["cnt"]

    if total == 0:
        offline_pct = trained_pct = 0.0
    else:
        offline_pct = offline / total * 100
        trained_pct = trained / total * 100

    # Офлайн 100% -> 4.0 баллов
    # Онлайн завершено 100% -> +1.0
    rating_5 = (offline_pct / 100 * 4.0) + (trained_pct / 100 * 1.0)
    rating_5 = round(min(rating_5, 5.0), 1)
    rating_100 = round(rating_5 * 20, 1)

    status = "Участник"
    if rating_5 >= 5.0:
        status = "Профессиональный"
    elif rating_5 >= 4.5:
        status = "Сертифицирован"
    elif rating_5 >= 4.0:
        status = "Обучен"

    cur.execute("UPDATE salons SET rating = %s WHERE id = %s", (rating_5, salon_id))

    return {
        "rating": rating_5,
        "rating_100": rating_100,
        "offline_pct": round(offline_pct, 1),
        "trained_pct": round(trained_pct, 1),
        "status": status,
        "total_specialists": total,
        "offline_trained": offline,
        "trained": trained,
    }


def handle_profile(cur, salon_id, method, body):
    """Профиль салона: просмотр и обновление."""
    if method == "GET":
        cur.execute("SELECT * FROM salons WHERE id = %s", (salon_id,))
        salon = cur.fetchone()
        cur.execute("SELECT * FROM salon_settings WHERE salon_id = %s", (salon_id,))
        settings = cur.fetchone()
        return {"salon": dict(salon) if salon else None, "settings": dict(settings) if settings else None}

    if method == "PUT":
        salon_fields = []
        salon_vals = []
        for f in ["name", "city", "owner_name", "phone", "email", "description", "techniques"]:
            if f in body:
                salon_fields.append(f"{f} = %s")
                salon_vals.append(body[f])
        if salon_fields:
            salon_fields.append("updated_at = NOW()")
            salon_vals.append(salon_id)
            cur.execute(f"UPDATE salons SET {', '.join(salon_fields)} WHERE id = %s RETURNING *", salon_vals)

        settings_fields = []
        settings_vals = []
        for f in ["specialists_count", "clients_per_day", "avg_price", "working_days", "procedure_course", "procedure_duration", "working_hours"]:
            if f in body:
                settings_fields.append(f"{f} = %s")
                settings_vals.append(body[f])
        if settings_fields:
            settings_fields.append("updated_at = NOW()")
            settings_vals.append(salon_id)
            cur.execute(f"UPDATE salon_settings SET {', '.join(settings_fields)} WHERE salon_id = %s RETURNING *", settings_vals)

        cur.execute("SELECT * FROM salons WHERE id = %s", (salon_id,))
        salon = cur.fetchone()
        cur.execute("SELECT * FROM salon_settings WHERE salon_id = %s", (salon_id,))
        settings = cur.fetchone()
        return {"salon": dict(salon) if salon else None, "settings": dict(settings) if settings else None}

    return {"error": "Method not supported"}


def handle_diagnostics(cur, salon_id, method, body):
    """Диагностика салона: тест и результаты."""
    if method == "GET":
        cur.execute("SELECT * FROM salon_diagnostics WHERE salon_id = %s ORDER BY created_at DESC LIMIT 1", (salon_id,))
        d = cur.fetchone()
        return {"diagnostics": dict(d) if d else None}

    if method == "POST":
        q1 = int(body.get("q_client_return", 0))
        q2 = body.get("q_has_diagnostics", False)
        q3 = body.get("q_has_programs", False)
        q4 = int(body.get("q_procedures_per_client", 1))

        score = 0
        recs = []
        if q1 >= 50:
            score += 30
        elif q1 >= 30:
            score += 15
        else:
            recs.append("Низкий возврат клиентов. Рекомендуем внедрить систему напоминаний и программы лояльности.")

        if q2:
            score += 25
        else:
            recs.append("Нет диагностики. Внедрите первичную диагностику для повышения конверсии.")

        if q3:
            score += 25
        else:
            recs.append("Нет программ процедур. Разработайте курсовые программы для увеличения среднего чека.")

        if q4 >= 5:
            score += 20
        elif q4 >= 3:
            score += 10
        else:
            recs.append("Мало процедур на клиента. Рекомендуем работать над курсовостью.")

        recommendations = "\n".join(recs) if recs else "Отличные показатели! Продолжайте в том же духе."

        cur.execute(
            """INSERT INTO salon_diagnostics (salon_id, q_client_return, q_has_diagnostics, q_has_programs, q_procedures_per_client, result_index, recommendations)
               VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (salon_id, q1, q2, q3, q4, score, recommendations),
        )
        return {"diagnostics": dict(cur.fetchone())}

    return {"error": "Method not supported"}


def handler(event: dict, context) -> dict:
    """Универсальный бэкенд личного кабинета салона: дашборд, аналитика, специалисты, обучение, рейтинг, профиль, диагностика, база знаний."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    section = params.get("section", "dashboard")
    salon_id = params.get("salon_id")

    if not salon_id and method in ("POST", "PUT", "DELETE"):
        body_raw = json.loads(event.get("body") or "{}")
        salon_id = body_raw.get("salon_id") or params.get("salon_id")
    else:
        body_raw = {}

    if method in ("POST", "PUT", "DELETE") and not body_raw:
        body_raw = json.loads(event.get("body") or "{}")

    if not salon_id:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "salon_id обязателен"}}

    salon_id = int(salon_id)
    conn, cur = get_conn()

    handlers = {
        "dashboard": lambda: handle_dashboard(cur, salon_id),
        "analytics": lambda: handle_analytics(cur, salon_id, params),
        "specialists": lambda: handle_specialists(cur, salon_id, method, body_raw),
        "training": lambda: handle_training(cur, salon_id),
        "knowledge": lambda: handle_knowledge(cur, params),
        "rating": lambda: handle_rating(cur, salon_id),
        "profile": lambda: handle_profile(cur, salon_id, method, body_raw),
        "diagnostics": lambda: handle_diagnostics(cur, salon_id, method, body_raw),
    }

    fn = handlers.get(section)
    if not fn:
        cur.close()
        conn.close()
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": f"Неизвестный раздел: {section}"}}

    result = fn()
    cur.close()
    conn.close()

    status = 201 if method == "POST" and "error" not in result else (400 if "error" in result else 200)
    return {"statusCode": status, "headers": CORS_HEADERS, "body": serialize(result)}