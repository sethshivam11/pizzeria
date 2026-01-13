import { Link } from "react-router-dom";
import { useCart } from "../context/CartProvider";
import { History } from "lucide-react";

const PizzaItem = ({ pizza, customized }) => {
  return (
    <div className="col-lg-6 col-12">
      <Link
        to={`/customize/${pizza._id}${customized ? "?customized=true" : ""}`}
        className="border p-4 d-flex align-items-center justify-content-around gap-4 rounded text-dark text-decoration-none position-relative"
      >
        {customized && (
          <div className="position-absolute top-0 end-0 p-2 w-auto">
            <div className="rounded-pill bg-dark text-light px-2 badge">
              Custom
            </div>
          </div>
        )}
        <img
          src={pizza?.image}
          alt=""
          className="object-fit-contain"
          style={{ width: 200 }}
        />
        <div>
          <h4 className="h4 fw-bold" style={{ letterSpacing: "-0.025em" }}>
            {pizza?.name}
          </h4>
          <p>{pizza?.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <h3
              className="display-6 fw-semibold text-success"
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
      </Link>
    </div>
  );
};

function Customize() {
  const { cart, loading } = useCart();

  return (
    <div className="container">
      <h3
        className="h3 fw-semibold mt-4 text-center"
        style={{ letterSpacing: "-0.05em" }}
      >
        Select Pizza to Customize
      </h3>
      <p className="text-secondary text-center">
        Customize your pizza by adding extra ingredients to it. Select
        ingredients on the next step.
      </p>
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
        <div className="row py-3 g-3" style={{ minHeight: "80vh" }}>
          {cart.items.length === 0 && (
            <div className="d-flex align-items-center justify-content-center flex-column gap-2">
              <History size="40" />
              <div>
                <h3
                  className="text-center"
                  style={{ fontSize: 30, letterSpacing: "-0.05em" }}
                >
                  Cart is Empty
                </h3>
                <p className="text-secondary text-center">
                  Add Items in Cart to customize
                </p>
              </div>
            </div>
          )}
          {cart.items?.map((item, index) => (
            <PizzaItem
              pizza={item.pizza}
              customized={item?.customized}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Customize;
