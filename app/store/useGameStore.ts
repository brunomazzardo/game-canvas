// store/gameStore.ts
import { create } from 'zustand';

export interface GameState {
    structures: (number | undefined)[][];
    setStructures: (s: (number | undefined)[][]) => void;
    addStructure: (x: number, y: number, id: number) => void;
    removeStructure: (x: number, y: number) => void;
    moveStructure: (from: [number, number], to: [number, number]) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
    // start empty; Map will initialize
    structures: [],

    setStructures: (structures) => set({ structures }),

    addStructure: (x, y, id) =>
        set((state) => {
            const grid = state.structures.map((row) => [...row]);
            grid[y][x] = id;
            return { structures: grid };
        }),

    removeStructure: (x, y) =>
        set((state) => {
            const grid = state.structures.map((row) => [...row]);
            grid[y][x] = undefined;
            return { structures: grid };
        }),

    moveStructure: ([fromX, fromY], [toX, toY]) => {
        const { structures } = get();
        // collision check
        if (
            toX < 0 ||
            toY < 0 ||
            toY >= structures.length ||
            toX >= structures[0].length ||
            structures[toY][toX] !== undefined
        ) {
            return false;
        }
        set(() => {
            const grid = structures.map((row) => [...row]);
            grid[toY][toX] = grid[fromY][fromX];
            grid[fromY][fromX] = undefined;
            return { structures: grid };
        });
        return true;
    },
}));
