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

.controller('timerCtrl', function($scope, $state, workoutFactory, $interval, $timeout) {
  if(workoutFactory.workoutData == undefined) {
    return;
  }
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $scope.totalWorkoutMilliseconds = undefined;
  $scope.roundsCompleted = 0;
  $scope.roundsRemaining = workoutFactory.workoutData.rounds;
  $scope.restsRemaining = workoutFactory.workoutData.rounds - 1;
  $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
  $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
  $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds);
  $scope.totalTimeRemaining = ((workoutFactory.workoutData.restTimeInMilliseconds * (workoutFactory.workoutData.rounds - 1)) + $scope.roundTimeRemaining);
  $scope.totalWorkoutMilliseconds = $scope.totalTimeRemaining;
  var roundInterval;

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
  $scope.totalTimeRemainingObj = $scope.parseSeconds($scope.totalTimeRemaining);

  $scope.calculateWorkOut = function() {
    $scope.totalWorkoutMilliseconds = $scope.totalWorkoutMilliseconds - 1000;
    if($scope.singleRoundTime !== 0) {
      $scope.singleRoundTime = $scope.singleRoundTime - 1000;
    }
  };

  $scope.checkRounds = function() {
    if($scope.singleRoundTime <= 0) {
      console.log('single round is less than or equal to zero');
      console.log('$scope.roundsRemaining', $scope.roundsRemaining);
      if($scope.roundsRemaining <= 0) {
        $interval.cancel(roundInterval);
        console.log('rounds remaining = 0');
        $scope.singleRoundTime = 0;
        $scope.roundsCompleted = $scope.roundsCompleted + 1;
        $scope.roundsRemaining = $scope.roundsRemaining - 1;
        return;
      }
      if($scope.restsRemaining > 0) {
        $interval.cancel(roundInterval);
        console.log('resting...');
        $scope.singleRoundTime = 0;
        $scope.restsRemaining = $scope.restsRemaining - 1;
        console.log('$scope.restsRemaining', $scope.restsRemaining);
        $timeout(function() {
          console.log('in the timeout');
          $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
          $scope.roundsCompleted = $scope.roundsCompleted + 1;
          $scope.roundsRemaining = $scope.roundsRemaining - 1;
          $scope.roundIntervalFunc();
        }, $scope.singleRestTime);
      }
    }
  };

  $scope.roundIntervalFunc = function() {
    roundInterval = $interval(function() {
      $scope.checkRounds();
      $scope.calculateWorkOut();
      $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
      $scope.totalTimeRemainingObj = $scope.parseSeconds($scope.totalTimeRemaining);
      console.log('is this just stopping?');
    }, 1000);
  };

  $scope.roundIntervalFunc();

})
