# Chi Tiết Công Việc - Dự án "Crypto Portfolio"

Đây là kế hoạch chi tiết để tích hợp tính năng quản lý danh mục đầu tư crypto vào ứng dụng Savvy. Chúng ta sẽ tiếp cận theo phương pháp **Sản phẩm Khả dụng Tối thiểu (Minimum Viable Product - MVP)**, xây dựng các tính năng cốt lõi trước, sau đó liên tục nâng cấp và hoàn thiện.

---

### **Giai đoạn 1: MVP - Hiển thị Danh mục Đầu tư Cốt lõi**
*Mục tiêu: Xây dựng phiên bản đơn giản nhất để có thể nhập và hiển thị danh sách các coin đang nắm giữ cùng với tổng giá trị của chúng. Giai đoạn này tập trung vào hai kỹ năng mới quan trọng: **gọi API** và **xử lý tác vụ bất đồng bộ**.*

- [x] **Task 1.1: Thiết lập cấu trúc & công cụ**
  - **Mục đích:** Chuẩn bị nền tảng code và các thư viện cần thiết cho tính năng mới.
  - **Hành động:**
    - Tạo cấu trúc thư mục mới: `src/components/portfolio/` và `src/services/`.
    - Cài đặt thư viện `axios` để thực hiện các cuộc gọi API: `npm install axios`.

- [x] **Task 1.2: Xây dựng Service gọi API CoinGecko**
  - **Mục đích:** Tạo một nơi tập trung, tái sử dụng được để lấy dữ liệu giá crypto từ một nguồn bên ngoài.
  - **Hành động:**
    - Tạo file `src/services/crypto-api.js`.
    - Viết một hàm bất đồng bộ (async function), ví dụ `fetchCoinData(coinIds)`, sử dụng `axios` để gọi API của CoinGecko và lấy dữ liệu thị trường của các đồng coin được yêu cầu.

- [x] **Task 1.3: Quản lý State Portfolio trong App.jsx**
  - **Mục đích:** Sử dụng kiến thức đã có về `useState` để quản lý danh sách các coin người dùng sở hữu.
  - **Hành động:**
    - Trong `App.jsx`, tạo một state mới tên là `holdings` với `useState`.
    - Dữ liệu `holdings` sẽ là một mảng các object, ví dụ: `[{ id: 'bitcoin', amount: 0.5 }, { id: 'ethereum', amount: 10 }]`.

- [x] **Task 1.4: Xây dựng Giao diện Portfolio cơ bản**
  - **Mục đích:** Tạo component để hiển thị danh mục đầu tư và học cách kết hợp hiển thị dữ liệu tĩnh (từ state) và dữ liệu động (từ API).
  - **Hành động:**
    - Tạo component `Portfolio.jsx` trong `src/components/portfolio/`.
    - Component này sẽ nhận `holdings` làm prop, dùng `useEffect` để gọi hàm `fetchCoinData` và lưu kết quả trả về vào một state nội bộ (ví dụ `coinMarketData`).
    - Render ra một danh sách đơn giản hiển thị: Tên coin, số lượng, giá hiện tại, và tổng giá trị của từng khoản đầu tư.

- [x] **Task 1.5: Hoàn thiện Tích hợp & Chức năng Thêm Coin**
  - **Mục đích:** Hiển thị module portfolio trên giao diện chính và cho phép người dùng thêm coin mới vào danh mục của họ.
  - **Hành động:**
    - Import và hiển thị component `<Portfolio />` trong `App.jsx`.
    - Tạo một form rất đơn giản (chưa cần modal) để người dùng có thể nhập ID của coin (ví dụ: 'bitcoin') và số lượng, sau đó cập nhật vào state `holdings`.

---

### **Giai đoạn 2: Tái cấu trúc với Context API**
*Mục tiêu: Khi tính năng bắt đầu phức tạp hơn, chúng ta sẽ học cách quản lý state "toàn cục" (global state) bằng Context API. Điều này giúp tách biệt logic ra khỏi các component giao diện, làm cho code sạch sẽ và dễ bảo trì hơn.*

