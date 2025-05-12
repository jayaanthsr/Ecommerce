
import React, { useRef, useEffect } from 'react';
import '../../styles/CategoryList.css';

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const categories = ['all', 'Dish','TV','Remote','setup box'];
  const listRef = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    // Scroll active item into view when selected category changes
    if (activeItemRef.current && listRef.current) {
      const list = listRef.current;
      const activeItem = activeItemRef.current;

      const listRect = list.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();

      const isVisible =
          activeRect.left >= listRect.left &&
          activeRect.right <= listRect.right;

      if (!isVisible) {
        const scrollPosition = activeItem.offsetLeft - list.offsetLeft - (list.clientWidth / 2) + (activeItem.clientWidth / 2);
        list.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [selectedCategory]);

  return (
      <div className="category-list" ref={listRef}>
        {categories.map((category) => (
            <button
                key={category}
                className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => onSelectCategory(category)}
                ref={selectedCategory === category ? activeItemRef : null}
                style={{padding:'10px'}}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        ))}
      </div>
  );
};

export default CategoryList;
