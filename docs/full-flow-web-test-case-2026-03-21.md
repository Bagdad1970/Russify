# Full Flow WEB Test Case

Дата прогона: `2026-03-21`  
Контур: `Russify-integration`  
Проверяемый стек:
- `frontend` -> `http://localhost:5173`
- `backend` -> `http://localhost:8080`
- `postgres` -> `localhost:15532`
- `minio` -> `http://localhost:9000`

## Цель
Проверить полный пользовательский WEB flow:
- гость открывает WEB-приложение и видит публичный контент;
- обычный пользователь входит в систему;
- пользователь загружает музыку из `./music`;
- пользователь создаёт собственный плейлист и добавляет в него трек;
- администратор входит в админку и выполняет CRUD на справочнике;
- администратор модерирует пользовательский альбом;
- гость находит опубликованный альбом и воспроизводит трек.

## Тестовые данные
- Музыкальный файл: `/Users/darius/Downloads/kubsu_app/music/自然 (Shizen).mp3`
- Последний подтверждённый прогон:
  - album: `Smoke Flow Album 1774055893940`
  - track: `Smoke Flow Track 1774055893940`
  - playlist: `Smoke Flow Playlist 1774055893940`
  - genre: `smoke-genre-1774055893940`

## Предусловия
1. В `Russify-integration` выполнен `docker compose up -d --build`.
2. Контейнеры `backend`, `frontend`, `postgres`, `minio` находятся в статусе `Up`.
3. Для пользовательского и админского сценария созданы тестовые аккаунты.
4. Для админского сценария тестовому пользователю назначена роль `ADMIN`.

## Тест-кейсы

### TC-01. Гостевой вход на главную страницу
Шаги:
1. Открыть `http://localhost:5173`.
2. Дождаться рендера главного баннера и блока музыкальных подборок.
3. Проверить наличие публичных плиток плейлистов.

Ожидаемый результат:
- главная страница открывается без ошибки;
- отображается публичный контент;
- доступны плитки публичных подборок.

Фактический результат:
- `PASS`
- в последнем прогоне отображено `4` публичные плитки.

### TC-02. Логин обычного пользователя
Шаги:
1. Открыть `/settings`.
2. Нажать `Войти в аккаунт`.
3. Ввести email и пароль тестового пользователя.
4. Подтвердить логин.

Ожидаемый результат:
- пользователь успешно входит;
- в настройках отображается кнопка `Выйти`.

Фактический результат:
- `PASS`

### TC-03. Загрузка пользовательского альбома с музыкой из `./music`
Шаги:
1. Под авторизованным пользователем открыть `/profile`.
2. Нажать кнопку добавления альбома.
3. Ввести название альбома.
4. Добавить трек.
5. Ввести название трека.
6. Выбрать файл `/Users/darius/Downloads/kubsu_app/music/自然 (Shizen).mp3`.
7. Нажать `Загрузить альбом`.

Ожидаемый результат:
- backend принимает multipart-запрос;
- альбом создаётся в статусе `IN_PROGRESS`;
- трек сохраняется;
- пользователю показывается подтверждение отправки на модерацию.

Фактический результат:
- `PASS`
- UI показал alert `Альбом отправлен на модерацию`.

### TC-04. Создание пользовательского плейлиста и добавление трека
Шаги:
1. Под авторизованным пользователем открыть `/favorites`.
2. Перейти в категорию `Плейлисты`.
3. Нажать карточку создания плейлиста.
4. Указать имя плейлиста и сохранить.
5. Открыть созданный плейлист.
6. Перейти в режим добавления треков.
7. Добавить доступный трек.

Ожидаемый результат:
- плейлист создаётся без ошибки;
- открывается модалка плейлиста;
- список доступных для добавления треков не пуст;
- после добавления трек появляется в плейлисте.

Фактический результат:
- `PASS`
- в последнем прогоне в плейлист был добавлен `1` трек.
- проверка API подтвердила сохранение:
  - `GET /api/playlists/5/tracks`
  - результат: плейлист содержит трек `1 Goyard`.

### TC-05. Вход администратора в WEB-админку
Шаги:
1. Открыть `http://localhost:5173/admin`.
2. Ввести email и пароль тестового администратора.
3. Подтвердить логин.

Ожидаемый результат:
- происходит реальная аутентификация;
- выполняется переход на `/admin/dashboard`.

Фактический результат:
- `PASS`

### TC-06. CRUD администратора на жанрах
Шаги:
1. На `/admin/dashboard` открыть раздел `Жанры`.
2. Нажать `+ Добавить`.
3. Ввести уникальное имя жанра.
4. Нажать `Сохранить`.

Ожидаемый результат:
- backend создаёт жанр;
- UI подтверждает успешное создание.

Фактический результат:
- `PASS`
- UI показал alert `Запись создана`.

### TC-07. Модерация пользовательского альбома администратором
Шаги:
1. Открыть `/moderation`.
2. Найти загруженный пользовательский альбом по имени.
3. Открыть карточку альбома.
4. Нажать `Одобрить`.

Ожидаемый результат:
- альбом переводится в `APPROVED`;
- после этого он становится доступен в публичном каталоге.

Фактический результат:
- `PASS`

### TC-08. Гость находит опубликованный альбом и воспроизводит трек
Шаги:
1. Под гостем открыть главную страницу.
2. Ввести в поиск название модерированного альбома.
3. Открыть найденный альбом.
4. Нажать play на треке.