- [x] **Task 2.1: Tạo Portfolio Context**
  - **Mục đích:** Xây dựng một "kho chứa" state tập trung cho toàn bộ tính năng portfolio.
  - **Hành động:**
    - Tạo thư mục `src/context/`.
    - Tạo file `src/context/PortfolioContext.jsx`, định nghĩa `PortfolioContext` và `PortfolioProvider`.
    - Di chuyển state `holdings` và tất cả logic liên quan (thêm coin, gọi API) từ `App.jsx` và `Portfolio.jsx` vào trong `PortfolioProvider`.

- [x] **Task 2.2: Tích hợp Context Provider**
  - **Mục đích:** "Bao bọc" ứng dụng của chúng ta để mọi component bên trong đều có khả năng truy cập vào state của portfolio.
  - **Hành động:**
    - Trong `main.jsx`, import và bao bọc component `<App />` bằng `<PortfolioProvider>`.

- [x] **Task 2.3: Sử dụng Context trong Component**
  - **Mục đích:** Trải nghiệm sự tiện lợi của việc lấy dữ liệu trực tiếp từ Context thay vì phải truyền props qua nhiều cấp (prop drilling).
  - **Hành động:**
    - Trong component `Portfolio.jsx`, sử dụng hook `useContext` để lấy dữ liệu `holdings` và các hàm cần thiết.
    - Xóa việc truyền props từ `App.jsx`.

---

### **Giai đoạn 3: Trực quan hóa Dữ liệu với Biểu đồ**
*Mục tiêu: Học cách tích hợp và sử dụng một thư viện của bên thứ ba (`Recharts`) để biến những con số khô khan thành một biểu đồ trực quan, dễ hiểu.*

- [x] **Task 3.1: Cài đặt và Chuẩn bị**
  - **Mục đích:** Thêm thư viện vẽ biểu đồ vào dự án.
  - **Hành động:**
    - Chạy lệnh `npm install recharts` trong terminal.

- [x] **Task 3.2: Xây dựng Component `HoldingsChart`**
  - **Mục đích:** Tạo một biểu đồ tròn (Pie Chart) để thể hiện tỷ trọng giá trị của mỗi loại coin trong tổng danh mục.
  - **Hành động:**
    - Tạo file `src/components/portfolio/HoldingsChart.jsx`.
    - Lấy dữ liệu từ `PortfolioContext`.
    - Xử lý và tính toán dữ liệu để có định dạng mà `Recharts` yêu cầu (ví dụ: `[{ name: 'Bitcoin', value: 45000 }, ...]`).
    - Render component `PieChart` từ `Recharts` và truyền dữ liệu vào.
    
---

### **Giai đoạn 4: Hoàn thiện Trải nghiệm & Dữ liệu**
*Mục tiêu: Chuyển đổi từ dữ liệu giả sang dữ liệu thật do người dùng nhập, lưu trữ chúng bền bỉ và xây dựng các tính năng quản lý cốt lõi.*

- [x] **Task 4.1: Lưu trữ Dữ liệu Portfolio (Persistence)**
  - **Mục đích:** Đảm bảo dữ liệu `holdings` của người dùng không bị mất mỗi khi tải lại trang, bằng cách sử dụng `localStorage`.
  - **Hành động:**
    - Trong `PortfolioContext`, sửa `useState` của `holdings` để đọc dữ liệu từ `localStorage` khi khởi tạo.
    - Thêm `useEffect` để tự động lưu `holdings` vào `localStorage` mỗi khi có thay đổi.
    - Xóa mảng dữ liệu giả ban đầu.

- [x] **Task 4.2: Xây dựng Lịch sử Giao dịch**
  - **Mục đích:** Cung cấp cho người dùng một bản ghi chi tiết về tất cả các giao dịch họ đã thực hiện.
  - **Hành động:**
    - Tạo state mới `transactions` trong `PortfolioContext`, cũng được lưu vào `localStorage`.
    - Cập nhật hàm `handleAddHolding` để tạo và lưu một bản ghi giao dịch mới.
    - Tạo component `TransactionHistory.jsx` để hiển thị danh sách giao dịch.

