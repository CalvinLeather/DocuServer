$('#keyInput').on('keyup', (e)=>{
  data = {
    field:$('#fieldInput').val(),
    key:$('#keyInput').val(),
  }
  console.log(data.field)
  var jqXHR = $.ajax({
    url:'documents',
    data:data,
    method:'GET'
  });
  jqXHR.done((res)=>{
    console.log(res)
    drawRows(res)
  })
})
