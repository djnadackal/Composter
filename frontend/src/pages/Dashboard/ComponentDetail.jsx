import React from 'react'
import { useParams } from 'react-router-dom'

const ComponentDetail = () => {
  const { id } = useParams()

  const getPreviewText = () => {
    if (id === 'button-1') return 'Preview of Button 1'
    if (id === 'button-2') return 'Preview of Button 2'
    return 'Select a button to see preview'
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-5xl font-extrabold text-white">{id ? id.replace(/-/g, ' ').toUpperCase() : 'Component'}</h1>
          <p className="text-zinc-400 mt-2">Preview for {id || 'component'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 rounded-md">Preview</button>
          <button className="px-4 py-2 bg-white/5 rounded-md">Code</button>
          <button className="px-4 py-2 bg-violet-600/60 text-white rounded-md">Contribute</button>
        </div>
      </div>

      <div className="bg-white/2 rounded-xl p-8 mb-8 h-72 flex items-center justify-center">
        <div className="text-3xl text-violet-300 font-semibold">{getPreviewText()}</div>
      </div>

      <h3 className="text-2xl text-violet-300 font-semibold mb-4">Customize</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-zinc-300 mb-2">Text</label>
          <div className="bg-white/5 p-2 rounded">REACT*BITS*COMPONENTS*</div>
        </div>

        <div>
          <label className="block text-zinc-300 mb-2">On Hover</label>
          <select className="bg-white/5 p-2 rounded w-full">
            <option>Speed Up</option>
            <option>Pause</option>
            <option>None</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-300 mb-2">Spin Duration (s)</label>
          <input type="range" min="1" max="60" defaultValue="20" className="w-full" />
        </div>
      </div>
    </div>
  )
}

export default ComponentDetail