import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, organization_name, inviter_name, inviter_email, role, join_url, expires_at } = await req.json()

    // Validate required fields
    if (!to || !organization_name || !inviter_name || !join_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're invited to join ${organization_name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .expires { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're invited!</h1>
            <p>Join ${organization_name} on Layrbase</p>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${inviter_name}</strong> (${inviter_email}) has invited you to join <strong>${organization_name}</strong> on Layrbase as a <strong>${role}</strong>.</p>
            
            <p>Layrbase is a comprehensive platform for managing your organization's operations, including:</p>
            <ul>
              <li>Cap table management</li>
              <li>Financial planning and reporting</li>
              <li>HR and team management</li>
              <li>Legal compliance tracking</li>
              <li>And much more!</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${join_url}" class="button">Accept Invitation</a>
            </div>
            
            <div class="expires">
              <strong>⚠️ This invitation expires on ${new Date(expires_at).toLocaleDateString()}</strong>
            </div>
            
            <p>If you have any questions, please contact ${inviter_name} at ${inviter_email}.</p>
          </div>
          <div class="footer">
            <p>This invitation was sent from Layrbase</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailText = `
You're invited to join ${organization_name} on Layrbase!

${inviter_name} (${inviter_email}) has invited you to join ${organization_name} as a ${role}.

Layrbase is a comprehensive platform for managing your organization's operations.

Accept your invitation: ${join_url}

This invitation expires on ${new Date(expires_at).toLocaleDateString()}.

If you have any questions, please contact ${inviter_name} at ${inviter_email}.

---
This invitation was sent from Layrbase
If you didn't expect this invitation, you can safely ignore this email.
    `

    // Send email using Resend (you can replace with any email service)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Layrbase <noreply@your-domain.com>',
        to: [to],
        subject: `You're invited to join ${organization_name} on Layrbase`,
        html: emailHtml,
        text: emailText,
      }),
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      throw new Error(`Email service error: ${error}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Invitation email sent successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending invitation email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 