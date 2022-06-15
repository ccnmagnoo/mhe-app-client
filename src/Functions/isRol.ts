export function isRol(rol: string): boolean {
  //social number verification
  const rolChecker = (rol?: string): boolean => {
    //undefinded solution
    if (rol === undefined) return false;

    //check regular expression
    rol = rol?.replace(/\W+/g, '').toUpperCase();
    const re: RegExp = /[0-9]+[0-9kK]{1}/;
    if (!re.test(rol)) return false;

    //check digit verificator
    const rolDigit = rol.charAt(rol.length - 1);
    const rolBody = rol.substring(0, rol.length - 1);
    console.log('input', rol, 'rol components', rolDigit, rolBody);

    const calculatedDigit: string = calculateVerifyNumber(+rolBody);

    switch (true) {
      case calculatedDigit === rolDigit:
        return true;
      case calculatedDigit === 'K' && rolDigit === '0':
        return true;
      default:
        return false;
    }
  };

  const calculateVerifyNumber = (rol: number): string => {
    //generador de verificador de código calculado
    let M = 0,
      S = 1;

    for (; rol; rol = Math.floor(rol / 10)) {
      S = (S + (rol % 10) * (9 - (M++ % 6))) % 11;
    }

    return S ? (S - 1).toString() : 'K';
  };

  return rolChecker(rol);
}
