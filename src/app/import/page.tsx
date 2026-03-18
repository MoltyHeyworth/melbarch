'use client'

import { useState, useRef, useCallback } from 'react'

interface ImportResult {
  added: number
  skipped: number
  errors: { row: number; message: string }[]
}

const REQUIRED_COLUMNS = ['address', 'suburb', 'year_built', 'architects']
const OPTIONAL_COLUMNS = [
  'name',
  'style',
  'materials',
  'description',
  'architectural_notes',
  'source_references',
  'featured',
  'award_name',
  'award_body',
  'award_year',
]

export default function ImportPage() {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Import failed')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error during upload')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const downloadTemplate = () => {
    const headers = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS].join(',')
    const sample =
      '"123 Example Street","South Yarra","1965","Robin Boyd","Example House","Modernist,Mid-Century Modern","Brick,Timber","A beautiful house","Notable cantilevered design","Architecture Australia",false,"AIA Award","AIA","1966"'
    const csv = `${headers}\n${sample}\n`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'melbarch-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-1">
          Import Houses
        </h1>
        <p className="text-sm text-[#6B7280] mb-8">
          Upload a CSV or JSON file to batch-add houses to the database.
        </p>

        {/* Column reference */}
        <div className="bg-white rounded border border-gray-100 shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-[#1A1A2E] mb-3 uppercase tracking-wider">
            Column Reference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-[#1A1A2E] mb-1">Required</h3>
              <ul className="space-y-0.5 text-[#6B7280]">
                {REQUIRED_COLUMNS.map((col) => (
                  <li key={col}>
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{col}</code>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1A1A2E] mb-1">Optional</h3>
              <ul className="space-y-0.5 text-[#6B7280]">
                {OPTIONAL_COLUMNS.map((col) => (
                  <li key={col}>
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{col}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-[#6B7280] mt-3">
            Multi-value fields (style, materials, architects, source_references) use comma separation within the field.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragging
              ? 'border-[#C9A96E] bg-[#C9A96E]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {loading ? (
            <div>
              <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#6B7280]">Importing...</p>
            </div>
          ) : (
            <>
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-[#1A1A2E] mb-1">Drop a CSV or JSON file here</p>
              <p className="text-sm text-[#6B7280] mb-4">or click to browse</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 text-sm bg-[#1A1A2E] text-white rounded hover:bg-[#2a2a4e] transition-colors"
              >
                Choose File
              </button>
            </>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded border border-gray-100 shadow-sm p-4">
            <p className="text-[#1A1A2E] font-medium mb-2">
              &#10003; {result.added} house{result.added !== 1 ? 's' : ''} added
              {result.skipped > 0 && `, ${result.skipped} skipped (duplicates)`}
            </p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600 mb-1">
                  Errors ({result.errors.length}):
                </p>
                <ul className="text-sm text-red-600 space-y-0.5 max-h-40 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <li key={i}>
                      Row {err.row}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Template download */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 text-sm border border-gray-200 rounded bg-white text-[#6B7280] hover:border-[#C9A96E] hover:text-[#1A1A2E] transition-colors"
          >
            Download CSV Template
          </button>
          <a
            href="/api/export"
            className="px-4 py-2 text-sm border border-gray-200 rounded bg-white text-[#6B7280] hover:border-[#C9A96E] hover:text-[#1A1A2E] transition-colors inline-block"
          >
            Export All as JSON
          </a>
        </div>
      </div>
    </div>
  )
}
