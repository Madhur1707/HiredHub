import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { State } from "country-state-city";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "@/api/apiCompanies";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company__id: z.string().min(1, { message: "Select or add a new company" }),
  requierments: z.string().min(1, { message: "Requierments are required" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requierments: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="m-1">
      <h1 className="gradient-title font-semibold text-3xl sm:text-3xl text-center pb-8">
        Post a Job
      </h1>
      <form className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message} </p>
        )}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder=" Location" />
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

          <Select
          // value={company_id}
          // onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Company Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.length > 0 ? (
                  companies.map(({ name, id }) => (
                    <SelectItem key={name} value={id}>
                      {name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2">No companies available</div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
