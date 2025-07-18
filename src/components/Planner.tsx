import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  Target, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Play,
  User,
  Wand2,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UserProfileModal from './UserProfileModal';
import PlanPreview from './PlanPreview';
import { planGenerator, UserProfile, TrainingPlan } from '../services/planGenerator';

interface PlannedSession {
  id: string;
  date: string;
  time: string;
  name: string;
  type: 'skills' | 'strength' | 'conditioning' | 'mixed';
  duration: number;
  drills: Array<{
    id: string;
    name: string;
    duration: number;
    category: string;
  }>;
  completed: boolean;
  notes?: string;
}

const Planner: React.FC = () => {
  const [sessions, setSessions] = useState<PlannedSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlanPreview, setShowPlanPreview] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [newSession, setNewSession] = useState({
    date: selectedDate,
    time: '09:00',
    name: '',
    type: 'skills' as const,
    duration: 60,
    drills: [] as string[],
    notes: ''
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('plannedSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    const savedProfile = localStorage.getItem('userTrainingProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('plannedSessions', JSON.stringify(sessions));
  }, [sessions]);

  const sessionTypes = [
    { id: 'skills', name: 'Skills Training', color: 'bg-blue-500' },
    { id: 'strength', name: 'Strength Training', color: 'bg-purple-500' },
    { id: 'conditioning', name: 'Conditioning', color: 'bg-red-500' },
    { id: 'mixed', name: 'Mixed Training', color: 'bg-green-500' }
  ];

  const getWeekDates = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => session.date === date);
  };

  const handleAddSession = () => {
    if (newSession.name) {
      const session: PlannedSession = {
        id: Date.now().toString(),
        date: newSession.date,
        time: newSession.time,
        name: newSession.name,
        type: newSession.type,
        duration: newSession.duration,
        drills: newSession.drills.map(drill => ({
          id: Date.now().toString() + Math.random(),
          name: drill,
          duration: 10,
          category: newSession.type
        })),
        completed: false,
        notes: newSession.notes
      };
      
      setSessions([...sessions, session]);
      setNewSession({
        date: selectedDate,
        time: '09:00',
        name: '',
        type: 'skills',
        duration: 60,
        drills: [],
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const toggleSessionComplete = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const getTypeColor = (type: string) => {
    const typeConfig = sessionTypes.find(t => t.id === type);
    return typeConfig?.color || 'bg-gray-500';
  };

  const handleGeneratePlan = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userTrainingProfile', JSON.stringify(profile));
    
    const plan = planGenerator.generateTrainingPlan(profile, 4);
    setGeneratedPlan(plan);
    setShowProfileModal(false);
    setShowPlanPreview(true);
  };

  const handleApplyPlan = (plan: TrainingPlan) => {
    // Convert generated sessions to planned sessions
    const newSessions: PlannedSession[] = plan.sessions.map((session, index) => {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + index);
      
      return {
        id: session.id,
        date: sessionDate.toISOString().split('T')[0],
        time: '09:00',
        name: session.name,
        type: session.type as any,
        duration: session.duration,
        drills: session.drills.map(drill => ({
          id: drill.id,
          name: drill.name,
          duration: drill.duration,
          category: drill.category
        })),
        completed: false,
        notes: session.description
      };
    });

    setSessions([...sessions, ...newSessions]);
    setShowPlanPreview(false);
    setGeneratedPlan(null);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same day
      const daysSessions = getSessionsForDate(source.droppableId);
      const reorderedSessions = Array.from(daysSessions);
      const [removed] = reorderedSessions.splice(source.index, 1);
      reorderedSessions.splice(destination.index, 0, removed);
      
      // Update the sessions array
      const otherSessions = sessions.filter(s => s.date !== source.droppableId);
      setSessions([...otherSessions, ...reorderedSessions]);
    } else {
      // Moving between different days
      const sourceSession = getSessionsForDate(source.droppableId)[source.index];
      const updatedSession = { ...sourceSession, date: destination.droppableId };
      
      const updatedSessions = sessions.map(session => 
        session.id === sourceSession.id ? updatedSession : session
      );
      
      setSessions(updatedSessions);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Planner</h2>
          <p className="text-gray-600">Plan and track your basketball training sessions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <Wand2 size={20} />
            <span>Generate Plan</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900">
            Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date) => {
              const dateString = date.toISOString().split('T')[0];
              const daySessions = getSessionsForDate(dateString);
              
              return (
                <div key={dateString} className="min-h-[200px]">
                  <div className={`text-center p-2 rounded-lg mb-2 ${
                    isToday(date) ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="font-medium">{formatDate(date)}</div>
                  </div>
                  
                  <Droppable droppableId={dateString}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[150px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        {daySessions.map((session, index) => (
                          <Draggable key={session.id} draggableId={session.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg border p-3 mb-2 shadow-sm transition-all ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                                } ${session.completed ? 'opacity-75' : ''}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className={`w-3 h-3 rounded-full ${getTypeColor(session.type)}`} />
                                  <button
                                    onClick={() => toggleSessionComplete(session.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      session.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 hover:border-green-500'
                                    }`}
                                  >
                                    {session.completed && <CheckCircle size={12} />}
                                  </button>
                                </div>
                                
                                <h4 className={`font-medium text-sm mb-1 ${
                                  session.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {session.name}
                                </h4>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>{session.time}</span>
                                  </div>
                                  <span>{session.duration}min</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Add Session Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add Training Session</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
                <input
                  type="text"
                  value={newSession.name}
                  onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Morning Skills Practice"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newSession.type}
                    onChange={(e) => setNewSession({...newSession, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {sessionTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes or focus areas..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleGeneratePlan}
        initialProfile={userProfile}
      />

      {/* Plan Preview Modal */}
      {showPlanPreview && generatedPlan && (
        <PlanPreview
          plan={generatedPlan}
          onClose={() => {
            setShowPlanPreview(false);
            setGeneratedPlan(null);
          }}
          onApply={handleApplyPlan}
          onEdit={() => {
            setShowPlanPreview(false);
            setShowProfileModal(true);
          }}
        />
      )}

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Total Sessions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => {
                const sessionDate = new Date(s.date);
                return weekDates.some(d => d.toDateString() === sessionDate.toDateString());
              }).length}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {sessions.filter(s => {
                const sessionDate = new Date(s.date);
                return s.completed && weekDates.some(d => d.toDateString() === sessionDate.toDateString());
              }).length}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">Total Time</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {sessions
                .filter(s => {
                  const sessionDate = new Date(s.date);
                  return s.completed && weekDates.some(d => d.toDateString() === sessionDate.toDateString());
                })
                .reduce((total, s) => total + s.duration, 0)}m
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {sessions.filter(s => {
                const sessionDate = new Date(s.date);
                return weekDates.some(d => d.toDateString() === sessionDate.toDateString());
              }).length > 0 
                ? Math.round((sessions.filter(s => {
                    const sessionDate = new Date(s.date);
                    return s.completed && weekDates.some(d => d.toDateString() === sessionDate.toDateString());
                  }).length / sessions.filter(s => {
                    const sessionDate = new Date(s.date);
                    return weekDates.some(d => d.toDateString() === sessionDate.toDateString());
                  }).length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;