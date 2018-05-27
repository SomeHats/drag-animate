// @flow
import { observable, decorate } from 'mobx';
import ShapeStyle from '../ShapeStyle';
import { genId, serializable, ref } from '../../serialize';

class Shape {
  id = genId();
  style: ShapeStyle = new ShapeStyle();
}

serializable(Shape, 'Shape', [], { style: ref(ShapeStyle) });

export default decorate(Shape, {
  style: observable,
});
