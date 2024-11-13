import React, { useState, useEffect } from "react";
import Select, { MultiValue, SingleValue, ActionMeta } from "react-select";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFieldOfStudySearch } from "@/services/MasterServices/fieldofstudyService";
import { getRecruiterSearch } from "@/services/Job_services/recuriterService";
import { searchSkillMastersByName } from "@/services/MasterServices/skillService";
import { getJobfieldSearch } from "@/services/Job_services/jobService";
import { getDegreeSearch } from "@/services/MasterServices/degreeService";

interface Option {
  value: string;
  label: string;
}

interface FieldProps {
  name: string;
  label: string;
  type: string;
  options?: string[];
  isMulti?: boolean;
}

interface SearchComponentProps {
  field: FieldProps;
  value: Option[] | Option | null;
  onChange: (value: Option[] | Option | null) => void;
  isMulti?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ field, value, onChange, isMulti }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedItems, setSelectedItems] = useState<Option[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  useEffect(() => {
    const fetchOptions = async () => {
      if (debouncedSearchQuery.length >= 2) {
        setIsLoading(true);
        try {
          let results: any[] = [];
          switch (field.name) {
            case "education":
              results = await getFieldOfStudySearch(debouncedSearchQuery);
              break;
            case "recruiterId":
              results = await getRecruiterSearch(debouncedSearchQuery);
              break;
            case "skills":
              results = await searchSkillMastersByName(debouncedSearchQuery);
              break;
            case "titleId":
              results = await getJobfieldSearch(debouncedSearchQuery);
              break;
            case "department":
              results = await getDegreeSearch(debouncedSearchQuery);
              break;
            default:
              console.warn(`No search function defined for field: ${field.name}`);
          }

          if (Array.isArray(results)) {
            setOptions(
              results.map((item: any) => ({
                value: item.id,
                label: field.name === "recruiterId" ? item.email : item.name,
              }))
            );
          } else {
            console.error("Unexpected response format:", results);
            setOptions([]);
          }
        } catch (error) {
          console.error(`Failed to search ${field.name}:`, error);
          setOptions([]);
        }
        setIsLoading(false);
      } else {
        setOptions([]);
      }
    };

    fetchOptions();
  }, [debouncedSearchQuery, field.name]);

  const handleChange = (
    newValue: MultiValue<Option> | SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (isMulti) {
      const multiValue = newValue as MultiValue<Option>;
      setSelectedItems([...multiValue]);
      onChange([...multiValue]);
    } else {
      const singleValue = newValue as SingleValue<Option>;
      setSelectedItems(singleValue ? [singleValue] : []);
      onChange(singleValue);
    }
  };

  const handleRemove = (itemToRemove: Option) => {
    if (isMulti) {
      const newSelectedItems = selectedItems.filter(item => item.value !== itemToRemove.value);
      setSelectedItems(newSelectedItems);
      onChange(newSelectedItems);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <Select<Option, boolean>
          id={field.name}
          name={field.name}
          value={isMulti ? selectedItems : selectedItems[0] || null}
          onChange={handleChange}
          options={field.options 
            ? field.options.map(option => ({ value: option, label: option })) 
            : options
          }
          onInputChange={setSearchQuery}
          placeholder={`Search for ${field.name === "recruiterId" ? "recruiter email" : field.label.toLowerCase()}...`}
          isSearchable
          className="w-full mt-1"
          classNamePrefix="react-select"
          isLoading={isLoading}
          loadingMessage={() => `Searching ${field.name === "recruiterId" ? "recruiter email" : field.label.toLowerCase()}...`}
          noOptionsMessage={({ inputValue }) =>
            inputValue.length > 0
              ? `No ${field.name === "recruiterId" ? "recruiter email" : field.label.toLowerCase()} found`
              : `Start typing to search for ${field.name === "recruiterId" ? "recruiter email" : field.label.toLowerCase()}`
          }
          isMulti={isMulti}
        />

      </div>
    </div>
  );
};

export default SearchComponent;