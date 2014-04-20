/**
 * $Id$
 * Override the built-in autocomplete search
 */
Drupal.behaviors.biblio_ac_post = {
  attach: function (context, settings) {
    if (typeof Drupal.ACDB != 'undefined') {
      Drupal.ACDB.prototype.search = function (searchString) {
        var db = this;
        this.searchString = searchString;

        // See if this string needs to be searched for anyway.
        searchString = searchString.replace(/^\s+|\s+$/, '');
        if (searchString.length <= 0 ||
          searchString.charAt(searchString.length - 1) == ',') {
          return;
        }

        // See if this key has been searched for before.
        if (this.cache[searchString]) {
          return this.owner.found(this.cache[searchString]);
        }

        // Initiate delayed search.
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(function () {
          db.owner.setStatus('begin');
          if (db.uri == Drupal.settings.biblio.autocomplete_path) {
            var type  ='POST';
            var url = db.uri;
            var data = {search: searchString};
          }
          else {
            var type  ='GET';
            var url = db.uri + '/' + Drupal.encodePath(searchString);
            var data = '';
          }

          // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
          // encodeURIComponent to allow autocomplete search terms to contain slashes.
          jQuery.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (matches) {
              if (typeof matches.status == 'undefined' || matches.status != 0) {
                db.cache[searchString] = matches;
                // Verify if these are still the matches the user wants to see.
                if (db.searchString == searchString) {
                  db.owner.found(matches);
                }
                db.owner.setStatus('found');
              }
            },
            error: function (xmlhttp) {
              alert(Drupal.ajaxError(xmlhttp, db.uri));
            }
          });
        }, this.delay);
      }; // search
    } // 
  } // attach
}