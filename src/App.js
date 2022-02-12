import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Categories from "./Categories";
import items from "./data";
import logo from "./logo.JPG";

const allCategories = [
  "all",
  ...new Set(items.map((item) => item.category)),
  "Cart",
];

const App = () => {
  const [menuItems, setMenuItems] = useState(items);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState(allCategories);
  const [itemCount, setItemCount] = useState(0);
  const [cartorders, setCartorders] = useState([]);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  //get all orders
  const getOrderCart = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/getorders/254716880932"
      );

      const jsonData = await response.json();
      //console.log(jsonData);
      setCartorders(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getOrderCart();
  }, []);

  console.log(cartorders);

  return (
    <main>
      <section className="menu section">
        <div className="title">
          <img src={logo} alt="logo" className="logo" />
          <h2>Menu List</h2>
          <div className="underline"></div>
        </div>
        <Categories
          categories={categories}
          activeCategory={activeCategory}
          filterItems={filterItems}
          cartorders={cartorders}
        />
        <Menu items={menuItems} />
      </section>
    </main>
  );
};

export default App;
