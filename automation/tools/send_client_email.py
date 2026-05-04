from tools.utils import log_error, send_email_api


def send_client_email(record: dict, body: str):
    nome = record.get("nome", "")
    email_destino = record.get("email", "")
    if not email_destino:
        return
        
    primeiro_nome = nome.split()[0] if nome else "cliente"
    subject = f"Recebemos seu pedido de orçamento, {primeiro_nome}!"

    html_content = body.replace("\n", "<br>")
    html = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F5F9; margin: 0; padding: 40px 20px;">
      <center>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin: 0 auto;">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 3px;">VÉRTICE</h1>
              <p style="color: #BFDBFE; margin: 10px 0 0; font-size: 14px; font-weight: 500; letter-spacing: 1px;">ENGENHARIA & PROJETOS</p>
            </td>
          </tr>

          <!-- CONTEÚDO DA IA -->
          <tr>
            <td style="padding: 40px 30px 20px; color: #334155; font-size: 16px; line-height: 1.7;">
              {html_content}
            </td>
          </tr>

          <!-- DIVISOR -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background-color: #E2E8F0; width: 100%;"></div>
            </td>
          </tr>

          <!-- SERVIÇOS -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="font-size: 16px; color: #64748B; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px;">Nossas Especialidades</h2>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; border: 1px solid #F1F5F9;">
                <tr>
                  <td width="30" style="font-size: 18px;">🏗️</td>
                  <td style="font-size: 15px; color: #0F172A; font-weight: 600;">Projetos Arquitetônicos & Estruturais</td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; border: 1px solid #F1F5F9;">
                <tr>
                  <td width="30" style="font-size: 18px;">📐</td>
                  <td style="font-size: 15px; color: #0F172A; font-weight: 600;">Design de Interiores & Planejamento</td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; padding: 16px 20px; border: 1px solid #F1F5F9;">
                <tr>
                  <td width="30" style="font-size: 18px;">📋</td>
                  <td style="font-size: 15px; color: #0F172A; font-weight: 600;">Gerenciamento de Obras & Execução</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA PRETO (ESTILO REFERÊNCIA) -->
          <tr>
            <td style="padding: 10px 30px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; border-radius: 20px; padding: 40px 20px; text-align: center;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff; margin: 0 0 12px; font-size: 22px; font-weight: 700;">Pronto para construir?</h3>
                    <p style="color: #94A3B8; margin: 0 0 25px; font-size: 15px;">Fale agora mesmo com um engenheiro no WhatsApp e dê o próximo passo.</p>
                    <a href="https://api.whatsapp.com/send?phone=5531985981606&text=Ol%C3%A1%21%20Recebi%20o%20e-mail%20da%20Vertice%20e%20gostaria%20de%20falar%20sobre%20o%20meu%20projeto." 
                       style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 100px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                      Conversar no WhatsApp ↗
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.6;">
                <strong>Vertice Engenharia</strong><br>
                Belo Horizonte, Nova Lima e Contagem<br><br>
                Este é um e-mail automático. Caso não tenha solicitado, pode ignorar esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </center>
    </body>
    </html>
    """

    try:
        send_email_api(email_destino, subject, html, body)
    except Exception as e:
        log_error(f"send_client_email falhou para {email_destino}: {e}")
        if hasattr(e, "response") and e.response is not None:
            log_error(f"Detalhes: {e.response.text}")
