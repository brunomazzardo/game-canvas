import {memo, useState, useEffect, useCallback} from 'react'
import { Assets, Rectangle, Texture } from 'pixi.js'

interface StructureProps {
    x: number
    y: number
    structureId: number
    scale?: number
    onRemove: () => void

}

const STRUCTURE_SIZE = 256

const Structure = memo(({ x, y, structureId, scale = 1, onRemove }: StructureProps) => {
    const spriteX = (structureId % 10) * STRUCTURE_SIZE
    const spriteY = Math.floor(structureId / 10) * STRUCTURE_SIZE

    const handleClick = useCallback(() => {
        onRemove()
    }, [onRemove])

    const [texture, setTexture] = useState(Texture.EMPTY)

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-stone-assets.png').then((baseTexture: Texture) => {
                const frame = new Rectangle(spriteX, spriteY, STRUCTURE_SIZE, STRUCTURE_SIZE)
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
            scale={scale}
            zIndex={10}
            eventMode={'static'}
            onPointerDown={handleClick}
            anchor={{ x: 0.5, y: 1 }}
            texture={texture}
            cursor="pointer"
        />
    )
})

Structure.displayName = 'Structure'

export default Structure