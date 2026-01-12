import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.route.js";
import pizzaRouter from "./routes/pizza.route.js";
import ingredientRouter from "./routes/ingredient.route.js";
import cartRouter from "./routes/cart.route.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/pizzas", pizzaRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/cart", cartRouter);

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`App is running on http://localhost:${port}`)
    )
  )
  .catch((err) => console.log("Something went wrong", err));
