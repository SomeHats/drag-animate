// @flow

const EditorTools: {|
  SELECT: 'SELECT',
  PEN: 'PEN',
  KEY_POINT: 'KEY_POINT',
|} = {
  SELECT: 'SELECT',
  PEN: 'PEN',
  KEY_POINT: 'KEY_POINT',
};

export type EditorTool = $Values<typeof EditorTools>;

export default EditorTools;
