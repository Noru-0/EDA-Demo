# 📦 EDA-Demo – Kiến Trúc Event-Driven Đăng Ký Sự Kiện

## 🧩 Mục Tiêu Demo

Trình bày luồng hoạt động của hệ thống microservices áp dụng **Event-Driven Architecture (EDA)**:

- Đăng ký người dùng mới
- Đăng nhập người dùng
- Đăng ký tham gia sự kiện
- Nhận email xác nhận đăng ký sự kiện
- Ghi lại toàn bộ hành vi vào `audit-log`

---

## 🧱 Kiến Trúc Tổng Quan

```
[Gateway] ➜ [User Service] ➜ Kafka (USER_CREATED, USER_LOGINED)
                            ↘
                             ➜ [Auditlog Service]

[Gateway] ➜ [Registration Service] ➜ Kafka (REGISTRATION_CREATED)
                                     ↘
                                      ➜ [Event Service]
                                      ➜ [Notification Service] ➜ Kafka (EMAIL_SENT)
                                                                ↘
                                                                 ➜ [Auditlog Service]
```

Mỗi service độc lập xử lý tác vụ riêng và **giao tiếp thông qua sự kiện Kafka**, thay vì gọi trực tiếp.

---

## 🔁 Luồng Hoạt Động

### 1. 👤 **Người dùng đăng ký**

- Gateway nhận request → chuyển đến `user-service`
- `user-service` tạo user và phát event `USER_CREATED`
- `auditlog-service` lắng nghe sự kiện `USER_CREATED` và ghi log

### 2. 🔐 **Người dùng đăng nhập**

- `user-service` xác thực → phát event `USER_LOGINED`
- `auditlog-service` ghi lại hành vi đăng nhập

### 3. 📝 **Người dùng đăng ký sự kiện**

- Gateway gửi yêu cầu đến `registration-service`
- `registration-service` tạo bản ghi và phát event `REGISTRATION_CREATED`
- Các consumer lắng nghe:
  - `event-service`: cập nhật số lượng người tham gia
  - `notification-service`: gửi email → phát tiếp `EMAIL_SENT`
  - `auditlog-service`: ghi lại hành vi

### 4. 📩 **Email xác nhận**

- `notification-service` xử lý event `REGISTRATION_CREATED`
- Gọi `user-service` để lấy email (tự tra cứu – **event-notification**)
- Gửi email → phát `EMAIL_SENT`
- `auditlog-service` ghi lại việc email đã được gửi

---

## 📘 Mô Hình Sự Kiện (Event Flow)

| Event Name             | Được phát từ           | Ai lắng nghe                                                |
| ---------------------- | ---------------------- | ----------------------------------------------------------- |
| `USER_CREATED`         | `user-service`         | `auditlog-service`                                          |
| `USER_LOGINED`         | `user-service`         | `auditlog-service`                                          |
| `REGISTRATION_CREATED` | `registration-service` | `event-service`, `notification-service`, `auditlog-service` |
| `EMAIL_SENT`           | `notification-service` | `auditlog-service`                                          |

---

## 🧠 Kiến Trúc Event-Driven Được Thể Hiện Qua:

| Yếu tố                       | Minh chứng trong hệ thống                                            |
| ---------------------------- | -------------------------------------------------------------------- |
| **Loose coupling**           | Các service không gọi nhau trực tiếp (trừ khi cần tra cứu)           |
| **Event-as-notification**    | Kafka message chỉ chứa ID, consumer tự tra cứu thêm                  |
| **Scalable consumers**       | Có thể thêm consumer mới không ảnh hưởng producer                    |
| **Audit / Tracking dễ dàng** | `auditlog-service` chỉ cần subscribe Kafka để theo dõi toàn hệ thống |

---

## 🚀 Hướng Dẫn Chạy Demo

### 📊 Giới thiệu Kafka UI ([http://localhost:8080](http://localhost:8080))

Kafka UI là công cụ giao diện trực quan giúp theo dõi hoạt động của Kafka, bao gồm:

