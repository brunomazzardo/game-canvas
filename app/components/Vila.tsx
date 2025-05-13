'use client'
import {Application, extend} from '@pixi/react'
import {AnimatedSprite, Container, Graphics, Sprite} from 'pixi.js'
import Tile from '@/app/components/Tile'
import Structure from "@/app/components/Structure";
import {memo, useCallback, useLayoutEffect} from 'react'
import {useGameStore} from "@/app/store/useGameStore";

extend({Container, Graphics, Sprite, AnimatedSprite})

const TILE_TOP_WIDTH = 218;
const TILE_TOP_HEIGHT = 120;
const STRUCTURE_Y_OFFSET = 30;

// same iso helpers
const isoX = (x: number, y: number) => (x - y) * (TILE_TOP_WIDTH / 2);
const isoY = (x: number, y: number) => (x + y) * (TILE_TOP_HEIGHT / 2);

const createEmptyGrid = (r: number, c: number) =>
    Array.from({ length: r }, () => Array(c).fill(undefined));

interface MapProps {
    selectedStructureId: number | null;
    setSelectedStructureId: (id: number | null) => void;
}

const Map = memo(({ selectedStructureId, setSelectedStructureId }: MapProps) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const size = isMobile ? 3 : 7;

    const structures = useGameStore((s) => s.structures);
    const setStructures = useGameStore((s) => s.setStructures);
    const addStructure = useGameStore((s) => s.addStructure);
    const removeStructure = useGameStore((s) => s.removeStructure);

    // init grid on mount
    useLayoutEffect(() => {
        setStructures(createEmptyGrid(size, size));
    }, [size, setStructures]);

    const handleTileClick = useCallback(
        (tx: number, ty: number) => {
            if (selectedStructureId !== null) {
                addStructure(tx, ty, selectedStructureId);
                setSelectedStructureId(null);
            }
        },
        [selectedStructureId, addStructure, setSelectedStructureId]
    );

    console.log({structures})

    if(!structures.length) return null;

    return (
        <Application resizeTo={window.window}>
            <pixiContainer
                x={window.innerWidth / 2}
                y={window.innerHeight/3}
                scale={0.5}
            >
                {structures.map((row, ty) =>
                    row.map((_, tx) => (
                        <Tile
                            key={`tile-${tx}-${ty}`}
                            x={isoX(tx, ty)}
                            y={isoY(tx, ty)}
                            tileX={tx}
                            tileY={ty}
                            tileId={0}
                            onClick={() => handleTileClick(tx, ty)}
                        />
                    ))
                )}

                {structures.map((row, ty) =>
                    row.map(
                        (structureId, tx) =>
                            structureId !== undefined && (
                                <Structure
                                    key={`str-${tx}-${ty}`}
                                    tileX={tx}
                                    tileY={ty}
                                    x={isoX(tx, ty)}
                                    y={isoY(tx, ty) - STRUCTURE_Y_OFFSET}
                                    structureId={structureId}
                                    scale={0.5}
                                    onRemove={() => removeStructure(tx, ty)}
                                />
                            )
                    )
                )}
            </pixiContainer>
        </Application>
    );
});

Map.displayName = 'Map';
export default Map;
