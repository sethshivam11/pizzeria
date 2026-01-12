import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      unique: true,
    },
    pizzas: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pizza",
        },
        quantity: {
          type: Number,
          min: 0,
          default: 1,
        },
      },
    ],
    ingredients: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ingredient",
        },
        quantity: {
          type: Number,
          min: 0,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", CartSchema);

export default Cart;
