import React from "react";

import { makeTextureFromImage } from "@/builder/modules/texture";
import { Model } from "@/builder/modules/model";
import { TextureControl } from "./textureControl";
import { BooleanControl } from "./booleanControl";
import { SelectControl } from "./selectControl";
import { RangeControl } from "./rangeControl";
import { ButtonControl } from "./buttonControl";
import { TextControl } from "./textControl";

export function Controls({
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
      model.addTexture(id, texture);
      onChange(model);
    } else {
      model.removeTexture(id);
      onChange(model);
    }
  };

  const onStringInputChange = (id: string, value: string) => {
    model.setStringVariable(id, value);
    onChange(model);
  };

  const onBooleanInputChange = (id: string, value: boolean) => {
    model.setBooleanVariable(id, value);
    onChange(model);
  };

  const onSelectInputChange = (id: string, value: string) => {
    model.setStringVariable(id, value);
    onChange(model);
  };

  const onRangeInputChange = (id: string, value: number) => {
    model.setNumberVariable(id, value);
    onChange(model);
  };

  const onButtonInputClick = () => {
    // TODO
    // onChange({ ...model, ...makeModel() });
  };

  return (
    <div className="bg-gray-100 p-4 mb-8 rounded">
      {model.controls.map((control) => {
        switch (control.kind) {
          case "Text":
            return <TextControl key={control.id} text={control.text} />;
          case "Region":
            return null;
          case "Custom":
            return (
              <div key={control.id}>
                {control.render((value: string) => {
                  onStringInputChange(control.id, value);
                })}
              </div>
            );
          case "Texture":
            return (
              <TextureControl
                key={control.id}
                id={control.id}
                choices={control.props.choices}
                textures={model.values.textures}
                onChange={(image) =>
                  onTextureChange(
                    control.id,
                    control.props.standardWidth,
                    control.props.standardHeight,
                    image
                  )
                }
              />
            );
          case "Boolean":
            const checked = model.getBooleanVariable(control.id) ?? false;
            return (
              <BooleanControl
                key={control.id}
                id={control.id}
                onChange={(value) => {
                  onBooleanInputChange(control.id, value);
                }}
                checked={checked}
              />
            );
          case "Select":
            const value = model.getStringVariable(control.id) ?? "";
            return (
              <SelectControl
                key={control.id}
                id={control.id}
                options={control.options}
                value={value}
                onChange={(value) => onSelectInputChange(control.id, value)}
              />
            );
          case "Button":
            return (
              <ButtonControl
                key={control.id}
                id={control.id}
                onClick={() => {
                  control.onClick();
                  onButtonInputClick();
                }}
              />
            );
          case "Range":
            return (
              <RangeControl
                key={control.id}
                id={control.id}
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(value) => onRangeInputChange(control.id, value)}
              />
            );
        }
      })}
    </div>
  );
}