| Thành phần          | Mô tả                                                      |
| ------------------- | ---------------------------------------------------------- |
| **Clusters**        | Danh sách các Kafka cluster đang kết nối                   |
| **Topics**          | Danh sách các chủ đề Kafka (USER\_CREATED, EMAIL\_SENT...) |
| **Messages**        | Xem nội dung message (JSON) được gửi từ producer           |
| **Consumer Groups** | Xem các consumer đang lắng nghe, vị trí offset, trạng thái |
| **Partitions**      | Phân vùng của topic, dùng để scale và phân tán             |

> 🔍 Bạn có thể click vào từng topic để xem luồng dữ liệu, ai consume, dữ liệu gì đang đi qua Kafka.

---

### 🧪 Khởi chạy hệ thống và thao tác thực tế

```bash
# 1. Khởi động toàn bộ hệ thống
docker-compose up -d --build

# 2. Khởi động frontend
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### ✋ Các bước thao tác giao diện người dùng (Frontend + Kafka UI)

> Giao diện người dùng được xây bằng Next.js, kết nối qua Gateway. Kafka UI dùng để theo dõi real-time các sự kiện.
   - Truy cập giao diện Ứng dụng: `http://localhost:3000`
   - Truy cập giao diện Kafka: `http://localhost:8080`

1. **Đăng ký tài khoản mới**

   - Chọn nút **Đăng ký**
   - Nhập thông tin: tên, email, mật khẩu ➝ bấm **Đăng ký**
   - ✅ Kiểm tra trong **Kafka UI** topic `USER_CREATED` xuất hiện message mới
   - ✅ Truy cập `auditlog-service` hoặc `pgadmin` để xem log tạo user

2. **Đăng nhập**

   - Chọn nút **Đăng nhập**
   - Nhập email + mật khẩu ➝ bấm **Đăng nhập**
   - ✅ Kiểm tra topic Kafka `USER_LOGINED`
   - ✅ Xem log đăng nhập trong `auditlog`
   - ✅ Nhận token Bearer (lưu vào LocalStorage hoặc DevTool để dùng cho bước tiếp theo)

3. **Đăng ký tham gia sự kiện**

   - Chọn sự kiện và bấm **Đăng ký**
   - ✅ Kafka emit: `REGISTRATION_CREATED`
   - ✅ Xem trong Kafka UI các topic:
     - `event-service` xử lý cập nhật số lượng
     - `notification-service` gửi email ➝ topic `EMAIL_SENT`
     - `auditlog-service` ghi nhận tất cả các hành vi

4. **Xác nhận email được gửi**

   - Console log từ `notification-service` in ra email đã gửi
   - Kafka UI hiển thị message ở topic `EMAIL_SENT`
   - DB `auditlog` lưu bản ghi email
   - Có thể vào email để kiểm tra

5. **Quan sát toàn bộ hệ thống qua Kafka UI**

   - Truy cập: `http://localhost:8080` 
   - Chọn các topic để theo dõi:
     - `USER_CREATED`
     - `USER_LOGINED`
     - `REGISTRATION_CREATED`
     - `EMAIL_SENT`
   - Theo dõi thời gian emit, nội dung message, consumer group...
      ```
     json { 
        "name": "Alice", 
        "email": "[alice@example.com](mailto\:alice@example.com)", 
        "password": "123456" 
      }
     ```
   - ✅ Kiểm tra log Kafka: có `USER_CREATED`
   - ✅ Truy cập `auditlog-service` DB: thấy bản ghi đăng ký

---

## 📦 Các Service Tham Gia

| Service                | Chức năng chính                         |
| ---------------------- | --------------------------------------- |
| `user-service`         | Đăng ký / đăng nhập / phát event        |
| `registration-service` | Xử lý đăng ký sự kiện                   |
| `event-service`        | Cập nhật dữ liệu sự kiện khi có đăng ký |
| `notification-service` | Gửi email và phát event `EMAIL_SENT`    |
| `auditlog-service`     | Lắng nghe tất cả sự kiện và ghi log     |
| `gateway`              | Tiếp nhận request từ client             |

---

## ✅ Tổng Kết

Hệ thống minh họa rõ:

- Mô hình **event-driven** với Kafka
- Sử dụng **event-notification pattern** (tra cứu dữ liệu khi cần)
- **Khả năng mở rộng** bằng cách thêm consumer
- **Tách biệt trách nhiệm rõ ràng** giữa các service

---

