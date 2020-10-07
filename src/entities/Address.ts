export default class Address {
    constructor(
        public mainAddress: string = "",
        public entrance: string = "",
        public flor: string = "",
        public apartment: string = "",
    ) {}

    public static print(address: Address): string {
        let result = "";
        if (address.mainAddress) {
            result = result + `${address.mainAddress}`;
        }
        if (address.entrance) {
            result = result + `, подъезд №${address.entrance}`;
        }
        if (address.flor) {
            result = result + `, ${address.flor} этаж`;
        }
        if (address.apartment) {
            result = result + `, квартира/офис №${address.apartment}`;
        }
        return result;
    }
}
