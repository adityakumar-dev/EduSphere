"use client";
import { useState } from "react";

type TimeTableType = 'Lecture' | 'Lab' | 'Lunch';

interface TimeTableProps {
  id: string;
  teacher: string;
  subject: string;
  startTime: string; // in 24h format (HH:MM)
  endTime: string;   // in 24h format (HH:MM)
  type: TimeTableType;
}

interface TimeTable {
  day: string;
  timeSlots: TimeTableProps[];
}

// Helper functions for time manipulation
const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + minutesToAdd;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

const calculateDurationInMinutes = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;
  
  // Handle case when end time is on the next day
  if (totalEndMinutes < totalStartMinutes) {
    totalEndMinutes += 24 * 60;
  }
  
  return totalEndMinutes - totalStartMinutes;
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${String(mins).padStart(2, '0')}`;
};

export default function TimeTablePage() {
  const subjects = ['COA', 'DAA', 'OS', 'DBMS', 'CN', 'SE'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const teachers = ['Nirmala Pandey',"Mamta Pandey","Priyanka Aswal"];
  const [timeTable, setTimeTable] = useState<TimeTable[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Generate unique ID
  const generateId = () => `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Initialize empty timetable
  const addTimeTableItem = () => {
    const defaultStartTime = "09:00";
    const defaultEndTime = "10:00";

    const newTimeTable: TimeTable[] = days.map((day) => ({
      day,
      timeSlots: [
        {
          id: generateId(),
          teacher: '',
          subject: '',
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          type: 'Lecture' as TimeTableType,
        }
      ],
    }));
    setTimeTable(newTimeTable);
  };
  
  const nextDay = () => {
    setCurrentDayIndex((prev) => (prev < days.length - 1 ? prev + 1 : prev));
  };
  
  const prevDay = () => {
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Add a new time slot
  const addTimeSlot = () => {
    const currentDay = timeTable[currentDayIndex];
    if (!currentDay.timeSlots.length) {
      // If no slots yet, add the first one starting at 9:00
      const newSlot: TimeTableProps = {
        id: generateId(),
        teacher: '',
        subject: '',
        startTime: "09:00",
        endTime: "10:00",
        type: 'Lecture',
      };
      
      const updatedTimeTable = [...timeTable];
      updatedTimeTable[currentDayIndex].timeSlots.push(newSlot);
      setTimeTable(updatedTimeTable);
      return;
    }
    
    // Otherwise, add a slot starting after the last one
    const lastSlot = currentDay.timeSlots[currentDay.timeSlots.length - 1];
    const newStartTime = lastSlot.endTime;
    const newEndTime = addMinutesToTime(newStartTime, 60);
    
    const newSlot: TimeTableProps = {
      id: generateId(),
      teacher: '',
      subject: '',
      startTime: newStartTime,
      endTime: newEndTime,
      type: 'Lecture',
    };
    
    const updatedTimeTable = [...timeTable];
    updatedTimeTable[currentDayIndex].timeSlots.push(newSlot);
    setTimeTable(updatedTimeTable);
  };

  // Adjust time with buttons (15-minute increments)
  const adjustTime = (slotId: string, field: 'startTime' | 'endTime', minutesToAdd: number) => {
    const updatedTimeTable = [...timeTable];
    const daySlots = updatedTimeTable[currentDayIndex].timeSlots;
    
    // Find the slot index
    const slotIndex = daySlots.findIndex(slot => slot.id === slotId);
    if (slotIndex === -1) return;
    
    const slot = daySlots[slotIndex];
    
    // If adjusting start time
    if (field === 'startTime') {
      const newStartTime = addMinutesToTime(slot.startTime, minutesToAdd);
      
      // Ensure start time doesn't go past end time
      const startMinutes = parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
      const endMinutes = parseInt(slot.endTime.split(':')[0]) * 60 + parseInt(slot.endTime.split(':')[1]);
      
      if (startMinutes >= endMinutes) {
        setErrorMessage("Start time cannot be after or equal to end time");
        return;
      }
      
      slot.startTime = newStartTime;
      
      // Adjust previous slot's end time if needed
      if (slotIndex > 0 && minutesToAdd < 0) {
        const prevSlot = daySlots[slotIndex - 1];
        const prevEndMinutes = parseInt(prevSlot.endTime.split(':')[0]) * 60 + parseInt(prevSlot.endTime.split(':')[1]);
        const newStartMinutes = parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
        
        if (newStartMinutes < prevEndMinutes) {
          prevSlot.endTime = newStartTime;
        }
      }
    } 
    // If adjusting end time
    else if (field === 'endTime') {
      const newEndTime = addMinutesToTime(slot.endTime, minutesToAdd);
      
      // Ensure end time doesn't go before start time
      const startMinutes = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
      const endMinutes = parseInt(newEndTime.split(':')[0]) * 60 + parseInt(newEndTime.split(':')[1]);
      
      if (endMinutes <= startMinutes) {
        setErrorMessage("End time cannot be before or equal to start time");
        return;
      }
      
      slot.endTime = newEndTime;
      
      // Update next slot's start time if needed
      if (slotIndex < daySlots.length - 1 && minutesToAdd > 0) {
        const nextSlot = daySlots[slotIndex + 1];
        const nextStartMinutes = parseInt(nextSlot.startTime.split(':')[0]) * 60 + parseInt(nextSlot.startTime.split(':')[1]);
        const newEndMinutes = parseInt(newEndTime.split(':')[0]) * 60 + parseInt(newEndTime.split(':')[1]);
        
        if (newEndMinutes > nextStartMinutes) {
          nextSlot.startTime = newEndTime;
          
          // Also adjust the end time to maintain duration
          const nextDuration = calculateDurationInMinutes(nextSlot.startTime, nextSlot.endTime);
          nextSlot.endTime = addMinutesToTime(newEndTime, nextDuration);
        }
      }
    }
    
    setErrorMessage("");
    setTimeTable(updatedTimeTable);
  };

  // Update type and handle special cases like Lunch
  const updateType = (slotId: string, newType: TimeTableType) => {
    const updatedTimeTable = [...timeTable];
    const daySlots = updatedTimeTable[currentDayIndex].timeSlots;
    const slotIndex = daySlots.findIndex(slot => slot.id === slotId);
    
    if (slotIndex !== -1) {
      const slot = updatedTimeTable[currentDayIndex].timeSlots[slotIndex];
      slot.type = newType;
      
      // If type is Lunch, clear teacher and subject
      if (newType === 'Lunch') {
        slot.teacher = '-';
        slot.subject = '-';
      }
      
      setTimeTable(updatedTimeTable);
    }
  };

  // Update other properties
  const updateTimeSlot = (slotId: string, field: 'teacher' | 'subject', value: string) => {
    const updatedTimeTable = [...timeTable];
    const daySlots = updatedTimeTable[currentDayIndex].timeSlots;
    const slotIndex = daySlots.findIndex(slot => slot.id === slotId);
    
    if (slotIndex !== -1) {
      // Only update if not a lunch slot
      const slot = updatedTimeTable[currentDayIndex].timeSlots[slotIndex];
      if (slot.type !== 'Lunch') {
        updatedTimeTable[currentDayIndex].timeSlots[slotIndex][field] = value;
        setTimeTable(updatedTimeTable);
      }
    }
  };

  // Remove a time slot
  const removeTimeSlot = (slotId: string) => {
    const updatedTimeTable = [...timeTable];
    updatedTimeTable[currentDayIndex].timeSlots = updatedTimeTable[currentDayIndex].timeSlots.filter(
      slot => slot.id !== slotId
    );
    setTimeTable(updatedTimeTable);
  };

  // Sort time slots by start time
  const sortTimeSlots = () => {
    const updatedTimeTable = [...timeTable];
    updatedTimeTable[currentDayIndex].timeSlots.sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      
      if (timeA[0] === timeB[0]) {
        return timeA[1] - timeB[1];
      }
      return timeA[0] - timeB[0];
    });
    
    setTimeTable(updatedTimeTable);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 p-4">
  {timeTable.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-4 h-96 text-center">
      <p className="text-xl sm:text-2xl font-bold">No Time Table Found</p>
      <button
        onClick={addTimeTableItem}
        className="text-base sm:text-xl font-bold bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Create New Timetable
      </button>
    </div>
  ) : (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Class Timetable</h1>
        <button
          onClick={sortTimeSlots}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Sort Time Slots
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <button
          onClick={prevDay}
          disabled={currentDayIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Previous Day
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          {timeTable[currentDayIndex]?.day}
        </h2>
        <button
          onClick={nextDay}
          disabled={currentDayIndex === days.length - 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Next Day
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={addTimeSlot}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Add Time Slot
        </button>
      </div>

      <div className="space-y-4">
        {timeTable[currentDayIndex]?.timeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`${slot.type === 'Lunch' ? 'bg-yellow-50' : 'bg-white'} border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Start Time */}
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => adjustTime(slot.id, 'startTime', -15)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      -15m
                    </button>
                    <span className="px-3 py-1 bg-white font-medium min-w-16 text-center">
                      {slot.startTime}
                    </span>
                    <button
                      onClick={() => adjustTime(slot.id, 'startTime', 15)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      +15m
                    </button>
                  </div>
                </div>

                <div className="text-lg mt-5 text-center">→</div>

                {/* End Time */}
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => adjustTime(slot.id, 'endTime', -15)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      -15m
                    </button>
                    <span className="px-3 py-1 bg-white font-medium min-w-16 text-center">
                      {slot.endTime}
                    </span>
                    <button
                      onClick={() => adjustTime(slot.id, 'endTime', 15)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      +15m
                    </button>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-gray-500">
                  Duration: {formatDuration(calculateDurationInMinutes(slot.startTime, slot.endTime))}
                </div>
              </div>

              <button
                onClick={() => removeTimeSlot(slot.id)}
                className="text-red-500 hover:text-red-700 self-start md:self-center"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['Lecture', 'Lab', 'Lunch'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateType(slot.id, type as TimeTableType)}
                      className={`py-2 rounded ${
                        slot.type === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {slot.type !== 'Lunch' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <select
                      value={slot.teacher}
                      onChange={(e) => updateTimeSlot(slot.id, 'teacher', e.target.value)}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={slot.subject}
                      onChange={(e) => updateTimeSlot(slot.id, 'subject', e.target.value)}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex items-center justify-center">
                  <span className="text-lg font-medium text-amber-600">Lunch Break</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {timeTable[currentDayIndex]?.timeSlots.length === 0 && (
        <div className="text-center py-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No time slots for {timeTable[currentDayIndex]?.day}.</p>
          <button
            onClick={addTimeSlot}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add First Time Slot
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
        <button
          onClick={prevDay}
          disabled={currentDayIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Previous Day
        </button>

        <div className="flex gap-1">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setCurrentDayIndex(index)}
              className={`w-4 h-4 rounded-full ${
                currentDayIndex === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={day}
            />
          ))}
        </div>

        <button
          onClick={nextDay}
          disabled={currentDayIndex === days.length - 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Next Day
        </button>
      </div>
    </div>
  )}
</div>

  );
}