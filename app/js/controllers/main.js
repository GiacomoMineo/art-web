var paintingsModule = angular.module('paintingsModule', ['ngAnimate']);

paintingsModule.factory('paintings', ['$http', '$rootScope', 
	function($http, $rootScope) {
    var paintings = [];
    var currentPainting;
    var paintingsService = {};

    paintingsService.setList = function(data) {
      paintings = data;
      return paintings;
    }

    paintingsService.setCurrent = function(id) {
      resizeHeights();
      //search the current painting inside the data structure
      for (var i = 0; i < paintings.length; i++) {
        if(paintings[i].id == id) {
          currentPainting = paintings[i];
        }
      }
      //conditions for arrows visibility
      var topLimit = false;
      var bottomLimit = false;
      var leftLimit = false;
      var rightLimit = false;
      if (currentPainting.top != -1) {
        topLimit = true;
      }
      if (currentPainting.bottom != -1) {
        bottomLimit = true;
      }
      if (currentPainting.left != -1) {
        leftLimit = true;
      }
      if (currentPainting.right != -1) {
        rightLimit = true;
      }
      $rootScope.topLimit = topLimit;
      $rootScope.bottomLimit = bottomLimit;
      $rootScope.leftLimit = leftLimit;
      $rootScope.rightLimit = rightLimit;
      //currentPainting data bind
      $rootScope.subtitle = currentPainting.title;
      return currentPainting;
    }

    return paintingsService;
  }]);


paintingsModule.controller('HomeCtrl', ['$scope', '$http', '$rootScope', 'paintings',
  function ($scope, $http, $rootScope, paintings) {
    $('.nav-wrapper').hide(0);
  	resizeHeights();
    $rootScope.currentPage = 'home';
  	$rootScope.paintingsVisible = false;
  	$rootScope.pageAnimationClass = 'noAnimation';
  	$rootScope.bodyOverflow = 'overflow';
  	$rootScope.subtitle = 'Home';
    $rootScope.topLimit = false;
    $rootScope.bottomLimit = false;
    $rootScope.leftLimit = false;
    $rootScope.rightLimit = false;

  	var paintingsDataPath = 'data/paintings.json';
  	
    $http.get(paintingsDataPath).success(function(data) {
      $scope.paintings = paintings.setList(data);
    });
  }]);

paintingsModule.controller('MinimapCtrl', ['$scope', '$rootScope', '$http', 'paintings', 
  function($scope, $rootScope, $http, paintings) {
    $('.nav-wrapper').show(0);
    $http.get('data/paintings.json').success(function(data) {
      $scope.paintings = data;
    });
    $rootScope.$watch('currentPainting', function() {
      $scope.painting = $rootScope.currentPainting;
    });
  }]);

paintingsModule.controller('PaintingDetailCtrl', ['$scope', '$routeParams', '$http', '$window', '$rootScope', '$location', 'paintings',
  function($scope, $routeParams, $http, $window, $rootScope, $location, paintings) {
    $('.nav-wrapper').show(0);
  	$rootScope.paintingsVisible = true;
    $rootScope.currentPage = 'paintings';
  	$rootScope.bodyOverflow = 'no-overflow';
  	// Instructions executed when the route target is painting-detail
    var paintingsDataPath = 'data/paintings.json';
    $http.get(paintingsDataPath).success(function(data) {
      //save the paintings list in the service variable
      $scope.paintings = paintings.setList(data);
      var id = $routeParams.paintingId;
      if(id == 'intro') {
        $rootScope.topLimit = true;
        $rootScope.bottomLimit = false;
        $rootScope.leftLimit = true;
        $rootScope.rightLimit = true;
      }
      var thisPainting = paintings.setCurrent(id);
      $scope.painting = thisPainting;
      $rootScope.currentPainting = thisPainting;
    });

    $rootScope.goPainting = function (direction) {
      $(".minimap-wrapper .map").hide(0).delay(500).show(0);
      if (typeof(pageAnimationClass) === 'undefined') { // Default animation
        $rootScope.pageAnimationClass = 'noAnimation';
      } 
      var path = '/';
      // Animation class and path depending on direction
      switch (direction) {
        case "up":
          $rootScope.pageAnimationClass = 'moveUp'; 
          path = '/paintings/' + moveUp();
          break;
        case "down":
          $rootScope.pageAnimationClass = 'moveDown'; 
          path = '/paintings/' + moveDown();
          break;
        case "left":
          $rootScope.pageAnimationClass = 'moveLeft'; 
          path = '/paintings/' + moveLeft();
          break;
        case "right":
          $rootScope.pageAnimationClass = 'moveRight'; 
          path = '/paintings/' + moveRight();
          break;
        default:
          break;
      }
      // Go to the path (launches the PaintingDetailCtrl passing the :paintingId parameter)
      $location.path(path);
    };

    function moveUp() {
      var id = $scope.paintings[$scope.painting.top].id;
      return id;
    }
    function moveDown() {
      var id = $scope.paintings[$scope.painting.bottom].id;
      return id;
    }
    function moveLeft() {
      var id = $scope.paintings[$scope.painting.left].id;
      return id;
    }
    function moveRight() {
      var id = $scope.paintings[$scope.painting.right].id;
      return id;
    }
  }]);

