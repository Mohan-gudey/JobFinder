// src/components/JobDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const JobDetails = ({ jobs }) => {
  const { id } = useParams();
  const job = jobs.find((job) => job.id === parseInt(id));

  if (!job) {
    return <div className="text-center text-gray-500">Job not found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg font-medium mb-2">{job.company}</p>
      <div className="flex items-center space-x-4 text-gray-600 mb-4">
        <span>⭐ {job.rating} | {job.reviews} Reviews</span>
        <span>₹ {job.salary}</span>
        <span>{job.location}</span>
      </div>
      <h2 className="text-xl font-bold mb-2">Job Description</h2>
      <p className="mb-4">{job.description}</p>
      <h2 className="text-xl font-bold mb-2">Requirements</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Experience: {job.experience}</li>
        <li>Type: {job.type}</li>
      </ul>
      <h2 className="text-xl font-bold mb-2">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {job.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 px-2 py-1 rounded text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-500 mt-4">Posted: {job.posted}</p>
    </div>
  );
};

export default JobDetails;