import emailValidator from "email-validator";

export function required(value) {
  return !value ? "Required" : null;
}

export function email(value) {
  return !emailValidator.validate(value) ? "Invalid!" : null;
}
