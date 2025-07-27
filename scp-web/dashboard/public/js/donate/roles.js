const cdn_host = 'https://cdn.scpsl.shop';
function waittwo() {
    $('#antiblur').fadeIn(500);
    $('#blur_loader').fadeIn(0);
    $("#blur_style").append(`<link href="${cdn_host}/scpsl/css/loader.css" rel="stylesheet">`);
};
let donates = [];
socket.on("donate_roles", (data) => donates = data);
socket.on("connect", () => socket.emit('donate_roles'));
if(socket.connected) socket.emit('donate_roles');

$('.buy').on('click', function (ev) {
    const dnt = donates.find(x => x.id == parseInt(ev.target.id));
    if(dnt.allServers) document.getElementById('RS').style.display = 'none';
    else document.getElementById('RS').style.display = '';
    document.getElementById('buy_another_sum').innerHTML = dnt.sum;
    document.getElementById('buy_another_name').innerHTML = dnt.genitive;
    document.getElementsByClassName('buy_another_button')[0].id = ev.target.id;
    $('#buy_another').fadeIn();
});
$('#buy_another_close').on('click', function (ev) {
    $('#buy_another').fadeOut();
});
$('.buy_another_button').click(function(ev){
    const server = document.getElementById('server_list').value;
    waittwo();
    $.ajax({
        type:'post',
        url:`/donate/buy/roles`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({id: ev.target.id, server}),
        success:function(data) {
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
                    if(json.message == 'id') error = ':<br>Неверный ID привилегии.';
                    else if(json.message == 'server') error = ':<br>Неверный сервер.';
                    else if(json.message == 'money'){
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