let peremen = true;
let cdn_host, _username, _giflink;
let gif = false;
let loading = false;
socket.on('get.profile', async(user) => {
    _username = user.id;
    document.getElementById('avatar').style.backgroundImage = `url(${user.avatar})`;
    document.getElementById('profile.username').innerHTML = user.username;
    {
        const achievements = document.getElementById('profile.achievements');
        achievements.innerHTML = '';
        user.achievements.forEach(function(achievement) {
            if(achievement != null){
                const _e1 = document.createElement("div");
                _e1.className = 'z23';
                achievements.appendChild(_e1);
                const _e2 = document.createElement("div");
                _e2.className = 'achievement';
                _e1.appendChild(_e2);
                tippy(_e2, {content: achievement.desc, theme: 'translucent', animation: 'perspective', placement: 'bottom'});
                const _e3 = document.createElement("div");
                _e3.className = 'z24';
                _e3.style.backgroundImage = `url('${achievement.img}')`;
                _e2.appendChild(_e3);
            }
        });
    }
    document.getElementById('profile.balance').innerHTML = `${user.balance}₽`;
    document.getElementById('profile.uid').innerHTML = user.id;
    if(user.discord == ''){
        const dsprof = document.getElementById('profile.discord.user');
        dsprof.className = 'z17';
        dsprof.innerHTML = 'Не привязан';
        document.getElementById('profile.discord.click').innerHTML = 'Привязать';
    }else{
        const dsprof = document.getElementById('profile.discord.user');
        dsprof.className = 'c15';
        dsprof.innerHTML = '@Invalid User';
        GetDiscord(dsprof, user.discord);
        document.getElementById('profile.discord.click').innerHTML = 'Обновить';
    }
    if(user.steam == ''){
        document.getElementById('profile.steam.id').innerHTML = 'Не привязан';
        document.getElementById('profile.steam.click').innerHTML = 'Привязать';
    }else{
        document.getElementById('profile.steam.id').innerHTML = user.steam;
        document.getElementById('profile.steam.click').innerHTML = 'Обновить';
    }
    document.getElementById('profile.prefix').value = user.prefix;
    document.getElementById('profile.name.setter').value = user.name;
    document.getElementById('profile.avatar.in.banner').src = user.avatar;
    if(user.banner == ''){
        document.getElementById('profile.banner.delete').style.display = 'none';
        RGBaster.colors(user.avatar, {success:(payload) => document.getElementsByClassName('z41')[0].style.backgroundColor = payload.dominant});
    }else{
        document.getElementById('profile.banner.delete').style = '';
        document.getElementsByClassName('z41')[0].style = `background-image: url(${user.banner});`;
    }
});
socket.emit('get.profile');
{
    const pic = document.getElementById('profile.uid.click');
    const pie = document.getElementById('profile.uid');
    pic.addEventListener('click', () => {
        navigator.clipboard.writeText(pie.innerHTML);
        pic.style.backgroundColor = 'lime';
        setTimeout(() => pic.style = '', 2000);
    });
    document.getElementById('profile.discord.user').addEventListener("click", RenderDiscordProfile);
}
$('#pref_update').on('click', function (ev) {
    document.getElementById('pref_update').style.backgroundColor = 'lime';
    setTimeout(() => document.getElementById('pref_update').style = '', 1000);
    let _prefix = document.getElementById('profile.prefix').value;
    $.ajax({
        type:'post',
        url:`/api/prefix`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({prefix: _prefix})
    });
});
$('#name_update').on('click', function (ev) {
    document.getElementById('name_update').style.backgroundColor = 'lime';
    setTimeout(() => document.getElementById('name_update').style = '', 1000);
    let _name = document.getElementById('profile.name.setter').value;
    $.ajax({
        type:'post',
        url:`/api/name`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({name: _name})
    });
});
var $uploadCrop;
var $uploadCropLogo;
$(document).ready(function () {
    $uploadCrop = $('#upload').croppie({
        viewport: {width: 400, height: 400},
        enableExif: true,
        //enableOrientation: true,
    });
    $uploadCropLogo = $('#uploadLogo').croppie({
        viewport: {width: 300, height: 120},
        enableExif: true,
    });
    try{
        document.getElementById("load_data").click();
        setTimeout(() => document.getElementById("load_data").outerHTML = ``, 500);
    }catch{}
});
$('.z0').on('click', function (ev) {
    $('.q1').fadeOut(500);
    document.getElementById('f1').value = null;
    if(peremen) $('.w1').fadeOut(500);
});
$('.q6').on('click', function (ev) {
    $('.q1').fadeOut(500);
    document.getElementById('f1').value = null;
});
$('.upload-result').on('click', async function (ev) {
    if(gif){
        let link = _giflink;
        var file = await URLtoFile(link,'filedata');
        document.getElementById('avatar').style = `background-image: url("${link}");`;
        document.getElementById(`avatar_panel`).style = `background-image: url("${link}");`;
        document.getElementsByClassName('z46')[0].src = link;
        RGBaster.colors(link, {
            success: function(payload) {
              document.getElementsByClassName('z41')[0].style.backgroundColor = payload.dominant;
            }
        });
        var format = file.type.split('/')[1];
        uploader(file, format);
    }else{
        $uploadCrop.croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then(function (resp) {
            var file = dataURLtoFile(resp,'filedata.png');
            document.getElementById('avatar').style = `background-image: url("${createObjectURL(file)}");`
            document.getElementById(`avatar_panel`).style = `background-image: url("${createObjectURL(file)}");`;
            document.getElementsByClassName('z46')[0].src = createObjectURL(file);
            RGBaster.colors(createObjectURL(file), {
                success: function(payload) {
                  document.getElementsByClassName('z41')[0].style.backgroundColor = payload.dominant;
                }
            });
            uploader(file, 'png');
        });
    }
});
$('.w5').on('click', function (ev) {
    let sum = document.getElementById('_sum').value;
    $.ajax({
        type:'post',
        url:`/api/balance`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({sum: sum}),
        success:(data) => send(data),
        error:(e, d, m) => send(e.responseJson),
    });
    function send(data){
        if(!data) return alert('Произошла ошибка при создании оплаты:\nОтвет не содержит объект данных');
        if(data.error) return alert('Произошла ошибка при создании оплаты:\nОтвет содержит ошибку');
        window.location.href = data.url;
        /*
        const form = document.createElement('form');
        form.style.display = 'none';
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'https://yoomoney.ru/quickpay/confirm.xml');

        document.body.appendChild(form);

        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'receiver');
            s.setAttribute('value', data.to);
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'quickpay-form');
            s.setAttribute('value', 'shop');
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'targets');
            s.setAttribute('value', 'fydne');
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'paymentType');
            s.setAttribute('value', 'PC');
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'sum');
            s.setAttribute('value', data.sum);
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'comment');
            s.setAttribute('value', `Пополнение баланса №${data.payment}`);
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'label');
            s.setAttribute('value', data.uid);
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'text');
            s.setAttribute('name', 'successURL');
            s.setAttribute('value', window.top.location.href);
            form.appendChild(s);
        }
        {
            const s = document.createElement('input');
            s.setAttribute('type', 'submit');
            s.setAttribute('value', 'Submit');
            form.appendChild(s);
            s.click();
        }
        */
    }
});
function uploader(file, format) {
    if(loading) return;
    document.getElementById(`select_avatar`).src = `${cdn_host}/bot/waiting.gif`;
    let hash = guid().replace("#", '').replace("?", '');
    var formData = new FormData();
    formData.append("name", hash);
    formData.append("dir", `scpsl/users/avatars/${_username}`);
    formData.append("filedata", file);
    var request = new XMLHttpRequest();
    request.open("POST", `${cdn_host.replace('cdn.', 'cdn-uploader.')}/upload`);
    loading = true;
    request.onload = function () {
        $.ajax({
            type:'post',
            url:`/api/avatar`,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 5000,
            data: JSON.stringify({hash, format})
        });
        $('.q1').fadeOut(500);
        document.getElementById('f1').value = null;
        loading = false;
    };
    request.send(formData);
}
$('input[class=f1]').change(function(e) {
    selecting_file = true;
    setTimeout(() => selecting_file = false, 2000);
    thisFunctionShoulBeCallByTheFileuploaderButton(e);
});
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
async function URLtoFile(url, filename){
    let response = await fetch(url);
    let data = await response.blob();
    var format = data.type.split('/')[1];
    return new File([data], `${filename}.${format}`, {type: data.type});
}
function convertURIToImageData(URI) {
    return new Promise(function(resolve, reject) {
        if (URI == null) return reject();
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
        image.addEventListener('load', function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        }, false);
        image.src = URI;
    });
}
function thisFunctionShoulBeCallByTheFileuploaderButton(e){
    e.preventDefault && e.preventDefault();
    var i;
    var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
    if(images && images.length) {
        for(i in images) {
            if(typeof images[i] != 'object') continue;
            /*if (images[i].type == 'image/gif') {
                _giflink = createObjectURL(images[i]);
                gif = true;
                document.getElementById(`select_avatar`).src = _giflink;
                $('#upload').fadeOut(0);
                $('.v1').fadeIn(500);
                $('.q1').fadeIn(500);
            }
            else*/
            if (images[i].type.match(/image.*/)) {
                gif = false;
                $uploadCrop.croppie('bind', {
                    url: createObjectURL(images[i])
                })
                $('.v1').fadeOut(0);
                $('#upload').fadeIn(0);
                $('.q1').fadeIn(500);
            }
        }
    }
}
function createObjectURL(i){
    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    return URL.createObjectURL(i);
}
function FileLoad() {
    document.querySelectorAll("#f1").forEach(function(element) {
        element.click()
    });
}

