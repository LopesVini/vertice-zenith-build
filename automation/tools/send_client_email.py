from tools.utils import log_error, send_email_api


def send_client_email(record: dict, body: str):
    nome = record.get("nome", "")
    email_destino = record.get("email", "")
    if not email_destino:
        return
        
    primeiro_nome = nome.split()[0] if nome else "cliente"
    subject = f"Recebemos seu pedido de orçamento, {primeiro_nome}!"

    body_html = body.replace("\n", "<br>")
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#1a1a2e;padding:32px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:2px;">VERTICIE</h1>
            <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px;">Engenharia Civil · Projetos Residenciais</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;color:#333333;font-size:15px;line-height:1.7;">
            {body_html}
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
            <p style="color:#999999;font-size:12px;margin:0;">
              BH · Nova Lima · Contagem &nbsp;|&nbsp; verticeprojetos7@gmail.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    try:
        send_email_api(email_destino, subject, html, body)
    except Exception as e:
        log_error(f"send_client_email falhou para {email_destino}: {e}")
        if hasattr(e, "response") and e.response is not None:
            log_error(f"Detalhes: {e.response.text}")
