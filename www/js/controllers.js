angular.module('app.controllers', [])

.controller('planYourWorkoutCtrl', function($scope, $state, workoutFactory) {
  $scope.setWorkout = function() {
    console.log('setWorkout');
    $scope.workout = {
      rounds: '12',
      roundsTime: '180',
      restTime: '60'
    };
  };

  $scope.submitWorkout = function() {
    console.log('submitWorkout');

    $scope.workout.rounds = Number($scope.workout.rounds);
    $scope.workout.roundsTime = Number($scope.workout.roundsTime);
    $scope.workout.restTime = Number($scope.workout.restTime);

    $scope.workout.roundsTimeInMilliseconds = ($scope.workout.roundsTime * 1000);
    $scope.workout.restTimeInMilliseconds = ($scope.workout.restTime * 1000);

    workoutFactory.workoutData = $scope.workout;

    $state.go('tabsController.timer');
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    console.log('beforeEnter planning');
    $scope.setWorkout();
  });

})

.controller('timerCtrl', function($scope, $state, workoutFactory, $interval, $timeout, $ionicPopup, $cordovaMedia) {
  if(workoutFactory.workoutData == undefined) {
    return;
  }
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $scope.roundsCompleted = undefined;
  $scope.roundsRemaining = undefined;
  $scope.restsRemaining = undefined;
  $scope.singleRoundTime = undefined;
  $scope.singleRestTime = undefined;
  $scope.roundTimeRemaining = undefined;
  var roundInterval;
  var popup;

  $scope.setVariables = function() {
    $scope.roundsCompleted = 0;
    $scope.roundsRemaining = workoutFactory.workoutData.rounds || 0;
    $scope.restsRemaining = workoutFactory.workoutData.rounds - 1;
    $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
    $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
    $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds) || 0;
  };

  $scope.parseSeconds = function(totalMilliseconds) {
    console.log('parseSeconds');
    var timeObj = {};
    var seconds = totalMilliseconds / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    timeObj.seconds = Math.floor(seconds);
    timeObj.minutes = Math.floor(minutes);
    timeObj.hours = Math.floor(hours);

    timeObj.seconds = $scope.addZero(timeObj.seconds);
    timeObj.minutes = $scope.addZero(timeObj.minutes);
    timeObj.hours = $scope.addZero(timeObj.hours);

    return timeObj;
  };

  $scope.addZero = function(num) {
    console.log('addZero');
    console.log('typeof num', typeof num);
    if(num === undefined || num === null) {
      console.log('undefined/null');
      return '00';
    }
    if(num < 10) {
      num = '0' + num;
    }
    return num;
  }

  $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);

  $scope.calculateWorkOut = function() {
    if($scope.singleRoundTime !== 0) {
      $scope.singleRoundTime = $scope.singleRoundTime - 1000;
    }
  };

  $scope.incrementRounds = function() {
    $scope.playSound('sounds/Air-Horn.mp3');
    $interval.cancel(roundInterval);
    $scope.roundsCompleted = $scope.roundsCompleted + 1;
    $scope.roundsRemaining = $scope.roundsRemaining - 1;
  };

  $scope.restPopup = function() {
    popup = $ionicPopup.show({
      title: 'Take a break!',
      scope: $scope
    });
  };

  $scope.checkRounds = function() {
    if($scope.singleRoundTime <= 0) {
      $scope.incrementRounds();
      if($scope.roundsRemaining <= 0) {
        $scope.singleRoundTime = 0;
        return;
      }
      if($scope.restsRemaining > 0) {
        $scope.singleRoundTime = 0;
        $scope.restsRemaining = $scope.restsRemaining - 1;
        $scope.restPopup();
        $timeout(function() {
          console.log('timeout');
          popup.close();
          $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
          $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
          $scope.roundIntervalFunc();
        }, $scope.singleRestTime);
      }
    }
  };

  $scope.playSound = function(filepath) {
    var currentPlatform = ionic.Platform.platform();
    if(ionic.Platform.isIOS() !== true && ionic.Platform.isAndroid() !== true) {
      console.log('if statement return');
      return;
    }
    var src = filepath;
    if(ionic.Platform.isAndroid()) {
      src = '/android_asset/www/' + src;
      console.log(src);
    }
    var media = $cordovaMedia.newMedia(src);
    media.play();
  };

  $scope.resetObjs = function() {
    console.log('resetObjs');
    $scope.roundsCompleted = undefined;
    $scope.roundsRemaining = undefined;
    $scope.restsRemaining = undefined;
    $scope.singleRoundTime = undefined;
    $scope.singleRestTime = undefined;
    $scope.roundTimeRemaining = undefined;
    workoutFactory.workoutData = {};
  }

  $scope.roundIntervalFunc = function() {
    if(!$scope.singleRoundTime) {
      return;
    }
    console.log('roundIntervalFunc');
    $scope.playSound('sounds/Boxing_arena.mp3');
    roundInterval = $interval(function() {
      $scope.checkRounds();
      $scope.calculateWorkOut();
      $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
    }, 1000);
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.setVariables();
    $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
  });

  $scope.$on('$ionicView.enter', function() {
    console.log('onEnter');
    $scope.roundIntervalFunc();
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    console.log('beforeLeave');
    $scope.resetObjs();
  });

})
