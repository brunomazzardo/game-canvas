import { memo, useEffect, useRef, useState } from 'react'
import { Assets, Rectangle, Texture } from 'pixi.js'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'

interface AnimatedStructureProps {
    x: number
    y: number
    structureIds: number[]
    scale?: number
    onRemove: () => void
}

const STRUCTURE_SIZE = 256

// Register GSAP PixiPlugin once
gsap.registerPlugin(PixiPlugin)

const AnimatedStructure = memo(({ x, y, structureIds, scale = 1, onRemove }: AnimatedStructureProps) => {
    const [textures, setTextures] = useState<Texture[] | null>(null)
    const spriteRef = useRef<any>(null)

    useEffect(() => {
        Assets.load('/textures/iso-stone-assets.png').then((baseTexture: Texture) => {
            const source = baseTexture.source
            const frames: Texture[] = structureIds.map((structureId) => {
                const spriteX = (structureId % 10) * STRUCTURE_SIZE
                const spriteY = Math.floor(structureId / 10) * STRUCTURE_SIZE
                const frame = new Rectangle(spriteX, spriteY, STRUCTURE_SIZE, STRUCTURE_SIZE)
                return new Texture({ source, frame })
            })
            setTextures(frames)
        })
    }, [structureIds])

    // Animate scale with gsap on mount
    useEffect(() => {
        if (spriteRef.current) {
            gsap.fromTo(
                spriteRef.current,
                { pixi: { scale: 0.7 } },
                { pixi: { scale: scale }, duration: 0.6, ease: 'elastic.out(1, 0.3)' }
            )
            spriteRef.current.play()
        }
    }, [textures, scale])

    if (!textures?.length) return null

    return (
        <pixiAnimatedSprite
            ref={spriteRef}
            x={x}
            y={y}
            textures={textures}
            animationSpeed={0.05}
            loop={true}
            anchor={{ x: 0.5, y: 1 }}
            eventMode="static"
            onPointerDown={onRemove}
            cursor="pointer"
        />
    )
})

AnimatedStructure.displayName = 'AnimatedStructure'

export default AnimatedStructure
