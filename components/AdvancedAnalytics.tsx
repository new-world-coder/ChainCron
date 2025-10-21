'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Users, 
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts'

interface AnalyticsData {
  totalValue: number
  totalEarnings: number
  activeWorkflows: number
  totalExecutions: number
  successRate: number
  avgROI: number
  gasSaved: number
  monthlyGrowth: number
  riskScore: number
  efficiency: number
}

interface PerformanceMetrics {
  executions: number
  successRate: number
  avgGasUsed: number
  totalEarnings: number
  topWorkflows: Array<{
    id: number
    name: string
    executions: number
    earnings: number
  }>
}

interface RiskAnalysis {
  overallRisk: 'low' | 'medium' | 'high'
  riskFactors: Array<{
    factor: string
    level: 'low' | 'medium' | 'high'
    impact: number
    description: string
  }>
  recommendations: string[]
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'predictions'>('overview')
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    totalValue: 125000,
    totalEarnings: 8750,
    activeWorkflows: 8,
    totalExecutions: 1247,
    successRate: 97.8,
    avgROI: 12.5,
    gasSaved: 1250,
    monthlyGrowth: 8.2,
    riskScore: 3.2,
    efficiency: 94.5
  }

  const mockPerformanceMetrics: PerformanceMetrics = {
    executions: 1247,
    successRate: 97.8,
    avgGasUsed: 185000,
    totalEarnings: 8750,
    topWorkflows: [
      { id: 1, name: 'Auto-Compound DeFi Yield', executions: 456, earnings: 3250 },
      { id: 2, name: 'Portfolio Rebalancer', executions: 234, earnings: 2100 },
      { id: 3, name: 'Price Alert + Auto-Swap', executions: 567, earnings: 1800 },
      { id: 4, name: 'DCA Bitcoin Strategy', executions: 67, earnings: 950 },
      { id: 5, name: 'Yield Farming Optimizer', executions: 45, earnings: 650 }
    ]
  }

  const mockRiskAnalysis: RiskAnalysis = {
    overallRisk: 'low',
    riskFactors: [
      {
        factor: 'Smart Contract Risk',
        level: 'low',
        impact: 15,
        description: 'All contracts are audited and use battle-tested libraries'
      },
      {
        factor: 'Market Volatility',
        level: 'medium',
        impact: 25,
        description: 'Current market conditions show moderate volatility'
      },
      {
        factor: 'Gas Price Risk',
        level: 'low',
        impact: 10,
        description: 'Gas prices are within normal ranges'
      },
      {
        factor: 'Liquidation Risk',
        level: 'low',
        impact: 5,
        description: 'No leveraged positions detected'
      },
      {
        factor: 'Slippage Risk',
        level: 'medium',
        impact: 20,
        description: 'Some trading workflows may experience slippage'
      }
    ],
    recommendations: [
      'Consider diversifying across more protocols to reduce concentration risk',
      'Monitor gas prices and adjust execution timing for cost optimization',
      'Set up additional price alerts for volatile assets',
      'Review and update risk parameters monthly'
    ]
  }

  // Mock performance data
  const performanceData = [
    { date: '2024-01-01', earnings: 1000, executions: 50, gasUsed: 5000000, roi: 8.5 },
    { date: '2024-01-15', earnings: 1250, executions: 75, gasUsed: 6000000, roi: 9.2 },
    { date: '2024-02-01', earnings: 1500, executions: 100, gasUsed: 7000000, roi: 10.1 },
    { date: '2024-02-15', earnings: 1750, executions: 125, gasUsed: 8000000, roi: 11.3 },
    { date: '2024-03-01', earnings: 2000, executions: 150, gasUsed: 9000000, roi: 12.1 },
    { date: '2024-03-15', earnings: 2250, executions: 175, gasUsed: 10000000, roi: 12.8 },
    { date: '2024-04-01', earnings: 2500, executions: 200, gasUsed: 11000000, roi: 13.2 },
    { date: '2024-04-15', earnings: 2750, executions: 225, gasUsed: 12000000, roi: 13.8 },
    { date: '2024-05-01', earnings: 3000, executions: 250, gasUsed: 13000000, roi: 14.1 },
    { date: '2024-05-15', earnings: 3250, executions: 275, gasUsed: 14000000, roi: 14.5 },
    { date: '2024-06-01', earnings: 3500, executions: 300, gasUsed: 15000000, roi: 14.8 },
    { date: '2024-06-15', earnings: 3750, executions: 325, gasUsed: 16000000, roi: 15.2 }
  ]

  const riskData = [
    { factor: 'Smart Contract', value: 15, color: '#10B981' },
    { factor: 'Market Volatility', value: 25, color: '#F59E0B' },
    { factor: 'Gas Price', value: 10, color: '#10B981' },
    { factor: 'Liquidation', value: 5, color: '#10B981' },
    { factor: 'Slippage', value: 20, color: '#F59E0B' }
  ]

  const efficiencyData = [
    { metric: 'Gas Efficiency', value: 94.5, target: 90 },
    { metric: 'Success Rate', value: 97.8, target: 95 },
    { metric: 'ROI', value: 12.5, target: 10 },
    { metric: 'Execution Speed', value: 88.2, target: 85 }
  ]

  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData)
      setPerformanceMetrics(mockPerformanceMetrics)
      setRiskAnalysis(mockRiskAnalysis)
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'risk', label: 'Risk Analysis', icon: '⚠️' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg font-semibold">Loading analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <p className="text-muted-foreground">Comprehensive insights into your automation performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <motion.button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </motion.button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(analyticsData?.totalValue || 0)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{analyticsData?.monthlyGrowth || 0}% this month
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData?.totalEarnings || 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              {analyticsData?.avgROI || 0}% avg ROI
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData?.efficiency || 0}%
            </div>
            <div className="text-sm text-muted-foreground">
              Gas & execution efficiency
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Risk Score</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData?.riskScore || 0}/10
            </div>
            <div className="text-sm text-muted-foreground">
              Overall risk assessment
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass rounded-xl p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Performance Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'earnings' ? formatCurrency(Number(value)) : Number(value).toLocaleString(),
                        name === 'earnings' ? 'Earnings' : name === 'executions' ? 'Executions' : 'ROI'
                      ]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="earnings" 
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="roi" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Efficiency Metrics</h3>
              <div className="space-y-4">
                {efficiencyData.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.value}% / {metric.target}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Workflows */}
            <div className="glass rounded-xl p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Top Performing Workflows</h3>
              <div className="space-y-3">
                {performanceMetrics?.topWorkflows.map((workflow, index) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.executions} executions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(workflow.earnings)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((workflow.earnings / workflow.executions) * 100).toFixed(2)}% avg ROI
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Execution Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={performanceData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), 'Executions']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Bar dataKey="executions" fill="#3B82F6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Gas Usage Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={performanceData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), 'Gas Used']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gasUsed" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Risk Factors</h3>
                <div className="space-y-4">
                  {riskAnalysis?.riskFactors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{factor.factor}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(factor.level)}`}>
                          {factor.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            factor.level === 'low' ? 'bg-green-500' :
                            factor.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${factor.impact}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Risk Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ factor, value }) => `${factor}: ${value}%`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Risk Recommendations</h3>
              <div className="space-y-3">
                {riskAnalysis?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Earnings Forecast</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Earnings']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Predictions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <h4 className="font-semibold text-green-800">Next 30 Days</h4>
                    <p className="text-sm text-green-700">
                      Expected earnings: {formatCurrency(3500)} (+15% growth)
                    </p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Next Quarter</h4>
                    <p className="text-sm text-blue-700">
                      Projected ROI: 18.5% (based on current trends)
                    </p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Risk Outlook</h4>
                    <p className="text-sm text-purple-700">
                      Low risk profile maintained with current strategies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
