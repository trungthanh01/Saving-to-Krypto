# Quá trình thực hiện dự án Savvy

Đây là nơi ghi lại các bước đã hoàn thành cho mỗi task.

---

### Task 3.1 (theo task.xml) / 4.1 (theo detail-task.md): Hiển thị thông báo động viên

- **Bước 1:** Tạo state `goalMessage` bằng `useState` để lưu trữ chuỗi thông báo, với giá trị khởi tạo là chuỗi rỗng.
- **Bước 2:** Trong hàm `handleAddSaving`, sau khi cập nhật state `savings`, gọi `setGoalMessage` với một lời động viên để hiển thị thông báo.
- **Bước 3:** Sử dụng kỹ thuật render có điều kiện (`{goalMessage && ...}`) trong JSX để hiển thị thông báo ra UI chỉ khi `goalMessage` có nội dung.
- **Bước 4:** Dùng `useEffect` để theo dõi sự thay đổi của `goalMessage`. Khi `goalMessage` có nội dung, một `setTimeout` được kích hoạt để tự động xóa thông báo sau 3 giây.
- **Bước 5:** Triển khai "cleanup function" bên trong `useEffect` để gọi `clearTimeout`, đảm bảo không có lỗi timer khi người dùng thực hiện hành động liên tục.
