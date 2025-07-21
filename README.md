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

---
