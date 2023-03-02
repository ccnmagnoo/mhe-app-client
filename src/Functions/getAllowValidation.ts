import { IRoom } from '../Models/Classroom.interface';
/**
 * @param room activity @return Date since when is allowed to validate current user
 */
export default function getAllowValidation(room?: IRoom): Date {
  if (room?.validationSince !== undefined) {
    return room.validationSince;
  } else {
    const defaultTimeValidation =
      room?.placeActivity.date !== undefined
        ? room?.placeActivity.date
        : new Date(); /*day of class 📆*/

    //set current time is allowed for validation
    const earlyValidation = process.env.REACT_APP_HOURS_EARLY_VALIDATION;
    defaultTimeValidation.setHours(
      defaultTimeValidation.getHours() - +(earlyValidation ?? 0)
    );
    return defaultTimeValidation; //set validation allowing time
  }
}
