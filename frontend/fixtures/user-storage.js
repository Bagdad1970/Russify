import { writeFileSync, readFileSync, existsSync } from 'fs';

const FILE_PATH = './fixtures/created-user.json';

export function saveUser(user) {
  writeFileSync(FILE_PATH, JSON.stringify(user, null, 2));
}

export function loadUser() {
  if (!existsSync(FILE_PATH)) {
    throw new Error('Пользователь не найден! Сначала запусти тест регистрации.');
  }
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
}