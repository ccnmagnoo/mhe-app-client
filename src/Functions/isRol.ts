export function isRol(rol: string): boolean {
  //social number verification
  const rolChecker = (rol?: string): boolean => {
    //undefinded solution
    if (rol === undefined) {
      return false;
    }

    rol = rol?.replace('‐', '-');
    rol = rol?.split('.').join('');
    const re: RegExp = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;

    if (!re.test(rol)) {
      return false;
    } else {
      const rolSplited = rol.split('-');
      let rolDigit = rolSplited[1];
      const rolBody = rolSplited[0];

      if (rolDigit === 'K') {
        rolDigit = 'k';
      }

      return rolDigitGen(+rolBody) === rolDigit;
    }
  };

  const rolDigitGen = (rol: number): string => {
    //generador de verificador de código calculado
    let M = 0,
      S = 1;

    for (; rol; rol = Math.floor(rol / 10)) {
      S = (S + (rol % 10) * (9 - (M++ % 6))) % 11;
    }

    return S.toString() ? (S - 1).toString() : 'k';
  };

  return rolChecker(rol);
}
