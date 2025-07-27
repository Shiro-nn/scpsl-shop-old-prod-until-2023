class UploadManager{
    constructor(fileel){
        this.fileel = fileel;
        this.parent = document.getElementById('croppie.avatar');
        
        clanSocket.on('update.avatar', (avatar) => document.getElementById('clan.set.avatar').style.backgroundImage = `url('${avatar}')`);

        {
            const e1 = document.createElement('div');
            e1.className = 'ea1';
            e1.style.display = 'none';
            this.el = e1;
            this.parent.appendChild(e1);
            const e2 = document.createElement('div');
            e2.className = 'ea2';
            e1.appendChild(e2);
            const e3 = document.createElement('div');
            e3.className = 'ea3';
            e2.appendChild(e3);
            const e4 = document.createElement('div');
            e4.className = 'ea4';
            e3.appendChild(e4);

            const eup = document.createElement('div');
            e4.appendChild(eup);
            this.crel = eup;
            
            const e5 = document.createElement('div');
            e5.className = 'ea5';
            e4.appendChild(e5);
            {
                const e6 = document.createElement('button');
                e6.className = 'ea6';
                e6.onclick = () => this.el.style.display = 'none';
                e5.appendChild(e6);
                const e7 = document.createElement('div');
                e7.className = 'ea7';
                e7.innerHTML = 'Отмена';
                e6.appendChild(e7);
            }
            {
                const e6 = document.createElement('button');
                e6.className = 'ea6';
                let _loading = false;
                e6.onclick = () => {
                    if(this.crop == null || this.crop == undefined) return;
                    if(_loading) return logger.warn('Аватарка клана обновляется..');
                    const ths = this;
                    this.crop.result('canvas').then(function(resp) {
                        const file = ths.dataURLtoFile(resp, 'filedata.png');
                        try{Waiting()}catch{}
                        _loading = true;
                        const hash = guid().replace("#", '').replace("?", '');
                        const formData = new FormData();
                        formData.append('name', hash);
                        formData.append('dir', 'scpsl/clans/logo/' + tag);
                        formData.append('filedata', file);
                        const request = new XMLHttpRequest();
                        request.open('POST', 'https://cdn-uploader.scpsl.shop/upload');
                        request.onload = function () {
                            try{WaitingStop()}catch{}
                            _loading = false;
                            clanSocket.emit('update.avatar', hash);
                            ths.el.style.display = 'none';
                            ths.fileel.value = null;
                        };
                        request.send(formData);
                    });
                }
                e5.appendChild(e6);
                const e7 = document.createElement('div');
                e7.className = 'ea8';
                e7.innerHTML = 'Загрузить';
                e6.appendChild(e7);
            }
        }

        this.crop = new Croppie(this.crel, {
            viewport: {width: 400, height: 400},
            enableExif: true,
            //enableOrientation: true,
        });
    }
    createObjectURL = (i) => {
        var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        return URL.createObjectURL(i);
    }
    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
}