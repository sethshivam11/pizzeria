import { useCart } from "../context/CartProvider";
import { ShoppingCart, UserRound } from "lucide-react";
import { useUser } from "../context/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CartButton() {
  const { count } = useCart();
  const { user, logOut } = useUser();

  const navigate = useNavigate();

  const handleCartClick = () => {
    toast("Please login to view cart");
    navigate("/login");
  };

  const handleLogOut = async () => {
    const data = await logOut();
    if (data.success) {
      toast.success(data.message);
      localStorage.removeItem("token");
    } else {
      toast.error(data.message);
    }
  };

  if (user._id?.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center gap-1">
        <div className="dropdown">
          <button
            className="px-2 py-1 rounded border-0 position-relative bg-secondary-subtle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <UserRound />
          </button>
          <ul className="dropdown-menu">
            <Link to="/login" className="text-decoration-none text-dark">
              <li className="dropdown-item">Login</li>
            </Link>
            <Link to="/signup" className="text-decoration-none text-dark">
              <li className="dropdown-item">Sign Up</li>
            </Link>
          </ul>
        </div>
        <button
          onClick={handleCartClick}
          className="rounded px-2 py-1 border-0 position-relative bg-warning"
        >
          <ShoppingCart />
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center gap-1">
      <div className="dropdown">
        <button
          className="px-2 py-1 rounded border-0 position-relative bg-secondary-subtle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <UserRound />
        </button>
        <ul className="dropdown-menu">
          <li>
            <span className="dropdown-item-text">
              {user.name}
              <br />
              {user.email}
            </span>
          </li>
          <li className="dropdown-item">
            <button
              className="w-100 border-0"
              onClick={handleLogOut}
              style={{ backgroundColor: "transparent" }}
            >
              LogOut
            </button>
          </li>
        </ul>
      </div>
      <Link
        className="rounded px-2 py-1 bg-warning position-relative text-dark text-decoration-none"
        to="/cart"
      >
        {count > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-light">
            {count}
            <span className="visually-hidden">Cart count</span>
          </span>
        )}
        <ShoppingCart />
      </Link>
    </div>
  );
}

export default CartButton;
