import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const data = [
    { name: 'Page A', uv: 523, pv: 1382, amt: 2741 },
    { name: 'Page B', uv: 689, pv: 1923, amt: 3187 },
    { name: 'Page C', uv: 412, pv: 1104, amt: 2490 },
    { name: 'Page D', uv: 798, pv: 2095, amt: 3012 },
    { name: 'Page E', uv: 345, pv: 987, amt: 2233 },
    { name: 'Page F', uv: 623, pv: 1776, amt: 2924 },
    { name: 'Page G', uv: 281, pv: 1345, amt: 2419 },
    { name: 'Page H', uv: 903, pv: 2154, amt: 3340 },
    { name: 'Page I', uv: 357, pv: 1022, amt: 2109 },
    { name: 'Page J', uv: 741, pv: 1888, amt: 3096 }
];

const Chart = () => (
    <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" name="User Views (uv)" />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" name="Page Views (pv)" />
    </LineChart>
);

export default Chart;
