import { Assets, Rectangle, Texture, Graphics as PixiGraphics } from 'pixi.js';
import { memo, useEffect, useRef, useState } from 'react';
import { useDragStore } from '../store/useDragStore';

export interface TileProps {
    x: number;
    y: number;
    tileX: number;
    tileY: number;
    tileId: number;
    onClick?: () => void;
}

const TILE_SIZE = 256;
const TILE_TOP_WIDTH = 218;
const TILE_TOP_HEIGHT = 120;
const SHEET_TILES_PER_ROW = 10;

const Tile = memo(({ x, y, tileId, tileX, tileY, onClick }: TileProps) => {
    const spriteX = (tileId % SHEET_TILES_PER_ROW) * TILE_SIZE;
    const spriteY = Math.floor(tileId / SHEET_TILES_PER_ROW) * TILE_SIZE;
    const spriteRef = useRef(null);
    const [texture, setTexture] = useState(Texture.EMPTY);

    const { isDragging, hoveredTile } = useDragStore();

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-assets.png').then((baseTexture: Texture) => {
                const frame = new Rectangle(spriteX, spriteY, TILE_SIZE, TILE_SIZE);
                const subTexture = new Texture({ source: baseTexture.source, frame });
                setTexture(subTexture);
            });
        }
    }, [spriteX, spriteY, texture]);

    const isHovered = isDragging && hoveredTile?.[0] === tileX && hoveredTile?.[1] === tileY;

    return (
        <>

            <pixiSprite
                x={x}
                y={y}
                ref={spriteRef}
                scale={1}
                eventMode={'static'}
                onPointerDown={onClick}
                anchor={0.5}
                texture={texture}
                width={TILE_SIZE}
                height={TILE_SIZE}
            />
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
