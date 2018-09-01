// @flow
import React from 'react';
import keyboard from '../editor/keyboard';

export type Keyboard = typeof keyboard;

type Props = {|
  name: string,
  cmdKey?: boolean,
  onDown?: Keyboard => void,
  onUp?: Keyboard => void,
|};

class KeyboardShortcut extends React.Component<Props> {
  _unsubscribes = [];

  componentDidMount() {
    this.listen();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.name !== this.props.name) {
      this.unsubscribe();
      this.listen();
    }
  }

  listen() {
    const { name } = this.props;
    this._unsubscribes.push(keyboard.onKeyDown(name, this.handleKeyDown));
    this._unsubscribes.push(keyboard.onKeyUp(name, this.handleKeyUp));
  }

  unsubscribe() {
    this._unsubscribes.forEach(unsubscribe => unsubscribe());
    this._unsubscribes = [];
  }

  handleKeyDown = () => {
    if (this.props.cmdKey === true && !keyboard.isPressed('cmd')) return;
    if (this.props.onDown) this.props.onDown(keyboard);
  };

  handleKeyUp = () => {
    if (this.props.onUp) this.props.onUp(keyboard);
  };

  render() {
    return null;
  }
}

export default KeyboardShortcut;
