import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../lib/cloudinary/index";

export function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "/test/movies",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result!);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}
