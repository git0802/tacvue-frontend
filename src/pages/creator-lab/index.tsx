import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import Nav from "components/Nav";
import Image from "next/image";
import {
  createMarketplaceItem,
  handleMint,
  approve,
  getCardData,
  getAccount,
  checkEntityCardExist,
} from "@services/contract";
import { uploadToIPFS } from "@services/general";
import { Button, Form, Spinner, Modal } from "react-bootstrap";
import router from "next/router";
import { CREATE_CARD, MARKETPLACE } from "@models/routes";

const comingSoon = "/images/ComingSoon.png";

const creatorLabButton = {
  background: "transparent",
  borderWidth: "1px",
  borderColor: "#65b2ca",
};

const formInput = {
  borderTopWidth: "0px",
  borderLeftWidth: "0px",
  borderRightWidth: "0px",
  borderBottomWidth: "1px",
};

const CreatorLab: NextPage = () => {
  const [marketplaceStatus, setMarketplaceStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("MATIC"); // Just using Matic for testing
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState(null);

  // The function to upload Photo
  const uploadPhotoFile = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setPhotoFile(img);
    }
  };

  const changeMarketplaceStatus = () => {
    setMarketplaceStatus((current) => !current);
    console.log(marketplaceStatus);
  };

  const handlePriceChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, "");
    setPrice(value);
  };

  const handleUpload = async () => {
    setLoading(true);
    if (name !== "" && description !== "" && photoFile !== null) {
      const jsonData = await getCardData();
      const creator = jsonData.multiverseName;
      const eSignature = await getAccount();
      const cardInfo = {
        name,
        description,
        currency,
        creator,
        eSignature,
        price,
      };

      const ipfsHash = await uploadToIPFS(photoFile, cardInfo);
      console.log(ipfsHash);

      try {
        await handleMint(ipfsHash);
      } catch (err: any) {
        setLoading(false);
        console.error("Mint the NFT: ", err);
      }

      if (marketplaceStatus) {
        setShowModal(true);
        setStep(0);
      } else {
        router.push("/" + MARKETPLACE);
      }
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/" + MARKETPLACE);
  };

  const handleModalConfirm = async () => {
    if (step === 0) {
      setLoading(true);
      try {
        await approve();
        setStep(1);
      } catch (err: any) {
        console.error("Approve: ", err);
        reset();
        setLoading(false);
      }
      setLoading(false);
    } else {
      setLoading(true);
      try {
        await createMarketplaceItem(price);
        reset();
      } catch (err: any) {
        console.error("Create a new Marketplace Item: ", err);
        reset();
        setLoading(false);
      }
      router.push("/" + MARKETPLACE);
      setLoading(false);
    }
  };

  const reset = () => {
    setMarketplaceStatus(false);
    setName("");
    setDescription("");
    setPrice(0);
    setShowModal(false);
    setStep(0);
  };

  const ModalContent = () => {
    return (
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{step === 0 ? "Approve the NFT" : "List to Marketplace"}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const checkPermission = async () => {
    try {
      setLoading(true);
      const isExist = await checkEntityCardExist();
      setLoading(false);
      if (!isExist) {
        router.push("/" + CREATE_CARD);
      }
    } catch (err: any) {
      console.log("Check Entity Card exit: ", err);
      router.push("/");
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="he-100 d-flex justify-center align-center">
          <Spinner animation="border" variant="info" />
        </div>
      ) : (
        <div className="text-light creator-lab-bg">
          <Nav />
          <div className="d-flex container min-h-screen mx-auto mt-4">
            {/* <ConnectWallet /> */}
            <div className="w-60 mx-auto">
              <div className="text-center">
                <h1>Creator Lab</h1>
                <div className="max-w-md px-4 py-8">
                  <div className="row my-4">
                    <div className="col text-end">
                      <Button style={creatorLabButton}>
                        <div>
                          <Image src={"/images/Single.png"} width={100} height={100} />
                        </div>
                        <div>Single (default)</div>
                      </Button>
                    </div>
                    <div className="col text-start">
                      <Button style={creatorLabButton}>
                        <div>
                          <Image src={"/images/ComingSoon.png"} width={100} height={100} />
                        </div>
                        <div>Multiple</div>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Form style={{ height: "100px" }}>
                      <Form.Group controlId="formFile" className="mb-3">
                        <h6>Upload Image File</h6>
                        <Form.Control
                          type="file"
                          className="bg-transparent"
                          ref={photoFileRef}
                          onChange={uploadPhotoFile}
                        />
                      </Form.Group>
                    </Form>
                  </div>

                  <div className="my-4">
                    <Form style={{ height: "100px" }}>
                      <h6>List on Marketplace? (Check if yes)</h6>
                      <Form.Check type="checkbox" onClick={() => changeMarketplaceStatus()} />
                    </Form>
                  </div>

                  <div className="mb-4">
                    <Form style={{ height: "100px" }}>
                      <Form.Group className="mb-3">
                        <h6>Enter price to allow users to instantly purchase your NFT</h6>
                        <div className="row w-100">
                          <div className="col w-75">
                            <Form.Control
                              className="bg-transparent text-light"
                              style={formInput}
                              value={price}
                              onChange={handlePriceChange}
                            />
                          </div>
                          <div className="col w-25">
                            <Form.Select
                              className="bg-transparent text-light"
                              style={formInput}
                              onChange={handlePriceChange}
                            >
                              <option value="matic" onClick={() => setCurrency("MATIC")}>
                                MATIC
                              </option>
                              <option value="rxg" onClick={() => setCurrency("RXG")}>
                                RXG
                              </option>
                            </Form.Select>
                          </div>
                        </div>
                      </Form.Group>
                    </Form>
                    <p className="text-start mb-3">Service Fee 2.5%</p>
                  </div>

                  <div className="row my-4">
                    <h6 className="py-2">Choose Collection</h6>
                    <div className="col text-end">
                      <Button style={creatorLabButton}>
                        <div>
                          <Image src={comingSoon} width={100} height={100} />
                        </div>
                        <div>Create New</div>
                      </Button>
                    </div>
                    <div className="col text-start">
                      <Button style={creatorLabButton}>
                        <div>
                          <Image src={"/images/ComingSoon.png"} width={100} height={100} />
                        </div>
                        <div>Terran NFT</div>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4 py-4">
                    <Form style={{ height: "100px" }}>
                      <Form.Group className="mb-3">
                        <h6>Name</h6>
                        <Form.Control
                          className="bg-transparent text-light"
                          style={formInput}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </div>

                  <div className="mb-4">
                    <Form style={{ height: "100px" }}>
                      <Form.Group className="mb-3">
                        <h6>Description</h6>
                        <Form.Control
                          className="bg-transparent text-light"
                          as="textarea"
                          rows={3}
                          style={formInput}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </div>

                  <div className="mb-4 py-4">
                    <Button onClick={handleUpload}>Mint</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalContent />
        </div>
      )}
    </>
  );
};

export default CreatorLab;
