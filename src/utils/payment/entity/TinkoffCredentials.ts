export default class TinkoffCredentials {
    constructor(private _terminal: string, private _password: string, private _publicKey: string) {}
    get terminal() {
        return this._terminal;
    }
    get password() {
        return this._password;
    }
    get publicKey() {
        return this._publicKey;
    }
}
