[.](./readme.md)

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser"></script>
<link href="https://cdn.jsdelivr.net/npm/@trenaryja/ui" rel="stylesheet" type="text/css" />

<div id="root"></div>
```

```css

```

```js
import React, { useState, useEffect } from 'https://esm.sh/react'
import { createRoot } from 'https://esm.sh/react-dom/client'

const Root = () => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const t = setInterval(() => setTime(new Date()), 1000)
		return () => clearInterval(t)
	}, [])

	return (
		<main className='prose p-10 full-bleed-container content-center text-center min-w-screen min-h-screen overflow-auto'>
			<h1>{'Hello, React!'}</h1>
			<p>{time.toLocaleTimeString()}</p>
		</main>
	)
}

createRoot(document.getElementById('root')).render(<Root />)
```
