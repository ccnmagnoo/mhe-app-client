import { where } from 'firebase/firestore';
import driver from '../Database/driver';
import { IBeneficiary, iBeneficiaryConverter } from '../Models/Beneficiary.interface';
import { RolRequest } from './isRol';
import { dbKey } from '../Models/databaseKeys';
import { dateLimit } from '../Config/credential';

/**
 * @function checkBenefit got is she got old active benefits
 */
async function checkBenefit(rolRequest?: RolRequest) {
  try {
    //firestore🔥🔥🔥 fetching al RUT benefits ins register

    const benefits = (await driver.get<IBeneficiary>(
      undefined,
      'collection',
      dbKey.cvn,
      iBeneficiaryConverter,
      where('rut', '==', rolRequest?.rol),
      where('dateSign', '>=', dateLimit)
    )) as IBeneficiary[];

    //filter all benefits after date limit (now 31-01-2017)

    console.log('benefits after date limit', benefits.length);

    //true: failure, had benefits,  false:go go go, this person is ok
    return benefits.length > 0 ? true : false;
  } catch (error) {
    console.log('fetch checker rut', error);
    return true;
  }
}

export default checkBenefit;
