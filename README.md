# Bajaj Finserv Test

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
FULL_NAME=Taher Kapadia
DOB_DDMMYYYY=07112004
EMAIL=taher5253kapadia786@gmail.com
ROLL_NUMBER=22BPS1113
```

## Example request

```bash
curl -X POST https://bajaj-finserv-test-eight.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["a","1","334","4","R","$"]}'
```

## Deploy
- **Vercel**: create a Serverless function or use the Node server via `vercel.json` (included).

## Notes

- Numbers are recognized only when the token contains **digits only** (`^[0-9]+$`). Everything else that isn't purely alphabetical becomes a `special_character`.
- For `concat_string`, alphabetic characters are collected from every input token (including mixed tokens), reversed, then converted to alternating caps.
