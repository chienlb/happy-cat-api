import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envSchema } from '../../configs/env/env.config';
import { ok } from 'assert';
import { join } from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import mjml2html from 'mjml';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const env = envSchema.parse(process.env);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.larksuite.com',
      port: 587,
      secure: false,
      auth: {
        user: 'english.dev@fit.io.vn',
        pass: 'ZQgcWqGcgWfZF6jV',
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    // Try multiple paths for template
    const possiblePaths = [
      join(__dirname, '../../templates', `${templateName}.hbs`),
      join(__dirname, '../../templates', `${templateName}.mjml`),
      join(process.cwd(), 'dist', 'app', 'templates', `${templateName}.hbs`),
      join(process.cwd(), 'dist', 'app', 'templates', `${templateName}.mjml`),
      join(process.cwd(), 'src', 'app', 'templates', `${templateName}.hbs`),
      join(process.cwd(), 'src', 'app', 'templates', `${templateName}.mjml`),
    ];

    let templatePath: string | null = null;
    let isMjml = false;

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        templatePath = path;
        isMjml = path.endsWith('.mjml');
        this.logger.debug(`Found template at: ${templatePath}`);
        break;
      }
    }

    if (!templatePath) {
      this.logger.error(
        `Template not found. Checked paths: ${possiblePaths.join(', ')}`,
      );
      throw new Error(
        `Template not found: ${templateName}.hbs or ${templateName}.mjml`,
      );
    }

    let templateContent = fs.readFileSync(templatePath, 'utf8');

    // If it's MJML, convert to HTML first
    if (isMjml) {
      const { html, errors } = mjml2html(templateContent, {
        validationLevel: 'soft',
      });

      if (errors && errors.length > 0) {
        this.logger.warn(`MJML conversion warnings: ${JSON.stringify(errors)}`);
      }

      templateContent = html;
    }

    // Compile with Handlebars
    const compile = hbs.compile(templateContent);
    this.logger.debug(
      `Template context username: ${context?.username || 'NOT FOUND'}`,
    );
    const html = compile(context);
    // Check if username was replaced
    if (html.includes('{{username}}') || html.includes('{username}')) {
      this.logger.warn(
        `Username placeholder not replaced in template. Context: ${JSON.stringify(context)}`,
      );
    }
    return html;
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
    attachments?: Array<{
      filename?: string;
      path?: string;
      cid?: string;
      contentId?: string;
      content?: string | Buffer;
      contentType?: string;
      disposition?: 'inline' | 'attachment';
      contentDisposition?: 'inline' | 'attachment';
    }>,
  ) {
    const env = envSchema.parse(process.env);

    try {
      const html = this.compileTemplate(templateName, context);
      await this.transporter.sendMail({
        from: `"English Learning" <${env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments: attachments || [],
      });
      this.logger.log(`Email sent to ${to}`);
      return ok(true, 'Email sent successfully');
    } catch (err) {
      this.logger.error(`Failed to send email: ${err.message}`);
      throw new Error(err.message);
    }
  }
}
