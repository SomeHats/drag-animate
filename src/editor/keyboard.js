// @flow
import { decorate, observable, action } from 'mobx';
import EventEmitter from 'events';
import keycode from 'keycode';

class Keyboard {
  _events = new EventEmitter();
  _isPressedByKeyCode: { [number]: boolean } = {};

  setup() {
    window.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  teardown() {
    window.removeEventListener('keydown', this.handleKeyDown, false);
    window.removeEventListener('keyup', this.handleKeyUp, false);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    this._isPressedByKeyCode[e.keyCode] = true;
    this._events.emit(`keyDown:${e.keyCode}`);
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this._isPressedByKeyCode[e.keyCode] = false;
    this._events.emit(`keyUp:${e.keyCode}`);
  };

  keyCodeOrNameToKeyCode(keyCodeOrName: number | string): number {
    return typeof keyCodeOrName === 'number'
      ? keyCodeOrName
      : keycode(keyCodeOrName);
  }

  isPressed(keyCodeOrName: number | string) {
    const keyCode = this.keyCodeOrNameToKeyCode(keyCodeOrName);
    return !!this._isPressedByKeyCode[keyCode];
  }

  onKeyDown(keyCodeOrName: number | string, cb: () => void) {
    const keyCode = this.keyCodeOrNameToKeyCode(keyCodeOrName);
    const handler = () => cb();
    this._events.addListener(`keyDown:${keyCode}`, handler);
    return () => {
      this._events.removeListener(`keyDown:${keyCode}`, handler);
    };
  }

  onKeyUp(keyCodeOrName: number | string, cb: () => void) {
    const keyCode = this.keyCodeOrNameToKeyCode(keyCodeOrName);
    const handler = () => cb();
    this._events.addListener(`keyUp:${keyCode}`, handler);
    return () => {
      this._events.removeListener(`keyUp:${keyCode}`, handler);
    };
  }
}

decorate(Keyboard, {
  _isPressedByKeyCode: observable,
  handleKeyDown: action,
  handleKeyUp: action,
});

export default new Keyboard();
