import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsGrid } from "react-icons/bs";
import { TiThListOutline } from "react-icons/ti";
import "./styles.css";

const ProductsList = () => {
  // Defining the URL for fetching product data
  const url = "https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093";

  // State for storing product data, search text, and grid and list view mode
  const [productsData, setProductsData] = useState();
  const [searchText, setSearchText] = useState("");
  const [isGrid, setIsGrid] = useState(false);

  // Fetchting product data from the provided URL when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setProductsData(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Handling the search input change and update the filtered data
  const handleSearch = (text) => {
    setSearchText(text);
    filterData(text);
  };

  // Filtering the product data based on the search text
  const filterData = (text) => {
    const filtered = productsData.map((product) => ({
      ...product,
      product_variants: product.product_variants.map((variant) => {
        const variantValue = Object.values(variant)[0];
        const isHighlighted = text
          ? variantValue.toLowerCase().includes(text.toLowerCase())
          : false;
        return {
          ...variant,
          isHighlighted: isHighlighted,
        };
      }),
    }));
    setProductsData(filtered);
  };

  // Switch to list view
  const toggleToList = () => {
    setIsGrid(false);
  };

  // Switch to grid view
  const toggleToGrid = () => {
    setIsGrid(true);
  };

  return (
    <div className="product-listing-page">
      {/* Page heading */}
      <h1 className="heading">PLP</h1>
      <div className="search-container">
        {/* Search input */}
        <input
          type="search"
          placeholder="Type something to search ..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* Toggle buttons for list and grid view */}
        <TiThListOutline onClick={toggleToList} className="icon" />
        <BsGrid onClick={toggleToGrid} className="icon" />
      </div>
      <ul
        className={
          isGrid
            ? "products-list-items-container-grid"
            : "products-list-items-container-list"
        }
      >
        {/* Conditionally render product items or loading message */}
        {Array.isArray(productsData) ? (
          productsData.map((product, index) => (
            <ProductItem key={index} product={product} isGrid={isGrid} />
          ))
        ) : (
          <div>
            {/* Loading message */}
            <h1 className="loading">Loading...</h1>
          </div>
        )}
      </ul>
    </div>
  );
};

const ProductItem = ({ product, isGrid }) => (
  <li className={isGrid ? "product-list-item-grid" : "product-list-item-list"}>
    <div className={isGrid ? "image-container-grid" : "image-container-list"}>
      <h1 className={isGrid ? "product-badge-grid" : "product-badge-list"}>
        {product.product_badge}
      </h1>
      <img
        className={isGrid ? "image-grid" : "image-list"}
        src={`${product.product_image}`}
        alt={product.product_title}
      ></img>
    </div>
    <div className="product_variants-container">
      <ul className="product_variants">
        {/* Product title */}
        <h2>{product.product_title}</h2>
        {product.product_variants.map((variant, variantIndex) => (
          <VariantItem key={variantIndex} variant={variant} isGrid={isGrid} />
        ))}
      </ul>
    </div>
  </li>
);

const VariantItem = ({ variant, isGrid }) => (
  <li
    className={
      variant.isHighlighted
        ? `variant-product ${isGrid ? "highlight-grid" : "highlight-list"}`
        : "variant-product"
    }
  >
    {/* Display variant text */}
    {Object.values(variant)[0]}
  </li>
);

export default ProductsList;
