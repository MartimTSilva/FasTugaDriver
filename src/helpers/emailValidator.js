export function emailValidator(email) {
  if (!email) 
    return "Email can't be empty";

  const re = /\S+@\S+\.\S+/;
  if (!re.test(email)) 
    return "Invalid email address";
  
  return "";
}
