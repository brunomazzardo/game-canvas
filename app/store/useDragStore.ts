import { create } from 'zustand';

export interface DragState {
    isDragging: boolean;
    setDragging: (val: boolean) => void;
    hoveredTile: [number, number] | null;
    setHoveredTile: (tile: [number, number] | null) => void;
}

export const useDragStore = create<DragState>((set) => ({
    isDragging: false,
    setDragging: (val) => set({ isDragging: val }),
    hoveredTile: null,
    setHoveredTile: (tile) => set({ hoveredTile: tile }),
}));
