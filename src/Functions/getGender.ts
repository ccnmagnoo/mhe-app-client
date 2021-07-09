import { wierdFemaleNames } from '../Assets/weirdFemaleNames';
import { Gender } from '../Models/Person.Interface';
import { capitalWord } from './capitalWord';

export function getGender(name: string) {
  const firstName = name.toLocaleLowerCase();
  const splitName = firstName.split(' ')[0].split('').pop() ?? '0';

  if (splitName === 'a') {
    return Gender.female;
  } else if (wierdFemaleNames.indexOf(capitalWord(splitName)) !== -1) {
    return Gender.female;
  } else {
    return Gender.male;
  }
}
