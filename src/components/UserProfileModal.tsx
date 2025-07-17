import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Clock, 
  Dumbbell, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { UserProfile } from '../services/planGenerator';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile
}) => {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      skillLevel: 'beginner',
      goals: [],
      availableTime: 60,
      frequency: 3,
      focusAreas: [],
      equipment: [],
      injuries: [],
      preferences: {
        intensity: 'medium',
        sessionType: 'mixed',
        warmupTime: 10,
        cooldownTime: 10
      }
    }
  );

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to basketball or returning after a long break' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience, looking to improve skills' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced player, focused on optimization' }
  ];

  const availableGoals = [
    'Improve shooting accuracy',
    'Enhance ball handling',
    'Increase speed and agility',
    'Build strength and power',
    'Improve endurance',
    'Master defensive skills',
    'Develop court vision',
    'Increase vertical jump',
    'Improve free throw percentage',
    'Enhance passing skills'
  ];

  const availableFocusAreas = [
    'Shooting',
    'Dribbling',
    'Passing',
    'Defense',
    'Rebounding',
    'Speed',
    'Strength',
    'Endurance',
    'Agility',
    'Jumping'
  ];

  const availableEquipment = [
    'Basketball',
    'Basketball hoop',
    'Dumbbells',
    'Resistance bands',
    'Jump rope',
    'Cones',
    'Medicine ball',
    'Pull-up bar',
    'Bench',
    'Treadmill',
    'None'
  ];

  const sessionTypes = [
    { value: 'skills', label: 'Skills Training', description: 'Focus on basketball-specific skills' },
    { value: 'strength', label: 'Strength Training', description: 'Build strength and power' },
    { value: 'conditioning', label: 'Conditioning', description: 'Improve fitness and endurance' },
    { value: 'mixed', label: 'Mixed Training', description: 'Combination of all training types' }
  ];

  const intensities = [
    { value: 'low', label: 'Low', description: 'Light intensity, good for recovery' },
    { value: 'medium', label: 'Medium', description: 'Moderate intensity, balanced workout' },
    { value: 'high', label: 'High', description: 'High intensity, maximum effort' }
  ];

  const handleGoalToggle = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setProfile(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(f => f !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setProfile(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleInjuryToggle = (injury: string) => {
    setProfile(prev => ({
      ...prev,
      injuries: prev.injuries?.includes(injury)
        ? prev.injuries.filter(i => i !== injury)
        : [...(prev.injuries || []), injury]
    }));
  };

  const handleSave = () => {
    onSave(profile);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Level</h3>
        <div className="space-y-3">
          {skillLevels.map((level) => (
            <label key={level.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="skillLevel"
                value={level.value}
                checked={profile.skillLevel === level.value}
                onChange={(e) => setProfile(prev => ({ ...prev, skillLevel: e.target.value as any }))}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800">{level.label}</div>
                <div className="text-sm text-gray-600">{level.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Goals</h3>
        <p className="text-sm text-gray-600 mb-3">Select all that apply:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {availableGoals.map((goal) => (
            <label key={goal} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={profile.goals.includes(goal)}
                onChange={() => handleGoalToggle(goal)}
                className="rounded"
              />
              <span className="text-sm">{goal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time per Session (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="180"
              step="15"
              value={profile.availableTime}
              onChange={(e) => setProfile(prev => ({ ...prev, availableTime: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sessions per Week
            </label>
            <select
              value={profile.frequency}
              onChange={(e) => setProfile(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2}>2 sessions</option>
              <option value={3}>3 sessions</option>
              <option value={4}>4 sessions</option>
              <option value={5}>5 sessions</option>
              <option value={6}>6 sessions</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Focus Areas</h3>
        <p className="text-sm text-gray-600 mb-3">Select your primary focus areas:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableFocusAreas.map((area) => (
            <label key={area} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={profile.focusAreas.includes(area)}
                onChange={() => handleFocusAreaToggle(area)}
                className="rounded"
              />
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Equipment</h3>
        <p className="text-sm text-gray-600 mb-3">Select what you have access to:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableEquipment.map((equipment) => (
            <label key={equipment} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={profile.equipment.includes(equipment)}
                onChange={() => handleEquipmentToggle(equipment)}
                className="rounded"
              />
              <span className="text-sm">{equipment}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Injuries or Limitations</h3>
        <p className="text-sm text-gray-600 mb-3">Select any injuries or limitations to consider:</p>
        <div className="space-y-2">
          {['Knee issues', 'Back problems', 'Shoulder injuries', 'Ankle problems', 'None'].map((injury) => (
            <label key={injury} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={profile.injuries?.includes(injury) || false}
                onChange={() => handleInjuryToggle(injury)}
                className="rounded"
              />
              <span className="text-sm">{injury}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <div className="space-y-2">
              {sessionTypes.map((type) => (
                <label key={type.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="sessionType"
                    value={type.value}
                    checked={profile.preferences.sessionType === type.value}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      preferences: { ...prev.preferences, sessionType: e.target.value as any }
                    }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensity Level
            </label>
            <div className="space-y-2">
              {intensities.map((intensity) => (
                <label key={intensity.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="intensity"
                    value={intensity.value}
                    checked={profile.preferences.intensity === intensity.value}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      preferences: { ...prev.preferences, intensity: e.target.value as any }
                    }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{intensity.label}</div>
                    <div className="text-sm text-gray-600">{intensity.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warm-up Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="20"
                step="5"
                value={profile.preferences.warmupTime}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, warmupTime: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cool-down Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="20"
                step="5"
                value={profile.preferences.cooldownTime}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, cooldownTime: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Training Schedule';
      case 3: return 'Equipment & Limitations';
      case 4: return 'Preferences';
      default: return 'Basic Information';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Create Your Profile</h2>
              <p className="text-sm text-gray-600">{getStepTitle()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {renderStepContent()}
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal; 