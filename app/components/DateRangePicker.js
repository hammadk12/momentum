"use client"
import { Button } from '@radix-ui/themes';
import React from 'react'


const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange, onSearch }) => { 
  return (
    <div className='flex space-x-2 mb-10'>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        placeholder="End Date"
      />
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
};

export default DateRangePicker;