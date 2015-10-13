
$(window).load(function() {
    var infos = [];
    $.post('/ins/ajax/recent')
    .done(function(result){
        if(result.err){
            alert('get recent photos fail');
            return;
        }
       
        infos = result; 
        //alert(JSON.stringify(result));
        //instagram img resolution: 640x640
        var $photos = $('#photos');
        $photos.empty();
        infos.forEach(function(info){
            $photos.add(
                 '<div class="col-sm-6 col-md-3 col-xs-6" >'
                +'<div id="'+info.id+'" class="thumbnail" data-toggle="model" data-target="#bigimg">'
                +'<img src='+info.url_low' alt="my photo">
                +'<div class="caption">
                +'<h3>'+info.caption+'</h3>'
                +'<p>'+(info.desc||'no desc')+'</p>'
                +'</div>'
                +'</div>'
                +'</div>'
                ); 
        }); 
    })
});