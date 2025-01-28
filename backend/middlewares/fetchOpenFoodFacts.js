import axios from "axios";

//search products in OpenFoodFacts
export const fetchOpenFoodFacts = async (productName) => {
  try {
    const response = await axios.get("https://world.openfoodfacts.org/cgi/search.pl", {
      params: {
        search_terms: productName,
        search_simple: 1,
        action: "process",
        json: 1,
      },
      headers: {
        "User-Agent": "10EQSEvaluation - Node.js - Version 1.0",
      },
    });

    return response.data.products || [];
  } catch (error) {
    console.error("Error trying to consume the api, try again later.:", error.message);
    throw new Error("Error trying to consume the api, try again later.");
  }
};
