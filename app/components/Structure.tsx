import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Assets, Rectangle, Texture, FederatedPointerEvent } from 'pixi.js';
import { useApplication } from '@pixi/react';
import { useDragStore } from '../store/useDragStore';

const TILE_WIDTH = 218;
const TILE_HEIGHT = 120;
const STRUCTURE_SIZE = 256;
const STRUCTURE_Y_OFFSET = 30;

const isoX = (x: number, y: number) => (x - y) * (TILE_WIDTH / 2);
const isoY = (x: number, y: number) => (x + y) * (TILE_HEIGHT / 2);
const uniso = (x: number, y: number) => {
    const isoHalfW = TILE_WIDTH / 2;
    const isoHalfH = TILE_HEIGHT / 2;
    const gridY = (y / isoHalfH - x / isoHalfW) / 2;
    const gridX = (y / isoHalfH + x / isoHalfW) / 2;
    return [Math.round(gridX), Math.round(gridY)];
};

export interface StructureProps {
    x: number;
    y: number;
    structureId: number;
    scale?: number;
    onRemove: () => void;
}

const Structure = memo(({ x, y, structureId, scale = 1, onRemove }: StructureProps) => {
    const { app } = useApplication();
    const spriteX = (structureId % 10) * STRUCTURE_SIZE;
    const spriteY = Math.floor(structureId / 10) * STRUCTURE_SIZE;

    const [texture, setTexture] = useState(Texture.EMPTY);
    const [position, setPosition] = useState({ x, y });

    const dragging = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const scaleFactor = 0.5;

    const { setDragging, setHoveredTile } = useDragStore();

    useEffect(() => {
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
    }, [app]);

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-stone-assets.png').then((baseTexture: Texture) => {
                const frame = new Rectangle(spriteX, spriteY, STRUCTURE_SIZE, STRUCTURE_SIZE);
                const subTexture = new Texture({ source: baseTexture.source, frame });
                setTexture(subTexture);
            });
        }
    }, [spriteX, spriteY, texture]);

    const onDragMove = useCallback((e: FederatedPointerEvent) => {
        if (!dragging.current) return;
        const globalX = (e.global.x - offsetRef.current.x) / scaleFactor;
        const globalY = (e.global.y - offsetRef.current.y) / scaleFactor;
        setPosition({ x: globalX, y: globalY });

        const [gx, gy] = uniso(globalX, globalY + STRUCTURE_Y_OFFSET);
        setHoveredTile([gx, gy]);
    }, []);

    const onDragStart = useCallback((e: FederatedPointerEvent) => {
        dragging.current = true;
        setDragging(true);

        const scaledX = position.x * scaleFactor;
        const scaledY = position.y * scaleFactor;

        offsetRef.current = {
            x: e.global.x - scaledX,
            y: e.global.y - scaledY,
        };

        app.stage.on('pointermove', onDragMove);
    }, [app.stage, onDragMove, position]);

    const onDragEnd = useCallback(() => {
        dragging.current = false;
        setDragging(false);
        setHoveredTile(null);
        app.stage.off('pointermove', onDragMove);

        const [gx, gy] = uniso(position.x, position.y + STRUCTURE_Y_OFFSET);
        const snappedX = isoX(gx, gy);
        const snappedY = isoY(gx, gy) - STRUCTURE_Y_OFFSET;
        setPosition({ x: snappedX, y: snappedY });
    }, [app.stage, onDragMove, position]);

    return (
        <pixiSprite
            x={position.x}
            y={position.y}
            scale={scale}
            zIndex={10}
            eventMode="static"
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            onPointerUpOutside={onDragEnd}
            anchor={{ x: 0.5, y: 1 }}
            texture={texture}
            cursor="pointer"
        />
    );
});

Structure.displayName = 'Structure';
export default Structure;
