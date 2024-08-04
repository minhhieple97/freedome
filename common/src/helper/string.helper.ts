export const isValidBase64 = (str: string): boolean => {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) {
    return false;
  }
  if (str.length % 4 !== 0) {
    return false;
  }
  const paddingChar = str.indexOf('=');
  if (paddingChar > -1) {
    return paddingChar === str.length - 1 || paddingChar === str.length - 2;
  }

  return true;
};
