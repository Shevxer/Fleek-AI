const express = require("express");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const axios = require("axios");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.post("/api/chatbot", async (req, res) => {
  try {
    // Get the prompt from the request body
    const { prompt } = req.body;
    console.log(prompt);
    // const response = await main(prompt);
    // Call the main function with the prompt
    const response = await main(prompt);

    // Send the response back to the client
    res.json({ response }); // For testing
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function main(prompt) {
  console.log("Prompt:", prompt);

  try {
    // Construct the request payload
    const payload = {
      question: prompt,
      knowledge_source_id: "0x7521b754a946844c720a4772f16b0574680223a8",
    };
    // Set the headers
    const headers = {
      "x-api-key": "54c488b4a94b415b989c19e0f29d199c",
      "Content-Type": "application/json", // Ensure API key is set in .env
    };

    // Send POST request using axios
    const response = await axios.post(
      "https://rag-chat-ml-backend-prod.flock.io/chat/conversational_rag_chat",
      payload,
      {
        headers,
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
