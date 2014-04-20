<?php

/**
 * @file
 * Tokens
 */

/**
 * Implements hook_token_info().
 */
function biblio_token_info() {

  $info = array();

  $info['types']['biblio'] = array(
    'name' => t('Bibliography links'),
    'description' => t('Tokens related to Bibliography.'),
    'needs-data' => 'node_type',
  );
  $info['tokens']['biblio']['url'] = array(
    'name' => t('Node url'),
    'description' => t('Path to current node.'),
    'dynamic' => TRUE,
  );
  $info['tokens']['biblio']['footnote-id'] = array(
    'name' => t('Footnote id'),
    'description' => t('Current footnote number.'),
  );
  $info['tokens']['biblio']['footnote-id']['tid'] = array(
    'name' => t('Term ID'),
    'description' => t('The ID of a specific term.'),
    'dynamic' => TRUE,
  );
  return $info;
}

/**
 * Implements hook_tokens().
 */
function biblio_tokens($type, $tokens, $data = array(), $options = array()) {

  $replacements = array();

  $node = $data['node'];
  $sanitize = !empty($options['sanitize']);
  if ($type == 'biblio') {
    foreach ($tokens as $name => $original) {
      //Replace current footnote ID
      if (preg_match("/^footnote-id:(\d+)$/", $name, $matches) && isset($matches[1])) {
        $original_tid = $matches[1];
        if (!$term = taxonomy_term_load($original_tid)) {
          $replacements[$original] = '';
        }
        else {
          $footnote_data = biblio_get_node_footnotes($node);
          if (!empty($footnote_data)) {
            foreach ($footnote_data as $tid => $footnote_element) {
              if ($original_tid == $tid) {
                $replacements[$original] = $footnote_element['footnote_id'];
              }
            }
          }
        }
      }
      //Replace current node url tokens
      if (preg_match("/^url:?(\d+)?$/", $name, $matches)) {
        $path = _biblio_create_bibliography_path($node);
        if (isset($matches[1])) {
          $path .= '#' . $matches[1];
        }
        $replacements[$original] = $path;
      }
    }
  }

  dpm($replacements);
  return isset($replacements) ? $replacements : NULL;
}

