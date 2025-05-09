import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { Briefcase, Building, MapPin } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BarLoader width={200} color="#2563eb" />
      </div>
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Post a New Job
              <span className="block text-blue-600">Create an Opportunity</span>
            </h1>
            <p className="text-gray-500 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
              Fill in the details below to create a new job listing for
              potential candidates.
            </p>

            {loadingCreateJob && (
              <div className="w-full mb-4">
                <BarLoader width={"100%"} color="#2563eb" />
              </div>
            )}
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Job Details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Input
                placeholder="Job Title"
                {...register("title")}
                className="border-gray-200 h-12 text-black bg-white"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Description
              </label>
              <Textarea
                placeholder="Job Description"
                {...register("description")}
                className="border-gray-200 min-h-24 text-gray-800 bg-white"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  Job Location
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border-gray-200 h-12 bg-white text-gray-700">
                        <SelectValue placeholder="Job Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {State.getStatesOfCountry("IN").map(({ name }) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-1 text-gray-400" />
                  Company
                </label>
                <div className="flex gap-2">
                  <Controller
                    name="company_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-gray-200 h-12 flex-grow bg-white text-gray-700">
                          <SelectValue placeholder="Company">
                            {field.value
                              ? companies?.find(
                                  (com) => com.id === Number(field.value)
                                )?.name
                              : "Company"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {companies?.map(({ name, id }) => (
                              <SelectItem key={name} value={id}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <AddCompanyDrawer fetchCompanies={fnCompanies} />
                </div>
                {errors.company_id && (
                  <p className="text-red-500 text-sm">
                    {errors.company_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Requirements
              </label>
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    className="border-gray-200 bg-white text-black"
                  />
                )}
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            {errorCreateJob?.message && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                {errorCreateJob?.message}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full h-12"
                disabled={loadingCreateJob}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </div>
          </form>
        </section>

        {/* Back to Jobs Section */}
        <section className="bg-blue-700 rounded-lg shadow-sm mb-8 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Changed Your Mind?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Return to the job listings page to view all current openings.
          </p>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 shadow-sm"
            size="lg"
            onClick={() => navigate("/jobs")}
          >
            View Job Listings
          </Button>
        </section>
      </div>
    </div>
  );
};

export default PostJob;
