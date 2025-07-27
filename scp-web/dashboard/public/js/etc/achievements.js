var img;
$('#send_achv').on('click', function (ev) {
    const cdn_host = 'https://cdn.scpsl.shop';
    let name = document.getElementById('name_achvm').value;
    let desc = document.getElementById('desc_achvm').value;
    if(img == null) return;
    $.ajax({
        type:'post',
        url:`/community/achievements`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 5000,
        data: JSON.stringify({name, img: `${cdn_host}/scpsl/img/achievements/${img.name}`, desc})
    });
    let imgname = img.name.split('.')[0];
    var formData = new FormData();
    formData.append("name", imgname);
    formData.append("dir", 'scpsl/img/achievements');
    formData.append("filedata", img);
    var request = new XMLHttpRequest();
    request.open("POST", `${cdn_host.replace('cdn.', 'cdn-uploader.')}/upload`);
    request.send(formData);
    location.reload();
});

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
$(document).ready(function () {
    try{$("#desc_achvm").autogrow();}catch{}
});