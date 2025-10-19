"use client";
import { cn } from "@/lib/utils";
import { createHash } from "crypto";
import { parse } from "path";
import { useState } from "react";

interface PinProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string;
    score: number;
    size?: number | string;
}

export default function Pin({userId, score, size=100, className, ...props}: PinProps) {
    const [active, setActive] = useState(false);

    function sha256(str: string) {
        return createHash("sha256").update(str).digest("hex");
    }

    function getGuyPath(guy: string) {
        return "/assets/characters/" + guy + ".svg";
    }

    function getHatPath(hat: string) {
        return "/assets/hats/" + hat + ".svg";
    }

    function getAccessoryPath(accessory: string) {
        return "/assets/images/" + accessory + ".svg";
    }

    function getStarPath(score: number) {
        let scoreIndex = 0;
        if (score >= 1 && score <=2) {
            scoreIndex = 1;
        } else if (score > 2 && score <=7) {
            scoreIndex = 2;
        } else if (score > 7 && score <=15) {
            scoreIndex = 3;
        } else if (score > 15 && score <=25) {
            scoreIndex = 4;
        } else if (score > 25) {
            scoreIndex = 5;
        }
        const starCount = ["zero", "one", "two", "three", "four", "five"];
        return "/assets/frames/" + starCount[scoreIndex] + "_star_frame.svg";
    }

    const guys = [{
        name: "chick",
        hatTransform: "translateY(-16%)",
        accessoryTransform: "translateX(-15%) rotate(-20deg)",
    }, {
        name: "frog",
        hatTransform: "rotate(-15deg) translateY(-17%) scale(0.8) translateX(2%)",
        accessoryTransform: "translateX(-20%) rotate(-25deg) translateY(8%)",
    }, {
        name: "llama",
        hatTransform: "rotate(-8deg) translateY(-22%)",
        accessoryTransform: "rotate(35deg) translateY(18%) translateX(8%)",
    }, {
        name: "pig",
        hatTransform: "translateY(-25%)",
        accessoryTransform: "translateX(-11%)",
    }, {
        name: "teddy_bear",
        hatTransform: "translateY(-22%) rotate(-8deg) scale(0.8)",
        accessoryTransform: "translateX(-15%) rotate(-15deg) translateY(5%)",
    }]
    const hats = [{
        name: "none",
        transform: "",
    }, {
        name: "beanie",
        transform: "scale(0.2)",
    }, {
        name: "bucket-hat",
        transform: "scale(0.25) rotate(-8deg) translateY(8%)",
    },
    {
        name: "sun-hat-1",
        transform: "scale(0.3) translateY(13%)",
    },
    {
        name: "sun-hat",
        transform: "scale(0.3) rotate(-23deg) translateY(15%)",
    },
    {
        name: "witch-hat",
        transform: "scale(0.25)",
    }];
    const accessories = [
        {
            name: "none",
            transform: "",
        },
        {
            name: "umbrella",
            transform: "scale(0.4) rotate(-10deg) translateY(-30%)",
        },
        {
            name: "coffee",
            transform: "scale(0.2) rotate(-5deg)",
        },
        {
            name: "flower",
            transform: "scale(0.15) translateY(-20%)",
        },
        {
            name: "magic-wand",
            transform: "scale(0.2) translateY(-18%)",
        },
        {
            name: "phone",
            transform: "scale(0.2) translateY(10%) rotate(-15deg)",
        }
    ];

    const userIdHash = sha256(userId);
    const guyIndex = parseInt(userIdHash.slice(0, 8), 16) % guys.length;
    const hatIndex = parseInt(userIdHash.slice(16, 24), 16) % hats.length;
    const accessoryIndex = parseInt(userIdHash.slice(32, 40), 16) % accessories.length;

    return (
        <div className={cn("relative grid gird-rows-1 grid-cols-1" , className, active && "magnified")} style={{width: size, height: size, transition: 'all 0.25s'}} {...props} onClick={score == 0 ? undefined : () => setActive(!active)}>
            <img className="absolute inset-0" src={getStarPath(score)} alt="Pin Frame" />
            <img className="absolute inset-0" src={getGuyPath(guys[guyIndex].name)} style={{ filter: `hue-rotate(${parseInt(userIdHash.slice(8, 16), 16) % 360}deg)` }} alt="Pin" />
            {hats[hatIndex].name !== "none" ? <img className="absolute inset-0" src={getHatPath(hats[hatIndex].name)} style={{ transform: guys[guyIndex].hatTransform + " " + hats[hatIndex].transform, filter: `hue-rotate(${parseInt(userIdHash.slice(24, 32), 16) % 360}deg)` }} alt="Hat" /> : null}
            {accessories[accessoryIndex].name !== "none" ? <img className="absolute inset-0" src={getAccessoryPath(accessories[accessoryIndex].name)} style={{ transform: guys[guyIndex].accessoryTransform + " " + accessories[accessoryIndex].transform, filter: `hue-rotate(${parseInt(userIdHash.slice(40, 48), 16) % 360}deg)` }} alt="Accessory" /> : null}
        </div>
    );
}