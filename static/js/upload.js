function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  var formData = new FormData();
  // files is a FileList of File objects. List some properties.
  var output = [];
  activateEditOverlay('new');
  var progress = $('.percent');
  $('#progress_bar').show();
  for (var i = 0, f; f = files[i]; i++) {
    $('#instantiatedEdit input[name=title]').val(f.name);
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
    formData.append('file', f, f.name);
  }
  $('#instantiatedEdit .submitEditButton').on('click', () => {
    formData.append('title', $('#instantiatedEdit input[name=title]').val() );
    formData.append('authors', $('#instantiatedEdit input[name=authors]').val());
    formData.append('tags', $('#instantiatedEdit input[name=tags]').val());
    console.log(formData)
    var jqXHR_upload = $.ajax({
      url:'documents',
      method:'POST',
      data:formData,
      processData: false,
      contentType: false,
    })
    jqXHR_upload.then((e)=>{
      console.log(e)
      mui.overlay('off');
    })
  })
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleFileSelect, false);
