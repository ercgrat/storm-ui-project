(function() {
    var module = angular.module('app', ['app.sortingTableModule', 'app.stormServiceModule', 'app.chartModule']);
    
    module.controller('PageController', ["$timeout", function($timeout){
        this.pageSelected = 0;
        
        this.pageSelectedIs = function(page) {
            if(page === this.pageSelected){
                return true;
            }
        }
        this.selectPage = function(page) {
            this.pageSelected = page;
        }
    }]);
    
    // Manually boostrap angular after loading the Google Chart API
    google.setOnLoadCallback(function() {
        angular.bootstrap(document, ['app']);
    });
    
    // Load the Visualization API and the piechart package.
    google.load('visualization', '1.0', {'packages':['corechart']});
    
})();
