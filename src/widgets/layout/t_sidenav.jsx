import PropTypes from "prop-types";
import {useEffect} from "react";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function T_Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // useEffect (() => {
  //   const StudentPath = document.getElementById("Student");
  //   StudentPath.className = "hidden";
  // }, []);
  
  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div
        className={`relative`}
      >
        <Link to="/teacher/home" className="flex items-center py-3 px-1">
          <img
            src="https://img5.pic.in.th/file/secure-sv1/DALLE-2025-01-05-14.14.45---A-bright-and-futuristic-circular-logo-design-for-a-virtual-reality-VR-application-focused-on-circuit-building.-The-logo-features-a-sleek-VR-headset.png"
            alt="Logo Circuit simulator in VR"
            width={60}
          />
          <Typography
            variant="h5"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
            className="font-bold"
          >
            {brandName}
          </Typography>
        </Link>

        <IconButton
          variant="text"
          color="gray"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
        </IconButton>
      </div>


      <div className="m-4">
         { routes.map(({ layout, title, pages}, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

          { pages
            .filter(({ name }) => name !== "Student" && 
            name !== "Teacher Assistant" && 
            name !== "Practice Classroom" && 
            name !== "Practice Score")
            .map(({ icon, label, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                      }
                      id={name}
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

T_Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.jpg",
  brandName: "Circuit Simulator in VR",
};

T_Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

T_Sidenav.displayName = "/src/widgets/layout/t_sidenav.jsx";

export default T_Sidenav;
