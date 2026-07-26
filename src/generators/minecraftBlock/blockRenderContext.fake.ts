import { vi } from "vitest";
import { type BlockRenderContext } from "./blockRenderContext";

// A complete BlockRenderContext for tests: every member is implemented, so the
// fake satisfies the real type structurally instead of being cast past the
// checker. Each test overrides only the handful of methods it actually drives;
// a signature change to BlockRenderContext then fails here, once, rather than
// silently passing behind an `as unknown as` in every consumer.
export function makeBlockRenderContext(
  overrides: Partial<BlockRenderContext> = {}
): BlockRenderContext {
  return {
    defineSelectInput: vi.fn(),
    defineBooleanInput: vi.fn(),
    defineRegionInput: vi.fn(),
    getSelectInputValue: vi.fn(() => null),
    getBooleanInputValue: vi.fn(() => null),
    getStringInputValue: vi.fn(() => null),
    setStringInputValue: vi.fn(),
    drawImage: vi.fn(),
    drawTexture: vi.fn(),
    ...overrides,
  };
}
