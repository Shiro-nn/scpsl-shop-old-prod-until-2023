(()=>{
const _el = document.querySelector('.images');
setInterval(() => _el.style = `--client-x: ${_el.clientWidth}px; --client-y: ${_el.clientHeight}px`, 1000);
_el.style = `--client-x: ${_el.clientWidth}px; --client-y: ${_el.clientHeight}px`;
})();

clanSocket.on('get.clans.war', async(status, war, clan) => {
    if(!status) return alert(war);
    console.log(war);
    const map = GetMapInfo(war.type, war.map);
    try{document.querySelector('.no-spinner').outerHTML = '';}catch{}
    document.querySelector('.content').style = '';
    const container = document.querySelector('.inf-container');
    {
        container.querySelector('.type h1').innerHTML = map.type;
        container.querySelector('.name').innerHTML = map.name;
        container.querySelector('.goal-info').innerHTML = map.goal;
        {
            const treasury = container.querySelector('.treasury-info');
            treasury.querySelector('.icon').className += war.treasury.coins ? ' coin' : ' money';
            treasury.querySelector('b').innerHTML = war.treasury.amount;
            
            const addCoins = container.querySelector('.add-coins-info');
            if(war.treasury.his){
                addCoins.querySelector('.icon').className += ' on';
                addCoins.querySelector('h3').innerHTML = 'Включено пополнение';
                tippy(addCoins, {content: 'Кланы могут закупать вооружение<br>на монетки из казны клана', animation: 'perspective', allowHTML: true});
            }else{
                addCoins.querySelector('.icon').className += ' off';
                addCoins.querySelector('h3').innerHTML = 'Пополнение выключено';
                tippy(addCoins, {content: 'Кланы могут использовать только<br>первоначальные монетки<br>номиналом в 10.000', animation: 'perspective', allowHTML: true});
            }
        }
        {
            const element = container.querySelector('.date-info');
            const date = GetStringFromDate(war.date);
            element.innerHTML = date[0];
            tippy(element, {content: date[1], animation: 'perspective', allowHTML: true});
        }
        {
            const ownerInf = container.querySelector('.owner-info');
            ownerInf.querySelector('.clan-tag').href = '/clans/'+clan.tag;
            ownerInf.querySelector('.clan-name').innerHTML = clan.tag;
            ownerInf.querySelector('.clan-border').style.backgroundColor = clan.color;
        }
        {
            const dataCenter = container.querySelector('.data-center-info');
            const _data = GetDataCenter(war.host.location)
            if(_data[0] != '') dataCenter.querySelector('.icon').classList.add(_data[0]);
            dataCenter.querySelector('text').innerHTML = _data[1];
        }
    }
    const images = document.querySelector('.img-cont');
    {
        let position = 0;
        const img = images.querySelector('img');
        const counter = images.querySelector('.counter');
        img.src = map.images[0];
        images.querySelector('.slider.left').onclick = () => {
            img.src = '';
            if(position == 0) position = map.images.length - 1;
            else position--;
            img.src = map.images[position];
            counter.innerHTML = `${position+1}/${map.images.length}`;
        };
        images.querySelector('.slider.right').onclick = () => {
            img.src = '';
            position++;
            if(position == map.images.length) position = 0;
            img.src = map.images[position];
            counter.innerHTML = `${position+1}/${map.images.length}`;
        };
        counter.innerHTML = `1/${map.images.length}`;
    }
});
clanSocket.emit('get.clans.war', tag);