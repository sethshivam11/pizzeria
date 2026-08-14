import { History } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useUser } from "../context/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartProvider";
import CartItem from "../components/CartItem";

function Cart() {
  const { user, loading: userLoading } = useUser();
  const { cart, loading, count, checkout } = useCart();

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

  const handleCheckout = async () => {
    await checkout();
    navigate("/");
    toast.success("Cart checkout successful");
  };

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
              {cart.items?.map((item) => (
                <CartItem item={item} key={item._id} />
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
              onClick={handleCheckout}
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