- [x] **Task 4.3: Triển khai Chức năng Xóa Giao dịch**
  - **Mục đích:** Cho phép người dùng sửa lỗi hoặc xóa các giao dịch không mong muốn, đồng thời cập nhật lại chính xác danh mục đầu tư.
  - **Hành động:**
    - Tạo hàm `handleDeleteTransaction` trong `PortfolioContext`.
    - Logic: Hàm này sẽ tìm giao dịch, hoàn trả số lượng coin về cho `holdings`, sau đó xóa giao dịch khỏi `transactions`.
    - Thêm nút Xóa vào `TransactionHistory.jsx` và kết nối nó với hàm mới.

---

### **Giai đoạn 5: Nâng cao và Tối ưu**
*Mục tiêu: Quay trở lại kế hoạch ban đầu và bổ sung các tính năng nâng cao để hoàn thiện sản phẩm, mang lại trải nghiệm người dùng tốt hơn.*

- [x] **Task 5.1: Nâng cấp Chức năng 'Thêm Giao dịch' với Modal**
  - **Mục đích:** Cải thiện trải nghiệm người dùng bằng cách sử dụng Modal cho việc thêm/sửa giao dịch, thay vì form tĩnh.
  - **Hành động:**
    - Tái sử dụng hoặc tạo mới một component Modal.
    - Tích hợp form thêm giao dịch vào bên trong Modal.

- [x] **Task 5.2: Hiển thị Tổng quan Portfolio (Summary)**
  - **Mục đích:** Cung cấp cho người dùng cái nhìn tổng quan nhanh về hiệu suất danh mục đầu tư.
  - **Hành động:**
    - Tạo component `PortfolioSummary.jsx`.
    - Tính toán và hiển thị các thông tin như: tổng giá trị, tổng vốn, và tổng lời/lỗ.

---

### **Giai đoạn 6: Nâng cao Trải nghiệm Người dùng (UX Enhancement)**
*Mục tiêu: Dựa trên kế hoạch chi tiết, chúng ta sẽ bổ sung các tính năng làm cho ứng dụng trở nên chuyên nghiệp và hữu ích hơn, tập trung vào việc cung cấp thêm thông tin chi tiết cho người dùng.*

- [x] **Task 6.1: Nâng cấp `PortfolioSummary` với Dữ liệu 24h** (Ref: task-invest 4.1)
  - **Mục đích:** Cung cấp cho người dùng thông tin nhanh về sự biến động của thị trường trong ngày gần nhất.
  - **Hành động:**
    - Lấy thêm dữ liệu `price_change_percentage_24h` và `price_change_24h` từ API.
    - Tính toán tổng thay đổi (dưới dạng tiền và %) của toàn bộ danh mục trong 24 giờ.
    - Hiển thị thông tin này trong component `PortfolioSummary`.

- [x] **Task 6.2: Nâng cấp `Portfolio` thành Bảng Dữ liệu Chi tiết** (Ref: task-invest 5.1, 5.2)
  - **Mục đích:** Thay thế danh sách đơn giản bằng một bảng dữ liệu chuyên nghiệp, cung cấp nhiều thông tin hơn và cho phép tương tác.
  - **Hành động:**
    - Chuyển đổi layout của `Portfolio.jsx` sang dạng bảng (`<table>`).
    - Tạo component con `HoldingItem.jsx` cho mỗi hàng trong bảng.
    - Bổ sung các cột mới: Giá, Thay đổi 1h/24h/7d (%), Lời/Lỗ cho từng khoản đầu tư.
    - Hiển thị logo, tên và ký hiệu của coin.
    - (Nâng cao) Thêm chức năng sắp xếp bảng bằng cách click vào tiêu đề cột.

- [ ] **Task 6.3: Xây dựng Biểu đồ Hiệu suất (Performance Chart)** (Ref: task-invest 4.3)
  - **Mục đích:** Trực quan hóa sự tăng trưởng của danh mục đầu tư theo thời gian, giúp người dùng có cái nhìn dài hạn.
  - **Hành động:**
    - Tạo component `PerformanceChart.jsx`.
    - Tìm hiểu cách lấy dữ liệu lịch sử (`market_chart`) từ API CoinGecko.
    - Xây dựng bộ lọc thời gian (24h, 7d, 1m, 3m, 1y).
    - Sử dụng `Recharts` để vẽ biểu đồ đường (Line Chart) thể hiện tổng giá trị danh mục theo thời gian.

