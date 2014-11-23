$(document).ready(function() {
	$.ajax({
        url: "/info",
        type: "GET",
        dataType: "json",
        cache: true,
        success: function(data) {
		    
		},
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof errorFn !== 'undefined') {
                errorFn(jqXHR, textStatus, errorThrown);
            }
        }
    });
});