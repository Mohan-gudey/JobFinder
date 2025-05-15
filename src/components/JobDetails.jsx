import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleBackClick = () => {
      navigate(-1); // This will navigate to the previous page
    };
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`https://jobfinder-backend-kh46.onrender.com/api/jobs/${id}`);
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
    <div>
       <button
        onClick={handleBackClick}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 px-4 py-2 rounded mb-2"
      >
        <IoArrowBack /> Back to Job Listings
      </button>
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg font-medium mb-2">{job.company}</p>
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
      <button
        onClick={() => window.open(job.applyLink, "_blank")}
        className="bg-blue-500 px-3 py-2 mt-5 rounded-lg text-white"
      >
        Apply Now
      </button>
    </div>
    </div>
  );
};

export default JobDetails;