---

### **Giai đoạn 7: Đại tu Logic Giao dịch & PnL Chính xác**
*Mục tiêu: Nâng cấp hệ thống từ một công cụ theo dõi đơn giản thành một công cụ quản lý danh mục đầu tư thực thụ bằng cách xử lý logic Mua/Bán và tính toán Lời/Lỗ dựa trên giá vốn thực tế.*

- [x] **Task 7.1: Nâng cấp Cấu trúc Dữ liệu Giao dịch**
  - **Mục đích:** Mở rộng mô hình dữ liệu để lưu trữ thông tin quan trọng cho việc tính toán PnL.
  - **Hành động:**
    - Cập nhật cấu trúc của một object `transaction` trong state để bao gồm: `type: 'buy' | 'sell'` và `pricePerCoin: number`.

- [x] **Task 7.2: Tái cấu trúc Form & Logic Thêm Giao dịch**
  - **Mục đích:** Cập nhật giao diện và hàm xử lý để người dùng có thể nhập giao dịch Mua/Bán với giá cụ thể.
  - **Hành động:**
    - Đổi tên `AddHoldingForm.jsx` thành `AddTransactionForm.jsx`.
    - Thêm các trường nhập liệu mới vào form: Lựa chọn Mua/Bán, Input cho "Giá mỗi coin".
    - Sửa đổi hàm `handleAddTransaction` (trước là `handleAddHolding`) để nhận và xử lý các dữ liệu mới này.

- [x] **Task 7.3: Triển khai Logic Cập nhật `holdings` cho Mua/Bán**
  - **Mục đích:** Xây dựng logic nền tảng để cập nhật chính xác danh mục tài sản sau mỗi giao dịch.
  - **Hành động:**
    - Bên trong `handleAddTransaction`, triển khai logic:
      - Nếu là `buy`: Cộng dồn số lượng vào `holdings`.
      - Nếu là `sell`: Trừ bớt số lượng khỏi `holdings`.
    - Đảm bảo xử lý trường hợp một coin mới được mua lần đầu.

- [x] **Task 7.4: Viết lại Logic tính `costBasis` và `profitLoss`**
  - **Mục đích:** Tính toán Lời/Lỗ một cách chính xác dựa trên lịch sử giao dịch.
  - **Hành động:**
    - Trong `PortfolioContext.jsx`, tạo một hàm tính toán `costBasis` (giá vốn) cho mỗi coin bằng cách duyệt qua mảng `transactions`.
    - Cập nhật lại công thức tính `profitLoss` trong `HoldingItem.jsx` và `PortfolioSummary.jsx` để sử dụng `costBasis` mới.

- [x] **Task 7.5: Cập nhật Giao diện Lịch sử Giao dịch**
  - **Mục đích:** Hiển thị đầy đủ thông tin giao dịch cho người dùng.
  - **Hành động:**
    - Trong `TransactionHistory.jsx`, thêm các cột mới để hiển thị `Loại` (Mua/Bán) và `Giá giao dịch`.

---

### **Giai đoạn 8: Hoàn thiện Tính năng Quản lý**
*Mục tiêu: Cung cấp cho người dùng đầy đủ các công cụ để quản lý giao dịch của họ một cách hiệu quả.*

- [x] **Task 8.1: Nâng cấp Modal 'Thêm Giao dịch' với Autocomplete** (Ref: task-invest 5.3)
  - **Mục đích:** Cải thiện trải nghiệm nhập liệu, giúp người dùng tìm kiếm và chọn coin một cách chính xác.
  - **Hành động:**
    - Tìm một API endpoint của CoinGecko để lấy danh sách tất cả các coin (`/coins/list`).
    - Tích hợp một thư viện autocomplete hoặc tự xây dựng logic tìm kiếm.
    - Khi người dùng gõ, hiển thị một danh sách gợi ý các coin phù hợp.

