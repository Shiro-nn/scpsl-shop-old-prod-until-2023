let array = document.getElementsByTagName('iframe');
for (let index = 0; index < array.length; index++) {
  const iframe = array[index];
  var iframeDoc = iframe.contentWindow.document;
  if (iframeDoc.readyState == 'complete') {
    var panel = iframeDoc.getElementsByClassName('nn1')[0];
    if(panel != null) panel.style = "display: none;";
    var dsinv = iframeDoc.getElementById('discord_inv');
    if(dsinv != null) dsinv.style = "display: none;";
  }
  iframe.onload = function() {
    var iframeDoc2 = iframe.contentWindow.document;
    iframeDoc2.getElementsByClassName('nn1')[0].style = "display: none;"
    var dsinv = iframeDoc2.getElementById('discord_inv');
    if(dsinv != null) dsinv.style = "display: none;";
  }
}