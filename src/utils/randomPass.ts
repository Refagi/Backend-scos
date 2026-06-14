import crypto from 'crypto';

export function generateRandomPassword(length: number = 12): string {
  if (length < 12) {
    throw new Error('Password length must be at least 12 characters for security');
  }

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '@#$%^&*()_+-=[]{}|;:,.<>?';

  const getRandomChar = (charSet: string): string => {
    const randomIndex = crypto.randomInt(0, charSet.length);
    return charSet.charAt(randomIndex);
  };

  let password = '';
  password += getRandomChar(lowercase);
  password += getRandomChar(uppercase);
  password += getRandomChar(numbers);
  password += getRandomChar(specialChars);

  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(allChars);
  }

  const shuffleString = (str: string): string => {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      const temp = arr[i];
      const swap = arr[j];

      if(temp === undefined || swap === undefined) {
        throw new Error('Failed to shuffle password characters');
      }
        arr[i] = swap;
        arr[j] = temp;
    }
    
    return arr.join('');
  };

  return shuffleString(password);
}