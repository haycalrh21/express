import asyncHandler from "../middlewares/asyncHandler.js";

import ReferenceModel from "../models/referenceModel.js";

export const createReference = asyncHandler(async (req, res) => {
  const { name, link } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (!link || link.trim() === "") {
    return res.status(400).json({ message: "Link cannot be empty" });
  }

  const reference = new ReferenceModel({
    name,
    link,
    user: req.user._id,
  });
  await reference.save();
  res.status(201).json({ message: "Reference created successfully" });
});

export const getReference = asyncHandler(async (req, res) => {
  try {
    // const userId = req.user._id;
    const getData = await ReferenceModel.find({});
    // const getData = await ReferenceModel.find({ user: userId });
    res.status(200).json(getData);
  } catch (error) {
    res.status(500).json({ message: "Cannot get reference" });
  }
});
