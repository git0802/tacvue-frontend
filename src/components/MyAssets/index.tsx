import React, { useEffect, useState } from "react";
import { fetchMyNFTs } from "@services/contract";
import { Button } from "react-bootstrap";
import Image from "next/image";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "1rem",
  paddingTop: "1rem",
};

export default function MarketplaceAssets() {
  const [nfts, setNfts] = useState<Array<any>>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const items = await fetchMyNFTs();
    setNfts(JSON.parse(JSON.stringify(items)));
    console.log(items);
    console.log(items.length);
    setLoadingState("loaded");
  };

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items owned by me</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid" style={grid}>
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border border-secondary rounded shadow overflow-hidden text-center"
            >
              <Image src={nft.image} className="rounded py-4" width={240} height={260} />
              <div className="p-4">
                <p style={{ height: "25px" }} className="text-2xl font-semibold">
                  {nft.name}
                </p>
                <div style={{ height: "25px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">{nft.price} MATIC</p>
                <Button className="w-full">Buy</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
