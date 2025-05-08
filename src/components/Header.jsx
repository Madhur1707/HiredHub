import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  BriefcaseBusiness,
  Heart,
  PenBox,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-14 w-48 object-cover sm:h-14 sm:w-56"
              />
            </Link>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Find Jobs
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Companies
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Resources
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className="text-gray-500 hover:text-blue-600 p-1">
                <Search className="w-5 h-5" />
              </button>

              {/* Signed Out State */}
              <SignedOut>
                <div className="hidden sm:block">
                  <Button
                    variant="outline"
                    onClick={() => setShowSignIn(true)}
                    className="border-blue-200 text-white hover:bg-blue-50 hover:text-blue-600 mr-2"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setShowSignIn(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
                <div className="sm:hidden">
                  <Button
                    onClick={() => setShowSignIn(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign In
                  </Button>
                </div>
              </SignedOut>

              {/* Signed In State */}
              <SignedIn>
                {user?.unsafeMetadata?.role === "recruiter" && (
                  <Link to="/post-job" className="hidden sm:block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PenBox size={16} className="mr-2" />
                      Post a Job
                    </Button>
                  </Link>
                )}
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
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

              {/* Mobile menu button */}
              <button
                className="md:hidden p-1 text-gray-500 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-3 py-2">
                <Link
                  to="/jobs"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/companies"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Companies
                </Link>
                <Link
                  to="/resources"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <SignedIn>
                  {user?.unsafeMetadata?.role === "recruiter" && (
                    <Link
                      to="/post-job"
                      className="px-3 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PenBox size={16} className="inline mr-2" />
                      Post a Job
                    </Link>
                  )}
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
