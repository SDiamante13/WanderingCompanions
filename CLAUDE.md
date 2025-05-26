# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D adventure pets game built with React Three Fiber and Express. Players create characters, choose pets, and explore a virtual town with battle mechanics. The architecture follows a client-server pattern with shared TypeScript schemas.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build client and server for production
- `npm run start` - Run production build
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to Neon DB

## Architecture

### Client Architecture (React + Three.js)
- **Game Flow**: Welcome → Age Verification → Character Creation → Pet Assignment → Town/Battle
- **State Management**: Zustand stores for game state, player data, pets, and battles
- **3D Rendering**: React Three Fiber with @react-three/drei utilities
- **UI Components**: Radix UI primitives with Tailwind CSS styling

### Key Store Files
- `useGameStore.ts` - Main game phase and progress tracking
- `usePlayerStore.ts` - Player character data and inventory
- `usePetStore.ts` - Pet companion data and abilities
- `useBattleStore.ts` - Turn-based combat mechanics

### Server Architecture (Express + PostgreSQL)
- **Database**: Drizzle ORM with Neon PostgreSQL
- **API**: Express routes in `server/routes.ts`
- **Development**: Vite integration for hot reload in dev mode
- **Production**: Static file serving with esbuild bundling

### Shared Schema
- `shared/schema.ts` - Database tables and Zod validation schemas
- `client/src/game/types.ts` - Game enums and TypeScript interfaces

## Game State Flow

Game phases are managed through `GamePhase` enum and stored in `useGameStore`. Each phase renders different UI components while maintaining the underlying Three.js canvas. The game persists progress through Zustand's persist middleware.

## Database Configuration

Uses Drizzle ORM with PostgreSQL via Neon. Database URL must be set in environment variables. Schema changes are pushed using `npm run db:push`.