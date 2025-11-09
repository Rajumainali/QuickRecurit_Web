import { useState } from "react";
import { Command, CommandGroup, CommandItem } from "../../components/ui/command";
import{ 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Badge } from "../../components/ui/badge";
import { X } from "lucide-react";

const items = [
  "Operations",
  "Hotel management",
  "Culinary arts",
  "Biotech",
  "Campus ambassador",
  "Public relations (pr)",
  "Telecalling",
  "Power bi",
  "Marketing",
  "Hr",
];

export default function SelectiveDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const removeItem = (item: string) => {
    setSelected(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-[350px] min-h-[45px] flex flex-wrap gap-1 items-center px-2 py-2 border rounded-md cursor-pointer">
          {selected.length > 0 ? (
            selected.map((item) => (
              <Badge key={item} className="flex items-center gap-1">
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent popover toggle
                    removeItem(item); // remove the tag
                  }}
                  className="ml-1 focus:outline-none "
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">Select sectors</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        className="w-[400px] max-h-[300px] overflow-auto p-0"
      >
        <Command>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={() => toggleItem(item)}
                className={`cursor-pointer px-3 py-2 mb-2 ${
                  selected.includes(item) ? "bg-blue-100 text-blue-800" : ""
                }`}
              >
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}