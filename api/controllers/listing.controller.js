import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid listing ID"));
  }

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userId) {
      return next(
        errorHandler(403, "You are not allowed to update this listing")
      );
    }
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid listing ID"));
  }

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userId) {
      return next(
        errorHandler(403, "You are not allowed to update this listing")
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
     const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid listing ID"));
  }

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    if (offer === undefined || offer === 'false'){
      offer = {$in: [true, false]}
    }
    if (furnished === undefined || furnished === 'false'){
      furnished = {$in: [true, false]}
    }
    if (parking === undefined || parking === 'false'){
      parking = {$in: [true, false]}
    }
    if (type === undefined || type === 'all'){
      type = {$in: ['forSale', 'forRent']}
    }

    const searchTerm = req.query.searchTerm || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    const listings = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
    }).sort({[sortBy]:sortOrder}).limit(limit).skip(startIndex);
    return res.status(200).json(listings);

  } catch (error) {
    next(error);
    
  }
}
