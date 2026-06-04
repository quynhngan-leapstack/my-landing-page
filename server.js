const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Form submission endpoint
app.post('/api/submit-form', async (req, res) => {
  try {
    const { fullName, position, companyName, employeeCount, phone, email, currentInsurance } = req.body;

    // Validate input
    if (!fullName || !position || !companyName || !employeeCount || !phone || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Phone validation
    const phoneRegex = /^\d{10,11}$/;
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phoneRegex.test(phoneDigits)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ' 
      });
    }

    // Log the submission (in production, save to database)
    console.log('New form submission:', {
      fullName,
      position,
      companyName,
      employeeCount,
      phone,
      email,
      currentInsurance,
      timestamp: new Date().toISOString()
    });

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Cảm ơn bạn đã đăng ký!</h2>
      <p>Chào ${fullName},</p>
      <p>Leapstack đã nhận được đơn đăng ký của bạn. Chúng tôi sẽ liên hệ xác nhận trong vòng <strong>4 giờ làm việc</strong>.</p>
      <h3>Thông tin bạn cung cấp:</h3>
      <ul>
        <li><strong>Họ tên:</strong> ${fullName}</li>
        <li><strong>Chức vụ:</strong> ${position}</li>
        <li><strong>Công ty:</strong> ${companyName}</li>
        <li><strong>Số nhân viên:</strong> ${employeeCount}</li>
        <li><strong>Điện thoại:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Bảo hiểm hiện tại:</strong> ${currentInsurance}</li>
      </ul>
      <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ:</p>
      <p>
        <strong>Leapstack</strong><br>
        📞 1900 57 1233<br>
        📧 info@leapstack.vn
      </p>
      <p>Trân trọng,<br>Đội ngũ Leapstack</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Leapstack - Xác nhận đăng ký phân tích phúc lợi sức khỏe',
      html: userEmailContent
    });

    // Send notification email to admin
    const adminEmailContent = `
      <h2>Đơn đăng ký mới từ Leapstack</h2>
      <p><strong>Họ tên:</strong> ${fullName}</p>
      <p><strong>Chức vụ:</strong> ${position}</p>
      <p><strong>Công ty:</strong> ${companyName}</p>
      <p><strong>Số nhân viên:</strong> ${employeeCount}</p>
      <p><strong>Điện thoại:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Bảo hiểm hiện tại:</strong> ${currentInsurance}</p>
      <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `📝 Đơn đăng ký mới: ${fullName} - ${companyName}`,
      html: adminEmailContent
    });

    res.json({ 
      success: true, 
      message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.' 
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Leapstack server is running on port ${PORT}`);
  console.log(`📱 Visit http://localhost:${PORT}`);
});
