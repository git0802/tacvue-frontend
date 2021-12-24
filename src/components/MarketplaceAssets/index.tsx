import React, { useEffect, useState } from "react";
import {
  checkIsOwner,
  fetchAllMarketplaceItems,
  maticNFTpurchase,
  tokenNFTpurchase,
  fetchMyNFTs,
  fetchItemsCreated,
  createMarketplaceItem,
  approveNFT,
} from "@services/contract";
import { Button, Spinner, Modal } from "react-bootstrap";
import Image from "next/image";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "1rem",
  paddingTop: "1rem",
};

export default function MarketplaceAssets() {
  const [nfts, setNfts] = useState<Array<any>>([]);
  const [page, setPage] = useState("marketplace");
  const [isLoading, setLoading] = useState(true);
  const [currentNFT, setCurrentNFT] = useState<any>({});

  const [buyModalStatus, setBuyModalStatus] = useState(false);

  const handleCloseBuyModal = () => {
    setBuyModalStatus(false);
  };

  const [NFTModalstatus, setNFTModalStatus] = useState(false);

  const handleCloseNFTModal = () => {
    setNFTModalStatus(false);
  };

  useEffect(() => {
    loadNFTs();
  }, [page]);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      let items: Array<any> = [];
      if (page === "marketplace") {
        items = await fetchAllMarketplaceItems();
      } else if (page === "my assets") {
        items = await fetchMyNFTs();
      } else if (page === "my creations") {
        items = await fetchItemsCreated();
      }

      const result: any[] = [];
      for (let i = 0; i < items.length; i++) {
        const response = await fetch(items[i].tokenURI, {
          method: "GET",
        });
        const jsonData = await response.json();
        const attributes = jsonData.attributes;
        let status: any = {};
        if (attributes.eSignature) {
          status = await checkIsOwner(attributes.eSignature, items[i].tokenId);
        }

        result.push({
          tokenId: items[i].tokenId,
          saleID: items[i].saleID,
          image: jsonData.image.replace("ipfs://", "https://dweb.link/ipfs/"),
          name: attributes.name,
          creator: attributes.eSignature,
          description: attributes.description,
          price: attributes.price || 0,
          status: status,
        });
      }

      setNfts(result);
      setLoading(false);
    } catch (err) {
      console.log("Fetch all marketplace items: ", err);
      setLoading(false);
    }
  };

  const setCurrentInfo = (nft: any) => {
    setCurrentNFT(nft);
    console.log(nft);
  };

  const approve = async (tokenId: number) => {
    setLoading(true);
    try {
      await approveNFT(tokenId);
      setLoading(false);
    } catch (err) {
      console.log("NFT Approve Error: ", err);
      setLoading(false);
    }
  };

  const buyMaticNFT = async () => {
    setLoading(true);
    try {
      await maticNFTpurchase(currentNFT.saleID, currentNFT.price);
      window.location.reload();
    } catch (err) {
      console.log("Buy the NFT with Matic: ", err);
      setBuyModalStatus(false);
      setLoading(false);
    }
  };

  const buyTokenNFT = async () => {
    setLoading(true);
    try {
      await tokenNFTpurchase(currentNFT.saleID, currentNFT.price);
      window.location.reload();
    } catch (err) {
      console.log("Buy the NFT with token: ", err);
      setBuyModalStatus(false);
      setLoading(false);
    }
  };

  const showByModal = (nft: any) => {
    setBuyModalStatus(true);
    setCurrentInfo(nft);
  };

  const showDetailsInfo = async (nft: any) => {
    setNFTModalStatus(true);
    setCurrentInfo(nft);
  };

  const BuyModal = () => {
    return (
      <Modal show={buyModalStatus} centered onHide={handleCloseBuyModal}>
        <div className="p-30">
          <Modal.Body>
            <div className="pos-relative d-flex">
              <Button className="w-full rounded-3 m-3" size="lg" onClick={() => buyMaticNFT()}>
                Buy with Matic
              </Button>
            </div>
            <div className="pos-relative d-flex">
              <Button className="w-full rounded-3 m-3" size="lg" onClick={buyTokenNFT}>
                Buy with RXG token
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  };

  const NFTModal = () => {
    return (
      <Modal show={NFTModalstatus} centered onHide={handleCloseNFTModal}>
        <div className="p-30">
          <Modal.Body>
            <div className="pos-relative d-flex">
              <Image
                src={currentNFT.image}
                width={400}
                height={400}
                alt="responsive"
                loading="lazy"
              />
            </div>
            <div className="pos-relative d-flex">
              <p style={{ height: "25px" }} className="text-2xl font-semibold">
                Name: {currentNFT.name}
              </p>
            </div>
            <div className="pos-relative d-flex">
              <p style={{ height: "25px" }} className="text-2xl font-semibold">
                Creator: {currentNFT.creator}
              </p>
            </div>
            <div className="pos-relative d-flex">
              <p style={{ height: "25px" }} className="text-2xl font-semibold">
                Description: {currentNFT.description}
              </p>
            </div>
            <div className="pos-relative d-flex">
              <p style={{ height: "25px" }} className="text-2xl font-semibold">
                price: {currentNFT.price} MATIC
              </p>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  };

  const TabContent = () => {
    return (
      <div className="my-4">
        <Button className="mx-4 bg-transparent" onClick={() => setPage("marketplace")}>
          Marketplace
        </Button>
        <Button className="mx-4 bg-transparent" onClick={() => setPage("my assets")}>
          Owned by Me
        </Button>
        <Button className="mx-4 bg-transparent" onClick={() => setPage("my creations")}>
          Created by Me
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-100 d-flex justify-center">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else {
    if (nfts.length === 0) {
      return (
        <>
          <TabContent />
          <h1 className="px-20 py-10 text-3xl">No items in {page}</h1>
        </>
      );
    } else {
      return (
        <>
          <TabContent />
          <div className="flex justify-center">
            <div className="p-4">
              <div className="grid" style={grid}>
                {nfts.map((nft, i) => (
                  <div
                    key={i}
                    className="border border-secondary rounded shadow overflow-hidden text-center"
                  >
                    <Image
                      src={nft.image}
                      className="rounded py-4 cursor-pointer"
                      width={240}
                      height={260}
                      onClick={() => showDetailsInfo(nft)}
                    />
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
                      {nft.status.isSale && !nft.status.isOwner && (
                        <Button className="w-full" onClick={() => showByModal(nft)}>
                          Buy
                        </Button>
                      )}
                      {!nft.status.isSale && nft.status.isOwner && !nft.status.isApproved && (
                        <Button className="w-full" onClick={() => approve(Number(nft.tokenId))}>
                          Approve
                        </Button>
                      )}
                      {!nft.status.isSale && nft.status.isOwner && nft.status.isApproved && (
                        <Button className="w-full" onClick={() => createMarketplaceItem(1)}>
                          Sale
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BuyModal />
            <NFTModal />
          </div>
        </>
      );
    }
  }
}
