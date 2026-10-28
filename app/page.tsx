'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock3,
  Eraser,
  History,
  Landmark,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  WalletCards,
  XCircle,
} from 'lucide-react'

type Breakdown = { denomination: number; quantity: number; contribution: number }
type Operation = { id: number; date: string; amount: number; bills: number; status: 'Completado' }

const DENOMINATIONS = [1000, 500, 200, 100]
const QUICK_AMOUNTS = [500, 1000, 2000, 2800, 5000]
const formatMoney = (value: number) => new Intl.NumberFormat('es-MX').format(value)

function calculateGreedy(amount: number): Breakdown[] {
  let remaining = amount
  return DENOMINATIONS.map((denomination) => {
    const quantity = Math.floor(remaining / denomination)
    remaining -= quantity * denomination
    return { denomination, quantity, contribution: quantity * denomination }
  })
}

export default function Page() {
  const [amount, setAmount] = useState('2800')
  const [result, setResult] = useState<Breakdown[] | null>(null)
  const [error, setError] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [history, setHistory] = useState<Operation[]>([])

  const visibleBreakdown = useMemo(() => result?.filter((item) => item.quantity > 0) ?? [], [result])
  const totalBills = visibleBreakdown.reduce((sum, item) => sum + item.quantity, 0)
  const numericAmount = Number(amount)

  function calculate() {
    const trimmed = amount.trim()
    const value = Number(trimmed)
    if (!trimmed) return setError('Ingresa un monto para continuar.')
    if (!Number.isInteger(value) || value <= 0) return setError('El monto debe ser un número entero positivo.')
    if (value % 100 !== 0) return setError('El monto debe ser múltiplo de 100.')

    setError('')
    setIsCalculating(true)
    window.setTimeout(() => {
      const breakdown = calculateGreedy(value)
      setResult(breakdown)
      setHistory((current) => [
        {
          id: Date.now(),
          date: new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date()),
          amount: value,
          bills: breakdown.reduce((sum, item) => sum + item.quantity, 0),
          status: 'Completado' as const,
        },
        ...current,
      ].slice(0, 8))
      setIsCalculating(false)
    }, 450)
  }

  function clear() {
    setAmount('')
    setResult(null)
    setError('')
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0b2859] text-white shadow-lg shadow-blue-950/15">
              <Landmark className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-[0.18em] text-[#0b2859]">ATM GREEDY</h1>
                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:inline-flex">Sistema operativo</span>
              </div>
              <p className="text-xs text-slate-500">Simulador inteligente de retiro de efectivo</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-right sm:flex">
            <Sparkles className="size-4 text-cyan-500" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-500">Algoritmo voraz de cambio de billetes</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <section className="rounded-[28px] bg-[#0b2859] p-7 text-white shadow-xl shadow-blue-950/10 sm:p-9">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200"><WalletCards className="size-6" aria-hidden="true" /></div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Simulación académica</p>
                <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Retira efectivo de forma inteligente.</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/75">Observa cómo Greedy encuentra la combinación con el menor número de billetes, eligiendo siempre la denominación más grande disponible.</p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-blue-100/70"><Lightbulb className="size-4 text-cyan-300" aria-hidden="true" /><span>Rápido, determinista y fácil de explicar.</span></div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9" aria-labelledby="withdraw-title">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Operación nueva</p><h2 id="withdraw-title" className="text-2xl font-bold tracking-tight text-[#0b2859]">¿Cuánto deseas retirar?</h2></div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-[#1565c0]"><Banknote className="size-5" aria-hidden="true" /></div>
            </div>
            <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-slate-700">Monto a retirar</label>
            <div className={`flex items-center rounded-2xl border bg-slate-50 px-4 transition-colors focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 ${error ? 'border-red-300' : 'border-slate-200'}`}>
              <span className="mr-3 border-r border-slate-200 pr-3 text-sm font-bold text-slate-400">$</span>
              <input id="amount" type="number" min="100" step="100" value={amount} onChange={(event) => { setAmount(event.target.value); setError('') }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) calculate() }} placeholder="0" aria-invalid={Boolean(error)} aria-describedby="amount-help amount-error" className="w-full bg-transparent py-4 text-3xl font-bold tracking-tight text-[#0b2859] outline-none placeholder:text-slate-300" />
            </div>
            <div className="mt-2 flex min-h-5 items-center justify-between gap-3"><p id="amount-help" className="text-xs text-slate-500">El monto debe ser múltiplo de 100.</p>{error && <p id="amount-error" role="alert" className="text-right text-xs font-semibold text-red-600">{error}</p>}</div>
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Montos rápidos">{QUICK_AMOUNTS.map((quickAmount) => <button type="button" key={quickAmount} onClick={() => { setAmount(String(quickAmount)); setError('') }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700">${formatMoney(quickAmount)}</button>)}</div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button type="button" onClick={calculate} disabled={isCalculating} className="h-12 flex-1 rounded-xl bg-[#1261b6] font-bold tracking-wide text-white shadow-lg shadow-blue-600/20 hover:bg-[#0d4d94]">{isCalculating ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <Sparkles data-icon="inline-start" aria-hidden="true" />} {isCalculating ? 'CALCULANDO...' : 'CALCULAR RETIRO'}</Button><Button type="button" variant="outline" onClick={clear} className="h-12 rounded-xl border-slate-200 px-5 text-slate-600"><Eraser data-icon="inline-start" aria-hidden="true" /> LIMPIAR</Button></div>
          </section>
        </div>

        {result && <section className="animate-in fade-in slide-in-from-bottom-3 duration-500" aria-labelledby="result-title">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Resultado de la operación</p><h2 id="result-title" className="text-2xl font-bold tracking-tight text-[#0b2859]">Desglose de billetes</h2></div><div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="size-5" aria-hidden="true" /> Retiro calculado correctamente</div></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleBreakdown.map(({ denomination, quantity }) => <article key={denomination} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-start justify-between"><div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#1261b6]"><Banknote className="size-5" aria-hidden="true" /></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700">x{quantity}</span></div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Denominación</p><p className="mt-1 text-2xl font-black text-[#0b2859]">${formatMoney(denomination)}</p><p className="mt-2 text-xs text-slate-500">{quantity === 1 ? '1 billete entregado' : `${quantity} billetes entregados`}</p></article>)}</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3"><Summary label="Monto solicitado" value={`$${formatMoney(numericAmount)}`} /><Summary label="Total de billetes" value={String(totalBills)} /><Summary label="Dinero restante" value="$0" positive /></div>
        </section>}

        {result && <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="how-title"><div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="mb-6 flex items-start gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Lightbulb className="size-5" aria-hidden="true" /></div><div><h2 id="how-title" className="text-lg font-bold text-[#0b2859]">¿Cómo funciona el algoritmo Greedy?</h2><p className="mt-1 text-sm leading-6 text-slate-500">Selecciona primero la denominación de mayor valor posible, reduce el monto restante y continúa con las siguientes denominaciones.</p></div></div><div className="grid gap-2 sm:grid-cols-4">{['Monto inicial', 'Selección de billetes', 'Actualización del restante', 'Resultado final'].map((step, index) => <div key={step} className="flex items-center gap-2 sm:flex-col sm:items-start"><div className="flex items-center gap-2"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0b2859] text-xs font-bold text-white">{index + 1}</span><span className="text-xs font-bold text-slate-700">{step}</span></div>{index < 3 && <ArrowRight className="hidden size-4 text-cyan-500 sm:block" aria-hidden="true" />}</div>)}</div><div className="mt-7 overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3 font-semibold">Denominación</th><th className="px-4 py-3 font-semibold">Billetes entregados</th><th className="px-4 py-3 text-right font-semibold">Dinero aportado</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleBreakdown.map((item) => <tr key={item.denomination}><td className="px-4 py-3 font-bold text-[#0b2859]">${formatMoney(item.denomination)}</td><td className="px-4 py-3 text-slate-600">{item.quantity}</td><td className="px-4 py-3 text-right font-semibold text-slate-700">${formatMoney(item.contribution)}</td></tr>)}</tbody></table></div></div><HistoryPanel history={history} onClear={() => setHistory([])} /></section>}

        {!result && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-center text-sm text-slate-500">Ingresa un monto y calcula tu retiro para ver el desglose paso a paso.</div>}
      </div>
      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>ATM Greedy · Proyecto de Ingeniería en Sistemas</span><span>Simulador local · Sin conexión a cajeros reales</span></div></footer>
    </main>
  )
}

function Summary({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-2 text-2xl font-black ${positive ? 'text-emerald-600' : 'text-[#0b2859]'}`}>{value}</p></div> }
function HistoryPanel({ history, onClear }: { history: Operation[]; onClear: () => void }) { return <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Actividad reciente</p><h2 className="text-lg font-bold text-[#0b2859]">Historial de operaciones</h2></div><Button type="button" variant="ghost" size="icon-sm" onClick={onClear} disabled={!history.length} aria-label="Limpiar historial" title="Limpiar historial"><RotateCcw aria-hidden="true" /></Button></div>{history.length ? <div className="flex flex-col gap-3">{history.map((operation) => <div key={operation.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div className="flex min-w-0 items-center gap-3"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><CheckCircle2 className="size-4" aria-hidden="true" /></div><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-700">${formatMoney(operation.amount)} <span className="font-normal text-slate-400">· {operation.bills} billetes</span></p><p className="flex items-center gap-1 text-xs text-slate-400"><Clock3 className="size-3" aria-hidden="true" /> {operation.date}</p></div></div><span className="text-xs font-bold text-emerald-600">{operation.status}</span></div>)}</div> : <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 px-4 py-8 text-center"><XCircle className="size-6 text-slate-300" aria-hidden="true" /><p className="text-sm font-medium text-slate-500">Aún no hay operaciones</p><p className="text-xs text-slate-400">Tus retiros aparecerán aquí.</p></div>}</div> }
