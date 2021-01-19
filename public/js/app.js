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



	// Controller for the portfolio.
	// Load 15 photos at a time. After each api call, re-render the gallery.
	// We do this so we can display the first photos right away even though
	// not all the photos are loaded.
	app.controller('photographyController', function($scope) {
		const Flickr = require('flickr-sdk');
		const flickr = new Flickr("43f78664e8ba5328af416d5798d07979");
		const gallery = $('#gallery');

		$scope.portfolio = [];
		$scope.loadErr = false;
		var page = 1;

		// FUNCTIONS

		// Loads the next page from Flickr, and once the response is retrieved,
		// calls itself until the loaded page includes 0 photos.
		$scope.nextPage = function() {
			flickr.people.getPublicPhotos({
				user_id: "163300815@N05", // my own personal user
				safe_search: false,
				per_page: 15,			  // load 15 photos at once
				page: page,				  // load current page number
				extras: "url_m,url_h"	  // include thumbnail and fullscreen sizes
			}).then(function (res) {
				var photos = res.body.photos.photo;

				photos.forEach((value) =>{
					$scope.portfolio.push({
						url: value.url_h,		// fullscreen img url
						thumbnail: value.url_m,	// thumbnail url
						caption: value.title,	// caption/title
						thumb_h: value.height_m,
						thumb_w: value.width_m  // include height and width
												// of the thumbnail for
												// justifiedGallery to make
												// calculations
					});
				});

				// refresh the scope (this causes ng-repeat to render)
				$scope.$apply();

				// increase page number
				page += 1;

				// run again if this current page wasn't the last
				if (photos.length > 0) {
					$scope.nextPage();
				}
			}).catch(function (err) {
				console.log(err);
				$scope.loadErr = true;
			})
		}

		$scope.initGallery = function() {
			gallery.justifiedGallery({
				rowHeight: 200,
				lastRow: 'nojustify',
				rel: 'Portfolio',
				waitThumbnailsLoad: false,
				margins: 2
			}).on('jg.complete', function() {
				$('.colorbox-img').colorbox({
					maxWidth: '100%',
					maxHeight: '100%',
					opacity: '0.8',
					transaction: 'elastic',
					current: ''
				});
			});
		}

		$scope.gallery = function() {
			// render next set of photos
			gallery.justifiedGallery('norewind');
		};

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.gallery();
		});

		$scope.initGallery();
		$scope.nextPage();
	});


})();
