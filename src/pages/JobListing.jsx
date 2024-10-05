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
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

// City-based filter

const cities = ["Hyderabad", "Noida", "Gurgaon", "Bengaluru", "Pune"];

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, searchQuery, company_id });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  console.log(Jobs);

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
  };

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
        className="h-14 flex flex-row w-full  items-center mb-3"
      >
        <input
          type="text"
          name="search-query"
          placeholder="Search Jobs by Title"
          className="h-full flex-1 m-5 px-4 text-black text-lg font-semibold rounded-md"
        />
        <Button
          type="submit"
          variant="yellow"
          className="h-full text-lg m-5 px-6 sm:w-32"
        >
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 m-5">
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
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Jobs?.length ? (
            Jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInt={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="m-5">No Jobs Found !!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
