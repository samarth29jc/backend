
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";
const isPrime = (num) => {
    num = parseInt(num);
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isBase64 = (str) => {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (err) {
        return false;
    }
};

// GET
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// POST
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // Input validation
        if (!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, error: "Invalid data format" });
        }

        // Process arrays
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item) && item.length === 1);
        const lowercaseAlphabets = alphabets.filter(char => char >= 'a' && char <= 'z');
        const highestLowercase = lowercaseAlphabets.length > 0 ? 
            [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : 
            [];

        // Check for prime numbers
        const isPrimeFound = numbers.some(num => isPrime(num));

        // Process file
        const fileValid = file_b64 ? isBase64(file_b64) : false;
        const fileMimeType = fileValid ? "image/png" : ""; // This should be determined dynamically
        const fileSizeKb = fileValid ? "400" : "0"; // This should be calculated from actual file

        res.json({
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercase,
            is_prime_found: isPrimeFound,
            file_valid: fileValid,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKb
        });

    } catch (error) {
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
