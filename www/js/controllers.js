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
  $scope.millsecondsWorkout = undefined;
  console.log('workoutFactory.workoutData', workoutFactory.workoutData);

  $scope.roundsCompleted = 0;
  // $scope.roundsRemaining = workoutFactory.workoutData.rounds;
})
