import nodemailer from 'nodemailer';

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    }

    async send(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL,
                to,
                subject,
                html
            });
            console.log("Email enviado con éxito");
        } catch (error) {
            console.error("Error al enviar el email:", error);
            throw new Error("Error al enviar el email");
        }
    }
}

export default Mailer;