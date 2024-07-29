import { Input } from '@/components/ui/input';
import React, { ChangeEvent } from 'react';

interface CurrentlyCheckboxProps {
  checked: boolean[];
  index: number;
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
  text: string;
}

const CurrentlyCheckbox: React.FC<CurrentlyCheckboxProps> = ({ checked, index, setChecked, text }) => {
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedChecks = [...checked];
    updatedChecks[index] = event.target.checked;
    setChecked(updatedChecks);
  };

  return (
    <div className="flex items-center  justify-end gap-1 pt-1">
      <Input
        type="checkbox"
        checked={checked[index] ? checked[index]:false}
        className="w-4 h-4"
        onChange={handleCheck}
      />
      <p className="text-sm font-medium">Currently {text}</p>
    </div>
  );
};

export default CurrentlyCheckbox;
