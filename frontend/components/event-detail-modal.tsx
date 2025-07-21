'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Event } from '@/app/page';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string, userId: string) => void;
}

export function EventDetailModal({ event, isOpen, onClose, onRegister }: EventDetailModalProps) {
  const [userId, setUserId] = useState('');
  const { toast } = useToast();

  if (!event) return null;

  const isFullyBooked = event.registered >= event.capacity;
  const isEnded = event.status === 'ended';
  const isDisabled = isFullyBooked || isEnded || !userId;
  const availableSpots = event.capacity - event.registered;
  const eventDate = new Date(event.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusLabel = event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc';
  const badgeVariant = event.status === 'upcoming' ? 'default' : 'secondary';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập User ID.',
        variant: 'destructive',
      });
      return;
    }
    onRegister(event.id, userId);
    setUserId(''); // Reset sau khi đăng ký
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Image
              src={event.image || '/placeholder.svg'}
              alt={event.name}
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={badgeVariant}>{statusLabel}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Calendar} label="Ngày tổ chức" value={eventDate} />
            <InfoItem icon={Clock} label="Thời gian" value="9:00 AM - 5:00 PM" />
            <InfoItem icon={MapPin} label="Địa điểm" value={event.location} />
            <InfoItem
              icon={Users}
              label="Sức chứa"
              value={
                <>
                  {event.registered}/{event.capacity} người đã đăng ký
                  {!isEnded && !isFullyBooked && (
                    <span className="text-green-600 ml-1">({availableSpots} chỗ còn lại)</span>
                  )}
                </>
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Mô tả sự kiện</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Nhập User ID của bạn"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isFullyBooked || isEnded}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Đóng
              </Button>
              <Button type="submit" disabled={isDisabled} className="flex-1">
                {isEnded ? 'Sự kiện đã kết thúc' : isFullyBooked ? 'Hết chỗ trống' : 'Đăng ký tham gia'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center text-gray-600">
      <Icon className="h-5 w-5 mr-3" />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
