import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { User, Briefcase, ArrowRight, Sparkles } from "lucide-react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/post-job" : "/jobs");
      })
      .catch((err) => {
        console.log("Error updating role", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 top-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden pointer-events-none pt-20">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          </div>
          <BarLoader width={200} color="#36d7b7" />
          <p className="text-slate-600 font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm mx-auto relative z-10">
        <div className="text-center mb-6 space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Welcome to CareerConnect
          </h1>
          <p className="text-slate-600 font-medium">
            Select your role to continue your journey
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">I am a...</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleRoleSelection("candidate")}
              className="w-full h-auto py-4 px-4 flex items-center justify-between group hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-yellow-200"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 group-hover:from-yellow-200 group-hover:to-orange-200 transition-all duration-300 shadow-sm">
                  <User className="h-5 w-5 text-yellow-600 group-hover:text-yellow-700 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Candidate</p>
                  <p className="text-xs text-slate-600 font-medium">
                    Looking for opportunities
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all duration-300" />
            </Button>

            <Button
              onClick={() => handleRoleSelection("recruiter")}
              className="w-full h-auto py-4 px-4 flex items-center justify-between group hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-red-200"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 group-hover:from-red-200 group-hover:to-pink-200 transition-all duration-300 shadow-sm">
                  <Briefcase className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Recruiter</p>
                  <p className="text-xs text-slate-600 font-medium">
                    Hiring top talent
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-white/20">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            You can change this later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
