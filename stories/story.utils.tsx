export const picsum = async (size = 500) => await fetch(`https://picsum.photos/${size}`).then((res) => res.url)

// TODO: add reused story components here
