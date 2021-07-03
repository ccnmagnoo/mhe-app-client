export function capitalWord(s: string): string {
  const list = s.split(' ');
  const res = list.map((w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return res.join(' ');
}
