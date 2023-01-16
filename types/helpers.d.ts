type DashToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${Capitalize<T>}${Capitalize<DashToCamelCase<U>>}`
  : S;
type Spilt<S extends string> = S extends `${infer T}/${infer U}`
  ? `${T}::${Capitalize<U>}`
  : S;
export type Filter<T, P> = T extends `${P}:${infer D extends string}`
  ? D
  : never;

export type Mapped<K> = {
  [P in K]: Capitalize<Spilt<DashToCamelCase<P>>>;
};

type ValueOf<T> = T[keyof T];

type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

export type FilterObject<T, P, R> = {
  [K in R]: T[`${P}:${K}`];
};

export type ReFilterObject<T, P, R> = {
  [K in keyof R]: T[`${P}:${R[K]}`];
};

export type CamelizeName<T> = Capitalize<Spilt<DashToCamelCase<T>>>;
