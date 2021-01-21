( function () {
	var app = angular.module('jrapp', ['ngRoute']);

	app.config(function ($routeProvider) {
		$routeProvider
		.when('/music', {
			templateUrl: "template/music.html",
			controller: "musicController"
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

	app.controller('musicController', function($scope) {
		const ytmodal = $('#ytmodal');

		$scope.music = [{
			title: "Cantina Band -- Coffeehouse Lofi Remix",
			artwork: "/img//albumartwork/cantinabandsmall.jpg",
			ytId: "9Kob3vYQ6yQ",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Red Planet",
			artwork: "/img/albumartwork/redplanetsmall.jpg",
			ytId: "CFyarso6tno",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Duel of the Keyboards",
			artwork: "/img/albumartwork/fatessmall.jpg",
			ytId: "ezGtx-X5MnI",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "calm down",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "ooJlM3GIehM",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "high five",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "DL5Q9h6dgAA",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "shimmer",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "BE1H82AaW2k",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "hint of funk",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "DL5Q9h6dgAA",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Thought",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "002qTlNG63o",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Intuition",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "XUlfgJUzGBE",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Inspiration",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "dD4ZTrpL7uc",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Infinity",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "8c3mmBM80R4",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Justice",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "dNSgThdQLi8",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Time (Five Minutes of Extreme Depression)",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "LVZsyt1nW3Q",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Meaningless",
			artwork: "/img/albumartwork/meaninglesssmall.jpg",
			ytId: "K-pviuKzbrE",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "7th",
			artwork: "/img/albumartwork/7thsmall.jpg",
			ytId: "PcFPQ6392wY",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Rising Tide",
			artwork: "/img/albumartwork/risingtidesmall.jpg",
			ytId: "U_wcCRk-xfE",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "The First Noel [Piano Cover]",
			artwork: "/img/albumartwork/noelsmall.jpg",
			ytId: "gnLwB56Nxvs",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Placid Synths",
			artwork: "/img/albumartwork/placidsynthssmall.jpg",
			ytId: "j9FLijbs47A",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Compressed Fir3",
			artwork: "/img/albumartwork/fir3small.jpg",
			ytId: "jtchSrICwHg",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}, {
			title: "Comic Punch",
			artwork: "/img/albumartwork/comicpunchsmall.jpg",
			ytId: "EnttmZBAiic",
			appleMusicUrl: "/",
			spotifyUrl: "/"
		}];

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			// $('.music-caption').hide();
			$('.music-gallery-item').mouseenter(function() {
				$(this).find('.music-caption').fadeIn(100);
			}).mouseleave(function() {
				$(this).find('.music-caption').fadeOut(100);
			});
		});

		$scope.embedClicked = function(id) {
			ytmodal.html(`<iframe id="ytplayer" type="text/html"` +
		  			`src="https://www.youtube.com/embed/${id}?autoplay=1"` +
					 `frameborder="0"></iframe>`);
			ytmodal.fadeIn(100);
		}

		$('#ytmodal').on('click', function (e) {
			ytmodal.fadeOut(100, function() {
				ytmodal.html('');
			});
		});
	});
})();
