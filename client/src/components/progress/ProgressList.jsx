export default function ProgressList({ logs, loading, onDelete }) {
  if (loading) return <p style={{ color: '#cc0000' }}>Loading progress logs...</p>;
  if (logs.length === 0) return <p style={{ color: '#666666' }}>No progress logs yet.</p>;

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {logs.map((log) => (
        <div key={log.id} style={{ border: '1px solid #cc0000', padding: '15px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#cc0000' }}>Date: {log.date}</strong>
              <div style={{ marginTop: '5px', color: '#ffffff' }}>
                <span>Weight: {log.body_weight} kg</span>
                {log.body_fat_pct && <span style={{ marginLeft: '15px' }}>Body Fat: {log.body_fat_pct}%</span>}
              </div>
              {log.notes && <div style={{ color: '#999999', marginTop: '5px' }}>{log.notes}</div>}
            </div>
            <button
              onClick={() => onDelete(log.id)}
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