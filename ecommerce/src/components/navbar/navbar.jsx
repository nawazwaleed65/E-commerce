import { Fragment, useContext, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillCloudSunFill } from "react-icons/bs";
import { FiSun } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import myContext from "../../Context/context";

function Navbar() {
  const context = useContext(myContext);
  const { mode, toggleMode } = context;

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart);

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* ====== MOBILE MENU ====== */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl"
                style={{
                  backgroundColor: mode === "dark" ? "#282c34" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className="flex px-4 pb-2 pt-28">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  >
                    <RxCross2 />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {/* Common link */}
                  <Link
                    to="/allProducts"
                    className="text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    All Products
                  </Link>

                  {/* Logged in users */}
                  {user ? (
                    <>
                      {/* 🧍 Buyer view */}
                      {!isAdmin && (
                        <>
                          <Link
                            to="/order"
                            className="block text-sm font-medium"
                            onClick={() => setOpen(false)}
                          >
                            Orders
                          </Link>
                          <Link
                            to="/cart"
                            className="block text-sm font-medium"
                            onClick={() => setOpen(false)}
                          >
                            Cart ({cartItems.length})
                          </Link>
                        </>
                      )}

                      {/* 🧑‍💼 Admin view */}
                      {isAdmin && (
                        <>
                          <Link
                            to="/dashboard"
                            className="block text-sm font-medium"
                            onClick={() => setOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/dashboard"
                            className="block text-sm font-medium"
                            onClick={() => setOpen(false)}
                          >
                            View Orders
                          </Link>
                          <Link
                            to="/addProduct"
                            className="block text-sm font-medium"
                            onClick={() => setOpen(false)}
                          >
                            Add Product
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="block text-sm font-medium cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    // 🚪 Not logged in
                    <Link
                      to="/login"
                      className="block text-sm font-medium cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* ====== DESKTOP NAVBAR ====== */}
      <header className="relative bg-white">
        <p
          className="flex h-10 items-center justify-center bg-pink-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{
            backgroundColor: mode === "dark" ? "#3e4042" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          Get free delivery on orders over $300
        </p>

        <nav
          aria-label="Top"
          className="bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-md"
          style={{
            backgroundColor: mode === "dark" ? "#282c34" : "",
            color: mode === "dark" ? "white" : "",
          }}
        >
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              E-Bharat
            </Link>

            <div className="hidden lg:flex lg:space-x-6">
              {!user && (
                <>
                  <Link to="/allProducts">All Products</Link>
                  <Link to="/login">Login</Link>
                </>
              )}

              {user && !isAdmin && (
                <>
                  <Link to="/allProducts">All Products</Link>
                  <Link to="/order">Orders</Link>
                  <Link to="/cart">Cart ({cartItems.length})</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/dashboard">Admin Dashboard</Link>
                  <Link to="/ProductDetail">Product Detail</Link>
                  <Link to="/viewOrder">View Orders</Link>
                  <Link to="/addProduct">Add Product</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleMode}>
                {mode === "light" ? (
                  <FiSun size={25} />
                ) : (
                  <BsFillCloudSunFill size={25} />
                )}
              </button>

              {/* Cart Icon (Buyers only) */}
              {user && !isAdmin && (
                <Link to="/cart" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  <span>{cartItems.length}</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
