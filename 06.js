const f = require("fs");

let data = "";

// read the data
const dataRaw = f.readFileSync("06-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  data = line;
});

const findMarker = (data, width) => {
  for (let i = width - 1; i < data.length; i++) {
    const str = data.slice(i - (width - 1), i + 1);
    markerFound = true;
    for (let j = 0; j < str.length; j++) {
      for (let k = j + 1; k < str.length; k++) {
        // console.log("str[j]", str[j], "str[k]", str[k]);
        if (str[j] === str[k]) markerFound = false;
      }
    }
    if (markerFound) return i + 1;
  }
};

console.log(findMarker(data, 4));

console.log(findMarker(data, 14));
