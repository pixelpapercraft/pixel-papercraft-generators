import { Generator } from "./generator";
import { Model } from "./model";
import { Values } from "./modelValues";

/**
 * A real `Generator` instance backed by an empty `Model`/`Values`, for use in
 * tests. Both constructors are trivial and side-effect-free, so this needs no
 * hand-written stub of `Generator`'s public methods and no type assertion.
 *
 * Spy on whichever methods a test needs with `vi.spyOn(generator, "method")`.
 */
export function makeFakeGenerator(): Generator {
  return new Generator(new Model(new Values()));
}
