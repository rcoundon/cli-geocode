/**
 * Returns a typed list of keys for the provided object
 * @param obj the object from which to extract the keys
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectKeys = <Obj extends Record<string, any>>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj) as (keyof Obj)[];
};

/**
 * Returns a type that contains at least the specified properties of the type
 */
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
