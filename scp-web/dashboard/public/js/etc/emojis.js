var img;
$('#send_emj').on('click', function (ev) {
    if(img == null) return;
    const cdn_host = 'https://cdn.scpsl.shop';
    const name = document.getElementById('name_emj').value;
    const hash = guid().replace("#", '').replace("?", '');
    const format = img.name.split('.')[img.name.split('.').length-1];
    $.ajax({
        type:'post',
        url:`/community/emojis`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({name, img: `${cdn_host}/scpsl/emojis/${hash}.${format}`})
    });
    var formData = new FormData();
    formData.append("name", hash);
    formData.append("dir", 'scpsl/emojis');
    formData.append("filedata", img);
    var request = new XMLHttpRequest();
    request.open("POST", `${cdn_host.replace('cdn.', 'cdn-uploader.')}/upload`);
    request.send(formData);
    location.reload();
});
const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}

$('input[id=f1]').change(function(e) {
    thisFunctionShoulBeCallByTheFileuploaderButton(e);
});
function thisFunctionShoulBeCallByTheFileuploaderButton(e){
    e.preventDefault && e.preventDefault();
    var i;
    var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
    if(images && images.length) {
        for(i in images) {
            if(typeof images[i] != 'object') continue;
            if (images[i].type.match(/image.*/)) {
                img = images[i];
            }
        }
    }
}