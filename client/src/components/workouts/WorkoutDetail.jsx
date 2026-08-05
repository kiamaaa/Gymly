import { useState } from 'react';

export default function WorkoutDetail({ workout, onClose, onAddExercise, exercises }) {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    exercise_id: '',
    sets: '',
    reps: '',
    weight_used: '',
    time_taken: '',
    calories_burned: ''
  });

  const handleAddExercise = async (e) => {
    e.preventDefault();
    await onAddExercise(workout.id, {
      exercise_id: parseInt(exerciseForm.exercise_id),
      sets: parseInt(exerciseForm.sets),
      reps: parseInt(exerciseForm.reps),
      weight_used: parseFloat(exerciseForm.weight_used),
      time_taken: parseInt(exerciseForm.time_taken) || 0,
      calories_burned: parseInt(exerciseForm.calories_burned) || 0
    });
    setExerciseForm({ exercise_id: '', sets: '', reps: '', weight_used: '', time_taken: '', calories_burned: '' });
    setShowAddExercise(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ background: '#1a1a1a', padding: '30px', maxWidth: '600px', width: '90%', borderRadius: '8px', maxHeight: '80vh', overflow: 'auto', border: '1px solid #cc0000' }}>
        <h2 style={{ color: '#cc0000' }}>{workout.name}</h2>
        <p style={{ color: '#ffffff' }}><strong>Date:</strong> {workout.date}</p>
        {workout.total_duration && <p style={{ color: '#ffffff' }}><strong>Duration:</strong> {workout.total_duration} min</p>}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#cc0000' }}>Exercises</h3>
          <button onClick={() => setShowAddExercise(!showAddExercise)} style={{ padding: '8px 16px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Add Exercise
          </button>
        </div>

        {showAddExercise && (
          <div style={{ border: '1px solid #cc0000', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
            <h4 style={{ color: '#ffffff' }}>Add Exercise to Workout</h4>
            <form onSubmit={handleAddExercise}>
              <select
                value={exerciseForm.exercise_id}
                onChange={(e) => setExerciseForm({...exerciseForm, exercise_id: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              >
                <option value="">Select Exercise</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Sets"
                value={exerciseForm.sets}
                onChange={(e) => setExerciseForm({...exerciseForm, sets: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              />
              <input
                type="number"
                placeholder="Reps"
                value={exerciseForm.reps}
                onChange={(e) => setExerciseForm({...exerciseForm, reps: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={exerciseForm.weight_used}
                onChange={(e) => setExerciseForm({...exerciseForm, weight_used: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              />
              <input
                type="number"
                placeholder="Time (seconds)"
                value={exerciseForm.time_taken}
                onChange={(e) => setExerciseForm({...exerciseForm, time_taken: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              />
              <input
                type="number"
                placeholder="Calories Burned"
                value={exerciseForm.calories_burned}
                onChange={(e) => setExerciseForm({...exerciseForm, calories_burned: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
              />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Add Exercise
              </button>
              <button type="button" onClick={() => setShowAddExercise(false)} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {workout.workout_exercises && workout.workout_exercises.length > 0 ? (
          <ul style={{ color: '#ffffff' }}>
            {workout.workout_exercises.map((we, index) => (
              <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <strong style={{ color: '#cc0000' }}>{we.exercise?.name || 'Exercise'}</strong>
                <div style={{ color: '#999999' }}>
                  <span>Sets: {we.sets} | Reps: {we.reps} | Weight: {we.weight_used}kg</span>
                  {we.time_taken && <span> | Time: {we.time_taken}s</span>}
                  {we.calories_burned && <span> | Calories: {we.calories_burned}</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666666' }}>No exercises added yet. Add one above!</p>
        )}
        
        <button
          onClick={onClose}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}