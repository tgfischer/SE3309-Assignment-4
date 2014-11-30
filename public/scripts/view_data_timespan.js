$(document).ready(function() {
    $.ajax({
        url: "/view_data_timespan",
        type: "POST",
        dataType: "json",
        cache: true,
        data: {
        	monthly: false
        },
        success: function(data) {
        	$("#readings").dataTable({
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
});