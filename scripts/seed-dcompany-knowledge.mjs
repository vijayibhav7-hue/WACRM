/**
 * D Company – Knowledge Base Seeder
 * ------------------------------------
 * Run this once after configuring the AI Assistant to populate the
 * knowledge base with D Company's services, FAQs, and contact info.
 *
 * Usage (from the project root):
 *   SEED_ACCOUNT_ID=your-uuid node scripts/seed-dcompany-knowledge.mjs
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set
 *     in .env.local (they already are in this project).
 *   - Pass your account_id via SEED_ACCOUNT_ID env var.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const raw = readFileSync(envPath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // .env.local not found — fall through to process.env
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ACCOUNT_ID = process.env.SEED_ACCOUNT_ID || 'REPLACE_WITH_YOUR_ACCOUNT_ID'

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.')
  process.exit(1)
}
if (ACCOUNT_ID === 'REPLACE_WITH_YOUR_ACCOUNT_ID') {
  console.error('Set SEED_ACCOUNT_ID env var. Example:\n  SEED_ACCOUNT_ID=your-uuid node scripts/seed-dcompany-knowledge.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const documents = [
  {
    title: 'D Company - Overview & Services',
    content: `D Company is a Digital Marketing + AI + Business Growth + Automation company.

SERVICES:
1. Social Media Marketing - Facebook & Instagram posts, reels, creative content, brand awareness
2. Digital Advertising - Facebook Ads, Instagram Ads, local digital campaigns
3. Branding - Brand identity, promotional campaigns, creative advertising
4. WhatsApp Marketing - Customer communication, promotional messages, WhatsApp chatbot
5. Lead Generation - Social media, digital ads, landing pages, lead forms
6. Telecalling & Lead Management - Lead calling, follow-up, status tracking
7. Website Development - Business websites, landing pages, web applications
8. App Development - Mobile apps, business dashboards
9. AI Solutions & Automation - AI chatbots, WhatsApp automation, customer support automation
10. Business Data Management - Customer data, leads, campaign data management
11. Election Campaigning - Social media campaign, candidate branding, booth management, voter data management

CONTACT: 9607636444 | dcompany1410@gmail.com`,
  },
  {
    title: 'D Company - Who We Help',
    content: `D Company helps these businesses grow digitally:

LOCAL SHOPS: Kiryana stores, Medical/Pharmacy, Clothing shops, Hardware, Mobile shops, General stores
HEALTHCARE: Hospitals, Clinics
BEAUTY: Beauty parlours, Salons
FOOD: Hotels, Restaurants
BRANDS: Local brands, D2C brands, Small & Medium businesses
INSTITUTIONS & CAMPAIGNS: Educational institutions, Election campaigns

D Company understands each business's unique needs and provides customized solutions.`,
  },
  {
    title: 'D Company - Pricing Policy',
    content: `D Company does NOT have fixed public prices. Pricing depends on:
- The specific service(s) required
- Scope and duration of the campaign or project
- Business size and location

HOW TO GET A QUOTE: Tell us your business name, type, city, and which service you need. Our team will prepare a customized quotation.

IMPORTANT: The AI assistant cannot quote or confirm any prices. Contact D Company directly:
Phone/WhatsApp: 9607636444
Email: dcompany1410@gmail.com`,
  },
  {
    title: 'D Company - WhatsApp Marketing & AI Chatbot',
    content: `D Company offers WhatsApp Marketing and AI Automation:

SERVICES:
- Set up WhatsApp Business for customer communication
- Send promotional messages and product/service info
- Handle customer enquiries on WhatsApp
- Build WhatsApp chatbots for automatic customer support (24/7)
- Automate lead follow-up via WhatsApp
- Create WhatsApp marketing campaigns

AI CHATBOT can automatically answer customer questions, provide info, collect leads, and hand off to a human agent when needed. Works in Marathi, Hindi, and English.

Contact: 9607636444 | dcompany1410@gmail.com`,
  },
  {
    title: 'D Company - Lead Generation Process',
    content: `D Company helps businesses get more customers:

GROWTH PROCESS: BUSINESS > DIGITAL PRESENCE > CUSTOMER REACH > ENQUIRY > LEAD > FOLLOW-UP > BUSINESS GROWTH

HOW WE GENERATE LEADS:
1. Social Media (Facebook, Instagram)
2. Digital Advertising - targeted ads
3. WhatsApp Marketing
4. Landing Pages
5. Lead Forms
6. Website

AFTER LEAD GENERATION: Lead management, telecalling follow-ups, CRM data management, regular reporting.

Contact: 9607636444 | dcompany1410@gmail.com`,
  },
  {
    title: 'D Company - AI Solutions & Automation',
    content: `D Company helps businesses reduce manual work using AI and automation:

AI SOLUTIONS:
- AI Chatbot - Automatic customer responses on WhatsApp/website
- WhatsApp Automation - Auto-replies, lead follow-up, appointment reminders
- Customer Support Automation - Handle common questions without human intervention
- AI Content Creation - Social media posts, captions, ads
- Automated Reporting - Business analytics and performance reports
- Business Data Management - Organize customer and lead data intelligently

WHO CAN BENEFIT: Any business spending too much time answering repeated questions, businesses with many leads but no follow-up system, businesses wanting 24/7 customer support.

Contact: 9607636444 | dcompany1410@gmail.com`,
  },
  {
    title: 'D Company - Contact & Human Handoff',
    content: `D Company Team Contact:

Phone/WhatsApp: 9607636444
Email: dcompany1410@gmail.com

WHEN TO CONTACT TEAM DIRECTLY:
- You want a customized quotation
- You want to schedule a meeting or call
- You want to discuss a specific project
- You have a complaint or concern
- You need information the AI assistant cannot provide

The AI assistant is available 24/7 for general information and initial enquiries. The human team responds during business hours.`,
  },
]

async function main() {
  console.log(`\nD Company Knowledge Base Seeder`)
  console.log(`Account ID: ${ACCOUNT_ID}`)
  console.log(`Documents to insert: ${documents.length}\n`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('account_id', ACCOUNT_ID)
    .eq('role', 'owner')
    .maybeSingle()

  const createdBy = profile?.user_id ?? null

  let inserted = 0
  for (const doc of documents) {
    const { error } = await supabase.from('ai_knowledge_documents').insert({
      account_id: ACCOUNT_ID,
      created_by: createdBy,
      title: doc.title,
      content: doc.content,
    })

    if (error) {
      console.error(`FAILED: "${doc.title}":`, error.message)
    } else {
      console.log(`OK: ${doc.title}`)
      inserted++
    }
  }

  console.log(`\nDone! ${inserted}/${documents.length} documents inserted.`)
  console.log(`\nNext steps:`)
  console.log(`  1. Go to Dashboard > Settings > AI Assistant > Knowledge Base`)
  console.log(`  2. Verify all ${inserted} documents are listed`)
  console.log(`  3. Enable AI Assistant and Auto-Reply in the settings page`)
  console.log(`  4. Test by sending a WhatsApp message to your number\n`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
