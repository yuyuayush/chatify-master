import React from "react";

const SeatLegend = () => (
  <div className="flex gap-6 text-sm text-gray-300 mt-8">
    <LegendItem color="bg-green-500" label="Selected" />
    <LegendItem color="bg-red-500" label="Booked" />
    <LegendItem color="bg-yellow-500" label="Locked" />
    <LegendItem color="bg-gray-300" label="Platinum" />
    <LegendItem color="bg-amber-300" label="Gold" />
    <LegendItem color="bg-slate-400" label="Silver" />
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 ${color} rounded-sm`}></span>
    {label}
  </div>
);

export default SeatLegend;
