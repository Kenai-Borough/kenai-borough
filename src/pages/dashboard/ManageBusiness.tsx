import { useState } from 'react'
import { businesses } from '../../data/businesses'
import { Toast } from '../../components/ui/Toast'
import type { DirectoryCategory, ToastState } from '../../types'

export function ManageBusiness() {
  const initial = businesses[0]
  const [name, setName] = useState(initial.name)
  const [category, setCategory] = useState<DirectoryCategory>(initial.category)
  const [description, setDescription] = useState(initial.description)
  const [photos, setPhotos] = useState(initial.gallery.join('\n'))
  const [hours, setHours] = useState(initial.hours)
  const [location, setLocation] = useState(initial.address)
  const [contact, setContact] = useState(initial.phone)
  const [socialLinks, setSocialLinks] = useState('@kenairiverdrift')
  const [services, setServices] = useState(initial.services.join(', '))
  const [toast, setToast] = useState<ToastState | null>(null)

  return (
    <div className="page-shell py-12">
      <div className="max-w-4xl">
        <p className="section-kicker">Manage business</p>
        <h1 className="mt-3 text-4xl font-semibold">Update your listing details, visuals, contact information, and services.</h1>
      </div>
      <div className="mt-8 panel">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Business name<input value={name} onChange={(event) => setName(event.target.value)} className="form-input mt-2" /></label>
          <label className="text-sm font-medium">Category<input value={category} onChange={(event) => setCategory(event.target.value as DirectoryCategory)} className="form-input mt-2" /></label>
        </div>
        <label className="mt-4 block text-sm font-medium">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="form-input mt-2 min-h-[150px]" /></label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Hours<input value={hours} onChange={(event) => setHours(event.target.value)} className="form-input mt-2" /></label>
          <label className="text-sm font-medium">Location<input value={location} onChange={(event) => setLocation(event.target.value)} className="form-input mt-2" /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Contact<input value={contact} onChange={(event) => setContact(event.target.value)} className="form-input mt-2" /></label>
          <label className="text-sm font-medium">Social links<input value={socialLinks} onChange={(event) => setSocialLinks(event.target.value)} className="form-input mt-2" /></label>
        </div>
        <label className="mt-4 block text-sm font-medium">Services<input value={services} onChange={(event) => setServices(event.target.value)} className="form-input mt-2" /></label>
        <label className="mt-4 block text-sm font-medium">Photos array<textarea value={photos} onChange={(event) => setPhotos(event.target.value)} className="form-input mt-2 min-h-[160px]" /></label>
        <button onClick={() => setToast({ title: 'Listing saved', description: 'Your business profile updates are ready to publish.', variant: 'success' })} className="primary-button mt-4">Save changes</button>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
