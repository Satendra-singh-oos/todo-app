import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import { Link } from "react-router-dom";
const Header = () => {
  const authStatus = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];
  return (
    <div>
      <header className="py-3 shadow bg-gray-500">
        <div>
          <nav className="flex">
            <div className="mr-4">
              <Link to="/">
                <p>Logo</p>
              </Link>
            </div>
            <ul className="flex ml-auto">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="inline-block px-6 duration-200 hover:bg-blue-100 rounded-full"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}

              {authStatus && (
                <li>
                  <LogoutBtn />
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;