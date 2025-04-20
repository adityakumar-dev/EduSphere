// components/Dropdown.tsx
import { useState } from "react";

const Dropdown = ({ options , onSelect, placeholder = "Select an option" }: { options: any[], onSelect: (option: any) => void, placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option: any) => {
    setSelected(option);
    setIsOpen(false);
    onSelect && onSelect(option);
  };

  return (
    <div className="relative w-64">
      <div
        className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected.label : placeholder}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-md z-10">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
