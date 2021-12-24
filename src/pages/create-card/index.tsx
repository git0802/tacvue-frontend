import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Spinner, Modal, Button } from "react-bootstrap";
import { HQ } from "@models/routes";
import {
  handleEntityMint,
  approveEntity,
  getAccount,
  checkEntityCardExist,
} from "@services/contract";
import { uploadToIPFS } from "@services/general";
import { LOGO_IMAGE } from "@styles/assets";

const CreateCardPage: NextPage = () => {
  // Router
  const router = useRouter();

  // The state management
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mintStep, setMintStep] = useState(0);
  const [multiverseName, setMultiverseName] = useState("");
  const [multiverseTag, setMultiverseTag] = useState("");
  const [eSignature, setESignature] = useState("");
  const [cardType, setCardType] = useState("Entity");

  // The function to get current date
  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const birthday: string = mm + "-" + dd + ", " + yyyy;

    return birthday;
  };

  const [multiverseBirthday, setMultiverseBirthday] = useState(getCurrentDate());
  const [eYear, setEYear] = useState(0);
  const [nftCount, setNFTCount] = useState(0);

  const photoFileRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoFileURL, setPhotoFileURL] = useState("");

  // The function to upload Photo
  const uploadPhotoFile = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setPhotoFile(img);
      setPhotoFileURL(URL.createObjectURL(img));
    }
  };

  // The function to handle of upload Photo
  const handleUploadPhotoFile = () => {
    photoFileRef?.current?.click();
  };

  // The function to get address
  const setMintStepOne = async () => {
    setLoading(true);
    setMintStep(1);
    const address = await getAccount();
    setESignature(address);
    setLoading(false);
  };

  const [ipfsHash, setIpfsHash] = useState("");

  // The function to upload to IPFS
  const handleUpload = async () => {
    if (multiverseName !== "" && multiverseTag !== "" && eSignature !== "" && cardType !== "") {
      setLoading(true);
      const cardInfo = {
        multiverseName,
        multiverseTag,
        eSignature,
        cardType,
        multiverseBirthday: getCurrentDate(),
        eYear: 0,
        nftCount,
      };

      const ipfsHash = await uploadToIPFS(photoFile, cardInfo);
      console.log(ipfsHash);

      setIpfsHash(ipfsHash);
      setLoading(false);
      setMintStep(2);
    }
  };

  // The function for reset
  const reset = () => {
    setErrorMessage("");
    router.push("/");
  };

  // The function for mint
  const mint = async () => {
    setLoading(true);
    try {
      await handleEntityMint(ipfsHash);
      setShowModal(true);
    } catch (err: any) {
      console.error("Mint the card:   ", err);
    }

    setLoading(false);
  };

  // The border element for first and last step
  const FirstBorder = () => {
    return (
      <>
        <div className="w-100 h-100 position-absolute border-line first-step z-back clip-content" />
        <div className="top-left-border triangle position-absolute" />
        <div className="bottom-right-border triangle position-absolute" />
      </>
    );
  };

  // The border element for first and last step
  const SecondBorder = () => {
    return (
      <>
        <div className="w-100 h-100 position-absolute border-line second-step z-back clip-content" />
        <div className="top-right-border triangle position-absolute" />
        <div className="bottom-left-border triangle position-absolute" />
      </>
    );
  };

  // The Error content element
  const ErrorContent = () => {
    return (
      <div className="position-relative">
        <FirstBorder />
        <div className="border-content w-100 first-step position-absolute h-100 border-line z-back text-center" />
        <div className="text-center pt-4 px-5">
          <div className="card-text">{errorMessage}</div>
          <button className="card-button cursor-pointer" onClick={reset}>
            Continue
          </button>
        </div>
      </div>
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleApprove = async () => {
    setLoading(true);
    setShowModal(false);
    await approveEntity();
    setLoading(false);
    router.push("/" + HQ);
  };

  // The Modal element
  const ModalContent = () => {
    return (
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Approve the Entity Card</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleApprove}>
            Approve
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
      if (isExist) {
        router.push("/" + HQ);
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
    <div className="he-100 d-flex justify-center align-center full-content">
      <div className="full-content position-absolute d-flex justify-center">
        <div className="create-card-content w-available z-back"></div>
      </div>

      {isLoading ? (
        <Spinner animation="border" variant="info" />
      ) : errorMessage === "" ? (
        <div className="position-relative">
          {mintStep === 0 && (
            <>
              <FirstBorder />
              <div className="border-content w-100 first-step position-absolute h-100 border-line z-back text-center" />
              <div className="text-center pt-4 px-5">
                <div className="card-text">
                  Before you continue, create
                  <br /> your unique Entity to
                  <br /> represent you in the multiverse.
                </div>
                <button className="card-button cursor-pointer" onClick={setMintStepOne}>
                  Continue
                </button>
              </div>
            </>
          )}
          {mintStep === 1 && (
            <>
              <SecondBorder />
              <div className="border-content w-100 second-step position-absolute h-100 border-line z-back text-center" />
              <div className="d-flex">
                <div className="text-center col-md-4 pt-4 px-4">
                  <div
                    className="drop-content w-100 h-100 position-relative cursor-pointer"
                    onClick={handleUploadPhotoFile}
                  >
                    {photoFileURL !== "" && (
                      <Image
                        src={photoFileURL}
                        className="card-photo"
                        layout="fill"
                        alt="responsive"
                        loading="lazy"
                      />
                    )}
                    <input
                      type="file"
                      className="d-none"
                      name="myImage"
                      onChange={uploadPhotoFile}
                      ref={photoFileRef}
                    />
                    <div className="position-absolute m-1 top-0">
                      <Image
                        src={LOGO_IMAGE}
                        width={40}
                        height={40}
                        alt="responsive"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center col-md-8 pt-4 px-4">
                  <div className="col-md-12 col-sm-12">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div className="w-100">
                          <div className="card-text py-1">Multiverse Name</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={multiverseName}
                            onChange={(e) => setMultiverseName(e.target.value)}
                            autoFocus={true}
                          />
                        </div>
                        <div className="w-100">
                          <div className="card-text py-1">Tacvue Tag</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={multiverseTag}
                            onChange={(e) => setMultiverseTag(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="w-100">
                          <div className="card-text py-1">E-Signature</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={eSignature}
                            onChange={(e) => setESignature(e.target.value)}
                          />
                        </div>
                        <div className="w-100">
                          <div className="card-text py-1">Card Type</div>
                          <select
                            className="card-input w-available px-2"
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                          >
                            <option value="Entity" className="card-input w-available px-2">
                              Entity
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="w-100">
                          <div className="card-text py-1">Multiverse birthday</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={multiverseBirthday}
                            onChange={(e) => setMultiverseBirthday(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="w-100">
                          <div className="card-text py-1">Multiverse EYear</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={eYear}
                            onChange={(e) => setEYear(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="w-100">
                          <div className="card-text py-1">NFT Count</div>
                          <input
                            className="card-input w-available px-2"
                            type="text"
                            value={nftCount}
                            onChange={(e) => setNFTCount(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-100 text-center">
                <button className="card-button cursor-pointer" onClick={handleUpload}>
                  Continue
                </button>
              </div>
            </>
          )}
          {mintStep === 2 && (
            <>
              <FirstBorder />
              <div className="border-content first-step w-100 position-absolute h-100 border-line z-back text-center" />
              <div className="w-100 text-center">
                <div className="text-center pt-4 px-5">
                  <div className="card-text">
                    Once you mint your Entity
                    <br /> you cannot change it.
                    <br />
                    <br /> Do you want it proceed.?
                  </div>
                  <button className="card-button cursor-pointer" onClick={mint}>
                    Mint Entity
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <ErrorContent />
      )}
      <ModalContent />
    </div>
  );
};

export default CreateCardPage;
