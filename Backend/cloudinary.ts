import { v2 as cloudinary } from "cloudinary";
import { NextFunction } from "express";

export const cloudinaryconfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARY_CLOUDAPISECRET,
    secure: true,
  });
};
