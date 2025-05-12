import { memo, useState, useEffect } from 'react'
import { Assets, Rectangle, Texture } from 'pixi.js'

interface HouseProps {
    x: number
    y: number
    houseId: number
    scale?: number
}
const HOUSE_SIZE = 1280
const HOUSE_SCALE = 0.35

const House = memo(({ x, y, houseId, scale = HOUSE_SCALE }: HouseProps) => {
    const spriteX = (houseId % 10) * HOUSE_SIZE
    const spriteY = Math.floor(houseId / 10) * HOUSE_SIZE

    const [texture, setTexture] = useState(Texture.EMPTY)

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load('/textures/iso-house-assets.png').then((baseTexture: Texture) => {
                const frame = new Rectangle(spriteX, spriteY, HOUSE_SIZE, HOUSE_SIZE)
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
            anchor={{ x: 0.5, y: 1 }}
            texture={texture}
        />
    )
})

House.displayName = 'House'

export default House