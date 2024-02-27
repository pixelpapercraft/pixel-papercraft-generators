// module CharacterLegacy = {
//   module Layer = {
//     type t = {
//       head: CuboidLegacy.t,
//       rightArm: CuboidLegacy.t,
//       leftArm: CuboidLegacy.t,
//       body: CuboidLegacy.t,
//       rightLeg: CuboidLegacy.t,
//       leftLeg: CuboidLegacy.t,
//     }
//   }

//   type t = {
//     base: Layer.t,
//     overlay: Layer.t,
//   }

//   let {make, translate} = module(CuboidLegacy)

//   let steve: t = {
//     base: {
//       head: make(8, 8, 8)->translate(0, 0),
//       rightArm: make(4, 12, 4)->translate(40, 16),
//       leftArm: make(4, 12, 4)->translate(32, 48),
//       body: make(8, 12, 4)->translate(16, 16),
//       rightLeg: make(4, 12, 4)->translate(0, 16),
//       leftLeg: make(4, 12, 4)->translate(16, 48),
//     },
//     overlay: {
//       head: make(8, 8, 8)->translate(32, 0),
//       rightArm: make(4, 12, 4)->translate(40, 32),
//       leftArm: make(4, 12, 4)->translate(48, 48),
//       body: make(8, 12, 4)->translate(16, 32),
//       rightLeg: make(4, 12, 4)->translate(0, 32),
//       leftLeg: make(4, 12, 4)->translate(0, 48),
//     },
//   }

//   let alex: t = {
//     base: {
//       head: steve.base.head,
//       rightArm: make(3, 12, 4)->translate(40, 16),
//       leftArm: make(3, 12, 4)->translate(32, 48),
//       body: steve.base.body,
//       rightLeg: steve.base.rightLeg,
//       leftLeg: steve.base.leftLeg,
//     },
//     overlay: {
//       head: steve.overlay.head,
//       rightArm: make(3, 12, 4)->translate(40, 32),
//       leftArm: make(3, 12, 4)->translate(48, 48),
//       body: steve.overlay.body,
//       rightLeg: steve.overlay.rightLeg,
//       leftLeg: steve.overlay.leftLeg,
//     },
//   }
// }

// module Character = {
//   module Layer = {
//     type t = {
//       head: Cuboid.Source.t,
//       rightArm: Cuboid.Source.t,
//       leftArm: Cuboid.Source.t,
//       body: Cuboid.Source.t,
//       rightLeg: Cuboid.Source.t,
//       leftLeg: Cuboid.Source.t,
//     }
//   }

//   type t = {
//     base: Layer.t,
//     overlay: Layer.t,
//   }

//   let {make, translate} = module(Cuboid.Source)

//   let steve: t = {
//     base: {
//       head: make((8, 8, 8))->translate((0, 0)),
//       rightArm: make((4, 12, 4))->translate((40, 16)),
//       leftArm: make((4, 12, 4))->translate((32, 48)),
//       body: make((8, 12, 4))->translate((16, 16)),
//       rightLeg: make((4, 12, 4))->translate((0, 16)),
//       leftLeg: make((4, 12, 4))->translate((16, 48)),
//     },
//     overlay: {
//       head: make((8, 8, 8))->translate((32, 0)),
//       rightArm: make((4, 12, 4))->translate((40, 32)),
//       leftArm: make((4, 12, 4))->translate((48, 48)),
//       body: make((8, 12, 4))->translate((16, 32)),
//       rightLeg: make((4, 12, 4))->translate((0, 32)),
//       leftLeg: make((4, 12, 4))->translate((0, 48)),
//     },
//   }

//   let alex: t = {
//     base: {
//       head: steve.base.head,
//       rightArm: make((3, 12, 4))->translate((40, 16)),
//       leftArm: make((3, 12, 4))->translate((32, 48)),
//       body: steve.base.body,
//       rightLeg: steve.base.rightLeg,
//       leftLeg: steve.base.leftLeg,
//     },
//     overlay: {
//       head: steve.overlay.head,
//       rightArm: make((3, 12, 4))->translate((40, 32)),
//       leftArm: make((3, 12, 4))->translate((48, 48)),
//       body: steve.overlay.body,
//       rightLeg: steve.overlay.rightLeg,
//       leftLeg: steve.overlay.leftLeg,
//     },
//   }
// }
