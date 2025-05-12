'use client'

import { useState } from 'react'

interface ToolbarProps {
    onSelect: (id: number) => void
    selectedStructureId: number | null
}

const SPRITE_SIZE = 256
const SPRITES_PER_ROW = 10
const TEXTURE_SIZE = 2560

export default function Toolbar({ onSelect, selectedStructureId }: ToolbarProps) {
    const [hoveredId, setHoveredId] = useState<number | null>(null)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    return (
        <div
            style={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#111',
                padding: '12px 16px',
                display: 'flex',
                gap: '24px',
                borderRadius: 12,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.4)',
                zIndex: 1000,
            }}
        >
            {Array.from({ length: isMobile ? 4 : 12 }).map((_, id) => {
                const scale = 64 / SPRITE_SIZE
                const x = id % SPRITES_PER_ROW
                const y = Math.floor(id / SPRITES_PER_ROW)
                const backgroundPosition = `-${x * SPRITE_SIZE * scale}px -${y * SPRITE_SIZE * scale}px`

                const isHovered = hoveredId === id
                const isSelected = selectedStructureId === id
                const scaleValue = isHovered || isSelected ? 1.2 : 1

                return (
                    <button
                        key={id}
                        onClick={() => onSelect(id)}
                        onMouseEnter={() => setHoveredId(id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                            width: 64,
                            height: 64,
                            backgroundImage: `url(/textures/iso-stone-assets.png)`,
                            backgroundPosition,
                            backgroundSize: `${TEXTURE_SIZE * scale}px ${TEXTURE_SIZE * scale}px`,
                            backgroundRepeat: 'no-repeat',
                            border: '2px solid white',
                            cursor: 'pointer',
                            borderRadius: 8,
                            transition: 'transform 0.2s ease',
                            transformOrigin: 'bottom center',
                            imageRendering: 'pixelated',
                            transform: `scale(${scaleValue})`,
                        }}
                    />
                )
            })}
        </div>
    )
}
