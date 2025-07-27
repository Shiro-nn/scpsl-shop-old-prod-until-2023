window.addEventListener('load', () => {
    var isFramed = false;
    try {
      isFramed = window != window.top || document != top.document || self.location != top.location;
    } catch (e) {
      isFramed = true;
    }
    if (isFramed) {
        let href = window.location.href || window.top.location.href;
        if(!href.includes('frame')){
            window.location.href = `/donate/rules/frame`;
        }
    }else{
        let href = window.location.href || window.top.location.href;
        if(href.includes('frame')){
            window.location.href = `/donate/rules`;
            window.top.location.href = `/donate/rules`;
        }
    }
});