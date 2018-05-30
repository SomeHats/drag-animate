// @flow
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './components/App';
import Scene from './models/document/Scene';
import Editor from './models/editor/Editor';
import Viewport from './models/editor/Viewport';

const root = document.getElementById('root');
invariant(root, 'root must exist');

const editor = Editor.fromAutoSave(() => new Scene().init(200, 100));
editor.startAutosaving();
window.editor = editor;

const viewport = new Viewport(editor);
viewport.setup();
window.viewport = viewport;

ReactDOM.render(
  <Fragment>
    <CssBaseline />
    <App viewport={viewport} />
  </Fragment>,
  root
);
