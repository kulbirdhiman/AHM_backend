import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb";
import UserRouter from "./routes/User.routes";
import categoryRoutes from "./routes/product/Categorey.route";
import ProductRoutes from "./routes/product/product.route";
import Uploadroute from "./routes/product/upload.route"
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://89.116.134.75:3000",
      "https://cravebuy.com",
      "https://mailer.kayhanaudio.com.au",
      "https://ahmsmarthomes.com.au"
    ],
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express!");
});

app.use("/api/user", UserRouter);
app.use("/api/category", categoryRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/upload", Uploadroute);

connectDb();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
