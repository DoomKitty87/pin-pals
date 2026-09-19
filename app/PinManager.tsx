'use client';

import  { useState } from "react";
import Pin from "@/components/pin/pin";
import FlippableCard from "@/components/flippable-card/FlippableCard"; 
import FlippableCardSide, { CardSide } from "@/components/flippable-card/FlippableCardSide";
import QRClient from "@/app/qrclient"; 
import { Card, CardHeader, CardTitle } from "@/components/ui/card";


interface PinType{
    user_id: string;
    times_interacted: number;
    other_user_id?: string;
}

interface PinManagerProps {
    initialPins: PinType[];
    userId: string;
    cookie: string;
}


export default function PinManager({initialPins, userId, cookie}: PinManagerProps) {
    const [pins, setPins] = useState<PinType[]>(initialPins);

    const refetchPins = async () => {
        const pinsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/getpins`, {
            headers: {
            cookie: cookie,
        },
        cache: 'no-store'});

        let pinsData: any = null;
        try {
            pinsData = await pinsRes.json();
            setPins(pinsData);
            console.log('Refetched pins data:', pinsData);
        } catch (e) {
            pinsData = { error: 'Invalid JSON response from /api/getpins' };
        } 
    };

    const handleFlip = (isFlipped: boolean) => {
        if (!isFlipped) {
            refetchPins();
        }
    };

    return (
    <div className="flex flex-col items-center w-full">

      <div className="mt-3 mb-3 flex flex-col items-center">
        <FlippableCard onFlip={handleFlip} className="w-[300px] h-[300px] flex flex-col items-center text-center text-2x1">
          <FlippableCardSide side={CardSide.FRONT} >
            <div className="relative -top-2 mb-2 text-2xl font-bold">
              <Pin userId={userId} size={300} score={0} allowMagnify={false} />
            </div>
          </FlippableCardSide>
          <FlippableCardSide side={CardSide.BACK} >
            <QRClient targetId={userId} />
          </FlippableCardSide>
        </FlippableCard>
        <label className="m-1 text-[20px]" style={{ marginBottom: "10px"}}>Press To Flip!</label>
      </div>

      <Card className="w-5/6 max-w-3xl mb-4">
        <CardHeader>
          <CardTitle className="text-2xl mb-0" style={{ marginBottom: '-35px', marginTop: '-5px'}}>My Collection</CardTitle>
        </CardHeader>
        <div style={{ padding: '20px'}}>
            <ul className="grid gap-3 grid-cols-3">
                {pins.map((pin: any, idx: number) => (
                    <li key={idx}><Pin allowMagnify={true} userId={pin.other_user_id === userId ? pin.user_id : pin.other_user_id} size={100} score={pin.times_interacted} /></li>
                ))}
            </ul>
            
        </div>
      </Card>
    </div>
    );


};