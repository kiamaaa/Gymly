export default function WorkoutForm({ formData, setFormData, onSubmit, onCancel }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#ffffff' }}>Create New Workout</h3>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Workout Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="total_duration"
          type="number"
          placeholder="Total Duration (minutes)"
          value={formData.total_duration}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create Workout
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}