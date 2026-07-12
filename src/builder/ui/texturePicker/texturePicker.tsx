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
import { type Rotation, makeNextRotation, rotationToDegrees } from "./rotation";
import { type Flip, makeNextFlip, flipToTransform } from "./flip";
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

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, " ");
}

const bgGray200 = "rgb(229 231 235)";
const bgGray400 = "rgb(156 163 175)";
export const texturePickerBorderSize = 4;

export type TexturePreviewSourceFrame = {
  rectangle: readonly [number, number, number, number];
  logicalFrameSize: number;
};

function scalePreviewSource(
  sourceFrame: TexturePreviewSourceFrame,
  frame: TextureFrame
): [number, number, number, number] {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = sourceFrame.rectangle;
  const [, , frameWidth, frameHeight] = frame.rectangle;
  const scale =
    frameWidth === frameHeight &&
    frameWidth > 0 &&
    frameWidth % sourceFrame.logicalFrameSize === 0 &&
    frameHeight % sourceFrame.logicalFrameSize === 0
      ? frameWidth / sourceFrame.logicalFrameSize
      : 1;

  return [
    sourceX * scale,
    sourceY * scale,
    sourceWidth * scale,
    sourceHeight * scale,
  ];
}

function makePreviewSourceRegion(
  frame: TextureFrame,
  sourceFrame?: TexturePreviewSourceFrame
): [number, number, number, number] {
  const [frameX, frameY, frameWidth, frameHeight] = frame.rectangle;
  if (!sourceFrame) {
    return [frameX, frameY, frameWidth, frameHeight];
  }

  const [sourceX, sourceY, sourceWidth, sourceHeight] = scalePreviewSource(
    sourceFrame,
    frame
  );
  return [frameX + sourceX, frameY + sourceY, sourceWidth, sourceHeight];
}

function makePreviewSize(
  frame: TextureFrame,
  height: number,
  sourceFrame?: TexturePreviewSourceFrame
): { width: number; height: number } {
  if (!sourceFrame) {
    return { width: height, height };
  }

  const [, , sourceWidth, sourceHeight] = makePreviewSourceRegion(
    frame,
    sourceFrame
  );
  return {
    width: (sourceWidth / sourceHeight) * height,
    height,
  };
}

export function makeTileBaseStyle(
  isSelected: boolean,
  width: number,
  height = width
) {
  const borderColor = isSelected ? bgGray400 : bgGray200;
  return {
    border: makeBorder(texturePickerBorderSize, "solid", borderColor),
    width: px(width + texturePickerBorderSize * 2),
    height: px(height + texturePickerBorderSize * 2),
  };
}

function makeTileStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  isSelected: boolean,
  isHover: boolean,
  tileSize: number,
  sourceFrame?: TexturePreviewSourceFrame
) {
  const [x, y, width, height] = makePreviewSourceRegion(frame, sourceFrame);
  const previewSize = makePreviewSize(frame, tileSize, sourceFrame);
  const sourceScaleX = previewSize.width / width;
  const sourceScaleY = previewSize.height / height;

  const baseStyle = makeTileBaseStyle(
    isSelected || isHover,
    previewSize.width,
    previewSize.height
  );
  const backgroundStyle = {
    backgroundImage: makeBackgroundImage(textureDef.url),
    backgroundPosition: makeBackgroundPosition(
      -x * sourceScaleX,
      -y * sourceScaleY
    ),
    backgroundRepeat: "no-repeat",
    backgroundSize: makeBackgroundSize(
      textureDef.standardWidth * sourceScaleX,
      textureDef.standardHeight * sourceScaleY
    ),
    backgroundColor: "white",
    imageRendering: "pixelated" as const,
  };

  return { ...baseStyle, ...backgroundStyle };
}

export function makeTextureTintMaskStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  tileSize: number,
  blend: string | null,
  sourceFrame?: TexturePreviewSourceFrame
): React.CSSProperties | undefined {
  if (!blend) {
    return undefined;
  }

  const [x, y, width, height] = makePreviewSourceRegion(frame, sourceFrame);
  const previewSize = makePreviewSize(frame, tileSize, sourceFrame);
  const sourceScaleX = previewSize.width / width;
  const sourceScaleY = previewSize.height / height;
  const maskImage = makeBackgroundImage(textureDef.url);
  const maskPosition = makeBackgroundPosition(
    -x * sourceScaleX,
    -y * sourceScaleY
  );
  const maskSize = makeBackgroundSize(
    textureDef.standardWidth * sourceScaleX,
    textureDef.standardHeight * sourceScaleY
  );

  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    backgroundColor: blend,
    mixBlendMode: "multiply",
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskPosition: maskPosition,
    maskPosition,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: maskSize,
    maskSize,
  };
}

