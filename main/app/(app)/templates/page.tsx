'use client'

import { useState, ReactNode } from 'react'

/* -----------------------
   TYPES
----------------------- */
type TemplateType = 'LinkedIn' | 'Outreach' | 'Twitter'

type Template = {
  id: string
  type: TemplateType
  name: string
  rules: {
    lines: string
    structure: string
    tone: string
    punch: string
    hashtags: string
    emojis: string
    forbidden: string[]
  }
}

/* -----------------------
   DATA
----------------------- */
const TEMPLATE_TYPES: TemplateType[] = [
  'LinkedIn',
  'Outreach',
  'Twitter',
]

const templates: Template[] = [
  {
    id: '1',
    type: 'LinkedIn',
    name: 'LinkedIn Authority',
    rules: {
      lines: '5–7 lines',
      structure: 'Hook → Value → CTA',
      tone: 'Professional',
      punch: 'High',
      hashtags: '3–5 (end only)',
      emojis: 'Max 2 (hook only)',
      forbidden: ['Questions', 'Buzzwords'],
    },
  },
  {
    id: '2',
    type: 'Outreach',
    name: 'Cold Outreach – Hard',
    rules: {
      lines: '3–4 lines',
      structure: 'Problem → Proof → CTA',
      tone: 'Direct',
      punch: 'Very High',
      hashtags: 'Not allowed',
      emojis: 'Not allowed',
      forbidden: ['Greetings', 'Soft words'],
    },
  },
  {
    id: '3',
    type: 'Twitter',
    name: 'Twitter Punch Thread',
    rules: {
      lines: '6–8 tweets',
      structure: 'Hook → Insight → Mic drop',
      tone: 'Bold',
      punch: 'Extreme',
      hashtags: '1–2 max',
      emojis: 'Optional (1/tweet)',
      forbidden: ['Long sentences'],
    },
  },
]

/* -----------------------
   PAGE
----------------------- */
export default function TemplatesPage() {
  const [activeType, setActiveType] = useState<TemplateType | 'All'>('All')

  const filtered =
    activeType === 'All'
      ? templates
      : templates.filter((t) => t.type === activeType)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-sm text-gray-500">
            LLM behavior rule sets (not prompts)
          </p>
        </div>

        <Button>+ Create Template</Button>
      </div>

      {/* Type Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeType === 'All' ? 'primary' : 'outline'}
          onClick={() => setActiveType('All')}
        >
          All
        </Button>

        {TEMPLATE_TYPES.map((type) => (
          <Button
            key={type}
            variant={activeType === type ? 'primary' : 'outline'}
            onClick={() => setActiveType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <Card key={tpl.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{tpl.name}</h2>
                  <Badge>{tpl.type}</Badge>
                </div>
              </div>

              <div className="text-sm space-y-1 mt-3">
                <Rule label="Lines" value={tpl.rules.lines} />
                <Rule label="Structure" value={tpl.rules.structure} />
                <Rule label="Tone" value={tpl.rules.tone} />
                <Rule label="Punch" value={tpl.rules.punch} />
                <Rule label="Hashtags" value={tpl.rules.hashtags} />
                <Rule label="Emojis" value={tpl.rules.emojis} />
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-red-500">Forbidden</p>
                <ul className="text-xs list-disc pl-4">
                  {tpl.rules.forbidden.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">Use</Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* -----------------------
   UI COMPONENTS
   (same page)
----------------------- */

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  )
}

function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-5">{children}</div>
}

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
}) {
  const base =
    'rounded-lg font-medium transition focus:outline-none'

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-700">
      {children}
    </span>
  )
}

function Rule({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
