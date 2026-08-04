export default function ExerciseProgress({ progress, exerciseName, onClose }) {
  if (!progress || progress.length === 0) {
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
        <div style={{ background: '#1a1a1a', padding: '30px', maxWidth: '500px', width: '90%', borderRadius: '8px', border: '1px solid #cc0000' }}>
          <h3 style={{ color: '#cc0000' }}>{exerciseName} - Progress</h3>
          <p style={{ color: '#ffffff' }}>No progress data available for this exercise.</p>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

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
        <h3 style={{ color: '#cc0000' }}>{exerciseName} - Progress</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#cc0000' }}>
              <th style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>Sets</th>
              <th style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>Reps</th>
              <th style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>{p.date}</td>
                <td style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>{p.sets}</td>
                <td style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>{p.reps}</td>
                <td style={{ padding: '10px', border: '1px solid #cc0000', color: '#ffffff' }}>{p.weight_used}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}