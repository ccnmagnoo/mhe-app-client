/**
 * @param input iso DATE
 * @param add hours to add
 * @returns iso DATE but in unknown type
 */
export function addHoursDatePicker(input: string, add: number): string {
  const data = new Date((input as string) + ':00');
  data.setHours(data.getHours() + 1);
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  console.log('date adition', 1, 'hour ->', data.toISOString());

  return data.toISOString().slice(0, -1);
}

export function dateToDatePicker(input: Date): string {
  const data = new Date(input);
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  console.log('date to date picker ->', data.toISOString());

  return data.toISOString().slice(0, -8);
}

export function datePicketToDate(input: string): Date {
  const data = new Date((input as string) + ':00');
  data.setHours(data.getHours());
  data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
  console.log('date picker to date ->', data);
  return data;
}
