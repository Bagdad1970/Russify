export const VALID_USER = {
  email: 'test@mail.com',
  password: '123456',
};

export function generateUser() {
  const ts = Date.now();
  return {
    name: `User${ts}`,
    email: `user${ts}@mail.com`,
    password: 'Test1234!',
  };
}