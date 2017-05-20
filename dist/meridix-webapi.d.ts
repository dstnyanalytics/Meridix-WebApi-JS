import { CreateSignatureOptions } from './create-signature-options';
export declare class MeridixWebApi {
    private static randomString(length);
    private static createSignature(text);
    private static lpad(value, padding);
    private static formatDate(d);
    private static log(message, options);
    createSignedUrl(verb: string, url: string, token: string, secret: string, options?: CreateSignatureOptions): string;
}
