# VIT BFHL API

A minimal Express API that implements the **/bfhl (POST)** route required by the VIT Full Stack challenge.

## Requirements Implemented

- Returns:
  - `is_success` (boolean)
  - `user_id` in the format `full_name_ddmmyyyy` (lowercase, spaces -> underscores)
  - `email`, `roll_number`
  - `odd_numbers` (numbers as strings)
  - `even_numbers` (numbers as strings)
  - `alphabets` (tokens containing letters only; uppercased)
  - `special_characters` (all other tokens)
  - `sum` (numeric sum of all numeric tokens; returned as a string)
  - `concat_string`: concatenation of **all alphabetic characters present anywhere in the input**, reversed, then converted to **alternating caps** starting with uppercase.

## Run locally

```bash
npm i
npm run dev
# POST http://localhost:3000/bfhl
```

## Environment

Set your identifiers in `.env` (optional—defaults are provided).

```
FULL_NAME=John Doe
DOB_DDMMYYYY=17091999
EMAIL=john@xyz.com
ROLL_NUMBER=ABCD123
```

## Example request

```bash
curl -X POST http://localhost:3000/bfhl   -H "Content-Type: application/json"   -d '{"data":["a","1","334","4","R","$"]}'
```
or (using powershell)
```bash
Invoke-RestMethod -Uri "http://localhost:3000/bfhl" -Method Post -Body '{"data":["a","1","334","4","R","$"]}' -ContentType "application/json"
```

## Deploy

- **Render**: create a new Web Service from this repo. Set `Start Command` to `npm start`.
- **Railway**: new project from repo, auto-detects Node app.
- **Vercel**: create a Serverless function or use the Node server via `vercel.json` (included).

## Notes

- Numbers are recognized only when the token contains **digits only** (`^[0-9]+$`). Everything else that isn't purely alphabetical becomes a `special_character`.
- For `concat_string`, alphabetic characters are collected from every input token (including mixed tokens), reversed, then converted to alternating caps.
