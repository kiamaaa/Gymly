export default function ProgressForm({ formData, setFormData, onSubmit, onCancel }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ border: '1px solid #cc0000', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <h3 style={{ color: '#ffffff' }}>Add Progress Log</h3>
      <form onSubmit={onSubmit}>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="body_weight"
          type="number"
          step="0.1"
          placeholder="Body Weight (kg)"
          value={formData.body_weight}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="body_fat_pct"
          type="number"
          step="0.1"
          placeholder="Body Fat % (optional)"
          value={formData.body_fat_pct}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <input
          name="notes"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cc0000', borderRadius: '4px', backgroundColor: '#2a2a2a', color: '#ffffff' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cc0000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Progress
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}