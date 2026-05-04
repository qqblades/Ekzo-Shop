# Ekzo-Shop
IdealShop for ppl
created by NS BA
# 🍍 ExoticFruit Shop

Учебный Fullstack-проект интернет-магазина экзотических фруктов.  
Разработан в рамках совместного обучения для отработки навыков командного взаимодействия, Docker-ориентированной разработки и построения REST API.

---

## 🛠 Технологический стек

- **Backend:** Python 3.11, Django, Django REST Framework (DRF)
- **Frontend:** React / Vue.js (в процессе выбора)
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose
- **API Docs:** Swagger / Redoc

---

## 🚀 Как запустить проект (через Docker)

### 1. Клонируйте репозиторий
```bash
git clone https://github.com
cd exotic-fruit-shop
```

### 2. Настройте переменные окружения
Создайте файл `.env` в корневой папке и добавьте настройки (пример):
```env
DEBUG=1
SECRET_KEY=your_secret_key_here
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
```

### 3. Соберите и запустите контейнеры
```bash
docker-compose up -d --build
```

### 4. Примените миграции и создайте админа
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```
Проект будет доступен по адресу: [http://localhost:8000](http://localhost:8000)

---

## 🏗 Основной функционал (в разработке)

- [ ] **Каталог товаров:** Вывод списка фруктов с фильтрацией по категориям.
- [ ] **Поиск:** Поиск по названию и описанию.
- [ ] **Корзина:** Добавление товаров, изменение количества.
- [ ] **Профили:** Авторизация через JWT (регистрация/логин).
- [ ] **Админка:** Управление товарами и заказами.

---

## 👨‍💻 Команда проекта

*   **Разработчик A** (@ваш_ник_1) — Backend / DevOps
*   **Разработчик Б** (@ваш_ник_2) — Frontend / UI-Design

---

## 📝 Правила работы (Git Flow)

1. Все новые фичи делаются в отдельных ветках: `feature/name-of-feature`.
2. После завершения задачи создается **Pull Request** на проверку коллеге.
3. Ветка `main` всегда должна содержать стабильный, рабочий код.
