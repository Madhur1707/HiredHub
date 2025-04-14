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

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-3xl font-semibold sm:text-6xl lg:text-7xl tracking-tighter py-4">
          Elevate Your Career
          <span className="flex items-center gap-3 sm:g-6">
            {" "}
            Find and Land Your Dream Job Now!
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Navigate an Array of Job Listings or Identify the Ideal Candidate!
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        <Link to="/jobs">
          <Button variant="yellow" size="xl" className="shadow-xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="destructive" size="xl" className="shadow-xl">
            Post a Job
          </Button>
        </Link>
      </div>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        opts={{
          align: "start",
        }}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="flex w-full justify-center items-center">
        <img
          src="/heroimg.png"
          className="max-w-[700px] w-full h-auto object-cover"
          alt="Hero"
        />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 content-center justify-center items-center m-5">
        <Card className=" bg-yellow-500 text-black hover:bg-yellow-600 shadow-xl">
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search and apply for jobs, track application and more.</p>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post Jobs, manage applications, and find the best candidates</p>
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 m-5">
        <h1 className="col-span-1 md:col-span-2 text-3xl font-bold mb-4 text-center">
          Frequently Asked Questions!
        </h1>
        <Accordion
          type="single"
          collapsible
          className="col-span-1 md:col-span-2 font-medium text-lg"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
