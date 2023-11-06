var $5f21597d1e8deb04$exports = {};
(function(scope) {
    "use strict";
    function F(arity, fun, wrapper) {
        wrapper.a = arity;
        wrapper.f = fun;
        return wrapper;
    }
    function F2(fun) {
        return F(2, fun, function(a) {
            return function(b) {
                return fun(a, b);
            };
        });
    }
    function F3(fun) {
        return F(3, fun, function(a) {
            return function(b) {
                return function(c) {
                    return fun(a, b, c);
                };
            };
        });
    }
    function F4(fun) {
        return F(4, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return fun(a, b, c, d);
                    };
                };
            };
        });
    }
    function F5(fun) {
        return F(5, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return fun(a, b, c, d, e);
                        };
                    };
                };
            };
        });
    }
    function F6(fun) {
        return F(6, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return fun(a, b, c, d, e, f);
                            };
                        };
                    };
                };
            };
        });
    }
    function F7(fun) {
        return F(7, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return fun(a, b, c, d, e, f, g);
                                };
                            };
                        };
                    };
                };
            };
        });
    }
    function F8(fun) {
        return F(8, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return function(h) {
                                        return fun(a, b, c, d, e, f, g, h);
                                    };
                                };
                            };
                        };
                    };
                };
            };
        });
    }
    function F9(fun) {
        return F(9, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return function(h) {
                                        return function(i) {
                                            return fun(a, b, c, d, e, f, g, h, i);
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        });
    }
    function A2(fun, a, b) {
        return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
    }
    function A3(fun, a, b, c) {
        return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
    }
    function A4(fun, a, b, c, d) {
        return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
    }
    function A5(fun, a, b, c, d, e) {
        return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
    }
    function A6(fun, a, b, c, d, e, f) {
        return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
    }
    function A7(fun, a, b, c, d, e, f, g) {
        return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
    }
    function A8(fun, a, b, c, d, e, f, g, h) {
        return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
    }
    function A9(fun, a, b, c, d, e, f, g, h, i) {
        return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
    }
    console.warn("Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.");
    // EQUALITY
    function _Utils_eq(x, y) {
        for(var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack); isEqual && (pair = stack.pop()); isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack));
        return isEqual;
    }
    function _Utils_eqHelp(x, y, depth, stack) {
        if (x === y) return true;
        if (typeof x !== "object" || x === null || y === null) {
            typeof x === "function" && _Debug_crash(5);
            return false;
        }
        if (depth > 100) {
            stack.push(_Utils_Tuple2(x, y));
            return true;
        }
        /**/ if (x.$ === "Set_elm_builtin") {
            x = $elm$core$Set$toList(x);
            y = $elm$core$Set$toList(y);
        }
        if (x.$ === "RBNode_elm_builtin" || x.$ === "RBEmpty_elm_builtin") {
            x = $elm$core$Dict$toList(x);
            y = $elm$core$Dict$toList(y);
        }
        //*/
        /**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/ for(var key in x){
            if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack)) return false;
        }
        return true;
    }
    var _Utils_equal = F2(_Utils_eq);
    var _Utils_notEqual = F2(function(a, b) {
        return !_Utils_eq(a, b);
    });
    // COMPARISONS
    // Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
    // the particular integer values assigned to LT, EQ, and GT.
    function _Utils_cmp(x, y, ord) {
        if (typeof x !== "object") return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
        /**/ if (x instanceof String) {
            var a = x.valueOf();
            var b = y.valueOf();
            return a === b ? 0 : a < b ? -1 : 1;
        }
        //*/
        /**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/ /**/ if (x.$[0] === "#") return (ord = _Utils_cmp(x.a, y.a)) ? ord : (ord = _Utils_cmp(x.b, y.b)) ? ord : _Utils_cmp(x.c, y.c);
        // traverse conses until end of a list or a mismatch
        for(; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b); // WHILE_CONSES
        return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
    }
    var _Utils_lt = F2(function(a, b) {
        return _Utils_cmp(a, b) < 0;
    });
    var _Utils_le = F2(function(a, b) {
        return _Utils_cmp(a, b) < 1;
    });
    var _Utils_gt = F2(function(a, b) {
        return _Utils_cmp(a, b) > 0;
    });
    var _Utils_ge = F2(function(a, b) {
        return _Utils_cmp(a, b) >= 0;
    });
    var _Utils_compare = F2(function(x, y) {
        var n = _Utils_cmp(x, y);
        return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
    });
    // COMMON VALUES
    var _Utils_Tuple0_UNUSED = 0;
    var _Utils_Tuple0 = {
        $: "#0"
    };
    function _Utils_Tuple2_UNUSED(a, b) {
        return {
            a: a,
            b: b
        };
    }
    function _Utils_Tuple2(a, b) {
        return {
            $: "#2",
            a: a,
            b: b
        };
    }
    function _Utils_Tuple3_UNUSED(a, b, c) {
        return {
            a: a,
            b: b,
            c: c
        };
    }
    function _Utils_Tuple3(a, b, c) {
        return {
            $: "#3",
            a: a,
            b: b,
            c: c
        };
    }
    function _Utils_chr_UNUSED(c) {
        return c;
    }
    function _Utils_chr(c) {
        return new String(c);
    }
    // RECORDS
    function _Utils_update(oldRecord, updatedFields) {
        var newRecord = {};
        for(var key in oldRecord)newRecord[key] = oldRecord[key];
        for(var key in updatedFields)newRecord[key] = updatedFields[key];
        return newRecord;
    }
    // APPEND
    var _Utils_append = F2(_Utils_ap);
    function _Utils_ap(xs, ys) {
        // append Strings
        if (typeof xs === "string") return xs + ys;
        // append Lists
        if (!xs.b) return ys;
        var root = _List_Cons(xs.a, ys);
        xs = xs.b;
        for(var curr = root; xs.b; xs = xs.b)curr = curr.b = _List_Cons(xs.a, ys);
        return root;
    }
    var _List_Nil_UNUSED = {
        $: 0
    };
    var _List_Nil = {
        $: "[]"
    };
    function _List_Cons_UNUSED(hd, tl) {
        return {
            $: 1,
            a: hd,
            b: tl
        };
    }
    function _List_Cons(hd, tl) {
        return {
            $: "::",
            a: hd,
            b: tl
        };
    }
    var _List_cons = F2(_List_Cons);
    function _List_fromArray(arr) {
        var out = _List_Nil;
        for(var i = arr.length; i--;)out = _List_Cons(arr[i], out);
        return out;
    }
    function _List_toArray(xs) {
        for(var out = []; xs.b; xs = xs.b)out.push(xs.a);
        return out;
    }
    var _List_map2 = F3(function(f, xs, ys) {
        for(var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b)arr.push(A2(f, xs.a, ys.a));
        return _List_fromArray(arr);
    });
    var _List_map3 = F4(function(f, xs, ys, zs) {
        for(var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A3(f, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_map4 = F5(function(f, ws, xs, ys, zs) {
        for(var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_map5 = F6(function(f, vs, ws, xs, ys, zs) {
        for(var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_sortBy = F2(function(f, xs) {
        return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
            return _Utils_cmp(f(a), f(b));
        }));
    });
    var _List_sortWith = F2(function(f, xs) {
        return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
            var ord = A2(f, a, b);
            return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
        }));
    });
    var _JsArray_empty = [];
    function _JsArray_singleton(value) {
        return [
            value
        ];
    }
    function _JsArray_length(array) {
        return array.length;
    }
    var _JsArray_initialize = F3(function(size, offset, func) {
        var result = new Array(size);
        for(var i = 0; i < size; i++)result[i] = func(offset + i);
        return result;
    });
    var _JsArray_initializeFromList = F2(function(max, ls) {
        var result = new Array(max);
        for(var i = 0; i < max && ls.b; i++){
            result[i] = ls.a;
            ls = ls.b;
        }
        result.length = i;
        return _Utils_Tuple2(result, ls);
    });
    var _JsArray_unsafeGet = F2(function(index, array) {
        return array[index];
    });
    var _JsArray_unsafeSet = F3(function(index, value, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = array[i];
        result[index] = value;
        return result;
    });
    var _JsArray_push = F2(function(value, array) {
        var length = array.length;
        var result = new Array(length + 1);
        for(var i = 0; i < length; i++)result[i] = array[i];
        result[length] = value;
        return result;
    });
    var _JsArray_foldl = F3(function(func, acc, array) {
        var length = array.length;
        for(var i = 0; i < length; i++)acc = A2(func, array[i], acc);
        return acc;
    });
    var _JsArray_foldr = F3(function(func, acc, array) {
        for(var i = array.length - 1; i >= 0; i--)acc = A2(func, array[i], acc);
        return acc;
    });
    var _JsArray_map = F2(function(func, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = func(array[i]);
        return result;
    });
    var _JsArray_indexedMap = F3(function(func, offset, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = A2(func, offset + i, array[i]);
        return result;
    });
    var _JsArray_slice = F3(function(from, to, array) {
        return array.slice(from, to);
    });
    var _JsArray_appendN = F3(function(n, dest, source) {
        var destLen = dest.length;
        var itemsToCopy = n - destLen;
        if (itemsToCopy > source.length) itemsToCopy = source.length;
        var size = destLen + itemsToCopy;
        var result = new Array(size);
        for(var i = 0; i < destLen; i++)result[i] = dest[i];
        for(var i = 0; i < itemsToCopy; i++)result[i + destLen] = source[i];
        return result;
    });
    // LOG
    var _Debug_log_UNUSED = F2(function(tag, value) {
        return value;
    });
    var _Debug_log = F2(function(tag, value) {
        console.log(tag + ": " + _Debug_toString(value));
        return value;
    });
    // TODOS
    function _Debug_todo(moduleName, region) {
        return function(message) {
            _Debug_crash(8, moduleName, region, message);
        };
    }
    function _Debug_todoCase(moduleName, region, value) {
        return function(message) {
            _Debug_crash(9, moduleName, region, value, message);
        };
    }
    // TO STRING
    function _Debug_toString_UNUSED(value) {
        return "<internals>";
    }
    function _Debug_toString(value) {
        return _Debug_toAnsiString(false, value);
    }
    function _Debug_toAnsiString(ansi, value) {
        if (typeof value === "function") return _Debug_internalColor(ansi, "<function>");
        if (typeof value === "boolean") return _Debug_ctorColor(ansi, value ? "True" : "False");
        if (typeof value === "number") return _Debug_numberColor(ansi, value + "");
        if (value instanceof String) return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
        if (typeof value === "string") return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
        if (typeof value === "object" && "$" in value) {
            var tag = value.$;
            if (typeof tag === "number") return _Debug_internalColor(ansi, "<internals>");
            if (tag[0] === "#") {
                var output = [];
                for(var k in value){
                    if (k === "$") continue;
                    output.push(_Debug_toAnsiString(ansi, value[k]));
                }
                return "(" + output.join(",") + ")";
            }
            if (tag === "Set_elm_builtin") return _Debug_ctorColor(ansi, "Set") + _Debug_fadeColor(ansi, ".fromList") + " " + _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
            if (tag === "RBNode_elm_builtin" || tag === "RBEmpty_elm_builtin") return _Debug_ctorColor(ansi, "Dict") + _Debug_fadeColor(ansi, ".fromList") + " " + _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
            if (tag === "Array_elm_builtin") return _Debug_ctorColor(ansi, "Array") + _Debug_fadeColor(ansi, ".fromList") + " " + _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
            if (tag === "::" || tag === "[]") {
                var output = "[";
                value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b);
                for(; value.b; value = value.b)output += "," + _Debug_toAnsiString(ansi, value.a);
                return output + "]";
            }
            var output = "";
            for(var i in value){
                if (i === "$") continue;
                var str = _Debug_toAnsiString(ansi, value[i]);
                var c0 = str[0];
                var parenless = c0 === "{" || c0 === "(" || c0 === "[" || c0 === "<" || c0 === '"' || str.indexOf(" ") < 0;
                output += " " + (parenless ? str : "(" + str + ")");
            }
            return _Debug_ctorColor(ansi, tag) + output;
        }
        if (typeof DataView === "function" && value instanceof DataView) return _Debug_stringColor(ansi, "<" + value.byteLength + " bytes>");
        if (typeof File !== "undefined" && value instanceof File) return _Debug_internalColor(ansi, "<" + value.name + ">");
        if (typeof value === "object") {
            var output = [];
            for(var key in value){
                var field = key[0] === "_" ? key.slice(1) : key;
                output.push(_Debug_fadeColor(ansi, field) + " = " + _Debug_toAnsiString(ansi, value[key]));
            }
            if (output.length === 0) return "{}";
            return "{ " + output.join(", ") + " }";
        }
        return _Debug_internalColor(ansi, "<internals>");
    }
    function _Debug_addSlashes(str, isChar) {
        var s = str.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
        if (isChar) return s.replace(/\'/g, "\\'");
        else return s.replace(/\"/g, '\\"');
    }
    function _Debug_ctorColor(ansi, string) {
        return ansi ? "\x1b[96m" + string + "\x1b[0m" : string;
    }
    function _Debug_numberColor(ansi, string) {
        return ansi ? "\x1b[95m" + string + "\x1b[0m" : string;
    }
    function _Debug_stringColor(ansi, string) {
        return ansi ? "\x1b[93m" + string + "\x1b[0m" : string;
    }
    function _Debug_charColor(ansi, string) {
        return ansi ? "\x1b[92m" + string + "\x1b[0m" : string;
    }
    function _Debug_fadeColor(ansi, string) {
        return ansi ? "\x1b[37m" + string + "\x1b[0m" : string;
    }
    function _Debug_internalColor(ansi, string) {
        return ansi ? "\x1b[36m" + string + "\x1b[0m" : string;
    }
    function _Debug_toHexDigit(n) {
        return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
    }
    // CRASH
    function _Debug_crash_UNUSED(identifier) {
        throw new Error("https://github.com/elm/core/blob/1.0.0/hints/" + identifier + ".md");
    }
    function _Debug_crash(identifier, fact1, fact2, fact3, fact4) {
        switch(identifier){
            case 0:
                throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');
            case 1:
                throw new Error("Browser.application programs cannot handle URLs like this:\n\n    " + document.location.href + "\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.");
            case 2:
                var jsonErrorString = fact1;
                throw new Error("Problem with the flags given to your Elm program on initialization.\n\n" + jsonErrorString);
            case 3:
                var portName = fact1;
                throw new Error("There can only be one port named `" + portName + "`, but your program has multiple.");
            case 4:
                var portName = fact1;
                var problem = fact2;
                throw new Error("Trying to send an unexpected type of value through port `" + portName + "`:\n" + problem);
            case 5:
                throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');
            case 6:
                var moduleName = fact1;
                throw new Error("Your page is loading multiple Elm scripts with a module named " + moduleName + ". Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!");
            case 8:
                var moduleName = fact1;
                var region = fact2;
                var message = fact3;
                throw new Error("TODO in module `" + moduleName + "` " + _Debug_regionToString(region) + "\n\n" + message);
            case 9:
                var moduleName = fact1;
                var region = fact2;
                var value = fact3;
                var message = fact4;
                throw new Error("TODO in module `" + moduleName + "` from the `case` expression " + _Debug_regionToString(region) + "\n\nIt received the following value:\n\n    " + _Debug_toString(value).replace("\n", "\n    ") + "\n\nBut the branch that handles it says:\n\n    " + message.replace("\n", "\n    "));
            case 10:
                throw new Error("Bug in https://github.com/elm/virtual-dom/issues");
            case 11:
                throw new Error("Cannot perform mod 0. Division by zero error.");
        }
    }
    function _Debug_regionToString(region) {
        if (region.start.line === region.end.line) return "on line " + region.start.line;
        return "on lines " + region.start.line + " through " + region.end.line;
    }
    // MATH
    var _Basics_add = F2(function(a, b) {
        return a + b;
    });
    var _Basics_sub = F2(function(a, b) {
        return a - b;
    });
    var _Basics_mul = F2(function(a, b) {
        return a * b;
    });
    var _Basics_fdiv = F2(function(a, b) {
        return a / b;
    });
    var _Basics_idiv = F2(function(a, b) {
        return a / b | 0;
    });
    var _Basics_pow = F2(Math.pow);
    var _Basics_remainderBy = F2(function(b, a) {
        return a % b;
    });
    // https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
    var _Basics_modBy = F2(function(modulus, x) {
        var answer = x % modulus;
        return modulus === 0 ? _Debug_crash(11) : answer > 0 && modulus < 0 || answer < 0 && modulus > 0 ? answer + modulus : answer;
    });
    // TRIGONOMETRY
    var _Basics_pi = Math.PI;
    var _Basics_e = Math.E;
    var _Basics_cos = Math.cos;
    var _Basics_sin = Math.sin;
    var _Basics_tan = Math.tan;
    var _Basics_acos = Math.acos;
    var _Basics_asin = Math.asin;
    var _Basics_atan = Math.atan;
    var _Basics_atan2 = F2(Math.atan2);
    // MORE MATH
    function _Basics_toFloat(x) {
        return x;
    }
    function _Basics_truncate(n) {
        return n | 0;
    }
    function _Basics_isInfinite(n) {
        return n === Infinity || n === -Infinity;
    }
    var _Basics_ceiling = Math.ceil;
    var _Basics_floor = Math.floor;
    var _Basics_round = Math.round;
    var _Basics_sqrt = Math.sqrt;
    var _Basics_log = Math.log;
    var _Basics_isNaN = isNaN;
    // BOOLEANS
    function _Basics_not(bool) {
        return !bool;
    }
    var _Basics_and = F2(function(a, b) {
        return a && b;
    });
    var _Basics_or = F2(function(a, b) {
        return a || b;
    });
    var _Basics_xor = F2(function(a, b) {
        return a !== b;
    });
    var _String_cons = F2(function(chr, str) {
        return chr + str;
    });
    function _String_uncons(string) {
        var word = string.charCodeAt(0);
        return !isNaN(word) ? $elm$core$Maybe$Just(0xD800 <= word && word <= 0xDBFF ? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2)) : _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))) : $elm$core$Maybe$Nothing;
    }
    var _String_append = F2(function(a, b) {
        return a + b;
    });
    function _String_length(str) {
        return str.length;
    }
    var _String_map = F2(function(func, string) {
        var len = string.length;
        var array = new Array(len);
        var i = 0;
        while(i < len){
            var word = string.charCodeAt(i);
            if (0xD800 <= word && word <= 0xDBFF) {
                array[i] = func(_Utils_chr(string[i] + string[i + 1]));
                i += 2;
                continue;
            }
            array[i] = func(_Utils_chr(string[i]));
            i++;
        }
        return array.join("");
    });
    var _String_filter = F2(function(isGood, str) {
        var arr = [];
        var len = str.length;
        var i = 0;
        while(i < len){
            var char = str[i];
            var word = str.charCodeAt(i);
            i++;
            if (0xD800 <= word && word <= 0xDBFF) {
                char += str[i];
                i++;
            }
            if (isGood(_Utils_chr(char))) arr.push(char);
        }
        return arr.join("");
    });
    function _String_reverse(str) {
        var len = str.length;
        var arr = new Array(len);
        var i = 0;
        while(i < len){
            var word = str.charCodeAt(i);
            if (0xD800 <= word && word <= 0xDBFF) {
                arr[len - i] = str[i + 1];
                i++;
                arr[len - i] = str[i - 1];
                i++;
            } else {
                arr[len - i] = str[i];
                i++;
            }
        }
        return arr.join("");
    }
    var _String_foldl = F3(function(func, state, string) {
        var len = string.length;
        var i = 0;
        while(i < len){
            var char = string[i];
            var word = string.charCodeAt(i);
            i++;
            if (0xD800 <= word && word <= 0xDBFF) {
                char += string[i];
                i++;
            }
            state = A2(func, _Utils_chr(char), state);
        }
        return state;
    });
    var _String_foldr = F3(function(func, state, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (0xDC00 <= word && word <= 0xDFFF) {
                i--;
                char = string[i] + char;
            }
            state = A2(func, _Utils_chr(char), state);
        }
        return state;
    });
    var _String_split = F2(function(sep, str) {
        return str.split(sep);
    });
    var _String_join = F2(function(sep, strs) {
        return strs.join(sep);
    });
    var _String_slice = F3(function(start, end, str) {
        return str.slice(start, end);
    });
    function _String_trim(str) {
        return str.trim();
    }
    function _String_trimLeft(str) {
        return str.replace(/^\s+/, "");
    }
    function _String_trimRight(str) {
        return str.replace(/\s+$/, "");
    }
    function _String_words(str) {
        return _List_fromArray(str.trim().split(/\s+/g));
    }
    function _String_lines(str) {
        return _List_fromArray(str.split(/\r\n|\r|\n/g));
    }
    function _String_toUpper(str) {
        return str.toUpperCase();
    }
    function _String_toLower(str) {
        return str.toLowerCase();
    }
    var _String_any = F2(function(isGood, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (0xDC00 <= word && word <= 0xDFFF) {
                i--;
                char = string[i] + char;
            }
            if (isGood(_Utils_chr(char))) return true;
        }
        return false;
    });
    var _String_all = F2(function(isGood, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (0xDC00 <= word && word <= 0xDFFF) {
                i--;
                char = string[i] + char;
            }
            if (!isGood(_Utils_chr(char))) return false;
        }
        return true;
    });
    var _String_contains = F2(function(sub, str) {
        return str.indexOf(sub) > -1;
    });
    var _String_startsWith = F2(function(sub, str) {
        return str.indexOf(sub) === 0;
    });
    var _String_endsWith = F2(function(sub, str) {
        return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
    });
    var _String_indexes = F2(function(sub, str) {
        var subLen = sub.length;
        if (subLen < 1) return _List_Nil;
        var i = 0;
        var is = [];
        while((i = str.indexOf(sub, i)) > -1){
            is.push(i);
            i = i + subLen;
        }
        return _List_fromArray(is);
    });
    // TO STRING
    function _String_fromNumber(number) {
        return number + "";
    }
    // INT CONVERSIONS
    function _String_toInt(str) {
        var total = 0;
        var code0 = str.charCodeAt(0);
        var start = code0 == 0x2B /* + */  || code0 == 0x2D /* - */  ? 1 : 0;
        for(var i = start; i < str.length; ++i){
            var code = str.charCodeAt(i);
            if (code < 0x30 || 0x39 < code) return $elm$core$Maybe$Nothing;
            total = 10 * total + code - 0x30;
        }
        return i == start ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
    }
    // FLOAT CONVERSIONS
    function _String_toFloat(s) {
        // check if it is a hex, octal, or binary number
        if (s.length === 0 || /[\sxbo]/.test(s)) return $elm$core$Maybe$Nothing;
        var n = +s;
        // faster isNaN check
        return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
    }
    function _String_fromList(chars) {
        return _List_toArray(chars).join("");
    }
    function _Char_toCode(char) {
        var code = char.charCodeAt(0);
        if (0xD800 <= code && code <= 0xDBFF) return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000;
        return code;
    }
    function _Char_fromCode(code) {
        return _Utils_chr(code < 0 || 0x10FFFF < code ? "\uFFFD" : code <= 0xFFFF ? String.fromCharCode(code) : (code -= 0x10000, String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)));
    }
    function _Char_toUpper(char) {
        return _Utils_chr(char.toUpperCase());
    }
    function _Char_toLower(char) {
        return _Utils_chr(char.toLowerCase());
    }
    function _Char_toLocaleUpper(char) {
        return _Utils_chr(char.toLocaleUpperCase());
    }
    function _Char_toLocaleLower(char) {
        return _Utils_chr(char.toLocaleLowerCase());
    }
    /**/ function _Json_errorToString(error) {
        return $elm$json$Json$Decode$errorToString(error);
    }
    //*/
    // CORE DECODERS
    function _Json_succeed(msg) {
        return {
            $: 0,
            a: msg
        };
    }
    function _Json_fail(msg) {
        return {
            $: 1,
            a: msg
        };
    }
    function _Json_decodePrim(decoder) {
        return {
            $: 2,
            b: decoder
        };
    }
    var _Json_decodeInt = _Json_decodePrim(function(value) {
        return typeof value !== "number" ? _Json_expecting("an INT", value) : -2147483647 < value && value < 2147483647 && (value | 0) === value ? $elm$core$Result$Ok(value) : isFinite(value) && !(value % 1) ? $elm$core$Result$Ok(value) : _Json_expecting("an INT", value);
    });
    var _Json_decodeBool = _Json_decodePrim(function(value) {
        return typeof value === "boolean" ? $elm$core$Result$Ok(value) : _Json_expecting("a BOOL", value);
    });
    var _Json_decodeFloat = _Json_decodePrim(function(value) {
        return typeof value === "number" ? $elm$core$Result$Ok(value) : _Json_expecting("a FLOAT", value);
    });
    var _Json_decodeValue = _Json_decodePrim(function(value) {
        return $elm$core$Result$Ok(_Json_wrap(value));
    });
    var _Json_decodeString = _Json_decodePrim(function(value) {
        return typeof value === "string" ? $elm$core$Result$Ok(value) : value instanceof String ? $elm$core$Result$Ok(value + "") : _Json_expecting("a STRING", value);
    });
    function _Json_decodeList(decoder) {
        return {
            $: 3,
            b: decoder
        };
    }
    function _Json_decodeArray(decoder) {
        return {
            $: 4,
            b: decoder
        };
    }
    function _Json_decodeNull(value) {
        return {
            $: 5,
            c: value
        };
    }
    var _Json_decodeField = F2(function(field, decoder) {
        return {
            $: 6,
            d: field,
            b: decoder
        };
    });
    var _Json_decodeIndex = F2(function(index, decoder) {
        return {
            $: 7,
            e: index,
            b: decoder
        };
    });
    function _Json_decodeKeyValuePairs(decoder) {
        return {
            $: 8,
            b: decoder
        };
    }
    function _Json_mapMany(f, decoders) {
        return {
            $: 9,
            f: f,
            g: decoders
        };
    }
    var _Json_andThen = F2(function(callback, decoder) {
        return {
            $: 10,
            b: decoder,
            h: callback
        };
    });
    function _Json_oneOf(decoders) {
        return {
            $: 11,
            g: decoders
        };
    }
    // DECODING OBJECTS
    var _Json_map1 = F2(function(f, d1) {
        return _Json_mapMany(f, [
            d1
        ]);
    });
    var _Json_map2 = F3(function(f, d1, d2) {
        return _Json_mapMany(f, [
            d1,
            d2
        ]);
    });
    var _Json_map3 = F4(function(f, d1, d2, d3) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3
        ]);
    });
    var _Json_map4 = F5(function(f, d1, d2, d3, d4) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4
        ]);
    });
    var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5
        ]);
    });
    var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6
        ]);
    });
    var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6,
            d7
        ]);
    });
    var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6,
            d7,
            d8
        ]);
    });
    // DECODE
    var _Json_runOnString = F2(function(decoder, string) {
        try {
            var value = JSON.parse(string);
            return _Json_runHelp(decoder, value);
        } catch (e) {
            return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, "This is not valid JSON! " + e.message, _Json_wrap(string)));
        }
    });
    var _Json_run = F2(function(decoder, value) {
        return _Json_runHelp(decoder, _Json_unwrap(value));
    });
    function _Json_runHelp(decoder, value) {
        switch(decoder.$){
            case 2:
                return decoder.b(value);
            case 5:
                return value === null ? $elm$core$Result$Ok(decoder.c) : _Json_expecting("null", value);
            case 3:
                if (!_Json_isArray(value)) return _Json_expecting("a LIST", value);
                return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);
            case 4:
                if (!_Json_isArray(value)) return _Json_expecting("an ARRAY", value);
                return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);
            case 6:
                var field = decoder.d;
                if (typeof value !== "object" || value === null || !(field in value)) return _Json_expecting("an OBJECT with a field named `" + field + "`", value);
                var result = _Json_runHelp(decoder.b, value[field]);
                return $elm$core$Result$isOk(result) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));
            case 7:
                var index = decoder.e;
                if (!_Json_isArray(value)) return _Json_expecting("an ARRAY", value);
                if (index >= value.length) return _Json_expecting("a LONGER array. Need index " + index + " but only see " + value.length + " entries", value);
                var result = _Json_runHelp(decoder.b, value[index]);
                return $elm$core$Result$isOk(result) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));
            case 8:
                if (typeof value !== "object" || value === null || _Json_isArray(value)) return _Json_expecting("an OBJECT", value);
                var keyValuePairs = _List_Nil;
                // TODO test perf of Object.keys and switch when support is good enough
                for(var key in value)if (value.hasOwnProperty(key)) {
                    var result = _Json_runHelp(decoder.b, value[key]);
                    if (!$elm$core$Result$isOk(result)) return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
                    keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
                }
                return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));
            case 9:
                var answer = decoder.f;
                var decoders = decoder.g;
                for(var i = 0; i < decoders.length; i++){
                    var result = _Json_runHelp(decoders[i], value);
                    if (!$elm$core$Result$isOk(result)) return result;
                    answer = answer(result.a);
                }
                return $elm$core$Result$Ok(answer);
            case 10:
                var result = _Json_runHelp(decoder.b, value);
                return !$elm$core$Result$isOk(result) ? result : _Json_runHelp(decoder.h(result.a), value);
            case 11:
                var errors = _List_Nil;
                for(var temp = decoder.g; temp.b; temp = temp.b){
                    var result = _Json_runHelp(temp.a, value);
                    if ($elm$core$Result$isOk(result)) return result;
                    errors = _List_Cons(result.a, errors);
                }
                return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));
            case 1:
                return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));
            case 0:
                return $elm$core$Result$Ok(decoder.a);
        }
    }
    function _Json_runArrayDecoder(decoder, value, toElmValue) {
        var len = value.length;
        var array = new Array(len);
        for(var i = 0; i < len; i++){
            var result = _Json_runHelp(decoder, value[i]);
            if (!$elm$core$Result$isOk(result)) return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
            array[i] = result.a;
        }
        return $elm$core$Result$Ok(toElmValue(array));
    }
    function _Json_isArray(value) {
        return Array.isArray(value) || typeof FileList !== "undefined" && value instanceof FileList;
    }
    function _Json_toElmArray(array) {
        return A2($elm$core$Array$initialize, array.length, function(i) {
            return array[i];
        });
    }
    function _Json_expecting(type, value) {
        return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, "Expecting " + type, _Json_wrap(value)));
    }
    // EQUALITY
    function _Json_equality(x, y) {
        if (x === y) return true;
        if (x.$ !== y.$) return false;
        switch(x.$){
            case 0:
            case 1:
                return x.a === y.a;
            case 2:
                return x.b === y.b;
            case 5:
                return x.c === y.c;
            case 3:
            case 4:
            case 8:
                return _Json_equality(x.b, y.b);
            case 6:
                return x.d === y.d && _Json_equality(x.b, y.b);
            case 7:
                return x.e === y.e && _Json_equality(x.b, y.b);
            case 9:
                return x.f === y.f && _Json_listEquality(x.g, y.g);
            case 10:
                return x.h === y.h && _Json_equality(x.b, y.b);
            case 11:
                return _Json_listEquality(x.g, y.g);
        }
    }
    function _Json_listEquality(aDecoders, bDecoders) {
        var len = aDecoders.length;
        if (len !== bDecoders.length) return false;
        for(var i = 0; i < len; i++){
            if (!_Json_equality(aDecoders[i], bDecoders[i])) return false;
        }
        return true;
    }
    // ENCODE
    var _Json_encode = F2(function(indentLevel, value) {
        return JSON.stringify(_Json_unwrap(value), null, indentLevel) + "";
    });
    function _Json_wrap(value) {
        return {
            $: 0,
            a: value
        };
    }
    function _Json_unwrap(value) {
        return value.a;
    }
    function _Json_wrap_UNUSED(value) {
        return value;
    }
    function _Json_unwrap_UNUSED(value) {
        return value;
    }
    function _Json_emptyArray() {
        return [];
    }
    function _Json_emptyObject() {
        return {};
    }
    var _Json_addField = F3(function(key, value, object) {
        object[key] = _Json_unwrap(value);
        return object;
    });
    function _Json_addEntry(func) {
        return F2(function(entry, array) {
            array.push(_Json_unwrap(func(entry)));
            return array;
        });
    }
    var _Json_encodeNull = _Json_wrap(null);
    // TASKS
    function _Scheduler_succeed(value) {
        return {
            $: 0,
            a: value
        };
    }
    function _Scheduler_fail(error) {
        return {
            $: 1,
            a: error
        };
    }
    function _Scheduler_binding(callback) {
        return {
            $: 2,
            b: callback,
            c: null
        };
    }
    var _Scheduler_andThen = F2(function(callback, task) {
        return {
            $: 3,
            b: callback,
            d: task
        };
    });
    var _Scheduler_onError = F2(function(callback, task) {
        return {
            $: 4,
            b: callback,
            d: task
        };
    });
    function _Scheduler_receive(callback) {
        return {
            $: 5,
            b: callback
        };
    }
    // PROCESSES
    var _Scheduler_guid = 0;
    function _Scheduler_rawSpawn(task) {
        var proc = {
            $: 0,
            e: _Scheduler_guid++,
            f: task,
            g: null,
            h: []
        };
        _Scheduler_enqueue(proc);
        return proc;
    }
    function _Scheduler_spawn(task) {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
        });
    }
    function _Scheduler_rawSend(proc, msg) {
        proc.h.push(msg);
        _Scheduler_enqueue(proc);
    }
    var _Scheduler_send = F2(function(proc, msg) {
        return _Scheduler_binding(function(callback) {
            _Scheduler_rawSend(proc, msg);
            callback(_Scheduler_succeed(_Utils_Tuple0));
        });
    });
    function _Scheduler_kill(proc) {
        return _Scheduler_binding(function(callback) {
            var task = proc.f;
            if (task.$ === 2 && task.c) task.c();
            proc.f = null;
            callback(_Scheduler_succeed(_Utils_Tuple0));
        });
    }
    /* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/ var _Scheduler_working = false;
    var _Scheduler_queue = [];
    function _Scheduler_enqueue(proc) {
        _Scheduler_queue.push(proc);
        if (_Scheduler_working) return;
        _Scheduler_working = true;
        while(proc = _Scheduler_queue.shift())_Scheduler_step(proc);
        _Scheduler_working = false;
    }
    function _Scheduler_step(proc) {
        while(proc.f){
            var rootTag = proc.f.$;
            if (rootTag === 0 || rootTag === 1) {
                while(proc.g && proc.g.$ !== rootTag)proc.g = proc.g.i;
                if (!proc.g) return;
                proc.f = proc.g.b(proc.f.a);
                proc.g = proc.g.i;
            } else if (rootTag === 2) {
                proc.f.c = proc.f.b(function(newRoot) {
                    proc.f = newRoot;
                    _Scheduler_enqueue(proc);
                });
                return;
            } else if (rootTag === 5) {
                if (proc.h.length === 0) return;
                proc.f = proc.f.b(proc.h.shift());
            } else {
                proc.g = {
                    $: rootTag === 3 ? 0 : 1,
                    b: proc.f.b,
                    i: proc.g
                };
                proc.f = proc.f.d;
            }
        }
    }
    function _Process_sleep(time) {
        return _Scheduler_binding(function(callback) {
            var id = setTimeout(function() {
                callback(_Scheduler_succeed(_Utils_Tuple0));
            }, time);
            return function() {
                clearTimeout(id);
            };
        });
    }
    // PROGRAMS
    var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function() {
            return function() {};
        });
    });
    // INITIALIZE A PROGRAM
    function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder) {
        var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args["flags"] : undefined));
        $elm$core$Result$isOk(result) || _Debug_crash(2 /**/ , _Json_errorToString(result.a));
        var managers = {};
        var initPair = init(result.a);
        var model = initPair.a;
        var stepper = stepperBuilder(sendToApp, model);
        var ports = _Platform_setupEffects(managers, sendToApp);
        function sendToApp(msg, viewMetadata) {
            var pair = A2(update, msg, model);
            stepper(model = pair.a, viewMetadata);
            _Platform_enqueueEffects(managers, pair.b, subscriptions(model));
        }
        _Platform_enqueueEffects(managers, initPair.b, subscriptions(model));
        return ports ? {
            ports: ports
        } : {};
    }
    // TRACK PRELOADS
    //
    // This is used by code in elm/browser and elm/http
    // to register any HTTP requests that are triggered by init.
    //
    var _Platform_preload;
    function _Platform_registerPreload(url) {
        _Platform_preload.add(url);
    }
    // EFFECT MANAGERS
    var _Platform_effectManagers = {};
    function _Platform_setupEffects(managers, sendToApp) {
        var ports;
        // setup all necessary effect managers
        for(var key in _Platform_effectManagers){
            var manager = _Platform_effectManagers[key];
            if (manager.a) {
                ports = ports || {};
                ports[key] = manager.a(key, sendToApp);
            }
            managers[key] = _Platform_instantiateManager(manager, sendToApp);
        }
        return ports;
    }
    function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap) {
        return {
            b: init,
            c: onEffects,
            d: onSelfMsg,
            e: cmdMap,
            f: subMap
        };
    }
    function _Platform_instantiateManager(info, sendToApp) {
        var router = {
            g: sendToApp,
            h: undefined
        };
        var onEffects = info.c;
        var onSelfMsg = info.d;
        var cmdMap = info.e;
        var subMap = info.f;
        function loop(state) {
            return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg) {
                var value = msg.a;
                if (msg.$ === 0) return A3(onSelfMsg, router, value, state);
                return cmdMap && subMap ? A4(onEffects, router, value.i, value.j, state) : A3(onEffects, router, cmdMap ? value.i : value.j, state);
            }));
        }
        return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
    }
    // ROUTING
    var _Platform_sendToApp = F2(function(router, msg) {
        return _Scheduler_binding(function(callback) {
            router.g(msg);
            callback(_Scheduler_succeed(_Utils_Tuple0));
        });
    });
    var _Platform_sendToSelf = F2(function(router, msg) {
        return A2(_Scheduler_send, router.h, {
            $: 0,
            a: msg
        });
    });
    // BAGS
    function _Platform_leaf(home) {
        return function(value) {
            return {
                $: 1,
                k: home,
                l: value
            };
        };
    }
    function _Platform_batch(list) {
        return {
            $: 2,
            m: list
        };
    }
    var _Platform_map = F2(function(tagger, bag) {
        return {
            $: 3,
            n: tagger,
            o: bag
        };
    });
    // PIPE BAGS INTO EFFECT MANAGERS
    //
    // Effects must be queued!
    //
    // Say your init contains a synchronous command, like Time.now or Time.here
    //
    //   - This will produce a batch of effects (FX_1)
    //   - The synchronous task triggers the subsequent `update` call
    //   - This will produce a batch of effects (FX_2)
    //
    // If we just start dispatching FX_2, subscriptions from FX_2 can be processed
    // before subscriptions from FX_1. No good! Earlier versions of this code had
    // this problem, leading to these reports:
    //
    //   https://github.com/elm/core/issues/980
    //   https://github.com/elm/core/pull/981
    //   https://github.com/elm/compiler/issues/1776
    //
    // The queue is necessary to avoid ordering issues for synchronous commands.
    // Why use true/false here? Why not just check the length of the queue?
    // The goal is to detect "are we currently dispatching effects?" If we
    // are, we need to bail and let the ongoing while loop handle things.
    //
    // Now say the queue has 1 element. When we dequeue the final element,
    // the queue will be empty, but we are still actively dispatching effects.
    // So you could get queue jumping in a really tricky category of cases.
    //
    var _Platform_effectsQueue = [];
    var _Platform_effectsActive = false;
    function _Platform_enqueueEffects(managers, cmdBag, subBag) {
        _Platform_effectsQueue.push({
            p: managers,
            q: cmdBag,
            r: subBag
        });
        if (_Platform_effectsActive) return;
        _Platform_effectsActive = true;
        for(var fx; fx = _Platform_effectsQueue.shift();)_Platform_dispatchEffects(fx.p, fx.q, fx.r);
        _Platform_effectsActive = false;
    }
    function _Platform_dispatchEffects(managers, cmdBag, subBag) {
        var effectsDict = {};
        _Platform_gatherEffects(true, cmdBag, effectsDict, null);
        _Platform_gatherEffects(false, subBag, effectsDict, null);
        for(var home in managers)_Scheduler_rawSend(managers[home], {
            $: "fx",
            a: effectsDict[home] || {
                i: _List_Nil,
                j: _List_Nil
            }
        });
    }
    function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers) {
        switch(bag.$){
            case 1:
                var home = bag.k;
                var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
                effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
                return;
            case 2:
                for(var list = bag.m; list.b; list = list.b)_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
                return;
            case 3:
                _Platform_gatherEffects(isCmd, bag.o, effectsDict, {
                    s: bag.n,
                    t: taggers
                });
                return;
        }
    }
    function _Platform_toEffect(isCmd, home, taggers, value) {
        function applyTaggers(x) {
            for(var temp = taggers; temp; temp = temp.t)x = temp.s(x);
            return x;
        }
        var map = isCmd ? _Platform_effectManagers[home].e : _Platform_effectManagers[home].f;
        return A2(map, applyTaggers, value);
    }
    function _Platform_insert(isCmd, newEffect, effects) {
        effects = effects || {
            i: _List_Nil,
            j: _List_Nil
        };
        isCmd ? effects.i = _List_Cons(newEffect, effects.i) : effects.j = _List_Cons(newEffect, effects.j);
        return effects;
    }
    // PORTS
    function _Platform_checkPortName(name) {
        if (_Platform_effectManagers[name]) _Debug_crash(3, name);
    }
    // OUTGOING PORTS
    function _Platform_outgoingPort(name, converter) {
        _Platform_checkPortName(name);
        _Platform_effectManagers[name] = {
            e: _Platform_outgoingPortMap,
            u: converter,
            a: _Platform_setupOutgoingPort
        };
        return _Platform_leaf(name);
    }
    var _Platform_outgoingPortMap = F2(function(tagger, value) {
        return value;
    });
    function _Platform_setupOutgoingPort(name) {
        var subs = [];
        var converter = _Platform_effectManagers[name].u;
        // CREATE MANAGER
        var init = _Process_sleep(0);
        _Platform_effectManagers[name].b = init;
        _Platform_effectManagers[name].c = F3(function(router, cmdList, state) {
            for(; cmdList.b; cmdList = cmdList.b){
                // grab a separate reference to subs in case unsubscribe is called
                var currentSubs = subs;
                var value = _Json_unwrap(converter(cmdList.a));
                for(var i = 0; i < currentSubs.length; i++)currentSubs[i](value);
            }
            return init;
        });
        // PUBLIC API
        function subscribe(callback) {
            subs.push(callback);
        }
        function unsubscribe(callback) {
            // copy subs into a new array in case unsubscribe is called within a
            // subscribed callback
            subs = subs.slice();
            var index = subs.indexOf(callback);
            if (index >= 0) subs.splice(index, 1);
        }
        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
    // INCOMING PORTS
    function _Platform_incomingPort(name, converter) {
        _Platform_checkPortName(name);
        _Platform_effectManagers[name] = {
            f: _Platform_incomingPortMap,
            u: converter,
            a: _Platform_setupIncomingPort
        };
        return _Platform_leaf(name);
    }
    var _Platform_incomingPortMap = F2(function(tagger, finalTagger) {
        return function(value) {
            return tagger(finalTagger(value));
        };
    });
    function _Platform_setupIncomingPort(name, sendToApp) {
        var subs = _List_Nil;
        var converter = _Platform_effectManagers[name].u;
        // CREATE MANAGER
        var init = _Scheduler_succeed(null);
        _Platform_effectManagers[name].b = init;
        _Platform_effectManagers[name].c = F3(function(router, subList, state) {
            subs = subList;
            return init;
        });
        // PUBLIC API
        function send(incomingValue) {
            var result = A2(_Json_run, converter, _Json_wrap(incomingValue));
            $elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);
            var value = result.a;
            for(var temp = subs; temp.b; temp = temp.b)sendToApp(temp.a(value));
        }
        return {
            send: send
        };
    }
    // EXPORT ELM MODULES
    //
    // Have DEBUG and PROD versions so that we can (1) give nicer errors in
    // debug mode and (2) not pay for the bits needed for that in prod mode.
    //
    function _Platform_export_UNUSED(exports) {
        scope["Elm"] ? _Platform_mergeExportsProd(scope["Elm"], exports) : scope["Elm"] = exports;
    }
    function _Platform_mergeExportsProd(obj, exports) {
        for(var name in exports)name in obj ? name == "init" ? _Debug_crash(6) : _Platform_mergeExportsProd(obj[name], exports[name]) : obj[name] = exports[name];
    }
    function _Platform_export(exports) {
        scope["Elm"] ? _Platform_mergeExportsDebug("Elm", scope["Elm"], exports) : scope["Elm"] = exports;
    }
    function _Platform_mergeExportsDebug(moduleName, obj, exports) {
        for(var name in exports)name in obj ? name == "init" ? _Debug_crash(6, moduleName) : _Platform_mergeExportsDebug(moduleName + "." + name, obj[name], exports[name]) : obj[name] = exports[name];
    }
    // HELPERS
    var _VirtualDom_divertHrefToApp;
    var _VirtualDom_doc = typeof document !== "undefined" ? document : {};
    function _VirtualDom_appendChild(parent, child) {
        parent.appendChild(child);
    }
    var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args) {
        // NOTE: this function needs _Platform_export available to work
        /**_UNUSED/
	var node = args['node'];
	//*/ /**/ var node = args && args["node"] ? args["node"] : _Debug_crash(0);
        //*/
        node.parentNode.replaceChild(_VirtualDom_render(virtualNode, function() {}), node);
        return {};
    });
    // TEXT
    function _VirtualDom_text(string) {
        return {
            $: 0,
            a: string
        };
    }
    // NODE
    var _VirtualDom_nodeNS = F2(function(namespace, tag) {
        return F2(function(factList, kidList) {
            for(var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b){
                var kid = kidList.a;
                descendantsCount += kid.b || 0;
                kids.push(kid);
            }
            descendantsCount += kids.length;
            return {
                $: 1,
                c: tag,
                d: _VirtualDom_organizeFacts(factList),
                e: kids,
                f: namespace,
                b: descendantsCount
            };
        });
    });
    var _VirtualDom_node = _VirtualDom_nodeNS(undefined);
    // KEYED NODE
    var _VirtualDom_keyedNodeNS = F2(function(namespace, tag) {
        return F2(function(factList, kidList) {
            for(var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b){
                var kid = kidList.a;
                descendantsCount += kid.b.b || 0;
                kids.push(kid);
            }
            descendantsCount += kids.length;
            return {
                $: 2,
                c: tag,
                d: _VirtualDom_organizeFacts(factList),
                e: kids,
                f: namespace,
                b: descendantsCount
            };
        });
    });
    var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);
    // CUSTOM
    function _VirtualDom_custom(factList, model, render, diff) {
        return {
            $: 3,
            d: _VirtualDom_organizeFacts(factList),
            g: model,
            h: render,
            i: diff
        };
    }
    // MAP
    var _VirtualDom_map = F2(function(tagger, node) {
        return {
            $: 4,
            j: tagger,
            k: node,
            b: 1 + (node.b || 0)
        };
    });
    // LAZY
    function _VirtualDom_thunk(refs, thunk) {
        return {
            $: 5,
            l: refs,
            m: thunk,
            k: undefined
        };
    }
    var _VirtualDom_lazy = F2(function(func, a) {
        return _VirtualDom_thunk([
            func,
            a
        ], function() {
            return func(a);
        });
    });
    var _VirtualDom_lazy2 = F3(function(func, a, b) {
        return _VirtualDom_thunk([
            func,
            a,
            b
        ], function() {
            return A2(func, a, b);
        });
    });
    var _VirtualDom_lazy3 = F4(function(func, a, b, c) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c
        ], function() {
            return A3(func, a, b, c);
        });
    });
    var _VirtualDom_lazy4 = F5(function(func, a, b, c, d) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d
        ], function() {
            return A4(func, a, b, c, d);
        });
    });
    var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e
        ], function() {
            return A5(func, a, b, c, d, e);
        });
    });
    var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f
        ], function() {
            return A6(func, a, b, c, d, e, f);
        });
    });
    var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f,
            g
        ], function() {
            return A7(func, a, b, c, d, e, f, g);
        });
    });
    var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h
        ], function() {
            return A8(func, a, b, c, d, e, f, g, h);
        });
    });
    // FACTS
    var _VirtualDom_on = F2(function(key, handler) {
        return {
            $: "a0",
            n: key,
            o: handler
        };
    });
    var _VirtualDom_style = F2(function(key, value) {
        return {
            $: "a1",
            n: key,
            o: value
        };
    });
    var _VirtualDom_property = F2(function(key, value) {
        return {
            $: "a2",
            n: key,
            o: value
        };
    });
    var _VirtualDom_attribute = F2(function(key, value) {
        return {
            $: "a3",
            n: key,
            o: value
        };
    });
    var _VirtualDom_attributeNS = F3(function(namespace, key, value) {
        return {
            $: "a4",
            n: key,
            o: {
                f: namespace,
                o: value
            }
        };
    });
    // XSS ATTACK VECTOR CHECKS
    function _VirtualDom_noScript(tag) {
        return tag == "script" ? "p" : tag;
    }
    function _VirtualDom_noOnOrFormAction(key) {
        return /^(on|formAction$)/i.test(key) ? "data-" + key : key;
    }
    function _VirtualDom_noInnerHtmlOrFormAction(key) {
        return key == "innerHTML" || key == "formAction" ? "data-" + key : key;
    }
    function _VirtualDom_noJavaScriptUri_UNUSED(value) {
        return /^javascript:/i.test(value.replace(/\s/g, "")) ? "" : value;
    }
    function _VirtualDom_noJavaScriptUri(value) {
        return /^javascript:/i.test(value.replace(/\s/g, "")) ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")' : value;
    }
    function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value) {
        return /^\s*(javascript:|data:text\/html)/i.test(value) ? "" : value;
    }
    function _VirtualDom_noJavaScriptOrHtmlUri(value) {
        return /^\s*(javascript:|data:text\/html)/i.test(value) ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")' : value;
    }
    // MAP FACTS
    var _VirtualDom_mapAttribute = F2(function(func, attr) {
        return attr.$ === "a0" ? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o)) : attr;
    });
    function _VirtualDom_mapHandler(func, handler) {
        var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);
        // 0 = Normal
        // 1 = MayStopPropagation
        // 2 = MayPreventDefault
        // 3 = Custom
        return {
            $: handler.$,
            a: !tag ? A2($elm$json$Json$Decode$map, func, handler.a) : A3($elm$json$Json$Decode$map2, tag < 3 ? _VirtualDom_mapEventTuple : _VirtualDom_mapEventRecord, $elm$json$Json$Decode$succeed(func), handler.a)
        };
    }
    var _VirtualDom_mapEventTuple = F2(function(func, tuple) {
        return _Utils_Tuple2(func(tuple.a), tuple.b);
    });
    var _VirtualDom_mapEventRecord = F2(function(func, record) {
        return {
            message: func(record.message),
            stopPropagation: record.stopPropagation,
            preventDefault: record.preventDefault
        };
    });
    // ORGANIZE FACTS
    function _VirtualDom_organizeFacts(factList) {
        for(var facts = {}; factList.b; factList = factList.b){
            var entry = factList.a;
            var tag = entry.$;
            var key = entry.n;
            var value = entry.o;
            if (tag === "a2") {
                key === "className" ? _VirtualDom_addClass(facts, key, _Json_unwrap(value)) : facts[key] = _Json_unwrap(value);
                continue;
            }
            var subFacts = facts[tag] || (facts[tag] = {});
            tag === "a3" && key === "class" ? _VirtualDom_addClass(subFacts, key, value) : subFacts[key] = value;
        }
        return facts;
    }
    function _VirtualDom_addClass(object, key, newClass) {
        var classes = object[key];
        object[key] = classes ? classes + " " + newClass : newClass;
    }
    // RENDER
    function _VirtualDom_render(vNode, eventNode) {
        var tag = vNode.$;
        if (tag === 5) return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
        if (tag === 0) return _VirtualDom_doc.createTextNode(vNode.a);
        if (tag === 4) {
            var subNode = vNode.k;
            var tagger = vNode.j;
            while(subNode.$ === 4){
                typeof tagger !== "object" ? tagger = [
                    tagger,
                    subNode.j
                ] : tagger.push(subNode.j);
                subNode = subNode.k;
            }
            var subEventRoot = {
                j: tagger,
                p: eventNode
            };
            var domNode = _VirtualDom_render(subNode, subEventRoot);
            domNode.elm_event_node_ref = subEventRoot;
            return domNode;
        }
        if (tag === 3) {
            var domNode = vNode.h(vNode.g);
            _VirtualDom_applyFacts(domNode, eventNode, vNode.d);
            return domNode;
        }
        // at this point `tag` must be 1 or 2
        var domNode = vNode.f ? _VirtualDom_doc.createElementNS(vNode.f, vNode.c) : _VirtualDom_doc.createElement(vNode.c);
        if (_VirtualDom_divertHrefToApp && vNode.c == "a") domNode.addEventListener("click", _VirtualDom_divertHrefToApp(domNode));
        _VirtualDom_applyFacts(domNode, eventNode, vNode.d);
        for(var kids = vNode.e, i = 0; i < kids.length; i++)_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
        return domNode;
    }
    // APPLY FACTS
    function _VirtualDom_applyFacts(domNode, eventNode, facts) {
        for(var key in facts){
            var value = facts[key];
            key === "a1" ? _VirtualDom_applyStyles(domNode, value) : key === "a0" ? _VirtualDom_applyEvents(domNode, eventNode, value) : key === "a3" ? _VirtualDom_applyAttrs(domNode, value) : key === "a4" ? _VirtualDom_applyAttrsNS(domNode, value) : (key !== "value" && key !== "checked" || domNode[key] !== value) && (domNode[key] = value);
        }
    }
    // APPLY STYLES
    function _VirtualDom_applyStyles(domNode, styles) {
        var domNodeStyle = domNode.style;
        for(var key in styles)domNodeStyle[key] = styles[key];
    }
    // APPLY ATTRS
    function _VirtualDom_applyAttrs(domNode, attrs) {
        for(var key in attrs){
            var value = attrs[key];
            typeof value !== "undefined" ? domNode.setAttribute(key, value) : domNode.removeAttribute(key);
        }
    }
    // APPLY NAMESPACED ATTRS
    function _VirtualDom_applyAttrsNS(domNode, nsAttrs) {
        for(var key in nsAttrs){
            var pair = nsAttrs[key];
            var namespace = pair.f;
            var value = pair.o;
            typeof value !== "undefined" ? domNode.setAttributeNS(namespace, key, value) : domNode.removeAttributeNS(namespace, key);
        }
    }
    // APPLY EVENTS
    function _VirtualDom_applyEvents(domNode, eventNode, events) {
        var allCallbacks = domNode.elmFs || (domNode.elmFs = {});
        for(var key in events){
            var newHandler = events[key];
            var oldCallback = allCallbacks[key];
            if (!newHandler) {
                domNode.removeEventListener(key, oldCallback);
                allCallbacks[key] = undefined;
                continue;
            }
            if (oldCallback) {
                var oldHandler = oldCallback.q;
                if (oldHandler.$ === newHandler.$) {
                    oldCallback.q = newHandler;
                    continue;
                }
                domNode.removeEventListener(key, oldCallback);
            }
            oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
            domNode.addEventListener(key, oldCallback, _VirtualDom_passiveSupported && {
                passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2
            });
            allCallbacks[key] = oldCallback;
        }
    }
    // PASSIVE EVENTS
    var _VirtualDom_passiveSupported;
    try {
        window.addEventListener("t", null, Object.defineProperty({}, "passive", {
            get: function() {
                _VirtualDom_passiveSupported = true;
            }
        }));
    } catch (e) {}
    // EVENT HANDLERS
    function _VirtualDom_makeCallback(eventNode, initialHandler) {
        function callback(event) {
            var handler = callback.q;
            var result = _Json_runHelp(handler.a, event);
            if (!$elm$core$Result$isOk(result)) return;
            var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);
            // 0 = Normal
            // 1 = MayStopPropagation
            // 2 = MayPreventDefault
            // 3 = Custom
            var value = result.a;
            var message = !tag ? value : tag < 3 ? value.a : value.message;
            var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
            var currentEventNode = (stopPropagation && event.stopPropagation(), (tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(), eventNode);
            var tagger;
            var i;
            while(tagger = currentEventNode.j){
                if (typeof tagger == "function") message = tagger(message);
                else for(var i = tagger.length; i--;)message = tagger[i](message);
                currentEventNode = currentEventNode.p;
            }
            currentEventNode(message, stopPropagation); // stopPropagation implies isSync
        }
        callback.q = initialHandler;
        return callback;
    }
    function _VirtualDom_equalEvents(x, y) {
        return x.$ == y.$ && _Json_equality(x.a, y.a);
    }
    // DIFF
    // TODO: Should we do patches like in iOS?
    //
    // type Patch
    //   = At Int Patch
    //   | Batch (List Patch)
    //   | Change ...
    //
    // How could it not be better?
    //
    function _VirtualDom_diff(x, y) {
        var patches = [];
        _VirtualDom_diffHelp(x, y, patches, 0);
        return patches;
    }
    function _VirtualDom_pushPatch(patches, type, index, data) {
        var patch = {
            $: type,
            r: index,
            s: data,
            t: undefined,
            u: undefined
        };
        patches.push(patch);
        return patch;
    }
    function _VirtualDom_diffHelp(x, y, patches, index) {
        if (x === y) return;
        var xType = x.$;
        var yType = y.$;
        // Bail if you run into different types of nodes. Implies that the
        // structure has changed significantly and it's not worth a diff.
        if (xType !== yType) {
            if (xType === 1 && yType === 2) {
                y = _VirtualDom_dekey(y);
                yType = 1;
            } else {
                _VirtualDom_pushPatch(patches, 0, index, y);
                return;
            }
        }
        // Now we know that both nodes are the same $.
        switch(yType){
            case 5:
                var xRefs = x.l;
                var yRefs = y.l;
                var i = xRefs.length;
                var same = i === yRefs.length;
                while(same && i--)same = xRefs[i] === yRefs[i];
                if (same) {
                    y.k = x.k;
                    return;
                }
                y.k = y.m();
                var subPatches = [];
                _VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
                subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
                return;
            case 4:
                // gather nested taggers
                var xTaggers = x.j;
                var yTaggers = y.j;
                var nesting = false;
                var xSubNode = x.k;
                while(xSubNode.$ === 4){
                    nesting = true;
                    typeof xTaggers !== "object" ? xTaggers = [
                        xTaggers,
                        xSubNode.j
                    ] : xTaggers.push(xSubNode.j);
                    xSubNode = xSubNode.k;
                }
                var ySubNode = y.k;
                while(ySubNode.$ === 4){
                    nesting = true;
                    typeof yTaggers !== "object" ? yTaggers = [
                        yTaggers,
                        ySubNode.j
                    ] : yTaggers.push(ySubNode.j);
                    ySubNode = ySubNode.k;
                }
                // Just bail if different numbers of taggers. This implies the
                // structure of the virtual DOM has changed.
                if (nesting && xTaggers.length !== yTaggers.length) {
                    _VirtualDom_pushPatch(patches, 0, index, y);
                    return;
                }
                // check if taggers are "the same"
                if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers) _VirtualDom_pushPatch(patches, 2, index, yTaggers);
                // diff everything below the taggers
                _VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
                return;
            case 0:
                if (x.a !== y.a) _VirtualDom_pushPatch(patches, 3, index, y.a);
                return;
            case 1:
                _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
                return;
            case 2:
                _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
                return;
            case 3:
                if (x.h !== y.h) {
                    _VirtualDom_pushPatch(patches, 0, index, y);
                    return;
                }
                var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
                factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);
                var patch = y.i(x.g, y.g);
                patch && _VirtualDom_pushPatch(patches, 5, index, patch);
                return;
        }
    }
    // assumes the incoming arrays are the same length
    function _VirtualDom_pairwiseRefEqual(as, bs) {
        for(var i = 0; i < as.length; i++){
            if (as[i] !== bs[i]) return false;
        }
        return true;
    }
    function _VirtualDom_diffNodes(x, y, patches, index, diffKids) {
        // Bail if obvious indicators have changed. Implies more serious
        // structural changes such that it's not worth it to diff.
        if (x.c !== y.c || x.f !== y.f) {
            _VirtualDom_pushPatch(patches, 0, index, y);
            return;
        }
        var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
        factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);
        diffKids(x, y, patches, index);
    }
    // DIFF FACTS
    // TODO Instead of creating a new diff object, it's possible to just test if
    // there *is* a diff. During the actual patch, do the diff again and make the
    // modifications directly. This way, there's no new allocations. Worth it?
    function _VirtualDom_diffFacts(x, y, category) {
        var diff;
        // look for changes and removals
        for(var xKey in x){
            if (xKey === "a1" || xKey === "a0" || xKey === "a3" || xKey === "a4") {
                var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
                if (subDiff) {
                    diff = diff || {};
                    diff[xKey] = subDiff;
                }
                continue;
            }
            // remove if not in the new facts
            if (!(xKey in y)) {
                diff = diff || {};
                diff[xKey] = !category ? typeof x[xKey] === "string" ? "" : null : category === "a1" ? "" : category === "a0" || category === "a3" ? undefined : {
                    f: x[xKey].f,
                    o: undefined
                };
                continue;
            }
            var xValue = x[xKey];
            var yValue = y[xKey];
            // reference equal, so don't worry about it
            if (xValue === yValue && xKey !== "value" && xKey !== "checked" || category === "a0" && _VirtualDom_equalEvents(xValue, yValue)) continue;
            diff = diff || {};
            diff[xKey] = yValue;
        }
        // add new stuff
        for(var yKey in y)if (!(yKey in x)) {
            diff = diff || {};
            diff[yKey] = y[yKey];
        }
        return diff;
    }
    // DIFF KIDS
    function _VirtualDom_diffKids(xParent, yParent, patches, index) {
        var xKids = xParent.e;
        var yKids = yParent.e;
        var xLen = xKids.length;
        var yLen = yKids.length;
        // FIGURE OUT IF THERE ARE INSERTS OR REMOVALS
        if (xLen > yLen) _VirtualDom_pushPatch(patches, 6, index, {
            v: yLen,
            i: xLen - yLen
        });
        else if (xLen < yLen) _VirtualDom_pushPatch(patches, 7, index, {
            v: xLen,
            e: yKids
        });
        // PAIRWISE DIFF EVERYTHING ELSE
        for(var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++){
            var xKid = xKids[i];
            _VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
            index += xKid.b || 0;
        }
    }
    // KEYED DIFF
    function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex) {
        var localPatches = [];
        var changes = {}; // Dict String Entry
        var inserts = []; // Array { index : Int, entry : Entry }
        // type Entry = { tag : String, vnode : VNode, index : Int, data : _ }
        var xKids = xParent.e;
        var yKids = yParent.e;
        var xLen = xKids.length;
        var yLen = yKids.length;
        var xIndex = 0;
        var yIndex = 0;
        var index = rootIndex;
        while(xIndex < xLen && yIndex < yLen){
            var x = xKids[xIndex];
            var y = yKids[yIndex];
            var xKey = x.a;
            var yKey = y.a;
            var xNode = x.b;
            var yNode = y.b;
            var newMatch = undefined;
            var oldMatch = undefined;
            // check if keys match
            if (xKey === yKey) {
                index++;
                _VirtualDom_diffHelp(xNode, yNode, localPatches, index);
                index += xNode.b || 0;
                xIndex++;
                yIndex++;
                continue;
            }
            // look ahead 1 to detect insertions and removals.
            var xNext = xKids[xIndex + 1];
            var yNext = yKids[yIndex + 1];
            if (xNext) {
                var xNextKey = xNext.a;
                var xNextNode = xNext.b;
                oldMatch = yKey === xNextKey;
            }
            if (yNext) {
                var yNextKey = yNext.a;
                var yNextNode = yNext.b;
                newMatch = xKey === yNextKey;
            }
            // swap x and y
            if (newMatch && oldMatch) {
                index++;
                _VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
                _VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
                index += xNode.b || 0;
                index++;
                _VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
                index += xNextNode.b || 0;
                xIndex += 2;
                yIndex += 2;
                continue;
            }
            // insert y
            if (newMatch) {
                index++;
                _VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
                _VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
                index += xNode.b || 0;
                xIndex += 1;
                yIndex += 2;
                continue;
            }
            // remove x
            if (oldMatch) {
                index++;
                _VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
                index += xNode.b || 0;
                index++;
                _VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
                index += xNextNode.b || 0;
                xIndex += 2;
                yIndex += 1;
                continue;
            }
            // remove x, insert y
            if (xNext && xNextKey === yNextKey) {
                index++;
                _VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
                _VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
                index += xNode.b || 0;
                index++;
                _VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
                index += xNextNode.b || 0;
                xIndex += 2;
                yIndex += 2;
                continue;
            }
            break;
        }
        // eat up any remaining nodes with removeNode and insertNode
        while(xIndex < xLen){
            index++;
            var x = xKids[xIndex];
            var xNode = x.b;
            _VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
            index += xNode.b || 0;
            xIndex++;
        }
        while(yIndex < yLen){
            var endInserts = endInserts || [];
            var y = yKids[yIndex];
            _VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
            yIndex++;
        }
        if (localPatches.length > 0 || inserts.length > 0 || endInserts) _VirtualDom_pushPatch(patches, 8, rootIndex, {
            w: localPatches,
            x: inserts,
            y: endInserts
        });
    }
    // CHANGES FROM KEYED DIFF
    var _VirtualDom_POSTFIX = "_elmW6BL";
    function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts) {
        var entry = changes[key];
        // never seen this key before
        if (!entry) {
            entry = {
                c: 0,
                z: vnode,
                r: yIndex,
                s: undefined
            };
            inserts.push({
                r: yIndex,
                A: entry
            });
            changes[key] = entry;
            return;
        }
        // this key was removed earlier, a match!
        if (entry.c === 1) {
            inserts.push({
                r: yIndex,
                A: entry
            });
            entry.c = 2;
            var subPatches = [];
            _VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
            entry.r = yIndex;
            entry.s.s = {
                w: subPatches,
                A: entry
            };
            return;
        }
        // this key has already been inserted or moved, a duplicate!
        _VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
    }
    function _VirtualDom_removeNode(changes, localPatches, key, vnode, index) {
        var entry = changes[key];
        // never seen this key before
        if (!entry) {
            var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);
            changes[key] = {
                c: 1,
                z: vnode,
                r: index,
                s: patch
            };
            return;
        }
        // this key was inserted earlier, a match!
        if (entry.c === 0) {
            entry.c = 2;
            var subPatches = [];
            _VirtualDom_diffHelp(vnode, entry.z, subPatches, index);
            _VirtualDom_pushPatch(localPatches, 9, index, {
                w: subPatches,
                A: entry
            });
            return;
        }
        // this key has already been removed or moved, a duplicate!
        _VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
    }
    // ADD DOM NODES
    //
    // Each DOM node has an "index" assigned in order of traversal. It is important
    // to minimize our crawl over the actual DOM, so these indexes (along with the
    // descendantsCount of virtual nodes) let us skip touching entire subtrees of
    // the DOM if we know there are no patches there.
    function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode) {
        _VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
    }
    // assumes `patches` is non-empty and indexes increase monotonically.
    function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode) {
        var patch = patches[i];
        var index = patch.r;
        while(index === low){
            var patchType = patch.$;
            if (patchType === 1) _VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
            else if (patchType === 8) {
                patch.t = domNode;
                patch.u = eventNode;
                var subPatches = patch.s.w;
                if (subPatches.length > 0) _VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
            } else if (patchType === 9) {
                patch.t = domNode;
                patch.u = eventNode;
                var data = patch.s;
                if (data) {
                    data.A.s = domNode;
                    var subPatches = data.w;
                    if (subPatches.length > 0) _VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
                }
            } else {
                patch.t = domNode;
                patch.u = eventNode;
            }
            i++;
            if (!(patch = patches[i]) || (index = patch.r) > high) return i;
        }
        var tag = vNode.$;
        if (tag === 4) {
            var subNode = vNode.k;
            while(subNode.$ === 4)subNode = subNode.k;
            return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
        }
        // tag must be 1 or 2 at this point
        var vKids = vNode.e;
        var childNodes = domNode.childNodes;
        for(var j = 0; j < vKids.length; j++){
            low++;
            var vKid = tag === 1 ? vKids[j] : vKids[j].b;
            var nextLow = low + (vKid.b || 0);
            if (low <= index && index <= nextLow) {
                i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
                if (!(patch = patches[i]) || (index = patch.r) > high) return i;
            }
            low = nextLow;
        }
        return i;
    }
    // APPLY PATCHES
    function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode) {
        if (patches.length === 0) return rootDomNode;
        _VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
        return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
    }
    function _VirtualDom_applyPatchesHelp(rootDomNode, patches) {
        for(var i = 0; i < patches.length; i++){
            var patch = patches[i];
            var localDomNode = patch.t;
            var newNode = _VirtualDom_applyPatch(localDomNode, patch);
            if (localDomNode === rootDomNode) rootDomNode = newNode;
        }
        return rootDomNode;
    }
    function _VirtualDom_applyPatch(domNode, patch) {
        switch(patch.$){
            case 0:
                return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);
            case 4:
                _VirtualDom_applyFacts(domNode, patch.u, patch.s);
                return domNode;
            case 3:
                domNode.replaceData(0, domNode.length, patch.s);
                return domNode;
            case 1:
                return _VirtualDom_applyPatchesHelp(domNode, patch.s);
            case 2:
                if (domNode.elm_event_node_ref) domNode.elm_event_node_ref.j = patch.s;
                else domNode.elm_event_node_ref = {
                    j: patch.s,
                    p: patch.u
                };
                return domNode;
            case 6:
                var data = patch.s;
                for(var i = 0; i < data.i; i++)domNode.removeChild(domNode.childNodes[data.v]);
                return domNode;
            case 7:
                var data = patch.s;
                var kids = data.e;
                var i = data.v;
                var theEnd = domNode.childNodes[i];
                for(; i < kids.length; i++)domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
                return domNode;
            case 9:
                var data = patch.s;
                if (!data) {
                    domNode.parentNode.removeChild(domNode);
                    return domNode;
                }
                var entry = data.A;
                if (typeof entry.r !== "undefined") domNode.parentNode.removeChild(domNode);
                entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
                return domNode;
            case 8:
                return _VirtualDom_applyPatchReorder(domNode, patch);
            case 5:
                return patch.s(domNode);
            default:
                _Debug_crash(10); // 'Ran into an unknown patch!'
        }
    }
    function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode) {
        var parentNode = domNode.parentNode;
        var newNode = _VirtualDom_render(vNode, eventNode);
        if (!newNode.elm_event_node_ref) newNode.elm_event_node_ref = domNode.elm_event_node_ref;
        if (parentNode && newNode !== domNode) parentNode.replaceChild(newNode, domNode);
        return newNode;
    }
    function _VirtualDom_applyPatchReorder(domNode, patch) {
        var data = patch.s;
        // remove end inserts
        var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);
        // removals
        domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);
        // inserts
        var inserts = data.x;
        for(var i = 0; i < inserts.length; i++){
            var insert = inserts[i];
            var entry = insert.A;
            var node = entry.c === 2 ? entry.s : _VirtualDom_render(entry.z, patch.u);
            domNode.insertBefore(node, domNode.childNodes[insert.r]);
        }
        // add end inserts
        if (frag) _VirtualDom_appendChild(domNode, frag);
        return domNode;
    }
    function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch) {
        if (!endInserts) return;
        var frag = _VirtualDom_doc.createDocumentFragment();
        for(var i = 0; i < endInserts.length; i++){
            var insert = endInserts[i];
            var entry = insert.A;
            _VirtualDom_appendChild(frag, entry.c === 2 ? entry.s : _VirtualDom_render(entry.z, patch.u));
        }
        return frag;
    }
    function _VirtualDom_virtualize(node) {
        // TEXT NODES
        if (node.nodeType === 3) return _VirtualDom_text(node.textContent);
        // WEIRD NODES
        if (node.nodeType !== 1) return _VirtualDom_text("");
        // ELEMENT NODES
        var attrList = _List_Nil;
        var attrs = node.attributes;
        for(var i = attrs.length; i--;){
            var attr = attrs[i];
            var name = attr.name;
            var value = attr.value;
            attrList = _List_Cons(A2(_VirtualDom_attribute, name, value), attrList);
        }
        var tag = node.tagName.toLowerCase();
        var kidList = _List_Nil;
        var kids = node.childNodes;
        for(var i = kids.length; i--;)kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
        return A3(_VirtualDom_node, tag, attrList, kidList);
    }
    function _VirtualDom_dekey(keyedNode) {
        var keyedKids = keyedNode.e;
        var len = keyedKids.length;
        var kids = new Array(len);
        for(var i = 0; i < len; i++)kids[i] = keyedKids[i].b;
        return {
            $: 1,
            c: keyedNode.c,
            d: keyedNode.d,
            e: kids,
            f: keyedNode.f,
            b: keyedNode.b
        };
    }
    // ELEMENT
    var _Debugger_element;
    var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function(sendToApp, initialModel) {
            var view = impl.view;
            /**_UNUSED/
			var domNode = args['node'];
			//*/ /**/ var domNode = args && args["node"] ? args["node"] : _Debug_crash(0);
            //*/
            var currNode = _VirtualDom_virtualize(domNode);
            return _Browser_makeAnimator(initialModel, function(model) {
                var nextNode = view(model);
                var patches = _VirtualDom_diff(currNode, nextNode);
                domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
                currNode = nextNode;
            });
        });
    });
    // DOCUMENT
    var _Debugger_document;
    var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function(sendToApp, initialModel) {
            var divertHrefToApp = impl.setup && impl.setup(sendToApp);
            var view = impl.view;
            var title = _VirtualDom_doc.title;
            var bodyNode = _VirtualDom_doc.body;
            var currNode = _VirtualDom_virtualize(bodyNode);
            return _Browser_makeAnimator(initialModel, function(model) {
                _VirtualDom_divertHrefToApp = divertHrefToApp;
                var doc = view(model);
                var nextNode = _VirtualDom_node("body")(_List_Nil)(doc.body);
                var patches = _VirtualDom_diff(currNode, nextNode);
                bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
                currNode = nextNode;
                _VirtualDom_divertHrefToApp = 0;
                title !== doc.title && (_VirtualDom_doc.title = title = doc.title);
            });
        });
    });
    // ANIMATION
    var _Browser_cancelAnimationFrame = typeof cancelAnimationFrame !== "undefined" ? cancelAnimationFrame : function(id) {
        clearTimeout(id);
    };
    var _Browser_requestAnimationFrame = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
    function _Browser_makeAnimator(model, draw) {
        draw(model);
        var state = 0;
        function updateIfNeeded() {
            state = state === 1 ? 0 : (_Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1);
        }
        return function(nextModel, isSync) {
            model = nextModel;
            isSync ? (draw(model), state === 2 && (state = 1)) : (state === 0 && _Browser_requestAnimationFrame(updateIfNeeded), state = 2);
        };
    }
    // APPLICATION
    function _Browser_application(impl) {
        var onUrlChange = impl.onUrlChange;
        var onUrlRequest = impl.onUrlRequest;
        var key = function() {
            key.a(onUrlChange(_Browser_getUrl()));
        };
        return _Browser_document({
            setup: function(sendToApp) {
                key.a = sendToApp;
                _Browser_window.addEventListener("popstate", key);
                _Browser_window.navigator.userAgent.indexOf("Trident") < 0 || _Browser_window.addEventListener("hashchange", key);
                return F2(function(domNode, event) {
                    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute("download")) {
                        event.preventDefault();
                        var href = domNode.href;
                        var curr = _Browser_getUrl();
                        var next = $elm$url$Url$fromString(href).a;
                        sendToApp(onUrlRequest(next && curr.protocol === next.protocol && curr.host === next.host && curr.port_.a === next.port_.a ? $elm$browser$Browser$Internal(next) : $elm$browser$Browser$External(href)));
                    }
                });
            },
            init: function(flags) {
                return A3(impl.init, flags, _Browser_getUrl(), key);
            },
            view: impl.view,
            update: impl.update,
            subscriptions: impl.subscriptions
        });
    }
    function _Browser_getUrl() {
        return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
    }
    var _Browser_go = F2(function(key, n) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            n && history.go(n);
            key();
        }));
    });
    var _Browser_pushUrl = F2(function(key, url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            history.pushState({}, "", url);
            key();
        }));
    });
    var _Browser_replaceUrl = F2(function(key, url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            history.replaceState({}, "", url);
            key();
        }));
    });
    // GLOBAL EVENTS
    var _Browser_fakeNode = {
        addEventListener: function() {},
        removeEventListener: function() {}
    };
    var _Browser_doc = typeof document !== "undefined" ? document : _Browser_fakeNode;
    var _Browser_window = typeof window !== "undefined" ? window : _Browser_fakeNode;
    var _Browser_on = F3(function(node, eventName, sendToSelf) {
        return _Scheduler_spawn(_Scheduler_binding(function(callback) {
            function handler(event) {
                _Scheduler_rawSpawn(sendToSelf(event));
            }
            node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && {
                passive: true
            });
            return function() {
                node.removeEventListener(eventName, handler);
            };
        }));
    });
    var _Browser_decodeEvent = F2(function(decoder, event) {
        var result = _Json_runHelp(decoder, event);
        return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
    });
    // PAGE VISIBILITY
    function _Browser_visibilityInfo() {
        return typeof _VirtualDom_doc.hidden !== "undefined" ? {
            hidden: "hidden",
            change: "visibilitychange"
        } : typeof _VirtualDom_doc.mozHidden !== "undefined" ? {
            hidden: "mozHidden",
            change: "mozvisibilitychange"
        } : typeof _VirtualDom_doc.msHidden !== "undefined" ? {
            hidden: "msHidden",
            change: "msvisibilitychange"
        } : typeof _VirtualDom_doc.webkitHidden !== "undefined" ? {
            hidden: "webkitHidden",
            change: "webkitvisibilitychange"
        } : {
            hidden: "hidden",
            change: "visibilitychange"
        };
    }
    // ANIMATION FRAMES
    function _Browser_rAF() {
        return _Scheduler_binding(function(callback) {
            var id = _Browser_requestAnimationFrame(function() {
                callback(_Scheduler_succeed(Date.now()));
            });
            return function() {
                _Browser_cancelAnimationFrame(id);
            };
        });
    }
    function _Browser_now() {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(Date.now()));
        });
    }
    // DOM STUFF
    function _Browser_withNode(id, doStuff) {
        return _Scheduler_binding(function(callback) {
            _Browser_requestAnimationFrame(function() {
                var node = document.getElementById(id);
                callback(node ? _Scheduler_succeed(doStuff(node)) : _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id)));
            });
        });
    }
    function _Browser_withWindow(doStuff) {
        return _Scheduler_binding(function(callback) {
            _Browser_requestAnimationFrame(function() {
                callback(_Scheduler_succeed(doStuff()));
            });
        });
    }
    // FOCUS and BLUR
    var _Browser_call = F2(function(functionName, id) {
        return _Browser_withNode(id, function(node) {
            node[functionName]();
            return _Utils_Tuple0;
        });
    });
    // WINDOW VIEWPORT
    function _Browser_getViewport() {
        return {
            scene: _Browser_getScene(),
            viewport: {
                x: _Browser_window.pageXOffset,
                y: _Browser_window.pageYOffset,
                width: _Browser_doc.documentElement.clientWidth,
                height: _Browser_doc.documentElement.clientHeight
            }
        };
    }
    function _Browser_getScene() {
        var body = _Browser_doc.body;
        var elem = _Browser_doc.documentElement;
        return {
            width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
            height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
        };
    }
    var _Browser_setViewport = F2(function(x, y) {
        return _Browser_withWindow(function() {
            _Browser_window.scroll(x, y);
            return _Utils_Tuple0;
        });
    });
    // ELEMENT VIEWPORT
    function _Browser_getViewportOf(id) {
        return _Browser_withNode(id, function(node) {
            return {
                scene: {
                    width: node.scrollWidth,
                    height: node.scrollHeight
                },
                viewport: {
                    x: node.scrollLeft,
                    y: node.scrollTop,
                    width: node.clientWidth,
                    height: node.clientHeight
                }
            };
        });
    }
    var _Browser_setViewportOf = F3(function(id, x, y) {
        return _Browser_withNode(id, function(node) {
            node.scrollLeft = x;
            node.scrollTop = y;
            return _Utils_Tuple0;
        });
    });
    // ELEMENT
    function _Browser_getElement(id) {
        return _Browser_withNode(id, function(node) {
            var rect = node.getBoundingClientRect();
            var x = _Browser_window.pageXOffset;
            var y = _Browser_window.pageYOffset;
            return {
                scene: _Browser_getScene(),
                viewport: {
                    x: x,
                    y: y,
                    width: _Browser_doc.documentElement.clientWidth,
                    height: _Browser_doc.documentElement.clientHeight
                },
                element: {
                    x: x + rect.left,
                    y: y + rect.top,
                    width: rect.width,
                    height: rect.height
                }
            };
        });
    }
    // LOAD and RELOAD
    function _Browser_reload(skipCache) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback) {
            _VirtualDom_doc.location.reload(skipCache);
        }));
    }
    function _Browser_load(url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback) {
            try {
                _Browser_window.location = url;
            } catch (err) {
                // Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
                // Other browsers reload the page, so let's be consistent about that.
                _VirtualDom_doc.location.reload(false);
            }
        }));
    }
    // SEND REQUEST
    var _Http_toTask = F3(function(router, toTask, request) {
        return _Scheduler_binding(function(callback) {
            function done(response) {
                callback(toTask(request.expect.a(response)));
            }
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("error", function() {
                done($elm$http$Http$NetworkError_);
            });
            xhr.addEventListener("timeout", function() {
                done($elm$http$Http$Timeout_);
            });
            xhr.addEventListener("load", function() {
                done(_Http_toResponse(request.expect.b, xhr));
            });
            $elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);
            try {
                xhr.open(request.method, request.url, true);
            } catch (e) {
                return done($elm$http$Http$BadUrl_(request.url));
            }
            _Http_configureRequest(xhr, request);
            request.body.a && xhr.setRequestHeader("Content-Type", request.body.a);
            xhr.send(request.body.b);
            return function() {
                xhr.c = true;
                xhr.abort();
            };
        });
    });
    // CONFIGURE
    function _Http_configureRequest(xhr, request) {
        for(var headers = request.headers; headers.b; headers = headers.b)xhr.setRequestHeader(headers.a.a, headers.a.b);
        xhr.timeout = request.timeout.a || 0;
        xhr.responseType = request.expect.d;
        xhr.withCredentials = request.allowCookiesFromOtherDomains;
    }
    // RESPONSES
    function _Http_toResponse(toBody, xhr) {
        return A2(200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_, _Http_toMetadata(xhr), toBody(xhr.response));
    }
    // METADATA
    function _Http_toMetadata(xhr) {
        return {
            url: xhr.responseURL,
            statusCode: xhr.status,
            statusText: xhr.statusText,
            headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
        };
    }
    // HEADERS
    function _Http_parseHeaders(rawHeaders) {
        if (!rawHeaders) return $elm$core$Dict$empty;
        var headers = $elm$core$Dict$empty;
        var headerPairs = rawHeaders.split("\r\n");
        for(var i = headerPairs.length; i--;){
            var headerPair = headerPairs[i];
            var index = headerPair.indexOf(": ");
            if (index > 0) {
                var key = headerPair.substring(0, index);
                var value = headerPair.substring(index + 2);
                headers = A3($elm$core$Dict$update, key, function(oldValue) {
                    return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue) ? value + ", " + oldValue.a : value);
                }, headers);
            }
        }
        return headers;
    }
    // EXPECT
    var _Http_expect = F3(function(type, toBody, toValue) {
        return {
            $: 0,
            d: type,
            b: toBody,
            a: toValue
        };
    });
    var _Http_mapExpect = F2(function(func, expect) {
        return {
            $: 0,
            d: expect.d,
            b: expect.b,
            a: function(x) {
                return func(expect.a(x));
            }
        };
    });
    function _Http_toDataView(arrayBuffer) {
        return new DataView(arrayBuffer);
    }
    // BODY and PARTS
    var _Http_emptyBody = {
        $: 0
    };
    var _Http_pair = F2(function(a, b) {
        return {
            $: 0,
            a: a,
            b: b
        };
    });
    function _Http_toFormData(parts) {
        for(var formData = new FormData(); parts.b; parts = parts.b){
            var part = parts.a;
            formData.append(part.a, part.b);
        }
        return formData;
    }
    var _Http_bytesToBlob = F2(function(mime, bytes) {
        return new Blob([
            bytes
        ], {
            type: mime
        });
    });
    // PROGRESS
    function _Http_track(router, xhr, tracker) {
        // TODO check out lengthComputable on loadstart event
        xhr.upload.addEventListener("progress", function(event) {
            if (xhr.c) return;
            _Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
                sent: event.loaded,
                size: event.total
            }))));
        });
        xhr.addEventListener("progress", function(event) {
            if (xhr.c) return;
            _Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
                received: event.loaded,
                size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
            }))));
        });
    }
    function _Url_percentEncode(string) {
        return encodeURIComponent(string);
    }
    function _Url_percentDecode(string) {
        try {
            return $elm$core$Maybe$Just(decodeURIComponent(string));
        } catch (e) {
            return $elm$core$Maybe$Nothing;
        }
    }
    // STRINGS
    var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString) {
        var smallLength = smallString.length;
        var isGood = offset + smallLength <= bigString.length;
        for(var i = 0; isGood && i < smallLength;){
            var code = bigString.charCodeAt(offset);
            isGood = smallString[i++] === bigString[offset++] && (code === 0x000A /* \n */  ? (row++, col = 1) : (col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1));
        }
        return _Utils_Tuple3(isGood ? offset : -1, row, col);
    });
    // CHARS
    var _Parser_isSubChar = F3(function(predicate, offset, string) {
        return string.length <= offset ? -1 : (string.charCodeAt(offset) & 0xF800) === 0xD800 ? predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1 : predicate(_Utils_chr(string[offset])) ? string[offset] === "\n" ? -2 : offset + 1 : -1;
    });
    var _Parser_isAsciiCode = F3(function(code, offset, string) {
        return string.charCodeAt(offset) === code;
    });
    // NUMBERS
    var _Parser_chompBase10 = F2(function(offset, string) {
        for(; offset < string.length; offset++){
            var code = string.charCodeAt(offset);
            if (code < 0x30 || 0x39 < code) return offset;
        }
        return offset;
    });
    var _Parser_consumeBase = F3(function(base, offset, string) {
        for(var total = 0; offset < string.length; offset++){
            var digit = string.charCodeAt(offset) - 0x30;
            if (digit < 0 || base <= digit) break;
            total = base * total + digit;
        }
        return _Utils_Tuple2(offset, total);
    });
    var _Parser_consumeBase16 = F2(function(offset, string) {
        for(var total = 0; offset < string.length; offset++){
            var code = string.charCodeAt(offset);
            if (0x30 <= code && code <= 0x39) total = 16 * total + code - 0x30;
            else if (0x41 <= code && code <= 0x46) total = 16 * total + code - 55;
            else if (0x61 <= code && code <= 0x66) total = 16 * total + code - 87;
            else break;
        }
        return _Utils_Tuple2(offset, total);
    });
    // FIND STRING
    var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString) {
        var newOffset = bigString.indexOf(smallString, offset);
        var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;
        while(offset < target){
            var code = bigString.charCodeAt(offset++);
            code === 0x000A /* \n */  ? (col = 1, row++) : (col++, (code & 0xF800) === 0xD800 && offset++);
        }
        return _Utils_Tuple3(newOffset, row, col);
    });
    function _Time_now(millisToPosix) {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(millisToPosix(Date.now())));
        });
    }
    var _Time_setInterval = F2(function(interval, task) {
        return _Scheduler_binding(function(callback) {
            var id = setInterval(function() {
                _Scheduler_rawSpawn(task);
            }, interval);
            return function() {
                clearInterval(id);
            };
        });
    });
    function _Time_here() {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(A2($elm$time$Time$customZone, -new Date().getTimezoneOffset(), _List_Nil)));
        });
    }
    function _Time_getZoneName() {
        return _Scheduler_binding(function(callback) {
            try {
                var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
            } catch (e) {
                var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
            }
            callback(_Scheduler_succeed(name));
        });
    }
    // CREATE
    var _Regex_never = /.^/;
    var _Regex_fromStringWith = F2(function(options, string) {
        var flags = "g";
        if (options.multiline) flags += "m";
        if (options.caseInsensitive) flags += "i";
        try {
            return $elm$core$Maybe$Just(new RegExp(string, flags));
        } catch (error) {
            return $elm$core$Maybe$Nothing;
        }
    });
    // USE
    var _Regex_contains = F2(function(re, string) {
        return string.match(re) !== null;
    });
    var _Regex_findAtMost = F3(function(n, re, str) {
        var out = [];
        var number = 0;
        var string = str;
        var lastIndex = re.lastIndex;
        var prevLastIndex = -1;
        var result;
        while(number++ < n && (result = re.exec(string))){
            if (prevLastIndex == re.lastIndex) break;
            var i = result.length - 1;
            var subs = new Array(i);
            while(i > 0){
                var submatch = result[i];
                subs[--i] = submatch ? $elm$core$Maybe$Just(submatch) : $elm$core$Maybe$Nothing;
            }
            out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
            prevLastIndex = re.lastIndex;
        }
        re.lastIndex = lastIndex;
        return _List_fromArray(out);
    });
    var _Regex_replaceAtMost = F4(function(n, re, replacer, string) {
        var count = 0;
        function jsReplacer(match) {
            if (count++ >= n) return match;
            var i = arguments.length - 3;
            var submatches = new Array(i);
            while(i > 0){
                var submatch = arguments[i];
                submatches[--i] = submatch ? $elm$core$Maybe$Just(submatch) : $elm$core$Maybe$Nothing;
            }
            return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
        }
        return string.replace(re, jsReplacer);
    });
    var _Regex_splitAtMost = F3(function(n, re, str) {
        var string = str;
        var out = [];
        var start = re.lastIndex;
        var restoreLastIndex = re.lastIndex;
        while(n--){
            var result = re.exec(string);
            if (!result) break;
            out.push(string.slice(start, result.index));
            start = re.lastIndex;
        }
        out.push(string.slice(start));
        re.lastIndex = restoreLastIndex;
        return _List_fromArray(out);
    });
    var _Regex_infinity = Infinity;
    var _Bitwise_and = F2(function(a, b) {
        return a & b;
    });
    var _Bitwise_or = F2(function(a, b) {
        return a | b;
    });
    var _Bitwise_xor = F2(function(a, b) {
        return a ^ b;
    });
    function _Bitwise_complement(a) {
        return ~a;
    }
    var _Bitwise_shiftLeftBy = F2(function(offset, a) {
        return a << offset;
    });
    var _Bitwise_shiftRightBy = F2(function(offset, a) {
        return a >> offset;
    });
    var _Bitwise_shiftRightZfBy = F2(function(offset, a) {
        return a >>> offset;
    });
    var $elm$core$Basics$EQ = {
        $: "EQ"
    };
    var $elm$core$Basics$GT = {
        $: "GT"
    };
    var $elm$core$Basics$LT = {
        $: "LT"
    };
    var $elm$core$List$cons = _List_cons;
    var $elm$core$Dict$foldr = F3(function(func, acc, t) {
        foldr: while(true){
            if (t.$ === "RBEmpty_elm_builtin") return acc;
            else {
                var key = t.b;
                var value = t.c;
                var left = t.d;
                var right = t.e;
                var $temp$func = func, $temp$acc = A3(func, key, value, A3($elm$core$Dict$foldr, func, acc, right)), $temp$t = left;
                func = $temp$func;
                acc = $temp$acc;
                t = $temp$t;
                continue foldr;
            }
        }
    });
    var $elm$core$Dict$toList = function(dict) {
        return A3($elm$core$Dict$foldr, F3(function(key, value, list) {
            return A2($elm$core$List$cons, _Utils_Tuple2(key, value), list);
        }), _List_Nil, dict);
    };
    var $elm$core$Dict$keys = function(dict) {
        return A3($elm$core$Dict$foldr, F3(function(key, value, keyList) {
            return A2($elm$core$List$cons, key, keyList);
        }), _List_Nil, dict);
    };
    var $elm$core$Set$toList = function(_v0) {
        var dict = _v0.a;
        return $elm$core$Dict$keys(dict);
    };
    var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
    var $elm$core$Array$foldr = F3(function(func, baseCase, _v0) {
        var tree = _v0.c;
        var tail = _v0.d;
        var helper = F2(function(node, acc) {
            if (node.$ === "SubTree") {
                var subTree = node.a;
                return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
            } else {
                var values = node.a;
                return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
            }
        });
        return A3($elm$core$Elm$JsArray$foldr, helper, A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail), tree);
    });
    var $elm$core$Array$toList = function(array) {
        return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
    };
    var $elm$core$Result$Err = function(a) {
        return {
            $: "Err",
            a: a
        };
    };
    var $elm$json$Json$Decode$Failure = F2(function(a, b) {
        return {
            $: "Failure",
            a: a,
            b: b
        };
    });
    var $elm$json$Json$Decode$Field = F2(function(a, b) {
        return {
            $: "Field",
            a: a,
            b: b
        };
    });
    var $elm$json$Json$Decode$Index = F2(function(a, b) {
        return {
            $: "Index",
            a: a,
            b: b
        };
    });
    var $elm$core$Result$Ok = function(a) {
        return {
            $: "Ok",
            a: a
        };
    };
    var $elm$json$Json$Decode$OneOf = function(a) {
        return {
            $: "OneOf",
            a: a
        };
    };
    var $elm$core$Basics$False = {
        $: "False"
    };
    var $elm$core$Basics$add = _Basics_add;
    var $elm$core$Maybe$Just = function(a) {
        return {
            $: "Just",
            a: a
        };
    };
    var $elm$core$Maybe$Nothing = {
        $: "Nothing"
    };
    var $elm$core$String$all = _String_all;
    var $elm$core$Basics$and = _Basics_and;
    var $elm$core$Basics$append = _Utils_append;
    var $elm$json$Json$Encode$encode = _Json_encode;
    var $elm$core$String$fromInt = _String_fromNumber;
    var $elm$core$String$join = F2(function(sep, chunks) {
        return A2(_String_join, sep, _List_toArray(chunks));
    });
    var $elm$core$String$split = F2(function(sep, string) {
        return _List_fromArray(A2(_String_split, sep, string));
    });
    var $elm$json$Json$Decode$indent = function(str) {
        return A2($elm$core$String$join, "\n    ", A2($elm$core$String$split, "\n", str));
    };
    var $elm$core$List$foldl = F3(function(func, acc, list) {
        foldl: while(true){
            if (!list.b) return acc;
            else {
                var x = list.a;
                var xs = list.b;
                var $temp$func = func, $temp$acc = A2(func, x, acc), $temp$list = xs;
                func = $temp$func;
                acc = $temp$acc;
                list = $temp$list;
                continue foldl;
            }
        }
    });
    var $elm$core$List$length = function(xs) {
        return A3($elm$core$List$foldl, F2(function(_v0, i) {
            return i + 1;
        }), 0, xs);
    };
    var $elm$core$List$map2 = _List_map2;
    var $elm$core$Basics$le = _Utils_le;
    var $elm$core$Basics$sub = _Basics_sub;
    var $elm$core$List$rangeHelp = F3(function(lo, hi, list) {
        rangeHelp: while(true){
            if (_Utils_cmp(lo, hi) < 1) {
                var $temp$lo = lo, $temp$hi = hi - 1, $temp$list = A2($elm$core$List$cons, hi, list);
                lo = $temp$lo;
                hi = $temp$hi;
                list = $temp$list;
                continue rangeHelp;
            } else return list;
        }
    });
    var $elm$core$List$range = F2(function(lo, hi) {
        return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
    });
    var $elm$core$List$indexedMap = F2(function(f, xs) {
        return A3($elm$core$List$map2, f, A2($elm$core$List$range, 0, $elm$core$List$length(xs) - 1), xs);
    });
    var $elm$core$Char$toCode = _Char_toCode;
    var $elm$core$Char$isLower = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return 97 <= code && code <= 122;
    };
    var $elm$core$Char$isUpper = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return code <= 90 && 65 <= code;
    };
    var $elm$core$Basics$or = _Basics_or;
    var $elm$core$Char$isAlpha = function(_char) {
        return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
    };
    var $elm$core$Char$isDigit = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return code <= 57 && 48 <= code;
    };
    var $elm$core$Char$isAlphaNum = function(_char) {
        return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char);
    };
    var $elm$core$List$reverse = function(list) {
        return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
    };
    var $elm$core$String$uncons = _String_uncons;
    var $elm$json$Json$Decode$errorOneOf = F2(function(i, error) {
        return "\n\n(" + ($elm$core$String$fromInt(i + 1) + (") " + $elm$json$Json$Decode$indent($elm$json$Json$Decode$errorToString(error))));
    });
    var $elm$json$Json$Decode$errorToString = function(error) {
        return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
    };
    var $elm$json$Json$Decode$errorToStringHelp = F2(function(error, context) {
        errorToStringHelp: while(true)switch(error.$){
            case "Field":
                var f = error.a;
                var err = error.b;
                var isSimple = function() {
                    var _v1 = $elm$core$String$uncons(f);
                    if (_v1.$ === "Nothing") return false;
                    else {
                        var _v2 = _v1.a;
                        var _char = _v2.a;
                        var rest = _v2.b;
                        return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
                    }
                }();
                var fieldName = isSimple ? "." + f : "['" + (f + "']");
                var $temp$error = err, $temp$context = A2($elm$core$List$cons, fieldName, context);
                error = $temp$error;
                context = $temp$context;
                continue errorToStringHelp;
            case "Index":
                var i = error.a;
                var err = error.b;
                var indexName = "[" + ($elm$core$String$fromInt(i) + "]");
                var $temp$error = err, $temp$context = A2($elm$core$List$cons, indexName, context);
                error = $temp$error;
                context = $temp$context;
                continue errorToStringHelp;
            case "OneOf":
                var errors = error.a;
                if (!errors.b) return "Ran into a Json.Decode.oneOf with no possibilities" + function() {
                    if (!context.b) return "!";
                    else return " at json" + A2($elm$core$String$join, "", $elm$core$List$reverse(context));
                }();
                else if (!errors.b.b) {
                    var err = errors.a;
                    var $temp$error = err, $temp$context = context;
                    error = $temp$error;
                    context = $temp$context;
                    continue errorToStringHelp;
                } else {
                    var starter = function() {
                        if (!context.b) return "Json.Decode.oneOf";
                        else return "The Json.Decode.oneOf at json" + A2($elm$core$String$join, "", $elm$core$List$reverse(context));
                    }();
                    var introduction = starter + (" failed in the following " + ($elm$core$String$fromInt($elm$core$List$length(errors)) + " ways:"));
                    return A2($elm$core$String$join, "\n\n", A2($elm$core$List$cons, introduction, A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
                }
            default:
                var msg = error.a;
                var json = error.b;
                var introduction = function() {
                    if (!context.b) return "Problem with the given value:\n\n";
                    else return "Problem with the value at json" + (A2($elm$core$String$join, "", $elm$core$List$reverse(context)) + ":\n\n    ");
                }();
                return introduction + ($elm$json$Json$Decode$indent(A2($elm$json$Json$Encode$encode, 4, json)) + ("\n\n" + msg));
        }
    });
    var $elm$core$Array$branchFactor = 32;
    var $elm$core$Array$Array_elm_builtin = F4(function(a, b, c, d) {
        return {
            $: "Array_elm_builtin",
            a: a,
            b: b,
            c: c,
            d: d
        };
    });
    var $elm$core$Elm$JsArray$empty = _JsArray_empty;
    var $elm$core$Basics$ceiling = _Basics_ceiling;
    var $elm$core$Basics$fdiv = _Basics_fdiv;
    var $elm$core$Basics$logBase = F2(function(base, number) {
        return _Basics_log(number) / _Basics_log(base);
    });
    var $elm$core$Basics$toFloat = _Basics_toFloat;
    var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
    var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
    var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
    var $elm$core$Array$Leaf = function(a) {
        return {
            $: "Leaf",
            a: a
        };
    };
    var $elm$core$Basics$apL = F2(function(f, x) {
        return f(x);
    });
    var $elm$core$Basics$apR = F2(function(x, f) {
        return f(x);
    });
    var $elm$core$Basics$eq = _Utils_equal;
    var $elm$core$Basics$floor = _Basics_floor;
    var $elm$core$Elm$JsArray$length = _JsArray_length;
    var $elm$core$Basics$gt = _Utils_gt;
    var $elm$core$Basics$max = F2(function(x, y) {
        return _Utils_cmp(x, y) > 0 ? x : y;
    });
    var $elm$core$Basics$mul = _Basics_mul;
    var $elm$core$Array$SubTree = function(a) {
        return {
            $: "SubTree",
            a: a
        };
    };
    var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
    var $elm$core$Array$compressNodes = F2(function(nodes, acc) {
        compressNodes: while(true){
            var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
            var node = _v0.a;
            var remainingNodes = _v0.b;
            var newAcc = A2($elm$core$List$cons, $elm$core$Array$SubTree(node), acc);
            if (!remainingNodes.b) return $elm$core$List$reverse(newAcc);
            else {
                var $temp$nodes = remainingNodes, $temp$acc = newAcc;
                nodes = $temp$nodes;
                acc = $temp$acc;
                continue compressNodes;
            }
        }
    });
    var $elm$core$Tuple$first = function(_v0) {
        var x = _v0.a;
        return x;
    };
    var $elm$core$Array$treeFromBuilder = F2(function(nodeList, nodeListSize) {
        treeFromBuilder: while(true){
            var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
            if (newNodeSize === 1) return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
            else {
                var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil), $temp$nodeListSize = newNodeSize;
                nodeList = $temp$nodeList;
                nodeListSize = $temp$nodeListSize;
                continue treeFromBuilder;
            }
        }
    });
    var $elm$core$Array$builderToArray = F2(function(reverseNodeList, builder) {
        if (!builder.nodeListSize) return A4($elm$core$Array$Array_elm_builtin, $elm$core$Elm$JsArray$length(builder.tail), $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, builder.tail);
        else {
            var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
            var depth = $elm$core$Basics$floor(A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
            var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
            var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
            return A4($elm$core$Array$Array_elm_builtin, $elm$core$Elm$JsArray$length(builder.tail) + treeLen, A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep), tree, builder.tail);
        }
    });
    var $elm$core$Basics$idiv = _Basics_idiv;
    var $elm$core$Basics$lt = _Utils_lt;
    var $elm$core$Array$initializeHelp = F5(function(fn, fromIndex, len, nodeList, tail) {
        initializeHelp: while(true){
            if (fromIndex < 0) return A2($elm$core$Array$builderToArray, false, {
                nodeList: nodeList,
                nodeListSize: len / $elm$core$Array$branchFactor | 0,
                tail: tail
            });
            else {
                var leaf = $elm$core$Array$Leaf(A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
                var $temp$fn = fn, $temp$fromIndex = fromIndex - $elm$core$Array$branchFactor, $temp$len = len, $temp$nodeList = A2($elm$core$List$cons, leaf, nodeList), $temp$tail = tail;
                fn = $temp$fn;
                fromIndex = $temp$fromIndex;
                len = $temp$len;
                nodeList = $temp$nodeList;
                tail = $temp$tail;
                continue initializeHelp;
            }
        }
    });
    var $elm$core$Basics$remainderBy = _Basics_remainderBy;
    var $elm$core$Array$initialize = F2(function(len, fn) {
        if (len <= 0) return $elm$core$Array$empty;
        else {
            var tailLen = len % $elm$core$Array$branchFactor;
            var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
            var initialFromIndex = len - tailLen - $elm$core$Array$branchFactor;
            return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
        }
    });
    var $elm$core$Basics$True = {
        $: "True"
    };
    var $elm$core$Result$isOk = function(result) {
        if (result.$ === "Ok") return true;
        else return false;
    };
    var $elm$json$Json$Decode$map = _Json_map1;
    var $elm$json$Json$Decode$map2 = _Json_map2;
    var $elm$json$Json$Decode$succeed = _Json_succeed;
    var $elm$virtual_dom$VirtualDom$toHandlerInt = function(handler) {
        switch(handler.$){
            case "Normal":
                return 0;
            case "MayStopPropagation":
                return 1;
            case "MayPreventDefault":
                return 2;
            default:
                return 3;
        }
    };
    var $elm$browser$Browser$External = function(a) {
        return {
            $: "External",
            a: a
        };
    };
    var $elm$browser$Browser$Internal = function(a) {
        return {
            $: "Internal",
            a: a
        };
    };
    var $elm$core$Basics$identity = function(x) {
        return x;
    };
    var $elm$browser$Browser$Dom$NotFound = function(a) {
        return {
            $: "NotFound",
            a: a
        };
    };
    var $elm$url$Url$Http = {
        $: "Http"
    };
    var $elm$url$Url$Https = {
        $: "Https"
    };
    var $elm$url$Url$Url = F6(function(protocol, host, port_, path, query, fragment) {
        return {
            fragment: fragment,
            host: host,
            path: path,
            port_: port_,
            protocol: protocol,
            query: query
        };
    });
    var $elm$core$String$contains = _String_contains;
    var $elm$core$String$length = _String_length;
    var $elm$core$String$slice = _String_slice;
    var $elm$core$String$dropLeft = F2(function(n, string) {
        return n < 1 ? string : A3($elm$core$String$slice, n, $elm$core$String$length(string), string);
    });
    var $elm$core$String$indexes = _String_indexes;
    var $elm$core$String$isEmpty = function(string) {
        return string === "";
    };
    var $elm$core$String$left = F2(function(n, string) {
        return n < 1 ? "" : A3($elm$core$String$slice, 0, n, string);
    });
    var $elm$core$String$toInt = _String_toInt;
    var $elm$url$Url$chompBeforePath = F5(function(protocol, path, params, frag, str) {
        if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, "@", str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, ":", str);
            if (!_v0.b) return $elm$core$Maybe$Just(A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
            else {
                if (!_v0.b.b) {
                    var i = _v0.a;
                    var _v1 = $elm$core$String$toInt(A2($elm$core$String$dropLeft, i + 1, str));
                    if (_v1.$ === "Nothing") return $elm$core$Maybe$Nothing;
                    else {
                        var port_ = _v1;
                        return $elm$core$Maybe$Just(A6($elm$url$Url$Url, protocol, A2($elm$core$String$left, i, str), port_, path, params, frag));
                    }
                } else return $elm$core$Maybe$Nothing;
            }
        }
    });
    var $elm$url$Url$chompBeforeQuery = F4(function(protocol, params, frag, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, "/", str);
            if (!_v0.b) return A5($elm$url$Url$chompBeforePath, protocol, "/", params, frag, str);
            else {
                var i = _v0.a;
                return A5($elm$url$Url$chompBeforePath, protocol, A2($elm$core$String$dropLeft, i, str), params, frag, A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$url$Url$chompBeforeFragment = F3(function(protocol, frag, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, "?", str);
            if (!_v0.b) return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
            else {
                var i = _v0.a;
                return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Just(A2($elm$core$String$dropLeft, i + 1, str)), frag, A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$url$Url$chompAfterProtocol = F2(function(protocol, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, "#", str);
            if (!_v0.b) return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
            else {
                var i = _v0.a;
                return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Just(A2($elm$core$String$dropLeft, i + 1, str)), A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$core$String$startsWith = _String_startsWith;
    var $elm$url$Url$fromString = function(str) {
        return A2($elm$core$String$startsWith, "http://", str) ? A2($elm$url$Url$chompAfterProtocol, $elm$url$Url$Http, A2($elm$core$String$dropLeft, 7, str)) : A2($elm$core$String$startsWith, "https://", str) ? A2($elm$url$Url$chompAfterProtocol, $elm$url$Url$Https, A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing;
    };
    var $elm$core$Basics$never = function(_v0) {
        never: while(true){
            var nvr = _v0.a;
            var $temp$_v0 = nvr;
            _v0 = $temp$_v0;
            continue never;
        }
    };
    var $elm$core$Task$Perform = function(a) {
        return {
            $: "Perform",
            a: a
        };
    };
    var $elm$core$Task$succeed = _Scheduler_succeed;
    var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
    var $elm$core$List$foldrHelper = F4(function(fn, acc, ctr, ls) {
        if (!ls.b) return acc;
        else {
            var a = ls.a;
            var r1 = ls.b;
            if (!r1.b) return A2(fn, a, acc);
            else {
                var b = r1.a;
                var r2 = r1.b;
                if (!r2.b) return A2(fn, a, A2(fn, b, acc));
                else {
                    var c = r2.a;
                    var r3 = r2.b;
                    if (!r3.b) return A2(fn, a, A2(fn, b, A2(fn, c, acc)));
                    else {
                        var d = r3.a;
                        var r4 = r3.b;
                        var res = ctr > 500 ? A3($elm$core$List$foldl, fn, acc, $elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
                        return A2(fn, a, A2(fn, b, A2(fn, c, A2(fn, d, res))));
                    }
                }
            }
        }
    });
    var $elm$core$List$foldr = F3(function(fn, acc, ls) {
        return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
    });
    var $elm$core$List$map = F2(function(f, xs) {
        return A3($elm$core$List$foldr, F2(function(x, acc) {
            return A2($elm$core$List$cons, f(x), acc);
        }), _List_Nil, xs);
    });
    var $elm$core$Task$andThen = _Scheduler_andThen;
    var $elm$core$Task$map = F2(function(func, taskA) {
        return A2($elm$core$Task$andThen, function(a) {
            return $elm$core$Task$succeed(func(a));
        }, taskA);
    });
    var $elm$core$Task$map2 = F3(function(func, taskA, taskB) {
        return A2($elm$core$Task$andThen, function(a) {
            return A2($elm$core$Task$andThen, function(b) {
                return $elm$core$Task$succeed(A2(func, a, b));
            }, taskB);
        }, taskA);
    });
    var $elm$core$Task$sequence = function(tasks) {
        return A3($elm$core$List$foldr, $elm$core$Task$map2($elm$core$List$cons), $elm$core$Task$succeed(_List_Nil), tasks);
    };
    var $elm$core$Platform$sendToApp = _Platform_sendToApp;
    var $elm$core$Task$spawnCmd = F2(function(router, _v0) {
        var task = _v0.a;
        return _Scheduler_spawn(A2($elm$core$Task$andThen, $elm$core$Platform$sendToApp(router), task));
    });
    var $elm$core$Task$onEffects = F3(function(router, commands, state) {
        return A2($elm$core$Task$map, function(_v0) {
            return _Utils_Tuple0;
        }, $elm$core$Task$sequence(A2($elm$core$List$map, $elm$core$Task$spawnCmd(router), commands)));
    });
    var $elm$core$Task$onSelfMsg = F3(function(_v0, _v1, _v2) {
        return $elm$core$Task$succeed(_Utils_Tuple0);
    });
    var $elm$core$Task$cmdMap = F2(function(tagger, _v0) {
        var task = _v0.a;
        return $elm$core$Task$Perform(A2($elm$core$Task$map, tagger, task));
    });
    _Platform_effectManagers["Task"] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
    var $elm$core$Task$command = _Platform_leaf("Task");
    var $elm$core$Task$perform = F2(function(toMessage, task) {
        return $elm$core$Task$command($elm$core$Task$Perform(A2($elm$core$Task$map, toMessage, task)));
    });
    var $elm$browser$Browser$element = _Browser_element;
    var $author$project$Main$BadConfig = function(a) {
        return {
            $: "BadConfig",
            a: a
        };
    };
    var $author$project$Main$GoodConfig = function(a) {
        return {
            $: "GoodConfig",
            a: a
        };
    };
    var $author$project$Main$GotRoom = function(a) {
        return {
            $: "GotRoom",
            a: a
        };
    };
    var $author$project$Main$Tick = function(a) {
        return {
            $: "Tick",
            a: a
        };
    };
    var $elm$core$Basics$composeL = F3(function(g, f, x) {
        return g(f(x));
    });
    var $elm$core$Task$onError = _Scheduler_onError;
    var $elm$core$Task$attempt = F2(function(resultToMessage, task) {
        return $elm$core$Task$command($elm$core$Task$Perform(A2($elm$core$Task$onError, A2($elm$core$Basics$composeL, A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage), $elm$core$Result$Err), A2($elm$core$Task$andThen, A2($elm$core$Basics$composeL, A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage), $elm$core$Result$Ok), task))));
    });
    var $elm$core$Platform$Cmd$batch = _Platform_batch;
    var $author$project$Room$Room = function(a) {
        return {
            $: "Room",
            a: a
        };
    };
    var $author$project$Session$RetryAfterMs = function(a) {
        return {
            $: "RetryAfterMs",
            a: a
        };
    };
    var $author$project$Session$UnhandledError = F2(function(a, b) {
        return {
            $: "UnhandledError",
            a: a,
            b: b
        };
    });
    var $elm$json$Json$Decode$andThen = _Json_andThen;
    var $elm$json$Json$Decode$field = _Json_decodeField;
    var $elm$json$Json$Decode$int = _Json_decodeInt;
    var $elm$json$Json$Decode$oneOf = _Json_oneOf;
    var $elm$core$Tuple$pair = F2(function(a, b) {
        return _Utils_Tuple2(a, b);
    });
    var $elm$json$Json$Decode$string = _Json_decodeString;
    var $author$project$Session$decodeMatrixError = A2($elm$json$Json$Decode$andThen, function(_v0) {
        var errcode = _v0.a;
        var error = _v0.b;
        if (errcode === "M_LIMIT_EXCEEDED") return $elm$json$Json$Decode$oneOf(_List_fromArray([
            A2($elm$json$Json$Decode$map, $author$project$Session$RetryAfterMs, A2($elm$json$Json$Decode$field, "retry_after_ms", $elm$json$Json$Decode$int)),
            $elm$json$Json$Decode$succeed(A2($author$project$Session$UnhandledError, errcode, error))
        ]));
        else return $elm$json$Json$Decode$succeed(A2($author$project$Session$UnhandledError, errcode, error));
    }, A3($elm$json$Json$Decode$map2, $elm$core$Tuple$pair, A2($elm$json$Json$Decode$field, "errcode", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "error", $elm$json$Json$Decode$string)));
    var $elm$json$Json$Decode$decodeString = _Json_runOnString;
    var $author$project$Session$retryConstant = 30;
    var $elm$core$Result$withDefault = F2(function(def, result) {
        if (result.$ === "Ok") {
            var a = result.a;
            return a;
        } else return def;
    });
    var $author$project$Session$handleJsonResponse = F2(function(decoder, response) {
        switch(response.$){
            case "BadUrl_":
                var url = response.a;
                return $elm$core$Result$Err(A2($author$project$Session$UnhandledError, "Bad url", url));
            case "Timeout_":
                return $elm$core$Result$Err($author$project$Session$RetryAfterMs($author$project$Session$retryConstant));
            case "NetworkError_":
                return $elm$core$Result$Err($author$project$Session$RetryAfterMs($author$project$Session$retryConstant));
            case "BadStatus_":
                var body = response.b;
                return $elm$core$Result$Err(A2($elm$core$Result$withDefault, A2($author$project$Session$UnhandledError, "Could not decode error", body), A2($elm$json$Json$Decode$decodeString, $author$project$Session$decodeMatrixError, body)));
            default:
                var body = response.b;
                var _v1 = A2($elm$json$Json$Decode$decodeString, decoder, body);
                if (_v1.$ === "Err") return $elm$core$Result$Err(A2($author$project$Session$UnhandledError, "Could not decode response", body));
                else {
                    var result = _v1.a;
                    return $elm$core$Result$Ok(result);
                }
        }
    });
    var $elm$http$Http$Header = F2(function(a, b) {
        return {
            $: "Header",
            a: a,
            b: b
        };
    });
    var $elm$http$Http$header = $elm$http$Http$Header;
    var $elm$core$Maybe$map = F2(function(f, maybe) {
        if (maybe.$ === "Just") {
            var value = maybe.a;
            return $elm$core$Maybe$Just(f(value));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Session$Error = F2(function(a, b) {
        return {
            $: "Error",
            a: a,
            b: b
        };
    });
    var $elm$core$Task$fail = _Scheduler_fail;
    var $elm$core$Process$sleep = _Process_sleep;
    var $author$project$Session$onError = F2(function(request, error) {
        if (error.$ === "UnhandledError") {
            var errcode = error.a;
            var err = error.b;
            return $elm$core$Task$fail(A2($author$project$Session$Error, errcode, err));
        } else {
            var ms = error.a;
            return A2($elm$core$Task$andThen, function(_v1) {
                return A2($elm$core$Task$onError, $author$project$Session$onError(request), request);
            }, $elm$core$Process$sleep(ms));
        }
    });
    var $elm$http$Http$BadStatus_ = F2(function(a, b) {
        return {
            $: "BadStatus_",
            a: a,
            b: b
        };
    });
    var $elm$http$Http$BadUrl_ = function(a) {
        return {
            $: "BadUrl_",
            a: a
        };
    };
    var $elm$http$Http$GoodStatus_ = F2(function(a, b) {
        return {
            $: "GoodStatus_",
            a: a,
            b: b
        };
    });
    var $elm$http$Http$NetworkError_ = {
        $: "NetworkError_"
    };
    var $elm$http$Http$Receiving = function(a) {
        return {
            $: "Receiving",
            a: a
        };
    };
    var $elm$http$Http$Sending = function(a) {
        return {
            $: "Sending",
            a: a
        };
    };
    var $elm$http$Http$Timeout_ = {
        $: "Timeout_"
    };
    var $elm$core$Dict$RBEmpty_elm_builtin = {
        $: "RBEmpty_elm_builtin"
    };
    var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
    var $elm$core$Maybe$isJust = function(maybe) {
        if (maybe.$ === "Just") return true;
        else return false;
    };
    var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
    var $elm$core$Basics$compare = _Utils_compare;
    var $elm$core$Dict$get = F2(function(targetKey, dict) {
        get: while(true){
            if (dict.$ === "RBEmpty_elm_builtin") return $elm$core$Maybe$Nothing;
            else {
                var key = dict.b;
                var value = dict.c;
                var left = dict.d;
                var right = dict.e;
                var _v1 = A2($elm$core$Basics$compare, targetKey, key);
                switch(_v1.$){
                    case "LT":
                        var $temp$targetKey = targetKey, $temp$dict = left;
                        targetKey = $temp$targetKey;
                        dict = $temp$dict;
                        continue get;
                    case "EQ":
                        return $elm$core$Maybe$Just(value);
                    default:
                        var $temp$targetKey = targetKey, $temp$dict = right;
                        targetKey = $temp$targetKey;
                        dict = $temp$dict;
                        continue get;
                }
            }
        }
    });
    var $elm$core$Dict$Black = {
        $: "Black"
    };
    var $elm$core$Dict$RBNode_elm_builtin = F5(function(a, b, c, d, e) {
        return {
            $: "RBNode_elm_builtin",
            a: a,
            b: b,
            c: c,
            d: d,
            e: e
        };
    });
    var $elm$core$Dict$Red = {
        $: "Red"
    };
    var $elm$core$Dict$balance = F5(function(color, key, value, left, right) {
        if (right.$ === "RBNode_elm_builtin" && right.a.$ === "Red") {
            var _v1 = right.a;
            var rK = right.b;
            var rV = right.c;
            var rLeft = right.d;
            var rRight = right.e;
            if (left.$ === "RBNode_elm_builtin" && left.a.$ === "Red") {
                var _v3 = left.a;
                var lK = left.b;
                var lV = left.c;
                var lLeft = left.d;
                var lRight = left.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, rK, rV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft), rRight);
        } else {
            if (left.$ === "RBNode_elm_builtin" && left.a.$ === "Red" && left.d.$ === "RBNode_elm_builtin" && left.d.a.$ === "Red") {
                var _v5 = left.a;
                var lK = left.b;
                var lV = left.c;
                var _v6 = left.d;
                var _v7 = _v6.a;
                var llK = _v6.b;
                var llV = _v6.c;
                var llLeft = _v6.d;
                var llRight = _v6.e;
                var lRight = left.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
        }
    });
    var $elm$core$Dict$insertHelp = F3(function(key, value, dict) {
        if (dict.$ === "RBEmpty_elm_builtin") return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
        else {
            var nColor = dict.a;
            var nKey = dict.b;
            var nValue = dict.c;
            var nLeft = dict.d;
            var nRight = dict.e;
            var _v1 = A2($elm$core$Basics$compare, key, nKey);
            switch(_v1.$){
                case "LT":
                    return A5($elm$core$Dict$balance, nColor, nKey, nValue, A3($elm$core$Dict$insertHelp, key, value, nLeft), nRight);
                case "EQ":
                    return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
                default:
                    return A5($elm$core$Dict$balance, nColor, nKey, nValue, nLeft, A3($elm$core$Dict$insertHelp, key, value, nRight));
            }
        }
    });
    var $elm$core$Dict$insert = F3(function(key, value, dict) {
        var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
        if (_v0.$ === "RBNode_elm_builtin" && _v0.a.$ === "Red") {
            var _v1 = _v0.a;
            var k = _v0.b;
            var v = _v0.c;
            var l = _v0.d;
            var r = _v0.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
        } else {
            var x = _v0;
            return x;
        }
    });
    var $elm$core$Dict$getMin = function(dict) {
        getMin: while(true){
            if (dict.$ === "RBNode_elm_builtin" && dict.d.$ === "RBNode_elm_builtin") {
                var left = dict.d;
                var $temp$dict = left;
                dict = $temp$dict;
                continue getMin;
            } else return dict;
        }
    };
    var $elm$core$Dict$moveRedLeft = function(dict) {
        if (dict.$ === "RBNode_elm_builtin" && dict.d.$ === "RBNode_elm_builtin" && dict.e.$ === "RBNode_elm_builtin") {
            if (dict.e.d.$ === "RBNode_elm_builtin" && dict.e.d.a.$ === "Red") {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v1 = dict.d;
                var lClr = _v1.a;
                var lK = _v1.b;
                var lV = _v1.c;
                var lLeft = _v1.d;
                var lRight = _v1.e;
                var _v2 = dict.e;
                var rClr = _v2.a;
                var rK = _v2.b;
                var rV = _v2.c;
                var rLeft = _v2.d;
                var _v3 = rLeft.a;
                var rlK = rLeft.b;
                var rlV = rLeft.c;
                var rlL = rLeft.d;
                var rlR = rLeft.e;
                var rRight = _v2.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rlK, rlV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), rlL), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
            } else {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v4 = dict.d;
                var lClr = _v4.a;
                var lK = _v4.b;
                var lV = _v4.c;
                var lLeft = _v4.d;
                var lRight = _v4.e;
                var _v5 = dict.e;
                var rClr = _v5.a;
                var rK = _v5.b;
                var rV = _v5.c;
                var rLeft = _v5.d;
                var rRight = _v5.e;
                if (clr.$ === "Black") return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
                else return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
            }
        } else return dict;
    };
    var $elm$core$Dict$moveRedRight = function(dict) {
        if (dict.$ === "RBNode_elm_builtin" && dict.d.$ === "RBNode_elm_builtin" && dict.e.$ === "RBNode_elm_builtin") {
            if (dict.d.d.$ === "RBNode_elm_builtin" && dict.d.d.a.$ === "Red") {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v1 = dict.d;
                var lClr = _v1.a;
                var lK = _v1.b;
                var lV = _v1.c;
                var _v2 = _v1.d;
                var _v3 = _v2.a;
                var llK = _v2.b;
                var llV = _v2.c;
                var llLeft = _v2.d;
                var llRight = _v2.e;
                var lRight = _v1.e;
                var _v4 = dict.e;
                var rClr = _v4.a;
                var rK = _v4.b;
                var rV = _v4.c;
                var rLeft = _v4.d;
                var rRight = _v4.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, lRight, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
            } else {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v5 = dict.d;
                var lClr = _v5.a;
                var lK = _v5.b;
                var lV = _v5.c;
                var lLeft = _v5.d;
                var lRight = _v5.e;
                var _v6 = dict.e;
                var rClr = _v6.a;
                var rK = _v6.b;
                var rV = _v6.c;
                var rLeft = _v6.d;
                var rRight = _v6.e;
                if (clr.$ === "Black") return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
                else return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
            }
        } else return dict;
    };
    var $elm$core$Dict$removeHelpPrepEQGT = F7(function(targetKey, dict, color, key, value, left, right) {
        if (left.$ === "RBNode_elm_builtin" && left.a.$ === "Red") {
            var _v1 = left.a;
            var lK = left.b;
            var lV = left.c;
            var lLeft = left.d;
            var lRight = left.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, color, lK, lV, lLeft, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
        } else {
            _v2$2: while(true){
                if (right.$ === "RBNode_elm_builtin" && right.a.$ === "Black") {
                    if (right.d.$ === "RBNode_elm_builtin") {
                        if (right.d.a.$ === "Black") {
                            var _v3 = right.a;
                            var _v4 = right.d;
                            var _v5 = _v4.a;
                            return $elm$core$Dict$moveRedRight(dict);
                        } else break _v2$2;
                    } else {
                        var _v6 = right.a;
                        var _v7 = right.d;
                        return $elm$core$Dict$moveRedRight(dict);
                    }
                } else break _v2$2;
            }
            return dict;
        }
    });
    var $elm$core$Dict$removeMin = function(dict) {
        if (dict.$ === "RBNode_elm_builtin" && dict.d.$ === "RBNode_elm_builtin") {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var lColor = left.a;
            var lLeft = left.d;
            var right = dict.e;
            if (lColor.$ === "Black") {
                if (lLeft.$ === "RBNode_elm_builtin" && lLeft.a.$ === "Red") {
                    var _v3 = lLeft.a;
                    return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, $elm$core$Dict$removeMin(left), right);
                } else {
                    var _v4 = $elm$core$Dict$moveRedLeft(dict);
                    if (_v4.$ === "RBNode_elm_builtin") {
                        var nColor = _v4.a;
                        var nKey = _v4.b;
                        var nValue = _v4.c;
                        var nLeft = _v4.d;
                        var nRight = _v4.e;
                        return A5($elm$core$Dict$balance, nColor, nKey, nValue, $elm$core$Dict$removeMin(nLeft), nRight);
                    } else return $elm$core$Dict$RBEmpty_elm_builtin;
                }
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, $elm$core$Dict$removeMin(left), right);
        } else return $elm$core$Dict$RBEmpty_elm_builtin;
    };
    var $elm$core$Dict$removeHelp = F2(function(targetKey, dict) {
        if (dict.$ === "RBEmpty_elm_builtin") return $elm$core$Dict$RBEmpty_elm_builtin;
        else {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var right = dict.e;
            if (_Utils_cmp(targetKey, key) < 0) {
                if (left.$ === "RBNode_elm_builtin" && left.a.$ === "Black") {
                    var _v4 = left.a;
                    var lLeft = left.d;
                    if (lLeft.$ === "RBNode_elm_builtin" && lLeft.a.$ === "Red") {
                        var _v6 = lLeft.a;
                        return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, A2($elm$core$Dict$removeHelp, targetKey, left), right);
                    } else {
                        var _v7 = $elm$core$Dict$moveRedLeft(dict);
                        if (_v7.$ === "RBNode_elm_builtin") {
                            var nColor = _v7.a;
                            var nKey = _v7.b;
                            var nValue = _v7.c;
                            var nLeft = _v7.d;
                            var nRight = _v7.e;
                            return A5($elm$core$Dict$balance, nColor, nKey, nValue, A2($elm$core$Dict$removeHelp, targetKey, nLeft), nRight);
                        } else return $elm$core$Dict$RBEmpty_elm_builtin;
                    }
                } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, A2($elm$core$Dict$removeHelp, targetKey, left), right);
            } else return A2($elm$core$Dict$removeHelpEQGT, targetKey, A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
        }
    });
    var $elm$core$Dict$removeHelpEQGT = F2(function(targetKey, dict) {
        if (dict.$ === "RBNode_elm_builtin") {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var right = dict.e;
            if (_Utils_eq(targetKey, key)) {
                var _v1 = $elm$core$Dict$getMin(right);
                if (_v1.$ === "RBNode_elm_builtin") {
                    var minKey = _v1.b;
                    var minValue = _v1.c;
                    return A5($elm$core$Dict$balance, color, minKey, minValue, left, $elm$core$Dict$removeMin(right));
                } else return $elm$core$Dict$RBEmpty_elm_builtin;
            } else return A5($elm$core$Dict$balance, color, key, value, left, A2($elm$core$Dict$removeHelp, targetKey, right));
        } else return $elm$core$Dict$RBEmpty_elm_builtin;
    });
    var $elm$core$Dict$remove = F2(function(key, dict) {
        var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
        if (_v0.$ === "RBNode_elm_builtin" && _v0.a.$ === "Red") {
            var _v1 = _v0.a;
            var k = _v0.b;
            var v = _v0.c;
            var l = _v0.d;
            var r = _v0.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
        } else {
            var x = _v0;
            return x;
        }
    });
    var $elm$core$Dict$update = F3(function(targetKey, alter, dictionary) {
        var _v0 = alter(A2($elm$core$Dict$get, targetKey, dictionary));
        if (_v0.$ === "Just") {
            var value = _v0.a;
            return A3($elm$core$Dict$insert, targetKey, value, dictionary);
        } else return A2($elm$core$Dict$remove, targetKey, dictionary);
    });
    var $elm$http$Http$stringResolver = A2(_Http_expect, "", $elm$core$Basics$identity);
    var $elm$http$Http$resultToTask = function(result) {
        if (result.$ === "Ok") {
            var a = result.a;
            return $elm$core$Task$succeed(a);
        } else {
            var x = result.a;
            return $elm$core$Task$fail(x);
        }
    };
    var $elm$http$Http$task = function(r) {
        return A3(_Http_toTask, _Utils_Tuple0, $elm$http$Http$resultToTask, {
            allowCookiesFromOtherDomains: false,
            body: r.body,
            expect: r.resolver,
            headers: r.headers,
            method: r.method,
            timeout: r.timeout,
            tracker: $elm$core$Maybe$Nothing,
            url: r.url
        });
    };
    var $elm$core$Maybe$withDefault = F2(function(_default, maybe) {
        if (maybe.$ === "Just") {
            var value = maybe.a;
            return value;
        } else return _default;
    });
    var $author$project$Session$apiRequest = function(_v0) {
        var method = _v0.method;
        var url = _v0.url;
        var accessToken = _v0.accessToken;
        var responseDecoder = _v0.responseDecoder;
        var body = _v0.body;
        var request = $elm$http$Http$task({
            body: body,
            headers: A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, function(at) {
                return _List_fromArray([
                    A2($elm$http$Http$header, "Authorization", "Bearer " + at)
                ]);
            }, accessToken)),
            method: method,
            resolver: $elm$http$Http$stringResolver($author$project$Session$handleJsonResponse(responseDecoder)),
            timeout: $elm$core$Maybe$Nothing,
            url: url
        });
        return A2($elm$core$Task$onError, $author$project$Session$onError(request), request);
    };
    var $elm$url$Url$Builder$toQueryPair = function(_v0) {
        var key = _v0.a;
        var value = _v0.b;
        return key + ("=" + value);
    };
    var $elm$url$Url$Builder$toQuery = function(parameters) {
        if (!parameters.b) return "";
        else return "?" + A2($elm$core$String$join, "&", A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
    };
    var $elm$url$Url$Builder$crossOrigin = F3(function(prePath, pathSegments, parameters) {
        return prePath + ("/" + (A2($elm$core$String$join, "/", pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
    });
    var $elm$url$Url$percentEncode = _Url_percentEncode;
    var $author$project$ApiUtils$apiEndpoint = F4(function(pathPrefix, homeserverUrl, path, params) {
        return A3($elm$url$Url$Builder$crossOrigin, homeserverUrl, A2($elm$core$List$map, $elm$url$Url$percentEncode, _Utils_ap(pathPrefix, path)), params);
    });
    var $author$project$ApiUtils$clientEndpoint = $author$project$ApiUtils$apiEndpoint(_List_fromArray([
        "_matrix",
        "client",
        "r0"
    ]));
    var $author$project$Session$authenticatedRequest = F2(function(_v0, _v1) {
        var session = _v0.a;
        var method = _v1.method;
        var path = _v1.path;
        var params = _v1.params;
        var body = _v1.body;
        var responseDecoder = _v1.responseDecoder;
        return $author$project$Session$apiRequest({
            accessToken: $elm$core$Maybe$Just(session.accessToken),
            body: body,
            method: method,
            responseDecoder: responseDecoder,
            url: A3($author$project$ApiUtils$clientEndpoint, session.homeserverUrl, path, params)
        });
    });
    var $author$project$Event$MemberEvent = F2(function(a, b) {
        return {
            $: "MemberEvent",
            a: a,
            b: b
        };
    });
    var $author$project$Event$MessageEvent = function(a) {
        return {
            $: "MessageEvent",
            a: a
        };
    };
    var $author$project$Event$UnsupportedEvent = function(a) {
        return {
            $: "UnsupportedEvent",
            a: a
        };
    };
    var $elm$core$Basics$composeR = F3(function(f, g, x) {
        return g(f(x));
    });
    var $author$project$Member$Ban = {
        $: "Ban"
    };
    var $author$project$Member$Invite = {
        $: "Invite"
    };
    var $author$project$Member$Join = {
        $: "Join"
    };
    var $author$project$Member$Knock = {
        $: "Knock"
    };
    var $author$project$Member$Leave = {
        $: "Leave"
    };
    var $elm$json$Json$Decode$fail = _Json_fail;
    var $author$project$Member$decodeMembership = A2($elm$json$Json$Decode$andThen, function(m) {
        switch(m){
            case "invite":
                return $elm$json$Json$Decode$succeed($author$project$Member$Invite);
            case "join":
                return $elm$json$Json$Decode$succeed($author$project$Member$Join);
            case "leave":
                return $elm$json$Json$Decode$succeed($author$project$Member$Leave);
            case "ban":
                return $elm$json$Json$Decode$succeed($author$project$Member$Ban);
            case "knock":
                return $elm$json$Json$Decode$succeed($author$project$Member$Knock);
            default:
                return $elm$json$Json$Decode$fail("Invalid membership field: " + m);
        }
    }, $elm$json$Json$Decode$string);
    var $elm$json$Json$Decode$map3 = _Json_map3;
    var $elm$json$Json$Decode$maybe = function(decoder) {
        return $elm$json$Json$Decode$oneOf(_List_fromArray([
            A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
            $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
        ]));
    };
    var $author$project$Member$decodeMember = A4($elm$json$Json$Decode$map3, F3(function(ms, dn, au) {
        return {
            avatarUrl: au,
            displayname: dn,
            membership: ms
        };
    }), A2($elm$json$Json$Decode$field, "membership", $author$project$Member$decodeMembership), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "displayname", $elm$json$Json$Decode$string)), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "avatar_url", $elm$json$Json$Decode$string)));
    var $author$project$Message$Audio = function(a) {
        return {
            $: "Audio",
            a: a
        };
    };
    var $author$project$Message$Emote = function(a) {
        return {
            $: "Emote",
            a: a
        };
    };
    var $author$project$Message$File = function(a) {
        return {
            $: "File",
            a: a
        };
    };
    var $author$project$Message$Image = function(a) {
        return {
            $: "Image",
            a: a
        };
    };
    var $author$project$Message$Notice = function(a) {
        return {
            $: "Notice",
            a: a
        };
    };
    var $author$project$Message$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $author$project$Message$Video = function(a) {
        return {
            $: "Video",
            a: a
        };
    };
    var $author$project$Message$Audio$AudioData = F2(function(body, url) {
        return {
            body: body,
            url: url
        };
    });
    var $author$project$Message$Audio$decodeAudio = A3($elm$json$Json$Decode$map2, $author$project$Message$Audio$AudioData, A2($elm$json$Json$Decode$field, "body", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "url", $elm$json$Json$Decode$string));
    var $author$project$Message$File$FileData = F2(function(body, url) {
        return {
            body: body,
            url: url
        };
    });
    var $author$project$Message$File$decodeFile = A3($elm$json$Json$Decode$map2, $author$project$Message$File$FileData, A2($elm$json$Json$Decode$field, "body", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "url", $elm$json$Json$Decode$string));
    var $author$project$Message$FormattedText$Html = function(a) {
        return {
            $: "Html",
            a: a
        };
    };
    var $author$project$Message$FormattedText$Plain = function(a) {
        return {
            $: "Plain",
            a: a
        };
    };
    var $author$project$Message$FormattedText$decodeTextPlain = A2($elm$json$Json$Decode$map, $author$project$Message$FormattedText$Plain, A2($elm$json$Json$Decode$field, "body", $elm$json$Json$Decode$string));
    var $hecrj$html_parser$Html$Parser$Element = F3(function(a, b, c) {
        return {
            $: "Element",
            a: a,
            b: b,
            c: c
        };
    });
    var $elm$parser$Parser$Advanced$Bad = F2(function(a, b) {
        return {
            $: "Bad",
            a: a,
            b: b
        };
    });
    var $elm$parser$Parser$Advanced$Good = F3(function(a, b, c) {
        return {
            $: "Good",
            a: a,
            b: b,
            c: c
        };
    });
    var $elm$parser$Parser$Advanced$Parser = function(a) {
        return {
            $: "Parser",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$andThen = F2(function(callback, _v0) {
        var parseA = _v0.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v1 = parseA(s0);
            if (_v1.$ === "Bad") {
                var p = _v1.a;
                var x = _v1.b;
                return A2($elm$parser$Parser$Advanced$Bad, p, x);
            } else {
                var p1 = _v1.a;
                var a = _v1.b;
                var s1 = _v1.c;
                var _v2 = callback(a);
                var parseB = _v2.a;
                var _v3 = parseB(s1);
                if (_v3.$ === "Bad") {
                    var p2 = _v3.a;
                    var x = _v3.b;
                    return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
                } else {
                    var p2 = _v3.a;
                    var b = _v3.b;
                    var s2 = _v3.c;
                    return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
                }
            }
        });
    });
    var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
    var $elm$parser$Parser$Advanced$backtrackable = function(_v0) {
        var parse = _v0.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v1 = parse(s0);
            if (_v1.$ === "Bad") {
                var x = _v1.b;
                return A2($elm$parser$Parser$Advanced$Bad, false, x);
            } else {
                var a = _v1.b;
                var s1 = _v1.c;
                return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
            }
        });
    };
    var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
    var $elm$parser$Parser$UnexpectedChar = {
        $: "UnexpectedChar"
    };
    var $elm$parser$Parser$Advanced$AddRight = F2(function(a, b) {
        return {
            $: "AddRight",
            a: a,
            b: b
        };
    });
    var $elm$parser$Parser$Advanced$DeadEnd = F4(function(row, col, problem, contextStack) {
        return {
            col: col,
            contextStack: contextStack,
            problem: problem,
            row: row
        };
    });
    var $elm$parser$Parser$Advanced$Empty = {
        $: "Empty"
    };
    var $elm$parser$Parser$Advanced$fromState = F2(function(s, x) {
        return A2($elm$parser$Parser$Advanced$AddRight, $elm$parser$Parser$Advanced$Empty, A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
    });
    var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
    var $elm$core$Basics$negate = function(n) {
        return -n;
    };
    var $elm$parser$Parser$Advanced$chompIf = F2(function(isGood, expecting) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
            return _Utils_eq(newOffset, -1) ? A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : _Utils_eq(newOffset, -2) ? A3($elm$parser$Parser$Advanced$Good, true, _Utils_Tuple0, {
                col: 1,
                context: s.context,
                indent: s.indent,
                offset: s.offset + 1,
                row: s.row + 1,
                src: s.src
            }) : A3($elm$parser$Parser$Advanced$Good, true, _Utils_Tuple0, {
                col: s.col + 1,
                context: s.context,
                indent: s.indent,
                offset: newOffset,
                row: s.row,
                src: s.src
            });
        });
    });
    var $elm$parser$Parser$chompIf = function(isGood) {
        return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
    };
    var $elm$parser$Parser$Advanced$chompWhileHelp = F5(function(isGood, offset, row, col, s0) {
        chompWhileHelp: while(true){
            var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
            if (_Utils_eq(newOffset, -1)) return A3($elm$parser$Parser$Advanced$Good, _Utils_cmp(s0.offset, offset) < 0, _Utils_Tuple0, {
                col: col,
                context: s0.context,
                indent: s0.indent,
                offset: offset,
                row: row,
                src: s0.src
            });
            else if (_Utils_eq(newOffset, -2)) {
                var $temp$isGood = isGood, $temp$offset = offset + 1, $temp$row = row + 1, $temp$col = 1, $temp$s0 = s0;
                isGood = $temp$isGood;
                offset = $temp$offset;
                row = $temp$row;
                col = $temp$col;
                s0 = $temp$s0;
                continue chompWhileHelp;
            } else {
                var $temp$isGood = isGood, $temp$offset = newOffset, $temp$row = row, $temp$col = col + 1, $temp$s0 = s0;
                isGood = $temp$isGood;
                offset = $temp$offset;
                row = $temp$row;
                col = $temp$col;
                s0 = $temp$s0;
                continue chompWhileHelp;
            }
        }
    });
    var $elm$parser$Parser$Advanced$chompWhile = function(isGood) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
        });
    };
    var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
    var $elm$core$Basics$always = F2(function(a, _v0) {
        return a;
    });
    var $elm$parser$Parser$Advanced$map2 = F3(function(func, _v0, _v1) {
        var parseA = _v0.a;
        var parseB = _v1.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v2 = parseA(s0);
            if (_v2.$ === "Bad") {
                var p = _v2.a;
                var x = _v2.b;
                return A2($elm$parser$Parser$Advanced$Bad, p, x);
            } else {
                var p1 = _v2.a;
                var a = _v2.b;
                var s1 = _v2.c;
                var _v3 = parseB(s1);
                if (_v3.$ === "Bad") {
                    var p2 = _v3.a;
                    var x = _v3.b;
                    return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
                } else {
                    var p2 = _v3.a;
                    var b = _v3.b;
                    var s2 = _v3.c;
                    return A3($elm$parser$Parser$Advanced$Good, p1 || p2, A2(func, a, b), s2);
                }
            }
        });
    });
    var $elm$parser$Parser$Advanced$ignorer = F2(function(keepParser, ignoreParser) {
        return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
    });
    var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
    var $hecrj$html_parser$Html$Parser$chompOneOrMore = function(fn) {
        return A2($elm$parser$Parser$ignorer, $elm$parser$Parser$chompIf(fn), $elm$parser$Parser$chompWhile(fn));
    };
    var $elm$parser$Parser$Advanced$mapChompedString = F2(function(func, _v0) {
        var parse = _v0.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v1 = parse(s0);
            if (_v1.$ === "Bad") {
                var p = _v1.a;
                var x = _v1.b;
                return A2($elm$parser$Parser$Advanced$Bad, p, x);
            } else {
                var p = _v1.a;
                var a = _v1.b;
                var s1 = _v1.c;
                return A3($elm$parser$Parser$Advanced$Good, p, A2(func, A3($elm$core$String$slice, s0.offset, s1.offset, s0.src), a), s1);
            }
        });
    });
    var $elm$parser$Parser$Advanced$getChompedString = function(parser) {
        return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
    };
    var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
    var $hecrj$html_parser$Html$Parser$isSpaceCharacter = function(c) {
        return _Utils_eq(c, _Utils_chr(" ")) || _Utils_eq(c, _Utils_chr("	")) || _Utils_eq(c, _Utils_chr("\n")) || _Utils_eq(c, _Utils_chr("\r")) || _Utils_eq(c, _Utils_chr("\f")) || _Utils_eq(c, _Utils_chr("\xa0"));
    };
    var $elm$core$Basics$neq = _Utils_notEqual;
    var $elm$core$Basics$not = _Basics_not;
    var $elm$parser$Parser$Problem = function(a) {
        return {
            $: "Problem",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$problem = function(x) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, x));
        });
    };
    var $elm$parser$Parser$problem = function(msg) {
        return $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem(msg));
    };
    var $elm$parser$Parser$Advanced$succeed = function(a) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return A3($elm$parser$Parser$Advanced$Good, false, a, s);
        });
    };
    var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
    var $elm$core$String$toLower = _String_toLower;
    var $hecrj$html_parser$Html$Parser$closingTag = function(name) {
        var chompName = A2($elm$parser$Parser$andThen, function(closingName) {
            return _Utils_eq($elm$core$String$toLower(closingName), name) ? $elm$parser$Parser$succeed(_Utils_Tuple0) : $elm$parser$Parser$problem("closing tag does not match opening tag: " + name);
        }, $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore(function(c) {
            return !$hecrj$html_parser$Html$Parser$isSpaceCharacter(c) && !_Utils_eq(c, _Utils_chr(">"));
        })));
        return A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("<"))), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("/")))), chompName), $elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr(">"))));
    };
    var $hecrj$html_parser$Html$Parser$Comment = function(a) {
        return {
            $: "Comment",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
    var $elm$parser$Parser$Advanced$fromInfo = F4(function(row, col, x, context) {
        return A2($elm$parser$Parser$Advanced$AddRight, $elm$parser$Parser$Advanced$Empty, A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
    });
    var $elm$parser$Parser$Advanced$chompUntil = function(_v0) {
        var str = _v0.a;
        var expecting = _v0.b;
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
            var newOffset = _v1.a;
            var newRow = _v1.b;
            var newCol = _v1.c;
            return _Utils_eq(newOffset, -1) ? A2($elm$parser$Parser$Advanced$Bad, false, A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.context)) : A3($elm$parser$Parser$Advanced$Good, _Utils_cmp(s.offset, newOffset) < 0, _Utils_Tuple0, {
                col: newCol,
                context: s.context,
                indent: s.indent,
                offset: newOffset,
                row: newRow,
                src: s.src
            });
        });
    };
    var $elm$parser$Parser$Expecting = function(a) {
        return {
            $: "Expecting",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$Token = F2(function(a, b) {
        return {
            $: "Token",
            a: a,
            b: b
        };
    });
    var $elm$parser$Parser$toToken = function(str) {
        return A2($elm$parser$Parser$Advanced$Token, str, $elm$parser$Parser$Expecting(str));
    };
    var $elm$parser$Parser$chompUntil = function(str) {
        return $elm$parser$Parser$Advanced$chompUntil($elm$parser$Parser$toToken(str));
    };
    var $elm$parser$Parser$Advanced$keeper = F2(function(parseFunc, parseArg) {
        return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
    });
    var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
    var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
    var $elm$parser$Parser$Advanced$token = function(_v0) {
        var str = _v0.a;
        var expecting = _v0.b;
        var progress = !$elm$core$String$isEmpty(str);
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
            var newOffset = _v1.a;
            var newRow = _v1.b;
            var newCol = _v1.c;
            return _Utils_eq(newOffset, -1) ? A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3($elm$parser$Parser$Advanced$Good, progress, _Utils_Tuple0, {
                col: newCol,
                context: s.context,
                indent: s.indent,
                offset: newOffset,
                row: newRow,
                src: s.src
            });
        });
    };
    var $elm$parser$Parser$token = function(str) {
        return $elm$parser$Parser$Advanced$token($elm$parser$Parser$toToken(str));
    };
    var $hecrj$html_parser$Html$Parser$commentString = A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$token("<!")), $elm$parser$Parser$token("--")), A2($elm$parser$Parser$ignorer, $elm$parser$Parser$getChompedString($elm$parser$Parser$chompUntil("-->")), $elm$parser$Parser$token("-->")));
    var $elm$parser$Parser$Advanced$map = F2(function(func, _v0) {
        var parse = _v0.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v1 = parse(s0);
            if (_v1.$ === "Good") {
                var p = _v1.a;
                var a = _v1.b;
                var s1 = _v1.c;
                return A3($elm$parser$Parser$Advanced$Good, p, func(a), s1);
            } else {
                var p = _v1.a;
                var x = _v1.b;
                return A2($elm$parser$Parser$Advanced$Bad, p, x);
            }
        });
    });
    var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
    var $hecrj$html_parser$Html$Parser$comment = A2($elm$parser$Parser$map, $hecrj$html_parser$Html$Parser$Comment, $hecrj$html_parser$Html$Parser$commentString);
    var $elm$core$List$any = F2(function(isOkay, list) {
        any: while(true){
            if (!list.b) return false;
            else {
                var x = list.a;
                var xs = list.b;
                if (isOkay(x)) return true;
                else {
                    var $temp$isOkay = isOkay, $temp$list = xs;
                    isOkay = $temp$isOkay;
                    list = $temp$list;
                    continue any;
                }
            }
        }
    });
    var $elm$core$List$member = F2(function(x, xs) {
        return A2($elm$core$List$any, function(a) {
            return _Utils_eq(a, x);
        }, xs);
    });
    var $hecrj$html_parser$Html$Parser$voidElements = _List_fromArray([
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
    ]);
    var $hecrj$html_parser$Html$Parser$isVoidElement = function(name) {
        return A2($elm$core$List$member, name, $hecrj$html_parser$Html$Parser$voidElements);
    };
    var $elm$parser$Parser$Done = function(a) {
        return {
            $: "Done",
            a: a
        };
    };
    var $elm$parser$Parser$Loop = function(a) {
        return {
            $: "Loop",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$loopHelp = F4(function(p, state, callback, s0) {
        loopHelp: while(true){
            var _v0 = callback(state);
            var parse = _v0.a;
            var _v1 = parse(s0);
            if (_v1.$ === "Good") {
                var p1 = _v1.a;
                var step = _v1.b;
                var s1 = _v1.c;
                if (step.$ === "Loop") {
                    var newState = step.a;
                    var $temp$p = p || p1, $temp$state = newState, $temp$callback = callback, $temp$s0 = s1;
                    p = $temp$p;
                    state = $temp$state;
                    callback = $temp$callback;
                    s0 = $temp$s0;
                    continue loopHelp;
                } else {
                    var result = step.a;
                    return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
                }
            } else {
                var p1 = _v1.a;
                var x = _v1.b;
                return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
            }
        }
    });
    var $elm$parser$Parser$Advanced$loop = F2(function(state, callback) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
        });
    });
    var $elm$parser$Parser$Advanced$Done = function(a) {
        return {
            $: "Done",
            a: a
        };
    };
    var $elm$parser$Parser$Advanced$Loop = function(a) {
        return {
            $: "Loop",
            a: a
        };
    };
    var $elm$parser$Parser$toAdvancedStep = function(step) {
        if (step.$ === "Loop") {
            var s = step.a;
            return $elm$parser$Parser$Advanced$Loop(s);
        } else {
            var a = step.a;
            return $elm$parser$Parser$Advanced$Done(a);
        }
    };
    var $elm$parser$Parser$loop = F2(function(state, callback) {
        return A2($elm$parser$Parser$Advanced$loop, state, function(s) {
            return A2($elm$parser$Parser$map, $elm$parser$Parser$toAdvancedStep, callback(s));
        });
    });
    var $elm$parser$Parser$Advanced$Append = F2(function(a, b) {
        return {
            $: "Append",
            a: a,
            b: b
        };
    });
    var $elm$parser$Parser$Advanced$oneOfHelp = F3(function(s0, bag, parsers) {
        oneOfHelp: while(true){
            if (!parsers.b) return A2($elm$parser$Parser$Advanced$Bad, false, bag);
            else {
                var parse = parsers.a.a;
                var remainingParsers = parsers.b;
                var _v1 = parse(s0);
                if (_v1.$ === "Good") {
                    var step = _v1;
                    return step;
                } else {
                    var step = _v1;
                    var p = step.a;
                    var x = step.b;
                    if (p) return step;
                    else {
                        var $temp$s0 = s0, $temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x), $temp$parsers = remainingParsers;
                        s0 = $temp$s0;
                        bag = $temp$bag;
                        parsers = $temp$parsers;
                        continue oneOfHelp;
                    }
                }
            }
        }
    });
    var $elm$parser$Parser$Advanced$oneOf = function(parsers) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
        });
    };
    var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
    var $hecrj$html_parser$Html$Parser$many = function(parser_) {
        return A2($elm$parser$Parser$loop, _List_Nil, function(list) {
            return $elm$parser$Parser$oneOf(_List_fromArray([
                A2($elm$parser$Parser$map, function(_new) {
                    return $elm$parser$Parser$Loop(A2($elm$core$List$cons, _new, list));
                }, parser_),
                $elm$parser$Parser$succeed($elm$parser$Parser$Done($elm$core$List$reverse(list)))
            ]));
        });
    };
    var $hecrj$html_parser$Html$Parser$isTagAttributeCharacter = function(c) {
        return !$hecrj$html_parser$Html$Parser$isSpaceCharacter(c) && !_Utils_eq(c, _Utils_chr('"')) && !_Utils_eq(c, _Utils_chr("'")) && !_Utils_eq(c, _Utils_chr(">")) && !_Utils_eq(c, _Utils_chr("/")) && !_Utils_eq(c, _Utils_chr("="));
    };
    var $hecrj$html_parser$Html$Parser$tagAttributeName = A2($elm$parser$Parser$map, $elm$core$String$toLower, $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore($hecrj$html_parser$Html$Parser$isTagAttributeCharacter)));
    var $hecrj$html_parser$Html$Parser$chompSemicolon = $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr(";")));
    var $elm$core$Dict$fromList = function(assocs) {
        return A3($elm$core$List$foldl, F2(function(_v0, dict) {
            var key = _v0.a;
            var value = _v0.b;
            return A3($elm$core$Dict$insert, key, value, dict);
        }), $elm$core$Dict$empty, assocs);
    };
    var $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict = $elm$core$Dict$fromList(_List_fromArray([
        _Utils_Tuple2("Aacute", "\xc1"),
        _Utils_Tuple2("aacute", "\xe1"),
        _Utils_Tuple2("Abreve", "\u0102"),
        _Utils_Tuple2("abreve", "\u0103"),
        _Utils_Tuple2("ac", "\u223E"),
        _Utils_Tuple2("acd", "\u223F"),
        _Utils_Tuple2("acE", "\u223E\u0333"),
        _Utils_Tuple2("Acirc", "\xc2"),
        _Utils_Tuple2("acirc", "\xe2"),
        _Utils_Tuple2("acute", "\xb4"),
        _Utils_Tuple2("Acy", "\u0410"),
        _Utils_Tuple2("acy", "\u0430"),
        _Utils_Tuple2("AElig", "\xc6"),
        _Utils_Tuple2("aelig", "\xe6"),
        _Utils_Tuple2("af", "\u2061"),
        _Utils_Tuple2("Afr", "\uD835\uDD04"),
        _Utils_Tuple2("afr", "\uD835\uDD1E"),
        _Utils_Tuple2("Agrave", "\xc0"),
        _Utils_Tuple2("agrave", "\xe0"),
        _Utils_Tuple2("alefsym", "\u2135"),
        _Utils_Tuple2("aleph", "\u2135"),
        _Utils_Tuple2("Alpha", "\u0391"),
        _Utils_Tuple2("alpha", "\u03B1"),
        _Utils_Tuple2("Amacr", "\u0100"),
        _Utils_Tuple2("amacr", "\u0101"),
        _Utils_Tuple2("amalg", "\u2A3F"),
        _Utils_Tuple2("amp", "&"),
        _Utils_Tuple2("AMP", "&"),
        _Utils_Tuple2("andand", "\u2A55"),
        _Utils_Tuple2("And", "\u2A53"),
        _Utils_Tuple2("and", "\u2227"),
        _Utils_Tuple2("andd", "\u2A5C"),
        _Utils_Tuple2("andslope", "\u2A58"),
        _Utils_Tuple2("andv", "\u2A5A"),
        _Utils_Tuple2("ang", "\u2220"),
        _Utils_Tuple2("ange", "\u29A4"),
        _Utils_Tuple2("angle", "\u2220"),
        _Utils_Tuple2("angmsdaa", "\u29A8"),
        _Utils_Tuple2("angmsdab", "\u29A9"),
        _Utils_Tuple2("angmsdac", "\u29AA"),
        _Utils_Tuple2("angmsdad", "\u29AB"),
        _Utils_Tuple2("angmsdae", "\u29AC"),
        _Utils_Tuple2("angmsdaf", "\u29AD"),
        _Utils_Tuple2("angmsdag", "\u29AE"),
        _Utils_Tuple2("angmsdah", "\u29AF"),
        _Utils_Tuple2("angmsd", "\u2221"),
        _Utils_Tuple2("angrt", "\u221F"),
        _Utils_Tuple2("angrtvb", "\u22BE"),
        _Utils_Tuple2("angrtvbd", "\u299D"),
        _Utils_Tuple2("angsph", "\u2222"),
        _Utils_Tuple2("angst", "\xc5"),
        _Utils_Tuple2("angzarr", "\u237C"),
        _Utils_Tuple2("Aogon", "\u0104"),
        _Utils_Tuple2("aogon", "\u0105"),
        _Utils_Tuple2("Aopf", "\uD835\uDD38"),
        _Utils_Tuple2("aopf", "\uD835\uDD52"),
        _Utils_Tuple2("apacir", "\u2A6F"),
        _Utils_Tuple2("ap", "\u2248"),
        _Utils_Tuple2("apE", "\u2A70"),
        _Utils_Tuple2("ape", "\u224A"),
        _Utils_Tuple2("apid", "\u224B"),
        _Utils_Tuple2("apos", "'"),
        _Utils_Tuple2("ApplyFunction", "\u2061"),
        _Utils_Tuple2("approx", "\u2248"),
        _Utils_Tuple2("approxeq", "\u224A"),
        _Utils_Tuple2("Aring", "\xc5"),
        _Utils_Tuple2("aring", "\xe5"),
        _Utils_Tuple2("Ascr", "\uD835\uDC9C"),
        _Utils_Tuple2("ascr", "\uD835\uDCB6"),
        _Utils_Tuple2("Assign", "\u2254"),
        _Utils_Tuple2("ast", "*"),
        _Utils_Tuple2("asymp", "\u2248"),
        _Utils_Tuple2("asympeq", "\u224D"),
        _Utils_Tuple2("Atilde", "\xc3"),
        _Utils_Tuple2("atilde", "\xe3"),
        _Utils_Tuple2("Auml", "\xc4"),
        _Utils_Tuple2("auml", "\xe4"),
        _Utils_Tuple2("awconint", "\u2233"),
        _Utils_Tuple2("awint", "\u2A11"),
        _Utils_Tuple2("backcong", "\u224C"),
        _Utils_Tuple2("backepsilon", "\u03F6"),
        _Utils_Tuple2("backprime", "\u2035"),
        _Utils_Tuple2("backsim", "\u223D"),
        _Utils_Tuple2("backsimeq", "\u22CD"),
        _Utils_Tuple2("Backslash", "\u2216"),
        _Utils_Tuple2("Barv", "\u2AE7"),
        _Utils_Tuple2("barvee", "\u22BD"),
        _Utils_Tuple2("barwed", "\u2305"),
        _Utils_Tuple2("Barwed", "\u2306"),
        _Utils_Tuple2("barwedge", "\u2305"),
        _Utils_Tuple2("bbrk", "\u23B5"),
        _Utils_Tuple2("bbrktbrk", "\u23B6"),
        _Utils_Tuple2("bcong", "\u224C"),
        _Utils_Tuple2("Bcy", "\u0411"),
        _Utils_Tuple2("bcy", "\u0431"),
        _Utils_Tuple2("bdquo", "\u201E"),
        _Utils_Tuple2("becaus", "\u2235"),
        _Utils_Tuple2("because", "\u2235"),
        _Utils_Tuple2("Because", "\u2235"),
        _Utils_Tuple2("bemptyv", "\u29B0"),
        _Utils_Tuple2("bepsi", "\u03F6"),
        _Utils_Tuple2("bernou", "\u212C"),
        _Utils_Tuple2("Bernoullis", "\u212C"),
        _Utils_Tuple2("Beta", "\u0392"),
        _Utils_Tuple2("beta", "\u03B2"),
        _Utils_Tuple2("beth", "\u2136"),
        _Utils_Tuple2("between", "\u226C"),
        _Utils_Tuple2("Bfr", "\uD835\uDD05"),
        _Utils_Tuple2("bfr", "\uD835\uDD1F"),
        _Utils_Tuple2("bigcap", "\u22C2"),
        _Utils_Tuple2("bigcirc", "\u25EF"),
        _Utils_Tuple2("bigcup", "\u22C3"),
        _Utils_Tuple2("bigodot", "\u2A00"),
        _Utils_Tuple2("bigoplus", "\u2A01"),
        _Utils_Tuple2("bigotimes", "\u2A02"),
        _Utils_Tuple2("bigsqcup", "\u2A06"),
        _Utils_Tuple2("bigstar", "\u2605"),
        _Utils_Tuple2("bigtriangledown", "\u25BD"),
        _Utils_Tuple2("bigtriangleup", "\u25B3"),
        _Utils_Tuple2("biguplus", "\u2A04"),
        _Utils_Tuple2("bigvee", "\u22C1"),
        _Utils_Tuple2("bigwedge", "\u22C0"),
        _Utils_Tuple2("bkarow", "\u290D"),
        _Utils_Tuple2("blacklozenge", "\u29EB"),
        _Utils_Tuple2("blacksquare", "\u25AA"),
        _Utils_Tuple2("blacktriangle", "\u25B4"),
        _Utils_Tuple2("blacktriangledown", "\u25BE"),
        _Utils_Tuple2("blacktriangleleft", "\u25C2"),
        _Utils_Tuple2("blacktriangleright", "\u25B8"),
        _Utils_Tuple2("blank", "\u2423"),
        _Utils_Tuple2("blk12", "\u2592"),
        _Utils_Tuple2("blk14", "\u2591"),
        _Utils_Tuple2("blk34", "\u2593"),
        _Utils_Tuple2("block", "\u2588"),
        _Utils_Tuple2("bne", "=\u20E5"),
        _Utils_Tuple2("bnequiv", "\u2261\u20E5"),
        _Utils_Tuple2("bNot", "\u2AED"),
        _Utils_Tuple2("bnot", "\u2310"),
        _Utils_Tuple2("Bopf", "\uD835\uDD39"),
        _Utils_Tuple2("bopf", "\uD835\uDD53"),
        _Utils_Tuple2("bot", "\u22A5"),
        _Utils_Tuple2("bottom", "\u22A5"),
        _Utils_Tuple2("bowtie", "\u22C8"),
        _Utils_Tuple2("boxbox", "\u29C9"),
        _Utils_Tuple2("boxdl", "\u2510"),
        _Utils_Tuple2("boxdL", "\u2555"),
        _Utils_Tuple2("boxDl", "\u2556"),
        _Utils_Tuple2("boxDL", "\u2557"),
        _Utils_Tuple2("boxdr", "\u250C"),
        _Utils_Tuple2("boxdR", "\u2552"),
        _Utils_Tuple2("boxDr", "\u2553"),
        _Utils_Tuple2("boxDR", "\u2554"),
        _Utils_Tuple2("boxh", "\u2500"),
        _Utils_Tuple2("boxH", "\u2550"),
        _Utils_Tuple2("boxhd", "\u252C"),
        _Utils_Tuple2("boxHd", "\u2564"),
        _Utils_Tuple2("boxhD", "\u2565"),
        _Utils_Tuple2("boxHD", "\u2566"),
        _Utils_Tuple2("boxhu", "\u2534"),
        _Utils_Tuple2("boxHu", "\u2567"),
        _Utils_Tuple2("boxhU", "\u2568"),
        _Utils_Tuple2("boxHU", "\u2569"),
        _Utils_Tuple2("boxminus", "\u229F"),
        _Utils_Tuple2("boxplus", "\u229E"),
        _Utils_Tuple2("boxtimes", "\u22A0"),
        _Utils_Tuple2("boxul", "\u2518"),
        _Utils_Tuple2("boxuL", "\u255B"),
        _Utils_Tuple2("boxUl", "\u255C"),
        _Utils_Tuple2("boxUL", "\u255D"),
        _Utils_Tuple2("boxur", "\u2514"),
        _Utils_Tuple2("boxuR", "\u2558"),
        _Utils_Tuple2("boxUr", "\u2559"),
        _Utils_Tuple2("boxUR", "\u255A"),
        _Utils_Tuple2("boxv", "\u2502"),
        _Utils_Tuple2("boxV", "\u2551"),
        _Utils_Tuple2("boxvh", "\u253C"),
        _Utils_Tuple2("boxvH", "\u256A"),
        _Utils_Tuple2("boxVh", "\u256B"),
        _Utils_Tuple2("boxVH", "\u256C"),
        _Utils_Tuple2("boxvl", "\u2524"),
        _Utils_Tuple2("boxvL", "\u2561"),
        _Utils_Tuple2("boxVl", "\u2562"),
        _Utils_Tuple2("boxVL", "\u2563"),
        _Utils_Tuple2("boxvr", "\u251C"),
        _Utils_Tuple2("boxvR", "\u255E"),
        _Utils_Tuple2("boxVr", "\u255F"),
        _Utils_Tuple2("boxVR", "\u2560"),
        _Utils_Tuple2("bprime", "\u2035"),
        _Utils_Tuple2("breve", "\u02D8"),
        _Utils_Tuple2("Breve", "\u02D8"),
        _Utils_Tuple2("brvbar", "\xa6"),
        _Utils_Tuple2("bscr", "\uD835\uDCB7"),
        _Utils_Tuple2("Bscr", "\u212C"),
        _Utils_Tuple2("bsemi", "\u204F"),
        _Utils_Tuple2("bsim", "\u223D"),
        _Utils_Tuple2("bsime", "\u22CD"),
        _Utils_Tuple2("bsolb", "\u29C5"),
        _Utils_Tuple2("bsol", "\\"),
        _Utils_Tuple2("bsolhsub", "\u27C8"),
        _Utils_Tuple2("bull", "\u2022"),
        _Utils_Tuple2("bullet", "\u2022"),
        _Utils_Tuple2("bump", "\u224E"),
        _Utils_Tuple2("bumpE", "\u2AAE"),
        _Utils_Tuple2("bumpe", "\u224F"),
        _Utils_Tuple2("Bumpeq", "\u224E"),
        _Utils_Tuple2("bumpeq", "\u224F"),
        _Utils_Tuple2("Cacute", "\u0106"),
        _Utils_Tuple2("cacute", "\u0107"),
        _Utils_Tuple2("capand", "\u2A44"),
        _Utils_Tuple2("capbrcup", "\u2A49"),
        _Utils_Tuple2("capcap", "\u2A4B"),
        _Utils_Tuple2("cap", "\u2229"),
        _Utils_Tuple2("Cap", "\u22D2"),
        _Utils_Tuple2("capcup", "\u2A47"),
        _Utils_Tuple2("capdot", "\u2A40"),
        _Utils_Tuple2("CapitalDifferentialD", "\u2145"),
        _Utils_Tuple2("caps", "\u2229\uFE00"),
        _Utils_Tuple2("caret", "\u2041"),
        _Utils_Tuple2("caron", "\u02C7"),
        _Utils_Tuple2("Cayleys", "\u212D"),
        _Utils_Tuple2("ccaps", "\u2A4D"),
        _Utils_Tuple2("Ccaron", "\u010C"),
        _Utils_Tuple2("ccaron", "\u010D"),
        _Utils_Tuple2("Ccedil", "\xc7"),
        _Utils_Tuple2("ccedil", "\xe7"),
        _Utils_Tuple2("Ccirc", "\u0108"),
        _Utils_Tuple2("ccirc", "\u0109"),
        _Utils_Tuple2("Cconint", "\u2230"),
        _Utils_Tuple2("ccups", "\u2A4C"),
        _Utils_Tuple2("ccupssm", "\u2A50"),
        _Utils_Tuple2("Cdot", "\u010A"),
        _Utils_Tuple2("cdot", "\u010B"),
        _Utils_Tuple2("cedil", "\xb8"),
        _Utils_Tuple2("Cedilla", "\xb8"),
        _Utils_Tuple2("cemptyv", "\u29B2"),
        _Utils_Tuple2("cent", "\xa2"),
        _Utils_Tuple2("centerdot", "\xb7"),
        _Utils_Tuple2("CenterDot", "\xb7"),
        _Utils_Tuple2("cfr", "\uD835\uDD20"),
        _Utils_Tuple2("Cfr", "\u212D"),
        _Utils_Tuple2("CHcy", "\u0427"),
        _Utils_Tuple2("chcy", "\u0447"),
        _Utils_Tuple2("check", "\u2713"),
        _Utils_Tuple2("checkmark", "\u2713"),
        _Utils_Tuple2("Chi", "\u03A7"),
        _Utils_Tuple2("chi", "\u03C7"),
        _Utils_Tuple2("circ", "\u02C6"),
        _Utils_Tuple2("circeq", "\u2257"),
        _Utils_Tuple2("circlearrowleft", "\u21BA"),
        _Utils_Tuple2("circlearrowright", "\u21BB"),
        _Utils_Tuple2("circledast", "\u229B"),
        _Utils_Tuple2("circledcirc", "\u229A"),
        _Utils_Tuple2("circleddash", "\u229D"),
        _Utils_Tuple2("CircleDot", "\u2299"),
        _Utils_Tuple2("circledR", "\xae"),
        _Utils_Tuple2("circledS", "\u24C8"),
        _Utils_Tuple2("CircleMinus", "\u2296"),
        _Utils_Tuple2("CirclePlus", "\u2295"),
        _Utils_Tuple2("CircleTimes", "\u2297"),
        _Utils_Tuple2("cir", "\u25CB"),
        _Utils_Tuple2("cirE", "\u29C3"),
        _Utils_Tuple2("cire", "\u2257"),
        _Utils_Tuple2("cirfnint", "\u2A10"),
        _Utils_Tuple2("cirmid", "\u2AEF"),
        _Utils_Tuple2("cirscir", "\u29C2"),
        _Utils_Tuple2("ClockwiseContourIntegral", "\u2232"),
        _Utils_Tuple2("CloseCurlyDoubleQuote", "\u201D"),
        _Utils_Tuple2("CloseCurlyQuote", "\u2019"),
        _Utils_Tuple2("clubs", "\u2663"),
        _Utils_Tuple2("clubsuit", "\u2663"),
        _Utils_Tuple2("colon", ":"),
        _Utils_Tuple2("Colon", "\u2237"),
        _Utils_Tuple2("Colone", "\u2A74"),
        _Utils_Tuple2("colone", "\u2254"),
        _Utils_Tuple2("coloneq", "\u2254"),
        _Utils_Tuple2("comma", ","),
        _Utils_Tuple2("commat", "@"),
        _Utils_Tuple2("comp", "\u2201"),
        _Utils_Tuple2("compfn", "\u2218"),
        _Utils_Tuple2("complement", "\u2201"),
        _Utils_Tuple2("complexes", "\u2102"),
        _Utils_Tuple2("cong", "\u2245"),
        _Utils_Tuple2("congdot", "\u2A6D"),
        _Utils_Tuple2("Congruent", "\u2261"),
        _Utils_Tuple2("conint", "\u222E"),
        _Utils_Tuple2("Conint", "\u222F"),
        _Utils_Tuple2("ContourIntegral", "\u222E"),
        _Utils_Tuple2("copf", "\uD835\uDD54"),
        _Utils_Tuple2("Copf", "\u2102"),
        _Utils_Tuple2("coprod", "\u2210"),
        _Utils_Tuple2("Coproduct", "\u2210"),
        _Utils_Tuple2("copy", "\xa9"),
        _Utils_Tuple2("COPY", "\xa9"),
        _Utils_Tuple2("copysr", "\u2117"),
        _Utils_Tuple2("CounterClockwiseContourIntegral", "\u2233"),
        _Utils_Tuple2("crarr", "\u21B5"),
        _Utils_Tuple2("cross", "\u2717"),
        _Utils_Tuple2("Cross", "\u2A2F"),
        _Utils_Tuple2("Cscr", "\uD835\uDC9E"),
        _Utils_Tuple2("cscr", "\uD835\uDCB8"),
        _Utils_Tuple2("csub", "\u2ACF"),
        _Utils_Tuple2("csube", "\u2AD1"),
        _Utils_Tuple2("csup", "\u2AD0"),
        _Utils_Tuple2("csupe", "\u2AD2"),
        _Utils_Tuple2("ctdot", "\u22EF"),
        _Utils_Tuple2("cudarrl", "\u2938"),
        _Utils_Tuple2("cudarrr", "\u2935"),
        _Utils_Tuple2("cuepr", "\u22DE"),
        _Utils_Tuple2("cuesc", "\u22DF"),
        _Utils_Tuple2("cularr", "\u21B6"),
        _Utils_Tuple2("cularrp", "\u293D"),
        _Utils_Tuple2("cupbrcap", "\u2A48"),
        _Utils_Tuple2("cupcap", "\u2A46"),
        _Utils_Tuple2("CupCap", "\u224D"),
        _Utils_Tuple2("cup", "\u222A"),
        _Utils_Tuple2("Cup", "\u22D3"),
        _Utils_Tuple2("cupcup", "\u2A4A"),
        _Utils_Tuple2("cupdot", "\u228D"),
        _Utils_Tuple2("cupor", "\u2A45"),
        _Utils_Tuple2("cups", "\u222A\uFE00"),
        _Utils_Tuple2("curarr", "\u21B7"),
        _Utils_Tuple2("curarrm", "\u293C"),
        _Utils_Tuple2("curlyeqprec", "\u22DE"),
        _Utils_Tuple2("curlyeqsucc", "\u22DF"),
        _Utils_Tuple2("curlyvee", "\u22CE"),
        _Utils_Tuple2("curlywedge", "\u22CF"),
        _Utils_Tuple2("curren", "\xa4"),
        _Utils_Tuple2("curvearrowleft", "\u21B6"),
        _Utils_Tuple2("curvearrowright", "\u21B7"),
        _Utils_Tuple2("cuvee", "\u22CE"),
        _Utils_Tuple2("cuwed", "\u22CF"),
        _Utils_Tuple2("cwconint", "\u2232"),
        _Utils_Tuple2("cwint", "\u2231"),
        _Utils_Tuple2("cylcty", "\u232D"),
        _Utils_Tuple2("dagger", "\u2020"),
        _Utils_Tuple2("Dagger", "\u2021"),
        _Utils_Tuple2("daleth", "\u2138"),
        _Utils_Tuple2("darr", "\u2193"),
        _Utils_Tuple2("Darr", "\u21A1"),
        _Utils_Tuple2("dArr", "\u21D3"),
        _Utils_Tuple2("dash", "\u2010"),
        _Utils_Tuple2("Dashv", "\u2AE4"),
        _Utils_Tuple2("dashv", "\u22A3"),
        _Utils_Tuple2("dbkarow", "\u290F"),
        _Utils_Tuple2("dblac", "\u02DD"),
        _Utils_Tuple2("Dcaron", "\u010E"),
        _Utils_Tuple2("dcaron", "\u010F"),
        _Utils_Tuple2("Dcy", "\u0414"),
        _Utils_Tuple2("dcy", "\u0434"),
        _Utils_Tuple2("ddagger", "\u2021"),
        _Utils_Tuple2("ddarr", "\u21CA"),
        _Utils_Tuple2("DD", "\u2145"),
        _Utils_Tuple2("dd", "\u2146"),
        _Utils_Tuple2("DDotrahd", "\u2911"),
        _Utils_Tuple2("ddotseq", "\u2A77"),
        _Utils_Tuple2("deg", "\xb0"),
        _Utils_Tuple2("Del", "\u2207"),
        _Utils_Tuple2("Delta", "\u0394"),
        _Utils_Tuple2("delta", "\u03B4"),
        _Utils_Tuple2("demptyv", "\u29B1"),
        _Utils_Tuple2("dfisht", "\u297F"),
        _Utils_Tuple2("Dfr", "\uD835\uDD07"),
        _Utils_Tuple2("dfr", "\uD835\uDD21"),
        _Utils_Tuple2("dHar", "\u2965"),
        _Utils_Tuple2("dharl", "\u21C3"),
        _Utils_Tuple2("dharr", "\u21C2"),
        _Utils_Tuple2("DiacriticalAcute", "\xb4"),
        _Utils_Tuple2("DiacriticalDot", "\u02D9"),
        _Utils_Tuple2("DiacriticalDoubleAcute", "\u02DD"),
        _Utils_Tuple2("DiacriticalGrave", "`"),
        _Utils_Tuple2("DiacriticalTilde", "\u02DC"),
        _Utils_Tuple2("diam", "\u22C4"),
        _Utils_Tuple2("diamond", "\u22C4"),
        _Utils_Tuple2("Diamond", "\u22C4"),
        _Utils_Tuple2("diamondsuit", "\u2666"),
        _Utils_Tuple2("diams", "\u2666"),
        _Utils_Tuple2("die", "\xa8"),
        _Utils_Tuple2("DifferentialD", "\u2146"),
        _Utils_Tuple2("digamma", "\u03DD"),
        _Utils_Tuple2("disin", "\u22F2"),
        _Utils_Tuple2("div", "\xf7"),
        _Utils_Tuple2("divide", "\xf7"),
        _Utils_Tuple2("divideontimes", "\u22C7"),
        _Utils_Tuple2("divonx", "\u22C7"),
        _Utils_Tuple2("DJcy", "\u0402"),
        _Utils_Tuple2("djcy", "\u0452"),
        _Utils_Tuple2("dlcorn", "\u231E"),
        _Utils_Tuple2("dlcrop", "\u230D"),
        _Utils_Tuple2("dollar", "$"),
        _Utils_Tuple2("Dopf", "\uD835\uDD3B"),
        _Utils_Tuple2("dopf", "\uD835\uDD55"),
        _Utils_Tuple2("Dot", "\xa8"),
        _Utils_Tuple2("dot", "\u02D9"),
        _Utils_Tuple2("DotDot", "\u20DC"),
        _Utils_Tuple2("doteq", "\u2250"),
        _Utils_Tuple2("doteqdot", "\u2251"),
        _Utils_Tuple2("DotEqual", "\u2250"),
        _Utils_Tuple2("dotminus", "\u2238"),
        _Utils_Tuple2("dotplus", "\u2214"),
        _Utils_Tuple2("dotsquare", "\u22A1"),
        _Utils_Tuple2("doublebarwedge", "\u2306"),
        _Utils_Tuple2("DoubleContourIntegral", "\u222F"),
        _Utils_Tuple2("DoubleDot", "\xa8"),
        _Utils_Tuple2("DoubleDownArrow", "\u21D3"),
        _Utils_Tuple2("DoubleLeftArrow", "\u21D0"),
        _Utils_Tuple2("DoubleLeftRightArrow", "\u21D4"),
        _Utils_Tuple2("DoubleLeftTee", "\u2AE4"),
        _Utils_Tuple2("DoubleLongLeftArrow", "\u27F8"),
        _Utils_Tuple2("DoubleLongLeftRightArrow", "\u27FA"),
        _Utils_Tuple2("DoubleLongRightArrow", "\u27F9"),
        _Utils_Tuple2("DoubleRightArrow", "\u21D2"),
        _Utils_Tuple2("DoubleRightTee", "\u22A8"),
        _Utils_Tuple2("DoubleUpArrow", "\u21D1"),
        _Utils_Tuple2("DoubleUpDownArrow", "\u21D5"),
        _Utils_Tuple2("DoubleVerticalBar", "\u2225"),
        _Utils_Tuple2("DownArrowBar", "\u2913"),
        _Utils_Tuple2("downarrow", "\u2193"),
        _Utils_Tuple2("DownArrow", "\u2193"),
        _Utils_Tuple2("Downarrow", "\u21D3"),
        _Utils_Tuple2("DownArrowUpArrow", "\u21F5"),
        _Utils_Tuple2("DownBreve", "\u0311"),
        _Utils_Tuple2("downdownarrows", "\u21CA"),
        _Utils_Tuple2("downharpoonleft", "\u21C3"),
        _Utils_Tuple2("downharpoonright", "\u21C2"),
        _Utils_Tuple2("DownLeftRightVector", "\u2950"),
        _Utils_Tuple2("DownLeftTeeVector", "\u295E"),
        _Utils_Tuple2("DownLeftVectorBar", "\u2956"),
        _Utils_Tuple2("DownLeftVector", "\u21BD"),
        _Utils_Tuple2("DownRightTeeVector", "\u295F"),
        _Utils_Tuple2("DownRightVectorBar", "\u2957"),
        _Utils_Tuple2("DownRightVector", "\u21C1"),
        _Utils_Tuple2("DownTeeArrow", "\u21A7"),
        _Utils_Tuple2("DownTee", "\u22A4"),
        _Utils_Tuple2("drbkarow", "\u2910"),
        _Utils_Tuple2("drcorn", "\u231F"),
        _Utils_Tuple2("drcrop", "\u230C"),
        _Utils_Tuple2("Dscr", "\uD835\uDC9F"),
        _Utils_Tuple2("dscr", "\uD835\uDCB9"),
        _Utils_Tuple2("DScy", "\u0405"),
        _Utils_Tuple2("dscy", "\u0455"),
        _Utils_Tuple2("dsol", "\u29F6"),
        _Utils_Tuple2("Dstrok", "\u0110"),
        _Utils_Tuple2("dstrok", "\u0111"),
        _Utils_Tuple2("dtdot", "\u22F1"),
        _Utils_Tuple2("dtri", "\u25BF"),
        _Utils_Tuple2("dtrif", "\u25BE"),
        _Utils_Tuple2("duarr", "\u21F5"),
        _Utils_Tuple2("duhar", "\u296F"),
        _Utils_Tuple2("dwangle", "\u29A6"),
        _Utils_Tuple2("DZcy", "\u040F"),
        _Utils_Tuple2("dzcy", "\u045F"),
        _Utils_Tuple2("dzigrarr", "\u27FF"),
        _Utils_Tuple2("Eacute", "\xc9"),
        _Utils_Tuple2("eacute", "\xe9"),
        _Utils_Tuple2("easter", "\u2A6E"),
        _Utils_Tuple2("Ecaron", "\u011A"),
        _Utils_Tuple2("ecaron", "\u011B"),
        _Utils_Tuple2("Ecirc", "\xca"),
        _Utils_Tuple2("ecirc", "\xea"),
        _Utils_Tuple2("ecir", "\u2256"),
        _Utils_Tuple2("ecolon", "\u2255"),
        _Utils_Tuple2("Ecy", "\u042D"),
        _Utils_Tuple2("ecy", "\u044D"),
        _Utils_Tuple2("eDDot", "\u2A77"),
        _Utils_Tuple2("Edot", "\u0116"),
        _Utils_Tuple2("edot", "\u0117"),
        _Utils_Tuple2("eDot", "\u2251"),
        _Utils_Tuple2("ee", "\u2147"),
        _Utils_Tuple2("efDot", "\u2252"),
        _Utils_Tuple2("Efr", "\uD835\uDD08"),
        _Utils_Tuple2("efr", "\uD835\uDD22"),
        _Utils_Tuple2("eg", "\u2A9A"),
        _Utils_Tuple2("Egrave", "\xc8"),
        _Utils_Tuple2("egrave", "\xe8"),
        _Utils_Tuple2("egs", "\u2A96"),
        _Utils_Tuple2("egsdot", "\u2A98"),
        _Utils_Tuple2("el", "\u2A99"),
        _Utils_Tuple2("Element", "\u2208"),
        _Utils_Tuple2("elinters", "\u23E7"),
        _Utils_Tuple2("ell", "\u2113"),
        _Utils_Tuple2("els", "\u2A95"),
        _Utils_Tuple2("elsdot", "\u2A97"),
        _Utils_Tuple2("Emacr", "\u0112"),
        _Utils_Tuple2("emacr", "\u0113"),
        _Utils_Tuple2("empty", "\u2205"),
        _Utils_Tuple2("emptyset", "\u2205"),
        _Utils_Tuple2("EmptySmallSquare", "\u25FB"),
        _Utils_Tuple2("emptyv", "\u2205"),
        _Utils_Tuple2("EmptyVerySmallSquare", "\u25AB"),
        _Utils_Tuple2("emsp13", "\u2004"),
        _Utils_Tuple2("emsp14", "\u2005"),
        _Utils_Tuple2("emsp", "\u2003"),
        _Utils_Tuple2("ENG", "\u014A"),
        _Utils_Tuple2("eng", "\u014B"),
        _Utils_Tuple2("ensp", "\u2002"),
        _Utils_Tuple2("Eogon", "\u0118"),
        _Utils_Tuple2("eogon", "\u0119"),
        _Utils_Tuple2("Eopf", "\uD835\uDD3C"),
        _Utils_Tuple2("eopf", "\uD835\uDD56"),
        _Utils_Tuple2("epar", "\u22D5"),
        _Utils_Tuple2("eparsl", "\u29E3"),
        _Utils_Tuple2("eplus", "\u2A71"),
        _Utils_Tuple2("epsi", "\u03B5"),
        _Utils_Tuple2("Epsilon", "\u0395"),
        _Utils_Tuple2("epsilon", "\u03B5"),
        _Utils_Tuple2("epsiv", "\u03F5"),
        _Utils_Tuple2("eqcirc", "\u2256"),
        _Utils_Tuple2("eqcolon", "\u2255"),
        _Utils_Tuple2("eqsim", "\u2242"),
        _Utils_Tuple2("eqslantgtr", "\u2A96"),
        _Utils_Tuple2("eqslantless", "\u2A95"),
        _Utils_Tuple2("Equal", "\u2A75"),
        _Utils_Tuple2("equals", "="),
        _Utils_Tuple2("EqualTilde", "\u2242"),
        _Utils_Tuple2("equest", "\u225F"),
        _Utils_Tuple2("Equilibrium", "\u21CC"),
        _Utils_Tuple2("equiv", "\u2261"),
        _Utils_Tuple2("equivDD", "\u2A78"),
        _Utils_Tuple2("eqvparsl", "\u29E5"),
        _Utils_Tuple2("erarr", "\u2971"),
        _Utils_Tuple2("erDot", "\u2253"),
        _Utils_Tuple2("escr", "\u212F"),
        _Utils_Tuple2("Escr", "\u2130"),
        _Utils_Tuple2("esdot", "\u2250"),
        _Utils_Tuple2("Esim", "\u2A73"),
        _Utils_Tuple2("esim", "\u2242"),
        _Utils_Tuple2("Eta", "\u0397"),
        _Utils_Tuple2("eta", "\u03B7"),
        _Utils_Tuple2("ETH", "\xd0"),
        _Utils_Tuple2("eth", "\xf0"),
        _Utils_Tuple2("Euml", "\xcb"),
        _Utils_Tuple2("euml", "\xeb"),
        _Utils_Tuple2("euro", "\u20AC"),
        _Utils_Tuple2("excl", "!"),
        _Utils_Tuple2("exist", "\u2203"),
        _Utils_Tuple2("Exists", "\u2203"),
        _Utils_Tuple2("expectation", "\u2130"),
        _Utils_Tuple2("exponentiale", "\u2147"),
        _Utils_Tuple2("ExponentialE", "\u2147"),
        _Utils_Tuple2("fallingdotseq", "\u2252"),
        _Utils_Tuple2("Fcy", "\u0424"),
        _Utils_Tuple2("fcy", "\u0444"),
        _Utils_Tuple2("female", "\u2640"),
        _Utils_Tuple2("ffilig", "\uFB03"),
        _Utils_Tuple2("fflig", "\uFB00"),
        _Utils_Tuple2("ffllig", "\uFB04"),
        _Utils_Tuple2("Ffr", "\uD835\uDD09"),
        _Utils_Tuple2("ffr", "\uD835\uDD23"),
        _Utils_Tuple2("filig", "\uFB01"),
        _Utils_Tuple2("FilledSmallSquare", "\u25FC"),
        _Utils_Tuple2("FilledVerySmallSquare", "\u25AA"),
        _Utils_Tuple2("fjlig", "fj"),
        _Utils_Tuple2("flat", "\u266D"),
        _Utils_Tuple2("fllig", "\uFB02"),
        _Utils_Tuple2("fltns", "\u25B1"),
        _Utils_Tuple2("fnof", "\u0192"),
        _Utils_Tuple2("Fopf", "\uD835\uDD3D"),
        _Utils_Tuple2("fopf", "\uD835\uDD57"),
        _Utils_Tuple2("forall", "\u2200"),
        _Utils_Tuple2("ForAll", "\u2200"),
        _Utils_Tuple2("fork", "\u22D4"),
        _Utils_Tuple2("forkv", "\u2AD9"),
        _Utils_Tuple2("Fouriertrf", "\u2131"),
        _Utils_Tuple2("fpartint", "\u2A0D"),
        _Utils_Tuple2("frac12", "\xbd"),
        _Utils_Tuple2("frac13", "\u2153"),
        _Utils_Tuple2("frac14", "\xbc"),
        _Utils_Tuple2("frac15", "\u2155"),
        _Utils_Tuple2("frac16", "\u2159"),
        _Utils_Tuple2("frac18", "\u215B"),
        _Utils_Tuple2("frac23", "\u2154"),
        _Utils_Tuple2("frac25", "\u2156"),
        _Utils_Tuple2("frac34", "\xbe"),
        _Utils_Tuple2("frac35", "\u2157"),
        _Utils_Tuple2("frac38", "\u215C"),
        _Utils_Tuple2("frac45", "\u2158"),
        _Utils_Tuple2("frac56", "\u215A"),
        _Utils_Tuple2("frac58", "\u215D"),
        _Utils_Tuple2("frac78", "\u215E"),
        _Utils_Tuple2("frasl", "\u2044"),
        _Utils_Tuple2("frown", "\u2322"),
        _Utils_Tuple2("fscr", "\uD835\uDCBB"),
        _Utils_Tuple2("Fscr", "\u2131"),
        _Utils_Tuple2("gacute", "\u01F5"),
        _Utils_Tuple2("Gamma", "\u0393"),
        _Utils_Tuple2("gamma", "\u03B3"),
        _Utils_Tuple2("Gammad", "\u03DC"),
        _Utils_Tuple2("gammad", "\u03DD"),
        _Utils_Tuple2("gap", "\u2A86"),
        _Utils_Tuple2("Gbreve", "\u011E"),
        _Utils_Tuple2("gbreve", "\u011F"),
        _Utils_Tuple2("Gcedil", "\u0122"),
        _Utils_Tuple2("Gcirc", "\u011C"),
        _Utils_Tuple2("gcirc", "\u011D"),
        _Utils_Tuple2("Gcy", "\u0413"),
        _Utils_Tuple2("gcy", "\u0433"),
        _Utils_Tuple2("Gdot", "\u0120"),
        _Utils_Tuple2("gdot", "\u0121"),
        _Utils_Tuple2("ge", "\u2265"),
        _Utils_Tuple2("gE", "\u2267"),
        _Utils_Tuple2("gEl", "\u2A8C"),
        _Utils_Tuple2("gel", "\u22DB"),
        _Utils_Tuple2("geq", "\u2265"),
        _Utils_Tuple2("geqq", "\u2267"),
        _Utils_Tuple2("geqslant", "\u2A7E"),
        _Utils_Tuple2("gescc", "\u2AA9"),
        _Utils_Tuple2("ges", "\u2A7E"),
        _Utils_Tuple2("gesdot", "\u2A80"),
        _Utils_Tuple2("gesdoto", "\u2A82"),
        _Utils_Tuple2("gesdotol", "\u2A84"),
        _Utils_Tuple2("gesl", "\u22DB\uFE00"),
        _Utils_Tuple2("gesles", "\u2A94"),
        _Utils_Tuple2("Gfr", "\uD835\uDD0A"),
        _Utils_Tuple2("gfr", "\uD835\uDD24"),
        _Utils_Tuple2("gg", "\u226B"),
        _Utils_Tuple2("Gg", "\u22D9"),
        _Utils_Tuple2("ggg", "\u22D9"),
        _Utils_Tuple2("gimel", "\u2137"),
        _Utils_Tuple2("GJcy", "\u0403"),
        _Utils_Tuple2("gjcy", "\u0453"),
        _Utils_Tuple2("gla", "\u2AA5"),
        _Utils_Tuple2("gl", "\u2277"),
        _Utils_Tuple2("glE", "\u2A92"),
        _Utils_Tuple2("glj", "\u2AA4"),
        _Utils_Tuple2("gnap", "\u2A8A"),
        _Utils_Tuple2("gnapprox", "\u2A8A"),
        _Utils_Tuple2("gne", "\u2A88"),
        _Utils_Tuple2("gnE", "\u2269"),
        _Utils_Tuple2("gneq", "\u2A88"),
        _Utils_Tuple2("gneqq", "\u2269"),
        _Utils_Tuple2("gnsim", "\u22E7"),
        _Utils_Tuple2("Gopf", "\uD835\uDD3E"),
        _Utils_Tuple2("gopf", "\uD835\uDD58"),
        _Utils_Tuple2("grave", "`"),
        _Utils_Tuple2("GreaterEqual", "\u2265"),
        _Utils_Tuple2("GreaterEqualLess", "\u22DB"),
        _Utils_Tuple2("GreaterFullEqual", "\u2267"),
        _Utils_Tuple2("GreaterGreater", "\u2AA2"),
        _Utils_Tuple2("GreaterLess", "\u2277"),
        _Utils_Tuple2("GreaterSlantEqual", "\u2A7E"),
        _Utils_Tuple2("GreaterTilde", "\u2273"),
        _Utils_Tuple2("Gscr", "\uD835\uDCA2"),
        _Utils_Tuple2("gscr", "\u210A"),
        _Utils_Tuple2("gsim", "\u2273"),
        _Utils_Tuple2("gsime", "\u2A8E"),
        _Utils_Tuple2("gsiml", "\u2A90"),
        _Utils_Tuple2("gtcc", "\u2AA7"),
        _Utils_Tuple2("gtcir", "\u2A7A"),
        _Utils_Tuple2("gt", ">"),
        _Utils_Tuple2("GT", ">"),
        _Utils_Tuple2("Gt", "\u226B"),
        _Utils_Tuple2("gtdot", "\u22D7"),
        _Utils_Tuple2("gtlPar", "\u2995"),
        _Utils_Tuple2("gtquest", "\u2A7C"),
        _Utils_Tuple2("gtrapprox", "\u2A86"),
        _Utils_Tuple2("gtrarr", "\u2978"),
        _Utils_Tuple2("gtrdot", "\u22D7"),
        _Utils_Tuple2("gtreqless", "\u22DB"),
        _Utils_Tuple2("gtreqqless", "\u2A8C"),
        _Utils_Tuple2("gtrless", "\u2277"),
        _Utils_Tuple2("gtrsim", "\u2273"),
        _Utils_Tuple2("gvertneqq", "\u2269\uFE00"),
        _Utils_Tuple2("gvnE", "\u2269\uFE00"),
        _Utils_Tuple2("Hacek", "\u02C7"),
        _Utils_Tuple2("hairsp", "\u200A"),
        _Utils_Tuple2("half", "\xbd"),
        _Utils_Tuple2("hamilt", "\u210B"),
        _Utils_Tuple2("HARDcy", "\u042A"),
        _Utils_Tuple2("hardcy", "\u044A"),
        _Utils_Tuple2("harrcir", "\u2948"),
        _Utils_Tuple2("harr", "\u2194"),
        _Utils_Tuple2("hArr", "\u21D4"),
        _Utils_Tuple2("harrw", "\u21AD"),
        _Utils_Tuple2("Hat", "^"),
        _Utils_Tuple2("hbar", "\u210F"),
        _Utils_Tuple2("Hcirc", "\u0124"),
        _Utils_Tuple2("hcirc", "\u0125"),
        _Utils_Tuple2("hearts", "\u2665"),
        _Utils_Tuple2("heartsuit", "\u2665"),
        _Utils_Tuple2("hellip", "\u2026"),
        _Utils_Tuple2("hercon", "\u22B9"),
        _Utils_Tuple2("hfr", "\uD835\uDD25"),
        _Utils_Tuple2("Hfr", "\u210C"),
        _Utils_Tuple2("HilbertSpace", "\u210B"),
        _Utils_Tuple2("hksearow", "\u2925"),
        _Utils_Tuple2("hkswarow", "\u2926"),
        _Utils_Tuple2("hoarr", "\u21FF"),
        _Utils_Tuple2("homtht", "\u223B"),
        _Utils_Tuple2("hookleftarrow", "\u21A9"),
        _Utils_Tuple2("hookrightarrow", "\u21AA"),
        _Utils_Tuple2("hopf", "\uD835\uDD59"),
        _Utils_Tuple2("Hopf", "\u210D"),
        _Utils_Tuple2("horbar", "\u2015"),
        _Utils_Tuple2("HorizontalLine", "\u2500"),
        _Utils_Tuple2("hscr", "\uD835\uDCBD"),
        _Utils_Tuple2("Hscr", "\u210B"),
        _Utils_Tuple2("hslash", "\u210F"),
        _Utils_Tuple2("Hstrok", "\u0126"),
        _Utils_Tuple2("hstrok", "\u0127"),
        _Utils_Tuple2("HumpDownHump", "\u224E"),
        _Utils_Tuple2("HumpEqual", "\u224F"),
        _Utils_Tuple2("hybull", "\u2043"),
        _Utils_Tuple2("hyphen", "\u2010"),
        _Utils_Tuple2("Iacute", "\xcd"),
        _Utils_Tuple2("iacute", "\xed"),
        _Utils_Tuple2("ic", "\u2063"),
        _Utils_Tuple2("Icirc", "\xce"),
        _Utils_Tuple2("icirc", "\xee"),
        _Utils_Tuple2("Icy", "\u0418"),
        _Utils_Tuple2("icy", "\u0438"),
        _Utils_Tuple2("Idot", "\u0130"),
        _Utils_Tuple2("IEcy", "\u0415"),
        _Utils_Tuple2("iecy", "\u0435"),
        _Utils_Tuple2("iexcl", "\xa1"),
        _Utils_Tuple2("iff", "\u21D4"),
        _Utils_Tuple2("ifr", "\uD835\uDD26"),
        _Utils_Tuple2("Ifr", "\u2111"),
        _Utils_Tuple2("Igrave", "\xcc"),
        _Utils_Tuple2("igrave", "\xec"),
        _Utils_Tuple2("ii", "\u2148"),
        _Utils_Tuple2("iiiint", "\u2A0C"),
        _Utils_Tuple2("iiint", "\u222D"),
        _Utils_Tuple2("iinfin", "\u29DC"),
        _Utils_Tuple2("iiota", "\u2129"),
        _Utils_Tuple2("IJlig", "\u0132"),
        _Utils_Tuple2("ijlig", "\u0133"),
        _Utils_Tuple2("Imacr", "\u012A"),
        _Utils_Tuple2("imacr", "\u012B"),
        _Utils_Tuple2("image", "\u2111"),
        _Utils_Tuple2("ImaginaryI", "\u2148"),
        _Utils_Tuple2("imagline", "\u2110"),
        _Utils_Tuple2("imagpart", "\u2111"),
        _Utils_Tuple2("imath", "\u0131"),
        _Utils_Tuple2("Im", "\u2111"),
        _Utils_Tuple2("imof", "\u22B7"),
        _Utils_Tuple2("imped", "\u01B5"),
        _Utils_Tuple2("Implies", "\u21D2"),
        _Utils_Tuple2("incare", "\u2105"),
        _Utils_Tuple2("in", "\u2208"),
        _Utils_Tuple2("infin", "\u221E"),
        _Utils_Tuple2("infintie", "\u29DD"),
        _Utils_Tuple2("inodot", "\u0131"),
        _Utils_Tuple2("intcal", "\u22BA"),
        _Utils_Tuple2("int", "\u222B"),
        _Utils_Tuple2("Int", "\u222C"),
        _Utils_Tuple2("integers", "\u2124"),
        _Utils_Tuple2("Integral", "\u222B"),
        _Utils_Tuple2("intercal", "\u22BA"),
        _Utils_Tuple2("Intersection", "\u22C2"),
        _Utils_Tuple2("intlarhk", "\u2A17"),
        _Utils_Tuple2("intprod", "\u2A3C"),
        _Utils_Tuple2("InvisibleComma", "\u2063"),
        _Utils_Tuple2("InvisibleTimes", "\u2062"),
        _Utils_Tuple2("IOcy", "\u0401"),
        _Utils_Tuple2("iocy", "\u0451"),
        _Utils_Tuple2("Iogon", "\u012E"),
        _Utils_Tuple2("iogon", "\u012F"),
        _Utils_Tuple2("Iopf", "\uD835\uDD40"),
        _Utils_Tuple2("iopf", "\uD835\uDD5A"),
        _Utils_Tuple2("Iota", "\u0399"),
        _Utils_Tuple2("iota", "\u03B9"),
        _Utils_Tuple2("iprod", "\u2A3C"),
        _Utils_Tuple2("iquest", "\xbf"),
        _Utils_Tuple2("iscr", "\uD835\uDCBE"),
        _Utils_Tuple2("Iscr", "\u2110"),
        _Utils_Tuple2("isin", "\u2208"),
        _Utils_Tuple2("isindot", "\u22F5"),
        _Utils_Tuple2("isinE", "\u22F9"),
        _Utils_Tuple2("isins", "\u22F4"),
        _Utils_Tuple2("isinsv", "\u22F3"),
        _Utils_Tuple2("isinv", "\u2208"),
        _Utils_Tuple2("it", "\u2062"),
        _Utils_Tuple2("Itilde", "\u0128"),
        _Utils_Tuple2("itilde", "\u0129"),
        _Utils_Tuple2("Iukcy", "\u0406"),
        _Utils_Tuple2("iukcy", "\u0456"),
        _Utils_Tuple2("Iuml", "\xcf"),
        _Utils_Tuple2("iuml", "\xef"),
        _Utils_Tuple2("Jcirc", "\u0134"),
        _Utils_Tuple2("jcirc", "\u0135"),
        _Utils_Tuple2("Jcy", "\u0419"),
        _Utils_Tuple2("jcy", "\u0439"),
        _Utils_Tuple2("Jfr", "\uD835\uDD0D"),
        _Utils_Tuple2("jfr", "\uD835\uDD27"),
        _Utils_Tuple2("jmath", "\u0237"),
        _Utils_Tuple2("Jopf", "\uD835\uDD41"),
        _Utils_Tuple2("jopf", "\uD835\uDD5B"),
        _Utils_Tuple2("Jscr", "\uD835\uDCA5"),
        _Utils_Tuple2("jscr", "\uD835\uDCBF"),
        _Utils_Tuple2("Jsercy", "\u0408"),
        _Utils_Tuple2("jsercy", "\u0458"),
        _Utils_Tuple2("Jukcy", "\u0404"),
        _Utils_Tuple2("jukcy", "\u0454"),
        _Utils_Tuple2("Kappa", "\u039A"),
        _Utils_Tuple2("kappa", "\u03BA"),
        _Utils_Tuple2("kappav", "\u03F0"),
        _Utils_Tuple2("Kcedil", "\u0136"),
        _Utils_Tuple2("kcedil", "\u0137"),
        _Utils_Tuple2("Kcy", "\u041A"),
        _Utils_Tuple2("kcy", "\u043A"),
        _Utils_Tuple2("Kfr", "\uD835\uDD0E"),
        _Utils_Tuple2("kfr", "\uD835\uDD28"),
        _Utils_Tuple2("kgreen", "\u0138"),
        _Utils_Tuple2("KHcy", "\u0425"),
        _Utils_Tuple2("khcy", "\u0445"),
        _Utils_Tuple2("KJcy", "\u040C"),
        _Utils_Tuple2("kjcy", "\u045C"),
        _Utils_Tuple2("Kopf", "\uD835\uDD42"),
        _Utils_Tuple2("kopf", "\uD835\uDD5C"),
        _Utils_Tuple2("Kscr", "\uD835\uDCA6"),
        _Utils_Tuple2("kscr", "\uD835\uDCC0"),
        _Utils_Tuple2("lAarr", "\u21DA"),
        _Utils_Tuple2("Lacute", "\u0139"),
        _Utils_Tuple2("lacute", "\u013A"),
        _Utils_Tuple2("laemptyv", "\u29B4"),
        _Utils_Tuple2("lagran", "\u2112"),
        _Utils_Tuple2("Lambda", "\u039B"),
        _Utils_Tuple2("lambda", "\u03BB"),
        _Utils_Tuple2("lang", "\u27E8"),
        _Utils_Tuple2("Lang", "\u27EA"),
        _Utils_Tuple2("langd", "\u2991"),
        _Utils_Tuple2("langle", "\u27E8"),
        _Utils_Tuple2("lap", "\u2A85"),
        _Utils_Tuple2("Laplacetrf", "\u2112"),
        _Utils_Tuple2("laquo", "\xab"),
        _Utils_Tuple2("larrb", "\u21E4"),
        _Utils_Tuple2("larrbfs", "\u291F"),
        _Utils_Tuple2("larr", "\u2190"),
        _Utils_Tuple2("Larr", "\u219E"),
        _Utils_Tuple2("lArr", "\u21D0"),
        _Utils_Tuple2("larrfs", "\u291D"),
        _Utils_Tuple2("larrhk", "\u21A9"),
        _Utils_Tuple2("larrlp", "\u21AB"),
        _Utils_Tuple2("larrpl", "\u2939"),
        _Utils_Tuple2("larrsim", "\u2973"),
        _Utils_Tuple2("larrtl", "\u21A2"),
        _Utils_Tuple2("latail", "\u2919"),
        _Utils_Tuple2("lAtail", "\u291B"),
        _Utils_Tuple2("lat", "\u2AAB"),
        _Utils_Tuple2("late", "\u2AAD"),
        _Utils_Tuple2("lates", "\u2AAD\uFE00"),
        _Utils_Tuple2("lbarr", "\u290C"),
        _Utils_Tuple2("lBarr", "\u290E"),
        _Utils_Tuple2("lbbrk", "\u2772"),
        _Utils_Tuple2("lbrace", "{"),
        _Utils_Tuple2("lbrack", "["),
        _Utils_Tuple2("lbrke", "\u298B"),
        _Utils_Tuple2("lbrksld", "\u298F"),
        _Utils_Tuple2("lbrkslu", "\u298D"),
        _Utils_Tuple2("Lcaron", "\u013D"),
        _Utils_Tuple2("lcaron", "\u013E"),
        _Utils_Tuple2("Lcedil", "\u013B"),
        _Utils_Tuple2("lcedil", "\u013C"),
        _Utils_Tuple2("lceil", "\u2308"),
        _Utils_Tuple2("lcub", "{"),
        _Utils_Tuple2("Lcy", "\u041B"),
        _Utils_Tuple2("lcy", "\u043B"),
        _Utils_Tuple2("ldca", "\u2936"),
        _Utils_Tuple2("ldquo", "\u201C"),
        _Utils_Tuple2("ldquor", "\u201E"),
        _Utils_Tuple2("ldrdhar", "\u2967"),
        _Utils_Tuple2("ldrushar", "\u294B"),
        _Utils_Tuple2("ldsh", "\u21B2"),
        _Utils_Tuple2("le", "\u2264"),
        _Utils_Tuple2("lE", "\u2266"),
        _Utils_Tuple2("LeftAngleBracket", "\u27E8"),
        _Utils_Tuple2("LeftArrowBar", "\u21E4"),
        _Utils_Tuple2("leftarrow", "\u2190"),
        _Utils_Tuple2("LeftArrow", "\u2190"),
        _Utils_Tuple2("Leftarrow", "\u21D0"),
        _Utils_Tuple2("LeftArrowRightArrow", "\u21C6"),
        _Utils_Tuple2("leftarrowtail", "\u21A2"),
        _Utils_Tuple2("LeftCeiling", "\u2308"),
        _Utils_Tuple2("LeftDoubleBracket", "\u27E6"),
        _Utils_Tuple2("LeftDownTeeVector", "\u2961"),
        _Utils_Tuple2("LeftDownVectorBar", "\u2959"),
        _Utils_Tuple2("LeftDownVector", "\u21C3"),
        _Utils_Tuple2("LeftFloor", "\u230A"),
        _Utils_Tuple2("leftharpoondown", "\u21BD"),
        _Utils_Tuple2("leftharpoonup", "\u21BC"),
        _Utils_Tuple2("leftleftarrows", "\u21C7"),
        _Utils_Tuple2("leftrightarrow", "\u2194"),
        _Utils_Tuple2("LeftRightArrow", "\u2194"),
        _Utils_Tuple2("Leftrightarrow", "\u21D4"),
        _Utils_Tuple2("leftrightarrows", "\u21C6"),
        _Utils_Tuple2("leftrightharpoons", "\u21CB"),
        _Utils_Tuple2("leftrightsquigarrow", "\u21AD"),
        _Utils_Tuple2("LeftRightVector", "\u294E"),
        _Utils_Tuple2("LeftTeeArrow", "\u21A4"),
        _Utils_Tuple2("LeftTee", "\u22A3"),
        _Utils_Tuple2("LeftTeeVector", "\u295A"),
        _Utils_Tuple2("leftthreetimes", "\u22CB"),
        _Utils_Tuple2("LeftTriangleBar", "\u29CF"),
        _Utils_Tuple2("LeftTriangle", "\u22B2"),
        _Utils_Tuple2("LeftTriangleEqual", "\u22B4"),
        _Utils_Tuple2("LeftUpDownVector", "\u2951"),
        _Utils_Tuple2("LeftUpTeeVector", "\u2960"),
        _Utils_Tuple2("LeftUpVectorBar", "\u2958"),
        _Utils_Tuple2("LeftUpVector", "\u21BF"),
        _Utils_Tuple2("LeftVectorBar", "\u2952"),
        _Utils_Tuple2("LeftVector", "\u21BC"),
        _Utils_Tuple2("lEg", "\u2A8B"),
        _Utils_Tuple2("leg", "\u22DA"),
        _Utils_Tuple2("leq", "\u2264"),
        _Utils_Tuple2("leqq", "\u2266"),
        _Utils_Tuple2("leqslant", "\u2A7D"),
        _Utils_Tuple2("lescc", "\u2AA8"),
        _Utils_Tuple2("les", "\u2A7D"),
        _Utils_Tuple2("lesdot", "\u2A7F"),
        _Utils_Tuple2("lesdoto", "\u2A81"),
        _Utils_Tuple2("lesdotor", "\u2A83"),
        _Utils_Tuple2("lesg", "\u22DA\uFE00"),
        _Utils_Tuple2("lesges", "\u2A93"),
        _Utils_Tuple2("lessapprox", "\u2A85"),
        _Utils_Tuple2("lessdot", "\u22D6"),
        _Utils_Tuple2("lesseqgtr", "\u22DA"),
        _Utils_Tuple2("lesseqqgtr", "\u2A8B"),
        _Utils_Tuple2("LessEqualGreater", "\u22DA"),
        _Utils_Tuple2("LessFullEqual", "\u2266"),
        _Utils_Tuple2("LessGreater", "\u2276"),
        _Utils_Tuple2("lessgtr", "\u2276"),
        _Utils_Tuple2("LessLess", "\u2AA1"),
        _Utils_Tuple2("lesssim", "\u2272"),
        _Utils_Tuple2("LessSlantEqual", "\u2A7D"),
        _Utils_Tuple2("LessTilde", "\u2272"),
        _Utils_Tuple2("lfisht", "\u297C"),
        _Utils_Tuple2("lfloor", "\u230A"),
        _Utils_Tuple2("Lfr", "\uD835\uDD0F"),
        _Utils_Tuple2("lfr", "\uD835\uDD29"),
        _Utils_Tuple2("lg", "\u2276"),
        _Utils_Tuple2("lgE", "\u2A91"),
        _Utils_Tuple2("lHar", "\u2962"),
        _Utils_Tuple2("lhard", "\u21BD"),
        _Utils_Tuple2("lharu", "\u21BC"),
        _Utils_Tuple2("lharul", "\u296A"),
        _Utils_Tuple2("lhblk", "\u2584"),
        _Utils_Tuple2("LJcy", "\u0409"),
        _Utils_Tuple2("ljcy", "\u0459"),
        _Utils_Tuple2("llarr", "\u21C7"),
        _Utils_Tuple2("ll", "\u226A"),
        _Utils_Tuple2("Ll", "\u22D8"),
        _Utils_Tuple2("llcorner", "\u231E"),
        _Utils_Tuple2("Lleftarrow", "\u21DA"),
        _Utils_Tuple2("llhard", "\u296B"),
        _Utils_Tuple2("lltri", "\u25FA"),
        _Utils_Tuple2("Lmidot", "\u013F"),
        _Utils_Tuple2("lmidot", "\u0140"),
        _Utils_Tuple2("lmoustache", "\u23B0"),
        _Utils_Tuple2("lmoust", "\u23B0"),
        _Utils_Tuple2("lnap", "\u2A89"),
        _Utils_Tuple2("lnapprox", "\u2A89"),
        _Utils_Tuple2("lne", "\u2A87"),
        _Utils_Tuple2("lnE", "\u2268"),
        _Utils_Tuple2("lneq", "\u2A87"),
        _Utils_Tuple2("lneqq", "\u2268"),
        _Utils_Tuple2("lnsim", "\u22E6"),
        _Utils_Tuple2("loang", "\u27EC"),
        _Utils_Tuple2("loarr", "\u21FD"),
        _Utils_Tuple2("lobrk", "\u27E6"),
        _Utils_Tuple2("longleftarrow", "\u27F5"),
        _Utils_Tuple2("LongLeftArrow", "\u27F5"),
        _Utils_Tuple2("Longleftarrow", "\u27F8"),
        _Utils_Tuple2("longleftrightarrow", "\u27F7"),
        _Utils_Tuple2("LongLeftRightArrow", "\u27F7"),
        _Utils_Tuple2("Longleftrightarrow", "\u27FA"),
        _Utils_Tuple2("longmapsto", "\u27FC"),
        _Utils_Tuple2("longrightarrow", "\u27F6"),
        _Utils_Tuple2("LongRightArrow", "\u27F6"),
        _Utils_Tuple2("Longrightarrow", "\u27F9"),
        _Utils_Tuple2("looparrowleft", "\u21AB"),
        _Utils_Tuple2("looparrowright", "\u21AC"),
        _Utils_Tuple2("lopar", "\u2985"),
        _Utils_Tuple2("Lopf", "\uD835\uDD43"),
        _Utils_Tuple2("lopf", "\uD835\uDD5D"),
        _Utils_Tuple2("loplus", "\u2A2D"),
        _Utils_Tuple2("lotimes", "\u2A34"),
        _Utils_Tuple2("lowast", "\u2217"),
        _Utils_Tuple2("lowbar", "_"),
        _Utils_Tuple2("LowerLeftArrow", "\u2199"),
        _Utils_Tuple2("LowerRightArrow", "\u2198"),
        _Utils_Tuple2("loz", "\u25CA"),
        _Utils_Tuple2("lozenge", "\u25CA"),
        _Utils_Tuple2("lozf", "\u29EB"),
        _Utils_Tuple2("lpar", "("),
        _Utils_Tuple2("lparlt", "\u2993"),
        _Utils_Tuple2("lrarr", "\u21C6"),
        _Utils_Tuple2("lrcorner", "\u231F"),
        _Utils_Tuple2("lrhar", "\u21CB"),
        _Utils_Tuple2("lrhard", "\u296D"),
        _Utils_Tuple2("lrm", "\u200E"),
        _Utils_Tuple2("lrtri", "\u22BF"),
        _Utils_Tuple2("lsaquo", "\u2039"),
        _Utils_Tuple2("lscr", "\uD835\uDCC1"),
        _Utils_Tuple2("Lscr", "\u2112"),
        _Utils_Tuple2("lsh", "\u21B0"),
        _Utils_Tuple2("Lsh", "\u21B0"),
        _Utils_Tuple2("lsim", "\u2272"),
        _Utils_Tuple2("lsime", "\u2A8D"),
        _Utils_Tuple2("lsimg", "\u2A8F"),
        _Utils_Tuple2("lsqb", "["),
        _Utils_Tuple2("lsquo", "\u2018"),
        _Utils_Tuple2("lsquor", "\u201A"),
        _Utils_Tuple2("Lstrok", "\u0141"),
        _Utils_Tuple2("lstrok", "\u0142"),
        _Utils_Tuple2("ltcc", "\u2AA6"),
        _Utils_Tuple2("ltcir", "\u2A79"),
        _Utils_Tuple2("lt", "<"),
        _Utils_Tuple2("LT", "<"),
        _Utils_Tuple2("Lt", "\u226A"),
        _Utils_Tuple2("ltdot", "\u22D6"),
        _Utils_Tuple2("lthree", "\u22CB"),
        _Utils_Tuple2("ltimes", "\u22C9"),
        _Utils_Tuple2("ltlarr", "\u2976"),
        _Utils_Tuple2("ltquest", "\u2A7B"),
        _Utils_Tuple2("ltri", "\u25C3"),
        _Utils_Tuple2("ltrie", "\u22B4"),
        _Utils_Tuple2("ltrif", "\u25C2"),
        _Utils_Tuple2("ltrPar", "\u2996"),
        _Utils_Tuple2("lurdshar", "\u294A"),
        _Utils_Tuple2("luruhar", "\u2966"),
        _Utils_Tuple2("lvertneqq", "\u2268\uFE00"),
        _Utils_Tuple2("lvnE", "\u2268\uFE00"),
        _Utils_Tuple2("macr", "\xaf"),
        _Utils_Tuple2("male", "\u2642"),
        _Utils_Tuple2("malt", "\u2720"),
        _Utils_Tuple2("maltese", "\u2720"),
        _Utils_Tuple2("Map", "\u2905"),
        _Utils_Tuple2("map", "\u21A6"),
        _Utils_Tuple2("mapsto", "\u21A6"),
        _Utils_Tuple2("mapstodown", "\u21A7"),
        _Utils_Tuple2("mapstoleft", "\u21A4"),
        _Utils_Tuple2("mapstoup", "\u21A5"),
        _Utils_Tuple2("marker", "\u25AE"),
        _Utils_Tuple2("mcomma", "\u2A29"),
        _Utils_Tuple2("Mcy", "\u041C"),
        _Utils_Tuple2("mcy", "\u043C"),
        _Utils_Tuple2("mdash", "\u2014"),
        _Utils_Tuple2("mDDot", "\u223A"),
        _Utils_Tuple2("measuredangle", "\u2221"),
        _Utils_Tuple2("MediumSpace", "\u205F"),
        _Utils_Tuple2("Mellintrf", "\u2133"),
        _Utils_Tuple2("Mfr", "\uD835\uDD10"),
        _Utils_Tuple2("mfr", "\uD835\uDD2A"),
        _Utils_Tuple2("mho", "\u2127"),
        _Utils_Tuple2("micro", "\xb5"),
        _Utils_Tuple2("midast", "*"),
        _Utils_Tuple2("midcir", "\u2AF0"),
        _Utils_Tuple2("mid", "\u2223"),
        _Utils_Tuple2("middot", "\xb7"),
        _Utils_Tuple2("minusb", "\u229F"),
        _Utils_Tuple2("minus", "\u2212"),
        _Utils_Tuple2("minusd", "\u2238"),
        _Utils_Tuple2("minusdu", "\u2A2A"),
        _Utils_Tuple2("MinusPlus", "\u2213"),
        _Utils_Tuple2("mlcp", "\u2ADB"),
        _Utils_Tuple2("mldr", "\u2026"),
        _Utils_Tuple2("mnplus", "\u2213"),
        _Utils_Tuple2("models", "\u22A7"),
        _Utils_Tuple2("Mopf", "\uD835\uDD44"),
        _Utils_Tuple2("mopf", "\uD835\uDD5E"),
        _Utils_Tuple2("mp", "\u2213"),
        _Utils_Tuple2("mscr", "\uD835\uDCC2"),
        _Utils_Tuple2("Mscr", "\u2133"),
        _Utils_Tuple2("mstpos", "\u223E"),
        _Utils_Tuple2("Mu", "\u039C"),
        _Utils_Tuple2("mu", "\u03BC"),
        _Utils_Tuple2("multimap", "\u22B8"),
        _Utils_Tuple2("mumap", "\u22B8"),
        _Utils_Tuple2("nabla", "\u2207"),
        _Utils_Tuple2("Nacute", "\u0143"),
        _Utils_Tuple2("nacute", "\u0144"),
        _Utils_Tuple2("nang", "\u2220\u20D2"),
        _Utils_Tuple2("nap", "\u2249"),
        _Utils_Tuple2("napE", "\u2A70\u0338"),
        _Utils_Tuple2("napid", "\u224B\u0338"),
        _Utils_Tuple2("napos", "\u0149"),
        _Utils_Tuple2("napprox", "\u2249"),
        _Utils_Tuple2("natural", "\u266E"),
        _Utils_Tuple2("naturals", "\u2115"),
        _Utils_Tuple2("natur", "\u266E"),
        _Utils_Tuple2("nbsp", "\xa0"),
        _Utils_Tuple2("nbump", "\u224E\u0338"),
        _Utils_Tuple2("nbumpe", "\u224F\u0338"),
        _Utils_Tuple2("ncap", "\u2A43"),
        _Utils_Tuple2("Ncaron", "\u0147"),
        _Utils_Tuple2("ncaron", "\u0148"),
        _Utils_Tuple2("Ncedil", "\u0145"),
        _Utils_Tuple2("ncedil", "\u0146"),
        _Utils_Tuple2("ncong", "\u2247"),
        _Utils_Tuple2("ncongdot", "\u2A6D\u0338"),
        _Utils_Tuple2("ncup", "\u2A42"),
        _Utils_Tuple2("Ncy", "\u041D"),
        _Utils_Tuple2("ncy", "\u043D"),
        _Utils_Tuple2("ndash", "\u2013"),
        _Utils_Tuple2("nearhk", "\u2924"),
        _Utils_Tuple2("nearr", "\u2197"),
        _Utils_Tuple2("neArr", "\u21D7"),
        _Utils_Tuple2("nearrow", "\u2197"),
        _Utils_Tuple2("ne", "\u2260"),
        _Utils_Tuple2("nedot", "\u2250\u0338"),
        _Utils_Tuple2("NegativeMediumSpace", "\u200B"),
        _Utils_Tuple2("NegativeThickSpace", "\u200B"),
        _Utils_Tuple2("NegativeThinSpace", "\u200B"),
        _Utils_Tuple2("NegativeVeryThinSpace", "\u200B"),
        _Utils_Tuple2("nequiv", "\u2262"),
        _Utils_Tuple2("nesear", "\u2928"),
        _Utils_Tuple2("nesim", "\u2242\u0338"),
        _Utils_Tuple2("NestedGreaterGreater", "\u226B"),
        _Utils_Tuple2("NestedLessLess", "\u226A"),
        _Utils_Tuple2("NewLine", "\n"),
        _Utils_Tuple2("nexist", "\u2204"),
        _Utils_Tuple2("nexists", "\u2204"),
        _Utils_Tuple2("Nfr", "\uD835\uDD11"),
        _Utils_Tuple2("nfr", "\uD835\uDD2B"),
        _Utils_Tuple2("ngE", "\u2267\u0338"),
        _Utils_Tuple2("nge", "\u2271"),
        _Utils_Tuple2("ngeq", "\u2271"),
        _Utils_Tuple2("ngeqq", "\u2267\u0338"),
        _Utils_Tuple2("ngeqslant", "\u2A7E\u0338"),
        _Utils_Tuple2("nges", "\u2A7E\u0338"),
        _Utils_Tuple2("nGg", "\u22D9\u0338"),
        _Utils_Tuple2("ngsim", "\u2275"),
        _Utils_Tuple2("nGt", "\u226B\u20D2"),
        _Utils_Tuple2("ngt", "\u226F"),
        _Utils_Tuple2("ngtr", "\u226F"),
        _Utils_Tuple2("nGtv", "\u226B\u0338"),
        _Utils_Tuple2("nharr", "\u21AE"),
        _Utils_Tuple2("nhArr", "\u21CE"),
        _Utils_Tuple2("nhpar", "\u2AF2"),
        _Utils_Tuple2("ni", "\u220B"),
        _Utils_Tuple2("nis", "\u22FC"),
        _Utils_Tuple2("nisd", "\u22FA"),
        _Utils_Tuple2("niv", "\u220B"),
        _Utils_Tuple2("NJcy", "\u040A"),
        _Utils_Tuple2("njcy", "\u045A"),
        _Utils_Tuple2("nlarr", "\u219A"),
        _Utils_Tuple2("nlArr", "\u21CD"),
        _Utils_Tuple2("nldr", "\u2025"),
        _Utils_Tuple2("nlE", "\u2266\u0338"),
        _Utils_Tuple2("nle", "\u2270"),
        _Utils_Tuple2("nleftarrow", "\u219A"),
        _Utils_Tuple2("nLeftarrow", "\u21CD"),
        _Utils_Tuple2("nleftrightarrow", "\u21AE"),
        _Utils_Tuple2("nLeftrightarrow", "\u21CE"),
        _Utils_Tuple2("nleq", "\u2270"),
        _Utils_Tuple2("nleqq", "\u2266\u0338"),
        _Utils_Tuple2("nleqslant", "\u2A7D\u0338"),
        _Utils_Tuple2("nles", "\u2A7D\u0338"),
        _Utils_Tuple2("nless", "\u226E"),
        _Utils_Tuple2("nLl", "\u22D8\u0338"),
        _Utils_Tuple2("nlsim", "\u2274"),
        _Utils_Tuple2("nLt", "\u226A\u20D2"),
        _Utils_Tuple2("nlt", "\u226E"),
        _Utils_Tuple2("nltri", "\u22EA"),
        _Utils_Tuple2("nltrie", "\u22EC"),
        _Utils_Tuple2("nLtv", "\u226A\u0338"),
        _Utils_Tuple2("nmid", "\u2224"),
        _Utils_Tuple2("NoBreak", "\u2060"),
        _Utils_Tuple2("NonBreakingSpace", "\xa0"),
        _Utils_Tuple2("nopf", "\uD835\uDD5F"),
        _Utils_Tuple2("Nopf", "\u2115"),
        _Utils_Tuple2("Not", "\u2AEC"),
        _Utils_Tuple2("not", "\xac"),
        _Utils_Tuple2("NotCongruent", "\u2262"),
        _Utils_Tuple2("NotCupCap", "\u226D"),
        _Utils_Tuple2("NotDoubleVerticalBar", "\u2226"),
        _Utils_Tuple2("NotElement", "\u2209"),
        _Utils_Tuple2("NotEqual", "\u2260"),
        _Utils_Tuple2("NotEqualTilde", "\u2242\u0338"),
        _Utils_Tuple2("NotExists", "\u2204"),
        _Utils_Tuple2("NotGreater", "\u226F"),
        _Utils_Tuple2("NotGreaterEqual", "\u2271"),
        _Utils_Tuple2("NotGreaterFullEqual", "\u2267\u0338"),
        _Utils_Tuple2("NotGreaterGreater", "\u226B\u0338"),
        _Utils_Tuple2("NotGreaterLess", "\u2279"),
        _Utils_Tuple2("NotGreaterSlantEqual", "\u2A7E\u0338"),
        _Utils_Tuple2("NotGreaterTilde", "\u2275"),
        _Utils_Tuple2("NotHumpDownHump", "\u224E\u0338"),
        _Utils_Tuple2("NotHumpEqual", "\u224F\u0338"),
        _Utils_Tuple2("notin", "\u2209"),
        _Utils_Tuple2("notindot", "\u22F5\u0338"),
        _Utils_Tuple2("notinE", "\u22F9\u0338"),
        _Utils_Tuple2("notinva", "\u2209"),
        _Utils_Tuple2("notinvb", "\u22F7"),
        _Utils_Tuple2("notinvc", "\u22F6"),
        _Utils_Tuple2("NotLeftTriangleBar", "\u29CF\u0338"),
        _Utils_Tuple2("NotLeftTriangle", "\u22EA"),
        _Utils_Tuple2("NotLeftTriangleEqual", "\u22EC"),
        _Utils_Tuple2("NotLess", "\u226E"),
        _Utils_Tuple2("NotLessEqual", "\u2270"),
        _Utils_Tuple2("NotLessGreater", "\u2278"),
        _Utils_Tuple2("NotLessLess", "\u226A\u0338"),
        _Utils_Tuple2("NotLessSlantEqual", "\u2A7D\u0338"),
        _Utils_Tuple2("NotLessTilde", "\u2274"),
        _Utils_Tuple2("NotNestedGreaterGreater", "\u2AA2\u0338"),
        _Utils_Tuple2("NotNestedLessLess", "\u2AA1\u0338"),
        _Utils_Tuple2("notni", "\u220C"),
        _Utils_Tuple2("notniva", "\u220C"),
        _Utils_Tuple2("notnivb", "\u22FE"),
        _Utils_Tuple2("notnivc", "\u22FD"),
        _Utils_Tuple2("NotPrecedes", "\u2280"),
        _Utils_Tuple2("NotPrecedesEqual", "\u2AAF\u0338"),
        _Utils_Tuple2("NotPrecedesSlantEqual", "\u22E0"),
        _Utils_Tuple2("NotReverseElement", "\u220C"),
        _Utils_Tuple2("NotRightTriangleBar", "\u29D0\u0338"),
        _Utils_Tuple2("NotRightTriangle", "\u22EB"),
        _Utils_Tuple2("NotRightTriangleEqual", "\u22ED"),
        _Utils_Tuple2("NotSquareSubset", "\u228F\u0338"),
        _Utils_Tuple2("NotSquareSubsetEqual", "\u22E2"),
        _Utils_Tuple2("NotSquareSuperset", "\u2290\u0338"),
        _Utils_Tuple2("NotSquareSupersetEqual", "\u22E3"),
        _Utils_Tuple2("NotSubset", "\u2282\u20D2"),
        _Utils_Tuple2("NotSubsetEqual", "\u2288"),
        _Utils_Tuple2("NotSucceeds", "\u2281"),
        _Utils_Tuple2("NotSucceedsEqual", "\u2AB0\u0338"),
        _Utils_Tuple2("NotSucceedsSlantEqual", "\u22E1"),
        _Utils_Tuple2("NotSucceedsTilde", "\u227F\u0338"),
        _Utils_Tuple2("NotSuperset", "\u2283\u20D2"),
        _Utils_Tuple2("NotSupersetEqual", "\u2289"),
        _Utils_Tuple2("NotTilde", "\u2241"),
        _Utils_Tuple2("NotTildeEqual", "\u2244"),
        _Utils_Tuple2("NotTildeFullEqual", "\u2247"),
        _Utils_Tuple2("NotTildeTilde", "\u2249"),
        _Utils_Tuple2("NotVerticalBar", "\u2224"),
        _Utils_Tuple2("nparallel", "\u2226"),
        _Utils_Tuple2("npar", "\u2226"),
        _Utils_Tuple2("nparsl", "\u2AFD\u20E5"),
        _Utils_Tuple2("npart", "\u2202\u0338"),
        _Utils_Tuple2("npolint", "\u2A14"),
        _Utils_Tuple2("npr", "\u2280"),
        _Utils_Tuple2("nprcue", "\u22E0"),
        _Utils_Tuple2("nprec", "\u2280"),
        _Utils_Tuple2("npreceq", "\u2AAF\u0338"),
        _Utils_Tuple2("npre", "\u2AAF\u0338"),
        _Utils_Tuple2("nrarrc", "\u2933\u0338"),
        _Utils_Tuple2("nrarr", "\u219B"),
        _Utils_Tuple2("nrArr", "\u21CF"),
        _Utils_Tuple2("nrarrw", "\u219D\u0338"),
        _Utils_Tuple2("nrightarrow", "\u219B"),
        _Utils_Tuple2("nRightarrow", "\u21CF"),
        _Utils_Tuple2("nrtri", "\u22EB"),
        _Utils_Tuple2("nrtrie", "\u22ED"),
        _Utils_Tuple2("nsc", "\u2281"),
        _Utils_Tuple2("nsccue", "\u22E1"),
        _Utils_Tuple2("nsce", "\u2AB0\u0338"),
        _Utils_Tuple2("Nscr", "\uD835\uDCA9"),
        _Utils_Tuple2("nscr", "\uD835\uDCC3"),
        _Utils_Tuple2("nshortmid", "\u2224"),
        _Utils_Tuple2("nshortparallel", "\u2226"),
        _Utils_Tuple2("nsim", "\u2241"),
        _Utils_Tuple2("nsime", "\u2244"),
        _Utils_Tuple2("nsimeq", "\u2244"),
        _Utils_Tuple2("nsmid", "\u2224"),
        _Utils_Tuple2("nspar", "\u2226"),
        _Utils_Tuple2("nsqsube", "\u22E2"),
        _Utils_Tuple2("nsqsupe", "\u22E3"),
        _Utils_Tuple2("nsub", "\u2284"),
        _Utils_Tuple2("nsubE", "\u2AC5\u0338"),
        _Utils_Tuple2("nsube", "\u2288"),
        _Utils_Tuple2("nsubset", "\u2282\u20D2"),
        _Utils_Tuple2("nsubseteq", "\u2288"),
        _Utils_Tuple2("nsubseteqq", "\u2AC5\u0338"),
        _Utils_Tuple2("nsucc", "\u2281"),
        _Utils_Tuple2("nsucceq", "\u2AB0\u0338"),
        _Utils_Tuple2("nsup", "\u2285"),
        _Utils_Tuple2("nsupE", "\u2AC6\u0338"),
        _Utils_Tuple2("nsupe", "\u2289"),
        _Utils_Tuple2("nsupset", "\u2283\u20D2"),
        _Utils_Tuple2("nsupseteq", "\u2289"),
        _Utils_Tuple2("nsupseteqq", "\u2AC6\u0338"),
        _Utils_Tuple2("ntgl", "\u2279"),
        _Utils_Tuple2("Ntilde", "\xd1"),
        _Utils_Tuple2("ntilde", "\xf1"),
        _Utils_Tuple2("ntlg", "\u2278"),
        _Utils_Tuple2("ntriangleleft", "\u22EA"),
        _Utils_Tuple2("ntrianglelefteq", "\u22EC"),
        _Utils_Tuple2("ntriangleright", "\u22EB"),
        _Utils_Tuple2("ntrianglerighteq", "\u22ED"),
        _Utils_Tuple2("Nu", "\u039D"),
        _Utils_Tuple2("nu", "\u03BD"),
        _Utils_Tuple2("num", "#"),
        _Utils_Tuple2("numero", "\u2116"),
        _Utils_Tuple2("numsp", "\u2007"),
        _Utils_Tuple2("nvap", "\u224D\u20D2"),
        _Utils_Tuple2("nvdash", "\u22AC"),
        _Utils_Tuple2("nvDash", "\u22AD"),
        _Utils_Tuple2("nVdash", "\u22AE"),
        _Utils_Tuple2("nVDash", "\u22AF"),
        _Utils_Tuple2("nvge", "\u2265\u20D2"),
        _Utils_Tuple2("nvgt", ">\u20D2"),
        _Utils_Tuple2("nvHarr", "\u2904"),
        _Utils_Tuple2("nvinfin", "\u29DE"),
        _Utils_Tuple2("nvlArr", "\u2902"),
        _Utils_Tuple2("nvle", "\u2264\u20D2"),
        _Utils_Tuple2("nvlt", "<\u20D2"),
        _Utils_Tuple2("nvltrie", "\u22B4\u20D2"),
        _Utils_Tuple2("nvrArr", "\u2903"),
        _Utils_Tuple2("nvrtrie", "\u22B5\u20D2"),
        _Utils_Tuple2("nvsim", "\u223C\u20D2"),
        _Utils_Tuple2("nwarhk", "\u2923"),
        _Utils_Tuple2("nwarr", "\u2196"),
        _Utils_Tuple2("nwArr", "\u21D6"),
        _Utils_Tuple2("nwarrow", "\u2196"),
        _Utils_Tuple2("nwnear", "\u2927"),
        _Utils_Tuple2("Oacute", "\xd3"),
        _Utils_Tuple2("oacute", "\xf3"),
        _Utils_Tuple2("oast", "\u229B"),
        _Utils_Tuple2("Ocirc", "\xd4"),
        _Utils_Tuple2("ocirc", "\xf4"),
        _Utils_Tuple2("ocir", "\u229A"),
        _Utils_Tuple2("Ocy", "\u041E"),
        _Utils_Tuple2("ocy", "\u043E"),
        _Utils_Tuple2("odash", "\u229D"),
        _Utils_Tuple2("Odblac", "\u0150"),
        _Utils_Tuple2("odblac", "\u0151"),
        _Utils_Tuple2("odiv", "\u2A38"),
        _Utils_Tuple2("odot", "\u2299"),
        _Utils_Tuple2("odsold", "\u29BC"),
        _Utils_Tuple2("OElig", "\u0152"),
        _Utils_Tuple2("oelig", "\u0153"),
        _Utils_Tuple2("ofcir", "\u29BF"),
        _Utils_Tuple2("Ofr", "\uD835\uDD12"),
        _Utils_Tuple2("ofr", "\uD835\uDD2C"),
        _Utils_Tuple2("ogon", "\u02DB"),
        _Utils_Tuple2("Ograve", "\xd2"),
        _Utils_Tuple2("ograve", "\xf2"),
        _Utils_Tuple2("ogt", "\u29C1"),
        _Utils_Tuple2("ohbar", "\u29B5"),
        _Utils_Tuple2("ohm", "\u03A9"),
        _Utils_Tuple2("oint", "\u222E"),
        _Utils_Tuple2("olarr", "\u21BA"),
        _Utils_Tuple2("olcir", "\u29BE"),
        _Utils_Tuple2("olcross", "\u29BB"),
        _Utils_Tuple2("oline", "\u203E"),
        _Utils_Tuple2("olt", "\u29C0"),
        _Utils_Tuple2("Omacr", "\u014C"),
        _Utils_Tuple2("omacr", "\u014D"),
        _Utils_Tuple2("Omega", "\u03A9"),
        _Utils_Tuple2("omega", "\u03C9"),
        _Utils_Tuple2("Omicron", "\u039F"),
        _Utils_Tuple2("omicron", "\u03BF"),
        _Utils_Tuple2("omid", "\u29B6"),
        _Utils_Tuple2("ominus", "\u2296"),
        _Utils_Tuple2("Oopf", "\uD835\uDD46"),
        _Utils_Tuple2("oopf", "\uD835\uDD60"),
        _Utils_Tuple2("opar", "\u29B7"),
        _Utils_Tuple2("OpenCurlyDoubleQuote", "\u201C"),
        _Utils_Tuple2("OpenCurlyQuote", "\u2018"),
        _Utils_Tuple2("operp", "\u29B9"),
        _Utils_Tuple2("oplus", "\u2295"),
        _Utils_Tuple2("orarr", "\u21BB"),
        _Utils_Tuple2("Or", "\u2A54"),
        _Utils_Tuple2("or", "\u2228"),
        _Utils_Tuple2("ord", "\u2A5D"),
        _Utils_Tuple2("order", "\u2134"),
        _Utils_Tuple2("orderof", "\u2134"),
        _Utils_Tuple2("ordf", "\xaa"),
        _Utils_Tuple2("ordm", "\xba"),
        _Utils_Tuple2("origof", "\u22B6"),
        _Utils_Tuple2("oror", "\u2A56"),
        _Utils_Tuple2("orslope", "\u2A57"),
        _Utils_Tuple2("orv", "\u2A5B"),
        _Utils_Tuple2("oS", "\u24C8"),
        _Utils_Tuple2("Oscr", "\uD835\uDCAA"),
        _Utils_Tuple2("oscr", "\u2134"),
        _Utils_Tuple2("Oslash", "\xd8"),
        _Utils_Tuple2("oslash", "\xf8"),
        _Utils_Tuple2("osol", "\u2298"),
        _Utils_Tuple2("Otilde", "\xd5"),
        _Utils_Tuple2("otilde", "\xf5"),
        _Utils_Tuple2("otimesas", "\u2A36"),
        _Utils_Tuple2("Otimes", "\u2A37"),
        _Utils_Tuple2("otimes", "\u2297"),
        _Utils_Tuple2("Ouml", "\xd6"),
        _Utils_Tuple2("ouml", "\xf6"),
        _Utils_Tuple2("ovbar", "\u233D"),
        _Utils_Tuple2("OverBar", "\u203E"),
        _Utils_Tuple2("OverBrace", "\u23DE"),
        _Utils_Tuple2("OverBracket", "\u23B4"),
        _Utils_Tuple2("OverParenthesis", "\u23DC"),
        _Utils_Tuple2("para", "\xb6"),
        _Utils_Tuple2("parallel", "\u2225"),
        _Utils_Tuple2("par", "\u2225"),
        _Utils_Tuple2("parsim", "\u2AF3"),
        _Utils_Tuple2("parsl", "\u2AFD"),
        _Utils_Tuple2("part", "\u2202"),
        _Utils_Tuple2("PartialD", "\u2202"),
        _Utils_Tuple2("Pcy", "\u041F"),
        _Utils_Tuple2("pcy", "\u043F"),
        _Utils_Tuple2("percnt", "%"),
        _Utils_Tuple2("period", "."),
        _Utils_Tuple2("permil", "\u2030"),
        _Utils_Tuple2("perp", "\u22A5"),
        _Utils_Tuple2("pertenk", "\u2031"),
        _Utils_Tuple2("Pfr", "\uD835\uDD13"),
        _Utils_Tuple2("pfr", "\uD835\uDD2D"),
        _Utils_Tuple2("Phi", "\u03A6"),
        _Utils_Tuple2("phi", "\u03C6"),
        _Utils_Tuple2("phiv", "\u03D5"),
        _Utils_Tuple2("phmmat", "\u2133"),
        _Utils_Tuple2("phone", "\u260E"),
        _Utils_Tuple2("Pi", "\u03A0"),
        _Utils_Tuple2("pi", "\u03C0"),
        _Utils_Tuple2("pitchfork", "\u22D4"),
        _Utils_Tuple2("piv", "\u03D6"),
        _Utils_Tuple2("planck", "\u210F"),
        _Utils_Tuple2("planckh", "\u210E"),
        _Utils_Tuple2("plankv", "\u210F"),
        _Utils_Tuple2("plusacir", "\u2A23"),
        _Utils_Tuple2("plusb", "\u229E"),
        _Utils_Tuple2("pluscir", "\u2A22"),
        _Utils_Tuple2("plus", "+"),
        _Utils_Tuple2("plusdo", "\u2214"),
        _Utils_Tuple2("plusdu", "\u2A25"),
        _Utils_Tuple2("pluse", "\u2A72"),
        _Utils_Tuple2("PlusMinus", "\xb1"),
        _Utils_Tuple2("plusmn", "\xb1"),
        _Utils_Tuple2("plussim", "\u2A26"),
        _Utils_Tuple2("plustwo", "\u2A27"),
        _Utils_Tuple2("pm", "\xb1"),
        _Utils_Tuple2("Poincareplane", "\u210C"),
        _Utils_Tuple2("pointint", "\u2A15"),
        _Utils_Tuple2("popf", "\uD835\uDD61"),
        _Utils_Tuple2("Popf", "\u2119"),
        _Utils_Tuple2("pound", "\xa3"),
        _Utils_Tuple2("prap", "\u2AB7"),
        _Utils_Tuple2("Pr", "\u2ABB"),
        _Utils_Tuple2("pr", "\u227A"),
        _Utils_Tuple2("prcue", "\u227C"),
        _Utils_Tuple2("precapprox", "\u2AB7"),
        _Utils_Tuple2("prec", "\u227A"),
        _Utils_Tuple2("preccurlyeq", "\u227C"),
        _Utils_Tuple2("Precedes", "\u227A"),
        _Utils_Tuple2("PrecedesEqual", "\u2AAF"),
        _Utils_Tuple2("PrecedesSlantEqual", "\u227C"),
        _Utils_Tuple2("PrecedesTilde", "\u227E"),
        _Utils_Tuple2("preceq", "\u2AAF"),
        _Utils_Tuple2("precnapprox", "\u2AB9"),
        _Utils_Tuple2("precneqq", "\u2AB5"),
        _Utils_Tuple2("precnsim", "\u22E8"),
        _Utils_Tuple2("pre", "\u2AAF"),
        _Utils_Tuple2("prE", "\u2AB3"),
        _Utils_Tuple2("precsim", "\u227E"),
        _Utils_Tuple2("prime", "\u2032"),
        _Utils_Tuple2("Prime", "\u2033"),
        _Utils_Tuple2("primes", "\u2119"),
        _Utils_Tuple2("prnap", "\u2AB9"),
        _Utils_Tuple2("prnE", "\u2AB5"),
        _Utils_Tuple2("prnsim", "\u22E8"),
        _Utils_Tuple2("prod", "\u220F"),
        _Utils_Tuple2("Product", "\u220F"),
        _Utils_Tuple2("profalar", "\u232E"),
        _Utils_Tuple2("profline", "\u2312"),
        _Utils_Tuple2("profsurf", "\u2313"),
        _Utils_Tuple2("prop", "\u221D"),
        _Utils_Tuple2("Proportional", "\u221D"),
        _Utils_Tuple2("Proportion", "\u2237"),
        _Utils_Tuple2("propto", "\u221D"),
        _Utils_Tuple2("prsim", "\u227E"),
        _Utils_Tuple2("prurel", "\u22B0"),
        _Utils_Tuple2("Pscr", "\uD835\uDCAB"),
        _Utils_Tuple2("pscr", "\uD835\uDCC5"),
        _Utils_Tuple2("Psi", "\u03A8"),
        _Utils_Tuple2("psi", "\u03C8"),
        _Utils_Tuple2("puncsp", "\u2008"),
        _Utils_Tuple2("Qfr", "\uD835\uDD14"),
        _Utils_Tuple2("qfr", "\uD835\uDD2E"),
        _Utils_Tuple2("qint", "\u2A0C"),
        _Utils_Tuple2("qopf", "\uD835\uDD62"),
        _Utils_Tuple2("Qopf", "\u211A"),
        _Utils_Tuple2("qprime", "\u2057"),
        _Utils_Tuple2("Qscr", "\uD835\uDCAC"),
        _Utils_Tuple2("qscr", "\uD835\uDCC6"),
        _Utils_Tuple2("quaternions", "\u210D"),
        _Utils_Tuple2("quatint", "\u2A16"),
        _Utils_Tuple2("quest", "?"),
        _Utils_Tuple2("questeq", "\u225F"),
        _Utils_Tuple2("quot", '"'),
        _Utils_Tuple2("QUOT", '"'),
        _Utils_Tuple2("rAarr", "\u21DB"),
        _Utils_Tuple2("race", "\u223D\u0331"),
        _Utils_Tuple2("Racute", "\u0154"),
        _Utils_Tuple2("racute", "\u0155"),
        _Utils_Tuple2("radic", "\u221A"),
        _Utils_Tuple2("raemptyv", "\u29B3"),
        _Utils_Tuple2("rang", "\u27E9"),
        _Utils_Tuple2("Rang", "\u27EB"),
        _Utils_Tuple2("rangd", "\u2992"),
        _Utils_Tuple2("range", "\u29A5"),
        _Utils_Tuple2("rangle", "\u27E9"),
        _Utils_Tuple2("raquo", "\xbb"),
        _Utils_Tuple2("rarrap", "\u2975"),
        _Utils_Tuple2("rarrb", "\u21E5"),
        _Utils_Tuple2("rarrbfs", "\u2920"),
        _Utils_Tuple2("rarrc", "\u2933"),
        _Utils_Tuple2("rarr", "\u2192"),
        _Utils_Tuple2("Rarr", "\u21A0"),
        _Utils_Tuple2("rArr", "\u21D2"),
        _Utils_Tuple2("rarrfs", "\u291E"),
        _Utils_Tuple2("rarrhk", "\u21AA"),
        _Utils_Tuple2("rarrlp", "\u21AC"),
        _Utils_Tuple2("rarrpl", "\u2945"),
        _Utils_Tuple2("rarrsim", "\u2974"),
        _Utils_Tuple2("Rarrtl", "\u2916"),
        _Utils_Tuple2("rarrtl", "\u21A3"),
        _Utils_Tuple2("rarrw", "\u219D"),
        _Utils_Tuple2("ratail", "\u291A"),
        _Utils_Tuple2("rAtail", "\u291C"),
        _Utils_Tuple2("ratio", "\u2236"),
        _Utils_Tuple2("rationals", "\u211A"),
        _Utils_Tuple2("rbarr", "\u290D"),
        _Utils_Tuple2("rBarr", "\u290F"),
        _Utils_Tuple2("RBarr", "\u2910"),
        _Utils_Tuple2("rbbrk", "\u2773"),
        _Utils_Tuple2("rbrace", "}"),
        _Utils_Tuple2("rbrack", "]"),
        _Utils_Tuple2("rbrke", "\u298C"),
        _Utils_Tuple2("rbrksld", "\u298E"),
        _Utils_Tuple2("rbrkslu", "\u2990"),
        _Utils_Tuple2("Rcaron", "\u0158"),
        _Utils_Tuple2("rcaron", "\u0159"),
        _Utils_Tuple2("Rcedil", "\u0156"),
        _Utils_Tuple2("rcedil", "\u0157"),
        _Utils_Tuple2("rceil", "\u2309"),
        _Utils_Tuple2("rcub", "}"),
        _Utils_Tuple2("Rcy", "\u0420"),
        _Utils_Tuple2("rcy", "\u0440"),
        _Utils_Tuple2("rdca", "\u2937"),
        _Utils_Tuple2("rdldhar", "\u2969"),
        _Utils_Tuple2("rdquo", "\u201D"),
        _Utils_Tuple2("rdquor", "\u201D"),
        _Utils_Tuple2("rdsh", "\u21B3"),
        _Utils_Tuple2("real", "\u211C"),
        _Utils_Tuple2("realine", "\u211B"),
        _Utils_Tuple2("realpart", "\u211C"),
        _Utils_Tuple2("reals", "\u211D"),
        _Utils_Tuple2("Re", "\u211C"),
        _Utils_Tuple2("rect", "\u25AD"),
        _Utils_Tuple2("reg", "\xae"),
        _Utils_Tuple2("REG", "\xae"),
        _Utils_Tuple2("ReverseElement", "\u220B"),
        _Utils_Tuple2("ReverseEquilibrium", "\u21CB"),
        _Utils_Tuple2("ReverseUpEquilibrium", "\u296F"),
        _Utils_Tuple2("rfisht", "\u297D"),
        _Utils_Tuple2("rfloor", "\u230B"),
        _Utils_Tuple2("rfr", "\uD835\uDD2F"),
        _Utils_Tuple2("Rfr", "\u211C"),
        _Utils_Tuple2("rHar", "\u2964"),
        _Utils_Tuple2("rhard", "\u21C1"),
        _Utils_Tuple2("rharu", "\u21C0"),
        _Utils_Tuple2("rharul", "\u296C"),
        _Utils_Tuple2("Rho", "\u03A1"),
        _Utils_Tuple2("rho", "\u03C1"),
        _Utils_Tuple2("rhov", "\u03F1"),
        _Utils_Tuple2("RightAngleBracket", "\u27E9"),
        _Utils_Tuple2("RightArrowBar", "\u21E5"),
        _Utils_Tuple2("rightarrow", "\u2192"),
        _Utils_Tuple2("RightArrow", "\u2192"),
        _Utils_Tuple2("Rightarrow", "\u21D2"),
        _Utils_Tuple2("RightArrowLeftArrow", "\u21C4"),
        _Utils_Tuple2("rightarrowtail", "\u21A3"),
        _Utils_Tuple2("RightCeiling", "\u2309"),
        _Utils_Tuple2("RightDoubleBracket", "\u27E7"),
        _Utils_Tuple2("RightDownTeeVector", "\u295D"),
        _Utils_Tuple2("RightDownVectorBar", "\u2955"),
        _Utils_Tuple2("RightDownVector", "\u21C2"),
        _Utils_Tuple2("RightFloor", "\u230B"),
        _Utils_Tuple2("rightharpoondown", "\u21C1"),
        _Utils_Tuple2("rightharpoonup", "\u21C0"),
        _Utils_Tuple2("rightleftarrows", "\u21C4"),
        _Utils_Tuple2("rightleftharpoons", "\u21CC"),
        _Utils_Tuple2("rightrightarrows", "\u21C9"),
        _Utils_Tuple2("rightsquigarrow", "\u219D"),
        _Utils_Tuple2("RightTeeArrow", "\u21A6"),
        _Utils_Tuple2("RightTee", "\u22A2"),
        _Utils_Tuple2("RightTeeVector", "\u295B"),
        _Utils_Tuple2("rightthreetimes", "\u22CC"),
        _Utils_Tuple2("RightTriangleBar", "\u29D0"),
        _Utils_Tuple2("RightTriangle", "\u22B3"),
        _Utils_Tuple2("RightTriangleEqual", "\u22B5"),
        _Utils_Tuple2("RightUpDownVector", "\u294F"),
        _Utils_Tuple2("RightUpTeeVector", "\u295C"),
        _Utils_Tuple2("RightUpVectorBar", "\u2954"),
        _Utils_Tuple2("RightUpVector", "\u21BE"),
        _Utils_Tuple2("RightVectorBar", "\u2953"),
        _Utils_Tuple2("RightVector", "\u21C0"),
        _Utils_Tuple2("ring", "\u02DA"),
        _Utils_Tuple2("risingdotseq", "\u2253"),
        _Utils_Tuple2("rlarr", "\u21C4"),
        _Utils_Tuple2("rlhar", "\u21CC"),
        _Utils_Tuple2("rlm", "\u200F"),
        _Utils_Tuple2("rmoustache", "\u23B1"),
        _Utils_Tuple2("rmoust", "\u23B1"),
        _Utils_Tuple2("rnmid", "\u2AEE"),
        _Utils_Tuple2("roang", "\u27ED"),
        _Utils_Tuple2("roarr", "\u21FE"),
        _Utils_Tuple2("robrk", "\u27E7"),
        _Utils_Tuple2("ropar", "\u2986"),
        _Utils_Tuple2("ropf", "\uD835\uDD63"),
        _Utils_Tuple2("Ropf", "\u211D"),
        _Utils_Tuple2("roplus", "\u2A2E"),
        _Utils_Tuple2("rotimes", "\u2A35"),
        _Utils_Tuple2("RoundImplies", "\u2970"),
        _Utils_Tuple2("rpar", ")"),
        _Utils_Tuple2("rpargt", "\u2994"),
        _Utils_Tuple2("rppolint", "\u2A12"),
        _Utils_Tuple2("rrarr", "\u21C9"),
        _Utils_Tuple2("Rrightarrow", "\u21DB"),
        _Utils_Tuple2("rsaquo", "\u203A"),
        _Utils_Tuple2("rscr", "\uD835\uDCC7"),
        _Utils_Tuple2("Rscr", "\u211B"),
        _Utils_Tuple2("rsh", "\u21B1"),
        _Utils_Tuple2("Rsh", "\u21B1"),
        _Utils_Tuple2("rsqb", "]"),
        _Utils_Tuple2("rsquo", "\u2019"),
        _Utils_Tuple2("rsquor", "\u2019"),
        _Utils_Tuple2("rthree", "\u22CC"),
        _Utils_Tuple2("rtimes", "\u22CA"),
        _Utils_Tuple2("rtri", "\u25B9"),
        _Utils_Tuple2("rtrie", "\u22B5"),
        _Utils_Tuple2("rtrif", "\u25B8"),
        _Utils_Tuple2("rtriltri", "\u29CE"),
        _Utils_Tuple2("RuleDelayed", "\u29F4"),
        _Utils_Tuple2("ruluhar", "\u2968"),
        _Utils_Tuple2("rx", "\u211E"),
        _Utils_Tuple2("Sacute", "\u015A"),
        _Utils_Tuple2("sacute", "\u015B"),
        _Utils_Tuple2("sbquo", "\u201A"),
        _Utils_Tuple2("scap", "\u2AB8"),
        _Utils_Tuple2("Scaron", "\u0160"),
        _Utils_Tuple2("scaron", "\u0161"),
        _Utils_Tuple2("Sc", "\u2ABC"),
        _Utils_Tuple2("sc", "\u227B"),
        _Utils_Tuple2("sccue", "\u227D"),
        _Utils_Tuple2("sce", "\u2AB0"),
        _Utils_Tuple2("scE", "\u2AB4"),
        _Utils_Tuple2("Scedil", "\u015E"),
        _Utils_Tuple2("scedil", "\u015F"),
        _Utils_Tuple2("Scirc", "\u015C"),
        _Utils_Tuple2("scirc", "\u015D"),
        _Utils_Tuple2("scnap", "\u2ABA"),
        _Utils_Tuple2("scnE", "\u2AB6"),
        _Utils_Tuple2("scnsim", "\u22E9"),
        _Utils_Tuple2("scpolint", "\u2A13"),
        _Utils_Tuple2("scsim", "\u227F"),
        _Utils_Tuple2("Scy", "\u0421"),
        _Utils_Tuple2("scy", "\u0441"),
        _Utils_Tuple2("sdotb", "\u22A1"),
        _Utils_Tuple2("sdot", "\u22C5"),
        _Utils_Tuple2("sdote", "\u2A66"),
        _Utils_Tuple2("searhk", "\u2925"),
        _Utils_Tuple2("searr", "\u2198"),
        _Utils_Tuple2("seArr", "\u21D8"),
        _Utils_Tuple2("searrow", "\u2198"),
        _Utils_Tuple2("sect", "\xa7"),
        _Utils_Tuple2("semi", ";"),
        _Utils_Tuple2("seswar", "\u2929"),
        _Utils_Tuple2("setminus", "\u2216"),
        _Utils_Tuple2("setmn", "\u2216"),
        _Utils_Tuple2("sext", "\u2736"),
        _Utils_Tuple2("Sfr", "\uD835\uDD16"),
        _Utils_Tuple2("sfr", "\uD835\uDD30"),
        _Utils_Tuple2("sfrown", "\u2322"),
        _Utils_Tuple2("sharp", "\u266F"),
        _Utils_Tuple2("SHCHcy", "\u0429"),
        _Utils_Tuple2("shchcy", "\u0449"),
        _Utils_Tuple2("SHcy", "\u0428"),
        _Utils_Tuple2("shcy", "\u0448"),
        _Utils_Tuple2("ShortDownArrow", "\u2193"),
        _Utils_Tuple2("ShortLeftArrow", "\u2190"),
        _Utils_Tuple2("shortmid", "\u2223"),
        _Utils_Tuple2("shortparallel", "\u2225"),
        _Utils_Tuple2("ShortRightArrow", "\u2192"),
        _Utils_Tuple2("ShortUpArrow", "\u2191"),
        _Utils_Tuple2("shy", "\xad"),
        _Utils_Tuple2("Sigma", "\u03A3"),
        _Utils_Tuple2("sigma", "\u03C3"),
        _Utils_Tuple2("sigmaf", "\u03C2"),
        _Utils_Tuple2("sigmav", "\u03C2"),
        _Utils_Tuple2("sim", "\u223C"),
        _Utils_Tuple2("simdot", "\u2A6A"),
        _Utils_Tuple2("sime", "\u2243"),
        _Utils_Tuple2("simeq", "\u2243"),
        _Utils_Tuple2("simg", "\u2A9E"),
        _Utils_Tuple2("simgE", "\u2AA0"),
        _Utils_Tuple2("siml", "\u2A9D"),
        _Utils_Tuple2("simlE", "\u2A9F"),
        _Utils_Tuple2("simne", "\u2246"),
        _Utils_Tuple2("simplus", "\u2A24"),
        _Utils_Tuple2("simrarr", "\u2972"),
        _Utils_Tuple2("slarr", "\u2190"),
        _Utils_Tuple2("SmallCircle", "\u2218"),
        _Utils_Tuple2("smallsetminus", "\u2216"),
        _Utils_Tuple2("smashp", "\u2A33"),
        _Utils_Tuple2("smeparsl", "\u29E4"),
        _Utils_Tuple2("smid", "\u2223"),
        _Utils_Tuple2("smile", "\u2323"),
        _Utils_Tuple2("smt", "\u2AAA"),
        _Utils_Tuple2("smte", "\u2AAC"),
        _Utils_Tuple2("smtes", "\u2AAC\uFE00"),
        _Utils_Tuple2("SOFTcy", "\u042C"),
        _Utils_Tuple2("softcy", "\u044C"),
        _Utils_Tuple2("solbar", "\u233F"),
        _Utils_Tuple2("solb", "\u29C4"),
        _Utils_Tuple2("sol", "/"),
        _Utils_Tuple2("Sopf", "\uD835\uDD4A"),
        _Utils_Tuple2("sopf", "\uD835\uDD64"),
        _Utils_Tuple2("spades", "\u2660"),
        _Utils_Tuple2("spadesuit", "\u2660"),
        _Utils_Tuple2("spar", "\u2225"),
        _Utils_Tuple2("sqcap", "\u2293"),
        _Utils_Tuple2("sqcaps", "\u2293\uFE00"),
        _Utils_Tuple2("sqcup", "\u2294"),
        _Utils_Tuple2("sqcups", "\u2294\uFE00"),
        _Utils_Tuple2("Sqrt", "\u221A"),
        _Utils_Tuple2("sqsub", "\u228F"),
        _Utils_Tuple2("sqsube", "\u2291"),
        _Utils_Tuple2("sqsubset", "\u228F"),
        _Utils_Tuple2("sqsubseteq", "\u2291"),
        _Utils_Tuple2("sqsup", "\u2290"),
        _Utils_Tuple2("sqsupe", "\u2292"),
        _Utils_Tuple2("sqsupset", "\u2290"),
        _Utils_Tuple2("sqsupseteq", "\u2292"),
        _Utils_Tuple2("square", "\u25A1"),
        _Utils_Tuple2("Square", "\u25A1"),
        _Utils_Tuple2("SquareIntersection", "\u2293"),
        _Utils_Tuple2("SquareSubset", "\u228F"),
        _Utils_Tuple2("SquareSubsetEqual", "\u2291"),
        _Utils_Tuple2("SquareSuperset", "\u2290"),
        _Utils_Tuple2("SquareSupersetEqual", "\u2292"),
        _Utils_Tuple2("SquareUnion", "\u2294"),
        _Utils_Tuple2("squarf", "\u25AA"),
        _Utils_Tuple2("squ", "\u25A1"),
        _Utils_Tuple2("squf", "\u25AA"),
        _Utils_Tuple2("srarr", "\u2192"),
        _Utils_Tuple2("Sscr", "\uD835\uDCAE"),
        _Utils_Tuple2("sscr", "\uD835\uDCC8"),
        _Utils_Tuple2("ssetmn", "\u2216"),
        _Utils_Tuple2("ssmile", "\u2323"),
        _Utils_Tuple2("sstarf", "\u22C6"),
        _Utils_Tuple2("Star", "\u22C6"),
        _Utils_Tuple2("star", "\u2606"),
        _Utils_Tuple2("starf", "\u2605"),
        _Utils_Tuple2("straightepsilon", "\u03F5"),
        _Utils_Tuple2("straightphi", "\u03D5"),
        _Utils_Tuple2("strns", "\xaf"),
        _Utils_Tuple2("sub", "\u2282"),
        _Utils_Tuple2("Sub", "\u22D0"),
        _Utils_Tuple2("subdot", "\u2ABD"),
        _Utils_Tuple2("subE", "\u2AC5"),
        _Utils_Tuple2("sube", "\u2286"),
        _Utils_Tuple2("subedot", "\u2AC3"),
        _Utils_Tuple2("submult", "\u2AC1"),
        _Utils_Tuple2("subnE", "\u2ACB"),
        _Utils_Tuple2("subne", "\u228A"),
        _Utils_Tuple2("subplus", "\u2ABF"),
        _Utils_Tuple2("subrarr", "\u2979"),
        _Utils_Tuple2("subset", "\u2282"),
        _Utils_Tuple2("Subset", "\u22D0"),
        _Utils_Tuple2("subseteq", "\u2286"),
        _Utils_Tuple2("subseteqq", "\u2AC5"),
        _Utils_Tuple2("SubsetEqual", "\u2286"),
        _Utils_Tuple2("subsetneq", "\u228A"),
        _Utils_Tuple2("subsetneqq", "\u2ACB"),
        _Utils_Tuple2("subsim", "\u2AC7"),
        _Utils_Tuple2("subsub", "\u2AD5"),
        _Utils_Tuple2("subsup", "\u2AD3"),
        _Utils_Tuple2("succapprox", "\u2AB8"),
        _Utils_Tuple2("succ", "\u227B"),
        _Utils_Tuple2("succcurlyeq", "\u227D"),
        _Utils_Tuple2("Succeeds", "\u227B"),
        _Utils_Tuple2("SucceedsEqual", "\u2AB0"),
        _Utils_Tuple2("SucceedsSlantEqual", "\u227D"),
        _Utils_Tuple2("SucceedsTilde", "\u227F"),
        _Utils_Tuple2("succeq", "\u2AB0"),
        _Utils_Tuple2("succnapprox", "\u2ABA"),
        _Utils_Tuple2("succneqq", "\u2AB6"),
        _Utils_Tuple2("succnsim", "\u22E9"),
        _Utils_Tuple2("succsim", "\u227F"),
        _Utils_Tuple2("SuchThat", "\u220B"),
        _Utils_Tuple2("sum", "\u2211"),
        _Utils_Tuple2("Sum", "\u2211"),
        _Utils_Tuple2("sung", "\u266A"),
        _Utils_Tuple2("sup1", "\xb9"),
        _Utils_Tuple2("sup2", "\xb2"),
        _Utils_Tuple2("sup3", "\xb3"),
        _Utils_Tuple2("sup", "\u2283"),
        _Utils_Tuple2("Sup", "\u22D1"),
        _Utils_Tuple2("supdot", "\u2ABE"),
        _Utils_Tuple2("supdsub", "\u2AD8"),
        _Utils_Tuple2("supE", "\u2AC6"),
        _Utils_Tuple2("supe", "\u2287"),
        _Utils_Tuple2("supedot", "\u2AC4"),
        _Utils_Tuple2("Superset", "\u2283"),
        _Utils_Tuple2("SupersetEqual", "\u2287"),
        _Utils_Tuple2("suphsol", "\u27C9"),
        _Utils_Tuple2("suphsub", "\u2AD7"),
        _Utils_Tuple2("suplarr", "\u297B"),
        _Utils_Tuple2("supmult", "\u2AC2"),
        _Utils_Tuple2("supnE", "\u2ACC"),
        _Utils_Tuple2("supne", "\u228B"),
        _Utils_Tuple2("supplus", "\u2AC0"),
        _Utils_Tuple2("supset", "\u2283"),
        _Utils_Tuple2("Supset", "\u22D1"),
        _Utils_Tuple2("supseteq", "\u2287"),
        _Utils_Tuple2("supseteqq", "\u2AC6"),
        _Utils_Tuple2("supsetneq", "\u228B"),
        _Utils_Tuple2("supsetneqq", "\u2ACC"),
        _Utils_Tuple2("supsim", "\u2AC8"),
        _Utils_Tuple2("supsub", "\u2AD4"),
        _Utils_Tuple2("supsup", "\u2AD6"),
        _Utils_Tuple2("swarhk", "\u2926"),
        _Utils_Tuple2("swarr", "\u2199"),
        _Utils_Tuple2("swArr", "\u21D9"),
        _Utils_Tuple2("swarrow", "\u2199"),
        _Utils_Tuple2("swnwar", "\u292A"),
        _Utils_Tuple2("szlig", "\xdf"),
        _Utils_Tuple2("Tab", "	"),
        _Utils_Tuple2("target", "\u2316"),
        _Utils_Tuple2("Tau", "\u03A4"),
        _Utils_Tuple2("tau", "\u03C4"),
        _Utils_Tuple2("tbrk", "\u23B4"),
        _Utils_Tuple2("Tcaron", "\u0164"),
        _Utils_Tuple2("tcaron", "\u0165"),
        _Utils_Tuple2("Tcedil", "\u0162"),
        _Utils_Tuple2("tcedil", "\u0163"),
        _Utils_Tuple2("Tcy", "\u0422"),
        _Utils_Tuple2("tcy", "\u0442"),
        _Utils_Tuple2("tdot", "\u20DB"),
        _Utils_Tuple2("telrec", "\u2315"),
        _Utils_Tuple2("Tfr", "\uD835\uDD17"),
        _Utils_Tuple2("tfr", "\uD835\uDD31"),
        _Utils_Tuple2("there4", "\u2234"),
        _Utils_Tuple2("therefore", "\u2234"),
        _Utils_Tuple2("Therefore", "\u2234"),
        _Utils_Tuple2("Theta", "\u0398"),
        _Utils_Tuple2("theta", "\u03B8"),
        _Utils_Tuple2("thetasym", "\u03D1"),
        _Utils_Tuple2("thetav", "\u03D1"),
        _Utils_Tuple2("thickapprox", "\u2248"),
        _Utils_Tuple2("thicksim", "\u223C"),
        _Utils_Tuple2("ThickSpace", "\u205F\u200A"),
        _Utils_Tuple2("ThinSpace", "\u2009"),
        _Utils_Tuple2("thinsp", "\u2009"),
        _Utils_Tuple2("thkap", "\u2248"),
        _Utils_Tuple2("thksim", "\u223C"),
        _Utils_Tuple2("THORN", "\xde"),
        _Utils_Tuple2("thorn", "\xfe"),
        _Utils_Tuple2("tilde", "\u02DC"),
        _Utils_Tuple2("Tilde", "\u223C"),
        _Utils_Tuple2("TildeEqual", "\u2243"),
        _Utils_Tuple2("TildeFullEqual", "\u2245"),
        _Utils_Tuple2("TildeTilde", "\u2248"),
        _Utils_Tuple2("timesbar", "\u2A31"),
        _Utils_Tuple2("timesb", "\u22A0"),
        _Utils_Tuple2("times", "\xd7"),
        _Utils_Tuple2("timesd", "\u2A30"),
        _Utils_Tuple2("tint", "\u222D"),
        _Utils_Tuple2("toea", "\u2928"),
        _Utils_Tuple2("topbot", "\u2336"),
        _Utils_Tuple2("topcir", "\u2AF1"),
        _Utils_Tuple2("top", "\u22A4"),
        _Utils_Tuple2("Topf", "\uD835\uDD4B"),
        _Utils_Tuple2("topf", "\uD835\uDD65"),
        _Utils_Tuple2("topfork", "\u2ADA"),
        _Utils_Tuple2("tosa", "\u2929"),
        _Utils_Tuple2("tprime", "\u2034"),
        _Utils_Tuple2("trade", "\u2122"),
        _Utils_Tuple2("TRADE", "\u2122"),
        _Utils_Tuple2("triangle", "\u25B5"),
        _Utils_Tuple2("triangledown", "\u25BF"),
        _Utils_Tuple2("triangleleft", "\u25C3"),
        _Utils_Tuple2("trianglelefteq", "\u22B4"),
        _Utils_Tuple2("triangleq", "\u225C"),
        _Utils_Tuple2("triangleright", "\u25B9"),
        _Utils_Tuple2("trianglerighteq", "\u22B5"),
        _Utils_Tuple2("tridot", "\u25EC"),
        _Utils_Tuple2("trie", "\u225C"),
        _Utils_Tuple2("triminus", "\u2A3A"),
        _Utils_Tuple2("TripleDot", "\u20DB"),
        _Utils_Tuple2("triplus", "\u2A39"),
        _Utils_Tuple2("trisb", "\u29CD"),
        _Utils_Tuple2("tritime", "\u2A3B"),
        _Utils_Tuple2("trpezium", "\u23E2"),
        _Utils_Tuple2("Tscr", "\uD835\uDCAF"),
        _Utils_Tuple2("tscr", "\uD835\uDCC9"),
        _Utils_Tuple2("TScy", "\u0426"),
        _Utils_Tuple2("tscy", "\u0446"),
        _Utils_Tuple2("TSHcy", "\u040B"),
        _Utils_Tuple2("tshcy", "\u045B"),
        _Utils_Tuple2("Tstrok", "\u0166"),
        _Utils_Tuple2("tstrok", "\u0167"),
        _Utils_Tuple2("twixt", "\u226C"),
        _Utils_Tuple2("twoheadleftarrow", "\u219E"),
        _Utils_Tuple2("twoheadrightarrow", "\u21A0"),
        _Utils_Tuple2("Uacute", "\xda"),
        _Utils_Tuple2("uacute", "\xfa"),
        _Utils_Tuple2("uarr", "\u2191"),
        _Utils_Tuple2("Uarr", "\u219F"),
        _Utils_Tuple2("uArr", "\u21D1"),
        _Utils_Tuple2("Uarrocir", "\u2949"),
        _Utils_Tuple2("Ubrcy", "\u040E"),
        _Utils_Tuple2("ubrcy", "\u045E"),
        _Utils_Tuple2("Ubreve", "\u016C"),
        _Utils_Tuple2("ubreve", "\u016D"),
        _Utils_Tuple2("Ucirc", "\xdb"),
        _Utils_Tuple2("ucirc", "\xfb"),
        _Utils_Tuple2("Ucy", "\u0423"),
        _Utils_Tuple2("ucy", "\u0443"),
        _Utils_Tuple2("udarr", "\u21C5"),
        _Utils_Tuple2("Udblac", "\u0170"),
        _Utils_Tuple2("udblac", "\u0171"),
        _Utils_Tuple2("udhar", "\u296E"),
        _Utils_Tuple2("ufisht", "\u297E"),
        _Utils_Tuple2("Ufr", "\uD835\uDD18"),
        _Utils_Tuple2("ufr", "\uD835\uDD32"),
        _Utils_Tuple2("Ugrave", "\xd9"),
        _Utils_Tuple2("ugrave", "\xf9"),
        _Utils_Tuple2("uHar", "\u2963"),
        _Utils_Tuple2("uharl", "\u21BF"),
        _Utils_Tuple2("uharr", "\u21BE"),
        _Utils_Tuple2("uhblk", "\u2580"),
        _Utils_Tuple2("ulcorn", "\u231C"),
        _Utils_Tuple2("ulcorner", "\u231C"),
        _Utils_Tuple2("ulcrop", "\u230F"),
        _Utils_Tuple2("ultri", "\u25F8"),
        _Utils_Tuple2("Umacr", "\u016A"),
        _Utils_Tuple2("umacr", "\u016B"),
        _Utils_Tuple2("uml", "\xa8"),
        _Utils_Tuple2("UnderBar", "_"),
        _Utils_Tuple2("UnderBrace", "\u23DF"),
        _Utils_Tuple2("UnderBracket", "\u23B5"),
        _Utils_Tuple2("UnderParenthesis", "\u23DD"),
        _Utils_Tuple2("Union", "\u22C3"),
        _Utils_Tuple2("UnionPlus", "\u228E"),
        _Utils_Tuple2("Uogon", "\u0172"),
        _Utils_Tuple2("uogon", "\u0173"),
        _Utils_Tuple2("Uopf", "\uD835\uDD4C"),
        _Utils_Tuple2("uopf", "\uD835\uDD66"),
        _Utils_Tuple2("UpArrowBar", "\u2912"),
        _Utils_Tuple2("uparrow", "\u2191"),
        _Utils_Tuple2("UpArrow", "\u2191"),
        _Utils_Tuple2("Uparrow", "\u21D1"),
        _Utils_Tuple2("UpArrowDownArrow", "\u21C5"),
        _Utils_Tuple2("updownarrow", "\u2195"),
        _Utils_Tuple2("UpDownArrow", "\u2195"),
        _Utils_Tuple2("Updownarrow", "\u21D5"),
        _Utils_Tuple2("UpEquilibrium", "\u296E"),
        _Utils_Tuple2("upharpoonleft", "\u21BF"),
        _Utils_Tuple2("upharpoonright", "\u21BE"),
        _Utils_Tuple2("uplus", "\u228E"),
        _Utils_Tuple2("UpperLeftArrow", "\u2196"),
        _Utils_Tuple2("UpperRightArrow", "\u2197"),
        _Utils_Tuple2("upsi", "\u03C5"),
        _Utils_Tuple2("Upsi", "\u03D2"),
        _Utils_Tuple2("upsih", "\u03D2"),
        _Utils_Tuple2("Upsilon", "\u03A5"),
        _Utils_Tuple2("upsilon", "\u03C5"),
        _Utils_Tuple2("UpTeeArrow", "\u21A5"),
        _Utils_Tuple2("UpTee", "\u22A5"),
        _Utils_Tuple2("upuparrows", "\u21C8"),
        _Utils_Tuple2("urcorn", "\u231D"),
        _Utils_Tuple2("urcorner", "\u231D"),
        _Utils_Tuple2("urcrop", "\u230E"),
        _Utils_Tuple2("Uring", "\u016E"),
        _Utils_Tuple2("uring", "\u016F"),
        _Utils_Tuple2("urtri", "\u25F9"),
        _Utils_Tuple2("Uscr", "\uD835\uDCB0"),
        _Utils_Tuple2("uscr", "\uD835\uDCCA"),
        _Utils_Tuple2("utdot", "\u22F0"),
        _Utils_Tuple2("Utilde", "\u0168"),
        _Utils_Tuple2("utilde", "\u0169"),
        _Utils_Tuple2("utri", "\u25B5"),
        _Utils_Tuple2("utrif", "\u25B4"),
        _Utils_Tuple2("uuarr", "\u21C8"),
        _Utils_Tuple2("Uuml", "\xdc"),
        _Utils_Tuple2("uuml", "\xfc"),
        _Utils_Tuple2("uwangle", "\u29A7"),
        _Utils_Tuple2("vangrt", "\u299C"),
        _Utils_Tuple2("varepsilon", "\u03F5"),
        _Utils_Tuple2("varkappa", "\u03F0"),
        _Utils_Tuple2("varnothing", "\u2205"),
        _Utils_Tuple2("varphi", "\u03D5"),
        _Utils_Tuple2("varpi", "\u03D6"),
        _Utils_Tuple2("varpropto", "\u221D"),
        _Utils_Tuple2("varr", "\u2195"),
        _Utils_Tuple2("vArr", "\u21D5"),
        _Utils_Tuple2("varrho", "\u03F1"),
        _Utils_Tuple2("varsigma", "\u03C2"),
        _Utils_Tuple2("varsubsetneq", "\u228A\uFE00"),
        _Utils_Tuple2("varsubsetneqq", "\u2ACB\uFE00"),
        _Utils_Tuple2("varsupsetneq", "\u228B\uFE00"),
        _Utils_Tuple2("varsupsetneqq", "\u2ACC\uFE00"),
        _Utils_Tuple2("vartheta", "\u03D1"),
        _Utils_Tuple2("vartriangleleft", "\u22B2"),
        _Utils_Tuple2("vartriangleright", "\u22B3"),
        _Utils_Tuple2("vBar", "\u2AE8"),
        _Utils_Tuple2("Vbar", "\u2AEB"),
        _Utils_Tuple2("vBarv", "\u2AE9"),
        _Utils_Tuple2("Vcy", "\u0412"),
        _Utils_Tuple2("vcy", "\u0432"),
        _Utils_Tuple2("vdash", "\u22A2"),
        _Utils_Tuple2("vDash", "\u22A8"),
        _Utils_Tuple2("Vdash", "\u22A9"),
        _Utils_Tuple2("VDash", "\u22AB"),
        _Utils_Tuple2("Vdashl", "\u2AE6"),
        _Utils_Tuple2("veebar", "\u22BB"),
        _Utils_Tuple2("vee", "\u2228"),
        _Utils_Tuple2("Vee", "\u22C1"),
        _Utils_Tuple2("veeeq", "\u225A"),
        _Utils_Tuple2("vellip", "\u22EE"),
        _Utils_Tuple2("verbar", "|"),
        _Utils_Tuple2("Verbar", "\u2016"),
        _Utils_Tuple2("vert", "|"),
        _Utils_Tuple2("Vert", "\u2016"),
        _Utils_Tuple2("VerticalBar", "\u2223"),
        _Utils_Tuple2("VerticalLine", "|"),
        _Utils_Tuple2("VerticalSeparator", "\u2758"),
        _Utils_Tuple2("VerticalTilde", "\u2240"),
        _Utils_Tuple2("VeryThinSpace", "\u200A"),
        _Utils_Tuple2("Vfr", "\uD835\uDD19"),
        _Utils_Tuple2("vfr", "\uD835\uDD33"),
        _Utils_Tuple2("vltri", "\u22B2"),
        _Utils_Tuple2("vnsub", "\u2282\u20D2"),
        _Utils_Tuple2("vnsup", "\u2283\u20D2"),
        _Utils_Tuple2("Vopf", "\uD835\uDD4D"),
        _Utils_Tuple2("vopf", "\uD835\uDD67"),
        _Utils_Tuple2("vprop", "\u221D"),
        _Utils_Tuple2("vrtri", "\u22B3"),
        _Utils_Tuple2("Vscr", "\uD835\uDCB1"),
        _Utils_Tuple2("vscr", "\uD835\uDCCB"),
        _Utils_Tuple2("vsubnE", "\u2ACB\uFE00"),
        _Utils_Tuple2("vsubne", "\u228A\uFE00"),
        _Utils_Tuple2("vsupnE", "\u2ACC\uFE00"),
        _Utils_Tuple2("vsupne", "\u228B\uFE00"),
        _Utils_Tuple2("Vvdash", "\u22AA"),
        _Utils_Tuple2("vzigzag", "\u299A"),
        _Utils_Tuple2("Wcirc", "\u0174"),
        _Utils_Tuple2("wcirc", "\u0175"),
        _Utils_Tuple2("wedbar", "\u2A5F"),
        _Utils_Tuple2("wedge", "\u2227"),
        _Utils_Tuple2("Wedge", "\u22C0"),
        _Utils_Tuple2("wedgeq", "\u2259"),
        _Utils_Tuple2("weierp", "\u2118"),
        _Utils_Tuple2("Wfr", "\uD835\uDD1A"),
        _Utils_Tuple2("wfr", "\uD835\uDD34"),
        _Utils_Tuple2("Wopf", "\uD835\uDD4E"),
        _Utils_Tuple2("wopf", "\uD835\uDD68"),
        _Utils_Tuple2("wp", "\u2118"),
        _Utils_Tuple2("wr", "\u2240"),
        _Utils_Tuple2("wreath", "\u2240"),
        _Utils_Tuple2("Wscr", "\uD835\uDCB2"),
        _Utils_Tuple2("wscr", "\uD835\uDCCC"),
        _Utils_Tuple2("xcap", "\u22C2"),
        _Utils_Tuple2("xcirc", "\u25EF"),
        _Utils_Tuple2("xcup", "\u22C3"),
        _Utils_Tuple2("xdtri", "\u25BD"),
        _Utils_Tuple2("Xfr", "\uD835\uDD1B"),
        _Utils_Tuple2("xfr", "\uD835\uDD35"),
        _Utils_Tuple2("xharr", "\u27F7"),
        _Utils_Tuple2("xhArr", "\u27FA"),
        _Utils_Tuple2("Xi", "\u039E"),
        _Utils_Tuple2("xi", "\u03BE"),
        _Utils_Tuple2("xlarr", "\u27F5"),
        _Utils_Tuple2("xlArr", "\u27F8"),
        _Utils_Tuple2("xmap", "\u27FC"),
        _Utils_Tuple2("xnis", "\u22FB"),
        _Utils_Tuple2("xodot", "\u2A00"),
        _Utils_Tuple2("Xopf", "\uD835\uDD4F"),
        _Utils_Tuple2("xopf", "\uD835\uDD69"),
        _Utils_Tuple2("xoplus", "\u2A01"),
        _Utils_Tuple2("xotime", "\u2A02"),
        _Utils_Tuple2("xrarr", "\u27F6"),
        _Utils_Tuple2("xrArr", "\u27F9"),
        _Utils_Tuple2("Xscr", "\uD835\uDCB3"),
        _Utils_Tuple2("xscr", "\uD835\uDCCD"),
        _Utils_Tuple2("xsqcup", "\u2A06"),
        _Utils_Tuple2("xuplus", "\u2A04"),
        _Utils_Tuple2("xutri", "\u25B3"),
        _Utils_Tuple2("xvee", "\u22C1"),
        _Utils_Tuple2("xwedge", "\u22C0"),
        _Utils_Tuple2("Yacute", "\xdd"),
        _Utils_Tuple2("yacute", "\xfd"),
        _Utils_Tuple2("YAcy", "\u042F"),
        _Utils_Tuple2("yacy", "\u044F"),
        _Utils_Tuple2("Ycirc", "\u0176"),
        _Utils_Tuple2("ycirc", "\u0177"),
        _Utils_Tuple2("Ycy", "\u042B"),
        _Utils_Tuple2("ycy", "\u044B"),
        _Utils_Tuple2("yen", "\xa5"),
        _Utils_Tuple2("Yfr", "\uD835\uDD1C"),
        _Utils_Tuple2("yfr", "\uD835\uDD36"),
        _Utils_Tuple2("YIcy", "\u0407"),
        _Utils_Tuple2("yicy", "\u0457"),
        _Utils_Tuple2("Yopf", "\uD835\uDD50"),
        _Utils_Tuple2("yopf", "\uD835\uDD6A"),
        _Utils_Tuple2("Yscr", "\uD835\uDCB4"),
        _Utils_Tuple2("yscr", "\uD835\uDCCE"),
        _Utils_Tuple2("YUcy", "\u042E"),
        _Utils_Tuple2("yucy", "\u044E"),
        _Utils_Tuple2("yuml", "\xff"),
        _Utils_Tuple2("Yuml", "\u0178"),
        _Utils_Tuple2("Zacute", "\u0179"),
        _Utils_Tuple2("zacute", "\u017A"),
        _Utils_Tuple2("Zcaron", "\u017D"),
        _Utils_Tuple2("zcaron", "\u017E"),
        _Utils_Tuple2("Zcy", "\u0417"),
        _Utils_Tuple2("zcy", "\u0437"),
        _Utils_Tuple2("Zdot", "\u017B"),
        _Utils_Tuple2("zdot", "\u017C"),
        _Utils_Tuple2("zeetrf", "\u2128"),
        _Utils_Tuple2("ZeroWidthSpace", "\u200B"),
        _Utils_Tuple2("Zeta", "\u0396"),
        _Utils_Tuple2("zeta", "\u03B6"),
        _Utils_Tuple2("zfr", "\uD835\uDD37"),
        _Utils_Tuple2("Zfr", "\u2128"),
        _Utils_Tuple2("ZHcy", "\u0416"),
        _Utils_Tuple2("zhcy", "\u0436"),
        _Utils_Tuple2("zigrarr", "\u21DD"),
        _Utils_Tuple2("zopf", "\uD835\uDD6B"),
        _Utils_Tuple2("Zopf", "\u2124"),
        _Utils_Tuple2("Zscr", "\uD835\uDCB5"),
        _Utils_Tuple2("zscr", "\uD835\uDCCF"),
        _Utils_Tuple2("zwj", "\u200D"),
        _Utils_Tuple2("zwnj", "\u200C")
    ]));
    var $hecrj$html_parser$Html$Parser$namedCharacterReference = A2($elm$parser$Parser$map, function(reference) {
        return A2($elm$core$Maybe$withDefault, "&" + (reference + ";"), A2($elm$core$Dict$get, reference, $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict));
    }, $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isAlpha)));
    var $elm$core$String$cons = _String_cons;
    var $elm$core$String$fromChar = function(_char) {
        return A2($elm$core$String$cons, _char, "");
    };
    var $elm$core$Char$fromCode = _Char_fromCode;
    var $elm$core$Basics$pow = _Basics_pow;
    var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(function(position, chars, accumulated) {
        fromStringHelp: while(true){
            if (!chars.b) return $elm$core$Result$Ok(accumulated);
            else {
                var _char = chars.a;
                var rest = chars.b;
                switch(_char.valueOf()){
                    case "0":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated;
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "1":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "2":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 2 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "3":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 3 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "4":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 4 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "5":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 5 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "6":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 6 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "7":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 7 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "8":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 8 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "9":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 9 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "a":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 10 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "b":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 11 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "c":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 12 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "d":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 13 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "e":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 14 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case "f":
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 15 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    default:
                        var nonHex = _char;
                        return $elm$core$Result$Err($elm$core$String$fromChar(nonHex) + " is not a valid hexadecimal character.");
                }
            }
        }
    });
    var $elm$core$Result$map = F2(function(func, ra) {
        if (ra.$ === "Ok") {
            var a = ra.a;
            return $elm$core$Result$Ok(func(a));
        } else {
            var e = ra.a;
            return $elm$core$Result$Err(e);
        }
    });
    var $elm$core$Result$mapError = F2(function(f, result) {
        if (result.$ === "Ok") {
            var v = result.a;
            return $elm$core$Result$Ok(v);
        } else {
            var e = result.a;
            return $elm$core$Result$Err(f(e));
        }
    });
    var $elm$core$List$tail = function(list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return $elm$core$Maybe$Just(xs);
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$core$String$foldr = _String_foldr;
    var $elm$core$String$toList = function(string) {
        return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
    };
    var $rtfeldman$elm_hex$Hex$fromString = function(str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Result$Err("Empty strings are not valid hexadecimal strings.");
        else {
            var result = function() {
                if (A2($elm$core$String$startsWith, "-", str)) {
                    var list = A2($elm$core$Maybe$withDefault, _List_Nil, $elm$core$List$tail($elm$core$String$toList(str)));
                    return A2($elm$core$Result$map, $elm$core$Basics$negate, A3($rtfeldman$elm_hex$Hex$fromStringHelp, $elm$core$List$length(list) - 1, list, 0));
                } else return A3($rtfeldman$elm_hex$Hex$fromStringHelp, $elm$core$String$length(str) - 1, $elm$core$String$toList(str), 0);
            }();
            var formatError = function(err) {
                return A2($elm$core$String$join, " ", _List_fromArray([
                    '"' + (str + '"'),
                    "is not a valid hexadecimal string because",
                    err
                ]));
            };
            return A2($elm$core$Result$mapError, formatError, result);
        }
    };
    var $elm$core$Char$isHexDigit = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return 48 <= code && code <= 57 || 65 <= code && code <= 70 || 97 <= code && code <= 102;
    };
    var $hecrj$html_parser$Html$Parser$hexadecimal = A2($elm$parser$Parser$andThen, function(hex) {
        var _v0 = $rtfeldman$elm_hex$Hex$fromString($elm$core$String$toLower(hex));
        if (_v0.$ === "Ok") {
            var value = _v0.a;
            return $elm$parser$Parser$succeed(value);
        } else {
            var error = _v0.a;
            return $elm$parser$Parser$problem(error);
        }
    }, $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isHexDigit)));
    var $elm$parser$Parser$ExpectingInt = {
        $: "ExpectingInt"
    };
    var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
    var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
    var $elm$parser$Parser$Advanced$bumpOffset = F2(function(newOffset, s) {
        return {
            col: s.col + (newOffset - s.offset),
            context: s.context,
            indent: s.indent,
            offset: newOffset,
            row: s.row,
            src: s.src
        };
    });
    var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
    var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
    var $elm$parser$Parser$Advanced$consumeExp = F2(function(offset, src) {
        if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
            var eOffset = offset + 1;
            var expOffset = A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src) ? eOffset + 1 : eOffset;
            var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
            return _Utils_eq(expOffset, newOffset) ? -newOffset : newOffset;
        } else return offset;
    });
    var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(function(offset, src) {
        return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2($elm$parser$Parser$Advanced$consumeExp, A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src), src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
    });
    var $elm$parser$Parser$Advanced$finalizeInt = F5(function(invalid, handler, startOffset, _v0, s) {
        var endOffset = _v0.a;
        var n = _v0.b;
        if (handler.$ === "Err") {
            var x = handler.a;
            return A2($elm$parser$Parser$Advanced$Bad, true, A2($elm$parser$Parser$Advanced$fromState, s, x));
        } else {
            var toValue = handler.a;
            return _Utils_eq(startOffset, endOffset) ? A2($elm$parser$Parser$Advanced$Bad, _Utils_cmp(s.offset, startOffset) < 0, A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3($elm$parser$Parser$Advanced$Good, true, toValue(n), A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
        }
    });
    var $elm$core$String$toFloat = _String_toFloat;
    var $elm$parser$Parser$Advanced$finalizeFloat = F6(function(invalid, expecting, intSettings, floatSettings, intPair, s) {
        var intOffset = intPair.a;
        var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.src);
        if (floatOffset < 0) return A2($elm$parser$Parser$Advanced$Bad, true, A4($elm$parser$Parser$Advanced$fromInfo, s.row, s.col - (floatOffset + s.offset), invalid, s.context));
        else {
            if (_Utils_eq(s.offset, floatOffset)) return A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, expecting));
            else {
                if (_Utils_eq(intOffset, floatOffset)) return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.offset, intPair, s);
                else if (floatSettings.$ === "Err") {
                    var x = floatSettings.a;
                    return A2($elm$parser$Parser$Advanced$Bad, true, A2($elm$parser$Parser$Advanced$fromState, s, invalid));
                } else {
                    var toValue = floatSettings.a;
                    var _v1 = $elm$core$String$toFloat(A3($elm$core$String$slice, s.offset, floatOffset, s.src));
                    if (_v1.$ === "Nothing") return A2($elm$parser$Parser$Advanced$Bad, true, A2($elm$parser$Parser$Advanced$fromState, s, invalid));
                    else {
                        var n = _v1.a;
                        return A3($elm$parser$Parser$Advanced$Good, true, toValue(n), A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
                    }
                }
            }
        }
    });
    var $elm$parser$Parser$Advanced$number = function(c) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.offset, s.src)) {
                var zeroOffset = s.offset + 1;
                var baseOffset = zeroOffset + 1;
                return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.src) ? A5($elm$parser$Parser$Advanced$finalizeInt, c.invalid, c.hex, baseOffset, A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.src), s) : A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.src) ? A5($elm$parser$Parser$Advanced$finalizeInt, c.invalid, c.octal, baseOffset, A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.src), s) : A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.src) ? A5($elm$parser$Parser$Advanced$finalizeInt, c.invalid, c.binary, baseOffset, A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.src), s) : A6($elm$parser$Parser$Advanced$finalizeFloat, c.invalid, c.expecting, c._int, c._float, _Utils_Tuple2(zeroOffset, 0), s);
            } else return A6($elm$parser$Parser$Advanced$finalizeFloat, c.invalid, c.expecting, c._int, c._float, A3($elm$parser$Parser$Advanced$consumeBase, 10, s.offset, s.src), s);
        });
    };
    var $elm$parser$Parser$Advanced$int = F2(function(expecting, invalid) {
        return $elm$parser$Parser$Advanced$number({
            binary: $elm$core$Result$Err(invalid),
            expecting: expecting,
            _float: $elm$core$Result$Err(invalid),
            hex: $elm$core$Result$Err(invalid),
            _int: $elm$core$Result$Ok($elm$core$Basics$identity),
            invalid: invalid,
            octal: $elm$core$Result$Err(invalid)
        });
    });
    var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
    var $hecrj$html_parser$Html$Parser$numericCharacterReference = function() {
        var codepoint = $elm$parser$Parser$oneOf(_List_fromArray([
            A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompIf(function(c) {
                return _Utils_eq(c, _Utils_chr("x")) || _Utils_eq(c, _Utils_chr("X"));
            })), $hecrj$html_parser$Html$Parser$hexadecimal),
            A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompWhile($elm$core$Basics$eq(_Utils_chr("0")))), $elm$parser$Parser$int)
        ]));
        return A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("#")))), A2($elm$parser$Parser$map, A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar), codepoint));
    }();
    var $hecrj$html_parser$Html$Parser$characterReference = A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("&")))), $elm$parser$Parser$oneOf(_List_fromArray([
        A2($elm$parser$Parser$ignorer, $elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$namedCharacterReference), $hecrj$html_parser$Html$Parser$chompSemicolon),
        A2($elm$parser$Parser$ignorer, $elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$numericCharacterReference), $hecrj$html_parser$Html$Parser$chompSemicolon),
        $elm$parser$Parser$succeed("&")
    ])));
    var $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue = function(quote) {
        var isQuotedValueChar = function(c) {
            return !_Utils_eq(c, quote) && !_Utils_eq(c, _Utils_chr("&"));
        };
        return A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompIf($elm$core$Basics$eq(quote))), A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$map, $elm$core$String$join(""), $hecrj$html_parser$Html$Parser$many($elm$parser$Parser$oneOf(_List_fromArray([
            $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore(isQuotedValueChar)),
            $hecrj$html_parser$Html$Parser$characterReference
        ])))), $elm$parser$Parser$chompIf($elm$core$Basics$eq(quote))));
    };
    var $elm$core$List$isEmpty = function(xs) {
        if (!xs.b) return true;
        else return false;
    };
    var $hecrj$html_parser$Html$Parser$oneOrMore = F2(function(type_, parser_) {
        return A2($elm$parser$Parser$loop, _List_Nil, function(list) {
            return $elm$parser$Parser$oneOf(_List_fromArray([
                A2($elm$parser$Parser$map, function(_new) {
                    return $elm$parser$Parser$Loop(A2($elm$core$List$cons, _new, list));
                }, parser_),
                $elm$core$List$isEmpty(list) ? $elm$parser$Parser$problem("expecting at least one " + type_) : $elm$parser$Parser$succeed($elm$parser$Parser$Done($elm$core$List$reverse(list)))
            ]));
        });
    });
    var $hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue = function() {
        var isUnquotedValueChar = function(c) {
            return !$hecrj$html_parser$Html$Parser$isSpaceCharacter(c) && !_Utils_eq(c, _Utils_chr('"')) && !_Utils_eq(c, _Utils_chr("'")) && !_Utils_eq(c, _Utils_chr("=")) && !_Utils_eq(c, _Utils_chr("<")) && !_Utils_eq(c, _Utils_chr(">")) && !_Utils_eq(c, _Utils_chr("`")) && !_Utils_eq(c, _Utils_chr("&"));
        };
        return A2($elm$parser$Parser$map, $elm$core$String$join(""), A2($hecrj$html_parser$Html$Parser$oneOrMore, "attribute value", $elm$parser$Parser$oneOf(_List_fromArray([
            $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore(isUnquotedValueChar)),
            $hecrj$html_parser$Html$Parser$characterReference
        ]))));
    }();
    var $hecrj$html_parser$Html$Parser$tagAttributeValue = $elm$parser$Parser$oneOf(_List_fromArray([
        A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("=")))), $elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)), $elm$parser$Parser$oneOf(_List_fromArray([
            $hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue,
            $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue(_Utils_chr('"')),
            $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue(_Utils_chr("'"))
        ]))),
        $elm$parser$Parser$succeed("")
    ]));
    var $hecrj$html_parser$Html$Parser$tagAttribute = A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$keeper, $elm$parser$Parser$succeed($elm$core$Tuple$pair), A2($elm$parser$Parser$ignorer, $hecrj$html_parser$Html$Parser$tagAttributeName, $elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))), A2($elm$parser$Parser$ignorer, $hecrj$html_parser$Html$Parser$tagAttributeValue, $elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)));
    var $hecrj$html_parser$Html$Parser$tagAttributes = $hecrj$html_parser$Html$Parser$many($hecrj$html_parser$Html$Parser$tagAttribute);
    var $hecrj$html_parser$Html$Parser$tagName = A2($elm$parser$Parser$map, $elm$core$String$toLower, $elm$parser$Parser$getChompedString(A2($elm$parser$Parser$ignorer, $elm$parser$Parser$chompIf($elm$core$Char$isAlphaNum), $elm$parser$Parser$chompWhile(function(c) {
        return $elm$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr("-"));
    }))));
    var $hecrj$html_parser$Html$Parser$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $hecrj$html_parser$Html$Parser$text = A2($elm$parser$Parser$map, A2($elm$core$Basics$composeR, $elm$core$String$join(""), $hecrj$html_parser$Html$Parser$Text), A2($hecrj$html_parser$Html$Parser$oneOrMore, "text element", $elm$parser$Parser$oneOf(_List_fromArray([
        $elm$parser$Parser$getChompedString($hecrj$html_parser$Html$Parser$chompOneOrMore(function(c) {
            return !_Utils_eq(c, _Utils_chr("<")) && !_Utils_eq(c, _Utils_chr("&"));
        })),
        $hecrj$html_parser$Html$Parser$characterReference
    ]))));
    function $hecrj$html_parser$Html$Parser$cyclic$node() {
        return $elm$parser$Parser$oneOf(_List_fromArray([
            $hecrj$html_parser$Html$Parser$text,
            $hecrj$html_parser$Html$Parser$comment,
            $hecrj$html_parser$Html$Parser$cyclic$element()
        ]));
    }
    function $hecrj$html_parser$Html$Parser$cyclic$element() {
        return A2($elm$parser$Parser$andThen, function(_v0) {
            var name = _v0.a;
            var attributes = _v0.b;
            return $hecrj$html_parser$Html$Parser$isVoidElement(name) ? A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed(A3($hecrj$html_parser$Html$Parser$Element, name, attributes, _List_Nil)), $elm$parser$Parser$oneOf(_List_fromArray([
                $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("/"))),
                $elm$parser$Parser$succeed(_Utils_Tuple0)
            ]))), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr(">")))) : A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed(A2($hecrj$html_parser$Html$Parser$Element, name, attributes)), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr(">")))), A2($elm$parser$Parser$ignorer, $hecrj$html_parser$Html$Parser$many($elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$cyclic$node())), $hecrj$html_parser$Html$Parser$closingTag(name)));
        }, A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Tuple$pair), $elm$parser$Parser$chompIf($elm$core$Basics$eq(_Utils_chr("<")))), A2($elm$parser$Parser$ignorer, $hecrj$html_parser$Html$Parser$tagName, $elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))), $hecrj$html_parser$Html$Parser$tagAttributes));
    }
    try {
        var $hecrj$html_parser$Html$Parser$node = $hecrj$html_parser$Html$Parser$cyclic$node();
        $hecrj$html_parser$Html$Parser$cyclic$node = function() {
            return $hecrj$html_parser$Html$Parser$node;
        };
        var $hecrj$html_parser$Html$Parser$element = $hecrj$html_parser$Html$Parser$cyclic$element();
        $hecrj$html_parser$Html$Parser$cyclic$element = function() {
            return $hecrj$html_parser$Html$Parser$element;
        };
    } catch ($) {
        throw "Some top-level definitions from `Html.Parser` are causing infinite recursion:\n\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2510\n  \u2502    node\n  \u2502     \u2193\n  \u2502    element\n  \u2514\u2500\u2500\u2500\u2500\u2500\u2518\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!";
    }
    var $elm$parser$Parser$DeadEnd = F3(function(row, col, problem) {
        return {
            col: col,
            problem: problem,
            row: row
        };
    });
    var $elm$parser$Parser$problemToDeadEnd = function(p) {
        return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
    };
    var $elm$parser$Parser$Advanced$bagToList = F2(function(bag, list) {
        bagToList: while(true)switch(bag.$){
            case "Empty":
                return list;
            case "AddRight":
                var bag1 = bag.a;
                var x = bag.b;
                var $temp$bag = bag1, $temp$list = A2($elm$core$List$cons, x, list);
                bag = $temp$bag;
                list = $temp$list;
                continue bagToList;
            default:
                var bag1 = bag.a;
                var bag2 = bag.b;
                var $temp$bag = bag1, $temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
                bag = $temp$bag;
                list = $temp$list;
                continue bagToList;
        }
    });
    var $elm$parser$Parser$Advanced$run = F2(function(_v0, src) {
        var parse = _v0.a;
        var _v1 = parse({
            col: 1,
            context: _List_Nil,
            indent: 1,
            offset: 0,
            row: 1,
            src: src
        });
        if (_v1.$ === "Good") {
            var value = _v1.b;
            return $elm$core$Result$Ok(value);
        } else {
            var bag = _v1.b;
            return $elm$core$Result$Err(A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
        }
    });
    var $elm$parser$Parser$run = F2(function(parser, source) {
        var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
        if (_v0.$ === "Ok") {
            var a = _v0.a;
            return $elm$core$Result$Ok(a);
        } else {
            var problems = _v0.a;
            return $elm$core$Result$Err(A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
        }
    });
    var $hecrj$html_parser$Html$Parser$run = function(str) {
        return $elm$core$String$isEmpty(str) ? $elm$core$Result$Ok(_List_Nil) : A2($elm$parser$Parser$run, A2($hecrj$html_parser$Html$Parser$oneOrMore, "node", $hecrj$html_parser$Html$Parser$node), str);
    };
    var $author$project$Message$FormattedText$decodeTextHtml = A2($elm$json$Json$Decode$andThen, function(html) {
        if (html.$ === "Err") return $author$project$Message$FormattedText$decodeTextPlain;
        else {
            var nodes = html.a;
            return $elm$json$Json$Decode$succeed($author$project$Message$FormattedText$Html(nodes));
        }
    }, A2($elm$json$Json$Decode$map, $hecrj$html_parser$Html$Parser$run, A2($elm$json$Json$Decode$field, "formatted_body", $elm$json$Json$Decode$string)));
    var $author$project$Message$FormattedText$decodeFormattedText = A2($elm$json$Json$Decode$andThen, function(f) {
        if (f.$ === "Just" && f.a === "org.matrix.custom.html") return $author$project$Message$FormattedText$decodeTextHtml;
        else return $author$project$Message$FormattedText$decodeTextPlain;
    }, $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "format", $elm$json$Json$Decode$string)));
    var $author$project$Message$Image$ImageData = F3(function(body, url, info) {
        return {
            body: body,
            info: info,
            url: url
        };
    });
    var $author$project$Message$Image$decodeThumbnailInfo = A3($elm$json$Json$Decode$map2, F2(function(w, h) {
        return {
            h: h,
            w: w
        };
    }), A2($elm$json$Json$Decode$field, "w", $elm$json$Json$Decode$int), A2($elm$json$Json$Decode$field, "h", $elm$json$Json$Decode$int));
    var $elm$json$Json$Decode$map4 = _Json_map4;
    var $author$project$Message$Image$decodeImageInfo = A5($elm$json$Json$Decode$map4, F4(function(w, h, tnurl, tninfo) {
        return {
            h: h,
            thumbnail_info: tninfo,
            thumbnail_url: tnurl,
            w: w
        };
    }), A2($elm$json$Json$Decode$field, "w", $elm$json$Json$Decode$int), A2($elm$json$Json$Decode$field, "h", $elm$json$Json$Decode$int), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "thumbnail_url", $elm$json$Json$Decode$string)), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "thumbnail_info", $author$project$Message$Image$decodeThumbnailInfo)));
    var $author$project$Message$Image$decodeImage = A4($elm$json$Json$Decode$map3, $author$project$Message$Image$ImageData, A2($elm$json$Json$Decode$field, "body", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "url", $elm$json$Json$Decode$string), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "info", $author$project$Message$Image$decodeImageInfo)));
    var $author$project$Message$Video$VideoData = F2(function(body, url) {
        return {
            body: body,
            url: url
        };
    });
    var $author$project$Message$Video$decodeVideo = A3($elm$json$Json$Decode$map2, $author$project$Message$Video$VideoData, A2($elm$json$Json$Decode$field, "body", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "url", $elm$json$Json$Decode$string));
    var $author$project$Message$decodeMessage = A2($elm$json$Json$Decode$andThen, function(mt) {
        switch(mt){
            case "m.text":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Text, $author$project$Message$FormattedText$decodeFormattedText);
            case "m.emote":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Emote, $author$project$Message$FormattedText$decodeFormattedText);
            case "m.notice":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Notice, $author$project$Message$FormattedText$decodeFormattedText);
            case "m.image":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Image, $author$project$Message$Image$decodeImage);
            case "m.file":
                return A2($elm$json$Json$Decode$map, $author$project$Message$File, $author$project$Message$File$decodeFile);
            case "m.audio":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Audio, $author$project$Message$Audio$decodeAudio);
            case "m.video":
                return A2($elm$json$Json$Decode$map, $author$project$Message$Video, $author$project$Message$Video$decodeVideo);
            default:
                return $elm$json$Json$Decode$fail("Unsupported msgtype: " + mt);
        }
    }, A2($elm$json$Json$Decode$field, "msgtype", $elm$json$Json$Decode$string));
    var $elm$time$Time$Posix = function(a) {
        return {
            $: "Posix",
            a: a
        };
    };
    var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
    var $author$project$UserId$UserId = F2(function(a, b) {
        return {
            $: "UserId",
            a: a,
            b: b
        };
    });
    var $elm$core$Set$Set_elm_builtin = function(a) {
        return {
            $: "Set_elm_builtin",
            a: a
        };
    };
    var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
    var $elm$parser$Parser$ExpectingEnd = {
        $: "ExpectingEnd"
    };
    var $elm$parser$Parser$Advanced$end = function(x) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            return _Utils_eq($elm$core$String$length(s.src), s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, x));
        });
    };
    var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
    var $author$project$UserId$validLocalpartChar = function(c) {
        return $elm$core$Char$isLower(c) || $elm$core$Char$isDigit(c) || A2($elm$core$List$member, c, _List_fromArray([
            _Utils_chr("-"),
            _Utils_chr("."),
            _Utils_chr("="),
            _Utils_chr("_"),
            _Utils_chr("/")
        ]));
    };
    var $author$project$UserId$validServernameChar = function(c) {
        return $elm$core$Char$isAlphaNum(c) || A2($elm$core$List$member, c, _List_fromArray([
            _Utils_chr("."),
            _Utils_chr("-"),
            _Utils_chr(":")
        ]));
    };
    var $elm$parser$Parser$ExpectingVariable = {
        $: "ExpectingVariable"
    };
    var $elm$core$Dict$member = F2(function(key, dict) {
        var _v0 = A2($elm$core$Dict$get, key, dict);
        if (_v0.$ === "Just") return true;
        else return false;
    });
    var $elm$core$Set$member = F2(function(key, _v0) {
        var dict = _v0.a;
        return A2($elm$core$Dict$member, key, dict);
    });
    var $elm$parser$Parser$Advanced$varHelp = F7(function(isGood, offset, row, col, src, indent, context) {
        varHelp: while(true){
            var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
            if (_Utils_eq(newOffset, -1)) return {
                col: col,
                context: context,
                indent: indent,
                offset: offset,
                row: row,
                src: src
            };
            else if (_Utils_eq(newOffset, -2)) {
                var $temp$isGood = isGood, $temp$offset = offset + 1, $temp$row = row + 1, $temp$col = 1, $temp$src = src, $temp$indent = indent, $temp$context = context;
                isGood = $temp$isGood;
                offset = $temp$offset;
                row = $temp$row;
                col = $temp$col;
                src = $temp$src;
                indent = $temp$indent;
                context = $temp$context;
                continue varHelp;
            } else {
                var $temp$isGood = isGood, $temp$offset = newOffset, $temp$row = row, $temp$col = col + 1, $temp$src = src, $temp$indent = indent, $temp$context = context;
                isGood = $temp$isGood;
                offset = $temp$offset;
                row = $temp$row;
                col = $temp$col;
                src = $temp$src;
                indent = $temp$indent;
                context = $temp$context;
                continue varHelp;
            }
        }
    });
    var $elm$parser$Parser$Advanced$variable = function(i) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
            if (_Utils_eq(firstOffset, -1)) return A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, i.expecting));
            else {
                var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : A7($elm$parser$Parser$Advanced$varHelp, i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
                var name = A3($elm$core$String$slice, s.offset, s1.offset, s.src);
                return A2($elm$core$Set$member, name, i.reserved) ? A2($elm$parser$Parser$Advanced$Bad, false, A2($elm$parser$Parser$Advanced$fromState, s, i.expecting)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
            }
        });
    };
    var $elm$parser$Parser$variable = function(i) {
        return $elm$parser$Parser$Advanced$variable({
            expecting: $elm$parser$Parser$ExpectingVariable,
            inner: i.inner,
            reserved: i.reserved,
            start: i.start
        });
    };
    var $author$project$UserId$userIdParser = A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($author$project$UserId$UserId), $elm$parser$Parser$token("@")), A2($elm$parser$Parser$ignorer, $elm$parser$Parser$variable({
        inner: $author$project$UserId$validLocalpartChar,
        reserved: $elm$core$Set$empty,
        start: $author$project$UserId$validLocalpartChar
    }), $elm$parser$Parser$token(":"))), A2($elm$parser$Parser$ignorer, $elm$parser$Parser$variable({
        inner: $author$project$UserId$validServernameChar,
        reserved: $elm$core$Set$empty,
        start: $author$project$UserId$validServernameChar
    }), $elm$parser$Parser$end));
    var $author$project$UserId$parseUserId = A2($elm$core$Basics$composeR, $elm$core$String$toLower, A2($elm$core$Basics$composeR, $elm$parser$Parser$run($author$project$UserId$userIdParser), $elm$core$Result$mapError(function(_v0) {
        return "Must follow format: @user:example.com";
    })));
    var $author$project$UserId$toUserIdDecoder = $elm$json$Json$Decode$andThen(function(s) {
        var _v0 = $author$project$UserId$parseUserId(s);
        if (_v0.$ === "Ok") {
            var userid = _v0.a;
            return $elm$json$Json$Decode$succeed(userid);
        } else {
            var e = _v0.a;
            return $elm$json$Json$Decode$fail(e);
        }
    });
    var $author$project$Event$makeRoomEvent = F2(function(constructor, contentDecoder) {
        return A5($elm$json$Json$Decode$map4, constructor, A2($elm$json$Json$Decode$field, "type", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "content", contentDecoder), $author$project$UserId$toUserIdDecoder(A2($elm$json$Json$Decode$field, "sender", $elm$json$Json$Decode$string)), A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, A2($elm$json$Json$Decode$field, "origin_server_ts", $elm$json$Json$Decode$int)));
    });
    var $author$project$Event$decodeRoomEvent = $elm$json$Json$Decode$oneOf(_List_fromArray([
        A2($elm$json$Json$Decode$andThen, function(eventType) {
            switch(eventType){
                case "m.room.message":
                    return A2($author$project$Event$makeRoomEvent, F4(function(t, msg, s, ots) {
                        return $author$project$Event$MessageEvent({
                            content: msg,
                            eventType: t,
                            originServerTs: ots,
                            sender: s
                        });
                    }), $author$project$Message$decodeMessage);
                case "m.room.member":
                    return A2($elm$json$Json$Decode$andThen, function(uid) {
                        return A2($author$project$Event$makeRoomEvent, F4(function(t, mdata, s, ots) {
                            return A2($author$project$Event$MemberEvent, uid, {
                                content: mdata,
                                eventType: t,
                                originServerTs: ots,
                                sender: s
                            });
                        }), $author$project$Member$decodeMember);
                    }, A2($elm$json$Json$Decode$andThen, A2($elm$core$Basics$composeR, $author$project$UserId$parseUserId, A2($elm$core$Basics$composeR, $elm$core$Result$map($elm$json$Json$Decode$succeed), $elm$core$Result$withDefault($elm$json$Json$Decode$fail("Invalid userid in m.room.member state_key.")))), A2($elm$json$Json$Decode$field, "state_key", $elm$json$Json$Decode$string)));
                default:
                    return $elm$json$Json$Decode$fail("Unsupported event type: " + eventType);
            }
        }, A2($elm$json$Json$Decode$field, "type", $elm$json$Json$Decode$string)),
        A2($author$project$Event$makeRoomEvent, F4(function(t, msg, s, ots) {
            return $author$project$Event$UnsupportedEvent({
                content: msg,
                eventType: t,
                originServerTs: ots,
                sender: s
            });
        }), $elm$json$Json$Decode$succeed(_Utils_Tuple0))
    ]));
    var $elm$json$Json$Decode$list = _Json_decodeList;
    var $author$project$Event$decodePaginatedEvents = A4($elm$json$Json$Decode$map3, F3(function(start, end, chunk) {
        return {
            chunk: chunk,
            end: end,
            start: start
        };
    }), A2($elm$json$Json$Decode$field, "start", $elm$json$Json$Decode$string), $elm$json$Json$Decode$maybe(A2($elm$json$Json$Decode$field, "end", $elm$json$Json$Decode$string)), A2($elm$json$Json$Decode$field, "chunk", $elm$json$Json$Decode$list($author$project$Event$decodeRoomEvent)));
    var $elm$http$Http$emptyBody = _Http_emptyBody;
    var $author$project$Room$getInitialSync = F2(function(session, _v0) {
        var roomId = _v0.a;
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$emptyBody,
            method: "GET",
            params: _List_Nil,
            path: _List_fromArray([
                "rooms",
                roomId,
                "initialSync"
            ]),
            responseDecoder: A2($elm$json$Json$Decode$field, "messages", $author$project$Event$decodePaginatedEvents)
        });
    });
    var $author$project$Room$decodeMemberEvent = A3($elm$json$Json$Decode$map2, F2(function(s, m) {
        return _Utils_Tuple2(s, m);
    }), A2($elm$json$Json$Decode$field, "state_key", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "content", $author$project$Member$decodeMember));
    var $author$project$Room$decodeMemberResponse = A2($elm$json$Json$Decode$field, "chunk", A2($elm$json$Json$Decode$andThen, A2($elm$core$Basics$composeR, $elm$core$Dict$fromList, $elm$json$Json$Decode$succeed), $elm$json$Json$Decode$list($author$project$Room$decodeMemberEvent)));
    var $author$project$Room$getJoinedMembers = F2(function(session, _v0) {
        var roomId = _v0.a;
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$emptyBody,
            method: "GET",
            params: _List_Nil,
            path: _List_fromArray([
                "rooms",
                roomId,
                "members"
            ]),
            responseDecoder: $author$project$Room$decodeMemberResponse
        });
    });
    var $author$project$Room$RoomId = function(a) {
        return {
            $: "RoomId",
            a: a
        };
    };
    var $author$project$Room$getRoomId = F2(function(session, roomAlias) {
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$emptyBody,
            method: "GET",
            params: _List_Nil,
            path: _List_fromArray([
                "directory",
                "room",
                roomAlias
            ]),
            responseDecoder: A2($elm$json$Json$Decode$map, $author$project$Room$RoomId, A2($elm$json$Json$Decode$field, "room_id", $elm$json$Json$Decode$string))
        });
    });
    var $elm$time$Time$posixToMillis = function(_v0) {
        var millis = _v0.a;
        return millis;
    };
    var $elm$core$List$sortBy = _List_sortBy;
    var $author$project$Room$sortByTime = function(events) {
        return A2($elm$core$List$sortBy, function(e) {
            switch(e.$){
                case "MessageEvent":
                    var msgEvent = e.a;
                    return $elm$time$Time$posixToMillis(function($) {
                        return $.originServerTs;
                    }(msgEvent));
                case "MemberEvent":
                    var mEvent = e.b;
                    return $elm$time$Time$posixToMillis(function($) {
                        return $.originServerTs;
                    }(mEvent));
                default:
                    var uEvt = e.a;
                    return $elm$time$Time$posixToMillis(function($) {
                        return $.originServerTs;
                    }(uEvt));
            }
        }, events);
    };
    var $author$project$Room$getInitialRoom = F2(function(session, roomAlias) {
        var addRoomId = A2($elm$core$Task$map, function(roomId) {
            return {
                roomAlias: roomAlias,
                roomId: roomId
            };
        }, A2($author$project$Room$getRoomId, session, roomAlias));
        var addMembers = function(data) {
            return A2($elm$core$Task$map, function(members) {
                return {
                    end: data.end,
                    events: data.events,
                    members: members,
                    roomAlias: data.roomAlias,
                    roomId: data.roomId,
                    start: data.start
                };
            }, A2($author$project$Room$getJoinedMembers, session, data.roomId));
        };
        var addEvents = function(data) {
            return A2($elm$core$Task$map, function(events) {
                return {
                    end: function() {
                        var _v0 = events.end;
                        if (_v0.$ === "Nothing") return events.start;
                        else {
                            var end = _v0.a;
                            return end;
                        }
                    }(),
                    events: $author$project$Room$sortByTime(events.chunk),
                    roomAlias: data.roomAlias,
                    roomId: data.roomId,
                    start: events.start
                };
            }, A2($author$project$Room$getInitialSync, session, data.roomId));
        };
        return A2($elm$core$Task$map, $author$project$Room$Room, A2($elm$core$Task$andThen, addMembers, A2($elm$core$Task$andThen, addEvents, addRoomId)));
    });
    var $author$project$Editor$Editor = function(a) {
        return {
            $: "Editor",
            a: a
        };
    };
    var $author$project$Editor$init = $author$project$Editor$Editor({
        comment: "",
        name: ""
    });
    var $author$project$LoginForm$Hidden = {
        $: "Hidden"
    };
    var $author$project$LoginForm$LoginForm = function(a) {
        return {
            $: "LoginForm",
            a: a
        };
    };
    var $author$project$LoginForm$initLoginForm = $author$project$LoginForm$LoginForm({
        homeserverUrlField: $elm$core$Maybe$Nothing,
        loginError: $elm$core$Maybe$Nothing,
        passwordField: "",
        state: $author$project$LoginForm$Hidden,
        userId: A2($elm$core$Result$mapError, function(_v0) {
            return "Something's wrong with the user ID parser";
        }, $author$project$UserId$parseUserId("@alice:example.com")),
        userIdField: ""
    });
    var $elm$http$Http$stringBody = _Http_pair;
    var $author$project$Room$joinRoom = F2(function(session, roomIdOrAlias) {
        return A2($author$project$Session$authenticatedRequest, session, {
            body: A2($elm$http$Http$stringBody, "application/json", "{}"),
            method: "POST",
            params: _List_Nil,
            path: _List_fromArray([
                "join",
                roomIdOrAlias
            ]),
            responseDecoder: $elm$json$Json$Decode$succeed(_Utils_Tuple0)
        });
    });
    var $author$project$Session$sessionKind = function(_v0) {
        var session = _v0.a;
        return session.kind;
    };
    var $author$project$Main$joinIfUser = F2(function(session, roomAlias) {
        var _v0 = $author$project$Session$sessionKind(session);
        if (_v0.$ === "User") return A2($author$project$Room$joinRoom, session, roomAlias);
        else return $elm$core$Task$succeed(_Utils_Tuple0);
    });
    var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
    var $elm$time$Time$Name = function(a) {
        return {
            $: "Name",
            a: a
        };
    };
    var $elm$time$Time$Offset = function(a) {
        return {
            $: "Offset",
            a: a
        };
    };
    var $elm$time$Time$Zone = F2(function(a, b) {
        return {
            $: "Zone",
            a: a,
            b: b
        };
    });
    var $elm$time$Time$customZone = $elm$time$Time$Zone;
    var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
    var $author$project$Config$Flags = F9(function(defaultHomeserverUrl, serverName, siteName, commentSectionId, storedSession, pageSize, loginEnabled, guestPostingEnabled, updateInterval) {
        return {
            commentSectionId: commentSectionId,
            defaultHomeserverUrl: defaultHomeserverUrl,
            guestPostingEnabled: guestPostingEnabled,
            loginEnabled: loginEnabled,
            pageSize: pageSize,
            serverName: serverName,
            siteName: siteName,
            storedSession: storedSession,
            updateInterval: updateInterval
        };
    });
    var $elm$json$Json$Decode$bool = _Json_decodeBool;
    var $author$project$Config$decodeBoolOrStr = $elm$json$Json$Decode$oneOf(_List_fromArray([
        A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$bool),
        A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, A2($elm$json$Json$Decode$andThen, function(x) {
            var _v0 = $elm$core$String$toLower(x);
            switch(_v0){
                case "true":
                    return $elm$json$Json$Decode$succeed(true);
                case "false":
                    return $elm$json$Json$Decode$succeed(false);
                default:
                    return $elm$json$Json$Decode$fail("");
            }
        }, $elm$json$Json$Decode$string))
    ]));
    var $author$project$Config$decodeCommentSectionId = A2($elm$json$Json$Decode$andThen, function(csid) {
        return A2($elm$core$String$contains, " ", csid) ? $elm$json$Json$Decode$fail("commentSectionId can't contain spaces") : $elm$json$Json$Decode$succeed(csid);
    }, A2($elm$json$Json$Decode$andThen, function(csid) {
        return A2($elm$core$String$contains, "_", csid) ? $elm$json$Json$Decode$fail("commentSectionId can't contain underscores") : $elm$json$Json$Decode$succeed(csid);
    }, $elm$json$Json$Decode$string));
    var $elm$json$Json$Decode$float = _Json_decodeFloat;
    var $author$project$Config$decodeFloatOrStr = $elm$json$Json$Decode$oneOf(_List_fromArray([
        A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$float),
        A2($elm$json$Json$Decode$map, $elm$core$String$toFloat, $elm$json$Json$Decode$string)
    ]));
    var $author$project$Config$decodeIntOrStr = $elm$json$Json$Decode$oneOf(_List_fromArray([
        A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$int),
        A2($elm$json$Json$Decode$map, $elm$core$String$toInt, $elm$json$Json$Decode$string)
    ]));
    var $author$project$Session$Session = function(a) {
        return {
            $: "Session",
            a: a
        };
    };
    var $author$project$Session$SessionData = F5(function(homeserverUrl, kind, txnId, userId, accessToken) {
        return {
            accessToken: accessToken,
            homeserverUrl: homeserverUrl,
            kind: kind,
            txnId: txnId,
            userId: userId
        };
    });
    var $author$project$Session$Guest = {
        $: "Guest"
    };
    var $author$project$Session$User = {
        $: "User"
    };
    var $author$project$Session$decodeKind = A2($elm$json$Json$Decode$andThen, function(kind) {
        switch(kind){
            case "guest":
                return $elm$json$Json$Decode$succeed($author$project$Session$Guest);
            case "user":
                return $elm$json$Json$Decode$succeed($author$project$Session$User);
            default:
                return $elm$json$Json$Decode$fail(kind + " is not a valid Session.Kind");
        }
    }, $elm$json$Json$Decode$string);
    var $elm$json$Json$Decode$map5 = _Json_map5;
    var $author$project$Session$decodeStoredSession = A2($elm$json$Json$Decode$map, $author$project$Session$Session, A6($elm$json$Json$Decode$map5, $author$project$Session$SessionData, A2($elm$json$Json$Decode$field, "homeserverUrl", $elm$json$Json$Decode$string), A2($elm$json$Json$Decode$field, "kind", $author$project$Session$decodeKind), A2($elm$json$Json$Decode$field, "txnId", $elm$json$Json$Decode$int), $author$project$UserId$toUserIdDecoder(A2($elm$json$Json$Decode$field, "userId", $elm$json$Json$Decode$string)), A2($elm$json$Json$Decode$field, "accessToken", $elm$json$Json$Decode$string)));
    var $elm$json$Json$Decode$null = _Json_decodeNull;
    var $elm$json$Json$Decode$nullable = function(decoder) {
        return $elm$json$Json$Decode$oneOf(_List_fromArray([
            $elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
            A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
        ]));
    };
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
    var $elm$json$Json$Decode$decodeValue = _Json_run;
    var $elm$json$Json$Decode$value = _Json_decodeValue;
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(function(pathDecoder, valDecoder, fallback) {
        var nullOr = function(decoder) {
            return $elm$json$Json$Decode$oneOf(_List_fromArray([
                decoder,
                $elm$json$Json$Decode$null(fallback)
            ]));
        };
        var handleResult = function(input) {
            var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
            if (_v0.$ === "Ok") {
                var rawValue = _v0.a;
                var _v1 = A2($elm$json$Json$Decode$decodeValue, nullOr(valDecoder), rawValue);
                if (_v1.$ === "Ok") {
                    var finalResult = _v1.a;
                    return $elm$json$Json$Decode$succeed(finalResult);
                } else {
                    var finalErr = _v1.a;
                    return $elm$json$Json$Decode$fail($elm$json$Json$Decode$errorToString(finalErr));
                }
            } else return $elm$json$Json$Decode$succeed(fallback);
        };
        return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
    });
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(function(key, valDecoder, fallback, decoder) {
        return A2($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder, A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value), valDecoder, fallback), decoder);
    });
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(function(key, valDecoder, decoder) {
        return A2($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom, A2($elm$json$Json$Decode$field, key, valDecoder), decoder);
    });
    var $author$project$Config$decodeFlags = A4($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional, "updateInterval", $author$project$Config$decodeFloatOrStr, $elm$core$Maybe$Nothing, A4($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional, "guestPostingEnabled", $author$project$Config$decodeBoolOrStr, $elm$core$Maybe$Nothing, A4($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional, "loginEnabled", $author$project$Config$decodeBoolOrStr, $elm$core$Maybe$Nothing, A4($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional, "pageSize", $author$project$Config$decodeIntOrStr, $elm$core$Maybe$Nothing, A4($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional, "storedSession", $elm$json$Json$Decode$nullable($author$project$Session$decodeStoredSession), $elm$core$Maybe$Nothing, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, "commentSectionId", $author$project$Config$decodeCommentSectionId, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, "siteName", $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, "serverName", $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, "defaultHomeserverUrl", $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed($author$project$Config$Flags))))))))));
    var $author$project$Config$StaticConfig = F6(function(defaultHomeserverUrl, roomAlias, pageSize, loginEnabled, guestPostingEnabled, updateInterval) {
        return {
            defaultHomeserverUrl: defaultHomeserverUrl,
            guestPostingEnabled: guestPostingEnabled,
            loginEnabled: loginEnabled,
            pageSize: pageSize,
            roomAlias: roomAlias,
            updateInterval: updateInterval
        };
    });
    var $author$project$Config$makeRoomAlias = function(_v0) {
        var siteName = _v0.siteName;
        var commentSectionId = _v0.commentSectionId;
        var serverName = _v0.serverName;
        return "#comments_" + (siteName + ("_" + (commentSectionId + (":" + serverName))));
    };
    var $ianmackenzie$elm_units$Quantity$Quantity = function(a) {
        return {
            $: "Quantity",
            a: a
        };
    };
    var $ianmackenzie$elm_units$Duration$seconds = function(numSeconds) {
        return $ianmackenzie$elm_units$Quantity$Quantity(numSeconds);
    };
    var $author$project$Config$parseFlags = function(flags) {
        return _Utils_Tuple2(A6($author$project$Config$StaticConfig, flags.defaultHomeserverUrl, $author$project$Config$makeRoomAlias(flags), A2($elm$core$Maybe$withDefault, 10, flags.pageSize), A2($elm$core$Maybe$withDefault, true, flags.loginEnabled), A2($elm$core$Maybe$withDefault, true, flags.guestPostingEnabled), $ianmackenzie$elm_units$Duration$seconds(A2($elm$core$Maybe$withDefault, 0, flags.updateInterval))), flags.storedSession);
    };
    var $author$project$Config$parseConfig = function(flags) {
        return A2($elm$core$Result$map, $author$project$Config$parseFlags, A2($elm$json$Json$Decode$decodeValue, $author$project$Config$decodeFlags, flags));
    };
    var $author$project$Session$decodeSession = F2(function(homeserverUrl, kind) {
        return A2($elm$json$Json$Decode$map, $author$project$Session$Session, A3($elm$json$Json$Decode$map2, A3($author$project$Session$SessionData, homeserverUrl, kind, 0), $author$project$UserId$toUserIdDecoder(A2($elm$json$Json$Decode$field, "user_id", $elm$json$Json$Decode$string)), A2($elm$json$Json$Decode$field, "access_token", $elm$json$Json$Decode$string)));
    });
    var $elm$url$Url$Builder$QueryParameter = F2(function(a, b) {
        return {
            $: "QueryParameter",
            a: a,
            b: b
        };
    });
    var $elm$url$Url$Builder$string = F2(function(key, value) {
        return A2($elm$url$Url$Builder$QueryParameter, $elm$url$Url$percentEncode(key), $elm$url$Url$percentEncode(value));
    });
    var $author$project$Session$unauthenticatedRequest = function(_v0) {
        var method = _v0.method;
        var url = _v0.url;
        var body = _v0.body;
        var responseDecoder = _v0.responseDecoder;
        return $author$project$Session$apiRequest({
            accessToken: $elm$core$Maybe$Nothing,
            body: body,
            method: method,
            responseDecoder: responseDecoder,
            url: url
        });
    };
    var $author$project$Session$registerGuest = function(homeserverUrl) {
        return $author$project$Session$unauthenticatedRequest({
            body: A2($elm$http$Http$stringBody, "application/json", "{}"),
            method: "POST",
            responseDecoder: A2($author$project$Session$decodeSession, homeserverUrl, $author$project$Session$Guest),
            url: A3($author$project$ApiUtils$clientEndpoint, homeserverUrl, _List_fromArray([
                "register"
            ]), _List_fromArray([
                A2($elm$url$Url$Builder$string, "kind", "guest")
            ]))
        });
    };
    var $author$project$Main$init = function(flags) {
        var parsedFlags = $author$project$Config$parseConfig(flags);
        if (parsedFlags.$ === "Ok") {
            var _v1 = parsedFlags.a;
            var config = _v1.a;
            var session = _v1.b;
            return _Utils_Tuple2($author$project$Main$GoodConfig({
                config: config,
                editor: $author$project$Editor$init,
                errors: _List_Nil,
                gotAllComments: false,
                loginForm: $author$project$LoginForm$initLoginForm,
                now: $elm$time$Time$millisToPosix(0),
                room: $elm$core$Maybe$Nothing,
                session: session,
                showComments: config.pageSize
            }), $elm$core$Platform$Cmd$batch(_List_fromArray([
                A2($elm$core$Task$perform, $author$project$Main$Tick, $elm$time$Time$now),
                A2($elm$core$Task$attempt, $author$project$Main$GotRoom, function() {
                    if (session.$ === "Nothing") return A2($elm$core$Task$andThen, function(sess) {
                        return A2($elm$core$Task$map, $elm$core$Tuple$pair(sess), A2($author$project$Room$getInitialRoom, sess, config.roomAlias));
                    }, $author$project$Session$registerGuest(config.defaultHomeserverUrl));
                    else {
                        var sess = session.a;
                        return A2($elm$core$Task$andThen, function(_v3) {
                            return A2($elm$core$Task$map, $elm$core$Tuple$pair(sess), A2($author$project$Room$getInitialRoom, sess, config.roomAlias));
                        }, A2($author$project$Main$joinIfUser, sess, config.roomAlias));
                    }
                }())
            ])));
        } else {
            var err = parsedFlags.a;
            return _Utils_Tuple2($author$project$Main$BadConfig($elm$json$Json$Decode$errorToString(err)), $elm$core$Platform$Cmd$none);
        }
    };
    var $elm$time$Time$Every = F2(function(a, b) {
        return {
            $: "Every",
            a: a,
            b: b
        };
    });
    var $elm$time$Time$State = F2(function(taggers, processes) {
        return {
            processes: processes,
            taggers: taggers
        };
    });
    var $elm$time$Time$init = $elm$core$Task$succeed(A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
    var $elm$time$Time$addMySub = F2(function(_v0, state) {
        var interval = _v0.a;
        var tagger = _v0.b;
        var _v1 = A2($elm$core$Dict$get, interval, state);
        if (_v1.$ === "Nothing") return A3($elm$core$Dict$insert, interval, _List_fromArray([
            tagger
        ]), state);
        else {
            var taggers = _v1.a;
            return A3($elm$core$Dict$insert, interval, A2($elm$core$List$cons, tagger, taggers), state);
        }
    });
    var $elm$core$Process$kill = _Scheduler_kill;
    var $elm$core$Dict$foldl = F3(function(func, acc, dict) {
        foldl: while(true){
            if (dict.$ === "RBEmpty_elm_builtin") return acc;
            else {
                var key = dict.b;
                var value = dict.c;
                var left = dict.d;
                var right = dict.e;
                var $temp$func = func, $temp$acc = A3(func, key, value, A3($elm$core$Dict$foldl, func, acc, left)), $temp$dict = right;
                func = $temp$func;
                acc = $temp$acc;
                dict = $temp$dict;
                continue foldl;
            }
        }
    });
    var $elm$core$Dict$merge = F6(function(leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
        var stepState = F3(function(rKey, rValue, _v0) {
            stepState: while(true){
                var list = _v0.a;
                var result = _v0.b;
                if (!list.b) return _Utils_Tuple2(list, A3(rightStep, rKey, rValue, result));
                else {
                    var _v2 = list.a;
                    var lKey = _v2.a;
                    var lValue = _v2.b;
                    var rest = list.b;
                    if (_Utils_cmp(lKey, rKey) < 0) {
                        var $temp$rKey = rKey, $temp$rValue = rValue, $temp$_v0 = _Utils_Tuple2(rest, A3(leftStep, lKey, lValue, result));
                        rKey = $temp$rKey;
                        rValue = $temp$rValue;
                        _v0 = $temp$_v0;
                        continue stepState;
                    } else {
                        if (_Utils_cmp(lKey, rKey) > 0) return _Utils_Tuple2(list, A3(rightStep, rKey, rValue, result));
                        else return _Utils_Tuple2(rest, A4(bothStep, lKey, lValue, rValue, result));
                    }
                }
            }
        });
        var _v3 = A3($elm$core$Dict$foldl, stepState, _Utils_Tuple2($elm$core$Dict$toList(leftDict), initialResult), rightDict);
        var leftovers = _v3.a;
        var intermediateResult = _v3.b;
        return A3($elm$core$List$foldl, F2(function(_v4, result) {
            var k = _v4.a;
            var v = _v4.b;
            return A3(leftStep, k, v, result);
        }), intermediateResult, leftovers);
    });
    var $elm$time$Time$setInterval = _Time_setInterval;
    var $elm$core$Process$spawn = _Scheduler_spawn;
    var $elm$time$Time$spawnHelp = F3(function(router, intervals, processes) {
        if (!intervals.b) return $elm$core$Task$succeed(processes);
        else {
            var interval = intervals.a;
            var rest = intervals.b;
            var spawnTimer = $elm$core$Process$spawn(A2($elm$time$Time$setInterval, interval, A2($elm$core$Platform$sendToSelf, router, interval)));
            var spawnRest = function(id) {
                return A3($elm$time$Time$spawnHelp, router, rest, A3($elm$core$Dict$insert, interval, id, processes));
            };
            return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
        }
    });
    var $elm$time$Time$onEffects = F3(function(router, subs, _v0) {
        var processes = _v0.processes;
        var rightStep = F3(function(_v6, id, _v7) {
            var spawns = _v7.a;
            var existing = _v7.b;
            var kills = _v7.c;
            return _Utils_Tuple3(spawns, existing, A2($elm$core$Task$andThen, function(_v5) {
                return kills;
            }, $elm$core$Process$kill(id)));
        });
        var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
        var leftStep = F3(function(interval, taggers, _v4) {
            var spawns = _v4.a;
            var existing = _v4.b;
            var kills = _v4.c;
            return _Utils_Tuple3(A2($elm$core$List$cons, interval, spawns), existing, kills);
        });
        var bothStep = F4(function(interval, taggers, id, _v3) {
            var spawns = _v3.a;
            var existing = _v3.b;
            var kills = _v3.c;
            return _Utils_Tuple3(spawns, A3($elm$core$Dict$insert, interval, id, existing), kills);
        });
        var _v1 = A6($elm$core$Dict$merge, leftStep, bothStep, rightStep, newTaggers, processes, _Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, $elm$core$Task$succeed(_Utils_Tuple0)));
        var spawnList = _v1.a;
        var existingDict = _v1.b;
        var killTask = _v1.c;
        return A2($elm$core$Task$andThen, function(newProcesses) {
            return $elm$core$Task$succeed(A2($elm$time$Time$State, newTaggers, newProcesses));
        }, A2($elm$core$Task$andThen, function(_v2) {
            return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
        }, killTask));
    });
    var $elm$time$Time$onSelfMsg = F3(function(router, interval, state) {
        var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
        if (_v0.$ === "Nothing") return $elm$core$Task$succeed(state);
        else {
            var taggers = _v0.a;
            var tellTaggers = function(time) {
                return $elm$core$Task$sequence(A2($elm$core$List$map, function(tagger) {
                    return A2($elm$core$Platform$sendToApp, router, tagger(time));
                }, taggers));
            };
            return A2($elm$core$Task$andThen, function(_v1) {
                return $elm$core$Task$succeed(state);
            }, A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
        }
    });
    var $elm$time$Time$subMap = F2(function(f, _v0) {
        var interval = _v0.a;
        var tagger = _v0.b;
        return A2($elm$time$Time$Every, interval, A2($elm$core$Basics$composeL, f, tagger));
    });
    _Platform_effectManagers["Time"] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
    var $elm$time$Time$subscription = _Platform_leaf("Time");
    var $elm$time$Time$every = F2(function(interval, tagger) {
        return $elm$time$Time$subscription(A2($elm$time$Time$Every, interval, tagger));
    });
    var $ianmackenzie$elm_units$Duration$inSeconds = function(_v0) {
        var numSeconds = _v0.a;
        return numSeconds;
    };
    var $ianmackenzie$elm_units$Duration$inMilliseconds = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) * 1000;
    };
    var $elm$core$Platform$Sub$batch = _Platform_batch;
    var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
    var $author$project$Main$subscriptions = function(m) {
        if (m.$ === "GoodConfig") {
            var model = m.a;
            var updatems = $ianmackenzie$elm_units$Duration$inMilliseconds(model.config.updateInterval);
            return updatems > 0 ? A2($elm$time$Time$every, updatems, $author$project$Main$Tick) : $elm$core$Platform$Sub$none;
        } else return $elm$core$Platform$Sub$none;
    };
    var $author$project$Main$GotMessages = F3(function(a, b, c) {
        return {
            $: "GotMessages",
            a: a,
            b: b,
            c: c
        };
    });
    var $author$project$Main$LoginMsg = function(a) {
        return {
            $: "LoginMsg",
            a: a
        };
    };
    var $author$project$Room$Newer = {
        $: "Newer"
    };
    var $author$project$Room$Older = {
        $: "Older"
    };
    var $author$project$Main$SentComment = F2(function(a, b) {
        return {
            $: "SentComment",
            a: a,
            b: b
        };
    });
    var $elm$core$List$maximum = function(list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return $elm$core$Maybe$Just(A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$Main$addError = F2(function(errors, message) {
        return A2($elm$core$List$cons, {
            id: A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$Basics$add(1), $elm$core$List$maximum(A2($elm$core$List$map, function($) {
                return $.id;
            }, errors)))),
            message: message
        }, errors);
    });
    var $author$project$Editor$clear = function(_v0) {
        var editor = _v0.a;
        return $author$project$Editor$Editor(_Utils_update(editor, {
            comment: ""
        }));
    };
    var $author$project$Event$messageEvents = function(roomEvents) {
        return A3($elm$core$List$foldl, F2(function(roomEvent, msgs) {
            if (roomEvent.$ === "MessageEvent") {
                var msg = roomEvent.a;
                return A2($elm$core$List$cons, msg, msgs);
            } else return msgs;
        }), _List_Nil, roomEvents);
    };
    var $author$project$Room$commentCount = function(_v0) {
        var room = _v0.a;
        return $elm$core$List$length($author$project$Event$messageEvents(room.events));
    };
    var $elm$core$List$filter = F2(function(isGood, list) {
        return A3($elm$core$List$foldr, F2(function(x, xs) {
            return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
        }), _List_Nil, list);
    });
    var $author$project$Editor$getComment = function(_v0) {
        var editor = _v0.a;
        return editor.comment;
    };
    var $author$project$Editor$getName = function(_v0) {
        var editor = _v0.a;
        return editor.name === "" ? "Anonymous" : editor.name;
    };
    var $author$project$Room$getMessages = F4(function(session, _v0, dir, from) {
        var roomId = _v0.a;
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$emptyBody,
            method: "GET",
            params: _List_fromArray([
                A2($elm$url$Url$Builder$string, "from", from),
                A2($elm$url$Url$Builder$string, "dir", function() {
                    if (dir.$ === "Older") return "b";
                    else return "f";
                }())
            ]),
            path: _List_fromArray([
                "rooms",
                roomId,
                "messages"
            ]),
            responseDecoder: $author$project$Event$decodePaginatedEvents
        });
    });
    var $author$project$Room$getNewerMessages = F2(function(session, _v0) {
        var room = _v0.a;
        return A4($author$project$Room$getMessages, session, room.roomId, $author$project$Room$Newer, room.end);
    });
    var $author$project$Room$getOlderMessages = F2(function(session, _v0) {
        var room = _v0.a;
        return A4($author$project$Room$getMessages, session, room.roomId, $author$project$Room$Older, room.start);
    });
    var $elm$core$Platform$Cmd$map = _Platform_map;
    var $elm$core$Maybe$map2 = F3(function(func, ma, mb) {
        if (ma.$ === "Nothing") return $elm$core$Maybe$Nothing;
        else {
            var a = ma.a;
            if (mb.$ === "Nothing") return $elm$core$Maybe$Nothing;
            else {
                var b = mb.a;
                return $elm$core$Maybe$Just(A2(func, a, b));
            }
        }
    });
    var $elm$core$Tuple$mapFirst = F2(function(func, _v0) {
        var x = _v0.a;
        var y = _v0.b;
        return _Utils_Tuple2(func(x), y);
    });
    var $author$project$Room$mergeNewerMessages = F2(function(_v0, newMessages) {
        var room = _v0.a;
        return $author$project$Room$Room(_Utils_update(room, {
            end: function() {
                var _v1 = newMessages.end;
                if (_v1.$ === "Nothing") return room.end;
                else {
                    var end = _v1.a;
                    return end;
                }
            }(),
            events: $author$project$Room$sortByTime(_Utils_ap(room.events, newMessages.chunk))
        }));
    });
    var $author$project$Room$mergeOlderMessages = F2(function(_v0, newMessages) {
        var room = _v0.a;
        return $author$project$Room$Room(_Utils_update(room, {
            events: $author$project$Room$sortByTime(_Utils_ap(room.events, newMessages.chunk)),
            start: function() {
                var _v1 = newMessages.end;
                if (_v1.$ === "Nothing") return newMessages.start;
                else {
                    var end = _v1.a;
                    return end;
                }
            }()
        }));
    });
    var $author$project$Room$mergeMessages = F3(function(room, dir, newMessages) {
        if (dir.$ === "Newer") return A2($author$project$Room$mergeNewerMessages, room, newMessages);
        else return A2($author$project$Room$mergeOlderMessages, room, newMessages);
    });
    var $author$project$Session$incrementTransactionId = function(_v0) {
        var session = _v0.a;
        return $author$project$Session$Session(_Utils_update(session, {
            txnId: session.txnId + 1
        }));
    };
    var $elm$http$Http$jsonBody = function(value) {
        return A2(_Http_pair, "application/json", A2($elm$json$Json$Encode$encode, 0, value));
    };
    var $elm$core$Maybe$andThen = F2(function(callback, maybeValue) {
        if (maybeValue.$ === "Just") {
            var value = maybeValue.a;
            return callback(value);
        } else return $elm$core$Maybe$Nothing;
    });
    var $dillonkearns$elm_markdown$Markdown$Block$BlockQuote = function(a) {
        return {
            $: "BlockQuote",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Cdata = function(a) {
        return {
            $: "Cdata",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$CodeBlock = function(a) {
        return {
            $: "CodeBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock = function(a) {
        return {
            $: "CodeBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$CodeSpan = function(a) {
        return {
            $: "CodeSpan",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$CompletedTask = {
        $: "CompletedTask"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Emphasis = function(a) {
        return {
            $: "Emphasis",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock = {
        $: "EmptyBlock"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak = {
        $: "HardLineBreak"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Heading = F2(function(a, b) {
        return {
            $: "Heading",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$RawBlock$Html = function(a) {
        return {
            $: "Html",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock = function(a) {
        return {
            $: "HtmlBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$HtmlComment = function(a) {
        return {
            $: "HtmlComment",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration = F2(function(a, b) {
        return {
            $: "HtmlDeclaration",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$HtmlElement = F3(function(a, b, c) {
        return {
            $: "HtmlElement",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$HtmlInline = function(a) {
        return {
            $: "HtmlInline",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Image = F3(function(a, b, c) {
        return {
            $: "Image",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$IncompleteTask = {
        $: "IncompleteTask"
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem = function(a) {
        return {
            $: "InlineProblem",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Link = F3(function(a, b, c) {
        return {
            $: "Link",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$ListItem = F2(function(a, b) {
        return {
            $: "ListItem",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$NoTask = {
        $: "NoTask"
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph = function(a) {
        return {
            $: "OpenBlockOrParagraph",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$OrderedList = F2(function(a, b) {
        return {
            $: "OrderedList",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$Paragraph = function(a) {
        return {
            $: "Paragraph",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock = function(a) {
        return {
            $: "ParsedBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction = function(a) {
        return {
            $: "ProcessingInstruction",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Strikethrough = function(a) {
        return {
            $: "Strikethrough",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Strong = function(a) {
        return {
            $: "Strong",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$Table = F2(function(a, b) {
        return {
            $: "Table",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Block$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Block$ThematicBreak = {
        $: "ThematicBreak"
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak = {
        $: "ThematicBreak"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$UnorderedList = function(a) {
        return {
            $: "UnorderedList",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines = function(a) {
        return {
            $: "UnparsedInlines",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$addReference = F2(function(state, linkRef) {
        return {
            linkReferenceDefinitions: A2($elm$core$List$cons, linkRef, state.linkReferenceDefinitions),
            rawBlocks: state.rawBlocks
        };
    });
    var $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine = {
        $: "BlankLine"
    };
    var $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab = function(_char) {
        switch(_char.valueOf()){
            case " ":
                return true;
            case "	":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Parser$Token$carriageReturn = A2($elm$parser$Parser$Advanced$Token, "\r", $elm$parser$Parser$Expecting("a carriage return"));
    var $dillonkearns$elm_markdown$Parser$Token$newline = A2($elm$parser$Parser$Advanced$Token, "\n", $elm$parser$Parser$Expecting("a newline"));
    var $dillonkearns$elm_markdown$Whitespace$lineEnd = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$carriageReturn), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ])))
    ]));
    var $dillonkearns$elm_markdown$Markdown$Parser$blankLine = A2($elm$parser$Parser$Advanced$map, function(_v0) {
        return $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine;
    }, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)), $dillonkearns$elm_markdown$Whitespace$lineEnd));
    var $dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote = function(a) {
        return {
            $: "BlockQuote",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Parser$Token$space = A2($elm$parser$Parser$Advanced$Token, " ", $elm$parser$Parser$Expecting("a space"));
    var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
    var $dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts = _List_fromArray([
        $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, ">", $elm$parser$Parser$Expecting(">"))),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, ">", $elm$parser$Parser$Expecting(" >"))),
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, " >", $elm$parser$Parser$Expecting("  >"))),
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "  >", $elm$parser$Parser$Expecting("   >")))
        ])))
    ]);
    var $dillonkearns$elm_markdown$Whitespace$isLineEnd = function(_char) {
        switch(_char.valueOf()){
            case "\n":
                return true;
            case "\r":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd = $elm$parser$Parser$Advanced$chompWhile(A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd));
    var $dillonkearns$elm_markdown$Helpers$endOfFile = $elm$parser$Parser$Advanced$end($elm$parser$Parser$Expecting("the end of the input"));
    var $dillonkearns$elm_markdown$Helpers$lineEndOrEnd = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $dillonkearns$elm_markdown$Whitespace$lineEnd,
        $dillonkearns$elm_markdown$Helpers$endOfFile
    ]));
    var $dillonkearns$elm_markdown$Markdown$Parser$blockQuote = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote), $elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
        $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
    ]))), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
    var $dillonkearns$elm_markdown$Markdown$RawBlock$Heading = F2(function(a, b) {
        return {
            $: "Heading",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock = function(a) {
        return {
            $: "IndentedCodeBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$Table = function(a) {
        return {
            $: "Table",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Table$Table = F2(function(a, b) {
        return {
            $: "Table",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow = F2(function(a, b) {
        return {
            $: "TableDelimiterRow",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith = F3(function(joinWith, string1, string2) {
        var _v0 = _Utils_Tuple2(string1, string2);
        if (_v0.a === "") return string2;
        else {
            if (_v0.b === "") return string1;
            else return _Utils_ap(string1, _Utils_ap(joinWith, string2));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll = F2(function(string1, string2) {
        return string1 + ("\n" + string2);
    });
    var $dillonkearns$elm_markdown$Markdown$Table$TableHeader = function(a) {
        return {
            $: "TableHeader",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Parser$Token$parseString = function(str) {
        return $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, str, $elm$parser$Parser$Expecting(str)));
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper = function(_v0) {
        var curr = _v0.a;
        var acc = _v0.b;
        var _return = A2($elm$core$Maybe$withDefault, $elm$parser$Parser$Advanced$Done(acc), A2($elm$core$Maybe$map, function(cell) {
            return $elm$parser$Parser$Advanced$Done(A2($elm$core$List$cons, cell, acc));
        }, curr));
        var finishCell = A2($elm$core$Maybe$withDefault, $elm$parser$Parser$Advanced$Loop(_Utils_Tuple2($elm$core$Maybe$Nothing, acc)), A2($elm$core$Maybe$map, function(cell) {
            return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple2($elm$core$Maybe$Nothing, A2($elm$core$List$cons, cell, acc)));
        }, curr));
        var addToCurrent = function(c) {
            return _Utils_ap(A2($elm$core$Maybe$withDefault, "", curr), c);
        };
        var continueCell = function(c) {
            return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple2($elm$core$Maybe$Just(addToCurrent(c)), acc));
        };
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, function(_v1) {
                return _return;
            }, $dillonkearns$elm_markdown$Parser$Token$parseString("|\n")),
            A2($elm$parser$Parser$Advanced$map, function(_v2) {
                return _return;
            }, $dillonkearns$elm_markdown$Parser$Token$parseString("\n")),
            A2($elm$parser$Parser$Advanced$map, function(_v3) {
                return _return;
            }, $elm$parser$Parser$Advanced$end($elm$parser$Parser$Expecting("end"))),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$succeed(continueCell("|"))), $dillonkearns$elm_markdown$Parser$Token$parseString("\\\\|")),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$succeed(continueCell("\\"))), $dillonkearns$elm_markdown$Parser$Token$parseString("\\\\")),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$succeed(continueCell("|"))), $dillonkearns$elm_markdown$Parser$Token$parseString("\\|")),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$succeed(finishCell)), $dillonkearns$elm_markdown$Parser$Token$parseString("|")),
            A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(_char, _v4) {
                return continueCell(_char);
            }), A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Basics$always(true), $elm$parser$Parser$Problem("No character found")))
        ]));
    };
    var $elm$core$String$trim = _String_trim;
    var $dillonkearns$elm_markdown$Markdown$TableParser$parseCells = A2($elm$parser$Parser$Advanced$map, A2($elm$core$List$foldl, F2(function(cell, acc) {
        return A2($elm$core$List$cons, $elm$core$String$trim(cell), acc);
    }), _List_Nil), A2($elm$parser$Parser$Advanced$loop, _Utils_Tuple2($elm$core$Maybe$Nothing, _List_Nil), $dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper));
    var $dillonkearns$elm_markdown$Markdown$TableParser$rowParser = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $dillonkearns$elm_markdown$Parser$Token$parseString("|"),
        $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
    ]))), $dillonkearns$elm_markdown$Markdown$TableParser$parseCells);
    var $dillonkearns$elm_markdown$Markdown$TableParser$parseHeader = F2(function(_v0, headersRow) {
        var columnAlignments = _v0.b;
        var headersWithAlignment = function(headers) {
            return A3($elm$core$List$map2, F2(function(headerCell, alignment) {
                return {
                    alignment: alignment,
                    label: headerCell
                };
            }), headers, columnAlignments);
        };
        var combineHeaderAndDelimiter = function(headers) {
            return _Utils_eq($elm$core$List$length(headers), $elm$core$List$length(columnAlignments)) ? $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Table$TableHeader(headersWithAlignment(headers))) : $elm$core$Result$Err("Tables must have the same number of header columns (" + ($elm$core$String$fromInt($elm$core$List$length(headers)) + (") as delimiter columns (" + ($elm$core$String$fromInt($elm$core$List$length(columnAlignments)) + ")"))));
        };
        var _v1 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$TableParser$rowParser, headersRow);
        if (_v1.$ === "Ok") {
            var headers = _v1.a;
            return combineHeaderAndDelimiter(headers);
        } else return $elm$core$Result$Err("Unable to parse previous line as a table header");
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks = F2(function(state, newRawBlock) {
        return {
            linkReferenceDefinitions: state.linkReferenceDefinitions,
            rawBlocks: function() {
                var _v0 = _Utils_Tuple2(newRawBlock, state.rawBlocks);
                _v0$9: while(true){
                    if (_v0.b.b) switch(_v0.b.a.$){
                        case "CodeBlock":
                            if (_v0.a.$ === "CodeBlock") {
                                var block1 = _v0.a.a;
                                var _v1 = _v0.b;
                                var block2 = _v1.a.a;
                                var rest = _v1.b;
                                return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock({
                                    body: A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2.body, block1.body),
                                    language: $elm$core$Maybe$Nothing
                                }), rest);
                            } else break _v0$9;
                        case "IndentedCodeBlock":
                            if (_v0.a.$ === "IndentedCodeBlock") {
                                var block1 = _v0.a.a;
                                var _v2 = _v0.b;
                                var block2 = _v2.a.a;
                                var rest = _v2.b;
                                return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock(A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2, block1)), rest);
                            } else break _v0$9;
                        case "BlockQuote":
                            switch(_v0.a.$){
                                case "OpenBlockOrParagraph":
                                    var body1 = _v0.a.a.a;
                                    var _v3 = _v0.b;
                                    var body2 = _v3.a.a;
                                    var rest = _v3.b;
                                    return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, "\n", body2, body1)), rest);
                                case "BlockQuote":
                                    var body1 = _v0.a.a;
                                    var _v4 = _v0.b;
                                    var body2 = _v4.a.a;
                                    var rest = _v4.b;
                                    return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, body2, body1)), rest);
                                default:
                                    break _v0$9;
                            }
                        case "OpenBlockOrParagraph":
                            switch(_v0.a.$){
                                case "OpenBlockOrParagraph":
                                    var body1 = _v0.a.a.a;
                                    var _v5 = _v0.b;
                                    var body2 = _v5.a.a.a;
                                    var rest = _v5.b;
                                    return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, "\n", body2, body1))), rest);
                                case "SetextLine":
                                    if (_v0.a.a.$ === "LevelOne") {
                                        var _v6 = _v0.a;
                                        var _v7 = _v6.a;
                                        var _v8 = _v0.b;
                                        var unparsedInlines = _v8.a.a;
                                        var rest = _v8.b;
                                        return A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 1, unparsedInlines), rest);
                                    } else {
                                        var _v9 = _v0.a;
                                        var _v10 = _v9.a;
                                        var _v11 = _v0.b;
                                        var unparsedInlines = _v11.a.a;
                                        var rest = _v11.b;
                                        return A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 2, unparsedInlines), rest);
                                    }
                                case "TableDelimiter":
                                    var _v12 = _v0.a.a;
                                    var text = _v12.a;
                                    var alignments = _v12.b;
                                    var _v13 = _v0.b;
                                    var rawHeaders = _v13.a.a.a;
                                    var rest = _v13.b;
                                    var _v14 = A2($dillonkearns$elm_markdown$Markdown$TableParser$parseHeader, A2($dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow, text, alignments), rawHeaders);
                                    if (_v14.$ === "Ok") {
                                        var headers = _v14.a.a;
                                        return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$Table(A2($dillonkearns$elm_markdown$Markdown$Table$Table, headers, _List_Nil)), rest);
                                    } else return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, "\n", rawHeaders, text.raw))), rest);
                                default:
                                    break _v0$9;
                            }
                        case "Table":
                            if (_v0.a.$ === "Table") {
                                var updatedTable = _v0.a.a;
                                var _v15 = _v0.b;
                                var rest = _v15.b;
                                return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$RawBlock$Table(updatedTable), rest);
                            } else break _v0$9;
                        default:
                            break _v0$9;
                    }
                    else break _v0$9;
                }
                return A2($elm$core$List$cons, newRawBlock, state.rawBlocks);
            }()
        };
    });
    var $elm$core$List$append = F2(function(xs, ys) {
        if (!ys.b) return xs;
        else return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
    });
    var $elm$core$List$concat = function(lists) {
        return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
    };
    var $elm$core$List$concatMap = F2(function(f, list) {
        return $elm$core$List$concat(A2($elm$core$List$map, f, list));
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$problemToString = function(problem) {
        switch(problem.$){
            case "Expecting":
                var string = problem.a;
                return "Expecting " + string;
            case "ExpectingInt":
                return "Expecting int";
            case "ExpectingHex":
                return "Expecting hex";
            case "ExpectingOctal":
                return "Expecting octal";
            case "ExpectingBinary":
                return "Expecting binary";
            case "ExpectingFloat":
                return "Expecting float";
            case "ExpectingNumber":
                return "Expecting number";
            case "ExpectingVariable":
                return "Expecting variable";
            case "ExpectingSymbol":
                var string = problem.a;
                return "Expecting symbol " + string;
            case "ExpectingKeyword":
                var string = problem.a;
                return "Expecting keyword " + string;
            case "ExpectingEnd":
                return "Expecting keyword end";
            case "UnexpectedChar":
                return "Unexpected char";
            case "Problem":
                var problemDescription = problem.a;
                return problemDescription;
            default:
                return "Bad repeat";
        }
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString = function(deadEnd) {
        return "Problem at row " + ($elm$core$String$fromInt(deadEnd.row) + ("\n" + $dillonkearns$elm_markdown$Markdown$Parser$problemToString(deadEnd.problem)));
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString = function(deadEnds) {
        return A2($elm$core$String$join, "\n", A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, deadEnds));
    };
    var $dillonkearns$elm_markdown$HtmlParser$Cdata = function(a) {
        return {
            $: "Cdata",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$HtmlParser$Element = F3(function(a, b, c) {
        return {
            $: "Element",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$HtmlParser$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter = $elm$parser$Parser$Expecting("at least 1 tag name character");
    var $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter = function(c) {
        switch(c.valueOf()){
            case " ":
                return false;
            case "\r":
                return false;
            case "\n":
                return false;
            case "	":
                return false;
            case "/":
                return false;
            case "<":
                return false;
            case ">":
                return false;
            case '"':
                return false;
            case "'":
                return false;
            case "=":
                return false;
            default:
                return true;
        }
    };
    var $dillonkearns$elm_markdown$HtmlParser$tagName = A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(name, _v0) {
        return $elm$core$String$toLower(name);
    }), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter, $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$tagNameCharacter)));
    var $dillonkearns$elm_markdown$HtmlParser$attributeName = $dillonkearns$elm_markdown$HtmlParser$tagName;
    var $elm$parser$Parser$ExpectingSymbol = function(a) {
        return {
            $: "ExpectingSymbol",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$HtmlParser$symbol = function(str) {
        return $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, str, $elm$parser$Parser$ExpectingSymbol(str)));
    };
    var $dillonkearns$elm_markdown$HtmlParser$entities = $elm$core$Dict$fromList(_List_fromArray([
        _Utils_Tuple2("amp", _Utils_chr("&")),
        _Utils_Tuple2("lt", _Utils_chr("<")),
        _Utils_Tuple2("gt", _Utils_chr(">")),
        _Utils_Tuple2("apos", _Utils_chr("'")),
        _Utils_Tuple2("quot", _Utils_chr('"'))
    ]));
    var $elm$core$Result$fromMaybe = F2(function(err, maybe) {
        if (maybe.$ === "Just") {
            var v = maybe.a;
            return $elm$core$Result$Ok(v);
        } else return $elm$core$Result$Err(err);
    });
    var $dillonkearns$elm_markdown$HtmlParser$decodeEscape = function(s) {
        return A2($elm$core$String$startsWith, "#x", s) ? A2($elm$core$Result$mapError, $elm$parser$Parser$Problem, A2($elm$core$Result$map, $elm$core$Char$fromCode, $rtfeldman$elm_hex$Hex$fromString(A2($elm$core$String$dropLeft, 2, s)))) : A2($elm$core$String$startsWith, "#", s) ? A2($elm$core$Result$fromMaybe, $elm$parser$Parser$Problem("Invalid escaped character: " + s), A2($elm$core$Maybe$map, $elm$core$Char$fromCode, $elm$core$String$toInt(A2($elm$core$String$dropLeft, 1, s)))) : A2($elm$core$Result$fromMaybe, $elm$parser$Parser$Problem('No entity named "&' + (s + ';" found.')), A2($elm$core$Dict$get, s, $dillonkearns$elm_markdown$HtmlParser$entities));
    };
    var $dillonkearns$elm_markdown$HtmlParser$escapedChar = function(end_) {
        var process = function(entityStr) {
            var _v0 = $dillonkearns$elm_markdown$HtmlParser$decodeEscape(entityStr);
            if (_v0.$ === "Ok") {
                var c = _v0.a;
                return $elm$parser$Parser$Advanced$succeed(c);
            } else {
                var e = _v0.a;
                return $elm$parser$Parser$Advanced$problem(e);
            }
        };
        var isEntityChar = function(c) {
            return !_Utils_eq(c, end_) && !_Utils_eq(c, _Utils_chr(";"));
        };
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol("&")), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$andThen, process, $elm$parser$Parser$Advanced$getChompedString(A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, isEntityChar, $elm$parser$Parser$Expecting("an entity character")), $elm$parser$Parser$Advanced$chompWhile(isEntityChar)))), $dillonkearns$elm_markdown$HtmlParser$symbol(";")));
    };
    var $dillonkearns$elm_markdown$HtmlParser$textStringStep = F3(function(closingChar, predicate, accum) {
        return A2($elm$parser$Parser$Advanced$andThen, function(soFar) {
            return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
                A2($elm$parser$Parser$Advanced$map, function(escaped) {
                    return $elm$parser$Parser$Advanced$Loop(_Utils_ap(accum, _Utils_ap(soFar, $elm$core$String$fromChar(escaped))));
                }, $dillonkearns$elm_markdown$HtmlParser$escapedChar(closingChar)),
                $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(_Utils_ap(accum, soFar)))
            ]));
        }, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompWhile(predicate)));
    });
    var $dillonkearns$elm_markdown$HtmlParser$textString = function(closingChar) {
        var predicate = function(c) {
            return !_Utils_eq(c, closingChar) && !_Utils_eq(c, _Utils_chr("&"));
        };
        return A2($elm$parser$Parser$Advanced$loop, "", A2($dillonkearns$elm_markdown$HtmlParser$textStringStep, closingChar, predicate));
    };
    var $dillonkearns$elm_markdown$HtmlParser$attributeValue = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol('"')), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$textString(_Utils_chr('"')), $dillonkearns$elm_markdown$HtmlParser$symbol('"'))),
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol("'")), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$textString(_Utils_chr("'")), $dillonkearns$elm_markdown$HtmlParser$symbol("'")))
    ]));
    var $dillonkearns$elm_markdown$HtmlParser$keepOldest = F2(function(_new, mValue) {
        if (mValue.$ === "Just") {
            var v = mValue.a;
            return $elm$core$Maybe$Just(v);
        } else return $elm$core$Maybe$Just(_new);
    });
    var $dillonkearns$elm_markdown$HtmlParser$isWhitespace = function(c) {
        switch(c.valueOf()){
            case " ":
                return true;
            case "\r":
                return true;
            case "\n":
                return true;
            case "	":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$HtmlParser$whiteSpace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace);
    var $dillonkearns$elm_markdown$HtmlParser$attributesStep = function(attrs) {
        var process = F2(function(name, value) {
            return $elm$parser$Parser$Advanced$Loop(A3($elm$core$Dict$update, $elm$core$String$toLower(name), $dillonkearns$elm_markdown$HtmlParser$keepOldest(value), attrs));
        });
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed(process), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeName, $dillonkearns$elm_markdown$HtmlParser$whiteSpace), $dillonkearns$elm_markdown$HtmlParser$symbol("=")), $dillonkearns$elm_markdown$HtmlParser$whiteSpace)), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeValue, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
            $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(attrs))
        ]));
    };
    var $dillonkearns$elm_markdown$HtmlParser$attributes = A2($elm$parser$Parser$Advanced$map, A2($elm$core$Dict$foldl, F3(function(key, value, accum) {
        return A2($elm$core$List$cons, {
            name: key,
            value: value
        }, accum);
    }), _List_Nil), A2($elm$parser$Parser$Advanced$loop, $elm$core$Dict$empty, $dillonkearns$elm_markdown$HtmlParser$attributesStep));
    var $elm$parser$Parser$Advanced$chompUntilEndOr = function(str) {
        return $elm$parser$Parser$Advanced$Parser(function(s) {
            var _v0 = A5(_Parser_findSubString, str, s.offset, s.row, s.col, s.src);
            var newOffset = _v0.a;
            var newRow = _v0.b;
            var newCol = _v0.c;
            var adjustedOffset = newOffset < 0 ? $elm$core$String$length(s.src) : newOffset;
            return A3($elm$parser$Parser$Advanced$Good, _Utils_cmp(s.offset, adjustedOffset) < 0, _Utils_Tuple0, {
                col: newCol,
                context: s.context,
                indent: s.indent,
                offset: adjustedOffset,
                row: newRow,
                src: s.src
            });
        });
    };
    var $dillonkearns$elm_markdown$HtmlParser$cdata = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol("<![CDATA[")), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntilEndOr("]]>")), $dillonkearns$elm_markdown$HtmlParser$symbol("]]>")));
    var $dillonkearns$elm_markdown$HtmlParser$childrenStep = F2(function(options, accum) {
        return A2($elm$parser$Parser$Advanced$map, function(f) {
            return f(accum);
        }, $elm$parser$Parser$Advanced$oneOf(options));
    });
    var $dillonkearns$elm_markdown$HtmlParser$fail = function(str) {
        return $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem(str));
    };
    var $dillonkearns$elm_markdown$HtmlParser$closingTag = function(startTagName) {
        var closingTagName = A2($elm$parser$Parser$Advanced$andThen, function(endTagName) {
            return _Utils_eq(startTagName, endTagName) ? $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0) : $dillonkearns$elm_markdown$HtmlParser$fail("tag name mismatch: " + (startTagName + (" and " + endTagName)));
        }, $dillonkearns$elm_markdown$HtmlParser$tagName);
        return A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$symbol("</"), $dillonkearns$elm_markdown$HtmlParser$whiteSpace), closingTagName), $dillonkearns$elm_markdown$HtmlParser$whiteSpace), $dillonkearns$elm_markdown$HtmlParser$symbol(">"));
    };
    var $dillonkearns$elm_markdown$HtmlParser$Comment = function(a) {
        return {
            $: "Comment",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$HtmlParser$toToken = function(str) {
        return A2($elm$parser$Parser$Advanced$Token, str, $elm$parser$Parser$Expecting(str));
    };
    var $dillonkearns$elm_markdown$HtmlParser$comment = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Comment), $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$HtmlParser$toToken("<!--"))), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntilEndOr("-->")), $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$HtmlParser$toToken("-->"))));
    var $dillonkearns$elm_markdown$HtmlParser$Declaration = F2(function(a, b) {
        return {
            $: "Declaration",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter = $elm$parser$Parser$Expecting("at least 1 uppercase character");
    var $dillonkearns$elm_markdown$HtmlParser$allUppercase = $elm$parser$Parser$Advanced$getChompedString(A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Char$isUpper, $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter), $elm$parser$Parser$Advanced$chompWhile($elm$core$Char$isUpper)));
    var $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace = A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$HtmlParser$isWhitespace, $elm$parser$Parser$Expecting("at least one whitespace")), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace));
    var $dillonkearns$elm_markdown$HtmlParser$docType = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Declaration), $dillonkearns$elm_markdown$HtmlParser$symbol("<!")), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$allUppercase, $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace)), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntilEndOr(">")), $dillonkearns$elm_markdown$HtmlParser$symbol(">")));
    var $dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction = function(a) {
        return {
            $: "ProcessingInstruction",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$HtmlParser$processingInstruction = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction), $dillonkearns$elm_markdown$HtmlParser$symbol("<?")), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntilEndOr("?>")), $dillonkearns$elm_markdown$HtmlParser$symbol("?>")));
    var $dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar = function(c) {
        switch(c.valueOf()){
            case "<":
                return false;
            case "&":
                return false;
            default:
                return true;
        }
    };
    var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions = _List_fromArray([
        A2($elm$parser$Parser$Advanced$map, function(_v0) {
            return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple0);
        }, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar, $elm$parser$Parser$Expecting("is not & or <")), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar))),
        A2($elm$parser$Parser$Advanced$map, function(_v1) {
            return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple0);
        }, $dillonkearns$elm_markdown$HtmlParser$escapedChar(_Utils_chr("<"))),
        $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(_Utils_Tuple0))
    ]);
    var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep = function(_v0) {
        return $elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions);
    };
    var $dillonkearns$elm_markdown$HtmlParser$textNodeString = $elm$parser$Parser$Advanced$getChompedString(A2($elm$parser$Parser$Advanced$loop, _Utils_Tuple0, $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep));
    var $dillonkearns$elm_markdown$HtmlParser$children = function(startTagName) {
        return A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$HtmlParser$childrenStep($dillonkearns$elm_markdown$HtmlParser$childrenStepOptions(startTagName)));
    };
    var $dillonkearns$elm_markdown$HtmlParser$childrenStepOptions = function(startTagName) {
        return _List_fromArray([
            A2($elm$parser$Parser$Advanced$map, F2(function(_v1, accum) {
                return $elm$parser$Parser$Advanced$Done($elm$core$List$reverse(accum));
            }), $dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)),
            A2($elm$parser$Parser$Advanced$andThen, function(text) {
                return $elm$core$String$isEmpty(text) ? A2($elm$parser$Parser$Advanced$map, F2(function(_v2, accum) {
                    return $elm$parser$Parser$Advanced$Done($elm$core$List$reverse(accum));
                }), $dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)) : $elm$parser$Parser$Advanced$succeed(function(accum) {
                    return $elm$parser$Parser$Advanced$Loop(A2($elm$core$List$cons, $dillonkearns$elm_markdown$HtmlParser$Text(text), accum));
                });
            }, $dillonkearns$elm_markdown$HtmlParser$textNodeString),
            A2($elm$parser$Parser$Advanced$map, F2(function(_new, accum) {
                return $elm$parser$Parser$Advanced$Loop(A2($elm$core$List$cons, _new, accum));
            }), $dillonkearns$elm_markdown$HtmlParser$cyclic$html())
        ]);
    };
    var $dillonkearns$elm_markdown$HtmlParser$elementContinuation = function(startTagName) {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Element(startTagName)), $dillonkearns$elm_markdown$HtmlParser$whiteSpace), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributes, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, function(_v0) {
                return _List_Nil;
            }, $dillonkearns$elm_markdown$HtmlParser$symbol("/>")),
            A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol(">")), $dillonkearns$elm_markdown$HtmlParser$children(startTagName))
        ])));
    };
    function $dillonkearns$elm_markdown$HtmlParser$cyclic$html() {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$HtmlParser$Cdata, $dillonkearns$elm_markdown$HtmlParser$cdata),
            $dillonkearns$elm_markdown$HtmlParser$processingInstruction,
            $dillonkearns$elm_markdown$HtmlParser$comment,
            $dillonkearns$elm_markdown$HtmlParser$docType,
            $dillonkearns$elm_markdown$HtmlParser$cyclic$element()
        ]));
    }
    function $dillonkearns$elm_markdown$HtmlParser$cyclic$element() {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$HtmlParser$symbol("<")), A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$HtmlParser$elementContinuation, $dillonkearns$elm_markdown$HtmlParser$tagName));
    }
    try {
        var $dillonkearns$elm_markdown$HtmlParser$html = $dillonkearns$elm_markdown$HtmlParser$cyclic$html();
        $dillonkearns$elm_markdown$HtmlParser$cyclic$html = function() {
            return $dillonkearns$elm_markdown$HtmlParser$html;
        };
        var $dillonkearns$elm_markdown$HtmlParser$element = $dillonkearns$elm_markdown$HtmlParser$cyclic$element();
        $dillonkearns$elm_markdown$HtmlParser$cyclic$element = function() {
            return $dillonkearns$elm_markdown$HtmlParser$element;
        };
    } catch ($) {
        throw "Some top-level definitions from `HtmlParser` are causing infinite recursion:\n\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2510\n  \u2502    children\n  \u2502     \u2193\n  \u2502    childrenStepOptions\n  \u2502     \u2193\n  \u2502    html\n  \u2502     \u2193\n  \u2502    element\n  \u2502     \u2193\n  \u2502    elementContinuation\n  \u2514\u2500\u2500\u2500\u2500\u2500\u2518\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!";
    }
    var $dillonkearns$elm_markdown$Parser$Token$tab = A2($elm$parser$Parser$Advanced$Token, "	", $elm$parser$Parser$Expecting("a tab"));
    var $dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "   ", $elm$parser$Parser$ExpectingSymbol("Indentation"))),
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, " 	", $elm$parser$Parser$ExpectingSymbol("Indentation"))),
            $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "  	", $elm$parser$Parser$ExpectingSymbol("Indentation")))
        ])))
    ]));
    var $dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock), $dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
    var $elm$core$Tuple$mapSecond = F2(function(func, _v0) {
        var x = _v0.a;
        var y = _v0.b;
        return _Utils_Tuple2(x, func(y));
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser = A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(rawLine, _v0) {
        return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(rawLine));
    }), $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd);
    var $dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser = A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
    var $dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock = F2(function(a, b) {
        return {
            $: "OrderedListBlock",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore = function(condition) {
        return A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, condition, $elm$parser$Parser$Problem("Expected one or more character")), $elm$parser$Parser$Advanced$chompWhile(condition));
    };
    var $dillonkearns$elm_markdown$Parser$Token$closingParen = A2($elm$parser$Parser$Advanced$Token, ")", $elm$parser$Parser$Expecting("a `)`"));
    var $dillonkearns$elm_markdown$Parser$Token$dot = A2($elm$parser$Parser$Advanced$Token, ".", $elm$parser$Parser$Expecting("a `.`"));
    var $dillonkearns$elm_markdown$Markdown$OrderedList$itemBody = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(""), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)
    ]));
    var $dillonkearns$elm_markdown$Parser$Extra$positiveInteger = A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(str, _v0) {
        return A2($elm$core$Maybe$withDefault, 0, $elm$core$String$toInt(str));
    }), $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($elm$core$Char$isDigit));
    var $dillonkearns$elm_markdown$Markdown$OrderedList$singleItemParser = function(listMarker) {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Parser$Extra$positiveInteger, $elm$parser$Parser$Advanced$symbol(listMarker)))), $dillonkearns$elm_markdown$Markdown$OrderedList$itemBody);
    };
    var $dillonkearns$elm_markdown$Markdown$OrderedList$statementsHelp = F2(function(itemParser, revStmts) {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, function(stmt) {
                return $elm$parser$Parser$Advanced$Loop(A2($elm$core$List$cons, stmt, revStmts));
            }, itemParser),
            $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done($elm$core$List$reverse(revStmts)))
        ]));
    });
    var $dillonkearns$elm_markdown$Markdown$OrderedList$parseSubsequentItems = F3(function(startingIndex, listMarker, firstItem) {
        return A2($elm$parser$Parser$Advanced$map, function(items) {
            return _Utils_Tuple2(startingIndex, A2($elm$core$List$cons, firstItem, items));
        }, A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$Markdown$OrderedList$statementsHelp($dillonkearns$elm_markdown$Markdown$OrderedList$singleItemParser(listMarker))));
    });
    var $dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits = A2($elm$parser$Parser$Advanced$andThen, function(parsed) {
        return parsed <= 999999999 ? $elm$parser$Parser$Advanced$succeed(parsed) : $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem("Starting numbers must be nine digits or less."));
    }, $dillonkearns$elm_markdown$Parser$Extra$positiveInteger);
    var $dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1 = function(parsed) {
        if (parsed === 1) return $elm$parser$Parser$Advanced$succeed(parsed);
        else return $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem("Lists inside a paragraph or after a paragraph without a blank line must start with 1"));
    };
    var $dillonkearns$elm_markdown$Markdown$OrderedList$parser = function(previousWasBody) {
        return A2($elm$parser$Parser$Advanced$andThen, $elm$core$Basics$identity, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$OrderedList$parseSubsequentItems), $elm$parser$Parser$Advanced$backtrackable(previousWasBody ? A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1, $dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits) : $dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits)), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Parser$Token$dot), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$dot)),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Parser$Token$closingParen), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$closingParen))
        ]))), $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock = function(previousWasBody) {
        return A2($elm$parser$Parser$Advanced$map, function(_v0) {
            var startingIndex = _v0.a;
            var unparsedLines = _v0.b;
            return A2($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, startingIndex, A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines, unparsedLines));
        }, $dillonkearns$elm_markdown$Markdown$OrderedList$parser(previousWasBody));
    };
    var $dillonkearns$elm_markdown$Markdown$Inline$CodeInline = function(a) {
        return {
            $: "CodeInline",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Inline$Emphasis = F2(function(a, b) {
        return {
            $: "Emphasis",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak = {
        $: "HardLineBreak"
    };
    var $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline = function(a) {
        return {
            $: "HtmlInline",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Inline$Image = F3(function(a, b, c) {
        return {
            $: "Image",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Inline$Link = F3(function(a, b, c) {
        return {
            $: "Link",
            a: a,
            b: b,
            c: c
        };
    });
    var $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough = function(a) {
        return {
            $: "Strikethrough",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Inline$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline = function(_v0) {
        var match = _v0.a;
        var _v1 = match.type_;
        switch(_v1.$){
            case "NormalType":
                return $dillonkearns$elm_markdown$Markdown$Inline$Text(match.text);
            case "HardLineBreakType":
                return $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak;
            case "CodeType":
                return $dillonkearns$elm_markdown$Markdown$Inline$CodeInline(match.text);
            case "AutolinkType":
                var _v2 = _v1.a;
                var text = _v2.a;
                var url = _v2.b;
                return A3($dillonkearns$elm_markdown$Markdown$Inline$Link, url, $elm$core$Maybe$Nothing, _List_fromArray([
                    $dillonkearns$elm_markdown$Markdown$Inline$Text(text)
                ]));
            case "LinkType":
                var _v3 = _v1.a;
                var url = _v3.a;
                var maybeTitle = _v3.b;
                return A3($dillonkearns$elm_markdown$Markdown$Inline$Link, url, maybeTitle, $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
            case "ImageType":
                var _v4 = _v1.a;
                var url = _v4.a;
                var maybeTitle = _v4.b;
                return A3($dillonkearns$elm_markdown$Markdown$Inline$Image, url, maybeTitle, $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
            case "HtmlType":
                var model = _v1.a;
                return $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline(model);
            case "EmphasisType":
                var length = _v1.a;
                return A2($dillonkearns$elm_markdown$Markdown$Inline$Emphasis, length, $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
            default:
                return $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough($dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
        }
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines = function(matches) {
        return A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline, matches);
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$Match = function(a) {
        return {
            $: "Match",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch = F2(function(parentMatch, childMatch) {
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: childMatch.end - parentMatch.textStart,
            matches: childMatch.matches,
            start: childMatch.start - parentMatch.textStart,
            text: childMatch.text,
            textEnd: childMatch.textEnd - parentMatch.textStart,
            textStart: childMatch.textStart - parentMatch.textStart,
            type_: childMatch.type_
        });
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$addChild = F2(function(parentMatch, childMatch) {
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: parentMatch.end,
            matches: A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, parentMatch, childMatch), parentMatch.matches),
            start: parentMatch.start,
            text: parentMatch.text,
            textEnd: parentMatch.textEnd,
            textStart: parentMatch.textStart,
            type_: parentMatch.type_
        });
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren = function(_v4) {
        var match = _v4.a;
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: match.end,
            matches: $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(match.matches),
            start: match.start,
            text: match.text,
            textEnd: match.textEnd,
            textStart: match.textStart,
            type_: match.type_
        });
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches = function(matches) {
        var _v2 = A2($elm$core$List$sortBy, function(_v3) {
            var match = _v3.a;
            return match.start;
        }, matches);
        if (!_v2.b) return _List_Nil;
        else {
            var first = _v2.a;
            var rest = _v2.b;
            return A3($dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp, rest, first, _List_Nil);
        }
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp = F3(function(remaining, _v0, matchesTail) {
        organizeMatchesHelp: while(true){
            var prevMatch = _v0.a;
            if (!remaining.b) return A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren($dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch)), matchesTail);
            else {
                var match = remaining.a.a;
                var rest = remaining.b;
                if (_Utils_cmp(prevMatch.end, match.start) < 1) {
                    var $temp$remaining = rest, $temp$_v0 = $dillonkearns$elm_markdown$Markdown$InlineParser$Match(match), $temp$matchesTail = A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren($dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch)), matchesTail);
                    remaining = $temp$remaining;
                    _v0 = $temp$_v0;
                    matchesTail = $temp$matchesTail;
                    continue organizeMatchesHelp;
                } else if (_Utils_cmp(prevMatch.start, match.start) < 0 && _Utils_cmp(prevMatch.end, match.end) > 0) {
                    var $temp$remaining = rest, $temp$_v0 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$addChild, prevMatch, match), $temp$matchesTail = matchesTail;
                    remaining = $temp$remaining;
                    _v0 = $temp$_v0;
                    matchesTail = $temp$matchesTail;
                    continue organizeMatchesHelp;
                } else {
                    var $temp$remaining = rest, $temp$_v0 = $dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch), $temp$matchesTail = matchesTail;
                    remaining = $temp$remaining;
                    _v0 = $temp$_v0;
                    matchesTail = $temp$matchesTail;
                    continue organizeMatchesHelp;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType = {
        $: "NormalType"
    };
    var $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand = function(string) {
        return A2($elm$core$String$contains, "&", string);
    };
    var $elm$regex$Regex$Match = F4(function(match, index, number, submatches) {
        return {
            index: index,
            match: match,
            number: number,
            submatches: submatches
        };
    });
    var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
    var $elm$regex$Regex$fromString = function(string) {
        return A2($elm$regex$Regex$fromStringWith, {
            caseInsensitive: false,
            multiline: false
        }, string);
    };
    var $elm$regex$Regex$never = _Regex_never;
    var $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("&#([0-9]{1,8});"));
    var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
    var $elm$core$Basics$ge = _Utils_ge;
    var $elm$core$Basics$modBy = _Basics_modBy;
    var $dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode = function(_int) {
        var remain_ = A2($elm$core$Basics$modBy, 16, _int);
        var remain = A2($elm$core$Basics$modBy, 131070, _int);
        return _int >= 131070 && (0 <= remain && remain <= 15 || 65536 <= remain && remain <= 65551) && (remain_ === 14 || remain_ === 15);
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode = function(_int) {
        return _int === 9 || _int === 10 || _int === 13 || _int === 133 || 32 <= _int && _int <= 126 || 160 <= _int && _int <= 55295 || 57344 <= _int && _int <= 64975 || 65008 <= _int && _int <= 65533 || 65536 <= _int && _int <= 1114109;
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$validUnicode = function(_int) {
        return $dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode(_int) && !$dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode(_int) ? $elm$core$String$fromChar($elm$core$Char$fromCode(_int)) : $elm$core$String$fromChar($elm$core$Char$fromCode(65533));
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal = function(match) {
        var _v0 = match.submatches;
        if (_v0.b && _v0.a.$ === "Just") {
            var first = _v0.a.a;
            var _v1 = $elm$core$String$toInt(first);
            if (_v1.$ === "Just") {
                var v = _v1.a;
                return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode(v);
            } else return match.match;
        } else return match.match;
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal);
    var $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("&([0-9a-zA-Z]+);"));
    var $dillonkearns$elm_markdown$Markdown$Entity$entities = $elm$core$Dict$fromList(_List_fromArray([
        _Utils_Tuple2("quot", 34),
        _Utils_Tuple2("amp", 38),
        _Utils_Tuple2("apos", 39),
        _Utils_Tuple2("lt", 60),
        _Utils_Tuple2("gt", 62),
        _Utils_Tuple2("nbsp", 160),
        _Utils_Tuple2("iexcl", 161),
        _Utils_Tuple2("cent", 162),
        _Utils_Tuple2("pound", 163),
        _Utils_Tuple2("curren", 164),
        _Utils_Tuple2("yen", 165),
        _Utils_Tuple2("brvbar", 166),
        _Utils_Tuple2("sect", 167),
        _Utils_Tuple2("uml", 168),
        _Utils_Tuple2("copy", 169),
        _Utils_Tuple2("ordf", 170),
        _Utils_Tuple2("laquo", 171),
        _Utils_Tuple2("not", 172),
        _Utils_Tuple2("shy", 173),
        _Utils_Tuple2("reg", 174),
        _Utils_Tuple2("macr", 175),
        _Utils_Tuple2("deg", 176),
        _Utils_Tuple2("plusmn", 177),
        _Utils_Tuple2("sup2", 178),
        _Utils_Tuple2("sup3", 179),
        _Utils_Tuple2("acute", 180),
        _Utils_Tuple2("micro", 181),
        _Utils_Tuple2("para", 182),
        _Utils_Tuple2("middot", 183),
        _Utils_Tuple2("cedil", 184),
        _Utils_Tuple2("sup1", 185),
        _Utils_Tuple2("ordm", 186),
        _Utils_Tuple2("raquo", 187),
        _Utils_Tuple2("frac14", 188),
        _Utils_Tuple2("frac12", 189),
        _Utils_Tuple2("frac34", 190),
        _Utils_Tuple2("iquest", 191),
        _Utils_Tuple2("Agrave", 192),
        _Utils_Tuple2("Aacute", 193),
        _Utils_Tuple2("Acirc", 194),
        _Utils_Tuple2("Atilde", 195),
        _Utils_Tuple2("Auml", 196),
        _Utils_Tuple2("Aring", 197),
        _Utils_Tuple2("AElig", 198),
        _Utils_Tuple2("Ccedil", 199),
        _Utils_Tuple2("Egrave", 200),
        _Utils_Tuple2("Eacute", 201),
        _Utils_Tuple2("Ecirc", 202),
        _Utils_Tuple2("Euml", 203),
        _Utils_Tuple2("Igrave", 204),
        _Utils_Tuple2("Iacute", 205),
        _Utils_Tuple2("Icirc", 206),
        _Utils_Tuple2("Iuml", 207),
        _Utils_Tuple2("ETH", 208),
        _Utils_Tuple2("Ntilde", 209),
        _Utils_Tuple2("Ograve", 210),
        _Utils_Tuple2("Oacute", 211),
        _Utils_Tuple2("Ocirc", 212),
        _Utils_Tuple2("Otilde", 213),
        _Utils_Tuple2("Ouml", 214),
        _Utils_Tuple2("times", 215),
        _Utils_Tuple2("Oslash", 216),
        _Utils_Tuple2("Ugrave", 217),
        _Utils_Tuple2("Uacute", 218),
        _Utils_Tuple2("Ucirc", 219),
        _Utils_Tuple2("Uuml", 220),
        _Utils_Tuple2("Yacute", 221),
        _Utils_Tuple2("THORN", 222),
        _Utils_Tuple2("szlig", 223),
        _Utils_Tuple2("agrave", 224),
        _Utils_Tuple2("aacute", 225),
        _Utils_Tuple2("acirc", 226),
        _Utils_Tuple2("atilde", 227),
        _Utils_Tuple2("auml", 228),
        _Utils_Tuple2("aring", 229),
        _Utils_Tuple2("aelig", 230),
        _Utils_Tuple2("ccedil", 231),
        _Utils_Tuple2("egrave", 232),
        _Utils_Tuple2("eacute", 233),
        _Utils_Tuple2("ecirc", 234),
        _Utils_Tuple2("euml", 235),
        _Utils_Tuple2("igrave", 236),
        _Utils_Tuple2("iacute", 237),
        _Utils_Tuple2("icirc", 238),
        _Utils_Tuple2("iuml", 239),
        _Utils_Tuple2("eth", 240),
        _Utils_Tuple2("ntilde", 241),
        _Utils_Tuple2("ograve", 242),
        _Utils_Tuple2("oacute", 243),
        _Utils_Tuple2("ocirc", 244),
        _Utils_Tuple2("otilde", 245),
        _Utils_Tuple2("ouml", 246),
        _Utils_Tuple2("divide", 247),
        _Utils_Tuple2("oslash", 248),
        _Utils_Tuple2("ugrave", 249),
        _Utils_Tuple2("uacute", 250),
        _Utils_Tuple2("ucirc", 251),
        _Utils_Tuple2("uuml", 252),
        _Utils_Tuple2("yacute", 253),
        _Utils_Tuple2("thorn", 254),
        _Utils_Tuple2("yuml", 255),
        _Utils_Tuple2("OElig", 338),
        _Utils_Tuple2("oelig", 339),
        _Utils_Tuple2("Scaron", 352),
        _Utils_Tuple2("scaron", 353),
        _Utils_Tuple2("Yuml", 376),
        _Utils_Tuple2("fnof", 402),
        _Utils_Tuple2("circ", 710),
        _Utils_Tuple2("tilde", 732),
        _Utils_Tuple2("Alpha", 913),
        _Utils_Tuple2("Beta", 914),
        _Utils_Tuple2("Gamma", 915),
        _Utils_Tuple2("Delta", 916),
        _Utils_Tuple2("Epsilon", 917),
        _Utils_Tuple2("Zeta", 918),
        _Utils_Tuple2("Eta", 919),
        _Utils_Tuple2("Theta", 920),
        _Utils_Tuple2("Iota", 921),
        _Utils_Tuple2("Kappa", 922),
        _Utils_Tuple2("Lambda", 923),
        _Utils_Tuple2("Mu", 924),
        _Utils_Tuple2("Nu", 925),
        _Utils_Tuple2("Xi", 926),
        _Utils_Tuple2("Omicron", 927),
        _Utils_Tuple2("Pi", 928),
        _Utils_Tuple2("Rho", 929),
        _Utils_Tuple2("Sigma", 931),
        _Utils_Tuple2("Tau", 932),
        _Utils_Tuple2("Upsilon", 933),
        _Utils_Tuple2("Phi", 934),
        _Utils_Tuple2("Chi", 935),
        _Utils_Tuple2("Psi", 936),
        _Utils_Tuple2("Omega", 937),
        _Utils_Tuple2("alpha", 945),
        _Utils_Tuple2("beta", 946),
        _Utils_Tuple2("gamma", 947),
        _Utils_Tuple2("delta", 948),
        _Utils_Tuple2("epsilon", 949),
        _Utils_Tuple2("zeta", 950),
        _Utils_Tuple2("eta", 951),
        _Utils_Tuple2("theta", 952),
        _Utils_Tuple2("iota", 953),
        _Utils_Tuple2("kappa", 954),
        _Utils_Tuple2("lambda", 955),
        _Utils_Tuple2("mu", 956),
        _Utils_Tuple2("nu", 957),
        _Utils_Tuple2("xi", 958),
        _Utils_Tuple2("omicron", 959),
        _Utils_Tuple2("pi", 960),
        _Utils_Tuple2("rho", 961),
        _Utils_Tuple2("sigmaf", 962),
        _Utils_Tuple2("sigma", 963),
        _Utils_Tuple2("tau", 964),
        _Utils_Tuple2("upsilon", 965),
        _Utils_Tuple2("phi", 966),
        _Utils_Tuple2("chi", 967),
        _Utils_Tuple2("psi", 968),
        _Utils_Tuple2("omega", 969),
        _Utils_Tuple2("thetasym", 977),
        _Utils_Tuple2("upsih", 978),
        _Utils_Tuple2("piv", 982),
        _Utils_Tuple2("ensp", 8194),
        _Utils_Tuple2("emsp", 8195),
        _Utils_Tuple2("thinsp", 8201),
        _Utils_Tuple2("zwnj", 8204),
        _Utils_Tuple2("zwj", 8205),
        _Utils_Tuple2("lrm", 8206),
        _Utils_Tuple2("rlm", 8207),
        _Utils_Tuple2("ndash", 8211),
        _Utils_Tuple2("mdash", 8212),
        _Utils_Tuple2("lsquo", 8216),
        _Utils_Tuple2("rsquo", 8217),
        _Utils_Tuple2("sbquo", 8218),
        _Utils_Tuple2("ldquo", 8220),
        _Utils_Tuple2("rdquo", 8221),
        _Utils_Tuple2("bdquo", 8222),
        _Utils_Tuple2("dagger", 8224),
        _Utils_Tuple2("Dagger", 8225),
        _Utils_Tuple2("bull", 8226),
        _Utils_Tuple2("hellip", 8230),
        _Utils_Tuple2("permil", 8240),
        _Utils_Tuple2("prime", 8242),
        _Utils_Tuple2("Prime", 8243),
        _Utils_Tuple2("lsaquo", 8249),
        _Utils_Tuple2("rsaquo", 8250),
        _Utils_Tuple2("oline", 8254),
        _Utils_Tuple2("frasl", 8260),
        _Utils_Tuple2("euro", 8364),
        _Utils_Tuple2("image", 8465),
        _Utils_Tuple2("weierp", 8472),
        _Utils_Tuple2("real", 8476),
        _Utils_Tuple2("trade", 8482),
        _Utils_Tuple2("alefsym", 8501),
        _Utils_Tuple2("larr", 8592),
        _Utils_Tuple2("uarr", 8593),
        _Utils_Tuple2("rarr", 8594),
        _Utils_Tuple2("darr", 8595),
        _Utils_Tuple2("harr", 8596),
        _Utils_Tuple2("crarr", 8629),
        _Utils_Tuple2("lArr", 8656),
        _Utils_Tuple2("uArr", 8657),
        _Utils_Tuple2("rArr", 8658),
        _Utils_Tuple2("dArr", 8659),
        _Utils_Tuple2("hArr", 8660),
        _Utils_Tuple2("forall", 8704),
        _Utils_Tuple2("part", 8706),
        _Utils_Tuple2("exist", 8707),
        _Utils_Tuple2("empty", 8709),
        _Utils_Tuple2("nabla", 8711),
        _Utils_Tuple2("isin", 8712),
        _Utils_Tuple2("notin", 8713),
        _Utils_Tuple2("ni", 8715),
        _Utils_Tuple2("prod", 8719),
        _Utils_Tuple2("sum", 8721),
        _Utils_Tuple2("minus", 8722),
        _Utils_Tuple2("lowast", 8727),
        _Utils_Tuple2("radic", 8730),
        _Utils_Tuple2("prop", 8733),
        _Utils_Tuple2("infin", 8734),
        _Utils_Tuple2("ang", 8736),
        _Utils_Tuple2("and", 8743),
        _Utils_Tuple2("or", 8744),
        _Utils_Tuple2("cap", 8745),
        _Utils_Tuple2("cup", 8746),
        _Utils_Tuple2("int", 8747),
        _Utils_Tuple2("there4", 8756),
        _Utils_Tuple2("sim", 8764),
        _Utils_Tuple2("cong", 8773),
        _Utils_Tuple2("asymp", 8776),
        _Utils_Tuple2("ne", 8800),
        _Utils_Tuple2("equiv", 8801),
        _Utils_Tuple2("le", 8804),
        _Utils_Tuple2("ge", 8805),
        _Utils_Tuple2("sub", 8834),
        _Utils_Tuple2("sup", 8835),
        _Utils_Tuple2("nsub", 8836),
        _Utils_Tuple2("sube", 8838),
        _Utils_Tuple2("supe", 8839),
        _Utils_Tuple2("oplus", 8853),
        _Utils_Tuple2("otimes", 8855),
        _Utils_Tuple2("perp", 8869),
        _Utils_Tuple2("sdot", 8901),
        _Utils_Tuple2("lceil", 8968),
        _Utils_Tuple2("rceil", 8969),
        _Utils_Tuple2("lfloor", 8970),
        _Utils_Tuple2("rfloor", 8971),
        _Utils_Tuple2("lang", 9001),
        _Utils_Tuple2("rang", 9002),
        _Utils_Tuple2("loz", 9674),
        _Utils_Tuple2("spades", 9824),
        _Utils_Tuple2("clubs", 9827),
        _Utils_Tuple2("hearts", 9829),
        _Utils_Tuple2("diams", 9830)
    ]));
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity = function(match) {
        var _v0 = match.submatches;
        if (_v0.b && _v0.a.$ === "Just") {
            var first = _v0.a.a;
            var _v1 = A2($elm$core$Dict$get, first, $dillonkearns$elm_markdown$Markdown$Entity$entities);
            if (_v1.$ === "Just") {
                var code = _v1.a;
                return $elm$core$String$fromChar($elm$core$Char$fromCode(code));
            } else return match.match;
        } else return match.match;
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntities = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity);
    var $dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\+)([!\"#$%&\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])"));
    var $elm$core$Bitwise$and = _Bitwise_and;
    var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
    var $elm$core$String$repeatHelp = F3(function(n, chunk, result) {
        return n <= 0 ? result : A3($elm$core$String$repeatHelp, n >> 1, _Utils_ap(chunk, chunk), !(n & 1) ? result : _Utils_ap(result, chunk));
    });
    var $elm$core$String$repeat = F2(function(n, chunk) {
        return A3($elm$core$String$repeatHelp, n, chunk, "");
    });
    var $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex, function(regexMatch) {
        var _v0 = regexMatch.submatches;
        if (_v0.b && _v0.a.$ === "Just" && _v0.b.b && _v0.b.a.$ === "Just") {
            var backslashes = _v0.a.a;
            var _v1 = _v0.b;
            var escapedStr = _v1.a.a;
            return _Utils_ap(A2($elm$core$String$repeat, $elm$core$String$length(backslashes) / 2 | 0, "\\"), escapedStr);
        } else return regexMatch.match;
    });
    var $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("&#[Xx]([0-9a-fA-F]{1,8});"));
    var $elm$core$String$foldl = _String_foldl;
    var $dillonkearns$elm_markdown$Markdown$Entity$hexToInt = function(string) {
        var folder = F2(function(hexDigit, _int) {
            return _int * 16 + A2($elm$core$Basics$modBy, 39, $elm$core$Char$toCode(hexDigit)) - 9;
        });
        return A3($elm$core$String$foldl, folder, 0, $elm$core$String$toLower(string));
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal = function(match) {
        var _v0 = match.submatches;
        if (_v0.b && _v0.a.$ === "Just") {
            var first = _v0.a.a;
            return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode($dillonkearns$elm_markdown$Markdown$Entity$hexToInt(first));
        } else return match.match;
    };
    var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal);
    var $dillonkearns$elm_markdown$Markdown$Helpers$formatStr = function(str) {
        var withEscapes = $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable(str);
        return $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand(withEscapes) ? $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals($dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals($dillonkearns$elm_markdown$Markdown$Entity$replaceEntities(withEscapes))) : withEscapes;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch = function(text) {
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: 0,
            matches: _List_Nil,
            start: 0,
            text: $dillonkearns$elm_markdown$Markdown$Helpers$formatStr(text),
            textEnd: 0,
            textStart: 0,
            type_: $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType
        });
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch = F3(function(rawText, _v2, parsedMatches) {
        var matchModel = _v2.a;
        var updtMatch = $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: matchModel.end,
            matches: A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches, matchModel.text, _List_Nil, matchModel.matches),
            start: matchModel.start,
            text: matchModel.text,
            textEnd: matchModel.textEnd,
            textStart: matchModel.textStart,
            type_: matchModel.type_
        });
        if (!parsedMatches.b) {
            var finalStr = A2($elm$core$String$dropLeft, matchModel.end, rawText);
            return $elm$core$String$isEmpty(finalStr) ? _List_fromArray([
                updtMatch
            ]) : _List_fromArray([
                updtMatch,
                $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(finalStr)
            ]);
        } else {
            var matchHead = parsedMatches.a.a;
            var matchesTail = parsedMatches.b;
            var _v4 = matchHead.type_;
            if (_v4.$ === "NormalType") return A2($elm$core$List$cons, updtMatch, parsedMatches);
            else return _Utils_eq(matchModel.end, matchHead.start) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : _Utils_cmp(matchModel.end, matchHead.start) < 0 ? A2($elm$core$List$cons, updtMatch, A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(A3($elm$core$String$slice, matchModel.end, matchHead.start, rawText)), parsedMatches)) : parsedMatches;
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches = F3(function(rawText, parsedMatches, matches) {
        parseTextMatches: while(true)if (!matches.b) {
            if (!parsedMatches.b) return $elm$core$String$isEmpty(rawText) ? _List_Nil : _List_fromArray([
                $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(rawText)
            ]);
            else {
                var matchModel = parsedMatches.a.a;
                return matchModel.start > 0 ? A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(A2($elm$core$String$left, matchModel.start, rawText)), parsedMatches) : parsedMatches;
            }
        } else {
            var match = matches.a;
            var matchesTail = matches.b;
            var $temp$rawText = rawText, $temp$parsedMatches = A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch, rawText, match, parsedMatches), $temp$matches = matchesTail;
            rawText = $temp$rawText;
            parsedMatches = $temp$parsedMatches;
            matches = $temp$matches;
            continue parseTextMatches;
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(\\<)"));
    var $elm$core$List$maybeCons = F3(function(f, mx, xs) {
        var _v0 = f(mx);
        if (_v0.$ === "Just") {
            var x = _v0.a;
            return A2($elm$core$List$cons, x, xs);
        } else return xs;
    });
    var $elm$core$List$filterMap = F2(function(f, xs) {
        return A3($elm$core$List$foldr, $elm$core$List$maybeCons(f), _List_Nil, xs);
    });
    var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
    var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen = {
        $: "AngleBracketOpen"
    };
    var $dillonkearns$elm_markdown$Markdown$Helpers$isEven = function(_int) {
        return !A2($elm$core$Basics$modBy, 2, _int);
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var delimiter = _v1.a.a;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just({
                index: regMatch.index + backslashesLength,
                length: 1,
                meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen
            }) : $elm$core$Maybe$Nothing;
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(\\>)"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose = function(a) {
        return {
            $: "AngleBracketClose",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$Escaped = {
        $: "Escaped"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped = {
        $: "NotEscaped"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            return $elm$core$Maybe$Just({
                index: regMatch.index + backslashesLength,
                length: 1,
                meaning: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped) : $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped)
            });
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)([^*])?(\\*+)([^*])?"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken = F2(function(a, b) {
        return {
            $: "EmphasisToken",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation = function(c) {
        switch(c.valueOf()){
            case "!":
                return true;
            case '"':
                return true;
            case "#":
                return true;
            case "%":
                return true;
            case "&":
                return true;
            case "'":
                return true;
            case "(":
                return true;
            case ")":
                return true;
            case "*":
                return true;
            case ",":
                return true;
            case "-":
                return true;
            case ".":
                return true;
            case "/":
                return true;
            case ":":
                return true;
            case ";":
                return true;
            case "?":
                return true;
            case "@":
                return true;
            case "[":
                return true;
            case "]":
                return true;
            case "_":
                return true;
            case "{":
                return true;
            case "}":
                return true;
            case "~":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation = A2($elm$core$String$foldl, F2(function(c, accum) {
        return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation(c);
    }), false);
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace = function(c) {
        switch(c.valueOf()){
            case " ":
                return true;
            case "\f":
                return true;
            case "\n":
                return true;
            case "\r":
                return true;
            case "	":
                return true;
            case "\v":
                return true;
            case "\xa0":
                return true;
            case "\u2028":
                return true;
            case "\u2029":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace = A2($elm$core$String$foldl, F2(function(c, accum) {
        return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace(c);
    }), false);
    var $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank = function(mstring) {
        if (mstring.$ === "Just") {
            var string = mstring.a;
            return $elm$core$String$isEmpty(string) || $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace(string) ? 0 : $dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation(string) ? 1 : 2;
        } else return 0;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken = F3(function(_char, rawText, regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.b.b && _v0.b.b.a.$ === "Just" && _v0.b.b.b.b) {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var maybeLeftFringe = _v1.a;
            var _v2 = _v1.b;
            var delimiter = _v2.a.a;
            var _v3 = _v2.b;
            var maybeRightFringe = _v3.a;
            var rFringeRank = $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(maybeRightFringe);
            var leftFringeLength = function() {
                if (maybeLeftFringe.$ === "Just") {
                    var left = maybeLeftFringe.a;
                    return $elm$core$String$length(left);
                } else return 0;
            }();
            var mLeftFringe = !!regMatch.index && !leftFringeLength ? $elm$core$Maybe$Just(A3($elm$core$String$slice, regMatch.index - 1, regMatch.index, rawText)) : maybeLeftFringe;
            var backslashesLength = function() {
                if (maybeBackslashes.$ === "Just") {
                    var backslashes = maybeBackslashes.a;
                    return $elm$core$String$length(backslashes);
                } else return 0;
            }();
            var isEscaped = !$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) && !leftFringeLength || function() {
                if (mLeftFringe.$ === "Just" && mLeftFringe.a === "\\") return true;
                else return false;
            }();
            var delimiterLength = isEscaped ? $elm$core$String$length(delimiter) - 1 : $elm$core$String$length(delimiter);
            var lFringeRank = isEscaped ? 1 : $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(mLeftFringe);
            if (delimiterLength <= 0 || _Utils_eq(_char, _Utils_chr("_")) && lFringeRank === 2 && rFringeRank === 2) return $elm$core$Maybe$Nothing;
            else {
                var index = regMatch.index + backslashesLength + leftFringeLength + (isEscaped ? 1 : 0);
                return $elm$core$Maybe$Just({
                    index: index,
                    length: delimiterLength,
                    meaning: A2($dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken, _char, {
                        leftFringeRank: lFringeRank,
                        rightFringeRank: rFringeRank
                    })
                });
            }
        } else return $elm$core$Maybe$Nothing;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens = function(str) {
        return A2($elm$core$List$filterMap, A2($dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, _Utils_chr("*"), str), A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(\\`+)"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken = function(a) {
        return {
            $: "CodeToken",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var backtick = _v1.a.a;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            return $elm$core$Maybe$Just({
                index: regMatch.index + backslashesLength,
                length: $elm$core$String$length(backtick),
                meaning: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped) : $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped)
            });
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(?:(\\\\+)|( {2,}))\\n"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken = {
        $: "HardLineBreakToken"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        _v0$2: while(true){
            if (_v0.b) {
                if (_v0.a.$ === "Just") {
                    var backslashes = _v0.a.a;
                    var backslashesLength = $elm$core$String$length(backslashes);
                    return !$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just({
                        index: regMatch.index + backslashesLength - 1,
                        length: 2,
                        meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
                    }) : $elm$core$Maybe$Nothing;
                } else {
                    if (_v0.b.b && _v0.b.a.$ === "Just") {
                        var _v1 = _v0.b;
                        return $elm$core$Maybe$Just({
                            index: regMatch.index,
                            length: $elm$core$String$length(regMatch.match),
                            meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
                        });
                    } else break _v0$2;
                }
            } else break _v0$2;
        }
        return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        _v0$2: while(true){
            if (_v0.b) {
                if (_v0.a.$ === "Just") {
                    var backslashes = _v0.a.a;
                    var backslashesLength = $elm$core$String$length(backslashes);
                    return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just({
                        index: regMatch.index + backslashesLength,
                        length: 1,
                        meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
                    }) : $elm$core$Maybe$Just({
                        index: regMatch.index + backslashesLength - 1,
                        length: 2,
                        meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
                    });
                } else {
                    if (_v0.b.b) {
                        var _v1 = _v0.b;
                        var maybeSpaces = _v1.a;
                        return $elm$core$Maybe$Just({
                            index: regMatch.index,
                            length: $elm$core$String$length(regMatch.match),
                            meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
                        });
                    } else break _v0$2;
                }
            } else break _v0$2;
        }
        return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak = false;
    var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(?:(\\\\+)|( *))\\n"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens = function(str) {
        return $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak ? A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex, str)) : A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(\\])"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose = {
        $: "SquareBracketClose"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just({
                index: regMatch.index + backslashesLength,
                length: 1,
                meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose
            }) : $elm$core$Maybe$Nothing;
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(\\!)?(\\[)"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$Active = {
        $: "Active"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken = {
        $: "ImageOpenToken"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken = function(a) {
        return {
            $: "LinkOpenToken",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.b.b && _v0.b.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var maybeImageOpen = _v1.a;
            var _v2 = _v1.b;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            var isEscaped = !$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength);
            var index = isEscaped ? regMatch.index + backslashesLength + 1 : regMatch.index + backslashesLength;
            if (isEscaped) {
                if (maybeImageOpen.$ === "Just") return $elm$core$Maybe$Just({
                    index: index,
                    length: 1,
                    meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Active)
                });
                else return $elm$core$Maybe$Nothing;
            } else {
                if (maybeImageOpen.$ === "Just") return $elm$core$Maybe$Just({
                    index: index,
                    length: 2,
                    meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken
                });
                else return $elm$core$Maybe$Just({
                    index: index,
                    length: 1,
                    meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Active)
                });
            }
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken = function(a) {
        return {
            $: "StrikethroughToken",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken = function(regMatch) {
        var _v0 = regMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.a.$ === "Just") {
            var maybeBackslashes = _v0.a;
            var _v1 = _v0.b;
            var tilde = _v1.a.a;
            var backslashesLength = A2($elm$core$Maybe$withDefault, 0, A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
            var _v2 = $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? _Utils_Tuple2($elm$core$String$length(tilde), $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped)) : _Utils_Tuple2($elm$core$String$length(tilde), $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped));
            var length = _v2.a;
            var meaning = _v2.b;
            return $elm$core$Maybe$Just({
                index: regMatch.index + backslashesLength,
                length: length,
                meaning: meaning
            });
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)(~{2,})([^~])?"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens = function(str) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken, A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("(\\\\*)([^_])?(\\_+)([^_])?"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens = function(str) {
        return A2($elm$core$List$filterMap, A2($dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, _Utils_chr("_"), str), A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex, str));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex = F2(function(left, right) {
        if (left.b) {
            var lfirst = left.a;
            var lrest = left.b;
            if (right.b) {
                var rfirst = right.a;
                var rrest = right.b;
                return _Utils_cmp(lfirst.index, rfirst.index) < 0 ? A2($elm$core$List$cons, lfirst, A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, lrest, right)) : A2($elm$core$List$cons, rfirst, A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, left, rrest));
            } else return left;
        } else return right;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize = function(rawText) {
        return A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens(rawText), A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, $dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens(rawText), $dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens(rawText)))))))));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType = {
        $: "CodeType"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType = function(a) {
        return {
            $: "EmphasisType",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType = function(a) {
        return {
            $: "HtmlType",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType = function(a) {
        return {
            $: "ImageType",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$Inactive = {
        $: "Inactive"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType = function(a) {
        return {
            $: "LinkType",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType = {
        $: "StrikethroughType"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType = function(a) {
        return {
            $: "AutolinkType",
            a: a
        };
    };
    var $elm$regex$Regex$contains = _Regex_contains;
    var $dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)"));
    var $elm$url$Url$percentDecode = _Url_percentDecode;
    var $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl = A2($elm$core$Basics$composeR, $elm$url$Url$percentEncode, A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex, function(match) {
        return A2($elm$core$Maybe$withDefault, match.match, $elm$url$Url$percentDecode(match.match));
    }));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch = function(_v0) {
        var match = _v0.a;
        return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex, match.text) ? $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$InlineParser$Match(_Utils_update(match, {
            type_: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(_Utils_Tuple2(match.text, $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.text)))
        }))) : $elm$core$Result$Err($dillonkearns$elm_markdown$Markdown$InlineParser$Match(match));
    };
    var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
    var $elm$core$List$head = function(list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return $elm$core$Maybe$Just(x);
        } else return $elm$core$Maybe$Nothing;
    };
    var $dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex = "[^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*";
    var $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("^\\[\\s*(" + ($dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex + ")\\s*\\]")));
    var $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces = function(original) {
        return original;
    };
    var $dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel = A2($elm$core$Basics$composeR, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $elm$core$String$toLower);
    var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle = F2(function(rawUrl, maybeTitle) {
        return _Utils_Tuple2($dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl($dillonkearns$elm_markdown$Markdown$Helpers$formatStr(rawUrl)), A2($elm$core$Maybe$map, $dillonkearns$elm_markdown$Markdown$Helpers$formatStr, maybeTitle));
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch = F3(function(matchModel, references, maybeRegexMatch) {
        var refLabel = function(str) {
            return $elm$core$String$isEmpty(str) ? matchModel.text : str;
        }(A2($elm$core$Maybe$withDefault, matchModel.text, A2($elm$core$Maybe$withDefault, $elm$core$Maybe$Nothing, A2($elm$core$Maybe$andThen, A2($elm$core$Basics$composeR, function($) {
            return $.submatches;
        }, $elm$core$List$head), maybeRegexMatch))));
        var _v0 = A2($elm$core$Dict$get, $dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel(refLabel), references);
        if (_v0.$ === "Nothing") return $elm$core$Maybe$Nothing;
        else {
            var _v1 = _v0.a;
            var rawUrl = _v1.a;
            var maybeTitle = _v1.b;
            var type_ = function() {
                var _v3 = matchModel.type_;
                if (_v3.$ === "ImageType") return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
                else return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
            }();
            var regexMatchLength = function() {
                if (maybeRegexMatch.$ === "Just") {
                    var match = maybeRegexMatch.a.match;
                    return $elm$core$String$length(match);
                } else return 0;
            }();
            return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$InlineParser$Match(_Utils_update(matchModel, {
                end: matchModel.end + regexMatchLength,
                type_: type_
            })));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences = F3(function(remainText, _v0, references) {
        var tempMatch = _v0.a;
        var matches = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex, remainText);
        return A3($dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch, tempMatch, references, $elm$core$List$head(matches));
    });
    var $dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars = "\\f\\v\\r\\n";
    var $dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars = " \\t\\f\\v\\r\\n";
    var $dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex = "(?:<([^<>" + ($dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars + ("]*)>|([^" + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + ("\\(\\)\\\\]*(?:\\\\.[^" + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + "\\(\\)\\\\]*)*))")))));
    var $dillonkearns$elm_markdown$Markdown$Helpers$titleRegex = "(?:[" + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + "]+(?:'([^'\\\\]*(?:\\\\.[^'\\\\]*)*)'|\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?");
    var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("^\\(\\s*" + ($dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex + ($dillonkearns$elm_markdown$Markdown$Helpers$titleRegex + "\\s*\\)"))));
    var $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust = function(maybes) {
        var process = F2(function(a, maybeFound) {
            if (maybeFound.$ === "Just") {
                var found = maybeFound.a;
                return $elm$core$Maybe$Just(found);
            } else return a;
        });
        return A3($elm$core$List$foldl, process, $elm$core$Maybe$Nothing, maybes);
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch = F2(function(matchModel, regexMatch) {
        var _v0 = regexMatch.submatches;
        if (_v0.b && _v0.b.b && _v0.b.b.b && _v0.b.b.b.b && _v0.b.b.b.b.b) {
            var maybeRawUrlAngleBrackets = _v0.a;
            var _v1 = _v0.b;
            var maybeRawUrlWithoutBrackets = _v1.a;
            var _v2 = _v1.b;
            var maybeTitleSingleQuotes = _v2.a;
            var _v3 = _v2.b;
            var maybeTitleDoubleQuotes = _v3.a;
            var _v4 = _v3.b;
            var maybeTitleParenthesis = _v4.a;
            var maybeTitle = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(_List_fromArray([
                maybeTitleSingleQuotes,
                maybeTitleDoubleQuotes,
                maybeTitleParenthesis
            ]));
            var toMatch = function(rawUrl) {
                return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(_Utils_update(matchModel, {
                    end: matchModel.end + $elm$core$String$length(regexMatch.match),
                    type_: (function() {
                        var _v5 = matchModel.type_;
                        if (_v5.$ === "ImageType") return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType;
                        else return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType;
                    })()(A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle))
                }));
            };
            var maybeRawUrl = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(_List_fromArray([
                maybeRawUrlAngleBrackets,
                maybeRawUrlWithoutBrackets
            ]));
            return $elm$core$Maybe$Just(toMatch(A2($elm$core$Maybe$withDefault, "", maybeRawUrl)));
        } else return $elm$core$Maybe$Nothing;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType = F3(function(remainText, _v0, refs) {
        var tempMatch = _v0.a;
        var _v1 = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex, remainText);
        if (_v1.b) {
            var first = _v1.a;
            var _v2 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch, tempMatch, first);
            if (_v2.$ === "Just") {
                var match = _v2.a;
                return $elm$core$Maybe$Just(match);
            } else return A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences, remainText, $dillonkearns$elm_markdown$Markdown$InlineParser$Match(tempMatch), refs);
        } else return A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences, remainText, $dillonkearns$elm_markdown$Markdown$InlineParser$Match(tempMatch), refs);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping = F2(function(_v0, remainMatches) {
        var match = _v0.a;
        var overlappingMatches = $elm$core$List$filter(function(_v1) {
            var testMatch = _v1.a;
            return _Utils_cmp(match.end, testMatch.start) > 0 && _Utils_cmp(match.end, testMatch.end) < 0;
        });
        return $elm$core$List$isEmpty(remainMatches) || $elm$core$List$isEmpty(overlappingMatches(remainMatches)) ? $elm$core$Maybe$Just(A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$InlineParser$Match(match), remainMatches)) : $elm$core$Maybe$Nothing;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex = A2($elm$core$Maybe$withDefault, $elm$regex$Regex$never, $elm$regex$Regex$fromString("^([a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$"));
    var $dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch = function(_v0) {
        var match = _v0.a;
        return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex, match.text) ? $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$InlineParser$Match(_Utils_update(match, {
            type_: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(_Utils_Tuple2(match.text, "mailto:" + $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.text)))
        }))) : $elm$core$Result$Err($dillonkearns$elm_markdown$Markdown$InlineParser$Match(match));
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp = F3(function(innerTokens, isToken, tokens) {
        findTokenHelp: while(true){
            if (!tokens.b) return $elm$core$Maybe$Nothing;
            else {
                var nextToken = tokens.a;
                var remainingTokens = tokens.b;
                if (isToken(nextToken)) return $elm$core$Maybe$Just(_Utils_Tuple3(nextToken, $elm$core$List$reverse(innerTokens), remainingTokens));
                else {
                    var $temp$innerTokens = A2($elm$core$List$cons, nextToken, innerTokens), $temp$isToken = isToken, $temp$tokens = remainingTokens;
                    innerTokens = $temp$innerTokens;
                    isToken = $temp$isToken;
                    tokens = $temp$tokens;
                    continue findTokenHelp;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$findToken = F2(function(isToken, tokens) {
        return A3($dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp, _List_Nil, isToken, tokens);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken = F2(function(a, b) {
        return {
            $: "HtmlToken",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$NotOpening = {
        $: "NotOpening"
    };
    var $elm$parser$Parser$Advanced$getOffset = $elm$parser$Parser$Advanced$Parser(function(s) {
        return A3($elm$parser$Parser$Advanced$Good, false, s.offset, s);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken = F2(function(rawText, _v0) {
        var match = _v0.a;
        var consumedCharacters = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed(F3(function(startOffset, htmlTag, endOffset) {
            return {
                htmlTag: htmlTag,
                length: endOffset - startOffset
            };
        })), $elm$parser$Parser$Advanced$getOffset), $dillonkearns$elm_markdown$HtmlParser$html), $elm$parser$Parser$Advanced$getOffset);
        var parsed = A2($elm$parser$Parser$Advanced$run, consumedCharacters, A2($elm$core$String$dropLeft, match.start, rawText));
        if (parsed.$ === "Ok") {
            var htmlTag = parsed.a.htmlTag;
            var length = parsed.a.length;
            var htmlToken = A2($dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken, $dillonkearns$elm_markdown$Markdown$InlineParser$NotOpening, htmlTag);
            return $elm$core$Maybe$Just({
                index: match.start,
                length: length,
                meaning: htmlToken
            });
        } else return $elm$core$Maybe$Nothing;
    });
    var $dillonkearns$elm_markdown$Markdown$Helpers$ifError = F2(function(_function, result) {
        if (result.$ === "Ok") return result;
        else {
            var err = result.a;
            return _function(err);
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isCloseToken = F2(function(htmlModel, token) {
        return false;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair = F2(function(closeToken, openToken) {
        var _v0 = openToken.meaning;
        if (_v0.$ === "CodeToken") {
            if (_v0.a.$ === "Escaped") {
                var _v1 = _v0.a;
                return _Utils_eq(openToken.length - 1, closeToken.length);
            } else {
                var _v2 = _v0.a;
                return _Utils_eq(openToken.length, closeToken.length);
            }
        } else return false;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken = function(token) {
        var _v0 = token.meaning;
        switch(_v0.$){
            case "LinkOpenToken":
                return true;
            case "ImageOpenToken":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken = F2(function(closeToken, openToken) {
        var _v0 = openToken.meaning;
        if (_v0.$ === "EmphasisToken") {
            var openChar = _v0.a;
            var open = _v0.b;
            var _v1 = closeToken.meaning;
            if (_v1.$ === "EmphasisToken") {
                var closeChar = _v1.a;
                var close = _v1.b;
                return _Utils_eq(openChar, closeChar) ? _Utils_eq(open.leftFringeRank, open.rightFringeRank) || _Utils_eq(close.leftFringeRank, close.rightFringeRank) ? !!A2($elm$core$Basics$modBy, 3, closeToken.length + openToken.length) : true : false;
            } else return false;
        } else return false;
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair = F2(function(closeToken, openToken) {
        var _v0 = function() {
            var _v1 = openToken.meaning;
            if (_v1.$ === "StrikethroughToken") {
                if (_v1.a.$ === "Escaped") {
                    var _v2 = _v1.a;
                    return _Utils_Tuple2(true, openToken.length - 1);
                } else {
                    var _v3 = _v1.a;
                    return _Utils_Tuple2(true, openToken.length);
                }
            } else return _Utils_Tuple2(false, 0);
        }();
        var openTokenIsStrikethrough = _v0.a;
        var openTokenLength = _v0.b;
        var _v4 = function() {
            var _v5 = closeToken.meaning;
            if (_v5.$ === "StrikethroughToken") {
                if (_v5.a.$ === "Escaped") {
                    var _v6 = _v5.a;
                    return _Utils_Tuple2(true, closeToken.length - 1);
                } else {
                    var _v7 = _v5.a;
                    return _Utils_Tuple2(true, closeToken.length);
                }
            } else return _Utils_Tuple2(false, 0);
        }();
        var closeTokenIsStrikethrough = _v4.a;
        var closeTokenLength = _v4.b;
        return closeTokenIsStrikethrough && openTokenIsStrikethrough && _Utils_eq(closeTokenLength, openTokenLength);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType = {
        $: "HardLineBreakType"
    };
    var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch = F2(function(token, type_) {
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: token.index + token.length,
            matches: _List_Nil,
            start: token.index,
            text: "",
            textEnd: 0,
            textStart: 0,
            type_: type_
        });
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM = F5(function(remaining, tokens, matches, refs, rawText) {
        lineBreakTTM: while(true){
            if (!remaining.b) return matches;
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v1 = token.meaning;
                if (_v1.$ === "HardLineBreakToken") {
                    var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType), matches), $temp$refs = refs, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    refs = $temp$refs;
                    rawText = $temp$rawText;
                    continue lineBreakTTM;
                } else {
                    var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$refs = refs, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    refs = $temp$refs;
                    rawText = $temp$rawText;
                    continue lineBreakTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens = F2(function(_v0, tokensTail) {
        var match = _v0.a;
        return A2($elm$core$List$filter, function(token) {
            return _Utils_cmp(token.index, match.end) > -1;
        }, tokensTail);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch = F6(function(closeToken, escaped, matches, references, rawText, _v46) {
        var openToken = _v46.a;
        var remainTokens = _v46.c;
        var result = A2($dillonkearns$elm_markdown$Markdown$Helpers$ifError, $dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch, $dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch(A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, function(s) {
            return s;
        }, $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType, openToken, closeToken, _List_Nil)));
        if (result.$ === "Err") {
            var tempMatch = result.a;
            if (escaped.$ === "NotEscaped") {
                var _v49 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken, rawText, tempMatch);
                if (_v49.$ === "Just") {
                    var newToken = _v49.a;
                    return $elm$core$Maybe$Just(_Utils_Tuple2(A2($elm$core$List$cons, newToken, remainTokens), matches));
                } else return $elm$core$Maybe$Nothing;
            } else return $elm$core$Maybe$Nothing;
        } else {
            var newMatch = result.a;
            return $elm$core$Maybe$Just(_Utils_Tuple2(remainTokens, A2($elm$core$List$cons, newMatch, matches)));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM = F5(function(remaining, tokens, matches, references, rawText) {
        codeAutolinkTypeHtmlTagTTM: while(true){
            if (!remaining.b) return A5($dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM, $elm$core$List$reverse(tokens), _List_Nil, matches, references, rawText);
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v38 = token.meaning;
                switch(_v38.$){
                    case "CodeToken":
                        var isEscaped = _v38.a;
                        var _v39 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair(token), tokens);
                        if (_v39.$ === "Just") {
                            var code = _v39.a;
                            var _v40 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch, token, matches, references, rawText, code);
                            var newTokens = _v40.a;
                            var newMatches = _v40.b;
                            var $temp$remaining = tokensTail, $temp$tokens = newTokens, $temp$matches = newMatches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue codeAutolinkTypeHtmlTagTTM;
                        } else {
                            var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue codeAutolinkTypeHtmlTagTTM;
                        }
                    case "AngleBracketClose":
                        var isEscaped = _v38.a;
                        var isAngleBracketOpen = function(_v45) {
                            var meaning = _v45.meaning;
                            if (meaning.$ === "AngleBracketOpen") return true;
                            else return false;
                        };
                        var _v41 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, isAngleBracketOpen, tokens);
                        if (_v41.$ === "Just") {
                            var found = _v41.a;
                            var _v42 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch, token, isEscaped, matches, references, rawText, found);
                            if (_v42.$ === "Just") {
                                var _v43 = _v42.a;
                                var newTokens = _v43.a;
                                var newMatches = _v43.b;
                                var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$filter, A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen), newTokens), $temp$matches = newMatches, $temp$references = references, $temp$rawText = rawText;
                                remaining = $temp$remaining;
                                tokens = $temp$tokens;
                                matches = $temp$matches;
                                references = $temp$references;
                                rawText = $temp$rawText;
                                continue codeAutolinkTypeHtmlTagTTM;
                            } else {
                                var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$filter, A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen), tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                                remaining = $temp$remaining;
                                tokens = $temp$tokens;
                                matches = $temp$matches;
                                references = $temp$references;
                                rawText = $temp$rawText;
                                continue codeAutolinkTypeHtmlTagTTM;
                            }
                        } else {
                            var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$filter, A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen), tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue codeAutolinkTypeHtmlTagTTM;
                        }
                    default:
                        var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue codeAutolinkTypeHtmlTagTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch = F5(function(closeToken, matches, references, rawText, _v34) {
        var openToken = _v34.a;
        var remainTokens = _v34.c;
        var updatedOpenToken = function() {
            var _v35 = openToken.meaning;
            if (_v35.$ === "CodeToken" && _v35.a.$ === "Escaped") {
                var _v36 = _v35.a;
                return _Utils_update(openToken, {
                    index: openToken.index + 1,
                    length: openToken.length - 1
                });
            } else return openToken;
        }();
        var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType, updatedOpenToken, closeToken, _List_Nil);
        return _Utils_Tuple2(remainTokens, A2($elm$core$List$cons, match, matches));
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM = F5(function(remaining, tokens, matches, references, rawText) {
        emphasisTTM: while(true){
            if (!remaining.b) return A5($dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM, $elm$core$List$reverse(tokens), _List_Nil, matches, references, rawText);
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v29 = token.meaning;
                if (_v29.$ === "EmphasisToken") {
                    var _char = _v29.a;
                    var leftFringeRank = _v29.b.leftFringeRank;
                    var rightFringeRank = _v29.b.rightFringeRank;
                    if (_Utils_eq(leftFringeRank, rightFringeRank)) {
                        if (!!rightFringeRank && (!_Utils_eq(_char, _Utils_chr("_")) || rightFringeRank === 1)) {
                            var _v30 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token), tokens);
                            if (_v30.$ === "Just") {
                                var found = _v30.a;
                                var _v31 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
                                var newRemaining = _v31.a;
                                var match = _v31.b;
                                var newTokens = _v31.c;
                                var $temp$remaining = newRemaining, $temp$tokens = newTokens, $temp$matches = A2($elm$core$List$cons, match, matches), $temp$references = references, $temp$rawText = rawText;
                                remaining = $temp$remaining;
                                tokens = $temp$tokens;
                                matches = $temp$matches;
                                references = $temp$references;
                                rawText = $temp$rawText;
                                continue emphasisTTM;
                            } else {
                                var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                                remaining = $temp$remaining;
                                tokens = $temp$tokens;
                                matches = $temp$matches;
                                references = $temp$references;
                                rawText = $temp$rawText;
                                continue emphasisTTM;
                            }
                        } else {
                            var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue emphasisTTM;
                        }
                    } else if (_Utils_cmp(leftFringeRank, rightFringeRank) < 0) {
                        var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue emphasisTTM;
                    } else {
                        var _v32 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token), tokens);
                        if (_v32.$ === "Just") {
                            var found = _v32.a;
                            var _v33 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
                            var newRemaining = _v33.a;
                            var match = _v33.b;
                            var newTokens = _v33.c;
                            var $temp$remaining = newRemaining, $temp$tokens = newTokens, $temp$matches = A2($elm$core$List$cons, match, matches), $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue emphasisTTM;
                        } else {
                            var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue emphasisTTM;
                        }
                    }
                } else {
                    var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    references = $temp$references;
                    rawText = $temp$rawText;
                    continue emphasisTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch = F5(function(references, rawText, closeToken, tokensTail, _v27) {
        var openToken = _v27.a;
        var innerTokens = _v27.b;
        var remainTokens = _v27.c;
        var remainLength = openToken.length - closeToken.length;
        var updt = !remainLength ? {
            closeToken: closeToken,
            openToken: openToken,
            remainTokens: remainTokens,
            tokensTail: tokensTail
        } : remainLength > 0 ? {
            closeToken: closeToken,
            openToken: _Utils_update(openToken, {
                index: openToken.index + remainLength,
                length: closeToken.length
            }),
            remainTokens: A2($elm$core$List$cons, _Utils_update(openToken, {
                length: remainLength
            }), remainTokens),
            tokensTail: tokensTail
        } : {
            closeToken: _Utils_update(closeToken, {
                length: openToken.length
            }),
            openToken: openToken,
            remainTokens: remainTokens,
            tokensTail: A2($elm$core$List$cons, _Utils_update(closeToken, {
                index: closeToken.index + openToken.length,
                length: -remainLength
            }), tokensTail)
        };
        var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, function(s) {
            return s;
        }, $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType(updt.openToken.length), updt.openToken, updt.closeToken, $elm$core$List$reverse(innerTokens));
        return _Utils_Tuple3(updt.tokensTail, match, updt.remainTokens);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM = F5(function(remaining, tokens, matches, references, rawText) {
        htmlElementTTM: while(true){
            if (!remaining.b) return A5($dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM, $elm$core$List$reverse(tokens), _List_Nil, matches, references, rawText);
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v23 = token.meaning;
                if (_v23.$ === "HtmlToken") {
                    var isOpen = _v23.a;
                    var htmlModel = _v23.b;
                    if (isOpen.$ === "NotOpening") {
                        var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)), matches), $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue htmlElementTTM;
                    } else {
                        var _v25 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isCloseToken(htmlModel), tokensTail);
                        if (_v25.$ === "Nothing") {
                            var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = A2($elm$core$List$cons, A2($dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)), matches), $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue htmlElementTTM;
                        } else {
                            var _v26 = _v25.a;
                            var closeToken = _v26.a;
                            var innerTokens = _v26.b;
                            var newTail = _v26.c;
                            var newMatch = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, function(s) {
                                return s;
                            }, $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel), token, closeToken, innerTokens);
                            var $temp$remaining = newTail, $temp$tokens = tokens, $temp$matches = A2($elm$core$List$cons, newMatch, matches), $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue htmlElementTTM;
                        }
                    }
                } else {
                    var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    references = $temp$references;
                    rawText = $temp$rawText;
                    continue htmlElementTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM = F5(function(remaining, tokens, matches, references, rawText) {
        linkImageTypeTTM: while(true){
            if (!remaining.b) return A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM, $elm$core$List$reverse(tokens), _List_Nil, matches, references, rawText);
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v18 = token.meaning;
                if (_v18.$ === "SquareBracketClose") {
                    var _v19 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken, tokens);
                    if (_v19.$ === "Just") {
                        var found = _v19.a;
                        var _v20 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch, token, tokensTail, matches, references, rawText, found);
                        if (_v20.$ === "Just") {
                            var _v21 = _v20.a;
                            var x = _v21.a;
                            var newMatches = _v21.b;
                            var newTokens = _v21.c;
                            var $temp$remaining = x, $temp$tokens = newTokens, $temp$matches = newMatches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue linkImageTypeTTM;
                        } else {
                            var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                            remaining = $temp$remaining;
                            tokens = $temp$tokens;
                            matches = $temp$matches;
                            references = $temp$references;
                            rawText = $temp$rawText;
                            continue linkImageTypeTTM;
                        }
                    } else {
                        var $temp$remaining = tokensTail, $temp$tokens = tokens, $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue linkImageTypeTTM;
                    }
                } else {
                    var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    references = $temp$references;
                    rawText = $temp$rawText;
                    continue linkImageTypeTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch = F6(function(closeToken, tokensTail, oldMatches, references, rawText, _v8) {
        var openToken = _v8.a;
        var innerTokens = _v8.b;
        var remainTokens = _v8.c;
        var removeOpenToken = _Utils_Tuple3(tokensTail, oldMatches, _Utils_ap(innerTokens, remainTokens));
        var remainText = A2($elm$core$String$dropLeft, closeToken.index + 1, rawText);
        var inactivateLinkOpenToken = function(token) {
            var _v16 = token.meaning;
            if (_v16.$ === "LinkOpenToken") return _Utils_update(token, {
                meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Inactive)
            });
            else return token;
        };
        var findTempMatch = function(isLinkType) {
            return A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, function(s) {
                return s;
            }, isLinkType ? $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(_Utils_Tuple2("", $elm$core$Maybe$Nothing)) : $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(_Utils_Tuple2("", $elm$core$Maybe$Nothing)), openToken, closeToken, $elm$core$List$reverse(innerTokens));
        };
        var _v9 = openToken.meaning;
        switch(_v9.$){
            case "ImageOpenToken":
                var tempMatch = findTempMatch(false);
                var _v10 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
                if (_v10.$ === "Nothing") return $elm$core$Maybe$Just(removeOpenToken);
                else {
                    var match = _v10.a;
                    var _v11 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
                    if (_v11.$ === "Just") {
                        var matches = _v11.a;
                        return $elm$core$Maybe$Just(_Utils_Tuple3(A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail), matches, remainTokens));
                    } else return $elm$core$Maybe$Just(removeOpenToken);
                }
            case "LinkOpenToken":
                if (_v9.a.$ === "Active") {
                    var _v12 = _v9.a;
                    var tempMatch = findTempMatch(true);
                    var _v13 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
                    if (_v13.$ === "Nothing") return $elm$core$Maybe$Just(removeOpenToken);
                    else {
                        var match = _v13.a;
                        var _v14 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
                        if (_v14.$ === "Just") {
                            var matches = _v14.a;
                            return $elm$core$Maybe$Just(_Utils_Tuple3(A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail), matches, A2($elm$core$List$map, inactivateLinkOpenToken, remainTokens)));
                        } else return $elm$core$Maybe$Just(removeOpenToken);
                    }
                } else {
                    var _v15 = _v9.a;
                    return $elm$core$Maybe$Just(removeOpenToken);
                }
            default:
                return $elm$core$Maybe$Nothing;
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM = F5(function(remaining, tokens, matches, references, rawText) {
        strikethroughTTM: while(true){
            if (!remaining.b) return A5($dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM, $elm$core$List$reverse(tokens), _List_Nil, matches, references, rawText);
            else {
                var token = remaining.a;
                var tokensTail = remaining.b;
                var _v5 = token.meaning;
                if (_v5.$ === "StrikethroughToken") {
                    var isEscaped = _v5.a;
                    var _v6 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair(token), tokens);
                    if (_v6.$ === "Just") {
                        var content = _v6.a;
                        var _v7 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch, token, matches, references, rawText, content);
                        var newTokens = _v7.a;
                        var newMatches = _v7.b;
                        var $temp$remaining = tokensTail, $temp$tokens = newTokens, $temp$matches = newMatches, $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue strikethroughTTM;
                    } else {
                        var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                        remaining = $temp$remaining;
                        tokens = $temp$tokens;
                        matches = $temp$matches;
                        references = $temp$references;
                        rawText = $temp$rawText;
                        continue strikethroughTTM;
                    }
                } else {
                    var $temp$remaining = tokensTail, $temp$tokens = A2($elm$core$List$cons, token, tokens), $temp$matches = matches, $temp$references = references, $temp$rawText = rawText;
                    remaining = $temp$remaining;
                    tokens = $temp$tokens;
                    matches = $temp$matches;
                    references = $temp$references;
                    rawText = $temp$rawText;
                    continue strikethroughTTM;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch = F5(function(closeToken, matches, references, rawText, _v1) {
        var openToken = _v1.a;
        var remainTokens = _v1.c;
        var updatedOpenToken = function() {
            var _v2 = openToken.meaning;
            if (_v2.$ === "StrikethroughToken" && _v2.a.$ === "Escaped") {
                var _v3 = _v2.a;
                return _Utils_update(openToken, {
                    index: openToken.index + 1,
                    length: openToken.length - 1
                });
            } else return openToken;
        }();
        var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType, updatedOpenToken, closeToken, _List_Nil);
        return _Utils_Tuple2(remainTokens, A2($elm$core$List$cons, match, matches));
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch = F7(function(references, rawText, processText, type_, openToken, closeToken, innerTokens) {
        var textStart = openToken.index + openToken.length;
        var textEnd = closeToken.index;
        var text = processText(A3($elm$core$String$slice, textStart, textEnd, rawText));
        var start = openToken.index;
        var end = closeToken.index + closeToken.length;
        var match = {
            end: end,
            matches: _List_Nil,
            start: start,
            text: text,
            textEnd: textEnd,
            textStart: textStart,
            type_: type_
        };
        var matches = A2($elm$core$List$map, function(_v0) {
            var matchModel = _v0.a;
            return A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, match, matchModel);
        }, A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, innerTokens, _List_Nil, references, rawText));
        return $dillonkearns$elm_markdown$Markdown$InlineParser$Match({
            end: end,
            matches: matches,
            start: start,
            text: text,
            textEnd: textEnd,
            textStart: textStart,
            type_: type_
        });
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches = F4(function(tokens, matches, references, rawText) {
        return A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM, tokens, _List_Nil, matches, references, rawText);
    });
    var $dillonkearns$elm_markdown$Markdown$InlineParser$parse = F2(function(refs, rawText_) {
        var rawText = $elm$core$String$trim(rawText_);
        var tokens = $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize(rawText);
        return $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches, rawText, _List_Nil, $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, tokens, _List_Nil, refs, rawText))));
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, " ", $elm$parser$Parser$Expecting(" "))),
        $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, ">", $elm$parser$Parser$Expecting(">"))),
        A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Char$isAlpha, $elm$parser$Parser$Expecting("Alpha")), $elm$parser$Parser$Advanced$chompWhile(function(c) {
            return $elm$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr("-"));
        })), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, ":", $elm$parser$Parser$Expecting(":"))),
            $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, "@", $elm$parser$Parser$Expecting("@"))),
            $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, "\\", $elm$parser$Parser$Expecting("\\"))),
            $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, "+", $elm$parser$Parser$Expecting("+"))),
            $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, ".", $elm$parser$Parser$Expecting(".")))
        ])))
    ]));
    var $dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock = $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(rawLine, _v0) {
        return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(rawLine));
    }), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$token(A2($elm$parser$Parser$Advanced$Token, "<", $elm$parser$Parser$Expecting("<"))), $dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag), $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock = F2(function(language, body) {
        return {
            body: body,
            language: language
        };
    });
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$infoString = function(fenceCharacter) {
        var toInfoString = F2(function(str, _v2) {
            var _v1 = $elm$core$String$trim(str);
            if (_v1 === "") return $elm$core$Maybe$Nothing;
            else {
                var trimmed = _v1;
                return $elm$core$Maybe$Just(trimmed);
            }
        });
        var _v0 = fenceCharacter.kind;
        if (_v0.$ === "Backtick") return A2($elm$parser$Parser$Advanced$mapChompedString, toInfoString, $elm$parser$Parser$Advanced$chompWhile(function(c) {
            return !_Utils_eq(c, _Utils_chr("`")) && !$dillonkearns$elm_markdown$Whitespace$isLineEnd(c);
        }));
        else return A2($elm$parser$Parser$Advanced$mapChompedString, toInfoString, $elm$parser$Parser$Advanced$chompWhile(A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd)));
    };
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$Backtick = {
        $: "Backtick"
    };
    var $dillonkearns$elm_markdown$Parser$Token$backtick = A2($elm$parser$Parser$Advanced$Token, "`", $elm$parser$Parser$Expecting("a '`'"));
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick = {
        _char: _Utils_chr("`"),
        kind: $dillonkearns$elm_markdown$Markdown$CodeBlock$Backtick,
        token: $dillonkearns$elm_markdown$Parser$Token$backtick
    };
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation = function(_int) {
        switch(_int){
            case 1:
                return $elm$parser$Parser$Advanced$succeed(0);
            case 2:
                return $elm$parser$Parser$Advanced$succeed(1);
            case 3:
                return $elm$parser$Parser$Advanced$succeed(2);
            case 4:
                return $elm$parser$Parser$Advanced$succeed(3);
            default:
                return $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Expecting("Fenced code blocks should be indented no more than 3 spaces"));
        }
    };
    var $elm$core$List$repeatHelp = F3(function(result, n, value) {
        repeatHelp: while(true){
            if (n <= 0) return result;
            else {
                var $temp$result = A2($elm$core$List$cons, value, result), $temp$n = n - 1, $temp$value = value;
                result = $temp$result;
                n = $temp$n;
                value = $temp$value;
                continue repeatHelp;
            }
        }
    });
    var $elm$core$List$repeat = F2(function(n, value) {
        return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
    });
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast = F2(function(minLength, fenceCharacter) {
        var builtTokens = A3($elm$core$List$foldl, F2(function(t, p) {
            return A2($elm$parser$Parser$Advanced$ignorer, p, t);
        }), $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0), A2($elm$core$List$repeat, minLength, $elm$parser$Parser$Advanced$token(fenceCharacter.token)));
        return A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(str, _v0) {
            return _Utils_Tuple2(fenceCharacter, $elm$core$String$length(str));
        }), A2($elm$parser$Parser$Advanced$ignorer, builtTokens, $elm$parser$Parser$Advanced$chompWhile($elm$core$Basics$eq(fenceCharacter._char))));
    });
    var $elm$parser$Parser$Advanced$getCol = $elm$parser$Parser$Advanced$Parser(function(s) {
        return A3($elm$parser$Parser$Advanced$Good, false, s.col, s);
    });
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$Tilde = {
        $: "Tilde"
    };
    var $dillonkearns$elm_markdown$Parser$Token$tilde = A2($elm$parser$Parser$Advanced$Token, "~", $elm$parser$Parser$Expecting("a `~`"));
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde = {
        _char: _Utils_chr("~"),
        kind: $dillonkearns$elm_markdown$Markdown$CodeBlock$Tilde,
        token: $dillonkearns$elm_markdown$Parser$Token$tilde
    };
    var $dillonkearns$elm_markdown$Whitespace$space = $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$space);
    var $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Whitespace$space, $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Whitespace$space,
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ]))), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Whitespace$space,
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ]))),
        $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
    ]));
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(F2(function(indent, _v0) {
        var character = _v0.a;
        var length = _v0.b;
        return {
            character: character,
            indented: indent,
            length: length
        };
    })), $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces), A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation, $elm$parser$Parser$Advanced$getCol)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick),
        A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde)
    ])));
    var $dillonkearns$elm_markdown$Whitespace$isSpace = $elm$core$Basics$eq(_Utils_chr(" "));
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence = F2(function(minLength, fenceCharacter) {
        return A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0), $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces), A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, minLength, fenceCharacter)), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpace)), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
    });
    var $dillonkearns$elm_markdown$Parser$Extra$upTo = F2(function(n, parser) {
        var _v0 = A2($elm$core$List$repeat, n, parser);
        if (!_v0.b) return $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0);
        else {
            var firstParser = _v0.a;
            var remainingParsers = _v0.b;
            return A3($elm$core$List$foldl, F2(function(p, parsers) {
                return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
                    A2($elm$parser$Parser$Advanced$ignorer, p, parsers),
                    $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
                ]));
            }), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
                firstParser,
                $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
            ])), remainingParsers);
        }
    });
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine = function(indented) {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), A2($dillonkearns$elm_markdown$Parser$Extra$upTo, indented, $dillonkearns$elm_markdown$Whitespace$space)), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getOffset, $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
    };
    var $elm$parser$Parser$Advanced$getSource = $elm$parser$Parser$Advanced$Parser(function(s) {
        return A3($elm$parser$Parser$Advanced$Good, false, s.src, s);
    });
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp = function(_v0) {
        var fence = _v0.a;
        var body = _v0.b;
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(body)), $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd)),
            A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(lineEnd, _v1) {
                return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple2(fence, _Utils_ap(body, lineEnd)));
            }), $dillonkearns$elm_markdown$Whitespace$lineEnd),
            $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(body)), A2($dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence, fence.length, fence.character))),
            A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed(F3(function(start, end, source) {
                return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple2(fence, _Utils_ap(body, A3($elm$core$String$slice, start, end, source))));
            })), $dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine(fence.indented)), $elm$parser$Parser$Advanced$getOffset), $elm$parser$Parser$Advanced$getSource)
        ]));
    };
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock = function(fence) {
        return A2($elm$parser$Parser$Advanced$loop, _Utils_Tuple2(fence, ""), $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp);
    };
    var $dillonkearns$elm_markdown$Markdown$CodeBlock$parser = A2($elm$parser$Parser$Advanced$andThen, function(fence) {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$CodeBlock$infoString(fence.character), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)), $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock(fence));
    }, $dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence);
    var $elm$core$String$dropRight = F2(function(n, string) {
        return n < 1 ? string : A3($elm$core$String$slice, 0, -n, string);
    });
    var $elm$core$String$endsWith = _String_endsWith;
    var $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes = function(headingString) {
        return A2($elm$core$String$endsWith, "#", headingString) ? $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes(A2($elm$core$String$dropRight, 1, headingString)) : headingString;
    };
    var $elm$core$String$trimRight = _String_trimRight;
    var $dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence = function(headingString) {
        var droppedTrailingHashesString = $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes(headingString);
        return A2($elm$core$String$endsWith, " ", droppedTrailingHashesString) || $elm$core$String$isEmpty(droppedTrailingHashesString) ? $elm$core$String$trimRight(droppedTrailingHashesString) : headingString;
    };
    var $dillonkearns$elm_markdown$Parser$Token$hash = A2($elm$parser$Parser$Advanced$Token, "#", $elm$parser$Parser$Expecting("a `#`"));
    var $dillonkearns$elm_markdown$Markdown$Heading$isHash = function(c) {
        if ("#" === c.valueOf()) return true;
        else return false;
    };
    var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(function(c) {
        return _Utils_eq(c, _Utils_chr(" ")) || _Utils_eq(c, _Utils_chr("\n")) || _Utils_eq(c, _Utils_chr("\r"));
    });
    var $dillonkearns$elm_markdown$Markdown$Heading$parser = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Heading), A2($elm$parser$Parser$Advanced$andThen, function(startingSpaces) {
        var startSpace = $elm$core$String$length(startingSpaces);
        return startSpace >= 4 ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Expecting("heading with < 4 spaces in front")) : $elm$parser$Parser$Advanced$succeed(startSpace);
    }, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$spaces))), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$hash)), A2($elm$parser$Parser$Advanced$andThen, function(additionalHashes) {
        var level = $elm$core$String$length(additionalHashes) + 1;
        return level >= 7 ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Expecting("heading with < 7 #'s")) : $elm$parser$Parser$Advanced$succeed(level);
    }, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Markdown$Heading$isHash)))), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines("")), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$newline)),
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
            $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab)
        ]))), A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(headingText, _v0) {
            return $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines($dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence($elm$core$String$trim(headingText)));
        }), $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd))
    ])));
    var $dillonkearns$elm_markdown$Parser$Token$greaterThan = A2($elm$parser$Parser$Advanced$Token, ">", $elm$parser$Parser$Expecting("a `>`"));
    var $elm$parser$Parser$Advanced$Located = F3(function(row, col, context) {
        return {
            col: col,
            context: context,
            row: row
        };
    });
    var $elm$parser$Parser$Advanced$changeContext = F2(function(newContext, s) {
        return {
            col: s.col,
            context: newContext,
            indent: s.indent,
            offset: s.offset,
            row: s.row,
            src: s.src
        };
    });
    var $elm$parser$Parser$Advanced$inContext = F2(function(context, _v0) {
        var parse = _v0.a;
        return $elm$parser$Parser$Advanced$Parser(function(s0) {
            var _v1 = parse(A2($elm$parser$Parser$Advanced$changeContext, A2($elm$core$List$cons, A3($elm$parser$Parser$Advanced$Located, s0.row, s0.col, context), s0.context), s0));
            if (_v1.$ === "Good") {
                var p = _v1.a;
                var a = _v1.b;
                var s1 = _v1.c;
                return A3($elm$parser$Parser$Advanced$Good, p, a, A2($elm$parser$Parser$Advanced$changeContext, s0.context, s1));
            } else {
                var step = _v1;
                return step;
            }
        });
    });
    var $dillonkearns$elm_markdown$Whitespace$isWhitespace = function(_char) {
        switch(_char.valueOf()){
            case " ":
                return true;
            case "\n":
                return true;
            case "	":
                return true;
            case "\v":
                return true;
            case "\f":
                return true;
            case "\r":
                return true;
            default:
                return false;
        }
    };
    var $dillonkearns$elm_markdown$Parser$Token$lessThan = A2($elm$parser$Parser$Advanced$Token, "<", $elm$parser$Parser$Expecting("a `<`"));
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser = A2($elm$parser$Parser$Advanced$inContext, "link destination", $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$url$Url$percentEncode), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$lessThan)), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$greaterThan)), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$greaterThan))),
        $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isWhitespace)))
    ])));
    var $dillonkearns$elm_markdown$Parser$Token$closingSquareBracket = A2($elm$parser$Parser$Advanced$Token, "]", $elm$parser$Parser$Expecting("a `]`"));
    var $dillonkearns$elm_markdown$Parser$Token$openingSquareBracket = A2($elm$parser$Parser$Advanced$Token, "[", $elm$parser$Parser$Expecting("a `[`"));
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$openingSquareBracket)), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$closingSquareBracket)), $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "]:", $elm$parser$Parser$Expecting("]:")))));
    var $dillonkearns$elm_markdown$Parser$Token$doubleQuote = A2($elm$parser$Parser$Advanced$Token, '"', $elm$parser$Parser$Expecting("a double quote"));
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine = function(str) {
        return A2($elm$core$String$contains, "\n\n", str) ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Expecting("no blank line")) : $elm$parser$Parser$Advanced$succeed(str);
    };
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline = A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$chompWhile(function(c) {
        return !$dillonkearns$elm_markdown$Whitespace$isLineEnd(c) && $dillonkearns$elm_markdown$Whitespace$isWhitespace(c);
    }), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
    var $dillonkearns$elm_markdown$Whitespace$requiredWhitespace = A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$Whitespace$isWhitespace, $elm$parser$Parser$Expecting("Required whitespace")), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isWhitespace));
    var $dillonkearns$elm_markdown$Parser$Token$singleQuote = A2($elm$parser$Parser$Advanced$Token, "'", $elm$parser$Parser$Expecting("a single quote"));
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser = function() {
        var inSingleQuotes = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$singleQuote))), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)), $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
        var inDoubleQuotes = A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine, $elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$doubleQuote))), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)), $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
        return A2($elm$parser$Parser$Advanced$inContext, "title", $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$Whitespace$requiredWhitespace), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
                inDoubleQuotes,
                inSingleQuotes,
                $elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing)
            ])))),
            A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing), $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline)
        ])));
    }();
    var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser = A2($elm$parser$Parser$Advanced$inContext, "link reference definition", A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(F3(function(label, destination, title) {
        return _Utils_Tuple2(label, {
            destination: destination,
            title: title
        });
    })), $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser, $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $dillonkearns$elm_markdown$Whitespace$lineEnd,
        $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
    ]))), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))), $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser), $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser));
    var $dillonkearns$elm_markdown$ThematicBreak$ThematicBreak = {
        $: "ThematicBreak"
    };
    var $dillonkearns$elm_markdown$ThematicBreak$whitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
    var $dillonkearns$elm_markdown$ThematicBreak$withChar = function(tchar) {
        var token = $dillonkearns$elm_markdown$Parser$Token$parseString($elm$core$String$fromChar(tchar));
        return A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$ThematicBreak$ThematicBreak), token), $dillonkearns$elm_markdown$ThematicBreak$whitespace), token), $dillonkearns$elm_markdown$ThematicBreak$whitespace), token), $elm$parser$Parser$Advanced$chompWhile(function(c) {
            return _Utils_eq(c, tchar) || $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab(c);
        })), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
    };
    var $dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        $dillonkearns$elm_markdown$ThematicBreak$withChar(_Utils_chr("-")),
        $dillonkearns$elm_markdown$ThematicBreak$withChar(_Utils_chr("*")),
        $dillonkearns$elm_markdown$ThematicBreak$withChar(_Utils_chr("_"))
    ]));
    var $dillonkearns$elm_markdown$ThematicBreak$parser = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$Whitespace$space), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Whitespace$space,
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ]))), $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Whitespace$space,
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ]))), $dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak),
        $dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak
    ]));
    var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelOne = {
        $: "LevelOne"
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelTwo = {
        $: "LevelTwo"
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine = F2(function(a, b) {
        return {
            $: "SetextLine",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Parser$Token$equals = A2($elm$parser$Parser$Advanced$Token, "=", $elm$parser$Parser$Expecting("a `=`"));
    var $dillonkearns$elm_markdown$Parser$Token$minus = A2($elm$parser$Parser$Advanced$Token, "-", $elm$parser$Parser$Expecting("a `-`"));
    var $dillonkearns$elm_markdown$Markdown$Parser$setextLineParser = function() {
        var setextLevel = F3(function(level, levelToken, levelChar) {
            return A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(level), $elm$parser$Parser$Advanced$token(levelToken)), $elm$parser$Parser$Advanced$chompWhile($elm$core$Basics$eq(levelChar)));
        });
        return A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(raw, level) {
            return A2($dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine, level, raw);
        }), A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces), A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A3(setextLevel, $dillonkearns$elm_markdown$Markdown$RawBlock$LevelOne, $dillonkearns$elm_markdown$Parser$Token$equals, _Utils_chr("=")),
            A3(setextLevel, $dillonkearns$elm_markdown$Markdown$RawBlock$LevelTwo, $dillonkearns$elm_markdown$Parser$Token$minus, _Utils_chr("-"))
        ])), $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
    }();
    var $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter = function(a) {
        return {
            $: "TableDelimiter",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
    var $dillonkearns$elm_markdown$Parser$Extra$maybeChomp = function(condition) {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$chompIf, condition, $elm$parser$Parser$Problem("Character not found")),
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ]));
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst = function(columns) {
        return $elm$core$List$isEmpty(columns) ? $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Parser$Token$parseString("|"),
            $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
        ])) : $dillonkearns$elm_markdown$Parser$Token$parseString("|");
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp = function(revDelimiterColumns) {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$map, function(_v0) {
                return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
            }, $dillonkearns$elm_markdown$Parser$Token$parseString("|\n"))),
            A2($elm$parser$Parser$Advanced$map, function(_v1) {
                return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
            }, $dillonkearns$elm_markdown$Parser$Token$parseString("\n")),
            A2($elm$parser$Parser$Advanced$map, function(_v2) {
                return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
            }, $elm$parser$Parser$Advanced$end($elm$parser$Parser$Expecting("end"))),
            $elm$parser$Parser$Advanced$backtrackable(A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(revDelimiterColumns)), $dillonkearns$elm_markdown$Parser$Token$parseString("|")), $elm$parser$Parser$Advanced$end($elm$parser$Parser$Expecting("end")))),
            A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(function(column) {
                return $elm$parser$Parser$Advanced$Loop(A2($elm$core$List$cons, column, revDelimiterColumns));
            }), $dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst(revDelimiterColumns)), $dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString(A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0), $dillonkearns$elm_markdown$Parser$Extra$maybeChomp(function(c) {
                return _Utils_eq(c, _Utils_chr(":"));
            })), $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(function(c) {
                return _Utils_eq(c, _Utils_chr("-"));
            })), $dillonkearns$elm_markdown$Parser$Extra$maybeChomp(function(c) {
                return _Utils_eq(c, _Utils_chr(":"));
            }))), $dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace))
        ]));
    };
    var $dillonkearns$elm_markdown$Markdown$Block$AlignCenter = {
        $: "AlignCenter"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$AlignLeft = {
        $: "AlignLeft"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$AlignRight = {
        $: "AlignRight"
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment = function(cell) {
        var _v0 = _Utils_Tuple2(A2($elm$core$String$startsWith, ":", cell), A2($elm$core$String$endsWith, ":", cell));
        if (_v0.a) {
            if (_v0.b) return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignCenter);
            else return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignLeft);
        } else {
            if (_v0.b) return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignRight);
            else return $elm$core$Maybe$Nothing;
        }
    };
    var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser = A2($elm$parser$Parser$Advanced$andThen, function(delimiterRow) {
        var trimmed = delimiterRow.a.trimmed;
        var headers = delimiterRow.b;
        return $elm$core$List$isEmpty(headers) ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Expecting("Must have at least one column in delimiter row.")) : $elm$core$List$length(headers) === 1 && !(A2($elm$core$String$startsWith, "|", trimmed) && A2($elm$core$String$endsWith, "|", trimmed)) ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem("Tables with a single column must have pipes at the start and end of the delimiter row to avoid ambiguity.")) : $elm$parser$Parser$Advanced$succeed(delimiterRow);
    }, A2($elm$parser$Parser$Advanced$mapChompedString, F2(function(delimiterText, revDelimiterColumns) {
        return A2($dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow, {
            raw: delimiterText,
            trimmed: $elm$core$String$trim(delimiterText)
        }, A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment, $elm$core$List$reverse(revDelimiterColumns)));
    }), A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp)));
    var $dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph = A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser);
    var $elm$core$List$all = F2(function(isOkay, list) {
        return !A2($elm$core$List$any, A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay), list);
    });
    var $elm$core$List$takeReverse = F3(function(n, list, kept) {
        takeReverse: while(true){
            if (n <= 0) return kept;
            else {
                if (!list.b) return kept;
                else {
                    var x = list.a;
                    var xs = list.b;
                    var $temp$n = n - 1, $temp$list = xs, $temp$kept = A2($elm$core$List$cons, x, kept);
                    n = $temp$n;
                    list = $temp$list;
                    kept = $temp$kept;
                    continue takeReverse;
                }
            }
        }
    });
    var $elm$core$List$takeTailRec = F2(function(n, list) {
        return $elm$core$List$reverse(A3($elm$core$List$takeReverse, n, list, _List_Nil));
    });
    var $elm$core$List$takeFast = F3(function(ctr, n, list) {
        if (n <= 0) return _List_Nil;
        else {
            var _v0 = _Utils_Tuple2(n, list);
            _v0$1: while(true){
                _v0$5: while(true){
                    if (!_v0.b.b) return list;
                    else if (_v0.b.b.b) switch(_v0.a){
                        case 1:
                            break _v0$1;
                        case 2:
                            var _v2 = _v0.b;
                            var x = _v2.a;
                            var _v3 = _v2.b;
                            var y = _v3.a;
                            return _List_fromArray([
                                x,
                                y
                            ]);
                        case 3:
                            if (_v0.b.b.b.b) {
                                var _v4 = _v0.b;
                                var x = _v4.a;
                                var _v5 = _v4.b;
                                var y = _v5.a;
                                var _v6 = _v5.b;
                                var z = _v6.a;
                                return _List_fromArray([
                                    x,
                                    y,
                                    z
                                ]);
                            } else break _v0$5;
                        default:
                            if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
                                var _v7 = _v0.b;
                                var x = _v7.a;
                                var _v8 = _v7.b;
                                var y = _v8.a;
                                var _v9 = _v8.b;
                                var z = _v9.a;
                                var _v10 = _v9.b;
                                var w = _v10.a;
                                var tl = _v10.b;
                                return ctr > 1000 ? A2($elm$core$List$cons, x, A2($elm$core$List$cons, y, A2($elm$core$List$cons, z, A2($elm$core$List$cons, w, A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2($elm$core$List$cons, x, A2($elm$core$List$cons, y, A2($elm$core$List$cons, z, A2($elm$core$List$cons, w, A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
                            } else break _v0$5;
                    }
                    else {
                        if (_v0.a === 1) break _v0$1;
                        else break _v0$5;
                    }
                }
                return list;
            }
            var _v1 = _v0.b;
            var x = _v1.a;
            return _List_fromArray([
                x
            ]);
        }
    });
    var $elm$core$List$take = F2(function(n, list) {
        return A3($elm$core$List$takeFast, 0, n, list);
    });
    var $dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength = F2(function(expectedLength, row) {
        var rowLength = $elm$core$List$length(row);
        var _v0 = A2($elm$core$Basics$compare, expectedLength, rowLength);
        switch(_v0.$){
            case "LT":
                return A2($elm$core$List$take, expectedLength, row);
            case "EQ":
                return row;
            default:
                return _Utils_ap(row, A2($elm$core$List$repeat, expectedLength - rowLength, ""));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser = function(expectedRowLength) {
        return A2($elm$parser$Parser$Advanced$andThen, function(row) {
            return $elm$core$List$isEmpty(row) || A2($elm$core$List$all, $elm$core$String$isEmpty, row) ? $elm$parser$Parser$Advanced$problem($elm$parser$Parser$Problem("A line must have at least one column")) : $elm$parser$Parser$Advanced$succeed(A2($dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength, expectedRowLength, row));
        }, $dillonkearns$elm_markdown$Markdown$TableParser$rowParser);
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted = function(_v0) {
        var headers = _v0.a;
        var body = _v0.b;
        return A2($elm$parser$Parser$Advanced$map, function(row) {
            return $dillonkearns$elm_markdown$Markdown$RawBlock$Table(A2($dillonkearns$elm_markdown$Markdown$Table$Table, headers, _Utils_ap(body, _List_fromArray([
                row
            ]))));
        }, $dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser($elm$core$List$length(headers)));
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H1 = {
        $: "H1"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H2 = {
        $: "H2"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H3 = {
        $: "H3"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H4 = {
        $: "H4"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H5 = {
        $: "H5"
    };
    var $dillonkearns$elm_markdown$Markdown$Block$H6 = {
        $: "H6"
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$toHeading = function(level) {
        switch(level){
            case 1:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H1);
            case 2:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H2);
            case 3:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H3);
            case 4:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H4);
            case 5:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H5);
            case 6:
                return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H6);
            default:
                return $elm$core$Result$Err($elm$parser$Parser$Expecting("A heading with 1 to 6 #'s, but found " + $elm$core$String$fromInt(level)));
        }
    };
    var $dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock = function(a) {
        return {
            $: "UnorderedListBlock",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Parser$Token$asterisk = A2($elm$parser$Parser$Advanced$Token, "*", $elm$parser$Parser$Expecting("a `*`"));
    var $dillonkearns$elm_markdown$Parser$Token$plus = A2($elm$parser$Parser$Advanced$Token, "+", $elm$parser$Parser$Expecting("a `+`"));
    var $dillonkearns$elm_markdown$Markdown$UnorderedList$listMarkerParser = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Parser$Token$minus), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$minus)),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Parser$Token$plus), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$plus)),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Parser$Token$asterisk), $elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$asterisk))
    ]));
    var $dillonkearns$elm_markdown$Markdown$ListItem$PlainItem = function(a) {
        return {
            $: "PlainItem",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$ListItem$TaskItem = F2(function(a, b) {
        return {
            $: "TaskItem",
            a: a,
            b: b
        };
    });
    var $dillonkearns$elm_markdown$Markdown$ListItem$Complete = {
        $: "Complete"
    };
    var $dillonkearns$elm_markdown$Markdown$ListItem$Incomplete = {
        $: "Incomplete"
    };
    var $dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Complete), $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "[x] ", $elm$parser$Parser$ExpectingSymbol("[x] ")))),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Complete), $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "[X] ", $elm$parser$Parser$ExpectingSymbol("[X] ")))),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Incomplete), $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, "[ ] ", $elm$parser$Parser$ExpectingSymbol("[ ] "))))
    ]));
    var $dillonkearns$elm_markdown$Markdown$ListItem$parser = A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$TaskItem), A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser, $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))),
        $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$PlainItem)
    ])), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd), $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
    var $dillonkearns$elm_markdown$Markdown$UnorderedList$itemBody = $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
        A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))), $dillonkearns$elm_markdown$Markdown$ListItem$parser),
        A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$PlainItem("")), $dillonkearns$elm_markdown$Whitespace$lineEnd)
    ]));
    var $dillonkearns$elm_markdown$Markdown$UnorderedList$singleItemParser = function(listMarker) {
        return A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity), $elm$parser$Parser$Advanced$backtrackable($elm$parser$Parser$Advanced$symbol(listMarker))), $dillonkearns$elm_markdown$Markdown$UnorderedList$itemBody);
    };
    var $dillonkearns$elm_markdown$Markdown$UnorderedList$statementsHelp = F3(function(itemParser, firstItem, revStmts) {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, function(stmt) {
                return $elm$parser$Parser$Advanced$Loop(A2($elm$core$List$cons, stmt, revStmts));
            }, itemParser),
            $elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$Done(A2($elm$core$List$cons, firstItem, $elm$core$List$reverse(revStmts))))
        ]));
    });
    var $dillonkearns$elm_markdown$Markdown$UnorderedList$parser = function() {
        var parseSubsequentItems = F2(function(listMarker, firstItem) {
            return A2($elm$parser$Parser$Advanced$loop, _List_Nil, A2($dillonkearns$elm_markdown$Markdown$UnorderedList$statementsHelp, $dillonkearns$elm_markdown$Markdown$UnorderedList$singleItemParser(listMarker), firstItem));
        });
        return A2($elm$parser$Parser$Advanced$andThen, $elm$core$Basics$identity, A2($elm$parser$Parser$Advanced$keeper, A2($elm$parser$Parser$Advanced$keeper, $elm$parser$Parser$Advanced$succeed(parseSubsequentItems), A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$UnorderedList$listMarkerParser), $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))), $dillonkearns$elm_markdown$Markdown$ListItem$parser));
    }();
    var $dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock = function() {
        var parseListItem = function(unparsedListItem) {
            if (unparsedListItem.$ === "TaskItem") {
                var completion = unparsedListItem.a;
                var body = unparsedListItem.b;
                return {
                    body: $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(body),
                    task: $elm$core$Maybe$Just(function() {
                        if (completion.$ === "Complete") return true;
                        else return false;
                    }())
                };
            } else {
                var body = unparsedListItem.a;
                return {
                    body: $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(body),
                    task: $elm$core$Maybe$Nothing
                };
            }
        };
        return A2($elm$parser$Parser$Advanced$map, A2($elm$core$Basics$composeR, $elm$core$List$map(parseListItem), $dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock), $dillonkearns$elm_markdown$Markdown$UnorderedList$parser);
    }();
    var $dillonkearns$elm_markdown$Markdown$Parser$childToBlocks = F2(function(node, blocks) {
        switch(node.$){
            case "Element":
                var tag = node.a;
                var attributes = node.b;
                var children = node.c;
                var _v28 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
                if (_v28.$ === "Ok") {
                    var childrenAsBlocks = _v28.a;
                    var block = $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, childrenAsBlocks));
                    return $elm$core$Result$Ok(A2($elm$core$List$cons, block, blocks));
                } else {
                    var err = _v28.a;
                    return $elm$core$Result$Err(err);
                }
            case "Text":
                var innerText = node.a;
                var _v29 = $dillonkearns$elm_markdown$Markdown$Parser$parse(innerText);
                if (_v29.$ === "Ok") {
                    var value = _v29.a;
                    return $elm$core$Result$Ok(_Utils_ap($elm$core$List$reverse(value), blocks));
                } else {
                    var error = _v29.a;
                    return $elm$core$Result$Err($elm$parser$Parser$Expecting(A2($elm$core$String$join, "\n", A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
                }
            case "Comment":
                var string = node.a;
                return $elm$core$Result$Ok(A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock($dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)), blocks));
            case "Cdata":
                var string = node.a;
                return $elm$core$Result$Ok(A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock($dillonkearns$elm_markdown$Markdown$Block$Cdata(string)), blocks));
            case "ProcessingInstruction":
                var string = node.a;
                return $elm$core$Result$Ok(A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock($dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)), blocks));
            default:
                var declarationType = node.a;
                var content = node.b;
                return $elm$core$Result$Ok(A2($elm$core$List$cons, $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)), blocks));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper = F2(function(referencesDict, _v23) {
        var unparsedInlines = _v23.a;
        var mappedReferencesDict = $elm$core$Dict$fromList(A2($elm$core$List$map, $elm$core$Tuple$mapSecond(function(_v24) {
            var destination = _v24.destination;
            var title = _v24.title;
            return _Utils_Tuple2(destination, title);
        }), referencesDict));
        return A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, A2($dillonkearns$elm_markdown$Markdown$InlineParser$parse, mappedReferencesDict, unparsedInlines));
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$mapInline = function(inline) {
        switch(inline.$){
            case "Text":
                var string = inline.a;
                return $dillonkearns$elm_markdown$Markdown$Block$Text(string);
            case "HardLineBreak":
                return $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak;
            case "CodeInline":
                var string = inline.a;
                return $dillonkearns$elm_markdown$Markdown$Block$CodeSpan(string);
            case "Link":
                var string = inline.a;
                var maybeString = inline.b;
                var inlines = inline.c;
                return A3($dillonkearns$elm_markdown$Markdown$Block$Link, string, maybeString, A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
            case "Image":
                var string = inline.a;
                var maybeString = inline.b;
                var inlines = inline.c;
                return A3($dillonkearns$elm_markdown$Markdown$Block$Image, string, maybeString, A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
            case "HtmlInline":
                var node = inline.a;
                return $dillonkearns$elm_markdown$Markdown$Block$HtmlInline($dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(node));
            case "Emphasis":
                var level = inline.a;
                var inlines = inline.b;
                switch(level){
                    case 1:
                        return $dillonkearns$elm_markdown$Markdown$Block$Emphasis(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
                    case 2:
                        return $dillonkearns$elm_markdown$Markdown$Block$Strong(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
                    default:
                        return $dillonkearns$elm_markdown$Markdown$Block$Strong(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
                }
            default:
                var inlines = inline.a;
                return $dillonkearns$elm_markdown$Markdown$Block$Strikethrough(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
        }
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock = function(node) {
        switch(node.$){
            case "Text":
                var innerText = node.a;
                return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment("TODO this never happens, but use types to drop this case.");
            case "Element":
                var tag = node.a;
                var attributes = node.b;
                var children = node.c;
                var parseChild = function(child) {
                    if (child.$ === "Text") {
                        var text = child.a;
                        return $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks(text);
                    } else return _List_fromArray([
                        $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock($dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(child))
                    ]);
                };
                return A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, A2($elm$core$List$concatMap, parseChild, children));
            case "Comment":
                var string = node.a;
                return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string);
            case "Cdata":
                var string = node.a;
                return $dillonkearns$elm_markdown$Markdown$Block$Cdata(string);
            case "ProcessingInstruction":
                var string = node.a;
                return $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string);
            default:
                var declarationType = node.a;
                var content = node.b;
                return A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content);
        }
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks = function(children) {
        return A2($dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp, children, _List_Nil);
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp = F2(function(remaining, soFar) {
        nodesToBlocksHelp: while(true){
            if (remaining.b) {
                var node = remaining.a;
                var rest = remaining.b;
                var _v18 = A2($dillonkearns$elm_markdown$Markdown$Parser$childToBlocks, node, soFar);
                if (_v18.$ === "Ok") {
                    var newSoFar = _v18.a;
                    var $temp$remaining = rest, $temp$soFar = newSoFar;
                    remaining = $temp$remaining;
                    soFar = $temp$soFar;
                    continue nodesToBlocksHelp;
                } else {
                    var e = _v18.a;
                    return $elm$core$Result$Err(e);
                }
            } else return $elm$core$Result$Ok($elm$core$List$reverse(soFar));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$parse = function(input) {
        var _v14 = A2($elm$parser$Parser$Advanced$run, A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(), $dillonkearns$elm_markdown$Helpers$endOfFile), input);
        if (_v14.$ === "Err") {
            var e = _v14.a;
            return $elm$core$Result$Err(e);
        } else {
            var v = _v14.a;
            var _v15 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(v);
            if (_v15.$ === "Err") {
                var e = _v15.a;
                return A2($elm$parser$Parser$Advanced$run, $elm$parser$Parser$Advanced$problem(e), "");
            } else {
                var blocks = _v15.a;
                var isNotEmptyParagraph = function(block) {
                    if (block.$ === "Paragraph" && !block.a.b) return false;
                    else return true;
                };
                return $elm$core$Result$Ok(A2($elm$core$List$filter, isNotEmptyParagraph, blocks));
            }
        }
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines = function(state) {
        return A3($dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp, state, state.rawBlocks, _List_Nil);
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp = F3(function(state, rawBlocks, parsedBlocks) {
        parseAllInlinesHelp: while(true){
            if (rawBlocks.b) {
                var rawBlock = rawBlocks.a;
                var rest = rawBlocks.b;
                var _v13 = A2($dillonkearns$elm_markdown$Markdown$Parser$parseInlines, state.linkReferenceDefinitions, rawBlock);
                switch(_v13.$){
                    case "ParsedBlock":
                        var newParsedBlock = _v13.a;
                        var $temp$state = state, $temp$rawBlocks = rest, $temp$parsedBlocks = A2($elm$core$List$cons, newParsedBlock, parsedBlocks);
                        state = $temp$state;
                        rawBlocks = $temp$rawBlocks;
                        parsedBlocks = $temp$parsedBlocks;
                        continue parseAllInlinesHelp;
                    case "EmptyBlock":
                        var $temp$state = state, $temp$rawBlocks = rest, $temp$parsedBlocks = parsedBlocks;
                        state = $temp$state;
                        rawBlocks = $temp$rawBlocks;
                        parsedBlocks = $temp$parsedBlocks;
                        continue parseAllInlinesHelp;
                    default:
                        var e = _v13.a;
                        return $elm$core$Result$Err(e);
                }
            } else return $elm$core$Result$Ok(parsedBlocks);
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines = F2(function(linkReferences, header) {
        return A2($elm$core$List$map, function(_v11) {
            var label = _v11.label;
            var alignment = _v11.alignment;
            return A3($dillonkearns$elm_markdown$Markdown$Parser$parseRawInline, linkReferences, function(parsedHeaderLabel) {
                return {
                    alignment: alignment,
                    label: parsedHeaderLabel
                };
            }, $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(label));
        }, header);
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$parseInlines = F2(function(linkReferences, rawBlock) {
        switch(rawBlock.$){
            case "Heading":
                var level = rawBlock.a;
                var unparsedInlines = rawBlock.b;
                var _v5 = $dillonkearns$elm_markdown$Markdown$Parser$toHeading(level);
                if (_v5.$ === "Ok") {
                    var parsedLevel = _v5.a;
                    return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(A2($dillonkearns$elm_markdown$Markdown$Block$Heading, parsedLevel, A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
                } else {
                    var e = _v5.a;
                    return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
                }
            case "OpenBlockOrParagraph":
                var unparsedInlines = rawBlock.a;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$Paragraph(A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
            case "Html":
                var html = rawBlock.a;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(html));
            case "UnorderedListBlock":
                var unparsedItems = rawBlock.a;
                var parseItem = function(unparsed) {
                    var task = function() {
                        var _v6 = unparsed.task;
                        if (_v6.$ === "Just") {
                            if (!_v6.a) return $dillonkearns$elm_markdown$Markdown$Block$IncompleteTask;
                            else return $dillonkearns$elm_markdown$Markdown$Block$CompletedTask;
                        } else return $dillonkearns$elm_markdown$Markdown$Block$NoTask;
                    }();
                    var parsedInlines = A3($dillonkearns$elm_markdown$Markdown$Parser$parseRawInline, linkReferences, $elm$core$Basics$identity, unparsed.body);
                    return A2($dillonkearns$elm_markdown$Markdown$Block$ListItem, task, parsedInlines);
                };
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$UnorderedList(A2($elm$core$List$map, parseItem, unparsedItems)));
            case "OrderedListBlock":
                var startingIndex = rawBlock.a;
                var unparsedInlines = rawBlock.b;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(A2($dillonkearns$elm_markdown$Markdown$Block$OrderedList, startingIndex, A2($elm$core$List$map, A2($dillonkearns$elm_markdown$Markdown$Parser$parseRawInline, linkReferences, $elm$core$Basics$identity), unparsedInlines)));
            case "CodeBlock":
                var codeBlock = rawBlock.a;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$CodeBlock(codeBlock));
            case "ThematicBreak":
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$ThematicBreak);
            case "BlankLine":
                return $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock;
            case "BlockQuote":
                var rawBlocks = rawBlock.a;
                var _v7 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(), rawBlocks);
                if (_v7.$ === "Ok") {
                    var value = _v7.a;
                    var _v8 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(value);
                    if (_v8.$ === "Ok") {
                        var parsedBlocks = _v8.a;
                        return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$BlockQuote(parsedBlocks));
                    } else {
                        var e = _v8.a;
                        return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
                    }
                } else {
                    var error = _v7.a;
                    return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem($elm$parser$Parser$Problem($dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(error)));
                }
            case "IndentedCodeBlock":
                var codeBlockBody = rawBlock.a;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$CodeBlock({
                    body: codeBlockBody,
                    language: $elm$core$Maybe$Nothing
                }));
            case "Table":
                var _v9 = rawBlock.a;
                var header = _v9.a;
                var rows = _v9.b;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(A2($dillonkearns$elm_markdown$Markdown$Block$Table, A2($dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines, linkReferences, header), A2($dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines, linkReferences, rows)));
            case "TableDelimiter":
                var _v10 = rawBlock.a;
                var text = _v10.a;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$Paragraph(A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(text.raw))));
            default:
                var raw = rawBlock.b;
                return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$Paragraph(A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(raw))));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$parseRawInline = F3(function(linkReferences, wrap, unparsedInlines) {
        return wrap(A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines));
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines = F2(function(linkReferences, rows) {
        return A2($elm$core$List$map, function(row) {
            return A2($elm$core$List$map, function(column) {
                return A3($dillonkearns$elm_markdown$Markdown$Parser$parseRawInline, linkReferences, $elm$core$Basics$identity, $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(column));
            }, row);
        }, rows);
    });
    var $dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock = function(revStmts) {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            A2($elm$parser$Parser$Advanced$map, function(_v2) {
                return $elm$parser$Parser$Advanced$Done(revStmts);
            }, $dillonkearns$elm_markdown$Helpers$endOfFile),
            A2($elm$parser$Parser$Advanced$map, function(reference) {
                return $elm$parser$Parser$Advanced$Loop(A2($dillonkearns$elm_markdown$Markdown$Parser$addReference, revStmts, reference));
            }, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser)),
            A2($elm$parser$Parser$Advanced$map, function(block) {
                return $elm$parser$Parser$Advanced$Loop(A2($dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks, revStmts, block));
            }, function() {
                var _v3 = revStmts.rawBlocks;
                _v3$2: while(true){
                    if (_v3.b) switch(_v3.a.$){
                        case "OpenBlockOrParagraph":
                            return $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser();
                        case "Table":
                            var table = _v3.a.a;
                            return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
                                $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser(),
                                $dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted(table)
                            ]));
                        default:
                            break _v3$2;
                    }
                    else break _v3$2;
                }
                return $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser();
            }()),
            A2($elm$parser$Parser$Advanced$map, function(block) {
                return $elm$parser$Parser$Advanced$Loop(A2($dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks, revStmts, block));
            }, $dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser)
        ]));
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks = function(textNodeValue) {
        return A2($elm$core$Result$withDefault, _List_Nil, $dillonkearns$elm_markdown$Markdown$Parser$parse(textNodeValue));
    };
    var $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode = function(xmlNode) {
        switch(xmlNode.$){
            case "Text":
                var innerText = xmlNode.a;
                return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph($dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(innerText)));
            case "Element":
                var tag = xmlNode.a;
                var attributes = xmlNode.b;
                var children = xmlNode.c;
                var _v1 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
                if (_v1.$ === "Ok") {
                    var parsedChildren = _v1.a;
                    return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Html(A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, parsedChildren)));
                } else {
                    var err = _v1.a;
                    return $elm$parser$Parser$Advanced$problem(err);
                }
            case "Comment":
                var string = xmlNode.a;
                return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Html($dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)));
            case "Cdata":
                var string = xmlNode.a;
                return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Html($dillonkearns$elm_markdown$Markdown$Block$Cdata(string)));
            case "ProcessingInstruction":
                var string = xmlNode.a;
                return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Html($dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)));
            default:
                var declarationType = xmlNode.a;
                var content = xmlNode.b;
                return $elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Html(A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)));
        }
    };
    function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser() {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
            $dillonkearns$elm_markdown$Markdown$Parser$blankLine,
            $dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
            A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
            $dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock,
            A2($elm$parser$Parser$Advanced$map, function(_v26) {
                return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
            }, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
            $dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock,
            $dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(false),
            $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
            $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()
        ]));
    }
    function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser() {
        return $elm$parser$Parser$Advanced$oneOf(_List_fromArray([
            $dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
            $dillonkearns$elm_markdown$Markdown$Parser$blankLine,
            $dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
            A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
            $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$setextLineParser),
            A2($elm$parser$Parser$Advanced$map, function(_v25) {
                return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
            }, $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
            $dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock,
            $dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(true),
            $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
            $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser(),
            $elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph)
        ]));
    }
    function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser() {
        return A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode, $dillonkearns$elm_markdown$HtmlParser$html);
    }
    function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser() {
        return A2($elm$parser$Parser$Advanced$loop, {
            linkReferenceDefinitions: _List_Nil,
            rawBlocks: _List_Nil
        }, $dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock);
    }
    try {
        var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser();
        $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser = function() {
            return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser;
        };
        var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser();
        $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser = function() {
            return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser;
        };
        var $dillonkearns$elm_markdown$Markdown$Parser$htmlParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser();
        $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser = function() {
            return $dillonkearns$elm_markdown$Markdown$Parser$htmlParser;
        };
        var $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser();
        $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser = function() {
            return $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser;
        };
    } catch ($) {
        throw "Some top-level definitions from `Markdown.Parser` are causing infinite recursion:\n\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2510\n  \u2502    childToBlocks\n  \u2502     \u2193\n  \u2502    mergeableBlockNotAfterOpenBlockOrParagraphParser\n  \u2502     \u2193\n  \u2502    mergeableBlockAfterOpenBlockOrParagraphParser\n  \u2502     \u2193\n  \u2502    htmlParser\n  \u2502     \u2193\n  \u2502    inlineParseHelper\n  \u2502     \u2193\n  \u2502    mapInline\n  \u2502     \u2193\n  \u2502    nodeToRawBlock\n  \u2502     \u2193\n  \u2502    nodesToBlocks\n  \u2502     \u2193\n  \u2502    nodesToBlocksHelp\n  \u2502     \u2193\n  \u2502    parse\n  \u2502     \u2193\n  \u2502    parseAllInlines\n  \u2502     \u2193\n  \u2502    parseAllInlinesHelp\n  \u2502     \u2193\n  \u2502    parseHeaderInlines\n  \u2502     \u2193\n  \u2502    parseInlines\n  \u2502     \u2193\n  \u2502    parseRawInline\n  \u2502     \u2193\n  \u2502    parseRowInlines\n  \u2502     \u2193\n  \u2502    rawBlockParser\n  \u2502     \u2193\n  \u2502    stepRawBlock\n  \u2502     \u2193\n  \u2502    textNodeToBlocks\n  \u2502     \u2193\n  \u2502    xmlNodeToHtmlNode\n  \u2514\u2500\u2500\u2500\u2500\u2500\u2518\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!";
    }
    var $elm$core$Result$map2 = F3(function(func, ra, rb) {
        if (ra.$ === "Err") {
            var x = ra.a;
            return $elm$core$Result$Err(x);
        } else {
            var a = ra.a;
            if (rb.$ === "Err") {
                var x = rb.a;
                return $elm$core$Result$Err(x);
            } else {
                var b = rb.a;
                return $elm$core$Result$Ok(A2(func, a, b));
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$combineResults = A2($elm$core$List$foldr, $elm$core$Result$map2($elm$core$List$cons), $elm$core$Result$Ok(_List_Nil));
    var $elm$core$Result$andThen = F2(function(callback, result) {
        if (result.$ === "Ok") {
            var value = result.a;
            return callback(value);
        } else {
            var msg = result.a;
            return $elm$core$Result$Err(msg);
        }
    });
    var $elm$core$List$drop = F2(function(n, list) {
        drop: while(true){
            if (n <= 0) return list;
            else {
                if (!list.b) return list;
                else {
                    var x = list.a;
                    var xs = list.b;
                    var $temp$n = n - 1, $temp$list = xs;
                    n = $temp$n;
                    list = $temp$list;
                    continue drop;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Block$foldl = F3(function(_function, acc, list) {
        foldl: while(true){
            if (!list.b) return acc;
            else {
                var block = list.a;
                var remainingBlocks = list.b;
                switch(block.$){
                    case "HtmlBlock":
                        var html = block.a;
                        if (html.$ === "HtmlElement") {
                            var children = html.c;
                            var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = _Utils_ap(children, remainingBlocks);
                            _function = $temp$function;
                            acc = $temp$acc;
                            list = $temp$list;
                            continue foldl;
                        } else {
                            var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                            _function = $temp$function;
                            acc = $temp$acc;
                            list = $temp$list;
                            continue foldl;
                        }
                    case "UnorderedList":
                        var listItems = block.a;
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "OrderedList":
                        var _int = block.a;
                        var lists = block.b;
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "BlockQuote":
                        var blocks = block.a;
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = _Utils_ap(blocks, remainingBlocks);
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "Heading":
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "Paragraph":
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "Table":
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    case "CodeBlock":
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                    default:
                        var $temp$function = _function, $temp$acc = A2(_function, block, acc), $temp$list = remainingBlocks;
                        _function = $temp$function;
                        acc = $temp$acc;
                        list = $temp$list;
                        continue foldl;
                }
            }
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText = function(block) {
        switch(block.$){
            case "Paragraph":
                var inlines = block.a;
                return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
            case "HtmlBlock":
                var html = block.a;
                if (html.$ === "HtmlElement") {
                    var blocks = html.c;
                    return A3($dillonkearns$elm_markdown$Markdown$Block$foldl, F2(function(nestedBlock, soFar) {
                        return _Utils_ap(soFar, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(nestedBlock));
                    }), "", blocks);
                } else return "";
            case "UnorderedList":
                var items = block.a;
                return A2($elm$core$String$join, "\n", A2($elm$core$List$map, function(_v4) {
                    var task = _v4.a;
                    var inlines = _v4.b;
                    return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
                }, items));
            case "OrderedList":
                var _int = block.a;
                var items = block.b;
                return A2($elm$core$String$join, "\n", A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText, items));
            case "BlockQuote":
                var blocks = block.a;
                return A2($elm$core$String$join, "\n", A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
            case "Heading":
                var headingLevel = block.a;
                var inlines = block.b;
                return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
            case "Table":
                var header = block.a;
                var rows = block.b;
                return A2($elm$core$String$join, "\n", $elm$core$List$concat(_List_fromArray([
                    A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText, A2($elm$core$List$map, function($) {
                        return $.label;
                    }, header)),
                    $elm$core$List$concat(A2($elm$core$List$map, $elm$core$List$map($dillonkearns$elm_markdown$Markdown$Block$extractInlineText), rows))
                ])));
            case "CodeBlock":
                var body = block.a.body;
                return body;
            default:
                return "";
        }
    };
    var $dillonkearns$elm_markdown$Markdown$Block$extractInlineText = function(inlines) {
        return A3($elm$core$List$foldl, $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp, "", inlines);
    };
    var $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp = F2(function(inline, text) {
        switch(inline.$){
            case "Text":
                var str = inline.a;
                return _Utils_ap(text, str);
            case "HardLineBreak":
                return text + " ";
            case "CodeSpan":
                var str = inline.a;
                return _Utils_ap(text, str);
            case "Link":
                var inlines = inline.c;
                return _Utils_ap(text, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
            case "Image":
                var inlines = inline.c;
                return _Utils_ap(text, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
            case "HtmlInline":
                var html = inline.a;
                if (html.$ === "HtmlElement") {
                    var blocks = html.c;
                    return A3($dillonkearns$elm_markdown$Markdown$Block$foldl, F2(function(block, soFar) {
                        return _Utils_ap(soFar, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(block));
                    }), text, blocks);
                } else return text;
            case "Strong":
                var inlines = inline.a;
                return _Utils_ap(text, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
            case "Emphasis":
                var inlines = inline.a;
                return _Utils_ap(text, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
            default:
                var inlines = inline.a;
                return _Utils_ap(text, $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtml = F5(function(tagName, attributes, children, _v0, renderedChildren) {
        var htmlRenderer = _v0.a;
        return A2($elm$core$Result$andThen, function(okChildren) {
            return A2($elm$core$Result$map, function(myRenderer) {
                return myRenderer(okChildren);
            }, A3(htmlRenderer, tagName, attributes, children));
        }, $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(renderedChildren));
    });
    var $elm$core$List$singleton = function(value) {
        return _List_fromArray([
            value
        ]);
    };
    var $dillonkearns$elm_markdown$Markdown$Renderer$foldThing = F3(function(renderer, topLevelInline, soFar) {
        var _v7 = A2($dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline, renderer, topLevelInline);
        if (_v7.$ === "Just") {
            var inline = _v7.a;
            return A2($elm$core$List$cons, inline, soFar);
        } else return soFar;
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelper = F2(function(renderer, blocks) {
        return A2($elm$core$List$filterMap, $dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle(renderer), blocks);
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle = function(renderer) {
        return function(block) {
            switch(block.$){
                case "Heading":
                    var level = block.a;
                    var content = block.b;
                    return $elm$core$Maybe$Just(A2($elm$core$Result$map, function(children) {
                        return renderer.heading({
                            children: children,
                            level: level,
                            rawText: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(content)
                        });
                    }, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
                case "Paragraph":
                    var content = block.a;
                    return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.paragraph, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
                case "HtmlBlock":
                    var html = block.a;
                    if (html.$ === "HtmlElement") {
                        var tag = html.a;
                        var attributes = html.b;
                        var children = html.c;
                        return $elm$core$Maybe$Just(A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
                    } else return $elm$core$Maybe$Nothing;
                case "UnorderedList":
                    var items = block.a;
                    return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.unorderedList, $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($elm$core$List$map, function(_v4) {
                        var task = _v4.a;
                        var children = _v4.b;
                        return A2($elm$core$Result$map, function(renderedBody) {
                            return A2($dillonkearns$elm_markdown$Markdown$Block$ListItem, task, renderedBody);
                        }, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, children));
                    }, items))));
                case "OrderedList":
                    var startingIndex = block.a;
                    var items = block.b;
                    return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.orderedList(startingIndex), $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Renderer$renderStyled(renderer), items))));
                case "CodeBlock":
                    var codeBlock = block.a;
                    return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.codeBlock(codeBlock)));
                case "ThematicBreak":
                    return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.thematicBreak));
                case "BlockQuote":
                    var nestedBlocks = block.a;
                    return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.blockQuote, $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, nestedBlocks))));
                default:
                    var header = block.a;
                    var rows = block.b;
                    var renderedHeaderCells = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($elm$core$List$map, function(_v6) {
                        var label = _v6.label;
                        var alignment = _v6.alignment;
                        return A2($elm$core$Result$map, $elm$core$Tuple$pair(alignment), A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, label));
                    }, header));
                    var renderedHeader = A2($elm$core$Result$map, function(listListView) {
                        return renderer.tableHeader($elm$core$List$singleton(renderer.tableRow(A2($elm$core$List$map, function(_v5) {
                            var maybeAlignment = _v5.a;
                            var item = _v5.b;
                            return A2(renderer.tableHeaderCell, maybeAlignment, item);
                        }, listListView))));
                    }, renderedHeaderCells);
                    var renderedBody = function(r) {
                        return $elm$core$List$isEmpty(r) ? _List_Nil : _List_fromArray([
                            renderer.tableBody(r)
                        ]);
                    };
                    var alignmentForColumn = function(columnIndex) {
                        return A2($elm$core$Maybe$andThen, function($) {
                            return $.alignment;
                        }, $elm$core$List$head(A2($elm$core$List$drop, columnIndex, header)));
                    };
                    var renderRow = function(cells) {
                        return A2($elm$core$Result$map, renderer.tableRow, A2($elm$core$Result$map, $elm$core$List$indexedMap(F2(function(index, cell) {
                            return A2(renderer.tableCell, alignmentForColumn(index), cell);
                        })), $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Renderer$renderStyled(renderer), cells))));
                    };
                    var renderedRows = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($elm$core$List$map, renderRow, rows));
                    return $elm$core$Maybe$Just(A3($elm$core$Result$map2, F2(function(h, r) {
                        return renderer.table(A2($elm$core$List$cons, h, renderedBody(r)));
                    }), renderedHeader, renderedRows));
            }
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode = F4(function(renderer, tag, attributes, children) {
        return A5($dillonkearns$elm_markdown$Markdown$Renderer$renderHtml, tag, attributes, children, renderer.html, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, children));
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline = F2(function(renderer, inline) {
        switch(inline.$){
            case "Strong":
                var innerInlines = inline.a;
                return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.strong, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
            case "Emphasis":
                var innerInlines = inline.a;
                return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.emphasis, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
            case "Strikethrough":
                var innerInlines = inline.a;
                return $elm$core$Maybe$Just(A2($elm$core$Result$map, renderer.strikethrough, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
            case "Image":
                var src = inline.a;
                var title = inline.b;
                var children = inline.c;
                return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.image({
                    alt: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(children),
                    src: src,
                    title: title
                })));
            case "Text":
                var string = inline.a;
                return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.text(string)));
            case "CodeSpan":
                var string = inline.a;
                return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.codeSpan(string)));
            case "Link":
                var destination = inline.a;
                var title = inline.b;
                var inlines = inline.c;
                return $elm$core$Maybe$Just(A2($elm$core$Result$andThen, function(children) {
                    return $elm$core$Result$Ok(A2(renderer.link, {
                        destination: destination,
                        title: title
                    }, children));
                }, A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, inlines)));
            case "HardLineBreak":
                return $elm$core$Maybe$Just($elm$core$Result$Ok(renderer.hardLineBreak));
            default:
                var html = inline.a;
                if (html.$ === "HtmlElement") {
                    var tag = html.a;
                    var attributes = html.b;
                    var children = html.c;
                    return $elm$core$Maybe$Just(A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
                } else return $elm$core$Maybe$Nothing;
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$renderStyled = F2(function(renderer, styledStrings) {
        return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A3($elm$core$List$foldr, $dillonkearns$elm_markdown$Markdown$Renderer$foldThing(renderer), _List_Nil, styledStrings));
    });
    var $dillonkearns$elm_markdown$Markdown$Renderer$render = F2(function(renderer, ast) {
        return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, ast));
    });
    var $zwilias$elm_html_string$Html$Types$Node = F3(function(a, b, c) {
        return {
            $: "Node",
            a: a,
            b: b,
            c: c
        };
    });
    var $zwilias$elm_html_string$Html$Types$Regular = function(a) {
        return {
            $: "Regular",
            a: a
        };
    };
    var $zwilias$elm_html_string$Html$String$node = F3(function(tag, attributes, children) {
        return A3($zwilias$elm_html_string$Html$Types$Node, tag, attributes, $zwilias$elm_html_string$Html$Types$Regular(children));
    });
    var $zwilias$elm_html_string$Html$String$a = $zwilias$elm_html_string$Html$String$node("a");
    var $zwilias$elm_html_string$Html$Types$StringProperty = F2(function(a, b) {
        return {
            $: "StringProperty",
            a: a,
            b: b
        };
    });
    var $zwilias$elm_html_string$Html$String$Attributes$stringProperty = $zwilias$elm_html_string$Html$Types$StringProperty;
    var $zwilias$elm_html_string$Html$String$Attributes$alt = function(val) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "alt", val);
    };
    var $zwilias$elm_html_string$Html$String$blockquote = $zwilias$elm_html_string$Html$String$node("blockquote");
    var $zwilias$elm_html_string$Html$Types$NoChildren = {
        $: "NoChildren"
    };
    var $zwilias$elm_html_string$Html$String$nodeWithoutChildren = F3(function(tag, attrs, _v0) {
        return A3($zwilias$elm_html_string$Html$Types$Node, tag, attrs, $zwilias$elm_html_string$Html$Types$NoChildren);
    });
    var $zwilias$elm_html_string$Html$String$br = $zwilias$elm_html_string$Html$String$nodeWithoutChildren("br");
    var $zwilias$elm_html_string$Html$String$Attributes$class = function(className) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "className", className);
    };
    var $zwilias$elm_html_string$Html$String$code = $zwilias$elm_html_string$Html$String$node("code");
    var $zwilias$elm_html_string$Html$String$del = $zwilias$elm_html_string$Html$String$node("del");
    var $zwilias$elm_html_string$Html$String$em = $zwilias$elm_html_string$Html$String$node("em");
    var $zwilias$elm_html_string$Html$String$h1 = $zwilias$elm_html_string$Html$String$node("h1");
    var $zwilias$elm_html_string$Html$String$h2 = $zwilias$elm_html_string$Html$String$node("h2");
    var $zwilias$elm_html_string$Html$String$h3 = $zwilias$elm_html_string$Html$String$node("h3");
    var $zwilias$elm_html_string$Html$String$h4 = $zwilias$elm_html_string$Html$String$node("h4");
    var $zwilias$elm_html_string$Html$String$h5 = $zwilias$elm_html_string$Html$String$node("h5");
    var $zwilias$elm_html_string$Html$String$h6 = $zwilias$elm_html_string$Html$String$node("h6");
    var $zwilias$elm_html_string$Html$String$hr = $zwilias$elm_html_string$Html$String$nodeWithoutChildren("hr");
    var $zwilias$elm_html_string$Html$String$Attributes$href = function(val) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "href", val);
    };
    var $zwilias$elm_html_string$Html$String$img = $zwilias$elm_html_string$Html$String$nodeWithoutChildren("img");
    var $zwilias$elm_html_string$Html$String$li = $zwilias$elm_html_string$Html$String$node("li");
    var $zwilias$elm_html_string$Html$String$ol = $zwilias$elm_html_string$Html$String$node("ol");
    var $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer = function(a) {
        return {
            $: "HtmlRenderer",
            a: a
        };
    };
    var $dillonkearns$elm_markdown$Markdown$Html$resultOr = F2(function(ra, rb) {
        if (ra.$ === "Err") {
            var singleError = ra.a;
            if (rb.$ === "Ok") {
                var okValue = rb.a;
                return $elm$core$Result$Ok(okValue);
            } else {
                var errorsSoFar = rb.a;
                return $elm$core$Result$Err(A2($elm$core$List$cons, singleError, errorsSoFar));
            }
        } else {
            var okValue = ra.a;
            return $elm$core$Result$Ok(okValue);
        }
    });
    var $dillonkearns$elm_markdown$Markdown$Html$attributesToString = function(attributes) {
        return A2($elm$core$String$join, " ", A2($elm$core$List$map, function(_v0) {
            var name = _v0.name;
            var value = _v0.value;
            return name + ('="' + (value + '"'));
        }, attributes));
    };
    var $dillonkearns$elm_markdown$Markdown$Html$tagToString = F2(function(tagName, attributes) {
        return $elm$core$List$isEmpty(attributes) ? "<" + (tagName + ">") : "<" + (tagName + (" " + ($dillonkearns$elm_markdown$Markdown$Html$attributesToString(attributes) + ">")));
    });
    var $dillonkearns$elm_markdown$Markdown$Html$oneOf = function(decoders) {
        var unwrappedDecoders = A2($elm$core$List$map, function(_v1) {
            var rawDecoder = _v1.a;
            return rawDecoder;
        }, decoders);
        return function(rawDecoder) {
            return $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer(F3(function(tagName, attributes, innerBlocks) {
                return A2($elm$core$Result$mapError, function(errors) {
                    if (!errors.b) return "Ran into a oneOf with no possibilities!";
                    else {
                        if (!errors.b.b) {
                            var singleError = errors.a;
                            return "Problem with the given value:\n\n" + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ("\n\n" + (singleError + "\n")));
                        } else return "oneOf failed parsing this value:\n    " + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ("\n\nParsing failed in the following 2 ways:\n\n\n" + (A2($elm$core$String$join, "\n\n", A2($elm$core$List$indexedMap, F2(function(index, error) {
                            return "(" + ($elm$core$String$fromInt(index + 1) + (") " + error));
                        }), errors)) + "\n")));
                    }
                }, A3(rawDecoder, tagName, attributes, innerBlocks));
            }));
        }(A3($elm$core$List$foldl, F2(function(decoder, soFar) {
            return F3(function(tagName, attributes, children) {
                return A2($dillonkearns$elm_markdown$Markdown$Html$resultOr, A3(decoder, tagName, attributes, children), A3(soFar, tagName, attributes, children));
            });
        }), F3(function(tagName, attributes, children) {
            return $elm$core$Result$Err(_List_Nil);
        }), unwrappedDecoders));
    };
    var $zwilias$elm_html_string$Html$String$p = $zwilias$elm_html_string$Html$String$node("p");
    var $zwilias$elm_html_string$Html$String$pre = $zwilias$elm_html_string$Html$String$node("pre");
    var $zwilias$elm_html_string$Html$String$Attributes$src = function(val) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "src", val);
    };
    var $zwilias$elm_html_string$Html$String$Attributes$start = function(n) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "start", $elm$core$String$fromInt(n));
    };
    var $zwilias$elm_html_string$Html$String$strong = $zwilias$elm_html_string$Html$String$node("strong");
    var $zwilias$elm_html_string$Html$String$table = $zwilias$elm_html_string$Html$String$node("table");
    var $zwilias$elm_html_string$Html$String$tbody = $zwilias$elm_html_string$Html$String$node("tbody");
    var $zwilias$elm_html_string$Html$String$td = $zwilias$elm_html_string$Html$String$node("td");
    var $zwilias$elm_html_string$Html$Types$TextNode = function(a) {
        return {
            $: "TextNode",
            a: a
        };
    };
    var $zwilias$elm_html_string$Html$String$text = $zwilias$elm_html_string$Html$Types$TextNode;
    var $zwilias$elm_html_string$Html$String$th = $zwilias$elm_html_string$Html$String$node("th");
    var $zwilias$elm_html_string$Html$String$thead = $zwilias$elm_html_string$Html$String$node("thead");
    var $zwilias$elm_html_string$Html$String$Attributes$title = function(val) {
        return A2($zwilias$elm_html_string$Html$String$Attributes$stringProperty, "title", val);
    };
    var $zwilias$elm_html_string$Html$String$tr = $zwilias$elm_html_string$Html$String$node("tr");
    var $zwilias$elm_html_string$Html$String$ul = $zwilias$elm_html_string$Html$String$node("ul");
    var $elm$core$String$words = _String_words;
    var $author$project$Message$Markdown$renderer = {
        blockQuote: $zwilias$elm_html_string$Html$String$blockquote(_List_Nil),
        codeBlock: function(_v0) {
            var body = _v0.body;
            var language = _v0.language;
            var classes = function() {
                var _v1 = A2($elm$core$Maybe$map, $elm$core$String$words, language);
                if (_v1.$ === "Just" && _v1.a.b) {
                    var _v2 = _v1.a;
                    var actualLanguage = _v2.a;
                    return _List_fromArray([
                        $zwilias$elm_html_string$Html$String$Attributes$class("language-" + actualLanguage)
                    ]);
                } else return _List_Nil;
            }();
            return A2($zwilias$elm_html_string$Html$String$pre, _List_Nil, _List_fromArray([
                A2($zwilias$elm_html_string$Html$String$code, classes, _List_fromArray([
                    $zwilias$elm_html_string$Html$String$text(body)
                ]))
            ]));
        },
        codeSpan: function(content) {
            return A2($zwilias$elm_html_string$Html$String$code, _List_Nil, _List_fromArray([
                $zwilias$elm_html_string$Html$String$text(content)
            ]));
        },
        emphasis: function(children) {
            return A2($zwilias$elm_html_string$Html$String$em, _List_Nil, children);
        },
        hardLineBreak: A2($zwilias$elm_html_string$Html$String$br, _List_Nil, _List_Nil),
        heading: function(_v3) {
            var level = _v3.level;
            var children = _v3.children;
            switch(level.$){
                case "H1":
                    return A2($zwilias$elm_html_string$Html$String$h1, _List_Nil, children);
                case "H2":
                    return A2($zwilias$elm_html_string$Html$String$h2, _List_Nil, children);
                case "H3":
                    return A2($zwilias$elm_html_string$Html$String$h3, _List_Nil, children);
                case "H4":
                    return A2($zwilias$elm_html_string$Html$String$h4, _List_Nil, children);
                case "H5":
                    return A2($zwilias$elm_html_string$Html$String$h5, _List_Nil, children);
                default:
                    return A2($zwilias$elm_html_string$Html$String$h6, _List_Nil, children);
            }
        },
        html: $dillonkearns$elm_markdown$Markdown$Html$oneOf(_List_Nil),
        image: function(imageInfo) {
            var _v5 = imageInfo.title;
            if (_v5.$ === "Just") {
                var title = _v5.a;
                return A2($zwilias$elm_html_string$Html$String$img, _List_fromArray([
                    $zwilias$elm_html_string$Html$String$Attributes$src(imageInfo.src),
                    $zwilias$elm_html_string$Html$String$Attributes$alt(imageInfo.alt),
                    $zwilias$elm_html_string$Html$String$Attributes$title(title)
                ]), _List_Nil);
            } else return A2($zwilias$elm_html_string$Html$String$img, _List_fromArray([
                $zwilias$elm_html_string$Html$String$Attributes$src(imageInfo.src),
                $zwilias$elm_html_string$Html$String$Attributes$alt(imageInfo.alt)
            ]), _List_Nil);
        },
        link: F2(function(link, content) {
            var _v6 = link.title;
            if (_v6.$ === "Just") return A2($zwilias$elm_html_string$Html$String$a, _List_fromArray([
                $zwilias$elm_html_string$Html$String$Attributes$href(link.destination)
            ]), content);
            else return A2($zwilias$elm_html_string$Html$String$a, _List_fromArray([
                $zwilias$elm_html_string$Html$String$Attributes$href(link.destination)
            ]), content);
        }),
        orderedList: F2(function(startingIndex, items) {
            return A2($zwilias$elm_html_string$Html$String$ol, function() {
                if (startingIndex === 1) return _List_fromArray([
                    $zwilias$elm_html_string$Html$String$Attributes$start(startingIndex)
                ]);
                else return _List_Nil;
            }(), A2($elm$core$List$map, function(itemBlocks) {
                return A2($zwilias$elm_html_string$Html$String$li, _List_Nil, itemBlocks);
            }, items));
        }),
        paragraph: $zwilias$elm_html_string$Html$String$p(_List_Nil),
        strikethrough: function(children) {
            return A2($zwilias$elm_html_string$Html$String$del, _List_Nil, children);
        },
        strong: function(children) {
            return A2($zwilias$elm_html_string$Html$String$strong, _List_Nil, children);
        },
        table: $zwilias$elm_html_string$Html$String$table(_List_Nil),
        tableBody: $zwilias$elm_html_string$Html$String$tbody(_List_Nil),
        tableCell: function(_v8) {
            return $zwilias$elm_html_string$Html$String$td(_List_Nil);
        },
        tableHeader: $zwilias$elm_html_string$Html$String$thead(_List_Nil),
        tableHeaderCell: function(_v9) {
            return $zwilias$elm_html_string$Html$String$th(_List_Nil);
        },
        tableRow: $zwilias$elm_html_string$Html$String$tr(_List_Nil),
        text: $zwilias$elm_html_string$Html$String$text,
        thematicBreak: A2($zwilias$elm_html_string$Html$String$hr, _List_Nil, _List_Nil),
        unorderedList: function(items) {
            return A2($zwilias$elm_html_string$Html$String$ul, _List_Nil, A2($elm$core$List$map, function(item) {
                var children = item.b;
                return A2($zwilias$elm_html_string$Html$String$li, _List_Nil, children);
            }, items));
        }
    };
    var $elm$core$Result$toMaybe = function(result) {
        if (result.$ === "Ok") {
            var v = result.a;
            return $elm$core$Maybe$Just(v);
        } else return $elm$core$Maybe$Nothing;
    };
    var $zwilias$elm_html_string$Html$Types$indent = F3(function(perLevel, level, x) {
        return _Utils_ap(A2($elm$core$String$repeat, perLevel * level, " "), x);
    });
    var $zwilias$elm_html_string$Html$Types$join = F2(function(between, list) {
        if (!list.b) return "";
        else if (!list.b.b) {
            var x = list.a;
            return x;
        } else {
            var x = list.a;
            var xs = list.b;
            return A3($elm$core$List$foldl, F2(function(y, acc) {
                return _Utils_ap(y, _Utils_ap(between, acc));
            }), x, xs);
        }
    });
    var $zwilias$elm_html_string$Html$Types$closingTag = function(tagName) {
        return "</" + (tagName + ">");
    };
    var $elm$core$String$replace = F3(function(before, after, string) {
        return A2($elm$core$String$join, after, A2($elm$core$String$split, before, string));
    });
    var $zwilias$elm_html_string$Html$Types$escapeHtmlText = A2($elm$core$Basics$composeR, A2($elm$core$String$replace, "&", "&amp;"), A2($elm$core$Basics$composeR, A2($elm$core$String$replace, "<", "&lt;"), A2($elm$core$String$replace, ">", "&gt;")));
    var $elm$core$Tuple$second = function(_v0) {
        var y = _v0.b;
        return y;
    };
    var $zwilias$elm_html_string$Html$Types$escape = A2($elm$core$String$foldl, F2(function(_char, acc) {
        return _Utils_eq(_char, _Utils_chr('"')) ? acc + '\\"' : _Utils_ap(acc, $elm$core$String$fromChar(_char));
    }), "");
    var $elm$core$Char$toLower = _Char_toLower;
    var $zwilias$elm_html_string$Html$Types$hyphenate = A2($elm$core$String$foldl, F2(function(_char, acc) {
        return $elm$core$Char$isUpper(_char) ? acc + ("-" + $elm$core$String$fromChar($elm$core$Char$toLower(_char))) : _Utils_ap(acc, $elm$core$String$fromChar(_char));
    }), "");
    var $zwilias$elm_html_string$Html$Types$buildProp = F2(function(key, value) {
        return $zwilias$elm_html_string$Html$Types$hyphenate(key) + ('="' + ($zwilias$elm_html_string$Html$Types$escape(value) + '"'));
    });
    var $NoRedInk$elm_string_conversions$String$Conversions$fromValue = function(value) {
        return A2($elm$json$Json$Encode$encode, 0, value);
    };
    var $zwilias$elm_html_string$Html$Types$propName = function(prop) {
        switch(prop){
            case "className":
                return "class";
            case "defaultValue":
                return "value";
            case "htmlFor":
                return "for";
            default:
                return prop;
        }
    };
    var $zwilias$elm_html_string$Html$Types$addAttribute = F2(function(attribute, acc) {
        var classes = acc.a;
        var styles = acc.b;
        var attrs = acc.c;
        switch(attribute.$){
            case "Attribute":
                var key = attribute.a;
                var value = attribute.b;
                return _Utils_Tuple3(classes, styles, A2($elm$core$List$cons, A2($zwilias$elm_html_string$Html$Types$buildProp, key, value), attrs));
            case "StringProperty":
                if (attribute.a === "className") {
                    var value = attribute.b;
                    return _Utils_Tuple3(A2($elm$core$List$cons, value, classes), styles, attrs);
                } else {
                    var string = attribute.a;
                    var value = attribute.b;
                    return _Utils_Tuple3(classes, styles, A2($elm$core$List$cons, A2($zwilias$elm_html_string$Html$Types$buildProp, $zwilias$elm_html_string$Html$Types$propName(string), value), attrs));
                }
            case "BoolProperty":
                var string = attribute.a;
                var enabled = attribute.b;
                return enabled ? _Utils_Tuple3(classes, styles, A2($elm$core$List$cons, $zwilias$elm_html_string$Html$Types$hyphenate($zwilias$elm_html_string$Html$Types$propName(string)), attrs)) : acc;
            case "ValueProperty":
                var string = attribute.a;
                var value = attribute.b;
                return _Utils_Tuple3(classes, styles, A2($elm$core$List$cons, A2($zwilias$elm_html_string$Html$Types$buildProp, $zwilias$elm_html_string$Html$Types$propName(string), $NoRedInk$elm_string_conversions$String$Conversions$fromValue(value)), attrs));
            case "Style":
                var key = attribute.a;
                var value = attribute.b;
                return _Utils_Tuple3(classes, A2($elm$core$List$cons, $zwilias$elm_html_string$Html$Types$escape(key) + (": " + $zwilias$elm_html_string$Html$Types$escape(value)), styles), attrs);
            default:
                return acc;
        }
    });
    var $zwilias$elm_html_string$Html$Types$withClasses = F2(function(classes, attrs) {
        if (!classes.b) return attrs;
        else return A2($elm$core$List$cons, A2($zwilias$elm_html_string$Html$Types$buildProp, "class", A2($zwilias$elm_html_string$Html$Types$join, " ", classes)), attrs);
    });
    var $zwilias$elm_html_string$Html$Types$withStyles = F2(function(styles, attrs) {
        if (!styles.b) return attrs;
        else return A2($elm$core$List$cons, A2($zwilias$elm_html_string$Html$Types$buildProp, "style", A2($zwilias$elm_html_string$Html$Types$join, "; ", styles)), attrs);
    });
    var $zwilias$elm_html_string$Html$Types$attributesToString = function(attrs) {
        var _v0 = A3($elm$core$List$foldl, $zwilias$elm_html_string$Html$Types$addAttribute, _Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil), attrs);
        var classes = _v0.a;
        var styles = _v0.b;
        var regular = _v0.c;
        return A2($zwilias$elm_html_string$Html$Types$withStyles, styles, A2($zwilias$elm_html_string$Html$Types$withClasses, classes, regular));
    };
    var $zwilias$elm_html_string$Html$Types$tag = F2(function(tagName, attributes) {
        return "<" + (A2($elm$core$String$join, " ", A2($elm$core$List$cons, tagName, $zwilias$elm_html_string$Html$Types$attributesToString(attributes))) + ">");
    });
    var $zwilias$elm_html_string$Html$Types$toStringHelper = F3(function(indenter, tags, acc) {
        toStringHelper: while(true){
            if (!tags.b) {
                var _v1 = acc.stack;
                if (!_v1.b) return acc;
                else {
                    var _v2 = _v1.a;
                    var tagName = _v2.a;
                    var cont = _v2.b;
                    var rest = _v1.b;
                    var $temp$indenter = indenter, $temp$tags = cont, $temp$acc = _Utils_update(acc, {
                        depth: acc.depth - 1,
                        result: A2($elm$core$List$cons, A2(indenter, acc.depth - 1, $zwilias$elm_html_string$Html$Types$closingTag(tagName)), acc.result),
                        stack: rest
                    });
                    indenter = $temp$indenter;
                    tags = $temp$tags;
                    acc = $temp$acc;
                    continue toStringHelper;
                }
            } else if (tags.a.$ === "Node") {
                var _v3 = tags.a;
                var tagName = _v3.a;
                var attributes = _v3.b;
                var children = _v3.c;
                var rest = tags.b;
                switch(children.$){
                    case "NoChildren":
                        var $temp$indenter = indenter, $temp$tags = rest, $temp$acc = _Utils_update(acc, {
                            result: A2($elm$core$List$cons, A2(indenter, acc.depth, A2($zwilias$elm_html_string$Html$Types$tag, tagName, attributes)), acc.result)
                        });
                        indenter = $temp$indenter;
                        tags = $temp$tags;
                        acc = $temp$acc;
                        continue toStringHelper;
                    case "Regular":
                        var childNodes = children.a;
                        var $temp$indenter = indenter, $temp$tags = childNodes, $temp$acc = _Utils_update(acc, {
                            depth: acc.depth + 1,
                            result: A2($elm$core$List$cons, A2(indenter, acc.depth, A2($zwilias$elm_html_string$Html$Types$tag, tagName, attributes)), acc.result),
                            stack: A2($elm$core$List$cons, _Utils_Tuple2(tagName, rest), acc.stack)
                        });
                        indenter = $temp$indenter;
                        tags = $temp$tags;
                        acc = $temp$acc;
                        continue toStringHelper;
                    default:
                        var childNodes = children.a;
                        var $temp$indenter = indenter, $temp$tags = A2($elm$core$List$map, $elm$core$Tuple$second, childNodes), $temp$acc = _Utils_update(acc, {
                            depth: acc.depth + 1,
                            result: A2($elm$core$List$cons, A2(indenter, acc.depth, A2($zwilias$elm_html_string$Html$Types$tag, tagName, attributes)), acc.result),
                            stack: A2($elm$core$List$cons, _Utils_Tuple2(tagName, rest), acc.stack)
                        });
                        indenter = $temp$indenter;
                        tags = $temp$tags;
                        acc = $temp$acc;
                        continue toStringHelper;
                }
            } else {
                var string = tags.a.a;
                var rest = tags.b;
                var $temp$indenter = indenter, $temp$tags = rest, $temp$acc = _Utils_update(acc, {
                    result: A2($elm$core$List$cons, A2(indenter, acc.depth, $zwilias$elm_html_string$Html$Types$escapeHtmlText(string)), acc.result)
                });
                indenter = $temp$indenter;
                tags = $temp$tags;
                acc = $temp$acc;
                continue toStringHelper;
            }
        }
    });
    var $zwilias$elm_html_string$Html$Types$toString = F2(function(depth, html) {
        var joinString = function() {
            if (!depth) return "";
            else return "\n";
        }();
        var initialAcc = {
            depth: 0,
            result: _List_Nil,
            stack: _List_Nil
        };
        var indenter = function() {
            if (!depth) return $elm$core$Basics$always($elm$core$Basics$identity);
            else return $zwilias$elm_html_string$Html$Types$indent(depth);
        }();
        return A2($zwilias$elm_html_string$Html$Types$join, joinString, A3($zwilias$elm_html_string$Html$Types$toStringHelper, indenter, _List_fromArray([
            html
        ]), initialAcc).result);
    });
    var $zwilias$elm_html_string$Html$String$toString = function(indent) {
        return $zwilias$elm_html_string$Html$Types$toString(indent);
    };
    var $author$project$Message$Markdown$markdownToHtmlString = function(mdstr) {
        return A2($elm$core$Maybe$andThen, function(htmlstr) {
            return _Utils_eq(htmlstr, "<p>" + (mdstr + "</p>")) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(htmlstr);
        }, A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $elm$core$List$map($zwilias$elm_html_string$Html$String$toString(0)), $elm$core$String$join("")), A2($elm$core$Maybe$withDefault, $elm$core$Maybe$Nothing, A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $dillonkearns$elm_markdown$Markdown$Renderer$render($author$project$Message$Markdown$renderer), $elm$core$Result$toMaybe), A3($elm$core$Basics$composeR, $dillonkearns$elm_markdown$Markdown$Parser$parse, $elm$core$Result$toMaybe, mdstr)))));
    };
    var $elm$json$Json$Encode$object = function(pairs) {
        return _Json_wrap(A3($elm$core$List$foldl, F2(function(_v0, obj) {
            var k = _v0.a;
            var v = _v0.b;
            return A3(_Json_addField, k, v, obj);
        }), _Json_emptyObject(_Utils_Tuple0), pairs));
    };
    var $elm$json$Json$Encode$string = _Json_wrap;
    var $author$project$Session$transactionId = function(_v0) {
        var session = _v0.a;
        return session.txnId;
    };
    var $author$project$Room$sendMessage = F3(function(session, _v0, comment) {
        var roomId = _v0.a;
        var txnId = $author$project$Session$transactionId(session);
        var msgtype = "m.text";
        var formattedBody = A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, function(s) {
            return _List_fromArray([
                _Utils_Tuple2("format", $elm$json$Json$Encode$string("org.matrix.custom.html")),
                _Utils_Tuple2("formatted_body", $elm$json$Json$Encode$string(s))
            ]);
        }, $author$project$Message$Markdown$markdownToHtmlString(comment)));
        var eventType = "m.room.message";
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$jsonBody($elm$json$Json$Encode$object(_Utils_ap(_List_fromArray([
                _Utils_Tuple2("msgtype", $elm$json$Json$Encode$string(msgtype)),
                _Utils_Tuple2("body", $elm$json$Json$Encode$string(comment))
            ]), formattedBody))),
            method: "PUT",
            params: _List_Nil,
            path: _List_fromArray([
                "rooms",
                roomId,
                "send",
                eventType,
                $elm$core$String$fromInt(txnId)
            ]),
            responseDecoder: $elm$json$Json$Decode$succeed(_Utils_Tuple0)
        });
    });
    var $author$project$Room$joinAndSend = F3(function(session, _v0, comment) {
        var roomId = _v0.a;
        return A2($elm$core$Task$andThen, function(_v1) {
            return A3($author$project$Room$sendMessage, session, $author$project$Room$RoomId(roomId), comment);
        }, A2($author$project$Room$joinRoom, session, roomId));
    });
    var $author$project$Room$sendComment = F3(function(session, roomId, comment) {
        return _Utils_Tuple2(function() {
            var _v0 = $author$project$Session$sessionKind(session);
            if (_v0.$ === "Guest") return A3($author$project$Room$joinAndSend, session, roomId, comment);
            else return A3($author$project$Room$sendMessage, session, roomId, comment);
        }(), $author$project$Session$incrementTransactionId(session));
    });
    var $author$project$Session$getUserId = function(_v0) {
        var session = _v0.a;
        return session.userId;
    };
    var $author$project$UserId$toString = function(_v0) {
        var localpart = _v0.a;
        var serverpart = _v0.b;
        return "@" + (localpart + (":" + serverpart));
    };
    var $author$project$Member$setDisplayname = F2(function(session, displayname) {
        return A2($author$project$Session$authenticatedRequest, session, {
            body: $elm$http$Http$jsonBody($elm$json$Json$Encode$object(_List_fromArray([
                _Utils_Tuple2("displayname", $elm$json$Json$Encode$string(displayname))
            ]))),
            method: "PUT",
            params: _List_Nil,
            path: _List_fromArray([
                "profile",
                $author$project$UserId$toString($author$project$Session$getUserId(session)),
                "displayname"
            ]),
            responseDecoder: $elm$json$Json$Decode$succeed(_Utils_Tuple0)
        });
    });
    var $author$project$LoginForm$Ready = {
        $: "Ready"
    };
    var $author$project$LoginForm$showLogin = function(_v0) {
        var form = _v0.a;
        return _Utils_eq(form.state, $author$project$LoginForm$Hidden) ? $author$project$LoginForm$LoginForm(_Utils_update(form, {
            state: $author$project$LoginForm$Ready
        })) : $author$project$LoginForm$LoginForm(form);
    };
    var $elm$json$Json$Encode$int = _Json_wrap;
    var $author$project$Session$toString = function(authType) {
        if (authType.$ === "Guest") return "guest";
        else return "user";
    };
    var $author$project$Session$encodeStoredSession = function(_v0) {
        var homeserverUrl = _v0.a.homeserverUrl;
        var kind = _v0.a.kind;
        var txnId = _v0.a.txnId;
        var userId = _v0.a.userId;
        var accessToken = _v0.a.accessToken;
        return A2($elm$json$Json$Encode$encode, 0, $elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2("homeserverUrl", $elm$json$Json$Encode$string(homeserverUrl)),
            _Utils_Tuple2("kind", $elm$json$Json$Encode$string($author$project$Session$toString(kind))),
            _Utils_Tuple2("txnId", $elm$json$Json$Encode$int(txnId)),
            _Utils_Tuple2("userId", $elm$json$Json$Encode$string($author$project$UserId$toString(userId))),
            _Utils_Tuple2("accessToken", $elm$json$Json$Encode$string(accessToken))
        ])));
    };
    var $author$project$Session$storeSession = _Platform_outgoingPort("storeSession", $elm$json$Json$Encode$string);
    var $author$project$Session$storeSessionCmd = function(session) {
        return $author$project$Session$storeSession($author$project$Session$encodeStoredSession(session));
    };
    var $author$project$Editor$update = F2(function(msg, _v0) {
        var editor = _v0.a;
        if (msg.$ === "EditComment") {
            var comment = msg.a;
            return $author$project$Editor$Editor(_Utils_update(editor, {
                comment: comment
            }));
        } else {
            var name = msg.a;
            return $author$project$Editor$Editor(_Utils_update(editor, {
                name: name
            }));
        }
    });
    var $author$project$LoginForm$LoggedIn = function(a) {
        return {
            $: "LoggedIn",
            a: a
        };
    };
    var $author$project$LoginForm$LoggingIn = {
        $: "LoggingIn"
    };
    var $author$project$LoginForm$HomeserverLookupFailed = function(a) {
        return {
            $: "HomeserverLookupFailed",
            a: a
        };
    };
    var $author$project$LoginForm$LoginFailed = function(a) {
        return {
            $: "LoginFailed",
            a: a
        };
    };
    var $author$project$Session$passwordLoginJson = function(_v0) {
        var user = _v0.user;
        var password = _v0.password;
        return $elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2("type", $elm$json$Json$Encode$string("m.login.password")),
            _Utils_Tuple2("identifier", $elm$json$Json$Encode$object(_List_fromArray([
                _Utils_Tuple2("type", $elm$json$Json$Encode$string("m.id.user")),
                _Utils_Tuple2("user", $elm$json$Json$Encode$string(user))
            ]))),
            _Utils_Tuple2("password", $elm$json$Json$Encode$string(password)),
            _Utils_Tuple2("initial_device_display_name", $elm$json$Json$Encode$string("Cactus Comments"))
        ]));
    };
    var $author$project$Session$login = function(_v0) {
        var homeserverUrl = _v0.homeserverUrl;
        var user = _v0.user;
        var password = _v0.password;
        return $author$project$Session$unauthenticatedRequest({
            body: $elm$http$Http$jsonBody($author$project$Session$passwordLoginJson({
                password: password,
                user: user
            })),
            method: "POST",
            responseDecoder: A2($author$project$Session$decodeSession, homeserverUrl, $author$project$Session$User),
            url: A3($author$project$ApiUtils$clientEndpoint, homeserverUrl, _List_fromArray([
                "login"
            ]), _List_Nil)
        });
    };
    var $author$project$UserId$servername = function(_v0) {
        var name = _v0.b;
        return name;
    };
    var $author$project$ApiUtils$lookupHomeserverUrl = function(userid) {
        var servername = $author$project$UserId$servername(userid);
        var url = "https://" + (servername + "/.well-known/matrix/client");
        return $elm$http$Http$task({
            body: $elm$http$Http$emptyBody,
            headers: _List_Nil,
            method: "GET",
            resolver: $elm$http$Http$stringResolver(function(resp) {
                if (resp.$ === "GoodStatus_") {
                    var body = resp.b;
                    var dropTrailingSlash = function(str) {
                        return A2($elm$core$String$endsWith, "/", str) ? A2($elm$core$String$dropRight, 1, str) : str;
                    };
                    var decoder = A2($elm$json$Json$Decode$map, dropTrailingSlash, A2($elm$json$Json$Decode$field, "m.homeserver", A2($elm$json$Json$Decode$field, "base_url", $elm$json$Json$Decode$string)));
                    var decoded = A2($elm$json$Json$Decode$decodeString, decoder, body);
                    if (decoded.$ === "Ok") {
                        var result = decoded.a;
                        return $elm$core$Result$Ok(result);
                    } else {
                        var err = decoded.a;
                        return $elm$core$Result$Err($elm$json$Json$Decode$errorToString(err));
                    }
                } else return $elm$core$Result$Err("Failed getting " + url);
            }),
            timeout: $elm$core$Maybe$Nothing,
            url: url
        });
    };
    var $elm$core$Task$mapError = F2(function(convert, task) {
        return A2($elm$core$Task$onError, A2($elm$core$Basics$composeL, $elm$core$Task$fail, convert), task);
    });
    var $author$project$UserId$username = function(_v0) {
        var name = _v0.a;
        return name;
    };
    var $author$project$LoginForm$loginWithForm = F2(function(_v0, userId) {
        var form = _v0.a;
        var _v1 = form.homeserverUrlField;
        if (_v1.$ === "Just") {
            var homeserverUrl = _v1.a;
            return A2($elm$core$Task$mapError, $author$project$LoginForm$LoginFailed, $author$project$Session$login({
                homeserverUrl: homeserverUrl,
                password: form.passwordField,
                user: $author$project$UserId$username(userId)
            }));
        } else return A2($elm$core$Task$andThen, function(homeserverUrl) {
            return A2($elm$core$Task$mapError, $author$project$LoginForm$LoginFailed, $author$project$Session$login({
                homeserverUrl: homeserverUrl,
                password: form.passwordField,
                user: $author$project$UserId$username(userId)
            }));
        }, A2($elm$core$Task$mapError, $author$project$LoginForm$HomeserverLookupFailed, $author$project$ApiUtils$lookupHomeserverUrl(userId)));
    });
    var $author$project$LoginForm$updateLoginForm = F2(function(_v0, msg) {
        var form = _v0.a;
        var updateState = function(f) {
            return _Utils_Tuple3($author$project$LoginForm$LoginForm(f), $elm$core$Platform$Cmd$none, $elm$core$Maybe$Nothing);
        };
        switch(msg.$){
            case "EditPassword":
                var password = msg.a;
                return updateState(_Utils_update(form, {
                    passwordField: password
                }));
            case "EditHomeserverUrl":
                var homeserverUrl = msg.a;
                return updateState(_Utils_update(form, {
                    homeserverUrlField: $elm$core$Maybe$Just(homeserverUrl)
                }));
            case "EditUserId":
                var userIdStr = msg.a;
                return updateState(_Utils_update(form, {
                    userId: $author$project$UserId$parseUserId(userIdStr),
                    userIdField: userIdStr
                }));
            case "HideLogin":
                return updateState(_Utils_update(form, {
                    state: $author$project$LoginForm$Hidden
                }));
            case "Login":
                var userId = msg.a;
                return _Utils_Tuple3($author$project$LoginForm$LoginForm(_Utils_update(form, {
                    state: $author$project$LoginForm$LoggingIn
                })), A2($elm$core$Task$attempt, $author$project$LoginForm$LoggedIn, A2($author$project$LoginForm$loginWithForm, $author$project$LoginForm$LoginForm(form), userId)), $elm$core$Maybe$Nothing);
            default:
                if (msg.a.$ === "Err") {
                    var err = msg.a.a;
                    return updateState(_Utils_update(form, {
                        homeserverUrlField: function() {
                            var _v2 = _Utils_Tuple2(err, form.homeserverUrlField);
                            if (_v2.a.$ === "HomeserverLookupFailed" && _v2.b.$ === "Nothing") {
                                var _v3 = _v2.b;
                                return $elm$core$Maybe$Just("");
                            } else return form.homeserverUrlField;
                        }(),
                        loginError: $elm$core$Maybe$Just(err),
                        state: $author$project$LoginForm$Ready
                    }));
                } else {
                    var sess = msg.a.a;
                    return _Utils_Tuple3($author$project$LoginForm$initLoginForm, $elm$core$Platform$Cmd$none, $elm$core$Maybe$Just(sess));
                }
        }
    });
    var $author$project$Main$update = F2(function(msg, model_) {
        if (model_.$ === "BadConfig") return _Utils_Tuple2(model_, $elm$core$Platform$Cmd$none);
        else {
            var model = model_.a;
            var fillComments = F2(function(session, room) {
                return _Utils_cmp($author$project$Room$commentCount(room), model.showComments) < 0 ? A2($elm$core$Task$attempt, A2($author$project$Main$GotMessages, session, $author$project$Room$Older), A2($author$project$Room$getOlderMessages, session, room)) : $elm$core$Platform$Cmd$none;
            });
            return A2($elm$core$Tuple$mapFirst, $author$project$Main$GoodConfig, function() {
                switch(msg.$){
                    case "Tick":
                        var now = msg.a;
                        return _Utils_Tuple2(_Utils_update(model, {
                            now: now
                        }), A2($elm$core$Maybe$withDefault, $elm$core$Platform$Cmd$none, A3($elm$core$Maybe$map2, F2(function(s, r) {
                            return A2($elm$core$Task$attempt, A2($author$project$Main$GotMessages, s, $author$project$Room$Newer), A2($author$project$Room$getNewerMessages, s, r));
                        }), model.session, model.room)));
                    case "CloseError":
                        var id = msg.a;
                        return _Utils_Tuple2(_Utils_update(model, {
                            errors: A2($elm$core$List$filter, function(e) {
                                return !_Utils_eq(e.id, id);
                            }, model.errors)
                        }), $elm$core$Platform$Cmd$none);
                    case "EditorMsg":
                        var m = msg.a;
                        return _Utils_Tuple2(_Utils_update(model, {
                            editor: A2($author$project$Editor$update, m, model.editor)
                        }), $elm$core$Platform$Cmd$none);
                    case "GotRoom":
                        if (msg.a.$ === "Ok") {
                            var _v2 = msg.a.a;
                            var session = _v2.a;
                            var room = _v2.b;
                            return _Utils_Tuple2(_Utils_update(model, {
                                room: $elm$core$Maybe$Just(room),
                                session: $elm$core$Maybe$Just(session)
                            }), $elm$core$Platform$Cmd$batch(_List_fromArray([
                                $author$project$Session$storeSessionCmd(session),
                                A2(fillComments, session, room)
                            ])));
                        } else {
                            var _v3 = msg.a.a;
                            var code = _v3.a;
                            var error = _v3.b;
                            return _Utils_Tuple2(_Utils_update(model, {
                                errors: A2($author$project$Main$addError, model.errors, code + (" " + error))
                            }), $elm$core$Platform$Cmd$none);
                        }
                    case "GotMessages":
                        if (msg.c.$ === "Ok") {
                            var session = msg.a;
                            var dir = msg.b;
                            var newMsgs = msg.c.a;
                            var newRoom = A2($elm$core$Maybe$map, function(r) {
                                return A3($author$project$Room$mergeMessages, r, dir, newMsgs);
                            }, model.room);
                            var newModel = _Utils_update(model, {
                                gotAllComments: model.gotAllComments || $elm$core$List$isEmpty(newMsgs.chunk) && _Utils_eq(dir, $author$project$Room$Older),
                                room: newRoom
                            });
                            return _Utils_Tuple2(newModel, function() {
                                var _v4 = _Utils_Tuple2(newRoom, newModel.gotAllComments);
                                if (_v4.a.$ === "Just" && !_v4.b) {
                                    var r = _v4.a.a;
                                    return A2(fillComments, session, r);
                                } else return $elm$core$Platform$Cmd$none;
                            }());
                        } else {
                            var _v5 = msg.c.a;
                            var code = _v5.a;
                            var error = _v5.b;
                            return _Utils_Tuple2(_Utils_update(model, {
                                errors: A2($author$project$Main$addError, model.errors, code + (" " + error))
                            }), $elm$core$Platform$Cmd$none);
                        }
                    case "ViewMore":
                        var session = msg.a;
                        var room = msg.b;
                        var newShowComments = model.showComments + model.config.pageSize;
                        return _Utils_Tuple2(_Utils_update(model, {
                            showComments: newShowComments
                        }), A2($elm$core$Task$attempt, A2($author$project$Main$GotMessages, session, $author$project$Room$Older), A2($author$project$Room$getOlderMessages, session, room)));
                    case "SendComment":
                        var session = msg.a;
                        var roomId = msg.b;
                        var _v6 = A3($author$project$Room$sendComment, session, roomId, $author$project$Editor$getComment(model.editor));
                        var sendTask = _v6.a;
                        var newSession = _v6.b;
                        return _Utils_Tuple2(_Utils_update(model, {
                            editor: $author$project$Editor$clear(model.editor),
                            session: $elm$core$Maybe$Just(newSession)
                        }), $elm$core$Platform$Cmd$batch(_List_fromArray([
                            A2($elm$core$Task$attempt, $author$project$Main$SentComment(session), function() {
                                var _v7 = $author$project$Session$sessionKind(session);
                                if (_v7.$ === "User") return sendTask;
                                else return A2($elm$core$Task$andThen, function(_v8) {
                                    return sendTask;
                                }, A2($author$project$Member$setDisplayname, session, $author$project$Editor$getName(model.editor)));
                            }()),
                            $author$project$Session$storeSessionCmd(newSession)
                        ])));
                    case "SentComment":
                        if (msg.b.$ === "Ok") {
                            var session = msg.a;
                            return _Utils_Tuple2(model, A2($elm$core$Maybe$withDefault, $elm$core$Platform$Cmd$none, A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $author$project$Room$getNewerMessages(session), $elm$core$Task$attempt(A2($author$project$Main$GotMessages, session, $author$project$Room$Newer))), model.room)));
                        } else {
                            var _v9 = msg.b.a;
                            var code = _v9.a;
                            var error = _v9.b;
                            return _Utils_Tuple2(_Utils_update(model, {
                                errors: A2($author$project$Main$addError, model.errors, code + (" " + error))
                            }), $elm$core$Platform$Cmd$none);
                        }
                    case "LoginMsg":
                        var loginmsg = msg.a;
                        var _v10 = A2($author$project$LoginForm$updateLoginForm, model.loginForm, loginmsg);
                        var form = _v10.a;
                        var formCmd = _v10.b;
                        var newSession = _v10.c;
                        var joinAndGetRoom = A2($elm$core$Maybe$withDefault, $elm$core$Platform$Cmd$none, A2($elm$core$Maybe$map, function(s) {
                            return A2($elm$core$Task$attempt, $author$project$Main$GotRoom, A2($elm$core$Task$andThen, function(_v12) {
                                return A2($elm$core$Task$map, $elm$core$Tuple$pair(s), A2($author$project$Room$getInitialRoom, s, model.config.roomAlias));
                            }, A2($author$project$Room$joinRoom, s, model.config.roomAlias)));
                        }, newSession));
                        var storeSession = A2($elm$core$Maybe$withDefault, $elm$core$Platform$Cmd$none, A2($elm$core$Maybe$map, $author$project$Session$storeSessionCmd, newSession));
                        return _Utils_Tuple2(_Utils_update(model, {
                            loginForm: form,
                            session: function() {
                                if (newSession.$ === "Just") return newSession;
                                else return model.session;
                            }()
                        }), $elm$core$Platform$Cmd$batch(_List_fromArray([
                            A2($elm$core$Platform$Cmd$map, $author$project$Main$LoginMsg, formCmd),
                            joinAndGetRoom,
                            storeSession
                        ])));
                    case "ShowLogin":
                        return _Utils_Tuple2(_Utils_update(model, {
                            loginForm: $author$project$LoginForm$showLogin(model.loginForm)
                        }), $elm$core$Platform$Cmd$none);
                    default:
                        return _Utils_Tuple2(model, A2($elm$core$Task$attempt, $author$project$Main$GotRoom, A2($elm$core$Task$andThen, function(sess) {
                            return A2($elm$core$Task$map, $elm$core$Tuple$pair(sess), A2($author$project$Room$getInitialRoom, sess, model.config.roomAlias));
                        }, $author$project$Session$registerGuest(model.config.defaultHomeserverUrl))));
                }
            }());
        }
    });
    var $author$project$Main$EditorMsg = function(a) {
        return {
            $: "EditorMsg",
            a: a
        };
    };
    var $author$project$Main$LogOut = {
        $: "LogOut"
    };
    var $author$project$Main$SendComment = F2(function(a, b) {
        return {
            $: "SendComment",
            a: a,
            b: b
        };
    });
    var $author$project$Main$ShowLogin = {
        $: "ShowLogin"
    };
    var $author$project$Main$ViewMore = F2(function(a, b) {
        return {
            $: "ViewMore",
            a: a,
            b: b
        };
    });
    var $elm$html$Html$button = _VirtualDom_node("button");
    var $tesk9$accessible_html$Accessibility$button = $elm$html$Html$button;
    var $elm$html$Html$Attributes$stringProperty = F2(function(key, string) {
        return A2(_VirtualDom_property, key, $elm$json$Json$Encode$string(string));
    });
    var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty("className");
    var $elm$html$Html$div = _VirtualDom_node("div");
    var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
    var $elm$html$Html$Attributes$map = $elm$virtual_dom$VirtualDom$mapAttribute;
    var $tesk9$accessible_html$Accessibility$Utils$nonInteractive = $elm$core$List$map($elm$html$Html$Attributes$map($elm$core$Basics$never));
    var $tesk9$accessible_html$Accessibility$div = function(attributes) {
        return $elm$html$Html$div($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $author$project$Room$extractRoomId = function(_v0) {
        var r = _v0.a;
        return r.roomId;
    };
    var $author$project$Session$getHomeserverUrl = function(_v0) {
        var session = _v0.a;
        return session.homeserverUrl;
    };
    var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
    var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
    var $elm$virtual_dom$VirtualDom$Normal = function(a) {
        return {
            $: "Normal",
            a: a
        };
    };
    var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
    var $elm$html$Html$Events$on = F2(function(event, decoder) {
        return A2($elm$virtual_dom$VirtualDom$on, event, $elm$virtual_dom$VirtualDom$Normal(decoder));
    });
    var $elm$html$Html$Events$onClick = function(msg) {
        return A2($elm$html$Html$Events$on, "click", $elm$json$Json$Decode$succeed(msg));
    };
    var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
    var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
    var $tesk9$accessible_html$Accessibility$text = $elm$html$Html$text;
    var $author$project$Editor$EditComment = function(a) {
        return {
            $: "EditComment",
            a: a
        };
    };
    var $author$project$Editor$EditName = function(a) {
        return {
            $: "EditName",
            a: a
        };
    };
    var $elm$html$Html$a = _VirtualDom_node("a");
    var $tesk9$accessible_html$Accessibility$a = function(attributes) {
        return $elm$html$Html$a($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $elm$json$Json$Encode$bool = _Json_wrap;
    var $elm$html$Html$Attributes$boolProperty = F2(function(key, bool) {
        return A2(_VirtualDom_property, key, $elm$json$Json$Encode$bool(bool));
    });
    var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty("disabled");
    var $elm$html$Html$Attributes$href = function(url) {
        return A2($elm$html$Html$Attributes$stringProperty, "href", _VirtualDom_noJavaScriptUri(url));
    };
    var $elm$html$Html$input = _VirtualDom_node("input");
    var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty("type");
    var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty("value");
    var $tesk9$accessible_html$Accessibility$inputText = F2(function(value_, attributes) {
        return A2($elm$html$Html$input, _Utils_ap(_List_fromArray([
            $elm$html$Html$Attributes$type_("text"),
            $elm$html$Html$Attributes$value(value_)
        ]), attributes), _List_Nil);
    });
    var $author$project$Session$isUser = function(_v0) {
        var session = _v0.a;
        return _Utils_eq(session.kind, $author$project$Session$User);
    };
    var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty("htmlFor");
    var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
    var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
    var $tesk9$accessible_html$Accessibility$Style$invisible = _List_fromArray([
        A2($elm$html$Html$Attributes$style, "property", "clip rect(1px, 1px, 1px, 1px)"),
        A2($elm$html$Html$Attributes$style, "position", "absolute"),
        A2($elm$html$Html$Attributes$style, "height", "1px"),
        A2($elm$html$Html$Attributes$style, "width", "1px"),
        A2($elm$html$Html$Attributes$style, "overflow", "hidden"),
        A2($elm$html$Html$Attributes$style, "margin", "-1px"),
        A2($elm$html$Html$Attributes$style, "padding", "0"),
        A2($elm$html$Html$Attributes$style, "border", "0")
    ]);
    var $elm$html$Html$label = _VirtualDom_node("label");
    var $tesk9$accessible_html$Accessibility$label = function(attributes) {
        return $elm$html$Html$label($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $elm$html$Html$span = _VirtualDom_node("span");
    var $tesk9$accessible_html$Accessibility$span = function(attributes) {
        return $elm$html$Html$span($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $tesk9$accessible_html$Accessibility$labelHidden = F4(function(id, attributes, labelContent, input) {
        return A2($tesk9$accessible_html$Accessibility$span, _List_Nil, _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$label, A2($elm$core$List$cons, $elm$html$Html$Attributes$for(id), _Utils_ap($tesk9$accessible_html$Accessibility$Style$invisible, attributes)), _List_fromArray([
                A2($elm$html$Html$map, $elm$core$Basics$never, labelContent)
            ])),
            input
        ]));
    });
    var $author$project$Editor$loginOrLogoutButton = function(_v0) {
        var loginMsg = _v0.loginMsg;
        var logoutMsg = _v0.logoutMsg;
        var session = _v0.session;
        var logoutButton = A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-button"),
            $elm$html$Html$Attributes$class("cactus-logout-button"),
            $elm$html$Html$Events$onClick(logoutMsg)
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Log out")
        ]));
        var loginButton = A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-button"),
            $elm$html$Html$Attributes$class("cactus-login-button"),
            $elm$html$Html$Events$onClick(loginMsg)
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Log in")
        ]));
        if (session.$ === "Just") {
            var sess = session.a;
            return $author$project$Session$isUser(sess) ? logoutButton : loginButton;
        } else return loginButton;
    };
    var $author$project$ApiUtils$matrixDotToUrl = function(identifier) {
        return A3($elm$url$Url$Builder$crossOrigin, "https://matrix.to", _List_fromArray([
            "#",
            $elm$url$Url$percentEncode(identifier)
        ]), _List_Nil);
    };
    var $elm$html$Html$Events$alwaysStop = function(x) {
        return _Utils_Tuple2(x, true);
    };
    var $elm$virtual_dom$VirtualDom$MayStopPropagation = function(a) {
        return {
            $: "MayStopPropagation",
            a: a
        };
    };
    var $elm$html$Html$Events$stopPropagationOn = F2(function(event, decoder) {
        return A2($elm$virtual_dom$VirtualDom$on, event, $elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
    });
    var $elm$json$Json$Decode$at = F2(function(fields, decoder) {
        return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
    });
    var $elm$html$Html$Events$targetValue = A2($elm$json$Json$Decode$at, _List_fromArray([
        "target",
        "value"
    ]), $elm$json$Json$Decode$string);
    var $elm$html$Html$Events$onInput = function(tagger) {
        return A2($elm$html$Html$Events$stopPropagationOn, "input", A2($elm$json$Json$Decode$map, $elm$html$Html$Events$alwaysStop, A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
    };
    var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty("placeholder");
    var $elm$html$Html$textarea = _VirtualDom_node("textarea");
    var $tesk9$accessible_html$Accessibility$textarea = $elm$html$Html$textarea;
    var $author$project$Editor$viewSendButton = F3(function(session, msg, editorContent) {
        var postButtonString = function() {
            var _v0 = _Utils_Tuple2(A2($elm$core$Maybe$map, $author$project$Session$isUser, session), A2($elm$core$Maybe$map, $author$project$Session$getUserId, session));
            if (_v0.a.$ === "Just" && _v0.a.a && _v0.b.$ === "Just") {
                var userid = _v0.b.a;
                return "Post as " + $author$project$UserId$toString(userid);
            } else return "Post";
        }();
        var isDisabled = _Utils_eq(session, $elm$core$Maybe$Nothing) || !$elm$core$String$length(editorContent);
        var attrs = _Utils_ap(_List_fromArray([
            $elm$html$Html$Attributes$class("cactus-button"),
            $elm$html$Html$Attributes$class("cactus-send-button"),
            $elm$html$Html$Attributes$disabled(isDisabled)
        ]), A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, $elm$core$List$singleton, A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, msg))));
        return A2($tesk9$accessible_html$Accessibility$button, attrs, _List_fromArray([
            $tesk9$accessible_html$Accessibility$text(postButtonString)
        ]));
    });
    var $author$project$Editor$view = F2(function(_v0, _v1) {
        var editor = _v0.a;
        var session = _v1.session;
        var roomAlias = _v1.roomAlias;
        var loginEnabled = _v1.loginEnabled;
        var guestPostingEnabled = _v1.guestPostingEnabled;
        var msgmap = _v1.msgmap;
        var showLogin = _v1.showLogin;
        var logout = _v1.logout;
        var send = _v1.send;
        var sendButton = A3($author$project$Editor$viewSendButton, session, send, editor.comment);
        var nameInput = A2($elm$core$Maybe$withDefault, true, A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $author$project$Session$isUser, $elm$core$Basics$not), session)) ? A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-editor-name")
        ]), _List_fromArray([
            A4($tesk9$accessible_html$Accessibility$labelHidden, "Name", _List_Nil, $tesk9$accessible_html$Accessibility$text("Name"), A2($tesk9$accessible_html$Accessibility$inputText, editor.name, _List_fromArray([
                $elm$html$Html$Attributes$placeholder("Name"),
                $elm$html$Html$Events$onInput(A2($elm$core$Basics$composeR, $author$project$Editor$EditName, msgmap))
            ])))
        ])) : $tesk9$accessible_html$Accessibility$text("");
        var loginButton = loginEnabled ? $author$project$Editor$loginOrLogoutButton({
            loginMsg: showLogin,
            logoutMsg: logout,
            session: session
        }) : A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
            $elm$html$Html$Attributes$href($author$project$ApiUtils$matrixDotToUrl(roomAlias))
        ]), _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-button")
            ]), _List_fromArray([
                $tesk9$accessible_html$Accessibility$text("Log in")
            ]))
        ]));
        var commentEditor = function(enabled) {
            return A4($tesk9$accessible_html$Accessibility$labelHidden, "Comment Editor", _List_Nil, $tesk9$accessible_html$Accessibility$text("Comment Editor"), A2($tesk9$accessible_html$Accessibility$textarea, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-editor-textarea"),
                $elm$html$Html$Attributes$value(editor.comment),
                $elm$html$Html$Events$onInput(A2($elm$core$Basics$composeR, $author$project$Editor$EditComment, msgmap)),
                $elm$html$Html$Attributes$placeholder("Add a comment"),
                $elm$html$Html$Attributes$disabled(!enabled)
            ]), _List_Nil));
        };
        var buttonDiv = A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-editor-buttons")
        ]), _List_fromArray([
            loginButton,
            sendButton
        ]));
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-editor")
        ]), function() {
            var _v2 = _Utils_Tuple2(loginEnabled, guestPostingEnabled);
            if (_v2.a) {
                if (_v2.b) return _List_fromArray([
                    commentEditor(true),
                    A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-editor-below")
                    ]), _List_fromArray([
                        nameInput,
                        buttonDiv
                    ]))
                ]);
                else return _List_fromArray([
                    commentEditor(A2($elm$core$Maybe$withDefault, false, A2($elm$core$Maybe$map, $author$project$Session$isUser, session))),
                    A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-editor-below")
                    ]), _List_fromArray([
                        buttonDiv
                    ]))
                ]);
            } else {
                if (_v2.b) return _List_fromArray([
                    commentEditor(true),
                    A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-editor-below")
                    ]), _List_fromArray([
                        nameInput,
                        buttonDiv
                    ]))
                ]);
                else return _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                        $elm$html$Html$Attributes$href($author$project$ApiUtils$matrixDotToUrl(roomAlias)),
                        $elm$html$Html$Attributes$class("cactus-button"),
                        $elm$html$Html$Attributes$class("cactus-matrixdotto-only")
                    ]), _List_fromArray([
                        $tesk9$accessible_html$Accessibility$text("Comment using a Matrix client")
                    ]))
                ]);
            }
        }());
    });
    var $author$project$Main$CloseError = function(a) {
        return {
            $: "CloseError",
            a: a
        };
    };
    var $elm$virtual_dom$VirtualDom$attribute = F2(function(key, value) {
        return A2(_VirtualDom_attribute, _VirtualDom_noOnOrFormAction(key), _VirtualDom_noJavaScriptOrHtmlUri(value));
    });
    var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
    var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute("class");
    var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute("d");
    var $tesk9$accessible_html$Accessibility$Utils$aria = A2($elm$core$Basics$composeL, $elm$html$Html$Attributes$attribute, $elm$core$Basics$append("aria-"));
    var $tesk9$accessible_html$Accessibility$Aria$errorMessage = $tesk9$accessible_html$Accessibility$Utils$aria("errormessage");
    var $elm$html$Html$p = _VirtualDom_node("p");
    var $tesk9$accessible_html$Accessibility$p = function(attributes) {
        return $elm$html$Html$p($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS("http://www.w3.org/2000/svg");
    var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode("path");
    var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode("svg");
    var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute("viewBox");
    var $author$project$Main$viewError = function(_v0) {
        var id = _v0.id;
        var message = _v0.message;
        var content = A2($tesk9$accessible_html$Accessibility$p, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-error-text")
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text(" Error: " + message)
        ]));
        var closeButton = A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-error-close"),
            A2($elm$html$Html$Attributes$attribute, "aria-label", "close"),
            $elm$html$Html$Events$onClick($author$project$Main$CloseError(id))
        ]), _List_fromArray([
            A2($elm$svg$Svg$svg, _List_fromArray([
                $elm$svg$Svg$Attributes$viewBox("0 0 20 20"),
                $elm$svg$Svg$Attributes$class("cactus-error-close-icon"),
                A2($elm$html$Html$Attributes$style, "fill", "currentColor")
            ]), _List_fromArray([
                A2($elm$svg$Svg$path, _List_fromArray([
                    A2($elm$html$Html$Attributes$style, "fill-rule", "evenodd"),
                    $elm$svg$Svg$Attributes$d("M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"),
                    A2($elm$html$Html$Attributes$style, "clip-rule", "evenodd")
                ]), _List_Nil)
            ]))
        ]));
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-error"),
            $tesk9$accessible_html$Accessibility$Aria$errorMessage(message)
        ]), _List_fromArray([
            closeButton,
            content
        ]));
    };
    var $author$project$LoginForm$EditHomeserverUrl = function(a) {
        return {
            $: "EditHomeserverUrl",
            a: a
        };
    };
    var $author$project$LoginForm$EditPassword = function(a) {
        return {
            $: "EditPassword",
            a: a
        };
    };
    var $author$project$LoginForm$EditUserId = function(a) {
        return {
            $: "EditUserId",
            a: a
        };
    };
    var $author$project$LoginForm$Login = function(a) {
        return {
            $: "Login",
            a: a
        };
    };
    var $author$project$LoginForm$HideLogin = {
        $: "HideLogin"
    };
    var $author$project$LoginForm$closeButton = A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
        $elm$html$Html$Attributes$class("cactus-login-close"),
        A2($elm$html$Html$Attributes$attribute, "aria-label", "close"),
        $elm$html$Html$Events$onClick($author$project$LoginForm$HideLogin)
    ]), _List_fromArray([
        A2($elm$svg$Svg$svg, _List_fromArray([
            $elm$svg$Svg$Attributes$viewBox("0 0 20 20"),
            $elm$svg$Svg$Attributes$class("cactus-login-close-icon"),
            A2($elm$html$Html$Attributes$style, "fill", "currentColor")
        ]), _List_fromArray([
            A2($elm$svg$Svg$path, _List_fromArray([
                A2($elm$html$Html$Attributes$style, "fill-rule", "evenodd"),
                $elm$svg$Svg$Attributes$d("M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"),
                A2($elm$html$Html$Attributes$style, "clip-rule", "evenodd")
            ]), _List_Nil)
        ]))
    ]));
    var $author$project$LoginForm$containerClickDecoder = A2($elm$json$Json$Decode$andThen, function(c) {
        return A2($elm$core$String$contains, "cactus-login-form-wrapper", c) ? $elm$json$Json$Decode$succeed($author$project$LoginForm$HideLogin) : $elm$json$Json$Decode$fail("Ignoring click event. Didn't hit wrapper.");
    }, A2($elm$json$Json$Decode$at, _List_fromArray([
        "target",
        "className"
    ]), $elm$json$Json$Decode$string));
    var $author$project$LoginForm$errorToString = function(err) {
        if (err.$ === "HomeserverLookupFailed") {
            var hserr = err.a;
            return "Could not find homeserver: " + hserr;
        } else {
            var _v1 = err.a;
            var code = _v1.a;
            var msg = _v1.b;
            return code + (": " + msg);
        }
    };
    var $elm$html$Html$h3 = _VirtualDom_node("h3");
    var $tesk9$accessible_html$Accessibility$h3 = function(attributes) {
        return $elm$html$Html$h3($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $elm$html$Html$h4 = _VirtualDom_node("h4");
    var $tesk9$accessible_html$Accessibility$h4 = function(attributes) {
        return $elm$html$Html$h4($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $tesk9$accessible_html$Accessibility$Utils$toBoolString = function(bool) {
        return bool ? "true" : "false";
    };
    var $tesk9$accessible_html$Accessibility$Widget$invalid = A2($elm$core$Basics$composeL, $tesk9$accessible_html$Accessibility$Utils$aria("invalid"), $tesk9$accessible_html$Accessibility$Utils$toBoolString);
    var $elm_community$maybe_extra$Maybe$Extra$isJust = function(m) {
        if (m.$ === "Nothing") return false;
        else return true;
    };
    var $tesk9$accessible_html$Accessibility$Widget$label = $tesk9$accessible_html$Accessibility$Utils$aria("label");
    var $elm$html$Html$Attributes$required = $elm$html$Html$Attributes$boolProperty("required");
    var $author$project$LoginForm$textField = function(_v0) {
        var name = _v0.name;
        var value = _v0.value;
        var _default = _v0._default;
        var msgf = _v0.msgf;
        var attrs = _v0.attrs;
        var error = _v0.error;
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-field")
        ]), _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$label, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-login-label")
            ]), _List_fromArray([
                $tesk9$accessible_html$Accessibility$text(name)
            ])),
            A2($tesk9$accessible_html$Accessibility$inputText, value, _Utils_ap(attrs, _List_fromArray([
                $elm$html$Html$Attributes$placeholder(_default),
                $elm$html$Html$Events$onInput(msgf),
                $elm$html$Html$Attributes$required(true),
                $tesk9$accessible_html$Accessibility$Widget$label(name),
                $tesk9$accessible_html$Accessibility$Widget$invalid($elm_community$maybe_extra$Maybe$Extra$isJust(error))
            ]))),
            A2($elm$core$Maybe$withDefault, $tesk9$accessible_html$Accessibility$text(""), A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $tesk9$accessible_html$Accessibility$text, A2($elm$core$Basics$composeR, $elm$core$List$singleton, $tesk9$accessible_html$Accessibility$p(_List_fromArray([
                $elm$html$Html$Attributes$class("cactus-login-error")
            ])))), error))
        ]));
    };
    var $author$project$LoginForm$viewLoginForm = F2(function(_v0, roomAlias) {
        var form = _v0.a;
        var username = $author$project$LoginForm$textField({
            attrs: _List_Nil,
            _default: "@alice:example.com",
            error: function() {
                var _v3 = form.userId;
                if (_v3.$ === "Err") {
                    var e = _v3.a;
                    return $elm$core$Maybe$Just(e);
                } else return $elm$core$Maybe$Nothing;
            }(),
            msgf: $author$project$LoginForm$EditUserId,
            name: "User ID",
            value: form.userIdField
        });
        var title = A2($tesk9$accessible_html$Accessibility$h3, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-title")
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Log in using Matrix")
        ]));
        var submitButton = A2($tesk9$accessible_html$Accessibility$button, _Utils_ap(_List_fromArray([
            $elm$html$Html$Attributes$class("cactus-button"),
            $elm$html$Html$Attributes$class("cactus-login-credentials-button"),
            $elm$html$Html$Attributes$disabled(!_Utils_eq(form.state, $author$project$LoginForm$Ready))
        ]), A2($elm$core$Result$withDefault, _List_Nil, A2($elm$core$Result$map, A2($elm$core$Basics$composeR, $author$project$LoginForm$Login, A2($elm$core$Basics$composeR, $elm$html$Html$Events$onClick, $elm$core$List$singleton)), form.userId))), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text(function() {
                var _v2 = form.state;
                switch(_v2.$){
                    case "Ready":
                        return "Log in";
                    case "LoggingIn":
                        return "Logging in...";
                    default:
                        return "";
                }
            }())
        ]));
        var password = $author$project$LoginForm$textField({
            attrs: _List_fromArray([
                $elm$html$Html$Attributes$type_("password")
            ]),
            _default: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            error: $elm$core$Maybe$Nothing,
            msgf: $author$project$LoginForm$EditPassword,
            name: "Password",
            value: form.passwordField
        });
        var loginError = A2($elm$core$Maybe$withDefault, $tesk9$accessible_html$Accessibility$text(""), A2($elm$core$Maybe$map, A2($elm$core$Basics$composeR, $author$project$LoginForm$errorToString, A2($elm$core$Basics$composeR, $tesk9$accessible_html$Accessibility$text, A2($elm$core$Basics$composeR, $elm$core$List$singleton, $tesk9$accessible_html$Accessibility$p(_List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-error")
        ]))))), form.loginError));
        var homeserverUrl = A2($elm$core$Maybe$withDefault, $tesk9$accessible_html$Accessibility$text(""), A2($elm$core$Maybe$map, function(value) {
            return $author$project$LoginForm$textField({
                attrs: _List_Nil,
                _default: "https://matrix.cactus.chat:8448",
                error: $elm$core$Maybe$Nothing,
                msgf: $author$project$LoginForm$EditHomeserverUrl,
                name: "Homeserver URL",
                value: value
            });
        }, form.homeserverUrlField));
        var credentialsTitle = A2($tesk9$accessible_html$Accessibility$h4, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-credentials-title")
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Or type in your credentials")
        ]));
        var credentialsForm = A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-credentials")
        ]), _List_fromArray([
            credentialsTitle,
            username,
            password,
            homeserverUrl,
            submitButton,
            loginError
        ]));
        var clientTitle = A2($tesk9$accessible_html$Accessibility$h4, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-client-title")
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Use a Matrix client")
        ]));
        var clientLink = A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
            $elm$html$Html$Attributes$href($author$project$ApiUtils$matrixDotToUrl(roomAlias)),
            $elm$html$Html$Attributes$class("cactus-button"),
            $elm$html$Html$Attributes$class("cactus-matrixdotto-button")
        ]), _List_fromArray([
            $tesk9$accessible_html$Accessibility$text("Log in")
        ]));
        var clientForm = A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-client")
        ]), _List_fromArray([
            clientTitle,
            clientLink
        ]));
        var _v1 = form.state;
        if (_v1.$ === "Hidden") return $tesk9$accessible_html$Accessibility$text("");
        else return A2($elm$html$Html$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-login-form-wrapper"),
            A2($elm$html$Html$Events$on, "click", $author$project$LoginForm$containerClickDecoder)
        ]), _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-login-form")
            ]), _List_fromArray([
                $author$project$LoginForm$closeButton,
                title,
                clientForm,
                credentialsForm
            ]))
        ]));
    });
    var $author$project$Event$memberEvents = function(roomEvents) {
        return A3($elm$core$List$foldl, F2(function(roomEvent, xs) {
            if (roomEvent.$ === "MemberEvent") {
                var uid = roomEvent.a;
                var data = roomEvent.b;
                return A2($elm$core$List$cons, _Utils_Tuple2(uid, data), xs);
            } else return xs;
        }), _List_Nil, roomEvents);
    };
    var $author$project$Event$latestMemberDataBefore = F3(function(events, time, userid) {
        return A2($elm$core$Maybe$map, function($) {
            return $.content;
        }, $elm$core$List$head(A2($elm$core$List$sortBy, A2($elm$core$Basics$composeR, function($) {
            return $.originServerTs;
        }, A2($elm$core$Basics$composeR, $elm$time$Time$posixToMillis, $elm$core$Basics$mul(-1))), A2($elm$core$List$filter, function(e) {
            return _Utils_cmp($elm$time$Time$posixToMillis(e.originServerTs), $elm$time$Time$posixToMillis(time)) < 1;
        }, A2($elm$core$List$map, $elm$core$Tuple$second, A2($elm$core$List$filter, A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$Basics$eq(userid)), $author$project$Event$memberEvents(events)))))));
    });
    var $elm$html$Html$Attributes$datetime = _VirtualDom_attribute("datetime");
    var $ryannhg$date_format$DateFormat$DayOfMonthFixed = {
        $: "DayOfMonthFixed"
    };
    var $ryannhg$date_format$DateFormat$dayOfMonthFixed = $ryannhg$date_format$DateFormat$DayOfMonthFixed;
    var $ryannhg$date_format$DateFormat$Language$Language = F6(function(toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
        return {
            toAmPm: toAmPm,
            toMonthAbbreviation: toMonthAbbreviation,
            toMonthName: toMonthName,
            toOrdinalSuffix: toOrdinalSuffix,
            toWeekdayAbbreviation: toWeekdayAbbreviation,
            toWeekdayName: toWeekdayName
        };
    });
    var $ryannhg$date_format$DateFormat$Language$toEnglishAmPm = function(hour) {
        return hour > 11 ? "pm" : "am";
    };
    var $ryannhg$date_format$DateFormat$Language$toEnglishMonthName = function(month) {
        switch(month.$){
            case "Jan":
                return "January";
            case "Feb":
                return "February";
            case "Mar":
                return "March";
            case "Apr":
                return "April";
            case "May":
                return "May";
            case "Jun":
                return "June";
            case "Jul":
                return "July";
            case "Aug":
                return "August";
            case "Sep":
                return "September";
            case "Oct":
                return "October";
            case "Nov":
                return "November";
            default:
                return "December";
        }
    };
    var $ryannhg$date_format$DateFormat$Language$toEnglishSuffix = function(num) {
        var _v0 = A2($elm$core$Basics$modBy, 100, num);
        switch(_v0){
            case 11:
                return "th";
            case 12:
                return "th";
            case 13:
                return "th";
            default:
                var _v1 = A2($elm$core$Basics$modBy, 10, num);
                switch(_v1){
                    case 1:
                        return "st";
                    case 2:
                        return "nd";
                    case 3:
                        return "rd";
                    default:
                        return "th";
                }
        }
    };
    var $ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName = function(weekday) {
        switch(weekday.$){
            case "Mon":
                return "Monday";
            case "Tue":
                return "Tuesday";
            case "Wed":
                return "Wednesday";
            case "Thu":
                return "Thursday";
            case "Fri":
                return "Friday";
            case "Sat":
                return "Saturday";
            default:
                return "Sunday";
        }
    };
    var $ryannhg$date_format$DateFormat$Language$english = A6($ryannhg$date_format$DateFormat$Language$Language, $ryannhg$date_format$DateFormat$Language$toEnglishMonthName, A2($elm$core$Basics$composeR, $ryannhg$date_format$DateFormat$Language$toEnglishMonthName, $elm$core$String$left(3)), $ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName, A2($elm$core$Basics$composeR, $ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName, $elm$core$String$left(3)), $ryannhg$date_format$DateFormat$Language$toEnglishAmPm, $ryannhg$date_format$DateFormat$Language$toEnglishSuffix);
    var $elm$time$Time$flooredDiv = F2(function(numerator, denominator) {
        return $elm$core$Basics$floor(numerator / denominator);
    });
    var $elm$time$Time$toAdjustedMinutesHelp = F3(function(defaultOffset, posixMinutes, eras) {
        toAdjustedMinutesHelp: while(true){
            if (!eras.b) return posixMinutes + defaultOffset;
            else {
                var era = eras.a;
                var olderEras = eras.b;
                if (_Utils_cmp(era.start, posixMinutes) < 0) return posixMinutes + era.offset;
                else {
                    var $temp$defaultOffset = defaultOffset, $temp$posixMinutes = posixMinutes, $temp$eras = olderEras;
                    defaultOffset = $temp$defaultOffset;
                    posixMinutes = $temp$posixMinutes;
                    eras = $temp$eras;
                    continue toAdjustedMinutesHelp;
                }
            }
        }
    });
    var $elm$time$Time$toAdjustedMinutes = F2(function(_v0, time) {
        var defaultOffset = _v0.a;
        var eras = _v0.b;
        return A3($elm$time$Time$toAdjustedMinutesHelp, defaultOffset, A2($elm$time$Time$flooredDiv, $elm$time$Time$posixToMillis(time), 60000), eras);
    });
    var $elm$time$Time$toHour = F2(function(zone, time) {
        return A2($elm$core$Basics$modBy, 24, A2($elm$time$Time$flooredDiv, A2($elm$time$Time$toAdjustedMinutes, zone, time), 60));
    });
    var $ryannhg$date_format$DateFormat$amPm = F3(function(language, zone, posix) {
        return language.toAmPm(A2($elm$time$Time$toHour, zone, posix));
    });
    var $elm$time$Time$toCivil = function(minutes) {
        var rawDay = A2($elm$time$Time$flooredDiv, minutes, 1440) + 719468;
        var era = (rawDay >= 0 ? rawDay : rawDay - 146096) / 146097 | 0;
        var dayOfEra = rawDay - era * 146097;
        var yearOfEra = (dayOfEra - (dayOfEra / 1460 | 0) + (dayOfEra / 36524 | 0) - (dayOfEra / 146096 | 0)) / 365 | 0;
        var dayOfYear = dayOfEra - (365 * yearOfEra + (yearOfEra / 4 | 0) - (yearOfEra / 100 | 0));
        var mp = (5 * dayOfYear + 2) / 153 | 0;
        var month = mp + (mp < 10 ? 3 : -9);
        var year = yearOfEra + era * 400;
        return {
            day: dayOfYear - ((153 * mp + 2) / 5 | 0) + 1,
            month: month,
            year: year + (month <= 2 ? 1 : 0)
        };
    };
    var $elm$time$Time$toDay = F2(function(zone, time) {
        return $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
    });
    var $ryannhg$date_format$DateFormat$dayOfMonth = $elm$time$Time$toDay;
    var $elm$time$Time$Sun = {
        $: "Sun"
    };
    var $elm$time$Time$Fri = {
        $: "Fri"
    };
    var $elm$time$Time$Mon = {
        $: "Mon"
    };
    var $elm$time$Time$Sat = {
        $: "Sat"
    };
    var $elm$time$Time$Thu = {
        $: "Thu"
    };
    var $elm$time$Time$Tue = {
        $: "Tue"
    };
    var $elm$time$Time$Wed = {
        $: "Wed"
    };
    var $ryannhg$date_format$DateFormat$days = _List_fromArray([
        $elm$time$Time$Sun,
        $elm$time$Time$Mon,
        $elm$time$Time$Tue,
        $elm$time$Time$Wed,
        $elm$time$Time$Thu,
        $elm$time$Time$Fri,
        $elm$time$Time$Sat
    ]);
    var $elm$time$Time$toWeekday = F2(function(zone, time) {
        var _v0 = A2($elm$core$Basics$modBy, 7, A2($elm$time$Time$flooredDiv, A2($elm$time$Time$toAdjustedMinutes, zone, time), 1440));
        switch(_v0){
            case 0:
                return $elm$time$Time$Thu;
            case 1:
                return $elm$time$Time$Fri;
            case 2:
                return $elm$time$Time$Sat;
            case 3:
                return $elm$time$Time$Sun;
            case 4:
                return $elm$time$Time$Mon;
            case 5:
                return $elm$time$Time$Tue;
            default:
                return $elm$time$Time$Wed;
        }
    });
    var $ryannhg$date_format$DateFormat$dayOfWeek = F2(function(zone, posix) {
        return function(_v1) {
            var i = _v1.a;
            return i;
        }(A2($elm$core$Maybe$withDefault, _Utils_Tuple2(0, $elm$time$Time$Sun), $elm$core$List$head(A2($elm$core$List$filter, function(_v0) {
            var day = _v0.b;
            return _Utils_eq(day, A2($elm$time$Time$toWeekday, zone, posix));
        }, A2($elm$core$List$indexedMap, F2(function(i, day) {
            return _Utils_Tuple2(i, day);
        }), $ryannhg$date_format$DateFormat$days)))));
    });
    var $ryannhg$date_format$DateFormat$isLeapYear = function(year_) {
        return !!A2($elm$core$Basics$modBy, 4, year_) ? false : !!A2($elm$core$Basics$modBy, 100, year_) ? true : !!A2($elm$core$Basics$modBy, 400, year_) ? false : true;
    };
    var $ryannhg$date_format$DateFormat$daysInMonth = F2(function(year_, month) {
        switch(month.$){
            case "Jan":
                return 31;
            case "Feb":
                return $ryannhg$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
            case "Mar":
                return 31;
            case "Apr":
                return 30;
            case "May":
                return 31;
            case "Jun":
                return 30;
            case "Jul":
                return 31;
            case "Aug":
                return 31;
            case "Sep":
                return 30;
            case "Oct":
                return 31;
            case "Nov":
                return 30;
            default:
                return 31;
        }
    });
    var $elm$time$Time$Jan = {
        $: "Jan"
    };
    var $elm$time$Time$Apr = {
        $: "Apr"
    };
    var $elm$time$Time$Aug = {
        $: "Aug"
    };
    var $elm$time$Time$Dec = {
        $: "Dec"
    };
    var $elm$time$Time$Feb = {
        $: "Feb"
    };
    var $elm$time$Time$Jul = {
        $: "Jul"
    };
    var $elm$time$Time$Jun = {
        $: "Jun"
    };
    var $elm$time$Time$Mar = {
        $: "Mar"
    };
    var $elm$time$Time$May = {
        $: "May"
    };
    var $elm$time$Time$Nov = {
        $: "Nov"
    };
    var $elm$time$Time$Oct = {
        $: "Oct"
    };
    var $elm$time$Time$Sep = {
        $: "Sep"
    };
    var $ryannhg$date_format$DateFormat$months = _List_fromArray([
        $elm$time$Time$Jan,
        $elm$time$Time$Feb,
        $elm$time$Time$Mar,
        $elm$time$Time$Apr,
        $elm$time$Time$May,
        $elm$time$Time$Jun,
        $elm$time$Time$Jul,
        $elm$time$Time$Aug,
        $elm$time$Time$Sep,
        $elm$time$Time$Oct,
        $elm$time$Time$Nov,
        $elm$time$Time$Dec
    ]);
    var $elm$time$Time$toMonth = F2(function(zone, time) {
        var _v0 = $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
        switch(_v0){
            case 1:
                return $elm$time$Time$Jan;
            case 2:
                return $elm$time$Time$Feb;
            case 3:
                return $elm$time$Time$Mar;
            case 4:
                return $elm$time$Time$Apr;
            case 5:
                return $elm$time$Time$May;
            case 6:
                return $elm$time$Time$Jun;
            case 7:
                return $elm$time$Time$Jul;
            case 8:
                return $elm$time$Time$Aug;
            case 9:
                return $elm$time$Time$Sep;
            case 10:
                return $elm$time$Time$Oct;
            case 11:
                return $elm$time$Time$Nov;
            default:
                return $elm$time$Time$Dec;
        }
    });
    var $ryannhg$date_format$DateFormat$monthPair = F2(function(zone, posix) {
        return A2($elm$core$Maybe$withDefault, _Utils_Tuple2(0, $elm$time$Time$Jan), $elm$core$List$head(A2($elm$core$List$filter, function(_v0) {
            var i = _v0.a;
            var m = _v0.b;
            return _Utils_eq(m, A2($elm$time$Time$toMonth, zone, posix));
        }, A2($elm$core$List$indexedMap, F2(function(a, b) {
            return _Utils_Tuple2(a, b);
        }), $ryannhg$date_format$DateFormat$months))));
    });
    var $ryannhg$date_format$DateFormat$monthNumber_ = F2(function(zone, posix) {
        return 1 + function(_v0) {
            var i = _v0.a;
            var m = _v0.b;
            return i;
        }(A2($ryannhg$date_format$DateFormat$monthPair, zone, posix));
    });
    var $elm$core$List$sum = function(numbers) {
        return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
    };
    var $elm$time$Time$toYear = F2(function(zone, time) {
        return $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
    });
    var $ryannhg$date_format$DateFormat$dayOfYear = F2(function(zone, posix) {
        var monthsBeforeThisOne = A2($elm$core$List$take, A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) - 1, $ryannhg$date_format$DateFormat$months);
        var daysBeforeThisMonth = $elm$core$List$sum(A2($elm$core$List$map, $ryannhg$date_format$DateFormat$daysInMonth(A2($elm$time$Time$toYear, zone, posix)), monthsBeforeThisOne));
        return daysBeforeThisMonth + A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix);
    });
    var $ryannhg$date_format$DateFormat$quarter = F2(function(zone, posix) {
        return A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) / 4 | 0;
    });
    var $elm$core$String$right = F2(function(n, string) {
        return n < 1 ? "" : A3($elm$core$String$slice, -n, $elm$core$String$length(string), string);
    });
    var $ryannhg$date_format$DateFormat$toFixedLength = F2(function(totalChars, num) {
        var numStr = $elm$core$String$fromInt(num);
        var numZerosNeeded = totalChars - $elm$core$String$length(numStr);
        var zeros = A2($elm$core$String$join, "", A2($elm$core$List$map, function(_v0) {
            return "0";
        }, A2($elm$core$List$range, 1, numZerosNeeded)));
        return _Utils_ap(zeros, numStr);
    });
    var $elm$time$Time$toMillis = F2(function(_v0, time) {
        return A2($elm$core$Basics$modBy, 1000, $elm$time$Time$posixToMillis(time));
    });
    var $elm$time$Time$toMinute = F2(function(zone, time) {
        return A2($elm$core$Basics$modBy, 60, A2($elm$time$Time$toAdjustedMinutes, zone, time));
    });
    var $ryannhg$date_format$DateFormat$toNonMilitary = function(num) {
        return !num ? 12 : num <= 12 ? num : num - 12;
    };
    var $elm$time$Time$toSecond = F2(function(_v0, time) {
        return A2($elm$core$Basics$modBy, 60, A2($elm$time$Time$flooredDiv, $elm$time$Time$posixToMillis(time), 1000));
    });
    var $elm$core$String$toUpper = _String_toUpper;
    var $elm$core$Basics$round = _Basics_round;
    var $ryannhg$date_format$DateFormat$millisecondsPerYear = $elm$core$Basics$round(31557600000);
    var $ryannhg$date_format$DateFormat$firstDayOfYear = F2(function(zone, time) {
        return $elm$time$Time$millisToPosix($ryannhg$date_format$DateFormat$millisecondsPerYear * A2($elm$time$Time$toYear, zone, time));
    });
    var $ryannhg$date_format$DateFormat$weekOfYear = F2(function(zone, posix) {
        var firstDay = A2($ryannhg$date_format$DateFormat$firstDayOfYear, zone, posix);
        var firstDayOffset = A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, firstDay);
        var daysSoFar = A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix);
        return ((daysSoFar + firstDayOffset) / 7 | 0) + 1;
    });
    var $ryannhg$date_format$DateFormat$year = F2(function(zone, time) {
        return $elm$core$String$fromInt(A2($elm$time$Time$toYear, zone, time));
    });
    var $ryannhg$date_format$DateFormat$piece = F4(function(language, zone, posix, token) {
        switch(token.$){
            case "MonthNumber":
                return $elm$core$String$fromInt(A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
            case "MonthSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
            case "MonthFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
            case "MonthNameAbbreviated":
                return language.toMonthAbbreviation(A2($elm$time$Time$toMonth, zone, posix));
            case "MonthNameFull":
                return language.toMonthName(A2($elm$time$Time$toMonth, zone, posix));
            case "QuarterNumber":
                return $elm$core$String$fromInt(1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
            case "QuarterSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
            case "DayOfMonthNumber":
                return $elm$core$String$fromInt(A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
            case "DayOfMonthSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
            case "DayOfMonthFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
            case "DayOfYearNumber":
                return $elm$core$String$fromInt(A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
            case "DayOfYearSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
            case "DayOfYearFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 3, A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
            case "DayOfWeekNumber":
                return $elm$core$String$fromInt(A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
            case "DayOfWeekSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
            case "DayOfWeekNameAbbreviated":
                return language.toWeekdayAbbreviation(A2($elm$time$Time$toWeekday, zone, posix));
            case "DayOfWeekNameFull":
                return language.toWeekdayName(A2($elm$time$Time$toWeekday, zone, posix));
            case "WeekOfYearNumber":
                return $elm$core$String$fromInt(A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
            case "WeekOfYearSuffix":
                return function(num) {
                    return _Utils_ap($elm$core$String$fromInt(num), language.toOrdinalSuffix(num));
                }(A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
            case "WeekOfYearFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
            case "YearNumberLastTwo":
                return A2($elm$core$String$right, 2, A2($ryannhg$date_format$DateFormat$year, zone, posix));
            case "YearNumber":
                return A2($ryannhg$date_format$DateFormat$year, zone, posix);
            case "AmPmUppercase":
                return $elm$core$String$toUpper(A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
            case "AmPmLowercase":
                return $elm$core$String$toLower(A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
            case "HourMilitaryNumber":
                return $elm$core$String$fromInt(A2($elm$time$Time$toHour, zone, posix));
            case "HourMilitaryFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($elm$time$Time$toHour, zone, posix));
            case "HourNumber":
                return $elm$core$String$fromInt($ryannhg$date_format$DateFormat$toNonMilitary(A2($elm$time$Time$toHour, zone, posix)));
            case "HourFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, $ryannhg$date_format$DateFormat$toNonMilitary(A2($elm$time$Time$toHour, zone, posix)));
            case "HourMilitaryFromOneNumber":
                return $elm$core$String$fromInt(1 + A2($elm$time$Time$toHour, zone, posix));
            case "HourMilitaryFromOneFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, 1 + A2($elm$time$Time$toHour, zone, posix));
            case "MinuteNumber":
                return $elm$core$String$fromInt(A2($elm$time$Time$toMinute, zone, posix));
            case "MinuteFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($elm$time$Time$toMinute, zone, posix));
            case "SecondNumber":
                return $elm$core$String$fromInt(A2($elm$time$Time$toSecond, zone, posix));
            case "SecondFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 2, A2($elm$time$Time$toSecond, zone, posix));
            case "MillisecondNumber":
                return $elm$core$String$fromInt(A2($elm$time$Time$toMillis, zone, posix));
            case "MillisecondFixed":
                return A2($ryannhg$date_format$DateFormat$toFixedLength, 3, A2($elm$time$Time$toMillis, zone, posix));
            default:
                var string = token.a;
                return string;
        }
    });
    var $ryannhg$date_format$DateFormat$formatWithLanguage = F4(function(language, tokens, zone, time) {
        return A2($elm$core$String$join, "", A2($elm$core$List$map, A3($ryannhg$date_format$DateFormat$piece, language, zone, time), tokens));
    });
    var $ryannhg$date_format$DateFormat$format = $ryannhg$date_format$DateFormat$formatWithLanguage($ryannhg$date_format$DateFormat$Language$english);
    var $ryannhg$date_format$DateFormat$HourMilitaryFixed = {
        $: "HourMilitaryFixed"
    };
    var $ryannhg$date_format$DateFormat$hourMilitaryFixed = $ryannhg$date_format$DateFormat$HourMilitaryFixed;
    var $ryannhg$date_format$DateFormat$MinuteFixed = {
        $: "MinuteFixed"
    };
    var $ryannhg$date_format$DateFormat$minuteFixed = $ryannhg$date_format$DateFormat$MinuteFixed;
    var $ryannhg$date_format$DateFormat$MonthFixed = {
        $: "MonthFixed"
    };
    var $ryannhg$date_format$DateFormat$monthFixed = $ryannhg$date_format$DateFormat$MonthFixed;
    var $ryannhg$date_format$DateFormat$SecondFixed = {
        $: "SecondFixed"
    };
    var $ryannhg$date_format$DateFormat$secondFixed = $ryannhg$date_format$DateFormat$SecondFixed;
    var $ryannhg$date_format$DateFormat$Text = function(a) {
        return {
            $: "Text",
            a: a
        };
    };
    var $ryannhg$date_format$DateFormat$text = $ryannhg$date_format$DateFormat$Text;
    var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
    var $ryannhg$date_format$DateFormat$YearNumber = {
        $: "YearNumber"
    };
    var $ryannhg$date_format$DateFormat$yearNumber = $ryannhg$date_format$DateFormat$YearNumber;
    var $author$project$Message$formatTimeAsIsoUtcString = function(time) {
        var timeFormatter = $ryannhg$date_format$DateFormat$format(_List_fromArray([
            $ryannhg$date_format$DateFormat$yearNumber,
            $ryannhg$date_format$DateFormat$text("-"),
            $ryannhg$date_format$DateFormat$monthFixed,
            $ryannhg$date_format$DateFormat$text("-"),
            $ryannhg$date_format$DateFormat$dayOfMonthFixed,
            $ryannhg$date_format$DateFormat$text("T"),
            $ryannhg$date_format$DateFormat$hourMilitaryFixed,
            $ryannhg$date_format$DateFormat$text(":"),
            $ryannhg$date_format$DateFormat$minuteFixed,
            $ryannhg$date_format$DateFormat$text(":"),
            $ryannhg$date_format$DateFormat$secondFixed,
            $ryannhg$date_format$DateFormat$text("+00:00")
        ]));
        return A2(timeFormatter, $elm$time$Time$utc, time);
    };
    var $ryannhg$date_format$DateFormat$DayOfWeekNameAbbreviated = {
        $: "DayOfWeekNameAbbreviated"
    };
    var $ryannhg$date_format$DateFormat$dayOfWeekNameAbbreviated = $ryannhg$date_format$DateFormat$DayOfWeekNameAbbreviated;
    var $ryannhg$date_format$DateFormat$MonthNameAbbreviated = {
        $: "MonthNameAbbreviated"
    };
    var $ryannhg$date_format$DateFormat$monthNameAbbreviated = $ryannhg$date_format$DateFormat$MonthNameAbbreviated;
    var $author$project$Message$formatTimeAsUtcString = function(time) {
        var timeFormatter = $ryannhg$date_format$DateFormat$format(_List_fromArray([
            $ryannhg$date_format$DateFormat$dayOfWeekNameAbbreviated,
            $ryannhg$date_format$DateFormat$text(" "),
            $ryannhg$date_format$DateFormat$monthNameAbbreviated,
            $ryannhg$date_format$DateFormat$text(" "),
            $ryannhg$date_format$DateFormat$dayOfMonthFixed,
            $ryannhg$date_format$DateFormat$text(" "),
            $ryannhg$date_format$DateFormat$hourMilitaryFixed,
            $ryannhg$date_format$DateFormat$text(":"),
            $ryannhg$date_format$DateFormat$minuteFixed,
            $ryannhg$date_format$DateFormat$text(":"),
            $ryannhg$date_format$DateFormat$secondFixed,
            $ryannhg$date_format$DateFormat$text(" "),
            $ryannhg$date_format$DateFormat$yearNumber,
            $ryannhg$date_format$DateFormat$text(" UTC")
        ]));
        return A2(timeFormatter, $elm$time$Time$utc, time);
    };
    var $elm$html$Html$time = _VirtualDom_node("time");
    var $tesk9$accessible_html$Accessibility$time = function(attributes) {
        return $elm$html$Html$time($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $ianmackenzie$elm_units$Duration$milliseconds = function(numMilliseconds) {
        return $ianmackenzie$elm_units$Duration$seconds(0.001 * numMilliseconds);
    };
    var $ianmackenzie$elm_units$Duration$from = F2(function(startTime, endTime) {
        var numMilliseconds = $elm$time$Time$posixToMillis(endTime) - $elm$time$Time$posixToMillis(startTime);
        return $ianmackenzie$elm_units$Duration$milliseconds(numMilliseconds);
    });
    var $ianmackenzie$elm_units$Constants$second = 1;
    var $ianmackenzie$elm_units$Constants$minute = 60 * $ianmackenzie$elm_units$Constants$second;
    var $ianmackenzie$elm_units$Constants$hour = 60 * $ianmackenzie$elm_units$Constants$minute;
    var $ianmackenzie$elm_units$Constants$day = 24 * $ianmackenzie$elm_units$Constants$hour;
    var $ianmackenzie$elm_units$Duration$inDays = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) / $ianmackenzie$elm_units$Constants$day;
    };
    var $ianmackenzie$elm_units$Duration$inHours = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) / $ianmackenzie$elm_units$Constants$hour;
    };
    var $ianmackenzie$elm_units$Duration$inJulianYears = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) / 31557600;
    };
    var $ianmackenzie$elm_units$Duration$inMinutes = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) / 60;
    };
    var $ianmackenzie$elm_units$Constants$week = 7 * $ianmackenzie$elm_units$Constants$day;
    var $ianmackenzie$elm_units$Duration$inWeeks = function(duration) {
        return $ianmackenzie$elm_units$Duration$inSeconds(duration) / $ianmackenzie$elm_units$Constants$week;
    };
    var $author$project$Message$timeSinceText = F2(function(now, then_) {
        var allTimeUnits = _List_fromArray([
            _Utils_Tuple2("year", $ianmackenzie$elm_units$Duration$inJulianYears),
            _Utils_Tuple2("month", A2($elm$core$Basics$composeR, $ianmackenzie$elm_units$Duration$inJulianYears, $elm$core$Basics$mul(12))),
            _Utils_Tuple2("week", $ianmackenzie$elm_units$Duration$inWeeks),
            _Utils_Tuple2("day", $ianmackenzie$elm_units$Duration$inDays),
            _Utils_Tuple2("hour", $ianmackenzie$elm_units$Duration$inHours),
            _Utils_Tuple2("minute", $ianmackenzie$elm_units$Duration$inMinutes),
            _Utils_Tuple2("second", $ianmackenzie$elm_units$Duration$inSeconds)
        ]);
        var age = A2($ianmackenzie$elm_units$Duration$from, then_, now);
        var biggestUnitGreaterThanOne = function(timeunits) {
            biggestUnitGreaterThanOne: while(true){
                if (timeunits.b) {
                    var _v1 = timeunits.a;
                    var name = _v1.a;
                    var unit = _v1.b;
                    var rest = timeunits.b;
                    if (unit(age) >= 1) return _Utils_Tuple2(name, unit);
                    else {
                        var $temp$timeunits = rest;
                        timeunits = $temp$timeunits;
                        continue biggestUnitGreaterThanOne;
                    }
                } else return _Utils_Tuple2("seconds", $ianmackenzie$elm_units$Duration$inSeconds);
            }
        };
        var _v2 = biggestUnitGreaterThanOne(allTimeUnits);
        var unitbasename = _v2.a;
        var unitfun = _v2.b;
        var value = $elm$core$Basics$floor(unitfun(age));
        var unitname = value === 1 ? unitbasename : unitbasename + "s";
        return $ianmackenzie$elm_units$Duration$inSeconds(age) < 1 ? "just now" : $elm$core$String$fromInt(value) + (" " + (unitname + " ago"));
    });
    var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty("title");
    var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty("alt");
    var $elm$html$Html$img = _VirtualDom_node("img");
    var $tesk9$accessible_html$Accessibility$img = F2(function(alt_, attributes) {
        return A2($elm$html$Html$img, A2($elm$core$List$cons, $elm$html$Html$Attributes$alt(alt_), $tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes)), _List_Nil);
    });
    var $elm_community$maybe_extra$Maybe$Extra$join = function(mx) {
        if (mx.$ === "Just") {
            var x = mx.a;
            return x;
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$html$Html$Attributes$src = function(url) {
        return A2($elm$html$Html$Attributes$stringProperty, "src", _VirtualDom_noJavaScriptOrHtmlUri(url));
    };
    var $elm$url$Url$Builder$int = F2(function(key, value) {
        return A2($elm$url$Url$Builder$QueryParameter, $elm$url$Url$percentEncode(key), $elm$core$String$fromInt(value));
    });
    var $author$project$ApiUtils$mediaEndpoint = $author$project$ApiUtils$apiEndpoint(_List_fromArray([
        "_matrix",
        "media",
        "r0"
    ]));
    var $author$project$ApiUtils$mxcMediaId = function(mxcUrl) {
        return A3($elm$core$Basics$composeR, $elm$core$List$reverse, $elm$core$List$head, A2($elm$core$String$split, "/", mxcUrl));
    };
    var $author$project$ApiUtils$mxcServerName = function(mxcUrl) {
        var validChar = function(c) {
            return $elm$core$Char$isAlphaNum(c) || A2($elm$core$List$member, c, _List_fromArray([
                _Utils_chr("."),
                _Utils_chr("-"),
                _Utils_chr(":")
            ]));
        };
        var parser = A2($elm$parser$Parser$keeper, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$succeed($elm$core$Basics$identity), $elm$parser$Parser$token("mxc://")), $elm$parser$Parser$variable({
            inner: validChar,
            reserved: $elm$core$Set$empty,
            start: validChar
        }));
        return $elm$core$Result$toMaybe(A2($elm$parser$Parser$run, parser, mxcUrl));
    };
    var $author$project$ApiUtils$thumbnailFromMxc = F2(function(homeserverUrl, mxcUrl) {
        var serverName = $author$project$ApiUtils$mxcServerName(mxcUrl);
        var mediaId = $author$project$ApiUtils$mxcMediaId(mxcUrl);
        return A3($elm$core$Maybe$map2, F2(function(sn, mid) {
            return A3($author$project$ApiUtils$mediaEndpoint, homeserverUrl, _List_fromArray([
                "thumbnail",
                sn,
                mid
            ]), _List_fromArray([
                A2($elm$url$Url$Builder$int, "width", 64),
                A2($elm$url$Url$Builder$int, "height", 64),
                A2($elm$url$Url$Builder$string, "method", "crop")
            ]));
        }), serverName, mediaId);
    });
    var $author$project$Message$viewAvatar = F2(function(homeserverUrl, member) {
        var avatarUrl = $elm_community$maybe_extra$Maybe$Extra$join(A2($elm$core$Maybe$map, $author$project$ApiUtils$thumbnailFromMxc(homeserverUrl), A2($elm$core$Maybe$andThen, function($) {
            return $.avatarUrl;
        }, member)));
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-comment-avatar")
        ]), function() {
            if (avatarUrl.$ === "Just") {
                var url = avatarUrl.a;
                return _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$img, "user avatar image", _List_fromArray([
                        $elm$html$Html$Attributes$src(url)
                    ]))
                ]);
            } else return _List_fromArray([
                A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                    $elm$html$Html$Attributes$class("cactus-comment-avatar-placeholder")
                ]), _List_Nil)
            ]);
        }());
    });
    var $elm$html$Html$audio = _VirtualDom_node("audio");
    var $tesk9$accessible_html$Accessibility$audio = function(attributes) {
        return $elm$html$Html$audio($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $elm$html$Html$Attributes$controls = $elm$html$Html$Attributes$boolProperty("controls");
    var $author$project$ApiUtils$httpFromMxc = F2(function(homeserverUrl, mxcUrl) {
        var serverName = $author$project$ApiUtils$mxcServerName(mxcUrl);
        var mediaId = $author$project$ApiUtils$mxcMediaId(mxcUrl);
        return A3($elm$core$Maybe$map2, F2(function(sn, mid) {
            return A3($author$project$ApiUtils$mediaEndpoint, homeserverUrl, _List_fromArray([
                "download",
                sn,
                mid
            ]), _List_Nil);
        }), serverName, mediaId);
    });
    var $elm$html$Html$i = _VirtualDom_node("i");
    var $tesk9$accessible_html$Accessibility$i = function(attributes) {
        return $elm$html$Html$i($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $author$project$Message$Audio$viewAudio = F2(function(homeserverUrl, file) {
        var link = A2($author$project$ApiUtils$httpFromMxc, homeserverUrl, file.url);
        if (link.$ === "Just") {
            var httpLink = link.a;
            return A2($tesk9$accessible_html$Accessibility$audio, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-message-audio"),
                $elm$html$Html$Attributes$src(httpLink),
                $elm$html$Html$Attributes$controls(true)
            ]), _List_Nil);
        } else return A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$i, _List_Nil, _List_fromArray([
                $tesk9$accessible_html$Accessibility$text("Error: Could not parse audio file URL")
            ]))
        ]));
    });
    var $elm$html$Html$Attributes$rel = _VirtualDom_attribute("rel");
    var $author$project$Message$File$viewFile = F2(function(homeserverUrl, file) {
        var link = A2($author$project$ApiUtils$httpFromMxc, homeserverUrl, file.url);
        if (link.$ === "Just") {
            var httpLink = link.a;
            return A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-message-file"),
                $elm$html$Html$Attributes$rel("noopener"),
                $elm$html$Html$Attributes$href(httpLink)
            ]), _List_fromArray([
                $tesk9$accessible_html$Accessibility$text("\uD83D\uDCCE Download " + file.body)
            ]));
        } else return A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$i, _List_Nil, _List_fromArray([
                $tesk9$accessible_html$Accessibility$text("Error: Could not parse file URL")
            ]))
        ]));
    });
    var $author$project$Message$FormattedText$anchorAttributes = function(attrs) {
        return A3($elm$core$List$foldl, F2(function(attr, list) {
            switch(attr.a){
                case "name":
                    var nameStr = attr.b;
                    return A2($elm$core$List$cons, _Utils_Tuple2("name", nameStr), list);
                case "target":
                    var targetStr = attr.b;
                    return A2($elm$core$List$cons, _Utils_Tuple2("target", targetStr), list);
                case "href":
                    var hrefStr = attr.b;
                    var validSchemas = _List_fromArray([
                        "https",
                        "http",
                        "ftp",
                        "mailto",
                        "magnet"
                    ]);
                    var hrefClean = A2($elm$core$Maybe$withDefault, false, A2($elm$core$Maybe$map, function(schema) {
                        return A2($elm$core$List$member, schema, validSchemas);
                    }, $elm$core$List$head(A2($elm$core$String$split, ":", hrefStr))));
                    return hrefClean ? A2($elm$core$List$cons, _Utils_Tuple2("href", hrefStr), list) : list;
                default:
                    return list;
            }
        }), _List_Nil, attrs);
    };
    var $elm$parser$Parser$symbol = function(str) {
        return $elm$parser$Parser$Advanced$symbol(A2($elm$parser$Parser$Advanced$Token, str, $elm$parser$Parser$ExpectingSymbol(str)));
    };
    var $author$project$Message$FormattedText$parseHexColor = A2($elm$parser$Parser$andThen, function(hexcolor) {
        return $elm$core$String$length(hexcolor) === 7 ? $elm$parser$Parser$succeed(hexcolor) : $elm$parser$Parser$problem("Hex color code should have 7 characters.");
    }, $elm$parser$Parser$getChompedString(A2($elm$parser$Parser$ignorer, A2($elm$parser$Parser$ignorer, $elm$parser$Parser$symbol("#"), $elm$parser$Parser$chompWhile($elm$core$Char$isHexDigit)), $elm$parser$Parser$end)));
    var $author$project$Message$FormattedText$colorAttributes = function(attrs) {
        return A3($elm$core$List$foldl, F2(function(attr, list) {
            switch(attr.a){
                case "data-mx-color":
                    var value = attr.b;
                    var _v1 = A2($elm$parser$Parser$run, $author$project$Message$FormattedText$parseHexColor, value);
                    if (_v1.$ === "Ok") {
                        var hexColor = _v1.a;
                        return A2($elm$core$List$cons, _Utils_Tuple2("style", "color:" + hexColor), list);
                    } else return list;
                case "data-mx-bg-color":
                    var value = attr.b;
                    var _v2 = A2($elm$parser$Parser$run, $author$project$Message$FormattedText$parseHexColor, value);
                    if (_v2.$ === "Ok") {
                        var hexColor = _v2.a;
                        return A2($elm$core$List$cons, _Utils_Tuple2("style", "background:" + hexColor), list);
                    } else return list;
                default:
                    return list;
            }
        }), _List_Nil, attrs);
    };
    var $author$project$Message$FormattedText$imgAttributes = F2(function(homeserverUrl, attrs) {
        return A3($elm$core$List$foldl, F2(function(attr, list) {
            switch(attr.a){
                case "width":
                    return A2($elm$core$List$cons, attr, list);
                case "height":
                    return A2($elm$core$List$cons, attr, list);
                case "alt":
                    return A2($elm$core$List$cons, attr, list);
                case "title":
                    return A2($elm$core$List$cons, attr, list);
                case "src":
                    var srcStr = attr.b;
                    return A2($elm$core$Maybe$withDefault, list, A2($elm$core$Maybe$map, function(url) {
                        return A2($elm$core$List$cons, _Utils_Tuple2("src", url), list);
                    }, A2($author$project$ApiUtils$httpFromMxc, homeserverUrl, srcStr)));
                default:
                    return list;
            }
        }), _List_Nil, attrs);
    });
    var $author$project$Message$FormattedText$cleanAttributes = F3(function(homeserverUrl, tag, attrs) {
        switch(tag){
            case "font":
                return $author$project$Message$FormattedText$colorAttributes(attrs);
            case "span":
                return $author$project$Message$FormattedText$colorAttributes(attrs);
            case "a":
                return A2($elm$core$List$cons, _Utils_Tuple2("rel", "noopener"), $author$project$Message$FormattedText$anchorAttributes(attrs));
            case "img":
                return A2($author$project$Message$FormattedText$imgAttributes, homeserverUrl, attrs);
            case "ol":
                return A2($elm$core$List$filter, A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$Basics$eq("start")), attrs);
            case "code":
                return A2($elm$core$List$filter, function(_v1) {
                    var attr = _v1.a;
                    var val = _v1.b;
                    return attr === "class" && A2($elm$core$String$left, 9, val) === "language-";
                }, attrs);
            default:
                return _List_Nil;
        }
    });
    var $elm$core$Set$insert = F2(function(key, _v0) {
        var dict = _v0.a;
        return $elm$core$Set$Set_elm_builtin(A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
    });
    var $elm$core$Set$fromList = function(list) {
        return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
    };
    var $author$project$Message$FormattedText$tagWhitelist = $elm$core$Set$fromList(_List_fromArray([
        "font",
        "del",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "p",
        "a",
        "ul",
        "ol",
        "sup",
        "sub",
        "li",
        "b",
        "i",
        "u",
        "strong",
        "em",
        "strike",
        "code",
        "hr",
        "br",
        "div",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "caption",
        "pre",
        "span",
        "img"
    ]));
    var $author$project$Message$FormattedText$cleanHtml = F2(function(homeserverUrl, node_) {
        var cleanHtmlNode = F2(function(depth, node) {
            if (depth > 100) return $hecrj$html_parser$Html$Parser$Text("");
            else switch(node.$){
                case "Text":
                    var str = node.a;
                    return $hecrj$html_parser$Html$Parser$Text(str);
                case "Comment":
                    var str = node.a;
                    return $hecrj$html_parser$Html$Parser$Comment(str);
                default:
                    var tag = node.a;
                    var attrs = node.b;
                    var children = node.c;
                    return (A2($elm$core$Set$member, tag, $author$project$Message$FormattedText$tagWhitelist) ? A2($hecrj$html_parser$Html$Parser$Element, tag, A3($author$project$Message$FormattedText$cleanAttributes, homeserverUrl, tag, attrs)) : A2($hecrj$html_parser$Html$Parser$Element, "div", _List_Nil))(A2($elm$core$List$map, cleanHtmlNode(depth + 1), children));
            }
        });
        return A2(cleanHtmlNode, 0, node_);
    });
    var $elm$virtual_dom$VirtualDom$node = function(tag) {
        return _VirtualDom_node(_VirtualDom_noScript(tag));
    };
    var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
    var $hecrj$html_parser$Html$Parser$Util$toAttribute = function(_v0) {
        var name = _v0.a;
        var value = _v0.b;
        return A2($elm$html$Html$Attributes$attribute, name, value);
    };
    var $hecrj$html_parser$Html$Parser$Util$toVirtualDom = function(nodes) {
        return A2($elm$core$List$map, $hecrj$html_parser$Html$Parser$Util$toVirtualDomEach, nodes);
    };
    var $hecrj$html_parser$Html$Parser$Util$toVirtualDomEach = function(node) {
        switch(node.$){
            case "Element":
                var name = node.a;
                var attrs = node.b;
                var children = node.c;
                return A3($elm$html$Html$node, name, A2($elm$core$List$map, $hecrj$html_parser$Html$Parser$Util$toAttribute, attrs), $hecrj$html_parser$Html$Parser$Util$toVirtualDom(children));
            case "Text":
                var s = node.a;
                return $elm$html$Html$text(s);
            default:
                return $elm$html$Html$text("");
        }
    };
    var $author$project$Message$FormattedText$viewFormattedText = F2(function(homeserverUrl, fmt) {
        if (fmt.$ === "Plain") {
            var str = fmt.a;
            return _List_fromArray([
                A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
                    $tesk9$accessible_html$Accessibility$text(str)
                ]))
            ]);
        } else {
            var nodes = fmt.a;
            return $hecrj$html_parser$Html$Parser$Util$toVirtualDom(A2($elm$core$List$map, $author$project$Message$FormattedText$cleanHtml(homeserverUrl), nodes));
        }
    });
    var $elm$html$Html$Attributes$height = function(n) {
        return A2(_VirtualDom_attribute, "height", $elm$core$String$fromInt(n));
    };
    var $elm$html$Html$Attributes$width = function(n) {
        return A2(_VirtualDom_attribute, "width", $elm$core$String$fromInt(n));
    };
    var $author$project$Message$Image$viewImage = F2(function(homeserverUrl, image) {
        var thumbnail = A2($elm$core$Maybe$andThen, function(info) {
            var _v8 = _Utils_Tuple2(A2($elm$core$Maybe$withDefault, $elm$core$Maybe$Nothing, A2($elm$core$Maybe$map, $author$project$ApiUtils$httpFromMxc(homeserverUrl), info.thumbnail_url)), info.thumbnail_info);
            if (_v8.a.$ === "Just" && _v8.b.$ === "Just") {
                var url = _v8.a.a;
                var tninfo = _v8.b.a;
                return $elm$core$Maybe$Just(_Utils_Tuple2(url, tninfo));
            } else return $elm$core$Maybe$Nothing;
        }, image.info);
        var mainImage = _Utils_Tuple2(A2($author$project$ApiUtils$httpFromMxc, homeserverUrl, image.url), image.info);
        var _v0 = _Utils_Tuple2(mainImage, thumbnail);
        if (_v0.a.a.$ === "Just") {
            if (_v0.b.$ === "Just") {
                var _v1 = _v0.a;
                var mainUrl = _v1.a.a;
                var _v2 = _v0.b.a;
                var tnurl = _v2.a;
                var tninfo = _v2.b;
                return A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                    $elm$html$Html$Attributes$href(mainUrl)
                ]), _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$img, image.body, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-message-image"),
                        $elm$html$Html$Attributes$src(tnurl),
                        $elm$html$Html$Attributes$width(tninfo.w),
                        $elm$html$Html$Attributes$height(tninfo.h)
                    ]))
                ]));
            } else if (_v0.a.b.$ === "Just") {
                var _v3 = _v0.a;
                var mainUrl = _v3.a.a;
                var info = _v3.b.a;
                var _v4 = _v0.b;
                return A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                    $elm$html$Html$Attributes$href(mainUrl)
                ]), _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$img, image.body, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-message-image"),
                        $elm$html$Html$Attributes$src(mainUrl),
                        $elm$html$Html$Attributes$width(info.w),
                        $elm$html$Html$Attributes$height(info.h)
                    ]))
                ]));
            } else {
                var _v5 = _v0.a;
                var mainUrl = _v5.a.a;
                var _v6 = _v5.b;
                var _v7 = _v0.b;
                return A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                    $elm$html$Html$Attributes$href(mainUrl)
                ]), _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$img, image.body, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-message-image"),
                        $elm$html$Html$Attributes$src(mainUrl)
                    ]))
                ]));
            }
        } else return A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$i, _List_Nil, _List_fromArray([
                $tesk9$accessible_html$Accessibility$text("Error: Could not render image")
            ]))
        ]));
    });
    var $elm$html$Html$video = _VirtualDom_node("video");
    var $tesk9$accessible_html$Accessibility$video = function(attributes) {
        return $elm$html$Html$video($tesk9$accessible_html$Accessibility$Utils$nonInteractive(attributes));
    };
    var $author$project$Message$Video$viewVideo = F2(function(homeserverUrl, vdata) {
        var url = A2($author$project$ApiUtils$httpFromMxc, homeserverUrl, vdata.url);
        if (url.$ === "Just") {
            var u = url.a;
            return A2($tesk9$accessible_html$Accessibility$video, _List_fromArray([
                $elm$html$Html$Attributes$alt(vdata.body),
                $elm$html$Html$Attributes$src(u),
                $elm$html$Html$Attributes$controls(true),
                $elm$html$Html$Attributes$class("cactus-message-video")
            ]), _List_Nil);
        } else return A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
            A2($tesk9$accessible_html$Accessibility$i, _List_Nil, _List_fromArray([
                $tesk9$accessible_html$Accessibility$text('Error: The URL for video "' + (vdata.body + '" could not be decoded.'))
            ]))
        ]));
    });
    var $author$project$Message$viewMessage = F3(function(homeserverUrl, displayname, message) {
        switch(message.$){
            case "Text":
                var fmt = message.a;
                return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                    $elm$html$Html$Attributes$class("cactus-message-text")
                ]), A2($author$project$Message$FormattedText$viewFormattedText, homeserverUrl, fmt));
            case "Emote":
                if (message.a.$ === "Plain") {
                    var str = message.a.a;
                    return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-message-emote")
                    ]), _List_fromArray([
                        A2($tesk9$accessible_html$Accessibility$p, _List_Nil, _List_fromArray([
                            $tesk9$accessible_html$Accessibility$text(displayname + (" " + str))
                        ]))
                    ]));
                } else {
                    var fmt = message.a;
                    return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-message-text")
                    ]), A2($author$project$Message$FormattedText$viewFormattedText, homeserverUrl, fmt));
                }
            case "Notice":
                var fmt = message.a;
                return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                    $elm$html$Html$Attributes$class("cactus-message-text")
                ]), A2($author$project$Message$FormattedText$viewFormattedText, homeserverUrl, fmt));
            case "Image":
                var image = message.a;
                return A2($author$project$Message$Image$viewImage, homeserverUrl, image);
            case "File":
                var file = message.a;
                return A2($author$project$Message$File$viewFile, homeserverUrl, file);
            case "Audio":
                var audio = message.a;
                return A2($author$project$Message$Audio$viewAudio, homeserverUrl, audio);
            default:
                var video = message.a;
                return A2($author$project$Message$Video$viewVideo, homeserverUrl, video);
        }
    });
    var $author$project$Message$viewMessageEvent = F6(function(defaultHomeserverUrl, now, messageTime, senderId, sender, message) {
        var timeUtcIso = $author$project$Message$formatTimeAsIsoUtcString(messageTime);
        var timeUtc = $author$project$Message$formatTimeAsUtcString(messageTime);
        var timeStr = A2($author$project$Message$timeSinceText, now, messageTime);
        var senderIdStr = $author$project$UserId$toString(senderId);
        var matrixDotToUrl = "https://matrix.to/#/" + $author$project$UserId$toString(senderId);
        var displayname = A2($elm$core$Maybe$withDefault, senderIdStr, A2($elm$core$Maybe$map, function(m) {
            return A2($elm$core$Maybe$withDefault, senderIdStr, m.displayname);
        }, sender));
        var body = A3($author$project$Message$viewMessage, defaultHomeserverUrl, displayname, message);
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-comment")
        ]), _List_fromArray([
            A2($author$project$Message$viewAvatar, defaultHomeserverUrl, sender),
            A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-comment-content")
            ]), _List_fromArray([
                A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                    $elm$html$Html$Attributes$class("cactus-comment-header")
                ]), _List_fromArray([
                    A2($tesk9$accessible_html$Accessibility$a, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-comment-displayname"),
                        $elm$html$Html$Attributes$href(matrixDotToUrl)
                    ]), _List_fromArray([
                        $tesk9$accessible_html$Accessibility$text(displayname)
                    ])),
                    A2($tesk9$accessible_html$Accessibility$time, _List_fromArray([
                        $elm$html$Html$Attributes$class("cactus-comment-time"),
                        $elm$html$Html$Attributes$title(timeUtc),
                        $elm$html$Html$Attributes$datetime(timeUtcIso)
                    ]), _List_fromArray([
                        $tesk9$accessible_html$Accessibility$text(timeStr)
                    ]))
                ])),
                A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                    $elm$html$Html$Attributes$class("cactus-comment-body")
                ]), _List_fromArray([
                    body
                ]))
            ]))
        ]));
    });
    var $author$project$Room$viewRoomEvents = F4(function(homeserverUrl, _v0, count, now) {
        var room = _v0.a;
        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
            $elm$html$Html$Attributes$class("cactus-comments-list")
        ]), A2($elm$core$List$map, function(e) {
            var member = A2($elm$core$Maybe$withDefault, A2($elm$core$Dict$get, $author$project$UserId$toString(e.sender), room.members), A2($elm$core$Maybe$map, $elm$core$Maybe$Just, A3($author$project$Event$latestMemberDataBefore, room.events, e.originServerTs, e.sender)));
            return A6($author$project$Message$viewMessageEvent, homeserverUrl, now, e.originServerTs, e.sender, member, e.content);
        }, A2($elm$core$List$take, count, $author$project$Event$messageEvents(room.events))));
    });
    var $author$project$Main$view = function(model_) {
        if (model_.$ === "BadConfig") {
            var err = model_.a;
            return $author$project$Main$viewError({
                id: 0,
                message: "Bad configuration: " + err
            });
        } else {
            var model = model_.a;
            var loginPopup = A2($elm$html$Html$map, $author$project$Main$LoginMsg, A2($author$project$LoginForm$viewLoginForm, model.loginForm, model.config.roomAlias));
            var errors = $elm$core$List$length(model.errors) > 0 ? A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-errors")
            ]), A2($elm$core$List$map, $author$project$Main$viewError, model.errors)) : $tesk9$accessible_html$Accessibility$text("");
            var editor = A2($author$project$Editor$view, model.editor, {
                guestPostingEnabled: model.config.guestPostingEnabled,
                loginEnabled: model.config.loginEnabled,
                logout: $author$project$Main$LogOut,
                msgmap: $author$project$Main$EditorMsg,
                roomAlias: model.config.roomAlias,
                send: A3($elm$core$Maybe$map2, $author$project$Main$SendComment, model.session, A2($elm$core$Maybe$map, $author$project$Room$extractRoomId, model.room)),
                session: model.session,
                showLogin: $author$project$Main$ShowLogin
            });
            return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                $elm$html$Html$Attributes$class("cactus-container")
            ]), _List_fromArray([
                errors,
                loginPopup,
                editor,
                function() {
                    var _v1 = _Utils_Tuple2(model.room, model.session);
                    if (_v1.a.$ === "Just" && _v1.b.$ === "Just") {
                        var room = _v1.a.a;
                        var session = _v1.b.a;
                        return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                            $elm$html$Html$Attributes$class("cactus-comments-container")
                        ]), _List_fromArray([
                            A4($author$project$Room$viewRoomEvents, $author$project$Session$getHomeserverUrl(session), room, model.showComments, model.now),
                            model.gotAllComments ? $tesk9$accessible_html$Accessibility$text("") : A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                                $elm$html$Html$Attributes$class("cactus-view-more")
                            ]), _List_fromArray([
                                A2($tesk9$accessible_html$Accessibility$button, _List_fromArray([
                                    $elm$html$Html$Attributes$class("cactus-button"),
                                    $elm$html$Html$Events$onClick(A2($author$project$Main$ViewMore, session, room))
                                ]), _List_fromArray([
                                    $tesk9$accessible_html$Accessibility$text("View more")
                                ]))
                            ]))
                        ]));
                    } else return A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                        $elm$html$Html$Attributes$class("spinner")
                    ]), _List_fromArray([
                        A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                            $elm$html$Html$Attributes$class("rect1")
                        ]), _List_Nil),
                        A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                            $elm$html$Html$Attributes$class("rect2")
                        ]), _List_Nil),
                        A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                            $elm$html$Html$Attributes$class("rect3")
                        ]), _List_Nil),
                        A2($tesk9$accessible_html$Accessibility$div, _List_fromArray([
                            $elm$html$Html$Attributes$class("rect4")
                        ]), _List_Nil)
                    ]));
                }()
            ]));
        }
    };
    var $author$project$Main$main = $elm$browser$Browser$element({
        init: $author$project$Main$init,
        subscriptions: $author$project$Main$subscriptions,
        update: $author$project$Main$update,
        view: $author$project$Main$view
    });
    _Platform_export({
        "Main": {
            "init": $author$project$Main$main($elm$json$Json$Decode$value)(0)
        }
    });
})($5f21597d1e8deb04$exports);


function $4af2f28cd20946bb$export$dae1c0e759c7812c(config) {
    // get nullable session object from localstorage
    config["storedSession"] = JSON.parse(localStorage.getItem("cactus-session"));
    // get node from the config
    // remove it from config object before passing to elm
    var node = config["node"];
    delete config["node"];
    // if node is string, use query selector to find dom node
    if (typeof node == "string") node = document.querySelector(node);
    // make a comments section in DOM element `node`
    // initialize with provided config
    var app = (0, $5f21597d1e8deb04$exports.Elm).Main.init({
        node: node,
        flags: config
    });
    // subscribe to commands from localstorage port
    app.ports.storeSession.subscribe((s)=>localStorage.setItem("cactus-session", s));
}


export {$4af2f28cd20946bb$export$dae1c0e759c7812c as initComments};
//# sourceMappingURL=cactus.js.map
