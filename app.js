'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'myApp.home',
        'myApp.cursos',
        'myApp.notif',
        "myApp.curso"
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});
    }])
    .controller('AppCtrl', function ($scope, $mySidenav, $location, $rootScope, $window) {
        $scope.appName = "Sistema de Seguimiento Académico";
        $scope.titulo = $scope.appName;
        $scope.toggleLeft = $mySidenav.toogle("left");
        $scope.enableBack = false;
        $scope.back = function () {
            $window.history.back();
        }
        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            console.log($location.path().split("/"));
            var route = $location.path().split("/");
            $scope.enableBack = false;
            if(route[1]=="home"){
                $scope.titulo = $scope.appName;
            }else{
                $scope.titulo = route[route.length-1];
                if(route.length>2){
                    $scope.enableBack = true;
                }
            }
        });
    })
    .controller('LeftNavCtrl', function ($scope, $mySidenav, $location) {
        $scope.navID = "left";
        $scope.close = function () {
            $mySidenav.close($scope.navID);
        }
        $scope.items = [
            {
                label: 'Inicio',
                path: '/home',
                icon: ' home'
            },
            {
                label: 'Cursos',
                path: '/cursos',
                icon: 'book'
            },
            {
                label: 'Notificaciones',
                path: '/notificaciones',
                icon: 'notifications'
            }
        ];
        $scope.navigateTo = function (path) {
            $location.path(path);
            $scope.close();
        };
    })
    .factory("$cursosService", ["$q", "$http", function ($q, $http) {
        function getCursosByProfesor(id_profesor) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('data/cursos.json')
                .success(function (data) {
                    defered.resolve(data);
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        };
        function getCursosByID(cursoID) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('data/cursos.json')
                .success(function (data) {
                    defered.resolve(data[1]);
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        };
        return {
            getCursosByProfesor: getCursosByProfesor,
            getCursosByID: getCursosByID
        };
    }])
    .factory("$alumnosService",function ($q,$http) {
        function getAlumnosByCurso(cursoID) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('data/alumnos.json')
                .success(function (data) {
                    defered.resolve(data);
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        };
        return {
            getAlumnoByCurso: getAlumnosByCurso
        };
    })
    .factory("$toolbar",function ($scope) {
            $scope.title = "no tile";
    })
    .factory("$mySidenav", function ($timeout, $mdSidenav, $log) {

        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        function buildDelayedToggler(navID) {
            return debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

        function close(navID) {
            $mdSidenav(navID).close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };
        return {
            toogle: buildToggler,
            toggleDelay: buildDelayedToggler,
            close: close
        }
    });
