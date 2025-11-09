import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Selects.tsx
export function Selects({
  onSelectChange,
}: {
  onSelectChange: (value: string) => void;
}) {
  return (
    <Select onValueChange={onSelectChange}>
      <SelectTrigger className="w-[170px] bg-[#aa8bed] !text-black dark:!text-white">
        <SelectValue placeholder="All Opportunities" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Opportunities</SelectLabel>
          <SelectItem value="Internship">Internship</SelectItem>
          <SelectItem value="Jobs">Jobs</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
