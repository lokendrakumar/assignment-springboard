'use strict';
app.controller('HomePageController', ['$rootScope', '$scope', 'HomePageService', '$localStorage','$document',
  	function($rootScope, $scope, HomePageService, $localStorage, $document) 
  	{	
  		$scope.websites = [];
  		$scope.perPage = 5;
  		$scope.maxSize = 5;
        $scope.totalItems = '';
        $scope.page = 1;

        (function getWebsiteData()
	    {	
	    	HomePageService.getWebsite()
	    	.success(function(data)
	    	{	
	    		$localStorage.websiteData = data.websites;
	    		var length = Math.min(data.websites.length, $scope.perPage);
	    		for (var i = 0; i < length; i++) 
	    		{
	    			$scope.websites.push(data.websites[i]);
	    		}
	    		$scope.totalItems = data.websites.length;
	    		$rootScope.totalWebsite = data.websites.length;

			})
			.error(function(reason, status) 
			{
				alert(reason);
			}).finally(function() {});

	    })();

        $scope.showingOrderNo = 
        {
            from: 1,
            to: 5
        }
		

	    $scope.SearchModel = '';
	    $scope.searchWebsite =
		{
		    valueField: 'id',
		    labelField: 'mix_title',
		    searchField: 'mix_title',
		    maxItems: 1,
		    loadThrottle: 600,
            closeAfterSelect: true,
		    placeholder: 'search (by title, url or tag )',
		    load: function(query, callback)
		    {	
				var websitesArry = $localStorage.websiteData;
				var length = websitesArry.length;
				for (var i = 0; i < length; i++) 
				{
					websitesArry[i].mix_title = websitesArry[i].title + " " + websitesArry[i].tag + ' ' + websitesArry[i].url_address;
				}
				$scope.websitesList = websitesArry;
		    	
		    	callback($scope.websitesList)
		    },
		    onChange: function( value )
		    {	
		    	if(!value)
	    		{
	    			setPagination();
	    			$scope.$apply();
	    		}
		    	else
		    	{
			    	var length = $localStorage.websiteData.length;
			    	var webArry = $localStorage.websiteData;
			    	for (var i = 0; i < length; i++) 
			    	{
			    		if(webArry[i].id == parseInt(value))
			    		{	
			    			$scope.websites = [];
			    			$scope.websites.push(webArry[i]);
			    			$scope.$apply();
			    			break;
			    		}	
			    	}
		    	}
		    }
		};

		$scope.pushWebsite=
		{
			title: '',
			url_address: '',
			tag: ''
		}

		$scope.pushWebsite = function()
		{	
			$scope.isPushdisable = true;
			var postData = 
			{
				title: $scope.pushWebsite.title,
				url: $scope.pushWebsite.url_address,
				tag: $scope.pushWebsite.tag
			}
			HomePageService.addWebsite(postData)
	    	.success(function(data)
	    	{	
	    		$scope.message = data.message;
	    		$scope.isPushdisable = false;
	    		$scope.isShowMessage = true;
	    		setTimeout(function() 
	    		{	
	    			$scope.isShowMessage = false;
	    			$document.trigger('click')
	    		}, 200);
			})
			.error(function(reason, status) 
			{	
				$scope.isPushdisable = false;
				alert(reason);
			}).finally(function() {});
		}


		$scope.pageChanged = function() 
		{
			setPagination();
		};

		function setPagination()
		{
		    $scope.showingOrderNo = 
            {
                from: ($scope.page-1)* $scope.perPage +1,
                to: Math.min($scope.totalItems, $scope.page*$scope.perPage)
            }

            $scope.websites = [];
            var websiteArry = $localStorage.websiteData;
            var length = websiteArry.length;
            var fromIndex = ($scope.page-1)*$scope.perPage;
            var endIndex = Math.min(($scope.page-1)*$scope.perPage + $scope.perPage, length);
            for (var i = fromIndex; i < endIndex; i++) 
            {
            	$scope.websites.push(websiteArry[i]);
            }

		}
		

	}
]);




