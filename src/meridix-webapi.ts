/*
	Meridix WebAPI JS client
	(c) 1997-2017 by Meridix Systems AB, Johan Wendelstam. All rights reserved.
*/

import * as CryptoJS from 'crypto-js';

import { CreateSignatureOptions } from './create-signature-options';

export class MeridixWebApi {
    private static randomString(length: number) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }

    private static createSignature(text: string) {
        const hash = <any>CryptoJS.MD5(text);
        return hash.toString(CryptoJS.enc.Hex);
    }

    private static lpad(value: number, padding: number) {
        let zeroes = "0";
        for (let i = 0; i < padding; i++) {
            zeroes += "0";
        }
        return (zeroes + value).slice(padding * -1);
    }

    private static formatDate(d: Date) {
        return "" + d.getFullYear() +
            MeridixWebApi.lpad((d.getMonth() + 1), 2) +
            MeridixWebApi.lpad(d.getDate(), 2) +
            MeridixWebApi.lpad(d.getHours(), 2) +
            MeridixWebApi.lpad(d.getMinutes(), 2) +
            MeridixWebApi.lpad(d.getSeconds(), 2);
    }

    private static log(message: string, options: any) {
        if (options.consoleLoggingEnabled) {
            console.log(message);
        }
    }

    createSignedUrl(verb: string, url: string, token: string, secret: string, options?: CreateSignatureOptions) {
        options = options || {
            consoleLoggingEnabled: false,
            parameters: undefined
        };

        MeridixWebApi.log('Token:\n' + token, options);
        MeridixWebApi.log('Secret:\n' + secret, options);

        const request = url;
        MeridixWebApi.log('Request URL:\n' + request, options);

        const nonce = MeridixWebApi.randomString(20);
        MeridixWebApi.log('Nonce:\n' + nonce, options);

        const now = new Date();
        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const timestamp = MeridixWebApi.formatDate(utc);
        MeridixWebApi.log('Timestamp:\n' + timestamp, options);

        let parameters = [
            'auth_nonce=' + nonce,
            'auth_timestamp=' + timestamp,
            'auth_token=' + token
        ];
        if (options.parameters) {
            parameters = parameters.concat(options.parameters);
        }
        parameters.sort();

        const parametersConcated = parameters.join('&');
        MeridixWebApi.log('ParametersConcated:\n' + parametersConcated, options);

        const parametersConcatedEncoded = encodeURIComponent(parametersConcated);
        MeridixWebApi.log('ParametersConcatedEncoded:\n' + parametersConcatedEncoded, options);

        const requestEncoded = encodeURIComponent(request);
        MeridixWebApi.log('RequestEncoded:\n' + requestEncoded, options);

        const verbRequestQuery = verb.toUpperCase() + '&' + requestEncoded + '&' + parametersConcatedEncoded + '&' + secret;
        MeridixWebApi.log('VerbRequestQuery:\n' + verbRequestQuery, options);

        const signature = MeridixWebApi.createSignature(verbRequestQuery);
        MeridixWebApi.log('Signature:\n' + signature, options);

        const signedRequest = request + '?' + parametersConcated + '&auth_signature=' + signature;
        MeridixWebApi.log('SignedRequest:\n' + signedRequest, options);

        return signedRequest;
    }
}