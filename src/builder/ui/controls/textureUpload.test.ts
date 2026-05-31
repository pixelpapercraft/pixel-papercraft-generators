import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isSupportedTextureUploadFile,
  loadTextureUploadFile,
  textureUploadAccept,
} from "./textureUpload";

describe("textureUpload", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("matches the accepted upload picker file types", () => {
    expect(textureUploadAccept).toBe("image/png,image/jpeg,.png,.jpg,.jpeg");
  });

  it("accepts png and jpeg uploads by type or file extension", () => {
    expect(
      isSupportedTextureUploadFile(
        new File([""], "texture.bin", { type: "image/png" })
      )
    ).toBe(true);
    expect(
      isSupportedTextureUploadFile(
        new File([""], "texture.bin", { type: "image/jpeg" })
      )
    ).toBe(true);
    expect(isSupportedTextureUploadFile(new File([""], "texture.PNG"))).toBe(
      true
    );
    expect(isSupportedTextureUploadFile(new File([""], "texture.jpg"))).toBe(
      true
    );
    expect(isSupportedTextureUploadFile(new File([""], "texture.jpeg"))).toBe(
      true
    );
  });

  it("rejects unsupported uploads", () => {
    expect(
      isSupportedTextureUploadFile(
        new File([""], "texture.gif", { type: "image/gif" })
      )
    ).toBe(false);
    expect(
      isSupportedTextureUploadFile(new File([""], "texture.txt"))
    ).toBe(false);
  });

  it("preserves the uploaded file name on the loaded texture image", async () => {
    class MockImage {
      name = "";
      onload: ((event: Event) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      width = 16;
      height = 16;

      set src(_url: string) {
        queueMicrotask(() => this.onload?.(new Event("load")));
      }
    }

    const drawImage = vi.fn();
    vi.stubGlobal("Image", MockImage);
    vi.stubGlobal("document", {
      createElement: vi.fn(() => ({
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({ drawImage })),
      })),
    });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:texture");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    const texture = await loadTextureUploadFile(
      new File([""], "custom-texture.png", { type: "image/png" }),
      32,
      64
    );

    expect(texture.standardWidth).toBe(32);
    expect(texture.standardHeight).toBe(64);
    expect(texture.imageWithCanvas.image.name).toBe("custom-texture.png");
    expect(drawImage).toHaveBeenCalledWith(texture.imageWithCanvas.image, 0, 0);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:texture");
  });
});
