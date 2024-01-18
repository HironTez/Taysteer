import { cookies } from "next/headers";

type BaseTypesStringsT =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "undefined";
type BaseTypesT = string | number | boolean | object | undefined;

const baseTypes: BaseTypesT[] = [
  "string",
  "number",
  "boolean",
  "object",
  "undefined",
];

const getVariable = <T extends BaseTypesT>(name: string): T | undefined => {
  const cookie = cookies().get(`_variable_${name}`);
  const [_, type, value] = cookie?.value.match(/type\-([a-z]+)_(.*)/) ?? [
    undefined,
    undefined,
    undefined,
  ];

  if (!value || baseTypes.includes(value)) return undefined;
  try {
    switch (type as BaseTypesStringsT) {
      case "string":
        return value as T;
      case "number":
        return Number.parseInt(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "object":
        return JSON.parse(value) as T;
      case "undefined":
        return undefined;
    }
  } catch {
    return undefined;
  }
};

const setVariable = <T extends BaseTypesT>(name: string, value: T) => {
  const valueStringified = value
    ? typeof value === "object"
      ? JSON.stringify(value)
      : value.toString()
    : "";
  cookies().set(
    `_variable_${name}`,
    `type-${typeof value}_${valueStringified}`,
    {
      httpOnly: true,
    },
  );
};

export const variable = <T extends BaseTypesT>(name: string) => {
  return {
    get: () => getVariable<T>(name),
    set: (value: T) => setVariable<T>(name, value),
  };
};
