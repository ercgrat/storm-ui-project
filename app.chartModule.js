(function(){
    var chartModule = angular.module('app.chartModule', ['app.stormServiceModule']);
     
    chartModule.factory('chartDataFactory', ['$filter', 'stormService', function($filter, stormService) {
     
        var tuplesToDataTableArray = function(tuples) {
             
            if(tuples.length === 0) {
                return [];
            }
            var firstTuple = tuples[0];
             
            var columns = [];
            var dataTableArray = [];
             
            for(keyIndex in Object.keys(firstTuple)){
                if(keyIndex != 0) {
                    var columnName = Object.keys(firstTuple)[keyIndex];
                    var columnType = typeof firstTuple[columnName];
                    columns.push({name: columnName, type: columnType});
                }
            }
            tuples = $filter('orderBy')(tuples, columns[0]["name"], false);
             
            dataTableArray.push([]);
            for(columnIndex in columns) {
                dataTableArray[0].push(columns[columnIndex]["name"]);
            }
             
            for(tupleIndex in tuples) {
                dataTableArray.push([]);
                for(columnIndex in columns) {
                 var currentTuple = tuples[tupleIndex];
                 var currentKey = columns[columnIndex]["name"];
                 dataTableArray[Number(Number(tupleIndex)+1)].push(currentTuple[currentKey]);
                }
            }
             
            return dataTableArray;
        };
         
        return { tuplesToDataTableArray: tuplesToDataTableArray };
         
    }]);
     
    chartModule.controller('ChartController', ['$scope', '$timeout', 'stormService', function($scope, $timeout, stormService) {
        $scope.sharedObject = {
            dataset: {
	        tuples: [],
		errors: [],
		dataTypes: []
	    },
	    chartTypes: [],
            charts: {},
            updateTuples: function(){}
        }
	this.chartTypes = ["Line", "Scatter", "Bar"];
	this.selectedChartType = this.chartTypes[0];
	this.selectChartType = function(chartType){
	    this.selectedChartType = chartType;
	}

	this.loadNewTuples = function() {
	    $scope.sharedObject.dataset = stormService.getRecentDataset();
            $scope.sharedObject.updateCharts();
        }
	stormService.registerListener(this.loadNewTuples);
    }]);

    chartModule.directive('chart', ['$timeout', 'chartDataFactory', function($timeout, chartDataFactory){
        return {
            restrict: 'E',
            templateUrl: '/chart.html',
            scope: {
                chartType: '@chartType',
                sharedObject: '='
            },
            link: function(scope, element, attrs){
		scope.sharedObject.chartTypes.push(scope.chartType);
		scope.sharedObject.updateCharts = updateCharts;
		createChart();
                $(window).resize(createChart);
                 
                function createChart(){
                    // Create data table
                    dataArray = new google.visualization.arrayToDataTable(chartDataFactory.tuplesToDataTableArray(scope.sharedObject.dataset.tuples));
		    // Set up chart options
                    scope.options = {'title':'Storm Output Visualization'};
                    // Instantiate and draw our chart, passing in some options.
                    switch(scope.chartType) {
                        case "Line":
                            scope.sharedObject.charts[scope.chartType] = new google.visualization.LineChart($("#chart-Line")[0]);
                            break;
                        case "Bar":
                            scope.sharedObject.charts[scope.chartType] = new google.visualization.BarChart($("#chart-Bar")[0]);
                            break;
                    	case "Scatter":
			    scope.sharedObject.charts[scope.chartType] = new google.visualization.ScatterChart($("#chart-Scatter")[0]);
		    }
                    scope.sharedObject.charts[scope.chartType].draw(dataArray, scope.options);
                }
                 
                function updateCharts(){
		    for(typeIndex in scope.sharedObject.chartTypes) {
                        var chartType = scope.sharedObject.chartTypes[typeIndex];
		        var dataArray = new google.visualization.arrayToDataTable(chartDataFactory.tuplesToDataTableArray(scope.sharedObject.dataset.tuples));
			scope.sharedObject.charts[chartType].draw(dataArray, scope.options);
                    }
                }
            }
        };
    }]);
})();
