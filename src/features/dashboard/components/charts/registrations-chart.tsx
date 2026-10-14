import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import { CHART_COLORS } from '../../constants'
import { formatChartMonth } from '../../utils/month'
import type { RegistrationPoint } from '../../types'
import { ChartCard } from '../chart-card'

/** Bar chart of new student registrations per month. */
export function RegistrationsChart({ registrations }: { registrations: RegistrationPoint[] }) {
  const { t, locale } = useI18n()

  const data = registrations.map((point) => ({
    name: formatChartMonth(point.month, locale),
    count: point.count,
  }))

  return (
    <ChartCard
      title={t('dashboard.charts.registrations.title')}
      subtitle={t('dashboard.charts.registrations.subtitle')}
    >
      <div dir="ltr" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: CHART_COLORS.muted }}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: CHART_COLORS.muted }}
              width={40}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.muted, opacity: 0.08 }}
              formatter={(value) => [
                formatNumber(Number(value), locale),
                t('dashboard.kpis.registrations.label'),
              ]}
              labelStyle={{ color: 'var(--foreground)', marginBottom: 4 }}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--foreground)',
              }}
            />
            <Bar
              dataKey="count"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
