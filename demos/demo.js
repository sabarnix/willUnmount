/*
 * Shared by every demo. Detects sibling-index()/sibling-count(), if()/style(),
 * and relative colour syntax (hsl(from ...)) by actually computing a probe
 * value and reading it back — @supports can't do this, since these are
 * math-like functions that stay parse-valid even when unimplemented and only
 * go invalid at computed-value time, which @supports never checks.
 *
 * Each demo marks its root element with data-requires="<space-separated
 * feature names>"; a .no-support element immediately before it (in markup.html)
 * holds the fallback message. Both start in their "supported" state in HTML
 * (root visible, fallback hidden) so there's no flash in the common case.
 */
;(function () {
  function computed(el, prop) {
    return getComputedStyle(el).getPropertyValue(prop).trim()
  }

  function probe(css, buildHost) {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    const host = document.createElement('div')
    host.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;'
    buildHost(host)
    document.body.appendChild(host)

    return {
      host,
      cleanup() {
        style.remove()
        host.remove()
      },
    }
  }

  function supportsSiblingFns() {
    const p = probe(
      `
      @property --probe-sf-index { syntax: '<integer>'; inherits: false; initial-value: -1; }
      @property --probe-sf-count { syntax: '<integer>'; inherits: false; initial-value: -1; }
      .probe-sf > * { --probe-sf-index: sibling-index(); --probe-sf-count: sibling-count(); }
      `,
      (host) => {
        host.className = 'probe-sf'
        host.innerHTML = '<i></i><i></i><i></i>'
      }
    )
    const second = p.host.children[1]
    const ok =
      computed(second, '--probe-sf-index') === '2' && computed(second, '--probe-sf-count') === '3'
    p.cleanup()
    return ok
  }

  function supportsIfFn() {
    const p = probe(
      `
      @property --probe-if-flag { syntax: '<integer>'; inherits: false; initial-value: 0; }
      .probe-if { --probe-if-flag: 1; opacity: if(style(--probe-if-flag: 1): 0.42; else: 0.99); }
      `,
      (host) => {
        host.className = 'probe-if'
      }
    )
    const ok = computed(p.host, 'opacity') === '0.42'
    p.cleanup()
    return ok
  }

  function supportsRelativeColor() {
    const p = probe(
      '.probe-rc { color: red; background-color: hsl(from currentcolor h s calc(l - 50)); }',
      (host) => {
        host.className = 'probe-rc'
      }
    )
    const bg = computed(p.host, 'background-color')
    p.cleanup()
    // Unsupported browsers drop the declaration, leaving the initial transparent.
    return bg !== '' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
  }

  const FEATURE_TESTS = {
    sibling: supportsSiblingFns,
    if: supportsIfFn,
    'relative-color': supportsRelativeColor,
  }

  const cache = {}
  function isSupported(name) {
    if (!(name in cache)) cache[name] = FEATURE_TESTS[name]()
    return cache[name]
  }

  document.querySelectorAll('[data-requires]').forEach((el) => {
    const needed = el.dataset.requires.split(/\s+/).filter(Boolean)
    const supported = needed.every(isSupported)
    el.hidden = !supported

    const fallback = el.previousElementSibling
    if (fallback && fallback.classList.contains('no-support')) fallback.hidden = supported
  })
})()
