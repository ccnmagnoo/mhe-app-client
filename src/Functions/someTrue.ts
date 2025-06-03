export default function someTrue<K extends string, V extends boolean>(
  obj?: Partial<Record<K, V>>
): boolean {
  if (!obj) {
    return false;
  }

  const res = Object.values(obj).some((it) => it === true);

  return res;
}
