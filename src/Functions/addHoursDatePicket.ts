/**
 * @param picker iso DATE
 * @param add hours to add
 * @returns iso DATE but in unknown type
 */
export function addHoursDatePicker(picker: string, add: number): string {
  const data = new Date((picker as string) + ':00');
  data.setHours(data.getHours() + 1);
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  console.log('date adition', 1, 'hour ->', data.toISOString());

  return data.toISOString().slice(0, -1);
}

export function dateToPicker(date: Date): string {
  const data = new Date(date);
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  console.log('date to date picker ->', data.toISOString());

  return data.toISOString().slice(0, -8);
}

export function pickerToDate(picker: string, suffix: string = ':00'): Date {
  const data = new Date((picker as string) + suffix);
  //data.setHours(data.getHours());
  //data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
  console.log('date picker', picker, 'to date ->', data);
  return data;
}
