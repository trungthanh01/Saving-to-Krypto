import { useState, useContext } from "react";
import './AddHoldingForm.css'
import { PortfolioContext } from "../../context/PortfolioContext.jsx";

export function AddHoldingForm() {
  // Đổi tên biến để tránh trùng lặp với hàm trong context,
  // và để rõ ràng hơn đây là hàm lấy từ context.
  const { addHolding: onAddHoldingFromContext } = useContext(PortfolioContext);
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');

  // Sửa lại hàm xử lý để nhận 'event'
  const handleSubmit = (event) => {
    // Thêm lại preventDefault()
    event.preventDefault();

    if (coinId.length === 0 || amount.length === 0) {
      alert("Vui lòng nhập đủ thông tin Coin ID và Số lượng.");
      return;
    }

    const newHolding = {
      id: coinId.toLowerCase().trim(),
      amount: parseFloat(amount)
    };
    
    console.log('Form Submitted!', newHolding);
    onAddHoldingFromContext(newHolding);

    setCoinId('');
    setAmount('');
  };
  
  // Lỗi 4: Các dòng setCoinId('') và setAmount('') đã được di chuyển từ đây vào trong handleSubmit.
  // Gọi hàm set... trực tiếp trong thân component sẽ gây ra vòng lặp render vô hạn.

  return (
    // Đổi `action` thành `onSubmit`
    <form onSubmit={handleSubmit}>
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