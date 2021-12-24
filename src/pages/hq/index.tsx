import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getCardData, checkEntityCardExist } from "@services/contract";
import {
  MARKETPLACE,
  CONTROLCENTER,
  COMMUNICATIONS,
  CREATORLAB,
  CREATE_CARD,
} from "@models/routes";
import { LOGO_IMAGE } from "@styles/assets";
import { Spinner } from "react-bootstrap";

const HQPage: NextPage = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [isRotating, setRotating] = useState(true);
  const [backgroundSize, setBackgroundSize] = useState("background-contain");
  const [multiverseName, setMultiverseName] = useState("");
  const [multiverseTag, setMultiverseTag] = useState("");
  const [eSignature, setESignature] = useState("");
  const [cardType, setCardType] = useState("");
  const [multiverseBirthday, setMultiverseBirthday] = useState("");
  const [eYear, setEYear] = useState(0);
  const [nftCount, setNFTCount] = useState(0);
  const [photoFile, setPhotoFile] = useState("");

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

  // The card element
  const CardContent = () => {
    return (
      <div className="col-md-12">
        <SecondBorder />
        <div className="border-content w-100 second-step position-absolute h-100 border-line z-back text-center" />
        <div className="row mx-0">
          <div className="text-center col-md-4 pt-2 px-2">
            <div className="drop-card-content w-100 h-100 position-relative cursor-pointer">
              {photoFile !== "" && (
                <Image
                  src={photoFile}
                  className="card-photo"
                  layout="fill"
                  alt="responsive"
                  loading="lazy"
                />
              )}

              <div className="position-absolute m-1 top-0">
                <Image src={LOGO_IMAGE} width={20} height={20} alt="responsive" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="col-md-8 pt-2 px-2">
            <div className="col-md-12 col-sm-12 d-flex justify-center align-center h-100">
              <div className="w-100 d-flex justify-center align-center">
                <div className="card-text p-2">{multiverseName}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 pt-2 px-2">
          <div className="w-100">
            <div className="card-text fs-6 py-1">Tag: {multiverseTag}</div>
          </div>
          <div className="w-100">
            <div className="card-text py-1 fs-6 overflow-hidden">Signature: {eSignature}</div>
          </div>
          <div className="w-100">
            <div className="card-text py-1 fs-6">Type: {cardType}</div>
          </div>
        </div>
        <div className="col-md-12 p-0">
          <div className="row mx-1">
            <div className="col-md-5 px-0">
              <div className="w-100 text-center">
                <div className="card-text py-1 fs-7">{multiverseBirthday}</div>
                <div className="card-label py-1 fs-7">Birthday</div>
              </div>
            </div>
            <div className="col-md-3 px-0">
              <div className="w-100 text-center">
                <div className="card-text py-1 fs-7">{eYear}</div>
                <div className="card-label py-1 fs-7">E-Year</div>
              </div>
            </div>
            <div className="col-md-4 px-0">
              <div className="w-100 text-center">
                <div className="card-text py-1 fs-7">{nftCount}</div>
                <div className="card-label py-1 fs-7">NFT Count</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  useEffect(() => {
    checkPermission();

    setTimeout(() => {
      setRotating(false);
    }, 2000);

    async function getUserdata() {
      const jsonData = await getCardData();
      const attributes = jsonData.attributes;
      setMultiverseName(attributes.multiverseName);
      setMultiverseTag(attributes.multiverseTag);
      setMultiverseBirthday(attributes.multiverseBirthday);
      setMultiverseTag(attributes.multiverseTag);
      setESignature(attributes.eSignature);
      setEYear(attributes.eYear);
      setCardType(attributes.cardType);
      setNFTCount(attributes.nftCount);
      setPhotoFile(jsonData.image.replace("ipfs://", "https://dweb.link/ipfs/"));
    }

    getUserdata();

    const updateWindowDimensions = () => {
      if (window.innerWidth * 9 > window.innerHeight * 16) {
        setBackgroundSize("background-cover");
      } else {
        setBackgroundSize("background-contain");
      }
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <div className="he-100 d-flex justify-center align-center full-content col-md-12 position-relative">
      {isLoading ? (
        <Spinner animation="border" variant="info" />
      ) : (
        <>
          <div className="full-content position-absolute d-flex justify-center">
            <div className={`hq-content w-available z-back ${backgroundSize}`}></div>
          </div>
          <div className={`d-flex position-absolute w-100 px-0-5 ${backgroundSize}`}>
            <div className="justify-center d-flex align-center border border-light rounded-3 text-light hq-exchange">
              <div
                className="cursor-pointer w-100 h-100 d-flex justify-center align-center"
                onClick={() => router.push("/" + MARKETPLACE)}
              >
                Exchange
              </div>
            </div>
            <div className="justify-center d-flex align-center border border-light rounded-3 text-light hq-control-center">
              <div
                className="cursor-pointer w-100 h-100 d-flex justify-center align-center"
                onClick={() => router.push("/" + CONTROLCENTER)}
              >
                Control Center
              </div>
            </div>
            <div className={`w-18 position-relative hq-card ${isRotating ? "card-rotate" : ""}`}>
              <CardContent />
            </div>
            <div className="justify-center d-flex align-center border border-light rounded-3 text-light hq-communications">
              <div
                className="cursor-pointer w-100 h-100 d-flex justify-center align-center"
                onClick={() => router.push("/" + COMMUNICATIONS)}
              >
                Communications
              </div>
            </div>
            <div className="justify-center d-flex align-center border border-light rounded-3 text-light hq-creator-lab">
              <div
                className="cursor-pointer w-100 h-100 d-flex justify-center align-center"
                onClick={() => router.push("/" + CREATORLAB)}
              >
                Creator Lab
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HQPage;
