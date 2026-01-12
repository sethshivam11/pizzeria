import { useMemo, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartProvider";
import { useUser } from "../context/UserProvider";
import toast from "react-hot-toast";

function Customize() {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user } = useUser();

  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price, 0);
  }, [items]);

  const getIngredients = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/ingredients");
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

  const handleAdd = async () => {
    if (user._id?.length === 0) {
      toast("Please login to continue");
      navigate("/login");
      return;
    }
    if (!user?._id) return;
    const body = items.map((item) => item?._id);
    const data = await addToCart(body, "ingredient");
    if (data.success) {
      navigate("/cart");
      setItems([]);
    } else toast.error(data.message);
  };

  useEffect(() => {
    getIngredients();
  }, []);

  return (
    <div className="container">
      <h3 className="h3 text-center mt-4" style={{ letterSpacing: "-0.05em" }}>
        Customize Your Pizza
      </h3>
      <p className="text-secondary text-center">
        Pizzeria now gives you options to customize your own pizza. Customize
        your pizza by choosing ingredients from the list given below
      </p>
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
                        checked={items.includes(ingredient)}
                        onChange={(e) => {
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
                      onClick={handleAdd}
                    >
                      Customize Ur Pizza
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

export default Customize;
