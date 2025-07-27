document.querySelector('#balanceup .balance').addEventListener('click', () => {
    const element = document.querySelector('#navbarpayment.payment');
    element.classList.remove('hide');
});
document.querySelector('#navbarpayment.payment .clickToHide').addEventListener('click', () => {
    const element = document.querySelector('#navbarpayment.payment');
    element.classList.add('hide');
});

(async() => {
let wayspays = [];
let wayIdToElement = [];
let selectedPayment = null;

const inputElement = document.querySelector('#navbarpayment .sumInput');
inputElement.addEventListener('input', () => {
    let _sum = parseInt(inputElement.value);
    const _max = parseInt(inputElement.getAttribute('max'));

    if(_sum > _max) _sum = _max;

    inputElement.value = _sum;
    
    if(!selectedPayment) return;
    let eta = _sum;
    if(eta < selectedPayment.min) eta = selectedPayment.min;
    document.querySelector('#navbarpayment .eta b').innerHTML = eta;
});

document.querySelector('#navbarpayment .pay').addEventListener('click', async() => {
    let eta = parseInt(inputElement.value);
    if (selectedPayment && eta < selectedPayment.min) {
        eta = selectedPayment.min;
    }

    let url = `/api/payment?type=${selectedPayment.id}&sum=${eta}`;

    const res = await fetch(url, {method: 'POST'});
    const json = await res.json();

    if (json.error) {
        alert(json.msg);
        return;
    }

    if (json.isPost == true) {
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = json.url;
        document.body.appendChild(form);

        for (var key in json.data) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = json.data[key];
            form.appendChild(input);
        }
        
        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);
        submit.click();
        return;
    }

    window.location.href = json.url;
})

const res = await fetch('/api/payment/list', {method:'POST'});
const json = await res.json();

const root = document.querySelector('#navbarpayment ._services');
root.innerHTML = '';
for (let i = 0; i < json.length; i++) {
    const blockPays = json[i];
    const name = document.createElement('h2');
    name.innerHTML = blockPays.label;
    root.appendChild(name);

    const waysRoot = document.createElement('div');
    waysRoot.className = 'services';
    root.appendChild(waysRoot);

    for (let y = 0; y < blockPays.ways.length; y++) {
        const way = blockPays.ways[y];
        wayspays.push(way);

        const wayElement = document.createElement('div');
        wayElement.className = 'payservice';
        wayElement.onclick = () => SelectPayment(way);
        waysRoot.appendChild(wayElement);

        const img = document.createElement('img');
        img.src = '/img/pays/' + way.img + '.png';
        wayElement.appendChild(img);

        const wayName = document.createElement('span');
        wayName.innerHTML = way.name;
        wayElement.appendChild(wayName);

        const comms = document.createElement('span');
        comms.className = 'coms';
        comms.innerHTML = way.commission;
        wayElement.appendChild(comms);

        wayIdToElement.push({id: way.id, element: wayElement});

    }
}

let preferer = localStorage.getItem('preferer.pay');
if (!preferer) {
    preferer = 3;
    localStorage.setItem('preferer.pay', preferer);
}
SelectPayment(wayspays.find(x => x.id == preferer) ?? json[0].ways[0]);

function SelectPayment(way) {
    selectedPayment = way;
    localStorage.setItem('preferer.pay', way.id);

    const element = document.querySelector('#navbarpayment .selected');
    element.querySelector('.method img').src = '/img/pays/' + way.img + '.png';
    element.querySelector('.method h2').innerHTML = way.name;
    element.querySelector('.info .comission').innerHTML = 'Комиссия: ' + way.commission;
    element.querySelector('.info .minsum').innerHTML = 'Минимальная сумма платежа: ' + way.min + ' ₽';

    const selectedSum = parseInt(inputElement.value);
    if (selectedSum < way.min) {
        document.querySelector('#navbarpayment .eta b').innerHTML = way.min;
    } else {
        document.querySelector('#navbarpayment .eta b').innerHTML = selectedSum;
    }

    const activePays = document.querySelectorAll('#navbarpayment.payment .window .services .payservice.activeWay');
    activePays.forEach(element => {
        element.classList.remove('activeWay');
    });

    let payService = wayIdToElement.find(x => x.id == way.id);
    if (!payService) {
        return;
    }
    payService.element.classList.add('activeWay');
}
})();


function OpenAndWrite(sum) {
    document.querySelector('#balanceup .balance').click();

    const _parse = parseInt(sum);
    if(isNaN(_parse) || _parse < 0) {
        return;
    }
    
    const inputElement = document.querySelector('#navbarpayment .sumInput');
    inputElement.value = sum;
    inputElement.dispatchEvent(new CustomEvent('input', {}));
}