# Value Flow

An interactive, browser-based visualization of a manufacturing group's value flows (anonymized data).

Requires a browser with WebGPU (current Chrome or Edge).

## Use

- ⌥1–9 walk the views; v, g, e, z and Esc explore; u shows or hides the uncertainty; q toggles the on-screen hints.
- The ⚙ button (or `,`) opens the settings: each degree of freedom on or off.
- In an embedded page, click once into it before using the keys.

## Embed

```html
<iframe src="https://liminalconsulting.github.io/value-flow/" width="1280" height="720" style="border:0" allowfullscreen></iframe>
```

## Run locally

Static files only: serve this folder with any static web server, e.g. `bunx serve .`, then open the printed URL.
