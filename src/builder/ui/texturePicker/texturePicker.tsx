import React from "react";
import { Button } from "@genroot/builder/ui/button/button";
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  BackspaceIcon,
  XMarkIcon,
} from "@genroot/builder/ui/icon";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import {
  type Flip,
  flipToTransform,
  makeNextFlip,
} from "./flip";
import {
  type Rotation,
  makeNextRotation,
  rotationToDegrees,
} from "./rotation";
import { type SelectedTexture } from "./selectedTexture";
import { shouldClearSelectedFrame } from "./selectionState";

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

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, " ");
}

const bgGray200 = "rgb(229 231 235)";
const bgGray400 = "rgb(156 163 175)";
const borderSize = 4;

function makeTileBaseStyle(isSelected: boolean, tileSize: number) {
  const borderColor = isSelected ? bgGray400 : bgGray200;
  return {
    border: makeBorder(borderSize, "solid", borderColor),
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
  const tileStyle = makeTileStyle(textureDef, frame, isSelected, isHover, 32);
  const buttonStyle = {
    margin: makeMargin(0, borderSize, borderSize, 0),
  };
  const style = { ...tileStyle, ...buttonStyle };
  return (
    <button
      title={frame.label}
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
        placeholder="Search..."
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
  flip,
  blend,
}: {
  textureDef: TextureDef;
  frame: TextureFrame | null;
  rotation: Rotation;
  flip: Flip;
  blend: string | null;
}) {
  if (!frame) {
    return (
      <div className="flex flex-col items-center" style={{ width: "148px" }}>
        <div style={makeTileBaseStyle(false, 128)} />
      </div>
    );
  }

  const rotationDegrees = rotationToDegrees(rotation);
  const flipTransform = flipToTransform(flip);
  const tileStyle = makeTileStyle(textureDef, frame, false, false, 128);
  const tintStyle = blend
    ? {
        backgroundColor: blend,
        backgroundBlendMode: "multiply" as const,
      }
    : undefined;
  const transform = `rotate(${deg(rotationDegrees)}) ${flipTransform}`.trim();
  const style = { ...tileStyle, ...tintStyle, transform };

  return (
    <div
      className="flex flex-col items-center"
      data-testid="texture-picker-preview"
      style={{ width: "148px" }}
    >
      <div style={style}></div>
      <div className="text-center text-gray-500 p-2 pt-0">{frame.label}</div>
    </div>
  );
}

export function EraseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button title="Erase texture" color="Red" size="Small" onClick={onClick}>
      <BackspaceIcon color="White" />
    </Button>
  );
}

export function RotationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button title="Rotate texture" color="Blue" size="Small" onClick={onClick}>
      <ArrowPathIcon color="White" />
    </Button>
  );
}

export function FlipHorizontalButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      title="Flip texture horizontal"
      color="Green"
      size="Small"
      onClick={onClick}
    >
      <ArrowsRightLeftIcon color="White" />
    </Button>
  );
}

export function FlipVerticalButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      title="Flip texture vertical"
      color="Green"
      size="Small"
      onClick={onClick}
    >
      <ArrowsUpDownIcon color="White" />
    </Button>
  );
}

export function TexturePicker({
  textureDef,
  frames,
  onSelect,
  enableErase = true,
  blend,
}: {
  textureDef: TextureDef;
  frames: TextureFrame[];
  onSelect: (selectedTexture: SelectedTexture) => void;
  enableErase?: boolean;
  blend?: string | null;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedFrame, setSelectedFrame] = React.useState<TextureFrame | null>(
    null
  );
  const [rotation, setRotation] = React.useState<Rotation>("Rot0");
  const [flip, setFlip] = React.useState<Flip>("None");

  React.useEffect(() => {
    if (!shouldClearSelectedFrame(selectedFrame, frames)) {
      return;
    }

    setSelectedFrame(null);
    setRotation("Rot0");
    setFlip("None");
  }, [frames, selectedFrame]);

  const searchLower = normalizeSearchText(search);
  const framesFiltered = searchLower
    ? frames.filter((frame) =>
        normalizeSearchText(frame.label).includes(searchLower)
      )
    : frames;

  const onEraseClick = () => {
    setRotation("Rot0");
    setFlip("None");
    setSelectedFrame(null);
    onSelect({
      textureDefId: "",
      frame: {
        id: "",
        label: "",
        rectangle: [0, 0, 0, 0],
        crop: [0, 0, 0, 0],
      },
      rotation: "Rot0",
      flip: "None",
      blend: null,
    });
  };

  const onRotateClick = () => {
    const nextRotation = makeNextRotation(rotation);
    setRotation(nextRotation);
    if (selectedFrame) {
      onSelect({
        textureDefId: textureDef.id,
        frame: selectedFrame,
        rotation: nextRotation,
        flip,
        blend: blend ?? null,
      });
    }
  };

  const onFlipHorizontalClick = () => {
    const [nextFlip, nextRotation] = makeNextFlip(flip, "Horizontal", rotation);
    setFlip(nextFlip);
    setRotation(nextRotation);
    if (selectedFrame) {
      onSelect({
        textureDefId: textureDef.id,
        frame: selectedFrame,
        rotation: nextRotation,
        flip: nextFlip,
        blend: blend ?? null,
      });
    }
  };

  const onFlipVerticalClick = () => {
    const [nextFlip, nextRotation] = makeNextFlip(flip, "Vertical", rotation);
    setFlip(nextFlip);
    setRotation(nextRotation);
    if (selectedFrame) {
      onSelect({
        textureDefId: textureDef.id,
        frame: selectedFrame,
        rotation: nextRotation,
        flip: nextFlip,
        blend: blend ?? null,
      });
    }
  };

  const onSelectClick = (frame: TextureFrame) => {
    setSelectedFrame(frame);
    setRotation("Rot0");
    setFlip("None");
    onSelect({
      textureDefId: textureDef.id,
      frame,
      rotation: "Rot0",
      flip: "None",
      blend: blend ?? null,
    });
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
            flip={flip}
            blend={blend ?? null}
          />
          <div>
            <div className="flex justify-around mt-3">
              {enableErase ? <EraseButton onClick={() => onEraseClick()} /> : null}
              <RotationButton onClick={() => onRotateClick()} />
            </div>
            <div className="flex justify-around mt-3">
              <FlipHorizontalButton onClick={() => onFlipHorizontalClick()} />
              <FlipVerticalButton onClick={() => onFlipVerticalClick()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
