import React, { useState, useEffect } from "react";

//m-ui
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// Icons
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MyButton from "./util/MyButton";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
  },
  itemTotal: {
    marginLeft: "62%",
    marginTop: "10px",
  },
  imgCover: { height: 184, width: 270 },
}));

export default function CartItem(props) {
  //const price = props.price;
  //const quantity = props.quantity;
  //const title = props.title;
  const classes = useStyles();
  const [cartorders, setCartorders] = useState(props.cartorders);
  const { quantity, title, price, img, order_id } = props;
  const handleAddItem = async () => {
    console.log("add item " + order_id);
    try {
      const body = {
        order_id,
      };
      const response = await fetch(
        `http://128.199.136.78/updateOrder/${order_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      window.location = "/";
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteItem = async () => {
    console.log("delete item " + order_id);
    try {
      const body = {
        order_id,
      };
      const response = await fetch(
        `http://128.199.136.78/deleteItemOrder/${order_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setCartorders(
        cartorders.filter((cartorder) => cartorder.order_id != order_id)
      );
      window.location = "/";
    } catch (err) {
      console.log(err.message);
    }
  };
  //get cart orders
  const getCartOrder = async () => {
    try {
      const response = await fetch(
        "http://128.199.136.78/getorders/254716880932"
      );
      const jsonData = await response.json();
      setCartorders(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleRemoveItem = async () => {
    // removeCartItem(order_id);
    console.log("remove item " + order_id);
    try {
      const body = {
        order_id,
      };
      const response = await fetch(
        `http://128.199.136.78/removeItem/254716880932/${order_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      window.location = "/";
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getCartOrder();
  }, []);

  return (
    <>
      <Card className={classes.root} variant="outlined">
        <div className={classes.imgCover}>
          <img src={props.img} height="184" width="180" alt="Item" />
        </div>

        <div className={classes.details}>
          <CardContent>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" noWrap>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Ksh.{price} x {quantity}
            </Typography>

            <div className={classes.buttons}>
              <MyButton tip="Remove Item" onClick={handleRemoveItem}>
                <RemoveIcon style={{ color: "#f44336" }} />
              </MyButton>
              <MyButton tip="Add Item" onClick={handleAddItem}>
                <AddIcon style={{ color: "green" }} />
              </MyButton>
              <MyButton tip="Delete Item" onClick={handleDeleteItem}>
                <DeleteIcon style={{ color: "#f44336" }} />
              </MyButton>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.itemTotal}
              >
                Ksh. {price * quantity}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
      <br />
    </>
  );
}
