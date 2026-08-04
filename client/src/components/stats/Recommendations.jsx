export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return <p style={{ color: '#666666' }}>No recommendations available.</p>;
  }

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#cc0000' }}>Recommendations</h3>
      <ul style={{ color: '#ffffff' }}>
        {recommendations.map((rec, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>{rec.name || rec}</li>
        ))}
      </ul>
    </div>
  );
}