window.addEventListener('load', () => {
    const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
    RenderDiscords();
    RendeProfiles();
    async function RenderDiscords() {
        const _el = document.querySelectorAll(".render_discord");
        _el.forEach((element) => element.addEventListener("click", () => Discord_Profile(element.id.substr(1))));
        for (let i = 0; i < _el.length; i++) {
            try{await GetDiscord(_el[i])}catch{}
        }
        async function GetDiscord(element) {
            const res = await fetch('https://api./discord?id='+element.id.substr(1));
            const json = await res.json();
            if(json.status == 'error') return;
            element.innerHTML = `@${json.username}`;
        }
    }
    function RendeProfiles() {
        document.querySelectorAll(".render_user").forEach((element) => element.addEventListener("click", RenderProfile));
        document.querySelectorAll(".render_user").forEach((element) => GetProfile(element));
        function GetProfile(element) {
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
        function RenderProfile(ev) {
            Render_Profile(ev.target.id.substr(1));
        }
    }
});