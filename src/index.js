import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

const isDigitsOnly = (s) => /^[0-9]+$/.test(s);
const isLettersOnly = (s) => /^[A-Za-z]+$/.test(s);

function buildUserId() {
  const fullName = (process.env.FULL_NAME || "john doe").trim().replace(/\s+/g, "_").toLowerCase();
  const dob = (process.env.DOB_DDMMYYYY || "17091999").replace(/[^0-9]/g, "");
  return `${fullName}_${dob}`;
}

function toAlternatingCaps(input) {
  return input
    .split("")
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.get("/", (_req, res) => {
  res.json({
    name: "Bajaj Finserv Test API",
    status: "ok",
    routes: ["/bfhl (POST)"],
  });
});

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid payload: expected JSON with a 'data' array."
      });
    }

    const email = process.env.EMAIL
    const rollNumber = process.env.ROLL_NUMBER;
    const userId = buildUserId();

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sum = 0;

    const alphaCharsInOrder = [];

    for (const raw of body.data) {
      const s = String(raw);

      for (const ch of s) {
        if (/[A-Za-z]/.test(ch)) alphaCharsInOrder.push(ch);
      }

      if (isDigitsOnly(s)) {
        const n = parseInt(s, 10);
        if (n % 2 === 0) {
          even_numbers.push(s);
        } else {
          odd_numbers.push(s);
        }
        sum += n;
      } else if (isLettersOnly(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }

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
