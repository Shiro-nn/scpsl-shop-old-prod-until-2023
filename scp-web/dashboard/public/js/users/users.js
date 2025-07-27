$(window).scroll(function(e) {
    let windowHeight = window.innerHeight;
    var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    if(scrollY + windowHeight + windowHeight >= scrollHeight){
        var nl = document.getElementsByClassName('load')[0];
        if(nl != null) nl.classList = "loaded";
    }else if(scrollHeight - scrollY >= scrollHeight/(document.getElementsByClassName('loaded').length+1) + scrollHeight/(document.getElementsByClassName('loaded').length+1)){
        var lc = document.getElementsByClassName('loaded');
        var ld = lc[lc.length-1];
        if(ld != null) ld.classList = "load";
    }
});
function myFunction() {
    var input, filter, li, a, i, txtValue;
    input = document.getElementById('input');
    if(input.value.length > 0){
        $('#all_users').fadeOut(0);
        $('#search_users').fadeIn(0);
    }else{
        $('#search_users').fadeOut(0);
        $('#all_users').fadeIn(0);
    }
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName('us');
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("span")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }