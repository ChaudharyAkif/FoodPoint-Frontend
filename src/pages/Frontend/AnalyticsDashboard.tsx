import  { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import InfoIcon from '../../components/UI/InfoIcon';
import DateComponent from '../../components/DateComponent';
import ColorCheckbox from '../../components/UI/Checkbox';

const AnalyticsDashboard = () => {
  const [comparePerformance, setComparePerformance] = useState(false);

  // Sample data for orders chart
  const ordersData = [
    { date: '30/05', successful: 6, cancel: 0 },
    { date: '31/05', successful: 8, cancel: 2 },
    { date: '01/06', successful: 6, cancel: 0 },
    { date: '02/06', successful: 5, cancel: 0 },
    { date: '03/06', successful: 7, cancel: 0 },
    { date: '04/06', successful: 1, cancel: 0 },
    { date: '05/06', successful: 6, cancel: 0 },
    { date: '06/06', successful: 6, cancel: 0 },
    { date: '07/06', successful: 6, cancel: 0 },
    { date: '08/06', successful: 6, cancel: 0 },
  ];

  // Sample data for average order value chart
  const avgOrderData = [
    { date: '30/05', averageOrderValue: 18 },
    { date: '31/05', averageOrderValue: 100 },
    { date: '01/06', averageOrderValue: 160 },
    { date: '02/06', averageOrderValue: 150 },
    { date: '03/06', averageOrderValue: 80 },
    { date: '04/06', averageOrderValue: 90 },
    { date: '05/06', averageOrderValue: 180 },
  ];

  const secondorder = [
    { date: '30/05', averageOrderValue: 18 },
    { date: '31/05', averageOrderValue: 19 },
    { date: '01/06', averageOrderValue: 22 },
    { date: '02/06', averageOrderValue: 32 },
    { date: '03/06', averageOrderValue: 20 },
    { date: '04/06', averageOrderValue: 18 },
    { date: '05/06', averageOrderValue: 23 },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  
const getIntensityColor = (value) => {
    if (!value || value === 0) return 'bg-transparent';
    if (value === 1) return 'bg-blue-200';
    if (value === 2) return 'bg-blue-300';
    if (value === 3) return 'bg-blue-400';
    if (value === 4) return 'bg-blue-500';
    return 'bg-blue-600';
  };
 const data = {
    mon: { 15: 2, 16: 3 },
    tue: { 12: 2 },
    wed: { 12: 2, 14: 1, 15: 2, 16: 2 },
    thu: { 13: 2, 14: 2, 15: 2, 19: 1 },
    fri: { 14: 1, 15: 2, 16: 2, 17: 2, 18: 2 },
    sat: { 12: 2, 14: 2, 15: 2, 16: 2, 17: 2 },
    sun: { 13: 2, 14: 3, 15: 3 }
  };

   const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

 const getValue = (day, hour) => {
    const dayKey = day.toLowerCase();
    return data[dayKey]?.[hour] || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Overview Section */}
        <div className=" rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <h2
                className="text-[clamp(16px,5vw,30px)] font-extrabold text-black "
                style={{ fontWeight: 900 }}
              >
                Overview
              </h2>
              <InfoIcon />
            </div>
            <DateComponent />
          </div>
          <div className="w-full  ">
            <p className="w-3/4  text-sm sm:text-base md:text-lg text-black ">
              You can only see data from 4-star and from yesterday up to the last 90 days. Please
              come back when from yesterday up to data is 4+ hours.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-black" style={{ fontWeight: 800 }}>
                Total revenue
              </h3>
              <InfoIcon />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$862.60</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-800 text-[16px] my-2  font-bold">↑ 31%</span>
              <span className="text-gray-500">vs 23/05 - 29/05</span>
            </div>
          </div>

          {/* Overall Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-medium text-black" style={{ fontWeight: 900 }}>
                Overall average order value
              </h3>
              <InfoIcon />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$22.12</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-800 text-[16px] my-2 font-bold">↑ 4%</span>
              <span className="text-gray-500">vs 23/05 - 29/05</span>
            </div>
          </div>

          {/* Cancellation Rate */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-extrabold text-black" style={{ fontWeight: 900 }}>
                Cancellation rate
              </h3>
              <InfoIcon />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.88%</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-500  text-[16px] my-2 font-bold">↑ 100%</span>
              <span className="text-gray-500">vs 23/05 - 29/05</span>
            </div>
          </div>
        </div>

        {/* Orders Chart and Order Types */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900" style={{ fontWeight: 900 }}>
                    {' '}
                    Orders
                  </h3>
                  <InfoIcon />
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-black text-[15px]">
                      Total <br /> successful orders
                    </span>
                    <div className="font-semibold text-black text-[30px] my-4">39</div>
                    <ColorCheckbox color="blue" label="successful orders" />
                  </div>
                  <div>
                    <span className="text-black text-[15px]">
                      Total <br /> cancelled orders
                    </span>
                    <div className="font-semibold text-black text-[30px] my-4">2</div>
                    <ColorCheckbox color="orange" label="cancelled orders" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <span className="text-sm text-black">Compare with past performance</span>
                <button
                  onClick={() => setComparePerformance(!comparePerformance)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    comparePerformance ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      comparePerformance ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="h-64 my-15">
              {/* //first grapjs */}
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={ordersData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  {/* ❌ NO GRID */}

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#9ca3af"
                  />

                  <YAxis
                    domain={[0, 8]}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#9ca3af"
                  />

                 
                  <Line
                    type="linear"
                    dataKey="successful"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#2563eb' }}
                    activeDot={false}
                  />

                  {/* ORANGE LINE */}
                  <Line
                    type="linear"
                    dataKey="cancel"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#f97316' }}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Types */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-xl font-semibold text-black" style={{ fontWeight: 700 }}>
                Order types
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              See breakdown of successful and paid-for orders by type.
            </p>

            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-60 h-60">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="5"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                 
                   <span className="text-4xl font-bold text-gray-900">39</span>
                  Orders
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColorCheckbox color="orange" label="Delivery orders" />
                </div>
                <span className="text-sm font-semibold text-gray-900">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColorCheckbox color="blue" label="Collection orders" />
                </div>
                <span className="text-sm font-semibold text-gray-900">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-black" style={{ fontWeight: 800 }}>
                  Average order value
                </h3>
                <InfoIcon />
              </div>
              <span className="text-sm text-black mt-10 ">
                Overall average <br /> order values
              </span>
              <div
                className="text-2xl font-bold text-gray-900 mb-1 my-2"
                style={{ fontWeight: 800 }}
              >
                $22.12
              </div>
              <div className="flex items-center gap-2 mt-5">
                <ColorCheckbox color="blue" label="Average order value" />
              </div>
            </div>
            <div className="flex  gap-2 mt-4 sm:mt-0">
              <span className="text-sm text-gray-600">Compare with past performance</span>
              <button
                onClick={() => setComparePerformance(!comparePerformance)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  comparePerformance ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    comparePerformance ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="h-64">
            {/* //second graph */}
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={secondorder} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#9ca3af"
                />

                <YAxis
                  tickLine={false}
                  axisLine={true}
                  fontSize={12}
                  stroke="#9ca3af"
                  domain={[18, 34]} // ✅ fixed range
                  ticks={[18, 20, 22, 24, 26, 28, 30, 32, 34]}
                />

                <Tooltip />

                <Line
                  name="Average order value"
                  type="linear" // 👈 IMPORTANT (image jaisa)
                  dataKey="averageOrderValue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#2563eb' }} // 👈 dots visible
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue and Payment Type */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Revenue and Payment Type Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-black" style={{ fontWeight: 800 }}>
                    Revenue
                  </h3>
                  <InfoIcon />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Compare with past performance</span>
                  <button
                    onClick={() => setComparePerformance(!comparePerformance)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      comparePerformance ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        comparePerformance ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-sm text-black">
                    Total <br /> revenue
                  </span>
                  <div className="text-2xl font-bold text-gray-900 my-5">$862.60</div>
                  <ColorCheckbox color="blue" label="Revenue" />
                </div>
                <div>
                  <span className="text-sm text-black">
                    Total <br /> revenue loss
                  </span>
                  <div className="text-2xl font-bold text-gray-900 my-5">$32.05</div>
                  <ColorCheckbox color="orange" label="Revenue loss" />
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={avgOrderData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="#9ca3af"
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={true}
                      fontSize={12}
                      stroke="#9ca3af"
                      domain={[20, 180]} // ✅ fixed range
                      ticks={[20, 40, 60, 80, 100, 120, 140, 160, 180]}
                    />

                    <Tooltip />

                    <Line
                      name="Average order value"
                      type="linear" // 👈 IMPORTANT (image jaisa)
                      dataKey="averageOrderValue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 2, fill: '#2563eb' }} // 👈 dots visible
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Type */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
              <div className="flex items-center gap-2 ">
                <h3 className="text-xl font-semibold text-black" style={{ fontWeight: 800 }}>
                  Payment type
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-8">
                See how your customers paid for their orders
              </p>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-65 h-65">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">$862.60</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="flex flex-col gap-3">
                  <ColorCheckbox color="orange" label="Paid online" />
                  <ColorCheckbox color="olive" label="Paid in cash " />
                  <ColorCheckbox color="blue" label="Others" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1>100%</h1>
                  <h1>0%</h1>
                  <h1>0%</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Insights Section */}
          {/* Hourly Insights Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-black" style={{ fontWeight: 700 }}>
                Hourly insights
              </h3>
            </div>
            <p className="text-lg text-black mb-6">
              View a breakdown of orders and revenue throughout the day. You can use this data to
              adjust your opening hours.
            </p>

            {/* Tab buttons */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button className="pb-3 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Orders
              </button>
              <button className="pb-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Revenue
              </button>
            </div>

            {/* Heatmap */}

            <div className="w-full bg-white p-6">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Scale indicator */}
                  <div className="flex items-start mb-4">
                    <div className="w-20 flex-shrink-0 text-xs text-gray-600 pt-0.5">Scale</div>
                    <div className="flex-1 relative" style={{ minWidth: '700px' }}>
                      {/* Gradient bar */}
                      <div className="h-3 flex rounded overflow-hidden">
                        <div className="flex-1 bg-blue-100"></div>
                        <div className="flex-1 bg-blue-200"></div>
                        <div className="flex-1 bg-blue-300"></div>
                        <div className="flex-1 bg-blue-400"></div>
                        <div className="flex-1 bg-blue-500"></div>
                        <div className="flex-1 bg-blue-600"></div>
                      </div>
                      {/* Scale numbers */}
                      <div className="flex justify-between mt-1 px-0.5">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <span key={num} className="text-xs text-gray-500">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="flex mb-2 mt-6">
                    <div className="w-20 flex-shrink-0"></div>
                    <div className="flex-1 grid grid-cols-7" style={{ minWidth: '700px' }}>
                      {days.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-700">
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap grid */}
                  <div className="space-y-0">
                    {hours.map((hour, hourIdx) => (
                      <div key={hour} className="flex">
                        <div className="w-20 flex-shrink-0 text-right text-xs text-gray-500 pr-3 py-1.5">
                          {hour}
                        </div>
                        <div className="flex-1 grid grid-cols-7" style={{ minWidth: '700px' }}>
                          {days.map((day) => {
                            const value = getValue(day, hourIdx);
                            return (
                              <div
                                key={`${day}-${hour}`}
                                className="relative"
                                style={{ height: '18px' }}
                              >
                                <div className="absolute inset-0 bg-blue-100 border-r border-white border-3 last:border-r-0">
                                  {value > 0 && (
                                    <div
                                      className={`h-full ${getIntensityColor(value)} transition-all duration-200`}
                                      title={`${day} ${hour}: ${value}`}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
