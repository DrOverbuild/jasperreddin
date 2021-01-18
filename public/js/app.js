( function () {
    var app = angular.module('jrapp', ['ngRoute']);

    app.config(function ($routeProvider) {
       $routeProvider
           .when('/music', {
               templateUrl: "template/music.html"
           })
           .when('/photography', {
               templateUrl: "template/photography.html",
               controller: "photographyController"
           })
           .when('/developer', {
               templateUrl: "template/developer.html"
           })
           .when('/films', {
               templateUrl: "template/films.html"
           })
           .when('/contact', {
               templateUrl: "template/contact.html"
           })
           .otherwise({
               templateUrl: "template/home.html"
           });
    });

    app.directive("navigation", function() {
        return {
            templateUrl: 'template/navigation.html',
            restrict: 'E',
            replace: true,
            scope: {
                activeClass: "=active"
            }
        };
    });

    app.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });

    app.controller('photographyController', function($scope) {
        const Flickr = require('flickr-sdk');
        const gallery = $('#gallery');

        $scope.portfolio = [];

        $scope.getPhotos = function() {
            const flickr = new Flickr("43f78664e8ba5328af416d5798d07979");
            flickr.people.getPublicPhotos({
                user_id: "163300815@N05",
                safe_search: false,
                per_page: 500,
                extras: "url_m,url_h"
            }).then(function (res) {
                const photos = res.body.photos.photo;
                photos.forEach((value) =>{
                    $scope.portfolio.push({
                        url: value.url_h,
                        thumbnail: value.url_m,
                        caption: value.title
                    });
                });
                $scope.$apply();
                console.log($scope.portfolio);
            }).catch(function (err) {
                console.log(err);
            })
        }

        $scope.gallery = function() {
            gallery.justifiedGallery({
                rowHeight: 200,
                lastRow: 'nojustify',
                rel: 'Portfolio',
                margins: 2,
                waitThumbnailsLoad: false
            }).on('jg.complete', function () {
                $('.colorbox-img').colorbox({
                    maxWidth: '100%',
                    maxHeight: '100%',
                    opacity: '0.8',
                    transaction: 'elastic',
                    current: ''
                });
            });
        };

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            $scope.gallery();
        });

        $scope.getPhotos();
    });


})();