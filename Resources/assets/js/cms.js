require('materialize-css');

// require jQuery normally
const $ = require('jquery');

let isChanged = false;

$(document).ready(function () {
    $('input#page_seoTitle, input#page_seoDescription, ' +
        'input#page_seoFacebookTitle, input#page_seoFacebookDescription, ' +
        'input#page_seoTwitterTitle, input#page_seoTwitterDescription')
        .characterCounter();

    eachBlock();
    removeBlock();

    $('.add-another-collection-widget').click(function (e) {
        let list = $($(this).attr('data-list'));
        let counter = list.data('widget-counter') | list.children().length;
        if (!counter) { counter = list.children().length; }

        let newWidget = list.attr('data-prototype');
        newWidget = newWidget.replace(/__name__/g, counter);
        counter++;
        list.data(' widget-counter', counter);

        let newElem = $(list.attr('data-widget-tags')).html('<div class="content"><button type="button" class="waves-effect waves-light btn-small remove-block red"><i class="fas fa-times"></i></button>' + newWidget + '</div>');
        newElem.appendTo(list);

        $('select').formSelect();

        removeBlock();
        eachBlock();

    });

    $('#page_submit').on('click', function() {
        isChanged = false;
    });

    $(window).bind('beforeunload', function(){
        if(isChanged) {
            return 'Are you sure you want to leave?';
        }
    });
});

const removeBlock = function() {
    $('.remove-block').on('click', function() {
        $(this).parent().parent().remove();
        isChanged = true;
    });
};

const eachBlock = function() {
  $('.block').each(function() {
      const blockNumber = $(this).children('div').children('div').attr('id');

      initBlock($(this));
      changeBlock($(this));
  })
};

const changeBlock = function(block) {
    var val = block.find('.select-block').val();
    block.find('.select-block').on('change', function () {
        if(val != $(this).val()){
            initBlock(block);
        }
    });
};


const initBlock = function(block) {
    const blockType = parseInt(block.find('.select-block').val(), 0);
    const textarea = block.find('.textarea');

    switch (blockType) {
        case 5:
            imageTextBlock(block, textarea);
            break;
        case 4:
            sliderBlock(block, textarea);
            break;
        case 3:
            tabsBlock(block, textarea);
            break;
        case 2:
            wysiwygBlock(block, textarea);
            break;
        default:
            textBlock(block, textarea);
    }
};

/**
 * Set type block on Slider
 *
 * @param block
 * @param textarea
 */
