import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListsError, setShowListsError] = useState(false);
  const [userLists, setUserLists] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowAllLists = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListsError(true);
        return;
      }
      setUserLists(data);
    } catch (error) {
      setShowListsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListsError(true);
        return;
      }
      setUserLists((prev) => prev.filter((list) => list._id !== listingId));
    } catch (error) {
      setShowListsError(true);
    }
  };

  return (
   <div className="p-3 min-h-full border-b dark:bg-black">
     <div className="max-w-lg w-full mx-auto text-center">
        <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-600"> Error Image Upload</span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className="text-green-600">{`Uploading ${filePercent}%`}</span>
            ) : filePercent === 100 ? (
              <span className="text-green-600">Successfully Uploaded</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled::opacity-80"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <Link
            className="bg-green-600 text-white p-3 rounded-lg  uppercase text-center hover:opacity-95"
            to={"/create-listing"}
          >
            create listing
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-600 cursor-pointer"
          >
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-red-600 cursor-pointer">
            Sign Out
          </span>
        </div>
        <p className="text-red-600 mt-5">{error ? error : ""}</p>
        <p className="text-green-600 mt-5">
          {updateSuccess ? "User Updated successfully" : ""}
        </p>
        <button onClick={handleShowAllLists} className="text-blue-400 w-full ">
          Show Lists
        </button>
        <p className="text-red-600 mt-5">
          {showListsError ? "Error fetching listings" : ""}{" "}
        </p>

        {userLists && userLists.length > 0 && (
          <div className="">
            <h1 className="text-center my-7 font-semibold text-2xl">
              Your Lists
            </h1>
            {userLists.map((list) => (
              <div
                key={list._id}
                className="border rounded-lg p-3 my-2 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    className="h-16 w-16 object-contain"
                    src={list.images[0]}
                    alt="Listing cover"
                  />
                </Link>
                <Link
                  className="dark:text-white font-semibold flex-1 hover:underline truncate"
                  to={`/listing/${list._id}`}
                >
                  <p>{list.name} </p>
                </Link>
                <div className="gap-2 flex items-center dark:text-white">
                  <button onClick={() => handleDeleteListing(list._id)}>
                    <MdDelete className="" size={25} />
                  </button>
                  <button>
                    <Link to={`/update-listing/${list._id}`}>
                      <FaEdit className="" size={25} />
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
