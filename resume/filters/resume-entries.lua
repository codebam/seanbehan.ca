--[[ resume-entries.lua -- structural clean-up for Pandoc resumes.

Turns the flat Markdown a resume is written in into the shapes the templates
style, in two output formats: the LaTeX one for the PDF and the HTML one for
the résumé as a web page.  Both are built from this single pass, which is what
keeps the page and the PDF from drifting apart.

The five styling hooks have two spellings and one meaning: a `tex` raw inline
carrying the macro the LaTeX template defines, or a Span whose class is what the
HTML stylesheet hangs on.

  \resumeEntryRole{..}    resume-role    the left-hand half of an entry row
  \resumeEntryOrg{..}     resume-org     the right-hand half, tinted
  \resumeEntrySep{..}     resume-sep     the · between them
  \resumeEntryMeta{..}    resume-meta    the date column
  \resumeKey{..}          resume-key     the label of a compacted skill line

`tex_markup` picks the spelling -- pandoc's HTML writer drops raw tex, and a
date that arrived as dropped markup rather than as a class was a date with no
way to put it in the right-hand column.

  1. Dash-lines -> real lists.

         **Expert:**                    becomes  Para "**Expert:**"
         - Rust                              + BulletList {Rust, Nix}
         - Nix

     Markdown only starts a list after a blank line, so resumes written as
     "label<newline>- item" arrive as one paragraph.  This step normalises
     them; later steps then treat them like any other list.

  2. Entry rows.  A level-3+ heading followed by an italic meta line becomes
     one row with the meta flush right, and "Role · Company" is split so the
     company can be tinted:

         ### Frontend Web Developer · AssetDash    ->  role (bold) · company
         *Apr. 2021 – Oct. 2021*                        (accent) ... date flush
                                                        right
     PDF bookmarks get the plain text, not the styling.

  3. Compact skill lines.  A bold label paragraph plus a list of short items
     collapses onto one line:

         Expert: JavaScript & TypeScript · Rust · Nix

     "Short" is `inline_bullet_max` characters (default 30), so narrative
     bullet lists are left as bullets.

  4. Contact line.  location/phone/email/website/github/linkedin are
     normalised into a `contacts` list of {text, url, icon} maps for the
     template header, with URL schemes trimmed from the display text.

  5. Heading roles.  Every heading also carries its role as a class --
     `resume-section`, `resume-subsection`, `resume-entry` -- because the HTML
     build shifts heading levels to sit under the page's own h1, and a
     stylesheet that keyed off the level would have to shift with it.  LaTeX
     ignores attributes, so this costs the PDF nothing.

Every behaviour has a metadata switch (set it to false to opt out):
  dash_lists, drop_rules, date_rows, split_entries, entry_separator,
  inline_bullets, inline_bullet_max, inline_bullet_join, uppercase_sections,
  build_contacts, tex_markup.
--]]

---------------------------------------------------------------------------
-- option plumbing
---------------------------------------------------------------------------
local opt = {
  dash_lists = true,
  drop_rules = true,
  date_rows = true,
  split_entries = true,
  entry_separator = '·',
  inline_bullets = true,
  inline_bullet_max = 30,
  inline_bullet_join = '·',
  uppercase_sections = false,
  build_contacts = true,
  tex_markup = true,
}

-- Heading level -> class name.  Level 3 is the entry row; deeper headings are
-- entries too, since 3 is where the entry convention starts in this document.
local HEADING_CLASS = {
  [1] = 'resume-section',
  [2] = 'resume-subsection',
  [3] = 'resume-entry',
}

local function truthy(s)
  if s == true then return true end
  if s == false then return false end
  if s == 'true' or s == 'yes' or s == 'on' then return true end
  if s == 'false' or s == 'no' or s == 'off' then return false end
  return nil
end

