import { useState } from 'react'
import Icon from './Icon.jsx'

const STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']

function todayAsInputValue() {
  const today = new Date()
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export default function ApplicationForm({ application, onClose, onSave, saving, error }) {
  const [form, setForm] = useState(() => ({
    companyName: application?.companyName || '',
    jobRole: application?.jobRole || '',
    applicationDate: application?.applicationDate || todayAsInputValue(),
    status: application?.status || 'Applied',
    notes: application?.notes || '',
  }))

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    onSave({
      ...form,
      applicationDate: form.applicationDate || null,
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="application-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{application ? 'KEEP IT CURRENT' : 'A NEW OPPORTUNITY'}</span>
            <h2 id="modal-title">{application ? 'Edit application' : 'Add application'}</h2>
            <p>Small steps add up. Keep the details somewhere you can find them.</p>
          </div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Close form"><Icon name="close" /></button>
        </div>

        <form className="application-form" onSubmit={submit}>
          <label>
            Company name <span>*</span>
            <input name="companyName" value={form.companyName} onChange={updateField} placeholder="e.g. Capgemini" required maxLength={255} autoFocus />
          </label>
          <label>
            Job role <span>*</span>
            <input name="jobRole" value={form.jobRole} onChange={updateField} placeholder="e.g. Software Engineer" required maxLength={255} />
          </label>
          <div className="form-row">
            <label>
              Application date
              <input type="date" name="applicationDate" value={form.applicationDate} onChange={updateField} />
            </label>
            <label>
              Current status <span>*</span>
              <select name="status" value={form.status} onChange={updateField} required>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={updateField} placeholder="Add a reminder, contact, or anything worth remembering…" rows="3" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving…' : application ? 'Save changes' : 'Add application'}
              {!saving && <Icon name="arrow" size={17} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
