import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useInventory } from '../context/InventoryContext'
import {
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  BarChart2,
  PieChart as PieIcon,
  Activity,
} from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
}

const PALETTE = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#84cc16']

function StatCard({ icon: Icon, label, value, sub, accent = '#8b5cf6' }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      style={{ '--accent': accent }}
    >
      <div className="mb-3 inline-flex items-center justify-center rounded-xl p-2" style={{ background: `${accent}20` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
      {/* decorative blob */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10"
        style={{ background: accent }}
      />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill || p.color }}>
          {p.name}: {currency ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
      <p style={{ color: item.payload.fill }}>{item.value} items</p>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
        <Icon size={18} className="text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  )
}

function ChartCard({ children, header }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {header && <div className="mb-5">{header}</div>}
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  const { items, lowStockItems, totalInventoryValue, loading } = useInventory()

  /* ── derived data ── */
  const categoryMap = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      if (!map[item.category]) map[item.category] = { category: item.category, count: 0, value: 0, quantity: 0 }
      map[item.category].count += 1
      map[item.category].value += item.quantity * item.price
      map[item.category].quantity += item.quantity
    })
    return Object.values(map).sort((a, b) => b.value - a.value)
  }, [items])

  const topItemsByValue = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
        .slice(0, 8)
        .map((i) => ({ name: i.name, value: Math.round(i.quantity * i.price) })),
    [items],
  )

  const stockStatusData = useMemo(() => {
    const out = items.filter((i) => i.quantity === 0).length
    const low = lowStockItems.filter((i) => i.quantity > 0).length
    const ok = items.length - low - out
    return [
      { name: 'Healthy', value: ok, fill: '#10b981' },
      { name: 'Low Stock', value: low, fill: '#f59e0b' },
      { name: 'Out of Stock', value: out, fill: '#ef4444' },
    ].filter((d) => d.value > 0)
  }, [items, lowStockItems])

  const radarData = useMemo(
    () =>
      categoryMap.slice(0, 6).map((c) => ({
        subject: c.category,
        Items: c.count,
        Quantity: Math.min(c.quantity, 100),
      })),
    [categoryMap],
  )

  const avgPrice = useMemo(() => {
    if (!items.length) return 0
    return items.reduce((s, i) => s + i.price, 0) / items.length
  }, [items])

  const healthPct = useMemo(() => {
    if (!items.length) return 0
    return Math.round(((items.length - lowStockItems.length) / items.length) * 100)
  }, [items, lowStockItems])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        <p className="text-sm text-slate-500">Loading analytics…</p>
      </div>
    )
  }

  return (
    <section className="space-y-8">
      {/* header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visual breakdown of your inventory health and value distribution.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total SKUs" value={items.length} sub="unique product lines" accent="#8b5cf6" />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={formatCurrency(totalInventoryValue)}
          sub="across all categories"
          accent="#06b6d4"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={lowStockItems.length}
          sub={`${healthPct}% items healthy`}
          accent="#f59e0b"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Unit Price"
          value={formatCurrency(avgPrice)}
          sub={`across ${categoryMap.length} categories`}
          accent="#10b981"
        />
      </div>

      {/* row 2: bar chart + pie */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Value by category — takes 3/5 */}
        <div className="lg:col-span-3">
          <ChartCard
            header={
              <SectionHeader
                icon={BarChart2}
                title="Inventory Value by Category"
                subtitle="Total rupee value of stock per category"
              />
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryMap} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<CustomTooltip currency />} />
                <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]}>
                  {categoryMap.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Stock health pie — takes 2/5 */}
        <div className="lg:col-span-2">
          <ChartCard
            header={
              <SectionHeader
                icon={PieIcon}
                title="Stock Health"
                subtitle="Healthy vs low vs out-of-stock"
              />
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => (
                    <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* row 3: top items bar + radar */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Top items by value — 3/5 */}
        <div className="lg:col-span-3">
          <ChartCard
            header={
              <SectionHeader
                icon={TrendingUp}
                title="Top Items by Stock Value"
                subtitle="Highest-value individual SKUs"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topItemsByValue}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `₹${v}`}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip currency />} />
                <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category radar — 2/5 */}
        <div className="lg:col-span-2">
          <ChartCard
            header={
              <SectionHeader
                icon={Activity}
                title="Category Radar"
                subtitle="Items & capped quantity per category"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={90}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Radar name="Items" dataKey="Items" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Radar name="Quantity" dataKey="Quantity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => (
                    <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* row 4: quantity per category bar */}
      <ChartCard
        header={
          <SectionHeader
            icon={BarChart2}
            title="Units in Stock by Category"
            subtitle="Total unit count per category"
          />
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categoryMap} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quantity" name="Units" radius={[6, 6, 0, 0]}>
              {categoryMap.map((_, i) => (
                <Cell key={i} fill={PALETTE[(i + 3) % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* low stock table */}
      {lowStockItems.length > 0 && (
        <ChartCard
          header={
            <SectionHeader
              icon={AlertTriangle}
              title="Low Stock Items"
              subtitle="Items at or below minimum threshold"
            />
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Item', 'Category', 'Qty', 'Min Threshold', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="pb-2 pr-4 text-left font-medium text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {lowStockItems.map((item) => {
                  const isOut = item.quantity === 0
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{item.category}</td>
                      <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-slate-100">{item.quantity}</td>
                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{item.minThreshold}</td>
                      <td className="py-2.5">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={
                            isOut
                              ? { background: '#fee2e2', color: '#b91c1c' }
                              : { background: '#fef3c7', color: '#92400e' }
                          }
                        >
                          {isOut ? 'Out of stock' : 'Low stock'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </section>
  )
}
