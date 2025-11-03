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


---

### **Giai đoạn 12: Tái cấu trúc Layout và Điều hướng Trang**
*Mục tiêu: Chuyển đổi từ ứng dụng một trang (Single-Page Application) lộn xộn thành một ứng dụng đa trang có cấu trúc rõ ràng, chuyên nghiệp bằng cách sử dụng thư viện `react-router-dom`. Cải thiện trải nghiệm người dùng bằng cách tổ chức các tính năng vào một layout với thanh điều hướng bên (Sidebar).*

- [ ] **Task 12.1: Cài đặt và Cấu hình React Router**
  - **Mục đích:** Thêm công cụ điều hướng vào dự án.
  - **Hành động:**
    - Chạy lệnh `npm install react-router-dom` trong terminal.
    - Trong `main.jsx`, import `BrowserRouter` và bao bọc component `<App />` bên trong nó để kích hoạt tính năng routing cho toàn bộ ứng dụng.

- [ ] **Task 12.2: Xây dựng Component Layout Chính**
  - **Mục đích:** Tạo ra một "khung sườn" chung cho toàn bộ ứng dụng, bao gồm Sidebar và khu vực hiển thị nội dung chính.
  - **Hành động:**
    - Tạo thư mục mới `src/layouts/`.
    - Tạo file `src/layouts/MainLayout.jsx`. Component này sẽ render ra `Sidebar` và một component `<Outlet />` đặc biệt từ React Router - đây là nơi nội dung của các trang con sẽ được hiển thị.

- [ ] **Task 12.3: Xây dựng Component Sidebar**
  - **Mục đích:** Tạo thanh điều hướng cho phép người dùng chuyển đổi giữa các trang.
  - **Hành động:**
    - Tạo file `src/components/navigation/Sidebar.jsx`.
    - Bên trong component này, sử dụng component `<NavLink>` từ `react-router-dom` để tạo các link tới các trang: Dashboard, Máy tính DCA, Mục tiêu. `<NavLink>` sẽ tự động thêm class "active" khi người dùng đang ở trên trang đó, giúp chúng ta dễ dàng CSS.

- [ ] **Task 12.4: Tổ chức các "Trang" (Pages)**
  - **Mục đích:** Tái cấu trúc lại các component hiện có thành các trang logic, mỗi trang đảm nhiệm một chức năng chính.
  - **Hành động:**
    - Tạo thư mục mới `src/pages/`.
    - Tạo `DashboardPage.jsx`: Di chuyển các component `PortfolioSummary`, `PortfolioTable`, `HoldingsChart`, `TransactionHistory` vào đây.
    - Tạo `DcaCalculatorPage.jsx`: Di chuyển `DcaCalculator` vào đây.
    - Tạo `GoalsPage.jsx`: Di chuyển các component `Savvy`, `AddGoalForm`, `SmartSuggestions` vào đây.

- [ ] **Task 12.5: Cấu hình các Routes trong `App.jsx`**
  - **Mục đích:** Dọn dẹp `App.jsx` và biến nó thành trung tâm điều phối, quyết định URL nào sẽ hiển thị trang nào.
  - **Hành động:**
    - Xóa toàn bộ các component hiển thị trực tiếp trong `App.jsx`.
    - Sử dụng các component `<Routes>` và `<Route>` từ `react-router-dom` để định nghĩa các đường dẫn:
      - Route `/` sẽ render `DashboardPage`.
      - Route `/dca` sẽ render `DcaCalculatorPage`.
      - Route `/goals` sẽ render `GoalsPage`.
    - Tất cả các route này sẽ được lồng bên trong `MainLayout`.

- [ ] **Task 12.6: Viết CSS cho Layout và Sidebar**
  - **Mục đích:** Hoàn thiện giao diện cho khung sườn ứng dụng.
  - **Hành động:**
    - Tạo các file CSS module tương ứng (`MainLayout.module.css`, `Sidebar.module.css`).
    - Sử dụng Flexbox để dàn trang, chia cột cho Sidebar và nội dung chính.
    - Style cho các link trong Sidebar, bao gồm cả trạng thái "active".

### **Giai đoạn 13: Hoàn thiện Giao diện & Trải nghiệm Người dùng**
*Mục tiêu: Tinh chỉnh lại bố cục của các trang chính, bổ sung các thành phần UI còn thiếu và sử dụng CSS Grid/Flexbox để tạo ra một giao diện chuyên nghiệp, responsive và dễ sử dụng.*

- [x] **Task 13.1: Xây dựng Header cho Nội dung chính**
  - **Mục đích:** Tạo một thanh header chung cho khu vực nội dung chính, hiển thị tiêu đề trang và nút hành động chính.
  - **Hành động:**
    - Tạo component `src/components/common/MainHeader.jsx`.
    - Component này sẽ nhận `title` làm prop.
    - Thêm một nút "Thêm Giao dịch" và kết nối nó với `openAddHoldingModal` từ `PortfolioContext`.
    - Tích hợp `<MainHeader />` vào đầu mỗi file trang (`DashboardPage`, `DcaCalculatorPage`, `GoalsPage`).

- [x] **Task 13.2: Tái cấu trúc Bố cục trang Dashboard**
  - **Mục đích:** Sắp xếp các component trên trang Dashboard một cách khoa học và đẹp mắt hơn bằng CSS Grid.
  - **Hành động:**
    - Tạo file CSS module `DashboardPage.module.css`.
    - Sử dụng `display: grid` để định nghĩa các vùng cho `PortfolioSummary`, `PortfolioTable`, và `HoldingsChart`.
    - Áp dụng các class CSS vào `DashboardPage.jsx`.

