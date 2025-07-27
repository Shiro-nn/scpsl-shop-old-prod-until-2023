function getPosition(e){
    var x = y = 0;
    if (!e) {
        var e = window.event;
    }
    x = e.clientX;
    y = e.clientY;
    //if (e.pageX || e.pageY){
    //    x = e.pageX;
    //    y = e.pageY;
    //} else if (e.clientX || e.clientY){
    //    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    //    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    //}
    return {x: x, y: y}
}
function Waiting(ev = null) {
    var coord = getPosition(ev);
    if(coord.x > (window.innerWidth - 36)) coord.x = window.innerWidth - 36;
    if(coord.y > (window.innerHeight - 36)) coord.y = window.innerHeight - 36;
    const __el = document.getElementById('waiting');
    __el.style = '';
    __el.style.top = `${coord.y}px`;
    __el.style.left = `${coord.x}px`;
}
function WaitingStop() {
    document.getElementById('waiting').style.display = 'none';
}