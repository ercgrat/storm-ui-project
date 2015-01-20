(function(){
    var chartModule = angular.module('app.chartModule', ['app.stormServiceModule']);
     
    chartModule.factory('chartDataFactory', ['$filter', 'stormService', function($filter, stormService) {
     
        var tuplesToDataTable = function(dataset, chartType) {
            var tuples = dataset.tuples;
	    if(tuples.length === 0) {
                return [];
            }
	    if(chartType === "Error") {
	    	return getErrorDataTable(dataset);
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

	var getErrorDataTable = function(dataset){
	    var errors = dataset.exceptions.reverse();
	    var dataTable = new google.visualization.DataTable();
	    

	    var exceptionDict = {};
	    var exceptionCount = 0;
	    for(var i = 0; i < errors.length; i++){
		if(typeof exceptionDict[errors[i]["type"]] === 'undefined') {
		    exceptionCount++;
		    exceptionDict[errors[i]["type"]] = exceptionCount;
		}
	    }	

	    dataTable.addColumn("number", "index");
	    for(exceptionIndex in Object.keys(exceptionDict)) {
		dataTable.addColumn("number", Object.keys(exceptionDict)[exceptionIndex]);
	    	dataTable.addColumn({type:"string", role:"tooltip"});
	    }

	    var dataArray = [];
	    for(errorIndex in errors) {
		var error = errors[errorIndex];
		dataArray.push([]);
		dataArray[errorIndex].push(Number(errorIndex) + 1);
		for(exceptionIndex in Object.keys(exceptionDict)) {
		    var exception = Object.keys(exceptionDict)[exceptionIndex];
		    if(error["type"] === exception) {
			dataArray[errorIndex].push(Number(error["task_id"]));
		        dataArray[errorIndex].push("Type: " + error["type"] + ", Line: " + error["line-in-file"] + ", Task ID: " + error["task_id"]);
		    } else {
			dataArray[errorIndex].push(null);
			dataArray[errorIndex].push(null);
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
            restrict: 'A',
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
                    dataTable = chartDataFactory.tuplesToDataTable(scope.sharedObject.dataset, scope.chartType);
		    
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
			    break;
		    	case "Error":
			    scope.sharedObject.charts[scope.chartType] = new google.visualization.ScatterChart($("#chart-Error")[0]);
		    }
                    scope.sharedObject.charts[scope.chartType].draw(dataTable, getChartOptions(scope.chartType));
                }
	
		function getChartOptions(chartType) {
		    var options = {"title":"Storm Output Visualization","hAxis":{"title":""}, "vAxis":{"title":""}};
		    if(scope.sharedObject.dataset.tuples[0]) {
		        options.hAxis.title = Object.keys(scope.sharedObject.dataset.tuples[0])[1];
			options.vAxis.title = Object.keys(scope.sharedObject.dataset.tuples[0])[2];
		    }
		    if(chartType === 'Error'){
			options.title = "Storm Exception Visualization";
			options.hAxis.title = "Index";
			options.vAxis.title = "Task ID";
		    }
		    return options;
		}
                 
                function updateCharts(){
		    for(typeIndex in scope.sharedObject.chartTypes) {
                        var chartType = scope.sharedObject.chartTypes[typeIndex];
		        var dataTable = chartDataFactory.tuplesToDataTable(scope.sharedObject.dataset, chartType);
			scope.sharedObject.charts[chartType].draw(dataTable, getChartOptions(chartType));
                    }
                }
            }
        };
    }]);
})();
