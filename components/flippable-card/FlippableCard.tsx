'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlippableCardProps {
    children : React.ReactNode;
    className?: string;
    onFlip?: (isFlipped: boolean) => void;
}

export default function FlippableCard({children, className, onFlip}: FlippableCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleFlip = () => {
        const nextFlippedState = !isFlipped;
        setIsFlipped(nextFlippedState);
        onFlip?.(nextFlippedState);
    };


    return (
        <div className={cn("group [perspective:1000px] ", className)} onClick={toggleFlip}>
            <div className={cn("relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]", {"[transform:rotateY(180deg)]": isFlipped})}>
                {children}
            </div>
        </div>
    );
}