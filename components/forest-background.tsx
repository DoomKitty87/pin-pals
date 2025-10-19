import { useEffect, useState } from "react";

const animals = [
  "/assets/characters/frog.svg",
  "/assets/characters/teddy_bear.svg",
  "/assets/characters/pig.svg",
  "/assets/characters/chick.svg",
  "/assets/characters/llama.svg",
];

export default function AnimalBackground() {
  const [animalPositions, setAnimalPositions] = useState([]);

  useEffect(() => {
    const positions = [];
    const numAnimals = 15; // number of animals to scatter

    for (let i = 0; i < numAnimals; i++) {
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const left = Math.random() * 95; // left position % (0-95%)
      const top = Math.random() * 95;  // top position % (0-95%)
      const size = 5 + Math.random() * 10; // size in vw (5-15vw)
      positions.push({ animal, left, top, size });
    }

    setAnimalPositions(positions);
}, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {animalPositions.map((a, index) => (
        <img
          key={index}
          src={a.animal}
          alt=""
          className="absolute"
          style={{
            left: `${a.left}%`,
            top: `${a.top}%`,
            width: `${a.size}vw`,
            height: `${a.size}vw`,
          }}
        />
      ))}
    </div>
  );
}
