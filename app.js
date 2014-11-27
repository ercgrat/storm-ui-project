(function() {
    var module = angular.module('app', ['app.sortingTableModule', 'app.stormServiceModule', 'app.chartModule']);
    
    module.controller('PageController', function(){
        this.pageSelected = 0;
        var eventSource = new EventSource("get_data.php");
        eventSource.onmessage = function(msg) {
            var newElement = document.createElement("li");
            newElement.innerHTML = "count: " + msg.data;
            $.getElementById("test_list").appendChild();
        }
        
        this.pageSelectedIs = function(page) {
            if(page === this.pageSelected){
                return true;
            }
        }
        this.selectPage = function(page) {
            this.pageSelected = page;
        }
    })
    
    // Manually boostrap angular after loading the Google Chart API
    google.setOnLoadCallback(function() {
        angular.bootstrap(document, ['app']);
    });
    
    // Load the Visualization API and the piechart package.
    google.load('visualization', '1.0', {'packages':['corechart']});
    
})();