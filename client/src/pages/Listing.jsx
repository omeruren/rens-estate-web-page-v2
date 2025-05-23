import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaCouch,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { ContactLandlord } from "../components/ContactLandlord";

export const Listing = () => {
  SwiperCore.use([Navigation, Pagination, Thumbs, Keyboard]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("eu-EU", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const toggleFullscreen = (index) => {
    setFullscreenImageIndex(index);
  };

  return (
    <main className="dark:text-white dark:bg-black min-h-full">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}

      {listing && !loading && !error && (
        <>
          <Swiper navigation pagination modules={[Navigation, Pagination]}>
            {listing.images.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] cursor-pointer"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  onClick={() => toggleFullscreen(index)}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Fullscreen image modal */}
          {fullscreenImageIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col transition-opacity duration-300">
              {/* Kapatma alanı */}
              <div
                className="absolute inset-0 z-40"
                onClick={() => setFullscreenImageIndex(null)}
              ></div>

              {/* Çıkış butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImageIndex(null);
                }}
                className="absolute top-4 right-4 z-50 text-white text-3xl font-bold hover:scale-110 transition-transform duration-200"
              >
                &times;
              </button>

              <div className="relative z-50 w-full max-w-6xl mx-auto flex-grow flex flex-col justify-center">
                {/* 👉 Büyük Swiper yalnızca thumbsSwiper tanımlandığında render edilsin */}
                {thumbsSwiper && (
                  <Swiper
                    initialSlide={fullscreenImageIndex}
                    modules={[Navigation, Pagination, Thumbs, Keyboard]}
                    thumbs={{ swiper: thumbsSwiper }}
                    keyboard={{ enabled: true }}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full flex-grow"
                  >
                    {listing.images.map((url, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex justify-center items-center h-full">
                          <img
                            src={url}
                            alt={`Fullscreen ${index}`}
                            className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {/* Thumbs Swiper her zaman render edilsin */}
                <div className="w-full px-4 py-2 mt-2">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={6}
                    watchSlidesProgress
                    modules={[Thumbs]}
                  >
                    {listing.images.map((url, index) => (
                      <SwiperSlide key={`thumb-${index}`}>
                        <img
                          src={url}
                          alt={`Thumb ${index}`}
                          className="h-20 w-full object-cover rounded cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          )}

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className="dark:text-black fixed top-[20%] right-[3%] bg-slate-100 z-10 p-2">
              Link copied to clipboard
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3  gap-4">
            <p className="text-center text-3xl font-semibold">
              {listing.name} -{" "}
              {formatPrice(
               listing.regularPrice
              )}
              {listing.type === "forRent" && " / month"}
            </p>

            <div className="text-black dark:text-white text-xl flex items-center gap-2">
              <FaMapMarkerAlt size={25} className="border-b text-green-600" />
              <p className="font-bold">{listing.location}</p>
            </div>

            <div className="flex gap-4 mt-2">
              <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "forRent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {formatPrice( listing.discountedPrice)} DISCOUNT
                </p>
              )}
            </div>

            <p className="text-black dark:text-white text-justify text-lg">
              <span className="font-semibold">Description - </span>
              {listing.description}
            </p>

            <ul className="flex flex-wrap items-center mt-6 gap-4 sm:gap-6 text-lg">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBed size={25} />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : `${listing.bedrooms} Bedroom`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBath size={25} />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : `${listing.bathrooms} Bathroom`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaParking size={25} />
                {listing.parking ? (
                  <span className="text-green-500">Parking Spot</span>
                ) : (
                  <span className="text-red-500">No Parking Spot</span>
                )}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCouch size={25} />
                {listing.furnished ? (
                  <span className="text-green-500">Furnished</span>
                ) : (
                  <span className="text-red-500">Not Furnished</span>
                )}
              </li>
            </ul>

            {currentUser &&
              listing.userId !== currentUser._id &&
              !contactLandlord && (
                <button
                  onClick={() => setContactLandlord(true)}
                  className="mt-3 p-3 uppercase rounded-lg mb-2 dark:bg-slate-400 bg-slate-800 text-white"
                >
                  Contact to landlord
                </button>
              )}

            {contactLandlord && <ContactLandlord listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};
