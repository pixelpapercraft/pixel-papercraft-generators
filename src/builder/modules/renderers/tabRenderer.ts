/**[x, y] */
type Point = [number, number];

/** [x, y, w, h] */
type Rectangle = [number, number, number, number];

function translatePoint([x, y]: Point, dx: number, dy: number): Point {
  return [x + dx, y + dy];
}

// module Angle = {
//   let toRadians = degrees => {
//     degrees *. (Js.Math._PI /. 180.0)
//   }
// }

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// module Orientation = {
//   type t = [#North | #South | #East | #West]
// }

type Orientation = "North" | "South" | "East" | "West";

// Normal
//
//        p3   p4
//    +---+-----+---+        ---
//    |  /       \  |         |
//    | /         \ |         | Actual tab height
//    |/           \|         |
//    +-------------+        ---
//    p1           p4
//
//
// Overflow
//
//     +---------+      ---
//     |         |       |
//     |         |       | Rectangle tab height
//     |         |       |
//     | p2 X p3 |       |    ---
//     |   / \   |       |     |
//     |  /   \  |       |     | Actual tab height
//     | /     \ |       |     |
//     |/       \|       |     |
//     +----+----+      ---   ---
//     p1        p4
//

// let drawTabNorth = (
//   rectangle: Builder.rectangle,
//   ~showFoldLine: bool=true,
//   ~tabAngle: float=45.0,
//   (),
// ) => {
//   let (x, y, w, h) = rectangle

//   let tabAngleRad = Angle.toRadians(tabAngle)

//       //
//       //    p2 ______ p3
//       //      /|    |\
//       //     / |    | \
//       // p1 +--|----|--+ p4
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (0.0, h)
//       let p2 = (0.0 +. inset, h -. tabHeight)
//       let p3 = (w -. inset, h -. tabHeight)
//       let p4 = (w, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
// }

function drawTabNorth(
  rectangle: Rectangle,
  showFoldLine: boolean = true,
  tabAngle: number = 45
) {
  const [x, y, w, h] = rectangle;

  const tabAngleRad = toRadians(tabAngle);

  const maxInset = w / 2;

  let inset = h / Math.tan(tabAngleRad);
  let tabHeight = 0;

  [inset, tabHeight] =
    inset > maxInset
      ? [maxInset, Math.tan(tabAngleRad) * maxInset]
      : [inset, h];

  let p1: Point = [0, h];
  let p2: Point = [0 + inset, h - tabHeight];
  let p3: Point = [w - inset, h - tabHeight];
  let p4: Point = [w, h];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);

  // drawLine(p2, p1, ())
  // drawLine(p2, p3, ())
  // drawLine(p4, p3, ())

  // if (showFoldLine) {
  //   drawFoldLine(p4, p1);
  // }
}

// let drawTab = (
//   rectangle: Builder.rectangle,
//   orientation: Orientation.t,
//   ~showFoldLine: bool=true,
//   ~tabAngle: float=45.0,
//   (),
// ) => {
//   let (x, y, w, h) = rectangle

//   let x = Belt.Int.toFloat(x)
//   let y = Belt.Int.toFloat(y)
//   let w = Belt.Int.toFloat(w)
//   let h = Belt.Int.toFloat(h)

//   let tabAngleRad = Angle.toRadians(tabAngle)

//   switch orientation {
//   | #North => {
//       //
//       //    p2 ______ p3
//       //      /|    |\
//       //     / |    | \
//       // p1 +--|----|--+ p4
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (0.0, h)
//       let p2 = (0.0 +. inset, h -. tabHeight)
//       let p3 = (w -. inset, h -. tabHeight)
//       let p4 = (w, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #East => {
//       //
//       //  p1
//       //   +
//       //   | ⟍
//       //   |   ⟍  p2
//       //   |     |
//       //   |     |
//       //   |    ⟋ p3
//       //   |  ⟋
//       //   +
//       //  p4
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (0.0, 0.0)
//       let p2 = (tabHeight, 0.0 +. inset)
//       let p3 = (tabHeight, h -. inset)
//       let p4 = (0.0, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   | #South => {
//       //
//       // p4 +----------+ p1
//       //     \         /
//       //      \      /
//       //    p3 +----+ p2
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (w, 0.0)
//       let p2 = (w -. inset, tabHeight)
//       let p3 = (0.0 +. inset, tabHeight)
//       let p4 = (0.0, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #West => {
//       //
//       //       p4
//       //         +
//       //       / |
//       //  p3 /   |
//       //    |    |
//       //    |    |
//       //  p2 \   |
//       //       \ |
//       //         +
//       //        p1
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (w, h)
//       let p2 = (w -. tabHeight, h -. inset)
//       let p3 = (w -. tabHeight, 0.0 +. inset)
//       let p4 = (w, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   }
// }

// let drawTab = (
//   rectangle: Builder.rectangle,
//   orientation: Orientation.t,
//   ~showFoldLine: bool=true,
//   ~tabAngle: float=45.0,
//   (),
// ) => {
//   let (x, y, w, h) = rectangle

