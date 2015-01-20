(function(){
    var stormServiceModule = angular.module('app.stormServiceModule', []);

    stormServiceModule.service('stormService', ['$timeout', function($timeout){

	var hasNewData = false;
	var indexKey = "___ANGULARJS_STORM_MODULE_INDEX_";
	var dataset = {
	    tuples: [],
	    exceptions: []
	}
	// Clone dataset
	var recentData = JSON.parse(JSON.stringify(dataset));
	var listeners = [];

	var stormConn = new WebSocket("ws://localhost:8080");
        stormConn.onopen = function(msg) {
		$timeout(requestData, 1000);
        }
	stormConn.onmessage = function(msg) {
		parseTuples(msg.data);
		$timeout(requestData, 1000);
	}

	var requestData = function() {
		stormConn.send("ping");
	}

	this.numNewDataPoints = function() {
	    return recentData.tuples.length - dataset.tuples.length;
	}
	this.getDataset = function() {
	    return dataset;
	}
	this.getRecentDataset = function() {
	    return recentData;	
	}
	this.registerListener = function(callback){
	    listeners.push(callback);
	}
	this.getIndexKey = function() {
	    return indexKey;
	}

        var parseTuples = function(jsonResponse){
	    console.log(jsonResponse);
            var inDataset = JSON.parse(jsonResponse);
            var inTuples = inDataset.data.reverse();
	    function indexTuples(inTuples, indexKey) {
                var tuples = [];
                for(tupleIndex in inTuples){
                    tuples.push({});
                    tuples[tupleIndex][indexKey] = Number(tupleIndex);
                    for(keyIndex in Object.keys(inTuples[tupleIndex])){
                        var key = Object.keys(inTuples[tupleIndex])[keyIndex];
                        tuples[tupleIndex][key] = inTuples[tupleIndex][key];
                    }
                    tupleIndex++;
                }
                return tuples;
            }
	    recentData.exceptions = inDataset.exceptions;
            recentData.tuples = indexTuples(inTuples, indexKey);
	    for(var i = 0; i < listeners.length; i++) {
	        listeners[i]();
	    }
        };

	this.loadRecentTuples = function(){
	    dataset.tuples = recentData.tuples.slice(0);
	    dataset.exceptions = recentData.exceptions.slice(0);
	};
    }]);
})();
