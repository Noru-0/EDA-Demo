# 🎯 EventFlow Microservices System

EventFlow là hệ thống quản lý đăng ký sự kiện sử dụng kiến trúc **microservices**, với các service độc lập giao tiếp qua **Kafka**, lưu trữ dữ liệu bằng **PostgreSQL** và **MongoDB**, và frontend được xây dựng với **Next.js**. Hệ thống cho phép người dùng xem danh sách sự kiện, đăng ký tham gia, và nhận thông báo qua email.

---

## 📋 Yêu cầu tiên quyết

- **Docker**: Phiên bản 20.10.0 trở lên ([Hướng dẫn cài đặt](https://docs.docker.com/get-docker/))
- **Docker Compose**: Phiên bản 2.0.0 trở lên ([Hướng dẫn cài đặt](https://docs.docker.com/compose/install/))
- **Node.js**: v18.x trở lên (cho frontend development)
- **npm** hoặc **pnpm** (khuyến nghị pnpm cho frontend)
- Truy cập terminal với quyền chạy Docker
- Trình duyệt web (Chrome, Firefox, v.v.) để truy cập frontend

---

## 🧱 Cấu trúc hệ thống

### Backend (Microservices)
- **gateway**: API Gateway, định tuyến yêu cầu từ client tới các service (port: `3000`).
- **user-service**: Quản lý thông tin người dùng (PostgreSQL).
- **event-service**: Quản lý sự kiện (PostgreSQL).
- **registration-service**: Xử lý đăng ký sự kiện (PostgreSQL).
- **notification-service**: Gửi thông báo qua Kafka (port: `3004`).
- **email-service**: Gửi email thông báo (port: `3005`).
- **auditlog-service**: Lưu trữ log sự kiện (MongoDB).
- **shared/**: Thư mục chứa mã nguồn dùng chung (Kafka client, constants, helpers...).

### Frontend (Next.js)
- **frontend**: Ứng dụng web Next.js hiển thị danh sách sự kiện, hỗ trợ đăng ký và xem chi tiết sự kiện (port: `3000`).
- Sử dụng **Shadcn UI** và **Tailwind CSS** cho giao diện.
- Gọi API qua **Gateway** (`http://localhost:3000`).

---

## 📂 Cấu trúc thư mục

```
project-root/
├── shared/
│   ├── utils/
│   │   ├── kafkaClient.js
│   │   ├── kafkaInit.js
│   │   └── ...
├── gateway/
│   ├── Dockerfile
│   └── ...
├── user-service/
│   ├── Dockerfile
│   └── ...
├── event-service/
│   ├── Dockerfile
│   └── ...
├── registration-service/
│   ├── Dockerfile
│   └── ...
├── notification-service/
│   ├── Dockerfile
│   └── ...
├── email-service/
│   ├── Dockerfile
│   └── ...
├── auditlog-service/
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── ...
│   ├── components/
│   │   ├── event-card.tsx
│   │   ├── event-detail-modal.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts
│   │   └── ...
│   ├── public/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## 🚀 Cách chạy hệ thống

### 1. Cài đặt môi trường

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd project-root
   ```

2. **Tạo file `.env`** trong thư mục gốc:
   ```bash
   KAFKA_BROKERS=kafka:9092
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=userdb
   MONGODB_URI=mongodb://mongo:27017/auditdb
   ```

3. **Tạo file `.env.local`** trong thư mục `frontend/`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_AUTH_TOKEN=mock-token
   ```

### 2. Chạy Backend (Microservices)

Chạy toàn bộ hệ thống backend bằng Docker Compose:

```bash
# Xóa volume và container cũ (khuyến nghị để đảm bảo môi trường sạch)
docker-compose down -v

# Build lại images
docker-compose build --no-cache

# Chạy các service
docker-compose up
```

👉 **Lưu ý**: Đảm bảo bạn chạy lệnh tại thư mục chứa `docker-compose.yml`.

### 3. Chạy Frontend (Next.js)

1. **Cài đặt dependencies**:
   ```bash
   cd frontend
   npm install
   # Hoặc nếu dùng pnpm
   pnpm install
   ```

2. **Chạy frontend**:
   ```bash
   npm run dev
   # Hoặc
   pnpm dev
   ```

3. **Truy cập frontend**:
   - Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### 4. Kiểm tra sau khi chạy

- **Gateway**: [http://localhost:3000](http://localhost:3000)
- **Notification Service**: [http://localhost:3004](http://localhost:3004)
- **Email Service**: [http://localhost:3005](http://localhost:3005)
- **PostgreSQL**: Port `5432`
- **MongoDB**: Port `27017`
- **Kafka**: Broker tại `kafka:9092` (nội bộ Docker network)
- **Frontend**: [http://localhost:3000](http://localhost:3000)

#### Kiểm tra kết nối cơ sở dữ liệu

- **PostgreSQL**:
  ```bash
  psql postgres://postgres:admin@localhost:5432/userdb
  ```

- **MongoDB**:
  ```bash
  mongosh mongodb://localhost:27017/auditdb
  ```

#### Kiểm tra Kafka

- Kiểm tra topic `event-created`:
  ```bash
  docker exec -it kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic event-created --from-beginning
  ```

---

## 🛠️ Tích hợp Frontend-Backend

Frontend (Next.js) giao tiếp với backend qua **API Gateway** tại `http://localhost:3000`. Các endpoint chính:

1. **Lấy danh sách sự kiện**:
   - **Endpoint**: `GET /events`
   - **Header**: `Authorization: Bearer mock-token`
   - **Response**: Mảng JSON chứa danh sách sự kiện.
   - **Ví dụ**:
     ```bash
     curl -H "Authorization: Bearer mock-token" http://localhost:3000/events
     ```

2. **Đăng ký sự kiện**:
   - **Endpoint**: `POST /registrations`
   - **Header**: `Authorization: Bearer mock-token`, `Content-Type: application/json`
   - **Body**:
     ```json
     {
       "userId": 1,
       "eventId": 1
     }
     ```
   - **Response**: Mã trạng thái `201` với thông báo thành công.
   - **Ví dụ**:
     ```bash
     curl -X POST -H "Authorization: Bearer mock-token" -H "Content-Type: application/json" \
     -d '{"userId": 1, "eventId": 1}' http://localhost:3000/registrations
     ```

Frontend sử dụng file `lib/api.ts` để gọi các API này, hiển thị sự kiện trong `components/event-card.tsx` và xử lý đăng ký trong `components/event-detail-modal.tsx`.

---

## 🧪 Hướng dẫn kiểm tra API

### Sử dụng Postman

1. Tạo một collection trong Postman.
2. Thêm các request:
   - **GET /events**:
     - URL: `http://localhost:3000/events`
     - Headers: `Authorization: Bearer mock-token`
   - **POST /registrations**:
     - URL: `http://localhost:3000/registrations`
     - Headers: `Authorization: Bearer mock-token`, `Content-Type: application/json`
     - Body (raw JSON):
       ```json
       {
         "userId": 1,
         "eventId": 1
       }
       ```

3. Kiểm tra response:
   - **GET /events**: Trả về mảng JSON chứa các sự kiện.
   - **POST /registrations**: Trả về mã trạng thái `201` với thông báo thành công.

### Sử dụng `curl`

- Xem ví dụ ở mục **Tích hợp Frontend-Backend** phía trên.

### Kiểm tra giao diện

1. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.
2. Xem danh sách sự kiện, lọc theo trạng thái (`all`, `upcoming`, `ended`).
3. Nhấn "Đăng ký" trên một sự kiện, nhập `userId` trong modal, và kiểm tra thông báo toast (thành công/lỗi).

---

## 📝 Ghi chú

- Mỗi service tự động đăng ký **Kafka consumer** để nhận sự kiện từ các topic được định nghĩa trong `shared/event-types.js`.
- Các file `wait-for.sh`, `wait-for-kafka.sh`, và `wait-for-mongo.sh` đảm bảo Kafka và cơ sở dữ liệu khởi động trước khi các service chạy.
- Thư mục `shared/` được mount vào mỗi service tại `/app/shared` để sử dụng mã nguồn chung.
- Hiện tại, `mock-token` được sử dụng cho authentication. Để triển khai thực tế, tích hợp hệ thống đăng nhập (e.g., JWT) trong `user-service` và cập nhật frontend để xử lý token.

---

## 🗑️ Dọn dẹp

Để dừng và xóa các container, volume, và image không sử dụng:

```bash
docker-compose down -v --remove-orphans
```
Service	Producers (Topics)	Consumers (Topics)
user-service	USER_CREATED (user.created)	None
event-service	EVENT_CREATED (event.created), UPDATE_EVENT (update.event)	REGISTRATION_CREATED (registration.created)
registration-service	REGISTRATION_CREATED (registration.created)	None
notification-service	EMAIL_SENT (email.sent), EMAIL_FAILED (email.failed)	USER_CREATED (user.created), REGISTRATION_CREATED (registration.created)
audit-service	AUDIT_LOGGED (AUDIT_LOGGED), AUDIT_FAILED (AUDIT_FAILED)	USER_CREATED, REGISTRATION_CREATED, EVENT_CREATED, UPDATE_EVENT, EMAIL_SENT, EMAIL_FAILED, AUDIT_FAILED
---

# Tắt toàn bộ
docker compose down -v

# Dọn network (tuỳ chọn nếu vẫn lỗi)
docker network prune
docker network rm <network_name>

# Bật lại
docker compose up -d --build

```
EDA-Demo
├─ auditlog-service
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ controllers
│  │  │  └─ auditController.js
│  │  ├─ events
│  │  │  ├─ auditFailed.js
│  │  │  └─ auditLogged.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ auditLog.js
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
├─ email-service
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ kafka.js
│  │  ├─ controllers
│  │  │  └─ emailController.js
│  │  ├─ events
│  │  │  ├─ emailFailed.js
│  │  │  ├─ emailSent.js
│  │  │  └─ registrationCreated.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ email.js
│  │  ├─ services
│  │  │  └─ emailService.js
│  │  └─ utils
│  │     └─ logger.js
│  └─ tests
│     ├─ integration
│     │  └─ email.test.js
│     └─ unit
│        └─ emailService.test.js
├─ event-service
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ consumers
│  │  │  └─ registration
│  │  │     └─ createdConsumer.js
│  │  ├─ controllers
│  │  │  └─ eventController.js
│  │  ├─ events
│  │  │  ├─ eventCreated.js
│  │  │  └─ eventUpdated.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ event.js
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
│  │  │     │  └─ index.pack.gz
│  │  │     └─ server-development
│  │  │        ├─ 0.pack.gz
│  │  │        ├─ 1.pack.gz
│  │  │        ├─ 10.pack.gz
│  │  │        ├─ 11.pack.gz
│  │  │        ├─ 12.pack.gz
│  │  │        ├─ 13.pack.gz
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
│  │  │  │  ├─ has-symbols.js
│  │  │  │  ├─ has-tostringtag.js
│  │  │  │  ├─ hasown.js
│  │  │  │  ├─ lucide-react.js
│  │  │  │  ├─ math-intrinsics.js
│  │  │  │  ├─ mime-db.js
│  │  │  │  ├─ mime-types.js
│  │  │  │  ├─ next.js
│  │  │  │  ├─ proxy-from-env.js
│  │  │  │  ├─ react-remove-scroll-bar.js
│  │  │  │  ├─ react-remove-scroll.js
│  │  │  │  ├─ react-style-singleton.js
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
│  │  │     ├─ 005f89381e813aaa.webpack.hot-update.json
│  │  │     ├─ 17a4c68a28426e9c.webpack.hot-update.json
│  │  │     ├─ 633457081244afec._.hot-update.json
│  │  │     ├─ 74b5c5c7f967399c.webpack.hot-update.json
│  │  │     ├─ 7c83574708a394a8.webpack.hot-update.json
│  │  │     ├─ app
│  │  │     │  ├─ layout.005f89381e813aaa.hot-update.js
│  │  │     │  ├─ layout.17a4c68a28426e9c.hot-update.js
│  │  │     │  ├─ layout.c4f310b093d6cb76.hot-update.js
│  │  │     │  ├─ layout.c8c7681d09272a79.hot-update.js
│  │  │     │  ├─ layout.d1cfce5f16e1b3e6.hot-update.js
│  │  │     │  ├─ layout.fedd1bb1ecfc86be.hot-update.js
│  │  │     │  ├─ layout.ff8179d3f8280760.hot-update.js
│  │  │     │  ├─ page.005f89381e813aaa.hot-update.js
│  │  │     │  ├─ page.c4f310b093d6cb76.hot-update.js
│  │  │     │  ├─ page.c8c7681d09272a79.hot-update.js
│  │  │     │  ├─ page.fedd1bb1ecfc86be.hot-update.js
│  │  │     │  └─ page.ff8179d3f8280760.hot-update.js
│  │  │     ├─ c4f310b093d6cb76.webpack.hot-update.json
│  │  │     ├─ c8c7681d09272a79.webpack.hot-update.json
│  │  │     ├─ d1cfce5f16e1b3e6.webpack.hot-update.json
│  │  │     ├─ fedd1bb1ecfc86be.webpack.hot-update.json
│  │  │     ├─ ff8179d3f8280760.webpack.hot-update.json
│  │  │     ├─ webpack.005f89381e813aaa.hot-update.js
│  │  │     ├─ webpack.17a4c68a28426e9c.hot-update.js
│  │  │     ├─ webpack.74b5c5c7f967399c.hot-update.js
│  │  │     ├─ webpack.7c83574708a394a8.hot-update.js
│  │  │     ├─ webpack.c4f310b093d6cb76.hot-update.js
│  │  │     ├─ webpack.c8c7681d09272a79.hot-update.js
│  │  │     ├─ webpack.d1cfce5f16e1b3e6.hot-update.js
│  │  │     ├─ webpack.fedd1bb1ecfc86be.hot-update.js
│  │  │     └─ webpack.ff8179d3f8280760.hot-update.js
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
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ config
│  │  │  └─ kafka.js
│  │  ├─ controllers
│  │  │  └─ notificationController.js
│  │  ├─ events
│  │  │  ├─ notificationFailed.js
│  │  │  ├─ notificationSent.js
│  │  │  └─ registrationCreated.js
│  │  ├─ index.js
│  │  ├─ models
│  │  │  └─ notification.js
│  │  ├─ services
│  │  │  └─ notificationService.js
│  │  └─ utils
│  │     └─ logger.js
│  └─ tests
│     ├─ integration
│     │  └─ notification.test.js
│     └─ unit
│        └─ notificationService.test.js
├─ package.json
├─ README.md
   ├─ registration-service
   │  ├─ Dockerfile
   │  ├─ package.json
   │  ├─ README.md
   │  ├─ src
   │  │  ├─ config
   │  │  │  └─ database.js
   │  │  ├─ controllers
   │  │  │  └─ registrationController.js
   │  │  ├─ events
   │  │  │  ├─ registrationCancelled.js
   │  │  │  └─ registrationCreated.js
   │  │  ├─ index.js
   │  │  ├─ models
   │  │  │  └─ registration.js
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
   ├─ Dockerfile
   ├─ package.json
   ├─ README.md
   ├─ src
   │  ├─ config
   │  │  └─ database.js
   │  ├─ controllers
   │  │  └─ userController.js
   │  ├─ events
   │  │  ├─ userCreated.js
   │  │  └─ userUpdated.js
   │  ├─ index.js
   │  ├─ models
   │  │  └─ user.js
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