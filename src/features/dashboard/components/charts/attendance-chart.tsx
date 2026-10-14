import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useI18n } from '@/hooks/use-i18n'
import { formatPercent } from '@/lib/format'

import { CHART_COLORS } from '../../constants'
import { formatChartMonth } from '../../utils/month'
import type { AttendancePoint } from '../../types'
import { ChartCard } from '../chart-card'

/** Line chart of the monthly attendance rate. */
export function AttendanceChart({ attendance }: { attendance: AttendancePoint[] }) {
  const { t, locale } = useI18n()

  const data = attendance.map((point) => ({
    name: formatChartMonth(point.month, locale),
    rate: point.rate,
  }))

  return (
    <ChartCard
      title={t('dashboard.charts.attendance.title')}
      subtitle={t('dashboard.charts.attendance.subtitle')}
    >
      <div dir="ltr" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
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
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: CHART_COLORS.muted }}
              width={40}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip
              labelStyle={{ color: 'var(--foreground)', marginBottom: 4 }}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--foreground)',
              }}
              formatter={(value) => [
                formatPercent(Number(value), locale),
                t('dashboard.charts.attendance.rate'),
              ]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_COLORS.primary, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
