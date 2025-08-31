function Card({ title, total, children }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="font-medium">{title}</div>
        <div className="text-xl font-semibold text-orange-600">{total}</div>
      </div>
      <div className="mt-3 space-y-2 text-sm text-gray-700">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

import { useState } from 'react'

export default function Overview() {
  const monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [payrollMonth, setPayrollMonth] = useState('Aug')

  const data = {
    manpower: { Worker: 0, Staff: 0, Management: 0 },
    present: { Worker: 0, Staff: 0, Management: 0 },
    absent: { Worker: 0, Staff: 0, Management: 0 },
    leaveStatus: {
      'Casual Leave': 0,
      'Sick Leave': 0,
      'Leave Without Pay': 0,
      'Maternity Leave': 0,
      'Earn Leave': 0,
      'Short Leave': 0,
      'Leave Withour Notice': 0,
    },
    employeeStatus: {
      'Active Employee': 0,
      'InActive Employee': 0,
      'New Joined Employee': 0,
      'Resigned Employee': 0,
      'Terminated Employee': 0,
      'On Probation': 0,
      
    },
    overtime: {
      Cutting: 0,
      Sewing: 0,
      Finishing: 0,
      'Quality Control': 0,
      'Total OverTime Working Hour\'s': 0,
      'Total Payment For OverTime': 0,
    },
    extraOvertime: {
      Cutting: 0,
      Sewing: 0,
      Finishing: 0,
      'Quality Control': 0,
      "Total OverTime Hour's": 0,
      'Total Payment For Extra OverTime': 0,
    },
    payrollByMonth: {
      Jan: { thisMonth: 420000, today: 18000, mtd: 220000 },
      Feb: { thisMonth: 415000, today: 16500, mtd: 195000 },
      Mar: { thisMonth: 430000, today: 17000, mtd: 210000 },
      Apr: { thisMonth: 440000, today: 16000, mtd: 205000 },
      May: { thisMonth: 450000, today: 17500, mtd: 230000 },
      Jun: { thisMonth: 455000, today: 15000, mtd: 190000 },
      Jul: { thisMonth: 470000, today: 15500, mtd: 200000 },
      Aug: { thisMonth: 482300, today: 16250, mtd: 215000 },
      Sep: { thisMonth: 0, today: 0, mtd: 0 },
      Oct: { thisMonth: 0, today: 0, mtd: 0 },
      Nov: { thisMonth: 0, today: 0, mtd: 0 },
      Dec: { thisMonth: 0, today: 0, mtd: 0 },
    },
  }

  const sum = (obj) => Object.values(obj).reduce((a, b) => a + (Number(b) || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-gray-500">Company-wide data and statistics</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card title="Total Manpower" total={sum(data.manpower)}>
          <Row label="Worker" value={data.manpower.Worker} />
          <Row label="Staff" value={data.manpower.Staff} />
          <Row label="Management" value={data.manpower.Management} />
        </Card>

        <Card title="Present" total={sum(data.present)}>
          <Row label="Worker" value={data.present.Worker} />
          <Row label="Staff" value={data.present.Staff} />
          <Row label="Management" value={data.present.Management} />
        </Card>

        <Card title="Absent" total={sum(data.absent)}>
          <Row label="Worker" value={data.absent.Worker} />
          <Row label="Staff" value={data.absent.Staff} />
          <Row label="Management" value={data.absent.Management} />
        </Card>

        <Card title="Leave Status" total={sum(data.leaveStatus)}>
          {Object.entries(data.leaveStatus).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>

        <Card title="Entire Employee Status" total={sum(data.employeeStatus)}>
          {Object.entries(data.employeeStatus).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>

        <Card title="OverTime Attandance" total={sum(data.overtime)}>
          {Object.entries(data.overtime).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>

        <Card title="Extra OverTime Attandance" total={sum(data.extraOvertime)}>
          {Object.entries(data.extraOvertime).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>

        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Payroll</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Month</label>
              <select
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="h-9 rounded border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {monthOptions.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(() => {
              const p = data.payrollByMonth[payrollMonth]
              const entries = [
                ['This Month', p.thisMonth],
                ['Today', p.today],
                ['Month To Date', p.mtd],
              ]
              return entries.map(([k, v]) => (
                <div key={k} className="rounded border border-gray-200 p-3">
                  <div className="text-sm text-gray-500">{k}</div>
                  <div className="mt-1 text-lg font-semibold">{new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)}</div>
                </div>
              ))
            })()}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="font-medium mb-3">Total Manpower Breakdown</div>
          <Doughnut
            data={{
              labels: ['Worker', 'Staff', 'Management'],
              datasets: [
                {
                  data: [data.manpower.Worker, data.manpower.Staff, data.manpower.Management],
                  backgroundColor: ['#fb923c', '#fdba74', '#fed7aa'],
                  borderWidth: 0,
                },
              ],
            }}
            options={{ plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
        <div className="rounded border border-gray-200 bg-white p-4 lg:col-span-2">
          <div className="font-medium mb-3">Total Manpower by Category</div>
          <Bar
            data={{
              labels: ['Worker', 'Staff', 'Management'],
              datasets: [
                {
                  label: 'Headcount',
                  data: [data.manpower.Worker, data.manpower.Staff, data.management?.Management || data.manpower.Management],
                  backgroundColor: '#fb923c',
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } },
            }}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="font-medium mb-3">Headcount Trend (Last 6 months)</div>
          <Line
            data={{
              labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              datasets: [
                {
                  label: 'Employees',
                  data: [1180, 1205, 1220, 1235, 1240, 1245],
                  borderColor: '#f97316',
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } },
            }}
          />
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="font-medium mb-3">Leave Breakdown</div>
          <Doughnut
            data={{
              labels: Object.keys(data.leaveStatus),
              datasets: [
                {
                  data: Object.values(data.leaveStatus).map((v, i) => (i + 1) * 2),
                  backgroundColor: ['#fb923c', '#fdba74', '#fed7aa', '#fef3c7', '#93c5fd', '#a7f3d0', '#fca5a5'],
                  borderWidth: 0,
                },
              ],
            }}
            options={{ plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="font-medium mb-3">OverTime Hours by Department</div>
          <Bar
            data={{
              labels: ['Cutting', 'Sewing', 'Finishing', 'Quality Control'],
              datasets: [
                {
                  label: 'Hours',
                  data: [12, 28, 17, 9],
                  backgroundColor: '#fb923c',
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } },
            }}
          />
        </div>
      </section>
    </div>
  )
}