//   let x = Belt.Int.toFloat(x)
//   let y = Belt.Int.toFloat(y)
//   let w = Belt.Int.toFloat(w)
//   let h = Belt.Int.toFloat(h)

//   let tabAngleRad = Angle.toRadians(tabAngle)

//   switch orientation {
//   | #North => {
//       //
//       //    p2 ______ p3
//       //      /|    |\
//       //     / |    | \
//       // p1 +--|----|--+ p4
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (0.0, h)
//       let p2 = (0.0 +. inset, h -. tabHeight)
//       let p3 = (w -. inset, h -. tabHeight)
//       let p4 = (w, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #East => {
//       //
//       //  p1
//       //   +
//       //   | ⟍
//       //   |   ⟍  p2
//       //   |     |
//       //   |     |
//       //   |    ⟋ p3
//       //   |  ⟋
//       //   +
//       //  p4
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (0.0, 0.0)
//       let p2 = (tabHeight, 0.0 +. inset)
//       let p3 = (tabHeight, h -. inset)
//       let p4 = (0.0, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   | #South => {
//       //
//       // p4 +----------+ p1
//       //     \         /
//       //      \      /
//       //    p3 +----+ p2
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (w, 0.0)
//       let p2 = (w -. inset, tabHeight)
//       let p3 = (0.0 +. inset, tabHeight)
//       let p4 = (0.0, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #West => {
//       //
//       //       p4
//       //         +
//       //       / |
//       //  p3 /   |
//       //    |    |
//       //    |    |
//       //  p2 \   |
//       //       \ |
//       //         +
//       //        p1
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (w, h)
//       let p2 = (w -. tabHeight, h -. inset)
//       let p3 = (w -. tabHeight, 0.0 +. inset)
//       let p4 = (w, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   }
// }

// let drawTab = (
//   rectangle: Builder.rectangle,
//   orientation: Orientation.t,
//   ~showFoldLine: bool=true,
//   ~tabAngle: float=45.0,
//   (),
// ) => {
//   let (x, y, w, h) = rectangle

//   let x = Belt.Int.toFloat(x)
//   let y = Belt.Int.toFloat(y)
//   let w = Belt.Int.toFloat(w)
//   let h = Belt.Int.toFloat(h)

//   let tabAngleRad = Angle.toRadians(tabAngle)

//   switch orientation {
//   | #North => {
//       //
//       //    p2 ______ p3
//       //      /|    |\
//       //     / |    | \
//       // p1 +--|----|--+ p4
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (0.0, h)
//       let p2 = (0.0 +. inset, h -. tabHeight)
//       let p3 = (w -. inset, h -. tabHeight)
//       let p4 = (w, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #East => {
//       //
//       //  p1
//       //   +
//       //   | ⟍
//       //   |   ⟍  p2
//       //   |     |
//       //   |     |
//       //   |    ⟋ p3
//       //   |  ⟋
//       //   +
//       //  p4
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (0.0, 0.0)
//       let p2 = (tabHeight, 0.0 +. inset)
//       let p3 = (tabHeight, h -. inset)
//       let p4 = (0.0, h)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   | #South => {
//       //
//       // p4 +----------+ p1
//       //     \         /
//       //      \      /
//       //    p3 +----+ p2
//       //

//       let maxInset = w /. 2.0
//       let inset = h /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, h)
//       }

//       let p1 = (w, 0.0)
//       let p2 = (w -. inset, tabHeight)
//       let p3 = (0.0 +. inset, tabHeight)
//       let p4 = (0.0, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p2, p1, ())
//       drawLine(p2, p3, ())
//       drawLine(p4, p3, ())

//       if showFoldLine {
//         drawFoldLine(p4, p1)
//       }
//     }
//   | #West => {
//       //
//       //       p4
//       //         +
//       //       / |
//       //  p3 /   |
//       //    |    |
//       //    |    |
//       //  p2 \   |
//       //       \ |
//       //         +
//       //        p1
//       //

//       let maxInset = h /. 2.0
//       let inset = w /. Js.Math.tan(tabAngleRad)

//       let (inset, tabHeight) = if inset > maxInset {
//         (maxInset, Js.Math.tan(tabAngleRad) *. maxInset)
//       } else {
//         (inset, w)
//       }

//       let p1 = (w, h)
//       let p2 = (w -. tabHeight, h -. inset)
//       let p3 = (w -. tabHeight, 0.0 +. inset)
//       let p4 = (w, 0.0)

//       let p1 = p1->Point.translate(x, y)->Point.toIntPoint
//       let p2 = p2->Point.translate(x, y)->Point.toIntPoint
//       let p3 = p3->Point.translate(x, y)->Point.toIntPoint
//       let p4 = p4->Point.translate(x, y)->Point.toIntPoint

//       drawLine(p1, p2, ())
//       drawLine(p3, p2, ())
//       drawLine(p3, p4, ())

//       if showFoldLine {
//         drawFoldLine(p1, p4)
//       }
//     }
//   }
// }
