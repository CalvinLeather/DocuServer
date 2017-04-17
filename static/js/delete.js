function deleteDocument(row) {
    var jqXHR_delete = $.ajax({url:'documents',
                              data:{'id':row.id},
                              method:'DELETE'});
    jqXHR_delete.done((res)=>{
      var entire_row = row.parentNode.parentNode;
      var parent = entire_row.parentNode;
      parent.removeChild(entire_row);
    })
}
