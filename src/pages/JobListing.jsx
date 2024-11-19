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

const cities = ["Hyderabad", "Noida", "Gurgaon", "Bengaluru", "Pune"];

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

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
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-semibold text-3xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      {loadingJobs && (
        <BarLoader className="mb-5" width={"100%"} color="#36d7b7" />
      )}
      <form
        onSubmit={handleSearch}
        className="h-auto flex flex-col sm:flex-row w-full items-center "
      >
        <input
          type="text"
          name="search-query"
          placeholder="Search Jobs by Title"
          className="h-12 w-full sm:flex-1 m-3 px-4 text-black text-lg font-semibold rounded-md"
        />
        <Button
          type="submit"
          variant="yellow"
          className="h-14 w-full sm:w-auto sm:h-full text-lg m-3 px-6"
        >
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 m-3">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter By Location (City)" />
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

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter By Company" />
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
        <Button
          onClick={clearFilters}
          variant="destructive"
          className=" sm:w-1/2"
        >
          Clear Search
        </Button>
      </div>

      {loadingJobs === false && (
        <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {currentJobs?.length ? (
            currentJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  active={currentPage === page + 1}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default JobListing;
