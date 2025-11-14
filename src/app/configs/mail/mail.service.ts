import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envSchema } from '../../configs/env/env.config';
import { ok } from 'assert';
import { join } from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';

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
        const templatePath = join(__dirname, '../../templates', `${templateName}.hbs`);
        const templateContent = fs.readFileSync(templatePath, 'utf8');

        const compile = hbs.compile(templateContent);
        return compile(context);
    }

    async sendMail(to: string, subject: string, templateName: string, context: any) {
        const env = envSchema.parse(process.env);

        try {
            const html = this.compileTemplate(templateName, context);
            await this.transporter.sendMail({
                from: `"English Learning" <${env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}`);
            return ok(true, 'Email sent successfully');
        } catch (err) {
            this.logger.error(`Failed to send email: ${err.message}`);
            throw new Error(err.message);
        }
    }
}
