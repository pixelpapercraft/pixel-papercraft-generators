import { Engine } from "./engine";
import { Model } from "./model";
import { Values } from "./modelValues";

/**
 * A real `Engine` instance backed by an empty `Model`/`Values`, for use in
 * tests. Both constructors are trivial and side-effect-free, so this needs no
 * hand-written stub of `Engine`'s public methods and no type assertion.
 *
 * Spy on whichever methods a test needs with `vi.spyOn(generator, "method")`.
 */
export function makeFakeEngine(): Engine {
  return new Engine(new Model(new Values()));
}
