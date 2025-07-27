{
    let redirecting = false;
    const main = () => {
        const threshold = 170;
        const widthThreshold = globalThis.outerWidth - globalThis.innerWidth > threshold;
        const heightThreshold = globalThis.outerHeight - globalThis.innerHeight > threshold;
    
        if(
            !(heightThreshold && widthThreshold)
            && ((globalThis.Firebug && globalThis.Firebug.chrome && globalThis.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
        ){
            try{document.head.innerHTML = '';}catch{}
            try{document.body.innerHTML = '';}catch{}
            if(redirecting) return;
            window.location.href = '/old';
            redirecting = true;
        }
    };
    main();
    setInterval(main, 500);
}