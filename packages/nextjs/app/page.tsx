"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const [nextImage, setNextImage] = useState<string>("");
  const [bgImage, setBgImage] = useState<string>("");
  const [imageList, setImageList] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { data: contractSeed } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getSeed",
  });

  const { data: name } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "name",
  });

  const { data: blockNumber } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "blockNumber",
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();
        setImageList(data.images);

        const seed = Number(contractSeed) || 0;
        const initialIndex = Math.abs(seed) % data.images.length;
        const secondIndex = Math.abs(seed + 1) % data.images.length;
        const thirdIndex = Math.abs(seed + 2) % data.images.length;

        setCurrentImage(data.images[initialIndex]);
        setNextImage(data.images[secondIndex]);
        setBgImage(data.images[thirdIndex]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [contractSeed]);

  useEffect(() => {
    if (imageList.length === 0) return;

    const newSeed = Number(contractSeed) || 0;
    const nextIndex = Math.abs(newSeed) % imageList.length;
    const nextImageUrl = imageList[nextIndex];

    if (nextImageUrl === currentImage) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNextImage(nextImageUrl);

    timeoutRef.current = setTimeout(() => {
      setCurrentImage(nextImageUrl);
    }, 30);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [imageList, contractSeed, currentImage]);

  return (
    <>
      <div className="min-h-screen w-screen relative overflow-hidden bg-black">
        <div className="absolute top-0 left-0 p-4 text-white rubik-glitch-regular" style={{ zIndex: 10 }}>
          <p style={{ fontSize: "6rem" }}>{name?.toString()}</p>
        </div>
        <div className="absolute bottom-20 left-0 p-4 text-white rubik-glitch-regular" style={{ zIndex: 10 }}>
          <p style={{ fontSize: "2rem" }}>{blockNumber?.toString()}</p>
        </div>

        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Image src={bgImage} alt="Background image" fill className="object-cover" priority />
        </div>
        <div
          className="absolute inset-0"
          style={{
            opacity: 1,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Image src={currentImage} alt="Current image" fill className="object-cover" priority />
        </div>
        <div
          className="absolute inset-0"
          style={{
            opacity: 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Image src={nextImage} alt="Next image" fill className="object-cover" priority />
        </div>
      </div>
    </>
  );
};

export default Home;
