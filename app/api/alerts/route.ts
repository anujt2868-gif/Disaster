import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
const FEED_URL = 'https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml'
function decodeXml(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim()
}
function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')) : ''
}
function sourceLanguage(text: string) {
  // Detect common scripts in official Indian alert messages before requesting English translation.
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te' // Telugu
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml' // Malayalam
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta' // Tamil
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn' // Kannada
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa' // Punjabi
  if (/[\u0980-\u09FF]/.test(text)) return 'bn' // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu' // Gujarati
  if (/[\u0900-\u097F]/.test(text)) return 'hi' // Devanagari (Hindi/Marathi)
  if (/[\u0600-\u06FF]/.test(text)) return 'ur' // Urdu/Arabic script
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or' // Odia
  return 'en'
}
async function translate(text: string, from: string, to: string): Promise<string> {
  if (!text) return ''
  if (from === to) return text
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text.slice(0, 1800))}`
    const response = await fetch(url, { signal: AbortSignal.timeout(4500), cache: 'no-store' })
    if (!response.ok) return 'English translation unavailable — open the official alert.'
    const data = await response.json()
    const result = Array.isArray(data?.[0]) ? data[0].map((part: unknown[]) => String(part?.[0] || '')).join('') : ''
    return result || (to === 'en' ? 'English translation unavailable — open the official alert.' : text)
  } catch { return 'English translation unavailable — open the official alert.' }
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  try {
    const response = await fetch(FEED_URL, { headers: { 'User-Agent': 'DisasterShield/1.0 (official alert feed reader)' }, signal: AbortSignal.timeout(9000), cache: 'no-store' })
    if (!response.ok) throw new Error(`SACHET feed returned HTTP ${response.status}`)
    const xml = await response.text()
    const rawItems = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(match => {
      const block = match[1]
      const title = tag(block, 'title') || 'Official disaster alert'
      const description = tag(block, 'description')
      const link = tag(block, 'link')
      const pubDate = tag(block, 'pubDate')
      const guid = tag(block, 'guid') || link || `${title}-${pubDate}`
      return { id: guid, title, description, link: link.startsWith('http') ? link : 'https://sachet.ndma.gov.in/', pubDate, source: 'NDMA SACHET' }
    }).slice(0, 15)
    const selectedTerms = [searchParams.get('city') || '', searchParams.get('region') || ''].map(value => value.trim().toLowerCase()).filter(value => value.length > 2)
    const alerts = await Promise.all(rawItems.map(async item => {
      const searchable = `${item.title} ${item.description}`.toLowerCase()
      const areaMatch = selectedTerms.some(term => searchable.includes(term))
      const detected = sourceLanguage(`${item.title} ${item.description}`)
      const englishTitle = await translate(item.title, detected, 'en')
      const englishDescription = await translate(item.description, detected, 'en')
      return { ...item, areaMatch, areaMatchNote: areaMatch ? 'Selected region mentioned in alert text' : 'India feed item · selected region not confirmed', titleEnglish: englishTitle, descriptionEnglish: englishDescription }
    }))
    return NextResponse.json({ ok: true, source: 'NDMA SACHET · India CAP RSS', sourceUrl: FEED_URL, scopeNote: 'India-wide CAP feed; region matching is text-based and not geospatially verified. Alerts are displayed in English only.', fetchedAt: new Date().toISOString(), language: 'English', alerts })
  } catch (error) {
    return NextResponse.json({ ok: false, source: 'NDMA SACHET · India CAP RSS', sourceUrl: FEED_URL, scopeNote: 'India-wide CAP feed; region matching is text-based and not geospatially verified. Alerts are displayed in English only.', language: 'English', error: error instanceof Error ? error.message : 'Unable to load official alerts', alerts: [] }, { status: 200 })
  }
}
