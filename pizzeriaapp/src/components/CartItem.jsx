import { useMemo } from "react";
import { useCart } from "../context/CartProvider";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const CartItem = ({ item }) => {
  const { updateCount, removeFromCart } = useCart();

  const price = useMemo(() => {
    const ingredientsPrice =
      item?.ingredients?.reduce((acc, item) => acc + item?.price, 0) ?? 0;
    return item?.pizza?.price + ingredientsPrice;
  }, [item]);

  const updateQuantity = async (itemId, quantity) => {
    const data = await updateCount(itemId, quantity);
    if (!data.success) {
      toast.error(data.message);
    }
  };

  const removeItem = async (itemId) => {
    const data = await removeFromCart(itemId);
    if (!data.success) {
      toast.error(data.message);
    }
  };

  return (
    <div className="row border rounded position-relative">
      {item?.customized && (
        <div className="position-absolute top-0 end-0 p-2 w-auto">
          <div className="rounded-pill bg-dark text-light px-2 badge">
            Custom
          </div>
        </div>
      )}
      <div className="col-4 d-flex justify-content-center align-items-center">
        <img src={item.pizza.image} className="w-75" />
      </div>
      <div className="col-8 p-4 d-flex justify-content-between flex-column">
        <div>
          <h5 className="h5">{item.pizza.name}</h5>
          <p>{item.pizza.description}</p>
          {item?.ingredients?.length > 0 && (
            <p>
              <strong>Added: </strong>
              {item?.ingredients?.map((item) => item?.tname).join(", ")}
            </p>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <h2 className="h2 text-success" style={{ letterSpacing: "-0.005em" }}>
            {Number(price).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </h2>
          <div
            className={`border ${
              item?.pizza?.type === "veg" ? "border-success" : "border-danger"
            } p-1 d-flex align-items-center justify-content-center`}
          >
            <span
              className={`rounded-circle ${
                item?.pizza?.type === "veg" ? "bg-success" : "bg-danger"
              }`}
              style={{ width: 20, height: 20 }}
            />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <Link
            to={`/customize/${item?._id}`}
          >
            Customize
          </Link>
          <div className="d-flex align-items-center justify-content-end gap-2">
            {item?.quantity === 1 ? (
              <button
                className="btn btn-sm btn-dark rounded-pill"
                onClick={() => removeItem(item._id)}
                disabled={item?.quantity > 1}
              >
                <Trash2 />
              </button>
            ) : (
              <button
                className="btn btn-sm btn-dark rounded-pill"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity === 1}
              >
                <Minus />
              </button>
            )}
            <p className="h2">{item.quantity}</p>
            <button
              className="btn btn-sm btn-warning rounded-pill"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity > 10}
            >
              <Plus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
