/**
 * Set type block on Slider
 *
 * @param blockNumber
 * @param textarea
 */
const sliderBlock = function(blockNumber, textarea) {
    destroyWysiwyg(blockNumber, textarea);
    destroyTabs(blockNumber, textarea);
    destroyImageText(blockNumber, textarea);

    // init block
    textarea.hide();
    textarea.after('<div id="page_blocks_' + blockNumber + '_sliders" class="sliders"><ul><li class="add-slide"><button type="button"><i class="fas fa-plus"></i></button></li></ul></div>');
    let countSlide = -1;

    // if data exist in database, set sliders, else init
    if($('#page_blocks_'+blockNumber+'_value').text().length > 0) {
        var contentObject = $.parseJSON($('#page_blocks_' + blockNumber + '_value').val());
        contentObject.sliders.forEach(function(e, i) {
            $.get( "/admin/file/api/" + e.image.id, function( img ) {
                countSlide++;
                var li = '<li data-slide="' + i + '" data-img-id="' + e.image.id +'" data-title="' + e.title +'" data-description="' + e.description +'" data-img-path="' + img.path +'" class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + e.title + '</b><img src="/' + img.path + '" width="98px" height="98px"></li>';
                $('#page_blocks_' + blockNumber + '_sliders li.add-slide').before(li);
                editSlide(blockNumber);
            }).catch(function(){
                countSlide++;
                var li = '<li data-slide="' + i + '" data-img-id="' + e.image.id +'" data-title="' + e.title +'" data-description="' + e.description +'" data-img-path class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + e.title + '</b><img src="" width="98px" height="98px"></li>';
                $('#page_blocks_' + blockNumber + '_sliders li.add-slide').before(li);
            });
        });
    }

    // create modal
    $('.main').append('<div id="page_blocks_' + blockNumber + '_sliders_modal" class="modal modal-fixed-footer sliders-modal">' +
        '<form class="form-slide" name="form-slide" method="post" enctype="multipart/form-data"><div class="modal-content">' +
        '      <h4>Add slide</h4>' +
        '      <div class="row">' +
        '        <div class="input-field col s12">' +
        '          <input id="title" type="text" class="validate" required name="title">' +
        '          <label for="title">Title</label>' +
        '        </div>' +
        '      </div>' +
        '       <div class="row">' +
        '        <div class="input-field col s12">' +
        '          <input id="description" type="text" class="validate" name="description">' +
        '          <label for="description">Description</label>' +
        '        </div>' +
        '      </div>' +
        '      <div class="file-field input-field">' +
        '      <div class="btn">' +
        '        <span>File</span>' +
        '        <input type="file" required name="file">' +
        '      </div>' +
        '      <div class="file-path-wrapper">' +
        '        <input class="file-path validate" type="text" placeholder="Upload one file" name="file-text">' +
        '      </div>' +
        '    </div>' +
        '    <div class="row"><div class="col s12 img-show"></div></div> ' +
        '</div>' +
        '    <div class="modal-footer">' +
        '       <input type="hidden" name="edit">' +
        '      <button type="submit" class="btn waves-effect waves-green">Add</button>' +
        '    </div></form></div>');
    $('#page_blocks_' + blockNumber + '_sliders_modal').modal();


    // add slide
    $('li.add-slide button').on('click', function(){
        $('#page_blocks_' + blockNumber + '_sliders_modal').modal('open');
        $('#page_blocks_' + blockNumber + '_sliders_modal h4').text('Add slide');
        $('#page_blocks_' + blockNumber + '_sliders_modal .img-show').html('');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="title"]').val('');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="description"]').val('');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="fileText"]').val('');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="edit"]').val('');
        var file = $('#page_blocks_' + blockNumber + '_sliders_modal input[name="file"]');
        file.attr('required', true).replaceWith(file.val('').clone(true));
    });


    // form add slide with send data for register image in DB
    $('form[name="form-slide"]').submit(function( event ) {

        var formData = new FormData($(this)[0]);
        var title = $(this).find('input[name="title"]');
        var description = $(this).find('input[name="description"]');
        var file = $(this).find('input[name="file"]');
        var fileText = $(this).find('input[name="file-text"]');
        var edit = $(this).find('input[name="edit"]');

        // add/update file
        if(file.val().length > 2) {
            $.ajax({
                url: '/admin/file/api/create',
                type: "POST",
                dataType: "json",
                data: formData,
                async: true,
                success: function (res) {
                    if(edit.val()) {
                        var slide = $('#page_blocks_' + blockNumber + '_sliders ul li[data-slide="' + edit.val() + '"]');
                        slide.data('title', title.val());
                        slide.data('description', description.val());
                        slide.data('imgId', res.id);
                        slide.data('imgPath', res.path);
                        $('#page_blocks_' + blockNumber + '_sliders ul li[data-slide="' + edit.val() + '"] b').text(title.val());
                        $('#page_blocks_' + blockNumber + '_sliders ul li[data-slide="' + edit.val() + '"] img').attr('src', '/' + res.path);
                    } else {
                        $('#page_blocks_' + blockNumber + '_sliders ul li.add-slide').before('<li data-slide="' + (countSlide + 1) + '" data-img-id="' + res.id +'" data-title="' + title.val() +'" data-description="' + description.val() +'" data-img-path="' + res.path +'" class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + title.val() + '</b><img src="/' + res.path + '" width="98px" height="98px"></li>');
                        editSlide(blockNumber);
                    }

                    // Create JSON value in input block_value
                    appendValueBySliders(blockNumber, textarea);

                    $('#page_blocks_' + blockNumber + '_sliders_modal').modal('close');

                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            var slide = $('#page_blocks_' + blockNumber + '_sliders ul li[data-slide="' + edit.val() + '"]');
            slide.data('title', title.val());
            slide.data('description', description.val());
            $('#page_blocks_' + blockNumber + '_sliders ul li[data-slide="' + edit.val() + '"] b').text(title.val());

            // Create JSON value in input block_value
            appendValueBySliders(blockNumber, textarea);

            $('#page_blocks_' + blockNumber + '_sliders_modal').modal('close');

        }

        event.preventDefault();

    });
};

/**
 * Edit slide on click
 * @param blockNumber
 */
const editSlide = function(blockNumber) {
    $('li.slide').on('click', function(){
        var data = $(this).data();
        $('#page_blocks_' + blockNumber + '_sliders_modal').modal('open');
        $('#page_blocks_' + blockNumber + '_sliders_modal h4').text('Edit slide');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="title"]').val(data.title);
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="description"]').val(data.description);
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="edit"]').val(data.slide);
        $('#page_blocks_' + blockNumber + '_sliders_modal .img-show').append('<img src="/' + data.imgPath + '" style="max-width: 100%">');
        $('#page_blocks_' + blockNumber + '_sliders_modal input[name="file"]').attr('required', false);
        M.updateTextFields();
    });
};

/**
 * Create JSON value in input block_value sliders
 *
 * @param blockNumber
 * @param textarea
 */
const appendValueBySliders = function (blockNumber, textarea) {
    textarea = textarea.find('textarea');
    var contentObject = {'sliders': []};

    let lis = $('#page_blocks_' + blockNumber + '_sliders .slide');

    lis.each(function(i) {
        var li = $(lis[i]);
        contentObject.sliders.push({'title': li.data('title'), 'description': li.data('description'), 'image': {'id': li.data('imgId')}});
    });

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};

/**
 * Destroy the type block Slider
 *
 * @param blockNumber
 * @param textarea
 */
const destroySlider = function(blockNumber, textarea) {
    $('#page_blocks_' + blockNumber + '_sliders').remove();
    textarea.show().find('textarea').show();
};