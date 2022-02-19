import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Spinner from "./util/spinner";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CartItem from "./CartItem";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";

import "./cart.css";

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  title: {
    margin: "40px 0px 20px 128px",
    display: "inline-block",
    marginRight: "40%",
  },
  spaceTypo: {
    display: "flex",
    justifyContent: "space-between",
  },
  address: {
    "& > *": {
      margin: theme.spacing(4),
      width: "25ch",
    },
  },
  checkoutButton: {
    backgroundColor: "#1266f1",
    color: "white",
    marginBottom: 20,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
    "&:disabled": {
      color: "#bfbfbf",
    },
  },
  mainClass: {
    flexWrap: "wrap",
    display: "flex",
    "& > *": {
      height: theme.spacing(30),
      margin: theme.spacing(5),
      width: theme.spacing(30),
    },
  },
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

const Cart = (props) => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [cartorders, setCartorders] = useState(props.cartorders);
  let [phonenumberx, setPhonenumber] = useState("");
  let deliveryCharge = 0;
  //calculate grand total
  let price = 0;
  console.log(cartorders);
  const all_items = cartorders;
  all_items.forEach((item) => {
    const sub_total = item.quantity * item.price;
    price += sub_total;
  });

  const nextStep = () => {
    setStep(step + 1);
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

  const prevStep = () => {
    setStep(step - 1);
  };
  useEffect(() => {
    getCartOrder();
  }, []);

  const handleSubmit = async (e) => {
    console.log("submitting " + phonenumberx);
    console.log(cartorders);
    console.log("price " + price);

    try {
      const body = {
        phonenumberx,
        price,
      };

      <Spinner />;

      const response = await fetch(`http://128.199.136.78/lipanampesa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  function handleChange(e) {
    setPhonenumber(e.target.value);
    console.log(phonenumberx.length);
  }

  return (
    <>
      <Grid container direction="row" spacing={1}>
        <Grid item sm={7}>
          {step === 1 &&
            props.cartorders.map((item) => (
              <CartItem
                {...item}
                key={item.order_id}
                cartorders={cartorders}
                activeCategory={props.activeCategory}
              />
            ))}
        </Grid>
        <Grid item sm={4}>
          <form class="needs-validation" novalidate>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#faf7f7" }}
              elevation={4}
            >
              <div style={{ marginLeft: 20, marginRight: 20 }}>
                <br />
                <br />
                <Typography gutterBottom variant="h5" noWrap>
                  {step === 1 && "Total Amount"}

                  <br />
                  <br />
                </Typography>
                {step === 1 && (
                  <Typography variant="body2" color="textPrimary">
                    <div className={classes.spaceTypo}>
                      <span>Initial amount</span>
                      <span>Ksh. {price}</span>
                    </div>
                    <br />
                    <br />
                    <div className={classes.spaceTypo}>
                      <span>Delivery Charge</span>
                      <span>Ksh. {deliveryCharge}</span>
                    </div>
                    <br />
                    <br />
                    <br />
                    <div className={classes.spaceTypo}>
                      <label for="inputPassword6">Phone number</label>
                      <input
                        type="tel"
                        id="phonenumber"
                        name="phonenumber"
                        class="form-control mx-sm-3"
                        placeholder="254712345678"
                        value={phonenumberx}
                        required
                        onChange={handleChange}
                      ></input>
                    </div>
                    <br />
                  </Typography>
                )}

                <hr />
                <Typography gutterBottom variant="h5" noWrap>
                  <div className={classes.spaceTypo}>
                    <span>Grand Total</span>
                    <span>Ksh. {price + deliveryCharge}</span>
                  </div>
                  <br />
                </Typography>
                {step === 1 && (
                  <Button
                    fullWidth
                    className={classes.checkoutButton}
                    disabled={price === 0}
                    disabled={phonenumberx === "" || phonenumberx.length < 12}
                    onClick={handleSubmit}
                  >
                    Proceed to Checkout
                  </Button>
                )}
              </div>
            </Paper>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Cart;
