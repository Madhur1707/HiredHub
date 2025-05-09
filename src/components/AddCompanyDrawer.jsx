import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/useFetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { Building, Plus, Upload } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file &&
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only Images are allowed" }
    ),
});

// eslint-disable-next-line react/prop-types
const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) fetchCompanies();
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button
          type="button"
          className="border-blue-200 text-white hover:bg-blue-50 hover:text-blue-700 shadow-sm w-full h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-50 p-4">
        <div className="max-w-screen-xl">
          <DrawerHeader className="px-0">
            <DrawerTitle className=" text-2xl font-bold text-gray-900">
              Add a New Company
            </DrawerTitle>
          </DrawerHeader>

          <div className="bg-white rounded-lg shadow-sm border p-6 mt-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-1 text-gray-400" />
                  Company Name
                </label>
                <Input
                  placeholder="Company name"
                  {...register("name")}
                  className="border-gray-200 h-12 text-gray-800 bg-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Upload className="w-4 h-4 mr-1 text-gray-400" />
                  Company Logo
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  className="border-black bg-white h-12 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register("logo")}
                />
                {errors.logo && (
                  <p className="text-red-500 text-sm">{errors.logo.message}</p>
                )}
              </div>

              {errorAddCompany?.message && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                  {errorAddCompany?.message}
                </div>
              )}

              {loadingAddCompany && (
                <BarLoader width={"100%"} color="#2563eb" />
              )}

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex-1 h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="border-gray-200 text-gray-50 hover:bg-gray-50 hover:text-black shadow-sm flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
