import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// Small helpers
const isDigitsOnly = (s) => /^[0-9]+$/.test(s);
const isLettersOnly = (s) => /^[A-Za-z]+$/.test(s);

// Build user_id as "full_name_ddmmyyyy" in lowercase (underscored full name)
function buildUserId() {
  const fullName = (process.env.FULL_NAME || "john doe").trim().replace(/\s+/g, "_").toLowerCase();
  const dob = (process.env.DOB_DDMMYYYY || "17091999").replace(/[^0-9]/g, "");
  return `${fullName}_${dob}`;
}

// Alternating caps on a string: start Upper, then lower, then Upper ...
function toAlternatingCaps(input) {
  return input
    .split("")
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

// Root route
app.get("/", (_req, res) => {
  res.json({
    name: "VIT BFHL API",
    status: "ok",
    routes: ["/bfhl (POST)"],
  });
});

// Core route
app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid payload: expected JSON with a 'data' array."
      });
    }

    const email = process.env.EMAIL || "john@xyz.com";
    const rollNumber = process.env.ROLL_NUMBER || "ABCD123";
    const userId = buildUserId();

    /** Classification arrays (numbers must be returned as strings) */
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = []; // each item uppercased as in spec
    const special_characters = [];

    let sum = 0;

    // We'll also accumulate every alphabetical character (from any input string)
    // to compute the alternating-caps reverse concatenation later.
    const alphaCharsInOrder = [];

    for (const raw of body.data) {
      // Ensure everything is a string for classification
      const s = String(raw);

      // Collect all alphabetical characters for the concat-string requirement
      // (from the entire input, not just purely alphabetic tokens).
      for (const ch of s) {
        if (/[A-Za-z]/.test(ch)) alphaCharsInOrder.push(ch);
      }

      if (isDigitsOnly(s)) {
        // Numeric string
        // Keep original string form in responses; compute parity and sum numerically
        const n = parseInt(s, 10);
        if (n % 2 === 0) {
          even_numbers.push(s);
        } else {
          odd_numbers.push(s);
        }
        sum += n;
      } else if (isLettersOnly(s)) {
        // Pure alphabets -> push uppercased token
        alphabets.push(s.toUpperCase());
      } else {
        // Everything else goes to special_characters
        special_characters.push(s);
      }
    }

    // Build concat_string: reverse the collected alpha chars, then alternating caps
    const reversedAlpha = alphaCharsInOrder.reverse().join("");
    const concat_string = toAlternatingCaps(reversedAlpha);

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    // Graceful fallback
    return res.status(500).json({
      is_success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "production" ? undefined : String(err)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
