$(document).ready(function() {

    $("#viewDataBtn").click( function () {
        
        var startDate = $("input#startDate").val(); 
        var endDate = $("input#endDate").val();

        $.ajax({ 
            url: '/view_data_timespan',
            type: "POST",
            dataType: "json", 
            async: false, 
            data: { 
                monthly: false,
                start: startDate,
                end: endDate
            }, 
            success: function (data) { 
                console.log(data);
                $("#readings").dataTable({
                    data: data,
                    columns: [
                        { data: "day", sTitle: "Day", sClass: "center" },
                        { data: "reading", sTitle: "Your Meter Reading", sClass: "center" },
                        { data: "price", sTitle: "Price", sClass: "center"}
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
        })
    });
});
