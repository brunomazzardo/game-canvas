import { Assets, Rectangle, Texture } from 'pixi.js'
import { memo, useEffect, useRef, useState } from 'react'

interface TileProps {
    x: number            // Grid X position where to place the tile
    y: number            // Grid Y position where to place the tile
    tileId: number       // ID of the tile in the spritesheet (0-99)
    scale?: number       // Optional scale factor
    rotation?: number    // Optional rotation in radians
    onClick?: () => void // Optional click handler
}

const TILE_SIZE = 256              // Size of each tile in the sprite sheet
const SHEET_TILES_PER_ROW = 10     // Number of tiles per row in the sprite sheet

const Tile = memo(({ x, y, tileId, rotation = 0, onClick }: TileProps) => {
    const spriteX = (tileId % SHEET_TILES_PER_ROW) * TILE_SIZE
    const spriteY = Math.floor(tileId / SHEET_TILES_PER_ROW) * TILE_SIZE
    const spriteRef = useRef(null)

    const [texture, setTexture] = useState(Texture.EMPTY)

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-assets.png').then((baseTexture: Texture) => {
                const frame = new Rectangle(spriteX, spriteY, TILE_SIZE, TILE_SIZE)
                const subTexture = new Texture({
                    source: baseTexture.source,
                    frame,
                })
                setTexture(subTexture)
            })
        }
    }, [spriteX, spriteY, texture])


    return (
        <pixiSprite
            x={x}
            y={y}
            ref={spriteRef}
            scale={1}
            eventMode={'static'}
            onPointerDown={onClick}
            anchor={0.5}
            texture={texture}
            rotation={rotation}
            width={TILE_SIZE}
            height={TILE_SIZE}
        />
    )
})

Tile.displayName = 'Tile'

export default Tile