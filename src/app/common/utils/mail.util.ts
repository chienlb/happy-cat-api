import { MailService } from '../../configs/mail/mail.service';
import * as https from 'https';
import { Logger } from '@nestjs/common';

/**
 * Download image from URL and return as Buffer
 */

const logger = new Logger('MailUtil');

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      })
      .on('error', reject);
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  templateName: string,
  context: any,
): Promise<void> {
  const mailService = new MailService();

  // Prepare attachments with CID for logo (inline, not as downloadable attachment)
  const attachments: Array<{
    filename?: string;
    path?: string;
    cid?: string;
    contentId?: string;
    content?: string | Buffer;
    contentType?: string;
    disposition?: 'inline' | 'attachment';
    contentDisposition?: 'inline' | 'attachment';
  }> = [];

  // Download logo from Cloudinary and attach as inline CID
  try {
    const logoUrl =
      'https://res.cloudinary.com/dxkqibtzv/image/upload/v1765629897/Logo_web_oljdjn.png';
    const logoBuffer = await downloadImage(logoUrl);
    if (logoBuffer && logoBuffer.length > 0) {
      attachments.push({
        content: logoBuffer,
        contentType: 'image/png',
        cid: 'logo@happycat', // Use unique CID format
        contentId: '<logo@happycat>', // Content-ID with angle brackets
        // Explicitly NO filename to prevent showing as attachment
        disposition: 'inline',
        contentDisposition: 'inline',
      });
      logger.log(
        `Logo downloaded successfully, size: ${logoBuffer.length} bytes`,
      );
    } else {
      logger.warn('Logo buffer is empty');
    }
  } catch (error) {
    logger.error('Failed to download logo:', error);
    // Continue without logo if download fails
  }
  await mailService.sendMail(to, subject, templateName, context, attachments);
}
