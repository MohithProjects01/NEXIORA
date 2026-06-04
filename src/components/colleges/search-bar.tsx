import { Search } from "lucide-react";
import { COLLEGE_SEARCH_PLACEHOLDER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({
  defaultValue,
  action = "/colleges",
}: {
  defaultValue?: string;
  action?: string;
}) {
  return (
    <form action={action} className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <Input
          name="search"
          defaultValue={defaultValue}
          placeholder={COLLEGE_SEARCH_PLACEHOLDER}
          className="pl-11"
        />
      </div>
      <Button type="submit" className="sm:min-w-32">
        Search
      </Button>
    </form>
  );
}
