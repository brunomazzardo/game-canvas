import { Assets, Rectangle, Texture, Graphics as PixiGraphics } from 'pixi.js';
import { memo, useEffect, useRef, useState } from 'react';
import { useDragStore } from '../store/useDragStore'

export interface TileProps {
    x: number; // pixel
    y: number; // pixel
    tileX: number; // grid
    tileY: number; // grid
    tileId: number;
    onClick?: () => void;
}

const TILE_SIZE = 256;
const TILE_TOP_WIDTH = 218;
const TILE_TOP_HEIGHT = 120;
const SHEET_TILES_PER_ROW = 10;

const Tile = memo(({ x, y, tileX, tileY, tileId, onClick }: TileProps) => {
    const spriteRef = useRef(null);
    const [texture, setTexture] = useState(Texture.EMPTY);
    const { isDragging, hoveredTile } = useDragStore();

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-assets.png').then((base) => {
                const frame = new Rectangle(
                    (tileId % SHEET_TILES_PER_ROW) * TILE_SIZE,
                    Math.floor(tileId / SHEET_TILES_PER_ROW) * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
                setTexture(new Texture({ source: base.source, frame }));
            });
        }
    }, [tileId, texture]);

    const isHovered = isDragging && hoveredTile?.[0] === tileX && hoveredTile?.[1] === tileY;

    return (
        <>
            <pixiSprite
                x={x}
                y={y}
                ref={spriteRef}
                texture={texture}
                eventMode="static"
                onPointerDown={onClick}
                anchor={{ x: 0.5, y: 0.5 }}
                width={TILE_SIZE}
                height={TILE_SIZE}
            />
            {/* border on top */}
            <pixiGraphics
                draw={(g: PixiGraphics) => {
                    const adjustedY = y - TILE_TOP_HEIGHT ; // shift up to top face
                    g.clear();
                    g.stroke({ width: 2, color: isHovered ? 0x00 : 0xffffff });
                    g.beginPath();
                    g.moveTo(x, adjustedY);
                    g.lineTo(x + TILE_TOP_WIDTH / 2, adjustedY + TILE_TOP_HEIGHT / 2);
                    g.lineTo(x, adjustedY + TILE_TOP_HEIGHT);
                    g.lineTo(x - TILE_TOP_WIDTH / 2, adjustedY + TILE_TOP_HEIGHT / 2);
                    g.closePath();
                    g.stroke();
                }}
            />
        </>
    );
});
Tile.displayName = 'Tile';
export default Tile;
