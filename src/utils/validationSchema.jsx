export const emailSchema = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  }
};

export const passwordSchema = {
  required: 'Password is required',
  // minLength: { value: 8, message: 'Password must be at least 8 characters' },
  validate: {
    noSpaces: (value) => !/\s/.test(value) || 'Password cannot contain spaces'
    // hasUpperCase: (value) => /[A-Z]/.test(value) || 'Password must have at least one uppercase letter',
    // hasNumber: (value) => /[0-9]/.test(value) || 'Password must have at least one number',
    // hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must have at least one special character'
  }
};

export const userNameSchema = {
  required: 'Username is required',
  pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, and underscores' },
  validate: {
    trim: (value) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'Username cannot be empty or contain only spaces';
    }
  },
  onBlur: (e) => {
    e.target.value = e.target.value.trim();
  }
};

export const userNameOrEmailSchema = {
  required: 'Username or Email is required',
  validate: (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return 'Field cannot be empty or contain only spaces';
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/; // Allows letters, numbers, underscores, and hyphens
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email format

    if (!usernameRegex.test(trimmedValue) && !emailRegex.test(trimmedValue)) {
      return 'Enter a valid username or email';
    }

    return true;
  },
  onBlur: (e) => {
    e.target.value = e.target.value.trim();
  }
};

export const firstNameSchema = {
  required: 'First Name is required',
  pattern: { value: /^[a-zA-Z0-9\s]+$/, message: 'First Name can only contain letters, numbers, and spaces' },
  validate: {
    trim: (value) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'First Name cannot be empty or contain only spaces';
    }
  },
  onBlur: (e) => {
    e.target.value = e.target.value.trim();
  }
};

export const lastNameSchema = {
  // required: 'Last name is required',
  pattern: { value: /^[a-zA-Z0-9\s]+$/, message: 'First Name can only contain letters, numbers, and spaces' },
  validate: {
    trim: (value) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'First Name cannot be empty or contain only spaces';
    }
  },
  onBlur: (e) => {
    e.target.value = e.target.value.trim();
  }
};

export const contactSchema = {
  required: 'Contact number is required',
  pattern: { value: /^[0-9()\-\.]{7,15}$/, message: 'Invalid contact number' }
};

export const otpSchema = {
  required: 'OTP is required',
  minLength: { value: 6, message: 'OTP must be exactly 6 characters' }
};

export const featureNameSchema = {
  required: 'Feature name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid feature name' }
};

export const phoneSchema = {
  required: 'Phone number is required'
  // pattern: { value: /^[0-9()-.\s]{7,15}$/, message: 'Invalid phone number' }
};
export const dateSchema = {
  required: 'Date is required'
  // pattern: { value: /^[0-9()-.\s]{7,15}$/, message: 'Invalid phone number' }
};
