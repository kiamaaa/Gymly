export default function ProfileView({ profile, loading, onEdit, onCreate }) {
  if (loading) return <p style={{ color: '#cc0000' }}>Loading profile...</p>;
  
  if (!profile) {
    return (
      <div style={{ 
        border: '1px solid #cc0000', 
        padding: '30px', 
        borderRadius: '8px', 
        backgroundColor: '#1a1a1a',
        textAlign: 'center'
      }}>
        <p style={{ color: '#ffffff', fontSize: '18px', marginBottom: '20px' }}>
          You don't have a profile yet.
        </p>
        <button 
          onClick={onCreate} 
          style={{ 
            padding: '12px 30px', 
            backgroundColor: '#cc0000', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#cc0000', margin: 0 }}>Your Profile</h2>
        <button 
          onClick={onEdit} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#cc0000', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Edit Profile
        </button>
      </div>
      <p style={{ color: '#ffffff' }}><strong>Goal:</strong> {profile.goal}</p>
      <p style={{ color: '#ffffff' }}><strong>Starting Weight:</strong> {profile.starting_weight} kg</p>
      <p style={{ color: '#ffffff' }}><strong>Target Weight:</strong> {profile.target_weight} kg</p>
      <p style={{ color: '#ffffff' }}><strong>Height:</strong> {profile.height} cm</p>
      <p style={{ color: '#ffffff' }}><strong>Activity Level:</strong> {profile.activity_level}</p>
      <p style={{ color: '#cc0000' }}><strong>Current Rank:</strong> {profile.current_rank}</p>
    </div>
  );
}