"use client";

import * as React from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday
} from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface CalendarWidgetProps {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
}

export function CalendarWidget({ selected, onSelect, className }: CalendarWidgetProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    // Generate days
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: sv }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { locale: sv });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

    const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

    const handleDayClick = (day: Date) => {
        if (onSelect) {
            // Toggle: if clicking selected, deselect. Else select.
            if (selected && isSameDay(day, selected)) {
                onSelect(undefined);
            } else {
                onSelect(day);
            }
        }
    };

    return (
        <div className={clsx("w-full p-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded-full hover:bg-black/5 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-slate-800 capitalize tracking-wide">
                    {format(currentMonth, "MMMM yyyy", { locale: sv })}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-black/5 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const isSelected = selected && isSameDay(day, selected);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isCurrentDay = isToday(day);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => handleDayClick(day)}
                            className={clsx(
                                "h-8 w-full rounded-lg flex items-center justify-center text-xs transition-all relative",
                                !isCurrentMonth && "text-slate-300",
                                isCurrentMonth && !isSelected && "text-slate-600 hover:bg-slate-100 font-medium",
                                isSelected && "bg-slate-900 text-white shadow-md font-bold scale-105 z-10",
                                isCurrentDay && !isSelected && "text-slate-900 font-bold",
                            )}
                        >
                            {format(day, "d")}
                            {/* Dot indicator for 'today' if not selected */}
                            {isCurrentDay && !isSelected && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-900" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
