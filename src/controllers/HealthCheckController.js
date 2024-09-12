const checkStatus = async (req, res) => {
  // You can perform any checks or logic here to determine the health status
  const isHealthy = true; // Example health check logic

  if (isHealthy) {
    res.status(200).json({ status: "ok" }); // Respond with HTTP 200 and a JSON indicating health
  } else {
    res.status(500).json({ status: "error" }); // Respond with HTTP 500 if not healthy
  }
};

module.exports = {
  checkStatus,
};
