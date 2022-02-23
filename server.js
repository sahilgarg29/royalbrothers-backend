require("dotenv").config();

const app = require("./app");
const connect = require("./src/configs/db");

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await connect();
    console.log(`Server is Running on port - ${port}`);
  } catch (error) {
    console.log(error);
  }
});
