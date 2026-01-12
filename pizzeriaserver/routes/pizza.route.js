import { Router } from "express";
import Pizza from "../models/pizza.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();

    return res.status(200).json({
      success: true,
      data: pizzas,
      message: "Pizzas found successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export default router;
