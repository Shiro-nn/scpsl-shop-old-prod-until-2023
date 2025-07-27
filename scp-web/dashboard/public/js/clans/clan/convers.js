function GetStringFromDate(date) {
    const time = new Date(parseInt(date));
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    let str = dateTimePad(day, 2) + "." + dateTimePad(month, 2) + "." + dateTimePad(year, 2);
    const _hm2 = `${dateTimePad(hour, 2)}:${dateTimePad(minute, 2)}`;
    let _ret4 = str + ' ' + _hm2;
    {
        const _dn = new Date(Date.now());
        const now_day = _dn.getDate();
        const now_month = _dn.getMonth() + 1;
        const now_year = _dn.getFullYear();

        const nowDay = new Date(`${now_month}.${now_day}.${now_year}`);
        const dateDay = new Date(`${month}.${day}.${year}`);

        if(nowDay - dateDay == 0) _ret4 = str = `Сегодня, в ${_hm2}`;
        else if(nowDay - dateDay == 86400000) _ret4 = str = `Вчера, в ${_hm2}`;
        else if(nowDay - dateDay == -86400000) _ret4 = str = `Завтра, в ${_hm2}`;
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };
    const aria = time.toLocaleString("ru", options);
    return [str, aria, _hm2, _ret4];
}

