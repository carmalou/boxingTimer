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

.controller('timerCtrl', function($scope, $state, workoutFactory) {
  if(workoutFactory.workoutData == undefined) {
    return;
  }
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $scope.seconds = undefined;
  $scope.minutes = undefined;
  $scope.hours = undefined;
  $scope.totalWorkoutMilliseconds = undefined;

  $scope.roundsCompleted = '0';
  $scope.roundsRemaining = workoutFactory.workoutData.rounds;
  $scope.roundTimeRemaining = (workoutFactory.workoutData.roundsTimeInMilliseconds * workoutFactory.workoutData.rounds);
  $scope.totalTimeRemaining = ((workoutFactory.workoutData.restTimeInMilliseconds * (workoutFactory.workoutData.rounds - 1)) + $scope.roundTimeRemaining);

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

  $scope.calculateWorkOut = function() {
    console.log('calc workout func');
  };

  $scope.roundTimeRemainingObj = $scope.parseSeconds($scope.roundTimeRemaining);
  $scope.totalTimeRemainingObj = $scope.parseSeconds($scope.totalTimeRemaining);
})
