refreshRows()
function refreshRows() {
  var jqXHR = $.get('documents');
  jqXHR.done((res)=>{
    drawRows(res)
  })
}

function drawRows(data) {
  var table = $('#paper-table tbody');
  table.empty()
  data.forEach((e)=>{
    if (e.hasOwnProperty('filename')) {
      var filename = e['filename'];
    } else {
      var filename = 'default'
    }
    var title = '<a href="files/'+filename+'">'+e['title']+'</a>';
    var authors = "<div class='tag'>"+e['authors'].join("</div><div class='tag'>")+"</div><div class='tag add_tag'>+</div>";
    var tags = "<div class='tag'>"+e['tags'].join("</div><div class='tag'>")+"</div><div class='tag add_tag'>+</div>";
    var del = "<img class='action_icon' src='static/icons/delete-photo.png'onclick='deleteDocument(this)' id="+e['_id']+"></img>"
    var download = "<img class='action_icon' src='static/icons/cloud-computing.png' onclick='window.location=&quot;files/"+filename+"&quot;'></img>"
    var edit = "<img class='action_icon' src='static/icons/edit.png' onclick='activateEditOverlay(this)'></img>"
    var view = "<a href='files/"+filename+"' target='_blank'><img class='action_icon' src='static/icons/open-book-top-view.png'></img></a>"
    var actions =del+edit+view
    table.append("<tr class='filerow'><td>"+title+"</td><td>"+authors+"</td><td>"+tags+"</td><td>"+actions+"</td></tr>");
  })
}

$('#fieldInput').autocomplete({
  minLength:0,
  autoFocus:true,
  delay:0,
  source: ['authors', 'tags', 'title']
})

function activateEditOverlay(file) {
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': false, // maintain overlay when clicked (default: false)
      'onclose': function() {} // execute function when overlay is closed
    };
    var el = document.createElement('div');
    el.style.width = '25%';
    el.style.margin = '100px auto';
    el.style.backgroundColor = '#fff';
    var overlayEl = mui.overlay('on', options, el);
    var el = $(el)
    el.append($('#editPanel').clone().prop('id', 'instantiatedEdit'))
    $('#instantiatedEdit').show()
}
