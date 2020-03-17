const fs = require("fs");
const csv = require("csv-parser");

module.exports.read_file = file_name => {
  return new Promise((resolve, reject) => {
    var inputFilePath = `./csv_tables/Teacher wise class timetable - ${file_name}.csv`;
    var pre_data = {};
    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on("data", function(data) {
        try {
          // Format data by period
          let time = data["--"];
          delete data["--"];
          pre_data[time] = data;
        } catch (err) {
          reject(err);
        }
      })
      .on("end", function() {
        resolve(pre_data);
      });
  });
};
