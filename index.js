angular
  .module('testMatrixUIApp', ['matrixui'])
  .controller('testCtrl', testCtrl);

function testCtrl($scope, $http) {
  function initScopeVariable() {
    $scope.buttonDocs = null;

    $scope.markdown = null;
    $scope.testMarkdown = null;
  }

  function getButtonDocs() {
    $http({
      method: 'GET',
      url: '/docs/button.md'
    }).then(function(res) {
      let { data } = res;
      $scope.buttonDocs = data;
    }, function() {
      alert('数据访问错误');
    });
  }

  function getMarkdownDocs() {
    $http({
      method: 'GET',
      url: '/docs/markdown.md'
    }).then(function(res) {
      let { data } = res;
      $scope.markdownDocs = data;
    }, function() {
      alert('数据访问错误');
    });
  }

  function getMarkdownTxt() {
    $http({
      method: 'GET',
      url: '/markdownTxt'
    }).then(function(res) {
      let { data } = res.data;
      $scope.markdown = data;
      $scope.testMarkdown = data.slice(0, 200);
    }, function(res) {
      alert('数据访问错误');
    });
  }

  function initTestCtrl() {
    initScopeVariable();
    getButtonDocs();
    getMarkdownDocs();
    getMarkdownTxt();
  }

  initTestCtrl();
};
