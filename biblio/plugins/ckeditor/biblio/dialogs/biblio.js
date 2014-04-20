
/**
 * The biblio dialog definition.
 */
(function($) {
    var initAutocomplete = function(input, uri) {
        input.setAttribute('autocomplete', 'OFF');
        new Drupal.jsAC($(input), new Drupal.ACDB(uri));
    };
    
    function saveFootnote(editor, tid, selection) {
        var element = new CKEDITOR.dom.element('a');
        element.appendHtml(selection + '([biblio:footnote-id:' + tid + '])');
        element.data('biblio-tid', tid);
        element.addClass('footnote-wrapper');
        element.setAttribute('href', '[biblio:url:' + tid + ']');
        element.setAttribute('rel', 'nofollow');
        element.setAttribute('target', '_blank');
        editor.insertElement(element);
        editor.fire('saveSnapshot');
    }

    function getCleanSelection(selection) {
        //if selected text contains footnorte we need trim them
        var regex = /\(\[biblio:footnote-id:(\d+)\]\)/;
        match = regex.exec(selection);
        if (match != null) {
            selection = selection.replace(match[0], "");
        }
        return selection;
    }
    
    
    // Our dialog definition.
    CKEDITOR.dialog.add('biblio_dialog', function(editor)
    {
        var dialogDefinition =
        {
            title: Drupal.t('Write footnote here:'),
            minWidth: 390,
            minHeight: 150,
            contents:
            [
            {
                id: 'tab1',
                expand: true,
                padding: 0,
                elements:
                [
                {
                    type: 'html',
                    html: 'This dialog window lets you create footnote.'
                },
                {
                    type: 'textarea',
                    id: 'footnote',
                    rows: 4,
                    cols: 40,
                    onLoad: function() {
                        this.getInputElement().addClass('form-autocomplete');
                        initAutocomplete(this.getInputElement().$, Drupal.settings.biblio.autocomplete_path);
                    },
                    setup: function(data)
                    {
                        this.setValue(data);
                    },
                    commit: function(data)
                    {
                        data.footnote = this.getValue();
                    },
                    validate: function() {
                        var value = this.getValue();
                        var index = value.lastIndexOf('(');
                    }
                }
                ]
            }
            ],
            
            onOk: function()
            {
                var dialog = this,
                data = {};
                this.commitContent(data);
                var editor = this.getParentEditor();
                var selection = editor.getSelection().getSelectedText();
                var value = data['footnote'];

                selection = getCleanSelection(selection);

                if (selection.length) {
                    if (value) {
                        var matches = value.match(/tid:(\d+)/);
                        if (matches && !isNaN(matches[1]) && isFinite(matches[1])) {
                            var tid = matches[1];
                            if (tid) {
                                saveFootnote(editor, tid, selection);
                            }
                        }
                        else if (!tid) {
                            var text = data['footnote'];
                            $.ajax({
                                url: Drupal.settings.biblio.language + '/biblio/create_term',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    'text': text
                                },
                                'success': function(data) {
                                    if (data) {
                                        var tid = data;
                                        saveFootnote(editor, tid, selection);
                                    }
                                    else {
                                        alert(Drupal.t('Error!'));
                                    }
                                }
                            });
                        }
                    } else {
                        alert(Drupal.t("Footnote can not be empty"));
                    }
                } else {
                    alert(Drupal.t("Please select text from textarea"));
                }
            },
            
            onShow: function() {
                var dialog = this;
                var editor = this.getParentEditor();
                var selection = editor.getSelection(),
                element = selection.getStartElement();
                if (selection.getSelectedText().length > 0) {
                    element = element.getAscendant('a', true);
                    if (element) {
                        var tid = element.data('biblio-tid');
                        $.ajax({
                            url: Drupal.settings.biblio.language + '/biblio/get_term',
                            type: 'POST',
                            async: false,
                            dataType: 'json',
                            data: {
                                'tid': tid
                            },
                            'success': function(data) {
                                if (data) {
                                    dialog.setupContent(data);
                                }
                                else {
                                    alert(Drupal.t('Error!'));
                                }
                            }
                        });
                    }
                }
            }
        };
        return dialogDefinition;
    });

})(jQuery);