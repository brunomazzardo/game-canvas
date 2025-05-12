'use client'
import {Application, extend} from '@pixi/react'
import {AnimatedSprite, Container, Graphics, Sprite} from 'pixi.js'
import Tile from '@/app/components/Tile'
import Structure from "@/app/components/Structure";
import Toolbar from "@/app/components/Toolbar";
import {useCallback, useEffect, useState} from 'react'
import AnimatedStructure from "@/app/components/AnimatedStructure";

extend({Container, Graphics, Sprite, AnimatedSprite})

const TILE_TOP_WIDTH = 218
const TILE_TOP_HEIGHT = 120
const STRUCTURE_Y_OFFSET = 30 // adjust visually; tweak between 80–120


const isoX = (x: number, y: number) => (x - y) * (TILE_TOP_WIDTH / 2)
const isoY = (x: number, y: number) => (x + y) * (TILE_TOP_HEIGHT / 2)


const createEmptyGrid = (rows: number, cols: number) =>
    Array.from({length: rows}, () => Array(cols).fill(undefined))

function Map({selectedStructureId, setSelectedStructureId}: {
    selectedStructureId: number | null,
    setSelectedStructureId: (id: number | null) => void
}) {

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    const initialTiles: number[][] = Array.from({length: isMobile ? 3 : 7}, () => Array(isMobile ? 3 : 7).fill(0))


    const [structures, setStructures] = useState<(number | undefined)[][]>(
        createEmptyGrid(initialTiles.length, initialTiles[0].length)
    )

    const [houses, setHouses] = useState<(number | undefined)[][]>(
        createEmptyGrid(initialTiles.length, initialTiles[0].length)
    )

    useEffect(() => {
        setHouses(prevHouses => {
            const newHouses = [...prevHouses];
            newHouses[0][0] = 1;
            return newHouses;
        });
    }, []);


    const handleTileClick = useCallback((x: number, y: number) => {
        if (selectedStructureId) {
            setStructures(prev => {
                const newStructures = [...prev]
                newStructures[y][x] = selectedStructureId
                return newStructures
            })
            setSelectedStructureId(null)
        }
    }, [selectedStructureId, setSelectedStructureId])

    // Handle structure removal
    const handleStructureRemove = useCallback((x: number, y: number) => {
        setStructures(prev => {
            const newStructures = [...prev]
            newStructures[y][x] = undefined
            return newStructures
        })
    }, [])


    return (
        <pixiContainer x={window.innerWidth / 2} y={window.innerHeight / 2} scale={0.5}>
            {initialTiles.map((row, y) =>
                row.map((tileId, x) => (
                    <Tile
                        key={`tile-${x}-${y}`}
                        x={isoX(x, y)}
                        y={isoY(x, y)}
                        tileId={tileId}
                        onClick={() => handleTileClick(x, y)}
                    />
                ))
            )}


            {structures.map((row, y) =>
                row.map((structureId, x) =>
                    structureId !== undefined ? (
                        <Structure
                            key={`structure-${x}-${y}`}
                            x={isoX(x, y)}
                            y={isoY(x, y) - STRUCTURE_Y_OFFSET}
                            scale={0.5}
                            onRemove={() => handleStructureRemove(x, y)}
                            structureId={structureId}
                        />
                    ) : null
                )
            )}


            <AnimatedStructure
                key={`animated-structure`}
                x={isoX(0, 0)}
                y={isoY(0, 0)}
                structureIds={[2, 1, 0]}
                onRemove={console.log
                }
            />
        </pixiContainer>
    )
}

export default function App() {
    const [selectedStructureId, setSelectedStructureId] = useState<number | null>(null)

    return (
        <>
            <Toolbar onSelect={setSelectedStructureId} selectedStructureId={selectedStructureId}/>
            <Application resizeTo={window.window}>
                <Map selectedStructureId={selectedStructureId} setSelectedStructureId={setSelectedStructureId}/>
            </Application>
        </>
    )
}
