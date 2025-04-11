import React from "react";
import { ChartContainer, ChartTooltipContent } from "./ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useIsMobile } from "../hooks/use-mobile";

const data = [
  {
    name: "Mon",
    consumed: 2150,
    burned: 2400,
  },
  {
    name: "Tue",
    consumed: 2000,
    burned: 2210,
  },
  {
    name: "Wed",
    consumed: 2200,
    burned: 2290,
  },
  {
    name: "Thu",
    consumed: 2780,
    burned: 2000,
  },
  {
    name: "Fri",
    consumed: 1890,
    burned: 2181,
  },
  {
    name: "Sat",
    consumed: 2390,
    burned: 2500,
  },
  {
    name: "Sun",
    consumed: 2490,
    burned: 2100,
  },
];

export function CalorieChart() {
  const isMobile = useIsMobile();

  const chartConfig = {
    consumed: {
      label: "Calories Consumed",
      color: "#0EA5E9",  // primary
    },
    burned: {
      label: "Calories Burned",
      color: "#F97316",  // accent
    },
  };

  // Custom tooltip component for recharts
  const CustomTooltip = (props: any) => {
    return props.active ? <ChartTooltipContent {...props} /> : null;
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: isMobile ? 0 : 30,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={isMobile ? 30 : 50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="consumed" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="burned" fill="#F97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
