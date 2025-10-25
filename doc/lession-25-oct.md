/**
 * Tìm giá gần nhất trong dữ liệu lịch sử cho một ngày cụ thể.
 * @param {Array<[number, number]>} historicalData - Mảng dữ liệu lịch sử [[timestamp, price]].
 * @param {Date} targetDate - Ngày cần tìm giá.
 * @returns {number | null} Giá của ngày gần nhất, hoặc null nếu không tìm thấy.
 */
const findClosestPrice = (historicalData, targetDate) => {
  const targetTimestamp = targetDate.getTime();
  let closestEntry = null;
  let smallestDiff = Infinity;

  for (const entry of historicalData) {
    const [timestamp, price] = entry;
    const diff = Math.abs(timestamp - targetTimestamp);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestEntry = entry;
    }
  }
  return closestEntry ? closestEntry[1] : null;
};

/**
 * Tính toán kết quả của chiến lược đầu tư trung bình giá (DCA).
 * @param {object} params
 * @param {Array<[number, number]>} params.historicalData - Mảng dữ liệu giá lịch sử.
 * @param {number} params.investment - Số tiền đầu tư mỗi lần.
 * @param {string} params.frequency - Tần suất ('monthly' hoặc 'weekly').
 * @param {number} params.periodDays - Khoảng thời gian đầu tư tính bằng ngày (ví dụ: 365*3 cho 3 năm).
 * @returns {{totalInvested: number, totalCoins: number, currentValue: number, profitLoss: number} | null}
 */
