import { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkoutList from './components/workouts/WorkoutList';
import WorkoutForm from './components/workouts/WorkoutForm';
import WorkoutDetail from './components/workouts/WorkoutDetail';
import ExerciseList from './components/exercises/ExerciseList';
import ExerciseForm from './components/exercises/ExerciseForm';
import ExerciseProgress from './components/exercises/ExerciseProgress';
import ProfileView from './components/profile/ProfileView';
import ProfileForm from './components/profile/ProfileForm';
import ProgressList from './components/progress/ProgressList';
import ProgressForm from './components/progress/ProgressForm';
import StatsDashboard from './components/stats/StatsDashboard';
import Recommendations from './components/stats/Recommendations';
import RankDisplay from './components/stats/RankDisplay';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeTab, setActiveTab] = useState('workouts');

  const [workouts, setWorkouts] = useState([]);
  const [workoutLoading, setWorkoutLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({ name: '', date: '', total_duration: '' });
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  const [exercises, setExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [exerciseForm, setExerciseForm] = useState({ name: '', description: '', equipment: '', muscle_group_id: '' });
  const [showAddExercise, setShowAddExercise] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ goal: '', starting_weight: '', target_weight: '', height: '', activity_level: '' });
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [progressLogs, setProgressLogs] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressForm, setProgressForm] = useState({ date: '', body_weight: '', body_fat_pct: '', notes: '' });
  const [showAddProgress, setShowAddProgress] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [rank, setRank] = useState(null);

  const [exerciseProgress, setExerciseProgress] = useState([]);
  const [showExerciseProgress, setShowExerciseProgress] = useState(false);
  const [selectedExerciseName, setSelectedExerciseName] = useState('');

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  useEffect(() => {
    if (selectedMuscleGroup) {
      loadExercises();
    }
  }, [selectedMuscleGroup]);

  async function fetchWithAuth(url, options = {}) {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    
    if (res.status === 401) {
      localStorage.removeItem('token');
      setToken(null);
      throw new Error('Session expired. Please login again.');
    }
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    
    return res.json();
  }

  async function loadAllData() {
    await Promise.all([
      loadWorkouts(),
      loadExercises(),
      loadMuscleGroups(),
      loadProfile(),
      loadProgressLogs(),
      loadStats(),
      loadRecommendations(),
      loadRank()
    ]);
  }

  async function loadWorkouts() {
    setWorkoutLoading(true);
    try {
      const data = await fetchWithAuth('/api/workouts');
      setWorkouts(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorkoutLoading(false);
    }
  }

  async function loadExercises() {
    setExerciseLoading(true);
    try {
      const url = selectedMuscleGroup ? `/api/exercises?muscle_group_id=${selectedMuscleGroup}` : '/api/exercises';
      const data = await fetchWithAuth(url);
      setExercises(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setExerciseLoading(false);
    }
  }

  async function loadMuscleGroups() {
    try {
      const data = await fetchWithAuth('/api/muscle-groups');
      setMuscleGroups(data.data || []);
    } catch (err) {
      console.error('Error loading muscle groups:', err);
    }
  }

  async function loadProfile() {
    setProfileLoading(true);
    try {
      const data = await fetchWithAuth('/api/profile');
      setProfile(data);
    } catch (err) {
      if (!err.message.includes('no profile yet')) {
        setError(err.message);
      }
    } finally {
      setProfileLoading(false);
    }
  }

  async function loadProgressLogs() {
    setProgressLoading(true);
    try {
      const data = await fetchWithAuth('/api/progress-logs');
      setProgressLogs(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setProgressLoading(false);
    }
  }

  async function loadStats() {
    setStatsLoading(true);
    try {
      const data = await fetchWithAuth('/api/stats/weekly');
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }

  async function loadRecommendations() {
    try {
      const data = await fetchWithAuth('/api/recommendations');
      setRecommendations(data || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  }

  async function loadRank() {
    try {
      const data = await fetchWithAuth('/api/rank');
      setRank(data);
    } catch (err) {
      console.error('Error loading rank:', err);
    }
  }

  async function loadExerciseProgress(exerciseId) {
    try {
      const data = await fetchWithAuth(`/api/exercises/${exerciseId}/progress`);
      setExerciseProgress(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadWorkoutDetail(workoutId) {
    try {
      const data = await fetchWithAuth(`/api/workouts/${workoutId}`);
      setSelectedWorkout(data);
      setShowWorkoutDetail(true);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(email, password) {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setSuccess(`Welcome ${data.user.username}!`);
  }

  async function handleRegister(username, email, password) {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setSuccess(`Welcome ${data.user.username}!`);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setWorkouts([]);
    setExercises([]);
    setProfile(null);
    setProgressLogs([]);
    setStats(null);
    setRecommendations([]);
    setRank(null);
    setError(null);
    setSuccess(null);
  }

  async function handleCreateWorkout(e) {
    e.preventDefault();
    setError(null);
    try {
      await fetchWithAuth('/api/workouts', {
        method: 'POST',
        body: JSON.stringify({
          name: workoutForm.name,
          date: workoutForm.date,
          total_duration: parseInt(workoutForm.total_duration) || 0,
          exercises: []
        }),
      });
      
      setWorkoutForm({ name: '', date: '', total_duration: '' });
      setShowAddWorkout(false);
      setSuccess('Workout created successfully!');
      await loadWorkouts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteWorkout(id) {
    if (!confirm('Delete this workout?')) return;
    try {
      await fetchWithAuth(`/api/workouts/${id}`, {
        method: 'DELETE',
      });
      setSuccess('Workout deleted successfully!');
      await loadWorkouts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateExercise(e) {
    e.preventDefault();
    setError(null);
    try {
      await fetchWithAuth('/api/exercises', {
        method: 'POST',
        body: JSON.stringify({
          name: exerciseForm.name,
          description: exerciseForm.description,
          equipment: exerciseForm.equipment,
          muscle_group_id: parseInt(exerciseForm.muscle_group_id)
        }),
      });
      
      setExerciseForm({ name: '', description: '', equipment: '', muscle_group_id: '' });
      setShowAddExercise(false);
      setSuccess('Exercise created successfully!');
      await loadExercises();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteExercise(id) {
    if (!confirm('Delete this exercise?')) return;
    try {
      await fetchWithAuth(`/api/exercises/${id}`, {
        method: 'DELETE',
      });
      setSuccess('Exercise deleted successfully!');
      await loadExercises();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateProfile(e) {
    e.preventDefault();
    setError(null);
    try {
      await fetchWithAuth('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
          goal: profileForm.goal,
          starting_weight: parseFloat(profileForm.starting_weight),
          target_weight: parseFloat(profileForm.target_weight),
          height: parseFloat(profileForm.height),
          activity_level: profileForm.activity_level
        }),
      });
      
      setProfileForm({ goal: '', starting_weight: '', target_weight: '', height: '', activity_level: '' });
      setShowEditProfile(false);
      setSuccess('Profile created successfully!');
      await loadProfile();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setError(null);
    try {
      await fetchWithAuth('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          goal: profileForm.goal,
          starting_weight: parseFloat(profileForm.starting_weight),
          target_weight: parseFloat(profileForm.target_weight),
          height: parseFloat(profileForm.height),
          activity_level: profileForm.activity_level
        }),
      });
      
      setShowEditProfile(false);
      setSuccess('Profile updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateProgress(e) {
    e.preventDefault();
    setError(null);
    try {
      await fetchWithAuth('/api/progress-logs', {
        method: 'POST',
        body: JSON.stringify({
          date: progressForm.date,
          body_weight: parseFloat(progressForm.body_weight),
          body_fat_pct: progressForm.body_fat_pct ? parseFloat(progressForm.body_fat_pct) : null,
          notes: progressForm.notes || ''
        }),
      });
      
      setProgressForm({ date: '', body_weight: '', body_fat_pct: '', notes: '' });
      setShowAddProgress(false);
      setSuccess('Progress log added!');
      await loadProgressLogs();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProgress(id) {
    if (!confirm('Delete this progress log?')) return;
    try {
      await fetchWithAuth(`/api/progress-logs/${id}`, {
        method: 'DELETE',
      });
      setSuccess('Progress log deleted!');
      await loadProgressLogs();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleViewExerciseProgress(exerciseId, exerciseName) {
    setSelectedExerciseName(exerciseName);
    setShowExerciseProgress(true);
    await loadExerciseProgress(exerciseId);
  }

  async function handleAddExerciseToWorkout(workoutId, exerciseData) {
    try {
      await fetchWithAuth(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          exercises: [exerciseData]
        })
      });
      setSuccess('Exercise added to workout!');
      await loadWorkoutDetail(workoutId);
      await loadWorkouts();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!token) {
    if (isRegistering) {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  return (
    <div style={{ 
      padding: '20px 60px', 
      backgroundColor: '#000000', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        borderBottom: '2px solid #cc0000', 
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ margin: 0, color: '#cc0000', fontSize: '36px' }}>GYMLY</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <span style={{ marginRight: '15px', color: '#ffffff', fontSize: '16px' }}>Welcome, {user?.username || 'User'}</span>
          <button
            onClick={() => setActiveTab('workouts')}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === 'workouts' ? '#cc0000' : '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === 'exercises' ? '#cc0000' : '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === 'progress' ? '#cc0000' : '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === 'stats' ? '#cc0000' : '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === 'profile' ? '#cc0000' : '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 24px',
              backgroundColor: '#cc0000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <p style={{
          color: '#cc0000',
          padding: '12px 20px',
          backgroundColor: '#1a0000',
          borderRadius: '4px',
          border: '1px solid #cc0000',
          marginBottom: '20px',
          fontSize: '15px'
        }}>{error}</p>
      )}
      {success && (
        <p style={{
          color: '#00cc00',
          padding: '12px 20px',
          backgroundColor: '#001a00',
          borderRadius: '4px',
          border: '1px solid #00cc00',
          marginBottom: '20px',
          fontSize: '15px'
        }}>{success}</p>
      )}

      {activeTab === 'workouts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>Your Workouts</h2>
            <button
              onClick={() => setShowAddWorkout(!showAddWorkout)}
              style={{
                padding: '12px 28px',
                backgroundColor: '#cc0000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              + Add Workout
            </button>
          </div>

          {showAddWorkout && (
            <WorkoutForm
              formData={workoutForm}
              setFormData={setWorkoutForm}
              onSubmit={handleCreateWorkout}
              onCancel={() => setShowAddWorkout(false)}
            />
          )}

          <WorkoutList
            workouts={workouts}
            loading={workoutLoading}
            onView={loadWorkoutDetail}
            onDelete={handleDeleteWorkout}
          />
        </div>
      )}

      {activeTab === 'exercises' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>Exercise Library</h2>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              style={{
                padding: '12px 28px',
                backgroundColor: '#cc0000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              + Add Exercise
            </button>
          </div>

          {showAddExercise && (
            <ExerciseForm
              formData={exerciseForm}
              setFormData={setExerciseForm}
              muscleGroups={muscleGroups}
              onSubmit={handleCreateExercise}
              onCancel={() => setShowAddExercise(false)}
            />
          )}

          <ExerciseList
            exercises={exercises}
            loading={exerciseLoading}
            muscleGroups={muscleGroups}
            onViewProgress={handleViewExerciseProgress}
            onDelete={handleDeleteExercise}
          />
        </div>
      )}

      {activeTab === 'progress' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>Progress Logs</h2>
            <button
              onClick={() => setShowAddProgress(!showAddProgress)}
              style={{
                padding: '12px 28px',
                backgroundColor: '#cc0000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              + Add Progress
            </button>
          </div>

          {showAddProgress && (
            <ProgressForm
              formData={progressForm}
              setFormData={setProgressForm}
              onSubmit={handleCreateProgress}
              onCancel={() => setShowAddProgress(false)}
            />
          )}

          <ProgressList
            logs={progressLogs}
            loading={progressLoading}
            onDelete={handleDeleteProgress}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          <h2 style={{ color: '#ffffff', marginBottom: '25px', fontSize: '28px' }}>Statistics</h2>
          <StatsDashboard stats={stats} loading={statsLoading} />
          <div style={{ marginTop: '25px' }}>
            <Recommendations recommendations={recommendations} />
          </div>
          <div style={{ marginTop: '25px' }}>
            <RankDisplay rank={rank} />
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div>
          <h2 style={{ color: '#ffffff', marginBottom: '25px', fontSize: '28px' }}>Profile</h2>
          <ProfileView
            profile={profile}
            loading={profileLoading}
            onEdit={() => {
              if (profile) {
                setProfileForm({
                  goal: profile.goal || '',
                  starting_weight: profile.starting_weight || '',
                  target_weight: profile.target_weight || '',
                  height: profile.height || '',
                  activity_level: profile.activity_level || ''
                });
              }
              setShowEditProfile(true);
            }}
            onCreate={() => {
              setProfileForm({
                goal: '',
                starting_weight: '',
                target_weight: '',
                height: '',
                activity_level: ''
              });
              setShowEditProfile(true);
            }}
          />
          {showEditProfile && (
            <ProfileForm
              formData={profileForm}
              setFormData={setProfileForm}
              onSubmit={profile ? handleUpdateProfile : handleCreateProfile}
              onCancel={() => {
                setShowEditProfile(false);
                setProfileForm({ goal: '', starting_weight: '', target_weight: '', height: '', activity_level: '' });
              }}
              isEdit={!!profile}
            />
          )}
        </div>
      )}

      {showWorkoutDetail && selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          exercises={exercises}
          onClose={() => setShowWorkoutDetail(false)}
          onAddExercise={handleAddExerciseToWorkout}
        />
      )}

      {showExerciseProgress && (
        <ExerciseProgress
          progress={exerciseProgress}
          exerciseName={selectedExerciseName}
          onClose={() => setShowExerciseProgress(false)}
        />
      )}
    </div>
  );
}