paintingsModule.directive('onKeyup', ['$rootScope', '$location',
  function($rootScope, $location) {
    return function(scope, elm, attrs) {  

      var allowedKeys = scope.$eval(attrs.keys);
      elm.bind('keyup', function(evt) {
        //if no key restriction specified, always fire
        if (!allowedKeys || allowedKeys.length == 0) {
          applyKeyup();
        } else {
          angular.forEach(allowedKeys, function(key) {
            if (key == evt.which) {
              switch(key) {
                case 37:
                  if($rootScope.leftLimit) {
                    $rootScope.goPainting('left');
                  }
                  break;
                case 38:
                  if($rootScope.topLimit) {
                    $rootScope.goPainting('up');
                  }
                  break;
                case 39:
                  if($rootScope.rightLimit) {
                    $rootScope.goPainting('right');
                  }
                  break;
                case 40:
                  if($rootScope.bottomLimit) {
                    $rootScope.goPainting('down');
                  }
                  break;
                default:
                  break;
              }
              scope.$apply();
            }
          });
        }
      });
    };
  }]);

paintingsModule.controller('InspirationsCtrl', ['$scope', '$rootScope', '$http',
  function($scope, $rootScope, $http) {
    $('.nav-wrapper').show(0);
    $rootScope.currentPage = 'inspirations';
    $rootScope.subtitle = 'Inspirations';
    $rootScope.paintingsVisible = false;

    var photosDataPath = 'data/inspiration.json';

    $http.get(photosDataPath).success(function(data) {
      $scope.photos = data;
      var j = 0;
      for(var i = 0; i < $scope.photos.length; i++) {
        $scope.photos[i]['style'] = "style" + j;
        if (j != 5) {
          j++
        } else {
          j = 0;
        }
      }
    });
  }]);

paintingsModule.controller('ContactsCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $('.nav-wrapper').show(0);
    $rootScope.currentPage = 'contacts';
    $rootScope.subtitle = 'Contacts';
    $rootScope.paintingsVisible = false;
  }]);

// jQuery for heights and central size

function resizeHeights() {
	var h = $(window).height();
	var w = $('.painting').width();
	var proportionCoeff = 1.33;
	var offsetTop = ((h-(w*proportionCoeff))/2);

	$(".arrows").css("height", h);
	$(".container").css("height", h);
  $(".painting").css("height", w*proportionCoeff);
  $(".paintings-wrapper").css('top', offsetTop-40 + "px");
  $(".home-wrapper").css('height', h*0.9);
  $(".home-wrapper").css('margin-top', h*0.05);
  $(".home-wrapper .map").css('top', h*0.05);
  $(".map").css('height', h*0.8);
  $(".map").css('width', $('.map').height());
  $(".minimap-wrapper .map").css('height', w*proportionCoeff);
  $(".minimap-wrapper .map").css('width', $('.minimap-wrapper .map').height());
  $(".minimap-wrapper").css('top', offsetTop + "px");
}

$(window).on('load resize', function(){
  resizeHeights();
});

/* Paintings Data Set Rules 
  
  id: intro - unique identifier for starting area
      null - disabled painting with all connections disabled (-1)
      otherwise - unique identifier

  top, bottom, left, right : -1 - no child attached
                             otherwise - index of the child in the array

  img: absolute path for the painting image

  detail: absolute path(s) for the painting detail(s)

*/