import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ListingCard } from "../components/ListingCard";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Pagination, Autoplay]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("api/listing/get?type=forRent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("api/listing/get?type=forSale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="dark:bg-black">
      <Swiper
        className=""
        navigation
        pagination
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        //loop={true}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                data-swiper-autoplay="2000"
                style={{
                  background: `url(${listing.images[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[650px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="mt-5 text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-400 text-center">
          {" "}
          Find Your Dream Home With <br />
          <span className="text-blue-600">Rens Estate</span>
        </h1>
        <div className="text-slate-600 text-center text-xs sm:text-lg mt-5">
          Reach millions of buyers, sellers and renters on the largest real
          estate network on the web.{" "}
        </div>
        <Link
          to="/search"
          className=" text-blue-900 text-center font-semibold hover:underline mt-5"
        >
          Let's Get Started
        </Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 ">
        {offerListings && offerListings.length > 0 && (
          <div className="pt-5 border-b-2 border-b-slate-300">
            <div className="mb-5">
              <h2 className="text-4xl font-semibold text-center dark:text-white tracking-wider">
                Recent Offers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="text-center mt-10 mb-5">
              <Link
                className="text-center text-sm sm:text-xl text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more Offers
              </Link>
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=" pt-5 border-b-2 border-b-slate-300">
            <div className="my-3 text-center mt-5 mb-5 tracking-wider">
              <h2 className="text-4xl font-semibold text-center dark:text-white tracking-wider">Recent Places for Rent</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {rentListings.map((listing) => (
                <ListingCard  listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="text-center mt-10 mb-5">
              <Link
                className="text-center text-sm sm:text-xl text-blue-800 hover:underline"
                to={"/search?type=forRent"}
              >
                Show more Places
              </Link>
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="pt-5 ">
            <div className="my-3 text-center mt-5 mb-5">
              <h2 className="text-base md:text-4xl font-semibold text-center dark:text-white tracking-wider">Recent Places for Sale</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="text-center mt-10 mb-5">
              <Link
                className="text-center text-sm sm:text-xl text-blue-800 hover:underline"
                to={"/search?type=forSale"}
              >
                Show more Places
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
