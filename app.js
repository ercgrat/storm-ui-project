(function() {
    var module = angular.module('stormModule', []);
    
    module.directive('outputTable', ['$sce', function($sce) {
        return {
            restrict: 'E',
            templateUrl: '/output-table.html',
            controller: function() {
                this.tuples = [
                {
                    time: 3.20,
                    y1: 2,
                    y2: 7
                },
                {
                    time: 2.98,
                    y1: 3,
                    y2: 8
                }
            ];
            },
            controllerAs: 'outputCtrl'
        };
    }]);
    
    module.filter('greet', function(){
        return function(name) {
            return "Hello, " + name + "!";
        }
    });
})();