const sliderBlock = function(block, textarea) {
    destroyWysiwyg(block, textarea);
    destroyTabs(block, textarea);
    destroyImageText(block, textarea);

    // init block
    textarea.hide();
    textarea.after('<div class="block-sliders"><ul><li class="add-slide"><button type="button"><i class="fas fa-plus"></i></button></li></ul></div>');
    let countSlide = -1;

    const blockId = block.children('div').children('div').attr('id');

    // if data exist in database, set sliders, else init
    if(textarea.find('textarea').text().length > 0) {
        var contentObject = $.parseJSON(textarea.find('textarea').val());
        contentObject.sliders.forEach(function(e, i) {
            $.get( "/admin/file/api/" + e.image.id, function( img ) {
                countSlide++;
                var li = '<li data-slide="' + i + '" data-img-id="' + e.image.id +'" data-title="' + e.title +'" data-description="' + e.description +'" data-img-path="' + img.path +'" class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + e.title + '</b><img src="/' + img.path + '" width="98px" height="98px"></li>';
                block.find('.add-slide').before(li);
                editSlide(blockId);
                removeSlide(block, textarea);
            }).catch(function(){
                countSlide++;
                var li = '<li data-slide="' + i + '" data-img-id="' + e.image.id +'" data-title="' + e.title +'" data-description="' + e.description +'" data-img-path class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + e.title + '</b><img src="" width="98px" height="98px"></li>';
                block.find('.add-slide').before(li);
                editSlide(blockId);
                removeSlide(block, textarea);
            });
        });
    }

    // create modal
    $('.main').append('<div id="' + blockId + '_sliders_modal" class="modal modal-fixed-footer sliders-modal">' +
        '<form class="form-slide" name="'+blockId+'_form" method="post" enctype="multipart/form-data"><div class="modal-content">' +
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
    $('#' + blockId + '_sliders_modal').modal();


    // add slide
    $('li.add-slide button').on('click', function(){
        $('#' + blockId + '_sliders_modal').modal('open');
        $('#' + blockId + '_sliders_modal h4').text('Add slide');
        $('#' + blockId + '_sliders_modal .img-show').html('');
        $('#' + blockId + '_sliders_modal input[name="title"]').val('');
        $('#' + blockId + '_sliders_modal input[name="description"]').val('');
        $('#' + blockId + '_sliders_modal input[name="fileText"]').val('');
        $('#' + blockId + '_sliders_modal input[name="edit"]').val('');
        var file = $('#' + blockId + '_sliders_modal input[name="file"]');
        file.attr('required', true).replaceWith(file.val('').clone(true));
    });


    // form add slide with send data for register image in DB
    $('form[name="'+blockId+'_form"]').submit(function( event ) {

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
                        var slide = block.find('.block-sliders ul li[data-slide="' + edit.val() + '"]');
                        slide.data('title', title.val());
                        slide.data('description', description.val());
                        slide.data('imgId', res.id);
                        slide.data('imgPath', res.path);
                        slide.find('b').text(title.val());
                        slide.find('img').attr('src', '/' + res.path);
                    } else {
                        block.find('.add-slide').before('<li data-slide="' + (countSlide + 1) + '" data-img-id="' + res.id +'" data-title="' + title.val() +'" data-description="' + description.val() +'" data-img-path="' + res.path +'" class="slide"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button><b>' + title.val() + '</b><img src="/' + res.path + '" width="98px" height="98px"></li>');
                        editSlide(blockId);
                    }

                    // Create JSON value in input block_value
                    appendValueBySliders(block, textarea);

                    removeSlide(block, textarea);

                    $('#' + blockId + '_sliders_modal').modal('close');

                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            var slide = block.find('.block-sliders ul li[data-slide="' + edit.val() + '"]');
            slide.data('title', title.val());
            slide.data('description', description.val());
            slide.find('b').text(title.val());

            // Create JSON value in input block_value
            appendValueBySliders(block, textarea);

            removeSlide(block, textarea);

            $('#' + blockId + '_sliders_modal').modal('close');

        }

        event.preventDefault();

    });
};

/**
 * Edit slide on click
 * @param blockId
 */
const editSlide = function(blockId) {
    $('li.slide').on('click', function(){
        console.log('test');
        var data = $(this).data();
        $('#' + blockId + '_sliders_modal').modal('open');
        $('#' + blockId + '_sliders_modal h4').text('Edit slide');
        $('#' + blockId + '_sliders_modal input[name="title"]').val(data.title);
        $('#' + blockId + '_sliders_modal input[name="description"]').val(data.description);
        $('#' + blockId + '_sliders_modal input[name="edit"]').val(data.slide);
        $('#' + blockId + '_sliders_modal .img-show').html('<img src="/' + data.imgPath + '" style="max-width: 100%">');
        $('#' + blockId + '_sliders_modal input[name="file"]').attr('required', false);
        M.updateTextFields();
    });
};

/**
 * Remove slide on click
 * @param block
 * @param textarea
 */
const removeSlide = function(block, textarea) {
    block.find('.block-sliders .btn-remove').on('click', function() {

        $(this).parent().remove();

        // Create JSON value in input block_value
        appendValueBySliders(block, textarea);

    });
};

/**
 * Create JSON value in input block_value sliders
 *
 * @param block
 * @param textarea
 */
const appendValueBySliders = function (block, textarea) {
    textarea = textarea.find('textarea');
    var contentObject = {'sliders': []};



    let lis = block.find('.slide');

    block.find('.slide').each(function(i) {
        var li = $(lis[i]);
        contentObject.sliders.push({'title': li.data('title'), 'description': li.data('description'), 'image': {'id': li.data('imgId')}});
    });

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};

/**
 * Set type block on Text
 *
 * @param block
 * @param textarea
 */
const textBlock = function(block, textarea) {
    destroyWysiwyg(block, textarea);
    destroyTabs(block, textarea);
    destroySlider(block, textarea);
    destroyImageText(block, textarea);
};

