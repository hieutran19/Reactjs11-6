import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Form = () => {
  const [data, setData] = useState([]); // Khởi tạo state để lưu dữ liệu API
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [isCreating, setIsCreating] = useState(false); // Trạng thái để kiểm tra form tạo sản phẩm mới
  const [newProduct, setNewProduct] = useState({ name: '', price: '' }); // Trạng thái lưu thông tin sản phẩm mới
  const [editProduct, setEditProduct] = useState(null); // Trạng thái lưu thông tin sản phẩm đang chỉnh sửa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ca957df743e560e6ad8f.free.beeceptor.com/api/users/');
        setData(response.data); // Cập nhật state với dữ liệu từ API
        setLoading(false); // Dữ liệu đã tải xong
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu từ API'); // Cập nhật lỗi nếu có
        setLoading(false);
      }
    };

    fetchData(); // Gọi hàm lấy dữ liệu khi component render lần đầu
  }, []); // Mảng rỗng [] để chỉ chạy một lần khi component render

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ca957df743e560e6ad8f.free.beeceptor.com/api/users/${id}`);
      // Nếu xóa thành công, cập nhật lại danh sách dữ liệu
      setData(data.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      // Gửi yêu cầu PUT để cập nhật sản phẩm
      const response = await axios.put(`https://ca957df743e560e6ad8f.free.beeceptor.com/api/users/${id}`, editProduct);
      // Cập nhật lại dữ liệu sau khi cập nhật thành công
      setData(data.map((product) => 
        product.id === id ? { ...product, ...response.data } : product
      ));
      setEditProduct(null); // Reset trạng thái chỉnh sửa
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
    }
  };

  const handleCreate = () => {
    if (newProduct.name && newProduct.price) {
      const newProductData = {
        id: Math.random().toString(36).substr(2, 9), // Tạo id ngẫu nhiên cho sản phẩm
        name: newProduct.name,
        price: newProduct.price,
      };
      setData([newProductData, ...data]); // Thêm sản phẩm mới vào đầu danh sách
      setNewProduct({ name: '', price: '' }); // Reset form
      setIsCreating(false); // Đóng form tạo mới
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải dữ liệu
  }

  if (error) {
    return <p>{error}</p>; // Hiển thị lỗi nếu có
  }

  return (
    <>
      <div>hello</div>
      
      {/* Nút tạo sản phẩm mới */}
      <button onClick={() => setIsCreating(true)} style={{ marginBottom: '20px' }}>
        Tạo sản phẩm mới
      </button>

      {/* Form tạo sản phẩm mới */}
      {isCreating && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Tạo sản phẩm mới</h3>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Giá"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleCreate}>Thêm sản phẩm</button>
          <button onClick={() => setIsCreating(false)} style={{ marginLeft: '10px' }}>Hủy</button>
        </div>
      )}

      {/* Form cập nhật sản phẩm */}
      {editProduct && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Cập nhật sản phẩm</h3>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Giá"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <button onClick={() => handleUpdate(editProduct.id)}>Cập nhật</button>
          <button onClick={() => setEditProduct(null)} style={{ marginLeft: '10px' }}>Hủy</button>
        </div>
      )}

      <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>ID</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.id}</td>
              <td>
                <button onClick={() => setEditProduct(product)}>Cập nhật</button>
                <button onClick={() => handleDelete(product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Form;
