# Path Finder Game

This project is a SvelteKit implementation of the Path Finder game. The original version of the game was created using HTML, CSS, and JavaScript. This implementation leverages the power of SvelteKit to create a more modular and maintainable codebase.

## How to play

Start at the green dot and keep tapping the nearest yellow dot until all are visited. Dots within 3px of each other in distance both count. Each level adds 3 dots (up to 50) and 5 seconds. `P` or `Esc` pauses.

## Features

- **SvelteKit**: Utilizes SvelteKit for building the application.
- **TypeScript**: Written in TypeScript for type safety.
- **State Management**: Uses Svelte 5 runes; game rules live in `src/lib/game.ts` (test with `bun test src`).
- **Animations**: Includes animations for dots and lines to enhance the visual experience.

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Credits

This project was inspired by and uses code from [this CodePen](https://codepen.io/blazicke/pen/MEvZRR) by [Blazicke](https://codepen.io/blazicke).
