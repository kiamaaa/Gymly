export default function ProfileForm({ formData, setFormData, onSubmit, onCancel, isEdit }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#ffffff' }}>{isEdit ? 'Edit Profile' : 'Create Profile'}</h3>
      <form onSubmit={onSubmit}>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        >
          <option value="">Select Goal</option>
          <option value="lose_weight">Lose Weight</option>
          <option value="gain_muscle">Gain Muscle</option>
          <option value="maintain">Maintain</option>
          <option value="endurance">Endurance</option>
        </select>
        <input
          name="starting_weight"
          type="number"
          step="0.1"
          placeholder="Starting Weight (kg)"
          value={formData.starting_weight}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="target_weight"
          type="number"
          step="0.1"
          placeholder="Target Weight (kg)"
          value={formData.target_weight}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="height"
          type="number"
          step="0.1"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <select
          name="activity_level"
          value={formData.activity_level}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isEdit ? 'Update Profile' : 'Create Profile'}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}