/* eslint-disable react/prop-types */
import { Heart, MapPin, Trash2, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import SaveJob from "@/pages/SaveJob";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(SaveJob, {
    alreadySaved: saved,
  });

  const { user } = useUser();

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };

  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  return (
    <Card className="m-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
          {job.title}
          {isMyJob && (
            <Trash2
              size={18}
              className="text-red-500 cursor-pointer hover:text-red-700"
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-black p-2 rounded-sm">
            {job.company && (
              <img
                src={job.company.logo_url}
                alt="Company"
                className="h-6 w-auto object-contain"
              />
            )}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={15} className="mr-1" />
            {job.location}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            {job.description?.slice(0, 150)}...
          </p>
        </div>

        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>Posted {Math.floor(Math.random() * 30) + 1} days ago</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2 border-t border-gray-100">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button
            variant="ghost"
            className="w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="border-gray-200"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
