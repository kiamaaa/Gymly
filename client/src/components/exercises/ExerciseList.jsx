export default function ExerciseList({ exercises, loading, muscleGroups, onViewProgress, onDelete }) {
  if (loading) return <p style={{ color: '#cc0000' }}>Loading exercises...</p>;
  if (exercises.length === 0) return <p style={{ color: '#666666' }}>No exercises found.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
      {exercises.map((ex) => (
        <div key={ex.id} style={{ border: '1px solid #cc0000', padding: '15px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
          <h3 style={{ color: '#cc0000' }}>{ex.name}</h3>
          {ex.description && <p style={{ color: '#ffffff' }}>{ex.description}</p>}
          {ex.equipment && <p style={{ color: '#999999' }}><strong>Equipment:</strong> {ex.equipment}</p>}
          {ex.muscle_group && <p style={{ color: '#999999' }}><strong>Muscle Group:</strong> {ex.muscle_group.name}</p>}
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => onViewProgress(ex.id, ex.name)}
              style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              View Progress
            </button>
            <button
              onClick={() => onDelete(ex.id)}
              style={{ padding: '6px 12px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}