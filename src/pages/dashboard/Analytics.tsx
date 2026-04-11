import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analyticsSeries } from '../../data/events'

export function Analytics() {
  return (
    <div className="page-shell py-12">
      <div className="max-w-4xl">
        <p className="section-kicker">Analytics</p>
        <h1 className="mt-3 text-4xl font-semibold">Monitor views, clicks, and inquiries over time.</h1>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel h-[360px]">
          <h2 className="text-xl font-semibold">Reach over time</h2>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4a90d9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4a90d9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area dataKey="views" stroke="#4a90d9" fill="url(#viewsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel h-[360px]">
          <h2 className="text-xl font-semibold">Clicks vs inquiries</h2>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="clicks" stroke="#1a472a" strokeWidth={3} />
                <Line dataKey="inquiries" stroke="#e58f4d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel h-[360px] lg:col-span-2">
          <h2 className="text-xl font-semibold">Monthly performance</h2>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#87CEEB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="inquiries" fill="#1a472a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
