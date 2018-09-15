import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { assertExists } from './util';
import App from './components/App';
import Scene from './document/Scene';
import Editor from './editor/Editor';
import keyboard from './editor/keyboard';

keyboard.setup();

const root = assertExists(document.getElementById('root'));

const editor = Editor.fromAutoSave(() => new Scene().init(200, 100));
editor.startAutosaving();
(window as any).editor = editor;

ReactDOM.render(
  <>
    <CssBaseline />
    <App editor={editor} />
  </>,
  root,
);
