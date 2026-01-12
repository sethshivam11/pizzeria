import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center flex-column z-3 position-fixed top-0 left-0 bg-white">
      <div>
        <h1
          className="text-danger"
          style={{ fontSize: "20vw", lineHeight: "15vw" }}
        >
          404
        </h1>
        <p className="text-center" style={{ fontSize: "3.5vw" }}>
          Looks like you&apos;re
          <span className="text-warning"> LOST</span>
        </p>
        <p className="text-center">
          <Link
            to="/"
            className="text-decoration-none link-underline-opacity-50-hover"
          >
            Go back Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
