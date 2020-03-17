const {
  subjects,
  clases,
  week_days,
  period_time,
  co_subjects,
  max_free_period
} = require("../config/default_values");

module.exports.change_to_class = get_data => {
  var cls_tbl = {};

  for (cls of clases) {
    if (cls_tbl[cls] == undefined) {
      cls_tbl[cls] = {};
    }
    for (sub of subjects) {
      for (period of period_time) {
        if (cls_tbl[cls][period] == undefined) {
          cls_tbl[cls][period] = {};
        }
        for (day of week_days) {
          if (cls_tbl[cls][period][day] == undefined) {
            cls_tbl[cls][period][day] = "-";
          }
          if (get_data[sub][period][day] == cls) {
            cls_tbl[cls][period][day] = sub;
          }
        }
      }
    }
  }
  return cls_tbl;
};

module.exports.convert_table = (get_data, is_co) => {
  let tmplt = ``;
  let days_tmplt = ``;

  days_tmplt += `<tr><th>--</th>`;
  for (day of week_days) {
    days_tmplt += `<th>${day}</th>`;
  }
  days_tmplt += `</tr>`;
  for (cls of clases) {
    tmplt += `<h4>${cls}</h4>`;
    tmplt += `<table class="table">`;
    tmplt += days_tmplt;

    for (period of period_time) {
      tmplt += `<tr>`;
      tmplt += `<td>${period}</td>`;

      if (is_co) {
        //   To fill co-teacher with free period
        var vals = Object.values(get_data[cls][period]);
        var free_count = 0;
        if (vals[0] != "-") {
          free_count = max_free_period;
        } else {
          for (val of vals) {
            if (val == "-") {
              free_count++;
            }
          }
        }
      }
      for (day of week_days) {
        var cur_sub = get_data[cls][period][day];
        if (cur_sub == "-" && is_co) {
          tmplt += `<td>${co_subjects[free_count]}</td>`;
          free_count--;
        } else {
          tmplt += `<td>${cur_sub}</td>`;
        }
      }
      tmplt += `</tr>`;
    }
    tmplt += `</table>`;
  }
  return tmplt;
};
