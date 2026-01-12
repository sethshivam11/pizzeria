import { useCart } from "../context/CartProvider";
import { useUser } from "../context/UserProvider";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useMemo } from "react";

function MenuItem({ pizza, className = "" }) {
  const navigate = useNavigate();

  const { addToCart, cart, updateCount, removeFromCart } = useCart();
  const { user } = useUser();

  const inCart = useMemo(() => {
    return cart.pizzas?.some((p) => p?.item?._id === pizza?._id);
  }, [cart]);

  const quantity = useMemo(() => {
    return cart.pizzas?.find((p) => p?.item?._id === pizza?._id)?.quantity;
  }, [cart]);

  const handleAdd = async () => {
    if (user._id?.length === 0) {
      toast("Please login to continue");
      navigate("/login");
      return;
    }
    if (!pizza?._id) return;
    const data = await addToCart([pizza._id], "pizza");
    console.log(data);
    if (!data.success) toast.error(data.message);
  };

  const updateQuantity = async (quantity) => {
    const data = await updateCount(pizza._id, "pizza", quantity);
    if (!data.success) {
      toast.error(data.message);
    }
  };

  const removeItem = async () => {
    const data = await removeFromCart(pizza._id);
    if (!data.success) {
      toast.error(data.message);
    }
  };

  return (
    <div className={`col-lg-6 ${className}`}>
      <div className="border shadow-sm d-flex flex-column gap-2 p-4 pr-0 rounded">
        <div className="d-flex gap-2">
          <div>
            <h4 className="h4 fw-bold" style={{ letterSpacing: "-0.025em" }}>
              {pizza?.name}
            </h4>
            <p>{pizza?.description}</p>
            <p>
              <strong>Ingredients: </strong>
              {pizza?.ingredients?.join(", ")}
            </p>
            <p>
              <strong>Toppings: </strong>
              {pizza?.topping?.join(", ")}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <h3
                className="display-5 fw-semibold text-success"
                style={{ letterSpacing: "-0.025em" }}
              >
                {Number(pizza?.price)?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </h3>
              <div
                className={`border ${
                  pizza?.type === "veg" ? "border-success" : "border-danger"
                } p-1 d-flex align-items-center justify-content-center`}
              >
                <span
                  className={`rounded-circle ${
                    pizza?.type === "veg" ? "bg-success" : "bg-danger"
                  }`}
                  style={{ width: 20, height: 20 }}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center flex-column">
            <img
              src={pizza?.image}
              alt=""
              className="w-100 object-fit-contain"
            />
          </div>
        </div>
        {inCart ? (
          <div className="d-flex justify-content-between align-items-center">
            <Link to={`/customize`}>Customize</Link>
            <div className="d-flex align-items-center gap-2">
              {quantity === 1 ? (
                <button
                  className="btn btn-sm btn-dark rounded-pill"
                  onClick={removeItem}
                  disabled={quantity > 1}
                >
                  <Trash2 />
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-dark rounded-pill"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity === 1}
                >
                  <Minus />
                </button>
              )}
              <p className="h2">{quantity}</p>
              <button
                className="btn btn-sm btn-warning rounded-pill"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity > 10}
              >
                <Plus />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              className="btn text-nowrap mt-2 float-end"
              style={{ backgroundColor: "gold" }}
              onClick={handleAdd}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
