"use strict";
exports.__esModule = true;
var _1 = require("../");
// --- Test 1: Basic Usage --- //
var signale = new _1.Signale();
signale.success("Operation successful");
signale.debug("Hello", "from", "L59");
signale.pending("Write release notes for 1.2.0");
signale.fatal(new Error("Unable to acquire lock"));
signale.watch("Recursively watching build directory...");
signale.complete({
    prefix: "[task]",
    message: "Fix issue #59",
    suffix: "(@klauscfhq)"
});
var optionsCustom = {
    stream: process.stdout,
    scope: "custom",
    types: {
        remind: {
            badge: "**",
            color: "yellow",
            label: "reminder"
        },
        santa: {
            badge: "🎅",
            color: "red",
            label: "santa"
        }
    }
};
var custom = new _1.Signale(optionsCustom);
custom.remind("Improve documentation.");
custom.santa("Hoho! You have an unused variable on L45.");
custom.debug("This should still work");
// --- Test 3: Overriding Default Loggers --- //
var optionsOverride = {
    types: {
        error: {
            badge: "!!",
            color: "red",
            label: "fatal error"
        },
        success: {
            badge: "++",
            color: "green",
            label: "huge success"
        }
    }
};
signale.error("Default Error Log");
signale.success("Default Success Log");
var customOverride = new _1.Signale(optionsOverride);
customOverride.error("Custom Error Log");
customOverride.success("Custom Success Log");
// --- Test 4: Scoped Loggers --- //
var optionsScope = {
    scope: "global scope"
};
var global = new _1.Signale(optionsScope);
global.success("Successful Operation");
var global2 = signale.scope("global scope");
global2.success("Hello from the global scope");
function scopedTest() {
    var outer = global2.scope("outer", "scope");
    outer.success("Hello from the outer scope");
    setTimeout(function () {
        var inner = outer.scope("inner", "scope");
        inner.success("Hello from the inner scope");
    }, 500);
}
scopedTest();
// --- Test 5: Timers --- //
signale.time("test");
signale.time();
signale.time();
setTimeout(function () {
    signale.timeEnd();
    signale.timeEnd();
    signale.timeEnd("test");
}, 500);
// --- Test 6: Configuration --- //
// Overrides any existing `package.json` config
signale.config({
    displayFilename: true,
    displayTimestamp: true,
    displayDate: false
});
signale.success("Hello from the Global scope");
function scopedConfigTest() {
    // `fooLogger` inherits the config of `signale`
    var fooLogger = signale.scope("foo scope");
    // Overrides both `signale` and `package.json` configs
    fooLogger.config({
        displayFilename: true,
        displayTimestamp: false,
        displayDate: true
    });
    fooLogger.success("Hello from the Local scope");
}
scopedConfigTest();
