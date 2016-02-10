angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

})

.controller('HomeTabCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup) {
  console.log('HomeTabCtrl');
  
  $ionicModal.fromTemplateUrl('selectModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.selectModal = modal;
			$scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
			$scope.selectModalSlider.enableSlide(false);
		});
  
		$scope.closeSelectModal = function () {
			if ($scope.selectModalSlider.currentIndex() == 0)
				$scope.selectModal.hide();
			else
				$scope.selectModalSlider.previous();
		};
  
		$scope.openSelectModal = function () {
			$scope.selectModalSlider.slide(0);
			$scope.itemSelected = false;	
			$scope.categoryList = [
        {id: 1, title: 'Category A'},
        {id: 2, title: 'Category B'},
        {id: 3, title: 'Category C'}
      ];
			$scope.selectModal.show();
		};

		$scope.selectCategory = function(category) {
      // load list based on category      
      if (category.id == 1)
        $scope.list = [
          {id: 1, title: 'Item 1'},
          {id: 2, title: 'Item 2'},
          {id: 3, title: 'Item 3'}
        ];   
      if (category.id == 2)
        $scope.list = [
          {id: 4, title: 'Item 4'},
          {id: 5, title: 'Item 5'},
          {id: 6, title: 'Item 6'}
        ];   
      if (category.id == 3)
        $scope.list = [
          {id: 7, title: 'Item 7'},
          {id: 8, title: 'Item 8'},
          {id: 9, title: 'Item 9'}
        ];
			$ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
		};

		$scope.selectItem = function(item) {
			$scope.itemSelected = item;
		};

		$scope.submitSelection = function() {
			$scope.selectModal.hide();
      var alertPopup = $ionicPopup.alert({
       title: 'Hurray!',
       template: 'You selected: '+$scope.itemSelected.title
     });
		};
  
  
});