- [x] **Task 8.2: Xây dựng Chức năng Sửa Giao dịch** (Ref: task-invest 5.4)
  - **Mục đích:** Cho phép người dùng chỉnh sửa các giao dịch đã nhập sai (ví dụ: sai số lượng, sai giá mua, sai ngày).
  - **Hành động:**
    - Tạo một Modal `EditTransactionModal.jsx`.
    - Khi người dùng click nút "Sửa" trên một giao dịch, Modal sẽ hiện ra với thông tin của giao dịch đó.
    - Tạo hàm `handleEditTransaction` trong Context để xử lý logic cập nhật.

- [x] **Task 8.3: Nâng cấp Chức năng Xóa với Modal Xác nhận** (Ref: task-invest 5.5)
  - **Mục đích:** Thay thế `window.confirm` mặc định bằng một modal xác nhận có giao diện đẹp và thân thiện hơn.
  - **Hành động:**
    - Tạo component `ConfirmationModal.jsx`.
    - Khi người dùng click nút "Xóa", hiển thị modal này để hỏi xác nhận.

---

### **Giai đoạn 9: Kiểm thử & Tối ưu hóa (Testing & Optimization)** (Ref: task-invest 8.1, 8.2, 8.3)
*Mục tiêu: Đảm bảo chất lượng và hiệu suất của ứng dụng. Chúng ta sẽ học các kỹ thuật nâng cao để làm cho ứng dụng chạy nhanh, mượt và đáng tin cậy.*

- [x] **Task 9.1: Tối ưu hóa Hiệu suất Render**
  - **Mục đích:** Ngăn chặn việc render lại không cần thiết, giúp ứng dụng phản hồi nhanh hơn.
  - **Hành động:**
    - Áp dụng `React.memo` cho các component ít thay đổi (ví dụ: `HoldingItem`).
    - Sử dụng `useMemo` để "ghi nhớ" các kết quả tính toán phức tạp (ví dụ: `portfolioTotalValue`, `chartData`).
    - Sử dụng `useCallback` để "ghi nhớ" các hàm được truyền xuống component con.

- [x] **Task 9.2: Xử lý Lỗi Nâng cao & Trạng thái Trống**
  - **Mục đích:** Cải thiện trải nghiệm người dùng khi có lỗi hoặc không có dữ liệu.
  - **Hành động:**
    - Xây dựng các component hiển thị trạng thái "trống" (ví dụ: "Bạn chưa có giao dịch nào", "Không tìm thấy kết quả").
    - Tìm hiểu về `Error Boundaries` để "bắt" các lỗi render và hiển thị giao diện dự phòng.

- [ ] **Task 9.3: (Tùy chọn) Viết Unit Test cơ bản**
  - **Mục đích:** Đảm bảo các hàm logic quan trọng (ví dụ: các hàm tính toán trong `utils`) hoạt động chính xác.
  - **Hành động:**
    - Cài đặt Jest và React Testing Library.
    - Viết một vài bài test đơn giản cho các hàm tính toán `totalCostBasis`, `totalProfitLoss`.

---

### **Giai đoạn 10: Hoàn thiện Luồng "Chốt lời" - Từ Gợi ý đến Hành động**
*Mục tiêu: Nâng cấp hệ thống gợi ý và xây dựng một luồng hành động hoàn chỉnh, cho phép người dùng sử dụng lợi nhuận từ portfolio để hoàn thành các mục tiêu tiết kiệm một cách trực quan và đầy ý nghĩa.*

- [x] **Task 10.1: Nâng cấp Logic Gợi ý để Phân loại Mục tiêu Độc lập**
  - **Mục đích:** Thay đổi logic để so sánh tổng lợi nhuận với **từng** mục tiêu riêng lẻ, thay vì gộp chung. Điều này giúp đưa ra gợi ý chính xác và khả thi hơn.
  - **Hành động:**
    - Trong `PortfolioContext.jsx`, sửa lại `useEffect` của `smartSuggestions`.
    - Lặp qua mảng `goals` và so sánh `totalProfitLoss` với `amountNeeded` (`targetAmount` - `currentAmount`) của từng mục tiêu.
    - Cấu trúc lại state `smartSuggestions` thành một object chứa 2 mảng: `{ completable: [], incomplete: [] }`.

