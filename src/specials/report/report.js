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
    replace: true,
    // templateUrl: '/src/specials/report/report.html',
    template: getTemplate,
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

  function getTemplate() {
    return `
    <div id="matrixui-programming-report">
      <div ng-if="config.grading[&quot;compile check&quot;]" class="compile-check report-section">
        <div ng-click="toggleContent($event)" class="compile-check-score score">Compile Check : You Get {{compileCheck.grade? compileCheck.grade : 0}} Points of {{config.grading['compile check']}} Points</div>
        <div ng-if="compileCheck[&quot;compile check&quot;]" class="compile-error-content test-content">
          <div ng-if="compileCheck.grade == config.grading[&quot;compile check&quot;]" class="report-detail">
            <pre class="full-score">Pass compilation. You got full score!</pre>
          </div>
          <div ng-if="compileCheck &amp;&amp; compileCheck.grade != config.grading[&quot;compile check&quot;]" class="report-detail">
            <pre class="error-content red-color">Compilation fail.</pre>
            <div class="error-detail">
              <pre class="error-content">{{compileCheck['compile check']}}</pre>
            </div>
          </div>
        </div>
      </div>
      <div ng-if="config.grading[&quot;static check&quot;]" class="static-check report-section">
        <div ng-click="toggleContent($event)" class="static-check-score score">Static Check : You Get {{staticCheck.grade? staticCheck.grade : 0}} Points of {{config.grading['static check']}} Points<a href="http://oclint.org/" target="_blank" ng-if="staticCheck.grade != config.grading[&quot;static check&quot;] &amp;&amp; staticCheck" class="link">Why it went wrong？</a></div>
        <div class="static-check-content test-content">
          <div ng-if="!staticCheck &amp;&amp; grade &gt;= 0" class="report-detail">
            <pre class="not-executing-check">This check didn't execute because of errors above.</pre>
          </div>
          <div ng-if="!staticCheck &amp;&amp; grade == -1" class="report-detail">
            <pre class="under-checking">Under testing...</pre>
          </div>
          <div ng-if="staticCheck.grade == config.grading[&quot;static check&quot;]" class="report-detail">
            <pre class="full-score">Pass static check. You got full score!</pre>
          </div>
          <div ng-if="staticCheck &amp;&amp; (staticCheck.grade != config.grading[&quot;static check&quot;])" class="report-detail">
            <pre class="error-content red-color">Static check fail.</pre>
            <div class="error-detail">
              <div class="message"></div>
              <div ng-if="staticCheck[&quot;static check&quot;].summary" class="summary"></div>
              <div ng-if="staticCheck[&quot;static check&quot;].violation" ng-repeat="item in staticCheck[&quot;static check&quot;].violation" class="violations">
                <pre ng-if="item.message" class="error-content">{{ item.path | deleteSpace}} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.message}}</pre>
                <pre ng-if="item.rule &amp;&amp; !item.message" class="error-content">{{ item.path | deleteSpace }} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.rule}}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ng-if="config.grading[&quot;standard tests&quot;]" class="standard-tests-check report-section">
        <div ng-click="toggleContent($event)" class="standard-tests-check-score score">Standard Tests : You Get {{standardTests.grade | formatReportGrade }} Points of {{config.grading['standard tests']}} Points</div>
        <div class="standard-tests-content test-content">
          <div ng-if="!standardTests &amp;&amp; grade &gt;= 0" class="report-detail">
            <pre class="not-executing-check">This check didn't execute because of error above.</pre>
          </div>
          <div ng-if="!standardTests &amp;&amp; grade == -1" class="report-detail">
            <pre class="under-checking">Under testing...</pre>
          </div>
          <div ng-if="standardTests.grade == config.grading[&quot;standard tests&quot;]" class="report-detail">
            <pre class="full-score">Pass standard test. You got full score!</pre>
          </div>
          <div ng-if="standardTests &amp;&amp; standardTests.grade != config.grading[&quot;standard tests&quot;]" class="report-detail">
            <pre class="error-content red-color">Some examples of failed standard test cases:</pre>
            <div class="error-detail">
              <div ng-repeat="test in standardTests[&quot;standard tests&quot;] | showWrongTests | limitTo: 3" class="standard-tests">
                <hr ng-if="$index != 0"/>
                <div ng-if="test.result != &quot;CR&quot;" class="standard-test">
                  <div layout="layout" class="tests-check-summary">
                    <pre layout="layout">[{{ $index+1 }}]</pre>
                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{test.memoryused}}kb</pre>
                    <pre layout="layout" ng-if="test.timeused">Time Used : {{test.timeused}}ms</pre>
                    <pre layout="layout" ng-if="test.result">Result : {{test.result | formatReportResult}}</pre>
                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>
                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>
                  </div>
                  <pre class="label">Standard Input :</pre>
                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>
                  <pre class="label">Standard Output :</pre>
                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>
                  <pre class="label">Your Output :</pre>
                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ng-if="config.grading[&quot;random tests&quot;]" class="random-tests-check report-section">
        <div ng-click="toggleContent($event)" class="random-tests-check-score score">Random Tests : You Get {{randomTests.grade | formatReportGrade}} Points of {{config.grading['random tests']}} Points</div>
        <div class="random-tests-content test-content">
          <div ng-if="!randomTests &amp;&amp; grade &gt;= 0" class="report-detail">
            <pre class="not-executing-check">This check didn't execute because of error above.</pre>
          </div>
          <div ng-if="!randomTest &amp;&amp; grade == -1" class="report-detail">
            <pre class="under-checking">Under testing...</pre>
          </div>
          <div ng-if="randomTests.grade == config.grading[&quot;random tests&quot;]" class="report-detail">
            <pre class="full-score">Pass random check. You got full score!</pre>
          </div>
          <div ng-if="randomTests &amp;&amp; randomTests.grade != config.grading[&quot;random tests&quot;]" class="report-detail">
            <pre class="error-content red-color">Some examples of failed random test cases:</pre>
            <div class="error-detail">
              <div ng-repeat="test in randomTests[&quot;random tests&quot;] | showWrongTests | limitTo: 3" class="random-tests">
                <hr ng-if="$index != 0"/>
                <div ng-if="test.result != &quot;CR&quot;" class="random-test">
                  <div layout="layout" class="tests-check-summary">
                    <pre layout="layout">[{{ $index+1 }}]</pre>
                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{ test.memoryused }}kb</pre>
                    <pre layout="layout" ng-if="test.timeused">Time Used : {{ test.timeused }}ms</pre>
                    <pre layout="layout" ng-if="test.result">Result : {{ test.result | formatReportResult}}</pre>
                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>
                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>
                  </div>
                  <pre class="label">Standard Input :</pre>
                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>
                  <pre class="label">Standard Output :</pre>
                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>
                  <pre class="label">Your Output :</pre>
                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ng-if="config.grading[&quot;memory check&quot;]" class="memory-check report-section">
        <div ng-click="toggleContent($event)" class="memory-check-score score">Memory Check : You Get {{memoryCheck.grade | formatReportGrade}} Points of {{config.grading['memory check']}} Points<a href="http://valgrind.org/" ng-if="memoryCheck.grade != config.grading[&quot;memory check&quot;] &amp;&amp; memoryCheck" class="link">Why it went wrong？</a></div>
        <div class="memory-check-content test-content">
          <div ng-if="!memoryCheck &amp;&amp; grade &gt;= 0" class="report-detail">
            <pre class="not-executing-check">This check didn't execute because of error above.</pre>
          </div>
          <div ng-if="!memoryCheck &amp;&amp; grade == -1" class="report-detail">
            <pre class="under-checking">Under testing...</pre>
          </div>
          <div ng-if="memoryCheck.grade == config.grading[&quot;memory check&quot;]" class="report-detail">
            <pre class="full-score">Pass memory access check. You got full score!</pre>
          </div>
          <div ng-if="memoryCheck &amp;&amp; memoryCheck.grade != config.grading[&quot;memory check&quot;]" class="report-detail">
            <pre class="error-content red-color">Memory check fail.</pre>
            <div class="error-detail">
              <div ng-repeat="check in memoryCheck[&quot;memory check&quot;]" class="memory-checks">
                <hr ng-if="$index != 0"/>
                <pre ng-if="check.message" class="memory-check-summary">[{{ $index+1 }}] {{ check.message }}</pre>
                <pre ng-if="check.valgrindoutput.error.kind" class="memory-check-summary">[{{ $index+1 }}] Error :   {{ check.valgrindoutput.error.kind }}</pre>
                <pre ng-if="check.stdin">Standard Input :</pre>
                <pre ng-if="check.stdin" class="error-content inout-tests">{{ check.stdin }}</pre>
                <div ng-if="check.valgrindoutput.error.stack.frame" class="memory-check">
                  <div ng-repeat="frame in check.valgrindoutput.error.stack.frame">
                    <hr ng-if="$index != 0"/>
                    <pre ng-if="frame.obj" class="error-content">obj: {{ frame.obj }}</pre>
                    <pre ng-if="frame.file &amp;&amp; frame.line" class="error-content">[{{ frame.file }}]: line {{ frame.line }}</pre>
                    <pre ng-if="frame.fn" class="error-content">{{ frame.fn }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ng-if="config.grading[&quot;google tests&quot;]" class="google-test report-section">
        <div ng-click="toggleContent($event)" class="google-test-score score">Google Test : You Get {{googleTest.grade | formatReportGrade}} Points of {{config.grading['google tests']}} Points</div>
        <div class="google-test-content test-content">
          <div ng-if="!googleTest &amp;&amp; grade &gt;= 0" class="report-detail">
            <pre class="not-executing-check">This check didn't execute because of error above.</pre>
          </div>
          <div ng-if="!googleTest &amp;&amp; grade == -1" class="report-detail">
            <pre class="under-checking">Under testing...</pre>
          </div>
          <div ng-if="googleTest.grade == config.grading[&quot;google tests&quot;]" class="report-detail">
            <pre class="full-score">Pass Google test. You got full score!</pre>
          </div>
          <div ng-if="googleTest &amp;&amp; googleTest.grade != config.grading[&quot;google tests&quot;]" class="report-detail">
            <pre class="error-content red-color">Google test fail</pre>
            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info != null" class="error-detail">
              <pre ng-repeat="fail in gtestFailedList" class="error-content">{{fail}} : {{googleTest['google tests'][0].gtest.info[fail]}}</pre>
            </div>
            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info == null" class="error-detail">
              <pre class="error-content">error: {{ googleTest['google tests'][0].gtest.failure[0]['error'] }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
