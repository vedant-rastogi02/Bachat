import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const csvPath = process.argv[2] ?? path.resolve(__dirname, '../updated_data.csv')

if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found at: ${csvPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(csvPath, 'utf8')

const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
})

const entries = records
  .map((row) => {
    const scheme_name = row.scheme_name
    const slug = row.slug
    const details = row.details || row.description
    const benefits = row.benefits
    const eligibility = row.eligibility
    const application = row.application || row.application_process
    const level = row.level || row.state || 'Central'
    const schemeCategory = row.schemeCategory || row.category
    const category = [level, schemeCategory].filter(Boolean).join(' - ')
    return {
      scheme_name,
      description: details,
      eligibility,
      benefits,
      application_process: application,
      state: level || 'Central',
      category,
      official_url: slug ? `https://www.myscheme.gov.in/search?query=${encodeURIComponent(scheme_name)}` : null,
    }
  })
  .filter((item) => item.scheme_name)

const supabase = createClient(supabaseUrl, supabaseServiceRole)

const { error: truncateError } = await supabase.from('schemes').delete().not('id', 'is', null)
if (truncateError) {
  console.error('Failed clearing table:', truncateError.message)
}

const batchSize = 200
for (let index = 0; index < entries.length; index += batchSize) {
  const batch = entries.slice(index, index + batchSize)
  const { error } = await supabase.from('schemes').insert(batch)
  if (error) {
    console.error(`Insert failed at batch ${index / batchSize + 1}:`, error.message)
    process.exit(1)
  }
}

console.log(`Imported ${entries.length} schemes from ${csvPath}`)
