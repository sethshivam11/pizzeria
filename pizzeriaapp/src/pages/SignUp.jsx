import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import toast from "react-hot-toast";

function SignUp() {
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, loading: userLoading, user } = useUser();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (creds.name < 3 || creds.email.length < 4 || creds.password.length < 6) {
      return;
    }
    setLoading(true);
    const data = await signUp(creds);
    setLoading(false);
    if (data.success) {
      toast.success(data.message);
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (user._id.length === 0) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="d-flex justify-content-center flex-column gap-3 border border-secondary-subtle p-4 rounded w-100"
        style={{ maxWidth: "30rem" }}
      >
        <h1 className="text-center h2" style={{ letterSpacing: "-0.025em" }}>
          SignUp to Pizzeria
        </h1>
        <div>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="name"
            value={creds.name}
            onChange={(e) =>
              setCreds((prev) => ({ ...prev, name: e.target.value }))
            }
            className="form-control"
            id="name"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            value={creds.email}
            onChange={(e) =>
              setCreds((prev) => ({ ...prev, email: e.target.value }))
            }
            className="form-control"
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">
            Phone <span className="text-muted small">(Optional)</span>
          </label>
          <input
            type="phone"
            value={creds.phone}
            onChange={(e) =>
              setCreds((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="form-control"
            id="phone"
            placeholder="Enter your phone"
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type={showPwd ? "text" : "password"}
            id="password"
            value={creds.password}
            onChange={(e) =>
              setCreds((prev) => ({ ...prev, password: e.target.value }))
            }
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            checked={showPwd}
            onChange={(e) => setShowPwd(e.target.checked)}
            id="show"
            className="form-check-input"
          />
          <label htmlFor="show" className="form-check-label">
            Show Password
          </label>
        </div>
        <button
          disabled={
            creds.name.length < 3 ||
            creds.email.length < 4 ||
            creds.password.length < 6 ||
            loading
          }
          className="btn btn-warning w-100"
          onClick={handleSignUp}
        >
          SignUp
        </button>
        <Link to="/login" className="text-center w-100">
          Already have an account?
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
