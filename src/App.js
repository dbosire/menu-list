import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Categories from "./Categories";
import items from "./data";
import logo from "./logo.JPG";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const allCategories = [
  "all",
  ...new Set(items.map((item) => item.category)),
  "Cart",
];

const App = () => {
  const [menuItems, setMenuItems] = useState(items);
  const [activeCategory, setActiveCategory] = useState("Cart");
  const [categories, setCategories] = useState(allCategories);
  const [itemCount, setItemCount] = useState(0);
  const [cartorders, setCartorders] = useState([]);
  const [selectedCategr, setSelectedCategr] = useState("");

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(items);
      setSelectedCategr(category);
      return;
    } else if (category === "Cart") {
      setMenuItems(cartorders);
      setSelectedCategr(category);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  //get all orders
  const getOrderCart = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/getorders/254716880932"
      );
      const jsonData = await response.json();
      setCartorders(jsonData);
      setItemCount(jsonData.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getOrderCart();
    // console.log(itemCount);
  }, []);
  // console.log("dn ");
  // console.log(cartorders);
  // console.log("dn ");
  // console.log(itemCount);
  // console.log("cat: " + activeCategory);

  return (
    <main>
      <section className="menu section">
        <div className="title">
          <img src={logo} alt="logo" className="logo" />
          <h2>Menu List</h2>
          <div className="underline"></div>
        </div>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <Categories
                    categories={categories}
                    activeCategory={activeCategory}
                    filterItems={filterItems}
                    cartorders={cartorders}
                    itemCount={itemCount}
                  />
                  <Menu
                    items={menuItems}
                    activeCat={activeCategory}
                    cartorders={cartorders}
                  />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Categories
                    categories={categories}
                    activeCategory={activeCategory}
                    filterItems={filterItems}
                    cartorders={cartorders}
                    itemCount={itemCount}
                  />
                  <Menu
                    items={menuItems}
                    activeCat={activeCategory}
                    cartorders={cartorders}
                  />
                </>
              }
            />
          </Routes>
        </Router>
      </section>
    </main>
  );
};

export default App;
