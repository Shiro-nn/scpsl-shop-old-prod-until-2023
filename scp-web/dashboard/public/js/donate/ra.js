let force = false;
let give = false;
let effects = false;
let players_roles = false;
let ra_open = false;
let prefix = 'Donater';
let color = '#ffdd00';
let sum = 0;/* изменив сумму здесь, цена не уменьшится, она нужна для отображения стоимости */
let promo = 0;/*та же система*/
let promocode = '';
const cdn_host = 'https://cdn.scpsl.shop';
$(document).ready(function () {
    const usuid = 'ra.username.uid';
    socket.on('username', (username, uid) => {
        if(uid != usuid) return;
        document.getElementById('ra.get.username').innerHTML = username;
    });
    socket.emit('username', 'this', usuid);
    setInterval(() => {
        document.getElementById('ra_sum').innerHTML = `Стоимость: ${Math.round((sum/100)*(100 - promo))}₽`;
        document.getElementById('ra_buy_sum').innerHTML = Math.round((sum/100)*(100 - promo));
    }, 1000);
    startup();
    Promo_Check();
    document.getElementById('ra_blur').style = 'filter: blur(4px);';
});
$('.open_ra').click(function(e){
    sum+=25;
    ra_open = true;
    $(`.open_ra`).fadeOut(0);
    $(`#blur`).fadeOut(500);
    ColorStart();
    document.getElementById('ra_blur').style = '';
});
$('#ra_rules_open').click(function(e){
    $(`#ra_rules`).fadeIn(700);
});
$('#ra_rules_close').click(function(e){
    $(`#ra_rules`).fadeOut(700);
});
$('#buy_ra_click').click(function(e){
    $(`#buy_ra`).fadeIn(700);
});
$('#buy_ra_close').click(function(e){
    $(`#buy_ra`).fadeOut(700);
});
$('#ra_welcome').click(function(e){
    $(`.ra_welcome`).fadeIn(0);
    $(`#ra_give_img`).fadeOut(0);
    $(`#ra_give_open`).fadeOut(0);
    $(`#ra_force_img`).fadeOut(0);
    $(`#ra_force_open`).fadeOut(0);
    $(`#ra_effects_img`).fadeOut(0);
    $(`#ra_effects_open`).fadeOut(0);
    SetSelect('ra_welcome');
});
$('#ra_force').click(function(e){
    $(`.ra_welcome`).fadeOut(0);
    $(`#ra_give_img`).fadeOut(0);
    $(`#ra_give_open`).fadeOut(0);
    $(`#ra_effects_img`).fadeOut(0);
    $(`#ra_effects_open`).fadeOut(0);
    $(`#ra_force_img`).fadeIn(0);
    $(`#ra_force_open`).fadeIn(0);
    SetSelect('ra_force');
});
$('#ra_give').click(function(e){
    $(`.ra_welcome`).fadeOut(0);
    $(`#ra_force_img`).fadeOut(0);
    $(`#ra_force_open`).fadeOut(0);
    $(`#ra_effects_img`).fadeOut(0);
    $(`#ra_effects_open`).fadeOut(0);
    $(`#ra_give_img`).fadeIn(0);
    $(`#ra_give_open`).fadeIn(0);
    SetSelect('ra_give');
});
$('#ra_effects').click(function(e){
    $(`.ra_welcome`).fadeOut(0);
    $(`#ra_give_img`).fadeOut(0);
    $(`#ra_give_open`).fadeOut(0);
    $(`#ra_force_img`).fadeOut(0);
    $(`#ra_force_open`).fadeOut(0);
    $(`#ra_effects_img`).fadeIn(0);
    $(`#ra_effects_open`).fadeIn(0);
    SetSelect('ra_effects');
});
$('#ra_players_open').click(function(e){
    sum+=50;
    players_roles = true;
    document.getElementById('ra_players_blur').outerHTML = '';
    document.getElementById('ra_players_open').outerHTML = '';
    document.querySelectorAll("#ra_players_role").forEach(function(element) {
        element.style = `color: ${RandomRoleColor()} !important`;
    });
});
$('#ra_force_open').click(function(e){
    sum+=100;
    force = true;
    document.getElementById('ra_force_img').style = '';
    document.getElementById('ra_force_open').outerHTML = '';
});
$('#ra_give_open').click(function(e){
    sum+=100;
    give = true;
    document.getElementById('ra_give_img').style = '';
    document.getElementById('ra_give_open').outerHTML = '';
});
$('#ra_effects_open').click(function(e){
    sum+=200;
    effects = true;
    document.getElementById('ra_effects_img').style = '';
    document.getElementById('ra_effects_open').outerHTML = '';
});
function SetSelect(_) {
    if(document.getElementById('ra_welcome').classList.contains('ra_active')){
        document.getElementById('ra_welcome').classList.remove('ra_active');
        document.getElementById('ra_welcome').classList.add('ra_unblock');
    }
    if(document.getElementById('ra_force').classList.contains('ra_active')){
        document.getElementById('ra_force').classList.remove('ra_active');
        document.getElementById('ra_force').classList.add('ra_unblock');
    }
    if(document.getElementById('ra_give').classList.contains('ra_active')){
        document.getElementById('ra_give').classList.remove('ra_active');
        document.getElementById('ra_give').classList.add('ra_unblock');
    }
    if(document.getElementById('ra_effects').classList.contains('ra_active')){
        document.getElementById('ra_effects').classList.remove('ra_active');
        document.getElementById('ra_effects').classList.add('ra_unblock');
    }
    if(!document.getElementById(_).classList.contains('ra_active') || document.getElementById(_).classList.contains('ra_unblock')){
        document.getElementById(_).classList.remove('ra_unblock');
        document.getElementById(_).classList.add('ra_active');
    }
}
function ra_input_update(element) {
    setTimeout(() => {
        prefix = element.value;
        element.style.width = ((element.value.length) * 15) + 'px';
        if(element.value.length > 5) element.style.width = (((element.value.length) * 15) / 1.2) + 'px';
    }, 100);
}
function startup() {
    const _color = document.getElementById('ra_color_input');
    _color.onclick = () => false;
    let picker = new CP(_color);
    picker.on('change', function(r, g, b) {
        color = this.color(r, g, b);
        this.source.value = color;
        document.getElementById('ra_color').style.color = color;
        document.getElementById('ra_input_text').style.color = color;
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function RandomRoleColor() {
    let rndm = getRandomInt(100);
    if(rndm < 20){
        return '#fdffbb'
    }
    else if(rndm < 40){
        return '#31d400'
    }
    else if(rndm < 60){
        return '#4f88ff'
    }
    else if(rndm < 65){
        return '#858585'
    }
    else if(rndm < 70){
        return '#ff0000'
    }
    else{
        return '#ff9200'
    }
}
function ColorStart() {
    setTimeout(() => {
        document.getElementById("ra_color_input").value = '#ff0000';
        document.getElementById('ra_color').style.color = '#ff0000';
        document.getElementById('ra_input_text').style.color = '#ff0000';
    }, 1000);
    setTimeout(() => {
        document.getElementById("ra_color_input").value = color;
        document.getElementById('ra_color').style.color = color;
        document.getElementById('ra_input_text').style.color = color;
    }, 3000);
    setTimeout(() => {
        document.querySelectorAll("#ra_force").forEach(function(element) {element.click()});
        setTimeout(() => {
            document.querySelectorAll("#ra_give").forEach(function(element) {element.click()});
            setTimeout(() => {
                document.querySelectorAll("#ra_effects").forEach(function(element) {element.click()});
                setTimeout(() => {
                    document.querySelectorAll("#ra_welcome").forEach(function(element) {element.click()});
                }, 1000);
            }, 1000);
        }, 1000);
    }, 500);
}



/*
function getPosition(e){
    var x = y = 0;
    if (!e) {
        var e = window.event;
    }
    x = e.clientX;
    y = e.clientY;
    return {x: x, y: y}
}

$('html').click(function(e){
    var coord = getPosition();
    var pos = $('.js_pos_check').offset();
    var elem_left = pos.left.toFixed(0);
    var elem_top = pos.top.toFixed(0);
    var x = coord.x - elem_left;
    var y = coord.y - elem_top;
    console.log(`top: ${y}px; left: ${x}px;`);
});
*/




function Promo_Check() {
    elem = document.querySelector(".promo_input");
    elem.addEventListener("input", Promo_Check_Update, false);
    elem.select();
}
function Promo_Check_Update(event) {
    SendPost(event.target.value)
}
let hourid = 1;
function SendPost(code) {
    promocode = code;
    if(document.getElementById('promo_status').classList.contains('fa-close')) document.getElementById('promo_status').classList.remove('fa-close');
    if(document.getElementById('promo_status').classList.contains('fa-check')) document.getElementById('promo_status').classList.remove('fa-check');
    document.getElementById('promo_status').classList.add('fa-hourglass-1');
    var _ = setInterval(() => {
        document.getElementById('promo_status').classList.remove(`fa-hourglass-${hourid}`);
        hourid++;
        if(hourid == 4) hourid = 1;
        document.getElementById('promo_status').classList.add(`fa-hourglass-${hourid}`);
    }, 1000);
    let getted = false;
    const uid = guid();
    socket.on("promocode", (data, error, guid) => {
        if(getted) return;
        if(uid != guid) return;
        if(error){
            promo = 0;
            document.getElementById('promo_status').classList.add(`fa-close`);
        }else{
            promo = data.to_user;
            document.getElementById('promo_status').classList.add(`fa-check`);
        }
        document.getElementById('promo_sum').innerHTML = promo;
        document.getElementById('ra_buy_sum').innerHTML = Math.round((sum/100)*(100 - promo));
        document.getElementById('ra_sum').innerHTML = `Стоимость: ${Math.round((sum/100)*(100 - promo))}₽`;
        clearInterval(_);
        document.getElementById('promo_status').classList.remove(`fa-hourglass-${hourid}`);
        getted = true;
    });
    socket.emit('promocode', code, uid);
}
const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}


$('#ra_buy_button').click(function(e){
    let server = document.getElementById('ra_server').value;
    var ra_data = {
        ra_open: ra_open,
        force: force,
        give: give,
        effects: effects,
        players_roles: players_roles,
        prefix: prefix,
        color: color,
        server: server,
        promocode: promocode,
    }
    waittwo();
    $.ajax({
        type:'post',
        url:`/donate/buy/ra`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 15000,
        data: JSON.stringify(ra_data),
        success:function() {
            document.getElementById('abp').style = 'color: lime !important';
            document.getElementById('abp').innerHTML = 'Успешно!';
            console.log('Поздравляю с покупкой🎉');
            setInterval(() => {
                window.location.href = "/info"
                document.getElementById('abp').style = '';
                document.getElementById('abp').innerHTML = 'Ваш запрос обрабатывается';
            }, 3000);
        },
        error:function(e, d, m) {
            if(e.responseText == 'ok'){
                document.getElementById('abp').style = 'color: lime !important';
                document.getElementById('abp').innerHTML = 'Успешно!';
                console.log('Поздравляю с покупкой🎉');
                setInterval(() => {
                    window.location.href = "/info"
                    document.getElementById('abp').style = '';
                    document.getElementById('abp').innerHTML = 'Ваш запрос обрабатывается';
                }, 3000);
            }else{
                try{
                    const json = JSON.parse(e.responseText);
                    if(json.message == 'login') return location.href = '/authorization';
                    let error = ''
                    if(json.message == 'server') error = ':<br>Неверный сервер.';
                    if(json.message == 'money'){
                        error = ':<br>Недостаточно средств.';
                        try{
                            OpenAndWrite(json.sum);
                            try{$('#blur_loader').fadeOut(0);}catch{}
                        }catch{
                            $.ajax({
                                type:'post',
                                url:`/api/balance`,
                                dataType: 'json',
                                contentType: 'application/json',
                                timeout: 5000,
                                data: JSON.stringify({sum: json.sum}),
                                success:(data) => send(data),
                                error:(e) => send(e.responseJson),
                            });
                            function send(data){
                                if(!data) return alert('Произошла ошибка при создании оплаты:\nОтвет не содержит объект данных');
                                if(data.error) return alert('Произошла ошибка при создании оплаты:\nОтвет содержит ошибку');
                                window.location.href = data.url;
                            }
                        }
                    }
                    document.getElementById('abp').innerHTML = 'Произошла ошибка' + error;
                }catch{document.getElementById('abp').innerHTML = 'Произошла ошибка';}
                document.getElementById('abp').style = 'color: red !important';
                setTimeout(() => {
                    $('#antiblur').fadeOut(0);
                    $('#blur_loader').fadeOut(0);
                    document.getElementById('blur_style').innerHTML = '';
                    document.getElementById('abp').style = '';
                    document.getElementById('abp').innerHTML = 'Ваш запрос обрабатывается';
                }, 3000);
            }
        }
    });
})
function waittwo() {
    bool = true;
    $('#antiblur').fadeIn(500);
    $('#blur_loader').fadeIn(0);
    $("#blur_style").append(`<link href="${cdn_host}/scpsl/css/loader.css" rel="stylesheet">`);
};