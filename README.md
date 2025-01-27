# Ad Performance Analyzer Backend
This is the backend of an Ad Performance Analyzer web application built using Node.js & Express.js leveraging LangChain LLM framework & OpenAI LLM API.

---

## Features
- **File Processing:** Accept CSV input files for bulk ad data processing.
- **Ad Performance Summary:** Generate concise summaries of ad performance based on input data.
- **Suggestions for Improvement:** Provide actionable insights to enhance ad performance.
- **Keyword Analysis:** Identify high-performing and low-performing keywords.

---

## Tech Stack
- **Node.js:** JavaScript runtime for building server-side applications.
- **Express.js:** Web framework for handling API routes.
- **Multer:** Middleware for handling file uploads.
- **CSV Parser:** Library for parsing and processing CSV files.
- **LangChain:** LLM Framework
- **OpenAI:** LLM API
- **Hosting:** Render

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Priyanka-Agrawal2022/Ad_Performance_Analyzer_Agent_Backend.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add the required environment variables.

---

## Environment Variables
The application requires the following environment variables:

```env
PORT=8000
OPENAI_API_KEY=your_openai_api_key
```

---

## API Endpoints

### 1. **Upload Ad Data**
**Endpoint:** `/upload`
- **Method:** `POST`
- **Description:** Accepts a CSV file containing ad data.
- **Request:**
  - Content-Type: `multipart/form-data`
  - File: `file` (key for the uploaded CSV file)
- **Response:**
  - `200 OK`: Upload results.
  - `400 Bad Request`: If the file is invalid or missing.
  - `500 Internal Server Error`: If error occurs during file upload.

### 2. **Analyze Ad Data**
**Endpoint:** `/analyze`
- **Method:** `GET`
- **Description:** Analyzes ad performance by parsing CSV file stored in uploads folder & deletes it after parsing.
- **Response:**
  - `200 OK`: Analysis summary, high performing & low performing keywords.
  - `500 Internal Server Error`: If error occurs during file analysis.

---

## Running the Server
   ```bash
   npm start
   ```
   The server will start at `http://localhost:8000`.

---

## Error Handling
- **Insufficient Quota:** Check your OpenAI API usage and adjust your plan if needed.
- **Invalid File Format:** Ensure uploaded files are in CSV format.
- **API Errors:** Refer to OpenAI API documentation for details on error codes.