- [x] **Task 10.2: Cập nhật Giao diện `SmartSuggestions` để Hiển thị Phân loại**
  - **Mục đích:** Thiết kế lại component để hiển thị rõ ràng 2 nhóm: mục tiêu có thể hoàn thành và mục tiêu chưa thể.
  - **Hành động:**
    - Sửa `SmartSuggestions.jsx` để đọc cấu trúc dữ liệu mới từ `smartSuggestions`.
    - Render ra 2 khu vực: một cho các mục tiêu `completable` (với gợi ý chi tiết) và một cho các mục tiêu `incomplete`.

- [x] **Task 10.3: Xây dựng Luồng Hoàn thành Mục tiêu Tích hợp**
  - **Mục đích:** Kết nối nút bấm trên gợi ý với hành động ghi nhận giao dịch bán một cách liền mạch.
  - **Hành động:**
    - Tạo hàm `handleInitiateGoalCompletion` trong `PortfolioContext`. Hàm này sẽ được gọi từ nút "Thực hiện" trong `SmartSuggestions`.
    - Khi được gọi, hàm này sẽ mở modal `AddTransactionForm`, có thể điền sẵn `type` là `'sell'` và gợi ý số tiền cần bán.
    - Sửa đổi `AddTransactionForm` để sau khi lưu giao dịch thành công, nó sẽ kích hoạt bước tiếp theo (hoàn thành mục tiêu).

- [x] **Task 10.4: Hoàn thiện Mục tiêu & Hiển thị Modal Chúc mừng**
  - **Mục đích:** Cập nhật trạng thái của mục tiêu trong `SavvyContext` và mang lại phần thưởng tinh thần cho người dùng.
  - **Hành động:**
    - Tạo một `ConfirmationModal` hoặc `CelebrationModal` mới để chúc mừng người dùng.
    - Trong `SavvyContext`, tạo hàm `markGoalAsComplete` để di chuyển một mục tiêu từ danh sách hiện tại sang danh sách đã hoàn thành.
    - Sau khi giao dịch bán ở Task 10.3 được xác nhận, gọi hàm `markGoalAsComplete` và sau đó hiển thị modal chúc mừng.

- [x] **Task 10.5: Xây dựng Lịch sử Mục tiêu (Goal History)**
  - **Mục đích:** Cung cấp cho người dùng cảm giác thành tựu bằng cách lưu lại các mục tiêu đã hoàn thành.
  - **Hành động:**
    - Trong `SavvyContext`, tạo một state mới `completedGoals` và lưu vào `localStorage`.
    - Tạo component `GoalHistory.jsx` để hiển thị danh sách các mục tiêu đã hoàn thành.

---

### **Giai đoạn 11: "Cỗ máy thời gian" DCA - Công cụ tạo Động lực**
+------------------------------------------------------+
|                                                      |
|           **Cỗ Máy Thời Gian DCA** 🚀                |
|                                                      |
|  Đồng coin: [ Bitcoin (BTC)      ▼ ]                 |
|                                                      |
|  Số tiền đầu tư: [ $50 ]                             |
|                                                      |
|  Tần suất:   [ Mỗi tháng          ▼ ]                |
|                                                      |
|  Kể từ:      [ 3 năm trước       ▼ ]                 |
|                                                      |
|                 +-----------------+                  |
|                 |   Xem kết quả   |                  |
|                 +-----------------+                  |
|                                                      |
|  +------------------------------------------------+  |
|  |                                                |  |
|  |   "Nếu bạn đầu tư $50 mỗi tháng vào Bitcoin    |  |
|  |   kể từ 3 năm trước, bây giờ bạn sẽ có         |  |
|  |   $XX,XXX."                                    |  |
|  |                                                |  |
|  +------------------------------------------------+  |
|                                                      |
+------------------------------------------------------+

*   **Tầm nhìn:** Cung cấp một công cụ tính toán giả lập, cho phép người dùng thấy được tiềm năng của việc đầu tư dài hạn theo chiến lược trung bình giá (DCA). Xây dựng nó như một component độc lập và tích hợp vào luồng thêm giao dịch để tối đa hóa động lực.

