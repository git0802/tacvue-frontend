import { ethers, Contract } from "ethers";
import Terran721 from "artifacts/Terran721.json";
import Marketplace from "artifacts/Marketplace.json";
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  ERC721_CONTRACT_ADDRESS,
  ENTITY_ERC721_CONTRACT_ADDRESS,
} from "@utils/constants";

//ERC721Contract
export const getERC721Contract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(0);
  const ERC721Contract = new Contract(ERC721_CONTRACT_ADDRESS, Terran721.abi, signer);

  return ERC721Contract;
};

export const getEntityERC721Contract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(0);
  const EntityERC721Contract = new Contract(ENTITY_ERC721_CONTRACT_ADDRESS, Terran721.abi, signer);

  return EntityERC721Contract;
};

//ERC721Contract
export const getMarketplaceContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(0);
  const ERC721Contract = new Contract(MARKETPLACE_CONTRACT_ADDRESS, Marketplace.abi, signer);

  return ERC721Contract;
};

// The function to get user's Metamask wallet address
export const requestAccount = async () => {
  if (window.ethereum?.request) return window.ethereum.request({ method: "eth_requestAccounts" });

  throw new Error(
    "Missing install Metamask. Please access https://metamask.io/ to install extension on your browser"
  );
};

// The function to get account
export const getAccount = async () => {
  const [address] = await requestAccount();
  console.log("address: ", address);

  return address;
};

// The function to mint of Entity
export const handleMint = async (ipfsHash: string) => {
  const address = await getAccount();
  if (address) {
    const ERC721Contract = getERC721Contract();
    const tx: any = await ERC721Contract.mint(ipfsHash);
    await tx.wait();
  }
};

// The function to mint of Entity
export const handleEntityMint = async (ipfsHash: string) => {
  const address = await getAccount();
  if (address) {
    const EntityERC721Contract = getEntityERC721Contract();
    const tx: any = await EntityERC721Contract.mint(ipfsHash);
    await tx.wait();
  }
};

// The function to check exist card
export const checkEntityCardExist = async () => {
  const address = await getAccount();
  const EntityERC721Contract = getEntityERC721Contract();
  const balance = await EntityERC721Contract.balanceOf(address);
  if (Number(balance.toString()) === 0) {
    return false;
  } else return true;
};

// The function to get card data
export const getCardData = async () => {
  const address = await getAccount();
  const EntityERC721Contract = getEntityERC721Contract();
  const tokenId = await EntityERC721Contract.tokenOfOwnerByIndex(address, 0);
  const tokenURI = await EntityERC721Contract.tokenURI(tokenId);
  const response = await fetch(tokenURI, {
    method: "GET",
  });

  const jsonData = await response.json();
  console.log(jsonData);

  return jsonData;
};

// The function to create a new marketplace item
export const approve = async () => {
  const ERC721Contract = getERC721Contract();
  const address = await getAccount();
  const balance = await ERC721Contract.balanceOf(address);
  const tokenId = await ERC721Contract.tokenOfOwnerByIndex(address, Number(balance.toString()) - 1);
  const tx: any = await ERC721Contract.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId);
  await tx.wait();
};

// The function to create a new marketplace item
export const approveNFT = async (tokenId: number) => {
  const ERC721Contract = getERC721Contract();
  const tx: any = await ERC721Contract.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId);
  await tx.wait();
};

export const createMarketplaceItem = async (price: number) => {
  const ERC721Contract = getERC721Contract();
  const address = await getAccount();
  const balance = await ERC721Contract.balanceOf(address);
  const tokenId = await ERC721Contract.tokenOfOwnerByIndex(address, Number(balance.toString()) - 1);
  const MarketplaceContract = getMarketplaceContract();
  const tx: any = await MarketplaceContract.createMarketplaceItem(
    ERC721_CONTRACT_ADDRESS,
    tokenId,
    ethers.utils.parseEther(price.toString()),
    ethers.utils.parseEther(price.toString())
  );

  await tx.wait();
};

export const approveEntity = async () => {
  const EntityERC721Contract = getEntityERC721Contract();
  const address = await getAccount();
  const balance = await EntityERC721Contract.balanceOf(address);
  const tokenId = await EntityERC721Contract.tokenOfOwnerByIndex(
    address,
    Number(balance.toString()) - 1
  );
  const tx: any = await EntityERC721Contract.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId);
  await tx.wait();
};

