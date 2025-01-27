const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.error(`An error occurred: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
