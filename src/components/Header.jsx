import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <nav className="py-2 flex justify-between items-center m-5">
      <Link to="/">
        <img src="/logo2.png" alt="Logo" className="h-20 " />
      </Link>

      <SignedOut>
        <SignInButton>
          <Button variant="secondary">Login</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center">
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
};

export default Header;
