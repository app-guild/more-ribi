const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */
const gmailEmail = functions.config().gmail.email;
const emailTo = "smouk.chayz@gmail.com";
const gmailPassword = functions.config().gmail.password;
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

async function sendEmail(subject: string, body: string, req: any, res: any) {
    const mailOptions = {
        from: "Много рыбы (мобильное приложение) <gmailEmail>",
        to: emailTo,
        subject: subject,
        html: body,
    };

    return transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return res.send(error.toString());
        }
        return res.send("Success!");
    });
}

exports.sendDeliveryOrder = functions.https.onRequest((req, res) => {
    const cart = JSON.parse(req.query.cart);
    const address = JSON.parse(req.query.address);
    const comment = req.query.comment;
    const paymentMethod = req.query.paymentMethod;

    const subject = "Заказ из мобильного приложения";
    let body = "";
    if (comment) {
        body = body + `Комментарий к заказу: ${comment}\n`;
    }
    body = `Адрес: ${address} \n`;
    body = body + `Заказ: \n`;
    cart.products.forEach((prod: any) => {
        const price = prod.discountPrice ? prod.discountPrice : prod.price;
        const count = cart.getProductCount(prod);
        const printCount = count > 1 ? `X ${count} Сумма: ${count * price}` : "";
        body = body + `\t${prod.name} (${price} ₽) ${printCount}\n`;
    });
    body = body + `Итого: ${cart.totalPrice}\n`;
    body = body + `Способ оплаты: ${paymentMethod}\n`;

    return sendEmail(subject, body, req, res);
});

exports.sendFeedback = functions.https.onRequest((req, res) => {
    const comment = req.query.comment;
    const name = req.query.name;

    const subject = "Отзыв (из мобильное приложение)";
    let body = `Имя: ${name}\nОтзыв: ${comment}\n`;
    return sendEmail(subject, body, req, res);
});
