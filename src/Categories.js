import React from "react";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const Categories = ({
  categories,
  filterItems,
  activeCategory,
  cartorders,
}) => {
  return (
    <div className="btn-container">
      {categories.map((category, index) => {
        if (category === "Cart")
          return (
            <button
              type="button"
              className={`${
                activeCategory === category ? "filter-btn active" : "filter-btn"
              }`}
              key={index}
              onClick={() => filterItems(category)}
            >
              <Badge color="secondary" badgeContent={cartorders.length}>
                <ShoppingCartIcon />{" "}
              </Badge>
            </button>
          );
        else
          return (
            <button
              type="button"
              className={`${
                activeCategory === category ? "filter-btn active" : "filter-btn"
              }`}
              key={index}
              onClick={() => filterItems(category)}
            >
              {category}
            </button>
          );
      })}
    </div>
  );
};

export default Categories;
