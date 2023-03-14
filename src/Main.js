import * as React from "react";
import * as Recharts from "recharts";

const colors = ["#D51010", "#0e42dd"];

const data = [
    {
        name: "Sell",
        count: 4000,
    },
    {
        name: "Buy",
        count: 3000,
    },
];

export default function Main() {
    const message = "";
    const country = "";
    return (
        <div>
            <h1>{message}</h1>
            <h2>{country}</h2>
            <Recharts.ResponsiveContainer width={150} height={400}>
                <Recharts.BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <Recharts.XAxis dataKey="name" />
                    <Recharts.Bar dataKey="count" fill="#8884d8">
                        {data.map((entry, index) => (
                            <Recharts.Cell
                                key={`cell-${index}`}
                                fill={colors[index]}
                            />
                        ))}
                        <Recharts.LabelList
                            dataKey="count"
                            position="top"
                            fill=""
                        />
                    </Recharts.Bar>
                </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
        </div>
    );
}
