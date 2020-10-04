import sendEmail from "react-native-email";
import SimpleToast from "react-native-simple-toast";
import Address from "../../entities/Address";
import Cart from "../../entities/Cart";
import {PaymentsMethods} from "../payment/PaymentsMethods";

const TARGET_EMAIL = "applications.guild@gmail.com";

export default class EmailService {
    public static async sendEmail(to: string | string[], subject: string, body: string, errorMessage?: string) {
        return sendEmail(to, {subject, body}).catch(() => {
            if (errorMessage) {
                SimpleToast.show(errorMessage);
            }
        });
    }

    public static async sendDeliveryOrder(
        cart: Cart,
        paymentMethod: PaymentsMethods,
        address: Address,
        comment?: string,
    ) {
        const subject = "Заказ из мобильного приложения";
        let body = "";
        if (comment) {
            body = body + `Комментарий к заказу: ${comment}\n`;
        }
        body = `Адрес: ${address} \n`;
        body = body + `Заказ: \n`;
        cart.products.forEach((prod) => {
            const price = prod.discountPrice ? prod.discountPrice : prod.price;
            const count = cart.getProductCount(prod);
            const printCount = count > 1 ? `X ${count} Сумма: ${count * price}` : "";
            body = body + `\t${prod.name} (${price} ₽) ${printCount}\n`;
        });
        body = body + `Итого: ${cart.totalPrice}\n`;
        body = body + `Способ оплаты: ${paymentMethod}\n`;

        return this.sendEmail(
            TARGET_EMAIL,
            subject,
            body,
            "Не удалось сделать заказ. Пожалуйста, проверьте соединение с интернетом.",
        );
    }

    public static async sendFeedback(name: string, comment: string) {
        const subject = "Отзыв (мобильное приложение)";
        let body = `Имя: ${name}\nОтзыв: ${comment}\n`;
        return this.sendEmail(
            TARGET_EMAIL,
            subject,
            body,
            "Не удалось отправить отзыв. Пожалуйста, проверьте соединение с интернетом.",
        );
    }
}
