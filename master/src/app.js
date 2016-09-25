/*!
 *
 * Version: 1.0.0
 * Author:@lokendra
 *
 Author
 Lokendra kumar
 */

app = angular.module('assignment', ['ui.router', 'ui.bootstrap', 'ngStorage', 'selectize'])
app.run(["$rootScope", "$stateParams",  '$location','$localStorage',
  	function($rootScope, $stateParams,  $location, $localStorage)
  	{
	    
  	}

  ]);


app.constant('CONFIG', {
  'baseUrl': 'https://hackerearth.0x10.info/api/'
});
