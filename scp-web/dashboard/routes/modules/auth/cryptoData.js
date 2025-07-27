const CryptoJS = require('crypto-js');
const crypto = require('crypto');
module.exports = {};
module.exports.register = async (email, login, nick, pass) => {
    let _crypto = await hash('qurre hash');
    {
        let _ancrpt = _crypto.replace(/([0-9]+?)/g, '');
        for(let i = 0; i < _ancrpt.length; i+=2){
            _crypto += _ancrpt[i];
        }
    }
    {
        let _ancrpt = await hash(nick + pass);
        for(let i = 1; i < _ancrpt.length; i+=2){
            _crypto += _ancrpt[i];
        }
    }

    let _emailCrypto = '';
    for(let i = 0; i < _crypto.length; i+=2){
        _emailCrypto += _crypto[i];
    }
    const _email = CryptoJS.AES.decrypt(email, _emailCrypto).toString(CryptoJS.enc.Utf8);

    let _loginCrypto = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _loginCrypto += _crypto[i];
    }
    const _login = CryptoJS.AES.decrypt(login, _loginCrypto).toString(CryptoJS.enc.Utf8);

    return {
        email: _email.toLowerCase(),
        login: _login,
    }

    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
}

module.exports.login = async (login, pass) => {
    let _crypto = await hash('qurre login hash');
    {
        let _ancrpt = _crypto.replace(/([a-zA-Z]+?)/g, '');
        for(let i = 0; i < _crypto.length && i/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[i/2]);}catch{}
        }
    }
    {
        let _ancrpt = await hash(pass);
        for(let i = 1; i < _ancrpt.length && (i-1)/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[(i-1)/2]);}catch{}
        }
    }

    let _crypt = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _crypt += _crypto[i];
    }

    return CryptoJS.AES.decrypt(login, _crypt).toString(CryptoJS.enc.Utf8);

    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
    function replaceAt(string, index, replacement) {
        return string.substring(0, index) + replacement + string.substring(index + replacement.length);
    }
};

module.exports.reset = async (email) => {
    let _crypto = await hash('qurre email hash');
    {
        let _ancrpt = _crypto.replace(/([a-zA-Z]+?)/g, '');
        for(let i = 0; i < _crypto.length && i/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[i/2]);}catch{}
        }
    }
    {
        let _ancrpt = await hash('email crypto');
        for(let i = 1; i < _ancrpt.length && (i-1)/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[(i-1)/2]);}catch{}
        }
    }

    let _crypt = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _crypt += _crypto[i];
    }

    return CryptoJS.AES.decrypt(email, _crypt).toString(CryptoJS.enc.Utf8).toLowerCase();

    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
    function replaceAt(string, index, replacement) {
        return string.substring(0, index) + replacement + string.substring(index + replacement.length);
    }
};

module.exports.sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');

module.exports.cryptoPass = (pass) => {
	var salt = generateSalt();
	return salt + sha256(pass + salt);

    function sha256(str){
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    function generateSalt(){
        var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
        var salt = '';
        for (var i = 0; i < 10; i++) {
            var p = Math.floor(Math.random() * set.length);
            salt += set[p];
        }
        return salt;
    }
}
module.exports.ValidatePass = (pass, hashed) => {
	var salt = hashed.substr(0, 10);
	var validHash = salt + sha256(pass + salt);
	return hashed == validHash;

    function sha256(str){
        return crypto.createHash('sha256').update(str).digest('hex');
    }
}

module.exports.guid = (length = 30) => {
    const symbol = () => (Math.random()*35|0).toString(36);
    let str = '';
    for (let i = 0; i < length; i++) {
        str += symbol();
    }
    return str;
}

/*website code:
async function CryptoLogin(login, pass, hash, sol){
    try{hash('crypto user data hash '+sol);}catch{}
    let _crypto = await hash2('qurre login hash');
    {
        let _ancrpt = _crypto.replace(/([a-zA-Z]+?)/g, '');
        for(let i = 0; i < _crypto.length && i/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[i/2]);}catch{}
        }
    }
    {
        let _ancrpt = await hash2(pass);
        for(let i = 1; i < _ancrpt.length && (i-1)/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[(i-1)/2]);}catch{}
        }
    }

    let _crypt = 'ewhg3v3';
    let bgc = 1 + '5' - 1 + _crypt;
    _crypt = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _crypt += _crypto[i];
    }
    const _login = CryptoJS.AES.encrypt(login, _crypt).toString();

    return _login;

    async function hash2(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
    function replaceAt(string, index, replacement) {
        return string.substring(0, index) + replacement + string.substring(index + replacement.length);
    }
}
async function CryptoData(email, login, nick, pass, hash, sol) {
    try{hash('crypto user data hash '+sol);}catch{}
    let _crypto = await hash2('qurre hash');
    {
        let _ancrpt = _crypto.replace(/([0-9]+?)/g, '');
        for(let i = 0; i < _ancrpt.length; i+=2){
            _crypto += _ancrpt[i];
        }
    }
    {
        let _ancrpt = await hash2(nick + pass);
        for(let i = 1; i < _ancrpt.length; i+=2){
            _crypto += _ancrpt[i];
        }
    }

    let _emailCrypto = 4;
    let slr1 = 1 + 2 - 1 * 2 - _emailCrypto;
    _emailCrypto = '';
    for(let i = 0; i < _crypto.length; i+=2){
        _emailCrypto += _crypto[i];
    }
    const _email = CryptoJS.AES.encrypt(email, _emailCrypto).toString();

    let _loginCrypto = 'sfw';
    let slr2 = 2 + '2' - 2 + _loginCrypto;
    _loginCrypto = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _loginCrypto += _crypto[i];
    }
    const _login = CryptoJS.AES.encrypt(login, _loginCrypto).toString();

    return {
        email: _email,
        login: _login,
    }

    async function hash2(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
}
async function CryptoMail(email, hash, sol){
    try{hash('crypto email hash '+sol);}catch{}
    let _crypto = await hash2('qurre email hash');
    {
        let _ancrpt = _crypto.replace(/([a-zA-Z]+?)/g, '');
        for(let i = 0; i < _crypto.length && i/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[i/2]);}catch{}
        }
    }
    {
        let _ancrpt = await hash2('email crypto');
        for(let i = 1; i < _ancrpt.length && (i-1)/2 < _ancrpt.length; i+=2){
            try{_crypto = replaceAt(_crypto, i, _ancrpt[(i-1)/2]);}catch{}
        }
    }

    let _crypt = 'srhn34brbaw4rh';
    let bgc = 1 + '5' - 1 + _crypt;
    _crypt = '';
    for(let i = 1; i < _crypto.length; i+=2){
        _crypt += _crypto[i];
    }
    const _email = CryptoJS.AES.encrypt(email, _crypt).toString();

    return _email;

    async function hash2(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
    function replaceAt(string, index, replacement) {
        return string.substring(0, index) + replacement + string.substring(index + replacement.length);
    }
}
*/