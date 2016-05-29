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
  $scope.roundsCompleted = '0';
  $scope.roundsRemaining = workoutFactory.workoutData.rounds;
  $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
  $scope.singleRestTime = workoutFactory.workoutData.restTimeInMilliseconds;
  $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds);
  $scope.totalTimeRemaining = ((workoutFactory.workoutData.restTimeInMilliseconds * (workoutFactory.workoutData.rounds - 1)) + $scope.roundTimeRemaining);
  $scope.totalWorkoutMilliseconds = $scope.totalTimeRemaining;

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
    $scope.singleRoundTime = $scope.singleRoundTime - 1000;
  };

  $scope.checkRounds = function() {
    if($scope.singleRoundTime <= 0) {
      $timeout(function() {
        $scope.singleRoundTime = workoutFactory.workoutData.roundsTimeInMilliseconds;
        $scope.roundsCompleted = $scope.roundsCompleted + 1;
        $scope.roundsRemaining = $scope.roundsRemaining - 1;
      }, $scope.singleRestTime);
    }
  }

  $interval(function() {
    $scope.checkRounds();
    $scope.calculateWorkOut();
    $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.singleRoundTime);
    $scope.totalTimeRemainingObj = $scope.parseSeconds($scope.totalTimeRemaining);
  }, 1000);
})
