let array = document.getElementsByTagName('iframe');
for (let index = 0; index < array.length; index++) {
  const iframe = array[index];
  var iframeDoc = iframe.contentWindow.document;
  if (iframeDoc.readyState == 'complete') {
    iframeDoc.body.style.backgroundColor = '#00000000';
  }
  iframe.onload = function() {
    var iframeDoc2 = iframe.contentWindow.document;
    iframeDoc2.body.style.backgroundColor = '#00000000';
  }
}