/**
 * Set type block on Wysiwyg
 *
 * @param block
 * @param textarea
 */
const wysiwygBlock = function(block, textarea) {
    destroyTabs(block, textarea);
    destroySlider(block, textarea);
    destroyImageText(block, textarea);

    const blockId = block.children('div').children('div').attr('id');

    ClassicEditor.create(document.querySelector('#' + blockId + '_value'));

};

/**
 * Set type block on Tabs
 *
 * @param block
 * @param textarea
 */
const tabsBlock = function(block, textarea) {

    // init block
    destroyWysiwyg(block, textarea);
    destroySlider(block, textarea);
    destroyImageText(block, textarea);

    textarea.hide();

    const blockId = block.children('div').children('div').attr('id');


    // if data exist in database, set tabs, else init tabs
    if(textarea.find('textarea').text().length > 0) {
        var contentObject = $.parseJSON(textarea.find('textarea').val());
        textarea.after('<div class="block-tabs"><button type="button" class="btn waves-effect waves-light add-tab">Add tab <i class="fas fa-plus"></i></button><ul class="tabs transparent"></ul></div>');

        contentObject.tabs.forEach(function(e, i){
            var number = i + 1;
            var liClass = '';
            if(i === 0) {
                liClass = 'active'
            }
            var title = e.title ? e.title : '';
            var content = e.content ? e.content : '';

            block.find('ul').append('<li class="tab col s2"><a class="'+liClass+'" href="#'+blockId+'_tab_'+number+'"><input type="text" placeholder="Tab'+number+'" value="'+title+'"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a></li>');
            block.find('.block-tabs').append('<div id="'+blockId+'_tab_'+number+'" class="col s12 input-field tab-content"><textarea class="materialize-textarea">'+content+'</textarea></div>');

            ClassicEditor.create( document.querySelector('#' + blockId + '_tab_'+number+' textarea'), {
                toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo' ],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3' },
                        { model: 'heading4', view: 'h4', title: 'Heading 4' },
                        { model: 'heading5', view: 'h5', title: 'Heading 5' }
                    ]
                }
            } ).then(e => {
                    e.model.document.on( 'change:data', () => {
                        setTimeout(function() {
                            appendValueByTabs(block, textarea);
                        }, 100);
                    } );
                });
        });

    } else {
        textarea.after('<div class="block-tabs"><button type="button" class="btn waves-effect waves-light add-tab">Add tab <i class="fas fa-plus"></i></button><ul class="tabs transparent">' +
            '        <li class="tab col s2"><a class="active" href="#'+blockId+'_tab_1"><input type="text" placeholder="Tab1"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a></li>' +
            '      </ul>' +
            '    <div id="'+blockId+'_tab_1" class="col s12 input-field tab-content"><textarea class="materialize-textarea"></textarea></div>' +
            '  </div>');

        // transform textarea to wysiwyg
        ClassicEditor.create( document.querySelector('#' + blockId + '_tab_1 textarea'), {
            toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo' ],
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5' }
                ]
            }
        } ).then(e => {
                e.model.document.on( 'change:data', () => {
                    setTimeout(function() {
                        appendValueByTabs(block, textarea);
                    }, 100);
                } );
            });
    }

    // create tabs Materialize.css
    $('.tabs').tabs();

    // remove tab
    removeTab(block, textarea);

    // load button add tab
    addTab(block, textarea);

    // create JSON when a title tab change
    block.find('input').change(function () {
        appendValueByTabs(block, textarea);
    });
};

/**
 * Add one tab in tabs block
 * @param block
 * @param textarea
 */
const addTab = function(block, textarea) {
    let pageBlock = block.find('.block-tabs');

    let countTab = pageBlock.find('.tab').length;
    const blockId = block.children('div').children('div').attr('id');


    pageBlock.find('.add-tab').on('click', function () {

        countTab++;

        // add li in ul
        pageBlock.find('ul').append('<li class="tab col s2">' +
            '<a href="#'+blockId+'_tab_'+countTab+'">' +
            '<input type="text" placeholder="Tab'+countTab+'">' +
            '<button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a>' +
            '</li>');

        // add content in tab
        pageBlock.append('<div id="'+blockId+'_tab_'+countTab+'" class="col s12 input-field tab-content"><textarea class="materialize-textarea tab-area"></textarea></div>');

        // transform textarea to wysiwyg
        ClassicEditor.create(document.querySelector('#'+blockId+'_tab_'+countTab+' textarea'), {
            toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo' ],
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5' }
                ]
            }
        }).then(e => {
                e.model.document.on( 'change:data', () => {
                    setTimeout(function() {
                        appendValueByTabs(block, textarea);
                    }, 100);
                } );
            });

        // create tabs Materialize.css
        $('.tabs').tabs();

        // remove tab
        removeTab(block, textarea);
    })
};

