// src/components/Navigation.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  MessageSquare,
  ImageIcon,
  Users,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Link, useLocation } from 'react-router-dom' // Import Link and useLocation
import { Outlet } from 'react-router-dom' // Import Outlet

const menuItems = [
  { icon: MessageSquare, label: 'Conversation IA', href: '/conversation' },
  { icon: ImageIcon, label: 'Tableaux de Tristan', href: '/tristan' },
  { icon: ImageIcon, label: 'Tableaux de Magritte', href: '/magritte' },
  { icon: Users, label: 'Personnages du récit', href: '/personnages' },
  { icon: Calendar, label: 'Prochains événements', href: '/evenements' },
  { icon: Sparkles, label: 'Explorer IA SIGNATURE', href: '/explorer' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation() // Get the current location

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsOpen(!mobile)
      setIsExpanded(!mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleMenu = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100">
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={
              isMobile
                ? { x: -300 }
                : { width: isExpanded ? 256 : 64 }
            }
            animate={
              isMobile
                ? { x: 0 }
                : { width: isExpanded ? 256 : 64 }
            }
            exit={
              isMobile
                ? { x: -300 }
                : { width: isExpanded ? 256 : 64 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full bg-zinc-800 shadow-lg z-40 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              {isExpanded && !isMobile && (
                <h2 className="text-2xl font-serif text-amber-300">
                  Menu
                </h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-zinc-300 hover:text-amber-300"
              >
                {isMobile ? (
                  <X className="h-6 w-6" />
                ) : isExpanded ? (
                  <ChevronLeft className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <div className="space-y-2 p-4">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.href // Check if the route is active
                  return (
                    <Link to={item.href} key={index}>
                      <div
                        className={`flex items-center space-x-2 p-2 rounded-md transition-colors cursor-pointer ${
                          isExpanded ? '' : 'justify-center'
                        } ${
                          isActive ? 'bg-zinc-700 text-amber-300' : 'hover:bg-zinc-700'
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-amber-300' : 'text-amber-500'
                          }`}
                        />
                        {isExpanded && (
                          <span className="text-zinc-100">{item.label}</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </ScrollArea>
          </motion.nav>
        )}
      </AnimatePresence>

      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen
            ? isMobile
              ? 'ml-0'
              : isExpanded
              ? 'ml-[256px]'
              : 'ml-[64px]'
            : 'ml-0'
        } p-4 bg-zinc-900`}
      >
        {!isOpen && isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        {/* Render the nested routes here */}
        <Outlet />
      </main>
    </div>
  )
}
