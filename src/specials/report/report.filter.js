/**
 *
 * @description report组件过滤器
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */


angular.module('matrixui.specials').filter('formatReportScore', function() {

  let formatReportScore;
  formatReportScore = function(data) {

    if (data === -1 || data === null) {

      return '正在评测并计算总分，请等候...';

    } else {

      return data;

    }

  };
  return formatReportScore;

});



angular.module('matrixui.specials').filter('formatReportGrade', function() {

  let formatReportGrade;
  formatReportGrade = function(data) {

    if (data === undefined || data === null) {

      return '0';

    } else {

      return data;

    }

  };
  return formatReportGrade;

});
angular.module('matrixui.specials').filter('formatReportOutput', function() {

  let formatReportOutput;
  formatReportOutput = function(data) {

    if (data === undefined || data === null || data === '') {

      return 'No output.';

    } else {

      return data;

    }

  };
  return formatReportOutput;

});
angular.module('matrixui.specials').filter('formatCheckMessage', function() {

  let formatCheckMessage;
  formatCheckMessage = function(data) {

    if (data === null || data === undefined) {

      return 'Pass.';

    } else {

      return data;

    }

  };
  return formatCheckMessage;

});
angular.module('matrixui.specials').filter('formatSubmissionsGrade', function() {

  let formatSubmissionsGrade;
  formatSubmissionsGrade = function(data) {

    if (data === null) {

      return '等待评测中';

    } else if (data === '-1' || data === -1) {

      return '正在评测';

    } else {

      return data;

    }

  };
  return formatSubmissionsGrade;

});
angular.module('matrixui.specials').filter('formatReportResult', function() {

  let formatReportResult;
  formatReportResult = function(data) {

    if (data === 'WA') {

      return 'Wrong Answer';

    } else if (data === 'TL') {

      return 'Time Limit';

    } else if (data === 'CR') {

      return 'Correct';

    } else if (data === 'ML') {

      return 'Memory Limit';

    } else if (data === 'RE') {

      return 'Runtime Error';

    } else if (data === 'IE') {

      return 'Internal Error';

    } else if (data === 'OL') {

      return 'Output Limit';

    } else {

      return data;

    }

  };
  return formatReportResult;

});

angular.module('matrixui.specials').filter('deleteSpace', function() {

  let deleteSpace;
  deleteSpace = function(data) {

    let result;
    if (data[0] == '/') {
      result = data.slice(5);
    } else {
      result = data;
    }
    let i = 0;
    while (result[i] == ' ') {
      i++;
    }
    return result.slice(i);

  };

  return deleteSpace;

});

angular.module('matrixui.specials').filter('showWrongTests', function() {

  let showWrongTests;
  showWrongTests = function(array) {

    let results;
    if (array) {

      results = [];
      array.forEach(function(item) {

        if (item.result !== 'CR') {

          results.push(item);

        }

      });
      return results;

    }

  };
  return showWrongTests;

});
