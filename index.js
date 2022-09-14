const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users.route");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");

dotenv.config();
//Mongo Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

app.listen(process.env.PORT, () => {
    console.log("backend server is running");
})