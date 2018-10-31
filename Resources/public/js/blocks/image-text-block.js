const imageTextBlock = function(blockNumber, textarea) {
    // init block
    destroyWysiwyg(blockNumber, textarea);
    destroyTabs(blockNumber, textarea);
    destroySlider(blockNumber, textarea);
    textarea.hide();

    textarea.after('<div id="page_blocks_' + blockNumber + '_imageText">' +
        '<div class="row"><div class="input-field col s12"><input type="text" name="titre"><label for="">Titre</label></div></div>' +
        '<div class="row"><div class="input-field col s12"><textarea class="materialize-textarea" name="description"></textarea><label for="">Description</label></div></div>' +
        '<div class="row"><div class="col s12"><button class="btn add-img" type="button">Ajouter une image</button></div></div></div>' +
        '</div>');

    // create modal
    $('.main').append('<div id="page_blocks_' + blockNumber + '_imageText_modal" class="modal modal-fixed-footer imageText-modal">' +
        '<form class="form-imageText" name="form-imageText" method="post" enctype="multipart/form-data"><div class="modal-content">' +
        '      <h4>Add image</h4>' +
        '      <div class="row">' +
        '        <div class="input-field col s12">' +
        '          <input id="title" type="text" class="validate" required name="title">' +
        '          <label for="title">Title</label>' +
        '        </div>' +
        '      </div>' +
        '       <div class="row">' +
        '        <div class="input-field col s12">' +
        '          <input id="alt" type="text" class="validate" name="alt">' +
        '          <label for="alt">Alt</label>' +
        '        </div>' +
        '      </div>' +
        '      <div class="file-field input-field">' +
        '      <div class="btn">' +
        '        <span>Image</span>' +
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
    $('#page_blocks_' + blockNumber + '_imageText_modal').modal();


    // add slide
    $('button.add-img').on('click', function(){
        $('#page_blocks_' + blockNumber + '_imageText_modal').modal('open');
        $('#page_blocks_' + blockNumber + '_imageText_modal h4').text('Add image');
        $('#page_blocks_' + blockNumber + '_imageText_modal .img-show').html('');
        $('#page_blocks_' + blockNumber + '_imageText_modal input[name="title"]').val('');
        $('#page_blocks_' + blockNumber + '_imageText_modal input[name="description"]').val('');
        $('#page_blocks_' + blockNumber + '_imageText_modal input[name="fileText"]').val('');
        $('#page_blocks_' + blockNumber + '_imageText_modal input[name="edit"]').val('');
        var file = $('#page_blocks_' + blockNumber + '_imageText_modal input[name="file"]');
        file.attr('required', true).replaceWith(file.val('').clone(true));
    });


    // form add slide with send data for register image in DB
    $('form[name="form-imageText"]').submit(function( event ) {

        var formData = new FormData($(this)[0]);
        var title = $(this).find('input[name="title"]');
        var description = $(this).find('input[name="alt"]');
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
                        var image = $('#page_blocks_' + blockNumber + '_imageText img');
                        image.data('imgId', res.id);
                        image.data('imgPath', res.path);
                        image.attr('src', '/' + res.path);
                    } else {
                        $('#page_blocks_' + blockNumber + '_imageText .add-img').before('<img data-img-id="' + res.id +'" data-img-path="' + res.path +'">');
                        // editSlide(blockNumber);
                    }

                    // Create JSON value in input block_value
                    appendValueBySliders(blockNumber, textarea);

                    $('#page_blocks_' + blockNumber + '_imageText_modal').modal('close');

                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            var image = $('#page_blocks_' + blockNumber + '_imageText img');

            // Create JSON value in input block_value
            appendValueBySliders(blockNumber, textarea);

            $('#page_blocks_' + blockNumber + '_imageText_modal').modal('close');

        }

        event.preventDefault();

    });
};


/**
 * Create JSON value in input block_value image
 *
 * @param blockNumber
 * @param textarea
 */
const appendValueByImage = function (blockNumber, textarea) {
    textarea = textarea.find('textarea');
    var contentObject = {};

    let content = $('#page_blocks_' + blockNumber + '_imageText');
    var titre = $('#page_blocks_' + blockNumber + '_imageText input[name="titre"]').val();
    var description = $('#page_blocks_' + blockNumber + '_imageText input[name="description"]').val();
    var image = $('#page_blocks_' + blockNumber + '_imageText image');


    contentObject = {'title': titre, 'description': description, 'image': {'id': image.data('imgId')}};

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};


/**
 * Destroy the type block ImageText
 *
 * @param blockNumber
 * @param textarea
 */
const destroyImageText = function(blockNumber, textarea) {
    $('#page_blocks_' + blockNumber + '_imageText').remove();
    textarea.show().find('textarea').show();
};