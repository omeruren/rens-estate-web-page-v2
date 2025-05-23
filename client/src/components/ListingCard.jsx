import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
export const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white mt-5 gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden dark:shadow-lg dark:hover:shadow-slate-50/70">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.images[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-200"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold truncate">{listing.name}</p>
          <div className="flex items-center gap-3">
            <MdLocationOn className="mt-2 border-b" size={25} />{" "}
            <p className="font-semibold truncate w-full">{listing.location}</p>
          </div>
          <p className="text-sm line-clamp-1">{listing.description}</p>
          <p className="text-lg font-semibold mt-2">
            €{" "}
            {listing.offer
              ? listing.discountedPrice.toLocaleString("eu-EU")
              : listing.regularPrice.toLocaleString("eu-EU")}
            {listing.type === "forRent" ? " / month" : ""}
          </p>
          <div className="">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </p>
              <p className="text-sm font-semibold">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
