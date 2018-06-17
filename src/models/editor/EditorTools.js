// @flow

const EditorTools: {|
  SELECT: 'SELECT',
  PEN: 'PEN',
|} = {
  SELECT: 'SELECT',
  PEN: 'PEN',
};

export type EditorTool = $Keys<typeof EditorTools>;

export default EditorTools;
