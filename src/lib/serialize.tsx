// @flow
import { Class, crash, assertExists } from '../util';
export { genId } from '../util';

export interface Serialization {
  rootId: string;
  objectsById: { [id: string]: Object };
}

export interface Serializable {
  id: string;
}

interface Ref {
  type: 'one' | 'list' | 'object-map';
  target: Class<Serializable>;
}

interface Model {
  ctor: Class<Serializable>;
  name: string;
  primitives: string[];
  refs: { [key: string]: Ref };
}

const ID_JOINER = '#';

const impossible = (type: never) => {
  throw new Error(`impossible value ${type}`);
};

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
  if (!model) return crash(`model ${ctor.__proto__.name} is not serializable`);
  return model;
};

const getScopedIdForSerializable = (object: Serializable): string => {
  if (String(object.id).includes(ID_JOINER))
    return crash(`id "${String(object.id)}" must not include "${ID_JOINER}"`);
  const model = getModelForClass((object as any).__proto__.constructor);
  return `${model.name}${ID_JOINER}${String(object.id)}`;
};

export const serializeSingleRef = (
  object: Serializable,
  objectsById: { [id: string]: Object },
): string => {
  const id = getScopedIdForSerializable(object);
  if (!objectsById[id]) {
    objectsById[id] = serializeItem(object, objectsById);
  }

  return id;
};

const serializeRefList = (
  objects: Serializable[],
  objectsById: { [id: string]: Object },
): string[] => {
  return objects.map(object => serializeSingleRef(object, objectsById));
};

const serializeObjectMap = (
  objectsByKey: { [key: string]: Serializable },
  objectsById: { [id: string]: Object },
): { [id: string]: string } => {
  return Object.keys(objectsByKey)
    .map(key => [key, serializeSingleRef(objectsByKey[key], objectsById)])
    .reduce((memo, [key, object]) => ({ ...memo, [key]: object }), {});
};

const serializeRef = (
  ref: Ref,
  value: any,
  objectsById: { [id: string]: Object },
): any => {
  if (value === null) return null;
  switch (ref.type) {
    case 'one':
      return serializeSingleRef(value, objectsById);
    case 'list':
      return serializeRefList(value, objectsById);
    case 'object-map':
      return serializeObjectMap(value, objectsById);
    default:
      throw impossible(ref.type);
  }
};

const serializeItem = (
  object: Serializable,
  objectsById: { [id: string]: Object },
): Object => {
  const { primitives, refs } = getModelForClass(
    (object as any).__proto__.constructor,
  );

  const result: any = {};
  primitives.forEach(key => (result[key] = (object as any)[key]));
  Object.keys(refs).forEach(key => {
    result[key] = serializeRef(refs[key], (object as any)[key], objectsById);
  });

  return result;
};

export const ref = (target: Class<Serializable>): Ref => ({
  type: 'one',
  target,
});

export const refList = (target: Class<Serializable>): Ref => ({
  type: 'list',
  target,
});

export const refObjectMap = (target: Class<Serializable>): Ref => ({
  type: 'object-map',
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
  refs: { [key: string]: Ref } = {},
) => {
  if (name.includes(ID_JOINER)) {
    crash(`name "${name}" cant include "${ID_JOINER}"`);
  }
  if (modelsByName.has(name)) {
    crash(`serializable class with name ${name} already exists`);
  }

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

const parseId = (id: string): { model: Model; id: string } => {
  const parsed = id.split(ID_JOINER);
  if (parsed.length !== 2) crash(`invalid id "${id}"`);

  const model = modelsByName.get(parsed[0]);
  if (!model) return crash(`unknown serialize model ${parsed[0]}`);
  return { model, id: parsed[1] };
};

const deserializeRef = (
  ref: Ref,
  value: any,
  objectsById: { [id: string]: Object },
  resultCache: { [id: string]: Serializable } = {},
) => {
  if (value === null) return null;
  switch (ref.type) {
    case 'one':
      return deserializeItem(objectsById, value, resultCache);
    case 'list':
      return value.map((id: string) =>
        deserializeItem(objectsById, id, resultCache),
      );
    case 'object-map':
      return Object.keys(value)
        .map(
          (mapKey: string): [string, Serializable] => [
            mapKey,
            deserializeItem(objectsById, value[mapKey], resultCache),
          ],
        )
        .reduce(
          (memo, [mapKey, object]) => ({ ...memo, [mapKey]: object }),
          {},
        );
    default:
      throw impossible(ref.type);
  }
};
export const deserializeItem = (
  objectsById: { [id: string]: Object },
  scopedId: string,
  resultCache: { [id: string]: Serializable } = {},
) => {
  if (!resultCache[scopedId]) {
    const source = assertExists(objectsById[scopedId]);

    const { model, id } = parseId(scopedId);
    const { primitives, refs, ctor } = model;
    const result: any = new ctor();
    result.id = id;
    primitives.forEach(key => (result[key] = (source as any)[key]));
    Object.keys(refs).forEach(key => {
      result[key] = deserializeRef(
        refs[key],
        (source as any)[key],
        objectsById,
        resultCache,
      );
    });

    resultCache[scopedId] = result;
  }
  return resultCache[scopedId];
};

export const deserialize = (object: Serialization): Serializable => {
  const { rootId, objectsById } = object;
  return deserializeItem(objectsById, rootId);
};
