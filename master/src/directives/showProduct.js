
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