Ожидаемый результат:
- альбом доступен после одобрения;
- фронтенд делает реальный запрос к аудиофайлу;
- воспроизведение не падает с alert-ошибкой.

Фактический результат:
- `PASS`
- в последнем прогоне подтверждён запрос к `/music/...`.
- alert `Не удалось воспроизвести трек` больше не появляется.
- объект в MinIO после фикса хранится корректно:
  - `Content-Length: 2260673`
  - `Content-Type: audio/mpeg`

## Итог прогона
Все целевые сценарии полного WEB flow в этом проходе завершились успешно:
- `guest_home`
- `user_login_via_ui`
- `user_album_upload`
- `user_playlist_create_and_fill`
- `admin_login_via_ui`
- `admin_genre_crud`
- `admin_album_moderation`
- `guest_album_discovery_and_playback`

## Проблемы, найденные и исправленные в этом проходе

### 1. `/favorites` генерировал бесконечный цикл фоновых загрузок
Симптом:
- Playwright зависал на `/favorites` до таймаута `networkidle`.

Причина:
- в [`frontend/src/pages/FavoritesPage.tsx`](/Users/darius/Downloads/kubsu_app/Russify-integration/frontend/src/pages/FavoritesPage.tsx) экземпляры `FavoriteManager`, `FileManager`, `PlaylistManager`, `AlbumManager` создавались внутри компонента;
- `loadAllData` зависел от этих новых объектов и пересоздавался на каждом рендере;
- `useEffect` повторно запускал загрузку после каждого `setState`.

Фикс:
- менеджеры вынесены на module level;
- `loadAllData` стабилизирован.

### 2. Пользовательский плейлист создавался, но не наполнялся треками
Симптом:
- модалка плейлиста переходила в режим добавления, но список доступных треков оставался пустым.

Причина:
- [`frontend/src/api/PlaylistManager.ts`](/Users/darius/Downloads/kubsu_app/Russify-integration/frontend/src/api/PlaylistManager.ts) ожидал, что `GET /api/playlists/{id}/tracks` вернёт `Track[]`;
- backend реально возвращает `PlaylistWithTracks`;
- фронтенд получал объект вместо массива, после чего режим добавления ломался.

Фикс:
- клиент приведён к фактическому контракту backend;
- `findTracksByPlaylistId` теперь извлекает `response.data.tracks`.

### 3. Аудиофайл после загрузки в MinIO оставался пустым
Симптом:
- после модерации альбом был виден, но play вызывал ошибку воспроизведения;
- в MinIO лежал объект с `Content-Length: 0`.

Причина:
- в [`RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/FileServiceImpl.java`](/Users/darius/Downloads/kubsu_app/Russify-integration/RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/FileServiceImpl.java) один и тот же `InputStream` раньше использовался и для хеширования, и для загрузки;
- дополнительно hash-based deduplication не перезатирала уже существующий битый объект с тем же именем.

Фикс:
- загрузка переведена на `byte[]` с отдельными `ByteArrayInputStream` для хеша и upload;
- проверка существующего объекта изменена: если размер объекта отсутствует или не совпадает с реальным размером файла, объект перезаливается.

### 4. Создание плейлиста падало, если обложка не была выбрана
Симптом:
- `POST /api/playlists` завершался `500`.

Причина:
- backend без проверки вызывал `request.getCoverFile().isEmpty()`.

Фикс:
- в [`RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/PlaylistServiceImpl.java`](/Users/darius/Downloads/kubsu_app/Russify-integration/RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/PlaylistServiceImpl.java) добавлена проверка `request.getCoverFile() != null`.

### 5. Владелец плейлиста раньше зависел от `userId` в request
Симптом:
- поток создания плейлиста не соответствовал доменному правилу владения по авторизации.

Причина:
- playlist create backend-flow опирался на тело запроса, а не на текущего пользователя.

Фикс:
- [`RussifyService/src/main/java/ru/russify/russifyservice/controller/PlaylistController.java`](/Users/darius/Downloads/kubsu_app/Russify-integration/RussifyService/src/main/java/ru/russify/russifyservice/controller/PlaylistController.java) и [`RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/PlaylistServiceImpl.java`](/Users/darius/Downloads/kubsu_app/Russify-integration/RussifyService/src/main/java/ru/russify/russifyservice/service/implementation/PlaylistServiceImpl.java) переведены на создание плейлиста от `authentication.getName()`.

## Остаточные риски
- В [`RussifyService/src/main/resources/db/changelog/init-data.xml`](/Users/darius/Downloads/kubsu_app/Russify-integration/RussifyService/src/main/resources/db/changelog/init-data.xml) часть сидовых пользователей всё ещё задана с plain-text паролями, тогда как runtime-аутентификация использует bcrypt. Это не ломало текущий smoke-flow, потому что проверка шла на временных тестовых аккаунтах, но для воспроизводимого входа под seed-пользователями это риск.

## Команды верификации
```bash
cd /Users/darius/Downloads/kubsu_app/Russify-integration
docker compose up -d --build
curl -I http://localhost:5173
curl -I http://localhost:8080/swagger-ui/index.html
```

Дополнительная техническая проверка аудио:
```bash
curl -I http://localhost:9000/music/e7af124ad79843b86528007e38412cfb2bff426ea966b5a0083b28c5a9bca091.mp3
```
