var json_data = document.getElementById('deleteThis').innerHTML;
document.getElementById('deleteThis').outerHTML = '';
var logs = JSON.parse(json_data).logs.reverse();
$('#load_logs').on('click', async () => Load(true));
$('#load_all_logs').on('click', async () => Load(false));
async function Load(asynces = true) {
    document.getElementById('load_logs').outerHTML = '';
    document.getElementById('load_all_logs').outerHTML = '';
    await sleep(100);
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if(asynces) await sleep(100);
        var _new = document.createElement("div");
        _new.classList = 'chatlog__message-group';
        _new.innerHTML = `<div class="chatlog__author-avatar-container">
        <img class="chatlog__author-avatar" src="${log.ava}" alt="Avatar">
    </div>
    <div class="chatlog__messages">
        <span class="chatlog__author-name" title="${log.server}#${log.port}" style="color: #fdffbb">${log.server}</span>
        <span class="chatlog__timestamp">${log.date}</span>
        <div class="chatlog__message ">
            <div class="chatlog__content">
                <div class="markdown">${log.msg}</div>
            </div>
        </div>
    </div>`;
    RenderThis(_new);
        document.getElementById('LoadLogs').appendChild(_new);
        
    }
}
function RenderThis(element) {
    try{
        element.querySelectorAll(".markdown").forEach(async(el) => Render(el));
    }catch{
        try{
            let cdn = 'https://cdn.scpsl.shop';
            if(getCookie('cdn') == '') cdn = 'https://cdn.scpsl.shop';
            $(document).ready(function () {
                $.getScript(cdn+"/scpsl/js/md.js", function() {
                    element.querySelectorAll(".markdown").forEach((el) => Render(el));
                });
            });
        }catch{}
        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let users = [];
function Render(element) {
    element.innerHTML = TextToMD(element.innerHTML);
    RenderNames();
    function RenderNames() {
        element.querySelectorAll(".render_user").forEach((element) => element.addEventListener("click", RenderUserProfile));
        element.querySelectorAll(".render_user").forEach((element) =>{
            if(users.filter(x => x.id == element.id.substr(1)).length > 0){
                element.innerHTML = `@${users.find(x => x.id == element.id.substr(1))?.name}`;
                return;
            }
            let getted = false;
            const uid = guid();
            socket.on("username", (username, guid) => {
                if(getted) return;
                if(uid != guid) return;
                users.push({id: element.id.substr(1), name: username})
                element.innerHTML = `@${username}`;
                getted = true;
            });
            socket.emit('username', element.id.substr(1), uid);
        });
    }
    function RenderUserProfile(ev) {
        Render_Profile(ev.target.id.substr(1));
    }
}
function TextToMD(text) {
    var reg = /^\d+$/;
    let _ret = marked(text);
    _ret = _ret.replaceAll('<p>', '').replaceAll('</p>', '');
    let ret = text.replaceAll('&lt;@', "<@").replaceAll('&gt;', '>');
    if(ret.includes('<@') && ret.includes('>')){
        while (ret.includes('<@') && ret.includes('>')) {
            var _str = ret.split('<@').pop().split('>')[0];
            if(reg.test(_str)){
                var _nstr = ret.replaceAll(`<@${_str}>`, `<a class='render_user' id='@${_str}'>@${_str}</a>`)
                ret = _nstr;
            }else{
                var _nstr = ret.replaceAll(`<@${_str}>`, `<\\⋠@${_str}>`)
                ret = _nstr;
            }
        }
        ret = ret.replaceAll('\\⋠@', '@');
        let ret_ = marked(ret);
        ret_ = ret_.replaceAll('<p>', '').replaceAll('</p>', '');
        let _ret_ = ret_.replaceAll('&lt;a class=&#39;render_user&#39; id=&#39;', "<a class='render_user' id='").replaceAll('&lt;/a&gt;', '</a>').replaceAll('&#39;&gt;', "'>");
        return _ret_;
    }
    else return _ret;
}
const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}