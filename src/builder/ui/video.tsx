import { type VideoDef } from "@genroot/builder/modules/generatorDef";

export function Video({ video }: { video: VideoDef }) {
  return (
    <div style={{ maxWidth: "640px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          paddingTop: "56.25%",
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
          }}
          src={video.url}
          allowFullScreen
        />
      </div>
    </div>
  );
}
