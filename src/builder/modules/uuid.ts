import { v4 } from "uuid";

export function makeUUID(): string {
  return v4();
}
