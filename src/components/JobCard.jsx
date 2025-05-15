// src/components/JobCard.jsx
import React from "react";
import { PiBagSimple } from "react-icons/pi";
import { LuIndianRupee } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer">
      {/* Company Logo and Title */}
      <div className="flex items-start justify-between p-4">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="text-sm font-medium">
            {job.company}{" "}
            
          </p>
        </div>
        {/* Company Logo */}
        <img
          src={job.image} // Replace with actual logo URL
          alt={job.company}
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>

      {/* Job Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-4 text-gray-600">
          {/* Experience */}
          <span className="flex items-center gap-1">
            <PiBagSimple />

            {job.experience}
          </span>

          {/* Salary */}
          <span className="flex items-center">
            <LuIndianRupee />
             {job.salary}
          </span>

          {/* Location */}
          <span className="flex items-center">
            <CiLocationOn /> 
             {job.location}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mt-2">
          {job.description || "No description available."}
        </p>

        {/* Tags */}
        <div className="mt-2 flex space-x-2 text-xs text-gray-500">
          {job.tags?.map((tag, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Posted Time */}
        <p className="mt-2 text-xs text-gray-400">Posted: {job.posted}</p>
      </div>
    </div>
  );
};

export default JobCard;