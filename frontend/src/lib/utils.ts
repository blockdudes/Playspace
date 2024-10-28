import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PinataSDK } from "pinata-web3"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "tomato-characteristic-quail-246.mypinata.cloud",
})


export const uploadImageToPinata = async (file: File) => {
  try {
    const upload = await pinata.upload.file(file);
    console.log(upload);
    return upload.IpfsHash;
  } catch (error) {
      console.error("Error uploading image to Pinata:", error);
      throw error;
  }
};