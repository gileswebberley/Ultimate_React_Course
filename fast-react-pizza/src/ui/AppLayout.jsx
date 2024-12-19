import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoaderScreen from "./LoaderScreen";
import BackToMenu from "./BackToMenu";

//See App for the Routes that are placed in the Outlet component
//This is the Parent Route, so each page will have the Header and Footer
function AppLayout() {
  //This gives access to the url path so we can add the BackToMenu if it's not the homepage or menu page. I have done this so that it does not affect the layout (width) of the Outlet content
  const urlLocation = useLocation();
  //to find out what loading state the whole site is in (not specific actions where we have previously implememented an isLoading)
  const navigation = useNavigation(); //not useNavigate!!
  const isLoading = navigation.state === "loading";
  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      {isLoading && <LoaderScreen />}
      <Header />
      <div className="no-scrollbar overflow-y-auto">
        {urlLocation.pathname != "/menu" && urlLocation.pathname != "/" && (
          <BackToMenu />
        )}
        <main className="mx-auto max-w-max">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
