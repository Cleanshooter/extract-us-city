$('#extract').click(() => {
  const text = $('#extractFrom').val();
  console.log(text);
  var data = extractUsCity.extract(text);
  var hlStart = '<span class="highlight">'; // 22
  var hlEnd = '</span>'; // 7
  if (data && data.length > 0){
    $('#resultData').html(prettyPrintJson.toHtml(data));
    var newText = String(text);
    data.forEach((item, i) => {
      var each = i * 31;
      newText = newText.slice(0, item.start + each) + hlStart + newText.slice(item.start + each);
      newText = newText.slice(0, item.end + 24 + each) + hlEnd + newText.slice(item.end + 24 + each);
    })
    $('#highlighted').html(newText);
  } else {
    $('#resultData').html([prettyPrintJson.toHtml([])]);
    $('#highlighted').html('No cities found... <br/>Think you found a use case I missed? Please submit an issue on GitHub!');
  }
  
});
