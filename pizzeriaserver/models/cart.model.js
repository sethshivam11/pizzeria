import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      unique: true,
    },
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pizza",
        },
        ingredients: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ingredient",
          },
        ],
        customized: {
          type: Boolean,
          default: false,
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