const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}


let loadingLogo = false;
$('input[class=f2]').change(function(e) {
    NextLoader();
    async function NextLoader() {
        e.preventDefault && e.preventDefault();
        var i;
        var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
        if(images && images.length) {
            for(i in images) {
                if(typeof images[i] != 'object') continue;
                if (images[i].type.match(/image.*/)) {
                    $uploadCropLogo.croppie('bind', {
                        url: createObjectURL(images[i])
                    })
                    document.getElementById('uploadLogo').style.display = '';
                    document.getElementById('cr-boundaryLogo').style.display = 'none';
                    $('#uploadLogo').fadeIn(0);
                    $('.m1').fadeIn(500);
                }
            }
        }
    }
});
$('.z36').on('click', function (ev) {
    document.getElementById('f2').click();
});
$('.z48').on('click', function (ev) {
    $.ajax({
        type:'post',
        url:`/api/banner/delete`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000
    });
    document.getElementsByClassName('z41')[0].style = '';
    RGBaster.colors(document.getElementsByClassName('z46')[0].src, {
        success: function(payload) {
          document.getElementsByClassName('z41')[0].style.backgroundColor = payload.dominant;
          $('.z48').fadeOut(500);
        }
    });
});
$('.m6').on('click', function (ev) {
    $('.m1').fadeOut(500);
    document.getElementById('f2').value = null;
});
$('.uploadLogo').on('click', async function (ev) {
    $uploadCropLogo.croppie('result', {
        type: 'canvas',
        size: 'viewport'
    }).then(function (resp) {
        document.getElementById('uploadLogo').style.display = 'none';
        document.getElementById(`selectLogo`).src = `${cdn_host}/bot/waiting.gif`;
        $('#cr-boundaryLogo').fadeIn();
        NextLoader();
        async function NextLoader() {
            var file = dataURLtoFile(resp,'filedata.png');
            document.getElementsByClassName('z41')[0].style = `background-image: url("${createObjectURL(file)}");`;
            uploadLogo(file, 'png');
        }
    });
});
function uploadLogo(file, format) {
    if(loadingLogo) return;
    document.getElementById(`selectLogo`).src = `${cdn_host}/bot/waiting.gif`;
    let hash = guid().replace("#", '').replace("?", '');
    var formData = new FormData();
    formData.append("name", hash);
    formData.append("dir", `scpsl/users/banner/${_username}`);
    formData.append("filedata", file);
    var request = new XMLHttpRequest();
    request.open("POST", `${cdn_host.replace('cdn.', 'cdn-uploader.')}/upload`);
    loading = true;
    request.onload = function () {
        $.ajax({
            type:'post',
            url:`/api/banner`,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 5000,
            data: JSON.stringify({hash, format})
        });
        $('.m1').fadeOut(500);
        $('.z48').fadeIn(500);
        document.getElementById('f2').value = null;
        loading = false;
    };
    request.send(formData);
}
$('#loginsteam').click(function(){
    window.location.href = "/steam";
    window.top.location.href = "/steam";
});
$('#logindiscord').click(function(){
    window.location.href = "/discord";
    window.top.location.href = "/discord";
});

async function GetDiscord(element, id) {
    const res = await fetch('https://api./discord?id='+id);
    const json = await res.json();
    if(json.status == 'error') return;
    element.innerHTML = `@${json.username}`;
}
function RenderDiscordProfile(ev) {
    Discord_Profile('this');
}