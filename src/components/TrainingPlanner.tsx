import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { TrainingSession } from '../types';
import { trainingTypes } from '../data/basketballData';

const TrainingPlanner: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'skills',
      duration: 60,
      completed: false,
      exercises: ['Crossover Dribble', 'Jump Shot Form'],
      notes: 'Focus on ball control'
    },
    {
      id: '2',
      date: '2024-01-16',
      type: 'conditioning',
      duration: 45,
      completed: true,
      exercises: ['Suicide Sprints', 'Lateral Bounds']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({
    date: '',
    type: 'skills' as const,
    duration: 60,
    exercises: [] as string[],
    notes: ''
  });

  const handleAddSession = () => {
    if (newSession.date) {
      const session: TrainingSession = {
        id: Date.now().toString(),
        date: newSession.date,
        type: newSession.type,
        duration: newSession.duration,
        completed: false,
        exercises: newSession.exercises,
        notes: newSession.notes
      };
      setSessions([...sessions, session]);
      setNewSession({
        date: '',
        type: 'skills',
        duration: 60,
        exercises: [],
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
    const typeConfig = trainingTypes.find(t => t.id === type);
    return typeConfig?.color || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Planner</h2>
          <p className="text-gray-600">Schedule and track your basketball training sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Session</span>
        </button>
      </div>

      {/* Add Session Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full m-4">
            <h3 className="text-xl font-semibold mb-4">Add Training Session</h3>
            
            <div className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newSession.type}
                  onChange={(e) => setNewSession({...newSession, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {trainingTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
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
            
            <div className="flex justify-end space-x-3 mt-6">
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

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg ${getTypeColor(session.type)} flex items-center justify-center text-white`}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {trainingTypes.find(t => t.id === session.type)?.name} Training
                  </h3>
                  <p className="text-sm text-gray-600">{session.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{session.duration} min</span>
                </div>
                <button
                  onClick={() => toggleSessionComplete(session.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    session.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {session.completed ? 'Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {session.exercises.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
                <div className="flex flex-wrap gap-2">
                  {session.exercises.map((exercise, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                      {exercise}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {session.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{session.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPlanner;