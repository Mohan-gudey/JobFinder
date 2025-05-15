import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from "./components/Header";
import JobCard from "./components/JobCard";
import JobDetails from "./components/JobDetails";

const JOBS_PER_PAGE = 9;

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [remoteFilter, setRemoteFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract filter options
  const locations = [...new Set(jobs.map((job) => job.location))];
  const salaries = ["0-70k", "70k-100k", "100k-130k", "130k+"];
  const jobTypes = ["Full-time", "Internship"];
  const remoteOptions = ["Remote", "On-site"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://jobfinder-backend-kh46.onrender.com/api/jobs");
        if (!response.ok) throw new Error("Failed to load jobs");
        const data = await response.json();

        // Add fallback ID in case backend doesn't provide one
        const jobsWithId = data.map((job, index) => ({
          ...job,
          id: job.id || job._id || `fallback-${index}`,
        }));

        setJobs(jobsWithId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 🔍 Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = Object.values(job).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesLocation = locationFilter ? job.location === locationFilter : true;

    let matchesSalary = true;
    if (salaryFilter) {
      let min, max;
      switch (salaryFilter) {
        case "0-70k":
          min = 0;
          max = 70000;
          break;
        case "70k-100k":
          min = 70000;
          max = 100000;
          break;
        case "100k-130k":
          min = 100000;
          max = 130000;
          break;
        case "130k+":
          min = 130000;
          max = Infinity;
          break;
        default:
          break;
      }

      const jobMinSalary = parseInt(job.salary.split(" - ")[0].replace(/[^0-9]/g, ""));
      matchesSalary = jobMinSalary >= min && jobMinSalary <= max;
    }

    const matchesJobType = jobTypeFilter.length > 0
      ? jobTypeFilter.some((type) => job.type === type)
      : true;

    const matchesRemote = remoteFilter.length > 0
      ? remoteFilter.some((mode) => (job.remote ? "Remote" : "On-site") === mode)
      : true;

    return matchesSearch && matchesLocation && matchesSalary && matchesJobType && matchesRemote;
  });

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error fetching jobs: {error}
      </div>
    );
  }

  if (loading || jobs.length === 0) {
    return (
      <div className="text-center py-10">Loading jobs...</div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header onSearch={setSearchTerm} />
        <main className="container mx-auto px-4 py-8 pt-24">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Jobs</h1>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Filters</h2>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Location</h3>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Salary</h3>
                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">All Salaries</option>
                  {salaries.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 cursor-pointer">
                  Job Type <span className="text-sm text-gray-500">({jobTypeFilter.length})</span>
                  <button
                    type="button"
                    onClick={() => setJobTypeFilter([])}
                    className="float-right text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </h3>
                <div>
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={jobTypeFilter.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setJobTypeFilter([...jobTypeFilter, type]);
                          } else {
                            setJobTypeFilter(jobTypeFilter.filter((t) => t !== type));
                          }
                        }}
                        className="mr-2"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Work */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 cursor-pointer">
                  Work Mode <span className="text-sm text-gray-500">({remoteFilter.length})</span>
                  <button
                    type="button"
                    onClick={() => setRemoteFilter([])}
                    className="float-right text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </h3>
                <div>
                  {remoteOptions.map((mode) => (
                    <label key={mode} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={remoteFilter.includes(mode)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRemoteFilter([...remoteFilter, mode]);
                          } else {
                            setRemoteFilter(remoteFilter.filter((m) => m !== mode));
                          }
                        }}
                        className="mr-2"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Job Results */}
            <section className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        {paginatedJobs.map((job) => (
                          <Link key={job.id} to={`/job/${job.id}`} className="block">
                            <JobCard job={job} />
                          </Link>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${
                              currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            Prev
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${
                              currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  }
                />
                <Route path="/job/:id" element={<JobDetails />} />
              </Routes>

              {/* No Jobs Found */}
              {filteredJobs.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                  No jobs found. Try adjusting your search or filters.
                </p>
              )}
            </section>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;