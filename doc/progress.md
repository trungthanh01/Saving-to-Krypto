# Quá trình thực hiện dự án Savvy

Đây là nơi ghi lại các bước đã hoàn thành cho mỗi task.

---

### Task 3.1 (theo task.xml) / 4.1 (theo detail-task.md): Hiển thị thông báo động viên

- **Bước 1:** Tạo state `goalMessage` bằng `useState` để lưu trữ chuỗi thông báo, với giá trị khởi tạo là chuỗi rỗng.
- **Bước 2:** Trong hàm `handleAddSaving`, sau khi cập nhật state `savings`, gọi `setGoalMessage` với một lời động viên để hiển thị thông báo.
- **Bước 3:** Sử dụng kỹ thuật render có điều kiện (`{goalMessage && ...}`) trong JSX để hiển thị thông báo ra UI chỉ khi `goalMessage` có nội dung.
- **Bước 4:** Dùng `useEffect` để theo dõi sự thay đổi của `goalMessage`. Khi `goalMessage` có nội dung, một `setTimeout` được kích hoạt để tự động xóa thông báo sau 3 giây.
- **Bước 5:** Triển khai "cleanup function" bên trong `useEffect` để gọi `clearTimeout`, đảm bảo không có lỗi timer khi người dùng thực hiện hành động liên tục.

---

### Crypto Portfolio - Giai đoạn 1: MVP (Chi tiết)

- **Task 1.1: Thiết lập nền tảng**
    - **Bước 1:** Tạo các thư mục cần thiết: `src/components/portfolio/` và `src/services/`.
    - **Bước 2:** Cài đặt thư viện `axios` bằng lệnh `npm install axios`.

- **Task 1.2: Xây dựng Service API**
    - **Bước 1:** Tạo file `src/services/crypto-api.js`.
    - **Bước 2:** Viết hàm `fetchCoinData` bất đồng bộ (`async`) để nhận một mảng `coinIds`.
    - **Bước 3:** Sử dụng `try/catch` để xử lý logic gọi API và các lỗi tiềm ẩn.
    - **Bước 4:** Dùng `axios.get` với `await` để gọi đến endpoint của CoinGecko.
    - **Bước 5:** `return response.data` khi thành công và `throw error` khi thất bại.
    - **Bước 6 (Kiểm tra):** Tạm thời gọi hàm này trong một file bất kỳ và dùng `console.log` để xác nhận đã nhận được dữ liệu.

- **Task 1.3: Khởi tạo State Portfolio**
    - **Bước 1:** Trong `App.jsx`, import `useState`.
    - **Bước 2:** Khai báo state `holdings` và cung cấp một mảng dữ liệu mẫu để làm việc.

- **Task 1.4: Xây dựng Component Hiển thị `Portfolio.jsx`**
    - **Bước 1:** Tạo file component và bộ khung, đảm bảo nhận được prop `holdings`.
    - **Bước 2:** Chuẩn bị các state nội bộ: `marketData`, `isLoading`, `error`.
    - **Bước 3:** Viết `useEffect` với dependency là `[holdings]` để gọi API.
    - **Bước 4:** Bên trong `useEffect`, lấy danh sách ID từ `holdings`, gọi `fetchCoinData`, và cập nhật các state `marketData`, `isLoading`, `error` tương ứng.
    - **Bước 5:** Viết JSX để xử lý hiển thị có điều kiện cho các trạng thái loading và error.
    - **Bước 6:** Viết logic render chính: Dùng `.map()` duyệt qua `marketData`, và với mỗi `coinData`, dùng `.find()` trên `holdings` để lấy `amount`, sau đó tính toán `totalValue` và hiển thị tất cả thông tin.

- **Task 1.5: Xây dựng Form và Tích hợp**
    - **Bước 1:** Tạo component `AddHoldingForm.jsx`.
    - **Bước 2:** Dùng `useState` để quản lý state cho các ô input (`coinId`, `amount`).
    - **Bước 3:** Viết hàm `handleAction` để xử lý form, tạo object `newHolding`, gọi prop `onAddHolding`, và reset form. Sử dụng `action` prop trên thẻ `<form>`.
    - **Bước 4:** Trong `App.jsx`, viết hàm logic `handleAddHolding` để nhận `newHolding`. Hàm này xử lý cả hai trường hợp: thêm coin mới (thêm vào mảng) và cập nhật coin đã có (dùng `.map()` để cộng dồn `amount`).
    - **Bước 5:** Import và render `<AddHoldingForm />` trong `App.jsx`, truyền hàm `handleAddHolding` vào prop `onAddHolding`.
