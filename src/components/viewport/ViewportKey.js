// @flow
import React from 'react';
import { withViewport, type Viewport } from './ViewportProvider';

type Props = {
  name: string,
  viewport: Viewport,
  onDown?: Viewport => void,
  onUp?: Viewport => void,
};

class ViewportKey extends React.Component<Props> {
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
    const { name, viewport } = this.props;
    const { keyboard } = viewport;
    this._unsubscribes.push(keyboard.onKeyDown(name, this.handleKeyDown));
    this._unsubscribes.push(keyboard.onKeyUp(name, this.handleKeyUp));
  }

  unsubscribe() {
    this._unsubscribes.forEach(unsubscribe => unsubscribe());
    this._unsubscribes = [];
  }

  handleKeyDown = () => {
    if (this.props.onDown) this.props.onDown(this.props.viewport);
  };

  handleKeyUp = () => {
    if (this.props.onUp) this.props.onUp(this.props.viewport);
  };

  render() {
    return null;
  }
}

export default withViewport(ViewportKey);
