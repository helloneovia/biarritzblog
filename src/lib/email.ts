import { Resend } from 'resend'

// Lazy-init: do NOT call new Resend() at module level — it crashes during Next.js static build
// because RESEND_API_KEY is not available at build time.
const getResend = () => new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'Biarritz <no-reply@biarritz.blog>'

export async function sendAccountCreatedEmail({
  email,
  name,
  tempPassword,
  orderId,
}: {
  email: string
  name: string
  tempPassword: string
  orderId: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email')
    return
  }
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🎉 Votre compte Biarritz a été créé',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; margin:0; padding:0;">
  <div style="max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding:40px 32px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:28px; font-weight:800;">Biarritz</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Semelles Orthopédiques Premium</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#1e293b; font-size:22px; margin:0 0 16px;">Bienvenue, ${name} ! 👋</h2>
      <p style="color:#64748b; line-height:1.7; margin:0 0 24px;">
        Votre paiement a bien été reçu et votre commande <strong style="color:#1e293b;">#${orderId}</strong> est en cours de traitement.
        Un compte client a automatiquement été créé pour vous permettre de suivre votre commande.
      </p>

      <div style="background:#f1f5f9; border-radius:12px; padding:24px; margin:0 0 24px;">
        <p style="color:#475569; font-size:13px; font-weight:600; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.05em;">Vos identifiants de connexion</p>
        <div style="display:flex; justify-content:space-between; margin:0 0 12px;">
          <span style="color:#64748b; font-size:14px;">Email :</span>
          <span style="color:#1e293b; font-weight:600; font-size:14px;">${email}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748b; font-size:14px;">Mot de passe temporaire :</span>
          <span style="color:#4f46e5; font-weight:700; font-size:14px; font-family:monospace;">${tempPassword}</span>
        </div>
      </div>

      <p style="color:#94a3b8; font-size:13px; margin:0 0 28px;">
        ⚠️ Pensez à modifier votre mot de passe après votre première connexion dans les Paramètres de votre profil.
      </p>

      <a href="https://biarritz.blog/login" style="display:block; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:#fff; text-align:center; padding:14px 24px; border-radius:10px; font-weight:700; font-size:15px; text-decoration:none;">
        Accéder à mon espace client →
      </a>
    </div>
    <div style="background:#f8fafc; padding:24px 32px; text-align:center; border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8; font-size:12px; margin:0;">© ${new Date().getFullYear()} Biarritz · <a href="https://biarritz.blog" style="color:#6366f1;">biarritz.blog</a></p>
    </div>
  </div>
</body>
</html>`,
    })
    console.log(`Account creation email sent to ${email}`)
  } catch (err) {
    console.error('Failed to send account creation email:', err)
  }
}

export async function sendOrderConfirmationEmail({
  email,
  name,
  orderId,
  orderItems,
  totalAmount,
  address,
}: {
  email: string
  name: string
  orderId: string
  orderItems: Array<{ name: string; quantity: number; price: number; size?: string }>
  totalAmount: number
  address: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email')
    return
  }
  const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding:12px 0; color:#1e293b; font-size:14px;">${item.name}${item.size ? ` (${item.size})` : ''}</td>
        <td style="padding:12px 0; color:#64748b; font-size:14px; text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0; color:#1e293b; font-size:14px; text-align:right; font-weight:600;">${(item.price * item.quantity).toFixed(2)} €</td>
      </tr>
    `).join('')

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `✅ Confirmation de commande #${orderId}`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; margin:0; padding:0;">
  <div style="max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding:40px 32px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:28px; font-weight:800;">Biarritz</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Confirmation de Commande</p>
    </div>
    <div style="padding:40px 32px;">
      <div style="display:flex; align-items:center; gap:12px; margin:0 0 24px;">
        <div style="width:48px; height:48px; background:#d1fae5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px;">✅</div>
        <div>
          <h2 style="color:#1e293b; font-size:20px; margin:0; font-weight:700;">Merci ${name} !</h2>
          <p style="color:#64748b; font-size:14px; margin:4px 0 0;">Votre commande a bien été reçue.</p>
        </div>
      </div>

      <div style="background:#f8fafc; border-radius:12px; padding:20px; margin:0 0 24px;">
        <p style="color:#475569; font-size:12px; font-weight:700; margin:0 0 12px; text-transform:uppercase;">Commande #${orderId}</p>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <th style="padding:8px 0; color:#94a3b8; font-size:12px; text-align:left; font-weight:600;">Produit</th>
              <th style="padding:8px 0; color:#94a3b8; font-size:12px; text-align:center; font-weight:600;">Qté</th>
              <th style="padding:8px 0; color:#94a3b8; font-size:12px; text-align:right; font-weight:600;">Prix</th>
            </tr>
          </thead>
          <tbody style="border-top:1px solid #e2e8f0;">
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid #e2e8f0;">
              <td colspan="2" style="padding:12px 0; color:#1e293b; font-weight:700; font-size:15px;">Total</td>
              <td style="padding:12px 0; color:#4f46e5; font-weight:800; font-size:16px; text-align:right;">${totalAmount.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background:#f1f5f9; border-radius:12px; padding:16px; margin:0 0 28px;">
        <p style="color:#475569; font-size:12px; font-weight:700; margin:0 0 4px; text-transform:uppercase;">Livraison à</p>
        <p style="color:#1e293b; font-size:14px; margin:0;">${address}</p>
      </div>

      <a href="https://biarritz.blog/dashboard" style="display:block; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:#fff; text-align:center; padding:14px 24px; border-radius:10px; font-weight:700; font-size:15px; text-decoration:none;">
        Suivre ma commande →
      </a>
    </div>
    <div style="background:#f8fafc; padding:24px 32px; text-align:center; border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8; font-size:12px; margin:0;">© ${new Date().getFullYear()} Biarritz · <a href="https://biarritz.blog" style="color:#6366f1;">biarritz.blog</a></p>
    </div>
  </div>
</body>
</html>`,
    })
    console.log(`Order confirmation email sent to ${email}`)
  } catch (err) {
    console.error('Failed to send order confirmation email:', err)
  }
}
