export class YandexRequestError extends Error {
    constructor(public msg?: string, public inner?: Error, public innerAttributes?: any) { super(msg); }
}