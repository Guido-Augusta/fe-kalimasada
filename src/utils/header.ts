export const getAuthHeaders = (isJson: boolean = true) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "x-platform": "web",
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};