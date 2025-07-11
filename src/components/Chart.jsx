import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';

const Chart = ({ chartData }) => {
    const fundNames = chartData.length > 0
        ? Object.keys(chartData[0]).filter(key => key !== 'date')
        : [];

    return (
        <LineChart width={900} height={400} data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {fundNames.map((fundName, index) => (
                <Line
                    key={fundName}
                    type="monotone"
                    dataKey={fundName}
                    stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                    dot={false}
                    strokeWidth={2}
                />
            ))}
        </LineChart>
    );
};

export default Chart;
