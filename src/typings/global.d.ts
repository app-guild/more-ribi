/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

declare module "*";

declare namespace NodeJS {
    export interface Global {
        db: any;
        googlePayService: any;
        applePayService: any;
    }
}

declare var cart: {products: any[], totalPrice: number, id: number};
declare var googlePayService: any;
declare var db: any;
