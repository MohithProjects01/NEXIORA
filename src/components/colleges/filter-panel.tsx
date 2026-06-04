import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/constants";
import type { CollegeFilters } from "@/types/college";

type FilterPanelProps = {
  filters: {
    states: string[];
    locations: string[];
    courses: string[];
    selected: CollegeFilters;
  };
};

export function FilterPanel({ filters }: FilterPanelProps) {
  const selected = filters.selected;

  return (
    <Card>
      <form action="/colleges" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input id="search" name="search" defaultValue={selected.search} placeholder="College or course" />
        </div>
        <div>
          <Label htmlFor="states">State</Label>
          <Select id="states" name="states" defaultValue={selected.states?.[0]}>
            <option value="">All states</option>
            {filters.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="locations">Location</Label>
          <Select id="locations" name="locations" defaultValue={selected.locations?.[0]}>
            <option value="">All cities</option>
            {filters.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="courses">Course</Label>
          <Select id="courses" name="courses" defaultValue={selected.courses?.[0]}>
            <option value="">All courses</option>
            {filters.courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="ownership">Ownership</Label>
          <Select id="ownership" name="ownership" defaultValue={selected.ownership?.[0]}>
            <option value="">All ownership</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="minFees">Min Fees</Label>
          <Input id="minFees" name="minFees" type="number" defaultValue={selected.minFees} placeholder="0" />
        </div>
        <div>
          <Label htmlFor="maxFees">Max Fees</Label>
          <Input id="maxFees" name="maxFees" type="number" defaultValue={selected.maxFees} placeholder="500000" />
        </div>
        <div>
          <Label htmlFor="minRating">Min Rating</Label>
          <Input id="minRating" name="minRating" type="number" step="0.1" min="0" max="5" defaultValue={selected.minRating} placeholder="4.0" />
        </div>
        <div>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select id="sortBy" name="sortBy" defaultValue={selected.sortBy ?? "rating_desc"}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <input type="hidden" name="page" value="1" />
        <div className="flex items-end gap-3">
          <Button type="submit">Apply Filters</Button>
          <Button type="reset" variant="ghost" formAction="/colleges">
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
