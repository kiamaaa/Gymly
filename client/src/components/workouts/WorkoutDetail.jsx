export default function WorkoutDetail({ workout, onClose }) {
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
      <div style={{ background: '#1a1a1a', padding: '30px', maxWidth: '500px', width: '90%', borderRadius: '8px', maxHeight: '80vh', overflow: 'auto', border: '1px solid #cc0000' }}>
        <h2 style={{ color: '#cc0000' }}>{workout.name}</h2>
        <p style={{ color: '#ffffff' }}><strong>Date:</strong> {workout.date}</p>
        {workout.total_duration && <p style={{ color: '#ffffff' }}><strong>Duration:</strong> {workout.total_duration} min</p>}
        
        <h3 style={{ color: '#cc0000' }}>Exercises</h3>
        {workout.workout_exercises && workout.workout_exercises.length > 0 ? (
          <ul style={{ color: '#ffffff' }}>
            {workout.workout_exercises.map((we, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#cc0000' }}>{we.exercise?.name || 'Exercise'}</strong>
                <div style={{ color: '#999999' }}>
                  {we.sets && <span>Sets: {we.sets} | </span>}
                  {we.reps && <span>Reps: {we.reps} | </span>}
                  {we.weight_used && <span>Weight: {we.weight_used}kg | </span>}
                  {we.time_taken && <span>Time: {we.time_taken}s</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666666' }}>No exercises added yet.</p>
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