(function(){
    var chartModule = angular.module('app.chartModule', ['app.stormServiceModule']);
     
    chartModule.factory('chartDataFactory', ['$filter', 'stormService', function($filter, stormService) {
     
        var tuplesToDataTable = function(tuples, chartType) {
            if(tuples.length === 0) {
                return [];
            }
	    var firstTuple = tuples[0];
            var dataTable = new google.visualization.DataTable(); 
            var dataArray = [];
	    var dataStringDict = {};
 
            for(keyIndex in Object.keys(firstTuple)){
                if(keyIndex != 0) {
                    var columnName = Object.keys(firstTuple)[keyIndex];
                    dataTable.addColumn("number", columnName);
		    if(typeof firstTuple[columnName] === "string") {
		        if(chartType === "Scatter") {
			    dataTable.addColumn({type:"string",role:"tooltip"});
			} else {
			    dataTable.addColumn({type:"string",role:"annotation"});
			}
			dataStringDict[columnName] = {};
		    }
                }
            }
             
            for(tupleIndex in tuples) {
                dataArray.push([]);
		var currentTuple = tuples[tupleIndex];
                for(keyIndex in Object.keys(firstTuple)) {
                    var currentKey = Object.keys(firstTuple)[keyIndex];
		    var value = currentTuple[currentKey];
		    if(keyIndex != 0) {
		        if(typeof(currentTuple[currentKey]) === "string") {
		            if(typeof dataStringDict[currentKey][value] === 'undefined') {
				dataStringDict[currentKey][value] = Object.keys(dataStringDict[currentKey]).length + 1;
			    }
		            dataArray[Number(tupleIndex)].push(dataStringDict[currentKey][value]);
		        }
		        dataArray[Number(tupleIndex)].push(value);
                    }
		}
            }
	    dataTable.addRows(dataArray);
            return dataTable;
        };
         
        return { tuplesToDataTable: tuplesToDataTable };
         
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
		console.log("redrawing chart");
                    // Create data table
                    dataTable = chartDataFactory.tuplesToDataTable(scope.sharedObject.dataset.tuples, scope.chartType);
		    // Set up chart options
                    scope.options = {'title':'Storm Output Visualization', 'bars':'vertical'};
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
                    scope.sharedObject.charts[scope.chartType].draw(dataTable, scope.options);
                }
                 
                function updateCharts(){
		    for(typeIndex in scope.sharedObject.chartTypes) {
                        var chartType = scope.sharedObject.chartTypes[typeIndex];
		        var dataTable = chartDataFactory.tuplesToDataTable(scope.sharedObject.dataset.tuples, chartType);
			scope.sharedObject.charts[chartType].draw(dataTable, scope.options);
                    }
                }
            }
        };
    }]);
})();
