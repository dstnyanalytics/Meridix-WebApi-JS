### Welcome to meridix-webapi
This is a library that can be used to sign API requests against Meridix WebAPI.

### Installation
The package is available through NPM

    npm install meridix-webapi --save

### Usage example

    import { MeridixWebApi } from 'meridix-webapi';
       
    let api = new MeridixWebApi();
    let url =  api.createSignedUrl("POST", "https://system-url.com/api/status", "token here", "secret here");
    
    console.log(url);
    
### Dependencies
CryptoJS
    
### Build
To build the package

    npm run build

### Support or Contact
Having trouble with meridix-webapi?
Contact Meridix Systems AB at <support@meridix.se> or
http://www.meridix.se
