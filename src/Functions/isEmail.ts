export default function isEmail(email: string): boolean {
  const pattern: RegExp = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/;

  const isDomain = isValidDomain(email.split('@')[1]);

  return pattern.test(email) && isDomain;
}

function isValidDomain(inputDomain: string): boolean {
  const services = [
    'gmail',
    'hotmail',
    'live',
    'msn',
    'yahoo',
    'outlook',
    'minenergia',
    'prodemu',
    'prodemu-ext',
  ];
  const extention = ['com', 'cl', 'es', 'io'];
  const service = inputDomain.split('.')[0];
  const ext = inputDomain.split('.')[1];

  return (
    services.some((value) => value === service) &&
    extention.some((value) => value === ext)
  );
}
