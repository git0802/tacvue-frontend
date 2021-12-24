import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Modal } from "react-bootstrap";
import { ENTERPORTAL } from "@models/routes";
import { METAMASK_ICON } from "@styles/image";
import { WalletConnectTitle, WalletConnectSubTitle } from "@styles/pages/index";
import BgVideo from "components/BgVideo";

const HomePage: NextPage = () => {
  // Router
  const router = useRouter();

  // State managements
  const [walletAddress, setWalletAddress] = useState<any>(null); // user's Metamask wallet address
  const [show, setShow] = useState(false);
  // const [bg, setBG] = useState<any>("/video/WormholeLoop.mp4");

  const bg = "/video/WormholeLoop.mp4";

  // The function to load data from blockchain network
  const login = async () => {
    router.push("/" + ENTERPORTAL);
  };

  // The function to open modal
  const enter = () => {
    setShow(true);
  };

  // The function to close modal
  const handleClose = () => {
    setShow(false);
  };

  // The function to get modal
  const ModalContent = () => {
    return (
      <Modal show={show} centered onHide={handleClose}>
        <div className="p-30">
          <Modal.Header>
            <Modal.Title className="color-grey">
              <WalletConnectTitle>Sign in with your wallet</WalletConnectTitle>
              <WalletConnectSubTitle>
                Sign in with one of available wallet providers or create a new wallet. What is
                wallet?
              </WalletConnectSubTitle>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="pos-relative d-flex">
              <div className="pos-absolute wallet-icon">
                <Image src={METAMASK_ICON} width={25} height={25} alt="responsive" loading="lazy" />
              </div>
              <Button className="w-full br-25" size="lg" onClick={login}>
                Sign in with Metamask
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    setWalletAddress(localStorage.getItem("wallet-address"));
    console.log(walletAddress);
  }, []);

  return (
    <div>
      <BgVideo videoSource={bg} loop={true} />
      <div className="d-flex align-items-center justify-content-center text-center fullvHeight landing-page">
        <Button className="multiverse-btn" onClick={enter}>
          Enter the MultiVerse
        </Button>

        <ModalContent />
      </div>
    </div>
  );
};

export default HomePage;
