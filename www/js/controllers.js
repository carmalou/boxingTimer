angular.module('app.controllers', [])

.controller('planYourWorkoutCtrl', function($scope, $state, workoutFactory) {
  $scope.setWorkout = function() {
    $scope.workout = {
      rounds: '12',
      roundsTime: '180',
      restTime: '60'
    };
  };

  $scope.submitWorkout = function() {
    $scope.workout.rounds = Number($scope.workout.rounds);
    $scope.workout.roundsTime = Number($scope.workout.roundsTime);
    $scope.workout.restTime = Number($scope.workout.restTime);

    $scope.workout.roundsTimeInMilliseconds = ($scope.workout.roundsTime * 1000);
    $scope.workout.restTimeInMilliseconds = ($scope.workout.restTime * 1000);

    workoutFactory.workoutData = $scope.workout;
    workoutFactory.workoutData.timerStarted = false;

    $state.go('tabsController.timer');
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.setWorkout();
  });

})

.controller('timerCtrl', function($scope, $state, workoutFactory, $interval, $timeout, $ionicPopup, $cordovaMedia, $cordovaNativeAudio) {
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $cordovaNativeAudio
    .preloadSimple('endOfRound', 'sounds/Air-Horn.mp3');
    .then(function(msg) {
      console.log(msg);
    }, function(error) {
      console.log(error);
    });

  $cordovaNativeAudio
    .preloadSimple('endOfRest', 'sounds/Boxing_arena.mp3');
    .then(function(msg) {
      console.log(msg);
    }, function(error) {
      console.log(error);
    });

  $scope.roundsCompleted = undefined;
  $scope.roundsRemaining = undefined;
  $scope.restsRemaining = undefined;
  $scope.singleRoundTime = undefined;
  $scope.singleRestTime = undefined;
  $scope.roundTimeRemaining = undefined;
  var roundInterval;
  var popup;

  $scope.setVariables = function() {
    if(roundInterval) {
      $interval.cancel(roundInterval);
      roundInterval = undefined;
    }
    $scope.roundsCompleted = 0;
    $scope.roundsRemaining = workoutFactory.workoutData.rounds;
    $scope.restsRemaining = workoutFactory.workoutData.rounds - 1;
    $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
    $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
    $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds);
  };

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

    timeObj.seconds = $scope.addZero(timeObj.seconds);
    timeObj.minutes = $scope.addZero(timeObj.minutes);
    timeObj.hours = $scope.addZero(timeObj.hours);

    return timeObj;
  };

  $scope.addZero = function(num) {
    if(num == undefined) {
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
    $scope.playSound('rest');
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
          popup.close();
          $cordovaNativeAudio.unload('round');
          $cordovaNativeAudio.unload('rest');
          $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
          $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
          $scope.roundIntervalFunc();
        }, $scope.singleRestTime);
      }
    }
  };

  // $scope.playSound = function(filepath) {
  //   // if(media) {
  //   //   media.release();
  //   // }
  //   var currentPlatform = ionic.Platform.platform();
  //   if(ionic.Platform.isIOS() !== true && ionic.Platform.isAndroid() !== true) {
  //     console.log('if statement return');
  //     return;
  //   }
  //   var src = filepath;
  //   if(ionic.Platform.isAndroid()) {
  //     src = '/android_asset/www/' + src;
  //   }
  //   // var media = $cordovaMedia.newMedia(src);
  //   // media.play();
  //   // media.release();
  // };

  $scope.playSound = function(roundOrRest) {
    if(roundOrRest == 'round') {
      $cordovaNativeAudio.play('endOfRound');
    }
    if(roundOrRest == 'rest') {
      $cordovaNativeAudio.play('endOfRest');
    }
  };

  $scope.resetObjs = function() {
    $scope.roundsCompleted = undefined;
    $scope.roundsRemaining = undefined;
    $scope.restsRemaining = undefined;
    $scope.singleRoundTime = undefined;
    $scope.singleRestTime = undefined;
    $scope.roundTimeRemaining = undefined;
    workoutFactory.workoutData = {};
    $interval.cancel(roundInterval);
    workoutFactory.workoutData.timerStarted = false;
  };

  $scope.roundIntervalFunc = function() {
    if(!$scope.singleRoundTime) {
      return;
    }
    $scope.playSound('round');
    roundInterval = $interval(function() {
      $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
      $scope.checkRounds();
      $scope.calculateWorkOut();
    }, 1000);
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    if(workoutFactory.workoutData == undefined || workoutFactory.workoutData.timerStarted == true) {
      return;
    }
    $scope.setVariables();
    $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
  });

  $scope.$on('$ionicView.enter', function() {
    if(workoutFactory.workoutData == undefined || workoutFactory.workoutData.timerStarted == true) {
      return;
    }
    workoutFactory.workoutData.timerStarted = true;
    $scope.roundIntervalFunc();
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    if($scope.roundsRemaining !== 0) {
      return;
    }
    $scope.resetObjs();
  });

})
