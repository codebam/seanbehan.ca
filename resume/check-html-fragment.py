#!/usr/bin/env python3
"""Gate resume.html before it is uploaded.

The fragment is injected into /resume with set:html, so anything pandoc passes
through is markup on this site. Pandoc is pointed at a Markdown file this repo
owns, but the fragment still crosses a bucket before it reaches a reader, and a
grep for "<script" only names the spellings one person thought of. This parses
the fragment instead: every tag and attribute must be on the allowlist, event
handlers and styles are refused, URL-bearing attributes must carry a safe
scheme, and the error names the construct that failed.

CI records the digest of this file after the check and re-checks it before each
upload, so the bytes parsed here are the bytes published.
"""

import html.parser
import re
import sys

# What templates/resume.html, resume/resume.md and pandoc's writer produce for
# this document. Anything else is markup this build did not choose, so it does
# not get in, even if a browser would find it harmless.
ALLOWED_TAGS = frozenset({
    "article", "header", "div", "p", "ul", "ol", "li", "a", "em", "strong",
    "b", "i", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code",
    "pre", "span", "br", "hr", "time", "small", "del", "sup", "sub", "table",
    "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "dl", "dt", "dd",
    "img",
})

ALLOWED_ATTRS = frozenset({
    "class", "id", "href", "src", "alt", "width", "height", "colspan",
    "rowspan", "title", "rel", "target", "datetime",
})

# Not "unusual but harmless": srcset fetches, form attributes submit elsewhere,
# and content/http-equiv restate a document header this fragment does not have.
REFUSED_ATTRS = frozenset({
    "srcset", "form", "action", "method", "http-equiv", "content",
})

BAD_SCHEMES = ("javascript:", "vbscript:", "data:")
BAD_SUBSTRING = "\\resume"

# https, mailto, tel, #fragment, or an absolute path. The negative lookahead is
# what refuses //host/...: protocol-relative would borrow the page's scheme,
# and on this https page it is also an arbitrary off-site link.
SAFE_URL = re.compile(r"^(?:https?:|mailto:|tel:|#|/(?!/))")


class Refused(Exception):
    """A construct the fragment gate will not publish."""


class FragmentChecker(html.parser.HTMLParser):
    def __init__(self):
        # convert_charrefs=True means href="jav&#x61;script:" reaches the
        # scheme checks as "javascript:" rather than as an entity to miss.
        super().__init__(convert_charrefs=True)

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag not in ALLOWED_TAGS:
            raise Refused(f"tag <{tag}> is not on the allowlist")
        attributes = [
            (name.lower(), "" if value is None else value) for name, value in attrs
        ]
        # Names before values: the event handler in <img src=x onerror=...> is
        # the thing to name, even though its sibling src also fails the URL
        # check.
        for name, value in attributes:
            self._check_attr_name(tag, name, value)
        for name, value in attributes:
            self._check_attr_value(tag, name, value)

    def handle_endtag(self, tag):
        if tag.lower() not in ALLOWED_TAGS:
            raise Refused(f"closing tag </{tag.lower()}> is not on the allowlist")

    def handle_comment(self, data):
        if "<script" in data.lower():
            raise Refused("comment contains <script")

    def handle_decl(self, decl):
        # Keep the parser's text readable and on one line in the log.
        decl = decl.replace("\n", " ").replace("\r", " ")
        raise Refused(f"declaration <!{decl}> is not allowed")

    def handle_pi(self, data):
        data = data.replace("\n", " ").replace("\r", " ")
        raise Refused(f"processing instruction <?{data}> is not allowed")

    def _check_attr_name(self, tag, name, value):
        if name.startswith("on"):
            raise Refused(f"<{tag}> attribute {name}={value!r} is an event handler")
        if name == "style":
            raise Refused(f"<{tag}> attribute style={value!r} is not allowed")
        if name == "src" and tag != "img":
            raise Refused(f"<{tag}> attribute src={value!r} is only allowed on <img>")
        if name in REFUSED_ATTRS:
            raise Refused(f"<{tag}> attribute {name}={value!r} is not allowed")
        if name not in ALLOWED_ATTRS:
            raise Refused(f"<{tag}> attribute {name}={value!r} is not on the allowlist")

    def _check_attr_value(self, tag, name, value):
        # The scheme checks cover href/src values that start safely but hide a
        # second scheme, and any other allowlisted attribute that smuggles one.
        lowered = value.lower()
        for scheme in BAD_SCHEMES:
            if scheme in lowered:
                raise Refused(f"<{tag}> attribute {name}={value!r} contains {scheme}")
        if BAD_SUBSTRING in value:
            raise Refused(
                f"<{tag}> attribute {name}={value!r} contains an unresolved LaTeX macro"
            )
        if name in ("href", "src"):
            if not value or not SAFE_URL.match(value):
                raise Refused(
                    f"<{tag}> attribute {name}={value!r} is not a safe URL "
                    "(expected https:, mailto:, tel:, #fragment or an absolute path)"
                )


def main(argv):
    if len(argv) != 2:
        print(f"usage: {argv[0]} <resume.html>", file=sys.stderr)
        return 2
    path = argv[1]
    try:
        with open(path, encoding="utf-8") as fh:
            document = fh.read()
    except (OSError, UnicodeDecodeError) as exc:
        print(f"resume.html fragment gate: cannot read {path}: {exc}", file=sys.stderr)
        return 1
    checker = FragmentChecker()
    try:
        checker.feed(document)
        checker.close()
    except Refused as exc:
        print(f"resume.html fragment gate: refused {path}: {exc}", file=sys.stderr)
        return 1
    print("resume.html fragment gate: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
