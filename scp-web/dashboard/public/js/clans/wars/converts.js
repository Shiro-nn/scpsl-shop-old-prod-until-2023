function GetStringFromDate(date) {
    const time = new Date(parseInt(date));
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    let str = dateTimePad(day, 2) + "." + dateTimePad(month, 2) + "." + dateTimePad(year, 2);
    const _hm2 = `${dateTimePad(hour, 2)}:${dateTimePad(minute, 2)}`;
    let _ret4 = str + ' ' + _hm2;
    {
        const _dn = new Date(Date.now());
        const now_day = _dn.getDate();
        const now_month = _dn.getMonth() + 1;
        const now_year = _dn.getFullYear();

        const nowDay = new Date(`${now_month}.${now_day}.${now_year}`);
        const dateDay = new Date(`${month}.${day}.${year}`);

        if(nowDay - dateDay == 0) _ret4 = str = `Сегодня, в ${_hm2}`;
        else if(nowDay - dateDay == 86400000) _ret4 = str = `Вчера, в ${_hm2}`;
        else if(nowDay - dateDay == -86400000) _ret4 = str = `Завтра, в ${_hm2}`;
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };
    const aria = time.toLocaleString("ru", options);
    return [str, aria, _hm2, _ret4];
}


function GetMapInfo(type, map) {
    if(type == 1){
        switch (map) {
            case 1: return {type: 'Лес', name:'Раньше это был склад', goal:'Ваша цель - захватить и удержать точки', images:[
                'https://cdn.scpsl.shop/another/fi9d9lunnp2l/image.png'
            ]};
            case 2: return {type: 'Захват точек', name:'Тайный склад Фонда', goal:'Ваша цель - захватить и удержать точки', images:[
                cdn_host+'/scpsl/clans/wars/maps/sklad/1.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/2.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/3.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/4.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/5.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/6.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/7.jpg',
                cdn_host+'/scpsl/clans/wars/maps/sklad/8.jpg',
            ]};
            default: break;
        }
    }
    return {type: 'Unknow', name:'Error', goal:'', images:[]};
}

function GetDataCenter(location) {
    switch (location) {
        case 0: return ['earth', 'Свободный'];
        case 1: return ['russia', 'Москва'];
        case 2: return ['austria', 'Вена'];
        case 3: return ['germany', 'Фалькенштейн'];
        case 4: return ['finland', 'Хельсинки'];
        case 5: return ['netherlands', 'Амстердам'];
        default: return ['', 'Unknow'];
    }
}



function dateTimePad(value, digits){
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}