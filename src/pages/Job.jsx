/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon, Users, ChevronRight, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplicationCard from "@/components/ApplicationCard";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import ApplyJobDrawer from "@/components/ApplyJobs";
import { Button } from "@/components/ui/button";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-4">
          <Link to="/jobs" className="hover:text-gray-700">Jobs</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{job?.title}</span>
        </nav>
        
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {job?.title}
              </h1>
              {job?.company?.logo_url && (
                <div className="flex-shrink-0 p-2 bg-black rounded-lg border shadow-sm">
                  <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" /> 
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-400" /> 
                <span>{job?.applications?.length || 0} Applicants</span>
              </div>
              <div className="flex items-center">
                {job?.isOpen ? (
                  <>
                    <DoorOpen className="w-4 h-4 mr-2 text-green-500" /> 
                    <span className="text-green-600 font-medium">Open</span>
                  </>
                ) : (
                  <>
                    <DoorClosed className="w-4 h-4 mr-2 text-red-500" /> 
                    <span className="text-red-600 font-medium">Closed</span>
                  </>
                )}
              </div>
            </div>

            {job?.recruiter_id === user?.id && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Hiring Status</div>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger
                    className={`w-full ${
                      job?.isOpen 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Apply button for non-recruiters */}
            {job?.recruiter_id !== user?.id && (
              <div className="mt-4">
                <ApplyJobDrawer
                  job={job}
                  user={user}
                  fetchJob={fnJob}
                  applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Job details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the job</h2>
                <p className="text-gray-700 leading-relaxed sm:text-lg">{job?.description}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-black mb-4">What we are looking for</h2>
                <div className="prose prose-blue max-w-none">
                  <MDEditor.Markdown
                    source={job?.requirements}
                    className="bg-transparent sm:text-sm"
                  />
                </div>
              </div>

              {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
              
              {/* Applications section for recruiters */}
              {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {job?.applications?.length} total
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {job?.applications.map((application) => {
                      return (
                        <ApplicationCard key={application.id} application={application} />
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-col w-full gap-2 justify-center mt-6">
                    <Link to={`/shortlist-ai?job_id=${job.id}`} className="w-full">
                      <Button
                        variant="yellow"
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-center font-medium"
                      >
                        Run AI Shortlisting
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Additional info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Job Type</div>
                    <div className="text-sm text-gray-500">{job?.job_type || "Full Time"}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Location</div>
                    <div className="text-sm text-gray-500">{job?.location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;