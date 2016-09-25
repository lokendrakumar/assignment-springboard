'use strict'
app.factory('HomePageService',['$http', '$rootScope','CONFIG', function ( $http, CONFIG )
{
	var addWebsite  = function(data)
	{
		return $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=' +data.title+'&url='+data.url+'&tag='+ data.tag, {
    	});	
	}

	var getWebsite = function(id)
	{
	 	return $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites', {
    	});	
	}

	return {
		addWebsite:addWebsite,
		getWebsite: getWebsite
	}


}])
