//Transforms the first letter of a string into upper case letter
export function capitalize(str) {
  if (str == null) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const plateRegExp = /^(?=.{8}$)(?![\d-]+$|[a-z-]+$)[^\W_]+(?:-[^\W_]+)+$/;

export { phoneRegExp, plateRegExp };
