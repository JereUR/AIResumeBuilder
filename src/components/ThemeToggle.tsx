'use client'

import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { setTheme } = useTheme()

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' size='icon'>
        <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="size-[1.2rem] absolute rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}