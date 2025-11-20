function restVacancies(amount: number | undefined, toRest: number | undefined) {
  if (amount === undefined || toRest === undefined) {
    return 0;
  }
  const op = amount - toRest;

  if (op <= 0) {
    return 0;
  }
  return op;
}

export default restVacancies;
