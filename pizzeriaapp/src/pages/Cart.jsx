import { History, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useUser } from "../context/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartProvider";

const CartItem = ({ item }) => {
  const { updateCount, removeFromCart } = useCart();

  const price = useMemo(() => {
    const ingredientsPrice =
      item?.ingredients?.reduce((acc, item) => acc + item?.price, 0) ?? 0;
    return item?.pizza?.price + ingredientsPrice;
  }, [item]);

  const updateQuantity = async (itemId, quantity, customized) => {
    const data = await updateCount(itemId, quantity, customized);
    if (!data.success) {
      toast.error(data.message);
    }
  };

  const removeItem = async (itemId, customized) => {
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
            to={`/customize/${item?.pizza?._id}${
              item?.customized ? "?customized=true" : ""
            }`}
          >
            Customize
          </Link>
          <div className="d-flex align-items-center justify-content-end gap-2">
            {item?.quantity === 1 ? (
              <button
                className="btn btn-sm btn-dark rounded-pill"
                onClick={() => removeItem(item.pizza._id, item.customized)}
                disabled={item?.quantity > 1}
              >
                <Trash2 />
              </button>
            ) : (
              <button
                className="btn btn-sm btn-dark rounded-pill"
                onClick={() =>
                  updateQuantity(
                    item.pizza._id,
                    item.quantity - 1,
                    item?.customized
                  )
                }
                disabled={item.quantity === 1}
              >
                <Minus />
              </button>
            )}
            <p className="h2">{item.quantity}</p>
            <button
              className="btn btn-sm btn-warning rounded-pill"
              onClick={() =>
                updateQuantity(
                  item.pizza._id,
                  item.quantity + 1,
                  item?.customized
                )
              }
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

function Cart() {
  const { user, loading: userLoading } = useUser();
  const { cart, loading, count } = useCart();

  const navigate = useNavigate();

  const cartValue = useMemo(() => {
    const pizzas =
      cart.items?.reduce((prev, acc) => {
        if (acc.pizza?.ingredients?.length === 0) {
          return prev + acc.pizza.price;
        } else {
          const ingredientsPrice =
            acc?.ingredients?.reduce((acc, item) => acc + item?.price, 0) ?? 0;
          return prev + acc.pizza.price + ingredientsPrice;
        }
      }, 0) ?? 0;
    return pizzas;
  }, [cart]);

  useEffect(() => {
    if (userLoading) return;
    if (user._id.length === 0) {
      toast("Please login to continue");
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="container">
      <h3
        className="h3 fw-semibold mt-4 text-center"
        style={{ letterSpacing: "-0.05em" }}
      >
        Cart
      </h3>
      <div className="row">
        <div className="col-lg-8 col-12 p-4">
          {loading ? (
            <div
              className="d-flex align-items-center justify-content-center w-100"
              style={{ height: "85vh" }}
            >
              <div className="text-center">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="h6 fw-light mt-2">Fetching Cart</p>
              </div>
            </div>
          ) : (
            <div
              className="d-flex flex-column gap-2"
              style={{ minHeight: "80vh" }}
            >
              {cart?.items?.length === 0 && (
                <div
                  className="border d-flex align-items-center justify-content-center flex-column gap-1 p-4"
                  style={{ minHeight: "80vh" }}
                >
                  <History size="40" />
                  <h3 style={{ fontSize: 30, letterSpacing: "-0.05em" }}>
                    Cart is Empty
                  </h3>
                </div>
              )}
              {cart.items?.map((item, index) => (
                <CartItem item={item} key={index} />
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-4 col-12 p-4">
          <div
            className="border p-4 position-sticky rounded"
            style={{ top: 10 }}
          >
            <h4 className="h4">Cart Summary</h4>
            <hr />
            <div className="row">
              <h5 className="col-6 h5 fw-normal">Price ({count} items)</h5>
              <h5 className="col-6 h5 fw-normal text-end">
                {Number(cartValue).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </h5>
            </div>
            <div className="row mt-1">
              <h5 className="col-6 h5 fw-normal">Delivery Charges</h5>
              <h5 className="col-6 h5 fw-normal text-end text-success">Free</h5>
            </div>
            <hr />
            <div className="row">
              <h4 className="col-6 h4">Total</h4>
              <h4 className="col-6 h4 text-end">
                {Number(cartValue).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </h4>
            </div>
            <button
              className="btn btn-warning w-100 mt-2"
              disabled={cartValue === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
