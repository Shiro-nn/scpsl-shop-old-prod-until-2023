class Logger{
    constructor() {
        const uid = 'l' + 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});
        const e0 = document.createElement('module');
        e0.id = 'logger';
        document.getElementsByTagName('body')[0].appendChild(e0);
        const e1 = document.createElement('div');
        e1.className = 'logger_1';
        e1.id = uid;
        e0.appendChild(e1);
        const e2 = document.createElement('logger-menu');
        e2.className = 'logger_2';
        e2.style.display = 'none';
        e1.appendChild(e2);
        this.menu = e2;
        const e3 = document.createElement('div');
        e3.className = 'logger_3';
        e2.appendChild(e3);
        const e4 = document.createElement('div');
        e4.className = 'logger_4';
        e3.appendChild(e4);
        const e5 = document.createElement('span');
        e5.className = 'logger_5';
        e5.innerHTML = 'Список логов';
        e4.appendChild(e5);
        const stl = document.createElement('style');
        stl.innerHTML = `
#${uid}.logger_1{
margin: 0;
font-family: "Source Sans Pro";
font-size: .875rem;
font-weight: 400;
line-height: 1.6;
color: #ccc;
text-align: left;
background-color: #0000;
}
#${uid}.logger_1{
position: fixed;
z-index: 1050;
top: 0px;
right: 0px;
will-change: transform;
transform: translate(-140px, 39px);
}
#${uid} .logger_2{
position: static;
display: block;
right: auto;
bottom: auto;
min-width: 300px;
max-height: 80vh;
overflow-y: auto;
box-shadow: 0 0 1rem rgb(0 0 0 / 25%), 0 1px 1px rgb(0 0 0 / 12%);
top: 100%;
left: 0;
z-index: 1000;
float: left;
padding: .5rem 0;
margin: .125rem 0 0;
font-size: 12px;
color: #ccc;
text-align: left;
list-style: none;
background-color: #1D272D;
background-clip: padding-box;
border: 1px solid rgba(0,0,0,0.15);
border-radius: .4rem;
}
#${uid} .logger_3{
align-items: center !important;
display: flex !important;
}
#${uid} .logger_4{
display: block;
padding: .5rem 1.5rem;
margin-bottom: 0;
font-size: .85rem;
color: #adb5bd;
white-space: nowrap;
}
#${uid} .logger_5{
cursor: text;
}
#${uid} .logger_6, #${uid} .logger_6 *{
cursor: pointer;
}
#${uid} .logger_7{
flex: none;
display: inline-flex;
align-items: center;
flex-wrap: nowrap;
justify-content: flex-start;
overflow: hidden;
margin: 0;
margin-left: auto !important;
font-weight: 400;
color: #ced4da;
text-decoration: none;
text-align: center;
vertical-align: middle;
user-select: none;
background-color: transparent;
border: 2px solid transparent;
padding: .3rem .9rem;
font-size: .875rem;
line-height: 1.6;
border-radius: .4rem;
transition: all 0.15s ease-in-out;
-webkit-appearance: button;
text-transform: none;
}
#${uid} .logger_7 svg{
overflow: hidden;
vertical-align: middle;
pointer-events: none;
width: 16px;
height: 16px;
}
#${uid} .logger_8{
display: flex;
align-items: center;
padding: 5px 0 5px 25px;
}
#${uid} .logger_9{
padding: 4px 7px;
width: 36px;
height: 32px;
background: rgba(0,0,0,0.25);
margin-right: 12px;
position: relative;
}
#${uid} .logger_10{
overflow: hidden;
top: 50%;
left: 50%;
transform: translateY(-50%) translateX(-50%);
position: absolute;
}
}
#${uid} .logger_11{
display: flex;
flex-direction: column;
min-width: 0;
margin-right: auto;
margin-bottom: 3px;
width: 100%;
}
#${uid} .logger_12{
margin: 0;
max-width: 183px;
/*white-space: nowrap;*/
text-overflow: ellipsis;
overflow: hidden;
display: inline-block;
}
#${uid} .logger_12 span{
cursor: text;
}`;
        e1.appendChild(stl);
        this.logsCount = 0;
    }
    log(message) { this.create(`<span>${message}</span>`, 1); }
    info(message) { this.create(`<span>${message}</span>`, 1); }
    warn(message) { this.create(`<span>${message}</span>`, 2); }
    error(message) { this.create(`<span>${message}</span>`, 3); }
    create(message, type) {
        if(type < 1 || type > 3) return;
        if(this.logsCount == 0) this.menu.style = '';
        this.logsCount++;
        const _new = document.createElement("div");
        {
            _new.className = 'logger_8';
            {
                const __new = document.createElement("div");
                __new.className = 'logger_9';
                if(type == 1) __new.innerHTML = '<svg class="logger_10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="6px" height="15px" viewBox="0 0 6 16" version="1.1">'+
                '<g id="surface1">'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:#ccc;fill-opacity:1;" d="M 4.5 2.5 C 4.5 3.328125 3.828125 4 3 4 C 2.171875 4 1.5 3.328125 1.5 2.5 C 1.5 1.671875 2.171875 1 3 1 C 3.828125 1 4.5 1.671875 4.5 2.5 Z M 0 7 C 0 6.445312 0.445312 6 1 6 L 3 6 C 3.554688 6 4 6.445312 4 7 L 4 14 L 5 14 C 5.554688 14 6 14.445312 6 15 C 6 15.554688 5.554688 16 5 16 L 1 16 C 0.445312 16 0 15.554688 0 15 C 0 14.445312 0.445312 14 1 14 L 2 14 L 2 8 L 1 8 C 0.445312 8 0 7.554688 0 7 Z M 0 7 "/>'+
                '</g></svg>';
                else if(type == 2) __new.innerHTML = '<svg class="logger_10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 15 15" version="1.1"'+
                '<g id="surface1">'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(80%,80%,80%);fill-opacity:1;" d="M 2.003906 2.398438 C 0.957031 3.523438 0.3125 4.878906 0.0664062 6.476562 C 0.00390625 6.894531 -0.00390625 8.019531 0.0546875 8.4375 C 0.277344 10.050781 0.925781 11.429688 2.015625 12.613281 L 2.199219 12.8125 L 2.613281 12.402344 L 3.027344 11.988281 L 2.804688 11.738281 C 1.878906 10.699219 1.335938 9.464844 1.203125 8.101562 C 1.03125 6.34375 1.605469 4.609375 2.796875 3.265625 L 3.011719 3.027344 L 2.597656 2.617188 L 2.183594 2.210938 Z M 2.003906 2.398438 "/>'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(80%,80%,80%);fill-opacity:1;" d="M 12.398438 2.617188 L 11.988281 3.03125 L 12.160156 3.222656 C 13.363281 4.523438 13.96875 6.332031 13.796875 8.101562 C 13.664062 9.460938 13.117188 10.703125 12.195312 11.742188 L 11.972656 11.988281 L 12.796875 12.8125 L 12.980469 12.613281 C 15.488281 9.933594 15.679688 5.796875 13.421875 2.90625 C 13.320312 2.773438 13.140625 2.558594 13.023438 2.429688 L 12.808594 2.207031 Z M 12.398438 2.617188 "/>'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(80%,80%,80%);fill-opacity:1;" d="M 7.074219 2.390625 C 7.027344 2.398438 6.882812 2.417969 6.753906 2.433594 C 6.453125 2.472656 5.921875 2.609375 5.632812 2.726562 C 5.28125 2.867188 4.820312 3.117188 4.511719 3.335938 C 4.15625 3.582031 3.554688 4.179688 3.300781 4.539062 C 3.066406 4.871094 2.730469 5.535156 2.609375 5.910156 C 2.117188 7.402344 2.328125 9.015625 3.183594 10.34375 C 4.46875 12.316406 6.957031 13.171875 9.179688 12.402344 C 10.246094 12.03125 11.195312 11.289062 11.816406 10.34375 C 12.671875 9.023438 12.882812 7.398438 12.390625 5.910156 C 12.269531 5.535156 11.933594 4.871094 11.707031 4.554688 C 10.886719 3.417969 9.699219 2.679688 8.320312 2.445312 C 8.074219 2.398438 7.25 2.367188 7.074219 2.390625 Z M 8.246094 3.617188 C 10.082031 4 11.378906 5.492188 11.472656 7.339844 C 11.5625 9.101562 10.445312 10.742188 8.773438 11.304688 C 8.296875 11.460938 8.0625 11.496094 7.5 11.496094 C 6.929688 11.496094 6.695312 11.460938 6.210938 11.292969 C 4.960938 10.867188 3.976562 9.8125 3.648438 8.542969 C 3.195312 6.789062 3.96875 4.960938 5.554688 4.058594 C 5.957031 3.828125 6.542969 3.632812 7.003906 3.574219 C 7.304688 3.539062 7.964844 3.558594 8.246094 3.617188 Z M 8.246094 3.617188 "/>'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(80%,80%,80%);fill-opacity:1;" d="M 6.914062 6.488281 L 6.914062 8.261719 L 8.085938 8.261719 L 8.085938 4.71875 L 6.914062 4.71875 Z M 6.914062 6.488281 "/>'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(80%,80%,80%);fill-opacity:1;" d="M 6.914062 9.757812 L 6.914062 10.34375 L 8.085938 10.34375 L 8.085938 9.171875 L 6.914062 9.171875 Z M 6.914062 9.757812 "/>'+
                '</g></svg>';
                else if(type == 3) __new.innerHTML = '<svg class="logger_10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 15 15" version="1.1">'+
                '<g id="surface1">'+
                '<path style=" stroke:none;fill-rule:nonzero;fill:#ccc;fill-opacity:1;" d="M 7.5 0 C 9.054688 0 10.3125 1.257812 10.3125 2.8125 L 10.3125 2.917969 C 10.3125 3.378906 9.941406 3.75 9.480469 3.75 L 5.519531 3.75 C 5.058594 3.75 4.6875 3.378906 4.6875 2.917969 L 4.6875 2.8125 C 4.6875 1.257812 5.945312 0 7.5 0 Z M 1.210938 3.085938 C 1.578125 2.722656 2.171875 2.722656 2.539062 3.085938 L 4.414062 4.960938 C 4.4375 4.984375 4.453125 5.003906 4.46875 5.023438 C 4.886719 4.8125 5.359375 4.691406 5.863281 4.691406 L 9.140625 4.691406 C 9.640625 4.691406 10.113281 4.8125 10.53125 5.023438 C 10.550781 5.003906 10.566406 4.984375 10.585938 4.960938 L 12.460938 3.085938 C 12.828125 2.722656 13.421875 2.722656 13.789062 3.085938 C 14.15625 3.453125 14.15625 4.046875 13.789062 4.414062 L 11.914062 6.289062 C 11.894531 6.3125 11.875 6.328125 11.851562 6.34375 C 12.035156 6.695312 12.148438 7.085938 12.179688 7.503906 L 14.0625 7.503906 C 14.582031 7.503906 15 7.921875 15 8.441406 C 15 8.960938 14.582031 9.378906 14.0625 9.378906 L 12.1875 9.378906 C 12.1875 10.097656 12.027344 10.777344 11.734375 11.386719 C 11.800781 11.425781 11.859375 11.472656 11.914062 11.527344 L 13.789062 13.402344 C 14.152344 13.769531 14.152344 14.363281 13.789062 14.730469 C 13.421875 15.097656 12.828125 15.097656 12.460938 14.730469 L 10.609375 12.882812 C 9.894531 13.519531 8.976562 13.941406 7.964844 14.042969 L 7.964844 7.03125 C 7.964844 6.773438 7.753906 6.5625 7.496094 6.5625 C 7.238281 6.5625 7.027344 6.773438 7.027344 7.03125 L 7.027344 14.039062 C 6.015625 13.9375 5.101562 13.515625 4.382812 12.878906 L 2.539062 14.726562 C 2.171875 15.089844 1.578125 15.089844 1.210938 14.726562 C 0.84375 14.359375 0.84375 13.765625 1.210938 13.398438 L 3.085938 11.523438 C 3.140625 11.46875 3.199219 11.421875 3.261719 11.382812 C 2.972656 10.773438 2.8125 10.09375 2.8125 9.375 L 0.9375 9.375 C 0.417969 9.375 0 8.957031 0 8.4375 C 0 7.917969 0.417969 7.5 0.9375 7.5 L 2.820312 7.5 C 2.851562 7.085938 2.96875 6.695312 3.148438 6.34375 C 3.125 6.324219 3.105469 6.308594 3.085938 6.289062 L 1.210938 4.414062 C 0.84375 4.046875 0.84375 3.453125 1.210938 3.085938 Z M 1.210938 3.085938 "/>'+
                '</g></svg>';
                _new.appendChild(__new);
            }
            {
                const __new = document.createElement("div");
                __new.className = 'logger_11';
                {
                    const ___new = document.createElement("label");
                    ___new.className = 'logger_12';
                    ___new.innerHTML = message;
                    __new.appendChild(___new);
                }
                _new.appendChild(__new);
            }
            {
                const __new = document.createElement("button");
                __new.className = 'logger_7 logger_6';
                __new.innerHTML = '<svg aria-hidden="true"focusable="false" role="img" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-'+
                    '3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 '+
                    '11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" fill="currentColor"></path></svg>';
                _new.appendChild(__new);
                __new.onclick = () => {
                    _new.outerHTML = ''
                    this.logsCount--;
                    if(this.logsCount == 0) this.menu.style.display = 'none';
                };
            }
        }
        this.menu.appendChild(_new);
    }
}