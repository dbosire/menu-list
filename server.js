const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
//middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//ROUTES

//create a todo
app.post("/todo", async (req, res) => {
  try {
    const { description } = req.body;
    const newToDo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newToDo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//get all todo
app.get("/todo", async (req, res) => {
  try {
    const getToDo = await pool.query("SELECT * FROM todo");
    res.json(getToDo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo
app.get("/todo/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const getById = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [
      id,
    ]);

    res.json(getById.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a todo
app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateToDo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("Record updated!");
  } catch (err) {
    console.error(err.message);
  }
});
//delete a todo

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const delToDo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [id]);
    res.json("Record deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

//post order item
app.post("/order/add", async (req, res) => {
  console.log(req.body);
  try {
    const {
      phonenumber,
      product_name,
      price,
      img,
      description,
      title,
      quantity,
      total_price,
      customer_id,
    } = req.body;

    const request_body = req.body;
    const created_at = new Date();
    console.log(request_body);

    const check = await pool.query(
      "SELECT * FROM order_items WHERE product_name=$1 AND phonenumber=$2",
      [product_name, phonenumber]
    );

    if (check.rowCount === 0) {
      const response = await pool.query(
        "INSERT INTO order_items(phonenumber,product_name,price,img,description,title,quantity,total_price,order_request,customer_id,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)  RETURNING *",
        [
          phonenumber,
          product_name,
          price,
          img,
          description,
          title,
          quantity,
          total_price,
          request_body,
          customer_id,
          created_at,
        ]
      );
      console.log(response.rows);
    } else {
      const currentCount = check.rows[0].quantity;
      const order_id = check.rows[0].order_id;
      console.log("currentCount " + currentCount + " order_id " + order_id);
      console.log("Before ++ " + currentCount);
      let newCurrentCount = currentCount + 1;
      console.log("After ++ " + newCurrentCount);
      const response = await pool.query(
        "UPDATE order_items SET quantity=$1 WHERE order_id=$2 ",
        [newCurrentCount, order_id]
      );
      console.log(response.rows);
    }
    res.json({ ResponseCode: 1000, ResponseDesc: "Record added successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/getorders/:phonenumber", async (req, res) => {
  try {
    const { phonenumber } = req.params;
    const getorders = await pool.query(
      "SELECT * FROM order_items WHERE phonenumber=$1",
      [phonenumber]
    );
    res.json(getorders.rows);
    console.log(getorders);
  } catch (err) {
    console.error(err.message);
  }
});

//delete order
app.delete("/deleteItemOrder/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const del = await pool.query("DELETE FROM order_items WHERE order_id=$1", [
      order_id,
    ]);
  } catch (err) {
    console.error(err.message);
  }
  res.json({ ResponseCode: 1000, ResponseDesc: "Deleted successfully" });
});
//update order
app.put("/updateOrder/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const phonenumber = req.params.phonenumber;
    const check = await pool.query(
      "SELECT * FROM order_items WHERE order_id=$1",
      [order_id]
    );
    const currentCount = check.rows[0].quantity;
    const newcurrentCount = currentCount + 1;

    const response = await pool.query(
      "UPDATE order_items SET quantity=$1 WHERE order_id=$2 ",
      [newcurrentCount, order_id]
    );
  } catch (err) {
    console.error(err.message);
  }
  res.json({ ResponseCode: 1000, ResponseDesc: "Record updated successfully" });
});

//remove item
app.put("/removeItem/:phonenumber/:order_id", async (req, res) => {
  try {
    console.log(req.params);
    const order_id = req.params.order_id;
    const phonenumber = req.params.phonenumber;
    const check = await pool.query(
      "SELECT * FROM order_items WHERE order_id=$1 AND phonenumber=$2",
      [order_id, phonenumber]
    );
    const currentCount = check.rows[0].quantity;
    if (currentCount === 1) {
      //delete the order
      const del = await pool.query(
        "DELETE FROM order_items WHERE order_id=$1",
        [order_id]
      );
    } else {
      //Decrement quantity

      const newcurrentCount = currentCount - 1;
      console.log(
        " decrement newcurrentCount " +
          newcurrentCount +
          " order_id " +
          order_id
      );
      const response = await pool.query(
        "UPDATE order_items SET quantity=$1 WHERE order_id=$2 ",
        [newcurrentCount, order_id]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
  res.json({ ResponseCode: 1000, ResponseDesc: "Record updated successfully" });
});
//token fxn
const getOAuthToken = async () => {
  //let consumer_key = process.env.consumer_key;
  //let consumer_secret = process.env.consumer_secret;
  //let url = process.env.oauth_token_url;

  let consumer_key = "Q9zdQxlFuk0j3kAm5B8pjtM51xlIEQlA";
  let consumer_secret = "orRtznsrjr3rFKVf";
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  //form a buffer of the consumer key and secret
  let buffer = new Buffer.from(consumer_key + ":" + consumer_secret);

  let auth = `Basic ${buffer.toString("base64")}`;

  try {
    let { data } = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });

    let token = data["access_token"];
    //console.log("token " + token);
    return token;
  } catch (err) {
    // return res.send({
    //   success: false,
    //   message: err["response"]["Success"], }  );
    console.error(err.message);
    return err.message;
  }
};
//Token
app.post("/getToken", async (req, res) => {
  try {
    let tokenx = await getOAuthToken();
    console.log("tokenx " + tokenx);
    res.json(tokenx);
  } catch (err) {
    console.error(err.message);
  }
});
//Send LipaNaMpesaRequest
app.post("/lipanampesa", async (req, res) => {
  let token = await getOAuthToken();
  console.log("token inside LNM  " + token);
  console.log(req.body.phonenumberx);
  let auth = `Bearer ${token}`;

  //getting the timestamp
  let timestamp = "20220219000016";
  console.log("timestamp " + timestamp);

  // let url = process.env.lipa_na_mpesa_url;
  // let bs_short_code = process.env.lipa_na_mpesa_shortcode;
  // let passkey = process.env.lipa_na_mpesa_passkey;
  let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let bs_short_code = 174379;
  let passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

  let password = new Buffer.from(
    `${bs_short_code}${passkey}${timestamp}`
  ).toString("base64");
  let transcation_type = "CustomerPayBillOnline";
  let amount = req.body.price; //you can enter any amount
  let partyA = req.body.phonenumberx; //should follow the format:2547xxxxxxxx
  let partyB = bs_short_code;
  let phoneNumber = req.body.phonenumberx; //should follow the format:2547xxxxxxxx
  let callBackUrl = "https://54.69.38.253:9000/lipa-na-mpesa-callback";
  let accountReference = "DNB Testing";
  let transaction_desc = "Testing lipa na mpesa functionality";

  try {
    let { data } = await axios.post(
      url,
      {
        BusinessShortCode: bs_short_code,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transcation_type,
        Amount: amount,
        PartyA: partyA,
        PartyB: partyB,
        PhoneNumber: phoneNumber,
        CallBackURL: callBackUrl,
        AccountReference: accountReference,
        TransactionDesc: transaction_desc,
      },
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    // .catch(console.log);

    return res.send({
      success: true,
      message: data,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err["response"]["statusText"],
    });
  }
});

//Process callback

app.listen(9000, () => {
  console.log("Server has started on port 9000");
});
