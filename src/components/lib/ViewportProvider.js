// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import type Scene from '../../models/document/Scene';
import Vector2 from '../../models/Vector2';
import withSize, { type InjectedProps } from './withSize';

type Point = { x: number, y: number };

export type ViewportContext = {
  zoom: number,
  panX: number,
  panY: number,
  scale: number,
  px: number,
  pxWidth: number,
  pxHeight: number,
  screenCoordsToSceneCoords: Point => Vector2,
  sceneCoordsToScreenCoords: Point => Vector2,
};

const { Provider, Consumer } = React.createContext(null);

export const ViewportConsumer = Consumer;

type Props = {
  children: React.Node,
  scene: Scene,
};

const MARGIN = 30;

class ViewportProvider extends React.Component<Props & InjectedProps> {
  render() {
    const {
      children,
      scene,
      windowWidth,
      windowHeight,
      devicePixelRatio,
    } = this.props;
    const { width, height } = scene;
    const pxWidth = windowWidth - 300;
    const pxHeight = windowHeight - 64;
    const availWidth = pxWidth - 2 * MARGIN;
    const availHeight = pxHeight - 2 * MARGIN;
    const scale = devicePixelRatio;

    const zoom = Math.min(availWidth / width, availHeight / height);
    const panX =
      zoom * width < availWidth
        ? MARGIN + (availWidth / 2 - zoom * height / 2)
        : MARGIN;
    const panY =
      zoom * height < availHeight
        ? MARGIN + (availHeight / 2 - zoom * height / 2)
        : MARGIN;

    const sceneCoordsToScreenCoords = ({ x, y }: Point) => {
      return new Vector2(x * zoom + panX, y * zoom + panY + 64);
    };

    const screenCoordsToSceneCoords = ({ x, y }: Point): Vector2 => {
      return new Vector2((x - panX) / zoom, (y - 64 - panY) / zoom);
    };

    return (
      <Provider
        value={{
          zoom,
          panX,
          panY,
          scale,
          pxWidth,
          pxHeight,
          px: 1 / zoom,
          sceneCoordsToScreenCoords,
          screenCoordsToSceneCoords,
        }}
      >
        {children}
      </Provider>
    );
  }
}

export default (withSize(observer(ViewportProvider)): React.ComponentType<
  Props
>);
