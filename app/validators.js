import moment from 'moment';

export const required = (value, values, field) => {
  return (value ? undefined : 'Required');
}

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const maxLength15 = maxLength(15);

export const minLength = min => (value, values, field) => {
  return value && value.length < min ? `Must be ${min} characters or more` : undefined;
}

export const minLength2 = minLength(2);

export const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;

export const minValue18 = minValue(18);

export const tooOld = value =>
  value && value > 65 ? 'You might be too old for this' : undefined;

export const aol = value =>
  value && /.+@aol\.com/.test(value)
    ? 'Really? You still use AOL for your email?'
    : undefined;

export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined;

export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value.replace(/[()\s-]/g,''))
    ? 'Invalid phone number, must be 10 digits'
    : undefined;

export const playerBirthDate = (min, max) => value => {
  if (value) {
    let v = moment(value);
    if (v < min || v > max) {
      return 'This birthdate does not fall within our current age groups';
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const fullName = value =>
  value && !/^[a-z]+[\s]+[a-z]+$/i.test(value)
    ? 'Please enter a full name (first and last)'
    : undefined