export function TextureFramePreview({
  textureDef,
  frame,
  size,
  blend,
  sourceFrame,
}: {
  textureDef: TextureDef;
  frame: TextureFrame;
  size: number;
  blend: string | null;
  sourceFrame?: TexturePreviewSourceFrame;
}) {
  const [x, y, , height] = makePreviewSourceRegion(frame, sourceFrame);
  const sourceScale = size / height;
  const previewSize = makePreviewSize(frame, size, sourceFrame);
  const tintMaskStyle = makeTextureTintMaskStyle(
    textureDef,
    frame,
    size,
    blend,
    sourceFrame
  );
  const style: React.CSSProperties = {
    position: "relative",
    width: previewSize.width,
    height: previewSize.height,
    overflow: "hidden",
    imageRendering: "pixelated",
    backgroundImage: makeBackgroundImage(textureDef.url),
    backgroundPosition: makeBackgroundPosition(
      -x * sourceScale,
      -y * sourceScale
    ),
    backgroundRepeat: "no-repeat",
    backgroundSize: makeBackgroundSize(
      textureDef.standardWidth * sourceScale,
      textureDef.standardHeight * sourceScale
    ),
  };

  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={previewSize}
    >
      <div style={style}>
        {tintMaskStyle ? <div style={tintMaskStyle} /> : null}
      </div>
    </div>
  );
}

export function TileButton({
  title,
  textureDef,
  frame,
  isSelected,
  onClick,
  previewSize = 32,
  blend = null,
  sourceFrame,
}: {
  title?: string;
  textureDef: TextureDef;
  frame: TextureFrame;
  isSelected: boolean;
  onClick: () => void;
  previewSize?: number;
  blend?: string | null;
  sourceFrame?: TexturePreviewSourceFrame;
}) {
  const [isHover, setIsHover] = React.useState(false);
  const tileStyle = makeTileStyle(
    textureDef,
    frame,
    isSelected,
    isHover,
    previewSize,
    sourceFrame
  );
  const tintMaskStyle = makeTextureTintMaskStyle(
    textureDef,
    frame,
    previewSize,
    blend,
    sourceFrame
  );
  const buttonStyle = {
    margin: makeMargin(0, texturePickerBorderSize, texturePickerBorderSize, 0),
  };
  const style: React.CSSProperties = {
    ...tileStyle,
    ...buttonStyle,
    position: "relative",
    overflow: "hidden",
  };
  return (
    <button
      title={title ?? frame.label}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {tintMaskStyle ? <div style={tintMaskStyle} /> : null}
    </button>
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
  const transform = `rotate(${deg(rotationDegrees)}) ${flipTransform}`.trim();
  const tintMaskStyle = makeTextureTintMaskStyle(textureDef, frame, 128, blend);
  const style: React.CSSProperties = {
    ...tileStyle,
    position: "relative",
    overflow: "hidden",
    transform,
  };

  return (
    <div
      className="flex flex-col items-center"
      data-testid="texture-picker-preview"
      style={{ width: "148px" }}
    >
      <div data-testid="texture-picker-preview-image" style={style}>
        {tintMaskStyle ? <div style={tintMaskStyle} /> : null}
      </div>
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
  blend: string | null;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedFrame, setSelectedFrame] = React.useState<TextureFrame | null>(
    null
  );
  const [rotation, setRotation] = React.useState<Rotation>("Rot0");
  const [flip, setFlip] = React.useState<Flip>("None");

  React.useEffect(() => {
    if (selectedFrame && !frames.some((frame) => frame.id === selectedFrame.id)) {
      setSelectedFrame(null);
      setRotation("Rot0");
      setFlip("None");
    }
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
        blend,
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
        blend,
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
        blend,
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
      blend,
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
                blend={blend}
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
            blend={blend}
          />
          <div>
            <div className="flex justify-around mt-3">
              {enableErase ? (
                <EraseButton onClick={() => onEraseClick()} />
              ) : null}
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
