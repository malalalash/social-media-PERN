import { useUserStore } from "../store/userStore";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import registerUser from "../api/user/registerUser";

const Register = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (username.length > 30) {
      setMessage("Username should be less than 30 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const data = await registerUser(username, email, password);

      if (data.status === 400 || data.status === 500 || !data.user) {
        setMessage(data.message);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <div className="hero min-h-screen">
      <div className="flex gap-20 justify-between items-center max-w-4xl w-full flex-col lg:flex-row">
        <div className="text-center lg:text-left flex flex-col-reverse">
          <h1 className="sm:text-8xl text-7xl  font-bold">GetInHere</h1>
          <h2 className="font-semibold italic text-gray-500">Everyone...</h2>
        </div>
        <div className="card relative flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body pb-5">
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <input
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                type="username"
                placeholder="username"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">Confirm password</span>
              </label>
              <input
                required
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
              />
            </div>
            <div className="flex">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
            <button className="btn btn-neutral mt-1">Register</button>
          </form>
          {message && (
            <span className="text-red-600 mx-5 pb-5 max-w-sm text-center">
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
