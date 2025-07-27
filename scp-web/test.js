(async () => {
    const yandexApi = '';
    const resp = await fetch('https://locator.api.maps.yandex.ru/v1/locate?apikey=' + yandexApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ip: [
                { address: '185.104.248.251' }
            ]
        })
    });
    const json = await resp.json();
    console.log(json)
    console.log(resp.status)
})();