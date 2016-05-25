angular.module('app.controllers', [])

.controller('planYourWorkoutCtrl', function($scope, $rootScope, $state, workoutFactory) {
  $scope.workout = {};

  $scope.submitWorkout = function() {
    $scope.workout.roundsTimeInMilliseconds = ($scope.workout.roundsTime * 1000);
    $scope.workout.restTimeInMilliseconds = ($scope.workout.restTime * 1000);

    $state.go('tabsController.timer');
  };

})

.controller('timerCtrl', function($scope, $rootScope, $state, workoutFactory) {
  $scope.millsecondsWorkout = undefined;
})
