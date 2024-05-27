import React, { useState, useEffect } from "react";

// Create a component to fetch and hold API data
const ApiDataProvider = ({ children }) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
            "http://127.0.0.1:8000/account/user/profile/",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setApiData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if data fetching fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pass API data as props to child components
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { apiData })
  );
};

export default ApiDataProvider;
