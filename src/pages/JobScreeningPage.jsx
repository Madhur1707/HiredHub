import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { getJobById } from "@/api/jobsApi";
import ScreeningResults from "@/components/screening/ScreeningResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const JobScreeningPage = () => {
  const { jobId } = useParams();
  const { fn: fetchJob, data: job, loading, error } = useFetch(getJobById, { id: jobId });
  
  useEffect(() => {
    fetchJob();
  }, [jobId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-md">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p>{error?.message || "Job not found"}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={`/dashboard/jobs/${jobId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold">{job.title}</h1>
        {job.company && <p className="text-muted-foreground">at {job.company.name}</p>}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ScreeningResults jobId={jobId} />
      </div>
    </div>
  );
};

export default JobScreeningPage;