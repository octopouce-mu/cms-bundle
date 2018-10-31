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
    destroyImageText(blockNumber, textarea);
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
    destroyImageText(blockNumber, textarea);

    ClassicEditor.create(document.querySelector('#page_blocks_' + blockNumber + '_value'));

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