- [x] **Task 13.3: Tái cấu trúc Bố cục trang Goals**
  - **Mục đích:** Sắp xếp lại các component trên trang Mục tiêu để tạo ra một luồng người dùng hợp lý hơn.
  - **Hành động:**
    - Tạo file CSS module `GoalsPage.module.css`.
    - Sử dụng Flexbox hoặc Grid để bố trí component `Savvy` (danh sách mục tiêu) và `SmartSuggestions` (gợi ý) một cách hợp lý, ví dụ: 2 cột trên màn hình lớn.
    - Áp dụng các class CSS vào `GoalsPage.jsx`.

+---------------------------------+
| <header>                        |
|  TIÊU ĐỀ TRANG (Dashboard)      |  <-- MainHeader vẫn ở trên cùng
|---------------------------------|
| <main>                          |
|                                 |
|  +---------------------------+  |
|  |      PortfolioSummary     |  |  <-- Các block xếp chồng lên nhau
|  +---------------------------+  |
|                                 |
|  +---------------------------+  |
|  |        HoldingsChart      |  |
|  +---------------------------+  |
|                                 |
|                                 |
|  +---------------------------+  |
|  |       PortfolioTable      |  |
|  |           ...             |  <-- (Nội dung chính có thể cuộn)
|  |      (có thể cuộn)        |  |
|  +---------------------------+  |
|                                 |
|                                 |
|                                 |
|---------------------------------|
| <nav> (Nổi & có hiệu ứng Blur)  |
|                                 |
| [icon]    [icon]    [icon]      |  <-- Thanh điều hướng ở dưới đáy
| Dashboard     DCA      Goals    |
+---------------------------------+
```

### **Giai đoạn 14: Responsive cho Mobile**
*Mục tiêu: Áp dụng các kỹ thuật responsive design để đảm bảo ứng dụng hoạt động tốt và có trải nghiệm người dùng tuyệt vời trên các thiết bị di động. Thay thế Sidebar bằng thanh điều hướng dưới đáy màn hình.*

- [ ] **Task 14.1: Ẩn Sidebar và Điều chỉnh Layout chính trên Mobile**
  - **Mục đích:** Sử dụng Media Query để thay đổi layout khi màn hình nhỏ hơn một ngưỡng nhất định (ví dụ: 768px).
  - **Hành động:**
    - Trong `Sidebar.module.css`, thêm một media query để set `display: none` cho class `.sidebar`.
    - Trong `MainLayout.module.css`, thêm một media query để xóa `margin-left` của class `.mainContent`.

- [ ] **Task 14.2: Xây dựng Component `BottomNav`**
  - **Mục đích:** Tạo component thanh điều hướng cho mobile.
  - **Hành động:**
    - Tạo file `src/components/navigation/BottomNav.jsx`.
    - Component này sẽ tương tự như `Sidebar`, cũng sử dụng `<NavLink>` để chuyển trang.

- [ ] **Task 14.3: Tích hợp `BottomNav` vào Layout**
  - **Mục đích:** Hiển thị `BottomNav` chỉ trên màn hình mobile.
  - **Hành động:**
    - Import và thêm `<BottomNav />` vào trong `MainLayout.jsx`.
    - Viết CSS để `BottomNav` mặc định bị ẩn (`display: none`) trên màn hình lớn, và chỉ hiện ra (`display: flex`) bên trong media query cho mobile.

- [ ] **Task 14.4 (Tùy chọn nhưng khuyến khích): Cài đặt và sử dụng Thư viện Icon**
  - **Mục đích:** Sử dụng icon thay vì chữ để thanh điều hướng trông chuyên nghiệp và gọn gàng hơn.
  - **Hành động:**
    - Cài đặt thư viện `react-icons`: `npm install react-icons`.
    - Thay thế các text "Dashboard", "DCA" trong `BottomNav.jsx` bằng các icon tương ứng.

- [ ] **Task 14.5: Viết CSS cho `BottomNav`**
  - **Mục đích:** Tạo kiểu cho thanh điều hướng, bao gồm cả hiệu ứng "blur" mà bạn mong muốn.
  - **Hành động:**
    - Tạo file `BottomNav.module.css`.
    - Sử dụng `position: fixed`, `bottom: 0`, `backdrop-filter: blur(10px)` và Flexbox để tạo ra giao diện như phác thảo.
---

### **Giai đoạn 15: Tái kiến trúc luồng dữ liệu Context (COMPLETE REFACTOR)**

*Mục tiêu: Từ kiến trúc xáo trộn hiện tại, chúng ta sẽ xây dựng một hệ thống Context **Professional-grade**, tuân thủ nguyên lý Single Responsibility, không có state trùng lặp, và luồng dữ liệu rõ ràng theo một hướng (unidirectional data flow). Mục tiêu cuối cùng là tạo một ứng dụng dễ bảo trì, dễ mở rộng, và dễ debug.*

---

#### **PHẦN I: NHƯ CẦU THIẾT KẾ & NGUYÊN LÝ**

**Kiến trúc cần đạt:**
1. ✅ **Single Responsibility:** Mỗi Context làm một việc duy nhất
2. ✅ **No State Duplication:** Không có dữ liệu nằm ở 2 nơi
3. ✅ **Clear Modal Ownership:** Mỗi modal có owner rõ ràng
4. ✅ **Unidirectional Data Flow:** Dữ liệu chảy theo một hướng
5. ✅ **No Circular Dependencies:** Không có import vòng tròn
6. ✅ **Proper Context Nesting:** AppContext → SavvyContext → PortfolioContext
7. ✅ **Goal Completion Flow:** Luồng hoàn thành mục tiêu hoàn hảo

---

#### **PHẦN II: CÁC TASK CHI TIẾT**

##### **TASK 15.1: Xây dựng AppContext mới (Platform Manager)**

- [x] **15.1.1: Thiết kế cấu trúc state cho AppContext**
  - **Mục đích:** Xác định chính xác cái gì nên nằm trong AppContext
  - **Hành động:**
    - Xóa tất cả nội dung cũ của `AppContext.jsx`
    - Thiết kế 3 nhóm state chính:
      1. **Global Services State:**
         - `coinList: Coin[]` (fetch once, shared)
         - `isCoinListLoading: boolean`
         - `coinListError: string | null`
      2. **UI State:**
         - `ui: { theme: 'light' | 'dark' }`
      3. **Modals Management State:**
         - `modals: { addTransaction: { isOpen, mode, data }, confirmation: {...}, celebration: {...} }`

- [x] **15.1.2: Viết state variables và initializers**
  - **Mục đích:** Setup các state với giá trị khởi tạo hợp lý
  - **Hành động:**
    - Tạo 3 `useState` chính: `coinList`, `ui`, `modals`
    - Mỗi state phải có kiến trúc nested rõ ràng
    - Ví dụ cho modals:
      ```javascript
      const [modals, setModals] = useState({
        addTransaction: { isOpen: false, mode: 'add', data: null },
        confirmation: { isOpen: false, message: '', onConfirm: null },
        celebration: { isOpen: false, message: '' },
      });
      ```

- [x] **15.1.3: Viết hàm mở/đóng AddTransactionModal**
  - **Mục đích:** Tạo unified interface để mở modal thêm giao dịch
  - **Hành động:**
    - `openAddTransactionModal(mode = 'add', data = null)` → cập nhật `modals.addTransaction`
    - `closeAddTransactionModal()` → reset `modals.addTransaction`
    - Đảm bảo có thể chuyển sang mode 'edit' khi nhận data

- [x] **15.1.4: Viết hàm mở/đóng ConfirmationModal**
  - **Mục đích:** Tạo unified interface để mở modal xác nhận
  - **Hành động:**
    - `openConfirmationModal(message, onConfirmCallback)` → cập nhật `modals.confirmation`
    - `closeConfirmationModal()` → reset `modals.confirmation`
    - `handleConfirm()` → gọi `onConfirmCallback`, sau đó close modal
    - Thêm safety check: `if (typeof modals.confirmation.onConfirm === 'function')`

- [x] **15.1.5: Viết hàm mở/đóng CelebrationModal**
  - **Mục đích:** Tạo unified interface để mở modal chúc mừng
  - **Hành động:**
    - `openCelebrationModal(message)` → cập nhật `modals.celebration`
    - `closeCelebrationModal()` → reset `modals.celebration`
    - Có thể add auto-close sau 3 giây (optional)

- [x] **15.1.6: Viết useEffect để fetch coinList**
  - **Mục đích:** Tải danh sách coin một lần duy nhất
  - **Hành động:**
    - Sử dụng `useRef` guard để đảm bảo chỉ fetch 1 lần
    - Cập nhật `isCoinListLoading` và `coinListError` thích hợp
    - Dependency array: `[]` (chỉ chạy 1 lần)

- [x] **15.1.7: Tạo value object và export**
  - **Mục đích:** Đóng gói tất cả state và functions vào context value
  - **Hành động:**
    - Dùng `useMemo` để prevent unnecessary re-renders
    - Export `AppContext` và `AppProvider`
    - Đảm bảo value có cấu trúc logic, dễ sử dụng
    - Dependency array bao gồm tất cả state và functions

---

##### **TASK 15.2: Tối ưu hóa SavvyContext (Goals Manager)**

- [x] **15.2.1: Import AppContext vào SavvyContext**
  - **Mục đích:** Cho phép SavvyContext gọi AppContext functions
  - **Hành động:**
    - Thêm: `import { AppContext } from './AppContext.jsx';`
    - Bên trong `SavvyProvider`, dùng: `const { openCelebrationModal } = useContext(AppContext);`

- [x] **15.2.2: Sửa hàm `markGoalAsComplete`**
  - **Mục đích:** Kết nối goal completion với celebration modal
  - **Hành động:**
    - Tìm goal trong `goals` array
    - Move nó vào `completedGoals` array
    - Remove từ `goals` array
    - **ĐỌC KỸẤU:** Sau đó, gọi `openCelebrationModal("Chúc mừng! Bạn đã hoàn thành mục tiêu: [goalTitle]")`
    - Cập nhật localStorage

- [x] **15.2.3: Đảm bảo dependency array đúng**
  - **Mục đích:** Tránh infinite loops hoặc missing dependencies
  - **Hành động:**
    - Kiểm tra các `useEffect` và `useCallback` trong SavvyContext
    - Thêm `openCelebrationModal` vào dependency arrays nếu cần

---

##### **TASK 15.3: Tái cấu trúc PortfolioContext (Portfolio Manager)**

- [x] **15.3.1: Import AppContext vào PortfolioContext**
  - **Mục đích:** Cho phép PortfolioContext gọi AppContext functions
  - **Hành động:**
    - Thêm: `import { AppContext } from './AppContext.jsx';`
    - Bên trong `PortfolioProvider`, dùng: `const { openAddTransactionModal, openConfirmationModal, closeAddTransactionModal } = useContext(AppContext);`
    - **REMOVE:** dòng cũ `const { handleOpenConfirmationModal } = useContext(AppContext);`

- [ ] **15.3.2: Xóa bỏ state trùng lặp**
  - **Mục đích:** Loại bỏ tất cả dữ liệu đã có ở AppContext
  - **Hành động:**
    - **REMOVE:** `const [coinList, setCoinList] = useState([]);`
    - **REMOVE:** `const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);`
    - **REMOVE:** `const [editingTransaction, setEditingTransaction] = useState(null);` (duplicate!)
    - **REMOVE:** `const apiCallGuard useRef` (không cần nữa)
    - Thay vào đó, lấy `coinList` từ `AppContext` khi cần

- [x] **15.3.3: Sửa hàm `handleDeleteTransaction`**
  - **Mục đích:** Sử dụng AppContext.openConfirmationModal thay vì context function cũ**
  - **Hành động:**
    - Thay `handleOpenConfirmationModal(...)` bằng `openConfirmationModal(...)`
    - Kiểm tra xem callback có hoạt động đúng không

- [x] **15.3.4: Sửa hàm `handleInitiateGoalCompletion`**
  - **Mục đích:** Chuẩn bị modal mở và dữ liệu trước khi mở
  - **Hành động:**
    - Nhận `goal` làm parameter
    - Ghi nhớ nó: `setGoalCompletionData(goal)`
    - Tạo transaction template an toàn:
      ```javascript
      const template = {
        id: null,
        type: 'sell',
        coinId: '',
        amount: '',
        pricePerCoin: '',
        date: new Date().toISOString().split('T')[0],
      };
      ```
    - Gọi: `openAddTransactionModal('add', template)` từ AppContext

- [x] **15.3.5: Sửa hàm `handleAddTransaction` (rename nếu cần)**
  - **Mục đích:** Kết nối với SavvyContext khi hoàn thành mục tiêu
  - **Hành động:**
    - Giữ logic cũ: `setTransactions([newTransaction, ...prev])`
    - Sau đó, thêm logic mới:
      ```javascript
      if (goalCompletionData) {
        // Gọi hàm từ SavvyContext (được truyền từ App.jsx)
        markGoalAsComplete(goalCompletionData.id);
        setGoalCompletionData(null);
      }
      ```
    - Gọi: `closeAddTransactionModal()` từ AppContext để đóng modal

- [x] **15.3.6: Sửa context value và dependency array**
  - **Mục đích:** Loại bỏ các property không cần thiết, thêm các property mới**
  - **Hành động:**
    - **REMOVE từ value:**
      - `isAddHoldingModalOpen`
      - `editingTransaction`
      - `openAddHoldingModal`
      - `openEditModal`
      - `closeModal`
    - **Cập nhật dependency array** để khớp với thay đổi

---

##### **TASK 15.4: Đơn giản hóa SmartSuggestions Component**

- [x] **15.4.1: Xóa import AppContext từ SmartSuggestions**
  - **Mục đích:** Component chỉ nên import context mà nó thực sự cần
  - **Hành động:**
    - **REMOVE:** `import { AppContext } from "../../context/AppContext.jsx";`
    - **REMOVE:** `const {openAddTransactionModal}= useContext(AppContext)`

- [x] **15.4.2: Sửa hàm `handleCompleteGoalClick`**
  - **Mục đích:** Delegate mọi thứ cho PortfolioContext
  - **Hành động:**
    - Xóa tất cả logic tạo template
    - Xóa call `openAddTransactionModal()`
    - Thay vào đó, chỉ gọi: `handleInitiateGoalCompletion(goal)` từ PortfolioContext
    - Sau đó, `navigate('/')`
    - Ví dụ:
      ```javascript
      const handleCompleteGoalClick = (goal) => {
        handleInitiateGoalCompletion(goal);  // ← PortfolioContext sẽ handle template + modal
        navigate('/');
      };
      ```

---


#### **PHẦN III: CHECKLIST REFACTOR**

**Trước khi bắt đầu:**
- [ ] Backup code hiện tại
- [ ] Đọc kỹ kiến trúc mới (Component tree, Context responsibilities)
- [ ] In ra file này để tham khảo

**Sau khi hoàn thành Task 15.1-15.6:**
- [ ] Tất cả files compile mà không có lỗi
- [ ] Tất cả imports tìm thấy được module
- [ ] Console không có warnings về missing dependencies
- [ ] Không có lỗi về circular imports

**Sau khi hoàn thành Task 15.7:**
- [ ] Tất cả 6 flows hoạt động đúng
- [ ] Không có state trùng lặp
- [ ] Không có race conditions
- [ ] localStorage persists đúng cách

---

#### **PHẦN IV: BENEFITS SAU REFACTOR**

✅ **Clear Separation of Concerns**
- AppContext = UI state
- PortfolioContext = Business logic
- SavvyContext = Domain entity

✅ **No State Duplication**
- coinList chỉ ở AppContext
- transactions chỉ ở PortfolioContext
- goals chỉ ở SavvyContext

✅ **Clear Modal Ownership**
- AddTransactionModal → AppContext
- ConfirmationModal → AppContext
- CelebrationModal → AppContext

✅ **Unidirectional Data Flow**
- User action → dispatch handler → update state → re-render

✅ **Easy to Debug**
- Biết state nào ở đâu
- Biết modal nào mở khi nào
- Biết flow nào thực thi khi nào

✅ **Easy to Extend**
- Thêm Context mới → không ảnh hưởng cái cũ
- Thêm modal mới → chỉ cần add vào AppContext
- Thêm feature mới → rõ ràng nên ở Context nào

✅ **Performance Optimized**
- Mỗi component subscribe chỉ dữ liệu cần thiết
- Avoid unnecessary re-renders
- coinList fetch chỉ 1 lần duy nhất

---

#### **🎯 HƯỚNG DẪN: Cách Dùng `console.log()` để Debug API Data**

**Tại sao cần log dữ liệu?**
- Xem dữ liệu API trả về có đúng không
- Kiểm tra transformation (từ raw data → processed data) có logic không
- Debug từng bước để hiểu luồng code
- So sánh dữ liệu của chúng ta với dữ liệu website reference

**🖥️ Cách mở Console:**
1. **Trên Chrome/Edge:** Nhấn `F12` → Click tab `Console`
2. **Trên Firefox:** Nhấn `F12` → Click tab `Console`
3. **Trên Safari:** 
   - Menu → Develop → Show Web Inspector
   - Click tab `Console`

**💡 Chiến lược logging cho DCA Calculator:**

```javascript
// ========== 1. LOG API RESPONSE ==========
console.log('🔗 [API] Raw response from fetchCoinHistory:', {
  coinId: inputs.coinId,
  requestedDays: diffDays,
  receivedDataPoints: rawHistoricalData?.length || 0,
  firstItem: rawHistoricalData?.[0],  // { time: 1509168000, close: 0.25, ... }
  lastItem: rawHistoricalData?.[rawHistoricalData.length - 1],
});
// 💥 Kiểm tra:
//   - receivedDataPoints: nên gần 2000 (miễn phí limit)
//   - firstItem.time: timestamp của 2017-11-09 (số giây)
//   - lastItem.time: timestamp của 2025-09-12 (số giây)

