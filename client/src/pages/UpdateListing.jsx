import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    name: "",
    description: "",
    location: "",
    type: "forRent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    furnished: false,
    parking: false,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.images.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, images: formData.images.concat(urls) });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "forSale" || e.target.id === "forRent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.images.length < 1)
        return setError("Please upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError(
          "Discounted price cannot be greater than regular price"
        );
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 min-h-full items-center flex justify-center dark:bg-black dark:text-white">
      <div className="p-3 max-w-4xl mx-auto dark:bg-black dark:text-white">
        <h1 className="text-3xl font-semibold text-center my-7 ">
          Update Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 "
        >
          <div className="flex flex-col gap-4 flex-1 ">
            <input
              className="border p-3 dark:text-black rounded-lg"
              type="text"
              id="name"
              placeholder="Name"
              minLength={10}
              maxLength={80}
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              className="border p-3 rounded-lg dark:text-black"
              type="text"
              id="description"
              placeholder="Description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              className="border p-3 rounded-lg dark:text-black"
              type="text"
              id="location"
              placeholder="Location"
              minLength={10}
              maxLength={100}
              required
              onChange={handleChange}
              value={formData.location}
            />

            <div className=" flex flex-wrap gap-4">
              <div className="flex gap-4">
                <input
                  className="w-5"
                  type="checkbox"
                  id="forSale"
                  onChange={handleChange}
                  checked={formData.type === "forSale"}
                />
                <span>For Sale</span>
              </div>
              <div className="flex gap-4">
                <input
                  className="w-5"
                  type="checkbox"
                  id="forRent"
                  onChange={handleChange}
                  checked={formData.type === "forRent"}
                />
                <span>For Rent</span>
              </div>
              <div className="flex gap-4">
                <input
                  className="w-5"
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-4">
                <input
                  className="w-5"
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-4">
                <input
                  className="w-5"
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 ">
              <div className="flex items-center gap-4">
                <input
                  className="p-3 border border-gray-300 rounded-lg dark:text-black"
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={5}
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Bed Rooms</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  className="p-3 border border-gray-300 rounded-lg dark:text-black"
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={5}
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Bath Rooms</p>
              </div>
              <div className="flex items-center gap-4 ">
                <input
                  className="p-3 border border-gray-300 rounded-lg dark:text-black"
                  type="number"
                  id="regularPrice"
                  min={50}
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className=" flex flex-col items-center ">
                  <p>Regular Price</p>
                  {formData.type === "forRent" && (
                    <span className="text-xs">(€ / month)</span>
                  )}
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-4 ">
                  <input
                    className="p-3 border border-gray-300 rounded-lg dark:text-black"
                    type="number"
                    id="discountedPrice"
                    min={0}
                    required
                    onChange={handleChange}
                    value={formData.discountedPrice}
                  />
                  <div className=" flex flex-col items-center">
                    <p>Discounted Price</p>
                    {formData.type === "forRent" && (
                      <span className="text-xs">(€ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images
              <span className="font-normal text-gray-500 ml-2">
                The first image will be the cover image ( Max 6 )
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="images/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="p-3 text-green-600 border border-green-700 uppercase rounded hover:shadow-lg disabled:opacity-80"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-500">
              {imageUploadError && imageUploadError}
            </p>

            {formData.images.length > 0 &&
              formData.images.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between items-center p-3 border border-gray-300 rounded-lg"
                >
                  <img
                    className="w-20 h-20 object-contain rounded-lg"
                    src={url}
                    alt="Listing Image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className=" p-3 text-red-500 hover:opacity-65"
                  >
                    Delete{" "}
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
            {error && <p className="text-red-500 mt-5">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};
