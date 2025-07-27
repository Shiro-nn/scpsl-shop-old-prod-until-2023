document.querySelector('.trailer .play').addEventListener('click', () => {
    document.querySelector('.trailer .play').outerHTML = '';
    document.querySelector('.trailer .loader').outerHTML = '';
    let DisabledAudio = true;
    const media = document.querySelector('video');
    const audio = document.querySelector('.trailer .audio');
    media.addEventListener('ended', stopMedia);
    try{media.volume = 0;}catch{}
    function stopMedia() {
        try{media.pause();}catch{}
        try{media.currentTime = 0;}catch{}
    }
    audio.addEventListener('click', () => {
        if(DisabledAudio){
            DisabledAudio = false;
            try{media.volume = 1;}catch{}
            try{audio.src = cdn+'/img/index/volume-high-solid.svg';}catch{}
        }else{
            DisabledAudio = true;
            try{media.volume = 0;}catch{}
            try{audio.src = cdn+'/img/index/volume-xmark-solid.svg';}catch{}
        }
    });
    media.addEventListener('play', function() {
        media.style.visibility = 'visible';
        media.style.display = '';
    });
    media.play();
});