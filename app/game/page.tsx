'use client'

import {useState} from "react";
import Toolbar from "@/app/components/Toolbar";
import Vila from "@/app/components/Vila";

export default function App() {
    const [selectedStructureId, setSelectedStructureId] = useState<number | null>(null)

    return (
        <>
            <Toolbar onSelect={setSelectedStructureId} selectedStructureId={selectedStructureId}/>
            <Vila selectedStructureId={selectedStructureId} setSelectedStructureId={setSelectedStructureId}/>
        </>
    )
}
