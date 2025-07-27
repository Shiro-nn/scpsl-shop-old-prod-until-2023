(async() => {
const donates = await (async() => {
const res = await fetch('/donate/get/roles', {method:'POST'});
return await res.json();
})();

document.querySelectorAll('.donateCount').forEach(ell => {
    var parentElement = ell.parentElement;

    const donateId = parentElement.getAttribute('data-id');
    ell.innerHTML = `${donates.roles.find(x => parseInt(donateId) == x.id).sum} ₽`;
});

document.querySelectorAll('.buyDonate').forEach(ell => {
    ell.addEventListener('click', () => {
        const donateId = ell.parentElement.getAttribute('data-id');
        const role = donates.roles.find(x => parseInt(donateId) == x.id);
        document.querySelector('.confirmBuy').setAttribute('data-id', donateId);
        document.getElementById('donateName').innerHTML = `${role.genitive}`;
        if(role.id == 1) {
            document.getElementById('donateName').classList.add('rainbow');
        } else {
            document.getElementById('donateName').classList.remove('rainbow');
            document.getElementById('donateName').style.color = role.color;
        }
        document.getElementById('donateCount').innerHTML = getDonateCount(role, document.querySelector('.selectDuration').value);

        document.querySelector('.content').style.opacity = "0.1";
        document.querySelector('.content').style.pointerEvents = "none";
        document.querySelector('.confirmBuy').style.display = 'flex';
    })
});

document.querySelector('.selectDuration').addEventListener('change', () => {
    const donateId = document.querySelector('.selectDuration').parentElement.parentElement.getAttribute('data-id');
    const role = donates.roles.find(x => parseInt(donateId) == x.id);
    document.getElementById('donateCount').innerHTML = getDonateCount(role, document.querySelector('.selectDuration').value)
});

document.getElementById('closeConfirmBuy').addEventListener('click', () => {
    document.querySelector('.content').style.opacity = "1"
    document.querySelector('.confirmBuy').style.animation = 'slideDown 1s ease-in-out forwards'
    setTimeout(() => {
        document.querySelector('.confirmBuy').setAttribute('data-id', "none")
        document.querySelector('.confirmBuy').style.animation = 'slideUp 1s ease-in-out forwards'
        document.querySelector('.confirmBuy').style.display = 'none'
        document.querySelector('.content').style.pointerEvents = "auto"
    }, 1000)
});

document.getElementById('donateBuy').addEventListener('click', async(ev) => {
    if (ev.target.className == "inprogress") {
        return;
    }

    const donateId = document.querySelector('.confirmBuy').getAttribute('data-id');
    const role = donates.roles.find(x => parseInt(donateId) == x.id);

    if (!role) {
        alert("Массив с донатом не найден, скрипты кривые");
        return;
    }

    let mounth = 1;
    switch (document.querySelector('.selectDuration').value) {
        case "3 месяца": mounth = 3; break;
        case "6 месяцев": mounth = 6; break;
        default: break;
    }

    ev.target.className = 'inprogress';

    const buy_res = await fetch('/donate/buy/roles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: role.id,
            mounth: mounth,
        }),
    });

    const buy_json = await buy_res.json();

    switch (buy_json.message) {
        case "ok": {
            window.location.href = '/info';
            break;
        }
        case "login": {
            window.location.href = '/auth';
            break;
        }
        case "money": {
            OpenAndWrite(buy_json.sum);
            break;
        }
        case "id": {
            alert("Неизвестный ID доната");
            break;
        }
        case "mounth": {
            alert("Неизвестный срок покупки");
            break;
        }
        default: {
            alert("Неизвестный ответ от сервера");
            break;
        }
    }

    ev.target.className = '';
});

function getDonateCount(role, duration) {
    const defaultDiscount = Math.floor(role.sum * (donates.discount / 100));
    const roleSum = Math.floor(role.sum - defaultDiscount);
    if(duration == "1 месяц") {
        if(role.sum != roleSum) {
            document.querySelector('.economy').style.display = 'block';
            document.getElementById('moneyEconomy').innerText = `${defaultDiscount} ₽`;
        } else {
            document.querySelector('.economy').style.display = 'none';
        }
        return `${roleSum} ₽`;
    } else if(duration == "3 месяца") {
        document.querySelector('.economy').style.display = 'block';

        const month = 3;
        const role_sum_x = roleSum * month;
        const sum = Math.floor(role_sum_x - (role_sum_x * 0.05));

        document.getElementById('moneyEconomy').innerText = `${(role.sum * month) -sum} ₽`;
        return `${sum} ₽`;
    } else if(duration == "6 месяцев") {
        document.querySelector('.economy').style.display = 'block';

        const month = 6;
        const role_sum_x = roleSum * month;
        const sum = Math.floor(role_sum_x - (role_sum_x * 0.1));

        document.getElementById('moneyEconomy').innerText = `${(role.sum * month) -sum} ₽`;
        return `${sum} ₽`;
    }
}
})();