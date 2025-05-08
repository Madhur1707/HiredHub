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

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "text-gray-700 bg-gray-100";
      case "interviewing":
        return "text-blue-700 bg-blue-50";
      case "hired":
        return "text-green-700 bg-green-50";
      case "rejected":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <Card className="m-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#2563eb" />}
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center font-semibold text-gray-900">
          <div className="flex items-center">
            <UserCircle size={25} className="mr-3 text-blue-600" />
            <span>
              {isCandidate
                ? `${application?.job?.title} at ${application?.job?.company?.name}`
                : application?.name}
            </span>
          </div>
          <Download
            size={20}
            className="bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full h-8 w-8 p-1.5 cursor-pointer transition-colors"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="flex gap-2 items-center text-gray-700">
            <BriefcaseBusiness size={18} className="text-blue-600" />
            <span className="text-sm">
              {application?.experience} Years of experience
            </span>
          </div>
          <div className="flex gap-2 items-center text-gray-700">
            <School size={18} className="text-blue-600" />
            <span className="text-sm">Education: {application?.education}</span>
          </div>
          <div className="flex gap-2 items-center text-gray-700">
            <Boxes size={18} className="text-blue-600" />
            <span className="text-sm">Skills: {application?.skills}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {new Date(application?.created_at).toLocaleString()}
        </span>
        {isCandidate ? (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              application?.status
            )}`}
          >
            Status: {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52 border-gray-200 text-gray-700">
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
