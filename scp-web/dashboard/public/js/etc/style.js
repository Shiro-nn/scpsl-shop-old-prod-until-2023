try{
    document.getElementById('style.edit.button').onclick = () => window.top.location.href = document.getElementById('style.edit.button').href;
    socket.on('get.uid', async(uid)=>{
        if(style_owner == uid) document.getElementById('style.edit.button').style = '';
        if(uid == 0){
            document.getElementById('style.comment').style.display = 'none';
            document.getElementById('style.not.loged').style = '';
        }else{
            document.getElementById('style.not.loged').style.display = 'none';
            document.getElementById('style.comment').style = '';
        }
    });
    socket.emit('get.uid');
}catch{}
window.addEventListener('load', () => {
    const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
    RenderAuthorUserName();
    RenderAuthorAvatar();
    function RenderAuthorUserName() {
        document.querySelectorAll(".style_username").forEach((element) => element.addEventListener("click", RenderUserProfile));
        document.querySelectorAll(".style_username").forEach((element) =>{
            let getted = false;
            const uid = guid();
            socket.on("username", (username, guid) => {
                if(getted) return;
                if(uid != guid) return;
                element.innerHTML = username;
                getted = true;
            });
            socket.emit('username', element.id.substr(1), uid);
        });
    }
    function RenderAuthorAvatar() {
        document.querySelectorAll(".style_avatar").forEach((element) => element.addEventListener("click", RenderUserProfile));
        document.querySelectorAll(".style_avatar").forEach((element) =>{
            let getted = false;
            const uid = guid();
            socket.on("avatar", (avatar, guid) => {
                if(getted) return;
                if(uid != guid) return;
                element.style.backgroundImage = `url('${avatar}')`;
                getted = true;
            });
            socket.emit('avatar', element.id.substr(1), uid);
        });
    }
    function RenderUserProfile(ev) {
        Render_Profile(ev.target.id.substr(1));
    }
    try{$(".form-control").autogrow();}catch{}
});