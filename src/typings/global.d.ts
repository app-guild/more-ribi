/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */
declare namespace NodeJS {
    export interface Global {
        db: any;
    }
}

declare var db: any;
