export default function isEmail(email?: string): boolean {
  const pattern: RegExp = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/;

  if (email === undefined) {
    return true;
  }

  if (email.length === 0) {
    return false;
  }

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
    'dvt',
  ];
  const extention = ['com', 'cl', 'es', 'io'];
  const service = inputDomain.split('.')[0];
  const ext = inputDomain.split('.')[1];

  return (
    services.some((value) => value === service) &&
    extention.some((value) => value === ext)
  );
}