// ========== 2. LOG TRANSFORMED DATA ==========
console.log('🔄 [TRANSFORM] Transformed data:', {
  transformedLength: historicalData.length,
  firstItem: historicalData?.[0],  // [timestamp_ms, price]
  lastItem: historicalData?.[historicalData.length - 1],
  sample3Items: historicalData?.slice(0, 3), // Xem 3 item đầu
});
// 💥 Kiểm tra:
//   - Timestamp nên là milliseconds (000 ở cuối)
//   - Price nên là số dương (> 0)

// ========== 3. LOG INPUT PARAMETERS ==========
console.log('📊 [DCA] Input parameters:', {
  investment: inputs.investment,
  frequency: inputs.frequency,
  feeRate: (inputs.feeRate / 100) * 100 + '%', // Để check không
  startDate: inputs.startDate,
  diffDays: diffDays,
});

// ========== 4. LOG RESULT ==========
console.log('✅ [DCA] Final Result:', {
  totalInvested: result.totalInvested,
  totalCoins: result.totalCoins.toFixed(8),
  currentValue: result.currentValue.toFixed(2),
  profitLoss: result.profitLoss.toFixed(2),
  roiPct: result.roiPct.toFixed(2) + '%',
  validBuys: result.validBuys,
  skippedBuys: result.skippedBuys,
});
// 💥 So sánh với website:
//   - Website: $14,960
//   - App: ? (Nếu khác → có vấn đề cần fix)
```

**📍 Các loại log dùng:**

|| Emoji | Ý nghĩa | Dùng khi |
||--------|---------|---------|
|| 🔗 | API Call | Fetch dữ liệu từ API |
|| 🔄 | Transform | Chuyển đổi format dữ liệu |
|| 📊 | Data Processing | Tính toán/xử lý dữ liệu |
|| ✅ | Success | Kết quả hoàn tất, OK |
|| ❌ | Error | Có lỗi xảy ra |
|| ⚠️ | Warning | Cảnh báo (có thể sai) |
|| 🐛 | Debug | Chi tiết để debug |

**Ví dụ log từng step trong `calculateDcaResult()`:**

```javascript
export const calculateDcaResult = ({ historicalData, investment, frequency, periodDays, feeRate = 0.0002 }) => {
  console.log('📊 [DCA] Starting calculation...', { 
    dataLength: historicalData.length, 
    feeRate: feeRate * 100 + '%' 
  });

  let totalInvested = 0;
  let totalCoins = 0;
  let validBuys = 0;
  let skippedBuys = 0;
  let currentDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  let buyCount = 0;  // Counter để log chi tiết từng lần mua
  while (currentDate <= now) {
    const price = getPriceOnOrBefore(historicalData, currentDate);

    if (price !== null && price > 0) {
      const investmentAfterFee = investment * (1 - feeRate);
      const coinsBought = investmentAfterFee / price;
      totalCoins += coinsBought;
      totalInvested += investment;
      validBuys++;

      // Log chi tiết (chỉ log 3 lần mua đầu + 3 lần cuối để không spam console)
      if (buyCount < 3 || validBuys > result.validBuys - 3) {
        console.log(`🛒 Buy #${validBuys}:`, {
          date: currentDate.toLocaleDateString('vi-VN'),
          price: price.toFixed(2),
          coinsBought: coinsBought.toFixed(8),
          totalCoins: totalCoins.toFixed(8),
        });
      } else if (buyCount === 3) {
        console.log('... (trung gian) ...');
      }
      buyCount++;
    } else {
      skippedBuys++;
      console.log(`⏭️ Skipped date:`, {
        date: currentDate.toLocaleDateString('vi-VN'),
        reason: price === null ? 'No data' : 'Invalid price',
      });
    }

    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  const latestPrice = historicalData[historicalData.length - 1][1];
  const currentValue = totalCoins * latestPrice;
  const profitLoss = currentValue - totalInvested;
  const roiPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  console.log('✅ [DCA] Calculation complete:', {
    validBuys,
    skippedBuys,
    totalInvested: '$' + totalInvested.toLocaleString(),
    totalCoins: totalCoins.toFixed(8),
    latestPrice: '$' + latestPrice.toFixed(2),
    currentValue: '$' + currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    profitLoss: '$' + profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    roiPct: roiPct.toFixed(2) + '%',
  });

  return { ... };
};
```

**🔍 Cách đọc kết quả trong Console:**

1. **Mở DevTools Console**
2. **Tìm các message với emoji:**
   - 🔗 [API] → Check dữ liệu từ server
   - 🔄 [TRANSFORM] → Check format sau chuyển đổi
   - 🛒 Buy #1, Buy #2, ... → Xem chi tiết từng lần mua
   - ✅ [DCA] Calculation complete → Xem kết quả cuối
3. **Right-click vào object** → "Store as global variable" → `temp1`
4. **Type `temp1` vào console** để xem chi tiết
5. **Expand object** bằng cách click mũi tên `▶`

**💾 Export log để so sánh:**

```javascript
// Copy toàn bộ log ra ngoài
const logData = {
  timestamp: new Date().toISOString(),
  result: result,
  comparison: {
    website: 14960,
    app: result.currentValue,
    difference: result.currentValue - 14960,
  }
};

// Copy vào Notepad để lưu
console.log('%cCOPY THIS:', 'color: green; font-size: 16px;');
console.log(JSON.stringify(logData, null, 2));
```

---

#### **PHẦN IV: BENEFITS SAU REFACTOR**

✅ **Clear Separation of Concerns**

### **Giai đoạn 11: "Cỗ máy thời gian" DCA - Công cụ tạo Động lực** ⭐ **[IN PROGRESS - 2025-11-02]**
|+------------------------------------------------------+
||                                                      |
||           **Cỗ Máy Thời Gian DCA** 🚀                |
||                                                      |
||  Đồng coin: [ Bitcoin (BTC)      ▼ ]                 |
||                                                      |
||  Số tiền đầu tư: [ $50 ]                             |
||                                                      |
||  Tần suất:   [ Mỗi tháng          ▼ ]                |
||                                                      |
||  Kể từ:      [ 3 năm trước       ▼ ]                 |
||                                                      |
||                 +-----------------+                  |
||                 |   Xem kết quả   |                  |
||                 +-----------------+                  |
||                                                      |
||  +------------------------------------------------+  |
||  |                                                |  |
||  |   "Nếu bạn đầu tư $50 mỗi tháng vào Bitcoin    |  |
||  |   kể từ 3 năm trước, bây giờ bạn sẽ có         |  |
||  |   $XX,XXX."                                    |  |
||  |                                                |  |
||  +------------------------------------------------+  |
||                                                      |
|+------------------------------------------------------+
|
|*   **Tầm nhìn:** Cung cấp một công cụ tính toán giả lập, cho phép người dùng thấy được tiềm năng của việc đầu tư dài hạn theo chiến lược trung bình giá (DCA). Xây dựng nó như một component độc lập và tích hợp vào luồng thêm giao dịch để tối đa hóa động lực.
|
|---
|
|#### **PHẦN I: NHƯ CẦU THIẾT KẾ & NGUYÊN LÝ**
|
|**Kiến trúc cần đạt:**
|1. ✅ **Accurate Calculation**: Tính toán đúng DCA với phí giao dịch
|2. ✅ **Price Lookup**: Lấy giá ON-OR-BEFORE (không phải gần nhất bất kỳ)
|3. ✅ **Fee Support**: Hỗ trợ phí giao dịch tùy chỉnh
|4. ✅ **Metadata Tracking**: Track số lần mua, skip, lịch sử chi tiết
|5. ✅ **Clear Logging**: Console.log() chi tiết cho debugging
|6. ✅ **User Input**: Cho phép user thay đổi phí giao dịch
|7. ✅ **Result Display**: Hiển thị ROI%, metadata, chi tiết
|
|---
|
|#### **PHẦN II: CÁC TASK CHI TIẾT**
|
|##### **TASK 11.1: Tích hợp API Dữ liệu Lịch sử** ✅ COMPLETED
|
|- [x] **11.1.1: Tạo hàm `fetchCoinHistory()` trong crypto-api.js**
|  - **Mục đích:** Lấy dữ liệu giá lịch sử của coin từ CryptoCompare API
|  - **Hành động:**
|    - Endpoint: `https://min-api.cryptocompare.com/data/v2/histoday?fsym={symbol}&tsym=USD&limit={limit}`
|    - Giới hạn: 2000 ngày (free tier)
|    - Return: `response.data.Data.Data` (mảng dữ liệu)
|
|---
|
|##### **TASK 11.2: Xây dựng Logic Tính toán DCA** ⭐ **[IN PROGRESS - 2025-11-02]**
|
|*Mục đích: Tạo ra một hàm "pure" để tính toán kết quả của chiến lược DCA với phí giao dịch, lấy giá đúng cách, và tracking metadata.*
|
|- [x] **11.2.1: Thay thế `findClosestPrice()` bằng `getPriceOnOrBefore()`**
|  - **Mục đích:** Fix logic tìm giá → chỉ lấy giá ngày trước hoặc bằng target date
|  - **Hành động:**
|    1. Xóa hàm `findClosestPrice()` cũ (dòng 7-22)
|    2. Viết hàm `getPriceOnOrBefore(historicalData, targetDate)`:
|       - Lặp qua `historicalData` để tìm giá có timestamp ≤ targetDate
|       - Nếu tìm được → trả về giá
|       - Nếu không tìm được → lấy giá ngày sau làm fallback
|       - Nếu vẫn không → trả về `null`
|    3. **Tip:** Có thể dùng `for loop` hoặc `.findLast()` (ES2023)
|    4. Kiểm tra logic bằng tay trước khi code
|
|- [x] **11.2.2: Thêm parameter `feeRate` vào hàm `calculateDcaResult()`**
|  - **Mục đích:** Cho phép tính toán với phí giao dịch
|  - **Hành động:**
|    1. Thêm vào function signature: `feeRate = 0.0002` (mặc định 0.02%)
|    2. Trong vòng lặp, đổi công thức:
|       ```javascript
|       const investmentAfterFee = investment * (1 - feeRate);
|       const coinsBought = investmentAfterFee / price;
|       ```
|    3. Kiểm tra: nếu `feeRate = 0`, kết quả phải giống công thức cũ
|
|- [x] **11.2.3: Thêm tracking `validBuys` & `skippedBuys`**
|  - **Mục đích:** Track số lần mua hợp lệ vs bỏ qua, để debug
|  - **Hành động:**
|    1. Khởi tạo `let validBuys = 0;` và `let skippedBuys = 0;`
|    2. Mỗi khi mua thành công → `validBuys++`
|    3. Mỗi khi bỏ qua (price = null) → `skippedBuys++`
|    4. Thêm vào return object: `validBuys, skippedBuys`
|
|- [x] **11.2.4: Thêm tracking `buyHistory`**
|  - **Mục đích:** Chuẩn bị dữ liệu chi tiết từng lần mua (cho Task 11.3+)
|  - **Hành động:**
|    1. Khởi tạo `let buyHistory = [];`
|    2. Mỗi khi mua thành công, push object:
|       ```javascript
|       buyHistory.push({
|         date: currentDate.toISOString().split('T')[0],
|         price: price,
|         coinsBought: coinsBought,
|         investmentAmount: investment,
|         cumulativeCoins: totalCoins,
|         cumulativeInvested: totalInvested,
|       });
|       ```
|    3. Thêm vào return object: `buyHistory`
|
|- [x] **11.2.5: Tính `roiPct` và thêm vào return**
|  - **Mục đích:** Có số % để display kết quả
|  - **Hành động:**
|    1. Tính: `const roiPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;`
|    2. Thêm vào return object: `roiPct`
|    3. Thêm vào return object: `feeRate: feeRate * 100` (để show %)
|
|- [x] **11.2.6: Thêm `console.log()` statements để debug**
|  - **Mục đích:** Quan sát dữ liệu đầu vào & kết quả
|  - **Hành động:**
|    1. Ở đầu hàm, log input params:
|       ```javascript
|       console.log('📊 [DCA] Input params:', {
|         historicalDataLength: historicalData.length,
|         investment,
|         frequency,
|         periodDays,
|         feeRate: (feeRate * 100).toFixed(4) + '%',
|       });
|       ```
|    2. Ở cuối hàm, log result:
|       ```javascript
|       console.log('✅ [DCA] Calculation complete:', {
|         validBuys,
|         skippedBuys,
|         totalInvested: '$' + totalInvested.toLocaleString(),
|         totalCoins: totalCoins.toFixed(8),
|         currentValue: '$' + currentValue.toLocaleString(),
|         profitLoss: '$' + profitLoss.toLocaleString(),
|         roiPct: roiPct.toFixed(2) + '%',
|       });
|       ```
|    3. Dùng emoji để dễ tìm trong console (🔗, 🔄, 📊, ✅)
|
|---
|
|##### **TASK 11.3: Xây dựng Component `DcaCalculator`** ⭐ **[IN PROGRESS - 2025-11-02]**
|
|*Mục đích: Tạo một công cụ tương tác độc lập để người dùng có thể khám phá các kịch bản DCA, với fee input, metadata display, và logging.*
|
|- [x] **11.3.1: Thêm `feeRate` vào state `inputs`**
|  - **Mục đích:** User có thể thay đổi phí giao dịch
|  - **Hành động:**
|    1. Tìm `useState(inputs)` (khoảng dòng 12)
|    2. Thêm property: `feeRate: 0.02` (mặc định 0.02%)
|    3. Kiểm tra: state nên có `{ coinId, investment, frequency, startDate, feeRate }`
|
|- [x] **11.3.2: Thêm input field cho Fee trong form**
|  - **Mục đích:** User có UI để nhập phí
|  - **Hành động:**
|    1. Tìm `<div className={styles.formControl}>` cuối cùng (sau startDate)
|    2. Thêm block mới:
|       ```javascript
|       <div className={styles.formControl}>
|         <label htmlFor="feeRate">Phí giao dịch (%)</label>
|         <input
|           type="number"
|           name="feeRate"
|           id="feeRate"
|           value={inputs.feeRate}
|           onChange={handleInputChange}
|           min="0"
|           max="1"
|           step="0.01"
|           placeholder="VD: 0.02"
|         />
|       </div>
|       ```
|    3. Trong `handleInputChange()`, kiểm tra logic cho `feeRate`
|
|- [x] **11.3.3: Cập nhật `handleSubmit()` để pass `feeRate`**
|  - **Mục đích:** Gửi phí tới hàm tính toán
|  - **Hành động:**
|    1. Tìm `calculateDcaResult({ ... })` (khoảng dòng 92)
|    2. Thêm: `feeRate: inputs.feeRate / 100,` (chuyển % → decimal)
|    3. Kiểm tra: `0.02 / 100 = 0.0002` ✓
|
|- [x] **11.3.4: Hiển thị metadata trong kết quả**
|  - **Mục đích:** User thấy ROI%, buy count, coin total
|  - **Hành động:**
|    1. Tìm phần hiển thị result (khoảng dòng 186-210)
|    2. Thêm ROI% vào p tag:
|       ```javascript
|       <p className={result.profitLoss >= 0 ? styles.profit : styles.loss}>
|         (Tổng vốn: ${result.totalInvested.toLocaleString()})
|         <br/>
|         (Lời/Lỗ: ${result.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })})
|         <br/>
|         (ROI: {result.roiPct.toFixed(2)}%)
|       </p>
|       ```
|    3. Thêm div metadata sau p tag:
|       ```javascript
|       <div className={styles.metadata}>
|         <p>📈 Lần mua: {result.validBuys} / {result.validBuys + result.skippedBuys}</p>
|         <p>💰 Phí giao dịch: {result.feeRate}%</p>
|         <p>📊 Giá hiện tại: ${result.latestPrice.toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
|         <p>🪙 Số coin: {result.totalCoins.toFixed(8)}</p>
|       </div>
|       ```
|
|- [x] **11.3.5: Thêm console.log() cho API requests/responses**
|  - **Mục đích:** Quan sát dữ liệu API trước xử lý
|  - **Hành động:**
|    1. Sau gọi `fetchCoinHistory()`, log:
|       ```javascript
|       const rawHistoricalData = await fetchCoinHistory(inputs.coinId, diffDays);
|       console.log('🔗 [API] Raw response:', {
|         coinId: inputs.coinId,
|         requestedDays: diffDays,
|         receivedDataPoints: rawHistoricalData?.length || 0,
|         firstItem: rawHistoricalData?.[0],
|         lastItem: rawHistoricalData?.[rawHistoricalData.length - 1],
|       });
|       ```
|    2. Sau transform, log:
|       ```javascript
|       const historicalData = transformCryptoCompareData(rawHistoricalData);
|       console.log('🔄 [TRANSFORM] Transformed data:', {
|         transformedLength: historicalData.length,
|         firstItem: historicalData?.[0],
|         lastItem: historicalData?.[historicalData.length - 1],
|       });
|       ```
|
|- [x] **11.3.6: Test & Debug (Manual)**
|  - **Mục đích:** Kiểm tra kết quả so sánh với website reference
|  - **Hành động:**
|    1. Chạy: `npm run dev`
|    2. Mở DevTools (F12) → Console
|    3. Chọn LINK, từ 2017-11-09 → 2025-09-12
|    4. Bấm "Xem kết quả"
|    5. Xem logs:
|       - 🔗 [API] Raw response → Check `receivedDataPoints` (nên ~2000)
|       - 🔄 [TRANSFORM] Transformed data → Check format
|       - 📊 [DCA] Input params → Check fee = 0.02%
|       - ✅ [DCA] Calculation complete → Compare với website
|    6. So sánh:
|       - Website: $14,960
|       - App: bao nhiêu?
|       - Nếu sai → debug từng step
|
|---
|
|##### **TASK 11.4: Tích hợp `DcaCalculator` vào Giao diện Chính**
|
|- [x] **11.4.1: Import & render trong App.jsx**
|  - **Mục đích:** Hiển thị DCA Calculator trên dashboard
|  - **Hành động:**
|    - Import: `import { DcaCalculator } from './components/dca/DcaCalculator';`
|    - Render trên `DashboardPage.jsx`, phía trên `SmartSuggestions`
|
|---
|
|##### **TASK 11.5: Tạo `DcaResultModal`**
|
|- [ ] **11.5.1: Xây dựng component `DcaResultModal.jsx`**
|  - **Mục đích:** Modal hiển thị kết quả DCA nổi bật
|  - **Hành động:**
|    - Tạo file `src/components/dca/DcaResultModal.jsx`
|    - Nhận props: `isOpen`, `result`, `onClose`
|    - Hiển thị thông điệp truyền cảm hứng dựa trên ROI%
|
|---
|
|##### **TASK 11.6: Kích hoạt Modal sau khi Thêm Giao dịch**
|
|- [ ] **11.6.1: Tích hợp DcaResultModal vào PortfolioContext**
|  - **Mục đích:** Hiển thị modal khi user thêm transaction thành công
|  - **Hành động:**
|    - Sau khi `handleAddTransaction` thành công, tính DCA
|    - Gọi `AppContext` để mở modal với kết quả
|    - Hiển thị `DcaResultModal` với kết quả tính toán
|
|---
|
|#### **PHẦN III: CHECKLIST HOÀN THÀNH**
|
|**Trước khi bắt đầu:**
|- [ ] Backup code hiện tại
|- [ ] Đọc kỹ `doc/TASK-SUMMARY.md`
|- [ ] Đọc `doc/DCA-LOGGING-GUIDE.md`
|- [ ] Hiểu công thức: `coinsBought = (investment * (1 - feeRate)) / price`
|
|**Sau khi hoàn thành Task 11.2:**
|- [ ] `calculateDcaResult()` không có lỗi
|- [ ] `getPriceOnOrBefore()` hoạt động đúng
|- [ ] `feeRate` được tính vào
|- [ ] `console.log()` statements hoạt động
|
|**Sau khi hoàn thành Task 11.3:**
|- [ ] DcaCalculator component compile mà không lỗi
|- [ ] Fee input field hiển thị
|- [ ] Metadata hiển thị đúng
|- [ ] console.log() statements hoạt động
|
|**Sau khi test toàn bộ:**
|- [ ] Test LINK example: $14,960 ± 1%
|- [ ] Không có JavaScript errors
|- [ ] console.log() messages rõ ràng & dễ đọc
|- [ ] Tất cả 4 stages log hiển thị: 🔗, 🔄, 📊, ✅
|
|---
|
|#### **PHẦN IV: REFERENCE LINKS**
|
|- **Main Guide:** `doc/detail-task.md` (file này)
|- **Quick Templates:** `doc/DCA-LOGGING-GUIDE.md`
|- **Task Summary:** `doc/TASK-SUMMARY.md`
|- **Website Reference:** https://dcacryptocalculator.com/chainlink?start_date=2017-11-09&finish_date=2025-09-12&regular_investment=10&currency_code=USD&investment_interval=monthly&exchange_fee=0.02
|
|---
|
