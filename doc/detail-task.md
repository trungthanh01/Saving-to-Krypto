# Chi Tiết Công Việc - Dự án "Savvy"

Đây là nơi chúng ta sẽ theo dõi tiến độ chi tiết của từng task, được đồng bộ từ `doc/task.xml`.

---

### **Giai đoạn 0: Nền Tảng & Thiết Lập (Foundation & Setup)**
*Mục tiêu: Tạo ra một môi trường làm việc sạch sẽ và có cấu trúc tốt, sẵn sàng để phát triển.*

- [x] **Task 0.1: Khởi tạo dự án React**
  - **Mục đích:** Tạo ra bộ khung sườn cơ bản cho ứng dụng.
  - **Hành động:** Sử dụng công cụ Vite để tạo một dự án React mới.
- [x] **Task 0.2: Dọn dẹp và cấu trúc thư mục**
  - **Mục đích:** Tổ chức code một cách logic để dễ dàng tìm kiếm và bảo trì.
  - **Hành động:** Xóa các file mặc định không cần thiết. Tạo cấu trúc thư mục: src/components, src/assets, src/styles.
- [x] **Task 0.3: Thiết lập Styling cơ bản**
  - **Mục đích:** Đảm bảo ứng dụng có một giao diện nhất quán ngay từ đầu.
  - **Hành động:** Tạo file CSS chung để reset style và định nghĩa các biến màu sắc, font chữ.

---

### **Giai đoạn 1: Lõi Dữ Liệu & Giao Diện Tĩnh (Data Core & Static UI)**
*Mục tiêu: Định hình cấu trúc dữ liệu và xây dựng giao diện tĩnh từ dữ liệu giả (mock data).*

- [x] **Task 1.1: Định hình cấu trúc dữ liệu**
  - **Mục đích:** Xác định rõ các thông tin cần lưu trữ cho 'Saving' và 'Goal'.
  - **Hành động:** Thiết kế cấu trúc object cho một khoản tiết kiệm (id, amount, description, date) và một mục tiêu (id, title, targetAmount).
- [x] **Task 1.2: Tạo dữ liệu giả (Mock Data)**
  - **Mục đích:** Có dữ liệu để hiển thị lên UI mà không cần logic phức tạp.
  - **Hành động:** Trong file App.jsx, tạo hai mảng dữ liệu giả cho savings và goals.
- [x] **Task 1.3: Xây dựng các Component tĩnh**
  - **Mục đích:** Tạo ra các thành phần giao diện nhỏ, có thể tái sử dụng.
  - **Hành động:** Tạo các component: GoalCard.jsx, SavingHistoryItem.jsx, AddButton.jsx.
- [x] **Task 1.4: Lắp ráp Giao diện chính**
  - **Mục đích:** Dựng lên màn hình chính của ứng dụng từ các component đã tạo.
  - **Hành động:** Trong App.jsx, sử dụng phương thức .map() để hiển thị danh sách các GoalCard và SavingHistoryItem từ dữ liệu giả.

---

### **Giai đoạn 2: "Thổi Hồn" cho Ứng Dụng (Adding State & Interactivity)**
*Mục tiêu: Làm cho ứng dụng trở nên "sống động" bằng cách quản lý trạng thái và xử lý sự kiện người dùng.*

- [x] **Task 2.1: Quản lý State với React Hooks**
  - **Mục đích:** Chuyển từ dữ liệu giả sang trạng thái động của ứng dụng.
  - **Hành động:** Sử dụng hook useState trong App.jsx để quản lý mảng savings và goals.
- [x] **Task 2.2: Xây dựng Chức năng 'Add Saving'**
  - **Mục đích:** Cho phép người dùng thêm một khoản tiết kiệm mới.
  - **Hành động:** Tạo Modal, Form và viết hàm xử lý logic để thêm một khoản tiết kiệm mới vào state.
- [x] **Task 2.3: Tính toán và cập nhật thanh tiến trình**
  - **Mục đích:** Phản ánh đúng tiến độ tiết kiệm trên các GoalCard.
  - **Hành động:** Viết logic tính tổng tiền tiết kiệm và truyền xuống component GoalCard để tính toán phần trăm hoàn thành.
- [x] **Task 2.4: Xây dựng Chức năng 'Add Goal'**
  - **Mục đích:** Cho phép người dùng thêm mục tiêu mới.
  - **Hành động:** Tạo Modal, Form và viết hàm xử lý logic để thêm một mục tiêu mới vào state.
- [x] **Task 2.5: Xây dựng Chức năng 'Add Saving' cho từng Goal**
  - **Mục đích:** Cho phép user thêm tiền tiết kiệm vào một goal cụ thể.
  - **Hành động:** Nâng cấp GoalCard, App, và AddSavingForm để quản lý và cập nhật tiến trình cho từng goal riêng biệt.
- [x] **Task 2.6: Xây dựng Chức năng Xóa**
  - **Mục đích:** Cho phép người dùng xóa một khoản tiết kiệm đã nhập sai.
  - **Hành động:** Viết hàm xử lý logic xóa một item khỏi mảng savings bằng cách sử dụng id và phương thức .filter().
- [x] **Task 2.7: Lưu dữ liệu vào Local Storage**
  - **Mục đích:** Giúp người dùng không bị mất dữ liệu khi tải lại trang.
  - **Hành động:** Sử dụng hook useEffect để tự động lưu và tải state từ localStorage của trình duyệt.
---

### **Giai đoạn 3: Cải Tiến Ứng Dụng & Thông Minh**
*Mục tiêu: nâng cấp khả năng tương tác giữa ứng dụng và người dùng, đưa ứng dụng trở nên phù hợp với nhiều mục tiêu của người dùng*

- [x]**Task 3.1: Xóa Goal Card**
  - **Mục đích:** Nếu đã có thể thêm mục tiêu thì người dùng cũng cần có thể xóa mục tiêu khi không còn cần đến.
  - **Hành động:** Thêm nút xóa vào mỗi `GoalCard`. Khi nhấn, không chỉ xóa mục tiêu mà còn xóa tất cả các khoản tiết kiệm (`savings`) liên quan. Cần có hộp thoại xác nhận để tránh xóa nhầm.

---
### **Giai đoạn 4: Hoàn Thiện & Tối Ưu (Polishing & Optimizing)**
*Mục tiêu: Cải thiện trải nghiệm người dùng và làm cho ứng dụng trở nên chuyên nghiệp hơn.*

- [x] **Task 4.1: Hiển thị thông báo động viên**
  - **Mục đích:** Tạo sự tương tác thú vị sau khi người dùng thêm một khoản tiết kiệm.
  - **Hành động:** Tạo state để lưu trữ và hiển thị một thông báo động viên trên màn hình chính.

- [x] **Task 4.2: Tinh chỉnh CSS và Responsive**
  - **Mục đích:** Đảm bảo ứng dụng trông đẹp mắt và hoạt động tốt trên mọi kích thước màn hình.
  - **Hành động:** Rà soát lại toàn bộ CSS, sử dụng Flexbox/Grid và Media Queries để tối ưu hóa giao diện cho mobile-first.