- [x] **Task 11.1: Tích hợp API Dữ liệu Lịch sử**
  - **Mục đích:** Lấy được dữ liệu giá của một đồng coin trong quá khứ.
  - **Hành động:**
    - Trong `services/crypto-api.js`, tạo hàm mới `fetchCoinHistory(coinId, days)` để gọi API `/coins/{id}/market_chart`.

- [ ] **Task 11.2: Xây dựng Logic Tính toán DCA**
  - **Mục đích:** Tạo ra một hàm "pure" để tính toán kết quả của chiến lược DCA.
  - **Hành động:**
    - Tạo file tiện ích `src/utils/dca-calculator.js`.
    - Viết hàm `calculateDcaResult({ historicalData, investment, frequency, period })` để giả lập quá trình đầu tư và trả về kết quả.

- [ ] **Task 11.3: Xây dựng Component `DcaCalculator`**
  - **Mục đích:** Tạo một công cụ tương tác độc lập để người dùng có thể khám phá các kịch bản DCA.
  - **Hành động:**
    - Tạo file `src/components/dca/DcaCalculator.jsx`.
    - Xây dựng giao diện với các input: chọn coin, số tiền, tần suất, khoảng thời gian.
    - Quản lý state nội bộ cho các input và kết quả, xử lý trạng thái loading.

- [ ] **Task 11.4: Tích hợp `DcaCalculator` vào Giao diện Chính**
  - **Mục đích:** Đặt công cụ DCA vào một vị trí dễ thấy trên trang chính để khuyến khích người dùng sử dụng.
  - **Hành động:**
    - Import và render component `<DcaCalculator />` trong `App.jsx`, ngay phía trên component `SmartSuggestions`.

- [ ] **Task 11.5: Tạo `DcaResultModal`**
  - **Mục đích:** Tạo một modal tái sử dụng để hiển thị kết quả tính toán DCA một cách nổi bật sau khi người dùng thêm một giao dịch.
  - **Hành động:**
    - Tạo file `src/components/dca/DcaResultModal.jsx`.
    - Thiết kế modal để hiển thị thông điệp truyền cảm hứng dựa trên kết quả DCA.

- [ ] **Task 11.6: Kích hoạt Modal sau khi Thêm Giao dịch**
  - **Mục đích:** Cung cấp phản hồi tích cực và củng cố hành vi đầu tư của người dùng.
  - **Hành động:**
    - Trong `PortfolioContext`, sau khi `handleAddTransaction` thành công, kích hoạt flow tính toán DCA.
    - Sử dụng `AppContext` để quản lý state mở/đóng và dữ liệu cho `DcaResultModal`.
    - Hiển thị modal với kết quả tính toán dựa trên giao dịch vừa thực hiện.

---
Tuyệt vời! Đây chính xác là cách tiếp cận của một Senior Developer. Trước khi viết một dòng code nào, chúng ta phải hiểu rõ logic bằng ngôn ngữ tự nhiên.

Hãy cùng nhau đóng vai một "nhà du hành thời gian" và tính toán thử một kịch bản đơn giản nhé.

---

### **Kịch bản ví dụ**

*   **Đầu tư vào:** Bitcoin
*   **Số tiền mỗi tháng:** $100
*   **Bắt đầu từ:** 3 tháng trước (Giả sử là ngày 25/07/2025)
*   **Dữ liệu giá chúng ta có:**
    *   Giá ngày 25/07/2025: **$50,000**
    *   Giá ngày 25/08/2025: **$52,000**
    *   Giá ngày 25/09/2025: **$55,000**
    *   Giá hôm nay (25/10/2025): **$60,000**

---

### **"Chạy tay" từng bước**

**Bước 1: Chuẩn bị sổ sách**

*   `Tổng Tiền Đã Đầu Tư` = $0
*   `Tổng Số Bitcoin Sở Hữu` = 0 BTC

**Bước 2: Chuyến du hành đầu tiên - Quay về ngày 25/07/2025**

