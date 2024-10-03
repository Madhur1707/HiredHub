import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

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

  console.log(Jobs);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
    console.log(query);
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
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
          className="h-full flex-1 m-5 px-4 text-black text-center rounded-md"
        />
        <Button
          type="submit"
          variant="yellow"
          className="h-full text-lg m-5 px-6 sm:w-32 w-40"
        >
          Search
        </Button>
      </form>

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div>No Jobs Found !!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
