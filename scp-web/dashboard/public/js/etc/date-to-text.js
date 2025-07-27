window.addEventListener('load', () => {
    document.querySelectorAll(".comment__time").forEach(function(element) {
        const time = new Date(parseInt(element.innerHTML));
        const day = time.getDate();
        const month = time.getMonth() + 1;
        const year = time.getFullYear();
        const hour = time.getHours();
        const minute = time.getMinutes();
        element.innerHTML = day + "." + month + "." + year + " " + hour + ':' + minute;
    });
});