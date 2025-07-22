# 📘 EDA-Demo – Hướng Dẫn Chạy Hệ Thống

Hệ thống EDA-Demo là một ví dụ áp dụng kiến trúc **Event-Driven Microservices** sử dụng **Kafka** làm message broker và **Fastify** làm framework backend. Các thành phần backend giao tiếp thông qua Kafka, frontend sử dụng **Next.js**.

---

## ⚙️ Yêu Cầu Hệ Thống

- Docker & Docker Compose
- Node.js 18+ (nếu phát triển frontend)
- Port mặc định:
  - `3000`: Gateway & Frontend
  - `8088`: Kafka UI

---

## 🚀 Cách Chạy Nhanh Toàn Bộ Hệ Thống

### 1. Clone và cấu hình

```bash
git clone <repo>
cd <repo>
```

### 2. Khởi động bằng Docker Compose

```bash
docker-compose up --build
```

> 🔁 Hệ thống sẽ tự build và khởi động tất cả các service:
>
> - user-service
> - registration-service
> - event-service
> - notification-service
> - auditlog-service
> - gateway
> - kafka, postgres, mongo, kafka-ui

### 3. Chạy Frontend (Next.js)

Nếu bạn chạy frontend độc lập để phát triển UI:

```bash
cd frontend
npm install --legacy-peer-deps      
npm run dev        
```

> Frontend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### 4. Truy cập hệ thống

