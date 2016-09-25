
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
