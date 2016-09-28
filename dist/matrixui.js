'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components', ['matrixui.components.button', 'matrixui.components.card', 'matrixui.components.checkbox', 'matrixui.components.codeeditor', 'matrixui.components.datatable', 'matrixui.components.dialog', 'matrixui.components.markdown', 'matrixui.components.mdeditor', 'matrixui.components.panel', 'matrixui.components.radio', 'matrixui.components.select', 'matrixui.components.spinner', 'matrixui.components.tab']);
'use strict';

angular.module('matrixui', ['matrixui.components', 'matrixui.specials']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.specials', ['matrixui.specials.report']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.button', []).directive('muButton', muButtonDirective);

muButtonDirective.$inject = ['$timeout'];

function muButtonDirective($timeout) {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="mu-button" ng-transclude></a>';
    } else {
      //If buttons don't have type="button", they will submit forms automatically.
      var btnType = typeof attr.type === 'undefined' ? 'button' : attr.type;
      return '<button class="mu-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope, element, attr) {
    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled)) {
      scope.$watch(attr.ngDisabled, function (isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    if (attr.default || attr.default === '') element.addClass('mu-button-default');
    if (attr.primary || attr.primary === '') element.addClass('mu-button-primary');
    if (attr.info || attr.info === '') element.addClass('mu-button-info');
    if (attr.warn || attr.warn === '') element.addClass('mu-button-warn');
    if (attr.danger || attr.danger === '') element.addClass('mu-button-danger');

    // disabling click event when disabled is true
    element.on('click', function (e) {
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      // restrict focus styles to the keyboard
      scope.mouseActive = false;
      element.on('mousedown', function () {
        scope.mouseActive = true;
        $timeout(function () {
          scope.mouseActive = false;
        }, 100);
      }).on('focus', function () {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      }).on('blur', function (ev) {
        element.removeClass('md-focused');
      });
    }
  }
}
'use strict';

/**
 *
 * @description card组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.card', []).directive('muCard', muCardDirective);

muCardDirective.$inject = [];

function muCardDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>Card组件</h2>'
  };
}
'use strict';

/**
 *
 * @description checkbox组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.checkbox', []).directive('muCheckbox', muCheckboxDirective);

muCheckboxDirective.$inject = [];

function muCheckboxDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-checkbox组件</h2>'
  };
}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.registerHelper("fold", "brace", function (cm, start) {
    var line = start.line,
        lineText = cm.getLine(line);
    var tokenType;

    function findOpening(openCh) {
      for (var at = start.ch, pass = 0;;) {
        var found = at <= 0 ? -1 : lineText.lastIndexOf(openCh, at - 1);
        if (found == -1) {
          if (pass == 1) break;
          pass = 1;
          at = lineText.length;
          continue;
        }
        if (pass == 1 && found < start.ch) break;
        tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
        if (!/^(comment|string)/.test(tokenType)) return found + 1;
        at = found - 1;
      }
    }

    var startToken = "{",
        endToken = "}",
        startCh = findOpening("{");
    if (startCh == null) {
      startToken = "[", endToken = "]";
      startCh = findOpening("[");
    }

    if (startCh == null) return;
    var count = 1,
        lastLine = cm.lastLine(),
        end,
        endCh;
    outer: for (var i = line; i <= lastLine; ++i) {
      var text = cm.getLine(i),
          pos = i == line ? startCh : 0;
      for (;;) {
        var nextOpen = text.indexOf(startToken, pos),
            nextClose = text.indexOf(endToken, pos);
        if (nextOpen < 0) nextOpen = text.length;
        if (nextClose < 0) nextClose = text.length;
        pos = Math.min(nextOpen, nextClose);
        if (pos == text.length) break;
        if (cm.getTokenTypeAt(CodeMirror.Pos(i, pos + 1)) == tokenType) {
          if (pos == nextOpen) ++count;else if (! --count) {
            end = i;endCh = pos;break outer;
          }
        }
        ++pos;
      }
    }
    if (end == null || line == end && endCh == startCh) return;
    return { from: CodeMirror.Pos(line, startCh),
      to: CodeMirror.Pos(end, endCh) };
  });

  CodeMirror.registerHelper("fold", "import", function (cm, start) {
    function hasImport(line) {
      if (line < cm.firstLine() || line > cm.lastLine()) return null;
      var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
      if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
      if (start.type != "keyword" || start.string != "import") return null;
      // Now find closing semicolon, return its position
      for (var i = line, e = Math.min(cm.lastLine(), line + 10); i <= e; ++i) {
        var text = cm.getLine(i),
            semi = text.indexOf(";");
        if (semi != -1) return { startCh: start.end, end: CodeMirror.Pos(i, semi) };
      }
    }

    var startLine = start.line,
        has = hasImport(startLine),
        prev;
    if (!has || hasImport(startLine - 1) || (prev = hasImport(startLine - 2)) && prev.end.line == startLine - 1) return null;
    for (var end = has.end;;) {
      var next = hasImport(end.line + 1);
      if (next == null) break;
      end = next.end;
    }
    return { from: cm.clipPos(CodeMirror.Pos(startLine, has.startCh + 1)), to: end };
  });

  CodeMirror.registerHelper("fold", "include", function (cm, start) {
    function hasInclude(line) {
      if (line < cm.firstLine() || line > cm.lastLine()) return null;
      var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
      if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
      if (start.type == "meta" && start.string.slice(0, 8) == "#include") return start.start + 8;
    }

    var startLine = start.line,
        has = hasInclude(startLine);
    if (has == null || hasInclude(startLine - 1) != null) return null;
    for (var end = startLine;;) {
      var next = hasInclude(end + 1);
      if (next == null) break;
      ++end;
    }
    return { from: CodeMirror.Pos(startLine, has + 1),
      to: cm.clipPos(CodeMirror.Pos(end)) };
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  var defaults = {
    pairs: "()[]{}''\"\"",
    triples: "",
    explode: "[]{}"
  };

  var Pos = CodeMirror.Pos;

  CodeMirror.defineOption("autoCloseBrackets", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.removeKeyMap(keyMap);
      cm.state.closeBrackets = null;
    }
    if (val) {
      cm.state.closeBrackets = val;
      cm.addKeyMap(keyMap);
    }
  });

  function getOption(conf, name) {
    if (name == "pairs" && typeof conf == "string") return conf;
    if ((typeof conf === "undefined" ? "undefined" : _typeof(conf)) == "object" && conf[name] != null) return conf[name];
    return defaults[name];
  }

  var bind = defaults.pairs + "`";
  var keyMap = { Backspace: handleBackspace, Enter: handleEnter };
  for (var i = 0; i < bind.length; i++) {
    keyMap["'" + bind.charAt(i) + "'"] = handler(bind.charAt(i));
  }function handler(ch) {
    return function (cm) {
      return handleChar(cm, ch);
    };
  }

  function getConfig(cm) {
    var deflt = cm.state.closeBrackets;
    if (!deflt) return null;
    var mode = cm.getModeAt(cm.getCursor());
    return mode.closeBrackets || deflt;
  }

  function handleBackspace(cm) {
    var conf = getConfig(cm);
    if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;

    var pairs = getOption(conf, "pairs");
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      var around = charsAround(cm, ranges[i].head);
      if (!around || pairs.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    for (var i = ranges.length - 1; i >= 0; i--) {
      var cur = ranges[i].head;
      cm.replaceRange("", Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1), "+delete");
    }
  }

  function handleEnter(cm) {
    var conf = getConfig(cm);
    var explode = conf && getOption(conf, "explode");
    if (!explode || cm.getOption("disableInput")) return CodeMirror.Pass;

    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      var around = charsAround(cm, ranges[i].head);
      if (!around || explode.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    cm.operation(function () {
      cm.replaceSelection("\n\n", null);
      cm.execCommand("goCharLeft");
      ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var line = ranges[i].head.line;
        cm.indentLine(line, null, true);
        cm.indentLine(line + 1, null, true);
      }
    });
  }

  function contractSelection(sel) {
    var inverted = CodeMirror.cmpPos(sel.anchor, sel.head) > 0;
    return { anchor: new Pos(sel.anchor.line, sel.anchor.ch + (inverted ? -1 : 1)),
      head: new Pos(sel.head.line, sel.head.ch + (inverted ? 1 : -1)) };
  }

  function handleChar(cm, ch) {
    var conf = getConfig(cm);
    if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;

    var pairs = getOption(conf, "pairs");
    var pos = pairs.indexOf(ch);
    if (pos == -1) return CodeMirror.Pass;
    var triples = getOption(conf, "triples");

    var identical = pairs.charAt(pos + 1) == ch;
    var ranges = cm.listSelections();
    var opening = pos % 2 == 0;

    var type;
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i],
          cur = range.head,
          curType;
      var next = cm.getRange(cur, Pos(cur.line, cur.ch + 1));
      if (opening && !range.empty()) {
        curType = "surround";
      } else if ((identical || !opening) && next == ch) {
        if (triples.indexOf(ch) >= 0 && cm.getRange(cur, Pos(cur.line, cur.ch + 3)) == ch + ch + ch) curType = "skipThree";else curType = "skip";
      } else if (identical && cur.ch > 1 && triples.indexOf(ch) >= 0 && cm.getRange(Pos(cur.line, cur.ch - 2), cur) == ch + ch && (cur.ch <= 2 || cm.getRange(Pos(cur.line, cur.ch - 3), Pos(cur.line, cur.ch - 2)) != ch)) {
        curType = "addFour";
      } else if (identical) {
        if (!CodeMirror.isWordChar(next) && enteringString(cm, cur, ch)) curType = "both";else return CodeMirror.Pass;
      } else if (opening && (cm.getLine(cur.line).length == cur.ch || isClosingBracket(next, pairs) || /\s/.test(next))) {
        curType = "both";
      } else {
        return CodeMirror.Pass;
      }
      if (!type) type = curType;else if (type != curType) return CodeMirror.Pass;
    }

    var left = pos % 2 ? pairs.charAt(pos - 1) : ch;
    var right = pos % 2 ? ch : pairs.charAt(pos + 1);
    cm.operation(function () {
      if (type == "skip") {
        cm.execCommand("goCharRight");
      } else if (type == "skipThree") {
        for (var i = 0; i < 3; i++) {
          cm.execCommand("goCharRight");
        }
      } else if (type == "surround") {
        var sels = cm.getSelections();
        for (var i = 0; i < sels.length; i++) {
          sels[i] = left + sels[i] + right;
        }cm.replaceSelections(sels, "around");
        sels = cm.listSelections().slice();
        for (var i = 0; i < sels.length; i++) {
          sels[i] = contractSelection(sels[i]);
        }cm.setSelections(sels);
      } else if (type == "both") {
        cm.replaceSelection(left + right, null);
        cm.triggerElectric(left + right);
        cm.execCommand("goCharLeft");
      } else if (type == "addFour") {
        cm.replaceSelection(left + left + left + left, "before");
        cm.execCommand("goCharRight");
      }
    });
  }

  function isClosingBracket(ch, pairs) {
    var pos = pairs.lastIndexOf(ch);
    return pos > -1 && pos % 2 == 1;
  }

  function charsAround(cm, pos) {
    var str = cm.getRange(Pos(pos.line, pos.ch - 1), Pos(pos.line, pos.ch + 1));
    return str.length == 2 ? str : null;
  }

  // Project the token type that will exists after the given char is
  // typed, and use it to determine whether it would cause the start
  // of a string token.
  function enteringString(cm, pos, ch) {
    var line = cm.getLine(pos.line);
    var token = cm.getTokenAt(pos);
    if (/\bstring2?\b/.test(token.type)) return false;
    var stream = new CodeMirror.StringStream(line.slice(0, pos.ch) + ch + line.slice(pos.ch), 4);
    stream.pos = stream.start = token.start;
    for (;;) {
      var type1 = cm.getMode().token(stream, token.state);
      if (stream.pos >= pos.ch + 1) return (/\bstring2?\b/.test(type1)
      );
      stream.start = stream.pos;
    }
  }
});
'use strict';

/**
 *
 * @description codeeditor组件，代码编辑器，源代码参考：https://github.com/angular-ui/ui-codemirror
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

/**
 * Binds a CodeMirror widget to a <textarea> element.
 */

angular.module('matrixui.components.codeeditor', []).constant('muCodeeditorConfig', {}).directive('muCodeeditor', muCodeeditorDirective);

muCodeeditorDirective.$inject = ['$timeout', 'muCodeeditorConfig'];

function muCodeeditorDirective($timeout, muCodeeditorConfig) {

  return {
    restrict: 'EA',
    require: '?ngModel',
    compile: function compile() {
      // Require CodeMirror
      if (angular.isUndefined(window.CodeMirror)) {
        throw new Error('ui-codemirror needs CodeMirror to work... (o rly?)');
      }
      return postLink;
    }
  };

  function postLink(scope, iElement, iAttrs, ngModel) {

    var codemirrorOptions = angular.extend({ value: iElement.text() }, muCodeeditorConfig.codemirror || {}, scope.$eval(iAttrs.uiCodemirror), scope.$eval(iAttrs.uiCodemirrorOpts));

    var codemirror = newCodemirrorEditor(iElement, codemirrorOptions);

    configOptionsWatcher(codemirror, iAttrs.uiCodemirror || iAttrs.uiCodemirrorOpts, scope);

    configNgModelLink(codemirror, ngModel, scope);

    configUiRefreshAttribute(codemirror, iAttrs.uiRefresh, scope);

    // Allow access to the CodeMirror instance through a broadcasted event
    // eg: $broadcast('CodeMirror', function(cm){...});
    scope.$on('CodeMirror', function (event, callback) {
      if (angular.isFunction(callback)) {
        callback(codemirror);
      } else {
        throw new Error('the CodeMirror event requires a callback function');
      }
    });

    // onLoad callback
    if (angular.isFunction(codemirrorOptions.onLoad)) {
      codemirrorOptions.onLoad(codemirror);
    }
  }

  function newCodemirrorEditor(iElement, codemirrorOptions) {
    var codemirrot;

    if (iElement[0].tagName === 'TEXTAREA') {
      // Might bug but still ...
      codemirrot = window.CodeMirror.fromTextArea(iElement[0], codemirrorOptions);
    } else {
      iElement.html('');
      codemirrot = new window.CodeMirror(function (cm_el) {
        iElement.append(cm_el);
      }, codemirrorOptions);
    }

    return codemirrot;
  }

  function configOptionsWatcher(codemirrot, uiCodemirrorAttr, scope) {
    if (!uiCodemirrorAttr) {
      return;
    }

    var codemirrorDefaultsKeys = Object.keys(window.CodeMirror.defaults);
    scope.$watch(uiCodemirrorAttr, updateOptions, true);
    function updateOptions(newValues, oldValue) {
      if (!angular.isObject(newValues)) {
        return;
      }
      codemirrorDefaultsKeys.forEach(function (key) {
        if (newValues.hasOwnProperty(key)) {

          if (oldValue && newValues[key] === oldValue[key]) {
            return;
          }

          codemirrot.setOption(key, newValues[key]);
        }
      });
    }
  }

  function configNgModelLink(codemirror, ngModel, scope) {
    if (!ngModel) {
      return;
    }
    // CodeMirror expects a string, so make sure it gets one.
    // This does not change the model.
    ngModel.$formatters.push(function (value) {
      if (angular.isUndefined(value) || value === null) {
        return '';
      } else if (angular.isObject(value) || angular.isArray(value)) {
        throw new Error('ui-codemirror cannot use an object or an array as a model');
      }
      return value;
    });

    // Override the ngModelController $render method, which is what gets called when the model is updated.
    // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
    ngModel.$render = function () {
      //Code mirror expects a string so make sure it gets one
      //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
      var safeViewValue = ngModel.$viewValue || '';
      codemirror.setValue(safeViewValue);
    };

    // Keep the ngModel in sync with changes from CodeMirror
    codemirror.on('change', function (instance) {
      var newValue = instance.getValue();
      if (newValue !== ngModel.$viewValue) {
        scope.$evalAsync(function () {
          ngModel.$setViewValue(newValue);
        });
      }
    });
  }

  function configUiRefreshAttribute(codeMirror, uiRefreshAttr, scope) {
    if (!uiRefreshAttr) {
      return;
    }

    scope.$watch(uiRefreshAttr, function (newVal, oldVal) {
      // Skip the initial watch firing
      if (newVal !== oldVal) {
        $timeout(function () {
          codeMirror.refresh();
        });
      }
    });
  }
}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  var noOptions = {};
  var nonWS = /[^\s\u00a0]/;
  var Pos = CodeMirror.Pos;

  function firstNonWS(str) {
    var found = str.search(nonWS);
    return found == -1 ? 0 : found;
  }

  CodeMirror.commands.toggleComment = function (cm) {
    cm.toggleComment();
  };

  CodeMirror.defineExtension("toggleComment", function (options) {
    if (!options) options = noOptions;
    var cm = this;
    var minLine = Infinity,
        ranges = this.listSelections(),
        mode = null;
    for (var i = ranges.length - 1; i >= 0; i--) {
      var from = ranges[i].from(),
          to = ranges[i].to();
      if (from.line >= minLine) continue;
      if (to.line >= minLine) to = Pos(minLine, 0);
      minLine = from.line;
      if (mode == null) {
        if (cm.uncomment(from, to, options)) mode = "un";else {
          cm.lineComment(from, to, options);mode = "line";
        }
      } else if (mode == "un") {
        cm.uncomment(from, to, options);
      } else {
        cm.lineComment(from, to, options);
      }
    }
  });

  // Rough heuristic to try and detect lines that are part of multi-line string
  function probablyInsideString(cm, pos, line) {
    return (/\bstring\b/.test(cm.getTokenTypeAt(Pos(pos.line, 0))) && !/^[\'\"`]/.test(line)
    );
  }

  CodeMirror.defineExtension("lineComment", function (from, to, options) {
    if (!options) options = noOptions;
    var self = this,
        mode = self.getModeAt(from);
    var firstLine = self.getLine(from.line);
    if (firstLine == null || probablyInsideString(self, from, firstLine)) return;

    var commentString = options.lineComment || mode.lineComment;
    if (!commentString) {
      if (options.blockCommentStart || mode.blockCommentStart) {
        options.fullLines = true;
        self.blockComment(from, to, options);
      }
      return;
    }

    var end = Math.min(to.ch != 0 || to.line == from.line ? to.line + 1 : to.line, self.lastLine() + 1);
    var pad = options.padding == null ? " " : options.padding;
    var blankLines = options.commentBlankLines || from.line == to.line;

    self.operation(function () {
      if (options.indent) {
        var baseString = null;
        for (var i = from.line; i < end; ++i) {
          var line = self.getLine(i);
          var whitespace = line.slice(0, firstNonWS(line));
          if (baseString == null || baseString.length > whitespace.length) {
            baseString = whitespace;
          }
        }
        for (var i = from.line; i < end; ++i) {
          var line = self.getLine(i),
              cut = baseString.length;
          if (!blankLines && !nonWS.test(line)) continue;
          if (line.slice(0, cut) != baseString) cut = firstNonWS(line);
          self.replaceRange(baseString + commentString + pad, Pos(i, 0), Pos(i, cut));
        }
      } else {
        for (var i = from.line; i < end; ++i) {
          if (blankLines || nonWS.test(self.getLine(i))) self.replaceRange(commentString + pad, Pos(i, 0));
        }
      }
    });
  });

  CodeMirror.defineExtension("blockComment", function (from, to, options) {
    if (!options) options = noOptions;
    var self = this,
        mode = self.getModeAt(from);
    var startString = options.blockCommentStart || mode.blockCommentStart;
    var endString = options.blockCommentEnd || mode.blockCommentEnd;
    if (!startString || !endString) {
      if ((options.lineComment || mode.lineComment) && options.fullLines != false) self.lineComment(from, to, options);
      return;
    }
    if (/\bcomment\b/.test(self.getTokenTypeAt(Pos(from.line, 0)))) return;

    var end = Math.min(to.line, self.lastLine());
    if (end != from.line && to.ch == 0 && nonWS.test(self.getLine(end))) --end;

    var pad = options.padding == null ? " " : options.padding;
    if (from.line > end) return;

    self.operation(function () {
      if (options.fullLines != false) {
        var lastLineHasText = nonWS.test(self.getLine(end));
        self.replaceRange(pad + endString, Pos(end));
        self.replaceRange(startString + pad, Pos(from.line, 0));
        var lead = options.blockCommentLead || mode.blockCommentLead;
        if (lead != null) for (var i = from.line + 1; i <= end; ++i) {
          if (i != end || lastLineHasText) self.replaceRange(lead + pad, Pos(i, 0));
        }
      } else {
        self.replaceRange(endString, to);
        self.replaceRange(startString, from);
      }
    });
  });

  CodeMirror.defineExtension("uncomment", function (from, to, options) {
    if (!options) options = noOptions;
    var self = this,
        mode = self.getModeAt(from);
    var end = Math.min(to.ch != 0 || to.line == from.line ? to.line : to.line - 1, self.lastLine()),
        start = Math.min(from.line, end);

    // Try finding line comments
    var lineString = options.lineComment || mode.lineComment,
        lines = [];
    var pad = options.padding == null ? " " : options.padding,
        didSomething;
    lineComment: {
      if (!lineString) break lineComment;
      for (var i = start; i <= end; ++i) {
        var line = self.getLine(i);
        var found = line.indexOf(lineString);
        if (found > -1 && !/comment/.test(self.getTokenTypeAt(Pos(i, found + 1)))) found = -1;
        if (found == -1 && nonWS.test(line)) break lineComment;
        if (found > -1 && nonWS.test(line.slice(0, found))) break lineComment;
        lines.push(line);
      }
      self.operation(function () {
        for (var i = start; i <= end; ++i) {
          var line = lines[i - start];
          var pos = line.indexOf(lineString),
              endPos = pos + lineString.length;
          if (pos < 0) continue;
          if (line.slice(endPos, endPos + pad.length) == pad) endPos += pad.length;
          didSomething = true;
          self.replaceRange("", Pos(i, pos), Pos(i, endPos));
        }
      });
      if (didSomething) return true;
    }

    // Try block comments
    var startString = options.blockCommentStart || mode.blockCommentStart;
    var endString = options.blockCommentEnd || mode.blockCommentEnd;
    if (!startString || !endString) return false;
    var lead = options.blockCommentLead || mode.blockCommentLead;
    var startLine = self.getLine(start),
        open = startLine.indexOf(startString);
    if (open == -1) return false;
    var endLine = end == start ? startLine : self.getLine(end);
    var close = endLine.indexOf(endString, end == start ? open + startString.length : 0);
    if (close == -1 && start != end) {
      endLine = self.getLine(--end);
      close = endLine.indexOf(endString);
    }
    if (close == -1 || !/comment/.test(self.getTokenTypeAt(Pos(start, open + 1))) || !/comment/.test(self.getTokenTypeAt(Pos(end, close + 1)))) return false;

    // Avoid killing block comments completely outside the selection.
    // Positions of the last startString before the start of the selection, and the first endString after it.
    var lastStart = startLine.lastIndexOf(startString, from.ch);
    var firstEnd = lastStart == -1 ? -1 : startLine.slice(0, from.ch).indexOf(endString, lastStart + startString.length);
    if (lastStart != -1 && firstEnd != -1 && firstEnd + endString.length != from.ch) return false;
    // Positions of the first endString after the end of the selection, and the last startString before it.
    firstEnd = endLine.indexOf(endString, to.ch);
    var almostLastStart = endLine.slice(to.ch).lastIndexOf(startString, firstEnd - to.ch);
    lastStart = firstEnd == -1 || almostLastStart == -1 ? -1 : to.ch + almostLastStart;
    if (firstEnd != -1 && lastStart != -1 && lastStart != to.ch) return false;

    self.operation(function () {
      self.replaceRange("", Pos(end, close - (pad && endLine.slice(close - pad.length, close) == pad ? pad.length : 0)), Pos(end, close + endString.length));
      var openEnd = open + startString.length;
      if (pad && startLine.slice(openEnd, openEnd + pad.length) == pad) openEnd += pad.length;
      self.replaceRange("", Pos(start, open), Pos(start, openEnd));
      if (lead) for (var i = start + 1; i <= end; ++i) {
        var line = self.getLine(i),
            found = line.indexOf(lead);
        if (found == -1 || nonWS.test(line.slice(0, found))) continue;
        var foundEnd = found + lead.length;
        if (pad && line.slice(foundEnd, foundEnd + pad.length) == pad) foundEnd += pad.length;
        self.replaceRange("", Pos(i, found), Pos(i, foundEnd));
      }
    });
    return true;
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Open simple dialogs on top of an editor. Relies on dialog.css.

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  function dialogDiv(cm, template, bottom) {
    var wrap = cm.getWrapperElement();
    var dialog;
    dialog = wrap.appendChild(document.createElement("div"));
    if (bottom) dialog.className = "CodeMirror-dialog CodeMirror-dialog-bottom";else dialog.className = "CodeMirror-dialog CodeMirror-dialog-top";

    if (typeof template == "string") {
      dialog.innerHTML = template;
    } else {
      // Assuming it's a detached DOM element.
      dialog.appendChild(template);
    }
    return dialog;
  }

  function closeNotification(cm, newVal) {
    if (cm.state.currentNotificationClose) cm.state.currentNotificationClose();
    cm.state.currentNotificationClose = newVal;
  }

  CodeMirror.defineExtension("openDialog", function (template, callback, options) {
    if (!options) options = {};

    closeNotification(this, null);

    var dialog = dialogDiv(this, template, options.bottom);
    var closed = false,
        me = this;
    function close(newVal) {
      if (typeof newVal == 'string') {
        inp.value = newVal;
      } else {
        if (closed) return;
        closed = true;
        dialog.parentNode.removeChild(dialog);
        me.focus();

        if (options.onClose) options.onClose(dialog);
      }
    }

    var inp = dialog.getElementsByTagName("input")[0],
        button;
    if (inp) {
      inp.focus();

      if (options.value) {
        inp.value = options.value;
        if (options.selectValueOnOpen !== false) {
          inp.select();
        }
      }

      if (options.onInput) CodeMirror.on(inp, "input", function (e) {
        options.onInput(e, inp.value, close);
      });
      if (options.onKeyUp) CodeMirror.on(inp, "keyup", function (e) {
        options.onKeyUp(e, inp.value, close);
      });

      CodeMirror.on(inp, "keydown", function (e) {
        if (options && options.onKeyDown && options.onKeyDown(e, inp.value, close)) {
          return;
        }
        if (e.keyCode == 27 || options.closeOnEnter !== false && e.keyCode == 13) {
          inp.blur();
          CodeMirror.e_stop(e);
          close();
        }
        if (e.keyCode == 13) callback(inp.value, e);
      });

      if (options.closeOnBlur !== false) CodeMirror.on(inp, "blur", close);
    } else if (button = dialog.getElementsByTagName("button")[0]) {
      CodeMirror.on(button, "click", function () {
        close();
        me.focus();
      });

      if (options.closeOnBlur !== false) CodeMirror.on(button, "blur", close);

      button.focus();
    }
    return close;
  });

  CodeMirror.defineExtension("openConfirm", function (template, callbacks, options) {
    closeNotification(this, null);
    var dialog = dialogDiv(this, template, options && options.bottom);
    var buttons = dialog.getElementsByTagName("button");
    var closed = false,
        me = this,
        blurring = 1;
    function close() {
      if (closed) return;
      closed = true;
      dialog.parentNode.removeChild(dialog);
      me.focus();
    }
    buttons[0].focus();
    for (var i = 0; i < buttons.length; ++i) {
      var b = buttons[i];
      (function (callback) {
        CodeMirror.on(b, "click", function (e) {
          CodeMirror.e_preventDefault(e);
          close();
          if (callback) callback(me);
        });
      })(callbacks[i]);
      CodeMirror.on(b, "blur", function () {
        --blurring;
        setTimeout(function () {
          if (blurring <= 0) close();
        }, 200);
      });
      CodeMirror.on(b, "focus", function () {
        ++blurring;
      });
    }
  });

  /*
   * openNotification
   * Opens a notification, that can be closed with an optional timer
   * (default 5000ms timer) and always closes on click.
   *
   * If a notification is opened while another is opened, it will close the
   * currently opened one and open the new one immediately.
   */
  CodeMirror.defineExtension("openNotification", function (template, options) {
    closeNotification(this, close);
    var dialog = dialogDiv(this, template, options && options.bottom);
    var closed = false,
        doneTimer;
    var duration = options && typeof options.duration !== "undefined" ? options.duration : 5000;

    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(doneTimer);
      dialog.parentNode.removeChild(dialog);
    }

    CodeMirror.on(dialog, 'click', function (e) {
      CodeMirror.e_preventDefault(e);
      close();
    });

    if (duration) doneTimer = setTimeout(close, duration);

    return close;
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  function doFold(cm, pos, options, force) {
    if (options && options.call) {
      var finder = options;
      options = null;
    } else {
      var finder = getOption(cm, options, "rangeFinder");
    }
    if (typeof pos == "number") pos = CodeMirror.Pos(pos, 0);
    var minSize = getOption(cm, options, "minFoldSize");

    function getRange(allowFolded) {
      var range = finder(cm, pos);
      if (!range || range.to.line - range.from.line < minSize) return null;
      var marks = cm.findMarksAt(range.from);
      for (var i = 0; i < marks.length; ++i) {
        if (marks[i].__isFold && force !== "fold") {
          if (!allowFolded) return null;
          range.cleared = true;
          marks[i].clear();
        }
      }
      return range;
    }

    var range = getRange(true);
    if (getOption(cm, options, "scanUp")) while (!range && pos.line > cm.firstLine()) {
      pos = CodeMirror.Pos(pos.line - 1, 0);
      range = getRange(false);
    }
    if (!range || range.cleared || force === "unfold") return;

    var myWidget = makeWidget(cm, options);
    CodeMirror.on(myWidget, "mousedown", function (e) {
      myRange.clear();
      CodeMirror.e_preventDefault(e);
    });
    var myRange = cm.markText(range.from, range.to, {
      replacedWith: myWidget,
      clearOnEnter: getOption(cm, options, "clearOnEnter"),
      __isFold: true
    });
    myRange.on("clear", function (from, to) {
      CodeMirror.signal(cm, "unfold", cm, from, to);
    });
    CodeMirror.signal(cm, "fold", cm, range.from, range.to);
  }

  function makeWidget(cm, options) {
    var widget = getOption(cm, options, "widget");
    if (typeof widget == "string") {
      var text = document.createTextNode(widget);
      widget = document.createElement("span");
      widget.appendChild(text);
      widget.className = "CodeMirror-foldmarker";
    }
    return widget;
  }

  // Clumsy backwards-compatible interface
  CodeMirror.newFoldFunction = function (rangeFinder, widget) {
    return function (cm, pos) {
      doFold(cm, pos, { rangeFinder: rangeFinder, widget: widget });
    };
  };

  // New-style interface
  CodeMirror.defineExtension("foldCode", function (pos, options, force) {
    doFold(this, pos, options, force);
  });

  CodeMirror.defineExtension("isFolded", function (pos) {
    var marks = this.findMarksAt(pos);
    for (var i = 0; i < marks.length; ++i) {
      if (marks[i].__isFold) return true;
    }
  });

  CodeMirror.commands.toggleFold = function (cm) {
    cm.foldCode(cm.getCursor());
  };
  CodeMirror.commands.fold = function (cm) {
    cm.foldCode(cm.getCursor(), null, "fold");
  };
  CodeMirror.commands.unfold = function (cm) {
    cm.foldCode(cm.getCursor(), null, "unfold");
  };
  CodeMirror.commands.foldAll = function (cm) {
    cm.operation(function () {
      for (var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++) {
        cm.foldCode(CodeMirror.Pos(i, 0), null, "fold");
      }
    });
  };
  CodeMirror.commands.unfoldAll = function (cm) {
    cm.operation(function () {
      for (var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++) {
        cm.foldCode(CodeMirror.Pos(i, 0), null, "unfold");
      }
    });
  };

  CodeMirror.registerHelper("fold", "combine", function () {
    var funcs = Array.prototype.slice.call(arguments, 0);
    return function (cm, start) {
      for (var i = 0; i < funcs.length; ++i) {
        var found = funcs[i](cm, start);
        if (found) return found;
      }
    };
  });

  CodeMirror.registerHelper("fold", "auto", function (cm, start) {
    var helpers = cm.getHelpers(start, "fold");
    for (var i = 0; i < helpers.length; i++) {
      var cur = helpers[i](cm, start);
      if (cur) return cur;
    }
  });

  var defaultOptions = {
    rangeFinder: CodeMirror.fold.auto,
    widget: "↔",
    minFoldSize: 0,
    scanUp: false,
    clearOnEnter: true
  };

  CodeMirror.defineOption("foldOptions", null);

  function getOption(cm, options, name) {
    if (options && options[name] !== undefined) return options[name];
    var editorOptions = cm.options.foldOptions;
    if (editorOptions && editorOptions[name] !== undefined) return editorOptions[name];
    return defaultOptions[name];
  }

  CodeMirror.defineExtension("foldOption", function (options, name) {
    return getOption(this, options, name);
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;

  function findParagraph(cm, pos, options) {
    var startRE = options.paragraphStart || cm.getHelper(pos, "paragraphStart");
    for (var start = pos.line, first = cm.firstLine(); start > first; --start) {
      var line = cm.getLine(start);
      if (startRE && startRE.test(line)) break;
      if (!/\S/.test(line)) {
        ++start;break;
      }
    }
    var endRE = options.paragraphEnd || cm.getHelper(pos, "paragraphEnd");
    for (var end = pos.line + 1, last = cm.lastLine(); end <= last; ++end) {
      var line = cm.getLine(end);
      if (endRE && endRE.test(line)) {
        ++end;break;
      }
      if (!/\S/.test(line)) break;
    }
    return { from: start, to: end };
  }

  function findBreakPoint(text, column, wrapOn, killTrailingSpace) {
    var at = column;
    while (at < text.length && text.charAt(at) == " ") {
      at++;
    }for (; at > 0; --at) {
      if (wrapOn.test(text.slice(at - 1, at + 1))) break;
    }for (var first = true;; first = false) {
      var endOfText = at;
      if (killTrailingSpace) while (text.charAt(endOfText - 1) == " ") {
        --endOfText;
      }if (endOfText == 0 && first) at = column;else return { from: endOfText, to: at };
    }
  }

  function wrapRange(cm, from, to, options) {
    from = cm.clipPos(from);to = cm.clipPos(to);
    var column = options.column || 80;
    var wrapOn = options.wrapOn || /\s\S|-[^\.\d]/;
    var killTrailing = options.killTrailingSpace !== false;
    var changes = [],
        curLine = "",
        curNo = from.line;
    var lines = cm.getRange(from, to, false);
    if (!lines.length) return null;
    var leadingSpace = lines[0].match(/^[ \t]*/)[0];

    for (var i = 0; i < lines.length; ++i) {
      var text = lines[i],
          oldLen = curLine.length,
          spaceInserted = 0;
      if (curLine && text && !wrapOn.test(curLine.charAt(curLine.length - 1) + text.charAt(0))) {
        curLine += " ";
        spaceInserted = 1;
      }
      var spaceTrimmed = "";
      if (i) {
        spaceTrimmed = text.match(/^\s*/)[0];
        text = text.slice(spaceTrimmed.length);
      }
      curLine += text;
      if (i) {
        var firstBreak = curLine.length > column && leadingSpace == spaceTrimmed && findBreakPoint(curLine, column, wrapOn, killTrailing);
        // If this isn't broken, or is broken at a different point, remove old break
        if (!firstBreak || firstBreak.from != oldLen || firstBreak.to != oldLen + spaceInserted) {
          changes.push({ text: [spaceInserted ? " " : ""],
            from: Pos(curNo, oldLen),
            to: Pos(curNo + 1, spaceTrimmed.length) });
        } else {
          curLine = leadingSpace + text;
          ++curNo;
        }
      }
      while (curLine.length > column) {
        var bp = findBreakPoint(curLine, column, wrapOn, killTrailing);
        changes.push({ text: ["", leadingSpace],
          from: Pos(curNo, bp.from),
          to: Pos(curNo, bp.to) });
        curLine = leadingSpace + curLine.slice(bp.to);
        ++curNo;
      }
    }
    if (changes.length) cm.operation(function () {
      for (var i = 0; i < changes.length; ++i) {
        var change = changes[i];
        if (change.text || CodeMirror.cmpPos(change.from, change.to)) cm.replaceRange(change.text, change.from, change.to);
      }
    });
    return changes.length ? { from: changes[0].from, to: CodeMirror.changeEnd(changes[changes.length - 1]) } : null;
  }

  CodeMirror.defineExtension("wrapParagraph", function (pos, options) {
    options = options || {};
    if (!pos) pos = this.getCursor();
    var para = findParagraph(this, pos, options);
    return wrapRange(this, Pos(para.from, 0), Pos(para.to - 1), options);
  });

  CodeMirror.commands.wrapLines = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections(),
          at = cm.lastLine() + 1;
      for (var i = ranges.length - 1; i >= 0; i--) {
        var range = ranges[i],
            span;
        if (range.empty()) {
          var para = findParagraph(cm, range.head, {});
          span = { from: Pos(para.from, 0), to: Pos(para.to - 1) };
        } else {
          span = { from: range.from(), to: range.to() };
        }
        if (span.to.line >= at) continue;
        at = span.from.line;
        wrapRange(cm, span.from, span.to, {});
      }
    });
  };

  CodeMirror.defineExtension("wrapRange", function (from, to, options) {
    return wrapRange(this, from, to, options || {});
  });

  CodeMirror.defineExtension("wrapParagraphsInRange", function (from, to, options) {
    options = options || {};
    var cm = this,
        paras = [];
    for (var line = from.line; line <= to.line;) {
      var para = findParagraph(cm, Pos(line, 0), options);
      paras.push(para);
      line = para.to;
    }
    var madeChange = false;
    if (paras.length) cm.operation(function () {
      for (var i = paras.length - 1; i >= 0; --i) {
        madeChange = madeChange || wrapRange(cm, Pos(paras[i].from, 0), Pos(paras[i].to - 1), options);
      }
    });
    return madeChange;
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  function expressionAllowed(stream, state, backUp) {
    return (/^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(state.lastType) || state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0)))
    );
  }

  CodeMirror.defineMode("javascript", function (config, parserConfig) {
    var indentUnit = config.indentUnit;
    var statementIndent = parserConfig.statementIndent;
    var jsonldMode = parserConfig.jsonld;
    var jsonMode = parserConfig.json || jsonldMode;
    var isTS = parserConfig.typescript;
    var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

    // Tokenizer

    var keywords = function () {
      function kw(type) {
        return { type: type, style: "keyword" };
      }
      var A = kw("keyword a"),
          B = kw("keyword b"),
          C = kw("keyword c");
      var operator = kw("operator"),
          atom = { type: "atom", style: "atom" };

      var jsKeywords = {
        "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
        "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
        "var": kw("var"), "const": kw("var"), "let": kw("var"),
        "function": kw("function"), "catch": kw("catch"),
        "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
        "in": operator, "typeof": operator, "instanceof": operator,
        "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
        "this": kw("this"), "class": kw("class"), "super": kw("atom"),
        "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
        "await": C, "async": kw("async")
      };

      // Extend the 'normal' keywords with the TypeScript language extensions
      if (isTS) {
        var type = { type: "variable", style: "variable-3" };
        var tsKeywords = {
          // object-like things
          "interface": kw("class"),
          "implements": C,
          "namespace": C,
          "module": kw("module"),
          "enum": kw("module"),
          "type": kw("type"),

          // scope modifiers
          "public": kw("modifier"),
          "private": kw("modifier"),
          "protected": kw("modifier"),
          "abstract": kw("modifier"),

          // operators
          "as": operator,

          // types
          "string": type, "number": type, "boolean": type, "any": type
        };

        for (var attr in tsKeywords) {
          jsKeywords[attr] = tsKeywords[attr];
        }
      }

      return jsKeywords;
    }();

    var isOperatorChar = /[+\-*&%=<>!?|~^]/;
    var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

    function readRegexp(stream) {
      var escaped = false,
          next,
          inSet = false;
      while ((next = stream.next()) != null) {
        if (!escaped) {
          if (next == "/" && !inSet) return;
          if (next == "[") inSet = true;else if (inSet && next == "]") inSet = false;
        }
        escaped = !escaped && next == "\\";
      }
    }

    // Used as scratch variables to communicate multiple values without
    // consing up tons of objects.
    var type, content;
    function ret(tp, style, cont) {
      type = tp;content = cont;
      return style;
    }
    function tokenBase(stream, state) {
      var ch = stream.next();
      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
        return ret("number", "number");
      } else if (ch == "." && stream.match("..")) {
        return ret("spread", "meta");
      } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
        return ret(ch);
      } else if (ch == "=" && stream.eat(">")) {
        return ret("=>", "operator");
      } else if (ch == "0" && stream.eat(/x/i)) {
        stream.eatWhile(/[\da-f]/i);
        return ret("number", "number");
      } else if (ch == "0" && stream.eat(/o/i)) {
        stream.eatWhile(/[0-7]/i);
        return ret("number", "number");
      } else if (ch == "0" && stream.eat(/b/i)) {
        stream.eatWhile(/[01]/i);
        return ret("number", "number");
      } else if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
        return ret("number", "number");
      } else if (ch == "/") {
        if (stream.eat("*")) {
          state.tokenize = tokenComment;
          return tokenComment(stream, state);
        } else if (stream.eat("/")) {
          stream.skipToEnd();
          return ret("comment", "comment");
        } else if (expressionAllowed(stream, state, 1)) {
          readRegexp(stream);
          stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
          return ret("regexp", "string-2");
        } else {
          stream.eatWhile(isOperatorChar);
          return ret("operator", "operator", stream.current());
        }
      } else if (ch == "`") {
        state.tokenize = tokenQuasi;
        return tokenQuasi(stream, state);
      } else if (ch == "#") {
        stream.skipToEnd();
        return ret("error", "error");
      } else if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      } else if (wordRE.test(ch)) {
        stream.eatWhile(wordRE);
        var word = stream.current(),
            known = keywords.propertyIsEnumerable(word) && keywords[word];
        return known && state.lastType != "." ? ret(known.type, known.style, word) : ret("variable", "variable", word);
      }
    }

    function tokenString(quote) {
      return function (stream, state) {
        var escaped = false,
            next;
        if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)) {
          state.tokenize = tokenBase;
          return ret("jsonld-keyword", "meta");
        }
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped) break;
          escaped = !escaped && next == "\\";
        }
        if (!escaped) state.tokenize = tokenBase;
        return ret("string", "string");
      };
    }

    function tokenComment(stream, state) {
      var maybeEnd = false,
          ch;
      while (ch = stream.next()) {
        if (ch == "/" && maybeEnd) {
          state.tokenize = tokenBase;
          break;
        }
        maybeEnd = ch == "*";
      }
      return ret("comment", "comment");
    }

    function tokenQuasi(stream, state) {
      var escaped = false,
          next;
      while ((next = stream.next()) != null) {
        if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && next == "\\";
      }
      return ret("quasi", "string-2", stream.current());
    }

    var brackets = "([{}])";
    // This is a crude lookahead trick to try and notice that we're
    // parsing the argument patterns for a fat-arrow function before we
    // actually hit the arrow token. It only works if the arrow is on
    // the same line as the arguments and there's no strange noise
    // (comments) in between. Fallback is to only notice when we hit the
    // arrow, and not declare the arguments as locals for the arrow
    // body.
    function findFatArrow(stream, state) {
      if (state.fatArrowAt) state.fatArrowAt = null;
      var arrow = stream.string.indexOf("=>", stream.start);
      if (arrow < 0) return;

      var depth = 0,
          sawSomething = false;
      for (var pos = arrow - 1; pos >= 0; --pos) {
        var ch = stream.string.charAt(pos);
        var bracket = brackets.indexOf(ch);
        if (bracket >= 0 && bracket < 3) {
          if (!depth) {
            ++pos;break;
          }
          if (--depth == 0) {
            if (ch == "(") sawSomething = true;break;
          }
        } else if (bracket >= 3 && bracket < 6) {
          ++depth;
        } else if (wordRE.test(ch)) {
          sawSomething = true;
        } else if (/["'\/]/.test(ch)) {
          return;
        } else if (sawSomething && !depth) {
          ++pos;
          break;
        }
      }
      if (sawSomething && !depth) state.fatArrowAt = pos;
    }

    // Parser

    var atomicTypes = { "atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true };

    function JSLexical(indented, column, type, align, prev, info) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.prev = prev;
      this.info = info;
      if (align != null) this.align = align;
    }

    function inScope(state, varname) {
      for (var v = state.localVars; v; v = v.next) {
        if (v.name == varname) return true;
      }for (var cx = state.context; cx; cx = cx.prev) {
        for (var v = cx.vars; v; v = v.next) {
          if (v.name == varname) return true;
        }
      }
    }

    function parseJS(state, style, type, content, stream) {
      var cc = state.cc;
      // Communicate our context to the combinators.
      // (Less wasteful than consing up a hundred closures on every call.)
      cx.state = state;cx.stream = stream;cx.marked = null, cx.cc = cc;cx.style = style;

      if (!state.lexical.hasOwnProperty("align")) state.lexical.align = true;

      while (true) {
        var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
        if (combinator(type, content)) {
          while (cc.length && cc[cc.length - 1].lex) {
            cc.pop()();
          }if (cx.marked) return cx.marked;
          if (type == "variable" && inScope(state, content)) return "variable-2";
          return style;
        }
      }
    }

    // Combinator utils

    var cx = { state: null, column: null, marked: null, cc: null };
    function pass() {
      for (var i = arguments.length - 1; i >= 0; i--) {
        cx.cc.push(arguments[i]);
      }
    }
    function cont() {
      pass.apply(null, arguments);
      return true;
    }
    function register(varname) {
      function inList(list) {
        for (var v = list; v; v = v.next) {
          if (v.name == varname) return true;
        }return false;
      }
      var state = cx.state;
      cx.marked = "def";
      if (state.context) {
        if (inList(state.localVars)) return;
        state.localVars = { name: varname, next: state.localVars };
      } else {
        if (inList(state.globalVars)) return;
        if (parserConfig.globalVars) state.globalVars = { name: varname, next: state.globalVars };
      }
    }

    // Combinators

    var defaultVars = { name: "this", next: { name: "arguments" } };
    function pushcontext() {
      cx.state.context = { prev: cx.state.context, vars: cx.state.localVars };
      cx.state.localVars = defaultVars;
    }
    function popcontext() {
      cx.state.localVars = cx.state.context.vars;
      cx.state.context = cx.state.context.prev;
    }
    function pushlex(type, info) {
      var result = function result() {
        var state = cx.state,
            indent = state.indented;
        if (state.lexical.type == "stat") indent = state.lexical.indented;else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev) {
          indent = outer.indented;
        }state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
      };
      result.lex = true;
      return result;
    }
    function poplex() {
      var state = cx.state;
      if (state.lexical.prev) {
        if (state.lexical.type == ")") state.indented = state.lexical.indented;
        state.lexical = state.lexical.prev;
      }
    }
    poplex.lex = true;

    function expect(wanted) {
      function exp(type) {
        if (type == wanted) return cont();else if (wanted == ";") return pass();else return cont(exp);
      };
      return exp;
    }

    function statement(type, value) {
      if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
      if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
      if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
      if (type == "{") return cont(pushlex("}"), block, poplex);
      if (type == ";") return cont();
      if (type == "if") {
        if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex) cx.state.cc.pop()();
        return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
      }
      if (type == "function") return cont(functiondef);
      if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
      if (type == "variable") return cont(pushlex("stat"), maybelabel);
      if (type == "switch") return cont(pushlex("form"), parenExpr, pushlex("}", "switch"), expect("{"), block, poplex, poplex);
      if (type == "case") return cont(expression, expect(":"));
      if (type == "default") return cont(expect(":"));
      if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"), statement, poplex, popcontext);
      if (type == "class") return cont(pushlex("form"), className, poplex);
      if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
      if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
      if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex);
      if (type == "type") return cont(typeexpr, expect("operator"), typeexpr, expect(";"));
      if (type == "async") return cont(statement);
      return pass(pushlex("stat"), expression, expect(";"), poplex);
    }
    function expression(type) {
      return expressionInner(type, false);
    }
    function expressionNoComma(type) {
      return expressionInner(type, true);
    }
    function parenExpr(type) {
      if (type != "(") return pass();
      return cont(pushlex(")"), expression, expect(")"), poplex);
    }
    function expressionInner(type, noComma) {
      if (cx.state.fatArrowAt == cx.stream.start) {
        var body = noComma ? arrowBodyNoComma : arrowBody;
        if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
      }

      var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
      if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
      if (type == "function") return cont(functiondef, maybeop);
      if (type == "keyword c" || type == "async") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
      if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
      if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
      if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
      if (type == "{") return contCommasep(objprop, "}", null, maybeop);
      if (type == "quasi") return pass(quasi, maybeop);
      if (type == "new") return cont(maybeTarget(noComma));
      return cont();
    }
    function maybeexpression(type) {
      if (type.match(/[;\}\)\],]/)) return pass();
      return pass(expression);
    }
    function maybeexpressionNoComma(type) {
      if (type.match(/[;\}\)\],]/)) return pass();
      return pass(expressionNoComma);
    }

    function maybeoperatorComma(type, value) {
      if (type == ",") return cont(expression);
      return maybeoperatorNoComma(type, value, false);
    }
    function maybeoperatorNoComma(type, value, noComma) {
      var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
      var expr = noComma == false ? expression : expressionNoComma;
      if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
      if (type == "operator") {
        if (/\+\+|--/.test(value)) return cont(me);
        if (value == "?") return cont(expression, expect(":"), expr);
        return cont(expr);
      }
      if (type == "quasi") {
        return pass(quasi, me);
      }
      if (type == ";") return;
      if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
      if (type == ".") return cont(property, me);
      if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    }
    function quasi(type, value) {
      if (type != "quasi") return pass();
      if (value.slice(value.length - 2) != "${") return cont(quasi);
      return cont(expression, continueQuasi);
    }
    function continueQuasi(type) {
      if (type == "}") {
        cx.marked = "string-2";
        cx.state.tokenize = tokenQuasi;
        return cont(quasi);
      }
    }
    function arrowBody(type) {
      findFatArrow(cx.stream, cx.state);
      return pass(type == "{" ? statement : expression);
    }
    function arrowBodyNoComma(type) {
      findFatArrow(cx.stream, cx.state);
      return pass(type == "{" ? statement : expressionNoComma);
    }
    function maybeTarget(noComma) {
      return function (type) {
        if (type == ".") return cont(noComma ? targetNoComma : target);else return pass(noComma ? expressionNoComma : expression);
      };
    }
    function target(_, value) {
      if (value == "target") {
        cx.marked = "keyword";return cont(maybeoperatorComma);
      }
    }
    function targetNoComma(_, value) {
      if (value == "target") {
        cx.marked = "keyword";return cont(maybeoperatorNoComma);
      }
    }
    function maybelabel(type) {
      if (type == ":") return cont(poplex, statement);
      return pass(maybeoperatorComma, expect(";"), poplex);
    }
    function property(type) {
      if (type == "variable") {
        cx.marked = "property";return cont();
      }
    }
    function objprop(type, value) {
      if (type == "async") {
        cx.marked = "property";
        return cont(objprop);
      } else if (type == "variable" || cx.style == "keyword") {
        cx.marked = "property";
        if (value == "get" || value == "set") return cont(getterSetter);
        return cont(afterprop);
      } else if (type == "number" || type == "string") {
        cx.marked = jsonldMode ? "property" : cx.style + " property";
        return cont(afterprop);
      } else if (type == "jsonld-keyword") {
        return cont(afterprop);
      } else if (type == "modifier") {
        return cont(objprop);
      } else if (type == "[") {
        return cont(expression, expect("]"), afterprop);
      } else if (type == "spread") {
        return cont(expression);
      } else if (type == ":") {
        return pass(afterprop);
      }
    }
    function getterSetter(type) {
      if (type != "variable") return pass(afterprop);
      cx.marked = "property";
      return cont(functiondef);
    }
    function afterprop(type) {
      if (type == ":") return cont(expressionNoComma);
      if (type == "(") return pass(functiondef);
    }
    function commasep(what, end) {
      function proceed(type, value) {
        if (type == ",") {
          var lex = cx.state.lexical;
          if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
          return cont(function (type, value) {
            if (type == end || value == end) return pass();
            return pass(what);
          }, proceed);
        }
        if (type == end || value == end) return cont();
        return cont(expect(end));
      }
      return function (type, value) {
        if (type == end || value == end) return cont();
        return pass(what, proceed);
      };
    }
    function contCommasep(what, end, info) {
      for (var i = 3; i < arguments.length; i++) {
        cx.cc.push(arguments[i]);
      }return cont(pushlex(end, info), commasep(what, end), poplex);
    }
    function block(type) {
      if (type == "}") return cont();
      return pass(statement, block);
    }
    function maybetype(type, value) {
      if (isTS) {
        if (type == ":") return cont(typeexpr);
        if (value == "?") return cont(maybetype);
      }
    }
    function typeexpr(type) {
      if (type == "variable") {
        cx.marked = "variable-3";return cont(afterType);
      }
      if (type == "{") return cont(commasep(typeprop, "}"));
      if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType);
    }
    function maybeReturnType(type) {
      if (type == "=>") return cont(typeexpr);
    }
    function typeprop(type) {
      if (type == "variable" || cx.style == "keyword") {
        cx.marked = "property";
        return cont(typeprop);
      } else if (type == ":") {
        return cont(typeexpr);
      }
    }
    function typearg(type) {
      if (type == "variable") return cont(typearg);else if (type == ":") return cont(typeexpr);
    }
    function afterType(type, value) {
      if (value == "<") return cont(commasep(typeexpr, ">"), afterType);
      if (type == "[") return cont(expect("]"), afterType);
    }
    function vardef() {
      return pass(pattern, maybetype, maybeAssign, vardefCont);
    }
    function pattern(type, value) {
      if (type == "modifier") return cont(pattern);
      if (type == "variable") {
        register(value);return cont();
      }
      if (type == "spread") return cont(pattern);
      if (type == "[") return contCommasep(pattern, "]");
      if (type == "{") return contCommasep(proppattern, "}");
    }
    function proppattern(type, value) {
      if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
        register(value);
        return cont(maybeAssign);
      }
      if (type == "variable") cx.marked = "property";
      if (type == "spread") return cont(pattern);
      if (type == "}") return pass();
      return cont(expect(":"), pattern, maybeAssign);
    }
    function maybeAssign(_type, value) {
      if (value == "=") return cont(expressionNoComma);
    }
    function vardefCont(type) {
      if (type == ",") return cont(vardef);
    }
    function maybeelse(type, value) {
      if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
    }
    function forspec(type) {
      if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
    }
    function forspec1(type) {
      if (type == "var") return cont(vardef, expect(";"), forspec2);
      if (type == ";") return cont(forspec2);
      if (type == "variable") return cont(formaybeinof);
      return pass(expression, expect(";"), forspec2);
    }
    function formaybeinof(_type, value) {
      if (value == "in" || value == "of") {
        cx.marked = "keyword";return cont(expression);
      }
      return cont(maybeoperatorComma, forspec2);
    }
    function forspec2(type, value) {
      if (type == ";") return cont(forspec3);
      if (value == "in" || value == "of") {
        cx.marked = "keyword";return cont(expression);
      }
      return pass(expression, expect(";"), forspec3);
    }
    function forspec3(type) {
      if (type != ")") cont(expression);
    }
    function functiondef(type, value) {
      if (value == "*") {
        cx.marked = "keyword";return cont(functiondef);
      }
      if (type == "variable") {
        register(value);return cont(functiondef);
      }
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, maybetype, statement, popcontext);
    }
    function funarg(type) {
      if (type == "spread") return cont(funarg);
      return pass(pattern, maybetype, maybeAssign);
    }
    function className(type, value) {
      if (type == "variable") {
        register(value);return cont(classNameAfter);
      }
    }
    function classNameAfter(type, value) {
      if (value == "extends" || value == "implements") return cont(isTS ? typeexpr : expression, classNameAfter);
      if (type == "{") return cont(pushlex("}"), classBody, poplex);
    }
    function classBody(type, value) {
      if (type == "variable" || cx.style == "keyword") {
        if ((value == "static" || value == "get" || value == "set" || isTS && (value == "public" || value == "private" || value == "protected" || value == "readonly" || value == "abstract")) && cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false)) {
          cx.marked = "keyword";
          return cont(classBody);
        }
        cx.marked = "property";
        return cont(isTS ? classfield : functiondef, classBody);
      }
      if (value == "*") {
        cx.marked = "keyword";
        return cont(classBody);
      }
      if (type == ";") return cont(classBody);
      if (type == "}") return cont();
    }
    function classfield(type, value) {
      if (value == "?") return cont(classfield);
      if (type == ":") return cont(typeexpr, maybeAssign);
      return pass(functiondef);
    }
    function afterExport(_type, value) {
      if (value == "*") {
        cx.marked = "keyword";return cont(maybeFrom, expect(";"));
      }
      if (value == "default") {
        cx.marked = "keyword";return cont(expression, expect(";"));
      }
      return pass(statement);
    }
    function afterImport(type) {
      if (type == "string") return cont();
      return pass(importSpec, maybeFrom);
    }
    function importSpec(type, value) {
      if (type == "{") return contCommasep(importSpec, "}");
      if (type == "variable") register(value);
      if (value == "*") cx.marked = "keyword";
      return cont(maybeAs);
    }
    function maybeAs(_type, value) {
      if (value == "as") {
        cx.marked = "keyword";return cont(importSpec);
      }
    }
    function maybeFrom(_type, value) {
      if (value == "from") {
        cx.marked = "keyword";return cont(expression);
      }
    }
    function arrayLiteral(type) {
      if (type == "]") return cont();
      return pass(commasep(expressionNoComma, "]"));
    }

    function isContinuedStatement(state, textAfter) {
      return state.lastType == "operator" || state.lastType == "," || isOperatorChar.test(textAfter.charAt(0)) || /[,.]/.test(textAfter.charAt(0));
    }

    // Interface

    return {
      startState: function startState(basecolumn) {
        var state = {
          tokenize: tokenBase,
          lastType: "sof",
          cc: [],
          lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
          localVars: parserConfig.localVars,
          context: parserConfig.localVars && { vars: parserConfig.localVars },
          indented: basecolumn || 0
        };
        if (parserConfig.globalVars && _typeof(parserConfig.globalVars) == "object") state.globalVars = parserConfig.globalVars;
        return state;
      },

      token: function token(stream, state) {
        if (stream.sol()) {
          if (!state.lexical.hasOwnProperty("align")) state.lexical.align = false;
          state.indented = stream.indentation();
          findFatArrow(stream, state);
        }
        if (state.tokenize != tokenComment && stream.eatSpace()) return null;
        var style = state.tokenize(stream, state);
        if (type == "comment") return style;
        state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
        return parseJS(state, style, type, content, stream);
      },

      indent: function indent(state, textAfter) {
        if (state.tokenize == tokenComment) return CodeMirror.Pass;
        if (state.tokenize != tokenBase) return 0;
        var firstChar = textAfter && textAfter.charAt(0),
            lexical = state.lexical,
            top;
        // Kludge to prevent 'maybelse' from blocking lexical scope pops
        if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
          var c = state.cc[i];
          if (c == poplex) lexical = lexical.prev;else if (c != maybeelse) break;
        }
        while ((lexical.type == "stat" || lexical.type == "form") && (firstChar == "}" || (top = state.cc[state.cc.length - 1]) && (top == maybeoperatorComma || top == maybeoperatorNoComma) && !/^[,\.=+\-*:?[\(]/.test(textAfter))) {
          lexical = lexical.prev;
        }if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat") lexical = lexical.prev;
        var type = lexical.type,
            closing = firstChar == type;

        if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);else if (type == "form" && firstChar == "{") return lexical.indented;else if (type == "form") return lexical.indented + indentUnit;else if (type == "stat") return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false) return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);else if (lexical.align) return lexical.column + (closing ? 0 : 1);else return lexical.indented + (closing ? 0 : indentUnit);
      },

      electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
      blockCommentStart: jsonMode ? null : "/*",
      blockCommentEnd: jsonMode ? null : "*/",
      lineComment: jsonMode ? null : "//",
      fold: "brace",
      closeBrackets: "()[]{}''\"\"``",

      helperType: jsonMode ? "json" : "javascript",
      jsonldMode: jsonldMode,
      jsonMode: jsonMode,

      expressionAllowed: expressionAllowed,
      skipExpression: function skipExpression(state) {
        var top = state.cc[state.cc.length - 1];
        if (top == expression || top == expressionNoComma) state.cc.pop();
      }
    };
  });

  CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

  CodeMirror.defineMIME("text/javascript", "javascript");
  CodeMirror.defineMIME("text/ecmascript", "javascript");
  CodeMirror.defineMIME("application/javascript", "javascript");
  CodeMirror.defineMIME("application/x-javascript", "javascript");
  CodeMirror.defineMIME("application/ecmascript", "javascript");
  CodeMirror.defineMIME("application/json", { name: "javascript", json: true });
  CodeMirror.defineMIME("application/x-json", { name: "javascript", json: true });
  CodeMirror.defineMIME("application/ld+json", { name: "javascript", jsonld: true });
  CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
  CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) && (document.documentMode == null || document.documentMode < 8);

  var Pos = CodeMirror.Pos;

  var matching = { "(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<" };

  function findMatchingBracket(cm, where, strict, config) {
    var line = cm.getLineHandle(where.line),
        pos = where.ch - 1;
    var match = pos >= 0 && matching[line.text.charAt(pos)] || matching[line.text.charAt(++pos)];
    if (!match) return null;
    var dir = match.charAt(1) == ">" ? 1 : -1;
    if (strict && dir > 0 != (pos == where.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(where.line, pos + 1));

    var found = scanForBracket(cm, Pos(where.line, pos + (dir > 0 ? 1 : 0)), dir, style || null, config);
    if (found == null) return null;
    return { from: Pos(where.line, pos), to: found && found.pos,
      match: found && found.ch == match.charAt(0), forward: dir > 0 };
  }

  // bracketRegex is used to specify which type of bracket to scan
  // should be a regexp, e.g. /[[\]]/
  //
  // Note: If "where" is on an open bracket, then this bracket is ignored.
  //
  // Returns false when no bracket was found, null when it reached
  // maxScanLines and gave up
  function scanForBracket(cm, where, dir, style, config) {
    var maxScanLen = config && config.maxScanLineLength || 10000;
    var maxScanLines = config && config.maxScanLines || 1000;

    var stack = [];
    var re = config && config.bracketRegex ? config.bracketRegex : /[(){}[\]]/;
    var lineEnd = dir > 0 ? Math.min(where.line + maxScanLines, cm.lastLine() + 1) : Math.max(cm.firstLine() - 1, where.line - maxScanLines);
    for (var lineNo = where.line; lineNo != lineEnd; lineNo += dir) {
      var line = cm.getLine(lineNo);
      if (!line) continue;
      var pos = dir > 0 ? 0 : line.length - 1,
          end = dir > 0 ? line.length : -1;
      if (line.length > maxScanLen) continue;
      if (lineNo == where.line) pos = where.ch - (dir < 0 ? 1 : 0);
      for (; pos != end; pos += dir) {
        var ch = line.charAt(pos);
        if (re.test(ch) && (style === undefined || cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style)) {
          var match = matching[ch];
          if (match.charAt(1) == ">" == dir > 0) stack.push(ch);else if (!stack.length) return { pos: Pos(lineNo, pos), ch: ch };else stack.pop();
        }
      }
    }
    return lineNo - dir == (dir > 0 ? cm.lastLine() : cm.firstLine()) ? false : null;
  }

  function matchBrackets(cm, autoclear, config) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
    var marks = [],
        ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      var match = ranges[i].empty() && findMatchingBracket(cm, ranges[i].head, false, config);
      if (match && cm.getLine(match.from.line).length <= maxHighlightLen) {
        var style = match.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        marks.push(cm.markText(match.from, Pos(match.from.line, match.from.ch + 1), { className: style }));
        if (match.to && cm.getLine(match.to.line).length <= maxHighlightLen) marks.push(cm.markText(match.to, Pos(match.to.line, match.to.ch + 1), { className: style }));
      }
    }

    if (marks.length) {
      // Kludge to work around the IE bug from issue #1193, where text
      // input stops going to the textare whever this fires.
      if (ie_lt8 && cm.state.focused) cm.focus();

      var clear = function clear() {
        cm.operation(function () {
          for (var i = 0; i < marks.length; i++) {
            marks[i].clear();
          }
        });
      };
      if (autoclear) setTimeout(clear, 800);else return clear;
    }
  }

  var currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(function () {
      if (currentlyHighlighted) {
        currentlyHighlighted();currentlyHighlighted = null;
      }
      currentlyHighlighted = matchBrackets(cm, false, cm.state.matchBrackets);
    });
  }

  CodeMirror.defineOption("matchBrackets", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.off("cursorActivity", doMatchBrackets);
      if (currentlyHighlighted) {
        currentlyHighlighted();currentlyHighlighted = null;
      }
    }
    if (val) {
      cm.state.matchBrackets = (typeof val === "undefined" ? "undefined" : _typeof(val)) == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
    }
  });

  CodeMirror.defineExtension("matchBrackets", function () {
    matchBrackets(this, true);
  });
  CodeMirror.defineExtension("findMatchingBracket", function (pos, strict, config) {
    return findMatchingBracket(this, pos, strict, config);
  });
  CodeMirror.defineExtension("scanForBracket", function (pos, dir, style, config) {
    return scanForBracket(this, pos, dir, style, config);
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  function searchOverlay(query, caseInsensitive) {
    if (typeof query == "string") query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return { token: function token(stream) {
        query.lastIndex = stream.pos;
        var match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching";
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      } };
  }

  function SearchState() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
  }

  function getSearchState(cm) {
    return cm.state.search || (cm.state.search = new SearchState());
  }

  function queryCaseInsensitive(query) {
    return typeof query == "string" && query == query.toLowerCase();
  }

  function getSearchCursor(cm, query, pos) {
    // Heuristic: if the query string is all lowercase, do a case insensitive search.
    return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
  }

  function persistentDialog(cm, text, deflt, onEnter, onKeyDown) {
    cm.openDialog(text, onEnter, {
      value: deflt,
      selectValueOnOpen: true,
      closeOnEnter: false,
      onClose: function onClose() {
        clearSearch(cm);
      },
      onKeyDown: onKeyDown
    });
  }

  function dialog(cm, text, shortText, deflt, f) {
    if (cm.openDialog) cm.openDialog(text, f, { value: deflt, selectValueOnOpen: true });else f(prompt(shortText, deflt));
  }

  function confirmDialog(cm, text, shortText, fs) {
    if (cm.openConfirm) cm.openConfirm(text, fs);else if (confirm(shortText)) fs[0]();
  }

  function parseString(string) {
    return string.replace(/\\(.)/g, function (_, ch) {
      if (ch == "n") return "\n";
      if (ch == "r") return "\r";
      return ch;
    });
  }

  function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
      try {
        query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");
      } catch (e) {} // Not a regular expression after all, do a string search
    } else {
      query = parseString(query);
    }
    if (typeof query == "string" ? query == "" : query.test("")) query = /x^/;
    return query;
  }

  var queryDialog = 'Search: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>';

  function startSearch(cm, state, query) {
    state.queryText = query;
    state.query = parseQuery(query);
    cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
    state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
    cm.addOverlay(state.overlay);
    if (cm.showMatchesOnScrollbar) {
      if (state.annotate) {
        state.annotate.clear();state.annotate = null;
      }
      state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
    }
  }

  function doSearch(cm, rev, persistent, immediate) {
    var state = getSearchState(cm);
    if (state.query) return findNext(cm, rev);
    var q = cm.getSelection() || state.lastQuery;
    if (persistent && cm.openDialog) {
      var hiding = null;
      var searchNext = function searchNext(query, event) {
        CodeMirror.e_stop(event);
        if (!query) return;
        if (query != state.queryText) {
          startSearch(cm, state, query);
          state.posFrom = state.posTo = cm.getCursor();
        }
        if (hiding) hiding.style.opacity = 1;
        findNext(cm, event.shiftKey, function (_, to) {
          var dialog;
          if (to.line < 3 && document.querySelector && (dialog = cm.display.wrapper.querySelector(".CodeMirror-dialog")) && dialog.getBoundingClientRect().bottom - 4 > cm.cursorCoords(to, "window").top) (hiding = dialog).style.opacity = .4;
        });
      };
      persistentDialog(cm, queryDialog, q, searchNext, function (event, query) {
        var keyName = CodeMirror.keyName(event);
        var cmd = CodeMirror.keyMap[cm.getOption("keyMap")][keyName];
        if (!cmd) cmd = cm.getOption('extraKeys')[keyName];
        if (cmd == "findNext" || cmd == "findPrev" || cmd == "findPersistentNext" || cmd == "findPersistentPrev") {
          CodeMirror.e_stop(event);
          startSearch(cm, getSearchState(cm), query);
          cm.execCommand(cmd);
        } else if (cmd == "find" || cmd == "findPersistent") {
          CodeMirror.e_stop(event);
          searchNext(query, event);
        }
      });
      if (immediate && q) {
        startSearch(cm, state, q);
        findNext(cm, rev);
      }
    } else {
      dialog(cm, queryDialog, "Search for:", q, function (query) {
        if (query && !state.query) cm.operation(function () {
          startSearch(cm, state, query);
          state.posFrom = state.posTo = cm.getCursor();
          findNext(cm, rev);
        });
      });
    }
  }

  function findNext(cm, rev, callback) {
    cm.operation(function () {
      var state = getSearchState(cm);
      var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
      if (!cursor.find(rev)) {
        cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
        if (!cursor.find(rev)) return;
      }
      cm.setSelection(cursor.from(), cursor.to());
      cm.scrollIntoView({ from: cursor.from(), to: cursor.to() }, 20);
      state.posFrom = cursor.from();state.posTo = cursor.to();
      if (callback) callback(cursor.from(), cursor.to());
    });
  }

  function clearSearch(cm) {
    cm.operation(function () {
      var state = getSearchState(cm);
      state.lastQuery = state.query;
      if (!state.query) return;
      state.query = state.queryText = null;
      cm.removeOverlay(state.overlay);
      if (state.annotate) {
        state.annotate.clear();state.annotate = null;
      }
    });
  }

  var replaceQueryDialog = ' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>';
  var replacementQueryDialog = 'With: <input type="text" style="width: 10em" class="CodeMirror-search-field"/>';
  var doReplaceConfirm = "Replace? <button>Yes</button> <button>No</button> <button>All</button> <button>Stop</button>";

  function replaceAll(cm, query, text) {
    cm.operation(function () {
      for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
        if (typeof query != "string") {
          var match = cm.getRange(cursor.from(), cursor.to()).match(query);
          cursor.replace(text.replace(/\$(\d)/g, function (_, i) {
            return match[i];
          }));
        } else cursor.replace(text);
      }
    });
  }

  function replace(cm, all) {
    if (cm.getOption("readOnly")) return;
    var query = cm.getSelection() || getSearchState(cm).lastQuery;
    var dialogText = all ? "Replace all:" : "Replace:";
    dialog(cm, dialogText + replaceQueryDialog, dialogText, query, function (query) {
      if (!query) return;
      query = parseQuery(query);
      dialog(cm, replacementQueryDialog, "Replace with:", "", function (text) {
        text = parseString(text);
        if (all) {
          replaceAll(cm, query, text);
        } else {
          clearSearch(cm);
          var cursor = getSearchCursor(cm, query, cm.getCursor("from"));
          var advance = function advance() {
            var start = cursor.from(),
                match;
            if (!(match = cursor.findNext())) {
              cursor = getSearchCursor(cm, query);
              if (!(match = cursor.findNext()) || start && cursor.from().line == start.line && cursor.from().ch == start.ch) return;
            }
            cm.setSelection(cursor.from(), cursor.to());
            cm.scrollIntoView({ from: cursor.from(), to: cursor.to() });
            confirmDialog(cm, doReplaceConfirm, "Replace?", [function () {
              doReplace(match);
            }, advance, function () {
              replaceAll(cm, query, text);
            }]);
          };
          var doReplace = function doReplace(match) {
            cursor.replace(typeof query == "string" ? text : text.replace(/\$(\d)/g, function (_, i) {
              return match[i];
            }));
            advance();
          };
          advance();
        }
      });
    });
  }

  CodeMirror.commands.find = function (cm) {
    clearSearch(cm);doSearch(cm);
  };
  CodeMirror.commands.findPersistent = function (cm) {
    clearSearch(cm);doSearch(cm, false, true);
  };
  CodeMirror.commands.findPersistentNext = function (cm) {
    doSearch(cm, false, true, true);
  };
  CodeMirror.commands.findPersistentPrev = function (cm) {
    doSearch(cm, true, true, true);
  };
  CodeMirror.commands.findNext = doSearch;
  CodeMirror.commands.findPrev = function (cm) {
    doSearch(cm, true);
  };
  CodeMirror.commands.clearSearch = clearSearch;
  CodeMirror.commands.replace = replace;
  CodeMirror.commands.replaceAll = function (cm) {
    replace(cm, true);
  };
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../../lib/codemirror"));else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;

  function SearchCursor(doc, query, pos, caseFold) {
    this.atOccurrence = false;this.doc = doc;
    if (caseFold == null && typeof query == "string") caseFold = false;

    pos = pos ? doc.clipPos(pos) : Pos(0, 0);
    this.pos = { from: pos, to: pos };

    // The matches method is filled in based on the type of query.
    // It takes a position and a direction, and returns an object
    // describing the next occurrence of the query, or null if no
    // more matches were found.
    if (typeof query != "string") {
      // Regexp match
      if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "ig" : "g");
      this.matches = function (reverse, pos) {
        if (reverse) {
          query.lastIndex = 0;
          var line = doc.getLine(pos.line).slice(0, pos.ch),
              cutOff = 0,
              match,
              start;
          for (;;) {
            query.lastIndex = cutOff;
            var newMatch = query.exec(line);
            if (!newMatch) break;
            match = newMatch;
            start = match.index;
            cutOff = match.index + (match[0].length || 1);
            if (cutOff == line.length) break;
          }
          var matchLen = match && match[0].length || 0;
          if (!matchLen) {
            if (start == 0 && line.length == 0) {
              match = undefined;
            } else if (start != doc.getLine(pos.line).length) {
              matchLen++;
            }
          }
        } else {
          query.lastIndex = pos.ch;
          var line = doc.getLine(pos.line),
              match = query.exec(line);
          var matchLen = match && match[0].length || 0;
          var start = match && match.index;
          if (start + matchLen != line.length && !matchLen) matchLen = 1;
        }
        if (match && matchLen) return { from: Pos(pos.line, start),
          to: Pos(pos.line, start + matchLen),
          match: match };
      };
    } else {
      // String query
      var origQuery = query;
      if (caseFold) query = query.toLowerCase();
      var fold = caseFold ? function (str) {
        return str.toLowerCase();
      } : function (str) {
        return str;
      };
      var target = query.split("\n");
      // Different methods for single-line and multi-line queries
      if (target.length == 1) {
        if (!query.length) {
          // Empty string would match anything and never progress, so
          // we define it to match nothing instead.
          this.matches = function () {};
        } else {
          this.matches = function (reverse, pos) {
            if (reverse) {
              var orig = doc.getLine(pos.line).slice(0, pos.ch),
                  line = fold(orig);
              var match = line.lastIndexOf(query);
              if (match > -1) {
                match = adjustPos(orig, line, match);
                return { from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length) };
              }
            } else {
              var orig = doc.getLine(pos.line).slice(pos.ch),
                  line = fold(orig);
              var match = line.indexOf(query);
              if (match > -1) {
                match = adjustPos(orig, line, match) + pos.ch;
                return { from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length) };
              }
            }
          };
        }
      } else {
        var origTarget = origQuery.split("\n");
        this.matches = function (reverse, pos) {
          var last = target.length - 1;
          if (reverse) {
            if (pos.line - (target.length - 1) < doc.firstLine()) return;
            if (fold(doc.getLine(pos.line).slice(0, origTarget[last].length)) != target[target.length - 1]) return;
            var to = Pos(pos.line, origTarget[last].length);
            for (var ln = pos.line - 1, i = last - 1; i >= 1; --i, --ln) {
              if (target[i] != fold(doc.getLine(ln))) return;
            }var line = doc.getLine(ln),
                cut = line.length - origTarget[0].length;
            if (fold(line.slice(cut)) != target[0]) return;
            return { from: Pos(ln, cut), to: to };
          } else {
            if (pos.line + (target.length - 1) > doc.lastLine()) return;
            var line = doc.getLine(pos.line),
                cut = line.length - origTarget[0].length;
            if (fold(line.slice(cut)) != target[0]) return;
            var from = Pos(pos.line, cut);
            for (var ln = pos.line + 1, i = 1; i < last; ++i, ++ln) {
              if (target[i] != fold(doc.getLine(ln))) return;
            }if (fold(doc.getLine(ln).slice(0, origTarget[last].length)) != target[last]) return;
            return { from: from, to: Pos(ln, origTarget[last].length) };
          }
        };
      }
    }
  }

  SearchCursor.prototype = {
    findNext: function findNext() {
      return this.find(false);
    },
    findPrevious: function findPrevious() {
      return this.find(true);
    },

    find: function find(reverse) {
      var self = this,
          pos = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
      function savePosAndFail(line) {
        var pos = Pos(line, 0);
        self.pos = { from: pos, to: pos };
        self.atOccurrence = false;
        return false;
      }

      for (;;) {
        if (this.pos = this.matches(reverse, pos)) {
          this.atOccurrence = true;
          return this.pos.match || true;
        }
        if (reverse) {
          if (!pos.line) return savePosAndFail(0);
          pos = Pos(pos.line - 1, this.doc.getLine(pos.line - 1).length);
        } else {
          var maxLine = this.doc.lineCount();
          if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
          pos = Pos(pos.line + 1, 0);
        }
      }
    },

    from: function from() {
      if (this.atOccurrence) return this.pos.from;
    },
    to: function to() {
      if (this.atOccurrence) return this.pos.to;
    },

    replace: function replace(newText, origin) {
      if (!this.atOccurrence) return;
      var lines = CodeMirror.splitLines(newText);
      this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin);
      this.pos.to = Pos(this.pos.from.line + lines.length - 1, lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0));
    }
  };

  // Maps a position in a case-folded line back to a position in the original line
  // (compensating for codepoints increasing in number during folding)
  function adjustPos(orig, folded, pos) {
    if (orig.length == folded.length) return pos;
    for (var pos1 = Math.min(pos, orig.length);;) {
      var len1 = orig.slice(0, pos1).toLowerCase().length;
      if (len1 < pos) ++pos1;else if (len1 > pos) --pos1;else return pos1;
    }
  }

  CodeMirror.defineExtension("getSearchCursor", function (query, pos, caseFold) {
    return new SearchCursor(this.doc, query, pos, caseFold);
  });
  CodeMirror.defineDocExtension("getSearchCursor", function (query, pos, caseFold) {
    return new SearchCursor(this, query, pos, caseFold);
  });

  CodeMirror.defineExtension("selectMatches", function (query, caseFold) {
    var ranges = [];
    var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold);
    while (cur.findNext()) {
      if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break;
      ranges.push({ anchor: cur.from(), head: cur.to() });
    }
    if (ranges.length) this.setSelections(ranges, 0);
  });
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// A rough approximation of Sublime Text's keybindings
// Depends on addon/search/searchcursor.js and optionally addon/dialog/dialogs.js

