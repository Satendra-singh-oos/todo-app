import dotenv from "dotenv";
import connectDb from "./db/index";
import { app } from "./app";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 7680, () => {
      console.log(
        `Server is up and running at port : ${process.env.PORT || 8000}`
      );
    });

    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDb Faild To Connectoin", err);
  });