- Frontend & API Gateway: [http://localhost:3000](http://localhost:3000)
- Kafka UI: [http://localhost:8088](http://localhost:8088)

---

## ✅ Các Service Chính

| Service                | Vai trò chính                              |
| ---------------------- | ------------------------------------------ |
| `gateway`              | Nhận request từ frontend, định tuyến API   |
| `user-service`         | Đăng ký, đăng nhập, phát event Kafka       |
| `registration-service` | Xử lý đăng ký tham gia sự kiện             |
| `event-service`        | Quản lý dữ liệu sự kiện, cập nhật số lượng |
| `notification-service` | Gửi email khi đăng ký thành công           |
| `auditlog-service`     | Lưu toàn bộ sự kiện vào MongoDB            |

---

## 🧪 Kiểm Tra Kafka UI

Truy cập [http://localhost:8088](http://localhost:8088) để theo dõi:

- Các topic đang được emit: `USER_CREATED`, `REGISTRATION_CREATED`, `EMAIL_SENT`...
- Nội dung message (JSON)
- Tình trạng các consumer groups

---

## 🧹 Dọn Dẹp

```bash
docker-compose down -v
```

---

> 📌 Tài liệu chi tiết về kiến trúc, flow sự kiện và hướng dẫn thao tác UI nằm trong `demo.md` hoặc file riêng nếu cần trình bày.


```
EDA-Demo
├─ auditlog-service
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ consumers
│  │  │  ├─ auditLogged.js
│  │  │  ├─ emailSent.js
│  │  │  ├─ eventUpdated.js
│  │  │  ├─ registrationCreated.js
│  │  │  ├─ userCreated.js
│  │  │  └─ userLogined.js
│  │  ├─ controllers
│  │  │  └─ auditController.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ auditLog.js
│  │  ├─ producers
│  │  │  └─ auditLogged.js
│  │  ├─ services
│  │  │  └─ auditService.js
│  │  └─ utils
│  │     └─ db.js
│  └─ tests
│     ├─ integration
│     │  └─ audit.test.js
│     └─ unit
│        └─ auditService.test.js
├─ demo.md
├─ docker-compose.yml
├─ event-service
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ consumers
│  │  │  └─ createdConsumer.js
│  │  ├─ controllers
│  │  │  └─ eventController.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ event.js
│  │  ├─ producers
│  │  │  └─ eventUpdated.js
│  │  ├─ services
│  │  │  └─ eventService.js
│  │  └─ utils
│  │     └─ db.js
│  └─ tests
│     ├─ integration
│     │  └─ event.test.js
│     └─ unit
│        └─ eventService.test.js
├─ frontend
│  ├─ .env
│  ├─ .next
│  │  ├─ app-build-manifest.json
│  │  ├─ build-manifest.json
│  │  ├─ cache
│  │  │  ├─ .rscinfo
│  │  │  ├─ swc
│  │  │  │  └─ plugins
│  │  │  │     └─ v7_windows_x86_64_8.0.0
│  │  │  └─ webpack
│  │  │     ├─ client-development
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 10.pack.gz
│  │  │     │  ├─ 11.pack.gz
│  │  │     │  ├─ 12.pack.gz
│  │  │     │  ├─ 13.pack.gz
│  │  │     │  ├─ 14.pack.gz
│  │  │     │  ├─ 15.pack.gz
│  │  │     │  ├─ 16.pack.gz
│  │  │     │  ├─ 17.pack.gz
│  │  │     │  ├─ 18.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ 3.pack.gz
│  │  │     │  ├─ 4.pack.gz
│  │  │     │  ├─ 5.pack.gz
│  │  │     │  ├─ 6.pack.gz
│  │  │     │  ├─ 7.pack.gz
│  │  │     │  ├─ 8.pack.gz
│  │  │     │  ├─ 9.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     ├─ client-development-fallback
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     └─ server-development
│  │  │        ├─ 0.pack.gz
│  │  │        ├─ 1.pack.gz
│  │  │        ├─ 10.pack.gz
│  │  │        ├─ 11.pack.gz
│  │  │        ├─ 12.pack.gz
│  │  │        ├─ 13.pack.gz
│  │  │        ├─ 14.pack.gz
│  │  │        ├─ 15.pack.gz
│  │  │        ├─ 16.pack.gz
│  │  │        ├─ 2.pack.gz
│  │  │        ├─ 3.pack.gz
│  │  │        ├─ 4.pack.gz
│  │  │        ├─ 5.pack.gz
│  │  │        ├─ 6.pack.gz
│  │  │        ├─ 7.pack.gz
│  │  │        ├─ 8.pack.gz
│  │  │        ├─ 9.pack.gz
│  │  │        ├─ index.pack.gz
│  │  │        └─ index.pack.gz.old
│  │  ├─ package.json
│  │  ├─ react-loadable-manifest.json
│  │  ├─ server
│  │  │  ├─ app
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  └─ _not-found
│  │  │  │     ├─ page.js
│  │  │  │     └─ page_client-reference-manifest.js
│  │  │  ├─ app-paths-manifest.json
│  │  │  ├─ interception-route-rewrite-manifest.js
│  │  │  ├─ middleware-build-manifest.js
│  │  │  ├─ middleware-manifest.json
│  │  │  ├─ middleware-react-loadable-manifest.js
│  │  │  ├─ next-font-manifest.js
│  │  │  ├─ next-font-manifest.json
│  │  │  ├─ pages-manifest.json
│  │  │  ├─ server-reference-manifest.js
│  │  │  ├─ server-reference-manifest.json
│  │  │  ├─ vendor-chunks
│  │  │  │  ├─ @radix-ui.js
│  │  │  │  ├─ @swc.js
│  │  │  │  ├─ aria-hidden.js
│  │  │  │  ├─ asynckit.js
│  │  │  │  ├─ axios.js
│  │  │  │  ├─ call-bind-apply-helpers.js
│  │  │  │  ├─ class-variance-authority.js
│  │  │  │  ├─ clsx.js
│  │  │  │  ├─ combined-stream.js
│  │  │  │  ├─ debug.js
│  │  │  │  ├─ delayed-stream.js
│  │  │  │  ├─ dunder-proto.js
│  │  │  │  ├─ es-define-property.js
│  │  │  │  ├─ es-errors.js
│  │  │  │  ├─ es-object-atoms.js
│  │  │  │  ├─ es-set-tostringtag.js
│  │  │  │  ├─ follow-redirects.js
│  │  │  │  ├─ form-data.js
│  │  │  │  ├─ function-bind.js
│  │  │  │  ├─ get-intrinsic.js
│  │  │  │  ├─ get-nonce.js
│  │  │  │  ├─ get-proto.js
│  │  │  │  ├─ gopd.js
│  │  │  │  ├─ has-flag.js
│  │  │  │  ├─ has-symbols.js
│  │  │  │  ├─ has-tostringtag.js
│  │  │  │  ├─ hasown.js
│  │  │  │  ├─ lucide-react.js
│  │  │  │  ├─ math-intrinsics.js
│  │  │  │  ├─ mime-db.js
│  │  │  │  ├─ mime-types.js
│  │  │  │  ├─ ms.js
│  │  │  │  ├─ next.js
│  │  │  │  ├─ proxy-from-env.js
│  │  │  │  ├─ react-remove-scroll-bar.js
│  │  │  │  ├─ react-remove-scroll.js
│  │  │  │  ├─ react-style-singleton.js
│  │  │  │  ├─ supports-color.js
│  │  │  │  ├─ tailwind-merge.js
│  │  │  │  ├─ tslib.js
│  │  │  │  ├─ use-callback-ref.js
│  │  │  │  └─ use-sidecar.js
│  │  │  └─ webpack-runtime.js
│  │  ├─ static
│  │  │  ├─ chunks
│  │  │  │  ├─ app
│  │  │  │  │  ├─ layout.js
│  │  │  │  │  ├─ page.js
│  │  │  │  │  └─ _not-found
│  │  │  │  │     └─ page.js
│  │  │  │  ├─ app-pages-internals.js
│  │  │  │  ├─ main-app.js
│  │  │  │  ├─ polyfills.js
│  │  │  │  └─ webpack.js
│  │  │  ├─ css
│  │  │  │  └─ app
│  │  │  │     └─ layout.css
│  │  │  ├─ development
│  │  │  │  ├─ _buildManifest.js
│  │  │  │  └─ _ssgManifest.js
│  │  │  └─ webpack
│  │  │     ├─ 0f679872e191f92f.webpack.hot-update.json
│  │  │     ├─ 1c66d833de08d861.webpack.hot-update.json
│  │  │     ├─ 38246d90c5284ef3.webpack.hot-update.json
│  │  │     ├─ 3c1edcf20672df6a.webpack.hot-update.json
│  │  │     ├─ 3c9921a4e79ed790.webpack.hot-update.json
│  │  │     ├─ 53643591597038f0.webpack.hot-update.json
│  │  │     ├─ 633457081244afec._.hot-update.json
│  │  │     ├─ 7e8674411fe87ef3.webpack.hot-update.json
│  │  │     ├─ app
│  │  │     │  ├─ layout.0f679872e191f92f.hot-update.js
│  │  │     │  ├─ layout.38246d90c5284ef3.hot-update.js
│  │  │     │  ├─ layout.3c1edcf20672df6a.hot-update.js
│  │  │     │  ├─ layout.3c9921a4e79ed790.hot-update.js
│  │  │     │  ├─ layout.7e8674411fe87ef3.hot-update.js
│  │  │     │  ├─ layout.cac8950aad0267fb.hot-update.js
│  │  │     │  ├─ layout.dacbb9bdc14bc0e0.hot-update.js
│  │  │     │  ├─ page.0f679872e191f92f.hot-update.js
│  │  │     │  ├─ page.38246d90c5284ef3.hot-update.js
│  │  │     │  ├─ page.3c1edcf20672df6a.hot-update.js
│  │  │     │  ├─ page.7e8674411fe87ef3.hot-update.js
│  │  │     │  └─ page.cac8950aad0267fb.hot-update.js
│  │  │     ├─ cac8950aad0267fb.webpack.hot-update.json
│  │  │     ├─ d5cc0e8cae6ea29f.webpack.hot-update.json
│  │  │     ├─ dacbb9bdc14bc0e0.webpack.hot-update.json
│  │  │     ├─ ed1e4cc016124a5d.webpack.hot-update.json
│  │  │     ├─ f0ef3722ee41e991.webpack.hot-update.json
│  │  │     ├─ webpack.0f679872e191f92f.hot-update.js
│  │  │     ├─ webpack.1c66d833de08d861.hot-update.js
│  │  │     ├─ webpack.38246d90c5284ef3.hot-update.js
│  │  │     ├─ webpack.3c1edcf20672df6a.hot-update.js
│  │  │     ├─ webpack.3c9921a4e79ed790.hot-update.js
│  │  │     ├─ webpack.53643591597038f0.hot-update.js
│  │  │     ├─ webpack.7e8674411fe87ef3.hot-update.js
│  │  │     ├─ webpack.cac8950aad0267fb.hot-update.js
│  │  │     ├─ webpack.d5cc0e8cae6ea29f.hot-update.js
│  │  │     ├─ webpack.dacbb9bdc14bc0e0.hot-update.js
│  │  │     ├─ webpack.ed1e4cc016124a5d.hot-update.js
│  │  │     └─ webpack.f0ef3722ee41e991.hot-update.js
│  │  ├─ trace
│  │  └─ types
│  │     ├─ app
│  │     │  ├─ layout.ts
│  │     │  └─ page.ts
│  │     ├─ cache-life.d.ts
│  │     └─ package.json
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ event-card.tsx
│  │  ├─ event-detail-modal.tsx
│  │  ├─ filter-tabs.tsx
│  │  ├─ header.tsx
│  │  ├─ loading-spinner.tsx
│  │  ├─ theme-provider.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     ├─ use-mobile.tsx
│  │     └─ use-toast.ts
│  ├─ components.json
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ utils.ts
│  ├─ next-env.d.ts
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ placeholder-logo.png
│  │  ├─ placeholder-logo.svg
│  │  ├─ placeholder-user.jpg
│  │  ├─ placeholder.jpg
│  │  └─ placeholder.svg
│  ├─ styles
│  │  └─ globals.css
│  ├─ tailwind.config.ts
│  ├─ tsconfig.json
│  └─ types
│     └─ event.ts
├─ gateway
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ config.js
│  │  ├─ controllers
│  │  │  └─ apiController.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ authMiddleware.js
│  │  ├─ routes
│  │  │  └─ index.js
│  │  └─ utils
│  │     └─ logger.js
│  └─ tests
│     ├─ integration
│     │  └─ api.test.js
│     └─ unit
│        └─ authMiddleware.test.js
├─ notification-service
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ kafka.js
│  │  ├─ consumers
│  │  │  ├─ registrationCreated.js
│  │  │  └─ userCreated.js
│  │  ├─ controllers
│  │  │  └─ notificationController.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ notification.js
│  │  ├─ producers
│  │  │  ├─ notificationFailed.js
│  │  │  └─ notificationSent.js
│  │  ├─ services
│  │  │  ├─ notificationService.js
│  │  │  └─ sendEmail.js
│  │  └─ utils
│  │     └─ logger.js
│  └─ tests
│     ├─ integration
│     │  └─ notification.test.js
│     └─ unit
│        └─ notificationService.test.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ registration-service
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ controllers
│  │  │  └─ registrationController.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ registration.js
│  │  ├─ producers
│  │  │  ├─ registrationCancelled.js
│  │  │  └─ registrationCreated.js
│  │  ├─ services
│  │  │  └─ registrationService.js
│  │  └─ utils
│  │     └─ db.js
│  └─ tests
│     ├─ integration
│     │  └─ registration.test.js
│     └─ unit
│        └─ registrationService.test.js
├─ shared
│  ├─ event-types.js
│  ├─ init-kafka-topics.sh
│  ├─ init-multiple-dbs.sh
│  ├─ middleware
│  │  ├─ auth.js
│  │  └─ errorHandler.js
│  ├─ schema
│  │  ├─ auditSchema.js
│  │  ├─ emailSchema.js
│  │  ├─ eventSchema.js
│  │  ├─ notificationSchema.js
│  │  ├─ registrationSchema.js
│  │  └─ userSchema.js
│  ├─ seed-event.sql
│  ├─ utils
│  │  ├─ kafkaClient.js
│  │  ├─ kafkaInit.js
│  │  └─ logger.js
│  ├─ wait-for-kafka.sh
│  ├─ wait-for-mongo.sh
│  └─ wait-for-postgres.sh
└─ user-service
   ├─ .env
   ├─ Dockerfile
   ├─ package.json
   ├─ README.md
   ├─ src
   │  ├─ config
   │  │  └─ database.js
   │  ├─ consumers
   │  │  └─ registrationCreated.js
   │  ├─ controllers
   │  │  └─ userController.js
   │  ├─ index.js
   │  ├─ models
   │  │  └─ user.js
   │  ├─ producers
   │  │  ├─ userCreated.js
   │  │  └─ userUpdated.js
   │  ├─ services
   │  │  └─ userService.js
   │  └─ utils
   │     └─ db.js
   └─ tests
      ├─ integration
      │  └─ user.test.js
      └─ unit
         └─ userService.test.js

```