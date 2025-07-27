{
    var Init = async() => {
        try{
            document.querySelectorAll(".md_change").forEach((element) => Render(element));
        }catch{
            try{
                let cdn = 'https://cdn.scpsl.shop';
                if(getCookie('cdn') == '') cdn = 'https://cdn.scpsl.shop';
                $(document).ready(function () {
                    $.getScript(cdn+"/scpsl/js/md.js", function() {
                        document.querySelectorAll(".md_change").forEach((element) => Render(element));
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
        $('head').append(`<link href="/css/etc/md.css" rel="stylesheet">`);
        function Render(element) {
            element.innerHTML = TextToMD(element.innerHTML);
            RenderNames();
            function RenderNames() {
                element.querySelectorAll(".render_user").forEach((element) => element.addEventListener("click", RenderUserProfile));
                element.querySelectorAll(".render_user").forEach((element) =>{
                    function RenderUser() {
                        let getted = false;
                        const uid = guid();
                        socket.on("username", (username, guid) => {
                            if(getted) return;
                            if(uid != guid) return;
                            element.innerHTML = `@${username}`;
                            getted = true;
                        });
                        socket.emit('username', element.id.substr(1), uid);
                    }
                    RenderUser();
                });
                element.querySelectorAll(".md_emoji").forEach((element) =>{
                    function RenderEmoji() {
                        let getted = false;
                        const uid = guid();
                        socket.on("emoji_data", (data, guid) => {
                            if(getted) return;
                            if(uid != guid) return;
                            element.style.backgroundImage = `url(${data.url})`;
                            getted = true;
                        });
                        socket.emit('emoji_data', element.id.substr(1), uid);
                    }
                    RenderEmoji();
                });
            }
            function RenderUserProfile(ev) {
                Render_Profile(ev.target.id.substr(1));
            }
        }
        function TextToMD(text) {
            var reg = /^\d+$/;
            let _ret = marked(text);
            let ret = text.replaceAll('&lt;@', "<@").replaceAll('&gt;', '>').replaceAll('&lt;:', "<:");
            if((ret.includes('<@') && ret.includes('>')) || (ret.includes('<:') && ret.includes(':>'))){
                while (ret.includes('<:') && ret.includes(':>')) {
                    var _str = ret.split('<:').pop().split(':>')[0];
                    var _nstr = ret.replaceAll(`<:${_str}:>`, `<span class='md_emoji' id=':${_str}'></span>`)
                    ret = _nstr;
                }
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
                let _ret_ = ret_.replaceAll('&lt;a class=&#39;render_user&#39; id=&#39;', "<a class='render_user' id='").replaceAll('&lt;/a&gt;', '</a>').replaceAll('&#39;&gt;', "'>");
                return _ret_;
            }
            else return _ret;
        }
        const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
    };
    Init();
}