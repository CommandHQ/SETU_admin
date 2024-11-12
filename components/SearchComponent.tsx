import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

const SearchComponent = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Combine all navigation items
  const allItems = [
    {
      group: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", keywords: ["home", "main"] },
        { title: "Users", url: "/users", keywords: ["people", "accounts"] },
        { title: "Jobs", url: "/jobs", keywords: ["positions", "careers"] },
        { title: "Reports", url: "/reports", keywords: ["analytics", "stats"] },
        { title: "Certifications", url: "/certification-sales", keywords: ["certificates", "diplomas"] },
      ]
    },
    {
      group: "Master Tables",
      items: [
        { title: "Certificates", url: "/master/certification", keywords: ["diploma", "degree"] },
        { title: "University", url: "/master/university", keywords: ["school", "college"] },
        { title: "Field of Study", url: "/master/fieldofstudy", keywords: ["major", "subject"] },
        { title: "Skill", url: "/master/skill", keywords: ["ability", "competency"] },
        { title: "Job Title", url: "/master/jobtitle", keywords: ["position", "role"] },
        { title: "Company", url: "/master/company", keywords: ["business", "organization"] },
        { title: "Degree", url: "master/degree", keywords: ["qualification", "education"] }
      ]
    }
  ];

  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    router.push(url);
  }, [router]);

  return (
    <div className="relative w-full max-w-sm">
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search pages...</span>
        
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {allItems.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${item.title} ${item.keywords.join(' ')}`}
                  onSelect={() => handleSelect(item.url)}
                >
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchComponent;