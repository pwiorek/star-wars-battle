export interface Resources<T> {
  resource1: T;
  resource2: T;
}

export interface PartialResources<T> {
  resource1: Partial<T>;
  resource2: Partial<T>;
}
