import { ArrowDownIcon } from "./icon";

// module Icon = Generator_Icon

// module Option = {
//   @react.component
//   let make = (~value, ~children) => {
//     <option value={value}> {children} </option>
//   }
// }

export function Option({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}

// module OptGroup = {
//   @react.component
//   let make = (~label, ~children) => {
//     <optgroup label={label}> {children} </optgroup>
//   }
// }

export function OptGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <optgroup label={label}>{children}</optgroup>;
}

// // https://tailwindcomponents.com/component/dropdown-1
// module Select = {
//   type size = [#Large | #Medium]

//   @react.component
//   let make = (~onChange, ~value, ~size=#Medium, ~children) => {
//     let height = switch size {
//     | #Large => "h-12"
//     | #Medium => "h-8"
//     }
//     let className =
//       "border border-gray-300 rounded text-gray-600 " ++
//       height ++ " pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
//     <div className="relative inline-flex items-center">
//       <div className="absolute right-0 mr-3 pointer-events-none"> <Icon.DownArrow /> </div>
//       <select value={value} onChange={onChange} className={className}> {children} </select>
//     </div>
//   }
// }

export function Select({
  onChange,
  value,
  size = "Medium",
  children,
}: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  size?: "Large" | "Medium";
  children: React.ReactNode;
}) {
  const height = size === "Large" ? "h-12" : "h-8";
  const className = `border border-gray-300 rounded text-gray-600 ${height} pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none`;
  return (
    <div className="relative inline-flex items-center">
      <div className="absolute right-0 mr-3 pointer-events-none">
        <ArrowDownIcon />
      </div>
      <select value={value} onChange={onChange} className={className}>
        {children}
      </select>
    </div>
  );
}
