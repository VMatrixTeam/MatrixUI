/**
 *
 * @description report组件
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */

angular
  .module('matrixui.specials.report', [])
  .directive('muReport', muReportDirective);

function muReportDirective() {
  return {

    restrict: 'E',
    transclude: true,
    templateUrl: '/src/specials/report/report.html',
    scope: true,
    link: muReportLink

  };

  /**
   *
   * @description muReport指令的Link函数
   * @params {object} scope 指令的$scope对象
   * @params {object} element 指令对应的jqlite元素对象
   * @params {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 王镇佳 <wzjfloor@163.com>
   */

  function muReportLink(scope, element, attrs) {

    /* 指令绑定的config 和 report属性 */
    scope.congigName = attrs.config;
    scope.reportName = attrs.report;

    let configContent = scope.$parent[scope.congigName];
    let reportContent = scope.$parent[scope.reportName];

    /* ng-model的重要性高于content */
    // 如果父级作用域已经加载出report
    if (reportContent && configContent) {

      //提取report和config
      scope.report = reportContent;
      scope.config = configContent;
      simplifyReport();
      fixReportLastWrap();
      extractGoogleTest();

    } else {
      //显示加载中...
      //但是显示方法待定
      scope.compileCheck = scope.staticCheck = scope.standardTests = scope.randomTests
      = scope.memoryCheck = scope.googleTest = null;
    }

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */
    if (scope.reportName) {

      scope.$parent.$watch(scope.reportName, function() {

        //获取report
        scope.report = scope.$parent[scope.reportName];
        simplifyReport();
        fixReportLastWrap();
        extractGoogleTest();

      });
    }

    if (scope.congigName) {

      scope.$parent.$watch(scope.congigName, function() {

        //获取config
        scope.config = scope.$parent[scope.congigName];
        simplifyReport();
        fixReportLastWrap();
        extractGoogleTest();

      });
    }

    //简化report
    function simplifyReport() {

      if (scope.report) {

        //简化report
        scope.compileCheck = scope.report['compile check'];
        scope.staticCheck = scope.report['static check'];
        scope.standardTests = scope.report['standard tests'];
        scope.randomTests = scope.report['random tests'];
        scope.memoryCheck = scope.report['memory check'];
        scope.googleTest = scope.report['google tests'];

        //提取report的googleTest信息
        scope.gtestFailedList = [];
        scope.gtestAllList = [];

      }

    }

    //处理换行问题
    function fixReportLastWrap() {

      // -------------------------------------
      // 处理standard input/output中的尾换行 START
      // -------------------------------------
      if (scope.standardTests) {

        let STAND_TESTS = scope.standardTests['standard tests'];

        for (let i = 0; i < STAND_TESTS.length; i++) {

          if (STAND_TESTS[i].stdin && STAND_TESTS[i].stdin[STAND_TESTS[i].stdin.length - 1] == '\n') {
            STAND_TESTS[i].stdin += '\n';
          }
          if (STAND_TESTS[i].standard_stdout && STAND_TESTS[i].standard_stdout[STAND_TESTS[i].standard_stdout.length - 1] == '\n') {
            STAND_TESTS[i].standard_stdout += '\n';
          }
          if (STAND_TESTS[i].stdout && STAND_TESTS[i].stdout[STAND_TESTS[i].stdout.length - 1] == '\n') {
            STAND_TESTS[i].stdout += '\n';
          }

        }
        scope.standardTests['standard tests'] = STAND_TESTS;

      }
      if (scope.randomTests) {

        let RANDOM_TESTS = scope.randomTests['random tests'];

        for (let i = 0; i < RANDOM_TESTS.length; i++) {

          if (RANDOM_TESTS[i].stdin && RANDOM_TESTS[i].stdin[RANDOM_TESTS[i].stdin.length - 1] == '\n') {
            RANDOM_TESTS[i].stdin += '\n';
          }
          if (RANDOM_TESTS[i].standard_stdout && RANDOM_TESTS[i].standard_stdout[RANDOM_TESTS[i].standard_stdout.length - 1] == '\n') {
            RANDOM_TESTS[i].standard_stdout += '\n';
          }
          if (RANDOM_TESTS[i].stdout && RANDOM_TESTS[i].stdout[RANDOM_TESTS[i].stdout.length - 1] == '\n') {
            RANDOM_TESTS[i].stdout += '\n';
          }

        }
        scope.randomTests['random tests'] = RANDOM_TESTS;

      }
      // -------------------------------------
      // 处理standard input/output中的尾换行 END
      // -------------------------------------
    }

    //提取googleTest中的信息
    function extractGoogleTest() {

      if (scope.googleTest && scope.googleTest['google tests'][0].gtest.info) {
        scope.gtestAllList = Object.getOwnPropertyNames(scope.googleTest['google tests'][0].gtest.info);
        if (scope.googleTest['google tests'][0].gtest.failure != null) {
          //抽出failure数组的每个对象的属性名
          let obj = scope.googleTest['google tests'][0].gtest.failure;
          for (let subobj of obj)
          scope.gtestFailedList.push(Object.getOwnPropertyNames(subobj)[0]);
        }
      }
    }

  }
}
