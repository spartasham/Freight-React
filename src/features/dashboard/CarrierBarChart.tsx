import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { CarrierBreakdown } from './types';

interface Props {
  data: CarrierBreakdown[];
}

const CarrierBarChart: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" />
    </BarChart>
  </ResponsiveContainer>
);

export default CarrierBarChart;