import { useState } from "react";
import MenuItem from "../components/MenuItem";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import api from "../lib/axios";

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPizzas = async () => {
    try {
      const { data } = await api.get("/pizzas");
      if (data?.success) {
        setPizzas(data.data);
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

  useEffect(() => {
    getPizzas();
  }, []);

  return (
    <div className="container">
      <h3
        className="h3 fw-semibold mt-4 text-center"
        style={{ letterSpacing: "-0.05em" }}
      >
        Menu
      </h3>
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center w-100"
          style={{ height: "85vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="h6 fw-light mt-2">Fetching Pizzas</p>
          </div>
        </div>
      ) : (
        <div className="row py-3 min-vh-100 g-3">
          {pizzas?.map((pizza, index) => (
            <MenuItem pizza={pizza} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;
