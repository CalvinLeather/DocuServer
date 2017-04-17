var jqXHR = $.get('documents');
jqXHR.done((res)=>{
  var table = $('#paper-table tbody');
  res.forEach((e)=>{
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
})

$('#fieldInput').autocomplete({
  minLength:0,
  autoFocus:true,
  delay:0,
  source: ['authors', 'tags', 'title']
})
