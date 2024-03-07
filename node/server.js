const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true })); // Corrected 'extended' property
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Include OPTIONS
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const paymentRouter = require("./routes/payment.js");
app.use("/payment", paymentRouter);


app.listen(port, () => console.log(`Server started on port ${port}`));
