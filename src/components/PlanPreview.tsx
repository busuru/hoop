import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Dumbbell,
  Play,
  CheckCircle,
  Star,
  Download,
  Edit,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  BarChart3
} from 'lucide-react';
import { TrainingPlan, GeneratedSession } from '../services/planGenerator';

interface PlanPreviewProps {
  plan: TrainingPlan;
  onClose: () => void;
  onApply: (plan: TrainingPlan) => void;
  onEdit: () => void;
}

const PlanPreview: React.FC<PlanPreviewProps> = ({
  plan,
  onClose,
  onApply,
  onEdit
}) => {
  const [selectedSession, setSelectedSession] = useState<GeneratedSession | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'stats'>('list');
  const [currentWeek, setCurrentWeek] = useState(1);

  const weeks = Math.ceil(plan.sessions.length / plan.totalSessions * plan.duration);
  const sessionsPerWeek = plan.totalSessions / plan.duration;

  const getSessionsForWeek = (week: number) => {
    const startIndex = (week - 1) * sessionsPerWeek;
    const endIndex = startIndex + sessionsPerWeek;
    return plan.sessions.slice(startIndex, endIndex);
  };

  const getWeekSessions = () => {
    return getSessionsForWeek(currentWeek);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'skills': return <Target className="w-4 h-4" />;
      case 'strength': return <Dumbbell className="w-4 h-4" />;
      case 'conditioning': return <TrendingUp className="w-4 h-4" />;
      case 'mixed': return <Play className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const renderSessionCard = (session: GeneratedSession) => (
    <div 
      key={session.id}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors cursor-pointer"
      onClick={() => setSelectedSession(session)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getSessionTypeIcon(session.type)}
          <h4 className="font-semibold text-gray-800">{session.name}</h4>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getIntensityColor(session.intensity)}`}>
          {session.intensity}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(session.duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span>{session.focus}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Difficulty: {session.difficulty}/10</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>~{session.calories} calories</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{session.drills.length} drills</span>
          <span>{session.warmup.length + session.cooldown.length} warmup/cooldown</span>
        </div>
      </div>
    </div>
  );

  const renderSessionDetail = (session: GeneratedSession) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{session.name}</h3>
          <p className="text-gray-600">{session.description}</p>
        </div>
        <button
          onClick={() => setSelectedSession(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Duration</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{formatDuration(session.duration)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Difficulty</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{session.difficulty}/10</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Calories</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">~{session.calories}</p>
        </div>
      </div>

      {/* Warmup */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Warm-up ({session.warmup.length} exercises)</h4>
        <div className="space-y-2">
          {session.warmup.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{index + 1}. {exercise.name}</span>
              <span className="text-sm text-gray-600">{exercise.duration} min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Drills */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Main Workout ({session.drills.length} drills)</h4>
        <div className="space-y-3">
          {session.drills.map((drill, index) => (
            <div key={drill.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-semibold text-gray-800">{index + 1}. {drill.name}</h5>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getIntensityColor(session.intensity)}`}>
                  {drill.category}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Duration:</span> {drill.duration} min
                </div>
                {drill.sets && (
                  <div>
                    <span className="font-medium">Sets:</span> {drill.sets}
                  </div>
                )}
                {drill.reps && (
                  <div>
                    <span className="font-medium">Reps:</span> {drill.reps}
                  </div>
                )}
                {drill.restTime && (
                  <div>
                    <span className="font-medium">Rest:</span> {drill.restTime} min
                  </div>
                )}
              </div>
              {drill.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{drill.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cooldown */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Cool-down ({session.cooldown.length} exercises)</h4>
        <div className="space-y-2">
          {session.cooldown.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{index + 1}. {exercise.name}</span>
              <span className="text-sm text-gray-600">{exercise.duration} min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Tips</h4>
        <ul className="space-y-2">
          {session.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Week {currentWeek}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            disabled={currentWeek === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{currentWeek} of {weeks}</span>
          <button
            onClick={() => setCurrentWeek(Math.min(weeks, currentWeek + 1))}
            disabled={currentWeek === weeks}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 7 }, (_, i) => {
          const session = getWeekSessions()[i];
          const isRestDay = plan.restDays.includes(i + 1);
          
          return (
            <div key={i} className="min-h-[100px] p-2 border border-gray-200 rounded-lg">
              {isRestDay ? (
                <div className="text-center text-sm text-gray-400 py-4">
                  Rest Day
                </div>
              ) : session ? (
                <div 
                  className="cursor-pointer hover:bg-gray-50 rounded p-2"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="text-xs font-medium text-gray-800 mb-1">{session.name}</div>
                  <div className="text-xs text-gray-600">{formatDuration(session.duration)}</div>
                  <div className={`inline-block px-1 py-0.5 rounded text-xs mt-1 ${getIntensityColor(session.intensity)}`}>
                    {session.intensity}
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-300 py-4">
                  -
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStatsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{plan.totalSessions}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Total Duration</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatDuration(plan.sessions.reduce((total, s) => total + s.duration, 0))}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Difficulty</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{plan.difficulty}/10</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Session Type Distribution</h4>
        <div className="space-y-3">
          {Object.entries(
            plan.sessions.reduce((acc, session) => {
              acc[session.type] = (acc[session.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSessionTypeIcon(type)}
                <span className="font-medium capitalize">{type}</span>
              </div>
              <span className="text-sm text-gray-600">{count} sessions</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Goals</h4>
        <div className="flex flex-wrap gap-2">
          {plan.goals.map((goal, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {goal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
              <p className="text-gray-600">{plan.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Edit Plan"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'stats' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedSession ? (
            renderSessionDetail(selectedSession)
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {getWeekSessions().map(renderSessionCard)}
            </div>
          ) : viewMode === 'calendar' ? (
            renderCalendarView()
          ) : (
            renderStatsView()
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {plan.duration} weeks • {plan.totalSessions} sessions • {plan.progression} progression
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onApply(plan)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Apply to Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPreview; 