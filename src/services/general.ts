import { NFTStorage, File } from "nft.storage";
import formidable from "formidable";
const NFT_STORAGE_TOKEN: string = process.env.NFT_STORAGE_TOKEN || "";

// function for get error message from metamask
export const showErrorMessage = (message: string, err: any) => {
  let error_status = JSON.parse(JSON.stringify(err));
  let error_message = "";
  if (error_status.message) {
    error_message = error_status.message;
  } else {
    error_message = error_status.error.message;
  }

  error_message = error_message.replace("execution reverted: ", "");
};

// The function to upload to IPFS
export const uploadToIPFS = async (photoFile: any, jsonData: any) => {
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const metadata = await client.store({
    name: jsonData.name || jsonData.multiverseName || "",
    description: jsonData.description || jsonData.eSignature || "",
    image: new File([photoFile], "image", { type: "image/png" }),
    attributes: jsonData,
  });

  const ipfsHash = await metadata.url;

  return ipfsHash.replace("ipfs://", "https://dweb.link/ipfs/");
};
