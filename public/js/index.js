
$(window).load(function() {
    $.post('/ins/ajax/headimg')
    .done(function(result){
        if(result.err){
            alert('get headimg err');
            return;
        }
        
        //alert(JSON.stringify(result));
        //instagram img resolution: 640x640
        $('#headimg').css('width', '650px');
        $('#headimg img').attr('src', result.url);
    })
});