/**
 * Remove tab in tabs block
 *
 * @param block
 * @param textarea
 */
const removeTab = function(block, textarea) {
    block.find('.block-tabs .btn-remove').on('click', function() {

        var content = $($(this).parent('a').attr('href'));
        var li = $(this).parent().parent();

        content.remove();
        li.remove();

        appendValueByTabs(block, textarea);

    });
};

/**
 * Create JSON value in input block_value
 *
 * @param block
 * @param textarea
 */
const appendValueByTabs = function (block, textarea) {
    textarea = textarea.find('textarea');

    var contentObject = {'tabs': []};

    let lis = block.find('.tab');
    let contents = block.find('.tab-content');

    lis.each(function(i) {
        var title = $(this).find('input').val();
        var content = $(contents[i]).find('.ck-content').html();
        contentObject.tabs.push({'title': title, 'content': content});
    });

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};

const imageTextBlock = function(block, textarea) {
    // init block
    destroyWysiwyg(block, textarea);
    destroyTabs(block, textarea);
    destroySlider(block, textarea);
    textarea.hide();

    const blockId = block.children('div').children('div').attr('id');

    textarea.after('<div class="block-image-text">' +
        '<div class="row"><div class="input-field col s12"><input type="text" name="titre"><label for="titre">Titre</label></div></div>' +
        '<div class="row"><div class="input-field col s12"><label for="description">Description</label><textarea class="materialize-textarea" name="description" id="'+blockId+'_textarea"></textarea></div></div>' +
        '<div class="row"><div class="col s12 add-img"><button class="btn" type="button">Ajouter une image</button></div></div></div>' +
    '</div>');

    // create modal
    $('.main').append('<div id="' + blockId + '_image-text_modal" class="modal modal-fixed-footer image-text-modal">' +
        '<form class="form-image-text" name="' + blockId + '_form-image-text" method="post" enctype="multipart/form-data"><div class="modal-content">' +
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
    $('#' + blockId + '_image-text_modal').modal();

    if(textarea.find('textarea').text().length > 0) {
        var contentObject = $.parseJSON(textarea.find('textarea').val());
        block.find('.add-img').html('<div class="preloader-wrapper small active">\n' +
            '      <div class="spinner-layer spinner-blue">\n' +
            '        <div class="circle-clipper left">\n' +
            '          <div class="circle"></div>\n' +
            '        </div><div class="gap-patch">\n' +
            '          <div class="circle"></div>\n' +
            '        </div><div class="circle-clipper right">\n' +
            '          <div class="circle"></div>\n' +
            '        </div>\n' +
            '      </div></div>');

        $.get( "/admin/file/api/" + contentObject.image.id, function( img ) {
            block.find('.add-img').append('<img data-img-title="'+ img.title +'" data-img-alt="'+ img.alt +'" data-img-id="' + img.id +'" data-img-path="' + img.path +'" src="/' + img.path +'" width="300">');
            block.find('.add-img btn').remove();
            block.find('.preloader-wrapper').remove();
            editImageText(block);
        }).catch(function(){
            block.find('.add-img').append('<img data-img-id="' + img.id +'" data-img-path="' + img.path +'" src="">');
            block.find('.add-img btn').remove();
            block.find('.preloader-wrapper').remove();
            editImageText(block);
        });
    }

    ClassicEditor.create( document.querySelector('#' + blockId + '_textarea'), {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'numberedList', '|', 'undo', 'redo' ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph' },
                { model: 'heading2', view: 'h2', title: 'Heading 2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5' }
            ]
        }
    } )
        .then(e => {
            e.model.document.on( 'change:data', () => {
                setTimeout(function() {
                    appendValueByImageText(block, textarea);
                }, 100);
            } );
        });


    // add image
    block.find('.add-img btn').on('click', function(){
        $('#' + blockId + '_image-text_modal').modal('open');
        $('#' + blockId + '_image-text_modal h4').text('Add image');
        $('#' + blockId + '_image-text_modal .img-show').html('');
        $('#' + blockId + '_image-text_modal input[name="title"]').val('');
        $('#' + blockId + '_image-text_modal input[name="alt"]').val('');
        $('#' + blockId + '_image-text_modal input[name="fileText"]').val('');
        $('#' + blockId + '_image-text_modal input[name="edit"]').val('');
        var file = $('#' + blockId + '_image-text_modal input[name="file"]');
        file.attr('required', true).replaceWith(file.val('').clone(true));
    });


    // form add img with send data for register image in DB
    block.find('form[name="form-image-text"]').submit(function( event ) {

        var formData = new FormData($(this)[0]);
        var title = $(this).find('input[name="title"]');
        var alt = $(this).find('input[name="alt"]');
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
                        var image = block.find('img');
                         image.data('imgTitle', title.val());
                         image.data('imgAlt', alt.val());
                         image.data('imgId', res.id);
                        image.data('imgPath', res.path);
                        image.attr('src', '/' + res.path);
                         editImageText(block);
                     } else {
                         block.find('.add-img').append('<img data-img-title="'+ title +'" data-img-alt="'+ alt +'" data-img-id="' + res.id +'" data-img-path="' + res.path +'" src="/' + res.path +'" width="300">');
                         block.find('.add-img btn').remove();
                         editImageText(block);
                    }

                    // Create JSON value in input block_value
                    appendValueByImageText(block, textarea);

                    $('#' + blockId + '_image-text_modal').modal('close');

                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            // Create JSON value in input block_value
            appendValueByImageText(block, textarea);

            $('#' + blockId + '_image-text_modal').modal('close');

        }

        event.preventDefault();

    });
};


