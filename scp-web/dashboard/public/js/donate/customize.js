window.addEventListener("load", function() {
    let sum = {
        ClassD: 0,
        Scientist: 0,
        Guard: 0,
        Mtf: 0,
        Chaos: 0,
        Serpents: 0,
    };
    function GetSum() {
        return sum.ClassD+sum.Scientist+sum.Guard+sum.Mtf+sum.Chaos+sum.Serpents
    }
    tippy(document.getElementById('gen1').getElementsByTagName('i')[0],
    {content: 'Адреналин лучше взаимодействует с гармонами, усиливает кровообращение, восстанавливая здоровье', animation: 'perspective'});
    tippy(document.getElementById('gen2').getElementsByTagName('i')[0],
    {content: 'В случае смертельной опасности,<br>есть шанс выброса адреналина', allowHTML: true, animation: 'perspective'});
    tippy(document.getElementById('gen3').getElementsByTagName('i')[0],
    {content: 'Уменьшает урон по вам', animation: 'perspective'});
    setInterval(() => document.getElementById('cmz_sum').innerHTML = GetSum(), 1000);
    setInterval(() => {
        if(bought){
            if(Changed()){
                document.getElementById('buy_click').innerHTML = 'Изменить';
            }else document.getElementById('buy_click').innerHTML = 'Продлить';
        }
        else document.getElementById('buy_click').innerHTML = 'Приобрести';
    }, 1000);
    $('#buy_click').click(function(){
        if(bought){
            if(Changed()){
                let __sum = GetSum() - first_sum;
                if(__sum < 0) __sum = 0;
				else if(__sum > 0) {
					const time_difference = (expires - Date.now()) / (1000 * 60 * 60 * 24 * 30);
					__sum = Math.ceil(__sum * time_difference);
				}
                document.getElementById('buy_sum').innerHTML = __sum;
                document.getElementById('buy_type').innerHTML = 'Изменение';
                document.getElementById('buy_type2').innerHTML = 'Изменяет текущую кастомизацию';
                document.getElementById('buy_type3').innerHTML = 'Изменить';
            }else{
                document.getElementById('buy_sum').innerHTML = GetSum();
                document.getElementById('buy_type').innerHTML = 'Продление';
                document.getElementById('buy_type2').innerHTML = 'Продлевается на месяц';
                document.getElementById('buy_type3').innerHTML = 'Продлить';
            }
        }
        else{
            document.getElementById('buy_sum').innerHTML = GetSum();
            document.getElementById('buy_type').innerHTML = 'Покупка';
            document.getElementById('buy_type2').innerHTML = 'Покупается на месяц';
            document.getElementById('buy_type3').innerHTML = 'Приобрести';
        }
        $('#buy_customize').fadeIn();
    });
    $('#buy_close').click(function(){
        $('#buy_customize').fadeOut();
    });
    let already_bought = false;
    $('.buy_button').click(function(){
        if(already_bought) return;
        Waiting();
        already_bought = true;
        $.ajax({
            type:'post',
            url:`/donate/buy/customize`,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 5000,
            data: JSON.stringify({genetics, scales}),
            success:function() {
                already_bought = false;
                window.location.reload();
            },
            error:function(e) {
                already_bought = false;
                if(e.responseText == 'ok'){
                    window.location.reload();
                }else{
                    WaitingStop();
                    try{
                        const json = JSON.parse(e.responseText);
                        if(json.message == 'money'){
                            try{
                                OpenAndWrite(json.sum);
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
                        else alert('Произошла ошибка, попробуйте позже');
                    }catch{alert('Произошла ошибка, попробуйте позже');}
                    setTimeout(() => $('#buy_customize').fadeOut(), 3000);
                }
            }
        });
    });
    let vanilla_data = {
        scales:{
            ClassD: 100,
            Scientist: 100,
            Guard: 100,
            Mtf: 100,
            Chaos: 100,
            Serpents: 100,
        },
        genetics:{
            ClassD: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
            Scientist: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
            Guard: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
            Mtf: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
            Chaos: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
            Serpents: {
                adrenaline_compatible: false,
                adrenaline_rush: false,
                native_armor: false,
            },
        }
    };
    let first_sum = 0;
    let bought = false;
    let expires = Date.now();
    socket.on("customize_reload", () => location.reload());
    socket.on("customize", (data) => {
        sum = data.sum;
        scales = data.scales;
        genetics = data.genetics;
        bought = true;
        first_sum = GetSum();
        expires = data.expires;
        vanilla_data.scales.ClassD = data.scales.ClassD;
        vanilla_data.scales.Scientist = data.scales.Scientist;
        vanilla_data.scales.Guard = data.scales.Guard;
        vanilla_data.scales.Mtf = data.scales.Mtf;
        vanilla_data.scales.Chaos = data.scales.Chaos;
        vanilla_data.scales.Serpents = data.scales.Serpents;

        vanilla_data.genetics.ClassD.adrenaline_compatible = data.genetics.ClassD.adrenaline_compatible;
        vanilla_data.genetics.ClassD.adrenaline_rush = data.genetics.ClassD.adrenaline_rush;
        vanilla_data.genetics.ClassD.native_armor = data.genetics.ClassD.native_armor;

        vanilla_data.genetics.Scientist.adrenaline_compatible = data.genetics.Scientist.adrenaline_compatible;
        vanilla_data.genetics.Scientist.adrenaline_rush = data.genetics.Scientist.adrenaline_rush;
        vanilla_data.genetics.Scientist.native_armor = data.genetics.Scientist.native_armor;

        vanilla_data.genetics.Guard.adrenaline_compatible = data.genetics.Guard.adrenaline_compatible;
        vanilla_data.genetics.Guard.adrenaline_rush = data.genetics.Guard.adrenaline_rush;
        vanilla_data.genetics.Guard.native_armor = data.genetics.Guard.native_armor;

        vanilla_data.genetics.Mtf.adrenaline_compatible = data.genetics.Mtf.adrenaline_compatible;
        vanilla_data.genetics.Mtf.adrenaline_rush = data.genetics.Mtf.adrenaline_rush;
        vanilla_data.genetics.Mtf.native_armor = data.genetics.Mtf.native_armor;

        vanilla_data.genetics.Chaos.adrenaline_compatible = data.genetics.Chaos.adrenaline_compatible;
        vanilla_data.genetics.Chaos.adrenaline_rush = data.genetics.Chaos.adrenaline_rush;
        vanilla_data.genetics.Chaos.native_armor = data.genetics.Chaos.native_armor;

        vanilla_data.genetics.Serpents.adrenaline_compatible = data.genetics.Serpents.adrenaline_compatible;
        vanilla_data.genetics.Serpents.adrenaline_rush = data.genetics.Serpents.adrenaline_rush;
        vanilla_data.genetics.Serpents.native_armor = data.genetics.Serpents.native_armor;

        document.getElementById('this_expires').innerHTML = GetDateTime(data.expires);
        const _scale = GetScale();
        document.getElementById('scale').value = _scale;
        document.getElementById('scale_text').innerHTML = _scale + '%';
        document.getElementById('scale_img').style.height = `${420 * _scale/100}px`;
        const gens_data = genetics.ClassD;
        {
            const el = document.getElementById('gen1');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.adrenaline_compatible){
                el.className += ' selected';
            }
        }
        {
            const el = document.getElementById('gen2');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.adrenaline_rush){
                el.className += ' selected';
            }
        }
        {
            const el = document.getElementById('gen3');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.native_armor){
                el.className += ' selected';
            }
        }
    });
    socket.on('connect', () => socket.emit('customize'));
    if(socket.connected) socket.emit('customize');
    let type = 0;
    let scales = {
        ClassD: 100,
        Scientist: 100,
        Guard: 100,
        Mtf: 100,
        Chaos: 100,
        Serpents: 100,
    };
    let genetics = {
        ClassD: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
        Scientist: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
        Guard: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
        Mtf: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
        Chaos: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
        Serpents: {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        },
    };
    $('#scale').bind('input propertychange', function(e) {
        let __value = parseInt(e.target.value);
        if(__value < 85) __value = 85;
        else if(__value > 115) __value = 115;
        SetScale(__value);
        UpdateSum();
        document.getElementById('scale_text').innerHTML = __value + '%';
        document.getElementById('scale_img').style.height = `${420 * __value/100}px`;
    });
    $('#gen1').click(function(){
        const gens_data = GetGenes();
        const el = document.getElementById('gen1');
        if(gens_data.adrenaline_compatible){
            el.className = el.className.replaceAll(' selected', '');
        }else{
            el.className += ' selected';
        }
        SetGenes({
            adrenaline_compatible: !gens_data.adrenaline_compatible,
            adrenaline_rush: gens_data.adrenaline_rush,
            native_armor: gens_data.native_armor,
        });
        UpdateSum();
    });
    $('#gen2').click(function(){
        const gens_data = GetGenes();
        const el = document.getElementById('gen2');
        if(gens_data.adrenaline_rush){
            el.className = el.className.replaceAll(' selected', '');
        }else{
            el.className += ' selected';
        }
        SetGenes({
            adrenaline_compatible: gens_data.adrenaline_compatible,
            adrenaline_rush: !gens_data.adrenaline_rush,
            native_armor: gens_data.native_armor,
        });
        UpdateSum();
    });
    $('#gen3').click(function(){
        const gens_data = GetGenes();
        const el = document.getElementById('gen3');
        if(gens_data.native_armor){
            el.className = el.className.replaceAll(' selected', '');
        }else{
            el.className += ' selected';
        }
        SetGenes({
            adrenaline_compatible: gens_data.adrenaline_compatible,
            adrenaline_rush: gens_data.adrenaline_rush,
            native_armor: !gens_data.native_armor,
        });
        UpdateSum();
    });
    $('#d_click').click(function(){
        type = 0;
        DoChange();
    });
    $('#s_click').click(function(){
        type = 1;
        DoChange();
    });
    $('#g_click').click(function(){
        type = 2;
        DoChange();
    });
    $('#m_click').click(function(){
        type = 3;
        DoChange();
    });
    $('#c_click').click(function(){
        type = 4;
        DoChange();
    });
    $('#h_click').click(function(){
        type = 5;
        DoChange();
    });
    function DoChange() {
        const _scale = GetScale();
        const gens_data = GetGenes();
        document.getElementById('scale').value = _scale;
        document.getElementById('scale_text').innerHTML = _scale + '%';
        document.getElementById('scale_img').style.height = `${420 * _scale/100}px`;
        document.getElementById('scale_img').src = GetImage();
        {
            const el = document.getElementById('gen1');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.adrenaline_compatible){
                el.className += ' selected';
            }
        }
        {
            const el = document.getElementById('gen2');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.adrenaline_rush){
                el.className += ' selected';
            }
        }
        {
            const el = document.getElementById('gen3');
            el.className = el.className.replaceAll(' selected', '');
            if(gens_data.native_armor){
                el.className += ' selected';
            }
        }
    }
    function UpdateSum() {
        let do_sum = 0;
        const do_scale = GetScale(type);
        if(do_scale > 100) do_sum = (do_scale - 100)*3;
        else if(do_scale < 100) do_sum = (100 - do_scale)*4;
        const gens_data = GetGenes();
        if(gens_data.adrenaline_compatible) do_sum += 150;
        if(gens_data.adrenaline_rush) do_sum += 150;
        if(gens_data.native_armor) do_sum += 125;
        SetSum(do_sum);
        document.getElementById('cmz_sum').innerHTML = GetSum();
    }
    function SetSum(value) {
        if(type == 0) sum.ClassD = value;
        else if(type == 1) sum.Scientist = value;
        else if(type == 2) sum.Guard = value;
        else if(type == 3) sum.Mtf = value;
        else if(type == 4) sum.Chaos = value;
        else if(type == 5) sum.Serpents = value;
        else console.error('umm');
    }
    function SetScale(value) {
        if(value < 85) value = 85;
        else if(value > 115) value = 115;
        if(type == 0) scales.ClassD = value;
        else if(type == 1) scales.Scientist = value;
        else if(type == 2) scales.Guard = value;
        else if(type == 3) scales.Mtf = value;
        else if(type == 4) scales.Chaos = value;
        else if(type == 5) scales.Serpents = value;
        else console.error('umm');
    }
    function GetScale() {
        if(type == 0) return scales.ClassD;
        if(type == 1) return scales.Scientist;
        if(type == 2) return scales.Guard;
        if(type == 3) return scales.Mtf;
        if(type == 4) return scales.Chaos;
        if(type == 5) return scales.Serpents;
        return 100;
    }
    function SetGenes(value) {
        if(type == 0) genetics.ClassD = value;
        else if(type == 1) genetics.Scientist = value;
        else if(type == 2) genetics.Guard = value;
        else if(type == 3) genetics.Mtf = value;
        else if(type == 4) genetics.Chaos = value;
        else if(type == 5) genetics.Serpents = value;
        else console.error('umm');
    }
    function GetGenes() {
        if(type == 0) return genetics.ClassD;
        if(type == 1) return genetics.Scientist;
        if(type == 2) return genetics.Guard;
        if(type == 3) return genetics.Mtf;
        if(type == 4) return genetics.Chaos;
        if(type == 5) return genetics.Serpents;
        return {
            adrenaline_compatible: false,
            adrenaline_rush: false,
            native_armor: false,
        };
    }
    function GetImage() {
        let __name = '';
        if(type == 0) __name = 'Class-D.webp';
        else if(type == 1) __name = 'scientist.webp';
        else if(type == 2) __name = 'guard.webp';
        else if(type == 3) __name = 'mtf.webp';
        else if(type == 4) __name = 'chaos.webp';
        else if(type == 5) __name = 'hand.webp';
        return `/img/customize/${__name}`;
    }
    function Changed() {
        if(vanilla_data.scales.ClassD != scales.ClassD) return true;
        if(vanilla_data.scales.Scientist != scales.Scientist) return true;
        if(vanilla_data.scales.Guard != scales.Guard) return true;
        if(vanilla_data.scales.Mtf != scales.Mtf) return true;
        if(vanilla_data.scales.Chaos != scales.Chaos) return true;
        if(vanilla_data.scales.Serpents != scales.Serpents) return true;
        
        if(vanilla_data.genetics.ClassD.adrenaline_compatible != genetics.ClassD.adrenaline_compatible) return true;
        if(vanilla_data.genetics.Scientist.adrenaline_compatible != genetics.Scientist.adrenaline_compatible) return true;
        if(vanilla_data.genetics.Guard.adrenaline_compatible != genetics.Guard.adrenaline_compatible) return true;
        if(vanilla_data.genetics.Mtf.adrenaline_compatible != genetics.Mtf.adrenaline_compatible) return true;
        if(vanilla_data.genetics.Chaos.adrenaline_compatible != genetics.Chaos.adrenaline_compatible) return true;
        if(vanilla_data.genetics.Serpents.adrenaline_compatible != genetics.Serpents.adrenaline_compatible) return true;
        
        if(vanilla_data.genetics.ClassD.adrenaline_rush != genetics.ClassD.adrenaline_rush) return true;
        if(vanilla_data.genetics.Scientist.adrenaline_rush != genetics.Scientist.adrenaline_rush) return true;
        if(vanilla_data.genetics.Guard.adrenaline_rush != genetics.Guard.adrenaline_rush) return true;
        if(vanilla_data.genetics.Mtf.adrenaline_rush != genetics.Mtf.adrenaline_rush) return true;
        if(vanilla_data.genetics.Chaos.adrenaline_rush != genetics.Chaos.adrenaline_rush) return true;
        if(vanilla_data.genetics.Serpents.adrenaline_rush != genetics.Serpents.adrenaline_rush) return true;
        
        if(vanilla_data.genetics.ClassD.native_armor != genetics.ClassD.native_armor) return true;
        if(vanilla_data.genetics.Scientist.native_armor != genetics.Scientist.native_armor) return true;
        if(vanilla_data.genetics.Guard.native_armor != genetics.Guard.native_armor) return true;
        if(vanilla_data.genetics.Mtf.native_armor != genetics.Mtf.native_armor) return true;
        if(vanilla_data.genetics.Chaos.native_armor != genetics.Chaos.native_armor) return true;
        if(vanilla_data.genetics.Serpents.native_armor != genetics.Serpents.native_armor) return true;
        
        return false;
    }
    function GetDateTime(date) {
        var date = new Date(date);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        if (parseInt(month) == 2 && parseInt(day) > 28) {
            day = "28";
        }
        if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && parseInt(day) > 30) {
            day = "30";
        }
        if (parseInt(day) < 10) {
            var t = "0";
            t += day;
            day = t;
        }
        if (parseInt(hour) < 10) {
            var t = "0";
            t += hour;
            hour = t;
        }
        if (parseInt(minute) < 10) {
            var t = "0";
            t += minute;
            minute = t;
        }
        if (parseInt(month) == 13) {
            month = "01";
            year = date.getFullYear() + 1;
        }
        if (parseInt(month) < 10) {
            var t = "0";
            t += month;
            month = t;
        }
        return day + "." + month + "." + year + " " + hour + ':' + minute;
    }
});
window.addEventListener("load", function() {
    
});