const validate = (values: { [key in string]: string | number  }) => {
  const errors: { [key in string]: string } = {};
  Object.keys(values)?.forEach((item:string) => {

    // Check empty inputs
    if (values[item] === null) {
      errors[item] = `${item} is required`;
    }

    // Validate email
    if (
      item?.includes("email") &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values[item] as string)
    ) {
      errors[item] = "Invalid email address";
    }

    // Validate phone number
    // if (item?.includes("phone") && !/^\d{11}$/i.test(values[item])) {
    //   errors[item] = "Invalid phone number format";
    // }
    if (
      item.includes('username') &&
      (isNaN(values[item] as number) || (values[item] as string).length < 6)
    ) {
      errors[item] = 'Invalid phone number format';
    }

    // Validate password || confirm password
    if (item?.includes("password") && (values[item] as string)?.length < 6) {
      errors[item] = "Password must be at least 6 characters long";
    }
  });

  return errors;
};

// required field validation
export const required =
  (name = "This") =>
  (value: string | number) =>
    value ? undefined : `${name} field is required`;

//  Must be a number validation
export const mustBeNumber = (value : number) =>
  isNaN(value) ? "Must be a number" : undefined;

//  Min value validation
export const minValue = (min: number) => (value: number) =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;

export const passwordMatch = (value:string, allValues: {[key in string] : string}) => {
  // console.log(value, "vlsdem")
  return value === allValues?.password ? undefined : "Passwords do not match";
};

export const composeValidators =
  (...validators: any) =>
  (value:any, allValues:any) =>
    validators.reduce(
      (error:any, validator:any) => error || validator(value, allValues),
      undefined
    );

export default validate;
