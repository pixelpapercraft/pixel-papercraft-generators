export type SelectChoice = {
  id: string;
  label: string;
};

export function Select({
  choices,
  value,
  onChange,
}: {
  choices: SelectChoice[];
  value?: SelectChoice;
  onChange: (choice: SelectChoice) => void;
}) {
  return (
    <select
      className="p-2 outline outline-1 outline-gray-300 border-r-8 border-transparent"
      value={value ? value.id : undefined}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.currentTarget.value;
        const choice = choices.find((c) => c.id === id);
        if (choice) {
          onChange(choice);
        }
      }}
    >
      {choices.map((choice) => (
        <option key={choice.id} value={choice.id}>
          {choice.label}
        </option>
      ))}
    </select>
  );
}
