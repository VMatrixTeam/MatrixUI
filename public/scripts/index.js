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

testCtrl.$inject = ['$scope', '$http', 'muProgressFactory', '$timeout'];

function testCtrl($scope, $http, muProgressFactory, $timeout) {

  /**
   *
   * @description 创建进度条和关闭进度条
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  $scope.progressbar = muProgressFactory.createInstance();

  $scope.startProgress = function() {
    $scope.progressbar.start();
  };

  $scope.completeProgress = function() {
    $scope.progressbar.complete();
  };

  /**
   *
   * @description mu-codeeditor配置选项
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  $scope.editorOptions = {
    lineNumbers: true,
    mode: "text/x-java",
    keyMap: "sublime",
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: "monokai",
    tabSize: 2,
    readOnly: true,
    onLoad: function(_cm) {
      $scope.$watch('languageData.choose', function() {
        if (!$scope.languageData) return;
        _cm.setOption('mode', $scope.languageData[$scope.languageData.choose]);
      });
    }
  };

  $scope.changeSex = function() {
    console.log('change sex');
    this.radioData.sex = "male";
  }

  /**
   *
   * @description 取得文档文件名
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getDocsFilenames() {
    let docs = [
      'components/button',
      'components/card',
      'components/checkbox',
      'components/codeeditor',
      'components/datatable',
      'components/dialog',
      'components/markdown',
      'components/mdeditor',
      'components/panel',
      'components/radio',
      'components/select',
      'components/spinner',
      'components/tab',
      'components/progress',

      'specials/report',
    ];

    return docs;
  }

  /*----------  获取文档  ----------*/

  function getDocs() {
    let docs = getDocsFilenames();
    docs.forEach((item) => {
      $http({
        method: 'GET',
        url: `/docs/${item}.md`
      }).then(function(res) {
        let { data } = res;
        let name = item.split('/')[1];
        $scope[`${name}Docs`] = data;
      }, function(res) {
        throw Error('数据访问错误');
      });
    });
  }

  /*----------  测试数据文件名  ----------*/

  function getDataFilenames() {
    let datas = [
      'markdown.md',
      'mdeditor.md',
      'select.json',
      'language.json',
      'testcpp.cpp',
      'radio.json'
    ];

    return datas;
  }

  /*----------  获取测试数据  ----------*/

  function getDatas() {
    let datas = getDataFilenames();

    datas.forEach((item) => {
      $http({
        method: 'GET',
        url: `/test/${item}`
      }).then(function(res) {
        let { data } = res;
        let name = item.split('.')[0];
        $scope[`${name}Data`] = data;
      }, function(res) {
        alert('数据访问错误');
      });
    });
  }

  /*----------  设置侧边栏选中状态  ----------*/

  $scope.chooseHash = function(event) {
    angular.element(document.querySelectorAll('.group-item')).removeClass('choose');
    angular.element(event.target).addClass('choose');
  };

  /* 按照顺序执行定义的函数 */

  function initTestCtrl() {
    getDocs();
    getDatas();
  }

  /* Controller入口函数 */

  initTestCtrl();

};
