(function(){
    var stormServiceModule = angular.module('app.stormServiceModule', []);

    stormServiceModule.service('stormService', ['$timeout', function($timeout){

	var hasNewData = false;
	var dataset = {
	    tuples: [],
	    errors: [],
	    dataTypes: []
	}
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

        var parseTuples = function(jsonResponse){
            var indexKey = "___ANGULARJS_STORM_MODULE_INDEX_";
            var inDataset = JSON.parse(jsonResponse);
            var inTuples = inDataset.data;
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
             
            recentData.tuples = indexTuples(inTuples, indexKey);
	    for(var i = 0; i < listeners.length; i++) {
	        listeners[i]();
	    }
        };

	this.loadRecentTuples = function(){
	    dataset.tuples = recentData.tuples.slice(0);
	};
    }]);
})();
