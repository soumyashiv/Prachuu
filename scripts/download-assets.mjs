// Downloads the videos and images listed in src/assets.manifest.json into
// public/media. Files that already exist are skipped, so it is safe to re-run.
//
//   npm run assets            -> exits 1 if anything fails
//   node scripts/download-assets.mjs --soft   -> never fails (used by predev/prebuild)

import { readFile, mkdir, stat, rename, rm } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const soft = process.argv.includes('--soft')
const manifest = JSON.parse(await readFile(path.join(root, 'src/assets.manifest.json'), 'utf8'))

const jobs = [
  ...Object.values(manifest.videos).map((p) => ({
    url: manifest.base + p,
    dest: path.join(root, 'public/media/videos', path.basename(p)),
  })),
  ...manifest.images.map((p) => ({
    url: manifest.base + p,
    dest: path.join(root, 'public/media/images', path.basename(p)),
  })),
]

const hasFile = async (f) => {
  try {
    return (await stat(f)).size > 0
  } catch {
    return false
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

async function download({ url, dest }) {
  const name = path.basename(dest)
  if (await hasFile(dest)) {
    console.log(`  skip  ${name}`)
    return true
  }
  await mkdir(path.dirname(dest), { recursive: true })
  const tmp = `${dest}.part`
  try {
    const res = await fetch(url, {
      headers: {
        Referer: manifest.base,
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      },
    })
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
    await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp))
    await rename(tmp, dest)
    console.log(`  done  ${name}  (${mb((await stat(dest)).size)})`)
    return true
  } catch (err) {
    await rm(tmp, { force: true })
    console.warn(`  FAIL  ${name}  ${err.message}`)
    return false
  }
}

// Small worker pool so the two large videos don't hog the connection alone.
const queue = [...jobs]
const results = []
const worker = async () => {
  while (queue.length) results.push(await download(queue.shift()))
}

console.log(`Checking ${jobs.length} media files in public/media ...`)
await Promise.all(Array.from({ length: 3 }, worker))

const failed = results.filter((ok) => !ok).length
if (failed) {
  console.warn(
    `\n${failed} file(s) failed. Check your connection and run "npm run assets" again.`,
  )
  process.exit(soft ? 0 : 1)
}
console.log('All media is in place.')
