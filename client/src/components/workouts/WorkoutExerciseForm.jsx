export default function WorkoutExerciseForm({ formData, setFormData, exercises, onSubmit, onCancel }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#ffffff' }}>Add Exercise to Workout</h3>
      <form onSubmit={onSubmit}>
        <select
          name="exercise_id"
          value={formData.exercise_id}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        >
          <option value="">Select Exercise</option>
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        <input
          name="sets"
          type="number"
          placeholder="Sets"
          value={formData.sets}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="reps"
          type="number"
          placeholder="Reps"
          value={formData.reps}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="weight_used"
          type="number"
          placeholder="Weight (kg)"
          value={formData.weight_used}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="time_taken"
          type="number"
          placeholder="Time (seconds)"
          value={formData.time_taken}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="calories_burned"
          type="number"
          placeholder="Calories Burned"
          value={formData.calories_burned}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Exercise
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}