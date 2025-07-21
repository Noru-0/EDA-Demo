"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import type { Event } from "@/app/page"

interface EventDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onRegister: (eventId: string) => void
}

export function EventDetailModal({ event, isOpen, onClose, onRegister }: EventDetailModalProps) {
  if (!event) return null

  const isFullyBooked = event.registered >= event.capacity
  const isEnded = event.status === "ended"
  const availableSpots = event.capacity - event.registered

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.name}
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                {event.status === "upcoming" ? "Sắp diễn ra" : "Đã kết thúc"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Ngày tổ chức</p>
                <p className="text-sm">
                  {new Date(event.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Thời gian</p>
                <p className="text-sm">9:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Địa điểm</p>
                <p className="text-sm">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Sức chứa</p>
                <p className="text-sm">
                  {event.registered}/{event.capacity} người đã đăng ký
                  {!isEnded && !isFullyBooked && (
                    <span className="text-green-600 ml-1">({availableSpots} chỗ còn lại)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Mô tả sự kiện</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Đóng
            </Button>
            <Button
              onClick={() => {
                onRegister(event.id)
                onClose()
              }}
              disabled={isFullyBooked || isEnded}
              className="flex-1"
            >
              {isEnded ? "Sự kiện đã kết thúc" : isFullyBooked ? "Hết chỗ trống" : "Đăng ký tham gia"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