(function (mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(require("../lib/codemirror"), require("../addon/search/searchcursor"), require("../addon/edit/matchbrackets"));else if (typeof define == "function" && define.amd) // AMD
    define(["../lib/codemirror", "../addon/search/searchcursor", "../addon/edit/matchbrackets"], mod);else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  var map = CodeMirror.keyMap.sublime = { fallthrough: "default" };
  var cmds = CodeMirror.commands;
  var Pos = CodeMirror.Pos;
  var mac = CodeMirror.keyMap["default"] == CodeMirror.keyMap.macDefault;
  var ctrl = mac ? "Cmd-" : "Ctrl-";

  // This is not exactly Sublime's algorithm. I couldn't make heads or tails of that.
  function findPosSubword(doc, start, dir) {
    if (dir < 0 && start.ch == 0) return doc.clipPos(Pos(start.line - 1));
    var line = doc.getLine(start.line);
    if (dir > 0 && start.ch >= line.length) return doc.clipPos(Pos(start.line + 1, 0));
    var state = "start",
        type;
    for (var pos = start.ch, e = dir < 0 ? 0 : line.length, i = 0; pos != e; pos += dir, i++) {
      var next = line.charAt(dir < 0 ? pos - 1 : pos);
      var cat = next != "_" && CodeMirror.isWordChar(next) ? "w" : "o";
      if (cat == "w" && next.toUpperCase() == next) cat = "W";
      if (state == "start") {
        if (cat != "o") {
          state = "in";type = cat;
        }
      } else if (state == "in") {
        if (type != cat) {
          if (type == "w" && cat == "W" && dir < 0) pos--;
          if (type == "W" && cat == "w" && dir > 0) {
            type = "w";continue;
          }
          break;
        }
      }
    }
    return Pos(start.line, pos);
  }

  function moveSubword(cm, dir) {
    cm.extendSelectionsBy(function (range) {
      if (cm.display.shift || cm.doc.extend || range.empty()) return findPosSubword(cm.doc, range.head, dir);else return dir < 0 ? range.from() : range.to();
    });
  }

  var goSubwordCombo = mac ? "Ctrl-" : "Alt-";

  cmds[map[goSubwordCombo + "Left"] = "goSubwordLeft"] = function (cm) {
    moveSubword(cm, -1);
  };
  cmds[map[goSubwordCombo + "Right"] = "goSubwordRight"] = function (cm) {
    moveSubword(cm, 1);
  };

  if (mac) map["Cmd-Left"] = "goLineStartSmart";

  var scrollLineCombo = mac ? "Ctrl-Alt-" : "Ctrl-";

  cmds[map[scrollLineCombo + "Up"] = "scrollLineUp"] = function (cm) {
    var info = cm.getScrollInfo();
    if (!cm.somethingSelected()) {
      var visibleBottomLine = cm.lineAtHeight(info.top + info.clientHeight, "local");
      if (cm.getCursor().line >= visibleBottomLine) cm.execCommand("goLineUp");
    }
    cm.scrollTo(null, info.top - cm.defaultTextHeight());
  };
  cmds[map[scrollLineCombo + "Down"] = "scrollLineDown"] = function (cm) {
    var info = cm.getScrollInfo();
    if (!cm.somethingSelected()) {
      var visibleTopLine = cm.lineAtHeight(info.top, "local") + 1;
      if (cm.getCursor().line <= visibleTopLine) cm.execCommand("goLineDown");
    }
    cm.scrollTo(null, info.top + cm.defaultTextHeight());
  };

  cmds[map["Shift-" + ctrl + "L"] = "splitSelectionByLine"] = function (cm) {
    var ranges = cm.listSelections(),
        lineRanges = [];
    for (var i = 0; i < ranges.length; i++) {
      var from = ranges[i].from(),
          to = ranges[i].to();
      for (var line = from.line; line <= to.line; ++line) {
        if (!(to.line > from.line && line == to.line && to.ch == 0)) lineRanges.push({ anchor: line == from.line ? from : Pos(line, 0),
          head: line == to.line ? to : Pos(line) });
      }
    }
    cm.setSelections(lineRanges, 0);
  };

  map["Shift-Tab"] = "indentLess";

  cmds[map["Esc"] = "singleSelectionTop"] = function (cm) {
    var range = cm.listSelections()[0];
    cm.setSelection(range.anchor, range.head, { scroll: false });
  };

  cmds[map[ctrl + "L"] = "selectLine"] = function (cm) {
    var ranges = cm.listSelections(),
        extended = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      extended.push({ anchor: Pos(range.from().line, 0),
        head: Pos(range.to().line + 1, 0) });
    }
    cm.setSelections(extended);
  };

  map["Shift-Ctrl-K"] = "deleteLine";

  function insertLine(cm, above) {
    if (cm.isReadOnly()) return CodeMirror.Pass;
    cm.operation(function () {
      var len = cm.listSelections().length,
          newSelection = [],
          last = -1;
      for (var i = 0; i < len; i++) {
        var head = cm.listSelections()[i].head;
        if (head.line <= last) continue;
        var at = Pos(head.line + (above ? 0 : 1), 0);
        cm.replaceRange("\n", at, null, "+insertLine");
        cm.indentLine(at.line, null, true);
        newSelection.push({ head: at, anchor: at });
        last = head.line + 1;
      }
      cm.setSelections(newSelection);
    });
    cm.execCommand("indentAuto");
  }

  cmds[map[ctrl + "Enter"] = "insertLineAfter"] = function (cm) {
    return insertLine(cm, false);
  };

  cmds[map["Shift-" + ctrl + "Enter"] = "insertLineBefore"] = function (cm) {
    return insertLine(cm, true);
  };

  function wordAt(cm, pos) {
    var start = pos.ch,
        end = start,
        line = cm.getLine(pos.line);
    while (start && CodeMirror.isWordChar(line.charAt(start - 1))) {
      --start;
    }while (end < line.length && CodeMirror.isWordChar(line.charAt(end))) {
      ++end;
    }return { from: Pos(pos.line, start), to: Pos(pos.line, end), word: line.slice(start, end) };
  }

  cmds[map[ctrl + "D"] = "selectNextOccurrence"] = function (cm) {
    var from = cm.getCursor("from"),
        to = cm.getCursor("to");
    var fullWord = cm.state.sublimeFindFullWord == cm.doc.sel;
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word) return;
      cm.setSelection(word.from, word.to);
      fullWord = true;
    } else {
      var text = cm.getRange(from, to);
      var query = fullWord ? new RegExp("\\b" + text + "\\b") : text;
      var cur = cm.getSearchCursor(query, to);
      if (cur.findNext()) {
        cm.addSelection(cur.from(), cur.to());
      } else {
        cur = cm.getSearchCursor(query, Pos(cm.firstLine(), 0));
        if (cur.findNext()) cm.addSelection(cur.from(), cur.to());
      }
    }
    if (fullWord) cm.state.sublimeFindFullWord = cm.doc.sel;
  };

  var mirror = "(){}[]";
  function selectBetweenBrackets(cm) {
    var pos = cm.getCursor(),
        opening = cm.scanForBracket(pos, -1);
    if (!opening) return;
    for (;;) {
      var closing = cm.scanForBracket(pos, 1);
      if (!closing) return;
      if (closing.ch == mirror.charAt(mirror.indexOf(opening.ch) + 1)) {
        cm.setSelection(Pos(opening.pos.line, opening.pos.ch + 1), closing.pos, false);
        return true;
      }
      pos = Pos(closing.pos.line, closing.pos.ch + 1);
    }
  }

  cmds[map["Shift-" + ctrl + "Space"] = "selectScope"] = function (cm) {
    selectBetweenBrackets(cm) || cm.execCommand("selectAll");
  };
  cmds[map["Shift-" + ctrl + "M"] = "selectBetweenBrackets"] = function (cm) {
    if (!selectBetweenBrackets(cm)) return CodeMirror.Pass;
  };

  cmds[map[ctrl + "M"] = "goToBracket"] = function (cm) {
    cm.extendSelectionsBy(function (range) {
      var next = cm.scanForBracket(range.head, 1);
      if (next && CodeMirror.cmpPos(next.pos, range.head) != 0) return next.pos;
      var prev = cm.scanForBracket(range.head, -1);
      return prev && Pos(prev.pos.line, prev.pos.ch + 1) || range.head;
    });
  };

  var swapLineCombo = mac ? "Cmd-Ctrl-" : "Shift-Ctrl-";

  cmds[map[swapLineCombo + "Up"] = "swapLineUp"] = function (cm) {
    if (cm.isReadOnly()) return CodeMirror.Pass;
    var ranges = cm.listSelections(),
        linesToMove = [],
        at = cm.firstLine() - 1,
        newSels = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i],
          from = range.from().line - 1,
          to = range.to().line;
      newSels.push({ anchor: Pos(range.anchor.line - 1, range.anchor.ch),
        head: Pos(range.head.line - 1, range.head.ch) });
      if (range.to().ch == 0 && !range.empty()) --to;
      if (from > at) linesToMove.push(from, to);else if (linesToMove.length) linesToMove[linesToMove.length - 1] = to;
      at = to;
    }
    cm.operation(function () {
      for (var i = 0; i < linesToMove.length; i += 2) {
        var from = linesToMove[i],
            to = linesToMove[i + 1];
        var line = cm.getLine(from);
        cm.replaceRange("", Pos(from, 0), Pos(from + 1, 0), "+swapLine");
        if (to > cm.lastLine()) cm.replaceRange("\n" + line, Pos(cm.lastLine()), null, "+swapLine");else cm.replaceRange(line + "\n", Pos(to, 0), null, "+swapLine");
      }
      cm.setSelections(newSels);
      cm.scrollIntoView();
    });
  };

  cmds[map[swapLineCombo + "Down"] = "swapLineDown"] = function (cm) {
    if (cm.isReadOnly()) return CodeMirror.Pass;
    var ranges = cm.listSelections(),
        linesToMove = [],
        at = cm.lastLine() + 1;
    for (var i = ranges.length - 1; i >= 0; i--) {
      var range = ranges[i],
          from = range.to().line + 1,
          to = range.from().line;
      if (range.to().ch == 0 && !range.empty()) from--;
      if (from < at) linesToMove.push(from, to);else if (linesToMove.length) linesToMove[linesToMove.length - 1] = to;
      at = to;
    }
    cm.operation(function () {
      for (var i = linesToMove.length - 2; i >= 0; i -= 2) {
        var from = linesToMove[i],
            to = linesToMove[i + 1];
        var line = cm.getLine(from);
        if (from == cm.lastLine()) cm.replaceRange("", Pos(from - 1), Pos(from), "+swapLine");else cm.replaceRange("", Pos(from, 0), Pos(from + 1, 0), "+swapLine");
        cm.replaceRange(line + "\n", Pos(to, 0), null, "+swapLine");
      }
      cm.scrollIntoView();
    });
  };

  cmds[map[ctrl + "/"] = "toggleCommentIndented"] = function (cm) {
    cm.toggleComment({ indent: true });
  };

  cmds[map[ctrl + "J"] = "joinLines"] = function (cm) {
    var ranges = cm.listSelections(),
        joined = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i],
          from = range.from();
      var start = from.line,
          end = range.to().line;
      while (i < ranges.length - 1 && ranges[i + 1].from().line == end) {
        end = ranges[++i].to().line;
      }joined.push({ start: start, end: end, anchor: !range.empty() && from });
    }
    cm.operation(function () {
      var offset = 0,
          ranges = [];
      for (var i = 0; i < joined.length; i++) {
        var obj = joined[i];
        var anchor = obj.anchor && Pos(obj.anchor.line - offset, obj.anchor.ch),
            head;
        for (var line = obj.start; line <= obj.end; line++) {
          var actual = line - offset;
          if (line == obj.end) head = Pos(actual, cm.getLine(actual).length + 1);
          if (actual < cm.lastLine()) {
            cm.replaceRange(" ", Pos(actual), Pos(actual + 1, /^\s*/.exec(cm.getLine(actual + 1))[0].length));
            ++offset;
          }
        }
        ranges.push({ anchor: anchor || head, head: head });
      }
      cm.setSelections(ranges, 0);
    });
  };

  cmds[map["Shift-" + ctrl + "D"] = "duplicateLine"] = function (cm) {
    cm.operation(function () {
      var rangeCount = cm.listSelections().length;
      for (var i = 0; i < rangeCount; i++) {
        var range = cm.listSelections()[i];
        if (range.empty()) cm.replaceRange(cm.getLine(range.head.line) + "\n", Pos(range.head.line, 0));else cm.replaceRange(cm.getRange(range.from(), range.to()), range.from());
      }
      cm.scrollIntoView();
    });
  };

  map[ctrl + "T"] = "transposeChars";

  function sortLines(cm, caseSensitive) {
    if (cm.isReadOnly()) return CodeMirror.Pass;
    var ranges = cm.listSelections(),
        toSort = [],
        selected;
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      if (range.empty()) continue;
      var from = range.from().line,
          to = range.to().line;
      while (i < ranges.length - 1 && ranges[i + 1].from().line == to) {
        to = range[++i].to().line;
      }toSort.push(from, to);
    }
    if (toSort.length) selected = true;else toSort.push(cm.firstLine(), cm.lastLine());

    cm.operation(function () {
      var ranges = [];
      for (var i = 0; i < toSort.length; i += 2) {
        var from = toSort[i],
            to = toSort[i + 1];
        var start = Pos(from, 0),
            end = Pos(to);
        var lines = cm.getRange(start, end, false);
        if (caseSensitive) lines.sort();else lines.sort(function (a, b) {
          var au = a.toUpperCase(),
              bu = b.toUpperCase();
          if (au != bu) {
            a = au;b = bu;
          }
          return a < b ? -1 : a == b ? 0 : 1;
        });
        cm.replaceRange(lines, start, end);
        if (selected) ranges.push({ anchor: start, head: end });
      }
      if (selected) cm.setSelections(ranges, 0);
    });
  }

  cmds[map["F9"] = "sortLines"] = function (cm) {
    sortLines(cm, true);
  };
  cmds[map[ctrl + "F9"] = "sortLinesInsensitive"] = function (cm) {
    sortLines(cm, false);
  };

  cmds[map["F2"] = "nextBookmark"] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks) while (marks.length) {
      var current = marks.shift();
      var found = current.find();
      if (found) {
        marks.push(current);
        return cm.setSelection(found.from, found.to);
      }
    }
  };

  cmds[map["Shift-F2"] = "prevBookmark"] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks) while (marks.length) {
      marks.unshift(marks.pop());
      var found = marks[marks.length - 1].find();
      if (!found) marks.pop();else return cm.setSelection(found.from, found.to);
    }
  };

  cmds[map[ctrl + "F2"] = "toggleBookmark"] = function (cm) {
    var ranges = cm.listSelections();
    var marks = cm.state.sublimeBookmarks || (cm.state.sublimeBookmarks = []);
    for (var i = 0; i < ranges.length; i++) {
      var from = ranges[i].from(),
          to = ranges[i].to();
      var found = cm.findMarks(from, to);
      for (var j = 0; j < found.length; j++) {
        if (found[j].sublimeBookmark) {
          found[j].clear();
          for (var k = 0; k < marks.length; k++) {
            if (marks[k] == found[j]) marks.splice(k--, 1);
          }break;
        }
      }
      if (j == found.length) marks.push(cm.markText(from, to, { sublimeBookmark: true, clearWhenEmpty: false }));
    }
  };

  cmds[map["Shift-" + ctrl + "F2"] = "clearBookmarks"] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks) for (var i = 0; i < marks.length; i++) {
      marks[i].clear();
    }marks.length = 0;
  };

  cmds[map["Alt-F2"] = "selectBookmarks"] = function (cm) {
    var marks = cm.state.sublimeBookmarks,
        ranges = [];
    if (marks) for (var i = 0; i < marks.length; i++) {
      var found = marks[i].find();
      if (!found) marks.splice(i--, 0);else ranges.push({ anchor: found.from, head: found.to });
    }
    if (ranges.length) cm.setSelections(ranges, 0);
  };

  map["Alt-Q"] = "wrapLines";

  var cK = ctrl + "K ";

  function modifyWordOrSelection(cm, mod) {
    cm.operation(function () {
      var ranges = cm.listSelections(),
          indices = [],
          replacements = [];
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.empty()) {
          indices.push(i);replacements.push("");
        } else replacements.push(mod(cm.getRange(range.from(), range.to())));
      }
      cm.replaceSelections(replacements, "around", "case");
      for (var i = indices.length - 1, at; i >= 0; i--) {
        var range = ranges[indices[i]];
        if (at && CodeMirror.cmpPos(range.head, at) > 0) continue;
        var word = wordAt(cm, range.head);
        at = word.from;
        cm.replaceRange(mod(word.word), word.from, word.to);
      }
    });
  }

  map[cK + ctrl + "Backspace"] = "delLineLeft";

  cmds[map["Backspace"] = "smartBackspace"] = function (cm) {
    if (cm.somethingSelected()) return CodeMirror.Pass;

    cm.operation(function () {
      var cursors = cm.listSelections();
      var indentUnit = cm.getOption("indentUnit");

      for (var i = cursors.length - 1; i >= 0; i--) {
        var cursor = cursors[i].head;
        var toStartOfLine = cm.getRange({ line: cursor.line, ch: 0 }, cursor);
        var column = CodeMirror.countColumn(toStartOfLine, null, cm.getOption("tabSize"));

        // Delete by one character by default
        var deletePos = cm.findPosH(cursor, -1, "char", false);

        if (toStartOfLine && !/\S/.test(toStartOfLine) && column % indentUnit == 0) {
          var prevIndent = new Pos(cursor.line, CodeMirror.findColumn(toStartOfLine, column - indentUnit, indentUnit));

          // Smart delete only if we found a valid prevIndent location
          if (prevIndent.ch != cursor.ch) deletePos = prevIndent;
        }

        cm.replaceRange("", deletePos, cursor, "+delete");
      }
    });
  };

  cmds[map[cK + ctrl + "K"] = "delLineRight"] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = ranges.length - 1; i >= 0; i--) {
        cm.replaceRange("", ranges[i].anchor, Pos(ranges[i].to().line), "+delete");
      }cm.scrollIntoView();
    });
  };

  cmds[map[cK + ctrl + "U"] = "upcaseAtCursor"] = function (cm) {
    modifyWordOrSelection(cm, function (str) {
      return str.toUpperCase();
    });
  };
  cmds[map[cK + ctrl + "L"] = "downcaseAtCursor"] = function (cm) {
    modifyWordOrSelection(cm, function (str) {
      return str.toLowerCase();
    });
  };

  cmds[map[cK + ctrl + "Space"] = "setSublimeMark"] = function (cm) {
    if (cm.state.sublimeMark) cm.state.sublimeMark.clear();
    cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
  };
  cmds[map[cK + ctrl + "A"] = "selectToSublimeMark"] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found) cm.setSelection(cm.getCursor(), found);
  };
  cmds[map[cK + ctrl + "W"] = "deleteToSublimeMark"] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found) {
      var from = cm.getCursor(),
          to = found;
      if (CodeMirror.cmpPos(from, to) > 0) {
        var tmp = to;to = from;from = tmp;
      }
      cm.state.sublimeKilled = cm.getRange(from, to);
      cm.replaceRange("", from, to);
    }
  };
  cmds[map[cK + ctrl + "X"] = "swapWithSublimeMark"] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found) {
      cm.state.sublimeMark.clear();
      cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
      cm.setCursor(found);
    }
  };
  cmds[map[cK + ctrl + "Y"] = "sublimeYank"] = function (cm) {
    if (cm.state.sublimeKilled != null) cm.replaceSelection(cm.state.sublimeKilled, null, "paste");
  };

  map[cK + ctrl + "G"] = "clearBookmarks";
  cmds[map[cK + ctrl + "C"] = "showInCenter"] = function (cm) {
    var pos = cm.cursorCoords(null, "local");
    cm.scrollTo(null, (pos.top + pos.bottom) / 2 - cm.getScrollInfo().clientHeight / 2);
  };

  var selectLinesCombo = mac ? "Ctrl-Shift-" : "Ctrl-Alt-";
  cmds[map[selectLinesCombo + "Up"] = "selectLinesUpward"] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.head.line > cm.firstLine()) cm.addSelection(Pos(range.head.line - 1, range.head.ch));
      }
    });
  };
  cmds[map[selectLinesCombo + "Down"] = "selectLinesDownward"] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.head.line < cm.lastLine()) cm.addSelection(Pos(range.head.line + 1, range.head.ch));
      }
    });
  };

  function getTarget(cm) {
    var from = cm.getCursor("from"),
        to = cm.getCursor("to");
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word) return;
      from = word.from;
      to = word.to;
    }
    return { from: from, to: to, query: cm.getRange(from, to), word: word };
  }

  function findAndGoTo(cm, forward) {
    var target = getTarget(cm);
    if (!target) return;
    var query = target.query;
    var cur = cm.getSearchCursor(query, forward ? target.to : target.from);

    if (forward ? cur.findNext() : cur.findPrevious()) {
      cm.setSelection(cur.from(), cur.to());
    } else {
      cur = cm.getSearchCursor(query, forward ? Pos(cm.firstLine(), 0) : cm.clipPos(Pos(cm.lastLine())));
      if (forward ? cur.findNext() : cur.findPrevious()) cm.setSelection(cur.from(), cur.to());else if (target.word) cm.setSelection(target.from, target.to);
    }
  };
  cmds[map[ctrl + "F3"] = "findUnder"] = function (cm) {
    findAndGoTo(cm, true);
  };
  cmds[map["Shift-" + ctrl + "F3"] = "findUnderPrevious"] = function (cm) {
    findAndGoTo(cm, false);
  };
  cmds[map["Alt-F3"] = "findAllUnder"] = function (cm) {
    var target = getTarget(cm);
    if (!target) return;
    var cur = cm.getSearchCursor(target.query);
    var matches = [];
    var primaryIndex = -1;
    while (cur.findNext()) {
      matches.push({ anchor: cur.from(), head: cur.to() });
      if (cur.from().line <= target.from.line && cur.from().ch <= target.from.ch) primaryIndex++;
    }
    cm.setSelections(matches, primaryIndex);
  };

  map["Shift-" + ctrl + "["] = "fold";
  map["Shift-" + ctrl + "]"] = "unfold";
  map[cK + ctrl + "0"] = map[cK + ctrl + "j"] = "unfoldAll";

  map[ctrl + "I"] = "findIncremental";
  map["Shift-" + ctrl + "I"] = "findIncrementalReverse";
  map[ctrl + "H"] = "replace";
  map["F3"] = "findNext";
  map["Shift-F3"] = "findPrev";

  CodeMirror.normalizeKeyMap(map);
});
'use strict';

