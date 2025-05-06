import React, { useEffect, useState } from 'react';
import { categoryApi } from '../../api/api';

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Using mock data until backend is ready

        const response = await categoryApi.getAllCategories();
        setCategories(response.data);


      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (loading) {
    return <div>Loading categories...</div>;
  }
  
  return (
    <div className="category-list">
      <h3 className="category-title">Categories</h3>
      <div className="category-items">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.slug ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;