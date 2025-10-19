import { cn } from "@/lib/utils";
import { createHash } from "crypto";

interface PinProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string;
    score: number;
    size?: number | string;
}

export default function Pin({userId, score, size=100, className, ...props}: PinProps) {

    function sha256(str: string) {
        return createHash("sha256").update(str).digest("hex");
    }


    function getGuyPath(guy: string) {
        return "/assets/characters/" + guy + ".svg";
    }

    function getStarPath(score: number) {
        let scoreIndex = 0;
        if (score >= 1 && score <=3) {
            scoreIndex = 1;
        } else if (score > 3 && score <=9) {
            scoreIndex = 2;
        } else if (score > 9 && score <=20) {
            scoreIndex = 3;
        } else if (score > 20) {
            scoreIndex = 4;
        }
        const starCount = ["zero", "one", "two", "three", "four", "five"];
        return "/assets/frames/" + starCount[scoreIndex] + "_star_frame.svg";
    }

    const guys = ["chick", "frog", "llama", "pig", "teddy_bear"];
    const starCount = ["zero", "one", "two", "three", "four", "five"];
    const userIdHash = sha256(userId);
    const guyIndex = parseInt(userIdHash.slice(0, 8), 16) % guys.length;
    

    return (
        <div className={cn("relative grid gird-rows-1 grid-cols-1" , className)} style={{width: size, height: size}} {...props}>
            <img className="absolute inset-0" src={getStarPath(score)} alt="Pin Frame" />
            <img className="absolute inset-0" src={getGuyPath(guys[guyIndex])} alt="Pin" />

        </div>
    );
}