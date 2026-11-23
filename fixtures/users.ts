// Public demo credentials published on https://www.saucedemo.com
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;

export const CUSTOMER = { firstName: 'Taha', lastName: 'Khan', postalCode: '44000' };
