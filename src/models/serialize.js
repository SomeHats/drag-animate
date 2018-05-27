// @flow
import invariant from 'invariant';
import { type ID } from '../util';
export type { ID } from '../util';
export { genId } from '../util';

opaque type ScopedId = string;

export type Serialization = {
  rootId: ScopedId,
  objectsById: { [ScopedId]: Object },
};

type Serializable = {
  id: ID,
};

type Ref = {|
  list: boolean,
  target: Class<Serializable>,
|};

type Model = {|
  ctor: Class<Serializable>,
  name: string,
  primitives: string[],
  refs: { [string]: Ref },
|};

const ID_JOINER = '#';

const modelsByConstructor: Map<any, Model> = new Map();
const modelsByName: Map<string, Model> = new Map();

const extendModel = (a: Model, b: Model): Model => ({
  ctor: b.ctor || a.ctor,
  name: b.name || a.name,
  primitives: [...a.primitives, ...b.primitives],
  refs: { ...a.refs, ...b.refs },
});

const getModelForClass = (ctor: any): Model => {
  const model = modelsByConstructor.get(ctor);
  invariant(
    model,
    `model ${ctor.__proto__.constructor.name} is not serializable`
  );
  return model;
};

const getScopedIdForSerializable = (object: Serializable): ScopedId => {
  invariant(
    !String(object.id).includes(ID_JOINER),
    `id "${String(object.id)}" must not include "${ID_JOINER}"`
  );
  const model = getModelForClass(object.__proto__.constructor);
  return `${model.name}${ID_JOINER}${String(object.id)}`;
};

export const serializeSingleRef = (
  object: Serializable,
  objectsById: { [ScopedId]: Object }
): ScopedId => {
  const id = getScopedIdForSerializable(object);
  if (!objectsById[id]) {
    objectsById[id] = serializeItem(object, objectsById);
  }

  return id;
};

const serializeRefList = (
  objects: Serializable[],
  objectsById: { [ScopedId]: Object }
): ScopedId[] => {
  return objects.map(object => serializeSingleRef(object, objectsById));
};

const serializeItem = (
  object: Serializable,
  objectsById: { [ScopedId]: Object }
): Object => {
  const { primitives, refs } = getModelForClass(object.__proto__.constructor);

  const result = {};
  primitives.forEach(key => (result[key] = object[key]));
  Object.keys(refs).map(
    key =>
      (result[key] = refs[key].list
        ? serializeRefList(object[key], objectsById)
        : serializeSingleRef(object[key], objectsById))
  );

  return result;
};

export const ref = (target: Class<Serializable>): Ref => ({
  list: false,
  target,
});

export const refList = (target: Class<Serializable>): Ref => ({
  list: true,
  target,
});

const getModelsInInheritanceTree = (ctor: any): Model[] => {
  const parent = ctor.__proto__;
  const parentModels = parent ? getModelsInInheritanceTree(parent) : [];
  const currentModel = modelsByConstructor.get(ctor);
  return currentModel ? [...parentModels, currentModel] : parentModels;
};

export const serializable = (
  ctor: Class<Serializable>,
  name: string,
  primitives: string[],
  refs: { [string]: Ref } = {}
) => {
  invariant(
    !name.includes(ID_JOINER),
    `name "${name}" cant include "${ID_JOINER}"`
  );
  invariant(
    !modelsByName.has(name),
    `serializable class with name ${name} already exists`
  );

  const parentModels = getModelsInInheritanceTree(ctor);
  const currentModel = { ctor, name, primitives, refs };
  const model = [...parentModels, currentModel].reduce(extendModel);
  modelsByConstructor.set(ctor, model);
  modelsByName.set(name, model);
};

export const serialize = (object: Serializable): Serialization => {
  const objectsById = {};
  const rootId = serializeSingleRef(object, objectsById);
  return { rootId, objectsById };
};

const parseId = (id: ScopedId): { model: Model, id: string } => {
  const parsed = id.split(ID_JOINER);
  invariant(parsed.length === 2, `invalid id "${id}"`);

  const model = modelsByName.get(parsed[0]);
  invariant(model, `unknown serialize model ${parsed[0]}`);
  return { model, id: parsed[1] };
};

export const deserializeItem = (
  objectsById: { [ScopedId]: Object },
  scopedId: ScopedId,
  resultCache: { [ScopedId]: Serializable } = {}
) => {
  if (!resultCache[scopedId]) {
    const source = objectsById[scopedId];
    invariant(source, `no object found for id ${String(scopedId)}`);

    const { model, id } = parseId(scopedId);
    const { primitives, refs, ctor } = model;
    const result = new ctor();
    result.id = id;
    primitives.forEach(key => (result[key] = source[key]));
    Object.keys(refs).forEach(key => {
      const ref = refs[key];
      if (ref.list) {
        result[key] = source[key].map(id =>
          deserializeItem(objectsById, id, resultCache)
        );
      } else {
        result[key] = deserializeItem(objectsById, source[key], resultCache);
      }
    });

    resultCache[scopedId] = result;
  }
  return resultCache[scopedId];
};

export const deserialize = (object: Serialization): Serializable => {
  const { rootId, objectsById } = object;
  return deserializeItem(objectsById, rootId);
};
