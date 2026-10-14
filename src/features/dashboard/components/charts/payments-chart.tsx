import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useI18n } from '@/hooks/use-i18n'
import { formatCompactNumber } from '@/lib/format'

import { CHART_COLORS } from '../../constants'
import { formatChartMonth } from '../../utils/month'
import type { PaymentPoint } from '../../types'
import { ChartCard } from '../chart-card'

/** Grouped bar chart comparing collected vs expected amounts per month. */
export function PaymentsChart({ payments }: { payments: PaymentPoint[] }) {
  const { t, locale } = useI18n()

  const data = payments.map((point) => ({
    name: formatChartMonth(point.month, locale),
    collected: point.collected,
    expected: point.expected,
  }))

  return (
    <ChartCard
      title={t('dashboard.charts.payments.title')}
      subtitle={t('dashboard.charts.payments.subtitle')}
    >
      <div dir="ltr" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, left: -6, bottom: 0 }}>
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
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: CHART_COLORS.muted }}
              width={44}
              tickFormatter={(value: number) => formatCompactNumber(value, locale)}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.muted, opacity: 0.08 }}
              labelStyle={{ color: 'var(--foreground)', marginBottom: 4 }}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--foreground)',
              }}
              formatter={(value, name) => [
                formatCompactNumber(Number(value), locale),
                name === 'collected'
                  ? t('dashboard.charts.payments.collected')
                  : t('dashboard.charts.payments.expected'),
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === 'collected'
                  ? t('dashboard.charts.payments.collected')
                  : t('dashboard.charts.payments.expected')
              }
            />
            <Bar
              dataKey="collected"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="expected"
              fill={CHART_COLORS.muted}
              radius={[4, 4, 0, 0]}
              opacity={0.55}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
