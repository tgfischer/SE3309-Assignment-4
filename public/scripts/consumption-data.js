$(document).ready(function() {
    $.ajax({
        url: "/get_readings",
        type: "POST",
        dataType: "json",
        cache: true,
        data: {
        	monthly: false
        },
        success: function(data) {
        	$("#individual-readings").dataTable({
        		data: data,
                columns: [
                    { data: "day", sTitle: "Day", sClass: "center" },
                    { data: "reading", sTitle: "Your Meter Reading", sClass: "center" }
                ],
                bSort : false,
                bFilter : false
            });
		},
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof errorFn !== 'undefined') {
                errorFn(jqXHR, textStatus, errorThrown);
            }
        }
    });
    
    $.ajax({
        url: "/get_readings",
        type: "POST",
        dataType: "json",
        cache: true,
        data: {
        	monthly: true
        },
        success: function(data) {
        	$("#monthly-readings").dataTable({
        		data: data,
                columns: [
                    { data: "month", sTitle: "Month", sClass: "center" },
                    { data: "year", sTitle: "Year", sClass: "center" },
                    { data: "reading", sTitle: "Your Average Monthly Reading", sClass: "center" },
                    { data: "avg", sTitle: "Total Average Monthly Reading", sClass: "center" }
                ],
                bSort : false,
                bFilter : false
            });
		},
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof errorFn !== 'undefined') {
                errorFn(jqXHR, textStatus, errorThrown);
            }
        }
    });
    
    //$('table.display').dataTable();
});