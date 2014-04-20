<?php

/**
 * @file
 *
 * CCT plugin file.
 */
$plugin = array(
  'title' => t('Bibliography Block'),
  'description' => t('Bibliography Block'),
  'content_types' => 'biblio_panel',
  'single' => TRUE,
  'render callback' => 'biblio_panel_content_type_render',
  'edit form' => 'biblio_panel_content_type_edit_form',
  'category' => t('Bibliography'),
  'icon' => 'no-icon.png',
);

/**
 * Render callback.
 */
function biblio_panel_content_type_render($subtype, $conf, $panel_args, $context) {
  $block = new stdClass();
  $block->title = NULL;
  //Getting  footnotes per article
  $data = biblio_get_node_footnotes($panel_args[0]);

  $block->content = theme('biblio_panel', array('footnotes' => $data, 'conf' => $conf));
  return $block;
}

/**
 * Returns an edit form for the custom type.
 *
 * This is required to get access to the context.
 */
function biblio_panel_content_type_edit_form($form, &$form_state) {
  $conf = $form_state['conf'];
  $form['conf'] = array(
    '#tree' => TRUE,
  );
  return $form;
}

/**
 * Presubmit handler.
 *
 * This is required to get access to the context.
 */
function biblio_panel_content_type_edit_form_submit(&$form, &$form_state) {
  $form_state['conf'] = $form_state['values']['conf'];
}