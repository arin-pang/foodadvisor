import React from 'react';
import PropTypes from 'prop-types';
import { Editor as Tinymce } from '@tinymce/tinymce-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const Editor = ({ onChange, name, value }) => {
  return (
    <>
      <Wrapper>
        <Tinymce
          tinymceScriptSrc={strapi.backendURL + '/tinymce/js/tinymce/tinymce.min.js'}
          value={value}
          init={{
            height: 500,
            menubar: false,
            convert_urls: false,
            relative_urls : true,
            remove_script_host : true,
            toolbar_mode: 'wrap',
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks codemirror fullscreen',
              'insertdatetime media table paste help wordcount',
              'media codesample fullscreen fullpage',
              'hr visualchars imagetools emoticons'
            ],
            toolbar:
              'undo redo | formatselect forecolor backcolor | \
              bold italic underline strikethrough removeformat | \
              alignleft aligncenter alignright alignjustify | \
              outdent indent | numlist bullist | \
              table link anchor | image media codesample charmap emoticons | \
              fullscreen code',
              codemirror: {
                indentOnInit: true, // Whether or not to indent code on init.
                fullscreen: false,   // Default setting is false
                path: 'codemirror-4.8', // Path to CodeMirror distribution
                config: {           // CodeMirror config object
                   mode: 'mustache',
                   lineNumbers: true
                },
                width: 800,         // Default value is 800
                height: 600,        // Default value is 550
                saveCursorPosition: true,    // Insert caret marker
                jsFiles: [          // Additional JS files to load
                  //  'mode/clike/clike.js',
                  //  'mode/php/php.js',
                   'mode/xml/xml.js',
                   'mode/custom-overlay/overlay.js'
                ]
              }            
          }}
          onEditorChange={(content, editor) => {
            onChange({ target: { name, value: content } });
          }}
        />

      </Wrapper>
    </>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Editor;
