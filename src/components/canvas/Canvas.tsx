import * as React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  canvasRef?: (el: HTMLCanvasElement | null) => void;
  contextRef?: (ctx: CanvasRenderingContext2D | null) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

class Canvas extends React.Component<CanvasProps> {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  disposeRenderer: null | (() => void) = null;

  componentDidMount() {
    this.disposeRenderer = autorun(this.draw, {
      scheduler: cb => window.requestAnimationFrame(() => cb()),
    });
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    if (this.disposeRenderer) this.disposeRenderer();
  }

  draw = () => {
    const ctx = this.ctx;
    if (!ctx) return;

    const scale = window.devicePixelRatio;
    const { width, height, draw } = this.props;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, width, height);
    draw(ctx);
    ctx.restore();
  };

  canvasRef = (el: HTMLCanvasElement | null) => {
    this.canvas = el || null;
    this.ctx = el ? el.getContext('2d') : null;
    if (this.props.canvasRef) this.props.canvasRef(this.canvas);
    if (this.props.contextRef) this.props.contextRef(this.ctx);
  };

  render() {
    const {
      className,
      style,
      width,
      height,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onClick,
    } = this.props;
    const scale = window.devicePixelRatio;
    return (
      <canvas
        ref={this.canvasRef}
        className={className}
        style={{ ...style, width, height }}
        width={width * scale}
        height={height * scale}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick}
      />
    );
  }
}

export default observer(Canvas);
