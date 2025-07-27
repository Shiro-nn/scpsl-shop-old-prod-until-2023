if(window.location.protocol == 'http:' && window.location.host != 'localhost'){
    window.location.href = 'https://' + window.location.host + window.location.pathname;
}