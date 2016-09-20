angular
  .module('testMatrixUIApp', ['matrixui'])
  .controller('testCtrl', testCtrl);

function testCtrl($scope, $http) {

  $http({
    method: 'GET',
    url: '/markdownTxt'
  }).then(function(res) {
    let { data } = res.data;
    $scope.markdown = data;
  }, function(res) {
    alert('数据访问错误');
  });

};
