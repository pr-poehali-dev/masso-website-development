import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с формы пакета МассоПРО на почту massopro@mail.ru"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")

    # Обязательные поля
    salon_name = body.get("salonName", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    package = body.get("package", "").strip()

    if not salon_name or not phone or not email:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Название, телефон и email обязательны"}),
        }

    # Опциональные поля
    city = body.get("city", "")
    contact_name = body.get("contactName", "")
    salons_count = body.get("salonsCount", "")
    cities_count = body.get("citiesCount", "")

    # Показатели
    metrics_map = {
        "masters": "Мастеров",
        "workDays": "Рабочих дней в месяц",
        "maxClients": "Макс. клиентов/день на мастера",
        "factClients": "Факт. клиентов/день на мастера",
        "avgCheck": "Средний чек, ₽",
        "totalClients": "Клиентов в месяц",
        "returnRate": "Возврат клиентов, %",
        "targetCheck": "Целевой средний чек, ₽",
        "plannedLoad": "Плановая загрузка, %",
        "newMasters": "Новые мастера (+)",
        "clientGrowth": "Рост клиентов от ускорения, %",
    }

    metrics_rows = ""
    for key, label in metrics_map.items():
        val = body.get(key, "").strip()
        if val:
            metrics_rows += f"<tr><td style='padding:4px 8px;color:#666'>{label}</td><td style='padding:4px 8px;font-weight:600'>{val}</td></tr>"

    network_rows = ""
    if salons_count:
        network_rows += f"<tr><td style='padding:4px 8px;color:#666'>Салонов в сети</td><td style='padding:4px 8px;font-weight:600'>{salons_count}</td></tr>"
    if cities_count:
        network_rows += f"<tr><td style='padding:4px 8px;color:#666'>Городов присутствия</td><td style='padding:4px 8px;font-weight:600'>{cities_count}</td></tr>"

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0e7490;border-bottom:2px solid #0e7490;padding-bottom:8px">
        Новая заявка с сайта МассоПРО
      </h2>
      <p style="background:#f0f9ff;padding:10px 14px;border-radius:8px;font-size:15px;margin-bottom:16px">
        <b>Пакет:</b> {package or '—'}
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:4px 8px;color:#666">Название салона / сети</td><td style="padding:4px 8px;font-weight:600">{salon_name}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Город</td><td style="padding:4px 8px;font-weight:600">{city or '—'}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Контактное лицо</td><td style="padding:4px 8px;font-weight:600">{contact_name or '—'}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Телефон</td><td style="padding:4px 8px;font-weight:600">{phone}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px;font-weight:600">{email}</td></tr>
        {network_rows}
      </table>
      {"<h3 style='color:#374151;margin-bottom:8px'>Показатели салона</h3><table style='width:100%;border-collapse:collapse'>" + metrics_rows + "</table>" if metrics_rows else ""}
    </div>
    """

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    sender = "massopro@mail.ru"
    recipient = "massopro@mail.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Заявка «{package}» — {salon_name} ({phone})"
    msg["From"] = sender
    msg["To"] = recipient
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True}),
    }