/**
 * Create JSON value in input block_value image
 *
 * @param block
 * @param textarea
 */
const appendValueByImageText = function (block, textarea) {
    textarea = textarea.find('textarea');

    var titre = block.find('input[name="titre"').val();
    var description = block.find('.ck-content').html();
    var image = block.find('img');


    var contentObject = {'title': titre, 'description': description, 'image': {'id': image.data('imgId')}};

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};

/**
 * Edit imageText on click
 * @param block
 */
const editImageText = function(block) {
    const blockId = block.children('div').children('div').attr('id');

    block.find('img').on('click', function(){
        var data = $(this).data();
        $('#' + blockId + '_image-text_modal').modal('open');
        $('#' + blockId + '_image-text_modal h4').text('Edit Image');
        $('#' + blockId + '_image-text_modal input[name="title"]').val(data.imgTitle);
        $('#' + blockId + '_image-text_modal input[name="alt"]').val(data.imgAlt);
        $('#' + blockId + '_image-text_modal input[name="edit"]').val(data.imgId);
        $('#' + blockId + '_image-text_modal .img-show').html('<img src="/' + data.imgPath + '" style="max-width: 100%">');
        $('#' + blockId + '_image-text_modal input[name="file"]').attr('required', false);
        M.updateTextFields();
    });
};

/**
 * Destroy the type block Wysiwyg
 *
 * @param block
 * @param textarea
 */
const destroyWysiwyg = function(block, textarea) {
    block.find('.ck').remove();
    textarea.find('textarea').show();
};

/**
 * Destroy the type block Tabs
 *
 * @param block
 * @param textarea
 */
const destroyTabs = function(block, textarea) {
    block.find('.block-tabs').remove();
    textarea.show().find('textarea').show();
};

/**
 * Destroy the type block Slider
 *
 * @param block
 * @param textarea
 */
const destroySlider = function(block, textarea) {
    block.find('.block-sliders').remove();
    textarea.show().find('textarea').show();
};

/**
 * Destroy the type block ImageText
 *
 * @param block
 * @param textarea
 */
const destroyImageText = function(block, textarea) {
    block.find('.block-image-text').remove();
    textarea.show().find('textarea').show();
};