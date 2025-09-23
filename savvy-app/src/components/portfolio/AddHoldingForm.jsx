import { useState } from "react";

export function AddHoldingForm({ onAddHolding }) {
  // Sửa lỗi 1: React Hooks (useState, useEffect,...) phải được gọi bên trong một component.
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');

  // Sửa lỗi 2: Hàm xử lý sự kiện luôn nhận một đối tượng 'event' làm tham số đầu tiên.
  const handleAction = () => {
    // Dòng event.preventDefault() không còn cần thiết.

    // Sửa lỗi 3: Thay vì chỉ reset, hãy thông báo cho người dùng.
    if (coinId.length === 0 || amount.length === 0) {
      alert("Vui lòng nhập đủ thông tin Coin ID và Số lượng.");
      return; // Dừng hàm tại đây.
    }

    const newHolding = {
      id: coinId.toLowerCase().trim(), // Thêm .trim() để xóa các khoảng trắng thừa
      amount: parseFloat(amount)
    };
    
    console.log('Form Action Triggered!', newHolding);
    onAddHolding(newHolding);

    // Sửa lỗi 4: Logic reset form được chuyển vào cuối hàm handleSubmit.
    // Nó chỉ chạy sau khi đã thêm thành công.
    setCoinId('');
    setAmount('');
  };
  
  // Lỗi 4: Các dòng setCoinId('') và setAmount('') đã được di chuyển từ đây vào trong handleSubmit.
  // Gọi hàm set... trực tiếp trong thân component sẽ gây ra vòng lặp render vô hạn.

  return (
    // Sửa lỗi 5: Trong React, chúng ta sử dụng `onSubmit` để xử lý sự kiện submit của form.
    <form action={handleAction}>
      <h3>Thêm Coin Mới</h3>
      <input
        type="text"
        placeholder="Coin ID (vd: bitcoin)"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số lượng"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="any" // Cho phép số thập phân
      />
      <button type="submit">Thêm</button>
    </form>
  );
}