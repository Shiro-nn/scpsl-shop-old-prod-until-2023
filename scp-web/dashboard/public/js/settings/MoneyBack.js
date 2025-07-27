{
let donateId = '';
let moneyBack = 0;
$('#MoneyBackClose').on('click', function (ev) {
    $('#MoneyBack').fadeOut(500);
    setTimeout(() => {
        document.getElementById('MoneyBackDonate').style = '';
        document.getElementById('MoneyBackDonate').innerHTML = '';
        document.getElementById('MoneyBackSum').innerHTML = '';
    }, 500);
    donateId = '';
    moneyBack = 0;
});
$('#MoneyBackSubmit').on('click', async function (ev) {
    if(donateId == '') return;
    Waiting(ev);
    $.ajax({
        type:'post',
        url:`/api/donate?donate=${donateId}&type=moneyback`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 15000,
        success:async function(data) {
            WaitingStop();
            if(data == 'ok') Update();
        },
        error:async function(e, d, m) {
            WaitingStop();
            if(e.responseText == 'ok') Update();
        }
    });
    async function Update() {
        try{
            document.getElementById(`back=>${donateId}`).outerHTML = '';
            let mb = moneyBack;
            $('#MoneyBackClose').click();
            let blnc = parseInt(document.getElementById('balance').innerHTML);
            while (mb > 0) {
                blnc++;
                mb--;
                document.getElementById('balance').innerHTML = blnc;
                await sleep(10);
            }
        }catch{location.reload()}
    }
});
$('.MoneyBackClick').on('click', function (ev) {
    Waiting(ev);
    $.ajax({
        type:'post',
        url:`/api/donate?donate=${ev.target.id}&type=info`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 15000,
        success:function(data) {
            if(data.owner != null && data.owner != undefined) LoadLater(data);
        },
        error:function(e, d, m) {
            if(e.responseText == undefined) return WaitingStop();
            if(e.responseText == '404' || e.responseText == '401') return WaitingStop();
            if(e.responseText.owner != null && e.responseText.owner != undefined) LoadLater(e.responseText);
            else return WaitingStop();
        }
    });
    function LoadLater(data) {
        document.getElementById('MoneyBackDonate').style.color = data.color;
        document.getElementById('MoneyBackDonate').innerHTML = data.prefix;
        moneyBack = GetMoney(data.sum, data.promo, data.to);
        document.getElementById('MoneyBackSum').innerHTML = moneyBack;
        WaitingStop();
        donateId = ev.target.id;
        $('#MoneyBack').fadeIn();
    }
    function GetMoney(sum, promo, date) {
        let allow_back = sum-promo;
        if(0 >= allow_back) return 0;
        var datetime_regex = /(\d\d)\.(\d\d)\.(\d\d\d\d)\s(\d\d):(\d\d)/;
        var date_arr = datetime_regex.exec(date);
        let days = 30;
        if(date_arr[2] == 2 || date_arr[2] == 4 || date_arr[2] == 6 || date_arr[2] == 8 || date_arr[2] == 9 || date_arr[2] == 11 || date_arr[2] == 1) days = 31;
        var to = new Date(date_arr[3], date_arr[2]-=1, date_arr[1]-=1, date_arr[4], date_arr[5]);
        let tt = getDaysBetweenDates(Date.now(),to);
        if(tt > 30) tt = 0;
        return Math.round((sum/days)*tt);
    }
    function getDaysBetweenDates(d0, d1) {
        var msPerDay = 8.64e7;
        var x0 = new Date(d0);
        var x1 = new Date(d1);
        x0.setHours(12,0,0);
        x1.setHours(12,0,0);
        return Math.round( (x1 - x0) / msPerDay );
    }
});
function getPosition(ev = null){
    var x = y = 0;
    if (!ev) {
        var ev = window.event;
    }
    if (ev.pageX || ev.pageY){
        x = ev.pageX;
        y = ev.pageY;
    } else if (ev.clientX || ev.clientY){
        x = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {x: x, y: y}
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
}