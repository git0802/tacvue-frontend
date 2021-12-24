import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CREATE_CARD, HQ } from "@models/routes";
import { checkEntityCardExist } from "@services/contract";
import BgVideo from "@components/BgVideo";

const bg = "/video/WormholeAfter2.mp4";

// import VideoSource from '/video/Womhole.mp4'
const EnterPortalPage: NextPage = () => {
  const router = useRouter();

  const setRouter = async () => {
    const isExist = await checkEntityCardExist();
    if (isExist) {
      router.push("/" + HQ);
    } else router.push("/" + CREATE_CARD);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRouter();
    }, 11000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <BgVideo videoSource={bg} loop={false} />
    </div>
  );
};

export default EnterPortalPage;
