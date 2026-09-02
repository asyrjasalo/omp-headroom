var __defProp = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/typebox/build/system/memory/metrics.mjs
var Metrics;
var init_metrics = __esm(() => {
  Metrics = {
    assign: 0,
    create: 0,
    clone: 0,
    discard: 0,
    update: 0
  };
});

// node_modules/typebox/build/system/memory/assign.mjs
function Assign(left, right) {
  Metrics.assign += 1;
  return { ...left, ...right };
}
var init_assign = __esm(() => {
  init_metrics();
});

// node_modules/typebox/build/guard/string.mjs
function IsBetween(value, min, max) {
  return value >= min && value <= max;
}
function IsZeroWidthJoiner(value) {
  return value === 8205;
}
function IsHighSurrogate(value) {
  return IsBetween(value, 55296, 56319);
}
function IsRegionalIndicator(value) {
  return IsBetween(value, 127462, 127487);
}
function IsVariationSelector(value) {
  return IsBetween(value, 65024, 65039);
}
function IsCombiningMark(value) {
  return IsBetween(value, 768, 879) || IsBetween(value, 6832, 6911) || IsBetween(value, 7616, 7679) || IsBetween(value, 65056, 65071);
}
function CodePointLength(value) {
  return value > 65535 ? 2 : 1;
}
function ConsumeModifiers(value, index) {
  while (index < value.length) {
    const point = value.codePointAt(index);
    if (IsCombiningMark(point) || IsVariationSelector(point)) {
      index += CodePointLength(point);
    } else {
      break;
    }
  }
  return index;
}
function NextGraphemeClusterIndex(value, clusterStart) {
  const startCP = value.codePointAt(clusterStart);
  let clusterEnd = clusterStart + CodePointLength(startCP);
  clusterEnd = ConsumeModifiers(value, clusterEnd);
  while (clusterEnd < value.length - 1 && value[clusterEnd] === "‍") {
    const nextCP = value.codePointAt(clusterEnd + 1);
    clusterEnd += 1 + CodePointLength(nextCP);
    clusterEnd = ConsumeModifiers(value, clusterEnd);
  }
  if (IsRegionalIndicator(startCP) && clusterEnd < value.length && IsRegionalIndicator(value.codePointAt(clusterEnd))) {
    clusterEnd += CodePointLength(value.codePointAt(clusterEnd));
  }
  return clusterEnd;
}
function IsGraphemeCodePoint(value) {
  return IsHighSurrogate(value) || IsCombiningMark(value) || IsVariationSelector(value) || IsZeroWidthJoiner(value);
}
function GraphemeCount(value) {
  let count = 0;
  let index = 0;
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index);
    count++;
  }
  return count;
}
function IsMinLength(value, minLength) {
  if (minLength === 0)
    return true;
  let count = 0;
  let index = 0;
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index);
    count++;
    if (count >= minLength)
      return true;
  }
  return false;
}
function IsMaxLength(value, maxLength) {
  let count = 0;
  let index = 0;
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index);
    count++;
    if (count > maxLength)
      return false;
  }
  return true;
}
function IsMinLengthFast(value, minLength) {
  if (minLength === 0)
    return true;
  let index = 0;
  while (index < value.length) {
    if (IsGraphemeCodePoint(value.charCodeAt(index))) {
      return IsMinLength(value, minLength);
    }
    index++;
    if (index >= minLength)
      return true;
  }
  return false;
}
function IsMaxLengthFast(value, maxLength) {
  let index = 0;
  while (index < value.length) {
    if (IsGraphemeCodePoint(value.charCodeAt(index))) {
      return IsMaxLength(value, maxLength);
    }
    index++;
    if (index > maxLength)
      return false;
  }
  return true;
}

// node_modules/typebox/build/guard/guard.mjs
var exports_guard = {};
__export(exports_guard, {
  Entries: () => Entries,
  EntriesRegExp: () => EntriesRegExp,
  Every: () => Every,
  EveryAll: () => EveryAll,
  GraphemeCount: () => GraphemeCount2,
  HasPropertyKey: () => HasPropertyKey,
  IsArray: () => IsArray,
  IsBigInt: () => IsBigInt,
  IsBoolean: () => IsBoolean,
  IsClassInstance: () => IsClassInstance,
  IsConstructor: () => IsConstructor,
  IsDeepEqual: () => IsDeepEqual,
  IsEqual: () => IsEqual,
  IsFunction: () => IsFunction,
  IsGreaterEqualThan: () => IsGreaterEqualThan,
  IsGreaterThan: () => IsGreaterThan,
  IsInteger: () => IsInteger,
  IsLessEqualThan: () => IsLessEqualThan,
  IsLessThan: () => IsLessThan,
  IsMaxLength: () => IsMaxLength2,
  IsMinLength: () => IsMinLength2,
  IsMultipleOf: () => IsMultipleOf,
  IsNull: () => IsNull,
  IsNumber: () => IsNumber,
  IsObject: () => IsObject,
  IsObjectNotArray: () => IsObjectNotArray,
  IsString: () => IsString,
  IsSymbol: () => IsSymbol,
  IsUndefined: () => IsUndefined,
  IsUnsafePropertyKey: () => IsUnsafePropertyKey,
  IsValueLike: () => IsValueLike,
  Keys: () => Keys,
  ShiftLeft: () => ShiftLeft,
  Symbols: () => Symbols,
  Values: () => Values
});
function IsArray(value) {
  return Array.isArray(value);
}
function IsBigInt(value) {
  return IsEqual(typeof value, "bigint");
}
function IsBoolean(value) {
  return IsEqual(typeof value, "boolean");
}
function IsConstructor(value) {
  if (IsUndefined(value) || !IsFunction(value))
    return false;
  const result = Function.prototype.toString.call(value);
  if (/^class\s/.test(result))
    return true;
  if (/\[native code\]/.test(result))
    return true;
  return false;
}
function IsFunction(value) {
  return IsEqual(typeof value, "function");
}
function IsInteger(value) {
  return Number.isInteger(value);
}
function IsNull(value) {
  return IsEqual(value, null);
}
function IsNumber(value) {
  return Number.isFinite(value);
}
function IsObjectNotArray(value) {
  return IsObject(value) && !IsArray(value);
}
function IsObject(value) {
  return IsEqual(typeof value, "object") && !IsNull(value);
}
function IsString(value) {
  return IsEqual(typeof value, "string");
}
function IsSymbol(value) {
  return IsEqual(typeof value, "symbol");
}
function IsUndefined(value) {
  return IsEqual(value, undefined);
}
function IsEqual(left, right) {
  return left === right;
}
function IsGreaterThan(left, right) {
  return left > right;
}
function IsLessThan(left, right) {
  return left < right;
}
function IsLessEqualThan(left, right) {
  return left <= right;
}
function IsGreaterEqualThan(left, right) {
  return left >= right;
}
function IsMultipleOf(dividend, divisor) {
  if (IsBigInt(dividend) || IsBigInt(divisor)) {
    return BigInt(dividend) % BigInt(divisor) === 0n;
  }
  const tolerance = 0.0000000001;
  if (!IsNumber(dividend))
    return true;
  if (IsInteger(dividend) && 1 / divisor % 1 === 0)
    return true;
  const mod = dividend % divisor;
  return Math.min(Math.abs(mod), Math.abs(mod - divisor), Math.abs(mod + divisor)) < tolerance;
}
function IsClassInstance(value) {
  if (!IsObject(value))
    return false;
  const proto = globalThis.Object.getPrototypeOf(value);
  if (IsNull(proto))
    return false;
  return IsEqual(typeof proto.constructor, "function") && !(IsEqual(proto.constructor, globalThis.Object) || IsEqual(proto.constructor.name, "Object"));
}
function IsValueLike(value) {
  return IsBigInt(value) || IsBoolean(value) || IsNull(value) || IsNumber(value) || IsString(value) || IsUndefined(value);
}
function GraphemeCount2(value) {
  return GraphemeCount(value);
}
function IsMaxLength2(value, length) {
  return IsMaxLengthFast(value, length);
}
function IsMinLength2(value, length) {
  return IsMinLengthFast(value, length);
}
function Every(value, offset, callback) {
  for (let index = offset;index < value.length; index++) {
    if (!callback(value[index], index))
      return false;
  }
  return true;
}
function EveryAll(value, offset, callback) {
  let result = true;
  for (let index = offset;index < value.length; index++) {
    if (!callback(value[index], index))
      result = false;
  }
  return result;
}
function ShiftLeft(array, true_, false_) {
  return IsEqual(array.length, 0) ? false_() : true_(array[0], array.slice(1));
}
function IsUnsafePropertyKey(key) {
  return IsEqual(key, "__proto__") || IsEqual(key, "constructor") || IsEqual(key, "prototype");
}
function HasPropertyKey(value, key) {
  return IsUnsafePropertyKey(key) ? Object.prototype.hasOwnProperty.call(value, key) : (key in value);
}
function EntriesRegExp(value) {
  return Keys(value).map((key) => [new RegExp(`^${key}$`), value[key]]);
}
function Entries(value) {
  return Object.entries(value);
}
function Keys(value) {
  return Object.getOwnPropertyNames(value);
}
function Symbols(value) {
  return Object.getOwnPropertySymbols(value);
}
function Values(value) {
  return Object.values(value);
}
function DeepEqualObject(left, right) {
  if (!IsObject(right))
    return false;
  const keys = Keys(left);
  return IsEqual(keys.length, Keys(right).length) && keys.every((key) => IsDeepEqual(left[key], right[key]));
}
function DeepEqualArray(left, right) {
  return IsArray(right) && IsEqual(left.length, right.length) && left.every((_, index) => IsDeepEqual(left[index], right[index]));
}
function IsDeepEqual(left, right) {
  return IsArray(left) ? DeepEqualArray(left, right) : IsObject(left) ? DeepEqualObject(left, right) : IsEqual(left, right);
}
var init_guard = () => {};

// node_modules/typebox/build/guard/emit.mjs
var init_emit = __esm(() => {
  init_guard();
});

// node_modules/typebox/build/guard/globals.mjs
var exports_globals = {};
__export(exports_globals, {
  IsBigInt64Array: () => IsBigInt64Array,
  IsBigUint64Array: () => IsBigUint64Array,
  IsBoolean: () => IsBoolean2,
  IsDate: () => IsDate,
  IsFloat32Array: () => IsFloat32Array,
  IsFloat64Array: () => IsFloat64Array,
  IsInt16Array: () => IsInt16Array,
  IsInt32Array: () => IsInt32Array,
  IsInt8Array: () => IsInt8Array,
  IsMap: () => IsMap,
  IsNumber: () => IsNumber2,
  IsRegExp: () => IsRegExp,
  IsSet: () => IsSet,
  IsString: () => IsString2,
  IsTypeArray: () => IsTypeArray,
  IsUint16Array: () => IsUint16Array,
  IsUint32Array: () => IsUint32Array,
  IsUint8Array: () => IsUint8Array,
  IsUint8ClampedArray: () => IsUint8ClampedArray
});
function IsBoolean2(value) {
  return value instanceof Boolean;
}
function IsNumber2(value) {
  return value instanceof Number;
}
function IsString2(value) {
  return value instanceof String;
}
function IsTypeArray(value) {
  return globalThis.ArrayBuffer.isView(value);
}
function IsInt8Array(value) {
  return value instanceof globalThis.Int8Array;
}
function IsUint8Array(value) {
  return value instanceof globalThis.Uint8Array;
}
function IsUint8ClampedArray(value) {
  return value instanceof globalThis.Uint8ClampedArray;
}
function IsInt16Array(value) {
  return value instanceof globalThis.Int16Array;
}
function IsUint16Array(value) {
  return value instanceof globalThis.Uint16Array;
}
function IsInt32Array(value) {
  return value instanceof globalThis.Int32Array;
}
function IsUint32Array(value) {
  return value instanceof globalThis.Uint32Array;
}
function IsFloat32Array(value) {
  return value instanceof globalThis.Float32Array;
}
function IsFloat64Array(value) {
  return value instanceof globalThis.Float64Array;
}
function IsBigInt64Array(value) {
  return value instanceof globalThis.BigInt64Array;
}
function IsBigUint64Array(value) {
  return value instanceof globalThis.BigUint64Array;
}
function IsRegExp(value) {
  return value instanceof globalThis.RegExp;
}
function IsDate(value) {
  return value instanceof globalThis.Date;
}
function IsSet(value) {
  return value instanceof globalThis.Set;
}
function IsMap(value) {
  return value instanceof globalThis.Map;
}

// node_modules/typebox/build/guard/native.mjs
var init_native = __esm(() => {
  init_guard();
});

// node_modules/typebox/build/guard/index.mjs
var init_guard2 = __esm(() => {
  init_emit();
  init_native();
  init_guard();
  init_guard();
});

// node_modules/typebox/build/system/memory/clone.mjs
function FromClassInstance(value) {
  return value;
}
function IsTypeObject(value) {
  return exports_guard.HasPropertyKey(value, "~kind") || exports_guard.HasPropertyKey(value, "~unsafe");
}
function FromTypeObject(value) {
  const result = {};
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of Object.keys(descriptors)) {
    if (exports_guard.IsUnsafePropertyKey(key))
      continue;
    const descriptor = descriptors[key];
    if (exports_guard.HasPropertyKey(descriptor, "value")) {
      Object.defineProperty(result, key, { ...descriptor, value: FromValue(descriptor.value) });
    }
  }
  return result;
}
function FromPlainObject(value) {
  const result = {};
  for (const key of exports_guard.Keys(value)) {
    if (exports_guard.IsUnsafePropertyKey(key))
      continue;
    result[key] = FromValue(value[key]);
  }
  for (const key of exports_guard.Symbols(value)) {
    result[key] = FromValue(value[key]);
  }
  return result;
}
function FromObject(value) {
  return exports_guard.IsClassInstance(value) ? FromClassInstance(value) : IsTypeObject(value) ? FromTypeObject(value) : FromPlainObject(value);
}
function FromArray(value) {
  return value.map((element) => FromValue(element));
}
function FromTypedArray(value) {
  return value.slice();
}
function FromRegExp(value) {
  return new RegExp(value.source, value.flags);
}
function FromMap(value) {
  return new Map(FromValue([...value.entries()]));
}
function FromSet(value) {
  return new Set(FromValue([...value.values()]));
}
function FromValue(value) {
  return exports_globals.IsTypeArray(value) ? FromTypedArray(value) : exports_globals.IsRegExp(value) ? FromRegExp(value) : exports_globals.IsMap(value) ? FromMap(value) : exports_globals.IsSet(value) ? FromSet(value) : exports_guard.IsArray(value) ? FromArray(value) : exports_guard.IsObject(value) ? FromObject(value) : value;
}
function Clone(value) {
  Metrics.clone += 1;
  return FromValue(value);
}
var init_clone = __esm(() => {
  init_guard2();
  init_metrics();
});

// node_modules/typebox/build/system/settings/settings.mjs
var exports_settings = {};
__export(exports_settings, {
  Get: () => Get,
  Reset: () => Reset,
  Set: () => Set2
});
function Reset() {
  settings.immutableTypes = false;
  settings.maxErrors = 8;
  settings.useAcceleration = true;
  settings.exactOptionalPropertyTypes = false;
  settings.enumerableKind = false;
  settings.correctiveParse = false;
  settings.unionPrioritySort = true;
}
function Set2(options) {
  for (const key of exports_guard.Keys(options)) {
    const value = options[key];
    if (value !== undefined) {
      Object.defineProperty(settings, key, { value });
    }
  }
}
function Get() {
  return settings;
}
var settings;
var init_settings = __esm(() => {
  init_guard2();
  settings = {
    immutableTypes: false,
    maxErrors: 8,
    useAcceleration: true,
    exactOptionalPropertyTypes: false,
    enumerableKind: false,
    correctiveParse: false,
    unionPrioritySort: true
  };
});

// node_modules/typebox/build/system/settings/index.mjs
var init_settings2 = __esm(() => {
  init_settings();
});

// node_modules/typebox/build/system/memory/create.mjs
function MergeHidden(left, right) {
  for (const key of Object.keys(right)) {
    Object.defineProperty(left, key, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: right[key]
    });
  }
  return left;
}
function Merge(left, right) {
  return { ...left, ...right };
}
function Create(hidden, enumerable, options = {}) {
  Metrics.create += 1;
  const settings2 = exports_settings.Get();
  const withOptions = Merge(enumerable, options);
  const withHidden = settings2.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
  return settings2.immutableTypes ? Object.freeze(withHidden) : withHidden;
}
var init_create = __esm(() => {
  init_settings2();
  init_metrics();
});

// node_modules/typebox/build/system/memory/discard.mjs
function Discard(value, propertyKeys) {
  Metrics.discard += 1;
  const result = {};
  const descriptors = Object.getOwnPropertyDescriptors(Clone(value));
  const keysToDiscard = new Set(propertyKeys);
  for (const key of Object.keys(descriptors)) {
    if (keysToDiscard.has(key))
      continue;
    Object.defineProperty(result, key, descriptors[key]);
  }
  return result;
}
var init_discard = __esm(() => {
  init_metrics();
  init_clone();
});

// node_modules/typebox/build/system/memory/update.mjs
function Update(current, hidden, enumerable) {
  Metrics.update += 1;
  const settings2 = exports_settings.Get();
  const result = Clone(current);
  for (const key of Object.keys(hidden)) {
    Object.defineProperty(result, key, {
      configurable: true,
      writable: true,
      enumerable: settings2.enumerableKind,
      value: hidden[key]
    });
  }
  for (const key of Object.keys(enumerable)) {
    Object.defineProperty(result, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: enumerable[key]
    });
  }
  return result;
}
var init_update = __esm(() => {
  init_settings2();
  init_metrics();
  init_clone();
});

// node_modules/typebox/build/system/memory/memory.mjs
var exports_memory = {};
__export(exports_memory, {
  Assign: () => Assign,
  Clone: () => Clone,
  Create: () => Create,
  Discard: () => Discard,
  Metrics: () => Metrics,
  Update: () => Update
});
var init_memory = __esm(() => {
  init_assign();
  init_clone();
  init_create();
  init_discard();
  init_metrics();
  init_update();
});

// node_modules/typebox/build/system/memory/index.mjs
var init_memory2 = __esm(() => {
  init_memory();
});

// node_modules/typebox/build/type/types/schema.mjs
function IsKind(value, kind) {
  return exports_guard.IsObject(value) && exports_guard.HasPropertyKey(value, "~kind") && exports_guard.IsEqual(value["~kind"], kind);
}
function IsSchema(value) {
  return exports_guard.IsObject(value);
}
var init_schema = __esm(() => {
  init_guard2();
});

// node_modules/typebox/build/type/types/deferred.mjs
function Deferred(action, parameters, options) {
  return exports_memory.Create({ "~kind": "Deferred" }, { type: "deferred", action, parameters, options }, {});
}
function IsDeferred(value) {
  return IsKind(value, "Deferred");
}
var init_deferred = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/engine/readonly/instantiate_add.mjs
function AddReadonlyOperation(type) {
  return exports_memory.Update(type, { "~readonly": true }, {});
}
function AddReadonlyAction(type, options) {
  const result = exports_memory.Update(AddReadonlyOperation(type), {}, options);
  return result;
}
function AddReadonlyInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return AddReadonlyAction(instantiatedType, options);
}
var init_instantiate_add = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/optional/instantiate_add.mjs
function AddOptionalOperation(type) {
  return exports_memory.Update(type, { "~optional": true }, {});
}
function AddOptionalAction(type, options) {
  const result = exports_memory.Update(AddOptionalOperation(type), {}, options);
  return result;
}
function AddOptionalInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return AddOptionalAction(instantiatedType, options);
}
var init_instantiate_add2 = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/types/array.mjs
function _Array_(items, options) {
  return exports_memory.Create({ "~kind": "Array" }, { type: "array", items }, options);
}
function IsArray2(value) {
  return IsKind(value, "Array");
}
function ArrayOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "items"]);
}
var init_array = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/constructor.mjs
function Constructor(parameters, instanceType, options = {}) {
  return exports_memory.Create({ "~kind": "Constructor" }, { type: "constructor", parameters, instanceType }, options);
}
function IsConstructor2(value) {
  return IsKind(value, "Constructor");
}
function ConstructorOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "parameters", "instanceType"]);
}
var init_constructor = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/function.mjs
function _Function_(parameters, returnType, options = {}) {
  return exports_memory.Create({ ["~kind"]: "Function" }, { type: "function", parameters, returnType }, options);
}
function IsFunction2(value) {
  return IsKind(value, "Function");
}
function FunctionOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "parameters", "returnType"]);
}
var init_function = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/ref.mjs
function Ref(ref, options) {
  return exports_memory.Create({ ["~kind"]: "Ref" }, { $ref: ref }, options);
}
function IsRef(value) {
  return IsKind(value, "Ref");
}
var init_ref = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/generic.mjs
function Generic(parameters, expression) {
  return exports_memory.Create({ "~kind": "Generic" }, { type: "generic", parameters, expression });
}
function IsGeneric(value) {
  return IsKind(value, "Generic");
}
var init_generic = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/any.mjs
function Any(options) {
  return exports_memory.Create({ ["~kind"]: "Any" }, {}, options);
}
function IsAny(value) {
  return IsKind(value, "Any");
}
var init_any = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/never.mjs
function Never(options) {
  return exports_memory.Create({ "~kind": "Never" }, { not: {} }, options);
}
function IsNever(value) {
  return IsKind(value, "Never");
}
var NeverPattern = "(?!)";
var init_never = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/action/_add_optional.mjs
function AddOptionalDeferred(type, options = {}) {
  return Deferred("AddOptional", [type], options);
}
function AddOptional(type, options = {}) {
  return AddOptionalAction(type, options);
}
var init__add_optional = __esm(() => {
  init_deferred();
  init_instantiate_add2();
});

// node_modules/typebox/build/type/types/_optional.mjs
function Optional(type) {
  return AddOptional(type);
}
function IsOptional(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "~optional");
}
var init__optional = __esm(() => {
  init_guard2();
  init_schema();
  init__add_optional();
});

// node_modules/typebox/build/type/types/properties.mjs
function RequiredArray(properties) {
  return exports_guard.Keys(properties).filter((key) => !IsOptional(properties[key]));
}
function PropertyKeys(properties) {
  return exports_guard.Keys(properties);
}
function PropertyValues(properties) {
  return exports_guard.Values(properties);
}
var init_properties = __esm(() => {
  init_guard2();
  init__optional();
});

// node_modules/typebox/build/type/types/object.mjs
function _Object_(properties, options = {}) {
  const requiredKeys = RequiredArray(properties);
  const required = requiredKeys.length > 0 ? { required: requiredKeys } : {};
  return exports_memory.Create({ "~kind": "Object" }, { type: "object", ...required, properties }, options);
}
function IsObject2(value) {
  return IsKind(value, "Object");
}
function ObjectOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "properties", "required"]);
}
var init_object = __esm(() => {
  init_memory2();
  init_schema();
  init_properties();
});

// node_modules/typebox/build/type/types/unknown.mjs
function Unknown(options) {
  return exports_memory.Create({ ["~kind"]: "Unknown" }, {}, options);
}
function IsUnknown(value) {
  return IsKind(value, "Unknown");
}
var init_unknown = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/cyclic.mjs
function Cyclic($defs, $ref, options) {
  const defs = exports_guard.Keys($defs).reduce((result, key) => {
    return { ...result, [key]: exports_memory.Update($defs[key], {}, { $id: key }) };
  }, {});
  return exports_memory.Create({ ["~kind"]: "Cyclic" }, { $defs: defs, $ref }, options);
}
function IsCyclic(value) {
  return IsKind(value, "Cyclic");
}
function CyclicOptions(type) {
  return exports_memory.Discard(type, ["~kind", "$defs", "$ref"]);
}
var init_cyclic = __esm(() => {
  init_guard2();
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/unsafe.mjs
function Unsafe(schema) {
  return exports_memory.Update(schema, { ["~unsafe"]: null }, {});
}
function IsUnsafe(value) {
  return exports_guard.IsObjectNotArray(value) && exports_guard.HasPropertyKey(value, "~unsafe") && exports_guard.IsNull(value["~unsafe"]);
}
var init_unsafe = __esm(() => {
  init_guard2();
  init_memory2();
});

// node_modules/typebox/build/system/arguments/arguments.mjs
var exports_arguments = {};
__export(exports_arguments, {
  Match: () => Match
});
function Match(args, match) {
  return match[args.length]?.(...args) ?? (() => {
    throw Error("Invalid Arguments");
  })();
}

// node_modules/typebox/build/system/arguments/index.mjs
var init_arguments = () => {};

// node_modules/typebox/build/type/types/infer.mjs
function Infer(...args) {
  const [name, extends_] = exports_arguments.Match(args, {
    2: (name2, extends_2) => [name2, extends_2, extends_2],
    1: (name2) => [name2, Unknown(), Unknown()]
  });
  return exports_memory.Create({ ["~kind"]: "Infer" }, { type: "infer", name, extends: extends_ }, {});
}
function IsInfer(value) {
  return IsKind(value, "Infer");
}
var init_infer = __esm(() => {
  init_arguments();
  init_memory2();
  init_schema();
  init_unknown();
});

// node_modules/typebox/build/type/types/dependent.mjs
function Dependent(if_, then_, else_, options = {}) {
  return exports_memory.Create({ "~kind": "Dependent" }, { if: if_, then: then_, else: else_ }, options);
}
function IsDependent(value) {
  return IsKind(value, "Dependent");
}
function DependentOptions(type) {
  return exports_memory.Discard(type, ["~kind", "if", "then", "else"]);
}
var init_dependent = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/engine/enum/typescript_enum_to_enum_values.mjs
function IsTypeScriptEnumLike(value) {
  return exports_guard.IsObjectNotArray(value);
}
function TypeScriptEnumToEnumValues(type) {
  const keys = exports_guard.Keys(type).filter((key) => isNaN(key));
  return keys.reduce((result, key) => [...result, type[key]], []);
}
var init_typescript_enum_to_enum_values = __esm(() => {
  init_guard2();
});

// node_modules/typebox/build/type/types/enum.mjs
function IsEnumValue(value) {
  return exports_guard.IsString(value) || exports_guard.IsNumber(value);
}
function Enum(value, options) {
  const values = IsTypeScriptEnumLike(value) ? TypeScriptEnumToEnumValues(value) : value;
  return exports_memory.Create({ "~kind": "Enum" }, { enum: values }, options);
}
function IsEnum(value) {
  return IsKind(value, "Enum");
}
var init_enum = __esm(() => {
  init_guard2();
  init_memory2();
  init_schema();
  init_typescript_enum_to_enum_values();
  init_typescript_enum_to_enum_values();
});

// node_modules/typebox/build/type/types/intersect.mjs
function Intersect(types, options = {}) {
  return exports_memory.Create({ "~kind": "Intersect" }, { allOf: types }, options);
}
function IsIntersect(value) {
  return IsKind(value, "Intersect");
}
function IntersectOptions(type) {
  return exports_memory.Discard(type, ["~kind", "allOf"]);
}
var init_intersect = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/system/environment/evaluate.mjs
var init_evaluate = __esm(() => {
  init_settings2();
  init_guard2();
});

// node_modules/typebox/build/system/environment/environment.mjs
var init_environment = __esm(() => {
  init_evaluate();
});

// node_modules/typebox/build/system/environment/index.mjs
var init_environment2 = __esm(() => {
  init_environment();
});

// node_modules/typebox/build/system/unreachable/unreachable.mjs
function Unreachable() {
  throw new Error("Unreachable");
}

// node_modules/typebox/build/system/unreachable/index.mjs
var init_unreachable = () => {};

// node_modules/typebox/build/system/hashing/hash.mjs
var ByteMarker, Accumulator, Prime, Size, Bytes, F64, F64In, F64Out, encoder;
var init_hash = __esm(() => {
  init_unreachable();
  init_guard2();
  (function(ByteMarker2) {
    ByteMarker2[ByteMarker2["Array"] = 0] = "Array";
    ByteMarker2[ByteMarker2["BigInt"] = 1] = "BigInt";
    ByteMarker2[ByteMarker2["Boolean"] = 2] = "Boolean";
    ByteMarker2[ByteMarker2["Date"] = 3] = "Date";
    ByteMarker2[ByteMarker2["Constructor"] = 4] = "Constructor";
    ByteMarker2[ByteMarker2["Function"] = 5] = "Function";
    ByteMarker2[ByteMarker2["Null"] = 6] = "Null";
    ByteMarker2[ByteMarker2["Number"] = 7] = "Number";
    ByteMarker2[ByteMarker2["Object"] = 8] = "Object";
    ByteMarker2[ByteMarker2["RegExp"] = 9] = "RegExp";
    ByteMarker2[ByteMarker2["String"] = 10] = "String";
    ByteMarker2[ByteMarker2["Symbol"] = 11] = "Symbol";
    ByteMarker2[ByteMarker2["TypeArray"] = 12] = "TypeArray";
    ByteMarker2[ByteMarker2["Undefined"] = 13] = "Undefined";
  })(ByteMarker || (ByteMarker = {}));
  Accumulator = BigInt("14695981039346656037");
  [Prime, Size] = [BigInt("1099511628211"), BigInt("18446744073709551616")];
  Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i));
  F64 = new Float64Array(1);
  F64In = new DataView(F64.buffer);
  F64Out = new Uint8Array(F64.buffer);
  encoder = new TextEncoder;
});

// node_modules/typebox/build/system/hashing/index.mjs
var init_hashing = __esm(() => {
  init_hash();
});
// node_modules/typebox/build/system/locale/_config.mjs
var init__config = () => {};
// node_modules/typebox/build/system/locale/_locale.mjs
var init__locale = __esm(() => {
  init__config();
});

// node_modules/typebox/build/system/locale/index.mjs
var init_locale = __esm(() => {
  init__locale();
});

// node_modules/typebox/build/system/system.mjs
var init_system = __esm(() => {
  init_arguments();
  init_environment2();
  init_hashing();
  init_locale();
  init_memory2();
  init_settings2();
});

// node_modules/typebox/build/system/index.mjs
var init_system2 = __esm(() => {
  init_system();
  init_system();
  init_system();
});

// node_modules/typebox/build/type/types/_codec.mjs
class EncodeBuilder {
  constructor(type, decode) {
    this.type = type;
    this.decode = decode;
  }
  Encode(callback) {
    const type = this.type;
    const decode = IsCodec(type) ? (value) => this.decode(type["~codec"].decode(value)) : this.decode;
    const encode = IsCodec(type) ? (value) => type["~codec"].encode(callback(value)) : callback;
    const codec = { decode, encode };
    return exports_memory.Update(this.type, { "~codec": codec }, {});
  }
}

class DecodeBuilder {
  constructor(type) {
    this.type = type;
  }
  Decode(callback) {
    return new EncodeBuilder(this.type, callback);
  }
}
function Codec(type) {
  return new DecodeBuilder(type);
}
function Decode(type, callback) {
  return Codec(type).Decode(callback).Encode(() => {
    throw Error("Encode not implemented");
  });
}
function Encode(type, callback) {
  return Codec(type).Decode(() => {
    throw Error("Decode not implemented");
  }).Encode(callback);
}
function IsCodec(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "~codec") && exports_guard.IsObject(value["~codec"]) && exports_guard.HasPropertyKey(value["~codec"], "encode") && exports_guard.HasPropertyKey(value["~codec"], "decode");
}
var init__codec = __esm(() => {
  init_system2();
  init_guard2();
  init_schema();
});

// node_modules/typebox/build/type/types/_immutable.mjs
function Immutable(type) {
  return AddImmutable(type);
}
function IsImmutable(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "~immutable");
}
var init__immutable = __esm(() => {
  init_guard2();
  init_schema();
  init__add_immutable();
});

// node_modules/typebox/build/type/action/_add_readonly.mjs
function AddReadonlyDeferred(type, options = {}) {
  return Deferred("AddReadonly", [type], options);
}
function AddReadonly(type, options = {}) {
  return AddReadonlyAction(type, options);
}
var init__add_readonly = __esm(() => {
  init_deferred();
  init_instantiate_add();
});

// node_modules/typebox/build/type/types/_readonly.mjs
function Readonly(type) {
  return AddReadonly(type);
}
function IsReadonly(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "~readonly");
}
var init__readonly = __esm(() => {
  init_guard2();
  init_schema();
  init__add_readonly();
});

// node_modules/typebox/build/type/types/_refine.mjs
function RefineAdd(type, refinement) {
  const refinements = IsRefine(type) ? [...type["~refine"], refinement] : [refinement];
  return exports_memory.Update(type, { "~refine": refinements }, {});
}
function Refine(...args) {
  const [type, check, error] = exports_arguments.Match(args, {
    3: (type2, check2, error2) => [type2, check2, error2],
    2: (type2, check2) => [type2, check2, () => "Refine Error"]
  });
  return RefineAdd(type, { check, error });
}
function IsRefinement(value) {
  return exports_guard.IsObjectNotArray(value) && exports_guard.HasPropertyKey(value, "check") && exports_guard.HasPropertyKey(value, "error") && exports_guard.IsFunction(value.check) && exports_guard.IsFunction(value.error);
}
function IsRefine(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "~refine") && exports_guard.IsArray(value["~refine"]) && exports_guard.Every(value["~refine"], 0, (value2) => IsRefinement(value2));
}
var init__refine = __esm(() => {
  init_arguments();
  init_memory2();
  init_guard2();
  init_schema();
});

// node_modules/typebox/build/type/types/bigint.mjs
function BigInt2(options) {
  return exports_memory.Create({ "~kind": "BigInt" }, { type: "bigint" }, options);
}
function IsBigInt2(value) {
  return IsKind(value, "BigInt");
}
var BigIntPattern = "-?(?:0|[1-9][0-9]*)n";
var init_bigint = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/boolean.mjs
function Boolean2(options) {
  return exports_memory.Create({ "~kind": "Boolean" }, { type: "boolean" }, options);
}
function IsBoolean3(value) {
  return IsKind(value, "Boolean");
}
var init_boolean = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/identifier.mjs
function Identifier(name) {
  return exports_memory.Create({ "~kind": "Identifier" }, { name });
}
function IsIdentifier(value) {
  return IsKind(value, "Identifier");
}
var init_identifier = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/integer.mjs
function Integer(options) {
  return exports_memory.Create({ "~kind": "Integer" }, { type: "integer" }, options);
}
function IsInteger2(value) {
  return IsKind(value, "Integer");
}
var IntegerPattern = "-?(?:0|[1-9][0-9]*)";
var init_integer = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/literal.mjs
function LiteralTypeName(value) {
  return exports_guard.IsBigInt(value) ? "bigint" : exports_guard.IsBoolean(value) ? "boolean" : exports_guard.IsNumber(value) ? "number" : exports_guard.IsString(value) ? "string" : (() => {
    throw new InvalidLiteralValue(value);
  })();
}
function Literal(value, options) {
  return exports_memory.Create({ "~kind": "Literal" }, { type: LiteralTypeName(value), const: value }, options);
}
function IsLiteralValue(value) {
  return exports_guard.IsBigInt(value) || exports_guard.IsBoolean(value) || exports_guard.IsNumber(value) || exports_guard.IsString(value);
}
function IsLiteralBigInt(value) {
  return IsLiteral(value) && exports_guard.IsBigInt(value.const);
}
function IsLiteralBoolean(value) {
  return IsLiteral(value) && exports_guard.IsBoolean(value.const);
}
function IsLiteralNumber(value) {
  return IsLiteral(value) && exports_guard.IsNumber(value.const);
}
function IsLiteralString(value) {
  return IsLiteral(value) && exports_guard.IsString(value.const);
}
function IsLiteral(value) {
  return IsKind(value, "Literal");
}
var InvalidLiteralValue;
var init_literal = __esm(() => {
  init_memory2();
  init_guard2();
  init_schema();
  InvalidLiteralValue = class InvalidLiteralValue extends Error {
    constructor(value) {
      super(`Invalid Literal value`);
      Object.defineProperty(this, "cause", {
        value: { value },
        writable: false,
        configurable: false,
        enumerable: false
      });
    }
  };
});

// node_modules/typebox/build/type/types/null.mjs
function Null(options) {
  return exports_memory.Create({ "~kind": "Null" }, { type: "null" }, options);
}
function IsNull2(value) {
  return IsKind(value, "Null");
}
var init_null = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/number.mjs
function Number2(options) {
  return exports_memory.Create({ "~kind": "Number" }, { type: "number" }, options);
}
function IsNumber3(value) {
  return IsKind(value, "Number");
}
var NumberPattern = "-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?";
var init_number = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/symbol.mjs
function Symbol2(options) {
  return exports_memory.Create({ "~kind": "Symbol" }, { type: "symbol" }, options);
}
function IsSymbol2(value) {
  return IsKind(value, "Symbol");
}
var init_symbol = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/parameter.mjs
function Parameter(...args) {
  const [name, extends_, equals] = exports_arguments.Match(args, {
    3: (name2, extends_2, equals2) => [name2, extends_2, equals2],
    2: (name2, extends_2) => [name2, extends_2, extends_2],
    1: (name2) => [name2, Unknown(), Unknown()]
  });
  return exports_memory.Create({ "~kind": "Parameter" }, { name, extends: extends_, equals }, {});
}
function IsParameter(value) {
  return IsKind(value, "Parameter");
}
var init_parameter = __esm(() => {
  init_arguments();
  init_memory2();
  init_schema();
  init_unknown();
});

// node_modules/typebox/build/type/types/string.mjs
function String2(options) {
  return exports_memory.Create({ "~kind": "String" }, { type: "string" }, options);
}
function IsString3(value) {
  return IsKind(value, "String");
}
var StringPattern = ".*";
var init_string = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/union.mjs
function Union(anyOf, options = {}) {
  return exports_memory.Create({ "~kind": "Union" }, { anyOf }, options);
}
function IsUnion(value) {
  return IsKind(value, "Union");
}
function UnionOptions(type) {
  return exports_memory.Discard(type, ["~kind", "anyOf"]);
}
var init_union = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/engine/patterns/pattern.mjs
function ParsePatternIntoTypes(pattern) {
  const parsed = Pattern(pattern);
  const result = exports_guard.IsEqual(parsed.length, 2) ? parsed[0] : [];
  return result;
}
var init_pattern = __esm(() => {
  init_guard2();
  init_parser();
});

// node_modules/typebox/build/type/engine/template_literal/is_finite.mjs
function FromLiteral(_value) {
  return true;
}
function FromTypesReduce(types) {
  return exports_guard.ShiftLeft(types, (left, right) => FromType(left) ? FromTypesReduce(right) : false, () => true);
}
function FromTypes(types) {
  const result = exports_guard.IsEqual(types.length, 0) ? false : FromTypesReduce(types);
  return result;
}
function FromType(type) {
  return IsUnion(type) ? FromTypes(type.anyOf) : IsLiteral(type) ? FromLiteral(type.const) : false;
}
function IsTemplateLiteralFinite(types) {
  const result = FromTypes(types);
  return result;
}
var init_is_finite = __esm(() => {
  init_guard2();
  init_literal();
  init_union();
});

// node_modules/typebox/build/type/engine/template_literal/create.mjs
function TemplateLiteralCreate(pattern) {
  return exports_memory.Create({ ["~kind"]: "TemplateLiteral" }, { type: "string", pattern }, {});
}
var init_create2 = __esm(() => {
  init_memory2();
});

// node_modules/typebox/build/type/engine/template_literal/decode.mjs
function FromLiteralPush(variants, value, result = []) {
  return exports_guard.ShiftLeft(variants, (left, right) => FromLiteralPush(right, value, [...result, `${left}${value}`]), () => result);
}
function FromLiteral2(variants, value) {
  return exports_guard.IsEqual(variants.length, 0) ? [`${value}`] : FromLiteralPush(variants, value);
}
function FromUnion(variants, types, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => FromUnion(variants, right, [...result, ...FromType2(variants, left)]), () => result);
}
function FromType2(variants, type) {
  const result = IsUnion(type) ? FromUnion(variants, type.anyOf) : IsLiteral(type) ? FromLiteral2(variants, type.const) : Unreachable();
  return result;
}
function DecodeFromSpan(variants, types) {
  return exports_guard.ShiftLeft(types, (left, right) => DecodeFromSpan(FromType2(variants, left), right), () => variants);
}
function VariantsToLiterals(variants) {
  return variants.map((variant) => Literal(variant));
}
function DecodeTypesAsUnion(types) {
  const variants = DecodeFromSpan([], types);
  const literals = VariantsToLiterals(variants);
  const result = Union(literals);
  return result;
}
function DecodeTypes(types) {
  return exports_guard.IsEqual(types.length, 0) ? Unreachable() : exports_guard.IsEqual(types.length, 1) && IsLiteral(types[0]) ? types[0] : DecodeTypesAsUnion(types);
}
function TemplateLiteralDecodeUnsafe(pattern) {
  const types = ParsePatternIntoTypes(pattern);
  const result = exports_guard.IsEqual(types.length, 0) ? String2() : IsTemplateLiteralFinite(types) ? DecodeTypes(types) : TemplateLiteralCreate(pattern);
  return result;
}
function TemplateLiteralDecode(pattern) {
  const decoded = TemplateLiteralDecodeUnsafe(pattern);
  const result = IsTemplateLiteral(decoded) ? String2() : decoded;
  return result;
}
var init_decode = __esm(() => {
  init_guard2();
  init_unreachable();
  init_literal();
  init_string();
  init_template_literal();
  init_union();
  init_pattern();
  init_is_finite();
  init_create2();
});

// node_modules/typebox/build/type/engine/record/record_create.mjs
function CreateRecord(key, value) {
  const type = "object";
  const patternProperties = { [key]: value };
  return exports_memory.Create({ ["~kind"]: "Record" }, { type, patternProperties });
}
var init_record_create = __esm(() => {
  init_memory2();
});

// node_modules/typebox/build/type/engine/record/from_key_any.mjs
function FromAnyKey(value) {
  return CreateRecord(StringKey, value);
}
var init_from_key_any = __esm(() => {
  init_record();
  init_record_create();
});

// node_modules/typebox/build/type/engine/record/from_key_boolean.mjs
function FromBooleanKey(value) {
  return _Object_({ true: value, false: value });
}
var init_from_key_boolean = __esm(() => {
  init_object();
});

// node_modules/typebox/build/type/types/tuple.mjs
function Tuple(types, options = {}) {
  const [items, minItems, additionalItems] = [types, types.length, false];
  return exports_memory.Create({ ["~kind"]: "Tuple" }, { type: "array", additionalItems, items, minItems }, options);
}
function IsTuple(value) {
  return IsKind(value, "Tuple");
}
function TupleOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "items", "minItems", "additionalItems"]);
}
var init_tuple = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/engine/readonly/instantiate_remove.mjs
function RemoveReadonlyOperation(type) {
  return exports_memory.Discard(type, ["~readonly"]);
}
function RemoveReadonlyAction(type, options) {
  const result = exports_memory.Update(RemoveReadonlyOperation(type), {}, options);
  return result;
}
function RemoveReadonlyInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return RemoveReadonlyAction(instantiatedType, options);
}
var init_instantiate_remove = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/_remove_readonly.mjs
function RemoveReadonlyDeferred(type, options = {}) {
  return Deferred("RemoveReadonly", [type], options);
}
function RemoveReadonly(type, options = {}) {
  return RemoveReadonlyAction(type, options);
}
var init__remove_readonly = __esm(() => {
  init_deferred();
  init_instantiate_remove();
});

// node_modules/typebox/build/type/engine/optional/instantiate_remove.mjs
function RemoveOptionalOperation(type) {
  return exports_memory.Discard(type, ["~optional"]);
}
function RemoveOptionalAction(type, options) {
  const result = exports_memory.Update(RemoveOptionalOperation(type), {}, options);
  return result;
}
function RemoveOptionalInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return RemoveOptionalAction(instantiatedType, options);
}
var init_instantiate_remove2 = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/_remove_optional.mjs
function RemoveOptionalDeferred(type, options = {}) {
  return Deferred("RemoveOptional", [type], options);
}
function RemoveOptional(type, options = {}) {
  return RemoveOptionalAction(type, options);
}
var init__remove_optional = __esm(() => {
  init_deferred();
  init_instantiate_remove2();
});

// node_modules/typebox/build/type/engine/tuple/to_object.mjs
function TupleElementsToProperties(types) {
  const result = types.reduceRight((result2, right, index) => {
    return { [index]: right, ...result2 };
  }, {});
  return result;
}
function TupleToObject(type) {
  const properties = TupleElementsToProperties(type.items);
  const result = _Object_(properties);
  return result;
}
var init_to_object = __esm(() => {
  init_object();
});

// node_modules/typebox/build/type/engine/evaluate/composite.mjs
function IsReadonlyProperty(left, right) {
  return IsReadonly(left) ? IsReadonly(right) ? true : false : false;
}
function IsOptionalProperty(left, right) {
  return IsOptional(left) ? IsOptional(right) ? true : false : false;
}
function CompositeProperty(left, right) {
  const isReadonly = IsReadonlyProperty(left, right);
  const isOptional = IsOptionalProperty(left, right);
  const evaluated = EvaluateIntersect([left, right]);
  const property = RemoveReadonly(RemoveOptional(evaluated));
  return isReadonly && isOptional ? AddReadonly(AddOptional(property)) : isReadonly && !isOptional ? AddReadonly(property) : !isReadonly && isOptional ? AddOptional(property) : property;
}
function CompositePropertyKey(left, right, key) {
  return key in left ? key in right ? CompositeProperty(left[key], right[key]) : left[key] : (key in right) ? right[key] : Never();
}
function CompositeProperties(left, right) {
  const keys = new Set([...exports_guard.Keys(right), ...exports_guard.Keys(left)]);
  return [...keys].reduce((result, key) => {
    return { ...result, [key]: CompositePropertyKey(left, right, key) };
  }, {});
}
function GetProperties(type) {
  const result = IsObject2(type) ? type.properties : IsTuple(type) ? TupleElementsToProperties(type.items) : Unreachable();
  return result;
}
function Composite(left, right) {
  const leftProperties = GetProperties(left);
  const rightProperties = GetProperties(right);
  const properties = CompositeProperties(leftProperties, rightProperties);
  return _Object_(properties);
}
var init_composite = __esm(() => {
  init_unreachable();
  init_guard2();
  init__readonly();
  init__optional();
  init_object();
  init_never();
  init_tuple();
  init__add_readonly();
  init__add_optional();
  init__remove_readonly();
  init__remove_optional();
  init_to_object();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/evaluate/narrow.mjs
function Narrow(left, right) {
  const result = Compare(left, right);
  return exports_guard.IsEqual(result, ResultLeftInside) ? left : exports_guard.IsEqual(result, ResultRightInside) ? right : exports_guard.IsEqual(result, ResultEqual) ? right : Never();
}
var init_narrow = __esm(() => {
  init_guard2();
  init_never();
  init_compare();
});

// node_modules/typebox/build/type/engine/evaluate/distribute.mjs
function IsObjectLike(type) {
  return IsObject2(type) || IsTuple(type);
}
function IsUnionOperand(left, right) {
  const isUnionLeft = IsUnion(left);
  const isUnionRight = IsUnion(right);
  const result = isUnionLeft || isUnionRight;
  return result;
}
function DistributeOperation(left, right) {
  const evaluatedLeft = EvaluateType(left);
  const evaluatedRight = EvaluateType(right);
  const isUnionOperand = IsUnionOperand(evaluatedLeft, evaluatedRight);
  const isObjectLeft = IsObjectLike(evaluatedLeft);
  const IsObjectRight = IsObjectLike(evaluatedRight);
  const result = isUnionOperand ? EvaluateIntersect([evaluatedLeft, evaluatedRight]) : isObjectLeft && IsObjectRight ? Composite(evaluatedLeft, evaluatedRight) : isObjectLeft && !IsObjectRight ? evaluatedLeft : !isObjectLeft && IsObjectRight ? evaluatedRight : Narrow(evaluatedLeft, evaluatedRight);
  return result;
}
function DistributeType(type, types, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => DistributeType(type, right, [...result, DistributeOperation(type, left)]), () => exports_guard.IsEqual(result.length, 0) ? [type] : result);
}
function DistributeUnion(types, distribution, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => DistributeUnion(right, distribution, [...result, ...Distribute([left], distribution)]), () => result);
}
function Distribute(types, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => IsUnion(left) ? Distribute(right, DistributeUnion(left.anyOf, result)) : Distribute(right, DistributeType(left, result)), () => result);
}
var init_distribute = __esm(() => {
  init_guard2();
  init_union();
  init_object();
  init_tuple();
  init_composite();
  init_narrow();
  init_evaluate2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/exclude/operation.mjs
function ExcludeType(left, right) {
  const check = Extends({}, left, right);
  const result = exports_result.IsExtendsTrueLike(check) ? [] : [left];
  return result;
}
function ExcludeUnion(types, right) {
  return types.reduce((result, head) => {
    return [...result, ...ExcludeType(head, right)];
  }, []);
}
function ExcludeOperation(left, right) {
  const evaluated = EvaluateType(left);
  const canonical = IsUnion(evaluated) ? evaluated.anyOf : [evaluated];
  const remaining = ExcludeUnion(canonical, right);
  const result = EvaluateUnion(remaining);
  return result;
}
var init_operation = __esm(() => {
  init_union();
  init_extends3();
  init_evaluate2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/evaluate/evaluate.mjs
function EvaluateDependent(if_, then_, else_) {
  const intersect = Intersect([if_, then_]);
  const excluded = ExcludeOperation(else_, if_);
  const result = EvaluateUnion([intersect, excluded]);
  return result;
}
function EvaluateEnum(values) {
  const result = values.map((value) => Literal(value));
  return EvaluateUnion(result);
}
function EvaluateIntersect(types) {
  const distribution = Distribute(types);
  const broadend = Broaden(distribution);
  const result = EvaluateUnionFast(broadend);
  return result;
}
function EvaluateTemplateLiteral(pattern) {
  const evaluated = TemplateLiteralDecode(pattern);
  const result = EvaluateType(evaluated);
  return result;
}
function EvaluateUnion(types) {
  const broadend = Broaden(types);
  const result = EvaluateUnionFast(broadend);
  return result;
}
function EvaluateType(type) {
  return IsDependent(type) ? EvaluateDependent(type.if, type.then, type.else) : IsEnum(type) ? EvaluateEnum(type.enum) : IsIntersect(type) ? EvaluateIntersect(type.allOf) : IsTemplateLiteral(type) ? EvaluateTemplateLiteral(type.pattern) : IsUnion(type) ? EvaluateUnion(type.anyOf) : type;
}
function EvaluateUnionFast(types) {
  const result = exports_guard.IsEqual(types.length, 1) ? types[0] : exports_guard.IsEqual(types.length, 0) ? Never() : Union(types);
  return result;
}
var init_evaluate2 = __esm(() => {
  init_guard2();
  init_dependent();
  init_enum();
  init_literal();
  init_intersect();
  init_never();
  init_template_literal();
  init_union();
  init_distribute();
  init_broaden();
  init_operation();
  init_decode();
});

// node_modules/typebox/build/type/engine/record/from_key_enum.mjs
function FromEnumKey(values, value) {
  const unionKey = EvaluateEnum(values);
  const result = FromKey(unionKey, value);
  return result;
}
var init_from_key_enum = __esm(() => {
  init_from_key();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/record/from_key_integer.mjs
function FromIntegerKey(_key, value) {
  const result = CreateRecord(IntegerKey, value);
  return result;
}
var init_from_key_integer = __esm(() => {
  init_record();
  init_record_create();
});

// node_modules/typebox/build/type/engine/record/from_key_intersect.mjs
function FromIntersectKey(types, value) {
  const evaluatedKey = EvaluateIntersect(types);
  const result = FromKey(evaluatedKey, value);
  return result;
}
var init_from_key_intersect = __esm(() => {
  init_evaluate2();
  init_from_key();
});

// node_modules/typebox/build/type/engine/record/from_key_literal.mjs
function FromLiteralKey(key, value) {
  return exports_guard.IsString(key) || exports_guard.IsNumber(key) ? _Object_({ [key]: value }) : exports_guard.IsEqual(key, false) ? _Object_({ false: value }) : exports_guard.IsEqual(key, true) ? _Object_({ true: value }) : _Object_({});
}
var init_from_key_literal = __esm(() => {
  init_guard2();
  init_object();
});

// node_modules/typebox/build/type/engine/record/from_key_number.mjs
function FromNumberKey(_key, value) {
  const result = CreateRecord(NumberKey, value);
  return result;
}
var init_from_key_number = __esm(() => {
  init_record();
  init_record_create();
});

// node_modules/typebox/build/type/engine/record/from_key_string.mjs
function FromStringKey(key, value) {
  return exports_guard.HasPropertyKey(key, "pattern") && (exports_guard.IsString(key.pattern) || key.pattern instanceof RegExp) ? CreateRecord(key.pattern.toString(), value) : CreateRecord(StringKey, value);
}
var init_from_key_string = __esm(() => {
  init_guard2();
  init_record();
  init_record_create();
});

// node_modules/typebox/build/type/engine/record/from_key_template_literal.mjs
function FromTemplateKey(pattern, value) {
  const types = ParsePatternIntoTypes(pattern);
  const finite = IsTemplateLiteralFinite(types);
  const result = finite ? FromKey(EvaluateTemplateLiteral(pattern), value) : CreateRecord(pattern, value);
  return result;
}
var init_from_key_template_literal = __esm(() => {
  init_from_key();
  init_pattern();
  init_is_finite();
  init_evaluate2();
  init_record_create();
});

// node_modules/typebox/build/type/engine/evaluate/flatten.mjs
function FlattenType(type) {
  const result = IsUnion(type) ? Flatten(type.anyOf) : [type];
  return result;
}
function Flatten(types) {
  return types.reduce((result, type) => {
    return [...result, ...FlattenType(type)];
  }, []);
}
var init_flatten = __esm(() => {
  init_union();
});

// node_modules/typebox/build/type/engine/record/from_key_union.mjs
function StringOrNumberCheck(types) {
  return types.some((type) => IsString3(type) || IsNumber3(type) || IsInteger2(type));
}
function TryBuildRecord(types, value) {
  return exports_guard.IsEqual(StringOrNumberCheck(types), true) ? CreateRecord(StringKey, value) : undefined;
}
function CreateProperties(types, value) {
  return types.reduce((result, left) => {
    return IsLiteral(left) && (exports_guard.IsString(left.const) || exports_guard.IsNumber(left.const)) ? { ...result, [left.const]: value } : result;
  }, {});
}
function CreateObject(types, value) {
  const properties = CreateProperties(types, value);
  const result = _Object_(properties);
  return result;
}
function FromUnionKey(types, value) {
  const flattened = Flatten(types);
  const record = TryBuildRecord(flattened, value);
  return IsSchema(record) ? record : CreateObject(flattened, value);
}
var init_from_key_union = __esm(() => {
  init_guard2();
  init_schema();
  init_literal();
  init_number();
  init_integer();
  init_object();
  init_string();
  init_record();
  init_flatten();
  init_record_create();
});

// node_modules/typebox/build/type/engine/record/from_key.mjs
function FromKey(key, value) {
  const result = IsAny(key) ? FromAnyKey(value) : IsBoolean3(key) ? FromBooleanKey(value) : IsEnum(key) ? FromEnumKey(key.enum, value) : IsInteger2(key) ? FromIntegerKey(key, value) : IsIntersect(key) ? FromIntersectKey(key.allOf, value) : IsLiteral(key) ? FromLiteralKey(key.const, value) : IsNumber3(key) ? FromNumberKey(key, value) : IsUnion(key) ? FromUnionKey(key.anyOf, value) : IsString3(key) ? FromStringKey(key, value) : IsTemplateLiteral(key) ? FromTemplateKey(key.pattern, value) : _Object_({});
  return result;
}
var init_from_key = __esm(() => {
  init_any();
  init_boolean();
  init_enum();
  init_intersect();
  init_integer();
  init_literal();
  init_number();
  init_object();
  init_string();
  init_template_literal();
  init_union();
  init_from_key_any();
  init_from_key_boolean();
  init_from_key_enum();
  init_from_key_integer();
  init_from_key_intersect();
  init_from_key_literal();
  init_from_key_number();
  init_from_key_string();
  init_from_key_template_literal();
  init_from_key_union();
});

// node_modules/typebox/build/type/engine/record/instantiate.mjs
function RecordAction(key, value, options) {
  const result = CanInstantiate([key]) ? exports_memory.Update(FromKey(key, value), {}, options) : RecordDeferred(key, value, options);
  return result;
}
function RecordInstantiate(context, state, key, value, options) {
  const instantiatedKey = InstantiateType(context, state, key);
  const instantiatedValue = InstantiateType(context, state, value);
  return RecordAction(instantiatedKey, instantiatedValue, options);
}
var init_instantiate = __esm(() => {
  init_memory2();
  init_record();
  init_from_key();
  init_instantiate27();
});

// node_modules/typebox/build/type/types/record.mjs
function RecordDeferred(key, value, options = {}) {
  return Deferred("Record", [key, value], options);
}
function Record(key, value, options = {}) {
  return RecordAction(key, value, options);
}
function RecordFromPattern(pattern, value) {
  return CreateRecord(pattern, value);
}
function RecordPatternToType(pattern) {
  const result = exports_guard.IsEqual(pattern, StringKey) ? String2() : exports_guard.IsEqual(pattern, IntegerKey) ? Integer() : exports_guard.IsEqual(pattern, NumberKey) ? Number2() : TemplateLiteralDecodeUnsafe(pattern);
  return result;
}
function RecordPattern(type) {
  return exports_guard.Keys(type.patternProperties)[0];
}
function RecordKey(type) {
  const pattern = RecordPattern(type);
  const result = RecordPatternToType(pattern);
  return result;
}
function RecordValue(type) {
  return type.patternProperties[RecordPattern(type)];
}
function IsRecord(value) {
  return IsKind(value, "Record");
}
function RecordOptions(type) {
  return exports_memory.Discard(type, ["~kind", "type", "patternProperties"]);
}
var IntegerKey, NumberKey, StringKey;
var init_record = __esm(() => {
  init_memory2();
  init_guard2();
  init_schema();
  init_integer();
  init_number();
  init_string();
  init_deferred();
  init_decode();
  init_record_create();
  init_instantiate();
  IntegerKey = `^${IntegerPattern}$`;
  NumberKey = `^${NumberPattern}$`;
  StringKey = `^${StringPattern}$`;
});

// node_modules/typebox/build/type/types/rest.mjs
function Rest(type) {
  return exports_memory.Create({ "~kind": "Rest" }, { type: "rest", items: type }, {});
}
function IsRest(value) {
  return IsKind(value, "Rest");
}
var init_rest = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/static.mjs
var init_static = () => {};

// node_modules/typebox/build/type/types/this.mjs
function This(options) {
  return exports_memory.Create({ ["~kind"]: "This" }, { $ref: "#" }, options);
}
function IsThis(value) {
  return IsKind(value, "This");
}
var init_this = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/undefined.mjs
function Undefined(options) {
  return exports_memory.Create({ "~kind": "Undefined" }, { type: "undefined" }, options);
}
function IsUndefined2(value) {
  return IsKind(value, "Undefined");
}
var init_undefined = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/void.mjs
function Void(options) {
  return exports_memory.Create({ "~kind": "Void" }, { type: "void" }, options);
}
function IsVoid(value) {
  return IsKind(value, "Void");
}
var init_void = __esm(() => {
  init_memory2();
  init_schema();
});

// node_modules/typebox/build/type/types/index.mjs
var init_types = __esm(() => {
  init__codec();
  init__immutable();
  init__optional();
  init__readonly();
  init__refine();
  init_any();
  init_array();
  init_bigint();
  init_boolean();
  init_call();
  init_constructor();
  init_cyclic();
  init_deferred();
  init_enum();
  init_function();
  init_generic();
  init_identifier();
  init_dependent();
  init_infer();
  init_integer();
  init_intersect();
  init_literal();
  init_never();
  init_null();
  init_number();
  init_unknown();
  init_symbol();
  init_object();
  init_parameter();
  init_properties();
  init_record();
  init_ref();
  init_rest();
  init_schema();
  init_static();
  init_string();
  init_symbol();
  init_template_literal();
  init_this();
  init_tuple();
  init_undefined();
  init_union();
  init_unknown();
  init_unsafe();
  init_void();
});

// node_modules/typebox/build/type/script/mapping.mjs
function IntrinsicOrCall(ref2, parameters) {
  return exports_guard.IsEqual(ref2, "Array") ? _Array_(parameters[0]) : exports_guard.IsEqual(ref2, "Capitalize") ? CapitalizeDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "ConstructorParameters") ? ConstructorParametersDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Evaluate") ? EvaluateDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Exclude") ? ExcludeDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "Extract") ? ExtractDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "Index") ? IndexDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "InstanceType") ? InstanceTypeDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Lowercase") ? LowercaseDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "NonNullable") ? NonNullableDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Omit") ? OmitDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "Parameters") ? ParametersDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Partial") ? PartialDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Pick") ? PickDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "Readonly") ? ReadonlyObjectDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "KeyOf") ? KeyOfDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Record") ? RecordDeferred(parameters[0], parameters[1]) : exports_guard.IsEqual(ref2, "Required") ? RequiredDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "ReturnType") ? ReturnTypeDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Uncapitalize") ? UncapitalizeDeferred(parameters[0]) : exports_guard.IsEqual(ref2, "Uppercase") ? UppercaseDeferred(parameters[0]) : CallConstruct(Ref(ref2), parameters);
}
function Unreachable2() {
  throw Error("Unreachable");
}
function GenericParameterExtendsEqualsMapping(input) {
  return Parameter(input[0], input[2], input[4]);
}
function GenericParameterExtendsMapping(input) {
  return Parameter(input[0], input[2], input[2]);
}
function GenericParameterEqualsMapping(input) {
  return Parameter(input[0], Unknown(), input[2]);
}
function GenericParameterIdentifierMapping(input) {
  return Parameter(input, Unknown(), Unknown());
}
function GenericParameterMapping(input) {
  return input;
}
function GenericParameterListMapping(input) {
  return Delimited(input);
}
function GenericParametersMapping(input) {
  return input[1];
}
function GenericCallArgumentListMapping(input) {
  return Delimited(input);
}
function GenericCallArgumentsMapping(input) {
  return input[1];
}
function GenericCallMapping(input) {
  return IntrinsicOrCall(input[0], input[1]);
}
function OptionalSemiColonMapping(input) {
  return null;
}
function KeywordStringMapping(input) {
  return String2();
}
function KeywordNumberMapping(input) {
  return Number2();
}
function KeywordBooleanMapping(input) {
  return Boolean2();
}
function KeywordUndefinedMapping(input) {
  return Undefined();
}
function KeywordNullMapping(input) {
  return Null();
}
function KeywordIntegerMapping(input) {
  return Integer();
}
function KeywordBigIntMapping(input) {
  return BigInt2();
}
function KeywordUnknownMapping(input) {
  return Unknown();
}
function KeywordAnyMapping(input) {
  return Any();
}
function KeywordObjectMapping(input) {
  return _Object_({});
}
function KeywordNeverMapping(input) {
  return Never();
}
function KeywordSymbolMapping(input) {
  return Symbol2();
}
function KeywordVoidMapping(input) {
  return Void();
}
function KeywordThisMapping(input) {
  return This();
}
function LiteralBigIntMapping(input) {
  return Literal(BigInt(input));
}
function LiteralBooleanMapping(input) {
  return Literal(exports_guard.IsEqual(input, "true"));
}
function LiteralNumberMapping(input) {
  return Literal(parseFloat(input));
}
function LiteralStringMapping(input) {
  return Literal(input);
}
function TemplateInterpolateMapping(input) {
  return input[1];
}
function TemplateSpanMapping(input) {
  return Literal(input);
}
function TemplateBodyMapping(input) {
  return exports_guard.IsEqual(input.length, 3) ? [input[0], input[1], ...input[2]] : [input[0]];
}
function TemplateLiteralTypesMapping(input) {
  return input[1];
}
function TemplateLiteralMapping(input) {
  return TemplateLiteralDeferred(input);
}
function DependentMapping(input) {
  return exports_guard.IsEqual(input.length, 6) ? Dependent(input[1], input[3], input[5]) : Dependent(input[1], input[3], Unknown());
}
function KeyOfMapping(input) {
  return input.length > 0;
}
function IndexArrayMapping(input) {
  return input.reduce((result, current) => {
    return exports_guard.IsEqual(current.length, 3) ? [...result, [current[1]]] : [...result, []];
  }, []);
}
function ExtendsMapping(input) {
  return exports_guard.IsEqual(input.length, 6) ? [input[1], input[3], input[5]] : [];
}
function BaseMapping(input) {
  return exports_guard.IsArray(input) && exports_guard.IsEqual(input.length, 3) ? input[1] : input;
}
function WithMapping(input) {
  return exports_guard.IsEqual(input.length, 2) ? input[1] : [];
}
function FactorIndexArray(Type, indexArray) {
  return indexArray.reduce((result, left) => {
    const _left = left;
    return exports_guard.IsEqual(_left.length, 1) ? IndexDeferred(result, _left[0]) : exports_guard.IsEqual(_left.length, 0) ? _Array_(result) : Unreachable2();
  }, Type);
}
function FactorExtends(type, extend) {
  return exports_guard.IsEqual(extend.length, 3) ? ConditionalDeferred(type, extend[0], extend[1], extend[2]) : type;
}
function FactorWith(type, withClause) {
  return exports_guard.IsArray(withClause) && exports_guard.IsEqual(withClause.length, 0) ? type : WithDeferred(type, withClause);
}
function FactorMapping(input) {
  const [keyOf, type, indexArray, extend, withClause] = input;
  return FactorWith(keyOf ? FactorExtends(KeyOfDeferred(FactorIndexArray(type, indexArray)), extend) : FactorExtends(FactorIndexArray(type, indexArray), extend), withClause);
}
function ExprBinaryMapping(left, rest2) {
  return exports_guard.IsEqual(rest2.length, 3) ? (() => {
    const [operator, right, next] = rest2;
    const Schema = ExprBinaryMapping(right, next);
    if (exports_guard.IsEqual(operator, "&")) {
      return IsIntersect(Schema) ? Intersect([left, ...Schema.allOf]) : Intersect([left, Schema]);
    }
    if (exports_guard.IsEqual(operator, "|")) {
      return IsUnion(Schema) ? Union([left, ...Schema.anyOf]) : Union([left, Schema]);
    }
    Unreachable2();
  })() : left;
}
function ExprTermTailMapping(input) {
  return input;
}
function ExprTermMapping(input) {
  const [left, rest2] = input;
  return ExprBinaryMapping(left, rest2);
}
function ExprTailMapping(input) {
  return input;
}
function ExprMapping(input) {
  const [left, rest2] = input;
  return ExprBinaryMapping(left, rest2);
}
function ExprReadonlyMapping(input) {
  return AddImmutableDeferred(input[1]);
}
function ExprPipeMapping(input) {
  return input[1];
}
function GenericTypeMapping(input) {
  return Generic(input[0], input[2]);
}
function InferTypeMapping(input) {
  return exports_guard.IsEqual(input.length, 4) ? Infer(input[1], input[3]) : exports_guard.IsEqual(input.length, 2) ? Infer(input[1], Unknown()) : Unreachable2();
}
function TypeMapping(input) {
  return input;
}
function PropertyKeyNumberMapping(input) {
  return `${input}`;
}
function PropertyKeyIdentMapping(input) {
  return input;
}
function PropertyKeyQuotedMapping(input) {
  return input;
}
function PropertyKeyIndexMapping(input) {
  return IsInteger2(input[3]) ? IntegerKey : IsNumber3(input[3]) ? NumberKey : IsSymbol2(input[3]) ? StringKey : IsString3(input[3]) ? StringKey : Unreachable2();
}
function PropertyKeyMapping(input) {
  return input;
}
function ReadonlyMapping(input) {
  return input.length > 0;
}
function OptionalMapping(input) {
  return input.length > 0;
}
function PropertyMapping(input) {
  const [isReadonly, key, isOptional, _colon, type] = input;
  return {
    [key]: isReadonly && isOptional ? AddReadonlyDeferred(AddOptionalDeferred(type)) : isReadonly && !isOptional ? AddReadonlyDeferred(type) : !isReadonly && isOptional ? AddOptionalDeferred(type) : type
  };
}
function PropertyDelimiterMapping(input) {
  return input;
}
function PropertyListMapping(input) {
  return Delimited(input);
}
function PropertiesReduce(propertyList) {
  return propertyList.reduce((result, left) => {
    const isPatternProperties = exports_guard.HasPropertyKey(left, IntegerKey) || exports_guard.HasPropertyKey(left, NumberKey) || exports_guard.HasPropertyKey(left, StringKey);
    return isPatternProperties ? [result[0], exports_memory.Assign(result[1], left)] : [exports_memory.Assign(result[0], left), result[1]];
  }, [{}, {}]);
}
function PropertiesMapping(input) {
  return PropertiesReduce(input[1]);
}
function _Object_Mapping(input) {
  const [properties2, patternProperties] = input;
  const options = exports_guard.IsEqual(exports_guard.Keys(patternProperties).length, 0) ? {} : { patternProperties };
  return _Object_(properties2, options);
}
function ElementNamedMapping(input) {
  return exports_guard.IsEqual(input.length, 5) ? AddReadonlyDeferred(AddOptionalDeferred(input[4])) : exports_guard.IsEqual(input.length, 3) ? input[2] : exports_guard.IsEqual(input.length, 4) ? exports_guard.IsEqual(input[2], "readonly") ? AddReadonlyDeferred(input[3]) : AddOptionalDeferred(input[3]) : Unreachable2();
}
function ElementReadonlyOptionalMapping(input) {
  return AddReadonlyDeferred(AddOptionalDeferred(input[1]));
}
function ElementReadonlyMapping(input) {
  return AddReadonlyDeferred(input[1]);
}
function ElementOptionalMapping(input) {
  return AddOptionalDeferred(input[0]);
}
function ElementBaseMapping(input) {
  return input;
}
function ElementMapping(input) {
  return exports_guard.IsEqual(input.length, 2) ? Rest(input[1]) : exports_guard.IsEqual(input.length, 1) ? input[0] : Unreachable2();
}
function ElementListMapping(input) {
  return Delimited(input);
}
function _Tuple_Mapping(input) {
  return Tuple(input[1]);
}
function ParameterReadonlyOptionalMapping(input) {
  return AddReadonlyDeferred(AddOptionalDeferred(input[4]));
}
function ParameterReadonlyMapping(input) {
  return AddReadonlyDeferred(input[3]);
}
function ParameterOptionalMapping(input) {
  return AddOptionalDeferred(input[3]);
}
function ParameterTypeMapping(input) {
  return input[2];
}
function ParameterBaseMapping(input) {
  return input;
}
function ParameterMapping(input) {
  return exports_guard.IsEqual(input.length, 2) ? Rest(input[1]) : exports_guard.IsEqual(input.length, 1) ? input[0] : Unreachable2();
}
function ParameterListMapping(input) {
  return Delimited(input);
}
function _Function_Mapping(input) {
  return _Function_(input[1], input[4]);
}
function _Constructor_Mapping(input) {
  return Constructor(input[2], input[5]);
}
function ApplyReadonly(state, type) {
  return exports_guard.IsEqual(state, "remove") ? RemoveReadonlyDeferred(type) : exports_guard.IsEqual(state, "add") ? AddReadonlyDeferred(type) : type;
}
function MappedReadonlyMapping(input) {
  return exports_guard.IsEqual(input.length, 2) && exports_guard.IsEqual(input[0], "-") ? "remove" : exports_guard.IsEqual(input.length, 2) && exports_guard.IsEqual(input[0], "+") ? "add" : exports_guard.IsEqual(input.length, 1) ? "add" : "none";
}
function ApplyOptional(state, type) {
  return exports_guard.IsEqual(state, "remove") ? RemoveOptionalDeferred(type) : exports_guard.IsEqual(state, "add") ? AddOptionalDeferred(type) : type;
}
function MappedOptionalMapping(input) {
  return exports_guard.IsEqual(input.length, 2) && exports_guard.IsEqual(input[0], "-") ? "remove" : exports_guard.IsEqual(input.length, 2) && exports_guard.IsEqual(input[0], "+") ? "add" : exports_guard.IsEqual(input.length, 1) ? "add" : "none";
}
function MappedAsMapping(input) {
  return exports_guard.IsEqual(input.length, 2) ? [input[1]] : [];
}
function _Mapped_Mapping(input) {
  return exports_guard.IsArray(input[6]) && exports_guard.IsEqual(input[6].length, 1) ? MappedDeferred(Identifier(input[3]), input[5], input[6][0], ApplyReadonly(input[1], ApplyOptional(input[8], input[10]))) : MappedDeferred(Identifier(input[3]), input[5], Ref(input[3]), ApplyReadonly(input[1], ApplyOptional(input[8], input[10])));
}
function ReferenceMapping(input) {
  return Ref(input);
}
function WithBigIntMapping(input) {
  return BigInt(input);
}
function WithNumberMapping(input) {
  return parseFloat(input);
}
function WithBooleanMapping(input) {
  return exports_guard.IsEqual(input, "true");
}
function WithStringMapping(input) {
  return input;
}
function WithNullMapping(input) {
  return null;
}
function WithUndefinedMapping(input) {
  return;
}
function WithPropertyMapping(input) {
  return { [input[0]]: input[2] };
}
function WithPropertyListMapping(input) {
  return Delimited(input);
}
function WithObjectMappingReduce(propertyList) {
  return propertyList.reduce((result, left) => {
    return exports_memory.Assign(result, left);
  }, {});
}
function WithObjectMapping(input) {
  return WithObjectMappingReduce(input[1]);
}
function WithElementListMapping(input) {
  return Delimited(input);
}
function WithArrayMapping(input) {
  return input[1];
}
function WithValueMapping(input) {
  return input;
}
function PatternBigIntMapping(input) {
  return BigInt2();
}
function PatternStringMapping(input) {
  return String2();
}
function PatternNumberMapping(input) {
  return Number2();
}
function PatternIntegerMapping(input) {
  return Integer();
}
function PatternNeverMapping(input) {
  return Never();
}
function PatternTextMapping(input) {
  return Literal(input);
}
function PatternBaseMapping(input) {
  return input;
}
function PatternGroupMapping(input) {
  return Union(input[1]);
}
function PatternUnionMapping(input) {
  return input.length === 3 ? [...input[0], ...input[2]] : input.length === 1 ? [...input[0]] : [];
}
function PatternTermMapping(input) {
  return [input[0], ...input[1]];
}
function PatternBodyMapping(input) {
  return input;
}
function PatternMapping(input) {
  return input[1];
}
function InterfaceDeclarationHeritageListMapping(input) {
  return Delimited(input);
}
function InterfaceDeclarationHeritageMapping(input) {
  return exports_guard.IsEqual(input.length, 2) ? input[1] : [];
}
function InterfaceDeclarationGenericMapping(input) {
  const parameters = input[2];
  const heritage = input[3];
  const [properties2, patternProperties] = input[4];
  const options = exports_guard.IsEqual(exports_guard.Keys(patternProperties).length, 0) ? {} : { patternProperties };
  return { [input[1]]: Generic(parameters, InterfaceDeferred(heritage, properties2, options)) };
}
function InterfaceDeclarationMapping(input) {
  const heritage = input[2];
  const [properties2, patternProperties] = input[3];
  const options = exports_guard.IsEqual(exports_guard.Keys(patternProperties).length, 0) ? {} : { patternProperties };
  return { [input[1]]: InterfaceDeferred(heritage, properties2, options) };
}
function TypeAliasDeclarationGenericMapping(input) {
  return { [input[1]]: Generic(input[2], input[4]) };
}
function TypeAliasDeclarationMapping(input) {
  return { [input[1]]: input[3] };
}
function ExportKeywordMapping(input) {
  return null;
}
function ModuleDeclarationDelimiterMapping(input) {
  return input;
}
function ModuleDeclarationListMapping(input) {
  return PropertiesReduce(Delimited(input));
}
function ModuleDeclarationMapping(input) {
  return input[1];
}
function ModuleMapping(input) {
  const moduleDeclaration = input[0];
  const moduleDeclarationList = input[1];
  return ModuleDeferred(exports_memory.Assign(moduleDeclaration, moduleDeclarationList[0]));
}
function ScriptMapping(input) {
  return input;
}
var DelimitedDecode = (input, result = []) => {
  return input.reduce((result2, left) => {
    return exports_guard.IsArray(left) && exports_guard.IsEqual(left.length, 2) ? [...result2, left[0]] : [...result2, left];
  }, []);
}, Delimited = (input) => {
  const [left, right] = input;
  return DelimitedDecode([...left, ...right]);
};
var init_mapping = __esm(() => {
  init_memory2();
  init_guard2();
  init_types();
  init_action();
});

// node_modules/typebox/build/type/script/token/internal/guard.mjs
var init_guard3 = __esm(() => {
  init_guard();
});

// node_modules/typebox/build/type/script/token/internal/match.mjs
function IsMatch(value) {
  return IsEqual(value.length, 2);
}
function Match2(input, ok, fail) {
  return IsMatch(input) ? ok(input[0], input[1]) : fail();
}
var init_match = __esm(() => {
  init_guard3();
});

// node_modules/typebox/build/type/script/token/internal/take.mjs
function TakeVariant(variant, input) {
  return IsEqual(input.indexOf(variant), 0) ? [variant, input.slice(variant.length)] : [];
}
function Take(variants, input) {
  for (let i = 0;i < variants.length; i++) {
    const result = TakeVariant(variants[i], input);
    if (IsMatch(result))
      return result;
  }
  return [];
}
var init_take = __esm(() => {
  init_match();
  init_guard3();
});

// node_modules/typebox/build/type/script/token/internal/char.mjs
function Range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
var Alpha, Zero = "0", NonZero, Digit, WhiteSpace = " ", NewLine = `
`, UnderScore = "_", Dot = ".", DollarSign = "$", Hyphen = "-";
var init_char = __esm(() => {
  Alpha = [
    ...Range(97, 122),
    ...Range(65, 90)
  ];
  NonZero = Range(49, 57);
  Digit = [Zero, ...NonZero];
});

// node_modules/typebox/build/type/script/token/internal/trim.mjs
function DiscardMultilineComment(input) {
  const index = input.indexOf(CloseComment);
  const result = IsEqual(index, -1) ? "" : input.slice(index + 2);
  return result;
}
function DiscardLineComment(input) {
  const index = input.indexOf(NewLine);
  const result = IsEqual(index, -1) ? "" : input.slice(index);
  return result;
}
function TrimStartUntilNewline(input) {
  return input.replace(/^[ \t\r\f\v]+/, "");
}
function TrimWhitespace(input) {
  const trimmed = TrimStartUntilNewline(input);
  return trimmed.startsWith(OpenComment) ? TrimWhitespace(DiscardMultilineComment(trimmed.slice(2))) : trimmed.startsWith(LineComment) ? TrimWhitespace(DiscardLineComment(trimmed.slice(2))) : trimmed;
}
function Trim(input) {
  const trimmed = input.trimStart();
  return trimmed.startsWith(OpenComment) ? Trim(DiscardMultilineComment(trimmed.slice(2))) : trimmed.startsWith(LineComment) ? Trim(DiscardLineComment(trimmed.slice(2))) : trimmed;
}
var LineComment = "//", OpenComment = "/*", CloseComment = "*/";
var init_trim = __esm(() => {
  init_guard3();
  init_char();
});

// node_modules/typebox/build/type/script/token/internal/optional.mjs
function Optional2(value, input) {
  return Match2(Take([value], input), (Optional3, Rest2) => [Optional3, Rest2], () => ["", input]);
}
var init_optional = __esm(() => {
  init_match();
  init_take();
});

// node_modules/typebox/build/type/script/token/internal/many.mjs
function IsDiscard(discard2, input) {
  return discard2.includes(input);
}
function Many(allowed, discard2, input, result = "") {
  return Match2(Take(allowed, input), (Char, Rest2) => IsDiscard(discard2, Char) ? Many(allowed, discard2, Rest2, result) : Many(allowed, discard2, Rest2, `${result}${Char}`), () => [result, input]);
}
var init_many = __esm(() => {
  init_match();
  init_take();
});

// node_modules/typebox/build/type/script/token/unsigned_integer.mjs
function TakeNonZero(input) {
  return Take(NonZero, input);
}
function TakeDigits(input) {
  return Many(AllowedDigits, [UnderScore], input);
}
function TakeUnsignedInteger(input) {
  return Match2(Take([Zero], input), (Zero2, ZeroRest) => [Zero2, ZeroRest], () => Match2(TakeNonZero(input), (NonZero2, NonZeroRest) => Match2(TakeDigits(NonZeroRest), (Digits, DigitsRest) => [`${NonZero2}${Digits}`, DigitsRest], () => []), () => []));
}
function UnsignedInteger(input) {
  return TakeUnsignedInteger(Trim(input));
}
var AllowedDigits;
var init_unsigned_integer = __esm(() => {
  init_match();
  init_trim();
  init_take();
  init_many();
  init_char();
  init_char();
  init_char();
  init_char();
  AllowedDigits = [...Digit, UnderScore];
});

// node_modules/typebox/build/type/script/token/integer.mjs
function TakeSign(input) {
  return Optional2(Hyphen, input);
}
function TakeSignedInteger(input) {
  return Match2(TakeSign(input), (Sign, SignRest) => Match2(UnsignedInteger(SignRest), (UnsignedInteger2, UnsignedIntegerRest) => [`${Sign}${UnsignedInteger2}`, UnsignedIntegerRest], () => []), () => []);
}
function Integer2(input) {
  return TakeSignedInteger(Trim(input));
}
var init_integer2 = __esm(() => {
  init_match();
  init_trim();
  init_optional();
  init_char();
  init_unsigned_integer();
});

// node_modules/typebox/build/type/script/token/bigint.mjs
function TakeBigInt(input) {
  return Match2(Integer2(input), (Integer3, IntegerRest) => Match2(Take(["n"], IntegerRest), (_N, NRest) => [`${Integer3}`, NRest], () => []), () => []);
}
function BigInt3(input) {
  return TakeBigInt(input);
}
var init_bigint2 = __esm(() => {
  init_match();
  init_take();
  init_integer2();
});

// node_modules/typebox/build/type/script/token/const.mjs
function TakeConst(const_, input) {
  return Take([const_], input);
}
function Const(const_, input) {
  return IsEqual(const_, "") ? ["", input] : const_.startsWith(NewLine) ? TakeConst(const_, TrimWhitespace(input)) : const_.startsWith(WhiteSpace) ? TakeConst(const_, input) : TakeConst(const_, Trim(input));
}
var init_const = __esm(() => {
  init_guard3();
  init_trim();
  init_trim();
  init_take();
  init_char();
  init_char();
});

// node_modules/typebox/build/type/script/token/ident.mjs
function TakeInitial(input) {
  return Take(Initial, input);
}
function TakeRemaining(input, result = "") {
  return Match2(Take(Remaining, input), (Remaining2, RemainingRest) => TakeRemaining(RemainingRest, `${result}${Remaining2}`), () => [result, input]);
}
function TakeIdent(input) {
  return Match2(TakeInitial(input), (Initial2, InitialRest) => Match2(TakeRemaining(InitialRest), (Remaining2, RemainingRest) => [`${Initial2}${Remaining2}`, RemainingRest], () => []), () => []);
}
function Ident(input) {
  return TakeIdent(Trim(input));
}
var Initial, Remaining;
var init_ident = __esm(() => {
  init_match();
  init_trim();
  init_take();
  init_char();
  init_char();
  init_char();
  init_char();
  Initial = [...Alpha, UnderScore, DollarSign];
  Remaining = [...Initial, ...Digit];
});

// node_modules/typebox/build/type/script/token/unsigned_number.mjs
function IsLeadingDot(input) {
  return IsMatch(Take([Dot], input));
}
function TakeFractional(input) {
  return Match2(Many(AllowedDigits2, [UnderScore], input), (Digits, DigitsRest) => IsEqual(Digits, "") ? [] : [Digits, DigitsRest], () => []);
}
function LeadingDot(input) {
  return Match2(Take([Dot], input), (Dot2, DotRest) => Match2(TakeFractional(DotRest), (Fractional, FractionalRest) => [`0${Dot2}${Fractional}`, FractionalRest], () => []), () => []);
}
function LeadingInteger(input) {
  return Match2(UnsignedInteger(input), (Integer3, IntegerRest) => Match2(Take([Dot], IntegerRest), (Dot2, DotRest) => Match2(TakeFractional(DotRest), (Fractional, FractionalRest) => [`${Integer3}${Dot2}${Fractional}`, FractionalRest], () => [`${Integer3}`, DotRest]), () => [`${Integer3}`, IntegerRest]), () => []);
}
function TakeUnsignedNumber(input) {
  return IsLeadingDot(input) ? LeadingDot(input) : LeadingInteger(input);
}
function UnsignedNumber(input) {
  return TakeUnsignedNumber(Trim(input));
}
var AllowedDigits2;
var init_unsigned_number = __esm(() => {
  init_guard3();
  init_match();
  init_trim();
  init_take();
  init_many();
  init_char();
  init_char();
  init_unsigned_integer();
  AllowedDigits2 = [...Digit, UnderScore];
});

// node_modules/typebox/build/type/script/token/number.mjs
function TakeSign2(input) {
  return Optional2(Hyphen, input);
}
function TakeSignedNumber(input) {
  return Match2(TakeSign2(input), (Sign, SignRest) => Match2(UnsignedNumber(SignRest), (UnsignedInteger2, UnsignedIntegerRest) => [`${Sign}${UnsignedInteger2}`, UnsignedIntegerRest], () => []), () => []);
}
function Number3(input) {
  return TakeSignedNumber(Trim(input));
}
var init_number2 = __esm(() => {
  init_match();
  init_trim();
  init_optional();
  init_char();
  init_unsigned_number();
});

// node_modules/typebox/build/type/script/token/rest.mjs
var init_rest2 = __esm(() => {
  init_guard3();
});

// node_modules/typebox/build/type/script/token/until.mjs
function TakeOne(input) {
  const result = IsEqual(input, "") ? [] : [input.slice(0, 1), input.slice(1)];
  return result;
}
function IsInputMatchSentinal(end, input) {
  return ShiftLeft(end, (left, right) => input.startsWith(left) ? true : IsInputMatchSentinal(right, input), () => false);
}
function Until(end, input, result = "") {
  return Match2(TakeOne(input), (One, Rest2) => IsInputMatchSentinal(end, input) ? [result, input] : Until(end, Rest2, `${result}${One}`), () => []);
}
var init_until = __esm(() => {
  init_match();
  init_guard3();
});

// node_modules/typebox/build/type/script/token/span.mjs
function MultiLine(start, end, input) {
  return Match2(Take([start], input), (_, Rest2) => Match2(Until([end], Rest2), (Until2, UntilRest) => Match2(Take([end], UntilRest), (_2, Rest3) => [`${Until2}`, Rest3], () => []), () => []), () => []);
}
function SingleLine(start, end, input) {
  return Match2(Take([start], input), (_, Rest2) => Match2(Until([NewLine, end], Rest2), (Until2, UntilRest) => Match2(Take([end], UntilRest), (_2, EndRest) => [`${Until2}`, EndRest], () => []), () => []), () => []);
}
function Span(start, end, multiLine, input) {
  return multiLine ? MultiLine(start, end, Trim(input)) : SingleLine(start, end, Trim(input));
}
var init_span = __esm(() => {
  init_match();
  init_trim();
  init_char();
  init_take();
  init_until();
});

// node_modules/typebox/build/type/script/token/string.mjs
function TakeInitial2(quotes, input) {
  return Take(quotes, input);
}
function TakeSpan(quote, input) {
  return Span(quote, quote, false, input);
}
function TakeString(quotes, input) {
  return Match2(TakeInitial2(quotes, input), (Initial2, InitialRest) => TakeSpan(Initial2, `${Initial2}${InitialRest}`), () => []);
}
function String3(quotes, input) {
  return TakeString(quotes, Trim(input));
}
var init_string2 = __esm(() => {
  init_match();
  init_take();
  init_trim();
  init_span();
});

// node_modules/typebox/build/type/script/token/until_1.mjs
function Until_1(end, input) {
  return Match2(Until(end, input), (Until2, UntilRest) => IsEqual(Until2, "") ? [] : [Until2, UntilRest], () => []);
}
var init_until_1 = __esm(() => {
  init_guard3();
  init_match();
  init_until();
});

// node_modules/typebox/build/type/script/token/index.mjs
var init_token = __esm(() => {
  init_bigint2();
  init_const();
  init_ident();
  init_integer2();
  init_number2();
  init_rest2();
  init_span();
  init_string2();
  init_unsigned_integer();
  init_unsigned_number();
  init_until_1();
  init_until();
});

// node_modules/typebox/build/type/script/parser.mjs
var If = (result, left, right = () => []) => result.length === 2 ? left(result) : right(), GenericParameterExtendsEquals = (input) => If(If(Ident(input), ([_0, input2]) => If(Const("extends", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => If(Const("=", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [GenericParameterExtendsEqualsMapping(_0), input2]), GenericParameterExtends = (input) => If(If(Ident(input), ([_0, input2]) => If(Const("extends", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [GenericParameterExtendsMapping(_0), input2]), GenericParameterEquals = (input) => If(If(Ident(input), ([_0, input2]) => If(Const("=", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [GenericParameterEqualsMapping(_0), input2]), GenericParameterIdentifier = (input) => If(Ident(input), ([_0, input2]) => [GenericParameterIdentifierMapping(_0), input2]), GenericParameter = (input) => If(If(GenericParameterExtendsEquals(input), ([_0, input2]) => [_0, input2], () => If(GenericParameterExtends(input), ([_0, input2]) => [_0, input2], () => If(GenericParameterEquals(input), ([_0, input2]) => [_0, input2], () => If(GenericParameterIdentifier(input), ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [GenericParameterMapping(_0), input2]), GenericParameterList_0 = (input, result = []) => If(If(GenericParameter(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => GenericParameterList_0(input2, [...result, _0]), () => [result, input]), GenericParameterList = (input) => If(If(GenericParameterList_0(input), ([_0, input2]) => If(If(If(GenericParameter(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [GenericParameterListMapping(_0), input2]), GenericParameters = (input) => If(If(Const("<", input), ([_0, input2]) => If(GenericParameterList(input2), ([_1, input3]) => If(Const(">", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [GenericParametersMapping(_0), input2]), GenericCallArgumentList_0 = (input, result = []) => If(If(Type(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => GenericCallArgumentList_0(input2, [...result, _0]), () => [result, input]), GenericCallArgumentList = (input) => If(If(GenericCallArgumentList_0(input), ([_0, input2]) => If(If(If(Type(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [GenericCallArgumentListMapping(_0), input2]), GenericCallArguments = (input) => If(If(Const("<", input), ([_0, input2]) => If(GenericCallArgumentList(input2), ([_1, input3]) => If(Const(">", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [GenericCallArgumentsMapping(_0), input2]), GenericCall = (input) => If(If(Ident(input), ([_0, input2]) => If(GenericCallArguments(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [GenericCallMapping(_0), input2]), OptionalSemiColon = (input) => If(If(If(Const(";", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [OptionalSemiColonMapping(_0), input2]), KeywordString = (input) => If(Const("string", input), ([_0, input2]) => [KeywordStringMapping(_0), input2]), KeywordNumber = (input) => If(Const("number", input), ([_0, input2]) => [KeywordNumberMapping(_0), input2]), KeywordBoolean = (input) => If(Const("boolean", input), ([_0, input2]) => [KeywordBooleanMapping(_0), input2]), KeywordUndefined = (input) => If(Const("undefined", input), ([_0, input2]) => [KeywordUndefinedMapping(_0), input2]), KeywordNull = (input) => If(Const("null", input), ([_0, input2]) => [KeywordNullMapping(_0), input2]), KeywordInteger = (input) => If(Const("integer", input), ([_0, input2]) => [KeywordIntegerMapping(_0), input2]), KeywordBigInt = (input) => If(Const("bigint", input), ([_0, input2]) => [KeywordBigIntMapping(_0), input2]), KeywordUnknown = (input) => If(Const("unknown", input), ([_0, input2]) => [KeywordUnknownMapping(_0), input2]), KeywordAny = (input) => If(Const("any", input), ([_0, input2]) => [KeywordAnyMapping(_0), input2]), KeywordObject = (input) => If(Const("object", input), ([_0, input2]) => [KeywordObjectMapping(_0), input2]), KeywordNever = (input) => If(Const("never", input), ([_0, input2]) => [KeywordNeverMapping(_0), input2]), KeywordSymbol = (input) => If(Const("symbol", input), ([_0, input2]) => [KeywordSymbolMapping(_0), input2]), KeywordVoid = (input) => If(Const("void", input), ([_0, input2]) => [KeywordVoidMapping(_0), input2]), KeywordThis = (input) => If(Const("this", input), ([_0, input2]) => [KeywordThisMapping(_0), input2]), TemplateInterpolate = (input) => If(If(Const("${", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("}", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [TemplateInterpolateMapping(_0), input2]), TemplateSpan = (input) => If(Until(["${", "`"], input), ([_0, input2]) => [TemplateSpanMapping(_0), input2]), TemplateBody = (input) => If(If(If(TemplateSpan(input), ([_0, input2]) => If(TemplateInterpolate(input2), ([_1, input3]) => If(TemplateBody(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If(If(TemplateSpan(input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If(If(TemplateSpan(input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => []))), ([_0, input2]) => [TemplateBodyMapping(_0), input2]), TemplateLiteralTypes = (input) => If(If(Const("`", input), ([_0, input2]) => If(TemplateBody(input2), ([_1, input3]) => If(Const("`", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [TemplateLiteralTypesMapping(_0), input2]), TemplateLiteral = (input) => If(TemplateLiteralTypes(input), ([_0, input2]) => [TemplateLiteralMapping(_0), input2]), Dependent2 = (input) => If(If(If(Const("if", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("then", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => If(Const("else", input5), ([_4, input6]) => If(Type(input6), ([_5, input7]) => [[_0, _1, _2, _3, _4, _5], input7])))))), ([_0, input2]) => [_0, input2], () => If(If(Const("if", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("then", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [DependentMapping(_0), input2]), LiteralBigInt = (input) => If(BigInt3(input), ([_0, input2]) => [LiteralBigIntMapping(_0), input2]), LiteralBoolean = (input) => If(If(Const("true", input), ([_0, input2]) => [_0, input2], () => If(Const("false", input), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [LiteralBooleanMapping(_0), input2]), LiteralNumber = (input) => If(Number3(input), ([_0, input2]) => [LiteralNumberMapping(_0), input2]), LiteralString = (input) => If(String3(["'", '"'], input), ([_0, input2]) => [LiteralStringMapping(_0), input2]), KeyOf = (input) => If(If(If(Const("keyof", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [KeyOfMapping(_0), input2]), IndexArray_0 = (input, result = []) => If(If(If(Const("[", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("]", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If(If(Const("[", input), ([_0, input2]) => If(Const("]", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => IndexArray_0(input2, [...result, _0]), () => [result, input]), IndexArray = (input) => If(IndexArray_0(input), ([_0, input2]) => [IndexArrayMapping(_0), input2]), Extends2 = (input) => If(If(If(Const("extends", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("?", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => If(Const(":", input5), ([_4, input6]) => If(Type(input6), ([_5, input7]) => [[_0, _1, _2, _3, _4, _5], input7])))))), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ExtendsMapping(_0), input2]), Base = (input) => If(If(If(Const("(", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const(")", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If(KeywordString(input), ([_0, input2]) => [_0, input2], () => If(KeywordNumber(input), ([_0, input2]) => [_0, input2], () => If(KeywordBoolean(input), ([_0, input2]) => [_0, input2], () => If(KeywordUndefined(input), ([_0, input2]) => [_0, input2], () => If(KeywordNull(input), ([_0, input2]) => [_0, input2], () => If(KeywordInteger(input), ([_0, input2]) => [_0, input2], () => If(KeywordBigInt(input), ([_0, input2]) => [_0, input2], () => If(KeywordUnknown(input), ([_0, input2]) => [_0, input2], () => If(KeywordAny(input), ([_0, input2]) => [_0, input2], () => If(KeywordObject(input), ([_0, input2]) => [_0, input2], () => If(KeywordNever(input), ([_0, input2]) => [_0, input2], () => If(KeywordSymbol(input), ([_0, input2]) => [_0, input2], () => If(KeywordVoid(input), ([_0, input2]) => [_0, input2], () => If(KeywordThis(input), ([_0, input2]) => [_0, input2], () => If(LiteralBigInt(input), ([_0, input2]) => [_0, input2], () => If(LiteralBoolean(input), ([_0, input2]) => [_0, input2], () => If(LiteralNumber(input), ([_0, input2]) => [_0, input2], () => If(LiteralString(input), ([_0, input2]) => [_0, input2], () => If(TemplateLiteral(input), ([_0, input2]) => [_0, input2], () => If(Dependent2(input), ([_0, input2]) => [_0, input2], () => If(_Object_2(input), ([_0, input2]) => [_0, input2], () => If(_Tuple_(input), ([_0, input2]) => [_0, input2], () => If(_Constructor_(input), ([_0, input2]) => [_0, input2], () => If(_Function_2(input), ([_0, input2]) => [_0, input2], () => If(_Mapped_(input), ([_0, input2]) => [_0, input2], () => If(GenericCall(input), ([_0, input2]) => [_0, input2], () => If(Reference(input), ([_0, input2]) => [_0, input2], () => [])))))))))))))))))))))))))))), ([_0, input2]) => [BaseMapping(_0), input2]), With = (input) => If(If(If(Const("with", input), ([_0, input2]) => If(WithObject(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [WithMapping(_0), input2]), Factor = (input) => If(If(KeyOf(input), ([_0, input2]) => If(Base(input2), ([_1, input3]) => If(IndexArray(input3), ([_2, input4]) => If(Extends2(input4), ([_3, input5]) => If(With(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [FactorMapping(_0), input2]), ExprTermTail = (input) => If(If(If(Const("&", input), ([_0, input2]) => If(Factor(input2), ([_1, input3]) => If(ExprTermTail(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ExprTermTailMapping(_0), input2]), ExprTerm = (input) => If(If(Factor(input), ([_0, input2]) => If(ExprTermTail(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ExprTermMapping(_0), input2]), ExprTail = (input) => If(If(If(Const("|", input), ([_0, input2]) => If(ExprTerm(input2), ([_1, input3]) => If(ExprTail(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ExprTailMapping(_0), input2]), Expr = (input) => If(If(ExprTerm(input), ([_0, input2]) => If(ExprTail(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ExprMapping(_0), input2]), ExprReadonly = (input) => If(If(Const("readonly", input), ([_0, input2]) => If(Expr(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ExprReadonlyMapping(_0), input2]), ExprPipe = (input) => If(If(Const("|", input), ([_0, input2]) => If(Expr(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ExprPipeMapping(_0), input2]), GenericType = (input) => If(If(GenericParameters(input), ([_0, input2]) => If(Const("=", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [GenericTypeMapping(_0), input2]), InferType = (input) => If(If(If(Const("infer", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(Const("extends", input3), ([_2, input4]) => If(Expr(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [_0, input2], () => If(If(Const("infer", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [InferTypeMapping(_0), input2]), Type = (input) => If(If(InferType(input), ([_0, input2]) => [_0, input2], () => If(ExprPipe(input), ([_0, input2]) => [_0, input2], () => If(ExprReadonly(input), ([_0, input2]) => [_0, input2], () => If(Expr(input), ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [TypeMapping(_0), input2]), PropertyKeyNumber = (input) => If(Number3(input), ([_0, input2]) => [PropertyKeyNumberMapping(_0), input2]), PropertyKeyIdent = (input) => If(Ident(input), ([_0, input2]) => [PropertyKeyIdentMapping(_0), input2]), PropertyKeyQuoted = (input) => If(String3(["'", '"'], input), ([_0, input2]) => [PropertyKeyQuotedMapping(_0), input2]), PropertyKeyIndex = (input) => If(If(Const("[", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(Const(":", input3), ([_2, input4]) => If(If(KeywordInteger(input4), ([_02, input5]) => [_02, input5], () => If(KeywordNumber(input4), ([_02, input5]) => [_02, input5], () => If(KeywordString(input4), ([_02, input5]) => [_02, input5], () => If(KeywordSymbol(input4), ([_02, input5]) => [_02, input5], () => [])))), ([_3, input5]) => If(Const("]", input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [PropertyKeyIndexMapping(_0), input2]), PropertyKey = (input) => If(If(PropertyKeyNumber(input), ([_0, input2]) => [_0, input2], () => If(PropertyKeyIdent(input), ([_0, input2]) => [_0, input2], () => If(PropertyKeyQuoted(input), ([_0, input2]) => [_0, input2], () => If(PropertyKeyIndex(input), ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [PropertyKeyMapping(_0), input2]), Readonly2 = (input) => If(If(If(Const("readonly", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ReadonlyMapping(_0), input2]), Optional3 = (input) => If(If(If(Const("?", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [OptionalMapping(_0), input2]), Property = (input) => If(If(Readonly2(input), ([_0, input2]) => If(PropertyKey(input2), ([_1, input3]) => If(Optional3(input3), ([_2, input4]) => If(Const(":", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [PropertyMapping(_0), input2]), PropertyDelimiter = (input) => If(If(If(Const(",", input), ([_0, input2]) => If(Const(`
`, input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const(";", input), ([_0, input2]) => If(Const(`
`, input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const(",", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If(If(Const(";", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If(If(Const(`
`, input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => []))))), ([_0, input2]) => [PropertyDelimiterMapping(_0), input2]), PropertyList_0 = (input, result = []) => If(If(Property(input), ([_0, input2]) => If(PropertyDelimiter(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => PropertyList_0(input2, [...result, _0]), () => [result, input]), PropertyList = (input) => If(If(PropertyList_0(input), ([_0, input2]) => If(If(If(Property(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [PropertyListMapping(_0), input2]), Properties = (input) => If(If(Const("{", input), ([_0, input2]) => If(PropertyList(input2), ([_1, input3]) => If(Const("}", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [PropertiesMapping(_0), input2]), _Object_2 = (input) => If(Properties(input), ([_0, input2]) => [_Object_Mapping(_0), input2]), ElementNamed = (input) => If(If(If(Ident(input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => If(Const(":", input3), ([_2, input4]) => If(Const("readonly", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [_0, input2], () => If(If(Ident(input), ([_0, input2]) => If(Const(":", input2), ([_1, input3]) => If(Const("readonly", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [_0, input2], () => If(If(Ident(input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => If(Const(":", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [_0, input2], () => If(If(Ident(input), ([_0, input2]) => If(Const(":", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [ElementNamedMapping(_0), input2]), ElementReadonlyOptional = (input) => If(If(Const("readonly", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => If(Const("?", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [ElementReadonlyOptionalMapping(_0), input2]), ElementReadonly = (input) => If(If(Const("readonly", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ElementReadonlyMapping(_0), input2]), ElementOptional = (input) => If(If(Type(input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ElementOptionalMapping(_0), input2]), ElementBase = (input) => If(If(ElementNamed(input), ([_0, input2]) => [_0, input2], () => If(ElementReadonlyOptional(input), ([_0, input2]) => [_0, input2], () => If(ElementReadonly(input), ([_0, input2]) => [_0, input2], () => If(ElementOptional(input), ([_0, input2]) => [_0, input2], () => If(Type(input), ([_0, input2]) => [_0, input2], () => []))))), ([_0, input2]) => [ElementBaseMapping(_0), input2]), Element = (input) => If(If(If(Const("...", input), ([_0, input2]) => If(ElementBase(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(ElementBase(input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ElementMapping(_0), input2]), ElementList_0 = (input, result = []) => If(If(Element(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => ElementList_0(input2, [...result, _0]), () => [result, input]), ElementList = (input) => If(If(ElementList_0(input), ([_0, input2]) => If(If(If(Element(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ElementListMapping(_0), input2]), _Tuple_ = (input) => If(If(Const("[", input), ([_0, input2]) => If(ElementList(input2), ([_1, input3]) => If(Const("]", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_Tuple_Mapping(_0), input2]), ParameterReadonlyOptional = (input) => If(If(Ident(input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => If(Const(":", input3), ([_2, input4]) => If(Const("readonly", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [ParameterReadonlyOptionalMapping(_0), input2]), ParameterReadonly = (input) => If(If(Ident(input), ([_0, input2]) => If(Const(":", input2), ([_1, input3]) => If(Const("readonly", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [ParameterReadonlyMapping(_0), input2]), ParameterOptional = (input) => If(If(Ident(input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => If(Const(":", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [ParameterOptionalMapping(_0), input2]), ParameterType = (input) => If(If(Ident(input), ([_0, input2]) => If(Const(":", input2), ([_1, input3]) => If(Type(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [ParameterTypeMapping(_0), input2]), ParameterBase = (input) => If(If(ParameterReadonlyOptional(input), ([_0, input2]) => [_0, input2], () => If(ParameterReadonly(input), ([_0, input2]) => [_0, input2], () => If(ParameterOptional(input), ([_0, input2]) => [_0, input2], () => If(ParameterType(input), ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [ParameterBaseMapping(_0), input2]), Parameter2 = (input) => If(If(If(Const("...", input), ([_0, input2]) => If(ParameterBase(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(ParameterBase(input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ParameterMapping(_0), input2]), ParameterList_0 = (input, result = []) => If(If(Parameter2(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => ParameterList_0(input2, [...result, _0]), () => [result, input]), ParameterList = (input) => If(If(ParameterList_0(input), ([_0, input2]) => If(If(If(Parameter2(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ParameterListMapping(_0), input2]), _Function_2 = (input) => If(If(Const("(", input), ([_0, input2]) => If(ParameterList(input2), ([_1, input3]) => If(Const(")", input3), ([_2, input4]) => If(Const("=>", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [_Function_Mapping(_0), input2]), _Constructor_ = (input) => If(If(Const("new", input), ([_0, input2]) => If(Const("(", input2), ([_1, input3]) => If(ParameterList(input3), ([_2, input4]) => If(Const(")", input4), ([_3, input5]) => If(Const("=>", input5), ([_4, input6]) => If(Type(input6), ([_5, input7]) => [[_0, _1, _2, _3, _4, _5], input7])))))), ([_0, input2]) => [_Constructor_Mapping(_0), input2]), MappedReadonly = (input) => If(If(If(Const("+", input), ([_0, input2]) => If(Const("readonly", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const("-", input), ([_0, input2]) => If(Const("readonly", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const("readonly", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [MappedReadonlyMapping(_0), input2]), MappedOptional = (input) => If(If(If(Const("+", input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const("-", input), ([_0, input2]) => If(Const("?", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const("?", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])))), ([_0, input2]) => [MappedOptionalMapping(_0), input2]), MappedAs = (input) => If(If(If(Const("as", input), ([_0, input2]) => If(Type(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [MappedAsMapping(_0), input2]), _Mapped_ = (input) => If(If(Const("{", input), ([_0, input2]) => If(MappedReadonly(input2), ([_1, input3]) => If(Const("[", input3), ([_2, input4]) => If(Ident(input4), ([_3, input5]) => If(Const("in", input5), ([_4, input6]) => If(Type(input6), ([_5, input7]) => If(MappedAs(input7), ([_6, input8]) => If(Const("]", input8), ([_7, input9]) => If(MappedOptional(input9), ([_8, input10]) => If(Const(":", input10), ([_9, input11]) => If(Type(input11), ([_10, input12]) => If(OptionalSemiColon(input12), ([_11, input13]) => If(Const("}", input13), ([_12, input14]) => [[_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12], input14]))))))))))))), ([_0, input2]) => [_Mapped_Mapping(_0), input2]), Reference = (input) => If(Ident(input), ([_0, input2]) => [ReferenceMapping(_0), input2]), WithBigInt = (input) => If(BigInt3(input), ([_0, input2]) => [WithBigIntMapping(_0), input2]), WithNumber = (input) => If(Number3(input), ([_0, input2]) => [WithNumberMapping(_0), input2]), WithBoolean = (input) => If(If(Const("true", input), ([_0, input2]) => [_0, input2], () => If(Const("false", input), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [WithBooleanMapping(_0), input2]), WithString = (input) => If(String3(['"', "'"], input), ([_0, input2]) => [WithStringMapping(_0), input2]), WithNull = (input) => If(Const("null", input), ([_0, input2]) => [WithNullMapping(_0), input2]), WithUndefined = (input) => If(Const("undefined", input), ([_0, input2]) => [WithUndefinedMapping(_0), input2]), WithProperty = (input) => If(If(PropertyKey(input), ([_0, input2]) => If(Const(":", input2), ([_1, input3]) => If(WithValue(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [WithPropertyMapping(_0), input2]), WithPropertyList_0 = (input, result = []) => If(If(WithProperty(input), ([_0, input2]) => If(PropertyDelimiter(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => WithPropertyList_0(input2, [...result, _0]), () => [result, input]), WithPropertyList = (input) => If(If(WithPropertyList_0(input), ([_0, input2]) => If(If(If(WithProperty(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [WithPropertyListMapping(_0), input2]), WithObject = (input) => If(If(Const("{", input), ([_0, input2]) => If(WithPropertyList(input2), ([_1, input3]) => If(Const("}", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [WithObjectMapping(_0), input2]), WithElementList_0 = (input, result = []) => If(If(WithValue(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => WithElementList_0(input2, [...result, _0]), () => [result, input]), WithElementList = (input) => If(If(WithElementList_0(input), ([_0, input2]) => If(If(If(WithValue(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [WithElementListMapping(_0), input2]), WithArray = (input) => If(If(Const("[", input), ([_0, input2]) => If(WithElementList(input2), ([_1, input3]) => If(Const("]", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [WithArrayMapping(_0), input2]), WithValue = (input) => If(If(WithBigInt(input), ([_0, input2]) => [_0, input2], () => If(WithNumber(input), ([_0, input2]) => [_0, input2], () => If(WithBoolean(input), ([_0, input2]) => [_0, input2], () => If(WithString(input), ([_0, input2]) => [_0, input2], () => If(WithNull(input), ([_0, input2]) => [_0, input2], () => If(WithUndefined(input), ([_0, input2]) => [_0, input2], () => If(WithObject(input), ([_0, input2]) => [_0, input2], () => If(WithArray(input), ([_0, input2]) => [_0, input2], () => [])))))))), ([_0, input2]) => [WithValueMapping(_0), input2]), PatternBigInt = (input) => If(Const("-?(?:0|[1-9][0-9]*)n", input), ([_0, input2]) => [PatternBigIntMapping(_0), input2]), PatternString = (input) => If(Const(".*", input), ([_0, input2]) => [PatternStringMapping(_0), input2]), PatternNumber = (input) => If(Const("-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?", input), ([_0, input2]) => [PatternNumberMapping(_0), input2]), PatternInteger = (input) => If(Const("-?(?:0|[1-9][0-9]*)", input), ([_0, input2]) => [PatternIntegerMapping(_0), input2]), PatternNever = (input) => If(Const("(?!)", input), ([_0, input2]) => [PatternNeverMapping(_0), input2]), PatternText = (input) => If(Until_1(["-?(?:0|[1-9][0-9]*)n", ".*", "-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?", "-?(?:0|[1-9][0-9]*)", "(?!)", "(", ")", "$", "|"], input), ([_0, input2]) => [PatternTextMapping(_0), input2]), PatternBase = (input) => If(If(PatternBigInt(input), ([_0, input2]) => [_0, input2], () => If(PatternString(input), ([_0, input2]) => [_0, input2], () => If(PatternNumber(input), ([_0, input2]) => [_0, input2], () => If(PatternInteger(input), ([_0, input2]) => [_0, input2], () => If(PatternNever(input), ([_0, input2]) => [_0, input2], () => If(PatternGroup(input), ([_0, input2]) => [_0, input2], () => If(PatternText(input), ([_0, input2]) => [_0, input2], () => []))))))), ([_0, input2]) => [PatternBaseMapping(_0), input2]), PatternGroup = (input) => If(If(Const("(", input), ([_0, input2]) => If(PatternBody(input2), ([_1, input3]) => If(Const(")", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [PatternGroupMapping(_0), input2]), PatternUnion = (input) => If(If(If(PatternTerm(input), ([_0, input2]) => If(Const("|", input2), ([_1, input3]) => If(PatternUnion(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [_0, input2], () => If(If(PatternTerm(input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => []))), ([_0, input2]) => [PatternUnionMapping(_0), input2]), PatternTerm = (input) => If(If(PatternBase(input), ([_0, input2]) => If(PatternBody(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [PatternTermMapping(_0), input2]), PatternBody = (input) => If(If(PatternUnion(input), ([_0, input2]) => [_0, input2], () => If(PatternTerm(input), ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [PatternBodyMapping(_0), input2]), Pattern = (input) => If(If(Const("^", input), ([_0, input2]) => If(PatternBody(input2), ([_1, input3]) => If(Const("$", input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [PatternMapping(_0), input2]), InterfaceDeclarationHeritageList_0 = (input, result = []) => If(If(Type(input), ([_0, input2]) => If(Const(",", input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => InterfaceDeclarationHeritageList_0(input2, [...result, _0]), () => [result, input]), InterfaceDeclarationHeritageList = (input) => If(If(InterfaceDeclarationHeritageList_0(input), ([_0, input2]) => If(If(If(Type(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [InterfaceDeclarationHeritageListMapping(_0), input2]), InterfaceDeclarationHeritage = (input) => If(If(If(Const("extends", input), ([_0, input2]) => If(InterfaceDeclarationHeritageList(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [InterfaceDeclarationHeritageMapping(_0), input2]), InterfaceDeclarationGeneric = (input) => If(If(Const("interface", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(GenericParameters(input3), ([_2, input4]) => If(InterfaceDeclarationHeritage(input4), ([_3, input5]) => If(Properties(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [InterfaceDeclarationGenericMapping(_0), input2]), InterfaceDeclaration = (input) => If(If(Const("interface", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(InterfaceDeclarationHeritage(input3), ([_2, input4]) => If(Properties(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [InterfaceDeclarationMapping(_0), input2]), TypeAliasDeclarationGeneric = (input) => If(If(Const("type", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(GenericParameters(input3), ([_2, input4]) => If(Const("=", input4), ([_3, input5]) => If(Type(input5), ([_4, input6]) => [[_0, _1, _2, _3, _4], input6]))))), ([_0, input2]) => [TypeAliasDeclarationGenericMapping(_0), input2]), TypeAliasDeclaration = (input) => If(If(Const("type", input), ([_0, input2]) => If(Ident(input2), ([_1, input3]) => If(Const("=", input3), ([_2, input4]) => If(Type(input4), ([_3, input5]) => [[_0, _1, _2, _3], input5])))), ([_0, input2]) => [TypeAliasDeclarationMapping(_0), input2]), ExportKeyword = (input) => If(If(If(Const("export", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If([[], input], ([_0, input2]) => [_0, input2], () => [])), ([_0, input2]) => [ExportKeywordMapping(_0), input2]), ModuleDeclarationDelimiter = (input) => If(If(If(Const(";", input), ([_0, input2]) => If(Const(`
`, input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [_0, input2], () => If(If(Const(";", input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => If(If(Const(`
`, input), ([_0, input2]) => [[_0], input2]), ([_0, input2]) => [_0, input2], () => []))), ([_0, input2]) => [ModuleDeclarationDelimiterMapping(_0), input2]), ModuleDeclarationList_0 = (input, result = []) => If(If(ModuleDeclaration(input), ([_0, input2]) => If(ModuleDeclarationDelimiter(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => ModuleDeclarationList_0(input2, [...result, _0]), () => [result, input]), ModuleDeclarationList = (input) => If(If(ModuleDeclarationList_0(input), ([_0, input2]) => If(If(If(ModuleDeclaration(input2), ([_02, input3]) => [[_02], input3]), ([_02, input3]) => [_02, input3], () => If([[], input2], ([_02, input3]) => [_02, input3], () => [])), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ModuleDeclarationListMapping(_0), input2]), ModuleDeclaration = (input) => If(If(ExportKeyword(input), ([_0, input2]) => If(If(InterfaceDeclarationGeneric(input2), ([_02, input3]) => [_02, input3], () => If(InterfaceDeclaration(input2), ([_02, input3]) => [_02, input3], () => If(TypeAliasDeclarationGeneric(input2), ([_02, input3]) => [_02, input3], () => If(TypeAliasDeclaration(input2), ([_02, input3]) => [_02, input3], () => [])))), ([_1, input3]) => If(OptionalSemiColon(input3), ([_2, input4]) => [[_0, _1, _2], input4]))), ([_0, input2]) => [ModuleDeclarationMapping(_0), input2]), Module = (input) => If(If(ModuleDeclaration(input), ([_0, input2]) => If(ModuleDeclarationList(input2), ([_1, input3]) => [[_0, _1], input3])), ([_0, input2]) => [ModuleMapping(_0), input2]), Script = (input) => If(If(Module(input), ([_0, input2]) => [_0, input2], () => If(GenericType(input), ([_0, input2]) => [_0, input2], () => If(Type(input), ([_0, input2]) => [_0, input2], () => []))), ([_0, input2]) => [ScriptMapping(_0), input2]);
var init_parser = __esm(() => {
  init_mapping();
  init_token();
});

// node_modules/typebox/build/type/engine/patterns/template.mjs
function ParseTemplateIntoTypes(template) {
  const parsed = TemplateLiteralTypes(`\`${template}\``);
  const result = exports_guard.IsEqual(parsed.length, 2) ? parsed[0] : Unreachable();
  return result;
}
var init_template = __esm(() => {
  init_unreachable();
  init_guard2();
  init_parser();
});

// node_modules/typebox/build/type/engine/template_literal/encode.mjs
function JoinString(input) {
  return input.join("|");
}
function UnwrapTemplateLiteralPattern(pattern) {
  return pattern.slice(1, pattern.length - 1);
}
function EncodeLiteral(value, right, pattern) {
  return EncodeTypes(right, `${pattern}${value}`);
}
function EncodeBigInt(right, pattern) {
  return EncodeTypes(right, `${pattern}${BigIntPattern}`);
}
function EncodeInteger(right, pattern) {
  return EncodeTypes(right, `${pattern}${IntegerPattern}`);
}
function EncodeNumber(right, pattern) {
  return EncodeTypes(right, `${pattern}${NumberPattern}`);
}
function EncodeBoolean(right, pattern) {
  return EncodeType(Union([Literal("false"), Literal("true")]), right, pattern);
}
function EncodeString(right, pattern) {
  return EncodeTypes(right, `${pattern}${StringPattern}`);
}
function EncodeTemplateLiteral(templatePattern, right, pattern) {
  return EncodeTypes(right, `${pattern}${UnwrapTemplateLiteralPattern(templatePattern)}`);
}
function EncodeTemplateLiteralDeferred(types, right, pattern) {
  const templateLiteral = TemplateLiteralAction(types, {});
  const result = EncodeType(templateLiteral, right, pattern);
  return result;
}
function EncodeEnum(values, right, pattern) {
  const evaluated = EvaluateEnum(values);
  return EncodeType(evaluated, right, pattern);
}
function EncodeUnion(types, right, pattern, result = []) {
  return exports_guard.ShiftLeft(types, (head, tail) => EncodeUnion(tail, right, pattern, [...result, EncodeType(head, [], "")]), () => EncodeTypes(right, `${pattern}(${JoinString(result)})`));
}
function EncodeType(type, right, pattern) {
  return IsEnum(type) ? EncodeEnum(type.enum, right, pattern) : IsInteger2(type) ? EncodeInteger(right, pattern) : IsLiteral(type) ? EncodeLiteral(type.const, right, pattern) : IsBigInt2(type) ? EncodeBigInt(right, pattern) : IsBoolean3(type) ? EncodeBoolean(right, pattern) : IsNumber3(type) ? EncodeNumber(right, pattern) : IsString3(type) ? EncodeString(right, pattern) : IsTemplateLiteral(type) ? EncodeTemplateLiteral(type.pattern, right, pattern) : IsTemplateLiteralDeferred(type) ? EncodeTemplateLiteralDeferred(type.parameters[0], right, pattern) : IsUnion(type) ? EncodeUnion(type.anyOf, right, pattern) : NeverPattern;
}
function EncodeTypes(types, pattern) {
  return exports_guard.ShiftLeft(types, (left, right) => EncodeType(left, right, pattern), () => pattern);
}
function EncodePattern(types) {
  const encoded = EncodeTypes(types, "");
  const result = `^${encoded}$`;
  return result;
}
function TemplateLiteralEncode(types) {
  const pattern = EncodePattern(types);
  const result = TemplateLiteralCreate(pattern);
  return result;
}
var init_encode = __esm(() => {
  init_guard2();
  init_enum();
  init_literal();
  init_union();
  init_template_literal();
  init_bigint();
  init_string();
  init_number();
  init_integer();
  init_boolean();
  init_never();
  init_create2();
  init_evaluate2();
  init_instantiate2();
});

// node_modules/typebox/build/type/engine/template_literal/instantiate.mjs
function TemplateLiteralAction(types, options) {
  const result = CanInstantiate(types) ? exports_memory.Update(TemplateLiteralEncode(types), {}, options) : TemplateLiteralDeferred(types, options);
  return result;
}
function TemplateLiteralInstantiate(context, state, types, options) {
  const instantiatedTypes = InstantiateTypes(context, state, types);
  return TemplateLiteralAction(instantiatedTypes, options);
}
var init_instantiate2 = __esm(() => {
  init_memory2();
  init_template_literal();
  init_encode();
  init_instantiate27();
});

// node_modules/typebox/build/type/types/template_literal.mjs
function TemplateLiteralDeferred(types, options = {}) {
  return Deferred("TemplateLiteral", [types], options);
}
function IsTemplateLiteralDeferred(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "action") && exports_guard.IsEqual(value.action, "TemplateLiteral");
}
function TemplateLiteralFromTypes(types) {
  return TemplateLiteralAction(types, {});
}
function TemplateLiteralFromString(template) {
  const types = ParseTemplateIntoTypes(template);
  return TemplateLiteralFromTypes(types);
}
function TemplateLiteral2(input, options = {}) {
  const type = exports_guard.IsString(input) ? TemplateLiteralFromString(input) : TemplateLiteralFromTypes(input);
  return exports_memory.Update(type, {}, options);
}
function IsTemplateLiteral(value) {
  return IsKind(value, "TemplateLiteral");
}
var init_template_literal = __esm(() => {
  init_system();
  init_guard2();
  init_schema();
  init_deferred();
  init_template();
  init_instantiate2();
});

// node_modules/typebox/build/type/extends/result.mjs
var exports_result = {};
__export(exports_result, {
  ExtendsFalse: () => ExtendsFalse,
  ExtendsTrue: () => ExtendsTrue,
  ExtendsUnion: () => ExtendsUnion,
  IsExtendsFalse: () => IsExtendsFalse,
  IsExtendsTrue: () => IsExtendsTrue,
  IsExtendsTrueLike: () => IsExtendsTrueLike,
  IsExtendsUnion: () => IsExtendsUnion,
  Match: () => Match3
});
function ExtendsUnion(inferred) {
  return exports_memory.Create({ ["~kind"]: "ExtendsUnion" }, { inferred });
}
function IsExtendsUnion(value) {
  return exports_guard.IsObject(value) && exports_guard.HasPropertyKey(value, "~kind") && exports_guard.HasPropertyKey(value, "inferred") && exports_guard.IsEqual(value["~kind"], "ExtendsUnion") && exports_guard.IsObject(value.inferred);
}
function ExtendsTrue(inferred) {
  return exports_memory.Create({ ["~kind"]: "ExtendsTrue" }, { inferred });
}
function IsExtendsTrue(value) {
  return exports_guard.IsObject(value) && exports_guard.HasPropertyKey(value, "~kind") && exports_guard.HasPropertyKey(value, "inferred") && exports_guard.IsEqual(value["~kind"], "ExtendsTrue") && exports_guard.IsObject(value.inferred);
}
function ExtendsFalse() {
  return exports_memory.Create({ ["~kind"]: "ExtendsFalse" }, {});
}
function IsExtendsFalse(value) {
  return exports_guard.IsObject(value) && exports_guard.HasPropertyKey(value, "~kind") && exports_guard.IsEqual(value["~kind"], "ExtendsFalse");
}
function IsExtendsTrueLike(value) {
  return IsExtendsUnion(value) || IsExtendsTrue(value);
}
function Match3(result, true_, false_) {
  return IsExtendsTrueLike(result) ? true_(result.inferred) : false_();
}
var init_result = __esm(() => {
  init_guard2();
  init_memory2();
});

// node_modules/typebox/build/type/extends/extends_right.mjs
function ExtendsRightInfer(inferred, name, left, right) {
  return Match3(ExtendsLeft(inferred, left, right), (checkInferred) => ExtendsTrue(exports_memory.Assign(exports_memory.Assign(inferred, checkInferred), { [name]: left })), () => ExtendsFalse());
}
function ExtendsRightAny(inferred, _left) {
  return ExtendsTrue(inferred);
}
function ExtendsRightDependent(inferred, left, if_, then_, else_) {
  return Match3(ExtendsLeft(inferred, left, if_), (inferred2) => Match3(ExtendsLeft(inferred2, left, then_), (inferred3) => ExtendsTrue(inferred3), () => ExtendsFalse()), () => Match3(ExtendsLeft(inferred, left, else_), (inferred2) => ExtendsTrue(inferred2), () => ExtendsFalse()));
}
function ExtendsRightEnum(inferred, left, right) {
  const evaluated = EvaluateEnum(right);
  return ExtendsLeft(inferred, left, evaluated);
}
function ExtendsRightIntersect(inferred, left, right) {
  return exports_guard.ShiftLeft(right, (head, tail) => Match3(ExtendsLeft(inferred, left, head), (inferred2) => ExtendsRightIntersect(inferred2, left, tail), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsRightTemplateLiteral(inferred, left, right) {
  const evaluated = EvaluateTemplateLiteral(right);
  return ExtendsLeft(inferred, left, evaluated);
}
function ExtendsRightUnion(inferred, left, right) {
  return exports_guard.ShiftLeft(right, (head, tail) => Match3(ExtendsLeft(inferred, left, head), (inferred2) => ExtendsTrue(inferred2), () => ExtendsRightUnion(inferred, left, tail)), () => ExtendsFalse());
}
function ExtendsRight(inferred, left, right) {
  return IsAny(right) ? ExtendsRightAny(inferred, left) : IsDependent(right) ? ExtendsRightDependent(inferred, left, right.if, right.then, right.else) : IsEnum(right) ? ExtendsRightEnum(inferred, left, right.enum) : IsInfer(right) ? ExtendsRightInfer(inferred, right.name, left, right.extends) : IsIntersect(right) ? ExtendsRightIntersect(inferred, left, right.allOf) : IsTemplateLiteral(right) ? ExtendsRightTemplateLiteral(inferred, left, right.pattern) : IsUnion(right) ? ExtendsRightUnion(inferred, left, right.anyOf) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}
var init_extends_right = __esm(() => {
  init_guard2();
  init_memory2();
  init_any();
  init_dependent();
  init_enum();
  init_infer();
  init_intersect();
  init_template_literal();
  init_union();
  init_unknown();
  init_extends_left();
  init_result();
  init_evaluate2();
  init_evaluate2();
});

// node_modules/typebox/build/type/extends/any.mjs
function ExtendsAny(inferred, left, right) {
  return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsUnion(inferred);
}
var init_any2 = __esm(() => {
  init_infer();
  init_any();
  init_unknown();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/array.mjs
function ExtendsImmutable(left, right) {
  const isImmutableLeft = IsImmutable(left);
  const isImmutableRight = IsImmutable(right);
  return isImmutableLeft && isImmutableRight ? true : !isImmutableLeft && isImmutableRight ? true : isImmutableLeft && !isImmutableRight ? false : true;
}
function ExtendsArray(inferred, arrayLeft, left, right) {
  return IsArray2(right) ? ExtendsImmutable(arrayLeft, right) ? ExtendsLeft(inferred, left, right.items) : ExtendsFalse() : ExtendsRight(inferred, arrayLeft, right);
}
var init_array2 = __esm(() => {
  init_array();
  init__immutable();
  init_extends_right();
  init_extends_left();
  init_result();
});

// node_modules/typebox/build/type/extends/bigint.mjs
function ExtendsBigInt(inferred, left, right) {
  return IsBigInt2(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_bigint3 = __esm(() => {
  init_bigint();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/boolean.mjs
function ExtendsBoolean(inferred, left, right) {
  return IsBoolean3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_boolean2 = __esm(() => {
  init_boolean();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/parameters.mjs
function ParameterCompare(inferred, left, leftRest, right, rightRest) {
  const checkLeft = IsInfer(right) ? left : right;
  const checkRight = IsInfer(right) ? right : left;
  const isLeftOptional = IsOptional(left);
  const isRightOptional = IsOptional(right);
  return !isLeftOptional && isRightOptional ? ExtendsFalse() : Match3(ExtendsLeft(inferred, checkLeft, checkRight), (inferred2) => ExtendsParameters(inferred2, leftRest, rightRest), () => ExtendsFalse());
}
function ParameterRight(inferred, left, leftRest, rightRest) {
  return exports_guard.ShiftLeft(rightRest, (head, tail) => ParameterCompare(inferred, left, leftRest, head, tail), () => IsOptional(left) ? ExtendsTrue(inferred) : ExtendsFalse());
}
function ParametersLeft(inferred, left, rightRest) {
  return exports_guard.ShiftLeft(left, (head, tail) => ParameterRight(inferred, head, tail, rightRest), () => ExtendsTrue(inferred));
}
function ExtendsParameters(inferred, left, right) {
  return ParametersLeft(inferred, left, right);
}
var init_parameters = __esm(() => {
  init_guard2();
  init_infer();
  init__optional();
  init_extends_left();
  init_result();
});

// node_modules/typebox/build/type/extends/return_type.mjs
function ExtendsReturnType(inferred, left, right) {
  return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsLeft(inferred, left, right);
}
var init_return_type = __esm(() => {
  init_void();
  init_extends_left();
  init_result();
});

// node_modules/typebox/build/type/extends/constructor.mjs
function ExtendsConstructor(inferred, parameters, returnType, right) {
  return IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : IsConstructor2(right) ? Match3(ExtendsParameters(inferred, parameters, right["parameters"]), (inferred2) => ExtendsReturnType(inferred2, returnType, right["instanceType"]), () => ExtendsFalse()) : ExtendsFalse();
}
var init_constructor2 = __esm(() => {
  init_any();
  init_constructor();
  init_unknown();
  init_result();
  init_parameters();
  init_return_type();
});

// node_modules/typebox/build/type/extends/dependent.mjs
function ExtendsDependent(inferred, if_, then_, else_, right) {
  return Match3(ExtendsLeft(inferred, if_, right), () => ExtendsLeft(inferred, then_, right), () => ExtendsLeft(inferred, else_, right));
}
var init_dependent2 = __esm(() => {
  init_extends_left();
  init_result();
});

// node_modules/typebox/build/type/extends/enum.mjs
function ExtendsEnum(inferred, left, right) {
  const evaluated = EvaluateEnum(left);
  return ExtendsLeft(inferred, evaluated, right);
}
var init_enum2 = __esm(() => {
  init_extends_left();
  init_evaluate2();
});

// node_modules/typebox/build/type/extends/function.mjs
function ExtendsFunction(inferred, parameters, returnType, right) {
  return IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : IsFunction2(right) ? Match3(ExtendsParameters(inferred, parameters, right["parameters"]), (inferred2) => ExtendsReturnType(inferred2, returnType, right["returnType"]), () => ExtendsFalse()) : ExtendsFalse();
}
var init_function2 = __esm(() => {
  init_any();
  init_function();
  init_unknown();
  init_result();
  init_parameters();
  init_return_type();
});

// node_modules/typebox/build/type/extends/integer.mjs
function ExtendsInteger(inferred, left, right) {
  return IsInteger2(right) ? ExtendsTrue(inferred) : IsNumber3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_integer3 = __esm(() => {
  init_integer();
  init_number();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/intersect.mjs
function ExtendsIntersect(inferred, left, right) {
  const evaluated = EvaluateIntersect(left);
  return ExtendsLeft(inferred, evaluated, right);
}
var init_intersect2 = __esm(() => {
  init_extends_left();
  init_evaluate3();
});

// node_modules/typebox/build/type/extends/literal.mjs
function ExtendsLiteralValue(inferred, left, right) {
  return left === right ? ExtendsTrue(inferred) : ExtendsFalse();
}
function ExtendsLiteralBigInt(inferred, left, right) {
  return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBigInt2(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralBoolean(inferred, left, right) {
  return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBoolean3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralNumber(inferred, left, right) {
  return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsNumber3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralString(inferred, left, right) {
  return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsString3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteral(inferred, left, right) {
  return exports_guard.IsBigInt(left.const) ? ExtendsLiteralBigInt(inferred, left.const, right) : exports_guard.IsBoolean(left.const) ? ExtendsLiteralBoolean(inferred, left.const, right) : exports_guard.IsNumber(left.const) ? ExtendsLiteralNumber(inferred, left.const, right) : exports_guard.IsString(left.const) ? ExtendsLiteralString(inferred, left.const, right) : Unreachable();
}
var init_literal2 = __esm(() => {
  init_guard2();
  init_literal();
  init_bigint();
  init_boolean();
  init_number();
  init_string();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/never.mjs
function ExtendsNever(inferred, left, right) {
  return IsInfer(right) ? ExtendsRight(inferred, left, right) : ExtendsTrue(inferred);
}
var init_never2 = __esm(() => {
  init_infer();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/null.mjs
function ExtendsNull(inferred, left, right) {
  return IsNull2(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_null2 = __esm(() => {
  init_null();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/number.mjs
function ExtendsNumber(inferred, left, right) {
  return IsNumber3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_number3 = __esm(() => {
  init_number();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/object.mjs
function ExtendsPropertyOptional(inferred, left, right) {
  return IsOptional(left) ? IsOptional(right) ? ExtendsTrue(inferred) : ExtendsFalse() : ExtendsTrue(inferred);
}
function ExtendsProperty(inferred, left, right) {
  return IsInfer(right) && IsNever(right.extends) ? ExtendsFalse() : Match3(ExtendsLeft(inferred, left, right), (inferred2) => ExtendsPropertyOptional(inferred2, left, right), () => ExtendsFalse());
}
function ExtractInferredProperties(keys, properties2) {
  return keys.reduce((result, key) => {
    return key in properties2 ? IsExtendsTrueLike(properties2[key]) ? { ...result, ...properties2[key].inferred } : Unreachable() : Unreachable();
  }, {});
}
function ExtendsPropertiesComparer(inferred, left, right) {
  const properties2 = {};
  for (const rightKey of exports_guard.Keys(right)) {
    properties2[rightKey] = rightKey in left ? ExtendsProperty({}, left[rightKey], right[rightKey]) : IsOptional(right[rightKey]) ? IsInfer(right[rightKey]) ? ExtendsTrue(exports_memory.Assign(inferred, { [right[rightKey].name]: right[rightKey].extends })) : ExtendsTrue(inferred) : ExtendsFalse();
  }
  const checked = exports_guard.Values(properties2).every((result) => IsExtendsTrueLike(result));
  const extracted = checked ? ExtractInferredProperties(exports_guard.Keys(properties2), properties2) : {};
  return checked ? ExtendsTrue(extracted) : ExtendsFalse();
}
function ExtendsProperties(inferred, left, right) {
  const compared = ExtendsPropertiesComparer(inferred, left, right);
  return IsExtendsTrueLike(compared) ? ExtendsTrue(exports_memory.Assign(inferred, compared.inferred)) : ExtendsFalse();
}
function ExtendsObjectToObject(inferred, left, right) {
  return ExtendsProperties(inferred, left, right);
}
function RecordMergeInferred(left, right) {
  return exports_guard.Keys(right).reduce((result, key) => {
    return {
      ...result,
      [key]: exports_guard.HasPropertyKey(left, key) ? IsUnion(result[key]) ? Union([...result[key].anyOf, right[key]]) : Union([left[key], right[key]]) : right[key]
    };
  }, left);
}
function ExtendsRecordComparer(properties2, keys, type, result) {
  return exports_guard.ShiftLeft(keys, (left, right) => Match3(ExtendsLeft({}, properties2[left], type), (inferred) => ExtendsRecordComparer(properties2, right, type, RecordMergeInferred(result, inferred)), () => ExtendsFalse()), () => ExtendsTrue(result));
}
function ExtendsObjectToRecord(inferred, properties2, _pattern, value) {
  const keys = exports_guard.Keys(properties2);
  const result = ExtendsRecordComparer(properties2, keys, value, inferred);
  return result;
}
function ExtendsObject(inferred, left, right) {
  return IsRecord(right) ? ExtendsObjectToRecord(inferred, left, RecordPattern(right), RecordValue(right)) : IsObject2(right) ? ExtendsObjectToObject(inferred, left, right.properties) : ExtendsRight(inferred, _Object_(left), right);
}
var init_object2 = __esm(() => {
  init_unreachable();
  init_memory2();
  init_guard2();
  init__optional();
  init_infer();
  init_never();
  init_object();
  init_record();
  init_union();
  init_extends_left();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/record.mjs
function FromObject2(inferred, properties2) {
  return exports_guard.IsEqual(exports_guard.Keys(properties2).length, 0) ? ExtendsTrue(inferred) : ExtendsFalse();
}
function FromRecord(inferred, _leftKey, leftValue, _rightKey, rightValue) {
  return ExtendsLeft(inferred, leftValue, rightValue);
}
function ExtendsRecord(inferred, leftPattern, leftValue, right) {
  return IsRecord(right) ? FromRecord(inferred, RecordPatternToType(leftPattern), leftValue, RecordPatternToType(RecordPattern(right)), RecordValue(right)) : IsObject2(right) ? FromObject2(inferred, right.properties) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}
var init_record2 = __esm(() => {
  init_guard2();
  init_any();
  init_unknown();
  init_object();
  init_record();
  init_extends_left();
  init_result();
});

// node_modules/typebox/build/type/extends/string.mjs
function ExtendsString(inferred, left, right) {
  return IsString3(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_string3 = __esm(() => {
  init_string();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/symbol.mjs
function ExtendsSymbol(inferred, left, right) {
  return IsSymbol2(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_symbol2 = __esm(() => {
  init_symbol();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/template_literal.mjs
function ExtendsTemplateLiteral(inferred, left, right) {
  const evaluated = EvaluateTemplateLiteral(left);
  return ExtendsLeft(inferred, evaluated, right);
}
var init_template_literal2 = __esm(() => {
  init_extends_left();
  init_evaluate2();
});

// node_modules/typebox/build/type/extends/inference.mjs
function Inferrable(name, type) {
  return exports_memory.Create({ "~kind": "Inferrable" }, { name, type }, {});
}
function IsInferable(value) {
  return exports_guard.IsObject(value) && exports_guard.HasPropertyKey(value, "~kind") && exports_guard.HasPropertyKey(value, "name") && exports_guard.HasPropertyKey(value, "type") && exports_guard.IsEqual(value["~kind"], "Inferrable") && exports_guard.IsString(value.name) && exports_guard.IsObject(value.type);
}
function TryRestInferable(type) {
  return IsRest(type) ? IsInfer(type.items) ? IsArray2(type.items.extends) ? Inferrable(type.items.name, type.items.extends.items) : IsUnknown(type.items.extends) ? Inferrable(type.items.name, type.items.extends) : undefined : Unreachable() : undefined;
}
function TryInferable(type) {
  return IsInfer(type) ? Inferrable(type.name, type.extends) : undefined;
}
function TryInferResults(rest3, right, result = []) {
  return exports_guard.ShiftLeft(rest3, (head, tail) => Match3(ExtendsLeft({}, head, right), () => TryInferResults(tail, right, [...result, head]), () => {
    return;
  }), () => result);
}
function InferTupleResult(inferred, name, left, right) {
  const results = TryInferResults(left, right);
  return exports_guard.IsArray(results) ? ExtendsTrue(exports_memory.Assign(inferred, { [name]: Tuple(results) })) : ExtendsFalse();
}
function InferUnionResult(inferred, name, left, right) {
  const results = TryInferResults(left, right);
  return exports_guard.IsArray(results) ? ExtendsTrue(exports_memory.Assign(inferred, { [name]: Union(results) })) : ExtendsFalse();
}
var init_inference = __esm(() => {
  init_unreachable();
  init_memory2();
  init_guard2();
  init_array();
  init_unknown();
  init_tuple();
  init_extends_left();
  init_union();
  init_infer();
  init_rest();
  init_result();
});

// node_modules/typebox/build/type/extends/tuple.mjs
function Reverse(types) {
  return [...types].reverse();
}
function ApplyReverse(types, reversed) {
  return reversed ? Reverse(types) : types;
}
function Reversed(types) {
  const first = types.length > 0 ? types[0] : undefined;
  const inferrable = IsSchema(first) ? TryRestInferable(first) : undefined;
  return IsSchema(inferrable);
}
function ElementsCompare(inferred, reversed, left, leftRest, right, rightRest) {
  return Match3(ExtendsLeft(inferred, left, right), (checkInferred) => Elements(checkInferred, reversed, leftRest, rightRest), () => ExtendsFalse());
}
function ElementsLeft(inferred, reversed, leftRest, right, rightRest) {
  const inferable = TryRestInferable(right);
  return IsInferable(inferable) ? InferTupleResult(inferred, inferable["name"], ApplyReverse(leftRest, reversed), inferable["type"]) : exports_guard.ShiftLeft(leftRest, (head, tail) => ElementsCompare(inferred, reversed, head, tail, right, rightRest), () => ExtendsFalse());
}
function ElementsRight(inferred, reversed, leftRest, rightRest) {
  return exports_guard.ShiftLeft(rightRest, (head, tail) => ElementsLeft(inferred, reversed, leftRest, head, tail), () => exports_guard.IsEqual(leftRest.length, 0) ? ExtendsTrue(inferred) : ExtendsFalse());
}
function Elements(inferred, reversed, leftRest, rightRest) {
  return ElementsRight(inferred, reversed, leftRest, rightRest);
}
function ExtendsTupleToTuple(inferred, left, right) {
  const instantiatedRight = InstantiateElements(inferred, State([], []), right);
  const reversed = Reversed(instantiatedRight);
  return Elements(inferred, reversed, ApplyReverse(left, reversed), ApplyReverse(instantiatedRight, reversed));
}
function ExtendsTupleToArray(inferred, left, right) {
  const inferrable = TryInferable(right);
  return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable["name"], left, inferrable["type"]) : exports_guard.ShiftLeft(left, (head, tail) => Match3(ExtendsLeft(inferred, head, right), (inferred2) => ExtendsTupleToArray(inferred2, tail, right), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsTuple(inferred, left, right) {
  const instantiatedLeft = InstantiateElements(inferred, State([], []), left);
  return IsTuple(right) ? ExtendsTupleToTuple(inferred, instantiatedLeft, right.items) : IsArray2(right) ? ExtendsTupleToArray(inferred, instantiatedLeft, right.items) : ExtendsRight(inferred, Tuple(instantiatedLeft), right);
}
var init_tuple2 = __esm(() => {
  init_guard2();
  init_schema();
  init_array();
  init_tuple();
  init_extends_left();
  init_extends_right();
  init_result();
  init_instantiate27();
  init_instantiate27();
  init_inference();
});

// node_modules/typebox/build/type/extends/undefined.mjs
function ExtendsUndefined(inferred, left, right) {
  return IsVoid(right) ? ExtendsTrue(inferred) : IsUndefined2(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_undefined2 = __esm(() => {
  init_undefined();
  init_void();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/union.mjs
function ExtendsUnionSome(inferred, type, unionTypes) {
  return exports_guard.ShiftLeft(unionTypes, (head, tail) => Match3(ExtendsLeft(inferred, type, head), (inferred2) => ExtendsTrue(inferred2), () => ExtendsUnionSome(inferred, type, tail)), () => ExtendsFalse());
}
function ExtendsUnionLeft(inferred, left, right) {
  return exports_guard.ShiftLeft(left, (head, tail) => Match3(ExtendsUnionSome(inferred, head, right), (inferred2) => ExtendsUnionLeft(inferred2, tail, right), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsUnion2(inferred, left, right) {
  const inferrable = TryInferable(right);
  return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable.name, left, inferrable.type) : IsUnion(right) ? ExtendsUnionLeft(inferred, left, right.anyOf) : ExtendsUnionLeft(inferred, left, [right]);
}
var init_union2 = __esm(() => {
  init_guard2();
  init_union();
  init_extends_left();
  init_result();
  init_inference();
});

// node_modules/typebox/build/type/extends/unknown.mjs
function ExtendsUnknown(inferred, left, right) {
  return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}
var init_unknown2 = __esm(() => {
  init_any();
  init_unknown();
  init_infer();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/void.mjs
function ExtendsVoid(inferred, left, right) {
  return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
var init_void2 = __esm(() => {
  init_void();
  init_extends_right();
  init_result();
});

// node_modules/typebox/build/type/extends/extends_left.mjs
function ExtendsLeft(inferred, left, right) {
  return IsAny(left) ? ExtendsAny(inferred, left, right) : IsArray2(left) ? ExtendsArray(inferred, left, left.items, right) : IsBigInt2(left) ? ExtendsBigInt(inferred, left, right) : IsBoolean3(left) ? ExtendsBoolean(inferred, left, right) : IsConstructor2(left) ? ExtendsConstructor(inferred, left.parameters, left.instanceType, right) : IsDependent(left) ? ExtendsDependent(inferred, left.if, left.then, left.else, right) : IsEnum(left) ? ExtendsEnum(inferred, left.enum, right) : IsFunction2(left) ? ExtendsFunction(inferred, left.parameters, left.returnType, right) : IsInteger2(left) ? ExtendsInteger(inferred, left, right) : IsIntersect(left) ? ExtendsIntersect(inferred, left.allOf, right) : IsLiteral(left) ? ExtendsLiteral(inferred, left, right) : IsNever(left) ? ExtendsNever(inferred, left, right) : IsNull2(left) ? ExtendsNull(inferred, left, right) : IsNumber3(left) ? ExtendsNumber(inferred, left, right) : IsObject2(left) ? ExtendsObject(inferred, left.properties, right) : IsRecord(left) ? ExtendsRecord(inferred, RecordPattern(left), RecordValue(left), right) : IsString3(left) ? ExtendsString(inferred, left, right) : IsSymbol2(left) ? ExtendsSymbol(inferred, left, right) : IsTemplateLiteral(left) ? ExtendsTemplateLiteral(inferred, left.pattern, right) : IsTuple(left) ? ExtendsTuple(inferred, left.items, right) : IsUndefined2(left) ? ExtendsUndefined(inferred, left, right) : IsUnion(left) ? ExtendsUnion2(inferred, left.anyOf, right) : IsUnknown(left) ? ExtendsUnknown(inferred, left, right) : IsVoid(left) ? ExtendsVoid(inferred, left, right) : ExtendsFalse();
}
var init_extends_left = __esm(() => {
  init_any2();
  init_array2();
  init_bigint3();
  init_boolean2();
  init_constructor2();
  init_dependent2();
  init_enum2();
  init_function2();
  init_integer3();
  init_intersect2();
  init_literal2();
  init_never2();
  init_null2();
  init_number3();
  init_object2();
  init_record2();
  init_string3();
  init_symbol2();
  init_template_literal2();
  init_tuple2();
  init_undefined2();
  init_union2();
  init_unknown2();
  init_void2();
  init_any();
  init_array();
  init_bigint();
  init_boolean();
  init_constructor();
  init_dependent();
  init_enum();
  init_function();
  init_integer();
  init_intersect();
  init_literal();
  init_never();
  init_null();
  init_number();
  init_object();
  init_record();
  init_string();
  init_symbol();
  init_template_literal();
  init_tuple();
  init_undefined();
  init_unknown();
  init_union();
  init_void();
  init_result();
});

// node_modules/typebox/build/type/engine/interface/instantiate.mjs
function InterfaceOperation(heritage, properties2) {
  const result = EvaluateIntersect([...heritage, _Object_(properties2)]);
  return result;
}
function InterfaceAction(heritage, properties2, options) {
  const result = CanInstantiate(heritage) ? exports_memory.Update(InterfaceOperation(heritage, properties2), {}, options) : InterfaceDeferred(heritage, properties2, options);
  return result;
}
function InterfaceInstantiate(context, state, heritage, properties2, options) {
  const instantiatedHeritage = InstantiateTypes(context, state, heritage);
  const instantiatedProperties = InstantiateProperties(context, state, properties2);
  return InterfaceAction(instantiatedHeritage, instantiatedProperties, options);
}
var init_instantiate3 = __esm(() => {
  init_memory2();
  init_object();
  init_evaluate2();
  init_action();
  init_instantiate27();
  init_instantiate27();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/interface.mjs
function InterfaceDeferred(heritage, properties2, options = {}) {
  return Deferred("Interface", [heritage, properties2], options);
}
function IsInterfaceDeferred(value) {
  return IsSchema(value) && exports_guard.HasPropertyKey(value, "action") && exports_guard.IsEqual(value.action, "Interface");
}
function Interface(heritage, properties2, options = {}) {
  return InterfaceAction(heritage, properties2, options);
}
var init_interface = __esm(() => {
  init_guard2();
  init_schema();
  init_deferred();
  init_instantiate3();
});

// node_modules/typebox/build/type/engine/cyclic/check.mjs
function FromRef(stack, context, ref2) {
  return stack.includes(ref2) ? true : FromType3([...stack, ref2], context, context[ref2]);
}
function FromProperties(stack, context, properties2) {
  const types = PropertyValues(properties2);
  return FromTypes2(stack, context, types);
}
function FromTypes2(stack, context, types) {
  return exports_guard.ShiftLeft(types, (left, right) => FromType3(stack, context, left) ? true : FromTypes2(stack, context, right), () => false);
}
function FromType3(stack, context, type) {
  return IsRef(type) ? FromRef(stack, context, type.$ref) : IsArray2(type) ? FromType3(stack, context, type.items) : IsConstructor2(type) ? FromTypes2(stack, context, [...type.parameters, type.instanceType]) : IsFunction2(type) ? FromTypes2(stack, context, [...type.parameters, type.returnType]) : IsInterfaceDeferred(type) ? FromProperties(stack, context, type.parameters[1]) : IsIntersect(type) ? FromTypes2(stack, context, type.allOf) : IsObject2(type) ? FromProperties(stack, context, type.properties) : IsUnion(type) ? FromTypes2(stack, context, type.anyOf) : IsTuple(type) ? FromTypes2(stack, context, type.items) : IsRecord(type) ? FromType3(stack, context, RecordValue(type)) : false;
}
function CyclicCheck(stack, context, type) {
  const result = FromType3(stack, context, type);
  return result;
}
var init_check = __esm(() => {
  init_guard2();
  init_array();
  init_constructor();
  init_function();
  init_intersect();
  init_object();
  init_properties();
  init_record();
  init_tuple();
  init_union();
  init_ref();
  init_interface();
});

// node_modules/typebox/build/type/engine/cyclic/candidates.mjs
function ResolveCandidateKeys(context, keys) {
  return keys.reduce((result, left) => {
    return CyclicCheck([left], context, context[left]) ? [...result, left] : result;
  }, []);
}
function CyclicCandidates(context) {
  const keys = PropertyKeys(context);
  const result = ResolveCandidateKeys(context, keys);
  return result;
}
var init_candidates = __esm(() => {
  init_properties();
  init_check();
});

// node_modules/typebox/build/type/engine/cyclic/dependencies.mjs
function FromRef2(context, ref2, result) {
  return result.includes(ref2) ? result : (ref2 in context) ? FromType4(context, context[ref2], [...result, ref2]) : Unreachable();
}
function FromProperties2(context, properties2, result) {
  const types = PropertyValues(properties2);
  return FromTypes3(context, types, result);
}
function FromTypes3(context, types, result) {
  return types.reduce((result2, left) => {
    return FromType4(context, left, result2);
  }, result);
}
function FromType4(context, type, result) {
  return IsRef(type) ? FromRef2(context, type.$ref, result) : IsArray2(type) ? FromType4(context, type.items, result) : IsConstructor2(type) ? FromTypes3(context, [...type.parameters, type.instanceType], result) : IsFunction2(type) ? FromTypes3(context, [...type.parameters, type.returnType], result) : IsInterfaceDeferred(type) ? FromProperties2(context, type.parameters[1], result) : IsIntersect(type) ? FromTypes3(context, type.allOf, result) : IsObject2(type) ? FromProperties2(context, type.properties, result) : IsUnion(type) ? FromTypes3(context, type.anyOf, result) : IsTuple(type) ? FromTypes3(context, type.items, result) : IsRecord(type) ? FromType4(context, RecordValue(type), result) : result;
}
function CyclicDependencies(context, key, type) {
  const result = FromType4(context, type, [key]);
  return result;
}
var init_dependencies = __esm(() => {
  init_unreachable();
  init_array();
  init_constructor();
  init_function();
  init_intersect();
  init_object();
  init_properties();
  init_record();
  init_tuple();
  init_union();
  init_ref();
  init_interface();
});

// node_modules/typebox/build/type/engine/cyclic/extends.mjs
function FromRef3(_ref) {
  return Any();
}
function FromProperties3(properties2) {
  return exports_guard.Keys(properties2).reduce((result, key) => {
    return { ...result, [key]: FromType5(properties2[key]) };
  }, {});
}
function FromTypes4(types) {
  return types.reduce((result, left) => {
    return [...result, FromType5(left)];
  }, []);
}
function FromType5(type) {
  return IsRef(type) ? FromRef3(type.$ref) : IsArray2(type) ? _Array_(FromType5(type.items), ArrayOptions(type)) : IsConstructor2(type) ? Constructor(FromTypes4(type.parameters), FromType5(type.instanceType)) : IsFunction2(type) ? _Function_(FromTypes4(type.parameters), FromType5(type.returnType)) : IsIntersect(type) ? Intersect(FromTypes4(type.allOf)) : IsObject2(type) ? _Object_(FromProperties3(type.properties)) : IsRecord(type) ? Record(RecordKey(type), FromType5(RecordValue(type))) : IsUnion(type) ? Union(FromTypes4(type.anyOf)) : IsTuple(type) ? Tuple(FromTypes4(type.items)) : type;
}
function CyclicAnyFromParameters(defs, ref2) {
  return ref2 in defs ? FromType5(defs[ref2]) : Unknown();
}
function CyclicExtends(type) {
  return CyclicAnyFromParameters(type.$defs, type.$ref);
}
var init_extends = __esm(() => {
  init_guard2();
  init_any();
  init_array();
  init_constructor();
  init_function();
  init_intersect();
  init_object();
  init_record();
  init_ref();
  init_tuple();
  init_union();
  init_unknown();
});

// node_modules/typebox/build/type/engine/cyclic/instantiate.mjs
function CyclicInterface(context, heritage, properties2) {
  const instantiatedHeritage = InstantiateTypes(context, State([], []), heritage);
  const instantiatedProperties = InstantiateProperties({}, State([], []), properties2);
  const evaluatedInterface = EvaluateIntersect([...instantiatedHeritage, _Object_(instantiatedProperties)]);
  return evaluatedInterface;
}
function CyclicDefinitions(context, dependencies) {
  const keys = exports_guard.Keys(context).filter((key) => dependencies.includes(key));
  return keys.reduce((result, key) => {
    const type = context[key];
    const instantiatedType = IsInterfaceDeferred(type) ? CyclicInterface(context, type.parameters[0], type.parameters[1]) : type;
    return { ...result, [key]: instantiatedType };
  }, {});
}
function InstantiateCyclic(context, ref2, type) {
  const dependencies = CyclicDependencies(context, ref2, type);
  const definitions = CyclicDefinitions(context, dependencies);
  const result = Cyclic(definitions, ref2);
  return result;
}
var init_instantiate4 = __esm(() => {
  init_guard2();
  init_cyclic();
  init_object();
  init_dependencies();
  init_action();
  init_instantiate27();
  init_instantiate27();
  init_instantiate27();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/cyclic/target.mjs
function Resolve(defs, ref2) {
  return ref2 in defs ? IsRef(defs[ref2]) ? Resolve(defs, defs[ref2].$ref) : defs[ref2] : Never();
}
function CyclicTarget(defs, ref2) {
  const result = Resolve(defs, ref2);
  return result;
}
var init_target = __esm(() => {
  init_never();
  init_ref();
});

// node_modules/typebox/build/type/engine/cyclic/index.mjs
var init_cyclic2 = __esm(() => {
  init_candidates();
  init_check();
  init_dependencies();
  init_extends();
  init_instantiate4();
  init_target();
});

// node_modules/typebox/build/type/extends/extends.mjs
function Canonical(type) {
  return IsCyclic(type) ? CyclicExtends(type) : IsUnsafe(type) ? Unknown() : type;
}
function Extends(inferred, left, right) {
  const canonicalLeft = Canonical(left);
  const canonicalRight = Canonical(right);
  return ExtendsLeft(inferred, canonicalLeft, canonicalRight);
}
var init_extends2 = __esm(() => {
  init_cyclic();
  init_unknown();
  init_unsafe();
  init_extends_left();
  init_cyclic2();
});

// node_modules/typebox/build/type/extends/index.mjs
var init_extends3 = __esm(() => {
  init_extends2();
  init_result();
});

// node_modules/typebox/build/type/engine/evaluate/compare.mjs
function Compare(left, right) {
  const extendsCheck = [
    IsUnknown(left) ? exports_result.ExtendsFalse() : Extends({}, left, right),
    IsUnknown(left) ? exports_result.ExtendsTrue({}) : Extends({}, right, left)
  ];
  return exports_result.IsExtendsTrueLike(extendsCheck[0]) && exports_result.IsExtendsTrueLike(extendsCheck[1]) ? ResultEqual : exports_result.IsExtendsTrueLike(extendsCheck[0]) && exports_result.IsExtendsFalse(extendsCheck[1]) ? ResultLeftInside : exports_result.IsExtendsFalse(extendsCheck[0]) && exports_result.IsExtendsTrueLike(extendsCheck[1]) ? ResultRightInside : ResultDisjoint;
}
var ResultEqual = "equal", ResultDisjoint = "disjoint", ResultLeftInside = "left-inside", ResultRightInside = "right-inside";
var init_compare = __esm(() => {
  init_unknown();
  init_extends3();
});

// node_modules/typebox/build/type/engine/evaluate/broaden.mjs
function BroadFilter(type, types) {
  return types.filter((left) => {
    return Compare(type, left) === ResultRightInside ? false : true;
  });
}
function IsBroadestType(type, types) {
  const result = types.some((left) => {
    const result2 = Compare(type, left);
    return exports_guard.IsEqual(result2, ResultLeftInside) || exports_guard.IsEqual(result2, ResultEqual);
  });
  return exports_guard.IsEqual(result, false);
}
function BroadenType(type, types) {
  const evaluated = EvaluateType(type);
  return IsAny(evaluated) ? [evaluated] : IsBroadestType(evaluated, types) ? [...BroadFilter(evaluated, types), evaluated] : types;
}
function BroadenTypes(types) {
  return types.reduce((result, left) => {
    return IsObject2(left) ? [...result, left] : IsNever(left) ? result : BroadenType(left, result);
  }, []);
}
function Broaden(types) {
  const broadened = BroadenTypes(types);
  const flattened = Flatten(broadened);
  return flattened;
}
var init_broaden = __esm(() => {
  init_guard2();
  init_any();
  init_never();
  init_object();
  init_compare();
  init_flatten();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/evaluate/instantiate.mjs
function EvaluateAction(type, options) {
  const result = exports_memory.Update(EvaluateType(type), {}, options);
  return result;
}
function EvaluateInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return EvaluateAction(instantiatedType, options);
}
var init_instantiate5 = __esm(() => {
  init_memory2();
  init_instantiate27();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/evaluate/index.mjs
var init_evaluate3 = __esm(() => {
  init_broaden();
  init_compare();
  init_composite();
  init_distribute();
  init_evaluate2();
  init_flatten();
  init_instantiate5();
  init_narrow();
});

// node_modules/typebox/build/type/engine/call/distribute_arguments.mjs
function CollectDistributionNames(expression, result = []) {
  return IsDeferred(expression) && exports_guard.IsEqual(expression.action, "Conditional") ? IsRef(expression.parameters[0]) ? CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], [...result, expression.parameters[0]["$ref"]])) : CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], result)) : IsDeferred(expression) && exports_guard.IsEqual(expression.action, "Mapped") ? IsDeferred(expression.parameters[1]) && exports_guard.IsEqual(expression.parameters[1].action, "KeyOf") && IsRef(expression.parameters[1].parameters[0]) ? [...result, expression.parameters[1].parameters[0]["$ref"]] : result : result;
}
function BuildDistributionArray(parameters, names) {
  return parameters.reduce((result, left) => [...result, names.includes(left.name)], []);
}
function ZipDistributionArray(arguments_, distributionArray, result = []) {
  return exports_guard.ShiftLeft(arguments_, (argumentLeft, argumentRight) => exports_guard.ShiftLeft(distributionArray, (booleanLeft, booleanRight) => ZipDistributionArray(argumentRight, booleanRight, [...result, [booleanLeft, argumentLeft]]), () => result), () => result);
}
function Expand(type) {
  return IsUnion(type) ? [...type.anyOf] : [type];
}
function Append(current, type) {
  return current.reduce((result, left) => [...result, [...left, type]], []);
}
function Cross(current, variants) {
  return variants.reduce((result, left) => {
    return [...result, ...Append(current, left)];
  }, []);
}
function Distribute2(zipped) {
  return zipped.reduce((result, left) => {
    return exports_guard.IsEqual(left[0], true) ? Cross(result, Expand(left[1])) : Cross(result, [left[1]]);
  }, [[]]);
}
function DistributeArguments(parameters, arguments_, expression) {
  const distributionNames = CollectDistributionNames(expression);
  const distributionArray = BuildDistributionArray(parameters, distributionNames);
  const zippedArguments = ZipDistributionArray(arguments_, distributionArray);
  return IsDeferred(expression) && exports_guard.IsEqual(expression.action, "Conditional") ? Distribute2(zippedArguments) : IsDeferred(expression) && exports_guard.IsEqual(expression.action, "Mapped") ? Distribute2(zippedArguments) : [arguments_];
}
var init_distribute_arguments = __esm(() => {
  init_guard2();
  init_union();
  init_deferred();
  init_ref();
});

// node_modules/typebox/build/type/engine/call/resolve_target.mjs
function FromNotResolvable() {
  return ["(not-resolvable)", Never()];
}
function FromNotGeneric() {
  return ["(not-generic)", Never()];
}
function FromGeneric(name, parameters, expression) {
  return [name, Generic(parameters, expression)];
}
function FromRef4(context, ref2, arguments_) {
  return ref2 in context ? FromType6(context, ref2, context[ref2], arguments_) : FromNotResolvable();
}
function FromType6(context, name, target2, arguments_) {
  return IsGeneric(target2) ? FromGeneric(name, target2.parameters, target2.expression) : IsRef(target2) ? FromRef4(context, target2.$ref, arguments_) : FromNotGeneric();
}
function ResolveTarget(context, target2, arguments_) {
  return FromType6(context, "(anonymous)", target2, arguments_);
}
var init_resolve_target = __esm(() => {
  init_generic();
  init_ref();
  init_never();
});

// node_modules/typebox/build/type/engine/call/resolve_arguments.mjs
function AssertArgumentExtends(name, type, extends_) {
  if (IsInfer(type) || IsCall(type) || exports_result.IsExtendsTrueLike(Extends({}, type, extends_)))
    return;
  const cause = { parameter: name, expect: extends_, actual: type };
  throw new Error(`Argument for parameter ${name} does not satisfy constraint`, { cause });
}
function BindArgument(context, state, name, extends_, type) {
  const instantiatedArgument = InstantiateType(context, state, type);
  AssertArgumentExtends(name, instantiatedArgument, extends_);
  return exports_memory.Assign(context, { [name]: instantiatedArgument });
}
function BindArguments(context, state, parameterLeft, parameterRight, arguments_) {
  const instantiatedExtends = InstantiateType(context, state, parameterLeft.extends);
  const instantiatedEquals = InstantiateType(context, state, parameterLeft.equals);
  return exports_guard.ShiftLeft(arguments_, (left, right) => BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, left), state, parameterRight, right), () => BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, instantiatedEquals), state, parameterRight, []));
}
function BindParameters(context, state, parameters, arguments_) {
  return exports_guard.ShiftLeft(parameters, (left, right) => BindArguments(context, state, left, right, arguments_), () => context);
}
function ResolveArgumentsContext(context, state, parameters, arguments_) {
  return BindParameters(context, state, parameters, arguments_);
}
var init_resolve_arguments = __esm(() => {
  init_guard2();
  init_memory2();
  init_instantiate27();
  init_extends3();
  init_infer();
  init_call();
});

// node_modules/typebox/build/type/engine/call/instantiate.mjs
function Peek(state) {
  const result = exports_guard.IsGreaterThan(state.callstack.length, 0) ? state.callstack[state.callstack.length - 1] : "";
  return result;
}
function IsTailCall(state, name) {
  const result = exports_guard.IsEqual(Peek(state), name);
  return result;
}
function CallDispatch(context, state, target2, parameters, expression, arguments_) {
  const argumentsContext = ResolveArgumentsContext(context, state, parameters, arguments_);
  const returnType = InstantiateType(argumentsContext, State([...state["callstack"], target2["$ref"]], state["visited"]), expression);
  return InstantiateType(argumentsContext, State([], []), returnType);
}
function CallDistributed(context, state, target2, parameters, expression, distributedArguments) {
  return distributedArguments.reduce((result, arguments_) => [...result, CallDispatch(context, state, target2, parameters, expression, arguments_)], []);
}
function CallImmediate(context, state, target2, parameters, expression, arguments_) {
  const distributedArguments = DistributeArguments(parameters, arguments_, expression);
  const returnTypes = CallDistributed(context, state, target2, parameters, expression, distributedArguments);
  const result = exports_guard.IsEqual(returnTypes.length, 1) ? returnTypes[0] : EvaluateUnion(returnTypes);
  return result;
}
function CallInstantiate(context, state, target2, arguments_) {
  const instantiatedArguments = InstantiateTypes(context, state, arguments_);
  const resolved = ResolveTarget(context, target2, arguments_);
  const name = resolved[0];
  const type = resolved[1];
  const result = IsGeneric(type) ? IsTailCall(state, name) ? CallConstruct(Ref(name), instantiatedArguments) : CallImmediate(context, state, Ref(name), type.parameters, type.expression, instantiatedArguments) : CallConstruct(target2, instantiatedArguments);
  return result;
}
var init_instantiate6 = __esm(() => {
  init_guard2();
  init_call();
  init_ref();
  init_generic();
  init_evaluate3();
  init_instantiate27();
  init_instantiate27();
  init_instantiate27();
  init_distribute_arguments();
  init_resolve_target();
  init_resolve_arguments();
});

// node_modules/typebox/build/type/types/call.mjs
function CallConstruct(target2, arguments_) {
  return exports_memory.Create({ ["~kind"]: "Call" }, { type: "call", target: target2, arguments: arguments_ }, {});
}
function Call(target2, arguments_) {
  return CallInstantiate({}, State([], []), target2, arguments_);
}
function IsCall(value) {
  return IsKind(value, "Call");
}
var init_call = __esm(() => {
  init_memory2();
  init_schema();
  init_instantiate6();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/immutable/instantiate_remove.mjs
function RemoveImmutableOperation(type) {
  return exports_memory.Discard(type, ["~immutable"]);
}
function RemoveImmutableAction(type, options) {
  const result = exports_memory.Update(RemoveImmutableOperation(type), {}, options);
  return result;
}
function RemoveImmutableInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return RemoveImmutableAction(instantiatedType, options);
}
var init_instantiate_remove3 = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/intrinsics/mapping.mjs
function ApplyMapping(mapping, value) {
  return mapping(value);
}

// node_modules/typebox/build/type/engine/intrinsics/from_literal.mjs
function FromLiteral3(mapping, value) {
  return exports_guard.IsString(value) ? Literal(ApplyMapping(mapping, value)) : Literal(value);
}
var init_from_literal = __esm(() => {
  init_guard2();
  init_literal();
});

// node_modules/typebox/build/type/engine/intrinsics/from_template_literal.mjs
function FromTemplateLiteral(mapping, pattern) {
  const evaluated = EvaluateTemplateLiteral(pattern);
  const result = FromType7(mapping, evaluated);
  return result;
}
var init_from_template_literal = __esm(() => {
  init_from_type();
  init_evaluate3();
});

// node_modules/typebox/build/type/engine/intrinsics/from_union.mjs
function FromUnion2(mapping, types) {
  const result = types.map((type) => FromType7(mapping, type));
  return Union(result);
}
var init_from_union = __esm(() => {
  init_union();
  init_from_type();
});

// node_modules/typebox/build/type/engine/intrinsics/from_type.mjs
function FromType7(mapping, type) {
  return IsLiteral(type) ? FromLiteral3(mapping, type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral(mapping, type.pattern) : IsUnion(type) ? FromUnion2(mapping, type.anyOf) : type;
}
var init_from_type = __esm(() => {
  init_literal();
  init_template_literal();
  init_union();
  init_from_literal();
  init_from_template_literal();
  init_from_union();
});

// node_modules/typebox/build/type/action/capitalize.mjs
function CapitalizeDeferred(type, options = {}) {
  return Deferred("Capitalize", [type], options);
}
function Capitalize(type, options = {}) {
  return CapitalizeAction(type, options);
}
var init_capitalize = __esm(() => {
  init_deferred();
  init_instantiate7();
});

// node_modules/typebox/build/type/action/lowercase.mjs
function LowercaseDeferred(type, options = {}) {
  return Deferred("Lowercase", [type], options);
}
function Lowercase(type, options = {}) {
  return LowercaseAction(type, options);
}
var init_lowercase = __esm(() => {
  init_deferred();
  init_instantiate7();
});

// node_modules/typebox/build/type/action/uncapitalize.mjs
function UncapitalizeDeferred(type, options = {}) {
  return Deferred("Uncapitalize", [type], options);
}
function Uncapitalize(type, options = {}) {
  return UncapitalizeAction(type, options);
}
var init_uncapitalize = __esm(() => {
  init_deferred();
  init_instantiate7();
});

// node_modules/typebox/build/type/action/uppercase.mjs
function UppercaseDeferred(type, options = {}) {
  return Deferred("Uppercase", [type], options);
}
function Uppercase(type, options = {}) {
  return UppercaseAction(type, options);
}
var init_uppercase = __esm(() => {
  init_deferred();
  init_instantiate7();
});

// node_modules/typebox/build/type/engine/intrinsics/instantiate.mjs
function CapitalizeAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType7(CapitalizeMapping, type), {}, options) : CapitalizeDeferred(type, options);
  return result;
}
function LowercaseAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType7(LowercaseMapping, type), {}, options) : LowercaseDeferred(type, options);
  return result;
}
function UncapitalizeAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType7(UncapitalizeMapping, type), {}, options) : UncapitalizeDeferred(type, options);
  return result;
}
function UppercaseAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType7(UppercaseMapping, type), {}, options) : UppercaseDeferred(type, options);
  return result;
}
function CapitalizeInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return CapitalizeAction(instantiatedType, options);
}
function LowercaseInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return LowercaseAction(instantiatedType, options);
}
function UncapitalizeInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return UncapitalizeAction(instantiatedType, options);
}
function UppercaseInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return UppercaseAction(instantiatedType, options);
}
var CapitalizeMapping = (input) => input[0].toUpperCase() + input.slice(1), LowercaseMapping = (input) => input.toLowerCase(), UncapitalizeMapping = (input) => input[0].toLowerCase() + input.slice(1), UppercaseMapping = (input) => input.toUpperCase();
var init_instantiate7 = __esm(() => {
  init_memory2();
  init_from_type();
  init_instantiate27();
  init_capitalize();
  init_lowercase();
  init_uncapitalize();
  init_uppercase();
});

// node_modules/typebox/build/type/action/conditional.mjs
function ConditionalDeferred(left, right, true_, false_, options = {}) {
  return Deferred("Conditional", [left, right, true_, false_], options);
}
function Conditional(left, right, true_, false_, options = {}) {
  return ConditionalAction({}, State([], []), left, right, true_, false_, options);
}
var init_conditional = __esm(() => {
  init_deferred();
  init_instantiate8();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/conditional/instantiate.mjs
function ConditionalOperation(context, state, left, right, true_, false_) {
  const extendsResult = Extends(context, left, right);
  return exports_result.IsExtendsUnion(extendsResult) ? Union([InstantiateType(extendsResult.inferred, state, true_), InstantiateType(context, state, false_)]) : exports_result.IsExtendsTrue(extendsResult) ? InstantiateType(extendsResult.inferred, state, true_) : InstantiateType(context, state, false_);
}
function ConditionalAction(context, state, left, right, true_, false_, options) {
  const result = CanInstantiate([left, right]) ? exports_memory.Update(ConditionalOperation(context, state, left, right, true_, false_), {}, options) : ConditionalDeferred(left, right, true_, false_, options);
  return result;
}
function ConditionalInstantiate(context, state, left, right, true_, false_, options) {
  const instantiatedLeft = InstantiateType(context, state, left);
  const instantiatedRight = InstantiateType(context, state, right);
  return ConditionalAction(context, state, instantiatedLeft, instantiatedRight, true_, false_, options);
}
var init_instantiate8 = __esm(() => {
  init_memory2();
  init_union();
  init_extends3();
  init_instantiate27();
  init_conditional();
});

// node_modules/typebox/build/type/engine/conditional/index.mjs
var init_conditional2 = __esm(() => {
  init_instantiate8();
});

// node_modules/typebox/build/type/action/constructor_parameters.mjs
function ConstructorParametersDeferred(type, options = {}) {
  return Deferred("ConstructorParameters", [type], options);
}
function ConstructorParameters(type, options = {}) {
  return ConstructorParametersAction(type, options);
}
var init_constructor_parameters = __esm(() => {
  init_deferred();
  init_instantiate9();
});

// node_modules/typebox/build/type/engine/constructor_parameters/instantiate.mjs
function ConstructorParametersOperation(type) {
  const parameters = IsConstructor2(type) ? type["parameters"] : [];
  const instantiatedParameters = InstantiateElements({}, State([], []), parameters);
  const result = Tuple(instantiatedParameters);
  return result;
}
function ConstructorParametersAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(ConstructorParametersOperation(type), {}, options) : ConstructorParametersDeferred(type, options);
  return result;
}
function ConstructorParametersInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return ConstructorParametersAction(instantiatedType, options);
}
var init_instantiate9 = __esm(() => {
  init_memory2();
  init_constructor();
  init_tuple();
  init_constructor_parameters();
  init_instantiate27();
  init_instantiate27();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/exclude.mjs
function ExcludeDeferred(left, right, options = {}) {
  return Deferred("Exclude", [left, right], options);
}
function Exclude(left, right, options = {}) {
  return ExcludeAction(left, right, options);
}
var init_exclude = __esm(() => {
  init_deferred();
  init_instantiate10();
});

// node_modules/typebox/build/type/engine/exclude/instantiate.mjs
function ExcludeAction(left, right, options) {
  const result = CanInstantiate([left, right]) ? exports_memory.Update(ExcludeOperation(left, right), {}, options) : ExcludeDeferred(left, right, options);
  return result;
}
function ExcludeInstantiate(context, state, left, right, options) {
  const instantiatedLeft = InstantiateType(context, state, left);
  const instantiatedRight = InstantiateType(context, state, right);
  return ExcludeAction(instantiatedLeft, instantiatedRight, options);
}
var init_instantiate10 = __esm(() => {
  init_memory2();
  init_instantiate27();
  init_exclude();
  init_operation();
});

// node_modules/typebox/build/type/action/extract.mjs
function ExtractDeferred(left, right, options = {}) {
  return Deferred("Extract", [left, right], options);
}
function Extract(left, right, options = {}) {
  return ExtractAction(left, right, options);
}
var init_extract = __esm(() => {
  init_deferred();
  init_instantiate11();
});

// node_modules/typebox/build/type/engine/extract/operation.mjs
function ExtractType(left, right) {
  const check2 = Extends({}, left, right);
  const result = exports_result.IsExtendsTrueLike(check2) ? [left] : [];
  return result;
}
function ExtractUnion(types, right) {
  return types.reduce((result, head) => {
    return [...result, ...ExtractType(head, right)];
  }, []);
}
function ExtractOperation(left, right) {
  const evaluated = EvaluateType(left);
  const canonical = IsUnion(evaluated) ? evaluated.anyOf : [evaluated];
  const remaining = ExtractUnion(canonical, right);
  const result = EvaluateUnion(remaining);
  return result;
}
var init_operation2 = __esm(() => {
  init_union();
  init_extends3();
  init_evaluate2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/extract/instantiate.mjs
function ExtractAction(left, right, options) {
  const result = CanInstantiate([left, right]) ? exports_memory.Update(ExtractOperation(left, right), {}, options) : ExtractDeferred(left, right, options);
  return result;
}
function ExtractInstantiate(context, state, left, right, options) {
  const instantiatedLeft = InstantiateType(context, state, left);
  const instantiatedRight = InstantiateType(context, state, right);
  return ExtractAction(instantiatedLeft, instantiatedRight, options);
}
var init_instantiate11 = __esm(() => {
  init_memory2();
  init_instantiate27();
  init_extract();
  init_operation2();
});

// node_modules/typebox/build/type/engine/helpers/keys_to_indexer.mjs
function KeysToLiterals(keys) {
  return keys.reduce((result, left) => {
    return IsLiteralValue(left) ? [...result, Literal(left)] : result;
  }, []);
}
function KeysToIndexer(keys) {
  const literals = KeysToLiterals(keys);
  const result = Union(literals);
  return result;
}
var init_keys_to_indexer = __esm(() => {
  init_literal();
  init_union();
});

// node_modules/typebox/build/type/action/indexed.mjs
function IndexDeferred(type, indexer, options = {}) {
  return Deferred("Index", [type, indexer], options);
}
function Index(type, indexer_or_keys, options = {}) {
  const indexer = exports_guard.IsArray(indexer_or_keys) ? KeysToIndexer(indexer_or_keys) : indexer_or_keys;
  return IndexAction(type, indexer, options);
}
var init_indexed = __esm(() => {
  init_guard2();
  init_deferred();
  init_keys_to_indexer();
  init_instantiate12();
});

// node_modules/typebox/build/type/engine/object/from_cyclic.mjs
function FromCyclic(defs, ref2) {
  const target2 = CyclicTarget(defs, ref2);
  const result = FromType8(target2);
  return result;
}
var init_from_cyclic = __esm(() => {
  init_from_type2();
  init_target();
});

// node_modules/typebox/build/type/engine/object/from_dependent.mjs
function FromDependent(if_, then_, else_) {
  const evaluated = EvaluateDependent(if_, then_, else_);
  const result = FromType8(evaluated);
  return result;
}
var init_from_dependent = __esm(() => {
  init_from_type2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/object/from_intersect.mjs
function CollapseIntersectProperties(left, right) {
  const leftKeys = exports_guard.Keys(left).filter((key) => !exports_guard.HasPropertyKey(right, key));
  const rightKeys = exports_guard.Keys(right).filter((key) => !exports_guard.HasPropertyKey(left, key));
  const sharedKeys = exports_guard.Keys(left).filter((key) => exports_guard.HasPropertyKey(right, key));
  const leftProperties = leftKeys.reduce((result, key) => ({ ...result, [key]: left[key] }), {});
  const rightProperties = rightKeys.reduce((result, key) => ({ ...result, [key]: right[key] }), {});
  const sharedProperties = sharedKeys.reduce((result, key) => ({ ...result, [key]: EvaluateIntersect([left[key], right[key]]) }), {});
  const unique = exports_memory.Assign(leftProperties, rightProperties);
  const shared2 = exports_memory.Assign(unique, sharedProperties);
  return shared2;
}
function FromIntersect(types) {
  return types.reduce((result, left) => {
    return CollapseIntersectProperties(result, FromType8(left));
  }, {});
}
var init_from_intersect = __esm(() => {
  init_memory2();
  init_guard2();
  init_from_type2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/object/from_object.mjs
function FromObject3(properties2) {
  return properties2;
}

// node_modules/typebox/build/type/engine/object/from_tuple.mjs
function FromTuple(types) {
  const object2 = TupleToObject(Tuple(types));
  const result = FromType8(object2);
  return result;
}
var init_from_tuple = __esm(() => {
  init_tuple();
  init_to_object();
  init_from_type2();
});

// node_modules/typebox/build/type/engine/object/from_union.mjs
function CollapseUnionProperties(left, right) {
  const sharedKeys = exports_guard.Keys(left).filter((key) => (key in right));
  const result = sharedKeys.reduce((result2, key) => {
    return { ...result2, [key]: EvaluateUnion([left[key], right[key]]) };
  }, {});
  return result;
}
function ReduceVariants(types, result) {
  return exports_guard.ShiftLeft(types, (left, right) => ReduceVariants(right, CollapseUnionProperties(result, FromType8(left))), () => result);
}
function FromUnion3(types) {
  return exports_guard.ShiftLeft(types, (left, right) => ReduceVariants(right, FromType8(left)), () => Unreachable());
}
var init_from_union2 = __esm(() => {
  init_guard2();
  init_unreachable();
  init_evaluate2();
  init_from_type2();
});

// node_modules/typebox/build/type/engine/object/from_type.mjs
function FromType8(type) {
  return IsCyclic(type) ? FromCyclic(type.$defs, type.$ref) : IsDependent(type) ? FromDependent(type.if, type.then, type.else) : IsIntersect(type) ? FromIntersect(type.allOf) : IsUnion(type) ? FromUnion3(type.anyOf) : IsTuple(type) ? FromTuple(type.items) : IsObject2(type) ? FromObject3(type.properties) : {};
}
var init_from_type2 = __esm(() => {
  init_cyclic();
  init_dependent();
  init_intersect();
  init_object();
  init_tuple();
  init_union();
  init_from_cyclic();
  init_from_dependent();
  init_from_intersect();
  init_from_tuple();
  init_from_union2();
});

// node_modules/typebox/build/type/engine/object/collapse.mjs
function CollapseToObject(type) {
  const properties2 = FromType8(type);
  const result = _Object_(properties2);
  return result;
}
var init_collapse = __esm(() => {
  init_object();
  init_from_type2();
});

// node_modules/typebox/build/type/engine/object/index.mjs
var init_object3 = __esm(() => {
  init_collapse();
});

// node_modules/typebox/build/type/engine/helpers/keys.mjs
function ConvertToIntegerKey(value) {
  const normal = `${value}`;
  return integerKeyPattern.test(normal) ? parseInt(normal) : value;
}
var integerKeyPattern;
var init_keys = __esm(() => {
  integerKeyPattern = new RegExp("^(?:0|[1-9][0-9]*)$");
});

// node_modules/typebox/build/type/engine/indexed/from_array.mjs
function NormalizeLiteral(value) {
  return Literal(ConvertToIntegerKey(value));
}
function NormalizeIndexerTypes(types) {
  return types.map((type) => NormalizeIndexer(type));
}
function NormalizeIndexer(type) {
  return IsIntersect(type) ? Intersect(NormalizeIndexerTypes(type.allOf)) : IsUnion(type) ? Union(NormalizeIndexerTypes(type.anyOf)) : IsLiteral(type) ? NormalizeLiteral(type.const) : type;
}
function FromArray2(type, indexer) {
  const normalizedIndexer = NormalizeIndexer(indexer);
  const check2 = Extends({}, normalizedIndexer, Number2());
  const result = exports_result.IsExtendsTrueLike(check2) ? type : IsLiteral(indexer) && exports_guard.IsEqual(indexer.const, "length") ? Number2() : Never();
  return result;
}
var init_from_array = __esm(() => {
  init_guard2();
  init_intersect();
  init_union();
  init_literal();
  init_number();
  init_never();
  init_extends3();
  init_keys();
});

// node_modules/typebox/build/type/engine/indexable/from_cyclic.mjs
function FromCyclic2(defs, ref2) {
  const target2 = CyclicTarget(defs, ref2);
  const result = FromType9(target2);
  return result;
}
var init_from_cyclic2 = __esm(() => {
  init_from_type3();
  init_target();
});

// node_modules/typebox/build/type/engine/indexable/from_dependent.mjs
function FromDependent2(if_, then_, else_) {
  const evaluated = EvaluateDependent(if_, then_, else_);
  const result = FromType9(evaluated);
  return result;
}
var init_from_dependent2 = __esm(() => {
  init_from_type3();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/indexable/from_enum.mjs
function FromEnum(values) {
  const evaluated = EvaluateEnum(values);
  const result = FromType9(evaluated);
  return result;
}
var init_from_enum = __esm(() => {
  init_from_type3();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/indexable/from_intersect.mjs
function FromIntersect2(types) {
  const evaluated = EvaluateIntersect(types);
  const result = FromType9(evaluated);
  return result;
}
var init_from_intersect2 = __esm(() => {
  init_evaluate2();
  init_from_type3();
});

// node_modules/typebox/build/type/engine/indexable/from_literal.mjs
function FromLiteral4(value) {
  const result = [`${value}`];
  return result;
}

// node_modules/typebox/build/type/engine/indexable/from_template_literal.mjs
function FromTemplateLiteral2(pattern) {
  const evaluated = EvaluateTemplateLiteral(pattern);
  const result = FromType9(evaluated);
  return result;
}
var init_from_template_literal2 = __esm(() => {
  init_from_type3();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/indexable/from_union.mjs
function FromUnion4(types) {
  return types.reduce((result, left) => {
    return [...result, ...FromType9(left)];
  }, []);
}
var init_from_union3 = __esm(() => {
  init_from_type3();
});

// node_modules/typebox/build/type/engine/indexable/from_type.mjs
function FromType9(type) {
  return IsCyclic(type) ? FromCyclic2(type.$defs, type.$ref) : IsDependent(type) ? FromDependent2(type.if, type.then, type.else) : IsEnum(type) ? FromEnum(type.enum) : IsIntersect(type) ? FromIntersect2(type.allOf) : IsLiteral(type) ? FromLiteral4(type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral2(type.pattern) : IsUnion(type) ? FromUnion4(type.anyOf) : [];
}
var init_from_type3 = __esm(() => {
  init_cyclic();
  init_dependent();
  init_enum();
  init_intersect();
  init_literal();
  init_template_literal();
  init_union();
  init_from_cyclic2();
  init_from_dependent2();
  init_from_enum();
  init_from_intersect2();
  init_from_template_literal2();
  init_from_union3();
});

// node_modules/typebox/build/type/engine/indexable/to_indexable_keys.mjs
function ToIndexableKeys(type) {
  const result = FromType9(type);
  return result;
}
var init_to_indexable_keys = __esm(() => {
  init_from_type3();
});

// node_modules/typebox/build/type/engine/this/expand_this.mjs
function FromTypes5(properties2, types) {
  return types.map((type) => FromType10(properties2, type));
}
function FromType10(properties2, type) {
  return IsArray2(type) ? _Array_(FromType10(properties2, type.items)) : IsConstructor2(type) ? Constructor(FromTypes5(properties2, type.parameters), FromType10(properties2, type.instanceType)) : IsFunction2(type) ? _Function_(FromTypes5(properties2, type.parameters), FromType10(properties2, type.returnType)) : IsTuple(type) ? Tuple(FromTypes5(properties2, type.items)) : IsUnion(type) ? Union(FromTypes5(properties2, type.anyOf)) : IsIntersect(type) ? Intersect(FromTypes5(properties2, type.allOf)) : IsThis(type) ? _Object_(properties2) : type;
}
function ExpandThis(properties2, type) {
  const result = FromType10(properties2, type);
  return result;
}
var init_expand_this = __esm(() => {
  init_array();
  init_constructor();
  init_function();
  init_intersect();
  init_object();
  init_tuple();
  init_this();
  init_union();
});

// node_modules/typebox/build/type/engine/indexed/from_object.mjs
function IndexProperty(properties2, key) {
  const selectedType = key in properties2 ? properties2[key] : Never();
  const result = ExpandThis(properties2, selectedType);
  return result;
}
function IndexProperties(properties2, keys) {
  return keys.reduce((result, left) => {
    return [...result, IndexProperty(properties2, left)];
  }, []);
}
function FromIndexer(properties2, indexer) {
  const keys = ToIndexableKeys(indexer);
  const variants = IndexProperties(properties2, keys);
  const result = EvaluateUnion(variants);
  return result;
}
function NumericKeys(keys) {
  const result = keys.filter((key) => NumericKeyPattern.test(key));
  return result;
}
function FromIndexerNumber(properties2) {
  const keys = PropertyKeys(properties2);
  const numericKeys = NumericKeys(keys);
  const variants = IndexProperties(properties2, numericKeys);
  const result = EvaluateUnion(variants);
  return result;
}
function FromObject4(properties2, indexer) {
  const result = IsNumber3(indexer) ? FromIndexerNumber(properties2) : FromIndexer(properties2, indexer);
  return result;
}
var NumericKeyPattern;
var init_from_object = __esm(() => {
  init_number();
  init_never();
  init_properties();
  init_evaluate2();
  init_to_indexable_keys();
  init_record();
  init_expand_this();
  NumericKeyPattern = new RegExp(IntegerKey);
});

// node_modules/typebox/build/type/engine/indexed/array_indexer.mjs
function ConvertLiteral(value) {
  return Literal(ConvertToIntegerKey(value));
}
function ArrayIndexerTypes(types) {
  return types.map((type) => FormatArrayIndexer(type));
}
function FormatArrayIndexer(type) {
  return IsIntersect(type) ? Intersect(ArrayIndexerTypes(type.allOf)) : IsUnion(type) ? Union(ArrayIndexerTypes(type.anyOf)) : IsLiteral(type) ? ConvertLiteral(type.const) : type;
}
var init_array_indexer = __esm(() => {
  init_union();
  init_intersect();
  init_literal();
  init_keys();
});

// node_modules/typebox/build/type/engine/indexed/from_tuple.mjs
function IndexElementsWithIndexer(types, indexer) {
  return types.reduceRight((result, right, index) => {
    const check2 = Extends({}, Literal(index), indexer);
    return exports_result.IsExtendsTrueLike(check2) ? [right, ...result] : result;
  }, []);
}
function FromTupleWithIndexer(types, indexer) {
  const formattedArrayIndexer = FormatArrayIndexer(indexer);
  const elements = IndexElementsWithIndexer(types, formattedArrayIndexer);
  return EvaluateUnionFast(elements);
}
function FromTupleWithoutIndexer(types) {
  return EvaluateUnionFast(types);
}
function FromTuple2(types, indexer) {
  return IsLiteral(indexer) && exports_guard.IsEqual(indexer.const, "length") ? Literal(types.length) : IsNumber3(indexer) || IsInteger2(indexer) ? FromTupleWithoutIndexer(types) : FromTupleWithIndexer(types, indexer);
}
var init_from_tuple2 = __esm(() => {
  init_guard2();
  init_literal();
  init_number();
  init_integer();
  init_evaluate2();
  init_extends3();
  init_array_indexer();
});

// node_modules/typebox/build/type/engine/indexed/from_type.mjs
function FromType11(type, indexer) {
  return IsArray2(type) ? FromArray2(type.items, indexer) : IsObject2(type) ? FromObject4(type.properties, indexer) : IsTuple(type) ? FromTuple2(type.items, indexer) : Never();
}
var init_from_type4 = __esm(() => {
  init_array();
  init_never();
  init_object();
  init_tuple();
  init_from_array();
  init_from_object();
  init_from_tuple2();
});

// node_modules/typebox/build/type/engine/indexed/instantiate.mjs
function NormalizeType(type) {
  const result = IsCyclic(type) || IsDependent(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
  return result;
}
function IndexAction(type, indexer, options) {
  const result = CanInstantiate([type, indexer]) ? exports_memory.Update(FromType11(NormalizeType(type), indexer), {}, options) : IndexDeferred(type, indexer, options);
  return result;
}
function IndexInstantiate(context, state, type, indexer, options) {
  const instantiatedType = InstantiateType(context, state, type);
  const instantiatedIndexer = InstantiateType(context, state, indexer);
  return IndexAction(instantiatedType, instantiatedIndexer, options);
}
var init_instantiate12 = __esm(() => {
  init_memory2();
  init_cyclic();
  init_dependent();
  init_intersect();
  init_union();
  init_instantiate27();
  init_indexed();
  init_object3();
  init_from_type4();
});

// node_modules/typebox/build/type/action/instance_type.mjs
function InstanceTypeDeferred(type, options = {}) {
  return Deferred("InstanceType", [type], options);
}
function InstanceType(type, options = {}) {
  return InstanceTypeAction(type, options);
}
var init_instance_type = __esm(() => {
  init_deferred();
  init_instantiate13();
});

// node_modules/typebox/build/type/engine/instance_type/instantiate.mjs
function InstanceTypeOperation(type) {
  return IsConstructor2(type) ? type["instanceType"] : Never();
}
function InstanceTypeAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(InstanceTypeOperation(type), {}, options) : InstanceTypeDeferred(type, options);
  return result;
}
function InstanceTypeInstantiate(context, state, type, options = {}) {
  const instantiatedType = InstantiateType(context, state, type);
  return InstanceTypeAction(instantiatedType, options);
}
var init_instantiate13 = __esm(() => {
  init_memory2();
  init_constructor();
  init_never();
  init_instance_type();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/keyof.mjs
function KeyOfDeferred(type, options = {}) {
  return Deferred("KeyOf", [type], options);
}
function KeyOf2(type, options = {}) {
  return KeyOfAction(type, options);
}
var init_keyof = __esm(() => {
  init_deferred();
  init_instantiate14();
});

// node_modules/typebox/build/type/engine/keyof/from_any.mjs
function FromAny() {
  return Union([Number2(), String2(), Symbol2()]);
}
var init_from_any = __esm(() => {
  init_number();
  init_string();
  init_symbol();
  init_union();
});

// node_modules/typebox/build/type/engine/keyof/from_array.mjs
function FromArray3(_type) {
  return Number2();
}
var init_from_array2 = __esm(() => {
  init_number();
});

// node_modules/typebox/build/type/engine/keyof/from_object.mjs
function FromPropertyKeys(keys) {
  const result = keys.reduce((result2, left) => {
    return IsLiteralValue(left) ? [...result2, Literal(ConvertToIntegerKey(left))] : Unreachable();
  }, []);
  return result;
}
function FromObject5(properties2) {
  const propertyKeys = exports_guard.Keys(properties2);
  const variants = FromPropertyKeys(propertyKeys);
  const result = EvaluateUnionFast(variants);
  return result;
}
var init_from_object2 = __esm(() => {
  init_unreachable();
  init_guard2();
  init_literal();
  init_keys();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/keyof/from_record.mjs
function FromRecord2(type) {
  return RecordKey(type);
}
var init_from_record = __esm(() => {
  init_record();
});

// node_modules/typebox/build/type/engine/keyof/from_tuple.mjs
function FromTuple3(types) {
  const result = types.map((_, index) => Literal(index));
  return EvaluateUnionFast(result);
}
var init_from_tuple3 = __esm(() => {
  init_literal();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/keyof/from_type.mjs
function FromType12(type) {
  return IsAny(type) ? FromAny() : IsArray2(type) ? FromArray3(type.items) : IsObject2(type) ? FromObject5(type.properties) : IsRecord(type) ? FromRecord2(type) : IsTuple(type) ? FromTuple3(type.items) : Never();
}
var init_from_type5 = __esm(() => {
  init_any();
  init_array();
  init_never();
  init_object();
  init_record();
  init_tuple();
  init_from_any();
  init_from_array2();
  init_from_object2();
  init_from_record();
  init_from_tuple3();
});

// node_modules/typebox/build/type/engine/keyof/instantiate.mjs
function NormalizeType2(type) {
  const result = IsCyclic(type) || IsDependent(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
  return result;
}
function KeyOfAction(type, options) {
  return CanInstantiate([type]) ? exports_memory.Update(FromType12(NormalizeType2(type)), {}, options) : KeyOfDeferred(type, options);
}
function KeyOfInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return KeyOfAction(instantiatedType, options);
}
var init_instantiate14 = __esm(() => {
  init_memory2();
  init_cyclic();
  init_dependent();
  init_intersect();
  init_union();
  init_keyof();
  init_instantiate27();
  init_object3();
  init_from_type5();
});

// node_modules/typebox/build/type/action/mapped.mjs
function MappedDeferred(identifier2, type, as, property, options = {}) {
  return Deferred("Mapped", [identifier2, type, as, property], options);
}
function Mapped(identifier2, type, as, property, options = {}) {
  return MappedAction({}, State([], []), identifier2, type, as, property, options);
}
var init_mapped = __esm(() => {
  init_deferred();
  init_instantiate15();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/mapped/mapped_variants.mjs
function FromTemplateLiteral3(pattern) {
  const evaluated = EvaluateTemplateLiteral(pattern);
  const result = FromType13(evaluated);
  return result;
}
function FromUnion5(types) {
  return types.reduce((result, left) => {
    return [...result, ...FromType13(left)];
  }, []);
}
function FromEnum2(values) {
  const evaluated = EvaluateEnum(values);
  const result = FromType13(evaluated);
  return result;
}
function FromLiteral5(value) {
  const result = exports_guard.IsNumber(value) ? [Literal(`${value}`)] : [Literal(value)];
  return result;
}
function FromType13(type) {
  const result = IsEnum(type) ? FromEnum2(type.enum) : IsLiteral(type) ? FromLiteral5(type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral3(type.pattern) : IsUnion(type) ? FromUnion5(type.anyOf) : [type];
  return result;
}
function MappedVariants(type) {
  const result = FromType13(type);
  return result;
}
var init_mapped_variants = __esm(() => {
  init_guard2();
  init_literal();
  init_enum();
  init_template_literal();
  init_union();
  init_evaluate2();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/mapped/mapped_operation.mjs
function CanonicalAs(instantiatedAs) {
  const result = IsTemplateLiteral(instantiatedAs) ? EvaluateTemplateLiteral(instantiatedAs.pattern) : instantiatedAs;
  return result;
}
function MappedVariant(context, state, identifier2, variant, as, property) {
  const variantContext = exports_memory.Assign(context, { [identifier2["name"]]: variant });
  const instantiatedAs = InstantiateType(variantContext, state, as);
  const canonicalAs = CanonicalAs(instantiatedAs);
  const instantiatedProperty = InstantiateType(variantContext, state, property);
  return IsLiteralNumber(canonicalAs) || IsLiteralString(canonicalAs) ? { [canonicalAs.const]: instantiatedProperty } : {};
}
function MappedProperties(context, state, identifier2, variants, as, property) {
  return variants.reduce((result, left) => {
    return [...result, MappedVariant(context, state, identifier2, left, as, property)];
  }, []);
}
function MappedObjects(properties2) {
  return properties2.reduce((result, left) => {
    return [...result, _Object_(left)];
  }, []);
}
function MappedOperation(context, state, identifier2, type, as, property) {
  const variants = MappedVariants(type);
  const mappedProperties = MappedProperties(context, state, identifier2, variants, as, property);
  const mappedObjects = MappedObjects(mappedProperties);
  const result = EvaluateIntersect(mappedObjects);
  return result;
}
var init_mapped_operation = __esm(() => {
  init_memory2();
  init_literal();
  init_object();
  init_template_literal();
  init_instantiate27();
  init_evaluate2();
  init_evaluate2();
  init_mapped_variants();
});

// node_modules/typebox/build/type/engine/mapped/instantiate.mjs
function MappedAction(context, state, identifier2, type, as, property, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(MappedOperation(context, state, identifier2, type, as, property), {}, options) : MappedDeferred(identifier2, type, as, property, options);
  return result;
}
function MappedInstantiate(context, state, identifier2, type, as, property, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return MappedAction(context, state, identifier2, instantiatedType, as, property, options);
}
var init_instantiate15 = __esm(() => {
  init_memory2();
  init_mapped();
  init_instantiate27();
  init_mapped_operation();
});

// node_modules/typebox/build/type/engine/module/instantiate.mjs
function InstantiateCyclics(context, declarations, cyclicKeys) {
  const declarationContext = exports_memory.Assign(context, declarations);
  const declarationKeys = exports_guard.Keys(declarations).filter((key) => cyclicKeys.includes(key));
  return declarationKeys.reduce((result, key) => {
    return { ...result, [key]: InstantiateCyclic(declarationContext, key, declarations[key]) };
  }, {});
}
function InstantiateNonCyclics(context, declarations, cyclicKeys) {
  const declarationContext = exports_memory.Assign(context, declarations);
  const declarationKeys = exports_guard.Keys(declarations).filter((key) => !cyclicKeys.includes(key));
  return declarationKeys.reduce((result, key) => {
    return { ...result, [key]: InstantiateType(declarationContext, State([], []), declarations[key]) };
  }, {});
}
function InstantiateModule(context, declarations, options) {
  const cyclicCandidates = CyclicCandidates(declarations);
  const instantiatedCyclics = InstantiateCyclics(context, declarations, cyclicCandidates);
  const instantiatedNonCyclics = InstantiateNonCyclics(context, declarations, cyclicCandidates);
  const instantiatedModule = { ...instantiatedCyclics, ...instantiatedNonCyclics };
  return exports_memory.Update(instantiatedModule, {}, options);
}
function ModuleInstantiate(context, _state, declarations, options) {
  const instantiatedModule = InstantiateModule(context, declarations, options);
  return instantiatedModule;
}
var init_instantiate16 = __esm(() => {
  init_guard2();
  init_memory2();
  init_instantiate27();
  init_candidates();
  init_instantiate4();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/non_nullable.mjs
function NonNullableDeferred(type, options = {}) {
  return Deferred("NonNullable", [type], options);
}
function NonNullable(type, options = {}) {
  return NonNullableAction(type, options);
}
var init_non_nullable = __esm(() => {
  init_deferred();
  init_instantiate17();
});

// node_modules/typebox/build/type/engine/non_nullable/instantiate.mjs
function NonNullableOperation(type) {
  const excluded = Union([Null(), Undefined()]);
  return ExcludeAction(type, excluded, {});
}
function NonNullableAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(NonNullableOperation(type), {}, options) : NonNullableDeferred(type, options);
  return result;
}
function NonNullableInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return NonNullableAction(instantiatedType, options);
}
var init_instantiate17 = __esm(() => {
  init_memory2();
  init_null();
  init_undefined();
  init_union();
  init_instantiate10();
  init_non_nullable();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/omit.mjs
function OmitDeferred(type, indexer, options = {}) {
  return Deferred("Omit", [type, indexer], options);
}
function Omit(type, indexer_or_keys, options = {}) {
  const indexer = exports_guard.IsArray(indexer_or_keys) ? KeysToIndexer(indexer_or_keys) : indexer_or_keys;
  return OmitAction(type, indexer, options);
}
var init_omit = __esm(() => {
  init_guard2();
  init_deferred();
  init_keys_to_indexer();
  init_instantiate18();
});

// node_modules/typebox/build/type/engine/indexable/to_indexable.mjs
function ToIndexable(type) {
  const collapsed = CollapseToObject(type);
  const result = IsObject2(collapsed) ? collapsed.properties : Unreachable();
  return result;
}
var init_to_indexable = __esm(() => {
  init_unreachable();
  init_object();
  init_object3();
});

// node_modules/typebox/build/type/engine/omit/from_type.mjs
function FromKeys(properties2, keys) {
  const result = exports_guard.Keys(properties2).reduce((result2, key) => {
    return keys.includes(key) ? result2 : { ...result2, [key]: properties2[key] };
  }, {});
  return result;
}
function FromType14(type, indexer) {
  const indexable = ToIndexable(type);
  const indexableKeys = ToIndexableKeys(indexer);
  const omitted = FromKeys(indexable, indexableKeys);
  const result = _Object_(omitted);
  return result;
}
var init_from_type6 = __esm(() => {
  init_guard2();
  init_object();
  init_to_indexable_keys();
  init_to_indexable();
});

// node_modules/typebox/build/type/engine/omit/instantiate.mjs
function OmitAction(type, indexer, options) {
  const result = CanInstantiate([type, indexer]) ? exports_memory.Update(FromType14(type, indexer), {}, options) : OmitDeferred(type, indexer, options);
  return result;
}
function OmitInstantiate(context, state, type, indexer, options) {
  const instantiatedType = InstantiateType(context, state, type);
  const instantiatedIndexer = InstantiateType(context, state, indexer);
  return OmitAction(instantiatedType, instantiatedIndexer, options);
}
var init_instantiate18 = __esm(() => {
  init_memory2();
  init_omit();
  init_instantiate27();
  init_from_type6();
});

// node_modules/typebox/build/type/action/parameters.mjs
function ParametersDeferred(type, options = {}) {
  return Deferred("Parameters", [type], options);
}
function Parameters(type, options = {}) {
  return ParametersAction(type, options);
}
var init_parameters2 = __esm(() => {
  init_deferred();
  init_instantiate19();
});

// node_modules/typebox/build/type/engine/parameters/instantiate.mjs
function ParametersOperation(type) {
  const parameters = IsFunction2(type) ? type["parameters"] : [];
  const instantiatedParameters = InstantiateElements({}, State([], []), parameters);
  const result = Tuple(instantiatedParameters);
  return result;
}
function ParametersAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(ParametersOperation(type), {}, options) : ParametersDeferred(type, options);
  return result;
}
function ParametersInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return ParametersAction(instantiatedType, options);
}
var init_instantiate19 = __esm(() => {
  init_memory2();
  init_function();
  init_tuple();
  init_parameters2();
  init_instantiate27();
  init_instantiate27();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/partial.mjs
function PartialDeferred(type, options = {}) {
  return Deferred("Partial", [type], options);
}
function Partial(type, options = {}) {
  return PartialAction(type, options);
}
var init_partial = __esm(() => {
  init_deferred();
  init_instantiate20();
});

// node_modules/typebox/build/type/engine/partial/from_cyclic.mjs
function FromCyclic3(defs, ref2) {
  const target2 = CyclicTarget(defs, ref2);
  const partial = FromType15(target2);
  const result = Cyclic(exports_memory.Assign(defs, { [ref2]: partial }), ref2);
  return result;
}
var init_from_cyclic3 = __esm(() => {
  init_memory2();
  init_cyclic();
  init_from_type7();
  init_target();
});

// node_modules/typebox/build/type/engine/partial/from_dependent.mjs
function FromDependent3(if_, then_, else_) {
  const evaluated = EvaluateDependent(if_, then_, else_);
  const result = FromType15(evaluated);
  return result;
}
var init_from_dependent3 = __esm(() => {
  init_from_type7();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/partial/from_intersect.mjs
function FromIntersect3(types) {
  const evaluated = EvaluateIntersect(types);
  const result = FromType15(evaluated);
  return result;
}
var init_from_intersect3 = __esm(() => {
  init_from_type7();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/partial/from_union.mjs
function FromUnion6(types) {
  const result = types.map((type) => FromType15(type));
  return Union(result);
}
var init_from_union4 = __esm(() => {
  init_union();
  init_from_type7();
});

// node_modules/typebox/build/type/engine/partial/from_object.mjs
function FromObject6(properties2) {
  const mapped = exports_guard.Keys(properties2).reduce((result2, left) => {
    return { ...result2, [left]: AddOptional(properties2[left]) };
  }, {});
  const result = _Object_(mapped);
  return result;
}
var init_from_object3 = __esm(() => {
  init_guard2();
  init_object();
  init__add_optional();
});

// node_modules/typebox/build/type/engine/partial/from_type.mjs
function FromType15(type) {
  return IsCyclic(type) ? FromCyclic3(type.$defs, type.$ref) : IsDependent(type) ? FromDependent3(type.if, type.then, type.else) : IsIntersect(type) ? FromIntersect3(type.allOf) : IsUnion(type) ? FromUnion6(type.anyOf) : IsObject2(type) ? FromObject6(type.properties) : _Object_({});
}
var init_from_type7 = __esm(() => {
  init_cyclic();
  init_dependent();
  init_intersect();
  init_object();
  init_union();
  init_from_cyclic3();
  init_from_dependent3();
  init_from_intersect3();
  init_from_union4();
  init_from_object3();
});

// node_modules/typebox/build/type/engine/partial/instantiate.mjs
function PartialAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType15(type), {}, options) : PartialDeferred(type, options);
  return result;
}
function PartialInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return PartialAction(instantiatedType, options);
}
var init_instantiate20 = __esm(() => {
  init_memory2();
  init_partial();
  init_from_type7();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/pick.mjs
function PickDeferred(type, indexer, options = {}) {
  return Deferred("Pick", [type, indexer], options);
}
function Pick(type, indexer_or_keys, options = {}) {
  const indexer = exports_guard.IsArray(indexer_or_keys) ? KeysToIndexer(indexer_or_keys) : indexer_or_keys;
  return PickAction(type, indexer, options);
}
var init_pick = __esm(() => {
  init_guard2();
  init_deferred();
  init_keys_to_indexer();
  init_instantiate21();
});

// node_modules/typebox/build/type/engine/pick/from_type.mjs
function FromKeys2(properties2, keys) {
  const result = exports_guard.Keys(properties2).reduce((result2, key) => {
    return keys.includes(key) ? exports_memory.Assign(result2, { [key]: properties2[key] }) : result2;
  }, {});
  return result;
}
function FromType16(type, indexer) {
  const indexable = ToIndexable(type);
  const keys = ToIndexableKeys(indexer);
  const applied = FromKeys2(indexable, keys);
  const result = _Object_(applied);
  return result;
}
var init_from_type8 = __esm(() => {
  init_memory2();
  init_guard2();
  init_object();
  init_to_indexable_keys();
  init_to_indexable();
});

// node_modules/typebox/build/type/engine/pick/instantiate.mjs
function PickAction(type, indexer, options) {
  const result = CanInstantiate([type, indexer]) ? exports_memory.Update(FromType16(type, indexer), {}, options) : PickDeferred(type, indexer, options);
  return result;
}
function PickInstantiate(context, state, type, indexer, options) {
  const instantiatedType = InstantiateType(context, state, type);
  const instantiatedIndexer = InstantiateType(context, state, indexer);
  return PickAction(instantiatedType, instantiatedIndexer, options);
}
var init_instantiate21 = __esm(() => {
  init_memory2();
  init_pick();
  init_instantiate27();
  init_from_type8();
});

// node_modules/typebox/build/type/action/readonly_object.mjs
function ReadonlyObjectDeferred(type, options = {}) {
  return Deferred("ReadonlyObject", [type], options);
}
function ReadonlyObject(type, options = {}) {
  return ReadonlyObjectAction(type, options);
}
var ReadonlyType;
var init_readonly_object = __esm(() => {
  init_deferred();
  init_instantiate22();
  ReadonlyType = ReadonlyObject;
});

// node_modules/typebox/build/type/engine/readonly_object/from_array.mjs
function FromArray4(type) {
  const result = AddImmutable(_Array_(type));
  return result;
}
var init_from_array3 = __esm(() => {
  init_array();
  init__add_immutable();
});

// node_modules/typebox/build/type/engine/readonly_object/from_cyclic.mjs
function FromCyclic4(defs, ref2) {
  const target2 = CyclicTarget(defs, ref2);
  const partial = FromType17(target2);
  const result = Cyclic(exports_memory.Assign(defs, { [ref2]: partial }), ref2);
  return result;
}
var init_from_cyclic4 = __esm(() => {
  init_memory2();
  init_cyclic();
  init_from_type9();
  init_target();
});

// node_modules/typebox/build/type/engine/readonly_object/from_dependent.mjs
function FromDependent4(if_, then_, else_) {
  const evaluated = EvaluateDependent(if_, then_, else_);
  const result = FromType17(evaluated);
  return result;
}
var init_from_dependent4 = __esm(() => {
  init_from_type9();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/readonly_object/from_intersect.mjs
function FromIntersect4(types) {
  const evaluated = EvaluateIntersect(types);
  const result = FromType17(evaluated);
  return result;
}
var init_from_intersect4 = __esm(() => {
  init_from_type9();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/readonly_object/from_object.mjs
function FromObject7(properties2) {
  const mapped = exports_guard.Keys(properties2).reduce((result2, left) => {
    return { ...result2, [left]: AddReadonly(properties2[left]) };
  }, {});
  const result = _Object_(mapped);
  return result;
}
var init_from_object4 = __esm(() => {
  init_guard2();
  init_object();
  init__add_readonly();
});

// node_modules/typebox/build/type/engine/readonly_object/from_tuple.mjs
function FromTuple4(types) {
  const result = AddImmutable(Tuple(types));
  return result;
}
var init_from_tuple4 = __esm(() => {
  init_tuple();
  init__add_immutable();
});

// node_modules/typebox/build/type/engine/readonly_object/from_union.mjs
function FromUnion7(types) {
  const result = types.map((type) => FromType17(type));
  return Union(result);
}
var init_from_union5 = __esm(() => {
  init_union();
  init_from_type9();
});

// node_modules/typebox/build/type/engine/readonly_object/from_type.mjs
function FromType17(type) {
  return IsArray2(type) ? FromArray4(type.items) : IsCyclic(type) ? FromCyclic4(type.$defs, type.$ref) : IsDependent(type) ? FromDependent4(type.if, type.then, type.else) : IsIntersect(type) ? FromIntersect4(type.allOf) : IsObject2(type) ? FromObject7(type.properties) : IsTuple(type) ? FromTuple4(type.items) : IsUnion(type) ? FromUnion7(type.anyOf) : type;
}
var init_from_type9 = __esm(() => {
  init_array();
  init_cyclic();
  init_dependent();
  init_intersect();
  init_object();
  init_tuple();
  init_union();
  init_from_array3();
  init_from_cyclic4();
  init_from_dependent4();
  init_from_intersect4();
  init_from_object4();
  init_from_tuple4();
  init_from_union5();
});

// node_modules/typebox/build/type/engine/readonly_object/instantiate.mjs
function ReadonlyObjectAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType17(type), {}, options) : ReadonlyObjectDeferred(type);
  return result;
}
function ReadonlyObjectInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return ReadonlyObjectAction(instantiatedType, options);
}
var init_instantiate22 = __esm(() => {
  init_memory2();
  init_readonly_object();
  init_from_type9();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/ref/instantiate.mjs
function RefInstantiate(context, state, type, ref2) {
  return state.visited.includes(ref2) ? type : (ref2 in context) ? InstantiateType(context, State(state["callstack"], [...state["visited"], ref2]), context[ref2]) : type;
}
var init_instantiate23 = __esm(() => {
  init_instantiate27();
  init_instantiate27();
});

// node_modules/typebox/build/type/engine/required/from_cyclic.mjs
function FromCyclic5(defs, ref2) {
  const target2 = CyclicTarget(defs, ref2);
  const partial = FromType18(target2);
  const result = Cyclic(exports_memory.Assign(defs, { [ref2]: partial }), ref2);
  return result;
}
var init_from_cyclic5 = __esm(() => {
  init_memory2();
  init_cyclic();
  init_from_type10();
  init_target();
});

// node_modules/typebox/build/type/engine/required/from_dependent.mjs
function FromDependent5(if_, then_, else_) {
  const evaluated = EvaluateDependent(if_, then_, else_);
  const result = FromType18(evaluated);
  return result;
}
var init_from_dependent5 = __esm(() => {
  init_from_type10();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/required/from_intersect.mjs
function FromIntersect5(types) {
  const evaluated = EvaluateIntersect(types);
  const result = FromType18(evaluated);
  return result;
}
var init_from_intersect5 = __esm(() => {
  init_from_type10();
  init_evaluate2();
});

// node_modules/typebox/build/type/engine/required/from_union.mjs
function FromUnion8(types) {
  const result = types.map((type) => FromType18(type));
  return Union(result);
}
var init_from_union6 = __esm(() => {
  init_union();
  init_from_type10();
});

// node_modules/typebox/build/type/engine/required/from_object.mjs
function FromObject8(properties2) {
  const mapped = exports_guard.Keys(properties2).reduce((result2, left) => {
    return { ...result2, [left]: RemoveOptional(properties2[left]) };
  }, {});
  const result = _Object_(mapped);
  return result;
}
var init_from_object5 = __esm(() => {
  init_guard2();
  init_object();
  init__remove_optional();
});

// node_modules/typebox/build/type/engine/required/from_type.mjs
function FromType18(type) {
  return IsCyclic(type) ? FromCyclic5(type.$defs, type.$ref) : IsDependent(type) ? FromDependent5(type.if, type.then, type.else) : IsIntersect(type) ? FromIntersect5(type.allOf) : IsUnion(type) ? FromUnion8(type.anyOf) : IsObject2(type) ? FromObject8(type.properties) : _Object_({});
}
var init_from_type10 = __esm(() => {
  init_cyclic();
  init_dependent();
  init_intersect();
  init_object();
  init_union();
  init_from_cyclic5();
  init_from_dependent5();
  init_from_intersect5();
  init_from_union6();
  init_from_object5();
});

// node_modules/typebox/build/type/action/required.mjs
function RequiredDeferred(type, options = {}) {
  return Deferred("Required", [type], options);
}
function Required(type, options = {}) {
  return RequiredAction(type, options);
}
var init_required = __esm(() => {
  init_deferred();
  init_instantiate24();
});

// node_modules/typebox/build/type/engine/required/instantiate.mjs
function RequiredAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(FromType18(type), {}, options) : RequiredDeferred(type, options);
  return result;
}
function RequiredInstantiate(context, state, type, options) {
  const instaniatedType = InstantiateType(context, state, type);
  return RequiredAction(instaniatedType, options);
}
var init_instantiate24 = __esm(() => {
  init_memory2();
  init_from_type10();
  init_required();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/return_type.mjs
function ReturnTypeDeferred(type, options = {}) {
  return Deferred("ReturnType", [type], options);
}
function ReturnType(type, options = {}) {
  return ReturnTypeAction(type, options);
}
var init_return_type2 = __esm(() => {
  init_deferred();
  init_instantiate25();
});

// node_modules/typebox/build/type/engine/return_type/instantiate.mjs
function ReturnTypeOperation(type) {
  return IsFunction2(type) ? type["returnType"] : Never();
}
function ReturnTypeAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(ReturnTypeOperation(type), {}, options) : ReturnTypeDeferred(type, options);
  return result;
}
function ReturnTypeInstantiate(context, state, type, options = {}) {
  const instantiatedType = InstantiateType(context, state, type);
  return ReturnTypeAction(instantiatedType, options);
}
var init_instantiate25 = __esm(() => {
  init_memory2();
  init_function();
  init_never();
  init_return_type2();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/with.mjs
function WithDeferred(type, options) {
  return Deferred("With", [type, options], {});
}
function With2(type, options) {
  return WithAction(type, options);
}
var init_with = __esm(() => {
  init_deferred();
  init_instantiate26();
});

// node_modules/typebox/build/type/engine/with/instantiate.mjs
function WithAction(type, options) {
  const result = CanInstantiate([type]) ? exports_memory.Update(type, {}, options) : WithDeferred(type, options);
  return result;
}
function WithInstantiate(context, state, type, options) {
  const instaniatedType = InstantiateType(context, state, type);
  return WithAction(instaniatedType, options);
}
var init_instantiate26 = __esm(() => {
  init_memory2();
  init_instantiate27();
  init_with();
});

// node_modules/typebox/build/type/engine/rest/spread.mjs
function SpreadElement(type) {
  const result = IsRest(type) ? IsTuple(type.items) ? RestSpread(type.items.items) : IsInfer(type.items) ? [type] : IsRef(type.items) ? [type] : [Never()] : [type];
  return result;
}
function RestSpread(types) {
  const result = types.reduce((result2, left) => {
    return [...result2, ...SpreadElement(left)];
  }, []);
  return result;
}
var init_spread = __esm(() => {
  init_infer();
  init_never();
  init_rest();
  init_ref();
  init_tuple();
});

// node_modules/typebox/build/type/engine/rest/index.mjs
var init_rest3 = __esm(() => {
  init_spread();
});

// node_modules/typebox/build/type/engine/instantiate.mjs
function State(callstack, visited) {
  return { callstack, visited };
}
function CanInstantiate(types) {
  return exports_guard.ShiftLeft(types, (left, right) => IsRef(left) ? false : CanInstantiate(right), () => true);
}
function InstantiateProperties(context, state, properties2) {
  return exports_guard.Keys(properties2).reduce((result, key) => {
    return { ...result, [key]: InstantiateType(context, state, properties2[key]) };
  }, {});
}
function InstantiateElements(context, state, types) {
  const elements = InstantiateTypes(context, state, types);
  const result = RestSpread(elements);
  return result;
}
function InstantiateTypes(context, state, types) {
  return types.map((type) => InstantiateType(context, state, type));
}
function WithModifiers(type, instantiatedType) {
  const withOptional = IsOptional(type) ? AddOptionalAction(instantiatedType, {}) : instantiatedType;
  const withReadonly = IsReadonly(type) ? AddReadonlyAction(withOptional, {}) : withOptional;
  const withImmutable = IsImmutable(type) ? AddImmutableAction(withReadonly, {}) : withReadonly;
  return withImmutable;
}
function InstantiateDeferred(context, state, action, parameters, options) {
  return exports_guard.IsEqual(action, "AddImmutable") ? AddImmutableInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "RemoveImmutable") ? RemoveImmutableInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "AddReadonly") ? AddReadonlyInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "RemoveReadonly") ? RemoveReadonlyInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "AddOptional") ? AddOptionalInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "RemoveOptional") ? RemoveOptionalInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Capitalize") ? CapitalizeInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Conditional") ? ConditionalInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : exports_guard.IsEqual(action, "ConstructorParameters") ? ConstructorParametersInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Evaluate") ? EvaluateInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Exclude") ? ExcludeInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "Extract") ? ExtractInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "Index") ? IndexInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "InstanceType") ? InstanceTypeInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Interface") ? InterfaceInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "KeyOf") ? KeyOfInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Lowercase") ? LowercaseInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Mapped") ? MappedInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : exports_guard.IsEqual(action, "Module") ? ModuleInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "NonNullable") ? NonNullableInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Pick") ? PickInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "Parameters") ? ParametersInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Partial") ? PartialInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Omit") ? OmitInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "ReadonlyObject") ? ReadonlyObjectInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Record") ? RecordInstantiate(context, state, parameters[0], parameters[1], options) : exports_guard.IsEqual(action, "Required") ? RequiredInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "ReturnType") ? ReturnTypeInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "TemplateLiteral") ? TemplateLiteralInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Uncapitalize") ? UncapitalizeInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "Uppercase") ? UppercaseInstantiate(context, state, parameters[0], options) : exports_guard.IsEqual(action, "With") ? WithInstantiate(context, state, parameters[0], parameters[1]) : Deferred(action, parameters, options);
}
function InstantiateImmediate(context, state, type) {
  const instantiatedType = IsRef(type) ? RefInstantiate(context, state, type, type.$ref) : IsArray2(type) ? _Array_(InstantiateType(context, state, type.items), ArrayOptions(type)) : IsCall(type) ? CallInstantiate(context, state, type.target, type.arguments) : IsConstructor2(type) ? Constructor(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.instanceType), ConstructorOptions(type)) : IsFunction2(type) ? _Function_(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.returnType), FunctionOptions(type)) : IsDependent(type) ? Dependent(InstantiateType(context, state, type.if), InstantiateType(context, state, type.then), InstantiateType(context, state, type.else), DependentOptions(type)) : IsIntersect(type) ? Intersect(InstantiateTypes(context, state, type.allOf), IntersectOptions(type)) : IsObject2(type) ? _Object_(InstantiateProperties(context, state, type.properties), ObjectOptions(type)) : IsRecord(type) ? RecordFromPattern(RecordPattern(type), InstantiateType(context, state, RecordValue(type))) : IsRest(type) ? Rest(InstantiateType(context, state, type.items)) : IsTuple(type) ? Tuple(InstantiateElements(context, state, type.items), TupleOptions(type)) : IsUnion(type) ? Union(InstantiateTypes(context, state, type.anyOf), UnionOptions(type)) : type;
  const withModifiers = WithModifiers(type, instantiatedType);
  return withModifiers;
}
function InstantiateType(context, state, type) {
  const result = IsDeferred(type) ? InstantiateDeferred(context, state, type.action, type.parameters, type.options) : InstantiateImmediate(context, state, type);
  return result;
}
function Instantiate(context, type) {
  return InstantiateType(context, State([], []), type);
}
var init_instantiate27 = __esm(() => {
  init_guard2();
  init_instantiate_add3();
  init_instantiate_add();
  init_instantiate_add2();
  init_array();
  init_constructor();
  init_deferred();
  init_function();
  init_call();
  init_dependent();
  init_intersect();
  init_object();
  init_record();
  init_tuple();
  init_union();
  init_ref();
  init_rest();
  init_instantiate_add3();
  init_instantiate_remove3();
  init_instantiate_add();
  init_instantiate_remove();
  init_instantiate_add2();
  init_instantiate_remove2();
  init__optional();
  init__immutable();
  init__readonly();
  init_instantiate6();
  init_instantiate7();
  init_conditional2();
  init_instantiate9();
  init_instantiate5();
  init_instantiate10();
  init_instantiate11();
  init_instantiate12();
  init_instantiate13();
  init_instantiate3();
  init_instantiate14();
  init_instantiate7();
  init_instantiate15();
  init_instantiate16();
  init_instantiate17();
  init_instantiate18();
  init_instantiate19();
  init_instantiate20();
  init_instantiate21();
  init_instantiate22();
  init_instantiate();
  init_instantiate23();
  init_instantiate24();
  init_instantiate25();
  init_instantiate2();
  init_instantiate7();
  init_instantiate7();
  init_instantiate26();
  init_rest3();
});

// node_modules/typebox/build/type/engine/immutable/instantiate_add.mjs
function AddImmutableOperation(type) {
  return exports_memory.Update(type, { "~immutable": true }, {});
}
function AddImmutableAction(type, options) {
  const result = exports_memory.Update(AddImmutableOperation(type), {}, options);
  return result;
}
function AddImmutableInstantiate(context, state, type, options) {
  const instantiatedType = InstantiateType(context, state, type);
  return AddImmutableAction(instantiatedType, options);
}
var init_instantiate_add3 = __esm(() => {
  init_memory2();
  init_instantiate27();
});

// node_modules/typebox/build/type/action/_add_immutable.mjs
function AddImmutableDeferred(type, options = {}) {
  return Deferred("AddImmutable", [type], options);
}
function AddImmutable(type, options = {}) {
  return AddImmutableAction(type, options);
}
var init__add_immutable = __esm(() => {
  init_deferred();
  init_instantiate_add3();
});

// node_modules/typebox/build/type/action/_remove_immutable.mjs
function RemoveImmutableDeferred(type, options = {}) {
  return Deferred("RemoveImmutable", [type], options);
}
function RemoveImmutable(type, options = {}) {
  return RemoveImmutableAction(type, options);
}
var init__remove_immutable = __esm(() => {
  init_deferred();
  init_instantiate_remove3();
});

// node_modules/typebox/build/type/action/evaluate.mjs
function EvaluateDeferred(type, options = {}) {
  return Deferred("Evaluate", [type], options);
}
function Evaluate(type, options = {}) {
  return EvaluateAction(type, options);
}
var init_evaluate4 = __esm(() => {
  init_deferred();
  init_instantiate5();
});

// node_modules/typebox/build/type/action/module.mjs
function ModuleDeferred(declarations, options = {}) {
  return Deferred("Module", [declarations], options);
}
function Module2(declarations, options = {}) {
  return ModuleInstantiate({}, State([], []), declarations, options);
}
var init_module = __esm(() => {
  init_deferred();
  init_instantiate27();
  init_instantiate16();
});

// node_modules/typebox/build/type/action/index.mjs
var init_action = __esm(() => {
  init__add_immutable();
  init__add_readonly();
  init__add_optional();
  init__remove_immutable();
  init__remove_readonly();
  init__remove_optional();
  init_capitalize();
  init_conditional();
  init_constructor_parameters();
  init_evaluate4();
  init_exclude();
  init_extract();
  init_indexed();
  init_instance_type();
  init_interface();
  init_keyof();
  init_lowercase();
  init_mapped();
  init_module();
  init_non_nullable();
  init_omit();
  init_parameters2();
  init_partial();
  init_pick();
  init_readonly_object();
  init_required();
  init_return_type2();
  init_uncapitalize();
  init_uppercase();
  init_with();
});

// node_modules/typebox/build/type/engine/constructor_parameters/index.mjs
var init_constructor_parameters2 = __esm(() => {
  init_instantiate9();
});

// node_modules/typebox/build/type/engine/enum/index.mjs
var init_enum3 = __esm(() => {
  init_typescript_enum_to_enum_values();
});

// node_modules/typebox/build/type/engine/exclude/index.mjs
var init_exclude2 = __esm(() => {
  init_instantiate10();
});

// node_modules/typebox/build/type/engine/extract/index.mjs
var init_extract2 = __esm(() => {
  init_instantiate11();
});

// node_modules/typebox/build/type/engine/helpers/union.mjs
var init_union3 = () => {};

// node_modules/typebox/build/type/engine/helpers/index.mjs
var init_helpers = __esm(() => {
  init_keys_to_indexer();
  init_keys();
  init_union3();
});

// node_modules/typebox/build/type/engine/indexed/index.mjs
var init_indexed2 = __esm(() => {
  init_instantiate12();
});

// node_modules/typebox/build/type/engine/instance_type/index.mjs
var init_instance_type2 = __esm(() => {
  init_instantiate13();
});

// node_modules/typebox/build/type/engine/interface/index.mjs
var init_interface2 = __esm(() => {
  init_instantiate3();
});

// node_modules/typebox/build/type/engine/intrinsics/index.mjs
var init_intrinsics = __esm(() => {
  init_instantiate7();
});

// node_modules/typebox/build/type/engine/keyof/index.mjs
var init_keyof2 = __esm(() => {
  init_instantiate14();
});

// node_modules/typebox/build/type/engine/mapped/index.mjs
var init_mapped2 = __esm(() => {
  init_instantiate15();
});

// node_modules/typebox/build/type/engine/module/index.mjs
var init_module2 = __esm(() => {
  init_instantiate16();
});

// node_modules/typebox/build/type/engine/non_nullable/index.mjs
var init_non_nullable2 = __esm(() => {
  init_instantiate17();
});

// node_modules/typebox/build/type/engine/omit/index.mjs
var init_omit2 = __esm(() => {
  init_instantiate18();
});

// node_modules/typebox/build/type/engine/parameters/index.mjs
var init_parameters3 = __esm(() => {
  init_instantiate19();
});

// node_modules/typebox/build/type/engine/patterns/index.mjs
var init_patterns = __esm(() => {
  init_pattern();
  init_template();
});

// node_modules/typebox/build/type/engine/partial/index.mjs
var init_partial2 = __esm(() => {
  init_instantiate20();
});

// node_modules/typebox/build/type/engine/pick/index.mjs
var init_pick2 = __esm(() => {
  init_instantiate21();
});

// node_modules/typebox/build/type/engine/priority/priority.mjs
function Comparer(left, right) {
  const compareResult = Compare(left, right);
  const result = exports_guard.IsEqual(compareResult, "right-inside") ? 1 : exports_guard.IsEqual(compareResult, "disjoint") ? 1 : 0;
  return result;
}
function Insert(type, types, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => exports_guard.IsEqual(Comparer(type, left), 1) ? Insert(type, right, [...result, left]) : [...result, type, ...types], () => [...result, type]);
}
function Sort(types, result = []) {
  return exports_guard.ShiftLeft(types, (left, right) => Sort(right, Insert(left, result)), () => result);
}
function Priority(types) {
  const result = Sort(types);
  return result;
}
var init_priority = __esm(() => {
  init_guard2();
  init_compare();
});

// node_modules/typebox/build/type/engine/priority/index.mjs
var init_priority2 = __esm(() => {
  init_priority();
});

// node_modules/typebox/build/type/engine/readonly_object/index.mjs
var init_readonly_object2 = __esm(() => {
  init_instantiate22();
});

// node_modules/typebox/build/type/engine/record/index.mjs
var init_record3 = __esm(() => {
  init_instantiate();
});

// node_modules/typebox/build/type/engine/ref/index.mjs
var init_ref2 = __esm(() => {
  init_instantiate23();
});

// node_modules/typebox/build/type/engine/required/index.mjs
var init_required2 = __esm(() => {
  init_instantiate24();
});

// node_modules/typebox/build/type/engine/return_type/index.mjs
var init_return_type3 = __esm(() => {
  init_instantiate25();
});

// node_modules/typebox/build/type/engine/template_literal/static.mjs
var init_static2 = () => {};

// node_modules/typebox/build/type/engine/template_literal/is_pattern.mjs
function IsTemplateLiteralPattern(pattern2) {
  const types = ParsePatternIntoTypes(pattern2);
  const result = exports_guard.IsEqual(types.length, 0) ? false : true;
  return result;
}
var init_is_pattern = __esm(() => {
  init_guard2();
  init_pattern();
});

// node_modules/typebox/build/type/engine/template_literal/index.mjs
var init_template_literal3 = __esm(() => {
  init_create2();
  init_decode();
  init_encode();
  init_static2();
  init_is_finite();
  init_is_pattern();
});

// node_modules/typebox/build/type/engine/with/index.mjs
var init_with2 = __esm(() => {
  init_instantiate26();
});

// node_modules/typebox/build/type/engine/index.mjs
var init_engine = __esm(() => {
  init_instantiate27();
  init_conditional2();
  init_constructor_parameters2();
  init_cyclic2();
  init_enum3();
  init_evaluate3();
  init_exclude2();
  init_extract2();
  init_helpers();
  init_indexed2();
  init_instance_type2();
  init_interface2();
  init_intrinsics();
  init_keyof2();
  init_mapped2();
  init_module2();
  init_non_nullable2();
  init_object3();
  init_omit2();
  init_parameters3();
  init_patterns();
  init_partial2();
  init_pick2();
  init_priority2();
  init_readonly_object2();
  init_record3();
  init_ref2();
  init_required2();
  init_return_type3();
  init_template_literal3();
  init_with2();
});

// node_modules/typebox/build/type/script/script.mjs
function Script2(...args) {
  const [context, input, options] = exports_arguments.Match(args, {
    2: (script, options2) => exports_guard.IsString(script) ? [{}, script, options2] : [script, options2, {}],
    3: (context2, script, options2) => [context2, script, options2],
    1: (script) => [{}, script, {}]
  });
  const result = Script(input);
  const parsed = exports_guard.IsArray(result) && exports_guard.IsEqual(result.length, 2) ? InstantiateType(context, State([], []), result[0]) : Never();
  return exports_memory.Update(parsed, {}, options);
}
var init_script = __esm(() => {
  init_arguments();
  init_memory2();
  init_guard2();
  init_types();
  init_instantiate27();
  init_instantiate27();
  init_parser();
});

// node_modules/typebox/build/type/script/index.mjs
var init_script2 = __esm(() => {
  init_script();
});

// node_modules/typebox/build/typebox.mjs
var exports_typebox = {};
__export(exports_typebox, {
  Any: () => Any,
  Array: () => _Array_,
  BigInt: () => BigInt2,
  Boolean: () => Boolean2,
  Call: () => Call,
  Capitalize: () => Capitalize,
  Codec: () => Codec,
  Conditional: () => Conditional,
  Constructor: () => Constructor,
  ConstructorParameters: () => ConstructorParameters,
  Cyclic: () => Cyclic,
  Decode: () => Decode,
  DecodeBuilder: () => DecodeBuilder,
  Dependent: () => Dependent,
  Encode: () => Encode,
  EncodeBuilder: () => EncodeBuilder,
  Enum: () => Enum,
  Evaluate: () => Evaluate,
  Exclude: () => Exclude,
  Extends: () => Extends,
  ExtendsResult: () => exports_result,
  Extract: () => Extract,
  Function: () => _Function_,
  Generic: () => Generic,
  Identifier: () => Identifier,
  Immutable: () => Immutable,
  Index: () => Index,
  Infer: () => Infer,
  InstanceType: () => InstanceType,
  Instantiate: () => Instantiate,
  Integer: () => Integer,
  Interface: () => Interface,
  Intersect: () => Intersect,
  IsAny: () => IsAny,
  IsArray: () => IsArray2,
  IsBigInt: () => IsBigInt2,
  IsBoolean: () => IsBoolean3,
  IsCall: () => IsCall,
  IsCodec: () => IsCodec,
  IsConstructor: () => IsConstructor2,
  IsCyclic: () => IsCyclic,
  IsDependent: () => IsDependent,
  IsEnum: () => IsEnum,
  IsEnumValue: () => IsEnumValue,
  IsFunction: () => IsFunction2,
  IsGeneric: () => IsGeneric,
  IsIdentifier: () => IsIdentifier,
  IsImmutable: () => IsImmutable,
  IsInfer: () => IsInfer,
  IsInteger: () => IsInteger2,
  IsIntersect: () => IsIntersect,
  IsKind: () => IsKind,
  IsLiteral: () => IsLiteral,
  IsNever: () => IsNever,
  IsNull: () => IsNull2,
  IsNumber: () => IsNumber3,
  IsObject: () => IsObject2,
  IsOptional: () => IsOptional,
  IsParameter: () => IsParameter,
  IsReadonly: () => IsReadonly,
  IsRecord: () => IsRecord,
  IsRef: () => IsRef,
  IsRefine: () => IsRefine,
  IsRest: () => IsRest,
  IsSchema: () => IsSchema,
  IsString: () => IsString3,
  IsSymbol: () => IsSymbol2,
  IsTemplateLiteral: () => IsTemplateLiteral,
  IsThis: () => IsThis,
  IsTuple: () => IsTuple,
  IsUndefined: () => IsUndefined2,
  IsUnion: () => IsUnion,
  IsUnknown: () => IsUnknown,
  IsUnsafe: () => IsUnsafe,
  IsVoid: () => IsVoid,
  KeyOf: () => KeyOf2,
  Literal: () => Literal,
  Lowercase: () => Lowercase,
  Mapped: () => Mapped,
  Module: () => Module2,
  Never: () => Never,
  NonNullable: () => NonNullable,
  Null: () => Null,
  Number: () => Number2,
  Object: () => _Object_,
  Omit: () => Omit,
  Optional: () => Optional,
  Parameter: () => Parameter,
  Parameters: () => Parameters,
  Partial: () => Partial,
  Pick: () => Pick,
  Readonly: () => Readonly,
  ReadonlyObject: () => ReadonlyObject,
  ReadonlyType: () => ReadonlyType,
  Record: () => Record,
  RecordKey: () => RecordKey,
  RecordPattern: () => RecordPattern,
  RecordValue: () => RecordValue,
  Ref: () => Ref,
  Refine: () => Refine,
  Required: () => Required,
  Rest: () => Rest,
  ReturnType: () => ReturnType,
  Script: () => Script2,
  String: () => String2,
  Symbol: () => Symbol2,
  TemplateLiteral: () => TemplateLiteral2,
  This: () => This,
  Tuple: () => Tuple,
  Uncapitalize: () => Uncapitalize,
  Undefined: () => Undefined,
  Union: () => Union,
  Unknown: () => Unknown,
  Unsafe: () => Unsafe,
  Uppercase: () => Uppercase,
  Void: () => Void,
  With: () => With2
});
var init_typebox = __esm(() => {
  init_instantiate27();
  init_extends3();
  init_script2();
  init_capitalize();
  init_conditional();
  init_constructor_parameters();
  init_evaluate4();
  init_exclude();
  init_extract();
  init_action();
  init_instance_type();
  init_interface();
  init_keyof();
  init_lowercase();
  init_mapped();
  init_module();
  init_non_nullable();
  init_omit();
  init_parameters2();
  init_partial();
  init_pick();
  init_readonly_object();
  init_required();
  init_return_type2();
  init_uncapitalize();
  init_uppercase();
  init_with();
  init__codec();
  init__immutable();
  init__optional();
  init__readonly();
  init__refine();
  init_any();
  init_array();
  init_bigint();
  init_boolean();
  init_call();
  init_constructor();
  init_cyclic();
  init_enum();
  init_function();
  init_generic();
  init_identifier();
  init_dependent();
  init_infer();
  init_integer();
  init_intersect();
  init_literal();
  init_never();
  init_null();
  init_number();
  init_object();
  init_parameter();
  init_record();
  init_ref();
  init_rest();
  init_schema();
  init_string();
  init_symbol();
  init_template_literal();
  init_this();
  init_tuple();
  init_undefined();
  init_union();
  init_unknown();
  init_unsafe();
  init_void();
});

// node_modules/typebox/build/index.mjs
var exports_build = {};
__export(exports_build, {
  AddImmutable: () => AddImmutable,
  AddImmutableDeferred: () => AddImmutableDeferred,
  AddOptional: () => AddOptional,
  AddOptionalDeferred: () => AddOptionalDeferred,
  AddReadonly: () => AddReadonly,
  AddReadonlyDeferred: () => AddReadonlyDeferred,
  Any: () => Any,
  Array: () => _Array_,
  ArrayOptions: () => ArrayOptions,
  BigInt: () => BigInt2,
  BigIntPattern: () => BigIntPattern,
  Boolean: () => Boolean2,
  Broaden: () => Broaden,
  Call: () => Call,
  CallConstruct: () => CallConstruct,
  Capitalize: () => Capitalize,
  CapitalizeAction: () => CapitalizeAction,
  CapitalizeDeferred: () => CapitalizeDeferred,
  CapitalizeInstantiate: () => CapitalizeInstantiate,
  Codec: () => Codec,
  CollapseToObject: () => CollapseToObject,
  Compare: () => Compare,
  Composite: () => Composite,
  Conditional: () => Conditional,
  ConditionalAction: () => ConditionalAction,
  ConditionalDeferred: () => ConditionalDeferred,
  ConditionalInstantiate: () => ConditionalInstantiate,
  Constructor: () => Constructor,
  ConstructorOptions: () => ConstructorOptions,
  ConstructorParameters: () => ConstructorParameters,
  ConstructorParametersAction: () => ConstructorParametersAction,
  ConstructorParametersDeferred: () => ConstructorParametersDeferred,
  ConstructorParametersInstantiate: () => ConstructorParametersInstantiate,
  ConvertToIntegerKey: () => ConvertToIntegerKey,
  Cyclic: () => Cyclic,
  CyclicCandidates: () => CyclicCandidates,
  CyclicCheck: () => CyclicCheck,
  CyclicDependencies: () => CyclicDependencies,
  CyclicExtends: () => CyclicExtends,
  CyclicOptions: () => CyclicOptions,
  CyclicTarget: () => CyclicTarget,
  Decode: () => Decode,
  DecodeBuilder: () => DecodeBuilder,
  Deferred: () => Deferred,
  Dependent: () => Dependent,
  DependentOptions: () => DependentOptions,
  Distribute: () => Distribute,
  Encode: () => Encode,
  EncodeBuilder: () => EncodeBuilder,
  Enum: () => Enum,
  Evaluate: () => Evaluate,
  EvaluateAction: () => EvaluateAction,
  EvaluateDeferred: () => EvaluateDeferred,
  EvaluateDependent: () => EvaluateDependent,
  EvaluateEnum: () => EvaluateEnum,
  EvaluateInstantiate: () => EvaluateInstantiate,
  EvaluateIntersect: () => EvaluateIntersect,
  EvaluateTemplateLiteral: () => EvaluateTemplateLiteral,
  EvaluateType: () => EvaluateType,
  EvaluateUnion: () => EvaluateUnion,
  EvaluateUnionFast: () => EvaluateUnionFast,
  Exclude: () => Exclude,
  ExcludeAction: () => ExcludeAction,
  ExcludeDeferred: () => ExcludeDeferred,
  ExcludeInstantiate: () => ExcludeInstantiate,
  Extends: () => Extends,
  ExtendsResult: () => exports_result,
  Extract: () => Extract,
  ExtractAction: () => ExtractAction,
  ExtractDeferred: () => ExtractDeferred,
  ExtractInstantiate: () => ExtractInstantiate,
  Flatten: () => Flatten,
  Function: () => _Function_,
  FunctionOptions: () => FunctionOptions,
  Generic: () => Generic,
  Identifier: () => Identifier,
  Immutable: () => Immutable,
  Index: () => Index,
  IndexAction: () => IndexAction,
  IndexDeferred: () => IndexDeferred,
  IndexInstantiate: () => IndexInstantiate,
  Infer: () => Infer,
  InstanceType: () => InstanceType,
  InstanceTypeAction: () => InstanceTypeAction,
  InstanceTypeDeferred: () => InstanceTypeDeferred,
  InstanceTypeInstantiate: () => InstanceTypeInstantiate,
  Instantiate: () => Instantiate,
  InstantiateCyclic: () => InstantiateCyclic,
  Integer: () => Integer,
  IntegerKey: () => IntegerKey,
  IntegerPattern: () => IntegerPattern,
  Interface: () => Interface,
  InterfaceAction: () => InterfaceAction,
  InterfaceDeferred: () => InterfaceDeferred,
  InterfaceInstantiate: () => InterfaceInstantiate,
  Intersect: () => Intersect,
  IntersectOptions: () => IntersectOptions,
  InvalidLiteralValue: () => InvalidLiteralValue,
  IsAny: () => IsAny,
  IsArray: () => IsArray2,
  IsBigInt: () => IsBigInt2,
  IsBoolean: () => IsBoolean3,
  IsCall: () => IsCall,
  IsCodec: () => IsCodec,
  IsConstructor: () => IsConstructor2,
  IsCyclic: () => IsCyclic,
  IsDeferred: () => IsDeferred,
  IsDependent: () => IsDependent,
  IsEnum: () => IsEnum,
  IsEnumValue: () => IsEnumValue,
  IsFunction: () => IsFunction2,
  IsGeneric: () => IsGeneric,
  IsIdentifier: () => IsIdentifier,
  IsImmutable: () => IsImmutable,
  IsInfer: () => IsInfer,
  IsInteger: () => IsInteger2,
  IsInterfaceDeferred: () => IsInterfaceDeferred,
  IsIntersect: () => IsIntersect,
  IsKind: () => IsKind,
  IsLiteral: () => IsLiteral,
  IsLiteralBigInt: () => IsLiteralBigInt,
  IsLiteralBoolean: () => IsLiteralBoolean,
  IsLiteralNumber: () => IsLiteralNumber,
  IsLiteralString: () => IsLiteralString,
  IsLiteralValue: () => IsLiteralValue,
  IsNever: () => IsNever,
  IsNull: () => IsNull2,
  IsNumber: () => IsNumber3,
  IsObject: () => IsObject2,
  IsOptional: () => IsOptional,
  IsParameter: () => IsParameter,
  IsReadonly: () => IsReadonly,
  IsRecord: () => IsRecord,
  IsRef: () => IsRef,
  IsRefine: () => IsRefine,
  IsRefinement: () => IsRefinement,
  IsRest: () => IsRest,
  IsSchema: () => IsSchema,
  IsString: () => IsString3,
  IsSymbol: () => IsSymbol2,
  IsTemplateLiteral: () => IsTemplateLiteral,
  IsTemplateLiteralDeferred: () => IsTemplateLiteralDeferred,
  IsTemplateLiteralFinite: () => IsTemplateLiteralFinite,
  IsTemplateLiteralPattern: () => IsTemplateLiteralPattern,
  IsThis: () => IsThis,
  IsTuple: () => IsTuple,
  IsTypeScriptEnumLike: () => IsTypeScriptEnumLike,
  IsUndefined: () => IsUndefined2,
  IsUnion: () => IsUnion,
  IsUnknown: () => IsUnknown,
  IsUnsafe: () => IsUnsafe,
  IsVoid: () => IsVoid,
  KeyOf: () => KeyOf2,
  KeyOfAction: () => KeyOfAction,
  KeyOfDeferred: () => KeyOfDeferred,
  KeyOfInstantiate: () => KeyOfInstantiate,
  KeysToIndexer: () => KeysToIndexer,
  Literal: () => Literal,
  LiteralTypeName: () => LiteralTypeName,
  Lowercase: () => Lowercase,
  LowercaseAction: () => LowercaseAction,
  LowercaseDeferred: () => LowercaseDeferred,
  LowercaseInstantiate: () => LowercaseInstantiate,
  Mapped: () => Mapped,
  MappedAction: () => MappedAction,
  MappedDeferred: () => MappedDeferred,
  MappedInstantiate: () => MappedInstantiate,
  Module: () => Module2,
  ModuleDeferred: () => ModuleDeferred,
  ModuleInstantiate: () => ModuleInstantiate,
  Narrow: () => Narrow,
  Never: () => Never,
  NeverPattern: () => NeverPattern,
  NonNullable: () => NonNullable,
  NonNullableAction: () => NonNullableAction,
  NonNullableDeferred: () => NonNullableDeferred,
  NonNullableInstantiate: () => NonNullableInstantiate,
  Null: () => Null,
  Number: () => Number2,
  NumberKey: () => NumberKey,
  NumberPattern: () => NumberPattern,
  Object: () => _Object_,
  ObjectOptions: () => ObjectOptions,
  Omit: () => Omit,
  OmitAction: () => OmitAction,
  OmitDeferred: () => OmitDeferred,
  OmitInstantiate: () => OmitInstantiate,
  Optional: () => Optional,
  Parameter: () => Parameter,
  Parameters: () => Parameters,
  ParametersAction: () => ParametersAction,
  ParametersDeferred: () => ParametersDeferred,
  ParametersInstantiate: () => ParametersInstantiate,
  ParsePatternIntoTypes: () => ParsePatternIntoTypes,
  ParseTemplateIntoTypes: () => ParseTemplateIntoTypes,
  Partial: () => Partial,
  PartialAction: () => PartialAction,
  PartialDeferred: () => PartialDeferred,
  PartialInstantiate: () => PartialInstantiate,
  Pick: () => Pick,
  PickAction: () => PickAction,
  PickDeferred: () => PickDeferred,
  PickInstantiate: () => PickInstantiate,
  Priority: () => Priority,
  PropertyKeys: () => PropertyKeys,
  PropertyValues: () => PropertyValues,
  Readonly: () => Readonly,
  ReadonlyObject: () => ReadonlyObject,
  ReadonlyObjectAction: () => ReadonlyObjectAction,
  ReadonlyObjectDeferred: () => ReadonlyObjectDeferred,
  ReadonlyObjectInstantiate: () => ReadonlyObjectInstantiate,
  ReadonlyType: () => ReadonlyType,
  Record: () => Record,
  RecordAction: () => RecordAction,
  RecordDeferred: () => RecordDeferred,
  RecordFromPattern: () => RecordFromPattern,
  RecordInstantiate: () => RecordInstantiate,
  RecordKey: () => RecordKey,
  RecordOptions: () => RecordOptions,
  RecordPattern: () => RecordPattern,
  RecordPatternToType: () => RecordPatternToType,
  RecordValue: () => RecordValue,
  Ref: () => Ref,
  RefInstantiate: () => RefInstantiate,
  Refine: () => Refine,
  RefineAdd: () => RefineAdd,
  RemoveImmutable: () => RemoveImmutable,
  RemoveImmutableDeferred: () => RemoveImmutableDeferred,
  RemoveOptional: () => RemoveOptional,
  RemoveOptionalDeferred: () => RemoveOptionalDeferred,
  RemoveReadonly: () => RemoveReadonly,
  RemoveReadonlyDeferred: () => RemoveReadonlyDeferred,
  Required: () => Required,
  RequiredAction: () => RequiredAction,
  RequiredArray: () => RequiredArray,
  RequiredDeferred: () => RequiredDeferred,
  RequiredInstantiate: () => RequiredInstantiate,
  Rest: () => Rest,
  ResultDisjoint: () => ResultDisjoint,
  ResultEqual: () => ResultEqual,
  ResultLeftInside: () => ResultLeftInside,
  ResultRightInside: () => ResultRightInside,
  ReturnType: () => ReturnType,
  ReturnTypeAction: () => ReturnTypeAction,
  ReturnTypeDeferred: () => ReturnTypeDeferred,
  ReturnTypeInstantiate: () => ReturnTypeInstantiate,
  Script: () => Script2,
  String: () => String2,
  StringKey: () => StringKey,
  StringPattern: () => StringPattern,
  Symbol: () => Symbol2,
  TemplateLiteral: () => TemplateLiteral2,
  TemplateLiteralCreate: () => TemplateLiteralCreate,
  TemplateLiteralDecode: () => TemplateLiteralDecode,
  TemplateLiteralDecodeUnsafe: () => TemplateLiteralDecodeUnsafe,
  TemplateLiteralDeferred: () => TemplateLiteralDeferred,
  TemplateLiteralEncode: () => TemplateLiteralEncode,
  TemplateLiteralFromString: () => TemplateLiteralFromString,
  TemplateLiteralFromTypes: () => TemplateLiteralFromTypes,
  This: () => This,
  Tuple: () => Tuple,
  TupleOptions: () => TupleOptions,
  Type: () => exports_typebox,
  TypeScriptEnumToEnumValues: () => TypeScriptEnumToEnumValues,
  Uncapitalize: () => Uncapitalize,
  UncapitalizeAction: () => UncapitalizeAction,
  UncapitalizeDeferred: () => UncapitalizeDeferred,
  UncapitalizeInstantiate: () => UncapitalizeInstantiate,
  Undefined: () => Undefined,
  Union: () => Union,
  UnionOptions: () => UnionOptions,
  Unknown: () => Unknown,
  Unsafe: () => Unsafe,
  Uppercase: () => Uppercase,
  UppercaseAction: () => UppercaseAction,
  UppercaseDeferred: () => UppercaseDeferred,
  UppercaseInstantiate: () => UppercaseInstantiate,
  Void: () => Void,
  With: () => With2,
  WithAction: () => WithAction,
  WithDeferred: () => WithDeferred,
  WithInstantiate: () => WithInstantiate,
  _Array_: () => _Array_,
  _Function_: () => _Function_,
  _Object_: () => _Object_,
  default: () => build_default
});
var build_default;
var init_build = __esm(() => {
  init_typebox();
  init_typebox();
  init_action();
  init_engine();
  init_extends3();
  init_script2();
  init_types();
  build_default = exports_typebox;
});

// src/host.ts
var HEADROOM_HOST = Symbol.for("headroom.host");
function readHost(pi) {
  return pi?.[HEADROOM_HOST] ?? "omp";
}

// src/index.ts
import { spawn } from "node:child_process";
import { createHash as createHash2 } from "node:crypto";
import {
  appendFileSync,
  existsSync as existsSync3,
  mkdirSync as mkdirSync2,
  readdirSync as readdirSync2,
  readFileSync as readFileSync4,
  statSync,
  unlinkSync as unlinkSync2,
  writeFileSync as writeFileSync2
} from "node:fs";
import { homedir as homedir2 } from "node:os";
import { join as join5 } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

// src/archive-stats.ts
import { mkdir as mkdir2, readFile, rename as rename2, unlink, writeFile as writeFile2 } from "node:fs/promises";
import { join as join2 } from "node:path";

// src/config.ts
import { existsSync, readFileSync } from "node:fs";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
var EXTENSION_KEY = "headroom";
var RETRIEVE_TOOL = "headroom_retrieve";
var COMPRESS_TOOL = "headroom_compress";
var STATS_TOOL = "headroom_stats";
var DEFAULT_PROXY_URL = "http://127.0.0.1:8787";
var HEADROOM_CONFIG_PATH = join(homedir(), ".omp", "agent", "headroom.yml");
var PACKAGE_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
var SYSTEMD_TEMPLATE_PATH = join(PACKAGE_ROOT, "systemd", "headroom-proxy.service.in");
function loadHeadroomConfig(path = HEADROOM_CONFIG_PATH) {
  try {
    const text = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (!text.trim())
      return {};
    const parsed = typeof Bun?.YAML?.parse === "function" ? Bun.YAML.parse(text) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
var _cfg = loadHeadroomConfig();
function cfgStr(yamlKey, envKey, def) {
  if (process.env[envKey] !== undefined)
    return process.env[envKey];
  if (yamlKey in _cfg)
    return String(_cfg[yamlKey]);
  return def;
}
function cfgNum(yamlKey, envKey, def) {
  const v = process.env[envKey] !== undefined ? process.env[envKey] : (yamlKey in _cfg) ? _cfg[yamlKey] : undefined;
  if (v === undefined)
    return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
function cfgBool(yamlKey, envKey, truthy) {
  const v = process.env[envKey] !== undefined ? process.env[envKey] : (yamlKey in _cfg) ? _cfg[yamlKey] : undefined;
  if (v === undefined)
    return truthy;
  if (typeof v === "boolean")
    return v;
  const s = String(v).toLowerCase();
  if (["1", "true", "on", "yes"].includes(s))
    return true;
  if (["0", "false", "off", "no"].includes(s))
    return false;
  return truthy;
}
function cfgBoolOff(yamlKey, envKey) {
  const v = process.env[envKey] !== undefined ? process.env[envKey] : (yamlKey in _cfg) ? _cfg[yamlKey] : undefined;
  if (v === undefined)
    return true;
  if (typeof v === "boolean")
    return v;
  const s = String(v).toLowerCase();
  if (["0", "false", "off", "no"].includes(s))
    return false;
  return true;
}
var DEFAULT_HEADROOM_BIN = join(homedir(), ".omp", "agent", "headroom-venv", "bin", "headroom");
var WIDGET_PLACEMENT = process.env.OMP_HEADROOM_WIDGET_PLACEMENT || "rightEditor";
var PROXY_URL = (process.env.OMP_HEADROOM_URL || DEFAULT_PROXY_URL).replace(/\/+$/, "");
var DASHBOARD_URL = `${PROXY_URL}/dashboard`;
var HEADROOM_BIN = cfgStr("bin", "OMP_HEADROOM_BIN", DEFAULT_HEADROOM_BIN);
var MIN_TOOL_TEXT_CHARS = cfgNum("min_tool_chars", "OMP_HEADROOM_MIN_TOOL_CHARS", 12000);
var ANTHROPIC_MIN_TOOL_TEXT_CHARS = cfgNum("anthropic_min_tool_chars", "OMP_HEADROOM_ANTHROPIC_MIN_TOOL_CHARS", 8000);
var PROVIDER_MIN_TEXT_CHARS = cfgNum("min_provider_chars", "OMP_HEADROOM_MIN_PROVIDER_CHARS", 1000);
var ADAPTIVE_THRESHOLDS = cfgBoolOff("adaptive", "OMP_HEADROOM_ADAPTIVE");
var ADAPTIVE_START_RATIO = cfgNum("adaptive_start", "OMP_HEADROOM_ADAPTIVE_START", 0.5);
var ADAPTIVE_FULL_RATIO = cfgNum("adaptive_full", "OMP_HEADROOM_ADAPTIVE_FULL", 0.9);
var ADAPTIVE_FLOOR_RATIO = cfgNum("adaptive_floor", "OMP_HEADROOM_ADAPTIVE_FLOOR", 0.25);
var DEBUG_SIZING = cfgBool("debug_sizing", "OMP_HEADROOM_DEBUG_SIZING", false);
var SESSION_ARCHIVE_ENABLED = cfgBoolOff("session_archive", "OMP_HEADROOM_SESSION_COMPACTION");
var SESSION_LIVE_MESSAGES = cfgNum("session_live_messages", "OMP_HEADROOM_LIVE_MESSAGES", 24);
var SESSION_PREFIX_MIN_CHARS = cfgNum("session_prefix_min_chars", "OMP_HEADROOM_PREFIX_MIN_CHARS", 30000);
var SESSION_PREFIX_MIN_SHARE = cfgNum("session_prefix_min_share", "OMP_HEADROOM_PREFIX_MIN_SHARE", 0.45);
var SESSION_ARCHIVE_MAX_MESSAGE_CHARS = cfgNum("session_archive_max_message_chars", "OMP_HEADROOM_ARCHIVE_MAX_MESSAGE_CHARS", 900);
var PROVIDER_TIMEOUT_MS = Number(process.env.OMP_HEADROOM_TIMEOUT_MS || 12000);
var TOOL_TIMEOUT_MS = Number(process.env.OMP_HEADROOM_TOOL_TIMEOUT_MS || 20000);
var ANTHROPIC_COMPRESSION_ENABLED = process.env.OMP_HEADROOM_ANTHROPIC_PROVIDER !== "off";
var RAINBOW_MS = Number(process.env.OMP_HEADROOM_RAINBOW_MS || 180);
var RAINBOW_CODES = [196, 202, 226, 46, 51, 39, 129, 201];
var READY_TTL_MS = Number(process.env.OMP_HEADROOM_READY_TTL_MS || 30000);
var STATS_MIN_INTERVAL_MS = Number(process.env.OMP_HEADROOM_STATS_INTERVAL_MS || 2500);
var CONNECT_BACKOFF_MS = [5000, 1e4, 20000, 40000, 60000];
var WIDGET_PRIORITY = Number(process.env.OMP_HEADROOM_PRIORITY) || -1050;
var COMPRESSED_MARKER = "Retrieve more: hash=";
var RETRIEVED_MARKER = "[headroom:retrieved ";
var VENV_DIR = dirname(dirname(HEADROOM_BIN));
var LOGS_DIR = join(dirname(dirname(VENV_DIR)), "logs", "headroom");
var ARCHIVE_STATS_DIR = cfgStr("archive_stats_dir", "OMP_HEADROOM_ARCHIVE_STATS_DIR", join(dirname(VENV_DIR), "headroom-archive-stats"));
var VENV_PYTHON = join(VENV_DIR, "bin", "python");
var AUTOUPDATE = process.env.OMP_HEADROOM_AUTOUPDATE !== "0";
var UPDATE_INTERVAL_MS = Number(process.env.OMP_HEADROOM_UPDATE_INTERVAL_MS || 24 * 3600000);
var EXTRAS = process.env.OMP_HEADROOM_EXTRAS ?? "all";
var PACKAGE_SPEC = EXTRAS ? `headroom-ai[${EXTRAS}]` : "headroom-ai";
var UPDATE_STATE_FILE = join(dirname(VENV_DIR), ".headroom-update.json");
var UPDATE_LOCK_FILE = join(dirname(VENV_DIR), ".headroom-update.lock");
var CCR_DIR = join(dirname(VENV_DIR), "headroom-ccr");
var CODE_AWARE = process.env.OMP_HEADROOM_CODE_AWARE !== "0";
var PROXY_EXTRA_ARGS = (process.env.OMP_HEADROOM_PROXY_ARGS || "").split(/\s+/).filter(Boolean);
var RESPONSES_COMPRESS_CONCURRENCY = Math.max(1, Math.min(8, Number(process.env.OMP_HEADROOM_RESPONSES_CONCURRENCY || 3) || 3));
var PYPI_JSON_URL = "https://pypi.org/pypi/headroom-ai/json";
var HEADROOM_SETTINGS = [
  {
    key: "bin",
    env: "OMP_HEADROOM_BIN",
    kind: "string",
    def: DEFAULT_HEADROOM_BIN,
    description: "Headroom proxy binary path"
  },
  {
    key: "min_tool_chars",
    env: "OMP_HEADROOM_MIN_TOOL_CHARS",
    kind: "number",
    def: 12000,
    description: "Responses per-item compression threshold (chars)"
  },
  {
    key: "anthropic_min_tool_chars",
    env: "OMP_HEADROOM_ANTHROPIC_MIN_TOOL_CHARS",
    kind: "number",
    def: 8000,
    description: "Anthropic tool_result compression threshold (chars)"
  },
  {
    key: "min_provider_chars",
    env: "OMP_HEADROOM_MIN_PROVIDER_CHARS",
    kind: "number",
    def: 1000,
    description: "Minimum text size considered a compression candidate (chars)"
  },
  {
    key: "adaptive",
    env: "OMP_HEADROOM_ADAPTIVE",
    kind: "boolean",
    def: true,
    description: "Scale thresholds down as context usage grows"
  },
  {
    key: "adaptive_start",
    env: "OMP_HEADROOM_ADAPTIVE_START",
    kind: "number",
    def: 0.5,
    description: "Context usage ratio where adaptive scaling starts"
  },
  {
    key: "adaptive_full",
    env: "OMP_HEADROOM_ADAPTIVE_FULL",
    kind: "number",
    def: 0.9,
    description: "Context usage ratio where thresholds reach the floor"
  },
  {
    key: "adaptive_floor",
    env: "OMP_HEADROOM_ADAPTIVE_FLOOR",
    kind: "number",
    def: 0.25,
    description: "Lowest threshold multiplier under adaptive scaling"
  },
  {
    key: "debug_sizing",
    env: "OMP_HEADROOM_DEBUG_SIZING",
    kind: "boolean",
    def: false,
    description: "Write per-request sizing/diagnostic JSONL logs"
  },
  {
    key: "session_archive",
    env: "OMP_HEADROOM_SESSION_COMPACTION",
    kind: "boolean",
    def: true,
    description: "Archive stable transcript prefixes into retrievable summaries"
  },
  {
    key: "session_live_messages",
    env: "OMP_HEADROOM_LIVE_MESSAGES",
    kind: "number",
    def: 24,
    description: "Recent messages always kept out of the session archive"
  },
  {
    key: "session_prefix_min_chars",
    env: "OMP_HEADROOM_PREFIX_MIN_CHARS",
    kind: "number",
    def: 30000,
    description: "Minimum archivable prefix size (chars)"
  },
  {
    key: "session_prefix_min_share",
    env: "OMP_HEADROOM_PREFIX_MIN_SHARE",
    kind: "number",
    def: 0.45,
    description: "Minimum archivable prefix share of the payload"
  },
  {
    key: "session_archive_max_message_chars",
    env: "OMP_HEADROOM_ARCHIVE_MAX_MESSAGE_CHARS",
    kind: "number",
    def: 900,
    description: "Per-message excerpt cap inside the session archive"
  },
  {
    key: "archive_stats_dir",
    env: "OMP_HEADROOM_ARCHIVE_STATS_DIR",
    kind: "string",
    def: join(dirname(VENV_DIR), "headroom-archive-stats"),
    description: "Directory for durable per-session archive counters"
  }
];
function settingSource(setting, cfg = _cfg, env = process.env) {
  if (env[setting.env] !== undefined)
    return "env";
  if (setting.key in cfg)
    return "yaml";
  return "default";
}
function effectiveSettingValue(setting, cfg = _cfg, env = process.env) {
  const raw = env[setting.env] !== undefined ? env[setting.env] : (setting.key in cfg) ? cfg[setting.key] : undefined;
  if (raw === undefined)
    return setting.def;
  if (setting.kind === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : setting.def;
  }
  if (setting.kind === "boolean") {
    if (typeof raw === "boolean")
      return raw;
    const s = String(raw).toLowerCase();
    if (["1", "true", "on", "yes"].includes(s))
      return true;
    if (["0", "false", "off", "no"].includes(s))
      return false;
    return setting.def;
  }
  return String(raw);
}
function invalidSettingValue(setting, cfg = _cfg, env = process.env) {
  const raw = env[setting.env] !== undefined ? env[setting.env] : (setting.key in cfg) ? cfg[setting.key] : undefined;
  if (raw === undefined)
    return;
  if (setting.kind === "number") {
    return Number.isFinite(Number(raw)) ? undefined : String(raw);
  }
  if (setting.kind === "boolean") {
    if (typeof raw === "boolean")
      return;
    const s = String(raw).toLowerCase();
    return ["1", "true", "on", "yes", "0", "false", "off", "no"].includes(s) ? undefined : String(raw);
  }
  return;
}
function parseSettingValue(setting, value) {
  const trimmed = value.trim();
  if (!trimmed)
    throw new Error(`"${setting.key}" requires a value`);
  if (setting.kind === "number") {
    const n = Number(trimmed);
    if (!Number.isFinite(n))
      throw new Error(`"${setting.key}" expects a number, got "${trimmed}"`);
    return n;
  }
  if (setting.kind === "boolean") {
    const s = trimmed.toLowerCase();
    if (["1", "true", "on", "yes"].includes(s))
      return true;
    if (["0", "false", "off", "no"].includes(s))
      return false;
    throw new Error(`"${setting.key}" expects on/off, got "${trimmed}"`);
  }
  return trimmed;
}
async function saveHeadroomConfigKey(key, value, path = HEADROOM_CONFIG_PATH) {
  const root = loadHeadroomConfig(path);
  root[key] = value;
  const directory = dirname(path);
  await mkdir(directory, { recursive: true });
  const temporaryPath = join(directory, `.headroom.yml.${process.pid}.${Date.now().toString(36)}.tmp`);
  try {
    await writeFile(temporaryPath, Bun.YAML.stringify(root), { encoding: "utf8", mode: 384 });
    await rename(temporaryPath, path);
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(() => {
      return;
    });
    throw error;
  }
}

// src/util.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isMainSession(ctx) {
  return ctx?.hasUI === true;
}
function safeSessionId(value) {
  const id = typeof value === "string" ? value : "";
  return /^[A-Za-z0-9_-]{8,128}$/.test(id) ? id : "";
}
function asNumber(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function formatInt(value) {
  return Math.round(asNumber(value)).toLocaleString();
}
function formatPct(value) {
  const n = asNumber(value);
  return `${n.toFixed(n >= 10 ? 0 : 1)}%`;
}
function formatUsd(value) {
  const n = asNumber(value);
  return n > 0 ? `$${n.toFixed(2)}` : "$0.00";
}
function formatCompactTokens(value) {
  const n = Math.max(0, asNumber(value));
  if (n >= 1e9)
    return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)
    return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000)
    return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}
function computeInner(contentWidth = 0) {
  const cols = process.stdout.columns || 102;
  const envMax = Number(process.env.OMP_HEADROOM_WIDGET_MAX_WIDTH || 0);
  const envMin = Number(process.env.OMP_HEADROOM_WIDGET_MIN_WIDTH || 0);
  const min = Number.isFinite(envMin) && envMin >= 12 ? envMin : 18;
  const autoMax = Math.max(min, Math.min(52, Math.floor(cols * 0.45) - 2));
  const cap = Number.isFinite(envMax) && envMax >= min ? envMax : autoMax;
  return Math.max(min, Math.min(cap, Math.max(min, contentWidth)));
}
function color(code, text) {
  return `\x1B[${code}m${text}\x1B[0m`;
}
function rainbow(text, phase) {
  let out = "";
  for (let i = 0;i < text.length; i++) {
    out += color(`38;5;${RAINBOW_CODES[(i + phase) % RAINBOW_CODES.length]}`, text[i]);
  }
  return out;
}
function link(url, text) {
  return `\x1B]8;;${url}\x1B\\${text}\x1B]8;;\x1B\\`;
}
function clip(text, max) {
  const value = String(text ?? "");
  if (value.length <= max)
    return value;
  return max <= 1 ? value.slice(0, max) : `${value.slice(0, max - 1)}…`;
}
function row(text, inner) {
  const value = clip(text, Math.max(0, inner - 1));
  return `│${value}${" ".repeat(Math.max(0, inner - value.length))}│`;
}
function borderLine(inner, open, close, leftRaw, leftStyled, rightRaw = "", rightStyled = "") {
  const fill = Math.max(1, inner + 2 - 2 - leftRaw.length - rightRaw.length);
  return `${open}${leftStyled}${"─".repeat(fill)}${rightStyled}${close}`;
}
function getTextBlocks(content) {
  if (!Array.isArray(content))
    return [];
  return content.filter((block) => isRecord(block) && block.type === "text" && typeof block.text === "string");
}
function stableJson(value) {
  return JSON.stringify(value, (_key, v) => {
    if (!isRecord(v))
      return v;
    const out = {};
    for (const key of Object.keys(v).sort())
      out[key] = v[key];
    return out;
  });
}
function truncateMiddle(text, maxChars) {
  const source = text.isWellFormed() ? text : text.toWellFormed();
  if (source.length <= maxChars)
    return source;
  const half = Math.max(20, Math.floor((maxChars - 40) / 2));
  let prefixEnd = half;
  if (prefixEnd < source.length && source.charCodeAt(prefixEnd - 1) >= 55296 && source.charCodeAt(prefixEnd - 1) <= 56319 && source.charCodeAt(prefixEnd) >= 56320 && source.charCodeAt(prefixEnd) <= 57343) {
    prefixEnd -= 1;
  }
  let suffixStart = source.length - half;
  if (suffixStart > 0 && source.charCodeAt(suffixStart - 1) >= 55296 && source.charCodeAt(suffixStart - 1) <= 56319 && source.charCodeAt(suffixStart) >= 56320 && source.charCodeAt(suffixStart) <= 57343) {
    suffixStart -= 1;
  }
  const archivedChars = Math.max(0, suffixStart - prefixEnd);
  return `${source.slice(0, prefixEnd)}
… [${archivedChars} chars archived; retrieve full prefix by hash] …
${source.slice(suffixStart)}`;
}
function isNewer(candidate, current) {
  if (!candidate || !current)
    return false;
  const a = String(candidate).split(/[^0-9]+/).filter(Boolean).map(Number);
  const b = String(current).split(/[^0-9]+/).filter(Boolean).map(Number);
  for (let i = 0;i < Math.max(a.length, b.length); i++) {
    const delta = (a[i] || 0) - (b[i] || 0);
    if (delta !== 0)
      return delta > 0;
  }
  return false;
}

// src/archive-stats.ts
var ZERO_TOTALS = {
  count: 0,
  charsBefore: 0,
  charsAfter: 0,
  charsSaved: 0
};
function normalizedInteger(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
function normalizeTotals(totals) {
  return {
    count: normalizedInteger(totals.count),
    charsBefore: normalizedInteger(totals.charsBefore),
    charsAfter: normalizedInteger(totals.charsAfter),
    charsSaved: normalizedInteger(totals.charsSaved)
  };
}
function isStoredTotals(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return false;
  const record = value;
  return ["count", "charsBefore", "charsAfter", "charsSaved"].every((key) => typeof record[key] === "number" && Number.isInteger(record[key]) && record[key] >= 0);
}
function archiveStatsPath(sessionId, dir = ARCHIVE_STATS_DIR) {
  const id = safeSessionId(sessionId);
  return id ? join2(dir, `${id}.json`) : "";
}
async function readArchiveTotals(sessionId, dir = ARCHIVE_STATS_DIR) {
  const path = archiveStatsPath(sessionId, dir);
  if (!path)
    return { ...ZERO_TOTALS };
  try {
    const parsed = JSON.parse(await readFile(path, "utf8"));
    return isStoredTotals(parsed) ? parsed : { ...ZERO_TOTALS };
  } catch {
    return { ...ZERO_TOTALS };
  }
}
async function writeArchiveTotals(sessionId, totals, dir = ARCHIVE_STATS_DIR) {
  const path = archiveStatsPath(sessionId, dir);
  if (!path)
    return false;
  const tmp = `${path}.tmp.${process.pid}.${Math.random().toString(36).slice(2)}`;
  try {
    await mkdir2(dir, { recursive: true });
    await writeFile2(tmp, JSON.stringify(normalizeTotals(totals)), "utf8");
    await rename2(tmp, path);
    return true;
  } catch {
    try {
      await unlink(tmp);
    } catch {}
    return false;
  }
}
async function clearArchiveTotals(sessionId, dir = ARCHIVE_STATS_DIR) {
  const path = archiveStatsPath(sessionId, dir);
  if (!path)
    return false;
  try {
    await unlink(path);
    return true;
  } catch (error) {
    return error?.code === "ENOENT";
  }
}

// src/ccr.ts
import { existsSync as existsSync2 } from "node:fs";
import { mkdir as mkdir3, readdir, readFile as readFile2, rename as rename3, rmdir, unlink as unlink2, writeFile as writeFile3 } from "node:fs/promises";
import { join as join4 } from "node:path";

// src/state.ts
import { mkdirSync, readdirSync, readFileSync as readFileSync2, unlinkSync, writeFileSync } from "node:fs";
import { dirname as dirname2, join as join3 } from "node:path";
var INSTANCE_ID = `${process.pid}-${Math.random().toString(36).slice(2, 10)}`;
var FOREIGN_DIR = join3(dirname2(VENV_DIR), "headroom-foreign", String(process.pid));
var FOREIGN_FILE = join3(FOREIGN_DIR, `${INSTANCE_ID}.json`);
var FOREIGN_TTL_MS = Number(process.env.OMP_HEADROOM_FOREIGN_TTL_MS || 6 * 3600000);
var shared = {
  foreignProvider: 0,
  foreignTool: 0,
  foreignCcr: 0,
  foreignCleared: false
};
var subagentSessionIds = new Set;
function readForeignTotals() {
  const totals = { provider: 0, tool: 0, ccr: 0 };
  let files;
  try {
    files = readdirSync(FOREIGN_DIR);
  } catch {
    return totals;
  }
  const now = Date.now();
  for (const name of files) {
    if (!name.endsWith(".json") || name === `${INSTANCE_ID}.json`)
      continue;
    const file = join3(FOREIGN_DIR, name);
    try {
      const data = JSON.parse(readFileSync2(file, "utf8"));
      if (now - asNumber(data?.ts) > FOREIGN_TTL_MS) {
        try {
          unlinkSync(file);
        } catch {}
        continue;
      }
      totals.provider += Math.max(0, asNumber(data?.provider));
      totals.tool += Math.max(0, asNumber(data?.tool));
      totals.ccr += Math.max(0, asNumber(data?.ccr));
    } catch {}
  }
  return totals;
}
function createHeadroomState() {
  return {
    enabled: process.env.OMP_HEADROOM_DISABLED !== "1",
    proxyReady: false,
    proxyStarting: false,
    proxyProcess: undefined,
    proxyCheckedAt: 0,
    statsFetchedAt: 0,
    statsInFlight: undefined,
    stats: undefined,
    lastError: "",
    installState: "",
    version: "",
    latest: "",
    reconcileKey: "",
    providerCompressions: 0,
    toolCompressions: 0,
    ccrHashes: 0,
    tokensSaved: 0,
    tokensBefore: 0,
    tokensAfter: 0,
    cacheInputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    sessionArchiveCompactions: 0,
    ompCompactions: 0,
    _ompHydrated: false,
    _archiveHydrated: false,
    sessionArchiveCharsBefore: 0,
    sessionArchiveCharsAfter: 0,
    sessionArchiveCharsSaved: 0,
    headroomCompactActive: false,
    lastCompactionCcrHash: "",
    foreignProvider: 0,
    foreignTool: 0,
    foreignCcr: 0,
    foreignReadAt: 0,
    foreignSelfProvider: 0,
    foreignSelfTool: 0,
    foreignSelfCcr: 0,
    foreignCleared: false,
    sessionId: "",
    rainbowPhase: 0,
    connectAttempt: 0,
    connectExhausted: false
  };
}

// src/ccr.ts
function ccrSessionDir(sessionId, dir = CCR_DIR) {
  const id = safeSessionId(sessionId);
  return id ? join4(dir, id) : "";
}
function ccrFallbackPath(hash, dir = CCR_DIR, sessionId) {
  const slug = typeof hash === "string" ? hash : "";
  if (!/^[0-9A-Za-z_-]{8,128}$/.test(slug))
    return "";
  if (sessionId === undefined)
    return join4(dir, `${slug}.txt`);
  const sessionDir = ccrSessionDir(sessionId, dir);
  return sessionDir ? join4(sessionDir, `${slug}.txt`) : "";
}
async function readCcrFallback(hash, dir = CCR_DIR, sessionId) {
  const paths = sessionId === undefined ? [ccrFallbackPath(hash, dir)] : [ccrFallbackPath(hash, dir, sessionId), ccrFallbackPath(hash, dir)];
  for (const file of paths) {
    if (!file)
      continue;
    try {
      return await readFile2(file, "utf8");
    } catch {}
  }
  return;
}
function storageSessionId(state, ctx) {
  return safeSessionId(ctx?.sessionManager?.getSessionId?.()) || safeSessionId(state?.sessionId);
}
async function writeSessionOriginal(hash, originalText, sessionId, overwrite) {
  const dir = ccrSessionDir(sessionId);
  const file = ccrFallbackPath(hash, CCR_DIR, sessionId);
  if (!dir || !file)
    return false;
  await mkdir3(dir, { recursive: true });
  if (!overwrite && existsSync2(file))
    return true;
  const tmp = `${file}.tmp.${process.pid}.${Math.random().toString(36).slice(2)}`;
  try {
    await writeFile3(tmp, originalText, "utf8");
    await rename3(tmp, file);
    return true;
  } catch (error) {
    try {
      await unlink2(tmp);
    } catch {}
    throw error;
  }
}
function compressionHashes(result, compressedText) {
  const hashes = new Set;
  if (Array.isArray(result?.ccrHashes)) {
    for (const hash of result.ccrHashes) {
      if (ccrFallbackPath(hash))
        hashes.add(hash);
    }
  }
  if (typeof compressedText === "string") {
    for (const match of compressedText.matchAll(/hash=([0-9a-f]{8,})/g)) {
      const hash = match[1];
      if (ccrFallbackPath(hash))
        hashes.add(hash);
    }
  }
  return hashes;
}
async function persistCcrOriginal(result, originalText, compressedText, state, ctx) {
  try {
    const hashes = compressionHashes(result, compressedText);
    const sessionId = storageSessionId(state, ctx);
    if (hashes.size === 0 || typeof originalText !== "string" || !originalText || !sessionId) {
      return 0;
    }
    await Promise.all([...hashes].map((hash) => writeSessionOriginal(hash, originalText, sessionId, true)));
    if (state && ctx) {
      if (isMainSession(ctx))
        state.ccrHashes += 1;
      else
        shared.foreignCcr += 1;
    }
    return 1;
  } catch {
    return 0;
  }
}
async function persistCcrOriginalBatch(entries, state, ctx) {
  try {
    const sessionId = storageSessionId(state, ctx);
    if (!sessionId || entries.length === 0)
      return 0;
    const originalsByHash = new Map;
    for (const entry of entries) {
      if (!entry.originalText)
        return 0;
      const hashes = compressionHashes(undefined, entry.compressedText);
      if (hashes.size === 0)
        return 0;
      for (const hash of hashes) {
        const existing = originalsByHash.get(hash);
        if (existing !== undefined && existing !== entry.originalText)
          return 0;
        originalsByHash.set(hash, entry.originalText);
      }
    }
    await Promise.all([...originalsByHash].map(([hash, original]) => writeSessionOriginal(hash, original, sessionId, true)));
    if (state && ctx) {
      if (isMainSession(ctx))
        state.ccrHashes += entries.length;
      else
        shared.foreignCcr += entries.length;
    }
    return entries.length;
  } catch {
    return 0;
  }
}
async function persistCcrByHash(hash, originalText, state, ctx) {
  if (!hash || typeof originalText !== "string" || !originalText)
    return 0;
  try {
    const sessionId = storageSessionId(state, ctx);
    const slug = typeof hash === "string" && ccrFallbackPath(hash) ? hash : "";
    if (!sessionId || !slug)
      return 0;
    if (!await writeSessionOriginal(slug, originalText, sessionId, false))
      return 0;
    if (state && ctx) {
      if (isMainSession(ctx))
        state.ccrHashes += 1;
      else
        shared.foreignCcr += 1;
    }
    return 1;
  } catch {
    return 0;
  }
}
async function clearCcrSession(sessionId, dir = CCR_DIR) {
  const sessionDir = ccrSessionDir(sessionId, dir);
  if (!sessionDir)
    return { cleared: false, deletedFiles: 0, retainedEntries: 0 };
  let entries;
  try {
    entries = await readdir(sessionDir, { withFileTypes: true });
  } catch (error) {
    const absent = error?.code === "ENOENT";
    return { cleared: absent, deletedFiles: 0, retainedEntries: 0 };
  }
  let deletedFiles = 0;
  let retainedEntries = 0;
  for (const entry of entries) {
    if (!entry.isFile() && !entry.isSymbolicLink()) {
      retainedEntries += 1;
      continue;
    }
    try {
      await unlink2(join4(sessionDir, entry.name));
      deletedFiles += 1;
    } catch {
      retainedEntries += 1;
    }
  }
  if (retainedEntries === 0) {
    try {
      await rmdir(sessionDir);
    } catch (error) {
      if (error?.code !== "ENOENT")
        retainedEntries += 1;
    }
  }
  return { cleared: retainedEntries === 0, deletedFiles, retainedEntries };
}

// src/commands.ts
var SUBCOMMANDS = [
  { label: "stats", description: "Show compression stats (proxy, archive, CCR)" },
  { label: "on", description: "Enable Headroom for this session" },
  { label: "off", description: "Disable Headroom for this session" },
  { label: "compact", description: "Run OMP semantic compaction with a Headroom CCR archive" },
  { label: "clear", description: "Clear current-session CCR archives and archive counters" },
  {
    label: "test",
    description: "Run a real proxy compression test or open a native OMP compaction fixture"
  },
  { label: "service", description: "Install, remove, or inspect the Headroom user service" },
  { label: "help", description: "List all subcommands with descriptions" },
  { label: "version", description: "Show versions, paths, and running status" },
  { label: "config", description: "Show the effective configuration and its source path" },
  { label: "set", description: "Persist one configuration key to headroom.yml" },
  { label: "debug", description: "Show debug info (logs, sizing)" },
  { label: "start", description: "Start the Headroom proxy" },
  { label: "stop", description: "Stop the Headroom proxy" },
  { label: "restart", description: "Restart the Headroom proxy" },
  {
    label: "reconnect",
    description: "Retry proxy connect with backoff after the auto loop gave up"
  },
  { label: "update", description: "Check for and install Headroom updates" }
];
var TEST_SURFACE_DESCRIPTIONS = {
  tool: "Run the real Headroom proxy compression path, then open its native Headroom Compress result",
  compaction: "Open a native OMP compaction fixture in an isolated session"
};
function completeHeadroomCommand(prefix, testSurfaces) {
  const normalized = String(prefix || "").trim().toLowerCase();
  if (normalized.startsWith("clear")) {
    const options = [
      {
        value: "clear session",
        label: "session",
        description: "Preview current-session Headroom data deletion"
      },
      {
        value: "clear session confirm",
        label: "session confirm",
        description: "Confirm current-session Headroom data deletion"
      }
    ];
    const suffix = normalized.slice("clear".length).trim();
    const matches2 = suffix ? options.filter((option) => option.label.startsWith(suffix)) : options;
    return matches2.length ? matches2 : null;
  }
  if (normalized === "set" || normalized.startsWith("set ")) {
    const rest = String(prefix || "").toLowerCase().replace(/^\s*set\s+/, "");
    const [keyPrefix, ...valueParts] = rest.split(/\s+/);
    const setting = HEADROOM_SETTINGS.find((entry) => entry.key === keyPrefix);
    if (setting && (valueParts.length > 0 || rest.endsWith(" "))) {
      if (setting.kind !== "boolean")
        return null;
      const valuePrefix = valueParts.join(" ");
      const options = ["on", "off"].filter((option) => option.startsWith(valuePrefix)).map((option) => ({
        value: `set ${setting.key} ${option}`,
        label: option,
        description: setting.description
      }));
      return options.length ? options : null;
    }
    const keys = HEADROOM_SETTINGS.filter((entry) => entry.key.startsWith(keyPrefix ?? "")).map((entry) => ({
      value: `set ${entry.key} `,
      label: entry.key,
      description: settingCompletionDescription(entry)
    }));
    return keys.length ? keys : null;
  }
  if (normalized.startsWith("test ")) {
    const surfacePrefix = normalized.slice("test ".length);
    const fixtures = testSurfaces.filter((surface) => surface.startsWith(surfacePrefix)).map((surface) => ({
      value: `test ${surface}`,
      label: surface,
      description: TEST_SURFACE_DESCRIPTIONS[surface] ?? "Run the Headroom test fixture"
    }));
    return fixtures.length ? fixtures : null;
  }
  const matches = normalized ? SUBCOMMANDS.filter((command) => command.label.startsWith(normalized)) : SUBCOMMANDS;
  return matches.length ? matches.map((command) => ({ ...command, value: command.label })) : null;
}
function commandHelpLines() {
  return SUBCOMMANDS.map((command) => `  /headroom ${command.label} — ${command.description}`);
}
function settingCompletionDescription(setting) {
  const def = typeof setting.def === "boolean" ? setting.def ? "on" : "off" : String(setting.def);
  return `${setting.description} (${setting.kind}, default ${def})`;
}

// src/messages.ts
function messageChars(messages) {
  if (!Array.isArray(messages))
    return 0;
  try {
    return stableJson(messages).length;
  } catch {
    return 0;
  }
}

// src/provider.ts
var RETRIEVE_DESCRIPTION = "Retrieve original uncompressed content that Headroom compressed to save tokens. Use this when a compression marker/hash indicates more details are available.";
function responseOutputText(item) {
  if (!isRecord(item))
    return;
  if ((item.type === "function_call_output" || item.type === "custom_tool_call_output") && typeof item.output === "string") {
    return item.output;
  }
  return;
}
function systemToText(system) {
  if (typeof system === "string")
    return system;
  if (!Array.isArray(system))
    return;
  const parts = [];
  for (const item of system) {
    if (typeof item === "string") {
      parts.push(item);
      continue;
    }
    if (isRecord(item) && typeof item.text === "string") {
      parts.push(item.text);
      continue;
    }
    parts.push(JSON.stringify(item));
  }
  return parts.join(`
`);
}
function inferProviderFormat(payload) {
  if (!isRecord(payload))
    return "openai";
  if (payload.system !== undefined)
    return "anthropic";
  if (Array.isArray(payload.input))
    return "responses";
  const tools = Array.isArray(payload.tools) ? payload.tools : [];
  for (const tool of tools) {
    if (isRecord(tool) && "input_schema" in tool)
      return "anthropic";
  }
  return "openai";
}
function effectiveProviderFormat(payload, ctx) {
  const inferred = inferProviderFormat(payload);
  if (inferred !== "openai")
    return inferred;
  const provider = ctx?.model?.provider;
  if (provider === "anthropic")
    return "anthropic";
  return inferred;
}
function isRetrieveToolName(name) {
  return name === RETRIEVE_TOOL || name === `_${RETRIEVE_TOOL}`;
}
function hasRetrieveTool(tools) {
  if (!Array.isArray(tools))
    return false;
  return tools.some((tool) => {
    if (!isRecord(tool))
      return false;
    if (isRetrieveToolName(tool.name))
      return true;
    if (isRecord(tool.function) && isRetrieveToolName(tool.function.name))
      return true;
    return false;
  });
}
function payloadHasRetrieveTool(payload) {
  if (!isRecord(payload))
    return false;
  if (hasRetrieveTool(payload.tools))
    return true;
  if (!Array.isArray(payload.input))
    return false;
  return payload.input.some((item) => isRecord(item) && item.type === "additional_tools" && hasRetrieveTool(item.tools));
}
function textHasCompressedMarker(text) {
  return typeof text === "string" && (text.includes(COMPRESSED_MARKER) || text.includes(RETRIEVED_MARKER));
}
function collectProviderTextCandidates(value, out) {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value)
      collectProviderTextCandidates(item, out);
    return;
  }
  if (!isRecord(value))
    return;
  if (typeof value.text === "string")
    out.push(value.text);
  if (typeof value.content === "string")
    out.push(value.content);
  else if (Array.isArray(value.content))
    collectProviderTextCandidates(value.content, out);
  if (typeof value.output === "string")
    out.push(value.output);
}
function isProviderCompressionCandidate(text, minChars = PROVIDER_MIN_TEXT_CHARS) {
  return typeof text === "string" && !textHasCompressedMarker(text) && text.trim().length >= minChars;
}
function providerPayloadHasCompressionCandidate(payload, minChars = PROVIDER_MIN_TEXT_CHARS) {
  if (!isRecord(payload))
    return false;
  const topLevelTexts = [];
  collectProviderTextCandidates(payload.system, topLevelTexts);
  if (topLevelTexts.some((text) => isProviderCompressionCandidate(text, minChars)))
    return true;
  const items = Array.isArray(payload.messages) ? payload.messages : Array.isArray(payload.input) ? payload.input : [];
  for (const item of items) {
    if (!isRecord(item))
      continue;
    const texts = [];
    collectProviderTextCandidates(item.content, texts);
    const output = responseOutputText(item);
    if (typeof output === "string")
      texts.push(output);
    if (texts.some((text) => isProviderCompressionCandidate(text, minChars)))
      return true;
  }
  return false;
}

// src/compression.ts
function payloadCharTotal(payload) {
  if (!isRecord(payload))
    return 0;
  let total = 0;
  const items = Array.isArray(payload.messages) ? payload.messages : Array.isArray(payload.input) ? payload.input : [];
  for (const item of items) {
    if (!isRecord(item)) {
      total += String(item).length;
      continue;
    }
    const texts = [];
    collectProviderTextCandidates(item.content, texts);
    if (typeof item.output === "string")
      texts.push(item.output);
    total += texts.reduce((sum, text) => sum + text.length, 0);
  }
  if (typeof payload.system === "string")
    total += payload.system.length;
  else if (Array.isArray(payload.system)) {
    const texts = [];
    collectProviderTextCandidates(payload.system, texts);
    total += texts.reduce((sum, text) => sum + text.length, 0);
  }
  return total;
}
function adaptiveMinChars(base, usageRatio, { enabled = ADAPTIVE_THRESHOLDS } = {}) {
  const value = Math.max(0, asNumber(base));
  if (!enabled)
    return value;
  const start = Number.isFinite(ADAPTIVE_START_RATIO) ? Math.min(0.95, Math.max(0, ADAPTIVE_START_RATIO)) : 0.5;
  const full = Math.min(1, Math.max(start + 0.01, Number.isFinite(ADAPTIVE_FULL_RATIO) ? ADAPTIVE_FULL_RATIO : 0.9));
  const floorRatio = Number.isFinite(ADAPTIVE_FLOOR_RATIO) ? Math.min(1, Math.max(0.05, ADAPTIVE_FLOOR_RATIO)) : 0.25;
  const ratio = Math.min(1, Math.max(0, asNumber(usageRatio)));
  if (ratio <= start)
    return value;
  const progress = Math.min(1, (ratio - start) / (full - start));
  const floor = value * floorRatio;
  return Math.round(value - progress * (value - floor));
}
function normalizeCompressionResult(data, fallbackMessages) {
  const source = isRecord(data) ? data : {};
  const before = asNumber(source.tokens_before ?? source.tokensBefore);
  const after = asNumber(source.tokens_after ?? source.tokensAfter);
  const tokenReduced = Number.isInteger(before) && Number.isInteger(after) && before > 0 && after >= 0 && after < before;
  const saved = tokenReduced ? before - after : 0;
  const ccrHashes = source.ccr_hashes ?? source.ccrHashes;
  const returnedMessages = Array.isArray(source.messages) ? source.messages : undefined;
  const aligned = returnedMessages !== undefined && returnedMessages.length === fallbackMessages.length;
  const usersPreserved = aligned && fallbackMessages.every((original, index) => !isRecord(original) || original.role !== "user" || stableJson(original) === stableJson(returnedMessages[index]));
  const candidateMessages = aligned && usersPreserved ? returnedMessages : undefined;
  const inputChars = messageChars(fallbackMessages);
  const charsDelta = candidateMessages ? inputChars - messageChars(candidateMessages) : 0;
  const charsSaved = Math.max(0, charsDelta);
  const accepted = tokenReduced && charsDelta > 0 && candidateMessages !== undefined;
  const messages = accepted ? candidateMessages : fallbackMessages;
  const transformsCandidate = source.transforms_applied ?? source.transformsApplied;
  const transformsApplied = Array.isArray(transformsCandidate) ? transformsCandidate : [];
  return {
    messages,
    tokensBefore: before,
    tokensAfter: after,
    tokensSaved: saved,
    charsSaved,
    compressionRatio: before > 0 ? after / before : 1,
    transformsApplied,
    transformsSummary: source.transforms_summary ?? source.transformsSummary,
    ccrHashes: Array.isArray(ccrHashes) ? ccrHashes : [],
    compressed: accepted
  };
}
function isBeneficialCompressionResult(result) {
  return Boolean(result?.compressed && result.tokensBefore > 0 && result.tokensAfter >= 0 && result.tokensAfter < result.tokensBefore && result.tokensSaved === result.tokensBefore - result.tokensAfter && result.charsSaved > 0);
}

// src/proxy.ts
function proxyPort(proxyUrl = PROXY_URL) {
  try {
    return Number(new URL(proxyUrl).port || 8787);
  } catch {
    return 8787;
  }
}
function proxyPath(path, proxyUrl = PROXY_URL) {
  return `${proxyUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
function modelUsesHeadroomProxy(model, proxyUrl = PROXY_URL) {
  if (typeof model?.baseUrl !== "string")
    return false;
  try {
    const target = new URL(model.baseUrl);
    const proxy = new URL(proxyUrl);
    const loopback = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
    const sameEndpoint = target.port === proxy.port && (target.origin === proxy.origin || loopback.has(target.hostname) && loopback.has(proxy.hostname));
    return sameEndpoint && /\/(?:p\/[^/]+\/)?anthropic\/?$/.test(target.pathname);
  } catch {
    return false;
  }
}
async function isProxyReady(proxyUrl = PROXY_URL) {
  try {
    const response = await fetch(proxyPath("/livez", proxyUrl), {
      method: "GET",
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}
async function getLivez(proxyUrl = PROXY_URL) {
  try {
    const response = await fetch(proxyPath("/livez", proxyUrl), {
      method: "GET",
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok)
      return null;
    const body = await response.json();
    const loopHealth = body?.loop_health ?? {};
    return {
      alive: body?.alive === true,
      status: String(body?.status ?? loopHealth.status ?? "unknown"),
      knownFailures: Number(loopHealth.known_failures ?? 0),
      uptimeSeconds: typeof body?.uptime_seconds === "number" ? body.uptime_seconds : undefined
    };
  } catch {
    return null;
  }
}

// src/python-env.ts
function venvInvocation(options) {
  if (options.useUv) {
    return { command: options.uv, args: ["venv", options.venvDir] };
  }
  return { command: options.python, args: ["-m", "venv", options.venvDir] };
}
function pipInstallInvocation(options) {
  if (options.useUv) {
    return {
      command: options.uv,
      args: ["pip", "install", "-p", options.venvPython, "--no-progress", ...options.packages]
    };
  }
  return {
    command: options.venvPython,
    args: [
      "-m",
      "pip",
      "install",
      "--disable-pip-version-check",
      "--progress-bar",
      "off",
      ...options.packages
    ]
  };
}

// src/service.ts
import { readFileSync as readFileSync3 } from "node:fs";
var SERVICE_ACTIONS = new Set(["install", "uninstall", "status"]);
function parseServiceAction(value) {
  if (typeof value !== "string")
    return;
  const action = value.trim().toLowerCase();
  return SERVICE_ACTIONS.has(action) ? action : undefined;
}
function quoteSystemdExecArgument(value) {
  if (!value)
    throw new Error("Headroom executable path is required");
  if (/[\0\r\n]/.test(value)) {
    throw new Error("Headroom executable path must not contain control characters");
  }
  const escaped = value.replaceAll("%", "%%").replaceAll("\\", "\\\\").replaceAll('"', "\\\"");
  return /[\s"\\]/.test(escaped) ? `"${escaped}"` : escaped;
}
function validPort(value) {
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Invalid Headroom service port: ${value}`);
  }
  return value;
}
function renderHeadroomUserService(headroomBin, port) {
  const executable = quoteSystemdExecArgument(headroomBin);
  const servicePort = validPort(port);
  const template = readFileSync3(SYSTEMD_TEMPLATE_PATH, "utf8");
  if (!template.includes("@HEADROOM_BIN@") || !template.includes("@PORT@")) {
    throw new Error(`Invalid Headroom service template: ${SYSTEMD_TEMPLATE_PATH}`);
  }
  return template.replaceAll("@HEADROOM_BIN@", executable).replaceAll("@PORT@", String(servicePort));
}

// src/session-archive.ts
import { createHash } from "node:crypto";
var SESSION_ARCHIVE_MARKER = "[Headroom session archive]";
function passThrough(messages, reason, details = {}) {
  return { compacted: false, reason, messages, ...details };
}
function messageApproxChars(message) {
  if (!isRecord(message))
    return String(message ?? "").length;
  const texts = [];
  collectProviderTextCandidates(message, texts);
  return Math.max(texts.reduce((sum, text) => sum + text.length, 0), stableJson(message).length);
}
function messageHasSessionArchive(message) {
  const texts = [];
  collectProviderTextCandidates(message, texts);
  return texts.some((text) => text.includes(SESSION_ARCHIVE_MARKER));
}
function messageToolCallIds(message) {
  if (!isRecord(message))
    return [];
  const ids = [];
  if (Array.isArray(message.tool_calls)) {
    for (const call of message.tool_calls) {
      if (isRecord(call) && typeof call.id === "string")
        ids.push(call.id);
    }
  }
  if (Array.isArray(message.content)) {
    for (const block of message.content) {
      if (isRecord(block) && block.type === "tool_use" && typeof block.id === "string") {
        ids.push(block.id);
      }
    }
  }
  if ((message.type === "function_call" || message.type === "custom_tool_call") && typeof message.call_id === "string") {
    ids.push(message.call_id);
  }
  return ids;
}
function messageToolResultIds(message) {
  if (!isRecord(message))
    return [];
  const ids = [];
  if (message.role === "tool" && typeof message.tool_call_id === "string") {
    ids.push(message.tool_call_id);
  }
  if (Array.isArray(message.content)) {
    for (const block of message.content) {
      if (isRecord(block) && block.type === "tool_result" && typeof block.tool_use_id === "string") {
        ids.push(block.tool_use_id);
      }
    }
  }
  if ((message.type === "function_call_output" || message.type === "custom_tool_call_output") && typeof message.call_id === "string") {
    ids.push(message.call_id);
  }
  return ids;
}
function safeSessionCut(messages, requestedCut) {
  let cut = Math.max(0, Math.min(messages.length, requestedCut));
  let changed = true;
  while (changed && cut > 0) {
    changed = false;
    const liveToolResults = new Set;
    for (let index = cut;index < messages.length; index++) {
      for (const id of messageToolResultIds(messages[index]))
        liveToolResults.add(id);
    }
    if (liveToolResults.size === 0)
      break;
    for (let index = cut - 1;index >= 0; index--) {
      if (messageToolCallIds(messages[index]).some((id) => liveToolResults.has(id))) {
        cut = index;
        changed = true;
        break;
      }
    }
  }
  return cut;
}
function archiveLineForMessage(message, index, maxChars) {
  if (!isRecord(message))
    return `- ${index}: ${String(message)}`;
  const role = String(message.role || message.type || "unknown");
  const ids = [
    ...messageToolCallIds(message).map((id) => `tool_call=${id}`),
    ...messageToolResultIds(message).map((id) => `tool_result=${id}`)
  ];
  const texts = [];
  collectProviderTextCandidates(message, texts);
  const text = truncateMiddle(texts.join(`

`).trim(), maxChars);
  const suffix = ids.length ? ` (${ids.join(", ")})` : "";
  return `- ${index}: ${role}${suffix}${text ? ` — ${text}` : ""}`;
}
function buildSessionArchiveText(prefixMessages, hash, options) {
  const maxChars = Math.max(120, Number(options.archiveMaxMessageChars ?? SESSION_ARCHIVE_MAX_MESSAGE_CHARS));
  const lines = [
    SESSION_ARCHIVE_MARKER,
    `Earlier stable conversation prefix compacted: ${prefixMessages.length} messages.`,
    `Full original prefix: Retrieve more: hash=${hash}`,
    "Recent live messages after this archive are verbatim and authoritative.",
    "Archive index:"
  ];
  prefixMessages.forEach((message, index) => {
    lines.push(archiveLineForMessage(message, index, maxChars));
  });
  return lines.join(`
`);
}
function createSessionCompaction(messages, options = {}) {
  if (options.enabled === false || !SESSION_ARCHIVE_ENABLED) {
    return passThrough(messages, "disabled");
  }
  if (!Array.isArray(messages) || messages.length < 4) {
    return passThrough(messages, "too_few_messages");
  }
  let headCount = 0;
  while (headCount < messages.length) {
    const message = messages[headCount];
    if (!isRecord(message) || !["system", "developer"].includes(String(message.role || "")))
      break;
    headCount += 1;
  }
  const head = messages.slice(0, headCount);
  const body = messages.slice(headCount);
  const liveMessages = Math.max(1, Number(options.liveMessages ?? SESSION_LIVE_MESSAGES));
  const cut = safeSessionCut(body, Math.max(0, body.length - liveMessages));
  if (cut <= 0)
    return passThrough(messages, "no_safe_prefix");
  for (let index = cut;index < body.length; index++) {
    if (messageHasSessionArchive(body[index]))
      return passThrough(messages, "existing_archive");
  }
  const prefix = body.slice(0, cut);
  const live = body.slice(cut);
  const prefixChars = prefix.reduce((sum, message) => sum + messageApproxChars(message), 0);
  const totalChars = body.reduce((sum, message) => sum + messageApproxChars(message), 0);
  const minPrefixChars = Math.max(0, Number(options.minPrefixChars ?? SESSION_PREFIX_MIN_CHARS));
  const minPrefixShare = Math.max(0, Number(options.minPrefixShare ?? SESSION_PREFIX_MIN_SHARE));
  const prefixShare = totalChars > 0 ? prefixChars / totalChars : 0;
  const details = {
    prefixChars,
    totalChars,
    prefixShare,
    prefixCount: prefix.length,
    liveCount: live.length
  };
  if (prefixChars < minPrefixChars)
    return passThrough(messages, "prefix_too_small", details);
  if (prefixShare < minPrefixShare)
    return passThrough(messages, "share_too_small", details);
  const hash = createHash("sha256").update(stableJson(prefix)).digest("hex").slice(0, 24);
  const originalText = JSON.stringify(prefix, null, 2);
  const archiveText = buildSessionArchiveText(prefix, hash, options);
  const projected = [...head, { role: "user", content: archiveText }, ...live];
  if (JSON.stringify(projected).length >= JSON.stringify(messages).length) {
    return passThrough(messages, "not_beneficial", details);
  }
  return {
    compacted: true,
    reason: "compacted",
    messages: projected,
    hash,
    originalText,
    ...details,
    archiveChars: archiveText.length
  };
}
function asResponsesArchiveItem(message) {
  if (!isRecord(message) || typeof message.content !== "string")
    return message;
  return {
    type: "message",
    role: "user",
    content: [{ type: "input_text", text: message.content }]
  };
}
function createResponsesSessionCompaction(input, options = {}) {
  const candidate = createSessionCompaction(input, options);
  if (!candidate.compacted)
    return { ...candidate, input };
  return {
    ...candidate,
    input: candidate.messages.map((message) => messageHasSessionArchive(message) ? asResponsesArchiveItem(message) : message)
  };
}
function asAnthropicArchiveMessage(message) {
  if (!messageHasSessionArchive(message) || !isRecord(message) || typeof message.content !== "string") {
    return message;
  }
  return { ...message, content: [{ type: "text", text: message.content }] };
}
function expandSessionArchiveText(originalText, readHash) {
  try {
    const messages = JSON.parse(originalText);
    if (!Array.isArray(messages))
      return originalText;
    const parts = [];
    const seen = new Set;
    for (const message of messages) {
      if (!messageHasSessionArchive(message))
        continue;
      const texts = [];
      collectProviderTextCandidates(message, texts);
      for (const text of texts) {
        const hash = text.match(/Full original prefix: Retrieve more: hash=([0-9a-f]{8,})/)?.[1];
        if (!hash || seen.has(hash))
          continue;
        seen.add(hash);
        const ancestor = readHash(hash);
        if (ancestor) {
          parts.push(`--- chained session archive hash=${hash} (full original) ---
${ancestor}`);
        }
      }
    }
    return parts.length ? `${originalText}

${parts.join(`

`)}` : originalText;
  } catch {
    return originalText;
  }
}

// src/tools.ts
async function retrieveViaProxy(proxyUrl, hash, query, signal, timeoutMs) {
  try {
    const response = await fetch(new URL("/v1/retrieve", proxyUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Client": "omp" },
      body: JSON.stringify(query ? { hash, query } : { hash }),
      signal: signal ?? AbortSignal.timeout(timeoutMs)
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    if (!response.ok)
      return {
        error: isRecord(data) && typeof data.error === "string" ? data.error : `HTTP ${response.status}`,
        hash
      };
    return data;
  } catch (error) {
    return { error: String(error), hash };
  }
}
function stringifyRetrieveResult(data, hash, fallback = false) {
  let body;
  if (!isRecord(data))
    body = String(data);
  else if (typeof data.original_content === "string")
    body = data.original_content;
  else if (Array.isArray(data.results))
    body = JSON.stringify(data.results, null, 2);
  else
    body = JSON.stringify(data, null, 2);
  const note = fallback ? "; local fallback (full original)" : "";
  return `${RETRIEVED_MARKER}hash=${hash || "?"}${note}; original content — do not re-compress]
${body}`;
}

// src/widget.ts
function proxyLifetimeUsd(state) {
  const stats = state.stats;
  return asNumber(stats?.persistent_savings?.lifetime?.compression_savings_usd ?? stats?.cost?.savingsUsd ?? stats?.summary?.cost?.totalSavedUsd ?? stats?.summary?.cost?.total_saved_usd ?? 0);
}
function sessionProxyStats(state) {
  if (!state.sessionId)
    return;
  return state.stats?.savings?.per_project?.[state.sessionId];
}
function compactStatsLine(state) {
  const seg = (label, main, foreign) => {
    const m = Math.max(0, asNumber(main));
    const f = Math.max(0, asNumber(foreign));
    return `${label} ${formatInt(m)}${f > 0 ? ` (+${formatInt(f)})` : ""}`;
  };
  const ps = sessionProxyStats(state);
  const reqCount = ps && asNumber(ps.requests) > 0 ? asNumber(ps.requests) : state.providerCompressions;
  let foreignReq = shared.foreignProvider;
  const pp = state.stats?.savings?.per_project;
  if (pp && subagentSessionIds.size > 0) {
    let sum = 0;
    for (const sid of subagentSessionIds)
      sum += Math.max(0, asNumber(pp[sid]?.requests));
    if (sum > 0)
      foreignReq = sum;
  }
  const lines = [
    seg("req", reqCount, foreignReq),
    seg("tool", state.toolCompressions, shared.foreignTool),
    seg("ccr", state.ccrHashes, shared.foreignCcr)
  ];
  if (state.ompCompactions > 0)
    lines.push(`com ${formatInt(state.ompCompactions)}`);
  return lines.join(" · ");
}
function cacheUsageLine(state) {
  const input = Math.max(0, asNumber(state.cacheInputTokens));
  const read = Math.max(0, asNumber(state.cacheReadTokens));
  const write = Math.max(0, asNumber(state.cacheWriteTokens));
  const total = input + read + write;
  const hitRate = total > 0 ? read / total * 100 : 0;
  return `cache ${formatPct(hitRate)} · read ${formatCompactTokens(read)} · write ${formatCompactTokens(write)}`;
}
function archiveSavingsPercent(state) {
  const before = Math.max(0, asNumber(state?.sessionArchiveCharsBefore));
  const saved = Math.max(0, asNumber(state?.sessionArchiveCharsSaved));
  return before > 0 ? Math.min(100, saved / before * 100) : 0;
}
function localCompressionLine(state) {
  const ps = sessionProxyStats(state);
  const hasArchive = state.sessionArchiveCharsSaved > 0;
  const archiveSuffix = hasArchive ? ` · arch ${formatCompactTokens(state.sessionArchiveCharsSaved)}ch ×${formatInt(state.sessionArchiveCompactions)}` : "";
  if (ps && asNumber(ps.tokens_saved) > 0) {
    const saved2 = asNumber(ps.tokens_saved);
    const pct2 = asNumber(ps.savings_percent ?? ps.compression_pct);
    const pctLabel = hasArchive ? "proxy " : "";
    return `saved ${formatCompactTokens(saved2)} · ${pctLabel}${formatPct(pct2)}${archiveSuffix}`;
  }
  const saved = Math.max(0, asNumber(state.tokensSaved));
  const pct = state.tokensBefore > 0 ? state.tokensSaved / state.tokensBefore * 100 : 0;
  return `saved ${formatCompactTokens(saved)} · ${formatPct(pct)}${archiveSuffix}`;
}
function buildWidgetLines(state) {
  const ready = state.enabled && state.proxyReady;
  const titleStyled = ready ? link(DASHBOARD_URL, rainbow("Headroom", state.rainbowPhase)) : color(90, "Headroom");
  let problem = "";
  if (!state.enabled)
    problem = "off";
  else if (state.installState)
    problem = `${state.installState}…`;
  else if (state.connectExhausted)
    problem = "reconnect: /headroom reconnect";
  else if (state.proxyStarting) {
    const total = CONNECT_BACKOFF_MS.length;
    problem = state.connectAttempt ? `connecting ${state.connectAttempt}/${total}…` : "starting…";
  } else if (!state.proxyReady)
    problem = clip(state.lastError || "offline", 28);
  const topLeftRaw = `─ Headroom ${problem ? `· ${problem} ` : ""}`;
  const topLeftStyled = `─ ${titleStyled} ${problem ? `${color(state.enabled ? 33 : 90, `· ${problem}`)} ` : ""}`;
  const sid = String(state.sessionId || "").slice(0, 8);
  let topRightRaw = sid ? ` ${sid} ─` : "";
  let topRightStyled = sid ? ` ${color(90, sid)} ─` : "";
  const ps = sessionProxyStats(state);
  const sessionUsd = asNumber(ps?.compression_savings_usd);
  const lifeUsd = proxyLifetimeUsd(state);
  const ctxUsd = asNumber(ps?.total_input_cost_usd);
  const botLeftRaw = `─ ${formatUsd(sessionUsd)} · ${formatUsd(lifeUsd)} `;
  const botLeftStyled = `─ ${color(32, formatUsd(sessionUsd))}${color(90, ` · ${formatUsd(lifeUsd)}`)} `;
  let botRightRaw = ctxUsd > 0 ? ` ctx ${formatUsd(ctxUsd)} ─` : "";
  let botRightStyled = ctxUsd > 0 ? ` ${color(90, `ctx ${formatUsd(ctxUsd)}`)} ─` : "";
  const ctxLine = ` ${localCompressionLine(state)}`;
  const activityLine = ` ${compactStatsLine(state)}`;
  const cacheLine = ` ${cacheUsageLine(state)}`;
  const updateLine = state.installState ? ` headroom ${state.installState}…` : isNewer(state.latest, state.version) ? ` v${state.version} → v${state.latest}` : "";
  const inner = computeInner(Math.max(topLeftRaw.length + topRightRaw.length + 1, botLeftRaw.length + botRightRaw.length + 1, ctxLine.length, activityLine.length, cacheLine.length, updateLine.length) + 1);
  if (topLeftRaw.length + topRightRaw.length + 1 > inner) {
    topRightRaw = "";
    topRightStyled = "";
  }
  if (botLeftRaw.length + botRightRaw.length + 1 > inner) {
    botRightRaw = "";
    botRightStyled = "";
  }
  const rows = [row(ctxLine, inner), row(cacheLine, inner), row(activityLine, inner)];
  if (updateLine)
    rows.push(row(updateLine, inner));
  return [
    borderLine(inner, "╭", "╮", topLeftRaw, topLeftStyled, topRightRaw, topRightStyled),
    ...rows,
    borderLine(inner, "╰", "╯", botLeftRaw, botLeftStyled, botRightRaw, botRightStyled)
  ];
}
function renderWidget(ctx, state, host = "omp") {
  try {
    if (!ctx?.hasUI)
      return;
    if (host === "pi") {
      const ps = sessionProxyStats(state);
      const saved = asNumber(ps?.tokens_saved);
      const req = ps && asNumber(ps.requests) > 0 ? asNumber(ps.requests) : state.providerCompressions;
      const status = state.proxyReady ? `Headroom ready · saved ${formatInt(saved)} · req ${formatInt(req)}` : state.enabled ? `Headroom ${state.proxyStarting ? "starting…" : state.connectExhausted ? "reconnect: /headroom reconnect" : state.installState ? `${state.installState}…` : "offline"}` : "Headroom off";
      ctx.ui?.setStatus?.(EXTENSION_KEY, status);
      return;
    }
    const lines = buildWidgetLines(state);
    ctx.ui?.setWidget?.(EXTENSION_KEY, lines, {
      placement: WIDGET_PLACEMENT,
      priority: WIDGET_PRIORITY
    });
    ctx.ui?.setStatus?.(EXTENSION_KEY, undefined);
  } catch {}
}
function commandSummary(state) {
  const stats = state.stats;
  const comp = stats?.summary?.compression;
  const summaryCost = stats?.summary?.cost;
  const ps = sessionProxyStats(state);
  const saved = ps && asNumber(ps.tokens_saved) > 0 ? asNumber(ps.tokens_saved) : Math.max(0, asNumber(state.tokensSaved));
  const pct = ps && asNumber(ps.savings_percent ?? ps.compression_pct) > 0 ? asNumber(ps.savings_percent ?? ps.compression_pct) : state.tokensBefore > 0 ? state.tokensSaved / state.tokensBefore * 100 : 0;
  const archivePct = archiveSavingsPercent(state);
  const lifeSaved = asNumber(stats?.tokens?.saved ?? comp?.totalTokensRemoved ?? comp?.total_tokens_removed ?? comp?.total_tokens_saved_with_cli_filtering ?? 0);
  const lifeCost = stats?.cost?.savingsUsd ?? summaryCost?.totalSavedUsd ?? summaryCost?.total_saved_usd;
  const lines = [
    `Headroom: ${state.enabled ? "enabled" : "disabled"}`,
    `Proxy: ${state.proxyReady ? "ready" : state.proxyStarting ? "starting" : "offline"} (${PROXY_URL})`,
    `Version: ${state.version || "unknown"}${isNewer(state.latest, state.version) ? ` (latest ${state.latest} available)` : ""}`,
    `Session (proxy): saved ${formatInt(saved)}${pct ? ` (${formatPct(pct)})` : ""} · req ${formatInt(ps && asNumber(ps.requests) > 0 ? asNumber(ps.requests) : state.providerCompressions)}`,
    `This process: provider=${formatInt(state.providerCompressions)}, tool=${formatInt(state.toolCompressions)}, ccr=${formatInt(state.ccrHashes)}, archive=${formatInt(state.sessionArchiveCompactions)} (${formatInt(state.sessionArchiveCharsSaved)}ch saved${archivePct ? `, ${formatPct(archivePct)}` : ""})`,
    `Headroom archive: compactions=${formatInt(state.sessionArchiveCompactions)} · source=${formatInt(state.sessionArchiveCharsBefore)}ch · saved=${formatInt(state.sessionArchiveCharsSaved)}ch${archivePct ? ` (${formatPct(archivePct)})` : ""}`,
    `Proxy lifetime (all sessions): ${formatInt(lifeSaved)} tok${asNumber(lifeCost) > 0 ? ` · ${formatUsd(lifeCost)}` : ""}`
  ];
  const mcp = stats?.summary?.mcp;
  if (mcp) {
    lines.push(`Headroom MCP: compressions=${formatInt(mcp.compressions)}, retrievals=${formatInt(mcp.retrievals)}, removed=${formatInt(mcp.tokensRemoved)} tok`);
  }
  if (state.lastError)
    lines.push(`Last error: ${state.lastError}`);
  return lines.join(`
`);
}

// src/index.ts
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function uvBin() {
  if (process.env.OMP_HEADROOM_UV)
    return process.env.OMP_HEADROOM_UV;
  const local = join5(homedir2(), ".local", "bin", "uv");
  return existsSync3(local) ? local : "uv";
}
var PYTHON_BIN = process.env.OMP_HEADROOM_PYTHON ?? "python3";
var uvAvailable;
function run(command, args, timeoutMs) {
  return new Promise((resolve) => {
    let out = "";
    let err = "";
    let child;
    try {
      child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      resolve({ code: -1, out, err: errorMessage(error) });
      return;
    }
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
    timer.unref?.();
    child.stdout?.on("data", (chunk) => out += String(chunk));
    child.stderr?.on("data", (chunk) => err += String(chunk));
    child.once("error", (error) => {
      clearTimeout(timer);
      resolve({ code: -1, out, err: errorMessage(error) });
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, out, err });
    });
  });
}
async function canUseUv() {
  if (uvAvailable === undefined) {
    uvAvailable = (await run(uvBin(), ["--version"], 1e4)).code === 0;
  }
  return uvAvailable;
}
async function createHeadroomVenv() {
  const invocation = venvInvocation({
    useUv: await canUseUv(),
    uv: uvBin(),
    python: PYTHON_BIN,
    venvDir: VENV_DIR
  });
  return run(invocation.command, invocation.args, 120000);
}
async function installPythonPackages(packages, timeoutMs) {
  const invocation = pipInstallInvocation({
    useUv: await canUseUv(),
    uv: uvBin(),
    venvPython: VENV_PYTHON,
    packages
  });
  return run(invocation.command, invocation.args, timeoutMs);
}
var SYSTEMD_UNIT = process.env.OMP_HEADROOM_SYSTEMD_UNIT ?? "headroom-proxy.service";
var USER_SYSTEMD_DIR = join5(homedir2(), ".config", "systemd", "user");
var USER_SYSTEMD_UNIT_PATH = join5(USER_SYSTEMD_DIR, SYSTEMD_UNIT);
var systemdUnitKnown;
async function systemdUnitAvailable() {
  if (!SYSTEMD_UNIT)
    return false;
  if (systemdUnitKnown === undefined) {
    const result = await run("systemctl", ["--user", "cat", SYSTEMD_UNIT], 5000);
    systemdUnitKnown = result.code === 0;
  }
  return systemdUnitKnown;
}
async function systemdUnitActive() {
  if (!SYSTEMD_UNIT)
    return false;
  const result = await run("systemctl", ["--user", "is-active", SYSTEMD_UNIT], 5000);
  return result.out.trim() === "active";
}
function systemdCtl(verb, args = []) {
  return run("systemctl", ["--user", verb, ...args, SYSTEMD_UNIT], 30000);
}
function serviceActionUsage() {
  return "Usage: /headroom service <install|uninstall|status>";
}
function commandFailure(result) {
  const detail = (result.err || result.out).trim();
  return detail ? clip(detail, 200) : `exit code ${result.code}`;
}
async function manageHeadroomUserService(action2, ctx, state, host = "omp") {
  if (action2 === "status") {
    const configured = existsSync3(USER_SYSTEMD_UNIT_PATH) || await systemdUnitAvailable();
    const active = await systemdUnitActive();
    ctx.ui.notify(`Headroom user service:
  unit: ${configured ? "configured" : "not configured"}
  status: ${active ? "active" : "inactive"}
  path: ${USER_SYSTEMD_UNIT_PATH}`, "info");
    return;
  }
  if (action2 === "install") {
    if (!existsSync3(HEADROOM_BIN))
      await maintainInstall(ctx, state, true, host);
    if (!existsSync3(HEADROOM_BIN)) {
      ctx.ui.notify(`Headroom service was not installed because its executable is missing: ${HEADROOM_BIN}${state.lastError ? `
${state.lastError}` : ""}`, "error");
      return;
    }
    const unit = renderHeadroomUserService(HEADROOM_BIN, proxyPort());
    if (existsSync3(USER_SYSTEMD_UNIT_PATH)) {
      const existing = readFileSync4(USER_SYSTEMD_UNIT_PATH, "utf8");
      if (existing !== unit) {
        ctx.ui.notify(`Headroom user service already exists at ${USER_SYSTEMD_UNIT_PATH}; it was not replaced because its contents differ from this release. Review or remove it, then rerun /headroom service install.`, "warn");
        return;
      }
    } else {
      mkdirSync2(USER_SYSTEMD_DIR, { recursive: true });
      writeFileSync2(USER_SYSTEMD_UNIT_PATH, unit, "utf8");
    }
    const reload2 = await run("systemctl", ["--user", "daemon-reload"], 30000);
    if (reload2.code !== 0) {
      ctx.ui.notify(`systemctl daemon-reload failed: ${commandFailure(reload2)}`, "error");
      return;
    }
    const enabled = await systemdCtl("enable", ["--now"]);
    if (enabled.code !== 0) {
      ctx.ui.notify(`systemctl enable --now failed: ${commandFailure(enabled)}`, "error");
      return;
    }
    systemdUnitKnown = true;
    state.proxyReady = await isProxyReady();
    state.proxyStarting = false;
    state.proxyCheckedAt = Date.now();
    ctx.ui.notify(`Headroom user service installed and enabled.
  unit: ${USER_SYSTEMD_UNIT_PATH}
  proxy: ${state.proxyReady ? "ready" : "starting"}`, "info");
    return;
  }
  if (existsSync3(USER_SYSTEMD_UNIT_PATH) || await systemdUnitAvailable()) {
    const disabled = await systemdCtl("disable", ["--now"]);
    if (disabled.code !== 0) {
      ctx.ui.notify(`systemctl disable --now failed: ${commandFailure(disabled)}`, "error");
      return;
    }
  }
  if (existsSync3(USER_SYSTEMD_UNIT_PATH))
    unlinkSync2(USER_SYSTEMD_UNIT_PATH);
  const reload = await run("systemctl", ["--user", "daemon-reload"], 30000);
  if (reload.code !== 0) {
    ctx.ui.notify(`systemctl daemon-reload failed: ${commandFailure(reload)}`, "error");
    return;
  }
  systemdUnitKnown = false;
  state.proxyReady = await isProxyReady();
  state.proxyStarting = false;
  state.proxyCheckedAt = Date.now();
  ctx.ui.notify("Headroom user service disabled and removed.", "info");
}
async function restartProxy(ctx, state, host = "omp") {
  const ownedProcess = state.proxyProcess;
  if (ownedProcess) {
    ownedProcess.kill("SIGTERM");
    state.proxyProcess = undefined;
    await sleep(500);
  }
  if (await systemdUnitAvailable()) {
    const result = await systemdCtl("restart");
    if (result.code !== 0) {
      state.lastError = `systemctl restart failed: ${clip(result.err.trim(), 200)}`;
      return false;
    }
  } else if (!ownedProcess && await isProxyReady()) {
    state.proxyReady = true;
    state.proxyStarting = false;
    state.lastError = "Refusing to restart an unowned Headroom proxy; use the service manager that owns it.";
    renderWidget(ctx, state, host);
    return false;
  }
  state.proxyReady = false;
  state.proxyStarting = false;
  return ensureProxy(ctx, state, 25000, host);
}
async function installedVersion() {
  if (!existsSync3(VENV_PYTHON))
    return "";
  const result = await run(VENV_PYTHON, ["-c", "from importlib.metadata import version;print(version('headroom-ai'))"], 15000);
  return result.code === 0 ? result.out.trim() : "";
}
async function latestPypiVersion() {
  try {
    const response = await fetch(PYPI_JSON_URL, { signal: AbortSignal.timeout(6000) });
    if (!response.ok)
      return "";
    const data = await response.json();
    return typeof data?.info?.version === "string" ? data.info.version : "";
  } catch {
    return "";
  }
}
function readUpdateStamp() {
  try {
    return JSON.parse(readFileSync4(UPDATE_STATE_FILE, "utf8")) || {};
  } catch {
    return {};
  }
}
function writeUpdateStamp(stamp) {
  try {
    writeFileSync2(UPDATE_STATE_FILE, JSON.stringify(stamp));
  } catch {}
}
function acquireUpdateLock() {
  try {
    writeFileSync2(UPDATE_LOCK_FILE, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    try {
      const lockPid = readFileSync4(UPDATE_LOCK_FILE, "utf8").trim();
      if (lockPid === String(process.pid)) {
        writeFileSync2(UPDATE_LOCK_FILE, String(process.pid));
        return true;
      }
      if (Date.now() - statSync(UPDATE_LOCK_FILE).mtimeMs > 45 * 60000) {
        writeFileSync2(UPDATE_LOCK_FILE, String(process.pid));
        return true;
      }
    } catch {}
    return false;
  }
}
function releaseUpdateLock() {
  try {
    unlinkSync2(UPDATE_LOCK_FILE);
  } catch {}
}
var maintenanceInFlight;
var ROCM_TORCH_SPEC = process.env.OMP_HEADROOM_ROCM_TORCH || "torch==2.9.1+rocm6.4";
var ROCM_TORCH_INDEX = process.env.OMP_HEADROOM_ROCM_INDEX || "https://download.pytorch.org/whl/rocm6.4";
async function isRocmVenv() {
  if (!existsSync3(VENV_PYTHON))
    return false;
  try {
    const r = await run(VENV_PYTHON, ["-c", "import torch,sys; sys.exit(0 if '+rocm' in torch.__version__ else 1)"], 15000);
    return r.code === 0;
  } catch {
    return false;
  }
}
async function repinRocmTorch() {
  const r = await installPythonPackages([ROCM_TORCH_SPEC, "--index-url", ROCM_TORCH_INDEX], 600000);
  if (r.code !== 0)
    throw new Error(`ROCm torch re-pin failed: ${clip(r.err.trim(), 300)}`);
}
function detectAmdGpu() {
  try {
    for (const card of readdirSync2("/sys/class/drm")) {
      if (!/^card\d+$/.test(card))
        continue;
      const vendorPath = join5("/sys/class/drm", card, "device/vendor");
      if (existsSync3(vendorPath) && readFileSync4(vendorPath, "utf8").trim() === "0x1002")
        return true;
    }
  } catch {}
  return false;
}
function maintainInstall(ctx, state, force = false, host = "omp") {
  if (!maintenanceInFlight) {
    maintenanceInFlight = doMaintainInstall(ctx, state, force, host).finally(() => {
      maintenanceInFlight = undefined;
    });
  }
  return maintenanceInFlight;
}
async function doMaintainInstall(ctx, state, force, host = "omp") {
  try {
    if (!existsSync3(HEADROOM_BIN)) {
      if (!acquireUpdateLock())
        return;
      try {
        state.installState = "installing";
        renderWidget(ctx, state, host);
        ctx?.ui?.notify?.(`Installing ${PACKAGE_SPEC} into ${VENV_DIR}…`, "info");
        if (!existsSync3(VENV_PYTHON)) {
          const venv = await createHeadroomVenv();
          if (venv.code !== 0) {
            throw new Error(`Python venv creation failed: ${clip(venv.err.trim(), 200)}`);
          }
        }
        const install = await installPythonPackages([PACKAGE_SPEC], 1800000);
        if (install.code !== 0)
          throw new Error(`headroom install failed: ${clip(install.err.trim(), 300)}`);
        if (detectAmdGpu()) {
          try {
            await repinRocmTorch();
          } catch (e) {
            ctx?.ui?.notify?.(`ROCm torch re-pin failed: ${clip(errorMessage(e), 120)}`, "warn");
          }
        }
        state.installState = "";
        state.version = await installedVersion();
        writeUpdateStamp({ checkedAt: Date.now(), latest: state.version });
        ctx?.ui?.notify?.(`Headroom ${state.version} installed.`, "info");
      } finally {
        releaseUpdateLock();
      }
      return;
    }
    if (!AUTOUPDATE && !force)
      return;
    if (!state.version)
      state.version = await installedVersion();
    const stamp = readUpdateStamp();
    if (!force && stamp.checkedAt && Date.now() - stamp.checkedAt < UPDATE_INTERVAL_MS) {
      if (typeof stamp.latest === "string" && stamp.latest)
        state.latest = stamp.latest;
    } else {
      const latest = await latestPypiVersion();
      if (latest) {
        state.latest = latest;
        writeUpdateStamp({ checkedAt: Date.now(), latest });
      }
    }
    if (!isNewer(state.latest, state.version))
      return;
    if (!acquireUpdateLock())
      return;
    try {
      const wasRocm = await isRocmVenv() || detectAmdGpu();
      state.installState = "updating";
      renderWidget(ctx, state, host);
      const upgrade = await installPythonPackages(["--upgrade", PACKAGE_SPEC], 1800000);
      if (upgrade.code !== 0)
        throw new Error(`headroom update failed: ${clip(upgrade.err.trim(), 300)}`);
      state.installState = "";
      state.version = await installedVersion();
      writeUpdateStamp({ checkedAt: Date.now(), latest: state.version });
      if (wasRocm)
        await repinRocmTorch();
      const restarted = await restartProxy(ctx, state, host);
      ctx?.ui?.notify?.(restarted ? `Headroom updated to ${state.version}; proxy restarted.` : `Headroom updated to ${state.version}, but ${state.lastError || "the proxy restart is still pending."}`, restarted ? "info" : "warn");
    } finally {
      releaseUpdateLock();
    }
  } catch (error) {
    state.installState = "";
    state.lastError = errorMessage(error);
  } finally {
    renderWidget(ctx, state, host);
  }
}
async function systemdExecStartMatches() {
  if (!SYSTEMD_UNIT)
    return false;
  try {
    const result = await run("systemctl", ["--user", "cat", SYSTEMD_UNIT], 5000);
    if (result.code !== 0)
      return false;
    const execLine = result.out.split(`
`).find((l) => l.trim().startsWith("ExecStart="));
    return typeof execLine === "string" && execLine.includes(HEADROOM_BIN);
  } catch {
    return false;
  }
}
async function reconcileProxyVersion(ctx, state, _host = "omp") {
  if (!AUTOUPDATE || !state.proxyReady)
    return;
  try {
    const response = await fetch(proxyPath("/livez"), {
      method: "GET",
      signal: AbortSignal.timeout(2000)
    });
    if (!response.ok)
      return;
    const live = await response.json();
    const liveVersion = typeof live?.version === "string" ? live.version : "";
    if (!state.version)
      state.version = await installedVersion();
    if (!liveVersion || !state.version || liveVersion === state.version) {
      state.reconcileKey = "";
      return;
    }
    if (await systemdUnitActive()) {
      const aligned = await systemdExecStartMatches();
      const key = `${liveVersion}|${state.version}|${aligned}`;
      if (state.reconcileKey === key)
        return;
      state.reconcileKey = key;
      if (!aligned) {
        ctx?.ui?.notify?.(`Headroom proxy is ${liveVersion} but should be ${state.version}; the systemd unit ExecStart does not match ${HEADROOM_BIN}.`, "warn");
      } else {
        ctx?.ui?.notify?.(`Headroom proxy is still ${liveVersion}; restart the systemd unit to activate ${state.version}.`, "info");
      }
      return;
    }
    const restarted = await restartProxy(ctx, state);
    if (restarted)
      ctx?.ui?.notify?.(`Headroom proxy restarted on ${state.version} (was ${liveVersion}).`, "info");
  } catch {}
}
function messagesDigest(messages) {
  return createHash2("sha256").update(stableJson(messages)).digest("hex");
}
function debugSizingLogPath(state) {
  if (!DEBUG_SIZING)
    return "";
  const sid = typeof state?.sessionId === "string" ? state.sessionId : "";
  const safe = sid.replace(/[^A-Za-z0-9_-]/g, "");
  if (!safe)
    return "";
  return join5(LOGS_DIR, `${safe}-sizing.jsonl`);
}
function debugSizingInput(state, seq, payload) {
  if (!DEBUG_SIZING || typeof seq !== "number")
    return;
  try {
    const logFile = debugSizingLogPath(state);
    if (!logFile)
      return;
    const fmt = Array.isArray(payload?.messages) ? "messages" : Array.isArray(payload?.input) ? "input" : "other";
    const msgs = fmt === "messages" ? payload.messages : fmt === "input" ? payload.input : [];
    const prevSeq = state._debugLastCompletedSeq || 0;
    let prevPrefixMatch = null;
    if (prevSeq === seq - 1 && state._debugPrevOutputDigest && state._debugPrevOutputLen > 0 && state._debugPrevOutputFormat === fmt && state._debugPrevOutputLen <= msgs.length) {
      prevPrefixMatch = messagesDigest(msgs.slice(0, state._debugPrevOutputLen)) === state._debugPrevOutputDigest;
    }
    mkdirSync2(LOGS_DIR, { recursive: true });
    appendFileSync(logFile, `${JSON.stringify({
      seq,
      stage: "hook_input",
      chars: payloadCharTotal(payload),
      msgCount: msgs.length,
      fmt,
      previous_output_prefix_match: prevPrefixMatch
    })}
`);
  } catch {}
}
function debugSizingStage(state, seq, stage, payload) {
  if (!DEBUG_SIZING || typeof seq !== "number" || typeof stage !== "string")
    return;
  try {
    const logFile = debugSizingLogPath(state);
    if (!logFile)
      return;
    const msgs = Array.isArray(payload?.messages) ? payload.messages : Array.isArray(payload?.input) ? payload.input : [];
    mkdirSync2(LOGS_DIR, { recursive: true });
    appendFileSync(logFile, `${JSON.stringify({
      seq,
      stage,
      chars: payloadCharTotal(payload),
      msgCount: msgs.length
    })}
`);
  } catch {}
}
function debugSizingDiagnostic(state, seq, detail) {
  if (!DEBUG_SIZING || typeof seq !== "number" || !isRecord(detail))
    return;
  try {
    const logFile = debugSizingLogPath(state);
    if (!logFile)
      return;
    mkdirSync2(LOGS_DIR, { recursive: true });
    appendFileSync(logFile, `${JSON.stringify({ seq, stage: "anthropic_diagnostic", ...detail })}
`);
  } catch {}
}
function debugSizingOutput(state, seq, payload) {
  if (!DEBUG_SIZING || typeof seq !== "number")
    return;
  try {
    const logFile = debugSizingLogPath(state);
    if (!logFile)
      return;
    const fmt = Array.isArray(payload?.messages) ? "messages" : Array.isArray(payload?.input) ? "input" : "other";
    const msgs = fmt === "messages" ? payload.messages : fmt === "input" ? payload.input : [];
    state._debugLastCompletedSeq = Math.max(state._debugLastCompletedSeq || 0, seq);
    if (!state._debugLastOutputSeq || seq >= state._debugLastOutputSeq) {
      state._debugPrevOutputDigest = messagesDigest(msgs);
      state._debugPrevOutputLen = msgs.length;
      state._debugPrevOutputFormat = fmt;
      state._debugLastOutputSeq = seq;
    }
    mkdirSync2(LOGS_DIR, { recursive: true });
    appendFileSync(logFile, `${JSON.stringify({
      seq,
      stage: "hook_output",
      chars: payloadCharTotal(payload),
      msgCount: msgs.length,
      fmt
    })}
`);
  } catch {}
}
function normalizeModel(payload, ctx) {
  if (isRecord(payload) && typeof payload.model === "string" && payload.model)
    return payload.model;
  if (ctx?.model?.id)
    return ctx.model.id;
  return "gpt-4o";
}
function contextUsageRatio(ctx) {
  const usage = ctx?.getContextUsage?.();
  const tokens = asNumber(usage?.tokens);
  const window = asNumber(usage?.contextWindow);
  return window > 0 && tokens > 0 ? Math.min(1, tokens / window) : 0;
}
function contextWindow(ctx) {
  const usage = ctx?.getContextUsage?.();
  const value = usage?.contextWindow;
  return Number.isInteger(value) && value > 0 ? value : undefined;
}
var HEADROOM_TEST_HASH = "0123456789abcdef01234567";
var HEADROOM_TEST_SURFACES = ["tool", "compaction"];
var HEADROOM_TEST_TIMESTAMP = Date.parse("2026-01-01T00:00:00.000Z");
function isHeadroomTestSurface(surface) {
  return HEADROOM_TEST_SURFACES.includes(String(surface || "").trim().toLowerCase());
}
function headroomTestToolContent() {
  return Array.from({ length: 200 }, (_, index) => `build ${index}: module=src/index.ts status=completed checksum=abcdef1234567890 decisions=preserve-retrieval-contract`).join(`
`);
}
async function runHeadroomCompression(content, ctx, state, host = "omp") {
  await ensureProxy(ctx, state, 1e4, host);
  const callId = "headroom_manual_compress";
  const messages = [
    { role: "user", content: "Compress this content for token-efficient reasoning." },
    {
      role: "assistant",
      content: null,
      tool_calls: [
        { id: callId, type: "function", function: { name: COMPRESS_TOOL, arguments: "{}" } }
      ]
    },
    { role: "tool", content, tool_call_id: callId }
  ];
  const result = await compressOpenAiMessages(messages, normalizeModel(undefined, ctx), contextWindow(ctx), TOOL_TIMEOUT_MS, state, { targeted: true });
  const candidateMessage = result?.messages?.at?.(-1);
  const candidate = isRecord(candidateMessage) ? candidateMessage.content : undefined;
  const persisted = isBeneficialCompressionResult(result) && typeof candidate === "string" && candidate.length < content.length ? await persistCcrOriginal(result, content, candidate, state, ctx) : 0;
  if (persisted)
    recordCompression(state, "tool", result, ctx);
  state.lastError = "";
  refreshStatsAndRender(ctx, state, host);
  return {
    compressed: persisted ? candidate : undefined,
    details: {
      tokensBefore: result.tokensBefore,
      tokensAfter: result.tokensAfter,
      tokensSaved: result.tokensSaved,
      ccrHashes: result.ccrHashes
    }
  };
}
function seedHeadroomToolTranscript(sessionManager, source, compressed, details) {
  const toolCallId = "headroom-test-compress";
  sessionManager.appendMessage({
    role: "assistant",
    content: [
      {
        type: "toolCall",
        id: toolCallId,
        name: COMPRESS_TOOL,
        arguments: { content: source }
      }
    ],
    api: "openai-responses",
    provider: "openai",
    model: "headroom-fixture",
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    },
    stopReason: "toolUse",
    timestamp: HEADROOM_TEST_TIMESTAMP
  });
  sessionManager.appendMessage({
    role: "toolResult",
    toolCallId,
    toolName: COMPRESS_TOOL,
    content: [{ type: "text", text: compressed }],
    details,
    isError: false,
    timestamp: HEADROOM_TEST_TIMESTAMP + 1
  });
}
function seedHeadroomCompactionTranscript(sessionManager) {
  const firstKeptEntryId = sessionManager.appendMessage({
    role: "user",
    content: [{ type: "text", text: "Continue from the compacted conversation." }],
    timestamp: HEADROOM_TEST_TIMESTAMP
  });
  sessionManager.appendCompaction("Previous work was compacted. Preserve active decisions, file paths, identifiers, errors, constraints, and unresolved work.", "Headroom test fixture: native OMP compaction card.", firstKeptEntryId, 245000, undefined, true, { headroomCcrHash: HEADROOM_TEST_HASH, headroomArchived: true });
}
async function createHeadroomTranscriptFixture(ctx, state, surface, host = "omp") {
  const selected = String(surface || "").trim().toLowerCase();
  if (!isHeadroomTestSurface(selected))
    return;
  if (typeof ctx?.newSession !== "function" || typeof ctx?.reload !== "function")
    return false;
  let toolTranscript;
  if (selected === "tool") {
    const source = headroomTestToolContent();
    try {
      const result2 = await runHeadroomCompression(source, ctx, state, host);
      if (typeof result2.compressed !== "string") {
        return { error: "proxy returned no shorter retrievable Headroom result" };
      }
      toolTranscript = { source, compressed: result2.compressed, details: result2.details };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }
  const result = await ctx.newSession({
    setup: async (sessionManager) => {
      await sessionManager.setSessionName?.(`Headroom test — ${selected}`);
      if (selected === "tool") {
        if (!toolTranscript)
          throw new Error("Headroom tool fixture was not initialized");
        seedHeadroomToolTranscript(sessionManager, toolTranscript.source, toolTranscript.compressed, toolTranscript.details);
      } else {
        seedHeadroomCompactionTranscript(sessionManager);
      }
    }
  });
  if (result?.cancelled)
    return false;
  await ctx.reload();
  return true;
}
async function runHeadroomCompaction(ctx, state) {
  if (typeof ctx.compact !== "function") {
    ctx.ui.notify("Compaction is unavailable in this OMP context.", "warn");
    return false;
  }
  state.lastCompactionCcrHash = "";
  state.headroomCompactActive = true;
  ctx.ui.notify("Headroom compaction started…", "info");
  try {
    await ctx.compact();
    ctx.ui.notify(state.lastCompactionCcrHash ? `Headroom archive ready: ${state.lastCompactionCcrHash}.` : "OMP compaction completed; Headroom did not archive a discarded source segment.", state.lastCompactionCcrHash ? "info" : "warn");
    return !!state.lastCompactionCcrHash;
  } catch (error) {
    ctx.ui.notify(`Compaction failed: ${errorMessage(error).slice(0, 120)}`, "error");
    return false;
  } finally {
    state.headroomCompactActive = false;
  }
}
async function persistHolisticCompression(result, originalMessages, state, ctx) {
  if (!isBeneficialCompressionResult(result))
    return false;
  return await persistCcrOriginal(result, stableJson(originalMessages), stableJson(result.messages), state, ctx) > 0;
}
function applyOpenAiCompressionResult(result, payloadWithTool, hadSystem) {
  if (!isBeneficialCompressionResult(result))
    return payloadWithTool;
  return fromOpenAiPayloadMessages(payloadWithTool, result.messages, hadSystem);
}
async function compressOpenAiMessages(messages, model, tokenBudget, timeoutMs, state, { targeted = false } = {}) {
  const body = {
    messages,
    model,
    config: {
      compress_user_messages: false,
      protect_recent: targeted ? 0 : 2,
      protect_analysis_context: !targeted
    }
  };
  if (Number.isInteger(tokenBudget) && tokenBudget > 0)
    body.token_budget = tokenBudget;
  const project = state?.sessionId ? `/p/${state.sessionId}` : "";
  const response = await fetch(proxyPath(`${project}/v1/compress`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client": "omp"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs)
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }
  if (!response.ok) {
    const failure = data.error;
    const message = isRecord(failure) ? failure.message : failure;
    throw new Error(`Headroom proxy compression failed (${response.status}): ${String(message ?? text ?? response.statusText)}`);
  }
  return normalizeCompressionResult(data, messages);
}
function toOpenAiPayloadMessages(payload) {
  const sourceMessages = Array.isArray(payload.messages) ? payload.messages : [];
  const messages = [...sourceMessages];
  const systemText = systemToText(payload.system);
  if (systemText !== undefined)
    messages.unshift({ role: "system", content: systemText });
  return { messages, hadSystem: systemText !== undefined };
}
function fromOpenAiPayloadMessages(payload, compressedMessages, hadSystem) {
  const rest3 = compressedMessages;
  if (hadSystem && isRecord(rest3[0]) && rest3[0].role === "system") {
    return { ...payload, system: rest3[0].content, messages: rest3.slice(1) };
  }
  return { ...payload, messages: rest3 };
}
function readArchivedAncestor(hash, sessionId) {
  try {
    const files = [ccrFallbackPath(hash, undefined, sessionId), ccrFallbackPath(hash)];
    for (const file of files) {
      if (file && existsSync3(file))
        return readFileSync4(file, "utf8");
    }
    return "";
  } catch {
    return "";
  }
}
async function prepareArchiveSession(ctx, state) {
  const sid = ctx?.sessionManager?.getSessionId?.();
  if (typeof sid !== "string" || !sid)
    return;
  if (state.sessionId !== sid) {
    state.sessionId = sid;
    state._archiveHydrated = false;
    state.sessionArchiveCompactions = 0;
    state.sessionArchiveCharsBefore = 0;
    state.sessionArchiveCharsAfter = 0;
    state.sessionArchiveCharsSaved = 0;
    state._ompHydrated = false;
    state.ompCompactions = 0;
  }
  if (state._archiveHydrated)
    return;
  const totals = await readArchiveTotals(sid);
  state.sessionArchiveCompactions = totals.count;
  state.sessionArchiveCharsBefore = totals.charsBefore;
  state.sessionArchiveCharsAfter = totals.charsAfter;
  state.sessionArchiveCharsSaved = totals.charsSaved;
  state._archiveHydrated = true;
}
async function persistSessionArchiveCandidate(candidate, state, ctx) {
  const archiveSessionId = ctx?.sessionManager?.getSessionId?.() || state.sessionId;
  const original = expandSessionArchiveText(candidate.originalText, (hash) => readArchivedAncestor(hash, archiveSessionId));
  const persisted = await persistCcrByHash(candidate.hash, original, state, ctx);
  if (!persisted)
    return false;
  const previous = {
    count: state.sessionArchiveCompactions,
    charsBefore: state.sessionArchiveCharsBefore,
    charsAfter: state.sessionArchiveCharsAfter,
    charsSaved: state.sessionArchiveCharsSaved
  };
  state.sessionArchiveCompactions = previous.count + 1;
  state.sessionArchiveCharsBefore = previous.charsBefore + candidate.prefixChars;
  state.sessionArchiveCharsAfter = previous.charsAfter + candidate.archiveChars;
  state.sessionArchiveCharsSaved = previous.charsSaved + Math.max(0, candidate.prefixChars - candidate.archiveChars);
  const stored = await writeArchiveTotals(state.sessionId, {
    count: state.sessionArchiveCompactions,
    charsBefore: state.sessionArchiveCharsBefore,
    charsAfter: state.sessionArchiveCharsAfter,
    charsSaved: state.sessionArchiveCharsSaved
  });
  if (stored)
    return true;
  state.sessionArchiveCompactions = previous.count;
  state.sessionArchiveCharsBefore = previous.charsBefore;
  state.sessionArchiveCharsAfter = previous.charsAfter;
  state.sessionArchiveCharsSaved = previous.charsSaved;
  return false;
}
async function applyMessageSessionArchive(payload, provider, state, ctx) {
  if (!payloadHasRetrieveTool(payload))
    return payload;
  if (provider === "anthropic") {
    const source = Array.isArray(payload.messages) ? payload.messages : [];
    const candidate2 = createSessionCompaction(source);
    if (!candidate2.compacted)
      return payload;
    const projected2 = {
      ...payload,
      messages: candidate2.messages.map(asAnthropicArchiveMessage)
    };
    if (stableJson(projected2).length >= stableJson(payload).length)
      return payload;
    return await persistSessionArchiveCandidate(candidate2, state, ctx) ? projected2 : payload;
  }
  const { messages, hadSystem } = toOpenAiPayloadMessages(payload);
  const candidate = createSessionCompaction(messages);
  if (!candidate.compacted)
    return payload;
  const projected = fromOpenAiPayloadMessages(payload, candidate.messages, hadSystem);
  if (stableJson(projected).length >= stableJson(payload).length)
    return payload;
  return await persistSessionArchiveCandidate(candidate, state, ctx) ? projected : payload;
}
async function applyResponsesSessionArchive(payload, state, ctx) {
  if (!payloadHasRetrieveTool(payload))
    return payload;
  const input = Array.isArray(payload.input) ? payload.input : [];
  const candidate = createResponsesSessionCompaction(input);
  if (!candidate.compacted)
    return payload;
  const projected = { ...payload, input: candidate.input };
  if (stableJson(projected).length >= stableJson(payload).length)
    return payload;
  return await persistSessionArchiveCandidate(candidate, state, ctx) ? projected : payload;
}
function anthropicToolResultText(block) {
  if (!isRecord(block) || block.type !== "tool_result")
    return;
  if (typeof block.content === "string")
    return block.content;
  if (!Array.isArray(block.content))
    return;
  const textBlocks = getTextBlocks(block.content);
  if (textBlocks.length !== block.content.length)
    return;
  return textBlocks.map((item) => item.text).join(`
`);
}
function anthropicCompressionDiagnostic(payload, ctx) {
  const minToolChars = adaptiveMinChars(ANTHROPIC_MIN_TOOL_TEXT_CHARS, contextUsageRatio(ctx));
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  let toolResultBlocks = 0;
  let textToolResultBlocks = 0;
  let eligibleToolResultBlocks = 0;
  let markedToolResultBlocks = 0;
  let missingCallIdBlocks = 0;
  let maxToolResultChars = 0;
  for (const message of messages) {
    if (!isRecord(message) || message.role !== "user" || !Array.isArray(message.content)) {
      continue;
    }
    for (const block of message.content) {
      if (!isRecord(block) || block.type !== "tool_result")
        continue;
      toolResultBlocks++;
      if (typeof block.tool_use_id !== "string" || !block.tool_use_id) {
        missingCallIdBlocks++;
      }
      const text = anthropicToolResultText(block);
      if (text === undefined)
        continue;
      textToolResultBlocks++;
      maxToolResultChars = Math.max(maxToolResultChars, text.length);
      if (text.includes(COMPRESSED_MARKER) || text.includes(RETRIEVED_MARKER)) {
        markedToolResultBlocks++;
      } else if (text.length >= minToolChars) {
        eligibleToolResultBlocks++;
      }
    }
  }
  return {
    enabled: ANTHROPIC_COMPRESSION_ENABLED,
    hasRetrieveTool: payloadHasRetrieveTool(payload),
    messageCount: messages.length,
    minToolChars,
    toolResultBlocks,
    textToolResultBlocks,
    eligibleToolResultBlocks,
    markedToolResultBlocks,
    missingCallIdBlocks,
    maxToolResultChars
  };
}
function stripEmptyAnthropicTextBlocks(payload) {
  const messages = Array.isArray(payload.messages) ? payload.messages : null;
  if (!messages)
    return payload;
  let changed = false;
  const nextMessages = messages.map((message) => {
    if (!isRecord(message) || message.role === "user" || !Array.isArray(message.content)) {
      return message;
    }
    const filtered = message.content.filter((block) => !(isRecord(block) && block.type === "text" && (typeof block.text !== "string" || block.text.trim() === "")));
    if (filtered.length === 0 || filtered.length === message.content.length)
      return message;
    changed = true;
    return { ...message, content: filtered };
  });
  return changed ? { ...payload, messages: nextMessages } : payload;
}
async function compressAnthropicPayload(payload, ctx, state) {
  payload = stripEmptyAnthropicTextBlocks(payload);
  if (!payloadHasRetrieveTool(payload))
    return payload;
  if (!ANTHROPIC_COMPRESSION_ENABLED)
    return payload;
  const startMs = Date.now();
  const ANTHROPIC_BUDGET_MS = 18000;
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const minToolChars = adaptiveMinChars(ANTHROPIC_MIN_TOOL_TEXT_CHARS, contextUsageRatio(ctx));
  let changed = false;
  const nextMessages = [];
  for (const message of messages) {
    if (!isRecord(message) || message.role !== "user" || !Array.isArray(message.content)) {
      nextMessages.push(message);
      continue;
    }
    const nextContent = [];
    let contentChanged = false;
    for (const block of message.content) {
      const output = anthropicToolResultText(block);
      if (output === undefined || output.length < minToolChars || output.includes(COMPRESSED_MARKER) || output.includes(RETRIEVED_MARKER)) {
        nextContent.push(block);
        continue;
      }
      const callId = typeof block.tool_use_id === "string" ? block.tool_use_id : "hr_ar";
      const synthetic = [
        {
          role: "user",
          content: "Compress Anthropic tool_result content for token-efficient reasoning."
        },
        {
          role: "assistant",
          content: null,
          tool_calls: [{ id: callId, type: "function", function: { name: "ar", arguments: "{}" } }]
        },
        { role: "tool", content: output, tool_call_id: callId }
      ];
      if (Date.now() - startMs > ANTHROPIC_BUDGET_MS) {
        nextContent.push(block);
        continue;
      }
      const result = await compressOpenAiMessages(synthetic, normalizeModel(payload, ctx), undefined, PROVIDER_TIMEOUT_MS, state, { targeted: true });
      const compressedMessage = result?.messages?.at?.(-1);
      const compressed = isRecord(compressedMessage) ? compressedMessage.content : undefined;
      if (isBeneficialCompressionResult(result) && typeof compressed === "string" && compressed.length < output.length) {
        const persisted = await persistCcrOriginal(result, output, compressed, state, ctx);
        if (persisted) {
          nextContent.push({ ...block, content: compressed });
          recordCompression(state, "provider", result, ctx);
          contentChanged = true;
          changed = true;
          continue;
        }
      }
      nextContent.push(block);
    }
    nextMessages.push(contentChanged ? { ...message, content: nextContent } : message);
  }
  return changed ? { ...payload, messages: nextMessages } : payload;
}
var RESPONSES_BATCH_MAX_ITEMS = 8;
var RESPONSES_BATCH_MAX_CHARS = MIN_TOOL_TEXT_CHARS * RESPONSES_BATCH_MAX_ITEMS;
function responsesBatchChunks(input, minToolChars) {
  const chunks = [];
  let chunk = [];
  let chunkChars = 0;
  const flush = () => {
    if (chunkChars >= minToolChars)
      chunks.push(chunk);
    chunk = [];
    chunkChars = 0;
  };
  for (let index = 0;index < input.length; index++) {
    const item = input[index];
    const output = responseOutputText(item);
    if (!isRecord(item) || output === undefined || output.length < PROVIDER_MIN_TEXT_CHARS || output.length >= minToolChars || output.includes(COMPRESSED_MARKER) || output.includes(RETRIEVED_MARKER)) {
      continue;
    }
    if (chunk.length >= RESPONSES_BATCH_MAX_ITEMS || chunk.length > 0 && chunkChars + output.length > RESPONSES_BATCH_MAX_CHARS) {
      flush();
    }
    chunk.push({ index, item, output });
    chunkChars += output.length;
  }
  flush();
  return chunks;
}
async function compressResponsesBatch(entries, workingPayload, ctx, state) {
  const toolCalls = entries.map((entry) => {
    const id = typeof entry.item.call_id === "string" ? entry.item.call_id : `headroom_response_output_${entry.index}`;
    return {
      id,
      type: "function",
      function: { name: "response_tool", arguments: "{}" }
    };
  });
  const messages = [
    {
      role: "user",
      content: "Compress OpenAI Responses tool outputs for token-efficient reasoning."
    },
    { role: "assistant", content: null, tool_calls: toolCalls },
    ...entries.map((entry, index) => ({
      role: "tool",
      content: entry.output,
      tool_call_id: toolCalls[index].id
    }))
  ];
  const result = await compressOpenAiMessages(messages, normalizeModel(workingPayload, ctx), undefined, PROVIDER_TIMEOUT_MS, state, { targeted: true });
  if (!isBeneficialCompressionResult(result))
    return;
  const returnedTools = Array.isArray(result.messages) ? result.messages.filter((message) => isRecord(message) && message.role === "tool") : [];
  if (returnedTools.length !== entries.length)
    return;
  const changes = [];
  for (let index = 0;index < entries.length; index++) {
    const entry = entries[index];
    const returned = returnedTools[index];
    const compressed = isRecord(returned) ? returned.content : undefined;
    if (!isRecord(returned) || returned.tool_call_id !== toolCalls[index].id || typeof compressed !== "string") {
      return;
    }
    if (compressed === entry.output)
      continue;
    if (compressed.length >= entry.output.length || !compressed.includes(COMPRESSED_MARKER)) {
      return;
    }
    changes.push({
      index: entry.index,
      item: { ...entry.item, output: compressed },
      originalText: entry.output,
      compressedText: compressed
    });
  }
  if (changes.length === 0)
    return;
  const persisted = await persistCcrOriginalBatch(changes, state, ctx);
  if (persisted !== changes.length)
    return;
  return { changes, result };
}
async function compressResponsesPayload(payload, ctx, state, { providerReady = true, debugSeq = 0 } = {}) {
  const workingPayload = await applyResponsesSessionArchive(payload, state, ctx);
  debugSizingStage(state, debugSeq, "before_compression", workingPayload);
  if (!payloadHasRetrieveTool(workingPayload))
    return workingPayload;
  const input = Array.isArray(workingPayload.input) ? workingPayload.input : [];
  let changed = false;
  if (!providerReady)
    return workingPayload;
  let _failures = 0;
  const minToolChars = adaptiveMinChars(MIN_TOOL_TEXT_CHARS, contextUsageRatio(ctx));
  const nextInput = [...input];
  for (const batchEntries of responsesBatchChunks(input, minToolChars)) {
    try {
      const batch = await compressResponsesBatch(batchEntries, workingPayload, ctx, state);
      if (!batch)
        continue;
      for (const entry of batch.changes)
        nextInput[entry.index] = entry.item;
      recordCompression(state, "provider", batch.result, ctx);
      changed = true;
    } catch {
      _failures += 1;
    }
  }
  const compressItem = async (item) => {
    const output = responseOutputText(item);
    if (output === undefined || output.length < minToolChars || output.includes(COMPRESSED_MARKER) || output.includes(RETRIEVED_MARKER)) {
      return { item };
    }
    const callId = typeof item.call_id === "string" ? item.call_id : "headroom_response_output";
    const messages = [
      {
        role: "user",
        content: "Compress OpenAI Responses tool output for token-efficient reasoning."
      },
      {
        role: "assistant",
        content: null,
        tool_calls: [
          { id: callId, type: "function", function: { name: "response_tool", arguments: "{}" } }
        ]
      },
      { role: "tool", content: output, tool_call_id: callId }
    ];
    try {
      const result = await compressOpenAiMessages(messages, normalizeModel(workingPayload, ctx), undefined, PROVIDER_TIMEOUT_MS, state, { targeted: true });
      const compressedMessage = result?.messages?.at?.(-1);
      const compressed = isRecord(compressedMessage) ? compressedMessage.content : undefined;
      if (isBeneficialCompressionResult(result) && typeof compressed === "string" && compressed.length < output.length) {
        return { item: { ...item, output: compressed }, result, output, compressed };
      }
    } catch {
      _failures += 1;
    }
    return { item };
  };
  const settled = new Array(input.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(RESPONSES_COMPRESS_CONCURRENCY, Math.max(1, input.length)) }, async () => {
    while (cursor < input.length) {
      const index = cursor++;
      settled[index] = await compressItem(input[index]);
    }
  }));
  for (let index = 0;index < settled.length; index++) {
    const entry = settled[index];
    if (!entry.result)
      continue;
    const persisted = await persistCcrOriginal(entry.result, entry.output, entry.compressed, state, ctx);
    if (!persisted)
      continue;
    nextInput[index] = entry.item;
    recordCompression(state, "provider", entry.result, ctx);
    changed = true;
  }
  return changed ? { ...workingPayload, input: nextInput } : workingPayload;
}
function recordCompression(state, kind, result, ctx) {
  const saved = Math.max(0, asNumber(result?.tokensSaved));
  if (saved <= 0)
    return;
  if (ctx && !isMainSession(ctx)) {
    if (kind === "provider")
      shared.foreignProvider += 1;
    if (kind === "tool")
      shared.foreignTool += 1;
    return;
  }
  state.tokensSaved += saved;
  state.tokensBefore += Math.max(0, asNumber(result?.tokensBefore));
  state.tokensAfter += Math.max(0, asNumber(result?.tokensAfter));
  if (kind === "provider")
    state.providerCompressions += 1;
  if (kind === "tool")
    state.toolCompressions += 1;
}
function refreshStatsAndRender(ctx, state, host = "omp") {
  fetchStats(state).then(() => {
    try {
      renderWidget(ctx, state, host);
    } catch {}
  });
}
async function fetchStats(state, force = false, timeoutMs = 3000) {
  const now = Date.now();
  if (!force && state.statsFetchedAt && now - state.statsFetchedAt < STATS_MIN_INTERVAL_MS)
    return state.stats;
  if (state.statsInFlight)
    return state.statsInFlight;
  let inFlight;
  inFlight = (async () => {
    try {
      const project = state.sessionId ? `/p/${state.sessionId}` : "";
      const response = await fetch(proxyPath(`${project}/stats`), {
        method: "GET",
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!response.ok)
        return;
      state.stats = await response.json();
      state.statsFetchedAt = Date.now();
      state.proxyReady = true;
      state.proxyStarting = false;
      state.proxyCheckedAt = state.statsFetchedAt;
      state.lastError = "";
      try {
        const t = readForeignTotals();
        state.foreignProvider = t.provider;
        state.foreignTool = t.tool;
        state.foreignCcr = t.ccr;
      } catch {}
      return state.stats;
    } catch (error) {
      state.lastError = `Headroom stats unavailable: ${error instanceof Error ? error.message : String(error)}`;
      return;
    } finally {
      if (state.statsInFlight === inFlight)
        state.statsInFlight = undefined;
    }
  })();
  state.statsInFlight = inFlight;
  return inFlight;
}
async function ensureProxy(ctx, state, waitMs = 0, host = "omp") {
  const now = Date.now();
  if (state.proxyReady && now - state.proxyCheckedAt < READY_TTL_MS)
    return true;
  if (await isProxyReady()) {
    state.proxyReady = true;
    state.proxyStarting = false;
    state.proxyCheckedAt = Date.now();
    renderWidget(ctx, state, host);
    return true;
  }
  if (await systemdUnitActive()) {
    state.proxyStarting = true;
    const deadlineActive = Date.now() + Math.max(waitMs, 2000);
    while (Date.now() <= deadlineActive) {
      if (await isProxyReady()) {
        state.proxyReady = true;
        state.proxyStarting = false;
        state.proxyCheckedAt = Date.now();
        await fetchStats(state, true);
        renderWidget(ctx, state, host);
        return true;
      }
      await sleep(500);
    }
    renderWidget(ctx, state, host);
    return false;
  }
  state.proxyReady = false;
  if (!state.proxyStarting && !state.proxyProcess) {
    if (!existsSync3(HEADROOM_BIN)) {
      state.lastError = `Headroom binary missing: ${HEADROOM_BIN}`;
      renderWidget(ctx, state, host);
      return false;
    }
    state.proxyStarting = true;
    if (await systemdUnitAvailable()) {
      systemdCtl("start").then((result) => {
        if (result.code !== 0) {
          state.proxyStarting = false;
          state.lastError = `systemctl start failed: ${clip(result.err.trim(), 200)}`;
        }
      });
      ctx?.ui?.notify?.(`Starting Headroom proxy via ${SYSTEMD_UNIT}…`, "info");
    } else {
      const proxyEnv = { ...process.env, HEADROOM_TELEMETRY: "off" };
      if (CODE_AWARE)
        proxyEnv.HEADROOM_CODE_AWARE_ENABLED ??= "1";
      proxyEnv.HEADROOM_NO_SUBSCRIPTION_TRACKING ??= "1";
      state.proxyProcess = spawn(HEADROOM_BIN, [
        "proxy",
        "--host",
        "127.0.0.1",
        "--port",
        String(proxyPort()),
        "--no-telemetry",
        ...PROXY_EXTRA_ARGS
      ], { env: proxyEnv, stdio: "ignore" });
      state.proxyProcess.unref();
      state.proxyProcess.once("error", (error) => {
        state.lastError = errorMessage(error);
        state.proxyStarting = false;
        state.proxyProcess = undefined;
      });
      state.proxyProcess.once("exit", (code) => {
        state.proxyStarting = false;
        state.proxyProcess = undefined;
        if (code !== null && code !== 0)
          state.lastError = `Headroom proxy exited with code ${code}`;
      });
      ctx?.ui?.notify?.(`Starting Headroom proxy on ${PROXY_URL}…`, "info");
    }
  }
  const deadline = Date.now() + waitMs;
  while (Date.now() <= deadline) {
    if (await isProxyReady()) {
      state.proxyReady = true;
      state.proxyStarting = false;
      state.proxyCheckedAt = Date.now();
      await fetchStats(state, true);
      renderWidget(ctx, state, host);
      return true;
    }
    await sleep(500);
  }
  renderWidget(ctx, state, host);
  return false;
}
async function connectWithRetry(ctx, state, opts = {}, host = "omp") {
  const probe = opts.probe ?? (async (c, s, ms) => {
    await ensureProxy(c, s, ms, host);
    return (await getLivez())?.alive === true;
  });
  const onRender = opts.onRender ?? ((c, s) => renderWidget(c, s, host));
  const sleepMs = opts.sleep ?? ((ms) => sleep(ms));
  state.connectAttempt = 0;
  state.connectExhausted = false;
  state.lastError = "";
  onRender(ctx, state);
  for (let i = 0;i < CONNECT_BACKOFF_MS.length; i++) {
    state.connectAttempt = i + 1;
    onRender(ctx, state);
    const ready = await probe(ctx, state, 8000);
    if (ready) {
      state.connectAttempt = 0;
      state.proxyStarting = false;
      onRender(ctx, state);
      return true;
    }
    if (i < CONNECT_BACKOFF_MS.length - 1)
      await sleepMs(CONNECT_BACKOFF_MS[i]);
  }
  state.connectAttempt = 0;
  state.connectExhausted = true;
  state.proxyStarting = false;
  state.lastError = "Headroom proxy did not become ready; run /headroom reconnect.";
  onRender(ctx, state);
  ctx?.ui?.notify?.("Headroom proxy did not become ready after retries. Run `/headroom reconnect` to try again.", "warning");
  return false;
}
function headroomExtension(pi) {
  const host = readHost(pi);
  const legacyZod = pi.zod;
  const z = legacyZod?.z ?? legacyZod ?? {};
  const toolRegistrar = pi;
  if (host === "omp")
    pi.setLabel?.("Headroom");
  let latestCtx;
  let rainbowTimer;
  let widgetOnScreen = true;
  function startRainbowTimer() {
    if (rainbowTimer)
      return;
    rainbowTimer = setInterval(() => {
      const ctx = latestCtx;
      if (!ctx || !state.enabled || !widgetOnScreen)
        return;
      const isMainUi = isMainSession(ctx);
      const now = Date.now();
      let dirty = false;
      if (state.proxyReady) {
        state.rainbowPhase = (state.rainbowPhase + 1) % RAINBOW_CODES.length;
        dirty = true;
      }
      if (isMainUi && now - (state.foreignReadAt || 0) > 1000) {
        state.foreignReadAt = now;
        const t = readForeignTotals();
        if (t.provider !== state.foreignProvider || t.tool !== state.foreignTool || t.ccr !== state.foreignCcr) {
          state.foreignProvider = t.provider;
          state.foreignTool = t.tool;
          state.foreignCcr = t.ccr;
          dirty = true;
        }
      }
      if (isMainUi && state.proxyReady && now - (state.statsFetchedAt || 0) > 5000) {
        fetchStats(state).then(() => {
          try {
            renderWidget(ctx, state, host);
          } catch {}
        });
      }
      if (dirty)
        renderWidget(ctx, state, host);
    }, RAINBOW_MS);
  }
  function stopRainbowTimer() {
    if (!rainbowTimer)
      return;
    clearInterval(rainbowTimer);
    rainbowTimer = undefined;
  }
  const state = createHeadroomState();
  function ensureMainCaptured(ctx) {
    if (!isMainSession(ctx))
      return;
    latestCtx = ctx;
    if (!shared.foreignCleared) {
      shared.foreignCleared = true;
      state.providerCompressions += shared.foreignProvider;
      state.toolCompressions += shared.foreignTool;
      state.ccrHashes += shared.foreignCcr;
      shared.foreignProvider = 0;
      shared.foreignTool = 0;
      shared.foreignCcr = 0;
    }
    if (!state._ompHydrated) {
      state._ompHydrated = true;
      try {
        const branch = ctx?.sessionManager?.getBranch?.();
        if (Array.isArray(branch)) {
          state.ompCompactions = branch.filter((entry) => isRecord(entry) && entry.type === "compaction").length;
        }
      } catch {}
    }
  }
  pi.registerFlag("headroom", {
    description: "Enable Headroom token compression",
    type: "boolean",
    default: true
  });
  if (host === "pi") {
    const setFooter = pi.ui;
    const installFooter = (ctx) => {
      const ui = ctx?.ui;
      ui?.setFooter?.((_tui, _theme, _footerData) => {
        let unsub;
        try {
          unsub = _footerData.onBranchChange?.(() => {});
        } catch {}
        return {
          invalidate() {},
          render(_width) {
            return buildWidgetLines(state);
          },
          dispose() {
            try {
              unsub?.();
            } catch {}
          }
        };
      });
    };
    pi.on("session_start", async (_event, ctx) => {
      installFooter(ctx);
    });
  }
  pi.on("session_start", async (_event, ctx) => {
    const sid = ctx?.sessionManager?.getSessionId?.();
    await prepareArchiveSession(ctx, state);
    if (isMainSession(ctx)) {
      latestCtx = ctx;
    } else if (typeof sid === "string" && sid) {
      subagentSessionIds.add(sid);
    }
    state.enabled = pi.getFlag?.("headroom") !== false && process.env.OMP_HEADROOM_DISABLED !== "1";
    startRainbowTimer();
    renderWidget(ctx, state, host);
    (async () => {
      if (!existsSync3(HEADROOM_BIN))
        await maintainInstall(ctx, state, undefined, host);
      await connectWithRetry(ctx, state, undefined, host);
      await maintainInstall(ctx, state, undefined, host);
      await reconcileProxyVersion(ctx, state, host);
      await fetchStats(state, true);
      renderWidget(ctx, state, host);
    })();
  });
  pi.on("session_shutdown", async (_event, ctx) => {
    stopRainbowTimer();
    ctx?.ui?.setWidget?.(EXTENSION_KEY, undefined, { placement: WIDGET_PLACEMENT });
    ctx?.ui?.setStatus?.(EXTENSION_KEY, undefined);
  });
  pi.on("session_compact", async (_event, ctx) => {
    if (!isMainSession(ctx))
      return;
    state.ompCompactions = (state.ompCompactions || 0) + 1;
    renderWidget(ctx, state, host);
  });
  pi.on("message_end", async (event, ctx) => {
    if (!isMainSession(ctx) || event?.message?.role !== "assistant")
      return;
    ensureMainCaptured(ctx);
    const usage = event.message.usage;
    state.cacheInputTokens += Math.max(0, asNumber(usage?.input));
    state.cacheReadTokens += Math.max(0, asNumber(usage?.cacheRead));
    state.cacheWriteTokens += Math.max(0, asNumber(usage?.cacheWrite));
    if (host === "pi") {
      const sm = ctx.sessionManager;
      const branch = sm?.getBranch?.();
      if (Array.isArray(branch)) {
        for (let i = branch.length - 1;i >= 0; i--) {
          const entry = branch[i];
          if (entry?.type === "message" && entry.message === event.message && entry.id) {
            pi.setLabel?.(entry.id, "Headroom");
            break;
          }
        }
      }
    }
    renderWidget(ctx, state, host);
  });
  if (host === "omp") {
    pi.on("session.compacting", async (event, ctx) => {
      if (!state.headroomCompactActive)
        return;
      try {
        const messages = Array.isArray(event?.messages) ? event.messages : [];
        if (messages.length === 0)
          return;
        const originalText = JSON.stringify(messages, null, 2);
        const hash = createHash2("sha256").update(originalText).digest("hex").slice(0, 24);
        const persisted = await persistCcrByHash(hash, originalText, state, ctx);
        if (persisted === 0) {
          pi.logger?.warn?.("headroom session.compacting: CCR archive failed; skipping headroom archival.");
          return;
        }
        state.lastCompactionCcrHash = hash;
        return {
          context: [
            "Headroom archival active: full originals of the summarized conversation are persisted and retrievable.",
            `Full archived source — preserve this exact reference in the summary: Retrieve more: hash=${hash}`,
            "Preserve every file path, identifier, decision, error, constraint, and tool result verbatim where they matter. This summary replaces the full history."
          ],
          preserveData: {
            headroomArchiveChars: originalText.length,
            headroomArchived: true,
            headroomCcrHash: hash
          }
        };
      } catch (error) {
        pi.logger?.warn?.(`headroom session.compacting failed: ${errorMessage(error)}`);
        return;
      }
    });
    pi.on("widget_layout", (e) => {
      if (e.key !== EXTENSION_KEY)
        return;
      widgetOnScreen = e.visible;
    });
  } else if (host === "pi") {
    pi.on("session_before_compact", async (event, ctx) => {
      try {
        const prep = event?.preparation;
        const messages = Array.isArray(prep?.messagesToSummarize) ? prep.messagesToSummarize : [];
        if (messages.length === 0)
          return;
        const originalText = JSON.stringify(messages, null, 2);
        const hash = createHash2("sha256").update(originalText).digest("hex").slice(0, 24);
        const persisted = await persistCcrByHash(hash, originalText, state, ctx);
        if (persisted === 0) {
          pi.logger?.warn?.("headroom session_before_compact: CCR archive failed; letting Pi compact normally.");
          return;
        }
        state.lastCompactionCcrHash = hash;
        if (!state.headroomCompactActive)
          return;
        if (typeof ctx.compact === "function") {
          ctx.compact({
            customInstructions: [
              "Headroom archival active: full originals of the summarized conversation are persisted and retrievable.",
              `Full archived source — preserve this exact reference in the summary: Retrieve more: hash=${hash}`,
              "Preserve every file path, identifier, decision, error, constraint, and tool result verbatim where they matter. This summary replaces the full history."
            ].join(`
`)
          });
        }
        return { cancel: true };
      } catch (error) {
        pi.logger?.warn?.(`headroom session_before_compact failed: ${errorMessage(error)}`);
        return;
      }
    });
  }
  pi.on("before_provider_request", async (event, ctx) => {
    if (!state.enabled)
      return;
    await prepareArchiveSession(ctx, state);
    ensureMainCaptured(ctx);
    if (isMainSession(ctx)) {
      try {
        const t = readForeignTotals();
        state.foreignProvider = t.provider;
        state.foreignTool = t.tool;
        state.foreignCcr = t.ccr;
      } catch {}
    }
    const payload = event.payload;
    if (!isRecord(payload) || !Array.isArray(payload.messages) && !Array.isArray(payload.input))
      return;
    if (modelUsesHeadroomProxy(ctx?.model)) {
      if (DEBUG_SIZING) {
        state._debugReqSeq = asNumber(state._debugReqSeq) + 1;
        const seq2 = state._debugReqSeq;
        debugSizingInput(state, seq2, payload);
        debugSizingDiagnostic(state, seq2, {
          skippedHeadroomProxy: true,
          format: Array.isArray(payload.messages) ? "messages" : "input"
        });
        debugSizingOutput(state, seq2, payload);
      }
      return;
    }
    if (process.env.OMP_HEADROOM_DEBUG === "1") {
      try {
        const shape = Array.isArray(payload.input) ? "responses(input)" : "messages";
        const prov = (() => {
          try {
            return effectiveProviderFormat(payload, ctx);
          } catch {
            return "?";
          }
        })();
        let detail = {};
        if (Array.isArray(payload.input)) {
          const types2 = {};
          let big = 0;
          let batchItems = 0;
          let batchChars = 0;
          const threshold = adaptiveMinChars(MIN_TOOL_TEXT_CHARS, contextUsageRatio(ctx));
          for (const it of payload.input) {
            const t = isRecord(it) ? String(it.type) : typeof it;
            types2[t] = (types2[t] || 0) + 1;
            const o = responseOutputText(it);
            if (typeof o === "string" && o.length >= threshold)
              big++;
            else if (typeof o === "string" && o.length >= PROVIDER_MIN_TEXT_CHARS) {
              batchItems++;
              batchChars += o.length;
            }
          }
          detail = {
            items: payload.input.length,
            types: types2,
            itemsOverThreshold: big,
            batchCandidates: batchItems,
            batchCandidateChars: batchChars,
            threshold
          };
        } else if (Array.isArray(payload.messages)) {
          detail = { messages: payload.messages.length, model: payload.model || ctx?.model?.id };
        }
        appendFileSync(join5(homedir2(), ".headroom-debug.log"), `${JSON.stringify({
          ts: new Date().toISOString(),
          shape,
          prov,
          ready: state.proxyReady,
          ...detail
        })}
`);
      } catch {}
    }
    let seq = 0;
    if (DEBUG_SIZING) {
      state._debugReqSeq = asNumber(state._debugReqSeq) + 1;
      seq = state._debugReqSeq;
    }
    debugSizingInput(state, seq, payload);
    const hr = (val) => {
      debugSizingOutput(state, seq, val || payload);
      return val;
    };
    let archiveFallback;
    try {
      if (Array.isArray(payload.input)) {
        const ready2 = await ensureProxy(ctx, state, 1000, host);
        const nextPayload = await compressResponsesPayload(payload, ctx, state, {
          providerReady: ready2,
          debugSeq: seq
        });
        if (ready2)
          refreshStatsAndRender(ctx, state, host);
        else
          renderWidget(ctx, state, host);
        return hr(nextPayload);
      }
      const provider = effectiveProviderFormat(payload, ctx);
      if (provider === "anthropic") {
        const workingPayload2 = await applyMessageSessionArchive(payload, provider, state, ctx);
        const archived2 = workingPayload2 !== payload;
        if (archived2)
          archiveFallback = workingPayload2;
        const candidate = providerPayloadHasCompressionCandidate(workingPayload2);
        if (!candidate) {
          debugSizingDiagnostic(state, seq, {
            ...anthropicCompressionDiagnostic(workingPayload2, ctx),
            candidate,
            proxyReady: null
          });
          state.lastError = "";
          renderWidget(ctx, state, host);
          return hr(archived2 ? workingPayload2 : undefined);
        }
        const ready2 = await ensureProxy(ctx, state, 1000, host);
        debugSizingDiagnostic(state, seq, {
          ...anthropicCompressionDiagnostic(workingPayload2, ctx),
          candidate,
          proxyReady: ready2
        });
        if (!ready2) {
          renderWidget(ctx, state, host);
          return hr(archived2 ? workingPayload2 : undefined);
        }
        const nextPayload = await compressAnthropicPayload(workingPayload2, ctx, state);
        state.lastError = "";
        refreshStatsAndRender(ctx, state, host);
        return hr(nextPayload);
      }
      if (!payloadHasRetrieveTool(payload))
        return hr(undefined);
      const workingPayload = await applyMessageSessionArchive(payload, provider, state, ctx);
      const archived = workingPayload !== payload;
      if (archived)
        archiveFallback = workingPayload;
      const { messages: oaMessages, hadSystem } = toOpenAiPayloadMessages(workingPayload);
      if (!providerPayloadHasCompressionCandidate(workingPayload)) {
        state.lastError = "";
        renderWidget(ctx, state, host);
        return hr(archived ? workingPayload : undefined);
      }
      const ready = await ensureProxy(ctx, state, 1000, host);
      if (!ready) {
        renderWidget(ctx, state, host);
        return hr(archived ? workingPayload : undefined);
      }
      const result = await compressOpenAiMessages(oaMessages, normalizeModel(workingPayload, ctx), contextWindow(ctx), PROVIDER_TIMEOUT_MS, state);
      if (await persistHolisticCompression(result, oaMessages, state, ctx)) {
        recordCompression(state, "provider", result, ctx);
        state.lastError = "";
        refreshStatsAndRender(ctx, state, host);
        return hr(applyOpenAiCompressionResult(result, workingPayload, hadSystem));
      }
      return hr(archived ? workingPayload : undefined);
    } catch (error) {
      state.lastError = errorMessage(error);
      pi.logger?.warn?.(`headroom before_provider_request failed: ${state.lastError}`);
      renderWidget(ctx, state, host);
      return hr(archiveFallback);
    }
  });
  if (host === "omp" && z) {
    toolRegistrar.registerTool({
      name: RETRIEVE_TOOL,
      label: "Headroom Retrieve",
      loadMode: "essential",
      description: RETRIEVE_DESCRIPTION,
      parameters: z.object({
        hash: z.string().describe("Hash key from a Headroom compression marker."),
        query: z.string().optional().describe("Optional search query to filter original content.")
      }),
      async execute(_toolCallId, params, signal, _onUpdate, ctx) {
        await ensureProxy(ctx, state, 5000, host);
        let data;
        try {
          const retrieved = await retrieveViaProxy(PROXY_URL, params.hash, params.query, signal, TOOL_TIMEOUT_MS);
          data = isRecord(retrieved) ? retrieved : { error: String(retrieved), hash: params.hash };
        } catch (error) {
          data = { error: errorMessage(error), hash: params.hash };
        }
        let fallback = false;
        if (data.error) {
          const sessionId = ctx?.sessionManager?.getSessionId?.() || state.sessionId;
          const original = await readCcrFallback(params.hash, undefined, sessionId);
          if (original !== undefined) {
            data = { original_content: original };
            fallback = true;
          }
        }
        state.ccrHashes += 1;
        refreshStatsAndRender(ctx, state, host);
        return {
          content: [{ type: "text", text: stringifyRetrieveResult(data, params.hash, fallback) }],
          isError: !!data.error,
          details: data
        };
      }
    });
    toolRegistrar.registerTool({
      name: COMPRESS_TOOL,
      label: "Headroom Compress",
      description: "Compress large content to save context window space. The original is stored by Headroom and can be retrieved later with headroom_retrieve when a hash is present.",
      parameters: z.object({
        content: z.string().describe("Text, JSON, logs, code, or search results to compress.")
      }),
      async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
        const result = await runHeadroomCompression(params.content, ctx, state, host);
        return {
          content: [
            {
              type: "text",
              text: typeof result.compressed === "string" ? result.compressed : params.content
            }
          ],
          details: result.details
        };
      }
    });
    toolRegistrar.registerTool({
      name: STATS_TOOL,
      label: "Headroom Stats",
      description: "Show Headroom compression statistics for this OMP session and proxy.",
      parameters: z.object({}),
      async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
        await ensureProxy(ctx, state, 3000, host);
        await fetchStats(state, true);
        renderWidget(ctx, state, host);
        return {
          content: [{ type: "text", text: commandSummary(state) }],
          details: state.stats || {}
        };
      }
    });
  } else if (host === "pi") {
    Promise.resolve().then(() => (init_build(), exports_build)).then((typeboxModule) => {
      const Type2 = typeboxModule.Type;
      if (!Type2)
        return;
      toolRegistrar.registerTool({
        name: RETRIEVE_TOOL,
        label: "Headroom Retrieve",
        description: RETRIEVE_DESCRIPTION,
        parameters: Type2.Object({
          hash: Type2.String({ description: "Hash key from a Headroom compression marker." }),
          query: Type2.Optional(Type2.String({ description: "Optional search query to filter original content." }))
        }),
        async execute(_toolCallId, params, signal, _onUpdate, ctx) {
          await ensureProxy(ctx, state, 5000, host);
          let data;
          try {
            const retrieved = await retrieveViaProxy(PROXY_URL, String(params.hash || ""), typeof params.query === "string" ? params.query : undefined, signal, TOOL_TIMEOUT_MS);
            data = isRecord(retrieved) ? retrieved : { error: String(retrieved), hash: String(params.hash || "") };
          } catch (error) {
            data = { error: errorMessage(error), hash: String(params.hash || "") };
          }
          let fallback = false;
          if (data.error) {
            const sessionId = ctx?.sessionManager?.getSessionId?.() || state.sessionId;
            const original = await readCcrFallback(String(params.hash || ""), undefined, sessionId);
            if (original !== undefined) {
              data = { original_content: original };
              fallback = true;
            }
          }
          state.ccrHashes += 1;
          refreshStatsAndRender(ctx, state, host);
          return {
            content: [
              {
                type: "text",
                text: stringifyRetrieveResult(data, String(params.hash || ""), fallback)
              }
            ],
            isError: !!data.error,
            details: data
          };
        }
      });
      toolRegistrar.registerTool({
        name: COMPRESS_TOOL,
        label: "Headroom Compress",
        description: "Compress large content to save context window space. The original is stored by Headroom and can be retrieved later with headroom_retrieve when a hash is present.",
        parameters: Type2.Object({
          content: Type2.String({
            description: "Text, JSON, logs, code, or search results to compress."
          })
        }),
        async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
          const result = await runHeadroomCompression(String(params.content || ""), ctx, state, host);
          return {
            content: [
              {
                type: "text",
                text: typeof result.compressed === "string" ? result.compressed : String(params.content || "")
              }
            ],
            details: result.details
          };
        }
      });
      toolRegistrar.registerTool({
        name: STATS_TOOL,
        label: "Headroom Stats",
        description: "Show Headroom compression statistics for this session and proxy.",
        parameters: Type2.Object({}),
        async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
          await ensureProxy(ctx, state, 3000, host);
          await fetchStats(state, true);
          renderWidget(ctx, state, host);
          return {
            content: [{ type: "text", text: commandSummary(state) }],
            details: state.stats || {}
          };
        }
      });
    });
  }
  const UPDATE_AUTO_CLEAR_MS = 45000;
  const headroomCommand = {
    description: "Manage Headroom: stats, on, off, compact, clear, test, service, version, config, set, debug, start, stop, restart, update",
    getArgumentCompletions: (prefix) => completeHeadroomCommand(prefix, HEADROOM_TEST_SURFACES),
    handler: async (args, ctx) => {
      const parts = String(args || "").trim().split(/\s+/);
      const action2 = parts[0]?.toLowerCase() || "stats";
      const sub = parts.slice(1).join(" ");
      if (action2 === "on") {
        state.enabled = true;
        await ensureProxy(ctx, state, 25000, host);
        ctx.ui.notify("Headroom enabled.", "info");
      } else if (action2 === "off") {
        state.enabled = false;
        ctx.ui.notify("Headroom disabled for this session.", "info");
      } else if (action2 === "compact") {
        await runHeadroomCompaction(ctx, state);
      } else if (action2 === "clear") {
        if (sub !== "session confirm") {
          ctx.ui.notify("This deletes the current session's Headroom CCR archives and archive counters. Run /headroom clear session confirm to continue.", "warn");
        } else {
          const sessionId = safeSessionId(ctx?.sessionManager?.getSessionId?.());
          if (!sessionId) {
            ctx.ui.notify("Headroom clear failed: no valid current OMP session ID.", "error");
          } else {
            const ccr = await clearCcrSession(sessionId);
            const statsCleared = await clearArchiveTotals(sessionId);
            if (!ccr.cleared || !statsCleared) {
              ctx.ui.notify(`Headroom clear failed: ${ccr.retainedEntries} archive entries could not be removed.`, "error");
            } else {
              state.ccrHashes = 0;
              state.sessionArchiveCompactions = 0;
              state.sessionArchiveCharsBefore = 0;
              state.sessionArchiveCharsAfter = 0;
              state.sessionArchiveCharsSaved = 0;
              state._archiveHydrated = true;
              ctx.ui.notify(`Cleared Headroom data for this session: ${ccr.deletedFiles} CCR archive files and archive counters.`, "info");
            }
          }
        }
      } else if (action2 === "test") {
        const created = await createHeadroomTranscriptFixture(ctx, state, sub);
        if (created === undefined) {
          ctx.ui.notify(`Unknown Headroom test "${sub || "(empty)"}". Available: ${HEADROOM_TEST_SURFACES.join(", ")}.`, "warn");
        } else if (created && typeof created === "object" && "error" in created) {
          ctx.ui.notify(`Headroom test failed: ${created.error}`, "error");
        } else if (!created) {
          ctx.ui.notify("Headroom test requires an interactive OMP session.", "warn");
        }
      } else if (action2 === "service") {
        const serviceAction = parseServiceAction(sub);
        if (!serviceAction) {
          ctx.ui.notify(`${serviceActionUsage()}
The service command only manages ${SYSTEMD_UNIT}.`, "warn");
        } else {
          await manageHeadroomUserService(serviceAction, ctx, state, host);
        }
      } else if (action2 === "version") {
        const proxyVer = state.version || "?";
        const proxyReady = state.proxyReady ? "ready" : state.proxyStarting ? "starting" : "offline";
        const extPath = import.meta.path || join5(PACKAGE_ROOT, "src", "index.ts");
        let extBuild = "?";
        try {
          extBuild = createHash2("sha256").update(readFileSync4(extPath)).digest("hex").slice(0, 12);
        } catch {}
        ctx.ui.notify(`Headroom plugin:
  plugin: ${existsSync3(extPath) ? "installed" : "missing"}
  path: ${extPath}
  build: ${extBuild}
  proxy: ${PROXY_URL} (${proxyVer}, ${proxyReady})
  binary: ${HEADROOM_BIN}
  config: ${HEADROOM_CONFIG_PATH}${existsSync3(HEADROOM_CONFIG_PATH) ? ` (loaded, ${Object.keys(_cfg).length} keys)` : " (absent — env only)"}
  logs: ${LOGS_DIR}/
  autoupdate: ${AUTOUPDATE ? "on" : "off"}
  provider archive: ${SESSION_ARCHIVE_ENABLED ? "on" : "off"}`, "info");
      } else if (action2 === "config") {
        const rows = HEADROOM_SETTINGS.map((setting) => {
          const value = effectiveSettingValue(setting);
          const rendered = typeof value === "boolean" ? value ? "on" : "off" : String(value);
          const source = settingSource(setting);
          const invalid = invalidSettingValue(setting);
          const suffix = invalid === undefined ? "" : ` — invalid "${invalid}", using default`;
          return `  ${setting.key} = ${rendered} (${source === "env" ? setting.env : source})${suffix}`;
        });
        ctx.ui.notify(`Headroom config — ${HEADROOM_CONFIG_PATH}${existsSync3(HEADROOM_CONFIG_PATH) ? "" : " (absent)"}
${rows.join(`
`)}
  proxy: ${state.version || "?"} ${state.proxyReady ? "ready" : "offline"}
Change with: /headroom set <key> <value>`, "info");
      } else if (action2 === "set") {
        const match = sub.match(/^(\S+)(?:\s+([\s\S]+))?$/);
        const key = match?.[1] ?? "";
        const rawValue = match?.[2] ?? "";
        const setting = HEADROOM_SETTINGS.find((entry) => entry.key === key);
        if (!setting) {
          const known = HEADROOM_SETTINGS.map((entry) => entry.key).join(", ");
          ctx.ui.notify(key ? `Unknown Headroom setting "${key}". Known keys: ${known}` : `Usage: /headroom set <key> <value>
Known keys: ${known}`, "warn");
        } else {
          try {
            const parsed = parseSettingValue(setting, rawValue);
            await saveHeadroomConfigKey(setting.key, parsed);
            const rendered = typeof parsed === "boolean" ? parsed ? "on" : "off" : String(parsed);
            const overriddenByEnv = settingSource(setting) === "env";
            ctx.ui.notify(`Saved ${setting.key} = ${rendered} to ${HEADROOM_CONFIG_PATH}.
` + (overriddenByEnv ? `Warning: ${setting.env} is set and overrides the YAML value.
` : "") + `Takes effect after /reload-plugins or a new session.`, "info");
          } catch (error) {
            ctx.ui.notify(`Headroom set failed: ${errorMessage(error)}`, "error");
          }
        }
      } else if (action2 === "debug") {
        const logFile = debugSizingLogPath(state);
        ctx.ui.notify(`Headroom debug:
  sizing: ${DEBUG_SIZING ? "ON" : "OFF"}
  log: ${logFile || "(no session ID)"}
  proxy: ${PROXY_URL}
  version: ${state.version || "?"}`, "info");
      } else if (action2 === "start") {
        await ensureProxy(ctx, state, 25000, host);
        ctx.ui.notify(state.proxyReady ? "Headroom proxy ready." : "Headroom proxy is still starting.", "info");
      } else if (action2 === "stop") {
        if (await systemdUnitAvailable())
          await systemdCtl("stop");
        if (state.proxyProcess)
          state.proxyProcess.kill("SIGTERM");
        state.proxyProcess = undefined;
        state.proxyReady = false;
        state.proxyStarting = false;
        ctx.ui.notify("Headroom proxy stopped.", "info");
      } else if (action2 === "restart") {
        const restarted = await restartProxy(ctx, state, host);
        ctx.ui.notify(restarted ? "Headroom proxy restarted." : state.lastError || "Headroom proxy is still starting.", restarted ? "info" : "warn");
      } else if (action2 === "reconnect") {
        const ready = await connectWithRetry(ctx, state);
        ctx.ui.notify(ready ? "Headroom reconnected." : state.lastError || "Headroom still not ready.", ready ? "info" : "warn");
      } else if (action2 === "update") {
        state.lastError = "";
        state.installState = "updating";
        renderWidget(ctx, state, host);
        const clearTimer = setTimeout(() => {
          if (state.installState) {
            state.installState = "";
            renderWidget(ctx, state, host);
          }
        }, UPDATE_AUTO_CLEAR_MS);
        await maintainInstall(ctx, state, true, host);
        if (state.installState === "updating")
          state.installState = "";
        clearTimeout(clearTimer);
        if (state.lastError) {
          ctx.ui.notify(`Headroom update failed: ${state.lastError}`, "error");
        } else {
          const upToDate = state.version && !isNewer(state.latest, state.version);
          ctx.ui.notify(`Headroom ${state.version || "?"}${upToDate ? " (up to date)" : ""}`, "info");
        }
      } else if (action2 === "help" || action2 === "stats") {
        if (action2 === "help") {
          const lines = commandHelpLines();
          ctx.ui.notify(`Headroom commands:
${lines.join(`
`)}`, "info");
        } else {
          await ensureProxy(ctx, state, 3000, host);
          await fetchStats(state, true);
          ctx.ui.notify(commandSummary(state), "info");
        }
      } else {
        const lines = commandHelpLines();
        ctx.ui.notify(`Unknown command "${action2}". Available:
${lines.join(`
`)}`, "info");
      }
      renderWidget(ctx, state, host);
    }
  };
  pi.registerCommand("headroom", headroomCommand);
}

// src/pi-entry.ts
function pi_entry_default(pi) {
  pi[HEADROOM_HOST] = "pi";
  return headroomExtension(pi);
}
export {
  pi_entry_default as default
};
