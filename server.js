import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import cors from "cors";
import categoryRote from "./routes/categotyRoute.js";
import routerProduct from "./routes/ProdcutRoute.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/auth", router);
app.use("/api/v1/category", categoryRote);
app.use("/api/v1/product",routerProduct);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
