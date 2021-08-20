export default class GooglePayCredentials {
    constructor(private _merchantId: string) {}
    get merchantId() {
        return this._merchantId;
    }
}
