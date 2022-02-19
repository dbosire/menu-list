import React, { useEffect, useState } from "react";
import Cart from "./Cart";
const Menu = ({ items, activeCat, cartorders, activeCategory }) => {
  const placeOrderFxn = async (id, title, img, desc, price) => {
    try {
      const description = desc;
      const phonenumber = "254716880932";
      const product_name = title;
      const quantity = 1;
      const total_price = quantity * price;
      const customer_id = "e69ca842-c4bc-448b-b82b-c34b63b0ebfd";
      const body = {
        id,
        title,
        img,
        description,
        price,
        product_name,
        phonenumber,
        total_price,
        quantity,
        customer_id,
      };
      const response = await fetch("http://localhost:9000/order/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/";
      //console.log(response);
      //console.log("desc " + description);
    } catch (err) {
      console.error(err.message);
    }
  };

  console.log("categ no : " + cartorders.length);
  if (activeCat === "Cart") {
    return (
      <div className="section-center-cart">
        <Cart
          cartorders={cartorders}
          cartItems={(cartorders.length, (activeCategory = { activeCategory }))}
        />
      </div>
    );
  } else {
    return (
      <div className="section-center">
        {items.map((item) => {
          const { id, title, img, desc, price } = item;

          return (
            <article key={id} className="menu-item">
              <img src={img} alt={title} className="photo" />
              <div className="item-info">
                <header>
                  <h4>{title}</h4>
                  <h4 className="price">Ksh {price}</h4>
                </header>
                <p className="item-text">{desc}</p>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => placeOrderFxn(id, title, img, desc, price)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }
};

export default Menu;
