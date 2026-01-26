"use client";

import * as React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";

export function CalendarFilter() {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative z-10">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${date || isOpen
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(157,78,221,0.4)]"
                    : "bg-background/50 border-border text-muted-foreground hover:bg-muted"
                    }`}
            >
                <CalendarIcon size={16} />
                {date ? format(date, "d MMM yyyy", { locale: sv }) : "Välj datum"}
                {date && (
                    <div
                        role="button"
                        className="ml-1 p-0.5 rounded-full hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDate(undefined);
                        }}
                    >
                        <X size={12} />
                    </div>
                )}
            </button>

            {/* Calendar Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-4 left-0 p-4 bg-[#121212]/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl ring-1 ring-white/5"
                    >
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                setDate(d);
                                setIsOpen(false);
                            }}
                            locale={sv}
                            showOutsideDays
                            className="!m-0"
                            classNames={{
                                caption: "flex justify-center py-2 mb-4 relative items-center",
                                caption_label: "text-sm font-medium text-foreground",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-full transition-colors",
                                day_selected:
                                    "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-[0_0_10px_rgba(157,78,221,0.5)]",
                                day_today: "bg-accent/20 text-accent-foreground",
                                day_outside: "text-muted-foreground opacity-50",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_hidden: "invisible",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