export const createMarketplaceItemEntity = async (price: number) => {
  const EntityERC721Contract = getEntityERC721Contract();
  const address = await getAccount();
  const balance = await EntityERC721Contract.balanceOf(address);
  const tokenId = await EntityERC721Contract.tokenOfOwnerByIndex(
    address,
    Number(balance.toString()) - 1
  );
  const MarketplaceContract = getMarketplaceContract();
  const tx: any = await MarketplaceContract.createMarketplaceItem(
    ERC721_CONTRACT_ADDRESS,
    tokenId,
    ethers.utils.parseEther(price.toString()),
    ethers.utils.parseEther(price.toString())
  );

  await tx.wait();
};

// The function to fetch all Marketplace items
export const fetchAllMarketplaceItems = async () => {
  const ERC721Contract = getERC721Contract();
  const MarketplaceContract = await getMarketplaceContract();
  const items = await MarketplaceContract.fetchAllMarketplaceItems();
  const result: Array<any> = [];

  for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
    const tokenId = Number(items[i].tokenId.toString());
    const saleID = Number(items[i].saleID.toString());
    const tokenURI = await ERC721Contract.tokenURI(Number(tokenId.toString()));
    result.push({
      tokenId,
      saleID,
      tokenURI,
    });
  }

  return result;
};

// The function to buy the NFT
export const maticNFTpurchase = async (saleID: number, price: number) => {
  const MarketplaceContract = getMarketplaceContract();
  const tx: any = await MarketplaceContract.maticNFTpurchase(saleID, {
    value: ethers.utils.parseEther(price.toString()),
  });

  await tx.wait();
};

// The function to buy the NFT
export const tokenNFTpurchase = async (saleID: number, price: number) => {
  const MarketplaceContract = getMarketplaceContract();
  const tx: any = await MarketplaceContract.tokenNFTpurchase(saleID, {
    value: ethers.utils.parseEther(price.toString()),
  });

  await tx.wait();
};

// The function to get currently balance
export const getCurrentBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const address = getAccount();
  return Number(ethers.utils.formatEther(await provider.getBalance(address)));
};

// The function to check owner
export const checkIsOwner = async (eSignature: string, tokenId: number) => {
  const ERC721Contract = getERC721Contract();
  const address = await getAccount();
  const owner = await ERC721Contract.ownerOf(tokenId);
  const approvedAddress = await ERC721Contract.getApproved(tokenId);

  let status: any = {
    isSale: false,
    isOwner: false,
    isApproved: false,
  };

  if (approvedAddress.toUpperCase() === MARKETPLACE_CONTRACT_ADDRESS.toUpperCase()) {
    status.isApproved = true;
  }

  if (owner === MARKETPLACE_CONTRACT_ADDRESS) {
    status.isSale = true;
    if (address.toUpperCase() === eSignature.toUpperCase()) {
      status.isOwner = true;
    }
  } else {
    if (address.toUpperCase() === owner.toUpperCase()) {
      status.isOwner = true;
    }
  }

  return status;
};

// The function to get all NFT by creator
export const fetchItemsCreated = async () => {
  const address = await getAccount();
  const ERC721Contract = getERC721Contract();
  const items = await ERC721Contract.nftCreatedByUser(address);
  const result: Array<any> = [];

  for (let i = 0; i < items.length; i++) {
    const tokenId = Number(items[i].toString());
    const saleID = "";
    const tokenURI = await ERC721Contract.tokenURI(tokenId);
    result.push({
      tokenId,
      saleID,
      tokenURI,
    });
  }

  return result;
};

// The function to get all NFT by owner
export const fetchMyNFTs = async () => {
  let result: Array<any> = [];
  const ERC721Contract = getERC721Contract();
  const MarketplaceContract = getMarketplaceContract();
  let items = await MarketplaceContract.fetchMyNFTs();

  for (let i = 0; i < items.length; i++) {
    const tokenId = Number(items[i].tokenId.toString());
    const saleID = Number(items[i].saleID.toString());
    const tokenURI = await ERC721Contract.tokenURI(tokenId);
    result.push({
      tokenId,
      saleID,
      tokenURI,
    });
  }

  console.log(items);

  const address = await getAccount();
  const balance = await ERC721Contract.balanceOf(address);

  for (let i = 0; i < Number(balance.toString()); i++) {
    const tokenId = Number(await ERC721Contract.tokenOfOwnerByIndex(address, i));
    const saleID = "";
    const tokenURI = await ERC721Contract.tokenURI(tokenId);
    result.push({
      tokenId,
      saleID,
      tokenURI,
    });
  }

  return result;
};
