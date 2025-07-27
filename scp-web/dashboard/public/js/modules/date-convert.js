document.querySelectorAll("date-convert").forEach((el) => DateConvert(el));
function DateConvert(element) {
    const time = new Date(parseInt(element.innerHTML));
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };
    const aria = time.toLocaleString("ru", options);
    element.innerHTML = aria;
}