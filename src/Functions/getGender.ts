import { wierdFemaleNames } from '../Assets/weirdFemaleNames';
import { Gender } from '../Models/Person.Interface';
import { capitalWord } from './capitalWord';

export function getGender(name: string) {
  const firstName = name.toLocaleLowerCase();
  const firstWord = firstName.split(' ')[0];
  const lastChar = firstWord.split('').pop() ?? '0';

  if (lastChar === 'a') {
    return Gender.female;
  } else if (wierdFemaleNames.indexOf(capitalWord(firstWord)) !== -1) {
    //if name is not in database of odd woman name
    return Gender.female;
  } else {
    return Gender.male;
  }
}
