(async() => {
let element;
{
    const _par = document.getElementById('exchequer.menu');
    _par.innerHTML = '';

    element = document.createElement('div');
    element.className = 'em1';
    element.style.display = 'none';
    _par.appendChild(element);

    const e2 = document.createElement('div');
    e2.className = 'em2';
    element.appendChild(e2);

    {
        const e3 = document.createElement('i');
        e3.className = 'fa-light fa-circle-xmark em4';
        e3.addEventListener('click', () => element.style.display = 'none');
        e2.appendChild(e3);
        
        const e4 = document.createElement('span');
        e4.className = 'em3';
        e4.innerHTML = 'Пополнение казны клана';
        e2.appendChild(e4);
        
        const e5 = document.createElement('div');
        e5.className = 'em5';
        e2.appendChild(e5);
        
        {
            const e6 = document.createElement('label');
            e6.className = 'em6';
            e6.innerHTML = 'Положить рубли';
            e2.appendChild(e6);
            
            const e7 = document.createElement('div');
            e7.className = 'em7';
            e2.appendChild(e7);
            
            const e8 = document.createElement('input');
            e8.className = 'em8';
            e8.maxLength = '5';
            e8.placeholder = 'Введите кол-во рублей';
            e7.appendChild(e8);
            e8.addEventListener('input', function(){
                this.value = this.value.replace(/[^0-9]/g, '').substring(0, 5);
            });
            
            const e9 = document.createElement('button');
            e9.className = 'cs13';
            e9.innerHTML = '<div class="cs14">Пожертвовать</div>';
            e7.appendChild(e9);
            e9.onclick = () => {
                clanSocket.emit('add.exch', 1, e8.value);
                e8.value = '';
            }
        }
        
        {
            const e6 = document.createElement('label');
            e6.className = 'em6';
            e6.innerHTML = 'Положить монетки';
            e2.appendChild(e6);
            
            const e7 = document.createElement('div');
            e7.className = 'em7';
            e2.appendChild(e7);
            
            const e8 = document.createElement('input');
            e8.className = 'em8';
            e8.maxLength = '7';
            e8.placeholder = 'Введите кол-во монеток';
            e7.appendChild(e8);
            e8.addEventListener('input', function(){
                this.value = this.value.replace(/[^0-9]/g, '').substring(0, 7);
            });
            
            const e9 = document.createElement('button');
            e9.className = 'cs13';
            e9.innerHTML = '<div class="cs14">Пожертвовать</div>';
            e7.appendChild(e9);
            e9.onclick = () => {
                clanSocket.emit('add.exch', 2, e8.value);
                e8.value = '';
            }
        }
    }
}

const par = document.querySelector('.cs18');
const clc = par.querySelector('i');
clc.addEventListener('click', () => element.style.display = '');
tippy(par, {content: 'Нажмите, чтобы пополнить казну клана', animation: 'perspective', placement: 'bottom'});
})();