// Intersection Observer for fade-up animations
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) e.target.classList.add('visible'); 
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });
});

// Form submission with backend integration
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');
const formBody = document.getElementById('formBody');
const successOverlay = document.getElementById('successOverlay');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    formError.style.display = 'none';
    formError.textContent = '';
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
      fullName: formData.get('fullName'),
      position: formData.get('position'),
      companyName: formData.get('companyName'),
      employeeCount: formData.get('employeeCount'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      currentInsurance: formData.get('currentInsurance') || 'Không chọn'
    };
    
    // Validate required fields
    if (!data.fullName || !data.position || !data.companyName || !data.employeeCount || !data.phone || !data.email) {
      formError.textContent = 'Vui lòng điền đầy đủ tất cả các trường bắt buộc';
      formError.style.display = 'block';
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      formError.textContent = 'Vui lòng nhập email hợp lệ';
      formError.style.display = 'block';
      return;
    }
    
    // Validate phone format
    const phoneRegex = /^\d{10,11}$/;
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (!phoneRegex.test(phoneDigits)) {
      formError.textContent = 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)';
      formError.style.display = 'block';
      return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
    
    try {
      // Send data to backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        formBody.style.display = 'none';
        successOverlay.style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(() => {
          form.reset();
          formBody.style.display = 'block';
          successOverlay.style.display = 'none';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Đăng ký nhận tư vấn miễn phí →';
        }, 5000);
      } else {
        throw new Error(result.message || 'Lỗi server');
      }
    } catch (error) {
      console.error('Error:', error);
      formError.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      formError.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Đăng ký nhận tư vấn miễn phí →';
    }
  });
}