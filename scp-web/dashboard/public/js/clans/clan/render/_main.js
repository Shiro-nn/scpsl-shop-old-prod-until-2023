let _rendered = false;
const RenderElements = {
    news: null,
    boosts: null,
    users: null,
    chat: null,
    settings: null
}
document.body.addEventListener('custom.load', () => {
    if(_rendered) return;
    console.warn('НАЧИНАЕМ РЕНДЕРИТЬ!!!!!!');
    RenderElements.news = new News();
    RenderElements.boosts = new Boosts();
    RenderElements.users = new Users();
    RenderElements.chat = new Chat();
    RenderElements.settings = new Settings();
    _rendered = true;
    document.body.dispatchEvent(new Event('custom.rendered'));
});