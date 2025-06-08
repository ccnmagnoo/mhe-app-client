export type Nullable<T> = { [PARAM in keyof T]: T[PARAM] | null };
