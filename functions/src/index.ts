const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.sendEmail = functions.https.onCall((data: any, context) => {
    const {emailTo, subject, body} = data;
    const mailOptions = {
        from: `Много рыбы (мобильное приложение) <${gmailEmail}>`,
        to: emailTo,
        subject: subject,
        html: body,
    };
    return transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return error.toString();
        }
        return "Success!";
    });
});
