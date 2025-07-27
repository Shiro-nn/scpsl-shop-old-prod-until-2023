window.addEventListener("load", function() {
    let roleId = '';
    let roles = [];
    let AllRoles = [];
    if(socket.connected) SocketConnect();
    socket.on("connect", () => SocketConnect());
    function SocketConnect(){
        roles = [];
        socket.emit('donate_roles');
        const __ = document.getElementsByClassName('RFClick');
        for (let i = 0; i < __.length; i++) {
            socket.emit('GetRole', __[i].id);
        }
    }
    socket.on('disconnect', ()=>{
        roles = [];
        const __ = document.getElementsByClassName('RFClick');
        for (let i = 0; i < __.length; i++) {
            const el = __[i];
            el.innerHTML = '';
            el.className = el.className.replaceAll(' btn-bordred-warning', '').replaceAll(' btn-bordred-success', '') + ' hideRF';
        }
    });
    socket.on("donate_roles", (data) => AllRoles = data);
    socket.on("GetRole", (data) => {
        const el = document.getElementById(data._id);
        el.className = el.className.replaceAll(' btn-bordred-warning', '').replaceAll(' btn-bordred-success', '').replaceAll(' btn-bordred-error', '').replaceAll(' hideRF', '');
        el.className += data.freezed ? ' btn-bordred-success' : ' btn-bordred-warning';
        el.innerHTML = data.freezed ? 'Разморозить' : 'Заморозить';
        if(24 * 60 * 60 * 1000 >= Date.now() - data.freeze_last) el.className += ' btn-bordred-error';
        {
            const parent = document.getElementById(`freeze=>${data._id}`);
            parent.querySelectorAll("RF-date-convert").forEach((el) =>{
                if(data.freezed) {
                    let inFreezeZxc = Date.now() - data.freeze_start;
                    let roundZxc = data.freeze_available - inFreezeZxc;
                    const oneDay = 1000 * 60 * 60 * 24; // milliseconds in a day
                    const oneHour = 1000 * 60 * 60; // milliseconds in an hour
                    const totalDays = Math.round(roundZxc / oneDay);
                    const totalHours = Math.round((roundZxc / oneHour) - (totalDays * 24));
                    el.innerHTML = `Заморожен (доступно ${totalDays} дней и ${totalHours} часов)`;
                }
                else{
                    el.innerHTML = data.expires;
                    DateConvert(el);
                }
            });
        }
        if(roles.filter(x => x._id == data._id).length != 0) roles = roles.filter(x => x._id != data._id);
        roles.push(data)
    });
    $('#RFC').on('click', function (ev) {
        $('#RF').fadeOut(500);
        setTimeout(() => {
            document.getElementById('RF1').innerHTML = '';
            document.getElementById('RF2').innerHTML = '';
            document.getElementById('RF3').innerHTML = '';
            document.getElementById('RF4').innerHTML = '';
            document.getElementById('RF5').innerHTML = '';
            document.getElementById('RF5').style = '';
        }, 500);
        roleId = '';
    });
    $('.RFClick').on('click', function (ev) {
        const _role = roles.find(x => x._id == ev.target.id);
        if(_role == null || _role == undefined) return;
        const __role = AllRoles.find(x => x.id == _role.id);
        if(__role == null || __role == undefined) return;
        const __text = _role.freezed ? 'Разморозить' : 'Заморозить';
        const _RF3 = document.getElementById('RF3');
        const _RF5 = document.getElementById('RF5');
        document.getElementById('RF1').innerHTML = __text;
        document.getElementById('RF2').innerHTML = __text.toLowerCase();
        _RF3.innerHTML = __text;
        document.getElementById('RF4').innerHTML = __role.ablative;
        _RF5.innerHTML = __role.ablative;
        _RF5.style.color = __role.color;
        const _RF3Class = _RF3.className.replaceAll(' btn-bordred-warning', '').replaceAll(' btn-bordred-success', '');
        _RF3.className = _RF3Class + (_role.freezed ? ' btn-bordred-success' : ' btn-bordred-warning');
        $('#RF').fadeIn(500);
        roleId = ev.target.id;
    });
    let already = false;
    $('#RF3').on('click', function (ev) {
        if(already) return;
        const _id = roleId;
        Waiting();
        already = true;
        const uid = guid();
        socket.emit('ChangeFreezeRole', _id, uid);
        socket.on("ChangeFreezeRole", (_uid, error) => {
            if(uid != _uid) return;
            already = false;
            $('#RFC').click();
            WaitingStop();
            if(error == 1) alert('Заморозить донат можно только через 24 часа после разморозки');
            if(error == 2) alert('У вас закончились дни заморозки');
        });
    });
    const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
});