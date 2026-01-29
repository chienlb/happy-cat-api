<div align="center">

# 🎓 SPNC API – English Learning Platform

Backend cho nền tảng học tiếng Anh trực tuyến, xây dựng với NestJS + MongoDB + Redis.

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.2-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-6.0+-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 📑 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Docker](#-docker)
- [API & Swagger](#-api--swagger)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Scripts](#-scripts)
- [Bảo mật](#-bảo-mật)
- [Troubleshooting](#-troubleshooting)
- [License & Contributors](#-license--contributors)

---

## 🎯 Tổng quan

**SPNC API** cung cấp RESTful API cho nền tảng học tiếng Anh: quản lý người dùng, bài học, bài tập, nhóm, cuộc thi, thanh toán, thông báo và nhiều hơn nữa. Hỗ trợ JWT, OAuth2 (Google/Facebook), RBAC, rate limiting, caching và hệ thống email/templates đầy đủ.

> Truy cập nhanh tài liệu API: `http://localhost:3000/api-docs` (Swagger)  
> Base URL mặc định: `http://localhost:3000/api/v1`

---

## ✨ Tính năng

- 🔐 Auth & RBAC: JWT Access/Refresh, email verify/reset, Google/Facebook OAuth, phân quyền Admin/Teacher/Student/Parent, quản lý đa thiết bị
- 👥 Người dùng & hồ sơ: CRUD, avatar, badges/achievements, thống kê, soft delete/restore
- 📚 Học tập: Units, Lessons (multimedia), Literatures, Assignments, Submissions, Progresses, Competitions
- 🏫 Nhóm & lớp: Groups (Public/Private), Classes, Group Messages (real-time), Discussions, Invitations
- 💳 Thanh toán: Packages, Subscriptions, Payments (VNPay/Stripe), Purchases, Feature Flags
- 🔔 Khác: Notifications (real-time/email), Feedbacks, Supports, địa danh (Provinces/Districts/Schools), uploads (Cloudflare R2/Images/Cloudinary)

---

## 🛠️ Công nghệ

- Core: NestJS 11, TypeScript 5, Express 5
- Data: MongoDB (Mongoose 11), Redis (ioredis 5)
- Auth/Security: Passport (JWT, Google, Facebook), bcrypt 6, helmet 8, express-rate-limit 8, class-validator/transformer, zod
- Docs: @nestjs/swagger 11, swagger-ui-express 5
- Payments/Storage: VNPay, Stripe, Cloudflare R2/Images, Cloudinary
- Email: nodemailer + handlebars
- Testing: Jest 30, Supertest 7

---

## 🚀 Cài đặt nhanh

```bash
# 1) Clone
git clone <repository-url>
cd spnc-api

# 2) Cài dependencies
pnpm install   # hoặc npm install / yarn install

# 3) Khởi chạy MongoDB & Redis (ví dụ Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest

# 4) Cấu hình .env (xem mẫu phía dưới)

# 5) Chạy app
pnpm start:dev
# Production
pnpm build && pnpm start:prod
```

Ứng dụng chạy tại `http://localhost:3000` (Swagger: `/docs`, API: `/api/v1`).

---

## ⚙️ Cấu hình môi trường

Tạo file `.env` ở thư mục gốc.

**Cơ bản**

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
API_VERSION=v1
```

**Database**

```env
MONGODB_URI=mongodb://localhost:27017/spnc_db
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**JWT**

```env
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_ACCESS_TOKEN_EXPIRATION=1h
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_REFRESH_TOKEN_EXPIRATION=7d
JWT_VERIFICATION_TOKEN_SECRET=your-verification-token-secret
JWT_VERIFICATION_TOKEN_EXPIRATION=5m
```

> Gợi ý tạo secret mạnh:
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**Email**

```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**CORS & Rate limit**

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
CORS_CREDENTIALS=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

**Swagger**

```env
SWAGGER_TITLE=English Learning API
SWAGGER_DESCRIPTION=API documentation for English Learning Platform
SWAGGER_VERSION=1.0.0
SWAGGER_TAG=education,english,learning
SWAGGER_PATH=docs
```

**Thanh toán (tùy chọn)**

```env
# VNPay
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_API_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/v1/payments/vnpay-return

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**OAuth (tùy chọn)**

```env
# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auths/google/callback

# Facebook
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

**Cloudflare & Cloudinary (tùy chọn)**

```env
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_IMAGES_TOKEN=your-images-token
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=your-bucket-name
R2_PUBLIC_BASE=https://your-domain.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=english_learning_uploads
```

**Khác (tùy chọn)**

```env
BODY_LIMIT_JSON=1mb
BODY_LIMIT_URLENCODED=1mb
TRUST_PROXY=false
LOG_LEVEL=debug
OPEN_ROUTER_API=your-open-router-api-key
```

---

## 🐳 Docker

Chạy API bằng Docker. **Cần file `.env`** ở thư mục gốc (xem [Cấu hình môi trường](#-cấu-hình-môi-trường)); file `.env` không được đưa vào image (bảo mật).

**MongoDB và Redis** phải chạy sẵn (trên host hoặc container khác). Trong `.env`, `MONGODB_URI` và `REDIS_URL` cần trỏ đúng:

- Chạy Docker trên **Windows/macOS**: dùng `host.docker.internal` thay cho `localhost`, ví dụ:
  - `MONGODB_URI=mongodb://host.docker.internal:27017/spnc_db`
  - `REDIS_URL=redis://host.docker.internal:6379`
- Chạy Docker trên **Linux**: dùng `172.17.0.1` hoặc IP của host thay cho `localhost`.

### Build image

```bash
docker build -t spnc-api .
```

### Chạy container

**Cách 1: `docker run` + `--env-file`**

```bash
docker run --env-file .env -p 3000:3000 spnc-api
```

**Cách 2: Docker Compose**

```bash
docker compose up
```

Compose đọc `docker-compose.yml` và dùng `env_file: .env`. API lắng nghe cổng `3000`.

### Lưu ý

- `NODE_ENV` trong container mặc định là `production` (trong Dockerfile). Nếu `.env` ghi đè, giá trị phải là `development`, `production` hoặc `test`.
- Không commit `.env`; dùng `--env-file` hoặc biến môi trường ở môi trường deploy (K8s, ECS, …).

---

## 📚 API & Swagger

- Swagger UI: `http://localhost:3000/api-docs`
- Base URL: `http://localhost:3000/api/v1`
- Auth header: `Authorization: Bearer <access-token>`

**Response mặc định**

```json
{
  "success": true,
  "message": "Thành công",
  "data": {},
  "statusCode": 200
}
```

**Ví dụ**

```bash
# Đăng ký
curl -X POST http://localhost:3000/api/v1/auths/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Nguyen Van A","username":"nguyenvana","email":"nguyenvana@gmail.com","password":"SecurePassword123!","role":"student"}'

# Đăng nhập
curl -X POST http://localhost:3000/api/v1/auths/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenvana@gmail.com","password":"SecurePassword123!"}'
```

---

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── common/              # Decorators, guards, filters, utils, response
│   ├── configs/             # Database, cache, env, mail
│   ├── modules/             # Tất cả feature modules (auths, users, lessons,...)
│   └── templates/           # Email templates (Handlebars)
├── app.controller.ts        # Root controller
├── app.module.ts            # Root module
├── app.service.ts           # Root service
└── main.ts                  # Entry point
```

Module chuẩn:

```
module-name/
├── module-name.controller.ts    # HTTP endpoints
├── module-name.service.ts       # Business logic
├── module-name.module.ts        # Module wiring
├── dto/                         # DTOs
└── schema/                      # Mongoose schemas
```

---

## 🔧 Scripts

```bash
# Development
pnpm start:dev
pnpm start:debug

# Production
pnpm build
pnpm start:prod

# Code Quality
pnpm format
pnpm lint

# Testing
pnpm test
pnpm test:watch
pnpm test:cov
pnpm test:e2e
```

---

## 🔒 Bảo mật

- Helmet, rate limiting, CORS, input validation
- Bcrypt hash mật khẩu, JWT bảo vệ routes
- Không commit `.env`; dùng secret mạnh; bật HTTPS ở production
- Thường xuyên cập nhật dependencies

---

## 🐛 Troubleshooting

- **MongoDB**: `mongosh mongodb://localhost:27017`
- **Redis**: `redis-cli ping`
- **Port 3000 bận**: `netstat -ano | findstr :3000` (Windows) hoặc `lsof -i :3000` (macOS/Linux)
- **Email không gửi**: kiểm tra EMAIL_USER/PASS, dùng App Password với Gmail

---

## 📝 License & Contributors

- License: **UNLICENSED** (private)
- Contributors: **SPNC Development Team**

<div align="center">

Made with ❤️ by SPNC Development Team

</div>
