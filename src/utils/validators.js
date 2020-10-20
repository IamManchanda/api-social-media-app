module.exports.validateRegisterOptions = (
  email,
  username,
  password,
  confirmPassword,
) => {
  const errors = {};

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regex)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password must match Confirm Password";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
