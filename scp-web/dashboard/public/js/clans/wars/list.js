clanSocket.on('get.clans.wars', async(wars) => {
    console.log(wars);
    const _container = document.querySelector('.container');
    _container.innerHTML = '';
    document.querySelector('.spinner').style.display = 'none';
    if(wars.length == 0) document.querySelector('.zero-cw').style.display = '';
    else document.querySelector('.zero-cw').style.display = 'none';
    for (let i = 0; i < wars.length; i++) {
        CreateWar(wars[i]);
    }

    function CreateWar(war){
        const map = GetMapInfo(war.type, war.map);

        const e1 = document.createElement('a');
        e1.className = 'cw';
        e1.href = '/wars/'+war._id;
        _container.appendChild(e1);

        const e2 = document.createElement('div');
        e2.className = 'card';
        e1.appendChild(e2);

        {
            const e3 = document.createElement('img');
            e3.className = 'card-image';
            e3.loading = 'lazy';
            e3.src = map.images[0];
            e2.appendChild(e3);
        }
        {
            const e3 = document.createElement('div');
            e3.className = 'card-body';
            e2.appendChild(e3);
            
            const e4 = document.createElement('h3');
            e4.className = 'card-title';
            e4.innerHTML = map.type;
            e3.appendChild(e4);
            const e5 = document.createElement('p');
            e5.className = 'card-desc';
            e5.innerHTML = map.goal;
            e3.appendChild(e5);
            
            const e6 = document.createElement('div');
            e6.className = 'card-footer';
            e3.appendChild(e6);
            {
                const e7 = document.createElement('div');
                e7.className = 'w8';
                e6.appendChild(e7);
                const e8 = document.createElement('span');
                e8.className = 'w9';
                e8.innerHTML = war.owner.tag;
                e7.appendChild(e8);
                const e9 = document.createElement('div');
                e9.className = 'w10';
                e9.style.backgroundColor = 'red'; //*
                e7.appendChild(e9);
            }
            {
                const e7 = document.createElement('div');
                e7.className = 'card-stats';
                e6.appendChild(e7);
                if(war.clan.tag == ''){
                    const e8 = document.createElement('div');
                    e8.className = 'card-stat';
                    e7.appendChild(e8);
                    e8.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'+
                    '<g transform="translate(0.000000,16.000000) scale(0.100000,-0.100000)" stroke="none" fill-rule="evenodd">'+
                    '<path d="M26 134 c-34 -35 -34 -73 0 -108 29 -28 68 -34 95 -13 20 15 43 57 35 64 -3 3 -10 -6 -16 -21 -20 -53 -100 -54 '+
                    '-120 -1 -13 34 3 73 35 85 27 10 33 20 11 20 -7 0 -25 -12 -40 -26z"/><path d="M110 105 c-26 -27 -37 -32 -47 -23 -21 17 '+
                    '-25 3 -5 -15 17 -16 21 -14 57 23 21 22 36 42 34 45 -3 2 -20 -11 -39 -30z"/></g></svg>';
                    const e9 = document.createElement('span');
                    e9.innerHTML = 'Доступен';
                    e8.appendChild(e9);
                    tippy(e8, {content: 'Вы можете принять участие<br>в этой Клановой Войне', animation: 'perspective', allowHTML: true});
                }
                {
                    const e8 = document.createElement('div');
                    e8.className = 'card-stat';
                    e7.appendChild(e8);
                    e8.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'+
                    '<g transform="translate(0.000000,16.000000) scale(0.100000,-0.100000)" stroke="none" fill-rule="evenodd">'+
                    '<path d="M25 135 c-50 -49 -15 -135 55 -135 41 0 80 39 80 80 0 41 -39 80 -80 80 -19 0 -40 -9 -55 -25z m65 -39 c0 -13 7 '+
                    '-29 15 -36 9 -7 13 -15 10 -18 -3 -3 -14 3 -25 13 -21 19 -28 65 -10 65 6 0 10 -11 10 -24z"></path></g></svg>';
                    const date = GetStringFromDate(war.date);
                    const e9 = document.createElement('span');
                    e9.innerHTML = date[0];
                    e8.appendChild(e9);
                    tippy(e8, {content: date[1], animation: 'perspective', allowHTML: true});
                }
            }
        }
    }
});
clanSocket.emit('get.clans.wars');