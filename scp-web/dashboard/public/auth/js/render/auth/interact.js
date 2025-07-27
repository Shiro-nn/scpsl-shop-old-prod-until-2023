(async() => {

{
let sended = false;
const login = document.querySelector('.login');
login.querySelector('.click').addEventListener('click', async() => {
    if(sended) return alert('Запрос уже отправлен');
    sended = true;
    const _unsafeLogin = login.querySelector('input[type="text"]').value;
    if(_unsafeLogin.length < 3) return alert('В логине должно быть более 3-х символов включительно');

    const _unsafePass = login.querySelector('input[type="password"]').value;
    if(_unsafePass.length < 8) return alert('В пароле должно быть более 8-и символов включительно');

    const _pass = await hash(_unsafePass);
    const _login = await CryptoLogin(_unsafeLogin, _pass, hash, (new Date).getFullYear());
    
    let remember = false;
    try{remember = login.querySelector('#remember_checkbox').checked;}catch{}

    const req = await postData('/auth/login', {login: _login, pass: _pass, remember});
    
    sended = false;
    if(req.error) return alert(req.msg);
    setTimeout(() => {
        window.location.href = '/' + getRedirect();
    }, 1000);

    function getRedirect() {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for(let i = 0; i < vars.length; i++){
            let pair = vars[i].split('=');
            if(decodeURIComponent(pair[0]) == 'redirect'){
                return decodeURIComponent(pair[1]);
            }
        }
        return 'info';
    }
});
}

{
let sended = false;
const register = document.querySelector('.register');
register.querySelector('.click').addEventListener('click', async() => {
    if(sended) return alert('Запрос уже отправлен');
    sended = true;
    const _unsafeLogin = register.querySelector('input[type="text"]').value;
    if(_unsafeLogin.length < 3) return alert('В логине должно быть более 3-х символов включительно');
    
    const _unsafeEmail = register.querySelector('input[type="email"]').value;
    if(!validateEmail(_unsafeEmail)) return alert('Введите действительную почту');

    const _nick = register.querySelector('input[type="nick"]').value;
    if(_nick.length < 2) return alert('В нике должно быть более 2-х символов включительно');

    const _unsafePass = register.querySelector('input[type="password"]').value;
    if(_unsafePass.length < 8) return alert('В пароле должно быть более 8-и символов включительно');

    const _pass = await hash(_unsafePass);
    const _crypto = await CryptoData(_unsafeEmail, _unsafeLogin, _nick, _pass, hash, (new Date).getFullYear());

    const req = await postData('/auth/register', {login: _crypto.login, pass: _pass, email: _crypto.email, nick: _nick});

    sended = false;
    if(req.error) return alert(req.msg);
    alert('Ваш аккаунт зарегистрирован. Вам было отправлено сообщение на почту');
    register.querySelector('input[type="text"]').value = '';
    register.querySelector('input[type="email"]').value = '';
    register.querySelector('input[type="nick"]').value = '';
    register.querySelector('input[type="password"]').value = '';
    register.querySelector('span[class="change.win"').click();
});
}


{
let sended = false;
const reset = document.querySelector('.reset');
reset.querySelector('.click').addEventListener('click', async() => {
    if(sended) return alert('Запрос уже отправлен');
    sended = true;
    const _unsafeEmail = reset.querySelector('input[type="email"]').value;
    if(!validateEmail(_unsafeEmail)) return alert('Введите действительную почту');

    const _email = await CryptoMail(_unsafeEmail, hash, (new Date).getFullYear());
    const req = await postData('/auth/reset', {email: _email});
    
    sended = false;
    if(req.error) return alert(req.msg);
    alert('На вашу почту было отправлено сообщение с восстановлением пароля');
});
}

async function postData(url = '', data = {}) {
    let host = '';
    const response = await fetch(host+url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return response.json();
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
function validateEmail(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
}
})();