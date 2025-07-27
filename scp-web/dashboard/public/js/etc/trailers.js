window.addEventListener('load', () => {
    let DisabledAudio = true;
    const media = document.getElementById('vid.trailer');
    const audio = document.getElementById('trailer_audio');
    const full = document.getElementById('trailer_full');
    media.addEventListener('ended', stopMedia);
    try{media.volume = 0;}catch{}
    function stopMedia() {
        try{media.pause();}catch{}
        try{media.currentTime = 0;}catch{}
        try{document.exitFullscreen()}catch{}
        try{media.style.visibility = 'hidden';}catch{}
        try{audio.style.visibility = 'hidden';}catch{}
        try{full.style.visibility = 'hidden';}catch{}
    }
    audio.addEventListener('click', () => {
        if(DisabledAudio){
            DisabledAudio = false;
            try{media.volume = 1;}catch{}
            try{audio.src = _cdn_host+'/scpsl/img/index/volume-high-solid.svg';}catch{}
        }else{
            DisabledAudio = true;
            try{media.volume = 0;}catch{}
            try{audio.src = _cdn_host+'/scpsl/img/index/volume-xmark-solid.svg';}catch{}
        }
    });
    full.addEventListener('click', () => {
        media.requestFullscreen();
        media.style.visibility = 'visible';
        media.style.display = '';
    });
    media.addEventListener('play', function() {
        media.style.visibility = 'visible';
        media.style.display = '';
    });
    media.play();
});