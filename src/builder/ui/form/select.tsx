export type SelectOption = {
  id: string;
  label: string;
};

export type SelectOptionGroup = {
  id: string;
  label: string;
  options: SelectOption[];
};

export type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

function flattenChoices(choices: SelectOptionOrGroup[]): SelectOption[] {
  return choices.flatMap((choice) => {
    if ("options" in choice) {
      return choice.options;
    }
    return [choice];
  });
}

export function Select({
  choices,
  value,
  onChange,
}: {
  choices: SelectOptionOrGroup[];
  value?: SelectOption;
  onChange: (choice: SelectOption) => void;
}) {
  const flatChoices = flattenChoices(choices);
  return (
    <select
      className="p-2 outline outline-1 outline-gray-300 border-r-8 border-transparent"
      value={value ? value.id : undefined}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.currentTarget.value;
        const choice = flatChoices.find((c) => c.id === id);
        if (choice) {
          onChange(choice);
        }
      }}
    >
      {choices.map((choice) => {
        if ("options" in choice) {
          return (
            <optgroup key={choice.id} label={choice.label}>
              {choice.options.map((c) => {
                return (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                );
              })}
            </optgroup>
          );
        }
        return (
          <option key={choice.id} value={choice.id}>
            {choice.label}
          </option>
        );
      })}
    </select>
  );
}
