import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faqs.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Briefcase,
  DoorOpen,
  MapPin,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";
import { SignedOut } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const currentTime = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(currentTime);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Hero section with integrated clock */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Live Clock Integration */}
            <div className="flex items-center justify-center mb-4 bg-gray-50 rounded-lg px-4 py-2 border">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <div className="text-sm font-medium text-gray-700">
                <span className="font-mono text-blue-600 mr-2">
                  {formatTime(time)}
                </span>
                <span className="text-gray-500">|</span>
                <span className="ml-2 text-gray-600">{formatDate(time)}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Elevate Your Career
              <span className="block text-blue-600">
                Find and Land Your Dream Job Now!
              </span>
            </h1>
            <p className="text-gray-500 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
              Navigate an array of job listings or identify the ideal candidate
              for your company.
            </p>

            <div className="flex gap-4 sm:gap-6 justify-center">
              <Link to="/jobs">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
              </Link>
              <Link to="/post-job">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm"
                >
                  <DoorOpen className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Companies carousel */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Trusted by Leading Companies
          </h2>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            opts={{
              align: "start",
            }}
            className="w-full py-4"
          >
            <CarouselContent className="flex gap-5 sm:gap-10 items-center">
              {companies.map(({ name, id, path }) => {
                return (
                  <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                    <img
                      src={path}
                      alt={name}
                      className="h-8 sm:h-12 object-contain mx-auto"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Hero image */}
        <div className="flex w-full justify-center items-center mb-8">
          <img
            src="/heroimg.png"
            className="max-w-full w-full h-80 object-cover rounded-lg shadow-sm"
            alt="People working together"
          />
        </div>

        {/* Features section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                For Job Seekers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>
                    Search and filter through thousands of job postings
                  </span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Apply with just a few clicks</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Track all your applications in one place</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                For Employers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Post jobs and reach qualified candidates</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Manage applications efficiently</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Use AI shortlisting to find the best matches</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Job categories */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Job Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Engineering",
              "Marketing",
              "Design",
              "Finance",
              "Sales",
              "Customer Service",
              "IT & Software",
              "Healthcare",
            ].map((category, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-700 text-sm font-medium">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border-b"
              >
                <AccordionTrigger className="text-gray-800 font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 rounded-lg shadow-sm mb-8 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Take the Next Step?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you are looking for your dream job or searching for the
            perfect candidate, we are here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <SignedOut>
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-sm"
                  size="lg"
                >
                  Sign Up Now
                </Button>
              </SignedOut>
            </Link>
            <Link to="/jobs">
              <Button
                variant="outline"
                className="border-blue-300 text-white hover:bg-white hover:text-black shadow-sm"
                size="lg"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
