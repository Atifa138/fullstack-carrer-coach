"""Email sending for account verification.

Sends via SMTP with STARTTLS.  When EMAIL_ENABLED=false (the default) this
module is a no-op so the app works without any mail credentials.
"""
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .config import settings


def send_verification_email(to_email: str, token: str) -> None:
    if not settings.email_enabled:
        return

    verify_url = f"{settings.app_base_url}/verify-email?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Verify your CareerCoach AI account"
    msg["From"] = settings.smtp_from
    msg["To"] = to_email

    text_body = (
        f"Hi,\n\nVerify your CareerCoach AI account by visiting:\n{verify_url}\n\n"
        "If you didn't create this account you can ignore this email."
    )
    html_body = f"""<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:40px auto;padding:0 24px;color:#141228">
  <div style="margin-bottom:24px">
    <span style="font-weight:800;font-size:1.1rem">career<span style="color:#6c47ff">coach</span><span style="color:#ff6b5e">.</span></span>
  </div>
  <h2 style="margin:0 0 12px;color:#141228">Verify your email address</h2>
  <p style="color:#3d3a5c;margin:0 0 24px">
    Click the button below to activate your account. The link expires after 24 hours.
  </p>
  <a href="{verify_url}"
     style="display:inline-block;background:#6c47ff;color:#fff;padding:13px 28px;
            border-radius:10px;text-decoration:none;font-weight:600;font-size:0.95rem">
    Verify Email →
  </a>
  <p style="margin:24px 0 8px;color:#6b6880;font-size:0.85rem">
    Or paste this link into your browser:
  </p>
  <p style="word-break:break-all;color:#6c47ff;font-size:0.8rem">{verify_url}</p>
  <hr style="border:none;border-top:1px solid #ede8ff;margin:32px 0">
  <p style="color:#9896a8;font-size:0.75rem">
    If you didn't create a CareerCoach AI account you can safely ignore this email.
  </p>
</body>
</html>"""

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    ctx = ssl.create_default_context()
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.ehlo()
        server.starttls(context=ctx)
        server.login(settings.smtp_username, settings.smtp_password)
        server.sendmail(settings.smtp_from, to_email, msg.as_string())
