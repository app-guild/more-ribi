import Address from "../../entities/Address";
import Cart from "../../entities/Cart";
import {PaymentsMethods} from "../payment/PaymentsMethods";
import {firebase, FirebaseFunctionsTypes} from "@react-native-firebase/functions";

const SHOP_EMAIL = "smouk.chayz@gmail.com";

export default class EmailService {
    public static async sendDeliveryOrder(
        cart: Cart,
        paymentMethod: PaymentsMethods,
        address: Address,
        comment?: string,
    ): Promise<FirebaseFunctionsTypes.HttpsCallableResult> {
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

        return firebase.functions().httpsCallable("sendEmail")({
            emailTo: SHOP_EMAIL,
            subject,
            body,
        });
    }

    public static async sendFeedback(
        name: string,
        comment: string,
    ): Promise<FirebaseFunctionsTypes.HttpsCallableResult> {
        const subject = "Отзыв (мобильное приложение)";
        let body = `Имя: ${name}\nОтзыв: ${comment}\n`;

        return firebase.functions().httpsCallable("sendEmail")({
            emailTo: SHOP_EMAIL,
            subject,
            body,
        });
    }
}
