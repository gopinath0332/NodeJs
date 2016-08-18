const connection = require("./resources/js/mysql");

const express = require("express");

const app = new express();
const router = express.Router();
const dbRouter = express.Router();

app.use(express.static("resources"));
app.get("/hello", (req, resp) => {
    resp.send("Hello there!!! Express setup is working.");
});

app.route("/test").get((req, resp) => {
    resp.send("<h3>App router get</h3>");
});

router.use((req, resp, next) => {
    console.log("Time::" + Date.now());
    next();
});
router.get("/", (req, resp) => {
    resp.send("<h4>Birds Get request</h4>");
});

app.use("/birds", router);


/**
 * Get data from database
 */
dbRouter.use((req, resp, next) => {
    if (!connection.threadId) {
        connection.connect((error) => {
            if (error) {
                console.error("Error connection:::" + error.stack);
                return;
            }
            console.log("Connection created with id::" + connection.threadId);
        });
    }
    next();
});
dbRouter.get("/names", (req, resp) => {
    connection.query("select * from person", (err, rows, fields) => {
        if (err) throw err;
        resp.send(rows);
        // connection.end();
    });
});
dbRouter.get("/names/:nameId", (req, resp) => {
    var query = "select * from person where id=" + req.params.nameId;
    connection.query(query, (err, rows, fields) => {
        if (err) throw err;
        resp.send(rows);
        // connection.end();
    });
});

app.use("/db", dbRouter);


app.listen(9090, () => {
    console.log("App running 9090 port");
});
