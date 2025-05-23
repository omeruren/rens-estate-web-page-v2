import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ContactLandlord = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setLandlord(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userId]);

  return (
    <>
      {landlord && !loading && !error && (
        <div className="flex flex-col gap-2 mt-5">
          <p className="text-lg text-slate-500 font-semibold text-center dark:text-white">
            Contact <span className="text-slate-800  dark:text-blue-500"> {landlord.username} </span>{" "}
            for{" "}
            <span className="text-slate-800 dark:text-blue-500">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={3}
            value={message}
            onChange={handleChange}
            placeholder="Write your message here"
            className=" w-full border-2 border-gray-300 dark:text-black rounded-md p-2 mt-2 focus:outline-none focus:border-blue-500"
          ></textarea>
          <Link
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 text-center"
          to={`mailto:${landlord.email}?subject=Regarding about ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};
