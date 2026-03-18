export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
  }
  fields.push(current.trim())
  return fields
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || ''
    })
    rows.push(row)
  }
  return rows
}

interface ImportRow {
  address: string
  suburb: string
  year_built: string
  architects: string
  name?: string
  style?: string
  materials?: string
  description?: string
  architectural_notes?: string
  source_references?: string
  featured?: string
  award_name?: string
  award_body?: string
  award_year?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const isJSON = file.name.endsWith('.json') || file.type === 'application/json'

    let rows: ImportRow[]

    if (isJSON) {
      try {
        rows = JSON.parse(text)
        if (!Array.isArray(rows)) {
          return NextResponse.json({ error: 'JSON must be an array' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
      }
    } else {
      rows = parseCSV(text) as unknown as ImportRow[]
    }

    let added = 0
    let skipped = 0
    const errors: { row: number; message: string }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 1

      // Validate required fields
      if (!row.address || !row.suburb || !row.year_built) {
        errors.push({ row: rowNum, message: 'Missing required field (address, suburb, or year_built)' })
        continue
      }

      const yearBuilt = parseInt(row.year_built, 10)
      if (isNaN(yearBuilt)) {
        errors.push({ row: rowNum, message: `Invalid year_built: ${row.year_built}` })
        continue
      }

      // Duplicate check
      const existing = await prisma.house.findFirst({
        where: { address: row.address },
      })
      if (existing) {
        skipped++
        continue
      }

      try {
        // Create house
        const splitToArray = (val: string | undefined): string[] =>
          val ? val.split(',').map((s) => s.trim()).filter(Boolean) : []

        const house = await prisma.house.create({
          data: {
            address: row.address,
            suburb: row.suburb,
            yearBuilt,
            name: row.name || null,
            style: JSON.stringify(splitToArray(row.style)),
            materials: JSON.stringify(splitToArray(row.materials)),
            description: row.description || null,
            architecturalNotes: row.architectural_notes || null,
            sourceReferences: JSON.stringify(splitToArray(row.source_references)),
            featured: row.featured === 'true' || row.featured === '1',
          },
        })

        // Handle architects
        if (row.architects) {
          const architectNames = row.architects.split(',').map((s) => s.trim()).filter(Boolean)
          for (const name of architectNames) {
            const architect = await prisma.architect.upsert({
              where: { name },
              update: {},
              create: { name },
            })
            await prisma.houseArchitect.create({
              data: { houseId: house.id, architectId: architect.id },
            })
          }
        }

        // Handle awards
        if (row.award_name) {
          await prisma.award.create({
            data: {
              houseId: house.id,
              awardName: row.award_name,
              awardingBody: row.award_body || null,
              yearAwarded: row.award_year ? parseInt(row.award_year, 10) || null : null,
            },
          })
        }

        added++
      } catch (err) {
        errors.push({ row: rowNum, message: `Database error: ${err instanceof Error ? err.message : String(err)}` })
      }
    }

    return NextResponse.json({ added, skipped, errors })
  } catch (err) {
    return NextResponse.json(
      { error: `Import failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    )
  }
}
