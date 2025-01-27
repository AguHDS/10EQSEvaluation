document.addEventListener("DOMContentLoaded", () => {
  console.log("Frontend corriendo correctamente.");
});

const doFetch = async () => {
  const response = await fetch("http://localhost:3001/api/saludo");
  if (!response.ok) {
    const responseError = await response.json();
    console.log(responseError.message);
    throw new Error("Something went wrong");
  }
  const responseData = await response.json();
  console.log(responseData.message);
};
doFetch();
