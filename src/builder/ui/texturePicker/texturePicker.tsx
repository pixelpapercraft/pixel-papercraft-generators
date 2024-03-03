import React from "react";
import { Button } from "@genroot/builder/ui/button/button";
import { ArrowPathIcon, XMarkIcon } from "@genroot/builder/ui/icon";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type TextureFrame,
  makeFrameLabel,
} from "@genroot/builder/modules/textureData";
import {
  type Rotation,
  makeNextRotation,
  rotationToDegrees,
} from "@genroot/builder/ui/texturePicker/rotation";
import { type SelectedTexture } from "./selectedTexture";

function px(n: number): string {
  return n + "px";
}

function deg(n: number): string {
  return n + "deg";
}

function makeBackgroundImage(url: string): string {
  return "url(" + url + ")";
}

function makeBackgroundPosition(x: number, y: number): string {
  return px(x) + " " + px(y);
}

function makeBackgroundSize(x: number, y: number): string {
  return px(x) + " " + px(y);
}

function makeBorder(size: number, style: string, color: string): string {
  return px(size) + " " + style + " " + color;
}

function makeMargin(t: number, r: number, b: number, l: number): string {
  return px(t) + " " + px(r) + " " + px(b) + " " + px(l);
}

// https://tailwindcss.com/docs/background-color
const bgGray200 = "rgb(229 231 235)";
const bgGray400 = "rgb(156 163 175)";

const borderSize = 4;

function makeTileBaseStyle(isSelected: boolean, tileSize: number) {
  const borderColor = isSelected ? bgGray400 : bgGray200;
  return {
    border: makeBorder(borderSize, `solid`, borderColor),
    width: px(tileSize + borderSize * 2),
    height: px(tileSize + borderSize * 2),
  };
}

function makeTileStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  isSelected: boolean,
  isHover: boolean,
  tileSize: number
) {
  const [x, y, width, height] = frame.rectangle;
  const widthScale = tileSize / width;
  const heightScale = tileSize / height;

  const baseStyle = makeTileBaseStyle(isSelected || isHover, tileSize);

  const backgroundStyle = {
    backgroundImage: makeBackgroundImage(textureDef.url),
    backgroundPosition: makeBackgroundPosition(
      -x * widthScale,
      -y * heightScale
    ),
    backgroundRepeat: "no-repeat",
    backgroundSize: makeBackgroundSize(
      textureDef.standardWidth * widthScale,
      textureDef.standardHeight * heightScale
    ),
    imageRendering: "pixelated" as const,
  };

  return { ...baseStyle, ...backgroundStyle };
}

function TileButton({
  textureDef,
  frame,
  isSelected,
  onClick,
}: {
  textureDef: TextureDef;
  frame: TextureFrame;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHover, setIsHover] = React.useState(false);
  const label = makeFrameLabel(frame);
  const tileStyle = makeTileStyle(textureDef, frame, isSelected, isHover, 32);
  const buttonStyle = {
    margin: makeMargin(0, borderSize, borderSize, 0),
  };
  const style = { ...tileStyle, ...buttonStyle };
  return (
    <button
      title={label}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
}

export function Search({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    onChange(value);
  };
  return (
    <div className="relative flex items-center mb-4">
      <input
        className="border w-full p-2"
        placeholder="Search ..."
        value={value}
        onChange={onInputChange}
      />
      <button className="absolute right-2" onClick={onClear}>
        <XMarkIcon color="Gray500" />
      </button>
    </div>
  );
}

export function Preview({
  textureDef,
  frame,
  rotation,
}: {
  textureDef: TextureDef;
  frame: TextureFrame | null;
  rotation: Rotation;
}) {
  if (!frame) {
    return (
      <div className="flex flex-col items-center" style={{ width: "148px" }}>
        <div style={makeTileBaseStyle(false, 128)} />
      </div>
    );
  }

  const rotationDegrees = rotationToDegrees(rotation);

  const tileStyle = makeTileStyle(textureDef, frame, false, false, 128);

  const rotationStyle = {
    transform: `rotate(${deg(rotationDegrees)})`,
  };

  const style = { ...tileStyle, ...rotationStyle };

  return (
    <div className="flex flex-col items-center" style={{ width: "148px" }}>
      <div style={style}></div>
      <div className="text-center text-gray-500 p-2 pt-0">
        {makeFrameLabel(frame)}
      </div>
    </div>
  );
}

export function RotationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="Small" onClick={onClick}>
      <ArrowPathIcon color="White" />
    </Button>
  );
}

export function TexturePicker({
  textureDef,
  frames,
  onSelect,
  enableRotation,
}: {
  textureDef: TextureDef;
  frames: TextureFrame[];
  onSelect: (selectedTexture: SelectedTexture) => void;
  enableRotation: boolean;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedFrame, setSelectedFrame] = React.useState<TextureFrame | null>(
    null
  );

  const [rotation, setRotation] = React.useState<Rotation>("Rot0");

  const framesFiltered = search
    ? frames.filter((frame) => frame.name.includes(search))
    : frames;

  const onRotateClick = () => {
    const nextRotation = makeNextRotation(rotation);
    setRotation(nextRotation);
    if (selectedFrame) {
      const selectedTexture: SelectedTexture = {
        textureDefId: textureDef.id,
        frame: selectedFrame,
        rotation: nextRotation,
      };
      onSelect(selectedTexture);
    }
  };

  const onSelectClick = (frame: TextureFrame) => {
    setSelectedFrame(frame);
    const selectedTexture = {
      textureDefId: textureDef.id,
      frame: frame,
      rotation: rotation,
    };
    onSelect(selectedTexture);
  };

  return (
    <div>
      <Search
        value={search}
        onChange={(value) => {
          setSearch(value);
        }}
        onClear={() => {
          setSearch("");
        }}
      />
      <div className="flex">
        <div className="overflow-y-auto h-60 w-full">
          {framesFiltered.map((frame) => {
            const isSelected = selectedFrame
              ? frame.id === selectedFrame.id
              : false;
            return (
              <TileButton
                key={frame.id}
                textureDef={textureDef}
                frame={frame}
                isSelected={isSelected}
                onClick={() => {
                  onSelectClick(frame);
                }}
              />
            );
          })}
        </div>
        <div>
          <Preview
            textureDef={textureDef}
            frame={selectedFrame}
            rotation={rotation}
          />
          {enableRotation ? (
            <div className="flex justify-center mt-4">
              <RotationButton onClick={() => onRotateClick()} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
