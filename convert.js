import fs from "fs";

const json = JSON.parse(
  fs.readFileSync("./firebase-service.json", "utf8")
);

console.log(JSON.stringify(json));