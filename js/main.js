$(function() {

  $.get('data/periodic.json').done(function(data) {

    // find max row and column
    var maxRow = 1;
    var maxCol = 1;
    _.each(data, function(cell) {
      if (cell.row > maxRow) { maxRow = cell.row; }
      if (cell.col > maxCol) { maxCol = cell.col; }
    });

    // build placeholder table
    var grid = []
    for (var r = 0; r <= maxRow; r++) {
      var row = []
      for (var c = 0; c <= maxCol; c++) {
        row.push(null);
      }
      grid.push(row);
    }
    _.each(data, function(cell) {
      grid[cell.row-1][cell.col-1] = cell;
    });

    // populate HTML table
    var table = $("table#periodic");
    for (var r = 0; r < maxRow; r++) {
      var tr = $("<tr></tr>");
      tr.addClass("row" + (r+1))
      for (var c = 0; c < maxCol; c++) {
        var td = $("<td></td>");
        td.addClass("cell");
        var cell = grid[r][c];
        if (cell) {
          td.addClass("full");
          if (cell.classification) {
            td.addClass("classification-" + cell.classification);
          }
          var num = $('<span class="num"></span>');
          num.text(cell.atomic_number);
          td.append(num);
          var sym = $('<span class="sym"></span>');
          sym.text(cell.symbol);
          td.append(sym);
          (function(td, cell) {
            td.click(function(evt) {
              var popup = $("#detail_popup");
              _.each(cell, function(value, key) {
                popup.find(".field_" + key).text(value);
              });
              var descField = popup.find('.field_description');
              var desc = _.escape(cell.description)
                .replace(new RegExp("(" + cell.symbol + ")", "ig"), "<b>$1</b>")
              descField.html(desc);
              popup.popup("show");
            });
          })(td, cell);
        } else {
          td.addClass("empty");
        }
        tr.append(td);
      }
      table.append(tr);
      if (r == 6) {
        table.append('<tr><td>&nbsp;</td></tr>');
      }
    }

    $("#detail_popup").popup();

  });

});
