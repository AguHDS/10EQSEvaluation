const createTableFromJson = async (jsonData) => {
  const productRows = document.getElementById("productRows");
  productRows.innerHTML = "";

  //create row for each product using the json data
  jsonData.forEach((product, index) => {
    const row = document.createElement("tr");

    //check for falsy value on price
    const isPriceNull = product.our_price ? product.our_price : 0;

    row.innerHTML = `
      <td>
        <input 
          type="radio" 
          name="product" 
          value="${index}" 
        >
      </td>
      <td>${product.product_name}</td>
      <td>${isPriceNull}</td>
      <td>${product.category}</td>
      <td>${product.current_stock}</td>
      <td>${product.restock_threshold || "N/A"}</td>
      <td>${product.restock_date}</td>
      <td>${product.brand}</td>
    `;

    productRows.appendChild(row);
  });
};

const loadProducts = async () => {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    createTableFromJson(data);
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
  }
};

const compareWithOpenFoodFacts = async () => {
  const insightText = document.getElementById("insightText");

  // Get the selected product
  const selectedProductIndex = document.querySelector('input[name="product"]:checked')?.value;

  if (selectedProductIndex === undefined) {
    alert("You must select an item before comparing.");
    return;
  }

  // Load products from the CSV to get the selected product
  const response = await fetch("/api/products");
  const products = await response.json();
  const selectedProduct = products[selectedProductIndex];

  if (!selectedProduct) {
    alert("Product not found.");
    return;
  }

  // Ensure the `our_price` is a valid number
  const selectedPrice = selectedProduct.our_price ? selectedProduct.our_price : 0;

  insightText.innerHTML = "Wait a moment...";

  // Search the product in OpenFoodFacts
  try {
    const searchResponse = await fetch(`/api/products/search?product_name=${selectedProduct.product_name}`);
    
    if (searchResponse.status === 404) {
      const notFoundDiv = document.createElement("div");
      notFoundDiv.style.color = "red";
      notFoundDiv.innerHTML = `Product ${selectedProduct.product_name} has no related matches in OpenFoodFacts. Try another product.`;
      insightText.innerHTML = "";
      insightText.appendChild(notFoundDiv);
      return;
    }

    if (!searchResponse.ok) {
      const errorDiv = document.createElement("div");
      errorDiv.style.color = "red";
      errorDiv.innerHTML = "Error trying to search products in OpenFoodFacts. Try again later.";
      insightText.innerHTML = "";
      insightText.appendChild(errorDiv);
      throw new Error(`Error trying to search products in OpenFoodFacts: ${searchResponse.status}`);
    }

    const externalProducts = await searchResponse.json();

    // Show both products
    insightText.innerHTML = `
      <div>
        Selected product: <strong>${selectedProduct.product_name}</strong><br>
        Found product in OpenFoodFacts: <strong>${externalProducts[0].brands}</strong>
      </div>
    `;

    // Compare prices
    const externalPrice = externalProducts[0].rev;
    const comparisonDiv = document.createElement("div");

    if (externalPrice > selectedPrice) {
      comparisonDiv.style.color = "orange";
      comparisonDiv.innerHTML = `
        <p>The price of ${selectedProduct.product_name} ($${selectedPrice}) is lower than the market average ($${externalPrice}). You should increase it.</p>
      `;
    } else if (externalPrice < selectedPrice) {
      comparisonDiv.style.color = "orange";
      comparisonDiv.innerHTML = `
        <p>The price of ${selectedProduct.product_name} ($${selectedPrice}) is higher than the market average ($${externalPrice}). You should lower it.</p>
      `;
    } else {
      comparisonDiv.style.color = "green";
      comparisonDiv.innerHTML = `
        <p>The price of ${selectedProduct.product_name} ($${selectedPrice}) matches the market average ($${externalPrice}). It is well-adjusted.</p>
      `;
    }

    insightText.appendChild(comparisonDiv);

    // Log the data in the console
    console.log(`Results for "${selectedProduct.product_name}":`);
    console.log("Selected product:", selectedProduct);
    console.log("Found product in OpenFoodFacts:", externalProducts[0]);
  } catch (error) {
    console.error("Error comparing product.", error.message);
    alert("Error trying to compare product.");
  }
};

document.getElementById("compareButton").addEventListener("click", compareWithOpenFoodFacts);

loadProducts();
