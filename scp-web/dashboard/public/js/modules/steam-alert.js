socket.on('steam.empty', async(empty) => {
    if(!empty) return;
    const e1 = document.createElement('div');
    e1.style = 'z-index: 99;'+
'position: fixed;'+
'padding: 20px;'+
'background-color: #f44336;'+
'color: white;'+
'margin-bottom: 5px;'+
'width: 50vw !important;'+
'align-items: center !important;'+
'text-align: center !important;'+
'margin-left: 25vw !important;'+
'bottom: 50vh !important;'+
'border: 1px solid transparent;'+
'border-radius: .25rem;'+
'font-family: Roboto,sans-serif;'+
'font-size: 4vw;'+
'font-weight: 400;'+
'line-height: 1.5;';
    document.body.appendChild(e1);
    const href = document.createElement('a');
    href.style = 'text-decoration: revert; color: #fff;';
    href.innerHTML = 'Привяжи стим (нажми)';
    href.href = '/steam';
    e1.appendChild(href);
    const e2 = document.createElement('span');
    e2.style = 'margin-left: 15px;'+
'color: white;'+
'font-weight: bold;'+
'float: right;'+
'font-size: 22px;'+
'line-height: 20px;'+
'cursor: url(/cursors/red/pointer.cur), pointer;'+
'transition: 0.3s;';
    e2.innerHTML = '&times;';
    e1.appendChild(e2);
    e2.onclick = () => e1.outerHTML = '';
})
socket.on('connect', () => socket.emit('steam.empty'));
if(socket.connected) socket.emit('steam.empty');