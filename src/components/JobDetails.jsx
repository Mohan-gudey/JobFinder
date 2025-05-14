import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!job) {
    return <div className="text-center text-gray-500 py-10">Job not found.</div>;
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
          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-500 mt-4">Posted: {job.posted}</p>
    </div>
  );
};

export default JobDetails;