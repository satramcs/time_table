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
    let get_co = manipulate.get_co_teachers(get_data);
    let co_tables = manipulate.convert_table(get_data, 1, get_co);

    let addtional_co = manipulate.calculate_extra_co(co_tables.get_co);

    fs.readFile(`${appRoot}/views/table.html`, "utf8", function(error, html) {
      if (error) {
        throw error;
      }
      html = html.replace("{ class_table }", class_tables.template);
      html = html.replace("{ co_table }", co_tables.template);
      html = html.replace("{ extra_co }", addtional_co);
      res.end(html);
    });
  });
};
