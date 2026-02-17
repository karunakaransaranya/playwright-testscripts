export const PASSWORD = 'secret_sauce';

export const VALID_USERS = [
  { username: 'standard_user', description: 'Standard user' },
  { username: 'problem_user', description: 'Problem user' },
  { username: 'performance_glitch_user', description: 'Performance-glitch user' },
  { username: 'error_user', description: 'Error user' },
  { username: 'visual_user', description: 'Visual user' },
];

export const ERROR_MESSAGES = {
  usernameRequired: 'Username is required',
  passwordRequired: 'Password is required',
  userMismatch: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'locked out',
};

