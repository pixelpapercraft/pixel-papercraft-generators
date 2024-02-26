import React from "react";

// module FormInput = Generator_FormInput
// module Builder = Generator_Builder
// module Icon = Generator_Icon
// module Buttons = Generator_Buttons

import { type Texture, makeTextureFromImage } from "@/builder/modules/texture";
import {
  type Model,
  addTexture,
  clearTexture,
  setStringInputValue,
  setBooleanInputValue,
  setSelectInputValue,
  setRangeInputValue,
  getBooleanInputValue,
  getSelectInputValue,
} from "@/builder/modules/model";
import { makeImageFromUrl } from "@/builder/modules/imageFactory";

// module TextureInput = {
//   @react.component
//   let make = (
//     ~id: string,
//     ~textures: Js.Dict.t<Generator_Texture.t>,
//     ~choices: array<string>,
//     ~onChange: option<Dom2.Image.t> => unit,
//   ) => {
//     let (name, setName) = React.useState(() => None)

//     let onInputChange = e => {
//       let target = ReactEvent.Form.target(e)
//       let files: option<array<Dom2.File.t>> = target["files"]
//       switch files {
//       | None => ()
//       | Some(files) => {
//           let file = files[0]
//           switch file {
//           | None => ()
//           | Some(file) => {
//               let fileReader = Dom2.FileReader.make()
//               fileReader->Dom2.FileReader.setOnLoad(e => {
//                 let target = ReactEvent.Form.target(e)
//                 let result: option<string> = target["result"]
//                 switch result {
//                 | None => ()
//                 | Some(result) => {
//                     setName(_ => Some(file.name))
//                     Generator_ImageFactory.makeFromUrl(result)
//                     ->Promise.thenResolve(image => onChange(Some(image)))
//                     ->ignore
//                   }
//                 }
//               })
//               fileReader->Dom2.FileReader.readAsDataUrl(file)
//             }
//           }
//         }
//       }
//     }

//     let onChoiceChange = e => {
//       let target = ReactEvent.Form.target(e)
//       let value = target["value"]
//       let texture = Js.Dict.get(textures, value)
//       switch texture {
//       | None => onChange(None)
//       | Some(texture) => onChange(Some(texture.imageWithCanvas.image))
//       }
//     }

//     <div className="mb-4">
//       <div className="font-bold"> {React.string(id)} </div>
//       <div className="flex items-center">
//         {Js.Array2.length(choices) > 0
//           ? <div>
//               <select onChange={onChoiceChange} className="p-2">
//                 <option value=""> {React.string("None")} </option>
//                 {choices
//                 ->Js.Array2.map(choice => {
//                   <option key={choice} value={choice}> {React.string(choice)} </option>
//                 })
//                 ->React.array}
//               </select>
//               <span className="px-2"> {React.string("or")} </span>
//             </div>
//           : React.null}
//         <div className="overflow-hidden relative w-48">
//           <button
//             className="bg-blue-500 rounded text-white py-1 px-4 w-full inline-flex items-center">
//             <Icon.Upload />
//             <span className="ml-2"> {React.string("Choose file")} </span>
//           </button>
//           <input
//             className="cursor-pointer absolute block opacity-0 top-0 bottom-0 left-0 right-0"
//             type_="file"
//             onChange={onInputChange}
//           />
//         </div>
//         <div className="ml-3">
//           {switch name {
//           | None => React.null
//           | Some(name) => React.string(name)
//           }}
//         </div>
//       </div>
//     </div>
//   }
// }

export function TextureInput({
  id,
  textures,
  choices,
  onChange,
}: {
  id: string;
  textures: Record<string, Texture>;
  choices: string[];
  onChange: (image: HTMLImageElement | null) => void;
}) {
  const [name, setName] = React.useState<string | null>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setName(file.name);
          makeImageFromUrl(result).then((image) => onChange(image));
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const onChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const texture = textures[value];
    onChange(texture?.imageWithCanvas.image || null);
  };

  return (
    <div className="mb-4">
      <div className="font-bold">{id}</div>
      <div className="flex items-center">
        {choices.length > 0 ? (
          <div>
            <select onChange={onChoiceChange} className="p-2">
              <option value="">None</option>
              {choices.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
            <span className="px-2">or</span>
          </div>
        ) : null}
        <div className="overflow-hidden relative w-48">
          <button className="bg-blue-500 rounded text-white py-1 px-4 w-full inline-flex items-center">
            <span>Choose file</span>
          </button>
          <input
            className="cursor-pointer absolute block opacity-0 top-0 bottom-0 left-0 right-0"
            type="file"
            onChange={onInputChange}
          />
        </div>
        <div className="ml-3">{name}</div>
      </div>
    </div>
  );
}