-- Metadata reaches Lua in several shapes (boolean, string, MetaInlines, ...),
-- so normalise before testing.
local function setting(meta, key, default)
  local v = meta and meta[key]
  if v == nil then return default end
  local b = truthy(v)
  if b ~= nil then return b end
  if type(v) == 'number' then return v end
  if type(v) == 'string' then return tonumber(v) or v end
  if v.t == 'MetaBool' then return v.value end
  local s = pandoc.utils.stringify(v)
  b = truthy(s)
  if b ~= nil then return b end
  return tonumber(s) or (s ~= '' and s) or default
end

---------------------------------------------------------------------------
-- helpers
---------------------------------------------------------------------------
local function trim(s) return (s:gsub('^%s+', ''):gsub('%s+$', '')) end

local function drop_trailing_spaces(il)
  while #il > 0 and (il[#il].t == 'Space' or il[#il].t == 'SoftBreak') do
    table.remove(il)
  end
  return il
end

local function drop_leading_spaces(il)
  local i = 1
  while i <= #il and (il[i].t == 'Space' or il[i].t == 'SoftBreak') do i = i + 1 end
  local out = {}
  for j = i, #il do out[#out + 1] = il[j] end
  return out
end

-- Flatten emphasis so `*Apr. 2021*` contributes its text to a styled row.
local function plainify(inlines, out)
  out = out or {}
  for _, il in ipairs(inlines) do
    if il.t == 'Emph' or il.t == 'Strong' or il.t == 'Span' then
      plainify(il.content, out)
    elseif il.t == 'SoftBreak' or il.t == 'LineBreak' then
      out[#out + 1] = pandoc.Space()
    else
      out[#out + 1] = il
    end
  end
  return out
end

local SEPARATORS = { ['|'] = true, ['·'] = true, ['•'] = true, ['–'] = true,
                     ['—'] = true, ['-'] = true, [','] = true, ['/'] = true,
                     [':'] = true }

-- Is this paragraph only emphasised runs plus punctuation separators, i.e.
-- a date/place/meta line rather than prose?
local function is_meta_line(blk)
  if not blk or blk.t ~= 'Para' then return false end
  local emphasised = false
  for _, il in ipairs(blk.content) do
    if il.t == 'Emph' or il.t == 'Strong' then
      emphasised = true
    elseif il.t == 'Space' or il.t == 'SoftBreak' then
      -- allowed
    elseif il.t == 'Str' then
      if not SEPARATORS[il.text] then return false end
    else
      return false
    end
  end
  return emphasised
end

-- A label paragraph is a whole-paragraph bold run ending in a colon.
local function is_label_line(blk)
  if not blk or blk.t ~= 'Para' then return false end
  local content = blk.content
  if #content == 1 and content[1].t == 'Strong' then
    return pandoc.utils.stringify(content[1]):match(':$') ~= nil
  end
  return false
end

local function item_is_short(item, max)
  if #item < 1 then return false end
  for _, blk in ipairs(item) do
    if blk.t ~= 'Para' and blk.t ~= 'Plain' then return false end
  end
  local text = pandoc.utils.stringify(item)
  if #text > max then return false end
  return true
end

local function is_compact_list(blk, max)
  if not blk or blk.t ~= 'BulletList' then return false end
  if #blk.content < 2 then return false end
  for _, item in ipairs(blk.content) do
    if not item_is_short(item, max) then return false end
  end
  return true
end

local function raw(s) return pandoc.RawInline('tex', s) end

-- One styling hook, spelled for the writer this build is aimed at: the LaTeX
-- macro pair `open`/`close` wrapped around `inlines`, or a Span classed
-- `resume-` .. `class`.  Returns a list of inlines either way.
local function hook(class, inlines, open, close)
  if opt.tex_markup then
    local out = { raw(open) }
    for _, il in ipairs(inlines) do out[#out + 1] = il end
    out[#out + 1] = raw(close)
    return out
  end
  return { pandoc.Span(inlines, pandoc.Attr('', { 'resume-' .. class })) }
end

local function emit_hook(into, class, inlines, open, close)
  for _, il in ipairs(hook(class, inlines, open, close)) do into[#into + 1] = il end
end

-- Copy an Attr with one more class on it.  attr.classes is a pandoc List, so
-- it is rebuilt rather than appended to in place.
local function with_class(attr, class)
  local classes = {}
  for i = 1, #attr.classes do classes[#classes + 1] = attr.classes[i] end
  classes[#classes + 1] = class
  return pandoc.Attr(attr.identifier ~= '' and attr.identifier or nil, classes,
                      attr.attributes)
end

-- A middle-dot separator: accent coloured in LaTeX, plain text elsewhere.
local function joiner()
  local out = { pandoc.Space() }
  emit_hook(out, 'sep', { pandoc.Str(opt.inline_bullet_join) },
            '\\resumeEntrySep{', '}')
  out[#out + 1] = pandoc.Space()
  return out
end

---------------------------------------------------------------------------
-- 1. dash-lines -> lists
---------------------------------------------------------------------------
-- "**Expert:**\n- Rust\n- Nix" arrives as a single paragraph because Markdown
-- will not open a list without a preceding blank line.  Split it into the
-- label plus a real BulletList so list styling and compaction apply.
local function split_dash_lines(blk)
  if blk.t ~= 'Para' then return nil end
  local segments, current = {}, { blk.content[1] }
  local found = false
  local content = blk.content
  local i = 2
  while i <= #content do
    local is_bullet_start = content[i].t == 'Str' and content[i].text == '-'
      and (content[i - 1].t == 'SoftBreak' or content[i - 1].t == 'LineBreak')
    if is_bullet_start then
      found = true
      drop_trailing_spaces(current)
      segments[#segments + 1] = current
      current = {}
      i = i + 1                                   -- skip the dash
      if i <= #content and content[i].t == 'Space' then i = i + 1 end
    else
      if content[i].t == 'LineBreak' then
        current[#current + 1] = pandoc.Space()
      else
        current[#current + 1] = content[i]
      end
      i = i + 1
    end
  end
  drop_trailing_spaces(current)
  segments[#segments + 1] = current
  if not found or #segments < 2 then return nil end

  local out = {}
  local head = table.remove(segments, 1)
  if #head > 0 then out[#out + 1] = pandoc.Para(head) end
  local items = {}
  for _, seg in ipairs(segments) do
    if #seg > 0 then items[#items + 1] = { pandoc.Plain(seg) } end
  end
  if #items == 0 then return nil end
  out[#out + 1] = pandoc.BulletList(items)
  return out
end

---------------------------------------------------------------------------
-- 2. entry rows
---------------------------------------------------------------------------
-- A meta line glued to its bullet list (`*date*\n- item` with no blank line)
-- arrives as one paragraph; recover the meta text and the list separately.
local function meta_parts(blk)
  if not blk then return nil end
  if is_meta_line(blk) then return plainify(blk.content), nil end
  if opt.dash_lists then
    local expanded = split_dash_lines(blk)
    if expanded and is_meta_line(expanded[1]) then
      local head = table.remove(expanded, 1)
      return plainify(head.content), expanded
    end
  end
  return nil
end

local function find_separator(content, sep)
  for i, il in ipairs(content) do
    if il.t == 'Str' and il.text == sep then return i end
  end
  return nil
end

-- Build the inline list for a heading: optional role/company split, optional
-- flush-right meta text.  Pandoc's writer wraps headings in its own
-- \texorpdfstring, so PDF bookmarks stay plain without extra work here.
local function entry_row(content, meta_inlines)
  local sep = opt.entry_separator
  local role, org_in, sep_idx = nil, nil, nil
  if opt.split_entries and type(sep) == 'string' and sep ~= '' then
    sep_idx = find_separator(content, sep)
    if sep_idx and sep_idx > 1 and sep_idx < #content then
      role = drop_trailing_spaces({ table.unpack(content, 1, sep_idx - 1) })
      org_in = drop_leading_spaces({ table.unpack(content, sep_idx + 1, #content) })
    end
  end

  local out = {}
  local function emit(part)
    if not part then return end
    for _, il in ipairs(part) do out[#out + 1] = il end
  end
  local function sep_group()
    out[#out + 1] = pandoc.Space()
    emit_hook(out, 'sep', { content[sep_idx] }, '\\resumeEntrySep{', '}')
    out[#out + 1] = pandoc.Space()
  end

  if role then
    emit_hook(out, 'role', role, '\\resumeEntryRole{', '}')
    sep_group()
    emit_hook(out, 'org', org_in, '\\resumeEntryOrg{', '}')
  else
    emit(content)
  end

  if meta_inlines and opt.date_rows then
    -- \hfill is the flush-right machinery in TeX; on the page that column is
    -- CSS's job, and the space it needs is not part of the text.
    if opt.tex_markup then out[#out + 1] = pandoc.Space() end
    emit_hook(out, 'meta', meta_inlines,
              '\\hfill{}\\mbox{\\resumeEntryMeta{', '}}')
  end
  return out
end

---------------------------------------------------------------------------
-- 3. compact skill lines
---------------------------------------------------------------------------
local function compact_list(list)
  local out = {}
  for i, item in ipairs(list.content) do
    if i > 1 then
      for _, il in ipairs(joiner()) do out[#out + 1] = il end
    end
    for _, blk in ipairs(item) do
      if blk.content then
        for _, il in ipairs(blk.content) do out[#out + 1] = il end
      end
    end
  end
  return out
end

local function merge_label_with_list(label, list)
  local strong = label.content[1]
  local head = {}
  emit_hook(head, 'key', strong.content, '\\resumeKey{', '}')
  head[#head + 1] = pandoc.Space()
  local body = compact_list(list)
  for _, il in ipairs(body) do head[#head + 1] = il end
  return pandoc.Para(head)
end

---------------------------------------------------------------------------
-- block pass
---------------------------------------------------------------------------
local function transform_blocks(blocks)
  local out, i = {}, 1
  while i <= #blocks do
    local blk = blocks[i]
    local nxt = blocks[i + 1]
    local step = 1

    local handled = false

    if blk.t == 'Para' and opt.dash_lists then
      local expanded = split_dash_lines(blk)
      if expanded then
        -- Re-run the pass over what we just produced, so the label + list it
        -- created can be compacted by the rules below.
        for _, b in ipairs(transform_blocks(expanded)) do out[#out + 1] = b end
        handled = true
      end
    end

    if not handled and blk.t == 'Header' and blk.level >= 3 then
      local meta_inlines, leftover = meta_parts(nxt)
      if meta_inlines then step = 2 end                          -- absorb it
      local content = {}
      for _, il in ipairs(blk.content) do content[#content + 1] = il end
      local has_sep = type(opt.entry_separator) == 'string'
        and opt.entry_separator ~= ''
        and find_separator(content, opt.entry_separator) ~= nil
      if meta_inlines or has_sep then
        out[#out + 1] = pandoc.Header(blk.level, entry_row(content, meta_inlines), blk.attr)
        if leftover then
          for _, b in ipairs(transform_blocks(leftover)) do out[#out + 1] = b end
        end
      else
        out[#out + 1] = blk
      end

    elseif not handled and blk.t == 'Header' and opt.uppercase_sections and blk.level <= 2 then
      local up = {}
      for _, il in ipairs(blk.content) do
        if il.t == 'Str' then up[#up + 1] = pandoc.Str(il.text:upper())
        else up[#up + 1] = il end
      end
      out[#out + 1] = pandoc.Header(blk.level, up, blk.attr)

    elseif not handled and blk.t == 'Para' and is_label_line(blk)
        and nxt and is_compact_list(nxt, opt.inline_bullet_max) then
      out[#out + 1] = merge_label_with_list(blk, nxt)
      step = 2

    elseif not handled and opt.inline_bullets and is_compact_list(blk, opt.inline_bullet_max) then
      out[#out + 1] = pandoc.Para(compact_list(blk))

    elseif not handled and blk.t == 'HorizontalRule' and opt.drop_rules then
      -- The template rules between sections already, so the author's `---`
      -- separators would only print as stray centred lines.
      step = 1

    elseif not handled then
      out[#out + 1] = blk
    end

    i = i + step
  end
  return out
end

---------------------------------------------------------------------------
-- 5. heading roles
---------------------------------------------------------------------------
-- This runs on the walk over the document the Pandoc handler below returns, so
-- the entry rows rebuilt above are tagged along with the headings that were
-- left alone.
function Header(h)
  local class = HEADING_CLASS[h.level] or (h.level > 3 and 'resume-entry')
  if not class then return nil end
  return pandoc.Header(h.level, h.content, with_class(h.attr, class))
end

---------------------------------------------------------------------------
-- 4. contact line
---------------------------------------------------------------------------
local function strip_scheme(u)
  -- "https://x/y" -> "x/y", and "mailto:a@b" -> "a@b" (no slashes to keep).
  local s = u:gsub('^%a[%w+%-.]*://', '')
  s = s:gsub('^[Mm]ailto:', '')
  return (s:gsub('/+$', ''))
end

local function meta_text(meta, key)
  local v = meta and meta[key]
  if not v then return nil end
  local s = trim(pandoc.utils.stringify(v))
  if s == '' then return nil end
  return s
end

local function to_meta_map(item)
  local m = pandoc.MetaMap{}
  m.text = pandoc.MetaInlines(item.text)
  if item.url then m.url = pandoc.MetaInlines{ pandoc.Str(item.url) } end
  if item.icon then m.icon = pandoc.MetaString(item.icon) end
  return m
end

local function normalise_contacts(meta)
  local items = {}
  local function add(text, url, icon)
    if text then items[#items + 1] = { text = { pandoc.Str(text) }, url = url, icon = icon } end
  end
  for _, spec in ipairs({
    { 'location',    nil,                            'location-dot' },
    { 'address',     nil,                            'location-dot' },
    { 'phone',       nil,                            'phone' },
    { 'email',       function(v) return 'mailto:' .. v end,   'envelope' },
    { 'website',     function(v) return v end,       'globe' },
    { 'linkedin',    function(v) return 'https://www.linkedin.com/in/' .. v end, 'linkedin' },
    { 'github',      function(v) return 'https://github.com/' .. v end,          'github' },
  }) do
    local v = meta_text(meta, spec[1])
    if v then
      local url = spec[2] and spec[2](v) or nil
      -- Show the address, not a bare username: "github.com/codebam".
      local text = url and strip_scheme(url) or v
      add(text, url, spec[3])
    end
  end
  return items
end

---------------------------------------------------------------------------
-- entry point
---------------------------------------------------------------------------
function Pandoc(doc)
  local meta = doc.meta
  opt.dash_lists         = setting(meta, 'dash_lists', true)
  opt.drop_rules         = setting(meta, 'drop_rules', true)
  opt.date_rows          = setting(meta, 'date_rows', true)
  opt.split_entries      = setting(meta, 'split_entries', true)
  opt.entry_separator    = setting(meta, 'entry_separator', '·')
  opt.inline_bullets     = setting(meta, 'inline_bullets', true)
  opt.inline_bullet_max  = tonumber(setting(meta, 'inline_bullet_max', 30)) or 30
  opt.inline_bullet_join = setting(meta, 'inline_bullet_join', '·')
  opt.uppercase_sections = setting(meta, 'uppercase_sections', false)
  opt.build_contacts     = setting(meta, 'build_contacts', true)
  opt.tex_markup         = setting(meta, 'tex_markup', true)

  doc.blocks = pandoc.Blocks(transform_blocks(doc.blocks))

  if opt.build_contacts and not meta.contacts then
    local built = normalise_contacts(meta)
    if #built > 0 then
      local list = pandoc.MetaList{}
      for _, item in ipairs(built) do list[#list + 1] = to_meta_map(item) end
      meta.contacts = list
    end
  end
  return doc
end
