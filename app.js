(function() {
    var module = angular.module('app', ['app.sortingTableModule', 'app.stormServiceModule']);
    
    /*
    
    module.directive('sortingTable', ['$sce', '$filter', function($sce, $filter) {
        return {
            restrict: 'E',
            templateUrl: '/sorting-table.html',
            controller: function() {
                this.sortKey = Object.keys(tuples[0])[0]; // Gets first key of first tuple
                this.sortDescending = false;
                this.tuples = tuples;
                
                this.getKey = function(index){
                    if(index === 0) {
                        return "#";
                    } else {
                        return Object.keys(this.tuples[0])[index];
                    }
                }
                
                this.setSortKey = function(sortKey) {
                    if(sortKey === this.sortKey) {
                        this.sortDescending = !this.sortDescending;
                    } else {
                        this.sortKey = sortKey;
                        this.sortDescending = false;
                    }
                    this.tuples = $filter('orderBy')(tuples,this.sortKey,this.sortDescending);
                };
                
                this.getHeaderClassForKey = function(sortKey) {
                    var headerClass = "glyphicon ";
                    if(sortKey === this.sortKey) {
                        if(this.sortDescending) {
                            headerClass += "glyphicon-chevron-down";
                        } else {
                            headerClass += "glyphicon-chevron-up";
                        }
                    } else {
                        headerClass += "glyphicon-minus";
                    }
                    return headerClass;
                };
            },
            controllerAs: 'outputCtrl'
        };
    }]);*/
})();