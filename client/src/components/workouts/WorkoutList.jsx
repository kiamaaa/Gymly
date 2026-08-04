export default function WorkoutList({ workouts, loading, onView, onDelete }) {
  if (loading) return <p style={{ color: '#cc0000' }}>Loading workouts...</p>;
  if (workouts.length === 0) return <p style={{ color: '#666666' }}>No workouts yet. Create one!</p>;

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {workouts.map((w) => (
        <div key={w.id} style={{ border: '1px solid #cc0000', padding: '15px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '18px', color: '#ffffff' }}>{w.name}</strong>
              <div style={{ color: '#999999', marginTop: '5px' }}>
                Date: {w.date}
                {w.total_duration && <span style={{ marginLeft: '15px' }}>Duration: {w.total_duration} min</span>}
              </div>
              {w.workout_exercises && (
                <div style={{ color: '#666666', fontSize: '14px', marginTop: '5px' }}>
                  {w.workout_exercises.length} exercises
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => onView(w.id)}
                style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                View
              </button>
              <button
                onClick={() => onDelete(w.id)}
                style={{ padding: '6px 12px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}