import React, { useEffect, useState } from 'react';
import { categoryApi } from '../../api/api';

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Instead of fetching from the API, use hardcoded dummy categories
    const dummyCategories = [
      { id: 1, name: 'TV' },
      { id: 2, name: 'Sound' },
      { id: 3, name: 'Radio' },
      { id: 4, name: 'Remote' },
      { id: 5, name: 'Dish' },
      { id: 6, name: 'Setup Box' },
    ];

    setCategories(dummyCategories);
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
