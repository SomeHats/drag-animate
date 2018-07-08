// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './components/App';
import Scene from './document/Scene';
import Editor from './editor/Editor';
import keyboard from './editor/keyboard';

keyboard.setup();

const root = document.getElementById('root');
invariant(root, 'root must exist');

const editor = Editor.fromAutoSave(() => new Scene().init(200, 100));
editor.startAutosaving();
window.editor = editor;

ReactDOM.render(
  <>
    <CssBaseline />
    <App editor={editor} />
  </>,
  root
);
