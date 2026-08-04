export default function RankDisplay({ rank }) {
  if (!rank) return <p style={{ color: '#666666' }}>No rank data available.</p>;

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#cc0000' }}>Your Rank</h3>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{rank.rank || 'Unranked'}</p>
      <p style={{ color: '#999999' }}>Total Volume: {rank.total_volume || 0}</p>
    </div>
  );
}