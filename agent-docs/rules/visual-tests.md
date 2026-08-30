# Visual Tests

## Toggle a hidden checkbox by clicking its visible label, not by scripting a click on the input

To toggle a visually-hidden checkbox (an `opacity-0` input wrapped in a `<label>`), click the label's visible text with a real Playwright interaction — `page.getByText(name, { exact: true }).click()` — never `page.getByLabel(name).evaluate(el => el.click())`.

**Why:** `.evaluate()` only waits for the element to attach to the DOM, not for React to attach its `onChange` handler. A scripted click fired before hydration completes flips the input's own `checked` property directly without React ever seeing a change event, so no state update happens and the controls the toggle should reveal never render — any assertion on that effect then times out rather than failing fast. A real click on the visible label goes through Playwright's actionability checks and the browser's native event pipeline, which reliably lands after hydration completes.
