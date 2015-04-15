(function ($) {

    function SLATable(opts) {

        this.options = $.extend({
            cellHover: {
                over: function () {
                    $(this).css('background-color', "#DDAAAA");
                },
                left: function () {
                    $(this).css('background-color', "#FFFFFF");
                }
            }
        }, opts);

        this.topHeaderRow = document.createElement('tr');

        this.leftHeaders = [];

        this.topHeaders = [];

        this.tableData = [];

        this.element = null;

        this.addLeftHeader = function (label) {
            var n_e = {label: label, el: document.createElement('tr')};
            var header_cell = n_e.el.insertCell(0);
            $(header_cell).html(label);
            $.each(this.topHeaders, function() {
                n_e.el.insertCell(-1);
            });
            this.leftHeaders.push(n_e);

        };


        this.addTopHeader = function (label) {
            var h = this.topHeaderRow.insertCell(-1);
            $(h).html(label);
            $(h).css('border', 'none');
            $(h).css('border-right', '1px solid #dddddd');
            $.each(this.leftHeaders, function (i, e) {
                e.el.insertCell(-1);
            });
        };

        this.redraw = function () {
            var self = this;
            $(this.element).html('');
            $(this.element).append(this.topHeaderRow);
            $.each(this.leftHeaders, function () {
                $(self.element).append(this.el);
            })

        };

        this.addData = function (label, i,j) {
            var row = this.leftHeaders[i - 1];
            var cell = row.el.insertCell(j);
            $(cell).html(label);
            $(cell).css('border', ' 2px solid #DDDDDD');
            $(cell).hover(this.options.cellHover.over, this.options.cellHover.left);
            if (typeof this.tableData[i] == 'undefined')
                this.tableData[i] = [];
            this.tableData[i][j] = cell;
        };

        var self = this;

        this.each(function () {
            if (this.nodeName.toLowerCase() != 'table')
                throw new Error('SLATable can\'t work with no table element');
            self.element = this;
            if (this.rows.length) {
                var t_h = this.rows[0];
                $.each(t_h.cells, function () {
                    self.addTopHeader($(this).html());
                });

                $.each(this.rows, function (i) {
                    if (i == 0) return true;
                    self.addLeftHeader($(this.cells[0]).html());
                    $.each(this.cells, function (j) {
                        if (j == 0) return true;
                        self.addData($(this).html(), i, j);
                    })
                });

                self.redraw(this);

            }
        });

        //keep memory  free
        self = null;
        return this;
    }

    $.fn.SLATable = SLATable;
})(jQuery)