[.](./readme.md)

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser"></script>
<link href="https://cdn.jsdelivr.net/npm/@trenaryja/ui" rel="stylesheet" type="text/css" />

<div id="root"></div>
```

```css
[data-theme='badassThemeName'] {
	--color-primary: #bada55;
	--color-primary-content: #000;
	--color-neutral: #696969;
}
```

```js
document.documentElement.setAttribute('data-theme', 'badassThemeName')
```
