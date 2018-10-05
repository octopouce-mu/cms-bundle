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
        changeBlock(counter - 1);
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
      const blockNumber = $(this).children('div').children('div').attr('id').replace('page_blocks_', '');
      initBlock(blockNumber);
      changeBlock(blockNumber);
  })
};

const changeBlock = function(number) {
    var id = $('#page_blocks_'+number+'_block').val();
    $('#page_blocks_'+number+'_block').on('change', function () {
        if(id != $(this).val()){
            id = $('#page_blocks_'+number+'_block').val();
            $('#page_blocks_'+number+'_value').text('');
            initBlock(number);
        }
    });
};


const initBlock = function(blockNumber) {
    const blockType = parseInt($('#page_blocks_' + blockNumber + '_block').val(), 0);
    const textarea = $('#page_blocks_' + blockNumber + ' .textarea');

    switch (blockType) {
        case 4:
            sliderBlock(blockNumber, textarea);
            break;
        case 3:
            tabsBlock(blockNumber, textarea);
            break;
        case 2:
            wysiwygBlock(blockNumber, textarea);
            break;
        default:
            textBlock(blockNumber, textarea);
    }
};

/**
 * Set type block on Slider
 *
 * @param blockNumber
 * @param textarea
 */
const sliderBlock = function(blockNumber, textarea) {
    destroyWysiwyg(blockNumber, textarea);
    destroyTabs(blockNumber, textarea);

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
 * Create JSON value in input block_value
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
 * Set type block on Text
 *
 * @param blockNumber
 * @param textarea
 */
const textBlock = function(blockNumber, textarea) {
    destroyWysiwyg(blockNumber, textarea);
    destroyTabs(blockNumber, textarea);
    destroySlider(blockNumber, textarea);
};

/**
 * Set type block on Wysiwyg
 *
 * @param blockNumber
 * @param textarea
 */
const wysiwygBlock = function(blockNumber, textarea) {
    destroyTabs(blockNumber, textarea);
    destroySlider(blockNumber, textarea);

    ClassicEditor.create(document.querySelector('#page_blocks_' + blockNumber + '_value'));

};

/**
 * Set type block on Tabs
 *
 * @param blockNumber
 * @param textarea
 */
const tabsBlock = function(blockNumber, textarea) {

    // init block
    destroyWysiwyg(blockNumber, textarea);
    destroySlider(blockNumber, textarea);
    textarea.hide();


    // if data exist in database, set tabs, else init tabs
    if($('#page_blocks_'+blockNumber+'_value').text().length > 0) {
        var contentObject = $.parseJSON($('#page_blocks_'+blockNumber+'_value').val());
        textarea.after('<div id="page_blocks_' + blockNumber + '_tabs"><button type="button" class="btn waves-effect waves-light" id="add-tab-' + blockNumber +'">Add tab <i class="fas fa-plus"></i></button><ul class="tabs transparent"></ul></div>');

        contentObject.tabs.forEach(function(e, i){
            var number = i + 1;
            var liClass = '';
            if(i === 0) {
                liClass = 'active'
            }
            var title = e.title ? e.title : '';
            var content = e.content ? e.content : '';

            $('#page_blocks_' + blockNumber + '_tabs ul').append('<li class="tab col s2"><a class="'+liClass+'" href="#page_blocks_'+blockNumber+'_tab_'+number+'"><input type="text" placeholder="Tab'+number+'" value="'+title+'"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a></li>');
            $('#page_blocks_' + blockNumber + '_tabs').append('<div id="page_blocks_'+blockNumber+'_tab_'+number+'" class="col s12 input-field tab-content"><textarea class="materialize-textarea">'+content+'</textarea></div>');

            ClassicEditor.create( document.querySelector('#page_blocks_' + blockNumber + '_tab_'+number+' textarea') )
                .then(e => {
                    e.model.document.on( 'change:data', () => {
                        appendValueByTabs(blockNumber, textarea);
                    } );
                });
        });

    } else {
        textarea.after('<div id="page_blocks_' + blockNumber + '_tabs"><button type="button" class="btn waves-effect waves-light" id="add-tab-' + blockNumber +'">Add tab <i class="fas fa-plus"></i></button><ul class="tabs transparent">' +
            '        <li class="tab col s2"><a class="active" href="#page_blocks_'+blockNumber+'_tab_1"><input type="text" placeholder="Tab1"><button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a></li>' +
            '      </ul>' +
            '    <div id="page_blocks_'+blockNumber+'_tab_1" class="col s12 input-field tab-content"><textarea class="materialize-textarea"></textarea></div>' +
            '  </div>');

        // transform textarea to wysiwyg
        ClassicEditor.create( document.querySelector('#page_blocks_' + blockNumber + '_tabs textarea') )
            .then(e => {
                e.model.document.on( 'change:data', () => {
                    appendValueByTabs(blockNumber, textarea);
                } );
            });
    }

    // create tabs Materialize.css
    $('.tabs').tabs();

    // remove tab
    removeTab(blockNumber, textarea);

    // load button add tab
    addTab(blockNumber, textarea);

    // create JSON when a title tab change
    $('#page_blocks_' + blockNumber + '_tabs input').change(function () {
        appendValueByTabs(blockNumber, textarea);
    });
};

/**
 * Add one tab in tabs block
 * @param blockNumber
 * @param textarea
 */
const addTab = function(blockNumber, textarea) {
    let pageBlock = $('#page_blocks_' + blockNumber + '_tabs');

    let countTab = pageBlock.find('.tab').length;

    $('#add-tab-' + blockNumber).on('click', function () {

        countTab++;

        // add li in ul
        pageBlock.find('ul').append('<li class="tab col s2">' +
            '<a href="#page_blocks_'+blockNumber+'_tab_'+countTab+'">' +
            '<input type="text" placeholder="Tab'+countTab+'">' +
            '<button type="button" class="btn-remove"><i class="fas fa-times"></i></button></a>' +
            '</li>');

        // add content in tab
        pageBlock.append('<div id="page_blocks_'+blockNumber+'_tab_'+countTab+'" class="col s12 input-field tab-content"><textarea class="materialize-textarea tab-area"></textarea></div>');

        // transform textarea to wysiwyg
        ClassicEditor.create(document.querySelector('#page_blocks_'+blockNumber+'_tab_'+countTab+' textarea'))
            .then(e => {
                e.model.document.on( 'change:data', () => {
                    appendValueByTabs(blockNumber, textarea);
                } );
            });

        // create tabs Materialize.css
        $('.tabs').tabs();

        // remove tab
        removeTab(blockNumber, textarea);
    })
};

/**
 * Remove tab in tabs block
 *
 * @param blockNumber
 * @param textarea
 */
const removeTab = function(blockNumber, textarea) {
    $('#page_blocks_'+blockNumber+'_tabs li .btn-remove').on('click', function() {

        var content = $($(this).parent('a').attr('href'));
        var li = $(this).parent().parent();

        content.remove();
        li.remove();

        appendValueByTabs(blockNumber, textarea);

    });
};

/**
 * Create JSON value in input block_value
 *
 * @param blockNumber
 * @param textarea
 */
const appendValueByTabs = function (blockNumber, textarea) {
    textarea = textarea.find('textarea');

    var contentObject = {'tabs': []};

    let lis = $('#page_blocks_' + blockNumber + '_tabs .tab');
    let contents = $('#page_blocks_' + blockNumber + '_tabs').find('.tab-content');

    lis.each(function(i) {
        var title = $(this).find('input').val();
        var content = $(contents[i]).find('.ck-content').html();
        contentObject.tabs.push({'title': title, 'content': content});
    });

    $(textarea).html(JSON.stringify(contentObject));
    isChanged = true;

};

/**
 * Destroy the type block Wysiwyg
 *
 * @param blockNumber
 * @param textarea
 */
const destroyWysiwyg = function(blockNumber, textarea) {
    $('#page_blocks_' + blockNumber + ' .ck').remove();
    textarea.find('textarea').show();
};

/**
 * Destroy the type block Tabs
 *
 * @param blockNumber
 * @param textarea
 */
const destroyTabs = function(blockNumber, textarea) {
    $('#page_blocks_' + blockNumber + '_tabs').remove();
    textarea.show().find('textarea').show();
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