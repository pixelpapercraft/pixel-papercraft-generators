import React from "react";
import { type Tint, tints } from "./tints";
import { hexToRGB } from "@/builder/modules/renderers/drawTexture";

// module Builder = Generator.Builder

// module Icon = Generator_Icon
// module Textures = MinecraftBlock_Textures
// module Face = MinecraftBlock_Face
// module Tints = MinecraftBlock_Tints

// type useState<'a> = ('a, ('a => 'a) => unit)

//   type selectedTint = NoTint | CustomTint | HexTint(string)

type SelectedTint =
  | { kind: "NoTint" }
  | { kind: "CustomTint" }
  | { kind: "HexTint"; hex: string };

// module TintSelector = {

//   let makeOptions = tints => {
//     tints
//     ->Belt.Array.mapWithIndex((index1, {biomes, color}: Tints.tint) => {
//       biomes->Belt.Array.mapWithIndex((index2, biome) => {
//         let key = Js.Int.toString(index1) ++ "-" ++ Js.Int.toString(index2)
//         <option key={key} value={color}> {biome->React.string} </option>
//       })
//     })
//     ->Belt.Array.concatMany
//     ->React.array
//   }

function makeOptions(tints: Tint[]) {
  return tints.flatMap((tint, index1) => {
    return tint.biomes.map((biome, index2) => {
      const key = `${index1}-${index2}`;
      return (
        <option key={key} value={tint.color}>
          {biome}
        </option>
      );
    });
  });
}

//   let isValidTint = tint => {
//     switch Generator_Texture.hexToRGB(tint) {
//     | None => false
//     | Some(_) => true
//     }
//   }

function isValidTint(tint: string): boolean {
  const value = hexToRGB(tint);
  return value !== null;
}

//   let normalizeTint = tint => {
//     let tint = Js.String2.trim(tint)
//     if Js.String2.length(tint) === 0 {
//       None
//     } else {
//       let tint = if Js.String2.startsWith(tint, "#") {
//         tint
//       } else {
//         "#" ++ tint
//       }
//       if isValidTint(tint) {
//         Some(tint)
//       } else {
//         None
//       }
//     }
//   }

function normalizeTint(tint: string): string | null {
  const trimmed = tint.trim();
  if (trimmed.length === 0) {
    return null;
  } else {
    const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (isValidTint(normalized)) {
      return normalized;
    } else {
      return null;
    }
  }
}

//   @react.component
//   let make = (~onChange) => {
//     let (selectedTint, setSelectedTint) = React.useState(() => NoTint)
//     let (customTint, setCustomTint) = React.useState(() => None)

//     let onSelectChange = e => {
//       let target = ReactEvent.Form.target(e)
//       let tint = switch target["value"] {
//       | None => NoTint
//       | Some(value) =>
//         switch value {
//         | "None" => NoTint
//         | "Custom" => CustomTint
//         | _ => HexTint(value)
//         }
//       }
//       setSelectedTint(_ => tint)
//       switch tint {
//       | NoTint => onChange(None)
//       | CustomTint => onChange(None)
//       | HexTint(value) => onChange(Some(value))
//       }
//     }

//     let onInputChange = e => {
//       let target = ReactEvent.Form.target(e)
//       let tint = switch target["value"] {
//       | None => None
//       | Some(tint) => normalizeTint(tint)
//       }
//       setCustomTint(_ => tint)
//       switch tint {
//       | None => ()
//       | Some(value) => onChange(Some(value))
//       }
//     }

//     let color = switch selectedTint {
//     | NoTint => None
//     | CustomTint => customTint
//     | HexTint(color) => Some(color)
//     }

//     <div className="flex">
//       <select
//         placeholder="Tint"
//         onChange={onSelectChange}
//         className="border border-gray-300 rounded text-gray-600 h-8 pl-5 pr-10 mr-4 bg-white hover:border-gray-400 focus:outline-none appearance-none">
//         <option value="None"> {"No tint"->React.string} </option>
//         <option value="Custom"> {"Custom tint"->React.string} </option>
//         <optgroup key="grass" label="Grass"> {makeOptions(Tints.tints.grass)} </optgroup>
//         <optgroup key="foliage" label="Foliage"> {makeOptions(Tints.tints.foliage)} </optgroup>
//         <optgroup key="water" label="Water"> {makeOptions(Tints.tints.water)} </optgroup>
//       </select>
//       {switch selectedTint {
//       | CustomTint =>
//         <div>
//           <span> {"#"->React.string} </span>
//           <input
//             className="border border-gray-300 rounded text-gray-600 h-8 px-5 mr-4 bg-white"
//             onChange={onInputChange}
//           />
//         </div>
//       | _ => React.null
//       }}
//       {switch color {
//       | None => React.null
//       | Some(color) =>
//         <div>
//           <div className="border w-8 h-8" style={ReactDOM.Style.make(~backgroundColor=color, ())} />
//         </div>
//       }}
//     </div>
//   }
// }

export function TintSelector(props: {
  onChange: (tint: string | null) => void;
}) {
  const [selectedTint, setSelectedTint] = React.useState<SelectedTint>({
    kind: "NoTint",
  });
  const [customTint, setCustomTint] = React.useState<string | null>(null);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let tint: SelectedTint;
    switch (value) {
      case "None":
        tint = { kind: "NoTint" };
        break;
      case "Custom":
        tint = { kind: "CustomTint" };
        break;
      default:
        tint = { kind: "HexTint", hex: value };
        break;
    }
    setSelectedTint(tint);
    switch (tint.kind) {
      case "NoTint":
        props.onChange(null);
        break;
      case "CustomTint":
        props.onChange(null);
        break;
      case "HexTint":
        props.onChange(tint.hex);
        break;
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tint = normalizeTint(value);
    setCustomTint(tint);
    switch (tint) {
      case null:
        break;
      default:
        props.onChange(tint);
        break;
    }
  };

  const color = (() => {
    switch (selectedTint.kind) {
      case "NoTint":
        return null;
      case "CustomTint":
        return customTint;
      case "HexTint":
        return selectedTint.hex;
    }
  })();

  return (
    <div className="flex">
      <select
        // placeholder="Tint"
        onChange={onSelectChange}
        className="border border-gray-300 rounded text-gray-600 h-8 pl-5 pr-10 mr-4 bg-white hover:border-gray-400 focus:outline-none appearance-none"
      >
        <option value="None">No tint</option>
        <option value="Custom">Custom tint</option>
        <optgroup key="grass" label="Grass">
          {makeOptions(tints.grass)}
        </optgroup>
        <optgroup key="foliage" label="Foliage">
          {makeOptions(tints.foliage)}
        </optgroup>
        <optgroup key="water" label="Water">
          {makeOptions(tints.water)}
        </optgroup>
      </select>

      {selectedTint.kind === "CustomTint" ? (
        <div>
          <span>#</span>
          <input
            className="border border-gray-300 rounded text-gray-600 h-8 px-5 mr-4 bg-white"
            onChange={onInputChange}
          />
        </div>
      ) : null}

      {color ? (
        <div>
          <div className="border w-8 h-8" style={{ backgroundColor: color }} />
        </div>
      ) : null}
    </div>
  );
}
