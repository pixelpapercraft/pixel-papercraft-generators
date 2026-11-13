import { describe, expect, it } from "vitest";
import { userSchema } from "./minecraftSkin";

// The skin API returns many fields; only `textures.skin.data` is needed.
// These tests pin which responses the schema accepts and what it keeps.
describe("userSchema", () => {
  it("accepts a response with a skin texture and keeps only the texture data", () => {
    const parsed = userSchema.parse({
      uuid: "00000000-0000-0000-0000-000000000000",
      username: "Notch",
      textures: {
        skin: { url: "https://example.test/skin.png", data: "AAAA" },
        cape: { data: "BBBB" },
      },
    });
    expect(parsed).toEqual<typeof parsed>({
      textures: { skin: { data: "AAAA" } },
    });
  });

  it("rejects a response with no skin texture", () => {
    expect(
      userSchema.safeParse({ textures: { cape: { data: "BBBB" } } }).success
    ).toBe(false);
    expect(userSchema.safeParse({ textures: {} }).success).toBe(false);
    expect(userSchema.safeParse({}).success).toBe(false);
  });

  it("rejects a skin texture whose data is missing or not a string", () => {
    expect(userSchema.safeParse({ textures: { skin: {} } }).success).toBe(
      false
    );
    expect(
      userSchema.safeParse({ textures: { skin: { data: 12 } } }).success
    ).toBe(false);
    expect(
      userSchema.safeParse({ textures: { skin: { data: null } } }).success
    ).toBe(false);
  });

  it("rejects a response that is not an object", () => {
    expect(userSchema.safeParse(null).success).toBe(false);
    expect(userSchema.safeParse("skin").success).toBe(false);
  });
});
