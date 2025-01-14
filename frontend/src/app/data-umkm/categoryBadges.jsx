import { Badge } from "@/components/ui/badge";

export const CategoryBadges = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex max-w-full gap-2 overflow-auto sm:grid-cols-5 sm:grid md:grid-cols-10 no-scrollbar">
    {/* <div className="grid grid-cols-10 gap-2 sm:grid-cols-5 lg:grid-cols-10"> */}
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory != category ? "default" : "secondary"}
          className="flex items-center justify-center w-full py-2 cursor-pointer whitespace-nowrap"
          onClick={() => setSelectedCategory(category == selectedCategory ? null : category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

