/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
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
  savedInt = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInt);
  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loaadingSavedJob,
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
    <Card className="flex flex-col m-2 shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-md hover:shadow-gray-400">
      <CardHeader>
        <CardTitle className="flex justify-between font-semibold">
          {job.title}
          {!isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && (
            <img src={job.company.logo_url} alt="Company" className="h-6" />
          )}
          <div className=" flex gap-2 items-center">
            <MapPinIcon size={15} />
            {job.location}{" "}
          </div>
        </div>

        <p className=" text-sm">{job.description.slice(0, 150)}...</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="ghost" className="w-full text-yellow-300">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loaadingSavedJob}
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
