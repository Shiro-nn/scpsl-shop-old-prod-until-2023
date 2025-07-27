(() => {
    let already = false;
    document.getElementById('reset_password').addEventListener('click', async() => {
        if(already) return;
        already = true;
        {
            const mssg = document.querySelector('.mssg');
            mssg.classList.add('animate');
            mssg.innerHTML = 'Отправка...';
        }
        const do_pass = document.getElementById('user_pass').value;
        Waiting();
        const pass = await hash(do_pass);
        const res = await fetch(window.location.href, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pass})
        });
        const _data = await res.json();
        if(_data.error) return alert(_data.msg);
        window.location.href = '/auth';
    })
    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    }
})();