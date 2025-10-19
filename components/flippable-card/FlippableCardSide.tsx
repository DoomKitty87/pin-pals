import { cn } from "@/lib/utils";

export enum CardSide {
  FRONT,
  BACK,
}

interface FlippableCardSideProps {
    children: React.ReactNode;
    side: CardSide;
    className?: string;
}

export default function FlippableCardSide({ children, side, className }: FlippableCardSideProps) {

    return (
        <div className={cn("absolute w-full h-full [backface-visibility:hidden]", {"[transform:rotateY(180deg)]": side === CardSide.BACK}, className)}>
            {children}
        </div>
    );
}