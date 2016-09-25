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
	

	var getcourseData = function(id)
	{
	 	return $http.get('https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths', {
    	});	
	}

	return {
		getcourseData: getcourseData
	}


}])

'use strict';
app.controller('HomePageController', ['$rootScope', '$scope', 'HomePageService', '$localStorage', '$filter',
  	function($rootScope, $scope,  HomePageService, $localStorage, $filter) 
  	{	

        var page = 1;
        var perPage = 3;
        $scope.isPreloader = true;

        $scope.sort =
        {
            name: 'learner'
        }
  		$scope.courses = [];
        $scope.reverse = true;
        (function getcourseData()
	    {	
	    	HomePageService.getcourseData()
	    	.success(function(data)
	    	{	
                var dataLength = data.paths.length;
                for (var i = 0; i < dataLength; i++) 
                {
                    data.paths[i].upvote = 0;
                    data.paths[i].downvote = 0;
                }
                if(data.paths.length > 3)
                {
                    $('.right-arrow').prop('disabled', false);
                }
                else
                {
                    $('.right-arrow').prop('disabled', true);
                }
                if(typeof $localStorage.courses === 'undefined')
                {
	    		     $localStorage.courses = data.paths;
                    $scope.courses  = $filter('orderBy')(data.paths , $scope.sort.name);
                }
                else if($localStorage.courses.length != data.paths.length)
                {   
                    $localStorage.courses = data.paths;
                    $scope.courses  = $filter('orderBy')(data.paths , $scope.sort.name);
                }
                else 
                {
                    $scope.courses = $localStorage.courses;
                }
                pagination(false);
                $scope.shownCourse = $scope.courses[0];
                $scope.isPreloader = false;
                
			})
			.error(function(reason, status) 
			{
				alert(reason);
			}).finally(function() {});

	    })();
        

        $scope.sortdata = function()
        {
            $scope.courses  = $filter('orderBy')($localStorage.courses , $scope.sort.name);
            $scope.shownCourse = $scope.courses[0];
            pagination(false);
        }		

        $scope.leftPagination = function()
        {   
            if(page > 1)
            {   
                $('.left-arrow').prop('disabled', false);
                page -= 1;
                pagination(true)
            }
            
            if(page == 1)
            {   
                $('.left-arrow').prop('disabled', true);
                $scope.isLeft = true;
            }
        }

        $scope.rightPagination = function()
        {   
            var maxPage = $scope.courses.length/ perPage;
            maxPage = parseInt(maxPage) + 1;
            if(page < maxPage)
            {   
                $('.right-arrow').prop('disabled', false);
                page += 1;
                pagination(true)
            }

            if(page >= maxPage)
            {
                $('.right-arrow').prop('disabled', true);
            }
            
        }

        $scope.upvote = function()
        {   
            $scope.shownCourse.upvote +=1;
            updateLocalStorage();
            
        }

        $scope.downvote = function()
        {   
            $scope.shownCourse.downvote -= 1;
            updateLocalStorage();
        }

        $scope.setCourseInfo = function(id, $event)
        {
            var target = angular.element($event.currentTarget);
                $('.tag-wrapper').removeClass('selected');
                // $('.tag-wrapper').removeClass('selected')
                target.closest('.tag-wrapper').addClass('selected');
            var length = $scope.courses.length;
            for (var i = 0; i < length; i++) 
            {
                if(id == $scope.courses[i].id)
                {
                    $scope.shownCourse = $scope.courses[i];
                }
            }
        }
        function updateLocalStorage()
        {
            var length = $localStorage.courses.length;
            for (var i = 0; i < length; i++) 
            {
                if($localStorage.courses[i].id == $scope.shownCourse.id)
                {
                    $localStorage.courses[i] = $scope.shownCourse;
                    break;
                }                
            }
        }

        function pagination(isLeftright)
        {   
            $scope.buttomCourseData =[];
            var start = perPage*(page-1);
            var end = Math.min(perPage*page, $scope.courses.length);
            for (var  i= start; i < end; i++) 
            {
                $scope.buttomCourseData.push($scope.courses[i]);
            }
            if( !isLeftright )
            {
                $('.tag-wrapper').removeClass('selected');
                setTimeout(function() {

                    $('.buttom-tag0').addClass('selected');
                }, 100);
            }

            $scope.showing =
            {
                from: Math.max(start , 1),
                to: end,
            }
            
        }


	    $scope.SearchModel = '';
	    $scope.searchCourses =
		{
		    valueField: 'id',
		    labelField: 'tags',
		    searchField: 'tags',
		    maxItems: 1,
		    loadThrottle: 600,
            closeAfterSelect: true,
		    placeholder: 'search (by tag )',
		    load: function(query, callback)
		    {	
		    	callback($scope.courses);
		    },
		    onChange: function( value )
		    {	
                var coursesLength = $localStorage.courses.length;
                for (var i = 0; i < coursesLength; i++) 
                {   
                    if($localStorage.courses[i].id == value)
                    {
                        $scope.shownCourse = $localStorage.courses[i];
                        break;
                    }
                }
			    
			}
		};



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
