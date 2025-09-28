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

## Giai đoạn 1: Xây dựng MVP (Hoàn thành)

- **Task 1.1: Chuẩn bị Cấu trúc & Cài đặt**
  - Bước 1: Tạo cấu trúc thư mục `components/portfolio`, `services`, `context`.
  - Bước 2: Cài đặt thư viện `axios` để gọi API.
- **Task 1.2: Xây dựng Service gọi API CoinGecko**
  - Bước 1: Tạo file `services/crypto-api.js`.
  - Bước 2: Viết hàm `fetchCoinData` bất đồng bộ để lấy dữ liệu từ API.
  - Bước 3: Xử lý lỗi bằng `try...catch`.
- **Task 1.3: Quản lý State cơ bản trong App.jsx**
  - Bước 1: Tạo state `holdings` với dữ liệu giả.
- **Task 1.4: Xây dựng Component UI Portfolio cơ bản**
  - Bước 1: Tạo component `Portfolio.jsx`.
  - Bước 2: Dùng `useEffect` và `useState` để gọi API và quản lý các trạng thái `marketData`, `isLoading`, `error`.
  - Bước 3: Viết logic để kết hợp `holdings` (số lượng) và `marketData` (thông tin giá).
  - Bước 4: Render danh sách các coin ra giao diện.
- **Task 1.5: Tích hợp chức năng Thêm Coin**
  - Bước 1: Tạo component `AddHoldingForm.jsx`.
  - Bước 2: Viết hàm `handleAddHolding` trong `App.jsx` để cập nhật state `holdings`.
  - Bước 3: Truyền hàm `handleAddHolding` xuống `AddHoldingForm` qua props.

## Giai đoạn 2: Tái cấu trúc với Context API (Hoàn thành)

- **Task 2.1: Tạo PortfolioContext**
  - Bước 1: Tạo file `context/PortfolioContext.jsx`.
  - Bước 2: Sử dụng `createContext` để tạo `PortfolioContext`.
- **Task 2.2: Xây dựng PortfolioProvider**
  - Bước 1: Tạo component `PortfolioProvider`.
  - Bước 2: Di chuyển toàn bộ state (`holdings`, `portfolioData`, `isLoading`, `error`) và logic (`handleAddHolding`, `useEffect` gọi API) từ `App.jsx` và `Portfolio.jsx` vào `PortfolioProvider`.
  - Bước 3: Cung cấp các state và hàm xử lý cho toàn bộ ứng dụng qua `Provider value`.
- **Task 2.3: Tích hợp Context vào ứng dụng**
  - Bước 1: Bọc component `<App />` trong `<PortfolioProvider />` tại file `main.jsx`.
  - Bước 2: Sử dụng `useContext` trong `Portfolio.jsx` và `AddHoldingForm.jsx` để lấy dữ liệu và hàm xử lý trực tiếp từ Context, loại bỏ prop drilling.

## Giai đoạn 3: Tích hợp Biểu đồ (Hoàn thành)

- **Task 3.1: Cài đặt Recharts**
  - Bước 1: Chạy lệnh `npm install recharts`.
- **Task 3.2: Xây dựng Component HoldingsChart**
  - Bước 1: Tạo component `HoldingsChart.jsx`.
  - Bước 2: Dùng `useContext` để lấy `portfolioData`.
  - Bước 3: Viết hàm để biến đổi `portfolioData` sang định dạng mà Recharts yêu cầu (`{ name, value }`).
  - Bước 4: Sử dụng các component `<PieChart>`, `<Pie>`, `<Tooltip>`, `<Cell>` để vẽ biểu đồ.

## Giai đoạn 4: Hoàn thiện & Sửa lỗi (Hoàn thành)

- **Task 4.1: Hoàn thiện giao diện**
  - Bước 1: Dùng CSS Flexbox để tạo layout responsive cho danh sách portfolio và biểu đồ.
  - Bước 2: Thêm màu sắc và nhãn cho biểu đồ để tăng tính trực quan.
- **Task 4.2: Gỡ lỗi (Debugging)**
  - Bước 1: Gỡ lỗi xung đột phiên bản giữa `recharts` và `React 19`.
  - Bước 2: Hạ cấp dự án về `React 18` và các `devDependencies` tương thích để đảm bảo sự ổn định.
  - Bước 3: Gỡ lỗi `ERESOLVE` bằng cách đồng bộ hóa toàn bộ hệ thống ESLint.
  - Bước 4: Sửa lỗi `Invalid prop 'action'` trên tất cả các form do khác biệt giữa React 19 và React 18, chuyển từ `action` sang `onSubmit`.