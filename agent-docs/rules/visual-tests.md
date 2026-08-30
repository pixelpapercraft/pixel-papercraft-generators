# Visual Tests

## Toggle a hidden checkbox by clicking its visible label, not by scripting a click on the input

To toggle a visually-hidden checkbox (an `opacity-0` input wrapped in a `<label>`), click the label's visible text with a real Playwright interaction — `page.getByText(name, { exact: true }).click()` — never `page.getByLabel(name).evaluate(el => el.click())`.

**Why:** `.evaluate()` only waits for the element to attach to the DOM, not for React to attach its `onChange` handler. A scripted click fired before hydration completes flips the input's own `checked` property directly without React ever seeing a change event, so no state update happens and the controls the toggle should reveal never render — any assertion on that effect then times out rather than failing fast. A real click on the visible label goes through Playwright's actionability checks and the browser's native event pipeline, which reliably lands after hydration completes.

## Move the cursor off region overlays before capturing a screenshot

After the last `.click()` on a region overlay (`regions(page).nth(i)`, `getByTestId("region-…")`), move the cursor away before `renderImageAtNaturalSize` / `toHaveScreenshot` — `await page.mouse.move(box.x - 20, box.y - 20)` from the target's `boundingBox()`, or `page.mouse.move(0, 0)`.

**Why:** `RegionControls` renders every region as `border-4 border-transparent hover:border-blue-500`, so a cursor left resting on the clicked region paints a solid `rgb(59, 130, 246)` outline. A Playwright element screenshot clips the page to the element's box and includes anything drawn on top of it, so that outline lands in the capture even when the screenshot targets the output `<img>` rather than the region itself. The resulting diff covers roughly 1% of the image — under CI's `maxDiffPixelRatio` of 0.03, so it passes there while failing every local run, where the tolerance is 0. A baseline captured without the outline therefore looks correct on CI and is unreproducible locally.
