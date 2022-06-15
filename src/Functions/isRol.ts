export interface RolRequest {
  check: boolean;
  rol?: string; //formated in 12345678-9
}

export function isRol(rol: string): RolRequest {
  //social number verification
  const rolChecker = (rol?: string): RolRequest => {
    //undefinded solution
    if (rol === undefined) return { check: false, rol: undefined };

    //check regular expression
    rol = rol?.replace(/\W+/g, '').toUpperCase();
    const re: RegExp = /[0-9]+[0-9kK]{1}/;
    if (!re.test(rol)) return { check: false, rol: undefined };

    //check digit verificator
    const rolDigit = rol.charAt(rol.length - 1);
    const rolBody = rol.substring(0, rol.length - 1);
    console.log('input', rol, 'rol components', rolDigit, rolBody);

    const calculatedDigit: string = calculateVerifyNumber(+rolBody);

    switch (true) {
      case calculatedDigit === rolDigit:
        return { check: true, rol: rolBody + '-' + rolDigit };
      case calculatedDigit === 'K' && rolDigit === '0':
        return { check: true, rol: rolBody + '-' + calculatedDigit };
      default:
        return { check: false, rol: undefined };
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
