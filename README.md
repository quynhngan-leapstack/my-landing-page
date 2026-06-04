# Leapstack Landing Page

## Đánh giá & Thiết kế Gói Phúc lợi Sức khỏe Doanh nghiệp

### 🚀 Tính năng

- ✨ Giao diện hiện đại, responsive design
- 📱 Tối ưu cho mobile
- 📧 Tích hợp gửi email tự động (Nodemailer)
- ✅ Xác thực dữ liệu form client & server-side
- 🔐 Bảo mật thông tin người dùng
- 📊 Backend API để quản lý đơn đăng ký

### 📋 Yêu cầu

- Node.js >= 14.0
- npm >= 6.0

### 🔧 Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/quynhngan-leapstack/my-landing-page.git
cd my-landing-page
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình biến môi trường**
```bash
cp .env.example .env
```

Sửa file `.env` và thêm thông tin email của bạn:
```
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@leapstack.vn
```

**Lưu ý:** Nếu dùng Gmail, bạn cần tạo [App Password](https://support.google.com/accounts/answer/185833)

4. **Chạy server**
```bash
npm start
```

Hoặc chạy với nodemon (development):
```bash
npm run dev
```

5. **Truy cập**
Mở trình duyệt và truy cập: `http://localhost:3000`

### 📝 Các endpoint API

#### POST `/api/submit-form`
Gửi form đăng ký từ landing page.

**Request body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "position": "HR Manager",
  "companyName": "Công ty ABC",
  "employeeCount": "50-100",
  "phone": "0912345678",
  "email": "hr@company.com",
  "currentInsurance": "Bảo Việt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm."
}
```

#### GET `/api/health`
Kiểm tra trạng thái server.

### 🎨 Màu sắc Leapstack

- **Primary Green:** `#00C48C`
- **Dark Navy:** `#111827`
- **Off White:** `#F5F7FA`
- **Amber:** `#F59E0B`
- **Red:** `#EF4444`

### 📧 Email Configuration

Hệ thống gửi 2 loại email:

1. **Email xác nhận cho người dùng** - Gửi tự động sau khi form được gửi thành công
2. **Email thông báo cho admin** - Thông báo về đơn đăng ký mới

### 🔐 Bảo mật

- Xác thực input từ phía client và server
- Validation email & phone number
- CORS được bật (có thể cấu hình)
- Environment variables cho sensitive data

### 📦 Cấu trúc dự án

```
my-landing-page/
├── index.html          # Landing page HTML
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Dependencies
├── .env.example        # Example environment variables
└── README.md          # Documentation
```

### 🚀 Deployment

#### Heroku
1. Push code lên GitHub
2. Connect Heroku với GitHub repo
3. Set environment variables trong Heroku dashboard
4. Deploy

#### Render
1. Tạo tài khoản Render
2. Tạo Web Service
3. Chọn GitHub repo
4. Set environment variables
5. Deploy

### 📞 Support

Leapstack
- 📱 1900 57 1233
- 📧 info@leapstack.vn
- 📍 Tầng trệt, 90/88B Nguyễn Đình Chiểu, P. Tân Định, TP.HCM

### 📄 License

MIT

---

**Made with ❤️ by Leapstack Team**
