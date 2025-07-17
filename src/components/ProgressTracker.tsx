import React, { useState } from 'react';
import { TrendingUp, Target, Calendar, Award, Plus, BarChart3, LineChart } from 'lucide-react';
import { ProgressMetric } from '../types';

const ProgressTracker: React.FC = () => {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([
    { id: '1', date: '2024-01-10', metric: 'Free Throw %', value: 75, unit: '%' },
    { id: '2', date: '2024-01-11', metric: 'Free Throw %', value: 78, unit: '%' },
    { id: '3', date: '2024-01-12', metric: 'Free Throw %', value: 82, unit: '%' },
    { id: '4', date: '2024-01-10', metric: 'Sprint Time', value: 5.2, unit: 'sec' },
    { id: '5', date: '2024-01-11', metric: 'Sprint Time', value: 5.0, unit: 'sec' },
    { id: '6', date: '2024-01-12', metric: 'Sprint Time', value: 4.8, unit: 'sec' },
    { id: '7', date: '2024-01-10', metric: 'Vertical Jump', value: 28, unit: 'in' },
    { id: '8', date: '2024-01-11', metric: 'Vertical Jump', value: 29, unit: 'in' },
    { id: '9', date: '2024-01-12', metric: 'Vertical Jump', value: 30, unit: 'in' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMetric, setNewMetric] = useState({
    date: '',
    metric: '',
    value: 0,
    unit: ''
  });

  const [selectedMetric, setSelectedMetric] = useState<string>('Free Throw %');

  const metricTypes = [
    { name: 'Free Throw %', unit: '%', color: 'bg-blue-500', icon: Target },
    { name: 'Sprint Time', unit: 'sec', color: 'bg-red-500', icon: TrendingUp },
    { name: 'Vertical Jump', unit: 'in', color: 'bg-green-500', icon: Award },
    { name: '3-Point %', unit: '%', color: 'bg-purple-500', icon: Target }
  ];

  const handleAddMetric = () => {
    if (newMetric.date && newMetric.metric && newMetric.value) {
      const metric: ProgressMetric = {
        id: Date.now().toString(),
        date: newMetric.date,
        metric: newMetric.metric,
        value: newMetric.value,
        unit: newMetric.unit
      };
      setMetrics([...metrics, metric]);
      setNewMetric({ date: '', metric: '', value: 0, unit: '' });
      setShowAddForm(false);
    }
  };

  const getMetricData = (metricName: string) => {
    return metrics
      .filter(m => m.metric === metricName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getLatestValue = (metricName: string) => {
    const data = getMetricData(metricName);
    return data.length > 0 ? data[data.length - 1].value : 0;
  };

  const getImprovement = (metricName: string) => {
    const data = getMetricData(metricName);
    if (data.length < 2) return 0;
    
    const first = data[0].value;
    const latest = data[data.length - 1].value;
    
    // For metrics where lower is better (like sprint time)
    if (metricName === 'Sprint Time') {
      return ((first - latest) / first) * 100;
    }
    // For metrics where higher is better
    return ((latest - first) / first) * 100;
  };

  const selectedMetricData = getMetricData(selectedMetric);
  const selectedMetricConfig = metricTypes.find(m => m.name === selectedMetric);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracker</h2>
          <p className="text-gray-600">Monitor your basketball performance and track improvements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Metric</span>
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricTypes.map((metric) => {
          const Icon = metric.icon;
          const latestValue = getLatestValue(metric.name);
          const improvement = getImprovement(metric.name);
          const hasData = getMetricData(metric.name).length > 0;

          return (
            <div
              key={metric.name}
              onClick={() => setSelectedMetric(metric.name)}
              className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all ${
                selectedMetric === metric.name
                  ? 'border-orange-500 ring-2 ring-orange-100'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color} text-white`}>
                  <Icon size={24} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {hasData ? `${latestValue}${metric.unit}` : '--'}
                  </div>
                  {hasData && (
                    <div className={`text-sm ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">{metric.name}</div>
            </div>
          );
        })}
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${selectedMetricConfig?.color} text-white`}>
              <LineChart size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedMetric} Progress</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>Last 30 days</span>
          </div>
        </div>

        {selectedMetricData.length > 0 ? (
          <div className="space-y-4">
            {/* Simple Progress Visualization */}
            <div className="relative h-64 border border-gray-200 rounded-lg p-4">
              <div className="absolute inset-4 flex items-end justify-between">
                {selectedMetricData.map((data, index) => {
                  const maxValue = Math.max(...selectedMetricData.map(d => d.value));
                  const minValue = Math.min(...selectedMetricData.map(d => d.value));
                  const range = maxValue - minValue || 1;
                  const height = ((data.value - minValue) / range) * 100;
                  
                  return (
                    <div key={data.id} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-8 ${selectedMetricConfig?.color} rounded-t-md transition-all duration-300`}
                        style={{ height: `${Math.max(height, 10)}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 text-center">
                        <div className="font-medium">{data.value}{data.unit}</div>
                        <div>{new Date(data.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Current</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedMetricData[selectedMetricData.length - 1]?.value}
                  {selectedMetricData[selectedMetricData.length - 1]?.unit}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Best</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedMetric === 'Sprint Time' 
                    ? Math.min(...selectedMetricData.map(d => d.value))
                    : Math.max(...selectedMetricData.map(d => d.value))
                  }
                  {selectedMetricData[0]?.unit}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Improvement</div>
                <div className={`text-xl font-bold ${getImprovement(selectedMetric) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getImprovement(selectedMetric) >= 0 ? '+' : ''}{getImprovement(selectedMetric).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No data available for {selectedMetric}</p>
            <p className="text-sm text-gray-400">Add some metrics to see your progress</p>
          </div>
        )}
      </div>

      {/* Add Metric Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full m-4">
            <h3 className="text-xl font-semibold mb-4">Add Progress Metric</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newMetric.date}
                  onChange={(e) => setNewMetric({...newMetric, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                <select
                  value={newMetric.metric}
                  onChange={(e) => {
                    const selectedType = metricTypes.find(t => t.name === e.target.value);
                    setNewMetric({
                      ...newMetric, 
                      metric: e.target.value,
                      unit: selectedType?.unit || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a metric</option>
                  {metricTypes.map(type => (
                    <option key={type.name} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    value={newMetric.value || ''}
                    onChange={(e) => setNewMetric({...newMetric, value: parseFloat(e.target.value) || 0})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                    {newMetric.unit}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMetric}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Metric
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;