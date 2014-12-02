(function() {
    angular.module('app.sortingTableModule', ['app.stormServiceModule']).directive('sortingTable', ['$filter', 'stormService', function($filter, stormService){
        return {
            restrict: 'E',
            templateUrl: '/sorting-table.html',
            controller: function($scope) {
                this.dataset = stormService.getDataset();
		this.tuples = this.dataset.tuples;
		this.indexKey = stormService.getIndexKey();
		if(this.tuples.length !== 0) {
                    this.sortKey = Object.keys(this.tuples[0])[0]; // Gets first key of first tuple
                } else {
		    this.sortKey = "";
		}
		this.sortDescending = false;

		this.loadData = function() {
		    stormService.loadRecentTuples();
		    this.dataset = stormService.getDataset();
		    this.tuples = this.dataset.tuples;
		    console.log(this.tuples);
		    $scope.numNewTuples = 0;
		    $scope.dataChangeSign = "+";
		}               
		this.dataListener = function() {
		    $scope.numNewTuples = stormService.numNewDataPoints();
		    if($scope.numNewTuples >= 0) {
		    	$scope.dataChangeSign = "+";
		    } else {
		    	$scope.dataChangeSign = "-";
		    }
		}
		this.dataListener();
		stormService.registerListener(this.dataListener);
 
		this.getLabel = function(index){
		    if(index === 0) {
			return "#";
		    } else {
		        return Object.keys(this.tuples[0])[index];
		    }
		}
                this.getKey = function(index){
                    if(index === 0) {
                        return this.indexKey;
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
