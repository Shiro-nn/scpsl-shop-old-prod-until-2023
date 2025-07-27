(()=>{
window.addEventListener('resize', () => UpdateLabel());
UpdateLabel();
function UpdateLabel() {
const _ = document.querySelector('.verify label');
const px = _.clientHeight;
_.style.margin = px / 10 + 'px';
_.style.fontSize = (px - ((px / 10) * 2)) + 'px';
}
})();
(()=>{
history.pushState('Qurre ID', 'Qurre ID', location.origin + location.pathname);
})();
(()=>{
socket.on('auth.verify.check', (error, msg) => {
    if(error) document.querySelector('.verify').classList.add('error');
    else document.querySelector('.verify').classList.add('success');
    document.querySelector('.verify label').innerHTML = msg;
    socket.disconnect();
})
socket.emit('auth.verify.check', key);
})();