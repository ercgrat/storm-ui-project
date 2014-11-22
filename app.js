(function() {
    var module = angular.module('stormModule', []);
    var indexKey = "___ANGULARJS_STORM_MODULE_INDEX_";
    var inTuples = [
        {
            time: 3.20,
            y1: 2,
            y2: 7
        },
        {
            time: 2.98,
            y1: 3,
            y2: 8
        },
        {
            time: 3.10,
            y1: 2,
            y2: 8
        },
        {
            time: 2.55,
            y1: 6,
            y2: 3
        },
        {
            time: 4.01,
            y1: 10,
            y2: -1
        }
    ];
    
    var tuples = indexTuples(inTuples, indexKey);
    
    function indexTuples(inTuples, indexKey) {
        var tuples = [];
        var tupleIndex = 0;
        for(tupleIndex in inTuples){
            tuples.push({});
            tuples[tupleIndex][indexKey] = tupleIndex;
            for(keyIndex in Object.keys(inTuples[tupleIndex])){
                var key = Object.keys(inTuples[tupleIndex])[keyIndex];
                tuples[tupleIndex][key] = inTuples[tupleIndex][key];
            }
            tupleIndex++;
        }
        return tuples;
    }
    
    
    module.directive('outputTable', ['$sce', '$filter', function($sce, $filter) {
        return {
            restrict: 'E',
            templateUrl: '/output-table.html',
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
    }]);
})();