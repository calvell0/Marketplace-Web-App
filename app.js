const PORT_NUM = 3000;
const HOSTNAME = "localhost";
const URL = "mongodb+srv://demo:demo123@cluster0.9fys4ee.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0";



const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const app = express();



app.set("view engine", "ejs");


app.use(session({
    secret: "AMKDMAFNJBBFHBFA",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: URL }),
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(flash());

app.use( (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash("error");
    res.locals.successMessages = req.flash("success");
    next();
});
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(__dirname));


const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");


app.use("/items", itemRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
        return next(err);
    }

    res.status = err.status;
    res.render('error', {error: err});
    return next();
});


mongoose.connect(URL).then(() => {
    app.listen(PORT_NUM, HOSTNAME, () => {
        console.log(`Listening on port ${ PORT_NUM }, exporting ${__dirname + "/resources"}`);
    });
})
    .catch(err => {
        console.error("Could not connect to database:");
        console.error(err);
    });

