import { brandConfig } from '@/config/brand.config';

interface EmailTemplateOptions {
  title: string;
  heading: string;
  contentSections: {
    title: string;
    content: string;
  }[];
}

/**
 * Generate a professional HTML email template with brand styling
 */
export function generateEmailTemplate(options: EmailTemplateOptions): string {
  const { title, heading, contentSections } = options;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header with gradient and logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Ideal Indiska LIVS
              </h1>
              <p style="color: #b7e4c7; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">
                ${brandConfig.tagline}
              </p>
            </td>
          </tr>

          <!-- Main heading -->
          <tr>
            <td style="background-color: #f0faf4; padding: 25px 30px; border-bottom: 3px solid #b7e4c7;">
              <h2 style="color: #2d6a4f; margin: 0; font-size: 22px; font-weight: 600; text-align: center;">
                ${heading}
              </h2>
            </td>
          </tr>

          <!-- Content sections -->
          <tr>
            <td style="padding: 40px 30px;">
              ${contentSections.map(section => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                  <tr>
                    <td>
                      <h3 style="color: #2d6a4f; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #b7e4c7; padding-bottom: 10px;">
                        ${section.title}
                      </h3>
                      <div style="margin-top: 15px;">
                        ${section.content}
                      </div>
                    </td>
                  </tr>
                </table>
              `).join('')}
            </td>
          </tr>

          <!-- Footer with contact info and social -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; border-top: 1px solid #e0e0e0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <h3 style="color: #2d6a4f; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                      Contact Us
                    </h3>
                    <p style="margin: 5px 0; color: #666666; font-size: 13px;">
                      📍 ${brandConfig.contact.address}
                    </p>
                    <p style="margin: 5px 0; color: #666666; font-size: 13px;">
                      📞 <a href="tel:${brandConfig.contact.phone.replace(/\s/g, '')}" style="color: #2d6a4f; text-decoration: none;">${brandConfig.contact.phone}</a>
                    </p>
                    <p style="margin: 5px 0; color: #666666; font-size: 13px;">
                      ✉️ <a href="mailto:${brandConfig.contact.email}" style="color: #2d6a4f; text-decoration: none;">${brandConfig.contact.email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 15px;">
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px; font-weight: 600;">
                      Follow Us
                    </p>
                    <div style="margin-top: 10px;">
                      ${brandConfig.social.facebook ? `
                        <a href="${brandConfig.social.facebook}" style="display: inline-block; margin: 0 8px; color: #2d6a4f; text-decoration: none; font-size: 12px;">
                          📘 Facebook
                        </a>
                      ` : ''}
                      ${brandConfig.social.instagram ? `
                        <a href="${brandConfig.social.instagram}" style="display: inline-block; margin: 0 8px; color: #2d6a4f; text-decoration: none; font-size: 12px;">
                          📷 Instagram
                        </a>
                      ` : ''}
                      ${brandConfig.social.youtube ? `
                        <a href="${brandConfig.social.youtube}" style="display: inline-block; margin: 0 8px; color: #2d6a4f; text-decoration: none; font-size: 12px;">
                          ▶️ YouTube
                        </a>
                      ` : ''}
                      ${brandConfig.social.tiktok ? `
                        <a href="${brandConfig.social.tiktok}" style="display: inline-block; margin: 0 8px; color: #2d6a4f; text-decoration: none; font-size: 12px;">
                          🎵 TikTok
                        </a>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background-color: #2d6a4f; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #b7e4c7; font-size: 12px;">
                © ${new Date().getFullYear()} Ideal Indiska LIVS. All rights reserved.
              </p>
              <p style="margin: 8px 0 0 0; color: #b7e4c7; font-size: 11px; opacity: 0.8;">
                Sent on ${new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Stockholm'
  })} (Stockholm time)
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Helper to create table rows for contact information
 */
export function createInfoRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 8px 0; font-size: 14px; color: #666666; width: 140px; font-weight: 600;">
        ${label}:
      </td>
      <td style="padding: 8px 0; font-size: 14px; color: #333333;">
        ${value}
      </td>
    </tr>
  `;
}

/**
 * Helper to create a highlighted info box
 */
export function createInfoBox(content: string): string {
  return `
    <div style="background-color: #f0faf4; border-left: 4px solid #b7e4c7; padding: 15px; margin-top: 10px; border-radius: 4px;">
      <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
        ${content}
      </p>
    </div>
  `;
}
