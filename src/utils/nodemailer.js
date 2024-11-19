import { createTransport } from "nodemailer";
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

// Mengambil direktori file ini, agar sesuai di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (destination) => {
    const email = Buffer.from(destination).toString("base64");
    const resetLink = `${process.env.DOMAIN}/reset-password`;

    // Path ke file EJS template
    const templatePath = path.join(__dirname, '../views/mail-format.ejs');

    // Render EJS template dengan data
    const emailContent = await ejs.renderFile(templatePath, { resetLink, email });

    // send mail with defined transport object
    const mailOption = {
        from: {
            name: "Binarian",
            address: process.env.EMAIL_USER
        },
        to: destination,
        subject: "Forgot Password",
        text: "Forgot Password",
        html: emailContent,
    };

    await transporter.sendMail(mailOption);

    return true;
}

export default sendEmail;