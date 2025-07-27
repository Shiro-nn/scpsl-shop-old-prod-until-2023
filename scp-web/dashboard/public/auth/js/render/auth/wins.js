(async()=>{
let inproccess = false;
const login = document.querySelector('.login');
const forgot = document.querySelector('.reset');
const register = document.querySelector('.register');

login.querySelector('.forgot span').addEventListener('click', () => HideAndShow(login, forgot));

login.querySelector('span[class="change.win"').addEventListener('click', () => HideAndShow(login, register));

forgot.querySelector('span[class="change.win"').addEventListener('click', () => HideAndShow(forgot, login));

register.querySelector('span[class="change.win"').addEventListener('click', () => HideAndShow(register, login));

function HideAndShow(hide, show) {
    if(inproccess) return;
    inproccess = true;
    hide.style = '';
    show.style = '';
    hide.classList.remove('show');
    show.classList.remove('hide');
    hide.classList.add('hide');
    show.classList.add('show');
    inproccess = false;
}

})();