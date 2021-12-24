/**
 * API file to upload to IPFS
 *
 * @package src/pages/api/upload
 * @version   1.0
 */

import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { UPLOAD_IMAGE_PATH } from "@utils/constants";
require("dotenv").config();
const fs = require("fs");

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, files) {
      // Save photoFile file.
      const photoFile = await saveImageFile(files.photoFile);
      const file = await fs.promises.readFile(photoFile);

      return res.status(200).json({
        photoFile: photoFile,
        file: file,
      });
    });
  } catch (error: any) {
    console.log("error");
  }
};

// The function to save image file on server
const saveImageFile = async (file: any) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`${UPLOAD_IMAGE_PATH}/image.png`, data);
  await fs.unlinkSync(file.filepath);

  return UPLOAD_IMAGE_PATH + "/image.png";
};

export default upload;
