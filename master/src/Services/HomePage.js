'use strict'
app.factory('HomePageService',['$http', '$rootScope','CONFIG', function ( $http, CONFIG )
{
	

	var getcourseData = function(id)
	{
	 	return $http.get('https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths', {
    	});	
	}

	return {
		getcourseData: getcourseData
	}


}])
