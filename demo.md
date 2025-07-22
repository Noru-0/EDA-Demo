# 🎯 Demo Luồng Đăng Ký Sự Kiện theo Kiến Trúc Event-Driven

## 🧩 Kiến Trúc Tổng Quan

Hệ thống được xây dựng theo mô hình **microservices kết hợp event-driven architecture**, gồm:

- **Frontend (Next.js)**: Giao diện người dùng duyệt và đăng ký sự kiện.
- **API Gateway (Fastify)**: Giao tiếp giữa FE và backend services.
- **Backend Services**:
  - `event-service` (**PostgreSQL**): Quản lý danh sách sự kiện.
  - `registration-service` (**PostgreSQL + Kafka Producer**): Ghi danh và gửi message Kafka.
  - `notification-service` (**Kafka Consumer**): Nghe topic để gửi email thông báo.
  - `auditlog-service` (**MongoDB + Kafka Consumer**): Ghi log các hành động quan trọng.
- **Kafka**: Kênh truyền sự kiện trung gian giữa các services.

---

## ⚙️ Luồng Event-Driven chi tiết

### ✔️ Bước 1: FE gửi yêu cầu đăng ký

1. Người dùng nhập `User ID` và nhấn **Đăng ký tham gia**.
2. Gửi request:
   ```json
   POST /registrations
   {
     "userId": 12,
     "eventId": "2c79c65b-6083-4b4f-a567-d5ff9b533556"
   }
   ```
3. API Gateway chuyển tiếp request đến `registration-service`.
4. `registration-service`:
   - Ghi DB: bảng `registrations`
   - Tăng số lượng `registered` trong `event-service`
   - Phát Kafka event:
     ```json
     {
       "userId": 12,
       "eventId": "2c79c65b-6083-4b4f-a567-d5ff9b533556"
     }
     ```
   - Gửi lên topic: `registration.created`

### ✨ Kafka giữ vai trò trung gian

- Kafka broker giúp chuyển sự kiện từ Producer sang nhiều Consumer.
- Cho phép xử lý độc lập, phi đồng bộ.

### 📢 `notification-service`

- Là Consumer của topic `registration.created`
- Khi nhận event:
  - Gửi email xác nhận qua SMTP.
  - Gửi request ghi log đến `auditlog-service`

### 📃 `auditlog-service`

- Consumer ghi log tất cả sự kiện quan trọng vào MongoDB.

---

## 🦖 Demo thực tế

### ✔️ FE gửi đăng ký

- Chọn sự kiện, nhập ID, nhấn **Đăng ký tham gia**
- Xem toast: `Đăng ký thành công`

### ✔️ Kafka UI:

- Mở URL: `http://localhost:8080`
- Tìm topic: `registration.created`
- Message sẽ xuất hiện:
  ```json
  {
    "userId": 12,
    "eventId": "..."
  }
  ```

### ✔️ Kiểm tra email:

- Email test hoặc email mặc định nhận xác nhận sự kiện

### ✔️ Kiểm tra log MongoDB:

- Bảng `auditlogs` ghi:
  ```json
  {
    "eventType": "registration.created",
    "data": {
      "userId": 12,
      "eventId": "..."
    }
  }
  ```

---

## 📌 Lợi ích Event-Driven

| ⚡️            | Mô tả                                         |
| ------------- | --------------------------------------------- |
| Tách biệt     | Service độc lập, triển khai / scale linh hoạt |
| Tốc độ nhanh  | Producer publish nhanh, không chờ Consumer    |
| Gửi log chuẩn | Audit ghi vết tự động không can thiệp         |
| Mở rộng       | Thêm consumer mới dễ dàng                     |

---

## 🔗 Kết luận

Luồng đăng ký sự kiện được thiết kế theo **EDA** giúp:

- Tăng tốc độ xử lý
- Tách biệt tốt backend services
- Cho phép logging và xử lý backend linh hoạt
- Mở rộng hệ thống bằng việc thêm consumer hoặc topic mới

# Tắt toàn bộ
docker compose down -v

# Dọn network (tuỳ chọn nếu vẫn lỗi)
docker network prune
docker network rm <network_name>

# Bật lại
docker compose up -d --build