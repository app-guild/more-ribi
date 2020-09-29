import sendEmail from "react-native-email";
import SimpleToast from "react-native-simple-toast";
import Address from "../../entities/Address";
import DatabaseApi from "../database/DatabaseApi";

const TARGET_EMAIL = "";

export default class EmailService {
    public static async sendEmail(to: string | string[], subject: string, body: string, errorMessage?: string) {
        return sendEmail(to, {subject, body}).catch(() => {
            if (errorMessage) {
                SimpleToast.show(errorMessage);
            }
        });
    }

    public static async sendDeliveryOrder(address: Address, comment?: string) {
        return DatabaseApi.getCart()
            .then((cart) => {
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
                body = body + `Итого: ${cart.totalPrice}`;
                return this.sendEmail(
                    TARGET_EMAIL,
                    subject,
                    body,
                    "Не удалось сделать заказ. Пожалуйста, проверьте соединение с интернетом.",
                );
            })
            .then(() => {
                DatabaseApi.createOrderFromCart(JSON.stringify(address), comment ? comment : "");
            });
    }
}
