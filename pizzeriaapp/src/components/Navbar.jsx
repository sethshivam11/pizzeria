import logo from "/logo.png";
import { Link } from "react-router-dom";
import CartButton from "./CartButton";

function Navbar() {
  return (
    <div
      className="px-4 py-2 d-flex justify-content-between align-items-center gap-2 w-full"
      style={{ backgroundColor: "#070707" }}
    >
      <Link
        to="/"
        className="d-flex justify-content-center align-items-center gap-2 text-decoration-none"
      >
        <img
          src={logo}
          alt=""
          width="50"
          height="50"
          className="object-fit-contain"
        />
        <h1
          className="h2 text-light d-sm-block d-none"
          style={{ letterSpacing: "-0.025em" }}
        >
          Pizzeria
        </h1>
      </Link>
      <div className="list-unstyled d-flex justify-content-between align-items-center gap-4">
        <Link to="/menu" className="p-2 text-decoration-none text-light">
          Menu
        </Link>
        <Link to="/customize" className="p-2 text-decoration-none text-light">
          Customize Pizza
        </Link>
      </div>
      <CartButton />
    </div>
  );
}

export default Navbar;
