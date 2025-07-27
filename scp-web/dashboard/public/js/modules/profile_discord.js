let hide_ds = true;
let myDiscord;

socket.on('get.profile', async(user) => myDiscord = user.discord);
socket.emit('get.profile');

async function Discord_Profile(id) {
    const position = getPosition();
    Waiting(position);

    const res = await fetch('https://api./discord?id=' + (id == 'this' ? myDiscord : id));
    const json = await res.json();


    WaitingStop();
    if(json.status == 'error') return;

    hide_ds = false;
    let src = document.getElementById('u2').src;
    if(src !== json.avatar_url){
        document.getElementById('u2').src = '';
        document.getElementById('u4').style = '';
    }
    var coord = position;
    if(coord.x > ($(window).width() - 300)) coord.x = $(window).width() - 300;
    document.getElementById('u1').style = `top: ${coord.y}px; left: ${coord.x}px;`;
    if(src !== json.avatar_url) document.getElementById('u2').src = json.avatar_url;
    document.getElementById('u3').innerHTML = `<span class="d10">${json.username}</span><span class="d11">#${json.discriminator}</span>`;
    if(json.banner_url){
        document.getElementById('u4').style.backgroundImage = `url(${json.banner_url})`;
    }
    else if(json.banner_color){
        document.getElementById('u4').style.backgroundColor = json.banner_color;
    }else{
        RGBaster.colors(json.avatar_url, {
            exclude: [/*'rgb(255,255,255)'*/],
            success: function(payload) {
                document.getElementById('u4').style.backgroundColor = payload.dominant;
            }
        });
    }
    setTimeout(() => hide_ds = true, 100);

    function Waiting(pos) {
        var coord = pos ?? getPosition();
        if(coord.x > ($(window).width() - 300)) coord.x = $(window).width() - 300;
        document.getElementById('waiting_discord').style = `top: ${coord.y}px; left: ${coord.x}px;`;
    }
    function WaitingStop() {
        document.getElementById('waiting_discord').style = `display:none;`;
    }
    function getPosition(e){
        var x = y = 0;
        if (!e) {
            var e = window.event;
        }
        x = e.clientX;
        y = e.clientY;
        return {x: x, y: y};
    }
}
window.addEventListener('load', () => {
    document.addEventListener("click", (ev)=>{
        if(!hide_ds) return;
        const path = ev.path || (ev.composedPath && ev.composedPath());
        if(!path) return;
        if(path.filter(x => x.id == 'u1').length < 1) document.getElementById('u1').style = `display: none;`;
    });
})