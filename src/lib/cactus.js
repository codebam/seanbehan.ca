var r = {};
function n(n) {
	// get nullable session object from localstorage
	n.storedSession = JSON.parse(localStorage.getItem('cactus-session')); // get node from the config
	// remove it from config object before passing to elm
	var t = n.node;
	delete n.node,
		'string' == typeof t && (t = document.querySelector(t)), // subscribe to commands from localstorage port
		(0, r.Elm).Main.init({ node: t, flags: n }).ports.storeSession.subscribe((r) =>
			localStorage.setItem('cactus-session', r)
		);
}
!(function (r) {
	function n(r, n, t) {
		return (t.a = r), (t.f = n), t;
	}
	function t(r) {
		return n(2, r, function (n) {
			return function (t) {
				return r(n, t);
			};
		});
	}
	function e(r) {
		return n(3, r, function (n) {
			return function (t) {
				return function (e) {
					return r(n, t, e);
				};
			};
		});
	}
	function u(r) {
		return n(4, r, function (n) {
			return function (t) {
				return function (e) {
					return function (u) {
						return r(n, t, e, u);
					};
				};
			};
		});
	}
	function a(r) {
		return n(5, r, function (n) {
			return function (t) {
				return function (e) {
					return function (u) {
						return function (a) {
							return r(n, t, e, u, a);
						};
					};
				};
			};
		});
	}
	function c(r) {
		return n(6, r, function (n) {
			return function (t) {
				return function (e) {
					return function (u) {
						return function (a) {
							return function (c) {
								return r(n, t, e, u, a, c);
							};
						};
					};
				};
			};
		});
	}
	function i(r) {
		return n(7, r, function (n) {
			return function (t) {
				return function (e) {
					return function (u) {
						return function (a) {
							return function (c) {
								return function (i) {
									return r(n, t, e, u, a, c, i);
								};
							};
						};
					};
				};
			};
		});
	}
	function o(r, n, t) {
		return 2 === r.a ? r.f(n, t) : r(n)(t);
	}
	function f(r, n, t, e) {
		return 3 === r.a ? r.f(n, t, e) : r(n)(t)(e);
	}
	function s(r, n, t, e, u) {
		return 4 === r.a ? r.f(n, t, e, u) : r(n)(t)(e)(u);
	}
	function l(r, n, t, e, u, a) {
		return 5 === r.a ? r.f(n, t, e, u, a) : r(n)(t)(e)(u)(a);
	}
	function b(r, n, t, e, u, a, c) {
		return 6 === r.a ? r.f(n, t, e, u, a, c) : r(n)(t)(e)(u)(a)(c);
	}
	function d(r, n, t, e, u, a, c, i) {
		return 7 === r.a ? r.f(n, t, e, u, a, c, i) : r(n)(t)(e)(u)(a)(c)(i);
	}
	function v(r, n) {
		for (var t, e = [], u = p(r, n, 0, e); u && (t = e.pop()); u = p(t.a, t.b, 0, e));
		return u;
	}
	function p(r, n, t, e) {
		if (r === n) return !0;
		if ('object' != typeof r || null === r || null === n) return 'function' == typeof r && R(5), !1;
		if (t > 100) return e.push(D(r, n)), !0;
		for (var u in (0 > r.$ && ((r = nT(r)), (n = nT(n))), r))
			if (!p(r[u], n[u], t + 1, e)) return !1;
		return !0;
	}
	var g = t(v);
	function h(r, n, t) {
		if ('object' != typeof r) return r === n ? 0 : n > r ? -1 : 1;
		if (void 0 === r.$) return (t = h(r.a, n.a)) || (t = h(r.b, n.b)) ? t : h(r.c, n.c);
		for (; r.b && n.b && !(t = h(r.a, n.a)); r = r.b, n = n.b);
		return t || (r.b ? 1 : n.b ? -1 : 0);
	}
	var m = t(function (r, n) {
		var t = h(r, n);
		return 0 > t ? nL : t ? nC : nE;
	});
	function D(r, n) {
		return { a: r, b: n };
	}
	function $(r, n, t) {
		return { a: r, b: n, c: t };
	}
	function w(r, n) {
		var t = {};
		for (var e in r) t[e] = r[e];
		for (var e in n) t[e] = n[e];
		return t;
	}
	var x = t(y);
	function y(r, n) {
		if ('string' == typeof r) return r + n;
		if (!r.b) return n;
		var t = S(r.a, n);
		r = r.b;
		for (var e = t; r.b; r = r.b) e = e.b = S(r.a, n);
		return t;
	}
	var q = { $: 0 };
	function S(r, n) {
		return { $: 1, a: r, b: n };
	}
	var A = t(S);
	function k(r) {
		for (var n = q, t = r.length; t--; ) n = S(r[t], n);
		return n;
	}
	function E(r) {
		for (var n = []; r.b; r = r.b) n.push(r.a);
		return n;
	}
	var C = e(function (r, n, t) {
			for (var e = []; n.b && t.b; n = n.b, t = t.b) e.push(o(r, n.a, t.a));
			return k(e);
		}),
		L = t(function (r, n) {
			return k(
				E(n).sort(function (n, t) {
					return h(r(n), r(t));
				})
			);
		}),
		N = e(function (r, n, t) {
			for (var e = Array(r), u = 0; r > u; u++) e[u] = t(n + u);
			return e;
		}),
		T = t(function (r, n) {
			for (var t = Array(r), e = 0; r > e && n.b; e++) (t[e] = n.a), (n = n.b);
			return (t.length = e), D(t, n);
		});
	function R(r) {
		throw Error('https://github.com/elm/core/blob/1.0.0/hints/' + r + '.md');
	}
	var O = t(function (r, n) {
			return r + n;
		}),
		U = t(function (r, n) {
			return r * n;
		}),
		H = t(Math.pow),
		B = t(function (r, n) {
			var t = n % r;
			return 0 === r ? R(11) : (t > 0 && 0 > r) || (0 > t && r > 0) ? t + r : t;
		}),
		I = Math.log,
		j = t(function (r, n) {
			return r + n;
		}),
		_ = e(function (r, n, t) {
			for (var e = t.length, u = 0; e > u; ) {
				var a = t[u],
					c = t.charCodeAt(u);
				u++, 55296 > c || c > 56319 || ((a += t[u]), u++), (n = o(r, a, n));
			}
			return n;
		}),
		V = e(function (r, n, t) {
			for (var e = t.length; e--; ) {
				var u = t[e],
					a = t.charCodeAt(e);
				56320 > a || a > 57343 || (u = t[--e] + u), (n = o(r, u, n));
			}
			return n;
		}),
		F = t(function (r, n) {
			return n.split(r);
		}),
		z = t(function (r, n) {
			return n.join(r);
		}),
		P = e(function (r, n, t) {
			return t.slice(r, n);
		}),
		G = t(function (r, n) {
			for (var t = n.length; t--; ) {
				var e = n[t],
					u = n.charCodeAt(t);
				if ((56320 > u || u > 57343 || (e = n[--t] + e), !r(e))) return !1;
			}
			return !0;
		}),
		M = t(function (r, n) {
			return n.indexOf(r) > -1;
		}),
		J = t(function (r, n) {
			return 0 === n.indexOf(r);
		}),
		Z = t(function (r, n) {
			return n.length >= r.length && n.lastIndexOf(r) === n.length - r.length;
		});
	function Q(r) {
		return { $: 2, b: r };
	}
	var K = Q(function (r) {
			return 'number' != typeof r
				? rp('an INT', r)
				: r > -2147483647 && 2147483647 > r && (0 | r) === r
					? nB(r)
					: !isFinite(r) || r % 1
						? rp('an INT', r)
						: nB(r);
		}),
		Y = Q(function (r) {
			return 'boolean' == typeof r ? nB(r) : rp('a BOOL', r);
		}),
		X = Q(function (r) {
			return 'number' == typeof r ? nB(r) : rp('a FLOAT', r);
		}),
		W = Q(function (r) {
			return nB(r);
		}),
		rr = Q(function (r) {
			return 'string' == typeof r ? nB(r) : r instanceof String ? nB(r + '') : rp('a STRING', r);
		}),
		rn = t(function (r, n) {
			return { $: 6, d: r, b: n };
		});
	function rt(r, n) {
		return { $: 9, f: r, g: n };
	}
	var re = t(function (r, n) {
			return { $: 10, b: n, h: r };
		}),
		ru = t(function (r, n) {
			return rt(r, [n]);
		}),
		ra = e(function (r, n, t) {
			return rt(r, [n, t]);
		}),
		rc = u(function (r, n, t, e) {
			return rt(r, [n, t, e]);
		}),
		ri = a(function (r, n, t, e, u) {
			return rt(r, [n, t, e, u]);
		}),
		ro = c(function (r, n, t, e, u, a) {
			return rt(r, [n, t, e, u, a]);
		}),
		rf = t(function (r, n) {
			try {
				return rl(r, JSON.parse(n));
			} catch (r) {
				return nR(o(nO, 'This is not valid JSON! ' + r.message, n));
			}
		}),
		rs = t(function (r, n) {
			return rl(r, n);
		});
	function rl(r, n) {
		switch (r.$) {
			case 2:
				return r.b(n);
			case 5:
				return null === n ? nB(r.c) : rp('null', n);
			case 3:
				return rd(n) ? rb(r.b, n, k) : rp('a LIST', n);
			case 4:
				return rd(n) ? rb(r.b, n, rv) : rp('an ARRAY', n);
			case 6:
				var t = r.d;
				if ('object' != typeof n || null === n || !(t in n))
					return rp('an OBJECT with a field named `' + t + '`', n);
				var e = rl(r.b, n[t]);
				return td(e) ? e : nR(o(nU, t, e.a));
			case 7:
				var u = r.e;
				return rd(n)
					? n.length > u
						? td((e = rl(r.b, n[u])))
							? e
							: nR(o(nH, u, e.a))
						: rp('a LONGER array. Need index ' + u + ' but only see ' + n.length + ' entries', n)
					: rp('an ARRAY', n);
			case 8:
				if ('object' != typeof n || null === n || rd(n)) return rp('an OBJECT', n);
				var a = q;
				for (var c in n)
					if (n.hasOwnProperty(c)) {
						if (!td((e = rl(r.b, n[c])))) return nR(o(nU, c, e.a));
						a = S(D(c, e.a), a);
					}
				return nB(n2(a));
			case 9:
				for (var i = r.f, f = r.g, s = 0; f.length > s; s++) {
					if (!td((e = rl(f[s], n)))) return e;
					i = i(e.a);
				}
				return nB(i);
			case 10:
				return td((e = rl(r.b, n))) ? rl(r.h(e.a), n) : e;
			case 11:
				for (var l = q, b = r.g; b.b; b = b.b) {
					if (td((e = rl(b.a, n)))) return e;
					l = S(e.a, l);
				}
				return nR(nI(n2(l)));
			case 1:
				return nR(o(nO, r.a, n));
			case 0:
				return nB(r.a);
		}
	}
	function rb(r, n, t) {
		for (var e = n.length, u = Array(e), a = 0; e > a; a++) {
			var c = rl(r, n[a]);
			if (!td(c)) return nR(o(nH, a, c.a));
			u[a] = c.a;
		}
		return nB(t(u));
	}
	function rd(r) {
		return Array.isArray(r) || ('undefined' != typeof FileList && r instanceof FileList);
	}
	function rv(r) {
		return o(tb, r.length, function (n) {
			return r[n];
		});
	}
	function rp(r, n) {
		return nR(o(nO, 'Expecting ' + r, n));
	}
	function rg(r, n) {
		if (r === n) return !0;
		if (r.$ !== n.$) return !1;
		switch (r.$) {
			case 0:
			case 1:
				return r.a === n.a;
			case 2:
				return r.b === n.b;
			case 5:
				return r.c === n.c;
			case 3:
			case 4:
			case 8:
				return rg(r.b, n.b);
			case 6:
				return r.d === n.d && rg(r.b, n.b);
			case 7:
				return r.e === n.e && rg(r.b, n.b);
			case 9:
				return r.f === n.f && rh(r.g, n.g);
			case 10:
				return r.h === n.h && rg(r.b, n.b);
			case 11:
				return rh(r.g, n.g);
		}
	}
	function rh(r, n) {
		var t = r.length;
		if (t !== n.length) return !1;
		for (var e = 0; t > e; e++) if (!rg(r[e], n[e])) return !1;
		return !0;
	}
	var rm = t(function (r, n) {
			return JSON.stringify(n, null, r) + '';
		}),
		rD = e(function (r, n, t) {
			return (t[r] = n), t;
		});
	function r$(r) {
		return { $: 0, a: r };
	}
	function rw(r) {
		return { $: 2, b: r, c: null };
	}
	var rx = t(function (r, n) {
			return { $: 3, b: r, d: n };
		}),
		ry = t(function (r, n) {
			return { $: 4, b: r, d: n };
		}),
		rq = 0;
	function rS(r) {
		var n = { $: 0, e: rq++, f: r, g: null, h: [] };
		return rN(n), n;
	}
	function rA(r) {
		return rw(function (n) {
			n(r$(rS(r)));
		});
	}
	function rk(r, n) {
		r.h.push(n), rN(r);
	}
	var rE = t(function (r, n) {
			return rw(function (t) {
				rk(r, n), t(r$(0));
			});
		}),
		rC = !1,
		rL = [];
	function rN(r) {
		if ((rL.push(r), !rC)) {
			for (rC = !0; (r = rL.shift()); )
				!(function (r) {
					for (; r.f; ) {
						var n = r.f.$;
						if (0 === n || 1 === n) {
							for (; r.g && r.g.$ !== n; ) r.g = r.g.i;
							if (!r.g) return;
							(r.f = r.g.b(r.f.a)), (r.g = r.g.i);
						} else {
							if (2 === n)
								return void (r.f.c = r.f.b(function (n) {
									(r.f = n), rN(r);
								}));
							if (5 === n) {
								if (0 === r.h.length) return;
								r.f = r.f.b(r.h.shift());
							} else (r.g = { $: 3 === n ? 0 : 1, b: r.f.b, i: r.g }), (r.f = r.f.d);
						}
					}
				})(r);
			rC = !1;
		}
	}
	function rT(r) {
		return rw(function (n) {
			var t = setTimeout(function () {
				n(r$(0));
			}, r);
			return function () {
				clearTimeout(t);
			};
		});
	}
	var rR = {};
	function rO(r, n, t, e, u) {
		return { b: r, c: n, d: t, e: e, f: u };
	}
	var rU = t(function (r, n) {
			return rw(function (t) {
				r.g(n), t(r$(0));
			});
		}),
		rH = t(function (r, n) {
			return o(rE, r.h, { $: 0, a: n });
		});
	function rB(r) {
		return function (n) {
			return { $: 1, k: r, l: n };
		};
	}
	function rI(r) {
		return { $: 2, m: r };
	}
	var rj = t(function (r, n) {
			return { $: 3, n: r, o: n };
		}),
		r_ = [],
		rV = !1;
	function rF(r, n, t) {
		if ((r_.push({ p: r, q: n, r: t }), !rV)) {
			rV = !0;
			for (var e; (e = r_.shift()); )
				!(function (r, n, t) {
					var e = {};
					for (var u in (rz(!0, n, e, null), rz(!1, t, e, null), r))
						rk(r[u], { $: 'fx', a: e[u] || { i: q, j: q } });
				})(e.p, e.q, e.r);
			rV = !1;
		}
	}
	function rz(r, n, t, e) {
		switch (n.$) {
			case 1:
				var u,
					a,
					c = n.k,
					i =
						((u = n.l),
						o(
							r ? rR[c].e : rR[c].f,
							function (r) {
								for (var n = e; n; n = n.t) r = n.s(r);
								return r;
							},
							u
						));
				return void (t[c] =
					((a = (a = t[c]) || { i: q, j: q }), r ? (a.i = S(i, a.i)) : (a.j = S(i, a.j)), a));
			case 2:
				for (var f = n.m; f.b; f = f.b) rz(r, f.a, t, e);
				return;
			case 3:
				return void rz(r, n.o, t, { s: n.n, t: e });
		}
	}
	var rP,
		rG = t(function (r, n) {
			return n;
		}),
		rM = 'undefined' != typeof document ? document : {};
	function rJ(r, n) {
		r.appendChild(n);
	}
	function rZ(r) {
		return { $: 0, a: r };
	}
	var rQ = t(function (r, n) {
			return t(function (t, e) {
				for (var u = [], a = 0; e.b; e = e.b) {
					var c = e.a;
					(a += c.b || 0), u.push(c);
				}
				return (a += u.length), { $: 1, c: n, d: r6(t), e: u, f: r, b: a };
			});
		}),
		rK = rQ(void 0);
	t(function (r, n) {
		return t(function (t, e) {
			for (var u = [], a = 0; e.b; e = e.b) {
				var c = e.a;
				(a += c.b.b || 0), u.push(c);
			}
			return (a += u.length), { $: 2, c: n, d: r6(t), e: u, f: r, b: a };
		});
	})(void 0);
	var rY = t(function (r, n) {
			return { $: 4, j: r, k: n, b: 1 + (n.b || 0) };
		}),
		rX = t(function (r, n) {
			return { $: 'a0', n: r, o: n };
		}),
		rW = t(function (r, n) {
			return { $: 'a1', n: r, o: n };
		}),
		r1 = t(function (r, n) {
			return { $: 'a2', n: r, o: n };
		}),
		r0 = t(function (r, n) {
			return { $: 'a3', n: r, o: n };
		});
	function r2(r) {
		return /^\s*(javascript:|data:text\/html)/i.test(r) ? '' : r;
	}
	var r3,
		r5 = t(function (r, n) {
			var t, e;
			return 'a0' === n.$
				? o(
						rX,
						n.n,
						((e = th((t = n.o))),
						{ $: t.$, a: e ? f(tp, 3 > e ? r8 : r4, tg(r), t.a) : o(tv, r, t.a) })
					)
				: n;
		}),
		r8 = t(function (r, n) {
			return D(r(n.a), n.b);
		}),
		r4 = t(function (r, n) {
			return { aF: r(n.aF), bk: n.bk, ba: n.ba };
		});
	function r6(r) {
		for (var n = {}; r.b; r = r.b) {
			var t = r.a,
				e = t.$,
				u = t.n,
				a = t.o;
			if ('a2' !== e) {
				var c = n[e] || (n[e] = {});
				'a3' === e && 'class' === u ? r9(c, u, a) : (c[u] = a);
			} else 'className' === u ? r9(n, u, a) : (n[u] = a);
		}
		return n;
	}
	function r9(r, n, t) {
		var e = r[n];
		r[n] = e ? e + ' ' + t : t;
	}
	function r7(r, n) {
		var t = r.$;
		if (5 === t) return r7(r.k || (r.k = r.m()), n);
		if (0 === t) return rM.createTextNode(r.a);
		if (4 === t) {
			for (var e = r.k, u = r.j; 4 === e.$; )
				'object' != typeof u ? (u = [u, e.j]) : u.push(e.j), (e = e.k);
			var a = { j: u, p: n };
			return ((c = r7(e, a)).elm_event_node_ref = a), c;
		}
		if (3 === t) return nr((c = r.h(r.g)), n, r.d), c;
		var c = r.f ? rM.createElementNS(r.f, r.c) : rM.createElement(r.c);
		rP && 'a' == r.c && c.addEventListener('click', rP(c)), nr(c, n, r.d);
		for (var i = r.e, o = 0; i.length > o; o++) rJ(c, r7(1 === t ? i[o] : i[o].b, n));
		return c;
	}
	function nr(r, n, t) {
		for (var e in t) {
			var u = t[e];
			'a1' === e
				? (function (r, n) {
						var t = r.style;
						for (var e in n) t[e] = n[e];
					})(r, u)
				: 'a0' === e
					? (function (r, n, t) {
							var e = r.elmFs || (r.elmFs = {});
							for (var u in t) {
								var a = t[u],
									c = e[u];
								if (a) {
									if (c) {
										if (c.q.$ === a.$) {
											c.q = a;
											continue;
										}
										r.removeEventListener(u, c);
									}
									(c = (function (r, n) {
										function t(n) {
											var e = t.q,
												u = rl(e.a, n);
											if (td(u)) {
												for (
													var a,
														c = th(e),
														i = u.a,
														o = c ? (3 > c ? i.a : i.aF) : i,
														f = 1 == c ? i.b : 3 == c && i.bk,
														s =
															(f && n.stopPropagation(),
															(2 == c ? i.b : 3 == c && i.ba) && n.preventDefault(),
															r);
													(a = s.j);

												) {
													if ('function' == typeof a) o = a(o);
													else for (var l = a.length; l--; ) o = a[l](o);
													s = s.p;
												}
												s(o, f);
											}
										}
										return (t.q = n), t;
									})(n, a)),
										r.addEventListener(u, c, r3 && { passive: 2 > th(a) }),
										(e[u] = c);
								} else r.removeEventListener(u, c), (e[u] = void 0);
							}
						})(r, n, u)
					: 'a3' === e
						? (function (r, n) {
								for (var t in n) {
									var e = n[t];
									void 0 !== e ? r.setAttribute(t, e) : r.removeAttribute(t);
								}
							})(r, u)
						: 'a4' === e
							? (function (r, n) {
									for (var t in n) {
										var e = n[t],
											u = e.f,
											a = e.o;
										void 0 !== a ? r.setAttributeNS(u, t, a) : r.removeAttributeNS(u, t);
									}
								})(r, u)
							: (('value' !== e && 'checked' !== e) || r[e] !== u) && (r[e] = u);
		}
	}
	try {
		window.addEventListener(
			't',
			null,
			Object.defineProperty({}, 'passive', {
				get: function () {
					r3 = !0;
				}
			})
		);
	} catch (r) {}
	function nn(r, n, t, e) {
		var u = { $: n, r: t, s: e, t: void 0, u: void 0 };
		return r.push(u), u;
	}
	function nt(r, n, t, e) {
		if (r !== n) {
			var u = r.$,
				a = n.$;
			if (u !== a) {
				if (1 !== u || 2 !== a) return void nn(t, 0, e, n);
				(n = (function (r) {
					for (var n = r.e, t = n.length, e = Array(t), u = 0; t > u; u++) e[u] = n[u].b;
					return { $: 1, c: r.c, d: r.d, e: e, f: r.f, b: r.b };
				})(n)),
					(a = 1);
			}
			switch (a) {
				case 5:
					for (var c = r.l, i = n.l, o = c.length, f = o === i.length; f && o--; )
						f = c[o] === i[o];
					if (f) return void (n.k = r.k);
					n.k = n.m();
					var s = [];
					return nt(r.k, n.k, s, 0), void (s.length > 0 && nn(t, 1, e, s));
				case 4:
					for (var l = r.j, b = n.j, d = !1, v = r.k; 4 === v.$; )
						(d = !0), 'object' != typeof l ? (l = [l, v.j]) : l.push(v.j), (v = v.k);
					for (var p = n.k; 4 === p.$; )
						(d = !0), 'object' != typeof b ? (b = [b, p.j]) : b.push(p.j), (p = p.k);
					return d && l.length !== b.length
						? void nn(t, 0, e, n)
						: ((d
								? (function (r, n) {
										for (var t = 0; r.length > t; t++) if (r[t] !== n[t]) return !1;
										return !0;
									})(l, b)
								: l === b) || nn(t, 2, e, b),
							void nt(v, p, t, e + 1));
				case 0:
					return void (r.a !== n.a && nn(t, 3, e, n.a));
				case 1:
					return void ne(r, n, t, e, na);
				case 2:
					return void ne(r, n, t, e, nc);
				case 3:
					if (r.h !== n.h) return void nn(t, 0, e, n);
					var g = nu(r.d, n.d);
					g && nn(t, 4, e, g);
					var h = n.i(r.g, n.g);
					return void (h && nn(t, 5, e, h));
			}
		}
	}
	function ne(r, n, t, e, u) {
		if (r.c === n.c && r.f === n.f) {
			var a = nu(r.d, n.d);
			a && nn(t, 4, e, a), u(r, n, t, e);
		} else nn(t, 0, e, n);
	}
	function nu(r, n, t) {
		var e;
		for (var u in r)
			if ('a1' !== u && 'a0' !== u && 'a3' !== u && 'a4' !== u) {
				if (u in n) {
					var a = r[u],
						c = n[u];
					(a === c && 'value' !== u && 'checked' !== u) ||
						('a0' === t && a.$ == c.$ && rg(a.a, c.a)) ||
						((e = e || {})[u] = c);
				} else
					(e = e || {})[u] = t
						? 'a1' === t
							? ''
							: 'a0' === t || 'a3' === t
								? void 0
								: { f: r[u].f, o: void 0 }
						: 'string' == typeof r[u]
							? ''
							: null;
			} else {
				var i = nu(r[u], n[u] || {}, u);
				i && ((e = e || {})[u] = i);
			}
		for (var o in n) o in r || ((e = e || {})[o] = n[o]);
		return e;
	}
	function na(r, n, t, e) {
		var u = r.e,
			a = n.e,
			c = u.length,
			i = a.length;
		c > i ? nn(t, 6, e, { v: i, i: c - i }) : i > c && nn(t, 7, e, { v: c, e: a });
		for (var o = i > c ? c : i, f = 0; o > f; f++) {
			var s = u[f];
			nt(s, a[f], t, ++e), (e += s.b || 0);
		}
	}
	function nc(r, n, t, e) {
		for (
			var u = [], a = {}, c = [], i = r.e, o = n.e, f = i.length, s = o.length, l = 0, b = 0, d = e;
			f > l && s > b;

		) {
			var v = (A = i[l]).a,
				p = (k = o[b]).a,
				g = A.b,
				h = k.b,
				m = void 0,
				D = void 0;
			if (v !== p) {
				var $ = i[l + 1],
					w = o[b + 1];
				if ($) {
					var x = $.a,
						y = $.b;
					D = p === x;
				}
				if (w) {
					var q = w.a,
						S = w.b;
					m = v === q;
				}
				if (m && D)
					nt(g, S, u, ++d),
						no(a, u, v, h, b, c),
						(d += g.b || 0),
						nf(a, u, v, y, ++d),
						(d += y.b || 0),
						(l += 2),
						(b += 2);
				else if (m) d++, no(a, u, p, h, b, c), nt(g, S, u, d), (d += g.b || 0), (l += 1), (b += 2);
				else if (D)
					nf(a, u, v, g, ++d),
						(d += g.b || 0),
						nt(y, h, u, ++d),
						(d += y.b || 0),
						(l += 2),
						(b += 1);
				else {
					if (!$ || x !== q) break;
					nf(a, u, v, g, ++d),
						no(a, u, p, h, b, c),
						(d += g.b || 0),
						nt(y, S, u, ++d),
						(d += y.b || 0),
						(l += 2),
						(b += 2);
				}
			} else nt(g, h, u, ++d), (d += g.b || 0), l++, b++;
		}
		for (; f > l; ) d++, nf(a, u, (A = i[l]).a, (g = A.b), d), (d += g.b || 0), l++;
		for (; s > b; ) {
			var A,
				k,
				E = E || [];
			no(a, u, (k = o[b]).a, k.b, void 0, E), b++;
		}
		(u.length > 0 || c.length > 0 || E) && nn(t, 8, e, { w: u, x: c, y: E });
	}
	var ni = '_elmW6BL';
	function no(r, n, t, e, u, a) {
		var c = r[t];
		if (!c) return a.push({ r: u, A: (c = { c: 0, z: e, r: u, s: void 0 }) }), void (r[t] = c);
		if (1 === c.c) {
			a.push({ r: u, A: c }), (c.c = 2);
			var i = [];
			return nt(c.z, e, i, c.r), (c.r = u), void (c.s.s = { w: i, A: c });
		}
		no(r, n, t + ni, e, u, a);
	}
	function nf(r, n, t, e, u) {
		var a = r[t];
		if (a) {
			if (0 === a.c) {
				a.c = 2;
				var c = [];
				return nt(e, a.z, c, u), void nn(n, 9, u, { w: c, A: a });
			}
			nf(r, n, t + ni, e, u);
		} else {
			var i = nn(n, 9, u, void 0);
			r[t] = { c: 1, z: e, r: u, s: i };
		}
	}
	var ns = u(function (r, n, t, e) {
			return (function (r, n, t, e, u, a) {
				var c = o(rs, r, n ? n.flags : void 0);
				td(c) || R(2);
				var i = {},
					l = t(c.a),
					b = l.a,
					d = a(p, b),
					v = (function (r, n) {
						var t;
						for (var e in rR) {
							var u = rR[e];
							u.a && ((t = t || {})[e] = u.a(e, n)),
								(r[e] = (function (r, n) {
									var t = { g: n, h: void 0 },
										e = r.c,
										u = r.d,
										a = r.e,
										c = r.f;
									return (t.h = rS(
										o(
											rx,
											function r(n) {
												return o(rx, r, {
													$: 5,
													b: function (r) {
														var i = r.a;
														return 0 === r.$
															? f(u, t, i, n)
															: a && c
																? s(e, t, i.i, i.j, n)
																: f(e, t, a ? i.i : i.j, n);
													}
												});
											},
											r.b
										)
									));
								})(u, n));
						}
						return t;
					})(i, p);
				function p(r, n) {
					var t = o(e, r, b);
					d((b = t.a), n), rF(i, t.b, u(b));
				}
				return rF(i, l.b, u(b)), v ? { ports: v } : {};
			})(n, e, r.dd, r.ee, r.dY, function (n, t) {
				var u = r.eg,
					a = e.node,
					c = (function r(n) {
						if (3 === n.nodeType) return rZ(n.textContent);
						if (1 !== n.nodeType) return rZ('');
						for (var t = q, e = n.attributes, u = e.length; u--; ) {
							var a = e[u];
							t = S(o(r0, a.name, a.value), t);
						}
						var c = n.tagName.toLowerCase(),
							i = q,
							s = n.childNodes;
						for (u = s.length; u--; ) i = S(r(s[u]), i);
						return f(rK, c, t, i);
					})(a);
				return (function (r, n) {
					n(r);
					var t = 0;
					function e() {
						t = 1 === t ? 0 : (nl(e), n(r), 1);
					}
					return function (u, a) {
						(r = u), a ? (n(r), 2 === t && (t = 1)) : (0 === t && nl(e), (t = 2));
					};
				})(t, function (r) {
					var t,
						e,
						i,
						o = u(r),
						f = (nt(c, o, (t = []), 0), t);
					(e = a),
						(i = c),
						(a =
							0 === f.length
								? e
								: ((function r(n, t, e, u) {
										!(function n(t, e, u, a, c, i, o) {
											for (var f = u[a], s = f.r; s === c; ) {
												var l = f.$;
												if (1 === l) r(t, e.k, f.s, o);
												else if (8 === l)
													(f.t = t), (f.u = o), (b = f.s.w).length > 0 && n(t, e, b, 0, c, i, o);
												else if (9 === l) {
													(f.t = t), (f.u = o);
													var b,
														d = f.s;
													d && ((d.A.s = t), (b = d.w).length > 0 && n(t, e, b, 0, c, i, o));
												} else (f.t = t), (f.u = o);
												if (!(f = u[++a]) || (s = f.r) > i) return a;
											}
											var v = e.$;
											if (4 === v) {
												for (var p = e.k; 4 === p.$; ) p = p.k;
												return n(t, p, u, a, c + 1, i, t.elm_event_node_ref);
											}
											for (var g = e.e, h = t.childNodes, m = 0; g.length > m; m++) {
												c++;
												var D = 1 === v ? g[m] : g[m].b,
													$ = c + (D.b || 0);
												if (
													!(
														c > s ||
														s > $ ||
														((f = u[(a = n(h[m], D, u, a, c, $, o))]) && (s = f.r) <= i)
													)
												)
													break;
												c = $;
											}
											return a;
										})(n, t, e, 0, 0, t.b, u);
									})(e, i, f, n),
									(function r(n, t) {
										for (var e = 0; t.length > e; e++) {
											var u = t[e],
												a = u.t,
												c = (function (n, t) {
													switch (t.$) {
														case 0:
															var e, u, a, c;
															return (
																(e = t.s),
																(u = t.u),
																(a = n.parentNode),
																(c = r7(e, u)).elm_event_node_ref ||
																	(c.elm_event_node_ref = n.elm_event_node_ref),
																a && c !== n && a.replaceChild(c, n),
																c
															);
														case 4:
															return nr(n, t.u, t.s), n;
														case 3:
															return n.replaceData(0, n.length, t.s), n;
														case 1:
															return r(n, t.s);
														case 2:
															return (
																n.elm_event_node_ref
																	? (n.elm_event_node_ref.j = t.s)
																	: (n.elm_event_node_ref = { j: t.s, p: t.u }),
																n
															);
														case 6:
															for (var i = t.s, o = 0; i.i > o; o++)
																n.removeChild(n.childNodes[i.v]);
															return n;
														case 7:
															for (
																var f = (i = t.s).e, s = n.childNodes[(o = i.v)];
																f.length > o;
																o++
															)
																n.insertBefore(r7(f[o], t.u), s);
															return n;
														case 9:
															if (!(i = t.s)) return n.parentNode.removeChild(n), n;
															var l = i.A;
															return (
																void 0 !== l.r && n.parentNode.removeChild(n), (l.s = r(n, i.w)), n
															);
														case 8:
															return (function (n, t) {
																var e = t.s,
																	u = (function (r, n) {
																		if (r) {
																			for (
																				var t = rM.createDocumentFragment(), e = 0;
																				r.length > e;
																				e++
																			) {
																				var u = r[e].A;
																				rJ(t, 2 === u.c ? u.s : r7(u.z, n.u));
																			}
																			return t;
																		}
																	})(e.y, t);
																n = r(n, e.w);
																for (var a = e.x, c = 0; a.length > c; c++) {
																	var i = a[c],
																		o = i.A,
																		f = 2 === o.c ? o.s : r7(o.z, t.u);
																	n.insertBefore(f, n.childNodes[i.r]);
																}
																return u && rJ(n, u), n;
															})(n, t);
														case 5:
															return t.s(n);
														default:
															R(10);
													}
												})(a, u);
											a === n && (n = c);
										}
										return n;
									})(e, f))),
						(c = o);
				});
			});
		}),
		nl =
			('undefined' != typeof cancelAnimationFrame && cancelAnimationFrame,
			'undefined' != typeof requestAnimationFrame
				? requestAnimationFrame
				: function (r) {
						return setTimeout(r, 1e3 / 60);
					});
	'undefined' != typeof document && document, 'undefined' != typeof window && window;
	var nb = e(function (r, n, t) {
			return rw(function (e) {
				function u(r) {
					e(n(t.aU.a(r)));
				}
				var a,
					c = new XMLHttpRequest();
				c.addEventListener('error', function () {
					u(t2);
				}),
					c.addEventListener('timeout', function () {
						u(t8);
					}),
					c.addEventListener('load', function () {
						var r;
						u(
							((r = t.aU.b),
							o(
								c.status >= 200 && 300 > c.status ? t0 : tW,
								{
									ef: c.responseURL,
									dT: c.status,
									dU: c.statusText,
									c7: (function (r) {
										if (!r) return t6;
										for (var n = t6, t = r.split('\r\n'), e = t.length; e--; ) {
											var u = t[e],
												a = u.indexOf(': ');
											if (a > 0) {
												var c = u.substring(0, a),
													i = u.substring(a + 2);
												n = f(
													eb,
													c,
													function (r) {
														return nj(t9(r) ? i + ', ' + r.a : i);
													},
													n
												);
											}
										}
										return n;
									})(c.getAllResponseHeaders())
								},
								r(c.response)
							))
						);
					}),
					t9(t.cE) &&
						((a = t.cE.a),
						c.upload.addEventListener('progress', function (n) {
							c.c || rS(o(t7, r, D(a, t5({ dQ: n.loaded, cs: n.total }))));
						}),
						c.addEventListener('progress', function (n) {
							c.c ||
								rS(o(t7, r, D(a, t3({ dH: n.loaded, cs: n.lengthComputable ? nj(n.total) : n_ }))));
						}));
				try {
					c.open(t.dk, t.ef, !0);
				} catch (r) {
					return u(t1(t.ef));
				}
				return (
					(function (r, n) {
						for (var t = n.c7; t.b; t = t.b) r.setRequestHeader(t.a.a, t.a.b);
						(r.timeout = n.d7.a || 0), (r.responseType = n.aU.d), (r.withCredentials = n.cP);
					})(c, t),
					t.cS.a && c.setRequestHeader('Content-Type', t.cS.a),
					c.send(t.cS.b),
					function () {
						(c.c = !0), c.abort();
					}
				);
			});
		}),
		nd = e(function (r, n, t) {
			return { $: 0, d: r, b: n, a: t };
		}),
		nv = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		np = a(function (r, n, t, e, u) {
			for (var a = r.length, c = u.length >= n + a, i = 0; c && a > i; ) {
				var o = u.charCodeAt(n);
				c =
					r[i++] === u[n++] &&
					(10 === o ? (t++, (e = 1)) : (e++, 55296 == (63488 & o) ? r[i++] === u[n++] : 1));
			}
			return $(c ? n : -1, t, e);
		}),
		ng = e(function (r, n, t) {
			return t.length > n
				? 55296 == (63488 & t.charCodeAt(n))
					? r(t.substr(n, 2))
						? n + 2
						: -1
					: r(t[n])
						? '\n' === t[n]
							? -2
							: n + 1
						: -1
				: -1;
		}),
		nh = e(function (r, n, t) {
			return t.charCodeAt(n) === r;
		}),
		nm = t(function (r, n) {
			for (; n.length > r; r++) {
				var t = n.charCodeAt(r);
				if (48 > t || t > 57) break;
			}
			return r;
		}),
		nD = e(function (r, n, t) {
			for (var e = 0; t.length > n; n++) {
				var u = t.charCodeAt(n) - 48;
				if (0 > u || u >= r) break;
				e = r * e + u;
			}
			return D(n, e);
		}),
		n$ = t(function (r, n) {
			for (var t = 0; n.length > r; r++) {
				var e = n.charCodeAt(r);
				if (48 > e || e > 57) {
					if (65 > e || e > 70) {
						if (97 > e || e > 102) break;
						t = 16 * t + e - 87;
					} else t = 16 * t + e - 55;
				} else t = 16 * t + e - 48;
			}
			return D(r, t);
		}),
		nw = a(function (r, n, t, e, u) {
			for (var a = u.indexOf(r, n), c = 0 > a ? u.length : a + r.length; c > n; ) {
				var i = u.charCodeAt(n++);
				10 === i ? ((e = 1), t++) : (e++, 55296 == (63488 & i) && n++);
			}
			return $(a, t, e);
		}),
		nx = t(function (r, n) {
			return rw(function () {
				var t = setInterval(function () {
					rS(n);
				}, r);
				return function () {
					clearInterval(t);
				};
			});
		}),
		ny = t(function (r, n) {
			var t = 'g';
			r.dn && (t += 'm'), r.cU && (t += 'i');
			try {
				return nj(RegExp(n, t));
			} catch (r) {
				return n_;
			}
		}),
		nq = t(function (r, n) {
			return null !== n.match(r);
		}),
		nS = e(function (r, n, t) {
			for (
				var e, u = [], a = 0, c = n.lastIndex, i = -1;
				a++ < r && (e = n.exec(t)) && i != n.lastIndex;

			) {
				for (var o = e.length - 1, f = Array(o); o > 0; ) {
					var l = e[o];
					f[--o] = l ? nj(l) : n_;
				}
				u.push(s(oB, e[0], e.index, a, k(f))), (i = n.lastIndex);
			}
			return (n.lastIndex = c), k(u);
		}),
		nA = u(function (r, n, t, e) {
			var u = 0;
			return e.replace(n, function (n) {
				if (u++ >= r) return n;
				for (var e = arguments.length - 3, a = Array(e); e > 0; ) {
					var c = arguments[e];
					a[--e] = c ? nj(c) : n_;
				}
				return t(s(oB, n, arguments[arguments.length - 2], u, k(a)));
			});
		}),
		nk = 1 / 0,
		nE = 1,
		nC = 2,
		nL = 0,
		nN = e(function (r, n, t) {
			for (;;) {
				if (-2 === t.$) return n;
				var e = t.d,
					u = r,
					a = f(r, t.b, t.c, f(nN, r, n, t.e));
				(r = u), (n = a), (t = e);
			}
		}),
		nT = function (r) {
			return f(
				nN,
				e(function (r, n, t) {
					return o(A, D(r, n), t);
				}),
				q,
				r
			);
		},
		nR = function (r) {
			return { $: 1, a: r };
		},
		nO = t(function (r, n) {
			return { $: 3, a: r, b: n };
		}),
		nU = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		nH = t(function (r, n) {
			return { $: 1, a: r, b: n };
		}),
		nB = function (r) {
			return { $: 0, a: r };
		},
		nI = function (r) {
			return { $: 2, a: r };
		},
		nj = function (r) {
			return { $: 0, a: r };
		},
		n_ = { $: 1 },
		nV = function (r) {
			return r + '';
		},
		nF = t(function (r, n) {
			return o(z, r, E(n));
		}),
		nz = t(function (r, n) {
			return k(o(F, r, n));
		}),
		nP = function (r) {
			return o(nF, '\n    ', o(nz, '\n', r));
		},
		nG = e(function (r, n, t) {
			for (;;) {
				if (!t.b) return n;
				var e = t.b,
					u = r,
					a = o(r, t.a, n);
				(r = u), (n = a), (t = e);
			}
		}),
		nM = function (r) {
			return f(
				nG,
				t(function (r, n) {
					return n + 1;
				}),
				0,
				r
			);
		},
		nJ = e(function (r, n, t) {
			for (;;) {
				if (h(r, n) >= 1) return t;
				var e = r,
					u = n - 1,
					a = o(A, n, t);
				(r = e), (n = u), (t = a);
			}
		}),
		nZ = t(function (r, n) {
			return f(nJ, r, n, q);
		}),
		nQ = t(function (r, n) {
			return f(C, r, o(nZ, 0, nM(n) - 1), n);
		}),
		nK = function (r) {
			var n = r.charCodeAt(0);
			return 55296 > n || n > 56319 ? n : 1024 * (n - 55296) + r.charCodeAt(1) - 56320 + 65536;
		},
		nY = function (r) {
			var n = nK(r);
			return n >= 97 && 122 >= n;
		},
		nX = function (r) {
			var n = nK(r);
			return 90 >= n && n >= 65;
		},
		nW = function (r) {
			return nY(r) || nX(r);
		},
		n1 = function (r) {
			var n = nK(r);
			return 57 >= n && n >= 48;
		},
		n0 = function (r) {
			return nY(r) || nX(r) || n1(r);
		},
		n2 = function (r) {
			return f(nG, A, q, r);
		},
		n3 = t(function (r, n) {
			return '\n\n(' + nV(r + 1) + ') ' + nP(n5(n));
		}),
		n5 = function (r) {
			return o(n8, r, q);
		},
		n8 = t(function (r, n) {
			for (;;)
				switch (r.$) {
					case 0:
						var t = r.a,
							e = r.b,
							u = (function () {
								var r,
									n = isNaN((r = t.charCodeAt(0)))
										? n_
										: nj(55296 > r || r > 56319 ? D(t[0], t.slice(1)) : D(t[0] + t[1], t.slice(2)));
								if (1 === n.$) return !1;
								var e = n.a,
									u = e.b;
								return nW(e.a) && o(G, n0, u);
							})();
						(r = e), (n = o(A, u ? '.' + t : "['" + t + "']", n));
						continue;
					case 1:
						e = r.b;
						var a = '[' + nV(r.a) + ']';
						(r = e), (n = o(A, a, n));
						continue;
					case 2:
						var c = r.a;
						if (c.b) {
							if (c.b.b) {
								var i =
									(n.b ? 'The Json.Decode.oneOf at json' + o(nF, '', n2(n)) : 'Json.Decode.oneOf') +
									' failed in the following ' +
									nV(nM(c)) +
									' ways:';
								return o(nF, '\n\n', o(A, i, o(nQ, n3, c)));
							}
							r = e = c.a;
							continue;
						}
						return (
							'Ran into a Json.Decode.oneOf with no possibilities' +
							(n.b ? ' at json' + o(nF, '', n2(n)) : '!')
						);
					default:
						var f = r.a,
							s = r.b;
						return (
							(i = n.b
								? 'Problem with the value at json' + o(nF, '', n2(n)) + ':\n\n    '
								: 'Problem with the given value:\n\n') +
							nP(o(rm, 4, s)) +
							'\n\n' +
							f
						);
				}
		}),
		n4 = u(function (r, n, t, e) {
			return { $: 0, a: r, b: n, c: t, d: e };
		}),
		n6 = [],
		n9 = Math.ceil,
		n7 = t(function (r, n) {
			return I(n) / I(r);
		}),
		tr = n9(o(n7, 2, 32)),
		tn = s(n4, 0, tr, n6, n6),
		tt = t(function (r, n) {
			return r(n);
		}),
		te = t(function (r, n) {
			return n(r);
		}),
		tu = Math.floor,
		ta = function (r) {
			return r.length;
		},
		tc = t(function (r, n) {
			return h(r, n) > 0 ? r : n;
		}),
		ti = t(function (r, n) {
			for (;;) {
				var t = o(T, 32, r),
					e = t.b,
					u = o(A, { $: 0, a: t.a }, n);
				if (!e.b) return n2(u);
				(r = e), (n = u);
			}
		}),
		to = function (r) {
			return r.a;
		},
		tf = t(function (r, n) {
			for (;;) {
				var t = n9(n / 32);
				if (1 === t) return o(T, 32, r).a;
				(r = o(ti, r, q)), (n = t);
			}
		}),
		ts = t(function (r, n) {
			if (n.h) {
				var t = 32 * n.h,
					e = tu(o(n7, 32, t - 1)),
					u = o(tf, r ? n2(n.k) : n.k, n.h);
				return s(n4, ta(n.i) + t, o(tc, 5, e * tr), u, n.i);
			}
			return s(n4, ta(n.i), tr, n6, n.i);
		}),
		tl = a(function (r, n, t, e, u) {
			for (;;) {
				if (0 > n) return o(ts, !1, { k: e, h: (t / 32) | 0, i: u });
				var a = { $: 1, a: f(N, 32, n, r) };
				(n -= 32), (e = o(A, a, e));
			}
		}),
		tb = t(function (r, n) {
			if (r > 0) {
				var t = r % 32;
				return l(tl, n, r - t - 32, r, q, f(N, t, r - t, n));
			}
			return tn;
		}),
		td = function (r) {
			return !r.$;
		},
		tv = ru,
		tp = ra,
		tg = function (r) {
			return { $: 0, a: r };
		},
		th = function (r) {
			switch (r.$) {
				case 0:
					return 0;
				case 1:
					return 1;
				case 2:
					return 2;
				default:
					return 3;
			}
		},
		tm = function (r) {
			return r;
		},
		tD = function (r) {
			return r.length;
		},
		t$ = t(function (r, n) {
			return 1 > r ? n : f(P, r, tD(n), n);
		}),
		tw = function (r) {
			return '' === r;
		},
		tx = t(function (r, n) {
			return 1 > r ? '' : f(P, 0, r, n);
		}),
		ty = function (r) {
			for (
				var n = 0, t = r.charCodeAt(0), e = 43 == t || 45 == t ? 1 : 0, u = e;
				r.length > u;
				++u
			) {
				var a = r.charCodeAt(u);
				if (48 > a || a > 57) return n_;
				n = 10 * n + a - 48;
			}
			return u == e ? n_ : nj(45 == t ? -n : n);
		},
		tq = function () {
			for (;;);
		},
		tS = r$(0),
		tA = u(function (r, n, t, e) {
			if (e.b) {
				var u = e.a,
					a = e.b;
				if (a.b) {
					var c = a.a,
						i = a.b;
					if (i.b) {
						var l = i.a,
							b = i.b;
						if (b.b) {
							var d = b.b;
							return o(
								r,
								u,
								o(r, c, o(r, l, o(r, b.a, t > 500 ? f(nG, r, n, n2(d)) : s(tA, r, n, t + 1, d))))
							);
						}
						return o(r, u, o(r, c, o(r, l, n)));
					}
					return o(r, u, o(r, c, n));
				}
				return o(r, u, n);
			}
			return n;
		}),
		tk = e(function (r, n, t) {
			return s(tA, r, n, 0, t);
		}),
		tE = t(function (r, n) {
			return f(
				tk,
				t(function (n, t) {
					return o(A, r(n), t);
				}),
				q,
				n
			);
		}),
		tC = t(function (r, n) {
			return o(
				rx,
				function (n) {
					return r$(r(n));
				},
				n
			);
		}),
		tL = e(function (r, n, t) {
			return o(
				rx,
				function (n) {
					return o(
						rx,
						function (t) {
							return r$(o(r, n, t));
						},
						t
					);
				},
				n
			);
		}),
		tN = function (r) {
			return f(tk, tL(A), r$(q), r);
		},
		tT = t(function (r, n) {
			return rA(o(rx, rU(r), n));
		});
	rR.Task = rO(
		tS,
		e(function (r, n) {
			return o(
				tC,
				function () {
					return 0;
				},
				tN(o(tE, tT(r), n))
			);
		}),
		e(function () {
			return r$(0);
		}),
		t(function (r, n) {
			return o(tC, r, n);
		})
	);
	var tR,
		tO = rB('Task'),
		tU = t(function (r, n) {
			return tO(o(tC, r, n));
		}),
		tH = function (r) {
			return { $: 1, a: r };
		},
		tB = function (r) {
			return { $: 6, a: r };
		},
		tI = function (r) {
			return { $: 0, a: r };
		},
		tj = e(function (r, n, t) {
			return r(n(t));
		}),
		t_ = t(function (r, n) {
			return tO(o(ry, o(tj, o(tj, r$, r), nR), o(rx, o(tj, o(tj, r$, r), nB), n)));
		}),
		tV = function (r) {
			return { $: 1, a: r };
		},
		tF = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		tz = function (r) {
			return { $: 11, g: r };
		},
		tP = t(function (r, n) {
			return D(r, n);
		}),
		tG = o(
			re,
			function (r) {
				var n = r.a,
					t = r.b;
				return 'M_LIMIT_EXCEEDED' === n
					? tz(k([o(tv, tV, o(rn, 'retry_after_ms', K)), tg(o(tF, n, t))]))
					: tg(o(tF, n, t));
			},
			f(tp, tP, o(rn, 'errcode', rr), o(rn, 'error', rr))
		),
		tM = t(function (r, n) {
			return n.$ ? r : n.a;
		}),
		tJ = t(function (r, n) {
			switch (n.$) {
				case 0:
					return nR(o(tF, 'Bad url', n.a));
				case 1:
				case 2:
					return nR(tV(30));
				case 3:
					return nR(o(tM, o(tF, 'Could not decode error', (t = n.b)), o(rf, tG, t)));
				default:
					var t,
						e = o(rf, r, (t = n.b));
					return 1 === e.$ ? nR(o(tF, 'Could not decode response', t)) : nB(e.a);
			}
		}),
		tZ = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		tQ = t(function (r, n) {
			return n.$ ? n_ : nj(r(n.a));
		}),
		tK = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		tY = function (r) {
			return { $: 1, a: r };
		},
		tX = t(function (r, n) {
			return n.$
				? o(
						rx,
						function () {
							return o(ry, tX(r), r);
						},
						rT(n.a)
					)
				: tY(o(tK, n.a, n.b));
		}),
		tW = t(function (r, n) {
			return { $: 3, a: r, b: n };
		}),
		t1 = function (r) {
			return { $: 0, a: r };
		},
		t0 = t(function (r, n) {
			return { $: 4, a: r, b: n };
		}),
		t2 = { $: 2 },
		t3 = function (r) {
			return { $: 1, a: r };
		},
		t5 = function (r) {
			return { $: 0, a: r };
		},
		t8 = { $: 1 },
		t4 = { $: -2 },
		t6 = t4,
		t9 = function (r) {
			return !r.$;
		},
		t7 = rH,
		er = t(function (r, n) {
			for (;;) {
				if (-2 === n.$) return n_;
				var t = n.c,
					e = n.d,
					u = n.e;
				switch (o(m, r, n.b)) {
					case 0:
						n = e;
						continue;
					case 1:
						return nj(t);
					default:
						n = u;
						continue;
				}
			}
		}),
		en = a(function (r, n, t, e, u) {
			return { $: -1, a: r, b: n, c: t, d: e, e: u };
		}),
		et = a(function (r, n, t, e, u) {
			if (-1 !== u.$ || u.a) {
				if (-1 !== e.$ || e.a || -1 !== e.d.$ || e.d.a) return l(en, r, n, t, e, u);
				var a = e.d;
				return (c = e.e), l(en, 0, e.b, e.c, l(en, 1, a.b, a.c, a.d, a.e), l(en, 1, n, t, c, u));
			}
			var c,
				i = u.b,
				o = u.c,
				f = u.d,
				s = u.e;
			return -1 !== e.$ || e.a
				? l(en, r, i, o, l(en, 0, n, t, e, f), s)
				: l(en, 0, n, t, l(en, 1, e.b, e.c, e.d, (c = e.e)), l(en, 1, i, o, f, s));
		}),
		ee = e(function (r, n, t) {
			if (-2 === t.$) return l(en, 0, r, n, t4, t4);
			var e = t.a,
				u = t.b,
				a = t.c,
				c = t.d,
				i = t.e;
			switch (o(m, r, u)) {
				case 0:
					return l(et, e, u, a, f(ee, r, n, c), i);
				case 1:
					return l(en, e, u, n, c, i);
				default:
					return l(et, e, u, a, c, f(ee, r, n, i));
			}
		}),
		eu = e(function (r, n, t) {
			var e = f(ee, r, n, t);
			return -1 !== e.$ || e.a ? e : l(en, 1, e.b, e.c, e.d, e.e);
		}),
		ea = function (r) {
			if (-1 === r.$ && -1 === r.d.$ && -1 === r.e.$) {
				if (-1 !== r.e.d.$ || r.e.d.a) {
					var n = r.d,
						t = r.e;
					return (
						(c = t.b),
						(i = t.c),
						(e = t.d),
						(s = t.e),
						l(en, 1, r.b, r.c, l(en, 0, n.b, n.c, n.d, n.e), l(en, 0, c, i, e, s))
					);
				}
				var e,
					u = r.d,
					a = r.e,
					c = a.b,
					i = a.c,
					o = (e = a.d).d,
					f = e.e,
					s = a.e;
				return l(
					en,
					0,
					e.b,
					e.c,
					l(en, 1, r.b, r.c, l(en, 0, u.b, u.c, u.d, u.e), o),
					l(en, 1, c, i, f, s)
				);
			}
			return r;
		},
		ec = function (r) {
			if (-1 === r.$ && -1 === r.d.$ && -1 === r.e.$) {
				if (-1 !== r.d.d.$ || r.d.d.a) {
					var n = r.d,
						t = r.e;
					return (
						(f = t.b),
						(s = t.c),
						(b = t.d),
						(d = t.e),
						l(en, 1, (e = r.b), (u = r.c), l(en, 0, n.b, n.c, n.d, (i = n.e)), l(en, 0, f, s, b, d))
					);
				}
				var e = r.b,
					u = r.c,
					a = r.d,
					c = a.d,
					i = a.e,
					o = r.e,
					f = o.b,
					s = o.c,
					b = o.d,
					d = o.e;
				return l(
					en,
					0,
					a.b,
					a.c,
					l(en, 1, c.b, c.c, c.d, c.e),
					l(en, 1, e, u, i, l(en, 0, f, s, b, d))
				);
			}
			return r;
		},
		ei = i(function (r, n, t, e, u, a, c) {
			if (-1 !== a.$ || a.a) {
				for (;;) {
					if (-1 === c.$ && 1 === c.a) {
						if (-1 === c.d.$) {
							if (1 === c.d.a) return ec(n);
							break;
						}
						return ec(n);
					}
					break;
				}
				return n;
			}
			return l(en, t, a.b, a.c, a.d, l(en, 0, e, u, a.e, c));
		}),
		eo = function (r) {
			if (-1 === r.$ && -1 === r.d.$) {
				var n = r.a,
					t = r.b,
					e = r.c,
					u = r.d,
					a = u.d,
					c = r.e;
				if (1 === u.a && (-1 !== a.$ || a.a)) {
					var i = ea(r);
					if (-1 === i.$) {
						var o = i.e;
						return l(et, i.a, i.b, i.c, eo(i.d), o);
					}
					return t4;
				}
				return l(en, n, t, e, eo(u), c);
			}
			return t4;
		},
		ef = t(function (r, n) {
			if (-2 === n.$) return t4;
			var t = n.a,
				e = n.b,
				u = n.c,
				a = n.d,
				c = n.e;
			if (0 > h(r, e)) {
				if (-1 === a.$ && 1 === a.a) {
					var i = a.d;
					if (-1 !== i.$ || i.a) {
						var f = ea(n);
						if (-1 === f.$) {
							var s = f.e;
							return l(et, f.a, f.b, f.c, o(ef, r, f.d), s);
						}
						return t4;
					}
				}
				return l(en, t, e, u, o(ef, r, a), c);
			}
			return o(es, r, d(ei, r, n, t, e, u, a, c));
		}),
		es = t(function (r, n) {
			if (-1 === n.$) {
				var t = n.a,
					e = n.b,
					u = n.c,
					a = n.d,
					c = n.e;
				if (v(r, e)) {
					var i = (function (r) {
						for (;;) {
							if (-1 !== r.$ || -1 !== r.d.$) return r;
							r = r.d;
						}
					})(c);
					return -1 === i.$ ? l(et, t, i.b, i.c, a, eo(c)) : t4;
				}
				return l(et, t, e, u, a, o(ef, r, c));
			}
			return t4;
		}),
		el = t(function (r, n) {
			var t = o(ef, r, n);
			return -1 !== t.$ || t.a ? t : l(en, 1, t.b, t.c, t.d, t.e);
		}),
		eb = e(function (r, n, t) {
			var e = n(o(er, r, t));
			return e.$ ? o(el, r, t) : f(eu, r, e.a, t);
		}),
		ed = o(nd, '', tm),
		ev = function (r) {
			return r.$ ? tY(r.a) : r$(r.a);
		},
		ep = function (r) {
			return f(nb, 0, ev, {
				cP: !1,
				cS: r.cS,
				aU: r.dK,
				c7: r.c7,
				dk: r.dk,
				d7: r.d7,
				cE: n_,
				ef: r.ef
			});
		},
		eg = t(function (r, n) {
			return n.$ ? r : n.a;
		}),
		eh = function (r) {
			var n = r.dk,
				t = r.ef,
				e = r.dL,
				u = ep({
					cS: r.cS,
					c7: o(
						eg,
						q,
						o(
							tQ,
							function (r) {
								return k([o(tZ, 'Authorization', 'Bearer ' + r)]);
							},
							r.U
						)
					),
					dk: n,
					dK: ed(tJ(e)),
					d7: n_,
					ef: t
				});
			return o(ry, tX(u), u);
		},
		em = function (r) {
			return r.a + '=' + r.b;
		},
		eD = e(function (r, n, t) {
			return r + '/' + o(nF, '/', n) + (t.b ? '?' + o(nF, '&', o(tE, em, t)) : '');
		}),
		e$ = function (r) {
			return encodeURIComponent(r);
		},
		ew = u(function (r, n, t, e) {
			return f(eD, n, o(tE, e$, y(r, t)), e);
		}),
		ex = ew(k(['_matrix', 'client', 'r0'])),
		ey = t(function (r, n) {
			var t = n.dk,
				e = n.dE,
				u = n.dD,
				a = n.cS,
				c = n.dL;
			return eh({ U: nj(r.U), cS: a, dk: t, dL: c, ef: f(ex, r.bQ, e, u) });
		}),
		eq = t(function (r, n) {
			return { $: 1, a: r, b: n };
		}),
		eS = e(function (r, n, t) {
			return n(r(t));
		}),
		eA = function (r) {
			return { $: 1, a: r };
		},
		ek = o(
			re,
			function (r) {
				switch (r) {
					case 'invite':
						return tg(0);
					case 'join':
						return tg(1);
					case 'leave':
						return tg(2);
					case 'ban':
						return tg(3);
					case 'knock':
						return tg(4);
					default:
						return eA('Invalid membership field: ' + r);
				}
			},
			rr
		),
		eE = function (r) {
			return tz(k([o(tv, nj, r), tg(n_)]));
		},
		eC = s(
			rc,
			e(function (r, n, t) {
				return { bt: t, bF: n, b0: r };
			}),
			o(rn, 'membership', ek),
			eE(o(rn, 'displayname', rr)),
			eE(o(rn, 'avatar_url', rr))
		),
		eL = function (r) {
			return { $: 6, a: r };
		},
		eN = function (r) {
			return { $: 1, a: r };
		},
		eT = function (r) {
			return { $: 4, a: r };
		},
		eR = function (r) {
			return { $: 3, a: r };
		},
		eO = function (r) {
			return { $: 2, a: r };
		},
		eU = function (r) {
			return { $: 0, a: r };
		},
		eH = function (r) {
			return { $: 5, a: r };
		},
		eB = f(
			tp,
			t(function (r, n) {
				return { cS: r, ef: n };
			}),
			o(rn, 'body', rr),
			o(rn, 'url', rr)
		),
		eI = f(
			tp,
			t(function (r, n) {
				return { cS: r, ef: n };
			}),
			o(rn, 'body', rr),
			o(rn, 'url', rr)
		),
		ej = o(
			tv,
			function (r) {
				return { $: 0, a: r };
			},
			o(rn, 'body', rr)
		),
		e_ = e(function (r, n, t) {
			return { $: 1, a: r, b: n, c: t };
		}),
		eV = t(function (r, n) {
			return { $: 1, a: r, b: n };
		}),
		eF = e(function (r, n, t) {
			return { $: 0, a: r, b: n, c: t };
		}),
		ez = t(function (r, n) {
			return function (t) {
				var e = n(t);
				if (1 === e.$) return o(eV, e.a, e.b);
				var u = e.a,
					a = e.c,
					c = r(e.b)(a);
				if (1 === c.$) {
					var i = c.a;
					return o(eV, u || i, c.b);
				}
				return (i = c.a), f(eF, u || i, c.b, c.c);
			};
		}),
		eP = function (r) {
			return function (n) {
				var t = r(n);
				return 1 === t.$ ? o(eV, !1, t.b) : f(eF, !1, t.b, t.c);
			};
		},
		eG = { $: 11 },
		eM = t(function (r, n) {
			return { $: 1, a: r, b: n };
		}),
		eJ = u(function (r, n, t, e) {
			return { by: n, cZ: e, dF: t, dO: r };
		}),
		eZ = { $: 0 },
		eQ = t(function (r, n) {
			return o(eM, eZ, s(eJ, r.dO, r.by, n, r.d));
		}),
		eK = function (r) {
			return -r;
		},
		eY = t(function (r, n) {
			return function (t) {
				var e = f(ng, r, t.b, t.cv);
				return v(e, -1)
					? o(eV, !1, o(eQ, t, n))
					: v(e, -2)
						? f(eF, !0, 0, { by: 1, d: t.d, e: t.e, b: t.b + 1, dO: t.dO + 1, cv: t.cv })
						: f(eF, !0, 0, { by: t.by + 1, d: t.d, e: t.e, b: e, dO: t.dO, cv: t.cv });
			};
		}),
		eX = function (r) {
			return o(eY, r, eG);
		},
		eW = a(function (r, n, t, e, u) {
			for (;;) {
				var a = f(ng, r, n, u.cv);
				if (v(a, -1))
					return f(eF, 0 > h(u.b, n), 0, { by: e, d: u.d, e: u.e, b: n, dO: t, cv: u.cv });
				v(a, -2) ? ((n += 1), (t += 1), (e = 1)) : ((n = a), (e += 1));
			}
		}),
		e1 = function (r) {
			return function (n) {
				return l(eW, r, n.b, n.dO, n.by, n);
			};
		},
		e0 = t(function (r) {
			return r;
		}),
		e2 = e(function (r, n, t) {
			return function (e) {
				var u = n(e);
				if (1 === u.$) return o(eV, u.a, u.b);
				var a = u.a,
					c = u.b,
					i = t(u.c);
				if (1 === i.$) {
					var s = i.a;
					return o(eV, a || s, i.b);
				}
				s = i.a;
				var l = i.c;
				return f(eF, a || s, o(r, c, i.b), l);
			};
		}),
		e3 = t(function (r, n) {
			return f(e2, e0, r, n);
		}),
		e5 = function (r) {
			return o(e3, eX(r), e1(r));
		},
		e8 = t(function (r, n) {
			return function (t) {
				var e = n(t);
				if (1 === e.$) return o(eV, e.a, e.b);
				var u = e.b,
					a = e.c;
				return f(eF, e.a, o(r, f(P, t.b, a.b, t.cv), u), a);
			};
		}),
		e4 = function (r) {
			return o(e8, e0, r);
		},
		e6 = function (r) {
			return ' ' === r || '	' === r || '\n' === r || '\r' === r || '\f' === r || '\xa0' === r;
		},
		e9 = function (r) {
			return !r;
		},
		e7 = function (r) {
			return { $: 12, a: r };
		},
		ur = function (r) {
			return function (n) {
				return o(eV, !1, o(eQ, n, r));
			};
		},
		un = function (r) {
			return ur(e7(r));
		},
		ut = function (r) {
			return function (n) {
				return f(eF, !1, r, n);
			};
		},
		ue = function (r) {
			return r.toLowerCase();
		},
		uu = function (r) {
			var n = o(
				ez,
				function (n) {
					return v(ue(n), r) ? ut(0) : un('closing tag does not match opening tag: ' + r);
				},
				e4(
					e5(function (r) {
						return !e6(r) && '>' !== r;
					})
				)
			);
			return o(e3, o(e3, o(e3, o(e3, eX(g('<')), eX(g('/'))), n), e1(e6)), eX(g('>')));
		},
		ua = function (r) {
			return { $: 2, a: r };
		},
		uc = u(function (r, n, t, e) {
			return o(eM, eZ, s(eJ, r, n, t, e));
		}),
		ui = function (r) {
			var n = r.a,
				t = r.b;
			return function (r) {
				var e = l(nw, n, r.b, r.dO, r.by, r.cv),
					u = e.a,
					a = e.b,
					c = e.c;
				return v(u, -1)
					? o(eV, !1, s(uc, a, c, t, r.d))
					: f(eF, 0 > h(r.b, u), 0, { by: c, d: r.d, e: r.e, b: u, dO: a, cv: r.cv });
			};
		},
		uo = function (r) {
			return { $: 0, a: r };
		},
		uf = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		us = function (r) {
			return o(uf, r, uo(r));
		},
		ul = t(function (r, n) {
			return f(e2, tt, r, n);
		}),
		ub = function (r) {
			var n = r.a,
				t = r.b,
				e = !tw(n);
			return function (r) {
				var u = l(np, n, r.b, r.dO, r.by, r.cv),
					a = u.a,
					c = u.b,
					i = u.c;
				return v(a, -1)
					? o(eV, !1, o(eQ, r, t))
					: f(eF, e, 0, { by: i, d: r.d, e: r.e, b: a, dO: c, cv: r.cv });
			};
		},
		ud = function (r) {
			return ub(us(r));
		},
		uv = o(ul, o(e3, o(e3, ut(tm), ud('<!')), ud('--')), o(e3, e4(ui(us('-->'))), ud('-->'))),
		up = t(function (r, n) {
			return function (t) {
				var e = n(t);
				if (e.$) return o(eV, e.a, e.b);
				var u = e.c;
				return f(eF, e.a, r(e.b), u);
			};
		}),
		ug = o(up, ua, uv),
		uh = t(function (r, n) {
			for (;;) {
				if (!n.b) return !1;
				var t = n.b;
				if (r(n.a)) return !0;
				n = t;
			}
		}),
		um = t(function (r, n) {
			return o(
				uh,
				function (n) {
					return v(n, r);
				},
				n
			);
		}),
		uD = k([
			'area',
			'base',
			'br',
			'col',
			'embed',
			'hr',
			'img',
			'input',
			'link',
			'meta',
			'param',
			'source',
			'track',
			'wbr'
		]),
		u$ = function (r) {
			return { $: 1, a: r };
		},
		uw = function (r) {
			return { $: 0, a: r };
		},
		ux = u(function (r, n, t, e) {
			for (;;) {
				var u = t(n)(e);
				if (u.$) return (a = u.a), o(eV, r || a, u.b);
				var a = u.a,
					c = u.b,
					i = u.c;
				if (c.$) return f(eF, r || a, c.a, i);
				(r = r || a), (n = c.a), (e = i);
			}
		}),
		uy = t(function (r, n) {
			return function (t) {
				return s(ux, !1, r, n, t);
			};
		}),
		uq = function (r) {
			return { $: 1, a: r };
		},
		uS = function (r) {
			return { $: 0, a: r };
		},
		uA = function (r) {
			return r.$ ? uq(r.a) : uS(r.a);
		},
		uk = t(function (r, n) {
			return o(uy, r, function (r) {
				return o(up, uA, n(r));
			});
		}),
		uE = t(function (r, n) {
			return { $: 2, a: r, b: n };
		}),
		uC = e(function (r, n, t) {
			for (;;) {
				if (t.b) {
					var e = t.b,
						u = (0, t.a)(r);
					if (u.$) {
						if (u.a) return u;
						(n = o(uE, n, u.b)), (t = e);
						continue;
					}
					return u;
				}
				return o(eV, !1, n);
			}
		}),
		uL = function (r) {
			return function (n) {
				return f(uC, n, eZ, r);
			};
		},
		uN = function (r) {
			return o(uk, q, function (n) {
				return uL(
					k([
						o(
							up,
							function (r) {
								return uw(o(A, r, n));
							},
							r
						),
						ut(u$(n2(n)))
					])
				);
			});
		},
		uT = o(
			up,
			ue,
			e4(
				e5(function (r) {
					return !e6(r) && '"' !== r && "'" !== r && '>' !== r && '/' !== r && '=' !== r;
				})
			)
		),
		uR = eX(g(';')),
		uO = function (r) {
			return f(
				nG,
				t(function (r, n) {
					return f(eu, r.a, r.b, n);
				}),
				t6,
				r
			);
		},
		uU = uO(
			k([
				D('Aacute', '\xc1'),
				D('aacute', '\xe1'),
				D('Abreve', 'Ă'),
				D('abreve', 'ă'),
				D('ac', '∾'),
				D('acd', '∿'),
				D('acE', '∾̳'),
				D('Acirc', '\xc2'),
				D('acirc', '\xe2'),
				D('acute', '\xb4'),
				D('Acy', 'А'),
				D('acy', 'а'),
				D('AElig', '\xc6'),
				D('aelig', '\xe6'),
				D('af', '⁡'),
				D('Afr', '\uD835\uDD04'),
				D('afr', '\uD835\uDD1E'),
				D('Agrave', '\xc0'),
				D('agrave', '\xe0'),
				D('alefsym', 'ℵ'),
				D('aleph', 'ℵ'),
				D('Alpha', 'Α'),
				D('alpha', 'α'),
				D('Amacr', 'Ā'),
				D('amacr', 'ā'),
				D('amalg', '⨿'),
				D('amp', '&'),
				D('AMP', '&'),
				D('andand', '⩕'),
				D('And', '⩓'),
				D('and', '∧'),
				D('andd', '⩜'),
				D('andslope', '⩘'),
				D('andv', '⩚'),
				D('ang', '∠'),
				D('ange', '⦤'),
				D('angle', '∠'),
				D('angmsdaa', '⦨'),
				D('angmsdab', '⦩'),
				D('angmsdac', '⦪'),
				D('angmsdad', '⦫'),
				D('angmsdae', '⦬'),
				D('angmsdaf', '⦭'),
				D('angmsdag', '⦮'),
				D('angmsdah', '⦯'),
				D('angmsd', '∡'),
				D('angrt', '∟'),
				D('angrtvb', '⊾'),
				D('angrtvbd', '⦝'),
				D('angsph', '∢'),
				D('angst', '\xc5'),
				D('angzarr', '⍼'),
				D('Aogon', 'Ą'),
				D('aogon', 'ą'),
				D('Aopf', '\uD835\uDD38'),
				D('aopf', '\uD835\uDD52'),
				D('apacir', '⩯'),
				D('ap', '≈'),
				D('apE', '⩰'),
				D('ape', '≊'),
				D('apid', '≋'),
				D('apos', "'"),
				D('ApplyFunction', '⁡'),
				D('approx', '≈'),
				D('approxeq', '≊'),
				D('Aring', '\xc5'),
				D('aring', '\xe5'),
				D('Ascr', '\uD835\uDC9C'),
				D('ascr', '\uD835\uDCB6'),
				D('Assign', '≔'),
				D('ast', '*'),
				D('asymp', '≈'),
				D('asympeq', '≍'),
				D('Atilde', '\xc3'),
				D('atilde', '\xe3'),
				D('Auml', '\xc4'),
				D('auml', '\xe4'),
				D('awconint', '∳'),
				D('awint', '⨑'),
				D('backcong', '≌'),
				D('backepsilon', '϶'),
				D('backprime', '‵'),
				D('backsim', '∽'),
				D('backsimeq', '⋍'),
				D('Backslash', '∖'),
				D('Barv', '⫧'),
				D('barvee', '⊽'),
				D('barwed', '⌅'),
				D('Barwed', '⌆'),
				D('barwedge', '⌅'),
				D('bbrk', '⎵'),
				D('bbrktbrk', '⎶'),
				D('bcong', '≌'),
				D('Bcy', 'Б'),
				D('bcy', 'б'),
				D('bdquo', '„'),
				D('becaus', '∵'),
				D('because', '∵'),
				D('Because', '∵'),
				D('bemptyv', '⦰'),
				D('bepsi', '϶'),
				D('bernou', 'ℬ'),
				D('Bernoullis', 'ℬ'),
				D('Beta', 'Β'),
				D('beta', 'β'),
				D('beth', 'ℶ'),
				D('between', '≬'),
				D('Bfr', '\uD835\uDD05'),
				D('bfr', '\uD835\uDD1F'),
				D('bigcap', '⋂'),
				D('bigcirc', '◯'),
				D('bigcup', '⋃'),
				D('bigodot', '⨀'),
				D('bigoplus', '⨁'),
				D('bigotimes', '⨂'),
				D('bigsqcup', '⨆'),
				D('bigstar', '★'),
				D('bigtriangledown', '▽'),
				D('bigtriangleup', '△'),
				D('biguplus', '⨄'),
				D('bigvee', '⋁'),
				D('bigwedge', '⋀'),
				D('bkarow', '⤍'),
				D('blacklozenge', '⧫'),
				D('blacksquare', '▪'),
				D('blacktriangle', '▴'),
				D('blacktriangledown', '▾'),
				D('blacktriangleleft', '◂'),
				D('blacktriangleright', '▸'),
				D('blank', '␣'),
				D('blk12', '▒'),
				D('blk14', '░'),
				D('blk34', '▓'),
				D('block', '█'),
				D('bne', '=⃥'),
				D('bnequiv', '≡⃥'),
				D('bNot', '⫭'),
				D('bnot', '⌐'),
				D('Bopf', '\uD835\uDD39'),
				D('bopf', '\uD835\uDD53'),
				D('bot', '⊥'),
				D('bottom', '⊥'),
				D('bowtie', '⋈'),
				D('boxbox', '⧉'),
				D('boxdl', '┐'),
				D('boxdL', '╕'),
				D('boxDl', '╖'),
				D('boxDL', '╗'),
				D('boxdr', '┌'),
				D('boxdR', '╒'),
				D('boxDr', '╓'),
				D('boxDR', '╔'),
				D('boxh', '─'),
				D('boxH', '═'),
				D('boxhd', '┬'),
				D('boxHd', '╤'),
				D('boxhD', '╥'),
				D('boxHD', '╦'),
				D('boxhu', '┴'),
				D('boxHu', '╧'),
				D('boxhU', '╨'),
				D('boxHU', '╩'),
				D('boxminus', '⊟'),
				D('boxplus', '⊞'),
				D('boxtimes', '⊠'),
				D('boxul', '┘'),
				D('boxuL', '╛'),
				D('boxUl', '╜'),
				D('boxUL', '╝'),
				D('boxur', '└'),
				D('boxuR', '╘'),
				D('boxUr', '╙'),
				D('boxUR', '╚'),
				D('boxv', '│'),
				D('boxV', '║'),
				D('boxvh', '┼'),
				D('boxvH', '╪'),
				D('boxVh', '╫'),
				D('boxVH', '╬'),
				D('boxvl', '┤'),
				D('boxvL', '╡'),
				D('boxVl', '╢'),
				D('boxVL', '╣'),
				D('boxvr', '├'),
				D('boxvR', '╞'),
				D('boxVr', '╟'),
				D('boxVR', '╠'),
				D('bprime', '‵'),
				D('breve', '˘'),
				D('Breve', '˘'),
				D('brvbar', '\xa6'),
				D('bscr', '\uD835\uDCB7'),
				D('Bscr', 'ℬ'),
				D('bsemi', '⁏'),
				D('bsim', '∽'),
				D('bsime', '⋍'),
				D('bsolb', '⧅'),
				D('bsol', '\\'),
				D('bsolhsub', '⟈'),
				D('bull', '•'),
				D('bullet', '•'),
				D('bump', '≎'),
				D('bumpE', '⪮'),
				D('bumpe', '≏'),
				D('Bumpeq', '≎'),
				D('bumpeq', '≏'),
				D('Cacute', 'Ć'),
				D('cacute', 'ć'),
				D('capand', '⩄'),
				D('capbrcup', '⩉'),
				D('capcap', '⩋'),
				D('cap', '∩'),
				D('Cap', '⋒'),
				D('capcup', '⩇'),
				D('capdot', '⩀'),
				D('CapitalDifferentialD', 'ⅅ'),
				D('caps', '∩︀'),
				D('caret', '⁁'),
				D('caron', 'ˇ'),
				D('Cayleys', 'ℭ'),
				D('ccaps', '⩍'),
				D('Ccaron', 'Č'),
				D('ccaron', 'č'),
				D('Ccedil', '\xc7'),
				D('ccedil', '\xe7'),
				D('Ccirc', 'Ĉ'),
				D('ccirc', 'ĉ'),
				D('Cconint', '∰'),
				D('ccups', '⩌'),
				D('ccupssm', '⩐'),
				D('Cdot', 'Ċ'),
				D('cdot', 'ċ'),
				D('cedil', '\xb8'),
				D('Cedilla', '\xb8'),
				D('cemptyv', '⦲'),
				D('cent', '\xa2'),
				D('centerdot', '\xb7'),
				D('CenterDot', '\xb7'),
				D('cfr', '\uD835\uDD20'),
				D('Cfr', 'ℭ'),
				D('CHcy', 'Ч'),
				D('chcy', 'ч'),
				D('check', '✓'),
				D('checkmark', '✓'),
				D('Chi', 'Χ'),
				D('chi', 'χ'),
				D('circ', 'ˆ'),
				D('circeq', '≗'),
				D('circlearrowleft', '↺'),
				D('circlearrowright', '↻'),
				D('circledast', '⊛'),
				D('circledcirc', '⊚'),
				D('circleddash', '⊝'),
				D('CircleDot', '⊙'),
				D('circledR', '\xae'),
				D('circledS', 'Ⓢ'),
				D('CircleMinus', '⊖'),
				D('CirclePlus', '⊕'),
				D('CircleTimes', '⊗'),
				D('cir', '○'),
				D('cirE', '⧃'),
				D('cire', '≗'),
				D('cirfnint', '⨐'),
				D('cirmid', '⫯'),
				D('cirscir', '⧂'),
				D('ClockwiseContourIntegral', '∲'),
				D('CloseCurlyDoubleQuote', '”'),
				D('CloseCurlyQuote', '’'),
				D('clubs', '♣'),
				D('clubsuit', '♣'),
				D('colon', ':'),
				D('Colon', '∷'),
				D('Colone', '⩴'),
				D('colone', '≔'),
				D('coloneq', '≔'),
				D('comma', ','),
				D('commat', '@'),
				D('comp', '∁'),
				D('compfn', '∘'),
				D('complement', '∁'),
				D('complexes', 'ℂ'),
				D('cong', '≅'),
				D('congdot', '⩭'),
				D('Congruent', '≡'),
				D('conint', '∮'),
				D('Conint', '∯'),
				D('ContourIntegral', '∮'),
				D('copf', '\uD835\uDD54'),
				D('Copf', 'ℂ'),
				D('coprod', '∐'),
				D('Coproduct', '∐'),
				D('copy', '\xa9'),
				D('COPY', '\xa9'),
				D('copysr', '℗'),
				D('CounterClockwiseContourIntegral', '∳'),
				D('crarr', '↵'),
				D('cross', '✗'),
				D('Cross', '⨯'),
				D('Cscr', '\uD835\uDC9E'),
				D('cscr', '\uD835\uDCB8'),
				D('csub', '⫏'),
				D('csube', '⫑'),
				D('csup', '⫐'),
				D('csupe', '⫒'),
				D('ctdot', '⋯'),
				D('cudarrl', '⤸'),
				D('cudarrr', '⤵'),
				D('cuepr', '⋞'),
				D('cuesc', '⋟'),
				D('cularr', '↶'),
				D('cularrp', '⤽'),
				D('cupbrcap', '⩈'),
				D('cupcap', '⩆'),
				D('CupCap', '≍'),
				D('cup', '∪'),
				D('Cup', '⋓'),
				D('cupcup', '⩊'),
				D('cupdot', '⊍'),
				D('cupor', '⩅'),
				D('cups', '∪︀'),
				D('curarr', '↷'),
				D('curarrm', '⤼'),
				D('curlyeqprec', '⋞'),
				D('curlyeqsucc', '⋟'),
				D('curlyvee', '⋎'),
				D('curlywedge', '⋏'),
				D('curren', '\xa4'),
				D('curvearrowleft', '↶'),
				D('curvearrowright', '↷'),
				D('cuvee', '⋎'),
				D('cuwed', '⋏'),
				D('cwconint', '∲'),
				D('cwint', '∱'),
				D('cylcty', '⌭'),
				D('dagger', '†'),
				D('Dagger', '‡'),
				D('daleth', 'ℸ'),
				D('darr', '↓'),
				D('Darr', '↡'),
				D('dArr', '⇓'),
				D('dash', '‐'),
				D('Dashv', '⫤'),
				D('dashv', '⊣'),
				D('dbkarow', '⤏'),
				D('dblac', '˝'),
				D('Dcaron', 'Ď'),
				D('dcaron', 'ď'),
				D('Dcy', 'Д'),
				D('dcy', 'д'),
				D('ddagger', '‡'),
				D('ddarr', '⇊'),
				D('DD', 'ⅅ'),
				D('dd', 'ⅆ'),
				D('DDotrahd', '⤑'),
				D('ddotseq', '⩷'),
				D('deg', '\xb0'),
				D('Del', '∇'),
				D('Delta', 'Δ'),
				D('delta', 'δ'),
				D('demptyv', '⦱'),
				D('dfisht', '⥿'),
				D('Dfr', '\uD835\uDD07'),
				D('dfr', '\uD835\uDD21'),
				D('dHar', '⥥'),
				D('dharl', '⇃'),
				D('dharr', '⇂'),
				D('DiacriticalAcute', '\xb4'),
				D('DiacriticalDot', '˙'),
				D('DiacriticalDoubleAcute', '˝'),
				D('DiacriticalGrave', '`'),
				D('DiacriticalTilde', '˜'),
				D('diam', '⋄'),
				D('diamond', '⋄'),
				D('Diamond', '⋄'),
				D('diamondsuit', '♦'),
				D('diams', '♦'),
				D('die', '\xa8'),
				D('DifferentialD', 'ⅆ'),
				D('digamma', 'ϝ'),
				D('disin', '⋲'),
				D('div', '\xf7'),
				D('divide', '\xf7'),
				D('divideontimes', '⋇'),
				D('divonx', '⋇'),
				D('DJcy', 'Ђ'),
				D('djcy', 'ђ'),
				D('dlcorn', '⌞'),
				D('dlcrop', '⌍'),
				D('dollar', '$'),
				D('Dopf', '\uD835\uDD3B'),
				D('dopf', '\uD835\uDD55'),
				D('Dot', '\xa8'),
				D('dot', '˙'),
				D('DotDot', '⃜'),
				D('doteq', '≐'),
				D('doteqdot', '≑'),
				D('DotEqual', '≐'),
				D('dotminus', '∸'),
				D('dotplus', '∔'),
				D('dotsquare', '⊡'),
				D('doublebarwedge', '⌆'),
				D('DoubleContourIntegral', '∯'),
				D('DoubleDot', '\xa8'),
				D('DoubleDownArrow', '⇓'),
				D('DoubleLeftArrow', '⇐'),
				D('DoubleLeftRightArrow', '⇔'),
				D('DoubleLeftTee', '⫤'),
				D('DoubleLongLeftArrow', '⟸'),
				D('DoubleLongLeftRightArrow', '⟺'),
				D('DoubleLongRightArrow', '⟹'),
				D('DoubleRightArrow', '⇒'),
				D('DoubleRightTee', '⊨'),
				D('DoubleUpArrow', '⇑'),
				D('DoubleUpDownArrow', '⇕'),
				D('DoubleVerticalBar', '∥'),
				D('DownArrowBar', '⤓'),
				D('downarrow', '↓'),
				D('DownArrow', '↓'),
				D('Downarrow', '⇓'),
				D('DownArrowUpArrow', '⇵'),
				D('DownBreve', '̑'),
				D('downdownarrows', '⇊'),
				D('downharpoonleft', '⇃'),
				D('downharpoonright', '⇂'),
				D('DownLeftRightVector', '⥐'),
				D('DownLeftTeeVector', '⥞'),
				D('DownLeftVectorBar', '⥖'),
				D('DownLeftVector', '↽'),
				D('DownRightTeeVector', '⥟'),
				D('DownRightVectorBar', '⥗'),
				D('DownRightVector', '⇁'),
				D('DownTeeArrow', '↧'),
				D('DownTee', '⊤'),
				D('drbkarow', '⤐'),
				D('drcorn', '⌟'),
				D('drcrop', '⌌'),
				D('Dscr', '\uD835\uDC9F'),
				D('dscr', '\uD835\uDCB9'),
				D('DScy', 'Ѕ'),
				D('dscy', 'ѕ'),
				D('dsol', '⧶'),
				D('Dstrok', 'Đ'),
				D('dstrok', 'đ'),
				D('dtdot', '⋱'),
				D('dtri', '▿'),
				D('dtrif', '▾'),
				D('duarr', '⇵'),
				D('duhar', '⥯'),
				D('dwangle', '⦦'),
				D('DZcy', 'Џ'),
				D('dzcy', 'џ'),
				D('dzigrarr', '⟿'),
				D('Eacute', '\xc9'),
				D('eacute', '\xe9'),
				D('easter', '⩮'),
				D('Ecaron', 'Ě'),
				D('ecaron', 'ě'),
				D('Ecirc', '\xca'),
				D('ecirc', '\xea'),
				D('ecir', '≖'),
				D('ecolon', '≕'),
				D('Ecy', 'Э'),
				D('ecy', 'э'),
				D('eDDot', '⩷'),
				D('Edot', 'Ė'),
				D('edot', 'ė'),
				D('eDot', '≑'),
				D('ee', 'ⅇ'),
				D('efDot', '≒'),
				D('Efr', '\uD835\uDD08'),
				D('efr', '\uD835\uDD22'),
				D('eg', '⪚'),
				D('Egrave', '\xc8'),
				D('egrave', '\xe8'),
				D('egs', '⪖'),
				D('egsdot', '⪘'),
				D('el', '⪙'),
				D('Element', '∈'),
				D('elinters', '⏧'),
				D('ell', 'ℓ'),
				D('els', '⪕'),
				D('elsdot', '⪗'),
				D('Emacr', 'Ē'),
				D('emacr', 'ē'),
				D('empty', '∅'),
				D('emptyset', '∅'),
				D('EmptySmallSquare', '◻'),
				D('emptyv', '∅'),
				D('EmptyVerySmallSquare', '▫'),
				D('emsp13', ' '),
				D('emsp14', ' '),
				D('emsp', ' '),
				D('ENG', 'Ŋ'),
				D('eng', 'ŋ'),
				D('ensp', ' '),
				D('Eogon', 'Ę'),
				D('eogon', 'ę'),
				D('Eopf', '\uD835\uDD3C'),
				D('eopf', '\uD835\uDD56'),
				D('epar', '⋕'),
				D('eparsl', '⧣'),
				D('eplus', '⩱'),
				D('epsi', 'ε'),
				D('Epsilon', 'Ε'),
				D('epsilon', 'ε'),
				D('epsiv', 'ϵ'),
				D('eqcirc', '≖'),
				D('eqcolon', '≕'),
				D('eqsim', '≂'),
				D('eqslantgtr', '⪖'),
				D('eqslantless', '⪕'),
				D('Equal', '⩵'),
				D('equals', '='),
				D('EqualTilde', '≂'),
				D('equest', '≟'),
				D('Equilibrium', '⇌'),
				D('equiv', '≡'),
				D('equivDD', '⩸'),
				D('eqvparsl', '⧥'),
				D('erarr', '⥱'),
				D('erDot', '≓'),
				D('escr', 'ℯ'),
				D('Escr', 'ℰ'),
				D('esdot', '≐'),
				D('Esim', '⩳'),
				D('esim', '≂'),
				D('Eta', 'Η'),
				D('eta', 'η'),
				D('ETH', '\xd0'),
				D('eth', '\xf0'),
				D('Euml', '\xcb'),
				D('euml', '\xeb'),
				D('euro', '€'),
				D('excl', '!'),
				D('exist', '∃'),
				D('Exists', '∃'),
				D('expectation', 'ℰ'),
				D('exponentiale', 'ⅇ'),
				D('ExponentialE', 'ⅇ'),
				D('fallingdotseq', '≒'),
				D('Fcy', 'Ф'),
				D('fcy', 'ф'),
				D('female', '♀'),
				D('ffilig', 'ﬃ'),
				D('fflig', 'ﬀ'),
				D('ffllig', 'ﬄ'),
				D('Ffr', '\uD835\uDD09'),
				D('ffr', '\uD835\uDD23'),
				D('filig', 'ﬁ'),
				D('FilledSmallSquare', '◼'),
				D('FilledVerySmallSquare', '▪'),
				D('fjlig', 'fj'),
				D('flat', '♭'),
				D('fllig', 'ﬂ'),
				D('fltns', '▱'),
				D('fnof', 'ƒ'),
				D('Fopf', '\uD835\uDD3D'),
				D('fopf', '\uD835\uDD57'),
				D('forall', '∀'),
				D('ForAll', '∀'),
				D('fork', '⋔'),
				D('forkv', '⫙'),
				D('Fouriertrf', 'ℱ'),
				D('fpartint', '⨍'),
				D('frac12', '\xbd'),
				D('frac13', '⅓'),
				D('frac14', '\xbc'),
				D('frac15', '⅕'),
				D('frac16', '⅙'),
				D('frac18', '⅛'),
				D('frac23', '⅔'),
				D('frac25', '⅖'),
				D('frac34', '\xbe'),
				D('frac35', '⅗'),
				D('frac38', '⅜'),
				D('frac45', '⅘'),
				D('frac56', '⅚'),
				D('frac58', '⅝'),
				D('frac78', '⅞'),
				D('frasl', '⁄'),
				D('frown', '⌢'),
				D('fscr', '\uD835\uDCBB'),
				D('Fscr', 'ℱ'),
				D('gacute', 'ǵ'),
				D('Gamma', 'Γ'),
				D('gamma', 'γ'),
				D('Gammad', 'Ϝ'),
				D('gammad', 'ϝ'),
				D('gap', '⪆'),
				D('Gbreve', 'Ğ'),
				D('gbreve', 'ğ'),
				D('Gcedil', 'Ģ'),
				D('Gcirc', 'Ĝ'),
				D('gcirc', 'ĝ'),
				D('Gcy', 'Г'),
				D('gcy', 'г'),
				D('Gdot', 'Ġ'),
				D('gdot', 'ġ'),
				D('ge', '≥'),
				D('gE', '≧'),
				D('gEl', '⪌'),
				D('gel', '⋛'),
				D('geq', '≥'),
				D('geqq', '≧'),
				D('geqslant', '⩾'),
				D('gescc', '⪩'),
				D('ges', '⩾'),
				D('gesdot', '⪀'),
				D('gesdoto', '⪂'),
				D('gesdotol', '⪄'),
				D('gesl', '⋛︀'),
				D('gesles', '⪔'),
				D('Gfr', '\uD835\uDD0A'),
				D('gfr', '\uD835\uDD24'),
				D('gg', '≫'),
				D('Gg', '⋙'),
				D('ggg', '⋙'),
				D('gimel', 'ℷ'),
				D('GJcy', 'Ѓ'),
				D('gjcy', 'ѓ'),
				D('gla', '⪥'),
				D('gl', '≷'),
				D('glE', '⪒'),
				D('glj', '⪤'),
				D('gnap', '⪊'),
				D('gnapprox', '⪊'),
				D('gne', '⪈'),
				D('gnE', '≩'),
				D('gneq', '⪈'),
				D('gneqq', '≩'),
				D('gnsim', '⋧'),
				D('Gopf', '\uD835\uDD3E'),
				D('gopf', '\uD835\uDD58'),
				D('grave', '`'),
				D('GreaterEqual', '≥'),
				D('GreaterEqualLess', '⋛'),
				D('GreaterFullEqual', '≧'),
				D('GreaterGreater', '⪢'),
				D('GreaterLess', '≷'),
				D('GreaterSlantEqual', '⩾'),
				D('GreaterTilde', '≳'),
				D('Gscr', '\uD835\uDCA2'),
				D('gscr', 'ℊ'),
				D('gsim', '≳'),
				D('gsime', '⪎'),
				D('gsiml', '⪐'),
				D('gtcc', '⪧'),
				D('gtcir', '⩺'),
				D('gt', '>'),
				D('GT', '>'),
				D('Gt', '≫'),
				D('gtdot', '⋗'),
				D('gtlPar', '⦕'),
				D('gtquest', '⩼'),
				D('gtrapprox', '⪆'),
				D('gtrarr', '⥸'),
				D('gtrdot', '⋗'),
				D('gtreqless', '⋛'),
				D('gtreqqless', '⪌'),
				D('gtrless', '≷'),
				D('gtrsim', '≳'),
				D('gvertneqq', '≩︀'),
				D('gvnE', '≩︀'),
				D('Hacek', 'ˇ'),
				D('hairsp', ' '),
				D('half', '\xbd'),
				D('hamilt', 'ℋ'),
				D('HARDcy', 'Ъ'),
				D('hardcy', 'ъ'),
				D('harrcir', '⥈'),
				D('harr', '↔'),
				D('hArr', '⇔'),
				D('harrw', '↭'),
				D('Hat', '^'),
				D('hbar', 'ℏ'),
				D('Hcirc', 'Ĥ'),
				D('hcirc', 'ĥ'),
				D('hearts', '♥'),
				D('heartsuit', '♥'),
				D('hellip', '…'),
				D('hercon', '⊹'),
				D('hfr', '\uD835\uDD25'),
				D('Hfr', 'ℌ'),
				D('HilbertSpace', 'ℋ'),
				D('hksearow', '⤥'),
				D('hkswarow', '⤦'),
				D('hoarr', '⇿'),
				D('homtht', '∻'),
				D('hookleftarrow', '↩'),
				D('hookrightarrow', '↪'),
				D('hopf', '\uD835\uDD59'),
				D('Hopf', 'ℍ'),
				D('horbar', '―'),
				D('HorizontalLine', '─'),
				D('hscr', '\uD835\uDCBD'),
				D('Hscr', 'ℋ'),
				D('hslash', 'ℏ'),
				D('Hstrok', 'Ħ'),
				D('hstrok', 'ħ'),
				D('HumpDownHump', '≎'),
				D('HumpEqual', '≏'),
				D('hybull', '⁃'),
				D('hyphen', '‐'),
				D('Iacute', '\xcd'),
				D('iacute', '\xed'),
				D('ic', '⁣'),
				D('Icirc', '\xce'),
				D('icirc', '\xee'),
				D('Icy', 'И'),
				D('icy', 'и'),
				D('Idot', 'İ'),
				D('IEcy', 'Е'),
				D('iecy', 'е'),
				D('iexcl', '\xa1'),
				D('iff', '⇔'),
				D('ifr', '\uD835\uDD26'),
				D('Ifr', 'ℑ'),
				D('Igrave', '\xcc'),
				D('igrave', '\xec'),
				D('ii', 'ⅈ'),
				D('iiiint', '⨌'),
				D('iiint', '∭'),
				D('iinfin', '⧜'),
				D('iiota', '℩'),
				D('IJlig', 'Ĳ'),
				D('ijlig', 'ĳ'),
				D('Imacr', 'Ī'),
				D('imacr', 'ī'),
				D('image', 'ℑ'),
				D('ImaginaryI', 'ⅈ'),
				D('imagline', 'ℐ'),
				D('imagpart', 'ℑ'),
				D('imath', 'ı'),
				D('Im', 'ℑ'),
				D('imof', '⊷'),
				D('imped', 'Ƶ'),
				D('Implies', '⇒'),
				D('incare', '℅'),
				D('in', '∈'),
				D('infin', '∞'),
				D('infintie', '⧝'),
				D('inodot', 'ı'),
				D('intcal', '⊺'),
				D('int', '∫'),
				D('Int', '∬'),
				D('integers', 'ℤ'),
				D('Integral', '∫'),
				D('intercal', '⊺'),
				D('Intersection', '⋂'),
				D('intlarhk', '⨗'),
				D('intprod', '⨼'),
				D('InvisibleComma', '⁣'),
				D('InvisibleTimes', '⁢'),
				D('IOcy', 'Ё'),
				D('iocy', 'ё'),
				D('Iogon', 'Į'),
				D('iogon', 'į'),
				D('Iopf', '\uD835\uDD40'),
				D('iopf', '\uD835\uDD5A'),
				D('Iota', 'Ι'),
				D('iota', 'ι'),
				D('iprod', '⨼'),
				D('iquest', '\xbf'),
				D('iscr', '\uD835\uDCBE'),
				D('Iscr', 'ℐ'),
				D('isin', '∈'),
				D('isindot', '⋵'),
				D('isinE', '⋹'),
				D('isins', '⋴'),
				D('isinsv', '⋳'),
				D('isinv', '∈'),
				D('it', '⁢'),
				D('Itilde', 'Ĩ'),
				D('itilde', 'ĩ'),
				D('Iukcy', 'І'),
				D('iukcy', 'і'),
				D('Iuml', '\xcf'),
				D('iuml', '\xef'),
				D('Jcirc', 'Ĵ'),
				D('jcirc', 'ĵ'),
				D('Jcy', 'Й'),
				D('jcy', 'й'),
				D('Jfr', '\uD835\uDD0D'),
				D('jfr', '\uD835\uDD27'),
				D('jmath', 'ȷ'),
				D('Jopf', '\uD835\uDD41'),
				D('jopf', '\uD835\uDD5B'),
				D('Jscr', '\uD835\uDCA5'),
				D('jscr', '\uD835\uDCBF'),
				D('Jsercy', 'Ј'),
				D('jsercy', 'ј'),
				D('Jukcy', 'Є'),
				D('jukcy', 'є'),
				D('Kappa', 'Κ'),
				D('kappa', 'κ'),
				D('kappav', 'ϰ'),
				D('Kcedil', 'Ķ'),
				D('kcedil', 'ķ'),
				D('Kcy', 'К'),
				D('kcy', 'к'),
				D('Kfr', '\uD835\uDD0E'),
				D('kfr', '\uD835\uDD28'),
				D('kgreen', 'ĸ'),
				D('KHcy', 'Х'),
				D('khcy', 'х'),
				D('KJcy', 'Ќ'),
				D('kjcy', 'ќ'),
				D('Kopf', '\uD835\uDD42'),
				D('kopf', '\uD835\uDD5C'),
				D('Kscr', '\uD835\uDCA6'),
				D('kscr', '\uD835\uDCC0'),
				D('lAarr', '⇚'),
				D('Lacute', 'Ĺ'),
				D('lacute', 'ĺ'),
				D('laemptyv', '⦴'),
				D('lagran', 'ℒ'),
				D('Lambda', 'Λ'),
				D('lambda', 'λ'),
				D('lang', '⟨'),
				D('Lang', '⟪'),
				D('langd', '⦑'),
				D('langle', '⟨'),
				D('lap', '⪅'),
				D('Laplacetrf', 'ℒ'),
				D('laquo', '\xab'),
				D('larrb', '⇤'),
				D('larrbfs', '⤟'),
				D('larr', '←'),
				D('Larr', '↞'),
				D('lArr', '⇐'),
				D('larrfs', '⤝'),
				D('larrhk', '↩'),
				D('larrlp', '↫'),
				D('larrpl', '⤹'),
				D('larrsim', '⥳'),
				D('larrtl', '↢'),
				D('latail', '⤙'),
				D('lAtail', '⤛'),
				D('lat', '⪫'),
				D('late', '⪭'),
				D('lates', '⪭︀'),
				D('lbarr', '⤌'),
				D('lBarr', '⤎'),
				D('lbbrk', '❲'),
				D('lbrace', '{'),
				D('lbrack', '['),
				D('lbrke', '⦋'),
				D('lbrksld', '⦏'),
				D('lbrkslu', '⦍'),
				D('Lcaron', 'Ľ'),
				D('lcaron', 'ľ'),
				D('Lcedil', 'Ļ'),
				D('lcedil', 'ļ'),
				D('lceil', '⌈'),
				D('lcub', '{'),
				D('Lcy', 'Л'),
				D('lcy', 'л'),
				D('ldca', '⤶'),
				D('ldquo', '“'),
				D('ldquor', '„'),
				D('ldrdhar', '⥧'),
				D('ldrushar', '⥋'),
				D('ldsh', '↲'),
				D('le', '≤'),
				D('lE', '≦'),
				D('LeftAngleBracket', '⟨'),
				D('LeftArrowBar', '⇤'),
				D('leftarrow', '←'),
				D('LeftArrow', '←'),
				D('Leftarrow', '⇐'),
				D('LeftArrowRightArrow', '⇆'),
				D('leftarrowtail', '↢'),
				D('LeftCeiling', '⌈'),
				D('LeftDoubleBracket', '⟦'),
				D('LeftDownTeeVector', '⥡'),
				D('LeftDownVectorBar', '⥙'),
				D('LeftDownVector', '⇃'),
				D('LeftFloor', '⌊'),
				D('leftharpoondown', '↽'),
				D('leftharpoonup', '↼'),
				D('leftleftarrows', '⇇'),
				D('leftrightarrow', '↔'),
				D('LeftRightArrow', '↔'),
				D('Leftrightarrow', '⇔'),
				D('leftrightarrows', '⇆'),
				D('leftrightharpoons', '⇋'),
				D('leftrightsquigarrow', '↭'),
				D('LeftRightVector', '⥎'),
				D('LeftTeeArrow', '↤'),
				D('LeftTee', '⊣'),
				D('LeftTeeVector', '⥚'),
				D('leftthreetimes', '⋋'),
				D('LeftTriangleBar', '⧏'),
				D('LeftTriangle', '⊲'),
				D('LeftTriangleEqual', '⊴'),
				D('LeftUpDownVector', '⥑'),
				D('LeftUpTeeVector', '⥠'),
				D('LeftUpVectorBar', '⥘'),
				D('LeftUpVector', '↿'),
				D('LeftVectorBar', '⥒'),
				D('LeftVector', '↼'),
				D('lEg', '⪋'),
				D('leg', '⋚'),
				D('leq', '≤'),
				D('leqq', '≦'),
				D('leqslant', '⩽'),
				D('lescc', '⪨'),
				D('les', '⩽'),
				D('lesdot', '⩿'),
				D('lesdoto', '⪁'),
				D('lesdotor', '⪃'),
				D('lesg', '⋚︀'),
				D('lesges', '⪓'),
				D('lessapprox', '⪅'),
				D('lessdot', '⋖'),
				D('lesseqgtr', '⋚'),
				D('lesseqqgtr', '⪋'),
				D('LessEqualGreater', '⋚'),
				D('LessFullEqual', '≦'),
				D('LessGreater', '≶'),
				D('lessgtr', '≶'),
				D('LessLess', '⪡'),
				D('lesssim', '≲'),
				D('LessSlantEqual', '⩽'),
				D('LessTilde', '≲'),
				D('lfisht', '⥼'),
				D('lfloor', '⌊'),
				D('Lfr', '\uD835\uDD0F'),
				D('lfr', '\uD835\uDD29'),
				D('lg', '≶'),
				D('lgE', '⪑'),
				D('lHar', '⥢'),
				D('lhard', '↽'),
				D('lharu', '↼'),
				D('lharul', '⥪'),
				D('lhblk', '▄'),
				D('LJcy', 'Љ'),
				D('ljcy', 'љ'),
				D('llarr', '⇇'),
				D('ll', '≪'),
				D('Ll', '⋘'),
				D('llcorner', '⌞'),
				D('Lleftarrow', '⇚'),
				D('llhard', '⥫'),
				D('lltri', '◺'),
				D('Lmidot', 'Ŀ'),
				D('lmidot', 'ŀ'),
				D('lmoustache', '⎰'),
				D('lmoust', '⎰'),
				D('lnap', '⪉'),
				D('lnapprox', '⪉'),
				D('lne', '⪇'),
				D('lnE', '≨'),
				D('lneq', '⪇'),
				D('lneqq', '≨'),
				D('lnsim', '⋦'),
				D('loang', '⟬'),
				D('loarr', '⇽'),
				D('lobrk', '⟦'),
				D('longleftarrow', '⟵'),
				D('LongLeftArrow', '⟵'),
				D('Longleftarrow', '⟸'),
				D('longleftrightarrow', '⟷'),
				D('LongLeftRightArrow', '⟷'),
				D('Longleftrightarrow', '⟺'),
				D('longmapsto', '⟼'),
				D('longrightarrow', '⟶'),
				D('LongRightArrow', '⟶'),
				D('Longrightarrow', '⟹'),
				D('looparrowleft', '↫'),
				D('looparrowright', '↬'),
				D('lopar', '⦅'),
				D('Lopf', '\uD835\uDD43'),
				D('lopf', '\uD835\uDD5D'),
				D('loplus', '⨭'),
				D('lotimes', '⨴'),
				D('lowast', '∗'),
				D('lowbar', '_'),
				D('LowerLeftArrow', '↙'),
				D('LowerRightArrow', '↘'),
				D('loz', '◊'),
				D('lozenge', '◊'),
				D('lozf', '⧫'),
				D('lpar', '('),
				D('lparlt', '⦓'),
				D('lrarr', '⇆'),
				D('lrcorner', '⌟'),
				D('lrhar', '⇋'),
				D('lrhard', '⥭'),
				D('lrm', '‎'),
				D('lrtri', '⊿'),
				D('lsaquo', '‹'),
				D('lscr', '\uD835\uDCC1'),
				D('Lscr', 'ℒ'),
				D('lsh', '↰'),
				D('Lsh', '↰'),
				D('lsim', '≲'),
				D('lsime', '⪍'),
				D('lsimg', '⪏'),
				D('lsqb', '['),
				D('lsquo', '‘'),
				D('lsquor', '‚'),
				D('Lstrok', 'Ł'),
				D('lstrok', 'ł'),
				D('ltcc', '⪦'),
				D('ltcir', '⩹'),
				D('lt', '<'),
				D('LT', '<'),
				D('Lt', '≪'),
				D('ltdot', '⋖'),
				D('lthree', '⋋'),
				D('ltimes', '⋉'),
				D('ltlarr', '⥶'),
				D('ltquest', '⩻'),
				D('ltri', '◃'),
				D('ltrie', '⊴'),
				D('ltrif', '◂'),
				D('ltrPar', '⦖'),
				D('lurdshar', '⥊'),
				D('luruhar', '⥦'),
				D('lvertneqq', '≨︀'),
				D('lvnE', '≨︀'),
				D('macr', '\xaf'),
				D('male', '♂'),
				D('malt', '✠'),
				D('maltese', '✠'),
				D('Map', '⤅'),
				D('map', '↦'),
				D('mapsto', '↦'),
				D('mapstodown', '↧'),
				D('mapstoleft', '↤'),
				D('mapstoup', '↥'),
				D('marker', '▮'),
				D('mcomma', '⨩'),
				D('Mcy', 'М'),
				D('mcy', 'м'),
				D('mdash', '—'),
				D('mDDot', '∺'),
				D('measuredangle', '∡'),
				D('MediumSpace', ' '),
				D('Mellintrf', 'ℳ'),
				D('Mfr', '\uD835\uDD10'),
				D('mfr', '\uD835\uDD2A'),
				D('mho', '℧'),
				D('micro', '\xb5'),
				D('midast', '*'),
				D('midcir', '⫰'),
				D('mid', '∣'),
				D('middot', '\xb7'),
				D('minusb', '⊟'),
				D('minus', '−'),
				D('minusd', '∸'),
				D('minusdu', '⨪'),
				D('MinusPlus', '∓'),
				D('mlcp', '⫛'),
				D('mldr', '…'),
				D('mnplus', '∓'),
				D('models', '⊧'),
				D('Mopf', '\uD835\uDD44'),
				D('mopf', '\uD835\uDD5E'),
				D('mp', '∓'),
				D('mscr', '\uD835\uDCC2'),
				D('Mscr', 'ℳ'),
				D('mstpos', '∾'),
				D('Mu', 'Μ'),
				D('mu', 'μ'),
				D('multimap', '⊸'),
				D('mumap', '⊸'),
				D('nabla', '∇'),
				D('Nacute', 'Ń'),
				D('nacute', 'ń'),
				D('nang', '∠⃒'),
				D('nap', '≉'),
				D('napE', '⩰̸'),
				D('napid', '≋̸'),
				D('napos', 'ŉ'),
				D('napprox', '≉'),
				D('natural', '♮'),
				D('naturals', 'ℕ'),
				D('natur', '♮'),
				D('nbsp', '\xa0'),
				D('nbump', '≎̸'),
				D('nbumpe', '≏̸'),
				D('ncap', '⩃'),
				D('Ncaron', 'Ň'),
				D('ncaron', 'ň'),
				D('Ncedil', 'Ņ'),
				D('ncedil', 'ņ'),
				D('ncong', '≇'),
				D('ncongdot', '⩭̸'),
				D('ncup', '⩂'),
				D('Ncy', 'Н'),
				D('ncy', 'н'),
				D('ndash', '–'),
				D('nearhk', '⤤'),
				D('nearr', '↗'),
				D('neArr', '⇗'),
				D('nearrow', '↗'),
				D('ne', '≠'),
				D('nedot', '≐̸'),
				D('NegativeMediumSpace', '​'),
				D('NegativeThickSpace', '​'),
				D('NegativeThinSpace', '​'),
				D('NegativeVeryThinSpace', '​'),
				D('nequiv', '≢'),
				D('nesear', '⤨'),
				D('nesim', '≂̸'),
				D('NestedGreaterGreater', '≫'),
				D('NestedLessLess', '≪'),
				D('NewLine', '\n'),
				D('nexist', '∄'),
				D('nexists', '∄'),
				D('Nfr', '\uD835\uDD11'),
				D('nfr', '\uD835\uDD2B'),
				D('ngE', '≧̸'),
				D('nge', '≱'),
				D('ngeq', '≱'),
				D('ngeqq', '≧̸'),
				D('ngeqslant', '⩾̸'),
				D('nges', '⩾̸'),
				D('nGg', '⋙̸'),
				D('ngsim', '≵'),
				D('nGt', '≫⃒'),
				D('ngt', '≯'),
				D('ngtr', '≯'),
				D('nGtv', '≫̸'),
				D('nharr', '↮'),
				D('nhArr', '⇎'),
				D('nhpar', '⫲'),
				D('ni', '∋'),
				D('nis', '⋼'),
				D('nisd', '⋺'),
				D('niv', '∋'),
				D('NJcy', 'Њ'),
				D('njcy', 'њ'),
				D('nlarr', '↚'),
				D('nlArr', '⇍'),
				D('nldr', '‥'),
				D('nlE', '≦̸'),
				D('nle', '≰'),
				D('nleftarrow', '↚'),
				D('nLeftarrow', '⇍'),
				D('nleftrightarrow', '↮'),
				D('nLeftrightarrow', '⇎'),
				D('nleq', '≰'),
				D('nleqq', '≦̸'),
				D('nleqslant', '⩽̸'),
				D('nles', '⩽̸'),
				D('nless', '≮'),
				D('nLl', '⋘̸'),
				D('nlsim', '≴'),
				D('nLt', '≪⃒'),
				D('nlt', '≮'),
				D('nltri', '⋪'),
				D('nltrie', '⋬'),
				D('nLtv', '≪̸'),
				D('nmid', '∤'),
				D('NoBreak', '⁠'),
				D('NonBreakingSpace', '\xa0'),
				D('nopf', '\uD835\uDD5F'),
				D('Nopf', 'ℕ'),
				D('Not', '⫬'),
				D('not', '\xac'),
				D('NotCongruent', '≢'),
				D('NotCupCap', '≭'),
				D('NotDoubleVerticalBar', '∦'),
				D('NotElement', '∉'),
				D('NotEqual', '≠'),
				D('NotEqualTilde', '≂̸'),
				D('NotExists', '∄'),
				D('NotGreater', '≯'),
				D('NotGreaterEqual', '≱'),
				D('NotGreaterFullEqual', '≧̸'),
				D('NotGreaterGreater', '≫̸'),
				D('NotGreaterLess', '≹'),
				D('NotGreaterSlantEqual', '⩾̸'),
				D('NotGreaterTilde', '≵'),
				D('NotHumpDownHump', '≎̸'),
				D('NotHumpEqual', '≏̸'),
				D('notin', '∉'),
				D('notindot', '⋵̸'),
				D('notinE', '⋹̸'),
				D('notinva', '∉'),
				D('notinvb', '⋷'),
				D('notinvc', '⋶'),
				D('NotLeftTriangleBar', '⧏̸'),
				D('NotLeftTriangle', '⋪'),
				D('NotLeftTriangleEqual', '⋬'),
				D('NotLess', '≮'),
				D('NotLessEqual', '≰'),
				D('NotLessGreater', '≸'),
				D('NotLessLess', '≪̸'),
				D('NotLessSlantEqual', '⩽̸'),
				D('NotLessTilde', '≴'),
				D('NotNestedGreaterGreater', '⪢̸'),
				D('NotNestedLessLess', '⪡̸'),
				D('notni', '∌'),
				D('notniva', '∌'),
				D('notnivb', '⋾'),
				D('notnivc', '⋽'),
				D('NotPrecedes', '⊀'),
				D('NotPrecedesEqual', '⪯̸'),
				D('NotPrecedesSlantEqual', '⋠'),
				D('NotReverseElement', '∌'),
				D('NotRightTriangleBar', '⧐̸'),
				D('NotRightTriangle', '⋫'),
				D('NotRightTriangleEqual', '⋭'),
				D('NotSquareSubset', '⊏̸'),
				D('NotSquareSubsetEqual', '⋢'),
				D('NotSquareSuperset', '⊐̸'),
				D('NotSquareSupersetEqual', '⋣'),
				D('NotSubset', '⊂⃒'),
				D('NotSubsetEqual', '⊈'),
				D('NotSucceeds', '⊁'),
				D('NotSucceedsEqual', '⪰̸'),
				D('NotSucceedsSlantEqual', '⋡'),
				D('NotSucceedsTilde', '≿̸'),
				D('NotSuperset', '⊃⃒'),
				D('NotSupersetEqual', '⊉'),
				D('NotTilde', '≁'),
				D('NotTildeEqual', '≄'),
				D('NotTildeFullEqual', '≇'),
				D('NotTildeTilde', '≉'),
				D('NotVerticalBar', '∤'),
				D('nparallel', '∦'),
				D('npar', '∦'),
				D('nparsl', '⫽⃥'),
				D('npart', '∂̸'),
				D('npolint', '⨔'),
				D('npr', '⊀'),
				D('nprcue', '⋠'),
				D('nprec', '⊀'),
				D('npreceq', '⪯̸'),
				D('npre', '⪯̸'),
				D('nrarrc', '⤳̸'),
				D('nrarr', '↛'),
				D('nrArr', '⇏'),
				D('nrarrw', '↝̸'),
				D('nrightarrow', '↛'),
				D('nRightarrow', '⇏'),
				D('nrtri', '⋫'),
				D('nrtrie', '⋭'),
				D('nsc', '⊁'),
				D('nsccue', '⋡'),
				D('nsce', '⪰̸'),
				D('Nscr', '\uD835\uDCA9'),
				D('nscr', '\uD835\uDCC3'),
				D('nshortmid', '∤'),
				D('nshortparallel', '∦'),
				D('nsim', '≁'),
				D('nsime', '≄'),
				D('nsimeq', '≄'),
				D('nsmid', '∤'),
				D('nspar', '∦'),
				D('nsqsube', '⋢'),
				D('nsqsupe', '⋣'),
				D('nsub', '⊄'),
				D('nsubE', '⫅̸'),
				D('nsube', '⊈'),
				D('nsubset', '⊂⃒'),
				D('nsubseteq', '⊈'),
				D('nsubseteqq', '⫅̸'),
				D('nsucc', '⊁'),
				D('nsucceq', '⪰̸'),
				D('nsup', '⊅'),
				D('nsupE', '⫆̸'),
				D('nsupe', '⊉'),
				D('nsupset', '⊃⃒'),
				D('nsupseteq', '⊉'),
				D('nsupseteqq', '⫆̸'),
				D('ntgl', '≹'),
				D('Ntilde', '\xd1'),
				D('ntilde', '\xf1'),
				D('ntlg', '≸'),
				D('ntriangleleft', '⋪'),
				D('ntrianglelefteq', '⋬'),
				D('ntriangleright', '⋫'),
				D('ntrianglerighteq', '⋭'),
				D('Nu', 'Ν'),
				D('nu', 'ν'),
				D('num', '#'),
				D('numero', '№'),
				D('numsp', ' '),
				D('nvap', '≍⃒'),
				D('nvdash', '⊬'),
				D('nvDash', '⊭'),
				D('nVdash', '⊮'),
				D('nVDash', '⊯'),
				D('nvge', '≥⃒'),
				D('nvgt', '>⃒'),
				D('nvHarr', '⤄'),
				D('nvinfin', '⧞'),
				D('nvlArr', '⤂'),
				D('nvle', '≤⃒'),
				D('nvlt', '<⃒'),
				D('nvltrie', '⊴⃒'),
				D('nvrArr', '⤃'),
				D('nvrtrie', '⊵⃒'),
				D('nvsim', '∼⃒'),
				D('nwarhk', '⤣'),
				D('nwarr', '↖'),
				D('nwArr', '⇖'),
				D('nwarrow', '↖'),
				D('nwnear', '⤧'),
				D('Oacute', '\xd3'),
				D('oacute', '\xf3'),
				D('oast', '⊛'),
				D('Ocirc', '\xd4'),
				D('ocirc', '\xf4'),
				D('ocir', '⊚'),
				D('Ocy', 'О'),
				D('ocy', 'о'),
				D('odash', '⊝'),
				D('Odblac', 'Ő'),
				D('odblac', 'ő'),
				D('odiv', '⨸'),
				D('odot', '⊙'),
				D('odsold', '⦼'),
				D('OElig', 'Œ'),
				D('oelig', 'œ'),
				D('ofcir', '⦿'),
				D('Ofr', '\uD835\uDD12'),
				D('ofr', '\uD835\uDD2C'),
				D('ogon', '˛'),
				D('Ograve', '\xd2'),
				D('ograve', '\xf2'),
				D('ogt', '⧁'),
				D('ohbar', '⦵'),
				D('ohm', 'Ω'),
				D('oint', '∮'),
				D('olarr', '↺'),
				D('olcir', '⦾'),
				D('olcross', '⦻'),
				D('oline', '‾'),
				D('olt', '⧀'),
				D('Omacr', 'Ō'),
				D('omacr', 'ō'),
				D('Omega', 'Ω'),
				D('omega', 'ω'),
				D('Omicron', 'Ο'),
				D('omicron', 'ο'),
				D('omid', '⦶'),
				D('ominus', '⊖'),
				D('Oopf', '\uD835\uDD46'),
				D('oopf', '\uD835\uDD60'),
				D('opar', '⦷'),
				D('OpenCurlyDoubleQuote', '“'),
				D('OpenCurlyQuote', '‘'),
				D('operp', '⦹'),
				D('oplus', '⊕'),
				D('orarr', '↻'),
				D('Or', '⩔'),
				D('or', '∨'),
				D('ord', '⩝'),
				D('order', 'ℴ'),
				D('orderof', 'ℴ'),
				D('ordf', '\xaa'),
				D('ordm', '\xba'),
				D('origof', '⊶'),
				D('oror', '⩖'),
				D('orslope', '⩗'),
				D('orv', '⩛'),
				D('oS', 'Ⓢ'),
				D('Oscr', '\uD835\uDCAA'),
				D('oscr', 'ℴ'),
				D('Oslash', '\xd8'),
				D('oslash', '\xf8'),
				D('osol', '⊘'),
				D('Otilde', '\xd5'),
				D('otilde', '\xf5'),
				D('otimesas', '⨶'),
				D('Otimes', '⨷'),
				D('otimes', '⊗'),
				D('Ouml', '\xd6'),
				D('ouml', '\xf6'),
				D('ovbar', '⌽'),
				D('OverBar', '‾'),
				D('OverBrace', '⏞'),
				D('OverBracket', '⎴'),
				D('OverParenthesis', '⏜'),
				D('para', '\xb6'),
				D('parallel', '∥'),
				D('par', '∥'),
				D('parsim', '⫳'),
				D('parsl', '⫽'),
				D('part', '∂'),
				D('PartialD', '∂'),
				D('Pcy', 'П'),
				D('pcy', 'п'),
				D('percnt', '%'),
				D('period', '.'),
				D('permil', '‰'),
				D('perp', '⊥'),
				D('pertenk', '‱'),
				D('Pfr', '\uD835\uDD13'),
				D('pfr', '\uD835\uDD2D'),
				D('Phi', 'Φ'),
				D('phi', 'φ'),
				D('phiv', 'ϕ'),
				D('phmmat', 'ℳ'),
				D('phone', '☎'),
				D('Pi', 'Π'),
				D('pi', 'π'),
				D('pitchfork', '⋔'),
				D('piv', 'ϖ'),
				D('planck', 'ℏ'),
				D('planckh', 'ℎ'),
				D('plankv', 'ℏ'),
				D('plusacir', '⨣'),
				D('plusb', '⊞'),
				D('pluscir', '⨢'),
				D('plus', '+'),
				D('plusdo', '∔'),
				D('plusdu', '⨥'),
				D('pluse', '⩲'),
				D('PlusMinus', '\xb1'),
				D('plusmn', '\xb1'),
				D('plussim', '⨦'),
				D('plustwo', '⨧'),
				D('pm', '\xb1'),
				D('Poincareplane', 'ℌ'),
				D('pointint', '⨕'),
				D('popf', '\uD835\uDD61'),
				D('Popf', 'ℙ'),
				D('pound', '\xa3'),
				D('prap', '⪷'),
				D('Pr', '⪻'),
				D('pr', '≺'),
				D('prcue', '≼'),
				D('precapprox', '⪷'),
				D('prec', '≺'),
				D('preccurlyeq', '≼'),
				D('Precedes', '≺'),
				D('PrecedesEqual', '⪯'),
				D('PrecedesSlantEqual', '≼'),
				D('PrecedesTilde', '≾'),
				D('preceq', '⪯'),
				D('precnapprox', '⪹'),
				D('precneqq', '⪵'),
				D('precnsim', '⋨'),
				D('pre', '⪯'),
				D('prE', '⪳'),
				D('precsim', '≾'),
				D('prime', '′'),
				D('Prime', '″'),
				D('primes', 'ℙ'),
				D('prnap', '⪹'),
				D('prnE', '⪵'),
				D('prnsim', '⋨'),
				D('prod', '∏'),
				D('Product', '∏'),
				D('profalar', '⌮'),
				D('profline', '⌒'),
				D('profsurf', '⌓'),
				D('prop', '∝'),
				D('Proportional', '∝'),
				D('Proportion', '∷'),
				D('propto', '∝'),
				D('prsim', '≾'),
				D('prurel', '⊰'),
				D('Pscr', '\uD835\uDCAB'),
				D('pscr', '\uD835\uDCC5'),
				D('Psi', 'Ψ'),
				D('psi', 'ψ'),
				D('puncsp', ' '),
				D('Qfr', '\uD835\uDD14'),
				D('qfr', '\uD835\uDD2E'),
				D('qint', '⨌'),
				D('qopf', '\uD835\uDD62'),
				D('Qopf', 'ℚ'),
				D('qprime', '⁗'),
				D('Qscr', '\uD835\uDCAC'),
				D('qscr', '\uD835\uDCC6'),
				D('quaternions', 'ℍ'),
				D('quatint', '⨖'),
				D('quest', '?'),
				D('questeq', '≟'),
				D('quot', '"'),
				D('QUOT', '"'),
				D('rAarr', '⇛'),
				D('race', '∽̱'),
				D('Racute', 'Ŕ'),
				D('racute', 'ŕ'),
				D('radic', '√'),
				D('raemptyv', '⦳'),
				D('rang', '⟩'),
				D('Rang', '⟫'),
				D('rangd', '⦒'),
				D('range', '⦥'),
				D('rangle', '⟩'),
				D('raquo', '\xbb'),
				D('rarrap', '⥵'),
				D('rarrb', '⇥'),
				D('rarrbfs', '⤠'),
				D('rarrc', '⤳'),
				D('rarr', '→'),
				D('Rarr', '↠'),
				D('rArr', '⇒'),
				D('rarrfs', '⤞'),
				D('rarrhk', '↪'),
				D('rarrlp', '↬'),
				D('rarrpl', '⥅'),
				D('rarrsim', '⥴'),
				D('Rarrtl', '⤖'),
				D('rarrtl', '↣'),
				D('rarrw', '↝'),
				D('ratail', '⤚'),
				D('rAtail', '⤜'),
				D('ratio', '∶'),
				D('rationals', 'ℚ'),
				D('rbarr', '⤍'),
				D('rBarr', '⤏'),
				D('RBarr', '⤐'),
				D('rbbrk', '❳'),
				D('rbrace', '}'),
				D('rbrack', ']'),
				D('rbrke', '⦌'),
				D('rbrksld', '⦎'),
				D('rbrkslu', '⦐'),
				D('Rcaron', 'Ř'),
				D('rcaron', 'ř'),
				D('Rcedil', 'Ŗ'),
				D('rcedil', 'ŗ'),
				D('rceil', '⌉'),
				D('rcub', '}'),
				D('Rcy', 'Р'),
				D('rcy', 'р'),
				D('rdca', '⤷'),
				D('rdldhar', '⥩'),
				D('rdquo', '”'),
				D('rdquor', '”'),
				D('rdsh', '↳'),
				D('real', 'ℜ'),
				D('realine', 'ℛ'),
				D('realpart', 'ℜ'),
				D('reals', 'ℝ'),
				D('Re', 'ℜ'),
				D('rect', '▭'),
				D('reg', '\xae'),
				D('REG', '\xae'),
				D('ReverseElement', '∋'),
				D('ReverseEquilibrium', '⇋'),
				D('ReverseUpEquilibrium', '⥯'),
				D('rfisht', '⥽'),
				D('rfloor', '⌋'),
				D('rfr', '\uD835\uDD2F'),
				D('Rfr', 'ℜ'),
				D('rHar', '⥤'),
				D('rhard', '⇁'),
				D('rharu', '⇀'),
				D('rharul', '⥬'),
				D('Rho', 'Ρ'),
				D('rho', 'ρ'),
				D('rhov', 'ϱ'),
				D('RightAngleBracket', '⟩'),
				D('RightArrowBar', '⇥'),
				D('rightarrow', '→'),
				D('RightArrow', '→'),
				D('Rightarrow', '⇒'),
				D('RightArrowLeftArrow', '⇄'),
				D('rightarrowtail', '↣'),
				D('RightCeiling', '⌉'),
				D('RightDoubleBracket', '⟧'),
				D('RightDownTeeVector', '⥝'),
				D('RightDownVectorBar', '⥕'),
				D('RightDownVector', '⇂'),
				D('RightFloor', '⌋'),
				D('rightharpoondown', '⇁'),
				D('rightharpoonup', '⇀'),
				D('rightleftarrows', '⇄'),
				D('rightleftharpoons', '⇌'),
				D('rightrightarrows', '⇉'),
				D('rightsquigarrow', '↝'),
				D('RightTeeArrow', '↦'),
				D('RightTee', '⊢'),
				D('RightTeeVector', '⥛'),
				D('rightthreetimes', '⋌'),
				D('RightTriangleBar', '⧐'),
				D('RightTriangle', '⊳'),
				D('RightTriangleEqual', '⊵'),
				D('RightUpDownVector', '⥏'),
				D('RightUpTeeVector', '⥜'),
				D('RightUpVectorBar', '⥔'),
				D('RightUpVector', '↾'),
				D('RightVectorBar', '⥓'),
				D('RightVector', '⇀'),
				D('ring', '˚'),
				D('risingdotseq', '≓'),
				D('rlarr', '⇄'),
				D('rlhar', '⇌'),
				D('rlm', '‏'),
				D('rmoustache', '⎱'),
				D('rmoust', '⎱'),
				D('rnmid', '⫮'),
				D('roang', '⟭'),
				D('roarr', '⇾'),
				D('robrk', '⟧'),
				D('ropar', '⦆'),
				D('ropf', '\uD835\uDD63'),
				D('Ropf', 'ℝ'),
				D('roplus', '⨮'),
				D('rotimes', '⨵'),
				D('RoundImplies', '⥰'),
				D('rpar', ')'),
				D('rpargt', '⦔'),
				D('rppolint', '⨒'),
				D('rrarr', '⇉'),
				D('Rrightarrow', '⇛'),
				D('rsaquo', '›'),
				D('rscr', '\uD835\uDCC7'),
				D('Rscr', 'ℛ'),
				D('rsh', '↱'),
				D('Rsh', '↱'),
				D('rsqb', ']'),
				D('rsquo', '’'),
				D('rsquor', '’'),
				D('rthree', '⋌'),
				D('rtimes', '⋊'),
				D('rtri', '▹'),
				D('rtrie', '⊵'),
				D('rtrif', '▸'),
				D('rtriltri', '⧎'),
				D('RuleDelayed', '⧴'),
				D('ruluhar', '⥨'),
				D('rx', '℞'),
				D('Sacute', 'Ś'),
				D('sacute', 'ś'),
				D('sbquo', '‚'),
				D('scap', '⪸'),
				D('Scaron', 'Š'),
				D('scaron', 'š'),
				D('Sc', '⪼'),
				D('sc', '≻'),
				D('sccue', '≽'),
				D('sce', '⪰'),
				D('scE', '⪴'),
				D('Scedil', 'Ş'),
				D('scedil', 'ş'),
				D('Scirc', 'Ŝ'),
				D('scirc', 'ŝ'),
				D('scnap', '⪺'),
				D('scnE', '⪶'),
				D('scnsim', '⋩'),
				D('scpolint', '⨓'),
				D('scsim', '≿'),
				D('Scy', 'С'),
				D('scy', 'с'),
				D('sdotb', '⊡'),
				D('sdot', '⋅'),
				D('sdote', '⩦'),
				D('searhk', '⤥'),
				D('searr', '↘'),
				D('seArr', '⇘'),
				D('searrow', '↘'),
				D('sect', '\xa7'),
				D('semi', ';'),
				D('seswar', '⤩'),
				D('setminus', '∖'),
				D('setmn', '∖'),
				D('sext', '✶'),
				D('Sfr', '\uD835\uDD16'),
				D('sfr', '\uD835\uDD30'),
				D('sfrown', '⌢'),
				D('sharp', '♯'),
				D('SHCHcy', 'Щ'),
				D('shchcy', 'щ'),
				D('SHcy', 'Ш'),
				D('shcy', 'ш'),
				D('ShortDownArrow', '↓'),
				D('ShortLeftArrow', '←'),
				D('shortmid', '∣'),
				D('shortparallel', '∥'),
				D('ShortRightArrow', '→'),
				D('ShortUpArrow', '↑'),
				D('shy', '\xad'),
				D('Sigma', 'Σ'),
				D('sigma', 'σ'),
				D('sigmaf', 'ς'),
				D('sigmav', 'ς'),
				D('sim', '∼'),
				D('simdot', '⩪'),
				D('sime', '≃'),
				D('simeq', '≃'),
				D('simg', '⪞'),
				D('simgE', '⪠'),
				D('siml', '⪝'),
				D('simlE', '⪟'),
				D('simne', '≆'),
				D('simplus', '⨤'),
				D('simrarr', '⥲'),
				D('slarr', '←'),
				D('SmallCircle', '∘'),
				D('smallsetminus', '∖'),
				D('smashp', '⨳'),
				D('smeparsl', '⧤'),
				D('smid', '∣'),
				D('smile', '⌣'),
				D('smt', '⪪'),
				D('smte', '⪬'),
				D('smtes', '⪬︀'),
				D('SOFTcy', 'Ь'),
				D('softcy', 'ь'),
				D('solbar', '⌿'),
				D('solb', '⧄'),
				D('sol', '/'),
				D('Sopf', '\uD835\uDD4A'),
				D('sopf', '\uD835\uDD64'),
				D('spades', '♠'),
				D('spadesuit', '♠'),
				D('spar', '∥'),
				D('sqcap', '⊓'),
				D('sqcaps', '⊓︀'),
				D('sqcup', '⊔'),
				D('sqcups', '⊔︀'),
				D('Sqrt', '√'),
				D('sqsub', '⊏'),
				D('sqsube', '⊑'),
				D('sqsubset', '⊏'),
				D('sqsubseteq', '⊑'),
				D('sqsup', '⊐'),
				D('sqsupe', '⊒'),
				D('sqsupset', '⊐'),
				D('sqsupseteq', '⊒'),
				D('square', '□'),
				D('Square', '□'),
				D('SquareIntersection', '⊓'),
				D('SquareSubset', '⊏'),
				D('SquareSubsetEqual', '⊑'),
				D('SquareSuperset', '⊐'),
				D('SquareSupersetEqual', '⊒'),
				D('SquareUnion', '⊔'),
				D('squarf', '▪'),
				D('squ', '□'),
				D('squf', '▪'),
				D('srarr', '→'),
				D('Sscr', '\uD835\uDCAE'),
				D('sscr', '\uD835\uDCC8'),
				D('ssetmn', '∖'),
				D('ssmile', '⌣'),
				D('sstarf', '⋆'),
				D('Star', '⋆'),
				D('star', '☆'),
				D('starf', '★'),
				D('straightepsilon', 'ϵ'),
				D('straightphi', 'ϕ'),
				D('strns', '\xaf'),
				D('sub', '⊂'),
				D('Sub', '⋐'),
				D('subdot', '⪽'),
				D('subE', '⫅'),
				D('sube', '⊆'),
				D('subedot', '⫃'),
				D('submult', '⫁'),
				D('subnE', '⫋'),
				D('subne', '⊊'),
				D('subplus', '⪿'),
				D('subrarr', '⥹'),
				D('subset', '⊂'),
				D('Subset', '⋐'),
				D('subseteq', '⊆'),
				D('subseteqq', '⫅'),
				D('SubsetEqual', '⊆'),
				D('subsetneq', '⊊'),
				D('subsetneqq', '⫋'),
				D('subsim', '⫇'),
				D('subsub', '⫕'),
				D('subsup', '⫓'),
				D('succapprox', '⪸'),
				D('succ', '≻'),
				D('succcurlyeq', '≽'),
				D('Succeeds', '≻'),
				D('SucceedsEqual', '⪰'),
				D('SucceedsSlantEqual', '≽'),
				D('SucceedsTilde', '≿'),
				D('succeq', '⪰'),
				D('succnapprox', '⪺'),
				D('succneqq', '⪶'),
				D('succnsim', '⋩'),
				D('succsim', '≿'),
				D('SuchThat', '∋'),
				D('sum', '∑'),
				D('Sum', '∑'),
				D('sung', '♪'),
				D('sup1', '\xb9'),
				D('sup2', '\xb2'),
				D('sup3', '\xb3'),
				D('sup', '⊃'),
				D('Sup', '⋑'),
				D('supdot', '⪾'),
				D('supdsub', '⫘'),
				D('supE', '⫆'),
				D('supe', '⊇'),
				D('supedot', '⫄'),
				D('Superset', '⊃'),
				D('SupersetEqual', '⊇'),
				D('suphsol', '⟉'),
				D('suphsub', '⫗'),
				D('suplarr', '⥻'),
				D('supmult', '⫂'),
				D('supnE', '⫌'),
				D('supne', '⊋'),
				D('supplus', '⫀'),
				D('supset', '⊃'),
				D('Supset', '⋑'),
				D('supseteq', '⊇'),
				D('supseteqq', '⫆'),
				D('supsetneq', '⊋'),
				D('supsetneqq', '⫌'),
				D('supsim', '⫈'),
				D('supsub', '⫔'),
				D('supsup', '⫖'),
				D('swarhk', '⤦'),
				D('swarr', '↙'),
				D('swArr', '⇙'),
				D('swarrow', '↙'),
				D('swnwar', '⤪'),
				D('szlig', '\xdf'),
				D('Tab', '	'),
				D('target', '⌖'),
				D('Tau', 'Τ'),
				D('tau', 'τ'),
				D('tbrk', '⎴'),
				D('Tcaron', 'Ť'),
				D('tcaron', 'ť'),
				D('Tcedil', 'Ţ'),
				D('tcedil', 'ţ'),
				D('Tcy', 'Т'),
				D('tcy', 'т'),
				D('tdot', '⃛'),
				D('telrec', '⌕'),
				D('Tfr', '\uD835\uDD17'),
				D('tfr', '\uD835\uDD31'),
				D('there4', '∴'),
				D('therefore', '∴'),
				D('Therefore', '∴'),
				D('Theta', 'Θ'),
				D('theta', 'θ'),
				D('thetasym', 'ϑ'),
				D('thetav', 'ϑ'),
				D('thickapprox', '≈'),
				D('thicksim', '∼'),
				D('ThickSpace', '  '),
				D('ThinSpace', ' '),
				D('thinsp', ' '),
				D('thkap', '≈'),
				D('thksim', '∼'),
				D('THORN', '\xde'),
				D('thorn', '\xfe'),
				D('tilde', '˜'),
				D('Tilde', '∼'),
				D('TildeEqual', '≃'),
				D('TildeFullEqual', '≅'),
				D('TildeTilde', '≈'),
				D('timesbar', '⨱'),
				D('timesb', '⊠'),
				D('times', '\xd7'),
				D('timesd', '⨰'),
				D('tint', '∭'),
				D('toea', '⤨'),
				D('topbot', '⌶'),
				D('topcir', '⫱'),
				D('top', '⊤'),
				D('Topf', '\uD835\uDD4B'),
				D('topf', '\uD835\uDD65'),
				D('topfork', '⫚'),
				D('tosa', '⤩'),
				D('tprime', '‴'),
				D('trade', '™'),
				D('TRADE', '™'),
				D('triangle', '▵'),
				D('triangledown', '▿'),
				D('triangleleft', '◃'),
				D('trianglelefteq', '⊴'),
				D('triangleq', '≜'),
				D('triangleright', '▹'),
				D('trianglerighteq', '⊵'),
				D('tridot', '◬'),
				D('trie', '≜'),
				D('triminus', '⨺'),
				D('TripleDot', '⃛'),
				D('triplus', '⨹'),
				D('trisb', '⧍'),
				D('tritime', '⨻'),
				D('trpezium', '⏢'),
				D('Tscr', '\uD835\uDCAF'),
				D('tscr', '\uD835\uDCC9'),
				D('TScy', 'Ц'),
				D('tscy', 'ц'),
				D('TSHcy', 'Ћ'),
				D('tshcy', 'ћ'),
				D('Tstrok', 'Ŧ'),
				D('tstrok', 'ŧ'),
				D('twixt', '≬'),
				D('twoheadleftarrow', '↞'),
				D('twoheadrightarrow', '↠'),
				D('Uacute', '\xda'),
				D('uacute', '\xfa'),
				D('uarr', '↑'),
				D('Uarr', '↟'),
				D('uArr', '⇑'),
				D('Uarrocir', '⥉'),
				D('Ubrcy', 'Ў'),
				D('ubrcy', 'ў'),
				D('Ubreve', 'Ŭ'),
				D('ubreve', 'ŭ'),
				D('Ucirc', '\xdb'),
				D('ucirc', '\xfb'),
				D('Ucy', 'У'),
				D('ucy', 'у'),
				D('udarr', '⇅'),
				D('Udblac', 'Ű'),
				D('udblac', 'ű'),
				D('udhar', '⥮'),
				D('ufisht', '⥾'),
				D('Ufr', '\uD835\uDD18'),
				D('ufr', '\uD835\uDD32'),
				D('Ugrave', '\xd9'),
				D('ugrave', '\xf9'),
				D('uHar', '⥣'),
				D('uharl', '↿'),
				D('uharr', '↾'),
				D('uhblk', '▀'),
				D('ulcorn', '⌜'),
				D('ulcorner', '⌜'),
				D('ulcrop', '⌏'),
				D('ultri', '◸'),
				D('Umacr', 'Ū'),
				D('umacr', 'ū'),
				D('uml', '\xa8'),
				D('UnderBar', '_'),
				D('UnderBrace', '⏟'),
				D('UnderBracket', '⎵'),
				D('UnderParenthesis', '⏝'),
				D('Union', '⋃'),
				D('UnionPlus', '⊎'),
				D('Uogon', 'Ų'),
				D('uogon', 'ų'),
				D('Uopf', '\uD835\uDD4C'),
				D('uopf', '\uD835\uDD66'),
				D('UpArrowBar', '⤒'),
				D('uparrow', '↑'),
				D('UpArrow', '↑'),
				D('Uparrow', '⇑'),
				D('UpArrowDownArrow', '⇅'),
				D('updownarrow', '↕'),
				D('UpDownArrow', '↕'),
				D('Updownarrow', '⇕'),
				D('UpEquilibrium', '⥮'),
				D('upharpoonleft', '↿'),
				D('upharpoonright', '↾'),
				D('uplus', '⊎'),
				D('UpperLeftArrow', '↖'),
				D('UpperRightArrow', '↗'),
				D('upsi', 'υ'),
				D('Upsi', 'ϒ'),
				D('upsih', 'ϒ'),
				D('Upsilon', 'Υ'),
				D('upsilon', 'υ'),
				D('UpTeeArrow', '↥'),
				D('UpTee', '⊥'),
				D('upuparrows', '⇈'),
				D('urcorn', '⌝'),
				D('urcorner', '⌝'),
				D('urcrop', '⌎'),
				D('Uring', 'Ů'),
				D('uring', 'ů'),
				D('urtri', '◹'),
				D('Uscr', '\uD835\uDCB0'),
				D('uscr', '\uD835\uDCCA'),
				D('utdot', '⋰'),
				D('Utilde', 'Ũ'),
				D('utilde', 'ũ'),
				D('utri', '▵'),
				D('utrif', '▴'),
				D('uuarr', '⇈'),
				D('Uuml', '\xdc'),
				D('uuml', '\xfc'),
				D('uwangle', '⦧'),
				D('vangrt', '⦜'),
				D('varepsilon', 'ϵ'),
				D('varkappa', 'ϰ'),
				D('varnothing', '∅'),
				D('varphi', 'ϕ'),
				D('varpi', 'ϖ'),
				D('varpropto', '∝'),
				D('varr', '↕'),
				D('vArr', '⇕'),
				D('varrho', 'ϱ'),
				D('varsigma', 'ς'),
				D('varsubsetneq', '⊊︀'),
				D('varsubsetneqq', '⫋︀'),
				D('varsupsetneq', '⊋︀'),
				D('varsupsetneqq', '⫌︀'),
				D('vartheta', 'ϑ'),
				D('vartriangleleft', '⊲'),
				D('vartriangleright', '⊳'),
				D('vBar', '⫨'),
				D('Vbar', '⫫'),
				D('vBarv', '⫩'),
				D('Vcy', 'В'),
				D('vcy', 'в'),
				D('vdash', '⊢'),
				D('vDash', '⊨'),
				D('Vdash', '⊩'),
				D('VDash', '⊫'),
				D('Vdashl', '⫦'),
				D('veebar', '⊻'),
				D('vee', '∨'),
				D('Vee', '⋁'),
				D('veeeq', '≚'),
				D('vellip', '⋮'),
				D('verbar', '|'),
				D('Verbar', '‖'),
				D('vert', '|'),
				D('Vert', '‖'),
				D('VerticalBar', '∣'),
				D('VerticalLine', '|'),
				D('VerticalSeparator', '❘'),
				D('VerticalTilde', '≀'),
				D('VeryThinSpace', ' '),
				D('Vfr', '\uD835\uDD19'),
				D('vfr', '\uD835\uDD33'),
				D('vltri', '⊲'),
				D('vnsub', '⊂⃒'),
				D('vnsup', '⊃⃒'),
				D('Vopf', '\uD835\uDD4D'),
				D('vopf', '\uD835\uDD67'),
				D('vprop', '∝'),
				D('vrtri', '⊳'),
				D('Vscr', '\uD835\uDCB1'),
				D('vscr', '\uD835\uDCCB'),
				D('vsubnE', '⫋︀'),
				D('vsubne', '⊊︀'),
				D('vsupnE', '⫌︀'),
				D('vsupne', '⊋︀'),
				D('Vvdash', '⊪'),
				D('vzigzag', '⦚'),
				D('Wcirc', 'Ŵ'),
				D('wcirc', 'ŵ'),
				D('wedbar', '⩟'),
				D('wedge', '∧'),
				D('Wedge', '⋀'),
				D('wedgeq', '≙'),
				D('weierp', '℘'),
				D('Wfr', '\uD835\uDD1A'),
				D('wfr', '\uD835\uDD34'),
				D('Wopf', '\uD835\uDD4E'),
				D('wopf', '\uD835\uDD68'),
				D('wp', '℘'),
				D('wr', '≀'),
				D('wreath', '≀'),
				D('Wscr', '\uD835\uDCB2'),
				D('wscr', '\uD835\uDCCC'),
				D('xcap', '⋂'),
				D('xcirc', '◯'),
				D('xcup', '⋃'),
				D('xdtri', '▽'),
				D('Xfr', '\uD835\uDD1B'),
				D('xfr', '\uD835\uDD35'),
				D('xharr', '⟷'),
				D('xhArr', '⟺'),
				D('Xi', 'Ξ'),
				D('xi', 'ξ'),
				D('xlarr', '⟵'),
				D('xlArr', '⟸'),
				D('xmap', '⟼'),
				D('xnis', '⋻'),
				D('xodot', '⨀'),
				D('Xopf', '\uD835\uDD4F'),
				D('xopf', '\uD835\uDD69'),
				D('xoplus', '⨁'),
				D('xotime', '⨂'),
				D('xrarr', '⟶'),
				D('xrArr', '⟹'),
				D('Xscr', '\uD835\uDCB3'),
				D('xscr', '\uD835\uDCCD'),
				D('xsqcup', '⨆'),
				D('xuplus', '⨄'),
				D('xutri', '△'),
				D('xvee', '⋁'),
				D('xwedge', '⋀'),
				D('Yacute', '\xdd'),
				D('yacute', '\xfd'),
				D('YAcy', 'Я'),
				D('yacy', 'я'),
				D('Ycirc', 'Ŷ'),
				D('ycirc', 'ŷ'),
				D('Ycy', 'Ы'),
				D('ycy', 'ы'),
				D('yen', '\xa5'),
				D('Yfr', '\uD835\uDD1C'),
				D('yfr', '\uD835\uDD36'),
				D('YIcy', 'Ї'),
				D('yicy', 'ї'),
				D('Yopf', '\uD835\uDD50'),
				D('yopf', '\uD835\uDD6A'),
				D('Yscr', '\uD835\uDCB4'),
				D('yscr', '\uD835\uDCCE'),
				D('YUcy', 'Ю'),
				D('yucy', 'ю'),
				D('yuml', '\xff'),
				D('Yuml', 'Ÿ'),
				D('Zacute', 'Ź'),
				D('zacute', 'ź'),
				D('Zcaron', 'Ž'),
				D('zcaron', 'ž'),
				D('Zcy', 'З'),
				D('zcy', 'з'),
				D('Zdot', 'Ż'),
				D('zdot', 'ż'),
				D('zeetrf', 'ℨ'),
				D('ZeroWidthSpace', '​'),
				D('Zeta', 'Ζ'),
				D('zeta', 'ζ'),
				D('zfr', '\uD835\uDD37'),
				D('Zfr', 'ℨ'),
				D('ZHcy', 'Ж'),
				D('zhcy', 'ж'),
				D('zigrarr', '⇝'),
				D('zopf', '\uD835\uDD6B'),
				D('Zopf', 'ℤ'),
				D('Zscr', '\uD835\uDCB5'),
				D('zscr', '\uD835\uDCCF'),
				D('zwj', '‍'),
				D('zwnj', '‌')
			])
		),
		uH = o(
			up,
			function (r) {
				return o(eg, '&' + r + ';', o(er, r, uU));
			},
			e4(e5(nW))
		),
		uB = function (r) {
			return o(j, r, '');
		},
		uI = function (r) {
			return 0 > r || r > 1114111
				? '�'
				: r > 65535
					? String.fromCharCode(Math.floor((r -= 65536) / 1024) + 55296, (r % 1024) + 56320)
					: String.fromCharCode(r);
		},
		uj = e(function (r, n, t) {
			for (;;) {
				if (!n.b) return nB(t);
				var e = n.a,
					u = n.b;
				switch (e) {
					case '0':
						(r = a = r - 1), (n = c = u), (t = i = t);
						continue;
					case '1':
						var a = r - 1,
							c = u,
							i = t + o(H, 16, r);
						(r = a), (n = c), (t = i);
						continue;
					case '2':
						(a = r - 1), (c = u), (i = t + 2 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '3':
						(a = r - 1), (c = u), (i = t + 3 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '4':
						(a = r - 1), (c = u), (i = t + 4 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '5':
						(a = r - 1), (c = u), (i = t + 5 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '6':
						(a = r - 1), (c = u), (i = t + 6 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '7':
						(a = r - 1), (c = u), (i = t + 7 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '8':
						(a = r - 1), (c = u), (i = t + 8 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case '9':
						(a = r - 1), (c = u), (i = t + 9 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'a':
						(a = r - 1), (c = u), (i = t + 10 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'b':
						(a = r - 1), (c = u), (i = t + 11 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'c':
						(a = r - 1), (c = u), (i = t + 12 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'd':
						(a = r - 1), (c = u), (i = t + 13 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'e':
						(a = r - 1), (c = u), (i = t + 14 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					case 'f':
						(a = r - 1), (c = u), (i = t + 15 * o(H, 16, r)), (r = a), (n = c), (t = i);
						continue;
					default:
						return nR(uB(e) + ' is not a valid hexadecimal character.');
				}
			}
		}),
		u_ = t(function (r, n) {
			return n.$ ? nR(n.a) : nB(r(n.a));
		}),
		uV = t(function (r, n) {
			return n.$ ? nR(r(n.a)) : nB(n.a);
		}),
		uF = function (r) {
			return f(V, A, q, r);
		},
		uz = function (r) {
			if (tw(r)) return nR('Empty strings are not valid hexadecimal strings.');
			var n = (function () {
				if (o(J, '-', r)) {
					var n,
						t = o(eg, q, (n = uF(r)).b ? nj(n.b) : n_);
					return o(u_, eK, f(uj, nM(t) - 1, t, 0));
				}
				return f(uj, tD(r) - 1, uF(r), 0);
			})();
			return o(
				uV,
				function (n) {
					return o(nF, ' ', k(['"' + r + '"', 'is not a valid hexadecimal string because', n]));
				},
				n
			);
		},
		uP = function (r) {
			var n = nK(r);
			return (n >= 48 && 57 >= n) || (n >= 65 && 70 >= n) || (n >= 97 && 102 >= n);
		},
		uG = o(
			ez,
			function (r) {
				var n = uz(ue(r));
				return n.$ ? un(n.a) : ut(n.a);
			},
			e4(e5(uP))
		),
		uM = { $: 1 },
		uJ = t(function (r, n) {
			return { by: n.by + (r - n.b), d: n.d, e: n.e, b: r, dO: n.dO, cv: n.cv };
		}),
		uZ = t(function (r, n) {
			if (f(nh, 101, r, n) || f(nh, 69, r, n)) {
				var t = r + 1,
					e = f(nh, 43, t, n) || f(nh, 45, t, n) ? t + 1 : t,
					u = o(nm, e, n);
				return v(e, u) ? -u : u;
			}
			return r;
		}),
		uQ = t(function (r, n) {
			return o(uZ, f(nh, 46, r, n) ? o(nm, r + 1, n) : r, n);
		}),
		uK = a(function (r, n, t, e, u) {
			var a = e.a,
				c = e.b;
			if (1 === n.$) return o(eV, !0, o(eQ, u, n.a));
			var i = n.a;
			return v(t, a) ? o(eV, 0 > h(u.b, t), o(eQ, u, r)) : f(eF, !0, i(c), o(uJ, a, u));
		}),
		uY = function (r) {
			if (0 === r.length || /[\sxbo]/.test(r)) return n_;
			var n = +r;
			return n == n ? nj(n) : n_;
		},
		uX = c(function (r, n, t, e, u, a) {
			var c = u.a,
				i = o(uQ, c, a.cv);
			if (0 > i) return o(eV, !0, s(uc, a.dO, a.by - (i + a.b), r, a.d));
			if (v(a.b, i)) return o(eV, !1, o(eQ, a, n));
			if (v(c, i)) return l(uK, r, t, a.b, u, a);
			if (1 === e.$) return o(eV, !0, o(eQ, a, r));
			var b = e.a,
				d = uY(f(P, a.b, i, a.cv));
			return 1 === d.$ ? o(eV, !0, o(eQ, a, r)) : f(eF, !0, b(d.a), o(uJ, i, a));
		}),
		uW = o(
			t(function (r, n) {
				var t;
				return (
					(t = { bu: nR(n), bJ: r, bK: nR(n), bP: nR(n), bU: nB(tm), df: n, b5: nR(n) }),
					function (r) {
						if (f(nh, 48, r.b, r.cv)) {
							var n = r.b + 1,
								e = n + 1;
							return f(nh, 120, n, r.cv)
								? l(uK, t.df, t.bP, e, o(n$, e, r.cv), r)
								: f(nh, 111, n, r.cv)
									? l(uK, t.df, t.b5, e, f(nD, 8, e, r.cv), r)
									: f(nh, 98, n, r.cv)
										? l(uK, t.df, t.bu, e, f(nD, 2, e, r.cv), r)
										: b(uX, t.df, t.bJ, t.bU, t.bK, D(n, 0), r);
						}
						return b(uX, t.df, t.bJ, t.bU, t.bK, f(nD, 10, r.b, r.cv), r);
					}
				);
			}),
			uM,
			uM
		),
		u1 =
			((tR = uL(
				k([
					o(
						ul,
						o(
							e3,
							ut(tm),
							eX(function (r) {
								return 'x' === r || 'X' === r;
							})
						),
						uG
					),
					o(ul, o(e3, ut(tm), e1(g('0'))), uW)
				])
			)),
			o(ul, o(e3, ut(tm), eX(g('#'))), o(up, o(eS, uI, uB), tR))),
		u0 = o(ul, o(e3, ut(tm), eX(g('&'))), uL(k([o(e3, eP(uH), uR), o(e3, eP(u1), uR), ut('&')]))),
		u2 = function (r) {
			return o(
				ul,
				o(e3, ut(tm), eX(g(r))),
				o(
					e3,
					o(
						up,
						nF(''),
						uN(
							uL(
								k([
									e4(
										e5(function (n) {
											return !v(n, r) && '&' !== n;
										})
									),
									u0
								])
							)
						)
					),
					eX(g(r))
				)
			);
		},
		u3 = function (r) {
			return !r.b;
		},
		u5 = t(function (r, n) {
			return o(uk, q, function (t) {
				return uL(
					k([
						o(
							up,
							function (r) {
								return uw(o(A, r, t));
							},
							n
						),
						u3(t) ? un('expecting at least one ' + r) : ut(u$(n2(t)))
					])
				);
			});
		}),
		u8 = o(
			up,
			nF(''),
			o(
				u5,
				'attribute value',
				uL(
					k([
						e4(
							e5(function (r) {
								return (
									!e6(r) &&
									'"' !== r &&
									"'" !== r &&
									'=' !== r &&
									'<' !== r &&
									'>' !== r &&
									'`' !== r &&
									'&' !== r
								);
							})
						),
						u0
					])
				)
			)
		),
		u4 = uL(
			k([o(ul, o(e3, o(e3, ut(tm), eX(g('='))), e1(e6)), uL(k([u8, u2('"'), u2("'")]))), ut('')])
		),
		u6 = uN(o(ul, o(ul, ut(tP), o(e3, uT, e1(e6))), o(e3, u4, e1(e6)))),
		u9 = o(
			up,
			ue,
			e4(
				o(
					e3,
					eX(n0),
					e1(function (r) {
						return n0(r) || '-' === r;
					})
				)
			)
		),
		u7 = function (r) {
			return { $: 0, a: r };
		},
		ar = o(
			up,
			o(eS, nF(''), u7),
			o(
				u5,
				'text element',
				uL(
					k([
						e4(
							e5(function (r) {
								return '<' !== r && '&' !== r;
							})
						),
						u0
					])
				)
			)
		);
	function an() {
		return uL(k([ar, ug, at()]));
	}
	function at() {
		return o(
			ez,
			function (r) {
				var n = r.a,
					t = r.b;
				return o(um, n, uD)
					? o(e3, o(e3, ut(f(e_, n, t, q)), uL(k([eX(g('/')), ut(0)]))), eX(g('>')))
					: o(ul, o(e3, ut(o(e_, n, t)), eX(g('>'))), o(e3, uN(eP(an())), uu(n)));
			},
			o(ul, o(ul, o(e3, ut(tP), eX(g('<'))), o(e3, u9, e1(e6))), u6)
		);
	}
	var ae = an();
	an = function () {
		return ae;
	};
	var au = at();
	at = function () {
		return au;
	};
	var aa = e(function (r, n, t) {
			return { by: n, dF: t, dO: r };
		}),
		ac = function (r) {
			return f(aa, r.dO, r.by, r.dF);
		},
		ai = t(function (r, n) {
			for (;;)
				switch (r.$) {
					case 0:
						return n;
					case 1:
						var t = r.b;
						(r = r.a), (n = o(A, t, n));
						continue;
					default:
						var e = r.b;
						(r = r.a), (n = o(ai, e, n));
						continue;
				}
		}),
		ao = t(function (r, n) {
			var t = r({ by: 1, d: q, e: 1, b: 0, dO: 1, cv: n });
			return t.$ ? nR(o(ai, t.b, q)) : nB(t.b);
		}),
		af = t(function (r, n) {
			var t = o(ao, r, n);
			return t.$ ? nR(o(tE, ac, t.a)) : nB(t.a);
		}),
		as = o(
			re,
			function (r) {
				return 1 === r.$ ? ej : tg({ $: 1, a: r.a });
			},
			o(
				tv,
				function (r) {
					return tw(r) ? nB(q) : o(af, o(u5, 'node', ae), r);
				},
				o(rn, 'formatted_body', rr)
			)
		),
		al = o(
			re,
			function (r) {
				return r.$ || 'org.matrix.custom.html' !== r.a ? ej : as;
			},
			eE(o(rn, 'format', rr))
		),
		ab = e(function (r, n, t) {
			return { cS: r, a1: t, ef: n };
		}),
		ad = f(
			tp,
			t(function (r, n) {
				return { aB: n, aQ: r };
			}),
			o(rn, 'w', K),
			o(rn, 'h', K)
		),
		av = l(
			ri,
			u(function (r, n, t, e) {
				return { aB: n, cB: e, cC: t, aQ: r };
			}),
			o(rn, 'w', K),
			o(rn, 'h', K),
			eE(o(rn, 'thumbnail_url', rr)),
			eE(o(rn, 'thumbnail_info', ad))
		),
		ap = s(rc, ab, o(rn, 'body', rr), o(rn, 'url', rr), eE(o(rn, 'info', av))),
		ag = f(
			tp,
			t(function (r, n) {
				return { cS: r, ef: n };
			}),
			o(rn, 'body', rr),
			o(rn, 'url', rr)
		),
		ah = o(
			re,
			function (r) {
				switch (r) {
					case 'm.text':
						return o(tv, eU, al);
					case 'm.emote':
						return o(tv, eN, al);
					case 'm.notice':
						return o(tv, eO, al);
					case 'm.image':
						return o(tv, eR, ap);
					case 'm.file':
						return o(tv, eT, eI);
					case 'm.audio':
						return o(tv, eL, eB);
					case 'm.video':
						return o(tv, eH, ag);
					default:
						return eA('Unsupported msgtype: ' + r);
				}
			},
			o(rn, 'msgtype', rr)
		),
		am = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		aD = { $: 10 },
		a$ = function (r) {
			return function (n) {
				return v(tD(n.cv), n.b) ? f(eF, !1, 0, n) : o(eV, !1, o(eQ, n, r));
			};
		},
		aw = a$(aD),
		ax = function (r) {
			return nY(r) || n1(r) || o(um, r, k(['-', '.', '=', '_', '/']));
		},
		ay = function (r) {
			return n0(r) || o(um, r, k(['.', '-', ':']));
		},
		aq = { $: 7 },
		aS = t(function (r, n) {
			return !o(er, r, n).$;
		}),
		aA = t(function (r, n) {
			return o(aS, r, n);
		}),
		ak = i(function (r, n, t, e, u, a, c) {
			for (;;) {
				var i = f(ng, r, n, u);
				if (v(i, -1)) return { by: e, d: c, e: a, b: n, dO: t, cv: u };
				v(i, -2) ? ((n += 1), (t += 1), (e = 1)) : ((n = i), (e += 1));
			}
		}),
		aE = function (r) {
			var n;
			return (
				(n = { bJ: aq, de: r.de, dJ: r.dJ, dS: r.dS }),
				function (r) {
					var t = f(ng, n.dS, r.b, r.cv);
					if (v(t, -1)) return o(eV, !1, o(eQ, r, n.bJ));
					var e = v(t, -2)
							? d(ak, n.de, r.b + 1, r.dO + 1, 1, r.cv, r.e, r.d)
							: d(ak, n.de, t, r.dO, r.by + 1, r.cv, r.e, r.d),
						u = f(P, r.b, e.b, r.cv);
					return o(aA, u, n.dJ) ? o(eV, !1, o(eQ, r, n.bJ)) : f(eF, !0, u, e);
				}
			);
		},
		aC = o(
			ul,
			o(ul, o(e3, ut(am), ud('@')), o(e3, aE({ de: ax, dJ: t6, dS: ax }), ud(':'))),
			o(e3, aE({ de: ay, dJ: t6, dS: ay }), aw)
		),
		aL = o(
			eS,
			ue,
			o(
				eS,
				af(aC),
				uV(function () {
					return 'Must follow format: @user:example.com';
				})
			)
		),
		aN = re(function (r) {
			var n = aL(r);
			return n.$ ? eA(n.a) : tg(n.a);
		}),
		aT = t(function (r, n) {
			return l(
				ri,
				r,
				o(rn, 'type', rr),
				o(rn, 'content', n),
				aN(o(rn, 'sender', rr)),
				o(tv, tm, o(rn, 'origin_server_ts', K))
			);
		}),
		aR = tz(
			k([
				o(
					re,
					function (r) {
						switch (r) {
							case 'm.room.message':
								return o(
									aT,
									u(function (r, n, t, e) {
										return { $: 0, a: { ae: n, aA: r, _: e, aL: t } };
									}),
									ah
								);
							case 'm.room.member':
								return o(
									re,
									function (r) {
										return o(
											aT,
											u(function (n, t, e, u) {
												return o(eq, r, { ae: t, aA: n, _: u, aL: e });
											}),
											eC
										);
									},
									o(
										re,
										o(eS, aL, o(eS, u_(tg), tM(eA('Invalid userid in m.room.member state_key.')))),
										o(rn, 'state_key', rr)
									)
								);
							default:
								return eA('Unsupported event type: ' + r);
						}
					},
					o(rn, 'type', rr)
				),
				o(
					aT,
					u(function (r, n, t, e) {
						return { $: 2, a: { ae: n, aA: r, _: e, aL: t } };
					}),
					tg(0)
				)
			])
		),
		aO = function (r) {
			return { $: 3, b: r };
		},
		aU = s(
			rc,
			e(function (r, n, t) {
				return { bx: t, bH: n, dS: r };
			}),
			o(rn, 'start', rr),
			eE(o(rn, 'end', rr)),
			o(rn, 'chunk', aO(aR))
		),
		aH = { $: 0 },
		aB = t(function (r, n) {
			return o(ey, r, {
				cS: aH,
				dk: 'GET',
				dD: q,
				dE: k(['rooms', n, 'initialSync']),
				dL: o(rn, 'messages', aU)
			});
		}),
		aI = f(
			tp,
			t(function (r, n) {
				return D(r, n);
			}),
			o(rn, 'state_key', rr),
			o(rn, 'content', eC)
		),
		aj = o(rn, 'chunk', o(re, o(eS, uO, tg), aO(aI))),
		a_ = t(function (r, n) {
			return o(ey, r, { cS: aH, dk: 'GET', dD: q, dE: k(['rooms', n, 'members']), dL: aj });
		}),
		aV = t(function (r, n) {
			return o(ey, r, {
				cS: aH,
				dk: 'GET',
				dD: q,
				dE: k(['directory', 'room', n]),
				dL: o(tv, tm, o(rn, 'room_id', rr))
			});
		}),
		aF = function (r) {
			return r;
		},
		az = function (r) {
			return o(
				L,
				function (r) {
					switch (r.$) {
						case 0:
						default:
							return r.a._;
						case 1:
							return r.b._;
					}
				},
				r
			);
		},
		aP = t(function (r, n) {
			return o(
				tC,
				tm,
				o(
					rx,
					function (n) {
						return o(
							tC,
							function (r) {
								return { bH: n.bH, C: n.C, b$: r, dN: n.dN, F: n.F, dS: n.dS };
							},
							o(a_, r, n.F)
						);
					},
					o(
						rx,
						function (n) {
							return o(
								tC,
								function (r) {
									var t;
									return {
										bH: 1 === (t = r.bH).$ ? r.dS : t.a,
										C: az(r.bx),
										dN: n.dN,
										F: n.F,
										dS: r.dS
									};
								},
								o(aB, r, n.F)
							);
						},
						o(
							tC,
							function (r) {
								return { dN: n, F: r };
							},
							o(aV, r, n)
						)
					)
				)
			);
		}),
		aG = { V: '', ai: '' },
		aM = {
			Q: n_,
			a4: n_,
			am: '',
			I: 2,
			aO: o(
				uV,
				function () {
					return "Something's wrong with the user ID parser";
				},
				aL('@alice:example.com')
			),
			bp: ''
		},
		aJ = t(function (r, n) {
			return o(ey, r, {
				cS: o(nv, 'application/json', '{}'),
				dk: 'POST',
				dD: q,
				dE: k(['join', n]),
				dL: tg(0)
			});
		}),
		aZ = function (r) {
			return r.aC;
		},
		aQ = t(function (r, n) {
			return 1 === aZ(r) ? o(aJ, r, n) : r$(0);
		}),
		aK = rI(q),
		aY = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		aX = rw(function (r) {
			r(r$(tm(Date.now())));
		}),
		aW = n(
			9,
			(ot = function (r, n, t, e, u, a, c, i, o) {
				return { bz: e, aR: r, aV: i, a3: c, a9: a, cp: n, cr: t, cw: u, bo: o };
			}),
			function (r) {
				return function (n) {
					return function (t) {
						return function (e) {
							return function (u) {
								return function (a) {
									return function (c) {
										return function (i) {
											return function (o) {
												return ot(r, n, t, e, u, a, c, i, o);
											};
										};
									};
								};
							};
						};
					};
				};
			}
		),
		a1 = tz(
			k([
				o(tv, nj, Y),
				o(
					tv,
					nj,
					o(
						re,
						function (r) {
							switch (ue(r)) {
								case 'true':
									return tg(!0);
								case 'false':
									return tg(!1);
								default:
									return eA('');
							}
						},
						rr
					)
				)
			])
		),
		a0 = o(
			re,
			function (r) {
				return o(M, ' ', r) ? eA("commentSectionId can't contain spaces") : tg(r);
			},
			o(
				re,
				function (r) {
					return o(M, '_', r) ? eA("commentSectionId can't contain underscores") : tg(r);
				},
				rr
			)
		),
		a2 = tz(k([o(tv, nj, X), o(tv, uY, rr)])),
		a3 = tz(k([o(tv, nj, K), o(tv, ty, rr)])),
		a5 = a(function (r, n, t, e, u) {
			return { U: u, bQ: r, aC: n, aq: t, aO: e };
		}),
		a8 = o(
			re,
			function (r) {
				switch (r) {
					case 'guest':
						return tg(0);
					case 'user':
						return tg(1);
					default:
						return eA(r + ' is not a valid Session.Kind');
				}
			},
			rr
		),
		a4 = o(
			tv,
			tm,
			b(
				ro,
				a5,
				o(rn, 'homeserverUrl', rr),
				o(rn, 'kind', a8),
				o(rn, 'txnId', K),
				aN(o(rn, 'userId', rr)),
				o(rn, 'accessToken', rr)
			)
		),
		a6 = function (r) {
			return { $: 5, c: r };
		},
		a9 = tp(te),
		a7 = e(function (r, n, t) {
			return o(
				re,
				function (e) {
					var u = o(rs, r, e);
					if (u.$) return tg(t);
					var a = u.a,
						c = o(rs, tz(k([n, a6(t)])), a);
					return c.$ ? eA(n5(c.a)) : tg(c.a);
				},
				W
			);
		}),
		cr = u(function (r, n, t, e) {
			return o(a9, f(a7, o(rn, r, W), n, t), e);
		}),
		cn = e(function (r, n, t) {
			return o(a9, o(rn, r, n), t);
		}),
		ct = s(
			cr,
			'updateInterval',
			a2,
			n_,
			s(
				cr,
				'guestPostingEnabled',
				a1,
				n_,
				s(
					cr,
					'loginEnabled',
					a1,
					n_,
					s(
						cr,
						'pageSize',
						a3,
						n_,
						s(
							cr,
							'storedSession',
							tz(k([a6(n_), o(tv, nj, a4)])),
							n_,
							f(
								cn,
								'commentSectionId',
								a0,
								f(
									cn,
									'siteName',
									rr,
									f(cn, 'serverName', rr, f(cn, 'defaultHomeserverUrl', rr, tg(aW)))
								)
							)
						)
					)
				)
			)
		),
		ce = c(function (r, n, t, e, u, a) {
			return { aR: r, aV: u, a3: e, a9: t, dN: n, bo: a };
		}),
		cu = function (r) {
			return D(
				b(
					ce,
					r.aR,
					'#comments_' + r.cr + '_' + r.bz + ':' + r.cp,
					o(eg, 10, r.a9),
					o(eg, !0, r.a3),
					o(eg, !0, r.aV),
					o(eg, 0, r.bo)
				),
				r.cw
			);
		},
		ca = t(function (r, n) {
			return o(tv, tm, f(tp, f(a5, r, n, 0), aN(o(rn, 'user_id', rr)), o(rn, 'access_token', rr)));
		}),
		cc = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		ci = t(function (r, n) {
			return o(cc, e$(r), e$(n));
		}),
		co = function (r) {
			return eh({ U: n_, cS: r.cS, dk: r.dk, dL: r.dL, ef: r.ef });
		},
		cf = function (r) {
			return co({
				cS: o(nv, 'application/json', '{}'),
				dk: 'POST',
				dL: o(ca, r, 0),
				ef: f(ex, r, k(['register']), k([o(ci, 'kind', 'guest')]))
			});
		},
		cs = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		cl = t(function (r, n) {
			return { cd: n, cA: r };
		}),
		cb = r$(o(cl, t6, t6)),
		cd = t(function (r, n) {
			var t = r.a,
				e = r.b,
				u = o(er, t, n);
			return f(eu, t, 1 === u.$ ? k([e]) : o(A, e, u.a), n);
		}),
		cv = e(function (r, n, t) {
			for (;;) {
				if (-2 === t.$) return n;
				var e = t.e,
					u = r,
					a = f(r, t.b, t.c, f(cv, r, n, t.d));
				(r = u), (n = a), (t = e);
			}
		}),
		cp = c(function (r, n, u, a, c, i) {
			var o = f(
					cv,
					e(function (t, e, a) {
						for (;;) {
							var c = a.a,
								i = a.b;
							if (c.b) {
								var o = c.a,
									l = o.a,
									b = o.b,
									d = c.b;
								if (0 > h(l, t)) {
									a = D(d, f(r, l, b, i));
									continue;
								}
								return h(l, t) > 0 ? D(c, f(u, t, e, i)) : D(d, s(n, l, b, e, i));
							}
							return D(c, f(u, t, e, i));
						}
					}),
					D(nT(a), i),
					c
				),
				l = o.a,
				b = o.b;
			return f(
				nG,
				t(function (n, t) {
					return f(r, n.a, n.b, t);
				}),
				b,
				l
			);
		}),
		cg = e(function (r, n, t) {
			if (n.b) {
				var e = n.a,
					u = n.b,
					a = rA(o(nx, e, o(t7, r, e)));
				return o(
					rx,
					function (n) {
						return f(cg, r, u, f(eu, e, n, t));
					},
					a
				);
			}
			return r$(t);
		});
	rR.Time = rO(
		cb,
		e(function (r, n, t) {
			var a = t.cd,
				c = e(function (r, n, t) {
					var e = t.c;
					return $(
						t.a,
						t.b,
						o(
							rx,
							function () {
								return e;
							},
							rw(function (r) {
								var t = n.f;
								2 === t.$ && t.c && t.c(), (n.f = null), r(r$(0));
							})
						)
					);
				}),
				i = f(nG, cd, t6, n),
				s = b(
					cp,
					e(function (r, n, t) {
						var e = t.b,
							u = t.c;
						return $(o(A, r, t.a), e, u);
					}),
					u(function (r, n, t, e) {
						var u = e.c;
						return $(e.a, f(eu, r, t, e.b), u);
					}),
					c,
					i,
					a,
					$(q, t6, r$(0))
				),
				l = s.a,
				d = s.b;
			return o(
				rx,
				function (r) {
					return r$(o(cl, i, r));
				},
				o(
					rx,
					function () {
						return f(cg, r, l, d);
					},
					s.c
				)
			);
		}),
		e(function (r, n, t) {
			var e = o(er, n, t.cA);
			if (1 === e.$) return r$(t);
			var u = e.a;
			return o(
				rx,
				function () {
					return r$(t);
				},
				o(
					rx,
					function (n) {
						return tN(
							o(
								tE,
								function (t) {
									return o(rU, r, t(n));
								},
								u
							)
						);
					},
					aX
				)
			);
		}),
		0,
		t(function (r, n) {
			return o(cs, n.a, o(tj, r, n.b));
		})
	);
	var ch = rB('Time'),
		cm = t(function (r, n) {
			return ch(o(cs, r, n));
		}),
		cD = function (r) {
			return r;
		},
		c$ = rI(q),
		cw = e(function (r, n, t) {
			return { $: 7, a: r, b: n, c: t };
		}),
		cx = function (r) {
			return { $: 4, a: r };
		},
		cy = t(function (r, n) {
			return { $: 10, a: r, b: n };
		}),
		cq = t(function (r, n) {
			var t;
			return o(
				A,
				{
					X: o(
						eg,
						0,
						o(
							tQ,
							O(1),
							(t = o(
								tE,
								function (r) {
									return r.X;
								},
								r
							)).b
								? nj(f(nG, tc, t.a, t.b))
								: n_
						)
					),
					aF: n
				},
				r
			);
		}),
		cS = function (r) {
			return f(
				nG,
				t(function (r, n) {
					return r.$ ? n : o(A, r.a, n);
				}),
				q,
				r
			);
		},
		cA = t(function (r, n) {
			return f(
				tk,
				t(function (n, t) {
					return r(n) ? o(A, n, t) : t;
				}),
				q,
				n
			);
		}),
		ck = u(function (r, n, t, e) {
			return o(ey, r, {
				cS: aH,
				dk: 'GET',
				dD: k([o(ci, 'from', e), o(ci, 'dir', t ? 'f' : 'b')]),
				dE: k(['rooms', n, 'messages']),
				dL: aU
			});
		}),
		cE = t(function (r, n) {
			return s(ck, r, n.F, 1, n.bH);
		}),
		cC = t(function (r, n) {
			return s(ck, r, n.F, 0, n.dS);
		}),
		cL = e(function (r, n, t) {
			return 1 === n.$ || 1 === t.$ ? n_ : nj(o(r, n.a, t.a));
		}),
		cN = t(function (r, n) {
			var t = n.b;
			return D(r(n.a), t);
		}),
		cT = t(function (r, n) {
			var t;
			return w(r, { bH: 1 === (t = n.bH).$ ? r.bH : t.a, C: az(y(r.C, n.bx)) });
		}),
		cR = t(function (r, n) {
			var t;
			return w(r, { C: az(y(r.C, n.bx)), dS: 1 === (t = n.bH).$ ? n.dS : t.a });
		}),
		cO = e(function (r, n, t) {
			return o(1 === n ? cT : cR, r, t);
		}),
		cU = function (r) {
			return o(nv, 'application/json', o(rm, 0, r));
		},
		cH = t(function (r, n) {
			return n.$ ? n_ : r(n.a);
		}),
		cB = function (r) {
			return { $: 4, a: r };
		},
		cI = function (r) {
			return { $: 7, a: r };
		},
		cj = function (r) {
			return { $: 5, a: r };
		},
		c_ = { $: 0 },
		cV = { $: 8 },
		cF = t(function (r, n) {
			return { $: 4, a: r, b: n };
		}),
		cz = function (r) {
			return { $: 2, a: r };
		},
		cP = function (r) {
			return { $: 0, a: r };
		},
		cG = function (r) {
			return { $: 1, a: r };
		},
		cM = t(function (r, n) {
			return { $: 3, a: r, b: n };
		}),
		cJ = e(function (r, n, t) {
			return { $: 0, a: r, b: n, c: t };
		}),
		cZ = e(function (r, n, t) {
			return { $: 2, a: r, b: n, c: t };
		}),
		cQ = function (r) {
			return { $: 2, a: r };
		},
		cK = e(function (r, n, t) {
			return { $: 1, a: r, b: n, c: t };
		}),
		cY = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		cX = function (r) {
			return { $: 1, a: r };
		},
		cW = t(function (r, n) {
			return { $: 2, a: r, b: n };
		}),
		c1 = function (r) {
			return { $: 5, a: r };
		},
		c0 = function (r) {
			return { $: 1, a: r };
		},
		c2 = function (r) {
			return { $: 2, a: r };
		},
		c3 = t(function (r, n) {
			return { $: 6, a: r, b: n };
		}),
		c5 = { $: 8 },
		c8 = { $: 7 },
		c4 = t(function (r, n) {
			return { R: o(A, n, r.R), H: r.H };
		}),
		c6 = { $: 10 },
		c9 = function (r) {
			switch (r) {
				case ' ':
				case '	':
					return !0;
				default:
					return !1;
			}
		},
		c7 = o(uf, '\r', uo('a carriage return')),
		ir = o(uf, '\n', uo('a newline')),
		it = uL(k([ub(ir), o(e3, ub(c7), uL(k([ub(ir), ut(0)])))])),
		ie = o(
			up,
			function () {
				return c6;
			},
			o(e3, eP(e1(c9)), it)
		),
		iu = function (r) {
			return { $: 11, a: r };
		},
		ia = o(uf, ' ', uo('a space')),
		ic = k([
			ub(o(uf, '>', uo('>'))),
			o(
				e3,
				eP(ub(ia)),
				uL(k([ub(o(uf, '>', uo(' >'))), ub(o(uf, ' >', uo('  >'))), ub(o(uf, '  >', uo('   >')))]))
			)
		]),
		ii = function (r) {
			switch (r) {
				case '\n':
				case '\r':
					return !0;
				default:
					return !1;
			}
		},
		io = e1(o(tj, e9, ii)),
		is = a$(uo('the end of the input')),
		il = uL(k([it, is])),
		ib = o(ul, o(e3, o(e3, ut(iu), uL(ic)), uL(k([ub(ia), ut(0)]))), o(e3, e4(io), il)),
		id = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		iv = function (r) {
			return { $: 6, a: r };
		},
		ip = function (r) {
			return { $: 8, a: r };
		},
		ig = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		ih = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		im = e(function (r, n, t) {
			var e = D(n, t);
			return '' === e.a ? t : '' === e.b ? n : y(n, y(r, t));
		}),
		iD = t(function (r, n) {
			return r + '\n' + n;
		}),
		i$ = function (r) {
			return ub(o(uf, r, uo(r)));
		},
		iw = function (r) {
			return r.trim();
		},
		ix = o(
			up,
			o(
				nG,
				t(function (r, n) {
					return o(A, iw(r), n);
				}),
				q
			),
			o(uy, D(n_, q), function (r) {
				var n = r.a,
					e = r.b,
					u = o(
						eg,
						uq(e),
						o(
							tQ,
							function (r) {
								return uq(o(A, r, e));
							},
							n
						)
					),
					a = o(
						eg,
						uS(D(n_, e)),
						o(
							tQ,
							function (r) {
								return uS(D(n_, o(A, r, e)));
							},
							n
						)
					),
					c = function (r) {
						return uS(D(nj(y(o(eg, '', n), r)), e));
					};
				return uL(
					k([
						o(
							up,
							function () {
								return u;
							},
							i$('|\n')
						),
						o(
							up,
							function () {
								return u;
							},
							i$('\n')
						),
						o(
							up,
							function () {
								return u;
							},
							a$(uo('end'))
						),
						o(e3, eP(ut(c('|'))), i$('\\\\|')),
						o(e3, eP(ut(c('\\'))), i$('\\\\')),
						o(e3, eP(ut(c('|'))), i$('\\|')),
						o(e3, eP(ut(a)), i$('|')),
						o(
							e8,
							t(function (r) {
								return c(r);
							}),
							o(eY, e0(!0), e7('No character found'))
						)
					])
				);
			})
		),
		iy = o(ul, o(e3, ut(tm), uL(k([i$('|'), ut(0)]))), ix),
		iq = t(function (r, n) {
			var e,
				u = r.b,
				a = o(ao, iy, n);
			return a.$
				? nR('Unable to parse previous line as a table header')
				: v(nM((e = a.a)), nM(u))
					? nB(
							f(
								C,
								t(function (r, n) {
									return { at: n, Y: r };
								}),
								e,
								u
							)
						)
					: nR(
							'Tables must have the same number of header columns (' +
								nV(nM(e)) +
								') as delimiter columns (' +
								nV(nM(u)) +
								')'
						);
		}),
		iS = t(function (r, n) {
			return {
				R: r.R,
				H: (function () {
					var t = D(n, r.H);
					r: for (; t.b.b; )
						switch (t.b.a.$) {
							case 5:
								if (5 === t.a.$) {
									var e = t.b,
										u = e.b;
									return o(A, cj({ cS: o(iD, e.a.a.cS, t.a.a.cS), dg: n_ }), u);
								}
								break r;
							case 6:
								if (6 === t.a.$) {
									var a = t.b;
									return (u = a.b), o(A, iv(o(iD, a.a.a, t.a.a)), u);
								}
								break r;
							case 11:
								switch (t.a.$) {
									case 1:
										var c = t.b;
										return (u = c.b), o(A, iu(f(im, '\n', c.a.a, t.a.a)), u);
									case 11:
										var i = t.b;
										return (u = i.b), o(A, iu(o(iD, i.a.a, t.a.a)), u);
									default:
										break r;
								}
							case 1:
								switch (t.a.$) {
									case 1:
										var s = t.b;
										return (u = s.b), o(A, cX(f(im, '\n', s.a.a, t.a.a)), u);
									case 12:
										if (t.a.a) {
											var l = t.b;
											return (u = l.b), o(A, o(id, 2, l.a.a), u);
										}
										var b = t.b;
										return (u = b.b), o(A, o(id, 1, b.a.a), u);
									case 9:
										var d = t.a.a,
											v = d.a,
											p = t.b,
											g = p.a.a,
											h = ((u = p.b), o(iq, o(ih, v, d.b), g));
										return o(A, h.$ ? cX(f(im, '\n', g, v.cg)) : ip(o(ig, h.a, q)), u);
									default:
										break r;
								}
							case 8:
								if (8 === t.a.$) return (u = t.b.b), o(A, ip(t.a.a), u);
								break r;
							default:
								break r;
						}
					return o(A, n, r.H);
				})()
			};
		}),
		iA = t(function (r, n) {
			return n.b ? f(tk, A, n, r) : r;
		}),
		ik = function (r) {
			return f(tk, iA, q, r);
		},
		iE = t(function (r, n) {
			return ik(o(tE, r, n));
		}),
		iC = function (r) {
			return (
				'Problem at row ' +
				nV(r.dO) +
				'\n' +
				(function (r) {
					switch (r.$) {
						case 0:
							return 'Expecting ' + r.a;
						case 1:
							return 'Expecting int';
						case 2:
							return 'Expecting hex';
						case 3:
							return 'Expecting octal';
						case 4:
							return 'Expecting binary';
						case 5:
							return 'Expecting float';
						case 6:
							return 'Expecting number';
						case 7:
							return 'Expecting variable';
						case 8:
							return 'Expecting symbol ' + r.a;
						case 9:
							return 'Expecting keyword ' + r.a;
						case 10:
							return 'Expecting keyword end';
						case 11:
							return 'Unexpected char';
						case 12:
							return r.a;
						default:
							return 'Bad repeat';
					}
				})(r.dF)
			);
		},
		iL = function (r) {
			return { $: 3, a: r };
		},
		iN = e(function (r, n, t) {
			return { $: 0, a: r, b: n, c: t };
		}),
		iT = uo('at least 1 tag name character'),
		iR = function (r) {
			switch (r) {
				case ' ':
				case '\r':
				case '\n':
				case '	':
				case '/':
				case '<':
				case '>':
				case '"':
				case "'":
				case '=':
					return !1;
				default:
					return !0;
			}
		},
		iO = o(
			e8,
			t(function (r) {
				return ue(r);
			}),
			o(e3, o(eY, iR, iT), e1(iR))
		),
		iU = function (r) {
			return { $: 8, a: r };
		},
		iH = function (r) {
			return ub(o(uf, r, iU(r)));
		},
		iB = uO(k([D('amp', '&'), D('lt', '<'), D('gt', '>'), D('apos', "'"), D('quot', '"')])),
		iI = t(function (r, n) {
			return n.$ ? nR(r) : nB(n.a);
		}),
		ij = function (r) {
			var n = function (n) {
				return !v(n, r) && ';' !== n;
			};
			return o(
				ul,
				o(e3, ut(tm), iH('&')),
				o(
					e3,
					o(
						ez,
						function (r) {
							var n = o(J, '#x', r)
								? o(uV, e7, o(u_, uI, uz(o(t$, 2, r))))
								: o(J, '#', r)
									? o(iI, e7('Invalid escaped character: ' + r), o(tQ, uI, ty(o(t$, 1, r))))
									: o(iI, e7('No entity named "&' + r + ';" found.'), o(er, r, iB));
							return n.$ ? ur(n.a) : ut(n.a);
						},
						e4(o(e3, o(eY, n, uo('an entity character')), e1(n)))
					),
					iH(';')
				)
			);
		},
		i_ = e(function (r, n, t) {
			return o(
				ez,
				function (n) {
					return uL(
						k([
							o(
								up,
								function (r) {
									return uS(y(t, y(n, uB(r))));
								},
								ij(r)
							),
							ut(uq(y(t, n)))
						])
					);
				},
				e4(e1(n))
			);
		}),
		iV = function (r) {
			return o(
				uy,
				'',
				o(i_, r, function (n) {
					return !v(n, r) && '&' !== n;
				})
			);
		},
		iF = uL(
			k([
				o(ul, o(e3, ut(tm), iH('"')), o(e3, iV('"'), iH('"'))),
				o(ul, o(e3, ut(tm), iH("'")), o(e3, iV("'"), iH("'")))
			])
		),
		iz = t(function (r, n) {
			return nj(n.$ ? r : n.a);
		}),
		iP = function (r) {
			switch (r) {
				case ' ':
				case '\r':
				case '\n':
				case '	':
					return !0;
				default:
					return !1;
			}
		},
		iG = e1(iP),
		iM = o(
			up,
			o(
				cv,
				e(function (r, n, t) {
					return o(A, { ai: r, aP: n }, t);
				}),
				q
			),
			o(uy, t6, function (r) {
				return uL(
					k([
						o(
							ul,
							o(
								ul,
								ut(
									t(function (n, t) {
										return uS(f(eb, ue(n), iz(t), r));
									})
								),
								o(e3, o(e3, o(e3, iO, iG), iH('=')), iG)
							),
							o(e3, iF, iG)
						),
						ut(uq(r))
					])
				);
			})
		),
		iJ = function (r) {
			return function (n) {
				var t = l(nw, r, n.b, n.dO, n.by, n.cv),
					e = t.a,
					u = t.b,
					a = t.c,
					c = 0 > e ? tD(n.cv) : e;
				return f(eF, 0 > h(n.b, c), 0, { by: a, d: n.d, e: n.e, b: c, dO: u, cv: n.cv });
			};
		},
		iZ = o(ul, o(e3, ut(tm), iH('<![CDATA[')), o(e3, e4(iJ(']]>')), iH(']]>'))),
		iQ = t(function (r, n) {
			return o(
				up,
				function (r) {
					return r(n);
				},
				uL(r)
			);
		}),
		iK = function (r) {
			var n = o(
				ez,
				function (n) {
					return v(r, n) ? ut(0) : ur(e7('tag name mismatch: ' + r + ' and ' + n));
				},
				iO
			);
			return o(e3, o(e3, o(e3, o(e3, iH('</'), iG), n), iG), iH('>'));
		},
		iY = function (r) {
			return o(uf, r, uo(r));
		},
		iX = o(
			ul,
			o(
				e3,
				ut(function (r) {
					return { $: 2, a: r };
				}),
				ub(iY('<!--'))
			),
			o(e3, e4(iJ('-->')), ub(iY('-->')))
		),
		iW = t(function (r, n) {
			return { $: 5, a: r, b: n };
		}),
		i1 = e4(o(e3, o(eY, nX, uo('at least 1 uppercase character')), e1(nX))),
		i0 = o(e3, o(eY, iP, uo('at least one whitespace')), e1(iP)),
		i2 = o(ul, o(ul, o(e3, ut(iW), iH('<!')), o(e3, i1, i0)), o(e3, e4(iJ('>')), iH('>'))),
		i3 = o(
			ul,
			o(
				e3,
				ut(function (r) {
					return { $: 4, a: r };
				}),
				iH('<?')
			),
			o(e3, e4(iJ('?>')), iH('?>'))
		),
		i5 = function (r) {
			switch (r) {
				case '<':
				case '&':
					return !1;
				default:
					return !0;
			}
		},
		i8 = k([
			o(
				up,
				function () {
					return uS(0);
				},
				o(e3, o(eY, i5, uo('is not & or <')), e1(i5))
			),
			o(
				up,
				function () {
					return uS(0);
				},
				ij('<')
			),
			ut(uq(0))
		]),
		i4 = e4(
			o(uy, 0, function () {
				return uL(i8);
			})
		),
		i6 = function (r) {
			return o(
				ul,
				o(ul, o(e3, ut(iN(r)), iG), o(e3, iM, iG)),
				uL(
					k([
						o(
							up,
							function () {
								return q;
							},
							iH('/>')
						),
						o(
							ul,
							o(e3, ut(tm), iH('>')),
							o(
								uy,
								q,
								iQ(
									k([
										o(
											up,
											t(function (r, n) {
												return uq(n2(n));
											}),
											iK(r)
										),
										o(
											ez,
											function (n) {
												return tw(n)
													? o(
															up,
															t(function (r, n) {
																return uq(n2(n));
															}),
															iK(r)
														)
													: ut(function (r) {
															return uS(o(A, { $: 1, a: n }, r));
														});
											},
											i4
										),
										o(
											up,
											t(function (r, n) {
												return uS(o(A, r, n));
											}),
											i9()
										)
									])
								)
							)
						)
					])
				)
			);
		};
	function i9() {
		return uL(k([o(up, iL, iZ), i3, iX, i2, i7()]));
	}
	function i7() {
		return o(ul, o(e3, ut(tm), iH('<')), o(ez, i6, iO));
	}
	var or = i9();
	i9 = function () {
		return or;
	};
	var on = i7();
	i7 = function () {
		return on;
	};
	var ot,
		oe,
		ou,
		oa,
		oc,
		oi = o(uf, '	', uo('a tab')),
		oo = uL(
			k([
				ub(oi),
				o(
					e3,
					eP(ub(ia)),
					uL(
						k([
							ub(o(uf, '   ', iU('Indentation'))),
							ub(o(uf, ' 	', iU('Indentation'))),
							ub(o(uf, '  	', iU('Indentation')))
						])
					)
				)
			])
		),
		of = o(ul, o(e3, ut(iv), oo), o(e3, e4(io), il)),
		os = t(function (r, n) {
			return D(n.a, r(n.b));
		}),
		ol = o(
			e8,
			t(function (r) {
				return cX(r);
			}),
			io
		),
		ob = o(e3, ol, il),
		od = t(function (r, n) {
			return { $: 4, a: r, b: n };
		}),
		ov = function (r) {
			return o(e3, o(eY, r, e7('Expected one or more character')), e1(r));
		},
		op = o(uf, ')', uo('a `)`')),
		og = o(uf, '.', uo('a `.`')),
		oh = uL(k([o(ul, o(e3, ut(tm), ov(c9)), o(e3, e4(io), il)), o(e3, ut(''), il)])),
		om = o(
			e8,
			t(function (r) {
				return o(eg, 0, ty(r));
			}),
			ov(n1)
		),
		oD = t(function (r, n) {
			return uL(
				k([
					o(
						up,
						function (r) {
							return uS(o(A, r, n));
						},
						r
					),
					ut(uq(n2(n)))
				])
			);
		}),
		o$ = e(function (r, n, t) {
			return o(
				up,
				function (n) {
					return D(r, o(A, t, n));
				},
				o(uy, q, oD(o(ul, o(e3, ut(tm), eP(o(e3, om, ub(n)))), oh)))
			);
		}),
		ow = o(
			ez,
			function (r) {
				return r > 999999999 ? ur(e7('Starting numbers must be nine digits or less.')) : ut(r);
			},
			om
		),
		ox = function (r) {
			return 1 === r
				? ut(r)
				: ur(
						e7(
							'Lists inside a paragraph or after a paragraph without a blank line must start with 1'
						)
					);
		},
		oy = function (r) {
			return o(
				up,
				function (r) {
					return o(od, r.a, o(tE, tm, r.b));
				},
				o(
					ez,
					tm,
					o(
						ul,
						o(
							ul,
							o(ul, ut(o$), eP(r ? o(ez, ox, ow) : ow)),
							o(e3, eP(uL(k([o(e3, ut(og), ub(og)), o(e3, ut(op), ub(op))]))), ov(c9))
						),
						o(e3, e4(io), il)
					)
				)
			);
		},
		oq = t(function (r, n) {
			return { $: 6, a: r, b: n };
		}),
		oS = { $: 1 },
		oA = e(function (r, n, t) {
			return { $: 4, a: r, b: n, c: t };
		}),
		ok = e(function (r, n, t) {
			return { $: 3, a: r, b: n, c: t };
		}),
		oE = function (r) {
			return { $: 0, a: r };
		},
		oC = function (r) {
			var n = r.g;
			switch (n.$) {
				case 0:
					return oE(r.d5);
				case 1:
					return oS;
				case 2:
					return { $: 2, a: r.d5 };
				case 3:
					var t = n.a;
					return f(ok, t.b, n_, k([oE(t.a)]));
				case 4:
					var e = n.a;
					return f(ok, e.a, e.b, oL(r.j));
				case 5:
					var u = n.a;
					return f(oA, u.a, u.b, oL(r.j));
				case 6:
					return { $: 5, a: n.a };
				case 7:
					return o(oq, n.a, oL(r.j));
				default:
					return { $: 7, a: oL(r.j) };
			}
		},
		oL = function (r) {
			return o(tE, oC, r);
		},
		oN = t(function (r, n) {
			return {
				bH: n.bH - r.l,
				j: n.j,
				dS: n.dS - r.l,
				d5: n.d5,
				t: n.t - r.l,
				l: n.l - r.l,
				g: n.g
			};
		}),
		oT = t(function (r, n) {
			return { bH: r.bH, j: o(A, o(oN, r, n), r.j), dS: r.dS, d5: r.d5, t: r.t, l: r.l, g: r.g };
		}),
		oR = function (r) {
			return { bH: r.bH, j: oO(r.j), dS: r.dS, d5: r.d5, t: r.t, l: r.l, g: r.g };
		},
		oO = function (r) {
			var n = o(
				L,
				function (r) {
					return r.dS;
				},
				r
			);
			return n.b ? f(oU, n.b, n.a, q) : q;
		},
		oU = e(function (r, n, t) {
			for (;;) {
				var e = n;
				if (!r.b) return o(A, oR(e), t);
				var u = r.a,
					a = r.b;
				1 > h(e.bH, u.dS)
					? ((r = a), (n = u), (t = o(A, oR(e), t)))
					: 0 > h(e.dS, u.dS) && h(e.bH, u.bH) > 0
						? ((r = a), (n = o(oT, e, u)))
						: ((r = a), (n = e));
			}
		}),
		oH = { $: 0 },
		oB = u(function (r, n, t, e) {
			return { a: n, ah: r, dw: t, bl: e };
		}),
		oI = function (r) {
			return o(ny, { cU: !1, dn: !1 }, r);
		},
		oj = /.^/,
		o_ = o(eg, oj, oI('&#([0-9]{1,8});')),
		oV = nA(nk),
		oF = function (r) {
			var n, t;
			return (9 === r ||
				10 === r ||
				13 === r ||
				133 === r ||
				(r >= 32 && 126 >= r) ||
				(r >= 160 && 55295 >= r) ||
				(r >= 57344 && 64975 >= r) ||
				(r >= 65008 && 65533 >= r) ||
				(r >= 65536 && 1114109 >= r)) &&
				((n = o(B, 16, r)),
				(t = o(B, 131070, r)),
				131070 > r || ((0 > t || t > 15) && (65536 > t || t > 65551)) || (14 !== n && 15 !== n))
				? uB(uI(r))
				: uB(uI(65533));
		},
		oz = o(oV, o_, function (r) {
			var n = r.bl;
			if (n.b && !n.a.$) {
				var t = ty(n.a.a);
				return t.$ ? r.ah : oF(t.a);
			}
			return r.ah;
		}),
		oP = o(eg, oj, oI('&([0-9a-zA-Z]+);')),
		oG = uO(
			k([
				D('quot', 34),
				D('amp', 38),
				D('apos', 39),
				D('lt', 60),
				D('gt', 62),
				D('nbsp', 160),
				D('iexcl', 161),
				D('cent', 162),
				D('pound', 163),
				D('curren', 164),
				D('yen', 165),
				D('brvbar', 166),
				D('sect', 167),
				D('uml', 168),
				D('copy', 169),
				D('ordf', 170),
				D('laquo', 171),
				D('not', 172),
				D('shy', 173),
				D('reg', 174),
				D('macr', 175),
				D('deg', 176),
				D('plusmn', 177),
				D('sup2', 178),
				D('sup3', 179),
				D('acute', 180),
				D('micro', 181),
				D('para', 182),
				D('middot', 183),
				D('cedil', 184),
				D('sup1', 185),
				D('ordm', 186),
				D('raquo', 187),
				D('frac14', 188),
				D('frac12', 189),
				D('frac34', 190),
				D('iquest', 191),
				D('Agrave', 192),
				D('Aacute', 193),
				D('Acirc', 194),
				D('Atilde', 195),
				D('Auml', 196),
				D('Aring', 197),
				D('AElig', 198),
				D('Ccedil', 199),
				D('Egrave', 200),
				D('Eacute', 201),
				D('Ecirc', 202),
				D('Euml', 203),
				D('Igrave', 204),
				D('Iacute', 205),
				D('Icirc', 206),
				D('Iuml', 207),
				D('ETH', 208),
				D('Ntilde', 209),
				D('Ograve', 210),
				D('Oacute', 211),
				D('Ocirc', 212),
				D('Otilde', 213),
				D('Ouml', 214),
				D('times', 215),
				D('Oslash', 216),
				D('Ugrave', 217),
				D('Uacute', 218),
				D('Ucirc', 219),
				D('Uuml', 220),
				D('Yacute', 221),
				D('THORN', 222),
				D('szlig', 223),
				D('agrave', 224),
				D('aacute', 225),
				D('acirc', 226),
				D('atilde', 227),
				D('auml', 228),
				D('aring', 229),
				D('aelig', 230),
				D('ccedil', 231),
				D('egrave', 232),
				D('eacute', 233),
				D('ecirc', 234),
				D('euml', 235),
				D('igrave', 236),
				D('iacute', 237),
				D('icirc', 238),
				D('iuml', 239),
				D('eth', 240),
				D('ntilde', 241),
				D('ograve', 242),
				D('oacute', 243),
				D('ocirc', 244),
				D('otilde', 245),
				D('ouml', 246),
				D('divide', 247),
				D('oslash', 248),
				D('ugrave', 249),
				D('uacute', 250),
				D('ucirc', 251),
				D('uuml', 252),
				D('yacute', 253),
				D('thorn', 254),
				D('yuml', 255),
				D('OElig', 338),
				D('oelig', 339),
				D('Scaron', 352),
				D('scaron', 353),
				D('Yuml', 376),
				D('fnof', 402),
				D('circ', 710),
				D('tilde', 732),
				D('Alpha', 913),
				D('Beta', 914),
				D('Gamma', 915),
				D('Delta', 916),
				D('Epsilon', 917),
				D('Zeta', 918),
				D('Eta', 919),
				D('Theta', 920),
				D('Iota', 921),
				D('Kappa', 922),
				D('Lambda', 923),
				D('Mu', 924),
				D('Nu', 925),
				D('Xi', 926),
				D('Omicron', 927),
				D('Pi', 928),
				D('Rho', 929),
				D('Sigma', 931),
				D('Tau', 932),
				D('Upsilon', 933),
				D('Phi', 934),
				D('Chi', 935),
				D('Psi', 936),
				D('Omega', 937),
				D('alpha', 945),
				D('beta', 946),
				D('gamma', 947),
				D('delta', 948),
				D('epsilon', 949),
				D('zeta', 950),
				D('eta', 951),
				D('theta', 952),
				D('iota', 953),
				D('kappa', 954),
				D('lambda', 955),
				D('mu', 956),
				D('nu', 957),
				D('xi', 958),
				D('omicron', 959),
				D('pi', 960),
				D('rho', 961),
				D('sigmaf', 962),
				D('sigma', 963),
				D('tau', 964),
				D('upsilon', 965),
				D('phi', 966),
				D('chi', 967),
				D('psi', 968),
				D('omega', 969),
				D('thetasym', 977),
				D('upsih', 978),
				D('piv', 982),
				D('ensp', 8194),
				D('emsp', 8195),
				D('thinsp', 8201),
				D('zwnj', 8204),
				D('zwj', 8205),
				D('lrm', 8206),
				D('rlm', 8207),
				D('ndash', 8211),
				D('mdash', 8212),
				D('lsquo', 8216),
				D('rsquo', 8217),
				D('sbquo', 8218),
				D('ldquo', 8220),
				D('rdquo', 8221),
				D('bdquo', 8222),
				D('dagger', 8224),
				D('Dagger', 8225),
				D('bull', 8226),
				D('hellip', 8230),
				D('permil', 8240),
				D('prime', 8242),
				D('Prime', 8243),
				D('lsaquo', 8249),
				D('rsaquo', 8250),
				D('oline', 8254),
				D('frasl', 8260),
				D('euro', 8364),
				D('image', 8465),
				D('weierp', 8472),
				D('real', 8476),
				D('trade', 8482),
				D('alefsym', 8501),
				D('larr', 8592),
				D('uarr', 8593),
				D('rarr', 8594),
				D('darr', 8595),
				D('harr', 8596),
				D('crarr', 8629),
				D('lArr', 8656),
				D('uArr', 8657),
				D('rArr', 8658),
				D('dArr', 8659),
				D('hArr', 8660),
				D('forall', 8704),
				D('part', 8706),
				D('exist', 8707),
				D('empty', 8709),
				D('nabla', 8711),
				D('isin', 8712),
				D('notin', 8713),
				D('ni', 8715),
				D('prod', 8719),
				D('sum', 8721),
				D('minus', 8722),
				D('lowast', 8727),
				D('radic', 8730),
				D('prop', 8733),
				D('infin', 8734),
				D('ang', 8736),
				D('and', 8743),
				D('or', 8744),
				D('cap', 8745),
				D('cup', 8746),
				D('int', 8747),
				D('there4', 8756),
				D('sim', 8764),
				D('cong', 8773),
				D('asymp', 8776),
				D('ne', 8800),
				D('equiv', 8801),
				D('le', 8804),
				D('ge', 8805),
				D('sub', 8834),
				D('sup', 8835),
				D('nsub', 8836),
				D('sube', 8838),
				D('supe', 8839),
				D('oplus', 8853),
				D('otimes', 8855),
				D('perp', 8869),
				D('sdot', 8901),
				D('lceil', 8968),
				D('rceil', 8969),
				D('lfloor', 8970),
				D('rfloor', 8971),
				D('lang', 9001),
				D('rang', 9002),
				D('loz', 9674),
				D('spades', 9824),
				D('clubs', 9827),
				D('hearts', 9829),
				D('diams', 9830)
			])
		),
		oM = o(oV, oP, function (r) {
			var n = r.bl;
			if (n.b && !n.a.$) {
				var t = o(er, n.a.a, oG);
				return t.$ ? r.ah : uB(uI(t.a));
			}
			return r.ah;
		}),
		oJ = o(eg, oj, oI('(\\\\+)([!"#$%&\\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])')),
		oZ = e(function (r, n, t) {
			return r > 0 ? f(oZ, r >> 1, y(n, n), 1 & r ? y(t, n) : t) : t;
		}),
		oQ = t(function (r, n) {
			return f(oZ, r, n, '');
		}),
		oK = o(oV, oJ, function (r) {
			var n = r.bl;
			if (n.b && !n.a.$ && n.b.b && !n.b.a.$) {
				var t = n.b.a.a;
				return y(o(oQ, (tD(n.a.a) / 2) | 0, '\\'), t);
			}
			return r.ah;
		}),
		oY = o(eg, oj, oI('&#[Xx]([0-9a-fA-F]{1,8});')),
		oX = o(oV, oY, function (r) {
			var n,
				e = r.bl;
			return e.b && !e.a.$
				? oF(
						((n = e.a.a),
						f(
							_,
							t(function (r, n) {
								return 16 * n + o(B, 39, nK(r)) - 9;
							}),
							0,
							ue(n)
						))
					)
				: r.ah;
		}),
		oW = function (r) {
			var n = oK(r);
			return o(M, '&', n) ? oX(oz(oM(n))) : n;
		},
		o1 = function (r) {
			return { bH: 0, j: q, dS: 0, d5: oW(r), t: 0, l: 0, g: oH };
		},
		o0 = e(function (r, n, t) {
			var e = { bH: n.bH, j: f(o2, n.d5, q, n.j), dS: n.dS, d5: n.d5, t: n.t, l: n.l, g: n.g };
			if (t.b) {
				var u = t.a;
				return u.g.$
					? v(n.bH, u.dS)
						? o(A, e, t)
						: 0 > h(n.bH, u.dS)
							? o(A, e, o(A, o1(f(P, n.bH, u.dS, r)), t))
							: t
					: o(A, e, t);
			}
			var a = o(t$, n.bH, r);
			return tw(a) ? k([e]) : k([e, o1(a)]);
		}),
		o2 = e(function (r, n, t) {
			for (;;) {
				if (!t.b) {
					if (n.b) {
						var e = n.a;
						return e.dS > 0 ? o(A, o1(o(tx, e.dS, r)), n) : n;
					}
					return tw(r) ? q : k([o1(r)]);
				}
				var u = t.b,
					a = r,
					c = f(o0, r, t.a, n);
				(r = a), (n = c), (t = u);
			}
		}),
		o3 = o(eg, oj, oI('(\\\\*)(\\<)')),
		o5 = e(function (r, n, t) {
			var e = r(n);
			return e.$ ? t : o(A, e.a, t);
		}),
		o8 = t(function (r, n) {
			return f(tk, o5(r), q, n);
		}),
		o4 = nS(nk),
		o6 = { $: 4 },
		o9 = function (r) {
			return !o(B, 2, r);
		},
		o7 = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && !n.b.a.$) {
				var t = o(eg, 0, o(tQ, tD, n.a));
				return o9(t) ? nj({ a: r.a + t, a2: 1, c: o6 }) : n_;
			}
			return n_;
		},
		fr = o(eg, oj, oI('(\\\\*)(\\>)')),
		fn = function (r) {
			return { $: 5, a: r };
		},
		ft = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && !n.b.a.$) {
				var t = o(eg, 0, o(tQ, tD, n.a));
				return nj({ a: r.a + t, a2: 1, c: o9(t) ? fn(1) : fn(0) });
			}
			return n_;
		},
		fe = o(eg, oj, oI('(\\\\*)([^*])?(\\*+)([^*])?')),
		fu = t(function (r, n) {
			return { $: 7, a: r, b: n };
		}),
		fa = o(
			_,
			t(function (r, n) {
				return (
					n ||
					(function (r) {
						switch (r) {
							case '!':
							case '"':
							case '#':
							case '%':
							case '&':
							case "'":
							case '(':
							case ')':
							case '*':
							case ',':
							case '-':
							case '.':
							case '/':
							case ':':
							case ';':
							case '?':
							case '@':
							case '[':
							case ']':
							case '_':
							case '{':
							case '}':
							case '~':
								return !0;
							default:
								return !1;
						}
					})(r)
				);
			}),
			!1
		),
		fc = o(
			_,
			t(function (r, n) {
				return (
					n ||
					(function (r) {
						switch (r) {
							case ' ':
							case '\f':
							case '\n':
							case '\r':
							case '	':
							case '\v':
							case '\xa0':
							case '\u2028':
							case '\u2029':
								return !0;
							default:
								return !1;
						}
					})(r)
				);
			}),
			!1
		),
		fi = function (r) {
			if (r.$) return 0;
			var n = r.a;
			return tw(n) || fc(n) ? 0 : fa(n) ? 1 : 2;
		},
		fo = e(function (r, n, t) {
			var e = t.bl;
			if (e.b && e.b.b && e.b.b.b && !e.b.b.a.$ && e.b.b.b.b) {
				var u = e.a,
					a = e.b,
					c = a.a,
					i = a.b,
					s = i.a.a,
					l = fi(i.b.a),
					b = c.$ ? 0 : tD(c.a),
					d = t.a && !b ? nj(f(P, t.a - 1, t.a, n)) : c,
					v = u.$ ? 0 : tD(u.a),
					p = (!o9(v) && !b) || (!d.$ && '\\' === d.a),
					g = p ? tD(s) - 1 : tD(s),
					h = p ? 1 : fi(d);
				return 0 >= g || ('_' === r && 2 === h && 2 === l)
					? n_
					: nj({ a: t.a + v + b + (p ? 1 : 0), a2: g, c: o(fu, r, { aD: h, aJ: l }) });
			}
			return n_;
		}),
		ff = o(eg, oj, oI('(\\\\*)(\\`+)')),
		fs = function (r) {
			return { $: 0, a: r };
		},
		fl = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && !n.b.a.$) {
				var t = n.b.a.a,
					e = o(eg, 0, o(tQ, tD, n.a));
				return nj({ a: r.a + e, a2: tD(t), c: o9(e) ? fs(1) : fs(0) });
			}
			return n_;
		},
		fb = o(eg, oj, oI('(?:(\\\\+)|( {2,}))\\n')),
		fd = { $: 9 },
		fv = function (r) {
			for (var n = r.bl; ; ) {
				if (n.b) {
					if (n.a.$) {
						if (n.b.b && !n.b.a.$) return nj({ a: r.a, a2: tD(r.ah), c: fd });
						break;
					}
					var t = tD(n.a.a);
					return o9(t) ? n_ : nj({ a: r.a + t - 1, a2: 2, c: fd });
				}
				break;
			}
			return n_;
		},
		fp = (oI('(?:(\\\\+)|( *))\\n'), o(eg, oj, oI('(\\\\*)(\\])'))),
		fg = { $: 3 },
		fh = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && !n.b.a.$) {
				var t = o(eg, 0, o(tQ, tD, n.a));
				return o9(t) ? nj({ a: r.a + t, a2: 1, c: fg }) : n_;
			}
			return n_;
		},
		fm = o(eg, oj, oI('(\\\\*)(\\!)?(\\[)')),
		fD = { $: 2 },
		f$ = function (r) {
			return { $: 1, a: r };
		},
		fw = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && n.b.b.b && !n.b.b.a.$) {
				var t = n.b.a,
					e = o(eg, 0, o(tQ, tD, n.a)),
					u = !o9(e),
					a = u ? r.a + e + 1 : r.a + e;
				return u
					? t.$
						? n_
						: nj({ a: a, a2: 1, c: f$(0) })
					: nj(t.$ ? { a: a, a2: 1, c: f$(0) } : { a: a, a2: 2, c: fD });
			}
			return n_;
		},
		fx = function (r) {
			return { $: 10, a: r };
		},
		fy = function (r) {
			var n = r.bl;
			if (n.b && n.b.b && !n.b.a.$) {
				var t = n.b.a.a,
					e = o(eg, 0, o(tQ, tD, n.a)),
					u = o9(e) ? D(tD(t), fx(1)) : D(tD(t), fx(0));
				return nj({ a: r.a + e, a2: u.a, c: u.b });
			}
			return n_;
		},
		fq = o(eg, oj, oI('(\\\\*)(~{2,})([^~])?')),
		fS = o(eg, oj, oI('(\\\\*)([^_])?(\\_+)([^_])?')),
		fA = t(function (r, n) {
			if (r.b) {
				var t = r.a,
					e = r.b;
				if (n.b) {
					var u = n.a,
						a = n.b;
					return 0 > h(t.a, u.a) ? o(A, t, o(fA, e, n)) : o(A, u, o(fA, r, a));
				}
				return r;
			}
			return n;
		}),
		fk = { $: 2 },
		fE = function (r) {
			return { $: 6, a: r };
		},
		fC = function (r) {
			return { $: 5, a: r };
		},
		fL = function (r) {
			return { $: 4, a: r };
		},
		fN = { $: 8 },
		fT = function (r) {
			return { $: 3, a: r };
		},
		fR = o(eg, oj, oI('%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)')),
		fO = o(
			eS,
			e$,
			o(oV, fR, function (r) {
				return o(
					eg,
					r.ah,
					(function (r) {
						try {
							return nj(decodeURIComponent(r));
						} catch (r) {
							return n_;
						}
					})(r.ah)
				);
			})
		),
		fU = o(eg, oj, oI('^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$')),
		fH = function (r) {
			return r.b ? nj(r.a) : n_;
		},
		fB = o(eg, oj, oI('^\\[\\s*([^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*)\\s*\\]')),
		fI = function (r) {
			return r;
		},
		fj = o(eS, fI, ue),
		f_ = t(function (r, n) {
			return D(fO(oW(r)), o(tQ, oW, n));
		}),
		fV = e(function (r, n, t) {
			var e,
				u = tw(
					(e = o(
						eg,
						r.d5,
						o(
							eg,
							n_,
							o(
								cH,
								o(
									eS,
									function (r) {
										return r.bl;
									},
									fH
								),
								t
							)
						)
					))
				)
					? r.d5
					: e,
				a = o(er, fj(u), n);
			if (1 === a.$) return n_;
			var c = a.a,
				i = c.a,
				f = c.b,
				s = 5 === r.g.$ ? fC(o(f_, i, f)) : fL(o(f_, i, f)),
				l = t.$ ? 0 : tD(t.a.ah);
			return nj(w(r, { bH: r.bH + l, g: s }));
		}),
		fF = e(function (r, n, t) {
			return f(fV, n, t, fH(f(nS, 1, fB, r)));
		}),
		fz = ' \\t\\f\\v\\r\\n',
		fP = o(
			eg,
			oj,
			oI(
				'^\\(\\s*(?:<([^<>\\f\\v\\r\\n]*)>|([^' +
					fz +
					'\\(\\)\\\\]*(?:\\\\.[^' +
					fz +
					'\\(\\)\\\\]*)*))(?:[' +
					fz +
					']+(?:\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'|"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?\\s*\\)'
			)
		),
		fG = function (r) {
			return f(
				nG,
				t(function (r, n) {
					return n.$ ? r : nj(n.a);
				}),
				n_,
				r
			);
		},
		fM = t(function (r, n) {
			var t,
				e = n.bl;
			if (e.b && e.b.b && e.b.b.b && e.b.b.b.b && e.b.b.b.b.b) {
				var u = e.a,
					a = e.b,
					c = a.a,
					i = a.b,
					f = i.b,
					s = fG(k([i.a, f.a, f.b.a]));
				return nj(
					((t = o(eg, '', fG(k([u, c])))),
					w(r, { bH: r.bH + tD(n.ah), g: (5 === r.g.$ ? fC : fL)(o(f_, t, s)) }))
				);
			}
			return n_;
		}),
		fJ = e(function (r, n, t) {
			var e = f(nS, 1, fP, r);
			if (e.b) {
				var u = o(fM, n, e.a);
				return u.$ ? f(fF, r, n, t) : nj(u.a);
			}
			return f(fF, r, n, t);
		}),
		fZ = t(function (r, n) {
			var t = cA(function (n) {
				return h(r.bH, n.dS) > 0 && 0 > h(r.bH, n.bH);
			});
			return u3(n) || u3(t(n)) ? nj(o(A, r, n)) : n_;
		}),
		fQ = o(
			eg,
			oj,
			oI(
				"^([a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$"
			)
		),
		fK = function (r) {
			return o(nq, fQ, r.d5) ? nB(w(r, { g: fT(D(r.d5, 'mailto:' + fO(r.d5))) })) : nR(r);
		},
		fY = e(function (r, n, t) {
			for (;;) {
				if (!t.b) return n_;
				var e = t.a,
					u = t.b;
				if (n(e)) return nj($(e, n2(r), u));
				(r = o(A, e, r)), (t = u);
			}
		}),
		fX = t(function (r, n) {
			return f(fY, q, r, n);
		}),
		fW = t(function (r, n) {
			return { $: 6, a: r, b: n };
		}),
		f1 = function (r) {
			return f(eF, !1, r.b, r);
		},
		f0 = t(function (r, n) {
			var t = o(
					ul,
					o(
						ul,
						o(
							ul,
							ut(
								e(function (r, n, t) {
									return { bT: n, a2: t - r };
								})
							),
							f1
						),
						or
					),
					f1
				),
				u = o(ao, t, o(t$, n.dS, r));
			return u.$ ? n_ : nj({ a: n.dS, a2: u.a.a2, c: o(fW, 1, u.a.bT) });
		}),
		f2 = t(function (r, n) {
			return n.$ ? r(n.a) : n;
		}),
		f3 = t(function () {
			return !1;
		}),
		f5 = t(function (r, n) {
			var t = n.c;
			return !t.$ && v(t.a ? n.a2 : n.a2 - 1, r.a2);
		}),
		f8 = function (r) {
			switch (r.c.$) {
				case 1:
				case 2:
					return !0;
				default:
					return !1;
			}
		},
		f4 = t(function (r, n) {
			var t = n.c;
			if (7 === t.$) {
				var e = t.b,
					u = r.c;
				if (7 === u.$) {
					var a = u.b;
					return !(!v(t.a, u.a) || ((v(e.aD, e.aJ) || v(a.aD, a.aJ)) && !o(B, 3, r.a2 + n.a2)));
				}
			}
			return !1;
		}),
		f6 = t(function (r, n) {
			var t,
				e,
				u = 10 === (e = n.c).$ ? D(!0, e.a ? n.a2 : n.a2 - 1) : D(!1, 0),
				a = u.a,
				c = u.b,
				i = 10 === (t = r.c).$ ? D(!0, t.a ? r.a2 : r.a2 - 1) : D(!1, 0);
			return i.a && a && v(i.b, c);
		}),
		f9 = { $: 1 },
		f7 = t(function (r, n) {
			return { bH: r.a + r.a2, j: q, dS: r.a, d5: '', t: 0, l: 0, g: n };
		}),
		sr = a(function (r, n, t) {
			for (;;) {
				if (!r.b) return t;
				var e = r.a,
					u = r.b;
				9 !== e.c.$ ? ((r = u), (n = o(A, e, n))) : ((r = u), (t = o(A, o(f7, e, f9), t)));
			}
		}),
		sn = t(function (r, n) {
			return o(
				cA,
				function (n) {
					return h(n.a, r.bH) > -1;
				},
				n
			);
		}),
		st = c(function (r, n, t, e, u, a) {
			var c,
				i = a.c,
				f = o(
					f2,
					fK,
					o(
						nq,
						fU,
						(c = d(
							sb,
							e,
							u,
							function (r) {
								return r;
							},
							fk,
							a.a,
							r,
							q
						)).d5
					)
						? nB(w(c, { g: fT(D(c.d5, fO(c.d5))) }))
						: nR(c)
				);
			if (1 === f.$) {
				if (1 === n) {
					var s = o(f0, u, f.a);
					return s.$ ? n_ : nj(D(o(A, s.a, i), t));
				}
				return n_;
			}
			return nj(D(i, o(A, f.a, t)));
		}),
		se = a(function (r, n, t, e, u) {
			for (;;) {
				if (!r.b) return l(si, n2(n), q, t, e, u);
				var a = r.a,
					c = r.b,
					i = a.c;
				switch (i.$) {
					case 0:
						var f = i.a,
							s = o(fX, f5(a), n);
						if (s.$) {
							(r = c), (n = o(A, a, n));
							continue;
						}
						var d = l(su, a, t, e, u, s.a);
						(r = c), (n = m = d.a), (t = D = d.b);
						continue;
					case 5:
						f = i.a;
						var v = function (r) {
								return 4 === r.c.$;
							},
							p = o(fX, v, n);
						if (p.$) {
							(r = c), (n = o(cA, o(tj, e9, v), n));
							continue;
						}
						var g = b(st, a, f, t, e, u, p.a);
						if (g.$) {
							(r = c), (n = o(cA, o(tj, e9, v), n));
							continue;
						}
						var h = g.a,
							m = h.a,
							D = h.b;
						(r = c), (n = o(cA, o(tj, e9, v), m)), (t = D);
						continue;
					default:
						(r = c), (n = o(A, a, n));
						continue;
				}
			}
		}),
		su = a(function (r, n, t, e, u) {
			var a,
				c = u.a;
			return D(
				u.c,
				o(
					A,
					d(sb, t, e, fI, fk, (a = c.c).$ || a.a ? c : w(c, { a: c.a + 1, a2: c.a2 - 1 }), r, q),
					n
				)
			);
		}),
		sa = a(function (r, n, t, e, u) {
			for (;;) {
				if (!r.b) return l(ss, n2(n), q, t, e, u);
				var a = r.a,
					c = r.b,
					i = a.c;
				if (7 !== i.$) (r = c), (n = o(A, a, n));
				else {
					var f = i.a,
						s = i.b.aD,
						b = i.b.aJ;
					if (v(s, b)) {
						if (!b || ('_' === f && 1 !== b)) {
							r = c;
							continue;
						}
						var d = o(fX, f4(a), n);
						if (d.$) {
							(r = c), (n = o(A, a, n));
							continue;
						}
						var p = l(sc, e, u, a, c, d.a);
						(r = p.a), (n = p.c), (t = o(A, p.b, t));
						continue;
					}
					if (0 > h(s, b)) {
						(r = c), (n = o(A, a, n));
						continue;
					}
					var g = o(fX, f4(a), n);
					if (g.$) {
						r = c;
						continue;
					}
					var m = l(sc, e, u, a, c, g.a);
					(r = m.a), (n = m.c), (t = o(A, m.b, t));
				}
			}
		}),
		sc = a(function (r, n, t, e, u) {
			var a = u.a,
				c = u.b,
				i = u.c,
				f = a.a2 - t.a2,
				s = f
					? f > 0
						? { ax: t, aj: w(a, { a: a.a + f, a2: t.a2 }), aI: o(A, w(a, { a2: f }), i), aN: e }
						: { ax: w(t, { a2: a.a2 }), aj: a, aI: i, aN: o(A, w(t, { a: t.a + a.a2, a2: -f }), e) }
					: { ax: t, aj: a, aI: i, aN: e },
				l = d(
					sb,
					r,
					n,
					function (r) {
						return r;
					},
					{ $: 7, a: s.aj.a2 },
					s.aj,
					s.ax,
					n2(c)
				);
			return $(s.aN, l, s.aI);
		}),
		si = a(function (r, n, t, e, u) {
			for (;;) {
				if (!r.b) return l(so, n2(n), q, t, e, u);
				var a = r.a,
					c = r.b,
					i = a.c;
				if (6 !== i.$) (r = c), (n = o(A, a, n));
				else {
					var f = i.b;
					if (1 === i.a) {
						(r = c), (t = o(A, o(f7, a, fE(f)), t));
						continue;
					}
					var s = o(fX, f3(f), c);
					if (1 === s.$) {
						(r = c), (t = o(A, o(f7, a, fE(f)), t));
						continue;
					}
					var b = s.a,
						v = b.a,
						p = b.b,
						g = b.c,
						h = d(
							sb,
							e,
							u,
							function (r) {
								return r;
							},
							fE(f),
							a,
							v,
							p
						);
					(r = g), (t = o(A, h, t));
				}
			}
		}),
		so = a(function (r, n, t, e, u) {
			for (;;) {
				if (!r.b) return l(sa, n2(n), q, t, e, u);
				var a = r.a,
					c = r.b;
				if (3 !== a.c.$) (r = c), (n = o(A, a, n));
				else {
					var i = o(fX, f8, n);
					if (i.$) {
						r = c;
						continue;
					}
					var f = b(sf, a, c, t, e, u, i.a);
					if (f.$) {
						r = c;
						continue;
					}
					var s = f.a;
					(r = s.a), (n = s.c), (t = s.b);
				}
			}
		}),
		sf = c(function (r, n, t, e, u, a) {
			var c = a.a,
				i = a.b,
				s = a.c,
				l = $(n, t, y(i, s)),
				b = o(t$, r.a + 1, u),
				v = function (n) {
					return d(
						sb,
						e,
						u,
						function (r) {
							return r;
						},
						n ? fL(D('', n_)) : fC(D('', n_)),
						c,
						r,
						n2(i)
					);
				},
				p = c.c;
			switch (p.$) {
				case 2:
					var g = v(!1),
						h = f(fJ, b, g, e);
					if (1 === h.$) return nj(l);
					var m = o(fZ, (S = h.a), t);
					if (m.$) return nj(l);
					var x = m.a;
					return nj($(o(sn, S, n), x, s));
				case 1:
					if (p.a) return nj(l);
					var q = f(fJ, b, (g = v(!0)), e);
					if (1 === q.$) return nj(l);
					var S,
						A = o(fZ, (S = q.a), t);
					return A.$
						? nj(l)
						: ((x = A.a),
							nj(
								$(
									o(sn, S, n),
									x,
									o(
										tE,
										function (r) {
											return 1 === r.c.$ ? w(r, { c: f$(1) }) : r;
										},
										s
									)
								)
							));
				default:
					return n_;
			}
		}),
		ss = a(function (r, n, t, e, u) {
			for (;;) {
				if (!r.b) return l(sr, n2(n), q, t, e, u);
				var a = r.a,
					c = r.b;
				if (10 !== a.c.$) (r = c), (n = o(A, a, n));
				else {
					var i = o(fX, f6(a), n);
					if (i.$) {
						(r = c), (n = o(A, a, n));
						continue;
					}
					var f = l(sl, a, t, e, u, i.a);
					(r = c), (n = f.a), (t = f.b);
				}
			}
		}),
		sl = a(function (r, n, t, e, u) {
			var a,
				c = u.a;
			return D(
				u.c,
				o(
					A,
					d(
						sb,
						t,
						e,
						fI,
						fN,
						10 !== (a = c.c).$ || a.a ? c : w(c, { a: c.a + 1, a2: c.a2 - 1 }),
						r,
						q
					),
					n
				)
			);
		}),
		sb = i(function (r, n, t, e, u, a, c) {
			var i = u.a + u.a2,
				l = a.a,
				b = t(f(P, i, l, n)),
				d = u.a,
				v = a.a + a.a2,
				p = { bH: v, j: q, dS: d, d5: b, t: l, l: i, g: e };
			return {
				bH: v,
				j: o(
					tE,
					function (r) {
						return o(oN, p, r);
					},
					s(sd, c, q, r, n)
				),
				dS: d,
				d5: b,
				t: l,
				l: i,
				g: e
			};
		}),
		sd = u(function (r, n, t, e) {
			return l(se, r, q, n, t, e);
		}),
		sv = t(function (r, n) {
			var t,
				e = iw(n),
				u = o(
					fA,
					o(o8, ft, o(o4, fr, (t = e))),
					o(
						fA,
						o(o8, o7, o(o4, o3, t)),
						o(
							fA,
							o(o8, fv, o(o4, fb, t)),
							o(
								fA,
								o(o8, fh, o(o4, fp, t)),
								o(
									fA,
									o(o8, fw, o(o4, fm, t)),
									o(
										fA,
										o(o8, fy, o(o4, fq, t)),
										o(
											fA,
											o(o8, o(fo, '_', t), o(o4, fS, t)),
											o(fA, o(o8, o(fo, '*', t), o(o4, fe, t)), o(o8, fl, o(o4, ff, t)))
										)
									)
								)
							)
						)
					)
				);
			return oL(f(o2, e, q, oO(s(sd, u, q, r, e))));
		}),
		sp = uL(
			k([
				ub(o(uf, ' ', uo(' '))),
				ub(o(uf, '>', uo('>'))),
				o(
					e3,
					o(
						e3,
						o(eY, nW, uo('Alpha')),
						e1(function (r) {
							return n0(r) || '-' === r;
						})
					),
					uL(
						k([
							ub(o(uf, ':', uo(':'))),
							ub(o(uf, '@', uo('@'))),
							ub(o(uf, '\\', uo('\\'))),
							ub(o(uf, '+', uo('+'))),
							ub(o(uf, '.', uo('.')))
						])
					)
				)
			])
		),
		sg = eP(
			o(
				e8,
				t(function (r) {
					return cX(r);
				}),
				o(e3, o(e3, o(e3, ub(o(uf, '<', uo('<'))), sp), io), il)
			)
		),
		sh = t(function (r, n) {
			return { cS: n, dg: r };
		}),
		sm = { av: '`', aC: 0, aM: o(uf, '`', uo("a '`'")) },
		sD = e(function (r, n, t) {
			for (;;) {
				if (0 >= n) return r;
				(r = o(A, t, r)), (n -= 1);
			}
		}),
		s$ = t(function (r, n) {
			return f(sD, q, r, n);
		}),
		sw = t(function (r, n) {
			var e = f(
				nG,
				t(function (r, n) {
					return o(e3, n, r);
				}),
				ut(0),
				o(s$, r, ub(n.aM))
			);
			return o(
				e8,
				t(function (r) {
					return D(n, tD(r));
				}),
				o(e3, e, e1(g(n.av)))
			);
		}),
		sx = { av: '~', aC: 1, aM: o(uf, '~', uo('a `~`')) },
		sy = ub(ia),
		sq = uL(k([o(e3, o(e3, sy, uL(k([sy, ut(0)]))), uL(k([sy, ut(0)]))), ut(0)])),
		sS = o(
			ul,
			o(
				ul,
				o(
					e3,
					ut(
						t(function (r, n) {
							return { aw: n.a, a0: r, a2: n.b };
						})
					),
					sq
				),
				o(
					ez,
					function (r) {
						switch (r) {
							case 1:
								return ut(0);
							case 2:
								return ut(1);
							case 3:
								return ut(2);
							case 4:
								return ut(3);
							default:
								return ur(uo('Fenced code blocks should be indented no more than 3 spaces'));
						}
					},
					function (r) {
						return f(eF, !1, r.by, r);
					}
				)
			),
			uL(k([o(sw, 3, sm), o(sw, 3, sx)]))
		),
		sA = g(' '),
		sk = t(function (r, n) {
			return o(e3, o(e3, o(e3, o(e3, ut(0), sq), o(sw, r, n)), e1(sA)), il);
		}),
		sE = t(function (r, n) {
			var e = o(s$, r, n);
			if (e.b) {
				var u = e.a,
					a = e.b;
				return f(
					nG,
					t(function (r, n) {
						return uL(k([o(e3, r, n), ut(0)]));
					}),
					uL(k([u, ut(0)])),
					a
				);
			}
			return ut(0);
		}),
		sC = function (r) {
			return f(eF, !1, r.cv, r);
		},
		sL = function (r) {
			var n,
				u = r.a,
				a = r.b;
			return uL(
				k([
					o(e3, ut(uq(a)), a$(aD)),
					o(
						e8,
						t(function (r) {
							return uS(D(u, y(a, r)));
						}),
						it
					),
					eP(o(e3, ut(uq(a)), o(sk, u.a2, u.aw))),
					o(
						ul,
						o(
							ul,
							o(
								ul,
								ut(
									e(function (r, n, t) {
										return uS(D(u, y(a, f(P, r, n, t))));
									})
								),
								((n = u.a0), o(ul, o(e3, ut(tm), o(sE, n, sy)), o(e3, o(e3, f1, io), il)))
							),
							f1
						),
						sC
					)
				])
			);
		},
		sN = o(
			ez,
			function (r) {
				var n;
				return o(
					ul,
					o(
						ul,
						ut(sh),
						o(
							e3,
							((n = r.aw),
							o(
								e8,
								t(function (r) {
									var n = iw(r);
									return '' === n ? n_ : nj(n);
								}),
								e1(
									n.aC
										? o(tj, e9, ii)
										: function (r) {
												return '`' !== r && !ii(r);
											}
								)
							)),
							il
						)
					),
					o(uy, D(r, ''), sL)
				);
			},
			sS
		),
		sT = t(function (r, n) {
			return 1 > r ? n : f(P, 0, -r, n);
		}),
		sR = function (r) {
			return o(Z, '#', r) ? sR(o(sT, 1, r)) : r;
		},
		sO = o(uf, '#', uo('a `#`')),
		sU = e1(function (r) {
			return ' ' === r || '\n' === r || '\r' === r;
		}),
		sH = o(
			ul,
			o(
				ul,
				o(
					e3,
					o(
						e3,
						ut(id),
						o(
							ez,
							function (r) {
								var n = tD(r);
								return 4 > n ? ut(n) : ur(uo('heading with < 4 spaces in front'));
							},
							e4(sU)
						)
					),
					ub(sO)
				),
				o(
					ez,
					function (r) {
						var n = tD(r) + 1;
						return 7 > n ? ut(n) : ur(uo("heading with < 7 #'s"));
					},
					e4(
						e1(function (r) {
							return '#' === r;
						})
					)
				)
			),
			uL(
				k([
					o(e3, ut(''), ub(ir)),
					o(
						ul,
						o(e3, ut(tm), uL(k([ub(ia), ub(oi)]))),
						o(
							e8,
							t(function (r) {
								var n, t;
								return o(Z, ' ', (t = sR((n = iw(r))))) || tw(t) ? t.replace(/\s+$/, '') : n;
							}),
							io
						)
					)
				])
			)
		),
		sB = o(uf, '>', uo('a `>`')),
		sI = e(function (r, n, t) {
			return { by: n, d: t, dO: r };
		}),
		sj = t(function (r, n) {
			return { by: n.by, d: r, e: n.e, b: n.b, dO: n.dO, cv: n.cv };
		}),
		s_ = t(function (r, n) {
			return function (t) {
				var e = n(o(sj, o(A, f(sI, t.dO, t.by, r), t.d), t));
				return e.$ ? e : f(eF, e.a, e.b, o(sj, t.d, e.c));
			};
		}),
		sV = function (r) {
			switch (r) {
				case ' ':
				case '\n':
				case '	':
				case '\v':
				case '\f':
				case '\r':
					return !0;
				default:
					return !1;
			}
		},
		sF = o(uf, '<', uo('a `<`')),
		sz = o(
			s_,
			'link destination',
			uL(k([o(ul, o(e3, ut(e$), ub(sF)), o(e3, e4(ui(sB)), ub(sB))), e4(ov(o(tj, e9, sV)))]))
		),
		sP = o(uf, ']', uo('a `]`')),
		sG = o(uf, '[', uo('a `[`')),
		sM = o(ul, o(e3, ut(fj), ub(sG)), o(e3, e4(ui(sP)), ub(o(uf, ']:', uo(']:'))))),
		sJ = o(uf, '"', uo('a double quote')),
		sZ = function (r) {
			return o(M, '\n\n', r) ? ur(uo('no blank line')) : ut(r);
		},
		sQ = o(
			e3,
			e1(function (r) {
				return !ii(r) && sV(r);
			}),
			il
		),
		sK = o(e3, o(eY, sV, uo('Required whitespace')), e1(sV)),
		sY = o(uf, "'", uo('a single quote')),
		sX =
			((oe = o(ul, o(e3, ut(nj), ub(sY)), o(e3, o(e3, o(ez, sZ, e4(ui(sY))), ub(sY)), sQ))),
			(ou = o(ul, o(e3, ut(nj), ub(sJ)), o(e3, o(e3, o(ez, sZ, e4(ui(sJ))), ub(sJ)), sQ))),
			o(
				s_,
				'title',
				uL(k([eP(o(ul, o(e3, ut(tm), sK), uL(k([ou, oe, ut(n_)])))), o(e3, ut(n_), sQ)]))
			)),
		sW = o(
			s_,
			'link reference definition',
			o(
				ul,
				o(
					ul,
					o(
						ul,
						o(
							e3,
							ut(
								e(function (r, n, t) {
									return D(r, { bE: n, cD: t });
								})
							),
							sq
						),
						o(e3, o(e3, o(e3, sM, e1(c9)), uL(k([it, ut(0)]))), e1(c9))
					),
					sz
				),
				sX
			)
		),
		s1 = e1(c9),
		s0 = function (r) {
			var n = i$(uB(r));
			return o(
				e3,
				o(
					e3,
					o(e3, o(e3, o(e3, o(e3, o(e3, ut(0), n), s1), n), s1), n),
					e1(function (n) {
						return v(n, r) || c9(n);
					})
				),
				il
			);
		},
		s2 = uL(k([s0('-'), s0('*'), s0('_')])),
		s3 = uL(
			k([o(ul, o(e3, o(e3, o(e3, ut(tm), sy), uL(k([sy, ut(0)]))), uL(k([sy, ut(0)]))), s2), s2])
		),
		s5 = t(function (r, n) {
			return { $: 12, a: r, b: n };
		}),
		s8 = o(uf, '=', uo('a `=`')),
		s4 = o(uf, '-', uo('a `-`')),
		s6 =
			((oa = e(function (r, n, t) {
				return o(e3, o(e3, ut(r), ub(n)), e1(g(t)));
			})),
			o(
				e8,
				t(function (r, n) {
					return o(s5, n, r);
				}),
				o(
					ul,
					o(e3, ut(tm), sq),
					o(e3, o(e3, uL(k([f(oa, 0, s8, '='), f(oa, 1, s4, '-')])), e1(c9)), il)
				)
			)),
		s9 = e1(c9),
		s7 = function (r) {
			return uL(k([o(eY, r, e7('Character not found')), ut(0)]));
		},
		lr = function (r) {
			var n = D(o(J, ':', r), o(Z, ':', r));
			return n.a ? nj(n.b ? 2 : 0) : n.b ? nj(1) : n_;
		},
		ln = o(
			up,
			function (r) {
				return { $: 9, a: r };
			},
			o(
				ez,
				function (r) {
					var n = r.a.cG,
						t = r.b;
					return u3(t)
						? ur(uo('Must have at least one column in delimiter row.'))
						: 1 !== nM(t) || (o(J, '|', n) && o(Z, '|', n))
							? ut(r)
							: ur(
									e7(
										'Tables with a single column must have pipes at the start and end of the delimiter row to avoid ambiguity.'
									)
								);
				},
				o(
					e8,
					t(function (r, n) {
						return o(ih, { cg: r, cG: iw(r) }, o(tE, lr, n2(n)));
					}),
					o(uy, q, function (r) {
						return uL(
							k([
								eP(
									o(
										up,
										function () {
											return uq(r);
										},
										i$('|\n')
									)
								),
								o(
									up,
									function () {
										return uq(r);
									},
									i$('\n')
								),
								o(
									up,
									function () {
										return uq(r);
									},
									a$(uo('end'))
								),
								eP(o(e3, o(e3, ut(uq(r)), i$('|')), a$(uo('end')))),
								o(
									ul,
									o(
										e3,
										o(
											e3,
											ut(function (n) {
												return uS(o(A, n, r));
											}),
											u3(r) ? uL(k([i$('|'), ut(0)])) : i$('|')
										),
										s9
									),
									o(
										e3,
										e4(
											o(
												e3,
												o(
													e3,
													o(
														e3,
														ut(0),
														s7(function (r) {
															return ':' === r;
														})
													),
													ov(function (r) {
														return '-' === r;
													})
												),
												s7(function (r) {
													return ':' === r;
												})
											)
										),
										s9
									)
								)
							])
						);
					})
				)
			)
		),
		lt = t(function (r, n) {
			return !o(uh, o(tj, e9, r), n);
		}),
		le = e(function (r, n, t) {
			for (;;) {
				if (r > 0 && n.b) {
					var e = n.a;
					(r -= 1), (n = n.b), (t = o(A, e, t));
					continue;
				}
				return t;
			}
		}),
		lu = t(function (r, n) {
			return n2(f(le, r, n, q));
		}),
		la = e(function (r, n, t) {
			if (n > 0) {
				var e = D(n, t);
				r: for (;;) {
					n: for (;;) {
						if (!e.b.b) return t;
						if (!e.b.b.b) {
							if (1 === e.a) break r;
							break;
						}
						switch (e.a) {
							case 1:
								break r;
							case 2:
								var u = e.b;
								return k([u.a, u.b.a]);
							case 3:
								if (e.b.b.b.b) {
									var a = e.b,
										c = a.b;
									return k([a.a, c.a, c.b.a]);
								}
								break n;
							default:
								if (e.b.b.b.b && e.b.b.b.b.b) {
									var i = e.b,
										s = i.b,
										l = s.b,
										b = l.b,
										d = b.b;
									return o(
										A,
										i.a,
										o(
											A,
											s.a,
											o(A, l.a, o(A, b.a, r > 1e3 ? o(lu, n - 4, d) : f(la, r + 1, n - 4, d)))
										)
									);
								}
								break n;
						}
					}
					return t;
				}
				return k([e.b.a]);
			}
			return q;
		}),
		lc = t(function (r, n) {
			return f(la, 0, r, n);
		}),
		li = t(function (r, n) {
			var t = nM(n);
			switch (o(m, r, t)) {
				case 0:
					return o(lc, r, n);
				case 1:
					return n;
				default:
					return y(n, o(s$, r - t, ''));
			}
		}),
		lo = function (r) {
			var n,
				t = r.a,
				e = r.b;
			return o(
				up,
				function (r) {
					return ip(o(ig, t, y(e, k([r]))));
				},
				((n = nM(t)),
				o(
					ez,
					function (r) {
						return u3(r) || o(lt, tw, r)
							? ur(e7('A line must have at least one column'))
							: ut(o(li, n, r));
					},
					iy
				))
			);
		},
		lf = o(uf, '*', uo('a `*`')),
		ls = o(uf, '+', uo('a `+`')),
		ll = uL(k([o(e3, ut(s4), ub(s4)), o(e3, ut(ls), ub(ls)), o(e3, ut(lf), ub(lf))])),
		lb = function (r) {
			return { $: 1, a: r };
		},
		ld = t(function (r, n) {
			return { $: 0, a: r, b: n };
		}),
		lv = uL(
			k([
				o(e3, ut(1), ub(o(uf, '[x] ', iU('[x] ')))),
				o(e3, ut(1), ub(o(uf, '[X] ', iU('[X] ')))),
				o(e3, ut(0), ub(o(uf, '[ ] ', iU('[ ] '))))
			])
		),
		lp = o(ul, uL(k([o(ul, ut(ld), o(e3, lv, e1(c9))), ut(lb)])), o(e3, e4(io), il)),
		lg = uL(k([o(ul, o(e3, ut(tm), eP(ov(c9))), lp), o(e3, ut(lb('')), it)])),
		lh = e(function (r, n, t) {
			return uL(
				k([
					o(
						up,
						function (r) {
							return uS(o(A, r, t));
						},
						r
					),
					ut(uq(o(A, n, n2(t))))
				])
			);
		}),
		lm =
			((oc = t(function (r, n) {
				return o(uy, q, o(lh, o(ul, o(e3, ut(tm), eP(ub(r))), lg), n));
			})),
			o(ez, tm, o(ul, o(ul, ut(oc), o(e3, eP(ll), ov(c9))), lp))),
		lD = o(
			up,
			o(
				eS,
				tE(function (r) {
					return r.$ ? { cS: r.a, bn: n_ } : { cS: r.b, bn: nj(1 === r.a) };
				}),
				function (r) {
					return { $: 3, a: r };
				}
			),
			lm
		),
		l$ = t(function (r, n) {
			switch (r.$) {
				case 0:
					var t = r.a,
						e = r.b,
						u = lq(r.c);
					if (u.$) return nR(u.a);
					return nB(o(A, cP(f(cJ, t, e, u.a)), n));
				case 1:
					var a = lA(r.a);
					return a.$ ? nR(uo(o(nF, '\n', o(tE, iC, a.a)))) : nB(y(n2(a.a), n));
				case 2:
					return nB(o(A, cP(cG(r.a)), n));
				case 3:
					return nB(o(A, cP(cB(r.a)), n));
				case 4:
					return nB(o(A, cP(c2(r.a)), n));
				default:
					return nB(o(A, cP(o(cM, r.a, r.b)), n));
			}
		}),
		lw = t(function (r, n) {
			var t = uO(
				o(
					tE,
					os(function (r) {
						return D(r.bE, r.cD);
					}),
					r
				)
			);
			return o(tE, lx, o(sv, t, n));
		}),
		lx = function (r) {
			switch (r.$) {
				case 0:
					return { $: 7, a: r.a };
				case 1:
					return cV;
				case 2:
					return { $: 6, a: r.a };
				case 3:
					return f(cK, r.a, r.b, o(tE, lx, (n = r.c)));
				case 4:
					return f(cZ, r.a, r.b, o(tE, lx, (n = r.c)));
				case 5:
					return { $: 0, a: ly(r.a) };
				case 6:
					var n = r.b;
					return 1 === r.a ? { $: 3, a: o(tE, lx, n) } : { $: 4, a: o(tE, lx, n) };
				default:
					return { $: 5, a: o(tE, lx, (n = r.a)) };
			}
		},
		ly = function (r) {
			switch (r.$) {
				case 1:
					return cG('TODO this never happens, but use types to drop this case.');
				case 0:
					return f(
						cJ,
						r.a,
						r.b,
						o(
							iE,
							function (r) {
								return 1 === r.$ ? lO(r.a) : k([cP(ly(r))]);
							},
							r.c
						)
					);
				case 2:
					return cG(r.a);
				case 3:
					return cB(r.a);
				case 4:
					return c2(r.a);
				default:
					return o(cM, r.a, r.b);
			}
		},
		lq = function (r) {
			return o(lS, r, q);
		},
		lS = t(function (r, n) {
			for (;;) {
				if (!r.b) return nB(n2(n));
				var t = r.b,
					e = o(l$, r.a, n);
				if (e.$) return nR(e.a);
				(r = t), (n = e.a);
			}
		}),
		lA = function (r) {
			var n = o(ao, o(e3, lj(), is), r);
			if (1 === n.$) return nR(n.a);
			var t = lk(n.a);
			return 1 === t.$
				? o(ao, ur(t.a), '')
				: nB(
						o(
							cA,
							function (r) {
								return !(5 === r.$ && !r.a.b);
							},
							t.a
						)
					);
		},
		lk = function (r) {
			return f(lE, r, r.H, q);
		},
		lE = e(function (r, n, t) {
			for (;;) {
				if (!n.b) return nB(t);
				var e = n.b,
					u = o(lL, r.R, n.a);
				switch (u.$) {
					case 1:
						(n = e), (t = o(A, u.a, t));
						continue;
					case 0:
						n = e;
						continue;
					default:
						return nR(u.a);
				}
			}
		}),
		lC = t(function (r, n) {
			return o(
				tE,
				function (n) {
					var t = n.at;
					return f(
						lN,
						r,
						function (r) {
							return { at: t, Y: r };
						},
						n.Y
					);
				},
				n
			);
		}),
		lL = t(function (r, n) {
			switch (n.$) {
				case 0:
					var t = n.b,
						e = (function (r) {
							switch (r) {
								case 1:
									return nB(0);
								case 2:
									return nB(1);
								case 3:
									return nB(2);
								case 4:
									return nB(3);
								case 5:
									return nB(4);
								case 6:
									return nB(5);
								default:
									return nR(uo("A heading with 1 to 6 #'s, but found " + nV(r)));
							}
						})(n.a);
					return e.$ ? cQ(e.a) : c0(o(cF, e.a, o(lw, r, t)));
				case 1:
					return c0(c1(o(lw, r, (t = n.a))));
				case 2:
					return c0(cP(n.a));
				case 3:
					return c0({
						$: 1,
						a: o(
							tE,
							function (n) {
								var t;
								return o(cY, (t = n.bn).$ ? 0 : t.a ? 2 : 1, f(lN, r, tm, n.cS));
							},
							n.a
						)
					});
				case 4:
					return (t = n.b), c0(o(cW, n.a, o(tE, o(lN, r, tm), t)));
				case 5:
					return c0(cI(n.a));
				case 7:
					return c0(c5);
				case 10:
					return c_;
				case 11:
					var u = n.a,
						a = o(ao, lj(), u);
					if (a.$) return cQ(e7(o(nF, '\n', o(tE, iC, a.a))));
					var c = lk(a.a);
					return c.$ ? cQ(c.a) : c0({ $: 3, a: c.a });
				case 6:
					return c0(cI({ cS: n.a, dg: n_ }));
				case 8:
					var i = n.a,
						s = i.b;
					return c0(o(c3, o(lC, r, i.a), o(lT, r, s)));
				case 9:
					return c0(c1(o(lw, r, n.a.a.cg)));
				default:
					return c0(c1(o(lw, r, n.b)));
			}
		}),
		lN = e(function (r, n, t) {
			return n(o(lw, r, t));
		}),
		lT = t(function (r, n) {
			return o(
				tE,
				function (n) {
					return o(
						tE,
						function (n) {
							return f(lN, r, tm, n);
						},
						n
					);
				},
				n
			);
		}),
		lR = function (r) {
			return uL(
				k([
					o(
						up,
						function () {
							return uq(r);
						},
						is
					),
					o(
						up,
						function (n) {
							return uS(o(c4, r, n));
						},
						eP(sW)
					),
					o(
						up,
						function (n) {
							return uS(o(iS, r, n));
						},
						(function () {
							var n = r.H;
							r: for (; n.b; )
								switch (n.a.$) {
									case 1:
										return lB();
									case 8:
										var t = n.a.a;
										return uL(k([lH(), lo(t)]));
									default:
										break r;
								}
							return lH();
						})()
					),
					o(
						up,
						function (n) {
							return uS(o(iS, r, n));
						},
						ob
					)
				])
			);
		},
		lO = function (r) {
			return o(tM, q, lA(r));
		},
		lU = function (r) {
			switch (r.$) {
				case 1:
					return ut(cX(r.a));
				case 0:
					var n = r.a,
						t = r.b,
						e = lq(r.c);
					return e.$ ? ur(e.a) : ut(cz(f(cJ, n, t, e.a)));
				case 2:
					return ut(cz(cG(r.a)));
				case 3:
					return ut(cz(cB(r.a)));
				case 4:
					return ut(cz(c2(r.a)));
				default:
					return ut(cz(o(cM, r.a, r.b)));
			}
		};
	function lH() {
		return uL(
			k([
				sg,
				ie,
				ib,
				o(up, cj, eP(sN)),
				of,
				o(
					up,
					function () {
						return c8;
					},
					eP(s3)
				),
				lD,
				oy(!1),
				eP(sH),
				lI()
			])
		);
	}
	function lB() {
		return uL(
			k([
				sg,
				ie,
				ib,
				o(up, cj, eP(sN)),
				eP(s6),
				o(
					up,
					function () {
						return c8;
					},
					eP(s3)
				),
				lD,
				oy(!0),
				eP(sH),
				lI(),
				eP(ln)
			])
		);
	}
	function lI() {
		return o(ez, lU, or);
	}
	function lj() {
		return o(uy, { R: q, H: q }, lR);
	}
	var l_ = lH();
	lH = function () {
		return l_;
	};
	var lV = lB();
	lB = function () {
		return lV;
	};
	var lF = lI();
	lI = function () {
		return lF;
	};
	var lz = lj();
	lj = function () {
		return lz;
	};
	var lP,
		lG,
		lM,
		lJ,
		lZ = e(function (r, n, t) {
			if (1 === n.$) return nR(n.a);
			var e = n.a;
			return 1 === t.$ ? nR(t.a) : nB(o(r, e, t.a));
		}),
		lQ = o(tk, lZ(A), nB(q)),
		lK = t(function (r, n) {
			return n.$ ? nR(n.a) : r(n.a);
		}),
		lY = t(function (r, n) {
			for (;;) {
				if (r > 0 && n.b) {
					(r -= 1), (n = n.b);
					continue;
				}
				return n;
			}
		}),
		lX = e(function (r, n, t) {
			for (;;) {
				if (!t.b) return n;
				var e = t.a,
					u = t.b;
				switch (e.$) {
					case 0:
						var a = e.a;
						if (a.$) {
							(i = r), (f = o(r, e, n)), (r = i), (n = f), (t = u);
							continue;
						}
						var c = a.c,
							i = r,
							f = o(r, e, n);
						(r = i), (n = f), (t = y(c, u));
						continue;
					case 1:
					case 2:
					case 4:
					case 5:
					case 6:
					case 7:
					default:
						(i = r), (f = o(r, e, n)), (r = i), (n = f), (t = u);
						continue;
					case 3:
						var s = e.a;
						(i = r), (f = o(r, e, n)), (r = i), (n = f), (t = y(s, u));
						continue;
				}
			}
		}),
		lW = function (r) {
			switch (r.$) {
				case 5:
					return l1(r.a);
				case 0:
					var n = r.a;
					if (n.$) return '';
					var e = n.c;
					return f(
						lX,
						t(function (r, n) {
							return y(n, lW(r));
						}),
						'',
						e
					);
				case 1:
					return o(
						nF,
						'\n',
						o(
							tE,
							function (r) {
								return l1(r.b);
							},
							r.a
						)
					);
				case 2:
					return o(nF, '\n', o(tE, l1, r.b));
				case 3:
					return o(nF, '\n', o(tE, lW, (e = r.a)));
				case 4:
					return l1(r.b);
				case 6:
					var u = r.b;
					return o(
						nF,
						'\n',
						ik(
							k([
								o(
									tE,
									l1,
									o(
										tE,
										function (r) {
											return r.Y;
										},
										r.a
									)
								),
								ik(o(tE, tE(l1), u))
							])
						)
					);
				case 7:
					return r.a.cS;
				default:
					return '';
			}
		},
		l1 = function (r) {
			return f(nG, l0, '', r);
		},
		l0 = t(function (r, n) {
			switch (r.$) {
				case 7:
				case 6:
					return y(n, r.a);
				case 8:
					return n + ' ';
				case 1:
				case 2:
					return y(n, l1(r.c));
				case 0:
					var e = r.a;
					if (e.$) return n;
					var u = e.c;
					return f(
						lX,
						t(function (r, n) {
							return y(n, lW(r));
						}),
						n,
						u
					);
				default:
					return y(n, l1(r.a));
			}
		}),
		l2 = a(function (r, n, t, e, u) {
			return o(
				lK,
				function (u) {
					return o(
						u_,
						function (r) {
							return r(u);
						},
						f(e, r, n, t)
					);
				},
				lQ(u)
			);
		}),
		l3 = function (r) {
			return k([r]);
		},
		l5 = e(function (r, n, t) {
			var e = o(l9, r, n);
			return e.$ ? t : o(A, e.a, t);
		}),
		l8 = t(function (r, n) {
			return o(o8, l4(r), n);
		}),
		l4 = function (r) {
			return function (n) {
				switch (n.$) {
					case 4:
						var e,
							u = n.a;
						return nj(
							o(
								u_,
								function (n) {
									return r.c8({ cW: n, dh: u, dG: l1(e) });
								},
								o(l7, r, (e = n.b))
							)
						);
					case 5:
						return nj(o(u_, r.dC, o(l7, r, (e = n.a))));
					case 0:
						var a = n.a;
						return a.$ ? n_ : nj(s(l6, r, a.a, a.b, a.c));
					case 1:
						return nj(
							o(
								u_,
								r.ed,
								lQ(
									o(
										tE,
										function (n) {
											var t = n.a;
											return o(
												u_,
												function (r) {
													return o(cY, t, r);
												},
												o(l7, r, n.b)
											);
										},
										(c = n.a)
									)
								)
							)
						);
					case 2:
						var c = n.b;
						return nj(o(u_, r.dB(n.a), lQ(o(tE, l7(r), c))));
					case 7:
						return nj(nB(r.cX(n.a)));
					case 8:
						return nj(nB(r.d6));
					case 3:
						return nj(o(u_, r.cR, lQ(o(l8, r, n.a))));
					default:
						var i = n.a,
							l = n.b,
							b = lQ(
								o(
									tE,
									function (n) {
										var t = n.Y;
										return o(u_, tP(n.at), o(l7, r, t));
									},
									i
								)
							),
							d = o(
								u_,
								function (n) {
									return r.d0(
										l3(
											r.d2(
												o(
													tE,
													function (n) {
														return o(r.d1, n.a, n.b);
													},
													n
												)
											)
										)
									);
								},
								b
							),
							v = lQ(
								o(
									tE,
									function (n) {
										return o(
											u_,
											r.d2,
											o(
												u_,
												nQ(
													t(function (n, t) {
														return o(
															r.d$,
															o(
																cH,
																function (r) {
																	return r.at;
																},
																fH(o(lY, n, i))
															),
															t
														);
													})
												),
												lQ(o(tE, l7(r), n))
											)
										);
									},
									l
								)
							);
						return nj(
							f(
								lZ,
								t(function (n, t) {
									return r.dZ(o(A, n, u3(t) ? q : k([r.d_(t)])));
								}),
								d,
								v
							)
						);
				}
			};
		},
		l6 = u(function (r, n, t, e) {
			return l(l2, n, t, e, r.da, o(l8, r, e));
		}),
		l9 = t(function (r, n) {
			switch (n.$) {
				case 4:
					return nj(o(u_, r.dX, o(l7, r, n.a)));
				case 3:
					return nj(o(u_, r.c1, o(l7, r, n.a)));
				case 5:
					return nj(o(u_, r.dW, o(l7, r, n.a)));
				case 2:
					var t = n.a,
						e = n.b;
					return nj(nB(r.db({ br: l1(n.c), cv: t, cD: e })));
				case 7:
					return nj(nB(r.d5(n.a)));
				case 6:
					return nj(nB(r.cY(n.a)));
				case 1:
					var u = n.a;
					return (
						(e = n.b),
						nj(
							o(
								lK,
								function (n) {
									return nB(o(r.di, { bE: u, cD: e }, n));
								},
								o(l7, r, n.c)
							)
						)
					);
				case 8:
					return nj(nB(r.c6));
				default:
					var a = n.a;
					return a.$ ? n_ : nj(s(l6, r, a.a, a.b, a.c));
			}
		}),
		l7 = t(function (r, n) {
			return lQ(f(tk, l5(r), q, n));
		}),
		br = t(function (r, n) {
			return lQ(o(l8, r, n));
		}),
		bn = e(function (r, n, t) {
			return { $: 0, a: r, b: n, c: t };
		}),
		bt = e(function (r, n, t) {
			return f(bn, r, n, { $: 1, a: t });
		}),
		be = bt('a'),
		bu = t(function (r, n) {
			return { $: 1, a: r, b: n };
		}),
		ba = function (r) {
			return o(bu, 'alt', r);
		},
		bc = bt('blockquote'),
		bi = { $: 0 },
		bo = e(function (r, n) {
			return f(bn, r, n, bi);
		}),
		bf = bo('br'),
		bs = bt('code'),
		bl = bt('del'),
		bb = bt('em'),
		bd = bt('h1'),
		bv = bt('h2'),
		bp = bt('h3'),
		bg = bt('h4'),
		bh = bt('h5'),
		bm = bt('h6'),
		bD = bo('hr'),
		b$ = bo('img'),
		bw = bt('li'),
		bx = bt('ol'),
		by = t(function (r, n) {
			return 1 === r.$ ? (n.$ ? nR(o(A, r.a, n.a)) : nB(n.a)) : nB(r.a);
		}),
		bq = t(function (r, n) {
			return u3(n)
				? '<' + r + '>'
				: '<' +
						r +
						' ' +
						o(
							nF,
							' ',
							o(
								tE,
								function (r) {
									return r.ai + '="' + r.aP + '"';
								},
								n
							)
						) +
						'>';
		}),
		bS = bt('p'),
		bA = bt('pre'),
		bk = function (r) {
			return o(bu, 'src', r);
		},
		bE = bt('strong'),
		bC = bt('table'),
		bL = bt('tbody'),
		bN = bt('td'),
		bT = function (r) {
			return { $: 1, a: r };
		},
		bR = bt('th'),
		bO = bt('thead'),
		bU = bt('tr'),
		bH = bt('ul'),
		bB = function (r) {
			return k(r.trim().split(/\s+/g));
		},
		bI = {
			cR: bc(q),
			cX: function (r) {
				var n,
					t = r.cS,
					e = !(n = o(tQ, bB, r.dg)).$ && n.a.b ? k([o(bu, 'className', 'language-' + n.a.a)]) : q;
				return o(bA, q, k([o(bs, e, k([bT(t)]))]));
			},
			cY: function (r) {
				return o(bs, q, k([bT(r)]));
			},
			c1: function (r) {
				return o(bb, q, r);
			},
			c6: o(bf, q, q),
			c8: function (r) {
				var n = r.cW;
				switch (r.dh) {
					case 0:
						return o(bd, q, n);
					case 1:
						return o(bv, q, n);
					case 2:
						return o(bp, q, n);
					case 3:
						return o(bg, q, n);
					case 4:
						return o(bh, q, n);
					default:
						return o(bm, q, n);
				}
			},
			da:
				((lG = o(
					tE,
					function (r) {
						return r;
					},
					q
				)),
				(lP = f(
					nG,
					t(function (r, n) {
						return e(function (t, e, u) {
							return o(by, f(r, t, e, u), f(n, t, e, u));
						});
					}),
					e(function () {
						return nR(q);
					}),
					lG
				)),
				e(function (r, n, e) {
					return o(
						uV,
						function (e) {
							if (e.b) {
								if (e.b.b)
									return (
										'oneOf failed parsing this value:\n    ' +
										o(bq, r, n) +
										'\n\nParsing failed in the following 2 ways:\n\n\n' +
										o(
											nF,
											'\n\n',
											o(
												nQ,
												t(function (r, n) {
													return '(' + nV(r + 1) + ') ' + n;
												}),
												e
											)
										) +
										'\n'
									);
								var u = e.a;
								return 'Problem with the given value:\n\n' + o(bq, r, n) + '\n\n' + u + '\n';
							}
							return 'Ran into a oneOf with no possibilities!';
						},
						f(lP, r, n, e)
					);
				})),
			db: function (r) {
				var n = r.cD;
				if (n.$) return o(b$, k([bk(r.cv), ba(r.br)]), q);
				var t = n.a;
				return o(b$, k([bk(r.cv), ba(r.br), o(bu, 'title', t)]), q);
			},
			di: t(function (r, n) {
				return o(be, k([o(bu, 'href', r.bE)]), n);
			}),
			dB: t(function (r, n) {
				return o(
					bx,
					1 === r ? k([o(bu, 'start', nV(r))]) : q,
					o(
						tE,
						function (r) {
							return o(bw, q, r);
						},
						n
					)
				);
			}),
			dC: bS(q),
			dW: function (r) {
				return o(bl, q, r);
			},
			dX: function (r) {
				return o(bE, q, r);
			},
			dZ: bC(q),
			d_: bL(q),
			d$: function () {
				return bN(q);
			},
			d0: bO(q),
			d1: function () {
				return bR(q);
			},
			d2: bU(q),
			d5: bT,
			d6: o(bD, q, q),
			ed: function (r) {
				return o(
					bH,
					q,
					o(
						tE,
						function (r) {
							return o(bw, q, r.b);
						},
						r
					)
				);
			}
		},
		bj = function (r) {
			return r.$ ? n_ : nj(r.a);
		},
		b_ = e(function (r, n, t) {
			return y(o(oQ, r * n, ' '), t);
		}),
		bV = t(function (r, n) {
			if (n.b) {
				if (n.b.b) {
					e = n.a;
					var e,
						u = n.b;
					return f(
						nG,
						t(function (n, t) {
							return y(n, y(r, t));
						}),
						e,
						u
					);
				}
				return n.a;
			}
			return '';
		}),
		bF = e(function (r, n, t) {
			return o(nF, n, o(nz, r, t));
		}),
		bz = o(eS, o(bF, '&', '&amp;'), o(eS, o(bF, '<', '&lt;'), o(bF, '>', '&gt;'))),
		bP = function (r) {
			return r.b;
		},
		bG = o(
			_,
			t(function (r, n) {
				return '"' === r ? n + '\\"' : y(n, uB(r));
			}),
			''
		),
		bM = o(
			_,
			t(function (r, n) {
				return nX(r) ? n + '-' + uB(r.toLowerCase()) : y(n, uB(r));
			}),
			''
		),
		bJ = t(function (r, n) {
			return bM(r) + '="' + bG(n) + '"';
		}),
		bZ = function (r) {
			switch (r) {
				case 'className':
					return 'class';
				case 'defaultValue':
					return 'value';
				case 'htmlFor':
					return 'for';
				default:
					return r;
			}
		},
		bQ = t(function (r, n) {
			var t = n.a,
				e = n.b,
				u = n.c;
			switch (r.$) {
				case 0:
					return $(t, e, o(A, o(bJ, r.a, (a = r.b)), u));
				case 1:
					if ('className' === r.a) return $(o(A, (a = r.b), t), e, u);
					var a = r.b;
					return $(t, e, o(A, o(bJ, bZ((c = r.a)), a), u));
				case 2:
					var c = r.a;
					return r.b ? $(t, e, o(A, bM(bZ(c)), u)) : n;
				case 3:
					return (a = r.b), $(t, e, o(A, o(bJ, bZ((c = r.a)), o(rm, 0, a)), u));
				case 4:
					return (a = r.b), $(t, o(A, bG(r.a) + ': ' + bG(a), e), u);
				default:
					return n;
			}
		}),
		bK = t(function (r, n) {
			return r.b ? o(A, o(bJ, 'class', o(bV, ' ', r)), n) : n;
		}),
		bY = t(function (r, n) {
			return r.b ? o(A, o(bJ, 'style', o(bV, '; ', r)), n) : n;
		}),
		bX = t(function (r, n) {
			var t;
			return (
				'<' + o(nF, ' ', o(A, r, o(bY, (t = f(nG, bQ, $(q, q, q), n)).b, o(bK, t.a, t.c)))) + '>'
			);
		}),
		bW = e(function (r, n, t) {
			for (;;) {
				if (!n.b) {
					var e = t.N;
					if (e.b) {
						var u = e.a,
							a = e.b,
							c = r,
							i = u.b,
							f = w(t, { p: t.p - 1, r: o(A, o(r, t.p - 1, '</' + (l = u.a) + '>'), t.r), N: a });
						(r = c), (n = i), (t = f);
						continue;
					}
					return t;
				}
				if (n.a.$)
					(c = r),
						(i = a = n.b),
						(f = w(t, { r: o(A, o(r, t.p, bz(n.a.a)), t.r) })),
						(r = c),
						(n = i),
						(t = f);
				else {
					var s = n.a,
						l = s.a,
						b = s.b,
						d = s.c;
					switch (((a = n.b), d.$)) {
						case 0:
							(c = r),
								(i = a),
								(f = w(t, { r: o(A, o(r, t.p, o(bX, l, b)), t.r) })),
								(r = c),
								(n = i),
								(t = f);
							continue;
						case 1:
							(c = r),
								(i = d.a),
								(f = w(t, {
									p: t.p + 1,
									r: o(A, o(r, t.p, o(bX, l, b)), t.r),
									N: o(A, D(l, a), t.N)
								})),
								(r = c),
								(n = i),
								(t = f);
							continue;
						default:
							(c = r),
								(i = o(tE, bP, d.a)),
								(f = w(t, {
									p: t.p + 1,
									r: o(A, o(r, t.p, o(bX, l, b)), t.r),
									N: o(A, D(l, a), t.N)
								})),
								(r = c),
								(n = i),
								(t = f);
							continue;
					}
				}
			}
		}),
		b1 = t(function (r, n) {
			return o(bV, r ? '\n' : '', f(bW, r ? b_(r) : e0(tm), k([n]), { p: 0, r: q, N: q }).r);
		}),
		b0 = function (r) {
			return f(
				nG,
				t(function (r, n) {
					return f(rD, r.a, r.b, n);
				}),
				{},
				r
			);
		},
		b2 = e(function (r, n, t) {
			var e = r.aq,
				u = o(
					eg,
					q,
					o(
						tQ,
						function (r) {
							return k([D('format', 'org.matrix.custom.html'), D('formatted_body', r)]);
						},
						o(
							cH,
							function (r) {
								return v(r, '<p>' + t + '</p>') ? n_ : nj(r);
							},
							o(tQ, o(eS, tE(b1(0)), nF('')), o(eg, n_, o(tQ, o(eS, br(bI), bj), f(eS, lA, bj, t))))
						)
					)
				);
			return o(ey, r, {
				cS: cU(b0(y(k([D('msgtype', 'm.text'), D('body', t)]), u))),
				dk: 'PUT',
				dD: q,
				dE: k(['rooms', n, 'send', 'm.room.message', nV(e)]),
				dL: tg(0)
			});
		}),
		b3 = e(function (r, n, t) {
			return o(
				rx,
				function () {
					return f(b2, r, n, t);
				},
				o(aJ, r, n)
			);
		}),
		b5 = e(function (r, n, t) {
			return D(f(aZ(r) ? b2 : b3, r, n, t), w(r, { aq: r.aq + 1 }));
		}),
		b8 = function (r) {
			return r.aO;
		},
		b4 = function (r) {
			return '@' + r.a + ':' + r.b;
		},
		b6 = t(function (r, n) {
			return o(ey, r, {
				cS: cU(b0(k([D('displayname', n)]))),
				dk: 'PUT',
				dD: q,
				dE: k(['profile', b4(b8(r)), 'displayname']),
				dL: tg(0)
			});
		}),
		b9 =
			(rR[(lM = 'storeSession')] && R(3),
			(rR[lM] = {
				e: rG,
				u: function (r) {
					return r;
				},
				a: function (r) {
					var n = [],
						t = rR[r].u,
						u = rT(0);
					return (
						(rR[r].b = u),
						(rR[r].c = e(function (r, e) {
							for (; e.b; e = e.b) for (var a = n, c = t(e.a), i = 0; a.length > i; i++) a[i](c);
							return u;
						})),
						{
							subscribe: function (r) {
								n.push(r);
							},
							unsubscribe: function (r) {
								var t = (n = n.slice()).indexOf(r);
								0 > t || n.splice(t, 1);
							}
						}
					);
				}
			}),
			rB(lM)),
		b7 = function (r) {
			var n, t, e, u;
			return b9(
				((n = r.aC),
				(t = r.aq),
				(e = r.aO),
				(u = r.U),
				o(
					rm,
					0,
					b0(
						k([
							D('homeserverUrl', r.bQ),
							D('kind', n ? 'user' : 'guest'),
							D('txnId', t),
							D('userId', b4(e)),
							D('accessToken', u)
						])
					)
				))
			);
		},
		dr = t(function (r, n) {
			return w(n, r.$ ? { ai: r.a } : { V: r.a });
		}),
		dn = function (r) {
			return { $: 5, a: r };
		},
		dt = function (r) {
			return { $: 0, a: r };
		},
		de = function (r) {
			return { $: 1, a: r };
		},
		du = function (r) {
			var n = r.cH,
				t = r.b6;
			return b0(
				k([
					D('type', 'm.login.password'),
					D('identifier', b0(k([D('type', 'm.id.user'), D('user', n)]))),
					D('password', t),
					D('initial_device_display_name', 'Cactus Comments')
				])
			);
		},
		da = function (r) {
			var n = r.bQ;
			return co({
				cS: cU(du({ b6: r.b6, cH: r.cH })),
				dk: 'POST',
				dL: o(ca, n, 1),
				ef: f(ex, n, k(['login']), q)
			});
		},
		dc = t(function (r, n) {
			return o(ry, o(tj, tY, r), n);
		}),
		di = function (r) {
			return r.a;
		},
		df = t(function (r, n) {
			var t,
				e = r.Q;
			return e.$
				? o(
						rx,
						function (t) {
							return o(dc, de, da({ bQ: t, b6: r.am, cH: di(n) }));
						},
						o(
							dc,
							dt,
							((t = 'https://' + n.b + '/.well-known/matrix/client'),
							ep({
								cS: aH,
								c7: q,
								dk: 'GET',
								dK: ed(function (r) {
									if (4 === r.$) {
										var n = r.b,
											e = o(
												rf,
												o(
													tv,
													function (r) {
														return o(Z, '/', r) ? o(sT, 1, r) : r;
													},
													o(rn, 'm.homeserver', o(rn, 'base_url', rr))
												),
												n
											);
										return e.$ ? nR(n5(e.a)) : nB(e.a);
									}
									return nR('Failed getting ' + t);
								}),
								d7: n_,
								ef: t
							}))
						)
					)
				: o(dc, de, da({ bQ: e.a, b6: r.am, cH: di(n) }));
		}),
		ds = t(function (r, n) {
			var t,
				e = function (r) {
					return $(r, aK, n_);
				};
			switch (n.$) {
				case 1:
					return e(w(r, { am: n.a }));
				case 2:
					return e(w(r, { Q: nj(n.a) }));
				case 0:
					var u = n.a;
					return e(w(r, { aO: aL(u), bp: u }));
				case 3:
					return e(w(r, { I: 2 }));
				case 4:
					var a = n.a;
					return $(w(r, { I: 1 }), o(t_, dn, o(df, r, a)), n_);
				default:
					if (1 === n.a.$) {
						var c = n.a.a;
						return e(
							w(r, { Q: (t = D(c, r.Q)).a.$ || 1 !== t.b.$ ? r.Q : nj(''), a4: nj(c), I: 0 })
						);
					}
					return $(aM, aK, nj(n.a.a));
			}
		}),
		dl = t(function (r, n) {
			if (n.$) {
				var e = n.a,
					u = t(function (r, n) {
						return 0 > h(nM(cS(n.C)), e.an) ? o(t_, o(cw, r, 0), o(cC, r, n)) : aK;
					});
				return o(
					cN,
					tH,
					(function () {
						switch (r.$) {
							case 0:
								return D(
									w(e, { a7: r.a }),
									o(
										eg,
										aK,
										f(
											cL,
											t(function (r, n) {
												return o(t_, o(cw, r, 1), o(cE, r, n));
											}),
											e.bc,
											e.M
										)
									)
								);
							case 1:
								var n,
									a,
									c = r.a;
								return D(
									w(e, {
										A: o(
											cA,
											function (r) {
												return !v(r.X, c);
											},
											e.A
										)
									}),
									aK
								);
							case 5:
								return D(w(e, { K: o(dr, r.a, e.K) }), aK);
							case 6:
								if (r.a.$) {
									var i = r.a.a;
									return D(w(e, { A: o(cq, e.A, i.a + ' ' + i.b) }), aK);
								}
								var s = r.a.a,
									l = s.a;
								return D(w(e, { M: nj((m = s.b)), bc: nj(l) }), rI(k([b7(l), o(u, l, m)])));
							case 7:
								if (r.c.$) {
									var b = r.c.a;
									return D(w(e, { A: o(cq, e.A, b.a + ' ' + b.b) }), aK);
								}
								l = r.a;
								var d = r.b,
									p = r.c.a,
									g = o(
										tQ,
										function (r) {
											return f(cO, r, d, p);
										},
										e.M
									),
									h = w(e, { af: e.af || (u3(p.bx) && !d), M: g });
								return D(h, (a = D(g, h.af)).a.$ || a.b ? aK : o(u, l, a.a.a));
							case 8:
								l = r.a;
								var m = r.b;
								return D(w(e, { an: e.an + e.z.a9 }), o(t_, o(cw, l, 0), o(cC, l, m)));
							case 9:
								var $,
									x = f(b5, (l = r.a), r.b, e.K.V),
									y = x.a,
									q = x.b;
								return D(
									w(e, { K: w(e.K, { V: '' }), bc: nj(q) }),
									rI(
										k([
											o(
												t_,
												cy(l),
												1 === aZ(l)
													? y
													: o(
															rx,
															function () {
																return y;
															},
															o(b6, l, '' === ($ = e.K).ai ? 'Anonymous' : $.ai)
														)
											),
											b7(q)
										])
									)
								);
							case 10:
								if (r.b.$) {
									var S = r.b.a;
									return D(w(e, { A: o(cq, e.A, S.a + ' ' + S.b) }), aK);
								}
								return D(e, o(eg, aK, o(tQ, o(eS, cE((l = r.a)), t_(o(cw, l, 1))), e.M)));
							case 4:
								var A = o(ds, e.Z, r.a),
									E = A.a,
									C = A.b,
									L = o(
										eg,
										aK,
										o(
											tQ,
											function (r) {
												return o(
													t_,
													tB,
													o(
														rx,
														function () {
															return o(tC, tP(r), o(aP, r, e.z.dN));
														},
														o(aJ, r, e.z.dN)
													)
												);
											},
											(q = A.c)
										)
									),
									N = o(eg, aK, o(tQ, b7, q));
								return D(w(e, { Z: E, bc: q.$ ? e.bc : q }), rI(k([o(rj, cx, C), L, N])));
							case 2:
								return D(w(e, { Z: 2 === (n = e.Z).I ? w(n, { I: 0 }) : n }), aK);
							default:
								return D(
									e,
									o(
										t_,
										tB,
										o(
											rx,
											function (r) {
												return o(tC, tP(r), o(aP, r, e.z.dN));
											},
											cf(e.z.aR)
										)
									)
								);
						}
					})()
				);
			}
			return D(n, aK);
		}),
		db = function (r) {
			return { $: 5, a: r };
		},
		dd = { $: 3 },
		dv = t(function (r, n) {
			return { $: 9, a: r, b: n };
		}),
		dp = { $: 2 },
		dg = t(function (r, n) {
			return { $: 8, a: r, b: n };
		}),
		dh = rK('button'),
		dm = t(function (r, n) {
			return o(r1, r, n);
		}),
		dD = dm('className'),
		d$ = rK('div'),
		dw = tE(r5(tq)),
		dx = function (r) {
			return d$(dw(r));
		},
		dy = function (r) {
			return r.F;
		},
		dq = t(function (r, n) {
			return o(rX, r, { $: 0, a: n });
		}),
		dS = function (r) {
			return o(dq, 'click', tg(r));
		},
		dA = function (r) {
			return { $: 0, a: r };
		},
		dk = function (r) {
			return { $: 1, a: r };
		},
		dE = rK('a'),
		dC = function (r) {
			return dE(dw(r));
		},
		dL = t(function (r, n) {
			return o(r1, r, n);
		}),
		dN = dL('disabled'),
		dT = function (r) {
			return o(dm, 'href', /^javascript:/i.test(r.replace(/\s/g, '')) ? '' : r);
		},
		dR = rK('input'),
		dO = dm('type'),
		dU = dm('value'),
		dH = t(function (r, n) {
			return o(dR, y(k([dO('text'), dU(r)]), n), q);
		}),
		dB = function (r) {
			return 1 === r.aC;
		},
		dI = dm('htmlFor'),
		dj = k([
			o(rW, 'property', 'clip rect(1px, 1px, 1px, 1px)'),
			o(rW, 'position', 'absolute'),
			o(rW, 'height', '1px'),
			o(rW, 'width', '1px'),
			o(rW, 'overflow', 'hidden'),
			o(rW, 'margin', '-1px'),
			o(rW, 'padding', '0'),
			o(rW, 'border', '0')
		]),
		d_ = rK('label'),
		dV = function (r) {
			return d_(dw(r));
		},
		dF = rK('span'),
		dz = function (r) {
			return dF(dw(r));
		},
		dP = u(function (r, n, t, e) {
			return o(dz, q, k([o(dV, o(A, dI(r), y(dj, n)), k([o(rY, tq, t)])), e]));
		}),
		dG = function (r) {
			return f(eD, 'https://matrix.to', k(['#', e$(r)]), q);
		},
		dM = function (r) {
			return D(r, !0);
		},
		dJ = t(function (r, n) {
			return o(rX, r, { $: 1, a: n });
		}),
		dZ = t(function (r, n) {
			return f(tk, rn, n, r);
		}),
		dQ = o(dZ, k(['target', 'value']), rr),
		dK = function (r) {
			return o(dJ, 'input', o(tv, dM, o(tv, r, dQ)));
		},
		dY = dm('placeholder'),
		dX = rK('textarea'),
		dW = e(function (r, n, t) {
			var e,
				u =
					(e = D(o(tQ, dB, r), o(tQ, b8, r))).a.$ || !e.a.a || e.b.$
						? 'Post'
						: 'Post as ' + b4(e.b.a),
				a = v(r, n_) || !tD(t),
				c = y(
					k([dD('cactus-button'), dD('cactus-send-button'), dN(a)]),
					o(eg, q, o(tQ, l3, o(tQ, dS, n)))
				);
			return o(dh, c, k([rZ(u)]));
		}),
		d1 = t(function (r, n) {
			var t,
				e,
				u,
				a,
				c,
				i,
				l,
				b = n.bc,
				d = n.dN,
				v = n.a3,
				p = n.aV,
				g = n.dm,
				h = n.dR,
				m = n.dj,
				$ = f(dW, b, n.dP, r.V),
				w = o(eg, !0, o(tQ, o(eS, dB, e9), b))
					? o(
							dx,
							k([dD('cactus-editor-name')]),
							k([s(dP, 'Name', q, rZ('Name'), o(dH, r.ai, k([dY('Name'), dK(o(eS, dk, g))])))])
						)
					: rZ(''),
				x = v
					? ((e = (t = { bZ: h, b_: m, bc: b }).bZ),
						(u = t.b_),
						(a = t.bc),
						(c = o(
							dh,
							k([dD('cactus-button'), dD('cactus-logout-button'), dS(u)]),
							k([rZ('Log out')])
						)),
						(i = o(
							dh,
							k([dD('cactus-button'), dD('cactus-login-button'), dS(e)]),
							k([rZ('Log in')])
						)),
						a.$ ? i : dB(a.a) ? c : i)
					: o(dC, k([dT(dG(d))]), k([o(dh, k([dD('cactus-button')]), k([rZ('Log in')]))])),
				y = function (n) {
					return s(
						dP,
						'Comment Editor',
						q,
						rZ('Comment Editor'),
						o(
							dX,
							k([
								dD('cactus-editor-textarea'),
								dU(r.V),
								dK(o(eS, dA, g)),
								dY('Add a comment'),
								dN(!n)
							]),
							q
						)
					);
				},
				S = o(dx, k([dD('cactus-editor-buttons')]), k([x, $]));
			return o(
				dx,
				k([dD('cactus-editor')]),
				k(
					(l = D(v, p)).a
						? l.b
							? [y(!0), o(dx, k([dD('cactus-editor-below')]), k([w, S]))]
							: [y(o(eg, !1, o(tQ, dB, b))), o(dx, k([dD('cactus-editor-below')]), k([S]))]
						: l.b
							? [y(!0), o(dx, k([dD('cactus-editor-below')]), k([w, S]))]
							: [
									o(
										dC,
										k([dT(dG(d)), dD('cactus-button'), dD('cactus-matrixdotto-only')]),
										k([rZ('Comment using a Matrix client')])
									)
								]
				)
			);
		}),
		d0 = t(function (r, n) {
			return o(r0, /^(on|formAction$)/i.test(r) ? 'data-' + r : r, r2(n));
		}),
		d2 = r0('class'),
		d3 = r0('d'),
		d5 = o(tj, d0, x('aria-')),
		d8 = d5('errormessage'),
		d4 = rK('p'),
		d6 = function (r) {
			return d4(dw(r));
		},
		d9 = rQ('http://www.w3.org/2000/svg'),
		d7 = d9('path'),
		vr = d9('svg'),
		vn = r0('viewBox'),
		vt = function (r) {
			var n = r.X,
				t = r.aF,
				e = o(d6, k([dD('cactus-error-text')]), k([rZ(' Error: ' + t)])),
				u = o(
					dh,
					k([dD('cactus-error-close'), o(d0, 'aria-label', 'close'), dS({ $: 1, a: n })]),
					k([
						o(
							vr,
							k([vn('0 0 20 20'), d2('cactus-error-close-icon'), o(rW, 'fill', 'currentColor')]),
							k([
								o(
									d7,
									k([
										o(rW, 'fill-rule', 'evenodd'),
										d3(
											'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
										),
										o(rW, 'clip-rule', 'evenodd')
									]),
									q
								)
							])
						)
					])
				);
			return o(dx, k([dD('cactus-error'), d8(t)]), k([u, e]));
		},
		ve = function (r) {
			return { $: 2, a: r };
		},
		vu = function (r) {
			return { $: 1, a: r };
		},
		va = function (r) {
			return { $: 0, a: r };
		},
		vc = function (r) {
			return { $: 4, a: r };
		},
		vi = { $: 3 },
		vo = o(
			dh,
			k([dD('cactus-login-close'), o(d0, 'aria-label', 'close'), dS(vi)]),
			k([
				o(
					vr,
					k([vn('0 0 20 20'), d2('cactus-login-close-icon'), o(rW, 'fill', 'currentColor')]),
					k([
						o(
							d7,
							k([
								o(rW, 'fill-rule', 'evenodd'),
								d3(
									'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								),
								o(rW, 'clip-rule', 'evenodd')
							]),
							q
						)
					])
				)
			])
		),
		vf = o(
			re,
			function (r) {
				return o(M, 'cactus-login-form-wrapper', r)
					? tg(vi)
					: eA("Ignoring click event. Didn't hit wrapper.");
			},
			o(dZ, k(['target', 'className']), rr)
		),
		vs = function (r) {
			if (r.$) {
				var n = r.a;
				return n.a + ': ' + n.b;
			}
			return 'Could not find homeserver: ' + r.a;
		},
		vl = rK('h3'),
		vb = function (r) {
			return vl(dw(r));
		},
		vd = rK('h4'),
		vv = function (r) {
			return vd(dw(r));
		},
		vp = o(tj, d5('invalid'), function (r) {
			return r ? 'true' : 'false';
		}),
		vg = d5('label'),
		vh = dL('required'),
		vm = function (r) {
			var n = r.ai,
				t = r.aP,
				e = r.ay,
				u = r.aG,
				a = r.au,
				c = r.az;
			return o(
				dx,
				k([dD('cactus-login-field')]),
				k([
					o(dV, k([dD('cactus-login-label')]), k([rZ(n)])),
					o(dH, t, y(a, k([dY(e), dK(u), vh(!0), vg(n), vp(1 !== c.$)]))),
					o(eg, rZ(''), o(tQ, o(eS, rZ, o(eS, l3, d6(k([dD('cactus-login-error')])))), c))
				])
			);
		},
		vD = t(function (r, n) {
			var t,
				e = vm({
					au: q,
					ay: '@alice:example.com',
					az: 1 === (t = r.aO).$ ? nj(t.a) : n_,
					aG: va,
					ai: 'User ID',
					aP: r.bp
				}),
				u = o(vb, k([dD('cactus-login-title')]), k([rZ('Log in using Matrix')])),
				a = o(
					dh,
					y(
						k([dD('cactus-button'), dD('cactus-login-credentials-button'), dN(!!r.I)]),
						o(tM, q, o(u_, o(eS, vc, o(eS, dS, l3)), r.aO))
					),
					k([
						rZ(
							(function () {
								switch (r.I) {
									case 0:
										return 'Log in';
									case 1:
										return 'Logging in...';
									default:
										return '';
								}
							})()
						)
					])
				),
				c = vm({
					au: k([dO('password')]),
					ay: '••••••••••••',
					az: n_,
					aG: vu,
					ai: 'Password',
					aP: r.am
				}),
				i = o(
					eg,
					rZ(''),
					o(tQ, o(eS, vs, o(eS, rZ, o(eS, l3, d6(k([dD('cactus-login-error')]))))), r.a4)
				),
				f = o(
					eg,
					rZ(''),
					o(
						tQ,
						function (r) {
							return vm({
								au: q,
								ay: 'https://matrix.cactus.chat:8448',
								az: n_,
								aG: ve,
								ai: 'Homeserver URL',
								aP: r
							});
						},
						r.Q
					)
				),
				s = o(
					vv,
					k([dD('cactus-login-credentials-title')]),
					k([rZ('Or type in your credentials')])
				),
				l = o(dx, k([dD('cactus-login-credentials')]), k([s, e, c, f, a, i])),
				b = o(vv, k([dD('cactus-login-client-title')]), k([rZ('Use a Matrix client')])),
				d = o(
					dC,
					k([dT(dG(n)), dD('cactus-button'), dD('cactus-matrixdotto-button')]),
					k([rZ('Log in')])
				),
				v = o(dx, k([dD('cactus-login-client')]), k([b, d]));
			return 2 === r.I
				? rZ('')
				: o(
						d$,
						k([dD('cactus-login-form-wrapper'), o(dq, 'click', vf)]),
						k([o(dx, k([dD('cactus-login-form')]), k([vo, u, v, l]))])
					);
		}),
		v$ = e(function (r, n, e) {
			return o(
				tQ,
				function (r) {
					return r.ae;
				},
				fH(
					o(
						L,
						o(
							eS,
							function (r) {
								return r._;
							},
							o(eS, aF, U(-1))
						),
						o(
							cA,
							function (r) {
								return 1 > h(r._, n);
							},
							o(
								tE,
								bP,
								o(
									cA,
									o(eS, to, g(e)),
									f(
										nG,
										t(function (r, n) {
											return 1 === r.$ ? o(A, D(r.a, r.b), n) : n;
										}),
										q,
										r
									)
								)
							)
						)
					)
				)
			);
		}),
		vw = r0('datetime'),
		vx = { $: 7 },
		vy = function (r) {
			switch (r) {
				case 0:
					return 'January';
				case 1:
					return 'February';
				case 2:
					return 'March';
				case 3:
					return 'April';
				case 4:
					return 'May';
				case 5:
					return 'June';
				case 6:
					return 'July';
				case 7:
					return 'August';
				case 8:
					return 'September';
				case 9:
					return 'October';
				case 10:
					return 'November';
				default:
					return 'December';
			}
		},
		vq = function (r) {
			switch (r) {
				case 0:
					return 'Monday';
				case 1:
					return 'Tuesday';
				case 2:
					return 'Wednesday';
				case 3:
					return 'Thursday';
				case 4:
					return 'Friday';
				case 5:
					return 'Saturday';
				default:
					return 'Sunday';
			}
		},
		vS = b(
			c(function (r, n, t, e, u, a) {
				return { d8: u, d9: n, ea: r, ab: a, eb: e, ec: t };
			}),
			vy,
			o(eS, vy, tx(3)),
			vq,
			o(eS, vq, tx(3)),
			function (r) {
				return r > 11 ? 'pm' : 'am';
			},
			function (r) {
				switch (o(B, 100, r)) {
					case 11:
					case 12:
					case 13:
						return 'th';
					default:
						switch (o(B, 10, r)) {
							case 1:
								return 'st';
							case 2:
								return 'nd';
							case 3:
								return 'rd';
							default:
								return 'th';
						}
				}
			}
		),
		vA = t(function (r, n) {
			return tu(r / n);
		}),
		vk = e(function (r, n, t) {
			for (;;) {
				if (!t.b) return n + r;
				var e = t.a,
					u = t.b;
				if (0 > h(e.dS, n)) return n + e.b;
				t = u;
			}
		}),
		vE = t(function (r, n) {
			var t = r.b;
			return f(vk, r.a, o(vA, n, 6e4), t);
		}),
		vC = t(function (r, n) {
			return o(B, 24, o(vA, o(vE, r, n), 60));
		}),
		vL = e(function (r, n, t) {
			return r.d8(o(vC, n, t));
		}),
		vN = function (r) {
			var n = o(vA, r, 1440) + 719468,
				t = ((0 > n ? n - 146096 : n) / 146097) | 0,
				e = n - 146097 * t,
				u = ((e - ((e / 1460) | 0) + ((e / 36524) | 0) - ((e / 146096) | 0)) / 365) | 0,
				a = e - (365 * u + ((u / 4) | 0) - ((u / 100) | 0)),
				c = ((5 * a + 2) / 153) | 0,
				i = c + (10 > c ? 3 : -9);
			return { bA: a - (((153 * c + 2) / 5) | 0) + 1, b2: i, cM: u + 400 * t + (i > 2 ? 0 : 1) };
		},
		vT = t(function (r, n) {
			return vN(o(vE, r, n)).bA;
		}),
		vR = k([6, 0, 1, 2, 3, 4, 5]),
		vO = t(function (r, n) {
			switch (o(B, 7, o(vA, o(vE, r, n), 1440))) {
				case 0:
					return 3;
				case 1:
					return 4;
				case 2:
					return 5;
				case 3:
					return 6;
				case 4:
					return 0;
				case 5:
					return 1;
				default:
					return 2;
			}
		}),
		vU = t(function (r, n) {
			return o(
				eg,
				D(0, 6),
				fH(
					o(
						cA,
						function (t) {
							return v(t.b, o(vO, r, n));
						},
						o(
							nQ,
							t(function (r, n) {
								return D(r, n);
							}),
							vR
						)
					)
				)
			).a;
		}),
		vH = t(function (r, n) {
			switch (n) {
				case 0:
				case 2:
				case 4:
				case 6:
				case 7:
				case 9:
				default:
					return 31;
				case 1:
					return o(B, 4, r) || (!o(B, 100, r) && o(B, 400, r)) ? 28 : 29;
				case 3:
				case 5:
				case 8:
				case 10:
					return 30;
			}
		}),
		vB = k([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
		vI = t(function (r, n) {
			switch (vN(o(vE, r, n)).b2) {
				case 1:
					return 0;
				case 2:
					return 1;
				case 3:
					return 2;
				case 4:
					return 3;
				case 5:
					return 4;
				case 6:
					return 5;
				case 7:
					return 6;
				case 8:
					return 7;
				case 9:
					return 8;
				case 10:
					return 9;
				case 11:
					return 10;
				default:
					return 11;
			}
		}),
		vj = t(function (r, n) {
			return o(
				eg,
				D(0, 0),
				fH(
					o(
						cA,
						function (t) {
							return v(t.b, o(vI, r, n));
						},
						o(
							nQ,
							t(function (r, n) {
								return D(r, n);
							}),
							vB
						)
					)
				)
			);
		}),
		v_ = t(function (r, n) {
			return 1 + o(vj, r, n).a;
		}),
		vV = t(function (r, n) {
			return vN(o(vE, r, n)).cM;
		}),
		vF = t(function (r, n) {
			var t = o(lc, o(v_, r, n) - 1, vB);
			return f(nG, O, 0, o(tE, vH(o(vV, r, n)), t)) + o(vT, r, n);
		}),
		vz = t(function (r, n) {
			return (o(v_, r, n) / 4) | 0;
		}),
		vP = t(function (r, n) {
			return 1 > r ? '' : f(P, -r, tD(n), n);
		}),
		vG = t(function (r, n) {
			var t = nV(n);
			return y(
				o(
					nF,
					'',
					o(
						tE,
						function () {
							return '0';
						},
						o(nZ, 1, r - tD(t))
					)
				),
				t
			);
		}),
		vM = t(function (r, n) {
			return o(B, 1e3, n);
		}),
		vJ = t(function (r, n) {
			return o(B, 60, o(vE, r, n));
		}),
		vZ = function (r) {
			return r ? (r > 12 ? r - 12 : r) : 12;
		},
		vQ = t(function (r, n) {
			return o(B, 60, o(vA, n, 1e3));
		}),
		vK = (0, Math.round)(315576e5),
		vY = t(function (r, n) {
			return tm(vK * o(vV, r, n));
		}),
		vX = t(function (r, n) {
			var t = o(vU, r, o(vY, r, n));
			return 1 + (((o(vF, r, n) + t) / 7) | 0);
		}),
		vW = t(function (r, n) {
			return nV(o(vV, r, n));
		}),
		v1 = u(function (r, n, t, e) {
			var u, a, c, i, s, l;
			switch (e.$) {
				case 0:
					return nV(o(v_, n, t));
				case 1:
					return y(nV((u = o(v_, n, t))), r.ab(u));
				case 2:
					return o(vG, 2, o(v_, n, t));
				case 3:
					return r.d9(o(vI, n, t));
				case 4:
					return r.ea(o(vI, n, t));
				case 17:
					return nV(1 + o(vz, n, t));
				case 18:
					return y(nV((a = 1 + o(vz, n, t))), r.ab(a));
				case 5:
					return nV(o(vT, n, t));
				case 6:
					return y(nV((c = o(vT, n, t))), r.ab(c));
				case 7:
					return o(vG, 2, o(vT, n, t));
				case 8:
					return nV(o(vF, n, t));
				case 9:
					return y(nV((i = o(vF, n, t))), r.ab(i));
				case 10:
					return o(vG, 3, o(vF, n, t));
				case 11:
					return nV(o(vU, n, t));
				case 12:
					return y(nV((s = o(vU, n, t))), r.ab(s));
				case 13:
					return r.eb(o(vO, n, t));
				case 14:
					return r.ec(o(vO, n, t));
				case 19:
					return nV(o(vX, n, t));
				case 20:
					return y(nV((l = o(vX, n, t))), r.ab(l));
				case 21:
					return o(vG, 2, o(vX, n, t));
				case 15:
					return o(vP, 2, o(vW, n, t));
				case 16:
					return o(vW, n, t);
				case 22:
					return f(vL, r, n, t).toUpperCase();
				case 23:
					return ue(f(vL, r, n, t));
				case 24:
					return nV(o(vC, n, t));
				case 25:
					return o(vG, 2, o(vC, n, t));
				case 26:
					return nV(vZ(o(vC, n, t)));
				case 27:
					return o(vG, 2, vZ(o(vC, n, t)));
				case 28:
					return nV(1 + o(vC, n, t));
				case 29:
					return o(vG, 2, 1 + o(vC, n, t));
				case 30:
					return nV(o(vJ, n, t));
				case 31:
					return o(vG, 2, o(vJ, n, t));
				case 32:
					return nV(o(vQ, n, t));
				case 33:
					return o(vG, 2, o(vQ, n, t));
				case 34:
					return nV(o(vM, n, t));
				case 35:
					return o(vG, 3, o(vM, n, t));
				default:
					return e.a;
			}
		}),
		v0 = u(function (r, n, t, e) {
			return o(nF, '', o(tE, f(v1, r, t, e), n));
		})(vS),
		v2 = { $: 25 },
		v3 = { $: 31 },
		v5 = { $: 2 },
		v8 = { $: 33 },
		v4 = function (r) {
			return { $: 36, a: r };
		},
		v6 = o(aY, 0, q),
		v9 = { $: 16 },
		v7 = { $: 13 },
		pr = { $: 3 },
		pn = rK('time'),
		pt = function (r) {
			return pn(dw(r));
		},
		pe = t(function (r, n) {
			return 0.001 * (n - r);
		}),
		pu = function (r) {
			return r / 86400;
		},
		pa = function (r) {
			return r / 3600;
		},
		pc = function (r) {
			return r / 31557600;
		},
		pi = function (r) {
			return r / 60;
		},
		po = function (r) {
			return r / 604800;
		},
		pf = t(function (r, n) {
			var t = k([
					D('year', pc),
					D('month', o(eS, pc, U(12))),
					D('week', po),
					D('day', pu),
					D('hour', pa),
					D('minute', pi),
					D('second', cD)
				]),
				e = o(pe, n, r),
				u = (function (r) {
					for (;;) {
						if (r.b) {
							var n = r.a,
								t = n.a,
								u = n.b,
								a = r.b;
							if (1 > u(e)) {
								r = a;
								continue;
							}
							return D(t, u);
						}
						return D('seconds', cD);
					}
				})(t),
				a = u.a,
				c = tu((0, u.b)(e)),
				i = 1 === c ? a : a + 's';
			return 1 > e ? 'just now' : nV(c) + ' ' + i + ' ago';
		}),
		ps = dm('title'),
		pl = dm('alt'),
		pb = rK('img'),
		pd = t(function (r, n) {
			return o(pb, o(A, pl(r), dw(n)), q);
		}),
		pv = function (r) {
			return o(dm, 'src', r2(r));
		},
		pp = t(function (r, n) {
			return o(cc, e$(r), nV(n));
		}),
		pg = ew(k(['_matrix', 'media', 'r0'])),
		ph = function (r) {
			return f(eS, n2, fH, o(nz, '/', r));
		},
		pm = function (r) {
			var n = function (r) {
					return n0(r) || o(um, r, k(['.', '-', ':']));
				},
				t = o(ul, o(e3, ut(tm), ud('mxc://')), aE({ de: n, dJ: t6, dS: n }));
			return bj(o(af, t, r));
		},
		pD = t(function (r, n) {
			var e = pm(n),
				u = ph(n);
			return f(
				cL,
				t(function (n, t) {
					return f(
						pg,
						r,
						k(['thumbnail', n, t]),
						k([o(pp, 'width', 64), o(pp, 'height', 64), o(ci, 'method', 'crop')])
					);
				}),
				e,
				u
			);
		}),
		p$ = t(function (r, n) {
			var t,
				e = (t = o(
					tQ,
					pD(r),
					o(
						cH,
						function (r) {
							return r.bt;
						},
						n
					)
				)).$
					? n_
					: t.a;
			return o(
				dx,
				k([dD('cactus-comment-avatar')]),
				k(
					e.$
						? [o(dx, k([dD('cactus-comment-avatar-placeholder')]), q)]
						: [o(pd, 'user avatar image', k([pv(e.a)]))]
				)
			);
		}),
		pw = rK('audio'),
		px = function (r) {
			return pw(dw(r));
		},
		py = dL('controls'),
		pq = t(function (r, n) {
			var e = pm(n),
				u = ph(n);
			return f(
				cL,
				t(function (n, t) {
					return f(pg, r, k(['download', n, t]), q);
				}),
				e,
				u
			);
		}),
		pS = rK('i'),
		pA = function (r) {
			return pS(dw(r));
		},
		pk = t(function (r, n) {
			var t = o(pq, r, n.ef);
			if (t.$) return o(d6, q, k([o(pA, q, k([rZ('Error: Could not parse audio file URL')]))]));
			var e = t.a;
			return o(px, k([dD('cactus-message-audio'), pv(e), py(!0)]), q);
		}),
		pE = r0('rel'),
		pC = t(function (r, n) {
			var t = o(pq, r, n.ef);
			if (t.$) return o(d6, q, k([o(pA, q, k([rZ('Error: Could not parse file URL')]))]));
			var e = t.a;
			return o(
				dC,
				k([dD('cactus-message-file'), pE('noopener'), dT(e)]),
				k([rZ('\uD83D\uDCCE Download ' + n.cS)])
			);
		}),
		pL = o(
			ez,
			function (r) {
				return 7 === tD(r) ? ut(r) : un('Hex color code should have 7 characters.');
			},
			e4(o(e3, o(e3, ub(o(uf, '#', iU('#'))), e1(uP)), aw))
		),
		pN = t(function (r, n) {
			return f(
				nG,
				t(function (n, t) {
					switch (n.a) {
						case 'width':
						case 'height':
						case 'alt':
						case 'title':
							return o(A, n, t);
						case 'src':
							return o(
								eg,
								t,
								o(
									tQ,
									function (r) {
										return o(A, D('src', r), t);
									},
									o(pq, r, n.b)
								)
							);
						default:
							return t;
					}
				}),
				q,
				n
			);
		}),
		pT = e(function (r, n, e) {
			switch (n) {
				case 'font':
				case 'span':
					return f(
						nG,
						t(function (r, n) {
							switch (r.a) {
								case 'data-mx-color':
									var t = o(af, pL, r.b);
									return t.$ ? n : o(A, D('style', 'color:' + t.a), n);
								case 'data-mx-bg-color':
									var e = o(af, pL, r.b);
									return e.$ ? n : o(A, D('style', 'background:' + e.a), n);
								default:
									return n;
							}
						}),
						q,
						e
					);
				case 'a':
					return o(
						A,
						D('rel', 'noopener'),
						f(
							nG,
							t(function (r, n) {
								switch (r.a) {
									case 'name':
										return o(A, D('name', r.b), n);
									case 'target':
										return o(A, D('target', r.b), n);
									case 'href':
										var t = r.b,
											e = k(['https', 'http', 'ftp', 'mailto', 'magnet']);
										return o(
											eg,
											!1,
											o(
												tQ,
												function (r) {
													return o(um, r, e);
												},
												fH(o(nz, ':', t))
											)
										)
											? o(A, D('href', t), n)
											: n;
									default:
										return n;
								}
							}),
							q,
							e
						)
					);
				case 'img':
					return o(pN, r, e);
				case 'ol':
					return o(cA, o(eS, to, g('start')), e);
				case 'code':
					return o(
						cA,
						function (r) {
							return 'class' === r.a && 'language-' === o(tx, 9, r.b);
						},
						e
					);
				default:
					return q;
			}
		}),
		pR = t(function (r, n) {
			return f(eu, r, 0, n);
		}),
		pO = f(
			nG,
			pR,
			t6,
			k([
				'font',
				'del',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'blockquote',
				'p',
				'a',
				'ul',
				'ol',
				'sup',
				'sub',
				'li',
				'b',
				'i',
				'u',
				'strong',
				'em',
				'strike',
				'code',
				'hr',
				'br',
				'div',
				'table',
				'thead',
				'tbody',
				'tr',
				'th',
				'td',
				'caption',
				'pre',
				'span',
				'img'
			])
		),
		pU = t(function (r, n) {
			var e = t(function (n, t) {
				if (n > 100) return u7('');
				switch (t.$) {
					case 0:
						return u7(t.a);
					case 2:
						return ua(t.a);
					default:
						var u = t.a,
							a = t.b,
							c = t.c;
						return (o(aA, u, pO) ? o(e_, u, f(pT, r, u, a)) : o(e_, 'div', q))(o(tE, e(n + 1), c));
				}
			});
			return o(e, 0, n);
		}),
		pH = function (r) {
			return rK('script' == r ? 'p' : r);
		},
		pB = function (r) {
			return o(d0, r.a, r.b);
		},
		pI = function (r) {
			return o(tE, pj, r);
		},
		pj = function (r) {
			switch (r.$) {
				case 1:
					var n = r.c;
					return f(pH, r.a, o(tE, pB, r.b), pI(n));
				case 0:
					return rZ(r.a);
				default:
					return rZ('');
			}
		},
		p_ = t(function (r, n) {
			if (n.$) {
				var t = n.a;
				return pI(o(tE, pU(r), t));
			}
			return k([o(d6, q, k([rZ(n.a)]))]);
		}),
		pV = function (r) {
			return o(r0, 'height', nV(r));
		},
		pF = function (r) {
			return o(r0, 'width', nV(r));
		},
		pz = t(function (r, n) {
			var t = o(
					cH,
					function (n) {
						var t = D(o(eg, n_, o(tQ, pq(r), n.cC)), n.cB);
						return t.a.$ || t.b.$ ? n_ : nj(D(t.a.a, t.b.a));
					},
					n.a1
				),
				e = D(o(pq, r, n.ef), n.a1),
				u = D(e, t);
			if (u.a.a.$) return o(d6, q, k([o(pA, q, k([rZ('Error: Could not render image')]))]));
			if (u.b.$) {
				if (u.a.b.$)
					return o(
						dC,
						k([dT((i = u.a.a.a))]),
						k([o(pd, n.cS, k([dD('cactus-message-image'), pv(i)]))])
					);
				var a = u.a,
					c = a.b.a;
				return o(
					dC,
					k([dT((i = a.a.a))]),
					k([o(pd, n.cS, k([dD('cactus-message-image'), pv(i), pF(c.aQ), pV(c.aB)]))])
				);
			}
			var i,
				f = u.b.a,
				s = f.a,
				l = f.b;
			return o(
				dC,
				k([dT((i = u.a.a.a))]),
				k([o(pd, n.cS, k([dD('cactus-message-image'), pv(s), pF(l.aQ), pV(l.aB)]))])
			);
		}),
		pP = rK('video'),
		pG = function (r) {
			return pP(dw(r));
		},
		pM = t(function (r, n) {
			var t = o(pq, r, n.ef);
			if (t.$)
				return o(
					d6,
					q,
					k([o(pA, q, k([rZ('Error: The URL for video "' + n.cS + '" could not be decoded.')]))])
				);
			var e = t.a;
			return o(pG, k([pl(n.cS), pv(e), py(!0), dD('cactus-message-video')]), q);
		}),
		pJ = e(function (r, n, t) {
			switch (t.$) {
				case 0:
					var e = t.a;
					return o(dx, k([dD('cactus-message-text')]), o(p_, r, e));
				case 1:
					if (t.a.$) return (e = t.a), o(dx, k([dD('cactus-message-text')]), o(p_, r, e));
					var u = t.a.a;
					return o(dx, k([dD('cactus-message-emote')]), k([o(d6, q, k([rZ(n + ' ' + u)]))]));
				case 2:
					return (e = t.a), o(dx, k([dD('cactus-message-text')]), o(p_, r, e));
				case 3:
					return o(pz, r, t.a);
				case 4:
					return o(pC, r, t.a);
				case 6:
					return o(pk, r, t.a);
				default:
					return o(pM, r, t.a);
			}
		}),
		pZ = c(function (r, n, t, e, u, a) {
			var c = o(
					v0(
						k([v9, v4('-'), v5, v4('-'), vx, v4('T'), v2, v4(':'), v3, v4(':'), v8, v4('+00:00')])
					),
					v6,
					t
				),
				i = o(
					v0(
						k([
							v7,
							v4(' '),
							pr,
							v4(' '),
							vx,
							v4(' '),
							v2,
							v4(':'),
							v3,
							v4(':'),
							v8,
							v4(' '),
							v9,
							v4(' UTC')
						])
					),
					v6,
					t
				),
				s = o(pf, n, t),
				l = b4(e),
				b = 'https://matrix.to/#/' + b4(e),
				d = o(
					eg,
					l,
					o(
						tQ,
						function (r) {
							return o(eg, l, r.bF);
						},
						u
					)
				),
				v = f(pJ, r, d, a);
			return o(
				dx,
				k([dD('cactus-comment')]),
				k([
					o(p$, r, u),
					o(
						dx,
						k([dD('cactus-comment-content')]),
						k([
							o(
								dx,
								k([dD('cactus-comment-header')]),
								k([
									o(dC, k([dD('cactus-comment-displayname'), dT(b)]), k([rZ(d)])),
									o(pt, k([dD('cactus-comment-time'), ps(i), vw(c)]), k([rZ(s)]))
								])
							),
							o(dx, k([dD('cactus-comment-body')]), k([v]))
						])
					)
				])
			);
		}),
		pQ = u(function (r, n, t, e) {
			return o(
				dx,
				k([dD('cactus-comments-list')]),
				o(
					tE,
					function (t) {
						var u = o(eg, o(er, b4(t.aL), n.b$), o(tQ, nj, f(v$, n.C, t._, t.aL)));
						return b(pZ, r, e, t._, t.aL, u, t.ae);
					},
					o(lc, t, cS(n.C))
				)
			);
		});
	(lJ = {
		Main: {
			init: ns({
				dd: function (r) {
					var n = o(u_, cu, o(rs, ct, r));
					if (n.$) return D({ $: 0, a: n5(n.a) }, aK);
					var t = n.a,
						e = t.a,
						u = t.b;
					return D(
						tH({ z: e, K: aG, A: q, af: !1, Z: aM, a7: tm(0), M: n_, bc: u, an: e.a9 }),
						rI(
							k([
								o(tU, tI, aX),
								o(
									t_,
									tB,
									(function () {
										if (1 === u.$)
											return o(
												rx,
												function (r) {
													return o(tC, tP(r), o(aP, r, e.dN));
												},
												cf(e.aR)
											);
										var r = u.a;
										return o(
											rx,
											function () {
												return o(tC, tP(r), o(aP, r, e.dN));
											},
											o(aQ, r, e.dN)
										);
									})()
								)
							])
						)
					);
				},
				dY: function (r) {
					if (1 === r.$) {
						var n = 1e3 * r.a.z.bo;
						return n > 0 ? o(cm, n, tI) : c$;
					}
					return c$;
				},
				ee: dl,
				eg: function (r) {
					if (r.$) {
						var n = r.a,
							t = o(rY, cx, o(vD, n.Z, n.z.dN)),
							e = nM(n.A) > 0 ? o(dx, k([dD('cactus-errors')]), o(tE, vt, n.A)) : rZ(''),
							u = o(d1, n.K, {
								aV: n.z.aV,
								a3: n.z.a3,
								dj: dd,
								dm: db,
								dN: n.z.dN,
								dP: f(cL, dv, n.bc, o(tQ, dy, n.M)),
								bc: n.bc,
								dR: dp
							});
						return o(
							dx,
							k([dD('cactus-container')]),
							k([
								e,
								t,
								u,
								(function () {
									var r = D(n.M, n.bc);
									if (r.a.$ || r.b.$)
										return o(
											dx,
											k([dD('spinner')]),
											k([
												o(dx, k([dD('rect1')]), q),
												o(dx, k([dD('rect2')]), q),
												o(dx, k([dD('rect3')]), q),
												o(dx, k([dD('rect4')]), q)
											])
										);
									var t = r.a.a,
										e = r.b.a;
									return o(
										dx,
										k([dD('cactus-comments-container')]),
										k([
											s(pQ, e.bQ, t, n.an, n.a7),
											n.af
												? rZ('')
												: o(
														dx,
														k([dD('cactus-view-more')]),
														k([
															o(dh, k([dD('cactus-button'), dS(o(dg, e, t))]), k([rZ('View more')]))
														])
													)
										])
									);
								})()
							])
						);
					}
					return vt({ X: 0, aF: 'Bad configuration: ' + r.a });
				}
			})(W)(0)
		}
	}),
		r.Elm
			? (function r(n, t) {
					for (var e in t) e in n ? ('init' == e ? R(6) : r(n[e], t[e])) : (n[e] = t[e]);
				})(r.Elm, lJ)
			: (r.Elm = lJ);
})(r);
export { n as initComments }; //# sourceMappingURL=cactus.js.map

//# sourceMappingURL=cactus.js.map
