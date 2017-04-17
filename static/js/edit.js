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
