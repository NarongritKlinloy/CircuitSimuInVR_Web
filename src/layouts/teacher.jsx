import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  T_Sidenav,
  T_DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/t_routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Teacher() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">

      <T_Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      <div className="p-4 xl:ml-80">
        <T_DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "teacher" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Teacher.displayName = "/src/layout/Teacher.jsx";

export default Teacher;
