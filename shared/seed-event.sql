-- Xóa bảng nếu tồn tại (chỉ dùng cho môi trường dev)
DROP TABLE IF EXISTS events;

-- Tạo bảng Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(255),
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  registered INT DEFAULT 0,
  image VARCHAR(255),
  status VARCHAR(20) DEFAULT 'upcoming',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

-- Chèn dữ liệu mẫu
INSERT INTO events (
  name, description, short_description, date, location, capacity, registered, image, status, "createdAt", "updatedAt"
) VALUES
  ('Hội thảo Công nghệ AI 2025',
   'Sự kiện chia sẻ kiến thức AI với chuyên gia đầu ngành.',
   'Khám phá AI cùng chuyên gia.',
   '2025-08-15',
   'Đại học Bách Khoa',
   100, 20, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Ngày hội việc làm CNTT',
   'Cơ hội gặp gỡ và phỏng vấn với các công ty công nghệ hàng đầu.',
   'Kết nối sinh viên và doanh nghiệp.',
   '2025-08-20',
   'Đại học Khoa học Tự nhiên',
   150, 150, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Workshop Thiết kế UX/UI',
   'Buổi workshop dành cho người mới bắt đầu với UX/UI.',
   'Học UX/UI từ chuyên gia.',
   '2025-07-10',
   'Online',
   80, 80, NULL, 'ended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Khóa học Lập trình Web cơ bản',
   'Khóa học kéo dài 5 buổi giúp bạn nắm vững kiến thức lập trình web.',
   'Học HTML/CSS/JS cơ bản.',
   '2025-08-01',
   'Innovation Hub',
   60, 45, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Seminar Blockchain & Crypto',
   'Buổi thảo luận mở về xu hướng công nghệ Blockchain và tiền mã hóa.',
   'Hiểu rõ về Blockchain.',
   '2025-09-05',
   'TP. Hồ Chí Minh',
   100, 90, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Chương trình thiện nguyện hè 2025',
   'Hoạt động từ thiện quy mô lớn tại vùng cao phía Bắc.',
   'Cơ hội đóng góp và trải nghiệm.',
   '2025-07-25',
   'Hà Giang',
   40, 35, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Mini Hackathon: Build Your App',
   'Cuộc thi lập trình trong 24 giờ để xây dựng ứng dụng MVP.',
   'Hackathon 24h!',
   '2025-08-10',
   'FPT Software Campus',
   120, 75, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Offline gặp mặt CLB Công nghệ',
   'Buổi gặp mặt định kỳ giữa các thành viên trong CLB.',
   'Kết nối & chia sẻ.',
   '2025-07-18',
   'Đại học Công nghệ',
   50, 25, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Buổi demo sản phẩm đồ án tốt nghiệp',
   'Sinh viên trình bày sản phẩm thực tế trước hội đồng và doanh nghiệp.',
   'Xem đồ án sáng tạo.',
   '2025-07-30',
   'ĐH Sư phạm Kỹ thuật',
   200, 180, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Chương trình đào tạo AI nâng cao',
   'Dành cho người đã có nền tảng về Machine Learning, tập trung vào NLP & Vision.',
   'AI chuyên sâu cho thực chiến.',
   '2025-09-01',
   'VinUni Campus',
   30, 10, NULL, 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
