<!-- b4c691d2-b4eb-484a-8356-d83c3c447fac 0dab68b6-e516-45f9-b609-7badc79b4dc2 -->
# Kế hoạch "Dọn dẹp" Toàn diện

## 1. Xây dựng lại "Nền Móng": `savvy-app/src/context/PortfolioContext.jsx`

**Mục tiêu:** Biến `transactions` thành "Nguồn Chân lý Duy nhất" và tự động tính toán `holdings` từ nó. Điều này sẽ loại bỏ gốc rễ của lỗi `duplicate key`.

**Các hành động chính:**

1.  **Thêm `useEffect` trung tâm:** Tạo một `useEffect` mới. Mỗi khi mảng `transactions` thay đổi (do thêm, sửa, hoặc xóa), `useEffect` này sẽ tự động chạy và tính toán lại từ đầu toàn bộ mảng `holdings`.
2.  **Đơn giản hóa các hàm xử lý:** Viết lại các hàm `handleAddTransaction`, `handleEditTransaction`, và `handleDeleteTransaction` để chúng chỉ thực hiện một nhiệm vụ duy nhất: cập nhật mảng `transactions`.
3.  **Chặn gọi API hai lần:** Thêm `useRef` guard vào các `useEffect` gọi API để giải quyết lỗi `429 Too Many Requests` trong môi trường phát triển.

**Ví dụ về `useEffect` trung tâm:**

```javascript
useEffect(() => {
    // Logic tính toán lại holdings từ transactions...
    const holdingsSummary = transactions.reduce(...);
    const newHoldingsArray = Object.keys(holdingsSummary).map(...);
    setHoldings(newHoldingsArray);
}, [transactions]); // Chạy lại mỗi khi transactions thay đổi
```

## 2. Sửa chữa "Điểm Tương tác": `savvy-app/src/components/portfolio/AddTransactionForm.jsx`

**Mục tiêu:** Đảm bảo Form gửi đi dữ liệu chính xác và không bao giờ gây ra xung đột.

**Các hành động chính:**

1.  **Viết lại `handleSubmit`:** Tái cấu trúc hàm này để logic trở nên rạch ròi. Nó sẽ tạo ra `transactionData`, sau đó kiểm tra `isEditMode` để gọi **hoặc là** `editTransaction`, **hoặc là** `addTransaction`.
2.  **Tối ưu hóa `useEffect`:** Sắp xếp lại các `useEffect` để quản lý việc điền dữ liệu (khi sửa) và reset form (khi thêm mới) một cách an toàn, giải quyết các cảnh báo "controlled input".

**Ví dụ về `handleSubmit` mới:**

```javascript
const handleSubmit = (event) => {
    event.preventDefault();
    // ...kiểm tra input...

    const transactionData = {
        id: isEditMode ? transactionToEdit.id : 't_' + new Date().getTime(),
        // ...dữ liệu khác...
    };

    if (isEditMode) {
        editTransaction(transactionData);
    } else {
        addTransaction(transactionData);
    }

    onClose();
};
```