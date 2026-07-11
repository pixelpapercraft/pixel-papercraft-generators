import React from "react";

import { type Texture } from "@genroot/builder/modules/texture";
import { type Model } from "@genroot/builder/modules/model";
import { type Control } from "@genroot/builder/modules/modelControls";
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

  const renderControl = (
    control: Control,
    { inRow = false }: { inRow?: boolean } = {}
  ): React.ReactNode => {
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
            inRow={inRow}
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
        const value = model.getNumberVariable(control.id) ?? control.value;
        return (
          <RangeControl
            key={control.id}
            id={control.id}
            min={control.min}
            max={control.max}
            step={control.step}
            value={value}
            showValue={control.showValue}
            onChange={(value) => onRangeInputChange(control.id, value)}
          />
        );
      }
      case "InputRowStart":
      case "InputRowEnd": {
        return null;
      }
    }
  };

  const renderControls = () => {
    const renderedControls: React.ReactNode[] = [];

    for (let index = 0; index < model.controls.length; index += 1) {
      const control = model.controls[index];
      if (!control) {
        continue;
      }

      if (control.kind === "InputRowEnd") {
        continue;
      }

      if (control.kind !== "InputRowStart") {
        renderedControls.push(renderControl(control));
        continue;
      }

      const rowControls: Control[] = [];
      index += 1;
      while (index < model.controls.length) {
        const rowControl = model.controls[index];
        if (!rowControl || rowControl.kind === "InputRowEnd") {
          break;
        }
        rowControls.push(rowControl);
        index += 1;
      }

      const rowKey = rowControls.map((rowControl) => rowControl.id).join("|");
      const rowHasBoolean = rowControls.some(
        (rowControl) => rowControl.kind === "BooleanInput"
      );
      const rowHasNonBoolean = rowControls.some(
        (rowControl) => rowControl.kind !== "BooleanInput"
      );
      const rowHasMixedBooleanControls = rowHasBoolean && rowHasNonBoolean;

      renderedControls.push(
        <div key={rowKey} className="flex flex-wrap items-center">
          {rowControls.map((rowControl, rowControlIndex) => {
            const nextRowControl = rowControls[rowControlIndex + 1];
            const hasWideGapAfter =
              nextRowControl !== undefined &&
              !(
                rowControl.kind === "Button" && nextRowControl.kind === "Button"
              );

            return (
              <div
                key={`${rowControl.id ?? rowControl.kind}-${rowControlIndex}`}
                className={hasWideGapAfter ? "mr-5" : undefined}
              >
                {renderControl(rowControl, {
                  inRow: rowHasMixedBooleanControls,
                })}
              </div>
            );
          })}
        </div>
      );
    }

    return renderedControls;
  };

  return <div className="w-full bg-gray-100 p-8 mb-8">{renderControls()}</div>;
}
