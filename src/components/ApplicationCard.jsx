/* eslint-disable react/prop-types */
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
  UserCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/useFetch";
import { updateApplicationStatus } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-semibold">
          <div className="flex items-center">
            <UserCircle size={25} color="#fef08a" className="mr-3" />
            <span>
              {isCandidate
                ? `${application?.job?.title} at ${application?.job?.company?.name}`
                : application?.name}
            </span>
          </div>
          <Download
            size={20}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            {" "}
            <BriefcaseBusiness size={20} color="#fef08a" />{" "}
            {application?.experience}- Years of experience
          </div>
          <div className="flex gap-2 items-center">
            {" "}
            <School size={20} color="#fef08a" />
            Education: {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            {" "}
            <Boxes size={20} color="#fef08a" /> Skills: {application?.skills}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between" r>
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span
            className="capatilize font-bold
        "
          >
            Status: {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
