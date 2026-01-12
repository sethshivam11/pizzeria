import { Router } from "express";
import Cart from "../models/cart.model.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;

    const cart = await Cart.findOne({ user: _id }).populate([
      "pizzas.item",
      "ingredients.item",
    ]);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Cart found successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { items, type } = req.body;

    if (!items || !type) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    if (type !== "pizza" && type !== "ingredient") {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const cart = await Cart.findOne({ user: _id });

    if (cart) {
      let exists = false;
      if (type === "pizza") {
        cart.pizzas = cart.pizzas.map((pizza) => {
          if (items.some((p) => p === pizza.item.toString())) {
            exists = true;
            return { ...pizza, quantity: pizza.quantity + 1 };
          } else {
            return pizza;
          }
        });
        if (!exists) {
          const pizzas = items.map((item) => ({ item, quantity: 1 }));
          cart.pizzas = [...cart.pizzas, ...pizzas];
        }
      } else if (type === "ingredient") {
        cart.ingredients = cart.ingredients.map((ingredient) => {
          if (items.some((i) => i === ingredient.item.toString())) {
            exists = true;
            return { ...ingredient, quantity: ingredient.quantity + 1 };
          } else {
            return ingredient;
          }
        });
        if (!exists) {
          const ingredients = items.map((item) => ({ item, quantity: 1 }));
          cart.ingredients = [...cart.ingredients, ...ingredients];
        }
      }

      await cart.save();
      await cart.populate(["pizzas.item", "ingredients.item"]);

      return res.status(200).json({
        success: true,
        data: cart,
        message: "Item added to cart",
      });
    }

    let pizzas = [];
    let ingredients = [];

    if (type === "pizza") {
      items.map((item) => {
        pizzas.push({ item, quantity: 1 });
      });
    } else if (type === "ingredient") {
      items.map((item) => {
        ingredients.push({ item, quantity: 1 });
      });
    }

    const newCart = await Cart.create({
      user: _id,
      pizzas,
      ingredients,
    });

    return res.status(200).json({
      success: true,
      data: newCart,
      message: "Item added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { item, count, type } = req.body;

    if (!item || !count || !type) {
      return res.status(400).json({
        success: false,
        message: "Item, Count & Type are required",
      });
    }

    const cart = await Cart.findOne({ user: _id }).populate([
      "pizzas.item",
      "ingredients.item",
    ]);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (type === "pizza") {
      cart.pizzas = cart.pizzas?.map((pizza) => {
        if (pizza.item._id?.toString() === item.toString()) {
          return { ...pizza, quantity: count };
        } else return pizza;
      });
    } else if (type === "ingredient") {
      cart.ingredients = cart.ingredients?.map((ingredient) => {
        if (ingredient.item._id?.toString() === item.toString()) {
          return { ...ingredient, quantity: count };
        } else return ingredient;
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Item quantity updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.delete("/:itemId", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item id is required",
      });
    }

    const cart = await Cart.findOne({ user: _id }).populate([
      "pizzas.item",
      "ingredients.item",
    ]);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.pizzas = cart.pizzas.filter(
      (p) => p.item._id.toString() !== itemId.toString()
    );
    cart.ingredients = cart.ingredients.filter(
      (i) => i.item._id.toString() !== itemId.toString()
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Item removed from cart",
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
