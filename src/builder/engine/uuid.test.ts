import { describe, expect, it } from "vitest";
import { makeUUID } from "./uuid";

// RFC 4122 version 4: fixed version nibble "4", variant nibble in [8, 9, a, b].
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("makeUUID", () => {
  it("returns a 36-character RFC 4122 v4 UUID string", () => {
    const id = makeUUID();
    expect(id).toHaveLength(36);
    expect(id).toMatch(UUID_V4_PATTERN);
  });

  it("returns a different value on every call", () => {
    const ids = Array.from({ length: 20 }, () => makeUUID());
    expect(new Set(ids).size).toBe(ids.length);
  });
});
