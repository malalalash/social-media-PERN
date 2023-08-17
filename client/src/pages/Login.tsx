import { useUserStore } from "../store/userStore";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import loginUser from "../api/user/loginUser";

const Login = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);

      if (data.message !== "Invalid email or password") {
        setUser(data);
      } else {
        setMessage(data.message);
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
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit} className="card-body pb-5">
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
              <div className="flex">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link
                    to={"/register"}
                    className="text-sm text-blue-700 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
              <button className="btn btn-neutral mt-1">Login</button>
            </form>
            {message && (
              <span className="text-red-600 mx-5 pb-5 max-w-sm text-center">
                {message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
