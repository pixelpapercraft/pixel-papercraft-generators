# Pixel Papercraft Generators

The generator tooling behind [Pixel Papercraft](https://pixelpapercraft.com) — the code that turns Minecraft skins, blocks, items, and other game-themed subjects into printable paper templates.

## Requirements

- Node.js 22.x (see the `engines` field in `package.json`)

## Setup

Install dependencies and run the one-time project setup:

```bash
npm install
npm run setup
```

`npm run setup` generates local files (such as `next-env.d.ts`) that are not checked into the repository.

## Development

Start the development server:

```bash
npm run dev
```

## Building

Create and run a production build:

```bash
npm run build
npm run start
```

## Testing

Run the unit tests:

```bash
npm run test:unit
```

Run the generator image snapshot tests (Playwright):

```bash
npm run test:generators
```

If an intentional rendering change updates the output, update the baselines and review the changed snapshot files before committing them:

```bash
npm run test:generators:update
```

View the last Playwright run's report:

```bash
npm run test:generators:report
```

## Checks

Run the linter and TypeScript type checks:

```bash
npm run lint
npm run types:check
```

Format the codebase with Prettier:

```bash
npm run format
```
