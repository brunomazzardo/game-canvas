// components/Structure.tsx
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Assets, Rectangle, Texture, FederatedPointerEvent } from 'pixi.js';
import { useApplication } from '@pixi/react';
import { useDragStore } from '../store/useDragStore';
import { useGameStore } from '../store/useGameStore';

export interface StructureProps {
    tileX: number; // original grid X
    tileY: number; // original grid Y
    x: number; // pixel
    y: number; // pixel
    structureId: number;
    scale?: number;
    onRemove: () => void;
}

const TILE_WIDTH = 218;
const TILE_HEIGHT = 120;
const STRUCTURE_Y_OFFSET = 30;
const STRUCTURE_SIZE = 256;

const isoX = (x: number, y: number) => (x - y) * (TILE_WIDTH / 2);
const isoY = (x: number, y: number) => (x + y) * (TILE_HEIGHT / 2);
const uniso = (x: number, y: number) => {
    const halfW = TILE_WIDTH / 2;
    const halfH = TILE_HEIGHT / 2;
    const gridY = (y / halfH - x / halfW) / 2;
    const gridX = (y / halfH + x / halfW) / 2;
    return [Math.round(gridX), Math.round(gridY)] as [number, number];
};

const Structure = memo(({
                            tileX,
                            tileY,
                            x: initialX,
                            y: initialY,
                            structureId,
                            scale = 1,
                        }: StructureProps) => {
    const { app } = useApplication();
    const [texture, setTexture] = useState(Texture.EMPTY);
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    const dragging = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const scaleFactor = 0.5;

    const { setDragging, setHoveredTile } = useDragStore();
    const moveStructure = useGameStore((s) => s.moveStructure);

    // load texture
    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-stone-assets.png').then((base) => {
                const frame = new Rectangle(
                    (structureId % 10) * STRUCTURE_SIZE,
                    Math.floor(structureId / 10) * STRUCTURE_SIZE,
                    STRUCTURE_SIZE,
                    STRUCTURE_SIZE
                );
                setTexture(new Texture({ source: base.source, frame }));
            });
        }
    }, [structureId, texture]);

    // make stage interactive
    useEffect(() => {
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
    }, [app]);

    const onDragMove = useCallback((e: FederatedPointerEvent) => {
        if (!dragging.current) return;
        // raw global pixel
        const gx = (e.global.x - offsetRef.current.x) / scaleFactor;
        const gy = (e.global.y - offsetRef.current.y) / scaleFactor;
        setPos({ x: gx, y: gy });

        // update hovered tile
        const [tx, ty] = uniso(gx, gy + STRUCTURE_Y_OFFSET);
        setHoveredTile([tx, ty]);
    }, []);

    const onDragStart = useCallback((e: FederatedPointerEvent) => {
        dragging.current = true;
        setDragging(true);

        // compute offset in screen-space
        const screenX = initialX * scaleFactor;
        const screenY = initialY * scaleFactor;
        offsetRef.current = {
            x: e.global.x - screenX,
            y: e.global.y - screenY,
        };
        app.stage.on('pointermove', onDragMove);
    }, [initialX, initialY, app.stage, onDragMove, setDragging]);

    const onDragEnd = useCallback(() => {
        dragging.current = false;
        setDragging(false);
        setHoveredTile(null);
        app.stage.off('pointermove', onDragMove);

        // figure out drop grid
        const [nx, ny] = uniso(pos.x, pos.y + STRUCTURE_Y_OFFSET);
        // try to move in store; if fail, revert
        const success = moveStructure([tileX, tileY], [nx, ny]);
        if (success) {
            // snap to the new tile center
            setPos({
                x: isoX(nx, ny),
                y: isoY(nx, ny) - STRUCTURE_Y_OFFSET,
            });
        } else {
            // revert to original
            setPos({ x: initialX, y: initialY });
        }
    }, [
        pos.x,
        pos.y,
        tileX,
        tileY,
        initialX,
        initialY,
        onDragMove,
        moveStructure,
        setDragging,
        setHoveredTile,
        app.stage,
    ]);

    return (
        <pixiSprite
            x={pos.x}
            y={pos.y}
            scale={scale}
            zIndex={10}
            texture={texture}
            eventMode="static"
            cursor="pointer"
            anchor={{ x: 0.5, y: 1 }}
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            onPointerUpOutside={onDragEnd}
        />
    );
});
Structure.displayName = 'Structure';
export default Structure;
