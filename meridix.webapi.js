/*
    Meridix WebAPI JS client
    (c) 1997-2017 by Meridix Systems AB, Johan Wendelstam. All rights reserved.
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "crypto-js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CryptoJS = require("crypto-js");
    var MeridixWebApiOptions = (function () {
        function MeridixWebApiOptions() {
        }
        return MeridixWebApiOptions;
    }());
    exports.MeridixWebApiOptions = MeridixWebApiOptions;
    var MeridixWebApi = (function () {
        function MeridixWebApi() {
        }
        MeridixWebApi.randomString = function (length) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            return result;
        };
        MeridixWebApi.createSignature = function (text) {
            var hash = CryptoJS.MD5(text);
            return hash.toString(CryptoJS.enc.Hex);
        };
        MeridixWebApi.lpad = function (value, padding) {
            var zeroes = "0";
            for (var i = 0; i < padding; i++) {
                zeroes += "0";
            }
            return (zeroes + value).slice(padding * -1);
        };
        MeridixWebApi.formatDate = function (d) {
            return "" + d.getFullYear() +
                MeridixWebApi.lpad((d.getMonth() + 1), 2) +
                MeridixWebApi.lpad(d.getDate(), 2) +
                MeridixWebApi.lpad(d.getHours(), 2) +
                MeridixWebApi.lpad(d.getMinutes(), 2) +
                MeridixWebApi.lpad(d.getSeconds(), 2);
        };
        MeridixWebApi.log = function (message, options) {
            if (options.consoleLoggingEnabled) {
                console.log(message);
            }
        };
        MeridixWebApi.prototype.createSignedUrl = function (verb, url, token, secret, options) {
            options = options || {
                consoleLoggingEnabled: false,
                parameters: undefined
            };
            MeridixWebApi.log('Token:\n' + token, options);
            MeridixWebApi.log('Secret:\n' + secret, options);
            var request = url;
            MeridixWebApi.log('Request URL:\n' + request, options);
            var nonce = MeridixWebApi.randomString(20);
            MeridixWebApi.log('Nonce:\n' + nonce, options);
            var now = new Date();
            var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            var timestamp = MeridixWebApi.formatDate(utc);
            MeridixWebApi.log('Timestamp:\n' + timestamp, options);
            var parameters = [
                'auth_nonce=' + nonce,
                'auth_timestamp=' + timestamp,
                'auth_token=' + token
            ];
            if (options.parameters) {
                parameters = parameters.concat(options.parameters);
            }
            parameters.sort();
            var parametersConcated = parameters.join('&');
            MeridixWebApi.log('ParametersConcated:\n' + parametersConcated, options);
            var parametersConcatedEncoded = encodeURIComponent(parametersConcated);
            MeridixWebApi.log('ParametersConcatedEncoded:\n' + parametersConcatedEncoded, options);
            var requestEncoded = encodeURIComponent(request);
            MeridixWebApi.log('RequestEncoded:\n' + requestEncoded, options);
            var verbRequestQuery = verb.toUpperCase() + '&' + requestEncoded + '&' + parametersConcatedEncoded + '&' + secret;
            MeridixWebApi.log('VerbRequestQuery:\n' + verbRequestQuery, options);
            var signature = MeridixWebApi.createSignature(verbRequestQuery);
            MeridixWebApi.log('Signature:\n' + signature, options);
            var signedRequest = request + '?' + parametersConcated + '&auth_signature=' + signature;
            MeridixWebApi.log('SignedRequest:\n' + signedRequest, options);
            return signedRequest;
        };
        return MeridixWebApi;
    }());
    exports.MeridixWebApi = MeridixWebApi;
});
