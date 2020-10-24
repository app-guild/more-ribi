import Address from "../../entities/Address";
import Cart from "../../entities/Cart";
import {PaymentsMethods} from "../payment/PaymentsMethods";
import {firebase, FirebaseFunctionsTypes} from "@react-native-firebase/functions";
import Restaurant from "../../entities/Restaurant";
import NetInfo from "@react-native-community/netinfo";
import {ProductType} from "../../entities/ProductType";
import WokProduct from "../../entities/WokProduct";
import RealtimeDatabaseApi from "../../api/firebase/RealtimeDatabaseApi";

const SHOP_EMAIL = "moreribi.mobileapp@gmail.com";
const FROM_HEADER = "Много рыбы Мобильное приложение";

export default class EmailService {
    private static async sendEmail(
        from: string,
        emailTo: string,
        subject: string,
        body: string,
    ): Promise<FirebaseFunctionsTypes.HttpsCallableResult> {
        console.log(emailTo);
        return new Promise((resolve, reject) => {
            NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    resolve(
                        firebase.functions().httpsCallable("sendEmail")({
                            from: from,
                            emailTo: emailTo,
                            subject,
                            body,
                        }),
                    );
                } else {
                    reject();
                }
            });
        });
    }

    public static async sendDeliveryOrder(
        cart: Cart,
        paymentMethod: PaymentsMethods,
        address: Address | Restaurant,
        comment?: string,
    ): Promise<FirebaseFunctionsTypes.HttpsCallableResult> {
        const subject = "Заказ из мобильного приложения";
        let body = "";
        if (comment) {
            body = body + `Комментарий к заказу: ${comment}<br>`;
        }
        if (address instanceof Address) {
            body = body + `Адрес: ${address} <br>`;
        } else {
            body = body + `САМОВЫВОЗ с адреса: ${address.address.toString()} <br>`;
        }
        body = body + `Заказ: <br>`;
        cart.products.forEach((prod) => {
            const price = prod.discountPrice ? prod.discountPrice : prod.price;
            const count = cart.getProductCount(prod);
            const printCount = count > 1 ? `X ${count} Сумма: ${count * price}` : "";
            let name = prod.name;
            if (prod.type === ProductType.Wok && prod instanceof WokProduct) {
                name = prod.toString();
            }
            body = body + `<p style="margin-left: 40px; ">${name} (${price} ₽) ${printCount}<br></p>`;
        });
        body = body + `Итого: ${cart.totalPrice}<br>`;
        body = body + `Способ оплаты: ${paymentMethod}<br>`;

        return RealtimeDatabaseApi.getDestinationEmail().then((emailTo) =>
            EmailService.sendEmail(FROM_HEADER, emailTo ? emailTo : SHOP_EMAIL, subject, body),
        );
    }

    public static async sendFeedback(
        name: string,
        comment: string,
    ): Promise<FirebaseFunctionsTypes.HttpsCallableResult> {
        const subject = "Отзыв (мобильное приложение)";
        let body = `Имя: ${name}<br>Отзыв: ${comment}`;

        return RealtimeDatabaseApi.getDestinationEmail().then((emailTo) =>
            EmailService.sendEmail(FROM_HEADER, emailTo ? emailTo : SHOP_EMAIL, subject, body),
        );
    }
}
