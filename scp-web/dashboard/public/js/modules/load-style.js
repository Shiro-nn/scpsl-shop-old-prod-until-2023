const cached_style = localStorage.getItem('custom-style');

if (cached_style && cached_style.length > 0) {
    load_style(cached_style);
} else {
    fetch('/css/custom_style', {cache: "no-cache"}).then(async(res) => {
        const style = await res.text();
        localStorage.setItem('custom-style', style);
        load_style(style);
    });
}

function load_style(style) {
    const element = document.createElement('style');
    element.innerHTML = style;
    document.head.appendChild(element);
}