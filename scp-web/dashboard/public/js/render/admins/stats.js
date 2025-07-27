socket.on('get.admins', async(type, data, admins) => {
    const adm = type == 1 ? data.sl : data.slhrp;
    {
        let color, name, tag;
        if(adm.trainee){
            color = '#9bff00';
            name = 'Стажер';
            tag = 'С';
        }else if(adm.helper){
            color = '#00ffff';
            name = 'Хелпер';
            tag = 'Х';
        }else if(adm.mainhelper){
            color = '#0089c7';
            name = 'Главный Хелпер';
            tag = 'г.х';
        }else if(adm.admin){
            color = '#fdffbb';
            name = 'Админ';
            tag = 'А';
        }else if(adm.mainadmin){
            color = '#ff0000';
            name = 'Главный Админ';
            tag = 'г.а';
        }else if(adm.control){
            if(type == 1){
                color = '#ef00ff';
                name = 'Контроль MRP';
                tag = 'к.м';
            }else{
                color = '#ff6100';
                name = 'Контроль HRP';
                tag = 'к.х';
            }
        }else if(data.control){
            color = '#ffe000';
            name = 'Контроль Администрации';
            tag = 'к.а';
        }else if(data.owner){
            color = '#000000';
            name = '👑Создатель';
            tag = 'O';
        }else return;
        const role = document.getElementById('admin.stats.role');
        role.innerHTML = '';
        const e0 = document.createElement('div');
        e0.className = 'card-header';
        e0.innerHTML = 'Роль';
        role.appendChild(e0);
        role.appendChild(document.createElement('br'));
        const e1 = document.createElement('div');
        e1.className = 'col-md-12 col-md-auto bypass_col';
        role.appendChild(e1);
        const e2 = document.createElement('div');
        e2.className = 'card-box card-border';
        e1.appendChild(e2);
        const e3 = document.createElement('div');
        e3.className = 'row';
        e2.appendChild(e3);
        const e4 = document.createElement('div');
        e4.className = 'cell col-3';
        e3.appendChild(e4);
        const e5 = document.createElement('div');
        e5.style.marginTop = '2px';
        e4.appendChild(e5);
        const e6 = document.createElement('h1');
        e6.style.fontFamily = 'NeonOL';
        e6.style.color = color;
        e6.innerHTML = tag;
        e5.appendChild(e6);
        const e7 = document.createElement('div');
        e7.className = 'cell col-8';
        e3.appendChild(e7);
        const e8 = document.createElement('p');
        e8.className = 'text-center mb-0 font-16 border-0 ml-0 st';
        e8.style = 'width:155px;color:#fff;overflow-wrap:break-word';
        e7.appendChild(e8);
        const e9 = document.createElement('span');
        e9.className = 's';
        e9.innerHTML = name;
        e8.appendChild(e9);
    }
    {
        let hl = 0;
        if(adm.trainee) hl = 7;
        else if(adm.helper) hl = 7;
        else if(adm.mainhelper) hl = 6;
        else if(adm.admin) hl = 5;
        const hours_act = hl == 0 ? 0 : Math.round(4*hl+hl*3/7);
        const stats = document.getElementById('admin.stats.time');
        stats.innerHTML = '';
        const e0 = document.createElement('div');
        e0.className = 'card-header';
        e0.innerHTML = 'Статистика';
        stats.appendChild(e0);
        const e1 = document.createElement('div');
        e1.className = 'card-body';
        e1.innerHTML = `Предов: <b>${adm.warnings}</b>`;
        stats.appendChild(e1);
        const e2 = document.createElement('div');
        e2.className = 'card-body';
        e2.innerHTML = `Наиграно на сервере за мес: <b>${Math.round((adm.time / 60) / 60)} ч.</b>`;
        stats.appendChild(e2);
        const e3 = document.createElement('div');
        e3.className = 'card-body';
        e3.innerHTML = `Необходимо набрать за месяц: <b>${hours_act}ч.</b>`;
        stats.appendChild(e3);
        if(data.sabbatical){
            e2.outerHTML = '';
            e3.outerHTML = '';
        }
    }
    if(data.sabbatical){
        const work = document.getElementById('admin.stats.work');
        work.innerHTML = '';
        const e0 = document.createElement('div');
        e0.className = 'card-header';
        e0.innerHTML = 'Работа';
        work.appendChild(e0);
        const e1 = document.createElement('div');
        e1.className = 'card-body';
        e1.innerHTML = 'Вы в саббатикале [длительный отпуск]';
        work.appendChild(e1);
        return;
    }
    {
        let needed = 0;
        admins.forEach(function(doadmin){
            const admin = type == 1 ? doadmin.sl : doadmin.slhrp;
            let cf = 4;
            if(admin.helper) cf = 2;
            else if(admin.mainhelper) cf = 1;
            else if(admin.admin) cf = 0.5;
            else if(admin.mainadmin) cf = 0.25;
            cf /= 4;
            needed += admin.punishments * cf;
            needed += admin.kicks * 1.5 * cf;
            needed += admin.bans * 2 * cf;
        });
        let ucf = 1;
        if(adm.trainee) ucf = 2;
        else if(adm.helper) ucf = 2;
        else if(adm.mainhelper) ucf = 1;
        else if(adm.mainadmin) ucf = 0;
        const utotal = Math.round(adm.punishments + (adm.kicks * 1.5) + (adm.bans * 2));
        const work = document.getElementById('admin.stats.work');
        work.innerHTML = '';
        const e0 = document.createElement('div');
        e0.className = 'card-header';
        e0.innerHTML = 'Работа';
        work.appendChild(e0);
        const e1 = document.createElement('div');
        e1.className = 'card-body';
        e1.innerHTML = `Киков: <b>${adm.kicks}</b><br>Банов: <b>${adm.bans}</b><br>Наказаний: <b>${adm.punishments}</b>`;
        work.appendChild(e1);
        const e2 = document.createElement('div');
        e2.className = 'card-body';
        e2.innerHTML = `Требуется собрать: <b>${Math.round(needed / admins.length * ucf)}</b> активности<br>Вы собрали: <b>${utotal}</b> активности`;
        work.appendChild(e2);
        if(adm.selection){
            const e3 = document.createElement('div');
            e3.className = 'card-body';
            e3.innerHTML = `Принято стажеров: <b>${adm.slaves}</b>`;
            work.appendChild(e3);
        }
    }
});
socket.emit('get.admins', aid);