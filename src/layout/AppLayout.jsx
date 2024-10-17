import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "@/components/Header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"> </div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 m-0 text-center bg--black  ">
        Made with 💟 by Madhur Pathak.{" "}
      </div>
    </div>
  );
};

export default AppLayout;
