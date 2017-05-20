(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./meridix-webapi", "./create-signature-options"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var meridix_webapi_1 = require("./meridix-webapi");
    exports.MeridixWebApi = meridix_webapi_1.MeridixWebApi;
    var create_signature_options_1 = require("./create-signature-options");
    exports.CreateSignatureOptions = create_signature_options_1.CreateSignatureOptions;
});
