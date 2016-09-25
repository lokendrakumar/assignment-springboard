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