import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.route.js";
import pizzaRouter from "./routes/pizza.route.js";
import ingredientRouter from "./routes/ingredient.route.js";
import cartRouter from "./routes/cart.route.js";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/pizzas", pizzaRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/cart", cartRouter);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "pizzeriaapp", "dist")));
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname1, "pizzeriaapp", "dist", "index.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.send("App is under development!");
  });
}

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`App is running on http://localhost:${port}`)
    )
  )
  .catch((err) => console.log("Something went wrong", err));
