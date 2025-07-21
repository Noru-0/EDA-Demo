import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">EventFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sự kiện
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            Về chúng tôi
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Liên hệ
          </Link>
        </nav>

        <Button variant="outline" className="ml-4 bg-transparent">
          Đăng nhập
        </Button>
      </div>
    </header>
  )
}
