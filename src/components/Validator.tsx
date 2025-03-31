import React from "react";
import { motion } from "framer-motion";
import { Check, X, Square, ClipboardList, ThumbsUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Validator = () => {
  const handleVote = (status) => {
    toast.success(`Post ${status}`);
  };

  return (
    <div className="p-6">
      {/* Top Boxes - Displays various statistics and controls */}
      <div className="flex justify-between mb-6">
        {[
          {
            title: "Validator",
            icon: Square,
            extra: (
              <div className="flex gap-2 mt-2">
                <button className="text-white bg-green-600 px-2 py-1 border rounded-lg">
                  Yes
                </button>
              </div>
            ),
          },
          { title: "Post Assigned", icon: ClipboardList, value: "10" },
          { title: "Post Voted", icon: ThumbsUp, value: "10" },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-4 w-60 text-center shadow-lg rounded-2xl bg-white flex flex-col items-center"
          >
            {/* Display icon, title, and additional values if available */}
            <item.icon className="w-10 h-10 mb-2" />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            {item.value && <p className="text-xl font-bold mt-1">{item.value}</p>}
            {item.extra && item.extra}
          </motion.div>
        ))}
      </div>

      {/* Sample Instagram Post - Represents a validation interface for posts */}
      <div className="max-w-lg mx-auto shadow-lg rounded-2xl overflow-hidden bg-white p-4">
        <div className="mb-4">
          {/* Display username */}
          <h3 className="font-semibold">@sampleuser</h3>
        </div>
        {/* Image associated with the post */}
        <img
          src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
          alt="Instagram Post"
          className="w-full h-64 object-cover rounded-lg"
        />
        {/* Caption of the post */}
        <p className="mt-2">This is a sample Instagram post caption.</p>

        {/* Accept and Decline buttons */}
        <div className="flex justify-between mt-4">
          <button
            className="text-green-600 border-green-600 flex items-center px-4 py-2 border rounded-lg"
            onClick={() => handleVote("Accepted")}
          >
            <Check className="mr-2" /> Accept
          </button>
          <button
            className="text-red-600 border-red-600 flex items-center px-4 py-2 border rounded-lg"
            onClick={() => handleVote("Declined")}
          >
            <X className="mr-2" /> Decline
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Validator;
