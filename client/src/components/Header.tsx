import { NavLink, Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import logout from "../api/user/logoutUser";
import { useEffect, useRef, useState } from "react";
import { autocomplete } from "../api/user/autocomplete";
import { SearchUserType } from "../types";
import useDebounce from "../hooks/useDebounce";
const Header = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ users: [] });
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    if (debouncedValue) {
      autocomplete(debouncedValue)
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setResult({ users: [] });
          setLoading(false);
        });
    } else {
      setResult({ users: [] });
    }
  }, [debouncedValue]);
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim());
    if (!searchTerm) {
      setResult({ users: [] });
      setLoading(true);
    }
  };

  const handleFocus = () => {
    ref.current?.focus();
  };

  const handleBlur = () => {
    ref.current?.blur();
  };

  const handleClick = () => {
    setSearchTerm("");
    setResult({ users: [] });
  };

  return (
    <header className="min-w-full sticky z-50 top-0 mx-auto border-b shadow bg-gray-800 p-1">
      <nav className="navbar items-center w-full px-5 justify-between max-w-4xl mx-auto">
        <Link
          to="/"
          className="rounded-full text-white text-2xl sm:text-3xl font-extrabold"
        >
          GetInHere
        </Link>
        <label htmlFor="search" className="sm:hidden flex-1">
          <button
            onClick={handleFocus}
            type="button"
            name="search"
            aria-label="Search for user"
            className="btn btn-ghost dark:text-white btn-circle sm:hidden text-base-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </label>
        <div className="w-0 overflow-hidden sm:w-auto">
          <input
            autoComplete="off"
            id="search"
            type="search"
            name="search"
            ref={ref}
            value={searchTerm}
            onChange={handleSearch}
            onBlur={handleBlur}
            placeholder="Search for user..."
            className="input opacity-0 sm:opacity-100 sm:block transition-all transform duration-300 ease-in-out input-md max-h-10 sm:text-base rounded-full input-bordered w-auto dark:text-white"
          />
        </div>

        {result.users.length > 0 && (
          <div className="absolute top-0 left-0 mt-16 w-full mx-auto sm:pl-[120px]">
            <ul className="bg-white sm:max-w-max min-w-[300px] w-full mx-auto shadow-lg">
              {result.users.map((profile: SearchUserType) => (
                <li
                  className="p-1 pl-3 bg-white dark:bg-gray-800 dark:border dark:border-base-100 transform duration-200 hover:bg-base-200 border-x border-x-base-300 border-b border-b-base-300 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  key={profile.id}
                >
                  <Link
                    onClick={handleClick}
                    className="flex items-center gap-3 w-full"
                    to={`/user/${profile.id}`}
                  >
                    <img
                      src={profile.avatar}
                      className="w-8 h-8 rounded-full"
                    />
                    {profile.username}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.users.length === 0 && searchTerm !== "" ? (
          <div className="absolute top-0 left-0 mt-16 w-full mx-auto sm:pl-[120px]">
            <div className="bg-white sm:max-w-max min-w-[300px] w-full mx-auto border  shadow-lg dark:bg-base-100 dark:border-gray-950">
              <p className="p-1 pl-3 text-center border-x-base-300 sm:text-lg">
                {loading ? "Loading... 🤔" : "Could not find any users... 😖"}
              </p>
            </div>
          </div>
        ) : null}
        <div className="dropdown dropdown-end">
          <div className="flex items-center justify-center gap-3">
            <label
              tabIndex={0}
              className="btn focus:outline-white btn-ghost btn-circle avatar"
            >
              <div className="w-10 sm:w-12 rounded-full border border-base-100">
                <img
                  className="w-full h-full object-cover"
                  src={user?.avatar}
                  alt={`${user?.username} profile image`}
                />
              </div>
            </label>
          </div>
          <ul
            tabIndex={0}
            className="mt-5 z-[1] gap-1 p-2 shadow menu menu-sm dropdown-content bg-white rounded-box min-w-max w-52 dark:bg-base-100 dark:border"
          >
            <li className="border-b pointer-events-none">
              <p className="font-semibold text-base sm:text-lg">
                {user?.username}
              </p>
            </li>
            <li>
              <NavLink to="/profile" className="justify-between">
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
