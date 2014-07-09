###
 - interface for all controls to derive from
 - to enforce a minimum set of requirements
	- attributes
		- template
		- position
		- controller
		- index
###
angular.module("google-maps.directives.api")
.factory "IControl", [ "BaseObject", "Logger", (BaseObject, Logger) ->
	class IControl extends BaseObject
		constructor: ($timeout) ->
			self = @
			@restrict = 'EA'
			@replace = true
			@require = '^googleMap'
			@scope =
				template: '@template'
				position: '@position'
				controller: '@controller'
				index: '@index'
			@$log = Logger
			@$timeout = $timeout

		link: (scope, element, attrs, ctrl) =>
			throw new Exception("Not implemented!!")
]