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
			appleMusicUrl: "https://music.apple.com/us/album/cantina-band-coffeehouse-lofi-single/1506437207",
			spotifyUrl: "https://open.spotify.com/track/1J303X3dxiQqA1CkDQ1raP"
		}, {
			title: "Red Planet",
			artwork: "/img/albumartwork/redplanetsmall.jpg",
			ytId: "CFyarso6tno",
			appleMusicUrl: "https://music.apple.com/us/album/red-planet-single/1495673733",
			spotifyUrl: "https://open.spotify.com/track/3UGNUVxYE99mvSZAm1aBdU"
		}, {
			title: "Duel of the Keyboards",
			artwork: "/img/albumartwork/fatessmall.jpg",
			ytId: "ezGtx-X5MnI"
		}, {
			title: "calm down",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "ooJlM3GIehM",
			appleMusicUrl: "https://music.apple.com/us/album/calm-down/1471647940?i=1471647950",
			spotifyUrl: "https://open.spotify.com/track/1EAxLwMe2FHA0ZDgTw2QV0"
		}, {
			title: "high five",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "DL5Q9h6dgAA",
			appleMusicUrl: "https://music.apple.com/us/album/high-five/1471647940?i=1471647949",
			spotifyUrl: "https://open.spotify.com/track/1hhf7opu7kngZeMky1QwYx"
		}, {
			title: "shimmer",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "BE1H82AaW2k",
			appleMusicUrl: "https://music.apple.com/us/album/shimmer/1471647940?i=1471647948",
			spotifyUrl: "https://open.spotify.com/track/33nuc5WlllA94S6vkrMfmM"
		}, {
			title: "hint of funk",
			artwork: "/img/albumartwork/serenade2small.jpg",
			ytId: "DL5Q9h6dgAA",
			appleMusicUrl: "https://music.apple.com/us/album/hint-of-funk/1471647940?i=1471647944",
			spotifyUrl: "https://open.spotify.com/track/00yCAuO5k8tNk4QTp6VVQU"
		}, {
			title: "Thought",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "002qTlNG63o",
			appleMusicUrl: "https://music.apple.com/us/album/thought/1445544143?i=1445544144",
			spotifyUrl: "https://open.spotify.com/track/1doJ5ibfLfVAq5wE6SlRsD"
		}, {
			title: "Intuition",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "XUlfgJUzGBE",
			appleMusicUrl: "https://music.apple.com/us/album/intuition/1445544143?i=1445544145",
			spotifyUrl: "https://open.spotify.com/track/7GWAPFztkA18NmdjPKAoOc"
		}, {
			title: "Infinity",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "8c3mmBM80R4",
			appleMusicUrl: "https://music.apple.com/us/album/infinity/1445544143?i=1445544146",
			spotifyUrl: "https://open.spotify.com/track/3XVJ59dNESDhSnNIvyS69k"
		}, {
			title: "Inspiration",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "dD4ZTrpL7uc",
			appleMusicUrl: "https://music.apple.com/us/album/inspiration/1445544143?i=1445544147",
			spotifyUrl: "https://open.spotify.com/track/0pTZ7oSeJwgGcXANXXKnUy"
		}, {
			title: "Justice",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "dNSgThdQLi8",
			appleMusicUrl: "https://music.apple.com/us/album/justice/1445544143?i=1445544148",
			spotifyUrl: "https://open.spotify.com/track/4ZagHdWP9GblFvHwNOGhCQ"
		}, {
			title: "Time (Five Minutes of Extreme Depression)",
			artwork: "/img/albumartwork/tapessmall.jpg",
			ytId: "LVZsyt1nW3Q",
			appleMusicUrl: "https://music.apple.com/us/album/time-five-minutes-of-extreme-depression/1445544143?i=1445544149",
			spotifyUrl: "https://open.spotify.com/track/1eUDipzNvDye3p1dXBVbHC"
		}, {
			title: "Meaningless",
			artwork: "/img/albumartwork/meaninglesssmall.jpg",
			ytId: "K-pviuKzbrE",
			appleMusicUrl: "https://music.apple.com/us/album/meaningless/1432638707?i=1432638910",
			spotifyUrl: "https://open.spotify.com/track/1FyEPOdu3pu0vj1ZUaJ2Wj"
		}, {
			title: "7th",
			artwork: "/img/albumartwork/7thsmall.jpg",
			ytId: "PcFPQ6392wY",
			appleMusicUrl: "https://music.apple.com/us/album/7th/1420451934?i=1420451946",
			spotifyUrl: "https://open.spotify.com/track/1Jq1EY8WdhzEAvjypYcWKD"
		}, {
			title: "Rising Tide",
			artwork: "/img/albumartwork/risingtidesmall.jpg",
			ytId: "U_wcCRk-xfE",
			appleMusicUrl: "https://music.apple.com/us/album/rising-tide/1353786926?i=1353786927",
			spotifyUrl: "https://open.spotify.com/track/4KPE7dYGWc5hZFNcLf7wr5"
		}, {
			title: "The First Noel [Piano Cover]",
			artwork: "/img/albumartwork/noelsmall.jpg",
			ytId: "gnLwB56Nxvs"
		}, {
			title: "Placid Synths",
			artwork: "/img/albumartwork/placidsynthssmall.jpg",
			ytId: "j9FLijbs47A",
			appleMusicUrl: "https://music.apple.com/us/album/placid-synths/1292725285?i=1292725290",
			spotifyUrl: "https://open.spotify.com/track/11n06FUiGJHy2NzfixoDAF"
		}, {
			title: "Compressed Fir3",
			artwork: "/img/albumartwork/fir3small.jpg",
			ytId: "jtchSrICwHg",
			appleMusicUrl: "https://music.apple.com/us/album/compressed-fir3/1274956604?i=1274956608",
			spotifyUrl: "https://open.spotify.com/track/4cAbEdA9RtbBicxtaDDoz5"
		}, {
			title: "Comic Punch",
			artwork: "/img/albumartwork/comicpunchsmall.jpg",
			ytId: "EnttmZBAiic",
			appleMusicUrl: "https://music.apple.com/us/album/comic-punch/1287396718?i=1287396723",
			spotifyUrl: "https://open.spotify.com/track/5HxcdOSOe7eusQ5nvoy6wL"
		}];

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			// $('.music-caption').hide();
			$('.music-gallery-item').mouseenter(function() {
				$(this).find('.music-caption').fadeIn(100);
			}).mouseleave(function() {
				$(this).find('.music-caption').fadeOut(100);
			});
		});

		$scope.hideYtPlayer = function() {
			ytmodal.fadeOut(100, function() {
				ytmodal.html('');
			});
		}

		$scope.ytClicked = function(id) {
			ytmodal.html(`<iframe id="ytplayer" type="text/html"` +
		  			`src="https://www.youtube.com/embed/${id}?autoplay=1"` +
					 `frameborder="0"></iframe>`);
			ytmodal.fadeIn(100);
		};

		$scope.spotifyClicked = function(id) {
			ytmodal.html(
				`<iframe id="spotifyplayer" src="https://open.spotify.com/embed/track/${id}" ` +
				`frameborder="0" allowtransparency="true" `  +
				`allow="encrypted-media"></iframe>`);
			ytmodal.fadeIn(100);
		}

		$('#ytmodal').on('click', function (e) {
			$scope.hideYtPlayer();
		});

		$(document).keydown(function (e) {
			if(e.keyCode == 27 && $('#ytplayer').is(":visible")) {
				e.preventDefault();
				$scope.hideYtPlayer();
			}
		});
	});
})();
