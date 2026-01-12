import { Router } from "express";
import Ingredient from "../models/ingredient.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();

    return res.status(200).json({
      success: true,
      data: ingredients,
      message: "Ingredients found successfully",
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
