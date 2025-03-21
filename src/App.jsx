import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,} from "recharts";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        updateChartData(data);
      });
  }, []);

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    updateChartData(filtered);
  };

  const updateChartData = (data) => {
    const categoryCounts = data.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(categoryCounts).map(([key, value]) => ({
      category: key,
      count: value,
    }));

    setChartData(formattedData);
  };

  return (
    <div className="container">
      <h1 className="title">Productos en existencia</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Buscar
        </button>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="chart-container">
        <h2>Categorías</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#248eff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductDashboard;