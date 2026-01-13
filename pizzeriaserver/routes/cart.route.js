import { Router } from "express";
import Cart from "../models/cart.model.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;

    const cart = await Cart.findOne({ user: _id }).populate([
      "items.pizza",
      "items.ingredients",
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
    const { pizzaId } = req.body;

    if (!pizzaId) {
      return res.status(400).json({
        success: false,
        message: "Pizza id is required",
      });
    }

    const cart = await Cart.findOne({ user: _id });

    if (cart) {
      if (
        cart.items.some(
          (item) => item.pizza.toString() === pizzaId && !item.customized
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Pizza already in cart",
        });
      }

      cart.items.push({ pizza: pizzaId });
      await cart.save();
      await cart.populate(["items.pizza", "items.ingredients"]);

      return res.status(200).json({
        success: true,
        data: cart,
        message: "Pizza added to cart",
      });
    }

    const newCart = await Cart.create({
      user: _id,
      items: [{ pizza: pizzaId }],
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

router.put("/ingredients", verifyToken, async (req, res) => {
  try {
    const { pizzaId, ingredients } = req.body;
    if (!pizzaId || !ingredients || ingredients?.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Pizza id and ingredients is required",
      });
    }

    const { _id } = req.user;

    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let exists = false;
    cart.items = cart.items.map((item) => {
      if (item.pizza.toString() === pizzaId) {
        exists = true;
        return { ...item, ingredients, customized: true };
      } else {
        return item;
      }
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Pizza does not exist in cart",
      });
    }

    await cart.save();
    await cart.populate(["items.pizza", "items.ingredients"]);

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Ingredients added to pizza",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.put("/:pizzaId", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { pizzaId } = req.params;
    const { count } = req.body;

    if (!pizzaId || !count) {
      return res.status(400).json({
        success: false,
        message: "Item & Count are required",
      });
    }

    const cart = await Cart.findOne({ user: _id }).populate([
      "items.pizza",
      "items.ingredients",
    ]);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let exists = false;
    cart.items = cart.items?.map((item) => {
      if (item.pizza._id?.toString() === pizzaId && !item.customized) {
        exists = true;
        return { ...item, quantity: count };
      } else return item;
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Pizza does not exist in cart",
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Pizza quantity updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.delete("/:pizzaId", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { pizzaId } = req.params;
    const customized = req.query.customized === "true";

    if (!pizzaId) {
      return res.status(400).json({
        success: false,
        message: "Item id is required",
      });
    }

    const cart = await Cart.findOne({ user: _id }).populate([
      "items.pizza",
      "items.ingredients",
    ]);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const pizzaExists = cart.items.some(
      (item) =>
        item.pizza?._id.toString() === pizzaId && item.customized === customized
    );
    if (!pizzaExists) {
      return res.status(404).json({
        success: false,
        message: "Pizza already not in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.pizza?._id.toString() === pizzaId &&
          item.customized === customized
        )
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
