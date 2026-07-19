import React from "react";

import { type Texture } from "@genroot/builder/modules/texture";
import { type Model } from "@genroot/builder/modules/model";
import { TextureControl } from "./textureControl";
import { AtlasControl } from "./atlasControl";
import { BooleanControl } from "./booleanControl";
import { SelectControl } from "./selectControl";
import { RangeControl } from "./rangeControl";
import { ButtonControl } from "./buttonControl";
import { TextControl } from "./textControl";
import { MinecraftSkinControl } from "./minecraftSkinControl";
import {
  getDefaultMinecraftSkinInputValue,
  getMinecraftSkinInputValueKey,
  parseMinecraftSkinInputValue,
  serializeMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "@genroot/builder/modules/minecraftSkinInputValue";

export function Controls({
  model,
  onChange,
}: {
  model: Model;
  onChange: (model: Model) => void;
}) {
  const onTextureChange = (id: string, texture: Texture | null) => {
    if (texture) {
      model.addTexture(id, texture);
    } else {
      model.removeTexture(id);
    }
    onChange(model);
  };

  const onAtlasChange = (
    id: string,
    texture: Texture | null,
    frames: string | null
  ) => {
    if (texture) {
      model.addTexture(id, texture);
      model.setStringVariable(`${id} Frames`, frames ?? "");
    } else {
      model.removeTexture(id);
      model.setStringVariable(`${id} Frames`, "");
    }
    onChange(model);
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

  const onMinecraftSkinInputValueChange = (
    id: string,
    value: MinecraftSkinInputValue
  ) => {
    model.setStringVariable(
      getMinecraftSkinInputValueKey(id),
      serializeMinecraftSkinInputValue(value)
    );
    onChange(model);
  };

  const onButtonControlClick = () => {
    onChange(model);
  };

  return (
    <div className="w-full bg-gray-100 p-8 mb-8">
      {model.controls.map((control) => {
        switch (control.kind) {
          case "Text": {
            return <TextControl key={control.id} text={control.text} />;
          }
          case "Region": {
            // Regions are handled in the page rendering code
            return null;
          }
          case "CustomInput": {
            return (
              <div key={control.id}>
                {control.render((value: string) => {
                  onStringInputChange(control.id, value);
                })}
              </div>
            );
          }
          case "TextureInput": {
            return (
              <TextureControl
                key={control.id}
                id={control.id}
                label={control.props.label}
                choices={control.props.choices}
                standardWidth={control.props.standardWidth}
                standardHeight={control.props.standardHeight}
                textures={model.values.textures}
                onChange={(texture) => onTextureChange(control.id, texture)}
              />
            );
          }
          case "AtlasInput": {
            return (
              <AtlasControl
                key={control.id}
                id={control.id}
                label={control.props.label}
                choices={control.props.choices}
                standardWidth={control.props.standardWidth}
                standardHeight={control.props.standardHeight}
                textures={model.values.textures}
                onChange={(texture, frames) =>
                  onAtlasChange(control.id, texture, frames)
                }
              />
            );
          }
          case "MinecraftSkinInput": {
            const storedValue = parseMinecraftSkinInputValue(
              model.getStringVariable(getMinecraftSkinInputValueKey(control.id))
            );
            const value =
              storedValue ??
              getDefaultMinecraftSkinInputValue(control.props.options);

            return (
              <MinecraftSkinControl
                key={control.id}
                id={control.id}
                options={control.props.options}
                standardWidth={control.props.standardWidth}
                standardHeight={control.props.standardHeight}
                showModelType={control.props.showModelType}
                value={value}
                textures={model.values.textures}
                onValueChange={(nextValue) =>
                  onMinecraftSkinInputValueChange(control.id, nextValue)
                }
                onChange={(texture) => onTextureChange(control.id, texture)}
              />
            );
          }
          case "BooleanInput": {
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
          }
          case "SelectInput": {
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
          }
          case "Button": {
            return (
              <ButtonControl
                key={control.id}
                id={control.id}
                color={control.color}
                onClick={() => {
                  control.onClick();
                  onButtonControlClick();
                }}
              />
            );
          }
          case "Range": {
            return (
              <RangeControl
                key={control.id}
                id={control.id}
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                showValue={control.showValue}
                onChange={(value) => onRangeInputChange(control.id, value)}
              />
            );
          }
        }
      })}
    </div>
  );
}
