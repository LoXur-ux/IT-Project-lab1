const http = require("http");
const path = require("path");
const fs = require("fs");

const Pool = require("pg").Pool;
const pool = new Pool({
  database: process.env.DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

const logsDir = "logs";
const logsPath = path.resolve("./logs");
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const file = "access-log.log";
const logFilePath = path.resolve(logsPath, file);
const port = process.env.PORT || 3000;
if (!port) {
  throw new Error("PORT variable not set!");
}

const createdAt = new Date();
const server = http.createServer((req, res) => {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()}:request\n`);
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/plain");
  res.write(`Hello World, started at ${createdAt.toISOString()}`);

  pool.query("select * from Test", (err, qres) => {
    if (err) throw err;
    qres.rows.forEach((row) => {
      res.write(
        "id: " + row.id + "| date: " + row.date + "| title: " + row.title
      );
    });
  });

  res.end("А все");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
