"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { Header } from "~~/components/Header";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { data: blockNumber } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "blockNumber",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "owner",
  });

  const { data: previous } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "previous",
  });

  const { data: previousPrevious } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "previousPrevious",
  });

  const { data: previousPreviousPrevious } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "previousPreviousPrevious",
  });

  const { data: contractName } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "name",
  });

  const { data: yourContractInfo } = useDeployedContractInfo("YourContract");

  const { data: price } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "price",
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleBuy = async () => {
    try {
      await writeYourContractAsync({
        functionName: "buy",
        value: price || 0n,
      });
    } catch (error) {
      console.error("Error buying position:", error);
    }
  };

  // Fetch images once on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();
        setImageList(data.images);

        const seed = Number(blockNumber) || 0;
        const initialIndex = Math.abs(seed) % data.images.length;
        setCurrentImage(data.images[initialIndex]);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images");
      }
    };

    fetchImages();
  }, [blockNumber]);

  // Handle image transitions when blockNumber changes
  useEffect(() => {
    if (imageList.length === 0) return;

    const newSeed = Number(blockNumber) || 0;
    const nextIndex = Math.abs(newSeed) % imageList.length;
    const nextImageUrl = imageList[nextIndex];

    // Fade to white
    setOpacity(0.5);

    // Change image and fade in after transition
    setTimeout(() => {
      setCurrentImage(nextImageUrl);
      setOpacity(1);
    }, 200);
  }, [blockNumber, imageList]);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-black">
      <Header />
      {error && <div className="absolute top-5 left-5 text-red-500 bg-white/80 p-2 rounded">{error}</div>}
      <div className="absolute top-5 left-5 flex flex-col gap-2" style={{ zIndex: 50 }}>
        <h1 className="text-white text-4xl rubik-glitch-regular m-0">{contractName}</h1>
        <Address address={yourContractInfo?.address} />
      </div>
      <div className="absolute bottom-0 left-0 p-5 text-white rubik-glitch-regular" style={{ zIndex: 10 }}>
        <p style={{ fontSize: "2rem" }}>{blockNumber?.toString()}</p>
      </div>

      <div className="fixed bottom-5 right-5 flex flex-col gap-2 items-end" style={{ zIndex: 10 }}>
        <button
          className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg text-lg mb-2 w-full"
          onClick={handleBuy}
        >
          Buy for {price ? `${Number(price) / 10 ** 18} ETH` : "..."}
        </button>
        {owner && (
          <div className="scale-125 bg-white bg-opacity-30 px-2 py-1 rounded-lg">
            <Address address={owner} size="xl" />
          </div>
        )}
        {previous && (
          <div className="scale-100 bg-white bg-opacity-20 px-2 py-1 rounded-lg">
            <Address address={previous} size="lg" />
          </div>
        )}
        {previousPrevious && (
          <div className="scale-90 bg-white bg-opacity-15 px-2 py-1 rounded-lg">
            <Address address={previousPrevious} size="base" />
          </div>
        )}
        {previousPreviousPrevious && (
          <div className="scale-75 bg-white bg-opacity-10 px-2 py-1 rounded-lg">
            <Address address={previousPreviousPrevious} size="sm" />
          </div>
        )}
      </div>

      {/* White background for fade transition */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          opacity: 1 - opacity,
          transition: "opacity 1s ease-in-out",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: opacity,
          transition: "all 1s ease-in-out",
          filter: `blur(${(1 - opacity) * 10}px)`,
        }}
      >
        {currentImage && <Image src={currentImage} alt="Current image" fill className="object-cover" priority />}
      </div>
    </div>
  );
};

export default Home;
