import { getJobs } from "@/api/apiJobs";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";

const JobListing = () => {

  const fetchJobs = async () => {
    const supabaseAccessToken = await session.getToken({
      template: "supabase",
    });
    const data = await getJobs(supabaseAccessToken);
    console.log(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return <div>JobListing</div>;
};

export default JobListing;
