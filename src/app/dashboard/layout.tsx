import Link from "next/link";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar Navigasyon */}
      <div className="w-full md:w-64 bg-muted border-r p-4">
        <div className="text-2xl font-bold mb-6 text-primary">detail</div>
        <nav className="space-y-1">
          <Link 
            href="/dashboard" 
            className="flex items-center p-2 tex  t-sm rounded-md hover:bg-accent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2 h-4 w-4"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
            </svg>
            Ana Sayfa
          </Link>
          
          <Link 
            href="/dashboard/soru-takibi" 
            className="flex items-center p-2 text-sm rounded-md hover:bg-accent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2 h-4 w-4"
            >
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
            Soru Takibi
          </Link>

          <Link 
            href="/dashboard/gorevler" 
            className="flex items-center p-2 text-sm rounded-md hover:bg-accent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2 h-4 w-4"
            >
              <path d="M9 11V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
              <path d="M11 11V9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v2" />
            </svg>
            Görevler
          </Link>
          
          <Link 
            href="/dashboard/dersler" 
            className="flex items-center p-2 text-sm rounded-md hover:bg-accent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2 h-4 w-4"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            Dersler
          </Link>
        </nav>
      </div>
      
      {/* Ana İçerik */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 