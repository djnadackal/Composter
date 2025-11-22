import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const DocsLayout = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-white font-[font]">
      <div className="fixed w-screen h-20 bg-[#060010] flex items-center justify-end px-8 ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>
      <div className="fixed w-screen h-2 top-20 pointer-events-none">
        <div
          className="absolute inset-0 bg-linear-to-b from-[#251c35] to-transparent"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 55%, black 1%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 55%, black 1%, transparent 100%)",
          }}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid" style={{ gridTemplateColumns: '16rem 1fr', gap: '2.5rem' }}>
          <aside>
            <div className="sticky top-35">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-4">Docs</h3>
              <nav className="flex flex-col gap-2">
                <NavLink
                  to="."
                  end
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${isActive ? 'text-white border-l-2 border-violet-400 bg-white/2' : 'text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400'}`
                  }
                >
                  Introduction
                </NavLink>

                <NavLink
                  to="installation"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${isActive ? 'text-white border-l-2 border-violet-400 bg-white/2' : 'text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400'}`
                  }
                >
                  Installation
                </NavLink>

                <NavLink
                  to="cli"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${isActive ? 'text-white border-l-2 border-violet-400 bg-white/2' : 'text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400'}`
                  }
                >
                  CLI
                </NavLink>

                <NavLink
                  to="manual"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${isActive ? 'text-white border-l-2 border-violet-400 bg-white/2' : 'text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400'}`
                  }
                >
                  Manual
                </NavLink>
              </nav>
            </div>
          </aside>

          <main className="overflow-auto h-[70vh] pr-4 mt-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DocsLayout
