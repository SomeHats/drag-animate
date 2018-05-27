// @flow
import { observable, decorate } from 'mobx';
import ShapeStyle from '../ShapeStyle';

class Shape {
  style: ShapeStyle = new ShapeStyle();
}

export default decorate(Shape, {
  style: observable,
});
