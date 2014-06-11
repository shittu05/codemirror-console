(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"mirror-console-command\">\n    <button class=\"mirror-console-button mirror-console-run\" id=\"mirror-console-run-button\">実行</button>\n    <button class=\"mirror-console-button mirror-console-clear\" id=\"mirror-console-clear-button\">ログをクリア</button>\n    <button class=\"mirror-console-button mirror-console-exit\" id=\"mirror-console-exit-button\">終了</button>\n</div>\n<div class=\"mirror-console-log\">\n</div>";
  });

},{"hbsfy/runtime":17}],2:[function(require,module,exports){
"use strict";
var MirrorConsole = require("codemirror-console");
function getDOMFromTemplate(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    return div;
}
function intendMirrorConsole(element) {
    var mirror = new MirrorConsole();
    var codeMirror = mirror.editor;
    codeMirror.setOption("lineNumbers", true);
    mirror.setText(element.textContent);

    var node = getDOMFromTemplate(require("./mirror-console-component.hbs")());
    var logArea = node.querySelector(".mirror-console-log");
    var consoleMock = {
        log: function () {
            var args = Array.prototype.slice.call(arguments);
            var div = document.createElement("div");
            div.className = "mirror-console-log-row mirror-console-log-normal";
            div.appendChild(document.createTextNode(args.join(",")));
            logArea.appendChild(div);
        },
        error: function () {
            var args = Array.prototype.slice.call(arguments);
            var div = document.createElement("div");
            div.className = "mirror-console-log-row mirror-console-log-error";
            div.appendChild(document.createTextNode(args.join(",")));
            logArea.appendChild(div);
        }
    }
    mirror.swapWithElement(element);
    mirror.textareaHolder.appendChild(node);

    runCode();

    function runCode() {
        mirror.runInContext({ console: consoleMock }, function (error) {
            if (error) {
                consoleMock.error(error);
            }
        });
    }

    node.querySelector("#mirror-console-run-button").addEventListener("click", function runJS() {
        runCode();
    });
    node.querySelector("#mirror-console-clear-button").addEventListener("click", function clearLog() {
        var range = document.createRange();
        range.selectNodeContents(node.querySelector(".mirror-console-log"));
        range.deleteContents();
    });
    node.querySelector("#mirror-console-exit-button").addEventListener("click", function clearLog() {
        mirror.destroy();
        attachToElement(element);
    });
}
function attachToElement(element) {
    var parentNode = element.parentNode;
    var node = getDOMFromTemplate(require("./mirror-console-inject-button.hbs")());
    node.querySelector("#mirror-console-run-button").addEventListener("click", function editAndRun() {
        intendMirrorConsole(element);
        parentNode.removeChild(node);
    });
    if (element.nextSibling === null) {
        parentNode.appendChild(node);
    } else {
        parentNode.insertBefore(node, element.nextSibling);
    }
}
module.exports = attachToElement;
},{"./mirror-console-component.hbs":1,"./mirror-console-inject-button.hbs":3,"codemirror-console":5}],3:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<button class=\"mirror-console-button mirror-console-run\" id=\"mirror-console-run-button\">実行</button>";
  });

},{"hbsfy/runtime":17}],4:[function(require,module,exports){
"use strict";
var component = require("./components/mirror-console-component");
var content = document.querySelector(".content");
component(content);
},{"./components/mirror-console-component":2}],5:[function(require,module,exports){
"use strict";
var EvalContext = require("context-eval");
var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');
function MirrorConsole() {
    this.editor = this.createEditor();
}
MirrorConsole.prototype.createEditor = function () {
    this.textareaHolder = document.createElement("div");
    this.textarea = document.createElement("textarea");
    this.textareaHolder.appendChild(this.textarea);
    return CodeMirror.fromTextArea(this.textarea);
}
MirrorConsole.prototype.setText = function (value) {
    this.editor.setValue(value);
}
MirrorConsole.prototype.getText = function (value) {
    return this.editor.getValue();
}
MirrorConsole.prototype.swapWithElement = function (element) {
    this.originalElemenet = element;
    element.parentNode.replaceChild(this.textareaHolder, element)
    this.editor.refresh();
}
MirrorConsole.prototype.destroy = function (element) {
    if (this.originalElemenet == null) {
        throw new Error("Haven't `originalElemenet` : You have to call #swapWithElement before call this");
    }
    this.textareaHolder.parentNode.replaceChild(this.originalElemenet, this.textareaHolder);
    this.originalElemenet = null;
    this.textarea = null;
    this.textareaHolder = null;
    this.editor = null;
    if (this.evalContext) {
        this.evalContext.destroy();
    }
    Object.freeze(this);
}
MirrorConsole.prototype.runInContext = function (context, callback) {
    if (this.evalContext) {
        this.evalContext.destroy();
    }
    this.evalContext = new EvalContext(context, this.textareaHolder);
    var jsCode = this.editor.getValue();
    var res;
    try {
        res = this.evalContext.evaluate(jsCode);
        callback(null, res);
    } catch (error) {
        callback(error, res);
    }

}
module.exports = MirrorConsole;
},{"codemirror":8,"codemirror/mode/javascript/javascript":9,"context-eval":6}],6:[function(require,module,exports){
if (!(typeof window !== "undefined" && window !== null)) {
  // Will do this dance so the require isn't parsed for browserify etc.
  var moduleName = './lib/context-node';
  module.exports = require(moduleName);
} else {
  module.exports = require('./lib/context-browser');
}

},{"./lib/context-browser":7}],7:[function(require,module,exports){
function Context(sandbox, parentElement) {
  this.iframe = document.createElement('iframe');
  this.iframe.style.display = 'none';
  parentElement = parentElement || document.body;
  parentElement.appendChild(this.iframe);
  var win = this.iframe.contentWindow;
  sandbox = sandbox || {};
  Object.keys(sandbox).forEach(function (key) {
    win[key] = sandbox[key];
  });
}

Context.prototype.evaluate = function (code) {
  return this.iframe.contentWindow.eval(code);
};

Context.prototype.destroy = function () {
  if (this.iframe) {
    this.iframe.parentNode.removeChild(this.iframe);
    this.iframe = null;
  }
};

module.exports = Context;
},{}],8:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// This is CodeMirror (http://codemirror.net), a code editor
// implemented in JavaScript on top of the browser's DOM.
//
// You can find some technical background for some of the code below
// at http://marijnhaverbeke.nl/blog/#cm-internals .

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    module.exports = mod();
  else if (typeof define == "function" && define.amd) // AMD
    return define([], mod);
  else // Plain browser env
    this.CodeMirror = mod();
})(function() {
  "use strict";

  // BROWSER SNIFFING

  // Kludges for bugs and behavior differences that can't be feature
  // detected are enabled based on userAgent etc sniffing.

  var gecko = /gecko\/\d/i.test(navigator.userAgent);
  // ie_uptoN means Internet Explorer version N or lower
  var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
  var ie_upto7 = ie_upto10 && (document.documentMode == null || document.documentMode < 8);
  var ie_upto8 = ie_upto10 && (document.documentMode == null || document.documentMode < 9);
  var ie_upto9 = ie_upto10 && (document.documentMode == null || document.documentMode < 10);
  var ie_11up = /Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent);
  var ie = ie_upto10 || ie_11up;
  var webkit = /WebKit\//.test(navigator.userAgent);
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
  var chrome = /Chrome\//.test(navigator.userAgent);
  var presto = /Opera\//.test(navigator.userAgent);
  var safari = /Apple Computer/.test(navigator.vendor);
  var khtml = /KHTML\//.test(navigator.userAgent);
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
  var phantom = /PhantomJS/.test(navigator.userAgent);

  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  // This is woefully incomplete. Suggestions for alternative methods welcome.
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
  var mac = ios || /Mac/.test(navigator.platform);
  var windows = /win/i.test(navigator.platform);

  var presto_version = presto && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
  if (presto_version) presto_version = Number(presto_version[1]);
  if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
  var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
  var captureRightClick = gecko || (ie && !ie_upto8);

  // Optimize some code when these features are not used.
  var sawReadOnlySpans = false, sawCollapsedSpans = false;

  // EDITOR CONSTRUCTOR

  // A CodeMirror instance represents an editor. This is the object
  // that user code is usually dealing with.

  function CodeMirror(place, options) {
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

    this.options = options = options || {};
    // Determine effective options based on given values and defaults.
    copyObj(defaults, options, false);
    setGuttersForLineNumbers(options);

    var doc = options.value;
    if (typeof doc == "string") doc = new Doc(doc, options.mode);
    this.doc = doc;

    var display = this.display = new Display(place, doc);
    display.wrapper.CodeMirror = this;
    updateGutters(this);
    themeChanged(this);
    if (options.lineWrapping)
      this.display.wrapper.className += " CodeMirror-wrap";
    if (options.autofocus && !mobile) focusInput(this);

    this.state = {
      keyMaps: [],  // stores maps added by addKeyMap
      overlays: [], // highlighting overlays, as added by addOverlay
      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
      overwrite: false, focused: false,
      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
      pasteIncoming: false, cutIncoming: false, // help recognize paste/cut edits in readInput
      draggingText: false,
      highlight: new Delayed() // stores highlight worker timeout
    };

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie_upto10) setTimeout(bind(resetInput, this, true), 20);

    registerEventHandlers(this);
    ensureGlobalHandlers();

    var cm = this;
    runInOp(this, function() {
      cm.curOp.forceUpdate = true;
      attachDoc(cm, doc);

      if ((options.autofocus && !mobile) || activeElt() == display.input)
        setTimeout(bind(onFocus, cm), 20);
      else
        onBlur(cm);

      for (var opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt))
        optionHandlers[opt](cm, options[opt], Init);
      for (var i = 0; i < initHooks.length; ++i) initHooks[i](cm);
    });
  }

  // DISPLAY CONSTRUCTOR

  // The display handles the DOM integration, both for input reading
  // and content drawing. It holds references to DOM nodes and
  // display-related state.

  function Display(place, doc) {
    var d = this;

    // The semihidden textarea that is focused when the editor is
    // focused, and receives input.
    var input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
    // The textarea is kept positioned near the cursor to prevent the
    // fact that it'll be scrolled into view on input from scrolling
    // our fake cursor out of view. On webkit, when wrap=off, paste is
    // very slow. So make the area wide instead.
    if (webkit) input.style.width = "1000px";
    else input.setAttribute("wrap", "off");
    // If border: 0; -- iOS fails to open keyboard (issue #1287)
    if (ios) input.style.border = "1px solid black";
    input.setAttribute("autocorrect", "off"); input.setAttribute("autocapitalize", "off"); input.setAttribute("spellcheck", "false");

    // Wraps and hides input textarea
    d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    // The fake scrollbar elements.
    d.scrollbarH = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    d.scrollbarV = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
    // Covers bottom-right square when both scrollbars are present.
    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
    // Covers bottom of gutter when coverGutterNextToScrollbar is on
    // and h scrollbar is present.
    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
    // Will contain the actual code, positioned to cover the viewport.
    d.lineDiv = elt("div", null, "CodeMirror-code");
    // Elements are added to these to represent selection and cursors.
    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
    d.cursorDiv = elt("div", null, "CodeMirror-cursors");
    // A visibility: hidden element used to find the size of things.
    d.measure = elt("div", null, "CodeMirror-measure");
    // When lines outside of the viewport are measured, they are drawn in this.
    d.lineMeasure = elt("div", null, "CodeMirror-measure");
    // Wraps everything that needs to exist inside the vertically-padded coordinate system
    d.lineSpace = elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
                      null, "position: relative; outline: none");
    // Moved around its parent to cover visible view.
    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
    // Set to the height of the document, allowing scrolling.
    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
    // Behavior of elts with overflow: auto and padding is
    // inconsistent across browsers. This is used to ensure the
    // scrollable area is big enough.
    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;");
    // Will contain the gutters, if any.
    d.gutters = elt("div", null, "CodeMirror-gutters");
    d.lineGutter = null;
    // Actual scrollable element.
    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
    d.scroller.setAttribute("tabIndex", "-1");
    // The element in which the editor lives.
    d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV,
                            d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

    // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
    if (ie_upto7) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
    // Needed to hide big blue blinking cursor on Mobile Safari
    if (ios) input.style.width = "0px";
    if (!webkit) d.scroller.draggable = true;
    // Needed to handle Tab key in KHTML
    if (khtml) { d.inputDiv.style.height = "1px"; d.inputDiv.style.position = "absolute"; }
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    if (ie_upto7) d.scrollbarH.style.minHeight = d.scrollbarV.style.minWidth = "18px";

    if (place.appendChild) place.appendChild(d.wrapper);
    else place(d.wrapper);

    // Current rendered range (may be bigger than the view window).
    d.viewFrom = d.viewTo = doc.first;
    // Information about the rendered lines.
    d.view = [];
    // Holds info about a single rendered line when it was rendered
    // for measurement, while not in view.
    d.externalMeasured = null;
    // Empty space (in pixels) above the view
    d.viewOffset = 0;
    d.lastSizeC = 0;
    d.updateLineNumbers = null;

    // Used to only resize the line number gutter when necessary (when
    // the amount of lines crosses a boundary that makes its width change)
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
    // See readInput and resetInput
    d.prevInput = "";
    // Set to true when a non-horizontal-scrolling line widget is
    // added. As an optimization, line widget aligning is skipped when
    // this is false.
    d.alignWidgets = false;
    // Flag that indicates whether we expect input to appear real soon
    // now (after some event like 'keypress' or 'input') and are
    // polling intensively.
    d.pollingFast = false;
    // Self-resetting timeout for the poller
    d.poll = new Delayed();

    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

    // Tracks when resetInput has punted to just putting a short
    // string into the textarea instead of the full selection.
    d.inaccurateSelection = false;

    // Tracks the maximum line length so that the horizontal scrollbar
    // can be kept static when scrolling.
    d.maxLine = null;
    d.maxLineLength = 0;
    d.maxLineChanged = false;

    // Used for measuring wheel scrolling granularity
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

    // True when shift is held down.
    d.shift = false;

    // Used to track whether anything happened since the context menu
    // was opened.
    d.selForContextMenu = null;
  }

  // STATE UPDATES

  // Used to get the editor into a consistent state again when options change.

  function loadMode(cm) {
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
    resetModeState(cm);
  }

  function resetModeState(cm) {
    cm.doc.iter(function(line) {
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
    });
    cm.doc.frontier = cm.doc.first;
    startWorker(cm, 100);
    cm.state.modeGen++;
    if (cm.curOp) regChange(cm);
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      addClass(cm.display.wrapper, "CodeMirror-wrap");
      cm.display.sizer.style.minWidth = "";
    } else {
      rmClass(cm.display.wrapper, "CodeMirror-wrap");
      findMaxLine(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function(){updateScrollbars(cm);}, 100);
  }

  // Returns a function that estimates the height of a line, to use as
  // first approximation until the line becomes visible (and is thus
  // properly measurable).
  function estimateHeight(cm) {
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
    return function(line) {
      if (lineIsHidden(cm.doc, line)) return 0;

      var widgetsHeight = 0;
      if (line.widgets) for (var i = 0; i < line.widgets.length; i++) {
        if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
      }

      if (wrapping)
        return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
      else
        return widgetsHeight + th;
    };
  }

  function estimateLineHeights(cm) {
    var doc = cm.doc, est = estimateHeight(cm);
    doc.iter(function(line) {
      var estHeight = est(line);
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    });
  }

  function keyMapChanged(cm) {
    var map = keyMap[cm.options.keyMap], style = map.style;
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") +
      (style ? " cm-keymap-" + style : "");
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
    clearCaches(cm);
  }

  function guttersChanged(cm) {
    updateGutters(cm);
    regChange(cm);
    setTimeout(function(){alignHorizontally(cm);}, 20);
  }

  // Rebuild the gutter elements, ensure the margin to the left of the
  // code matches their width.
  function updateGutters(cm) {
    var gutters = cm.display.gutters, specs = cm.options.gutters;
    removeChildren(gutters);
    for (var i = 0; i < specs.length; ++i) {
      var gutterClass = specs[i];
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
      if (gutterClass == "CodeMirror-linenumbers") {
        cm.display.lineGutter = gElt;
        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
      }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);
  }

  function updateGutterSpace(cm) {
    var width = cm.display.gutters.offsetWidth;
    cm.display.sizer.style.marginLeft = width + "px";
    cm.display.scrollbarH.style.left = cm.options.fixedGutter ? width + "px" : 0;
  }

  // Compute the character length of a line, taking into account
  // collapsed ranges (see markText) that might hide parts, and join
  // other lines onto it.
  function lineLength(line) {
    if (line.height == 0) return 0;
    var len = line.text.length, merged, cur = line;
    while (merged = collapsedSpanAtStart(cur)) {
      var found = merged.find(0, true);
      cur = found.from.line;
      len += found.from.ch - found.to.ch;
    }
    cur = line;
    while (merged = collapsedSpanAtEnd(cur)) {
      var found = merged.find(0, true);
      len -= cur.text.length - found.from.ch;
      cur = found.to.line;
      len += cur.text.length - found.to.ch;
    }
    return len;
  }

  // Find the longest line in the document.
  function findMaxLine(cm) {
    var d = cm.display, doc = cm.doc;
    d.maxLine = getLine(doc, doc.first);
    d.maxLineLength = lineLength(d.maxLine);
    d.maxLineChanged = true;
    doc.iter(function(line) {
      var len = lineLength(line);
      if (len > d.maxLineLength) {
        d.maxLineLength = len;
        d.maxLine = line;
      }
    });
  }

  // Make sure the gutters options contains the element
  // "CodeMirror-linenumbers" when the lineNumbers option is true.
  function setGuttersForLineNumbers(options) {
    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
    if (found == -1 && options.lineNumbers) {
      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
    } else if (found > -1 && !options.lineNumbers) {
      options.gutters = options.gutters.slice(0);
      options.gutters.splice(found, 1);
    }
  }

  // SCROLLBARS

  // Prepare DOM reads needed to update the scrollbars. Done in one
  // shot to minimize update/measure roundtrips.
  function measureForScrollbars(cm) {
    var scroll = cm.display.scroller;
    return {
      clientHeight: scroll.clientHeight,
      barHeight: cm.display.scrollbarV.clientHeight,
      scrollWidth: scroll.scrollWidth, clientWidth: scroll.clientWidth,
      barWidth: cm.display.scrollbarH.clientWidth,
      docHeight: Math.round(cm.doc.height + paddingVert(cm.display))
    };
  }

  // Re-synchronize the fake scrollbars with the actual size of the
  // content.
  function updateScrollbars(cm, measure) {
    if (!measure) measure = measureForScrollbars(cm);
    var d = cm.display;
    var scrollHeight = measure.docHeight + scrollerCutOff;
    var needsH = measure.scrollWidth > measure.clientWidth;
    var needsV = scrollHeight > measure.clientHeight;
    if (needsV) {
      d.scrollbarV.style.display = "block";
      d.scrollbarV.style.bottom = needsH ? scrollbarWidth(d.measure) + "px" : "0";
      // A bug in IE8 can cause this value to be negative, so guard it.
      d.scrollbarV.firstChild.style.height =
        Math.max(0, scrollHeight - measure.clientHeight + (measure.barHeight || d.scrollbarV.clientHeight)) + "px";
    } else {
      d.scrollbarV.style.display = "";
      d.scrollbarV.firstChild.style.height = "0";
    }
    if (needsH) {
      d.scrollbarH.style.display = "block";
      d.scrollbarH.style.right = needsV ? scrollbarWidth(d.measure) + "px" : "0";
      d.scrollbarH.firstChild.style.width =
        (measure.scrollWidth - measure.clientWidth + (measure.barWidth || d.scrollbarH.clientWidth)) + "px";
    } else {
      d.scrollbarH.style.display = "";
      d.scrollbarH.firstChild.style.width = "0";
    }
    if (needsH && needsV) {
      d.scrollbarFiller.style.display = "block";
      d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = scrollbarWidth(d.measure) + "px";
    } else d.scrollbarFiller.style.display = "";
    if (needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = "block";
      d.gutterFiller.style.height = scrollbarWidth(d.measure) + "px";
      d.gutterFiller.style.width = d.gutters.offsetWidth + "px";
    } else d.gutterFiller.style.display = "";

    if (!cm.state.checkedOverlayScrollbar && measure.clientHeight > 0) {
      if (scrollbarWidth(d.measure) === 0) {
        var w = mac && !mac_geMountainLion ? "12px" : "18px";
        d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = w;
        var barMouseDown = function(e) {
          if (e_target(e) != d.scrollbarV && e_target(e) != d.scrollbarH)
            operation(cm, onMouseDown)(e);
        };
        on(d.scrollbarV, "mousedown", barMouseDown);
        on(d.scrollbarH, "mousedown", barMouseDown);
      }
      cm.state.checkedOverlayScrollbar = true;
    }
  }

  // Compute the lines that are visible in a given viewport (defaults
  // the the current scroll position). viewPort may contain top,
  // height, and ensure (see op.scrollToPos) properties.
  function visibleLines(display, doc, viewPort) {
    var top = viewPort && viewPort.top != null ? Math.max(0, viewPort.top) : display.scroller.scrollTop;
    top = Math.floor(top - paddingTop(display));
    var bottom = viewPort && viewPort.bottom != null ? viewPort.bottom : top + display.wrapper.clientHeight;

    var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
    // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
    // forces those lines into the viewport (if possible).
    if (viewPort && viewPort.ensure) {
      var ensureFrom = viewPort.ensure.from.line, ensureTo = viewPort.ensure.to.line;
      if (ensureFrom < from)
        return {from: ensureFrom,
                to: lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight)};
      if (Math.min(ensureTo, doc.lastLine()) >= to)
        return {from: lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight),
                to: ensureTo};
    }
    return {from: from, to: Math.max(to, from + 1)};
  }

  // LINE NUMBERS

  // Re-align line numbers and gutter marks to compensate for
  // horizontal scrolling.
  function alignHorizontally(cm) {
    var display = cm.display, view = display.view;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, left = comp + "px";
    for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
      if (cm.options.fixedGutter && view[i].gutter)
        view[i].gutter.style.left = left;
      var align = view[i].alignable;
      if (align) for (var j = 0; j < align.length; j++)
        align[j].style.left = left;
    }
    if (cm.options.fixedGutter)
      display.gutters.style.left = (comp + gutterW) + "px";
  }

  // Used to ensure that the line number gutter is still the right
  // size for the current document size. Returns true when an update
  // is needed.
  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) return false;
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = "";
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = display.lineNumWidth + "px";
      updateGutterSpace(cm);
      return true;
    }
    return false;
  }

  function lineNumberFor(options, i) {
    return String(options.lineNumberFormatter(i + options.firstLineNumber));
  }

  // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
  // but using getBoundingClientRect to get a sub-pixel-accurate
  // result.
  function compensateForHScroll(display) {
    return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
  }

  // DISPLAY DRAWING

  // Updates the display, selection, and scrollbars, using the
  // information in display.view to find out which nodes are no longer
  // up-to-date. Tries to bail out early when no changes are needed,
  // unless forced is true.
  // Returns true if an actual update happened, false otherwise.
  function updateDisplay(cm, viewPort, forced) {
    var oldFrom = cm.display.viewFrom, oldTo = cm.display.viewTo, updated;
    var visible = visibleLines(cm.display, cm.doc, viewPort);
    for (var first = true;; first = false) {
      var oldWidth = cm.display.scroller.clientWidth;
      if (!updateDisplayInner(cm, visible, forced)) break;
      updated = true;

      // If the max line changed since it was last measured, measure it,
      // and ensure the document's width matches it.
      if (cm.display.maxLineChanged && !cm.options.lineWrapping)
        adjustContentWidth(cm);

      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      setDocumentHeight(cm, barMeasure);
      updateScrollbars(cm, barMeasure);
      if (webkit && cm.options.lineWrapping)
        checkForWebkitWidthBug(cm, barMeasure); // (Issue #2420)
      if (first && cm.options.lineWrapping && oldWidth != cm.display.scroller.clientWidth) {
        forced = true;
        continue;
      }
      forced = false;

      // Clip forced viewport to actual scrollable area.
      if (viewPort && viewPort.top != null)
        viewPort = {top: Math.min(barMeasure.docHeight - scrollerCutOff - barMeasure.clientHeight, viewPort.top)};
      // Updated line heights might result in the drawn area not
      // actually covering the viewport. Keep looping until it does.
      visible = visibleLines(cm.display, cm.doc, viewPort);
      if (visible.from >= cm.display.viewFrom && visible.to <= cm.display.viewTo)
        break;
    }

    cm.display.updateLineNumbers = null;
    if (updated) {
      signalLater(cm, "update", cm);
      if (cm.display.viewFrom != oldFrom || cm.display.viewTo != oldTo)
        signalLater(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
    }
    return updated;
  }

  // Does the actual updating of the line display. Bails out
  // (returning false) when there is nothing to be done and forced is
  // false.
  function updateDisplayInner(cm, visible, forced) {
    var display = cm.display, doc = cm.doc;
    if (!display.wrapper.offsetWidth) {
      resetView(cm);
      return;
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!forced && visible.from >= display.viewFrom && visible.to <= display.viewTo &&
        countDirtyView(cm) == 0)
      return;

    if (maybeUpdateLineNumberWidth(cm))
      resetView(cm);
    var dims = getDimensions(cm);

    // Compute a suitable new viewport (from & to)
    var end = doc.first + doc.size;
    var from = Math.max(visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, visible.to + cm.options.viewportMargin);
    if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
    if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
    if (sawCollapsedSpans) {
      from = visualLineNo(cm.doc, from);
      to = visualLineEndNo(cm.doc, to);
    }

    var different = from != display.viewFrom || to != display.viewTo ||
      display.lastSizeC != display.wrapper.clientHeight;
    adjustView(cm, from, to);

    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
    // Position the mover div to align with the current scroll position
    cm.display.mover.style.top = display.viewOffset + "px";

    var toUpdate = countDirtyView(cm);
    if (!different && toUpdate == 0 && !forced) return;

    // For big changes, we hide the enclosing element during the
    // update, since that speeds up the operations on most browsers.
    var focused = activeElt();
    if (toUpdate > 4) display.lineDiv.style.display = "none";
    patchDisplay(cm, display.updateLineNumbers, dims);
    if (toUpdate > 4) display.lineDiv.style.display = "";
    // There might have been a widget with a focused element that got
    // hidden or updated, if so re-focus it.
    if (focused && activeElt() != focused && focused.offsetHeight) focused.focus();

    // Prevent selection and cursors from interfering with the scroll
    // width.
    removeChildren(display.cursorDiv);
    removeChildren(display.selectionDiv);

    if (different) {
      display.lastSizeC = display.wrapper.clientHeight;
      startWorker(cm, 400);
    }

    updateHeightsInViewport(cm);

    return true;
  }

  function adjustContentWidth(cm) {
    var display = cm.display;
    var width = measureChar(cm, display.maxLine, display.maxLine.text.length).left;
    display.maxLineChanged = false;
    var minWidth = Math.max(0, width + 3);
    var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + minWidth + scrollerCutOff - display.scroller.clientWidth);
    display.sizer.style.minWidth = minWidth + "px";
    if (maxScrollLeft < cm.doc.scrollLeft)
      setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), true);
  }

  function setDocumentHeight(cm, measure) {
    cm.display.sizer.style.minHeight = cm.display.heightForcer.style.top = measure.docHeight + "px";
    cm.display.gutters.style.height = Math.max(measure.docHeight, measure.clientHeight - scrollerCutOff) + "px";
  }

  function checkForWebkitWidthBug(cm, measure) {
    // Work around Webkit bug where it sometimes reserves space for a
    // non-existing phantom scrollbar in the scroller (Issue #2420)
    if (cm.display.sizer.offsetWidth + cm.display.gutters.offsetWidth < cm.display.scroller.clientWidth - 1) {
      cm.display.sizer.style.minHeight = cm.display.heightForcer.style.top = "0px";
      cm.display.gutters.style.height = measure.docHeight + "px";
    }
  }

  // Read the actual heights of the rendered lines, and update their
  // stored heights to match.
  function updateHeightsInViewport(cm) {
    var display = cm.display;
    var prevBottom = display.lineDiv.offsetTop;
    for (var i = 0; i < display.view.length; i++) {
      var cur = display.view[i], height;
      if (cur.hidden) continue;
      if (ie_upto7) {
        var bot = cur.node.offsetTop + cur.node.offsetHeight;
        height = bot - prevBottom;
        prevBottom = bot;
      } else {
        var box = cur.node.getBoundingClientRect();
        height = box.bottom - box.top;
      }
      var diff = cur.line.height - height;
      if (height < 2) height = textHeight(display);
      if (diff > .001 || diff < -.001) {
        updateLineHeight(cur.line, height);
        updateWidgetHeight(cur.line);
        if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
          updateWidgetHeight(cur.rest[j]);
      }
    }
  }

  // Read and store the height of line widgets associated with the
  // given line.
  function updateWidgetHeight(line) {
    if (line.widgets) for (var i = 0; i < line.widgets.length; ++i)
      line.widgets[i].height = line.widgets[i].node.offsetHeight;
  }

  // Do a bulk-read of the DOM positions and sizes needed to draw the
  // view, so that we don't interleave reading and writing to the DOM.
  function getDimensions(cm) {
    var d = cm.display, left = {}, width = {};
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
      left[cm.options.gutters[i]] = n.offsetLeft;
      width[cm.options.gutters[i]] = n.offsetWidth;
    }
    return {fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth};
  }

  // Sync the actual display DOM structure with display.view, removing
  // nodes for lines that are no longer in view, and creating the ones
  // that are not there yet, and updating the ones that are out of
  // date.
  function patchDisplay(cm, updateNumbersFrom, dims) {
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      // Works around a throw-scroll bug in OS X Webkit
      if (webkit && mac && cm.display.currentWheelTarget == node)
        node.style.display = "none";
      else
        node.parentNode.removeChild(node);
      return next;
    }

    var view = display.view, lineN = display.viewFrom;
    // Loop over the elements in the view, syncing cur (the DOM nodes
    // in display.lineDiv) with the view as we go.
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (lineView.hidden) {
      } else if (!lineView.node) { // Not drawn yet
        var node = buildLineElement(cm, lineView, lineN, dims);
        container.insertBefore(node, cur);
      } else { // Already drawn
        while (cur != lineView.node) cur = rm(cur);
        var updateNumber = lineNumbers && updateNumbersFrom != null &&
          updateNumbersFrom <= lineN && lineView.lineNumber;
        if (lineView.changes) {
          if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
          updateLineForChanges(cm, lineView, lineN, dims);
        }
        if (updateNumber) {
          removeChildren(lineView.lineNumber);
          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
        }
        cur = lineView.node.nextSibling;
      }
      lineN += lineView.size;
    }
    while (cur) cur = rm(cur);
  }

  // When an aspect of a line changes, a string is added to
  // lineView.changes. This updates the relevant part of the line's
  // DOM structure.
  function updateLineForChanges(cm, lineView, lineN, dims) {
    for (var j = 0; j < lineView.changes.length; j++) {
      var type = lineView.changes[j];
      if (type == "text") updateLineText(cm, lineView);
      else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
      else if (type == "class") updateLineClasses(lineView);
      else if (type == "widget") updateLineWidgets(lineView, dims);
    }
    lineView.changes = null;
  }

  // Lines with gutter elements, widgets or a background class need to
  // be wrapped, and have the extra elements added to the wrapper div
  function ensureLineWrapped(lineView) {
    if (lineView.node == lineView.text) {
      lineView.node = elt("div", null, null, "position: relative");
      if (lineView.text.parentNode)
        lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
      lineView.node.appendChild(lineView.text);
      if (ie_upto7) lineView.node.style.zIndex = 2;
    }
    return lineView.node;
  }

  function updateLineBackground(lineView) {
    var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
    if (cls) cls += " CodeMirror-linebackground";
    if (lineView.background) {
      if (cls) lineView.background.className = cls;
      else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
    } else if (cls) {
      var wrap = ensureLineWrapped(lineView);
      lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
    }
  }

  // Wrapper around buildLineContent which will reuse the structure
  // in display.externalMeasured when possible.
  function getLineContent(cm, lineView) {
    var ext = cm.display.externalMeasured;
    if (ext && ext.line == lineView.line) {
      cm.display.externalMeasured = null;
      lineView.measure = ext.measure;
      return ext.built;
    }
    return buildLineContent(cm, lineView);
  }

  // Redraw the line's text. Interacts with the background and text
  // classes because the mode may output tokens that influence these
  // classes.
  function updateLineText(cm, lineView) {
    var cls = lineView.text.className;
    var built = getLineContent(cm, lineView);
    if (lineView.text == lineView.node) lineView.node = built.pre;
    lineView.text.parentNode.replaceChild(built.pre, lineView.text);
    lineView.text = built.pre;
    if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
      lineView.bgClass = built.bgClass;
      lineView.textClass = built.textClass;
      updateLineClasses(lineView);
    } else if (cls) {
      lineView.text.className = cls;
    }
  }

  function updateLineClasses(lineView) {
    updateLineBackground(lineView);
    if (lineView.line.wrapClass)
      ensureLineWrapped(lineView).className = lineView.line.wrapClass;
    else if (lineView.node != lineView.text)
      lineView.node.className = "";
    var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
    lineView.text.className = textClass || "";
  }

  function updateLineGutter(cm, lineView, lineN, dims) {
    if (lineView.gutter) {
      lineView.node.removeChild(lineView.gutter);
      lineView.gutter = null;
    }
    var markers = lineView.line.gutterMarkers;
    if (cm.options.lineNumbers || markers) {
      var wrap = ensureLineWrapped(lineView);
      var gutterWrap = lineView.gutter =
        wrap.insertBefore(elt("div", null, "CodeMirror-gutter-wrapper", "position: absolute; left: " +
                              (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"),
                          lineView.text);
      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
        lineView.lineNumber = gutterWrap.appendChild(
          elt("div", lineNumberFor(cm.options, lineN),
              "CodeMirror-linenumber CodeMirror-gutter-elt",
              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
              + cm.display.lineNumInnerWidth + "px"));
      if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
        var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
        if (found)
          gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                     dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
      }
    }
  }

  function updateLineWidgets(lineView, dims) {
    if (lineView.alignable) lineView.alignable = null;
    for (var node = lineView.node.firstChild, next; node; node = next) {
      var next = node.nextSibling;
      if (node.className == "CodeMirror-linewidget")
        lineView.node.removeChild(node);
    }
    insertLineWidgets(lineView, dims);
  }

  // Build a line's DOM representation from scratch
  function buildLineElement(cm, lineView, lineN, dims) {
    var built = getLineContent(cm, lineView);
    lineView.text = lineView.node = built.pre;
    if (built.bgClass) lineView.bgClass = built.bgClass;
    if (built.textClass) lineView.textClass = built.textClass;

    updateLineClasses(lineView);
    updateLineGutter(cm, lineView, lineN, dims);
    insertLineWidgets(lineView, dims);
    return lineView.node;
  }

  // A lineView may contain multiple logical lines (when merged by
  // collapsed spans). The widgets for all of them need to be drawn.
  function insertLineWidgets(lineView, dims) {
    insertLineWidgetsFor(lineView.line, lineView, dims, true);
    if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
      insertLineWidgetsFor(lineView.rest[i], lineView, dims, false);
  }

  function insertLineWidgetsFor(line, lineView, dims, allowAbove) {
    if (!line.widgets) return;
    var wrap = ensureLineWrapped(lineView);
    for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
      if (!widget.handleMouseEvents) node.ignoreEvents = true;
      positionLineWidget(widget, node, lineView, dims);
      if (allowAbove && widget.above)
        wrap.insertBefore(node, lineView.gutter || lineView.text);
      else
        wrap.appendChild(node);
      signalLater(widget, "redraw");
    }
  }

  function positionLineWidget(widget, node, lineView, dims) {
    if (widget.noHScroll) {
      (lineView.alignable || (lineView.alignable = [])).push(node);
      var width = dims.wrapperWidth;
      node.style.left = dims.fixedPos + "px";
      if (!widget.coverGutter) {
        width -= dims.gutterTotalWidth;
        node.style.paddingLeft = dims.gutterTotalWidth + "px";
      }
      node.style.width = width + "px";
    }
    if (widget.coverGutter) {
      node.style.zIndex = 5;
      node.style.position = "relative";
      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
    }
  }

  // POSITION OBJECT

  // A Pos instance represents a position within the text.
  var Pos = CodeMirror.Pos = function(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line; this.ch = ch;
  };

  // Compare two positions, return 0 if they are the same, a negative
  // number when a is less, and a positive number otherwise.
  var cmp = CodeMirror.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch; };

  function copyPos(x) {return Pos(x.line, x.ch);}
  function maxPos(a, b) { return cmp(a, b) < 0 ? b : a; }
  function minPos(a, b) { return cmp(a, b) < 0 ? a : b; }

  // SELECTION / CURSOR

  // Selection objects are immutable. A new one is created every time
  // the selection changes. A selection is one or more non-overlapping
  // (and non-touching) ranges, sorted, and an integer that indicates
  // which one is the primary selection (the one that's scrolled into
  // view, that getCursor returns, etc).
  function Selection(ranges, primIndex) {
    this.ranges = ranges;
    this.primIndex = primIndex;
  }

  Selection.prototype = {
    primary: function() { return this.ranges[this.primIndex]; },
    equals: function(other) {
      if (other == this) return true;
      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
      for (var i = 0; i < this.ranges.length; i++) {
        var here = this.ranges[i], there = other.ranges[i];
        if (cmp(here.anchor, there.anchor) != 0 || cmp(here.head, there.head) != 0) return false;
      }
      return true;
    },
    deepCopy: function() {
      for (var out = [], i = 0; i < this.ranges.length; i++)
        out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
      return new Selection(out, this.primIndex);
    },
    somethingSelected: function() {
      for (var i = 0; i < this.ranges.length; i++)
        if (!this.ranges[i].empty()) return true;
      return false;
    },
    contains: function(pos, end) {
      if (!end) end = pos;
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this.ranges[i];
        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
          return i;
      }
      return -1;
    }
  };

  function Range(anchor, head) {
    this.anchor = anchor; this.head = head;
  }

  Range.prototype = {
    from: function() { return minPos(this.anchor, this.head); },
    to: function() { return maxPos(this.anchor, this.head); },
    empty: function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    }
  };

  // Take an unsorted, potentially overlapping set of ranges, and
  // build a selection out of it. 'Consumes' ranges array (modifying
  // it).
  function normalizeSelection(ranges, primIndex) {
    var prim = ranges[primIndex];
    ranges.sort(function(a, b) { return cmp(a.from(), b.from()); });
    primIndex = indexOf(ranges, prim);
    for (var i = 1; i < ranges.length; i++) {
      var cur = ranges[i], prev = ranges[i - 1];
      if (cmp(prev.to(), cur.from()) >= 0) {
        var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
        var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
        if (i <= primIndex) --primIndex;
        ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
      }
    }
    return new Selection(ranges, primIndex);
  }

  function simpleSelection(anchor, head) {
    return new Selection([new Range(anchor, head || anchor)], 0);
  }

  // Most of the external API clips given positions to make sure they
  // actually exist within the document.
  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }
  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }
  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
  function clipPosArray(doc, array) {
    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
    return out;
  }

  // SELECTION UPDATES

  // The 'scroll' parameter given to many of these indicated whether
  // the new cursor position should be scrolled into view after
  // modifying the selection.

  // If shift is held or the extend flag is set, extends a range to
  // include a given position (and optionally a second position).
  // Otherwise, simply returns the range between the given positions.
  // Used for cursor motion and such.
  function extendRange(doc, range, head, other) {
    if (doc.cm && doc.cm.display.shift || doc.extend) {
      var anchor = range.anchor;
      if (other) {
        var posBefore = cmp(head, anchor) < 0;
        if (posBefore != (cmp(other, anchor) < 0)) {
          anchor = head;
          head = other;
        } else if (posBefore != (cmp(head, other) < 0)) {
          head = other;
        }
      }
      return new Range(anchor, head);
    } else {
      return new Range(other || head, head);
    }
  }

  // Extend the primary selection range, discard the rest.
  function extendSelection(doc, head, other, options) {
    setSelection(doc, new Selection([extendRange(doc, doc.sel.primary(), head, other)], 0), options);
  }

  // Extend all selections (pos is an array of selections with length
  // equal the number of selections)
  function extendSelections(doc, heads, options) {
    for (var out = [], i = 0; i < doc.sel.ranges.length; i++)
      out[i] = extendRange(doc, doc.sel.ranges[i], heads[i], null);
    var newSel = normalizeSelection(out, doc.sel.primIndex);
    setSelection(doc, newSel, options);
  }

  // Updates a single range in the selection.
  function replaceOneSelection(doc, i, range, options) {
    var ranges = doc.sel.ranges.slice(0);
    ranges[i] = range;
    setSelection(doc, normalizeSelection(ranges, doc.sel.primIndex), options);
  }

  // Reset the selection to a single range.
  function setSimpleSelection(doc, anchor, head, options) {
    setSelection(doc, simpleSelection(anchor, head), options);
  }

  // Give beforeSelectionChange handlers a change to influence a
  // selection update.
  function filterSelectionChange(doc, sel) {
    var obj = {
      ranges: sel.ranges,
      update: function(ranges) {
        this.ranges = [];
        for (var i = 0; i < ranges.length; i++)
          this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
                                     clipPos(doc, ranges[i].head));
      }
    };
    signal(doc, "beforeSelectionChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
    if (obj.ranges != sel.ranges) return normalizeSelection(obj.ranges, obj.ranges.length - 1);
    else return sel;
  }

  function setSelectionReplaceHistory(doc, sel, options) {
    var done = doc.history.done, last = lst(done);
    if (last && last.ranges) {
      done[done.length - 1] = sel;
      setSelectionNoUndo(doc, sel, options);
    } else {
      setSelection(doc, sel, options);
    }
  }

  // Set a new selection.
  function setSelection(doc, sel, options) {
    setSelectionNoUndo(doc, sel, options);
    addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
  }

  function setSelectionNoUndo(doc, sel, options) {
    if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
      sel = filterSelectionChange(doc, sel);

    var bias = options && options.bias ||
      (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
    setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));

    if (!(options && options.scroll === false) && doc.cm)
      ensureCursorVisible(doc.cm);
  }

  function setSelectionInner(doc, sel) {
    if (sel.equals(doc.sel)) return;

    doc.sel = sel;

    if (doc.cm) {
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;
      signalCursorActivity(doc.cm);
    }
    signalLater(doc, "cursorActivity", doc);
  }

  // Verify that the selection does not partially select any atomic
  // marked ranges.
  function reCheckSelection(doc) {
    setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false), sel_dontScroll);
  }

  // Return a selection that does not partially select any atomic
  // ranges.
  function skipAtomicInSelection(doc, sel, bias, mayClear) {
    var out;
    for (var i = 0; i < sel.ranges.length; i++) {
      var range = sel.ranges[i];
      var newAnchor = skipAtomic(doc, range.anchor, bias, mayClear);
      var newHead = skipAtomic(doc, range.head, bias, mayClear);
      if (out || newAnchor != range.anchor || newHead != range.head) {
        if (!out) out = sel.ranges.slice(0, i);
        out[i] = new Range(newAnchor, newHead);
      }
    }
    return out ? normalizeSelection(out, sel.primIndex) : sel;
  }

  // Ensure a given position is not inside an atomic range.
  function skipAtomic(doc, pos, bias, mayClear) {
    var flipped = false, curPos = pos;
    var dir = bias || 1;
    doc.cantEdit = false;
    search: for (;;) {
      var line = getLine(doc, curPos.line);
      if (line.markedSpans) {
        for (var i = 0; i < line.markedSpans.length; ++i) {
          var sp = line.markedSpans[i], m = sp.marker;
          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
            if (mayClear) {
              signal(m, "beforeCursorEnter");
              if (m.explicitlyCleared) {
                if (!line.markedSpans) break;
                else {--i; continue;}
              }
            }
            if (!m.atomic) continue;
            var newPos = m.find(dir < 0 ? -1 : 1);
            if (cmp(newPos, curPos) == 0) {
              newPos.ch += dir;
              if (newPos.ch < 0) {
                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
                else newPos = null;
              } else if (newPos.ch > line.text.length) {
                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
                else newPos = null;
              }
              if (!newPos) {
                if (flipped) {
                  // Driven in a corner -- no valid cursor position found at all
                  // -- try again *with* clearing, if we didn't already
                  if (!mayClear) return skipAtomic(doc, pos, bias, true);
                  // Otherwise, turn off editing until further notice, and return the start of the doc
                  doc.cantEdit = true;
                  return Pos(doc.first, 0);
                }
                flipped = true; newPos = pos; dir = -dir;
              }
            }
            curPos = newPos;
            continue search;
          }
        }
      }
      return curPos;
    }
  }

  // SELECTION DRAWING

  // Redraw the selection and/or cursor
  function updateSelection(cm) {
    var display = cm.display, doc = cm.doc;
    var curFragment = document.createDocumentFragment();
    var selFragment = document.createDocumentFragment();

    for (var i = 0; i < doc.sel.ranges.length; i++) {
      var range = doc.sel.ranges[i];
      var collapsed = range.empty();
      if (collapsed || cm.options.showCursorWhenSelecting)
        drawSelectionCursor(cm, range, curFragment);
      if (!collapsed)
        drawSelectionRange(cm, range, selFragment);
    }

    // Move the hidden textarea near the cursor to prevent scrolling artifacts
    if (cm.options.moveInputWithCursor) {
      var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
      var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
      var top = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                     headPos.top + lineOff.top - wrapOff.top));
      var left = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                      headPos.left + lineOff.left - wrapOff.left));
      display.inputDiv.style.top = top + "px";
      display.inputDiv.style.left = left + "px";
    }

    removeChildrenAndAdd(display.cursorDiv, curFragment);
    removeChildrenAndAdd(display.selectionDiv, selFragment);
  }

  // Draws a cursor for the given range
  function drawSelectionCursor(cm, range, output) {
    var pos = cursorCoords(cm, range.head, "div");

    var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
    cursor.style.left = pos.left + "px";
    cursor.style.top = pos.top + "px";
    cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

    if (pos.other) {
      // Secondary cursor, shown when on a 'jump' in bi-directional text
      var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
      otherCursor.style.display = "";
      otherCursor.style.left = pos.other.left + "px";
      otherCursor.style.top = pos.other.top + "px";
      otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
    }
  }

  // Draws the given range as a highlighted selection
  function drawSelectionRange(cm, range, output) {
    var display = cm.display, doc = cm.doc;
    var fragment = document.createDocumentFragment();
    var padding = paddingH(cm.display), leftSide = padding.left, rightSide = display.lineSpace.offsetWidth - padding.right;

    function add(left, top, width, bottom) {
      if (top < 0) top = 0;
      top = Math.round(top);
      bottom = Math.round(bottom);
      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
                               "px; top: " + top + "px; width: " + (width == null ? rightSide - left : width) +
                               "px; height: " + (bottom - top) + "px"));
    }

    function drawForLine(line, fromArg, toArg) {
      var lineObj = getLine(doc, line);
      var lineLen = lineObj.text.length;
      var start, end;
      function coords(ch, bias) {
        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
      }

      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
        var leftPos = coords(from, "left"), rightPos, left, right;
        if (from == to) {
          rightPos = leftPos;
          left = right = leftPos.left;
        } else {
          rightPos = coords(to - 1, "right");
          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
          left = leftPos.left;
          right = rightPos.right;
        }
        if (fromArg == null && from == 0) left = leftSide;
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
          add(left, leftPos.top, null, leftPos.bottom);
          left = leftSide;
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
        }
        if (toArg == null && to == lineLen) right = rightSide;
        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
          start = leftPos;
        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
          end = rightPos;
        if (left < leftSide + 1) left = leftSide;
        add(left, rightPos.top, right - left, rightPos.bottom);
      });
      return {start: start, end: end};
    }

    var sFrom = range.from(), sTo = range.to();
    if (sFrom.line == sTo.line) {
      drawForLine(sFrom.line, sFrom.ch, sTo.ch);
    } else {
      var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
      var singleVLine = visualLine(fromLine) == visualLine(toLine);
      var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
      var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
      if (singleVLine) {
        if (leftEnd.top < rightStart.top - 2) {
          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
          add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
        } else {
          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
        }
      }
      if (leftEnd.bottom < rightStart.top)
        add(leftSide, leftEnd.bottom, null, rightStart.top);
    }

    output.appendChild(fragment);
  }

  // Cursor-blinking
  function restartBlink(cm) {
    if (!cm.state.focused) return;
    var display = cm.display;
    clearInterval(display.blinker);
    var on = true;
    display.cursorDiv.style.visibility = "";
    if (cm.options.cursorBlinkRate > 0)
      display.blinker = setInterval(function() {
        display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
      }, cm.options.cursorBlinkRate);
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.viewTo)
      cm.state.highlight.set(time, bind(highlightWorker, cm));
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.frontier < doc.first) doc.frontier = doc.first;
    if (doc.frontier >= cm.display.viewTo) return;
    var end = +new Date + cm.options.workTime;
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));

    runInOp(cm, function() {
    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
      if (doc.frontier >= cm.display.viewFrom) { // Visible
        var oldStyles = line.styles;
        var highlighted = highlightLine(cm, line, state, true);
        line.styles = highlighted.styles;
        if (highlighted.classes) line.styleClasses = highlighted.classes;
        else if (line.styleClasses) line.styleClasses = null;
        var ischange = !oldStyles || oldStyles.length != line.styles.length;
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
        if (ischange) regLineChange(cm, doc.frontier, "text");
        line.stateAfter = copyState(doc.mode, state);
      } else {
        processLine(cm, line.text, state);
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
      }
      ++doc.frontier;
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true;
      }
    });
    });
  }

  // Finds the line to start with when starting a parse. Tries to
  // find a line with a stateAfter, so that it can start with a
  // valid state. If that fails, it returns the line with the
  // smallest indentation, which tends to need the least context to
  // parse correctly.
  function findStartLine(cm, n, precise) {
    var minindent, minline, doc = cm.doc;
    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
    for (var search = n; search > lim; --search) {
      if (search <= doc.first) return doc.first;
      var line = getLine(doc, search - 1);
      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
      var indented = countColumn(line.text, null, cm.options.tabSize);
      if (minline == null || minindent > indented) {
        minline = search - 1;
        minindent = indented;
      }
    }
    return minline;
  }

  function getStateBefore(cm, n, precise) {
    var doc = cm.doc, display = cm.display;
    if (!doc.mode.startState) return true;
    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
    if (!state) state = startState(doc.mode);
    else state = copyState(doc.mode, state);
    doc.iter(pos, n, function(line) {
      processLine(cm, line.text, state);
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo;
      line.stateAfter = save ? copyState(doc.mode, state) : null;
      ++pos;
    });
    if (precise) doc.frontier = pos;
    return state;
  }

  // POSITION MEASUREMENT

  function paddingTop(display) {return display.lineSpace.offsetTop;}
  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
  function paddingH(display) {
    if (display.cachedPaddingH) return display.cachedPaddingH;
    var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
    var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
    var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
    if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
    return data;
  }

  // Ensure the lineView.wrapping.heights array is populated. This is
  // an array of bottom offsets for the lines that make up a drawn
  // line. When lineWrapping is on, there might be more than one
  // height.
  function ensureLineHeights(cm, lineView, rect) {
    var wrapping = cm.options.lineWrapping;
    var curWidth = wrapping && cm.display.scroller.clientWidth;
    if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
      var heights = lineView.measure.heights = [];
      if (wrapping) {
        lineView.measure.width = curWidth;
        var rects = lineView.text.firstChild.getClientRects();
        for (var i = 0; i < rects.length - 1; i++) {
          var cur = rects[i], next = rects[i + 1];
          if (Math.abs(cur.bottom - next.bottom) > 2)
            heights.push((cur.bottom + next.top) / 2 - rect.top);
        }
      }
      heights.push(rect.bottom - rect.top);
    }
  }

  // Find a line map (mapping character offsets to text nodes) and a
  // measurement cache for the given line number. (A line view might
  // contain multiple lines when collapsed ranges are present.)
  function mapFromLineView(lineView, line, lineN) {
    if (lineView.line == line)
      return {map: lineView.measure.map, cache: lineView.measure.cache};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineView.rest[i] == line)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineNo(lineView.rest[i]) > lineN)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: true};
  }

  // Render a line into the hidden node display.externalMeasured. Used
  // when measurement is needed for a line that's not in the viewport.
  function updateExternalMeasurement(cm, line) {
    line = visualLine(line);
    var lineN = lineNo(line);
    var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
    view.lineN = lineN;
    var built = view.built = buildLineContent(cm, view);
    view.text = built.pre;
    removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
    return view;
  }

  // Get a {top, bottom, left, right} box (in line-local coordinates)
  // for a given character.
  function measureChar(cm, line, ch, bias) {
    return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
  }

  // Find a line view that corresponds to the given line number.
  function findViewForLine(cm, lineN) {
    if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
      return cm.display.view[findViewIndex(cm, lineN)];
    var ext = cm.display.externalMeasured;
    if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
      return ext;
  }

  // Measurement can be split in two steps, the set-up work that
  // applies to the whole line, and the measurement of the actual
  // character. Functions like coordsChar, that need to do a lot of
  // measurements in a row, can thus ensure that the set-up work is
  // only done once.
  function prepareMeasureForLine(cm, line) {
    var lineN = lineNo(line);
    var view = findViewForLine(cm, lineN);
    if (view && !view.text)
      view = null;
    else if (view && view.changes)
      updateLineForChanges(cm, view, lineN, getDimensions(cm));
    if (!view)
      view = updateExternalMeasurement(cm, line);

    var info = mapFromLineView(view, line, lineN);
    return {
      line: line, view: view, rect: null,
      map: info.map, cache: info.cache, before: info.before,
      hasHeights: false
    };
  }

  // Given a prepared measurement object, measures the position of an
  // actual character (or fetches it from the cache).
  function measureCharPrepared(cm, prepared, ch, bias) {
    if (prepared.before) ch = -1;
    var key = ch + (bias || ""), found;
    if (prepared.cache.hasOwnProperty(key)) {
      found = prepared.cache[key];
    } else {
      if (!prepared.rect)
        prepared.rect = prepared.view.text.getBoundingClientRect();
      if (!prepared.hasHeights) {
        ensureLineHeights(cm, prepared.view, prepared.rect);
        prepared.hasHeights = true;
      }
      found = measureCharInner(cm, prepared, ch, bias);
      if (!found.bogus) prepared.cache[key] = found;
    }
    return {left: found.left, right: found.right, top: found.top, bottom: found.bottom};
  }

  var nullRect = {left: 0, right: 0, top: 0, bottom: 0};

  function measureCharInner(cm, prepared, ch, bias) {
    var map = prepared.map;

    var node, start, end, collapse;
    // First, search the line map for the text node corresponding to,
    // or closest to, the target character.
    for (var i = 0; i < map.length; i += 3) {
      var mStart = map[i], mEnd = map[i + 1];
      if (ch < mStart) {
        start = 0; end = 1;
        collapse = "left";
      } else if (ch < mEnd) {
        start = ch - mStart;
        end = start + 1;
      } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
        end = mEnd - mStart;
        start = end - 1;
        if (ch >= mEnd) collapse = "right";
      }
      if (start != null) {
        node = map[i + 2];
        if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
          collapse = bias;
        if (bias == "left" && start == 0)
          while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
            node = map[(i -= 3) + 2];
            collapse = "left";
          }
        if (bias == "right" && start == mEnd - mStart)
          while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
            node = map[(i += 3) + 2];
            collapse = "right";
          }
        break;
      }
    }

    var rect;
    if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
      while (start && isExtendingChar(prepared.line.text.charAt(mStart + start))) --start;
      while (mStart + end < mEnd && isExtendingChar(prepared.line.text.charAt(mStart + end))) ++end;
      if (ie_upto8 && start == 0 && end == mEnd - mStart) {
        rect = node.parentNode.getBoundingClientRect();
      } else if (ie && cm.options.lineWrapping) {
        var rects = range(node, start, end).getClientRects();
        if (rects.length)
          rect = rects[bias == "right" ? rects.length - 1 : 0];
        else
          rect = nullRect;
      } else {
        rect = range(node, start, end).getBoundingClientRect() || nullRect;
      }
    } else { // If it is a widget, simply get the box for the whole widget.
      if (start > 0) collapse = bias = "right";
      var rects;
      if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
        rect = rects[bias == "right" ? rects.length - 1 : 0];
      else
        rect = node.getBoundingClientRect();
    }
    if (ie_upto8 && !start && (!rect || !rect.left && !rect.right)) {
      var rSpan = node.parentNode.getClientRects()[0];
      if (rSpan)
        rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom};
      else
        rect = nullRect;
    }

    var top, bot = (rect.bottom + rect.top) / 2 - prepared.rect.top;
    var heights = prepared.view.measure.heights;
    for (var i = 0; i < heights.length - 1; i++)
      if (bot < heights[i]) break;
    top = i ? heights[i - 1] : 0; bot = heights[i];
    var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
                  right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
                  top: top, bottom: bot};
    if (!rect.left && !rect.right) result.bogus = true;
    return result;
  }

  function clearLineMeasurementCacheFor(lineView) {
    if (lineView.measure) {
      lineView.measure.cache = {};
      lineView.measure.heights = null;
      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
        lineView.measure.caches[i] = {};
    }
  }

  function clearLineMeasurementCache(cm) {
    cm.display.externalMeasure = null;
    removeChildren(cm.display.lineMeasure);
    for (var i = 0; i < cm.display.view.length; i++)
      clearLineMeasurementCacheFor(cm.display.view[i]);
  }

  function clearCaches(cm) {
    clearLineMeasurementCache(cm);
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
    cm.display.lineNumChars = null;
  }

  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

  // Converts a {top, bottom, left, right} box from line-local
  // coordinates into another coordinate system. Context may be one of
  // "line", "div" (display.lineDiv), "local"/null (editor), or "page".
  function intoCoordSystem(cm, lineObj, rect, context) {
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
      var size = widgetHeight(lineObj.widgets[i]);
      rect.top += size; rect.bottom += size;
    }
    if (context == "line") return rect;
    if (!context) context = "local";
    var yOff = heightAtLine(lineObj);
    if (context == "local") yOff += paddingTop(cm.display);
    else yOff -= cm.display.viewOffset;
    if (context == "page" || context == "window") {
      var lOff = cm.display.lineSpace.getBoundingClientRect();
      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
      rect.left += xOff; rect.right += xOff;
    }
    rect.top += yOff; rect.bottom += yOff;
    return rect;
  }

  // Coverts a box from "div" coords to another coordinate system.
  // Context may be "window", "page", "div", or "local"/null.
  function fromCoordSystem(cm, coords, context) {
    if (context == "div") return coords;
    var left = coords.left, top = coords.top;
    // First move into "page" coordinate system
    if (context == "page") {
      left -= pageScrollX();
      top -= pageScrollY();
    } else if (context == "local" || !context) {
      var localBox = cm.display.sizer.getBoundingClientRect();
      left += localBox.left;
      top += localBox.top;
    }

    var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
  }

  function charCoords(cm, pos, context, lineObj, bias) {
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
  }

  // Returns a box for a given cursor position, which may have an
  // 'other' property containing the position of the secondary cursor
  // on a bidi boundary.
  function cursorCoords(cm, pos, context, lineObj, preparedMeasure) {
    lineObj = lineObj || getLine(cm.doc, pos.line);
    if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
    function get(ch, right) {
      var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left");
      if (right) m.left = m.right; else m.right = m.left;
      return intoCoordSystem(cm, lineObj, m, context);
    }
    function getBidi(ch, partPos) {
      var part = order[partPos], right = part.level % 2;
      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
        part = order[--partPos];
        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
        right = true;
      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
        part = order[++partPos];
        ch = bidiLeft(part) - part.level % 2;
        right = false;
      }
      if (right && ch == part.to && ch > part.from) return get(ch - 1);
      return get(ch, right);
    }
    var order = getOrder(lineObj), ch = pos.ch;
    if (!order) return get(ch);
    var partPos = getBidiPartAt(order, ch);
    var val = getBidi(ch, partPos);
    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
    return val;
  }

  // Used to cheaply estimate the coordinates for a position. Used for
  // intermediate scroll updates.
  function estimateCoords(cm, pos) {
    var left = 0, pos = clipPos(cm.doc, pos);
    if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
    var lineObj = getLine(cm.doc, pos.line);
    var top = heightAtLine(lineObj) + paddingTop(cm.display);
    return {left: left, right: left, top: top, bottom: top + lineObj.height};
  }

  // Positions returned by coordsChar contain some extra information.
  // xRel is the relative x position of the input coordinates compared
  // to the found position (so xRel > 0 means the coordinates are to
  // the right of the character position, for example). When outside
  // is true, that means the coordinates lie outside the line's
  // vertical range.
  function PosWithInfo(line, ch, outside, xRel) {
    var pos = Pos(line, ch);
    pos.xRel = xRel;
    if (outside) pos.outside = true;
    return pos;
  }

  // Compute the character position closest to the given coordinates.
  // Input must be lineSpace-local ("div" coordinate system).
  function coordsChar(cm, x, y) {
    var doc = cm.doc;
    y += cm.display.viewOffset;
    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
    var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
    if (lineN > last)
      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
    if (x < 0) x = 0;

    var lineObj = getLine(doc, lineN);
    for (;;) {
      var found = coordsCharInner(cm, lineObj, lineN, x, y);
      var merged = collapsedSpanAtEnd(lineObj);
      var mergedPos = merged && merged.find(0, true);
      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
        lineN = lineNo(lineObj = mergedPos.to.line);
      else
        return found;
    }
  }

  function coordsCharInner(cm, lineObj, lineNo, x, y) {
    var innerOff = y - heightAtLine(lineObj);
    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
    var preparedMeasure = prepareMeasureForLine(cm, lineObj);

    function getX(ch) {
      var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, preparedMeasure);
      wrongLine = true;
      if (innerOff > sp.bottom) return sp.left - adjust;
      else if (innerOff < sp.top) return sp.left + adjust;
      else wrongLine = false;
      return sp.left;
    }

    var bidi = getOrder(lineObj), dist = lineObj.text.length;
    var from = lineLeft(lineObj), to = lineRight(lineObj);
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
    // Do a binary search between these bounds.
    for (;;) {
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
        var ch = x < fromX || x - fromX <= toX - x ? from : to;
        var xDiff = x - (ch == from ? fromX : toX);
        while (isExtendingChar(lineObj.text.charAt(ch))) ++ch;
        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
                              xDiff < -1 ? -1 : xDiff > 1 ? 1 : 0);
        return pos;
      }
      var step = Math.ceil(dist / 2), middle = from + step;
      if (bidi) {
        middle = from;
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
      }
      var middleX = getX(middle);
      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
    }
  }

  var measureText;
  // Compute the default text height.
  function textHeight(display) {
    if (display.cachedTextHeight != null) return display.cachedTextHeight;
    if (measureText == null) {
      measureText = elt("pre");
      // Measure a bunch of lines, for browsers that compute
      // fractional heights.
      for (var i = 0; i < 49; ++i) {
        measureText.appendChild(document.createTextNode("x"));
        measureText.appendChild(elt("br"));
      }
      measureText.appendChild(document.createTextNode("x"));
    }
    removeChildrenAndAdd(display.measure, measureText);
    var height = measureText.offsetHeight / 50;
    if (height > 3) display.cachedTextHeight = height;
    removeChildren(display.measure);
    return height || 1;
  }

  // Compute the default character width.
  function charWidth(display) {
    if (display.cachedCharWidth != null) return display.cachedCharWidth;
    var anchor = elt("span", "xxxxxxxxxx");
    var pre = elt("pre", [anchor]);
    removeChildrenAndAdd(display.measure, pre);
    var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
    if (width > 2) display.cachedCharWidth = width;
    return width || 10;
  }

  // OPERATIONS

  // Operations are used to wrap a series of changes to the editor
  // state in such a way that each change won't have to update the
  // cursor and display (which would be awkward, slow, and
  // error-prone). Instead, display updates are batched and then all
  // combined and executed at once.

  var nextOpId = 0;
  // Start a new operation.
  function startOperation(cm) {
    cm.curOp = {
      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
      startHeight: cm.doc.height, // Used to detect need to update scrollbar
      forceUpdate: false,      // Used to force a redraw
      updateInput: null,       // Whether to reset the input textarea
      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
      changeObjs: null,        // Accumulated changes, for firing change events
      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
      selectionChanged: false, // Whether the selection needs to be redrawn
      updateMaxLine: false,    // Set when the widest line needs to be determined anew
      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
      scrollToPos: null,       // Used to scroll to a specific position
      id: ++nextOpId           // Unique ID
    };
    if (!delayedCallbackDepth++) delayedCallbacks = [];
  }

  // Finish an operation, updating the display and signalling delayed events
  function endOperation(cm) {
    var op = cm.curOp, doc = cm.doc, display = cm.display;
    cm.curOp = null;

    if (op.updateMaxLine) findMaxLine(cm);

    // If it looks like an update might be needed, call updateDisplay
    if (op.viewChanged || op.forceUpdate || op.scrollTop != null ||
        op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
                           op.scrollToPos.to.line >= display.viewTo) ||
        display.maxLineChanged && cm.options.lineWrapping) {
      var updated = updateDisplay(cm, {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
      if (cm.display.scroller.offsetHeight) cm.doc.scrollTop = cm.display.scroller.scrollTop;
    }
    // If no update was run, but the selection changed, redraw that.
    if (!updated && op.selectionChanged) updateSelection(cm);
    if (!updated && op.startHeight != cm.doc.height) updateScrollbars(cm);

    // Abort mouse wheel delta measurement, when scrolling explicitly
    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
      display.wheelStartX = display.wheelStartY = null;

    // Propagate the scroll position to the actual DOM scroller
    if (op.scrollTop != null && display.scroller.scrollTop != op.scrollTop) {
      var top = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, op.scrollTop));
      display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = top;
    }
    if (op.scrollLeft != null && display.scroller.scrollLeft != op.scrollLeft) {
      var left = Math.max(0, Math.min(display.scroller.scrollWidth - display.scroller.clientWidth, op.scrollLeft));
      display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = left;
      alignHorizontally(cm);
    }
    // If we need to scroll a specific position into view, do so.
    if (op.scrollToPos) {
      var coords = scrollPosIntoView(cm, clipPos(cm.doc, op.scrollToPos.from),
                                     clipPos(cm.doc, op.scrollToPos.to), op.scrollToPos.margin);
      if (op.scrollToPos.isCursor && cm.state.focused) maybeScrollWindow(cm, coords);
    }

    if (op.selectionChanged) restartBlink(cm);

    if (cm.state.focused && op.updateInput)
      resetInput(cm, op.typing);

    // Fire events for markers that are hidden/unidden by editing or
    // undoing
    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) for (var i = 0; i < hidden.length; ++i)
      if (!hidden[i].lines.length) signal(hidden[i], "hide");
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

    var delayed;
    if (!--delayedCallbackDepth) {
      delayed = delayedCallbacks;
      delayedCallbacks = null;
    }
    // Fire change events, and delayed event handlers
    if (op.changeObjs)
      signal(cm, "changes", cm, op.changeObjs);
    if (delayed) for (var i = 0; i < delayed.length; ++i) delayed[i]();
    if (op.cursorActivityHandlers)
      for (var i = 0; i < op.cursorActivityHandlers.length; i++)
        op.cursorActivityHandlers[i](cm);
  }

  // Run the given function in an operation
  function runInOp(cm, f) {
    if (cm.curOp) return f();
    startOperation(cm);
    try { return f(); }
    finally { endOperation(cm); }
  }
  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm, f) {
    return function() {
      if (cm.curOp) return f.apply(cm, arguments);
      startOperation(cm);
      try { return f.apply(cm, arguments); }
      finally { endOperation(cm); }
    };
  }
  // Used to add methods to editor and doc instances, wrapping them in
  // operations.
  function methodOp(f) {
    return function() {
      if (this.curOp) return f.apply(this, arguments);
      startOperation(this);
      try { return f.apply(this, arguments); }
      finally { endOperation(this); }
    };
  }
  function docMethodOp(f) {
    return function() {
      var cm = this.cm;
      if (!cm || cm.curOp) return f.apply(this, arguments);
      startOperation(cm);
      try { return f.apply(this, arguments); }
      finally { endOperation(cm); }
    };
  }

  // VIEW TRACKING

  // These objects are used to represent the visible (currently drawn)
  // part of the document. A LineView may correspond to multiple
  // logical lines, if those are connected by collapsed ranges.
  function LineView(doc, line, lineN) {
    // The starting line
    this.line = line;
    // Continuing lines, if any
    this.rest = visualLineContinued(line);
    // Number of logical lines in this visual line
    this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
    this.node = this.text = null;
    this.hidden = lineIsHidden(doc, line);
  }

  // Create a range of LineView objects for the given lines.
  function buildViewArray(cm, from, to) {
    var array = [], nextPos;
    for (var pos = from; pos < to; pos = nextPos) {
      var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
      nextPos = pos + view.size;
      array.push(view);
    }
    return array;
  }

  // Updates the display.view data structure for a given change to the
  // document. From and to are in pre-change coordinates. Lendiff is
  // the amount of lines added or subtracted by the change. This is
  // used for changes that span multiple lines, or change the way
  // lines are divided into visual lines. regLineChange (below)
  // registers single-line changes.
  function regChange(cm, from, to, lendiff) {
    if (from == null) from = cm.doc.first;
    if (to == null) to = cm.doc.first + cm.doc.size;
    if (!lendiff) lendiff = 0;

    var display = cm.display;
    if (lendiff && to < display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers > from))
      display.updateLineNumbers = from;

    cm.curOp.viewChanged = true;

    if (from >= display.viewTo) { // Change after
      if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
        resetView(cm);
    } else if (to <= display.viewFrom) { // Change before
      if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
        resetView(cm);
      } else {
        display.viewFrom += lendiff;
        display.viewTo += lendiff;
      }
    } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
      resetView(cm);
    } else if (from <= display.viewFrom) { // Top overlap
      var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cut) {
        display.view = display.view.slice(cut.index);
        display.viewFrom = cut.lineN;
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    } else if (to >= display.viewTo) { // Bottom overlap
      var cut = viewCuttingPoint(cm, from, from, -1);
      if (cut) {
        display.view = display.view.slice(0, cut.index);
        display.viewTo = cut.lineN;
      } else {
        resetView(cm);
      }
    } else { // Gap in the middle
      var cutTop = viewCuttingPoint(cm, from, from, -1);
      var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cutTop && cutBot) {
        display.view = display.view.slice(0, cutTop.index)
          .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
          .concat(display.view.slice(cutBot.index));
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    }

    var ext = display.externalMeasured;
    if (ext) {
      if (to < ext.lineN)
        ext.lineN += lendiff;
      else if (from < ext.lineN + ext.size)
        display.externalMeasured = null;
    }
  }

  // Register a change to a single line. Type must be one of "text",
  // "gutter", "class", "widget"
  function regLineChange(cm, line, type) {
    cm.curOp.viewChanged = true;
    var display = cm.display, ext = cm.display.externalMeasured;
    if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
      display.externalMeasured = null;

    if (line < display.viewFrom || line >= display.viewTo) return;
    var lineView = display.view[findViewIndex(cm, line)];
    if (lineView.node == null) return;
    var arr = lineView.changes || (lineView.changes = []);
    if (indexOf(arr, type) == -1) arr.push(type);
  }

  // Clear the view.
  function resetView(cm) {
    cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
    cm.display.view = [];
    cm.display.viewOffset = 0;
  }

  // Find the view element corresponding to a given line. Return null
  // when the line isn't visible.
  function findViewIndex(cm, n) {
    if (n >= cm.display.viewTo) return null;
    n -= cm.display.viewFrom;
    if (n < 0) return null;
    var view = cm.display.view;
    for (var i = 0; i < view.length; i++) {
      n -= view[i].size;
      if (n < 0) return i;
    }
  }

  function viewCuttingPoint(cm, oldN, newN, dir) {
    var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
    if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
      return {index: index, lineN: newN};
    for (var i = 0, n = cm.display.viewFrom; i < index; i++)
      n += view[i].size;
    if (n != oldN) {
      if (dir > 0) {
        if (index == view.length - 1) return null;
        diff = (n + view[index].size) - oldN;
        index++;
      } else {
        diff = n - oldN;
      }
      oldN += diff; newN += diff;
    }
    while (visualLineNo(cm.doc, newN) != newN) {
      if (index == (dir < 0 ? 0 : view.length - 1)) return null;
      newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
      index += dir;
    }
    return {index: index, lineN: newN};
  }

  // Force the view to cover a given range, adding empty view element
  // or clipping off existing ones as needed.
  function adjustView(cm, from, to) {
    var display = cm.display, view = display.view;
    if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
      display.view = buildViewArray(cm, from, to);
      display.viewFrom = from;
    } else {
      if (display.viewFrom > from)
        display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
      else if (display.viewFrom < from)
        display.view = display.view.slice(findViewIndex(cm, from));
      display.viewFrom = from;
      if (display.viewTo < to)
        display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
      else if (display.viewTo > to)
        display.view = display.view.slice(0, findViewIndex(cm, to));
    }
    display.viewTo = to;
  }

  // Count the number of lines in the view whose DOM representation is
  // out of date (or nonexistent).
  function countDirtyView(cm) {
    var view = cm.display.view, dirty = 0;
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
    }
    return dirty;
  }

  // INPUT HANDLING

  // Poll for input changes, using the normal rate of polling. This
  // runs as long as the editor is focused.
  function slowPoll(cm) {
    if (cm.display.pollingFast) return;
    cm.display.poll.set(cm.options.pollInterval, function() {
      readInput(cm);
      if (cm.state.focused) slowPoll(cm);
    });
  }

  // When an event has just come in that is likely to add or change
  // something in the input textarea, we poll faster, to ensure that
  // the change appears on the screen quickly.
  function fastPoll(cm) {
    var missed = false;
    cm.display.pollingFast = true;
    function p() {
      var changed = readInput(cm);
      if (!changed && !missed) {missed = true; cm.display.poll.set(60, p);}
      else {cm.display.pollingFast = false; slowPoll(cm);}
    }
    cm.display.poll.set(20, p);
  }

  // Read input from the textarea, and update the document to match.
  // When something is selected, it is present in the textarea, and
  // selected (unless it is huge, in which case a placeholder is
  // used). When nothing is selected, the cursor sits after previously
  // seen text (can be empty), which is stored in prevInput (we must
  // not reset the textarea when typing, because that breaks IME).
  function readInput(cm) {
    var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc;
    // Since this is called a *lot*, try to bail out as cheaply as
    // possible when it is clear that nothing happened. hasSelection
    // will be the case when there is a lot of text in the textarea,
    // in which case reading its value would be expensive.
    if (!cm.state.focused || (hasSelection(input) && !prevInput) || isReadOnly(cm) || cm.options.disableInput)
      return false;
    // See paste handler for more on the fakedLastChar kludge
    if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
      input.value = input.value.substring(0, input.value.length - 1);
      cm.state.fakedLastChar = false;
    }
    var text = input.value;
    // If nothing changed, bail.
    if (text == prevInput && !cm.somethingSelected()) return false;
    // Work around nonsensical selection resetting in IE9/10
    if (ie && !ie_upto8 && cm.display.inputHasSelection === text) {
      resetInput(cm);
      return false;
    }

    var withOp = !cm.curOp;
    if (withOp) startOperation(cm);
    cm.display.shift = false;

    if (text.charCodeAt(0) == 0x200b && doc.sel == cm.display.selForContextMenu && !prevInput)
      prevInput = "\u200b";
    // Find the part of the input that is actually new
    var same = 0, l = Math.min(prevInput.length, text.length);
    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;
    var inserted = text.slice(same), textLines = splitLines(inserted);

    // When pasing N lines into N selections, insert one line per selection
    var multiPaste = cm.state.pasteIncoming && textLines.length > 1 && doc.sel.ranges.length == textLines.length;

    // Normal behavior is to insert the new text into every selection
    for (var i = doc.sel.ranges.length - 1; i >= 0; i--) {
      var range = doc.sel.ranges[i];
      var from = range.from(), to = range.to();
      // Handle deletion
      if (same < prevInput.length)
        from = Pos(from.line, from.ch - (prevInput.length - same));
      // Handle overwrite
      else if (cm.state.overwrite && range.empty() && !cm.state.pasteIncoming)
        to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
      var updateInput = cm.curOp.updateInput;
      var changeEvent = {from: from, to: to, text: multiPaste ? [textLines[i]] : textLines,
                         origin: cm.state.pasteIncoming ? "paste" : cm.state.cutIncoming ? "cut" : "+input"};
      makeChange(cm.doc, changeEvent);
      signalLater(cm, "inputRead", cm, changeEvent);
      // When an 'electric' character is inserted, immediately trigger a reindent
      if (inserted && !cm.state.pasteIncoming && cm.options.electricChars &&
          cm.options.smartIndent && range.head.ch < 100 &&
          (!i || doc.sel.ranges[i - 1].head.line != range.head.line)) {
        var mode = cm.getModeAt(range.head);
        if (mode.electricChars) {
          for (var j = 0; j < mode.electricChars.length; j++)
            if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
              indentLine(cm, range.head.line, "smart");
              break;
            }
        } else if (mode.electricInput) {
          var end = changeEnd(changeEvent);
          if (mode.electricInput.test(getLine(doc, end.line).text.slice(0, end.ch)))
            indentLine(cm, range.head.line, "smart");
        }
      }
    }
    ensureCursorVisible(cm);
    cm.curOp.updateInput = updateInput;
    cm.curOp.typing = true;

    // Don't leave long text in the textarea, since it makes further polling slow
    if (text.length > 1000 || text.indexOf("\n") > -1) input.value = cm.display.prevInput = "";
    else cm.display.prevInput = text;
    if (withOp) endOperation(cm);
    cm.state.pasteIncoming = cm.state.cutIncoming = false;
    return true;
  }

  // Reset the input to correspond to the selection (or to be empty,
  // when not typing and nothing is selected)
  function resetInput(cm, typing) {
    var minimal, selected, doc = cm.doc;
    if (cm.somethingSelected()) {
      cm.display.prevInput = "";
      var range = doc.sel.primary();
      minimal = hasCopyEvent &&
        (range.to().line - range.from().line > 100 || (selected = cm.getSelection()).length > 1000);
      var content = minimal ? "-" : selected || cm.getSelection();
      cm.display.input.value = content;
      if (cm.state.focused) selectInput(cm.display.input);
      if (ie && !ie_upto8) cm.display.inputHasSelection = content;
    } else if (!typing) {
      cm.display.prevInput = cm.display.input.value = "";
      if (ie && !ie_upto8) cm.display.inputHasSelection = null;
    }
    cm.display.inaccurateSelection = minimal;
  }

  function focusInput(cm) {
    if (cm.options.readOnly != "nocursor" && (!mobile || activeElt() != cm.display.input))
      cm.display.input.focus();
  }

  function ensureFocus(cm) {
    if (!cm.state.focused) { focusInput(cm); onFocus(cm); }
  }

  function isReadOnly(cm) {
    return cm.options.readOnly || cm.doc.cantEdit;
  }

  // EVENT HANDLERS

  // Attach the necessary event handlers when initializing the editor
  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, "mousedown", operation(cm, onMouseDown));
    // Older IE's will not fire a second mousedown for a double click
    if (ie_upto10)
      on(d.scroller, "dblclick", operation(cm, function(e) {
        if (signalDOMEvent(cm, e)) return;
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        var word = findWordAt(cm, pos);
        extendSelection(cm.doc, word.anchor, word.head);
      }));
    else
      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
    // Prevent normal selection in the editor (we handle our own)
    on(d.lineSpace, "selectstart", function(e) {
      if (!eventInWidget(d, e)) e_preventDefault(e);
    });
    // Some browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for these browsers.
    if (!captureRightClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

    // Sync scrolling between fake scrollbars and real scrollable
    // area, ensure viewport is updated when scrolling.
    on(d.scroller, "scroll", function() {
      if (d.scroller.clientHeight) {
        setScrollTop(cm, d.scroller.scrollTop);
        setScrollLeft(cm, d.scroller.scrollLeft, true);
        signal(cm, "scroll", cm);
      }
    });
    on(d.scrollbarV, "scroll", function() {
      if (d.scroller.clientHeight) setScrollTop(cm, d.scrollbarV.scrollTop);
    });
    on(d.scrollbarH, "scroll", function() {
      if (d.scroller.clientHeight) setScrollLeft(cm, d.scrollbarH.scrollLeft);
    });

    // Listen to wheel events in order to try and update the viewport on time.
    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

    // Prevent clicks in the scrollbars from killing focus
    function reFocus() { if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); }
    on(d.scrollbarH, "mousedown", reFocus);
    on(d.scrollbarV, "mousedown", reFocus);
    // Prevent wrapper from ever scrolling
    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

    on(d.input, "keyup", operation(cm, onKeyUp));
    on(d.input, "input", function() {
      if (ie && !ie_upto8 && cm.display.inputHasSelection) cm.display.inputHasSelection = null;
      fastPoll(cm);
    });
    on(d.input, "keydown", operation(cm, onKeyDown));
    on(d.input, "keypress", operation(cm, onKeyPress));
    on(d.input, "focus", bind(onFocus, cm));
    on(d.input, "blur", bind(onBlur, cm));

    function drag_(e) {
      if (!signalDOMEvent(cm, e)) e_stop(e);
    }
    if (cm.options.dragDrop) {
      on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});
      on(d.scroller, "dragenter", drag_);
      on(d.scroller, "dragover", drag_);
      on(d.scroller, "drop", operation(cm, onDrop));
    }
    on(d.scroller, "paste", function(e) {
      if (eventInWidget(d, e)) return;
      cm.state.pasteIncoming = true;
      focusInput(cm);
      fastPoll(cm);
    });
    on(d.input, "paste", function() {
      // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
      // Add a char to the end of textarea before paste occur so that
      // selection doesn't span to the end of textarea.
      if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
        var start = d.input.selectionStart, end = d.input.selectionEnd;
        d.input.value += "$";
        d.input.selectionStart = start;
        d.input.selectionEnd = end;
        cm.state.fakedLastChar = true;
      }
      cm.state.pasteIncoming = true;
      fastPoll(cm);
    });

    function prepareCopyCut(e) {
      if (cm.somethingSelected()) {
        if (d.inaccurateSelection) {
          d.prevInput = "";
          d.inaccurateSelection = false;
          d.input.value = cm.getSelection();
          selectInput(d.input);
        }
      } else {
        var text = "", ranges = [];
        for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
          var line = cm.doc.sel.ranges[i].head.line;
          var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
          ranges.push(lineRange);
          text += cm.getRange(lineRange.anchor, lineRange.head);
        }
        if (e.type == "cut") {
          cm.setSelections(ranges, null, sel_dontScroll);
        } else {
          d.prevInput = "";
          d.input.value = text;
          selectInput(d.input);
        }
      }
      if (e.type == "cut") cm.state.cutIncoming = true;
    }
    on(d.input, "cut", prepareCopyCut);
    on(d.input, "copy", prepareCopyCut);

    // Needed to handle Tab key in KHTML
    if (khtml) on(d.sizer, "mouseup", function() {
      if (activeElt() == d.input) d.input.blur();
      focusInput(cm);
    });
  }

  // Called when the window resizes
  function onResize(cm) {
    // Might be a text scaling operation, clear size caches.
    var d = cm.display;
    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
    cm.setSize();
  }

  // MOUSE EVENTS

  // Return true when the given mouse event happened in a widget
  function eventInWidget(display, e) {
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
      if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return true;
    }
  }

  // Given a mouse event, find the corresponding position. If liberal
  // is false, it checks whether a gutter or scrollbar was clicked,
  // and returns null if it was. forRect is used by rectangular
  // selections, and tries to estimate a character position even for
  // coordinates beyond the right of the text.
  function posFromMouse(cm, e, liberal, forRect) {
    var display = cm.display;
    if (!liberal) {
      var target = e_target(e);
      if (target == display.scrollbarH || target == display.scrollbarV ||
          target == display.scrollbarFiller || target == display.gutterFiller) return null;
    }
    var x, y, space = display.lineSpace.getBoundingClientRect();
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
    try { x = e.clientX - space.left; y = e.clientY - space.top; }
    catch (e) { return null; }
    var coords = coordsChar(cm, x, y), line;
    if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
      var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
      coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
    }
    return coords;
  }

  // A mouse down can be a single click, double click, triple click,
  // start of selection drag, start of text drag, new cursor
  // (ctrl-click), rectangle drag (alt-drag), or xwin
  // middle-click-paste. Or it might be a click on something we should
  // not interfere with, such as a scrollbar or widget.
  function onMouseDown(e) {
    if (signalDOMEvent(this, e)) return;
    var cm = this, display = cm.display;
    display.shift = e.shiftKey;

    if (eventInWidget(display, e)) {
      if (!webkit) {
        // Briefly turn off draggability, to allow widgets to do
        // normal dragging things.
        display.scroller.draggable = false;
        setTimeout(function(){display.scroller.draggable = true;}, 100);
      }
      return;
    }
    if (clickInGutter(cm, e)) return;
    var start = posFromMouse(cm, e);
    window.focus();

    switch (e_button(e)) {
    case 1:
      if (start)
        leftButtonDown(cm, e, start);
      else if (e_target(e) == display.scroller)
        e_preventDefault(e);
      break;
    case 2:
      if (webkit) cm.state.lastMiddleDown = +new Date;
      if (start) extendSelection(cm.doc, start);
      setTimeout(bind(focusInput, cm), 20);
      e_preventDefault(e);
      break;
    case 3:
      if (captureRightClick) onContextMenu(cm, e);
      break;
    }
  }

  var lastClick, lastDoubleClick;
  function leftButtonDown(cm, e, start) {
    setTimeout(bind(ensureFocus, cm), 0);

    var now = +new Date, type;
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && cmp(lastDoubleClick.pos, start) == 0) {
      type = "triple";
    } else if (lastClick && lastClick.time > now - 400 && cmp(lastClick.pos, start) == 0) {
      type = "double";
      lastDoubleClick = {time: now, pos: start};
    } else {
      type = "single";
      lastClick = {time: now, pos: start};
    }

    var sel = cm.doc.sel, modifier = mac ? e.metaKey : e.ctrlKey;
    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) &&
        type == "single" && sel.contains(start) > -1 && sel.somethingSelected())
      leftButtonStartDrag(cm, e, start, modifier);
    else
      leftButtonSelect(cm, e, start, type, modifier);
  }

  // Start a text drag. When it ends, see if any dragging actually
  // happen, and treat as a click if it didn't.
  function leftButtonStartDrag(cm, e, start, modifier) {
    var display = cm.display;
    var dragEnd = operation(cm, function(e2) {
      if (webkit) display.scroller.draggable = false;
      cm.state.draggingText = false;
      off(document, "mouseup", dragEnd);
      off(display.scroller, "drop", dragEnd);
      if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
        e_preventDefault(e2);
        if (!modifier)
          extendSelection(cm.doc, start);
        focusInput(cm);
        // Work around unexplainable focus problem in IE9 (#2127)
        if (ie_upto10 && !ie_upto8)
          setTimeout(function() {document.body.focus(); focusInput(cm);}, 20);
      }
    });
    // Let the drag handler handle this.
    if (webkit) display.scroller.draggable = true;
    cm.state.draggingText = dragEnd;
    // IE's approach to draggable
    if (display.scroller.dragDrop) display.scroller.dragDrop();
    on(document, "mouseup", dragEnd);
    on(display.scroller, "drop", dragEnd);
  }

  // Normal selection, as opposed to text dragging.
  function leftButtonSelect(cm, e, start, type, addNew) {
    var display = cm.display, doc = cm.doc;
    e_preventDefault(e);

    var ourRange, ourIndex, startSel = doc.sel;
    if (addNew && !e.shiftKey) {
      ourIndex = doc.sel.contains(start);
      if (ourIndex > -1)
        ourRange = doc.sel.ranges[ourIndex];
      else
        ourRange = new Range(start, start);
    } else {
      ourRange = doc.sel.primary();
    }

    if (e.altKey) {
      type = "rect";
      if (!addNew) ourRange = new Range(start, start);
      start = posFromMouse(cm, e, true, true);
      ourIndex = -1;
    } else if (type == "double") {
      var word = findWordAt(cm, start);
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, word.anchor, word.head);
      else
        ourRange = word;
    } else if (type == "triple") {
      var line = new Range(Pos(start.line, 0), clipPos(doc, Pos(start.line + 1, 0)));
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, line.anchor, line.head);
      else
        ourRange = line;
    } else {
      ourRange = extendRange(doc, ourRange, start);
    }

    if (!addNew) {
      ourIndex = 0;
      setSelection(doc, new Selection([ourRange], 0), sel_mouse);
      startSel = doc.sel;
    } else if (ourIndex > -1) {
      replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
    } else {
      ourIndex = doc.sel.ranges.length;
      setSelection(doc, normalizeSelection(doc.sel.ranges.concat([ourRange]), ourIndex),
                   {scroll: false, origin: "*mouse"});
    }

    var lastPos = start;
    function extendTo(pos) {
      if (cmp(lastPos, pos) == 0) return;
      lastPos = pos;

      if (type == "rect") {
        var ranges = [], tabSize = cm.options.tabSize;
        var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
        var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
        var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
        for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
             line <= end; line++) {
          var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
          if (left == right)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
          else if (text.length > leftPos)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
        }
        if (!ranges.length) ranges.push(new Range(start, start));
        setSelection(doc, normalizeSelection(startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
                     {origin: "*mouse", scroll: false});
        cm.scrollIntoView(pos);
      } else {
        var oldRange = ourRange;
        var anchor = oldRange.anchor, head = pos;
        if (type != "single") {
          if (type == "double")
            var range = findWordAt(cm, pos);
          else
            var range = new Range(Pos(pos.line, 0), clipPos(doc, Pos(pos.line + 1, 0)));
          if (cmp(range.anchor, anchor) > 0) {
            head = range.head;
            anchor = minPos(oldRange.from(), range.anchor);
          } else {
            head = range.anchor;
            anchor = maxPos(oldRange.to(), range.head);
          }
        }
        var ranges = startSel.ranges.slice(0);
        ranges[ourIndex] = new Range(clipPos(doc, anchor), head);
        setSelection(doc, normalizeSelection(ranges, ourIndex), sel_mouse);
      }
    }

    var editorSize = display.wrapper.getBoundingClientRect();
    // Used to ensure timeout re-tries don't fire when another extend
    // happened in the meantime (clearTimeout isn't reliable -- at
    // least on Chrome, the timeouts still happen even when cleared,
    // if the clear happens after their scheduled firing time).
    var counter = 0;

    function extend(e) {
      var curCount = ++counter;
      var cur = posFromMouse(cm, e, true, type == "rect");
      if (!cur) return;
      if (cmp(cur, lastPos) != 0) {
        ensureFocus(cm);
        extendTo(cur);
        var visible = visibleLines(display, doc);
        if (cur.line >= visible.to || cur.line < visible.from)
          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
      } else {
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
        if (outside) setTimeout(operation(cm, function() {
          if (counter != curCount) return;
          display.scroller.scrollTop += outside;
          extend(e);
        }), 50);
      }
    }

    function done(e) {
      counter = Infinity;
      e_preventDefault(e);
      focusInput(cm);
      off(document, "mousemove", move);
      off(document, "mouseup", up);
      doc.history.lastSelOrigin = null;
    }

    var move = operation(cm, function(e) {
      if ((ie && !ie_upto9) ?  !e.buttons : !e_button(e)) done(e);
      else extend(e);
    });
    var up = operation(cm, done);
    on(document, "mousemove", move);
    on(document, "mouseup", up);
  }

  // Determines whether an event happened in the gutter, and fires the
  // handlers for the corresponding event.
  function gutterEvent(cm, e, type, prevent, signalfn) {
    try { var mX = e.clientX, mY = e.clientY; }
    catch(e) { return false; }
    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
    if (prevent) e_preventDefault(e);

    var display = cm.display;
    var lineBox = display.lineDiv.getBoundingClientRect();

    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.options.gutters.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && g.getBoundingClientRect().right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.options.gutters[i];
        signalfn(cm, type, cm, line, gutter, e);
        return e_defaultPrevented(e);
      }
    }
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, "gutterClick", true, signalLater);
  }

  // Kludge to work around strange IE behavior where it'll sometimes
  // re-fire a series of drag-related events right after the drop (#1551)
  var lastDrop = 0;

  function onDrop(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
      return;
    e_preventDefault(e);
    if (ie) lastDrop = +new Date;
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
    if (!pos || isReadOnly(cm)) return;
    // Might be a file drop, in which case we simply extract the text
    // and insert it.
    if (files && files.length && window.FileReader && window.File) {
      var n = files.length, text = Array(n), read = 0;
      var loadFile = function(file, i) {
        var reader = new FileReader;
        reader.onload = operation(cm, function() {
          text[i] = reader.result;
          if (++read == n) {
            pos = clipPos(cm.doc, pos);
            var change = {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"};
            makeChange(cm.doc, change);
            setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
          }
        });
        reader.readAsText(file);
      };
      for (var i = 0; i < n; ++i) loadFile(files[i], i);
    } else { // Normal drop
      // Don't do a replace if the drop happened inside of the selected text.
      if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
        cm.state.draggingText(e);
        // Ensure the editor is re-focused
        setTimeout(bind(focusInput, cm), 20);
        return;
      }
      try {
        var text = e.dataTransfer.getData("Text");
        if (text) {
          if (cm.state.draggingText && !(mac ? e.metaKey : e.ctrlKey))
            var selected = cm.listSelections();
          setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
          if (selected) for (var i = 0; i < selected.length; ++i)
            replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
          cm.replaceSelection(text, "around", "paste");
          focusInput(cm);
        }
      }
      catch(e){}
    }
  }

  function onDragStart(cm, e) {
    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

    e.dataTransfer.setData("Text", cm.getSelection());

    // Use dummy image instead of default browsers image.
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
    if (e.dataTransfer.setDragImage && !safari) {
      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      if (presto) {
        img.width = img.height = 1;
        cm.display.wrapper.appendChild(img);
        // Force a relayout, or Opera won't use our image for some obscure reason
        img._top = img.offsetTop;
      }
      e.dataTransfer.setDragImage(img, 0, 0);
      if (presto) img.parentNode.removeChild(img);
    }
  }

  // SCROLL EVENTS

  // Sync the scrollable area and scrollbars, ensure the viewport
  // covers the visible area.
  function setScrollTop(cm, val) {
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
    cm.doc.scrollTop = val;
    if (!gecko) updateDisplay(cm, {top: val});
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;
    if (gecko) updateDisplay(cm);
    startWorker(cm, 100);
  }
  // Sync scroller and scrollbar, ensure the gutter elements are
  // aligned.
  function setScrollLeft(cm, val, isScroller) {
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
    if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;
  }

  // Since the delta values reported on mouse wheel events are
  // unstandardized between browsers and even browser versions, and
  // generally horribly unpredictable, this code starts by measuring
  // the scroll effect that the first few mouse wheel events have,
  // and, from that, detects the way it can convert deltas to pixel
  // offsets afterwards.
  //
  // The reason we want to know the amount a wheel event will scroll
  // is that it gives us a chance to update the display before the
  // actual scrolling happens, reducing flickering.

  var wheelSamples = 0, wheelPixelsPerUnit = null;
  // Fill in a browser-detected starting value on browsers where we
  // know one. These don't have to be accurate -- the result of them
  // being wrong would just be a slight flicker on the first wheel
  // scroll (if it is large enough).
  if (ie) wheelPixelsPerUnit = -.53;
  else if (gecko) wheelPixelsPerUnit = 15;
  else if (chrome) wheelPixelsPerUnit = -.7;
  else if (safari) wheelPixelsPerUnit = -1/3;

  function onScrollWheel(cm, e) {
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
    else if (dy == null) dy = e.wheelDelta;

    var display = cm.display, scroll = display.scroller;
    // Quit if there's nothing to scroll here
    if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
          dy && scroll.scrollHeight > scroll.clientHeight)) return;

    // Webkit browsers on OS X abort momentum scrolls when the target
    // of the scroll event is removed from the scrollable element.
    // This hack (see related code in patchDisplay) makes sure the
    // element is kept around.
    if (dy && mac && webkit) {
      outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
        for (var i = 0; i < view.length; i++) {
          if (view[i].node == cur) {
            cm.display.currentWheelTarget = cur;
            break outer;
          }
        }
      }
    }

    // On some browsers, horizontal scrolling will cause redraws to
    // happen before the gutter has been realigned, causing it to
    // wriggle around in a most unseemly way. When we have an
    // estimated pixels/delta value, we just handle horizontal
    // scrolling entirely here. It'll be slightly off from native, but
    // better than glitching out.
    if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
      if (dy)
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      e_preventDefault(e);
      display.wheelStartX = null; // Abort measurement, if in progress
      return;
    }

    // 'Project' the visible viewport to cover the area that is being
    // scrolled into view (if we know enough to estimate it).
    if (dy && wheelPixelsPerUnit != null) {
      var pixels = dy * wheelPixelsPerUnit;
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
      if (pixels < 0) top = Math.max(0, top + pixels - 50);
      else bot = Math.min(cm.doc.height, bot + pixels + 50);
      updateDisplay(cm, {top: top, bottom: bot});
    }

    if (wheelSamples < 20) {
      if (display.wheelStartX == null) {
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
        display.wheelDX = dx; display.wheelDY = dy;
        setTimeout(function() {
          if (display.wheelStartX == null) return;
          var movedX = scroll.scrollLeft - display.wheelStartX;
          var movedY = scroll.scrollTop - display.wheelStartY;
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
            (movedX && display.wheelDX && movedX / display.wheelDX);
          display.wheelStartX = display.wheelStartY = null;
          if (!sample) return;
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
          ++wheelSamples;
        }, 200);
      } else {
        display.wheelDX += dx; display.wheelDY += dy;
      }
    }
  }

  // KEY EVENTS

  // Run a handler that was bound to a key.
  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == "string") {
      bound = commands[bound];
      if (!bound) return false;
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;
    var prevShift = cm.display.shift, done = false;
    try {
      if (isReadOnly(cm)) cm.state.suppressEdits = true;
      if (dropShift) cm.display.shift = false;
      done = bound(cm) != Pass;
    } finally {
      cm.display.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done;
  }

  // Collect the currently active keymaps.
  function allKeyMaps(cm) {
    var maps = cm.state.keyMaps.slice(0);
    if (cm.options.extraKeys) maps.push(cm.options.extraKeys);
    maps.push(cm.options.keyMap);
    return maps;
  }

  var maybeTransition;
  // Handle a key from the keydown event.
  function handleKeyBinding(cm, e) {
    // Handle automatic keymap transitions
    var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;
    clearTimeout(maybeTransition);
    if (next && !isModifierKey(e)) maybeTransition = setTimeout(function() {
      if (getKeyMap(cm.options.keyMap) == startMap) {
        cm.options.keyMap = (next.call ? next.call(null, cm) : next);
        keyMapChanged(cm);
      }
    }, 50);

    var name = keyName(e, true), handled = false;
    if (!name) return false;
    var keymaps = allKeyMaps(cm);

    if (e.shiftKey) {
      // First try to resolve full name (including 'Shift-'). Failing
      // that, see if there is a cursor-motion command (starting with
      // 'go') bound to the keyname without 'Shift-'.
      handled = lookupKey("Shift-" + name, keymaps, function(b) {return doHandleBinding(cm, b, true);})
             || lookupKey(name, keymaps, function(b) {
                  if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                    return doHandleBinding(cm, b);
                });
    } else {
      handled = lookupKey(name, keymaps, function(b) { return doHandleBinding(cm, b); });
    }

    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      signalLater(cm, "keyHandled", cm, name, e);
    }
    return handled;
  }

  // Handle a key from the keypress event
  function handleCharBinding(cm, e, ch) {
    var handled = lookupKey("'" + ch + "'", allKeyMaps(cm),
                            function(b) { return doHandleBinding(cm, b, true); });
    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      signalLater(cm, "keyHandled", cm, "'" + ch + "'", e);
    }
    return handled;
  }

  var lastStoppedKey = null;
  function onKeyDown(e) {
    var cm = this;
    ensureFocus(cm);
    if (signalDOMEvent(cm, e)) return;
    // IE does strange things with escape.
    if (ie_upto10 && e.keyCode == 27) e.returnValue = false;
    var code = e.keyCode;
    cm.display.shift = code == 16 || e.shiftKey;
    var handled = handleKeyBinding(cm, e);
    if (presto) {
      lastStoppedKey = handled ? code : null;
      // Opera has no cut event... we try to at least catch the key combo
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
        cm.replaceSelection("", null, "cut");
    }

    // Turn mouse into crosshair when Alt is held on Mac.
    if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
      showCrossHair(cm);
  }

  function showCrossHair(cm) {
    var lineDiv = cm.display.lineDiv;
    addClass(lineDiv, "CodeMirror-crosshair");

    function up(e) {
      if (e.keyCode == 18 || !e.altKey) {
        rmClass(lineDiv, "CodeMirror-crosshair");
        off(document, "keyup", up);
        off(document, "mouseover", up);
      }
    }
    on(document, "keyup", up);
    on(document, "mouseover", up);
  }

  function onKeyUp(e) {
    if (signalDOMEvent(this, e)) return;
    if (e.keyCode == 16) this.doc.sel.shift = false;
  }

  function onKeyPress(e) {
    var cm = this;
    if (signalDOMEvent(cm, e)) return;
    var keyCode = e.keyCode, charCode = e.charCode;
    if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
    if (((presto && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
    if (handleCharBinding(cm, e, ch)) return;
    if (ie && !ie_upto8) cm.display.inputHasSelection = null;
    fastPoll(cm);
  }

  // FOCUS/BLUR EVENTS

  function onFocus(cm) {
    if (cm.options.readOnly == "nocursor") return;
    if (!cm.state.focused) {
      signal(cm, "focus", cm);
      cm.state.focused = true;
      addClass(cm.display.wrapper, "CodeMirror-focused");
      // The prevInput test prevents this from firing when a context
      // menu is closed (since the resetInput would kill the
      // select-all detection hack)
      if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
        resetInput(cm);
        if (webkit) setTimeout(bind(resetInput, cm, true), 0); // Issue #1730
      }
    }
    slowPoll(cm);
    restartBlink(cm);
  }
  function onBlur(cm) {
    if (cm.state.focused) {
      signal(cm, "blur", cm);
      cm.state.focused = false;
      rmClass(cm.display.wrapper, "CodeMirror-focused");
    }
    clearInterval(cm.display.blinker);
    setTimeout(function() {if (!cm.state.focused) cm.display.shift = false;}, 150);
  }

  // CONTEXT MENU HANDLING

  // To make the context menu work, we need to briefly unhide the
  // textarea (making it as unobtrusive as possible) to let the
  // right-click take effect on it.
  function onContextMenu(cm, e) {
    if (signalDOMEvent(cm, e, "contextmenu")) return;
    var display = cm.display;
    if (eventInWidget(display, e) || contextMenuInGutter(cm, e)) return;

    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
    if (!pos || presto) return; // Opera is difficult.

    // Reset the current text selection only if the click is done outside of the selection
    // and 'resetSelectionOnContextMenu' option is true.
    var reset = cm.options.resetSelectionOnContextMenu;
    if (reset && cm.doc.sel.contains(pos) == -1)
      operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);

    var oldCSS = display.input.style.cssText;
    display.inputDiv.style.position = "absolute";
    display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
      "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " +
      (ie ? "rgba(255, 255, 255, .05)" : "transparent") +
      "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
    focusInput(cm);
    resetInput(cm);
    // Adds "Select all" to context menu in FF
    if (!cm.somethingSelected()) display.input.value = display.prevInput = " ";
    display.selForContextMenu = cm.doc.sel;
    clearTimeout(display.detectingSelectAll);

    // Select-all will be greyed out if there's nothing to select, so
    // this adds a zero-width space so that we can later check whether
    // it got selected.
    function prepareSelectAllHack() {
      if (display.input.selectionStart != null) {
        var selected = cm.somethingSelected();
        var extval = display.input.value = "\u200b" + (selected ? display.input.value : "");
        display.prevInput = selected ? "" : "\u200b";
        display.input.selectionStart = 1; display.input.selectionEnd = extval.length;
        // Re-set this, in case some other handler touched the
        // selection in the meantime.
        display.selForContextMenu = cm.doc.sel;
      }
    }
    function rehide() {
      display.inputDiv.style.position = "relative";
      display.input.style.cssText = oldCSS;
      if (ie_upto8) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;
      slowPoll(cm);

      // Try to detect the user choosing select-all
      if (display.input.selectionStart != null) {
        if (!ie || ie_upto8) prepareSelectAllHack();
        var i = 0, poll = function() {
          if (display.selForContextMenu == cm.doc.sel && display.input.selectionStart == 0)
            operation(cm, commands.selectAll)(cm);
          else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
          else resetInput(cm);
        };
        display.detectingSelectAll = setTimeout(poll, 200);
      }
    }

    if (ie && !ie_upto8) prepareSelectAllHack();
    if (captureRightClick) {
      e_stop(e);
      var mouseup = function() {
        off(window, "mouseup", mouseup);
        setTimeout(rehide, 20);
      };
      on(window, "mouseup", mouseup);
    } else {
      setTimeout(rehide, 50);
    }
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, "gutterContextMenu")) return false;
    return gutterEvent(cm, e, "gutterContextMenu", false, signal);
  }

  // UPDATING

  // Compute the position of the end of a change (its 'to' property
  // refers to the pre-change end).
  var changeEnd = CodeMirror.changeEnd = function(change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1,
               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
  };

  // Adjust a position to refer to the post-change position of the
  // same text, or the end of the change if the change covers it.
  function adjustForChange(pos, change) {
    if (cmp(pos, change.from) < 0) return pos;
    if (cmp(pos, change.to) <= 0) return changeEnd(change);

    var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
    if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
    return Pos(line, ch);
  }

  function computeSelAfterChange(doc, change) {
    var out = [];
    for (var i = 0; i < doc.sel.ranges.length; i++) {
      var range = doc.sel.ranges[i];
      out.push(new Range(adjustForChange(range.anchor, change),
                         adjustForChange(range.head, change)));
    }
    return normalizeSelection(out, doc.sel.primIndex);
  }

  function offsetPos(pos, old, nw) {
    if (pos.line == old.line)
      return Pos(nw.line, pos.ch - old.ch + nw.ch);
    else
      return Pos(nw.line + (pos.line - old.line), pos.ch);
  }

  // Used by replaceSelections to allow moving the selection to the
  // start or around the replaced test. Hint may be "start" or "around".
  function computeReplacedSel(doc, changes, hint) {
    var out = [];
    var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      var from = offsetPos(change.from, oldPrev, newPrev);
      var to = offsetPos(changeEnd(change), oldPrev, newPrev);
      oldPrev = change.to;
      newPrev = to;
      if (hint == "around") {
        var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
        out[i] = new Range(inv ? to : from, inv ? from : to);
      } else {
        out[i] = new Range(from, from);
      }
    }
    return new Selection(out, doc.sel.primIndex);
  }

  // Allow "beforeChange" event handlers to influence a change
  function filterChange(doc, change, update) {
    var obj = {
      canceled: false,
      from: change.from,
      to: change.to,
      text: change.text,
      origin: change.origin,
      cancel: function() { this.canceled = true; }
    };
    if (update) obj.update = function(from, to, text, origin) {
      if (from) this.from = clipPos(doc, from);
      if (to) this.to = clipPos(doc, to);
      if (text) this.text = text;
      if (origin !== undefined) this.origin = origin;
    };
    signal(doc, "beforeChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

    if (obj.canceled) return null;
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
  }

  // Apply a change to a document, and add it to the document's
  // history, and propagating it to all linked documents.
  function makeChange(doc, change, ignoreReadOnly) {
    if (doc.cm) {
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
      if (doc.cm.state.suppressEdits) return;
    }

    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
      change = filterChange(doc, change, true);
      if (!change) return;
    }

    // Possibly split or suppress the update based on the presence
    // of read-only spans in its range.
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
    if (split) {
      for (var i = split.length - 1; i >= 0; --i)
        makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text});
    } else {
      makeChangeInner(doc, change);
    }
  }

  function makeChangeInner(doc, change) {
    if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
    var selAfter = computeSelAfterChange(doc, change);
    addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
    var rebased = [];

    linkedDocs(doc, function(doc, sharedHist) {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
    });
  }

  // Revert a change stored in a document's history.
  function makeChangeFromHistory(doc, type, allowSelectionOnly) {
    if (doc.cm && doc.cm.state.suppressEdits) return;

    var hist = doc.history, event, selAfter = doc.sel;
    var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;

    // Verify that there is a useable event (so that ctrl-z won't
    // needlessly clear selection events)
    for (var i = 0; i < source.length; i++) {
      event = source[i];
      if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
        break;
    }
    if (i == source.length) return;
    hist.lastOrigin = hist.lastSelOrigin = null;

    for (;;) {
      event = source.pop();
      if (event.ranges) {
        pushSelectionToHistory(event, dest);
        if (allowSelectionOnly && !event.equals(doc.sel)) {
          setSelection(doc, event, {clearRedo: false});
          return;
        }
        selAfter = event;
      }
      else break;
    }

    // Build up a reverse change object to add to the opposite history
    // stack (redo when undoing, and vice versa).
    var antiChanges = [];
    pushSelectionToHistory(selAfter, dest);
    dest.push({changes: antiChanges, generation: hist.generation});
    hist.generation = event.generation || ++hist.maxGeneration;

    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

    for (var i = event.changes.length - 1; i >= 0; --i) {
      var change = event.changes[i];
      change.origin = type;
      if (filter && !filterChange(doc, change, false)) {
        source.length = 0;
        return;
      }

      antiChanges.push(historyChangeFromChange(doc, change));

      var after = i ? computeSelAfterChange(doc, change, null) : lst(source);
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
      if (!i && doc.cm) doc.cm.scrollIntoView(change);
      var rebased = [];

      // Propagate to the linked documents
      linkedDocs(doc, function(doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
      });
    }
  }

  // Sub-views need their line numbers shifted when text is added
  // above or below them in the parent document.
  function shiftDoc(doc, distance) {
    if (distance == 0) return;
    doc.first += distance;
    doc.sel = new Selection(map(doc.sel.ranges, function(range) {
      return new Range(Pos(range.anchor.line + distance, range.anchor.ch),
                       Pos(range.head.line + distance, range.head.ch));
    }), doc.sel.primIndex);
    if (doc.cm) {
      regChange(doc.cm, doc.first, doc.first - distance, distance);
      for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
        regLineChange(doc.cm, l, "gutter");
    }
  }

  // More lower-level change function, handling only a single document
  // (not linked ones).
  function makeChangeSingleDoc(doc, change, selAfter, spans) {
    if (doc.cm && !doc.cm.curOp)
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

    if (change.to.line < doc.first) {
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
      return;
    }
    if (change.from.line > doc.lastLine()) return;

    // Clip the change to the size of this doc
    if (change.from.line < doc.first) {
      var shift = change.text.length - 1 - (doc.first - change.from.line);
      shiftDoc(doc, shift);
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                text: [lst(change.text)], origin: change.origin};
    }
    var last = doc.lastLine();
    if (change.to.line > last) {
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                text: [change.text[0]], origin: change.origin};
    }

    change.removed = getBetween(doc, change.from, change.to);

    if (!selAfter) selAfter = computeSelAfterChange(doc, change, null);
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
    else updateDoc(doc, change, spans);
    setSelectionNoUndo(doc, selAfter, sel_dontScroll);
  }

  // Handle the interaction of a change to a document with the editor
  // that this document is part of.
  function makeChangeSingleDocInEditor(cm, change, spans) {
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

    var recomputeMaxLength = false, checkWidthStart = from.line;
    if (!cm.options.lineWrapping) {
      checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
      doc.iter(checkWidthStart, to.line + 1, function(line) {
        if (line == display.maxLine) {
          recomputeMaxLength = true;
          return true;
        }
      });
    }

    if (doc.sel.contains(change.from, change.to) > -1)
      signalCursorActivity(cm);

    updateDoc(doc, change, spans, estimateHeight(cm));

    if (!cm.options.lineWrapping) {
      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
        var len = lineLength(line);
        if (len > display.maxLineLength) {
          display.maxLine = line;
          display.maxLineLength = len;
          display.maxLineChanged = true;
          recomputeMaxLength = false;
        }
      });
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
    }

    // Adjust frontier, schedule worker
    doc.frontier = Math.min(doc.frontier, from.line);
    startWorker(cm, 400);

    var lendiff = change.text.length - (to.line - from.line) - 1;
    // Remember that these lines changed, for updating the display
    if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
      regLineChange(cm, from.line, "text");
    else
      regChange(cm, from.line, to.line + 1, lendiff);

    var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
    if (changeHandler || changesHandler) {
      var obj = {
        from: from, to: to,
        text: change.text,
        removed: change.removed,
        origin: change.origin
      };
      if (changeHandler) signalLater(cm, "change", cm, obj);
      if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
    }
    cm.display.selForContextMenu = null;
  }

  function replaceRange(doc, code, from, to, origin) {
    if (!to) to = from;
    if (cmp(to, from) < 0) { var tmp = to; to = from; from = tmp; }
    if (typeof code == "string") code = splitLines(code);
    makeChange(doc, {from: from, to: to, text: code, origin: origin});
  }

  // SCROLLING THINGS INTO VIEW

  // If an editor sits on the top or bottom of the window, partially
  // scrolled out of view, this ensures that the cursor is visible.
  function maybeScrollWindow(cm, coords) {
    var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
    if (coords.top + box.top < 0) doScroll = true;
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {
      var scrollNode = elt("div", "\u200b", null, "position: absolute; top: " +
                           (coords.top - display.viewOffset - paddingTop(cm.display)) + "px; height: " +
                           (coords.bottom - coords.top + scrollerCutOff) + "px; left: " +
                           coords.left + "px; width: 2px;");
      cm.display.lineSpace.appendChild(scrollNode);
      scrollNode.scrollIntoView(doScroll);
      cm.display.lineSpace.removeChild(scrollNode);
    }
  }

  // Scroll a given position into view (immediately), verifying that
  // it actually became visible (as line heights are accurately
  // measured, the position of something may 'drift' during drawing).
  function scrollPosIntoView(cm, pos, end, margin) {
    if (margin == null) margin = 0;
    for (;;) {
      var changed = false, coords = cursorCoords(cm, pos);
      var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
      var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
                                         Math.min(coords.top, endCoords.top) - margin,
                                         Math.max(coords.left, endCoords.left),
                                         Math.max(coords.bottom, endCoords.bottom) + margin);
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
      if (scrollPos.scrollTop != null) {
        setScrollTop(cm, scrollPos.scrollTop);
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
      }
      if (scrollPos.scrollLeft != null) {
        setScrollLeft(cm, scrollPos.scrollLeft);
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
      }
      if (!changed) return coords;
    }
  }

  // Scroll a given set of coordinates into view (immediately).
  function scrollIntoView(cm, x1, y1, x2, y2) {
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
  }

  // Calculate a new scroll position needed to scroll the given
  // rectangle into view. Returns an object with scrollTop and
  // scrollLeft properties. When these are undefined, the
  // vertical/horizontal position does not need to be adjusted.
  function calculateScrollPos(cm, x1, y1, x2, y2) {
    var display = cm.display, snapMargin = textHeight(cm.display);
    if (y1 < 0) y1 = 0;
    var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
    var screen = display.scroller.clientHeight - scrollerCutOff, result = {};
    var docBottom = cm.doc.height + paddingVert(display);
    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
    if (y1 < screentop) {
      result.scrollTop = atTop ? 0 : y1;
    } else if (y2 > screentop + screen) {
      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
      if (newTop != screentop) result.scrollTop = newTop;
    }

    var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
    var screenw = display.scroller.clientWidth - scrollerCutOff;
    x1 += display.gutters.offsetWidth; x2 += display.gutters.offsetWidth;
    var gutterw = display.gutters.offsetWidth;
    var atLeft = x1 < gutterw + 10;
    if (x1 < screenleft + gutterw || atLeft) {
      if (atLeft) x1 = 0;
      result.scrollLeft = Math.max(0, x1 - 10 - gutterw);
    } else if (x2 > screenw + screenleft - 3) {
      result.scrollLeft = x2 + 10 - screenw;
    }
    return result;
  }

  // Store a relative adjustment to the scroll position in the current
  // operation (to be applied when the operation finishes).
  function addToScrollPos(cm, left, top) {
    if (left != null || top != null) resolveScrollToPos(cm);
    if (left != null)
      cm.curOp.scrollLeft = (cm.curOp.scrollLeft == null ? cm.doc.scrollLeft : cm.curOp.scrollLeft) + left;
    if (top != null)
      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
  }

  // Make sure that at the end of the operation the current cursor is
  // shown.
  function ensureCursorVisible(cm) {
    resolveScrollToPos(cm);
    var cur = cm.getCursor(), from = cur, to = cur;
    if (!cm.options.lineWrapping) {
      from = cur.ch ? Pos(cur.line, cur.ch - 1) : cur;
      to = Pos(cur.line, cur.ch + 1);
    }
    cm.curOp.scrollToPos = {from: from, to: to, margin: cm.options.cursorScrollMargin, isCursor: true};
  }

  // When an operation has its scrollToPos property set, and another
  // scroll action is applied before the end of the operation, this
  // 'simulates' scrolling that position into view in a cheap way, so
  // that the effect of intermediate scroll commands is not ignored.
  function resolveScrollToPos(cm) {
    var range = cm.curOp.scrollToPos;
    if (range) {
      cm.curOp.scrollToPos = null;
      var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
      var sPos = calculateScrollPos(cm, Math.min(from.left, to.left),
                                    Math.min(from.top, to.top) - range.margin,
                                    Math.max(from.right, to.right),
                                    Math.max(from.bottom, to.bottom) + range.margin);
      cm.scrollTo(sPos.scrollLeft, sPos.scrollTop);
    }
  }

  // API UTILITIES

  // Indent the given line. The how parameter can be "smart",
  // "add"/null, "subtract", or "prev". When aggressive is false
  // (typically set to true for forced single-line indents), empty
  // lines are not indented, and places where the mode returns Pass
  // are left alone.
  function indentLine(cm, n, how, aggressive) {
    var doc = cm.doc, state;
    if (how == null) how = "add";
    if (how == "smart") {
      // Fall back to "prev" when the mode doesn't have an indentation
      // method.
      if (!cm.doc.mode.indent) how = "prev";
      else state = getStateBefore(cm, n);
    }

    var tabSize = cm.options.tabSize;
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
    if (line.stateAfter) line.stateAfter = null;
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
    if (!aggressive && !/\S/.test(line.text)) {
      indentation = 0;
      how = "not";
    } else if (how == "smart") {
      indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
      if (indentation == Pass) {
        if (!aggressive) return;
        how = "prev";
      }
    }
    if (how == "prev") {
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
      else indentation = 0;
    } else if (how == "add") {
      indentation = curSpace + cm.options.indentUnit;
    } else if (how == "subtract") {
      indentation = curSpace - cm.options.indentUnit;
    } else if (typeof how == "number") {
      indentation = curSpace + how;
    }
    indentation = Math.max(0, indentation);

    var indentString = "", pos = 0;
    if (cm.options.indentWithTabs)
      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
    if (pos < indentation) indentString += spaceStr(indentation - pos);

    if (indentString != curSpaceString) {
      replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
    } else {
      // Ensure that, if the cursor was in the whitespace at the start
      // of the line, it is moved to the end of that space.
      for (var i = 0; i < doc.sel.ranges.length; i++) {
        var range = doc.sel.ranges[i];
        if (range.head.line == n && range.head.ch < curSpaceString.length) {
          var pos = Pos(n, curSpaceString.length);
          replaceOneSelection(doc, i, new Range(pos, pos));
          break;
        }
      }
    }
    line.stateAfter = null;
  }

  // Utility for applying a change to a line by handle or number,
  // returning the number and optionally registering the line as
  // changed.
  function changeLine(cm, handle, changeType, op) {
    var no = handle, line = handle, doc = cm.doc;
    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
    else no = lineNo(handle);
    if (no == null) return null;
    if (op(line, no)) regLineChange(cm, no, changeType);
    return line;
  }

  // Helper for deleting text near the selection(s), used to implement
  // backspace, delete, and similar functionality.
  function deleteNearSelection(cm, compute) {
    var ranges = cm.doc.sel.ranges, kill = [];
    // Build up a set of ranges to kill first, merging overlapping
    // ranges.
    for (var i = 0; i < ranges.length; i++) {
      var toKill = compute(ranges[i]);
      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
        var replaced = kill.pop();
        if (cmp(replaced.from, toKill.from) < 0) {
          toKill.from = replaced.from;
          break;
        }
      }
      kill.push(toKill);
    }
    // Next, remove those actual ranges.
    runInOp(cm, function() {
      for (var i = kill.length - 1; i >= 0; i--)
        replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
      ensureCursorVisible(cm);
    });
  }

  // Used for horizontal relative motion. Dir is -1 or 1 (left or
  // right), unit can be "char", "column" (like char, but doesn't
  // cross line boundaries), "word" (across next word), or "group" (to
  // the start of next group of word or non-word-non-whitespace
  // chars). The visually param controls whether, in right-to-left
  // text, direction 1 means to move towards the next index in the
  // string, or towards the character to the right of the current
  // position. The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosH(doc, pos, dir, unit, visually) {
    var line = pos.line, ch = pos.ch, origDir = dir;
    var lineObj = getLine(doc, line);
    var possible = true;
    function findNextLine() {
      var l = line + dir;
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
      line = l;
      return lineObj = getLine(doc, l);
    }
    function moveOnce(boundToLine) {
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
      if (next == null) {
        if (!boundToLine && findNextLine()) {
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
          else ch = dir < 0 ? lineObj.text.length : 0;
        } else return (possible = false);
      } else ch = next;
      return true;
    }

    if (unit == "char") moveOnce();
    else if (unit == "column") moveOnce(true);
    else if (unit == "word" || unit == "group") {
      var sawType = null, group = unit == "group";
      var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
      for (var first = true;; first = false) {
        if (dir < 0 && !moveOnce(!first)) break;
        var cur = lineObj.text.charAt(ch) || "\n";
        var type = isWordChar(cur, helper) ? "w"
          : group && cur == "\n" ? "n"
          : !group || /\s/.test(cur) ? null
          : "p";
        if (group && !first && !type) type = "s";
        if (sawType && sawType != type) {
          if (dir < 0) {dir = 1; moveOnce();}
          break;
        }

        if (type) sawType = type;
        if (dir > 0 && !moveOnce(!first)) break;
      }
    }
    var result = skipAtomic(doc, Pos(line, ch), origDir, true);
    if (!possible) result.hitSide = true;
    return result;
  }

  // For relative vertical movement. Dir may be -1 or 1. Unit can be
  // "page" or "line". The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosV(cm, pos, dir, unit) {
    var doc = cm.doc, x = pos.left, y;
    if (unit == "page") {
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
    } else if (unit == "line") {
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
    }
    for (;;) {
      var target = coordsChar(cm, x, y);
      if (!target.outside) break;
      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
      y += dir * 5;
    }
    return target;
  }

  // Find the word at the given position (as returned by coordsChar).
  function findWordAt(cm, pos) {
    var doc = cm.doc, line = getLine(doc, pos.line).text;
    var start = pos.ch, end = pos.ch;
    if (line) {
      var helper = cm.getHelper(pos, "wordChars");
      if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
      var startChar = line.charAt(start);
      var check = isWordChar(startChar, helper)
        ? function(ch) { return isWordChar(ch, helper); }
        : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
        : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
      while (start > 0 && check(line.charAt(start - 1))) --start;
      while (end < line.length && check(line.charAt(end))) ++end;
    }
    return new Range(Pos(pos.line, start), Pos(pos.line, end));
  }

  // EDITOR METHODS

  // The publicly visible API. Note that methodOp(f) means
  // 'wrap f in an operation, performed on its `this` parameter'.

  // This is not the complete set of editor methods. Most of the
  // methods defined on the Doc type are also injected into
  // CodeMirror.prototype, for backwards compatibility and
  // convenience.

  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function(){window.focus(); focusInput(this); fastPoll(this);},

    setOption: function(option, value) {
      var options = this.options, old = options[option];
      if (options[option] == value && option != "mode") return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option))
        operation(this, optionHandlers[option])(this, value, old);
    },

    getOption: function(option) {return this.options[option];},
    getDoc: function() {return this.doc;},

    addKeyMap: function(map, bottom) {
      this.state.keyMaps[bottom ? "push" : "unshift"](map);
    },
    removeKeyMap: function(map) {
      var maps = this.state.keyMaps;
      for (var i = 0; i < maps.length; ++i)
        if (maps[i] == map || (typeof maps[i] != "string" && maps[i].name == map)) {
          maps.splice(i, 1);
          return true;
        }
    },

    addOverlay: methodOp(function(spec, options) {
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error("Overlays may not be stateful.");
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: methodOp(function(spec) {
      var overlays = this.state.overlays;
      for (var i = 0; i < overlays.length; ++i) {
        var cur = overlays[i].modeSpec;
        if (cur == spec || typeof spec == "string" && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),

    indentLine: methodOp(function(n, dir, aggressive) {
      if (typeof dir != "string" && typeof dir != "number") {
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
        else dir = dir ? "add" : "subtract";
      }
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: methodOp(function(how) {
      var ranges = this.doc.sel.ranges, end = -1;
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (!range.empty()) {
          var start = Math.max(end, range.from().line);
          var to = range.to();
          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
          for (var j = start; j < end; ++j)
            indentLine(this, j, how);
        } else if (range.head.line > end) {
          indentLine(this, range.head.line, how, true);
          end = range.head.line;
          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
        }
      }
    }),

    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function(pos, precise) {
      var doc = this.doc;
      pos = clipPos(doc, pos);
      var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode;
      var line = getLine(doc, pos.line);
      var stream = new StringStream(line.text, this.options.tabSize);
      while (stream.pos < pos.ch && !stream.eol()) {
        stream.start = stream.pos;
        var style = readToken(mode, stream, state);
      }
      return {start: stream.start,
              end: stream.pos,
              string: stream.current(),
              type: style || null,
              state: state};
    },

    getTokenTypeAt: function(pos) {
      pos = clipPos(this.doc, pos);
      var styles = getLineStyles(this, getLine(this.doc, pos.line));
      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
      var type;
      if (ch == 0) type = styles[2];
      else for (;;) {
        var mid = (before + after) >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
        else { type = styles[mid * 2 + 2]; break; }
      }
      var cut = type ? type.indexOf("cm-overlay ") : -1;
      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
    },

    getModeAt: function(pos) {
      var mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },

    getHelper: function(pos, type) {
      return this.getHelpers(pos, type)[0];
    },

    getHelpers: function(pos, type) {
      var found = [];
      if (!helpers.hasOwnProperty(type)) return helpers;
      var help = helpers[type], mode = this.getModeAt(pos);
      if (typeof mode[type] == "string") {
        if (help[mode[type]]) found.push(help[mode[type]]);
      } else if (mode[type]) {
        for (var i = 0; i < mode[type].length; i++) {
          var val = help[mode[type][i]];
          if (val) found.push(val);
        }
      } else if (mode.helperType && help[mode.helperType]) {
        found.push(help[mode.helperType]);
      } else if (help[mode.name]) {
        found.push(help[mode.name]);
      }
      for (var i = 0; i < help._global.length; i++) {
        var cur = help._global[i];
        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1)
          found.push(cur.val);
      }
      return found;
    },

    getStateAfter: function(line, precise) {
      var doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
      return getStateBefore(this, line + 1, precise);
    },

    cursorCoords: function(start, mode) {
      var pos, range = this.doc.sel.primary();
      if (start == null) pos = range.head;
      else if (typeof start == "object") pos = clipPos(this.doc, start);
      else pos = start ? range.from() : range.to();
      return cursorCoords(this, pos, mode || "page");
    },

    charCoords: function(pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || "page");
    },

    coordsChar: function(coords, mode) {
      coords = fromCoordSystem(this, coords, mode || "page");
      return coordsChar(this, coords.left, coords.top);
    },

    lineAtHeight: function(height, mode) {
      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function(line, mode) {
      var end = false, last = this.doc.first + this.doc.size - 1;
      if (line < this.doc.first) line = this.doc.first;
      else if (line > last) { line = last; end = true; }
      var lineObj = getLine(this.doc, line);
      return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page").top +
        (end ? this.doc.height - heightAtLine(lineObj) : 0);
    },

    defaultTextHeight: function() { return textHeight(this.display); },
    defaultCharWidth: function() { return charWidth(this.display); },

    setGutterMarker: methodOp(function(line, gutterID, value) {
      return changeLine(this, line, "gutter", function(line) {
        var markers = line.gutterMarkers || (line.gutterMarkers = {});
        markers[gutterID] = value;
        if (!value && isEmpty(markers)) line.gutterMarkers = null;
        return true;
      });
    }),

    clearGutter: methodOp(function(gutterID) {
      var cm = this, doc = cm.doc, i = doc.first;
      doc.iter(function(line) {
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
          line.gutterMarkers[gutterID] = null;
          regLineChange(cm, i, "gutter");
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
        }
        ++i;
      });
    }),

    addLineClass: methodOp(function(handle, where, cls) {
      return changeLine(this, handle, "class", function(line) {
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
        if (!line[prop]) line[prop] = cls;
        else if (new RegExp("(?:^|\\s)" + cls + "(?:$|\\s)").test(line[prop])) return false;
        else line[prop] += " " + cls;
        return true;
      });
    }),

    removeLineClass: methodOp(function(handle, where, cls) {
      return changeLine(this, handle, "class", function(line) {
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
        var cur = line[prop];
        if (!cur) return false;
        else if (cls == null) line[prop] = null;
        else {
          var found = cur.match(new RegExp("(?:^|\\s+)" + cls + "(?:$|\\s+)"));
          if (!found) return false;
          var end = found.index + found[0].length;
          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
        }
        return true;
      });
    }),

    addLineWidget: methodOp(function(handle, node, options) {
      return addLineWidget(this, handle, node, options);
    }),

    removeLineWidget: function(widget) { widget.clear(); },

    lineInfo: function(line) {
      if (typeof line == "number") {
        if (!isLine(this.doc, line)) return null;
        var n = line;
        line = getLine(this.doc, line);
        if (!line) return null;
      } else {
        var n = lineNo(line);
        if (n == null) return null;
      }
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
              widgets: line.widgets};
    },

    getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo};},

    addWidget: function(pos, node, scroll, vert, horiz) {
      var display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      var top = pos.bottom, left = pos.left;
      node.style.position = "absolute";
      display.sizer.appendChild(node);
      if (vert == "over") {
        top = pos.top;
      } else if (vert == "above" || vert == "near") {
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
        // Default to positioning above (if specified and possible); otherwise default to positioning below
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
          top = pos.top - node.offsetHeight;
        else if (pos.bottom + node.offsetHeight <= vspace)
          top = pos.bottom;
        if (left + node.offsetWidth > hspace)
          left = hspace - node.offsetWidth;
      }
      node.style.top = top + "px";
      node.style.left = node.style.right = "";
      if (horiz == "right") {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = "0px";
      } else {
        if (horiz == "left") left = 0;
        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = left + "px";
      }
      if (scroll)
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
    },

    triggerOnKeyDown: methodOp(onKeyDown),
    triggerOnKeyPress: methodOp(onKeyPress),
    triggerOnKeyUp: methodOp(onKeyUp),

    execCommand: function(cmd) {
      if (commands.hasOwnProperty(cmd))
        return commands[cmd](this);
    },

    findPosH: function(from, amount, unit, visually) {
      var dir = 1;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveH: methodOp(function(dir, unit) {
      var cm = this;
      cm.extendSelectionsBy(function(range) {
        if (cm.display.shift || cm.doc.extend || range.empty())
          return findPosH(cm.doc, range.head, dir, unit, cm.options.rtlMoveVisually);
        else
          return dir < 0 ? range.from() : range.to();
      }, sel_move);
    }),

    deleteH: methodOp(function(dir, unit) {
      var sel = this.doc.sel, doc = this.doc;
      if (sel.somethingSelected())
        doc.replaceSelection("", null, "+delete");
      else
        deleteNearSelection(this, function(range) {
          var other = findPosH(doc, range.head, dir, unit, false);
          return dir < 0 ? {from: other, to: range.head} : {from: range.head, to: other};
        });
    }),

    findPosV: function(from, amount, unit, goalColumn) {
      var dir = 1, x = goalColumn;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        var coords = cursorCoords(this, cur, "div");
        if (x == null) x = coords.left;
        else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveV: methodOp(function(dir, unit) {
      var cm = this, doc = this.doc, goals = [];
      var collapse = !cm.display.shift && !doc.extend && doc.sel.somethingSelected();
      doc.extendSelectionsBy(function(range) {
        if (collapse)
          return dir < 0 ? range.from() : range.to();
        var headPos = cursorCoords(cm, range.head, "div");
        if (range.goalColumn != null) headPos.left = range.goalColumn;
        goals.push(headPos.left);
        var pos = findPosV(cm, headPos, dir, unit);
        if (unit == "page" && range == doc.sel.primary())
          addToScrollPos(cm, null, charCoords(cm, pos, "div").top - headPos.top);
        return pos;
      }, sel_move);
      if (goals.length) for (var i = 0; i < doc.sel.ranges.length; i++)
        doc.sel.ranges[i].goalColumn = goals[i];
    }),

    toggleOverwrite: function(value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite)
        addClass(this.display.cursorDiv, "CodeMirror-overwrite");
      else
        rmClass(this.display.cursorDiv, "CodeMirror-overwrite");

      signal(this, "overwriteToggle", this, this.state.overwrite);
    },
    hasFocus: function() { return activeElt() == this.display.input; },

    scrollTo: methodOp(function(x, y) {
      if (x != null || y != null) resolveScrollToPos(this);
      if (x != null) this.curOp.scrollLeft = x;
      if (y != null) this.curOp.scrollTop = y;
    }),
    getScrollInfo: function() {
      var scroller = this.display.scroller, co = scrollerCutOff;
      return {left: scroller.scrollLeft, top: scroller.scrollTop,
              height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,
              clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};
    },

    scrollIntoView: methodOp(function(range, margin) {
      if (range == null) {
        range = {from: this.doc.sel.primary().head, to: null};
        if (margin == null) margin = this.options.cursorScrollMargin;
      } else if (typeof range == "number") {
        range = {from: Pos(range, 0), to: null};
      } else if (range.from == null) {
        range = {from: range, to: null};
      }
      if (!range.to) range.to = range.from;
      range.margin = margin || 0;

      if (range.from.line != null) {
        resolveScrollToPos(this);
        this.curOp.scrollToPos = range;
      } else {
        var sPos = calculateScrollPos(this, Math.min(range.from.left, range.to.left),
                                      Math.min(range.from.top, range.to.top) - range.margin,
                                      Math.max(range.from.right, range.to.right),
                                      Math.max(range.from.bottom, range.to.bottom) + range.margin);
        this.scrollTo(sPos.scrollLeft, sPos.scrollTop);
      }
    }),

    setSize: methodOp(function(width, height) {
      function interpret(val) {
        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
      }
      if (width != null) this.display.wrapper.style.width = interpret(width);
      if (height != null) this.display.wrapper.style.height = interpret(height);
      if (this.options.lineWrapping) clearLineMeasurementCache(this);
      this.curOp.forceUpdate = true;
      signal(this, "refresh", this);
    }),

    operation: function(f){return runInOp(this, f);},

    refresh: methodOp(function() {
      var oldHeight = this.display.cachedTextHeight;
      regChange(this);
      this.curOp.forceUpdate = true;
      clearCaches(this);
      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
      updateGutterSpace(this);
      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
        estimateLineHeights(this);
      signal(this, "refresh", this);
    }),

    swapDoc: methodOp(function(doc) {
      var old = this.doc;
      old.cm = null;
      attachDoc(this, doc);
      clearCaches(this);
      resetInput(this);
      this.scrollTo(doc.scrollLeft, doc.scrollTop);
      signalLater(this, "swapDoc", this, old);
      return old;
    }),

    getInputField: function(){return this.display.input;},
    getWrapperElement: function(){return this.display.wrapper;},
    getScrollerElement: function(){return this.display.scroller;},
    getGutterElement: function(){return this.display.gutters;}
  };
  eventMixin(CodeMirror);

  // OPTION DEFAULTS

  // The default configuration options.
  var defaults = CodeMirror.defaults = {};
  // Functions to run when options are changed.
  var optionHandlers = CodeMirror.optionHandlers = {};

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] =
      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
  }

  // Passed to option handlers when there is no old value.
  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

  // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.
  option("value", "", function(cm, val) {
    cm.setValue(val);
  }, true);
  option("mode", null, function(cm, val) {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);

  option("indentUnit", 2, loadMode, true);
  option("indentWithTabs", false);
  option("smartIndent", true);
  option("tabSize", 4, function(cm) {
    resetModeState(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option("specialChars", /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g, function(cm, val) {
    cm.options.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
    cm.refresh();
  }, true);
  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
  option("electricChars", true);
  option("rtlMoveVisually", !windows);
  option("wholeLineUpdateBefore", true);

  option("theme", "default", function(cm) {
    themeChanged(cm);
    guttersChanged(cm);
  }, true);
  option("keyMap", "default", keyMapChanged);
  option("extraKeys", null);

  option("lineWrapping", false, wrappingChanged, true);
  option("gutters", [], function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("fixedGutter", true, function(cm, val) {
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
    cm.refresh();
  }, true);
  option("coverGutterNextToScrollbar", false, updateScrollbars, true);
  option("lineNumbers", false, function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("firstLineNumber", 1, guttersChanged, true);
  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
  option("showCursorWhenSelecting", false, updateSelection, true);

  option("resetSelectionOnContextMenu", true);

  option("readOnly", false, function(cm, val) {
    if (val == "nocursor") {
      onBlur(cm);
      cm.display.input.blur();
      cm.display.disabled = true;
    } else {
      cm.display.disabled = false;
      if (!val) resetInput(cm);
    }
  });
  option("disableInput", false, function(cm, val) {if (!val) resetInput(cm);}, true);
  option("dragDrop", true);

  option("cursorBlinkRate", 530);
  option("cursorScrollMargin", 0);
  option("cursorHeight", 1);
  option("workTime", 100);
  option("workDelay", 100);
  option("flattenSpans", true, resetModeState, true);
  option("addModeClass", false, resetModeState, true);
  option("pollInterval", 100);
  option("undoDepth", 200, function(cm, val){cm.doc.history.undoDepth = val;});
  option("historyEventDelay", 1250);
  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
  option("maxHighlightLength", 10000, resetModeState, true);
  option("moveInputWithCursor", true, function(cm, val) {
    if (!val) cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0;
  });

  option("tabindex", null, function(cm, val) {
    cm.display.input.tabIndex = val || "";
  });
  option("autofocus", null);

  // MODE DEFINITION AND QUERYING

  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

  // Extra arguments are stored as the mode's dependencies, which is
  // used by (legacy) mechanisms like loadmode.js to automatically
  // load a mode. (Preferred mechanism is the require/define calls.)
  CodeMirror.defineMode = function(name, mode) {
    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
    if (arguments.length > 2) {
      mode.dependencies = [];
      for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);
    }
    modes[name] = mode;
  };

  CodeMirror.defineMIME = function(mime, spec) {
    mimeModes[mime] = spec;
  };

  // Given a MIME type, a {name, ...options} config object, or a name
  // string, return a mode config object.
  CodeMirror.resolveMode = function(spec) {
    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
      spec = mimeModes[spec];
    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      if (typeof found == "string") found = {name: found};
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
      return CodeMirror.resolveMode("application/xml");
    }
    if (typeof spec == "string") return {name: spec};
    else return spec || {name: "null"};
  };

  // Given a mode spec (anything that resolveMode accepts), find and
  // initialize an actual mode object.
  CodeMirror.getMode = function(options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;
    if (spec.helperType) modeObj.helperType = spec.helperType;
    if (spec.modeProps) for (var prop in spec.modeProps)
      modeObj[prop] = spec.modeProps[prop];

    return modeObj;
  };

  // Minimal default mode.
  CodeMirror.defineMode("null", function() {
    return {token: function(stream) {stream.skipToEnd();}};
  });
  CodeMirror.defineMIME("text/plain", "null");

  // This can be used to attach properties to mode objects from
  // outside the actual mode definition.
  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function(mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
    copyObj(properties, exts);
  };

  // EXTENSIONS

  CodeMirror.defineExtension = function(name, func) {
    CodeMirror.prototype[name] = func;
  };
  CodeMirror.defineDocExtension = function(name, func) {
    Doc.prototype[name] = func;
  };
  CodeMirror.defineOption = option;

  var initHooks = [];
  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function(type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {_global: []};
    helpers[type][name] = value;
  };
  CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
    CodeMirror.registerHelper(type, name, value);
    helpers[type]._global.push({pred: predicate, val: value});
  };

  // MODE STATE HANDLING

  // Utility functions for working with state. Exported because nested
  // modes need to do this for their inner modes.

  var copyState = CodeMirror.copyState = function(mode, state) {
    if (state === true) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      if (val instanceof Array) val = val.concat([]);
      nstate[n] = val;
    }
    return nstate;
  };

  var startState = CodeMirror.startState = function(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  };

  // Given a mode and a state (for that mode), find the inner mode and
  // state at the position that the state refers to.
  CodeMirror.innerMode = function(mode, state) {
    while (mode.innerMode) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {mode: mode, state: state};
  };

  // STANDARD COMMANDS

  // Commands are parameter-less actions that can be performed on an
  // editor, mostly used for keybindings.
  var commands = CodeMirror.commands = {
    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);},
    singleSelection: function(cm) {
      cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
    },
    killLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        if (range.empty()) {
          var len = getLine(cm.doc, range.head.line).text.length;
          if (range.head.ch == len && range.head.line < cm.lastLine())
            return {from: range.head, to: Pos(range.head.line + 1, 0)};
          else
            return {from: range.head, to: Pos(range.head.line, len)};
        } else {
          return {from: range.from(), to: range.to()};
        }
      });
    },
    deleteLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0),
                to: clipPos(cm.doc, Pos(range.to().line + 1, 0))};
      });
    },
    delLineLeft: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0), to: range.from()};
      });
    },
    undo: function(cm) {cm.undo();},
    redo: function(cm) {cm.redo();},
    undoSelection: function(cm) {cm.undoSelection();},
    redoSelection: function(cm) {cm.redoSelection();},
    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
    goLineStart: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineStart(cm, range.head.line); }, sel_move);
    },
    goLineStartSmart: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var start = lineStart(cm, range.head.line);
        var line = cm.getLineHandle(start.line);
        var order = getOrder(line);
        if (!order || order[0].level == 0) {
          var firstNonWS = Math.max(0, line.text.search(/\S/));
          var inWS = range.head.line == start.line && range.head.ch <= firstNonWS && range.head.ch;
          return Pos(start.line, inWS ? 0 : firstNonWS);
        }
        return start;
      }, sel_move);
    },
    goLineEnd: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineEnd(cm, range.head.line); }, sel_move);
    },
    goLineRight: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
      }, sel_move);
    },
    goLineLeft: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: 0, top: top}, "div");
      }, sel_move);
    },
    goLineUp: function(cm) {cm.moveV(-1, "line");},
    goLineDown: function(cm) {cm.moveV(1, "line");},
    goPageUp: function(cm) {cm.moveV(-1, "page");},
    goPageDown: function(cm) {cm.moveV(1, "page");},
    goCharLeft: function(cm) {cm.moveH(-1, "char");},
    goCharRight: function(cm) {cm.moveH(1, "char");},
    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
    goColumnRight: function(cm) {cm.moveH(1, "column");},
    goWordLeft: function(cm) {cm.moveH(-1, "word");},
    goGroupRight: function(cm) {cm.moveH(1, "group");},
    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
    goWordRight: function(cm) {cm.moveH(1, "word");},
    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
    delCharAfter: function(cm) {cm.deleteH(1, "char");},
    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
    delWordAfter: function(cm) {cm.deleteH(1, "word");},
    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
    indentAuto: function(cm) {cm.indentSelection("smart");},
    indentMore: function(cm) {cm.indentSelection("add");},
    indentLess: function(cm) {cm.indentSelection("subtract");},
    insertTab: function(cm) {cm.replaceSelection("\t");},
    insertSoftTab: function(cm) {
      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
      for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].from();
        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
        spaces.push(new Array(tabSize - col % tabSize + 1).join(" "));
      }
      cm.replaceSelections(spaces);
    },
    defaultTab: function(cm) {
      if (cm.somethingSelected()) cm.indentSelection("add");
      else cm.execCommand("insertTab");
    },
    transposeChars: function(cm) {
      runInOp(cm, function() {
        var ranges = cm.listSelections(), newSel = [];
        for (var i = 0; i < ranges.length; i++) {
          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
          if (line) {
            if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
            if (cur.ch > 0) {
              cur = new Pos(cur.line, cur.ch + 1);
              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
            } else if (cur.line > cm.doc.first) {
              var prev = getLine(cm.doc, cur.line - 1).text;
              if (prev)
                cm.replaceRange(line.charAt(0) + "\n" + prev.charAt(prev.length - 1),
                                Pos(cur.line - 1, prev.length - 1), Pos(cur.line, 1), "+transpose");
            }
          }
          newSel.push(new Range(cur, cur));
        }
        cm.setSelections(newSel);
      });
    },
    newlineAndIndent: function(cm) {
      runInOp(cm, function() {
        var len = cm.listSelections().length;
        for (var i = 0; i < len; i++) {
          var range = cm.listSelections()[i];
          cm.replaceRange("\n", range.anchor, range.head, "+input");
          cm.indentLine(range.from().line + 1, null, true);
          ensureCursorVisible(cm);
        }
      });
    },
    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
  };

  // STANDARD KEYMAPS

  var keyMap = CodeMirror.keyMap = {};
  keyMap.basic = {
    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
    "Esc": "singleSelection"
  };
  // Note that the save and find-related commands aren't defined by
  // default. User code or addons can define them. Unknown commands
  // are simply ignored.
  keyMap.pcDefault = {
    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
    "Ctrl-Home": "goDocStart", "Ctrl-Up": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Down": "goDocEnd",
    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
    "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
    fallthrough: "basic"
  };
  keyMap.macDefault = {
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
    "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delGroupBefore",
    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delLineLeft",
    "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection",
    fallthrough: ["basic", "emacsy"]
  };
  // Very basic readline/emacs-style bindings, which are standard on Mac.
  keyMap.emacsy = {
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
  };
  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;

  // KEYMAP DISPATCH

  function getKeyMap(val) {
    if (typeof val == "string") return keyMap[val];
    else return val;
  }

  // Given an array of keymaps and a key name, call handle on any
  // bindings found, until that returns a truthy value, at which point
  // we consider the key handled. Implements things like binding a key
  // to false stopping further handling and keymap fallthrough.
  var lookupKey = CodeMirror.lookupKey = function(name, maps, handle) {
    function lookup(map) {
      map = getKeyMap(map);
      var found = map[name];
      if (found === false) return "stop";
      if (found != null && handle(found)) return true;
      if (map.nofallthrough) return "stop";

      var fallthrough = map.fallthrough;
      if (fallthrough == null) return false;
      if (Object.prototype.toString.call(fallthrough) != "[object Array]")
        return lookup(fallthrough);
      for (var i = 0; i < fallthrough.length; ++i) {
        var done = lookup(fallthrough[i]);
        if (done) return done;
      }
      return false;
    }

    for (var i = 0; i < maps.length; ++i) {
      var done = lookup(maps[i]);
      if (done) return done != "stop";
    }
  };

  // Modifier key presses don't count as 'real' key presses for the
  // purpose of keymap fallthrough.
  var isModifierKey = CodeMirror.isModifierKey = function(event) {
    var name = keyNames[event.keyCode];
    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
  };

  // Look up the name of a key as indicated by an event object.
  var keyName = CodeMirror.keyName = function(event, noShift) {
    if (presto && event.keyCode == 34 && event["char"]) return false;
    var name = keyNames[event.keyCode];
    if (name == null || event.altGraphKey) return false;
    if (event.altKey) name = "Alt-" + name;
    if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = "Ctrl-" + name;
    if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = "Cmd-" + name;
    if (!noShift && event.shiftKey) name = "Shift-" + name;
    return name;
  };

  // FROMTEXTAREA

  CodeMirror.fromTextArea = function(textarea, options) {
    if (!options) options = {};
    options.value = textarea.value;
    if (!options.tabindex && textarea.tabindex)
      options.tabindex = textarea.tabindex;
    if (!options.placeholder && textarea.placeholder)
      options.placeholder = textarea.placeholder;
    // Set autofocus to true if this textarea is focused, or if it has
    // autofocus and no other element is focused.
    if (options.autofocus == null) {
      var hasFocus = activeElt();
      options.autofocus = hasFocus == textarea ||
        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
    }

    function save() {textarea.value = cm.getValue();}
    if (textarea.form) {
      on(textarea.form, "submit", save);
      // Deplorable hack to make the submit method do the right thing.
      if (!options.leaveSubmitMethodAlone) {
        var form = textarea.form, realSubmit = form.submit;
        try {
          var wrappedSubmit = form.submit = function() {
            save();
            form.submit = realSubmit;
            form.submit();
            form.submit = wrappedSubmit;
          };
        } catch(e) {}
      }
    }

    textarea.style.display = "none";
    var cm = CodeMirror(function(node) {
      textarea.parentNode.insertBefore(node, textarea.nextSibling);
    }, options);
    cm.save = save;
    cm.getTextArea = function() { return textarea; };
    cm.toTextArea = function() {
      save();
      textarea.parentNode.removeChild(cm.getWrapperElement());
      textarea.style.display = "";
      if (textarea.form) {
        off(textarea.form, "submit", save);
        if (typeof textarea.form.submit == "function")
          textarea.form.submit = realSubmit;
      }
    };
    return cm;
  };

  // STRING STREAM

  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.

  var StringStream = CodeMirror.StringStream = function(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
    this.lineStart = 0;
  };

  StringStream.prototype = {
    eol: function() {return this.pos >= this.string.length;},
    sol: function() {return this.pos == this.lineStart;},
    peek: function() {return this.string.charAt(this.pos) || undefined;},
    next: function() {
      if (this.pos < this.string.length)
        return this.string.charAt(this.pos++);
    },
    eat: function(match) {
      var ch = this.string.charAt(this.pos);
      if (typeof match == "string") var ok = ch == match;
      else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {++this.pos; return ch;}
    },
    eatWhile: function(match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start;
    },
    eatSpace: function() {
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function() {this.pos = this.string.length;},
    skipTo: function(ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {this.pos = found; return true;}
    },
    backUp: function(n) {this.pos -= n;},
    column: function() {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    indentation: function() {
      return countColumn(this.string, null, this.tabSize) -
        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    match: function(pattern, consume, caseInsensitive) {
      if (typeof pattern == "string") {
        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) this.pos += pattern.length;
          return true;
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        if (match && consume !== false) this.pos += match[0].length;
        return match;
      }
    },
    current: function(){return this.string.slice(this.start, this.pos);},
    hideFirstChars: function(n, inner) {
      this.lineStart += n;
      try { return inner(); }
      finally { this.lineStart -= n; }
    }
  };

  // TEXTMARKERS

  // Created with markText and setBookmark methods. A TextMarker is a
  // handle that can be used to clear or find a marked position in the
  // document. Line objects hold arrays (markedSpans) containing
  // {from, to, marker} object pointing to such marker objects, and
  // indicating that such a marker is present on that line. Multiple
  // lines may point to the same marker when it spans across lines.
  // The spans will have null for their from/to properties when the
  // marker continues beyond the start/end of the line. Markers have
  // links back to the lines they currently touch.

  var TextMarker = CodeMirror.TextMarker = function(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
  };
  eventMixin(TextMarker);

  // Clear the marker.
  TextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    var cm = this.doc.cm, withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);
    if (hasHandler(this, "clear")) {
      var found = this.find();
      if (found) signalLater(this, "clear", found.from, found.to);
    }
    var min = null, max = null;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
      else if (cm) {
        if (span.to != null) max = lineNo(line);
        if (span.from != null) min = lineNo(line);
      }
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm)
        updateLineHeight(line, textHeight(cm.display));
    }
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
      var visual = visualLine(this.lines[i]), len = lineLength(visual);
      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }

    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;
    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm.doc);
    }
    if (cm) signalLater(cm, "markerCleared", cm, this);
    if (withOp) endOperation(cm);
    if (this.parent) this.parent.clear();
  };

  // Find the position of the marker in the document. Returns a {from,
  // to} object by default. Side can be passed to get a specific side
  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
  // Pos objects returned contain a line object, rather than a line
  // number (used to prevent looking up the same line twice).
  TextMarker.prototype.find = function(side, lineObj) {
    if (side == null && this.type == "bookmark") side = 1;
    var from, to;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.from != null) {
        from = Pos(lineObj ? line : lineNo(line), span.from);
        if (side == -1) return from;
      }
      if (span.to != null) {
        to = Pos(lineObj ? line : lineNo(line), span.to);
        if (side == 1) return to;
      }
    }
    return from && {from: from, to: to};
  };

  // Signals that the marker's widget changed, and surrounding layout
  // should be recomputed.
  TextMarker.prototype.changed = function() {
    var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
    if (!pos || !cm) return;
    runInOp(cm, function() {
      var line = pos.line, lineN = lineNo(pos.line);
      var view = findViewForLine(cm, lineN);
      if (view) {
        clearLineMeasurementCacheFor(view);
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
      }
      cm.curOp.updateMaxLine = true;
      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
        var oldHeight = widget.height;
        widget.height = null;
        var dHeight = widgetHeight(widget) - oldHeight;
        if (dHeight)
          updateLineHeight(line, line.height + dHeight);
      }
    });
  };

  TextMarker.prototype.attachLine = function(line) {
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(line);
  };
  TextMarker.prototype.detachLine = function(line) {
    this.lines.splice(indexOf(this.lines, line), 1);
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  };

  // Collapsed markers have unique ids, in order to be able to order
  // them, which is needed for uniquely determining an outer marker
  // when they overlap (they may nest, but not partially overlap).
  var nextMarkerId = 0;

  // Create a marker, wire it up to the right lines, and
  function markText(doc, from, to, options, type) {
    // Shared markers (across linked documents) are handled separately
    // (markTextShared will call out to this again, once per
    // document).
    if (options && options.shared) return markTextShared(doc, from, to, options, type);
    // Ensure we are in an operation.
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

    var marker = new TextMarker(doc, type), diff = cmp(from, to);
    if (options) copyObj(options, marker, false);
    // Don't connect empty markers unless clearWhenEmpty is false
    if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
      return marker;
    if (marker.replacedWith) {
      // Showing up as a widget implies collapsed (widget replaces text)
      marker.collapsed = true;
      marker.widgetNode = elt("span", [marker.replacedWith], "CodeMirror-widget");
      if (!options.handleMouseEvents) marker.widgetNode.ignoreEvents = true;
      if (options.insertLeft) marker.widgetNode.insertLeft = true;
    }
    if (marker.collapsed) {
      if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
          from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
        throw new Error("Inserting collapsed marker partially overlapping an existing one");
      sawCollapsedSpans = true;
    }

    if (marker.addToHistory)
      addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN);

    var curLine = from.line, cm = doc.cm, updateMaxLine;
    doc.iter(curLine, to.line + 1, function(line) {
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
        updateMaxLine = true;
      if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
      addMarkedSpan(line, new MarkedSpan(marker,
                                         curLine == from.line ? from.ch : null,
                                         curLine == to.line ? to.ch : null));
      ++curLine;
    });
    // lineIsHidden depends on the presence of the spans, so needs a second pass
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
    });

    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

    if (marker.readOnly) {
      sawReadOnlySpans = true;
      if (doc.history.done.length || doc.history.undone.length)
        doc.clearHistory();
    }
    if (marker.collapsed) {
      marker.id = ++nextMarkerId;
      marker.atomic = true;
    }
    if (cm) {
      // Sync editor state
      if (updateMaxLine) cm.curOp.updateMaxLine = true;
      if (marker.collapsed)
        regChange(cm, from.line, to.line + 1);
      else if (marker.className || marker.title || marker.startStyle || marker.endStyle)
        for (var i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
      if (marker.atomic) reCheckSelection(cm.doc);
      signalLater(cm, "markerAdded", cm, marker);
    }
    return marker;
  }

  // SHARED TEXTMARKERS

  // A shared marker spans multiple linked documents. It is
  // implemented as a meta-marker-object controlling multiple normal
  // markers.
  var SharedTextMarker = CodeMirror.SharedTextMarker = function(markers, primary) {
    this.markers = markers;
    this.primary = primary;
    for (var i = 0; i < markers.length; ++i)
      markers[i].parent = this;
  };
  eventMixin(SharedTextMarker);

  SharedTextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;
    for (var i = 0; i < this.markers.length; ++i)
      this.markers[i].clear();
    signalLater(this, "clear");
  };
  SharedTextMarker.prototype.find = function(side, lineObj) {
    return this.primary.find(side, lineObj);
  };

  function markTextShared(doc, from, to, options, type) {
    options = copyObj(options);
    options.shared = false;
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
    var widget = options.widgetNode;
    linkedDocs(doc, function(doc) {
      if (widget) options.widgetNode = widget.cloneNode(true);
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
      for (var i = 0; i < doc.linked.length; ++i)
        if (doc.linked[i].isParent) return;
      primary = lst(markers);
    });
    return new SharedTextMarker(markers, primary);
  }

  function findSharedMarkers(doc) {
    return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())),
                         function(m) { return m.parent; });
  }

  function copySharedMarkers(doc, markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], pos = marker.find();
      var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
      if (cmp(mFrom, mTo)) {
        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
        marker.markers.push(subMark);
        subMark.parent = marker;
      }
    }
  }

  function detachSharedMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], linked = [marker.primary.doc];;
      linkedDocs(marker.primary.doc, function(d) { linked.push(d); });
      for (var j = 0; j < marker.markers.length; j++) {
        var subMarker = marker.markers[j];
        if (indexOf(linked, subMarker.doc) == -1) {
          subMarker.parent = null;
          marker.markers.splice(j--, 1);
        }
      }
    }
  }

  // TEXTMARKER SPANS

  function MarkedSpan(marker, from, to) {
    this.marker = marker;
    this.from = from; this.to = to;
  }

  // Search an array of spans for a span matching the given marker.
  function getMarkedSpanFor(spans, marker) {
    if (spans) for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.marker == marker) return span;
    }
  }
  // Remove a span from an array, returning undefined if no spans are
  // left (we don't store arrays for lines without spans).
  function removeMarkedSpan(spans, span) {
    for (var r, i = 0; i < spans.length; ++i)
      if (spans[i] != span) (r || (r = [])).push(spans[i]);
    return r;
  }
  // Add a span to a line.
  function addMarkedSpan(line, span) {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    span.marker.attachLine(line);
  }

  // Used for the algorithm that adjusts markers for a change in the
  // document. These functions cut an array of spans at a given
  // character position, returning an array of remaining chunks (or
  // undefined if nothing remains).
  function markedSpansBefore(old, startCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
      if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
      }
    }
    return nw;
  }
  function markedSpansAfter(old, endCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
      if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
                                              span.to == null ? null : span.to - endCh));
      }
    }
    return nw;
  }

  // Given a change object, compute the new set of marker spans that
  // cover the line in which the change took place. Removes spans
  // entirely within the change, reconnects spans belonging to the
  // same marker that appear on both sides of the change, and cuts off
  // spans partially within the change. Returns an array of span
  // arrays with one element for each line in (after) the change.
  function stretchSpansOverChange(doc, change) {
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
    if (!oldFirst && !oldLast) return null;

    var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
    // Get the spans that 'stick out' on both sides
    var first = markedSpansBefore(oldFirst, startCh, isInsert);
    var last = markedSpansAfter(oldLast, endCh, isInsert);

    // Next, merge those two ends
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
    if (first) {
      // Fix up .to properties of first
      for (var i = 0; i < first.length; ++i) {
        var span = first[i];
        if (span.to == null) {
          var found = getMarkedSpanFor(last, span.marker);
          if (!found) span.to = startCh;
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
        }
      }
    }
    if (last) {
      // Fix up .from in last (or move them into first in case of sameLine)
      for (var i = 0; i < last.length; ++i) {
        var span = last[i];
        if (span.to != null) span.to += offset;
        if (span.from == null) {
          var found = getMarkedSpanFor(first, span.marker);
          if (!found) {
            span.from = offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        } else {
          span.from += offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      }
    }
    // Make sure we didn't create any zero-length spans
    if (first) first = clearEmptySpans(first);
    if (last && last != first) last = clearEmptySpans(last);

    var newMarkers = [first];
    if (!sameLine) {
      // Fill gap with whole-line-spans
      var gap = change.text.length - 2, gapMarkers;
      if (gap > 0 && first)
        for (var i = 0; i < first.length; ++i)
          if (first[i].to == null)
            (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
      for (var i = 0; i < gap; ++i)
        newMarkers.push(gapMarkers);
      newMarkers.push(last);
    }
    return newMarkers;
  }

  // Remove spans that are empty and don't have a clearWhenEmpty
  // option of false.
  function clearEmptySpans(spans) {
    for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
        spans.splice(i--, 1);
    }
    if (!spans.length) return null;
    return spans;
  }

  // Used for un/re-doing changes from the history. Combines the
  // result of computing the existing spans with the set of spans that
  // existed in the history (so that deleting around a span and then
  // undoing brings back the span).
  function mergeOldSpans(doc, change) {
    var old = getOldSpans(doc, change);
    var stretched = stretchSpansOverChange(doc, change);
    if (!old) return stretched;
    if (!stretched) return old;

    for (var i = 0; i < old.length; ++i) {
      var oldCur = old[i], stretchCur = stretched[i];
      if (oldCur && stretchCur) {
        spans: for (var j = 0; j < stretchCur.length; ++j) {
          var span = stretchCur[j];
          for (var k = 0; k < oldCur.length; ++k)
            if (oldCur[k].marker == span.marker) continue spans;
          oldCur.push(span);
        }
      } else if (stretchCur) {
        old[i] = stretchCur;
      }
    }
    return old;
  }

  // Used to 'clip' out readOnly ranges when making a change.
  function removeReadOnlyRanges(doc, from, to) {
    var markers = null;
    doc.iter(from.line, to.line + 1, function(line) {
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
        var mark = line.markedSpans[i].marker;
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
          (markers || (markers = [])).push(mark);
      }
    });
    if (!markers) return null;
    var parts = [{from: from, to: to}];
    for (var i = 0; i < markers.length; ++i) {
      var mk = markers[i], m = mk.find(0);
      for (var j = 0; j < parts.length; ++j) {
        var p = parts[j];
        if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
        var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
        if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
          newParts.push({from: p.from, to: m.from});
        if (dto > 0 || !mk.inclusiveRight && !dto)
          newParts.push({from: m.to, to: p.to});
        parts.splice.apply(parts, newParts);
        j += newParts.length - 1;
      }
    }
    return parts;
  }

  // Connect or disconnect spans from a line.
  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }
  function attachMarkedSpans(line, spans) {
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.attachLine(line);
    line.markedSpans = spans;
  }

  // Helpers used when computing which overlapping collapsed span
  // counts as the larger one.
  function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0; }
  function extraRight(marker) { return marker.inclusiveRight ? 1 : 0; }

  // Returns a number indicating which of two overlapping collapsed
  // spans is larger (and thus includes the other). Falls back to
  // comparing ids when the spans cover exactly the same range.
  function compareCollapsedMarkers(a, b) {
    var lenDiff = a.lines.length - b.lines.length;
    if (lenDiff != 0) return lenDiff;
    var aPos = a.find(), bPos = b.find();
    var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
    if (fromCmp) return -fromCmp;
    var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
    if (toCmp) return toCmp;
    return b.id - a.id;
  }

  // Find out whether a line ends or starts in a collapsed span. If
  // so, return the marker for that span.
  function collapsedSpanAtSide(line, start) {
    var sps = sawCollapsedSpans && line.markedSpans, found;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
          (!found || compareCollapsedMarkers(found, sp.marker) < 0))
        found = sp.marker;
    }
    return found;
  }
  function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true); }
  function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false); }

  // Test whether there exists a collapsed span that partially
  // overlaps (covers the start or end, but not both) of a new span.
  // Such overlap is not allowed.
  function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
    var line = getLine(doc, lineNo);
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var i = 0; i < sps.length; ++i) {
      var sp = sps[i];
      if (!sp.marker.collapsed) continue;
      var found = sp.marker.find(0);
      var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
      var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
      if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
      if (fromCmp <= 0 && (cmp(found.to, from) || extraRight(sp.marker) - extraLeft(marker)) > 0 ||
          fromCmp >= 0 && (cmp(found.from, to) || extraLeft(sp.marker) - extraRight(marker)) < 0)
        return true;
    }
  }

  // A visual line is a line as drawn on the screen. Folding, for
  // example, can cause multiple logical lines to appear on the same
  // visual line. This finds the start of the visual line that the
  // given line is part of (usually that is the line itself).
  function visualLine(line) {
    var merged;
    while (merged = collapsedSpanAtStart(line))
      line = merged.find(-1, true).line;
    return line;
  }

  // Returns an array of logical lines that continue the visual line
  // started by the argument, or undefined if there are no such lines.
  function visualLineContinued(line) {
    var merged, lines;
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      (lines || (lines = [])).push(line);
    }
    return lines;
  }

  // Get the line number of the start of the visual line that the
  // given line number is part of.
  function visualLineNo(doc, lineN) {
    var line = getLine(doc, lineN), vis = visualLine(line);
    if (line == vis) return lineN;
    return lineNo(vis);
  }
  // Get the line number of the start of the next visual line after
  // the given line.
  function visualLineEndNo(doc, lineN) {
    if (lineN > doc.lastLine()) return lineN;
    var line = getLine(doc, lineN), merged;
    if (!lineIsHidden(doc, line)) return lineN;
    while (merged = collapsedSpanAtEnd(line))
      line = merged.find(1, true).line;
    return lineNo(line) + 1;
  }

  // Compute whether a line is hidden. Lines count as hidden when they
  // are part of a visual line that starts with another line, or when
  // they are entirely covered by collapsed, non-widget span.
  function lineIsHidden(doc, line) {
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if (sp.from == null) return true;
      if (sp.marker.widgetNode) continue;
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
        return true;
    }
  }
  function lineIsHiddenInner(doc, line, span) {
    if (span.to == null) {
      var end = span.marker.find(1, true);
      return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
    }
    if (span.marker.inclusiveRight && span.to == line.text.length)
      return true;
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
      sp = line.markedSpans[i];
      if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
          (sp.to == null || sp.to != span.from) &&
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
          lineIsHiddenInner(doc, line, sp)) return true;
    }
  }

  // LINE WIDGETS

  // Line widgets are block elements displayed above or below a line.

  var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {
    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
      this[opt] = options[opt];
    this.cm = cm;
    this.node = node;
  };
  eventMixin(LineWidget);

  function adjustScrollWhenAboveVisible(cm, line, diff) {
    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
      addToScrollPos(cm, null, diff);
  }

  LineWidget.prototype.clear = function() {
    var cm = this.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
    if (no == null || !ws) return;
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
    if (!ws.length) line.widgets = null;
    var height = widgetHeight(this);
    runInOp(cm, function() {
      adjustScrollWhenAboveVisible(cm, line, -height);
      regLineChange(cm, no, "widget");
      updateLineHeight(line, Math.max(0, line.height - height));
    });
  };
  LineWidget.prototype.changed = function() {
    var oldH = this.height, cm = this.cm, line = this.line;
    this.height = null;
    var diff = widgetHeight(this) - oldH;
    if (!diff) return;
    runInOp(cm, function() {
      cm.curOp.forceUpdate = true;
      adjustScrollWhenAboveVisible(cm, line, diff);
      updateLineHeight(line, line.height + diff);
    });
  };

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    if (!contains(document.body, widget.node))
      removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, "position: relative"));
    return widget.height = widget.node.offsetHeight;
  }

  function addLineWidget(cm, handle, node, options) {
    var widget = new LineWidget(cm, node, options);
    if (widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(cm, handle, "widget", function(line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (!lineIsHidden(cm.doc, line)) {
        var aboveVisible = heightAtLine(line) < cm.doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, null, widget.height);
        cm.curOp.forceUpdate = true;
      }
      return true;
    });
    return widget;
  }

  // LINE DATA STRUCTURE

  // Line objects. These hold state related to a line, including
  // highlighting info (the styles array).
  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  };
  eventMixin(Line);
  Line.prototype.lineNo = function() { return lineNo(this); };

  // Change the content (text, markers) of a line. Automatically
  // invalidates cached information and tries to re-estimate the
  // line's height.
  function updateLine(line, text, markedSpans, estimateHeight) {
    line.text = text;
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
    if (line.order != null) line.order = null;
    detachMarkedSpans(line);
    attachMarkedSpans(line, markedSpans);
    var estHeight = estimateHeight ? estimateHeight(line) : 1;
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  }

  // Detach a line from the document tree and its markers.
  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }

  function extractLineClasses(type, output) {
    if (type) for (;;) {
      var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
      if (!lineClass) break;
      type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
      var prop = lineClass[1] ? "bgClass" : "textClass";
      if (output[prop] == null)
        output[prop] = lineClass[2];
      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
        output[prop] += " " + lineClass[2];
    }
    return type;
  }

  function callBlankLine(mode, state) {
    if (mode.blankLine) return mode.blankLine(state);
    if (!mode.innerMode) return;
    var inner = CodeMirror.innerMode(mode, state);
    if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
  }

  function readToken(mode, stream, state) {
    for (var i = 0; i < 10; i++) {
      var style = mode.token(stream, state);
      if (stream.pos > stream.start) return style;
    }
    throw new Error("Mode " + mode.name + " failed to advance stream.");
  }

  // Run the given mode's parser over a line, calling f for each token.
  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        if (forceToEnd) processLine(cm, text, state, stream.pos);
        stream.pos = text.length;
        style = null;
      } else {
        style = extractLineClasses(readToken(mode, stream, state), lineClasses);
      }
      if (cm.options.addModeClass) {
        var mName = CodeMirror.innerMode(mode, state).mode.name;
        if (mName) style = "m-" + (style ? mName + " " + style : mName);
      }
      if (!flattenSpans || curStyle != style) {
        if (curStart < stream.start) f(stream.start, curStyle);
        curStart = stream.start; curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }

  // Compute a style array (an array starting with a mode generation
  // -- for invalidation -- followed by pairs of end positions and
  // style strings), which is used to highlight the tokens on the
  // line.
  function highlightLine(cm, line, state, forceToEnd) {
    // A styles array always starts with a number identifying the
    // mode/overlays that it is based on (for easy invalidation).
    var st = [cm.state.modeGen], lineClasses = {};
    // Compute the base array of styles
    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
      st.push(end, style);
    }, lineClasses, forceToEnd);

    // Run overlays, adjust style array.
    for (var o = 0; o < cm.state.overlays.length; ++o) {
      var overlay = cm.state.overlays[o], i = 1, at = 0;
      runMode(cm, line.text, overlay.mode, true, function(end, style) {
        var start = i;
        // Ensure there's a token end at the current position, and that i points at it
        while (at < end) {
          var i_end = st[i];
          if (i_end > end)
            st.splice(i, 1, end, st[i+1], i_end);
          i += 2;
          at = Math.min(end, i_end);
        }
        if (!style) return;
        if (overlay.opaque) {
          st.splice(start, i - start, end, "cm-overlay " + style);
          i = start + 2;
        } else {
          for (; start < i; start += 2) {
            var cur = st[start+1];
            st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
          }
        }
      }, lineClasses);
    }

    return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
  }

  function getLineStyles(cm, line) {
    if (!line.styles || line.styles[0] != cm.state.modeGen) {
      var result = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
      line.styles = result.styles;
      if (result.classes) line.styleClasses = result.classes;
      else if (line.styleClasses) line.styleClasses = null;
    }
    return line.styles;
  }

  // Lightweight form of highlight -- proceed over this line and
  // update state, but don't save a style array. Used for lines that
  // aren't currently visible.
  function processLine(cm, text, state, startAt) {
    var mode = cm.doc.mode;
    var stream = new StringStream(text, cm.options.tabSize);
    stream.start = stream.pos = startAt || 0;
    if (text == "") callBlankLine(mode, state);
    while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
      readToken(mode, stream, state);
      stream.start = stream.pos;
    }
  }

  // Convert a style as returned by a mode (either null, or a string
  // containing one or more styles) to a CSS style. This is cached,
  // and also looks for line-wide styles.
  var styleToClassCache = {}, styleToClassCacheWithMode = {};
  function interpretTokenStyle(style, options) {
    if (!style || /^\s*$/.test(style)) return null;
    var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
    return cache[style] ||
      (cache[style] = style.replace(/\S+/g, "cm-$&"));
  }

  // Render the DOM representation of the text of a line. Also builds
  // up a 'line map', which points at the DOM nodes that represent
  // specific stretches of text, and is used by the measuring code.
  // The returned object contains the DOM node, this map, and
  // information about line-wide styles that were set by the mode.
  function buildLineContent(cm, lineView) {
    // The padding-right forces the element to have a 'border', which
    // is needed on Webkit to be able to get line-level bounding
    // rectangles for it (in measureChar).
    var content = elt("span", null, null, webkit ? "padding-right: .1px" : null);
    var builder = {pre: elt("pre", [content]), content: content, col: 0, pos: 0, cm: cm};
    lineView.measure = {};

    // Iterate over the logical lines that make up this visual line.
    for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
      var line = i ? lineView.rest[i - 1] : lineView.line, order;
      builder.pos = 0;
      builder.addToken = buildToken;
      // Optionally wire in some hacks into the token-rendering
      // algorithm, to deal with browser quirks.
      if ((ie || webkit) && cm.getOption("lineWrapping"))
        builder.addToken = buildTokenSplitSpaces(builder.addToken);
      if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line)))
        builder.addToken = buildTokenBadBidi(builder.addToken, order);
      builder.map = [];
      insertLineContent(line, builder, getLineStyles(cm, line));
      if (line.styleClasses) {
        if (line.styleClasses.bgClass)
          builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
        if (line.styleClasses.textClass)
          builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
      }

      // Ensure at least a single node is present, for measuring.
      if (builder.map.length == 0)
        builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));

      // Store the map and a cache object for the current logical line
      if (i == 0) {
        lineView.measure.map = builder.map;
        lineView.measure.cache = {};
      } else {
        (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
        (lineView.measure.caches || (lineView.measure.caches = [])).push({});
      }
    }

    signal(cm, "renderLine", cm, lineView.line, builder.pre);
    if (builder.pre.className)
      builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
    return builder;
  }

  function defaultSpecialCharPlaceholder(ch) {
    var token = elt("span", "\u2022", "cm-invalidchar");
    token.title = "\\u" + ch.charCodeAt(0).toString(16);
    return token;
  }

  // Build up the DOM representation for a single token, and add it to
  // the line map. Takes care to render special characters separately.
  function buildToken(builder, text, style, startStyle, endStyle, title) {
    if (!text) return;
    var special = builder.cm.options.specialChars, mustWrap = false;
    if (!special.test(text)) {
      builder.col += text.length;
      var content = document.createTextNode(text);
      builder.map.push(builder.pos, builder.pos + text.length, content);
      if (ie_upto8) mustWrap = true;
      builder.pos += text.length;
    } else {
      var content = document.createDocumentFragment(), pos = 0;
      while (true) {
        special.lastIndex = pos;
        var m = special.exec(text);
        var skipped = m ? m.index - pos : text.length - pos;
        if (skipped) {
          var txt = document.createTextNode(text.slice(pos, pos + skipped));
          if (ie_upto8) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.map.push(builder.pos, builder.pos + skipped, txt);
          builder.col += skipped;
          builder.pos += skipped;
        }
        if (!m) break;
        pos += skipped + 1;
        if (m[0] == "\t") {
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
          var txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
          builder.col += tabWidth;
        } else {
          var txt = builder.cm.options.specialCharPlaceholder(m[0]);
          if (ie_upto8) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.col += 1;
        }
        builder.map.push(builder.pos, builder.pos + 1, txt);
        builder.pos++;
      }
    }
    if (style || startStyle || endStyle || mustWrap) {
      var fullStyle = style || "";
      if (startStyle) fullStyle += startStyle;
      if (endStyle) fullStyle += endStyle;
      var token = elt("span", [content], fullStyle);
      if (title) token.title = title;
      return builder.content.appendChild(token);
    }
    builder.content.appendChild(content);
  }

  function buildTokenSplitSpaces(inner) {
    function split(old) {
      var out = " ";
      for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
      out += " ";
      return out;
    }
    return function(builder, text, style, startStyle, endStyle, title) {
      inner(builder, text.replace(/ {3,}/g, split), style, startStyle, endStyle, title);
    };
  }

  // Work around nonsense dimensions being reported for stretches of
  // right-to-left text.
  function buildTokenBadBidi(inner, order) {
    return function(builder, text, style, startStyle, endStyle, title) {
      style = style ? style + " cm-force-border" : "cm-force-border";
      var start = builder.pos, end = start + text.length;
      for (;;) {
        // Find the part that overlaps with the start of this text
        for (var i = 0; i < order.length; i++) {
          var part = order[i];
          if (part.to > start && part.from <= start) break;
        }
        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, title);
        inner(builder, text.slice(0, part.to - start), style, startStyle, null, title);
        startStyle = null;
        text = text.slice(part.to - start);
        start = part.to;
      }
    };
  }

  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
    var widget = !ignoreWidget && marker.widgetNode;
    if (widget) {
      builder.map.push(builder.pos, builder.pos + size, widget);
      builder.content.appendChild(widget);
    }
    builder.pos += size;
  }

  // Outputs a number of spans to make up a line, taking highlighting
  // and marked text into account.
  function insertLineContent(line, builder, styles) {
    var spans = line.markedSpans, allText = line.text, at = 0;
    if (!spans) {
      for (var i = 1; i < styles.length; i+=2)
        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder.cm.options));
      return;
    }

    var len = allText.length, pos = 0, i = 1, text = "", style;
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
    for (;;) {
      if (nextChange == pos) { // Update current marker set
        spanStyle = spanEndStyle = spanStartStyle = title = "";
        collapsed = null; nextChange = Infinity;
        var foundBookmarks = [];
        for (var j = 0; j < spans.length; ++j) {
          var sp = spans[j], m = sp.marker;
          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
            if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }
            if (m.className) spanStyle += " " + m.className;
            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
            if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;
            if (m.title && !title) title = m.title;
            if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
              collapsed = sp;
          } else if (sp.from > pos && nextChange > sp.from) {
            nextChange = sp.from;
          }
          if (m.type == "bookmark" && sp.from == pos && m.widgetNode) foundBookmarks.push(m);
        }
        if (collapsed && (collapsed.from || 0) == pos) {
          buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                             collapsed.marker, collapsed.from == null);
          if (collapsed.to == null) return;
        }
        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
      }
      if (pos >= len) break;

      var upto = Math.min(len, nextChange);
      while (true) {
        if (text) {
          var end = pos + text.length;
          if (!collapsed) {
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title);
          }
          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
          pos = end;
          spanStartStyle = "";
        }
        text = allText.slice(at, at = styles[i++]);
        style = interpretTokenStyle(styles[i++], builder.cm.options);
      }
    }
  }

  // DOCUMENT DATA STRUCTURE

  // By default, updates that start and end at the beginning of a line
  // are treated specially, in order to make the association of line
  // widgets and marker elements with the text behave more intuitive.
  function isWholeLineUpdate(doc, change) {
    return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
      (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
  }

  // Perform a change on the document data structure.
  function updateDoc(doc, change, markedSpans, estimateHeight) {
    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
    function update(line, text, spans) {
      updateLine(line, text, spans, estimateHeight);
      signalLater(line, "change", line, change);
    }

    var from = change.from, to = change.to, text = change.text;
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

    // Adjust the line structure
    if (isWholeLineUpdate(doc, change)) {
      // This is a whole-line replace. Treated specially to make
      // sure line objects move the way they are supposed to.
      for (var i = 0, added = []; i < text.length - 1; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      update(lastLine, lastLine.text, lastSpans);
      if (nlines) doc.remove(from.line, nlines);
      if (added.length) doc.insert(from.line, added);
    } else if (firstLine == lastLine) {
      if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
      } else {
        for (var added = [], i = 1; i < text.length - 1; ++i)
          added.push(new Line(text[i], spansFor(i), estimateHeight));
        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        doc.insert(from.line + 1, added);
      }
    } else if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
      doc.remove(from.line + 1, nlines);
    } else {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
      for (var i = 1, added = []; i < text.length - 1; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
      doc.insert(from.line + 1, added);
    }

    signalLater(doc, "change", doc, change);
  }

  // The document is represented as a BTree consisting of leaves, with
  // chunk of lines in them, and branches, with up to ten leaves or
  // other branch nodes below them. The top node is always a branch
  // node, and is the document object itself (meaning it has
  // additional methods and properties).
  //
  // All nodes have parent links. The tree is used both to go from
  // line numbers to line objects, and to go from objects to numbers.
  // It also indexes by height, and is used to convert between height
  // and line object, and to find the total height of the document.
  //
  // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, height = 0; i < lines.length; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }

  LeafChunk.prototype = {
    chunkSize: function() { return this.lines.length; },
    // Remove the n lines at offset 'at'.
    removeInner: function(at, n) {
      for (var i = at, e = at + n; i < e; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, "delete");
      }
      this.lines.splice(at, n);
    },
    // Helper used to collapse a small branch into a single leaf.
    collapse: function(lines) {
      lines.push.apply(lines, this.lines);
    },
    // Insert the given array of lines at offset 'at', count them as
    // having the given height.
    insertInner: function(at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0; i < lines.length; ++i) lines[i].parent = this;
    },
    // Used to iterate over a part of the tree.
    iterN: function(at, n, op) {
      for (var e = at + n; at < e; ++at)
        if (op(this.lines[at])) return true;
    }
  };

  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0; i < children.length; ++i) {
      var ch = children[i];
      size += ch.chunkSize(); height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }

  BranchChunk.prototype = {
    chunkSize: function() { return this.size; },
    removeInner: function(at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
          if ((n -= rm) == 0) break;
          at = 0;
        } else at -= sz;
      }
      // If the result is smaller than 25 lines, ensure that it is a
      // single leaf node.
      if (this.size - n < 25 &&
          (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
        var lines = [];
        this.collapse(lines);
        this.children = [new LeafChunk(lines)];
        this.children[0].parent = this;
      }
    },
    collapse: function(lines) {
      for (var i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
    },
    insertInner: function(at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at <= sz) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            while (child.lines.length > 50) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    // When a node has grown, check whether it should be split.
    maybeSpill: function() {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (!me.parent) { // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [copy, sibling];
          me = copy;
        } else {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function(at, n, op) {
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return true;
          if ((n -= used) == 0) break;
          at = 0;
        } else at -= sz;
      }
    }
  };

  var nextDocId = 0;
  var Doc = CodeMirror.Doc = function(text, mode, firstLine) {
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
    if (firstLine == null) firstLine = 0;

    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
    this.first = firstLine;
    this.scrollTop = this.scrollLeft = 0;
    this.cantEdit = false;
    this.cleanGeneration = 1;
    this.frontier = firstLine;
    var start = Pos(firstLine, 0);
    this.sel = simpleSelection(start);
    this.history = new History(null);
    this.id = ++nextDocId;
    this.modeOption = mode;

    if (typeof text == "string") text = splitLines(text);
    updateDoc(this, {from: start, to: start, text: text});
    setSelection(this, simpleSelection(start), sel_dontScroll);
  };

  Doc.prototype = createObj(BranchChunk.prototype, {
    constructor: Doc,
    // Iterate over the document. Supports two forms -- with only one
    // argument, it calls that for each line in the document. With
    // three, it iterates over the range given by the first two (with
    // the second being non-inclusive).
    iter: function(from, to, op) {
      if (op) this.iterN(from - this.first, to - from, op);
      else this.iterN(this.first, this.first + this.size, from);
    },

    // Non-public interface for adding and removing lines.
    insert: function(at, lines) {
      var height = 0;
      for (var i = 0; i < lines.length; ++i) height += lines[i].height;
      this.insertInner(at - this.first, lines, height);
    },
    remove: function(at, n) { this.removeInner(at - this.first, n); },

    // From here, the methods are part of the public interface. Most
    // are also available from CodeMirror (editor) instances.

    getValue: function(lineSep) {
      var lines = getLines(this, this.first, this.first + this.size);
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },
    setValue: docMethodOp(function(code) {
      var top = Pos(this.first, 0), last = this.first + this.size - 1;
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                        text: splitLines(code), origin: "setValue"}, true);
      setSelection(this, simpleSelection(top));
    }),
    replaceRange: function(code, from, to, origin) {
      from = clipPos(this, from);
      to = to ? clipPos(this, to) : from;
      replaceRange(this, code, from, to, origin);
    },
    getRange: function(from, to, lineSep) {
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },

    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},

    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
    getLineNumber: function(line) {return lineNo(line);},

    getLineHandleVisualStart: function(line) {
      if (typeof line == "number") line = getLine(this, line);
      return visualLine(line);
    },

    lineCount: function() {return this.size;},
    firstLine: function() {return this.first;},
    lastLine: function() {return this.first + this.size - 1;},

    clipPos: function(pos) {return clipPos(this, pos);},

    getCursor: function(start) {
      var range = this.sel.primary(), pos;
      if (start == null || start == "head") pos = range.head;
      else if (start == "anchor") pos = range.anchor;
      else if (start == "end" || start == "to" || start === false) pos = range.to();
      else pos = range.from();
      return pos;
    },
    listSelections: function() { return this.sel.ranges; },
    somethingSelected: function() {return this.sel.somethingSelected();},

    setCursor: docMethodOp(function(line, ch, options) {
      setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
    }),
    setSelection: docMethodOp(function(anchor, head, options) {
      setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
    }),
    extendSelection: docMethodOp(function(head, other, options) {
      extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
    }),
    extendSelections: docMethodOp(function(heads, options) {
      extendSelections(this, clipPosArray(this, heads, options));
    }),
    extendSelectionsBy: docMethodOp(function(f, options) {
      extendSelections(this, map(this.sel.ranges, f), options);
    }),
    setSelections: docMethodOp(function(ranges, primary, options) {
      if (!ranges.length) return;
      for (var i = 0, out = []; i < ranges.length; i++)
        out[i] = new Range(clipPos(this, ranges[i].anchor),
                           clipPos(this, ranges[i].head));
      if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
      setSelection(this, normalizeSelection(out, primary), options);
    }),
    addSelection: docMethodOp(function(anchor, head, options) {
      var ranges = this.sel.ranges.slice(0);
      ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
      setSelection(this, normalizeSelection(ranges, ranges.length - 1), options);
    }),

    getSelection: function(lineSep) {
      var ranges = this.sel.ranges, lines;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        lines = lines ? lines.concat(sel) : sel;
      }
      if (lineSep === false) return lines;
      else return lines.join(lineSep || "\n");
    },
    getSelections: function(lineSep) {
      var parts = [], ranges = this.sel.ranges;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        if (lineSep !== false) sel = sel.join(lineSep || "\n");
        parts[i] = sel;
      }
      return parts;
    },
    replaceSelection: function(code, collapse, origin) {
      var dup = [];
      for (var i = 0; i < this.sel.ranges.length; i++)
        dup[i] = code;
      this.replaceSelections(dup, collapse, origin || "+input");
    },
    replaceSelections: docMethodOp(function(code, collapse, origin) {
      var changes = [], sel = this.sel;
      for (var i = 0; i < sel.ranges.length; i++) {
        var range = sel.ranges[i];
        changes[i] = {from: range.from(), to: range.to(), text: splitLines(code[i]), origin: origin};
      }
      var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
      for (var i = changes.length - 1; i >= 0; i--)
        makeChange(this, changes[i]);
      if (newSel) setSelectionReplaceHistory(this, newSel);
      else if (this.cm) ensureCursorVisible(this.cm);
    }),
    undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
    redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
    undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
    redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),

    setExtending: function(val) {this.extend = val;},
    getExtending: function() {return this.extend;},

    historySize: function() {
      var hist = this.history, done = 0, undone = 0;
      for (var i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;
      for (var i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;
      return {undo: done, redo: undone};
    },
    clearHistory: function() {this.history = new History(this.history.maxGeneration);},

    markClean: function() {
      this.cleanGeneration = this.changeGeneration(true);
    },
    changeGeneration: function(forceSplit) {
      if (forceSplit)
        this.history.lastOp = this.history.lastOrigin = null;
      return this.history.generation;
    },
    isClean: function (gen) {
      return this.history.generation == (gen || this.cleanGeneration);
    },

    getHistory: function() {
      return {done: copyHistoryArray(this.history.done),
              undone: copyHistoryArray(this.history.undone)};
    },
    setHistory: function(histData) {
      var hist = this.history = new History(this.history.maxGeneration);
      hist.done = copyHistoryArray(histData.done.slice(0), null, true);
      hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
    },

    markText: function(from, to, options) {
      return markText(this, clipPos(this, from), clipPos(this, to), options, "range");
    },
    setBookmark: function(pos, options) {
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                      insertLeft: options && options.insertLeft,
                      clearWhenEmpty: false, shared: options && options.shared};
      pos = clipPos(this, pos);
      return markText(this, pos, pos, realOpts, "bookmark");
    },
    findMarksAt: function(pos) {
      pos = clipPos(this, pos);
      var markers = [], spans = getLine(this, pos.line).markedSpans;
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if ((span.from == null || span.from <= pos.ch) &&
            (span.to == null || span.to >= pos.ch))
          markers.push(span.marker.parent || span.marker);
      }
      return markers;
    },
    findMarks: function(from, to, filter) {
      from = clipPos(this, from); to = clipPos(this, to);
      var found = [], lineNo = from.line;
      this.iter(from.line, to.line + 1, function(line) {
        var spans = line.markedSpans;
        if (spans) for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (!(lineNo == from.line && from.ch > span.to ||
                span.from == null && lineNo != from.line||
                lineNo == to.line && span.from > to.ch) &&
              (!filter || filter(span.marker)))
            found.push(span.marker.parent || span.marker);
        }
        ++lineNo;
      });
      return found;
    },
    getAllMarks: function() {
      var markers = [];
      this.iter(function(line) {
        var sps = line.markedSpans;
        if (sps) for (var i = 0; i < sps.length; ++i)
          if (sps[i].from != null) markers.push(sps[i].marker);
      });
      return markers;
    },

    posFromIndex: function(off) {
      var ch, lineNo = this.first;
      this.iter(function(line) {
        var sz = line.text.length + 1;
        if (sz > off) { ch = off; return true; }
        off -= sz;
        ++lineNo;
      });
      return clipPos(this, Pos(lineNo, ch));
    },
    indexFromPos: function (coords) {
      coords = clipPos(this, coords);
      var index = coords.ch;
      if (coords.line < this.first || coords.ch < 0) return 0;
      this.iter(this.first, coords.line, function (line) {
        index += line.text.length + 1;
      });
      return index;
    },

    copy: function(copyHistory) {
      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
      doc.sel = this.sel;
      doc.extend = false;
      if (copyHistory) {
        doc.history.undoDepth = this.history.undoDepth;
        doc.setHistory(this.getHistory());
      }
      return doc;
    },

    linkedDoc: function(options) {
      if (!options) options = {};
      var from = this.first, to = this.first + this.size;
      if (options.from != null && options.from > from) from = options.from;
      if (options.to != null && options.to < to) to = options.to;
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
      if (options.sharedHist) copy.history = this.history;
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
      copySharedMarkers(copy, findSharedMarkers(this));
      return copy;
    },
    unlinkDoc: function(other) {
      if (other instanceof CodeMirror) other = other.doc;
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
        var link = this.linked[i];
        if (link.doc != other) continue;
        this.linked.splice(i, 1);
        other.unlinkDoc(this);
        detachSharedMarkers(findSharedMarkers(this));
        break;
      }
      // If the histories were shared, split them again
      if (other.history == this.history) {
        var splitIds = [other.id];
        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
        other.history = new History(null);
        other.history.done = copyHistoryArray(this.history.done, splitIds);
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
      }
    },
    iterLinkedDocs: function(f) {linkedDocs(this, f);},

    getMode: function() {return this.mode;},
    getEditor: function() {return this.cm;}
  });

  // Public alias.
  Doc.prototype.eachLine = Doc.prototype.iter;

  // Set up methods on CodeMirror's prototype to redirect to the editor's document.
  var dontDelegate = "iter insert remove copy getEditor".split(" ");
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function(method) {
      return function() {return method.apply(this.doc, arguments);};
    })(Doc.prototype[prop]);

  eventMixin(Doc);

  // Call f for all linked documents.
  function linkedDocs(doc, f, sharedHistOnly) {
    function propagate(doc, skip, sharedHist) {
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
        var rel = doc.linked[i];
        if (rel.doc == skip) continue;
        var shared = sharedHist && rel.sharedHist;
        if (sharedHistOnly && !shared) continue;
        f(rel.doc, shared);
        propagate(rel.doc, doc, shared);
      }
    }
    propagate(doc, null, true);
  }

  // Attach a document to an editor.
  function attachDoc(cm, doc) {
    if (doc.cm) throw new Error("This document is already in use.");
    cm.doc = doc;
    doc.cm = cm;
    estimateLineHeights(cm);
    loadMode(cm);
    if (!cm.options.lineWrapping) findMaxLine(cm);
    cm.options.mode = doc.modeOption;
    regChange(cm);
  }

  // LINE UTILITIES

  // Find the line object corresponding to the given line number.
  function getLine(doc, n) {
    n -= doc.first;
    if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
    for (var chunk = doc; !chunk.lines;) {
      for (var i = 0;; ++i) {
        var child = chunk.children[i], sz = child.chunkSize();
        if (n < sz) { chunk = child; break; }
        n -= sz;
      }
    }
    return chunk.lines[n];
  }

  // Get the part of a document between two positions, as an array of
  // strings.
  function getBetween(doc, start, end) {
    var out = [], n = start.line;
    doc.iter(start.line, end.line + 1, function(line) {
      var text = line.text;
      if (n == end.line) text = text.slice(0, end.ch);
      if (n == start.line) text = text.slice(start.ch);
      out.push(text);
      ++n;
    });
    return out;
  }
  // Get the lines between from and to, as array of strings.
  function getLines(doc, from, to) {
    var out = [];
    doc.iter(from, to, function(line) { out.push(line.text); });
    return out;
  }

  // Update the height of a line, propagating the height change
  // upwards to parent nodes.
  function updateLineHeight(line, height) {
    var diff = height - line.height;
    if (diff) for (var n = line; n; n = n.parent) n.height += diff;
  }

  // Given a line object, find its line number by walking up through
  // its parent links.
  function lineNo(line) {
    if (line.parent == null) return null;
    var cur = line.parent, no = indexOf(cur.lines, line);
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
      for (var i = 0;; ++i) {
        if (chunk.children[i] == cur) break;
        no += chunk.children[i].chunkSize();
      }
    }
    return no + cur.first;
  }

  // Find the line at the given vertical position, using the height
  // information in the document tree.
  function lineAtHeight(chunk, h) {
    var n = chunk.first;
    outer: do {
      for (var i = 0; i < chunk.children.length; ++i) {
        var child = chunk.children[i], ch = child.height;
        if (h < ch) { chunk = child; continue outer; }
        h -= ch;
        n += child.chunkSize();
      }
      return n;
    } while (!chunk.lines);
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i], lh = line.height;
      if (h < lh) break;
      h -= lh;
    }
    return n + i;
  }


  // Find the height above the given line.
  function heightAtLine(lineObj) {
    lineObj = visualLine(lineObj);

    var h = 0, chunk = lineObj.parent;
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i];
      if (line == lineObj) break;
      else h += line.height;
    }
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
      for (var i = 0; i < p.children.length; ++i) {
        var cur = p.children[i];
        if (cur == chunk) break;
        else h += cur.height;
      }
    }
    return h;
  }

  // Get the bidi ordering for the given line (and cache it). Returns
  // false for lines that are fully left-to-right, and an array of
  // BidiSpan objects otherwise.
  function getOrder(line) {
    var order = line.order;
    if (order == null) order = line.order = bidiOrdering(line.text);
    return order;
  }

  // HISTORY

  function History(startGen) {
    // Arrays of change events and selections. Doing something adds an
    // event to done and clears undo. Undoing moves events from done
    // to undone, redoing moves them in the other direction.
    this.done = []; this.undone = [];
    this.undoDepth = Infinity;
    // Used to track when changes can be merged into a single undo
    // event
    this.lastModTime = this.lastSelTime = 0;
    this.lastOp = null;
    this.lastOrigin = this.lastSelOrigin = null;
    // Used by the isClean() method
    this.generation = this.maxGeneration = startGen || 1;
  }

  // Create a history change event from an updateDoc-style change
  // object.
  function historyChangeFromChange(doc, change) {
    var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
    return histChange;
  }

  // Pop all selection events off the end of a history array. Stop at
  // a change event.
  function clearSelectionEvents(array) {
    while (array.length) {
      var last = lst(array);
      if (last.ranges) array.pop();
      else break;
    }
  }

  // Find the top change event in the history. Pop off selection
  // events that are in the way.
  function lastChangeEvent(hist, force) {
    if (force) {
      clearSelectionEvents(hist.done);
      return lst(hist.done);
    } else if (hist.done.length && !lst(hist.done).ranges) {
      return lst(hist.done);
    } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
      hist.done.pop();
      return lst(hist.done);
    }
  }

  // Register a change in the history. Merges changes that are within
  // a single operation, ore are close together with an origin that
  // allows merging (starting with "+") into a single event.
  function addChangeToHistory(doc, change, selAfter, opId) {
    var hist = doc.history;
    hist.undone.length = 0;
    var time = +new Date, cur;

    if ((hist.lastOp == opId ||
         hist.lastOrigin == change.origin && change.origin &&
         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastModTime > time - doc.cm.options.historyEventDelay) ||
          change.origin.charAt(0) == "*")) &&
        (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
      // Merge this change into the last event
      var last = lst(cur.changes);
      if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
        // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change);
      } else {
        // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
      }
    } else {
      // Can not be merged, start a new event.
      var before = lst(hist.done);
      if (!before || !before.ranges)
        pushSelectionToHistory(doc.sel, hist.done);
      cur = {changes: [historyChangeFromChange(doc, change)],
             generation: hist.generation};
      hist.done.push(cur);
      while (hist.done.length > hist.undoDepth) {
        hist.done.shift();
        if (!hist.done[0].ranges) hist.done.shift();
      }
    }
    hist.done.push(selAfter);
    hist.generation = ++hist.maxGeneration;
    hist.lastModTime = hist.lastSelTime = time;
    hist.lastOp = opId;
    hist.lastOrigin = hist.lastSelOrigin = change.origin;

    if (!last) signal(doc, "historyAdded");
  }

  function selectionEventCanBeMerged(doc, origin, prev, sel) {
    var ch = origin.charAt(0);
    return ch == "*" ||
      ch == "+" &&
      prev.ranges.length == sel.ranges.length &&
      prev.somethingSelected() == sel.somethingSelected() &&
      new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
  }

  // Called whenever the selection changes, sets the new selection as
  // the pending selection in the history, and pushes the old pending
  // selection into the 'done' array when it was significantly
  // different (in number of selected ranges, emptiness, or time).
  function addSelectionToHistory(doc, sel, opId, options) {
    var hist = doc.history, origin = options && options.origin;

    // A new event is started when the previous origin does not match
    // the current, or the origins don't allow matching. Origins
    // starting with * are always merged, those starting with + are
    // merged when similar and close together in time.
    if (opId == hist.lastOp ||
        (origin && hist.lastSelOrigin == origin &&
         (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
          selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
      hist.done[hist.done.length - 1] = sel;
    else
      pushSelectionToHistory(sel, hist.done);

    hist.lastSelTime = +new Date;
    hist.lastSelOrigin = origin;
    hist.lastOp = opId;
    if (options && options.clearRedo !== false)
      clearSelectionEvents(hist.undone);
  }

  function pushSelectionToHistory(sel, dest) {
    var top = lst(dest);
    if (!(top && top.ranges && top.equals(sel)))
      dest.push(sel);
  }

  // Used to store marked span information in the history.
  function attachLocalSpans(doc, change, from, to) {
    var existing = change["spans_" + doc.id], n = 0;
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
      if (line.markedSpans)
        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
      ++n;
    });
  }

  // When un/re-doing restores text containing marked spans, those
  // that have been explicitly cleared should not be restored.
  function removeClearedSpans(spans) {
    if (!spans) return null;
    for (var i = 0, out; i < spans.length; ++i) {
      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
      else if (out) out.push(spans[i]);
    }
    return !out ? spans : out.length ? out : null;
  }

  // Retrieve and filter the old marked spans stored in a change event.
  function getOldSpans(doc, change) {
    var found = change["spans_" + doc.id];
    if (!found) return null;
    for (var i = 0, nw = []; i < change.text.length; ++i)
      nw.push(removeClearedSpans(found[i]));
    return nw;
  }

  // Used both to provide a JSON-safe object in .getHistory, and, when
  // detaching a document, to split the history in two
  function copyHistoryArray(events, newGroup, instantiateSel) {
    for (var i = 0, copy = []; i < events.length; ++i) {
      var event = events[i];
      if (event.ranges) {
        copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
        continue;
      }
      var changes = event.changes, newChanges = [];
      copy.push({changes: newChanges});
      for (var j = 0; j < changes.length; ++j) {
        var change = changes[j], m;
        newChanges.push({from: change.from, to: change.to, text: change.text});
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
          if (indexOf(newGroup, Number(m[1])) > -1) {
            lst(newChanges)[prop] = change[prop];
            delete change[prop];
          }
        }
      }
    }
    return copy;
  }

  // Rebasing/resetting history to deal with externally-sourced changes

  function rebaseHistSelSingle(pos, from, to, diff) {
    if (to < pos.line) {
      pos.line += diff;
    } else if (from < pos.line) {
      pos.line = from;
      pos.ch = 0;
    }
  }

  // Tries to rebase an array of history events given a change in the
  // document. If the change touches the same lines as the event, the
  // event, and everything 'behind' it, is discarded. If the change is
  // before the event, the event's positions are updated. Uses a
  // copy-on-write scheme for the positions, to avoid having to
  // reallocate them all on every rebase, but also avoid problems with
  // shared position objects being unsafely updated.
  function rebaseHistArray(array, from, to, diff) {
    for (var i = 0; i < array.length; ++i) {
      var sub = array[i], ok = true;
      if (sub.ranges) {
        if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
        for (var j = 0; j < sub.ranges.length; j++) {
          rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
          rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
        }
        continue;
      }
      for (var j = 0; j < sub.changes.length; ++j) {
        var cur = sub.changes[j];
        if (to < cur.from.line) {
          cur.from = Pos(cur.from.line + diff, cur.from.ch);
          cur.to = Pos(cur.to.line + diff, cur.to.ch);
        } else if (from <= cur.to.line) {
          ok = false;
          break;
        }
      }
      if (!ok) {
        array.splice(0, i + 1);
        i = 0;
      }
    }
  }

  function rebaseHist(hist, change) {
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
    rebaseHistArray(hist.done, from, to, diff);
    rebaseHistArray(hist.undone, from, to, diff);
  }

  // EVENT UTILITIES

  // Due to the fact that we still support jurassic IE versions, some
  // compatibility wrappers are needed.

  var e_preventDefault = CodeMirror.e_preventDefault = function(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  };
  var e_stopPropagation = CodeMirror.e_stopPropagation = function(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  };
  function e_defaultPrevented(e) {
    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
  }
  var e_stop = CodeMirror.e_stop = function(e) {e_preventDefault(e); e_stopPropagation(e);};

  function e_target(e) {return e.target || e.srcElement;}
  function e_button(e) {
    var b = e.which;
    if (b == null) {
      if (e.button & 1) b = 1;
      else if (e.button & 2) b = 3;
      else if (e.button & 4) b = 2;
    }
    if (mac && e.ctrlKey && b == 1) b = 3;
    return b;
  }

  // EVENT HANDLING

  // Lightweight event framework. on/off also work on DOM nodes,
  // registering native DOM handlers.

  var on = CodeMirror.on = function(emitter, type, f) {
    if (emitter.addEventListener)
      emitter.addEventListener(type, f, false);
    else if (emitter.attachEvent)
      emitter.attachEvent("on" + type, f);
    else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  };

  var off = CodeMirror.off = function(emitter, type, f) {
    if (emitter.removeEventListener)
      emitter.removeEventListener(type, f, false);
    else if (emitter.detachEvent)
      emitter.detachEvent("on" + type, f);
    else {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] == f) { arr.splice(i, 1); break; }
    }
  };

  var signal = CodeMirror.signal = function(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
  };

  // Often, we want to signal events at a point where we are in the
  // middle of some work, but don't want the handler to start calling
  // other methods on the editor, which might be in an inconsistent
  // state or simply not expect any other events to happen.
  // signalLater looks whether there are any handlers, and schedules
  // them to be executed when the last operation ends, or, if no
  // operation is active, when a timeout fires.
  var delayedCallbacks, delayedCallbackDepth = 0;
  function signalLater(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    if (!delayedCallbacks) {
      ++delayedCallbackDepth;
      delayedCallbacks = [];
      setTimeout(fireDelayed, 0);
    }
    function bnd(f) {return function(){f.apply(null, args);};};
    for (var i = 0; i < arr.length; ++i)
      delayedCallbacks.push(bnd(arr[i]));
  }

  function fireDelayed() {
    --delayedCallbackDepth;
    var delayed = delayedCallbacks;
    delayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  // The DOM events that CodeMirror handles can be overridden by
  // registering a (non-DOM) handler on the editor for the event name,
  // and preventDefault-ing the event in that handler.
  function signalDOMEvent(cm, e, override) {
    signal(cm, override || e.type, cm, e);
    return e_defaultPrevented(e) || e.codemirrorIgnore;
  }

  function signalCursorActivity(cm) {
    var arr = cm._handlers && cm._handlers.cursorActivity;
    if (!arr) return;
    var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
    for (var i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1)
      set.push(arr[i]);
  }

  function hasHandler(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    return arr && arr.length > 0;
  }

  // Add on and off methods to a constructor's prototype, to make
  // registering events on such objects more convenient.
  function eventMixin(ctor) {
    ctor.prototype.on = function(type, f) {on(this, type, f);};
    ctor.prototype.off = function(type, f) {off(this, type, f);};
  }

  // MISC UTILITIES

  // Number of pixels added to scroller and sizer to hide scrollbar
  var scrollerCutOff = 30;

  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

  // Reused option objects for setSelection & friends
  var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};

  function Delayed() {this.id = null;}
  Delayed.prototype.set = function(ms, f) {
    clearTimeout(this.id);
    this.id = setTimeout(f, ms);
  };

  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  var countColumn = CodeMirror.countColumn = function(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
      end = string.search(/[^\s\u00a0]/);
      if (end == -1) end = string.length;
    }
    for (var i = startIndex || 0, n = startValue || 0;;) {
      var nextTab = string.indexOf("\t", i);
      if (nextTab < 0 || nextTab >= end)
        return n + (end - i);
      n += nextTab - i;
      n += tabSize - (n % tabSize);
      i = nextTab + 1;
    }
  };

  // The inverse of countColumn -- find the offset that corresponds to
  // a particular column.
  function findColumn(string, goal, tabSize) {
    for (var pos = 0, col = 0;;) {
      var nextTab = string.indexOf("\t", pos);
      if (nextTab == -1) nextTab = string.length;
      var skipped = nextTab - pos;
      if (nextTab == string.length || col + skipped >= goal)
        return pos + Math.min(skipped, goal - col);
      col += nextTab - pos;
      col += tabSize - (col % tabSize);
      pos = nextTab + 1;
      if (col >= goal) return pos;
    }
  }

  var spaceStrs = [""];
  function spaceStr(n) {
    while (spaceStrs.length <= n)
      spaceStrs.push(lst(spaceStrs) + " ");
    return spaceStrs[n];
  }

  function lst(arr) { return arr[arr.length-1]; }

  var selectInput = function(node) { node.select(); };
  if (ios) // Mobile Safari apparently has a bug where select() is broken.
    selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; };
  else if (ie) // Suppress mysterious IE10 errors
    selectInput = function(node) { try { node.select(); } catch(_e) {} };

  function indexOf(array, elt) {
    for (var i = 0; i < array.length; ++i)
      if (array[i] == elt) return i;
    return -1;
  }
  if ([].indexOf) indexOf = function(array, elt) { return array.indexOf(elt); };
  function map(array, f) {
    var out = [];
    for (var i = 0; i < array.length; i++) out[i] = f(array[i], i);
    return out;
  }
  if ([].map) map = function(array, f) { return array.map(f); };

  function createObj(base, props) {
    var inst;
    if (Object.create) {
      inst = Object.create(base);
    } else {
      var ctor = function() {};
      ctor.prototype = base;
      inst = new ctor();
    }
    if (props) copyObj(props, inst);
    return inst;
  };

  function copyObj(obj, target, overwrite) {
    if (!target) target = {};
    for (var prop in obj)
      if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
        target[prop] = obj[prop];
    return target;
  }

  function bind(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){return f.apply(null, args);};
  }

  var nonASCIISingleCaseWordChar = /[\u00df\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  var isWordCharBasic = CodeMirror.isWordChar = function(ch) {
    return /\w/.test(ch) || ch > "\x80" &&
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  };
  function isWordChar(ch, helper) {
    if (!helper) return isWordCharBasic(ch);
    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
    return helper.test(ch);
  }

  function isEmpty(obj) {
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
    return true;
  }

  // Extending unicode characters. A series of a non-extending char +
  // any number of extending chars is treated as a single unit as far
  // as editing and measuring is concerned. This is not fully correct,
  // since some scripts/fonts/browsers also treat other configurations
  // of code points as a group.
  var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
  function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }

  // DOM UTILITIES

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == "string") e.appendChild(document.createTextNode(content));
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  var range;
  if (document.createRange) range = function(node, start, end) {
    var r = document.createRange();
    r.setEnd(node, end);
    r.setStart(node, start);
    return r;
  };
  else range = function(node, start, end) {
    var r = document.body.createTextRange();
    r.moveToElementText(node.parentNode);
    r.collapse(true);
    r.moveEnd("character", end);
    r.moveStart("character", start);
    return r;
  };

  function removeChildren(e) {
    for (var count = e.childNodes.length; count > 0; --count)
      e.removeChild(e.firstChild);
    return e;
  }

  function removeChildrenAndAdd(parent, e) {
    return removeChildren(parent).appendChild(e);
  }

  function contains(parent, child) {
    if (parent.contains)
      return parent.contains(child);
    while (child = child.parentNode)
      if (child == parent) return true;
  }

  function activeElt() { return document.activeElement; }
  // Older versions of IE throws unspecified error when touching
  // document.activeElement in some cases (during loading, in iframe)
  if (ie_upto10) activeElt = function() {
    try { return document.activeElement; }
    catch(e) { return document.body; }
  };

  function classTest(cls) { return new RegExp("\\b" + cls + "\\b\\s*"); }
  function rmClass(node, cls) {
    var test = classTest(cls);
    if (test.test(node.className)) node.className = node.className.replace(test, "");
  }
  function addClass(node, cls) {
    if (!classTest(cls).test(node.className)) node.className += " " + cls;
  }
  function joinClasses(a, b) {
    var as = a.split(" ");
    for (var i = 0; i < as.length; i++)
      if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
    return b;
  }

  // WINDOW-WIDE EVENTS

  // These must be handled carefully, because naively registering a
  // handler for each editor will cause the editors to never be
  // garbage collected.

  function forEachCodeMirror(f) {
    if (!document.body.getElementsByClassName) return;
    var byClass = document.body.getElementsByClassName("CodeMirror");
    for (var i = 0; i < byClass.length; i++) {
      var cm = byClass[i].CodeMirror;
      if (cm) f(cm);
    }
  }

  var globalsRegistered = false;
  function ensureGlobalHandlers() {
    if (globalsRegistered) return;
    registerGlobalHandlers();
    globalsRegistered = true;
  }
  function registerGlobalHandlers() {
    // When the window resizes, we need to refresh active editors.
    var resizeTimer;
    on(window, "resize", function() {
      if (resizeTimer == null) resizeTimer = setTimeout(function() {
        resizeTimer = null;
        knownScrollbarWidth = null;
        forEachCodeMirror(onResize);
      }, 100);
    });
    // When the window loses focus, we want to show the editor as blurred
    on(window, "blur", function() {
      forEachCodeMirror(onBlur);
    });
  }

  // FEATURE DETECTION

  // Detect drag-and-drop
  var dragAndDrop = function() {
    // There is *some* kind of drag-and-drop support in IE6-8, but I
    // couldn't get it to work yet.
    if (ie_upto8) return false;
    var div = elt('div');
    return "draggable" in div || "dragDrop" in div;
  }();

  var knownScrollbarWidth;
  function scrollbarWidth(measure) {
    if (knownScrollbarWidth != null) return knownScrollbarWidth;
    var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
    removeChildrenAndAdd(measure, test);
    if (test.offsetWidth)
      knownScrollbarWidth = test.offsetHeight - test.clientHeight;
    return knownScrollbarWidth || 0;
  }

  var zwspSupported;
  function zeroWidthElement(measure) {
    if (zwspSupported == null) {
      var test = elt("span", "\u200b");
      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
      if (measure.firstChild.offsetHeight != 0)
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_upto7;
    }
    if (zwspSupported) return elt("span", "\u200b");
    else return elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
  }

  // Feature-detect IE's crummy client rect reporting for bidi text
  var badBidiRects;
  function hasBadBidiRects(measure) {
    if (badBidiRects != null) return badBidiRects;
    var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
    var r0 = range(txt, 0, 1).getBoundingClientRect();
    if (r0.left == r0.right) return false;
    var r1 = range(txt, 1, 2).getBoundingClientRect();
    return badBidiRects = (r1.right - r0.right < 3);
  }

  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLines = CodeMirror.splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
    var pos = 0, result = [], l = string.length;
    while (pos <= l) {
      var nl = string.indexOf("\n", pos);
      if (nl == -1) nl = string.length;
      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
      var rt = line.indexOf("\r");
      if (rt != -1) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function(string){return string.split(/\r\n?|\n/);};

  var hasSelection = window.getSelection ? function(te) {
    try { return te.selectionStart != te.selectionEnd; }
    catch(e) { return false; }
  } : function(te) {
    try {var range = te.ownerDocument.selection.createRange();}
    catch(e) {}
    if (!range || range.parentElement() != te) return false;
    return range.compareEndPoints("StartToEnd", range) != 0;
  };

  var hasCopyEvent = (function() {
    var e = elt("div");
    if ("oncopy" in e) return true;
    e.setAttribute("oncopy", "return;");
    return typeof e.oncopy == "function";
  })();

  // KEY NAMES

  var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                  46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 107: "=", 109: "-", 127: "Delete",
                  173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                  221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
                  63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"};
  CodeMirror.keyNames = keyNames;
  (function() {
    // Number keys
    for (var i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i);
    // Alphabetic keys
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
    // Function keys
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
  })();

  // BIDI HELPERS

  function iterateBidiSections(order, from, to, f) {
    if (!order) return f(from, to, "ltr");
    var found = false;
    for (var i = 0; i < order.length; ++i) {
      var part = order[i];
      if (part.from < to && part.to > from || from == to && part.to == from) {
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
        found = true;
      }
    }
    if (!found) f(from, to, "ltr");
  }

  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
  function lineRight(line) {
    var order = getOrder(line);
    if (!order) return line.text.length;
    return bidiRight(lst(order));
  }

  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(line);
    if (visual != line) lineN = lineNo(visual);
    var order = getOrder(visual);
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
    return Pos(lineN, ch);
  }
  function lineEnd(cm, lineN) {
    var merged, line = getLine(cm.doc, lineN);
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      lineN = null;
    }
    var order = getOrder(line);
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
    return Pos(lineN == null ? lineNo(line) : lineN, ch);
  }

  function compareBidiLevel(order, a, b) {
    var linedir = order[0].level;
    if (a == linedir) return true;
    if (b == linedir) return false;
    return a < b;
  }
  var bidiOther;
  function getBidiPartAt(order, pos) {
    bidiOther = null;
    for (var i = 0, found; i < order.length; ++i) {
      var cur = order[i];
      if (cur.from < pos && cur.to > pos) return i;
      if ((cur.from == pos || cur.to == pos)) {
        if (found == null) {
          found = i;
        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
          if (cur.from != cur.to) bidiOther = found;
          return i;
        } else {
          if (cur.from != cur.to) bidiOther = i;
          return found;
        }
      }
    }
    return found;
  }

  function moveInLine(line, pos, dir, byUnit) {
    if (!byUnit) return pos + dir;
    do pos += dir;
    while (pos > 0 && isExtendingChar(line.text.charAt(pos)));
    return pos;
  }

  // This is needed in order to move 'visually' through bi-directional
  // text -- i.e., pressing left should make the cursor go left, even
  // when in RTL text. The tricky part is the 'jumps', where RTL and
  // LTR text touch each other. This often requires the cursor offset
  // to move more than one unit, in order to visually move one unit.
  function moveVisually(line, start, dir, byUnit) {
    var bidi = getOrder(line);
    if (!bidi) return moveLogically(line, start, dir, byUnit);
    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

    for (;;) {
      if (target > part.from && target < part.to) return target;
      if (target == part.from || target == part.to) {
        if (getBidiPartAt(bidi, target) == pos) return target;
        part = bidi[pos += dir];
        return (dir > 0) == part.level % 2 ? part.to : part.from;
      } else {
        part = bidi[pos += dir];
        if (!part) return null;
        if ((dir > 0) == part.level % 2)
          target = moveInLine(line, part.to, -1, byUnit);
        else
          target = moveInLine(line, part.from, 1, byUnit);
      }
    }
  }

  function moveLogically(line, start, dir, byUnit) {
    var target = start + dir;
    if (byUnit) while (target > 0 && isExtendingChar(line.text.charAt(target))) target += dir;
    return target < 0 || target > line.text.length ? null : target;
  }

  // Bidirectional ordering algorithm
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
  // that this (partially) implements.

  // One-char codes used for character types:
  // L (L):   Left-to-Right
  // R (R):   Right-to-Left
  // r (AL):  Right-to-Left Arabic
  // 1 (EN):  European Number
  // + (ES):  European Number Separator
  // % (ET):  European Number Terminator
  // n (AN):  Arabic Number
  // , (CS):  Common Number Separator
  // m (NSM): Non-Spacing Mark
  // b (BN):  Boundary Neutral
  // s (B):   Paragraph Separator
  // t (S):   Segment Separator
  // w (WS):  Whitespace
  // N (ON):  Other Neutrals

  // Returns null if characters are ordered as they appear
  // (left-to-right), or an array of sections ({from, to, level}
  // objects) in the order in which they occur visually.
  var bidiOrdering = (function() {
    // Character types for codepoints 0 to 0xff
    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
    // Character types for codepoints 0x600 to 0x6ff
    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
    function charType(code) {
      if (code <= 0xf7) return lowTypes.charAt(code);
      else if (0x590 <= code && code <= 0x5f4) return "R";
      else if (0x600 <= code && code <= 0x6ed) return arabicTypes.charAt(code - 0x600);
      else if (0x6ee <= code && code <= 0x8ac) return "r";
      else if (0x2000 <= code && code <= 0x200b) return "w";
      else if (code == 0x200c) return "b";
      else return "L";
    }

    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
    // Browsers seem to always treat the boundaries of block elements as being L.
    var outerType = "L";

    function BidiSpan(level, from, to) {
      this.level = level;
      this.from = from; this.to = to;
    }

    return function(str) {
      if (!bidiRE.test(str)) return false;
      var len = str.length, types = [];
      for (var i = 0, type; i < len; ++i)
        types.push(type = charType(str.charCodeAt(i)));

      // W1. Examine each non-spacing mark (NSM) in the level run, and
      // change the type of the NSM to the type of the previous
      // character. If the NSM is at the start of the level run, it will
      // get the type of sor.
      for (var i = 0, prev = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "m") types[i] = prev;
        else prev = type;
      }

      // W2. Search backwards from each instance of a European number
      // until the first strong type (R, L, AL, or sor) is found. If an
      // AL is found, change the type of the European number to Arabic
      // number.
      // W3. Change all ALs to R.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "1" && cur == "r") types[i] = "n";
        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
      }

      // W4. A single European separator between two European numbers
      // changes to a European number. A single common separator between
      // two numbers of the same type changes to that type.
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
        var type = types[i];
        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
        else if (type == "," && prev == types[i+1] &&
                 (prev == "1" || prev == "n")) types[i] = prev;
        prev = type;
      }

      // W5. A sequence of European terminators adjacent to European
      // numbers changes to all European numbers.
      // W6. Otherwise, separators and terminators change to Other
      // Neutral.
      for (var i = 0; i < len; ++i) {
        var type = types[i];
        if (type == ",") types[i] = "N";
        else if (type == "%") {
          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
          var replace = (i && types[i-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // W7. Search backwards from each instance of a European number
      // until the first strong type (R, L, or sor) is found. If an L is
      // found, then change the type of the European number to L.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (cur == "L" && type == "1") types[i] = "L";
        else if (isStrong.test(type)) cur = type;
      }

      // N1. A sequence of neutrals takes the direction of the
      // surrounding strong text if the text on both sides has the same
      // direction. European and Arabic numbers act as if they were R in
      // terms of their influence on neutrals. Start-of-level-run (sor)
      // and end-of-level-run (eor) are used at level run boundaries.
      // N2. Any remaining neutrals take the embedding direction.
      for (var i = 0; i < len; ++i) {
        if (isNeutral.test(types[i])) {
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
          var before = (i ? types[i-1] : outerType) == "L";
          var after = (end < len ? types[end] : outerType) == "L";
          var replace = before || after ? "L" : "R";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // Here we depart from the documented algorithm, in order to avoid
      // building up an actual levels array. Since there are only three
      // levels (0, 1, 2) in an implementation that doesn't take
      // explicit embedding into account, we can build up the order on
      // the fly, without following the level-based algorithm.
      var order = [], m;
      for (var i = 0; i < len;) {
        if (countsAsLeft.test(types[i])) {
          var start = i;
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
          order.push(new BidiSpan(0, start, i));
        } else {
          var pos = i, at = order.length;
          for (++i; i < len && types[i] != "L"; ++i) {}
          for (var j = pos; j < i;) {
            if (countsAsNum.test(types[j])) {
              if (pos < j) order.splice(at, 0, new BidiSpan(1, pos, j));
              var nstart = j;
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
              order.splice(at, 0, new BidiSpan(2, nstart, j));
              pos = j;
            } else ++j;
          }
          if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
        }
      }
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift(new BidiSpan(0, 0, m[0].length));
      }
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push(new BidiSpan(0, len - m[0].length, len));
      }
      if (order[0].level != lst(order).level)
        order.push(new BidiSpan(order[0].level, len, len));

      return order;
    };
  })();

  // THE END

  CodeMirror.version = "4.2.0";

  return CodeMirror;
});

},{}],9:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// TODO actually recognize syntax of TypeScript constructs

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "module": kw("module"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        // types
        "string": type, "number": type, "bool": type, "any": type
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
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
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
      } else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               state.lastType == "sof" || /^[\[{}\(,;:]$/.test(state.lastType)) {
        readRegexp(stream);
        stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
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
    } else {
      stream.eatWhile(/[\w\$_]/);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
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
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
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

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (/[$\w]/.test(ch)) {
        sawSomething = true;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    if (state.context) {
      cx.marked = "def";
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "module") return cont(pushlex("form"), pushcontext, afterModule, popcontext, poplex);
    if (type == "class") return cont(pushlex("form"), className, objlit, poplex);
    if (type == "export") return cont(pushlex("form"), afterExport, poplex);
    if (type == "import") return cont(pushlex("form"), afterImport, poplex);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") { return pass(quasi, maybeop); }
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
    if (value == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
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
    if (type == "{") return pass(statement);
    return pass(expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    if (type == "{") return pass(statement);
    return pass(expressionNoComma);
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (type + " property");
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    }
    if (atomicTypes.hasOwnProperty(type)) return cont(afterprop);
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
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function typedef(type) {
    if (type == "variable"){cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "variable") { register(value); return cont(); }
    if (type == "[") return contCommasep(pattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
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
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(_type, value) {
    if (value == "extends") return cont(expression);
  }
  function objlit(type) {
    if (type == "{") return contCommasep(objprop, "}");
  }
  function afterModule(type, value) {
    if (type == "string") return cont(statement);
    if (type == "variable") { register(value); return cont(maybeFrom); }
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    return cont();
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(expressionNoComma, maybeArrayComprehension);
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension, expect("]"));
    if (type == ",") return cont(commasep(expressionNoComma, "]"));
    return pass(commasep(expressionNoComma, "]"));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricChars: ":{}",
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

},{"../../lib/codemirror":8}],10:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":11,"./handlebars/exception":12,"./handlebars/runtime":13,"./handlebars/safe-string":14,"./handlebars/utils":15}],11:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":12,"./utils":15}],12:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],13:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":11,"./exception":12,"./utils":15}],14:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],15:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":14}],16:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":10}],17:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":16}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXp1Ly5ub2RlYnJldy9ub2RlL3YwLjEwLjI4L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvY29tcG9uZW50cy9taXJyb3ItY29uc29sZS1jb21wb25lbnQuaGJzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9jb21wb25lbnRzL21pcnJvci1jb25zb2xlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvY29tcG9uZW50cy9taXJyb3ItY29uc29sZS1pbmplY3QtYnV0dG9uLmhicyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvaW5kZXguanMiLCIvVXNlcnMvYXp1L0Ryb3Bib3gvd29ya3NwYWNlL0phdmFTY3JpcHQvY29kZW1pcnJvci1jb25zb2xlLXVpL25vZGVfbW9kdWxlcy9jb2RlbWlycm9yLWNvbnNvbGUvbGliL21pcnJvci1jb25zb2xlLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvY29kZW1pcnJvci1jb25zb2xlL25vZGVfbW9kdWxlcy9jb250ZXh0LWV2YWwvaW5kZXguanMiLCIvVXNlcnMvYXp1L0Ryb3Bib3gvd29ya3NwYWNlL0phdmFTY3JpcHQvY29kZW1pcnJvci1jb25zb2xlLXVpL25vZGVfbW9kdWxlcy9jb2RlbWlycm9yLWNvbnNvbGUvbm9kZV9tb2R1bGVzL2NvbnRleHQtZXZhbC9saWIvY29udGV4dC1icm93c2VyLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvY29kZW1pcnJvci9saWIvY29kZW1pcnJvci5qcyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvbm9kZV9tb2R1bGVzL2NvZGVtaXJyb3IvbW9kZS9qYXZhc2NyaXB0L2phdmFzY3JpcHQuanMiLCIvVXNlcnMvYXp1L0Ryb3Bib3gvd29ya3NwYWNlL0phdmFTY3JpcHQvY29kZW1pcnJvci1jb25zb2xlLXVpL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9henUvRHJvcGJveC93b3Jrc3BhY2UvSmF2YVNjcmlwdC9jb2RlbWlycm9yLWNvbnNvbGUtdWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2F6dS9Ecm9wYm94L3dvcmtzcGFjZS9KYXZhU2NyaXB0L2NvZGVtaXJyb3ItY29uc29sZS11aS9ub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDajdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2cEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcIm1pcnJvci1jb25zb2xlLWNvbW1hbmRcXFwiPlxcbiAgICA8YnV0dG9uIGNsYXNzPVxcXCJtaXJyb3ItY29uc29sZS1idXR0b24gbWlycm9yLWNvbnNvbGUtcnVuXFxcIiBpZD1cXFwibWlycm9yLWNvbnNvbGUtcnVuLWJ1dHRvblxcXCI+5a6f6KGMPC9idXR0b24+XFxuICAgIDxidXR0b24gY2xhc3M9XFxcIm1pcnJvci1jb25zb2xlLWJ1dHRvbiBtaXJyb3ItY29uc29sZS1jbGVhclxcXCIgaWQ9XFxcIm1pcnJvci1jb25zb2xlLWNsZWFyLWJ1dHRvblxcXCI+44Ot44Kw44KS44Kv44Oq44KiPC9idXR0b24+XFxuICAgIDxidXR0b24gY2xhc3M9XFxcIm1pcnJvci1jb25zb2xlLWJ1dHRvbiBtaXJyb3ItY29uc29sZS1leGl0XFxcIiBpZD1cXFwibWlycm9yLWNvbnNvbGUtZXhpdC1idXR0b25cXFwiPue1guS6hjwvYnV0dG9uPlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1pcnJvci1jb25zb2xlLWxvZ1xcXCI+XFxuPC9kaXY+XCI7XG4gIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgTWlycm9yQ29uc29sZSA9IHJlcXVpcmUoXCJjb2RlbWlycm9yLWNvbnNvbGVcIik7XG5mdW5jdGlvbiBnZXRET01Gcm9tVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgcmV0dXJuIGRpdjtcbn1cbmZ1bmN0aW9uIGludGVuZE1pcnJvckNvbnNvbGUoZWxlbWVudCkge1xuICAgIHZhciBtaXJyb3IgPSBuZXcgTWlycm9yQ29uc29sZSgpO1xuICAgIHZhciBjb2RlTWlycm9yID0gbWlycm9yLmVkaXRvcjtcbiAgICBjb2RlTWlycm9yLnNldE9wdGlvbihcImxpbmVOdW1iZXJzXCIsIHRydWUpO1xuICAgIG1pcnJvci5zZXRUZXh0KGVsZW1lbnQudGV4dENvbnRlbnQpO1xuXG4gICAgdmFyIG5vZGUgPSBnZXRET01Gcm9tVGVtcGxhdGUocmVxdWlyZShcIi4vbWlycm9yLWNvbnNvbGUtY29tcG9uZW50Lmhic1wiKSgpKTtcbiAgICB2YXIgbG9nQXJlYSA9IG5vZGUucXVlcnlTZWxlY3RvcihcIi5taXJyb3ItY29uc29sZS1sb2dcIik7XG4gICAgdmFyIGNvbnNvbGVNb2NrID0ge1xuICAgICAgICBsb2c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwibWlycm9yLWNvbnNvbGUtbG9nLXJvdyBtaXJyb3ItY29uc29sZS1sb2ctbm9ybWFsXCI7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXJncy5qb2luKFwiLFwiKSkpO1xuICAgICAgICAgICAgbG9nQXJlYS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJtaXJyb3ItY29uc29sZS1sb2ctcm93IG1pcnJvci1jb25zb2xlLWxvZy1lcnJvclwiO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFyZ3Muam9pbihcIixcIikpKTtcbiAgICAgICAgICAgIGxvZ0FyZWEuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtaXJyb3Iuc3dhcFdpdGhFbGVtZW50KGVsZW1lbnQpO1xuICAgIG1pcnJvci50ZXh0YXJlYUhvbGRlci5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgIHJ1bkNvZGUoKTtcblxuICAgIGZ1bmN0aW9uIHJ1bkNvZGUoKSB7XG4gICAgICAgIG1pcnJvci5ydW5JbkNvbnRleHQoeyBjb25zb2xlOiBjb25zb2xlTW9jayB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGVNb2NrLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiI21pcnJvci1jb25zb2xlLXJ1bi1idXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIHJ1bkpTKCkge1xuICAgICAgICBydW5Db2RlKCk7XG4gICAgfSk7XG4gICAgbm9kZS5xdWVyeVNlbGVjdG9yKFwiI21pcnJvci1jb25zb2xlLWNsZWFyLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gY2xlYXJMb2coKSB7XG4gICAgICAgIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhub2RlLnF1ZXJ5U2VsZWN0b3IoXCIubWlycm9yLWNvbnNvbGUtbG9nXCIpKTtcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICB9KTtcbiAgICBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIjbWlycm9yLWNvbnNvbGUtZXhpdC1idXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIGNsZWFyTG9nKCkge1xuICAgICAgICBtaXJyb3IuZGVzdHJveSgpO1xuICAgICAgICBhdHRhY2hUb0VsZW1lbnQoZWxlbWVudCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoZWxlbWVudCkge1xuICAgIHZhciBwYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIHZhciBub2RlID0gZ2V0RE9NRnJvbVRlbXBsYXRlKHJlcXVpcmUoXCIuL21pcnJvci1jb25zb2xlLWluamVjdC1idXR0b24uaGJzXCIpKCkpO1xuICAgIG5vZGUucXVlcnlTZWxlY3RvcihcIiNtaXJyb3ItY29uc29sZS1ydW4tYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiBlZGl0QW5kUnVuKCkge1xuICAgICAgICBpbnRlbmRNaXJyb3JDb25zb2xlKGVsZW1lbnQpO1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH0pO1xuICAgIGlmIChlbGVtZW50Lm5leHRTaWJsaW5nID09PSBudWxsKSB7XG4gICAgICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBhdHRhY2hUb0VsZW1lbnQ7IiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIFxuXG5cbiAgcmV0dXJuIFwiPGJ1dHRvbiBjbGFzcz1cXFwibWlycm9yLWNvbnNvbGUtYnV0dG9uIG1pcnJvci1jb25zb2xlLXJ1blxcXCIgaWQ9XFxcIm1pcnJvci1jb25zb2xlLXJ1bi1idXR0b25cXFwiPuWun+ihjDwvYnV0dG9uPlwiO1xuICB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvbWlycm9yLWNvbnNvbGUtY29tcG9uZW50XCIpO1xudmFyIGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnRcIik7XG5jb21wb25lbnQoY29udGVudCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRXZhbENvbnRleHQgPSByZXF1aXJlKFwiY29udGV4dC1ldmFsXCIpO1xudmFyIENvZGVNaXJyb3IgPSByZXF1aXJlKFwiY29kZW1pcnJvclwiKTtcbnJlcXVpcmUoJ2NvZGVtaXJyb3IvbW9kZS9qYXZhc2NyaXB0L2phdmFzY3JpcHQnKTtcbmZ1bmN0aW9uIE1pcnJvckNvbnNvbGUoKSB7XG4gICAgdGhpcy5lZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcigpO1xufVxuTWlycm9yQ29uc29sZS5wcm90b3R5cGUuY3JlYXRlRWRpdG9yID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGV4dGFyZWFIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMudGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgdGhpcy50ZXh0YXJlYUhvbGRlci5hcHBlbmRDaGlsZCh0aGlzLnRleHRhcmVhKTtcbiAgICByZXR1cm4gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEodGhpcy50ZXh0YXJlYSk7XG59XG5NaXJyb3JDb25zb2xlLnByb3RvdHlwZS5zZXRUZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5lZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xufVxuTWlycm9yQ29uc29sZS5wcm90b3R5cGUuZ2V0VGV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRWYWx1ZSgpO1xufVxuTWlycm9yQ29uc29sZS5wcm90b3R5cGUuc3dhcFdpdGhFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB0aGlzLm9yaWdpbmFsRWxlbWVuZXQgPSBlbGVtZW50O1xuICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGhpcy50ZXh0YXJlYUhvbGRlciwgZWxlbWVudClcbiAgICB0aGlzLmVkaXRvci5yZWZyZXNoKCk7XG59XG5NaXJyb3JDb25zb2xlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5vcmlnaW5hbEVsZW1lbmV0ID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGF2ZW4ndCBgb3JpZ2luYWxFbGVtZW5ldGAgOiBZb3UgaGF2ZSB0byBjYWxsICNzd2FwV2l0aEVsZW1lbnQgYmVmb3JlIGNhbGwgdGhpc1wiKTtcbiAgICB9XG4gICAgdGhpcy50ZXh0YXJlYUhvbGRlci5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0aGlzLm9yaWdpbmFsRWxlbWVuZXQsIHRoaXMudGV4dGFyZWFIb2xkZXIpO1xuICAgIHRoaXMub3JpZ2luYWxFbGVtZW5ldCA9IG51bGw7XG4gICAgdGhpcy50ZXh0YXJlYSA9IG51bGw7XG4gICAgdGhpcy50ZXh0YXJlYUhvbGRlciA9IG51bGw7XG4gICAgdGhpcy5lZGl0b3IgPSBudWxsO1xuICAgIGlmICh0aGlzLmV2YWxDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuZXZhbENvbnRleHQuZGVzdHJveSgpO1xuICAgIH1cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpO1xufVxuTWlycm9yQ29uc29sZS5wcm90b3R5cGUucnVuSW5Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuZXZhbENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5ldmFsQ29udGV4dC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuZXZhbENvbnRleHQgPSBuZXcgRXZhbENvbnRleHQoY29udGV4dCwgdGhpcy50ZXh0YXJlYUhvbGRlcik7XG4gICAgdmFyIGpzQ29kZSA9IHRoaXMuZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgdmFyIHJlcztcbiAgICB0cnkge1xuICAgICAgICByZXMgPSB0aGlzLmV2YWxDb250ZXh0LmV2YWx1YXRlKGpzQ29kZSk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlcyk7XG4gICAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IE1pcnJvckNvbnNvbGU7IiwiaWYgKCEodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwpKSB7XG4gIC8vIFdpbGwgZG8gdGhpcyBkYW5jZSBzbyB0aGUgcmVxdWlyZSBpc24ndCBwYXJzZWQgZm9yIGJyb3dzZXJpZnkgZXRjLlxuICB2YXIgbW9kdWxlTmFtZSA9ICcuL2xpYi9jb250ZXh0LW5vZGUnO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUobW9kdWxlTmFtZSk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2NvbnRleHQtYnJvd3NlcicpO1xufVxuIiwiZnVuY3Rpb24gQ29udGV4dChzYW5kYm94LCBwYXJlbnRFbGVtZW50KSB7XG4gIHRoaXMuaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pZnJhbWUpO1xuICB2YXIgd2luID0gdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdztcbiAgc2FuZGJveCA9IHNhbmRib3ggfHwge307XG4gIE9iamVjdC5rZXlzKHNhbmRib3gpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHdpbltrZXldID0gc2FuZGJveFtrZXldO1xuICB9KTtcbn1cblxuQ29udGV4dC5wcm90b3R5cGUuZXZhbHVhdGUgPSBmdW5jdGlvbiAoY29kZSkge1xuICByZXR1cm4gdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdy5ldmFsKGNvZGUpO1xufTtcblxuQ29udGV4dC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuaWZyYW1lKSB7XG4gICAgdGhpcy5pZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmlmcmFtZSk7XG4gICAgdGhpcy5pZnJhbWUgPSBudWxsO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHQ7IiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4vLyBUaGlzIGlzIENvZGVNaXJyb3IgKGh0dHA6Ly9jb2RlbWlycm9yLm5ldCksIGEgY29kZSBlZGl0b3Jcbi8vIGltcGxlbWVudGVkIGluIEphdmFTY3JpcHQgb24gdG9wIG9mIHRoZSBicm93c2VyJ3MgRE9NLlxuLy9cbi8vIFlvdSBjYW4gZmluZCBzb21lIHRlY2huaWNhbCBiYWNrZ3JvdW5kIGZvciBzb21lIG9mIHRoZSBjb2RlIGJlbG93XG4vLyBhdCBodHRwOi8vbWFyaWpuaGF2ZXJiZWtlLm5sL2Jsb2cvI2NtLWludGVybmFscyAuXG5cbihmdW5jdGlvbihtb2QpIHtcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSA9PSBcIm9iamVjdFwiKSAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gbW9kKCk7XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIC8vIEFNRFxuICAgIHJldHVybiBkZWZpbmUoW10sIG1vZCk7XG4gIGVsc2UgLy8gUGxhaW4gYnJvd3NlciBlbnZcbiAgICB0aGlzLkNvZGVNaXJyb3IgPSBtb2QoKTtcbn0pKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBCUk9XU0VSIFNOSUZGSU5HXG5cbiAgLy8gS2x1ZGdlcyBmb3IgYnVncyBhbmQgYmVoYXZpb3IgZGlmZmVyZW5jZXMgdGhhdCBjYW4ndCBiZSBmZWF0dXJlXG4gIC8vIGRldGVjdGVkIGFyZSBlbmFibGVkIGJhc2VkIG9uIHVzZXJBZ2VudCBldGMgc25pZmZpbmcuXG5cbiAgdmFyIGdlY2tvID0gL2dlY2tvXFwvXFxkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgLy8gaWVfdXB0b04gbWVhbnMgSW50ZXJuZXQgRXhwbG9yZXIgdmVyc2lvbiBOIG9yIGxvd2VyXG4gIHZhciBpZV91cHRvMTAgPSAvTVNJRSBcXGQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciBpZV91cHRvNyA9IGllX3VwdG8xMCAmJiAoZG9jdW1lbnQuZG9jdW1lbnRNb2RlID09IG51bGwgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgOCk7XG4gIHZhciBpZV91cHRvOCA9IGllX3VwdG8xMCAmJiAoZG9jdW1lbnQuZG9jdW1lbnRNb2RlID09IG51bGwgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgOSk7XG4gIHZhciBpZV91cHRvOSA9IGllX3VwdG8xMCAmJiAoZG9jdW1lbnQuZG9jdW1lbnRNb2RlID09IG51bGwgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgMTApO1xuICB2YXIgaWVfMTF1cCA9IC9UcmlkZW50XFwvKFs3LTldfFxcZHsyLH0pXFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICB2YXIgaWUgPSBpZV91cHRvMTAgfHwgaWVfMTF1cDtcbiAgdmFyIHdlYmtpdCA9IC9XZWJLaXRcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciBxdHdlYmtpdCA9IHdlYmtpdCAmJiAvUXRcXC9cXGQrXFwuXFxkKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgdmFyIGNocm9tZSA9IC9DaHJvbWVcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciBwcmVzdG8gPSAvT3BlcmFcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciBzYWZhcmkgPSAvQXBwbGUgQ29tcHV0ZXIvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG4gIHZhciBraHRtbCA9IC9LSFRNTFxcLy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgdmFyIG1hY19nZU1vdW50YWluTGlvbiA9IC9NYWMgT1MgWCAxXFxkXFxEKFs4LTldfFxcZFxcZClcXEQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciBwaGFudG9tID0gL1BoYW50b21KUy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICB2YXIgaW9zID0gL0FwcGxlV2ViS2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIC9Nb2JpbGVcXC9cXHcrLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAvLyBUaGlzIGlzIHdvZWZ1bGx5IGluY29tcGxldGUuIFN1Z2dlc3Rpb25zIGZvciBhbHRlcm5hdGl2ZSBtZXRob2RzIHdlbGNvbWUuXG4gIHZhciBtb2JpbGUgPSBpb3MgfHwgL0FuZHJvaWR8d2ViT1N8QmxhY2tCZXJyeXxPcGVyYSBNaW5pfE9wZXJhIE1vYml8SUVNb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICB2YXIgbWFjID0gaW9zIHx8IC9NYWMvLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKTtcbiAgdmFyIHdpbmRvd3MgPSAvd2luL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pO1xuXG4gIHZhciBwcmVzdG9fdmVyc2lvbiA9IHByZXN0byAmJiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvKFxcZCpcXC5cXGQqKS8pO1xuICBpZiAocHJlc3RvX3ZlcnNpb24pIHByZXN0b192ZXJzaW9uID0gTnVtYmVyKHByZXN0b192ZXJzaW9uWzFdKTtcbiAgaWYgKHByZXN0b192ZXJzaW9uICYmIHByZXN0b192ZXJzaW9uID49IDE1KSB7IHByZXN0byA9IGZhbHNlOyB3ZWJraXQgPSB0cnVlOyB9XG4gIC8vIFNvbWUgYnJvd3NlcnMgdXNlIHRoZSB3cm9uZyBldmVudCBwcm9wZXJ0aWVzIHRvIHNpZ25hbCBjbWQvY3RybCBvbiBPUyBYXG4gIHZhciBmbGlwQ3RybENtZCA9IG1hYyAmJiAocXR3ZWJraXQgfHwgcHJlc3RvICYmIChwcmVzdG9fdmVyc2lvbiA9PSBudWxsIHx8IHByZXN0b192ZXJzaW9uIDwgMTIuMTEpKTtcbiAgdmFyIGNhcHR1cmVSaWdodENsaWNrID0gZ2Vja28gfHwgKGllICYmICFpZV91cHRvOCk7XG5cbiAgLy8gT3B0aW1pemUgc29tZSBjb2RlIHdoZW4gdGhlc2UgZmVhdHVyZXMgYXJlIG5vdCB1c2VkLlxuICB2YXIgc2F3UmVhZE9ubHlTcGFucyA9IGZhbHNlLCBzYXdDb2xsYXBzZWRTcGFucyA9IGZhbHNlO1xuXG4gIC8vIEVESVRPUiBDT05TVFJVQ1RPUlxuXG4gIC8vIEEgQ29kZU1pcnJvciBpbnN0YW5jZSByZXByZXNlbnRzIGFuIGVkaXRvci4gVGhpcyBpcyB0aGUgb2JqZWN0XG4gIC8vIHRoYXQgdXNlciBjb2RlIGlzIHVzdWFsbHkgZGVhbGluZyB3aXRoLlxuXG4gIGZ1bmN0aW9uIENvZGVNaXJyb3IocGxhY2UsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29kZU1pcnJvcikpIHJldHVybiBuZXcgQ29kZU1pcnJvcihwbGFjZSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAvLyBEZXRlcm1pbmUgZWZmZWN0aXZlIG9wdGlvbnMgYmFzZWQgb24gZ2l2ZW4gdmFsdWVzIGFuZCBkZWZhdWx0cy5cbiAgICBjb3B5T2JqKGRlZmF1bHRzLCBvcHRpb25zLCBmYWxzZSk7XG4gICAgc2V0R3V0dGVyc0ZvckxpbmVOdW1iZXJzKG9wdGlvbnMpO1xuXG4gICAgdmFyIGRvYyA9IG9wdGlvbnMudmFsdWU7XG4gICAgaWYgKHR5cGVvZiBkb2MgPT0gXCJzdHJpbmdcIikgZG9jID0gbmV3IERvYyhkb2MsIG9wdGlvbnMubW9kZSk7XG4gICAgdGhpcy5kb2MgPSBkb2M7XG5cbiAgICB2YXIgZGlzcGxheSA9IHRoaXMuZGlzcGxheSA9IG5ldyBEaXNwbGF5KHBsYWNlLCBkb2MpO1xuICAgIGRpc3BsYXkud3JhcHBlci5Db2RlTWlycm9yID0gdGhpcztcbiAgICB1cGRhdGVHdXR0ZXJzKHRoaXMpO1xuICAgIHRoZW1lQ2hhbmdlZCh0aGlzKTtcbiAgICBpZiAob3B0aW9ucy5saW5lV3JhcHBpbmcpXG4gICAgICB0aGlzLmRpc3BsYXkud3JhcHBlci5jbGFzc05hbWUgKz0gXCIgQ29kZU1pcnJvci13cmFwXCI7XG4gICAgaWYgKG9wdGlvbnMuYXV0b2ZvY3VzICYmICFtb2JpbGUpIGZvY3VzSW5wdXQodGhpcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAga2V5TWFwczogW10sICAvLyBzdG9yZXMgbWFwcyBhZGRlZCBieSBhZGRLZXlNYXBcbiAgICAgIG92ZXJsYXlzOiBbXSwgLy8gaGlnaGxpZ2h0aW5nIG92ZXJsYXlzLCBhcyBhZGRlZCBieSBhZGRPdmVybGF5XG4gICAgICBtb2RlR2VuOiAwLCAgIC8vIGJ1bXBlZCB3aGVuIG1vZGUvb3ZlcmxheSBjaGFuZ2VzLCB1c2VkIHRvIGludmFsaWRhdGUgaGlnaGxpZ2h0aW5nIGluZm9cbiAgICAgIG92ZXJ3cml0ZTogZmFsc2UsIGZvY3VzZWQ6IGZhbHNlLFxuICAgICAgc3VwcHJlc3NFZGl0czogZmFsc2UsIC8vIHVzZWQgdG8gZGlzYWJsZSBlZGl0aW5nIGR1cmluZyBrZXkgaGFuZGxlcnMgd2hlbiBpbiByZWFkT25seSBtb2RlXG4gICAgICBwYXN0ZUluY29taW5nOiBmYWxzZSwgY3V0SW5jb21pbmc6IGZhbHNlLCAvLyBoZWxwIHJlY29nbml6ZSBwYXN0ZS9jdXQgZWRpdHMgaW4gcmVhZElucHV0XG4gICAgICBkcmFnZ2luZ1RleHQ6IGZhbHNlLFxuICAgICAgaGlnaGxpZ2h0OiBuZXcgRGVsYXllZCgpIC8vIHN0b3JlcyBoaWdobGlnaHQgd29ya2VyIHRpbWVvdXRcbiAgICB9O1xuXG4gICAgLy8gT3ZlcnJpZGUgbWFnaWMgdGV4dGFyZWEgY29udGVudCByZXN0b3JlIHRoYXQgSUUgc29tZXRpbWVzIGRvZXNcbiAgICAvLyBvbiBvdXIgaGlkZGVuIHRleHRhcmVhIG9uIHJlbG9hZFxuICAgIGlmIChpZV91cHRvMTApIHNldFRpbWVvdXQoYmluZChyZXNldElucHV0LCB0aGlzLCB0cnVlKSwgMjApO1xuXG4gICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKHRoaXMpO1xuICAgIGVuc3VyZUdsb2JhbEhhbmRsZXJzKCk7XG5cbiAgICB2YXIgY20gPSB0aGlzO1xuICAgIHJ1bkluT3AodGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICBjbS5jdXJPcC5mb3JjZVVwZGF0ZSA9IHRydWU7XG4gICAgICBhdHRhY2hEb2MoY20sIGRvYyk7XG5cbiAgICAgIGlmICgob3B0aW9ucy5hdXRvZm9jdXMgJiYgIW1vYmlsZSkgfHwgYWN0aXZlRWx0KCkgPT0gZGlzcGxheS5pbnB1dClcbiAgICAgICAgc2V0VGltZW91dChiaW5kKG9uRm9jdXMsIGNtKSwgMjApO1xuICAgICAgZWxzZVxuICAgICAgICBvbkJsdXIoY20pO1xuXG4gICAgICBmb3IgKHZhciBvcHQgaW4gb3B0aW9uSGFuZGxlcnMpIGlmIChvcHRpb25IYW5kbGVycy5oYXNPd25Qcm9wZXJ0eShvcHQpKVxuICAgICAgICBvcHRpb25IYW5kbGVyc1tvcHRdKGNtLCBvcHRpb25zW29wdF0sIEluaXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0SG9va3MubGVuZ3RoOyArK2kpIGluaXRIb29rc1tpXShjbSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBESVNQTEFZIENPTlNUUlVDVE9SXG5cbiAgLy8gVGhlIGRpc3BsYXkgaGFuZGxlcyB0aGUgRE9NIGludGVncmF0aW9uLCBib3RoIGZvciBpbnB1dCByZWFkaW5nXG4gIC8vIGFuZCBjb250ZW50IGRyYXdpbmcuIEl0IGhvbGRzIHJlZmVyZW5jZXMgdG8gRE9NIG5vZGVzIGFuZFxuICAvLyBkaXNwbGF5LXJlbGF0ZWQgc3RhdGUuXG5cbiAgZnVuY3Rpb24gRGlzcGxheShwbGFjZSwgZG9jKSB7XG4gICAgdmFyIGQgPSB0aGlzO1xuXG4gICAgLy8gVGhlIHNlbWloaWRkZW4gdGV4dGFyZWEgdGhhdCBpcyBmb2N1c2VkIHdoZW4gdGhlIGVkaXRvciBpc1xuICAgIC8vIGZvY3VzZWQsIGFuZCByZWNlaXZlcyBpbnB1dC5cbiAgICB2YXIgaW5wdXQgPSBkLmlucHV0ID0gZWx0KFwidGV4dGFyZWFcIiwgbnVsbCwgbnVsbCwgXCJwb3NpdGlvbjogYWJzb2x1dGU7IHBhZGRpbmc6IDA7IHdpZHRoOiAxcHg7IGhlaWdodDogMWVtOyBvdXRsaW5lOiBub25lXCIpO1xuICAgIC8vIFRoZSB0ZXh0YXJlYSBpcyBrZXB0IHBvc2l0aW9uZWQgbmVhciB0aGUgY3Vyc29yIHRvIHByZXZlbnQgdGhlXG4gICAgLy8gZmFjdCB0aGF0IGl0J2xsIGJlIHNjcm9sbGVkIGludG8gdmlldyBvbiBpbnB1dCBmcm9tIHNjcm9sbGluZ1xuICAgIC8vIG91ciBmYWtlIGN1cnNvciBvdXQgb2Ygdmlldy4gT24gd2Via2l0LCB3aGVuIHdyYXA9b2ZmLCBwYXN0ZSBpc1xuICAgIC8vIHZlcnkgc2xvdy4gU28gbWFrZSB0aGUgYXJlYSB3aWRlIGluc3RlYWQuXG4gICAgaWYgKHdlYmtpdCkgaW5wdXQuc3R5bGUud2lkdGggPSBcIjEwMDBweFwiO1xuICAgIGVsc2UgaW5wdXQuc2V0QXR0cmlidXRlKFwid3JhcFwiLCBcIm9mZlwiKTtcbiAgICAvLyBJZiBib3JkZXI6IDA7IC0tIGlPUyBmYWlscyB0byBvcGVuIGtleWJvYXJkIChpc3N1ZSAjMTI4NylcbiAgICBpZiAoaW9zKSBpbnB1dC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBibGFja1wiO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImF1dG9jb3JyZWN0XCIsIFwib2ZmXCIpOyBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhdXRvY2FwaXRhbGl6ZVwiLCBcIm9mZlwiKTsgaW5wdXQuc2V0QXR0cmlidXRlKFwic3BlbGxjaGVja1wiLCBcImZhbHNlXCIpO1xuXG4gICAgLy8gV3JhcHMgYW5kIGhpZGVzIGlucHV0IHRleHRhcmVhXG4gICAgZC5pbnB1dERpdiA9IGVsdChcImRpdlwiLCBbaW5wdXRdLCBudWxsLCBcIm92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsgd2lkdGg6IDNweDsgaGVpZ2h0OiAwcHg7XCIpO1xuICAgIC8vIFRoZSBmYWtlIHNjcm9sbGJhciBlbGVtZW50cy5cbiAgICBkLnNjcm9sbGJhckggPSBlbHQoXCJkaXZcIiwgW2VsdChcImRpdlwiLCBudWxsLCBudWxsLCBcImhlaWdodDogMTAwJTsgbWluLWhlaWdodDogMXB4XCIpXSwgXCJDb2RlTWlycm9yLWhzY3JvbGxiYXJcIik7XG4gICAgZC5zY3JvbGxiYXJWID0gZWx0KFwiZGl2XCIsIFtlbHQoXCJkaXZcIiwgbnVsbCwgbnVsbCwgXCJtaW4td2lkdGg6IDFweFwiKV0sIFwiQ29kZU1pcnJvci12c2Nyb2xsYmFyXCIpO1xuICAgIC8vIENvdmVycyBib3R0b20tcmlnaHQgc3F1YXJlIHdoZW4gYm90aCBzY3JvbGxiYXJzIGFyZSBwcmVzZW50LlxuICAgIGQuc2Nyb2xsYmFyRmlsbGVyID0gZWx0KFwiZGl2XCIsIG51bGwsIFwiQ29kZU1pcnJvci1zY3JvbGxiYXItZmlsbGVyXCIpO1xuICAgIC8vIENvdmVycyBib3R0b20gb2YgZ3V0dGVyIHdoZW4gY292ZXJHdXR0ZXJOZXh0VG9TY3JvbGxiYXIgaXMgb25cbiAgICAvLyBhbmQgaCBzY3JvbGxiYXIgaXMgcHJlc2VudC5cbiAgICBkLmd1dHRlckZpbGxlciA9IGVsdChcImRpdlwiLCBudWxsLCBcIkNvZGVNaXJyb3ItZ3V0dGVyLWZpbGxlclwiKTtcbiAgICAvLyBXaWxsIGNvbnRhaW4gdGhlIGFjdHVhbCBjb2RlLCBwb3NpdGlvbmVkIHRvIGNvdmVyIHRoZSB2aWV3cG9ydC5cbiAgICBkLmxpbmVEaXYgPSBlbHQoXCJkaXZcIiwgbnVsbCwgXCJDb2RlTWlycm9yLWNvZGVcIik7XG4gICAgLy8gRWxlbWVudHMgYXJlIGFkZGVkIHRvIHRoZXNlIHRvIHJlcHJlc2VudCBzZWxlY3Rpb24gYW5kIGN1cnNvcnMuXG4gICAgZC5zZWxlY3Rpb25EaXYgPSBlbHQoXCJkaXZcIiwgbnVsbCwgbnVsbCwgXCJwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDFcIik7XG4gICAgZC5jdXJzb3JEaXYgPSBlbHQoXCJkaXZcIiwgbnVsbCwgXCJDb2RlTWlycm9yLWN1cnNvcnNcIik7XG4gICAgLy8gQSB2aXNpYmlsaXR5OiBoaWRkZW4gZWxlbWVudCB1c2VkIHRvIGZpbmQgdGhlIHNpemUgb2YgdGhpbmdzLlxuICAgIGQubWVhc3VyZSA9IGVsdChcImRpdlwiLCBudWxsLCBcIkNvZGVNaXJyb3ItbWVhc3VyZVwiKTtcbiAgICAvLyBXaGVuIGxpbmVzIG91dHNpZGUgb2YgdGhlIHZpZXdwb3J0IGFyZSBtZWFzdXJlZCwgdGhleSBhcmUgZHJhd24gaW4gdGhpcy5cbiAgICBkLmxpbmVNZWFzdXJlID0gZWx0KFwiZGl2XCIsIG51bGwsIFwiQ29kZU1pcnJvci1tZWFzdXJlXCIpO1xuICAgIC8vIFdyYXBzIGV2ZXJ5dGhpbmcgdGhhdCBuZWVkcyB0byBleGlzdCBpbnNpZGUgdGhlIHZlcnRpY2FsbHktcGFkZGVkIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgZC5saW5lU3BhY2UgPSBlbHQoXCJkaXZcIiwgW2QubWVhc3VyZSwgZC5saW5lTWVhc3VyZSwgZC5zZWxlY3Rpb25EaXYsIGQuY3Vyc29yRGl2LCBkLmxpbmVEaXZdLFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsIFwicG9zaXRpb246IHJlbGF0aXZlOyBvdXRsaW5lOiBub25lXCIpO1xuICAgIC8vIE1vdmVkIGFyb3VuZCBpdHMgcGFyZW50IHRvIGNvdmVyIHZpc2libGUgdmlldy5cbiAgICBkLm1vdmVyID0gZWx0KFwiZGl2XCIsIFtlbHQoXCJkaXZcIiwgW2QubGluZVNwYWNlXSwgXCJDb2RlTWlycm9yLWxpbmVzXCIpXSwgbnVsbCwgXCJwb3NpdGlvbjogcmVsYXRpdmVcIik7XG4gICAgLy8gU2V0IHRvIHRoZSBoZWlnaHQgb2YgdGhlIGRvY3VtZW50LCBhbGxvd2luZyBzY3JvbGxpbmcuXG4gICAgZC5zaXplciA9IGVsdChcImRpdlwiLCBbZC5tb3Zlcl0sIFwiQ29kZU1pcnJvci1zaXplclwiKTtcbiAgICAvLyBCZWhhdmlvciBvZiBlbHRzIHdpdGggb3ZlcmZsb3c6IGF1dG8gYW5kIHBhZGRpbmcgaXNcbiAgICAvLyBpbmNvbnNpc3RlbnQgYWNyb3NzIGJyb3dzZXJzLiBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoZVxuICAgIC8vIHNjcm9sbGFibGUgYXJlYSBpcyBiaWcgZW5vdWdoLlxuICAgIGQuaGVpZ2h0Rm9yY2VyID0gZWx0KFwiZGl2XCIsIG51bGwsIG51bGwsIFwicG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IFwiICsgc2Nyb2xsZXJDdXRPZmYgKyBcInB4OyB3aWR0aDogMXB4O1wiKTtcbiAgICAvLyBXaWxsIGNvbnRhaW4gdGhlIGd1dHRlcnMsIGlmIGFueS5cbiAgICBkLmd1dHRlcnMgPSBlbHQoXCJkaXZcIiwgbnVsbCwgXCJDb2RlTWlycm9yLWd1dHRlcnNcIik7XG4gICAgZC5saW5lR3V0dGVyID0gbnVsbDtcbiAgICAvLyBBY3R1YWwgc2Nyb2xsYWJsZSBlbGVtZW50LlxuICAgIGQuc2Nyb2xsZXIgPSBlbHQoXCJkaXZcIiwgW2Quc2l6ZXIsIGQuaGVpZ2h0Rm9yY2VyLCBkLmd1dHRlcnNdLCBcIkNvZGVNaXJyb3Itc2Nyb2xsXCIpO1xuICAgIGQuc2Nyb2xsZXIuc2V0QXR0cmlidXRlKFwidGFiSW5kZXhcIiwgXCItMVwiKTtcbiAgICAvLyBUaGUgZWxlbWVudCBpbiB3aGljaCB0aGUgZWRpdG9yIGxpdmVzLlxuICAgIGQud3JhcHBlciA9IGVsdChcImRpdlwiLCBbZC5pbnB1dERpdiwgZC5zY3JvbGxiYXJILCBkLnNjcm9sbGJhclYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5zY3JvbGxiYXJGaWxsZXIsIGQuZ3V0dGVyRmlsbGVyLCBkLnNjcm9sbGVyXSwgXCJDb2RlTWlycm9yXCIpO1xuXG4gICAgLy8gV29yayBhcm91bmQgSUU3IHotaW5kZXggYnVnIChub3QgcGVyZmVjdCwgaGVuY2UgSUU3IG5vdCByZWFsbHkgYmVpbmcgc3VwcG9ydGVkKVxuICAgIGlmIChpZV91cHRvNykgeyBkLmd1dHRlcnMuc3R5bGUuekluZGV4ID0gLTE7IGQuc2Nyb2xsZXIuc3R5bGUucGFkZGluZ1JpZ2h0ID0gMDsgfVxuICAgIC8vIE5lZWRlZCB0byBoaWRlIGJpZyBibHVlIGJsaW5raW5nIGN1cnNvciBvbiBNb2JpbGUgU2FmYXJpXG4gICAgaWYgKGlvcykgaW5wdXQuc3R5bGUud2lkdGggPSBcIjBweFwiO1xuICAgIGlmICghd2Via2l0KSBkLnNjcm9sbGVyLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgLy8gTmVlZGVkIHRvIGhhbmRsZSBUYWIga2V5IGluIEtIVE1MXG4gICAgaWYgKGtodG1sKSB7IGQuaW5wdXREaXYuc3R5bGUuaGVpZ2h0ID0gXCIxcHhcIjsgZC5pbnB1dERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjsgfVxuICAgIC8vIE5lZWQgdG8gc2V0IGEgbWluaW11bSB3aWR0aCB0byBzZWUgdGhlIHNjcm9sbGJhciBvbiBJRTcgKGJ1dCBtdXN0IG5vdCBzZXQgaXQgb24gSUU4KS5cbiAgICBpZiAoaWVfdXB0bzcpIGQuc2Nyb2xsYmFySC5zdHlsZS5taW5IZWlnaHQgPSBkLnNjcm9sbGJhclYuc3R5bGUubWluV2lkdGggPSBcIjE4cHhcIjtcblxuICAgIGlmIChwbGFjZS5hcHBlbmRDaGlsZCkgcGxhY2UuYXBwZW5kQ2hpbGQoZC53cmFwcGVyKTtcbiAgICBlbHNlIHBsYWNlKGQud3JhcHBlcik7XG5cbiAgICAvLyBDdXJyZW50IHJlbmRlcmVkIHJhbmdlIChtYXkgYmUgYmlnZ2VyIHRoYW4gdGhlIHZpZXcgd2luZG93KS5cbiAgICBkLnZpZXdGcm9tID0gZC52aWV3VG8gPSBkb2MuZmlyc3Q7XG4gICAgLy8gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlbmRlcmVkIGxpbmVzLlxuICAgIGQudmlldyA9IFtdO1xuICAgIC8vIEhvbGRzIGluZm8gYWJvdXQgYSBzaW5nbGUgcmVuZGVyZWQgbGluZSB3aGVuIGl0IHdhcyByZW5kZXJlZFxuICAgIC8vIGZvciBtZWFzdXJlbWVudCwgd2hpbGUgbm90IGluIHZpZXcuXG4gICAgZC5leHRlcm5hbE1lYXN1cmVkID0gbnVsbDtcbiAgICAvLyBFbXB0eSBzcGFjZSAoaW4gcGl4ZWxzKSBhYm92ZSB0aGUgdmlld1xuICAgIGQudmlld09mZnNldCA9IDA7XG4gICAgZC5sYXN0U2l6ZUMgPSAwO1xuICAgIGQudXBkYXRlTGluZU51bWJlcnMgPSBudWxsO1xuXG4gICAgLy8gVXNlZCB0byBvbmx5IHJlc2l6ZSB0aGUgbGluZSBudW1iZXIgZ3V0dGVyIHdoZW4gbmVjZXNzYXJ5ICh3aGVuXG4gICAgLy8gdGhlIGFtb3VudCBvZiBsaW5lcyBjcm9zc2VzIGEgYm91bmRhcnkgdGhhdCBtYWtlcyBpdHMgd2lkdGggY2hhbmdlKVxuICAgIGQubGluZU51bVdpZHRoID0gZC5saW5lTnVtSW5uZXJXaWR0aCA9IGQubGluZU51bUNoYXJzID0gbnVsbDtcbiAgICAvLyBTZWUgcmVhZElucHV0IGFuZCByZXNldElucHV0XG4gICAgZC5wcmV2SW5wdXQgPSBcIlwiO1xuICAgIC8vIFNldCB0byB0cnVlIHdoZW4gYSBub24taG9yaXpvbnRhbC1zY3JvbGxpbmcgbGluZSB3aWRnZXQgaXNcbiAgICAvLyBhZGRlZC4gQXMgYW4gb3B0aW1pemF0aW9uLCBsaW5lIHdpZGdldCBhbGlnbmluZyBpcyBza2lwcGVkIHdoZW5cbiAgICAvLyB0aGlzIGlzIGZhbHNlLlxuICAgIGQuYWxpZ25XaWRnZXRzID0gZmFsc2U7XG4gICAgLy8gRmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIHdlIGV4cGVjdCBpbnB1dCB0byBhcHBlYXIgcmVhbCBzb29uXG4gICAgLy8gbm93IChhZnRlciBzb21lIGV2ZW50IGxpa2UgJ2tleXByZXNzJyBvciAnaW5wdXQnKSBhbmQgYXJlXG4gICAgLy8gcG9sbGluZyBpbnRlbnNpdmVseS5cbiAgICBkLnBvbGxpbmdGYXN0ID0gZmFsc2U7XG4gICAgLy8gU2VsZi1yZXNldHRpbmcgdGltZW91dCBmb3IgdGhlIHBvbGxlclxuICAgIGQucG9sbCA9IG5ldyBEZWxheWVkKCk7XG5cbiAgICBkLmNhY2hlZENoYXJXaWR0aCA9IGQuY2FjaGVkVGV4dEhlaWdodCA9IGQuY2FjaGVkUGFkZGluZ0ggPSBudWxsO1xuXG4gICAgLy8gVHJhY2tzIHdoZW4gcmVzZXRJbnB1dCBoYXMgcHVudGVkIHRvIGp1c3QgcHV0dGluZyBhIHNob3J0XG4gICAgLy8gc3RyaW5nIGludG8gdGhlIHRleHRhcmVhIGluc3RlYWQgb2YgdGhlIGZ1bGwgc2VsZWN0aW9uLlxuICAgIGQuaW5hY2N1cmF0ZVNlbGVjdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gVHJhY2tzIHRoZSBtYXhpbXVtIGxpbmUgbGVuZ3RoIHNvIHRoYXQgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyXG4gICAgLy8gY2FuIGJlIGtlcHQgc3RhdGljIHdoZW4gc2Nyb2xsaW5nLlxuICAgIGQubWF4TGluZSA9IG51bGw7XG4gICAgZC5tYXhMaW5lTGVuZ3RoID0gMDtcbiAgICBkLm1heExpbmVDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAvLyBVc2VkIGZvciBtZWFzdXJpbmcgd2hlZWwgc2Nyb2xsaW5nIGdyYW51bGFyaXR5XG4gICAgZC53aGVlbERYID0gZC53aGVlbERZID0gZC53aGVlbFN0YXJ0WCA9IGQud2hlZWxTdGFydFkgPSBudWxsO1xuXG4gICAgLy8gVHJ1ZSB3aGVuIHNoaWZ0IGlzIGhlbGQgZG93bi5cbiAgICBkLnNoaWZ0ID0gZmFsc2U7XG5cbiAgICAvLyBVc2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55dGhpbmcgaGFwcGVuZWQgc2luY2UgdGhlIGNvbnRleHQgbWVudVxuICAgIC8vIHdhcyBvcGVuZWQuXG4gICAgZC5zZWxGb3JDb250ZXh0TWVudSA9IG51bGw7XG4gIH1cblxuICAvLyBTVEFURSBVUERBVEVTXG5cbiAgLy8gVXNlZCB0byBnZXQgdGhlIGVkaXRvciBpbnRvIGEgY29uc2lzdGVudCBzdGF0ZSBhZ2FpbiB3aGVuIG9wdGlvbnMgY2hhbmdlLlxuXG4gIGZ1bmN0aW9uIGxvYWRNb2RlKGNtKSB7XG4gICAgY20uZG9jLm1vZGUgPSBDb2RlTWlycm9yLmdldE1vZGUoY20ub3B0aW9ucywgY20uZG9jLm1vZGVPcHRpb24pO1xuICAgIHJlc2V0TW9kZVN0YXRlKGNtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0TW9kZVN0YXRlKGNtKSB7XG4gICAgY20uZG9jLml0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGxpbmUuc3RhdGVBZnRlcikgbGluZS5zdGF0ZUFmdGVyID0gbnVsbDtcbiAgICAgIGlmIChsaW5lLnN0eWxlcykgbGluZS5zdHlsZXMgPSBudWxsO1xuICAgIH0pO1xuICAgIGNtLmRvYy5mcm9udGllciA9IGNtLmRvYy5maXJzdDtcbiAgICBzdGFydFdvcmtlcihjbSwgMTAwKTtcbiAgICBjbS5zdGF0ZS5tb2RlR2VuKys7XG4gICAgaWYgKGNtLmN1ck9wKSByZWdDaGFuZ2UoY20pO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcHBpbmdDaGFuZ2VkKGNtKSB7XG4gICAgaWYgKGNtLm9wdGlvbnMubGluZVdyYXBwaW5nKSB7XG4gICAgICBhZGRDbGFzcyhjbS5kaXNwbGF5LndyYXBwZXIsIFwiQ29kZU1pcnJvci13cmFwXCIpO1xuICAgICAgY20uZGlzcGxheS5zaXplci5zdHlsZS5taW5XaWR0aCA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJtQ2xhc3MoY20uZGlzcGxheS53cmFwcGVyLCBcIkNvZGVNaXJyb3Itd3JhcFwiKTtcbiAgICAgIGZpbmRNYXhMaW5lKGNtKTtcbiAgICB9XG4gICAgZXN0aW1hdGVMaW5lSGVpZ2h0cyhjbSk7XG4gICAgcmVnQ2hhbmdlKGNtKTtcbiAgICBjbGVhckNhY2hlcyhjbSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe3VwZGF0ZVNjcm9sbGJhcnMoY20pO30sIDEwMCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBlc3RpbWF0ZXMgdGhlIGhlaWdodCBvZiBhIGxpbmUsIHRvIHVzZSBhc1xuICAvLyBmaXJzdCBhcHByb3hpbWF0aW9uIHVudGlsIHRoZSBsaW5lIGJlY29tZXMgdmlzaWJsZSAoYW5kIGlzIHRodXNcbiAgLy8gcHJvcGVybHkgbWVhc3VyYWJsZSkuXG4gIGZ1bmN0aW9uIGVzdGltYXRlSGVpZ2h0KGNtKSB7XG4gICAgdmFyIHRoID0gdGV4dEhlaWdodChjbS5kaXNwbGF5KSwgd3JhcHBpbmcgPSBjbS5vcHRpb25zLmxpbmVXcmFwcGluZztcbiAgICB2YXIgcGVyTGluZSA9IHdyYXBwaW5nICYmIE1hdGgubWF4KDUsIGNtLmRpc3BsYXkuc2Nyb2xsZXIuY2xpZW50V2lkdGggLyBjaGFyV2lkdGgoY20uZGlzcGxheSkgLSAzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGxpbmVJc0hpZGRlbihjbS5kb2MsIGxpbmUpKSByZXR1cm4gMDtcblxuICAgICAgdmFyIHdpZGdldHNIZWlnaHQgPSAwO1xuICAgICAgaWYgKGxpbmUud2lkZ2V0cykgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLndpZGdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGxpbmUud2lkZ2V0c1tpXS5oZWlnaHQpIHdpZGdldHNIZWlnaHQgKz0gbGluZS53aWRnZXRzW2ldLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgaWYgKHdyYXBwaW5nKVxuICAgICAgICByZXR1cm4gd2lkZ2V0c0hlaWdodCArIChNYXRoLmNlaWwobGluZS50ZXh0Lmxlbmd0aCAvIHBlckxpbmUpIHx8IDEpICogdGg7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB3aWRnZXRzSGVpZ2h0ICsgdGg7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVzdGltYXRlTGluZUhlaWdodHMoY20pIHtcbiAgICB2YXIgZG9jID0gY20uZG9jLCBlc3QgPSBlc3RpbWF0ZUhlaWdodChjbSk7XG4gICAgZG9jLml0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIGVzdEhlaWdodCA9IGVzdChsaW5lKTtcbiAgICAgIGlmIChlc3RIZWlnaHQgIT0gbGluZS5oZWlnaHQpIHVwZGF0ZUxpbmVIZWlnaHQobGluZSwgZXN0SGVpZ2h0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGtleU1hcENoYW5nZWQoY20pIHtcbiAgICB2YXIgbWFwID0ga2V5TWFwW2NtLm9wdGlvbnMua2V5TWFwXSwgc3R5bGUgPSBtYXAuc3R5bGU7XG4gICAgY20uZGlzcGxheS53cmFwcGVyLmNsYXNzTmFtZSA9IGNtLmRpc3BsYXkud3JhcHBlci5jbGFzc05hbWUucmVwbGFjZSgvXFxzKmNtLWtleW1hcC1cXFMrL2csIFwiXCIpICtcbiAgICAgIChzdHlsZSA/IFwiIGNtLWtleW1hcC1cIiArIHN0eWxlIDogXCJcIik7XG4gIH1cblxuICBmdW5jdGlvbiB0aGVtZUNoYW5nZWQoY20pIHtcbiAgICBjbS5kaXNwbGF5LndyYXBwZXIuY2xhc3NOYW1lID0gY20uZGlzcGxheS53cmFwcGVyLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMqY20tcy1cXFMrL2csIFwiXCIpICtcbiAgICAgIGNtLm9wdGlvbnMudGhlbWUucmVwbGFjZSgvKF58XFxzKVxccyovZywgXCIgY20tcy1cIik7XG4gICAgY2xlYXJDYWNoZXMoY20pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ3V0dGVyc0NoYW5nZWQoY20pIHtcbiAgICB1cGRhdGVHdXR0ZXJzKGNtKTtcbiAgICByZWdDaGFuZ2UoY20pO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXthbGlnbkhvcml6b250YWxseShjbSk7fSwgMjApO1xuICB9XG5cbiAgLy8gUmVidWlsZCB0aGUgZ3V0dGVyIGVsZW1lbnRzLCBlbnN1cmUgdGhlIG1hcmdpbiB0byB0aGUgbGVmdCBvZiB0aGVcbiAgLy8gY29kZSBtYXRjaGVzIHRoZWlyIHdpZHRoLlxuICBmdW5jdGlvbiB1cGRhdGVHdXR0ZXJzKGNtKSB7XG4gICAgdmFyIGd1dHRlcnMgPSBjbS5kaXNwbGF5Lmd1dHRlcnMsIHNwZWNzID0gY20ub3B0aW9ucy5ndXR0ZXJzO1xuICAgIHJlbW92ZUNoaWxkcmVuKGd1dHRlcnMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BlY3MubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBndXR0ZXJDbGFzcyA9IHNwZWNzW2ldO1xuICAgICAgdmFyIGdFbHQgPSBndXR0ZXJzLmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCBudWxsLCBcIkNvZGVNaXJyb3ItZ3V0dGVyIFwiICsgZ3V0dGVyQ2xhc3MpKTtcbiAgICAgIGlmIChndXR0ZXJDbGFzcyA9PSBcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIikge1xuICAgICAgICBjbS5kaXNwbGF5LmxpbmVHdXR0ZXIgPSBnRWx0O1xuICAgICAgICBnRWx0LnN0eWxlLndpZHRoID0gKGNtLmRpc3BsYXkubGluZU51bVdpZHRoIHx8IDEpICsgXCJweFwiO1xuICAgICAgfVxuICAgIH1cbiAgICBndXR0ZXJzLnN0eWxlLmRpc3BsYXkgPSBpID8gXCJcIiA6IFwibm9uZVwiO1xuICAgIHVwZGF0ZUd1dHRlclNwYWNlKGNtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUd1dHRlclNwYWNlKGNtKSB7XG4gICAgdmFyIHdpZHRoID0gY20uZGlzcGxheS5ndXR0ZXJzLm9mZnNldFdpZHRoO1xuICAgIGNtLmRpc3BsYXkuc2l6ZXIuc3R5bGUubWFyZ2luTGVmdCA9IHdpZHRoICsgXCJweFwiO1xuICAgIGNtLmRpc3BsYXkuc2Nyb2xsYmFySC5zdHlsZS5sZWZ0ID0gY20ub3B0aW9ucy5maXhlZEd1dHRlciA/IHdpZHRoICsgXCJweFwiIDogMDtcbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGNoYXJhY3RlciBsZW5ndGggb2YgYSBsaW5lLCB0YWtpbmcgaW50byBhY2NvdW50XG4gIC8vIGNvbGxhcHNlZCByYW5nZXMgKHNlZSBtYXJrVGV4dCkgdGhhdCBtaWdodCBoaWRlIHBhcnRzLCBhbmQgam9pblxuICAvLyBvdGhlciBsaW5lcyBvbnRvIGl0LlxuICBmdW5jdGlvbiBsaW5lTGVuZ3RoKGxpbmUpIHtcbiAgICBpZiAobGluZS5oZWlnaHQgPT0gMCkgcmV0dXJuIDA7XG4gICAgdmFyIGxlbiA9IGxpbmUudGV4dC5sZW5ndGgsIG1lcmdlZCwgY3VyID0gbGluZTtcbiAgICB3aGlsZSAobWVyZ2VkID0gY29sbGFwc2VkU3BhbkF0U3RhcnQoY3VyKSkge1xuICAgICAgdmFyIGZvdW5kID0gbWVyZ2VkLmZpbmQoMCwgdHJ1ZSk7XG4gICAgICBjdXIgPSBmb3VuZC5mcm9tLmxpbmU7XG4gICAgICBsZW4gKz0gZm91bmQuZnJvbS5jaCAtIGZvdW5kLnRvLmNoO1xuICAgIH1cbiAgICBjdXIgPSBsaW5lO1xuICAgIHdoaWxlIChtZXJnZWQgPSBjb2xsYXBzZWRTcGFuQXRFbmQoY3VyKSkge1xuICAgICAgdmFyIGZvdW5kID0gbWVyZ2VkLmZpbmQoMCwgdHJ1ZSk7XG4gICAgICBsZW4gLT0gY3VyLnRleHQubGVuZ3RoIC0gZm91bmQuZnJvbS5jaDtcbiAgICAgIGN1ciA9IGZvdW5kLnRvLmxpbmU7XG4gICAgICBsZW4gKz0gY3VyLnRleHQubGVuZ3RoIC0gZm91bmQudG8uY2g7XG4gICAgfVxuICAgIHJldHVybiBsZW47XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsb25nZXN0IGxpbmUgaW4gdGhlIGRvY3VtZW50LlxuICBmdW5jdGlvbiBmaW5kTWF4TGluZShjbSkge1xuICAgIHZhciBkID0gY20uZGlzcGxheSwgZG9jID0gY20uZG9jO1xuICAgIGQubWF4TGluZSA9IGdldExpbmUoZG9jLCBkb2MuZmlyc3QpO1xuICAgIGQubWF4TGluZUxlbmd0aCA9IGxpbmVMZW5ndGgoZC5tYXhMaW5lKTtcbiAgICBkLm1heExpbmVDaGFuZ2VkID0gdHJ1ZTtcbiAgICBkb2MuaXRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgbGVuID0gbGluZUxlbmd0aChsaW5lKTtcbiAgICAgIGlmIChsZW4gPiBkLm1heExpbmVMZW5ndGgpIHtcbiAgICAgICAgZC5tYXhMaW5lTGVuZ3RoID0gbGVuO1xuICAgICAgICBkLm1heExpbmUgPSBsaW5lO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHRoZSBndXR0ZXJzIG9wdGlvbnMgY29udGFpbnMgdGhlIGVsZW1lbnRcbiAgLy8gXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIgd2hlbiB0aGUgbGluZU51bWJlcnMgb3B0aW9uIGlzIHRydWUuXG4gIGZ1bmN0aW9uIHNldEd1dHRlcnNGb3JMaW5lTnVtYmVycyhvcHRpb25zKSB7XG4gICAgdmFyIGZvdW5kID0gaW5kZXhPZihvcHRpb25zLmd1dHRlcnMsIFwiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiKTtcbiAgICBpZiAoZm91bmQgPT0gLTEgJiYgb3B0aW9ucy5saW5lTnVtYmVycykge1xuICAgICAgb3B0aW9ucy5ndXR0ZXJzID0gb3B0aW9ucy5ndXR0ZXJzLmNvbmNhdChbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCJdKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kID4gLTEgJiYgIW9wdGlvbnMubGluZU51bWJlcnMpIHtcbiAgICAgIG9wdGlvbnMuZ3V0dGVycyA9IG9wdGlvbnMuZ3V0dGVycy5zbGljZSgwKTtcbiAgICAgIG9wdGlvbnMuZ3V0dGVycy5zcGxpY2UoZm91bmQsIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNDUk9MTEJBUlNcblxuICAvLyBQcmVwYXJlIERPTSByZWFkcyBuZWVkZWQgdG8gdXBkYXRlIHRoZSBzY3JvbGxiYXJzLiBEb25lIGluIG9uZVxuICAvLyBzaG90IHRvIG1pbmltaXplIHVwZGF0ZS9tZWFzdXJlIHJvdW5kdHJpcHMuXG4gIGZ1bmN0aW9uIG1lYXN1cmVGb3JTY3JvbGxiYXJzKGNtKSB7XG4gICAgdmFyIHNjcm9sbCA9IGNtLmRpc3BsYXkuc2Nyb2xsZXI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsaWVudEhlaWdodDogc2Nyb2xsLmNsaWVudEhlaWdodCxcbiAgICAgIGJhckhlaWdodDogY20uZGlzcGxheS5zY3JvbGxiYXJWLmNsaWVudEhlaWdodCxcbiAgICAgIHNjcm9sbFdpZHRoOiBzY3JvbGwuc2Nyb2xsV2lkdGgsIGNsaWVudFdpZHRoOiBzY3JvbGwuY2xpZW50V2lkdGgsXG4gICAgICBiYXJXaWR0aDogY20uZGlzcGxheS5zY3JvbGxiYXJILmNsaWVudFdpZHRoLFxuICAgICAgZG9jSGVpZ2h0OiBNYXRoLnJvdW5kKGNtLmRvYy5oZWlnaHQgKyBwYWRkaW5nVmVydChjbS5kaXNwbGF5KSlcbiAgICB9O1xuICB9XG5cbiAgLy8gUmUtc3luY2hyb25pemUgdGhlIGZha2Ugc2Nyb2xsYmFycyB3aXRoIHRoZSBhY3R1YWwgc2l6ZSBvZiB0aGVcbiAgLy8gY29udGVudC5cbiAgZnVuY3Rpb24gdXBkYXRlU2Nyb2xsYmFycyhjbSwgbWVhc3VyZSkge1xuICAgIGlmICghbWVhc3VyZSkgbWVhc3VyZSA9IG1lYXN1cmVGb3JTY3JvbGxiYXJzKGNtKTtcbiAgICB2YXIgZCA9IGNtLmRpc3BsYXk7XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IG1lYXN1cmUuZG9jSGVpZ2h0ICsgc2Nyb2xsZXJDdXRPZmY7XG4gICAgdmFyIG5lZWRzSCA9IG1lYXN1cmUuc2Nyb2xsV2lkdGggPiBtZWFzdXJlLmNsaWVudFdpZHRoO1xuICAgIHZhciBuZWVkc1YgPSBzY3JvbGxIZWlnaHQgPiBtZWFzdXJlLmNsaWVudEhlaWdodDtcbiAgICBpZiAobmVlZHNWKSB7XG4gICAgICBkLnNjcm9sbGJhclYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGQuc2Nyb2xsYmFyVi5zdHlsZS5ib3R0b20gPSBuZWVkc0ggPyBzY3JvbGxiYXJXaWR0aChkLm1lYXN1cmUpICsgXCJweFwiIDogXCIwXCI7XG4gICAgICAvLyBBIGJ1ZyBpbiBJRTggY2FuIGNhdXNlIHRoaXMgdmFsdWUgdG8gYmUgbmVnYXRpdmUsIHNvIGd1YXJkIGl0LlxuICAgICAgZC5zY3JvbGxiYXJWLmZpcnN0Q2hpbGQuc3R5bGUuaGVpZ2h0ID1cbiAgICAgICAgTWF0aC5tYXgoMCwgc2Nyb2xsSGVpZ2h0IC0gbWVhc3VyZS5jbGllbnRIZWlnaHQgKyAobWVhc3VyZS5iYXJIZWlnaHQgfHwgZC5zY3JvbGxiYXJWLmNsaWVudEhlaWdodCkpICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkLnNjcm9sbGJhclYuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICBkLnNjcm9sbGJhclYuZmlyc3RDaGlsZC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICB9XG4gICAgaWYgKG5lZWRzSCkge1xuICAgICAgZC5zY3JvbGxiYXJILnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBkLnNjcm9sbGJhckguc3R5bGUucmlnaHQgPSBuZWVkc1YgPyBzY3JvbGxiYXJXaWR0aChkLm1lYXN1cmUpICsgXCJweFwiIDogXCIwXCI7XG4gICAgICBkLnNjcm9sbGJhckguZmlyc3RDaGlsZC5zdHlsZS53aWR0aCA9XG4gICAgICAgIChtZWFzdXJlLnNjcm9sbFdpZHRoIC0gbWVhc3VyZS5jbGllbnRXaWR0aCArIChtZWFzdXJlLmJhcldpZHRoIHx8IGQuc2Nyb2xsYmFySC5jbGllbnRXaWR0aCkpICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkLnNjcm9sbGJhckguc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICBkLnNjcm9sbGJhckguZmlyc3RDaGlsZC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuICAgIH1cbiAgICBpZiAobmVlZHNIICYmIG5lZWRzVikge1xuICAgICAgZC5zY3JvbGxiYXJGaWxsZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGQuc2Nyb2xsYmFyRmlsbGVyLnN0eWxlLmhlaWdodCA9IGQuc2Nyb2xsYmFyRmlsbGVyLnN0eWxlLndpZHRoID0gc2Nyb2xsYmFyV2lkdGgoZC5tZWFzdXJlKSArIFwicHhcIjtcbiAgICB9IGVsc2UgZC5zY3JvbGxiYXJGaWxsZXIuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgaWYgKG5lZWRzSCAmJiBjbS5vcHRpb25zLmNvdmVyR3V0dGVyTmV4dFRvU2Nyb2xsYmFyICYmIGNtLm9wdGlvbnMuZml4ZWRHdXR0ZXIpIHtcbiAgICAgIGQuZ3V0dGVyRmlsbGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBkLmd1dHRlckZpbGxlci5zdHlsZS5oZWlnaHQgPSBzY3JvbGxiYXJXaWR0aChkLm1lYXN1cmUpICsgXCJweFwiO1xuICAgICAgZC5ndXR0ZXJGaWxsZXIuc3R5bGUud2lkdGggPSBkLmd1dHRlcnMub2Zmc2V0V2lkdGggKyBcInB4XCI7XG4gICAgfSBlbHNlIGQuZ3V0dGVyRmlsbGVyLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG4gICAgaWYgKCFjbS5zdGF0ZS5jaGVja2VkT3ZlcmxheVNjcm9sbGJhciAmJiBtZWFzdXJlLmNsaWVudEhlaWdodCA+IDApIHtcbiAgICAgIGlmIChzY3JvbGxiYXJXaWR0aChkLm1lYXN1cmUpID09PSAwKSB7XG4gICAgICAgIHZhciB3ID0gbWFjICYmICFtYWNfZ2VNb3VudGFpbkxpb24gPyBcIjEycHhcIiA6IFwiMThweFwiO1xuICAgICAgICBkLnNjcm9sbGJhclYuc3R5bGUubWluV2lkdGggPSBkLnNjcm9sbGJhckguc3R5bGUubWluSGVpZ2h0ID0gdztcbiAgICAgICAgdmFyIGJhck1vdXNlRG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZV90YXJnZXQoZSkgIT0gZC5zY3JvbGxiYXJWICYmIGVfdGFyZ2V0KGUpICE9IGQuc2Nyb2xsYmFySClcbiAgICAgICAgICAgIG9wZXJhdGlvbihjbSwgb25Nb3VzZURvd24pKGUpO1xuICAgICAgICB9O1xuICAgICAgICBvbihkLnNjcm9sbGJhclYsIFwibW91c2Vkb3duXCIsIGJhck1vdXNlRG93bik7XG4gICAgICAgIG9uKGQuc2Nyb2xsYmFySCwgXCJtb3VzZWRvd25cIiwgYmFyTW91c2VEb3duKTtcbiAgICAgIH1cbiAgICAgIGNtLnN0YXRlLmNoZWNrZWRPdmVybGF5U2Nyb2xsYmFyID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBDb21wdXRlIHRoZSBsaW5lcyB0aGF0IGFyZSB2aXNpYmxlIGluIGEgZ2l2ZW4gdmlld3BvcnQgKGRlZmF1bHRzXG4gIC8vIHRoZSB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24pLiB2aWV3UG9ydCBtYXkgY29udGFpbiB0b3AsXG4gIC8vIGhlaWdodCwgYW5kIGVuc3VyZSAoc2VlIG9wLnNjcm9sbFRvUG9zKSBwcm9wZXJ0aWVzLlxuICBmdW5jdGlvbiB2aXNpYmxlTGluZXMoZGlzcGxheSwgZG9jLCB2aWV3UG9ydCkge1xuICAgIHZhciB0b3AgPSB2aWV3UG9ydCAmJiB2aWV3UG9ydC50b3AgIT0gbnVsbCA/IE1hdGgubWF4KDAsIHZpZXdQb3J0LnRvcCkgOiBkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbFRvcDtcbiAgICB0b3AgPSBNYXRoLmZsb29yKHRvcCAtIHBhZGRpbmdUb3AoZGlzcGxheSkpO1xuICAgIHZhciBib3R0b20gPSB2aWV3UG9ydCAmJiB2aWV3UG9ydC5ib3R0b20gIT0gbnVsbCA/IHZpZXdQb3J0LmJvdHRvbSA6IHRvcCArIGRpc3BsYXkud3JhcHBlci5jbGllbnRIZWlnaHQ7XG5cbiAgICB2YXIgZnJvbSA9IGxpbmVBdEhlaWdodChkb2MsIHRvcCksIHRvID0gbGluZUF0SGVpZ2h0KGRvYywgYm90dG9tKTtcbiAgICAvLyBFbnN1cmUgaXMgYSB7ZnJvbToge2xpbmUsIGNofSwgdG86IHtsaW5lLCBjaH19IG9iamVjdCwgYW5kXG4gICAgLy8gZm9yY2VzIHRob3NlIGxpbmVzIGludG8gdGhlIHZpZXdwb3J0IChpZiBwb3NzaWJsZSkuXG4gICAgaWYgKHZpZXdQb3J0ICYmIHZpZXdQb3J0LmVuc3VyZSkge1xuICAgICAgdmFyIGVuc3VyZUZyb20gPSB2aWV3UG9ydC5lbnN1cmUuZnJvbS5saW5lLCBlbnN1cmVUbyA9IHZpZXdQb3J0LmVuc3VyZS50by5saW5lO1xuICAgICAgaWYgKGVuc3VyZUZyb20gPCBmcm9tKVxuICAgICAgICByZXR1cm4ge2Zyb206IGVuc3VyZUZyb20sXG4gICAgICAgICAgICAgICAgdG86IGxpbmVBdEhlaWdodChkb2MsIGhlaWdodEF0TGluZShnZXRMaW5lKGRvYywgZW5zdXJlRnJvbSkpICsgZGlzcGxheS53cmFwcGVyLmNsaWVudEhlaWdodCl9O1xuICAgICAgaWYgKE1hdGgubWluKGVuc3VyZVRvLCBkb2MubGFzdExpbmUoKSkgPj0gdG8pXG4gICAgICAgIHJldHVybiB7ZnJvbTogbGluZUF0SGVpZ2h0KGRvYywgaGVpZ2h0QXRMaW5lKGdldExpbmUoZG9jLCBlbnN1cmVUbykpIC0gZGlzcGxheS53cmFwcGVyLmNsaWVudEhlaWdodCksXG4gICAgICAgICAgICAgICAgdG86IGVuc3VyZVRvfTtcbiAgICB9XG4gICAgcmV0dXJuIHtmcm9tOiBmcm9tLCB0bzogTWF0aC5tYXgodG8sIGZyb20gKyAxKX07XG4gIH1cblxuICAvLyBMSU5FIE5VTUJFUlNcblxuICAvLyBSZS1hbGlnbiBsaW5lIG51bWJlcnMgYW5kIGd1dHRlciBtYXJrcyB0byBjb21wZW5zYXRlIGZvclxuICAvLyBob3Jpem9udGFsIHNjcm9sbGluZy5cbiAgZnVuY3Rpb24gYWxpZ25Ib3Jpem9udGFsbHkoY20pIHtcbiAgICB2YXIgZGlzcGxheSA9IGNtLmRpc3BsYXksIHZpZXcgPSBkaXNwbGF5LnZpZXc7XG4gICAgaWYgKCFkaXNwbGF5LmFsaWduV2lkZ2V0cyAmJiAoIWRpc3BsYXkuZ3V0dGVycy5maXJzdENoaWxkIHx8ICFjbS5vcHRpb25zLmZpeGVkR3V0dGVyKSkgcmV0dXJuO1xuICAgIHZhciBjb21wID0gY29tcGVuc2F0ZUZvckhTY3JvbGwoZGlzcGxheSkgLSBkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbExlZnQgKyBjbS5kb2Muc2Nyb2xsTGVmdDtcbiAgICB2YXIgZ3V0dGVyVyA9IGRpc3BsYXkuZ3V0dGVycy5vZmZzZXRXaWR0aCwgbGVmdCA9IGNvbXAgKyBcInB4XCI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSBpZiAoIXZpZXdbaV0uaGlkZGVuKSB7XG4gICAgICBpZiAoY20ub3B0aW9ucy5maXhlZEd1dHRlciAmJiB2aWV3W2ldLmd1dHRlcilcbiAgICAgICAgdmlld1tpXS5ndXR0ZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgICB2YXIgYWxpZ24gPSB2aWV3W2ldLmFsaWduYWJsZTtcbiAgICAgIGlmIChhbGlnbikgZm9yICh2YXIgaiA9IDA7IGogPCBhbGlnbi5sZW5ndGg7IGorKylcbiAgICAgICAgYWxpZ25bal0uc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgfVxuICAgIGlmIChjbS5vcHRpb25zLmZpeGVkR3V0dGVyKVxuICAgICAgZGlzcGxheS5ndXR0ZXJzLnN0eWxlLmxlZnQgPSAoY29tcCArIGd1dHRlclcpICsgXCJweFwiO1xuICB9XG5cbiAgLy8gVXNlZCB0byBlbnN1cmUgdGhhdCB0aGUgbGluZSBudW1iZXIgZ3V0dGVyIGlzIHN0aWxsIHRoZSByaWdodFxuICAvLyBzaXplIGZvciB0aGUgY3VycmVudCBkb2N1bWVudCBzaXplLiBSZXR1cm5zIHRydWUgd2hlbiBhbiB1cGRhdGVcbiAgLy8gaXMgbmVlZGVkLlxuICBmdW5jdGlvbiBtYXliZVVwZGF0ZUxpbmVOdW1iZXJXaWR0aChjbSkge1xuICAgIGlmICghY20ub3B0aW9ucy5saW5lTnVtYmVycykgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBkb2MgPSBjbS5kb2MsIGxhc3QgPSBsaW5lTnVtYmVyRm9yKGNtLm9wdGlvbnMsIGRvYy5maXJzdCArIGRvYy5zaXplIC0gMSksIGRpc3BsYXkgPSBjbS5kaXNwbGF5O1xuICAgIGlmIChsYXN0Lmxlbmd0aCAhPSBkaXNwbGF5LmxpbmVOdW1DaGFycykge1xuICAgICAgdmFyIHRlc3QgPSBkaXNwbGF5Lm1lYXN1cmUuYXBwZW5kQ2hpbGQoZWx0KFwiZGl2XCIsIFtlbHQoXCJkaXZcIiwgbGFzdCldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZU1pcnJvci1saW5lbnVtYmVyIENvZGVNaXJyb3ItZ3V0dGVyLWVsdFwiKSk7XG4gICAgICB2YXIgaW5uZXJXID0gdGVzdC5maXJzdENoaWxkLm9mZnNldFdpZHRoLCBwYWRkaW5nID0gdGVzdC5vZmZzZXRXaWR0aCAtIGlubmVyVztcbiAgICAgIGRpc3BsYXkubGluZUd1dHRlci5zdHlsZS53aWR0aCA9IFwiXCI7XG4gICAgICBkaXNwbGF5LmxpbmVOdW1Jbm5lcldpZHRoID0gTWF0aC5tYXgoaW5uZXJXLCBkaXNwbGF5LmxpbmVHdXR0ZXIub2Zmc2V0V2lkdGggLSBwYWRkaW5nKTtcbiAgICAgIGRpc3BsYXkubGluZU51bVdpZHRoID0gZGlzcGxheS5saW5lTnVtSW5uZXJXaWR0aCArIHBhZGRpbmc7XG4gICAgICBkaXNwbGF5LmxpbmVOdW1DaGFycyA9IGRpc3BsYXkubGluZU51bUlubmVyV2lkdGggPyBsYXN0Lmxlbmd0aCA6IC0xO1xuICAgICAgZGlzcGxheS5saW5lR3V0dGVyLnN0eWxlLndpZHRoID0gZGlzcGxheS5saW5lTnVtV2lkdGggKyBcInB4XCI7XG4gICAgICB1cGRhdGVHdXR0ZXJTcGFjZShjbSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbGluZU51bWJlckZvcihvcHRpb25zLCBpKSB7XG4gICAgcmV0dXJuIFN0cmluZyhvcHRpb25zLmxpbmVOdW1iZXJGb3JtYXR0ZXIoaSArIG9wdGlvbnMuZmlyc3RMaW5lTnVtYmVyKSk7XG4gIH1cblxuICAvLyBDb21wdXRlcyBkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbExlZnQgKyBkaXNwbGF5Lmd1dHRlcnMub2Zmc2V0V2lkdGgsXG4gIC8vIGJ1dCB1c2luZyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgdG8gZ2V0IGEgc3ViLXBpeGVsLWFjY3VyYXRlXG4gIC8vIHJlc3VsdC5cbiAgZnVuY3Rpb24gY29tcGVuc2F0ZUZvckhTY3JvbGwoZGlzcGxheSkge1xuICAgIHJldHVybiBkaXNwbGF5LnNjcm9sbGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBkaXNwbGF5LnNpemVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gIH1cblxuICAvLyBESVNQTEFZIERSQVdJTkdcblxuICAvLyBVcGRhdGVzIHRoZSBkaXNwbGF5LCBzZWxlY3Rpb24sIGFuZCBzY3JvbGxiYXJzLCB1c2luZyB0aGVcbiAgLy8gaW5mb3JtYXRpb24gaW4gZGlzcGxheS52aWV3IHRvIGZpbmQgb3V0IHdoaWNoIG5vZGVzIGFyZSBubyBsb25nZXJcbiAgLy8gdXAtdG8tZGF0ZS4gVHJpZXMgdG8gYmFpbCBvdXQgZWFybHkgd2hlbiBubyBjaGFuZ2VzIGFyZSBuZWVkZWQsXG4gIC8vIHVubGVzcyBmb3JjZWQgaXMgdHJ1ZS5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIGFuIGFjdHVhbCB1cGRhdGUgaGFwcGVuZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShjbSwgdmlld1BvcnQsIGZvcmNlZCkge1xuICAgIHZhciBvbGRGcm9tID0gY20uZGlzcGxheS52aWV3RnJvbSwgb2xkVG8gPSBjbS5kaXNwbGF5LnZpZXdUbywgdXBkYXRlZDtcbiAgICB2YXIgdmlzaWJsZSA9IHZpc2libGVMaW5lcyhjbS5kaXNwbGF5LCBjbS5kb2MsIHZpZXdQb3J0KTtcbiAgICBmb3IgKHZhciBmaXJzdCA9IHRydWU7OyBmaXJzdCA9IGZhbHNlKSB7XG4gICAgICB2YXIgb2xkV2lkdGggPSBjbS5kaXNwbGF5LnNjcm9sbGVyLmNsaWVudFdpZHRoO1xuICAgICAgaWYgKCF1cGRhdGVEaXNwbGF5SW5uZXIoY20sIHZpc2libGUsIGZvcmNlZCkpIGJyZWFrO1xuICAgICAgdXBkYXRlZCA9IHRydWU7XG5cbiAgICAgIC8vIElmIHRoZSBtYXggbGluZSBjaGFuZ2VkIHNpbmNlIGl0IHdhcyBsYXN0IG1lYXN1cmVkLCBtZWFzdXJlIGl0LFxuICAgICAgLy8gYW5kIGVuc3VyZSB0aGUgZG9jdW1lbnQncyB3aWR0aCBtYXRjaGVzIGl0LlxuICAgICAgaWYgKGNtLmRpc3BsYXkubWF4TGluZUNoYW5nZWQgJiYgIWNtLm9wdGlvbnMubGluZVdyYXBwaW5nKVxuICAgICAgICBhZGp1c3RDb250ZW50V2lkdGgoY20pO1xuXG4gICAgICB2YXIgYmFyTWVhc3VyZSA9IG1lYXN1cmVGb3JTY3JvbGxiYXJzKGNtKTtcbiAgICAgIHVwZGF0ZVNlbGVjdGlvbihjbSk7XG4gICAgICBzZXREb2N1bWVudEhlaWdodChjbSwgYmFyTWVhc3VyZSk7XG4gICAgICB1cGRhdGVTY3JvbGxiYXJzKGNtLCBiYXJNZWFzdXJlKTtcbiAgICAgIGlmICh3ZWJraXQgJiYgY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpXG4gICAgICAgIGNoZWNrRm9yV2Via2l0V2lkdGhCdWcoY20sIGJhck1lYXN1cmUpOyAvLyAoSXNzdWUgIzI0MjApXG4gICAgICBpZiAoZmlyc3QgJiYgY20ub3B0aW9ucy5saW5lV3JhcHBpbmcgJiYgb2xkV2lkdGggIT0gY20uZGlzcGxheS5zY3JvbGxlci5jbGllbnRXaWR0aCkge1xuICAgICAgICBmb3JjZWQgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGZvcmNlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBDbGlwIGZvcmNlZCB2aWV3cG9ydCB0byBhY3R1YWwgc2Nyb2xsYWJsZSBhcmVhLlxuICAgICAgaWYgKHZpZXdQb3J0ICYmIHZpZXdQb3J0LnRvcCAhPSBudWxsKVxuICAgICAgICB2aWV3UG9ydCA9IHt0b3A6IE1hdGgubWluKGJhck1lYXN1cmUuZG9jSGVpZ2h0IC0gc2Nyb2xsZXJDdXRPZmYgLSBiYXJNZWFzdXJlLmNsaWVudEhlaWdodCwgdmlld1BvcnQudG9wKX07XG4gICAgICAvLyBVcGRhdGVkIGxpbmUgaGVpZ2h0cyBtaWdodCByZXN1bHQgaW4gdGhlIGRyYXduIGFyZWEgbm90XG4gICAgICAvLyBhY3R1YWxseSBjb3ZlcmluZyB0aGUgdmlld3BvcnQuIEtlZXAgbG9vcGluZyB1bnRpbCBpdCBkb2VzLlxuICAgICAgdmlzaWJsZSA9IHZpc2libGVMaW5lcyhjbS5kaXNwbGF5LCBjbS5kb2MsIHZpZXdQb3J0KTtcbiAgICAgIGlmICh2aXNpYmxlLmZyb20gPj0gY20uZGlzcGxheS52aWV3RnJvbSAmJiB2aXNpYmxlLnRvIDw9IGNtLmRpc3BsYXkudmlld1RvKVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjbS5kaXNwbGF5LnVwZGF0ZUxpbmVOdW1iZXJzID0gbnVsbDtcbiAgICBpZiAodXBkYXRlZCkge1xuICAgICAgc2lnbmFsTGF0ZXIoY20sIFwidXBkYXRlXCIsIGNtKTtcbiAgICAgIGlmIChjbS5kaXNwbGF5LnZpZXdGcm9tICE9IG9sZEZyb20gfHwgY20uZGlzcGxheS52aWV3VG8gIT0gb2xkVG8pXG4gICAgICAgIHNpZ25hbExhdGVyKGNtLCBcInZpZXdwb3J0Q2hhbmdlXCIsIGNtLCBjbS5kaXNwbGF5LnZpZXdGcm9tLCBjbS5kaXNwbGF5LnZpZXdUbyk7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGVkO1xuICB9XG5cbiAgLy8gRG9lcyB0aGUgYWN0dWFsIHVwZGF0aW5nIG9mIHRoZSBsaW5lIGRpc3BsYXkuIEJhaWxzIG91dFxuICAvLyAocmV0dXJuaW5nIGZhbHNlKSB3aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gYmUgZG9uZSBhbmQgZm9yY2VkIGlzXG4gIC8vIGZhbHNlLlxuICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5SW5uZXIoY20sIHZpc2libGUsIGZvcmNlZCkge1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheSwgZG9jID0gY20uZG9jO1xuICAgIGlmICghZGlzcGxheS53cmFwcGVyLm9mZnNldFdpZHRoKSB7XG4gICAgICByZXNldFZpZXcoY20pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEJhaWwgb3V0IGlmIHRoZSB2aXNpYmxlIGFyZWEgaXMgYWxyZWFkeSByZW5kZXJlZCBhbmQgbm90aGluZyBjaGFuZ2VkLlxuICAgIGlmICghZm9yY2VkICYmIHZpc2libGUuZnJvbSA+PSBkaXNwbGF5LnZpZXdGcm9tICYmIHZpc2libGUudG8gPD0gZGlzcGxheS52aWV3VG8gJiZcbiAgICAgICAgY291bnREaXJ0eVZpZXcoY20pID09IDApXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAobWF5YmVVcGRhdGVMaW5lTnVtYmVyV2lkdGgoY20pKVxuICAgICAgcmVzZXRWaWV3KGNtKTtcbiAgICB2YXIgZGltcyA9IGdldERpbWVuc2lvbnMoY20pO1xuXG4gICAgLy8gQ29tcHV0ZSBhIHN1aXRhYmxlIG5ldyB2aWV3cG9ydCAoZnJvbSAmIHRvKVxuICAgIHZhciBlbmQgPSBkb2MuZmlyc3QgKyBkb2Muc2l6ZTtcbiAgICB2YXIgZnJvbSA9IE1hdGgubWF4KHZpc2libGUuZnJvbSAtIGNtLm9wdGlvbnMudmlld3BvcnRNYXJnaW4sIGRvYy5maXJzdCk7XG4gICAgdmFyIHRvID0gTWF0aC5taW4oZW5kLCB2aXNpYmxlLnRvICsgY20ub3B0aW9ucy52aWV3cG9ydE1hcmdpbik7XG4gICAgaWYgKGRpc3BsYXkudmlld0Zyb20gPCBmcm9tICYmIGZyb20gLSBkaXNwbGF5LnZpZXdGcm9tIDwgMjApIGZyb20gPSBNYXRoLm1heChkb2MuZmlyc3QsIGRpc3BsYXkudmlld0Zyb20pO1xuICAgIGlmIChkaXNwbGF5LnZpZXdUbyA+IHRvICYmIGRpc3BsYXkudmlld1RvIC0gdG8gPCAyMCkgdG8gPSBNYXRoLm1pbihlbmQsIGRpc3BsYXkudmlld1RvKTtcbiAgICBpZiAoc2F3Q29sbGFwc2VkU3BhbnMpIHtcbiAgICAgIGZyb20gPSB2aXN1YWxMaW5lTm8oY20uZG9jLCBmcm9tKTtcbiAgICAgIHRvID0gdmlzdWFsTGluZUVuZE5vKGNtLmRvYywgdG8pO1xuICAgIH1cblxuICAgIHZhciBkaWZmZXJlbnQgPSBmcm9tICE9IGRpc3BsYXkudmlld0Zyb20gfHwgdG8gIT0gZGlzcGxheS52aWV3VG8gfHxcbiAgICAgIGRpc3BsYXkubGFzdFNpemVDICE9IGRpc3BsYXkud3JhcHBlci5jbGllbnRIZWlnaHQ7XG4gICAgYWRqdXN0VmlldyhjbSwgZnJvbSwgdG8pO1xuXG4gICAgZGlzcGxheS52aWV3T2Zmc2V0ID0gaGVpZ2h0QXRMaW5lKGdldExpbmUoY20uZG9jLCBkaXNwbGF5LnZpZXdGcm9tKSk7XG4gICAgLy8gUG9zaXRpb24gdGhlIG1vdmVyIGRpdiB0byBhbGlnbiB3aXRoIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxuICAgIGNtLmRpc3BsYXkubW92ZXIuc3R5bGUudG9wID0gZGlzcGxheS52aWV3T2Zmc2V0ICsgXCJweFwiO1xuXG4gICAgdmFyIHRvVXBkYXRlID0gY291bnREaXJ0eVZpZXcoY20pO1xuICAgIGlmICghZGlmZmVyZW50ICYmIHRvVXBkYXRlID09IDAgJiYgIWZvcmNlZCkgcmV0dXJuO1xuXG4gICAgLy8gRm9yIGJpZyBjaGFuZ2VzLCB3ZSBoaWRlIHRoZSBlbmNsb3NpbmcgZWxlbWVudCBkdXJpbmcgdGhlXG4gICAgLy8gdXBkYXRlLCBzaW5jZSB0aGF0IHNwZWVkcyB1cCB0aGUgb3BlcmF0aW9ucyBvbiBtb3N0IGJyb3dzZXJzLlxuICAgIHZhciBmb2N1c2VkID0gYWN0aXZlRWx0KCk7XG4gICAgaWYgKHRvVXBkYXRlID4gNCkgZGlzcGxheS5saW5lRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBwYXRjaERpc3BsYXkoY20sIGRpc3BsYXkudXBkYXRlTGluZU51bWJlcnMsIGRpbXMpO1xuICAgIGlmICh0b1VwZGF0ZSA+IDQpIGRpc3BsYXkubGluZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAvLyBUaGVyZSBtaWdodCBoYXZlIGJlZW4gYSB3aWRnZXQgd2l0aCBhIGZvY3VzZWQgZWxlbWVudCB0aGF0IGdvdFxuICAgIC8vIGhpZGRlbiBvciB1cGRhdGVkLCBpZiBzbyByZS1mb2N1cyBpdC5cbiAgICBpZiAoZm9jdXNlZCAmJiBhY3RpdmVFbHQoKSAhPSBmb2N1c2VkICYmIGZvY3VzZWQub2Zmc2V0SGVpZ2h0KSBmb2N1c2VkLmZvY3VzKCk7XG5cbiAgICAvLyBQcmV2ZW50IHNlbGVjdGlvbiBhbmQgY3Vyc29ycyBmcm9tIGludGVyZmVyaW5nIHdpdGggdGhlIHNjcm9sbFxuICAgIC8vIHdpZHRoLlxuICAgIHJlbW92ZUNoaWxkcmVuKGRpc3BsYXkuY3Vyc29yRGl2KTtcbiAgICByZW1vdmVDaGlsZHJlbihkaXNwbGF5LnNlbGVjdGlvbkRpdik7XG5cbiAgICBpZiAoZGlmZmVyZW50KSB7XG4gICAgICBkaXNwbGF5Lmxhc3RTaXplQyA9IGRpc3BsYXkud3JhcHBlci5jbGllbnRIZWlnaHQ7XG4gICAgICBzdGFydFdvcmtlcihjbSwgNDAwKTtcbiAgICB9XG5cbiAgICB1cGRhdGVIZWlnaHRzSW5WaWV3cG9ydChjbSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkanVzdENvbnRlbnRXaWR0aChjbSkge1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheTtcbiAgICB2YXIgd2lkdGggPSBtZWFzdXJlQ2hhcihjbSwgZGlzcGxheS5tYXhMaW5lLCBkaXNwbGF5Lm1heExpbmUudGV4dC5sZW5ndGgpLmxlZnQ7XG4gICAgZGlzcGxheS5tYXhMaW5lQ2hhbmdlZCA9IGZhbHNlO1xuICAgIHZhciBtaW5XaWR0aCA9IE1hdGgubWF4KDAsIHdpZHRoICsgMyk7XG4gICAgdmFyIG1heFNjcm9sbExlZnQgPSBNYXRoLm1heCgwLCBkaXNwbGF5LnNpemVyLm9mZnNldExlZnQgKyBtaW5XaWR0aCArIHNjcm9sbGVyQ3V0T2ZmIC0gZGlzcGxheS5zY3JvbGxlci5jbGllbnRXaWR0aCk7XG4gICAgZGlzcGxheS5zaXplci5zdHlsZS5taW5XaWR0aCA9IG1pbldpZHRoICsgXCJweFwiO1xuICAgIGlmIChtYXhTY3JvbGxMZWZ0IDwgY20uZG9jLnNjcm9sbExlZnQpXG4gICAgICBzZXRTY3JvbGxMZWZ0KGNtLCBNYXRoLm1pbihkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbExlZnQsIG1heFNjcm9sbExlZnQpLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERvY3VtZW50SGVpZ2h0KGNtLCBtZWFzdXJlKSB7XG4gICAgY20uZGlzcGxheS5zaXplci5zdHlsZS5taW5IZWlnaHQgPSBjbS5kaXNwbGF5LmhlaWdodEZvcmNlci5zdHlsZS50b3AgPSBtZWFzdXJlLmRvY0hlaWdodCArIFwicHhcIjtcbiAgICBjbS5kaXNwbGF5Lmd1dHRlcnMuc3R5bGUuaGVpZ2h0ID0gTWF0aC5tYXgobWVhc3VyZS5kb2NIZWlnaHQsIG1lYXN1cmUuY2xpZW50SGVpZ2h0IC0gc2Nyb2xsZXJDdXRPZmYpICsgXCJweFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JXZWJraXRXaWR0aEJ1ZyhjbSwgbWVhc3VyZSkge1xuICAgIC8vIFdvcmsgYXJvdW5kIFdlYmtpdCBidWcgd2hlcmUgaXQgc29tZXRpbWVzIHJlc2VydmVzIHNwYWNlIGZvciBhXG4gICAgLy8gbm9uLWV4aXN0aW5nIHBoYW50b20gc2Nyb2xsYmFyIGluIHRoZSBzY3JvbGxlciAoSXNzdWUgIzI0MjApXG4gICAgaWYgKGNtLmRpc3BsYXkuc2l6ZXIub2Zmc2V0V2lkdGggKyBjbS5kaXNwbGF5Lmd1dHRlcnMub2Zmc2V0V2lkdGggPCBjbS5kaXNwbGF5LnNjcm9sbGVyLmNsaWVudFdpZHRoIC0gMSkge1xuICAgICAgY20uZGlzcGxheS5zaXplci5zdHlsZS5taW5IZWlnaHQgPSBjbS5kaXNwbGF5LmhlaWdodEZvcmNlci5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgY20uZGlzcGxheS5ndXR0ZXJzLnN0eWxlLmhlaWdodCA9IG1lYXN1cmUuZG9jSGVpZ2h0ICsgXCJweFwiO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlYWQgdGhlIGFjdHVhbCBoZWlnaHRzIG9mIHRoZSByZW5kZXJlZCBsaW5lcywgYW5kIHVwZGF0ZSB0aGVpclxuICAvLyBzdG9yZWQgaGVpZ2h0cyB0byBtYXRjaC5cbiAgZnVuY3Rpb24gdXBkYXRlSGVpZ2h0c0luVmlld3BvcnQoY20pIHtcbiAgICB2YXIgZGlzcGxheSA9IGNtLmRpc3BsYXk7XG4gICAgdmFyIHByZXZCb3R0b20gPSBkaXNwbGF5LmxpbmVEaXYub2Zmc2V0VG9wO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcGxheS52aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY3VyID0gZGlzcGxheS52aWV3W2ldLCBoZWlnaHQ7XG4gICAgICBpZiAoY3VyLmhpZGRlbikgY29udGludWU7XG4gICAgICBpZiAoaWVfdXB0bzcpIHtcbiAgICAgICAgdmFyIGJvdCA9IGN1ci5ub2RlLm9mZnNldFRvcCArIGN1ci5ub2RlLm9mZnNldEhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gYm90IC0gcHJldkJvdHRvbTtcbiAgICAgICAgcHJldkJvdHRvbSA9IGJvdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBib3ggPSBjdXIubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaGVpZ2h0ID0gYm94LmJvdHRvbSAtIGJveC50b3A7XG4gICAgICB9XG4gICAgICB2YXIgZGlmZiA9IGN1ci5saW5lLmhlaWdodCAtIGhlaWdodDtcbiAgICAgIGlmIChoZWlnaHQgPCAyKSBoZWlnaHQgPSB0ZXh0SGVpZ2h0KGRpc3BsYXkpO1xuICAgICAgaWYgKGRpZmYgPiAuMDAxIHx8IGRpZmYgPCAtLjAwMSkge1xuICAgICAgICB1cGRhdGVMaW5lSGVpZ2h0KGN1ci5saW5lLCBoZWlnaHQpO1xuICAgICAgICB1cGRhdGVXaWRnZXRIZWlnaHQoY3VyLmxpbmUpO1xuICAgICAgICBpZiAoY3VyLnJlc3QpIGZvciAodmFyIGogPSAwOyBqIDwgY3VyLnJlc3QubGVuZ3RoOyBqKyspXG4gICAgICAgICAgdXBkYXRlV2lkZ2V0SGVpZ2h0KGN1ci5yZXN0W2pdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZWFkIGFuZCBzdG9yZSB0aGUgaGVpZ2h0IG9mIGxpbmUgd2lkZ2V0cyBhc3NvY2lhdGVkIHdpdGggdGhlXG4gIC8vIGdpdmVuIGxpbmUuXG4gIGZ1bmN0aW9uIHVwZGF0ZVdpZGdldEhlaWdodChsaW5lKSB7XG4gICAgaWYgKGxpbmUud2lkZ2V0cykgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLndpZGdldHMubGVuZ3RoOyArK2kpXG4gICAgICBsaW5lLndpZGdldHNbaV0uaGVpZ2h0ID0gbGluZS53aWRnZXRzW2ldLm5vZGUub2Zmc2V0SGVpZ2h0O1xuICB9XG5cbiAgLy8gRG8gYSBidWxrLXJlYWQgb2YgdGhlIERPTSBwb3NpdGlvbnMgYW5kIHNpemVzIG5lZWRlZCB0byBkcmF3IHRoZVxuICAvLyB2aWV3LCBzbyB0aGF0IHdlIGRvbid0IGludGVybGVhdmUgcmVhZGluZyBhbmQgd3JpdGluZyB0byB0aGUgRE9NLlxuICBmdW5jdGlvbiBnZXREaW1lbnNpb25zKGNtKSB7XG4gICAgdmFyIGQgPSBjbS5kaXNwbGF5LCBsZWZ0ID0ge30sIHdpZHRoID0ge307XG4gICAgZm9yICh2YXIgbiA9IGQuZ3V0dGVycy5maXJzdENoaWxkLCBpID0gMDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcsICsraSkge1xuICAgICAgbGVmdFtjbS5vcHRpb25zLmd1dHRlcnNbaV1dID0gbi5vZmZzZXRMZWZ0O1xuICAgICAgd2lkdGhbY20ub3B0aW9ucy5ndXR0ZXJzW2ldXSA9IG4ub2Zmc2V0V2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB7Zml4ZWRQb3M6IGNvbXBlbnNhdGVGb3JIU2Nyb2xsKGQpLFxuICAgICAgICAgICAgZ3V0dGVyVG90YWxXaWR0aDogZC5ndXR0ZXJzLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgZ3V0dGVyTGVmdDogbGVmdCxcbiAgICAgICAgICAgIGd1dHRlcldpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgIHdyYXBwZXJXaWR0aDogZC53cmFwcGVyLmNsaWVudFdpZHRofTtcbiAgfVxuXG4gIC8vIFN5bmMgdGhlIGFjdHVhbCBkaXNwbGF5IERPTSBzdHJ1Y3R1cmUgd2l0aCBkaXNwbGF5LnZpZXcsIHJlbW92aW5nXG4gIC8vIG5vZGVzIGZvciBsaW5lcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdmlldywgYW5kIGNyZWF0aW5nIHRoZSBvbmVzXG4gIC8vIHRoYXQgYXJlIG5vdCB0aGVyZSB5ZXQsIGFuZCB1cGRhdGluZyB0aGUgb25lcyB0aGF0IGFyZSBvdXQgb2ZcbiAgLy8gZGF0ZS5cbiAgZnVuY3Rpb24gcGF0Y2hEaXNwbGF5KGNtLCB1cGRhdGVOdW1iZXJzRnJvbSwgZGltcykge1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheSwgbGluZU51bWJlcnMgPSBjbS5vcHRpb25zLmxpbmVOdW1iZXJzO1xuICAgIHZhciBjb250YWluZXIgPSBkaXNwbGF5LmxpbmVEaXYsIGN1ciA9IGNvbnRhaW5lci5maXJzdENoaWxkO1xuXG4gICAgZnVuY3Rpb24gcm0obm9kZSkge1xuICAgICAgdmFyIG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgLy8gV29ya3MgYXJvdW5kIGEgdGhyb3ctc2Nyb2xsIGJ1ZyBpbiBPUyBYIFdlYmtpdFxuICAgICAgaWYgKHdlYmtpdCAmJiBtYWMgJiYgY20uZGlzcGxheS5jdXJyZW50V2hlZWxUYXJnZXQgPT0gbm9kZSlcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBlbHNlXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cblxuICAgIHZhciB2aWV3ID0gZGlzcGxheS52aWV3LCBsaW5lTiA9IGRpc3BsYXkudmlld0Zyb207XG4gICAgLy8gTG9vcCBvdmVyIHRoZSBlbGVtZW50cyBpbiB0aGUgdmlldywgc3luY2luZyBjdXIgKHRoZSBET00gbm9kZXNcbiAgICAvLyBpbiBkaXNwbGF5LmxpbmVEaXYpIHdpdGggdGhlIHZpZXcgYXMgd2UgZ28uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbGluZVZpZXcgPSB2aWV3W2ldO1xuICAgICAgaWYgKGxpbmVWaWV3LmhpZGRlbikge1xuICAgICAgfSBlbHNlIGlmICghbGluZVZpZXcubm9kZSkgeyAvLyBOb3QgZHJhd24geWV0XG4gICAgICAgIHZhciBub2RlID0gYnVpbGRMaW5lRWxlbWVudChjbSwgbGluZVZpZXcsIGxpbmVOLCBkaW1zKTtcbiAgICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShub2RlLCBjdXIpO1xuICAgICAgfSBlbHNlIHsgLy8gQWxyZWFkeSBkcmF3blxuICAgICAgICB3aGlsZSAoY3VyICE9IGxpbmVWaWV3Lm5vZGUpIGN1ciA9IHJtKGN1cik7XG4gICAgICAgIHZhciB1cGRhdGVOdW1iZXIgPSBsaW5lTnVtYmVycyAmJiB1cGRhdGVOdW1iZXJzRnJvbSAhPSBudWxsICYmXG4gICAgICAgICAgdXBkYXRlTnVtYmVyc0Zyb20gPD0gbGluZU4gJiYgbGluZVZpZXcubGluZU51bWJlcjtcbiAgICAgICAgaWYgKGxpbmVWaWV3LmNoYW5nZXMpIHtcbiAgICAgICAgICBpZiAoaW5kZXhPZihsaW5lVmlldy5jaGFuZ2VzLCBcImd1dHRlclwiKSA+IC0xKSB1cGRhdGVOdW1iZXIgPSBmYWxzZTtcbiAgICAgICAgICB1cGRhdGVMaW5lRm9yQ2hhbmdlcyhjbSwgbGluZVZpZXcsIGxpbmVOLCBkaW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlTnVtYmVyKSB7XG4gICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obGluZVZpZXcubGluZU51bWJlcik7XG4gICAgICAgICAgbGluZVZpZXcubGluZU51bWJlci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsaW5lTnVtYmVyRm9yKGNtLm9wdGlvbnMsIGxpbmVOKSkpO1xuICAgICAgICB9XG4gICAgICAgIGN1ciA9IGxpbmVWaWV3Lm5vZGUubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgICBsaW5lTiArPSBsaW5lVmlldy5zaXplO1xuICAgIH1cbiAgICB3aGlsZSAoY3VyKSBjdXIgPSBybShjdXIpO1xuICB9XG5cbiAgLy8gV2hlbiBhbiBhc3BlY3Qgb2YgYSBsaW5lIGNoYW5nZXMsIGEgc3RyaW5nIGlzIGFkZGVkIHRvXG4gIC8vIGxpbmVWaWV3LmNoYW5nZXMuIFRoaXMgdXBkYXRlcyB0aGUgcmVsZXZhbnQgcGFydCBvZiB0aGUgbGluZSdzXG4gIC8vIERPTSBzdHJ1Y3R1cmUuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpbmVGb3JDaGFuZ2VzKGNtLCBsaW5lVmlldywgbGluZU4sIGRpbXMpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxpbmVWaWV3LmNoYW5nZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciB0eXBlID0gbGluZVZpZXcuY2hhbmdlc1tqXTtcbiAgICAgIGlmICh0eXBlID09IFwidGV4dFwiKSB1cGRhdGVMaW5lVGV4dChjbSwgbGluZVZpZXcpO1xuICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImd1dHRlclwiKSB1cGRhdGVMaW5lR3V0dGVyKGNtLCBsaW5lVmlldywgbGluZU4sIGRpbXMpO1xuICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNsYXNzXCIpIHVwZGF0ZUxpbmVDbGFzc2VzKGxpbmVWaWV3KTtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJ3aWRnZXRcIikgdXBkYXRlTGluZVdpZGdldHMobGluZVZpZXcsIGRpbXMpO1xuICAgIH1cbiAgICBsaW5lVmlldy5jaGFuZ2VzID0gbnVsbDtcbiAgfVxuXG4gIC8vIExpbmVzIHdpdGggZ3V0dGVyIGVsZW1lbnRzLCB3aWRnZXRzIG9yIGEgYmFja2dyb3VuZCBjbGFzcyBuZWVkIHRvXG4gIC8vIGJlIHdyYXBwZWQsIGFuZCBoYXZlIHRoZSBleHRyYSBlbGVtZW50cyBhZGRlZCB0byB0aGUgd3JhcHBlciBkaXZcbiAgZnVuY3Rpb24gZW5zdXJlTGluZVdyYXBwZWQobGluZVZpZXcpIHtcbiAgICBpZiAobGluZVZpZXcubm9kZSA9PSBsaW5lVmlldy50ZXh0KSB7XG4gICAgICBsaW5lVmlldy5ub2RlID0gZWx0KFwiZGl2XCIsIG51bGwsIG51bGwsIFwicG9zaXRpb246IHJlbGF0aXZlXCIpO1xuICAgICAgaWYgKGxpbmVWaWV3LnRleHQucGFyZW50Tm9kZSlcbiAgICAgICAgbGluZVZpZXcudGV4dC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChsaW5lVmlldy5ub2RlLCBsaW5lVmlldy50ZXh0KTtcbiAgICAgIGxpbmVWaWV3Lm5vZGUuYXBwZW5kQ2hpbGQobGluZVZpZXcudGV4dCk7XG4gICAgICBpZiAoaWVfdXB0bzcpIGxpbmVWaWV3Lm5vZGUuc3R5bGUuekluZGV4ID0gMjtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVWaWV3Lm5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaW5lQmFja2dyb3VuZChsaW5lVmlldykge1xuICAgIHZhciBjbHMgPSBsaW5lVmlldy5iZ0NsYXNzID8gbGluZVZpZXcuYmdDbGFzcyArIFwiIFwiICsgKGxpbmVWaWV3LmxpbmUuYmdDbGFzcyB8fCBcIlwiKSA6IGxpbmVWaWV3LmxpbmUuYmdDbGFzcztcbiAgICBpZiAoY2xzKSBjbHMgKz0gXCIgQ29kZU1pcnJvci1saW5lYmFja2dyb3VuZFwiO1xuICAgIGlmIChsaW5lVmlldy5iYWNrZ3JvdW5kKSB7XG4gICAgICBpZiAoY2xzKSBsaW5lVmlldy5iYWNrZ3JvdW5kLmNsYXNzTmFtZSA9IGNscztcbiAgICAgIGVsc2UgeyBsaW5lVmlldy5iYWNrZ3JvdW5kLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobGluZVZpZXcuYmFja2dyb3VuZCk7IGxpbmVWaWV3LmJhY2tncm91bmQgPSBudWxsOyB9XG4gICAgfSBlbHNlIGlmIChjbHMpIHtcbiAgICAgIHZhciB3cmFwID0gZW5zdXJlTGluZVdyYXBwZWQobGluZVZpZXcpO1xuICAgICAgbGluZVZpZXcuYmFja2dyb3VuZCA9IHdyYXAuaW5zZXJ0QmVmb3JlKGVsdChcImRpdlwiLCBudWxsLCBjbHMpLCB3cmFwLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdyYXBwZXIgYXJvdW5kIGJ1aWxkTGluZUNvbnRlbnQgd2hpY2ggd2lsbCByZXVzZSB0aGUgc3RydWN0dXJlXG4gIC8vIGluIGRpc3BsYXkuZXh0ZXJuYWxNZWFzdXJlZCB3aGVuIHBvc3NpYmxlLlxuICBmdW5jdGlvbiBnZXRMaW5lQ29udGVudChjbSwgbGluZVZpZXcpIHtcbiAgICB2YXIgZXh0ID0gY20uZGlzcGxheS5leHRlcm5hbE1lYXN1cmVkO1xuICAgIGlmIChleHQgJiYgZXh0LmxpbmUgPT0gbGluZVZpZXcubGluZSkge1xuICAgICAgY20uZGlzcGxheS5leHRlcm5hbE1lYXN1cmVkID0gbnVsbDtcbiAgICAgIGxpbmVWaWV3Lm1lYXN1cmUgPSBleHQubWVhc3VyZTtcbiAgICAgIHJldHVybiBleHQuYnVpbHQ7XG4gICAgfVxuICAgIHJldHVybiBidWlsZExpbmVDb250ZW50KGNtLCBsaW5lVmlldyk7XG4gIH1cblxuICAvLyBSZWRyYXcgdGhlIGxpbmUncyB0ZXh0LiBJbnRlcmFjdHMgd2l0aCB0aGUgYmFja2dyb3VuZCBhbmQgdGV4dFxuICAvLyBjbGFzc2VzIGJlY2F1c2UgdGhlIG1vZGUgbWF5IG91dHB1dCB0b2tlbnMgdGhhdCBpbmZsdWVuY2UgdGhlc2VcbiAgLy8gY2xhc3Nlcy5cbiAgZnVuY3Rpb24gdXBkYXRlTGluZVRleHQoY20sIGxpbmVWaWV3KSB7XG4gICAgdmFyIGNscyA9IGxpbmVWaWV3LnRleHQuY2xhc3NOYW1lO1xuICAgIHZhciBidWlsdCA9IGdldExpbmVDb250ZW50KGNtLCBsaW5lVmlldyk7XG4gICAgaWYgKGxpbmVWaWV3LnRleHQgPT0gbGluZVZpZXcubm9kZSkgbGluZVZpZXcubm9kZSA9IGJ1aWx0LnByZTtcbiAgICBsaW5lVmlldy50ZXh0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGJ1aWx0LnByZSwgbGluZVZpZXcudGV4dCk7XG4gICAgbGluZVZpZXcudGV4dCA9IGJ1aWx0LnByZTtcbiAgICBpZiAoYnVpbHQuYmdDbGFzcyAhPSBsaW5lVmlldy5iZ0NsYXNzIHx8IGJ1aWx0LnRleHRDbGFzcyAhPSBsaW5lVmlldy50ZXh0Q2xhc3MpIHtcbiAgICAgIGxpbmVWaWV3LmJnQ2xhc3MgPSBidWlsdC5iZ0NsYXNzO1xuICAgICAgbGluZVZpZXcudGV4dENsYXNzID0gYnVpbHQudGV4dENsYXNzO1xuICAgICAgdXBkYXRlTGluZUNsYXNzZXMobGluZVZpZXcpO1xuICAgIH0gZWxzZSBpZiAoY2xzKSB7XG4gICAgICBsaW5lVmlldy50ZXh0LmNsYXNzTmFtZSA9IGNscztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaW5lQ2xhc3NlcyhsaW5lVmlldykge1xuICAgIHVwZGF0ZUxpbmVCYWNrZ3JvdW5kKGxpbmVWaWV3KTtcbiAgICBpZiAobGluZVZpZXcubGluZS53cmFwQ2xhc3MpXG4gICAgICBlbnN1cmVMaW5lV3JhcHBlZChsaW5lVmlldykuY2xhc3NOYW1lID0gbGluZVZpZXcubGluZS53cmFwQ2xhc3M7XG4gICAgZWxzZSBpZiAobGluZVZpZXcubm9kZSAhPSBsaW5lVmlldy50ZXh0KVxuICAgICAgbGluZVZpZXcubm9kZS5jbGFzc05hbWUgPSBcIlwiO1xuICAgIHZhciB0ZXh0Q2xhc3MgPSBsaW5lVmlldy50ZXh0Q2xhc3MgPyBsaW5lVmlldy50ZXh0Q2xhc3MgKyBcIiBcIiArIChsaW5lVmlldy5saW5lLnRleHRDbGFzcyB8fCBcIlwiKSA6IGxpbmVWaWV3LmxpbmUudGV4dENsYXNzO1xuICAgIGxpbmVWaWV3LnRleHQuY2xhc3NOYW1lID0gdGV4dENsYXNzIHx8IFwiXCI7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaW5lR3V0dGVyKGNtLCBsaW5lVmlldywgbGluZU4sIGRpbXMpIHtcbiAgICBpZiAobGluZVZpZXcuZ3V0dGVyKSB7XG4gICAgICBsaW5lVmlldy5ub2RlLnJlbW92ZUNoaWxkKGxpbmVWaWV3Lmd1dHRlcik7XG4gICAgICBsaW5lVmlldy5ndXR0ZXIgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgbWFya2VycyA9IGxpbmVWaWV3LmxpbmUuZ3V0dGVyTWFya2VycztcbiAgICBpZiAoY20ub3B0aW9ucy5saW5lTnVtYmVycyB8fCBtYXJrZXJzKSB7XG4gICAgICB2YXIgd3JhcCA9IGVuc3VyZUxpbmVXcmFwcGVkKGxpbmVWaWV3KTtcbiAgICAgIHZhciBndXR0ZXJXcmFwID0gbGluZVZpZXcuZ3V0dGVyID1cbiAgICAgICAgd3JhcC5pbnNlcnRCZWZvcmUoZWx0KFwiZGl2XCIsIG51bGwsIFwiQ29kZU1pcnJvci1ndXR0ZXItd3JhcHBlclwiLCBcInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNtLm9wdGlvbnMuZml4ZWRHdXR0ZXIgPyBkaW1zLmZpeGVkUG9zIDogLWRpbXMuZ3V0dGVyVG90YWxXaWR0aCkgKyBcInB4XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lVmlldy50ZXh0KTtcbiAgICAgIGlmIChjbS5vcHRpb25zLmxpbmVOdW1iZXJzICYmICghbWFya2VycyB8fCAhbWFya2Vyc1tcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIl0pKVxuICAgICAgICBsaW5lVmlldy5saW5lTnVtYmVyID0gZ3V0dGVyV3JhcC5hcHBlbmRDaGlsZChcbiAgICAgICAgICBlbHQoXCJkaXZcIiwgbGluZU51bWJlckZvcihjbS5vcHRpb25zLCBsaW5lTiksXG4gICAgICAgICAgICAgIFwiQ29kZU1pcnJvci1saW5lbnVtYmVyIENvZGVNaXJyb3ItZ3V0dGVyLWVsdFwiLFxuICAgICAgICAgICAgICBcImxlZnQ6IFwiICsgZGltcy5ndXR0ZXJMZWZ0W1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiXSArIFwicHg7IHdpZHRoOiBcIlxuICAgICAgICAgICAgICArIGNtLmRpc3BsYXkubGluZU51bUlubmVyV2lkdGggKyBcInB4XCIpKTtcbiAgICAgIGlmIChtYXJrZXJzKSBmb3IgKHZhciBrID0gMDsgayA8IGNtLm9wdGlvbnMuZ3V0dGVycy5sZW5ndGg7ICsraykge1xuICAgICAgICB2YXIgaWQgPSBjbS5vcHRpb25zLmd1dHRlcnNba10sIGZvdW5kID0gbWFya2Vycy5oYXNPd25Qcm9wZXJ0eShpZCkgJiYgbWFya2Vyc1tpZF07XG4gICAgICAgIGlmIChmb3VuZClcbiAgICAgICAgICBndXR0ZXJXcmFwLmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCBbZm91bmRdLCBcIkNvZGVNaXJyb3ItZ3V0dGVyLWVsdFwiLCBcImxlZnQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaW1zLmd1dHRlckxlZnRbaWRdICsgXCJweDsgd2lkdGg6IFwiICsgZGltcy5ndXR0ZXJXaWR0aFtpZF0gKyBcInB4XCIpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaW5lV2lkZ2V0cyhsaW5lVmlldywgZGltcykge1xuICAgIGlmIChsaW5lVmlldy5hbGlnbmFibGUpIGxpbmVWaWV3LmFsaWduYWJsZSA9IG51bGw7XG4gICAgZm9yICh2YXIgbm9kZSA9IGxpbmVWaWV3Lm5vZGUuZmlyc3RDaGlsZCwgbmV4dDsgbm9kZTsgbm9kZSA9IG5leHQpIHtcbiAgICAgIHZhciBuZXh0ID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgIGlmIChub2RlLmNsYXNzTmFtZSA9PSBcIkNvZGVNaXJyb3ItbGluZXdpZGdldFwiKVxuICAgICAgICBsaW5lVmlldy5ub2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cbiAgICBpbnNlcnRMaW5lV2lkZ2V0cyhsaW5lVmlldywgZGltcyk7XG4gIH1cblxuICAvLyBCdWlsZCBhIGxpbmUncyBET00gcmVwcmVzZW50YXRpb24gZnJvbSBzY3JhdGNoXG4gIGZ1bmN0aW9uIGJ1aWxkTGluZUVsZW1lbnQoY20sIGxpbmVWaWV3LCBsaW5lTiwgZGltcykge1xuICAgIHZhciBidWlsdCA9IGdldExpbmVDb250ZW50KGNtLCBsaW5lVmlldyk7XG4gICAgbGluZVZpZXcudGV4dCA9IGxpbmVWaWV3Lm5vZGUgPSBidWlsdC5wcmU7XG4gICAgaWYgKGJ1aWx0LmJnQ2xhc3MpIGxpbmVWaWV3LmJnQ2xhc3MgPSBidWlsdC5iZ0NsYXNzO1xuICAgIGlmIChidWlsdC50ZXh0Q2xhc3MpIGxpbmVWaWV3LnRleHRDbGFzcyA9IGJ1aWx0LnRleHRDbGFzcztcblxuICAgIHVwZGF0ZUxpbmVDbGFzc2VzKGxpbmVWaWV3KTtcbiAgICB1cGRhdGVMaW5lR3V0dGVyKGNtLCBsaW5lVmlldywgbGluZU4sIGRpbXMpO1xuICAgIGluc2VydExpbmVXaWRnZXRzKGxpbmVWaWV3LCBkaW1zKTtcbiAgICByZXR1cm4gbGluZVZpZXcubm9kZTtcbiAgfVxuXG4gIC8vIEEgbGluZVZpZXcgbWF5IGNvbnRhaW4gbXVsdGlwbGUgbG9naWNhbCBsaW5lcyAod2hlbiBtZXJnZWQgYnlcbiAgLy8gY29sbGFwc2VkIHNwYW5zKS4gVGhlIHdpZGdldHMgZm9yIGFsbCBvZiB0aGVtIG5lZWQgdG8gYmUgZHJhd24uXG4gIGZ1bmN0aW9uIGluc2VydExpbmVXaWRnZXRzKGxpbmVWaWV3LCBkaW1zKSB7XG4gICAgaW5zZXJ0TGluZVdpZGdldHNGb3IobGluZVZpZXcubGluZSwgbGluZVZpZXcsIGRpbXMsIHRydWUpO1xuICAgIGlmIChsaW5lVmlldy5yZXN0KSBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVWaWV3LnJlc3QubGVuZ3RoOyBpKyspXG4gICAgICBpbnNlcnRMaW5lV2lkZ2V0c0ZvcihsaW5lVmlldy5yZXN0W2ldLCBsaW5lVmlldywgZGltcywgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0TGluZVdpZGdldHNGb3IobGluZSwgbGluZVZpZXcsIGRpbXMsIGFsbG93QWJvdmUpIHtcbiAgICBpZiAoIWxpbmUud2lkZ2V0cykgcmV0dXJuO1xuICAgIHZhciB3cmFwID0gZW5zdXJlTGluZVdyYXBwZWQobGluZVZpZXcpO1xuICAgIGZvciAodmFyIGkgPSAwLCB3cyA9IGxpbmUud2lkZ2V0czsgaSA8IHdzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgd2lkZ2V0ID0gd3NbaV0sIG5vZGUgPSBlbHQoXCJkaXZcIiwgW3dpZGdldC5ub2RlXSwgXCJDb2RlTWlycm9yLWxpbmV3aWRnZXRcIik7XG4gICAgICBpZiAoIXdpZGdldC5oYW5kbGVNb3VzZUV2ZW50cykgbm9kZS5pZ25vcmVFdmVudHMgPSB0cnVlO1xuICAgICAgcG9zaXRpb25MaW5lV2lkZ2V0KHdpZGdldCwgbm9kZSwgbGluZVZpZXcsIGRpbXMpO1xuICAgICAgaWYgKGFsbG93QWJvdmUgJiYgd2lkZ2V0LmFib3ZlKVxuICAgICAgICB3cmFwLmluc2VydEJlZm9yZShub2RlLCBsaW5lVmlldy5ndXR0ZXIgfHwgbGluZVZpZXcudGV4dCk7XG4gICAgICBlbHNlXG4gICAgICAgIHdyYXAuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICBzaWduYWxMYXRlcih3aWRnZXQsIFwicmVkcmF3XCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBvc2l0aW9uTGluZVdpZGdldCh3aWRnZXQsIG5vZGUsIGxpbmVWaWV3LCBkaW1zKSB7XG4gICAgaWYgKHdpZGdldC5ub0hTY3JvbGwpIHtcbiAgICAgIChsaW5lVmlldy5hbGlnbmFibGUgfHwgKGxpbmVWaWV3LmFsaWduYWJsZSA9IFtdKSkucHVzaChub2RlKTtcbiAgICAgIHZhciB3aWR0aCA9IGRpbXMud3JhcHBlcldpZHRoO1xuICAgICAgbm9kZS5zdHlsZS5sZWZ0ID0gZGltcy5maXhlZFBvcyArIFwicHhcIjtcbiAgICAgIGlmICghd2lkZ2V0LmNvdmVyR3V0dGVyKSB7XG4gICAgICAgIHdpZHRoIC09IGRpbXMuZ3V0dGVyVG90YWxXaWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5wYWRkaW5nTGVmdCA9IGRpbXMuZ3V0dGVyVG90YWxXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICB9XG4gICAgaWYgKHdpZGdldC5jb3Zlckd1dHRlcikge1xuICAgICAgbm9kZS5zdHlsZS56SW5kZXggPSA1O1xuICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgIGlmICghd2lkZ2V0Lm5vSFNjcm9sbCkgbm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gLWRpbXMuZ3V0dGVyVG90YWxXaWR0aCArIFwicHhcIjtcbiAgICB9XG4gIH1cblxuICAvLyBQT1NJVElPTiBPQkpFQ1RcblxuICAvLyBBIFBvcyBpbnN0YW5jZSByZXByZXNlbnRzIGEgcG9zaXRpb24gd2l0aGluIHRoZSB0ZXh0LlxuICB2YXIgUG9zID0gQ29kZU1pcnJvci5Qb3MgPSBmdW5jdGlvbihsaW5lLCBjaCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQb3MpKSByZXR1cm4gbmV3IFBvcyhsaW5lLCBjaCk7XG4gICAgdGhpcy5saW5lID0gbGluZTsgdGhpcy5jaCA9IGNoO1xuICB9O1xuXG4gIC8vIENvbXBhcmUgdHdvIHBvc2l0aW9ucywgcmV0dXJuIDAgaWYgdGhleSBhcmUgdGhlIHNhbWUsIGEgbmVnYXRpdmVcbiAgLy8gbnVtYmVyIHdoZW4gYSBpcyBsZXNzLCBhbmQgYSBwb3NpdGl2ZSBudW1iZXIgb3RoZXJ3aXNlLlxuICB2YXIgY21wID0gQ29kZU1pcnJvci5jbXBQb3MgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLmxpbmUgLSBiLmxpbmUgfHwgYS5jaCAtIGIuY2g7IH07XG5cbiAgZnVuY3Rpb24gY29weVBvcyh4KSB7cmV0dXJuIFBvcyh4LmxpbmUsIHguY2gpO31cbiAgZnVuY3Rpb24gbWF4UG9zKGEsIGIpIHsgcmV0dXJuIGNtcChhLCBiKSA8IDAgPyBiIDogYTsgfVxuICBmdW5jdGlvbiBtaW5Qb3MoYSwgYikgeyByZXR1cm4gY21wKGEsIGIpIDwgMCA/IGEgOiBiOyB9XG5cbiAgLy8gU0VMRUNUSU9OIC8gQ1VSU09SXG5cbiAgLy8gU2VsZWN0aW9uIG9iamVjdHMgYXJlIGltbXV0YWJsZS4gQSBuZXcgb25lIGlzIGNyZWF0ZWQgZXZlcnkgdGltZVxuICAvLyB0aGUgc2VsZWN0aW9uIGNoYW5nZXMuIEEgc2VsZWN0aW9uIGlzIG9uZSBvciBtb3JlIG5vbi1vdmVybGFwcGluZ1xuICAvLyAoYW5kIG5vbi10b3VjaGluZykgcmFuZ2VzLCBzb3J0ZWQsIGFuZCBhbiBpbnRlZ2VyIHRoYXQgaW5kaWNhdGVzXG4gIC8vIHdoaWNoIG9uZSBpcyB0aGUgcHJpbWFyeSBzZWxlY3Rpb24gKHRoZSBvbmUgdGhhdCdzIHNjcm9sbGVkIGludG9cbiAgLy8gdmlldywgdGhhdCBnZXRDdXJzb3IgcmV0dXJucywgZXRjKS5cbiAgZnVuY3Rpb24gU2VsZWN0aW9uKHJhbmdlcywgcHJpbUluZGV4KSB7XG4gICAgdGhpcy5yYW5nZXMgPSByYW5nZXM7XG4gICAgdGhpcy5wcmltSW5kZXggPSBwcmltSW5kZXg7XG4gIH1cblxuICBTZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICAgIHByaW1hcnk6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5yYW5nZXNbdGhpcy5wcmltSW5kZXhdOyB9LFxuICAgIGVxdWFsczogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIGlmIChvdGhlciA9PSB0aGlzKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChvdGhlci5wcmltSW5kZXggIT0gdGhpcy5wcmltSW5kZXggfHwgb3RoZXIucmFuZ2VzLmxlbmd0aCAhPSB0aGlzLnJhbmdlcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGhlcmUgPSB0aGlzLnJhbmdlc1tpXSwgdGhlcmUgPSBvdGhlci5yYW5nZXNbaV07XG4gICAgICAgIGlmIChjbXAoaGVyZS5hbmNob3IsIHRoZXJlLmFuY2hvcikgIT0gMCB8fCBjbXAoaGVyZS5oZWFkLCB0aGVyZS5oZWFkKSAhPSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRlZXBDb3B5OiBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIG91dCA9IFtdLCBpID0gMDsgaSA8IHRoaXMucmFuZ2VzLmxlbmd0aDsgaSsrKVxuICAgICAgICBvdXRbaV0gPSBuZXcgUmFuZ2UoY29weVBvcyh0aGlzLnJhbmdlc1tpXS5hbmNob3IpLCBjb3B5UG9zKHRoaXMucmFuZ2VzW2ldLmhlYWQpKTtcbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKG91dCwgdGhpcy5wcmltSW5kZXgpO1xuICAgIH0sXG4gICAgc29tZXRoaW5nU2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJhbmdlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKCF0aGlzLnJhbmdlc1tpXS5lbXB0eSgpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihwb3MsIGVuZCkge1xuICAgICAgaWYgKCFlbmQpIGVuZCA9IHBvcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJhbmdlID0gdGhpcy5yYW5nZXNbaV07XG4gICAgICAgIGlmIChjbXAoZW5kLCByYW5nZS5mcm9tKCkpID49IDAgJiYgY21wKHBvcywgcmFuZ2UudG8oKSkgPD0gMClcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gUmFuZ2UoYW5jaG9yLCBoZWFkKSB7XG4gICAgdGhpcy5hbmNob3IgPSBhbmNob3I7IHRoaXMuaGVhZCA9IGhlYWQ7XG4gIH1cblxuICBSYW5nZS5wcm90b3R5cGUgPSB7XG4gICAgZnJvbTogZnVuY3Rpb24oKSB7IHJldHVybiBtaW5Qb3ModGhpcy5hbmNob3IsIHRoaXMuaGVhZCk7IH0sXG4gICAgdG86IGZ1bmN0aW9uKCkgeyByZXR1cm4gbWF4UG9zKHRoaXMuYW5jaG9yLCB0aGlzLmhlYWQpOyB9LFxuICAgIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWQubGluZSA9PSB0aGlzLmFuY2hvci5saW5lICYmIHRoaXMuaGVhZC5jaCA9PSB0aGlzLmFuY2hvci5jaDtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGFrZSBhbiB1bnNvcnRlZCwgcG90ZW50aWFsbHkgb3ZlcmxhcHBpbmcgc2V0IG9mIHJhbmdlcywgYW5kXG4gIC8vIGJ1aWxkIGEgc2VsZWN0aW9uIG91dCBvZiBpdC4gJ0NvbnN1bWVzJyByYW5nZXMgYXJyYXkgKG1vZGlmeWluZ1xuICAvLyBpdCkuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVNlbGVjdGlvbihyYW5nZXMsIHByaW1JbmRleCkge1xuICAgIHZhciBwcmltID0gcmFuZ2VzW3ByaW1JbmRleF07XG4gICAgcmFuZ2VzLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gY21wKGEuZnJvbSgpLCBiLmZyb20oKSk7IH0pO1xuICAgIHByaW1JbmRleCA9IGluZGV4T2YocmFuZ2VzLCBwcmltKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGN1ciA9IHJhbmdlc1tpXSwgcHJldiA9IHJhbmdlc1tpIC0gMV07XG4gICAgICBpZiAoY21wKHByZXYudG8oKSwgY3VyLmZyb20oKSkgPj0gMCkge1xuICAgICAgICB2YXIgZnJvbSA9IG1pblBvcyhwcmV2LmZyb20oKSwgY3VyLmZyb20oKSksIHRvID0gbWF4UG9zKHByZXYudG8oKSwgY3VyLnRvKCkpO1xuICAgICAgICB2YXIgaW52ID0gcHJldi5lbXB0eSgpID8gY3VyLmZyb20oKSA9PSBjdXIuaGVhZCA6IHByZXYuZnJvbSgpID09IHByZXYuaGVhZDtcbiAgICAgICAgaWYgKGkgPD0gcHJpbUluZGV4KSAtLXByaW1JbmRleDtcbiAgICAgICAgcmFuZ2VzLnNwbGljZSgtLWksIDIsIG5ldyBSYW5nZShpbnYgPyB0byA6IGZyb20sIGludiA/IGZyb20gOiB0bykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFNlbGVjdGlvbihyYW5nZXMsIHByaW1JbmRleCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaW1wbGVTZWxlY3Rpb24oYW5jaG9yLCBoZWFkKSB7XG4gICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW25ldyBSYW5nZShhbmNob3IsIGhlYWQgfHwgYW5jaG9yKV0sIDApO1xuICB9XG5cbiAgLy8gTW9zdCBvZiB0aGUgZXh0ZXJuYWwgQVBJIGNsaXBzIGdpdmVuIHBvc2l0aW9ucyB0byBtYWtlIHN1cmUgdGhleVxuICAvLyBhY3R1YWxseSBleGlzdCB3aXRoaW4gdGhlIGRvY3VtZW50LlxuICBmdW5jdGlvbiBjbGlwTGluZShkb2MsIG4pIHtyZXR1cm4gTWF0aC5tYXgoZG9jLmZpcnN0LCBNYXRoLm1pbihuLCBkb2MuZmlyc3QgKyBkb2Muc2l6ZSAtIDEpKTt9XG4gIGZ1bmN0aW9uIGNsaXBQb3MoZG9jLCBwb3MpIHtcbiAgICBpZiAocG9zLmxpbmUgPCBkb2MuZmlyc3QpIHJldHVybiBQb3MoZG9jLmZpcnN0LCAwKTtcbiAgICB2YXIgbGFzdCA9IGRvYy5maXJzdCArIGRvYy5zaXplIC0gMTtcbiAgICBpZiAocG9zLmxpbmUgPiBsYXN0KSByZXR1cm4gUG9zKGxhc3QsIGdldExpbmUoZG9jLCBsYXN0KS50ZXh0Lmxlbmd0aCk7XG4gICAgcmV0dXJuIGNsaXBUb0xlbihwb3MsIGdldExpbmUoZG9jLCBwb3MubGluZSkudGV4dC5sZW5ndGgpO1xuICB9XG4gIGZ1bmN0aW9uIGNsaXBUb0xlbihwb3MsIGxpbmVsZW4pIHtcbiAgICB2YXIgY2ggPSBwb3MuY2g7XG4gICAgaWYgKGNoID09IG51bGwgfHwgY2ggPiBsaW5lbGVuKSByZXR1cm4gUG9zKHBvcy5saW5lLCBsaW5lbGVuKTtcbiAgICBlbHNlIGlmIChjaCA8IDApIHJldHVybiBQb3MocG9zLmxpbmUsIDApO1xuICAgIGVsc2UgcmV0dXJuIHBvcztcbiAgfVxuICBmdW5jdGlvbiBpc0xpbmUoZG9jLCBsKSB7cmV0dXJuIGwgPj0gZG9jLmZpcnN0ICYmIGwgPCBkb2MuZmlyc3QgKyBkb2Muc2l6ZTt9XG4gIGZ1bmN0aW9uIGNsaXBQb3NBcnJheShkb2MsIGFycmF5KSB7XG4gICAgZm9yICh2YXIgb3V0ID0gW10sIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIG91dFtpXSA9IGNsaXBQb3MoZG9jLCBhcnJheVtpXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8vIFNFTEVDVElPTiBVUERBVEVTXG5cbiAgLy8gVGhlICdzY3JvbGwnIHBhcmFtZXRlciBnaXZlbiB0byBtYW55IG9mIHRoZXNlIGluZGljYXRlZCB3aGV0aGVyXG4gIC8vIHRoZSBuZXcgY3Vyc29yIHBvc2l0aW9uIHNob3VsZCBiZSBzY3JvbGxlZCBpbnRvIHZpZXcgYWZ0ZXJcbiAgLy8gbW9kaWZ5aW5nIHRoZSBzZWxlY3Rpb24uXG5cbiAgLy8gSWYgc2hpZnQgaXMgaGVsZCBvciB0aGUgZXh0ZW5kIGZsYWcgaXMgc2V0LCBleHRlbmRzIGEgcmFuZ2UgdG9cbiAgLy8gaW5jbHVkZSBhIGdpdmVuIHBvc2l0aW9uIChhbmQgb3B0aW9uYWxseSBhIHNlY29uZCBwb3NpdGlvbikuXG4gIC8vIE90aGVyd2lzZSwgc2ltcGx5IHJldHVybnMgdGhlIHJhbmdlIGJldHdlZW4gdGhlIGdpdmVuIHBvc2l0aW9ucy5cbiAgLy8gVXNlZCBmb3IgY3Vyc29yIG1vdGlvbiBhbmQgc3VjaC5cbiAgZnVuY3Rpb24gZXh0ZW5kUmFuZ2UoZG9jLCByYW5nZSwgaGVhZCwgb3RoZXIpIHtcbiAgICBpZiAoZG9jLmNtICYmIGRvYy5jbS5kaXNwbGF5LnNoaWZ0IHx8IGRvYy5leHRlbmQpIHtcbiAgICAgIHZhciBhbmNob3IgPSByYW5nZS5hbmNob3I7XG4gICAgICBpZiAob3RoZXIpIHtcbiAgICAgICAgdmFyIHBvc0JlZm9yZSA9IGNtcChoZWFkLCBhbmNob3IpIDwgMDtcbiAgICAgICAgaWYgKHBvc0JlZm9yZSAhPSAoY21wKG90aGVyLCBhbmNob3IpIDwgMCkpIHtcbiAgICAgICAgICBhbmNob3IgPSBoZWFkO1xuICAgICAgICAgIGhlYWQgPSBvdGhlcjtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NCZWZvcmUgIT0gKGNtcChoZWFkLCBvdGhlcikgPCAwKSkge1xuICAgICAgICAgIGhlYWQgPSBvdGhlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBSYW5nZShhbmNob3IsIGhlYWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKG90aGVyIHx8IGhlYWQsIGhlYWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEV4dGVuZCB0aGUgcHJpbWFyeSBzZWxlY3Rpb24gcmFuZ2UsIGRpc2NhcmQgdGhlIHJlc3QuXG4gIGZ1bmN0aW9uIGV4dGVuZFNlbGVjdGlvbihkb2MsIGhlYWQsIG90aGVyLCBvcHRpb25zKSB7XG4gICAgc2V0U2VsZWN0aW9uKGRvYywgbmV3IFNlbGVjdGlvbihbZXh0ZW5kUmFuZ2UoZG9jLCBkb2Muc2VsLnByaW1hcnkoKSwgaGVhZCwgb3RoZXIpXSwgMCksIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gRXh0ZW5kIGFsbCBzZWxlY3Rpb25zIChwb3MgaXMgYW4gYXJyYXkgb2Ygc2VsZWN0aW9ucyB3aXRoIGxlbmd0aFxuICAvLyBlcXVhbCB0aGUgbnVtYmVyIG9mIHNlbGVjdGlvbnMpXG4gIGZ1bmN0aW9uIGV4dGVuZFNlbGVjdGlvbnMoZG9jLCBoZWFkcywgb3B0aW9ucykge1xuICAgIGZvciAodmFyIG91dCA9IFtdLCBpID0gMDsgaSA8IGRvYy5zZWwucmFuZ2VzLmxlbmd0aDsgaSsrKVxuICAgICAgb3V0W2ldID0gZXh0ZW5kUmFuZ2UoZG9jLCBkb2Muc2VsLnJhbmdlc1tpXSwgaGVhZHNbaV0sIG51bGwpO1xuICAgIHZhciBuZXdTZWwgPSBub3JtYWxpemVTZWxlY3Rpb24ob3V0LCBkb2Muc2VsLnByaW1JbmRleCk7XG4gICAgc2V0U2VsZWN0aW9uKGRvYywgbmV3U2VsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgYSBzaW5nbGUgcmFuZ2UgaW4gdGhlIHNlbGVjdGlvbi5cbiAgZnVuY3Rpb24gcmVwbGFjZU9uZVNlbGVjdGlvbihkb2MsIGksIHJhbmdlLCBvcHRpb25zKSB7XG4gICAgdmFyIHJhbmdlcyA9IGRvYy5zZWwucmFuZ2VzLnNsaWNlKDApO1xuICAgIHJhbmdlc1tpXSA9IHJhbmdlO1xuICAgIHNldFNlbGVjdGlvbihkb2MsIG5vcm1hbGl6ZVNlbGVjdGlvbihyYW5nZXMsIGRvYy5zZWwucHJpbUluZGV4KSwgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBSZXNldCB0aGUgc2VsZWN0aW9uIHRvIGEgc2luZ2xlIHJhbmdlLlxuICBmdW5jdGlvbiBzZXRTaW1wbGVTZWxlY3Rpb24oZG9jLCBhbmNob3IsIGhlYWQsIG9wdGlvbnMpIHtcbiAgICBzZXRTZWxlY3Rpb24oZG9jLCBzaW1wbGVTZWxlY3Rpb24oYW5jaG9yLCBoZWFkKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBHaXZlIGJlZm9yZVNlbGVjdGlvbkNoYW5nZSBoYW5kbGVycyBhIGNoYW5nZSB0byBpbmZsdWVuY2UgYVxuICAvLyBzZWxlY3Rpb24gdXBkYXRlLlxuICBmdW5jdGlvbiBmaWx0ZXJTZWxlY3Rpb25DaGFuZ2UoZG9jLCBzZWwpIHtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgcmFuZ2VzOiBzZWwucmFuZ2VzLFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbihyYW5nZXMpIHtcbiAgICAgICAgdGhpcy5yYW5nZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgdGhpcy5yYW5nZXNbaV0gPSBuZXcgUmFuZ2UoY2xpcFBvcyhkb2MsIHJhbmdlc1tpXS5hbmNob3IpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBQb3MoZG9jLCByYW5nZXNbaV0uaGVhZCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgc2lnbmFsKGRvYywgXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgZG9jLCBvYmopO1xuICAgIGlmIChkb2MuY20pIHNpZ25hbChkb2MuY20sIFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIGRvYy5jbSwgb2JqKTtcbiAgICBpZiAob2JqLnJhbmdlcyAhPSBzZWwucmFuZ2VzKSByZXR1cm4gbm9ybWFsaXplU2VsZWN0aW9uKG9iai5yYW5nZXMsIG9iai5yYW5nZXMubGVuZ3RoIC0gMSk7XG4gICAgZWxzZSByZXR1cm4gc2VsO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uUmVwbGFjZUhpc3RvcnkoZG9jLCBzZWwsIG9wdGlvbnMpIHtcbiAgICB2YXIgZG9uZSA9IGRvYy5oaXN0b3J5LmRvbmUsIGxhc3QgPSBsc3QoZG9uZSk7XG4gICAgaWYgKGxhc3QgJiYgbGFzdC5yYW5nZXMpIHtcbiAgICAgIGRvbmVbZG9uZS5sZW5ndGggLSAxXSA9IHNlbDtcbiAgICAgIHNldFNlbGVjdGlvbk5vVW5kbyhkb2MsIHNlbCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFNlbGVjdGlvbihkb2MsIHNlbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLy8gU2V0IGEgbmV3IHNlbGVjdGlvbi5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uKGRvYywgc2VsLCBvcHRpb25zKSB7XG4gICAgc2V0U2VsZWN0aW9uTm9VbmRvKGRvYywgc2VsLCBvcHRpb25zKTtcbiAgICBhZGRTZWxlY3Rpb25Ub0hpc3RvcnkoZG9jLCBkb2Muc2VsLCBkb2MuY20gPyBkb2MuY20uY3VyT3AuaWQgOiBOYU4sIG9wdGlvbnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uTm9VbmRvKGRvYywgc2VsLCBvcHRpb25zKSB7XG4gICAgaWYgKGhhc0hhbmRsZXIoZG9jLCBcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiKSB8fCBkb2MuY20gJiYgaGFzSGFuZGxlcihkb2MuY20sIFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIpKVxuICAgICAgc2VsID0gZmlsdGVyU2VsZWN0aW9uQ2hhbmdlKGRvYywgc2VsKTtcblxuICAgIHZhciBiaWFzID0gb3B0aW9ucyAmJiBvcHRpb25zLmJpYXMgfHxcbiAgICAgIChjbXAoc2VsLnByaW1hcnkoKS5oZWFkLCBkb2Muc2VsLnByaW1hcnkoKS5oZWFkKSA8IDAgPyAtMSA6IDEpO1xuICAgIHNldFNlbGVjdGlvbklubmVyKGRvYywgc2tpcEF0b21pY0luU2VsZWN0aW9uKGRvYywgc2VsLCBiaWFzLCB0cnVlKSk7XG5cbiAgICBpZiAoIShvcHRpb25zICYmIG9wdGlvbnMuc2Nyb2xsID09PSBmYWxzZSkgJiYgZG9jLmNtKVxuICAgICAgZW5zdXJlQ3Vyc29yVmlzaWJsZShkb2MuY20pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uSW5uZXIoZG9jLCBzZWwpIHtcbiAgICBpZiAoc2VsLmVxdWFscyhkb2Muc2VsKSkgcmV0dXJuO1xuXG4gICAgZG9jLnNlbCA9IHNlbDtcblxuICAgIGlmIChkb2MuY20pIHtcbiAgICAgIGRvYy5jbS5jdXJPcC51cGRhdGVJbnB1dCA9IGRvYy5jbS5jdXJPcC5zZWxlY3Rpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHNpZ25hbEN1cnNvckFjdGl2aXR5KGRvYy5jbSk7XG4gICAgfVxuICAgIHNpZ25hbExhdGVyKGRvYywgXCJjdXJzb3JBY3Rpdml0eVwiLCBkb2MpO1xuICB9XG5cbiAgLy8gVmVyaWZ5IHRoYXQgdGhlIHNlbGVjdGlvbiBkb2VzIG5vdCBwYXJ0aWFsbHkgc2VsZWN0IGFueSBhdG9taWNcbiAgLy8gbWFya2VkIHJhbmdlcy5cbiAgZnVuY3Rpb24gcmVDaGVja1NlbGVjdGlvbihkb2MpIHtcbiAgICBzZXRTZWxlY3Rpb25Jbm5lcihkb2MsIHNraXBBdG9taWNJblNlbGVjdGlvbihkb2MsIGRvYy5zZWwsIG51bGwsIGZhbHNlKSwgc2VsX2RvbnRTY3JvbGwpO1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgc2VsZWN0aW9uIHRoYXQgZG9lcyBub3QgcGFydGlhbGx5IHNlbGVjdCBhbnkgYXRvbWljXG4gIC8vIHJhbmdlcy5cbiAgZnVuY3Rpb24gc2tpcEF0b21pY0luU2VsZWN0aW9uKGRvYywgc2VsLCBiaWFzLCBtYXlDbGVhcikge1xuICAgIHZhciBvdXQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWwucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBzZWwucmFuZ2VzW2ldO1xuICAgICAgdmFyIG5ld0FuY2hvciA9IHNraXBBdG9taWMoZG9jLCByYW5nZS5hbmNob3IsIGJpYXMsIG1heUNsZWFyKTtcbiAgICAgIHZhciBuZXdIZWFkID0gc2tpcEF0b21pYyhkb2MsIHJhbmdlLmhlYWQsIGJpYXMsIG1heUNsZWFyKTtcbiAgICAgIGlmIChvdXQgfHwgbmV3QW5jaG9yICE9IHJhbmdlLmFuY2hvciB8fCBuZXdIZWFkICE9IHJhbmdlLmhlYWQpIHtcbiAgICAgICAgaWYgKCFvdXQpIG91dCA9IHNlbC5yYW5nZXMuc2xpY2UoMCwgaSk7XG4gICAgICAgIG91dFtpXSA9IG5ldyBSYW5nZShuZXdBbmNob3IsIG5ld0hlYWQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0ID8gbm9ybWFsaXplU2VsZWN0aW9uKG91dCwgc2VsLnByaW1JbmRleCkgOiBzZWw7XG4gIH1cblxuICAvLyBFbnN1cmUgYSBnaXZlbiBwb3NpdGlvbiBpcyBub3QgaW5zaWRlIGFuIGF0b21pYyByYW5nZS5cbiAgZnVuY3Rpb24gc2tpcEF0b21pYyhkb2MsIHBvcywgYmlhcywgbWF5Q2xlYXIpIHtcbiAgICB2YXIgZmxpcHBlZCA9IGZhbHNlLCBjdXJQb3MgPSBwb3M7XG4gICAgdmFyIGRpciA9IGJpYXMgfHwgMTtcbiAgICBkb2MuY2FudEVkaXQgPSBmYWxzZTtcbiAgICBzZWFyY2g6IGZvciAoOzspIHtcbiAgICAgIHZhciBsaW5lID0gZ2V0TGluZShkb2MsIGN1clBvcy5saW5lKTtcbiAgICAgIGlmIChsaW5lLm1hcmtlZFNwYW5zKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5tYXJrZWRTcGFucy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIHZhciBzcCA9IGxpbmUubWFya2VkU3BhbnNbaV0sIG0gPSBzcC5tYXJrZXI7XG4gICAgICAgICAgaWYgKChzcC5mcm9tID09IG51bGwgfHwgKG0uaW5jbHVzaXZlTGVmdCA/IHNwLmZyb20gPD0gY3VyUG9zLmNoIDogc3AuZnJvbSA8IGN1clBvcy5jaCkpICYmXG4gICAgICAgICAgICAgIChzcC50byA9PSBudWxsIHx8IChtLmluY2x1c2l2ZVJpZ2h0ID8gc3AudG8gPj0gY3VyUG9zLmNoIDogc3AudG8gPiBjdXJQb3MuY2gpKSkge1xuICAgICAgICAgICAgaWYgKG1heUNsZWFyKSB7XG4gICAgICAgICAgICAgIHNpZ25hbChtLCBcImJlZm9yZUN1cnNvckVudGVyXCIpO1xuICAgICAgICAgICAgICBpZiAobS5leHBsaWNpdGx5Q2xlYXJlZCkge1xuICAgICAgICAgICAgICAgIGlmICghbGluZS5tYXJrZWRTcGFucykgYnJlYWs7XG4gICAgICAgICAgICAgICAgZWxzZSB7LS1pOyBjb250aW51ZTt9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbS5hdG9taWMpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIG5ld1BvcyA9IG0uZmluZChkaXIgPCAwID8gLTEgOiAxKTtcbiAgICAgICAgICAgIGlmIChjbXAobmV3UG9zLCBjdXJQb3MpID09IDApIHtcbiAgICAgICAgICAgICAgbmV3UG9zLmNoICs9IGRpcjtcbiAgICAgICAgICAgICAgaWYgKG5ld1Bvcy5jaCA8IDApIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9zLmxpbmUgPiBkb2MuZmlyc3QpIG5ld1BvcyA9IGNsaXBQb3MoZG9jLCBQb3MobmV3UG9zLmxpbmUgLSAxKSk7XG4gICAgICAgICAgICAgICAgZWxzZSBuZXdQb3MgPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1Bvcy5jaCA+IGxpbmUudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9zLmxpbmUgPCBkb2MuZmlyc3QgKyBkb2Muc2l6ZSAtIDEpIG5ld1BvcyA9IFBvcyhuZXdQb3MubGluZSArIDEsIDApO1xuICAgICAgICAgICAgICAgIGVsc2UgbmV3UG9zID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIW5ld1Bvcykge1xuICAgICAgICAgICAgICAgIGlmIChmbGlwcGVkKSB7XG4gICAgICAgICAgICAgICAgICAvLyBEcml2ZW4gaW4gYSBjb3JuZXIgLS0gbm8gdmFsaWQgY3Vyc29yIHBvc2l0aW9uIGZvdW5kIGF0IGFsbFxuICAgICAgICAgICAgICAgICAgLy8gLS0gdHJ5IGFnYWluICp3aXRoKiBjbGVhcmluZywgaWYgd2UgZGlkbid0IGFscmVhZHlcbiAgICAgICAgICAgICAgICAgIGlmICghbWF5Q2xlYXIpIHJldHVybiBza2lwQXRvbWljKGRvYywgcG9zLCBiaWFzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdHVybiBvZmYgZWRpdGluZyB1bnRpbCBmdXJ0aGVyIG5vdGljZSwgYW5kIHJldHVybiB0aGUgc3RhcnQgb2YgdGhlIGRvY1xuICAgICAgICAgICAgICAgICAgZG9jLmNhbnRFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQb3MoZG9jLmZpcnN0LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmxpcHBlZCA9IHRydWU7IG5ld1BvcyA9IHBvczsgZGlyID0gLWRpcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyUG9zID0gbmV3UG9zO1xuICAgICAgICAgICAgY29udGludWUgc2VhcmNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN1clBvcztcbiAgICB9XG4gIH1cblxuICAvLyBTRUxFQ1RJT04gRFJBV0lOR1xuXG4gIC8vIFJlZHJhdyB0aGUgc2VsZWN0aW9uIGFuZC9vciBjdXJzb3JcbiAgZnVuY3Rpb24gdXBkYXRlU2VsZWN0aW9uKGNtKSB7XG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5LCBkb2MgPSBjbS5kb2M7XG4gICAgdmFyIGN1ckZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBzZWxGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9jLnNlbC5yYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByYW5nZSA9IGRvYy5zZWwucmFuZ2VzW2ldO1xuICAgICAgdmFyIGNvbGxhcHNlZCA9IHJhbmdlLmVtcHR5KCk7XG4gICAgICBpZiAoY29sbGFwc2VkIHx8IGNtLm9wdGlvbnMuc2hvd0N1cnNvcldoZW5TZWxlY3RpbmcpXG4gICAgICAgIGRyYXdTZWxlY3Rpb25DdXJzb3IoY20sIHJhbmdlLCBjdXJGcmFnbWVudCk7XG4gICAgICBpZiAoIWNvbGxhcHNlZClcbiAgICAgICAgZHJhd1NlbGVjdGlvblJhbmdlKGNtLCByYW5nZSwgc2VsRnJhZ21lbnQpO1xuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIGhpZGRlbiB0ZXh0YXJlYSBuZWFyIHRoZSBjdXJzb3IgdG8gcHJldmVudCBzY3JvbGxpbmcgYXJ0aWZhY3RzXG4gICAgaWYgKGNtLm9wdGlvbnMubW92ZUlucHV0V2l0aEN1cnNvcikge1xuICAgICAgdmFyIGhlYWRQb3MgPSBjdXJzb3JDb29yZHMoY20sIGRvYy5zZWwucHJpbWFyeSgpLmhlYWQsIFwiZGl2XCIpO1xuICAgICAgdmFyIHdyYXBPZmYgPSBkaXNwbGF5LndyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGxpbmVPZmYgPSBkaXNwbGF5LmxpbmVEaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgdG9wID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oZGlzcGxheS53cmFwcGVyLmNsaWVudEhlaWdodCAtIDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRQb3MudG9wICsgbGluZU9mZi50b3AgLSB3cmFwT2ZmLnRvcCkpO1xuICAgICAgdmFyIGxlZnQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihkaXNwbGF5LndyYXBwZXIuY2xpZW50V2lkdGggLSAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZFBvcy5sZWZ0ICsgbGluZU9mZi5sZWZ0IC0gd3JhcE9mZi5sZWZ0KSk7XG4gICAgICBkaXNwbGF5LmlucHV0RGl2LnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcbiAgICAgIGRpc3BsYXkuaW5wdXREaXYuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGRyZW5BbmRBZGQoZGlzcGxheS5jdXJzb3JEaXYsIGN1ckZyYWdtZW50KTtcbiAgICByZW1vdmVDaGlsZHJlbkFuZEFkZChkaXNwbGF5LnNlbGVjdGlvbkRpdiwgc2VsRnJhZ21lbnQpO1xuICB9XG5cbiAgLy8gRHJhd3MgYSBjdXJzb3IgZm9yIHRoZSBnaXZlbiByYW5nZVxuICBmdW5jdGlvbiBkcmF3U2VsZWN0aW9uQ3Vyc29yKGNtLCByYW5nZSwgb3V0cHV0KSB7XG4gICAgdmFyIHBvcyA9IGN1cnNvckNvb3JkcyhjbSwgcmFuZ2UuaGVhZCwgXCJkaXZcIik7XG5cbiAgICB2YXIgY3Vyc29yID0gb3V0cHV0LmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCBcIlxcdTAwYTBcIiwgXCJDb2RlTWlycm9yLWN1cnNvclwiKSk7XG4gICAgY3Vyc29yLnN0eWxlLmxlZnQgPSBwb3MubGVmdCArIFwicHhcIjtcbiAgICBjdXJzb3Iuc3R5bGUudG9wID0gcG9zLnRvcCArIFwicHhcIjtcbiAgICBjdXJzb3Iuc3R5bGUuaGVpZ2h0ID0gTWF0aC5tYXgoMCwgcG9zLmJvdHRvbSAtIHBvcy50b3ApICogY20ub3B0aW9ucy5jdXJzb3JIZWlnaHQgKyBcInB4XCI7XG5cbiAgICBpZiAocG9zLm90aGVyKSB7XG4gICAgICAvLyBTZWNvbmRhcnkgY3Vyc29yLCBzaG93biB3aGVuIG9uIGEgJ2p1bXAnIGluIGJpLWRpcmVjdGlvbmFsIHRleHRcbiAgICAgIHZhciBvdGhlckN1cnNvciA9IG91dHB1dC5hcHBlbmRDaGlsZChlbHQoXCJkaXZcIiwgXCJcXHUwMGEwXCIsIFwiQ29kZU1pcnJvci1jdXJzb3IgQ29kZU1pcnJvci1zZWNvbmRhcnljdXJzb3JcIikpO1xuICAgICAgb3RoZXJDdXJzb3Iuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICBvdGhlckN1cnNvci5zdHlsZS5sZWZ0ID0gcG9zLm90aGVyLmxlZnQgKyBcInB4XCI7XG4gICAgICBvdGhlckN1cnNvci5zdHlsZS50b3AgPSBwb3Mub3RoZXIudG9wICsgXCJweFwiO1xuICAgICAgb3RoZXJDdXJzb3Iuc3R5bGUuaGVpZ2h0ID0gKHBvcy5vdGhlci5ib3R0b20gLSBwb3Mub3RoZXIudG9wKSAqIC44NSArIFwicHhcIjtcbiAgICB9XG4gIH1cblxuICAvLyBEcmF3cyB0aGUgZ2l2ZW4gcmFuZ2UgYXMgYSBoaWdobGlnaHRlZCBzZWxlY3Rpb25cbiAgZnVuY3Rpb24gZHJhd1NlbGVjdGlvblJhbmdlKGNtLCByYW5nZSwgb3V0cHV0KSB7XG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5LCBkb2MgPSBjbS5kb2M7XG4gICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBwYWRkaW5nID0gcGFkZGluZ0goY20uZGlzcGxheSksIGxlZnRTaWRlID0gcGFkZGluZy5sZWZ0LCByaWdodFNpZGUgPSBkaXNwbGF5LmxpbmVTcGFjZS5vZmZzZXRXaWR0aCAtIHBhZGRpbmcucmlnaHQ7XG5cbiAgICBmdW5jdGlvbiBhZGQobGVmdCwgdG9wLCB3aWR0aCwgYm90dG9tKSB7XG4gICAgICBpZiAodG9wIDwgMCkgdG9wID0gMDtcbiAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wKTtcbiAgICAgIGJvdHRvbSA9IE1hdGgucm91bmQoYm90dG9tKTtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCBudWxsLCBcIkNvZGVNaXJyb3Itc2VsZWN0ZWRcIiwgXCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IFwiICsgbGVmdCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJweDsgdG9wOiBcIiArIHRvcCArIFwicHg7IHdpZHRoOiBcIiArICh3aWR0aCA9PSBudWxsID8gcmlnaHRTaWRlIC0gbGVmdCA6IHdpZHRoKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJweDsgaGVpZ2h0OiBcIiArIChib3R0b20gLSB0b3ApICsgXCJweFwiKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhd0ZvckxpbmUobGluZSwgZnJvbUFyZywgdG9BcmcpIHtcbiAgICAgIHZhciBsaW5lT2JqID0gZ2V0TGluZShkb2MsIGxpbmUpO1xuICAgICAgdmFyIGxpbmVMZW4gPSBsaW5lT2JqLnRleHQubGVuZ3RoO1xuICAgICAgdmFyIHN0YXJ0LCBlbmQ7XG4gICAgICBmdW5jdGlvbiBjb29yZHMoY2gsIGJpYXMpIHtcbiAgICAgICAgcmV0dXJuIGNoYXJDb29yZHMoY20sIFBvcyhsaW5lLCBjaCksIFwiZGl2XCIsIGxpbmVPYmosIGJpYXMpO1xuICAgICAgfVxuXG4gICAgICBpdGVyYXRlQmlkaVNlY3Rpb25zKGdldE9yZGVyKGxpbmVPYmopLCBmcm9tQXJnIHx8IDAsIHRvQXJnID09IG51bGwgPyBsaW5lTGVuIDogdG9BcmcsIGZ1bmN0aW9uKGZyb20sIHRvLCBkaXIpIHtcbiAgICAgICAgdmFyIGxlZnRQb3MgPSBjb29yZHMoZnJvbSwgXCJsZWZ0XCIpLCByaWdodFBvcywgbGVmdCwgcmlnaHQ7XG4gICAgICAgIGlmIChmcm9tID09IHRvKSB7XG4gICAgICAgICAgcmlnaHRQb3MgPSBsZWZ0UG9zO1xuICAgICAgICAgIGxlZnQgPSByaWdodCA9IGxlZnRQb3MubGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByaWdodFBvcyA9IGNvb3Jkcyh0byAtIDEsIFwicmlnaHRcIik7XG4gICAgICAgICAgaWYgKGRpciA9PSBcInJ0bFwiKSB7IHZhciB0bXAgPSBsZWZ0UG9zOyBsZWZ0UG9zID0gcmlnaHRQb3M7IHJpZ2h0UG9zID0gdG1wOyB9XG4gICAgICAgICAgbGVmdCA9IGxlZnRQb3MubGVmdDtcbiAgICAgICAgICByaWdodCA9IHJpZ2h0UG9zLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcm9tQXJnID09IG51bGwgJiYgZnJvbSA9PSAwKSBsZWZ0ID0gbGVmdFNpZGU7XG4gICAgICAgIGlmIChyaWdodFBvcy50b3AgLSBsZWZ0UG9zLnRvcCA+IDMpIHsgLy8gRGlmZmVyZW50IGxpbmVzLCBkcmF3IHRvcCBwYXJ0XG4gICAgICAgICAgYWRkKGxlZnQsIGxlZnRQb3MudG9wLCBudWxsLCBsZWZ0UG9zLmJvdHRvbSk7XG4gICAgICAgICAgbGVmdCA9IGxlZnRTaWRlO1xuICAgICAgICAgIGlmIChsZWZ0UG9zLmJvdHRvbSA8IHJpZ2h0UG9zLnRvcCkgYWRkKGxlZnQsIGxlZnRQb3MuYm90dG9tLCBudWxsLCByaWdodFBvcy50b3ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b0FyZyA9PSBudWxsICYmIHRvID09IGxpbmVMZW4pIHJpZ2h0ID0gcmlnaHRTaWRlO1xuICAgICAgICBpZiAoIXN0YXJ0IHx8IGxlZnRQb3MudG9wIDwgc3RhcnQudG9wIHx8IGxlZnRQb3MudG9wID09IHN0YXJ0LnRvcCAmJiBsZWZ0UG9zLmxlZnQgPCBzdGFydC5sZWZ0KVxuICAgICAgICAgIHN0YXJ0ID0gbGVmdFBvcztcbiAgICAgICAgaWYgKCFlbmQgfHwgcmlnaHRQb3MuYm90dG9tID4gZW5kLmJvdHRvbSB8fCByaWdodFBvcy5ib3R0b20gPT0gZW5kLmJvdHRvbSAmJiByaWdodFBvcy5yaWdodCA+IGVuZC5yaWdodClcbiAgICAgICAgICBlbmQgPSByaWdodFBvcztcbiAgICAgICAgaWYgKGxlZnQgPCBsZWZ0U2lkZSArIDEpIGxlZnQgPSBsZWZ0U2lkZTtcbiAgICAgICAgYWRkKGxlZnQsIHJpZ2h0UG9zLnRvcCwgcmlnaHQgLSBsZWZ0LCByaWdodFBvcy5ib3R0b20pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge3N0YXJ0OiBzdGFydCwgZW5kOiBlbmR9O1xuICAgIH1cblxuICAgIHZhciBzRnJvbSA9IHJhbmdlLmZyb20oKSwgc1RvID0gcmFuZ2UudG8oKTtcbiAgICBpZiAoc0Zyb20ubGluZSA9PSBzVG8ubGluZSkge1xuICAgICAgZHJhd0ZvckxpbmUoc0Zyb20ubGluZSwgc0Zyb20uY2gsIHNUby5jaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmcm9tTGluZSA9IGdldExpbmUoZG9jLCBzRnJvbS5saW5lKSwgdG9MaW5lID0gZ2V0TGluZShkb2MsIHNUby5saW5lKTtcbiAgICAgIHZhciBzaW5nbGVWTGluZSA9IHZpc3VhbExpbmUoZnJvbUxpbmUpID09IHZpc3VhbExpbmUodG9MaW5lKTtcbiAgICAgIHZhciBsZWZ0RW5kID0gZHJhd0ZvckxpbmUoc0Zyb20ubGluZSwgc0Zyb20uY2gsIHNpbmdsZVZMaW5lID8gZnJvbUxpbmUudGV4dC5sZW5ndGggKyAxIDogbnVsbCkuZW5kO1xuICAgICAgdmFyIHJpZ2h0U3RhcnQgPSBkcmF3Rm9yTGluZShzVG8ubGluZSwgc2luZ2xlVkxpbmUgPyAwIDogbnVsbCwgc1RvLmNoKS5zdGFydDtcbiAgICAgIGlmIChzaW5nbGVWTGluZSkge1xuICAgICAgICBpZiAobGVmdEVuZC50b3AgPCByaWdodFN0YXJ0LnRvcCAtIDIpIHtcbiAgICAgICAgICBhZGQobGVmdEVuZC5yaWdodCwgbGVmdEVuZC50b3AsIG51bGwsIGxlZnRFbmQuYm90dG9tKTtcbiAgICAgICAgICBhZGQobGVmdFNpZGUsIHJpZ2h0U3RhcnQudG9wLCByaWdodFN0YXJ0LmxlZnQsIHJpZ2h0U3RhcnQuYm90dG9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGQobGVmdEVuZC5yaWdodCwgbGVmdEVuZC50b3AsIHJpZ2h0U3RhcnQubGVmdCAtIGxlZnRFbmQucmlnaHQsIGxlZnRFbmQuYm90dG9tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxlZnRFbmQuYm90dG9tIDwgcmlnaHRTdGFydC50b3ApXG4gICAgICAgIGFkZChsZWZ0U2lkZSwgbGVmdEVuZC5ib3R0b20sIG51bGwsIHJpZ2h0U3RhcnQudG9wKTtcbiAgICB9XG5cbiAgICBvdXRwdXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9XG5cbiAgLy8gQ3Vyc29yLWJsaW5raW5nXG4gIGZ1bmN0aW9uIHJlc3RhcnRCbGluayhjbSkge1xuICAgIGlmICghY20uc3RhdGUuZm9jdXNlZCkgcmV0dXJuO1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheTtcbiAgICBjbGVhckludGVydmFsKGRpc3BsYXkuYmxpbmtlcik7XG4gICAgdmFyIG9uID0gdHJ1ZTtcbiAgICBkaXNwbGF5LmN1cnNvckRpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICBpZiAoY20ub3B0aW9ucy5jdXJzb3JCbGlua1JhdGUgPiAwKVxuICAgICAgZGlzcGxheS5ibGlua2VyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGRpc3BsYXkuY3Vyc29yRGl2LnN0eWxlLnZpc2liaWxpdHkgPSAob24gPSAhb24pID8gXCJcIiA6IFwiaGlkZGVuXCI7XG4gICAgICB9LCBjbS5vcHRpb25zLmN1cnNvckJsaW5rUmF0ZSk7XG4gIH1cblxuICAvLyBISUdITElHSFQgV09SS0VSXG5cbiAgZnVuY3Rpb24gc3RhcnRXb3JrZXIoY20sIHRpbWUpIHtcbiAgICBpZiAoY20uZG9jLm1vZGUuc3RhcnRTdGF0ZSAmJiBjbS5kb2MuZnJvbnRpZXIgPCBjbS5kaXNwbGF5LnZpZXdUbylcbiAgICAgIGNtLnN0YXRlLmhpZ2hsaWdodC5zZXQodGltZSwgYmluZChoaWdobGlnaHRXb3JrZXIsIGNtKSk7XG4gIH1cblxuICBmdW5jdGlvbiBoaWdobGlnaHRXb3JrZXIoY20pIHtcbiAgICB2YXIgZG9jID0gY20uZG9jO1xuICAgIGlmIChkb2MuZnJvbnRpZXIgPCBkb2MuZmlyc3QpIGRvYy5mcm9udGllciA9IGRvYy5maXJzdDtcbiAgICBpZiAoZG9jLmZyb250aWVyID49IGNtLmRpc3BsYXkudmlld1RvKSByZXR1cm47XG4gICAgdmFyIGVuZCA9ICtuZXcgRGF0ZSArIGNtLm9wdGlvbnMud29ya1RpbWU7XG4gICAgdmFyIHN0YXRlID0gY29weVN0YXRlKGRvYy5tb2RlLCBnZXRTdGF0ZUJlZm9yZShjbSwgZG9jLmZyb250aWVyKSk7XG5cbiAgICBydW5Jbk9wKGNtLCBmdW5jdGlvbigpIHtcbiAgICBkb2MuaXRlcihkb2MuZnJvbnRpZXIsIE1hdGgubWluKGRvYy5maXJzdCArIGRvYy5zaXplLCBjbS5kaXNwbGF5LnZpZXdUbyArIDUwMCksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIGlmIChkb2MuZnJvbnRpZXIgPj0gY20uZGlzcGxheS52aWV3RnJvbSkgeyAvLyBWaXNpYmxlXG4gICAgICAgIHZhciBvbGRTdHlsZXMgPSBsaW5lLnN0eWxlcztcbiAgICAgICAgdmFyIGhpZ2hsaWdodGVkID0gaGlnaGxpZ2h0TGluZShjbSwgbGluZSwgc3RhdGUsIHRydWUpO1xuICAgICAgICBsaW5lLnN0eWxlcyA9IGhpZ2hsaWdodGVkLnN0eWxlcztcbiAgICAgICAgaWYgKGhpZ2hsaWdodGVkLmNsYXNzZXMpIGxpbmUuc3R5bGVDbGFzc2VzID0gaGlnaGxpZ2h0ZWQuY2xhc3NlcztcbiAgICAgICAgZWxzZSBpZiAobGluZS5zdHlsZUNsYXNzZXMpIGxpbmUuc3R5bGVDbGFzc2VzID0gbnVsbDtcbiAgICAgICAgdmFyIGlzY2hhbmdlID0gIW9sZFN0eWxlcyB8fCBvbGRTdHlsZXMubGVuZ3RoICE9IGxpbmUuc3R5bGVzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7ICFpc2NoYW5nZSAmJiBpIDwgb2xkU3R5bGVzLmxlbmd0aDsgKytpKSBpc2NoYW5nZSA9IG9sZFN0eWxlc1tpXSAhPSBsaW5lLnN0eWxlc1tpXTtcbiAgICAgICAgaWYgKGlzY2hhbmdlKSByZWdMaW5lQ2hhbmdlKGNtLCBkb2MuZnJvbnRpZXIsIFwidGV4dFwiKTtcbiAgICAgICAgbGluZS5zdGF0ZUFmdGVyID0gY29weVN0YXRlKGRvYy5tb2RlLCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9jZXNzTGluZShjbSwgbGluZS50ZXh0LCBzdGF0ZSk7XG4gICAgICAgIGxpbmUuc3RhdGVBZnRlciA9IGRvYy5mcm9udGllciAlIDUgPT0gMCA/IGNvcHlTdGF0ZShkb2MubW9kZSwgc3RhdGUpIDogbnVsbDtcbiAgICAgIH1cbiAgICAgICsrZG9jLmZyb250aWVyO1xuICAgICAgaWYgKCtuZXcgRGF0ZSA+IGVuZCkge1xuICAgICAgICBzdGFydFdvcmtlcihjbSwgY20ub3B0aW9ucy53b3JrRGVsYXkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZpbmRzIHRoZSBsaW5lIHRvIHN0YXJ0IHdpdGggd2hlbiBzdGFydGluZyBhIHBhcnNlLiBUcmllcyB0b1xuICAvLyBmaW5kIGEgbGluZSB3aXRoIGEgc3RhdGVBZnRlciwgc28gdGhhdCBpdCBjYW4gc3RhcnQgd2l0aCBhXG4gIC8vIHZhbGlkIHN0YXRlLiBJZiB0aGF0IGZhaWxzLCBpdCByZXR1cm5zIHRoZSBsaW5lIHdpdGggdGhlXG4gIC8vIHNtYWxsZXN0IGluZGVudGF0aW9uLCB3aGljaCB0ZW5kcyB0byBuZWVkIHRoZSBsZWFzdCBjb250ZXh0IHRvXG4gIC8vIHBhcnNlIGNvcnJlY3RseS5cbiAgZnVuY3Rpb24gZmluZFN0YXJ0TGluZShjbSwgbiwgcHJlY2lzZSkge1xuICAgIHZhciBtaW5pbmRlbnQsIG1pbmxpbmUsIGRvYyA9IGNtLmRvYztcbiAgICB2YXIgbGltID0gcHJlY2lzZSA/IC0xIDogbiAtIChjbS5kb2MubW9kZS5pbm5lck1vZGUgPyAxMDAwIDogMTAwKTtcbiAgICBmb3IgKHZhciBzZWFyY2ggPSBuOyBzZWFyY2ggPiBsaW07IC0tc2VhcmNoKSB7XG4gICAgICBpZiAoc2VhcmNoIDw9IGRvYy5maXJzdCkgcmV0dXJuIGRvYy5maXJzdDtcbiAgICAgIHZhciBsaW5lID0gZ2V0TGluZShkb2MsIHNlYXJjaCAtIDEpO1xuICAgICAgaWYgKGxpbmUuc3RhdGVBZnRlciAmJiAoIXByZWNpc2UgfHwgc2VhcmNoIDw9IGRvYy5mcm9udGllcikpIHJldHVybiBzZWFyY2g7XG4gICAgICB2YXIgaW5kZW50ZWQgPSBjb3VudENvbHVtbihsaW5lLnRleHQsIG51bGwsIGNtLm9wdGlvbnMudGFiU2l6ZSk7XG4gICAgICBpZiAobWlubGluZSA9PSBudWxsIHx8IG1pbmluZGVudCA+IGluZGVudGVkKSB7XG4gICAgICAgIG1pbmxpbmUgPSBzZWFyY2ggLSAxO1xuICAgICAgICBtaW5pbmRlbnQgPSBpbmRlbnRlZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1pbmxpbmU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTdGF0ZUJlZm9yZShjbSwgbiwgcHJlY2lzZSkge1xuICAgIHZhciBkb2MgPSBjbS5kb2MsIGRpc3BsYXkgPSBjbS5kaXNwbGF5O1xuICAgIGlmICghZG9jLm1vZGUuc3RhcnRTdGF0ZSkgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBvcyA9IGZpbmRTdGFydExpbmUoY20sIG4sIHByZWNpc2UpLCBzdGF0ZSA9IHBvcyA+IGRvYy5maXJzdCAmJiBnZXRMaW5lKGRvYywgcG9zLTEpLnN0YXRlQWZ0ZXI7XG4gICAgaWYgKCFzdGF0ZSkgc3RhdGUgPSBzdGFydFN0YXRlKGRvYy5tb2RlKTtcbiAgICBlbHNlIHN0YXRlID0gY29weVN0YXRlKGRvYy5tb2RlLCBzdGF0ZSk7XG4gICAgZG9jLml0ZXIocG9zLCBuLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICBwcm9jZXNzTGluZShjbSwgbGluZS50ZXh0LCBzdGF0ZSk7XG4gICAgICB2YXIgc2F2ZSA9IHBvcyA9PSBuIC0gMSB8fCBwb3MgJSA1ID09IDAgfHwgcG9zID49IGRpc3BsYXkudmlld0Zyb20gJiYgcG9zIDwgZGlzcGxheS52aWV3VG87XG4gICAgICBsaW5lLnN0YXRlQWZ0ZXIgPSBzYXZlID8gY29weVN0YXRlKGRvYy5tb2RlLCBzdGF0ZSkgOiBudWxsO1xuICAgICAgKytwb3M7XG4gICAgfSk7XG4gICAgaWYgKHByZWNpc2UpIGRvYy5mcm9udGllciA9IHBvcztcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBQT1NJVElPTiBNRUFTVVJFTUVOVFxuXG4gIGZ1bmN0aW9uIHBhZGRpbmdUb3AoZGlzcGxheSkge3JldHVybiBkaXNwbGF5LmxpbmVTcGFjZS5vZmZzZXRUb3A7fVxuICBmdW5jdGlvbiBwYWRkaW5nVmVydChkaXNwbGF5KSB7cmV0dXJuIGRpc3BsYXkubW92ZXIub2Zmc2V0SGVpZ2h0IC0gZGlzcGxheS5saW5lU3BhY2Uub2Zmc2V0SGVpZ2h0O31cbiAgZnVuY3Rpb24gcGFkZGluZ0goZGlzcGxheSkge1xuICAgIGlmIChkaXNwbGF5LmNhY2hlZFBhZGRpbmdIKSByZXR1cm4gZGlzcGxheS5jYWNoZWRQYWRkaW5nSDtcbiAgICB2YXIgZSA9IHJlbW92ZUNoaWxkcmVuQW5kQWRkKGRpc3BsYXkubWVhc3VyZSwgZWx0KFwicHJlXCIsIFwieFwiKSk7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlKSA6IGUuY3VycmVudFN0eWxlO1xuICAgIHZhciBkYXRhID0ge2xlZnQ6IHBhcnNlSW50KHN0eWxlLnBhZGRpbmdMZWZ0KSwgcmlnaHQ6IHBhcnNlSW50KHN0eWxlLnBhZGRpbmdSaWdodCl9O1xuICAgIGlmICghaXNOYU4oZGF0YS5sZWZ0KSAmJiAhaXNOYU4oZGF0YS5yaWdodCkpIGRpc3BsYXkuY2FjaGVkUGFkZGluZ0ggPSBkYXRhO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBsaW5lVmlldy53cmFwcGluZy5oZWlnaHRzIGFycmF5IGlzIHBvcHVsYXRlZC4gVGhpcyBpc1xuICAvLyBhbiBhcnJheSBvZiBib3R0b20gb2Zmc2V0cyBmb3IgdGhlIGxpbmVzIHRoYXQgbWFrZSB1cCBhIGRyYXduXG4gIC8vIGxpbmUuIFdoZW4gbGluZVdyYXBwaW5nIGlzIG9uLCB0aGVyZSBtaWdodCBiZSBtb3JlIHRoYW4gb25lXG4gIC8vIGhlaWdodC5cbiAgZnVuY3Rpb24gZW5zdXJlTGluZUhlaWdodHMoY20sIGxpbmVWaWV3LCByZWN0KSB7XG4gICAgdmFyIHdyYXBwaW5nID0gY20ub3B0aW9ucy5saW5lV3JhcHBpbmc7XG4gICAgdmFyIGN1cldpZHRoID0gd3JhcHBpbmcgJiYgY20uZGlzcGxheS5zY3JvbGxlci5jbGllbnRXaWR0aDtcbiAgICBpZiAoIWxpbmVWaWV3Lm1lYXN1cmUuaGVpZ2h0cyB8fCB3cmFwcGluZyAmJiBsaW5lVmlldy5tZWFzdXJlLndpZHRoICE9IGN1cldpZHRoKSB7XG4gICAgICB2YXIgaGVpZ2h0cyA9IGxpbmVWaWV3Lm1lYXN1cmUuaGVpZ2h0cyA9IFtdO1xuICAgICAgaWYgKHdyYXBwaW5nKSB7XG4gICAgICAgIGxpbmVWaWV3Lm1lYXN1cmUud2lkdGggPSBjdXJXaWR0aDtcbiAgICAgICAgdmFyIHJlY3RzID0gbGluZVZpZXcudGV4dC5maXJzdENoaWxkLmdldENsaWVudFJlY3RzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVjdHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgdmFyIGN1ciA9IHJlY3RzW2ldLCBuZXh0ID0gcmVjdHNbaSArIDFdO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhjdXIuYm90dG9tIC0gbmV4dC5ib3R0b20pID4gMilcbiAgICAgICAgICAgIGhlaWdodHMucHVzaCgoY3VyLmJvdHRvbSArIG5leHQudG9wKSAvIDIgLSByZWN0LnRvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGhlaWdodHMucHVzaChyZWN0LmJvdHRvbSAtIHJlY3QudG9wKTtcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIGEgbGluZSBtYXAgKG1hcHBpbmcgY2hhcmFjdGVyIG9mZnNldHMgdG8gdGV4dCBub2RlcykgYW5kIGFcbiAgLy8gbWVhc3VyZW1lbnQgY2FjaGUgZm9yIHRoZSBnaXZlbiBsaW5lIG51bWJlci4gKEEgbGluZSB2aWV3IG1pZ2h0XG4gIC8vIGNvbnRhaW4gbXVsdGlwbGUgbGluZXMgd2hlbiBjb2xsYXBzZWQgcmFuZ2VzIGFyZSBwcmVzZW50LilcbiAgZnVuY3Rpb24gbWFwRnJvbUxpbmVWaWV3KGxpbmVWaWV3LCBsaW5lLCBsaW5lTikge1xuICAgIGlmIChsaW5lVmlldy5saW5lID09IGxpbmUpXG4gICAgICByZXR1cm4ge21hcDogbGluZVZpZXcubWVhc3VyZS5tYXAsIGNhY2hlOiBsaW5lVmlldy5tZWFzdXJlLmNhY2hlfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVWaWV3LnJlc3QubGVuZ3RoOyBpKyspXG4gICAgICBpZiAobGluZVZpZXcucmVzdFtpXSA9PSBsaW5lKVxuICAgICAgICByZXR1cm4ge21hcDogbGluZVZpZXcubWVhc3VyZS5tYXBzW2ldLCBjYWNoZTogbGluZVZpZXcubWVhc3VyZS5jYWNoZXNbaV19O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZVZpZXcucmVzdC5sZW5ndGg7IGkrKylcbiAgICAgIGlmIChsaW5lTm8obGluZVZpZXcucmVzdFtpXSkgPiBsaW5lTilcbiAgICAgICAgcmV0dXJuIHttYXA6IGxpbmVWaWV3Lm1lYXN1cmUubWFwc1tpXSwgY2FjaGU6IGxpbmVWaWV3Lm1lYXN1cmUuY2FjaGVzW2ldLCBiZWZvcmU6IHRydWV9O1xuICB9XG5cbiAgLy8gUmVuZGVyIGEgbGluZSBpbnRvIHRoZSBoaWRkZW4gbm9kZSBkaXNwbGF5LmV4dGVybmFsTWVhc3VyZWQuIFVzZWRcbiAgLy8gd2hlbiBtZWFzdXJlbWVudCBpcyBuZWVkZWQgZm9yIGEgbGluZSB0aGF0J3Mgbm90IGluIHRoZSB2aWV3cG9ydC5cbiAgZnVuY3Rpb24gdXBkYXRlRXh0ZXJuYWxNZWFzdXJlbWVudChjbSwgbGluZSkge1xuICAgIGxpbmUgPSB2aXN1YWxMaW5lKGxpbmUpO1xuICAgIHZhciBsaW5lTiA9IGxpbmVObyhsaW5lKTtcbiAgICB2YXIgdmlldyA9IGNtLmRpc3BsYXkuZXh0ZXJuYWxNZWFzdXJlZCA9IG5ldyBMaW5lVmlldyhjbS5kb2MsIGxpbmUsIGxpbmVOKTtcbiAgICB2aWV3LmxpbmVOID0gbGluZU47XG4gICAgdmFyIGJ1aWx0ID0gdmlldy5idWlsdCA9IGJ1aWxkTGluZUNvbnRlbnQoY20sIHZpZXcpO1xuICAgIHZpZXcudGV4dCA9IGJ1aWx0LnByZTtcbiAgICByZW1vdmVDaGlsZHJlbkFuZEFkZChjbS5kaXNwbGF5LmxpbmVNZWFzdXJlLCBidWlsdC5wcmUpO1xuICAgIHJldHVybiB2aWV3O1xuICB9XG5cbiAgLy8gR2V0IGEge3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodH0gYm94IChpbiBsaW5lLWxvY2FsIGNvb3JkaW5hdGVzKVxuICAvLyBmb3IgYSBnaXZlbiBjaGFyYWN0ZXIuXG4gIGZ1bmN0aW9uIG1lYXN1cmVDaGFyKGNtLCBsaW5lLCBjaCwgYmlhcykge1xuICAgIHJldHVybiBtZWFzdXJlQ2hhclByZXBhcmVkKGNtLCBwcmVwYXJlTWVhc3VyZUZvckxpbmUoY20sIGxpbmUpLCBjaCwgYmlhcyk7XG4gIH1cblxuICAvLyBGaW5kIGEgbGluZSB2aWV3IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGdpdmVuIGxpbmUgbnVtYmVyLlxuICBmdW5jdGlvbiBmaW5kVmlld0ZvckxpbmUoY20sIGxpbmVOKSB7XG4gICAgaWYgKGxpbmVOID49IGNtLmRpc3BsYXkudmlld0Zyb20gJiYgbGluZU4gPCBjbS5kaXNwbGF5LnZpZXdUbylcbiAgICAgIHJldHVybiBjbS5kaXNwbGF5LnZpZXdbZmluZFZpZXdJbmRleChjbSwgbGluZU4pXTtcbiAgICB2YXIgZXh0ID0gY20uZGlzcGxheS5leHRlcm5hbE1lYXN1cmVkO1xuICAgIGlmIChleHQgJiYgbGluZU4gPj0gZXh0LmxpbmVOICYmIGxpbmVOIDwgZXh0LmxpbmVOICsgZXh0LnNpemUpXG4gICAgICByZXR1cm4gZXh0O1xuICB9XG5cbiAgLy8gTWVhc3VyZW1lbnQgY2FuIGJlIHNwbGl0IGluIHR3byBzdGVwcywgdGhlIHNldC11cCB3b3JrIHRoYXRcbiAgLy8gYXBwbGllcyB0byB0aGUgd2hvbGUgbGluZSwgYW5kIHRoZSBtZWFzdXJlbWVudCBvZiB0aGUgYWN0dWFsXG4gIC8vIGNoYXJhY3Rlci4gRnVuY3Rpb25zIGxpa2UgY29vcmRzQ2hhciwgdGhhdCBuZWVkIHRvIGRvIGEgbG90IG9mXG4gIC8vIG1lYXN1cmVtZW50cyBpbiBhIHJvdywgY2FuIHRodXMgZW5zdXJlIHRoYXQgdGhlIHNldC11cCB3b3JrIGlzXG4gIC8vIG9ubHkgZG9uZSBvbmNlLlxuICBmdW5jdGlvbiBwcmVwYXJlTWVhc3VyZUZvckxpbmUoY20sIGxpbmUpIHtcbiAgICB2YXIgbGluZU4gPSBsaW5lTm8obGluZSk7XG4gICAgdmFyIHZpZXcgPSBmaW5kVmlld0ZvckxpbmUoY20sIGxpbmVOKTtcbiAgICBpZiAodmlldyAmJiAhdmlldy50ZXh0KVxuICAgICAgdmlldyA9IG51bGw7XG4gICAgZWxzZSBpZiAodmlldyAmJiB2aWV3LmNoYW5nZXMpXG4gICAgICB1cGRhdGVMaW5lRm9yQ2hhbmdlcyhjbSwgdmlldywgbGluZU4sIGdldERpbWVuc2lvbnMoY20pKTtcbiAgICBpZiAoIXZpZXcpXG4gICAgICB2aWV3ID0gdXBkYXRlRXh0ZXJuYWxNZWFzdXJlbWVudChjbSwgbGluZSk7XG5cbiAgICB2YXIgaW5mbyA9IG1hcEZyb21MaW5lVmlldyh2aWV3LCBsaW5lLCBsaW5lTik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IGxpbmUsIHZpZXc6IHZpZXcsIHJlY3Q6IG51bGwsXG4gICAgICBtYXA6IGluZm8ubWFwLCBjYWNoZTogaW5mby5jYWNoZSwgYmVmb3JlOiBpbmZvLmJlZm9yZSxcbiAgICAgIGhhc0hlaWdodHM6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIC8vIEdpdmVuIGEgcHJlcGFyZWQgbWVhc3VyZW1lbnQgb2JqZWN0LCBtZWFzdXJlcyB0aGUgcG9zaXRpb24gb2YgYW5cbiAgLy8gYWN0dWFsIGNoYXJhY3RlciAob3IgZmV0Y2hlcyBpdCBmcm9tIHRoZSBjYWNoZSkuXG4gIGZ1bmN0aW9uIG1lYXN1cmVDaGFyUHJlcGFyZWQoY20sIHByZXBhcmVkLCBjaCwgYmlhcykge1xuICAgIGlmIChwcmVwYXJlZC5iZWZvcmUpIGNoID0gLTE7XG4gICAgdmFyIGtleSA9IGNoICsgKGJpYXMgfHwgXCJcIiksIGZvdW5kO1xuICAgIGlmIChwcmVwYXJlZC5jYWNoZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBmb3VuZCA9IHByZXBhcmVkLmNhY2hlW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcHJlcGFyZWQucmVjdClcbiAgICAgICAgcHJlcGFyZWQucmVjdCA9IHByZXBhcmVkLnZpZXcudGV4dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGlmICghcHJlcGFyZWQuaGFzSGVpZ2h0cykge1xuICAgICAgICBlbnN1cmVMaW5lSGVpZ2h0cyhjbSwgcHJlcGFyZWQudmlldywgcHJlcGFyZWQucmVjdCk7XG4gICAgICAgIHByZXBhcmVkLmhhc0hlaWdodHMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZm91bmQgPSBtZWFzdXJlQ2hhcklubmVyKGNtLCBwcmVwYXJlZCwgY2gsIGJpYXMpO1xuICAgICAgaWYgKCFmb3VuZC5ib2d1cykgcHJlcGFyZWQuY2FjaGVba2V5XSA9IGZvdW5kO1xuICAgIH1cbiAgICByZXR1cm4ge2xlZnQ6IGZvdW5kLmxlZnQsIHJpZ2h0OiBmb3VuZC5yaWdodCwgdG9wOiBmb3VuZC50b3AsIGJvdHRvbTogZm91bmQuYm90dG9tfTtcbiAgfVxuXG4gIHZhciBudWxsUmVjdCA9IHtsZWZ0OiAwLCByaWdodDogMCwgdG9wOiAwLCBib3R0b206IDB9O1xuXG4gIGZ1bmN0aW9uIG1lYXN1cmVDaGFySW5uZXIoY20sIHByZXBhcmVkLCBjaCwgYmlhcykge1xuICAgIHZhciBtYXAgPSBwcmVwYXJlZC5tYXA7XG5cbiAgICB2YXIgbm9kZSwgc3RhcnQsIGVuZCwgY29sbGFwc2U7XG4gICAgLy8gRmlyc3QsIHNlYXJjaCB0aGUgbGluZSBtYXAgZm9yIHRoZSB0ZXh0IG5vZGUgY29ycmVzcG9uZGluZyB0byxcbiAgICAvLyBvciBjbG9zZXN0IHRvLCB0aGUgdGFyZ2V0IGNoYXJhY3Rlci5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgdmFyIG1TdGFydCA9IG1hcFtpXSwgbUVuZCA9IG1hcFtpICsgMV07XG4gICAgICBpZiAoY2ggPCBtU3RhcnQpIHtcbiAgICAgICAgc3RhcnQgPSAwOyBlbmQgPSAxO1xuICAgICAgICBjb2xsYXBzZSA9IFwibGVmdFwiO1xuICAgICAgfSBlbHNlIGlmIChjaCA8IG1FbmQpIHtcbiAgICAgICAgc3RhcnQgPSBjaCAtIG1TdGFydDtcbiAgICAgICAgZW5kID0gc3RhcnQgKyAxO1xuICAgICAgfSBlbHNlIGlmIChpID09IG1hcC5sZW5ndGggLSAzIHx8IGNoID09IG1FbmQgJiYgbWFwW2kgKyAzXSA+IGNoKSB7XG4gICAgICAgIGVuZCA9IG1FbmQgLSBtU3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gZW5kIC0gMTtcbiAgICAgICAgaWYgKGNoID49IG1FbmQpIGNvbGxhcHNlID0gXCJyaWdodFwiO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgbm9kZSA9IG1hcFtpICsgMl07XG4gICAgICAgIGlmIChtU3RhcnQgPT0gbUVuZCAmJiBiaWFzID09IChub2RlLmluc2VydExlZnQgPyBcImxlZnRcIiA6IFwicmlnaHRcIikpXG4gICAgICAgICAgY29sbGFwc2UgPSBiaWFzO1xuICAgICAgICBpZiAoYmlhcyA9PSBcImxlZnRcIiAmJiBzdGFydCA9PSAwKVxuICAgICAgICAgIHdoaWxlIChpICYmIG1hcFtpIC0gMl0gPT0gbWFwW2kgLSAzXSAmJiBtYXBbaSAtIDFdLmluc2VydExlZnQpIHtcbiAgICAgICAgICAgIG5vZGUgPSBtYXBbKGkgLT0gMykgKyAyXTtcbiAgICAgICAgICAgIGNvbGxhcHNlID0gXCJsZWZ0XCI7XG4gICAgICAgICAgfVxuICAgICAgICBpZiAoYmlhcyA9PSBcInJpZ2h0XCIgJiYgc3RhcnQgPT0gbUVuZCAtIG1TdGFydClcbiAgICAgICAgICB3aGlsZSAoaSA8IG1hcC5sZW5ndGggLSAzICYmIG1hcFtpICsgM10gPT0gbWFwW2kgKyA0XSAmJiAhbWFwW2kgKyA1XS5pbnNlcnRMZWZ0KSB7XG4gICAgICAgICAgICBub2RlID0gbWFwWyhpICs9IDMpICsgMl07XG4gICAgICAgICAgICBjb2xsYXBzZSA9IFwicmlnaHRcIjtcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZWN0O1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09IDMpIHsgLy8gSWYgaXQgaXMgYSB0ZXh0IG5vZGUsIHVzZSBhIHJhbmdlIHRvIHJldHJpZXZlIHRoZSBjb29yZGluYXRlcy5cbiAgICAgIHdoaWxlIChzdGFydCAmJiBpc0V4dGVuZGluZ0NoYXIocHJlcGFyZWQubGluZS50ZXh0LmNoYXJBdChtU3RhcnQgKyBzdGFydCkpKSAtLXN0YXJ0O1xuICAgICAgd2hpbGUgKG1TdGFydCArIGVuZCA8IG1FbmQgJiYgaXNFeHRlbmRpbmdDaGFyKHByZXBhcmVkLmxpbmUudGV4dC5jaGFyQXQobVN0YXJ0ICsgZW5kKSkpICsrZW5kO1xuICAgICAgaWYgKGllX3VwdG84ICYmIHN0YXJ0ID09IDAgJiYgZW5kID09IG1FbmQgLSBtU3RhcnQpIHtcbiAgICAgICAgcmVjdCA9IG5vZGUucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAoaWUgJiYgY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpIHtcbiAgICAgICAgdmFyIHJlY3RzID0gcmFuZ2Uobm9kZSwgc3RhcnQsIGVuZCkuZ2V0Q2xpZW50UmVjdHMoKTtcbiAgICAgICAgaWYgKHJlY3RzLmxlbmd0aClcbiAgICAgICAgICByZWN0ID0gcmVjdHNbYmlhcyA9PSBcInJpZ2h0XCIgPyByZWN0cy5sZW5ndGggLSAxIDogMF07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWN0ID0gbnVsbFJlY3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWN0ID0gcmFuZ2Uobm9kZSwgc3RhcnQsIGVuZCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgfHwgbnVsbFJlY3Q7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gSWYgaXQgaXMgYSB3aWRnZXQsIHNpbXBseSBnZXQgdGhlIGJveCBmb3IgdGhlIHdob2xlIHdpZGdldC5cbiAgICAgIGlmIChzdGFydCA+IDApIGNvbGxhcHNlID0gYmlhcyA9IFwicmlnaHRcIjtcbiAgICAgIHZhciByZWN0cztcbiAgICAgIGlmIChjbS5vcHRpb25zLmxpbmVXcmFwcGluZyAmJiAocmVjdHMgPSBub2RlLmdldENsaWVudFJlY3RzKCkpLmxlbmd0aCA+IDEpXG4gICAgICAgIHJlY3QgPSByZWN0c1tiaWFzID09IFwicmlnaHRcIiA/IHJlY3RzLmxlbmd0aCAtIDEgOiAwXTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfVxuICAgIGlmIChpZV91cHRvOCAmJiAhc3RhcnQgJiYgKCFyZWN0IHx8ICFyZWN0LmxlZnQgJiYgIXJlY3QucmlnaHQpKSB7XG4gICAgICB2YXIgclNwYW4gPSBub2RlLnBhcmVudE5vZGUuZ2V0Q2xpZW50UmVjdHMoKVswXTtcbiAgICAgIGlmIChyU3BhbilcbiAgICAgICAgcmVjdCA9IHtsZWZ0OiByU3Bhbi5sZWZ0LCByaWdodDogclNwYW4ubGVmdCArIGNoYXJXaWR0aChjbS5kaXNwbGF5KSwgdG9wOiByU3Bhbi50b3AsIGJvdHRvbTogclNwYW4uYm90dG9tfTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmVjdCA9IG51bGxSZWN0O1xuICAgIH1cblxuICAgIHZhciB0b3AsIGJvdCA9IChyZWN0LmJvdHRvbSArIHJlY3QudG9wKSAvIDIgLSBwcmVwYXJlZC5yZWN0LnRvcDtcbiAgICB2YXIgaGVpZ2h0cyA9IHByZXBhcmVkLnZpZXcubWVhc3VyZS5oZWlnaHRzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0cy5sZW5ndGggLSAxOyBpKyspXG4gICAgICBpZiAoYm90IDwgaGVpZ2h0c1tpXSkgYnJlYWs7XG4gICAgdG9wID0gaSA/IGhlaWdodHNbaSAtIDFdIDogMDsgYm90ID0gaGVpZ2h0c1tpXTtcbiAgICB2YXIgcmVzdWx0ID0ge2xlZnQ6IChjb2xsYXBzZSA9PSBcInJpZ2h0XCIgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0KSAtIHByZXBhcmVkLnJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgIHJpZ2h0OiAoY29sbGFwc2UgPT0gXCJsZWZ0XCIgPyByZWN0LmxlZnQgOiByZWN0LnJpZ2h0KSAtIHByZXBhcmVkLnJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgIHRvcDogdG9wLCBib3R0b206IGJvdH07XG4gICAgaWYgKCFyZWN0LmxlZnQgJiYgIXJlY3QucmlnaHQpIHJlc3VsdC5ib2d1cyA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyTGluZU1lYXN1cmVtZW50Q2FjaGVGb3IobGluZVZpZXcpIHtcbiAgICBpZiAobGluZVZpZXcubWVhc3VyZSkge1xuICAgICAgbGluZVZpZXcubWVhc3VyZS5jYWNoZSA9IHt9O1xuICAgICAgbGluZVZpZXcubWVhc3VyZS5oZWlnaHRzID0gbnVsbDtcbiAgICAgIGlmIChsaW5lVmlldy5yZXN0KSBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVWaWV3LnJlc3QubGVuZ3RoOyBpKyspXG4gICAgICAgIGxpbmVWaWV3Lm1lYXN1cmUuY2FjaGVzW2ldID0ge307XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJMaW5lTWVhc3VyZW1lbnRDYWNoZShjbSkge1xuICAgIGNtLmRpc3BsYXkuZXh0ZXJuYWxNZWFzdXJlID0gbnVsbDtcbiAgICByZW1vdmVDaGlsZHJlbihjbS5kaXNwbGF5LmxpbmVNZWFzdXJlKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNtLmRpc3BsYXkudmlldy5sZW5ndGg7IGkrKylcbiAgICAgIGNsZWFyTGluZU1lYXN1cmVtZW50Q2FjaGVGb3IoY20uZGlzcGxheS52aWV3W2ldKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyQ2FjaGVzKGNtKSB7XG4gICAgY2xlYXJMaW5lTWVhc3VyZW1lbnRDYWNoZShjbSk7XG4gICAgY20uZGlzcGxheS5jYWNoZWRDaGFyV2lkdGggPSBjbS5kaXNwbGF5LmNhY2hlZFRleHRIZWlnaHQgPSBjbS5kaXNwbGF5LmNhY2hlZFBhZGRpbmdIID0gbnVsbDtcbiAgICBpZiAoIWNtLm9wdGlvbnMubGluZVdyYXBwaW5nKSBjbS5kaXNwbGF5Lm1heExpbmVDaGFuZ2VkID0gdHJ1ZTtcbiAgICBjbS5kaXNwbGF5LmxpbmVOdW1DaGFycyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBwYWdlU2Nyb2xsWCgpIHsgcmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fCAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkpLnNjcm9sbExlZnQ7IH1cbiAgZnVuY3Rpb24gcGFnZVNjcm9sbFkoKSB7IHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5KS5zY3JvbGxUb3A7IH1cblxuICAvLyBDb252ZXJ0cyBhIHt0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHR9IGJveCBmcm9tIGxpbmUtbG9jYWxcbiAgLy8gY29vcmRpbmF0ZXMgaW50byBhbm90aGVyIGNvb3JkaW5hdGUgc3lzdGVtLiBDb250ZXh0IG1heSBiZSBvbmUgb2ZcbiAgLy8gXCJsaW5lXCIsIFwiZGl2XCIgKGRpc3BsYXkubGluZURpdiksIFwibG9jYWxcIi9udWxsIChlZGl0b3IpLCBvciBcInBhZ2VcIi5cbiAgZnVuY3Rpb24gaW50b0Nvb3JkU3lzdGVtKGNtLCBsaW5lT2JqLCByZWN0LCBjb250ZXh0KSB7XG4gICAgaWYgKGxpbmVPYmoud2lkZ2V0cykgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lT2JqLndpZGdldHMubGVuZ3RoOyArK2kpIGlmIChsaW5lT2JqLndpZGdldHNbaV0uYWJvdmUpIHtcbiAgICAgIHZhciBzaXplID0gd2lkZ2V0SGVpZ2h0KGxpbmVPYmoud2lkZ2V0c1tpXSk7XG4gICAgICByZWN0LnRvcCArPSBzaXplOyByZWN0LmJvdHRvbSArPSBzaXplO1xuICAgIH1cbiAgICBpZiAoY29udGV4dCA9PSBcImxpbmVcIikgcmV0dXJuIHJlY3Q7XG4gICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gXCJsb2NhbFwiO1xuICAgIHZhciB5T2ZmID0gaGVpZ2h0QXRMaW5lKGxpbmVPYmopO1xuICAgIGlmIChjb250ZXh0ID09IFwibG9jYWxcIikgeU9mZiArPSBwYWRkaW5nVG9wKGNtLmRpc3BsYXkpO1xuICAgIGVsc2UgeU9mZiAtPSBjbS5kaXNwbGF5LnZpZXdPZmZzZXQ7XG4gICAgaWYgKGNvbnRleHQgPT0gXCJwYWdlXCIgfHwgY29udGV4dCA9PSBcIndpbmRvd1wiKSB7XG4gICAgICB2YXIgbE9mZiA9IGNtLmRpc3BsYXkubGluZVNwYWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgeU9mZiArPSBsT2ZmLnRvcCArIChjb250ZXh0ID09IFwid2luZG93XCIgPyAwIDogcGFnZVNjcm9sbFkoKSk7XG4gICAgICB2YXIgeE9mZiA9IGxPZmYubGVmdCArIChjb250ZXh0ID09IFwid2luZG93XCIgPyAwIDogcGFnZVNjcm9sbFgoKSk7XG4gICAgICByZWN0LmxlZnQgKz0geE9mZjsgcmVjdC5yaWdodCArPSB4T2ZmO1xuICAgIH1cbiAgICByZWN0LnRvcCArPSB5T2ZmOyByZWN0LmJvdHRvbSArPSB5T2ZmO1xuICAgIHJldHVybiByZWN0O1xuICB9XG5cbiAgLy8gQ292ZXJ0cyBhIGJveCBmcm9tIFwiZGl2XCIgY29vcmRzIHRvIGFub3RoZXIgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vIENvbnRleHQgbWF5IGJlIFwid2luZG93XCIsIFwicGFnZVwiLCBcImRpdlwiLCBvciBcImxvY2FsXCIvbnVsbC5cbiAgZnVuY3Rpb24gZnJvbUNvb3JkU3lzdGVtKGNtLCBjb29yZHMsIGNvbnRleHQpIHtcbiAgICBpZiAoY29udGV4dCA9PSBcImRpdlwiKSByZXR1cm4gY29vcmRzO1xuICAgIHZhciBsZWZ0ID0gY29vcmRzLmxlZnQsIHRvcCA9IGNvb3Jkcy50b3A7XG4gICAgLy8gRmlyc3QgbW92ZSBpbnRvIFwicGFnZVwiIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgaWYgKGNvbnRleHQgPT0gXCJwYWdlXCIpIHtcbiAgICAgIGxlZnQgLT0gcGFnZVNjcm9sbFgoKTtcbiAgICAgIHRvcCAtPSBwYWdlU2Nyb2xsWSgpO1xuICAgIH0gZWxzZSBpZiAoY29udGV4dCA9PSBcImxvY2FsXCIgfHwgIWNvbnRleHQpIHtcbiAgICAgIHZhciBsb2NhbEJveCA9IGNtLmRpc3BsYXkuc2l6ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZWZ0ICs9IGxvY2FsQm94LmxlZnQ7XG4gICAgICB0b3AgKz0gbG9jYWxCb3gudG9wO1xuICAgIH1cblxuICAgIHZhciBsaW5lU3BhY2VCb3ggPSBjbS5kaXNwbGF5LmxpbmVTcGFjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge2xlZnQ6IGxlZnQgLSBsaW5lU3BhY2VCb3gubGVmdCwgdG9wOiB0b3AgLSBsaW5lU3BhY2VCb3gudG9wfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoYXJDb29yZHMoY20sIHBvcywgY29udGV4dCwgbGluZU9iaiwgYmlhcykge1xuICAgIGlmICghbGluZU9iaikgbGluZU9iaiA9IGdldExpbmUoY20uZG9jLCBwb3MubGluZSk7XG4gICAgcmV0dXJuIGludG9Db29yZFN5c3RlbShjbSwgbGluZU9iaiwgbWVhc3VyZUNoYXIoY20sIGxpbmVPYmosIHBvcy5jaCwgYmlhcyksIGNvbnRleHQpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIGJveCBmb3IgYSBnaXZlbiBjdXJzb3IgcG9zaXRpb24sIHdoaWNoIG1heSBoYXZlIGFuXG4gIC8vICdvdGhlcicgcHJvcGVydHkgY29udGFpbmluZyB0aGUgcG9zaXRpb24gb2YgdGhlIHNlY29uZGFyeSBjdXJzb3JcbiAgLy8gb24gYSBiaWRpIGJvdW5kYXJ5LlxuICBmdW5jdGlvbiBjdXJzb3JDb29yZHMoY20sIHBvcywgY29udGV4dCwgbGluZU9iaiwgcHJlcGFyZWRNZWFzdXJlKSB7XG4gICAgbGluZU9iaiA9IGxpbmVPYmogfHwgZ2V0TGluZShjbS5kb2MsIHBvcy5saW5lKTtcbiAgICBpZiAoIXByZXBhcmVkTWVhc3VyZSkgcHJlcGFyZWRNZWFzdXJlID0gcHJlcGFyZU1lYXN1cmVGb3JMaW5lKGNtLCBsaW5lT2JqKTtcbiAgICBmdW5jdGlvbiBnZXQoY2gsIHJpZ2h0KSB7XG4gICAgICB2YXIgbSA9IG1lYXN1cmVDaGFyUHJlcGFyZWQoY20sIHByZXBhcmVkTWVhc3VyZSwgY2gsIHJpZ2h0ID8gXCJyaWdodFwiIDogXCJsZWZ0XCIpO1xuICAgICAgaWYgKHJpZ2h0KSBtLmxlZnQgPSBtLnJpZ2h0OyBlbHNlIG0ucmlnaHQgPSBtLmxlZnQ7XG4gICAgICByZXR1cm4gaW50b0Nvb3JkU3lzdGVtKGNtLCBsaW5lT2JqLCBtLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0QmlkaShjaCwgcGFydFBvcykge1xuICAgICAgdmFyIHBhcnQgPSBvcmRlcltwYXJ0UG9zXSwgcmlnaHQgPSBwYXJ0LmxldmVsICUgMjtcbiAgICAgIGlmIChjaCA9PSBiaWRpTGVmdChwYXJ0KSAmJiBwYXJ0UG9zICYmIHBhcnQubGV2ZWwgPCBvcmRlcltwYXJ0UG9zIC0gMV0ubGV2ZWwpIHtcbiAgICAgICAgcGFydCA9IG9yZGVyWy0tcGFydFBvc107XG4gICAgICAgIGNoID0gYmlkaVJpZ2h0KHBhcnQpIC0gKHBhcnQubGV2ZWwgJSAyID8gMCA6IDEpO1xuICAgICAgICByaWdodCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGNoID09IGJpZGlSaWdodChwYXJ0KSAmJiBwYXJ0UG9zIDwgb3JkZXIubGVuZ3RoIC0gMSAmJiBwYXJ0LmxldmVsIDwgb3JkZXJbcGFydFBvcyArIDFdLmxldmVsKSB7XG4gICAgICAgIHBhcnQgPSBvcmRlclsrK3BhcnRQb3NdO1xuICAgICAgICBjaCA9IGJpZGlMZWZ0KHBhcnQpIC0gcGFydC5sZXZlbCAlIDI7XG4gICAgICAgIHJpZ2h0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAocmlnaHQgJiYgY2ggPT0gcGFydC50byAmJiBjaCA+IHBhcnQuZnJvbSkgcmV0dXJuIGdldChjaCAtIDEpO1xuICAgICAgcmV0dXJuIGdldChjaCwgcmlnaHQpO1xuICAgIH1cbiAgICB2YXIgb3JkZXIgPSBnZXRPcmRlcihsaW5lT2JqKSwgY2ggPSBwb3MuY2g7XG4gICAgaWYgKCFvcmRlcikgcmV0dXJuIGdldChjaCk7XG4gICAgdmFyIHBhcnRQb3MgPSBnZXRCaWRpUGFydEF0KG9yZGVyLCBjaCk7XG4gICAgdmFyIHZhbCA9IGdldEJpZGkoY2gsIHBhcnRQb3MpO1xuICAgIGlmIChiaWRpT3RoZXIgIT0gbnVsbCkgdmFsLm90aGVyID0gZ2V0QmlkaShjaCwgYmlkaU90aGVyKTtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgLy8gVXNlZCB0byBjaGVhcGx5IGVzdGltYXRlIHRoZSBjb29yZGluYXRlcyBmb3IgYSBwb3NpdGlvbi4gVXNlZCBmb3JcbiAgLy8gaW50ZXJtZWRpYXRlIHNjcm9sbCB1cGRhdGVzLlxuICBmdW5jdGlvbiBlc3RpbWF0ZUNvb3JkcyhjbSwgcG9zKSB7XG4gICAgdmFyIGxlZnQgPSAwLCBwb3MgPSBjbGlwUG9zKGNtLmRvYywgcG9zKTtcbiAgICBpZiAoIWNtLm9wdGlvbnMubGluZVdyYXBwaW5nKSBsZWZ0ID0gY2hhcldpZHRoKGNtLmRpc3BsYXkpICogcG9zLmNoO1xuICAgIHZhciBsaW5lT2JqID0gZ2V0TGluZShjbS5kb2MsIHBvcy5saW5lKTtcbiAgICB2YXIgdG9wID0gaGVpZ2h0QXRMaW5lKGxpbmVPYmopICsgcGFkZGluZ1RvcChjbS5kaXNwbGF5KTtcbiAgICByZXR1cm4ge2xlZnQ6IGxlZnQsIHJpZ2h0OiBsZWZ0LCB0b3A6IHRvcCwgYm90dG9tOiB0b3AgKyBsaW5lT2JqLmhlaWdodH07XG4gIH1cblxuICAvLyBQb3NpdGlvbnMgcmV0dXJuZWQgYnkgY29vcmRzQ2hhciBjb250YWluIHNvbWUgZXh0cmEgaW5mb3JtYXRpb24uXG4gIC8vIHhSZWwgaXMgdGhlIHJlbGF0aXZlIHggcG9zaXRpb24gb2YgdGhlIGlucHV0IGNvb3JkaW5hdGVzIGNvbXBhcmVkXG4gIC8vIHRvIHRoZSBmb3VuZCBwb3NpdGlvbiAoc28geFJlbCA+IDAgbWVhbnMgdGhlIGNvb3JkaW5hdGVzIGFyZSB0b1xuICAvLyB0aGUgcmlnaHQgb2YgdGhlIGNoYXJhY3RlciBwb3NpdGlvbiwgZm9yIGV4YW1wbGUpLiBXaGVuIG91dHNpZGVcbiAgLy8gaXMgdHJ1ZSwgdGhhdCBtZWFucyB0aGUgY29vcmRpbmF0ZXMgbGllIG91dHNpZGUgdGhlIGxpbmUnc1xuICAvLyB2ZXJ0aWNhbCByYW5nZS5cbiAgZnVuY3Rpb24gUG9zV2l0aEluZm8obGluZSwgY2gsIG91dHNpZGUsIHhSZWwpIHtcbiAgICB2YXIgcG9zID0gUG9zKGxpbmUsIGNoKTtcbiAgICBwb3MueFJlbCA9IHhSZWw7XG4gICAgaWYgKG91dHNpZGUpIHBvcy5vdXRzaWRlID0gdHJ1ZTtcbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUgY2hhcmFjdGVyIHBvc2l0aW9uIGNsb3Nlc3QgdG8gdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxuICAvLyBJbnB1dCBtdXN0IGJlIGxpbmVTcGFjZS1sb2NhbCAoXCJkaXZcIiBjb29yZGluYXRlIHN5c3RlbSkuXG4gIGZ1bmN0aW9uIGNvb3Jkc0NoYXIoY20sIHgsIHkpIHtcbiAgICB2YXIgZG9jID0gY20uZG9jO1xuICAgIHkgKz0gY20uZGlzcGxheS52aWV3T2Zmc2V0O1xuICAgIGlmICh5IDwgMCkgcmV0dXJuIFBvc1dpdGhJbmZvKGRvYy5maXJzdCwgMCwgdHJ1ZSwgLTEpO1xuICAgIHZhciBsaW5lTiA9IGxpbmVBdEhlaWdodChkb2MsIHkpLCBsYXN0ID0gZG9jLmZpcnN0ICsgZG9jLnNpemUgLSAxO1xuICAgIGlmIChsaW5lTiA+IGxhc3QpXG4gICAgICByZXR1cm4gUG9zV2l0aEluZm8oZG9jLmZpcnN0ICsgZG9jLnNpemUgLSAxLCBnZXRMaW5lKGRvYywgbGFzdCkudGV4dC5sZW5ndGgsIHRydWUsIDEpO1xuICAgIGlmICh4IDwgMCkgeCA9IDA7XG5cbiAgICB2YXIgbGluZU9iaiA9IGdldExpbmUoZG9jLCBsaW5lTik7XG4gICAgZm9yICg7Oykge1xuICAgICAgdmFyIGZvdW5kID0gY29vcmRzQ2hhcklubmVyKGNtLCBsaW5lT2JqLCBsaW5lTiwgeCwgeSk7XG4gICAgICB2YXIgbWVyZ2VkID0gY29sbGFwc2VkU3BhbkF0RW5kKGxpbmVPYmopO1xuICAgICAgdmFyIG1lcmdlZFBvcyA9IG1lcmdlZCAmJiBtZXJnZWQuZmluZCgwLCB0cnVlKTtcbiAgICAgIGlmIChtZXJnZWQgJiYgKGZvdW5kLmNoID4gbWVyZ2VkUG9zLmZyb20uY2ggfHwgZm91bmQuY2ggPT0gbWVyZ2VkUG9zLmZyb20uY2ggJiYgZm91bmQueFJlbCA+IDApKVxuICAgICAgICBsaW5lTiA9IGxpbmVObyhsaW5lT2JqID0gbWVyZ2VkUG9zLnRvLmxpbmUpO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29vcmRzQ2hhcklubmVyKGNtLCBsaW5lT2JqLCBsaW5lTm8sIHgsIHkpIHtcbiAgICB2YXIgaW5uZXJPZmYgPSB5IC0gaGVpZ2h0QXRMaW5lKGxpbmVPYmopO1xuICAgIHZhciB3cm9uZ0xpbmUgPSBmYWxzZSwgYWRqdXN0ID0gMiAqIGNtLmRpc3BsYXkud3JhcHBlci5jbGllbnRXaWR0aDtcbiAgICB2YXIgcHJlcGFyZWRNZWFzdXJlID0gcHJlcGFyZU1lYXN1cmVGb3JMaW5lKGNtLCBsaW5lT2JqKTtcblxuICAgIGZ1bmN0aW9uIGdldFgoY2gpIHtcbiAgICAgIHZhciBzcCA9IGN1cnNvckNvb3JkcyhjbSwgUG9zKGxpbmVObywgY2gpLCBcImxpbmVcIiwgbGluZU9iaiwgcHJlcGFyZWRNZWFzdXJlKTtcbiAgICAgIHdyb25nTGluZSA9IHRydWU7XG4gICAgICBpZiAoaW5uZXJPZmYgPiBzcC5ib3R0b20pIHJldHVybiBzcC5sZWZ0IC0gYWRqdXN0O1xuICAgICAgZWxzZSBpZiAoaW5uZXJPZmYgPCBzcC50b3ApIHJldHVybiBzcC5sZWZ0ICsgYWRqdXN0O1xuICAgICAgZWxzZSB3cm9uZ0xpbmUgPSBmYWxzZTtcbiAgICAgIHJldHVybiBzcC5sZWZ0O1xuICAgIH1cblxuICAgIHZhciBiaWRpID0gZ2V0T3JkZXIobGluZU9iaiksIGRpc3QgPSBsaW5lT2JqLnRleHQubGVuZ3RoO1xuICAgIHZhciBmcm9tID0gbGluZUxlZnQobGluZU9iaiksIHRvID0gbGluZVJpZ2h0KGxpbmVPYmopO1xuICAgIHZhciBmcm9tWCA9IGdldFgoZnJvbSksIGZyb21PdXRzaWRlID0gd3JvbmdMaW5lLCB0b1ggPSBnZXRYKHRvKSwgdG9PdXRzaWRlID0gd3JvbmdMaW5lO1xuXG4gICAgaWYgKHggPiB0b1gpIHJldHVybiBQb3NXaXRoSW5mbyhsaW5lTm8sIHRvLCB0b091dHNpZGUsIDEpO1xuICAgIC8vIERvIGEgYmluYXJ5IHNlYXJjaCBiZXR3ZWVuIHRoZXNlIGJvdW5kcy5cbiAgICBmb3IgKDs7KSB7XG4gICAgICBpZiAoYmlkaSA/IHRvID09IGZyb20gfHwgdG8gPT0gbW92ZVZpc3VhbGx5KGxpbmVPYmosIGZyb20sIDEpIDogdG8gLSBmcm9tIDw9IDEpIHtcbiAgICAgICAgdmFyIGNoID0geCA8IGZyb21YIHx8IHggLSBmcm9tWCA8PSB0b1ggLSB4ID8gZnJvbSA6IHRvO1xuICAgICAgICB2YXIgeERpZmYgPSB4IC0gKGNoID09IGZyb20gPyBmcm9tWCA6IHRvWCk7XG4gICAgICAgIHdoaWxlIChpc0V4dGVuZGluZ0NoYXIobGluZU9iai50ZXh0LmNoYXJBdChjaCkpKSArK2NoO1xuICAgICAgICB2YXIgcG9zID0gUG9zV2l0aEluZm8obGluZU5vLCBjaCwgY2ggPT0gZnJvbSA/IGZyb21PdXRzaWRlIDogdG9PdXRzaWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeERpZmYgPCAtMSA/IC0xIDogeERpZmYgPiAxID8gMSA6IDApO1xuICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgfVxuICAgICAgdmFyIHN0ZXAgPSBNYXRoLmNlaWwoZGlzdCAvIDIpLCBtaWRkbGUgPSBmcm9tICsgc3RlcDtcbiAgICAgIGlmIChiaWRpKSB7XG4gICAgICAgIG1pZGRsZSA9IGZyb207XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgKytpKSBtaWRkbGUgPSBtb3ZlVmlzdWFsbHkobGluZU9iaiwgbWlkZGxlLCAxKTtcbiAgICAgIH1cbiAgICAgIHZhciBtaWRkbGVYID0gZ2V0WChtaWRkbGUpO1xuICAgICAgaWYgKG1pZGRsZVggPiB4KSB7dG8gPSBtaWRkbGU7IHRvWCA9IG1pZGRsZVg7IGlmICh0b091dHNpZGUgPSB3cm9uZ0xpbmUpIHRvWCArPSAxMDAwOyBkaXN0ID0gc3RlcDt9XG4gICAgICBlbHNlIHtmcm9tID0gbWlkZGxlOyBmcm9tWCA9IG1pZGRsZVg7IGZyb21PdXRzaWRlID0gd3JvbmdMaW5lOyBkaXN0IC09IHN0ZXA7fVxuICAgIH1cbiAgfVxuXG4gIHZhciBtZWFzdXJlVGV4dDtcbiAgLy8gQ29tcHV0ZSB0aGUgZGVmYXVsdCB0ZXh0IGhlaWdodC5cbiAgZnVuY3Rpb24gdGV4dEhlaWdodChkaXNwbGF5KSB7XG4gICAgaWYgKGRpc3BsYXkuY2FjaGVkVGV4dEhlaWdodCAhPSBudWxsKSByZXR1cm4gZGlzcGxheS5jYWNoZWRUZXh0SGVpZ2h0O1xuICAgIGlmIChtZWFzdXJlVGV4dCA9PSBudWxsKSB7XG4gICAgICBtZWFzdXJlVGV4dCA9IGVsdChcInByZVwiKTtcbiAgICAgIC8vIE1lYXN1cmUgYSBidW5jaCBvZiBsaW5lcywgZm9yIGJyb3dzZXJzIHRoYXQgY29tcHV0ZVxuICAgICAgLy8gZnJhY3Rpb25hbCBoZWlnaHRzLlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OTsgKytpKSB7XG4gICAgICAgIG1lYXN1cmVUZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwieFwiKSk7XG4gICAgICAgIG1lYXN1cmVUZXh0LmFwcGVuZENoaWxkKGVsdChcImJyXCIpKTtcbiAgICAgIH1cbiAgICAgIG1lYXN1cmVUZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwieFwiKSk7XG4gICAgfVxuICAgIHJlbW92ZUNoaWxkcmVuQW5kQWRkKGRpc3BsYXkubWVhc3VyZSwgbWVhc3VyZVRleHQpO1xuICAgIHZhciBoZWlnaHQgPSBtZWFzdXJlVGV4dC5vZmZzZXRIZWlnaHQgLyA1MDtcbiAgICBpZiAoaGVpZ2h0ID4gMykgZGlzcGxheS5jYWNoZWRUZXh0SGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHJlbW92ZUNoaWxkcmVuKGRpc3BsYXkubWVhc3VyZSk7XG4gICAgcmV0dXJuIGhlaWdodCB8fCAxO1xuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUgZGVmYXVsdCBjaGFyYWN0ZXIgd2lkdGguXG4gIGZ1bmN0aW9uIGNoYXJXaWR0aChkaXNwbGF5KSB7XG4gICAgaWYgKGRpc3BsYXkuY2FjaGVkQ2hhcldpZHRoICE9IG51bGwpIHJldHVybiBkaXNwbGF5LmNhY2hlZENoYXJXaWR0aDtcbiAgICB2YXIgYW5jaG9yID0gZWx0KFwic3BhblwiLCBcInh4eHh4eHh4eHhcIik7XG4gICAgdmFyIHByZSA9IGVsdChcInByZVwiLCBbYW5jaG9yXSk7XG4gICAgcmVtb3ZlQ2hpbGRyZW5BbmRBZGQoZGlzcGxheS5tZWFzdXJlLCBwcmUpO1xuICAgIHZhciByZWN0ID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCB3aWR0aCA9IChyZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0KSAvIDEwO1xuICAgIGlmICh3aWR0aCA+IDIpIGRpc3BsYXkuY2FjaGVkQ2hhcldpZHRoID0gd2lkdGg7XG4gICAgcmV0dXJuIHdpZHRoIHx8IDEwO1xuICB9XG5cbiAgLy8gT1BFUkFUSU9OU1xuXG4gIC8vIE9wZXJhdGlvbnMgYXJlIHVzZWQgdG8gd3JhcCBhIHNlcmllcyBvZiBjaGFuZ2VzIHRvIHRoZSBlZGl0b3JcbiAgLy8gc3RhdGUgaW4gc3VjaCBhIHdheSB0aGF0IGVhY2ggY2hhbmdlIHdvbid0IGhhdmUgdG8gdXBkYXRlIHRoZVxuICAvLyBjdXJzb3IgYW5kIGRpc3BsYXkgKHdoaWNoIHdvdWxkIGJlIGF3a3dhcmQsIHNsb3csIGFuZFxuICAvLyBlcnJvci1wcm9uZSkuIEluc3RlYWQsIGRpc3BsYXkgdXBkYXRlcyBhcmUgYmF0Y2hlZCBhbmQgdGhlbiBhbGxcbiAgLy8gY29tYmluZWQgYW5kIGV4ZWN1dGVkIGF0IG9uY2UuXG5cbiAgdmFyIG5leHRPcElkID0gMDtcbiAgLy8gU3RhcnQgYSBuZXcgb3BlcmF0aW9uLlxuICBmdW5jdGlvbiBzdGFydE9wZXJhdGlvbihjbSkge1xuICAgIGNtLmN1ck9wID0ge1xuICAgICAgdmlld0NoYW5nZWQ6IGZhbHNlLCAgICAgIC8vIEZsYWcgdGhhdCBpbmRpY2F0ZXMgdGhhdCBsaW5lcyBtaWdodCBuZWVkIHRvIGJlIHJlZHJhd25cbiAgICAgIHN0YXJ0SGVpZ2h0OiBjbS5kb2MuaGVpZ2h0LCAvLyBVc2VkIHRvIGRldGVjdCBuZWVkIHRvIHVwZGF0ZSBzY3JvbGxiYXJcbiAgICAgIGZvcmNlVXBkYXRlOiBmYWxzZSwgICAgICAvLyBVc2VkIHRvIGZvcmNlIGEgcmVkcmF3XG4gICAgICB1cGRhdGVJbnB1dDogbnVsbCwgICAgICAgLy8gV2hldGhlciB0byByZXNldCB0aGUgaW5wdXQgdGV4dGFyZWFcbiAgICAgIHR5cGluZzogZmFsc2UsICAgICAgICAgICAvLyBXaGV0aGVyIHRoaXMgcmVzZXQgc2hvdWxkIGJlIGNhcmVmdWwgdG8gbGVhdmUgZXhpc3RpbmcgdGV4dCAoZm9yIGNvbXBvc2l0aW5nKVxuICAgICAgY2hhbmdlT2JqczogbnVsbCwgICAgICAgIC8vIEFjY3VtdWxhdGVkIGNoYW5nZXMsIGZvciBmaXJpbmcgY2hhbmdlIGV2ZW50c1xuICAgICAgY3Vyc29yQWN0aXZpdHlIYW5kbGVyczogbnVsbCwgLy8gU2V0IG9mIGhhbmRsZXJzIHRvIGZpcmUgY3Vyc29yQWN0aXZpdHkgb25cbiAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IGZhbHNlLCAvLyBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gbmVlZHMgdG8gYmUgcmVkcmF3blxuICAgICAgdXBkYXRlTWF4TGluZTogZmFsc2UsICAgIC8vIFNldCB3aGVuIHRoZSB3aWRlc3QgbGluZSBuZWVkcyB0byBiZSBkZXRlcm1pbmVkIGFuZXdcbiAgICAgIHNjcm9sbExlZnQ6IG51bGwsIHNjcm9sbFRvcDogbnVsbCwgLy8gSW50ZXJtZWRpYXRlIHNjcm9sbCBwb3NpdGlvbiwgbm90IHB1c2hlZCB0byBET00geWV0XG4gICAgICBzY3JvbGxUb1BvczogbnVsbCwgICAgICAgLy8gVXNlZCB0byBzY3JvbGwgdG8gYSBzcGVjaWZpYyBwb3NpdGlvblxuICAgICAgaWQ6ICsrbmV4dE9wSWQgICAgICAgICAgIC8vIFVuaXF1ZSBJRFxuICAgIH07XG4gICAgaWYgKCFkZWxheWVkQ2FsbGJhY2tEZXB0aCsrKSBkZWxheWVkQ2FsbGJhY2tzID0gW107XG4gIH1cblxuICAvLyBGaW5pc2ggYW4gb3BlcmF0aW9uLCB1cGRhdGluZyB0aGUgZGlzcGxheSBhbmQgc2lnbmFsbGluZyBkZWxheWVkIGV2ZW50c1xuICBmdW5jdGlvbiBlbmRPcGVyYXRpb24oY20pIHtcbiAgICB2YXIgb3AgPSBjbS5jdXJPcCwgZG9jID0gY20uZG9jLCBkaXNwbGF5ID0gY20uZGlzcGxheTtcbiAgICBjbS5jdXJPcCA9IG51bGw7XG5cbiAgICBpZiAob3AudXBkYXRlTWF4TGluZSkgZmluZE1heExpbmUoY20pO1xuXG4gICAgLy8gSWYgaXQgbG9va3MgbGlrZSBhbiB1cGRhdGUgbWlnaHQgYmUgbmVlZGVkLCBjYWxsIHVwZGF0ZURpc3BsYXlcbiAgICBpZiAob3Audmlld0NoYW5nZWQgfHwgb3AuZm9yY2VVcGRhdGUgfHwgb3Auc2Nyb2xsVG9wICE9IG51bGwgfHxcbiAgICAgICAgb3Auc2Nyb2xsVG9Qb3MgJiYgKG9wLnNjcm9sbFRvUG9zLmZyb20ubGluZSA8IGRpc3BsYXkudmlld0Zyb20gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wLnNjcm9sbFRvUG9zLnRvLmxpbmUgPj0gZGlzcGxheS52aWV3VG8pIHx8XG4gICAgICAgIGRpc3BsYXkubWF4TGluZUNoYW5nZWQgJiYgY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpIHtcbiAgICAgIHZhciB1cGRhdGVkID0gdXBkYXRlRGlzcGxheShjbSwge3RvcDogb3Auc2Nyb2xsVG9wLCBlbnN1cmU6IG9wLnNjcm9sbFRvUG9zfSwgb3AuZm9yY2VVcGRhdGUpO1xuICAgICAgaWYgKGNtLmRpc3BsYXkuc2Nyb2xsZXIub2Zmc2V0SGVpZ2h0KSBjbS5kb2Muc2Nyb2xsVG9wID0gY20uZGlzcGxheS5zY3JvbGxlci5zY3JvbGxUb3A7XG4gICAgfVxuICAgIC8vIElmIG5vIHVwZGF0ZSB3YXMgcnVuLCBidXQgdGhlIHNlbGVjdGlvbiBjaGFuZ2VkLCByZWRyYXcgdGhhdC5cbiAgICBpZiAoIXVwZGF0ZWQgJiYgb3Auc2VsZWN0aW9uQ2hhbmdlZCkgdXBkYXRlU2VsZWN0aW9uKGNtKTtcbiAgICBpZiAoIXVwZGF0ZWQgJiYgb3Auc3RhcnRIZWlnaHQgIT0gY20uZG9jLmhlaWdodCkgdXBkYXRlU2Nyb2xsYmFycyhjbSk7XG5cbiAgICAvLyBBYm9ydCBtb3VzZSB3aGVlbCBkZWx0YSBtZWFzdXJlbWVudCwgd2hlbiBzY3JvbGxpbmcgZXhwbGljaXRseVxuICAgIGlmIChkaXNwbGF5LndoZWVsU3RhcnRYICE9IG51bGwgJiYgKG9wLnNjcm9sbFRvcCAhPSBudWxsIHx8IG9wLnNjcm9sbExlZnQgIT0gbnVsbCB8fCBvcC5zY3JvbGxUb1BvcykpXG4gICAgICBkaXNwbGF5LndoZWVsU3RhcnRYID0gZGlzcGxheS53aGVlbFN0YXJ0WSA9IG51bGw7XG5cbiAgICAvLyBQcm9wYWdhdGUgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byB0aGUgYWN0dWFsIERPTSBzY3JvbGxlclxuICAgIGlmIChvcC5zY3JvbGxUb3AgIT0gbnVsbCAmJiBkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbFRvcCAhPSBvcC5zY3JvbGxUb3ApIHtcbiAgICAgIHZhciB0b3AgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbEhlaWdodCAtIGRpc3BsYXkuc2Nyb2xsZXIuY2xpZW50SGVpZ2h0LCBvcC5zY3JvbGxUb3ApKTtcbiAgICAgIGRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsVG9wID0gZGlzcGxheS5zY3JvbGxiYXJWLnNjcm9sbFRvcCA9IGRvYy5zY3JvbGxUb3AgPSB0b3A7XG4gICAgfVxuICAgIGlmIChvcC5zY3JvbGxMZWZ0ICE9IG51bGwgJiYgZGlzcGxheS5zY3JvbGxlci5zY3JvbGxMZWZ0ICE9IG9wLnNjcm9sbExlZnQpIHtcbiAgICAgIHZhciBsZWZ0ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oZGlzcGxheS5zY3JvbGxlci5zY3JvbGxXaWR0aCAtIGRpc3BsYXkuc2Nyb2xsZXIuY2xpZW50V2lkdGgsIG9wLnNjcm9sbExlZnQpKTtcbiAgICAgIGRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsTGVmdCA9IGRpc3BsYXkuc2Nyb2xsYmFySC5zY3JvbGxMZWZ0ID0gZG9jLnNjcm9sbExlZnQgPSBsZWZ0O1xuICAgICAgYWxpZ25Ib3Jpem9udGFsbHkoY20pO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBuZWVkIHRvIHNjcm9sbCBhIHNwZWNpZmljIHBvc2l0aW9uIGludG8gdmlldywgZG8gc28uXG4gICAgaWYgKG9wLnNjcm9sbFRvUG9zKSB7XG4gICAgICB2YXIgY29vcmRzID0gc2Nyb2xsUG9zSW50b1ZpZXcoY20sIGNsaXBQb3MoY20uZG9jLCBvcC5zY3JvbGxUb1Bvcy5mcm9tKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwUG9zKGNtLmRvYywgb3Auc2Nyb2xsVG9Qb3MudG8pLCBvcC5zY3JvbGxUb1Bvcy5tYXJnaW4pO1xuICAgICAgaWYgKG9wLnNjcm9sbFRvUG9zLmlzQ3Vyc29yICYmIGNtLnN0YXRlLmZvY3VzZWQpIG1heWJlU2Nyb2xsV2luZG93KGNtLCBjb29yZHMpO1xuICAgIH1cblxuICAgIGlmIChvcC5zZWxlY3Rpb25DaGFuZ2VkKSByZXN0YXJ0QmxpbmsoY20pO1xuXG4gICAgaWYgKGNtLnN0YXRlLmZvY3VzZWQgJiYgb3AudXBkYXRlSW5wdXQpXG4gICAgICByZXNldElucHV0KGNtLCBvcC50eXBpbmcpO1xuXG4gICAgLy8gRmlyZSBldmVudHMgZm9yIG1hcmtlcnMgdGhhdCBhcmUgaGlkZGVuL3VuaWRkZW4gYnkgZWRpdGluZyBvclxuICAgIC8vIHVuZG9pbmdcbiAgICB2YXIgaGlkZGVuID0gb3AubWF5YmVIaWRkZW5NYXJrZXJzLCB1bmhpZGRlbiA9IG9wLm1heWJlVW5oaWRkZW5NYXJrZXJzO1xuICAgIGlmIChoaWRkZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgaGlkZGVuLmxlbmd0aDsgKytpKVxuICAgICAgaWYgKCFoaWRkZW5baV0ubGluZXMubGVuZ3RoKSBzaWduYWwoaGlkZGVuW2ldLCBcImhpZGVcIik7XG4gICAgaWYgKHVuaGlkZGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IHVuaGlkZGVuLmxlbmd0aDsgKytpKVxuICAgICAgaWYgKHVuaGlkZGVuW2ldLmxpbmVzLmxlbmd0aCkgc2lnbmFsKHVuaGlkZGVuW2ldLCBcInVuaGlkZVwiKTtcblxuICAgIHZhciBkZWxheWVkO1xuICAgIGlmICghLS1kZWxheWVkQ2FsbGJhY2tEZXB0aCkge1xuICAgICAgZGVsYXllZCA9IGRlbGF5ZWRDYWxsYmFja3M7XG4gICAgICBkZWxheWVkQ2FsbGJhY2tzID0gbnVsbDtcbiAgICB9XG4gICAgLy8gRmlyZSBjaGFuZ2UgZXZlbnRzLCBhbmQgZGVsYXllZCBldmVudCBoYW5kbGVyc1xuICAgIGlmIChvcC5jaGFuZ2VPYmpzKVxuICAgICAgc2lnbmFsKGNtLCBcImNoYW5nZXNcIiwgY20sIG9wLmNoYW5nZU9ianMpO1xuICAgIGlmIChkZWxheWVkKSBmb3IgKHZhciBpID0gMDsgaSA8IGRlbGF5ZWQubGVuZ3RoOyArK2kpIGRlbGF5ZWRbaV0oKTtcbiAgICBpZiAob3AuY3Vyc29yQWN0aXZpdHlIYW5kbGVycylcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3AuY3Vyc29yQWN0aXZpdHlIYW5kbGVycy5sZW5ndGg7IGkrKylcbiAgICAgICAgb3AuY3Vyc29yQWN0aXZpdHlIYW5kbGVyc1tpXShjbSk7XG4gIH1cblxuICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIGluIGFuIG9wZXJhdGlvblxuICBmdW5jdGlvbiBydW5Jbk9wKGNtLCBmKSB7XG4gICAgaWYgKGNtLmN1ck9wKSByZXR1cm4gZigpO1xuICAgIHN0YXJ0T3BlcmF0aW9uKGNtKTtcbiAgICB0cnkgeyByZXR1cm4gZigpOyB9XG4gICAgZmluYWxseSB7IGVuZE9wZXJhdGlvbihjbSk7IH1cbiAgfVxuICAvLyBXcmFwcyBhIGZ1bmN0aW9uIGluIGFuIG9wZXJhdGlvbi4gUmV0dXJucyB0aGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gb3BlcmF0aW9uKGNtLCBmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNtLmN1ck9wKSByZXR1cm4gZi5hcHBseShjbSwgYXJndW1lbnRzKTtcbiAgICAgIHN0YXJ0T3BlcmF0aW9uKGNtKTtcbiAgICAgIHRyeSB7IHJldHVybiBmLmFwcGx5KGNtLCBhcmd1bWVudHMpOyB9XG4gICAgICBmaW5hbGx5IHsgZW5kT3BlcmF0aW9uKGNtKTsgfVxuICAgIH07XG4gIH1cbiAgLy8gVXNlZCB0byBhZGQgbWV0aG9kcyB0byBlZGl0b3IgYW5kIGRvYyBpbnN0YW5jZXMsIHdyYXBwaW5nIHRoZW0gaW5cbiAgLy8gb3BlcmF0aW9ucy5cbiAgZnVuY3Rpb24gbWV0aG9kT3AoZikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmN1ck9wKSByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgc3RhcnRPcGVyYXRpb24odGhpcyk7XG4gICAgICB0cnkgeyByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG4gICAgICBmaW5hbGx5IHsgZW5kT3BlcmF0aW9uKHRoaXMpOyB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkb2NNZXRob2RPcChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNtID0gdGhpcy5jbTtcbiAgICAgIGlmICghY20gfHwgY20uY3VyT3ApIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBzdGFydE9wZXJhdGlvbihjbSk7XG4gICAgICB0cnkgeyByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG4gICAgICBmaW5hbGx5IHsgZW5kT3BlcmF0aW9uKGNtKTsgfVxuICAgIH07XG4gIH1cblxuICAvLyBWSUVXIFRSQUNLSU5HXG5cbiAgLy8gVGhlc2Ugb2JqZWN0cyBhcmUgdXNlZCB0byByZXByZXNlbnQgdGhlIHZpc2libGUgKGN1cnJlbnRseSBkcmF3bilcbiAgLy8gcGFydCBvZiB0aGUgZG9jdW1lbnQuIEEgTGluZVZpZXcgbWF5IGNvcnJlc3BvbmQgdG8gbXVsdGlwbGVcbiAgLy8gbG9naWNhbCBsaW5lcywgaWYgdGhvc2UgYXJlIGNvbm5lY3RlZCBieSBjb2xsYXBzZWQgcmFuZ2VzLlxuICBmdW5jdGlvbiBMaW5lVmlldyhkb2MsIGxpbmUsIGxpbmVOKSB7XG4gICAgLy8gVGhlIHN0YXJ0aW5nIGxpbmVcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIC8vIENvbnRpbnVpbmcgbGluZXMsIGlmIGFueVxuICAgIHRoaXMucmVzdCA9IHZpc3VhbExpbmVDb250aW51ZWQobGluZSk7XG4gICAgLy8gTnVtYmVyIG9mIGxvZ2ljYWwgbGluZXMgaW4gdGhpcyB2aXN1YWwgbGluZVxuICAgIHRoaXMuc2l6ZSA9IHRoaXMucmVzdCA/IGxpbmVObyhsc3QodGhpcy5yZXN0KSkgLSBsaW5lTiArIDEgOiAxO1xuICAgIHRoaXMubm9kZSA9IHRoaXMudGV4dCA9IG51bGw7XG4gICAgdGhpcy5oaWRkZW4gPSBsaW5lSXNIaWRkZW4oZG9jLCBsaW5lKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHJhbmdlIG9mIExpbmVWaWV3IG9iamVjdHMgZm9yIHRoZSBnaXZlbiBsaW5lcy5cbiAgZnVuY3Rpb24gYnVpbGRWaWV3QXJyYXkoY20sIGZyb20sIHRvKSB7XG4gICAgdmFyIGFycmF5ID0gW10sIG5leHRQb3M7XG4gICAgZm9yICh2YXIgcG9zID0gZnJvbTsgcG9zIDwgdG87IHBvcyA9IG5leHRQb3MpIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IExpbmVWaWV3KGNtLmRvYywgZ2V0TGluZShjbS5kb2MsIHBvcyksIHBvcyk7XG4gICAgICBuZXh0UG9zID0gcG9zICsgdmlldy5zaXplO1xuICAgICAgYXJyYXkucHVzaCh2aWV3KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLy8gVXBkYXRlcyB0aGUgZGlzcGxheS52aWV3IGRhdGEgc3RydWN0dXJlIGZvciBhIGdpdmVuIGNoYW5nZSB0byB0aGVcbiAgLy8gZG9jdW1lbnQuIEZyb20gYW5kIHRvIGFyZSBpbiBwcmUtY2hhbmdlIGNvb3JkaW5hdGVzLiBMZW5kaWZmIGlzXG4gIC8vIHRoZSBhbW91bnQgb2YgbGluZXMgYWRkZWQgb3Igc3VidHJhY3RlZCBieSB0aGUgY2hhbmdlLiBUaGlzIGlzXG4gIC8vIHVzZWQgZm9yIGNoYW5nZXMgdGhhdCBzcGFuIG11bHRpcGxlIGxpbmVzLCBvciBjaGFuZ2UgdGhlIHdheVxuICAvLyBsaW5lcyBhcmUgZGl2aWRlZCBpbnRvIHZpc3VhbCBsaW5lcy4gcmVnTGluZUNoYW5nZSAoYmVsb3cpXG4gIC8vIHJlZ2lzdGVycyBzaW5nbGUtbGluZSBjaGFuZ2VzLlxuICBmdW5jdGlvbiByZWdDaGFuZ2UoY20sIGZyb20sIHRvLCBsZW5kaWZmKSB7XG4gICAgaWYgKGZyb20gPT0gbnVsbCkgZnJvbSA9IGNtLmRvYy5maXJzdDtcbiAgICBpZiAodG8gPT0gbnVsbCkgdG8gPSBjbS5kb2MuZmlyc3QgKyBjbS5kb2Muc2l6ZTtcbiAgICBpZiAoIWxlbmRpZmYpIGxlbmRpZmYgPSAwO1xuXG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5O1xuICAgIGlmIChsZW5kaWZmICYmIHRvIDwgZGlzcGxheS52aWV3VG8gJiZcbiAgICAgICAgKGRpc3BsYXkudXBkYXRlTGluZU51bWJlcnMgPT0gbnVsbCB8fCBkaXNwbGF5LnVwZGF0ZUxpbmVOdW1iZXJzID4gZnJvbSkpXG4gICAgICBkaXNwbGF5LnVwZGF0ZUxpbmVOdW1iZXJzID0gZnJvbTtcblxuICAgIGNtLmN1ck9wLnZpZXdDaGFuZ2VkID0gdHJ1ZTtcblxuICAgIGlmIChmcm9tID49IGRpc3BsYXkudmlld1RvKSB7IC8vIENoYW5nZSBhZnRlclxuICAgICAgaWYgKHNhd0NvbGxhcHNlZFNwYW5zICYmIHZpc3VhbExpbmVObyhjbS5kb2MsIGZyb20pIDwgZGlzcGxheS52aWV3VG8pXG4gICAgICAgIHJlc2V0VmlldyhjbSk7XG4gICAgfSBlbHNlIGlmICh0byA8PSBkaXNwbGF5LnZpZXdGcm9tKSB7IC8vIENoYW5nZSBiZWZvcmVcbiAgICAgIGlmIChzYXdDb2xsYXBzZWRTcGFucyAmJiB2aXN1YWxMaW5lRW5kTm8oY20uZG9jLCB0byArIGxlbmRpZmYpID4gZGlzcGxheS52aWV3RnJvbSkge1xuICAgICAgICByZXNldFZpZXcoY20pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheS52aWV3RnJvbSArPSBsZW5kaWZmO1xuICAgICAgICBkaXNwbGF5LnZpZXdUbyArPSBsZW5kaWZmO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbSA8PSBkaXNwbGF5LnZpZXdGcm9tICYmIHRvID49IGRpc3BsYXkudmlld1RvKSB7IC8vIEZ1bGwgb3ZlcmxhcFxuICAgICAgcmVzZXRWaWV3KGNtKTtcbiAgICB9IGVsc2UgaWYgKGZyb20gPD0gZGlzcGxheS52aWV3RnJvbSkgeyAvLyBUb3Agb3ZlcmxhcFxuICAgICAgdmFyIGN1dCA9IHZpZXdDdXR0aW5nUG9pbnQoY20sIHRvLCB0byArIGxlbmRpZmYsIDEpO1xuICAgICAgaWYgKGN1dCkge1xuICAgICAgICBkaXNwbGF5LnZpZXcgPSBkaXNwbGF5LnZpZXcuc2xpY2UoY3V0LmluZGV4KTtcbiAgICAgICAgZGlzcGxheS52aWV3RnJvbSA9IGN1dC5saW5lTjtcbiAgICAgICAgZGlzcGxheS52aWV3VG8gKz0gbGVuZGlmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc2V0VmlldyhjbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0byA+PSBkaXNwbGF5LnZpZXdUbykgeyAvLyBCb3R0b20gb3ZlcmxhcFxuICAgICAgdmFyIGN1dCA9IHZpZXdDdXR0aW5nUG9pbnQoY20sIGZyb20sIGZyb20sIC0xKTtcbiAgICAgIGlmIChjdXQpIHtcbiAgICAgICAgZGlzcGxheS52aWV3ID0gZGlzcGxheS52aWV3LnNsaWNlKDAsIGN1dC5pbmRleCk7XG4gICAgICAgIGRpc3BsYXkudmlld1RvID0gY3V0LmxpbmVOO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRWaWV3KGNtKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBHYXAgaW4gdGhlIG1pZGRsZVxuICAgICAgdmFyIGN1dFRvcCA9IHZpZXdDdXR0aW5nUG9pbnQoY20sIGZyb20sIGZyb20sIC0xKTtcbiAgICAgIHZhciBjdXRCb3QgPSB2aWV3Q3V0dGluZ1BvaW50KGNtLCB0bywgdG8gKyBsZW5kaWZmLCAxKTtcbiAgICAgIGlmIChjdXRUb3AgJiYgY3V0Qm90KSB7XG4gICAgICAgIGRpc3BsYXkudmlldyA9IGRpc3BsYXkudmlldy5zbGljZSgwLCBjdXRUb3AuaW5kZXgpXG4gICAgICAgICAgLmNvbmNhdChidWlsZFZpZXdBcnJheShjbSwgY3V0VG9wLmxpbmVOLCBjdXRCb3QubGluZU4pKVxuICAgICAgICAgIC5jb25jYXQoZGlzcGxheS52aWV3LnNsaWNlKGN1dEJvdC5pbmRleCkpO1xuICAgICAgICBkaXNwbGF5LnZpZXdUbyArPSBsZW5kaWZmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzZXRWaWV3KGNtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZXh0ID0gZGlzcGxheS5leHRlcm5hbE1lYXN1cmVkO1xuICAgIGlmIChleHQpIHtcbiAgICAgIGlmICh0byA8IGV4dC5saW5lTilcbiAgICAgICAgZXh0LmxpbmVOICs9IGxlbmRpZmY7XG4gICAgICBlbHNlIGlmIChmcm9tIDwgZXh0LmxpbmVOICsgZXh0LnNpemUpXG4gICAgICAgIGRpc3BsYXkuZXh0ZXJuYWxNZWFzdXJlZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVnaXN0ZXIgYSBjaGFuZ2UgdG8gYSBzaW5nbGUgbGluZS4gVHlwZSBtdXN0IGJlIG9uZSBvZiBcInRleHRcIixcbiAgLy8gXCJndXR0ZXJcIiwgXCJjbGFzc1wiLCBcIndpZGdldFwiXG4gIGZ1bmN0aW9uIHJlZ0xpbmVDaGFuZ2UoY20sIGxpbmUsIHR5cGUpIHtcbiAgICBjbS5jdXJPcC52aWV3Q2hhbmdlZCA9IHRydWU7XG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5LCBleHQgPSBjbS5kaXNwbGF5LmV4dGVybmFsTWVhc3VyZWQ7XG4gICAgaWYgKGV4dCAmJiBsaW5lID49IGV4dC5saW5lTiAmJiBsaW5lIDwgZXh0LmxpbmVOICsgZXh0LnNpemUpXG4gICAgICBkaXNwbGF5LmV4dGVybmFsTWVhc3VyZWQgPSBudWxsO1xuXG4gICAgaWYgKGxpbmUgPCBkaXNwbGF5LnZpZXdGcm9tIHx8IGxpbmUgPj0gZGlzcGxheS52aWV3VG8pIHJldHVybjtcbiAgICB2YXIgbGluZVZpZXcgPSBkaXNwbGF5LnZpZXdbZmluZFZpZXdJbmRleChjbSwgbGluZSldO1xuICAgIGlmIChsaW5lVmlldy5ub2RlID09IG51bGwpIHJldHVybjtcbiAgICB2YXIgYXJyID0gbGluZVZpZXcuY2hhbmdlcyB8fCAobGluZVZpZXcuY2hhbmdlcyA9IFtdKTtcbiAgICBpZiAoaW5kZXhPZihhcnIsIHR5cGUpID09IC0xKSBhcnIucHVzaCh0eXBlKTtcbiAgfVxuXG4gIC8vIENsZWFyIHRoZSB2aWV3LlxuICBmdW5jdGlvbiByZXNldFZpZXcoY20pIHtcbiAgICBjbS5kaXNwbGF5LnZpZXdGcm9tID0gY20uZGlzcGxheS52aWV3VG8gPSBjbS5kb2MuZmlyc3Q7XG4gICAgY20uZGlzcGxheS52aWV3ID0gW107XG4gICAgY20uZGlzcGxheS52aWV3T2Zmc2V0ID0gMDtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHZpZXcgZWxlbWVudCBjb3JyZXNwb25kaW5nIHRvIGEgZ2l2ZW4gbGluZS4gUmV0dXJuIG51bGxcbiAgLy8gd2hlbiB0aGUgbGluZSBpc24ndCB2aXNpYmxlLlxuICBmdW5jdGlvbiBmaW5kVmlld0luZGV4KGNtLCBuKSB7XG4gICAgaWYgKG4gPj0gY20uZGlzcGxheS52aWV3VG8pIHJldHVybiBudWxsO1xuICAgIG4gLT0gY20uZGlzcGxheS52aWV3RnJvbTtcbiAgICBpZiAobiA8IDApIHJldHVybiBudWxsO1xuICAgIHZhciB2aWV3ID0gY20uZGlzcGxheS52aWV3O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgbiAtPSB2aWV3W2ldLnNpemU7XG4gICAgICBpZiAobiA8IDApIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHZpZXdDdXR0aW5nUG9pbnQoY20sIG9sZE4sIG5ld04sIGRpcikge1xuICAgIHZhciBpbmRleCA9IGZpbmRWaWV3SW5kZXgoY20sIG9sZE4pLCBkaWZmLCB2aWV3ID0gY20uZGlzcGxheS52aWV3O1xuICAgIGlmICghc2F3Q29sbGFwc2VkU3BhbnMgfHwgbmV3TiA9PSBjbS5kb2MuZmlyc3QgKyBjbS5kb2Muc2l6ZSlcbiAgICAgIHJldHVybiB7aW5kZXg6IGluZGV4LCBsaW5lTjogbmV3Tn07XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjbS5kaXNwbGF5LnZpZXdGcm9tOyBpIDwgaW5kZXg7IGkrKylcbiAgICAgIG4gKz0gdmlld1tpXS5zaXplO1xuICAgIGlmIChuICE9IG9sZE4pIHtcbiAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgIGlmIChpbmRleCA9PSB2aWV3Lmxlbmd0aCAtIDEpIHJldHVybiBudWxsO1xuICAgICAgICBkaWZmID0gKG4gKyB2aWV3W2luZGV4XS5zaXplKSAtIG9sZE47XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaWZmID0gbiAtIG9sZE47XG4gICAgICB9XG4gICAgICBvbGROICs9IGRpZmY7IG5ld04gKz0gZGlmZjtcbiAgICB9XG4gICAgd2hpbGUgKHZpc3VhbExpbmVObyhjbS5kb2MsIG5ld04pICE9IG5ld04pIHtcbiAgICAgIGlmIChpbmRleCA9PSAoZGlyIDwgMCA/IDAgOiB2aWV3Lmxlbmd0aCAtIDEpKSByZXR1cm4gbnVsbDtcbiAgICAgIG5ld04gKz0gZGlyICogdmlld1tpbmRleCAtIChkaXIgPCAwID8gMSA6IDApXS5zaXplO1xuICAgICAgaW5kZXggKz0gZGlyO1xuICAgIH1cbiAgICByZXR1cm4ge2luZGV4OiBpbmRleCwgbGluZU46IG5ld059O1xuICB9XG5cbiAgLy8gRm9yY2UgdGhlIHZpZXcgdG8gY292ZXIgYSBnaXZlbiByYW5nZSwgYWRkaW5nIGVtcHR5IHZpZXcgZWxlbWVudFxuICAvLyBvciBjbGlwcGluZyBvZmYgZXhpc3Rpbmcgb25lcyBhcyBuZWVkZWQuXG4gIGZ1bmN0aW9uIGFkanVzdFZpZXcoY20sIGZyb20sIHRvKSB7XG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5LCB2aWV3ID0gZGlzcGxheS52aWV3O1xuICAgIGlmICh2aWV3Lmxlbmd0aCA9PSAwIHx8IGZyb20gPj0gZGlzcGxheS52aWV3VG8gfHwgdG8gPD0gZGlzcGxheS52aWV3RnJvbSkge1xuICAgICAgZGlzcGxheS52aWV3ID0gYnVpbGRWaWV3QXJyYXkoY20sIGZyb20sIHRvKTtcbiAgICAgIGRpc3BsYXkudmlld0Zyb20gPSBmcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZGlzcGxheS52aWV3RnJvbSA+IGZyb20pXG4gICAgICAgIGRpc3BsYXkudmlldyA9IGJ1aWxkVmlld0FycmF5KGNtLCBmcm9tLCBkaXNwbGF5LnZpZXdGcm9tKS5jb25jYXQoZGlzcGxheS52aWV3KTtcbiAgICAgIGVsc2UgaWYgKGRpc3BsYXkudmlld0Zyb20gPCBmcm9tKVxuICAgICAgICBkaXNwbGF5LnZpZXcgPSBkaXNwbGF5LnZpZXcuc2xpY2UoZmluZFZpZXdJbmRleChjbSwgZnJvbSkpO1xuICAgICAgZGlzcGxheS52aWV3RnJvbSA9IGZyb207XG4gICAgICBpZiAoZGlzcGxheS52aWV3VG8gPCB0bylcbiAgICAgICAgZGlzcGxheS52aWV3ID0gZGlzcGxheS52aWV3LmNvbmNhdChidWlsZFZpZXdBcnJheShjbSwgZGlzcGxheS52aWV3VG8sIHRvKSk7XG4gICAgICBlbHNlIGlmIChkaXNwbGF5LnZpZXdUbyA+IHRvKVxuICAgICAgICBkaXNwbGF5LnZpZXcgPSBkaXNwbGF5LnZpZXcuc2xpY2UoMCwgZmluZFZpZXdJbmRleChjbSwgdG8pKTtcbiAgICB9XG4gICAgZGlzcGxheS52aWV3VG8gPSB0bztcbiAgfVxuXG4gIC8vIENvdW50IHRoZSBudW1iZXIgb2YgbGluZXMgaW4gdGhlIHZpZXcgd2hvc2UgRE9NIHJlcHJlc2VudGF0aW9uIGlzXG4gIC8vIG91dCBvZiBkYXRlIChvciBub25leGlzdGVudCkuXG4gIGZ1bmN0aW9uIGNvdW50RGlydHlWaWV3KGNtKSB7XG4gICAgdmFyIHZpZXcgPSBjbS5kaXNwbGF5LnZpZXcsIGRpcnR5ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBsaW5lVmlldyA9IHZpZXdbaV07XG4gICAgICBpZiAoIWxpbmVWaWV3LmhpZGRlbiAmJiAoIWxpbmVWaWV3Lm5vZGUgfHwgbGluZVZpZXcuY2hhbmdlcykpICsrZGlydHk7XG4gICAgfVxuICAgIHJldHVybiBkaXJ0eTtcbiAgfVxuXG4gIC8vIElOUFVUIEhBTkRMSU5HXG5cbiAgLy8gUG9sbCBmb3IgaW5wdXQgY2hhbmdlcywgdXNpbmcgdGhlIG5vcm1hbCByYXRlIG9mIHBvbGxpbmcuIFRoaXNcbiAgLy8gcnVucyBhcyBsb25nIGFzIHRoZSBlZGl0b3IgaXMgZm9jdXNlZC5cbiAgZnVuY3Rpb24gc2xvd1BvbGwoY20pIHtcbiAgICBpZiAoY20uZGlzcGxheS5wb2xsaW5nRmFzdCkgcmV0dXJuO1xuICAgIGNtLmRpc3BsYXkucG9sbC5zZXQoY20ub3B0aW9ucy5wb2xsSW50ZXJ2YWwsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVhZElucHV0KGNtKTtcbiAgICAgIGlmIChjbS5zdGF0ZS5mb2N1c2VkKSBzbG93UG9sbChjbSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBXaGVuIGFuIGV2ZW50IGhhcyBqdXN0IGNvbWUgaW4gdGhhdCBpcyBsaWtlbHkgdG8gYWRkIG9yIGNoYW5nZVxuICAvLyBzb21ldGhpbmcgaW4gdGhlIGlucHV0IHRleHRhcmVhLCB3ZSBwb2xsIGZhc3RlciwgdG8gZW5zdXJlIHRoYXRcbiAgLy8gdGhlIGNoYW5nZSBhcHBlYXJzIG9uIHRoZSBzY3JlZW4gcXVpY2tseS5cbiAgZnVuY3Rpb24gZmFzdFBvbGwoY20pIHtcbiAgICB2YXIgbWlzc2VkID0gZmFsc2U7XG4gICAgY20uZGlzcGxheS5wb2xsaW5nRmFzdCA9IHRydWU7XG4gICAgZnVuY3Rpb24gcCgpIHtcbiAgICAgIHZhciBjaGFuZ2VkID0gcmVhZElucHV0KGNtKTtcbiAgICAgIGlmICghY2hhbmdlZCAmJiAhbWlzc2VkKSB7bWlzc2VkID0gdHJ1ZTsgY20uZGlzcGxheS5wb2xsLnNldCg2MCwgcCk7fVxuICAgICAgZWxzZSB7Y20uZGlzcGxheS5wb2xsaW5nRmFzdCA9IGZhbHNlOyBzbG93UG9sbChjbSk7fVxuICAgIH1cbiAgICBjbS5kaXNwbGF5LnBvbGwuc2V0KDIwLCBwKTtcbiAgfVxuXG4gIC8vIFJlYWQgaW5wdXQgZnJvbSB0aGUgdGV4dGFyZWEsIGFuZCB1cGRhdGUgdGhlIGRvY3VtZW50IHRvIG1hdGNoLlxuICAvLyBXaGVuIHNvbWV0aGluZyBpcyBzZWxlY3RlZCwgaXQgaXMgcHJlc2VudCBpbiB0aGUgdGV4dGFyZWEsIGFuZFxuICAvLyBzZWxlY3RlZCAodW5sZXNzIGl0IGlzIGh1Z2UsIGluIHdoaWNoIGNhc2UgYSBwbGFjZWhvbGRlciBpc1xuICAvLyB1c2VkKS4gV2hlbiBub3RoaW5nIGlzIHNlbGVjdGVkLCB0aGUgY3Vyc29yIHNpdHMgYWZ0ZXIgcHJldmlvdXNseVxuICAvLyBzZWVuIHRleHQgKGNhbiBiZSBlbXB0eSksIHdoaWNoIGlzIHN0b3JlZCBpbiBwcmV2SW5wdXQgKHdlIG11c3RcbiAgLy8gbm90IHJlc2V0IHRoZSB0ZXh0YXJlYSB3aGVuIHR5cGluZywgYmVjYXVzZSB0aGF0IGJyZWFrcyBJTUUpLlxuICBmdW5jdGlvbiByZWFkSW5wdXQoY20pIHtcbiAgICB2YXIgaW5wdXQgPSBjbS5kaXNwbGF5LmlucHV0LCBwcmV2SW5wdXQgPSBjbS5kaXNwbGF5LnByZXZJbnB1dCwgZG9jID0gY20uZG9jO1xuICAgIC8vIFNpbmNlIHRoaXMgaXMgY2FsbGVkIGEgKmxvdCosIHRyeSB0byBiYWlsIG91dCBhcyBjaGVhcGx5IGFzXG4gICAgLy8gcG9zc2libGUgd2hlbiBpdCBpcyBjbGVhciB0aGF0IG5vdGhpbmcgaGFwcGVuZWQuIGhhc1NlbGVjdGlvblxuICAgIC8vIHdpbGwgYmUgdGhlIGNhc2Ugd2hlbiB0aGVyZSBpcyBhIGxvdCBvZiB0ZXh0IGluIHRoZSB0ZXh0YXJlYSxcbiAgICAvLyBpbiB3aGljaCBjYXNlIHJlYWRpbmcgaXRzIHZhbHVlIHdvdWxkIGJlIGV4cGVuc2l2ZS5cbiAgICBpZiAoIWNtLnN0YXRlLmZvY3VzZWQgfHwgKGhhc1NlbGVjdGlvbihpbnB1dCkgJiYgIXByZXZJbnB1dCkgfHwgaXNSZWFkT25seShjbSkgfHwgY20ub3B0aW9ucy5kaXNhYmxlSW5wdXQpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gU2VlIHBhc3RlIGhhbmRsZXIgZm9yIG1vcmUgb24gdGhlIGZha2VkTGFzdENoYXIga2x1ZGdlXG4gICAgaWYgKGNtLnN0YXRlLnBhc3RlSW5jb21pbmcgJiYgY20uc3RhdGUuZmFrZWRMYXN0Q2hhcikge1xuICAgICAgaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZS5zdWJzdHJpbmcoMCwgaW5wdXQudmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICBjbS5zdGF0ZS5mYWtlZExhc3RDaGFyID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciB0ZXh0ID0gaW5wdXQudmFsdWU7XG4gICAgLy8gSWYgbm90aGluZyBjaGFuZ2VkLCBiYWlsLlxuICAgIGlmICh0ZXh0ID09IHByZXZJbnB1dCAmJiAhY20uc29tZXRoaW5nU2VsZWN0ZWQoKSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIFdvcmsgYXJvdW5kIG5vbnNlbnNpY2FsIHNlbGVjdGlvbiByZXNldHRpbmcgaW4gSUU5LzEwXG4gICAgaWYgKGllICYmICFpZV91cHRvOCAmJiBjbS5kaXNwbGF5LmlucHV0SGFzU2VsZWN0aW9uID09PSB0ZXh0KSB7XG4gICAgICByZXNldElucHV0KGNtKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgd2l0aE9wID0gIWNtLmN1ck9wO1xuICAgIGlmICh3aXRoT3ApIHN0YXJ0T3BlcmF0aW9uKGNtKTtcbiAgICBjbS5kaXNwbGF5LnNoaWZ0ID0gZmFsc2U7XG5cbiAgICBpZiAodGV4dC5jaGFyQ29kZUF0KDApID09IDB4MjAwYiAmJiBkb2Muc2VsID09IGNtLmRpc3BsYXkuc2VsRm9yQ29udGV4dE1lbnUgJiYgIXByZXZJbnB1dClcbiAgICAgIHByZXZJbnB1dCA9IFwiXFx1MjAwYlwiO1xuICAgIC8vIEZpbmQgdGhlIHBhcnQgb2YgdGhlIGlucHV0IHRoYXQgaXMgYWN0dWFsbHkgbmV3XG4gICAgdmFyIHNhbWUgPSAwLCBsID0gTWF0aC5taW4ocHJldklucHV0Lmxlbmd0aCwgdGV4dC5sZW5ndGgpO1xuICAgIHdoaWxlIChzYW1lIDwgbCAmJiBwcmV2SW5wdXQuY2hhckNvZGVBdChzYW1lKSA9PSB0ZXh0LmNoYXJDb2RlQXQoc2FtZSkpICsrc2FtZTtcbiAgICB2YXIgaW5zZXJ0ZWQgPSB0ZXh0LnNsaWNlKHNhbWUpLCB0ZXh0TGluZXMgPSBzcGxpdExpbmVzKGluc2VydGVkKTtcblxuICAgIC8vIFdoZW4gcGFzaW5nIE4gbGluZXMgaW50byBOIHNlbGVjdGlvbnMsIGluc2VydCBvbmUgbGluZSBwZXIgc2VsZWN0aW9uXG4gICAgdmFyIG11bHRpUGFzdGUgPSBjbS5zdGF0ZS5wYXN0ZUluY29taW5nICYmIHRleHRMaW5lcy5sZW5ndGggPiAxICYmIGRvYy5zZWwucmFuZ2VzLmxlbmd0aCA9PSB0ZXh0TGluZXMubGVuZ3RoO1xuXG4gICAgLy8gTm9ybWFsIGJlaGF2aW9yIGlzIHRvIGluc2VydCB0aGUgbmV3IHRleHQgaW50byBldmVyeSBzZWxlY3Rpb25cbiAgICBmb3IgKHZhciBpID0gZG9jLnNlbC5yYW5nZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciByYW5nZSA9IGRvYy5zZWwucmFuZ2VzW2ldO1xuICAgICAgdmFyIGZyb20gPSByYW5nZS5mcm9tKCksIHRvID0gcmFuZ2UudG8oKTtcbiAgICAgIC8vIEhhbmRsZSBkZWxldGlvblxuICAgICAgaWYgKHNhbWUgPCBwcmV2SW5wdXQubGVuZ3RoKVxuICAgICAgICBmcm9tID0gUG9zKGZyb20ubGluZSwgZnJvbS5jaCAtIChwcmV2SW5wdXQubGVuZ3RoIC0gc2FtZSkpO1xuICAgICAgLy8gSGFuZGxlIG92ZXJ3cml0ZVxuICAgICAgZWxzZSBpZiAoY20uc3RhdGUub3ZlcndyaXRlICYmIHJhbmdlLmVtcHR5KCkgJiYgIWNtLnN0YXRlLnBhc3RlSW5jb21pbmcpXG4gICAgICAgIHRvID0gUG9zKHRvLmxpbmUsIE1hdGgubWluKGdldExpbmUoZG9jLCB0by5saW5lKS50ZXh0Lmxlbmd0aCwgdG8uY2ggKyBsc3QodGV4dExpbmVzKS5sZW5ndGgpKTtcbiAgICAgIHZhciB1cGRhdGVJbnB1dCA9IGNtLmN1ck9wLnVwZGF0ZUlucHV0O1xuICAgICAgdmFyIGNoYW5nZUV2ZW50ID0ge2Zyb206IGZyb20sIHRvOiB0bywgdGV4dDogbXVsdGlQYXN0ZSA/IFt0ZXh0TGluZXNbaV1dIDogdGV4dExpbmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogY20uc3RhdGUucGFzdGVJbmNvbWluZyA/IFwicGFzdGVcIiA6IGNtLnN0YXRlLmN1dEluY29taW5nID8gXCJjdXRcIiA6IFwiK2lucHV0XCJ9O1xuICAgICAgbWFrZUNoYW5nZShjbS5kb2MsIGNoYW5nZUV2ZW50KTtcbiAgICAgIHNpZ25hbExhdGVyKGNtLCBcImlucHV0UmVhZFwiLCBjbSwgY2hhbmdlRXZlbnQpO1xuICAgICAgLy8gV2hlbiBhbiAnZWxlY3RyaWMnIGNoYXJhY3RlciBpcyBpbnNlcnRlZCwgaW1tZWRpYXRlbHkgdHJpZ2dlciBhIHJlaW5kZW50XG4gICAgICBpZiAoaW5zZXJ0ZWQgJiYgIWNtLnN0YXRlLnBhc3RlSW5jb21pbmcgJiYgY20ub3B0aW9ucy5lbGVjdHJpY0NoYXJzICYmXG4gICAgICAgICAgY20ub3B0aW9ucy5zbWFydEluZGVudCAmJiByYW5nZS5oZWFkLmNoIDwgMTAwICYmXG4gICAgICAgICAgKCFpIHx8IGRvYy5zZWwucmFuZ2VzW2kgLSAxXS5oZWFkLmxpbmUgIT0gcmFuZ2UuaGVhZC5saW5lKSkge1xuICAgICAgICB2YXIgbW9kZSA9IGNtLmdldE1vZGVBdChyYW5nZS5oZWFkKTtcbiAgICAgICAgaWYgKG1vZGUuZWxlY3RyaWNDaGFycykge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbW9kZS5lbGVjdHJpY0NoYXJzLmxlbmd0aDsgaisrKVxuICAgICAgICAgICAgaWYgKGluc2VydGVkLmluZGV4T2YobW9kZS5lbGVjdHJpY0NoYXJzLmNoYXJBdChqKSkgPiAtMSkge1xuICAgICAgICAgICAgICBpbmRlbnRMaW5lKGNtLCByYW5nZS5oZWFkLmxpbmUsIFwic21hcnRcIik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vZGUuZWxlY3RyaWNJbnB1dCkge1xuICAgICAgICAgIHZhciBlbmQgPSBjaGFuZ2VFbmQoY2hhbmdlRXZlbnQpO1xuICAgICAgICAgIGlmIChtb2RlLmVsZWN0cmljSW5wdXQudGVzdChnZXRMaW5lKGRvYywgZW5kLmxpbmUpLnRleHQuc2xpY2UoMCwgZW5kLmNoKSkpXG4gICAgICAgICAgICBpbmRlbnRMaW5lKGNtLCByYW5nZS5oZWFkLmxpbmUsIFwic21hcnRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZW5zdXJlQ3Vyc29yVmlzaWJsZShjbSk7XG4gICAgY20uY3VyT3AudXBkYXRlSW5wdXQgPSB1cGRhdGVJbnB1dDtcbiAgICBjbS5jdXJPcC50eXBpbmcgPSB0cnVlO1xuXG4gICAgLy8gRG9uJ3QgbGVhdmUgbG9uZyB0ZXh0IGluIHRoZSB0ZXh0YXJlYSwgc2luY2UgaXQgbWFrZXMgZnVydGhlciBwb2xsaW5nIHNsb3dcbiAgICBpZiAodGV4dC5sZW5ndGggPiAxMDAwIHx8IHRleHQuaW5kZXhPZihcIlxcblwiKSA+IC0xKSBpbnB1dC52YWx1ZSA9IGNtLmRpc3BsYXkucHJldklucHV0ID0gXCJcIjtcbiAgICBlbHNlIGNtLmRpc3BsYXkucHJldklucHV0ID0gdGV4dDtcbiAgICBpZiAod2l0aE9wKSBlbmRPcGVyYXRpb24oY20pO1xuICAgIGNtLnN0YXRlLnBhc3RlSW5jb21pbmcgPSBjbS5zdGF0ZS5jdXRJbmNvbWluZyA9IGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gUmVzZXQgdGhlIGlucHV0IHRvIGNvcnJlc3BvbmQgdG8gdGhlIHNlbGVjdGlvbiAob3IgdG8gYmUgZW1wdHksXG4gIC8vIHdoZW4gbm90IHR5cGluZyBhbmQgbm90aGluZyBpcyBzZWxlY3RlZClcbiAgZnVuY3Rpb24gcmVzZXRJbnB1dChjbSwgdHlwaW5nKSB7XG4gICAgdmFyIG1pbmltYWwsIHNlbGVjdGVkLCBkb2MgPSBjbS5kb2M7XG4gICAgaWYgKGNtLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcbiAgICAgIGNtLmRpc3BsYXkucHJldklucHV0ID0gXCJcIjtcbiAgICAgIHZhciByYW5nZSA9IGRvYy5zZWwucHJpbWFyeSgpO1xuICAgICAgbWluaW1hbCA9IGhhc0NvcHlFdmVudCAmJlxuICAgICAgICAocmFuZ2UudG8oKS5saW5lIC0gcmFuZ2UuZnJvbSgpLmxpbmUgPiAxMDAgfHwgKHNlbGVjdGVkID0gY20uZ2V0U2VsZWN0aW9uKCkpLmxlbmd0aCA+IDEwMDApO1xuICAgICAgdmFyIGNvbnRlbnQgPSBtaW5pbWFsID8gXCItXCIgOiBzZWxlY3RlZCB8fCBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGNtLmRpc3BsYXkuaW5wdXQudmFsdWUgPSBjb250ZW50O1xuICAgICAgaWYgKGNtLnN0YXRlLmZvY3VzZWQpIHNlbGVjdElucHV0KGNtLmRpc3BsYXkuaW5wdXQpO1xuICAgICAgaWYgKGllICYmICFpZV91cHRvOCkgY20uZGlzcGxheS5pbnB1dEhhc1NlbGVjdGlvbiA9IGNvbnRlbnQ7XG4gICAgfSBlbHNlIGlmICghdHlwaW5nKSB7XG4gICAgICBjbS5kaXNwbGF5LnByZXZJbnB1dCA9IGNtLmRpc3BsYXkuaW5wdXQudmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKGllICYmICFpZV91cHRvOCkgY20uZGlzcGxheS5pbnB1dEhhc1NlbGVjdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIGNtLmRpc3BsYXkuaW5hY2N1cmF0ZVNlbGVjdGlvbiA9IG1pbmltYWw7XG4gIH1cblxuICBmdW5jdGlvbiBmb2N1c0lucHV0KGNtKSB7XG4gICAgaWYgKGNtLm9wdGlvbnMucmVhZE9ubHkgIT0gXCJub2N1cnNvclwiICYmICghbW9iaWxlIHx8IGFjdGl2ZUVsdCgpICE9IGNtLmRpc3BsYXkuaW5wdXQpKVxuICAgICAgY20uZGlzcGxheS5pbnB1dC5mb2N1cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5zdXJlRm9jdXMoY20pIHtcbiAgICBpZiAoIWNtLnN0YXRlLmZvY3VzZWQpIHsgZm9jdXNJbnB1dChjbSk7IG9uRm9jdXMoY20pOyB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1JlYWRPbmx5KGNtKSB7XG4gICAgcmV0dXJuIGNtLm9wdGlvbnMucmVhZE9ubHkgfHwgY20uZG9jLmNhbnRFZGl0O1xuICB9XG5cbiAgLy8gRVZFTlQgSEFORExFUlNcblxuICAvLyBBdHRhY2ggdGhlIG5lY2Vzc2FyeSBldmVudCBoYW5kbGVycyB3aGVuIGluaXRpYWxpemluZyB0aGUgZWRpdG9yXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycyhjbSkge1xuICAgIHZhciBkID0gY20uZGlzcGxheTtcbiAgICBvbihkLnNjcm9sbGVyLCBcIm1vdXNlZG93blwiLCBvcGVyYXRpb24oY20sIG9uTW91c2VEb3duKSk7XG4gICAgLy8gT2xkZXIgSUUncyB3aWxsIG5vdCBmaXJlIGEgc2Vjb25kIG1vdXNlZG93biBmb3IgYSBkb3VibGUgY2xpY2tcbiAgICBpZiAoaWVfdXB0bzEwKVxuICAgICAgb24oZC5zY3JvbGxlciwgXCJkYmxjbGlja1wiLCBvcGVyYXRpb24oY20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHNpZ25hbERPTUV2ZW50KGNtLCBlKSkgcmV0dXJuO1xuICAgICAgICB2YXIgcG9zID0gcG9zRnJvbU1vdXNlKGNtLCBlKTtcbiAgICAgICAgaWYgKCFwb3MgfHwgY2xpY2tJbkd1dHRlcihjbSwgZSkgfHwgZXZlbnRJbldpZGdldChjbS5kaXNwbGF5LCBlKSkgcmV0dXJuO1xuICAgICAgICBlX3ByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICB2YXIgd29yZCA9IGZpbmRXb3JkQXQoY20sIHBvcyk7XG4gICAgICAgIGV4dGVuZFNlbGVjdGlvbihjbS5kb2MsIHdvcmQuYW5jaG9yLCB3b3JkLmhlYWQpO1xuICAgICAgfSkpO1xuICAgIGVsc2VcbiAgICAgIG9uKGQuc2Nyb2xsZXIsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkgeyBzaWduYWxET01FdmVudChjbSwgZSkgfHwgZV9wcmV2ZW50RGVmYXVsdChlKTsgfSk7XG4gICAgLy8gUHJldmVudCBub3JtYWwgc2VsZWN0aW9uIGluIHRoZSBlZGl0b3IgKHdlIGhhbmRsZSBvdXIgb3duKVxuICAgIG9uKGQubGluZVNwYWNlLCBcInNlbGVjdHN0YXJ0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZXZlbnRJbldpZGdldChkLCBlKSkgZV9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICB9KTtcbiAgICAvLyBTb21lIGJyb3dzZXJzIGZpcmUgY29udGV4dG1lbnUgKmFmdGVyKiBvcGVuaW5nIHRoZSBtZW51LCBhdFxuICAgIC8vIHdoaWNoIHBvaW50IHdlIGNhbid0IG1lc3Mgd2l0aCBpdCBhbnltb3JlLiBDb250ZXh0IG1lbnUgaXNcbiAgICAvLyBoYW5kbGVkIGluIG9uTW91c2VEb3duIGZvciB0aGVzZSBicm93c2Vycy5cbiAgICBpZiAoIWNhcHR1cmVSaWdodENsaWNrKSBvbihkLnNjcm9sbGVyLCBcImNvbnRleHRtZW51XCIsIGZ1bmN0aW9uKGUpIHtvbkNvbnRleHRNZW51KGNtLCBlKTt9KTtcblxuICAgIC8vIFN5bmMgc2Nyb2xsaW5nIGJldHdlZW4gZmFrZSBzY3JvbGxiYXJzIGFuZCByZWFsIHNjcm9sbGFibGVcbiAgICAvLyBhcmVhLCBlbnN1cmUgdmlld3BvcnQgaXMgdXBkYXRlZCB3aGVuIHNjcm9sbGluZy5cbiAgICBvbihkLnNjcm9sbGVyLCBcInNjcm9sbFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChkLnNjcm9sbGVyLmNsaWVudEhlaWdodCkge1xuICAgICAgICBzZXRTY3JvbGxUb3AoY20sIGQuc2Nyb2xsZXIuc2Nyb2xsVG9wKTtcbiAgICAgICAgc2V0U2Nyb2xsTGVmdChjbSwgZC5zY3JvbGxlci5zY3JvbGxMZWZ0LCB0cnVlKTtcbiAgICAgICAgc2lnbmFsKGNtLCBcInNjcm9sbFwiLCBjbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb24oZC5zY3JvbGxiYXJWLCBcInNjcm9sbFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChkLnNjcm9sbGVyLmNsaWVudEhlaWdodCkgc2V0U2Nyb2xsVG9wKGNtLCBkLnNjcm9sbGJhclYuc2Nyb2xsVG9wKTtcbiAgICB9KTtcbiAgICBvbihkLnNjcm9sbGJhckgsIFwic2Nyb2xsXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGQuc2Nyb2xsZXIuY2xpZW50SGVpZ2h0KSBzZXRTY3JvbGxMZWZ0KGNtLCBkLnNjcm9sbGJhckguc2Nyb2xsTGVmdCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gdG8gd2hlZWwgZXZlbnRzIGluIG9yZGVyIHRvIHRyeSBhbmQgdXBkYXRlIHRoZSB2aWV3cG9ydCBvbiB0aW1lLlxuICAgIG9uKGQuc2Nyb2xsZXIsIFwibW91c2V3aGVlbFwiLCBmdW5jdGlvbihlKXtvblNjcm9sbFdoZWVsKGNtLCBlKTt9KTtcbiAgICBvbihkLnNjcm9sbGVyLCBcIkRPTU1vdXNlU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpe29uU2Nyb2xsV2hlZWwoY20sIGUpO30pO1xuXG4gICAgLy8gUHJldmVudCBjbGlja3MgaW4gdGhlIHNjcm9sbGJhcnMgZnJvbSBraWxsaW5nIGZvY3VzXG4gICAgZnVuY3Rpb24gcmVGb2N1cygpIHsgaWYgKGNtLnN0YXRlLmZvY3VzZWQpIHNldFRpbWVvdXQoYmluZChmb2N1c0lucHV0LCBjbSksIDApOyB9XG4gICAgb24oZC5zY3JvbGxiYXJILCBcIm1vdXNlZG93blwiLCByZUZvY3VzKTtcbiAgICBvbihkLnNjcm9sbGJhclYsIFwibW91c2Vkb3duXCIsIHJlRm9jdXMpO1xuICAgIC8vIFByZXZlbnQgd3JhcHBlciBmcm9tIGV2ZXIgc2Nyb2xsaW5nXG4gICAgb24oZC53cmFwcGVyLCBcInNjcm9sbFwiLCBmdW5jdGlvbigpIHsgZC53cmFwcGVyLnNjcm9sbFRvcCA9IGQud3JhcHBlci5zY3JvbGxMZWZ0ID0gMDsgfSk7XG5cbiAgICBvbihkLmlucHV0LCBcImtleXVwXCIsIG9wZXJhdGlvbihjbSwgb25LZXlVcCkpO1xuICAgIG9uKGQuaW5wdXQsIFwiaW5wdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaWUgJiYgIWllX3VwdG84ICYmIGNtLmRpc3BsYXkuaW5wdXRIYXNTZWxlY3Rpb24pIGNtLmRpc3BsYXkuaW5wdXRIYXNTZWxlY3Rpb24gPSBudWxsO1xuICAgICAgZmFzdFBvbGwoY20pO1xuICAgIH0pO1xuICAgIG9uKGQuaW5wdXQsIFwia2V5ZG93blwiLCBvcGVyYXRpb24oY20sIG9uS2V5RG93bikpO1xuICAgIG9uKGQuaW5wdXQsIFwia2V5cHJlc3NcIiwgb3BlcmF0aW9uKGNtLCBvbktleVByZXNzKSk7XG4gICAgb24oZC5pbnB1dCwgXCJmb2N1c1wiLCBiaW5kKG9uRm9jdXMsIGNtKSk7XG4gICAgb24oZC5pbnB1dCwgXCJibHVyXCIsIGJpbmQob25CbHVyLCBjbSkpO1xuXG4gICAgZnVuY3Rpb24gZHJhZ18oZSkge1xuICAgICAgaWYgKCFzaWduYWxET01FdmVudChjbSwgZSkpIGVfc3RvcChlKTtcbiAgICB9XG4gICAgaWYgKGNtLm9wdGlvbnMuZHJhZ0Ryb3ApIHtcbiAgICAgIG9uKGQuc2Nyb2xsZXIsIFwiZHJhZ3N0YXJ0XCIsIGZ1bmN0aW9uKGUpe29uRHJhZ1N0YXJ0KGNtLCBlKTt9KTtcbiAgICAgIG9uKGQuc2Nyb2xsZXIsIFwiZHJhZ2VudGVyXCIsIGRyYWdfKTtcbiAgICAgIG9uKGQuc2Nyb2xsZXIsIFwiZHJhZ292ZXJcIiwgZHJhZ18pO1xuICAgICAgb24oZC5zY3JvbGxlciwgXCJkcm9wXCIsIG9wZXJhdGlvbihjbSwgb25Ecm9wKSk7XG4gICAgfVxuICAgIG9uKGQuc2Nyb2xsZXIsIFwicGFzdGVcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGV2ZW50SW5XaWRnZXQoZCwgZSkpIHJldHVybjtcbiAgICAgIGNtLnN0YXRlLnBhc3RlSW5jb21pbmcgPSB0cnVlO1xuICAgICAgZm9jdXNJbnB1dChjbSk7XG4gICAgICBmYXN0UG9sbChjbSk7XG4gICAgfSk7XG4gICAgb24oZC5pbnB1dCwgXCJwYXN0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFdvcmthcm91bmQgZm9yIHdlYmtpdCBidWcgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTkwMjA2XG4gICAgICAvLyBBZGQgYSBjaGFyIHRvIHRoZSBlbmQgb2YgdGV4dGFyZWEgYmVmb3JlIHBhc3RlIG9jY3VyIHNvIHRoYXRcbiAgICAgIC8vIHNlbGVjdGlvbiBkb2Vzbid0IHNwYW4gdG8gdGhlIGVuZCBvZiB0ZXh0YXJlYS5cbiAgICAgIGlmICh3ZWJraXQgJiYgIWNtLnN0YXRlLmZha2VkTGFzdENoYXIgJiYgIShuZXcgRGF0ZSAtIGNtLnN0YXRlLmxhc3RNaWRkbGVEb3duIDwgMjAwKSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBkLmlucHV0LnNlbGVjdGlvblN0YXJ0LCBlbmQgPSBkLmlucHV0LnNlbGVjdGlvbkVuZDtcbiAgICAgICAgZC5pbnB1dC52YWx1ZSArPSBcIiRcIjtcbiAgICAgICAgZC5pbnB1dC5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICBkLmlucHV0LnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgY20uc3RhdGUuZmFrZWRMYXN0Q2hhciA9IHRydWU7XG4gICAgICB9XG4gICAgICBjbS5zdGF0ZS5wYXN0ZUluY29taW5nID0gdHJ1ZTtcbiAgICAgIGZhc3RQb2xsKGNtKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHByZXBhcmVDb3B5Q3V0KGUpIHtcbiAgICAgIGlmIChjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGlmIChkLmluYWNjdXJhdGVTZWxlY3Rpb24pIHtcbiAgICAgICAgICBkLnByZXZJbnB1dCA9IFwiXCI7XG4gICAgICAgICAgZC5pbmFjY3VyYXRlU2VsZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgZC5pbnB1dC52YWx1ZSA9IGNtLmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgIHNlbGVjdElucHV0KGQuaW5wdXQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGV4dCA9IFwiXCIsIHJhbmdlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNtLmRvYy5zZWwucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGxpbmUgPSBjbS5kb2Muc2VsLnJhbmdlc1tpXS5oZWFkLmxpbmU7XG4gICAgICAgICAgdmFyIGxpbmVSYW5nZSA9IHthbmNob3I6IFBvcyhsaW5lLCAwKSwgaGVhZDogUG9zKGxpbmUgKyAxLCAwKX07XG4gICAgICAgICAgcmFuZ2VzLnB1c2gobGluZVJhbmdlKTtcbiAgICAgICAgICB0ZXh0ICs9IGNtLmdldFJhbmdlKGxpbmVSYW5nZS5hbmNob3IsIGxpbmVSYW5nZS5oZWFkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS50eXBlID09IFwiY3V0XCIpIHtcbiAgICAgICAgICBjbS5zZXRTZWxlY3Rpb25zKHJhbmdlcywgbnVsbCwgc2VsX2RvbnRTY3JvbGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGQucHJldklucHV0ID0gXCJcIjtcbiAgICAgICAgICBkLmlucHV0LnZhbHVlID0gdGV4dDtcbiAgICAgICAgICBzZWxlY3RJbnB1dChkLmlucHV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGUudHlwZSA9PSBcImN1dFwiKSBjbS5zdGF0ZS5jdXRJbmNvbWluZyA9IHRydWU7XG4gICAgfVxuICAgIG9uKGQuaW5wdXQsIFwiY3V0XCIsIHByZXBhcmVDb3B5Q3V0KTtcbiAgICBvbihkLmlucHV0LCBcImNvcHlcIiwgcHJlcGFyZUNvcHlDdXQpO1xuXG4gICAgLy8gTmVlZGVkIHRvIGhhbmRsZSBUYWIga2V5IGluIEtIVE1MXG4gICAgaWYgKGtodG1sKSBvbihkLnNpemVyLCBcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYWN0aXZlRWx0KCkgPT0gZC5pbnB1dCkgZC5pbnB1dC5ibHVyKCk7XG4gICAgICBmb2N1c0lucHV0KGNtKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENhbGxlZCB3aGVuIHRoZSB3aW5kb3cgcmVzaXplc1xuICBmdW5jdGlvbiBvblJlc2l6ZShjbSkge1xuICAgIC8vIE1pZ2h0IGJlIGEgdGV4dCBzY2FsaW5nIG9wZXJhdGlvbiwgY2xlYXIgc2l6ZSBjYWNoZXMuXG4gICAgdmFyIGQgPSBjbS5kaXNwbGF5O1xuICAgIGQuY2FjaGVkQ2hhcldpZHRoID0gZC5jYWNoZWRUZXh0SGVpZ2h0ID0gZC5jYWNoZWRQYWRkaW5nSCA9IG51bGw7XG4gICAgY20uc2V0U2l6ZSgpO1xuICB9XG5cbiAgLy8gTU9VU0UgRVZFTlRTXG5cbiAgLy8gUmV0dXJuIHRydWUgd2hlbiB0aGUgZ2l2ZW4gbW91c2UgZXZlbnQgaGFwcGVuZWQgaW4gYSB3aWRnZXRcbiAgZnVuY3Rpb24gZXZlbnRJbldpZGdldChkaXNwbGF5LCBlKSB7XG4gICAgZm9yICh2YXIgbiA9IGVfdGFyZ2V0KGUpOyBuICE9IGRpc3BsYXkud3JhcHBlcjsgbiA9IG4ucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKCFuIHx8IG4uaWdub3JlRXZlbnRzIHx8IG4ucGFyZW50Tm9kZSA9PSBkaXNwbGF5LnNpemVyICYmIG4gIT0gZGlzcGxheS5tb3ZlcikgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2l2ZW4gYSBtb3VzZSBldmVudCwgZmluZCB0aGUgY29ycmVzcG9uZGluZyBwb3NpdGlvbi4gSWYgbGliZXJhbFxuICAvLyBpcyBmYWxzZSwgaXQgY2hlY2tzIHdoZXRoZXIgYSBndXR0ZXIgb3Igc2Nyb2xsYmFyIHdhcyBjbGlja2VkLFxuICAvLyBhbmQgcmV0dXJucyBudWxsIGlmIGl0IHdhcy4gZm9yUmVjdCBpcyB1c2VkIGJ5IHJlY3Rhbmd1bGFyXG4gIC8vIHNlbGVjdGlvbnMsIGFuZCB0cmllcyB0byBlc3RpbWF0ZSBhIGNoYXJhY3RlciBwb3NpdGlvbiBldmVuIGZvclxuICAvLyBjb29yZGluYXRlcyBiZXlvbmQgdGhlIHJpZ2h0IG9mIHRoZSB0ZXh0LlxuICBmdW5jdGlvbiBwb3NGcm9tTW91c2UoY20sIGUsIGxpYmVyYWwsIGZvclJlY3QpIHtcbiAgICB2YXIgZGlzcGxheSA9IGNtLmRpc3BsYXk7XG4gICAgaWYgKCFsaWJlcmFsKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZV90YXJnZXQoZSk7XG4gICAgICBpZiAodGFyZ2V0ID09IGRpc3BsYXkuc2Nyb2xsYmFySCB8fCB0YXJnZXQgPT0gZGlzcGxheS5zY3JvbGxiYXJWIHx8XG4gICAgICAgICAgdGFyZ2V0ID09IGRpc3BsYXkuc2Nyb2xsYmFyRmlsbGVyIHx8IHRhcmdldCA9PSBkaXNwbGF5Lmd1dHRlckZpbGxlcikgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciB4LCB5LCBzcGFjZSA9IGRpc3BsYXkubGluZVNwYWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIEZhaWxzIHVucHJlZGljdGFibHkgb24gSUVbNjddIHdoZW4gbW91c2UgaXMgZHJhZ2dlZCBhcm91bmQgcXVpY2tseS5cbiAgICB0cnkgeyB4ID0gZS5jbGllbnRYIC0gc3BhY2UubGVmdDsgeSA9IGUuY2xpZW50WSAtIHNwYWNlLnRvcDsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiBudWxsOyB9XG4gICAgdmFyIGNvb3JkcyA9IGNvb3Jkc0NoYXIoY20sIHgsIHkpLCBsaW5lO1xuICAgIGlmIChmb3JSZWN0ICYmIGNvb3Jkcy54UmVsID09IDEgJiYgKGxpbmUgPSBnZXRMaW5lKGNtLmRvYywgY29vcmRzLmxpbmUpLnRleHQpLmxlbmd0aCA9PSBjb29yZHMuY2gpIHtcbiAgICAgIHZhciBjb2xEaWZmID0gY291bnRDb2x1bW4obGluZSwgbGluZS5sZW5ndGgsIGNtLm9wdGlvbnMudGFiU2l6ZSkgLSBsaW5lLmxlbmd0aDtcbiAgICAgIGNvb3JkcyA9IFBvcyhjb29yZHMubGluZSwgTWF0aC5tYXgoMCwgTWF0aC5yb3VuZCgoeCAtIHBhZGRpbmdIKGNtLmRpc3BsYXkpLmxlZnQpIC8gY2hhcldpZHRoKGNtLmRpc3BsYXkpKSAtIGNvbERpZmYpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkcztcbiAgfVxuXG4gIC8vIEEgbW91c2UgZG93biBjYW4gYmUgYSBzaW5nbGUgY2xpY2ssIGRvdWJsZSBjbGljaywgdHJpcGxlIGNsaWNrLFxuICAvLyBzdGFydCBvZiBzZWxlY3Rpb24gZHJhZywgc3RhcnQgb2YgdGV4dCBkcmFnLCBuZXcgY3Vyc29yXG4gIC8vIChjdHJsLWNsaWNrKSwgcmVjdGFuZ2xlIGRyYWcgKGFsdC1kcmFnKSwgb3IgeHdpblxuICAvLyBtaWRkbGUtY2xpY2stcGFzdGUuIE9yIGl0IG1pZ2h0IGJlIGEgY2xpY2sgb24gc29tZXRoaW5nIHdlIHNob3VsZFxuICAvLyBub3QgaW50ZXJmZXJlIHdpdGgsIHN1Y2ggYXMgYSBzY3JvbGxiYXIgb3Igd2lkZ2V0LlxuICBmdW5jdGlvbiBvbk1vdXNlRG93bihlKSB7XG4gICAgaWYgKHNpZ25hbERPTUV2ZW50KHRoaXMsIGUpKSByZXR1cm47XG4gICAgdmFyIGNtID0gdGhpcywgZGlzcGxheSA9IGNtLmRpc3BsYXk7XG4gICAgZGlzcGxheS5zaGlmdCA9IGUuc2hpZnRLZXk7XG5cbiAgICBpZiAoZXZlbnRJbldpZGdldChkaXNwbGF5LCBlKSkge1xuICAgICAgaWYgKCF3ZWJraXQpIHtcbiAgICAgICAgLy8gQnJpZWZseSB0dXJuIG9mZiBkcmFnZ2FiaWxpdHksIHRvIGFsbG93IHdpZGdldHMgdG8gZG9cbiAgICAgICAgLy8gbm9ybWFsIGRyYWdnaW5nIHRoaW5ncy5cbiAgICAgICAgZGlzcGxheS5zY3JvbGxlci5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe2Rpc3BsYXkuc2Nyb2xsZXIuZHJhZ2dhYmxlID0gdHJ1ZTt9LCAxMDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2xpY2tJbkd1dHRlcihjbSwgZSkpIHJldHVybjtcbiAgICB2YXIgc3RhcnQgPSBwb3NGcm9tTW91c2UoY20sIGUpO1xuICAgIHdpbmRvdy5mb2N1cygpO1xuXG4gICAgc3dpdGNoIChlX2J1dHRvbihlKSkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChzdGFydClcbiAgICAgICAgbGVmdEJ1dHRvbkRvd24oY20sIGUsIHN0YXJ0KTtcbiAgICAgIGVsc2UgaWYgKGVfdGFyZ2V0KGUpID09IGRpc3BsYXkuc2Nyb2xsZXIpXG4gICAgICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBpZiAod2Via2l0KSBjbS5zdGF0ZS5sYXN0TWlkZGxlRG93biA9ICtuZXcgRGF0ZTtcbiAgICAgIGlmIChzdGFydCkgZXh0ZW5kU2VsZWN0aW9uKGNtLmRvYywgc3RhcnQpO1xuICAgICAgc2V0VGltZW91dChiaW5kKGZvY3VzSW5wdXQsIGNtKSwgMjApO1xuICAgICAgZV9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIGlmIChjYXB0dXJlUmlnaHRDbGljaykgb25Db250ZXh0TWVudShjbSwgZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgbGFzdENsaWNrLCBsYXN0RG91YmxlQ2xpY2s7XG4gIGZ1bmN0aW9uIGxlZnRCdXR0b25Eb3duKGNtLCBlLCBzdGFydCkge1xuICAgIHNldFRpbWVvdXQoYmluZChlbnN1cmVGb2N1cywgY20pLCAwKTtcblxuICAgIHZhciBub3cgPSArbmV3IERhdGUsIHR5cGU7XG4gICAgaWYgKGxhc3REb3VibGVDbGljayAmJiBsYXN0RG91YmxlQ2xpY2sudGltZSA+IG5vdyAtIDQwMCAmJiBjbXAobGFzdERvdWJsZUNsaWNrLnBvcywgc3RhcnQpID09IDApIHtcbiAgICAgIHR5cGUgPSBcInRyaXBsZVwiO1xuICAgIH0gZWxzZSBpZiAobGFzdENsaWNrICYmIGxhc3RDbGljay50aW1lID4gbm93IC0gNDAwICYmIGNtcChsYXN0Q2xpY2sucG9zLCBzdGFydCkgPT0gMCkge1xuICAgICAgdHlwZSA9IFwiZG91YmxlXCI7XG4gICAgICBsYXN0RG91YmxlQ2xpY2sgPSB7dGltZTogbm93LCBwb3M6IHN0YXJ0fTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZSA9IFwic2luZ2xlXCI7XG4gICAgICBsYXN0Q2xpY2sgPSB7dGltZTogbm93LCBwb3M6IHN0YXJ0fTtcbiAgICB9XG5cbiAgICB2YXIgc2VsID0gY20uZG9jLnNlbCwgbW9kaWZpZXIgPSBtYWMgPyBlLm1ldGFLZXkgOiBlLmN0cmxLZXk7XG4gICAgaWYgKGNtLm9wdGlvbnMuZHJhZ0Ryb3AgJiYgZHJhZ0FuZERyb3AgJiYgIWlzUmVhZE9ubHkoY20pICYmXG4gICAgICAgIHR5cGUgPT0gXCJzaW5nbGVcIiAmJiBzZWwuY29udGFpbnMoc3RhcnQpID4gLTEgJiYgc2VsLnNvbWV0aGluZ1NlbGVjdGVkKCkpXG4gICAgICBsZWZ0QnV0dG9uU3RhcnREcmFnKGNtLCBlLCBzdGFydCwgbW9kaWZpZXIpO1xuICAgIGVsc2VcbiAgICAgIGxlZnRCdXR0b25TZWxlY3QoY20sIGUsIHN0YXJ0LCB0eXBlLCBtb2RpZmllcik7XG4gIH1cblxuICAvLyBTdGFydCBhIHRleHQgZHJhZy4gV2hlbiBpdCBlbmRzLCBzZWUgaWYgYW55IGRyYWdnaW5nIGFjdHVhbGx5XG4gIC8vIGhhcHBlbiwgYW5kIHRyZWF0IGFzIGEgY2xpY2sgaWYgaXQgZGlkbid0LlxuICBmdW5jdGlvbiBsZWZ0QnV0dG9uU3RhcnREcmFnKGNtLCBlLCBzdGFydCwgbW9kaWZpZXIpIHtcbiAgICB2YXIgZGlzcGxheSA9IGNtLmRpc3BsYXk7XG4gICAgdmFyIGRyYWdFbmQgPSBvcGVyYXRpb24oY20sIGZ1bmN0aW9uKGUyKSB7XG4gICAgICBpZiAod2Via2l0KSBkaXNwbGF5LnNjcm9sbGVyLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgY20uc3RhdGUuZHJhZ2dpbmdUZXh0ID0gZmFsc2U7XG4gICAgICBvZmYoZG9jdW1lbnQsIFwibW91c2V1cFwiLCBkcmFnRW5kKTtcbiAgICAgIG9mZihkaXNwbGF5LnNjcm9sbGVyLCBcImRyb3BcIiwgZHJhZ0VuZCk7XG4gICAgICBpZiAoTWF0aC5hYnMoZS5jbGllbnRYIC0gZTIuY2xpZW50WCkgKyBNYXRoLmFicyhlLmNsaWVudFkgLSBlMi5jbGllbnRZKSA8IDEwKSB7XG4gICAgICAgIGVfcHJldmVudERlZmF1bHQoZTIpO1xuICAgICAgICBpZiAoIW1vZGlmaWVyKVxuICAgICAgICAgIGV4dGVuZFNlbGVjdGlvbihjbS5kb2MsIHN0YXJ0KTtcbiAgICAgICAgZm9jdXNJbnB1dChjbSk7XG4gICAgICAgIC8vIFdvcmsgYXJvdW5kIHVuZXhwbGFpbmFibGUgZm9jdXMgcHJvYmxlbSBpbiBJRTkgKCMyMTI3KVxuICAgICAgICBpZiAoaWVfdXB0bzEwICYmICFpZV91cHRvOClcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2RvY3VtZW50LmJvZHkuZm9jdXMoKTsgZm9jdXNJbnB1dChjbSk7fSwgMjApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIExldCB0aGUgZHJhZyBoYW5kbGVyIGhhbmRsZSB0aGlzLlxuICAgIGlmICh3ZWJraXQpIGRpc3BsYXkuc2Nyb2xsZXIuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBjbS5zdGF0ZS5kcmFnZ2luZ1RleHQgPSBkcmFnRW5kO1xuICAgIC8vIElFJ3MgYXBwcm9hY2ggdG8gZHJhZ2dhYmxlXG4gICAgaWYgKGRpc3BsYXkuc2Nyb2xsZXIuZHJhZ0Ryb3ApIGRpc3BsYXkuc2Nyb2xsZXIuZHJhZ0Ryb3AoKTtcbiAgICBvbihkb2N1bWVudCwgXCJtb3VzZXVwXCIsIGRyYWdFbmQpO1xuICAgIG9uKGRpc3BsYXkuc2Nyb2xsZXIsIFwiZHJvcFwiLCBkcmFnRW5kKTtcbiAgfVxuXG4gIC8vIE5vcm1hbCBzZWxlY3Rpb24sIGFzIG9wcG9zZWQgdG8gdGV4dCBkcmFnZ2luZy5cbiAgZnVuY3Rpb24gbGVmdEJ1dHRvblNlbGVjdChjbSwgZSwgc3RhcnQsIHR5cGUsIGFkZE5ldykge1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheSwgZG9jID0gY20uZG9jO1xuICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG5cbiAgICB2YXIgb3VyUmFuZ2UsIG91ckluZGV4LCBzdGFydFNlbCA9IGRvYy5zZWw7XG4gICAgaWYgKGFkZE5ldyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgb3VySW5kZXggPSBkb2Muc2VsLmNvbnRhaW5zKHN0YXJ0KTtcbiAgICAgIGlmIChvdXJJbmRleCA+IC0xKVxuICAgICAgICBvdXJSYW5nZSA9IGRvYy5zZWwucmFuZ2VzW291ckluZGV4XTtcbiAgICAgIGVsc2VcbiAgICAgICAgb3VyUmFuZ2UgPSBuZXcgUmFuZ2Uoc3RhcnQsIHN0YXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3VyUmFuZ2UgPSBkb2Muc2VsLnByaW1hcnkoKTtcbiAgICB9XG5cbiAgICBpZiAoZS5hbHRLZXkpIHtcbiAgICAgIHR5cGUgPSBcInJlY3RcIjtcbiAgICAgIGlmICghYWRkTmV3KSBvdXJSYW5nZSA9IG5ldyBSYW5nZShzdGFydCwgc3RhcnQpO1xuICAgICAgc3RhcnQgPSBwb3NGcm9tTW91c2UoY20sIGUsIHRydWUsIHRydWUpO1xuICAgICAgb3VySW5kZXggPSAtMTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJkb3VibGVcIikge1xuICAgICAgdmFyIHdvcmQgPSBmaW5kV29yZEF0KGNtLCBzdGFydCk7XG4gICAgICBpZiAoY20uZGlzcGxheS5zaGlmdCB8fCBkb2MuZXh0ZW5kKVxuICAgICAgICBvdXJSYW5nZSA9IGV4dGVuZFJhbmdlKGRvYywgb3VyUmFuZ2UsIHdvcmQuYW5jaG9yLCB3b3JkLmhlYWQpO1xuICAgICAgZWxzZVxuICAgICAgICBvdXJSYW5nZSA9IHdvcmQ7XG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwidHJpcGxlXCIpIHtcbiAgICAgIHZhciBsaW5lID0gbmV3IFJhbmdlKFBvcyhzdGFydC5saW5lLCAwKSwgY2xpcFBvcyhkb2MsIFBvcyhzdGFydC5saW5lICsgMSwgMCkpKTtcbiAgICAgIGlmIChjbS5kaXNwbGF5LnNoaWZ0IHx8IGRvYy5leHRlbmQpXG4gICAgICAgIG91clJhbmdlID0gZXh0ZW5kUmFuZ2UoZG9jLCBvdXJSYW5nZSwgbGluZS5hbmNob3IsIGxpbmUuaGVhZCk7XG4gICAgICBlbHNlXG4gICAgICAgIG91clJhbmdlID0gbGluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3VyUmFuZ2UgPSBleHRlbmRSYW5nZShkb2MsIG91clJhbmdlLCBzdGFydCk7XG4gICAgfVxuXG4gICAgaWYgKCFhZGROZXcpIHtcbiAgICAgIG91ckluZGV4ID0gMDtcbiAgICAgIHNldFNlbGVjdGlvbihkb2MsIG5ldyBTZWxlY3Rpb24oW291clJhbmdlXSwgMCksIHNlbF9tb3VzZSk7XG4gICAgICBzdGFydFNlbCA9IGRvYy5zZWw7XG4gICAgfSBlbHNlIGlmIChvdXJJbmRleCA+IC0xKSB7XG4gICAgICByZXBsYWNlT25lU2VsZWN0aW9uKGRvYywgb3VySW5kZXgsIG91clJhbmdlLCBzZWxfbW91c2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXJJbmRleCA9IGRvYy5zZWwucmFuZ2VzLmxlbmd0aDtcbiAgICAgIHNldFNlbGVjdGlvbihkb2MsIG5vcm1hbGl6ZVNlbGVjdGlvbihkb2Muc2VsLnJhbmdlcy5jb25jYXQoW291clJhbmdlXSksIG91ckluZGV4KSxcbiAgICAgICAgICAgICAgICAgICB7c2Nyb2xsOiBmYWxzZSwgb3JpZ2luOiBcIiptb3VzZVwifSk7XG4gICAgfVxuXG4gICAgdmFyIGxhc3RQb3MgPSBzdGFydDtcbiAgICBmdW5jdGlvbiBleHRlbmRUbyhwb3MpIHtcbiAgICAgIGlmIChjbXAobGFzdFBvcywgcG9zKSA9PSAwKSByZXR1cm47XG4gICAgICBsYXN0UG9zID0gcG9zO1xuXG4gICAgICBpZiAodHlwZSA9PSBcInJlY3RcIikge1xuICAgICAgICB2YXIgcmFuZ2VzID0gW10sIHRhYlNpemUgPSBjbS5vcHRpb25zLnRhYlNpemU7XG4gICAgICAgIHZhciBzdGFydENvbCA9IGNvdW50Q29sdW1uKGdldExpbmUoZG9jLCBzdGFydC5saW5lKS50ZXh0LCBzdGFydC5jaCwgdGFiU2l6ZSk7XG4gICAgICAgIHZhciBwb3NDb2wgPSBjb3VudENvbHVtbihnZXRMaW5lKGRvYywgcG9zLmxpbmUpLnRleHQsIHBvcy5jaCwgdGFiU2l6ZSk7XG4gICAgICAgIHZhciBsZWZ0ID0gTWF0aC5taW4oc3RhcnRDb2wsIHBvc0NvbCksIHJpZ2h0ID0gTWF0aC5tYXgoc3RhcnRDb2wsIHBvc0NvbCk7XG4gICAgICAgIGZvciAodmFyIGxpbmUgPSBNYXRoLm1pbihzdGFydC5saW5lLCBwb3MubGluZSksIGVuZCA9IE1hdGgubWluKGNtLmxhc3RMaW5lKCksIE1hdGgubWF4KHN0YXJ0LmxpbmUsIHBvcy5saW5lKSk7XG4gICAgICAgICAgICAgbGluZSA8PSBlbmQ7IGxpbmUrKykge1xuICAgICAgICAgIHZhciB0ZXh0ID0gZ2V0TGluZShkb2MsIGxpbmUpLnRleHQsIGxlZnRQb3MgPSBmaW5kQ29sdW1uKHRleHQsIGxlZnQsIHRhYlNpemUpO1xuICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0KVxuICAgICAgICAgICAgcmFuZ2VzLnB1c2gobmV3IFJhbmdlKFBvcyhsaW5lLCBsZWZ0UG9zKSwgUG9zKGxpbmUsIGxlZnRQb3MpKSk7XG4gICAgICAgICAgZWxzZSBpZiAodGV4dC5sZW5ndGggPiBsZWZ0UG9zKVxuICAgICAgICAgICAgcmFuZ2VzLnB1c2gobmV3IFJhbmdlKFBvcyhsaW5lLCBsZWZ0UG9zKSwgUG9zKGxpbmUsIGZpbmRDb2x1bW4odGV4dCwgcmlnaHQsIHRhYlNpemUpKSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmFuZ2VzLmxlbmd0aCkgcmFuZ2VzLnB1c2gobmV3IFJhbmdlKHN0YXJ0LCBzdGFydCkpO1xuICAgICAgICBzZXRTZWxlY3Rpb24oZG9jLCBub3JtYWxpemVTZWxlY3Rpb24oc3RhcnRTZWwucmFuZ2VzLnNsaWNlKDAsIG91ckluZGV4KS5jb25jYXQocmFuZ2VzKSwgb3VySW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAge29yaWdpbjogXCIqbW91c2VcIiwgc2Nyb2xsOiBmYWxzZX0pO1xuICAgICAgICBjbS5zY3JvbGxJbnRvVmlldyhwb3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG9sZFJhbmdlID0gb3VyUmFuZ2U7XG4gICAgICAgIHZhciBhbmNob3IgPSBvbGRSYW5nZS5hbmNob3IsIGhlYWQgPSBwb3M7XG4gICAgICAgIGlmICh0eXBlICE9IFwic2luZ2xlXCIpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSBcImRvdWJsZVwiKVxuICAgICAgICAgICAgdmFyIHJhbmdlID0gZmluZFdvcmRBdChjbSwgcG9zKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBuZXcgUmFuZ2UoUG9zKHBvcy5saW5lLCAwKSwgY2xpcFBvcyhkb2MsIFBvcyhwb3MubGluZSArIDEsIDApKSk7XG4gICAgICAgICAgaWYgKGNtcChyYW5nZS5hbmNob3IsIGFuY2hvcikgPiAwKSB7XG4gICAgICAgICAgICBoZWFkID0gcmFuZ2UuaGVhZDtcbiAgICAgICAgICAgIGFuY2hvciA9IG1pblBvcyhvbGRSYW5nZS5mcm9tKCksIHJhbmdlLmFuY2hvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWQgPSByYW5nZS5hbmNob3I7XG4gICAgICAgICAgICBhbmNob3IgPSBtYXhQb3Mob2xkUmFuZ2UudG8oKSwgcmFuZ2UuaGVhZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciByYW5nZXMgPSBzdGFydFNlbC5yYW5nZXMuc2xpY2UoMCk7XG4gICAgICAgIHJhbmdlc1tvdXJJbmRleF0gPSBuZXcgUmFuZ2UoY2xpcFBvcyhkb2MsIGFuY2hvciksIGhlYWQpO1xuICAgICAgICBzZXRTZWxlY3Rpb24oZG9jLCBub3JtYWxpemVTZWxlY3Rpb24ocmFuZ2VzLCBvdXJJbmRleCksIHNlbF9tb3VzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGVkaXRvclNpemUgPSBkaXNwbGF5LndyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gVXNlZCB0byBlbnN1cmUgdGltZW91dCByZS10cmllcyBkb24ndCBmaXJlIHdoZW4gYW5vdGhlciBleHRlbmRcbiAgICAvLyBoYXBwZW5lZCBpbiB0aGUgbWVhbnRpbWUgKGNsZWFyVGltZW91dCBpc24ndCByZWxpYWJsZSAtLSBhdFxuICAgIC8vIGxlYXN0IG9uIENocm9tZSwgdGhlIHRpbWVvdXRzIHN0aWxsIGhhcHBlbiBldmVuIHdoZW4gY2xlYXJlZCxcbiAgICAvLyBpZiB0aGUgY2xlYXIgaGFwcGVucyBhZnRlciB0aGVpciBzY2hlZHVsZWQgZmlyaW5nIHRpbWUpLlxuICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGV4dGVuZChlKSB7XG4gICAgICB2YXIgY3VyQ291bnQgPSArK2NvdW50ZXI7XG4gICAgICB2YXIgY3VyID0gcG9zRnJvbU1vdXNlKGNtLCBlLCB0cnVlLCB0eXBlID09IFwicmVjdFwiKTtcbiAgICAgIGlmICghY3VyKSByZXR1cm47XG4gICAgICBpZiAoY21wKGN1ciwgbGFzdFBvcykgIT0gMCkge1xuICAgICAgICBlbnN1cmVGb2N1cyhjbSk7XG4gICAgICAgIGV4dGVuZFRvKGN1cik7XG4gICAgICAgIHZhciB2aXNpYmxlID0gdmlzaWJsZUxpbmVzKGRpc3BsYXksIGRvYyk7XG4gICAgICAgIGlmIChjdXIubGluZSA+PSB2aXNpYmxlLnRvIHx8IGN1ci5saW5lIDwgdmlzaWJsZS5mcm9tKVxuICAgICAgICAgIHNldFRpbWVvdXQob3BlcmF0aW9uKGNtLCBmdW5jdGlvbigpe2lmIChjb3VudGVyID09IGN1ckNvdW50KSBleHRlbmQoZSk7fSksIDE1MCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3V0c2lkZSA9IGUuY2xpZW50WSA8IGVkaXRvclNpemUudG9wID8gLTIwIDogZS5jbGllbnRZID4gZWRpdG9yU2l6ZS5ib3R0b20gPyAyMCA6IDA7XG4gICAgICAgIGlmIChvdXRzaWRlKSBzZXRUaW1lb3V0KG9wZXJhdGlvbihjbSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGNvdW50ZXIgIT0gY3VyQ291bnQpIHJldHVybjtcbiAgICAgICAgICBkaXNwbGF5LnNjcm9sbGVyLnNjcm9sbFRvcCArPSBvdXRzaWRlO1xuICAgICAgICAgIGV4dGVuZChlKTtcbiAgICAgICAgfSksIDUwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkb25lKGUpIHtcbiAgICAgIGNvdW50ZXIgPSBJbmZpbml0eTtcbiAgICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgICBmb2N1c0lucHV0KGNtKTtcbiAgICAgIG9mZihkb2N1bWVudCwgXCJtb3VzZW1vdmVcIiwgbW92ZSk7XG4gICAgICBvZmYoZG9jdW1lbnQsIFwibW91c2V1cFwiLCB1cCk7XG4gICAgICBkb2MuaGlzdG9yeS5sYXN0U2VsT3JpZ2luID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbW92ZSA9IG9wZXJhdGlvbihjbSwgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKChpZSAmJiAhaWVfdXB0bzkpID8gICFlLmJ1dHRvbnMgOiAhZV9idXR0b24oZSkpIGRvbmUoZSk7XG4gICAgICBlbHNlIGV4dGVuZChlKTtcbiAgICB9KTtcbiAgICB2YXIgdXAgPSBvcGVyYXRpb24oY20sIGRvbmUpO1xuICAgIG9uKGRvY3VtZW50LCBcIm1vdXNlbW92ZVwiLCBtb3ZlKTtcbiAgICBvbihkb2N1bWVudCwgXCJtb3VzZXVwXCIsIHVwKTtcbiAgfVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciBhbiBldmVudCBoYXBwZW5lZCBpbiB0aGUgZ3V0dGVyLCBhbmQgZmlyZXMgdGhlXG4gIC8vIGhhbmRsZXJzIGZvciB0aGUgY29ycmVzcG9uZGluZyBldmVudC5cbiAgZnVuY3Rpb24gZ3V0dGVyRXZlbnQoY20sIGUsIHR5cGUsIHByZXZlbnQsIHNpZ25hbGZuKSB7XG4gICAgdHJ5IHsgdmFyIG1YID0gZS5jbGllbnRYLCBtWSA9IGUuY2xpZW50WTsgfVxuICAgIGNhdGNoKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKG1YID49IE1hdGguZmxvb3IoY20uZGlzcGxheS5ndXR0ZXJzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0KSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChwcmV2ZW50KSBlX3ByZXZlbnREZWZhdWx0KGUpO1xuXG4gICAgdmFyIGRpc3BsYXkgPSBjbS5kaXNwbGF5O1xuICAgIHZhciBsaW5lQm94ID0gZGlzcGxheS5saW5lRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgaWYgKG1ZID4gbGluZUJveC5ib3R0b20gfHwgIWhhc0hhbmRsZXIoY20sIHR5cGUpKSByZXR1cm4gZV9kZWZhdWx0UHJldmVudGVkKGUpO1xuICAgIG1ZIC09IGxpbmVCb3gudG9wIC0gZGlzcGxheS52aWV3T2Zmc2V0O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbS5vcHRpb25zLmd1dHRlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBnID0gZGlzcGxheS5ndXR0ZXJzLmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAoZyAmJiBnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0ID49IG1YKSB7XG4gICAgICAgIHZhciBsaW5lID0gbGluZUF0SGVpZ2h0KGNtLmRvYywgbVkpO1xuICAgICAgICB2YXIgZ3V0dGVyID0gY20ub3B0aW9ucy5ndXR0ZXJzW2ldO1xuICAgICAgICBzaWduYWxmbihjbSwgdHlwZSwgY20sIGxpbmUsIGd1dHRlciwgZSk7XG4gICAgICAgIHJldHVybiBlX2RlZmF1bHRQcmV2ZW50ZWQoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xpY2tJbkd1dHRlcihjbSwgZSkge1xuICAgIHJldHVybiBndXR0ZXJFdmVudChjbSwgZSwgXCJndXR0ZXJDbGlja1wiLCB0cnVlLCBzaWduYWxMYXRlcik7XG4gIH1cblxuICAvLyBLbHVkZ2UgdG8gd29yayBhcm91bmQgc3RyYW5nZSBJRSBiZWhhdmlvciB3aGVyZSBpdCdsbCBzb21ldGltZXNcbiAgLy8gcmUtZmlyZSBhIHNlcmllcyBvZiBkcmFnLXJlbGF0ZWQgZXZlbnRzIHJpZ2h0IGFmdGVyIHRoZSBkcm9wICgjMTU1MSlcbiAgdmFyIGxhc3REcm9wID0gMDtcblxuICBmdW5jdGlvbiBvbkRyb3AoZSkge1xuICAgIHZhciBjbSA9IHRoaXM7XG4gICAgaWYgKHNpZ25hbERPTUV2ZW50KGNtLCBlKSB8fCBldmVudEluV2lkZ2V0KGNtLmRpc3BsYXksIGUpKVxuICAgICAgcmV0dXJuO1xuICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgaWYgKGllKSBsYXN0RHJvcCA9ICtuZXcgRGF0ZTtcbiAgICB2YXIgcG9zID0gcG9zRnJvbU1vdXNlKGNtLCBlLCB0cnVlKSwgZmlsZXMgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICBpZiAoIXBvcyB8fCBpc1JlYWRPbmx5KGNtKSkgcmV0dXJuO1xuICAgIC8vIE1pZ2h0IGJlIGEgZmlsZSBkcm9wLCBpbiB3aGljaCBjYXNlIHdlIHNpbXBseSBleHRyYWN0IHRoZSB0ZXh0XG4gICAgLy8gYW5kIGluc2VydCBpdC5cbiAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlKSB7XG4gICAgICB2YXIgbiA9IGZpbGVzLmxlbmd0aCwgdGV4dCA9IEFycmF5KG4pLCByZWFkID0gMDtcbiAgICAgIHZhciBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGkpIHtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyO1xuICAgICAgICByZWFkZXIub25sb2FkID0gb3BlcmF0aW9uKGNtLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0ZXh0W2ldID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICBpZiAoKytyZWFkID09IG4pIHtcbiAgICAgICAgICAgIHBvcyA9IGNsaXBQb3MoY20uZG9jLCBwb3MpO1xuICAgICAgICAgICAgdmFyIGNoYW5nZSA9IHtmcm9tOiBwb3MsIHRvOiBwb3MsIHRleHQ6IHNwbGl0TGluZXModGV4dC5qb2luKFwiXFxuXCIpKSwgb3JpZ2luOiBcInBhc3RlXCJ9O1xuICAgICAgICAgICAgbWFrZUNoYW5nZShjbS5kb2MsIGNoYW5nZSk7XG4gICAgICAgICAgICBzZXRTZWxlY3Rpb25SZXBsYWNlSGlzdG9yeShjbS5kb2MsIHNpbXBsZVNlbGVjdGlvbihwb3MsIGNoYW5nZUVuZChjaGFuZ2UpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICB9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpIGxvYWRGaWxlKGZpbGVzW2ldLCBpKTtcbiAgICB9IGVsc2UgeyAvLyBOb3JtYWwgZHJvcFxuICAgICAgLy8gRG9uJ3QgZG8gYSByZXBsYWNlIGlmIHRoZSBkcm9wIGhhcHBlbmVkIGluc2lkZSBvZiB0aGUgc2VsZWN0ZWQgdGV4dC5cbiAgICAgIGlmIChjbS5zdGF0ZS5kcmFnZ2luZ1RleHQgJiYgY20uZG9jLnNlbC5jb250YWlucyhwb3MpID4gLTEpIHtcbiAgICAgICAgY20uc3RhdGUuZHJhZ2dpbmdUZXh0KGUpO1xuICAgICAgICAvLyBFbnN1cmUgdGhlIGVkaXRvciBpcyByZS1mb2N1c2VkXG4gICAgICAgIHNldFRpbWVvdXQoYmluZChmb2N1c0lucHV0LCBjbSksIDIwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHRleHQgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiVGV4dFwiKTtcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICBpZiAoY20uc3RhdGUuZHJhZ2dpbmdUZXh0ICYmICEobWFjID8gZS5tZXRhS2V5IDogZS5jdHJsS2V5KSlcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICAgICAgc2V0U2VsZWN0aW9uTm9VbmRvKGNtLmRvYywgc2ltcGxlU2VsZWN0aW9uKHBvcywgcG9zKSk7XG4gICAgICAgICAgaWYgKHNlbGVjdGVkKSBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgcmVwbGFjZVJhbmdlKGNtLmRvYywgXCJcIiwgc2VsZWN0ZWRbaV0uYW5jaG9yLCBzZWxlY3RlZFtpXS5oZWFkLCBcImRyYWdcIik7XG4gICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbih0ZXh0LCBcImFyb3VuZFwiLCBcInBhc3RlXCIpO1xuICAgICAgICAgIGZvY3VzSW5wdXQoY20pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXRjaChlKXt9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25EcmFnU3RhcnQoY20sIGUpIHtcbiAgICBpZiAoaWUgJiYgKCFjbS5zdGF0ZS5kcmFnZ2luZ1RleHQgfHwgK25ldyBEYXRlIC0gbGFzdERyb3AgPCAxMDApKSB7IGVfc3RvcChlKTsgcmV0dXJuOyB9XG4gICAgaWYgKHNpZ25hbERPTUV2ZW50KGNtLCBlKSB8fCBldmVudEluV2lkZ2V0KGNtLmRpc3BsYXksIGUpKSByZXR1cm47XG5cbiAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiVGV4dFwiLCBjbS5nZXRTZWxlY3Rpb24oKSk7XG5cbiAgICAvLyBVc2UgZHVtbXkgaW1hZ2UgaW5zdGVhZCBvZiBkZWZhdWx0IGJyb3dzZXJzIGltYWdlLlxuICAgIC8vIFJlY2VudCBTYWZhcmkgKH42LjAuMikgaGF2ZSBhIHRlbmRlbmN5IHRvIHNlZ2ZhdWx0IHdoZW4gdGhpcyBoYXBwZW5zLCBzbyB3ZSBkb24ndCBkbyBpdCB0aGVyZS5cbiAgICBpZiAoZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlICYmICFzYWZhcmkpIHtcbiAgICAgIHZhciBpbWcgPSBlbHQoXCJpbWdcIiwgbnVsbCwgbnVsbCwgXCJwb3NpdGlvbjogZml4ZWQ7IGxlZnQ6IDA7IHRvcDogMDtcIik7XG4gICAgICBpbWcuc3JjID0gXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFBQUFDSDVCQUVLQUFFQUxBQUFBQUFCQUFFQUFBSUNUQUVBT3c9PVwiO1xuICAgICAgaWYgKHByZXN0bykge1xuICAgICAgICBpbWcud2lkdGggPSBpbWcuaGVpZ2h0ID0gMTtcbiAgICAgICAgY20uZGlzcGxheS53cmFwcGVyLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIC8vIEZvcmNlIGEgcmVsYXlvdXQsIG9yIE9wZXJhIHdvbid0IHVzZSBvdXIgaW1hZ2UgZm9yIHNvbWUgb2JzY3VyZSByZWFzb25cbiAgICAgICAgaW1nLl90b3AgPSBpbWcub2Zmc2V0VG9wO1xuICAgICAgfVxuICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKGltZywgMCwgMCk7XG4gICAgICBpZiAocHJlc3RvKSBpbWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbWcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNDUk9MTCBFVkVOVFNcblxuICAvLyBTeW5jIHRoZSBzY3JvbGxhYmxlIGFyZWEgYW5kIHNjcm9sbGJhcnMsIGVuc3VyZSB0aGUgdmlld3BvcnRcbiAgLy8gY292ZXJzIHRoZSB2aXNpYmxlIGFyZWEuXG4gIGZ1bmN0aW9uIHNldFNjcm9sbFRvcChjbSwgdmFsKSB7XG4gICAgaWYgKE1hdGguYWJzKGNtLmRvYy5zY3JvbGxUb3AgLSB2YWwpIDwgMikgcmV0dXJuO1xuICAgIGNtLmRvYy5zY3JvbGxUb3AgPSB2YWw7XG4gICAgaWYgKCFnZWNrbykgdXBkYXRlRGlzcGxheShjbSwge3RvcDogdmFsfSk7XG4gICAgaWYgKGNtLmRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsVG9wICE9IHZhbCkgY20uZGlzcGxheS5zY3JvbGxlci5zY3JvbGxUb3AgPSB2YWw7XG4gICAgaWYgKGNtLmRpc3BsYXkuc2Nyb2xsYmFyVi5zY3JvbGxUb3AgIT0gdmFsKSBjbS5kaXNwbGF5LnNjcm9sbGJhclYuc2Nyb2xsVG9wID0gdmFsO1xuICAgIGlmIChnZWNrbykgdXBkYXRlRGlzcGxheShjbSk7XG4gICAgc3RhcnRXb3JrZXIoY20sIDEwMCk7XG4gIH1cbiAgLy8gU3luYyBzY3JvbGxlciBhbmQgc2Nyb2xsYmFyLCBlbnN1cmUgdGhlIGd1dHRlciBlbGVtZW50cyBhcmVcbiAgLy8gYWxpZ25lZC5cbiAgZnVuY3Rpb24gc2V0U2Nyb2xsTGVmdChjbSwgdmFsLCBpc1Njcm9sbGVyKSB7XG4gICAgaWYgKGlzU2Nyb2xsZXIgPyB2YWwgPT0gY20uZG9jLnNjcm9sbExlZnQgOiBNYXRoLmFicyhjbS5kb2Muc2Nyb2xsTGVmdCAtIHZhbCkgPCAyKSByZXR1cm47XG4gICAgdmFsID0gTWF0aC5taW4odmFsLCBjbS5kaXNwbGF5LnNjcm9sbGVyLnNjcm9sbFdpZHRoIC0gY20uZGlzcGxheS5zY3JvbGxlci5jbGllbnRXaWR0aCk7XG4gICAgY20uZG9jLnNjcm9sbExlZnQgPSB2YWw7XG4gICAgYWxpZ25Ib3Jpem9udGFsbHkoY20pO1xuICAgIGlmIChjbS5kaXNwbGF5LnNjcm9sbGVyLnNjcm9sbExlZnQgIT0gdmFsKSBjbS5kaXNwbGF5LnNjcm9sbGVyLnNjcm9sbExlZnQgPSB2YWw7XG4gICAgaWYgKGNtLmRpc3BsYXkuc2Nyb2xsYmFySC5zY3JvbGxMZWZ0ICE9IHZhbCkgY20uZGlzcGxheS5zY3JvbGxiYXJILnNjcm9sbExlZnQgPSB2YWw7XG4gIH1cblxuICAvLyBTaW5jZSB0aGUgZGVsdGEgdmFsdWVzIHJlcG9ydGVkIG9uIG1vdXNlIHdoZWVsIGV2ZW50cyBhcmVcbiAgLy8gdW5zdGFuZGFyZGl6ZWQgYmV0d2VlbiBicm93c2VycyBhbmQgZXZlbiBicm93c2VyIHZlcnNpb25zLCBhbmRcbiAgLy8gZ2VuZXJhbGx5IGhvcnJpYmx5IHVucHJlZGljdGFibGUsIHRoaXMgY29kZSBzdGFydHMgYnkgbWVhc3VyaW5nXG4gIC8vIHRoZSBzY3JvbGwgZWZmZWN0IHRoYXQgdGhlIGZpcnN0IGZldyBtb3VzZSB3aGVlbCBldmVudHMgaGF2ZSxcbiAgLy8gYW5kLCBmcm9tIHRoYXQsIGRldGVjdHMgdGhlIHdheSBpdCBjYW4gY29udmVydCBkZWx0YXMgdG8gcGl4ZWxcbiAgLy8gb2Zmc2V0cyBhZnRlcndhcmRzLlxuICAvL1xuICAvLyBUaGUgcmVhc29uIHdlIHdhbnQgdG8ga25vdyB0aGUgYW1vdW50IGEgd2hlZWwgZXZlbnQgd2lsbCBzY3JvbGxcbiAgLy8gaXMgdGhhdCBpdCBnaXZlcyB1cyBhIGNoYW5jZSB0byB1cGRhdGUgdGhlIGRpc3BsYXkgYmVmb3JlIHRoZVxuICAvLyBhY3R1YWwgc2Nyb2xsaW5nIGhhcHBlbnMsIHJlZHVjaW5nIGZsaWNrZXJpbmcuXG5cbiAgdmFyIHdoZWVsU2FtcGxlcyA9IDAsIHdoZWVsUGl4ZWxzUGVyVW5pdCA9IG51bGw7XG4gIC8vIEZpbGwgaW4gYSBicm93c2VyLWRldGVjdGVkIHN0YXJ0aW5nIHZhbHVlIG9uIGJyb3dzZXJzIHdoZXJlIHdlXG4gIC8vIGtub3cgb25lLiBUaGVzZSBkb24ndCBoYXZlIHRvIGJlIGFjY3VyYXRlIC0tIHRoZSByZXN1bHQgb2YgdGhlbVxuICAvLyBiZWluZyB3cm9uZyB3b3VsZCBqdXN0IGJlIGEgc2xpZ2h0IGZsaWNrZXIgb24gdGhlIGZpcnN0IHdoZWVsXG4gIC8vIHNjcm9sbCAoaWYgaXQgaXMgbGFyZ2UgZW5vdWdoKS5cbiAgaWYgKGllKSB3aGVlbFBpeGVsc1BlclVuaXQgPSAtLjUzO1xuICBlbHNlIGlmIChnZWNrbykgd2hlZWxQaXhlbHNQZXJVbml0ID0gMTU7XG4gIGVsc2UgaWYgKGNocm9tZSkgd2hlZWxQaXhlbHNQZXJVbml0ID0gLS43O1xuICBlbHNlIGlmIChzYWZhcmkpIHdoZWVsUGl4ZWxzUGVyVW5pdCA9IC0xLzM7XG5cbiAgZnVuY3Rpb24gb25TY3JvbGxXaGVlbChjbSwgZSkge1xuICAgIHZhciBkeCA9IGUud2hlZWxEZWx0YVgsIGR5ID0gZS53aGVlbERlbHRhWTtcbiAgICBpZiAoZHggPT0gbnVsbCAmJiBlLmRldGFpbCAmJiBlLmF4aXMgPT0gZS5IT1JJWk9OVEFMX0FYSVMpIGR4ID0gZS5kZXRhaWw7XG4gICAgaWYgKGR5ID09IG51bGwgJiYgZS5kZXRhaWwgJiYgZS5heGlzID09IGUuVkVSVElDQUxfQVhJUykgZHkgPSBlLmRldGFpbDtcbiAgICBlbHNlIGlmIChkeSA9PSBudWxsKSBkeSA9IGUud2hlZWxEZWx0YTtcblxuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheSwgc2Nyb2xsID0gZGlzcGxheS5zY3JvbGxlcjtcbiAgICAvLyBRdWl0IGlmIHRoZXJlJ3Mgbm90aGluZyB0byBzY3JvbGwgaGVyZVxuICAgIGlmICghKGR4ICYmIHNjcm9sbC5zY3JvbGxXaWR0aCA+IHNjcm9sbC5jbGllbnRXaWR0aCB8fFxuICAgICAgICAgIGR5ICYmIHNjcm9sbC5zY3JvbGxIZWlnaHQgPiBzY3JvbGwuY2xpZW50SGVpZ2h0KSkgcmV0dXJuO1xuXG4gICAgLy8gV2Via2l0IGJyb3dzZXJzIG9uIE9TIFggYWJvcnQgbW9tZW50dW0gc2Nyb2xscyB3aGVuIHRoZSB0YXJnZXRcbiAgICAvLyBvZiB0aGUgc2Nyb2xsIGV2ZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgc2Nyb2xsYWJsZSBlbGVtZW50LlxuICAgIC8vIFRoaXMgaGFjayAoc2VlIHJlbGF0ZWQgY29kZSBpbiBwYXRjaERpc3BsYXkpIG1ha2VzIHN1cmUgdGhlXG4gICAgLy8gZWxlbWVudCBpcyBrZXB0IGFyb3VuZC5cbiAgICBpZiAoZHkgJiYgbWFjICYmIHdlYmtpdCkge1xuICAgICAgb3V0ZXI6IGZvciAodmFyIGN1ciA9IGUudGFyZ2V0LCB2aWV3ID0gZGlzcGxheS52aWV3OyBjdXIgIT0gc2Nyb2xsOyBjdXIgPSBjdXIucGFyZW50Tm9kZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodmlld1tpXS5ub2RlID09IGN1cikge1xuICAgICAgICAgICAgY20uZGlzcGxheS5jdXJyZW50V2hlZWxUYXJnZXQgPSBjdXI7XG4gICAgICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPbiBzb21lIGJyb3dzZXJzLCBob3Jpem9udGFsIHNjcm9sbGluZyB3aWxsIGNhdXNlIHJlZHJhd3MgdG9cbiAgICAvLyBoYXBwZW4gYmVmb3JlIHRoZSBndXR0ZXIgaGFzIGJlZW4gcmVhbGlnbmVkLCBjYXVzaW5nIGl0IHRvXG4gICAgLy8gd3JpZ2dsZSBhcm91bmQgaW4gYSBtb3N0IHVuc2VlbWx5IHdheS4gV2hlbiB3ZSBoYXZlIGFuXG4gICAgLy8gZXN0aW1hdGVkIHBpeGVscy9kZWx0YSB2YWx1ZSwgd2UganVzdCBoYW5kbGUgaG9yaXpvbnRhbFxuICAgIC8vIHNjcm9sbGluZyBlbnRpcmVseSBoZXJlLiBJdCdsbCBiZSBzbGlnaHRseSBvZmYgZnJvbSBuYXRpdmUsIGJ1dFxuICAgIC8vIGJldHRlciB0aGFuIGdsaXRjaGluZyBvdXQuXG4gICAgaWYgKGR4ICYmICFnZWNrbyAmJiAhcHJlc3RvICYmIHdoZWVsUGl4ZWxzUGVyVW5pdCAhPSBudWxsKSB7XG4gICAgICBpZiAoZHkpXG4gICAgICAgIHNldFNjcm9sbFRvcChjbSwgTWF0aC5tYXgoMCwgTWF0aC5taW4oc2Nyb2xsLnNjcm9sbFRvcCArIGR5ICogd2hlZWxQaXhlbHNQZXJVbml0LCBzY3JvbGwuc2Nyb2xsSGVpZ2h0IC0gc2Nyb2xsLmNsaWVudEhlaWdodCkpKTtcbiAgICAgIHNldFNjcm9sbExlZnQoY20sIE1hdGgubWF4KDAsIE1hdGgubWluKHNjcm9sbC5zY3JvbGxMZWZ0ICsgZHggKiB3aGVlbFBpeGVsc1BlclVuaXQsIHNjcm9sbC5zY3JvbGxXaWR0aCAtIHNjcm9sbC5jbGllbnRXaWR0aCkpKTtcbiAgICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgICBkaXNwbGF5LndoZWVsU3RhcnRYID0gbnVsbDsgLy8gQWJvcnQgbWVhc3VyZW1lbnQsIGlmIGluIHByb2dyZXNzXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gJ1Byb2plY3QnIHRoZSB2aXNpYmxlIHZpZXdwb3J0IHRvIGNvdmVyIHRoZSBhcmVhIHRoYXQgaXMgYmVpbmdcbiAgICAvLyBzY3JvbGxlZCBpbnRvIHZpZXcgKGlmIHdlIGtub3cgZW5vdWdoIHRvIGVzdGltYXRlIGl0KS5cbiAgICBpZiAoZHkgJiYgd2hlZWxQaXhlbHNQZXJVbml0ICE9IG51bGwpIHtcbiAgICAgIHZhciBwaXhlbHMgPSBkeSAqIHdoZWVsUGl4ZWxzUGVyVW5pdDtcbiAgICAgIHZhciB0b3AgPSBjbS5kb2Muc2Nyb2xsVG9wLCBib3QgPSB0b3AgKyBkaXNwbGF5LndyYXBwZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgaWYgKHBpeGVscyA8IDApIHRvcCA9IE1hdGgubWF4KDAsIHRvcCArIHBpeGVscyAtIDUwKTtcbiAgICAgIGVsc2UgYm90ID0gTWF0aC5taW4oY20uZG9jLmhlaWdodCwgYm90ICsgcGl4ZWxzICsgNTApO1xuICAgICAgdXBkYXRlRGlzcGxheShjbSwge3RvcDogdG9wLCBib3R0b206IGJvdH0pO1xuICAgIH1cblxuICAgIGlmICh3aGVlbFNhbXBsZXMgPCAyMCkge1xuICAgICAgaWYgKGRpc3BsYXkud2hlZWxTdGFydFggPT0gbnVsbCkge1xuICAgICAgICBkaXNwbGF5LndoZWVsU3RhcnRYID0gc2Nyb2xsLnNjcm9sbExlZnQ7IGRpc3BsYXkud2hlZWxTdGFydFkgPSBzY3JvbGwuc2Nyb2xsVG9wO1xuICAgICAgICBkaXNwbGF5LndoZWVsRFggPSBkeDsgZGlzcGxheS53aGVlbERZID0gZHk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGRpc3BsYXkud2hlZWxTdGFydFggPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgIHZhciBtb3ZlZFggPSBzY3JvbGwuc2Nyb2xsTGVmdCAtIGRpc3BsYXkud2hlZWxTdGFydFg7XG4gICAgICAgICAgdmFyIG1vdmVkWSA9IHNjcm9sbC5zY3JvbGxUb3AgLSBkaXNwbGF5LndoZWVsU3RhcnRZO1xuICAgICAgICAgIHZhciBzYW1wbGUgPSAobW92ZWRZICYmIGRpc3BsYXkud2hlZWxEWSAmJiBtb3ZlZFkgLyBkaXNwbGF5LndoZWVsRFkpIHx8XG4gICAgICAgICAgICAobW92ZWRYICYmIGRpc3BsYXkud2hlZWxEWCAmJiBtb3ZlZFggLyBkaXNwbGF5LndoZWVsRFgpO1xuICAgICAgICAgIGRpc3BsYXkud2hlZWxTdGFydFggPSBkaXNwbGF5LndoZWVsU3RhcnRZID0gbnVsbDtcbiAgICAgICAgICBpZiAoIXNhbXBsZSkgcmV0dXJuO1xuICAgICAgICAgIHdoZWVsUGl4ZWxzUGVyVW5pdCA9ICh3aGVlbFBpeGVsc1BlclVuaXQgKiB3aGVlbFNhbXBsZXMgKyBzYW1wbGUpIC8gKHdoZWVsU2FtcGxlcyArIDEpO1xuICAgICAgICAgICsrd2hlZWxTYW1wbGVzO1xuICAgICAgICB9LCAyMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheS53aGVlbERYICs9IGR4OyBkaXNwbGF5LndoZWVsRFkgKz0gZHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gS0VZIEVWRU5UU1xuXG4gIC8vIFJ1biBhIGhhbmRsZXIgdGhhdCB3YXMgYm91bmQgdG8gYSBrZXkuXG4gIGZ1bmN0aW9uIGRvSGFuZGxlQmluZGluZyhjbSwgYm91bmQsIGRyb3BTaGlmdCkge1xuICAgIGlmICh0eXBlb2YgYm91bmQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgYm91bmQgPSBjb21tYW5kc1tib3VuZF07XG4gICAgICBpZiAoIWJvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEVuc3VyZSBwcmV2aW91cyBpbnB1dCBoYXMgYmVlbiByZWFkLCBzbyB0aGF0IHRoZSBoYW5kbGVyIHNlZXMgYVxuICAgIC8vIGNvbnNpc3RlbnQgdmlldyBvZiB0aGUgZG9jdW1lbnRcbiAgICBpZiAoY20uZGlzcGxheS5wb2xsaW5nRmFzdCAmJiByZWFkSW5wdXQoY20pKSBjbS5kaXNwbGF5LnBvbGxpbmdGYXN0ID0gZmFsc2U7XG4gICAgdmFyIHByZXZTaGlmdCA9IGNtLmRpc3BsYXkuc2hpZnQsIGRvbmUgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgaWYgKGlzUmVhZE9ubHkoY20pKSBjbS5zdGF0ZS5zdXBwcmVzc0VkaXRzID0gdHJ1ZTtcbiAgICAgIGlmIChkcm9wU2hpZnQpIGNtLmRpc3BsYXkuc2hpZnQgPSBmYWxzZTtcbiAgICAgIGRvbmUgPSBib3VuZChjbSkgIT0gUGFzcztcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY20uZGlzcGxheS5zaGlmdCA9IHByZXZTaGlmdDtcbiAgICAgIGNtLnN0YXRlLnN1cHByZXNzRWRpdHMgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbmU7XG4gIH1cblxuICAvLyBDb2xsZWN0IHRoZSBjdXJyZW50bHkgYWN0aXZlIGtleW1hcHMuXG4gIGZ1bmN0aW9uIGFsbEtleU1hcHMoY20pIHtcbiAgICB2YXIgbWFwcyA9IGNtLnN0YXRlLmtleU1hcHMuc2xpY2UoMCk7XG4gICAgaWYgKGNtLm9wdGlvbnMuZXh0cmFLZXlzKSBtYXBzLnB1c2goY20ub3B0aW9ucy5leHRyYUtleXMpO1xuICAgIG1hcHMucHVzaChjbS5vcHRpb25zLmtleU1hcCk7XG4gICAgcmV0dXJuIG1hcHM7XG4gIH1cblxuICB2YXIgbWF5YmVUcmFuc2l0aW9uO1xuICAvLyBIYW5kbGUgYSBrZXkgZnJvbSB0aGUga2V5ZG93biBldmVudC5cbiAgZnVuY3Rpb24gaGFuZGxlS2V5QmluZGluZyhjbSwgZSkge1xuICAgIC8vIEhhbmRsZSBhdXRvbWF0aWMga2V5bWFwIHRyYW5zaXRpb25zXG4gICAgdmFyIHN0YXJ0TWFwID0gZ2V0S2V5TWFwKGNtLm9wdGlvbnMua2V5TWFwKSwgbmV4dCA9IHN0YXJ0TWFwLmF1dG87XG4gICAgY2xlYXJUaW1lb3V0KG1heWJlVHJhbnNpdGlvbik7XG4gICAgaWYgKG5leHQgJiYgIWlzTW9kaWZpZXJLZXkoZSkpIG1heWJlVHJhbnNpdGlvbiA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZ2V0S2V5TWFwKGNtLm9wdGlvbnMua2V5TWFwKSA9PSBzdGFydE1hcCkge1xuICAgICAgICBjbS5vcHRpb25zLmtleU1hcCA9IChuZXh0LmNhbGwgPyBuZXh0LmNhbGwobnVsbCwgY20pIDogbmV4dCk7XG4gICAgICAgIGtleU1hcENoYW5nZWQoY20pO1xuICAgICAgfVxuICAgIH0sIDUwKTtcblxuICAgIHZhciBuYW1lID0ga2V5TmFtZShlLCB0cnVlKSwgaGFuZGxlZCA9IGZhbHNlO1xuICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBrZXltYXBzID0gYWxsS2V5TWFwcyhjbSk7XG5cbiAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgLy8gRmlyc3QgdHJ5IHRvIHJlc29sdmUgZnVsbCBuYW1lIChpbmNsdWRpbmcgJ1NoaWZ0LScpLiBGYWlsaW5nXG4gICAgICAvLyB0aGF0LCBzZWUgaWYgdGhlcmUgaXMgYSBjdXJzb3ItbW90aW9uIGNvbW1hbmQgKHN0YXJ0aW5nIHdpdGhcbiAgICAgIC8vICdnbycpIGJvdW5kIHRvIHRoZSBrZXluYW1lIHdpdGhvdXQgJ1NoaWZ0LScuXG4gICAgICBoYW5kbGVkID0gbG9va3VwS2V5KFwiU2hpZnQtXCIgKyBuYW1lLCBrZXltYXBzLCBmdW5jdGlvbihiKSB7cmV0dXJuIGRvSGFuZGxlQmluZGluZyhjbSwgYiwgdHJ1ZSk7fSlcbiAgICAgICAgICAgICB8fCBsb29rdXBLZXkobmFtZSwga2V5bWFwcywgZnVuY3Rpb24oYikge1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09IFwic3RyaW5nXCIgPyAvXmdvW0EtWl0vLnRlc3QoYikgOiBiLm1vdGlvbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvSGFuZGxlQmluZGluZyhjbSwgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZWQgPSBsb29rdXBLZXkobmFtZSwga2V5bWFwcywgZnVuY3Rpb24oYikgeyByZXR1cm4gZG9IYW5kbGVCaW5kaW5nKGNtLCBiKTsgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgICByZXN0YXJ0QmxpbmsoY20pO1xuICAgICAgc2lnbmFsTGF0ZXIoY20sIFwia2V5SGFuZGxlZFwiLCBjbSwgbmFtZSwgZSk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVkO1xuICB9XG5cbiAgLy8gSGFuZGxlIGEga2V5IGZyb20gdGhlIGtleXByZXNzIGV2ZW50XG4gIGZ1bmN0aW9uIGhhbmRsZUNoYXJCaW5kaW5nKGNtLCBlLCBjaCkge1xuICAgIHZhciBoYW5kbGVkID0gbG9va3VwS2V5KFwiJ1wiICsgY2ggKyBcIidcIiwgYWxsS2V5TWFwcyhjbSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYikgeyByZXR1cm4gZG9IYW5kbGVCaW5kaW5nKGNtLCBiLCB0cnVlKTsgfSk7XG4gICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgIGVfcHJldmVudERlZmF1bHQoZSk7XG4gICAgICByZXN0YXJ0QmxpbmsoY20pO1xuICAgICAgc2lnbmFsTGF0ZXIoY20sIFwia2V5SGFuZGxlZFwiLCBjbSwgXCInXCIgKyBjaCArIFwiJ1wiLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZWQ7XG4gIH1cblxuICB2YXIgbGFzdFN0b3BwZWRLZXkgPSBudWxsO1xuICBmdW5jdGlvbiBvbktleURvd24oZSkge1xuICAgIHZhciBjbSA9IHRoaXM7XG4gICAgZW5zdXJlRm9jdXMoY20pO1xuICAgIGlmIChzaWduYWxET01FdmVudChjbSwgZSkpIHJldHVybjtcbiAgICAvLyBJRSBkb2VzIHN0cmFuZ2UgdGhpbmdzIHdpdGggZXNjYXBlLlxuICAgIGlmIChpZV91cHRvMTAgJiYgZS5rZXlDb2RlID09IDI3KSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgdmFyIGNvZGUgPSBlLmtleUNvZGU7XG4gICAgY20uZGlzcGxheS5zaGlmdCA9IGNvZGUgPT0gMTYgfHwgZS5zaGlmdEtleTtcbiAgICB2YXIgaGFuZGxlZCA9IGhhbmRsZUtleUJpbmRpbmcoY20sIGUpO1xuICAgIGlmIChwcmVzdG8pIHtcbiAgICAgIGxhc3RTdG9wcGVkS2V5ID0gaGFuZGxlZCA/IGNvZGUgOiBudWxsO1xuICAgICAgLy8gT3BlcmEgaGFzIG5vIGN1dCBldmVudC4uLiB3ZSB0cnkgdG8gYXQgbGVhc3QgY2F0Y2ggdGhlIGtleSBjb21ib1xuICAgICAgaWYgKCFoYW5kbGVkICYmIGNvZGUgPT0gODggJiYgIWhhc0NvcHlFdmVudCAmJiAobWFjID8gZS5tZXRhS2V5IDogZS5jdHJsS2V5KSlcbiAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbihcIlwiLCBudWxsLCBcImN1dFwiKTtcbiAgICB9XG5cbiAgICAvLyBUdXJuIG1vdXNlIGludG8gY3Jvc3NoYWlyIHdoZW4gQWx0IGlzIGhlbGQgb24gTWFjLlxuICAgIGlmIChjb2RlID09IDE4ICYmICEvXFxiQ29kZU1pcnJvci1jcm9zc2hhaXJcXGIvLnRlc3QoY20uZGlzcGxheS5saW5lRGl2LmNsYXNzTmFtZSkpXG4gICAgICBzaG93Q3Jvc3NIYWlyKGNtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dDcm9zc0hhaXIoY20pIHtcbiAgICB2YXIgbGluZURpdiA9IGNtLmRpc3BsYXkubGluZURpdjtcbiAgICBhZGRDbGFzcyhsaW5lRGl2LCBcIkNvZGVNaXJyb3ItY3Jvc3NoYWlyXCIpO1xuXG4gICAgZnVuY3Rpb24gdXAoZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PSAxOCB8fCAhZS5hbHRLZXkpIHtcbiAgICAgICAgcm1DbGFzcyhsaW5lRGl2LCBcIkNvZGVNaXJyb3ItY3Jvc3NoYWlyXCIpO1xuICAgICAgICBvZmYoZG9jdW1lbnQsIFwia2V5dXBcIiwgdXApO1xuICAgICAgICBvZmYoZG9jdW1lbnQsIFwibW91c2VvdmVyXCIsIHVwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgb24oZG9jdW1lbnQsIFwia2V5dXBcIiwgdXApO1xuICAgIG9uKGRvY3VtZW50LCBcIm1vdXNlb3ZlclwiLCB1cCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbktleVVwKGUpIHtcbiAgICBpZiAoc2lnbmFsRE9NRXZlbnQodGhpcywgZSkpIHJldHVybjtcbiAgICBpZiAoZS5rZXlDb2RlID09IDE2KSB0aGlzLmRvYy5zZWwuc2hpZnQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uS2V5UHJlc3MoZSkge1xuICAgIHZhciBjbSA9IHRoaXM7XG4gICAgaWYgKHNpZ25hbERPTUV2ZW50KGNtLCBlKSkgcmV0dXJuO1xuICAgIHZhciBrZXlDb2RlID0gZS5rZXlDb2RlLCBjaGFyQ29kZSA9IGUuY2hhckNvZGU7XG4gICAgaWYgKHByZXN0byAmJiBrZXlDb2RlID09IGxhc3RTdG9wcGVkS2V5KSB7bGFzdFN0b3BwZWRLZXkgPSBudWxsOyBlX3ByZXZlbnREZWZhdWx0KGUpOyByZXR1cm47fVxuICAgIGlmICgoKHByZXN0byAmJiAoIWUud2hpY2ggfHwgZS53aGljaCA8IDEwKSkgfHwga2h0bWwpICYmIGhhbmRsZUtleUJpbmRpbmcoY20sIGUpKSByZXR1cm47XG4gICAgdmFyIGNoID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyQ29kZSA9PSBudWxsID8ga2V5Q29kZSA6IGNoYXJDb2RlKTtcbiAgICBpZiAoaGFuZGxlQ2hhckJpbmRpbmcoY20sIGUsIGNoKSkgcmV0dXJuO1xuICAgIGlmIChpZSAmJiAhaWVfdXB0bzgpIGNtLmRpc3BsYXkuaW5wdXRIYXNTZWxlY3Rpb24gPSBudWxsO1xuICAgIGZhc3RQb2xsKGNtKTtcbiAgfVxuXG4gIC8vIEZPQ1VTL0JMVVIgRVZFTlRTXG5cbiAgZnVuY3Rpb24gb25Gb2N1cyhjbSkge1xuICAgIGlmIChjbS5vcHRpb25zLnJlYWRPbmx5ID09IFwibm9jdXJzb3JcIikgcmV0dXJuO1xuICAgIGlmICghY20uc3RhdGUuZm9jdXNlZCkge1xuICAgICAgc2lnbmFsKGNtLCBcImZvY3VzXCIsIGNtKTtcbiAgICAgIGNtLnN0YXRlLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgYWRkQ2xhc3MoY20uZGlzcGxheS53cmFwcGVyLCBcIkNvZGVNaXJyb3ItZm9jdXNlZFwiKTtcbiAgICAgIC8vIFRoZSBwcmV2SW5wdXQgdGVzdCBwcmV2ZW50cyB0aGlzIGZyb20gZmlyaW5nIHdoZW4gYSBjb250ZXh0XG4gICAgICAvLyBtZW51IGlzIGNsb3NlZCAoc2luY2UgdGhlIHJlc2V0SW5wdXQgd291bGQga2lsbCB0aGVcbiAgICAgIC8vIHNlbGVjdC1hbGwgZGV0ZWN0aW9uIGhhY2spXG4gICAgICBpZiAoIWNtLmN1ck9wICYmIGNtLmRpc3BsYXkuc2VsRm9yQ29udGV4dE1lbnUgIT0gY20uZG9jLnNlbCkge1xuICAgICAgICByZXNldElucHV0KGNtKTtcbiAgICAgICAgaWYgKHdlYmtpdCkgc2V0VGltZW91dChiaW5kKHJlc2V0SW5wdXQsIGNtLCB0cnVlKSwgMCk7IC8vIElzc3VlICMxNzMwXG4gICAgICB9XG4gICAgfVxuICAgIHNsb3dQb2xsKGNtKTtcbiAgICByZXN0YXJ0QmxpbmsoY20pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQmx1cihjbSkge1xuICAgIGlmIChjbS5zdGF0ZS5mb2N1c2VkKSB7XG4gICAgICBzaWduYWwoY20sIFwiYmx1clwiLCBjbSk7XG4gICAgICBjbS5zdGF0ZS5mb2N1c2VkID0gZmFsc2U7XG4gICAgICBybUNsYXNzKGNtLmRpc3BsYXkud3JhcHBlciwgXCJDb2RlTWlycm9yLWZvY3VzZWRcIik7XG4gICAgfVxuICAgIGNsZWFySW50ZXJ2YWwoY20uZGlzcGxheS5ibGlua2VyKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2lmICghY20uc3RhdGUuZm9jdXNlZCkgY20uZGlzcGxheS5zaGlmdCA9IGZhbHNlO30sIDE1MCk7XG4gIH1cblxuICAvLyBDT05URVhUIE1FTlUgSEFORExJTkdcblxuICAvLyBUbyBtYWtlIHRoZSBjb250ZXh0IG1lbnUgd29yaywgd2UgbmVlZCB0byBicmllZmx5IHVuaGlkZSB0aGVcbiAgLy8gdGV4dGFyZWEgKG1ha2luZyBpdCBhcyB1bm9idHJ1c2l2ZSBhcyBwb3NzaWJsZSkgdG8gbGV0IHRoZVxuICAvLyByaWdodC1jbGljayB0YWtlIGVmZmVjdCBvbiBpdC5cbiAgZnVuY3Rpb24gb25Db250ZXh0TWVudShjbSwgZSkge1xuICAgIGlmIChzaWduYWxET01FdmVudChjbSwgZSwgXCJjb250ZXh0bWVudVwiKSkgcmV0dXJuO1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheTtcbiAgICBpZiAoZXZlbnRJbldpZGdldChkaXNwbGF5LCBlKSB8fCBjb250ZXh0TWVudUluR3V0dGVyKGNtLCBlKSkgcmV0dXJuO1xuXG4gICAgdmFyIHBvcyA9IHBvc0Zyb21Nb3VzZShjbSwgZSksIHNjcm9sbFBvcyA9IGRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsVG9wO1xuICAgIGlmICghcG9zIHx8IHByZXN0bykgcmV0dXJuOyAvLyBPcGVyYSBpcyBkaWZmaWN1bHQuXG5cbiAgICAvLyBSZXNldCB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvbiBvbmx5IGlmIHRoZSBjbGljayBpcyBkb25lIG91dHNpZGUgb2YgdGhlIHNlbGVjdGlvblxuICAgIC8vIGFuZCAncmVzZXRTZWxlY3Rpb25PbkNvbnRleHRNZW51JyBvcHRpb24gaXMgdHJ1ZS5cbiAgICB2YXIgcmVzZXQgPSBjbS5vcHRpb25zLnJlc2V0U2VsZWN0aW9uT25Db250ZXh0TWVudTtcbiAgICBpZiAocmVzZXQgJiYgY20uZG9jLnNlbC5jb250YWlucyhwb3MpID09IC0xKVxuICAgICAgb3BlcmF0aW9uKGNtLCBzZXRTZWxlY3Rpb24pKGNtLmRvYywgc2ltcGxlU2VsZWN0aW9uKHBvcyksIHNlbF9kb250U2Nyb2xsKTtcblxuICAgIHZhciBvbGRDU1MgPSBkaXNwbGF5LmlucHV0LnN0eWxlLmNzc1RleHQ7XG4gICAgZGlzcGxheS5pbnB1dERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBkaXNwbGF5LmlucHV0LnN0eWxlLmNzc1RleHQgPSBcInBvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDMwcHg7IGhlaWdodDogMzBweDsgdG9wOiBcIiArIChlLmNsaWVudFkgLSA1KSArXG4gICAgICBcInB4OyBsZWZ0OiBcIiArIChlLmNsaWVudFggLSA1KSArIFwicHg7IHotaW5kZXg6IDEwMDA7IGJhY2tncm91bmQ6IFwiICtcbiAgICAgIChpZSA/IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAuMDUpXCIgOiBcInRyYW5zcGFyZW50XCIpICtcbiAgICAgIFwiOyBvdXRsaW5lOiBub25lOyBib3JkZXItd2lkdGg6IDA7IG91dGxpbmU6IG5vbmU7IG92ZXJmbG93OiBoaWRkZW47IG9wYWNpdHk6IC4wNTsgZmlsdGVyOiBhbHBoYShvcGFjaXR5PTUpO1wiO1xuICAgIGZvY3VzSW5wdXQoY20pO1xuICAgIHJlc2V0SW5wdXQoY20pO1xuICAgIC8vIEFkZHMgXCJTZWxlY3QgYWxsXCIgdG8gY29udGV4dCBtZW51IGluIEZGXG4gICAgaWYgKCFjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSBkaXNwbGF5LmlucHV0LnZhbHVlID0gZGlzcGxheS5wcmV2SW5wdXQgPSBcIiBcIjtcbiAgICBkaXNwbGF5LnNlbEZvckNvbnRleHRNZW51ID0gY20uZG9jLnNlbDtcbiAgICBjbGVhclRpbWVvdXQoZGlzcGxheS5kZXRlY3RpbmdTZWxlY3RBbGwpO1xuXG4gICAgLy8gU2VsZWN0LWFsbCB3aWxsIGJlIGdyZXllZCBvdXQgaWYgdGhlcmUncyBub3RoaW5nIHRvIHNlbGVjdCwgc29cbiAgICAvLyB0aGlzIGFkZHMgYSB6ZXJvLXdpZHRoIHNwYWNlIHNvIHRoYXQgd2UgY2FuIGxhdGVyIGNoZWNrIHdoZXRoZXJcbiAgICAvLyBpdCBnb3Qgc2VsZWN0ZWQuXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNlbGVjdEFsbEhhY2soKSB7XG4gICAgICBpZiAoZGlzcGxheS5pbnB1dC5zZWxlY3Rpb25TdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IGNtLnNvbWV0aGluZ1NlbGVjdGVkKCk7XG4gICAgICAgIHZhciBleHR2YWwgPSBkaXNwbGF5LmlucHV0LnZhbHVlID0gXCJcXHUyMDBiXCIgKyAoc2VsZWN0ZWQgPyBkaXNwbGF5LmlucHV0LnZhbHVlIDogXCJcIik7XG4gICAgICAgIGRpc3BsYXkucHJldklucHV0ID0gc2VsZWN0ZWQgPyBcIlwiIDogXCJcXHUyMDBiXCI7XG4gICAgICAgIGRpc3BsYXkuaW5wdXQuc2VsZWN0aW9uU3RhcnQgPSAxOyBkaXNwbGF5LmlucHV0LnNlbGVjdGlvbkVuZCA9IGV4dHZhbC5sZW5ndGg7XG4gICAgICAgIC8vIFJlLXNldCB0aGlzLCBpbiBjYXNlIHNvbWUgb3RoZXIgaGFuZGxlciB0b3VjaGVkIHRoZVxuICAgICAgICAvLyBzZWxlY3Rpb24gaW4gdGhlIG1lYW50aW1lLlxuICAgICAgICBkaXNwbGF5LnNlbEZvckNvbnRleHRNZW51ID0gY20uZG9jLnNlbDtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVoaWRlKCkge1xuICAgICAgZGlzcGxheS5pbnB1dERpdi5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgIGRpc3BsYXkuaW5wdXQuc3R5bGUuY3NzVGV4dCA9IG9sZENTUztcbiAgICAgIGlmIChpZV91cHRvOCkgZGlzcGxheS5zY3JvbGxiYXJWLnNjcm9sbFRvcCA9IGRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsVG9wID0gc2Nyb2xsUG9zO1xuICAgICAgc2xvd1BvbGwoY20pO1xuXG4gICAgICAvLyBUcnkgdG8gZGV0ZWN0IHRoZSB1c2VyIGNob29zaW5nIHNlbGVjdC1hbGxcbiAgICAgIGlmIChkaXNwbGF5LmlucHV0LnNlbGVjdGlvblN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCFpZSB8fCBpZV91cHRvOCkgcHJlcGFyZVNlbGVjdEFsbEhhY2soKTtcbiAgICAgICAgdmFyIGkgPSAwLCBwb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGRpc3BsYXkuc2VsRm9yQ29udGV4dE1lbnUgPT0gY20uZG9jLnNlbCAmJiBkaXNwbGF5LmlucHV0LnNlbGVjdGlvblN0YXJ0ID09IDApXG4gICAgICAgICAgICBvcGVyYXRpb24oY20sIGNvbW1hbmRzLnNlbGVjdEFsbCkoY20pO1xuICAgICAgICAgIGVsc2UgaWYgKGkrKyA8IDEwKSBkaXNwbGF5LmRldGVjdGluZ1NlbGVjdEFsbCA9IHNldFRpbWVvdXQocG9sbCwgNTAwKTtcbiAgICAgICAgICBlbHNlIHJlc2V0SW5wdXQoY20pO1xuICAgICAgICB9O1xuICAgICAgICBkaXNwbGF5LmRldGVjdGluZ1NlbGVjdEFsbCA9IHNldFRpbWVvdXQocG9sbCwgMjAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaWUgJiYgIWllX3VwdG84KSBwcmVwYXJlU2VsZWN0QWxsSGFjaygpO1xuICAgIGlmIChjYXB0dXJlUmlnaHRDbGljaykge1xuICAgICAgZV9zdG9wKGUpO1xuICAgICAgdmFyIG1vdXNldXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgb2ZmKHdpbmRvdywgXCJtb3VzZXVwXCIsIG1vdXNldXApO1xuICAgICAgICBzZXRUaW1lb3V0KHJlaGlkZSwgMjApO1xuICAgICAgfTtcbiAgICAgIG9uKHdpbmRvdywgXCJtb3VzZXVwXCIsIG1vdXNldXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KHJlaGlkZSwgNTApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnRleHRNZW51SW5HdXR0ZXIoY20sIGUpIHtcbiAgICBpZiAoIWhhc0hhbmRsZXIoY20sIFwiZ3V0dGVyQ29udGV4dE1lbnVcIikpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gZ3V0dGVyRXZlbnQoY20sIGUsIFwiZ3V0dGVyQ29udGV4dE1lbnVcIiwgZmFsc2UsIHNpZ25hbCk7XG4gIH1cblxuICAvLyBVUERBVElOR1xuXG4gIC8vIENvbXB1dGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbmQgb2YgYSBjaGFuZ2UgKGl0cyAndG8nIHByb3BlcnR5XG4gIC8vIHJlZmVycyB0byB0aGUgcHJlLWNoYW5nZSBlbmQpLlxuICB2YXIgY2hhbmdlRW5kID0gQ29kZU1pcnJvci5jaGFuZ2VFbmQgPSBmdW5jdGlvbihjaGFuZ2UpIHtcbiAgICBpZiAoIWNoYW5nZS50ZXh0KSByZXR1cm4gY2hhbmdlLnRvO1xuICAgIHJldHVybiBQb3MoY2hhbmdlLmZyb20ubGluZSArIGNoYW5nZS50ZXh0Lmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgICBsc3QoY2hhbmdlLnRleHQpLmxlbmd0aCArIChjaGFuZ2UudGV4dC5sZW5ndGggPT0gMSA/IGNoYW5nZS5mcm9tLmNoIDogMCkpO1xuICB9O1xuXG4gIC8vIEFkanVzdCBhIHBvc2l0aW9uIHRvIHJlZmVyIHRvIHRoZSBwb3N0LWNoYW5nZSBwb3NpdGlvbiBvZiB0aGVcbiAgLy8gc2FtZSB0ZXh0LCBvciB0aGUgZW5kIG9mIHRoZSBjaGFuZ2UgaWYgdGhlIGNoYW5nZSBjb3ZlcnMgaXQuXG4gIGZ1bmN0aW9uIGFkanVzdEZvckNoYW5nZShwb3MsIGNoYW5nZSkge1xuICAgIGlmIChjbXAocG9zLCBjaGFuZ2UuZnJvbSkgPCAwKSByZXR1cm4gcG9zO1xuICAgIGlmIChjbXAocG9zLCBjaGFuZ2UudG8pIDw9IDApIHJldHVybiBjaGFuZ2VFbmQoY2hhbmdlKTtcblxuICAgIHZhciBsaW5lID0gcG9zLmxpbmUgKyBjaGFuZ2UudGV4dC5sZW5ndGggLSAoY2hhbmdlLnRvLmxpbmUgLSBjaGFuZ2UuZnJvbS5saW5lKSAtIDEsIGNoID0gcG9zLmNoO1xuICAgIGlmIChwb3MubGluZSA9PSBjaGFuZ2UudG8ubGluZSkgY2ggKz0gY2hhbmdlRW5kKGNoYW5nZSkuY2ggLSBjaGFuZ2UudG8uY2g7XG4gICAgcmV0dXJuIFBvcyhsaW5lLCBjaCk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wdXRlU2VsQWZ0ZXJDaGFuZ2UoZG9jLCBjaGFuZ2UpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb2Muc2VsLnJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJhbmdlID0gZG9jLnNlbC5yYW5nZXNbaV07XG4gICAgICBvdXQucHVzaChuZXcgUmFuZ2UoYWRqdXN0Rm9yQ2hhbmdlKHJhbmdlLmFuY2hvciwgY2hhbmdlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RGb3JDaGFuZ2UocmFuZ2UuaGVhZCwgY2hhbmdlKSkpO1xuICAgIH1cbiAgICByZXR1cm4gbm9ybWFsaXplU2VsZWN0aW9uKG91dCwgZG9jLnNlbC5wcmltSW5kZXgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2Zmc2V0UG9zKHBvcywgb2xkLCBudykge1xuICAgIGlmIChwb3MubGluZSA9PSBvbGQubGluZSlcbiAgICAgIHJldHVybiBQb3MobncubGluZSwgcG9zLmNoIC0gb2xkLmNoICsgbncuY2gpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBQb3MobncubGluZSArIChwb3MubGluZSAtIG9sZC5saW5lKSwgcG9zLmNoKTtcbiAgfVxuXG4gIC8vIFVzZWQgYnkgcmVwbGFjZVNlbGVjdGlvbnMgdG8gYWxsb3cgbW92aW5nIHRoZSBzZWxlY3Rpb24gdG8gdGhlXG4gIC8vIHN0YXJ0IG9yIGFyb3VuZCB0aGUgcmVwbGFjZWQgdGVzdC4gSGludCBtYXkgYmUgXCJzdGFydFwiIG9yIFwiYXJvdW5kXCIuXG4gIGZ1bmN0aW9uIGNvbXB1dGVSZXBsYWNlZFNlbChkb2MsIGNoYW5nZXMsIGhpbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIG9sZFByZXYgPSBQb3MoZG9jLmZpcnN0LCAwKSwgbmV3UHJldiA9IG9sZFByZXY7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICAgIHZhciBmcm9tID0gb2Zmc2V0UG9zKGNoYW5nZS5mcm9tLCBvbGRQcmV2LCBuZXdQcmV2KTtcbiAgICAgIHZhciB0byA9IG9mZnNldFBvcyhjaGFuZ2VFbmQoY2hhbmdlKSwgb2xkUHJldiwgbmV3UHJldik7XG4gICAgICBvbGRQcmV2ID0gY2hhbmdlLnRvO1xuICAgICAgbmV3UHJldiA9IHRvO1xuICAgICAgaWYgKGhpbnQgPT0gXCJhcm91bmRcIikge1xuICAgICAgICB2YXIgcmFuZ2UgPSBkb2Muc2VsLnJhbmdlc1tpXSwgaW52ID0gY21wKHJhbmdlLmhlYWQsIHJhbmdlLmFuY2hvcikgPCAwO1xuICAgICAgICBvdXRbaV0gPSBuZXcgUmFuZ2UoaW52ID8gdG8gOiBmcm9tLCBpbnYgPyBmcm9tIDogdG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0W2ldID0gbmV3IFJhbmdlKGZyb20sIGZyb20pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFNlbGVjdGlvbihvdXQsIGRvYy5zZWwucHJpbUluZGV4KTtcbiAgfVxuXG4gIC8vIEFsbG93IFwiYmVmb3JlQ2hhbmdlXCIgZXZlbnQgaGFuZGxlcnMgdG8gaW5mbHVlbmNlIGEgY2hhbmdlXG4gIGZ1bmN0aW9uIGZpbHRlckNoYW5nZShkb2MsIGNoYW5nZSwgdXBkYXRlKSB7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNhbmNlbGVkOiBmYWxzZSxcbiAgICAgIGZyb206IGNoYW5nZS5mcm9tLFxuICAgICAgdG86IGNoYW5nZS50byxcbiAgICAgIHRleHQ6IGNoYW5nZS50ZXh0LFxuICAgICAgb3JpZ2luOiBjaGFuZ2Uub3JpZ2luLFxuICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHsgdGhpcy5jYW5jZWxlZCA9IHRydWU7IH1cbiAgICB9O1xuICAgIGlmICh1cGRhdGUpIG9iai51cGRhdGUgPSBmdW5jdGlvbihmcm9tLCB0bywgdGV4dCwgb3JpZ2luKSB7XG4gICAgICBpZiAoZnJvbSkgdGhpcy5mcm9tID0gY2xpcFBvcyhkb2MsIGZyb20pO1xuICAgICAgaWYgKHRvKSB0aGlzLnRvID0gY2xpcFBvcyhkb2MsIHRvKTtcbiAgICAgIGlmICh0ZXh0KSB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgaWYgKG9yaWdpbiAhPT0gdW5kZWZpbmVkKSB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICB9O1xuICAgIHNpZ25hbChkb2MsIFwiYmVmb3JlQ2hhbmdlXCIsIGRvYywgb2JqKTtcbiAgICBpZiAoZG9jLmNtKSBzaWduYWwoZG9jLmNtLCBcImJlZm9yZUNoYW5nZVwiLCBkb2MuY20sIG9iaik7XG5cbiAgICBpZiAob2JqLmNhbmNlbGVkKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4ge2Zyb206IG9iai5mcm9tLCB0bzogb2JqLnRvLCB0ZXh0OiBvYmoudGV4dCwgb3JpZ2luOiBvYmoub3JpZ2lufTtcbiAgfVxuXG4gIC8vIEFwcGx5IGEgY2hhbmdlIHRvIGEgZG9jdW1lbnQsIGFuZCBhZGQgaXQgdG8gdGhlIGRvY3VtZW50J3NcbiAgLy8gaGlzdG9yeSwgYW5kIHByb3BhZ2F0aW5nIGl0IHRvIGFsbCBsaW5rZWQgZG9jdW1lbnRzLlxuICBmdW5jdGlvbiBtYWtlQ2hhbmdlKGRvYywgY2hhbmdlLCBpZ25vcmVSZWFkT25seSkge1xuICAgIGlmIChkb2MuY20pIHtcbiAgICAgIGlmICghZG9jLmNtLmN1ck9wKSByZXR1cm4gb3BlcmF0aW9uKGRvYy5jbSwgbWFrZUNoYW5nZSkoZG9jLCBjaGFuZ2UsIGlnbm9yZVJlYWRPbmx5KTtcbiAgICAgIGlmIChkb2MuY20uc3RhdGUuc3VwcHJlc3NFZGl0cykgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYXNIYW5kbGVyKGRvYywgXCJiZWZvcmVDaGFuZ2VcIikgfHwgZG9jLmNtICYmIGhhc0hhbmRsZXIoZG9jLmNtLCBcImJlZm9yZUNoYW5nZVwiKSkge1xuICAgICAgY2hhbmdlID0gZmlsdGVyQ2hhbmdlKGRvYywgY2hhbmdlLCB0cnVlKTtcbiAgICAgIGlmICghY2hhbmdlKSByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUG9zc2libHkgc3BsaXQgb3Igc3VwcHJlc3MgdGhlIHVwZGF0ZSBiYXNlZCBvbiB0aGUgcHJlc2VuY2VcbiAgICAvLyBvZiByZWFkLW9ubHkgc3BhbnMgaW4gaXRzIHJhbmdlLlxuICAgIHZhciBzcGxpdCA9IHNhd1JlYWRPbmx5U3BhbnMgJiYgIWlnbm9yZVJlYWRPbmx5ICYmIHJlbW92ZVJlYWRPbmx5UmFuZ2VzKGRvYywgY2hhbmdlLmZyb20sIGNoYW5nZS50byk7XG4gICAgaWYgKHNwbGl0KSB7XG4gICAgICBmb3IgKHZhciBpID0gc3BsaXQubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpXG4gICAgICAgIG1ha2VDaGFuZ2VJbm5lcihkb2MsIHtmcm9tOiBzcGxpdFtpXS5mcm9tLCB0bzogc3BsaXRbaV0udG8sIHRleHQ6IGkgPyBbXCJcIl0gOiBjaGFuZ2UudGV4dH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYWtlQ2hhbmdlSW5uZXIoZG9jLCBjaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VDaGFuZ2VJbm5lcihkb2MsIGNoYW5nZSkge1xuICAgIGlmIChjaGFuZ2UudGV4dC5sZW5ndGggPT0gMSAmJiBjaGFuZ2UudGV4dFswXSA9PSBcIlwiICYmIGNtcChjaGFuZ2UuZnJvbSwgY2hhbmdlLnRvKSA9PSAwKSByZXR1cm47XG4gICAgdmFyIHNlbEFmdGVyID0gY29tcHV0ZVNlbEFmdGVyQ2hhbmdlKGRvYywgY2hhbmdlKTtcbiAgICBhZGRDaGFuZ2VUb0hpc3RvcnkoZG9jLCBjaGFuZ2UsIHNlbEFmdGVyLCBkb2MuY20gPyBkb2MuY20uY3VyT3AuaWQgOiBOYU4pO1xuXG4gICAgbWFrZUNoYW5nZVNpbmdsZURvYyhkb2MsIGNoYW5nZSwgc2VsQWZ0ZXIsIHN0cmV0Y2hTcGFuc092ZXJDaGFuZ2UoZG9jLCBjaGFuZ2UpKTtcbiAgICB2YXIgcmViYXNlZCA9IFtdO1xuXG4gICAgbGlua2VkRG9jcyhkb2MsIGZ1bmN0aW9uKGRvYywgc2hhcmVkSGlzdCkge1xuICAgICAgaWYgKCFzaGFyZWRIaXN0ICYmIGluZGV4T2YocmViYXNlZCwgZG9jLmhpc3RvcnkpID09IC0xKSB7XG4gICAgICAgIHJlYmFzZUhpc3QoZG9jLmhpc3RvcnksIGNoYW5nZSk7XG4gICAgICAgIHJlYmFzZWQucHVzaChkb2MuaGlzdG9yeSk7XG4gICAgICB9XG4gICAgICBtYWtlQ2hhbmdlU2luZ2xlRG9jKGRvYywgY2hhbmdlLCBudWxsLCBzdHJldGNoU3BhbnNPdmVyQ2hhbmdlKGRvYywgY2hhbmdlKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBSZXZlcnQgYSBjaGFuZ2Ugc3RvcmVkIGluIGEgZG9jdW1lbnQncyBoaXN0b3J5LlxuICBmdW5jdGlvbiBtYWtlQ2hhbmdlRnJvbUhpc3RvcnkoZG9jLCB0eXBlLCBhbGxvd1NlbGVjdGlvbk9ubHkpIHtcbiAgICBpZiAoZG9jLmNtICYmIGRvYy5jbS5zdGF0ZS5zdXBwcmVzc0VkaXRzKSByZXR1cm47XG5cbiAgICB2YXIgaGlzdCA9IGRvYy5oaXN0b3J5LCBldmVudCwgc2VsQWZ0ZXIgPSBkb2Muc2VsO1xuICAgIHZhciBzb3VyY2UgPSB0eXBlID09IFwidW5kb1wiID8gaGlzdC5kb25lIDogaGlzdC51bmRvbmUsIGRlc3QgPSB0eXBlID09IFwidW5kb1wiID8gaGlzdC51bmRvbmUgOiBoaXN0LmRvbmU7XG5cbiAgICAvLyBWZXJpZnkgdGhhdCB0aGVyZSBpcyBhIHVzZWFibGUgZXZlbnQgKHNvIHRoYXQgY3RybC16IHdvbid0XG4gICAgLy8gbmVlZGxlc3NseSBjbGVhciBzZWxlY3Rpb24gZXZlbnRzKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBldmVudCA9IHNvdXJjZVtpXTtcbiAgICAgIGlmIChhbGxvd1NlbGVjdGlvbk9ubHkgPyBldmVudC5yYW5nZXMgJiYgIWV2ZW50LmVxdWFscyhkb2Muc2VsKSA6ICFldmVudC5yYW5nZXMpXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoaSA9PSBzb3VyY2UubGVuZ3RoKSByZXR1cm47XG4gICAgaGlzdC5sYXN0T3JpZ2luID0gaGlzdC5sYXN0U2VsT3JpZ2luID0gbnVsbDtcblxuICAgIGZvciAoOzspIHtcbiAgICAgIGV2ZW50ID0gc291cmNlLnBvcCgpO1xuICAgICAgaWYgKGV2ZW50LnJhbmdlcykge1xuICAgICAgICBwdXNoU2VsZWN0aW9uVG9IaXN0b3J5KGV2ZW50LCBkZXN0KTtcbiAgICAgICAgaWYgKGFsbG93U2VsZWN0aW9uT25seSAmJiAhZXZlbnQuZXF1YWxzKGRvYy5zZWwpKSB7XG4gICAgICAgICAgc2V0U2VsZWN0aW9uKGRvYywgZXZlbnQsIHtjbGVhclJlZG86IGZhbHNlfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbEFmdGVyID0gZXZlbnQ7XG4gICAgICB9XG4gICAgICBlbHNlIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIHVwIGEgcmV2ZXJzZSBjaGFuZ2Ugb2JqZWN0IHRvIGFkZCB0byB0aGUgb3Bwb3NpdGUgaGlzdG9yeVxuICAgIC8vIHN0YWNrIChyZWRvIHdoZW4gdW5kb2luZywgYW5kIHZpY2UgdmVyc2EpLlxuICAgIHZhciBhbnRpQ2hhbmdlcyA9IFtdO1xuICAgIHB1c2hTZWxlY3Rpb25Ub0hpc3Rvcnkoc2VsQWZ0ZXIsIGRlc3QpO1xuICAgIGRlc3QucHVzaCh7Y2hhbmdlczogYW50aUNoYW5nZXMsIGdlbmVyYXRpb246IGhpc3QuZ2VuZXJhdGlvbn0pO1xuICAgIGhpc3QuZ2VuZXJhdGlvbiA9IGV2ZW50LmdlbmVyYXRpb24gfHwgKytoaXN0Lm1heEdlbmVyYXRpb247XG5cbiAgICB2YXIgZmlsdGVyID0gaGFzSGFuZGxlcihkb2MsIFwiYmVmb3JlQ2hhbmdlXCIpIHx8IGRvYy5jbSAmJiBoYXNIYW5kbGVyKGRvYy5jbSwgXCJiZWZvcmVDaGFuZ2VcIik7XG5cbiAgICBmb3IgKHZhciBpID0gZXZlbnQuY2hhbmdlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGNoYW5nZSA9IGV2ZW50LmNoYW5nZXNbaV07XG4gICAgICBjaGFuZ2Uub3JpZ2luID0gdHlwZTtcbiAgICAgIGlmIChmaWx0ZXIgJiYgIWZpbHRlckNoYW5nZShkb2MsIGNoYW5nZSwgZmFsc2UpKSB7XG4gICAgICAgIHNvdXJjZS5sZW5ndGggPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFudGlDaGFuZ2VzLnB1c2goaGlzdG9yeUNoYW5nZUZyb21DaGFuZ2UoZG9jLCBjaGFuZ2UpKTtcblxuICAgICAgdmFyIGFmdGVyID0gaSA/IGNvbXB1dGVTZWxBZnRlckNoYW5nZShkb2MsIGNoYW5nZSwgbnVsbCkgOiBsc3Qoc291cmNlKTtcbiAgICAgIG1ha2VDaGFuZ2VTaW5nbGVEb2MoZG9jLCBjaGFuZ2UsIGFmdGVyLCBtZXJnZU9sZFNwYW5zKGRvYywgY2hhbmdlKSk7XG4gICAgICBpZiAoIWkgJiYgZG9jLmNtKSBkb2MuY20uc2Nyb2xsSW50b1ZpZXcoY2hhbmdlKTtcbiAgICAgIHZhciByZWJhc2VkID0gW107XG5cbiAgICAgIC8vIFByb3BhZ2F0ZSB0byB0aGUgbGlua2VkIGRvY3VtZW50c1xuICAgICAgbGlua2VkRG9jcyhkb2MsIGZ1bmN0aW9uKGRvYywgc2hhcmVkSGlzdCkge1xuICAgICAgICBpZiAoIXNoYXJlZEhpc3QgJiYgaW5kZXhPZihyZWJhc2VkLCBkb2MuaGlzdG9yeSkgPT0gLTEpIHtcbiAgICAgICAgICByZWJhc2VIaXN0KGRvYy5oaXN0b3J5LCBjaGFuZ2UpO1xuICAgICAgICAgIHJlYmFzZWQucHVzaChkb2MuaGlzdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFrZUNoYW5nZVNpbmdsZURvYyhkb2MsIGNoYW5nZSwgbnVsbCwgbWVyZ2VPbGRTcGFucyhkb2MsIGNoYW5nZSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gU3ViLXZpZXdzIG5lZWQgdGhlaXIgbGluZSBudW1iZXJzIHNoaWZ0ZWQgd2hlbiB0ZXh0IGlzIGFkZGVkXG4gIC8vIGFib3ZlIG9yIGJlbG93IHRoZW0gaW4gdGhlIHBhcmVudCBkb2N1bWVudC5cbiAgZnVuY3Rpb24gc2hpZnREb2MoZG9jLCBkaXN0YW5jZSkge1xuICAgIGlmIChkaXN0YW5jZSA9PSAwKSByZXR1cm47XG4gICAgZG9jLmZpcnN0ICs9IGRpc3RhbmNlO1xuICAgIGRvYy5zZWwgPSBuZXcgU2VsZWN0aW9uKG1hcChkb2Muc2VsLnJhbmdlcywgZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgIHJldHVybiBuZXcgUmFuZ2UoUG9zKHJhbmdlLmFuY2hvci5saW5lICsgZGlzdGFuY2UsIHJhbmdlLmFuY2hvci5jaCksXG4gICAgICAgICAgICAgICAgICAgICAgIFBvcyhyYW5nZS5oZWFkLmxpbmUgKyBkaXN0YW5jZSwgcmFuZ2UuaGVhZC5jaCkpO1xuICAgIH0pLCBkb2Muc2VsLnByaW1JbmRleCk7XG4gICAgaWYgKGRvYy5jbSkge1xuICAgICAgcmVnQ2hhbmdlKGRvYy5jbSwgZG9jLmZpcnN0LCBkb2MuZmlyc3QgLSBkaXN0YW5jZSwgZGlzdGFuY2UpO1xuICAgICAgZm9yICh2YXIgZCA9IGRvYy5jbS5kaXNwbGF5LCBsID0gZC52aWV3RnJvbTsgbCA8IGQudmlld1RvOyBsKyspXG4gICAgICAgIHJlZ0xpbmVDaGFuZ2UoZG9jLmNtLCBsLCBcImd1dHRlclwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBNb3JlIGxvd2VyLWxldmVsIGNoYW5nZSBmdW5jdGlvbiwgaGFuZGxpbmcgb25seSBhIHNpbmdsZSBkb2N1bWVudFxuICAvLyAobm90IGxpbmtlZCBvbmVzKS5cbiAgZnVuY3Rpb24gbWFrZUNoYW5nZVNpbmdsZURvYyhkb2MsIGNoYW5nZSwgc2VsQWZ0ZXIsIHNwYW5zKSB7XG4gICAgaWYgKGRvYy5jbSAmJiAhZG9jLmNtLmN1ck9wKVxuICAgICAgcmV0dXJuIG9wZXJhdGlvbihkb2MuY20sIG1ha2VDaGFuZ2VTaW5nbGVEb2MpKGRvYywgY2hhbmdlLCBzZWxBZnRlciwgc3BhbnMpO1xuXG4gICAgaWYgKGNoYW5nZS50by5saW5lIDwgZG9jLmZpcnN0KSB7XG4gICAgICBzaGlmdERvYyhkb2MsIGNoYW5nZS50ZXh0Lmxlbmd0aCAtIDEgLSAoY2hhbmdlLnRvLmxpbmUgLSBjaGFuZ2UuZnJvbS5saW5lKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjaGFuZ2UuZnJvbS5saW5lID4gZG9jLmxhc3RMaW5lKCkpIHJldHVybjtcblxuICAgIC8vIENsaXAgdGhlIGNoYW5nZSB0byB0aGUgc2l6ZSBvZiB0aGlzIGRvY1xuICAgIGlmIChjaGFuZ2UuZnJvbS5saW5lIDwgZG9jLmZpcnN0KSB7XG4gICAgICB2YXIgc2hpZnQgPSBjaGFuZ2UudGV4dC5sZW5ndGggLSAxIC0gKGRvYy5maXJzdCAtIGNoYW5nZS5mcm9tLmxpbmUpO1xuICAgICAgc2hpZnREb2MoZG9jLCBzaGlmdCk7XG4gICAgICBjaGFuZ2UgPSB7ZnJvbTogUG9zKGRvYy5maXJzdCwgMCksIHRvOiBQb3MoY2hhbmdlLnRvLmxpbmUgKyBzaGlmdCwgY2hhbmdlLnRvLmNoKSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBbbHN0KGNoYW5nZS50ZXh0KV0sIG9yaWdpbjogY2hhbmdlLm9yaWdpbn07XG4gICAgfVxuICAgIHZhciBsYXN0ID0gZG9jLmxhc3RMaW5lKCk7XG4gICAgaWYgKGNoYW5nZS50by5saW5lID4gbGFzdCkge1xuICAgICAgY2hhbmdlID0ge2Zyb206IGNoYW5nZS5mcm9tLCB0bzogUG9zKGxhc3QsIGdldExpbmUoZG9jLCBsYXN0KS50ZXh0Lmxlbmd0aCksXG4gICAgICAgICAgICAgICAgdGV4dDogW2NoYW5nZS50ZXh0WzBdXSwgb3JpZ2luOiBjaGFuZ2Uub3JpZ2lufTtcbiAgICB9XG5cbiAgICBjaGFuZ2UucmVtb3ZlZCA9IGdldEJldHdlZW4oZG9jLCBjaGFuZ2UuZnJvbSwgY2hhbmdlLnRvKTtcblxuICAgIGlmICghc2VsQWZ0ZXIpIHNlbEFmdGVyID0gY29tcHV0ZVNlbEFmdGVyQ2hhbmdlKGRvYywgY2hhbmdlLCBudWxsKTtcbiAgICBpZiAoZG9jLmNtKSBtYWtlQ2hhbmdlU2luZ2xlRG9jSW5FZGl0b3IoZG9jLmNtLCBjaGFuZ2UsIHNwYW5zKTtcbiAgICBlbHNlIHVwZGF0ZURvYyhkb2MsIGNoYW5nZSwgc3BhbnMpO1xuICAgIHNldFNlbGVjdGlvbk5vVW5kbyhkb2MsIHNlbEFmdGVyLCBzZWxfZG9udFNjcm9sbCk7XG4gIH1cblxuICAvLyBIYW5kbGUgdGhlIGludGVyYWN0aW9uIG9mIGEgY2hhbmdlIHRvIGEgZG9jdW1lbnQgd2l0aCB0aGUgZWRpdG9yXG4gIC8vIHRoYXQgdGhpcyBkb2N1bWVudCBpcyBwYXJ0IG9mLlxuICBmdW5jdGlvbiBtYWtlQ2hhbmdlU2luZ2xlRG9jSW5FZGl0b3IoY20sIGNoYW5nZSwgc3BhbnMpIHtcbiAgICB2YXIgZG9jID0gY20uZG9jLCBkaXNwbGF5ID0gY20uZGlzcGxheSwgZnJvbSA9IGNoYW5nZS5mcm9tLCB0byA9IGNoYW5nZS50bztcblxuICAgIHZhciByZWNvbXB1dGVNYXhMZW5ndGggPSBmYWxzZSwgY2hlY2tXaWR0aFN0YXJ0ID0gZnJvbS5saW5lO1xuICAgIGlmICghY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpIHtcbiAgICAgIGNoZWNrV2lkdGhTdGFydCA9IGxpbmVObyh2aXN1YWxMaW5lKGdldExpbmUoZG9jLCBmcm9tLmxpbmUpKSk7XG4gICAgICBkb2MuaXRlcihjaGVja1dpZHRoU3RhcnQsIHRvLmxpbmUgKyAxLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIGlmIChsaW5lID09IGRpc3BsYXkubWF4TGluZSkge1xuICAgICAgICAgIHJlY29tcHV0ZU1heExlbmd0aCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkb2Muc2VsLmNvbnRhaW5zKGNoYW5nZS5mcm9tLCBjaGFuZ2UudG8pID4gLTEpXG4gICAgICBzaWduYWxDdXJzb3JBY3Rpdml0eShjbSk7XG5cbiAgICB1cGRhdGVEb2MoZG9jLCBjaGFuZ2UsIHNwYW5zLCBlc3RpbWF0ZUhlaWdodChjbSkpO1xuXG4gICAgaWYgKCFjbS5vcHRpb25zLmxpbmVXcmFwcGluZykge1xuICAgICAgZG9jLml0ZXIoY2hlY2tXaWR0aFN0YXJ0LCBmcm9tLmxpbmUgKyBjaGFuZ2UudGV4dC5sZW5ndGgsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgdmFyIGxlbiA9IGxpbmVMZW5ndGgobGluZSk7XG4gICAgICAgIGlmIChsZW4gPiBkaXNwbGF5Lm1heExpbmVMZW5ndGgpIHtcbiAgICAgICAgICBkaXNwbGF5Lm1heExpbmUgPSBsaW5lO1xuICAgICAgICAgIGRpc3BsYXkubWF4TGluZUxlbmd0aCA9IGxlbjtcbiAgICAgICAgICBkaXNwbGF5Lm1heExpbmVDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICByZWNvbXB1dGVNYXhMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAocmVjb21wdXRlTWF4TGVuZ3RoKSBjbS5jdXJPcC51cGRhdGVNYXhMaW5lID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBBZGp1c3QgZnJvbnRpZXIsIHNjaGVkdWxlIHdvcmtlclxuICAgIGRvYy5mcm9udGllciA9IE1hdGgubWluKGRvYy5mcm9udGllciwgZnJvbS5saW5lKTtcbiAgICBzdGFydFdvcmtlcihjbSwgNDAwKTtcblxuICAgIHZhciBsZW5kaWZmID0gY2hhbmdlLnRleHQubGVuZ3RoIC0gKHRvLmxpbmUgLSBmcm9tLmxpbmUpIC0gMTtcbiAgICAvLyBSZW1lbWJlciB0aGF0IHRoZXNlIGxpbmVzIGNoYW5nZWQsIGZvciB1cGRhdGluZyB0aGUgZGlzcGxheVxuICAgIGlmIChmcm9tLmxpbmUgPT0gdG8ubGluZSAmJiBjaGFuZ2UudGV4dC5sZW5ndGggPT0gMSAmJiAhaXNXaG9sZUxpbmVVcGRhdGUoY20uZG9jLCBjaGFuZ2UpKVxuICAgICAgcmVnTGluZUNoYW5nZShjbSwgZnJvbS5saW5lLCBcInRleHRcIik7XG4gICAgZWxzZVxuICAgICAgcmVnQ2hhbmdlKGNtLCBmcm9tLmxpbmUsIHRvLmxpbmUgKyAxLCBsZW5kaWZmKTtcblxuICAgIHZhciBjaGFuZ2VzSGFuZGxlciA9IGhhc0hhbmRsZXIoY20sIFwiY2hhbmdlc1wiKSwgY2hhbmdlSGFuZGxlciA9IGhhc0hhbmRsZXIoY20sIFwiY2hhbmdlXCIpO1xuICAgIGlmIChjaGFuZ2VIYW5kbGVyIHx8IGNoYW5nZXNIYW5kbGVyKSB7XG4gICAgICB2YXIgb2JqID0ge1xuICAgICAgICBmcm9tOiBmcm9tLCB0bzogdG8sXG4gICAgICAgIHRleHQ6IGNoYW5nZS50ZXh0LFxuICAgICAgICByZW1vdmVkOiBjaGFuZ2UucmVtb3ZlZCxcbiAgICAgICAgb3JpZ2luOiBjaGFuZ2Uub3JpZ2luXG4gICAgICB9O1xuICAgICAgaWYgKGNoYW5nZUhhbmRsZXIpIHNpZ25hbExhdGVyKGNtLCBcImNoYW5nZVwiLCBjbSwgb2JqKTtcbiAgICAgIGlmIChjaGFuZ2VzSGFuZGxlcikgKGNtLmN1ck9wLmNoYW5nZU9ianMgfHwgKGNtLmN1ck9wLmNoYW5nZU9ianMgPSBbXSkpLnB1c2gob2JqKTtcbiAgICB9XG4gICAgY20uZGlzcGxheS5zZWxGb3JDb250ZXh0TWVudSA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlUmFuZ2UoZG9jLCBjb2RlLCBmcm9tLCB0bywgb3JpZ2luKSB7XG4gICAgaWYgKCF0bykgdG8gPSBmcm9tO1xuICAgIGlmIChjbXAodG8sIGZyb20pIDwgMCkgeyB2YXIgdG1wID0gdG87IHRvID0gZnJvbTsgZnJvbSA9IHRtcDsgfVxuICAgIGlmICh0eXBlb2YgY29kZSA9PSBcInN0cmluZ1wiKSBjb2RlID0gc3BsaXRMaW5lcyhjb2RlKTtcbiAgICBtYWtlQ2hhbmdlKGRvYywge2Zyb206IGZyb20sIHRvOiB0bywgdGV4dDogY29kZSwgb3JpZ2luOiBvcmlnaW59KTtcbiAgfVxuXG4gIC8vIFNDUk9MTElORyBUSElOR1MgSU5UTyBWSUVXXG5cbiAgLy8gSWYgYW4gZWRpdG9yIHNpdHMgb24gdGhlIHRvcCBvciBib3R0b20gb2YgdGhlIHdpbmRvdywgcGFydGlhbGx5XG4gIC8vIHNjcm9sbGVkIG91dCBvZiB2aWV3LCB0aGlzIGVuc3VyZXMgdGhhdCB0aGUgY3Vyc29yIGlzIHZpc2libGUuXG4gIGZ1bmN0aW9uIG1heWJlU2Nyb2xsV2luZG93KGNtLCBjb29yZHMpIHtcbiAgICB2YXIgZGlzcGxheSA9IGNtLmRpc3BsYXksIGJveCA9IGRpc3BsYXkuc2l6ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGRvU2Nyb2xsID0gbnVsbDtcbiAgICBpZiAoY29vcmRzLnRvcCArIGJveC50b3AgPCAwKSBkb1Njcm9sbCA9IHRydWU7XG4gICAgZWxzZSBpZiAoY29vcmRzLmJvdHRvbSArIGJveC50b3AgPiAod2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpKSBkb1Njcm9sbCA9IGZhbHNlO1xuICAgIGlmIChkb1Njcm9sbCAhPSBudWxsICYmICFwaGFudG9tKSB7XG4gICAgICB2YXIgc2Nyb2xsTm9kZSA9IGVsdChcImRpdlwiLCBcIlxcdTIwMGJcIiwgbnVsbCwgXCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvb3Jkcy50b3AgLSBkaXNwbGF5LnZpZXdPZmZzZXQgLSBwYWRkaW5nVG9wKGNtLmRpc3BsYXkpKSArIFwicHg7IGhlaWdodDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvb3Jkcy5ib3R0b20gLSBjb29yZHMudG9wICsgc2Nyb2xsZXJDdXRPZmYpICsgXCJweDsgbGVmdDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzLmxlZnQgKyBcInB4OyB3aWR0aDogMnB4O1wiKTtcbiAgICAgIGNtLmRpc3BsYXkubGluZVNwYWNlLmFwcGVuZENoaWxkKHNjcm9sbE5vZGUpO1xuICAgICAgc2Nyb2xsTm9kZS5zY3JvbGxJbnRvVmlldyhkb1Njcm9sbCk7XG4gICAgICBjbS5kaXNwbGF5LmxpbmVTcGFjZS5yZW1vdmVDaGlsZChzY3JvbGxOb2RlKTtcbiAgICB9XG4gIH1cblxuICAvLyBTY3JvbGwgYSBnaXZlbiBwb3NpdGlvbiBpbnRvIHZpZXcgKGltbWVkaWF0ZWx5KSwgdmVyaWZ5aW5nIHRoYXRcbiAgLy8gaXQgYWN0dWFsbHkgYmVjYW1lIHZpc2libGUgKGFzIGxpbmUgaGVpZ2h0cyBhcmUgYWNjdXJhdGVseVxuICAvLyBtZWFzdXJlZCwgdGhlIHBvc2l0aW9uIG9mIHNvbWV0aGluZyBtYXkgJ2RyaWZ0JyBkdXJpbmcgZHJhd2luZykuXG4gIGZ1bmN0aW9uIHNjcm9sbFBvc0ludG9WaWV3KGNtLCBwb3MsIGVuZCwgbWFyZ2luKSB7XG4gICAgaWYgKG1hcmdpbiA9PSBudWxsKSBtYXJnaW4gPSAwO1xuICAgIGZvciAoOzspIHtcbiAgICAgIHZhciBjaGFuZ2VkID0gZmFsc2UsIGNvb3JkcyA9IGN1cnNvckNvb3JkcyhjbSwgcG9zKTtcbiAgICAgIHZhciBlbmRDb29yZHMgPSAhZW5kIHx8IGVuZCA9PSBwb3MgPyBjb29yZHMgOiBjdXJzb3JDb29yZHMoY20sIGVuZCk7XG4gICAgICB2YXIgc2Nyb2xsUG9zID0gY2FsY3VsYXRlU2Nyb2xsUG9zKGNtLCBNYXRoLm1pbihjb29yZHMubGVmdCwgZW5kQ29vcmRzLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihjb29yZHMudG9wLCBlbmRDb29yZHMudG9wKSAtIG1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoY29vcmRzLmxlZnQsIGVuZENvb3Jkcy5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoY29vcmRzLmJvdHRvbSwgZW5kQ29vcmRzLmJvdHRvbSkgKyBtYXJnaW4pO1xuICAgICAgdmFyIHN0YXJ0VG9wID0gY20uZG9jLnNjcm9sbFRvcCwgc3RhcnRMZWZ0ID0gY20uZG9jLnNjcm9sbExlZnQ7XG4gICAgICBpZiAoc2Nyb2xsUG9zLnNjcm9sbFRvcCAhPSBudWxsKSB7XG4gICAgICAgIHNldFNjcm9sbFRvcChjbSwgc2Nyb2xsUG9zLnNjcm9sbFRvcCk7XG4gICAgICAgIGlmIChNYXRoLmFicyhjbS5kb2Muc2Nyb2xsVG9wIC0gc3RhcnRUb3ApID4gMSkgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoc2Nyb2xsUG9zLnNjcm9sbExlZnQgIT0gbnVsbCkge1xuICAgICAgICBzZXRTY3JvbGxMZWZ0KGNtLCBzY3JvbGxQb3Muc2Nyb2xsTGVmdCk7XG4gICAgICAgIGlmIChNYXRoLmFicyhjbS5kb2Muc2Nyb2xsTGVmdCAtIHN0YXJ0TGVmdCkgPiAxKSBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghY2hhbmdlZCkgcmV0dXJuIGNvb3JkcztcbiAgICB9XG4gIH1cblxuICAvLyBTY3JvbGwgYSBnaXZlbiBzZXQgb2YgY29vcmRpbmF0ZXMgaW50byB2aWV3IChpbW1lZGlhdGVseSkuXG4gIGZ1bmN0aW9uIHNjcm9sbEludG9WaWV3KGNtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBzY3JvbGxQb3MgPSBjYWxjdWxhdGVTY3JvbGxQb3MoY20sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICBpZiAoc2Nyb2xsUG9zLnNjcm9sbFRvcCAhPSBudWxsKSBzZXRTY3JvbGxUb3AoY20sIHNjcm9sbFBvcy5zY3JvbGxUb3ApO1xuICAgIGlmIChzY3JvbGxQb3Muc2Nyb2xsTGVmdCAhPSBudWxsKSBzZXRTY3JvbGxMZWZ0KGNtLCBzY3JvbGxQb3Muc2Nyb2xsTGVmdCk7XG4gIH1cblxuICAvLyBDYWxjdWxhdGUgYSBuZXcgc2Nyb2xsIHBvc2l0aW9uIG5lZWRlZCB0byBzY3JvbGwgdGhlIGdpdmVuXG4gIC8vIHJlY3RhbmdsZSBpbnRvIHZpZXcuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggc2Nyb2xsVG9wIGFuZFxuICAvLyBzY3JvbGxMZWZ0IHByb3BlcnRpZXMuIFdoZW4gdGhlc2UgYXJlIHVuZGVmaW5lZCwgdGhlXG4gIC8vIHZlcnRpY2FsL2hvcml6b250YWwgcG9zaXRpb24gZG9lcyBub3QgbmVlZCB0byBiZSBhZGp1c3RlZC5cbiAgZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsUG9zKGNtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBkaXNwbGF5ID0gY20uZGlzcGxheSwgc25hcE1hcmdpbiA9IHRleHRIZWlnaHQoY20uZGlzcGxheSk7XG4gICAgaWYgKHkxIDwgMCkgeTEgPSAwO1xuICAgIHZhciBzY3JlZW50b3AgPSBjbS5jdXJPcCAmJiBjbS5jdXJPcC5zY3JvbGxUb3AgIT0gbnVsbCA/IGNtLmN1ck9wLnNjcm9sbFRvcCA6IGRpc3BsYXkuc2Nyb2xsZXIuc2Nyb2xsVG9wO1xuICAgIHZhciBzY3JlZW4gPSBkaXNwbGF5LnNjcm9sbGVyLmNsaWVudEhlaWdodCAtIHNjcm9sbGVyQ3V0T2ZmLCByZXN1bHQgPSB7fTtcbiAgICB2YXIgZG9jQm90dG9tID0gY20uZG9jLmhlaWdodCArIHBhZGRpbmdWZXJ0KGRpc3BsYXkpO1xuICAgIHZhciBhdFRvcCA9IHkxIDwgc25hcE1hcmdpbiwgYXRCb3R0b20gPSB5MiA+IGRvY0JvdHRvbSAtIHNuYXBNYXJnaW47XG4gICAgaWYgKHkxIDwgc2NyZWVudG9wKSB7XG4gICAgICByZXN1bHQuc2Nyb2xsVG9wID0gYXRUb3AgPyAwIDogeTE7XG4gICAgfSBlbHNlIGlmICh5MiA+IHNjcmVlbnRvcCArIHNjcmVlbikge1xuICAgICAgdmFyIG5ld1RvcCA9IE1hdGgubWluKHkxLCAoYXRCb3R0b20gPyBkb2NCb3R0b20gOiB5MikgLSBzY3JlZW4pO1xuICAgICAgaWYgKG5ld1RvcCAhPSBzY3JlZW50b3ApIHJlc3VsdC5zY3JvbGxUb3AgPSBuZXdUb3A7XG4gICAgfVxuXG4gICAgdmFyIHNjcmVlbmxlZnQgPSBjbS5jdXJPcCAmJiBjbS5jdXJPcC5zY3JvbGxMZWZ0ICE9IG51bGwgPyBjbS5jdXJPcC5zY3JvbGxMZWZ0IDogZGlzcGxheS5zY3JvbGxlci5zY3JvbGxMZWZ0O1xuICAgIHZhciBzY3JlZW53ID0gZGlzcGxheS5zY3JvbGxlci5jbGllbnRXaWR0aCAtIHNjcm9sbGVyQ3V0T2ZmO1xuICAgIHgxICs9IGRpc3BsYXkuZ3V0dGVycy5vZmZzZXRXaWR0aDsgeDIgKz0gZGlzcGxheS5ndXR0ZXJzLm9mZnNldFdpZHRoO1xuICAgIHZhciBndXR0ZXJ3ID0gZGlzcGxheS5ndXR0ZXJzLm9mZnNldFdpZHRoO1xuICAgIHZhciBhdExlZnQgPSB4MSA8IGd1dHRlcncgKyAxMDtcbiAgICBpZiAoeDEgPCBzY3JlZW5sZWZ0ICsgZ3V0dGVydyB8fCBhdExlZnQpIHtcbiAgICAgIGlmIChhdExlZnQpIHgxID0gMDtcbiAgICAgIHJlc3VsdC5zY3JvbGxMZWZ0ID0gTWF0aC5tYXgoMCwgeDEgLSAxMCAtIGd1dHRlcncpO1xuICAgIH0gZWxzZSBpZiAoeDIgPiBzY3JlZW53ICsgc2NyZWVubGVmdCAtIDMpIHtcbiAgICAgIHJlc3VsdC5zY3JvbGxMZWZ0ID0geDIgKyAxMCAtIHNjcmVlbnc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBTdG9yZSBhIHJlbGF0aXZlIGFkanVzdG1lbnQgdG8gdGhlIHNjcm9sbCBwb3NpdGlvbiBpbiB0aGUgY3VycmVudFxuICAvLyBvcGVyYXRpb24gKHRvIGJlIGFwcGxpZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGZpbmlzaGVzKS5cbiAgZnVuY3Rpb24gYWRkVG9TY3JvbGxQb3MoY20sIGxlZnQsIHRvcCkge1xuICAgIGlmIChsZWZ0ICE9IG51bGwgfHwgdG9wICE9IG51bGwpIHJlc29sdmVTY3JvbGxUb1BvcyhjbSk7XG4gICAgaWYgKGxlZnQgIT0gbnVsbClcbiAgICAgIGNtLmN1ck9wLnNjcm9sbExlZnQgPSAoY20uY3VyT3Auc2Nyb2xsTGVmdCA9PSBudWxsID8gY20uZG9jLnNjcm9sbExlZnQgOiBjbS5jdXJPcC5zY3JvbGxMZWZ0KSArIGxlZnQ7XG4gICAgaWYgKHRvcCAhPSBudWxsKVxuICAgICAgY20uY3VyT3Auc2Nyb2xsVG9wID0gKGNtLmN1ck9wLnNjcm9sbFRvcCA9PSBudWxsID8gY20uZG9jLnNjcm9sbFRvcCA6IGNtLmN1ck9wLnNjcm9sbFRvcCkgKyB0b3A7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgdGhhdCBhdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb24gdGhlIGN1cnJlbnQgY3Vyc29yIGlzXG4gIC8vIHNob3duLlxuICBmdW5jdGlvbiBlbnN1cmVDdXJzb3JWaXNpYmxlKGNtKSB7XG4gICAgcmVzb2x2ZVNjcm9sbFRvUG9zKGNtKTtcbiAgICB2YXIgY3VyID0gY20uZ2V0Q3Vyc29yKCksIGZyb20gPSBjdXIsIHRvID0gY3VyO1xuICAgIGlmICghY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpIHtcbiAgICAgIGZyb20gPSBjdXIuY2ggPyBQb3MoY3VyLmxpbmUsIGN1ci5jaCAtIDEpIDogY3VyO1xuICAgICAgdG8gPSBQb3MoY3VyLmxpbmUsIGN1ci5jaCArIDEpO1xuICAgIH1cbiAgICBjbS5jdXJPcC5zY3JvbGxUb1BvcyA9IHtmcm9tOiBmcm9tLCB0bzogdG8sIG1hcmdpbjogY20ub3B0aW9ucy5jdXJzb3JTY3JvbGxNYXJnaW4sIGlzQ3Vyc29yOiB0cnVlfTtcbiAgfVxuXG4gIC8vIFdoZW4gYW4gb3BlcmF0aW9uIGhhcyBpdHMgc2Nyb2xsVG9Qb3MgcHJvcGVydHkgc2V0LCBhbmQgYW5vdGhlclxuICAvLyBzY3JvbGwgYWN0aW9uIGlzIGFwcGxpZWQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvbiwgdGhpc1xuICAvLyAnc2ltdWxhdGVzJyBzY3JvbGxpbmcgdGhhdCBwb3NpdGlvbiBpbnRvIHZpZXcgaW4gYSBjaGVhcCB3YXksIHNvXG4gIC8vIHRoYXQgdGhlIGVmZmVjdCBvZiBpbnRlcm1lZGlhdGUgc2Nyb2xsIGNvbW1hbmRzIGlzIG5vdCBpZ25vcmVkLlxuICBmdW5jdGlvbiByZXNvbHZlU2Nyb2xsVG9Qb3MoY20pIHtcbiAgICB2YXIgcmFuZ2UgPSBjbS5jdXJPcC5zY3JvbGxUb1BvcztcbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgIGNtLmN1ck9wLnNjcm9sbFRvUG9zID0gbnVsbDtcbiAgICAgIHZhciBmcm9tID0gZXN0aW1hdGVDb29yZHMoY20sIHJhbmdlLmZyb20pLCB0byA9IGVzdGltYXRlQ29vcmRzKGNtLCByYW5nZS50byk7XG4gICAgICB2YXIgc1BvcyA9IGNhbGN1bGF0ZVNjcm9sbFBvcyhjbSwgTWF0aC5taW4oZnJvbS5sZWZ0LCB0by5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWluKGZyb20udG9wLCB0by50b3ApIC0gcmFuZ2UubWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoZnJvbS5yaWdodCwgdG8ucmlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoZnJvbS5ib3R0b20sIHRvLmJvdHRvbSkgKyByYW5nZS5tYXJnaW4pO1xuICAgICAgY20uc2Nyb2xsVG8oc1Bvcy5zY3JvbGxMZWZ0LCBzUG9zLnNjcm9sbFRvcCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQVBJIFVUSUxJVElFU1xuXG4gIC8vIEluZGVudCB0aGUgZ2l2ZW4gbGluZS4gVGhlIGhvdyBwYXJhbWV0ZXIgY2FuIGJlIFwic21hcnRcIixcbiAgLy8gXCJhZGRcIi9udWxsLCBcInN1YnRyYWN0XCIsIG9yIFwicHJldlwiLiBXaGVuIGFnZ3Jlc3NpdmUgaXMgZmFsc2VcbiAgLy8gKHR5cGljYWxseSBzZXQgdG8gdHJ1ZSBmb3IgZm9yY2VkIHNpbmdsZS1saW5lIGluZGVudHMpLCBlbXB0eVxuICAvLyBsaW5lcyBhcmUgbm90IGluZGVudGVkLCBhbmQgcGxhY2VzIHdoZXJlIHRoZSBtb2RlIHJldHVybnMgUGFzc1xuICAvLyBhcmUgbGVmdCBhbG9uZS5cbiAgZnVuY3Rpb24gaW5kZW50TGluZShjbSwgbiwgaG93LCBhZ2dyZXNzaXZlKSB7XG4gICAgdmFyIGRvYyA9IGNtLmRvYywgc3RhdGU7XG4gICAgaWYgKGhvdyA9PSBudWxsKSBob3cgPSBcImFkZFwiO1xuICAgIGlmIChob3cgPT0gXCJzbWFydFwiKSB7XG4gICAgICAvLyBGYWxsIGJhY2sgdG8gXCJwcmV2XCIgd2hlbiB0aGUgbW9kZSBkb2Vzbid0IGhhdmUgYW4gaW5kZW50YXRpb25cbiAgICAgIC8vIG1ldGhvZC5cbiAgICAgIGlmICghY20uZG9jLm1vZGUuaW5kZW50KSBob3cgPSBcInByZXZcIjtcbiAgICAgIGVsc2Ugc3RhdGUgPSBnZXRTdGF0ZUJlZm9yZShjbSwgbik7XG4gICAgfVxuXG4gICAgdmFyIHRhYlNpemUgPSBjbS5vcHRpb25zLnRhYlNpemU7XG4gICAgdmFyIGxpbmUgPSBnZXRMaW5lKGRvYywgbiksIGN1clNwYWNlID0gY291bnRDb2x1bW4obGluZS50ZXh0LCBudWxsLCB0YWJTaXplKTtcbiAgICBpZiAobGluZS5zdGF0ZUFmdGVyKSBsaW5lLnN0YXRlQWZ0ZXIgPSBudWxsO1xuICAgIHZhciBjdXJTcGFjZVN0cmluZyA9IGxpbmUudGV4dC5tYXRjaCgvXlxccyovKVswXSwgaW5kZW50YXRpb247XG4gICAgaWYgKCFhZ2dyZXNzaXZlICYmICEvXFxTLy50ZXN0KGxpbmUudGV4dCkpIHtcbiAgICAgIGluZGVudGF0aW9uID0gMDtcbiAgICAgIGhvdyA9IFwibm90XCI7XG4gICAgfSBlbHNlIGlmIChob3cgPT0gXCJzbWFydFwiKSB7XG4gICAgICBpbmRlbnRhdGlvbiA9IGNtLmRvYy5tb2RlLmluZGVudChzdGF0ZSwgbGluZS50ZXh0LnNsaWNlKGN1clNwYWNlU3RyaW5nLmxlbmd0aCksIGxpbmUudGV4dCk7XG4gICAgICBpZiAoaW5kZW50YXRpb24gPT0gUGFzcykge1xuICAgICAgICBpZiAoIWFnZ3Jlc3NpdmUpIHJldHVybjtcbiAgICAgICAgaG93ID0gXCJwcmV2XCI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob3cgPT0gXCJwcmV2XCIpIHtcbiAgICAgIGlmIChuID4gZG9jLmZpcnN0KSBpbmRlbnRhdGlvbiA9IGNvdW50Q29sdW1uKGdldExpbmUoZG9jLCBuLTEpLnRleHQsIG51bGwsIHRhYlNpemUpO1xuICAgICAgZWxzZSBpbmRlbnRhdGlvbiA9IDA7XG4gICAgfSBlbHNlIGlmIChob3cgPT0gXCJhZGRcIikge1xuICAgICAgaW5kZW50YXRpb24gPSBjdXJTcGFjZSArIGNtLm9wdGlvbnMuaW5kZW50VW5pdDtcbiAgICB9IGVsc2UgaWYgKGhvdyA9PSBcInN1YnRyYWN0XCIpIHtcbiAgICAgIGluZGVudGF0aW9uID0gY3VyU3BhY2UgLSBjbS5vcHRpb25zLmluZGVudFVuaXQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaG93ID09IFwibnVtYmVyXCIpIHtcbiAgICAgIGluZGVudGF0aW9uID0gY3VyU3BhY2UgKyBob3c7XG4gICAgfVxuICAgIGluZGVudGF0aW9uID0gTWF0aC5tYXgoMCwgaW5kZW50YXRpb24pO1xuXG4gICAgdmFyIGluZGVudFN0cmluZyA9IFwiXCIsIHBvcyA9IDA7XG4gICAgaWYgKGNtLm9wdGlvbnMuaW5kZW50V2l0aFRhYnMpXG4gICAgICBmb3IgKHZhciBpID0gTWF0aC5mbG9vcihpbmRlbnRhdGlvbiAvIHRhYlNpemUpOyBpOyAtLWkpIHtwb3MgKz0gdGFiU2l6ZTsgaW5kZW50U3RyaW5nICs9IFwiXFx0XCI7fVxuICAgIGlmIChwb3MgPCBpbmRlbnRhdGlvbikgaW5kZW50U3RyaW5nICs9IHNwYWNlU3RyKGluZGVudGF0aW9uIC0gcG9zKTtcblxuICAgIGlmIChpbmRlbnRTdHJpbmcgIT0gY3VyU3BhY2VTdHJpbmcpIHtcbiAgICAgIHJlcGxhY2VSYW5nZShjbS5kb2MsIGluZGVudFN0cmluZywgUG9zKG4sIDApLCBQb3MobiwgY3VyU3BhY2VTdHJpbmcubGVuZ3RoKSwgXCIraW5wdXRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEVuc3VyZSB0aGF0LCBpZiB0aGUgY3Vyc29yIHdhcyBpbiB0aGUgd2hpdGVzcGFjZSBhdCB0aGUgc3RhcnRcbiAgICAgIC8vIG9mIHRoZSBsaW5lLCBpdCBpcyBtb3ZlZCB0byB0aGUgZW5kIG9mIHRoYXQgc3BhY2UuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRvYy5zZWwucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByYW5nZSA9IGRvYy5zZWwucmFuZ2VzW2ldO1xuICAgICAgICBpZiAocmFuZ2UuaGVhZC5saW5lID09IG4gJiYgcmFuZ2UuaGVhZC5jaCA8IGN1clNwYWNlU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBwb3MgPSBQb3MobiwgY3VyU3BhY2VTdHJpbmcubGVuZ3RoKTtcbiAgICAgICAgICByZXBsYWNlT25lU2VsZWN0aW9uKGRvYywgaSwgbmV3IFJhbmdlKHBvcywgcG9zKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGluZS5zdGF0ZUFmdGVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFV0aWxpdHkgZm9yIGFwcGx5aW5nIGEgY2hhbmdlIHRvIGEgbGluZSBieSBoYW5kbGUgb3IgbnVtYmVyLFxuICAvLyByZXR1cm5pbmcgdGhlIG51bWJlciBhbmQgb3B0aW9uYWxseSByZWdpc3RlcmluZyB0aGUgbGluZSBhc1xuICAvLyBjaGFuZ2VkLlxuICBmdW5jdGlvbiBjaGFuZ2VMaW5lKGNtLCBoYW5kbGUsIGNoYW5nZVR5cGUsIG9wKSB7XG4gICAgdmFyIG5vID0gaGFuZGxlLCBsaW5lID0gaGFuZGxlLCBkb2MgPSBjbS5kb2M7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGUgPT0gXCJudW1iZXJcIikgbGluZSA9IGdldExpbmUoZG9jLCBjbGlwTGluZShkb2MsIGhhbmRsZSkpO1xuICAgIGVsc2Ugbm8gPSBsaW5lTm8oaGFuZGxlKTtcbiAgICBpZiAobm8gPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgaWYgKG9wKGxpbmUsIG5vKSkgcmVnTGluZUNoYW5nZShjbSwgbm8sIGNoYW5nZVR5cGUpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgLy8gSGVscGVyIGZvciBkZWxldGluZyB0ZXh0IG5lYXIgdGhlIHNlbGVjdGlvbihzKSwgdXNlZCB0byBpbXBsZW1lbnRcbiAgLy8gYmFja3NwYWNlLCBkZWxldGUsIGFuZCBzaW1pbGFyIGZ1bmN0aW9uYWxpdHkuXG4gIGZ1bmN0aW9uIGRlbGV0ZU5lYXJTZWxlY3Rpb24oY20sIGNvbXB1dGUpIHtcbiAgICB2YXIgcmFuZ2VzID0gY20uZG9jLnNlbC5yYW5nZXMsIGtpbGwgPSBbXTtcbiAgICAvLyBCdWlsZCB1cCBhIHNldCBvZiByYW5nZXMgdG8ga2lsbCBmaXJzdCwgbWVyZ2luZyBvdmVybGFwcGluZ1xuICAgIC8vIHJhbmdlcy5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvS2lsbCA9IGNvbXB1dGUocmFuZ2VzW2ldKTtcbiAgICAgIHdoaWxlIChraWxsLmxlbmd0aCAmJiBjbXAodG9LaWxsLmZyb20sIGxzdChraWxsKS50bykgPD0gMCkge1xuICAgICAgICB2YXIgcmVwbGFjZWQgPSBraWxsLnBvcCgpO1xuICAgICAgICBpZiAoY21wKHJlcGxhY2VkLmZyb20sIHRvS2lsbC5mcm9tKSA8IDApIHtcbiAgICAgICAgICB0b0tpbGwuZnJvbSA9IHJlcGxhY2VkLmZyb207XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGtpbGwucHVzaCh0b0tpbGwpO1xuICAgIH1cbiAgICAvLyBOZXh0LCByZW1vdmUgdGhvc2UgYWN0dWFsIHJhbmdlcy5cbiAgICBydW5Jbk9wKGNtLCBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSBraWxsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICByZXBsYWNlUmFuZ2UoY20uZG9jLCBcIlwiLCBraWxsW2ldLmZyb20sIGtpbGxbaV0udG8sIFwiK2RlbGV0ZVwiKTtcbiAgICAgIGVuc3VyZUN1cnNvclZpc2libGUoY20pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVXNlZCBmb3IgaG9yaXpvbnRhbCByZWxhdGl2ZSBtb3Rpb24uIERpciBpcyAtMSBvciAxIChsZWZ0IG9yXG4gIC8vIHJpZ2h0KSwgdW5pdCBjYW4gYmUgXCJjaGFyXCIsIFwiY29sdW1uXCIgKGxpa2UgY2hhciwgYnV0IGRvZXNuJ3RcbiAgLy8gY3Jvc3MgbGluZSBib3VuZGFyaWVzKSwgXCJ3b3JkXCIgKGFjcm9zcyBuZXh0IHdvcmQpLCBvciBcImdyb3VwXCIgKHRvXG4gIC8vIHRoZSBzdGFydCBvZiBuZXh0IGdyb3VwIG9mIHdvcmQgb3Igbm9uLXdvcmQtbm9uLXdoaXRlc3BhY2VcbiAgLy8gY2hhcnMpLiBUaGUgdmlzdWFsbHkgcGFyYW0gY29udHJvbHMgd2hldGhlciwgaW4gcmlnaHQtdG8tbGVmdFxuICAvLyB0ZXh0LCBkaXJlY3Rpb24gMSBtZWFucyB0byBtb3ZlIHRvd2FyZHMgdGhlIG5leHQgaW5kZXggaW4gdGhlXG4gIC8vIHN0cmluZywgb3IgdG93YXJkcyB0aGUgY2hhcmFjdGVyIHRvIHRoZSByaWdodCBvZiB0aGUgY3VycmVudFxuICAvLyBwb3NpdGlvbi4gVGhlIHJlc3VsdGluZyBwb3NpdGlvbiB3aWxsIGhhdmUgYSBoaXRTaWRlPXRydWVcbiAgLy8gcHJvcGVydHkgaWYgaXQgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudC5cbiAgZnVuY3Rpb24gZmluZFBvc0goZG9jLCBwb3MsIGRpciwgdW5pdCwgdmlzdWFsbHkpIHtcbiAgICB2YXIgbGluZSA9IHBvcy5saW5lLCBjaCA9IHBvcy5jaCwgb3JpZ0RpciA9IGRpcjtcbiAgICB2YXIgbGluZU9iaiA9IGdldExpbmUoZG9jLCBsaW5lKTtcbiAgICB2YXIgcG9zc2libGUgPSB0cnVlO1xuICAgIGZ1bmN0aW9uIGZpbmROZXh0TGluZSgpIHtcbiAgICAgIHZhciBsID0gbGluZSArIGRpcjtcbiAgICAgIGlmIChsIDwgZG9jLmZpcnN0IHx8IGwgPj0gZG9jLmZpcnN0ICsgZG9jLnNpemUpIHJldHVybiAocG9zc2libGUgPSBmYWxzZSk7XG4gICAgICBsaW5lID0gbDtcbiAgICAgIHJldHVybiBsaW5lT2JqID0gZ2V0TGluZShkb2MsIGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtb3ZlT25jZShib3VuZFRvTGluZSkge1xuICAgICAgdmFyIG5leHQgPSAodmlzdWFsbHkgPyBtb3ZlVmlzdWFsbHkgOiBtb3ZlTG9naWNhbGx5KShsaW5lT2JqLCBjaCwgZGlyLCB0cnVlKTtcbiAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgaWYgKCFib3VuZFRvTGluZSAmJiBmaW5kTmV4dExpbmUoKSkge1xuICAgICAgICAgIGlmICh2aXN1YWxseSkgY2ggPSAoZGlyIDwgMCA/IGxpbmVSaWdodCA6IGxpbmVMZWZ0KShsaW5lT2JqKTtcbiAgICAgICAgICBlbHNlIGNoID0gZGlyIDwgMCA/IGxpbmVPYmoudGV4dC5sZW5ndGggOiAwO1xuICAgICAgICB9IGVsc2UgcmV0dXJuIChwb3NzaWJsZSA9IGZhbHNlKTtcbiAgICAgIH0gZWxzZSBjaCA9IG5leHQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodW5pdCA9PSBcImNoYXJcIikgbW92ZU9uY2UoKTtcbiAgICBlbHNlIGlmICh1bml0ID09IFwiY29sdW1uXCIpIG1vdmVPbmNlKHRydWUpO1xuICAgIGVsc2UgaWYgKHVuaXQgPT0gXCJ3b3JkXCIgfHwgdW5pdCA9PSBcImdyb3VwXCIpIHtcbiAgICAgIHZhciBzYXdUeXBlID0gbnVsbCwgZ3JvdXAgPSB1bml0ID09IFwiZ3JvdXBcIjtcbiAgICAgIHZhciBoZWxwZXIgPSBkb2MuY20gJiYgZG9jLmNtLmdldEhlbHBlcihwb3MsIFwid29yZENoYXJzXCIpO1xuICAgICAgZm9yICh2YXIgZmlyc3QgPSB0cnVlOzsgZmlyc3QgPSBmYWxzZSkge1xuICAgICAgICBpZiAoZGlyIDwgMCAmJiAhbW92ZU9uY2UoIWZpcnN0KSkgYnJlYWs7XG4gICAgICAgIHZhciBjdXIgPSBsaW5lT2JqLnRleHQuY2hhckF0KGNoKSB8fCBcIlxcblwiO1xuICAgICAgICB2YXIgdHlwZSA9IGlzV29yZENoYXIoY3VyLCBoZWxwZXIpID8gXCJ3XCJcbiAgICAgICAgICA6IGdyb3VwICYmIGN1ciA9PSBcIlxcblwiID8gXCJuXCJcbiAgICAgICAgICA6ICFncm91cCB8fCAvXFxzLy50ZXN0KGN1cikgPyBudWxsXG4gICAgICAgICAgOiBcInBcIjtcbiAgICAgICAgaWYgKGdyb3VwICYmICFmaXJzdCAmJiAhdHlwZSkgdHlwZSA9IFwic1wiO1xuICAgICAgICBpZiAoc2F3VHlwZSAmJiBzYXdUeXBlICE9IHR5cGUpIHtcbiAgICAgICAgICBpZiAoZGlyIDwgMCkge2RpciA9IDE7IG1vdmVPbmNlKCk7fVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUpIHNhd1R5cGUgPSB0eXBlO1xuICAgICAgICBpZiAoZGlyID4gMCAmJiAhbW92ZU9uY2UoIWZpcnN0KSkgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBza2lwQXRvbWljKGRvYywgUG9zKGxpbmUsIGNoKSwgb3JpZ0RpciwgdHJ1ZSk7XG4gICAgaWYgKCFwb3NzaWJsZSkgcmVzdWx0LmhpdFNpZGUgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBGb3IgcmVsYXRpdmUgdmVydGljYWwgbW92ZW1lbnQuIERpciBtYXkgYmUgLTEgb3IgMS4gVW5pdCBjYW4gYmVcbiAgLy8gXCJwYWdlXCIgb3IgXCJsaW5lXCIuIFRoZSByZXN1bHRpbmcgcG9zaXRpb24gd2lsbCBoYXZlIGEgaGl0U2lkZT10cnVlXG4gIC8vIHByb3BlcnR5IGlmIGl0IHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQuXG4gIGZ1bmN0aW9uIGZpbmRQb3NWKGNtLCBwb3MsIGRpciwgdW5pdCkge1xuICAgIHZhciBkb2MgPSBjbS5kb2MsIHggPSBwb3MubGVmdCwgeTtcbiAgICBpZiAodW5pdCA9PSBcInBhZ2VcIikge1xuICAgICAgdmFyIHBhZ2VTaXplID0gTWF0aC5taW4oY20uZGlzcGxheS53cmFwcGVyLmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgICAgeSA9IHBvcy50b3AgKyBkaXIgKiAocGFnZVNpemUgLSAoZGlyIDwgMCA/IDEuNSA6IC41KSAqIHRleHRIZWlnaHQoY20uZGlzcGxheSkpO1xuICAgIH0gZWxzZSBpZiAodW5pdCA9PSBcImxpbmVcIikge1xuICAgICAgeSA9IGRpciA+IDAgPyBwb3MuYm90dG9tICsgMyA6IHBvcy50b3AgLSAzO1xuICAgIH1cbiAgICBmb3IgKDs7KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gY29vcmRzQ2hhcihjbSwgeCwgeSk7XG4gICAgICBpZiAoIXRhcmdldC5vdXRzaWRlKSBicmVhaztcbiAgICAgIGlmIChkaXIgPCAwID8geSA8PSAwIDogeSA+PSBkb2MuaGVpZ2h0KSB7IHRhcmdldC5oaXRTaWRlID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICAgIHkgKz0gZGlyICogNTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHdvcmQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIChhcyByZXR1cm5lZCBieSBjb29yZHNDaGFyKS5cbiAgZnVuY3Rpb24gZmluZFdvcmRBdChjbSwgcG9zKSB7XG4gICAgdmFyIGRvYyA9IGNtLmRvYywgbGluZSA9IGdldExpbmUoZG9jLCBwb3MubGluZSkudGV4dDtcbiAgICB2YXIgc3RhcnQgPSBwb3MuY2gsIGVuZCA9IHBvcy5jaDtcbiAgICBpZiAobGluZSkge1xuICAgICAgdmFyIGhlbHBlciA9IGNtLmdldEhlbHBlcihwb3MsIFwid29yZENoYXJzXCIpO1xuICAgICAgaWYgKChwb3MueFJlbCA8IDAgfHwgZW5kID09IGxpbmUubGVuZ3RoKSAmJiBzdGFydCkgLS1zdGFydDsgZWxzZSArK2VuZDtcbiAgICAgIHZhciBzdGFydENoYXIgPSBsaW5lLmNoYXJBdChzdGFydCk7XG4gICAgICB2YXIgY2hlY2sgPSBpc1dvcmRDaGFyKHN0YXJ0Q2hhciwgaGVscGVyKVxuICAgICAgICA/IGZ1bmN0aW9uKGNoKSB7IHJldHVybiBpc1dvcmRDaGFyKGNoLCBoZWxwZXIpOyB9XG4gICAgICAgIDogL1xccy8udGVzdChzdGFydENoYXIpID8gZnVuY3Rpb24oY2gpIHtyZXR1cm4gL1xccy8udGVzdChjaCk7fVxuICAgICAgICA6IGZ1bmN0aW9uKGNoKSB7cmV0dXJuICEvXFxzLy50ZXN0KGNoKSAmJiAhaXNXb3JkQ2hhcihjaCk7fTtcbiAgICAgIHdoaWxlIChzdGFydCA+IDAgJiYgY2hlY2sobGluZS5jaGFyQXQoc3RhcnQgLSAxKSkpIC0tc3RhcnQ7XG4gICAgICB3aGlsZSAoZW5kIDwgbGluZS5sZW5ndGggJiYgY2hlY2sobGluZS5jaGFyQXQoZW5kKSkpICsrZW5kO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhbmdlKFBvcyhwb3MubGluZSwgc3RhcnQpLCBQb3MocG9zLmxpbmUsIGVuZCkpO1xuICB9XG5cbiAgLy8gRURJVE9SIE1FVEhPRFNcblxuICAvLyBUaGUgcHVibGljbHkgdmlzaWJsZSBBUEkuIE5vdGUgdGhhdCBtZXRob2RPcChmKSBtZWFuc1xuICAvLyAnd3JhcCBmIGluIGFuIG9wZXJhdGlvbiwgcGVyZm9ybWVkIG9uIGl0cyBgdGhpc2AgcGFyYW1ldGVyJy5cblxuICAvLyBUaGlzIGlzIG5vdCB0aGUgY29tcGxldGUgc2V0IG9mIGVkaXRvciBtZXRob2RzLiBNb3N0IG9mIHRoZVxuICAvLyBtZXRob2RzIGRlZmluZWQgb24gdGhlIERvYyB0eXBlIGFyZSBhbHNvIGluamVjdGVkIGludG9cbiAgLy8gQ29kZU1pcnJvci5wcm90b3R5cGUsIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBhbmRcbiAgLy8gY29udmVuaWVuY2UuXG5cbiAgQ29kZU1pcnJvci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvZGVNaXJyb3IsXG4gICAgZm9jdXM6IGZ1bmN0aW9uKCl7d2luZG93LmZvY3VzKCk7IGZvY3VzSW5wdXQodGhpcyk7IGZhc3RQb2xsKHRoaXMpO30sXG5cbiAgICBzZXRPcHRpb246IGZ1bmN0aW9uKG9wdGlvbiwgdmFsdWUpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLCBvbGQgPSBvcHRpb25zW29wdGlvbl07XG4gICAgICBpZiAob3B0aW9uc1tvcHRpb25dID09IHZhbHVlICYmIG9wdGlvbiAhPSBcIm1vZGVcIikgcmV0dXJuO1xuICAgICAgb3B0aW9uc1tvcHRpb25dID0gdmFsdWU7XG4gICAgICBpZiAob3B0aW9uSGFuZGxlcnMuaGFzT3duUHJvcGVydHkob3B0aW9uKSlcbiAgICAgICAgb3BlcmF0aW9uKHRoaXMsIG9wdGlvbkhhbmRsZXJzW29wdGlvbl0pKHRoaXMsIHZhbHVlLCBvbGQpO1xuICAgIH0sXG5cbiAgICBnZXRPcHRpb246IGZ1bmN0aW9uKG9wdGlvbikge3JldHVybiB0aGlzLm9wdGlvbnNbb3B0aW9uXTt9LFxuICAgIGdldERvYzogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMuZG9jO30sXG5cbiAgICBhZGRLZXlNYXA6IGZ1bmN0aW9uKG1hcCwgYm90dG9tKSB7XG4gICAgICB0aGlzLnN0YXRlLmtleU1hcHNbYm90dG9tID8gXCJwdXNoXCIgOiBcInVuc2hpZnRcIl0obWFwKTtcbiAgICB9LFxuICAgIHJlbW92ZUtleU1hcDogZnVuY3Rpb24obWFwKSB7XG4gICAgICB2YXIgbWFwcyA9IHRoaXMuc3RhdGUua2V5TWFwcztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwcy5sZW5ndGg7ICsraSlcbiAgICAgICAgaWYgKG1hcHNbaV0gPT0gbWFwIHx8ICh0eXBlb2YgbWFwc1tpXSAhPSBcInN0cmluZ1wiICYmIG1hcHNbaV0ubmFtZSA9PSBtYXApKSB7XG4gICAgICAgICAgbWFwcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkT3ZlcmxheTogbWV0aG9kT3AoZnVuY3Rpb24oc3BlYywgb3B0aW9ucykge1xuICAgICAgdmFyIG1vZGUgPSBzcGVjLnRva2VuID8gc3BlYyA6IENvZGVNaXJyb3IuZ2V0TW9kZSh0aGlzLm9wdGlvbnMsIHNwZWMpO1xuICAgICAgaWYgKG1vZGUuc3RhcnRTdGF0ZSkgdGhyb3cgbmV3IEVycm9yKFwiT3ZlcmxheXMgbWF5IG5vdCBiZSBzdGF0ZWZ1bC5cIik7XG4gICAgICB0aGlzLnN0YXRlLm92ZXJsYXlzLnB1c2goe21vZGU6IG1vZGUsIG1vZGVTcGVjOiBzcGVjLCBvcGFxdWU6IG9wdGlvbnMgJiYgb3B0aW9ucy5vcGFxdWV9KTtcbiAgICAgIHRoaXMuc3RhdGUubW9kZUdlbisrO1xuICAgICAgcmVnQ2hhbmdlKHRoaXMpO1xuICAgIH0pLFxuICAgIHJlbW92ZU92ZXJsYXk6IG1ldGhvZE9wKGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAgIHZhciBvdmVybGF5cyA9IHRoaXMuc3RhdGUub3ZlcmxheXM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG92ZXJsYXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBjdXIgPSBvdmVybGF5c1tpXS5tb2RlU3BlYztcbiAgICAgICAgaWYgKGN1ciA9PSBzcGVjIHx8IHR5cGVvZiBzcGVjID09IFwic3RyaW5nXCIgJiYgY3VyLm5hbWUgPT0gc3BlYykge1xuICAgICAgICAgIG92ZXJsYXlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVHZW4rKztcbiAgICAgICAgICByZWdDaGFuZ2UodGhpcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSksXG5cbiAgICBpbmRlbnRMaW5lOiBtZXRob2RPcChmdW5jdGlvbihuLCBkaXIsIGFnZ3Jlc3NpdmUpIHtcbiAgICAgIGlmICh0eXBlb2YgZGlyICE9IFwic3RyaW5nXCIgJiYgdHlwZW9mIGRpciAhPSBcIm51bWJlclwiKSB7XG4gICAgICAgIGlmIChkaXIgPT0gbnVsbCkgZGlyID0gdGhpcy5vcHRpb25zLnNtYXJ0SW5kZW50ID8gXCJzbWFydFwiIDogXCJwcmV2XCI7XG4gICAgICAgIGVsc2UgZGlyID0gZGlyID8gXCJhZGRcIiA6IFwic3VidHJhY3RcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpc0xpbmUodGhpcy5kb2MsIG4pKSBpbmRlbnRMaW5lKHRoaXMsIG4sIGRpciwgYWdncmVzc2l2ZSk7XG4gICAgfSksXG4gICAgaW5kZW50U2VsZWN0aW9uOiBtZXRob2RPcChmdW5jdGlvbihob3cpIHtcbiAgICAgIHZhciByYW5nZXMgPSB0aGlzLmRvYy5zZWwucmFuZ2VzLCBlbmQgPSAtMTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByYW5nZSA9IHJhbmdlc1tpXTtcbiAgICAgICAgaWYgKCFyYW5nZS5lbXB0eSgpKSB7XG4gICAgICAgICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoZW5kLCByYW5nZS5mcm9tKCkubGluZSk7XG4gICAgICAgICAgdmFyIHRvID0gcmFuZ2UudG8oKTtcbiAgICAgICAgICBlbmQgPSBNYXRoLm1pbih0aGlzLmxhc3RMaW5lKCksIHRvLmxpbmUgLSAodG8uY2ggPyAwIDogMSkpICsgMTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gc3RhcnQ7IGogPCBlbmQ7ICsrailcbiAgICAgICAgICAgIGluZGVudExpbmUodGhpcywgaiwgaG93KTtcbiAgICAgICAgfSBlbHNlIGlmIChyYW5nZS5oZWFkLmxpbmUgPiBlbmQpIHtcbiAgICAgICAgICBpbmRlbnRMaW5lKHRoaXMsIHJhbmdlLmhlYWQubGluZSwgaG93LCB0cnVlKTtcbiAgICAgICAgICBlbmQgPSByYW5nZS5oZWFkLmxpbmU7XG4gICAgICAgICAgaWYgKGkgPT0gdGhpcy5kb2Muc2VsLnByaW1JbmRleCkgZW5zdXJlQ3Vyc29yVmlzaWJsZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLFxuXG4gICAgLy8gRmV0Y2ggdGhlIHBhcnNlciB0b2tlbiBmb3IgYSBnaXZlbiBjaGFyYWN0ZXIuIFVzZWZ1bCBmb3IgaGFja3NcbiAgICAvLyB0aGF0IHdhbnQgdG8gaW5zcGVjdCB0aGUgbW9kZSBzdGF0ZSAoc2F5LCBmb3IgY29tcGxldGlvbikuXG4gICAgZ2V0VG9rZW5BdDogZnVuY3Rpb24ocG9zLCBwcmVjaXNlKSB7XG4gICAgICB2YXIgZG9jID0gdGhpcy5kb2M7XG4gICAgICBwb3MgPSBjbGlwUG9zKGRvYywgcG9zKTtcbiAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlQmVmb3JlKHRoaXMsIHBvcy5saW5lLCBwcmVjaXNlKSwgbW9kZSA9IHRoaXMuZG9jLm1vZGU7XG4gICAgICB2YXIgbGluZSA9IGdldExpbmUoZG9jLCBwb3MubGluZSk7XG4gICAgICB2YXIgc3RyZWFtID0gbmV3IFN0cmluZ1N0cmVhbShsaW5lLnRleHQsIHRoaXMub3B0aW9ucy50YWJTaXplKTtcbiAgICAgIHdoaWxlIChzdHJlYW0ucG9zIDwgcG9zLmNoICYmICFzdHJlYW0uZW9sKCkpIHtcbiAgICAgICAgc3RyZWFtLnN0YXJ0ID0gc3RyZWFtLnBvcztcbiAgICAgICAgdmFyIHN0eWxlID0gcmVhZFRva2VuKG1vZGUsIHN0cmVhbSwgc3RhdGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtzdGFydDogc3RyZWFtLnN0YXJ0LFxuICAgICAgICAgICAgICBlbmQ6IHN0cmVhbS5wb3MsXG4gICAgICAgICAgICAgIHN0cmluZzogc3RyZWFtLmN1cnJlbnQoKSxcbiAgICAgICAgICAgICAgdHlwZTogc3R5bGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlfTtcbiAgICB9LFxuXG4gICAgZ2V0VG9rZW5UeXBlQXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgcG9zID0gY2xpcFBvcyh0aGlzLmRvYywgcG9zKTtcbiAgICAgIHZhciBzdHlsZXMgPSBnZXRMaW5lU3R5bGVzKHRoaXMsIGdldExpbmUodGhpcy5kb2MsIHBvcy5saW5lKSk7XG4gICAgICB2YXIgYmVmb3JlID0gMCwgYWZ0ZXIgPSAoc3R5bGVzLmxlbmd0aCAtIDEpIC8gMiwgY2ggPSBwb3MuY2g7XG4gICAgICB2YXIgdHlwZTtcbiAgICAgIGlmIChjaCA9PSAwKSB0eXBlID0gc3R5bGVzWzJdO1xuICAgICAgZWxzZSBmb3IgKDs7KSB7XG4gICAgICAgIHZhciBtaWQgPSAoYmVmb3JlICsgYWZ0ZXIpID4+IDE7XG4gICAgICAgIGlmICgobWlkID8gc3R5bGVzW21pZCAqIDIgLSAxXSA6IDApID49IGNoKSBhZnRlciA9IG1pZDtcbiAgICAgICAgZWxzZSBpZiAoc3R5bGVzW21pZCAqIDIgKyAxXSA8IGNoKSBiZWZvcmUgPSBtaWQgKyAxO1xuICAgICAgICBlbHNlIHsgdHlwZSA9IHN0eWxlc1ttaWQgKiAyICsgMl07IGJyZWFrOyB9XG4gICAgICB9XG4gICAgICB2YXIgY3V0ID0gdHlwZSA/IHR5cGUuaW5kZXhPZihcImNtLW92ZXJsYXkgXCIpIDogLTE7XG4gICAgICByZXR1cm4gY3V0IDwgMCA/IHR5cGUgOiBjdXQgPT0gMCA/IG51bGwgOiB0eXBlLnNsaWNlKDAsIGN1dCAtIDEpO1xuICAgIH0sXG5cbiAgICBnZXRNb2RlQXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgdmFyIG1vZGUgPSB0aGlzLmRvYy5tb2RlO1xuICAgICAgaWYgKCFtb2RlLmlubmVyTW9kZSkgcmV0dXJuIG1vZGU7XG4gICAgICByZXR1cm4gQ29kZU1pcnJvci5pbm5lck1vZGUobW9kZSwgdGhpcy5nZXRUb2tlbkF0KHBvcykuc3RhdGUpLm1vZGU7XG4gICAgfSxcblxuICAgIGdldEhlbHBlcjogZnVuY3Rpb24ocG9zLCB0eXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIZWxwZXJzKHBvcywgdHlwZSlbMF07XG4gICAgfSxcblxuICAgIGdldEhlbHBlcnM6IGZ1bmN0aW9uKHBvcywgdHlwZSkge1xuICAgICAgdmFyIGZvdW5kID0gW107XG4gICAgICBpZiAoIWhlbHBlcnMuaGFzT3duUHJvcGVydHkodHlwZSkpIHJldHVybiBoZWxwZXJzO1xuICAgICAgdmFyIGhlbHAgPSBoZWxwZXJzW3R5cGVdLCBtb2RlID0gdGhpcy5nZXRNb2RlQXQocG9zKTtcbiAgICAgIGlmICh0eXBlb2YgbW9kZVt0eXBlXSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmIChoZWxwW21vZGVbdHlwZV1dKSBmb3VuZC5wdXNoKGhlbHBbbW9kZVt0eXBlXV0pO1xuICAgICAgfSBlbHNlIGlmIChtb2RlW3R5cGVdKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZVt0eXBlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB2YWwgPSBoZWxwW21vZGVbdHlwZV1baV1dO1xuICAgICAgICAgIGlmICh2YWwpIGZvdW5kLnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtb2RlLmhlbHBlclR5cGUgJiYgaGVscFttb2RlLmhlbHBlclR5cGVdKSB7XG4gICAgICAgIGZvdW5kLnB1c2goaGVscFttb2RlLmhlbHBlclR5cGVdKTtcbiAgICAgIH0gZWxzZSBpZiAoaGVscFttb2RlLm5hbWVdKSB7XG4gICAgICAgIGZvdW5kLnB1c2goaGVscFttb2RlLm5hbWVdKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVscC5fZ2xvYmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWxwLl9nbG9iYWxbaV07XG4gICAgICAgIGlmIChjdXIucHJlZChtb2RlLCB0aGlzKSAmJiBpbmRleE9mKGZvdW5kLCBjdXIudmFsKSA9PSAtMSlcbiAgICAgICAgICBmb3VuZC5wdXNoKGN1ci52YWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0ZUFmdGVyOiBmdW5jdGlvbihsaW5lLCBwcmVjaXNlKSB7XG4gICAgICB2YXIgZG9jID0gdGhpcy5kb2M7XG4gICAgICBsaW5lID0gY2xpcExpbmUoZG9jLCBsaW5lID09IG51bGwgPyBkb2MuZmlyc3QgKyBkb2Muc2l6ZSAtIDE6IGxpbmUpO1xuICAgICAgcmV0dXJuIGdldFN0YXRlQmVmb3JlKHRoaXMsIGxpbmUgKyAxLCBwcmVjaXNlKTtcbiAgICB9LFxuXG4gICAgY3Vyc29yQ29vcmRzOiBmdW5jdGlvbihzdGFydCwgbW9kZSkge1xuICAgICAgdmFyIHBvcywgcmFuZ2UgPSB0aGlzLmRvYy5zZWwucHJpbWFyeSgpO1xuICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHBvcyA9IHJhbmdlLmhlYWQ7XG4gICAgICBlbHNlIGlmICh0eXBlb2Ygc3RhcnQgPT0gXCJvYmplY3RcIikgcG9zID0gY2xpcFBvcyh0aGlzLmRvYywgc3RhcnQpO1xuICAgICAgZWxzZSBwb3MgPSBzdGFydCA/IHJhbmdlLmZyb20oKSA6IHJhbmdlLnRvKCk7XG4gICAgICByZXR1cm4gY3Vyc29yQ29vcmRzKHRoaXMsIHBvcywgbW9kZSB8fCBcInBhZ2VcIik7XG4gICAgfSxcblxuICAgIGNoYXJDb29yZHM6IGZ1bmN0aW9uKHBvcywgbW9kZSkge1xuICAgICAgcmV0dXJuIGNoYXJDb29yZHModGhpcywgY2xpcFBvcyh0aGlzLmRvYywgcG9zKSwgbW9kZSB8fCBcInBhZ2VcIik7XG4gICAgfSxcblxuICAgIGNvb3Jkc0NoYXI6IGZ1bmN0aW9uKGNvb3JkcywgbW9kZSkge1xuICAgICAgY29vcmRzID0gZnJvbUNvb3JkU3lzdGVtKHRoaXMsIGNvb3JkcywgbW9kZSB8fCBcInBhZ2VcIik7XG4gICAgICByZXR1cm4gY29vcmRzQ2hhcih0aGlzLCBjb29yZHMubGVmdCwgY29vcmRzLnRvcCk7XG4gICAgfSxcblxuICAgIGxpbmVBdEhlaWdodDogZnVuY3Rpb24oaGVpZ2h0LCBtb2RlKSB7XG4gICAgICBoZWlnaHQgPSBmcm9tQ29vcmRTeXN0ZW0odGhpcywge3RvcDogaGVpZ2h0LCBsZWZ0OiAwfSwgbW9kZSB8fCBcInBhZ2VcIikudG9wO1xuICAgICAgcmV0dXJuIGxpbmVBdEhlaWdodCh0aGlzLmRvYywgaGVpZ2h0ICsgdGhpcy5kaXNwbGF5LnZpZXdPZmZzZXQpO1xuICAgIH0sXG4gICAgaGVpZ2h0QXRMaW5lOiBmdW5jdGlvbihsaW5lLCBtb2RlKSB7XG4gICAgICB2YXIgZW5kID0gZmFsc2UsIGxhc3QgPSB0aGlzLmRvYy5maXJzdCArIHRoaXMuZG9jLnNpemUgLSAxO1xuICAgICAgaWYgKGxpbmUgPCB0aGlzLmRvYy5maXJzdCkgbGluZSA9IHRoaXMuZG9jLmZpcnN0O1xuICAgICAgZWxzZSBpZiAobGluZSA+IGxhc3QpIHsgbGluZSA9IGxhc3Q7IGVuZCA9IHRydWU7IH1cbiAgICAgIHZhciBsaW5lT2JqID0gZ2V0TGluZSh0aGlzLmRvYywgbGluZSk7XG4gICAgICByZXR1cm4gaW50b0Nvb3JkU3lzdGVtKHRoaXMsIGxpbmVPYmosIHt0b3A6IDAsIGxlZnQ6IDB9LCBtb2RlIHx8IFwicGFnZVwiKS50b3AgK1xuICAgICAgICAoZW5kID8gdGhpcy5kb2MuaGVpZ2h0IC0gaGVpZ2h0QXRMaW5lKGxpbmVPYmopIDogMCk7XG4gICAgfSxcblxuICAgIGRlZmF1bHRUZXh0SGVpZ2h0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRleHRIZWlnaHQodGhpcy5kaXNwbGF5KTsgfSxcbiAgICBkZWZhdWx0Q2hhcldpZHRoOiBmdW5jdGlvbigpIHsgcmV0dXJuIGNoYXJXaWR0aCh0aGlzLmRpc3BsYXkpOyB9LFxuXG4gICAgc2V0R3V0dGVyTWFya2VyOiBtZXRob2RPcChmdW5jdGlvbihsaW5lLCBndXR0ZXJJRCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBjaGFuZ2VMaW5lKHRoaXMsIGxpbmUsIFwiZ3V0dGVyXCIsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgdmFyIG1hcmtlcnMgPSBsaW5lLmd1dHRlck1hcmtlcnMgfHwgKGxpbmUuZ3V0dGVyTWFya2VycyA9IHt9KTtcbiAgICAgICAgbWFya2Vyc1tndXR0ZXJJRF0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF2YWx1ZSAmJiBpc0VtcHR5KG1hcmtlcnMpKSBsaW5lLmd1dHRlck1hcmtlcnMgPSBudWxsO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pLFxuXG4gICAgY2xlYXJHdXR0ZXI6IG1ldGhvZE9wKGZ1bmN0aW9uKGd1dHRlcklEKSB7XG4gICAgICB2YXIgY20gPSB0aGlzLCBkb2MgPSBjbS5kb2MsIGkgPSBkb2MuZmlyc3Q7XG4gICAgICBkb2MuaXRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLmd1dHRlck1hcmtlcnMgJiYgbGluZS5ndXR0ZXJNYXJrZXJzW2d1dHRlcklEXSkge1xuICAgICAgICAgIGxpbmUuZ3V0dGVyTWFya2Vyc1tndXR0ZXJJRF0gPSBudWxsO1xuICAgICAgICAgIHJlZ0xpbmVDaGFuZ2UoY20sIGksIFwiZ3V0dGVyXCIpO1xuICAgICAgICAgIGlmIChpc0VtcHR5KGxpbmUuZ3V0dGVyTWFya2VycykpIGxpbmUuZ3V0dGVyTWFya2VycyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKytpO1xuICAgICAgfSk7XG4gICAgfSksXG5cbiAgICBhZGRMaW5lQ2xhc3M6IG1ldGhvZE9wKGZ1bmN0aW9uKGhhbmRsZSwgd2hlcmUsIGNscykge1xuICAgICAgcmV0dXJuIGNoYW5nZUxpbmUodGhpcywgaGFuZGxlLCBcImNsYXNzXCIsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgdmFyIHByb3AgPSB3aGVyZSA9PSBcInRleHRcIiA/IFwidGV4dENsYXNzXCIgOiB3aGVyZSA9PSBcImJhY2tncm91bmRcIiA/IFwiYmdDbGFzc1wiIDogXCJ3cmFwQ2xhc3NcIjtcbiAgICAgICAgaWYgKCFsaW5lW3Byb3BdKSBsaW5lW3Byb3BdID0gY2xzO1xuICAgICAgICBlbHNlIGlmIChuZXcgUmVnRXhwKFwiKD86XnxcXFxccylcIiArIGNscyArIFwiKD86JHxcXFxccylcIikudGVzdChsaW5lW3Byb3BdKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBlbHNlIGxpbmVbcHJvcF0gKz0gXCIgXCIgKyBjbHM7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSksXG5cbiAgICByZW1vdmVMaW5lQ2xhc3M6IG1ldGhvZE9wKGZ1bmN0aW9uKGhhbmRsZSwgd2hlcmUsIGNscykge1xuICAgICAgcmV0dXJuIGNoYW5nZUxpbmUodGhpcywgaGFuZGxlLCBcImNsYXNzXCIsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgdmFyIHByb3AgPSB3aGVyZSA9PSBcInRleHRcIiA/IFwidGV4dENsYXNzXCIgOiB3aGVyZSA9PSBcImJhY2tncm91bmRcIiA/IFwiYmdDbGFzc1wiIDogXCJ3cmFwQ2xhc3NcIjtcbiAgICAgICAgdmFyIGN1ciA9IGxpbmVbcHJvcF07XG4gICAgICAgIGlmICghY3VyKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGVsc2UgaWYgKGNscyA9PSBudWxsKSBsaW5lW3Byb3BdID0gbnVsbDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gY3VyLm1hdGNoKG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGNscyArIFwiKD86JHxcXFxccyspXCIpKTtcbiAgICAgICAgICBpZiAoIWZvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgdmFyIGVuZCA9IGZvdW5kLmluZGV4ICsgZm91bmRbMF0ubGVuZ3RoO1xuICAgICAgICAgIGxpbmVbcHJvcF0gPSBjdXIuc2xpY2UoMCwgZm91bmQuaW5kZXgpICsgKCFmb3VuZC5pbmRleCB8fCBlbmQgPT0gY3VyLmxlbmd0aCA/IFwiXCIgOiBcIiBcIikgKyBjdXIuc2xpY2UoZW5kKSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSksXG5cbiAgICBhZGRMaW5lV2lkZ2V0OiBtZXRob2RPcChmdW5jdGlvbihoYW5kbGUsIG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBhZGRMaW5lV2lkZ2V0KHRoaXMsIGhhbmRsZSwgbm9kZSwgb3B0aW9ucyk7XG4gICAgfSksXG5cbiAgICByZW1vdmVMaW5lV2lkZ2V0OiBmdW5jdGlvbih3aWRnZXQpIHsgd2lkZ2V0LmNsZWFyKCk7IH0sXG5cbiAgICBsaW5lSW5mbzogZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgaWYgKCFpc0xpbmUodGhpcy5kb2MsIGxpbmUpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIG4gPSBsaW5lO1xuICAgICAgICBsaW5lID0gZ2V0TGluZSh0aGlzLmRvYywgbGluZSk7XG4gICAgICAgIGlmICghbGluZSkgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbiA9IGxpbmVObyhsaW5lKTtcbiAgICAgICAgaWYgKG4gPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge2xpbmU6IG4sIGhhbmRsZTogbGluZSwgdGV4dDogbGluZS50ZXh0LCBndXR0ZXJNYXJrZXJzOiBsaW5lLmd1dHRlck1hcmtlcnMsXG4gICAgICAgICAgICAgIHRleHRDbGFzczogbGluZS50ZXh0Q2xhc3MsIGJnQ2xhc3M6IGxpbmUuYmdDbGFzcywgd3JhcENsYXNzOiBsaW5lLndyYXBDbGFzcyxcbiAgICAgICAgICAgICAgd2lkZ2V0czogbGluZS53aWRnZXRzfTtcbiAgICB9LFxuXG4gICAgZ2V0Vmlld3BvcnQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4ge2Zyb206IHRoaXMuZGlzcGxheS52aWV3RnJvbSwgdG86IHRoaXMuZGlzcGxheS52aWV3VG99O30sXG5cbiAgICBhZGRXaWRnZXQ6IGZ1bmN0aW9uKHBvcywgbm9kZSwgc2Nyb2xsLCB2ZXJ0LCBob3Jpeikge1xuICAgICAgdmFyIGRpc3BsYXkgPSB0aGlzLmRpc3BsYXk7XG4gICAgICBwb3MgPSBjdXJzb3JDb29yZHModGhpcywgY2xpcFBvcyh0aGlzLmRvYywgcG9zKSk7XG4gICAgICB2YXIgdG9wID0gcG9zLmJvdHRvbSwgbGVmdCA9IHBvcy5sZWZ0O1xuICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIGRpc3BsYXkuc2l6ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICBpZiAodmVydCA9PSBcIm92ZXJcIikge1xuICAgICAgICB0b3AgPSBwb3MudG9wO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0ID09IFwiYWJvdmVcIiB8fCB2ZXJ0ID09IFwibmVhclwiKSB7XG4gICAgICAgIHZhciB2c3BhY2UgPSBNYXRoLm1heChkaXNwbGF5LndyYXBwZXIuY2xpZW50SGVpZ2h0LCB0aGlzLmRvYy5oZWlnaHQpLFxuICAgICAgICBoc3BhY2UgPSBNYXRoLm1heChkaXNwbGF5LnNpemVyLmNsaWVudFdpZHRoLCBkaXNwbGF5LmxpbmVTcGFjZS5jbGllbnRXaWR0aCk7XG4gICAgICAgIC8vIERlZmF1bHQgdG8gcG9zaXRpb25pbmcgYWJvdmUgKGlmIHNwZWNpZmllZCBhbmQgcG9zc2libGUpOyBvdGhlcndpc2UgZGVmYXVsdCB0byBwb3NpdGlvbmluZyBiZWxvd1xuICAgICAgICBpZiAoKHZlcnQgPT0gJ2Fib3ZlJyB8fCBwb3MuYm90dG9tICsgbm9kZS5vZmZzZXRIZWlnaHQgPiB2c3BhY2UpICYmIHBvcy50b3AgPiBub2RlLm9mZnNldEhlaWdodClcbiAgICAgICAgICB0b3AgPSBwb3MudG9wIC0gbm9kZS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGVsc2UgaWYgKHBvcy5ib3R0b20gKyBub2RlLm9mZnNldEhlaWdodCA8PSB2c3BhY2UpXG4gICAgICAgICAgdG9wID0gcG9zLmJvdHRvbTtcbiAgICAgICAgaWYgKGxlZnQgKyBub2RlLm9mZnNldFdpZHRoID4gaHNwYWNlKVxuICAgICAgICAgIGxlZnQgPSBoc3BhY2UgLSBub2RlLm9mZnNldFdpZHRoO1xuICAgICAgfVxuICAgICAgbm9kZS5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCI7XG4gICAgICBub2RlLnN0eWxlLmxlZnQgPSBub2RlLnN0eWxlLnJpZ2h0ID0gXCJcIjtcbiAgICAgIGlmIChob3JpeiA9PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgbGVmdCA9IGRpc3BsYXkuc2l6ZXIuY2xpZW50V2lkdGggLSBub2RlLm9mZnNldFdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLnJpZ2h0ID0gXCIwcHhcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChob3JpeiA9PSBcImxlZnRcIikgbGVmdCA9IDA7XG4gICAgICAgIGVsc2UgaWYgKGhvcml6ID09IFwibWlkZGxlXCIpIGxlZnQgPSAoZGlzcGxheS5zaXplci5jbGllbnRXaWR0aCAtIG5vZGUub2Zmc2V0V2lkdGgpIC8gMjtcbiAgICAgICAgbm9kZS5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgIH1cbiAgICAgIGlmIChzY3JvbGwpXG4gICAgICAgIHNjcm9sbEludG9WaWV3KHRoaXMsIGxlZnQsIHRvcCwgbGVmdCArIG5vZGUub2Zmc2V0V2lkdGgsIHRvcCArIG5vZGUub2Zmc2V0SGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgdHJpZ2dlck9uS2V5RG93bjogbWV0aG9kT3Aob25LZXlEb3duKSxcbiAgICB0cmlnZ2VyT25LZXlQcmVzczogbWV0aG9kT3Aob25LZXlQcmVzcyksXG4gICAgdHJpZ2dlck9uS2V5VXA6IG1ldGhvZE9wKG9uS2V5VXApLFxuXG4gICAgZXhlY0NvbW1hbmQ6IGZ1bmN0aW9uKGNtZCkge1xuICAgICAgaWYgKGNvbW1hbmRzLmhhc093blByb3BlcnR5KGNtZCkpXG4gICAgICAgIHJldHVybiBjb21tYW5kc1tjbWRdKHRoaXMpO1xuICAgIH0sXG5cbiAgICBmaW5kUG9zSDogZnVuY3Rpb24oZnJvbSwgYW1vdW50LCB1bml0LCB2aXN1YWxseSkge1xuICAgICAgdmFyIGRpciA9IDE7XG4gICAgICBpZiAoYW1vdW50IDwgMCkgeyBkaXIgPSAtMTsgYW1vdW50ID0gLWFtb3VudDsgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGN1ciA9IGNsaXBQb3ModGhpcy5kb2MsIGZyb20pOyBpIDwgYW1vdW50OyArK2kpIHtcbiAgICAgICAgY3VyID0gZmluZFBvc0godGhpcy5kb2MsIGN1ciwgZGlyLCB1bml0LCB2aXN1YWxseSk7XG4gICAgICAgIGlmIChjdXIuaGl0U2lkZSkgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VyO1xuICAgIH0sXG5cbiAgICBtb3ZlSDogbWV0aG9kT3AoZnVuY3Rpb24oZGlyLCB1bml0KSB7XG4gICAgICB2YXIgY20gPSB0aGlzO1xuICAgICAgY20uZXh0ZW5kU2VsZWN0aW9uc0J5KGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmIChjbS5kaXNwbGF5LnNoaWZ0IHx8IGNtLmRvYy5leHRlbmQgfHwgcmFuZ2UuZW1wdHkoKSlcbiAgICAgICAgICByZXR1cm4gZmluZFBvc0goY20uZG9jLCByYW5nZS5oZWFkLCBkaXIsIHVuaXQsIGNtLm9wdGlvbnMucnRsTW92ZVZpc3VhbGx5KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBkaXIgPCAwID8gcmFuZ2UuZnJvbSgpIDogcmFuZ2UudG8oKTtcbiAgICAgIH0sIHNlbF9tb3ZlKTtcbiAgICB9KSxcblxuICAgIGRlbGV0ZUg6IG1ldGhvZE9wKGZ1bmN0aW9uKGRpciwgdW5pdCkge1xuICAgICAgdmFyIHNlbCA9IHRoaXMuZG9jLnNlbCwgZG9jID0gdGhpcy5kb2M7XG4gICAgICBpZiAoc2VsLnNvbWV0aGluZ1NlbGVjdGVkKCkpXG4gICAgICAgIGRvYy5yZXBsYWNlU2VsZWN0aW9uKFwiXCIsIG51bGwsIFwiK2RlbGV0ZVwiKTtcbiAgICAgIGVsc2VcbiAgICAgICAgZGVsZXRlTmVhclNlbGVjdGlvbih0aGlzLCBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICAgIHZhciBvdGhlciA9IGZpbmRQb3NIKGRvYywgcmFuZ2UuaGVhZCwgZGlyLCB1bml0LCBmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRpciA8IDAgPyB7ZnJvbTogb3RoZXIsIHRvOiByYW5nZS5oZWFkfSA6IHtmcm9tOiByYW5nZS5oZWFkLCB0bzogb3RoZXJ9O1xuICAgICAgICB9KTtcbiAgICB9KSxcblxuICAgIGZpbmRQb3NWOiBmdW5jdGlvbihmcm9tLCBhbW91bnQsIHVuaXQsIGdvYWxDb2x1bW4pIHtcbiAgICAgIHZhciBkaXIgPSAxLCB4ID0gZ29hbENvbHVtbjtcbiAgICAgIGlmIChhbW91bnQgPCAwKSB7IGRpciA9IC0xOyBhbW91bnQgPSAtYW1vdW50OyB9XG4gICAgICBmb3IgKHZhciBpID0gMCwgY3VyID0gY2xpcFBvcyh0aGlzLmRvYywgZnJvbSk7IGkgPCBhbW91bnQ7ICsraSkge1xuICAgICAgICB2YXIgY29vcmRzID0gY3Vyc29yQ29vcmRzKHRoaXMsIGN1ciwgXCJkaXZcIik7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHggPSBjb29yZHMubGVmdDtcbiAgICAgICAgZWxzZSBjb29yZHMubGVmdCA9IHg7XG4gICAgICAgIGN1ciA9IGZpbmRQb3NWKHRoaXMsIGNvb3JkcywgZGlyLCB1bml0KTtcbiAgICAgICAgaWYgKGN1ci5oaXRTaWRlKSBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXI7XG4gICAgfSxcblxuICAgIG1vdmVWOiBtZXRob2RPcChmdW5jdGlvbihkaXIsIHVuaXQpIHtcbiAgICAgIHZhciBjbSA9IHRoaXMsIGRvYyA9IHRoaXMuZG9jLCBnb2FscyA9IFtdO1xuICAgICAgdmFyIGNvbGxhcHNlID0gIWNtLmRpc3BsYXkuc2hpZnQgJiYgIWRvYy5leHRlbmQgJiYgZG9jLnNlbC5zb21ldGhpbmdTZWxlY3RlZCgpO1xuICAgICAgZG9jLmV4dGVuZFNlbGVjdGlvbnNCeShmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoY29sbGFwc2UpXG4gICAgICAgICAgcmV0dXJuIGRpciA8IDAgPyByYW5nZS5mcm9tKCkgOiByYW5nZS50bygpO1xuICAgICAgICB2YXIgaGVhZFBvcyA9IGN1cnNvckNvb3JkcyhjbSwgcmFuZ2UuaGVhZCwgXCJkaXZcIik7XG4gICAgICAgIGlmIChyYW5nZS5nb2FsQ29sdW1uICE9IG51bGwpIGhlYWRQb3MubGVmdCA9IHJhbmdlLmdvYWxDb2x1bW47XG4gICAgICAgIGdvYWxzLnB1c2goaGVhZFBvcy5sZWZ0KTtcbiAgICAgICAgdmFyIHBvcyA9IGZpbmRQb3NWKGNtLCBoZWFkUG9zLCBkaXIsIHVuaXQpO1xuICAgICAgICBpZiAodW5pdCA9PSBcInBhZ2VcIiAmJiByYW5nZSA9PSBkb2Muc2VsLnByaW1hcnkoKSlcbiAgICAgICAgICBhZGRUb1Njcm9sbFBvcyhjbSwgbnVsbCwgY2hhckNvb3JkcyhjbSwgcG9zLCBcImRpdlwiKS50b3AgLSBoZWFkUG9zLnRvcCk7XG4gICAgICAgIHJldHVybiBwb3M7XG4gICAgICB9LCBzZWxfbW92ZSk7XG4gICAgICBpZiAoZ29hbHMubGVuZ3RoKSBmb3IgKHZhciBpID0gMDsgaSA8IGRvYy5zZWwucmFuZ2VzLmxlbmd0aDsgaSsrKVxuICAgICAgICBkb2Muc2VsLnJhbmdlc1tpXS5nb2FsQ29sdW1uID0gZ29hbHNbaV07XG4gICAgfSksXG5cbiAgICB0b2dnbGVPdmVyd3JpdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA9PSB0aGlzLnN0YXRlLm92ZXJ3cml0ZSkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMuc3RhdGUub3ZlcndyaXRlID0gIXRoaXMuc3RhdGUub3ZlcndyaXRlKVxuICAgICAgICBhZGRDbGFzcyh0aGlzLmRpc3BsYXkuY3Vyc29yRGl2LCBcIkNvZGVNaXJyb3Itb3ZlcndyaXRlXCIpO1xuICAgICAgZWxzZVxuICAgICAgICBybUNsYXNzKHRoaXMuZGlzcGxheS5jdXJzb3JEaXYsIFwiQ29kZU1pcnJvci1vdmVyd3JpdGVcIik7XG5cbiAgICAgIHNpZ25hbCh0aGlzLCBcIm92ZXJ3cml0ZVRvZ2dsZVwiLCB0aGlzLCB0aGlzLnN0YXRlLm92ZXJ3cml0ZSk7XG4gICAgfSxcbiAgICBoYXNGb2N1czogZnVuY3Rpb24oKSB7IHJldHVybiBhY3RpdmVFbHQoKSA9PSB0aGlzLmRpc3BsYXkuaW5wdXQ7IH0sXG5cbiAgICBzY3JvbGxUbzogbWV0aG9kT3AoZnVuY3Rpb24oeCwgeSkge1xuICAgICAgaWYgKHggIT0gbnVsbCB8fCB5ICE9IG51bGwpIHJlc29sdmVTY3JvbGxUb1Bvcyh0aGlzKTtcbiAgICAgIGlmICh4ICE9IG51bGwpIHRoaXMuY3VyT3Auc2Nyb2xsTGVmdCA9IHg7XG4gICAgICBpZiAoeSAhPSBudWxsKSB0aGlzLmN1ck9wLnNjcm9sbFRvcCA9IHk7XG4gICAgfSksXG4gICAgZ2V0U2Nyb2xsSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2Nyb2xsZXIgPSB0aGlzLmRpc3BsYXkuc2Nyb2xsZXIsIGNvID0gc2Nyb2xsZXJDdXRPZmY7XG4gICAgICByZXR1cm4ge2xlZnQ6IHNjcm9sbGVyLnNjcm9sbExlZnQsIHRvcDogc2Nyb2xsZXIuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNjcm9sbGVyLnNjcm9sbEhlaWdodCAtIGNvLCB3aWR0aDogc2Nyb2xsZXIuc2Nyb2xsV2lkdGggLSBjbyxcbiAgICAgICAgICAgICAgY2xpZW50SGVpZ2h0OiBzY3JvbGxlci5jbGllbnRIZWlnaHQgLSBjbywgY2xpZW50V2lkdGg6IHNjcm9sbGVyLmNsaWVudFdpZHRoIC0gY299O1xuICAgIH0sXG5cbiAgICBzY3JvbGxJbnRvVmlldzogbWV0aG9kT3AoZnVuY3Rpb24ocmFuZ2UsIG1hcmdpbikge1xuICAgICAgaWYgKHJhbmdlID09IG51bGwpIHtcbiAgICAgICAgcmFuZ2UgPSB7ZnJvbTogdGhpcy5kb2Muc2VsLnByaW1hcnkoKS5oZWFkLCB0bzogbnVsbH07XG4gICAgICAgIGlmIChtYXJnaW4gPT0gbnVsbCkgbWFyZ2luID0gdGhpcy5vcHRpb25zLmN1cnNvclNjcm9sbE1hcmdpbjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJhbmdlID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmFuZ2UgPSB7ZnJvbTogUG9zKHJhbmdlLCAwKSwgdG86IG51bGx9O1xuICAgICAgfSBlbHNlIGlmIChyYW5nZS5mcm9tID09IG51bGwpIHtcbiAgICAgICAgcmFuZ2UgPSB7ZnJvbTogcmFuZ2UsIHRvOiBudWxsfTtcbiAgICAgIH1cbiAgICAgIGlmICghcmFuZ2UudG8pIHJhbmdlLnRvID0gcmFuZ2UuZnJvbTtcbiAgICAgIHJhbmdlLm1hcmdpbiA9IG1hcmdpbiB8fCAwO1xuXG4gICAgICBpZiAocmFuZ2UuZnJvbS5saW5lICE9IG51bGwpIHtcbiAgICAgICAgcmVzb2x2ZVNjcm9sbFRvUG9zKHRoaXMpO1xuICAgICAgICB0aGlzLmN1ck9wLnNjcm9sbFRvUG9zID0gcmFuZ2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc1BvcyA9IGNhbGN1bGF0ZVNjcm9sbFBvcyh0aGlzLCBNYXRoLm1pbihyYW5nZS5mcm9tLmxlZnQsIHJhbmdlLnRvLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihyYW5nZS5mcm9tLnRvcCwgcmFuZ2UudG8udG9wKSAtIHJhbmdlLm1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgocmFuZ2UuZnJvbS5yaWdodCwgcmFuZ2UudG8ucmlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChyYW5nZS5mcm9tLmJvdHRvbSwgcmFuZ2UudG8uYm90dG9tKSArIHJhbmdlLm1hcmdpbik7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG8oc1Bvcy5zY3JvbGxMZWZ0LCBzUG9zLnNjcm9sbFRvcCk7XG4gICAgICB9XG4gICAgfSksXG5cbiAgICBzZXRTaXplOiBtZXRob2RPcChmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBmdW5jdGlvbiBpbnRlcnByZXQodmFsKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09IFwibnVtYmVyXCIgfHwgL15cXGQrJC8udGVzdChTdHJpbmcodmFsKSkgPyB2YWwgKyBcInB4XCIgOiB2YWw7XG4gICAgICB9XG4gICAgICBpZiAod2lkdGggIT0gbnVsbCkgdGhpcy5kaXNwbGF5LndyYXBwZXIuc3R5bGUud2lkdGggPSBpbnRlcnByZXQod2lkdGgpO1xuICAgICAgaWYgKGhlaWdodCAhPSBudWxsKSB0aGlzLmRpc3BsYXkud3JhcHBlci5zdHlsZS5oZWlnaHQgPSBpbnRlcnByZXQoaGVpZ2h0KTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGluZVdyYXBwaW5nKSBjbGVhckxpbmVNZWFzdXJlbWVudENhY2hlKHRoaXMpO1xuICAgICAgdGhpcy5jdXJPcC5mb3JjZVVwZGF0ZSA9IHRydWU7XG4gICAgICBzaWduYWwodGhpcywgXCJyZWZyZXNoXCIsIHRoaXMpO1xuICAgIH0pLFxuXG4gICAgb3BlcmF0aW9uOiBmdW5jdGlvbihmKXtyZXR1cm4gcnVuSW5PcCh0aGlzLCBmKTt9LFxuXG4gICAgcmVmcmVzaDogbWV0aG9kT3AoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2xkSGVpZ2h0ID0gdGhpcy5kaXNwbGF5LmNhY2hlZFRleHRIZWlnaHQ7XG4gICAgICByZWdDaGFuZ2UodGhpcyk7XG4gICAgICB0aGlzLmN1ck9wLmZvcmNlVXBkYXRlID0gdHJ1ZTtcbiAgICAgIGNsZWFyQ2FjaGVzKHRoaXMpO1xuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLmRvYy5zY3JvbGxMZWZ0LCB0aGlzLmRvYy5zY3JvbGxUb3ApO1xuICAgICAgdXBkYXRlR3V0dGVyU3BhY2UodGhpcyk7XG4gICAgICBpZiAob2xkSGVpZ2h0ID09IG51bGwgfHwgTWF0aC5hYnMob2xkSGVpZ2h0IC0gdGV4dEhlaWdodCh0aGlzLmRpc3BsYXkpKSA+IC41KVxuICAgICAgICBlc3RpbWF0ZUxpbmVIZWlnaHRzKHRoaXMpO1xuICAgICAgc2lnbmFsKHRoaXMsIFwicmVmcmVzaFwiLCB0aGlzKTtcbiAgICB9KSxcblxuICAgIHN3YXBEb2M6IG1ldGhvZE9wKGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIG9sZCA9IHRoaXMuZG9jO1xuICAgICAgb2xkLmNtID0gbnVsbDtcbiAgICAgIGF0dGFjaERvYyh0aGlzLCBkb2MpO1xuICAgICAgY2xlYXJDYWNoZXModGhpcyk7XG4gICAgICByZXNldElucHV0KHRoaXMpO1xuICAgICAgdGhpcy5zY3JvbGxUbyhkb2Muc2Nyb2xsTGVmdCwgZG9jLnNjcm9sbFRvcCk7XG4gICAgICBzaWduYWxMYXRlcih0aGlzLCBcInN3YXBEb2NcIiwgdGhpcywgb2xkKTtcbiAgICAgIHJldHVybiBvbGQ7XG4gICAgfSksXG5cbiAgICBnZXRJbnB1dEZpZWxkOiBmdW5jdGlvbigpe3JldHVybiB0aGlzLmRpc3BsYXkuaW5wdXQ7fSxcbiAgICBnZXRXcmFwcGVyRWxlbWVudDogZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kaXNwbGF5LndyYXBwZXI7fSxcbiAgICBnZXRTY3JvbGxlckVsZW1lbnQ6IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGlzcGxheS5zY3JvbGxlcjt9LFxuICAgIGdldEd1dHRlckVsZW1lbnQ6IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGlzcGxheS5ndXR0ZXJzO31cbiAgfTtcbiAgZXZlbnRNaXhpbihDb2RlTWlycm9yKTtcblxuICAvLyBPUFRJT04gREVGQVVMVFNcblxuICAvLyBUaGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gIHZhciBkZWZhdWx0cyA9IENvZGVNaXJyb3IuZGVmYXVsdHMgPSB7fTtcbiAgLy8gRnVuY3Rpb25zIHRvIHJ1biB3aGVuIG9wdGlvbnMgYXJlIGNoYW5nZWQuXG4gIHZhciBvcHRpb25IYW5kbGVycyA9IENvZGVNaXJyb3Iub3B0aW9uSGFuZGxlcnMgPSB7fTtcblxuICBmdW5jdGlvbiBvcHRpb24obmFtZSwgZGVmbHQsIGhhbmRsZSwgbm90T25Jbml0KSB7XG4gICAgQ29kZU1pcnJvci5kZWZhdWx0c1tuYW1lXSA9IGRlZmx0O1xuICAgIGlmIChoYW5kbGUpIG9wdGlvbkhhbmRsZXJzW25hbWVdID1cbiAgICAgIG5vdE9uSW5pdCA/IGZ1bmN0aW9uKGNtLCB2YWwsIG9sZCkge2lmIChvbGQgIT0gSW5pdCkgaGFuZGxlKGNtLCB2YWwsIG9sZCk7fSA6IGhhbmRsZTtcbiAgfVxuXG4gIC8vIFBhc3NlZCB0byBvcHRpb24gaGFuZGxlcnMgd2hlbiB0aGVyZSBpcyBubyBvbGQgdmFsdWUuXG4gIHZhciBJbml0ID0gQ29kZU1pcnJvci5Jbml0ID0ge3RvU3RyaW5nOiBmdW5jdGlvbigpe3JldHVybiBcIkNvZGVNaXJyb3IuSW5pdFwiO319O1xuXG4gIC8vIFRoZXNlIHR3byBhcmUsIG9uIGluaXQsIGNhbGxlZCBmcm9tIHRoZSBjb25zdHJ1Y3RvciBiZWNhdXNlIHRoZXlcbiAgLy8gaGF2ZSB0byBiZSBpbml0aWFsaXplZCBiZWZvcmUgdGhlIGVkaXRvciBjYW4gc3RhcnQgYXQgYWxsLlxuICBvcHRpb24oXCJ2YWx1ZVwiLCBcIlwiLCBmdW5jdGlvbihjbSwgdmFsKSB7XG4gICAgY20uc2V0VmFsdWUodmFsKTtcbiAgfSwgdHJ1ZSk7XG4gIG9wdGlvbihcIm1vZGVcIiwgbnVsbCwgZnVuY3Rpb24oY20sIHZhbCkge1xuICAgIGNtLmRvYy5tb2RlT3B0aW9uID0gdmFsO1xuICAgIGxvYWRNb2RlKGNtKTtcbiAgfSwgdHJ1ZSk7XG5cbiAgb3B0aW9uKFwiaW5kZW50VW5pdFwiLCAyLCBsb2FkTW9kZSwgdHJ1ZSk7XG4gIG9wdGlvbihcImluZGVudFdpdGhUYWJzXCIsIGZhbHNlKTtcbiAgb3B0aW9uKFwic21hcnRJbmRlbnRcIiwgdHJ1ZSk7XG4gIG9wdGlvbihcInRhYlNpemVcIiwgNCwgZnVuY3Rpb24oY20pIHtcbiAgICByZXNldE1vZGVTdGF0ZShjbSk7XG4gICAgY2xlYXJDYWNoZXMoY20pO1xuICAgIHJlZ0NoYW5nZShjbSk7XG4gIH0sIHRydWUpO1xuICBvcHRpb24oXCJzcGVjaWFsQ2hhcnNcIiwgL1tcXHRcXHUwMDAwLVxcdTAwMTlcXHUwMGFkXFx1MjAwYlxcdTIwMjhcXHUyMDI5XFx1ZmVmZl0vZywgZnVuY3Rpb24oY20sIHZhbCkge1xuICAgIGNtLm9wdGlvbnMuc3BlY2lhbENoYXJzID0gbmV3IFJlZ0V4cCh2YWwuc291cmNlICsgKHZhbC50ZXN0KFwiXFx0XCIpID8gXCJcIiA6IFwifFxcdFwiKSwgXCJnXCIpO1xuICAgIGNtLnJlZnJlc2goKTtcbiAgfSwgdHJ1ZSk7XG4gIG9wdGlvbihcInNwZWNpYWxDaGFyUGxhY2Vob2xkZXJcIiwgZGVmYXVsdFNwZWNpYWxDaGFyUGxhY2Vob2xkZXIsIGZ1bmN0aW9uKGNtKSB7Y20ucmVmcmVzaCgpO30sIHRydWUpO1xuICBvcHRpb24oXCJlbGVjdHJpY0NoYXJzXCIsIHRydWUpO1xuICBvcHRpb24oXCJydGxNb3ZlVmlzdWFsbHlcIiwgIXdpbmRvd3MpO1xuICBvcHRpb24oXCJ3aG9sZUxpbmVVcGRhdGVCZWZvcmVcIiwgdHJ1ZSk7XG5cbiAgb3B0aW9uKFwidGhlbWVcIiwgXCJkZWZhdWx0XCIsIGZ1bmN0aW9uKGNtKSB7XG4gICAgdGhlbWVDaGFuZ2VkKGNtKTtcbiAgICBndXR0ZXJzQ2hhbmdlZChjbSk7XG4gIH0sIHRydWUpO1xuICBvcHRpb24oXCJrZXlNYXBcIiwgXCJkZWZhdWx0XCIsIGtleU1hcENoYW5nZWQpO1xuICBvcHRpb24oXCJleHRyYUtleXNcIiwgbnVsbCk7XG5cbiAgb3B0aW9uKFwibGluZVdyYXBwaW5nXCIsIGZhbHNlLCB3cmFwcGluZ0NoYW5nZWQsIHRydWUpO1xuICBvcHRpb24oXCJndXR0ZXJzXCIsIFtdLCBmdW5jdGlvbihjbSkge1xuICAgIHNldEd1dHRlcnNGb3JMaW5lTnVtYmVycyhjbS5vcHRpb25zKTtcbiAgICBndXR0ZXJzQ2hhbmdlZChjbSk7XG4gIH0sIHRydWUpO1xuICBvcHRpb24oXCJmaXhlZEd1dHRlclwiLCB0cnVlLCBmdW5jdGlvbihjbSwgdmFsKSB7XG4gICAgY20uZGlzcGxheS5ndXR0ZXJzLnN0eWxlLmxlZnQgPSB2YWwgPyBjb21wZW5zYXRlRm9ySFNjcm9sbChjbS5kaXNwbGF5KSArIFwicHhcIiA6IFwiMFwiO1xuICAgIGNtLnJlZnJlc2goKTtcbiAgfSwgdHJ1ZSk7XG4gIG9wdGlvbihcImNvdmVyR3V0dGVyTmV4dFRvU2Nyb2xsYmFyXCIsIGZhbHNlLCB1cGRhdGVTY3JvbGxiYXJzLCB0cnVlKTtcbiAgb3B0aW9uKFwibGluZU51bWJlcnNcIiwgZmFsc2UsIGZ1bmN0aW9uKGNtKSB7XG4gICAgc2V0R3V0dGVyc0ZvckxpbmVOdW1iZXJzKGNtLm9wdGlvbnMpO1xuICAgIGd1dHRlcnNDaGFuZ2VkKGNtKTtcbiAgfSwgdHJ1ZSk7XG4gIG9wdGlvbihcImZpcnN0TGluZU51bWJlclwiLCAxLCBndXR0ZXJzQ2hhbmdlZCwgdHJ1ZSk7XG4gIG9wdGlvbihcImxpbmVOdW1iZXJGb3JtYXR0ZXJcIiwgZnVuY3Rpb24oaW50ZWdlcikge3JldHVybiBpbnRlZ2VyO30sIGd1dHRlcnNDaGFuZ2VkLCB0cnVlKTtcbiAgb3B0aW9uKFwic2hvd0N1cnNvcldoZW5TZWxlY3RpbmdcIiwgZmFsc2UsIHVwZGF0ZVNlbGVjdGlvbiwgdHJ1ZSk7XG5cbiAgb3B0aW9uKFwicmVzZXRTZWxlY3Rpb25PbkNvbnRleHRNZW51XCIsIHRydWUpO1xuXG4gIG9wdGlvbihcInJlYWRPbmx5XCIsIGZhbHNlLCBmdW5jdGlvbihjbSwgdmFsKSB7XG4gICAgaWYgKHZhbCA9PSBcIm5vY3Vyc29yXCIpIHtcbiAgICAgIG9uQmx1cihjbSk7XG4gICAgICBjbS5kaXNwbGF5LmlucHV0LmJsdXIoKTtcbiAgICAgIGNtLmRpc3BsYXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbS5kaXNwbGF5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBpZiAoIXZhbCkgcmVzZXRJbnB1dChjbSk7XG4gICAgfVxuICB9KTtcbiAgb3B0aW9uKFwiZGlzYWJsZUlucHV0XCIsIGZhbHNlLCBmdW5jdGlvbihjbSwgdmFsKSB7aWYgKCF2YWwpIHJlc2V0SW5wdXQoY20pO30sIHRydWUpO1xuICBvcHRpb24oXCJkcmFnRHJvcFwiLCB0cnVlKTtcblxuICBvcHRpb24oXCJjdXJzb3JCbGlua1JhdGVcIiwgNTMwKTtcbiAgb3B0aW9uKFwiY3Vyc29yU2Nyb2xsTWFyZ2luXCIsIDApO1xuICBvcHRpb24oXCJjdXJzb3JIZWlnaHRcIiwgMSk7XG4gIG9wdGlvbihcIndvcmtUaW1lXCIsIDEwMCk7XG4gIG9wdGlvbihcIndvcmtEZWxheVwiLCAxMDApO1xuICBvcHRpb24oXCJmbGF0dGVuU3BhbnNcIiwgdHJ1ZSwgcmVzZXRNb2RlU3RhdGUsIHRydWUpO1xuICBvcHRpb24oXCJhZGRNb2RlQ2xhc3NcIiwgZmFsc2UsIHJlc2V0TW9kZVN0YXRlLCB0cnVlKTtcbiAgb3B0aW9uKFwicG9sbEludGVydmFsXCIsIDEwMCk7XG4gIG9wdGlvbihcInVuZG9EZXB0aFwiLCAyMDAsIGZ1bmN0aW9uKGNtLCB2YWwpe2NtLmRvYy5oaXN0b3J5LnVuZG9EZXB0aCA9IHZhbDt9KTtcbiAgb3B0aW9uKFwiaGlzdG9yeUV2ZW50RGVsYXlcIiwgMTI1MCk7XG4gIG9wdGlvbihcInZpZXdwb3J0TWFyZ2luXCIsIDEwLCBmdW5jdGlvbihjbSl7Y20ucmVmcmVzaCgpO30sIHRydWUpO1xuICBvcHRpb24oXCJtYXhIaWdobGlnaHRMZW5ndGhcIiwgMTAwMDAsIHJlc2V0TW9kZVN0YXRlLCB0cnVlKTtcbiAgb3B0aW9uKFwibW92ZUlucHV0V2l0aEN1cnNvclwiLCB0cnVlLCBmdW5jdGlvbihjbSwgdmFsKSB7XG4gICAgaWYgKCF2YWwpIGNtLmRpc3BsYXkuaW5wdXREaXYuc3R5bGUudG9wID0gY20uZGlzcGxheS5pbnB1dERpdi5zdHlsZS5sZWZ0ID0gMDtcbiAgfSk7XG5cbiAgb3B0aW9uKFwidGFiaW5kZXhcIiwgbnVsbCwgZnVuY3Rpb24oY20sIHZhbCkge1xuICAgIGNtLmRpc3BsYXkuaW5wdXQudGFiSW5kZXggPSB2YWwgfHwgXCJcIjtcbiAgfSk7XG4gIG9wdGlvbihcImF1dG9mb2N1c1wiLCBudWxsKTtcblxuICAvLyBNT0RFIERFRklOSVRJT04gQU5EIFFVRVJZSU5HXG5cbiAgLy8gS25vd24gbW9kZXMsIGJ5IG5hbWUgYW5kIGJ5IE1JTUVcbiAgdmFyIG1vZGVzID0gQ29kZU1pcnJvci5tb2RlcyA9IHt9LCBtaW1lTW9kZXMgPSBDb2RlTWlycm9yLm1pbWVNb2RlcyA9IHt9O1xuXG4gIC8vIEV4dHJhIGFyZ3VtZW50cyBhcmUgc3RvcmVkIGFzIHRoZSBtb2RlJ3MgZGVwZW5kZW5jaWVzLCB3aGljaCBpc1xuICAvLyB1c2VkIGJ5IChsZWdhY3kpIG1lY2hhbmlzbXMgbGlrZSBsb2FkbW9kZS5qcyB0byBhdXRvbWF0aWNhbGx5XG4gIC8vIGxvYWQgYSBtb2RlLiAoUHJlZmVycmVkIG1lY2hhbmlzbSBpcyB0aGUgcmVxdWlyZS9kZWZpbmUgY2FsbHMuKVxuICBDb2RlTWlycm9yLmRlZmluZU1vZGUgPSBmdW5jdGlvbihuYW1lLCBtb2RlKSB7XG4gICAgaWYgKCFDb2RlTWlycm9yLmRlZmF1bHRzLm1vZGUgJiYgbmFtZSAhPSBcIm51bGxcIikgQ29kZU1pcnJvci5kZWZhdWx0cy5tb2RlID0gbmFtZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIG1vZGUuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkgbW9kZS5kZXBlbmRlbmNpZXMucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cbiAgICBtb2Rlc1tuYW1lXSA9IG1vZGU7XG4gIH07XG5cbiAgQ29kZU1pcnJvci5kZWZpbmVNSU1FID0gZnVuY3Rpb24obWltZSwgc3BlYykge1xuICAgIG1pbWVNb2Rlc1ttaW1lXSA9IHNwZWM7XG4gIH07XG5cbiAgLy8gR2l2ZW4gYSBNSU1FIHR5cGUsIGEge25hbWUsIC4uLm9wdGlvbnN9IGNvbmZpZyBvYmplY3QsIG9yIGEgbmFtZVxuICAvLyBzdHJpbmcsIHJldHVybiBhIG1vZGUgY29uZmlnIG9iamVjdC5cbiAgQ29kZU1pcnJvci5yZXNvbHZlTW9kZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBpZiAodHlwZW9mIHNwZWMgPT0gXCJzdHJpbmdcIiAmJiBtaW1lTW9kZXMuaGFzT3duUHJvcGVydHkoc3BlYykpIHtcbiAgICAgIHNwZWMgPSBtaW1lTW9kZXNbc3BlY107XG4gICAgfSBlbHNlIGlmIChzcGVjICYmIHR5cGVvZiBzcGVjLm5hbWUgPT0gXCJzdHJpbmdcIiAmJiBtaW1lTW9kZXMuaGFzT3duUHJvcGVydHkoc3BlYy5uYW1lKSkge1xuICAgICAgdmFyIGZvdW5kID0gbWltZU1vZGVzW3NwZWMubmFtZV07XG4gICAgICBpZiAodHlwZW9mIGZvdW5kID09IFwic3RyaW5nXCIpIGZvdW5kID0ge25hbWU6IGZvdW5kfTtcbiAgICAgIHNwZWMgPSBjcmVhdGVPYmooZm91bmQsIHNwZWMpO1xuICAgICAgc3BlYy5uYW1lID0gZm91bmQubmFtZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGVjID09IFwic3RyaW5nXCIgJiYgL15bXFx3XFwtXStcXC9bXFx3XFwtXStcXCt4bWwkLy50ZXN0KHNwZWMpKSB7XG4gICAgICByZXR1cm4gQ29kZU1pcnJvci5yZXNvbHZlTW9kZShcImFwcGxpY2F0aW9uL3htbFwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzcGVjID09IFwic3RyaW5nXCIpIHJldHVybiB7bmFtZTogc3BlY307XG4gICAgZWxzZSByZXR1cm4gc3BlYyB8fCB7bmFtZTogXCJudWxsXCJ9O1xuICB9O1xuXG4gIC8vIEdpdmVuIGEgbW9kZSBzcGVjIChhbnl0aGluZyB0aGF0IHJlc29sdmVNb2RlIGFjY2VwdHMpLCBmaW5kIGFuZFxuICAvLyBpbml0aWFsaXplIGFuIGFjdHVhbCBtb2RlIG9iamVjdC5cbiAgQ29kZU1pcnJvci5nZXRNb2RlID0gZnVuY3Rpb24ob3B0aW9ucywgc3BlYykge1xuICAgIHZhciBzcGVjID0gQ29kZU1pcnJvci5yZXNvbHZlTW9kZShzcGVjKTtcbiAgICB2YXIgbWZhY3RvcnkgPSBtb2Rlc1tzcGVjLm5hbWVdO1xuICAgIGlmICghbWZhY3RvcnkpIHJldHVybiBDb2RlTWlycm9yLmdldE1vZGUob3B0aW9ucywgXCJ0ZXh0L3BsYWluXCIpO1xuICAgIHZhciBtb2RlT2JqID0gbWZhY3Rvcnkob3B0aW9ucywgc3BlYyk7XG4gICAgaWYgKG1vZGVFeHRlbnNpb25zLmhhc093blByb3BlcnR5KHNwZWMubmFtZSkpIHtcbiAgICAgIHZhciBleHRzID0gbW9kZUV4dGVuc2lvbnNbc3BlYy5uYW1lXTtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gZXh0cykge1xuICAgICAgICBpZiAoIWV4dHMuaGFzT3duUHJvcGVydHkocHJvcCkpIGNvbnRpbnVlO1xuICAgICAgICBpZiAobW9kZU9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgbW9kZU9ialtcIl9cIiArIHByb3BdID0gbW9kZU9ialtwcm9wXTtcbiAgICAgICAgbW9kZU9ialtwcm9wXSA9IGV4dHNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICAgIG1vZGVPYmoubmFtZSA9IHNwZWMubmFtZTtcbiAgICBpZiAoc3BlYy5oZWxwZXJUeXBlKSBtb2RlT2JqLmhlbHBlclR5cGUgPSBzcGVjLmhlbHBlclR5cGU7XG4gICAgaWYgKHNwZWMubW9kZVByb3BzKSBmb3IgKHZhciBwcm9wIGluIHNwZWMubW9kZVByb3BzKVxuICAgICAgbW9kZU9ialtwcm9wXSA9IHNwZWMubW9kZVByb3BzW3Byb3BdO1xuXG4gICAgcmV0dXJuIG1vZGVPYmo7XG4gIH07XG5cbiAgLy8gTWluaW1hbCBkZWZhdWx0IG1vZGUuXG4gIENvZGVNaXJyb3IuZGVmaW5lTW9kZShcIm51bGxcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHt0b2tlbjogZnVuY3Rpb24oc3RyZWFtKSB7c3RyZWFtLnNraXBUb0VuZCgpO319O1xuICB9KTtcbiAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC9wbGFpblwiLCBcIm51bGxcIik7XG5cbiAgLy8gVGhpcyBjYW4gYmUgdXNlZCB0byBhdHRhY2ggcHJvcGVydGllcyB0byBtb2RlIG9iamVjdHMgZnJvbVxuICAvLyBvdXRzaWRlIHRoZSBhY3R1YWwgbW9kZSBkZWZpbml0aW9uLlxuICB2YXIgbW9kZUV4dGVuc2lvbnMgPSBDb2RlTWlycm9yLm1vZGVFeHRlbnNpb25zID0ge307XG4gIENvZGVNaXJyb3IuZXh0ZW5kTW9kZSA9IGZ1bmN0aW9uKG1vZGUsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgZXh0cyA9IG1vZGVFeHRlbnNpb25zLmhhc093blByb3BlcnR5KG1vZGUpID8gbW9kZUV4dGVuc2lvbnNbbW9kZV0gOiAobW9kZUV4dGVuc2lvbnNbbW9kZV0gPSB7fSk7XG4gICAgY29weU9iaihwcm9wZXJ0aWVzLCBleHRzKTtcbiAgfTtcblxuICAvLyBFWFRFTlNJT05TXG5cbiAgQ29kZU1pcnJvci5kZWZpbmVFeHRlbnNpb24gPSBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gICAgQ29kZU1pcnJvci5wcm90b3R5cGVbbmFtZV0gPSBmdW5jO1xuICB9O1xuICBDb2RlTWlycm9yLmRlZmluZURvY0V4dGVuc2lvbiA9IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICBEb2MucHJvdG90eXBlW25hbWVdID0gZnVuYztcbiAgfTtcbiAgQ29kZU1pcnJvci5kZWZpbmVPcHRpb24gPSBvcHRpb247XG5cbiAgdmFyIGluaXRIb29rcyA9IFtdO1xuICBDb2RlTWlycm9yLmRlZmluZUluaXRIb29rID0gZnVuY3Rpb24oZikge2luaXRIb29rcy5wdXNoKGYpO307XG5cbiAgdmFyIGhlbHBlcnMgPSBDb2RlTWlycm9yLmhlbHBlcnMgPSB7fTtcbiAgQ29kZU1pcnJvci5yZWdpc3RlckhlbHBlciA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCFoZWxwZXJzLmhhc093blByb3BlcnR5KHR5cGUpKSBoZWxwZXJzW3R5cGVdID0gQ29kZU1pcnJvclt0eXBlXSA9IHtfZ2xvYmFsOiBbXX07XG4gICAgaGVscGVyc1t0eXBlXVtuYW1lXSA9IHZhbHVlO1xuICB9O1xuICBDb2RlTWlycm9yLnJlZ2lzdGVyR2xvYmFsSGVscGVyID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgcHJlZGljYXRlLCB2YWx1ZSkge1xuICAgIENvZGVNaXJyb3IucmVnaXN0ZXJIZWxwZXIodHlwZSwgbmFtZSwgdmFsdWUpO1xuICAgIGhlbHBlcnNbdHlwZV0uX2dsb2JhbC5wdXNoKHtwcmVkOiBwcmVkaWNhdGUsIHZhbDogdmFsdWV9KTtcbiAgfTtcblxuICAvLyBNT0RFIFNUQVRFIEhBTkRMSU5HXG5cbiAgLy8gVXRpbGl0eSBmdW5jdGlvbnMgZm9yIHdvcmtpbmcgd2l0aCBzdGF0ZS4gRXhwb3J0ZWQgYmVjYXVzZSBuZXN0ZWRcbiAgLy8gbW9kZXMgbmVlZCB0byBkbyB0aGlzIGZvciB0aGVpciBpbm5lciBtb2Rlcy5cblxuICB2YXIgY29weVN0YXRlID0gQ29kZU1pcnJvci5jb3B5U3RhdGUgPSBmdW5jdGlvbihtb2RlLCBzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuIHN0YXRlO1xuICAgIGlmIChtb2RlLmNvcHlTdGF0ZSkgcmV0dXJuIG1vZGUuY29weVN0YXRlKHN0YXRlKTtcbiAgICB2YXIgbnN0YXRlID0ge307XG4gICAgZm9yICh2YXIgbiBpbiBzdGF0ZSkge1xuICAgICAgdmFyIHZhbCA9IHN0YXRlW25dO1xuICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIEFycmF5KSB2YWwgPSB2YWwuY29uY2F0KFtdKTtcbiAgICAgIG5zdGF0ZVtuXSA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIG5zdGF0ZTtcbiAgfTtcblxuICB2YXIgc3RhcnRTdGF0ZSA9IENvZGVNaXJyb3Iuc3RhcnRTdGF0ZSA9IGZ1bmN0aW9uKG1vZGUsIGExLCBhMikge1xuICAgIHJldHVybiBtb2RlLnN0YXJ0U3RhdGUgPyBtb2RlLnN0YXJ0U3RhdGUoYTEsIGEyKSA6IHRydWU7XG4gIH07XG5cbiAgLy8gR2l2ZW4gYSBtb2RlIGFuZCBhIHN0YXRlIChmb3IgdGhhdCBtb2RlKSwgZmluZCB0aGUgaW5uZXIgbW9kZSBhbmRcbiAgLy8gc3RhdGUgYXQgdGhlIHBvc2l0aW9uIHRoYXQgdGhlIHN0YXRlIHJlZmVycyB0by5cbiAgQ29kZU1pcnJvci5pbm5lck1vZGUgPSBmdW5jdGlvbihtb2RlLCBzdGF0ZSkge1xuICAgIHdoaWxlIChtb2RlLmlubmVyTW9kZSkge1xuICAgICAgdmFyIGluZm8gPSBtb2RlLmlubmVyTW9kZShzdGF0ZSk7XG4gICAgICBpZiAoIWluZm8gfHwgaW5mby5tb2RlID09IG1vZGUpIGJyZWFrO1xuICAgICAgc3RhdGUgPSBpbmZvLnN0YXRlO1xuICAgICAgbW9kZSA9IGluZm8ubW9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGluZm8gfHwge21vZGU6IG1vZGUsIHN0YXRlOiBzdGF0ZX07XG4gIH07XG5cbiAgLy8gU1RBTkRBUkQgQ09NTUFORFNcblxuICAvLyBDb21tYW5kcyBhcmUgcGFyYW1ldGVyLWxlc3MgYWN0aW9ucyB0aGF0IGNhbiBiZSBwZXJmb3JtZWQgb24gYW5cbiAgLy8gZWRpdG9yLCBtb3N0bHkgdXNlZCBmb3Iga2V5YmluZGluZ3MuXG4gIHZhciBjb21tYW5kcyA9IENvZGVNaXJyb3IuY29tbWFuZHMgPSB7XG4gICAgc2VsZWN0QWxsOiBmdW5jdGlvbihjbSkge2NtLnNldFNlbGVjdGlvbihQb3MoY20uZmlyc3RMaW5lKCksIDApLCBQb3MoY20ubGFzdExpbmUoKSksIHNlbF9kb250U2Nyb2xsKTt9LFxuICAgIHNpbmdsZVNlbGVjdGlvbjogZnVuY3Rpb24oY20pIHtcbiAgICAgIGNtLnNldFNlbGVjdGlvbihjbS5nZXRDdXJzb3IoXCJhbmNob3JcIiksIGNtLmdldEN1cnNvcihcImhlYWRcIiksIHNlbF9kb250U2Nyb2xsKTtcbiAgICB9LFxuICAgIGtpbGxMaW5lOiBmdW5jdGlvbihjbSkge1xuICAgICAgZGVsZXRlTmVhclNlbGVjdGlvbihjbSwgZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgaWYgKHJhbmdlLmVtcHR5KCkpIHtcbiAgICAgICAgICB2YXIgbGVuID0gZ2V0TGluZShjbS5kb2MsIHJhbmdlLmhlYWQubGluZSkudGV4dC5sZW5ndGg7XG4gICAgICAgICAgaWYgKHJhbmdlLmhlYWQuY2ggPT0gbGVuICYmIHJhbmdlLmhlYWQubGluZSA8IGNtLmxhc3RMaW5lKCkpXG4gICAgICAgICAgICByZXR1cm4ge2Zyb206IHJhbmdlLmhlYWQsIHRvOiBQb3MocmFuZ2UuaGVhZC5saW5lICsgMSwgMCl9O1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB7ZnJvbTogcmFuZ2UuaGVhZCwgdG86IFBvcyhyYW5nZS5oZWFkLmxpbmUsIGxlbil9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7ZnJvbTogcmFuZ2UuZnJvbSgpLCB0bzogcmFuZ2UudG8oKX07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZGVsZXRlTGluZTogZnVuY3Rpb24oY20pIHtcbiAgICAgIGRlbGV0ZU5lYXJTZWxlY3Rpb24oY20sIGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIHJldHVybiB7ZnJvbTogUG9zKHJhbmdlLmZyb20oKS5saW5lLCAwKSxcbiAgICAgICAgICAgICAgICB0bzogY2xpcFBvcyhjbS5kb2MsIFBvcyhyYW5nZS50bygpLmxpbmUgKyAxLCAwKSl9O1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWxMaW5lTGVmdDogZnVuY3Rpb24oY20pIHtcbiAgICAgIGRlbGV0ZU5lYXJTZWxlY3Rpb24oY20sIGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIHJldHVybiB7ZnJvbTogUG9zKHJhbmdlLmZyb20oKS5saW5lLCAwKSwgdG86IHJhbmdlLmZyb20oKX07XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uKGNtKSB7Y20udW5kbygpO30sXG4gICAgcmVkbzogZnVuY3Rpb24oY20pIHtjbS5yZWRvKCk7fSxcbiAgICB1bmRvU2VsZWN0aW9uOiBmdW5jdGlvbihjbSkge2NtLnVuZG9TZWxlY3Rpb24oKTt9LFxuICAgIHJlZG9TZWxlY3Rpb246IGZ1bmN0aW9uKGNtKSB7Y20ucmVkb1NlbGVjdGlvbigpO30sXG4gICAgZ29Eb2NTdGFydDogZnVuY3Rpb24oY20pIHtjbS5leHRlbmRTZWxlY3Rpb24oUG9zKGNtLmZpcnN0TGluZSgpLCAwKSk7fSxcbiAgICBnb0RvY0VuZDogZnVuY3Rpb24oY20pIHtjbS5leHRlbmRTZWxlY3Rpb24oUG9zKGNtLmxhc3RMaW5lKCkpKTt9LFxuICAgIGdvTGluZVN0YXJ0OiBmdW5jdGlvbihjbSkge1xuICAgICAgY20uZXh0ZW5kU2VsZWN0aW9uc0J5KGZ1bmN0aW9uKHJhbmdlKSB7IHJldHVybiBsaW5lU3RhcnQoY20sIHJhbmdlLmhlYWQubGluZSk7IH0sIHNlbF9tb3ZlKTtcbiAgICB9LFxuICAgIGdvTGluZVN0YXJ0U21hcnQ6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICBjbS5leHRlbmRTZWxlY3Rpb25zQnkoZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gbGluZVN0YXJ0KGNtLCByYW5nZS5oZWFkLmxpbmUpO1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmVIYW5kbGUoc3RhcnQubGluZSk7XG4gICAgICAgIHZhciBvcmRlciA9IGdldE9yZGVyKGxpbmUpO1xuICAgICAgICBpZiAoIW9yZGVyIHx8IG9yZGVyWzBdLmxldmVsID09IDApIHtcbiAgICAgICAgICB2YXIgZmlyc3ROb25XUyA9IE1hdGgubWF4KDAsIGxpbmUudGV4dC5zZWFyY2goL1xcUy8pKTtcbiAgICAgICAgICB2YXIgaW5XUyA9IHJhbmdlLmhlYWQubGluZSA9PSBzdGFydC5saW5lICYmIHJhbmdlLmhlYWQuY2ggPD0gZmlyc3ROb25XUyAmJiByYW5nZS5oZWFkLmNoO1xuICAgICAgICAgIHJldHVybiBQb3Moc3RhcnQubGluZSwgaW5XUyA/IDAgOiBmaXJzdE5vbldTKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcnQ7XG4gICAgICB9LCBzZWxfbW92ZSk7XG4gICAgfSxcbiAgICBnb0xpbmVFbmQ6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICBjbS5leHRlbmRTZWxlY3Rpb25zQnkoZnVuY3Rpb24ocmFuZ2UpIHsgcmV0dXJuIGxpbmVFbmQoY20sIHJhbmdlLmhlYWQubGluZSk7IH0sIHNlbF9tb3ZlKTtcbiAgICB9LFxuICAgIGdvTGluZVJpZ2h0OiBmdW5jdGlvbihjbSkge1xuICAgICAgY20uZXh0ZW5kU2VsZWN0aW9uc0J5KGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIHZhciB0b3AgPSBjbS5jaGFyQ29vcmRzKHJhbmdlLmhlYWQsIFwiZGl2XCIpLnRvcCArIDU7XG4gICAgICAgIHJldHVybiBjbS5jb29yZHNDaGFyKHtsZWZ0OiBjbS5kaXNwbGF5LmxpbmVEaXYub2Zmc2V0V2lkdGggKyAxMDAsIHRvcDogdG9wfSwgXCJkaXZcIik7XG4gICAgICB9LCBzZWxfbW92ZSk7XG4gICAgfSxcbiAgICBnb0xpbmVMZWZ0OiBmdW5jdGlvbihjbSkge1xuICAgICAgY20uZXh0ZW5kU2VsZWN0aW9uc0J5KGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIHZhciB0b3AgPSBjbS5jaGFyQ29vcmRzKHJhbmdlLmhlYWQsIFwiZGl2XCIpLnRvcCArIDU7XG4gICAgICAgIHJldHVybiBjbS5jb29yZHNDaGFyKHtsZWZ0OiAwLCB0b3A6IHRvcH0sIFwiZGl2XCIpO1xuICAgICAgfSwgc2VsX21vdmUpO1xuICAgIH0sXG4gICAgZ29MaW5lVXA6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZVYoLTEsIFwibGluZVwiKTt9LFxuICAgIGdvTGluZURvd246IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZVYoMSwgXCJsaW5lXCIpO30sXG4gICAgZ29QYWdlVXA6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZVYoLTEsIFwicGFnZVwiKTt9LFxuICAgIGdvUGFnZURvd246IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZVYoMSwgXCJwYWdlXCIpO30sXG4gICAgZ29DaGFyTGVmdDogZnVuY3Rpb24oY20pIHtjbS5tb3ZlSCgtMSwgXCJjaGFyXCIpO30sXG4gICAgZ29DaGFyUmlnaHQ6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZUgoMSwgXCJjaGFyXCIpO30sXG4gICAgZ29Db2x1bW5MZWZ0OiBmdW5jdGlvbihjbSkge2NtLm1vdmVIKC0xLCBcImNvbHVtblwiKTt9LFxuICAgIGdvQ29sdW1uUmlnaHQ6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZUgoMSwgXCJjb2x1bW5cIik7fSxcbiAgICBnb1dvcmRMZWZ0OiBmdW5jdGlvbihjbSkge2NtLm1vdmVIKC0xLCBcIndvcmRcIik7fSxcbiAgICBnb0dyb3VwUmlnaHQ6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZUgoMSwgXCJncm91cFwiKTt9LFxuICAgIGdvR3JvdXBMZWZ0OiBmdW5jdGlvbihjbSkge2NtLm1vdmVIKC0xLCBcImdyb3VwXCIpO30sXG4gICAgZ29Xb3JkUmlnaHQ6IGZ1bmN0aW9uKGNtKSB7Y20ubW92ZUgoMSwgXCJ3b3JkXCIpO30sXG4gICAgZGVsQ2hhckJlZm9yZTogZnVuY3Rpb24oY20pIHtjbS5kZWxldGVIKC0xLCBcImNoYXJcIik7fSxcbiAgICBkZWxDaGFyQWZ0ZXI6IGZ1bmN0aW9uKGNtKSB7Y20uZGVsZXRlSCgxLCBcImNoYXJcIik7fSxcbiAgICBkZWxXb3JkQmVmb3JlOiBmdW5jdGlvbihjbSkge2NtLmRlbGV0ZUgoLTEsIFwid29yZFwiKTt9LFxuICAgIGRlbFdvcmRBZnRlcjogZnVuY3Rpb24oY20pIHtjbS5kZWxldGVIKDEsIFwid29yZFwiKTt9LFxuICAgIGRlbEdyb3VwQmVmb3JlOiBmdW5jdGlvbihjbSkge2NtLmRlbGV0ZUgoLTEsIFwiZ3JvdXBcIik7fSxcbiAgICBkZWxHcm91cEFmdGVyOiBmdW5jdGlvbihjbSkge2NtLmRlbGV0ZUgoMSwgXCJncm91cFwiKTt9LFxuICAgIGluZGVudEF1dG86IGZ1bmN0aW9uKGNtKSB7Y20uaW5kZW50U2VsZWN0aW9uKFwic21hcnRcIik7fSxcbiAgICBpbmRlbnRNb3JlOiBmdW5jdGlvbihjbSkge2NtLmluZGVudFNlbGVjdGlvbihcImFkZFwiKTt9LFxuICAgIGluZGVudExlc3M6IGZ1bmN0aW9uKGNtKSB7Y20uaW5kZW50U2VsZWN0aW9uKFwic3VidHJhY3RcIik7fSxcbiAgICBpbnNlcnRUYWI6IGZ1bmN0aW9uKGNtKSB7Y20ucmVwbGFjZVNlbGVjdGlvbihcIlxcdFwiKTt9LFxuICAgIGluc2VydFNvZnRUYWI6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICB2YXIgc3BhY2VzID0gW10sIHJhbmdlcyA9IGNtLmxpc3RTZWxlY3Rpb25zKCksIHRhYlNpemUgPSBjbS5vcHRpb25zLnRhYlNpemU7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcG9zID0gcmFuZ2VzW2ldLmZyb20oKTtcbiAgICAgICAgdmFyIGNvbCA9IGNvdW50Q29sdW1uKGNtLmdldExpbmUocG9zLmxpbmUpLCBwb3MuY2gsIHRhYlNpemUpO1xuICAgICAgICBzcGFjZXMucHVzaChuZXcgQXJyYXkodGFiU2l6ZSAtIGNvbCAlIHRhYlNpemUgKyAxKS5qb2luKFwiIFwiKSk7XG4gICAgICB9XG4gICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhzcGFjZXMpO1xuICAgIH0sXG4gICAgZGVmYXVsdFRhYjogZnVuY3Rpb24oY20pIHtcbiAgICAgIGlmIChjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSBjbS5pbmRlbnRTZWxlY3Rpb24oXCJhZGRcIik7XG4gICAgICBlbHNlIGNtLmV4ZWNDb21tYW5kKFwiaW5zZXJ0VGFiXCIpO1xuICAgIH0sXG4gICAgdHJhbnNwb3NlQ2hhcnM6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICBydW5Jbk9wKGNtLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJhbmdlcyA9IGNtLmxpc3RTZWxlY3Rpb25zKCksIG5ld1NlbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBjdXIgPSByYW5nZXNbaV0uaGVhZCwgbGluZSA9IGdldExpbmUoY20uZG9jLCBjdXIubGluZSkudGV4dDtcbiAgICAgICAgICBpZiAobGluZSkge1xuICAgICAgICAgICAgaWYgKGN1ci5jaCA9PSBsaW5lLmxlbmd0aCkgY3VyID0gbmV3IFBvcyhjdXIubGluZSwgY3VyLmNoIC0gMSk7XG4gICAgICAgICAgICBpZiAoY3VyLmNoID4gMCkge1xuICAgICAgICAgICAgICBjdXIgPSBuZXcgUG9zKGN1ci5saW5lLCBjdXIuY2ggKyAxKTtcbiAgICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGxpbmUuY2hhckF0KGN1ci5jaCAtIDEpICsgbGluZS5jaGFyQXQoY3VyLmNoIC0gMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQb3MoY3VyLmxpbmUsIGN1ci5jaCAtIDIpLCBjdXIsIFwiK3RyYW5zcG9zZVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyLmxpbmUgPiBjbS5kb2MuZmlyc3QpIHtcbiAgICAgICAgICAgICAgdmFyIHByZXYgPSBnZXRMaW5lKGNtLmRvYywgY3VyLmxpbmUgLSAxKS50ZXh0O1xuICAgICAgICAgICAgICBpZiAocHJldilcbiAgICAgICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UobGluZS5jaGFyQXQoMCkgKyBcIlxcblwiICsgcHJldi5jaGFyQXQocHJldi5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUG9zKGN1ci5saW5lIC0gMSwgcHJldi5sZW5ndGggLSAxKSwgUG9zKGN1ci5saW5lLCAxKSwgXCIrdHJhbnNwb3NlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdTZWwucHVzaChuZXcgUmFuZ2UoY3VyLCBjdXIpKTtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRTZWxlY3Rpb25zKG5ld1NlbCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG5ld2xpbmVBbmRJbmRlbnQ6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICBydW5Jbk9wKGNtLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxlbiA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJhbmdlID0gY20ubGlzdFNlbGVjdGlvbnMoKVtpXTtcbiAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoXCJcXG5cIiwgcmFuZ2UuYW5jaG9yLCByYW5nZS5oZWFkLCBcIitpbnB1dFwiKTtcbiAgICAgICAgICBjbS5pbmRlbnRMaW5lKHJhbmdlLmZyb20oKS5saW5lICsgMSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgZW5zdXJlQ3Vyc29yVmlzaWJsZShjbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9nZ2xlT3ZlcndyaXRlOiBmdW5jdGlvbihjbSkge2NtLnRvZ2dsZU92ZXJ3cml0ZSgpO31cbiAgfTtcblxuICAvLyBTVEFOREFSRCBLRVlNQVBTXG5cbiAgdmFyIGtleU1hcCA9IENvZGVNaXJyb3Iua2V5TWFwID0ge307XG4gIGtleU1hcC5iYXNpYyA9IHtcbiAgICBcIkxlZnRcIjogXCJnb0NoYXJMZWZ0XCIsIFwiUmlnaHRcIjogXCJnb0NoYXJSaWdodFwiLCBcIlVwXCI6IFwiZ29MaW5lVXBcIiwgXCJEb3duXCI6IFwiZ29MaW5lRG93blwiLFxuICAgIFwiRW5kXCI6IFwiZ29MaW5lRW5kXCIsIFwiSG9tZVwiOiBcImdvTGluZVN0YXJ0U21hcnRcIiwgXCJQYWdlVXBcIjogXCJnb1BhZ2VVcFwiLCBcIlBhZ2VEb3duXCI6IFwiZ29QYWdlRG93blwiLFxuICAgIFwiRGVsZXRlXCI6IFwiZGVsQ2hhckFmdGVyXCIsIFwiQmFja3NwYWNlXCI6IFwiZGVsQ2hhckJlZm9yZVwiLCBcIlNoaWZ0LUJhY2tzcGFjZVwiOiBcImRlbENoYXJCZWZvcmVcIixcbiAgICBcIlRhYlwiOiBcImRlZmF1bHRUYWJcIiwgXCJTaGlmdC1UYWJcIjogXCJpbmRlbnRBdXRvXCIsXG4gICAgXCJFbnRlclwiOiBcIm5ld2xpbmVBbmRJbmRlbnRcIiwgXCJJbnNlcnRcIjogXCJ0b2dnbGVPdmVyd3JpdGVcIixcbiAgICBcIkVzY1wiOiBcInNpbmdsZVNlbGVjdGlvblwiXG4gIH07XG4gIC8vIE5vdGUgdGhhdCB0aGUgc2F2ZSBhbmQgZmluZC1yZWxhdGVkIGNvbW1hbmRzIGFyZW4ndCBkZWZpbmVkIGJ5XG4gIC8vIGRlZmF1bHQuIFVzZXIgY29kZSBvciBhZGRvbnMgY2FuIGRlZmluZSB0aGVtLiBVbmtub3duIGNvbW1hbmRzXG4gIC8vIGFyZSBzaW1wbHkgaWdub3JlZC5cbiAga2V5TWFwLnBjRGVmYXVsdCA9IHtcbiAgICBcIkN0cmwtQVwiOiBcInNlbGVjdEFsbFwiLCBcIkN0cmwtRFwiOiBcImRlbGV0ZUxpbmVcIiwgXCJDdHJsLVpcIjogXCJ1bmRvXCIsIFwiU2hpZnQtQ3RybC1aXCI6IFwicmVkb1wiLCBcIkN0cmwtWVwiOiBcInJlZG9cIixcbiAgICBcIkN0cmwtSG9tZVwiOiBcImdvRG9jU3RhcnRcIiwgXCJDdHJsLVVwXCI6IFwiZ29Eb2NTdGFydFwiLCBcIkN0cmwtRW5kXCI6IFwiZ29Eb2NFbmRcIiwgXCJDdHJsLURvd25cIjogXCJnb0RvY0VuZFwiLFxuICAgIFwiQ3RybC1MZWZ0XCI6IFwiZ29Hcm91cExlZnRcIiwgXCJDdHJsLVJpZ2h0XCI6IFwiZ29Hcm91cFJpZ2h0XCIsIFwiQWx0LUxlZnRcIjogXCJnb0xpbmVTdGFydFwiLCBcIkFsdC1SaWdodFwiOiBcImdvTGluZUVuZFwiLFxuICAgIFwiQ3RybC1CYWNrc3BhY2VcIjogXCJkZWxHcm91cEJlZm9yZVwiLCBcIkN0cmwtRGVsZXRlXCI6IFwiZGVsR3JvdXBBZnRlclwiLCBcIkN0cmwtU1wiOiBcInNhdmVcIiwgXCJDdHJsLUZcIjogXCJmaW5kXCIsXG4gICAgXCJDdHJsLUdcIjogXCJmaW5kTmV4dFwiLCBcIlNoaWZ0LUN0cmwtR1wiOiBcImZpbmRQcmV2XCIsIFwiU2hpZnQtQ3RybC1GXCI6IFwicmVwbGFjZVwiLCBcIlNoaWZ0LUN0cmwtUlwiOiBcInJlcGxhY2VBbGxcIixcbiAgICBcIkN0cmwtW1wiOiBcImluZGVudExlc3NcIiwgXCJDdHJsLV1cIjogXCJpbmRlbnRNb3JlXCIsXG4gICAgXCJDdHJsLVVcIjogXCJ1bmRvU2VsZWN0aW9uXCIsIFwiU2hpZnQtQ3RybC1VXCI6IFwicmVkb1NlbGVjdGlvblwiLCBcIkFsdC1VXCI6IFwicmVkb1NlbGVjdGlvblwiLFxuICAgIGZhbGx0aHJvdWdoOiBcImJhc2ljXCJcbiAgfTtcbiAga2V5TWFwLm1hY0RlZmF1bHQgPSB7XG4gICAgXCJDbWQtQVwiOiBcInNlbGVjdEFsbFwiLCBcIkNtZC1EXCI6IFwiZGVsZXRlTGluZVwiLCBcIkNtZC1aXCI6IFwidW5kb1wiLCBcIlNoaWZ0LUNtZC1aXCI6IFwicmVkb1wiLCBcIkNtZC1ZXCI6IFwicmVkb1wiLFxuICAgIFwiQ21kLVVwXCI6IFwiZ29Eb2NTdGFydFwiLCBcIkNtZC1FbmRcIjogXCJnb0RvY0VuZFwiLCBcIkNtZC1Eb3duXCI6IFwiZ29Eb2NFbmRcIiwgXCJBbHQtTGVmdFwiOiBcImdvR3JvdXBMZWZ0XCIsXG4gICAgXCJBbHQtUmlnaHRcIjogXCJnb0dyb3VwUmlnaHRcIiwgXCJDbWQtTGVmdFwiOiBcImdvTGluZVN0YXJ0XCIsIFwiQ21kLVJpZ2h0XCI6IFwiZ29MaW5lRW5kXCIsIFwiQWx0LUJhY2tzcGFjZVwiOiBcImRlbEdyb3VwQmVmb3JlXCIsXG4gICAgXCJDdHJsLUFsdC1CYWNrc3BhY2VcIjogXCJkZWxHcm91cEFmdGVyXCIsIFwiQWx0LURlbGV0ZVwiOiBcImRlbEdyb3VwQWZ0ZXJcIiwgXCJDbWQtU1wiOiBcInNhdmVcIiwgXCJDbWQtRlwiOiBcImZpbmRcIixcbiAgICBcIkNtZC1HXCI6IFwiZmluZE5leHRcIiwgXCJTaGlmdC1DbWQtR1wiOiBcImZpbmRQcmV2XCIsIFwiQ21kLUFsdC1GXCI6IFwicmVwbGFjZVwiLCBcIlNoaWZ0LUNtZC1BbHQtRlwiOiBcInJlcGxhY2VBbGxcIixcbiAgICBcIkNtZC1bXCI6IFwiaW5kZW50TGVzc1wiLCBcIkNtZC1dXCI6IFwiaW5kZW50TW9yZVwiLCBcIkNtZC1CYWNrc3BhY2VcIjogXCJkZWxMaW5lTGVmdFwiLFxuICAgIFwiQ21kLVVcIjogXCJ1bmRvU2VsZWN0aW9uXCIsIFwiU2hpZnQtQ21kLVVcIjogXCJyZWRvU2VsZWN0aW9uXCIsXG4gICAgZmFsbHRocm91Z2g6IFtcImJhc2ljXCIsIFwiZW1hY3N5XCJdXG4gIH07XG4gIC8vIFZlcnkgYmFzaWMgcmVhZGxpbmUvZW1hY3Mtc3R5bGUgYmluZGluZ3MsIHdoaWNoIGFyZSBzdGFuZGFyZCBvbiBNYWMuXG4gIGtleU1hcC5lbWFjc3kgPSB7XG4gICAgXCJDdHJsLUZcIjogXCJnb0NoYXJSaWdodFwiLCBcIkN0cmwtQlwiOiBcImdvQ2hhckxlZnRcIiwgXCJDdHJsLVBcIjogXCJnb0xpbmVVcFwiLCBcIkN0cmwtTlwiOiBcImdvTGluZURvd25cIixcbiAgICBcIkFsdC1GXCI6IFwiZ29Xb3JkUmlnaHRcIiwgXCJBbHQtQlwiOiBcImdvV29yZExlZnRcIiwgXCJDdHJsLUFcIjogXCJnb0xpbmVTdGFydFwiLCBcIkN0cmwtRVwiOiBcImdvTGluZUVuZFwiLFxuICAgIFwiQ3RybC1WXCI6IFwiZ29QYWdlRG93blwiLCBcIlNoaWZ0LUN0cmwtVlwiOiBcImdvUGFnZVVwXCIsIFwiQ3RybC1EXCI6IFwiZGVsQ2hhckFmdGVyXCIsIFwiQ3RybC1IXCI6IFwiZGVsQ2hhckJlZm9yZVwiLFxuICAgIFwiQWx0LURcIjogXCJkZWxXb3JkQWZ0ZXJcIiwgXCJBbHQtQmFja3NwYWNlXCI6IFwiZGVsV29yZEJlZm9yZVwiLCBcIkN0cmwtS1wiOiBcImtpbGxMaW5lXCIsIFwiQ3RybC1UXCI6IFwidHJhbnNwb3NlQ2hhcnNcIlxuICB9O1xuICBrZXlNYXBbXCJkZWZhdWx0XCJdID0gbWFjID8ga2V5TWFwLm1hY0RlZmF1bHQgOiBrZXlNYXAucGNEZWZhdWx0O1xuXG4gIC8vIEtFWU1BUCBESVNQQVRDSFxuXG4gIGZ1bmN0aW9uIGdldEtleU1hcCh2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCA9PSBcInN0cmluZ1wiKSByZXR1cm4ga2V5TWFwW3ZhbF07XG4gICAgZWxzZSByZXR1cm4gdmFsO1xuICB9XG5cbiAgLy8gR2l2ZW4gYW4gYXJyYXkgb2Yga2V5bWFwcyBhbmQgYSBrZXkgbmFtZSwgY2FsbCBoYW5kbGUgb24gYW55XG4gIC8vIGJpbmRpbmdzIGZvdW5kLCB1bnRpbCB0aGF0IHJldHVybnMgYSB0cnV0aHkgdmFsdWUsIGF0IHdoaWNoIHBvaW50XG4gIC8vIHdlIGNvbnNpZGVyIHRoZSBrZXkgaGFuZGxlZC4gSW1wbGVtZW50cyB0aGluZ3MgbGlrZSBiaW5kaW5nIGEga2V5XG4gIC8vIHRvIGZhbHNlIHN0b3BwaW5nIGZ1cnRoZXIgaGFuZGxpbmcgYW5kIGtleW1hcCBmYWxsdGhyb3VnaC5cbiAgdmFyIGxvb2t1cEtleSA9IENvZGVNaXJyb3IubG9va3VwS2V5ID0gZnVuY3Rpb24obmFtZSwgbWFwcywgaGFuZGxlKSB7XG4gICAgZnVuY3Rpb24gbG9va3VwKG1hcCkge1xuICAgICAgbWFwID0gZ2V0S2V5TWFwKG1hcCk7XG4gICAgICB2YXIgZm91bmQgPSBtYXBbbmFtZV07XG4gICAgICBpZiAoZm91bmQgPT09IGZhbHNlKSByZXR1cm4gXCJzdG9wXCI7XG4gICAgICBpZiAoZm91bmQgIT0gbnVsbCAmJiBoYW5kbGUoZm91bmQpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChtYXAubm9mYWxsdGhyb3VnaCkgcmV0dXJuIFwic3RvcFwiO1xuXG4gICAgICB2YXIgZmFsbHRocm91Z2ggPSBtYXAuZmFsbHRocm91Z2g7XG4gICAgICBpZiAoZmFsbHRocm91Z2ggPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmYWxsdGhyb3VnaCkgIT0gXCJbb2JqZWN0IEFycmF5XVwiKVxuICAgICAgICByZXR1cm4gbG9va3VwKGZhbGx0aHJvdWdoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmFsbHRocm91Z2gubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGRvbmUgPSBsb29rdXAoZmFsbHRocm91Z2hbaV0pO1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuIGRvbmU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXBzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgZG9uZSA9IGxvb2t1cChtYXBzW2ldKTtcbiAgICAgIGlmIChkb25lKSByZXR1cm4gZG9uZSAhPSBcInN0b3BcIjtcbiAgICB9XG4gIH07XG5cbiAgLy8gTW9kaWZpZXIga2V5IHByZXNzZXMgZG9uJ3QgY291bnQgYXMgJ3JlYWwnIGtleSBwcmVzc2VzIGZvciB0aGVcbiAgLy8gcHVycG9zZSBvZiBrZXltYXAgZmFsbHRocm91Z2guXG4gIHZhciBpc01vZGlmaWVyS2V5ID0gQ29kZU1pcnJvci5pc01vZGlmaWVyS2V5ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGtleU5hbWVzW2V2ZW50LmtleUNvZGVdO1xuICAgIHJldHVybiBuYW1lID09IFwiQ3RybFwiIHx8IG5hbWUgPT0gXCJBbHRcIiB8fCBuYW1lID09IFwiU2hpZnRcIiB8fCBuYW1lID09IFwiTW9kXCI7XG4gIH07XG5cbiAgLy8gTG9vayB1cCB0aGUgbmFtZSBvZiBhIGtleSBhcyBpbmRpY2F0ZWQgYnkgYW4gZXZlbnQgb2JqZWN0LlxuICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZSA9IGZ1bmN0aW9uKGV2ZW50LCBub1NoaWZ0KSB7XG4gICAgaWYgKHByZXN0byAmJiBldmVudC5rZXlDb2RlID09IDM0ICYmIGV2ZW50W1wiY2hhclwiXSkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBuYW1lID0ga2V5TmFtZXNbZXZlbnQua2V5Q29kZV07XG4gICAgaWYgKG5hbWUgPT0gbnVsbCB8fCBldmVudC5hbHRHcmFwaEtleSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChldmVudC5hbHRLZXkpIG5hbWUgPSBcIkFsdC1cIiArIG5hbWU7XG4gICAgaWYgKGZsaXBDdHJsQ21kID8gZXZlbnQubWV0YUtleSA6IGV2ZW50LmN0cmxLZXkpIG5hbWUgPSBcIkN0cmwtXCIgKyBuYW1lO1xuICAgIGlmIChmbGlwQ3RybENtZCA/IGV2ZW50LmN0cmxLZXkgOiBldmVudC5tZXRhS2V5KSBuYW1lID0gXCJDbWQtXCIgKyBuYW1lO1xuICAgIGlmICghbm9TaGlmdCAmJiBldmVudC5zaGlmdEtleSkgbmFtZSA9IFwiU2hpZnQtXCIgKyBuYW1lO1xuICAgIHJldHVybiBuYW1lO1xuICB9O1xuXG4gIC8vIEZST01URVhUQVJFQVxuXG4gIENvZGVNaXJyb3IuZnJvbVRleHRBcmVhID0gZnVuY3Rpb24odGV4dGFyZWEsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLnZhbHVlID0gdGV4dGFyZWEudmFsdWU7XG4gICAgaWYgKCFvcHRpb25zLnRhYmluZGV4ICYmIHRleHRhcmVhLnRhYmluZGV4KVxuICAgICAgb3B0aW9ucy50YWJpbmRleCA9IHRleHRhcmVhLnRhYmluZGV4O1xuICAgIGlmICghb3B0aW9ucy5wbGFjZWhvbGRlciAmJiB0ZXh0YXJlYS5wbGFjZWhvbGRlcilcbiAgICAgIG9wdGlvbnMucGxhY2Vob2xkZXIgPSB0ZXh0YXJlYS5wbGFjZWhvbGRlcjtcbiAgICAvLyBTZXQgYXV0b2ZvY3VzIHRvIHRydWUgaWYgdGhpcyB0ZXh0YXJlYSBpcyBmb2N1c2VkLCBvciBpZiBpdCBoYXNcbiAgICAvLyBhdXRvZm9jdXMgYW5kIG5vIG90aGVyIGVsZW1lbnQgaXMgZm9jdXNlZC5cbiAgICBpZiAob3B0aW9ucy5hdXRvZm9jdXMgPT0gbnVsbCkge1xuICAgICAgdmFyIGhhc0ZvY3VzID0gYWN0aXZlRWx0KCk7XG4gICAgICBvcHRpb25zLmF1dG9mb2N1cyA9IGhhc0ZvY3VzID09IHRleHRhcmVhIHx8XG4gICAgICAgIHRleHRhcmVhLmdldEF0dHJpYnV0ZShcImF1dG9mb2N1c1wiKSAhPSBudWxsICYmIGhhc0ZvY3VzID09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZSgpIHt0ZXh0YXJlYS52YWx1ZSA9IGNtLmdldFZhbHVlKCk7fVxuICAgIGlmICh0ZXh0YXJlYS5mb3JtKSB7XG4gICAgICBvbih0ZXh0YXJlYS5mb3JtLCBcInN1Ym1pdFwiLCBzYXZlKTtcbiAgICAgIC8vIERlcGxvcmFibGUgaGFjayB0byBtYWtlIHRoZSBzdWJtaXQgbWV0aG9kIGRvIHRoZSByaWdodCB0aGluZy5cbiAgICAgIGlmICghb3B0aW9ucy5sZWF2ZVN1Ym1pdE1ldGhvZEFsb25lKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGV4dGFyZWEuZm9ybSwgcmVhbFN1Ym1pdCA9IGZvcm0uc3VibWl0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciB3cmFwcGVkU3VibWl0ID0gZm9ybS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNhdmUoKTtcbiAgICAgICAgICAgIGZvcm0uc3VibWl0ID0gcmVhbFN1Ym1pdDtcbiAgICAgICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICBmb3JtLnN1Ym1pdCA9IHdyYXBwZWRTdWJtaXQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgfVxuICAgIH1cblxuICAgIHRleHRhcmVhLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB2YXIgY20gPSBDb2RlTWlycm9yKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHRleHRhcmVhLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHRleHRhcmVhLm5leHRTaWJsaW5nKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgICBjbS5zYXZlID0gc2F2ZTtcbiAgICBjbS5nZXRUZXh0QXJlYSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGV4dGFyZWE7IH07XG4gICAgY20udG9UZXh0QXJlYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2F2ZSgpO1xuICAgICAgdGV4dGFyZWEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbS5nZXRXcmFwcGVyRWxlbWVudCgpKTtcbiAgICAgIHRleHRhcmVhLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgaWYgKHRleHRhcmVhLmZvcm0pIHtcbiAgICAgICAgb2ZmKHRleHRhcmVhLmZvcm0sIFwic3VibWl0XCIsIHNhdmUpO1xuICAgICAgICBpZiAodHlwZW9mIHRleHRhcmVhLmZvcm0uc3VibWl0ID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICB0ZXh0YXJlYS5mb3JtLnN1Ym1pdCA9IHJlYWxTdWJtaXQ7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gY207XG4gIH07XG5cbiAgLy8gU1RSSU5HIFNUUkVBTVxuXG4gIC8vIEZlZCB0byB0aGUgbW9kZSBwYXJzZXJzLCBwcm92aWRlcyBoZWxwZXIgZnVuY3Rpb25zIHRvIG1ha2VcbiAgLy8gcGFyc2VycyBtb3JlIHN1Y2NpbmN0LlxuXG4gIHZhciBTdHJpbmdTdHJlYW0gPSBDb2RlTWlycm9yLlN0cmluZ1N0cmVhbSA9IGZ1bmN0aW9uKHN0cmluZywgdGFiU2l6ZSkge1xuICAgIHRoaXMucG9zID0gdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy50YWJTaXplID0gdGFiU2l6ZSB8fCA4O1xuICAgIHRoaXMubGFzdENvbHVtblBvcyA9IHRoaXMubGFzdENvbHVtblZhbHVlID0gMDtcbiAgICB0aGlzLmxpbmVTdGFydCA9IDA7XG4gIH07XG5cbiAgU3RyaW5nU3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgICBlb2w6IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLnBvcyA+PSB0aGlzLnN0cmluZy5sZW5ndGg7fSxcbiAgICBzb2w6IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLnBvcyA9PSB0aGlzLmxpbmVTdGFydDt9LFxuICAgIHBlZWs6IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLnN0cmluZy5jaGFyQXQodGhpcy5wb3MpIHx8IHVuZGVmaW5lZDt9LFxuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMucG9zIDwgdGhpcy5zdHJpbmcubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmcuY2hhckF0KHRoaXMucG9zKyspO1xuICAgIH0sXG4gICAgZWF0OiBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgdmFyIGNoID0gdGhpcy5zdHJpbmcuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgIGlmICh0eXBlb2YgbWF0Y2ggPT0gXCJzdHJpbmdcIikgdmFyIG9rID0gY2ggPT0gbWF0Y2g7XG4gICAgICBlbHNlIHZhciBvayA9IGNoICYmIChtYXRjaC50ZXN0ID8gbWF0Y2gudGVzdChjaCkgOiBtYXRjaChjaCkpO1xuICAgICAgaWYgKG9rKSB7Kyt0aGlzLnBvczsgcmV0dXJuIGNoO31cbiAgICB9LFxuICAgIGVhdFdoaWxlOiBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5wb3M7XG4gICAgICB3aGlsZSAodGhpcy5lYXQobWF0Y2gpKXt9XG4gICAgICByZXR1cm4gdGhpcy5wb3MgPiBzdGFydDtcbiAgICB9LFxuICAgIGVhdFNwYWNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzdGFydCA9IHRoaXMucG9zO1xuICAgICAgd2hpbGUgKC9bXFxzXFx1MDBhMF0vLnRlc3QodGhpcy5zdHJpbmcuY2hhckF0KHRoaXMucG9zKSkpICsrdGhpcy5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5wb3MgPiBzdGFydDtcbiAgICB9LFxuICAgIHNraXBUb0VuZDogZnVuY3Rpb24oKSB7dGhpcy5wb3MgPSB0aGlzLnN0cmluZy5sZW5ndGg7fSxcbiAgICBza2lwVG86IGZ1bmN0aW9uKGNoKSB7XG4gICAgICB2YXIgZm91bmQgPSB0aGlzLnN0cmluZy5pbmRleE9mKGNoLCB0aGlzLnBvcyk7XG4gICAgICBpZiAoZm91bmQgPiAtMSkge3RoaXMucG9zID0gZm91bmQ7IHJldHVybiB0cnVlO31cbiAgICB9LFxuICAgIGJhY2tVcDogZnVuY3Rpb24obikge3RoaXMucG9zIC09IG47fSxcbiAgICBjb2x1bW46IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMubGFzdENvbHVtblBvcyA8IHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29sdW1uVmFsdWUgPSBjb3VudENvbHVtbih0aGlzLnN0cmluZywgdGhpcy5zdGFydCwgdGhpcy50YWJTaXplLCB0aGlzLmxhc3RDb2x1bW5Qb3MsIHRoaXMubGFzdENvbHVtblZhbHVlKTtcbiAgICAgICAgdGhpcy5sYXN0Q29sdW1uUG9zID0gdGhpcy5zdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmxhc3RDb2x1bW5WYWx1ZSAtICh0aGlzLmxpbmVTdGFydCA/IGNvdW50Q29sdW1uKHRoaXMuc3RyaW5nLCB0aGlzLmxpbmVTdGFydCwgdGhpcy50YWJTaXplKSA6IDApO1xuICAgIH0sXG4gICAgaW5kZW50YXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvdW50Q29sdW1uKHRoaXMuc3RyaW5nLCBudWxsLCB0aGlzLnRhYlNpemUpIC1cbiAgICAgICAgKHRoaXMubGluZVN0YXJ0ID8gY291bnRDb2x1bW4odGhpcy5zdHJpbmcsIHRoaXMubGluZVN0YXJ0LCB0aGlzLnRhYlNpemUpIDogMCk7XG4gICAgfSxcbiAgICBtYXRjaDogZnVuY3Rpb24ocGF0dGVybiwgY29uc3VtZSwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgY2FzZWQgPSBmdW5jdGlvbihzdHIpIHtyZXR1cm4gY2FzZUluc2Vuc2l0aXZlID8gc3RyLnRvTG93ZXJDYXNlKCkgOiBzdHI7fTtcbiAgICAgICAgdmFyIHN1YnN0ciA9IHRoaXMuc3RyaW5nLnN1YnN0cih0aGlzLnBvcywgcGF0dGVybi5sZW5ndGgpO1xuICAgICAgICBpZiAoY2FzZWQoc3Vic3RyKSA9PSBjYXNlZChwYXR0ZXJuKSkge1xuICAgICAgICAgIGlmIChjb25zdW1lICE9PSBmYWxzZSkgdGhpcy5wb3MgKz0gcGF0dGVybi5sZW5ndGg7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHRoaXMuc3RyaW5nLnNsaWNlKHRoaXMucG9zKS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmluZGV4ID4gMCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmIChtYXRjaCAmJiBjb25zdW1lICE9PSBmYWxzZSkgdGhpcy5wb3MgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG4gICAgfSxcbiAgICBjdXJyZW50OiBmdW5jdGlvbigpe3JldHVybiB0aGlzLnN0cmluZy5zbGljZSh0aGlzLnN0YXJ0LCB0aGlzLnBvcyk7fSxcbiAgICBoaWRlRmlyc3RDaGFyczogZnVuY3Rpb24obiwgaW5uZXIpIHtcbiAgICAgIHRoaXMubGluZVN0YXJ0ICs9IG47XG4gICAgICB0cnkgeyByZXR1cm4gaW5uZXIoKTsgfVxuICAgICAgZmluYWxseSB7IHRoaXMubGluZVN0YXJ0IC09IG47IH1cbiAgICB9XG4gIH07XG5cbiAgLy8gVEVYVE1BUktFUlNcblxuICAvLyBDcmVhdGVkIHdpdGggbWFya1RleHQgYW5kIHNldEJvb2ttYXJrIG1ldGhvZHMuIEEgVGV4dE1hcmtlciBpcyBhXG4gIC8vIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGNsZWFyIG9yIGZpbmQgYSBtYXJrZWQgcG9zaXRpb24gaW4gdGhlXG4gIC8vIGRvY3VtZW50LiBMaW5lIG9iamVjdHMgaG9sZCBhcnJheXMgKG1hcmtlZFNwYW5zKSBjb250YWluaW5nXG4gIC8vIHtmcm9tLCB0bywgbWFya2VyfSBvYmplY3QgcG9pbnRpbmcgdG8gc3VjaCBtYXJrZXIgb2JqZWN0cywgYW5kXG4gIC8vIGluZGljYXRpbmcgdGhhdCBzdWNoIGEgbWFya2VyIGlzIHByZXNlbnQgb24gdGhhdCBsaW5lLiBNdWx0aXBsZVxuICAvLyBsaW5lcyBtYXkgcG9pbnQgdG8gdGhlIHNhbWUgbWFya2VyIHdoZW4gaXQgc3BhbnMgYWNyb3NzIGxpbmVzLlxuICAvLyBUaGUgc3BhbnMgd2lsbCBoYXZlIG51bGwgZm9yIHRoZWlyIGZyb20vdG8gcHJvcGVydGllcyB3aGVuIHRoZVxuICAvLyBtYXJrZXIgY29udGludWVzIGJleW9uZCB0aGUgc3RhcnQvZW5kIG9mIHRoZSBsaW5lLiBNYXJrZXJzIGhhdmVcbiAgLy8gbGlua3MgYmFjayB0byB0aGUgbGluZXMgdGhleSBjdXJyZW50bHkgdG91Y2guXG5cbiAgdmFyIFRleHRNYXJrZXIgPSBDb2RlTWlycm9yLlRleHRNYXJrZXIgPSBmdW5jdGlvbihkb2MsIHR5cGUpIHtcbiAgICB0aGlzLmxpbmVzID0gW107XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmRvYyA9IGRvYztcbiAgfTtcbiAgZXZlbnRNaXhpbihUZXh0TWFya2VyKTtcblxuICAvLyBDbGVhciB0aGUgbWFya2VyLlxuICBUZXh0TWFya2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmV4cGxpY2l0bHlDbGVhcmVkKSByZXR1cm47XG4gICAgdmFyIGNtID0gdGhpcy5kb2MuY20sIHdpdGhPcCA9IGNtICYmICFjbS5jdXJPcDtcbiAgICBpZiAod2l0aE9wKSBzdGFydE9wZXJhdGlvbihjbSk7XG4gICAgaWYgKGhhc0hhbmRsZXIodGhpcywgXCJjbGVhclwiKSkge1xuICAgICAgdmFyIGZvdW5kID0gdGhpcy5maW5kKCk7XG4gICAgICBpZiAoZm91bmQpIHNpZ25hbExhdGVyKHRoaXMsIFwiY2xlYXJcIiwgZm91bmQuZnJvbSwgZm91bmQudG8pO1xuICAgIH1cbiAgICB2YXIgbWluID0gbnVsbCwgbWF4ID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgIHZhciBzcGFuID0gZ2V0TWFya2VkU3BhbkZvcihsaW5lLm1hcmtlZFNwYW5zLCB0aGlzKTtcbiAgICAgIGlmIChjbSAmJiAhdGhpcy5jb2xsYXBzZWQpIHJlZ0xpbmVDaGFuZ2UoY20sIGxpbmVObyhsaW5lKSwgXCJ0ZXh0XCIpO1xuICAgICAgZWxzZSBpZiAoY20pIHtcbiAgICAgICAgaWYgKHNwYW4udG8gIT0gbnVsbCkgbWF4ID0gbGluZU5vKGxpbmUpO1xuICAgICAgICBpZiAoc3Bhbi5mcm9tICE9IG51bGwpIG1pbiA9IGxpbmVObyhsaW5lKTtcbiAgICAgIH1cbiAgICAgIGxpbmUubWFya2VkU3BhbnMgPSByZW1vdmVNYXJrZWRTcGFuKGxpbmUubWFya2VkU3BhbnMsIHNwYW4pO1xuICAgICAgaWYgKHNwYW4uZnJvbSA9PSBudWxsICYmIHRoaXMuY29sbGFwc2VkICYmICFsaW5lSXNIaWRkZW4odGhpcy5kb2MsIGxpbmUpICYmIGNtKVxuICAgICAgICB1cGRhdGVMaW5lSGVpZ2h0KGxpbmUsIHRleHRIZWlnaHQoY20uZGlzcGxheSkpO1xuICAgIH1cbiAgICBpZiAoY20gJiYgdGhpcy5jb2xsYXBzZWQgJiYgIWNtLm9wdGlvbnMubGluZVdyYXBwaW5nKSBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB2aXN1YWwgPSB2aXN1YWxMaW5lKHRoaXMubGluZXNbaV0pLCBsZW4gPSBsaW5lTGVuZ3RoKHZpc3VhbCk7XG4gICAgICBpZiAobGVuID4gY20uZGlzcGxheS5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICAgIGNtLmRpc3BsYXkubWF4TGluZSA9IHZpc3VhbDtcbiAgICAgICAgY20uZGlzcGxheS5tYXhMaW5lTGVuZ3RoID0gbGVuO1xuICAgICAgICBjbS5kaXNwbGF5Lm1heExpbmVDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWluICE9IG51bGwgJiYgY20gJiYgdGhpcy5jb2xsYXBzZWQpIHJlZ0NoYW5nZShjbSwgbWluLCBtYXggKyAxKTtcbiAgICB0aGlzLmxpbmVzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5leHBsaWNpdGx5Q2xlYXJlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuYXRvbWljICYmIHRoaXMuZG9jLmNhbnRFZGl0KSB7XG4gICAgICB0aGlzLmRvYy5jYW50RWRpdCA9IGZhbHNlO1xuICAgICAgaWYgKGNtKSByZUNoZWNrU2VsZWN0aW9uKGNtLmRvYyk7XG4gICAgfVxuICAgIGlmIChjbSkgc2lnbmFsTGF0ZXIoY20sIFwibWFya2VyQ2xlYXJlZFwiLCBjbSwgdGhpcyk7XG4gICAgaWYgKHdpdGhPcCkgZW5kT3BlcmF0aW9uKGNtKTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmNsZWFyKCk7XG4gIH07XG5cbiAgLy8gRmluZCB0aGUgcG9zaXRpb24gb2YgdGhlIG1hcmtlciBpbiB0aGUgZG9jdW1lbnQuIFJldHVybnMgYSB7ZnJvbSxcbiAgLy8gdG99IG9iamVjdCBieSBkZWZhdWx0LiBTaWRlIGNhbiBiZSBwYXNzZWQgdG8gZ2V0IGEgc3BlY2lmaWMgc2lkZVxuICAvLyAtLSAwIChib3RoKSwgLTEgKGxlZnQpLCBvciAxIChyaWdodCkuIFdoZW4gbGluZU9iaiBpcyB0cnVlLCB0aGVcbiAgLy8gUG9zIG9iamVjdHMgcmV0dXJuZWQgY29udGFpbiBhIGxpbmUgb2JqZWN0LCByYXRoZXIgdGhhbiBhIGxpbmVcbiAgLy8gbnVtYmVyICh1c2VkIHRvIHByZXZlbnQgbG9va2luZyB1cCB0aGUgc2FtZSBsaW5lIHR3aWNlKS5cbiAgVGV4dE1hcmtlci5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKHNpZGUsIGxpbmVPYmopIHtcbiAgICBpZiAoc2lkZSA9PSBudWxsICYmIHRoaXMudHlwZSA9PSBcImJvb2ttYXJrXCIpIHNpZGUgPSAxO1xuICAgIHZhciBmcm9tLCB0bztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgIHZhciBzcGFuID0gZ2V0TWFya2VkU3BhbkZvcihsaW5lLm1hcmtlZFNwYW5zLCB0aGlzKTtcbiAgICAgIGlmIChzcGFuLmZyb20gIT0gbnVsbCkge1xuICAgICAgICBmcm9tID0gUG9zKGxpbmVPYmogPyBsaW5lIDogbGluZU5vKGxpbmUpLCBzcGFuLmZyb20pO1xuICAgICAgICBpZiAoc2lkZSA9PSAtMSkgcmV0dXJuIGZyb207XG4gICAgICB9XG4gICAgICBpZiAoc3Bhbi50byAhPSBudWxsKSB7XG4gICAgICAgIHRvID0gUG9zKGxpbmVPYmogPyBsaW5lIDogbGluZU5vKGxpbmUpLCBzcGFuLnRvKTtcbiAgICAgICAgaWYgKHNpZGUgPT0gMSkgcmV0dXJuIHRvO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnJvbSAmJiB7ZnJvbTogZnJvbSwgdG86IHRvfTtcbiAgfTtcblxuICAvLyBTaWduYWxzIHRoYXQgdGhlIG1hcmtlcidzIHdpZGdldCBjaGFuZ2VkLCBhbmQgc3Vycm91bmRpbmcgbGF5b3V0XG4gIC8vIHNob3VsZCBiZSByZWNvbXB1dGVkLlxuICBUZXh0TWFya2VyLnByb3RvdHlwZS5jaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBvcyA9IHRoaXMuZmluZCgtMSwgdHJ1ZSksIHdpZGdldCA9IHRoaXMsIGNtID0gdGhpcy5kb2MuY207XG4gICAgaWYgKCFwb3MgfHwgIWNtKSByZXR1cm47XG4gICAgcnVuSW5PcChjbSwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGluZSA9IHBvcy5saW5lLCBsaW5lTiA9IGxpbmVObyhwb3MubGluZSk7XG4gICAgICB2YXIgdmlldyA9IGZpbmRWaWV3Rm9yTGluZShjbSwgbGluZU4pO1xuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgY2xlYXJMaW5lTWVhc3VyZW1lbnRDYWNoZUZvcih2aWV3KTtcbiAgICAgICAgY20uY3VyT3Auc2VsZWN0aW9uQ2hhbmdlZCA9IGNtLmN1ck9wLmZvcmNlVXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNtLmN1ck9wLnVwZGF0ZU1heExpbmUgPSB0cnVlO1xuICAgICAgaWYgKCFsaW5lSXNIaWRkZW4od2lkZ2V0LmRvYywgbGluZSkgJiYgd2lkZ2V0LmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgIHZhciBvbGRIZWlnaHQgPSB3aWRnZXQuaGVpZ2h0O1xuICAgICAgICB3aWRnZXQuaGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgdmFyIGRIZWlnaHQgPSB3aWRnZXRIZWlnaHQod2lkZ2V0KSAtIG9sZEhlaWdodDtcbiAgICAgICAgaWYgKGRIZWlnaHQpXG4gICAgICAgICAgdXBkYXRlTGluZUhlaWdodChsaW5lLCBsaW5lLmhlaWdodCArIGRIZWlnaHQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFRleHRNYXJrZXIucHJvdG90eXBlLmF0dGFjaExpbmUgPSBmdW5jdGlvbihsaW5lKSB7XG4gICAgaWYgKCF0aGlzLmxpbmVzLmxlbmd0aCAmJiB0aGlzLmRvYy5jbSkge1xuICAgICAgdmFyIG9wID0gdGhpcy5kb2MuY20uY3VyT3A7XG4gICAgICBpZiAoIW9wLm1heWJlSGlkZGVuTWFya2VycyB8fCBpbmRleE9mKG9wLm1heWJlSGlkZGVuTWFya2VycywgdGhpcykgPT0gLTEpXG4gICAgICAgIChvcC5tYXliZVVuaGlkZGVuTWFya2VycyB8fCAob3AubWF5YmVVbmhpZGRlbk1hcmtlcnMgPSBbXSkpLnB1c2godGhpcyk7XG4gICAgfVxuICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcbiAgfTtcbiAgVGV4dE1hcmtlci5wcm90b3R5cGUuZGV0YWNoTGluZSA9IGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVzLnNwbGljZShpbmRleE9mKHRoaXMubGluZXMsIGxpbmUpLCAxKTtcbiAgICBpZiAoIXRoaXMubGluZXMubGVuZ3RoICYmIHRoaXMuZG9jLmNtKSB7XG4gICAgICB2YXIgb3AgPSB0aGlzLmRvYy5jbS5jdXJPcDtcbiAgICAgIChvcC5tYXliZUhpZGRlbk1hcmtlcnMgfHwgKG9wLm1heWJlSGlkZGVuTWFya2VycyA9IFtdKSkucHVzaCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ29sbGFwc2VkIG1hcmtlcnMgaGF2ZSB1bmlxdWUgaWRzLCBpbiBvcmRlciB0byBiZSBhYmxlIHRvIG9yZGVyXG4gIC8vIHRoZW0sIHdoaWNoIGlzIG5lZWRlZCBmb3IgdW5pcXVlbHkgZGV0ZXJtaW5pbmcgYW4gb3V0ZXIgbWFya2VyXG4gIC8vIHdoZW4gdGhleSBvdmVybGFwICh0aGV5IG1heSBuZXN0LCBidXQgbm90IHBhcnRpYWxseSBvdmVybGFwKS5cbiAgdmFyIG5leHRNYXJrZXJJZCA9IDA7XG5cbiAgLy8gQ3JlYXRlIGEgbWFya2VyLCB3aXJlIGl0IHVwIHRvIHRoZSByaWdodCBsaW5lcywgYW5kXG4gIGZ1bmN0aW9uIG1hcmtUZXh0KGRvYywgZnJvbSwgdG8sIG9wdGlvbnMsIHR5cGUpIHtcbiAgICAvLyBTaGFyZWQgbWFya2VycyAoYWNyb3NzIGxpbmtlZCBkb2N1bWVudHMpIGFyZSBoYW5kbGVkIHNlcGFyYXRlbHlcbiAgICAvLyAobWFya1RleHRTaGFyZWQgd2lsbCBjYWxsIG91dCB0byB0aGlzIGFnYWluLCBvbmNlIHBlclxuICAgIC8vIGRvY3VtZW50KS5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnNoYXJlZCkgcmV0dXJuIG1hcmtUZXh0U2hhcmVkKGRvYywgZnJvbSwgdG8sIG9wdGlvbnMsIHR5cGUpO1xuICAgIC8vIEVuc3VyZSB3ZSBhcmUgaW4gYW4gb3BlcmF0aW9uLlxuICAgIGlmIChkb2MuY20gJiYgIWRvYy5jbS5jdXJPcCkgcmV0dXJuIG9wZXJhdGlvbihkb2MuY20sIG1hcmtUZXh0KShkb2MsIGZyb20sIHRvLCBvcHRpb25zLCB0eXBlKTtcblxuICAgIHZhciBtYXJrZXIgPSBuZXcgVGV4dE1hcmtlcihkb2MsIHR5cGUpLCBkaWZmID0gY21wKGZyb20sIHRvKTtcbiAgICBpZiAob3B0aW9ucykgY29weU9iaihvcHRpb25zLCBtYXJrZXIsIGZhbHNlKTtcbiAgICAvLyBEb24ndCBjb25uZWN0IGVtcHR5IG1hcmtlcnMgdW5sZXNzIGNsZWFyV2hlbkVtcHR5IGlzIGZhbHNlXG4gICAgaWYgKGRpZmYgPiAwIHx8IGRpZmYgPT0gMCAmJiBtYXJrZXIuY2xlYXJXaGVuRW1wdHkgIT09IGZhbHNlKVxuICAgICAgcmV0dXJuIG1hcmtlcjtcbiAgICBpZiAobWFya2VyLnJlcGxhY2VkV2l0aCkge1xuICAgICAgLy8gU2hvd2luZyB1cCBhcyBhIHdpZGdldCBpbXBsaWVzIGNvbGxhcHNlZCAod2lkZ2V0IHJlcGxhY2VzIHRleHQpXG4gICAgICBtYXJrZXIuY29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgIG1hcmtlci53aWRnZXROb2RlID0gZWx0KFwic3BhblwiLCBbbWFya2VyLnJlcGxhY2VkV2l0aF0sIFwiQ29kZU1pcnJvci13aWRnZXRcIik7XG4gICAgICBpZiAoIW9wdGlvbnMuaGFuZGxlTW91c2VFdmVudHMpIG1hcmtlci53aWRnZXROb2RlLmlnbm9yZUV2ZW50cyA9IHRydWU7XG4gICAgICBpZiAob3B0aW9ucy5pbnNlcnRMZWZ0KSBtYXJrZXIud2lkZ2V0Tm9kZS5pbnNlcnRMZWZ0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG1hcmtlci5jb2xsYXBzZWQpIHtcbiAgICAgIGlmIChjb25mbGljdGluZ0NvbGxhcHNlZFJhbmdlKGRvYywgZnJvbS5saW5lLCBmcm9tLCB0bywgbWFya2VyKSB8fFxuICAgICAgICAgIGZyb20ubGluZSAhPSB0by5saW5lICYmIGNvbmZsaWN0aW5nQ29sbGFwc2VkUmFuZ2UoZG9jLCB0by5saW5lLCBmcm9tLCB0bywgbWFya2VyKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5zZXJ0aW5nIGNvbGxhcHNlZCBtYXJrZXIgcGFydGlhbGx5IG92ZXJsYXBwaW5nIGFuIGV4aXN0aW5nIG9uZVwiKTtcbiAgICAgIHNhd0NvbGxhcHNlZFNwYW5zID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAobWFya2VyLmFkZFRvSGlzdG9yeSlcbiAgICAgIGFkZENoYW5nZVRvSGlzdG9yeShkb2MsIHtmcm9tOiBmcm9tLCB0bzogdG8sIG9yaWdpbjogXCJtYXJrVGV4dFwifSwgZG9jLnNlbCwgTmFOKTtcblxuICAgIHZhciBjdXJMaW5lID0gZnJvbS5saW5lLCBjbSA9IGRvYy5jbSwgdXBkYXRlTWF4TGluZTtcbiAgICBkb2MuaXRlcihjdXJMaW5lLCB0by5saW5lICsgMSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGNtICYmIG1hcmtlci5jb2xsYXBzZWQgJiYgIWNtLm9wdGlvbnMubGluZVdyYXBwaW5nICYmIHZpc3VhbExpbmUobGluZSkgPT0gY20uZGlzcGxheS5tYXhMaW5lKVxuICAgICAgICB1cGRhdGVNYXhMaW5lID0gdHJ1ZTtcbiAgICAgIGlmIChtYXJrZXIuY29sbGFwc2VkICYmIGN1ckxpbmUgIT0gZnJvbS5saW5lKSB1cGRhdGVMaW5lSGVpZ2h0KGxpbmUsIDApO1xuICAgICAgYWRkTWFya2VkU3BhbihsaW5lLCBuZXcgTWFya2VkU3BhbihtYXJrZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckxpbmUgPT0gZnJvbS5saW5lID8gZnJvbS5jaCA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckxpbmUgPT0gdG8ubGluZSA/IHRvLmNoIDogbnVsbCkpO1xuICAgICAgKytjdXJMaW5lO1xuICAgIH0pO1xuICAgIC8vIGxpbmVJc0hpZGRlbiBkZXBlbmRzIG9uIHRoZSBwcmVzZW5jZSBvZiB0aGUgc3BhbnMsIHNvIG5lZWRzIGEgc2Vjb25kIHBhc3NcbiAgICBpZiAobWFya2VyLmNvbGxhcHNlZCkgZG9jLml0ZXIoZnJvbS5saW5lLCB0by5saW5lICsgMSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGxpbmVJc0hpZGRlbihkb2MsIGxpbmUpKSB1cGRhdGVMaW5lSGVpZ2h0KGxpbmUsIDApO1xuICAgIH0pO1xuXG4gICAgaWYgKG1hcmtlci5jbGVhck9uRW50ZXIpIG9uKG1hcmtlciwgXCJiZWZvcmVDdXJzb3JFbnRlclwiLCBmdW5jdGlvbigpIHsgbWFya2VyLmNsZWFyKCk7IH0pO1xuXG4gICAgaWYgKG1hcmtlci5yZWFkT25seSkge1xuICAgICAgc2F3UmVhZE9ubHlTcGFucyA9IHRydWU7XG4gICAgICBpZiAoZG9jLmhpc3RvcnkuZG9uZS5sZW5ndGggfHwgZG9jLmhpc3RvcnkudW5kb25lLmxlbmd0aClcbiAgICAgICAgZG9jLmNsZWFySGlzdG9yeSgpO1xuICAgIH1cbiAgICBpZiAobWFya2VyLmNvbGxhcHNlZCkge1xuICAgICAgbWFya2VyLmlkID0gKytuZXh0TWFya2VySWQ7XG4gICAgICBtYXJrZXIuYXRvbWljID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNtKSB7XG4gICAgICAvLyBTeW5jIGVkaXRvciBzdGF0ZVxuICAgICAgaWYgKHVwZGF0ZU1heExpbmUpIGNtLmN1ck9wLnVwZGF0ZU1heExpbmUgPSB0cnVlO1xuICAgICAgaWYgKG1hcmtlci5jb2xsYXBzZWQpXG4gICAgICAgIHJlZ0NoYW5nZShjbSwgZnJvbS5saW5lLCB0by5saW5lICsgMSk7XG4gICAgICBlbHNlIGlmIChtYXJrZXIuY2xhc3NOYW1lIHx8IG1hcmtlci50aXRsZSB8fCBtYXJrZXIuc3RhcnRTdHlsZSB8fCBtYXJrZXIuZW5kU3R5bGUpXG4gICAgICAgIGZvciAodmFyIGkgPSBmcm9tLmxpbmU7IGkgPD0gdG8ubGluZTsgaSsrKSByZWdMaW5lQ2hhbmdlKGNtLCBpLCBcInRleHRcIik7XG4gICAgICBpZiAobWFya2VyLmF0b21pYykgcmVDaGVja1NlbGVjdGlvbihjbS5kb2MpO1xuICAgICAgc2lnbmFsTGF0ZXIoY20sIFwibWFya2VyQWRkZWRcIiwgY20sIG1hcmtlcik7XG4gICAgfVxuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICAvLyBTSEFSRUQgVEVYVE1BUktFUlNcblxuICAvLyBBIHNoYXJlZCBtYXJrZXIgc3BhbnMgbXVsdGlwbGUgbGlua2VkIGRvY3VtZW50cy4gSXQgaXNcbiAgLy8gaW1wbGVtZW50ZWQgYXMgYSBtZXRhLW1hcmtlci1vYmplY3QgY29udHJvbGxpbmcgbXVsdGlwbGUgbm9ybWFsXG4gIC8vIG1hcmtlcnMuXG4gIHZhciBTaGFyZWRUZXh0TWFya2VyID0gQ29kZU1pcnJvci5TaGFyZWRUZXh0TWFya2VyID0gZnVuY3Rpb24obWFya2VycywgcHJpbWFyeSkge1xuICAgIHRoaXMubWFya2VycyA9IG1hcmtlcnM7XG4gICAgdGhpcy5wcmltYXJ5ID0gcHJpbWFyeTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyArK2kpXG4gICAgICBtYXJrZXJzW2ldLnBhcmVudCA9IHRoaXM7XG4gIH07XG4gIGV2ZW50TWl4aW4oU2hhcmVkVGV4dE1hcmtlcik7XG5cbiAgU2hhcmVkVGV4dE1hcmtlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5leHBsaWNpdGx5Q2xlYXJlZCkgcmV0dXJuO1xuICAgIHRoaXMuZXhwbGljaXRseUNsZWFyZWQgPSB0cnVlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJzLmxlbmd0aDsgKytpKVxuICAgICAgdGhpcy5tYXJrZXJzW2ldLmNsZWFyKCk7XG4gICAgc2lnbmFsTGF0ZXIodGhpcywgXCJjbGVhclwiKTtcbiAgfTtcbiAgU2hhcmVkVGV4dE1hcmtlci5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKHNpZGUsIGxpbmVPYmopIHtcbiAgICByZXR1cm4gdGhpcy5wcmltYXJ5LmZpbmQoc2lkZSwgbGluZU9iaik7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFya1RleHRTaGFyZWQoZG9jLCBmcm9tLCB0bywgb3B0aW9ucywgdHlwZSkge1xuICAgIG9wdGlvbnMgPSBjb3B5T2JqKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMuc2hhcmVkID0gZmFsc2U7XG4gICAgdmFyIG1hcmtlcnMgPSBbbWFya1RleHQoZG9jLCBmcm9tLCB0bywgb3B0aW9ucywgdHlwZSldLCBwcmltYXJ5ID0gbWFya2Vyc1swXTtcbiAgICB2YXIgd2lkZ2V0ID0gb3B0aW9ucy53aWRnZXROb2RlO1xuICAgIGxpbmtlZERvY3MoZG9jLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmICh3aWRnZXQpIG9wdGlvbnMud2lkZ2V0Tm9kZSA9IHdpZGdldC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBtYXJrZXJzLnB1c2gobWFya1RleHQoZG9jLCBjbGlwUG9zKGRvYywgZnJvbSksIGNsaXBQb3MoZG9jLCB0byksIG9wdGlvbnMsIHR5cGUpKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9jLmxpbmtlZC5sZW5ndGg7ICsraSlcbiAgICAgICAgaWYgKGRvYy5saW5rZWRbaV0uaXNQYXJlbnQpIHJldHVybjtcbiAgICAgIHByaW1hcnkgPSBsc3QobWFya2Vycyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBTaGFyZWRUZXh0TWFya2VyKG1hcmtlcnMsIHByaW1hcnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZFNoYXJlZE1hcmtlcnMoZG9jKSB7XG4gICAgcmV0dXJuIGRvYy5maW5kTWFya3MoUG9zKGRvYy5maXJzdCwgMCksIGRvYy5jbGlwUG9zKFBvcyhkb2MubGFzdExpbmUoKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKG0pIHsgcmV0dXJuIG0ucGFyZW50OyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcHlTaGFyZWRNYXJrZXJzKGRvYywgbWFya2Vycykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG1hcmtlciA9IG1hcmtlcnNbaV0sIHBvcyA9IG1hcmtlci5maW5kKCk7XG4gICAgICB2YXIgbUZyb20gPSBkb2MuY2xpcFBvcyhwb3MuZnJvbSksIG1UbyA9IGRvYy5jbGlwUG9zKHBvcy50byk7XG4gICAgICBpZiAoY21wKG1Gcm9tLCBtVG8pKSB7XG4gICAgICAgIHZhciBzdWJNYXJrID0gbWFya1RleHQoZG9jLCBtRnJvbSwgbVRvLCBtYXJrZXIucHJpbWFyeSwgbWFya2VyLnByaW1hcnkudHlwZSk7XG4gICAgICAgIG1hcmtlci5tYXJrZXJzLnB1c2goc3ViTWFyayk7XG4gICAgICAgIHN1Yk1hcmsucGFyZW50ID0gbWFya2VyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRldGFjaFNoYXJlZE1hcmtlcnMobWFya2Vycykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG1hcmtlciA9IG1hcmtlcnNbaV0sIGxpbmtlZCA9IFttYXJrZXIucHJpbWFyeS5kb2NdOztcbiAgICAgIGxpbmtlZERvY3MobWFya2VyLnByaW1hcnkuZG9jLCBmdW5jdGlvbihkKSB7IGxpbmtlZC5wdXNoKGQpOyB9KTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFya2VyLm1hcmtlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIHN1Yk1hcmtlciA9IG1hcmtlci5tYXJrZXJzW2pdO1xuICAgICAgICBpZiAoaW5kZXhPZihsaW5rZWQsIHN1Yk1hcmtlci5kb2MpID09IC0xKSB7XG4gICAgICAgICAgc3ViTWFya2VyLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgbWFya2VyLm1hcmtlcnMuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBURVhUTUFSS0VSIFNQQU5TXG5cbiAgZnVuY3Rpb24gTWFya2VkU3BhbihtYXJrZXIsIGZyb20sIHRvKSB7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXI7XG4gICAgdGhpcy5mcm9tID0gZnJvbTsgdGhpcy50byA9IHRvO1xuICB9XG5cbiAgLy8gU2VhcmNoIGFuIGFycmF5IG9mIHNwYW5zIGZvciBhIHNwYW4gbWF0Y2hpbmcgdGhlIGdpdmVuIG1hcmtlci5cbiAgZnVuY3Rpb24gZ2V0TWFya2VkU3BhbkZvcihzcGFucywgbWFya2VyKSB7XG4gICAgaWYgKHNwYW5zKSBmb3IgKHZhciBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuICAgICAgaWYgKHNwYW4ubWFya2VyID09IG1hcmtlcikgcmV0dXJuIHNwYW47XG4gICAgfVxuICB9XG4gIC8vIFJlbW92ZSBhIHNwYW4gZnJvbSBhbiBhcnJheSwgcmV0dXJuaW5nIHVuZGVmaW5lZCBpZiBubyBzcGFucyBhcmVcbiAgLy8gbGVmdCAod2UgZG9uJ3Qgc3RvcmUgYXJyYXlzIGZvciBsaW5lcyB3aXRob3V0IHNwYW5zKS5cbiAgZnVuY3Rpb24gcmVtb3ZlTWFya2VkU3BhbihzcGFucywgc3Bhbikge1xuICAgIGZvciAodmFyIHIsIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyArK2kpXG4gICAgICBpZiAoc3BhbnNbaV0gIT0gc3BhbikgKHIgfHwgKHIgPSBbXSkpLnB1c2goc3BhbnNbaV0pO1xuICAgIHJldHVybiByO1xuICB9XG4gIC8vIEFkZCBhIHNwYW4gdG8gYSBsaW5lLlxuICBmdW5jdGlvbiBhZGRNYXJrZWRTcGFuKGxpbmUsIHNwYW4pIHtcbiAgICBsaW5lLm1hcmtlZFNwYW5zID0gbGluZS5tYXJrZWRTcGFucyA/IGxpbmUubWFya2VkU3BhbnMuY29uY2F0KFtzcGFuXSkgOiBbc3Bhbl07XG4gICAgc3Bhbi5tYXJrZXIuYXR0YWNoTGluZShsaW5lKTtcbiAgfVxuXG4gIC8vIFVzZWQgZm9yIHRoZSBhbGdvcml0aG0gdGhhdCBhZGp1c3RzIG1hcmtlcnMgZm9yIGEgY2hhbmdlIGluIHRoZVxuICAvLyBkb2N1bWVudC4gVGhlc2UgZnVuY3Rpb25zIGN1dCBhbiBhcnJheSBvZiBzcGFucyBhdCBhIGdpdmVuXG4gIC8vIGNoYXJhY3RlciBwb3NpdGlvbiwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHJlbWFpbmluZyBjaHVua3MgKG9yXG4gIC8vIHVuZGVmaW5lZCBpZiBub3RoaW5nIHJlbWFpbnMpLlxuICBmdW5jdGlvbiBtYXJrZWRTcGFuc0JlZm9yZShvbGQsIHN0YXJ0Q2gsIGlzSW5zZXJ0KSB7XG4gICAgaWYgKG9sZCkgZm9yICh2YXIgaSA9IDAsIG53OyBpIDwgb2xkLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgc3BhbiA9IG9sZFtpXSwgbWFya2VyID0gc3Bhbi5tYXJrZXI7XG4gICAgICB2YXIgc3RhcnRzQmVmb3JlID0gc3Bhbi5mcm9tID09IG51bGwgfHwgKG1hcmtlci5pbmNsdXNpdmVMZWZ0ID8gc3Bhbi5mcm9tIDw9IHN0YXJ0Q2ggOiBzcGFuLmZyb20gPCBzdGFydENoKTtcbiAgICAgIGlmIChzdGFydHNCZWZvcmUgfHwgc3Bhbi5mcm9tID09IHN0YXJ0Q2ggJiYgbWFya2VyLnR5cGUgPT0gXCJib29rbWFya1wiICYmICghaXNJbnNlcnQgfHwgIXNwYW4ubWFya2VyLmluc2VydExlZnQpKSB7XG4gICAgICAgIHZhciBlbmRzQWZ0ZXIgPSBzcGFuLnRvID09IG51bGwgfHwgKG1hcmtlci5pbmNsdXNpdmVSaWdodCA/IHNwYW4udG8gPj0gc3RhcnRDaCA6IHNwYW4udG8gPiBzdGFydENoKTtcbiAgICAgICAgKG53IHx8IChudyA9IFtdKSkucHVzaChuZXcgTWFya2VkU3BhbihtYXJrZXIsIHNwYW4uZnJvbSwgZW5kc0FmdGVyID8gbnVsbCA6IHNwYW4udG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG53O1xuICB9XG4gIGZ1bmN0aW9uIG1hcmtlZFNwYW5zQWZ0ZXIob2xkLCBlbmRDaCwgaXNJbnNlcnQpIHtcbiAgICBpZiAob2xkKSBmb3IgKHZhciBpID0gMCwgbnc7IGkgPCBvbGQubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBzcGFuID0gb2xkW2ldLCBtYXJrZXIgPSBzcGFuLm1hcmtlcjtcbiAgICAgIHZhciBlbmRzQWZ0ZXIgPSBzcGFuLnRvID09IG51bGwgfHwgKG1hcmtlci5pbmNsdXNpdmVSaWdodCA/IHNwYW4udG8gPj0gZW5kQ2ggOiBzcGFuLnRvID4gZW5kQ2gpO1xuICAgICAgaWYgKGVuZHNBZnRlciB8fCBzcGFuLmZyb20gPT0gZW5kQ2ggJiYgbWFya2VyLnR5cGUgPT0gXCJib29rbWFya1wiICYmICghaXNJbnNlcnQgfHwgc3Bhbi5tYXJrZXIuaW5zZXJ0TGVmdCkpIHtcbiAgICAgICAgdmFyIHN0YXJ0c0JlZm9yZSA9IHNwYW4uZnJvbSA9PSBudWxsIHx8IChtYXJrZXIuaW5jbHVzaXZlTGVmdCA/IHNwYW4uZnJvbSA8PSBlbmRDaCA6IHNwYW4uZnJvbSA8IGVuZENoKTtcbiAgICAgICAgKG53IHx8IChudyA9IFtdKSkucHVzaChuZXcgTWFya2VkU3BhbihtYXJrZXIsIHN0YXJ0c0JlZm9yZSA/IG51bGwgOiBzcGFuLmZyb20gLSBlbmRDaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuLnRvID09IG51bGwgPyBudWxsIDogc3Bhbi50byAtIGVuZENoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudztcbiAgfVxuXG4gIC8vIEdpdmVuIGEgY2hhbmdlIG9iamVjdCwgY29tcHV0ZSB0aGUgbmV3IHNldCBvZiBtYXJrZXIgc3BhbnMgdGhhdFxuICAvLyBjb3ZlciB0aGUgbGluZSBpbiB3aGljaCB0aGUgY2hhbmdlIHRvb2sgcGxhY2UuIFJlbW92ZXMgc3BhbnNcbiAgLy8gZW50aXJlbHkgd2l0aGluIHRoZSBjaGFuZ2UsIHJlY29ubmVjdHMgc3BhbnMgYmVsb25naW5nIHRvIHRoZVxuICAvLyBzYW1lIG1hcmtlciB0aGF0IGFwcGVhciBvbiBib3RoIHNpZGVzIG9mIHRoZSBjaGFuZ2UsIGFuZCBjdXRzIG9mZlxuICAvLyBzcGFucyBwYXJ0aWFsbHkgd2l0aGluIHRoZSBjaGFuZ2UuIFJldHVybnMgYW4gYXJyYXkgb2Ygc3BhblxuICAvLyBhcnJheXMgd2l0aCBvbmUgZWxlbWVudCBmb3IgZWFjaCBsaW5lIGluIChhZnRlcikgdGhlIGNoYW5nZS5cbiAgZnVuY3Rpb24gc3RyZXRjaFNwYW5zT3ZlckNoYW5nZShkb2MsIGNoYW5nZSkge1xuICAgIHZhciBvbGRGaXJzdCA9IGlzTGluZShkb2MsIGNoYW5nZS5mcm9tLmxpbmUpICYmIGdldExpbmUoZG9jLCBjaGFuZ2UuZnJvbS5saW5lKS5tYXJrZWRTcGFucztcbiAgICB2YXIgb2xkTGFzdCA9IGlzTGluZShkb2MsIGNoYW5nZS50by5saW5lKSAmJiBnZXRMaW5lKGRvYywgY2hhbmdlLnRvLmxpbmUpLm1hcmtlZFNwYW5zO1xuICAgIGlmICghb2xkRmlyc3QgJiYgIW9sZExhc3QpIHJldHVybiBudWxsO1xuXG4gICAgdmFyIHN0YXJ0Q2ggPSBjaGFuZ2UuZnJvbS5jaCwgZW5kQ2ggPSBjaGFuZ2UudG8uY2gsIGlzSW5zZXJ0ID0gY21wKGNoYW5nZS5mcm9tLCBjaGFuZ2UudG8pID09IDA7XG4gICAgLy8gR2V0IHRoZSBzcGFucyB0aGF0ICdzdGljayBvdXQnIG9uIGJvdGggc2lkZXNcbiAgICB2YXIgZmlyc3QgPSBtYXJrZWRTcGFuc0JlZm9yZShvbGRGaXJzdCwgc3RhcnRDaCwgaXNJbnNlcnQpO1xuICAgIHZhciBsYXN0ID0gbWFya2VkU3BhbnNBZnRlcihvbGRMYXN0LCBlbmRDaCwgaXNJbnNlcnQpO1xuXG4gICAgLy8gTmV4dCwgbWVyZ2UgdGhvc2UgdHdvIGVuZHNcbiAgICB2YXIgc2FtZUxpbmUgPSBjaGFuZ2UudGV4dC5sZW5ndGggPT0gMSwgb2Zmc2V0ID0gbHN0KGNoYW5nZS50ZXh0KS5sZW5ndGggKyAoc2FtZUxpbmUgPyBzdGFydENoIDogMCk7XG4gICAgaWYgKGZpcnN0KSB7XG4gICAgICAvLyBGaXggdXAgLnRvIHByb3BlcnRpZXMgb2YgZmlyc3RcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlyc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHNwYW4gPSBmaXJzdFtpXTtcbiAgICAgICAgaWYgKHNwYW4udG8gPT0gbnVsbCkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGdldE1hcmtlZFNwYW5Gb3IobGFzdCwgc3Bhbi5tYXJrZXIpO1xuICAgICAgICAgIGlmICghZm91bmQpIHNwYW4udG8gPSBzdGFydENoO1xuICAgICAgICAgIGVsc2UgaWYgKHNhbWVMaW5lKSBzcGFuLnRvID0gZm91bmQudG8gPT0gbnVsbCA/IG51bGwgOiBmb3VuZC50byArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobGFzdCkge1xuICAgICAgLy8gRml4IHVwIC5mcm9tIGluIGxhc3QgKG9yIG1vdmUgdGhlbSBpbnRvIGZpcnN0IGluIGNhc2Ugb2Ygc2FtZUxpbmUpXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHNwYW4gPSBsYXN0W2ldO1xuICAgICAgICBpZiAoc3Bhbi50byAhPSBudWxsKSBzcGFuLnRvICs9IG9mZnNldDtcbiAgICAgICAgaWYgKHNwYW4uZnJvbSA9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gZ2V0TWFya2VkU3BhbkZvcihmaXJzdCwgc3Bhbi5tYXJrZXIpO1xuICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgIHNwYW4uZnJvbSA9IG9mZnNldDtcbiAgICAgICAgICAgIGlmIChzYW1lTGluZSkgKGZpcnN0IHx8IChmaXJzdCA9IFtdKSkucHVzaChzcGFuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi5mcm9tICs9IG9mZnNldDtcbiAgICAgICAgICBpZiAoc2FtZUxpbmUpIChmaXJzdCB8fCAoZmlyc3QgPSBbXSkpLnB1c2goc3Bhbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHdlIGRpZG4ndCBjcmVhdGUgYW55IHplcm8tbGVuZ3RoIHNwYW5zXG4gICAgaWYgKGZpcnN0KSBmaXJzdCA9IGNsZWFyRW1wdHlTcGFucyhmaXJzdCk7XG4gICAgaWYgKGxhc3QgJiYgbGFzdCAhPSBmaXJzdCkgbGFzdCA9IGNsZWFyRW1wdHlTcGFucyhsYXN0KTtcblxuICAgIHZhciBuZXdNYXJrZXJzID0gW2ZpcnN0XTtcbiAgICBpZiAoIXNhbWVMaW5lKSB7XG4gICAgICAvLyBGaWxsIGdhcCB3aXRoIHdob2xlLWxpbmUtc3BhbnNcbiAgICAgIHZhciBnYXAgPSBjaGFuZ2UudGV4dC5sZW5ndGggLSAyLCBnYXBNYXJrZXJzO1xuICAgICAgaWYgKGdhcCA+IDAgJiYgZmlyc3QpXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlyc3QubGVuZ3RoOyArK2kpXG4gICAgICAgICAgaWYgKGZpcnN0W2ldLnRvID09IG51bGwpXG4gICAgICAgICAgICAoZ2FwTWFya2VycyB8fCAoZ2FwTWFya2VycyA9IFtdKSkucHVzaChuZXcgTWFya2VkU3BhbihmaXJzdFtpXS5tYXJrZXIsIG51bGwsIG51bGwpKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2FwOyArK2kpXG4gICAgICAgIG5ld01hcmtlcnMucHVzaChnYXBNYXJrZXJzKTtcbiAgICAgIG5ld01hcmtlcnMucHVzaChsYXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld01hcmtlcnM7XG4gIH1cblxuICAvLyBSZW1vdmUgc3BhbnMgdGhhdCBhcmUgZW1wdHkgYW5kIGRvbid0IGhhdmUgYSBjbGVhcldoZW5FbXB0eVxuICAvLyBvcHRpb24gb2YgZmFsc2UuXG4gIGZ1bmN0aW9uIGNsZWFyRW1wdHlTcGFucyhzcGFucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBzcGFuID0gc3BhbnNbaV07XG4gICAgICBpZiAoc3Bhbi5mcm9tICE9IG51bGwgJiYgc3Bhbi5mcm9tID09IHNwYW4udG8gJiYgc3Bhbi5tYXJrZXIuY2xlYXJXaGVuRW1wdHkgIT09IGZhbHNlKVxuICAgICAgICBzcGFucy5zcGxpY2UoaS0tLCAxKTtcbiAgICB9XG4gICAgaWYgKCFzcGFucy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBzcGFucztcbiAgfVxuXG4gIC8vIFVzZWQgZm9yIHVuL3JlLWRvaW5nIGNoYW5nZXMgZnJvbSB0aGUgaGlzdG9yeS4gQ29tYmluZXMgdGhlXG4gIC8vIHJlc3VsdCBvZiBjb21wdXRpbmcgdGhlIGV4aXN0aW5nIHNwYW5zIHdpdGggdGhlIHNldCBvZiBzcGFucyB0aGF0XG4gIC8vIGV4aXN0ZWQgaW4gdGhlIGhpc3RvcnkgKHNvIHRoYXQgZGVsZXRpbmcgYXJvdW5kIGEgc3BhbiBhbmQgdGhlblxuICAvLyB1bmRvaW5nIGJyaW5ncyBiYWNrIHRoZSBzcGFuKS5cbiAgZnVuY3Rpb24gbWVyZ2VPbGRTcGFucyhkb2MsIGNoYW5nZSkge1xuICAgIHZhciBvbGQgPSBnZXRPbGRTcGFucyhkb2MsIGNoYW5nZSk7XG4gICAgdmFyIHN0cmV0Y2hlZCA9IHN0cmV0Y2hTcGFuc092ZXJDaGFuZ2UoZG9jLCBjaGFuZ2UpO1xuICAgIGlmICghb2xkKSByZXR1cm4gc3RyZXRjaGVkO1xuICAgIGlmICghc3RyZXRjaGVkKSByZXR1cm4gb2xkO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGQubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBvbGRDdXIgPSBvbGRbaV0sIHN0cmV0Y2hDdXIgPSBzdHJldGNoZWRbaV07XG4gICAgICBpZiAob2xkQ3VyICYmIHN0cmV0Y2hDdXIpIHtcbiAgICAgICAgc3BhbnM6IGZvciAodmFyIGogPSAwOyBqIDwgc3RyZXRjaEN1ci5sZW5ndGg7ICsraikge1xuICAgICAgICAgIHZhciBzcGFuID0gc3RyZXRjaEN1cltqXTtcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG9sZEN1ci5sZW5ndGg7ICsraylcbiAgICAgICAgICAgIGlmIChvbGRDdXJba10ubWFya2VyID09IHNwYW4ubWFya2VyKSBjb250aW51ZSBzcGFucztcbiAgICAgICAgICBvbGRDdXIucHVzaChzcGFuKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdHJldGNoQ3VyKSB7XG4gICAgICAgIG9sZFtpXSA9IHN0cmV0Y2hDdXI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvbGQ7XG4gIH1cblxuICAvLyBVc2VkIHRvICdjbGlwJyBvdXQgcmVhZE9ubHkgcmFuZ2VzIHdoZW4gbWFraW5nIGEgY2hhbmdlLlxuICBmdW5jdGlvbiByZW1vdmVSZWFkT25seVJhbmdlcyhkb2MsIGZyb20sIHRvKSB7XG4gICAgdmFyIG1hcmtlcnMgPSBudWxsO1xuICAgIGRvYy5pdGVyKGZyb20ubGluZSwgdG8ubGluZSArIDEsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIGlmIChsaW5lLm1hcmtlZFNwYW5zKSBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubWFya2VkU3BhbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIG1hcmsgPSBsaW5lLm1hcmtlZFNwYW5zW2ldLm1hcmtlcjtcbiAgICAgICAgaWYgKG1hcmsucmVhZE9ubHkgJiYgKCFtYXJrZXJzIHx8IGluZGV4T2YobWFya2VycywgbWFyaykgPT0gLTEpKVxuICAgICAgICAgIChtYXJrZXJzIHx8IChtYXJrZXJzID0gW10pKS5wdXNoKG1hcmspO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghbWFya2VycykgcmV0dXJuIG51bGw7XG4gICAgdmFyIHBhcnRzID0gW3tmcm9tOiBmcm9tLCB0bzogdG99XTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBtayA9IG1hcmtlcnNbaV0sIG0gPSBtay5maW5kKDApO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYXJ0cy5sZW5ndGg7ICsraikge1xuICAgICAgICB2YXIgcCA9IHBhcnRzW2pdO1xuICAgICAgICBpZiAoY21wKHAudG8sIG0uZnJvbSkgPCAwIHx8IGNtcChwLmZyb20sIG0udG8pID4gMCkgY29udGludWU7XG4gICAgICAgIHZhciBuZXdQYXJ0cyA9IFtqLCAxXSwgZGZyb20gPSBjbXAocC5mcm9tLCBtLmZyb20pLCBkdG8gPSBjbXAocC50bywgbS50byk7XG4gICAgICAgIGlmIChkZnJvbSA8IDAgfHwgIW1rLmluY2x1c2l2ZUxlZnQgJiYgIWRmcm9tKVxuICAgICAgICAgIG5ld1BhcnRzLnB1c2goe2Zyb206IHAuZnJvbSwgdG86IG0uZnJvbX0pO1xuICAgICAgICBpZiAoZHRvID4gMCB8fCAhbWsuaW5jbHVzaXZlUmlnaHQgJiYgIWR0bylcbiAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHtmcm9tOiBtLnRvLCB0bzogcC50b30pO1xuICAgICAgICBwYXJ0cy5zcGxpY2UuYXBwbHkocGFydHMsIG5ld1BhcnRzKTtcbiAgICAgICAgaiArPSBuZXdQYXJ0cy5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH1cblxuICAvLyBDb25uZWN0IG9yIGRpc2Nvbm5lY3Qgc3BhbnMgZnJvbSBhIGxpbmUuXG4gIGZ1bmN0aW9uIGRldGFjaE1hcmtlZFNwYW5zKGxpbmUpIHtcbiAgICB2YXIgc3BhbnMgPSBsaW5lLm1hcmtlZFNwYW5zO1xuICAgIGlmICghc3BhbnMpIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgKytpKVxuICAgICAgc3BhbnNbaV0ubWFya2VyLmRldGFjaExpbmUobGluZSk7XG4gICAgbGluZS5tYXJrZWRTcGFucyA9IG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gYXR0YWNoTWFya2VkU3BhbnMobGluZSwgc3BhbnMpIHtcbiAgICBpZiAoIXNwYW5zKSByZXR1cm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7ICsraSlcbiAgICAgIHNwYW5zW2ldLm1hcmtlci5hdHRhY2hMaW5lKGxpbmUpO1xuICAgIGxpbmUubWFya2VkU3BhbnMgPSBzcGFucztcbiAgfVxuXG4gIC8vIEhlbHBlcnMgdXNlZCB3aGVuIGNvbXB1dGluZyB3aGljaCBvdmVybGFwcGluZyBjb2xsYXBzZWQgc3BhblxuICAvLyBjb3VudHMgYXMgdGhlIGxhcmdlciBvbmUuXG4gIGZ1bmN0aW9uIGV4dHJhTGVmdChtYXJrZXIpIHsgcmV0dXJuIG1hcmtlci5pbmNsdXNpdmVMZWZ0ID8gLTEgOiAwOyB9XG4gIGZ1bmN0aW9uIGV4dHJhUmlnaHQobWFya2VyKSB7IHJldHVybiBtYXJrZXIuaW5jbHVzaXZlUmlnaHQgPyAxIDogMDsgfVxuXG4gIC8vIFJldHVybnMgYSBudW1iZXIgaW5kaWNhdGluZyB3aGljaCBvZiB0d28gb3ZlcmxhcHBpbmcgY29sbGFwc2VkXG4gIC8vIHNwYW5zIGlzIGxhcmdlciAoYW5kIHRodXMgaW5jbHVkZXMgdGhlIG90aGVyKS4gRmFsbHMgYmFjayB0b1xuICAvLyBjb21wYXJpbmcgaWRzIHdoZW4gdGhlIHNwYW5zIGNvdmVyIGV4YWN0bHkgdGhlIHNhbWUgcmFuZ2UuXG4gIGZ1bmN0aW9uIGNvbXBhcmVDb2xsYXBzZWRNYXJrZXJzKGEsIGIpIHtcbiAgICB2YXIgbGVuRGlmZiA9IGEubGluZXMubGVuZ3RoIC0gYi5saW5lcy5sZW5ndGg7XG4gICAgaWYgKGxlbkRpZmYgIT0gMCkgcmV0dXJuIGxlbkRpZmY7XG4gICAgdmFyIGFQb3MgPSBhLmZpbmQoKSwgYlBvcyA9IGIuZmluZCgpO1xuICAgIHZhciBmcm9tQ21wID0gY21wKGFQb3MuZnJvbSwgYlBvcy5mcm9tKSB8fCBleHRyYUxlZnQoYSkgLSBleHRyYUxlZnQoYik7XG4gICAgaWYgKGZyb21DbXApIHJldHVybiAtZnJvbUNtcDtcbiAgICB2YXIgdG9DbXAgPSBjbXAoYVBvcy50bywgYlBvcy50bykgfHwgZXh0cmFSaWdodChhKSAtIGV4dHJhUmlnaHQoYik7XG4gICAgaWYgKHRvQ21wKSByZXR1cm4gdG9DbXA7XG4gICAgcmV0dXJuIGIuaWQgLSBhLmlkO1xuICB9XG5cbiAgLy8gRmluZCBvdXQgd2hldGhlciBhIGxpbmUgZW5kcyBvciBzdGFydHMgaW4gYSBjb2xsYXBzZWQgc3Bhbi4gSWZcbiAgLy8gc28sIHJldHVybiB0aGUgbWFya2VyIGZvciB0aGF0IHNwYW4uXG4gIGZ1bmN0aW9uIGNvbGxhcHNlZFNwYW5BdFNpZGUobGluZSwgc3RhcnQpIHtcbiAgICB2YXIgc3BzID0gc2F3Q29sbGFwc2VkU3BhbnMgJiYgbGluZS5tYXJrZWRTcGFucywgZm91bmQ7XG4gICAgaWYgKHNwcykgZm9yICh2YXIgc3AsIGkgPSAwOyBpIDwgc3BzLmxlbmd0aDsgKytpKSB7XG4gICAgICBzcCA9IHNwc1tpXTtcbiAgICAgIGlmIChzcC5tYXJrZXIuY29sbGFwc2VkICYmIChzdGFydCA/IHNwLmZyb20gOiBzcC50bykgPT0gbnVsbCAmJlxuICAgICAgICAgICghZm91bmQgfHwgY29tcGFyZUNvbGxhcHNlZE1hcmtlcnMoZm91bmQsIHNwLm1hcmtlcikgPCAwKSlcbiAgICAgICAgZm91bmQgPSBzcC5tYXJrZXI7XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuICBmdW5jdGlvbiBjb2xsYXBzZWRTcGFuQXRTdGFydChsaW5lKSB7IHJldHVybiBjb2xsYXBzZWRTcGFuQXRTaWRlKGxpbmUsIHRydWUpOyB9XG4gIGZ1bmN0aW9uIGNvbGxhcHNlZFNwYW5BdEVuZChsaW5lKSB7IHJldHVybiBjb2xsYXBzZWRTcGFuQXRTaWRlKGxpbmUsIGZhbHNlKTsgfVxuXG4gIC8vIFRlc3Qgd2hldGhlciB0aGVyZSBleGlzdHMgYSBjb2xsYXBzZWQgc3BhbiB0aGF0IHBhcnRpYWxseVxuICAvLyBvdmVybGFwcyAoY292ZXJzIHRoZSBzdGFydCBvciBlbmQsIGJ1dCBub3QgYm90aCkgb2YgYSBuZXcgc3Bhbi5cbiAgLy8gU3VjaCBvdmVybGFwIGlzIG5vdCBhbGxvd2VkLlxuICBmdW5jdGlvbiBjb25mbGljdGluZ0NvbGxhcHNlZFJhbmdlKGRvYywgbGluZU5vLCBmcm9tLCB0bywgbWFya2VyKSB7XG4gICAgdmFyIGxpbmUgPSBnZXRMaW5lKGRvYywgbGluZU5vKTtcbiAgICB2YXIgc3BzID0gc2F3Q29sbGFwc2VkU3BhbnMgJiYgbGluZS5tYXJrZWRTcGFucztcbiAgICBpZiAoc3BzKSBmb3IgKHZhciBpID0gMDsgaSA8IHNwcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHNwID0gc3BzW2ldO1xuICAgICAgaWYgKCFzcC5tYXJrZXIuY29sbGFwc2VkKSBjb250aW51ZTtcbiAgICAgIHZhciBmb3VuZCA9IHNwLm1hcmtlci5maW5kKDApO1xuICAgICAgdmFyIGZyb21DbXAgPSBjbXAoZm91bmQuZnJvbSwgZnJvbSkgfHwgZXh0cmFMZWZ0KHNwLm1hcmtlcikgLSBleHRyYUxlZnQobWFya2VyKTtcbiAgICAgIHZhciB0b0NtcCA9IGNtcChmb3VuZC50bywgdG8pIHx8IGV4dHJhUmlnaHQoc3AubWFya2VyKSAtIGV4dHJhUmlnaHQobWFya2VyKTtcbiAgICAgIGlmIChmcm9tQ21wID49IDAgJiYgdG9DbXAgPD0gMCB8fCBmcm9tQ21wIDw9IDAgJiYgdG9DbXAgPj0gMCkgY29udGludWU7XG4gICAgICBpZiAoZnJvbUNtcCA8PSAwICYmIChjbXAoZm91bmQudG8sIGZyb20pIHx8IGV4dHJhUmlnaHQoc3AubWFya2VyKSAtIGV4dHJhTGVmdChtYXJrZXIpKSA+IDAgfHxcbiAgICAgICAgICBmcm9tQ21wID49IDAgJiYgKGNtcChmb3VuZC5mcm9tLCB0bykgfHwgZXh0cmFMZWZ0KHNwLm1hcmtlcikgLSBleHRyYVJpZ2h0KG1hcmtlcikpIDwgMClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gQSB2aXN1YWwgbGluZSBpcyBhIGxpbmUgYXMgZHJhd24gb24gdGhlIHNjcmVlbi4gRm9sZGluZywgZm9yXG4gIC8vIGV4YW1wbGUsIGNhbiBjYXVzZSBtdWx0aXBsZSBsb2dpY2FsIGxpbmVzIHRvIGFwcGVhciBvbiB0aGUgc2FtZVxuICAvLyB2aXN1YWwgbGluZS4gVGhpcyBmaW5kcyB0aGUgc3RhcnQgb2YgdGhlIHZpc3VhbCBsaW5lIHRoYXQgdGhlXG4gIC8vIGdpdmVuIGxpbmUgaXMgcGFydCBvZiAodXN1YWxseSB0aGF0IGlzIHRoZSBsaW5lIGl0c2VsZikuXG4gIGZ1bmN0aW9uIHZpc3VhbExpbmUobGluZSkge1xuICAgIHZhciBtZXJnZWQ7XG4gICAgd2hpbGUgKG1lcmdlZCA9IGNvbGxhcHNlZFNwYW5BdFN0YXJ0KGxpbmUpKVxuICAgICAgbGluZSA9IG1lcmdlZC5maW5kKC0xLCB0cnVlKS5saW5lO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiBsb2dpY2FsIGxpbmVzIHRoYXQgY29udGludWUgdGhlIHZpc3VhbCBsaW5lXG4gIC8vIHN0YXJ0ZWQgYnkgdGhlIGFyZ3VtZW50LCBvciB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG5vIHN1Y2ggbGluZXMuXG4gIGZ1bmN0aW9uIHZpc3VhbExpbmVDb250aW51ZWQobGluZSkge1xuICAgIHZhciBtZXJnZWQsIGxpbmVzO1xuICAgIHdoaWxlIChtZXJnZWQgPSBjb2xsYXBzZWRTcGFuQXRFbmQobGluZSkpIHtcbiAgICAgIGxpbmUgPSBtZXJnZWQuZmluZCgxLCB0cnVlKS5saW5lO1xuICAgICAgKGxpbmVzIHx8IChsaW5lcyA9IFtdKSkucHVzaChsaW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBsaW5lIG51bWJlciBvZiB0aGUgc3RhcnQgb2YgdGhlIHZpc3VhbCBsaW5lIHRoYXQgdGhlXG4gIC8vIGdpdmVuIGxpbmUgbnVtYmVyIGlzIHBhcnQgb2YuXG4gIGZ1bmN0aW9uIHZpc3VhbExpbmVObyhkb2MsIGxpbmVOKSB7XG4gICAgdmFyIGxpbmUgPSBnZXRMaW5lKGRvYywgbGluZU4pLCB2aXMgPSB2aXN1YWxMaW5lKGxpbmUpO1xuICAgIGlmIChsaW5lID09IHZpcykgcmV0dXJuIGxpbmVOO1xuICAgIHJldHVybiBsaW5lTm8odmlzKTtcbiAgfVxuICAvLyBHZXQgdGhlIGxpbmUgbnVtYmVyIG9mIHRoZSBzdGFydCBvZiB0aGUgbmV4dCB2aXN1YWwgbGluZSBhZnRlclxuICAvLyB0aGUgZ2l2ZW4gbGluZS5cbiAgZnVuY3Rpb24gdmlzdWFsTGluZUVuZE5vKGRvYywgbGluZU4pIHtcbiAgICBpZiAobGluZU4gPiBkb2MubGFzdExpbmUoKSkgcmV0dXJuIGxpbmVOO1xuICAgIHZhciBsaW5lID0gZ2V0TGluZShkb2MsIGxpbmVOKSwgbWVyZ2VkO1xuICAgIGlmICghbGluZUlzSGlkZGVuKGRvYywgbGluZSkpIHJldHVybiBsaW5lTjtcbiAgICB3aGlsZSAobWVyZ2VkID0gY29sbGFwc2VkU3BhbkF0RW5kKGxpbmUpKVxuICAgICAgbGluZSA9IG1lcmdlZC5maW5kKDEsIHRydWUpLmxpbmU7XG4gICAgcmV0dXJuIGxpbmVObyhsaW5lKSArIDE7XG4gIH1cblxuICAvLyBDb21wdXRlIHdoZXRoZXIgYSBsaW5lIGlzIGhpZGRlbi4gTGluZXMgY291bnQgYXMgaGlkZGVuIHdoZW4gdGhleVxuICAvLyBhcmUgcGFydCBvZiBhIHZpc3VhbCBsaW5lIHRoYXQgc3RhcnRzIHdpdGggYW5vdGhlciBsaW5lLCBvciB3aGVuXG4gIC8vIHRoZXkgYXJlIGVudGlyZWx5IGNvdmVyZWQgYnkgY29sbGFwc2VkLCBub24td2lkZ2V0IHNwYW4uXG4gIGZ1bmN0aW9uIGxpbmVJc0hpZGRlbihkb2MsIGxpbmUpIHtcbiAgICB2YXIgc3BzID0gc2F3Q29sbGFwc2VkU3BhbnMgJiYgbGluZS5tYXJrZWRTcGFucztcbiAgICBpZiAoc3BzKSBmb3IgKHZhciBzcCwgaSA9IDA7IGkgPCBzcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHNwID0gc3BzW2ldO1xuICAgICAgaWYgKCFzcC5tYXJrZXIuY29sbGFwc2VkKSBjb250aW51ZTtcbiAgICAgIGlmIChzcC5mcm9tID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKHNwLm1hcmtlci53aWRnZXROb2RlKSBjb250aW51ZTtcbiAgICAgIGlmIChzcC5mcm9tID09IDAgJiYgc3AubWFya2VyLmluY2x1c2l2ZUxlZnQgJiYgbGluZUlzSGlkZGVuSW5uZXIoZG9jLCBsaW5lLCBzcCkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBsaW5lSXNIaWRkZW5Jbm5lcihkb2MsIGxpbmUsIHNwYW4pIHtcbiAgICBpZiAoc3Bhbi50byA9PSBudWxsKSB7XG4gICAgICB2YXIgZW5kID0gc3Bhbi5tYXJrZXIuZmluZCgxLCB0cnVlKTtcbiAgICAgIHJldHVybiBsaW5lSXNIaWRkZW5Jbm5lcihkb2MsIGVuZC5saW5lLCBnZXRNYXJrZWRTcGFuRm9yKGVuZC5saW5lLm1hcmtlZFNwYW5zLCBzcGFuLm1hcmtlcikpO1xuICAgIH1cbiAgICBpZiAoc3Bhbi5tYXJrZXIuaW5jbHVzaXZlUmlnaHQgJiYgc3Bhbi50byA9PSBsaW5lLnRleHQubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZm9yICh2YXIgc3AsIGkgPSAwOyBpIDwgbGluZS5tYXJrZWRTcGFucy5sZW5ndGg7ICsraSkge1xuICAgICAgc3AgPSBsaW5lLm1hcmtlZFNwYW5zW2ldO1xuICAgICAgaWYgKHNwLm1hcmtlci5jb2xsYXBzZWQgJiYgIXNwLm1hcmtlci53aWRnZXROb2RlICYmIHNwLmZyb20gPT0gc3Bhbi50byAmJlxuICAgICAgICAgIChzcC50byA9PSBudWxsIHx8IHNwLnRvICE9IHNwYW4uZnJvbSkgJiZcbiAgICAgICAgICAoc3AubWFya2VyLmluY2x1c2l2ZUxlZnQgfHwgc3Bhbi5tYXJrZXIuaW5jbHVzaXZlUmlnaHQpICYmXG4gICAgICAgICAgbGluZUlzSGlkZGVuSW5uZXIoZG9jLCBsaW5lLCBzcCkpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIExJTkUgV0lER0VUU1xuXG4gIC8vIExpbmUgd2lkZ2V0cyBhcmUgYmxvY2sgZWxlbWVudHMgZGlzcGxheWVkIGFib3ZlIG9yIGJlbG93IGEgbGluZS5cblxuICB2YXIgTGluZVdpZGdldCA9IENvZGVNaXJyb3IuTGluZVdpZGdldCA9IGZ1bmN0aW9uKGNtLCBub2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMpIGZvciAodmFyIG9wdCBpbiBvcHRpb25zKSBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHQpKVxuICAgICAgdGhpc1tvcHRdID0gb3B0aW9uc1tvcHRdO1xuICAgIHRoaXMuY20gPSBjbTtcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xuICB9O1xuICBldmVudE1peGluKExpbmVXaWRnZXQpO1xuXG4gIGZ1bmN0aW9uIGFkanVzdFNjcm9sbFdoZW5BYm92ZVZpc2libGUoY20sIGxpbmUsIGRpZmYpIHtcbiAgICBpZiAoaGVpZ2h0QXRMaW5lKGxpbmUpIDwgKChjbS5jdXJPcCAmJiBjbS5jdXJPcC5zY3JvbGxUb3ApIHx8IGNtLmRvYy5zY3JvbGxUb3ApKVxuICAgICAgYWRkVG9TY3JvbGxQb3MoY20sIG51bGwsIGRpZmYpO1xuICB9XG5cbiAgTGluZVdpZGdldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY20gPSB0aGlzLmNtLCB3cyA9IHRoaXMubGluZS53aWRnZXRzLCBsaW5lID0gdGhpcy5saW5lLCBubyA9IGxpbmVObyhsaW5lKTtcbiAgICBpZiAobm8gPT0gbnVsbCB8fCAhd3MpIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdzLmxlbmd0aDsgKytpKSBpZiAod3NbaV0gPT0gdGhpcykgd3Muc3BsaWNlKGktLSwgMSk7XG4gICAgaWYgKCF3cy5sZW5ndGgpIGxpbmUud2lkZ2V0cyA9IG51bGw7XG4gICAgdmFyIGhlaWdodCA9IHdpZGdldEhlaWdodCh0aGlzKTtcbiAgICBydW5Jbk9wKGNtLCBmdW5jdGlvbigpIHtcbiAgICAgIGFkanVzdFNjcm9sbFdoZW5BYm92ZVZpc2libGUoY20sIGxpbmUsIC1oZWlnaHQpO1xuICAgICAgcmVnTGluZUNoYW5nZShjbSwgbm8sIFwid2lkZ2V0XCIpO1xuICAgICAgdXBkYXRlTGluZUhlaWdodChsaW5lLCBNYXRoLm1heCgwLCBsaW5lLmhlaWdodCAtIGhlaWdodCkpO1xuICAgIH0pO1xuICB9O1xuICBMaW5lV2lkZ2V0LnByb3RvdHlwZS5jaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9sZEggPSB0aGlzLmhlaWdodCwgY20gPSB0aGlzLmNtLCBsaW5lID0gdGhpcy5saW5lO1xuICAgIHRoaXMuaGVpZ2h0ID0gbnVsbDtcbiAgICB2YXIgZGlmZiA9IHdpZGdldEhlaWdodCh0aGlzKSAtIG9sZEg7XG4gICAgaWYgKCFkaWZmKSByZXR1cm47XG4gICAgcnVuSW5PcChjbSwgZnVuY3Rpb24oKSB7XG4gICAgICBjbS5jdXJPcC5mb3JjZVVwZGF0ZSA9IHRydWU7XG4gICAgICBhZGp1c3RTY3JvbGxXaGVuQWJvdmVWaXNpYmxlKGNtLCBsaW5lLCBkaWZmKTtcbiAgICAgIHVwZGF0ZUxpbmVIZWlnaHQobGluZSwgbGluZS5oZWlnaHQgKyBkaWZmKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiB3aWRnZXRIZWlnaHQod2lkZ2V0KSB7XG4gICAgaWYgKHdpZGdldC5oZWlnaHQgIT0gbnVsbCkgcmV0dXJuIHdpZGdldC5oZWlnaHQ7XG4gICAgaWYgKCFjb250YWlucyhkb2N1bWVudC5ib2R5LCB3aWRnZXQubm9kZSkpXG4gICAgICByZW1vdmVDaGlsZHJlbkFuZEFkZCh3aWRnZXQuY20uZGlzcGxheS5tZWFzdXJlLCBlbHQoXCJkaXZcIiwgW3dpZGdldC5ub2RlXSwgbnVsbCwgXCJwb3NpdGlvbjogcmVsYXRpdmVcIikpO1xuICAgIHJldHVybiB3aWRnZXQuaGVpZ2h0ID0gd2lkZ2V0Lm5vZGUub2Zmc2V0SGVpZ2h0O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkTGluZVdpZGdldChjbSwgaGFuZGxlLCBub2RlLCBvcHRpb25zKSB7XG4gICAgdmFyIHdpZGdldCA9IG5ldyBMaW5lV2lkZ2V0KGNtLCBub2RlLCBvcHRpb25zKTtcbiAgICBpZiAod2lkZ2V0Lm5vSFNjcm9sbCkgY20uZGlzcGxheS5hbGlnbldpZGdldHMgPSB0cnVlO1xuICAgIGNoYW5nZUxpbmUoY20sIGhhbmRsZSwgXCJ3aWRnZXRcIiwgZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHdpZGdldHMgPSBsaW5lLndpZGdldHMgfHwgKGxpbmUud2lkZ2V0cyA9IFtdKTtcbiAgICAgIGlmICh3aWRnZXQuaW5zZXJ0QXQgPT0gbnVsbCkgd2lkZ2V0cy5wdXNoKHdpZGdldCk7XG4gICAgICBlbHNlIHdpZGdldHMuc3BsaWNlKE1hdGgubWluKHdpZGdldHMubGVuZ3RoIC0gMSwgTWF0aC5tYXgoMCwgd2lkZ2V0Lmluc2VydEF0KSksIDAsIHdpZGdldCk7XG4gICAgICB3aWRnZXQubGluZSA9IGxpbmU7XG4gICAgICBpZiAoIWxpbmVJc0hpZGRlbihjbS5kb2MsIGxpbmUpKSB7XG4gICAgICAgIHZhciBhYm92ZVZpc2libGUgPSBoZWlnaHRBdExpbmUobGluZSkgPCBjbS5kb2Muc2Nyb2xsVG9wO1xuICAgICAgICB1cGRhdGVMaW5lSGVpZ2h0KGxpbmUsIGxpbmUuaGVpZ2h0ICsgd2lkZ2V0SGVpZ2h0KHdpZGdldCkpO1xuICAgICAgICBpZiAoYWJvdmVWaXNpYmxlKSBhZGRUb1Njcm9sbFBvcyhjbSwgbnVsbCwgd2lkZ2V0LmhlaWdodCk7XG4gICAgICAgIGNtLmN1ck9wLmZvcmNlVXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiB3aWRnZXQ7XG4gIH1cblxuICAvLyBMSU5FIERBVEEgU1RSVUNUVVJFXG5cbiAgLy8gTGluZSBvYmplY3RzLiBUaGVzZSBob2xkIHN0YXRlIHJlbGF0ZWQgdG8gYSBsaW5lLCBpbmNsdWRpbmdcbiAgLy8gaGlnaGxpZ2h0aW5nIGluZm8gKHRoZSBzdHlsZXMgYXJyYXkpLlxuICB2YXIgTGluZSA9IENvZGVNaXJyb3IuTGluZSA9IGZ1bmN0aW9uKHRleHQsIG1hcmtlZFNwYW5zLCBlc3RpbWF0ZUhlaWdodCkge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgYXR0YWNoTWFya2VkU3BhbnModGhpcywgbWFya2VkU3BhbnMpO1xuICAgIHRoaXMuaGVpZ2h0ID0gZXN0aW1hdGVIZWlnaHQgPyBlc3RpbWF0ZUhlaWdodCh0aGlzKSA6IDE7XG4gIH07XG4gIGV2ZW50TWl4aW4oTGluZSk7XG4gIExpbmUucHJvdG90eXBlLmxpbmVObyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbGluZU5vKHRoaXMpOyB9O1xuXG4gIC8vIENoYW5nZSB0aGUgY29udGVudCAodGV4dCwgbWFya2Vycykgb2YgYSBsaW5lLiBBdXRvbWF0aWNhbGx5XG4gIC8vIGludmFsaWRhdGVzIGNhY2hlZCBpbmZvcm1hdGlvbiBhbmQgdHJpZXMgdG8gcmUtZXN0aW1hdGUgdGhlXG4gIC8vIGxpbmUncyBoZWlnaHQuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpbmUobGluZSwgdGV4dCwgbWFya2VkU3BhbnMsIGVzdGltYXRlSGVpZ2h0KSB7XG4gICAgbGluZS50ZXh0ID0gdGV4dDtcbiAgICBpZiAobGluZS5zdGF0ZUFmdGVyKSBsaW5lLnN0YXRlQWZ0ZXIgPSBudWxsO1xuICAgIGlmIChsaW5lLnN0eWxlcykgbGluZS5zdHlsZXMgPSBudWxsO1xuICAgIGlmIChsaW5lLm9yZGVyICE9IG51bGwpIGxpbmUub3JkZXIgPSBudWxsO1xuICAgIGRldGFjaE1hcmtlZFNwYW5zKGxpbmUpO1xuICAgIGF0dGFjaE1hcmtlZFNwYW5zKGxpbmUsIG1hcmtlZFNwYW5zKTtcbiAgICB2YXIgZXN0SGVpZ2h0ID0gZXN0aW1hdGVIZWlnaHQgPyBlc3RpbWF0ZUhlaWdodChsaW5lKSA6IDE7XG4gICAgaWYgKGVzdEhlaWdodCAhPSBsaW5lLmhlaWdodCkgdXBkYXRlTGluZUhlaWdodChsaW5lLCBlc3RIZWlnaHQpO1xuICB9XG5cbiAgLy8gRGV0YWNoIGEgbGluZSBmcm9tIHRoZSBkb2N1bWVudCB0cmVlIGFuZCBpdHMgbWFya2Vycy5cbiAgZnVuY3Rpb24gY2xlYW5VcExpbmUobGluZSkge1xuICAgIGxpbmUucGFyZW50ID0gbnVsbDtcbiAgICBkZXRhY2hNYXJrZWRTcGFucyhsaW5lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dHJhY3RMaW5lQ2xhc3Nlcyh0eXBlLCBvdXRwdXQpIHtcbiAgICBpZiAodHlwZSkgZm9yICg7Oykge1xuICAgICAgdmFyIGxpbmVDbGFzcyA9IHR5cGUubWF0Y2goLyg/Ol58XFxzKylsaW5lLShiYWNrZ3JvdW5kLSk/KFxcUyspLyk7XG4gICAgICBpZiAoIWxpbmVDbGFzcykgYnJlYWs7XG4gICAgICB0eXBlID0gdHlwZS5zbGljZSgwLCBsaW5lQ2xhc3MuaW5kZXgpICsgdHlwZS5zbGljZShsaW5lQ2xhc3MuaW5kZXggKyBsaW5lQ2xhc3NbMF0ubGVuZ3RoKTtcbiAgICAgIHZhciBwcm9wID0gbGluZUNsYXNzWzFdID8gXCJiZ0NsYXNzXCIgOiBcInRleHRDbGFzc1wiO1xuICAgICAgaWYgKG91dHB1dFtwcm9wXSA9PSBudWxsKVxuICAgICAgICBvdXRwdXRbcHJvcF0gPSBsaW5lQ2xhc3NbMl07XG4gICAgICBlbHNlIGlmICghKG5ldyBSZWdFeHAoXCIoPzpefFxccylcIiArIGxpbmVDbGFzc1syXSArIFwiKD86JHxcXHMpXCIpKS50ZXN0KG91dHB1dFtwcm9wXSkpXG4gICAgICAgIG91dHB1dFtwcm9wXSArPSBcIiBcIiArIGxpbmVDbGFzc1syXTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxsQmxhbmtMaW5lKG1vZGUsIHN0YXRlKSB7XG4gICAgaWYgKG1vZGUuYmxhbmtMaW5lKSByZXR1cm4gbW9kZS5ibGFua0xpbmUoc3RhdGUpO1xuICAgIGlmICghbW9kZS5pbm5lck1vZGUpIHJldHVybjtcbiAgICB2YXIgaW5uZXIgPSBDb2RlTWlycm9yLmlubmVyTW9kZShtb2RlLCBzdGF0ZSk7XG4gICAgaWYgKGlubmVyLm1vZGUuYmxhbmtMaW5lKSByZXR1cm4gaW5uZXIubW9kZS5ibGFua0xpbmUoaW5uZXIuc3RhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFRva2VuKG1vZGUsIHN0cmVhbSwgc3RhdGUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIHZhciBzdHlsZSA9IG1vZGUudG9rZW4oc3RyZWFtLCBzdGF0ZSk7XG4gICAgICBpZiAoc3RyZWFtLnBvcyA+IHN0cmVhbS5zdGFydCkgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb2RlIFwiICsgbW9kZS5uYW1lICsgXCIgZmFpbGVkIHRvIGFkdmFuY2Ugc3RyZWFtLlwiKTtcbiAgfVxuXG4gIC8vIFJ1biB0aGUgZ2l2ZW4gbW9kZSdzIHBhcnNlciBvdmVyIGEgbGluZSwgY2FsbGluZyBmIGZvciBlYWNoIHRva2VuLlxuICBmdW5jdGlvbiBydW5Nb2RlKGNtLCB0ZXh0LCBtb2RlLCBzdGF0ZSwgZiwgbGluZUNsYXNzZXMsIGZvcmNlVG9FbmQpIHtcbiAgICB2YXIgZmxhdHRlblNwYW5zID0gbW9kZS5mbGF0dGVuU3BhbnM7XG4gICAgaWYgKGZsYXR0ZW5TcGFucyA9PSBudWxsKSBmbGF0dGVuU3BhbnMgPSBjbS5vcHRpb25zLmZsYXR0ZW5TcGFucztcbiAgICB2YXIgY3VyU3RhcnQgPSAwLCBjdXJTdHlsZSA9IG51bGw7XG4gICAgdmFyIHN0cmVhbSA9IG5ldyBTdHJpbmdTdHJlYW0odGV4dCwgY20ub3B0aW9ucy50YWJTaXplKSwgc3R5bGU7XG4gICAgaWYgKHRleHQgPT0gXCJcIikgZXh0cmFjdExpbmVDbGFzc2VzKGNhbGxCbGFua0xpbmUobW9kZSwgc3RhdGUpLCBsaW5lQ2xhc3Nlcyk7XG4gICAgd2hpbGUgKCFzdHJlYW0uZW9sKCkpIHtcbiAgICAgIGlmIChzdHJlYW0ucG9zID4gY20ub3B0aW9ucy5tYXhIaWdobGlnaHRMZW5ndGgpIHtcbiAgICAgICAgZmxhdHRlblNwYW5zID0gZmFsc2U7XG4gICAgICAgIGlmIChmb3JjZVRvRW5kKSBwcm9jZXNzTGluZShjbSwgdGV4dCwgc3RhdGUsIHN0cmVhbS5wb3MpO1xuICAgICAgICBzdHJlYW0ucG9zID0gdGV4dC5sZW5ndGg7XG4gICAgICAgIHN0eWxlID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlID0gZXh0cmFjdExpbmVDbGFzc2VzKHJlYWRUb2tlbihtb2RlLCBzdHJlYW0sIHN0YXRlKSwgbGluZUNsYXNzZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNtLm9wdGlvbnMuYWRkTW9kZUNsYXNzKSB7XG4gICAgICAgIHZhciBtTmFtZSA9IENvZGVNaXJyb3IuaW5uZXJNb2RlKG1vZGUsIHN0YXRlKS5tb2RlLm5hbWU7XG4gICAgICAgIGlmIChtTmFtZSkgc3R5bGUgPSBcIm0tXCIgKyAoc3R5bGUgPyBtTmFtZSArIFwiIFwiICsgc3R5bGUgOiBtTmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAoIWZsYXR0ZW5TcGFucyB8fCBjdXJTdHlsZSAhPSBzdHlsZSkge1xuICAgICAgICBpZiAoY3VyU3RhcnQgPCBzdHJlYW0uc3RhcnQpIGYoc3RyZWFtLnN0YXJ0LCBjdXJTdHlsZSk7XG4gICAgICAgIGN1clN0YXJ0ID0gc3RyZWFtLnN0YXJ0OyBjdXJTdHlsZSA9IHN0eWxlO1xuICAgICAgfVxuICAgICAgc3RyZWFtLnN0YXJ0ID0gc3RyZWFtLnBvcztcbiAgICB9XG4gICAgd2hpbGUgKGN1clN0YXJ0IDwgc3RyZWFtLnBvcykge1xuICAgICAgLy8gV2Via2l0IHNlZW1zIHRvIHJlZnVzZSB0byByZW5kZXIgdGV4dCBub2RlcyBsb25nZXIgdGhhbiA1NzQ0NCBjaGFyYWN0ZXJzXG4gICAgICB2YXIgcG9zID0gTWF0aC5taW4oc3RyZWFtLnBvcywgY3VyU3RhcnQgKyA1MDAwMCk7XG4gICAgICBmKHBvcywgY3VyU3R5bGUpO1xuICAgICAgY3VyU3RhcnQgPSBwb3M7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSBhIHN0eWxlIGFycmF5IChhbiBhcnJheSBzdGFydGluZyB3aXRoIGEgbW9kZSBnZW5lcmF0aW9uXG4gIC8vIC0tIGZvciBpbnZhbGlkYXRpb24gLS0gZm9sbG93ZWQgYnkgcGFpcnMgb2YgZW5kIHBvc2l0aW9ucyBhbmRcbiAgLy8gc3R5bGUgc3RyaW5ncyksIHdoaWNoIGlzIHVzZWQgdG8gaGlnaGxpZ2h0IHRoZSB0b2tlbnMgb24gdGhlXG4gIC8vIGxpbmUuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodExpbmUoY20sIGxpbmUsIHN0YXRlLCBmb3JjZVRvRW5kKSB7XG4gICAgLy8gQSBzdHlsZXMgYXJyYXkgYWx3YXlzIHN0YXJ0cyB3aXRoIGEgbnVtYmVyIGlkZW50aWZ5aW5nIHRoZVxuICAgIC8vIG1vZGUvb3ZlcmxheXMgdGhhdCBpdCBpcyBiYXNlZCBvbiAoZm9yIGVhc3kgaW52YWxpZGF0aW9uKS5cbiAgICB2YXIgc3QgPSBbY20uc3RhdGUubW9kZUdlbl0sIGxpbmVDbGFzc2VzID0ge307XG4gICAgLy8gQ29tcHV0ZSB0aGUgYmFzZSBhcnJheSBvZiBzdHlsZXNcbiAgICBydW5Nb2RlKGNtLCBsaW5lLnRleHQsIGNtLmRvYy5tb2RlLCBzdGF0ZSwgZnVuY3Rpb24oZW5kLCBzdHlsZSkge1xuICAgICAgc3QucHVzaChlbmQsIHN0eWxlKTtcbiAgICB9LCBsaW5lQ2xhc3NlcywgZm9yY2VUb0VuZCk7XG5cbiAgICAvLyBSdW4gb3ZlcmxheXMsIGFkanVzdCBzdHlsZSBhcnJheS5cbiAgICBmb3IgKHZhciBvID0gMDsgbyA8IGNtLnN0YXRlLm92ZXJsYXlzLmxlbmd0aDsgKytvKSB7XG4gICAgICB2YXIgb3ZlcmxheSA9IGNtLnN0YXRlLm92ZXJsYXlzW29dLCBpID0gMSwgYXQgPSAwO1xuICAgICAgcnVuTW9kZShjbSwgbGluZS50ZXh0LCBvdmVybGF5Lm1vZGUsIHRydWUsIGZ1bmN0aW9uKGVuZCwgc3R5bGUpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gaTtcbiAgICAgICAgLy8gRW5zdXJlIHRoZXJlJ3MgYSB0b2tlbiBlbmQgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24sIGFuZCB0aGF0IGkgcG9pbnRzIGF0IGl0XG4gICAgICAgIHdoaWxlIChhdCA8IGVuZCkge1xuICAgICAgICAgIHZhciBpX2VuZCA9IHN0W2ldO1xuICAgICAgICAgIGlmIChpX2VuZCA+IGVuZClcbiAgICAgICAgICAgIHN0LnNwbGljZShpLCAxLCBlbmQsIHN0W2krMV0sIGlfZW5kKTtcbiAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgYXQgPSBNYXRoLm1pbihlbmQsIGlfZW5kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm47XG4gICAgICAgIGlmIChvdmVybGF5Lm9wYXF1ZSkge1xuICAgICAgICAgIHN0LnNwbGljZShzdGFydCwgaSAtIHN0YXJ0LCBlbmQsIFwiY20tb3ZlcmxheSBcIiArIHN0eWxlKTtcbiAgICAgICAgICBpID0gc3RhcnQgKyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoOyBzdGFydCA8IGk7IHN0YXJ0ICs9IDIpIHtcbiAgICAgICAgICAgIHZhciBjdXIgPSBzdFtzdGFydCsxXTtcbiAgICAgICAgICAgIHN0W3N0YXJ0KzFdID0gKGN1ciA/IGN1ciArIFwiIFwiIDogXCJcIikgKyBcImNtLW92ZXJsYXkgXCIgKyBzdHlsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGxpbmVDbGFzc2VzKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3N0eWxlczogc3QsIGNsYXNzZXM6IGxpbmVDbGFzc2VzLmJnQ2xhc3MgfHwgbGluZUNsYXNzZXMudGV4dENsYXNzID8gbGluZUNsYXNzZXMgOiBudWxsfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpbmVTdHlsZXMoY20sIGxpbmUpIHtcbiAgICBpZiAoIWxpbmUuc3R5bGVzIHx8IGxpbmUuc3R5bGVzWzBdICE9IGNtLnN0YXRlLm1vZGVHZW4pIHtcbiAgICAgIHZhciByZXN1bHQgPSBoaWdobGlnaHRMaW5lKGNtLCBsaW5lLCBsaW5lLnN0YXRlQWZ0ZXIgPSBnZXRTdGF0ZUJlZm9yZShjbSwgbGluZU5vKGxpbmUpKSk7XG4gICAgICBsaW5lLnN0eWxlcyA9IHJlc3VsdC5zdHlsZXM7XG4gICAgICBpZiAocmVzdWx0LmNsYXNzZXMpIGxpbmUuc3R5bGVDbGFzc2VzID0gcmVzdWx0LmNsYXNzZXM7XG4gICAgICBlbHNlIGlmIChsaW5lLnN0eWxlQ2xhc3NlcykgbGluZS5zdHlsZUNsYXNzZXMgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbGluZS5zdHlsZXM7XG4gIH1cblxuICAvLyBMaWdodHdlaWdodCBmb3JtIG9mIGhpZ2hsaWdodCAtLSBwcm9jZWVkIG92ZXIgdGhpcyBsaW5lIGFuZFxuICAvLyB1cGRhdGUgc3RhdGUsIGJ1dCBkb24ndCBzYXZlIGEgc3R5bGUgYXJyYXkuIFVzZWQgZm9yIGxpbmVzIHRoYXRcbiAgLy8gYXJlbid0IGN1cnJlbnRseSB2aXNpYmxlLlxuICBmdW5jdGlvbiBwcm9jZXNzTGluZShjbSwgdGV4dCwgc3RhdGUsIHN0YXJ0QXQpIHtcbiAgICB2YXIgbW9kZSA9IGNtLmRvYy5tb2RlO1xuICAgIHZhciBzdHJlYW0gPSBuZXcgU3RyaW5nU3RyZWFtKHRleHQsIGNtLm9wdGlvbnMudGFiU2l6ZSk7XG4gICAgc3RyZWFtLnN0YXJ0ID0gc3RyZWFtLnBvcyA9IHN0YXJ0QXQgfHwgMDtcbiAgICBpZiAodGV4dCA9PSBcIlwiKSBjYWxsQmxhbmtMaW5lKG1vZGUsIHN0YXRlKTtcbiAgICB3aGlsZSAoIXN0cmVhbS5lb2woKSAmJiBzdHJlYW0ucG9zIDw9IGNtLm9wdGlvbnMubWF4SGlnaGxpZ2h0TGVuZ3RoKSB7XG4gICAgICByZWFkVG9rZW4obW9kZSwgc3RyZWFtLCBzdGF0ZSk7XG4gICAgICBzdHJlYW0uc3RhcnQgPSBzdHJlYW0ucG9zO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnZlcnQgYSBzdHlsZSBhcyByZXR1cm5lZCBieSBhIG1vZGUgKGVpdGhlciBudWxsLCBvciBhIHN0cmluZ1xuICAvLyBjb250YWluaW5nIG9uZSBvciBtb3JlIHN0eWxlcykgdG8gYSBDU1Mgc3R5bGUuIFRoaXMgaXMgY2FjaGVkLFxuICAvLyBhbmQgYWxzbyBsb29rcyBmb3IgbGluZS13aWRlIHN0eWxlcy5cbiAgdmFyIHN0eWxlVG9DbGFzc0NhY2hlID0ge30sIHN0eWxlVG9DbGFzc0NhY2hlV2l0aE1vZGUgPSB7fTtcbiAgZnVuY3Rpb24gaW50ZXJwcmV0VG9rZW5TdHlsZShzdHlsZSwgb3B0aW9ucykge1xuICAgIGlmICghc3R5bGUgfHwgL15cXHMqJC8udGVzdChzdHlsZSkpIHJldHVybiBudWxsO1xuICAgIHZhciBjYWNoZSA9IG9wdGlvbnMuYWRkTW9kZUNsYXNzID8gc3R5bGVUb0NsYXNzQ2FjaGVXaXRoTW9kZSA6IHN0eWxlVG9DbGFzc0NhY2hlO1xuICAgIHJldHVybiBjYWNoZVtzdHlsZV0gfHxcbiAgICAgIChjYWNoZVtzdHlsZV0gPSBzdHlsZS5yZXBsYWNlKC9cXFMrL2csIFwiY20tJCZcIikpO1xuICB9XG5cbiAgLy8gUmVuZGVyIHRoZSBET00gcmVwcmVzZW50YXRpb24gb2YgdGhlIHRleHQgb2YgYSBsaW5lLiBBbHNvIGJ1aWxkc1xuICAvLyB1cCBhICdsaW5lIG1hcCcsIHdoaWNoIHBvaW50cyBhdCB0aGUgRE9NIG5vZGVzIHRoYXQgcmVwcmVzZW50XG4gIC8vIHNwZWNpZmljIHN0cmV0Y2hlcyBvZiB0ZXh0LCBhbmQgaXMgdXNlZCBieSB0aGUgbWVhc3VyaW5nIGNvZGUuXG4gIC8vIFRoZSByZXR1cm5lZCBvYmplY3QgY29udGFpbnMgdGhlIERPTSBub2RlLCB0aGlzIG1hcCwgYW5kXG4gIC8vIGluZm9ybWF0aW9uIGFib3V0IGxpbmUtd2lkZSBzdHlsZXMgdGhhdCB3ZXJlIHNldCBieSB0aGUgbW9kZS5cbiAgZnVuY3Rpb24gYnVpbGRMaW5lQ29udGVudChjbSwgbGluZVZpZXcpIHtcbiAgICAvLyBUaGUgcGFkZGluZy1yaWdodCBmb3JjZXMgdGhlIGVsZW1lbnQgdG8gaGF2ZSBhICdib3JkZXInLCB3aGljaFxuICAgIC8vIGlzIG5lZWRlZCBvbiBXZWJraXQgdG8gYmUgYWJsZSB0byBnZXQgbGluZS1sZXZlbCBib3VuZGluZ1xuICAgIC8vIHJlY3RhbmdsZXMgZm9yIGl0IChpbiBtZWFzdXJlQ2hhcikuXG4gICAgdmFyIGNvbnRlbnQgPSBlbHQoXCJzcGFuXCIsIG51bGwsIG51bGwsIHdlYmtpdCA/IFwicGFkZGluZy1yaWdodDogLjFweFwiIDogbnVsbCk7XG4gICAgdmFyIGJ1aWxkZXIgPSB7cHJlOiBlbHQoXCJwcmVcIiwgW2NvbnRlbnRdKSwgY29udGVudDogY29udGVudCwgY29sOiAwLCBwb3M6IDAsIGNtOiBjbX07XG4gICAgbGluZVZpZXcubWVhc3VyZSA9IHt9O1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBsb2dpY2FsIGxpbmVzIHRoYXQgbWFrZSB1cCB0aGlzIHZpc3VhbCBsaW5lLlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IChsaW5lVmlldy5yZXN0ID8gbGluZVZpZXcucmVzdC5sZW5ndGggOiAwKTsgaSsrKSB7XG4gICAgICB2YXIgbGluZSA9IGkgPyBsaW5lVmlldy5yZXN0W2kgLSAxXSA6IGxpbmVWaWV3LmxpbmUsIG9yZGVyO1xuICAgICAgYnVpbGRlci5wb3MgPSAwO1xuICAgICAgYnVpbGRlci5hZGRUb2tlbiA9IGJ1aWxkVG9rZW47XG4gICAgICAvLyBPcHRpb25hbGx5IHdpcmUgaW4gc29tZSBoYWNrcyBpbnRvIHRoZSB0b2tlbi1yZW5kZXJpbmdcbiAgICAgIC8vIGFsZ29yaXRobSwgdG8gZGVhbCB3aXRoIGJyb3dzZXIgcXVpcmtzLlxuICAgICAgaWYgKChpZSB8fCB3ZWJraXQpICYmIGNtLmdldE9wdGlvbihcImxpbmVXcmFwcGluZ1wiKSlcbiAgICAgICAgYnVpbGRlci5hZGRUb2tlbiA9IGJ1aWxkVG9rZW5TcGxpdFNwYWNlcyhidWlsZGVyLmFkZFRva2VuKTtcbiAgICAgIGlmIChoYXNCYWRCaWRpUmVjdHMoY20uZGlzcGxheS5tZWFzdXJlKSAmJiAob3JkZXIgPSBnZXRPcmRlcihsaW5lKSkpXG4gICAgICAgIGJ1aWxkZXIuYWRkVG9rZW4gPSBidWlsZFRva2VuQmFkQmlkaShidWlsZGVyLmFkZFRva2VuLCBvcmRlcik7XG4gICAgICBidWlsZGVyLm1hcCA9IFtdO1xuICAgICAgaW5zZXJ0TGluZUNvbnRlbnQobGluZSwgYnVpbGRlciwgZ2V0TGluZVN0eWxlcyhjbSwgbGluZSkpO1xuICAgICAgaWYgKGxpbmUuc3R5bGVDbGFzc2VzKSB7XG4gICAgICAgIGlmIChsaW5lLnN0eWxlQ2xhc3Nlcy5iZ0NsYXNzKVxuICAgICAgICAgIGJ1aWxkZXIuYmdDbGFzcyA9IGpvaW5DbGFzc2VzKGxpbmUuc3R5bGVDbGFzc2VzLmJnQ2xhc3MsIGJ1aWxkZXIuYmdDbGFzcyB8fCBcIlwiKTtcbiAgICAgICAgaWYgKGxpbmUuc3R5bGVDbGFzc2VzLnRleHRDbGFzcylcbiAgICAgICAgICBidWlsZGVyLnRleHRDbGFzcyA9IGpvaW5DbGFzc2VzKGxpbmUuc3R5bGVDbGFzc2VzLnRleHRDbGFzcywgYnVpbGRlci50ZXh0Q2xhc3MgfHwgXCJcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSBhdCBsZWFzdCBhIHNpbmdsZSBub2RlIGlzIHByZXNlbnQsIGZvciBtZWFzdXJpbmcuXG4gICAgICBpZiAoYnVpbGRlci5tYXAubGVuZ3RoID09IDApXG4gICAgICAgIGJ1aWxkZXIubWFwLnB1c2goMCwgMCwgYnVpbGRlci5jb250ZW50LmFwcGVuZENoaWxkKHplcm9XaWR0aEVsZW1lbnQoY20uZGlzcGxheS5tZWFzdXJlKSkpO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgbWFwIGFuZCBhIGNhY2hlIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgbG9naWNhbCBsaW5lXG4gICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgIGxpbmVWaWV3Lm1lYXN1cmUubWFwID0gYnVpbGRlci5tYXA7XG4gICAgICAgIGxpbmVWaWV3Lm1lYXN1cmUuY2FjaGUgPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChsaW5lVmlldy5tZWFzdXJlLm1hcHMgfHwgKGxpbmVWaWV3Lm1lYXN1cmUubWFwcyA9IFtdKSkucHVzaChidWlsZGVyLm1hcCk7XG4gICAgICAgIChsaW5lVmlldy5tZWFzdXJlLmNhY2hlcyB8fCAobGluZVZpZXcubWVhc3VyZS5jYWNoZXMgPSBbXSkpLnB1c2goe30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNpZ25hbChjbSwgXCJyZW5kZXJMaW5lXCIsIGNtLCBsaW5lVmlldy5saW5lLCBidWlsZGVyLnByZSk7XG4gICAgaWYgKGJ1aWxkZXIucHJlLmNsYXNzTmFtZSlcbiAgICAgIGJ1aWxkZXIudGV4dENsYXNzID0gam9pbkNsYXNzZXMoYnVpbGRlci5wcmUuY2xhc3NOYW1lLCBidWlsZGVyLnRleHRDbGFzcyB8fCBcIlwiKTtcbiAgICByZXR1cm4gYnVpbGRlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRTcGVjaWFsQ2hhclBsYWNlaG9sZGVyKGNoKSB7XG4gICAgdmFyIHRva2VuID0gZWx0KFwic3BhblwiLCBcIlxcdTIwMjJcIiwgXCJjbS1pbnZhbGlkY2hhclwiKTtcbiAgICB0b2tlbi50aXRsZSA9IFwiXFxcXHVcIiArIGNoLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiB0b2tlbjtcbiAgfVxuXG4gIC8vIEJ1aWxkIHVwIHRoZSBET00gcmVwcmVzZW50YXRpb24gZm9yIGEgc2luZ2xlIHRva2VuLCBhbmQgYWRkIGl0IHRvXG4gIC8vIHRoZSBsaW5lIG1hcC4gVGFrZXMgY2FyZSB0byByZW5kZXIgc3BlY2lhbCBjaGFyYWN0ZXJzIHNlcGFyYXRlbHkuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9rZW4oYnVpbGRlciwgdGV4dCwgc3R5bGUsIHN0YXJ0U3R5bGUsIGVuZFN0eWxlLCB0aXRsZSkge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHZhciBzcGVjaWFsID0gYnVpbGRlci5jbS5vcHRpb25zLnNwZWNpYWxDaGFycywgbXVzdFdyYXAgPSBmYWxzZTtcbiAgICBpZiAoIXNwZWNpYWwudGVzdCh0ZXh0KSkge1xuICAgICAgYnVpbGRlci5jb2wgKz0gdGV4dC5sZW5ndGg7XG4gICAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xuICAgICAgYnVpbGRlci5tYXAucHVzaChidWlsZGVyLnBvcywgYnVpbGRlci5wb3MgKyB0ZXh0Lmxlbmd0aCwgY29udGVudCk7XG4gICAgICBpZiAoaWVfdXB0bzgpIG11c3RXcmFwID0gdHJ1ZTtcbiAgICAgIGJ1aWxkZXIucG9zICs9IHRleHQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgcG9zID0gMDtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHNwZWNpYWwubGFzdEluZGV4ID0gcG9zO1xuICAgICAgICB2YXIgbSA9IHNwZWNpYWwuZXhlYyh0ZXh0KTtcbiAgICAgICAgdmFyIHNraXBwZWQgPSBtID8gbS5pbmRleCAtIHBvcyA6IHRleHQubGVuZ3RoIC0gcG9zO1xuICAgICAgICBpZiAoc2tpcHBlZCkge1xuICAgICAgICAgIHZhciB0eHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKHBvcywgcG9zICsgc2tpcHBlZCkpO1xuICAgICAgICAgIGlmIChpZV91cHRvOCkgY29udGVudC5hcHBlbmRDaGlsZChlbHQoXCJzcGFuXCIsIFt0eHRdKSk7XG4gICAgICAgICAgZWxzZSBjb250ZW50LmFwcGVuZENoaWxkKHR4dCk7XG4gICAgICAgICAgYnVpbGRlci5tYXAucHVzaChidWlsZGVyLnBvcywgYnVpbGRlci5wb3MgKyBza2lwcGVkLCB0eHQpO1xuICAgICAgICAgIGJ1aWxkZXIuY29sICs9IHNraXBwZWQ7XG4gICAgICAgICAgYnVpbGRlci5wb3MgKz0gc2tpcHBlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW0pIGJyZWFrO1xuICAgICAgICBwb3MgKz0gc2tpcHBlZCArIDE7XG4gICAgICAgIGlmIChtWzBdID09IFwiXFx0XCIpIHtcbiAgICAgICAgICB2YXIgdGFiU2l6ZSA9IGJ1aWxkZXIuY20ub3B0aW9ucy50YWJTaXplLCB0YWJXaWR0aCA9IHRhYlNpemUgLSBidWlsZGVyLmNvbCAlIHRhYlNpemU7XG4gICAgICAgICAgdmFyIHR4dCA9IGNvbnRlbnQuYXBwZW5kQ2hpbGQoZWx0KFwic3BhblwiLCBzcGFjZVN0cih0YWJXaWR0aCksIFwiY20tdGFiXCIpKTtcbiAgICAgICAgICBidWlsZGVyLmNvbCArPSB0YWJXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdHh0ID0gYnVpbGRlci5jbS5vcHRpb25zLnNwZWNpYWxDaGFyUGxhY2Vob2xkZXIobVswXSk7XG4gICAgICAgICAgaWYgKGllX3VwdG84KSBjb250ZW50LmFwcGVuZENoaWxkKGVsdChcInNwYW5cIiwgW3R4dF0pKTtcbiAgICAgICAgICBlbHNlIGNvbnRlbnQuYXBwZW5kQ2hpbGQodHh0KTtcbiAgICAgICAgICBidWlsZGVyLmNvbCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkZXIubWFwLnB1c2goYnVpbGRlci5wb3MsIGJ1aWxkZXIucG9zICsgMSwgdHh0KTtcbiAgICAgICAgYnVpbGRlci5wb3MrKztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0eWxlIHx8IHN0YXJ0U3R5bGUgfHwgZW5kU3R5bGUgfHwgbXVzdFdyYXApIHtcbiAgICAgIHZhciBmdWxsU3R5bGUgPSBzdHlsZSB8fCBcIlwiO1xuICAgICAgaWYgKHN0YXJ0U3R5bGUpIGZ1bGxTdHlsZSArPSBzdGFydFN0eWxlO1xuICAgICAgaWYgKGVuZFN0eWxlKSBmdWxsU3R5bGUgKz0gZW5kU3R5bGU7XG4gICAgICB2YXIgdG9rZW4gPSBlbHQoXCJzcGFuXCIsIFtjb250ZW50XSwgZnVsbFN0eWxlKTtcbiAgICAgIGlmICh0aXRsZSkgdG9rZW4udGl0bGUgPSB0aXRsZTtcbiAgICAgIHJldHVybiBidWlsZGVyLmNvbnRlbnQuYXBwZW5kQ2hpbGQodG9rZW4pO1xuICAgIH1cbiAgICBidWlsZGVyLmNvbnRlbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRva2VuU3BsaXRTcGFjZXMoaW5uZXIpIHtcbiAgICBmdW5jdGlvbiBzcGxpdChvbGQpIHtcbiAgICAgIHZhciBvdXQgPSBcIiBcIjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkLmxlbmd0aCAtIDI7ICsraSkgb3V0ICs9IGkgJSAyID8gXCIgXCIgOiBcIlxcdTAwYTBcIjtcbiAgICAgIG91dCArPSBcIiBcIjtcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihidWlsZGVyLCB0ZXh0LCBzdHlsZSwgc3RhcnRTdHlsZSwgZW5kU3R5bGUsIHRpdGxlKSB7XG4gICAgICBpbm5lcihidWlsZGVyLCB0ZXh0LnJlcGxhY2UoLyB7Myx9L2csIHNwbGl0KSwgc3R5bGUsIHN0YXJ0U3R5bGUsIGVuZFN0eWxlLCB0aXRsZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFdvcmsgYXJvdW5kIG5vbnNlbnNlIGRpbWVuc2lvbnMgYmVpbmcgcmVwb3J0ZWQgZm9yIHN0cmV0Y2hlcyBvZlxuICAvLyByaWdodC10by1sZWZ0IHRleHQuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9rZW5CYWRCaWRpKGlubmVyLCBvcmRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbihidWlsZGVyLCB0ZXh0LCBzdHlsZSwgc3RhcnRTdHlsZSwgZW5kU3R5bGUsIHRpdGxlKSB7XG4gICAgICBzdHlsZSA9IHN0eWxlID8gc3R5bGUgKyBcIiBjbS1mb3JjZS1ib3JkZXJcIiA6IFwiY20tZm9yY2UtYm9yZGVyXCI7XG4gICAgICB2YXIgc3RhcnQgPSBidWlsZGVyLnBvcywgZW5kID0gc3RhcnQgKyB0ZXh0Lmxlbmd0aDtcbiAgICAgIGZvciAoOzspIHtcbiAgICAgICAgLy8gRmluZCB0aGUgcGFydCB0aGF0IG92ZXJsYXBzIHdpdGggdGhlIHN0YXJ0IG9mIHRoaXMgdGV4dFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBhcnQgPSBvcmRlcltpXTtcbiAgICAgICAgICBpZiAocGFydC50byA+IHN0YXJ0ICYmIHBhcnQuZnJvbSA8PSBzdGFydCkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnQudG8gPj0gZW5kKSByZXR1cm4gaW5uZXIoYnVpbGRlciwgdGV4dCwgc3R5bGUsIHN0YXJ0U3R5bGUsIGVuZFN0eWxlLCB0aXRsZSk7XG4gICAgICAgIGlubmVyKGJ1aWxkZXIsIHRleHQuc2xpY2UoMCwgcGFydC50byAtIHN0YXJ0KSwgc3R5bGUsIHN0YXJ0U3R5bGUsIG51bGwsIHRpdGxlKTtcbiAgICAgICAgc3RhcnRTdHlsZSA9IG51bGw7XG4gICAgICAgIHRleHQgPSB0ZXh0LnNsaWNlKHBhcnQudG8gLSBzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gcGFydC50bztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRDb2xsYXBzZWRTcGFuKGJ1aWxkZXIsIHNpemUsIG1hcmtlciwgaWdub3JlV2lkZ2V0KSB7XG4gICAgdmFyIHdpZGdldCA9ICFpZ25vcmVXaWRnZXQgJiYgbWFya2VyLndpZGdldE5vZGU7XG4gICAgaWYgKHdpZGdldCkge1xuICAgICAgYnVpbGRlci5tYXAucHVzaChidWlsZGVyLnBvcywgYnVpbGRlci5wb3MgKyBzaXplLCB3aWRnZXQpO1xuICAgICAgYnVpbGRlci5jb250ZW50LmFwcGVuZENoaWxkKHdpZGdldCk7XG4gICAgfVxuICAgIGJ1aWxkZXIucG9zICs9IHNpemU7XG4gIH1cblxuICAvLyBPdXRwdXRzIGEgbnVtYmVyIG9mIHNwYW5zIHRvIG1ha2UgdXAgYSBsaW5lLCB0YWtpbmcgaGlnaGxpZ2h0aW5nXG4gIC8vIGFuZCBtYXJrZWQgdGV4dCBpbnRvIGFjY291bnQuXG4gIGZ1bmN0aW9uIGluc2VydExpbmVDb250ZW50KGxpbmUsIGJ1aWxkZXIsIHN0eWxlcykge1xuICAgIHZhciBzcGFucyA9IGxpbmUubWFya2VkU3BhbnMsIGFsbFRleHQgPSBsaW5lLnRleHQsIGF0ID0gMDtcbiAgICBpZiAoIXNwYW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrPTIpXG4gICAgICAgIGJ1aWxkZXIuYWRkVG9rZW4oYnVpbGRlciwgYWxsVGV4dC5zbGljZShhdCwgYXQgPSBzdHlsZXNbaV0pLCBpbnRlcnByZXRUb2tlblN0eWxlKHN0eWxlc1tpKzFdLCBidWlsZGVyLmNtLm9wdGlvbnMpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gYWxsVGV4dC5sZW5ndGgsIHBvcyA9IDAsIGkgPSAxLCB0ZXh0ID0gXCJcIiwgc3R5bGU7XG4gICAgdmFyIG5leHRDaGFuZ2UgPSAwLCBzcGFuU3R5bGUsIHNwYW5FbmRTdHlsZSwgc3BhblN0YXJ0U3R5bGUsIHRpdGxlLCBjb2xsYXBzZWQ7XG4gICAgZm9yICg7Oykge1xuICAgICAgaWYgKG5leHRDaGFuZ2UgPT0gcG9zKSB7IC8vIFVwZGF0ZSBjdXJyZW50IG1hcmtlciBzZXRcbiAgICAgICAgc3BhblN0eWxlID0gc3BhbkVuZFN0eWxlID0gc3BhblN0YXJ0U3R5bGUgPSB0aXRsZSA9IFwiXCI7XG4gICAgICAgIGNvbGxhcHNlZCA9IG51bGw7IG5leHRDaGFuZ2UgPSBJbmZpbml0eTtcbiAgICAgICAgdmFyIGZvdW5kQm9va21hcmtzID0gW107XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3BhbnMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICB2YXIgc3AgPSBzcGFuc1tqXSwgbSA9IHNwLm1hcmtlcjtcbiAgICAgICAgICBpZiAoc3AuZnJvbSA8PSBwb3MgJiYgKHNwLnRvID09IG51bGwgfHwgc3AudG8gPiBwb3MpKSB7XG4gICAgICAgICAgICBpZiAoc3AudG8gIT0gbnVsbCAmJiBuZXh0Q2hhbmdlID4gc3AudG8pIHsgbmV4dENoYW5nZSA9IHNwLnRvOyBzcGFuRW5kU3R5bGUgPSBcIlwiOyB9XG4gICAgICAgICAgICBpZiAobS5jbGFzc05hbWUpIHNwYW5TdHlsZSArPSBcIiBcIiArIG0uY2xhc3NOYW1lO1xuICAgICAgICAgICAgaWYgKG0uc3RhcnRTdHlsZSAmJiBzcC5mcm9tID09IHBvcykgc3BhblN0YXJ0U3R5bGUgKz0gXCIgXCIgKyBtLnN0YXJ0U3R5bGU7XG4gICAgICAgICAgICBpZiAobS5lbmRTdHlsZSAmJiBzcC50byA9PSBuZXh0Q2hhbmdlKSBzcGFuRW5kU3R5bGUgKz0gXCIgXCIgKyBtLmVuZFN0eWxlO1xuICAgICAgICAgICAgaWYgKG0udGl0bGUgJiYgIXRpdGxlKSB0aXRsZSA9IG0udGl0bGU7XG4gICAgICAgICAgICBpZiAobS5jb2xsYXBzZWQgJiYgKCFjb2xsYXBzZWQgfHwgY29tcGFyZUNvbGxhcHNlZE1hcmtlcnMoY29sbGFwc2VkLm1hcmtlciwgbSkgPCAwKSlcbiAgICAgICAgICAgICAgY29sbGFwc2VkID0gc3A7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcC5mcm9tID4gcG9zICYmIG5leHRDaGFuZ2UgPiBzcC5mcm9tKSB7XG4gICAgICAgICAgICBuZXh0Q2hhbmdlID0gc3AuZnJvbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG0udHlwZSA9PSBcImJvb2ttYXJrXCIgJiYgc3AuZnJvbSA9PSBwb3MgJiYgbS53aWRnZXROb2RlKSBmb3VuZEJvb2ttYXJrcy5wdXNoKG0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsYXBzZWQgJiYgKGNvbGxhcHNlZC5mcm9tIHx8IDApID09IHBvcykge1xuICAgICAgICAgIGJ1aWxkQ29sbGFwc2VkU3BhbihidWlsZGVyLCAoY29sbGFwc2VkLnRvID09IG51bGwgPyBsZW4gKyAxIDogY29sbGFwc2VkLnRvKSAtIHBvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkLm1hcmtlciwgY29sbGFwc2VkLmZyb20gPT0gbnVsbCk7XG4gICAgICAgICAgaWYgKGNvbGxhcHNlZC50byA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb2xsYXBzZWQgJiYgZm91bmRCb29rbWFya3MubGVuZ3RoKSBmb3IgKHZhciBqID0gMDsgaiA8IGZvdW5kQm9va21hcmtzLmxlbmd0aDsgKytqKVxuICAgICAgICAgIGJ1aWxkQ29sbGFwc2VkU3BhbihidWlsZGVyLCAwLCBmb3VuZEJvb2ttYXJrc1tqXSk7XG4gICAgICB9XG4gICAgICBpZiAocG9zID49IGxlbikgYnJlYWs7XG5cbiAgICAgIHZhciB1cHRvID0gTWF0aC5taW4obGVuLCBuZXh0Q2hhbmdlKTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgdmFyIGVuZCA9IHBvcyArIHRleHQubGVuZ3RoO1xuICAgICAgICAgIGlmICghY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW5UZXh0ID0gZW5kID4gdXB0byA/IHRleHQuc2xpY2UoMCwgdXB0byAtIHBvcykgOiB0ZXh0O1xuICAgICAgICAgICAgYnVpbGRlci5hZGRUb2tlbihidWlsZGVyLCB0b2tlblRleHQsIHN0eWxlID8gc3R5bGUgKyBzcGFuU3R5bGUgOiBzcGFuU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5TdGFydFN0eWxlLCBwb3MgKyB0b2tlblRleHQubGVuZ3RoID09IG5leHRDaGFuZ2UgPyBzcGFuRW5kU3R5bGUgOiBcIlwiLCB0aXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbmQgPj0gdXB0bykge3RleHQgPSB0ZXh0LnNsaWNlKHVwdG8gLSBwb3MpOyBwb3MgPSB1cHRvOyBicmVhazt9XG4gICAgICAgICAgcG9zID0gZW5kO1xuICAgICAgICAgIHNwYW5TdGFydFN0eWxlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ID0gYWxsVGV4dC5zbGljZShhdCwgYXQgPSBzdHlsZXNbaSsrXSk7XG4gICAgICAgIHN0eWxlID0gaW50ZXJwcmV0VG9rZW5TdHlsZShzdHlsZXNbaSsrXSwgYnVpbGRlci5jbS5vcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBET0NVTUVOVCBEQVRBIFNUUlVDVFVSRVxuXG4gIC8vIEJ5IGRlZmF1bHQsIHVwZGF0ZXMgdGhhdCBzdGFydCBhbmQgZW5kIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBsaW5lXG4gIC8vIGFyZSB0cmVhdGVkIHNwZWNpYWxseSwgaW4gb3JkZXIgdG8gbWFrZSB0aGUgYXNzb2NpYXRpb24gb2YgbGluZVxuICAvLyB3aWRnZXRzIGFuZCBtYXJrZXIgZWxlbWVudHMgd2l0aCB0aGUgdGV4dCBiZWhhdmUgbW9yZSBpbnR1aXRpdmUuXG4gIGZ1bmN0aW9uIGlzV2hvbGVMaW5lVXBkYXRlKGRvYywgY2hhbmdlKSB7XG4gICAgcmV0dXJuIGNoYW5nZS5mcm9tLmNoID09IDAgJiYgY2hhbmdlLnRvLmNoID09IDAgJiYgbHN0KGNoYW5nZS50ZXh0KSA9PSBcIlwiICYmXG4gICAgICAoIWRvYy5jbSB8fCBkb2MuY20ub3B0aW9ucy53aG9sZUxpbmVVcGRhdGVCZWZvcmUpO1xuICB9XG5cbiAgLy8gUGVyZm9ybSBhIGNoYW5nZSBvbiB0aGUgZG9jdW1lbnQgZGF0YSBzdHJ1Y3R1cmUuXG4gIGZ1bmN0aW9uIHVwZGF0ZURvYyhkb2MsIGNoYW5nZSwgbWFya2VkU3BhbnMsIGVzdGltYXRlSGVpZ2h0KSB7XG4gICAgZnVuY3Rpb24gc3BhbnNGb3Iobikge3JldHVybiBtYXJrZWRTcGFucyA/IG1hcmtlZFNwYW5zW25dIDogbnVsbDt9XG4gICAgZnVuY3Rpb24gdXBkYXRlKGxpbmUsIHRleHQsIHNwYW5zKSB7XG4gICAgICB1cGRhdGVMaW5lKGxpbmUsIHRleHQsIHNwYW5zLCBlc3RpbWF0ZUhlaWdodCk7XG4gICAgICBzaWduYWxMYXRlcihsaW5lLCBcImNoYW5nZVwiLCBsaW5lLCBjaGFuZ2UpO1xuICAgIH1cblxuICAgIHZhciBmcm9tID0gY2hhbmdlLmZyb20sIHRvID0gY2hhbmdlLnRvLCB0ZXh0ID0gY2hhbmdlLnRleHQ7XG4gICAgdmFyIGZpcnN0TGluZSA9IGdldExpbmUoZG9jLCBmcm9tLmxpbmUpLCBsYXN0TGluZSA9IGdldExpbmUoZG9jLCB0by5saW5lKTtcbiAgICB2YXIgbGFzdFRleHQgPSBsc3QodGV4dCksIGxhc3RTcGFucyA9IHNwYW5zRm9yKHRleHQubGVuZ3RoIC0gMSksIG5saW5lcyA9IHRvLmxpbmUgLSBmcm9tLmxpbmU7XG5cbiAgICAvLyBBZGp1c3QgdGhlIGxpbmUgc3RydWN0dXJlXG4gICAgaWYgKGlzV2hvbGVMaW5lVXBkYXRlKGRvYywgY2hhbmdlKSkge1xuICAgICAgLy8gVGhpcyBpcyBhIHdob2xlLWxpbmUgcmVwbGFjZS4gVHJlYXRlZCBzcGVjaWFsbHkgdG8gbWFrZVxuICAgICAgLy8gc3VyZSBsaW5lIG9iamVjdHMgbW92ZSB0aGUgd2F5IHRoZXkgYXJlIHN1cHBvc2VkIHRvLlxuICAgICAgZm9yICh2YXIgaSA9IDAsIGFkZGVkID0gW107IGkgPCB0ZXh0Lmxlbmd0aCAtIDE7ICsraSlcbiAgICAgICAgYWRkZWQucHVzaChuZXcgTGluZSh0ZXh0W2ldLCBzcGFuc0ZvcihpKSwgZXN0aW1hdGVIZWlnaHQpKTtcbiAgICAgIHVwZGF0ZShsYXN0TGluZSwgbGFzdExpbmUudGV4dCwgbGFzdFNwYW5zKTtcbiAgICAgIGlmIChubGluZXMpIGRvYy5yZW1vdmUoZnJvbS5saW5lLCBubGluZXMpO1xuICAgICAgaWYgKGFkZGVkLmxlbmd0aCkgZG9jLmluc2VydChmcm9tLmxpbmUsIGFkZGVkKTtcbiAgICB9IGVsc2UgaWYgKGZpcnN0TGluZSA9PSBsYXN0TGluZSkge1xuICAgICAgaWYgKHRleHQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgdXBkYXRlKGZpcnN0TGluZSwgZmlyc3RMaW5lLnRleHQuc2xpY2UoMCwgZnJvbS5jaCkgKyBsYXN0VGV4dCArIGZpcnN0TGluZS50ZXh0LnNsaWNlKHRvLmNoKSwgbGFzdFNwYW5zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGFkZGVkID0gW10sIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGggLSAxOyArK2kpXG4gICAgICAgICAgYWRkZWQucHVzaChuZXcgTGluZSh0ZXh0W2ldLCBzcGFuc0ZvcihpKSwgZXN0aW1hdGVIZWlnaHQpKTtcbiAgICAgICAgYWRkZWQucHVzaChuZXcgTGluZShsYXN0VGV4dCArIGZpcnN0TGluZS50ZXh0LnNsaWNlKHRvLmNoKSwgbGFzdFNwYW5zLCBlc3RpbWF0ZUhlaWdodCkpO1xuICAgICAgICB1cGRhdGUoZmlyc3RMaW5lLCBmaXJzdExpbmUudGV4dC5zbGljZSgwLCBmcm9tLmNoKSArIHRleHRbMF0sIHNwYW5zRm9yKDApKTtcbiAgICAgICAgZG9jLmluc2VydChmcm9tLmxpbmUgKyAxLCBhZGRlZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0ZXh0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICB1cGRhdGUoZmlyc3RMaW5lLCBmaXJzdExpbmUudGV4dC5zbGljZSgwLCBmcm9tLmNoKSArIHRleHRbMF0gKyBsYXN0TGluZS50ZXh0LnNsaWNlKHRvLmNoKSwgc3BhbnNGb3IoMCkpO1xuICAgICAgZG9jLnJlbW92ZShmcm9tLmxpbmUgKyAxLCBubGluZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGUoZmlyc3RMaW5lLCBmaXJzdExpbmUudGV4dC5zbGljZSgwLCBmcm9tLmNoKSArIHRleHRbMF0sIHNwYW5zRm9yKDApKTtcbiAgICAgIHVwZGF0ZShsYXN0TGluZSwgbGFzdFRleHQgKyBsYXN0TGluZS50ZXh0LnNsaWNlKHRvLmNoKSwgbGFzdFNwYW5zKTtcbiAgICAgIGZvciAodmFyIGkgPSAxLCBhZGRlZCA9IFtdOyBpIDwgdGV4dC5sZW5ndGggLSAxOyArK2kpXG4gICAgICAgIGFkZGVkLnB1c2gobmV3IExpbmUodGV4dFtpXSwgc3BhbnNGb3IoaSksIGVzdGltYXRlSGVpZ2h0KSk7XG4gICAgICBpZiAobmxpbmVzID4gMSkgZG9jLnJlbW92ZShmcm9tLmxpbmUgKyAxLCBubGluZXMgLSAxKTtcbiAgICAgIGRvYy5pbnNlcnQoZnJvbS5saW5lICsgMSwgYWRkZWQpO1xuICAgIH1cblxuICAgIHNpZ25hbExhdGVyKGRvYywgXCJjaGFuZ2VcIiwgZG9jLCBjaGFuZ2UpO1xuICB9XG5cbiAgLy8gVGhlIGRvY3VtZW50IGlzIHJlcHJlc2VudGVkIGFzIGEgQlRyZWUgY29uc2lzdGluZyBvZiBsZWF2ZXMsIHdpdGhcbiAgLy8gY2h1bmsgb2YgbGluZXMgaW4gdGhlbSwgYW5kIGJyYW5jaGVzLCB3aXRoIHVwIHRvIHRlbiBsZWF2ZXMgb3JcbiAgLy8gb3RoZXIgYnJhbmNoIG5vZGVzIGJlbG93IHRoZW0uIFRoZSB0b3Agbm9kZSBpcyBhbHdheXMgYSBicmFuY2hcbiAgLy8gbm9kZSwgYW5kIGlzIHRoZSBkb2N1bWVudCBvYmplY3QgaXRzZWxmIChtZWFuaW5nIGl0IGhhc1xuICAvLyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMpLlxuICAvL1xuICAvLyBBbGwgbm9kZXMgaGF2ZSBwYXJlbnQgbGlua3MuIFRoZSB0cmVlIGlzIHVzZWQgYm90aCB0byBnbyBmcm9tXG4gIC8vIGxpbmUgbnVtYmVycyB0byBsaW5lIG9iamVjdHMsIGFuZCB0byBnbyBmcm9tIG9iamVjdHMgdG8gbnVtYmVycy5cbiAgLy8gSXQgYWxzbyBpbmRleGVzIGJ5IGhlaWdodCwgYW5kIGlzIHVzZWQgdG8gY29udmVydCBiZXR3ZWVuIGhlaWdodFxuICAvLyBhbmQgbGluZSBvYmplY3QsIGFuZCB0byBmaW5kIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIGRvY3VtZW50LlxuICAvL1xuICAvLyBTZWUgYWxzbyBodHRwOi8vbWFyaWpuaGF2ZXJiZWtlLm5sL2Jsb2cvY29kZW1pcnJvci1saW5lLXRyZWUuaHRtbFxuXG4gIGZ1bmN0aW9uIExlYWZDaHVuayhsaW5lcykge1xuICAgIHRoaXMubGluZXMgPSBsaW5lcztcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDAsIGhlaWdodCA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGluZXNbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgIGhlaWdodCArPSBsaW5lc1tpXS5oZWlnaHQ7XG4gICAgfVxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgTGVhZkNodW5rLnByb3RvdHlwZSA9IHtcbiAgICBjaHVua1NpemU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5saW5lcy5sZW5ndGg7IH0sXG4gICAgLy8gUmVtb3ZlIHRoZSBuIGxpbmVzIGF0IG9mZnNldCAnYXQnLlxuICAgIHJlbW92ZUlubmVyOiBmdW5jdGlvbihhdCwgbikge1xuICAgICAgZm9yICh2YXIgaSA9IGF0LCBlID0gYXQgKyBuOyBpIDwgZTsgKytpKSB7XG4gICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgdGhpcy5oZWlnaHQgLT0gbGluZS5oZWlnaHQ7XG4gICAgICAgIGNsZWFuVXBMaW5lKGxpbmUpO1xuICAgICAgICBzaWduYWxMYXRlcihsaW5lLCBcImRlbGV0ZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubGluZXMuc3BsaWNlKGF0LCBuKTtcbiAgICB9LFxuICAgIC8vIEhlbHBlciB1c2VkIHRvIGNvbGxhcHNlIGEgc21hbGwgYnJhbmNoIGludG8gYSBzaW5nbGUgbGVhZi5cbiAgICBjb2xsYXBzZTogZnVuY3Rpb24obGluZXMpIHtcbiAgICAgIGxpbmVzLnB1c2guYXBwbHkobGluZXMsIHRoaXMubGluZXMpO1xuICAgIH0sXG4gICAgLy8gSW5zZXJ0IHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lcyBhdCBvZmZzZXQgJ2F0JywgY291bnQgdGhlbSBhc1xuICAgIC8vIGhhdmluZyB0aGUgZ2l2ZW4gaGVpZ2h0LlxuICAgIGluc2VydElubmVyOiBmdW5jdGlvbihhdCwgbGluZXMsIGhlaWdodCkge1xuICAgICAgdGhpcy5oZWlnaHQgKz0gaGVpZ2h0O1xuICAgICAgdGhpcy5saW5lcyA9IHRoaXMubGluZXMuc2xpY2UoMCwgYXQpLmNvbmNhdChsaW5lcykuY29uY2F0KHRoaXMubGluZXMuc2xpY2UoYXQpKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIGxpbmVzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgfSxcbiAgICAvLyBVc2VkIHRvIGl0ZXJhdGUgb3ZlciBhIHBhcnQgb2YgdGhlIHRyZWUuXG4gICAgaXRlck46IGZ1bmN0aW9uKGF0LCBuLCBvcCkge1xuICAgICAgZm9yICh2YXIgZSA9IGF0ICsgbjsgYXQgPCBlOyArK2F0KVxuICAgICAgICBpZiAob3AodGhpcy5saW5lc1thdF0pKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gQnJhbmNoQ2h1bmsoY2hpbGRyZW4pIHtcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgdmFyIHNpemUgPSAwLCBoZWlnaHQgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBjaCA9IGNoaWxkcmVuW2ldO1xuICAgICAgc2l6ZSArPSBjaC5jaHVua1NpemUoKTsgaGVpZ2h0ICs9IGNoLmhlaWdodDtcbiAgICAgIGNoLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgQnJhbmNoQ2h1bmsucHJvdG90eXBlID0ge1xuICAgIGNodW5rU2l6ZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnNpemU7IH0sXG4gICAgcmVtb3ZlSW5uZXI6IGZ1bmN0aW9uKGF0LCBuKSB7XG4gICAgICB0aGlzLnNpemUgLT0gbjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldLCBzeiA9IGNoaWxkLmNodW5rU2l6ZSgpO1xuICAgICAgICBpZiAoYXQgPCBzeikge1xuICAgICAgICAgIHZhciBybSA9IE1hdGgubWluKG4sIHN6IC0gYXQpLCBvbGRIZWlnaHQgPSBjaGlsZC5oZWlnaHQ7XG4gICAgICAgICAgY2hpbGQucmVtb3ZlSW5uZXIoYXQsIHJtKTtcbiAgICAgICAgICB0aGlzLmhlaWdodCAtPSBvbGRIZWlnaHQgLSBjaGlsZC5oZWlnaHQ7XG4gICAgICAgICAgaWYgKHN6ID09IHJtKSB7IHRoaXMuY2hpbGRyZW4uc3BsaWNlKGktLSwgMSk7IGNoaWxkLnBhcmVudCA9IG51bGw7IH1cbiAgICAgICAgICBpZiAoKG4gLT0gcm0pID09IDApIGJyZWFrO1xuICAgICAgICAgIGF0ID0gMDtcbiAgICAgICAgfSBlbHNlIGF0IC09IHN6O1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlIHJlc3VsdCBpcyBzbWFsbGVyIHRoYW4gMjUgbGluZXMsIGVuc3VyZSB0aGF0IGl0IGlzIGFcbiAgICAgIC8vIHNpbmdsZSBsZWFmIG5vZGUuXG4gICAgICBpZiAodGhpcy5zaXplIC0gbiA8IDI1ICYmXG4gICAgICAgICAgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMSB8fCAhKHRoaXMuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBMZWFmQ2h1bmspKSkge1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb2xsYXBzZShsaW5lcyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbbmV3IExlYWZDaHVuayhsaW5lcyldO1xuICAgICAgICB0aGlzLmNoaWxkcmVuWzBdLnBhcmVudCA9IHRoaXM7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb2xsYXBzZTogZnVuY3Rpb24obGluZXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7ICsraSkgdGhpcy5jaGlsZHJlbltpXS5jb2xsYXBzZShsaW5lcyk7XG4gICAgfSxcbiAgICBpbnNlcnRJbm5lcjogZnVuY3Rpb24oYXQsIGxpbmVzLCBoZWlnaHQpIHtcbiAgICAgIHRoaXMuc2l6ZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB0aGlzLmhlaWdodCArPSBoZWlnaHQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXSwgc3ogPSBjaGlsZC5jaHVua1NpemUoKTtcbiAgICAgICAgaWYgKGF0IDw9IHN6KSB7XG4gICAgICAgICAgY2hpbGQuaW5zZXJ0SW5uZXIoYXQsIGxpbmVzLCBoZWlnaHQpO1xuICAgICAgICAgIGlmIChjaGlsZC5saW5lcyAmJiBjaGlsZC5saW5lcy5sZW5ndGggPiA1MCkge1xuICAgICAgICAgICAgd2hpbGUgKGNoaWxkLmxpbmVzLmxlbmd0aCA+IDUwKSB7XG4gICAgICAgICAgICAgIHZhciBzcGlsbGVkID0gY2hpbGQubGluZXMuc3BsaWNlKGNoaWxkLmxpbmVzLmxlbmd0aCAtIDI1LCAyNSk7XG4gICAgICAgICAgICAgIHZhciBuZXdsZWFmID0gbmV3IExlYWZDaHVuayhzcGlsbGVkKTtcbiAgICAgICAgICAgICAgY2hpbGQuaGVpZ2h0IC09IG5ld2xlYWYuaGVpZ2h0O1xuICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpICsgMSwgMCwgbmV3bGVhZik7XG4gICAgICAgICAgICAgIG5ld2xlYWYucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWF5YmVTcGlsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhdCAtPSBzejtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIFdoZW4gYSBub2RlIGhhcyBncm93biwgY2hlY2sgd2hldGhlciBpdCBzaG91bGQgYmUgc3BsaXQuXG4gICAgbWF5YmVTcGlsbDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPD0gMTApIHJldHVybjtcbiAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICBkbyB7XG4gICAgICAgIHZhciBzcGlsbGVkID0gbWUuY2hpbGRyZW4uc3BsaWNlKG1lLmNoaWxkcmVuLmxlbmd0aCAtIDUsIDUpO1xuICAgICAgICB2YXIgc2libGluZyA9IG5ldyBCcmFuY2hDaHVuayhzcGlsbGVkKTtcbiAgICAgICAgaWYgKCFtZS5wYXJlbnQpIHsgLy8gQmVjb21lIHRoZSBwYXJlbnQgbm9kZVxuICAgICAgICAgIHZhciBjb3B5ID0gbmV3IEJyYW5jaENodW5rKG1lLmNoaWxkcmVuKTtcbiAgICAgICAgICBjb3B5LnBhcmVudCA9IG1lO1xuICAgICAgICAgIG1lLmNoaWxkcmVuID0gW2NvcHksIHNpYmxpbmddO1xuICAgICAgICAgIG1lID0gY29weTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZS5zaXplIC09IHNpYmxpbmcuc2l6ZTtcbiAgICAgICAgICBtZS5oZWlnaHQgLT0gc2libGluZy5oZWlnaHQ7XG4gICAgICAgICAgdmFyIG15SW5kZXggPSBpbmRleE9mKG1lLnBhcmVudC5jaGlsZHJlbiwgbWUpO1xuICAgICAgICAgIG1lLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobXlJbmRleCArIDEsIDAsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHNpYmxpbmcucGFyZW50ID0gbWUucGFyZW50O1xuICAgICAgfSB3aGlsZSAobWUuY2hpbGRyZW4ubGVuZ3RoID4gMTApO1xuICAgICAgbWUucGFyZW50Lm1heWJlU3BpbGwoKTtcbiAgICB9LFxuICAgIGl0ZXJOOiBmdW5jdGlvbihhdCwgbiwgb3ApIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldLCBzeiA9IGNoaWxkLmNodW5rU2l6ZSgpO1xuICAgICAgICBpZiAoYXQgPCBzeikge1xuICAgICAgICAgIHZhciB1c2VkID0gTWF0aC5taW4obiwgc3ogLSBhdCk7XG4gICAgICAgICAgaWYgKGNoaWxkLml0ZXJOKGF0LCB1c2VkLCBvcCkpIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmICgobiAtPSB1c2VkKSA9PSAwKSBicmVhaztcbiAgICAgICAgICBhdCA9IDA7XG4gICAgICAgIH0gZWxzZSBhdCAtPSBzejtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIG5leHREb2NJZCA9IDA7XG4gIHZhciBEb2MgPSBDb2RlTWlycm9yLkRvYyA9IGZ1bmN0aW9uKHRleHQsIG1vZGUsIGZpcnN0TGluZSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEb2MpKSByZXR1cm4gbmV3IERvYyh0ZXh0LCBtb2RlLCBmaXJzdExpbmUpO1xuICAgIGlmIChmaXJzdExpbmUgPT0gbnVsbCkgZmlyc3RMaW5lID0gMDtcblxuICAgIEJyYW5jaENodW5rLmNhbGwodGhpcywgW25ldyBMZWFmQ2h1bmsoW25ldyBMaW5lKFwiXCIsIG51bGwpXSldKTtcbiAgICB0aGlzLmZpcnN0ID0gZmlyc3RMaW5lO1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxMZWZ0ID0gMDtcbiAgICB0aGlzLmNhbnRFZGl0ID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhbkdlbmVyYXRpb24gPSAxO1xuICAgIHRoaXMuZnJvbnRpZXIgPSBmaXJzdExpbmU7XG4gICAgdmFyIHN0YXJ0ID0gUG9zKGZpcnN0TGluZSwgMCk7XG4gICAgdGhpcy5zZWwgPSBzaW1wbGVTZWxlY3Rpb24oc3RhcnQpO1xuICAgIHRoaXMuaGlzdG9yeSA9IG5ldyBIaXN0b3J5KG51bGwpO1xuICAgIHRoaXMuaWQgPSArK25leHREb2NJZDtcbiAgICB0aGlzLm1vZGVPcHRpb24gPSBtb2RlO1xuXG4gICAgaWYgKHR5cGVvZiB0ZXh0ID09IFwic3RyaW5nXCIpIHRleHQgPSBzcGxpdExpbmVzKHRleHQpO1xuICAgIHVwZGF0ZURvYyh0aGlzLCB7ZnJvbTogc3RhcnQsIHRvOiBzdGFydCwgdGV4dDogdGV4dH0pO1xuICAgIHNldFNlbGVjdGlvbih0aGlzLCBzaW1wbGVTZWxlY3Rpb24oc3RhcnQpLCBzZWxfZG9udFNjcm9sbCk7XG4gIH07XG5cbiAgRG9jLnByb3RvdHlwZSA9IGNyZWF0ZU9iaihCcmFuY2hDaHVuay5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogRG9jLFxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgZG9jdW1lbnQuIFN1cHBvcnRzIHR3byBmb3JtcyAtLSB3aXRoIG9ubHkgb25lXG4gICAgLy8gYXJndW1lbnQsIGl0IGNhbGxzIHRoYXQgZm9yIGVhY2ggbGluZSBpbiB0aGUgZG9jdW1lbnQuIFdpdGhcbiAgICAvLyB0aHJlZSwgaXQgaXRlcmF0ZXMgb3ZlciB0aGUgcmFuZ2UgZ2l2ZW4gYnkgdGhlIGZpcnN0IHR3byAod2l0aFxuICAgIC8vIHRoZSBzZWNvbmQgYmVpbmcgbm9uLWluY2x1c2l2ZSkuXG4gICAgaXRlcjogZnVuY3Rpb24oZnJvbSwgdG8sIG9wKSB7XG4gICAgICBpZiAob3ApIHRoaXMuaXRlck4oZnJvbSAtIHRoaXMuZmlyc3QsIHRvIC0gZnJvbSwgb3ApO1xuICAgICAgZWxzZSB0aGlzLml0ZXJOKHRoaXMuZmlyc3QsIHRoaXMuZmlyc3QgKyB0aGlzLnNpemUsIGZyb20pO1xuICAgIH0sXG5cbiAgICAvLyBOb24tcHVibGljIGludGVyZmFjZSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBsaW5lcy5cbiAgICBpbnNlcnQ6IGZ1bmN0aW9uKGF0LCBsaW5lcykge1xuICAgICAgdmFyIGhlaWdodCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgKytpKSBoZWlnaHQgKz0gbGluZXNbaV0uaGVpZ2h0O1xuICAgICAgdGhpcy5pbnNlcnRJbm5lcihhdCAtIHRoaXMuZmlyc3QsIGxpbmVzLCBoZWlnaHQpO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihhdCwgbikgeyB0aGlzLnJlbW92ZUlubmVyKGF0IC0gdGhpcy5maXJzdCwgbik7IH0sXG5cbiAgICAvLyBGcm9tIGhlcmUsIHRoZSBtZXRob2RzIGFyZSBwYXJ0IG9mIHRoZSBwdWJsaWMgaW50ZXJmYWNlLiBNb3N0XG4gICAgLy8gYXJlIGFsc28gYXZhaWxhYmxlIGZyb20gQ29kZU1pcnJvciAoZWRpdG9yKSBpbnN0YW5jZXMuXG5cbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24obGluZVNlcCkge1xuICAgICAgdmFyIGxpbmVzID0gZ2V0TGluZXModGhpcywgdGhpcy5maXJzdCwgdGhpcy5maXJzdCArIHRoaXMuc2l6ZSk7XG4gICAgICBpZiAobGluZVNlcCA9PT0gZmFsc2UpIHJldHVybiBsaW5lcztcbiAgICAgIHJldHVybiBsaW5lcy5qb2luKGxpbmVTZXAgfHwgXCJcXG5cIik7XG4gICAgfSxcbiAgICBzZXRWYWx1ZTogZG9jTWV0aG9kT3AoZnVuY3Rpb24oY29kZSkge1xuICAgICAgdmFyIHRvcCA9IFBvcyh0aGlzLmZpcnN0LCAwKSwgbGFzdCA9IHRoaXMuZmlyc3QgKyB0aGlzLnNpemUgLSAxO1xuICAgICAgbWFrZUNoYW5nZSh0aGlzLCB7ZnJvbTogdG9wLCB0bzogUG9zKGxhc3QsIGdldExpbmUodGhpcywgbGFzdCkudGV4dC5sZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogc3BsaXRMaW5lcyhjb2RlKSwgb3JpZ2luOiBcInNldFZhbHVlXCJ9LCB0cnVlKTtcbiAgICAgIHNldFNlbGVjdGlvbih0aGlzLCBzaW1wbGVTZWxlY3Rpb24odG9wKSk7XG4gICAgfSksXG4gICAgcmVwbGFjZVJhbmdlOiBmdW5jdGlvbihjb2RlLCBmcm9tLCB0bywgb3JpZ2luKSB7XG4gICAgICBmcm9tID0gY2xpcFBvcyh0aGlzLCBmcm9tKTtcbiAgICAgIHRvID0gdG8gPyBjbGlwUG9zKHRoaXMsIHRvKSA6IGZyb207XG4gICAgICByZXBsYWNlUmFuZ2UodGhpcywgY29kZSwgZnJvbSwgdG8sIG9yaWdpbik7XG4gICAgfSxcbiAgICBnZXRSYW5nZTogZnVuY3Rpb24oZnJvbSwgdG8sIGxpbmVTZXApIHtcbiAgICAgIHZhciBsaW5lcyA9IGdldEJldHdlZW4odGhpcywgY2xpcFBvcyh0aGlzLCBmcm9tKSwgY2xpcFBvcyh0aGlzLCB0bykpO1xuICAgICAgaWYgKGxpbmVTZXAgPT09IGZhbHNlKSByZXR1cm4gbGluZXM7XG4gICAgICByZXR1cm4gbGluZXMuam9pbihsaW5lU2VwIHx8IFwiXFxuXCIpO1xuICAgIH0sXG5cbiAgICBnZXRMaW5lOiBmdW5jdGlvbihsaW5lKSB7dmFyIGwgPSB0aGlzLmdldExpbmVIYW5kbGUobGluZSk7IHJldHVybiBsICYmIGwudGV4dDt9LFxuXG4gICAgZ2V0TGluZUhhbmRsZTogZnVuY3Rpb24obGluZSkge2lmIChpc0xpbmUodGhpcywgbGluZSkpIHJldHVybiBnZXRMaW5lKHRoaXMsIGxpbmUpO30sXG4gICAgZ2V0TGluZU51bWJlcjogZnVuY3Rpb24obGluZSkge3JldHVybiBsaW5lTm8obGluZSk7fSxcblxuICAgIGdldExpbmVIYW5kbGVWaXN1YWxTdGFydDogZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lID09IFwibnVtYmVyXCIpIGxpbmUgPSBnZXRMaW5lKHRoaXMsIGxpbmUpO1xuICAgICAgcmV0dXJuIHZpc3VhbExpbmUobGluZSk7XG4gICAgfSxcblxuICAgIGxpbmVDb3VudDogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMuc2l6ZTt9LFxuICAgIGZpcnN0TGluZTogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMuZmlyc3Q7fSxcbiAgICBsYXN0TGluZTogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMuZmlyc3QgKyB0aGlzLnNpemUgLSAxO30sXG5cbiAgICBjbGlwUG9zOiBmdW5jdGlvbihwb3MpIHtyZXR1cm4gY2xpcFBvcyh0aGlzLCBwb3MpO30sXG5cbiAgICBnZXRDdXJzb3I6IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgICB2YXIgcmFuZ2UgPSB0aGlzLnNlbC5wcmltYXJ5KCksIHBvcztcbiAgICAgIGlmIChzdGFydCA9PSBudWxsIHx8IHN0YXJ0ID09IFwiaGVhZFwiKSBwb3MgPSByYW5nZS5oZWFkO1xuICAgICAgZWxzZSBpZiAoc3RhcnQgPT0gXCJhbmNob3JcIikgcG9zID0gcmFuZ2UuYW5jaG9yO1xuICAgICAgZWxzZSBpZiAoc3RhcnQgPT0gXCJlbmRcIiB8fCBzdGFydCA9PSBcInRvXCIgfHwgc3RhcnQgPT09IGZhbHNlKSBwb3MgPSByYW5nZS50bygpO1xuICAgICAgZWxzZSBwb3MgPSByYW5nZS5mcm9tKCk7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH0sXG4gICAgbGlzdFNlbGVjdGlvbnM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5zZWwucmFuZ2VzOyB9LFxuICAgIHNvbWV0aGluZ1NlbGVjdGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5zZWwuc29tZXRoaW5nU2VsZWN0ZWQoKTt9LFxuXG4gICAgc2V0Q3Vyc29yOiBkb2NNZXRob2RPcChmdW5jdGlvbihsaW5lLCBjaCwgb3B0aW9ucykge1xuICAgICAgc2V0U2ltcGxlU2VsZWN0aW9uKHRoaXMsIGNsaXBQb3ModGhpcywgdHlwZW9mIGxpbmUgPT0gXCJudW1iZXJcIiA/IFBvcyhsaW5lLCBjaCB8fCAwKSA6IGxpbmUpLCBudWxsLCBvcHRpb25zKTtcbiAgICB9KSxcbiAgICBzZXRTZWxlY3Rpb246IGRvY01ldGhvZE9wKGZ1bmN0aW9uKGFuY2hvciwgaGVhZCwgb3B0aW9ucykge1xuICAgICAgc2V0U2ltcGxlU2VsZWN0aW9uKHRoaXMsIGNsaXBQb3ModGhpcywgYW5jaG9yKSwgY2xpcFBvcyh0aGlzLCBoZWFkIHx8IGFuY2hvciksIG9wdGlvbnMpO1xuICAgIH0pLFxuICAgIGV4dGVuZFNlbGVjdGlvbjogZG9jTWV0aG9kT3AoZnVuY3Rpb24oaGVhZCwgb3RoZXIsIG9wdGlvbnMpIHtcbiAgICAgIGV4dGVuZFNlbGVjdGlvbih0aGlzLCBjbGlwUG9zKHRoaXMsIGhlYWQpLCBvdGhlciAmJiBjbGlwUG9zKHRoaXMsIG90aGVyKSwgb3B0aW9ucyk7XG4gICAgfSksXG4gICAgZXh0ZW5kU2VsZWN0aW9uczogZG9jTWV0aG9kT3AoZnVuY3Rpb24oaGVhZHMsIG9wdGlvbnMpIHtcbiAgICAgIGV4dGVuZFNlbGVjdGlvbnModGhpcywgY2xpcFBvc0FycmF5KHRoaXMsIGhlYWRzLCBvcHRpb25zKSk7XG4gICAgfSksXG4gICAgZXh0ZW5kU2VsZWN0aW9uc0J5OiBkb2NNZXRob2RPcChmdW5jdGlvbihmLCBvcHRpb25zKSB7XG4gICAgICBleHRlbmRTZWxlY3Rpb25zKHRoaXMsIG1hcCh0aGlzLnNlbC5yYW5nZXMsIGYpLCBvcHRpb25zKTtcbiAgICB9KSxcbiAgICBzZXRTZWxlY3Rpb25zOiBkb2NNZXRob2RPcChmdW5jdGlvbihyYW5nZXMsIHByaW1hcnksIG9wdGlvbnMpIHtcbiAgICAgIGlmICghcmFuZ2VzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG91dCA9IFtdOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSsrKVxuICAgICAgICBvdXRbaV0gPSBuZXcgUmFuZ2UoY2xpcFBvcyh0aGlzLCByYW5nZXNbaV0uYW5jaG9yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBQb3ModGhpcywgcmFuZ2VzW2ldLmhlYWQpKTtcbiAgICAgIGlmIChwcmltYXJ5ID09IG51bGwpIHByaW1hcnkgPSBNYXRoLm1pbihyYW5nZXMubGVuZ3RoIC0gMSwgdGhpcy5zZWwucHJpbUluZGV4KTtcbiAgICAgIHNldFNlbGVjdGlvbih0aGlzLCBub3JtYWxpemVTZWxlY3Rpb24ob3V0LCBwcmltYXJ5KSwgb3B0aW9ucyk7XG4gICAgfSksXG4gICAgYWRkU2VsZWN0aW9uOiBkb2NNZXRob2RPcChmdW5jdGlvbihhbmNob3IsIGhlYWQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByYW5nZXMgPSB0aGlzLnNlbC5yYW5nZXMuc2xpY2UoMCk7XG4gICAgICByYW5nZXMucHVzaChuZXcgUmFuZ2UoY2xpcFBvcyh0aGlzLCBhbmNob3IpLCBjbGlwUG9zKHRoaXMsIGhlYWQgfHwgYW5jaG9yKSkpO1xuICAgICAgc2V0U2VsZWN0aW9uKHRoaXMsIG5vcm1hbGl6ZVNlbGVjdGlvbihyYW5nZXMsIHJhbmdlcy5sZW5ndGggLSAxKSwgb3B0aW9ucyk7XG4gICAgfSksXG5cbiAgICBnZXRTZWxlY3Rpb246IGZ1bmN0aW9uKGxpbmVTZXApIHtcbiAgICAgIHZhciByYW5nZXMgPSB0aGlzLnNlbC5yYW5nZXMsIGxpbmVzO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNlbCA9IGdldEJldHdlZW4odGhpcywgcmFuZ2VzW2ldLmZyb20oKSwgcmFuZ2VzW2ldLnRvKCkpO1xuICAgICAgICBsaW5lcyA9IGxpbmVzID8gbGluZXMuY29uY2F0KHNlbCkgOiBzZWw7XG4gICAgICB9XG4gICAgICBpZiAobGluZVNlcCA9PT0gZmFsc2UpIHJldHVybiBsaW5lcztcbiAgICAgIGVsc2UgcmV0dXJuIGxpbmVzLmpvaW4obGluZVNlcCB8fCBcIlxcblwiKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdGlvbnM6IGZ1bmN0aW9uKGxpbmVTZXApIHtcbiAgICAgIHZhciBwYXJ0cyA9IFtdLCByYW5nZXMgPSB0aGlzLnNlbC5yYW5nZXM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2VsID0gZ2V0QmV0d2Vlbih0aGlzLCByYW5nZXNbaV0uZnJvbSgpLCByYW5nZXNbaV0udG8oKSk7XG4gICAgICAgIGlmIChsaW5lU2VwICE9PSBmYWxzZSkgc2VsID0gc2VsLmpvaW4obGluZVNlcCB8fCBcIlxcblwiKTtcbiAgICAgICAgcGFydHNbaV0gPSBzZWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFydHM7XG4gICAgfSxcbiAgICByZXBsYWNlU2VsZWN0aW9uOiBmdW5jdGlvbihjb2RlLCBjb2xsYXBzZSwgb3JpZ2luKSB7XG4gICAgICB2YXIgZHVwID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsLnJhbmdlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgZHVwW2ldID0gY29kZTtcbiAgICAgIHRoaXMucmVwbGFjZVNlbGVjdGlvbnMoZHVwLCBjb2xsYXBzZSwgb3JpZ2luIHx8IFwiK2lucHV0XCIpO1xuICAgIH0sXG4gICAgcmVwbGFjZVNlbGVjdGlvbnM6IGRvY01ldGhvZE9wKGZ1bmN0aW9uKGNvZGUsIGNvbGxhcHNlLCBvcmlnaW4pIHtcbiAgICAgIHZhciBjaGFuZ2VzID0gW10sIHNlbCA9IHRoaXMuc2VsO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWwucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByYW5nZSA9IHNlbC5yYW5nZXNbaV07XG4gICAgICAgIGNoYW5nZXNbaV0gPSB7ZnJvbTogcmFuZ2UuZnJvbSgpLCB0bzogcmFuZ2UudG8oKSwgdGV4dDogc3BsaXRMaW5lcyhjb2RlW2ldKSwgb3JpZ2luOiBvcmlnaW59O1xuICAgICAgfVxuICAgICAgdmFyIG5ld1NlbCA9IGNvbGxhcHNlICYmIGNvbGxhcHNlICE9IFwiZW5kXCIgJiYgY29tcHV0ZVJlcGxhY2VkU2VsKHRoaXMsIGNoYW5nZXMsIGNvbGxhcHNlKTtcbiAgICAgIGZvciAodmFyIGkgPSBjaGFuZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICBtYWtlQ2hhbmdlKHRoaXMsIGNoYW5nZXNbaV0pO1xuICAgICAgaWYgKG5ld1NlbCkgc2V0U2VsZWN0aW9uUmVwbGFjZUhpc3RvcnkodGhpcywgbmV3U2VsKTtcbiAgICAgIGVsc2UgaWYgKHRoaXMuY20pIGVuc3VyZUN1cnNvclZpc2libGUodGhpcy5jbSk7XG4gICAgfSksXG4gICAgdW5kbzogZG9jTWV0aG9kT3AoZnVuY3Rpb24oKSB7bWFrZUNoYW5nZUZyb21IaXN0b3J5KHRoaXMsIFwidW5kb1wiKTt9KSxcbiAgICByZWRvOiBkb2NNZXRob2RPcChmdW5jdGlvbigpIHttYWtlQ2hhbmdlRnJvbUhpc3RvcnkodGhpcywgXCJyZWRvXCIpO30pLFxuICAgIHVuZG9TZWxlY3Rpb246IGRvY01ldGhvZE9wKGZ1bmN0aW9uKCkge21ha2VDaGFuZ2VGcm9tSGlzdG9yeSh0aGlzLCBcInVuZG9cIiwgdHJ1ZSk7fSksXG4gICAgcmVkb1NlbGVjdGlvbjogZG9jTWV0aG9kT3AoZnVuY3Rpb24oKSB7bWFrZUNoYW5nZUZyb21IaXN0b3J5KHRoaXMsIFwicmVkb1wiLCB0cnVlKTt9KSxcblxuICAgIHNldEV4dGVuZGluZzogZnVuY3Rpb24odmFsKSB7dGhpcy5leHRlbmQgPSB2YWw7fSxcbiAgICBnZXRFeHRlbmRpbmc6IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLmV4dGVuZDt9LFxuXG4gICAgaGlzdG9yeVNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhpc3QgPSB0aGlzLmhpc3RvcnksIGRvbmUgPSAwLCB1bmRvbmUgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaXN0LmRvbmUubGVuZ3RoOyBpKyspIGlmICghaGlzdC5kb25lW2ldLnJhbmdlcykgKytkb25lO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaXN0LnVuZG9uZS5sZW5ndGg7IGkrKykgaWYgKCFoaXN0LnVuZG9uZVtpXS5yYW5nZXMpICsrdW5kb25lO1xuICAgICAgcmV0dXJuIHt1bmRvOiBkb25lLCByZWRvOiB1bmRvbmV9O1xuICAgIH0sXG4gICAgY2xlYXJIaXN0b3J5OiBmdW5jdGlvbigpIHt0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzLmhpc3RvcnkubWF4R2VuZXJhdGlvbik7fSxcblxuICAgIG1hcmtDbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNsZWFuR2VuZXJhdGlvbiA9IHRoaXMuY2hhbmdlR2VuZXJhdGlvbih0cnVlKTtcbiAgICB9LFxuICAgIGNoYW5nZUdlbmVyYXRpb246IGZ1bmN0aW9uKGZvcmNlU3BsaXQpIHtcbiAgICAgIGlmIChmb3JjZVNwbGl0KVxuICAgICAgICB0aGlzLmhpc3RvcnkubGFzdE9wID0gdGhpcy5oaXN0b3J5Lmxhc3RPcmlnaW4gPSBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5nZW5lcmF0aW9uO1xuICAgIH0sXG4gICAgaXNDbGVhbjogZnVuY3Rpb24gKGdlbikge1xuICAgICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5nZW5lcmF0aW9uID09IChnZW4gfHwgdGhpcy5jbGVhbkdlbmVyYXRpb24pO1xuICAgIH0sXG5cbiAgICBnZXRIaXN0b3J5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7ZG9uZTogY29weUhpc3RvcnlBcnJheSh0aGlzLmhpc3RvcnkuZG9uZSksXG4gICAgICAgICAgICAgIHVuZG9uZTogY29weUhpc3RvcnlBcnJheSh0aGlzLmhpc3RvcnkudW5kb25lKX07XG4gICAgfSxcbiAgICBzZXRIaXN0b3J5OiBmdW5jdGlvbihoaXN0RGF0YSkge1xuICAgICAgdmFyIGhpc3QgPSB0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzLmhpc3RvcnkubWF4R2VuZXJhdGlvbik7XG4gICAgICBoaXN0LmRvbmUgPSBjb3B5SGlzdG9yeUFycmF5KGhpc3REYXRhLmRvbmUuc2xpY2UoMCksIG51bGwsIHRydWUpO1xuICAgICAgaGlzdC51bmRvbmUgPSBjb3B5SGlzdG9yeUFycmF5KGhpc3REYXRhLnVuZG9uZS5zbGljZSgwKSwgbnVsbCwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIG1hcmtUZXh0OiBmdW5jdGlvbihmcm9tLCB0bywgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG1hcmtUZXh0KHRoaXMsIGNsaXBQb3ModGhpcywgZnJvbSksIGNsaXBQb3ModGhpcywgdG8pLCBvcHRpb25zLCBcInJhbmdlXCIpO1xuICAgIH0sXG4gICAgc2V0Qm9va21hcms6IGZ1bmN0aW9uKHBvcywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlYWxPcHRzID0ge3JlcGxhY2VkV2l0aDogb3B0aW9ucyAmJiAob3B0aW9ucy5ub2RlVHlwZSA9PSBudWxsID8gb3B0aW9ucy53aWRnZXQgOiBvcHRpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRMZWZ0OiBvcHRpb25zICYmIG9wdGlvbnMuaW5zZXJ0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICBjbGVhcldoZW5FbXB0eTogZmFsc2UsIHNoYXJlZDogb3B0aW9ucyAmJiBvcHRpb25zLnNoYXJlZH07XG4gICAgICBwb3MgPSBjbGlwUG9zKHRoaXMsIHBvcyk7XG4gICAgICByZXR1cm4gbWFya1RleHQodGhpcywgcG9zLCBwb3MsIHJlYWxPcHRzLCBcImJvb2ttYXJrXCIpO1xuICAgIH0sXG4gICAgZmluZE1hcmtzQXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgcG9zID0gY2xpcFBvcyh0aGlzLCBwb3MpO1xuICAgICAgdmFyIG1hcmtlcnMgPSBbXSwgc3BhbnMgPSBnZXRMaW5lKHRoaXMsIHBvcy5saW5lKS5tYXJrZWRTcGFucztcbiAgICAgIGlmIChzcGFucykgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuICAgICAgICBpZiAoKHNwYW4uZnJvbSA9PSBudWxsIHx8IHNwYW4uZnJvbSA8PSBwb3MuY2gpICYmXG4gICAgICAgICAgICAoc3Bhbi50byA9PSBudWxsIHx8IHNwYW4udG8gPj0gcG9zLmNoKSlcbiAgICAgICAgICBtYXJrZXJzLnB1c2goc3Bhbi5tYXJrZXIucGFyZW50IHx8IHNwYW4ubWFya2VyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXJrZXJzO1xuICAgIH0sXG4gICAgZmluZE1hcmtzOiBmdW5jdGlvbihmcm9tLCB0bywgZmlsdGVyKSB7XG4gICAgICBmcm9tID0gY2xpcFBvcyh0aGlzLCBmcm9tKTsgdG8gPSBjbGlwUG9zKHRoaXMsIHRvKTtcbiAgICAgIHZhciBmb3VuZCA9IFtdLCBsaW5lTm8gPSBmcm9tLmxpbmU7XG4gICAgICB0aGlzLml0ZXIoZnJvbS5saW5lLCB0by5saW5lICsgMSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICB2YXIgc3BhbnMgPSBsaW5lLm1hcmtlZFNwYW5zO1xuICAgICAgICBpZiAoc3BhbnMpIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuICAgICAgICAgIGlmICghKGxpbmVObyA9PSBmcm9tLmxpbmUgJiYgZnJvbS5jaCA+IHNwYW4udG8gfHxcbiAgICAgICAgICAgICAgICBzcGFuLmZyb20gPT0gbnVsbCAmJiBsaW5lTm8gIT0gZnJvbS5saW5lfHxcbiAgICAgICAgICAgICAgICBsaW5lTm8gPT0gdG8ubGluZSAmJiBzcGFuLmZyb20gPiB0by5jaCkgJiZcbiAgICAgICAgICAgICAgKCFmaWx0ZXIgfHwgZmlsdGVyKHNwYW4ubWFya2VyKSkpXG4gICAgICAgICAgICBmb3VuZC5wdXNoKHNwYW4ubWFya2VyLnBhcmVudCB8fCBzcGFuLm1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgKytsaW5lTm87XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9LFxuICAgIGdldEFsbE1hcmtzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtYXJrZXJzID0gW107XG4gICAgICB0aGlzLml0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICB2YXIgc3BzID0gbGluZS5tYXJrZWRTcGFucztcbiAgICAgICAgaWYgKHNwcykgZm9yICh2YXIgaSA9IDA7IGkgPCBzcHMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgaWYgKHNwc1tpXS5mcm9tICE9IG51bGwpIG1hcmtlcnMucHVzaChzcHNbaV0ubWFya2VyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1hcmtlcnM7XG4gICAgfSxcblxuICAgIHBvc0Zyb21JbmRleDogZnVuY3Rpb24ob2ZmKSB7XG4gICAgICB2YXIgY2gsIGxpbmVObyA9IHRoaXMuZmlyc3Q7XG4gICAgICB0aGlzLml0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICB2YXIgc3ogPSBsaW5lLnRleHQubGVuZ3RoICsgMTtcbiAgICAgICAgaWYgKHN6ID4gb2ZmKSB7IGNoID0gb2ZmOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBvZmYgLT0gc3o7XG4gICAgICAgICsrbGluZU5vO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2xpcFBvcyh0aGlzLCBQb3MobGluZU5vLCBjaCkpO1xuICAgIH0sXG4gICAgaW5kZXhGcm9tUG9zOiBmdW5jdGlvbiAoY29vcmRzKSB7XG4gICAgICBjb29yZHMgPSBjbGlwUG9zKHRoaXMsIGNvb3Jkcyk7XG4gICAgICB2YXIgaW5kZXggPSBjb29yZHMuY2g7XG4gICAgICBpZiAoY29vcmRzLmxpbmUgPCB0aGlzLmZpcnN0IHx8IGNvb3Jkcy5jaCA8IDApIHJldHVybiAwO1xuICAgICAgdGhpcy5pdGVyKHRoaXMuZmlyc3QsIGNvb3Jkcy5saW5lLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICBpbmRleCArPSBsaW5lLnRleHQubGVuZ3RoICsgMTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbihjb3B5SGlzdG9yeSkge1xuICAgICAgdmFyIGRvYyA9IG5ldyBEb2MoZ2V0TGluZXModGhpcywgdGhpcy5maXJzdCwgdGhpcy5maXJzdCArIHRoaXMuc2l6ZSksIHRoaXMubW9kZU9wdGlvbiwgdGhpcy5maXJzdCk7XG4gICAgICBkb2Muc2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3A7IGRvYy5zY3JvbGxMZWZ0ID0gdGhpcy5zY3JvbGxMZWZ0O1xuICAgICAgZG9jLnNlbCA9IHRoaXMuc2VsO1xuICAgICAgZG9jLmV4dGVuZCA9IGZhbHNlO1xuICAgICAgaWYgKGNvcHlIaXN0b3J5KSB7XG4gICAgICAgIGRvYy5oaXN0b3J5LnVuZG9EZXB0aCA9IHRoaXMuaGlzdG9yeS51bmRvRGVwdGg7XG4gICAgICAgIGRvYy5zZXRIaXN0b3J5KHRoaXMuZ2V0SGlzdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkb2M7XG4gICAgfSxcblxuICAgIGxpbmtlZERvYzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgICB2YXIgZnJvbSA9IHRoaXMuZmlyc3QsIHRvID0gdGhpcy5maXJzdCArIHRoaXMuc2l6ZTtcbiAgICAgIGlmIChvcHRpb25zLmZyb20gIT0gbnVsbCAmJiBvcHRpb25zLmZyb20gPiBmcm9tKSBmcm9tID0gb3B0aW9ucy5mcm9tO1xuICAgICAgaWYgKG9wdGlvbnMudG8gIT0gbnVsbCAmJiBvcHRpb25zLnRvIDwgdG8pIHRvID0gb3B0aW9ucy50bztcbiAgICAgIHZhciBjb3B5ID0gbmV3IERvYyhnZXRMaW5lcyh0aGlzLCBmcm9tLCB0byksIG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVPcHRpb24sIGZyb20pO1xuICAgICAgaWYgKG9wdGlvbnMuc2hhcmVkSGlzdCkgY29weS5oaXN0b3J5ID0gdGhpcy5oaXN0b3J5O1xuICAgICAgKHRoaXMubGlua2VkIHx8ICh0aGlzLmxpbmtlZCA9IFtdKSkucHVzaCh7ZG9jOiBjb3B5LCBzaGFyZWRIaXN0OiBvcHRpb25zLnNoYXJlZEhpc3R9KTtcbiAgICAgIGNvcHkubGlua2VkID0gW3tkb2M6IHRoaXMsIGlzUGFyZW50OiB0cnVlLCBzaGFyZWRIaXN0OiBvcHRpb25zLnNoYXJlZEhpc3R9XTtcbiAgICAgIGNvcHlTaGFyZWRNYXJrZXJzKGNvcHksIGZpbmRTaGFyZWRNYXJrZXJzKHRoaXMpKTtcbiAgICAgIHJldHVybiBjb3B5O1xuICAgIH0sXG4gICAgdW5saW5rRG9jOiBmdW5jdGlvbihvdGhlcikge1xuICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgQ29kZU1pcnJvcikgb3RoZXIgPSBvdGhlci5kb2M7XG4gICAgICBpZiAodGhpcy5saW5rZWQpIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5rZWQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGxpbmsgPSB0aGlzLmxpbmtlZFtpXTtcbiAgICAgICAgaWYgKGxpbmsuZG9jICE9IG90aGVyKSBjb250aW51ZTtcbiAgICAgICAgdGhpcy5saW5rZWQuc3BsaWNlKGksIDEpO1xuICAgICAgICBvdGhlci51bmxpbmtEb2ModGhpcyk7XG4gICAgICAgIGRldGFjaFNoYXJlZE1hcmtlcnMoZmluZFNoYXJlZE1hcmtlcnModGhpcykpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIElmIHRoZSBoaXN0b3JpZXMgd2VyZSBzaGFyZWQsIHNwbGl0IHRoZW0gYWdhaW5cbiAgICAgIGlmIChvdGhlci5oaXN0b3J5ID09IHRoaXMuaGlzdG9yeSkge1xuICAgICAgICB2YXIgc3BsaXRJZHMgPSBbb3RoZXIuaWRdO1xuICAgICAgICBsaW5rZWREb2NzKG90aGVyLCBmdW5jdGlvbihkb2MpIHtzcGxpdElkcy5wdXNoKGRvYy5pZCk7fSwgdHJ1ZSk7XG4gICAgICAgIG90aGVyLmhpc3RvcnkgPSBuZXcgSGlzdG9yeShudWxsKTtcbiAgICAgICAgb3RoZXIuaGlzdG9yeS5kb25lID0gY29weUhpc3RvcnlBcnJheSh0aGlzLmhpc3RvcnkuZG9uZSwgc3BsaXRJZHMpO1xuICAgICAgICBvdGhlci5oaXN0b3J5LnVuZG9uZSA9IGNvcHlIaXN0b3J5QXJyYXkodGhpcy5oaXN0b3J5LnVuZG9uZSwgc3BsaXRJZHMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaXRlckxpbmtlZERvY3M6IGZ1bmN0aW9uKGYpIHtsaW5rZWREb2NzKHRoaXMsIGYpO30sXG5cbiAgICBnZXRNb2RlOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5tb2RlO30sXG4gICAgZ2V0RWRpdG9yOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5jbTt9XG4gIH0pO1xuXG4gIC8vIFB1YmxpYyBhbGlhcy5cbiAgRG9jLnByb3RvdHlwZS5lYWNoTGluZSA9IERvYy5wcm90b3R5cGUuaXRlcjtcblxuICAvLyBTZXQgdXAgbWV0aG9kcyBvbiBDb2RlTWlycm9yJ3MgcHJvdG90eXBlIHRvIHJlZGlyZWN0IHRvIHRoZSBlZGl0b3IncyBkb2N1bWVudC5cbiAgdmFyIGRvbnREZWxlZ2F0ZSA9IFwiaXRlciBpbnNlcnQgcmVtb3ZlIGNvcHkgZ2V0RWRpdG9yXCIuc3BsaXQoXCIgXCIpO1xuICBmb3IgKHZhciBwcm9wIGluIERvYy5wcm90b3R5cGUpIGlmIChEb2MucHJvdG90eXBlLmhhc093blByb3BlcnR5KHByb3ApICYmIGluZGV4T2YoZG9udERlbGVnYXRlLCBwcm9wKSA8IDApXG4gICAgQ29kZU1pcnJvci5wcm90b3R5cGVbcHJvcF0gPSAoZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7cmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLmRvYywgYXJndW1lbnRzKTt9O1xuICAgIH0pKERvYy5wcm90b3R5cGVbcHJvcF0pO1xuXG4gIGV2ZW50TWl4aW4oRG9jKTtcblxuICAvLyBDYWxsIGYgZm9yIGFsbCBsaW5rZWQgZG9jdW1lbnRzLlxuICBmdW5jdGlvbiBsaW5rZWREb2NzKGRvYywgZiwgc2hhcmVkSGlzdE9ubHkpIHtcbiAgICBmdW5jdGlvbiBwcm9wYWdhdGUoZG9jLCBza2lwLCBzaGFyZWRIaXN0KSB7XG4gICAgICBpZiAoZG9jLmxpbmtlZCkgZm9yICh2YXIgaSA9IDA7IGkgPCBkb2MubGlua2VkLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciByZWwgPSBkb2MubGlua2VkW2ldO1xuICAgICAgICBpZiAocmVsLmRvYyA9PSBza2lwKSBjb250aW51ZTtcbiAgICAgICAgdmFyIHNoYXJlZCA9IHNoYXJlZEhpc3QgJiYgcmVsLnNoYXJlZEhpc3Q7XG4gICAgICAgIGlmIChzaGFyZWRIaXN0T25seSAmJiAhc2hhcmVkKSBjb250aW51ZTtcbiAgICAgICAgZihyZWwuZG9jLCBzaGFyZWQpO1xuICAgICAgICBwcm9wYWdhdGUocmVsLmRvYywgZG9jLCBzaGFyZWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBwcm9wYWdhdGUoZG9jLCBudWxsLCB0cnVlKTtcbiAgfVxuXG4gIC8vIEF0dGFjaCBhIGRvY3VtZW50IHRvIGFuIGVkaXRvci5cbiAgZnVuY3Rpb24gYXR0YWNoRG9jKGNtLCBkb2MpIHtcbiAgICBpZiAoZG9jLmNtKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRvY3VtZW50IGlzIGFscmVhZHkgaW4gdXNlLlwiKTtcbiAgICBjbS5kb2MgPSBkb2M7XG4gICAgZG9jLmNtID0gY207XG4gICAgZXN0aW1hdGVMaW5lSGVpZ2h0cyhjbSk7XG4gICAgbG9hZE1vZGUoY20pO1xuICAgIGlmICghY20ub3B0aW9ucy5saW5lV3JhcHBpbmcpIGZpbmRNYXhMaW5lKGNtKTtcbiAgICBjbS5vcHRpb25zLm1vZGUgPSBkb2MubW9kZU9wdGlvbjtcbiAgICByZWdDaGFuZ2UoY20pO1xuICB9XG5cbiAgLy8gTElORSBVVElMSVRJRVNcblxuICAvLyBGaW5kIHRoZSBsaW5lIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBsaW5lIG51bWJlci5cbiAgZnVuY3Rpb24gZ2V0TGluZShkb2MsIG4pIHtcbiAgICBuIC09IGRvYy5maXJzdDtcbiAgICBpZiAobiA8IDAgfHwgbiA+PSBkb2Muc2l6ZSkgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gbGluZSBcIiArIChuICsgZG9jLmZpcnN0KSArIFwiIGluIHRoZSBkb2N1bWVudC5cIik7XG4gICAgZm9yICh2YXIgY2h1bmsgPSBkb2M7ICFjaHVuay5saW5lczspIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOzsgKytpKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGNodW5rLmNoaWxkcmVuW2ldLCBzeiA9IGNoaWxkLmNodW5rU2l6ZSgpO1xuICAgICAgICBpZiAobiA8IHN6KSB7IGNodW5rID0gY2hpbGQ7IGJyZWFrOyB9XG4gICAgICAgIG4gLT0gc3o7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaHVuay5saW5lc1tuXTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgcGFydCBvZiBhIGRvY3VtZW50IGJldHdlZW4gdHdvIHBvc2l0aW9ucywgYXMgYW4gYXJyYXkgb2ZcbiAgLy8gc3RyaW5ncy5cbiAgZnVuY3Rpb24gZ2V0QmV0d2Vlbihkb2MsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgb3V0ID0gW10sIG4gPSBzdGFydC5saW5lO1xuICAgIGRvYy5pdGVyKHN0YXJ0LmxpbmUsIGVuZC5saW5lICsgMSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHRleHQgPSBsaW5lLnRleHQ7XG4gICAgICBpZiAobiA9PSBlbmQubGluZSkgdGV4dCA9IHRleHQuc2xpY2UoMCwgZW5kLmNoKTtcbiAgICAgIGlmIChuID09IHN0YXJ0LmxpbmUpIHRleHQgPSB0ZXh0LnNsaWNlKHN0YXJ0LmNoKTtcbiAgICAgIG91dC5wdXNoKHRleHQpO1xuICAgICAgKytuO1xuICAgIH0pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLy8gR2V0IHRoZSBsaW5lcyBiZXR3ZWVuIGZyb20gYW5kIHRvLCBhcyBhcnJheSBvZiBzdHJpbmdzLlxuICBmdW5jdGlvbiBnZXRMaW5lcyhkb2MsIGZyb20sIHRvKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGRvYy5pdGVyKGZyb20sIHRvLCBmdW5jdGlvbihsaW5lKSB7IG91dC5wdXNoKGxpbmUudGV4dCk7IH0pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIGhlaWdodCBvZiBhIGxpbmUsIHByb3BhZ2F0aW5nIHRoZSBoZWlnaHQgY2hhbmdlXG4gIC8vIHVwd2FyZHMgdG8gcGFyZW50IG5vZGVzLlxuICBmdW5jdGlvbiB1cGRhdGVMaW5lSGVpZ2h0KGxpbmUsIGhlaWdodCkge1xuICAgIHZhciBkaWZmID0gaGVpZ2h0IC0gbGluZS5oZWlnaHQ7XG4gICAgaWYgKGRpZmYpIGZvciAodmFyIG4gPSBsaW5lOyBuOyBuID0gbi5wYXJlbnQpIG4uaGVpZ2h0ICs9IGRpZmY7XG4gIH1cblxuICAvLyBHaXZlbiBhIGxpbmUgb2JqZWN0LCBmaW5kIGl0cyBsaW5lIG51bWJlciBieSB3YWxraW5nIHVwIHRocm91Z2hcbiAgLy8gaXRzIHBhcmVudCBsaW5rcy5cbiAgZnVuY3Rpb24gbGluZU5vKGxpbmUpIHtcbiAgICBpZiAobGluZS5wYXJlbnQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIGN1ciA9IGxpbmUucGFyZW50LCBubyA9IGluZGV4T2YoY3VyLmxpbmVzLCBsaW5lKTtcbiAgICBmb3IgKHZhciBjaHVuayA9IGN1ci5wYXJlbnQ7IGNodW5rOyBjdXIgPSBjaHVuaywgY2h1bmsgPSBjaHVuay5wYXJlbnQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOzsgKytpKSB7XG4gICAgICAgIGlmIChjaHVuay5jaGlsZHJlbltpXSA9PSBjdXIpIGJyZWFrO1xuICAgICAgICBubyArPSBjaHVuay5jaGlsZHJlbltpXS5jaHVua1NpemUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vICsgY3VyLmZpcnN0O1xuICB9XG5cbiAgLy8gRmluZCB0aGUgbGluZSBhdCB0aGUgZ2l2ZW4gdmVydGljYWwgcG9zaXRpb24sIHVzaW5nIHRoZSBoZWlnaHRcbiAgLy8gaW5mb3JtYXRpb24gaW4gdGhlIGRvY3VtZW50IHRyZWUuXG4gIGZ1bmN0aW9uIGxpbmVBdEhlaWdodChjaHVuaywgaCkge1xuICAgIHZhciBuID0gY2h1bmsuZmlyc3Q7XG4gICAgb3V0ZXI6IGRvIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmsuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2h1bmsuY2hpbGRyZW5baV0sIGNoID0gY2hpbGQuaGVpZ2h0O1xuICAgICAgICBpZiAoaCA8IGNoKSB7IGNodW5rID0gY2hpbGQ7IGNvbnRpbnVlIG91dGVyOyB9XG4gICAgICAgIGggLT0gY2g7XG4gICAgICAgIG4gKz0gY2hpbGQuY2h1bmtTaXplKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9IHdoaWxlICghY2h1bmsubGluZXMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmsubGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBsaW5lID0gY2h1bmsubGluZXNbaV0sIGxoID0gbGluZS5oZWlnaHQ7XG4gICAgICBpZiAoaCA8IGxoKSBicmVhaztcbiAgICAgIGggLT0gbGg7XG4gICAgfVxuICAgIHJldHVybiBuICsgaTtcbiAgfVxuXG5cbiAgLy8gRmluZCB0aGUgaGVpZ2h0IGFib3ZlIHRoZSBnaXZlbiBsaW5lLlxuICBmdW5jdGlvbiBoZWlnaHRBdExpbmUobGluZU9iaikge1xuICAgIGxpbmVPYmogPSB2aXN1YWxMaW5lKGxpbmVPYmopO1xuXG4gICAgdmFyIGggPSAwLCBjaHVuayA9IGxpbmVPYmoucGFyZW50O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmsubGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBsaW5lID0gY2h1bmsubGluZXNbaV07XG4gICAgICBpZiAobGluZSA9PSBsaW5lT2JqKSBicmVhaztcbiAgICAgIGVsc2UgaCArPSBsaW5lLmhlaWdodDtcbiAgICB9XG4gICAgZm9yICh2YXIgcCA9IGNodW5rLnBhcmVudDsgcDsgY2h1bmsgPSBwLCBwID0gY2h1bmsucGFyZW50KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHAuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGN1ciA9IHAuY2hpbGRyZW5baV07XG4gICAgICAgIGlmIChjdXIgPT0gY2h1bmspIGJyZWFrO1xuICAgICAgICBlbHNlIGggKz0gY3VyLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGg7XG4gIH1cblxuICAvLyBHZXQgdGhlIGJpZGkgb3JkZXJpbmcgZm9yIHRoZSBnaXZlbiBsaW5lIChhbmQgY2FjaGUgaXQpLiBSZXR1cm5zXG4gIC8vIGZhbHNlIGZvciBsaW5lcyB0aGF0IGFyZSBmdWxseSBsZWZ0LXRvLXJpZ2h0LCBhbmQgYW4gYXJyYXkgb2ZcbiAgLy8gQmlkaVNwYW4gb2JqZWN0cyBvdGhlcndpc2UuXG4gIGZ1bmN0aW9uIGdldE9yZGVyKGxpbmUpIHtcbiAgICB2YXIgb3JkZXIgPSBsaW5lLm9yZGVyO1xuICAgIGlmIChvcmRlciA9PSBudWxsKSBvcmRlciA9IGxpbmUub3JkZXIgPSBiaWRpT3JkZXJpbmcobGluZS50ZXh0KTtcbiAgICByZXR1cm4gb3JkZXI7XG4gIH1cblxuICAvLyBISVNUT1JZXG5cbiAgZnVuY3Rpb24gSGlzdG9yeShzdGFydEdlbikge1xuICAgIC8vIEFycmF5cyBvZiBjaGFuZ2UgZXZlbnRzIGFuZCBzZWxlY3Rpb25zLiBEb2luZyBzb21ldGhpbmcgYWRkcyBhblxuICAgIC8vIGV2ZW50IHRvIGRvbmUgYW5kIGNsZWFycyB1bmRvLiBVbmRvaW5nIG1vdmVzIGV2ZW50cyBmcm9tIGRvbmVcbiAgICAvLyB0byB1bmRvbmUsIHJlZG9pbmcgbW92ZXMgdGhlbSBpbiB0aGUgb3RoZXIgZGlyZWN0aW9uLlxuICAgIHRoaXMuZG9uZSA9IFtdOyB0aGlzLnVuZG9uZSA9IFtdO1xuICAgIHRoaXMudW5kb0RlcHRoID0gSW5maW5pdHk7XG4gICAgLy8gVXNlZCB0byB0cmFjayB3aGVuIGNoYW5nZXMgY2FuIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIHVuZG9cbiAgICAvLyBldmVudFxuICAgIHRoaXMubGFzdE1vZFRpbWUgPSB0aGlzLmxhc3RTZWxUaW1lID0gMDtcbiAgICB0aGlzLmxhc3RPcCA9IG51bGw7XG4gICAgdGhpcy5sYXN0T3JpZ2luID0gdGhpcy5sYXN0U2VsT3JpZ2luID0gbnVsbDtcbiAgICAvLyBVc2VkIGJ5IHRoZSBpc0NsZWFuKCkgbWV0aG9kXG4gICAgdGhpcy5nZW5lcmF0aW9uID0gdGhpcy5tYXhHZW5lcmF0aW9uID0gc3RhcnRHZW4gfHwgMTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIGhpc3RvcnkgY2hhbmdlIGV2ZW50IGZyb20gYW4gdXBkYXRlRG9jLXN0eWxlIGNoYW5nZVxuICAvLyBvYmplY3QuXG4gIGZ1bmN0aW9uIGhpc3RvcnlDaGFuZ2VGcm9tQ2hhbmdlKGRvYywgY2hhbmdlKSB7XG4gICAgdmFyIGhpc3RDaGFuZ2UgPSB7ZnJvbTogY29weVBvcyhjaGFuZ2UuZnJvbSksIHRvOiBjaGFuZ2VFbmQoY2hhbmdlKSwgdGV4dDogZ2V0QmV0d2Vlbihkb2MsIGNoYW5nZS5mcm9tLCBjaGFuZ2UudG8pfTtcbiAgICBhdHRhY2hMb2NhbFNwYW5zKGRvYywgaGlzdENoYW5nZSwgY2hhbmdlLmZyb20ubGluZSwgY2hhbmdlLnRvLmxpbmUgKyAxKTtcbiAgICBsaW5rZWREb2NzKGRvYywgZnVuY3Rpb24oZG9jKSB7YXR0YWNoTG9jYWxTcGFucyhkb2MsIGhpc3RDaGFuZ2UsIGNoYW5nZS5mcm9tLmxpbmUsIGNoYW5nZS50by5saW5lICsgMSk7fSwgdHJ1ZSk7XG4gICAgcmV0dXJuIGhpc3RDaGFuZ2U7XG4gIH1cblxuICAvLyBQb3AgYWxsIHNlbGVjdGlvbiBldmVudHMgb2ZmIHRoZSBlbmQgb2YgYSBoaXN0b3J5IGFycmF5LiBTdG9wIGF0XG4gIC8vIGEgY2hhbmdlIGV2ZW50LlxuICBmdW5jdGlvbiBjbGVhclNlbGVjdGlvbkV2ZW50cyhhcnJheSkge1xuICAgIHdoaWxlIChhcnJheS5sZW5ndGgpIHtcbiAgICAgIHZhciBsYXN0ID0gbHN0KGFycmF5KTtcbiAgICAgIGlmIChsYXN0LnJhbmdlcykgYXJyYXkucG9wKCk7XG4gICAgICBlbHNlIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHRvcCBjaGFuZ2UgZXZlbnQgaW4gdGhlIGhpc3RvcnkuIFBvcCBvZmYgc2VsZWN0aW9uXG4gIC8vIGV2ZW50cyB0aGF0IGFyZSBpbiB0aGUgd2F5LlxuICBmdW5jdGlvbiBsYXN0Q2hhbmdlRXZlbnQoaGlzdCwgZm9yY2UpIHtcbiAgICBpZiAoZm9yY2UpIHtcbiAgICAgIGNsZWFyU2VsZWN0aW9uRXZlbnRzKGhpc3QuZG9uZSk7XG4gICAgICByZXR1cm4gbHN0KGhpc3QuZG9uZSk7XG4gICAgfSBlbHNlIGlmIChoaXN0LmRvbmUubGVuZ3RoICYmICFsc3QoaGlzdC5kb25lKS5yYW5nZXMpIHtcbiAgICAgIHJldHVybiBsc3QoaGlzdC5kb25lKTtcbiAgICB9IGVsc2UgaWYgKGhpc3QuZG9uZS5sZW5ndGggPiAxICYmICFoaXN0LmRvbmVbaGlzdC5kb25lLmxlbmd0aCAtIDJdLnJhbmdlcykge1xuICAgICAgaGlzdC5kb25lLnBvcCgpO1xuICAgICAgcmV0dXJuIGxzdChoaXN0LmRvbmUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlZ2lzdGVyIGEgY2hhbmdlIGluIHRoZSBoaXN0b3J5LiBNZXJnZXMgY2hhbmdlcyB0aGF0IGFyZSB3aXRoaW5cbiAgLy8gYSBzaW5nbGUgb3BlcmF0aW9uLCBvcmUgYXJlIGNsb3NlIHRvZ2V0aGVyIHdpdGggYW4gb3JpZ2luIHRoYXRcbiAgLy8gYWxsb3dzIG1lcmdpbmcgKHN0YXJ0aW5nIHdpdGggXCIrXCIpIGludG8gYSBzaW5nbGUgZXZlbnQuXG4gIGZ1bmN0aW9uIGFkZENoYW5nZVRvSGlzdG9yeShkb2MsIGNoYW5nZSwgc2VsQWZ0ZXIsIG9wSWQpIHtcbiAgICB2YXIgaGlzdCA9IGRvYy5oaXN0b3J5O1xuICAgIGhpc3QudW5kb25lLmxlbmd0aCA9IDA7XG4gICAgdmFyIHRpbWUgPSArbmV3IERhdGUsIGN1cjtcblxuICAgIGlmICgoaGlzdC5sYXN0T3AgPT0gb3BJZCB8fFxuICAgICAgICAgaGlzdC5sYXN0T3JpZ2luID09IGNoYW5nZS5vcmlnaW4gJiYgY2hhbmdlLm9yaWdpbiAmJlxuICAgICAgICAgKChjaGFuZ2Uub3JpZ2luLmNoYXJBdCgwKSA9PSBcIitcIiAmJiBkb2MuY20gJiYgaGlzdC5sYXN0TW9kVGltZSA+IHRpbWUgLSBkb2MuY20ub3B0aW9ucy5oaXN0b3J5RXZlbnREZWxheSkgfHxcbiAgICAgICAgICBjaGFuZ2Uub3JpZ2luLmNoYXJBdCgwKSA9PSBcIipcIikpICYmXG4gICAgICAgIChjdXIgPSBsYXN0Q2hhbmdlRXZlbnQoaGlzdCwgaGlzdC5sYXN0T3AgPT0gb3BJZCkpKSB7XG4gICAgICAvLyBNZXJnZSB0aGlzIGNoYW5nZSBpbnRvIHRoZSBsYXN0IGV2ZW50XG4gICAgICB2YXIgbGFzdCA9IGxzdChjdXIuY2hhbmdlcyk7XG4gICAgICBpZiAoY21wKGNoYW5nZS5mcm9tLCBjaGFuZ2UudG8pID09IDAgJiYgY21wKGNoYW5nZS5mcm9tLCBsYXN0LnRvKSA9PSAwKSB7XG4gICAgICAgIC8vIE9wdGltaXplZCBjYXNlIGZvciBzaW1wbGUgaW5zZXJ0aW9uIC0tIGRvbid0IHdhbnQgdG8gYWRkXG4gICAgICAgIC8vIG5ldyBjaGFuZ2VzZXRzIGZvciBldmVyeSBjaGFyYWN0ZXIgdHlwZWRcbiAgICAgICAgbGFzdC50byA9IGNoYW5nZUVuZChjaGFuZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQWRkIG5ldyBzdWItZXZlbnRcbiAgICAgICAgY3VyLmNoYW5nZXMucHVzaChoaXN0b3J5Q2hhbmdlRnJvbUNoYW5nZShkb2MsIGNoYW5nZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDYW4gbm90IGJlIG1lcmdlZCwgc3RhcnQgYSBuZXcgZXZlbnQuXG4gICAgICB2YXIgYmVmb3JlID0gbHN0KGhpc3QuZG9uZSk7XG4gICAgICBpZiAoIWJlZm9yZSB8fCAhYmVmb3JlLnJhbmdlcylcbiAgICAgICAgcHVzaFNlbGVjdGlvblRvSGlzdG9yeShkb2Muc2VsLCBoaXN0LmRvbmUpO1xuICAgICAgY3VyID0ge2NoYW5nZXM6IFtoaXN0b3J5Q2hhbmdlRnJvbUNoYW5nZShkb2MsIGNoYW5nZSldLFxuICAgICAgICAgICAgIGdlbmVyYXRpb246IGhpc3QuZ2VuZXJhdGlvbn07XG4gICAgICBoaXN0LmRvbmUucHVzaChjdXIpO1xuICAgICAgd2hpbGUgKGhpc3QuZG9uZS5sZW5ndGggPiBoaXN0LnVuZG9EZXB0aCkge1xuICAgICAgICBoaXN0LmRvbmUuc2hpZnQoKTtcbiAgICAgICAgaWYgKCFoaXN0LmRvbmVbMF0ucmFuZ2VzKSBoaXN0LmRvbmUuc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaGlzdC5kb25lLnB1c2goc2VsQWZ0ZXIpO1xuICAgIGhpc3QuZ2VuZXJhdGlvbiA9ICsraGlzdC5tYXhHZW5lcmF0aW9uO1xuICAgIGhpc3QubGFzdE1vZFRpbWUgPSBoaXN0Lmxhc3RTZWxUaW1lID0gdGltZTtcbiAgICBoaXN0Lmxhc3RPcCA9IG9wSWQ7XG4gICAgaGlzdC5sYXN0T3JpZ2luID0gaGlzdC5sYXN0U2VsT3JpZ2luID0gY2hhbmdlLm9yaWdpbjtcblxuICAgIGlmICghbGFzdCkgc2lnbmFsKGRvYywgXCJoaXN0b3J5QWRkZWRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3Rpb25FdmVudENhbkJlTWVyZ2VkKGRvYywgb3JpZ2luLCBwcmV2LCBzZWwpIHtcbiAgICB2YXIgY2ggPSBvcmlnaW4uY2hhckF0KDApO1xuICAgIHJldHVybiBjaCA9PSBcIipcIiB8fFxuICAgICAgY2ggPT0gXCIrXCIgJiZcbiAgICAgIHByZXYucmFuZ2VzLmxlbmd0aCA9PSBzZWwucmFuZ2VzLmxlbmd0aCAmJlxuICAgICAgcHJldi5zb21ldGhpbmdTZWxlY3RlZCgpID09IHNlbC5zb21ldGhpbmdTZWxlY3RlZCgpICYmXG4gICAgICBuZXcgRGF0ZSAtIGRvYy5oaXN0b3J5Lmxhc3RTZWxUaW1lIDw9IChkb2MuY20gPyBkb2MuY20ub3B0aW9ucy5oaXN0b3J5RXZlbnREZWxheSA6IDUwMCk7XG4gIH1cblxuICAvLyBDYWxsZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2VzLCBzZXRzIHRoZSBuZXcgc2VsZWN0aW9uIGFzXG4gIC8vIHRoZSBwZW5kaW5nIHNlbGVjdGlvbiBpbiB0aGUgaGlzdG9yeSwgYW5kIHB1c2hlcyB0aGUgb2xkIHBlbmRpbmdcbiAgLy8gc2VsZWN0aW9uIGludG8gdGhlICdkb25lJyBhcnJheSB3aGVuIGl0IHdhcyBzaWduaWZpY2FudGx5XG4gIC8vIGRpZmZlcmVudCAoaW4gbnVtYmVyIG9mIHNlbGVjdGVkIHJhbmdlcywgZW1wdGluZXNzLCBvciB0aW1lKS5cbiAgZnVuY3Rpb24gYWRkU2VsZWN0aW9uVG9IaXN0b3J5KGRvYywgc2VsLCBvcElkLCBvcHRpb25zKSB7XG4gICAgdmFyIGhpc3QgPSBkb2MuaGlzdG9yeSwgb3JpZ2luID0gb3B0aW9ucyAmJiBvcHRpb25zLm9yaWdpbjtcblxuICAgIC8vIEEgbmV3IGV2ZW50IGlzIHN0YXJ0ZWQgd2hlbiB0aGUgcHJldmlvdXMgb3JpZ2luIGRvZXMgbm90IG1hdGNoXG4gICAgLy8gdGhlIGN1cnJlbnQsIG9yIHRoZSBvcmlnaW5zIGRvbid0IGFsbG93IG1hdGNoaW5nLiBPcmlnaW5zXG4gICAgLy8gc3RhcnRpbmcgd2l0aCAqIGFyZSBhbHdheXMgbWVyZ2VkLCB0aG9zZSBzdGFydGluZyB3aXRoICsgYXJlXG4gICAgLy8gbWVyZ2VkIHdoZW4gc2ltaWxhciBhbmQgY2xvc2UgdG9nZXRoZXIgaW4gdGltZS5cbiAgICBpZiAob3BJZCA9PSBoaXN0Lmxhc3RPcCB8fFxuICAgICAgICAob3JpZ2luICYmIGhpc3QubGFzdFNlbE9yaWdpbiA9PSBvcmlnaW4gJiZcbiAgICAgICAgIChoaXN0Lmxhc3RNb2RUaW1lID09IGhpc3QubGFzdFNlbFRpbWUgJiYgaGlzdC5sYXN0T3JpZ2luID09IG9yaWdpbiB8fFxuICAgICAgICAgIHNlbGVjdGlvbkV2ZW50Q2FuQmVNZXJnZWQoZG9jLCBvcmlnaW4sIGxzdChoaXN0LmRvbmUpLCBzZWwpKSkpXG4gICAgICBoaXN0LmRvbmVbaGlzdC5kb25lLmxlbmd0aCAtIDFdID0gc2VsO1xuICAgIGVsc2VcbiAgICAgIHB1c2hTZWxlY3Rpb25Ub0hpc3Rvcnkoc2VsLCBoaXN0LmRvbmUpO1xuXG4gICAgaGlzdC5sYXN0U2VsVGltZSA9ICtuZXcgRGF0ZTtcbiAgICBoaXN0Lmxhc3RTZWxPcmlnaW4gPSBvcmlnaW47XG4gICAgaGlzdC5sYXN0T3AgPSBvcElkO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuY2xlYXJSZWRvICE9PSBmYWxzZSlcbiAgICAgIGNsZWFyU2VsZWN0aW9uRXZlbnRzKGhpc3QudW5kb25lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hTZWxlY3Rpb25Ub0hpc3Rvcnkoc2VsLCBkZXN0KSB7XG4gICAgdmFyIHRvcCA9IGxzdChkZXN0KTtcbiAgICBpZiAoISh0b3AgJiYgdG9wLnJhbmdlcyAmJiB0b3AuZXF1YWxzKHNlbCkpKVxuICAgICAgZGVzdC5wdXNoKHNlbCk7XG4gIH1cblxuICAvLyBVc2VkIHRvIHN0b3JlIG1hcmtlZCBzcGFuIGluZm9ybWF0aW9uIGluIHRoZSBoaXN0b3J5LlxuICBmdW5jdGlvbiBhdHRhY2hMb2NhbFNwYW5zKGRvYywgY2hhbmdlLCBmcm9tLCB0bykge1xuICAgIHZhciBleGlzdGluZyA9IGNoYW5nZVtcInNwYW5zX1wiICsgZG9jLmlkXSwgbiA9IDA7XG4gICAgZG9jLml0ZXIoTWF0aC5tYXgoZG9jLmZpcnN0LCBmcm9tKSwgTWF0aC5taW4oZG9jLmZpcnN0ICsgZG9jLnNpemUsIHRvKSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGxpbmUubWFya2VkU3BhbnMpXG4gICAgICAgIChleGlzdGluZyB8fCAoZXhpc3RpbmcgPSBjaGFuZ2VbXCJzcGFuc19cIiArIGRvYy5pZF0gPSB7fSkpW25dID0gbGluZS5tYXJrZWRTcGFucztcbiAgICAgICsrbjtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFdoZW4gdW4vcmUtZG9pbmcgcmVzdG9yZXMgdGV4dCBjb250YWluaW5nIG1hcmtlZCBzcGFucywgdGhvc2VcbiAgLy8gdGhhdCBoYXZlIGJlZW4gZXhwbGljaXRseSBjbGVhcmVkIHNob3VsZCBub3QgYmUgcmVzdG9yZWQuXG4gIGZ1bmN0aW9uIHJlbW92ZUNsZWFyZWRTcGFucyhzcGFucykge1xuICAgIGlmICghc3BhbnMpIHJldHVybiBudWxsO1xuICAgIGZvciAodmFyIGkgPSAwLCBvdXQ7IGkgPCBzcGFucy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHNwYW5zW2ldLm1hcmtlci5leHBsaWNpdGx5Q2xlYXJlZCkgeyBpZiAoIW91dCkgb3V0ID0gc3BhbnMuc2xpY2UoMCwgaSk7IH1cbiAgICAgIGVsc2UgaWYgKG91dCkgb3V0LnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gIW91dCA/IHNwYW5zIDogb3V0Lmxlbmd0aCA/IG91dCA6IG51bGw7XG4gIH1cblxuICAvLyBSZXRyaWV2ZSBhbmQgZmlsdGVyIHRoZSBvbGQgbWFya2VkIHNwYW5zIHN0b3JlZCBpbiBhIGNoYW5nZSBldmVudC5cbiAgZnVuY3Rpb24gZ2V0T2xkU3BhbnMoZG9jLCBjaGFuZ2UpIHtcbiAgICB2YXIgZm91bmQgPSBjaGFuZ2VbXCJzcGFuc19cIiArIGRvYy5pZF07XG4gICAgaWYgKCFmb3VuZCkgcmV0dXJuIG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDAsIG53ID0gW107IGkgPCBjaGFuZ2UudGV4dC5sZW5ndGg7ICsraSlcbiAgICAgIG53LnB1c2gocmVtb3ZlQ2xlYXJlZFNwYW5zKGZvdW5kW2ldKSk7XG4gICAgcmV0dXJuIG53O1xuICB9XG5cbiAgLy8gVXNlZCBib3RoIHRvIHByb3ZpZGUgYSBKU09OLXNhZmUgb2JqZWN0IGluIC5nZXRIaXN0b3J5LCBhbmQsIHdoZW5cbiAgLy8gZGV0YWNoaW5nIGEgZG9jdW1lbnQsIHRvIHNwbGl0IHRoZSBoaXN0b3J5IGluIHR3b1xuICBmdW5jdGlvbiBjb3B5SGlzdG9yeUFycmF5KGV2ZW50cywgbmV3R3JvdXAsIGluc3RhbnRpYXRlU2VsKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGNvcHkgPSBbXTsgaSA8IGV2ZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGV2ZW50ID0gZXZlbnRzW2ldO1xuICAgICAgaWYgKGV2ZW50LnJhbmdlcykge1xuICAgICAgICBjb3B5LnB1c2goaW5zdGFudGlhdGVTZWwgPyBTZWxlY3Rpb24ucHJvdG90eXBlLmRlZXBDb3B5LmNhbGwoZXZlbnQpIDogZXZlbnQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBjaGFuZ2VzID0gZXZlbnQuY2hhbmdlcywgbmV3Q2hhbmdlcyA9IFtdO1xuICAgICAgY29weS5wdXNoKHtjaGFuZ2VzOiBuZXdDaGFuZ2VzfSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNoYW5nZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IGNoYW5nZXNbal0sIG07XG4gICAgICAgIG5ld0NoYW5nZXMucHVzaCh7ZnJvbTogY2hhbmdlLmZyb20sIHRvOiBjaGFuZ2UudG8sIHRleHQ6IGNoYW5nZS50ZXh0fSk7XG4gICAgICAgIGlmIChuZXdHcm91cCkgZm9yICh2YXIgcHJvcCBpbiBjaGFuZ2UpIGlmIChtID0gcHJvcC5tYXRjaCgvXnNwYW5zXyhcXGQrKSQvKSkge1xuICAgICAgICAgIGlmIChpbmRleE9mKG5ld0dyb3VwLCBOdW1iZXIobVsxXSkpID4gLTEpIHtcbiAgICAgICAgICAgIGxzdChuZXdDaGFuZ2VzKVtwcm9wXSA9IGNoYW5nZVtwcm9wXTtcbiAgICAgICAgICAgIGRlbGV0ZSBjaGFuZ2VbcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9XG5cbiAgLy8gUmViYXNpbmcvcmVzZXR0aW5nIGhpc3RvcnkgdG8gZGVhbCB3aXRoIGV4dGVybmFsbHktc291cmNlZCBjaGFuZ2VzXG5cbiAgZnVuY3Rpb24gcmViYXNlSGlzdFNlbFNpbmdsZShwb3MsIGZyb20sIHRvLCBkaWZmKSB7XG4gICAgaWYgKHRvIDwgcG9zLmxpbmUpIHtcbiAgICAgIHBvcy5saW5lICs9IGRpZmY7XG4gICAgfSBlbHNlIGlmIChmcm9tIDwgcG9zLmxpbmUpIHtcbiAgICAgIHBvcy5saW5lID0gZnJvbTtcbiAgICAgIHBvcy5jaCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gVHJpZXMgdG8gcmViYXNlIGFuIGFycmF5IG9mIGhpc3RvcnkgZXZlbnRzIGdpdmVuIGEgY2hhbmdlIGluIHRoZVxuICAvLyBkb2N1bWVudC4gSWYgdGhlIGNoYW5nZSB0b3VjaGVzIHRoZSBzYW1lIGxpbmVzIGFzIHRoZSBldmVudCwgdGhlXG4gIC8vIGV2ZW50LCBhbmQgZXZlcnl0aGluZyAnYmVoaW5kJyBpdCwgaXMgZGlzY2FyZGVkLiBJZiB0aGUgY2hhbmdlIGlzXG4gIC8vIGJlZm9yZSB0aGUgZXZlbnQsIHRoZSBldmVudCdzIHBvc2l0aW9ucyBhcmUgdXBkYXRlZC4gVXNlcyBhXG4gIC8vIGNvcHktb24td3JpdGUgc2NoZW1lIGZvciB0aGUgcG9zaXRpb25zLCB0byBhdm9pZCBoYXZpbmcgdG9cbiAgLy8gcmVhbGxvY2F0ZSB0aGVtIGFsbCBvbiBldmVyeSByZWJhc2UsIGJ1dCBhbHNvIGF2b2lkIHByb2JsZW1zIHdpdGhcbiAgLy8gc2hhcmVkIHBvc2l0aW9uIG9iamVjdHMgYmVpbmcgdW5zYWZlbHkgdXBkYXRlZC5cbiAgZnVuY3Rpb24gcmViYXNlSGlzdEFycmF5KGFycmF5LCBmcm9tLCB0bywgZGlmZikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBzdWIgPSBhcnJheVtpXSwgb2sgPSB0cnVlO1xuICAgICAgaWYgKHN1Yi5yYW5nZXMpIHtcbiAgICAgICAgaWYgKCFzdWIuY29waWVkKSB7IHN1YiA9IGFycmF5W2ldID0gc3ViLmRlZXBDb3B5KCk7IHN1Yi5jb3BpZWQgPSB0cnVlOyB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3ViLnJhbmdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHJlYmFzZUhpc3RTZWxTaW5nbGUoc3ViLnJhbmdlc1tqXS5hbmNob3IsIGZyb20sIHRvLCBkaWZmKTtcbiAgICAgICAgICByZWJhc2VIaXN0U2VsU2luZ2xlKHN1Yi5yYW5nZXNbal0uaGVhZCwgZnJvbSwgdG8sIGRpZmYpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdWIuY2hhbmdlcy5sZW5ndGg7ICsraikge1xuICAgICAgICB2YXIgY3VyID0gc3ViLmNoYW5nZXNbal07XG4gICAgICAgIGlmICh0byA8IGN1ci5mcm9tLmxpbmUpIHtcbiAgICAgICAgICBjdXIuZnJvbSA9IFBvcyhjdXIuZnJvbS5saW5lICsgZGlmZiwgY3VyLmZyb20uY2gpO1xuICAgICAgICAgIGN1ci50byA9IFBvcyhjdXIudG8ubGluZSArIGRpZmYsIGN1ci50by5jaCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZnJvbSA8PSBjdXIudG8ubGluZSkge1xuICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghb2spIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKDAsIGkgKyAxKTtcbiAgICAgICAgaSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmViYXNlSGlzdChoaXN0LCBjaGFuZ2UpIHtcbiAgICB2YXIgZnJvbSA9IGNoYW5nZS5mcm9tLmxpbmUsIHRvID0gY2hhbmdlLnRvLmxpbmUsIGRpZmYgPSBjaGFuZ2UudGV4dC5sZW5ndGggLSAodG8gLSBmcm9tKSAtIDE7XG4gICAgcmViYXNlSGlzdEFycmF5KGhpc3QuZG9uZSwgZnJvbSwgdG8sIGRpZmYpO1xuICAgIHJlYmFzZUhpc3RBcnJheShoaXN0LnVuZG9uZSwgZnJvbSwgdG8sIGRpZmYpO1xuICB9XG5cbiAgLy8gRVZFTlQgVVRJTElUSUVTXG5cbiAgLy8gRHVlIHRvIHRoZSBmYWN0IHRoYXQgd2Ugc3RpbGwgc3VwcG9ydCBqdXJhc3NpYyBJRSB2ZXJzaW9ucywgc29tZVxuICAvLyBjb21wYXRpYmlsaXR5IHdyYXBwZXJzIGFyZSBuZWVkZWQuXG5cbiAgdmFyIGVfcHJldmVudERlZmF1bHQgPSBDb2RlTWlycm9yLmVfcHJldmVudERlZmF1bHQgPSBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgfTtcbiAgdmFyIGVfc3RvcFByb3BhZ2F0aW9uID0gQ29kZU1pcnJvci5lX3N0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZWxzZSBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gIH07XG4gIGZ1bmN0aW9uIGVfZGVmYXVsdFByZXZlbnRlZChlKSB7XG4gICAgcmV0dXJuIGUuZGVmYXVsdFByZXZlbnRlZCAhPSBudWxsID8gZS5kZWZhdWx0UHJldmVudGVkIDogZS5yZXR1cm5WYWx1ZSA9PSBmYWxzZTtcbiAgfVxuICB2YXIgZV9zdG9wID0gQ29kZU1pcnJvci5lX3N0b3AgPSBmdW5jdGlvbihlKSB7ZV9wcmV2ZW50RGVmYXVsdChlKTsgZV9zdG9wUHJvcGFnYXRpb24oZSk7fTtcblxuICBmdW5jdGlvbiBlX3RhcmdldChlKSB7cmV0dXJuIGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDt9XG4gIGZ1bmN0aW9uIGVfYnV0dG9uKGUpIHtcbiAgICB2YXIgYiA9IGUud2hpY2g7XG4gICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgaWYgKGUuYnV0dG9uICYgMSkgYiA9IDE7XG4gICAgICBlbHNlIGlmIChlLmJ1dHRvbiAmIDIpIGIgPSAzO1xuICAgICAgZWxzZSBpZiAoZS5idXR0b24gJiA0KSBiID0gMjtcbiAgICB9XG4gICAgaWYgKG1hYyAmJiBlLmN0cmxLZXkgJiYgYiA9PSAxKSBiID0gMztcbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIC8vIEVWRU5UIEhBTkRMSU5HXG5cbiAgLy8gTGlnaHR3ZWlnaHQgZXZlbnQgZnJhbWV3b3JrLiBvbi9vZmYgYWxzbyB3b3JrIG9uIERPTSBub2RlcyxcbiAgLy8gcmVnaXN0ZXJpbmcgbmF0aXZlIERPTSBoYW5kbGVycy5cblxuICB2YXIgb24gPSBDb2RlTWlycm9yLm9uID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSwgZikge1xuICAgIGlmIChlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZiwgZmFsc2UpO1xuICAgIGVsc2UgaWYgKGVtaXR0ZXIuYXR0YWNoRXZlbnQpXG4gICAgICBlbWl0dGVyLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGYpO1xuICAgIGVsc2Uge1xuICAgICAgdmFyIG1hcCA9IGVtaXR0ZXIuX2hhbmRsZXJzIHx8IChlbWl0dGVyLl9oYW5kbGVycyA9IHt9KTtcbiAgICAgIHZhciBhcnIgPSBtYXBbdHlwZV0gfHwgKG1hcFt0eXBlXSA9IFtdKTtcbiAgICAgIGFyci5wdXNoKGYpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb2ZmID0gQ29kZU1pcnJvci5vZmYgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlLCBmKSB7XG4gICAgaWYgKGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgIGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmLCBmYWxzZSk7XG4gICAgZWxzZSBpZiAoZW1pdHRlci5kZXRhY2hFdmVudClcbiAgICAgIGVtaXR0ZXIuZGV0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgZik7XG4gICAgZWxzZSB7XG4gICAgICB2YXIgYXJyID0gZW1pdHRlci5faGFuZGxlcnMgJiYgZW1pdHRlci5faGFuZGxlcnNbdHlwZV07XG4gICAgICBpZiAoIWFycikgcmV0dXJuO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpXG4gICAgICAgIGlmIChhcnJbaV0gPT0gZikgeyBhcnIuc3BsaWNlKGksIDEpOyBicmVhazsgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgc2lnbmFsID0gQ29kZU1pcnJvci5zaWduYWwgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlIC8qLCB2YWx1ZXMuLi4qLykge1xuICAgIHZhciBhcnIgPSBlbWl0dGVyLl9oYW5kbGVycyAmJiBlbWl0dGVyLl9oYW5kbGVyc1t0eXBlXTtcbiAgICBpZiAoIWFycikgcmV0dXJuO1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkgYXJyW2ldLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9O1xuXG4gIC8vIE9mdGVuLCB3ZSB3YW50IHRvIHNpZ25hbCBldmVudHMgYXQgYSBwb2ludCB3aGVyZSB3ZSBhcmUgaW4gdGhlXG4gIC8vIG1pZGRsZSBvZiBzb21lIHdvcmssIGJ1dCBkb24ndCB3YW50IHRoZSBoYW5kbGVyIHRvIHN0YXJ0IGNhbGxpbmdcbiAgLy8gb3RoZXIgbWV0aG9kcyBvbiB0aGUgZWRpdG9yLCB3aGljaCBtaWdodCBiZSBpbiBhbiBpbmNvbnNpc3RlbnRcbiAgLy8gc3RhdGUgb3Igc2ltcGx5IG5vdCBleHBlY3QgYW55IG90aGVyIGV2ZW50cyB0byBoYXBwZW4uXG4gIC8vIHNpZ25hbExhdGVyIGxvb2tzIHdoZXRoZXIgdGhlcmUgYXJlIGFueSBoYW5kbGVycywgYW5kIHNjaGVkdWxlc1xuICAvLyB0aGVtIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGxhc3Qgb3BlcmF0aW9uIGVuZHMsIG9yLCBpZiBub1xuICAvLyBvcGVyYXRpb24gaXMgYWN0aXZlLCB3aGVuIGEgdGltZW91dCBmaXJlcy5cbiAgdmFyIGRlbGF5ZWRDYWxsYmFja3MsIGRlbGF5ZWRDYWxsYmFja0RlcHRoID0gMDtcbiAgZnVuY3Rpb24gc2lnbmFsTGF0ZXIoZW1pdHRlciwgdHlwZSAvKiwgdmFsdWVzLi4uKi8pIHtcbiAgICB2YXIgYXJyID0gZW1pdHRlci5faGFuZGxlcnMgJiYgZW1pdHRlci5faGFuZGxlcnNbdHlwZV07XG4gICAgaWYgKCFhcnIpIHJldHVybjtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgaWYgKCFkZWxheWVkQ2FsbGJhY2tzKSB7XG4gICAgICArK2RlbGF5ZWRDYWxsYmFja0RlcHRoO1xuICAgICAgZGVsYXllZENhbGxiYWNrcyA9IFtdO1xuICAgICAgc2V0VGltZW91dChmaXJlRGVsYXllZCwgMCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJuZChmKSB7cmV0dXJuIGZ1bmN0aW9uKCl7Zi5hcHBseShudWxsLCBhcmdzKTt9O307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpXG4gICAgICBkZWxheWVkQ2FsbGJhY2tzLnB1c2goYm5kKGFycltpXSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlyZURlbGF5ZWQoKSB7XG4gICAgLS1kZWxheWVkQ2FsbGJhY2tEZXB0aDtcbiAgICB2YXIgZGVsYXllZCA9IGRlbGF5ZWRDYWxsYmFja3M7XG4gICAgZGVsYXllZENhbGxiYWNrcyA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWxheWVkLmxlbmd0aDsgKytpKSBkZWxheWVkW2ldKCk7XG4gIH1cblxuICAvLyBUaGUgRE9NIGV2ZW50cyB0aGF0IENvZGVNaXJyb3IgaGFuZGxlcyBjYW4gYmUgb3ZlcnJpZGRlbiBieVxuICAvLyByZWdpc3RlcmluZyBhIChub24tRE9NKSBoYW5kbGVyIG9uIHRoZSBlZGl0b3IgZm9yIHRoZSBldmVudCBuYW1lLFxuICAvLyBhbmQgcHJldmVudERlZmF1bHQtaW5nIHRoZSBldmVudCBpbiB0aGF0IGhhbmRsZXIuXG4gIGZ1bmN0aW9uIHNpZ25hbERPTUV2ZW50KGNtLCBlLCBvdmVycmlkZSkge1xuICAgIHNpZ25hbChjbSwgb3ZlcnJpZGUgfHwgZS50eXBlLCBjbSwgZSk7XG4gICAgcmV0dXJuIGVfZGVmYXVsdFByZXZlbnRlZChlKSB8fCBlLmNvZGVtaXJyb3JJZ25vcmU7XG4gIH1cblxuICBmdW5jdGlvbiBzaWduYWxDdXJzb3JBY3Rpdml0eShjbSkge1xuICAgIHZhciBhcnIgPSBjbS5faGFuZGxlcnMgJiYgY20uX2hhbmRsZXJzLmN1cnNvckFjdGl2aXR5O1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgdmFyIHNldCA9IGNtLmN1ck9wLmN1cnNvckFjdGl2aXR5SGFuZGxlcnMgfHwgKGNtLmN1ck9wLmN1cnNvckFjdGl2aXR5SGFuZGxlcnMgPSBbXSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIGlmIChpbmRleE9mKHNldCwgYXJyW2ldKSA9PSAtMSlcbiAgICAgIHNldC5wdXNoKGFycltpXSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNIYW5kbGVyKGVtaXR0ZXIsIHR5cGUpIHtcbiAgICB2YXIgYXJyID0gZW1pdHRlci5faGFuZGxlcnMgJiYgZW1pdHRlci5faGFuZGxlcnNbdHlwZV07XG4gICAgcmV0dXJuIGFyciAmJiBhcnIubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8vIEFkZCBvbiBhbmQgb2ZmIG1ldGhvZHMgdG8gYSBjb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgdG8gbWFrZVxuICAvLyByZWdpc3RlcmluZyBldmVudHMgb24gc3VjaCBvYmplY3RzIG1vcmUgY29udmVuaWVudC5cbiAgZnVuY3Rpb24gZXZlbnRNaXhpbihjdG9yKSB7XG4gICAgY3Rvci5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBmKSB7b24odGhpcywgdHlwZSwgZik7fTtcbiAgICBjdG9yLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbih0eXBlLCBmKSB7b2ZmKHRoaXMsIHR5cGUsIGYpO307XG4gIH1cblxuICAvLyBNSVNDIFVUSUxJVElFU1xuXG4gIC8vIE51bWJlciBvZiBwaXhlbHMgYWRkZWQgdG8gc2Nyb2xsZXIgYW5kIHNpemVyIHRvIGhpZGUgc2Nyb2xsYmFyXG4gIHZhciBzY3JvbGxlckN1dE9mZiA9IDMwO1xuXG4gIC8vIFJldHVybmVkIG9yIHRocm93biBieSB2YXJpb3VzIHByb3RvY29scyB0byBzaWduYWwgJ0knbSBub3RcbiAgLy8gaGFuZGxpbmcgdGhpcycuXG4gIHZhciBQYXNzID0gQ29kZU1pcnJvci5QYXNzID0ge3RvU3RyaW5nOiBmdW5jdGlvbigpe3JldHVybiBcIkNvZGVNaXJyb3IuUGFzc1wiO319O1xuXG4gIC8vIFJldXNlZCBvcHRpb24gb2JqZWN0cyBmb3Igc2V0U2VsZWN0aW9uICYgZnJpZW5kc1xuICB2YXIgc2VsX2RvbnRTY3JvbGwgPSB7c2Nyb2xsOiBmYWxzZX0sIHNlbF9tb3VzZSA9IHtvcmlnaW46IFwiKm1vdXNlXCJ9LCBzZWxfbW92ZSA9IHtvcmlnaW46IFwiK21vdmVcIn07XG5cbiAgZnVuY3Rpb24gRGVsYXllZCgpIHt0aGlzLmlkID0gbnVsbDt9XG4gIERlbGF5ZWQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG1zLCBmKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuaWQpO1xuICAgIHRoaXMuaWQgPSBzZXRUaW1lb3V0KGYsIG1zKTtcbiAgfTtcblxuICAvLyBDb3VudHMgdGhlIGNvbHVtbiBvZmZzZXQgaW4gYSBzdHJpbmcsIHRha2luZyB0YWJzIGludG8gYWNjb3VudC5cbiAgLy8gVXNlZCBtb3N0bHkgdG8gZmluZCBpbmRlbnRhdGlvbi5cbiAgdmFyIGNvdW50Q29sdW1uID0gQ29kZU1pcnJvci5jb3VudENvbHVtbiA9IGZ1bmN0aW9uKHN0cmluZywgZW5kLCB0YWJTaXplLCBzdGFydEluZGV4LCBzdGFydFZhbHVlKSB7XG4gICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBlbmQgPSBzdHJpbmcuc2VhcmNoKC9bXlxcc1xcdTAwYTBdLyk7XG4gICAgICBpZiAoZW5kID09IC0xKSBlbmQgPSBzdHJpbmcubGVuZ3RoO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBuID0gc3RhcnRWYWx1ZSB8fCAwOzspIHtcbiAgICAgIHZhciBuZXh0VGFiID0gc3RyaW5nLmluZGV4T2YoXCJcXHRcIiwgaSk7XG4gICAgICBpZiAobmV4dFRhYiA8IDAgfHwgbmV4dFRhYiA+PSBlbmQpXG4gICAgICAgIHJldHVybiBuICsgKGVuZCAtIGkpO1xuICAgICAgbiArPSBuZXh0VGFiIC0gaTtcbiAgICAgIG4gKz0gdGFiU2l6ZSAtIChuICUgdGFiU2l6ZSk7XG4gICAgICBpID0gbmV4dFRhYiArIDE7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBpbnZlcnNlIG9mIGNvdW50Q29sdW1uIC0tIGZpbmQgdGhlIG9mZnNldCB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIGEgcGFydGljdWxhciBjb2x1bW4uXG4gIGZ1bmN0aW9uIGZpbmRDb2x1bW4oc3RyaW5nLCBnb2FsLCB0YWJTaXplKSB7XG4gICAgZm9yICh2YXIgcG9zID0gMCwgY29sID0gMDs7KSB7XG4gICAgICB2YXIgbmV4dFRhYiA9IHN0cmluZy5pbmRleE9mKFwiXFx0XCIsIHBvcyk7XG4gICAgICBpZiAobmV4dFRhYiA9PSAtMSkgbmV4dFRhYiA9IHN0cmluZy5sZW5ndGg7XG4gICAgICB2YXIgc2tpcHBlZCA9IG5leHRUYWIgLSBwb3M7XG4gICAgICBpZiAobmV4dFRhYiA9PSBzdHJpbmcubGVuZ3RoIHx8IGNvbCArIHNraXBwZWQgPj0gZ29hbClcbiAgICAgICAgcmV0dXJuIHBvcyArIE1hdGgubWluKHNraXBwZWQsIGdvYWwgLSBjb2wpO1xuICAgICAgY29sICs9IG5leHRUYWIgLSBwb3M7XG4gICAgICBjb2wgKz0gdGFiU2l6ZSAtIChjb2wgJSB0YWJTaXplKTtcbiAgICAgIHBvcyA9IG5leHRUYWIgKyAxO1xuICAgICAgaWYgKGNvbCA+PSBnb2FsKSByZXR1cm4gcG9zO1xuICAgIH1cbiAgfVxuXG4gIHZhciBzcGFjZVN0cnMgPSBbXCJcIl07XG4gIGZ1bmN0aW9uIHNwYWNlU3RyKG4pIHtcbiAgICB3aGlsZSAoc3BhY2VTdHJzLmxlbmd0aCA8PSBuKVxuICAgICAgc3BhY2VTdHJzLnB1c2gobHN0KHNwYWNlU3RycykgKyBcIiBcIik7XG4gICAgcmV0dXJuIHNwYWNlU3Ryc1tuXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxzdChhcnIpIHsgcmV0dXJuIGFyclthcnIubGVuZ3RoLTFdOyB9XG5cbiAgdmFyIHNlbGVjdElucHV0ID0gZnVuY3Rpb24obm9kZSkgeyBub2RlLnNlbGVjdCgpOyB9O1xuICBpZiAoaW9zKSAvLyBNb2JpbGUgU2FmYXJpIGFwcGFyZW50bHkgaGFzIGEgYnVnIHdoZXJlIHNlbGVjdCgpIGlzIGJyb2tlbi5cbiAgICBzZWxlY3RJbnB1dCA9IGZ1bmN0aW9uKG5vZGUpIHsgbm9kZS5zZWxlY3Rpb25TdGFydCA9IDA7IG5vZGUuc2VsZWN0aW9uRW5kID0gbm9kZS52YWx1ZS5sZW5ndGg7IH07XG4gIGVsc2UgaWYgKGllKSAvLyBTdXBwcmVzcyBteXN0ZXJpb3VzIElFMTAgZXJyb3JzXG4gICAgc2VsZWN0SW5wdXQgPSBmdW5jdGlvbihub2RlKSB7IHRyeSB7IG5vZGUuc2VsZWN0KCk7IH0gY2F0Y2goX2UpIHt9IH07XG5cbiAgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgZWx0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcbiAgICAgIGlmIChhcnJheVtpXSA9PSBlbHQpIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoW10uaW5kZXhPZikgaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBlbHQpIHsgcmV0dXJuIGFycmF5LmluZGV4T2YoZWx0KTsgfTtcbiAgZnVuY3Rpb24gbWFwKGFycmF5LCBmKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIG91dFtpXSA9IGYoYXJyYXlbaV0sIGkpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgaWYgKFtdLm1hcCkgbWFwID0gZnVuY3Rpb24oYXJyYXksIGYpIHsgcmV0dXJuIGFycmF5Lm1hcChmKTsgfTtcblxuICBmdW5jdGlvbiBjcmVhdGVPYmooYmFzZSwgcHJvcHMpIHtcbiAgICB2YXIgaW5zdDtcbiAgICBpZiAoT2JqZWN0LmNyZWF0ZSkge1xuICAgICAgaW5zdCA9IE9iamVjdC5jcmVhdGUoYmFzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjdG9yID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gYmFzZTtcbiAgICAgIGluc3QgPSBuZXcgY3RvcigpO1xuICAgIH1cbiAgICBpZiAocHJvcHMpIGNvcHlPYmoocHJvcHMsIGluc3QpO1xuICAgIHJldHVybiBpbnN0O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGNvcHlPYmoob2JqLCB0YXJnZXQsIG92ZXJ3cml0ZSkge1xuICAgIGlmICghdGFyZ2V0KSB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKHZhciBwcm9wIGluIG9iailcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKG92ZXJ3cml0ZSAhPT0gZmFsc2UgfHwgIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkpXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IG9ialtwcm9wXTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZChmKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbigpe3JldHVybiBmLmFwcGx5KG51bGwsIGFyZ3MpO307XG4gIH1cblxuICB2YXIgbm9uQVNDSUlTaW5nbGVDYXNlV29yZENoYXIgPSAvW1xcdTAwZGZcXHUzMDQwLVxcdTMwOWZcXHUzMGEwLVxcdTMwZmZcXHUzNDAwLVxcdTRkYjVcXHU0ZTAwLVxcdTlmY2NcXHVhYzAwLVxcdWQ3YWZdLztcbiAgdmFyIGlzV29yZENoYXJCYXNpYyA9IENvZGVNaXJyb3IuaXNXb3JkQ2hhciA9IGZ1bmN0aW9uKGNoKSB7XG4gICAgcmV0dXJuIC9cXHcvLnRlc3QoY2gpIHx8IGNoID4gXCJcXHg4MFwiICYmXG4gICAgICAoY2gudG9VcHBlckNhc2UoKSAhPSBjaC50b0xvd2VyQ2FzZSgpIHx8IG5vbkFTQ0lJU2luZ2xlQ2FzZVdvcmRDaGFyLnRlc3QoY2gpKTtcbiAgfTtcbiAgZnVuY3Rpb24gaXNXb3JkQ2hhcihjaCwgaGVscGVyKSB7XG4gICAgaWYgKCFoZWxwZXIpIHJldHVybiBpc1dvcmRDaGFyQmFzaWMoY2gpO1xuICAgIGlmIChoZWxwZXIuc291cmNlLmluZGV4T2YoXCJcXFxcd1wiKSA+IC0xICYmIGlzV29yZENoYXJCYXNpYyhjaCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBoZWxwZXIudGVzdChjaCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgIGZvciAodmFyIG4gaW4gb2JqKSBpZiAob2JqLmhhc093blByb3BlcnR5KG4pICYmIG9ialtuXSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gRXh0ZW5kaW5nIHVuaWNvZGUgY2hhcmFjdGVycy4gQSBzZXJpZXMgb2YgYSBub24tZXh0ZW5kaW5nIGNoYXIgK1xuICAvLyBhbnkgbnVtYmVyIG9mIGV4dGVuZGluZyBjaGFycyBpcyB0cmVhdGVkIGFzIGEgc2luZ2xlIHVuaXQgYXMgZmFyXG4gIC8vIGFzIGVkaXRpbmcgYW5kIG1lYXN1cmluZyBpcyBjb25jZXJuZWQuIFRoaXMgaXMgbm90IGZ1bGx5IGNvcnJlY3QsXG4gIC8vIHNpbmNlIHNvbWUgc2NyaXB0cy9mb250cy9icm93c2VycyBhbHNvIHRyZWF0IG90aGVyIGNvbmZpZ3VyYXRpb25zXG4gIC8vIG9mIGNvZGUgcG9pbnRzIGFzIGEgZ3JvdXAuXG4gIHZhciBleHRlbmRpbmdDaGFycyA9IC9bXFx1MDMwMC1cXHUwMzZmXFx1MDQ4My1cXHUwNDg5XFx1MDU5MS1cXHUwNWJkXFx1MDViZlxcdTA1YzFcXHUwNWMyXFx1MDVjNFxcdTA1YzVcXHUwNWM3XFx1MDYxMC1cXHUwNjFhXFx1MDY0Yi1cXHUwNjVlXFx1MDY3MFxcdTA2ZDYtXFx1MDZkY1xcdTA2ZGUtXFx1MDZlNFxcdTA2ZTdcXHUwNmU4XFx1MDZlYS1cXHUwNmVkXFx1MDcxMVxcdTA3MzAtXFx1MDc0YVxcdTA3YTYtXFx1MDdiMFxcdTA3ZWItXFx1MDdmM1xcdTA4MTYtXFx1MDgxOVxcdTA4MWItXFx1MDgyM1xcdTA4MjUtXFx1MDgyN1xcdTA4MjktXFx1MDgyZFxcdTA5MDAtXFx1MDkwMlxcdTA5M2NcXHUwOTQxLVxcdTA5NDhcXHUwOTRkXFx1MDk1MS1cXHUwOTU1XFx1MDk2MlxcdTA5NjNcXHUwOTgxXFx1MDliY1xcdTA5YmVcXHUwOWMxLVxcdTA5YzRcXHUwOWNkXFx1MDlkN1xcdTA5ZTJcXHUwOWUzXFx1MGEwMVxcdTBhMDJcXHUwYTNjXFx1MGE0MVxcdTBhNDJcXHUwYTQ3XFx1MGE0OFxcdTBhNGItXFx1MGE0ZFxcdTBhNTFcXHUwYTcwXFx1MGE3MVxcdTBhNzVcXHUwYTgxXFx1MGE4MlxcdTBhYmNcXHUwYWMxLVxcdTBhYzVcXHUwYWM3XFx1MGFjOFxcdTBhY2RcXHUwYWUyXFx1MGFlM1xcdTBiMDFcXHUwYjNjXFx1MGIzZVxcdTBiM2ZcXHUwYjQxLVxcdTBiNDRcXHUwYjRkXFx1MGI1NlxcdTBiNTdcXHUwYjYyXFx1MGI2M1xcdTBiODJcXHUwYmJlXFx1MGJjMFxcdTBiY2RcXHUwYmQ3XFx1MGMzZS1cXHUwYzQwXFx1MGM0Ni1cXHUwYzQ4XFx1MGM0YS1cXHUwYzRkXFx1MGM1NVxcdTBjNTZcXHUwYzYyXFx1MGM2M1xcdTBjYmNcXHUwY2JmXFx1MGNjMlxcdTBjYzZcXHUwY2NjXFx1MGNjZFxcdTBjZDVcXHUwY2Q2XFx1MGNlMlxcdTBjZTNcXHUwZDNlXFx1MGQ0MS1cXHUwZDQ0XFx1MGQ0ZFxcdTBkNTdcXHUwZDYyXFx1MGQ2M1xcdTBkY2FcXHUwZGNmXFx1MGRkMi1cXHUwZGQ0XFx1MGRkNlxcdTBkZGZcXHUwZTMxXFx1MGUzNC1cXHUwZTNhXFx1MGU0Ny1cXHUwZTRlXFx1MGViMVxcdTBlYjQtXFx1MGViOVxcdTBlYmJcXHUwZWJjXFx1MGVjOC1cXHUwZWNkXFx1MGYxOFxcdTBmMTlcXHUwZjM1XFx1MGYzN1xcdTBmMzlcXHUwZjcxLVxcdTBmN2VcXHUwZjgwLVxcdTBmODRcXHUwZjg2XFx1MGY4N1xcdTBmOTAtXFx1MGY5N1xcdTBmOTktXFx1MGZiY1xcdTBmYzZcXHUxMDJkLVxcdTEwMzBcXHUxMDMyLVxcdTEwMzdcXHUxMDM5XFx1MTAzYVxcdTEwM2RcXHUxMDNlXFx1MTA1OFxcdTEwNTlcXHUxMDVlLVxcdTEwNjBcXHUxMDcxLVxcdTEwNzRcXHUxMDgyXFx1MTA4NVxcdTEwODZcXHUxMDhkXFx1MTA5ZFxcdTEzNWZcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdiNy1cXHUxN2JkXFx1MTdjNlxcdTE3YzktXFx1MTdkM1xcdTE3ZGRcXHUxODBiLVxcdTE4MGRcXHUxOGE5XFx1MTkyMC1cXHUxOTIyXFx1MTkyN1xcdTE5MjhcXHUxOTMyXFx1MTkzOS1cXHUxOTNiXFx1MWExN1xcdTFhMThcXHUxYTU2XFx1MWE1OC1cXHUxYTVlXFx1MWE2MFxcdTFhNjJcXHUxYTY1LVxcdTFhNmNcXHUxYTczLVxcdTFhN2NcXHUxYTdmXFx1MWIwMC1cXHUxYjAzXFx1MWIzNFxcdTFiMzYtXFx1MWIzYVxcdTFiM2NcXHUxYjQyXFx1MWI2Yi1cXHUxYjczXFx1MWI4MFxcdTFiODFcXHUxYmEyLVxcdTFiYTVcXHUxYmE4XFx1MWJhOVxcdTFjMmMtXFx1MWMzM1xcdTFjMzZcXHUxYzM3XFx1MWNkMC1cXHUxY2QyXFx1MWNkNC1cXHUxY2UwXFx1MWNlMi1cXHUxY2U4XFx1MWNlZFxcdTFkYzAtXFx1MWRlNlxcdTFkZmQtXFx1MWRmZlxcdTIwMGNcXHUyMDBkXFx1MjBkMC1cXHUyMGYwXFx1MmNlZi1cXHUyY2YxXFx1MmRlMC1cXHUyZGZmXFx1MzAyYS1cXHUzMDJmXFx1MzA5OVxcdTMwOWFcXHVhNjZmLVxcdWE2NzJcXHVhNjdjXFx1YTY3ZFxcdWE2ZjBcXHVhNmYxXFx1YTgwMlxcdWE4MDZcXHVhODBiXFx1YTgyNVxcdWE4MjZcXHVhOGM0XFx1YThlMC1cXHVhOGYxXFx1YTkyNi1cXHVhOTJkXFx1YTk0Ny1cXHVhOTUxXFx1YTk4MC1cXHVhOTgyXFx1YTliM1xcdWE5YjYtXFx1YTliOVxcdWE5YmNcXHVhYTI5LVxcdWFhMmVcXHVhYTMxXFx1YWEzMlxcdWFhMzVcXHVhYTM2XFx1YWE0M1xcdWFhNGNcXHVhYWIwXFx1YWFiMi1cXHVhYWI0XFx1YWFiN1xcdWFhYjhcXHVhYWJlXFx1YWFiZlxcdWFhYzFcXHVhYmU1XFx1YWJlOFxcdWFiZWRcXHVkYzAwLVxcdWRmZmZcXHVmYjFlXFx1ZmUwMC1cXHVmZTBmXFx1ZmUyMC1cXHVmZTI2XFx1ZmY5ZVxcdWZmOWZdLztcbiAgZnVuY3Rpb24gaXNFeHRlbmRpbmdDaGFyKGNoKSB7IHJldHVybiBjaC5jaGFyQ29kZUF0KDApID49IDc2OCAmJiBleHRlbmRpbmdDaGFycy50ZXN0KGNoKTsgfVxuXG4gIC8vIERPTSBVVElMSVRJRVNcblxuICBmdW5jdGlvbiBlbHQodGFnLCBjb250ZW50LCBjbGFzc05hbWUsIHN0eWxlKSB7XG4gICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgaWYgKGNsYXNzTmFtZSkgZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgaWYgKHN0eWxlKSBlLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gXCJzdHJpbmdcIikgZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb250ZW50KSk7XG4gICAgZWxzZSBpZiAoY29udGVudCkgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgKytpKSBlLmFwcGVuZENoaWxkKGNvbnRlbnRbaV0pO1xuICAgIHJldHVybiBlO1xuICB9XG5cbiAgdmFyIHJhbmdlO1xuICBpZiAoZG9jdW1lbnQuY3JlYXRlUmFuZ2UpIHJhbmdlID0gZnVuY3Rpb24obm9kZSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciByID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICByLnNldEVuZChub2RlLCBlbmQpO1xuICAgIHIuc2V0U3RhcnQobm9kZSwgc3RhcnQpO1xuICAgIHJldHVybiByO1xuICB9O1xuICBlbHNlIHJhbmdlID0gZnVuY3Rpb24obm9kZSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciByID0gZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICByLm1vdmVUb0VsZW1lbnRUZXh0KG5vZGUucGFyZW50Tm9kZSk7XG4gICAgci5jb2xsYXBzZSh0cnVlKTtcbiAgICByLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgZW5kKTtcbiAgICByLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBzdGFydCk7XG4gICAgcmV0dXJuIHI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4oZSkge1xuICAgIGZvciAodmFyIGNvdW50ID0gZS5jaGlsZE5vZGVzLmxlbmd0aDsgY291bnQgPiAwOyAtLWNvdW50KVxuICAgICAgZS5yZW1vdmVDaGlsZChlLmZpcnN0Q2hpbGQpO1xuICAgIHJldHVybiBlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW5BbmRBZGQocGFyZW50LCBlKSB7XG4gICAgcmV0dXJuIHJlbW92ZUNoaWxkcmVuKHBhcmVudCkuYXBwZW5kQ2hpbGQoZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYgKHBhcmVudC5jb250YWlucylcbiAgICAgIHJldHVybiBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xuICAgIHdoaWxlIChjaGlsZCA9IGNoaWxkLnBhcmVudE5vZGUpXG4gICAgICBpZiAoY2hpbGQgPT0gcGFyZW50KSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFjdGl2ZUVsdCgpIHsgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7IH1cbiAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgSUUgdGhyb3dzIHVuc3BlY2lmaWVkIGVycm9yIHdoZW4gdG91Y2hpbmdcbiAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbiBzb21lIGNhc2VzIChkdXJpbmcgbG9hZGluZywgaW4gaWZyYW1lKVxuICBpZiAoaWVfdXB0bzEwKSBhY3RpdmVFbHQgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkgeyByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDsgfVxuICAgIGNhdGNoKGUpIHsgcmV0dXJuIGRvY3VtZW50LmJvZHk7IH1cbiAgfTtcblxuICBmdW5jdGlvbiBjbGFzc1Rlc3QoY2xzKSB7IHJldHVybiBuZXcgUmVnRXhwKFwiXFxcXGJcIiArIGNscyArIFwiXFxcXGJcXFxccypcIik7IH1cbiAgZnVuY3Rpb24gcm1DbGFzcyhub2RlLCBjbHMpIHtcbiAgICB2YXIgdGVzdCA9IGNsYXNzVGVzdChjbHMpO1xuICAgIGlmICh0ZXN0LnRlc3Qobm9kZS5jbGFzc05hbWUpKSBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UodGVzdCwgXCJcIik7XG4gIH1cbiAgZnVuY3Rpb24gYWRkQ2xhc3Mobm9kZSwgY2xzKSB7XG4gICAgaWYgKCFjbGFzc1Rlc3QoY2xzKS50ZXN0KG5vZGUuY2xhc3NOYW1lKSkgbm9kZS5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbHM7XG4gIH1cbiAgZnVuY3Rpb24gam9pbkNsYXNzZXMoYSwgYikge1xuICAgIHZhciBhcyA9IGEuc3BsaXQoXCIgXCIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXMubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoYXNbaV0gJiYgIWNsYXNzVGVzdChhc1tpXSkudGVzdChiKSkgYiArPSBcIiBcIiArIGFzW2ldO1xuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV0lORE9XLVdJREUgRVZFTlRTXG5cbiAgLy8gVGhlc2UgbXVzdCBiZSBoYW5kbGVkIGNhcmVmdWxseSwgYmVjYXVzZSBuYWl2ZWx5IHJlZ2lzdGVyaW5nIGFcbiAgLy8gaGFuZGxlciBmb3IgZWFjaCBlZGl0b3Igd2lsbCBjYXVzZSB0aGUgZWRpdG9ycyB0byBuZXZlciBiZVxuICAvLyBnYXJiYWdlIGNvbGxlY3RlZC5cblxuICBmdW5jdGlvbiBmb3JFYWNoQ29kZU1pcnJvcihmKSB7XG4gICAgaWYgKCFkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHJldHVybjtcbiAgICB2YXIgYnlDbGFzcyA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIkNvZGVNaXJyb3JcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieUNsYXNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY20gPSBieUNsYXNzW2ldLkNvZGVNaXJyb3I7XG4gICAgICBpZiAoY20pIGYoY20pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBnbG9iYWxzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBlbnN1cmVHbG9iYWxIYW5kbGVycygpIHtcbiAgICBpZiAoZ2xvYmFsc1JlZ2lzdGVyZWQpIHJldHVybjtcbiAgICByZWdpc3Rlckdsb2JhbEhhbmRsZXJzKCk7XG4gICAgZ2xvYmFsc1JlZ2lzdGVyZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHJlZ2lzdGVyR2xvYmFsSGFuZGxlcnMoKSB7XG4gICAgLy8gV2hlbiB0aGUgd2luZG93IHJlc2l6ZXMsIHdlIG5lZWQgdG8gcmVmcmVzaCBhY3RpdmUgZWRpdG9ycy5cbiAgICB2YXIgcmVzaXplVGltZXI7XG4gICAgb24od2luZG93LCBcInJlc2l6ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyZXNpemVUaW1lciA9PSBudWxsKSByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc2l6ZVRpbWVyID0gbnVsbDtcbiAgICAgICAga25vd25TY3JvbGxiYXJXaWR0aCA9IG51bGw7XG4gICAgICAgIGZvckVhY2hDb2RlTWlycm9yKG9uUmVzaXplKTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfSk7XG4gICAgLy8gV2hlbiB0aGUgd2luZG93IGxvc2VzIGZvY3VzLCB3ZSB3YW50IHRvIHNob3cgdGhlIGVkaXRvciBhcyBibHVycmVkXG4gICAgb24od2luZG93LCBcImJsdXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmb3JFYWNoQ29kZU1pcnJvcihvbkJsdXIpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRkVBVFVSRSBERVRFQ1RJT05cblxuICAvLyBEZXRlY3QgZHJhZy1hbmQtZHJvcFxuICB2YXIgZHJhZ0FuZERyb3AgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGVyZSBpcyAqc29tZSoga2luZCBvZiBkcmFnLWFuZC1kcm9wIHN1cHBvcnQgaW4gSUU2LTgsIGJ1dCBJXG4gICAgLy8gY291bGRuJ3QgZ2V0IGl0IHRvIHdvcmsgeWV0LlxuICAgIGlmIChpZV91cHRvOCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBkaXYgPSBlbHQoJ2RpdicpO1xuICAgIHJldHVybiBcImRyYWdnYWJsZVwiIGluIGRpdiB8fCBcImRyYWdEcm9wXCIgaW4gZGl2O1xuICB9KCk7XG5cbiAgdmFyIGtub3duU2Nyb2xsYmFyV2lkdGg7XG4gIGZ1bmN0aW9uIHNjcm9sbGJhcldpZHRoKG1lYXN1cmUpIHtcbiAgICBpZiAoa25vd25TY3JvbGxiYXJXaWR0aCAhPSBudWxsKSByZXR1cm4ga25vd25TY3JvbGxiYXJXaWR0aDtcbiAgICB2YXIgdGVzdCA9IGVsdChcImRpdlwiLCBudWxsLCBudWxsLCBcIndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IG92ZXJmbG93LXg6IHNjcm9sbFwiKTtcbiAgICByZW1vdmVDaGlsZHJlbkFuZEFkZChtZWFzdXJlLCB0ZXN0KTtcbiAgICBpZiAodGVzdC5vZmZzZXRXaWR0aClcbiAgICAgIGtub3duU2Nyb2xsYmFyV2lkdGggPSB0ZXN0Lm9mZnNldEhlaWdodCAtIHRlc3QuY2xpZW50SGVpZ2h0O1xuICAgIHJldHVybiBrbm93blNjcm9sbGJhcldpZHRoIHx8IDA7XG4gIH1cblxuICB2YXIgendzcFN1cHBvcnRlZDtcbiAgZnVuY3Rpb24gemVyb1dpZHRoRWxlbWVudChtZWFzdXJlKSB7XG4gICAgaWYgKHp3c3BTdXBwb3J0ZWQgPT0gbnVsbCkge1xuICAgICAgdmFyIHRlc3QgPSBlbHQoXCJzcGFuXCIsIFwiXFx1MjAwYlwiKTtcbiAgICAgIHJlbW92ZUNoaWxkcmVuQW5kQWRkKG1lYXN1cmUsIGVsdChcInNwYW5cIiwgW3Rlc3QsIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwieFwiKV0pKTtcbiAgICAgIGlmIChtZWFzdXJlLmZpcnN0Q2hpbGQub2Zmc2V0SGVpZ2h0ICE9IDApXG4gICAgICAgIHp3c3BTdXBwb3J0ZWQgPSB0ZXN0Lm9mZnNldFdpZHRoIDw9IDEgJiYgdGVzdC5vZmZzZXRIZWlnaHQgPiAyICYmICFpZV91cHRvNztcbiAgICB9XG4gICAgaWYgKHp3c3BTdXBwb3J0ZWQpIHJldHVybiBlbHQoXCJzcGFuXCIsIFwiXFx1MjAwYlwiKTtcbiAgICBlbHNlIHJldHVybiBlbHQoXCJzcGFuXCIsIFwiXFx1MDBhMFwiLCBudWxsLCBcImRpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDFweDsgbWFyZ2luLXJpZ2h0OiAtMXB4XCIpO1xuICB9XG5cbiAgLy8gRmVhdHVyZS1kZXRlY3QgSUUncyBjcnVtbXkgY2xpZW50IHJlY3QgcmVwb3J0aW5nIGZvciBiaWRpIHRleHRcbiAgdmFyIGJhZEJpZGlSZWN0cztcbiAgZnVuY3Rpb24gaGFzQmFkQmlkaVJlY3RzKG1lYXN1cmUpIHtcbiAgICBpZiAoYmFkQmlkaVJlY3RzICE9IG51bGwpIHJldHVybiBiYWRCaWRpUmVjdHM7XG4gICAgdmFyIHR4dCA9IHJlbW92ZUNoaWxkcmVuQW5kQWRkKG1lYXN1cmUsIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiQVxcdTA2MmVBXCIpKTtcbiAgICB2YXIgcjAgPSByYW5nZSh0eHQsIDAsIDEpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChyMC5sZWZ0ID09IHIwLnJpZ2h0KSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHIxID0gcmFuZ2UodHh0LCAxLCAyKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gYmFkQmlkaVJlY3RzID0gKHIxLnJpZ2h0IC0gcjAucmlnaHQgPCAzKTtcbiAgfVxuXG4gIC8vIFNlZSBpZiBcIlwiLnNwbGl0IGlzIHRoZSBicm9rZW4gSUUgdmVyc2lvbiwgaWYgc28sIHByb3ZpZGUgYW5cbiAgLy8gYWx0ZXJuYXRpdmUgd2F5IHRvIHNwbGl0IGxpbmVzLlxuICB2YXIgc3BsaXRMaW5lcyA9IENvZGVNaXJyb3Iuc3BsaXRMaW5lcyA9IFwiXFxuXFxuYlwiLnNwbGl0KC9cXG4vKS5sZW5ndGggIT0gMyA/IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHZhciBwb3MgPSAwLCByZXN1bHQgPSBbXSwgbCA9IHN0cmluZy5sZW5ndGg7XG4gICAgd2hpbGUgKHBvcyA8PSBsKSB7XG4gICAgICB2YXIgbmwgPSBzdHJpbmcuaW5kZXhPZihcIlxcblwiLCBwb3MpO1xuICAgICAgaWYgKG5sID09IC0xKSBubCA9IHN0cmluZy5sZW5ndGg7XG4gICAgICB2YXIgbGluZSA9IHN0cmluZy5zbGljZShwb3MsIHN0cmluZy5jaGFyQXQobmwgLSAxKSA9PSBcIlxcclwiID8gbmwgLSAxIDogbmwpO1xuICAgICAgdmFyIHJ0ID0gbGluZS5pbmRleE9mKFwiXFxyXCIpO1xuICAgICAgaWYgKHJ0ICE9IC0xKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGxpbmUuc2xpY2UoMCwgcnQpKTtcbiAgICAgICAgcG9zICs9IHJ0ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGxpbmUpO1xuICAgICAgICBwb3MgPSBubCArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gOiBmdW5jdGlvbihzdHJpbmcpe3JldHVybiBzdHJpbmcuc3BsaXQoL1xcclxcbj98XFxuLyk7fTtcblxuICB2YXIgaGFzU2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbiA/IGZ1bmN0aW9uKHRlKSB7XG4gICAgdHJ5IHsgcmV0dXJuIHRlLnNlbGVjdGlvblN0YXJ0ICE9IHRlLnNlbGVjdGlvbkVuZDsgfVxuICAgIGNhdGNoKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH0gOiBmdW5jdGlvbih0ZSkge1xuICAgIHRyeSB7dmFyIHJhbmdlID0gdGUub3duZXJEb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTt9XG4gICAgY2F0Y2goZSkge31cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLnBhcmVudEVsZW1lbnQoKSAhPSB0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiByYW5nZS5jb21wYXJlRW5kUG9pbnRzKFwiU3RhcnRUb0VuZFwiLCByYW5nZSkgIT0gMDtcbiAgfTtcblxuICB2YXIgaGFzQ29weUV2ZW50ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlID0gZWx0KFwiZGl2XCIpO1xuICAgIGlmIChcIm9uY29weVwiIGluIGUpIHJldHVybiB0cnVlO1xuICAgIGUuc2V0QXR0cmlidXRlKFwib25jb3B5XCIsIFwicmV0dXJuO1wiKTtcbiAgICByZXR1cm4gdHlwZW9mIGUub25jb3B5ID09IFwiZnVuY3Rpb25cIjtcbiAgfSkoKTtcblxuICAvLyBLRVkgTkFNRVNcblxuICB2YXIga2V5TmFtZXMgPSB7MzogXCJFbnRlclwiLCA4OiBcIkJhY2tzcGFjZVwiLCA5OiBcIlRhYlwiLCAxMzogXCJFbnRlclwiLCAxNjogXCJTaGlmdFwiLCAxNzogXCJDdHJsXCIsIDE4OiBcIkFsdFwiLFxuICAgICAgICAgICAgICAgICAgMTk6IFwiUGF1c2VcIiwgMjA6IFwiQ2Fwc0xvY2tcIiwgMjc6IFwiRXNjXCIsIDMyOiBcIlNwYWNlXCIsIDMzOiBcIlBhZ2VVcFwiLCAzNDogXCJQYWdlRG93blwiLCAzNTogXCJFbmRcIixcbiAgICAgICAgICAgICAgICAgIDM2OiBcIkhvbWVcIiwgMzc6IFwiTGVmdFwiLCAzODogXCJVcFwiLCAzOTogXCJSaWdodFwiLCA0MDogXCJEb3duXCIsIDQ0OiBcIlByaW50U2NyblwiLCA0NTogXCJJbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgIDQ2OiBcIkRlbGV0ZVwiLCA1OTogXCI7XCIsIDYxOiBcIj1cIiwgOTE6IFwiTW9kXCIsIDkyOiBcIk1vZFwiLCA5MzogXCJNb2RcIiwgMTA3OiBcIj1cIiwgMTA5OiBcIi1cIiwgMTI3OiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgMTczOiBcIi1cIiwgMTg2OiBcIjtcIiwgMTg3OiBcIj1cIiwgMTg4OiBcIixcIiwgMTg5OiBcIi1cIiwgMTkwOiBcIi5cIiwgMTkxOiBcIi9cIiwgMTkyOiBcImBcIiwgMjE5OiBcIltcIiwgMjIwOiBcIlxcXFxcIixcbiAgICAgICAgICAgICAgICAgIDIyMTogXCJdXCIsIDIyMjogXCInXCIsIDYzMjMyOiBcIlVwXCIsIDYzMjMzOiBcIkRvd25cIiwgNjMyMzQ6IFwiTGVmdFwiLCA2MzIzNTogXCJSaWdodFwiLCA2MzI3MjogXCJEZWxldGVcIixcbiAgICAgICAgICAgICAgICAgIDYzMjczOiBcIkhvbWVcIiwgNjMyNzU6IFwiRW5kXCIsIDYzMjc2OiBcIlBhZ2VVcFwiLCA2MzI3NzogXCJQYWdlRG93blwiLCA2MzMwMjogXCJJbnNlcnRcIn07XG4gIENvZGVNaXJyb3Iua2V5TmFtZXMgPSBrZXlOYW1lcztcbiAgKGZ1bmN0aW9uKCkge1xuICAgIC8vIE51bWJlciBrZXlzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSBrZXlOYW1lc1tpICsgNDhdID0ga2V5TmFtZXNbaSArIDk2XSA9IFN0cmluZyhpKTtcbiAgICAvLyBBbHBoYWJldGljIGtleXNcbiAgICBmb3IgKHZhciBpID0gNjU7IGkgPD0gOTA7IGkrKykga2V5TmFtZXNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIC8vIEZ1bmN0aW9uIGtleXNcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAxMjsgaSsrKSBrZXlOYW1lc1tpICsgMTExXSA9IGtleU5hbWVzW2kgKyA2MzIzNV0gPSBcIkZcIiArIGk7XG4gIH0pKCk7XG5cbiAgLy8gQklESSBIRUxQRVJTXG5cbiAgZnVuY3Rpb24gaXRlcmF0ZUJpZGlTZWN0aW9ucyhvcmRlciwgZnJvbSwgdG8sIGYpIHtcbiAgICBpZiAoIW9yZGVyKSByZXR1cm4gZihmcm9tLCB0bywgXCJsdHJcIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlci5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHBhcnQgPSBvcmRlcltpXTtcbiAgICAgIGlmIChwYXJ0LmZyb20gPCB0byAmJiBwYXJ0LnRvID4gZnJvbSB8fCBmcm9tID09IHRvICYmIHBhcnQudG8gPT0gZnJvbSkge1xuICAgICAgICBmKE1hdGgubWF4KHBhcnQuZnJvbSwgZnJvbSksIE1hdGgubWluKHBhcnQudG8sIHRvKSwgcGFydC5sZXZlbCA9PSAxID8gXCJydGxcIiA6IFwibHRyXCIpO1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZm91bmQpIGYoZnJvbSwgdG8sIFwibHRyXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmlkaUxlZnQocGFydCkgeyByZXR1cm4gcGFydC5sZXZlbCAlIDIgPyBwYXJ0LnRvIDogcGFydC5mcm9tOyB9XG4gIGZ1bmN0aW9uIGJpZGlSaWdodChwYXJ0KSB7IHJldHVybiBwYXJ0LmxldmVsICUgMiA/IHBhcnQuZnJvbSA6IHBhcnQudG87IH1cblxuICBmdW5jdGlvbiBsaW5lTGVmdChsaW5lKSB7IHZhciBvcmRlciA9IGdldE9yZGVyKGxpbmUpOyByZXR1cm4gb3JkZXIgPyBiaWRpTGVmdChvcmRlclswXSkgOiAwOyB9XG4gIGZ1bmN0aW9uIGxpbmVSaWdodChsaW5lKSB7XG4gICAgdmFyIG9yZGVyID0gZ2V0T3JkZXIobGluZSk7XG4gICAgaWYgKCFvcmRlcikgcmV0dXJuIGxpbmUudGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIGJpZGlSaWdodChsc3Qob3JkZXIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpbmVTdGFydChjbSwgbGluZU4pIHtcbiAgICB2YXIgbGluZSA9IGdldExpbmUoY20uZG9jLCBsaW5lTik7XG4gICAgdmFyIHZpc3VhbCA9IHZpc3VhbExpbmUobGluZSk7XG4gICAgaWYgKHZpc3VhbCAhPSBsaW5lKSBsaW5lTiA9IGxpbmVObyh2aXN1YWwpO1xuICAgIHZhciBvcmRlciA9IGdldE9yZGVyKHZpc3VhbCk7XG4gICAgdmFyIGNoID0gIW9yZGVyID8gMCA6IG9yZGVyWzBdLmxldmVsICUgMiA/IGxpbmVSaWdodCh2aXN1YWwpIDogbGluZUxlZnQodmlzdWFsKTtcbiAgICByZXR1cm4gUG9zKGxpbmVOLCBjaCk7XG4gIH1cbiAgZnVuY3Rpb24gbGluZUVuZChjbSwgbGluZU4pIHtcbiAgICB2YXIgbWVyZ2VkLCBsaW5lID0gZ2V0TGluZShjbS5kb2MsIGxpbmVOKTtcbiAgICB3aGlsZSAobWVyZ2VkID0gY29sbGFwc2VkU3BhbkF0RW5kKGxpbmUpKSB7XG4gICAgICBsaW5lID0gbWVyZ2VkLmZpbmQoMSwgdHJ1ZSkubGluZTtcbiAgICAgIGxpbmVOID0gbnVsbDtcbiAgICB9XG4gICAgdmFyIG9yZGVyID0gZ2V0T3JkZXIobGluZSk7XG4gICAgdmFyIGNoID0gIW9yZGVyID8gbGluZS50ZXh0Lmxlbmd0aCA6IG9yZGVyWzBdLmxldmVsICUgMiA/IGxpbmVMZWZ0KGxpbmUpIDogbGluZVJpZ2h0KGxpbmUpO1xuICAgIHJldHVybiBQb3MobGluZU4gPT0gbnVsbCA/IGxpbmVObyhsaW5lKSA6IGxpbmVOLCBjaCk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wYXJlQmlkaUxldmVsKG9yZGVyLCBhLCBiKSB7XG4gICAgdmFyIGxpbmVkaXIgPSBvcmRlclswXS5sZXZlbDtcbiAgICBpZiAoYSA9PSBsaW5lZGlyKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYiA9PSBsaW5lZGlyKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGEgPCBiO1xuICB9XG4gIHZhciBiaWRpT3RoZXI7XG4gIGZ1bmN0aW9uIGdldEJpZGlQYXJ0QXQob3JkZXIsIHBvcykge1xuICAgIGJpZGlPdGhlciA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDAsIGZvdW5kOyBpIDwgb3JkZXIubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBjdXIgPSBvcmRlcltpXTtcbiAgICAgIGlmIChjdXIuZnJvbSA8IHBvcyAmJiBjdXIudG8gPiBwb3MpIHJldHVybiBpO1xuICAgICAgaWYgKChjdXIuZnJvbSA9PSBwb3MgfHwgY3VyLnRvID09IHBvcykpIHtcbiAgICAgICAgaWYgKGZvdW5kID09IG51bGwpIHtcbiAgICAgICAgICBmb3VuZCA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29tcGFyZUJpZGlMZXZlbChvcmRlciwgY3VyLmxldmVsLCBvcmRlcltmb3VuZF0ubGV2ZWwpKSB7XG4gICAgICAgICAgaWYgKGN1ci5mcm9tICE9IGN1ci50bykgYmlkaU90aGVyID0gZm91bmQ7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGN1ci5mcm9tICE9IGN1ci50bykgYmlkaU90aGVyID0gaTtcbiAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZUluTGluZShsaW5lLCBwb3MsIGRpciwgYnlVbml0KSB7XG4gICAgaWYgKCFieVVuaXQpIHJldHVybiBwb3MgKyBkaXI7XG4gICAgZG8gcG9zICs9IGRpcjtcbiAgICB3aGlsZSAocG9zID4gMCAmJiBpc0V4dGVuZGluZ0NoYXIobGluZS50ZXh0LmNoYXJBdChwb3MpKSk7XG4gICAgcmV0dXJuIHBvcztcbiAgfVxuXG4gIC8vIFRoaXMgaXMgbmVlZGVkIGluIG9yZGVyIHRvIG1vdmUgJ3Zpc3VhbGx5JyB0aHJvdWdoIGJpLWRpcmVjdGlvbmFsXG4gIC8vIHRleHQgLS0gaS5lLiwgcHJlc3NpbmcgbGVmdCBzaG91bGQgbWFrZSB0aGUgY3Vyc29yIGdvIGxlZnQsIGV2ZW5cbiAgLy8gd2hlbiBpbiBSVEwgdGV4dC4gVGhlIHRyaWNreSBwYXJ0IGlzIHRoZSAnanVtcHMnLCB3aGVyZSBSVEwgYW5kXG4gIC8vIExUUiB0ZXh0IHRvdWNoIGVhY2ggb3RoZXIuIFRoaXMgb2Z0ZW4gcmVxdWlyZXMgdGhlIGN1cnNvciBvZmZzZXRcbiAgLy8gdG8gbW92ZSBtb3JlIHRoYW4gb25lIHVuaXQsIGluIG9yZGVyIHRvIHZpc3VhbGx5IG1vdmUgb25lIHVuaXQuXG4gIGZ1bmN0aW9uIG1vdmVWaXN1YWxseShsaW5lLCBzdGFydCwgZGlyLCBieVVuaXQpIHtcbiAgICB2YXIgYmlkaSA9IGdldE9yZGVyKGxpbmUpO1xuICAgIGlmICghYmlkaSkgcmV0dXJuIG1vdmVMb2dpY2FsbHkobGluZSwgc3RhcnQsIGRpciwgYnlVbml0KTtcbiAgICB2YXIgcG9zID0gZ2V0QmlkaVBhcnRBdChiaWRpLCBzdGFydCksIHBhcnQgPSBiaWRpW3Bvc107XG4gICAgdmFyIHRhcmdldCA9IG1vdmVJbkxpbmUobGluZSwgc3RhcnQsIHBhcnQubGV2ZWwgJSAyID8gLWRpciA6IGRpciwgYnlVbml0KTtcblxuICAgIGZvciAoOzspIHtcbiAgICAgIGlmICh0YXJnZXQgPiBwYXJ0LmZyb20gJiYgdGFyZ2V0IDwgcGFydC50bykgcmV0dXJuIHRhcmdldDtcbiAgICAgIGlmICh0YXJnZXQgPT0gcGFydC5mcm9tIHx8IHRhcmdldCA9PSBwYXJ0LnRvKSB7XG4gICAgICAgIGlmIChnZXRCaWRpUGFydEF0KGJpZGksIHRhcmdldCkgPT0gcG9zKSByZXR1cm4gdGFyZ2V0O1xuICAgICAgICBwYXJ0ID0gYmlkaVtwb3MgKz0gZGlyXTtcbiAgICAgICAgcmV0dXJuIChkaXIgPiAwKSA9PSBwYXJ0LmxldmVsICUgMiA/IHBhcnQudG8gOiBwYXJ0LmZyb207XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0ID0gYmlkaVtwb3MgKz0gZGlyXTtcbiAgICAgICAgaWYgKCFwYXJ0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgaWYgKChkaXIgPiAwKSA9PSBwYXJ0LmxldmVsICUgMilcbiAgICAgICAgICB0YXJnZXQgPSBtb3ZlSW5MaW5lKGxpbmUsIHBhcnQudG8sIC0xLCBieVVuaXQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGFyZ2V0ID0gbW92ZUluTGluZShsaW5lLCBwYXJ0LmZyb20sIDEsIGJ5VW5pdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW92ZUxvZ2ljYWxseShsaW5lLCBzdGFydCwgZGlyLCBieVVuaXQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gc3RhcnQgKyBkaXI7XG4gICAgaWYgKGJ5VW5pdCkgd2hpbGUgKHRhcmdldCA+IDAgJiYgaXNFeHRlbmRpbmdDaGFyKGxpbmUudGV4dC5jaGFyQXQodGFyZ2V0KSkpIHRhcmdldCArPSBkaXI7XG4gICAgcmV0dXJuIHRhcmdldCA8IDAgfHwgdGFyZ2V0ID4gbGluZS50ZXh0Lmxlbmd0aCA/IG51bGwgOiB0YXJnZXQ7XG4gIH1cblxuICAvLyBCaWRpcmVjdGlvbmFsIG9yZGVyaW5nIGFsZ29yaXRobVxuICAvLyBTZWUgaHR0cDovL3VuaWNvZGUub3JnL3JlcG9ydHMvdHI5L3RyOS0xMy5odG1sIGZvciB0aGUgYWxnb3JpdGhtXG4gIC8vIHRoYXQgdGhpcyAocGFydGlhbGx5KSBpbXBsZW1lbnRzLlxuXG4gIC8vIE9uZS1jaGFyIGNvZGVzIHVzZWQgZm9yIGNoYXJhY3RlciB0eXBlczpcbiAgLy8gTCAoTCk6ICAgTGVmdC10by1SaWdodFxuICAvLyBSIChSKTogICBSaWdodC10by1MZWZ0XG4gIC8vIHIgKEFMKTogIFJpZ2h0LXRvLUxlZnQgQXJhYmljXG4gIC8vIDEgKEVOKTogIEV1cm9wZWFuIE51bWJlclxuICAvLyArIChFUyk6ICBFdXJvcGVhbiBOdW1iZXIgU2VwYXJhdG9yXG4gIC8vICUgKEVUKTogIEV1cm9wZWFuIE51bWJlciBUZXJtaW5hdG9yXG4gIC8vIG4gKEFOKTogIEFyYWJpYyBOdW1iZXJcbiAgLy8gLCAoQ1MpOiAgQ29tbW9uIE51bWJlciBTZXBhcmF0b3JcbiAgLy8gbSAoTlNNKTogTm9uLVNwYWNpbmcgTWFya1xuICAvLyBiIChCTik6ICBCb3VuZGFyeSBOZXV0cmFsXG4gIC8vIHMgKEIpOiAgIFBhcmFncmFwaCBTZXBhcmF0b3JcbiAgLy8gdCAoUyk6ICAgU2VnbWVudCBTZXBhcmF0b3JcbiAgLy8gdyAoV1MpOiAgV2hpdGVzcGFjZVxuICAvLyBOIChPTik6ICBPdGhlciBOZXV0cmFsc1xuXG4gIC8vIFJldHVybnMgbnVsbCBpZiBjaGFyYWN0ZXJzIGFyZSBvcmRlcmVkIGFzIHRoZXkgYXBwZWFyXG4gIC8vIChsZWZ0LXRvLXJpZ2h0KSwgb3IgYW4gYXJyYXkgb2Ygc2VjdGlvbnMgKHtmcm9tLCB0bywgbGV2ZWx9XG4gIC8vIG9iamVjdHMpIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IG9jY3VyIHZpc3VhbGx5LlxuICB2YXIgYmlkaU9yZGVyaW5nID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIENoYXJhY3RlciB0eXBlcyBmb3IgY29kZXBvaW50cyAwIHRvIDB4ZmZcbiAgICB2YXIgbG93VHlwZXMgPSBcImJiYmJiYmJiYnRzdHdzYmJiYmJiYmJiYmJiYmJzc3N0d05OJSUlTk5OTk5OLE4sTjExMTExMTExMTFOTk5OTk5OTExMTExMTExMTExMTExMTExMTExMTExMTExOTk5OTk5MTExMTExMTExMTExMTExMTExMTExMTExMTE5OTk5iYmJiYmJzYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmIsTiUlJSVOTk5OTE5OTk5OJSUxMU5MTk5OMUxOTk5OTkxMTExMTExMTExMTExMTExMTExMTExMTkxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExOXCI7XG4gICAgLy8gQ2hhcmFjdGVyIHR5cGVzIGZvciBjb2RlcG9pbnRzIDB4NjAwIHRvIDB4NmZmXG4gICAgdmFyIGFyYWJpY1R5cGVzID0gXCJycnJycnJycnJycnIsck5ObW1tbW1tcnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJtbW1tbW1tbW1tbW1tbXJycnJycnJubm5ubm5ubm5uJW5ucnJybXJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJycnJybW1tbW1tbW1tbW1tbW1tbW1tbU5tbW1tXCI7XG4gICAgZnVuY3Rpb24gY2hhclR5cGUoY29kZSkge1xuICAgICAgaWYgKGNvZGUgPD0gMHhmNykgcmV0dXJuIGxvd1R5cGVzLmNoYXJBdChjb2RlKTtcbiAgICAgIGVsc2UgaWYgKDB4NTkwIDw9IGNvZGUgJiYgY29kZSA8PSAweDVmNCkgcmV0dXJuIFwiUlwiO1xuICAgICAgZWxzZSBpZiAoMHg2MDAgPD0gY29kZSAmJiBjb2RlIDw9IDB4NmVkKSByZXR1cm4gYXJhYmljVHlwZXMuY2hhckF0KGNvZGUgLSAweDYwMCk7XG4gICAgICBlbHNlIGlmICgweDZlZSA8PSBjb2RlICYmIGNvZGUgPD0gMHg4YWMpIHJldHVybiBcInJcIjtcbiAgICAgIGVsc2UgaWYgKDB4MjAwMCA8PSBjb2RlICYmIGNvZGUgPD0gMHgyMDBiKSByZXR1cm4gXCJ3XCI7XG4gICAgICBlbHNlIGlmIChjb2RlID09IDB4MjAwYykgcmV0dXJuIFwiYlwiO1xuICAgICAgZWxzZSByZXR1cm4gXCJMXCI7XG4gICAgfVxuXG4gICAgdmFyIGJpZGlSRSA9IC9bXFx1MDU5MC1cXHUwNWY0XFx1MDYwMC1cXHUwNmZmXFx1MDcwMC1cXHUwOGFjXS87XG4gICAgdmFyIGlzTmV1dHJhbCA9IC9bc3R3Tl0vLCBpc1N0cm9uZyA9IC9bTFJyXS8sIGNvdW50c0FzTGVmdCA9IC9bTGIxbl0vLCBjb3VudHNBc051bSA9IC9bMW5dLztcbiAgICAvLyBCcm93c2VycyBzZWVtIHRvIGFsd2F5cyB0cmVhdCB0aGUgYm91bmRhcmllcyBvZiBibG9jayBlbGVtZW50cyBhcyBiZWluZyBMLlxuICAgIHZhciBvdXRlclR5cGUgPSBcIkxcIjtcblxuICAgIGZ1bmN0aW9uIEJpZGlTcGFuKGxldmVsLCBmcm9tLCB0bykge1xuICAgICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgICAgdGhpcy5mcm9tID0gZnJvbTsgdGhpcy50byA9IHRvO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICghYmlkaVJFLnRlc3Qoc3RyKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIGxlbiA9IHN0ci5sZW5ndGgsIHR5cGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgdHlwZTsgaSA8IGxlbjsgKytpKVxuICAgICAgICB0eXBlcy5wdXNoKHR5cGUgPSBjaGFyVHlwZShzdHIuY2hhckNvZGVBdChpKSkpO1xuXG4gICAgICAvLyBXMS4gRXhhbWluZSBlYWNoIG5vbi1zcGFjaW5nIG1hcmsgKE5TTSkgaW4gdGhlIGxldmVsIHJ1biwgYW5kXG4gICAgICAvLyBjaGFuZ2UgdGhlIHR5cGUgb2YgdGhlIE5TTSB0byB0aGUgdHlwZSBvZiB0aGUgcHJldmlvdXNcbiAgICAgIC8vIGNoYXJhY3Rlci4gSWYgdGhlIE5TTSBpcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGxldmVsIHJ1biwgaXQgd2lsbFxuICAgICAgLy8gZ2V0IHRoZSB0eXBlIG9mIHNvci5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBwcmV2ID0gb3V0ZXJUeXBlOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJtXCIpIHR5cGVzW2ldID0gcHJldjtcbiAgICAgICAgZWxzZSBwcmV2ID0gdHlwZTtcbiAgICAgIH1cblxuICAgICAgLy8gVzIuIFNlYXJjaCBiYWNrd2FyZHMgZnJvbSBlYWNoIGluc3RhbmNlIG9mIGEgRXVyb3BlYW4gbnVtYmVyXG4gICAgICAvLyB1bnRpbCB0aGUgZmlyc3Qgc3Ryb25nIHR5cGUgKFIsIEwsIEFMLCBvciBzb3IpIGlzIGZvdW5kLiBJZiBhblxuICAgICAgLy8gQUwgaXMgZm91bmQsIGNoYW5nZSB0aGUgdHlwZSBvZiB0aGUgRXVyb3BlYW4gbnVtYmVyIHRvIEFyYWJpY1xuICAgICAgLy8gbnVtYmVyLlxuICAgICAgLy8gVzMuIENoYW5nZSBhbGwgQUxzIHRvIFIuXG4gICAgICBmb3IgKHZhciBpID0gMCwgY3VyID0gb3V0ZXJUeXBlOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgaWYgKHR5cGUgPT0gXCIxXCIgJiYgY3VyID09IFwiclwiKSB0eXBlc1tpXSA9IFwiblwiO1xuICAgICAgICBlbHNlIGlmIChpc1N0cm9uZy50ZXN0KHR5cGUpKSB7IGN1ciA9IHR5cGU7IGlmICh0eXBlID09IFwiclwiKSB0eXBlc1tpXSA9IFwiUlwiOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIFc0LiBBIHNpbmdsZSBFdXJvcGVhbiBzZXBhcmF0b3IgYmV0d2VlbiB0d28gRXVyb3BlYW4gbnVtYmVyc1xuICAgICAgLy8gY2hhbmdlcyB0byBhIEV1cm9wZWFuIG51bWJlci4gQSBzaW5nbGUgY29tbW9uIHNlcGFyYXRvciBiZXR3ZWVuXG4gICAgICAvLyB0d28gbnVtYmVycyBvZiB0aGUgc2FtZSB0eXBlIGNoYW5nZXMgdG8gdGhhdCB0eXBlLlxuICAgICAgZm9yICh2YXIgaSA9IDEsIHByZXYgPSB0eXBlc1swXTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVzW2ldO1xuICAgICAgICBpZiAodHlwZSA9PSBcIitcIiAmJiBwcmV2ID09IFwiMVwiICYmIHR5cGVzW2krMV0gPT0gXCIxXCIpIHR5cGVzW2ldID0gXCIxXCI7XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCIsXCIgJiYgcHJldiA9PSB0eXBlc1tpKzFdICYmXG4gICAgICAgICAgICAgICAgIChwcmV2ID09IFwiMVwiIHx8IHByZXYgPT0gXCJuXCIpKSB0eXBlc1tpXSA9IHByZXY7XG4gICAgICAgIHByZXYgPSB0eXBlO1xuICAgICAgfVxuXG4gICAgICAvLyBXNS4gQSBzZXF1ZW5jZSBvZiBFdXJvcGVhbiB0ZXJtaW5hdG9ycyBhZGphY2VudCB0byBFdXJvcGVhblxuICAgICAgLy8gbnVtYmVycyBjaGFuZ2VzIHRvIGFsbCBFdXJvcGVhbiBudW1iZXJzLlxuICAgICAgLy8gVzYuIE90aGVyd2lzZSwgc2VwYXJhdG9ycyBhbmQgdGVybWluYXRvcnMgY2hhbmdlIHRvIE90aGVyXG4gICAgICAvLyBOZXV0cmFsLlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVzW2ldO1xuICAgICAgICBpZiAodHlwZSA9PSBcIixcIikgdHlwZXNbaV0gPSBcIk5cIjtcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcIiVcIikge1xuICAgICAgICAgIGZvciAodmFyIGVuZCA9IGkgKyAxOyBlbmQgPCBsZW4gJiYgdHlwZXNbZW5kXSA9PSBcIiVcIjsgKytlbmQpIHt9XG4gICAgICAgICAgdmFyIHJlcGxhY2UgPSAoaSAmJiB0eXBlc1tpLTFdID09IFwiIVwiKSB8fCAoZW5kIDwgbGVuICYmIHR5cGVzW2VuZF0gPT0gXCIxXCIpID8gXCIxXCIgOiBcIk5cIjtcbiAgICAgICAgICBmb3IgKHZhciBqID0gaTsgaiA8IGVuZDsgKytqKSB0eXBlc1tqXSA9IHJlcGxhY2U7XG4gICAgICAgICAgaSA9IGVuZCAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVzcuIFNlYXJjaCBiYWNrd2FyZHMgZnJvbSBlYWNoIGluc3RhbmNlIG9mIGEgRXVyb3BlYW4gbnVtYmVyXG4gICAgICAvLyB1bnRpbCB0aGUgZmlyc3Qgc3Ryb25nIHR5cGUgKFIsIEwsIG9yIHNvcikgaXMgZm91bmQuIElmIGFuIEwgaXNcbiAgICAgIC8vIGZvdW5kLCB0aGVuIGNoYW5nZSB0aGUgdHlwZSBvZiB0aGUgRXVyb3BlYW4gbnVtYmVyIHRvIEwuXG4gICAgICBmb3IgKHZhciBpID0gMCwgY3VyID0gb3V0ZXJUeXBlOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgaWYgKGN1ciA9PSBcIkxcIiAmJiB0eXBlID09IFwiMVwiKSB0eXBlc1tpXSA9IFwiTFwiO1xuICAgICAgICBlbHNlIGlmIChpc1N0cm9uZy50ZXN0KHR5cGUpKSBjdXIgPSB0eXBlO1xuICAgICAgfVxuXG4gICAgICAvLyBOMS4gQSBzZXF1ZW5jZSBvZiBuZXV0cmFscyB0YWtlcyB0aGUgZGlyZWN0aW9uIG9mIHRoZVxuICAgICAgLy8gc3Vycm91bmRpbmcgc3Ryb25nIHRleHQgaWYgdGhlIHRleHQgb24gYm90aCBzaWRlcyBoYXMgdGhlIHNhbWVcbiAgICAgIC8vIGRpcmVjdGlvbi4gRXVyb3BlYW4gYW5kIEFyYWJpYyBudW1iZXJzIGFjdCBhcyBpZiB0aGV5IHdlcmUgUiBpblxuICAgICAgLy8gdGVybXMgb2YgdGhlaXIgaW5mbHVlbmNlIG9uIG5ldXRyYWxzLiBTdGFydC1vZi1sZXZlbC1ydW4gKHNvcilcbiAgICAgIC8vIGFuZCBlbmQtb2YtbGV2ZWwtcnVuIChlb3IpIGFyZSB1c2VkIGF0IGxldmVsIHJ1biBib3VuZGFyaWVzLlxuICAgICAgLy8gTjIuIEFueSByZW1haW5pbmcgbmV1dHJhbHMgdGFrZSB0aGUgZW1iZWRkaW5nIGRpcmVjdGlvbi5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYgKGlzTmV1dHJhbC50ZXN0KHR5cGVzW2ldKSkge1xuICAgICAgICAgIGZvciAodmFyIGVuZCA9IGkgKyAxOyBlbmQgPCBsZW4gJiYgaXNOZXV0cmFsLnRlc3QodHlwZXNbZW5kXSk7ICsrZW5kKSB7fVxuICAgICAgICAgIHZhciBiZWZvcmUgPSAoaSA/IHR5cGVzW2ktMV0gOiBvdXRlclR5cGUpID09IFwiTFwiO1xuICAgICAgICAgIHZhciBhZnRlciA9IChlbmQgPCBsZW4gPyB0eXBlc1tlbmRdIDogb3V0ZXJUeXBlKSA9PSBcIkxcIjtcbiAgICAgICAgICB2YXIgcmVwbGFjZSA9IGJlZm9yZSB8fCBhZnRlciA/IFwiTFwiIDogXCJSXCI7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IGk7IGogPCBlbmQ7ICsraikgdHlwZXNbal0gPSByZXBsYWNlO1xuICAgICAgICAgIGkgPSBlbmQgLSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEhlcmUgd2UgZGVwYXJ0IGZyb20gdGhlIGRvY3VtZW50ZWQgYWxnb3JpdGhtLCBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgLy8gYnVpbGRpbmcgdXAgYW4gYWN0dWFsIGxldmVscyBhcnJheS4gU2luY2UgdGhlcmUgYXJlIG9ubHkgdGhyZWVcbiAgICAgIC8vIGxldmVscyAoMCwgMSwgMikgaW4gYW4gaW1wbGVtZW50YXRpb24gdGhhdCBkb2Vzbid0IHRha2VcbiAgICAgIC8vIGV4cGxpY2l0IGVtYmVkZGluZyBpbnRvIGFjY291bnQsIHdlIGNhbiBidWlsZCB1cCB0aGUgb3JkZXIgb25cbiAgICAgIC8vIHRoZSBmbHksIHdpdGhvdXQgZm9sbG93aW5nIHRoZSBsZXZlbC1iYXNlZCBhbGdvcml0aG0uXG4gICAgICB2YXIgb3JkZXIgPSBbXSwgbTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOykge1xuICAgICAgICBpZiAoY291bnRzQXNMZWZ0LnRlc3QodHlwZXNbaV0pKSB7XG4gICAgICAgICAgdmFyIHN0YXJ0ID0gaTtcbiAgICAgICAgICBmb3IgKCsraTsgaSA8IGxlbiAmJiBjb3VudHNBc0xlZnQudGVzdCh0eXBlc1tpXSk7ICsraSkge31cbiAgICAgICAgICBvcmRlci5wdXNoKG5ldyBCaWRpU3BhbigwLCBzdGFydCwgaSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBwb3MgPSBpLCBhdCA9IG9yZGVyLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKCsraTsgaSA8IGxlbiAmJiB0eXBlc1tpXSAhPSBcIkxcIjsgKytpKSB7fVxuICAgICAgICAgIGZvciAodmFyIGogPSBwb3M7IGogPCBpOykge1xuICAgICAgICAgICAgaWYgKGNvdW50c0FzTnVtLnRlc3QodHlwZXNbal0pKSB7XG4gICAgICAgICAgICAgIGlmIChwb3MgPCBqKSBvcmRlci5zcGxpY2UoYXQsIDAsIG5ldyBCaWRpU3BhbigxLCBwb3MsIGopKTtcbiAgICAgICAgICAgICAgdmFyIG5zdGFydCA9IGo7XG4gICAgICAgICAgICAgIGZvciAoKytqOyBqIDwgaSAmJiBjb3VudHNBc051bS50ZXN0KHR5cGVzW2pdKTsgKytqKSB7fVxuICAgICAgICAgICAgICBvcmRlci5zcGxpY2UoYXQsIDAsIG5ldyBCaWRpU3BhbigyLCBuc3RhcnQsIGopKTtcbiAgICAgICAgICAgICAgcG9zID0gajtcbiAgICAgICAgICAgIH0gZWxzZSArK2o7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwb3MgPCBpKSBvcmRlci5zcGxpY2UoYXQsIDAsIG5ldyBCaWRpU3BhbigxLCBwb3MsIGkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9yZGVyWzBdLmxldmVsID09IDEgJiYgKG0gPSBzdHIubWF0Y2goL15cXHMrLykpKSB7XG4gICAgICAgIG9yZGVyWzBdLmZyb20gPSBtWzBdLmxlbmd0aDtcbiAgICAgICAgb3JkZXIudW5zaGlmdChuZXcgQmlkaVNwYW4oMCwgMCwgbVswXS5sZW5ndGgpKTtcbiAgICAgIH1cbiAgICAgIGlmIChsc3Qob3JkZXIpLmxldmVsID09IDEgJiYgKG0gPSBzdHIubWF0Y2goL1xccyskLykpKSB7XG4gICAgICAgIGxzdChvcmRlcikudG8gLT0gbVswXS5sZW5ndGg7XG4gICAgICAgIG9yZGVyLnB1c2gobmV3IEJpZGlTcGFuKDAsIGxlbiAtIG1bMF0ubGVuZ3RoLCBsZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcmRlclswXS5sZXZlbCAhPSBsc3Qob3JkZXIpLmxldmVsKVxuICAgICAgICBvcmRlci5wdXNoKG5ldyBCaWRpU3BhbihvcmRlclswXS5sZXZlbCwgbGVuLCBsZW4pKTtcblxuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH07XG4gIH0pKCk7XG5cbiAgLy8gVEhFIEVORFxuXG4gIENvZGVNaXJyb3IudmVyc2lvbiA9IFwiNC4yLjBcIjtcblxuICByZXR1cm4gQ29kZU1pcnJvcjtcbn0pO1xuIiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4vLyBUT0RPIGFjdHVhbGx5IHJlY29nbml6ZSBzeW50YXggb2YgVHlwZVNjcmlwdCBjb25zdHJ1Y3RzXG5cbihmdW5jdGlvbihtb2QpIHtcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSA9PSBcIm9iamVjdFwiKSAvLyBDb21tb25KU1xuICAgIG1vZChyZXF1aXJlKFwiLi4vLi4vbGliL2NvZGVtaXJyb3JcIikpO1xuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSAvLyBBTURcbiAgICBkZWZpbmUoW1wiLi4vLi4vbGliL2NvZGVtaXJyb3JcIl0sIG1vZCk7XG4gIGVsc2UgLy8gUGxhaW4gYnJvd3NlciBlbnZcbiAgICBtb2QoQ29kZU1pcnJvcik7XG59KShmdW5jdGlvbihDb2RlTWlycm9yKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuQ29kZU1pcnJvci5kZWZpbmVNb2RlKFwiamF2YXNjcmlwdFwiLCBmdW5jdGlvbihjb25maWcsIHBhcnNlckNvbmZpZykge1xuICB2YXIgaW5kZW50VW5pdCA9IGNvbmZpZy5pbmRlbnRVbml0O1xuICB2YXIgc3RhdGVtZW50SW5kZW50ID0gcGFyc2VyQ29uZmlnLnN0YXRlbWVudEluZGVudDtcbiAgdmFyIGpzb25sZE1vZGUgPSBwYXJzZXJDb25maWcuanNvbmxkO1xuICB2YXIganNvbk1vZGUgPSBwYXJzZXJDb25maWcuanNvbiB8fCBqc29ubGRNb2RlO1xuICB2YXIgaXNUUyA9IHBhcnNlckNvbmZpZy50eXBlc2NyaXB0O1xuXG4gIC8vIFRva2VuaXplclxuXG4gIHZhciBrZXl3b3JkcyA9IGZ1bmN0aW9uKCl7XG4gICAgZnVuY3Rpb24ga3codHlwZSkge3JldHVybiB7dHlwZTogdHlwZSwgc3R5bGU6IFwia2V5d29yZFwifTt9XG4gICAgdmFyIEEgPSBrdyhcImtleXdvcmQgYVwiKSwgQiA9IGt3KFwia2V5d29yZCBiXCIpLCBDID0ga3coXCJrZXl3b3JkIGNcIik7XG4gICAgdmFyIG9wZXJhdG9yID0ga3coXCJvcGVyYXRvclwiKSwgYXRvbSA9IHt0eXBlOiBcImF0b21cIiwgc3R5bGU6IFwiYXRvbVwifTtcblxuICAgIHZhciBqc0tleXdvcmRzID0ge1xuICAgICAgXCJpZlwiOiBrdyhcImlmXCIpLCBcIndoaWxlXCI6IEEsIFwid2l0aFwiOiBBLCBcImVsc2VcIjogQiwgXCJkb1wiOiBCLCBcInRyeVwiOiBCLCBcImZpbmFsbHlcIjogQixcbiAgICAgIFwicmV0dXJuXCI6IEMsIFwiYnJlYWtcIjogQywgXCJjb250aW51ZVwiOiBDLCBcIm5ld1wiOiBDLCBcImRlbGV0ZVwiOiBDLCBcInRocm93XCI6IEMsIFwiZGVidWdnZXJcIjogQyxcbiAgICAgIFwidmFyXCI6IGt3KFwidmFyXCIpLCBcImNvbnN0XCI6IGt3KFwidmFyXCIpLCBcImxldFwiOiBrdyhcInZhclwiKSxcbiAgICAgIFwiZnVuY3Rpb25cIjoga3coXCJmdW5jdGlvblwiKSwgXCJjYXRjaFwiOiBrdyhcImNhdGNoXCIpLFxuICAgICAgXCJmb3JcIjoga3coXCJmb3JcIiksIFwic3dpdGNoXCI6IGt3KFwic3dpdGNoXCIpLCBcImNhc2VcIjoga3coXCJjYXNlXCIpLCBcImRlZmF1bHRcIjoga3coXCJkZWZhdWx0XCIpLFxuICAgICAgXCJpblwiOiBvcGVyYXRvciwgXCJ0eXBlb2ZcIjogb3BlcmF0b3IsIFwiaW5zdGFuY2VvZlwiOiBvcGVyYXRvcixcbiAgICAgIFwidHJ1ZVwiOiBhdG9tLCBcImZhbHNlXCI6IGF0b20sIFwibnVsbFwiOiBhdG9tLCBcInVuZGVmaW5lZFwiOiBhdG9tLCBcIk5hTlwiOiBhdG9tLCBcIkluZmluaXR5XCI6IGF0b20sXG4gICAgICBcInRoaXNcIjoga3coXCJ0aGlzXCIpLCBcIm1vZHVsZVwiOiBrdyhcIm1vZHVsZVwiKSwgXCJjbGFzc1wiOiBrdyhcImNsYXNzXCIpLCBcInN1cGVyXCI6IGt3KFwiYXRvbVwiKSxcbiAgICAgIFwieWllbGRcIjogQywgXCJleHBvcnRcIjoga3coXCJleHBvcnRcIiksIFwiaW1wb3J0XCI6IGt3KFwiaW1wb3J0XCIpLCBcImV4dGVuZHNcIjogQ1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgdGhlICdub3JtYWwnIGtleXdvcmRzIHdpdGggdGhlIFR5cGVTY3JpcHQgbGFuZ3VhZ2UgZXh0ZW5zaW9uc1xuICAgIGlmIChpc1RTKSB7XG4gICAgICB2YXIgdHlwZSA9IHt0eXBlOiBcInZhcmlhYmxlXCIsIHN0eWxlOiBcInZhcmlhYmxlLTNcIn07XG4gICAgICB2YXIgdHNLZXl3b3JkcyA9IHtcbiAgICAgICAgLy8gb2JqZWN0LWxpa2UgdGhpbmdzXG4gICAgICAgIFwiaW50ZXJmYWNlXCI6IGt3KFwiaW50ZXJmYWNlXCIpLFxuICAgICAgICBcImV4dGVuZHNcIjoga3coXCJleHRlbmRzXCIpLFxuICAgICAgICBcImNvbnN0cnVjdG9yXCI6IGt3KFwiY29uc3RydWN0b3JcIiksXG5cbiAgICAgICAgLy8gc2NvcGUgbW9kaWZpZXJzXG4gICAgICAgIFwicHVibGljXCI6IGt3KFwicHVibGljXCIpLFxuICAgICAgICBcInByaXZhdGVcIjoga3coXCJwcml2YXRlXCIpLFxuICAgICAgICBcInByb3RlY3RlZFwiOiBrdyhcInByb3RlY3RlZFwiKSxcbiAgICAgICAgXCJzdGF0aWNcIjoga3coXCJzdGF0aWNcIiksXG5cbiAgICAgICAgLy8gdHlwZXNcbiAgICAgICAgXCJzdHJpbmdcIjogdHlwZSwgXCJudW1iZXJcIjogdHlwZSwgXCJib29sXCI6IHR5cGUsIFwiYW55XCI6IHR5cGVcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGF0dHIgaW4gdHNLZXl3b3Jkcykge1xuICAgICAgICBqc0tleXdvcmRzW2F0dHJdID0gdHNLZXl3b3Jkc1thdHRyXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNLZXl3b3JkcztcbiAgfSgpO1xuXG4gIHZhciBpc09wZXJhdG9yQ2hhciA9IC9bK1xcLSomJT08PiE/fH5eXS87XG4gIHZhciBpc0pzb25sZEtleXdvcmQgPSAvXkAoY29udGV4dHxpZHx2YWx1ZXxsYW5ndWFnZXx0eXBlfGNvbnRhaW5lcnxsaXN0fHNldHxyZXZlcnNlfGluZGV4fGJhc2V8dm9jYWJ8Z3JhcGgpXCIvO1xuXG4gIGZ1bmN0aW9uIHJlYWRSZWdleHAoc3RyZWFtKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dCwgaW5TZXQgPSBmYWxzZTtcbiAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICBpZiAoIWVzY2FwZWQpIHtcbiAgICAgICAgaWYgKG5leHQgPT0gXCIvXCIgJiYgIWluU2V0KSByZXR1cm47XG4gICAgICAgIGlmIChuZXh0ID09IFwiW1wiKSBpblNldCA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKGluU2V0ICYmIG5leHQgPT0gXCJdXCIpIGluU2V0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSBcIlxcXFxcIjtcbiAgICB9XG4gIH1cblxuICAvLyBVc2VkIGFzIHNjcmF0Y2ggdmFyaWFibGVzIHRvIGNvbW11bmljYXRlIG11bHRpcGxlIHZhbHVlcyB3aXRob3V0XG4gIC8vIGNvbnNpbmcgdXAgdG9ucyBvZiBvYmplY3RzLlxuICB2YXIgdHlwZSwgY29udGVudDtcbiAgZnVuY3Rpb24gcmV0KHRwLCBzdHlsZSwgY29udCkge1xuICAgIHR5cGUgPSB0cDsgY29udGVudCA9IGNvbnQ7XG4gICAgcmV0dXJuIHN0eWxlO1xuICB9XG4gIGZ1bmN0aW9uIHRva2VuQmFzZShzdHJlYW0sIHN0YXRlKSB7XG4gICAgdmFyIGNoID0gc3RyZWFtLm5leHQoKTtcbiAgICBpZiAoY2ggPT0gJ1wiJyB8fCBjaCA9PSBcIidcIikge1xuICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblN0cmluZyhjaCk7XG4gICAgICByZXR1cm4gc3RhdGUudG9rZW5pemUoc3RyZWFtLCBzdGF0ZSk7XG4gICAgfSBlbHNlIGlmIChjaCA9PSBcIi5cIiAmJiBzdHJlYW0ubWF0Y2goL15cXGQrKD86W2VFXVsrXFwtXT9cXGQrKT8vKSkge1xuICAgICAgcmV0dXJuIHJldChcIm51bWJlclwiLCBcIm51bWJlclwiKTtcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiLlwiICYmIHN0cmVhbS5tYXRjaChcIi4uXCIpKSB7XG4gICAgICByZXR1cm4gcmV0KFwic3ByZWFkXCIsIFwibWV0YVwiKTtcbiAgICB9IGVsc2UgaWYgKC9bXFxbXFxde31cXChcXCksO1xcOlxcLl0vLnRlc3QoY2gpKSB7XG4gICAgICByZXR1cm4gcmV0KGNoKTtcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiPVwiICYmIHN0cmVhbS5lYXQoXCI+XCIpKSB7XG4gICAgICByZXR1cm4gcmV0KFwiPT5cIiwgXCJvcGVyYXRvclwiKTtcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiMFwiICYmIHN0cmVhbS5lYXQoL3gvaSkpIHtcbiAgICAgIHN0cmVhbS5lYXRXaGlsZSgvW1xcZGEtZl0vaSk7XG4gICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgIH0gZWxzZSBpZiAoL1xcZC8udGVzdChjaCkpIHtcbiAgICAgIHN0cmVhbS5tYXRjaCgvXlxcZCooPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy8pO1xuICAgICAgcmV0dXJuIHJldChcIm51bWJlclwiLCBcIm51bWJlclwiKTtcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiL1wiKSB7XG4gICAgICBpZiAoc3RyZWFtLmVhdChcIipcIikpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkNvbW1lbnQ7XG4gICAgICAgIHJldHVybiB0b2tlbkNvbW1lbnQoc3RyZWFtLCBzdGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHN0cmVhbS5lYXQoXCIvXCIpKSB7XG4gICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgICAgcmV0dXJuIHJldChcImNvbW1lbnRcIiwgXCJjb21tZW50XCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgc3RhdGUubGFzdFR5cGUgPT0gXCJrZXl3b3JkIGNcIiB8fFxuICAgICAgICAgICAgICAgc3RhdGUubGFzdFR5cGUgPT0gXCJzb2ZcIiB8fCAvXltcXFt7fVxcKCw7Ol0kLy50ZXN0KHN0YXRlLmxhc3RUeXBlKSkge1xuICAgICAgICByZWFkUmVnZXhwKHN0cmVhbSk7XG4gICAgICAgIHN0cmVhbS5lYXRXaGlsZSgvW2dpbXldLyk7IC8vICd5JyBpcyBcInN0aWNreVwiIG9wdGlvbiBpbiBNb3ppbGxhXG4gICAgICAgIHJldHVybiByZXQoXCJyZWdleHBcIiwgXCJzdHJpbmctMlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cmVhbS5lYXRXaGlsZShpc09wZXJhdG9yQ2hhcik7XG4gICAgICAgIHJldHVybiByZXQoXCJvcGVyYXRvclwiLCBcIm9wZXJhdG9yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gXCJgXCIpIHtcbiAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaTtcbiAgICAgIHJldHVybiB0b2tlblF1YXNpKHN0cmVhbSwgc3RhdGUpO1xuICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIjXCIpIHtcbiAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgIHJldHVybiByZXQoXCJlcnJvclwiLCBcImVycm9yXCIpO1xuICAgIH0gZWxzZSBpZiAoaXNPcGVyYXRvckNoYXIudGVzdChjaCkpIHtcbiAgICAgIHN0cmVhbS5lYXRXaGlsZShpc09wZXJhdG9yQ2hhcik7XG4gICAgICByZXR1cm4gcmV0KFwib3BlcmF0b3JcIiwgXCJvcGVyYXRvclwiLCBzdHJlYW0uY3VycmVudCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyZWFtLmVhdFdoaWxlKC9bXFx3XFwkX10vKTtcbiAgICAgIHZhciB3b3JkID0gc3RyZWFtLmN1cnJlbnQoKSwga25vd24gPSBrZXl3b3Jkcy5wcm9wZXJ0eUlzRW51bWVyYWJsZSh3b3JkKSAmJiBrZXl3b3Jkc1t3b3JkXTtcbiAgICAgIHJldHVybiAoa25vd24gJiYgc3RhdGUubGFzdFR5cGUgIT0gXCIuXCIpID8gcmV0KGtub3duLnR5cGUsIGtub3duLnN0eWxlLCB3b3JkKSA6XG4gICAgICAgICAgICAgICAgICAgICByZXQoXCJ2YXJpYWJsZVwiLCBcInZhcmlhYmxlXCIsIHdvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRva2VuU3RyaW5nKHF1b3RlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsIG5leHQ7XG4gICAgICBpZiAoanNvbmxkTW9kZSAmJiBzdHJlYW0ucGVlaygpID09IFwiQFwiICYmIHN0cmVhbS5tYXRjaChpc0pzb25sZEtleXdvcmQpKXtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgIHJldHVybiByZXQoXCJqc29ubGQta2V5d29yZFwiLCBcIm1ldGFcIik7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChuZXh0ID09IHF1b3RlICYmICFlc2NhcGVkKSBicmVhaztcbiAgICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gXCJcXFxcXCI7XG4gICAgICB9XG4gICAgICBpZiAoIWVzY2FwZWQpIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgcmV0dXJuIHJldChcInN0cmluZ1wiLCBcInN0cmluZ1wiKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpIHtcbiAgICB2YXIgbWF5YmVFbmQgPSBmYWxzZSwgY2g7XG4gICAgd2hpbGUgKGNoID0gc3RyZWFtLm5leHQoKSkge1xuICAgICAgaWYgKGNoID09IFwiL1wiICYmIG1heWJlRW5kKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1heWJlRW5kID0gKGNoID09IFwiKlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldChcImNvbW1lbnRcIiwgXCJjb21tZW50XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9rZW5RdWFzaShzdHJlYW0sIHN0YXRlKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dDtcbiAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICBpZiAoIWVzY2FwZWQgJiYgKG5leHQgPT0gXCJgXCIgfHwgbmV4dCA9PSBcIiRcIiAmJiBzdHJlYW0uZWF0KFwie1wiKSkpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gXCJcXFxcXCI7XG4gICAgfVxuICAgIHJldHVybiByZXQoXCJxdWFzaVwiLCBcInN0cmluZy0yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICB9XG5cbiAgdmFyIGJyYWNrZXRzID0gXCIoW3t9XSlcIjtcbiAgLy8gVGhpcyBpcyBhIGNydWRlIGxvb2thaGVhZCB0cmljayB0byB0cnkgYW5kIG5vdGljZSB0aGF0IHdlJ3JlXG4gIC8vIHBhcnNpbmcgdGhlIGFyZ3VtZW50IHBhdHRlcm5zIGZvciBhIGZhdC1hcnJvdyBmdW5jdGlvbiBiZWZvcmUgd2VcbiAgLy8gYWN0dWFsbHkgaGl0IHRoZSBhcnJvdyB0b2tlbi4gSXQgb25seSB3b3JrcyBpZiB0aGUgYXJyb3cgaXMgb25cbiAgLy8gdGhlIHNhbWUgbGluZSBhcyB0aGUgYXJndW1lbnRzIGFuZCB0aGVyZSdzIG5vIHN0cmFuZ2Ugbm9pc2VcbiAgLy8gKGNvbW1lbnRzKSBpbiBiZXR3ZWVuLiBGYWxsYmFjayBpcyB0byBvbmx5IG5vdGljZSB3aGVuIHdlIGhpdCB0aGVcbiAgLy8gYXJyb3csIGFuZCBub3QgZGVjbGFyZSB0aGUgYXJndW1lbnRzIGFzIGxvY2FscyBmb3IgdGhlIGFycm93XG4gIC8vIGJvZHkuXG4gIGZ1bmN0aW9uIGZpbmRGYXRBcnJvdyhzdHJlYW0sIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLmZhdEFycm93QXQpIHN0YXRlLmZhdEFycm93QXQgPSBudWxsO1xuICAgIHZhciBhcnJvdyA9IHN0cmVhbS5zdHJpbmcuaW5kZXhPZihcIj0+XCIsIHN0cmVhbS5zdGFydCk7XG4gICAgaWYgKGFycm93IDwgMCkgcmV0dXJuO1xuXG4gICAgdmFyIGRlcHRoID0gMCwgc2F3U29tZXRoaW5nID0gZmFsc2U7XG4gICAgZm9yICh2YXIgcG9zID0gYXJyb3cgLSAxOyBwb3MgPj0gMDsgLS1wb3MpIHtcbiAgICAgIHZhciBjaCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyk7XG4gICAgICB2YXIgYnJhY2tldCA9IGJyYWNrZXRzLmluZGV4T2YoY2gpO1xuICAgICAgaWYgKGJyYWNrZXQgPj0gMCAmJiBicmFja2V0IDwgMykge1xuICAgICAgICBpZiAoIWRlcHRoKSB7ICsrcG9zOyBicmVhazsgfVxuICAgICAgICBpZiAoLS1kZXB0aCA9PSAwKSBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoYnJhY2tldCA+PSAzICYmIGJyYWNrZXQgPCA2KSB7XG4gICAgICAgICsrZGVwdGg7XG4gICAgICB9IGVsc2UgaWYgKC9bJFxcd10vLnRlc3QoY2gpKSB7XG4gICAgICAgIHNhd1NvbWV0aGluZyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHNhd1NvbWV0aGluZyAmJiAhZGVwdGgpIHtcbiAgICAgICAgKytwb3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2F3U29tZXRoaW5nICYmICFkZXB0aCkgc3RhdGUuZmF0QXJyb3dBdCA9IHBvcztcbiAgfVxuXG4gIC8vIFBhcnNlclxuXG4gIHZhciBhdG9taWNUeXBlcyA9IHtcImF0b21cIjogdHJ1ZSwgXCJudW1iZXJcIjogdHJ1ZSwgXCJ2YXJpYWJsZVwiOiB0cnVlLCBcInN0cmluZ1wiOiB0cnVlLCBcInJlZ2V4cFwiOiB0cnVlLCBcInRoaXNcIjogdHJ1ZSwgXCJqc29ubGQta2V5d29yZFwiOiB0cnVlfTtcblxuICBmdW5jdGlvbiBKU0xleGljYWwoaW5kZW50ZWQsIGNvbHVtbiwgdHlwZSwgYWxpZ24sIHByZXYsIGluZm8pIHtcbiAgICB0aGlzLmluZGVudGVkID0gaW5kZW50ZWQ7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnByZXYgPSBwcmV2O1xuICAgIHRoaXMuaW5mbyA9IGluZm87XG4gICAgaWYgKGFsaWduICE9IG51bGwpIHRoaXMuYWxpZ24gPSBhbGlnbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluU2NvcGUoc3RhdGUsIHZhcm5hbWUpIHtcbiAgICBmb3IgKHZhciB2ID0gc3RhdGUubG9jYWxWYXJzOyB2OyB2ID0gdi5uZXh0KVxuICAgICAgaWYgKHYubmFtZSA9PSB2YXJuYW1lKSByZXR1cm4gdHJ1ZTtcbiAgICBmb3IgKHZhciBjeCA9IHN0YXRlLmNvbnRleHQ7IGN4OyBjeCA9IGN4LnByZXYpIHtcbiAgICAgIGZvciAodmFyIHYgPSBjeC52YXJzOyB2OyB2ID0gdi5uZXh0KVxuICAgICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSlMoc3RhdGUsIHN0eWxlLCB0eXBlLCBjb250ZW50LCBzdHJlYW0pIHtcbiAgICB2YXIgY2MgPSBzdGF0ZS5jYztcbiAgICAvLyBDb21tdW5pY2F0ZSBvdXIgY29udGV4dCB0byB0aGUgY29tYmluYXRvcnMuXG4gICAgLy8gKExlc3Mgd2FzdGVmdWwgdGhhbiBjb25zaW5nIHVwIGEgaHVuZHJlZCBjbG9zdXJlcyBvbiBldmVyeSBjYWxsLilcbiAgICBjeC5zdGF0ZSA9IHN0YXRlOyBjeC5zdHJlYW0gPSBzdHJlYW07IGN4Lm1hcmtlZCA9IG51bGwsIGN4LmNjID0gY2M7XG5cbiAgICBpZiAoIXN0YXRlLmxleGljYWwuaGFzT3duUHJvcGVydHkoXCJhbGlnblwiKSlcbiAgICAgIHN0YXRlLmxleGljYWwuYWxpZ24gPSB0cnVlO1xuXG4gICAgd2hpbGUodHJ1ZSkge1xuICAgICAgdmFyIGNvbWJpbmF0b3IgPSBjYy5sZW5ndGggPyBjYy5wb3AoKSA6IGpzb25Nb2RlID8gZXhwcmVzc2lvbiA6IHN0YXRlbWVudDtcbiAgICAgIGlmIChjb21iaW5hdG9yKHR5cGUsIGNvbnRlbnQpKSB7XG4gICAgICAgIHdoaWxlKGNjLmxlbmd0aCAmJiBjY1tjYy5sZW5ndGggLSAxXS5sZXgpXG4gICAgICAgICAgY2MucG9wKCkoKTtcbiAgICAgICAgaWYgKGN4Lm1hcmtlZCkgcmV0dXJuIGN4Lm1hcmtlZDtcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmIGluU2NvcGUoc3RhdGUsIGNvbnRlbnQpKSByZXR1cm4gXCJ2YXJpYWJsZS0yXCI7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21iaW5hdG9yIHV0aWxzXG5cbiAgdmFyIGN4ID0ge3N0YXRlOiBudWxsLCBjb2x1bW46IG51bGwsIG1hcmtlZDogbnVsbCwgY2M6IG51bGx9O1xuICBmdW5jdGlvbiBwYXNzKCkge1xuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGN4LmNjLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgfVxuICBmdW5jdGlvbiBjb250KCkge1xuICAgIHBhc3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiByZWdpc3Rlcih2YXJuYW1lKSB7XG4gICAgZnVuY3Rpb24gaW5MaXN0KGxpc3QpIHtcbiAgICAgIGZvciAodmFyIHYgPSBsaXN0OyB2OyB2ID0gdi5uZXh0KVxuICAgICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgc3RhdGUgPSBjeC5zdGF0ZTtcbiAgICBpZiAoc3RhdGUuY29udGV4dCkge1xuICAgICAgY3gubWFya2VkID0gXCJkZWZcIjtcbiAgICAgIGlmIChpbkxpc3Qoc3RhdGUubG9jYWxWYXJzKSkgcmV0dXJuO1xuICAgICAgc3RhdGUubG9jYWxWYXJzID0ge25hbWU6IHZhcm5hbWUsIG5leHQ6IHN0YXRlLmxvY2FsVmFyc307XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbkxpc3Qoc3RhdGUuZ2xvYmFsVmFycykpIHJldHVybjtcbiAgICAgIGlmIChwYXJzZXJDb25maWcuZ2xvYmFsVmFycylcbiAgICAgICAgc3RhdGUuZ2xvYmFsVmFycyA9IHtuYW1lOiB2YXJuYW1lLCBuZXh0OiBzdGF0ZS5nbG9iYWxWYXJzfTtcbiAgICB9XG4gIH1cblxuICAvLyBDb21iaW5hdG9yc1xuXG4gIHZhciBkZWZhdWx0VmFycyA9IHtuYW1lOiBcInRoaXNcIiwgbmV4dDoge25hbWU6IFwiYXJndW1lbnRzXCJ9fTtcbiAgZnVuY3Rpb24gcHVzaGNvbnRleHQoKSB7XG4gICAgY3guc3RhdGUuY29udGV4dCA9IHtwcmV2OiBjeC5zdGF0ZS5jb250ZXh0LCB2YXJzOiBjeC5zdGF0ZS5sb2NhbFZhcnN9O1xuICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGRlZmF1bHRWYXJzO1xuICB9XG4gIGZ1bmN0aW9uIHBvcGNvbnRleHQoKSB7XG4gICAgY3guc3RhdGUubG9jYWxWYXJzID0gY3guc3RhdGUuY29udGV4dC52YXJzO1xuICAgIGN4LnN0YXRlLmNvbnRleHQgPSBjeC5zdGF0ZS5jb250ZXh0LnByZXY7XG4gIH1cbiAgZnVuY3Rpb24gcHVzaGxleCh0eXBlLCBpbmZvKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGUsIGluZGVudCA9IHN0YXRlLmluZGVudGVkO1xuICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSBcInN0YXRcIikgaW5kZW50ID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgIHN0YXRlLmxleGljYWwgPSBuZXcgSlNMZXhpY2FsKGluZGVudCwgY3guc3RyZWFtLmNvbHVtbigpLCB0eXBlLCBudWxsLCBzdGF0ZS5sZXhpY2FsLCBpbmZvKTtcbiAgICB9O1xuICAgIHJlc3VsdC5sZXggPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gcG9wbGV4KCkge1xuICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlO1xuICAgIGlmIChzdGF0ZS5sZXhpY2FsLnByZXYpIHtcbiAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gXCIpXCIpXG4gICAgICAgIHN0YXRlLmluZGVudGVkID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgIHN0YXRlLmxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLnByZXY7XG4gICAgfVxuICB9XG4gIHBvcGxleC5sZXggPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGV4cGVjdCh3YW50ZWQpIHtcbiAgICBmdW5jdGlvbiBleHAodHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT0gd2FudGVkKSByZXR1cm4gY29udCgpO1xuICAgICAgZWxzZSBpZiAod2FudGVkID09IFwiO1wiKSByZXR1cm4gcGFzcygpO1xuICAgICAgZWxzZSByZXR1cm4gY29udChleHApO1xuICAgIH07XG4gICAgcmV0dXJuIGV4cDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXRlbWVudCh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJ2YXJkZWZcIiwgdmFsdWUubGVuZ3RoKSwgdmFyZGVmLCBleHBlY3QoXCI7XCIpLCBwb3BsZXgpO1xuICAgIGlmICh0eXBlID09IFwia2V5d29yZCBhXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBleHByZXNzaW9uLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGJcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHN0YXRlbWVudCwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIn1cIiksIGJsb2NrLCBwb3BsZXgpO1xuICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udCgpO1xuICAgIGlmICh0eXBlID09IFwiaWZcIikge1xuICAgICAgaWYgKGN4LnN0YXRlLmxleGljYWwuaW5mbyA9PSBcImVsc2VcIiAmJiBjeC5zdGF0ZS5jY1tjeC5zdGF0ZS5jYy5sZW5ndGggLSAxXSA9PSBwb3BsZXgpXG4gICAgICAgIGN4LnN0YXRlLmNjLnBvcCgpKCk7XG4gICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgZXhwcmVzc2lvbiwgc3RhdGVtZW50LCBwb3BsZXgsIG1heWJlZWxzZSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgIGlmICh0eXBlID09IFwiZm9yXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBmb3JzcGVjLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgbWF5YmVsYWJlbCk7XG4gICAgaWYgKHR5cGUgPT0gXCJzd2l0Y2hcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIGV4cHJlc3Npb24sIHB1c2hsZXgoXCJ9XCIsIFwic3dpdGNoXCIpLCBleHBlY3QoXCJ7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jaywgcG9wbGV4LCBwb3BsZXgpO1xuICAgIGlmICh0eXBlID09IFwiY2FzZVwiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI6XCIpKTtcbiAgICBpZiAodHlwZSA9PSBcImRlZmF1bHRcIikgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSk7XG4gICAgaWYgKHR5cGUgPT0gXCJjYXRjaFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgcHVzaGNvbnRleHQsIGV4cGVjdChcIihcIiksIGZ1bmFyZywgZXhwZWN0KFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsIHBvcGxleCwgcG9wY29udGV4dCk7XG4gICAgaWYgKHR5cGUgPT0gXCJtb2R1bGVcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHB1c2hjb250ZXh0LCBhZnRlck1vZHVsZSwgcG9wY29udGV4dCwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcImNsYXNzXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBjbGFzc05hbWUsIG9iamxpdCwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcImV4cG9ydFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgYWZ0ZXJFeHBvcnQsIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJpbXBvcnRcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIGFmdGVySW1wb3J0LCBwb3BsZXgpO1xuICAgIHJldHVybiBwYXNzKHB1c2hsZXgoXCJzdGF0XCIpLCBleHByZXNzaW9uLCBleHBlY3QoXCI7XCIpLCBwb3BsZXgpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb24odHlwZSkge1xuICAgIHJldHVybiBleHByZXNzaW9uSW5uZXIodHlwZSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb25Ob0NvbW1hKHR5cGUpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb25Jbm5lcih0eXBlLCBub0NvbW1hKSB7XG4gICAgaWYgKGN4LnN0YXRlLmZhdEFycm93QXQgPT0gY3guc3RyZWFtLnN0YXJ0KSB7XG4gICAgICB2YXIgYm9keSA9IG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5O1xuICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBwdXNobGV4KFwiKVwiKSwgY29tbWFzZXAocGF0dGVybiwgXCIpXCIpLCBwb3BsZXgsIGV4cGVjdChcIj0+XCIpLCBib2R5LCBwb3Bjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhwdXNoY29udGV4dCwgcGF0dGVybiwgZXhwZWN0KFwiPT5cIiksIGJvZHksIHBvcGNvbnRleHQpO1xuICAgIH1cblxuICAgIHZhciBtYXliZW9wID0gbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hO1xuICAgIGlmIChhdG9taWNUeXBlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgcmV0dXJuIGNvbnQobWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29udChmdW5jdGlvbmRlZiwgbWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGNcIikgcmV0dXJuIGNvbnQobm9Db21tYSA/IG1heWJlZXhwcmVzc2lvbk5vQ29tbWEgOiBtYXliZWV4cHJlc3Npb24pO1xuICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiKVwiKSwgbWF5YmVleHByZXNzaW9uLCBjb21wcmVoZW5zaW9uLCBleHBlY3QoXCIpXCIpLCBwb3BsZXgsIG1heWJlb3ApO1xuICAgIGlmICh0eXBlID09IFwib3BlcmF0b3JcIiB8fCB0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KG5vQ29tbWEgPyBleHByZXNzaW9uTm9Db21tYSA6IGV4cHJlc3Npb24pO1xuICAgIGlmICh0eXBlID09IFwiW1wiKSByZXR1cm4gY29udChwdXNobGV4KFwiXVwiKSwgYXJyYXlMaXRlcmFsLCBwb3BsZXgsIG1heWJlb3ApO1xuICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKG9ianByb3AsIFwifVwiLCBudWxsLCBtYXliZW9wKTtcbiAgICBpZiAodHlwZSA9PSBcInF1YXNpXCIpIHsgcmV0dXJuIHBhc3MocXVhc2ksIG1heWJlb3ApOyB9XG4gICAgcmV0dXJuIGNvbnQoKTtcbiAgfVxuICBmdW5jdGlvbiBtYXliZWV4cHJlc3Npb24odHlwZSkge1xuICAgIGlmICh0eXBlLm1hdGNoKC9bO1xcfVxcKVxcXSxdLykpIHJldHVybiBwYXNzKCk7XG4gICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVleHByZXNzaW9uTm9Db21tYSh0eXBlKSB7XG4gICAgaWYgKHR5cGUubWF0Y2goL1s7XFx9XFwpXFxdLF0vKSkgcmV0dXJuIHBhc3MoKTtcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYXliZW9wZXJhdG9yQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVvcGVyYXRvck5vQ29tbWEodHlwZSwgdmFsdWUsIG5vQ29tbWEpIHtcbiAgICB2YXIgbWUgPSBub0NvbW1hID09IGZhbHNlID8gbWF5YmVvcGVyYXRvckNvbW1hIDogbWF5YmVvcGVyYXRvck5vQ29tbWE7XG4gICAgdmFyIGV4cHIgPSBub0NvbW1hID09IGZhbHNlID8gZXhwcmVzc2lvbiA6IGV4cHJlc3Npb25Ob0NvbW1hO1xuICAgIGlmICh2YWx1ZSA9PSBcIj0+XCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBub0NvbW1hID8gYXJyb3dCb2R5Tm9Db21tYSA6IGFycm93Qm9keSwgcG9wY29udGV4dCk7XG4gICAgaWYgKHR5cGUgPT0gXCJvcGVyYXRvclwiKSB7XG4gICAgICBpZiAoL1xcK1xcK3wtLS8udGVzdCh2YWx1ZSkpIHJldHVybiBjb250KG1lKTtcbiAgICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiOlwiKSwgZXhwcik7XG4gICAgICByZXR1cm4gY29udChleHByKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJxdWFzaVwiKSB7IHJldHVybiBwYXNzKHF1YXNpLCBtZSk7IH1cbiAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuO1xuICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udENvbW1hc2VwKGV4cHJlc3Npb25Ob0NvbW1hLCBcIilcIiwgXCJjYWxsXCIsIG1lKTtcbiAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIGNvbnQocHJvcGVydHksIG1lKTtcbiAgICBpZiAodHlwZSA9PSBcIltcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIl1cIiksIG1heWJlZXhwcmVzc2lvbiwgZXhwZWN0KFwiXVwiKSwgcG9wbGV4LCBtZSk7XG4gIH1cbiAgZnVuY3Rpb24gcXVhc2kodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSAhPSBcInF1YXNpXCIpIHJldHVybiBwYXNzKCk7XG4gICAgaWYgKHZhbHVlLnNsaWNlKHZhbHVlLmxlbmd0aCAtIDIpICE9IFwiJHtcIikgcmV0dXJuIGNvbnQocXVhc2kpO1xuICAgIHJldHVybiBjb250KGV4cHJlc3Npb24sIGNvbnRpbnVlUXVhc2kpO1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRpbnVlUXVhc2kodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwifVwiKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcInN0cmluZy0yXCI7XG4gICAgICBjeC5zdGF0ZS50b2tlbml6ZSA9IHRva2VuUXVhc2k7XG4gICAgICByZXR1cm4gY29udChxdWFzaSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFycm93Qm9keSh0eXBlKSB7XG4gICAgZmluZEZhdEFycm93KGN4LnN0cmVhbSwgY3guc3RhdGUpO1xuICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gcGFzcyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24pO1xuICB9XG4gIGZ1bmN0aW9uIGFycm93Qm9keU5vQ29tbWEodHlwZSkge1xuICAgIGZpbmRGYXRBcnJvdyhjeC5zdHJlYW0sIGN4LnN0YXRlKTtcbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIHBhc3Moc3RhdGVtZW50KTtcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVsYWJlbCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHBvcGxleCwgc3RhdGVtZW50KTtcbiAgICByZXR1cm4gcGFzcyhtYXliZW9wZXJhdG9yQ29tbWEsIGV4cGVjdChcIjtcIiksIHBvcGxleCk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvcGVydHkodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge2N4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjsgcmV0dXJuIGNvbnQoKTt9XG4gIH1cbiAgZnVuY3Rpb24gb2JqcHJvcCh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgaWYgKHZhbHVlID09IFwiZ2V0XCIgfHwgdmFsdWUgPT0gXCJzZXRcIikgcmV0dXJuIGNvbnQoZ2V0dGVyU2V0dGVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IGpzb25sZE1vZGUgPyBcInByb3BlcnR5XCIgOiAodHlwZSArIFwiIHByb3BlcnR5XCIpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIltcIikge1xuICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiXVwiKSwgYWZ0ZXJwcm9wKTtcbiAgICB9XG4gICAgaWYgKGF0b21pY1R5cGVzLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gY29udChhZnRlcnByb3ApO1xuICB9XG4gIGZ1bmN0aW9uIGdldHRlclNldHRlcih0eXBlKSB7XG4gICAgaWYgKHR5cGUgIT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhhZnRlcnByb3ApO1xuICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICByZXR1cm4gY29udChmdW5jdGlvbmRlZik7XG4gIH1cbiAgZnVuY3Rpb24gYWZ0ZXJwcm9wKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gcGFzcyhmdW5jdGlvbmRlZik7XG4gIH1cbiAgZnVuY3Rpb24gY29tbWFzZXAod2hhdCwgZW5kKSB7XG4gICAgZnVuY3Rpb24gcHJvY2VlZCh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PSBcIixcIikge1xuICAgICAgICB2YXIgbGV4ID0gY3guc3RhdGUubGV4aWNhbDtcbiAgICAgICAgaWYgKGxleC5pbmZvID09IFwiY2FsbFwiKSBsZXgucG9zID0gKGxleC5wb3MgfHwgMCkgKyAxO1xuICAgICAgICByZXR1cm4gY29udCh3aGF0LCBwcm9jZWVkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09IGVuZCkgcmV0dXJuIGNvbnQoKTtcbiAgICAgIHJldHVybiBjb250KGV4cGVjdChlbmQpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09IGVuZCkgcmV0dXJuIGNvbnQoKTtcbiAgICAgIHJldHVybiBwYXNzKHdoYXQsIHByb2NlZWQpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gY29udENvbW1hc2VwKHdoYXQsIGVuZCwgaW5mbykge1xuICAgIGZvciAodmFyIGkgPSAzOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgY3guY2MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIHJldHVybiBjb250KHB1c2hsZXgoZW5kLCBpbmZvKSwgY29tbWFzZXAod2hhdCwgZW5kKSwgcG9wbGV4KTtcbiAgfVxuICBmdW5jdGlvbiBibG9jayh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50LCBibG9jayk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmV0eXBlKHR5cGUpIHtcbiAgICBpZiAoaXNUUyAmJiB0eXBlID09IFwiOlwiKSByZXR1cm4gY29udCh0eXBlZGVmKTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlZGVmKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpe2N4Lm1hcmtlZCA9IFwidmFyaWFibGUtM1wiOyByZXR1cm4gY29udCgpO31cbiAgfVxuICBmdW5jdGlvbiB2YXJkZWYoKSB7XG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbiwgdmFyZGVmQ29udCk7XG4gIH1cbiAgZnVuY3Rpb24gcGF0dGVybih0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgeyByZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KCk7IH1cbiAgICBpZiAodHlwZSA9PSBcIltcIikgcmV0dXJuIGNvbnRDb21tYXNlcChwYXR0ZXJuLCBcIl1cIik7XG4gICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAocHJvcHBhdHRlcm4sIFwifVwiKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9wcGF0dGVybih0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIiAmJiAhY3guc3RyZWFtLm1hdGNoKC9eXFxzKjovLCBmYWxzZSkpIHtcbiAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgIHJldHVybiBjb250KG1heWJlQXNzaWduKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSwgcGF0dGVybiwgbWF5YmVBc3NpZ24pO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlQXNzaWduKF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICB9XG4gIGZ1bmN0aW9uIHZhcmRlZkNvbnQodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwiLFwiKSByZXR1cm4gY29udCh2YXJkZWYpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlZWxzZSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwia2V5d29yZCBiXCIgJiYgdmFsdWUgPT0gXCJlbHNlXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIsIFwiZWxzZVwiKSwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICB9XG4gIGZ1bmN0aW9uIGZvcnNwZWModHlwZSkge1xuICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiKVwiKSwgZm9yc3BlYzEsIGV4cGVjdChcIilcIiksIHBvcGxleCk7XG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYzEodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyXCIpIHJldHVybiBjb250KHZhcmRlZiwgZXhwZWN0KFwiO1wiKSwgZm9yc3BlYzIpO1xuICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udChmb3JzcGVjMik7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gY29udChmb3JtYXliZWlub2YpO1xuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGV4cGVjdChcIjtcIiksIGZvcnNwZWMyKTtcbiAgfVxuICBmdW5jdGlvbiBmb3JtYXliZWlub2YoX3R5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiaW5cIiB8fCB2YWx1ZSA9PSBcIm9mXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cHJlc3Npb24pOyB9XG4gICAgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvckNvbW1hLCBmb3JzcGVjMik7XG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYzIodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzMpO1xuICAgIGlmICh2YWx1ZSA9PSBcImluXCIgfHwgdmFsdWUgPT0gXCJvZlwiKSB7IGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiOyByZXR1cm4gY29udChleHByZXNzaW9uKTsgfVxuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGV4cGVjdChcIjtcIiksIGZvcnNwZWMzKTtcbiAgfVxuICBmdW5jdGlvbiBmb3JzcGVjMyh0eXBlKSB7XG4gICAgaWYgKHR5cGUgIT0gXCIpXCIpIGNvbnQoZXhwcmVzc2lvbik7XG4gIH1cbiAgZnVuY3Rpb24gZnVuY3Rpb25kZWYodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHtjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO31cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtyZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTt9XG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBwdXNobGV4KFwiKVwiKSwgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksIHBvcGxleCwgc3RhdGVtZW50LCBwb3Bjb250ZXh0KTtcbiAgfVxuICBmdW5jdGlvbiBmdW5hcmcodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KGZ1bmFyZyk7XG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlKTtcbiAgfVxuICBmdW5jdGlvbiBjbGFzc05hbWUodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtyZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KGNsYXNzTmFtZUFmdGVyKTt9XG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NOYW1lQWZ0ZXIoX3R5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiZXh0ZW5kc1wiKSByZXR1cm4gY29udChleHByZXNzaW9uKTtcbiAgfVxuICBmdW5jdGlvbiBvYmpsaXQodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKG9ianByb3AsIFwifVwiKTtcbiAgfVxuICBmdW5jdGlvbiBhZnRlck1vZHVsZSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwic3RyaW5nXCIpIHJldHVybiBjb250KHN0YXRlbWVudCk7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7IHJlZ2lzdGVyKHZhbHVlKTsgcmV0dXJuIGNvbnQobWF5YmVGcm9tKTsgfVxuICB9XG4gIGZ1bmN0aW9uIGFmdGVyRXhwb3J0KF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcIipcIikgeyBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQobWF5YmVGcm9tLCBleHBlY3QoXCI7XCIpKTsgfVxuICAgIGlmICh2YWx1ZSA9PSBcImRlZmF1bHRcIikgeyBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiO1wiKSk7IH1cbiAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQpO1xuICB9XG4gIGZ1bmN0aW9uIGFmdGVySW1wb3J0KHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcInN0cmluZ1wiKSByZXR1cm4gY29udCgpO1xuICAgIHJldHVybiBwYXNzKGltcG9ydFNwZWMsIG1heWJlRnJvbSk7XG4gIH1cbiAgZnVuY3Rpb24gaW1wb3J0U3BlYyh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKGltcG9ydFNwZWMsIFwifVwiKTtcbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICByZXR1cm4gY29udCgpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlRnJvbShfdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJmcm9tXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cHJlc3Npb24pOyB9XG4gIH1cbiAgZnVuY3Rpb24gYXJyYXlMaXRlcmFsKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcIl1cIikgcmV0dXJuIGNvbnQoKTtcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSwgbWF5YmVBcnJheUNvbXByZWhlbnNpb24pO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlQXJyYXlDb21wcmVoZW5zaW9uKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcImZvclwiKSByZXR1cm4gcGFzcyhjb21wcmVoZW5zaW9uLCBleHBlY3QoXCJdXCIpKTtcbiAgICBpZiAodHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoY29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsIFwiXVwiKSk7XG4gICAgcmV0dXJuIHBhc3MoY29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsIFwiXVwiKSk7XG4gIH1cbiAgZnVuY3Rpb24gY29tcHJlaGVuc2lvbih0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJmb3JcIikgcmV0dXJuIGNvbnQoZm9yc3BlYywgY29tcHJlaGVuc2lvbik7XG4gICAgaWYgKHR5cGUgPT0gXCJpZlwiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBjb21wcmVoZW5zaW9uKTtcbiAgfVxuXG4gIC8vIEludGVyZmFjZVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRTdGF0ZTogZnVuY3Rpb24oYmFzZWNvbHVtbikge1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICB0b2tlbml6ZTogdG9rZW5CYXNlLFxuICAgICAgICBsYXN0VHlwZTogXCJzb2ZcIixcbiAgICAgICAgY2M6IFtdLFxuICAgICAgICBsZXhpY2FsOiBuZXcgSlNMZXhpY2FsKChiYXNlY29sdW1uIHx8IDApIC0gaW5kZW50VW5pdCwgMCwgXCJibG9ja1wiLCBmYWxzZSksXG4gICAgICAgIGxvY2FsVmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyxcbiAgICAgICAgY29udGV4dDogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyAmJiB7dmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFyc30sXG4gICAgICAgIGluZGVudGVkOiAwXG4gICAgICB9O1xuICAgICAgaWYgKHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzICYmIHR5cGVvZiBwYXJzZXJDb25maWcuZ2xvYmFsVmFycyA9PSBcIm9iamVjdFwiKVxuICAgICAgICBzdGF0ZS5nbG9iYWxWYXJzID0gcGFyc2VyQ29uZmlnLmdsb2JhbFZhcnM7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcblxuICAgIHRva2VuOiBmdW5jdGlvbihzdHJlYW0sIHN0YXRlKSB7XG4gICAgICBpZiAoc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eShcImFsaWduXCIpKVxuICAgICAgICAgIHN0YXRlLmxleGljYWwuYWxpZ24gPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaW5kZW50ZWQgPSBzdHJlYW0uaW5kZW50YXRpb24oKTtcbiAgICAgICAgZmluZEZhdEFycm93KHN0cmVhbSwgc3RhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXRlLnRva2VuaXplICE9IHRva2VuQ29tbWVudCAmJiBzdHJlYW0uZWF0U3BhY2UoKSkgcmV0dXJuIG51bGw7XG4gICAgICB2YXIgc3R5bGUgPSBzdGF0ZS50b2tlbml6ZShzdHJlYW0sIHN0YXRlKTtcbiAgICAgIGlmICh0eXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gc3R5bGU7XG4gICAgICBzdGF0ZS5sYXN0VHlwZSA9IHR5cGUgPT0gXCJvcGVyYXRvclwiICYmIChjb250ZW50ID09IFwiKytcIiB8fCBjb250ZW50ID09IFwiLS1cIikgPyBcImluY2RlY1wiIDogdHlwZTtcbiAgICAgIHJldHVybiBwYXJzZUpTKHN0YXRlLCBzdHlsZSwgdHlwZSwgY29udGVudCwgc3RyZWFtKTtcbiAgICB9LFxuXG4gICAgaW5kZW50OiBmdW5jdGlvbihzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICBpZiAoc3RhdGUudG9rZW5pemUgPT0gdG9rZW5Db21tZW50KSByZXR1cm4gQ29kZU1pcnJvci5QYXNzO1xuICAgICAgaWYgKHN0YXRlLnRva2VuaXplICE9IHRva2VuQmFzZSkgcmV0dXJuIDA7XG4gICAgICB2YXIgZmlyc3RDaGFyID0gdGV4dEFmdGVyICYmIHRleHRBZnRlci5jaGFyQXQoMCksIGxleGljYWwgPSBzdGF0ZS5sZXhpY2FsO1xuICAgICAgLy8gS2x1ZGdlIHRvIHByZXZlbnQgJ21heWJlbHNlJyBmcm9tIGJsb2NraW5nIGxleGljYWwgc2NvcGUgcG9wc1xuICAgICAgaWYgKCEvXlxccyplbHNlXFxiLy50ZXN0KHRleHRBZnRlcikpIGZvciAodmFyIGkgPSBzdGF0ZS5jYy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgYyA9IHN0YXRlLmNjW2ldO1xuICAgICAgICBpZiAoYyA9PSBwb3BsZXgpIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgIGVsc2UgaWYgKGMgIT0gbWF5YmVlbHNlKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChsZXhpY2FsLnR5cGUgPT0gXCJzdGF0XCIgJiYgZmlyc3RDaGFyID09IFwifVwiKSBsZXhpY2FsID0gbGV4aWNhbC5wcmV2O1xuICAgICAgaWYgKHN0YXRlbWVudEluZGVudCAmJiBsZXhpY2FsLnR5cGUgPT0gXCIpXCIgJiYgbGV4aWNhbC5wcmV2LnR5cGUgPT0gXCJzdGF0XCIpXG4gICAgICAgIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICB2YXIgdHlwZSA9IGxleGljYWwudHlwZSwgY2xvc2luZyA9IGZpcnN0Q2hhciA9PSB0eXBlO1xuXG4gICAgICBpZiAodHlwZSA9PSBcInZhcmRlZlwiKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgc3RhdGUubGFzdFR5cGUgPT0gXCIsXCIgPyBsZXhpY2FsLmluZm8gKyAxIDogMCk7XG4gICAgICBlbHNlIGlmICh0eXBlID09IFwiZm9ybVwiICYmIGZpcnN0Q2hhciA9PSBcIntcIikgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQ7XG4gICAgICBlbHNlIGlmICh0eXBlID09IFwiZm9ybVwiKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIGluZGVudFVuaXQ7XG4gICAgICBlbHNlIGlmICh0eXBlID09IFwic3RhdFwiKVxuICAgICAgICByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgc3RhdGUubGFzdFR5cGUgPT0gXCIsXCIgPyBzdGF0ZW1lbnRJbmRlbnQgfHwgaW5kZW50VW5pdCA6IDApO1xuICAgICAgZWxzZSBpZiAobGV4aWNhbC5pbmZvID09IFwic3dpdGNoXCIgJiYgIWNsb3NpbmcgJiYgcGFyc2VyQ29uZmlnLmRvdWJsZUluZGVudFN3aXRjaCAhPSBmYWxzZSlcbiAgICAgICAgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQgKyAoL14oPzpjYXNlfGRlZmF1bHQpXFxiLy50ZXN0KHRleHRBZnRlcikgPyBpbmRlbnRVbml0IDogMiAqIGluZGVudFVuaXQpO1xuICAgICAgZWxzZSBpZiAobGV4aWNhbC5hbGlnbikgcmV0dXJuIGxleGljYWwuY29sdW1uICsgKGNsb3NpbmcgPyAwIDogMSk7XG4gICAgICBlbHNlIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGNsb3NpbmcgPyAwIDogaW5kZW50VW5pdCk7XG4gICAgfSxcblxuICAgIGVsZWN0cmljQ2hhcnM6IFwiOnt9XCIsXG4gICAgYmxvY2tDb21tZW50U3RhcnQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiLypcIixcbiAgICBibG9ja0NvbW1lbnRFbmQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiKi9cIixcbiAgICBsaW5lQ29tbWVudDoganNvbk1vZGUgPyBudWxsIDogXCIvL1wiLFxuICAgIGZvbGQ6IFwiYnJhY2VcIixcblxuICAgIGhlbHBlclR5cGU6IGpzb25Nb2RlID8gXCJqc29uXCIgOiBcImphdmFzY3JpcHRcIixcbiAgICBqc29ubGRNb2RlOiBqc29ubGRNb2RlLFxuICAgIGpzb25Nb2RlOiBqc29uTW9kZVxuICB9O1xufSk7XG5cbkNvZGVNaXJyb3IucmVnaXN0ZXJIZWxwZXIoXCJ3b3JkQ2hhcnNcIiwgXCJqYXZhc2NyaXB0XCIsIC9bXFxcXHckXS8pO1xuXG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJ0ZXh0L2phdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC9lY21hc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbkNvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vZWNtYXNjcmlwdFwiLCBcImphdmFzY3JpcHRcIik7XG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9qc29uXCIsIHtuYW1lOiBcImphdmFzY3JpcHRcIiwganNvbjogdHJ1ZX0pO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24veC1qc29uXCIsIHtuYW1lOiBcImphdmFzY3JpcHRcIiwganNvbjogdHJ1ZX0pO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vbGQranNvblwiLCB7bmFtZTogXCJqYXZhc2NyaXB0XCIsIGpzb25sZDogdHJ1ZX0pO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC90eXBlc2NyaXB0XCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIHR5cGVzY3JpcHQ6IHRydWUgfSk7XG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi90eXBlc2NyaXB0XCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIHR5cGVzY3JpcHQ6IHRydWUgfSk7XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufTtcblxudmFyIEhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMS4zLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNDtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz49IDEuMC4wJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChpbnZlcnNlIHx8IGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgc3RyKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gICAgdmFyIGkgPSAwLCByZXQgPSBcIlwiLCBkYXRhO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICBkYXRhLmxhc3QgID0gKGkgPT09IChjb250ZXh0Lmxlbmd0aC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbaV0sIHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYoZGF0YSkgeyBcbiAgICAgICAgICAgICAgZGF0YS5rZXkgPSBrZXk7IFxuICAgICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRba2V5XSwge2RhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihpID09PSAwKXtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IFV0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHtmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2h9KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBjb250ZXh0KTtcbiAgfSk7XG59XG5cbnZhciBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogeyAwOiAnZGVidWcnLCAxOiAnaW5mbycsIDI6ICd3YXJuJywgMzogJ2Vycm9yJyB9LFxuXG4gIC8vIFN0YXRlIGVudW1cbiAgREVCVUc6IDAsXG4gIElORk86IDEsXG4gIFdBUk46IDIsXG4gIEVSUk9SOiAzLFxuICBsZXZlbDogMyxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAobG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xuZnVuY3Rpb24gbG9nKGxldmVsLCBvYmopIHsgbG9nZ2VyLmxvZyhsZXZlbCwgb2JqKTsgfVxuXG5leHBvcnRzLmxvZyA9IGxvZzt2YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICBVdGlscy5leHRlbmQob2JqLCBvYmplY3QpO1xuICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICB2YXIgbGluZTtcbiAgaWYgKG5vZGUgJiYgbm9kZS5maXJzdExpbmUpIHtcbiAgICBsaW5lID0gbm9kZS5maXJzdExpbmU7XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gbm9kZS5maXJzdENvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcblxuZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKFwiK3J1bnRpbWVWZXJzaW9ucytcIikgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uIChcIitjb21waWxlclZlcnNpb25zK1wiKS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJJbmZvWzFdK1wiKS5cIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247Ly8gVE9ETzogUmVtb3ZlIHRoaXMgbGluZSBhbmQgYnJlYWsgdXAgY29tcGlsZVBhcnRpYWxcblxuZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlXCIpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgaWYgKGVudi5jb21waWxlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHsgZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkIH0sIGVudik7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICB2YXIgY29udGFpbmVyID0ge1xuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGZuLCBkYXRhKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgaWYoZGF0YSkge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbShpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgdmFyIHJldCA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiAocGFyYW0gIT09IGNvbW1vbikpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIGNvbW1vbik7XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBwcm9ncmFtV2l0aERlcHRoOiBlbnYuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuYW1lc3BhY2UgPSBvcHRpb25zLnBhcnRpYWwgPyBvcHRpb25zIDogZW52LFxuICAgICAgICBoZWxwZXJzLFxuICAgICAgICBwYXJ0aWFscztcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBoZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgcGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIG5hbWVzcGFjZSwgY29udGV4dCxcbiAgICAgICAgICBoZWxwZXJzLFxuICAgICAgICAgIHBhcnRpYWxzLFxuICAgICAgICAgIG9wdGlvbnMuZGF0YSk7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgZW52LlZNLmNoZWNrUmV2aXNpb24oY29udGFpbmVyLmNvbXBpbGVySW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW1XaXRoRGVwdGgoaSwgZm4sIGRhdGEgLyosICRkZXB0aCAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgW2NvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhXS5jb25jYXQoYXJncykpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gYXJncy5sZW5ndGg7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW1XaXRoRGVwdGggPSBwcm9ncmFtV2l0aERlcHRoO2Z1bmN0aW9uIHByb2dyYW0oaSwgZm4sIGRhdGEpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGEpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICB2YXIgb3B0aW9ucyA9IHsgcGFydGlhbDogdHJ1ZSwgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG5cbiAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGVzY2FwZSA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6IFwiJnF1b3Q7XCIsXG4gIFwiJ1wiOiBcIiYjeDI3O1wiLFxuICBcImBcIjogXCImI3g2MDtcIlxufTtcblxudmFyIGJhZENoYXJzID0gL1smPD5cIidgXS9nO1xudmFyIHBvc3NpYmxlID0gL1smPD5cIidgXS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXSB8fCBcIiZhbXA7XCI7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHZhbHVlKSB7XG4gIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH07XG59XG52YXIgaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nIGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICghc3RyaW5nICYmIHN0cmluZyAhPT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTsiLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl19