function MessageToMD(msg, embeds = false) {
    try{msg = msg.replace(/&lt;/g, '<').replace(/&gt;/g, '>');}catch{}
    let scurls = embeds ? msg.match(/(\b(https?):\/\/(?=(soundcloud.com\/))([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/ig) : [];
    let scappurls = embeds ? msg.match(/(\bsc:\/\/([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/ig) : [];
    let imgslist = embeds ? msg.match(/(\bhttps?:\/\/(?=(cdn.scpsl.shop)|(cdn.fydne.dev))([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(png|jpg|webp|svg|gif))/ig) : [];
    const emojiClass = (embeds && msg.replace(/\<\:([0-9]+?)\:\>/g, '').trim() == '') ? 'render.emoji.big' : 'render.emoji';
    msg = msg.replace(/\n/g, '\\n');
    msg = msg.replace(/\<(?!\:)(?!\@)(.+?)\>/g, '&lt;$1&gt;'); //remove html tags
    msg = msg.replace(/\\n/g, '\n');
    //msg = msg.replace(/\<(?!\:)(?!\@)[^>]*>/g, '$1'); //remove html tags; better method above^
    msg = msg.replace(/\`\`\`([a-zA-Z0-9]+?)( |\n)((.|\n)+?)\`\`\`/g, function(all, v1, v2, v3) {
        v3 = v3.replace(/\`/g, '&grave;').replace(/\*/g, '&ast;').replace(/\//g, '&sol;');
        v3 = v3.replace(/\~/g, '&#126;').replace(/\@/g, '&commat;').replace(/\:/g, '&colon;');
        return `<pre><code id="big.code" class="language-${v1}">${v3}</code></pre>`;
    }); //```text``` => big code text
    msg = msg.replace(/\<\:([0-9]+?)\:\>/g, `<img class="${emojiClass}" id=":$1" alt="<:$1:>">`); //<:1:> => emoji
    msg = msg.replace(/\<\@([0-9]+?)\>/g, '<a class="render.user" id="@$1">@$1</a>'); //<@1> => ping
    msg = msg.replace(/\[(.+?)\]\(((https?|ftp|sc):\/\/[a-zA-Z0-9/.(]+?)\)/g, (all, v1, v2) => `<a target="_blank" href="${v2.replace(/\:/g, '&colon;')}">${v1}</a>`); //[text](url) => link
    msg = msg.replace(/(\b(?!")(https?|ftp|file|sc):\/\/([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/ig, (all) => `<a target="_blank" href="${all}">${all}</a>`); //url => link
    msg = msg.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); //**text** => bold text
    msg = msg.replace(/\*(.+?)\*/g, '<em>$1</em>'); //*text* => italic text
    msg = msg.replace(/\~\~(.+?)\~\~/g, '<del>$1</del>'); //~~text~~ => through text
    msg = msg.replace(/\`(.+?)\`/g, '<code>$1</code>'); //`text` => code text
    //msg = msg.replace(/\>; ((.|\n)+?)\n\n/g, '<blockquote>$1</blockquote>'); //> text => blockquote
    //msg = msg.replace(/&gt; ((.|\n)+?)\n\n/g, '<blockquote>$1</blockquote>'); //> text => blockquote
    msg = msg.replace(/\> ((.|\n)+?)\n\n/g, function(all, v1) {
        if(v1 == undefined || v1 == null || v1 == '') return all;
        return `<blockquote>${v1}</blockquote>`;
    });//> text => blockquote
    let _loadedEmbeds = 0;
    if(embeds){//add soundcloud embeds
        if(scurls == null || scurls == undefined) scurls = [];
        if(scappurls == null || scappurls == undefined) scappurls = [];
        let _scel2 = [];
        for (let i = 0; _loadedEmbeds < 2 && i < scurls.length; i++) {
            const _url = scurls[i].split('?')[0];
            if(!_scel2.some(x => x == _url)){
                _scel2.push(_url);
                _loadedEmbeds++;
                msg += '<br><iframe width="100%" height="300px" scrolling="no" frameborder="no" allow="autoplay" '+
                `src="https://w.soundcloud.com/player/?url=${_url}&show_artwork=true&visual=true&origin=twitter&color=f00"></iframe>`;
            }
        }
        for (let i = 0; _loadedEmbeds < 4 && i < scappurls.length; i++) {
            const _url = 'https://soundcloud.com/'+scappurls[i].substring(5).split('?')[0];
            if(!_scel2.some(x => x == _url)){
                _scel2.push(_url);
                _loadedEmbeds++;
                msg += '<br><iframe width="100%" height="300px" scrolling="no" frameborder="no" allow="autoplay" '+
                `src="https://w.soundcloud.com/player/?url=${_url}&show_artwork=true&visual=true&origin=twitter&color=f00"></iframe>`;
            }
        }
        _scel2 = [];
        scurls = [];
        scappurls = [];
    }
    if(embeds){//image url => image | *only for cdn.scpsl.shop & cdn.fydne.dev
        if(imgslist == null || imgslist == undefined) imgslist = [];
        let imgslist2 = [];
        for (let i = 0; _loadedEmbeds < 5 && i < imgslist.length; i++) {
            const _imgurl = imgslist[i];
            if(!imgslist2.some(x => x == _imgurl)){
                imgslist2.push(_imgurl);
                _loadedEmbeds++;
                msg += `<br><img class="img.public" onclick="window.open('${_imgurl}', '_blank')" onerror="try{this.outerHTML=''}catch{}" src="${_imgurl}">`;
            }
        }
        imgslist2 = [];
        imgslist = [];
    }
    return msg;
}

function DoRenderMessage(el) {
    {
        const _urs = el.getElementsByClassName('render.user');
        for (let i = 0; i < _urs.length; i++) {
            const _ur = _urs[i];
            const uid = _ur.id.substring(1);
            _ur.onclick = () => Render_Profile(parseInt(uid));
            setTimeout(async() => {
                const _ath = await GetUserById(uid);
                _ur.innerHTML = '@' + _ath.username;
            }, 0);
        }
    }
    {
        const _bcs = el.querySelectorAll('code[id="big.code"]');
        for (let i = 0; i < _bcs.length; i++) {
            setTimeout(async() => {
                while(!highlight_loaded) await sleep(1000);
                hljs.highlightElement(_bcs[i]);
            }, 0);
        }
    }
    {
        const _rmjl = el.querySelectorAll('img[class="render.emoji"]');
        for (let i = 0; i < _rmjl.length; i++) {
            const _rmj = _rmjl[i];
            setTimeout(async() => {
                const _emj = await GetEmojiById(parseInt(_rmj.id.substring(1)));
                _rmj.src = _emj.url;
            }, 0);
        }
    }
    {
        const _rmjl = el.querySelectorAll('img[class="render.emoji.big"]');
        for (let i = 0; i < _rmjl.length; i++) {
            const _rmj = _rmjl[i];
            setTimeout(async() => {
                const _emj = await GetEmojiById(parseInt(_rmj.id.substring(1)));
                _rmj.src = _emj.url;
            }, 0);
        }
    }
}


function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if(index > -1) arr.splice(index, 1);
    return arr;
}

function removeItemAll(arr, value) {
    var i = 0;
    while(i < arr.length){
        if(arr[i] === value) arr.splice(i, 1);
        else ++i;
    }
    return arr;
}


function dateTimePad(value, digits){
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}