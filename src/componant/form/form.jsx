import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Form = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editProduct, setEditProduct] = useState(null);

  // URL API của backend
  const API_URL = 'http://localhost:8000/products';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data); // Cập nhật state với dữ liệu từ API
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu từ API');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData(data.filter((product) => product._id !== id)); // Xóa sản phẩm khỏi state
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, editProduct);
      setData(data.map((product) =>
        product._id === id ? { ...product, ...response.data } : product
      ));
      setEditProduct(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
    }
  };

  const handleCreate = async () => {
    if (newProduct.name && newProduct.price) {
      try {
        const response = await axios.post(API_URL, newProduct);
        setData([response.data, ...data]); // Thêm sản phẩm mới vào danh sách
        setNewProduct({ name: '', price: '' });
        setIsCreating(false);
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>hello</div>
      
      <button onClick={() => setIsCreating(true)} style={{ marginBottom: '20px' }}>
        Tạo sản phẩm mới
      </button>

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
          <button onClick={() => handleUpdate(editProduct._id)}>Cập nhật</button>
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
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product._id}</td>
              <td>
                <button onClick={() => setEditProduct(product)}>Cập nhật</button>
                <button onClick={() => handleDelete(product._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Form;
