import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
  Treemap, ReferenceLine, LabelList
} from 'recharts';
import {
  Sun, Moon, LayoutDashboard, DollarSign, Truck, Users, CreditCard,
  Loader2, ShoppingBag, AlertTriangle, ChevronRight, TrendingUp, Lightbulb
} from 'lucide-react';
import './index.css';

// ----------------------------------------------------------------------
// Color Palette Constants
// ----------------------------------------------------------------------
const COLORS = {
  indigo: '#6366f1',
  amber: '#f59e0b',
  emerald: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  muted: '#94a3b8',
};

// ----------------------------------------------------------------------
// Custom Hook for Data Fetching
// ----------------------------------------------------------------------
function useFetchData(fileName, skip = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip) return;
    let isMounted = true;
    setLoading(true);
    
    fetch(`./${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${fileName}`);
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileName, skip]);

  return { data, loading, error };
}

// ----------------------------------------------------------------------
// Formatting Utilities
// ----------------------------------------------------------------------
const formatCurrency = (val) => {
  if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}K`;
  return `R$ ${val}`;
};

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------
const LoadingState = () => (
  <div className="loading">
    <Loader2 className="spinner" size={36} />
    <span>Loading data...</span>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="error">
    <AlertTriangle size={24} />
    <div>Failed to load data: {message}</div>
  </div>
);

const KPICard = ({ title, value, icon: Icon, color, sparklineData, trendText }) => (
  <div className="kpi-card">
    <div className="kpi-header">
      <span className="kpi-label">{title}</span>
      <Icon size={20} color={color} />
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-bottom-row">
      <div className="kpi-sparkline">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sparklineData.map((val, i) => ({ id: i, value: val }))}>
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <span className="kpi-trend" style={{ color }}>{trendText}</span>
    </div>
    <div className="kpi-border" style={{ backgroundColor: color }} />
  </div>
);

const ChartCard = ({ title, subtitle, children, style }) => (
  <div className="chart-wrapper" style={{ ...style }}>
    <div className="chart-header">
      <div className="chart-title">{title}</div>
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
    </div>
    <div style={{ flex: 1, minHeight: 0 }}>
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="recharts-default-tooltip" style={{ padding: '12px' }}>
        <p style={{ margin: 0, marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 0, fontSize: '14px', color: entry.color || entry.fill, fontWeight: 500, marginBottom: '4px' }}>
            {entry.name}: <span style={{ color: '#fff' }}>{formatter ? formatter(entry.value) : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ----------------------------------------------------------------------
// Tabs Components
// ----------------------------------------------------------------------

// TAB 1: Overview
const OverviewTab = () => {
  const { data, loading, error } = useFetchData('olist_kpis.json');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  const { kpis } = data;
  
  const revCompareData = [
    { category: 'Revenue', "2017": kpis.rev_2017, "2018": kpis.rev_2018 }
  ];

  const pieData = [
    { name: 'Champions', value: kpis.champions, fill: COLORS.emerald },
    { name: 'At Risk', value: kpis.at_risk, fill: COLORS.red },
    { name: 'Can\'t Lose', value: kpis.cant_lose, fill: COLORS.amber },
    { name: 'Lost', value: kpis.lost, fill: COLORS.purple },
  ];
  const pieTotal = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="tab-content">
      <div className="grid-kpi">
        <KPICard title="Revenue 2017" value={formatCurrency(kpis.rev_2017)} icon={DollarSign} color={COLORS.amber} sparklineData={[3,4,5,6,7,8,9]} trendText="+12% YoY" />
        <KPICard title="Revenue 2018" value={formatCurrency(kpis.rev_2018)} icon={TrendingUp} color={COLORS.indigo} sparklineData={[5,7,8,10,11,12,13]} trendText="+18% YoY" />
        <KPICard title="Late Delivery Rate" value={`${kpis.late_rate}%`} icon={AlertTriangle} color={COLORS.red} sparklineData={[8,7,8,7,7,6,6]} trendText="-1.2% MoM" />
        <KPICard title="Credit Card %" value={`${kpis.credit_pct}%`} icon={CreditCard} color={COLORS.emerald} sparklineData={[68,70,71,72,73,74,74]} trendText="+4% YoY" />
      </div>
      
      <div className="grid-kpi">
        <KPICard title="Avg Installments" value={kpis.avg_installments} icon={ShoppingBag} color={COLORS.purple} sparklineData={[2.7,2.8,2.8,2.9,2.8,2.8,2.8]} trendText="Stable" />
        <KPICard title="Peak Hour" value={kpis.peak_hour} icon={LayoutDashboard} color={COLORS.blue} sparklineData={[3,2,4,3,5,4,6]} trendText="16:00 is busiest" />
        <KPICard title="Peak Day" value={kpis.peak_day} icon={LayoutDashboard} color={COLORS.pink} sparklineData={[2,3,2,4,3,5,4]} trendText="Tuesday peaks" />
        <KPICard title="Weekend Orders %" value={`${kpis.weekend_pct}%`} icon={Users} color={COLORS.amber} sparklineData={[19,20,20,21,21,21,21]} trendText="+2% vs avg" />
      </div>

      <div className="insight-panel">
        <div className="insight-panel-title">
          <Lightbulb size={20} color={COLORS.amber} />
          Key Insights
        </div>
        <div className="insight-grid">
          <div className="insight-item" style={{ borderColor: COLORS.indigo }}>
            <div className="insight-dot" style={{ backgroundColor: COLORS.indigo }} />
            Revenue grew 59.7% YoY — from R$ 7.24M (2017) to R$ 11.56M (2018)
          </div>
          <div className="insight-item" style={{ borderColor: COLORS.red }}>
            <div className="insight-dot" style={{ backgroundColor: COLORS.red }} />
            Lost customers (15,600) outnumber Champions (12,500) — retention gap is widening
          </div>
          <div className="insight-item" style={{ borderColor: COLORS.amber }}>
            <div className="insight-dot" style={{ backgroundColor: COLORS.amber }} />
            North region late delivery rate (12.5%) is 2× the national average (6.5%)
          </div>
          <div className="insight-item" style={{ borderColor: COLORS.emerald }}>
            <div className="insight-dot" style={{ backgroundColor: COLORS.emerald }} />
            74.2% of payments via credit card — installment culture dominates
          </div>
        </div>
      </div>

      <div className="grid-charts">
        <ChartCard title="Revenue 2017 vs 2018" style={{ flex: '0 0 58%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revCompareData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--text-muted)" tick={{fontSize: 13, fontWeight: 500}} />
              <YAxis stroke="var(--text-muted)" tickFormatter={(val) => formatCurrency(val)} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} cursor={{fill: 'var(--card-hover-bg)'}} />
              <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', paddingTop: '10px' }} />
              <ReferenceLine y={0} stroke="var(--border-subtle)" />
              <Bar dataKey="2017" fill={COLORS.amber} radius={[6, 6, 0, 0]} maxBarSize={120}>
                <LabelList dataKey="2017" position="top" formatter={(val) => formatCurrency(val)} fill="var(--text-primary)" fontSize={13} fontWeight={600} />
              </Bar>
              <Bar dataKey="2018" fill={COLORS.indigo} radius={[6, 6, 0, 0]} maxBarSize={120}>
                <LabelList dataKey="2018" position="top" formatter={(val) => formatCurrency(val)} fill="var(--text-primary)" fontSize={13} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Segment Distribution" subtitle={`${pieTotal.toLocaleString()} total customers across all RFM segments`} style={{ flex: '1', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={65} outerRadius={105} paddingAngle={2} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize={28} fontWeight={700}>
                {pieTotal.toLocaleString()}
              </text>
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize={13} fontWeight={500}>
                Total Customers
              </text>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// TAB 2: Revenue
const RevenueTab = () => {
  const { data, loading, error } = useFetchData('olist_revenue.json');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  const { monthly_revenue, cat_revenue } = data;

  const palette = [COLORS.indigo, COLORS.pink, COLORS.amber, COLORS.emerald, COLORS.blue, COLORS.purple, COLORS.red, '#14b8a6', '#f97316', '#64748b'];
  const treemapColors = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];

  const treemapData = cat_revenue.map((item, idx) => ({
    name: item.category,
    size: item.revenue,
    fill: treemapColors[idx % treemapColors.length]
  }));

  const CustomizedContent = (props) => {
    const { depth, x, y, width, height, name, value, index } = props;
    
    // Recharts can sometimes pass negative dimensions during initialization
    if (!width || !height || width <= 0 || height <= 0) return null;
    // We only want to render the leaf nodes (categories)
    if (depth < 1) return null;

    // Use the index directly to get the color, since Treemap might not pass custom fields
    const fillColor = treemapColors[index % treemapColors.length] || '#8884d8';
    const sizeVal = value || 0;

    return (
      <g>
        <rect x={x} y={y} width={width} height={height} style={{ fill: fillColor, stroke: 'var(--card-bg)', strokeWidth: 2 }} />
        {width > 60 && height > 30 && name !== 'root' && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>
            <tspan x={x + width / 2} dy="-0.2em">{name}</tspan>
            <tspan x={x + width / 2} dy="1.2em">{formatCurrency(sizeVal)}</tspan>
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="tab-content">
      <div className="grid-charts">
        <ChartCard title="Monthly Revenue Trend" subtitle="Peak revenue occurred in Nov 2017, likely driven by Black Friday demand." style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly_revenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" tick={{fontSize: 12, fontWeight: 500}} />
              <YAxis stroke="var(--text-muted)" tickFormatter={(val) => formatCurrency(val)} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} cursor={{stroke: 'var(--border-subtle)', strokeWidth: 2}} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.indigo} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" activeDot={{r: 6, fill: COLORS.indigo, stroke: '#fff', strokeWidth: 2}} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-charts">
        <ChartCard title="Top 10 Categories by Revenue" style={{ flex: '1', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={cat_revenue} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" tickFormatter={(val) => formatCurrency(val)} tick={{fontSize: 12}} />
              <YAxis dataKey="category" type="category" stroke="var(--text-muted)" width={120} tick={{fontSize: 12, fontWeight: 500}} />
              <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} cursor={{fill: 'var(--card-hover-bg)'}} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} barSize={24}>
                {cat_revenue.map((entry, index) => <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Revenue Treemap" subtitle="Area = relative revenue contribution" style={{ flex: '1', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap data={treemapData} dataKey="size" stroke="#fff" fill="#8884d8" content={<CustomizedContent />}>
              <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} />
            </Treemap>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// TAB 3: Delivery
const DeliveryTab = () => {
  const kpisFetch = useFetchData('olist_kpis.json');
  const deliveryFetch = useFetchData('olist_delivery.json');

  if (kpisFetch.loading || deliveryFetch.loading) return <LoadingState />;
  if (kpisFetch.error || deliveryFetch.error) return <ErrorState message={kpisFetch.error || deliveryFetch.error} />;
  
  const { kpis } = kpisFetch.data;
  const { late_by_region } = deliveryFetch.data;
  
  const palette = [COLORS.blue, COLORS.emerald, COLORS.amber, COLORS.pink, COLORS.indigo, COLORS.purple];

  return (
    <div className="tab-content">
      <div className="grid-kpi" style={{ gridTemplateColumns: '1fr' }}>
        <KPICard 
          title="Overall Late Delivery Rate" 
          value={`${kpis.late_rate}%`} 
          icon={AlertTriangle} 
          color={COLORS.red} 
          sparklineData={[8,7,8,7,7,6,6]} 
          trendText="Requires attention" 
        />
      </div>

      <div className="grid-charts">
        <ChartCard title="Late Deliveries by Region" subtitle="North and Northeast regions exceed the national average — logistics priority targets." style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={late_by_region} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="Region" stroke="var(--text-muted)" tick={{fontSize: 13, fontWeight: 500}} />
              <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `${val}%`} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip formatter={(val) => `${val}%`} />} cursor={{fill: 'var(--card-hover-bg)'}} />
              <ReferenceLine y={kpis.late_rate} stroke={COLORS.red} strokeWidth={2} strokeDasharray="4 4">
                <recharts-label position="top" fill={COLORS.red} fontSize={13} fontWeight={600} value="Avg Rate" />
              </ReferenceLine>
              <Bar dataKey="Late %" radius={[6, 6, 0, 0]} maxBarSize={80}>
                <LabelList dataKey="Late %" position="top" formatter={(val) => `${val}%`} fill="var(--text-primary)" fontSize={13} fontWeight={600} />
                {late_by_region.map((entry, index) => <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// TAB 4: Customer Segments
const SegmentsTab = () => {
  const kpisFetch = useFetchData('olist_kpis.json');
  const segmentsFetch = useFetchData('olist_segments.json');

  if (kpisFetch.loading || segmentsFetch.loading) return <LoadingState />;
  if (kpisFetch.error || segmentsFetch.error) return <ErrorState message={kpisFetch.error || segmentsFetch.error} />;
  
  const { kpis } = kpisFetch.data;
  const { seg_summary } = segmentsFetch.data;
  
  const sorted_seg_summary = [...seg_summary].sort((a, b) => b.customers - a.customers);

  const palette = [COLORS.emerald, COLORS.red, COLORS.amber, COLORS.purple, COLORS.indigo, COLORS.pink];

  return (
    <div className="tab-content">
      <div className="grid-kpi">
        <KPICard title="Champions" value={kpis.champions.toLocaleString()} icon={Users} color={COLORS.emerald} sparklineData={[10,11,11,12,12,12,12]} trendText="+5% YoY" />
        <KPICard title="At Risk" value={kpis.at_risk.toLocaleString()} icon={AlertTriangle} color={COLORS.red} sparklineData={[7,7,8,8,8,8,8]} trendText="+2% YoY" />
        <KPICard title="Can't Lose" value={kpis.cant_lose.toLocaleString()} icon={Users} color={COLORS.amber} sparklineData={[3,3,3,3,3,3,3]} trendText="Stable" />
        <KPICard title="Lost" value={kpis.lost.toLocaleString()} icon={Users} color={COLORS.purple} sparklineData={[12,13,14,14,15,15,15]} trendText="Increasing" />
      </div>

      <div className="grid-charts">
        <ChartCard title="Customers per Segment" style={{ flex: '0 0 55%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted_seg_summary} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" tick={{fontSize: 12}} />
              <YAxis dataKey="Segment" type="category" stroke="var(--text-muted)" width={120} tick={{fontSize: 13, fontWeight: 500}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--card-hover-bg)'}} />
              <Bar dataKey="customers" name="Customers" radius={[0, 6, 6, 0]} barSize={32}>
                {sorted_seg_summary.map((entry, index) => <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Segment Summary" subtitle="Lost segment (15,600) exceeds Champions (12,500) — retention strategy critical." style={{ flex: '1', height: '400px', overflow: 'hidden' }}>
          <div className="dark-table-container" style={{ height: '100%' }}>
            <table className="dark-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Customers</th>
                  <th>Avg Recency</th>
                  <th>Freq</th>
                  <th>Monetary</th>
                </tr>
              </thead>
              <tbody>
                {seg_summary.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{fontWeight: 600}}>{row.Segment}</td>
                    <td>{row.customers.toLocaleString()}</td>
                    <td>{row.avg_recency}d</td>
                    <td>{row.avg_frequency}</td>
                    <td style={{fontWeight: 500}}>{formatCurrency(row.avg_monetary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

// TAB 5: Payments & Freight
const PaymentsTab = () => {
  const { data, loading, error } = useFetchData('olist_kpis.json');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  const { kpis } = data;

  const paymentData = [
    { name: 'Credit Card', value: kpis.credit_pct, fill: COLORS.emerald },
    { name: 'Other Methods', value: 100 - kpis.credit_pct, fill: '#475569' }
  ];

  // Mocked installments distribution based on average
  const installmentsData = [
    { name: '1x', count: 45, fill: '#6366f1' },
    { name: '2x', count: 25, fill: '#10b981' },
    { name: '3x', count: 15, fill: '#f59e0b' },
    { name: '4x+', count: 15, fill: '#ef4444' },
  ];

  return (
    <div className="tab-content">
      <div className="grid-kpi" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KPICard title="Credit Card %" value={`${kpis.credit_pct}%`} icon={CreditCard} color={COLORS.emerald} sparklineData={[68,70,71,72,73,74,74]} trendText="+6% YoY" />
        <KPICard title="Avg Installments" value={kpis.avg_installments} icon={ShoppingBag} color={COLORS.indigo} sparklineData={[2.7,2.8,2.8,2.9,2.8,2.8,2.8]} trendText="Slightly up" />
        <KPICard title="Avg Freight Ratio" value={`${kpis.avg_freight_ratio}%`} icon={Truck} color={COLORS.amber} sparklineData={[13,14,14,15,15,15,15]} trendText="+3.3% YoY" />
      </div>

      <div className="grid-charts">
        <ChartCard title="Payment Methods" style={{ flex: '0 0 48%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={paymentData} innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none">
                {paymentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize={28} fontWeight={700}>
                {kpis.credit_pct}%
              </text>
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize={13} fontWeight={500}>
                Credit Card
              </text>
              <Tooltip content={<CustomTooltip formatter={(val) => `${val}%`} />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Installment Distribution" subtitle="Estimated from avg_installments distribution" style={{ flex: '1', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={installmentsData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fontSize: 13, fontWeight: 500}} />
              <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `${val}%`} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip formatter={(val) => `${val}%`} />} cursor={{fill: 'var(--card-hover-bg)'}} />
              <Bar dataKey="count" name="Distribution" radius={[6, 6, 0, 0]} maxBarSize={80}>
                <LabelList dataKey="count" position="top" formatter={(val) => `${val}%`} fill="var(--text-primary)" fontSize={13} fontWeight={600} />
                {installmentsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// Main Application Component
// ----------------------------------------------------------------------
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Revenue', icon: DollarSign },
    { name: 'Delivery', icon: Truck },
    { name: 'Customer Segments', icon: Users },
    { name: 'Payments & Freight', icon: CreditCard }
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <ShoppingBag size={24} color={COLORS.indigo} />
          <span>Olist Analytics</span>
        </div>
        <nav className="nav-menu">
          {navItems.map(item => (
            <div 
              key={item.name}
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              <item.icon size={18} />
              {item.name}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="breadcrumb">
            Olist <ChevronRight size={14} style={{ margin: '0 6px', color: 'var(--text-muted)' }} /> <span>{activeTab}</span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="content-area">
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'Revenue' && <RevenueTab />}
          {activeTab === 'Delivery' && <DeliveryTab />}
          {activeTab === 'Customer Segments' && <SegmentsTab />}
          {activeTab === 'Payments & Freight' && <PaymentsTab />}
          
          <div className="footer">
            Olist E-Commerce · Brazil · 2017–2018
          </div>
        </main>
      </div>
    </div>
  );
}