// module BooleanInput = {
//   @react.component
//   let make = (~id, ~checked, ~onChange) => {
//     let onInputChange = _ => onChange(!checked)
//     <div className="mb-4">
//       <div className="flex flex-col">
//         {switch checked {
//         | false =>
//           <label className="mt-3 inline-flex items-center cursor-pointer">
//             <span className="relative">
//               <span className="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
//               <span
//                 className="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-50 ease-in-out">
//                 <input
//                   type_="checkbox" className="absolute opacity-0 w-0 h-0" onChange={onInputChange}
//                 />
//               </span>
//             </span>
//             <span className="ml-3"> {React.string(id)} </span>
//           </label>
//         | true =>
//           <label className="mt-3 inline-flex items-center cursor-pointer">
//             <span className="relative">
//               <span className="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
//               <span
//                 className="absolute block w-4 h-4 mt-1 ml-1 rounded-full inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-50 ease-in-out bg-blue-500 transform translate-x-full">
//                 <input
//                   type_="checkbox" className="absolute opacity-0 w-0 h-0" onChange={onInputChange}
//                 />
//               </span>
//             </span>
//             <span className="ml-3"> {React.string(id)} </span>
//           </label>
//         }}
//       </div>
//     </div>
//   }
// }

export function BooleanInput({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const onInputChange = () => onChange(!checked);

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <label className="mt-3 inline-flex items-center cursor-pointer">
          <span className="relative">
            <span className="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
            <span
              className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-50 ease-in-out ${
                checked ? "bg-blue-500 transform translate-x-full" : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                className="absolute opacity-0 w-0 h-0"
                onChange={onInputChange}
              />
            </span>
          </span>
          <span className="ml-3">{id}</span>
        </label>
      </div>
    </div>
  );
}

// module SelectInput = {
//   @react.component
//   let make = (~id, ~options, ~value, ~onChange) => {
//     let onSelectChange = (e: ReactEvent.Form.t) => {
//       let target = ReactEvent.Form.target(e)
//       let value: option<string> = target["value"]
//       switch value {
//       | None => ()
//       | Some(value) => onChange(value)
//       }
//     }
//     <div className="mb-4">
//       <div className="font-bold"> {React.string(id)} </div>
//       <FormInput.Select value={value} onChange={onSelectChange}>
//         {Js.Array2.map(options, option => {
//           <FormInput.Option key={option} value={option}> {React.string(option)} </FormInput.Option>
//         })->React.array}
//       </FormInput.Select>
//     </div>
//   }
// }

export function SelectInput({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <div className="font-bold">{id}</div>
      <select value={value} onChange={onSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// module RangeInput = {
//   @react.component
//   let make = (~id, ~min, ~max, ~step, ~value, ~onChange) => {
//     let onRangeChange = (e: ReactEvent.Form.t) => {
//       let target = ReactEvent.Form.target(e)
//       let value: option<string> = target["value"]
//       switch value {
//       | None => ()
//       | Some(value) => {
//           let value = Belt.Int.fromString(value)
//           switch value {
//           | None => ()
//           | Some(value) => onChange(value)
//           }
//         }
//       }
//     }
//     <div className="mb-4">
//       <div className="font-bold"> {React.string(id)} </div>
//       <input
//         type_="range"
//         min={min->Js.Int.toString}
//         max={max->Js.Int.toString}
//         value={value->Js.Int.toString}
//         step={step->Js.Int.toFloat}
//         onChange={onRangeChange}
//       />
//     </div>
//   }
// }

export function RangeInput({
  id,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const onRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="mb-4">
      <div className="font-bold">{id}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onRangeChange}
      />
    </div>
  );
}

// module ButtonInput = {
//   @react.component
//   let make = (~onClick, ~id) => {
//     <div className="mb-4">
//       <Buttons.Button key={id} onClick={_ => onClick()} state=#Ready size=#Small color=#Blue>
//         {React.string(id)}
//       </Buttons.Button>
//     </div>
//   }
// }

export function ButtonInput({
  onClick,
  id,
}: {
  onClick: () => void;
  id: string;
}) {
  return (
    <div className="mb-4">
      <button onClick={onClick}>{id}</button>
    </div>
  );
}

// module Text = {
//   @react.component
//   let make = (~text) => {
//     <div className="mb-4">
//       <p> {React.string(text)} </p>
//     </div>
//   }
// }

export function Text({ text }: { text: string }) {
  return (
    <div className="mb-4">
      <p>{text}</p>
    </div>
  );
}

// @react.component
// let Inputs = (~model: Builder.Model.t, ~onChange) => {
//   let onTextureChange = (
//     id: string,
//     standardWidth: int,
//     standardHeight: int,
//     image: option<Dom2.Image.t>,
//   ) => {
//     switch image {
//     | None => {
//         let model = Builder.clearTexture(model, id)
//         onChange(model)
//       }
//     | Some(image) => {
//         let texture = Generator_Texture.make(image, standardWidth, standardHeight)
//         let model = Builder.addTexture(model, id, texture)
//         onChange(model)
//       }
//     }
//   }

//   let onStringInputChange = (id: string, value: string) => {
//     let model = Builder.setStringInputValue(model, id, value)
//     onChange(model)
//   }

//   let onBooleanInputChange = (id: string, isChecked) => {
//     let model = Builder.setBooleanInputValue(model, id, isChecked)
//     onChange(model)
//   }

//   let onSelectInputChange = (id: string, value) => {
//     let model = Builder.setSelectInputValue(model, id, value)
//     onChange(model)
//   }

//   let onRangeInputChange = (id: string, value) => {
//     let model = Builder.setRangeInputValue(model, id, value)
//     onChange(model)
//   }

//   let onButtonInputClick = () => {
//     onChange(Generator.getModel())
//   }

//   if Js.Array2.length(model.inputs) > 0 {
//     <div className="bg-gray-100 p-4 mb-8 rounded">
//       {Js.Array2.map(model.inputs, input => {
//         switch input {
//         | Text(id, text) => <Text key={id} text={text} />
//         | RegionInput(_, _, _) => React.null
//         | CustomStringInput(id, f) => <div key={id}> {f(onStringInputChange(id))} </div>
//         | TextureInput(id, {standardWidth, standardHeight, choices}) =>
//           <TextureInput
//             key={id}
//             id={id}
//             choices={choices}
//             textures={model.values.textures}
//             onChange={onTextureChange(id, standardWidth, standardHeight)}
//           />
//         | BooleanInput(id) => {
//             let checked = Builder.getBooleanInputValue(model, id)
//             <BooleanInput key={id} id={id} onChange={onBooleanInputChange(id)} checked={checked} />
//           }
//         | SelectInput(id, options) => {
//             let value = Builder.getSelectInputValue(model, id)
//             <SelectInput
//               key={id} id={id} options={options} value onChange={onSelectInputChange(id)}
//             />
//           }
//         | ButtonInput(id, onClick) =>
//           <ButtonInput
//             key={id}
//             id={id}
//             onClick={() => {
//               onClick()
//               onButtonInputClick()
//             }}
//           />
//         | RangeInput(id, options) => {
//             let value = Builder.getRangeInputValue(model, id)
//             <RangeInput
//               key={id}
//               id={id}
//               min={options.min}
//               max={options.max}
//               step={options.step}
//               value
//               onChange={onRangeInputChange(id)}
//             />
//           }
//         }
//       })->React.array}
//     </div>
//   } else {
//     React.null
//   }
// }

export function Inputs({
  model,
  onChange,
}: {
  model: Model;
  onChange: (model: Model) => void;
}) {
  const onTextureChange = (
    id: string,
    standardWidth: number,
    standardHeight: number,
    image: HTMLImageElement | null
  ) => {
    if (image) {
      const texture = makeTextureFromImage(
        image,
        standardWidth,
        standardHeight
      );
      const newModel = addTexture(model, id, texture);
      onChange(newModel);
    } else {
      const newModel = clearTexture(model, id);
      onChange(newModel);
    }
  };

  const onStringInputChange = (id: string, value: string) => {
    const newModel = setStringInputValue(model, id, value);
    onChange(newModel);
  };

  const onBooleanInputChange = (id: string, isChecked: boolean) => {
    const newModel = setBooleanInputValue(model, id, isChecked);
    onChange(newModel);
  };

  const onSelectInputChange = (id: string, value: string) => {
    const newModel = setSelectInputValue(model, id, value);
    onChange(newModel);
  };

  const onRangeInputChange = (id: string, value: number) => {
    const newModel = setRangeInputValue(model, id, value);
    onChange(newModel);
  };

  const onButtonInputClick = () => {
    // TODO
    // onChange({ ...model, ...makeModel() });
  };

  return (
    <div className="bg-gray-100 p-4 mb-8 rounded">
      {model.inputs.map((input) => {
        switch (input.kind) {
          case "Text":
            return <Text key={input.id} text={input.text} />;
          case "RegionInput":
            return null;
          case "CustomStringInput":
            return (
              <div key={input.id}>
                {input.render((value: string) => {
                  onStringInputChange(input.id, value);
                })}
              </div>
            );
          case "TextureInput":
            return (
              <TextureInput
                key={input.id}
                id={input.id}
                choices={input.choices}
                textures={model.values.textures}
                onChange={(image) =>
                  onTextureChange(
                    input.id,
                    input.standardWidth,
                    input.standardHeight,
                    image
                  )
                }
              />
            );
          case "BooleanInput":
            const checked = getBooleanInputValue(model, input.id);
            return (
              <BooleanInput
                key={input.id}
                id={input.id}
                onChange={(value) => {
                  onBooleanInputChange(input.id, value);
                }}
                checked={checked}
              />
            );
          case "SelectInput":
            const value = getSelectInputValue(model, input.id);
            return (
              <SelectInput
                key={input.id}
                id={input.id}
                options={input.options}
                value={value}
                onChange={(value) => onSelectInputChange(input.id, value)}
              />
            );
          case "ButtonInput":
            return (
              <ButtonInput
                key={input.id}
                id={input.id}
                onClick={() => {
                  input.onClick();
                  onButtonInputClick();
                }}
              />
            );
          case "RangeInput":
            return (
              <RangeInput
                key={input.id}
                id={input.id}
                min={input.min}
                max={input.max}
                step={input.step}
                value={input.value}
                onChange={(value) => onRangeInputChange(input.id, value)}
              />
            );
        }
      })}
    </div>
  );
}
