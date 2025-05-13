// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from "./components/Header";
import JobCard from "./components/JobCard";
import JobDetails from "./components/JobDetails"; // New component for job details
import { jobs } from "./data";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) =>
    Object.values(job).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchTerm} />
        <main className="container mx-auto px-4 py-8 pt-24">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Jobs</h1>
          <Routes>
            {/* Job List Page */}
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/job/${job.id}`}
                      className="block"
                    >
                      <JobCard job={job} />
                    </Link>
                  ))}
                </div>
              }
            />

            {/* Job Details Page */}
            <Route
              path="/job/:id"
              element={<JobDetails jobs={jobs} />}
            />
          </Routes>
          {filteredJobs.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No jobs found. Try adjusting your search.
            </p>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;