/**
 *
 * @description datatable组件，数据表格
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.datatable', []).directive('muDatatable', muDatatableDirective);

muDatatableDirective.$inject = [];

function muDatatableDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-datable组件</h2>'
  };
}
'use strict';

/**
 *
 * @description dialog组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.dialog', []).directive('muDialog', muDialogDirective);

muDialogDirective.$inject = [];

function muDialogDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-dialog组件</h2>'
  };
}
'use strict';

/**
 *
 * @description markdown组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 * @usage <mu-markdown ng-model='your scope property' content='your markdown content'></mu-markdown>
 * ng-model: 可以动态改变markdown文本
 * content: 静态内容，如果ng-model的值有效，则会显示ng-model的值得内容
 */

angular.module('matrixui.components.markdown', []).directive('muMarkdown', muMarkdowndDirective);

muMarkdowndDirective.$inject = [];

function muMarkdowndDirective() {

  return {
    restrict: 'E',
    template: '\n      <div class=\'markdown-body\'>\n        <div ng-transclude></div>\n      </div>\n    ',
    transclude: true,
    scope: true,
    link: muMarkdownLink
  };

  /**
   *
   * @description muMarkdown指令的Link函数
   * @param {object} scope 指令的$scope对象
   * @param {object} element 指令对应的jqlite元素对象
   * @param {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   */

  function muMarkdownLink(scope, element, attrs) {

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    /* 提取要显示的content的值，ng-model的重要性高于content */

    var content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name];
    } else {
      scope.$parent[scope.name] = '';
    }
    scope.content = content;

    /* 把渲染出来的html插入页面 */

    element.find('div').html(markdownToHTML(scope.content));

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */

    if (scope.name) {
      scope.$parent.$watch(scope.name, function () {
        var content = scope.$parent[scope.name];

        if (!content) {
          content = scope.content;
        }

        /* 如果MathJax存在，则开始渲染，否则直到MathJax加载完毕才开始渲染 */

        function initMarkdown() {
          insertHTML(content);
          MathJax.Hub.Typeset(element[0]);
        }

        if (window.MathJax) {
          try {
            initMarkdown();
          } catch (e) {
            console.warn('markdown warn: 给定的数据暂时无法渲染，等待数据更新...');
          }
        } else {
          throw Error('MathJax没有加载');
        }
      });
    }

    function insertHTML(content) {
      element.find('div').html(markdownToHTML(content));
    }
  }

  /**
   *
   * @description 将markdown文本渲染成html字符串
   * @param {string} content 需要渲染的markdown文本
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function markdownToHTML(content) {
    if (window.marked) {
      if (hljs) {
        marked.setOptions({
          highlight: function highlight(code) {
            return hljs.highlightAuto(code).value;
          }
        });
      }
      return marked(content);
    } else {
      throw Error('marked is not defined');
    }
  }
};
'use strict';

/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.mdeditor', []).directive('muMdeditor', muMdeditorDirective);

muMdeditorDirective.$inject = [];

function muMdeditorDirective() {

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    template: '<textarea style="display: none;"></textarea>',
    link: muMdeditorLink
  };

  function muMdeditorLink(scope, element, attrs) {

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    var content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name];
    } else {
      scope.$parent[scope.name] = '';
    }
    scope.content = content;

    if (scope.name) {
      scope.$parent.$watch(scope.name, function () {
        if (scope.mde) {
          scope.mde.value(scope.$parent[scope.name]);
        }
      });
    }

    if (window.SimpleMDE) {
      initMDE();
    } else {
      throw Error('mu-mdeditor error: SimpleMDE没有加载');
    }

    /**
     *
     * @description SimpleMDE的渲染函数
     * @param {string} plainText 编辑器里面的markdown文本
     * @param {object} preview 预览区域的dom对象
     * @author 吴家荣 <jiarongwu.se@foxmail.com>
     *
     */

    function previewRender(plainText, preview) {
      angular.element(preview).addClass('markdown-body');

      insertHTML(plainText, preview);
      MathJax.Hub.Typeset(preview);

      return preview.innerHTML;
    }

    /**
     *
     * @description 创建SimpleMDE实例
     * @author 吴家荣 <jiarongwu.se@foxmail.com>
     *
     */

    function initMDE() {
      var type = attrs.type || 'simple';
      var toolbar = null;

      /* 不同的类型，具有不同的toolbar */

      if (type === 'full') {
        toolbar = getFullToolbar();
      } else {
        toolbar = getSimpleToolbar();
      }

      /* 创建SimpleMDE实例 */

      scope.mde = new SimpleMDE({
        spellChecker: false,
        element: element.find('textarea')[0],
        toolbar: toolbar,
        previewRender: previewRender,
        tabSize: 2
      });

      /* 如果提供了content，则把编辑器的值设置为content的值 */

      if (attrs.content) {
        scope.mde.value(attrs.content);
      }
    }
  }

  /**
   *
   * @description 返回full类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getFullToolbar() {
    var toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'];

    return toolbar;
  }

  /**
   *
   * @description 返回simple类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getSimpleToolbar() {
    var toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', '|', 'guide'];

    return toolbar;
  }

  /**
   *
   * @description 渲染markdown文本成HTML，并插入到指定的dom中
   * @param {string} content markdown文本
   * @param {object} dom 对应的dom对象
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertHTML(content, dom) {
    angular.element(dom).html(markdownToHTML(content));
  }

  /**
   *
   * @description 渲染markdown文本
   * @param {string} content markdown文本
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function markdownToHTML(content) {
    if (window.marked) {
      if (hljs) {
        marked.setOptions({
          highlight: function highlight(code) {
            return hljs.highlightAuto(code).value;
          }
        });
      }
      return marked(content);
    } else {
      throw Error('marked is not defined');
    }
  }
}
'use strict';

/**
 *
 * @description panel组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.panel', []).directive('muPanel', muPanelDirective);

muPanelDirective.$inject = [];

function muPanelDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-panel组件</h2>'
  };
}
'use strict';

/**
 *
 * @description radio组件，单选框
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.radio', []).directive('muRadio', muRadioDirective);

muRadioDirective.$inject = [];

function muRadioDirective() {

  function initAttrs(element, attrs) {
    var target = angular.element(element);
    var id = attrs.name + '-' + attrs.value;
    target.attr('for', id);
    target.find('input').attr('id', id);
    target.find('input').attr('name', attrs.name);
    target.find('input').attr('value', attrs.value);
    setSize(element, attrs.size);
  }

  function setSize(element, size) {
    var target = angular.element(element);
    var label = target.find('label')[0];
    label.classList.add(size);
    element[0].classList.add(size);
  }

  function initEvent(element) {
    var target = angular.element(element);
    target[0].addEventListener('click', function (e) {
      console.log('click');
      target.find('input').attr('checked', true);
    });
  }

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="radio"><input type="radio" class="regular-radio"></input><label></label></div>',
    link: function link(scope, element, attrs) {
      initAttrs(element, attrs);
      initEvent(element);
    }
  };
}
'use strict';

/**
 *
 * @description select组件，基于 angular.selector:https://github.com/indrimuska/angular-selector
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.select', []).run(muSelectRun).directive('muSelect', muSelectDirective);

muSelectRun.$inject = ['$templateCache'];

function muSelectRun($templateCache) {
  $templateCache.put('selector/selector.html', '<div class="selector-container" ng-attr-dir="{{rtl ? \'rtl\' : \'ltr\'}}" ' + 'ng-class="{open: isOpen, empty: !filteredOptions.length && (!create || !search), multiple: multiple, \'has-value\': hasValue(), rtl: rtl, ' + 'loading: loading, \'remove-button\': removeButton, disabled: disabled}">' + '<select name="{{name}}" ng-hide="true" ng-required="required && !hasValue()" ' + 'ng-model="selectedValues" multiple ng-options="option as getObjValue(option, labelAttr) for option in selectedValues"></select>' + '<label class="selector-input">' + '<ul class="selector-values">' + '<li ng-repeat="(index, option) in selectedValues track by index">' + '<div ng-include="viewItemTemplate"></div>' + '<div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">' + '<span class="selector-icon"></span>' + '</div>' + '</li>' + '</ul>' + '<input ng-model="search" placeholder="{{!hasValue() ? placeholder : \'\'}}" ng-model-options="{debounce: debounce}"' + 'ng-disabled="disabled" ng-readonly="disableSearch" ng-required="required && !hasValue()" autocomplete="off">' + '<div ng-if="!multiple || loading" class="selector-helper selector-global-helper" ng-click="!disabled && removeButton && unset()">' + '<span class="selector-icon"></span>' + '</div>' + '</label>' + '<ul class="selector-dropdown" ng-show="filteredOptions.length > 0 || (create && search)">' + '<li class="selector-option create" ng-class="{active: highlighted == -1}" ng-if="create && search" ' + 'ng-include="dropdownCreateTemplate" ng-mouseover="highlight(-1)" ng-click="createOption(search)"></li>' + '<li ng-repeat-start="(index, option) in filteredOptions track by index" class="selector-optgroup" ' + 'ng-include="dropdownGroupTemplate" ng-show="groupAttr && ' + '(getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))"></li>' + '<li ng-repeat-end ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}" class="selector-option" ' + 'ng-include="dropdownItemTemplate" ng-mouseover="highlight(index)" ng-click="set()"></li>' + '</ul>' + '</div>');
  $templateCache.put('selector/item-create.html', 'Add <i ng-bind="search"></i>');
  $templateCache.put('selector/item-default.html', '<span ng-bind="getObjValue(option, labelAttr) || option"></span>');
  $templateCache.put('selector/group-default.html', '<span ng-bind="getObjValue(option, groupAttr)"></span>');
}

var Selector = null;

muSelectDirective.$inject = ['$filter', '$timeout', '$window', '$http', '$q'];

function muSelectDirective($filter, $timeout, $window, $http, $q) {
  return new Selector($filter, $timeout, $window, $http, $q);
}

Selector = function () {

  // Key codes
  var KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13, backspace: 8, delete: 46, shift: 16, leftCmd: 91, rightCmd: 93, ctrl: 17, alt: 18, tab: 9 };

  var $filter = void 0,
      $timeout = void 0,
      $window = void 0,
      $http = void 0,
      $q = void 0;

  function getStyles(element) {
    return !(element instanceof HTMLElement) ? {} : element.ownerDocument && element.ownerDocument.defaultView.opener ? element.ownerDocument.defaultView.getComputedStyle(element) : window.getComputedStyle(element);
  }

  // Selector directive
  function Selector(filter, timeout, window, http, q) {
    this.restrict = 'EAC';
    this.replace = true;
    this.transclude = true;
    this.scope = {
      name: '@?',
      value: '=model',
      disabled: '=?disable',
      disableSearch: '=?',
      required: '=?require',
      multiple: '=?multi',
      placeholder: '@?',
      valueAttr: '@',
      labelAttr: '@?',
      groupAttr: '@?',
      options: '=?',
      debounce: '=?',
      create: '&?',
      limit: '=?',
      rtl: '=?',
      api: '=?',
      change: '&?',
      remote: '&?',
      remoteParam: '@?',
      remoteValidation: '&?',
      remoteValidationParam: '@?',
      removeButton: '=?',
      softDelete: '=?',
      closeAfterSelection: '=?',
      viewItemTemplate: '=?',
      dropdownItemTemplate: '=?',
      dropdownCreateTemplate: '=?',
      dropdownGroupTemplate: '=?'
    };
    this.templateUrl = 'selector/selector.html';
    $filter = filter;
    $timeout = timeout;
    $window = window;
    $http = http;
    $q = q;
  }
  Selector.prototype.$inject = ['$filter', '$timeout', '$window', '$http', '$q'];
  Selector.prototype.link = function (scope, element, attrs, controller, transclude) {
    transclude(scope, function (clone, scope) {
      var filter = $filter('filter'),
          input = angular.element(element[0].querySelector('.selector-input input')),
          dropdown = angular.element(element[0].querySelector('.selector-dropdown')),
          inputCtrl = input.controller('ngModel'),
          selectCtrl = element.find('select').controller('ngModel'),
          initDeferred = $q.defer(),
          defaults = {
        api: {},
        search: '',
        disableSearch: false,
        selectedValues: [],
        highlighted: 0,
        valueAttr: null,
        labelAttr: 'label',
        groupAttr: 'group',
        options: [],
        debounce: 0,
        limit: Infinity,
        remoteParam: 'q',
        remoteValidationParam: 'value',
        removeButton: true,
        viewItemTemplate: 'selector/item-default.html',
        dropdownItemTemplate: 'selector/item-default.html',
        dropdownCreateTemplate: 'selector/item-create.html',
        dropdownGroupTemplate: 'selector/group-default.html'
      };

      // Default attributes
      if (!angular.isDefined(scope.value) && scope.multiple) scope.value = [];
      angular.forEach(defaults, function (value, key) {
        if (!angular.isDefined(scope[key])) scope[key] = value;
      });
      angular.forEach(['name', 'valueAttr', 'labelAttr'], function (attr) {
        if (!attrs[attr]) attrs[attr] = scope[attr];
      });

      // Options' utilities
      scope.getObjValue = function (obj, path) {
        var key;
        if (!angular.isDefined(obj) || !angular.isDefined(path)) return obj;
        path = angular.isArray(path) ? path : path.split('.');
        key = path.shift();

        if (key.indexOf('[') > 0) {
          var match = key.match(/(\w+)\[(\d+)\]/);
          if (match !== null) {
            obj = obj[match[1]];
            key = match[2];
          }
        }
        return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
      };
      scope.setObjValue = function (obj, path, value) {
        var key;
        if (!angular.isDefined(obj)) obj = {};
        path = angular.isArray(path) ? path : path.split('.');
        key = path.shift();

        if (key.indexOf('[') > 0) {
          var match = key.match(/(\w+)\[(\d+)\]/);
          if (match !== null) {
            obj = obj[match[1]];
            key = match[2];
          }
        }
        obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
        return obj;
      };
      scope.optionValue = function (option) {
        return scope.valueAttr == null ? option : scope.getObjValue(option, scope.valueAttr);
      };
      scope.optionEquals = function (option, value) {
        return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
      };

      // Value utilities
      scope.setValue = function (value) {
        if (!scope.multiple) scope.value = scope.valueAttr == null ? value : scope.getObjValue(value || {}, scope.valueAttr);else scope.value = scope.valueAttr == null ? value || [] : (value || []).map(function (option) {
          return scope.getObjValue(option, scope.valueAttr);
        });
      };
      scope.hasValue = function () {
        return scope.multiple ? (scope.value || []).length > 0 : !!scope.value;
      };

      // Remote fetching
      scope.request = function (paramName, paramValue, remote, remoteParam) {
        var promise,
            remoteOptions = {};
        if (scope.disabled) return $q.reject();
        if (!angular.isDefined(remote)) throw 'Remote attribute is not defined';

        scope.loading = true;
        scope.options = [];
        remoteOptions[paramName] = paramValue;
        promise = remote(remoteOptions);
        if (typeof promise.then !== 'function') {
          var settings = { method: 'GET', cache: true, params: {} };
          angular.extend(settings, promise);
          angular.extend(settings.params, promise.params);
          settings.params[remoteParam] = paramValue;
          promise = $http(settings);
        }
        promise.then(function (data) {
          scope.options = data.data || data;
          scope.filterOptions();
          scope.loading = false;
          initDeferred.resolve();
        }, function (error) {
          scope.loading = false;
          initDeferred.reject();
          throw 'Error while fetching data: ' + (error.message || error);
        });
        return promise;
      };
      scope.fetch = function () {
        return scope.request('search', scope.search || '', scope.remote, scope.remoteParam);
      };
      scope.fetchValidation = function (value) {
        return scope.request('value', value, scope.remoteValidation, scope.remoteValidationParam);
      };
      if (!angular.isDefined(scope.remote)) {
        scope.remote = false;
        scope.remoteValidation = false;
        initDeferred.resolve();
      } else if (!angular.isDefined(scope.remoteValidation)) scope.remoteValidation = false;
      if (scope.remote) $timeout(function () {
        $q.when(!scope.hasValue() || !scope.remoteValidation ? angular.noop : scope.fetchValidation(scope.value)).then(function () {
          scope.$watch('search', function () {
            $timeout(scope.fetch);
          });
        });
      });

      // Fill with options in the select
      scope.optionToObject = function (option, group) {
        var object = {},
            element = angular.element(option);

        angular.forEach(option.dataset, function (value, key) {
          if (!key.match(/^\$/)) object[key] = value;
        });
        if (option.value) scope.setObjValue(object, scope.valueAttr || 'value', option.value);
        if (element.text()) scope.setObjValue(object, scope.labelAttr, element.text().trim());
        if (angular.isDefined(group)) scope.setObjValue(object, scope.groupAttr, group);
        scope.options.push(object);

        if (element.attr('selected') && (scope.multiple || !scope.hasValue())) if (!scope.multiple) {
          if (!scope.value) scope.value = scope.optionValue(object);
        } else {
          if (!scope.value) scope.value = [];
          scope.value.push(scope.optionValue(object));
        }
      };
      scope.fillWithHtml = function () {
        scope.options = [];
        angular.forEach(clone, function (element) {
          var tagName = (element.tagName || '').toLowerCase();

          if (tagName == 'option') scope.optionToObject(element);
          if (tagName == 'optgroup') {
            angular.forEach(element.querySelectorAll('option'), function (option) {
              scope.optionToObject(option, (element.attributes.label || {}).value);
            });
          }
        });
        scope.updateSelected();
      };

      // Initialization
      scope.initialize = function () {
        if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length)) scope.fillWithHtml();
        if (scope.hasValue()) {
          if (!scope.multiple) {
            if (angular.isArray(scope.value)) scope.value = scope.value[0];
          } else {
            if (!angular.isArray(scope.value)) scope.value = [scope.value];
          }
          scope.updateSelected();
          scope.filterOptions();
          scope.updateValue();
        }
      };
      scope.$watch('multiple', function () {
        $timeout(scope.setInputWidth);
        initDeferred.promise.then(scope.initialize, scope.initialize);
      });

      // Dropdown utilities
      scope.dropdownPosition = function () {
        var label = input.parent()[0],
            styles = getStyles(label),
            marginTop = parseFloat(styles.marginTop || 0),
            marginLeft = parseFloat(styles.marginLeft || 0);

        dropdown.css({
          top: label.offsetTop + label.offsetHeight + marginTop + 'px',
          left: label.offsetLeft + marginLeft + 'px',
          width: label.offsetWidth + 'px'
        });
      };
      scope.open = function () {
        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;
        scope.isOpen = true;
        scope.dropdownPosition();
        $timeout(scope.scrollToHighlighted);
      };
      scope.close = function () {
        scope.isOpen = false;
        scope.resetInput();
        if (scope.remote) $timeout(scope.fetch);
      };
      scope.decrementHighlighted = function () {
        scope.highlight(scope.highlighted - 1);
        scope.scrollToHighlighted();
      };
      scope.incrementHighlighted = function () {
        scope.highlight(scope.highlighted + 1);
        scope.scrollToHighlighted();
      };
      scope.highlight = function (index) {
        if (attrs.create && scope.search && index == -1) scope.highlighted = -1;else if (scope.filteredOptions.length) scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
      };
      scope.scrollToHighlighted = function () {
        var dd = dropdown[0],
            option = dd.querySelectorAll('li.selector-option')[scope.highlighted],
            styles = getStyles(option),
            marginTop = parseFloat(styles.marginTop || 0),
            marginBottom = parseFloat(styles.marginBottom || 0);

        if (!scope.filteredOptions.length) return;

        if (option.offsetTop + option.offsetHeight + marginBottom > dd.scrollTop + dd.offsetHeight) $timeout(function () {
          dd.scrollTop = option.offsetTop + option.offsetHeight + marginBottom - dd.offsetHeight;
        });

        if (option.offsetTop - marginTop < dd.scrollTop) $timeout(function () {
          dd.scrollTop = option.offsetTop - marginTop;
        });
      };
      scope.createOption = function (value) {
        $q.when(function () {
          var option = {};
          if (angular.isFunction(scope.create)) {
            option = scope.create({ input: value });
          } else {
            scope.setObjValue(option, scope.labelAttr, value);
            scope.setObjValue(option, scope.valueAttr || 'value', value);
          }
          return option;
        }()).then(function (option) {
          scope.options.push(option);
          scope.set(option);
        });
      };
      scope.set = function (option) {
        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;

        if (!angular.isDefined(option)) option = scope.filteredOptions[scope.highlighted];

        if (!scope.multiple) scope.selectedValues = [option];else {
          if (!scope.selectedValues) scope.selectedValues = [];
          if (scope.selectedValues.indexOf(option) < 0) scope.selectedValues.push(option);
        }
        if (!scope.multiple || scope.closeAfterSelection || (scope.selectedValues || []).length >= scope.limit) scope.close();
        scope.resetInput();
        selectCtrl.$setDirty();
      };
      scope.unset = function (index) {
        if (!scope.multiple) scope.selectedValues = [];else scope.selectedValues.splice(angular.isDefined(index) ? index : scope.selectedValues.length - 1, 1);
        scope.resetInput();
        selectCtrl.$setDirty();
      };
      scope.keydown = function (e) {
        switch (e.keyCode) {
          case KEYS.up:
            if (!scope.isOpen) break;
            scope.decrementHighlighted();
            e.preventDefault();
            break;
          case KEYS.down:
            if (!scope.isOpen) scope.open();else scope.incrementHighlighted();
            e.preventDefault();
            break;
          case KEYS.escape:
            scope.highlight(0);
            scope.close();
            break;
          case KEYS.enter:
            if (scope.isOpen) {
              if (attrs.create && scope.search && scope.highlighted == -1) scope.createOption(e.target.value);else if (scope.filteredOptions.length) scope.set();
              e.preventDefault();
            }
            break;
          case KEYS.backspace:
            if (!input.val()) {
              var search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
              scope.unset();
              scope.open();
              if (scope.softDelete && !scope.disableSearch) $timeout(function () {
                scope.search = search;
              });
              e.preventDefault();
            }
            break;
          case KEYS.left:
          case KEYS.right:
          case KEYS.shift:
          case KEYS.ctrl:
          case KEYS.alt:
          case KEYS.tab:
          case KEYS.leftCmd:
          case KEYS.rightCmd:
            break;
          default:
            if (!scope.multiple && scope.hasValue()) {
              e.preventDefault();
            } else {
              scope.open();
              scope.highlight(0);
            }
            break;
        }
      };

      // Filtered options
      scope.inOptions = function (options, value) {
        // if options are fetched from a remote source, it's not possibile to use
        // the simplest check with native `indexOf` function, beacause every object
        // in the results array has it own new address
        if (scope.remote) return options.filter(function (option) {
          return angular.equals(value, option);
        }).length > 0;else return options.indexOf(value) >= 0;
      };
      scope.filterOptions = function () {
        scope.filteredOptions = filter(scope.options || [], scope.search);
        if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
        if (scope.multiple) scope.filteredOptions = scope.filteredOptions.filter(function (option) {
          return !scope.inOptions(scope.selectedValues, option);
        });else {
          var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
          if (index >= 0) scope.highlight(index);
        }
      };

      // Input width utilities
      scope.measureWidth = function () {
        var width,
            styles = getStyles(input[0]),
            shadow = angular.element('<span class="selector-shadow"></span>');
        shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
        angular.element(document.body).append(shadow);
        angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
          shadow.css(style, styles[style]);
        });
        width = shadow[0].offsetWidth;
        shadow.remove();
        return width;
      };
      scope.setInputWidth = function () {
        var width = scope.measureWidth() + 1;
        input.css('width', width + 'px');
      };
      scope.resetInput = function () {
        input.val('');
        scope.setInputWidth();
        $timeout(function () {
          scope.search = '';
        });
      };

      scope.$watch('[search, options, value]', function () {
        // hide selected items
        scope.filterOptions();
        $timeout(function () {
          // set input width
          scope.setInputWidth();
          // repositionate dropdown
          if (scope.isOpen) scope.dropdownPosition();
        });
      }, true);

      // Update value
      scope.updateValue = function (origin) {
        if (!angular.isDefined(origin)) origin = scope.selectedValues || [];
        scope.setValue(!scope.multiple ? origin[0] : origin);
      };
      scope.$watch('selectedValues', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) return;
        scope.updateValue();
        if (angular.isFunction(scope.change)) scope.change(scope.multiple ? { newValue: newValue, oldValue: oldValue } : { newValue: (newValue || [])[0], oldValue: (oldValue || [])[0] });
      }, true);
      scope.$watchCollection('options', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue) || scope.remote) return;
        scope.updateSelected();
      });

      // Update selected values
      scope.updateSelected = function () {
        if (!scope.multiple) scope.selectedValues = (scope.options || []).filter(function (option) {
          return scope.optionEquals(option);
        }).slice(0, 1);else scope.selectedValues = (scope.value || []).map(function (value) {
          return filter(scope.options, function (option) {
            return scope.optionEquals(option, value);
          })[0];
        }).filter(function (value) {
          return angular.isDefined(value);
        }).slice(0, scope.limit);
      };
      scope.$watch('value', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) return;
        $q.when(!scope.remote || !scope.remoteValidation || !scope.hasValue() ? angular.noop : scope.fetchValidation(newValue)).then(function () {
          scope.updateSelected();
          scope.filterOptions();
          scope.updateValue();
        });
      }, true);

      // DOM event listeners
      input = angular.element(element[0].querySelector('.selector-input input')).on('focus', function () {
        $timeout(function () {
          scope.$apply(scope.open);
        });
      }).on('blur', function () {
        scope.$apply(scope.close);
      }).on('keydown', function (e) {
        scope.$apply(function () {
          scope.keydown(e);
        });
      }).on('input', function () {
        scope.setInputWidth();
      });
      dropdown.on('mousedown', function (e) {
        e.preventDefault();
      });
      angular.element($window).on('resize', function () {
        scope.dropdownPosition();
      });

      // Update select controller
      scope.$watch(function () {
        return inputCtrl.$pristine;
      }, function ($pristine) {
        selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
      });
      scope.$watch(function () {
        return inputCtrl.$touched;
      }, function ($touched) {
        selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
      });

      // Expose APIs
      angular.forEach(['open', 'close', 'fetch'], function (api) {
        scope.api[api] = scope[api];
      });
      scope.api.focus = function () {
        input[0].focus();
      };
      scope.api.set = function (value) {
        return scope.value = value;
      };
      scope.api.unset = function (value) {
        var values = !value ? scope.selectedValues : (scope.selectedValues || []).filter(function (option) {
          return scope.optionEquals(option, value);
        }),
            indexes = scope.selectedValues.map(function (option, index) {
          return scope.inOptions(values, option) ? index : -1;
        }).filter(function (index) {
          return index >= 0;
        });

        angular.forEach(indexes, function (index, i) {
          scope.unset(index - i);
        });
      };
    });
  };

  return Selector;
}();
'use strict';

/**
 *
 * @description spinner组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.spinner', []).directive('muSpinner', muSpinnerDirective);

muSpinnerDirective.$inject = [];

function muSpinnerDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-spinner组件</h2>'
  };
}
'use strict';

/**
 *
 * @description tab组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.tab', []).directive('muTab', muTabDirective);

muTabDirective.$inject = [];

function muTabDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-tab组件</h2>'
  };
}
'use strict';

/**
 *
 * @description report组件过滤器
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */

angular.module('matrixui.specials').filter('formatReportScore', function () {

  var formatReportScore = void 0;
  formatReportScore = function formatReportScore(data) {
    if (data === -1 || data === null) {
      return '正在评测并计算总分，请等候...';
    } else {
      return data;
    }
  };
  return formatReportScore;
});

angular.module('matrixui.specials').filter('formatReportGrade', function () {
  var formatReportGrade = void 0;
  formatReportGrade = function formatReportGrade(data) {
    if (data === undefined || data === null) {
      return '0';
    } else {
      return data;
    }
  };
  return formatReportGrade;
});
angular.module('matrixui.specials').filter('formatReportOutput', function () {

  var formatReportOutput = void 0;
  formatReportOutput = function formatReportOutput(data) {
    if (data === undefined || data === null || data === '') {
      return 'No output.';
    } else {
      return data;
    }
  };
  return formatReportOutput;
});
angular.module('matrixui.specials').filter('formatCheckMessage', function () {

  var formatCheckMessage = void 0;
  formatCheckMessage = function formatCheckMessage(data) {
    if (data === null || data === undefined) {
      return 'Pass.';
    } else {
      return data;
    }
  };
  return formatCheckMessage;
});
angular.module('matrixui.specials').filter('formatSubmissionsGrade', function () {

  var formatSubmissionsGrade = void 0;
  formatSubmissionsGrade = function formatSubmissionsGrade(data) {

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
angular.module('matrixui.specials').filter('formatReportResult', function () {

  var formatReportResult = void 0;
  formatReportResult = function formatReportResult(data) {
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

angular.module('matrixui.specials').filter('deleteSpace', function () {

  var deleteSpace = void 0;
  deleteSpace = function deleteSpace(data) {

    var result = void 0;
    if (data[0] == '/') {
      result = data.slice(5);
    } else {
      result = data;
    }
    var i = 0;
    while (result[i] == ' ') {
      i++;
    }
    return result.slice(i);
  };

  return deleteSpace;
});

angular.module('matrixui.specials').filter('showWrongTests', function () {

  var showWrongTests = void 0;
  showWrongTests = function showWrongTests(array) {
    var results = void 0;
    if (array) {
      results = [];
      array.forEach(function (item) {
        if (item.result !== 'CR') {
          results.push(item);
        }
      });
      return results;
    }
  };
  return showWrongTests;
});
'use strict';

/**
 *
 * @description report组件
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */

angular.module('matrixui.specials.report', []).directive('muReport', muReportDirective);

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
   * @param {object} scope 指令的$scope对象
   * @param {object} element 指令对应的jqlite元素对象
   * @param {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 王镇佳 <wzjfloor@163.com>
   */

  function muReportLink(scope, element, attrs) {

    /* 指令绑定的config 和 report属性 */
    scope.congigName = attrs.config;
    scope.reportName = attrs.report;

    var configContent = scope.$parent[scope.congigName];
    var reportContent = scope.$parent[scope.reportName];

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
      scope.compileCheck = scope.staticCheck = scope.standardTests = scope.randomTests = scope.memoryCheck = scope.googleTest = null;
    }

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */
    if (scope.reportName) {

      scope.$parent.$watch(scope.reportName, function () {

        //获取report
        scope.report = scope.$parent[scope.reportName];
        simplifyReport();
        fixReportLastWrap();
        extractGoogleTest();
      });
    }

    if (scope.congigName) {

      scope.$parent.$watch(scope.congigName, function () {

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

        var STAND_TESTS = scope.standardTests['standard tests'];

        for (var i = 0; i < STAND_TESTS.length; i++) {

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

        var RANDOM_TESTS = scope.randomTests['random tests'];

        for (var _i = 0; _i < RANDOM_TESTS.length; _i++) {

          if (RANDOM_TESTS[_i].stdin && RANDOM_TESTS[_i].stdin[RANDOM_TESTS[_i].stdin.length - 1] == '\n') {
            RANDOM_TESTS[_i].stdin += '\n';
          }
          if (RANDOM_TESTS[_i].standard_stdout && RANDOM_TESTS[_i].standard_stdout[RANDOM_TESTS[_i].standard_stdout.length - 1] == '\n') {
            RANDOM_TESTS[_i].standard_stdout += '\n';
          }
          if (RANDOM_TESTS[_i].stdout && RANDOM_TESTS[_i].stdout[RANDOM_TESTS[_i].stdout.length - 1] == '\n') {
            RANDOM_TESTS[_i].stdout += '\n';
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
          var obj = scope.googleTest['google tests'][0].gtest.failure;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var subobj = _step.value;

              scope.gtestFailedList.push(Object.getOwnPropertyNames(subobj)[0]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  }

  function getTemplate() {
    return '\n    <div id="matrixui-programming-report">\n      <div ng-if="config.grading[&quot;compile check&quot;]" class="compile-check report-section">\n        <div ng-click="toggleContent($event)" class="compile-check-score score">Compile Check : You Get {{compileCheck.grade? compileCheck.grade : 0}} Points of {{config.grading[\'compile check\']}} Points</div>\n        <div ng-if="compileCheck[&quot;compile check&quot;]" class="compile-error-content test-content">\n          <div ng-if="compileCheck.grade == config.grading[&quot;compile check&quot;]" class="report-detail">\n            <pre class="full-score">Pass compilation. You got full score!</pre>\n          </div>\n          <div ng-if="compileCheck &amp;&amp; compileCheck.grade != config.grading[&quot;compile check&quot;]" class="report-detail">\n            <pre class="error-content red-color">Compilation fail.</pre>\n            <div class="error-detail">\n              <pre class="error-content">{{compileCheck[\'compile check\']}}</pre>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;static check&quot;]" class="static-check report-section">\n        <div ng-click="toggleContent($event)" class="static-check-score score">Static Check : You Get {{staticCheck.grade? staticCheck.grade : 0}} Points of {{config.grading[\'static check\']}} Points<a href="http://oclint.org/" target="_blank" ng-if="staticCheck.grade != config.grading[&quot;static check&quot;] &amp;&amp; staticCheck" class="link">Why it went wrong？</a></div>\n        <div class="static-check-content test-content">\n          <div ng-if="!staticCheck &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of errors above.</pre>\n          </div>\n          <div ng-if="!staticCheck &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="staticCheck.grade == config.grading[&quot;static check&quot;]" class="report-detail">\n            <pre class="full-score">Pass static check. You got full score!</pre>\n          </div>\n          <div ng-if="staticCheck &amp;&amp; (staticCheck.grade != config.grading[&quot;static check&quot;])" class="report-detail">\n            <pre class="error-content red-color">Static check fail.</pre>\n            <div class="error-detail">\n              <div class="message"></div>\n              <div ng-if="staticCheck[&quot;static check&quot;].summary" class="summary"></div>\n              <div ng-if="staticCheck[&quot;static check&quot;].violation" ng-repeat="item in staticCheck[&quot;static check&quot;].violation" class="violations">\n                <pre ng-if="item.message" class="error-content">{{ item.path | deleteSpace}} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.message}}</pre>\n                <pre ng-if="item.rule &amp;&amp; !item.message" class="error-content">{{ item.path | deleteSpace }} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.rule}}</pre>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;standard tests&quot;]" class="standard-tests-check report-section">\n        <div ng-click="toggleContent($event)" class="standard-tests-check-score score">Standard Tests : You Get {{standardTests.grade | formatReportGrade }} Points of {{config.grading[\'standard tests\']}} Points</div>\n        <div class="standard-tests-content test-content">\n          <div ng-if="!standardTests &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!standardTests &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="standardTests.grade == config.grading[&quot;standard tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass standard test. You got full score!</pre>\n          </div>\n          <div ng-if="standardTests &amp;&amp; standardTests.grade != config.grading[&quot;standard tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Some examples of failed standard test cases:</pre>\n            <div class="error-detail">\n              <div ng-repeat="test in standardTests[&quot;standard tests&quot;] | showWrongTests | limitTo: 3" class="standard-tests">\n                <hr ng-if="$index != 0"/>\n                <div ng-if="test.result != &quot;CR&quot;" class="standard-test">\n                  <div layout="layout" class="tests-check-summary">\n                    <pre layout="layout">[{{ $index+1 }}]</pre>\n                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{test.memoryused}}kb</pre>\n                    <pre layout="layout" ng-if="test.timeused">Time Used : {{test.timeused}}ms</pre>\n                    <pre layout="layout" ng-if="test.result">Result : {{test.result | formatReportResult}}</pre>\n                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>\n                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>\n                  </div>\n                  <pre class="label">Standard Input :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>\n                  <pre class="label">Standard Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>\n                  <pre class="label">Your Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;random tests&quot;]" class="random-tests-check report-section">\n        <div ng-click="toggleContent($event)" class="random-tests-check-score score">Random Tests : You Get {{randomTests.grade | formatReportGrade}} Points of {{config.grading[\'random tests\']}} Points</div>\n        <div class="random-tests-content test-content">\n          <div ng-if="!randomTests &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!randomTest &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="randomTests.grade == config.grading[&quot;random tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass random check. You got full score!</pre>\n          </div>\n          <div ng-if="randomTests &amp;&amp; randomTests.grade != config.grading[&quot;random tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Some examples of failed random test cases:</pre>\n            <div class="error-detail">\n              <div ng-repeat="test in randomTests[&quot;random tests&quot;] | showWrongTests | limitTo: 3" class="random-tests">\n                <hr ng-if="$index != 0"/>\n                <div ng-if="test.result != &quot;CR&quot;" class="random-test">\n                  <div layout="layout" class="tests-check-summary">\n                    <pre layout="layout">[{{ $index+1 }}]</pre>\n                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{ test.memoryused }}kb</pre>\n                    <pre layout="layout" ng-if="test.timeused">Time Used : {{ test.timeused }}ms</pre>\n                    <pre layout="layout" ng-if="test.result">Result : {{ test.result | formatReportResult}}</pre>\n                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>\n                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>\n                  </div>\n                  <pre class="label">Standard Input :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>\n                  <pre class="label">Standard Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>\n                  <pre class="label">Your Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;memory check&quot;]" class="memory-check report-section">\n        <div ng-click="toggleContent($event)" class="memory-check-score score">Memory Check : You Get {{memoryCheck.grade | formatReportGrade}} Points of {{config.grading[\'memory check\']}} Points<a href="http://valgrind.org/" ng-if="memoryCheck.grade != config.grading[&quot;memory check&quot;] &amp;&amp; memoryCheck" class="link">Why it went wrong？</a></div>\n        <div class="memory-check-content test-content">\n          <div ng-if="!memoryCheck &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!memoryCheck &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="memoryCheck.grade == config.grading[&quot;memory check&quot;]" class="report-detail">\n            <pre class="full-score">Pass memory access check. You got full score!</pre>\n          </div>\n          <div ng-if="memoryCheck &amp;&amp; memoryCheck.grade != config.grading[&quot;memory check&quot;]" class="report-detail">\n            <pre class="error-content red-color">Memory check fail.</pre>\n            <div class="error-detail">\n              <div ng-repeat="check in memoryCheck[&quot;memory check&quot;]" class="memory-checks">\n                <hr ng-if="$index != 0"/>\n                <pre ng-if="check.message" class="memory-check-summary">[{{ $index+1 }}] {{ check.message }}</pre>\n                <pre ng-if="check.valgrindoutput.error.kind" class="memory-check-summary">[{{ $index+1 }}] Error :   {{ check.valgrindoutput.error.kind }}</pre>\n                <pre ng-if="check.stdin">Standard Input :</pre>\n                <pre ng-if="check.stdin" class="error-content inout-tests">{{ check.stdin }}</pre>\n                <div ng-if="check.valgrindoutput.error.stack.frame" class="memory-check">\n                  <div ng-repeat="frame in check.valgrindoutput.error.stack.frame">\n                    <hr ng-if="$index != 0"/>\n                    <pre ng-if="frame.obj" class="error-content">obj: {{ frame.obj }}</pre>\n                    <pre ng-if="frame.file &amp;&amp; frame.line" class="error-content">[{{ frame.file }}]: line {{ frame.line }}</pre>\n                    <pre ng-if="frame.fn" class="error-content">{{ frame.fn }}</pre>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;google tests&quot;]" class="google-test report-section">\n        <div ng-click="toggleContent($event)" class="google-test-score score">Google Test : You Get {{googleTest.grade | formatReportGrade}} Points of {{config.grading[\'google tests\']}} Points</div>\n        <div class="google-test-content test-content">\n          <div ng-if="!googleTest &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!googleTest &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="googleTest.grade == config.grading[&quot;google tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass Google test. You got full score!</pre>\n          </div>\n          <div ng-if="googleTest &amp;&amp; googleTest.grade != config.grading[&quot;google tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Google test fail</pre>\n            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info != null" class="error-detail">\n              <pre ng-repeat="fail in gtestFailedList" class="error-content">{{fail}} : {{googleTest[\'google tests\'][0].gtest.info[fail]}}</pre>\n            </div>\n            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info == null" class="error-detail">\n              <pre class="error-content">error: {{ googleTest[\'google tests\'][0].gtest.failure[0][\'error\'] }}</pre>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    ';
  }
}