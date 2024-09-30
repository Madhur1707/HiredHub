import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-2 flex justify-between items-center ">
        <Link to="/">
          <img src="/logo2.png" alt="Logo" className="h-20 " />
        </Link>
        <div className="flex gap-8">
          <SignedOut>
            <Button
              variant="secondary"
              onClick={() => setShowSignIn(true)}
              className="rounded-md shadow-xl w-20"
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </SignedIn>
        </div>
      </nav>
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
