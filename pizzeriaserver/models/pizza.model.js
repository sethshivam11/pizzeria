import mongoose from "mongoose";

const PizzaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["veg", "nonveg"],
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  description: String,
  ingredients: [String],
  topping: [String],
});

const Pizza = mongoose.model("pizza", PizzaSchema);

export default Pizza;
