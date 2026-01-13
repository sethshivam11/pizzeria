import { useMemo, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartProvider";
import { useUser } from "../context/UserProvider";
import toast from "react-hot-toast";
import NotFound from "./NotFound";
import api from "../lib/axios";

const PizzaItem = ({ pizza }) => {
  return (
    <div className="border p-4 d-flex align-items-center justify-content-around gap-4 position-relative">
      {pizza?.customized && (
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
    </div>
  );
};

function Build() {
  const navigate = useNavigate();
  const { pizzaId } = useParams();
  const [searchParams] = useSearchParams();

  const { addIngredients, cart, loading: cartLoading } = useCart();
  const { user } = useUser();

  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price, 0);
  }, [items]);

  const pizza = useMemo(() => {
    const customized = searchParams.get("customized") === "true";

    const item = cart?.items?.find(
      (i) => i.pizza._id === pizzaId && i?.customized === customized
    );
    if (!item?.pizza) return null;
    if (item?.ingredients) setItems(item.ingredients);
    return { ...item.pizza, customized: item?.customized };
  }, [pizzaId, cart]);

  const getIngredients = async () => {
    try {
      const { data } = await api.get("/ingredients");
      if (data?.success) {
        setIngredients(data.data);
      }
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else {
        console.log(error);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomize = async () => {
    if (user._id?.length === 0) {
      toast("Please login to continue");
      navigate("/login");
      return;
    }
    if (!user?._id) return;

    const ingredients = items.map((item) => item?._id);
    const data = await addIngredients(pizzaId, ingredients);

    if (data.success) {
      navigate("/cart");
    } else toast.error(data.message);
  };

  useEffect(() => {
    getIngredients();
  }, []);

  if (!pizza && cart?.user && !cartLoading && user._id) {
    return <NotFound />;
  }

  return (
    <div className="container">
      <h3 className="h3 text-center mt-4" style={{ letterSpacing: "-0.05em" }}>
        Customize Your Pizza
      </h3>
      <p className="text-secondary text-center">
        Pizzeria now gives you options to customize your own pizza. Customize
        your pizza by choosing ingredients from the list given below
      </p>
      {pizza && <PizzaItem pizza={pizza} />}
      <div className="min-vh-100">
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ height: "85vh" }}
          >
            <div className="text-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="h6 fw-light mt-2">Fetching Ingredients</p>
            </div>
          </div>
        ) : (
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td className="d-flex align-items-center gap-2">
                    <img
                      src={ingredient?.image}
                      alt=""
                      width="50"
                      height="50"
                    />
                    {ingredient?.tname}
                  </td>
                  <td className="align-middle">
                    {Number(ingredient?.price)?.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex align-items-center justify-content- gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={items.some(
                          (item) => item._id === ingredient._id
                        )}
                        onChange={(e) => {
                          console.log(ingredient);
                          if (e.target.checked) {
                            setItems((prev) => [...prev, ingredient]);
                          } else {
                            setItems((prev) =>
                              prev.filter(
                                (item) => item?._id !== ingredient?._id
                              )
                            );
                          }
                        }}
                        id={`add-${index}`}
                      />
                      <label
                        className="form-check-label text-warning"
                        htmlFor={`add-${index}`}
                      >
                        Add
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <h3 className="display-5 fw-semibold">
                    Total:{" "}
                    {Number(itemsValue).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </h3>
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      className="btn btn-dark text-warning"
                      disabled={itemsValue === 0}
                      onClick={handleCustomize}
                    >
                      Build Ur Pizza
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default Build;
