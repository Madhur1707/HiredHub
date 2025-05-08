import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-20 w-20 object-cover sm:h-10 sm:w-36 mb-4 "
              />
            </Link>
            <p className="text-gray-500 text-sm mb-4">
              Connecting top talent with world-class companies. Find your dream
              job or the perfect candidate.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/post-job"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/post-job"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Recruiting Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  AI Shortlisting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                <span className="text-gray-500 text-sm">
                  729/3 Civil Lines Lalitpur Uttar Pradesh
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">+91 8960629039</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">
                  madhurpathak000@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              HiredHub © {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grid-background"></div>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
