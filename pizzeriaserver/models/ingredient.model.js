import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  tname: {
    type: String,
    required: true,
  },
  image: String,
});

const Ingredient = mongoose.model("ingredient", IngredientSchema);

export default Ingredient;
