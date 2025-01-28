import path from "path";
import fs from "fs";
import csv from "csvtojson";
import { fetchOpenFoodFacts } from "../middlewares/fetchOpenFoodFacts.js";

//controller to obtain all the products from the csv file
export const getProducts = async (req, res) => {
  try {
    const csvFilePath = path.join(path.resolve(), "../frontend/data/products.csv");

    //verify the csv exist
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({ error: "CSV file not available" });
    }

    //convert csv to json
    const jsonArray = await csv().fromFile(csvFilePath);

    return res.json(jsonArray);
  } catch (error) {
    console.error("Error trying to process csv file:", error.message);
    res.status(500).json({ error: "Error trying to process csv file" });
  }
};

//controller to search product in OpenFoodFacts
export const searchProduct = async (req, res) => {
  const productName = req.query.product_name;

  if (!productName) {
    return res.status(400).json({ error: "parameter product_name is mandatory" });
  }

  try {
    //calling middleware to do search
    const products = await fetchOpenFoodFacts(productName);

    if (products.length === 0) {
      return res.status(404).json({ error: `not products found for:: ${productName}` });
    }

    return res.json(products);
  } catch (error) {
    console.error("Error sarching for products in OpenFoodFacts:", error.message);
    res.status(500).json({ error: "Error sarching for products in OpenFoodFacts" });
  }
};
