import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface CurrentlyCheckboxProps {
  checked: boolean[];
  index: number;
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
  text: string;
}

const CurrentlyCheckbox: React.FC<CurrentlyCheckboxProps> = ({ checked, index, setChecked, text }) => {
  const handleCheck = (value: boolean | "indeterminate") => {
    const updatedChecks = [...checked];
    updatedChecks[index] = value === true;
    setChecked(updatedChecks);
  };

  return (
    <div className="flex items-center  justify-end gap-1 pt-1">
      <Checkbox
        checked={checked[index] ? checked[index]:false}
        aria-label={`Currently ${text}`}
        onCheckedChange={handleCheck}
      />
      <p className="text-sm font-medium">Currently {text}</p>
    </div>
  );
};

export default CurrentlyCheckbox;
