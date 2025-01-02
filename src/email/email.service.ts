import { ConfigService } from '@nestjs/config';
// import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { Enviroment } from 'src/global/enum/enviroment.enum';
import * as pug from 'pug';
import { Injectable } from '@nestjs/common';
import { VIEW_PATH } from 'src/utils/constant';
import { CreateContactDto } from 'src/contact/dto/create-contact.dto';

@Injectable()
export class EmailService {
    private from: string;

    constructor(private readonly configService: ConfigService) {
        this.from = `Riskrice <${configService.get('EMAIL')}>`;
    }

    newTransport() {
        if (this.configService.get('NODE_ENV') === Enviroment.PRODUCTION) {
            return nodemailer.createTransport({
                host: this.configService.get('EMAIL_HOST'),
                // secure: true,
                port: this.configService.get('EMAIL_PORT'),
                auth: {
                    user: this.configService.get('EMAIL'),
                    pass: this.configService.get('EMAIL_PASSWORD'),
                },
            });
        }
        return null;
    }

    async send(
        template: string,
        subject: string,
        user: { fullName: string; email: string },
        url?: string,
    ) {
        // 1) render html based on a pug template
        const fullPath = join(VIEW_PATH, 'email', `${template}.pug`);
        const html = pug.renderFile(fullPath, {
            name: user.fullName.split(' ')[0],
            url,
            subject: subject,
            email: user.email,
        });
        // 2) email options
        const mailOptions = {
            from: this.from,
            to: user.email,
            subject,
            html,
        };
        // 3) create a transporter and send email
        const transporter = this.newTransport();
        if (transporter) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('Dev mode no email sent');
            console.log({ url, subject, email: user.email });
        }
    }

    async sendCustom(
        template: string,
        subject: string,
        to: string,
        name: string,
        object: object,
    ) {
        // 1) render html based on a pug template
        const fullPath = join(VIEW_PATH, 'email', `${template}.pug`);
        console.log({
            fullPath,
            name,
            object,
            subject,
            email: to,
        });
        const html = pug.renderFile(fullPath, {
            name,
            object,
            subject: subject,
            email: to,
        });
        // 2) email options
        const mailOptions = {
            from: this.from,
            to,
            subject,
            html,
        };
        // 3) create a transporter and send email
        const transporter = this.newTransport();
        if (transporter) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('Dev mode no email sent');
            console.log({ object, subject, email: to });
        }
    }

    async sendContact(createContactDto: CreateContactDto) {
        await this.sendCustom(
            'contact',
            'Contact Us',
            'info@riskrice.com',
            'Admin',
            createContactDto,
        );
    }

    async sendWelcome(user: { fullName: string; email: string }, url: string) {
        await this.send('welcome', 'Welcome To our website', user, url);
    }

    async verifyAccount(
        user: { fullName: string; email: string },
        url: string,
    ) {
        await this.send(
            'verifyAccount',
            'Please Verify Your Account',
            user,
            url,
        );
    }

    async verifyAccountProvider(
        user: { fullName: string; email: string },
        url: string,
    ) {
        await this.send(
            'verifyAccountProvider',
            'Your Application is under reviewd, Please Verify Your Account',
            user,
            url,
        );
    }

    async forgetPassword(
        user: { fullName: string; email: string },
        url: string,
    ) {
        await this.send('forgetPassword', 'Reset Your Password', user, url);
    }
}
