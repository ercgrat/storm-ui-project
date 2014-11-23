(function() {
    angular.module('app.sortingTableModule', ['app.stormServiceModule']).directive('sortingTable', ['$filter', 'stormService', function($filter, stormService){
        return {
            restrict: 'E',
            templateUrl: '/sorting-table.html',
            controller: function() {
                this.tuples = stormService.getTuples();
                this.sortKey = Object.keys(this.tuples[0])[0]; // Gets first key of first tuple
                this.sortDescending = false;
                
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
                    this.tuples = $filter('orderBy')(this.tuples,this.sortKey,this.sortDescending);
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
    }]);
})();