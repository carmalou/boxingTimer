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
    var seconds = totalMilliseconds / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;

    console.log('before modolus seconds', seconds);
    console.log('before modolus minutes', minutes);
    console.log('before modolus hours', hours);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    console.log('after modolus seconds', seconds);
    console.log('after modolus minutes', minutes);
    console.log('after modolus hours', hours);

    if(seconds = 0) {
      console.log('if seconds');
      $scope.seconds = '0';
    } else {
      console.log('else seconds', seconds);
      $scope.seconds = Math.floor(seconds);
    }

    if(minutes = 0) {
      console.log('if minutes');
      $scope.minutes = '0';
    } else {
      console.log('else minutes', minutes);
      $scope.minutes = Math.floor(minutes);
    }

    if(hours < 1) {
      $scope.hours = Math.floor(hours);
    }

    $scope.seconds = seconds;
    $scope.minutes = minutes;

    console.log('$scope.seconds', $scope.seconds);
    console.log('$scope.minutes', $scope.minutes);
  };

  $scope.calculateWorkOut = function() {
    console.log('calc workout func');
  };

  $scope.parseSeconds($scope.roundTimeRemaining);
  // $scope.parseSeconds($scope.totalTimeRemaining);
})
