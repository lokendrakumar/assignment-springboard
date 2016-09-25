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


app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('app',{
        url: '/',
        views: {
            'navbar': {
                
                templateUrl: 'app/views/layouts/navbar.html',
            },
            'content': {
                templateUrl: 'app/views/pages/home.html',
                controller:  'HomePageController',
            },
            'footer': {
                templateUrl: 'app/views/layouts/footer.html'
            }
        }
    })

    $locationProvider.html5Mode(true);
 
});

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






app.directive('onFinishRender', function ($timeout) 
{
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
            $timeout(function () {
                scope.$emit(attr.eventname ? attr.eventname : 'ngRepeatFinished');
            });
            }
        }
    }
})

app.directive('validInput',['$rootScope', 'Checkout',  function($rootScope, Checkout) 
    {
        return {
            require: '?ngModel',
            scope: {
              "inputPattern": '@'
            },
            link: function(scope, element, attrs, ngModelCtrl) {

              var regexp = null;

              if (scope.inputPattern !== undefined) {
                regexp = new RegExp(scope.inputPattern, "g");
              }

              if(!ngModelCtrl) {
                return;
              }

                ngModelCtrl.$parsers.push(function(val) 
                {   
                    if (regexp) 
                    {
                        var clean = val.replace(regexp, '');
                        if (val !== clean)
                        {   
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                        if(clean.length > 0 && clean.length<11)
                        {
                            $rootScope.continuebtnWrapper = '';
                        }
                        else if(clean.length>10)
                        {
                            clean = clean.substring(0, 10);
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                        else
                        {
                            $rootScope.continuebtnWrapper = 'disabled';
                        }
                        return clean;

                    }
                    else
                    {
                        return val;
                    }

                });

                element.bind('keypress', function(event) 
                {
                    if(event.keyCode === 32) {
                      event.preventDefault();
                    }
                    if(event.keyCode === 13)
                    {   
                        var data = 
                        {
                            number: ngModelCtrl.$modelValue
                        }
                        Checkout.generateOtp(data)
                        .success(function(data) 
                        {
                            $rootScope.otpInput = '';
                            $rootScope.continuebtnWrapper = 'hide';
                        }).error(function(reason, status) 
                        {
                        }).finally(function() 
                        {   
                        });
                    }
                });
            }
        }
    }
]);

app.directive('ngShowProduct', ['$rootScope','$state', '$localStorage', 'cartServices',
    function($rootScope, $state, $localStorage, cartServices)
    {
        return {
            restrict: 'AE',
            scope: {
               productObj: '='
            },
            templateUrl: 'views/partials/showproduct.html',
            link: function(scope, element, attrs) 
            {
                
                scope.openProduct = function(product)
                {   
                    $rootScope.product = product;
                    $rootScope.productPopup = 'visible active';
                    $rootScope.navStatus = 'diable-nav';
                    
                }

                scope.addToCart =  function( product)
                {  
                    if(!product.hasOwnProperty('quantity'))
                    {
                        product.quantity = 1;
                    }
                    product.isSaved = true;
                    $rootScope.subTotalAmount = (parseFloat($rootScope.subTotalAmount) + parseFloat(product.price)).toFixed(2);
                    $rootScope.savedProducts.push(product);
                    cartServices.setTrolleyToLocalStorage();

                }

                scope.decreaseQt =  function( product )
                {   
                   
                    cartServices.decreaseQt(product);
                    cartServices.setTrolleyToLocalStorage();
                    // scope.$apply();
                }

                scope.increaseQt =  function( product)
                {
                    cartServices.increaseQt(product);
                    cartServices.setTrolleyToLocalStorage();
                    // scope.$apply();
                }

               
            }
        };

    }
]);