export const calculateDcaResult = ({
  historicalData,
  investment,
  frequency = 'monthly',
  periodDays,
}) => {
  if (!historicalData || historicalData.length < 2) {
    return null;
  }

  const now = new Date();
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  let totalInvested = 0;
  let totalCoins = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    const price = findClosestPrice(historicalData, currentDate);

    if (price !== null && price > 0) {
      const coinsBought = investment / price;
      totalCoins += coinsBought;
      totalInvested += investment;
    }

    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else { // weekly
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  const latestPrice = historicalData[historicalData.length - 1][1];
  const currentValue = totalCoins * latestPrice;
  const profitLoss = currentValue - totalInvested;

  return {
    totalInvested,
    totalCoins,
    currentValue,
    profitLoss,
  };
};       

*dca-calculator.js*

Hãy cùng nhau "chạy tay" qua hàm `findClosestPrice` với một ví dụ cụ thể.

---

### **Bối cảnh và Dữ liệu ví dụ**

*   **Nhiệm vụ:** Chúng ta đang ở ngày `25/08/2025` và cần tìm giá Bitcoin gần với ngày này nhất.
*   **`targetDate`:** Sẽ là một đối tượng Date đại diện cho ngày `25/08/2025`.
*   **`historicalData`:** Chúng ta có một mảng dữ liệu giá ngắn gọn như sau:

```javascript
[
  [1758787200000, 51000], // 24/08/2025
  [1758873600000, 51500], // 25/08/2025 -> Giá cần tìm nằm ở đây
  [1758960000000, 52000], // 26/08/2025
  [1759046400000, 51800]  // 27/08/2025
]
```
*(Lưu ý: `1758873600000` là timestamp cho ngày 25/08/2025)*

---

### **Mổ xẻ từng dòng lệnh**

Bây giờ, hãy đi qua từng dòng code của hàm `findClosestPrice` với dữ liệu ở trên.

**Dòng 8: `const targetTimestamp = targetDate.getTime();`**
*   **Cú pháp:** `.getTime()` là một phương thức của đối tượng `Date` trong JavaScript. Nó trả về số mili giây đã trôi qua từ ngày 01/01/1970 cho đến ngày `targetDate`. Đây chính là `timestamp`.
*   **"Chạy tay":** `targetDate` là `25/08/2025`, vậy `targetTimestamp` sẽ là `1758873600000`.

**Dòng 9: `let closestEntry = null;`**
*   **Cú pháp:** Khai báo một biến tên là `closestEntry` và gán cho nó giá trị `null`.
*   **Mục đích:** Biến này sẽ giống như một chiếc hộp rỗng. Khi chúng ta tìm thấy "entry" (cái cặp `[timestamp, price]`) gần nhất, chúng ta sẽ bỏ nó vào chiếc hộp này.

**Dòng 10: `let smallestDiff = Infinity;`**
*   **Cú pháp:** Khai báo biến `smallestDiff` và gán cho nó giá trị `Infinity`. `Infinity` trong JavaScript là một giá trị số đặc biệt, lớn hơn bất kỳ số nào khác.
*   **Mục đích:** Đây là một "mẹo" phổ biến. Biến này dùng để lưu "khoảng cách thời gian nhỏ nhất" mà chúng ta tìm thấy. Bằng cách khởi tạo nó với giá trị Vô cực, chúng ta đảm bảo rằng **bất kỳ** khoảng cách nào chúng ta tính ra ở lần đầu tiên cũng sẽ nhỏ hơn `Infinity`.

**Dòng 12: `for (const entry of historicalData) { ... }`**
*   **Cú pháp:** Đây là vòng lặp `for...of`, một cách hiện đại và dễ đọc để duyệt qua từng phần tử của một mảng.
*   **"Chạy tay":** Vòng lặp này sẽ chạy 4 lần.
    *   Lần 1: `entry` sẽ là `[1758787200000, 51000]`
    *   Lần 2: `entry` sẽ là `[1758873600000, 51500]`
    *   ...và cứ thế.

---
**BÊN TRONG VÒNG LẶP (Lần lặp đầu tiên)**
*   `entry` hiện tại là `[1758787200000, 51000]`.

**Dòng 13: `const [timestamp, price] = entry;`**
*   **Cú pháp:** Đây là "destructuring assignment". Nó là một cách tiện lợi để "mở hộp" mảng `entry` và gán giá trị đầu tiên vào biến `timestamp`, giá trị thứ hai vào biến `price`.
*   **"Chạy tay":** `timestamp` = `1758787200000`, `price` = `51000`.

**Dòng 14: `const diff = Math.abs(timestamp - targetTimestamp);`**
*   **Cú pháp:**
    *   `timestamp - targetTimestamp`: Phép trừ timestamp để tính khoảng cách thời gian (tính bằng mili giây).
    *   `Math.abs(...)`: Lấy giá trị tuyệt đối, để đảm bảo khoảng cách luôn là số dương.
*   **"Chạy tay":** `diff` = `Math.abs(1758787200000 - 1758873600000)` = `86400000`.

**Dòng 16: `if (diff < smallestDiff) { ... }`**
*   **Cú pháp:** So sánh khoảng cách vừa tính được với "khoảng cách nhỏ nhất" hiện tại.
*   **"Chạy tay":** `86400000 < Infinity`? **Đúng**. Vì vậy, chúng ta sẽ đi vào bên trong khối `if`.

**Dòng 17: `smallestDiff = diff;`**
*   **"Chạy tay":** Chúng ta đã tìm thấy một khoảng cách nhỏ hơn. Cập nhật `smallestDiff` thành `86400000`.

**Dòng 18: `closestEntry = entry;`**
*   **"Chạy tay":** Chúng ta cũng cập nhật "entry gần nhất" hiện tại. `closestEntry` bây giờ là `[1758787200000, 51000]`.

---
**BÊN TRONG VÒNG LẶP (Lần lặp thứ hai)**
*   `entry` hiện tại là `[1758873600000, 51500]`.
*   `timestamp` = `1758873600000`.
*   `diff` = `Math.abs(1758873600000 - 1758873600000)` = `0`.
*   **Điều kiện `if`:** `0 < 86400000`? **Đúng**.
*   **Cập nhật:**
    *   `smallestDiff` = `0`.
    *   `closestEntry` = `[1758873600000, 51500]`.

*(Vòng lặp sẽ tiếp tục, nhưng không có `diff` nào nhỏ hơn 0, vì vậy `smallestDiff` và `closestEntry` sẽ không thay đổi nữa.)*

---

**Dòng 21: `return closestEntry ? closestEntry[1] : null;`**
*   **Cú pháp:** Đây là toán tử ba ngôi (ternary operator), một cách viết gọn của `if...else`.
*   **Đọc là:** "**Nếu** `closestEntry` có giá trị (khác `null`), **thì** trả về `closestEntry[1]` (chính là giá `price`). **Ngược lại**, trả về `null`."
*   **"Chạy tay":** `closestEntry` đang là `[1758873600000, 51500]`. Vậy, hàm sẽ trả về `closestEntry[1]`, tức là `51500`.

### **Tóm tắt luồng chảy**

Hàm này hoạt động như một người tìm kiếm cần mẫn:
1.  Nó bắt đầu với một "kỷ lục" về khoảng cách là `Vô cực`.
2.  Nó đi qua từng điểm dữ liệu trong lịch sử.
3.  Với mỗi điểm, nó đo khoảng cách từ điểm đó đến ngày mục tiêu.
4.  Nếu khoảng cách này phá vỡ "kỷ lục" cũ, nó sẽ ghi nhận một kỷ lục mới và giữ lại chính điểm dữ liệu đó.
5.  Sau khi đi qua tất cả, điểm dữ liệu cuối cùng nó giữ lại chính là điểm gần nhất, và nó trả về giá tại điểm đó.

Chắc chắn rồi! Bây giờ chúng ta sẽ mổ xẻ "trái tim" của cỗ máy thời gian, hàm `calculateDcaResult`.

---

### **Bối cảnh và Dữ liệu ví dụ**

*   **Nhiệm vụ:** Tính toán kết quả DCA nếu đầu tư `$100` **hàng tháng** vào Bitcoin trong **3 tháng** vừa qua.
*   **Tham số đầu vào:**
    *   `historicalData`: Mảng dữ liệu giá lớn chứa giá của 3 tháng qua.
    *   `investment`: `100`
    *   `frequency`: `'monthly'`
    *   `periodDays`: `90` (giả sử 3 tháng = 90 ngày)
*   **Ngày hiện tại (`now`):** Giả sử là `25/10/2025`.

---

### **Mổ xẻ từng dòng lệnh**

**Dòng 33-38: `export const calculateDcaResult = ({...}) => { ... }`**
*   **Cú pháp:** Khai báo hàm `calculateDcaResult`. Nó nhận một object làm tham số và sử dụng destructuring để lấy ra các giá trị `historicalData`, `investment`, `frequency`, `periodDays` ngay lập tức.
*   **Mục đích:** Giúp việc gọi hàm trở nên linh hoạt, không cần nhớ đúng thứ tự các tham số.

**Dòng 39-41: `if (!historicalData || historicalData.length < 2) { ... }`**
*   **Cú pháp:** Đây là một "guard clause" (điều kiện bảo vệ).
*   **Đọc là:** "**Nếu** không có `historicalData` HOẶC `historicalData` có ít hơn 2 phần tử, **thì** dừng hàm lại và trả về `null`."
*   **Tại sao cần `< 2`?** Chúng ta cần ít nhất một điểm dữ liệu trong quá khứ để mua và một điểm dữ liệu ở hiện tại để tính giá trị. Nếu chỉ có 1 hoặc 0, việc tính toán là vô nghĩa.

**Dòng 43: `const now = new Date();`**
*   **Cú pháp:** Tạo một đối tượng `Date` mới. Nếu không có tham số, nó sẽ tự động lấy ngày và giờ hiện tại của hệ thống.
*   **"Chạy tay":** `now` sẽ là đối tượng Date đại diện cho `25/10/2025`.

**Dòng 44: `const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);`**
*   **Cú pháp:** Phép toán tính ngày bắt đầu.
*   **Mổ xẻ phép toán:**
    *   `periodDays * 24 * 60 * 60 * 1000`: Đây là cách chuyển đổi số ngày (`90`) ra tổng số mili giây. (90 ngày * 24 giờ/ngày * 60 phút/giờ * 60 giây/phút * 1000 ms/giây).
    *   `now.getTime() - ...`: Lấy timestamp hiện tại trừ đi tổng số mili giây đó để ra được timestamp của 3 tháng trước.
    *   `new Date(...)`: Tạo một đối tượng Date mới từ timestamp quá khứ đó.
*   **"Chạy tay":** `startDate` sẽ là đối tượng Date đại diện cho `25/07/2025`.

Trong phần "mổ xẻ" code vừa rồi, `periodDays: 90` chỉ là một **giá trị ví dụ** mà tôi đặt ra để chúng ta có một con số cụ thể và dễ hình dung khi "chạy tay" qua thuật toán.

Trong ứng dụng thực tế, giá trị `periodDays` này sẽ **không được viết cứng** trong hàm `calculateDcaResult`. Thay vào đó, nó sẽ được **người dùng quyết định** thông qua giao diện.

---

### **Luồng dữ liệu sẽ diễn ra như thế nào?**

Hãy nhớ lại bản phác thảo component `DcaCalculator.jsx` của chúng ta:

```
+------------------------------------------------------+
|                                                      |
|           **Cỗ Máy Thời Gian DCA** 🚀                  |
|                                                      |
|  ...                                                 |
|                                                      |
|  Kể từ:      [ 3 năm trước       ▼ ]  <--- (1) Người dùng chọn ở đây |
|                                                      |
|                 +-----------------+                  |
|                 |   Xem kết quả   |  <--- (2) Người dùng nhấn nút     |
|                 +-----------------+                  |
|                                                      |
+------------------------------------------------------+
```

1.  **Bước 1: Người dùng tương tác (UI Layer)**
    *   Người dùng sẽ nhìn thấy một ô `select` (dropdown) hoặc các nút bấm cho phép họ chọn khoảng thời gian, ví dụ: "1 năm trước", "3 năm trước", "5 năm trước".
    *   Giả sử người dùng chọn **"3 năm trước"**.
    *   Component `DcaCalculator.jsx` sẽ lưu lựa chọn này vào một `state`. Bên trong, nó sẽ chuyển đổi lựa chọn "3 năm trước" thành một con số cụ thể, ví dụ `periodDays = 365 * 3 = 1095`.

2.  **Bước 2: Gọi hàm tính toán (Logic Layer)**
    *   Khi người dùng nhấn nút "Xem kết quả", hàm `handleCalculate` trong component sẽ được kích hoạt.
    *   Bên trong hàm này, chúng ta sẽ gọi `calculateDcaResult` và **truyền `periodDays` từ state vào** như một tham số:

    ```javascript
    // Bên trong DcaCalculator.jsx

    const [period, setPeriod] = useState('3y'); // '1y', '3y', '5y'
    // ...

    const handleCalculate = () => {
      // ... gọi API lấy historicalData ...

      const periodInDays = convertPeriodToDays(period); // ví dụ: '3y' -> 1095

      const result = calculateDcaResult({
        historicalData: dataFromApi,
        investment: 100, // Lấy từ state
        frequency: 'monthly', // Lấy từ state
        periodDays: periodInDays, // <--- Đây chính là nó!
      });

      // ... hiển thị kết quả ...
    }
    ```

**Tóm lại:**
Con số `90` chỉ là một **giá trị giả định (placeholder)** để giải thích thuật toán. Trong thực tế, giá trị `periodDays` sẽ là một **biến số động (dynamic variable)**, được quyết định bởi hành động của người dùng trên giao diện và được truyền vào hàm `calculateDcaResult` như một tham số. Hàm tính toán của chúng ta không cần biết con số đó là bao nhiêu, nó chỉ cần nhận và xử lý.

**Dòng 46-48: `let totalInvested = 0; ...`**
*   **Cú pháp:** Khởi tạo các biến "tích lũy".
*   **"Chạy tay":**
    *   `totalInvested` = `0`
    *   `totalCoins` = `0`
    *   `currentDate` = `25/07/2025` (bản sao của `startDate`). `currentDate` sẽ là "nhà du hành thời gian" của chúng ta.

**Dòng 50: `while (currentDate <= now) { ... }`**
*   **Cú pháp:** Vòng lặp `while`.
*   **Đọc là:** "Chừng nào `currentDate` (ngày đang xét) vẫn còn **nhỏ hơn hoặc bằng** ngày hôm nay (`now`), **thì** tiếp tục thực hiện khối lệnh bên trong."
*   **Mục đích:** Đây chính là cỗ máy thời gian, đảm bảo chúng ta lặp qua từng tháng/tuần từ quá khứ cho đến hiện tại.

---
**BÊN TRONG VÒNG LẶP (Lần lặp đầu tiên)**
*   `currentDate` đang là `25/07/2025`. Điều kiện `25/07/2025 <= 25/10/2025` là **đúng**.

**Dòng 51: `const price = findClosestPrice(historicalData, currentDate);`**
*   **Cú pháp:** Gọi hàm trợ giúp mà chúng ta đã mổ xẻ trước đó.
*   **"Chạy tay":** Nó sẽ tìm trong `historicalData` và trả về giá gần nhất với ngày `25/07/2025`. Giả sử `price` = `50000`.

**Dòng 53-57: `if (price !== null && price > 0) { ... }`**
*   **Cú pháp:** Kiểm tra xem giá tìm được có hợp lệ không.
*   **"Chạy tay":** `50000` là hợp lệ.
    *   **Dòng 54:** `coinsBought` = `100 / 50000` = `0.002`.
    *   **Dòng 55:** `totalCoins` = `0 + 0.002` = `0.002`.
    *   **Dòng 56:** `totalInvested` = `0 + 100` = `100`.

**Dòng 59-63: `if (frequency === 'monthly') { ... }`**
*   **Cú pháp:** Khối lệnh để "dịch chuyển" nhà du hành thời gian.
*   **"Chạy tay":** `frequency` là `'monthly'`, nên nó sẽ vào khối `if`.
    *   **Dòng 60: `currentDate.setMonth(currentDate.getMonth() + 1);`**:
        *   `currentDate.getMonth()`: Lấy tháng hiện tại (tháng 7).
        *   `+ 1`: Cộng thêm 1.
        *   `setMonth(...)`: Cập nhật lại tháng cho `currentDate`.
        *   Kết quả: `currentDate` bây giờ được cập nhật thành `25/08/2025`.

*(Kết thúc lần lặp 1. Vòng lặp quay lại dòng 50, kiểm tra `25/08/2025 <= 25/10/2025` -> đúng, và tiếp tục lặp... cho đến khi `currentDate` trở thành `25/11/2025`, lúc đó điều kiện `while` sẽ sai và vòng lặp kết thúc.)*

---
**SAU KHI VÒNG LẶP KẾT THÚC**

**Dòng 66: `const latestPrice = historicalData[historicalData.length - 1][1];`**
*   **Cú pháp:** Lấy giá cuối cùng trong mảng.
*   **Mổ xẻ:**
    *   `historicalData.length - 1`: Lấy chỉ số (index) của phần tử cuối cùng.
    *   `historicalData[...]`: Truy cập vào phần tử cuối cùng, ví dụ: `[1761208001602, 60000]`.
    *   `[1]`: Lấy giá trị thứ hai trong mảng con đó, chính là `price`.
*   **"Chạy tay":** `latestPrice` = `60000` (giả sử).

**Dòng 67: `const currentValue = totalCoins * latestPrice;`**
*   **Cú pháp:** Tính giá trị tài sản hiện tại.
*   **"Chạy tay":** `currentValue` = (tổng số coin tích lũy được) * `60000`.

**Dòng 68: `const profitLoss = currentValue - totalInvested;`**
*   **Cú pháp:** Tính lời/lỗ.
*   **"Chạy tay":** `profitLoss` = `currentValue` - (tổng số tiền đã bỏ ra).

**Dòng 70-75: `return { ... };`**
*   **Cú pháp:** Trả về một object chứa tất cả các kết quả đã tính toán.

Hy vọng phần giải thích siêu chi tiết này giúp bạn nắm vững từng bước của thuật toán!