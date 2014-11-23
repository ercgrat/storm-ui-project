(function(){
    var chartModule = angular.module('app.chartModule', ['app.stormServiceModule']);
    
    chartModule.factory('chartDataFactory', ['$filter', 'stormService', function($filter, stormService) {
    
        var getChartData = function() {
            // Set up data table
            var tuples = stormService.getTuples();
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
        
        return { getChartData: getChartData };
        
    }]);
    
    
    chartModule.directive('chart', ['$timeout', 'chartDataFactory', function($timeout, chartDataFactory){
        return {
            restrict: 'E',
            templateUrl: '/chart.html',
            compile: function(tElement, tAttrs){
                
                drawChart();
                $(window).resize(drawChart);
                
                function drawChart(){
                    // Create data table
                    this.data = new google.visualization.arrayToDataTable(chartDataFactory.getChartData());
                    
                    // Set up chart options
                    this.options = {'title':'Storm Output Visualization'};
                    
                    // Instantiate and draw our chart, passing in some options.
                    this.chart = new google.visualization.LineChart($("#chart_div")[0]);
                    chart.draw(this.data, options);
                    
                    if(!this.chartFirstDrawn) {
                        $timeout(updateChart, 1000);
                    }
                    this.chartFirstDrawn = true;
                }
                
                function updateChart(){
                    var row = [];
                    for(var col = 0; col < this.data.getNumberOfColumns(); col++) {
                        if(col == 0) {
                            row.push(this.data.getValue(this.data.getNumberOfRows()-1,col) + 1);
                        } else {
                            if(Math.random() > 0.5) {
                                row.push(this.data.getValue(this.data.getNumberOfRows()-1,col) + Math.random()*2);
                            } else {
                                row.push(this.data.getValue(this.data.getNumberOfRows()-1,col) - Math.random()*2);
                            }
                        }
                        
                    }
                    this.data.removeRow(0);
                    this.data.addRow(row);
                    chart.draw(this.data, options);
                    $timeout(updateChart, 1000);
                }
            }
        }
    }]);
})();