let hide = true;
let AchList = [];
function Render_Profile(id) {
    let username = '', avatar = '', banner = '', clan = '', achievements = [], clan_lvl = 0, clan_color = 'red', public = false, prime = false;
    const _ev = window.event;
    const coord = {x:_ev.x, y:_ev.y}
    if(coord.x > (window.innerWidth - 300)) coord.x = window.innerWidth - 300;
    if(coord.y > (window.innerHeight - 225)) coord.y = window.innerHeight - 225;
    document.getElementById('i1').style = `top: ${coord.y}px; left: ${coord.x}px;`;
    document.getElementsByClassName('p2')[0].style.display = 'none';
    document.getElementsByClassName('p21')[0].style = '';
    hide = false;
    setTimeout(() => hide = true, 100);
    SendRequest();
    function SendRequest() {
        socket.on('profile', async(data, error) => {
            if(error){
                var _elem = document.getElementById('i1');
                if(_elem.style.top == `${coord.y}px` && _elem.style.left == `${coord.x}px`){
                    document.getElementById('i1').style = `display: none;`;
                }
            }
            else UpdateData(data)
        });
        socket.emit('profile', id);
        function UpdateData(data) {
            username = data.username;
            avatar = data.avatar;
            banner = data.banner;
            clan = data.clan;
            achievements = data.achievements;
            clan_lvl = data.access;
            clan_color = data.color;
            public = data.public;
            prime = data.prime;
            LoadLater();
        }
    }
    function LoadLater() {
        try{AchList.forEach(ach => ach.remove());}catch{}
        document.getElementById('i5').innerHTML = '';
        achievements.forEach(function(achievement) {
            if(achievement != null){
                const _e1 = document.createElement("div");
                _e1.className = 'p7-1';
                document.getElementById('i5').appendChild(_e1);
                const _e2 = document.createElement("div");
                _e2.className = 'achievement';
                _e1.appendChild(_e2);
                tippy(_e2, {content: achievement.desc, theme: 'translucent', animation: 'perspective', placement: 'bottom'});
                const _e3 = document.createElement("div");
                _e3.className = 'p7-2';
                _e3.style.backgroundImage = `url('${achievement.img}')`;
                _e2.appendChild(_e3);
                AchList.push(_e1);
            }
        });
        let src = document.getElementById('i2').src;
        if(src !== avatar){
            document.getElementById('i2').src = '';
            if(banner == '') document.getElementById('i4').style.backgroundColor = '';
        }
        if(src !== avatar) document.getElementById('i2').src = avatar;
        document.getElementById('i3').innerHTML = username;
        if(prime) document.getElementById('i3').className += ' profile_prime';
        else document.getElementById('i3').className = document.getElementById('i3').className.replace(' profile_prime', '');
        if(banner == ''){
            document.getElementById('i4').classList = 'p5';
            document.getElementById('i6').classList = 'p11';
            document.getElementById('i4').style.backgroundImage = '';
            RGBaster.colors(avatar, {
                success: function(payload) {
                    document.getElementById('i4').style.backgroundColor = payload.dominant;
                }
            });
        }else{
            document.getElementById('i4').classList = 'p5-premium';
            document.getElementById('i6').classList = 'p11 p11-premium';
            document.getElementById('i4').style = `background-image: url(${banner})`;
        }
        if(clan == '') document.getElementById('i7').style.display = 'none';
        else{
            document.getElementById('i7').style.display = '';
            if(public) document.getElementById('i7').href = `/clans/${clan}`;
            else document.getElementById('i7').href = 'javascript:void(0)';
            document.getElementById('i8').innerHTML = clan;
            document.getElementById('i9').innerHTML = '';
            for (let i = 0; i < clan_lvl; i++) {
                document.getElementById('i9').innerHTML += `<div style="background-color: ${clan_color};"></div>`;
            }
        }
        document.getElementsByClassName('p21')[0].style.display = 'none';
        document.getElementsByClassName('p2')[0].style = '';
    }
}
document.addEventListener("click", (ev)=>{
    if(!hide) return;
    const path = ev.path || (ev.composedPath && ev.composedPath());
    if(!path) return;
    if(path.filter(x => x.id == 'i1').length < 1) document.getElementById('i1').style = `display: none;`;
});