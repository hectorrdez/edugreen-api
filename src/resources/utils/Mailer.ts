import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import ApiError from '../errors/ApiError';
import Logger from './Logger';

export default class Mailer {
    private mailer;
    constructor() {
        dotenv.config();
        const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS }: any = process.env;
        this.mailer = nodemailer.createTransport({
            host: EMAIL_HOST,
            secure: EMAIL_SECURE,
            port: EMAIL_PORT,
            auth: {
                type: 'login',
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
        });
    }
    public send(from: string, to: string, subject: string, html: string): void {
        this.mailer.sendMail({ from: from, to: to, subject: subject, html: html }, (error, info) => {
            if (error) {
                Logger.error("Can't send email", "Mailer");
                throw new ApiError("Can't send email");
            } else {
                Logger.write("Email sended", "Mailer");
            }
        })
    }
}