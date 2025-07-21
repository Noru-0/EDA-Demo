"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import { EventDetailModal } from "@/components/event-detail-modal"
import { FilterTabs } from "@/components/filter-tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export interface Event {
  id: string
  name: string
  description: string
  shortDescription: string
  date: string
  location: string
  capacity: number
  registered: number
  image: string
  status: "upcoming" | "ended"
}

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2024",
    description:
      "Hội nghị công nghệ lớn nhất năm với các diễn giả hàng đầu từ Google, Microsoft, và Meta. Khám phá những xu hướng mới nhất trong AI, Cloud Computing, và Web Development.",
    shortDescription: "Hội nghị công nghệ lớn nhất năm với các diễn giả hàng đầu",
    date: "2024-03-15",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    capacity: 500,
    registered: 342,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Startup Networking Night",
    description:
      "Đêm giao lưu dành cho các startup và nhà đầu tư. Cơ hội tuyệt vời để mở rộng mạng lưới, tìm kiếm đối tác và nhà đầu tư tiềm năng.",
    shortDescription: "Đêm giao lưu dành cho các startup và nhà đầu tư",
    date: "2024-02-28",
    location: "WeWork Lý Thái Tổ, TP.HCM",
    capacity: 150,
    registered: 89,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Digital Marketing Summit",
    description:
      "Hội thảo về Digital Marketing với các chuyên gia hàng đầu. Học hỏi các chiến lược marketing hiệu quả, SEO, Social Media Marketing và Analytics.",
    shortDescription: "Hội thảo về Digital Marketing với các chuyên gia hàng đầu",
    date: "2024-01-20",
    location: "Khách sạn Lotte, Hà Nội",
    capacity: 200,
    registered: 200,
    image: "/placeholder.svg?height=200&width=400",
    status: "ended",
  },
  {
    id: "4",
    name: "AI & Machine Learning Workshop",
    description:
      "Workshop thực hành về AI và Machine Learning. Từ cơ bản đến nâng cao, với các bài tập thực tế và case study từ các doanh nghiệp lớn.",
    shortDescription: "Workshop thực hành về AI và Machine Learning",
    date: "2024-04-10",
    location: "Đại học Bách Khoa Hà Nội",
    capacity: 80,
    registered: 45,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "5",
    name: "UX/UI Design Masterclass",
    description:
      "Masterclass về UX/UI Design với các designer từ Figma, Adobe. Học cách thiết kế giao diện người dùng hiệu quả và tạo trải nghiệm tuyệt vời.",
    shortDescription: "Masterclass về UX/UI Design với các designer hàng đầu",
    date: "2024-03-25",
    location: "Creative Hub, TP.HCM",
    capacity: 120,
    registered: 67,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
]

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "upcoming" | "ended">("all")
  const { toast } = useToast()

  // Mock API call to fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEvents(mockEvents)
      setFilteredEvents(mockEvents)
      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  // Filter events based on status
  useEffect(() => {
    if (filter === "all") {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter((event) => event.status === filter))
    }
  }, [events, filter])

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleRegistration = async (eventId: string) => {
    try {
      // Mock API call
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      })

      // Simulate success/failure
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        toast({
          title: "Đăng ký thành công!",
          description: "Bạn đã đăng ký tham gia sự kiện thành công. Chúng tôi sẽ gửi email xác nhận sớm nhất.",
        })

        // Update registered count
        setEvents((prev) =>
          prev.map((event) => (event.id === eventId ? { ...event, registered: event.registered + 1 } : event)),
        )
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Khám phá các sự kiện tuyệt vời</h1>
          <p className="text-xl text-gray-600 mb-6">Tham gia các sự kiện công nghệ, networking và học tập hàng đầu</p>

          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => handleEventClick(event)}
                onRegister={() => handleRegistration(event.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có sự kiện nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}
      </main>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegistration}
      />

      <Toaster />
    </div>
  )
}
