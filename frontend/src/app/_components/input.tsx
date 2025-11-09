import { Input } from "../../components/ui/input";
import { Selects } from "../_components/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function Inputs() {
  const [selectedType, setSelectedType] = useState<string>(""); // store "Internship" or "Jobs"
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!selectedType) {
      toast.error("Please select an opportunity type");
      return;
    }

    const endpoint =
      selectedType === "Internship"
        ? "http://localhost:5000/auth/GetAllPosts/intern"
        : "http://localhost:5000/auth/GetAllPosts/job";

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const jobs = data.posts || [];

      const filtered = jobs.filter((job: any) =>
        job.title.toLowerCase().includes(searchText.toLowerCase())
      );

      if (filtered.length > 0) {
        const key =
          selectedType === "Internship" ? "internshipResults" : "jobResults";
        const path = selectedType === "Internship" ? "/internships" : "/jobs";
        sessionStorage.setItem(key, JSON.stringify(filtered));
        navigate(path);
      } else {
        toast.error(`No ${selectedType.toLowerCase()} found`);
      }
    } catch (err) {
      toast.error(`Error fetching ${selectedType.toLowerCase()}s`);
      console.error(err);
    }
  };

  return (
    <div className="mt-7">
      <div className="relative flex items-center space-x-2">
        <Selects onSelectChange={setSelectedType} />
        <Input
          type="text"
          placeholder="Enter the title, Keyword phrase"
          className="flex-1"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Search
          onClick={handleSearch}
          className="absolute flex justify-center items-center right-3 top-1/2 transform -translate-y-1/2 text-white-500 w-8 h-8  rounded-[50%] dark:bg-[#000000]"
        />
      </div>
    </div>
  );
}
