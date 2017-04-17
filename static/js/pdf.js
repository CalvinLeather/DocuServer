function processPDF(data) {
  let p1 = new Promise((resolve, reject)=>{
  require.config({paths:{'pdfjs-dist':'bower_components/pdfjs-dist'}})
  var pdf = require(['pdfjs-dist/build/pdf'], function(pdf){
    pdf.getDocument(data).then(function(pdf){
      var total = pdf.numPages;
      console.log(total);
      var text = [];
      var i = 1;
      for (var i;i<=total;i++){
        console.log(total)
        console.log(i)
        var page = pdf.getPage(i);
        page.then((e)=>{
          console.log(e)
          e.getTextContent().then(
            (r)=>{
              console.log(r)
              r.items.forEach((el)=>{text.push(el.str)})
              if ((e.pageIndex+2) == total) {
                console.log('s')
                resolve(text);
              }
            },
            (e)=>{
              console.log(e)
            })
          }, (e)=>{
          console.log('error'+e)
        })
      }
    })
  })
  }
  )
  return p1;
}

function findAuthorCandidate(string) {
  var potential_authors = []
  var find_authors = new RegExp(/([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)|( [A-Z][a-z]+ [A-Z][a-z]+)/, 'g')
  while ((match = find_authors.exec(string)) !== null) {
    potential_authors.push(match[0])
    $('#instantiatedEdit .author_tags').append("<div class='tag author_tag'>"+match[0]+"</div>")
  }
  return potential_authors
}

function getCounts(string) {
  var distances = {};
  var words = string.split(' ')
  $.map(words,function(e,i) {
     distances[e] = (distances[e] || 0) + 1;
  });
  return distances
}

function getDOI(string){
  var find_doi = new RegExp(/10\.([0-9])+\/([a-z0-9\.\-])+ /,"ig")
  var match = find_doi.exec(string)
  if (match) {
    return match[0].trim()
  }
}
