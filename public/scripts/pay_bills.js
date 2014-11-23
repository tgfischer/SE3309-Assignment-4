$(document).ready(function() {
	var table;
	
    $.ajax({
        url: "unpaid_bills",
        type: "GET",
        dataType: "json",
        cache: true,
        success: function(data) {
        	var table = $("#unpaid-bills").dataTable({
        		data: data,
                columns: [
                    { data: "billID", visible: false, searchable: false },
                    { data: "status", sTitle: "Status", type: "date", sClass: "center" },
                    { data: "startPeriod", sTitle: "Start Period" },
                    { data: "endPeriod", sTitle: "End Period" },
                    { data: "amountDue", sTitle: "Amount Due", sClass: "center" },
                    { data: "dueDate", sTitle: "Due Date" }
                ]
            });
        	
        	table.on('click', 'tr', function(event) {
            	var data = table.fnGetData(this);
            	
            	$.ajax({
            		url: "",
                    type: "POST",
                    dataType: "json",
                    jsonp: false,
                    cache: true,
                    data: { 
                    	row: data
                    },
                    success: function(redirect) {
                    	window.location.href = redirect.redirect;
                    }
                });
        	});
		},
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof errorFn !== 'undefined') {
                errorFn(jqXHR, textStatus, errorThrown);
            }
        }
    });
});