import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedjobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, { recruiter_id: user.id });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedjobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {createdJobs && createdJobs.length > 0 ? (
          createdJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              savedInt={job?.saved?.length > 0}
              isMyJob
            />
          ))
        ) : (
          <p>No jobs created yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
