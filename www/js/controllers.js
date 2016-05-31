angular.module('app.controllers', [])

.controller('planYourWorkoutCtrl', function($scope, $state, workoutFactory) {
  $scope.workout = {};

  $scope.submitWorkout = function() {
    $scope.workout.roundsTimeInMilliseconds = ($scope.workout.roundsTime * 1000);
    $scope.workout.restTimeInMilliseconds = ($scope.workout.restTime * 1000);

    workoutFactory.workoutData = $scope.workout;

    $state.go('tabsController.timer');
  };

})

.controller('timerCtrl', function($scope, $state, workoutFactory, $interval, $timeout, $ionicPopup, $cordovaMedia) {
  if(workoutFactory.workoutData == undefined) {
    return;
  }
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $scope.roundsCompleted = 0;
  $scope.roundsRemaining = workoutFactory.workoutData.rounds;
  $scope.restsRemaining = workoutFactory.workoutData.rounds - 1;
  $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
  $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
  $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds);
  var roundInterval;
  var popup;

  $scope.parseSeconds = function(totalMilliseconds) {
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

    return timeObj;
  };

  $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);

  $scope.calculateWorkOut = function() {
    if($scope.singleRoundTime !== 0) {
      $scope.singleRoundTime = $scope.singleRoundTime - 1000;
    }
  };

  $scope.incrementRounds = function() {
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
        var restInterval = $interval(function() {
          console.log('resting...');
          $scope.singleRestTime = $scope.singleRestTime - 1000;
        }, 1000)
        $timeout(function() {
          $interval.cancel(restInterval);
          popup.close();
          $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
          $scope.roundIntervalFunc();
        }, $scope.singleRestTime);
      }
    }
  };

  $scope.playSound = function(filepath) {
    var src = filepath;
    var media = $cordovaMedia.newMedia(src);
    media.play();

    // if(ionic.Platform.isAndroid()) {
    //   src = '/android_asset/www/sounds/Air-Horn.mp3';
    //   var media = $cordovaMedia.newMedia(src);
    //   media.play();
    // }
    // if(var isIOS = ionic.Platform.isIOS()) {
    //   src = '/www/sounds/Air-Horn.mp3';
    //   var media = $cordovaMedia.newMedia(src);
    //   media.play();
    // }
  };

  $scope.roundIntervalFunc = function() {
    roundInterval = $interval(function() {
      $scope.checkRounds();
      $scope.calculateWorkOut();
      $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
      console.log('is this just stopping?');
    }, 1000);
  };

  $scope.roundIntervalFunc();

})
