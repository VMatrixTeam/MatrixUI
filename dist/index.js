'use strict';

/**
 *
 * @description 测试MatrixUI和提供文档的模块
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('testMatrixUIApp', ['matrixui']).controller('testCtrl', testCtrl);

/**
 *
 * @description testCtrl控制器
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

function testCtrl($scope, $http) {

  /**
   *
   * @description 取得文档文件名
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */
  function getDocsFilenames() {
    var docs = ['components/button', 'components/card', 'components/checkbox', 'components/codeeditor', 'components/datatable', 'components/dialog', 'components/markdown', 'components/mdeditor', 'components/panel', 'components/radio', 'components/select', 'components/spinner', 'components/tab', 'specials/report'];

    return docs;
  }

  function getDocs() {
    var docs = getDocsFilenames();
    docs.forEach(function (item) {
      $http({
        method: 'GET',
        url: '/docs/' + item + '.md'
      }).then(function (res) {
        var data = res.data;

        var name = item.split('/')[1];
        $scope[name + 'Docs'] = data;
      }, function (res) {
        throw Error('数据访问错误');
      });
    });
  }

  function getDataFilenames() {
    var datas = ['markdown.md'];

    return datas;
  }

  function getDatas() {
    var datas = getDataFilenames();

    datas.forEach(function (item) {
      $http({
        method: 'GET',
        url: '/test/' + item
      }).then(function (res) {
        var data = res.data;

        var name = item.split('.')[0];
        $scope[name + 'Data'] = data;
      }, function (res) {
        alert('数据访问错误');
      });
    });
  }

  /* 按照顺序执行定义的函数 */

  function initTestCtrl() {
    getDocs();
    getDatas();
  }

  /* Controller入口函数 */

  initTestCtrl();
};