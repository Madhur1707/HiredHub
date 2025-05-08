import { useState, useEffect } from "react";
import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Briefcase, MapPin, Building, Search, X } from "lucide-react";

const cities = ["Hyderabad", "Noida", "Gurgaon", "Bengaluru", "Pune"];

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, searchQuery, company_id });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(1); // Redirect to the first page if on the last page
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs?.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs?.length / jobsPerPage);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BarLoader width={200} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Find Your Perfect Job
              <span className="block text-blue-600">Search, Filter, Apply</span>
            </h1>
            <p className="text-gray-500 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
              Browse through our curated list of opportunities tailored to your
              skills and preferences.
            </p>

            {loadingJobs && (
              <div className="w-full mb-4">
                <BarLoader width={"100%"} color="#2563eb" />
              </div>
            )}

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="w-full flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="search-query"
                  placeholder="Search Jobs by Title"
                  className="pl-10 h-12 text-gray-800 border-gray-200"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Search Jobs
              </Button>
            </form>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Filter Jobs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                Location
              </label>
              <Select
                value={location}
                onValueChange={(value) => setLocation(value)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Building className="w-4 h-4 mr-1 text-gray-400" />
                Company
              </label>
              <Select
                value={company_id}
                onValueChange={(value) => setCompany_id(value)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.length > 0 ? (
                      companies.map(({ name, id }) => (
                        <SelectItem key={name} value={id}>
                          {name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2">No companies available</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-gray-200 text-gray-50 hover:bg-gray-50 hover:text-black  w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Available Positions
          </h2>

          {loadingJobs === false &&
            (currentJobs?.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedInit={job?.saved?.length > 0}
                  />
                ))}
              </div>
            ) : (
              <Card className="border shadow-sm bg-white">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-800">
                    No Jobs Found
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    Try adjusting your search filters or check back later for
                    new opportunities.
                  </p>
                </CardContent>
              </Card>
            ))}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex justify-center mb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="bg-black text-gray-50 rounded-sm">
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages).keys()].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      isActive={currentPage === page + 1}
                      className={
                        currentPage === page + 1
                          ? "bg-blue-50  text-blue-700"
                          : "bg-black"
                      }
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem className="bg-black rounded-sm">
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-700 rounded-lg shadow-sm mb-8 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Do not See What You are Looking For?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Create a job alert and we will notify you when new positions
            matching your criteria become available.
          </p>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 shadow-sm"
            size="lg"
          >
            Create Job Alert
          </Button>
        </section>
      </div>
    </div>
  );
};

export default JobListing;
