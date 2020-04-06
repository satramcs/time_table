const {
  subjects,
  clases,
  week_days,
  period_time,
} = require("../config/default_values");

/*Change to class wise order*/
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

/*Convert to table format*/
module.exports.convert_table = (get_data, is_co, get_co) => {
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

      for (day of week_days) {
        var cur_sub = get_data[cls][period][day];
        if (cur_sub == "-") {
          tmplt += `<td>${cur_sub}</td>`;
        } else {
          if(is_co && get_co[period][day]["co_teachers"].length){
            cur_sub += ` / ${get_co[period][day]["co_teachers"][0]}`;
            get_co[period][day]["co_teachers"].shift();
          }else if(is_co){
            get_co[period][day]["extra_teachers"]++;
          }
          tmplt += `<td>${cur_sub}</td>`;
        }
      }
      tmplt += `</tr>`;
    }
    tmplt += `</table>`;
  }
  if(is_co)
    return {"template":tmplt, "get_co":get_co};
  else
    return {"template":tmplt};
};

/*Get free teachers to assign as co-teacher*/
module.exports.get_co_teachers = (get_data) => {
  var occupieds = {};
  for (cls of clases) {
    for (period of period_time) {
      if (occupieds[period] == undefined) {
        occupieds[period] = {};
      }
      for (day of week_days) {

        if (occupieds[period][day] == undefined) {
          occupieds[period][day] = {"assigned_count":"0","assigned_teachers":[],"can_assign":"0", "co_teachers":[],"extra_teachers":0};
        }

        if(get_data[cls][period][day] != '-'){
          occupieds[period][day]["assigned_count"]++;
          occupieds[period][day]["assigned_teachers"].push(get_data[cls][period][day]);
        }
      }
    }
  }

  /*to asign co*/
  let total_teachers = subjects.length;
  for (period of period_time) {
    for (day of week_days) {
      let assigned_count = occupieds[period][day]["assigned_count"];
      let assigned_teachers = occupieds[period][day]["assigned_teachers"];
      let can_assign = 0;
      let t_count = total_teachers - assigned_count;
      if( t_count > assigned_count && t_count != 0)
        can_assign = assigned_count;
      else if(t_count != 0)
        can_assign = t_count;
      occupieds[period][day]["can_assign"] = can_assign;

      for (sub of subjects) {
        if(!assigned_teachers.includes(sub)){
          if(occupieds[period][day]["co_teachers"].length < can_assign)
            occupieds[period][day]["co_teachers"].push(sub);
        }
      }
    }
  }
  return occupieds;
}

/*Calculate minumum extra co-teachers*/
module.exports.calculate_extra_co = (get_co) => {
  let co_teacher_need = 0;
  for (period of period_time) {
    for (day of week_days) {
      if(get_co[period][day]["extra_teachers"] > co_teacher_need)
        co_teacher_need = get_co[period][day]["extra_teachers"];
    }
  }
  return co_teacher_need;
}