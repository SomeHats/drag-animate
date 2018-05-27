// @flow
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './components/App';
import Scene from './models/document/Scene';
import Editor from './models/editor/Editor';

const root = document.getElementById('root');
invariant(root, 'root must exist');

const editor = Editor.fromAutoSave(() => new Scene().init(200, 100));
editor.startAutosaving();
window.editor = editor;

ReactDOM.render(
  <Fragment>
    <CssBaseline />
    <App editor={editor} />
  </Fragment>,
  root
);
