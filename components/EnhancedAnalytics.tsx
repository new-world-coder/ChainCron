'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Zap,
  Shield,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock data for comprehensive analytics
const mockAnalyticsData = {
  portfolioOverview: {
    totalValueManaged: 125000,
    totalEarnings: 18750,
    activeWorkflows: 8,
    successRate: 97.8,
    comparisonSavings: 12500, // vs manual execution
  },
  
  earningsOverTime: [
    { date: '2024-01', earnings: 1200, manual: 800 },
    { date: '2024-02', earnings: 1450, manual: 950 },
    { date: '2024-03', earnings: 1680, manual: 1100 },
    { date: '2024-04', earnings: 1920, manual: 1250 },
    { date: '2024-05', earnings: 2100, manual: 1400 },
    { date: '2024-06', earnings: 2350, manual: 1550 },
  ],
  
  earningsByWorkflow: [
    { name: 'Auto-Compound', earnings: 8500, executions: 124, avgGas: 0.002 },
    { name: 'Portfolio Rebalancer', earnings: 4200, executions: 89, avgGas: 0.003 },
    { name: 'Price Alert Trader', earnings: 3200, executions: 156, avgGas: 0.0015 },
    { name: 'DCA Strategy', earnings: 2100, executions: 78, avgGas: 0.0018 },
    { name: 'Liquidation Protection', earnings: 750, executions: 12, avgGas: 0.004 },
  ],
  
  assetAllocation: [
    { name: 'ETH', value: 45000, percentage: 36 },
    { name: 'USDC', value: 35000, percentage: 28 },
    { name: 'WBTC', value: 25000, percentage: 20 },
    { name: 'Other Tokens', value: 20000, percentage: 16 },
  ],
  
  gasFeesSaved: [
    { date: '2024-01', saved: 120, manual: 180 },
    { date: '2024-02', saved: 135, manual: 200 },
    { date: '2024-03', saved: 150, manual: 220 },
    { date: '2024-04', saved: 165, manual: 240 },
    { date: '2024-05', saved: 180, manual: 260 },
    { date: '2024-06', saved: 195, manual: 280 },
  ],
  
  executionHeatmap: [
    { hour: 0, executions: 12, success: 11 },
    { hour: 1, executions: 8, success: 8 },
    { hour: 2, executions: 15, success: 14 },
    { hour: 3, executions: 6, success: 6 },
    { hour: 4, executions: 9, success: 9 },
    { hour: 5, executions: 11, success: 10 },
    { hour: 6, executions: 18, success: 17 },
    { hour: 7, executions: 22, success: 21 },
    { hour: 8, executions: 25, success: 24 },
    { hour: 9, executions: 28, success: 27 },
    { hour: 10, executions: 31, success: 30 },
    { hour: 11, executions: 35, success: 34 },
    { hour: 12, executions: 38, success: 37 },
    { hour: 13, executions: 42, success: 41 },
    { hour: 14, executions: 45, success: 44 },
    { hour: 15, executions: 48, success: 47 },
    { hour: 16, executions: 52, success: 51 },
    { hour: 17, executions: 55, success: 54 },
    { hour: 18, executions: 58, success: 57 },
    { hour: 19, executions: 61, success: 60 },
    { hour: 20, executions: 45, success: 44 },
    { hour: 21, executions: 38, success: 37 },
    { hour: 22, executions: 25, success: 24 },
    { hour: 23, executions: 18, success: 17 },
  ],
  
  executionTimeline: [
    {
      id: 1,
      timestamp: '2024-06-15 14:30:25',
      workflow: 'Auto-Compound',
      action: 'Compound USDC rewards',
      result: 'Success',
      profit: 45.2,
      txHash: '0x1234...5678',
      gasUsed: 0.0021,
    },
    {
      id: 2,
      timestamp: '2024-06-15 14:15:10',
      workflow: 'Price Alert',
      action: 'Swap ETH to USDC',
      result: 'Success',
      profit: 12.8,
      txHash: '0x2345...6789',
      gasUsed: 0.0018,
    },
    {
      id: 3,
      timestamp: '2024-06-15 13:45:33',
      workflow: 'Portfolio Rebalancer',
      action: 'Rebalance to target allocation',
      result: 'Success',
      profit: 8.5,
      txHash: '0x3456...7890',
      gasUsed: 0.0032,
    },
    {
      id: 4,
      timestamp: '2024-06-15 13:20:15',
      workflow: 'DCA Strategy',
      action: 'Buy ETH with USDC',
      result: 'Success',
      profit: 5.2,
      txHash: '0x4567...8901',
      gasUsed: 0.0015,
    },
    {
      id: 5,
      timestamp: '2024-06-15 12:55:42',
      workflow: 'Auto-Compound',
      action: 'Compound WBTC rewards',
      result: 'Failed',
      profit: 0,
      txHash: '0x5678...9012',
      gasUsed: 0.0025,
      error: 'Insufficient gas',
    },
  ],
  
  predictiveAnalytics: {
    projectedAnnualYield: 15.2,
    optimalExecutionTime: '2:00 AM UTC',
    marketConditionAlert: 'High volatility detected - consider pausing rebalancer',
    projectedEarnings: {
      nextMonth: 2500,
      nextQuarter: 7500,
      nextYear: 30000,
    },
  },
  
  comparisonData: {
    vsBenchmark: {
      portfolio: 12.5,
      eth: 8.2,
      sp500: 6.8,
    },
    vsManual: {
      automated: 15.2,
      manual: 8.7,
      improvement: 74.7,
    },
    gasComparison: {
      automated: 0.0021,
      manual: 0.0038,
      savings: 44.7,
    },
  },
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function EnhancedAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6M')
  const [selectedWorkflow, setSelectedWorkflow] = useState('all')
  const [showPredictive, setShowPredictive] = useState(true)
  const [exportFormat, setExportFormat] = useState('pdf')

  const filteredData = useMemo(() => {
    // Filter data based on selected time range and workflow
    return mockAnalyticsData
  }, [selectedTimeRange, selectedWorkflow])

  const handleExportReport = (type: string) => {
    console.log(`Exporting ${type} report in ${exportFormat} format`)
    // In a real app, this would generate and download the report
  }

  const handleShareReport = () => {
    console.log('Sharing analytics report')
    // In a real app, this would generate a shareable link
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                ${filteredData.portfolioOverview.totalValueManaged.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Total Value Managed</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ${filteredData.portfolioOverview.totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Earnings</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {filteredData.portfolioOverview.activeWorkflows}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Active Workflows</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {filteredData.portfolioOverview.successRate}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Success Rate</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Savings vs Manual Execution</h4>
                <p className="text-sm text-muted-foreground">
                  You've saved ${filteredData.portfolioOverview.comparisonSavings.toLocaleString()} compared to manual execution
                </p>
              </div>
              <Badge variant="secondary" className="text-green-600">
                +{Math.round((filteredData.portfolioOverview.comparisonSavings / filteredData.portfolioOverview.totalEarnings) * 100)}% Efficiency
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Earnings Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData.earningsOverTime}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="earnings" stroke="#8884d8" fillOpacity={1} fill="url(#colorEarnings)" name="Automated" />
                  <Area type="monotone" dataKey="manual" stroke="#82ca9d" fillOpacity={1} fill="url(#colorManual)" name="Manual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Earnings by Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Earnings by Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData.earningsByWorkflow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation & Gas Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData.assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredData.assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gas Fees Saved */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Gas Fees Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData.gasFeesSaved}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="saved" stroke="#8884d8" name="Automated" />
                  <Line type="monotone" dataKey="manual" stroke="#82ca9d" name="Manual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Execution Heatmap - Best Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.executionHeatmap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="executions" fill="#8884d8" name="Total Executions" />
                <Bar dataKey="success" fill="#82ca9d" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <Info className="w-4 h-4 inline mr-1" />
            Peak execution times are 10 AM - 6 PM UTC with highest success rates
          </div>
        </CardContent>
      </Card>

      {/* Execution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.executionTimeline.map((execution) => (
              <div key={execution.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  execution.result === 'Success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{execution.workflow}</span>
                    <Badge variant={execution.result === 'Success' ? 'default' : 'destructive'}>
                      {execution.result}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{execution.action}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {execution.profit > 0 ? `+$${execution.profit}` : '$0'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {execution.gasUsed} ETH gas
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      {showPredictive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {filteredData.predictiveAnalytics.projectedAnnualYield}%
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Projected Annual Yield</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {filteredData.predictiveAnalytics.optimalExecutionTime}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Optimal Execution Time</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  ${filteredData.predictiveAnalytics.projectedEarnings.nextMonth.toLocaleString()}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Next Month Projection</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  Market Alert
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  High volatility detected
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">Market Condition Alert</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {filteredData.predictiveAnalytics.marketConditionAlert}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {filteredData.comparisonData.vsBenchmark.portfolio}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">vs ETH ({filteredData.comparisonData.vsBenchmark.eth}%)</div>
              <div className="text-xs text-muted-foreground mt-1">Portfolio Performance</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                +{filteredData.comparisonData.vsManual.improvement}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">vs Manual Execution</div>
              <div className="text-xs text-muted-foreground mt-1">Efficiency Improvement</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {filteredData.comparisonData.gasComparison.savings}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Gas Savings</div>
              <div className="text-xs text-muted-foreground mt-1">vs Manual Execution</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Share */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export & Share Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Generate Reports</h4>
              <div className="space-y-2">
                <Button onClick={() => handleExportReport('performance')} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Performance Report (PDF)
                </Button>
                <Button onClick={() => handleExportReport('risk')} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Risk Assessment (CSV)
                </Button>
                <Button onClick={() => handleExportReport('earnings')} className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Earnings Summary (Excel)
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Share Analytics</h4>
              <div className="space-y-2">
                <Button onClick={handleShareReport} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Shareable Link
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Weekly Reports
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Auto-Export to Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
