// @flow
import { observable, action } from 'mobx';
import EventEmitter from 'events';
import keycode from 'keycode';

class Keyboard {
  _events = new EventEmitter();
  @observable
  _isPressedByKeyCode: { [keyCode: number]: boolean } = {};

  setup() {
    window.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  teardown() {
    window.removeEventListener('keydown', this.handleKeyDown, false);
    window.removeEventListener('keyup', this.handleKeyUp, false);
  }

  @action
  handleKeyDown = (e: KeyboardEvent) => {
    this._isPressedByKeyCode[e.keyCode] = true;
    this._events.emit(`keyDown:${e.keyCode}`, e);
  };

  @action
  handleKeyUp = (e: KeyboardEvent) => {
    this._isPressedByKeyCode[e.keyCode] = false;
    this._events.emit(`keyUp:${e.keyCode}`, e);
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

export default new Keyboard();
