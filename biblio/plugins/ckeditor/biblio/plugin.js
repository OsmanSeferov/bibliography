/**
 * Biblio plugin for easily creating footnotes into CKEditor editing area.
 */

(function($) {

    // Register the plugin within the editor.
    CKEDITOR.plugins.add( 'biblio', {
        // The plugin initialization logic goes inside this method.
        init: function( editor ) {
            // Define an editor command that opens our dialog.
            editor.addCommand( 'biblio', new CKEDITOR.dialogCommand( 'biblio_dialog' ) );
            // Create a toolbar button that executes the above command.
            editor.ui.addButton( 'Biblio', {
                label: Drupal.t('Footnote'),
                command: 'biblio',
                icon: this.path + 'icons/biblio.gif'
            });
            
            // Register our dialog file. this.path is the plugin folder path.
            CKEDITOR.dialog.add( 'biblio_dialog', this.path + 'dialogs/biblio.js' );
        }
    });


})(jQuery);





