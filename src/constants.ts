import manifest from './assets.manifest.json'

// Media is served from /public/media. `npm run assets` (also run automatically
// before `npm run dev` / `npm run build`) downloads it from the URLs listed in
// src/assets.manifest.json. To use different media, edit that manifest.
const file = (p: string) => p.split('/').pop() as string
const media = (folder: 'videos' | 'images', p: string) =>
  `${import.meta.env.BASE_URL}media/${folder}/${file(p)}`

export const VIDEO_LEFT = media('videos', manifest.videos.left)
export const VIDEO_RIGHT = media('videos', manifest.videos.right)
export const GALLERY: string[] = manifest.images.map((p) => media('images', p))

export const SYMBOLS = ['8', '$', '^^', '%', '/']

export const EASE = [0.25, 0.1, 0.25, 1] as const
