const fs = require("fs");
const rf = require("../read_csv");
const manipulate = require("./manipulate");
const { subjects } = require("../config/default_values");

async function get_tables() {
  var sub_tables = {};
  for (value of subjects) {
    sub_tables[value] = await rf.read_file(value);
  }
  return sub_tables;
}

module.exports.class_vise_tables = (req, res) => {
  get_tables().then(sub_tbls => {
    let get_data = manipulate.change_to_class(sub_tbls);
    let class_tables = manipulate.convert_table(get_data, 0);
    let co_tables = manipulate.convert_table(get_data, 1);
    console.log(appRoot);
    fs.readFile(`${appRoot}/views/table.html`, "utf8", function(error, html) {
      if (error) {
        throw error;
      }
      html = html.replace("{ class_table }", class_tables);
      html = html.replace("{ co_table }", co_tables);
      res.end(html);
    });
  });
};