*   "Hôm nay là ngày đầu tư đầu tiên. Tôi sẽ bỏ ra **$100**."
*   "Tôi nhìn vào bảng giá, giá Bitcoin hôm nay là **$50,000**."
*   **Công thức:** `Số Bitcoin mua được = Số tiền bỏ ra / Giá tại thời điểm đó`
*   **Tính toán:** `$100 / $50,000 = 0.002` BTC.
*   **Cập nhật sổ sách:**
    *   `Tổng Tiền Đã Đầu Tư` = $0 + $100 = **$100**
    *   `Tổng Số Bitcoin Sở Hữu` = 0 + 0.002 = **0.002 BTC**

**Bước 3: Chuyến du hành thứ hai - Tiến tới ngày 25/08/2025**

*   "Đã một tháng trôi qua. Hôm nay tôi lại bỏ ra **$100** nữa."
*   "Giá Bitcoin hôm nay đã tăng lên **$52,000**."
*   **Công thức:** (Vẫn là công thức cũ)
*   **Tính toán:** `$100 / $52,000 = 0.00192` BTC (làm tròn).
*   **Cập nhật sổ sách:**
    *   `Tổng Tiền Đã Đầu Tư` = $100 + $100 = **$200**
    *   `Tổng Số Bitcoin Sở Hữu` = 0.002 + 0.00192 = **0.00392 BTC**

**Bước 4: Chuyến du hành cuối cùng - Tiến tới ngày 25/09/2025**

*   "Lần đầu tư cuối cùng trong quá khứ. Bỏ ra **$100**."
*   "Giá hôm nay là **$55,000**."
*   **Công thức:** (Vẫn là công thức cũ)
*   **Tính toán:** `$100 / $55,000 = 0.00181` BTC (làm tròn).
*   **Cập nhật sổ sách:**
    *   `Tổng Tiền Đã Đầu Tư` = $200 + $100 = **$300**
    *   `Tổng Số Bitcoin Sở Hữu` = 0.00392 + 0.00181 = **0.00573 BTC**

**Bước 5: Quay về hiện tại - Ngày 25/10/2025**

*   "Chuyến du hành kết thúc. Giờ hãy xem thành quả."
*   "Giá Bitcoin hiện tại là **$60,000**."
*   **Công thức:** `Giá Trị Hiện Tại = Tổng Số Bitcoin Sở Hữu * Giá Hiện Tại`
*   **Tính toán:** `0.00573 * $60,000 = $343.8`

---

### **Kết quả cuối cùng**

Sau khi kết thúc quá trình, chúng ta sẽ trả về một object kết quả:

```
{
  totalInvested: 300,        // Tổng số tiền đã bỏ ra
  totalCoins: 0.00573,       // Tổng số coin tích lũy được
  currentValue: 343.8,       // Giá trị của số coin đó ở hiện tại
  // (Chúng ta có thể tính thêm cả PnL)
  profitLoss: 43.8           // Lời/lỗ = 343.8 - 300
}
```
chúng ta cần có:
- tổng số tiền đầu tư: vốn kỳ trước + vốn kỳ này (tuần hoặc tháng)
- tổng số bitcoin sở hữu: tổng số kỳ trước + tổng số kỳ này 
- giá trị hiện tại: tổng số bitcoin sỡ hữu * giá hiện tại


### **Giai đoạn 12: Hoàn thiện & Triển khai (Polish & Deployment)**
*Mục tiêu: Đóng gói sản phẩm và đưa nó ra mắt công chúng.*

- [ ] **Task 12.1: Viết Tài liệu Hướng dẫn & Hoàn thiện README**
  - **Mục đích:** Giúp người dùng khác (hoặc chính bạn trong tương lai) có thể dễ dàng cài đặt và hiểu được project.
  - **Hành động:**
    - Cập nhật file `README.md` với hướng dẫn cài đặt, mô tả các tính năng, và giải thích cấu trúc project.

- [ ] **Task 12.2: Triển khai Ứng dụng**
  - **Mục đích:** Đưa ứng dụng của bạn lên Internet để mọi người có thể truy cập.
  - **Hành động:**
    - Tìm hiểu về các nền tảng triển khai miễn phí như Vercel hoặc Netlify.
    - Thực hiện build ứng dụng cho môi trường production.
    - Triển khai và nhận về một đường link công khai cho ứng dụng của bạn.
