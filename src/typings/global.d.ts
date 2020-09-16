/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */
declare namespace NodeJS {
    export interface Global {
        db: any;
    }
}

declare module "react-native-gpay";
declare module "react-native-sqlite-storage";

declare var db: any;

// declare var GPay: any;
