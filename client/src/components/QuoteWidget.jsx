import React, { useState, useEffect } from "react";

const QuoteWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading,SF_loading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We switched to 'dummyjson.com' which is more reliable than 'quotable.io'
    fetch("https://dummyjson.com/quotes/random")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }
        return response.json();
      })
      .then((data) => {
        setQuote(data); // dummyjson returns { quote: "...", author: "..." }
        SF_loading(false);
      })
      .catch((err) => {
        console.error("Error fetching quote:", err);
        setError(err.message);
        SF_loading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4 text-gray-500">Loading daily quote...</div>;
  
  if (error) return <div className="text-center p-4 text-red-500">Could not load quote. (API Error)</div>;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 my-6 mx-auto max-w-lg rounded shadow-md">
      <p className="font-bold text-lg mb-2">Daily Inspiration:</p>
      <p className="italic text-gray-800">"{quote.quote}"</p>
      <p className="text-sm mt-2 text-right font-semibold">- {quote.author}</p>
    </div>
  );
};

export default QuoteWidget;