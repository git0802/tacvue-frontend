import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import Welcome from "@components/Welcome";
import Nav from "@components/Nav";
import MarketplaceAssets from "@components/MarketplaceAssets";
import { checkEntityCardExist } from "@services/contract";
import { CREATE_CARD } from "@models/routes";

const MarketplacePage: NextPage = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

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
    <div className="text-light creator-lab-bg text-center">
      {isLoading ? (
        <div className="full-content d-flex justify-center align-center">
          <Spinner animation="border" variant="info" />
        </div>
      ) : (
        <>
          <Nav />
          <Welcome />
          <MarketplaceAssets />
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
