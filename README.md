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

