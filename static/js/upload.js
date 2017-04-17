function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  activateEditOverlay('new');
  require(['static/js/spin.js'], function(Spinner) {
    var spinner = new Spinner({position:'relative'}).spin()
    $('#instantiatedEdit .panelForm').hide()
    $('#instantiatedEdit .spinner_div').show()
    $('#instantiatedEdit .spinner_div').append(spinner.el)
  })

  var files = evt.dataTransfer.files; // FileList object.
  var formData = new FormData();
  // files is a FileList of File objects. List some properties.
  var output = [];

  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
    formData.append('file', f, f.name);

  }
    formData.append('title', 'default');
    formData.append('authors','default');
    formData.append('tags', 'default');
    var jqXHR_upload = $.ajax({
      url:'documents',
      method:'POST',
      data:formData,
      processData: false,
      contentType: false,
    })
    jqXHR_upload.done((e)=>{
      var doc = JSON.parse(e);
      $('#instantiatedEdit input[name=id]').first().val(doc._id);
      var text_promise = processPDF('files/'+JSON.parse(e).filename)
      text_promise.then((s)=>{
        var pdf_string = s.join(' ');
        var counts = getCounts(pdf_string)
        var filtered = {}
        var item_length = 20
        console.log('asdf')
        while (Object.keys(filtered).length<5) {
          var filtered = Object.keys(counts).reduce(function(filtered, key) {
            if (counts[key]>10 && key.length>item_length) filtered[key]=counts[key];
            return filtered;},{})
            console.log(filtered)
            item_length--        }
        console.log(filtered)
        $('#instantiatedEdit input[name=tags]').val(Object.keys(filtered).join(','))
        $('#instantiatedEdit .panelForm').show()
        $('#instantiatedEdit .spinner_div').hide()
        var buffer = '';
        var potential_authors = findAuthorCandidate(pdf_string);
        $('#instantiatedEdit .author_tag').on('click', (e)=>{
          $(e.target).toggleClass('tag_selected')
        })
        $('#instantiatedEdit input[name=title]').keyup(function(e) {
          buffer = $('#instantiatedEdit input[name=title]').val()
          var n = pdf_string.search(new RegExp(buffer,'i'));
          console.log(buffer)
          console.log(n)
          $('#instantiatedEdit .title_tags .title_tag').remove()
          pdf_string.substring(n, n+100).split(' ').forEach((e,i)=>{$('#instantiatedEdit .title_tags').append("<div id='title_tag_word_"+i+"' class='title_tag'>"+e+"</div>")});
          $('#instantiatedEdit .title_tag').on('click', (e)=>{
              if ($('#instantiatedEdit input[name=title_completed]').val()=="0") {
              var words = pdf_string.substring(n, n+100).split(' ')
              var id_str = $(e.target).attr('id')
              console.log(id_str)
              var stop_idx = parseInt(id_str.charAt(id_str.length-1))+1;
              console.log(stop_idx)
              console.log(words.slice(0, stop_idx).join(' '))
              $('#instantiatedEdit input[name=title]').val(words.slice(0, stop_idx).join(' '))
              $('#instantiatedEdit .title_tags .title_tag').remove()
              $('#instantiatedEdit input[name=title_completed]').val("1")
            } else if (e.key=="Backspace") {
              $('#instantiatedEdit input[name=title_completed]').val("0")

            }
          })
        })
        $('#instantiatedEdit .panelForm .submitEditButton').on('click', ()=>{
            var formData = new FormData();
            var authors = $('#instantiatedEdit .tag_selected').toArray().map((e)=>{return e.innerHTML}).join(',');
            formData.append('title', $('#instantiatedEdit input[name=title]').val());
            formData.append('authors',authors);
            formData.append('tags',$('#instantiatedEdit input[name=tags]').val());
            var jqXHR_upload = $.ajax({
              url:'documents/'+$('#instantiatedEdit input[name=id]').first().val(),
              method:'POST',
              data:formData,
              processData: false,
              contentType: false,
            }).done((e)=>{
               refreshRows()
                mui.overlay('off');
            })


        })
      },(err)=>{
        console.log(err)
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
