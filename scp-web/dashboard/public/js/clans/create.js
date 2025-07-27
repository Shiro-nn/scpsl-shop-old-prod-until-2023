let cdn_host = 'https://cdn.scpsl.shop';
window.addEventListener('load', () => {
    cdn_host = document.getElementById('cdn_host').innerHTML;
    document.getElementById('cdn_host').outerHTML = '';
    document.getElementById('clan_tag').addEventListener('input', function(){
        this.value = this.value.replace(/[^A-Za-z]/ig, '');
        if(this.value.length > 3) this.value = this.value.substr(0,4);
    });
    const _color = document.getElementById('clan_color');
    _color.onclick = () => false;
    let picker = new CP(_color);
    picker.on('change', function(r, g, b) {
        this.source.value = this.color(r, g, b);
    });
    try{$("#clan_desc").autogrow();}catch{}
});
$('#clan_buy_button').click((e) => SendRequest());
let InProcess = false;
function SendRequest() {
    if(InProcess) return;
    InProcess = true;
    var _data = {
        clan_tag: document.getElementById('clan_tag').value,
        clan_name: document.getElementById('clan_name').value,
        clan_desc: document.getElementById('clan_desc').value,
        clan_public: document.getElementById('clan_public').checked,
        clan_color: document.getElementById('clan_color').value
    }
    waittwo();
    $.ajax({
        type:'post',
        url:`/clans/create`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify(_data),
        success:function(data) {
            InProcess = false;
            console.log(data)
            document.getElementById('abp').style = 'color: lime !important';
            document.getElementById('abp').innerHTML = 'Успешно!';
            console.log('Поздравляю с созданием клана 🎉');
            setTimeout(() => {
                window.location.href = data.split(':')[1];
                document.getElementById('abp').style = '';
                document.getElementById('abp').innerHTML = 'Ваш запрос обрабатывается';
            }, 3000);
        },
        error:function(e, d, m) {
            InProcess = false;
            if(e.responseText == undefined) return SendRequest();
            if(e.responseText.includes('ok')){
                document.getElementById('abp').style = 'color: lime !important';
                document.getElementById('abp').innerHTML = 'Успешно!';
                console.log('Поздравляю с созданием клана 🎉');
                setTimeout(() => {
                    window.location.href = e.responseText.split(':')[1];
                    document.getElementById('abp').style = '';
                    document.getElementById('abp').innerHTML = 'Ваш запрос обрабатывается';
                }, 3000);
            }else{
                let error = ''
                if(e.responseText == 'tag') error = ':<br>Этот тег уже используется';
                if(e.responseText == 'money') error = ':<br>Недостаточно средств';
                if(e.responseText == 'name') error = ':<br>Пустое название';
                if(e.responseText == 'already') error = ':<br>Вы уже создали клан';
                if(e.responseText == 'many') error = ':<br>Вы уже вступили в 3 клана';
                document.getElementById('abp').style = 'color: red !important';
                document.getElementById('abp').innerHTML = 'Произошла ошибка' + error;
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
}
function waittwo() {
    $('#antiblur').fadeIn(500);
    $('#blur_loader').fadeIn(0);
    $("#blur_style").append(`<link href="${cdn_host}/scpsl/css/loader.css" rel="stylesheet">`);
};