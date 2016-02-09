angular.module('app.directives', [])

.directive('diagram', [function(){
	return {
		restrict: 'E',
		scope: {
			code: '@'
		},
		template: '<img src="diagrams/{{code}}.png" />'
	}
}]);

