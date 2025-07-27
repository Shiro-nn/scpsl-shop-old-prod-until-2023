var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink");
editor.session.setMode("ace/mode/css");
editor.getSession().setUseWorker(false);
$('#style_create').on('click', function (ev) {
    let name = document.getElementById('style_name').value;
    let desc = document.getElementById('style_desc').value;
    let public_access = document.getElementById('public_access').checked;
    let link_access = document.getElementById('link_access').checked;
    let code = editor.getValue();
    let imgs = [];
    document.querySelectorAll("#imgs").forEach((element) => imgs.push(element.value));
    $.ajax({
        type:'post',
        url:`/style/create`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({name, desc, public_access, link_access, code, imgs}),
        success:function(data) {
            window.top.location.href = data;
        },
        error:function(e, d, m) {
            window.top.location.href = e.responseText;
        }
    });
});
$('#style_edit').on('click', function (ev) {
    let desc = document.getElementById('style_desc').value;
    let public_access = document.getElementById('public_access').checked;
    let link_access = document.getElementById('link_access').checked;
    let code = editor.getValue();
    let imgs = [];
    document.querySelectorAll("#imgs").forEach((element) => imgs.push(element.value));
    $.ajax({
        type:'post',
        url:window.location.href,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({desc, public_access, link_access, code, imgs}),
        success:function(data) {
            window.top.location.href = data;
        },
        error:function(e, d, m) {
            window.top.location.href = e.responseText;
        }
    });
});