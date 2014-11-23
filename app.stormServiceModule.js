(function(){
    angular.module('app.stormServiceModule', []).factory('stormService', function(){
        var getTuples = function(){
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
            
            return indexTuples(inTuples, indexKey);
        };
        
        return { getTuples: getTuples };
    });
})();