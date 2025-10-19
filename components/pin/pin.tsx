import { cn } from "@/lib/utils";
import { createHash } from "crypto";

interface PinProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string;
    score: number;
    hight?: number | string;
    width?: number | string;
}

export default function Pin({userId, score, hight, width, className, ...props}: PinProps) {

    function sha256(str: string) {
        return createHash("sha256").update(str).digest("hex");
    }


    function getGuyPath(guy: string) {
        return "/assets/characters/" + guy + ".svg";
    }

    const guys = ["chick", "frog", "llama", "pig", "teddy_bear"];
    const userIdHash = sha256(userId);
    const guyIndex = parseInt(userIdHash.slice(0, 8), 16) % guys.length;

    return (
        <div className={cn("", className)}>
            <img src={getGuyPath(guys[guyIndex])} alt="Pin" />
        </div>
    );
}