window.addEventListener('load', () => {
    startup();
});
function startup() {
    document.querySelectorAll("#promo_input").forEach(function(colorWell) {
        colorWell.addEventListener("input", updateAll, false);
        colorWell.select();
    });
}
function updateAll(event) {
    document.getElementById(event.target.className).innerHTML = `${event.target.value}% - вам<br>${10 - event.target.value}% - скидка для донатера`;
}