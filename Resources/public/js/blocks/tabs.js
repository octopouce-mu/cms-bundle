
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
    destroyImageText(blockNumber, textarea);

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
 * Destroy the type block Tabs
 *
 * @param blockNumber
 * @param textarea
 */
const destroyTabs = function(blockNumber, textarea) {
    $('#page_blocks_' + blockNumber + '_tabs').remove();
    textarea.show().find('textarea').show();
};