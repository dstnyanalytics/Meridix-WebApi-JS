/*
	Meridix WebAPI JS client v0.1
	(c) 1997-2014 by Meridix Systems AB, Johan Wendelstam. All rights reserved.

	Depends on:
		CryptoJS : http://crypto-js.googlecode.com
*/

var meridix = meridix || {};
meridix.webApi = meridix.webApi || {};

meridix.webApi.createSignedUrl = function(verb, url, token, secret, options){

	function consoleLog(message){
		if(options.consoleLoggingEnabled && console && console.log) {
			console.log(message);
		}
	}

	function randomString(length) {
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for (var i = length; i > 0; --i) {
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		return result;
	}

	function createSignature(text) {
		if(!CryptoJS || !CryptoJS.MD5) {
			throw "CryptoJS (.MD5) is not defined. Make sure that it is referenced and loaded prior to calling this method.";
		}

		var hash = CryptoJS.MD5(text);
		return hash.toString(CryptoJS.enc.Hex);
	}

	function lpad(value, padding) {
		var zeroes = "0";
		for (var i = 0; i < padding; i++) {
			zeroes += "0";
		}
		return (zeroes + value).slice(padding * -1);
	}

	function formatDate(d) {
		return "" + d.getFullYear() +
		lpad((d.getMonth() + 1), 2) +
		lpad(d.getDate(), 2) +
		lpad(d.getHours(), 2) +
		lpad(d.getMinutes(), 2) +
		lpad(d.getSeconds(), 2);
	}

	options = options || {
		consoleLoggingEnabled: false,
		parameters: undefined
	};

	consoleLog('Token:\n' + token);
	consoleLog('Secret:\n' + secret);

	var request = url;
	consoleLog('Request URL:\n' + request);

	var nonce = randomString(20);
	consoleLog('Nonce:\n' + nonce);

	var now = new Date();
	var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
	var timestamp = formatDate(utc);
	consoleLog('Timestamp:\n' + timestamp);

	var parameters = [
		'auth_nonce=' + nonce,
		'auth_timestamp=' + timestamp,
		'auth_token=' + token
		];
	if(options.parameters) {
		parameters = parameters.concat(options.parameters);
	}
	parameters.sort();

	var parametersConcated = parameters.join('&');
	consoleLog('ParametersConcated:\n' + parametersConcated);

	var parametersConcatedEncoded = encodeURIComponent(parametersConcated);
	consoleLog('ParametersConcatedEncoded:\n' + parametersConcatedEncoded);

	var requestEncoded = encodeURIComponent(request);
	consoleLog('RequestEncoded:\n' + requestEncoded);

	var verbRequestQuery = verb.toUpperCase() + '&' + requestEncoded + '&' + parametersConcatedEncoded + '&' + secret;
	consoleLog('VerbRequestQuery:\n' + verbRequestQuery);

	var signature = createSignature(verbRequestQuery);
	consoleLog('Signature:\n' + signature);

	var signedRequest = request + '?' + parametersConcated + '&auth_signature=' + signature;
	consoleLog('SignedRequest:\n' + signedRequest);

	return signedRequest;
};
