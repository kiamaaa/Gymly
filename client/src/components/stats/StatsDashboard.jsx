export default function StatsDashboard({ stats, loading }) {
  if (loading) return <p style={{ color: '#cc0000' }}>Loading stats...</p>;
  if (!stats) return <p style={{ color: '#666666' }}>No stats available.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      <div style={{ border: '1px solid #cc0000', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#1a1a1a' }}>
        <h3 style={{ color: '#cc0000' }}>Calories Burned</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>{stats.total_calories_burned || 0}</p>
      </div>
      <div style={{ border: '1px solid #cc0000', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#1a1a1a' }}>
        <h3 style={{ color: '#cc0000' }}>Time (seconds)</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>{stats.total_time_seconds || 0}</p>
      </div>
    </div>
  );
}