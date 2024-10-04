import supabaseClient from "@/utils/supabase";

export async function getCompanies(tooken) {
  const supabase = await supabaseClient(tooken);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.log("Error Fetching Companies: ", error);
    return null;
  }

  return data;
}
