/**
 *
 * @description 测试MatrixUI和提供文档的模块
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('testMatrixUIApp', ['matrixui'])
  .controller('testCtrl', testCtrl);

/**
 *
 * @description testCtrl控制器
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

function testCtrl($scope, $http) {

  /* 初始化$scope变量 */

  function initScopeVariable() {
    $scope.buttonDocs = null;

    $scope.markdown = null;
    $scope.testMarkdown = null;
  }

  /* 取得mu-button的文档 */

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

  /* 取得mu-markdown文档 */

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

  /* 取得mu-markdown测试数据 */

  function getMarkdownTxt() {
    $http({
      method: 'GET',
      url: '/data/markdown.md'
    }).then(function(res) {
      let { data } = res;
      $scope.markdown = data;
    }, function(res) {
      alert('数据访问错误');
    });
  }

  /* 按照顺序执行定义的函数 */

  function initTestCtrl() {
    initScopeVariable();
    getButtonDocs();
    getMarkdownDocs();
    getMarkdownTxt();
  }

  /* Controller入口函数 */

  initTestCtrl();
};
