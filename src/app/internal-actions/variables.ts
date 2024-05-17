import { cookies } from "next/headers";

type BaseTypesT = string | number | boolean | object | undefined;

export type Variable<T> = {
  get: () => T | undefined;
  set: (value: T | undefined) => void;
  delete: () => void;
};

const types = [
  "string",
  "number",
  "boolean",
  "object",
  "undefined",
  "set",
  "map",
] as const;

type Type = (typeof types)[number];

const getVariable = <T extends BaseTypesT>(name: string): T | undefined => {
  const cookie = cookies().get(`_variable_${name}`);
  const [_, type, value] = cookie?.value.match(/type\-([a-z]+)_(.*)/) ?? [];
  if (!type || !value) return undefined;

  try {
    switch (type as Type) {
      case "string":
        return value as T;
      case "number":
        return Number.parseInt(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "object":
        return JSON.parse(value) as T;
      case "map":
        return new Map(JSON.parse(value)) as T;
      case "set":
        return new Set(JSON.parse(value)) as T;
      case "undefined":
        return undefined;
    }
  } catch {
    return undefined;
  }
};

const setVariable = <T extends BaseTypesT>(name: string, value: T) => {
  const isMap = value instanceof Map;
  const isSet = value instanceof Set;

  const typeStringified: Type = isMap
    ? "map"
    : isSet
      ? "set"
      : (typeof value as Type);

  const valueStringified = value
    ? typeof value === "object"
      ? JSON.stringify(isMap || isSet ? [...value.keys()] : value)
      : value.toString()
    : "";

  cookies().set(
    `_variable_${name}`,
    `type-${typeStringified}_${valueStringified}`,
    {
      httpOnly: true,
    },
  );
};

const deleteVariable = (name: string) => {
  cookies().delete(`_variable_${name}`);
};

export const variable = <T extends BaseTypesT>(name: string): Variable<T> => {
  return {
    get: () => getVariable<T>(name),
    set: (value: T | undefined) =>
      value === undefined ? deleteVariable(name) : setVariable<T>(name, value),
    delete: () => deleteVariable(name),
  };
};
