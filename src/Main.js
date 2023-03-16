import * as React from "react";
import * as Recharts from "recharts";
import PropTypes from "prop-types";

const colors = ["#D51010", "#0e42dd", "#1cc41c", "#ee851b"];

let data = [];

Main.propTypes = {
    message: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
};

export default function Main(props) {
    const message = props.message;
    const country = props.country;
    const result = props.result;
    if (Object.keys(result).length > 0) {
        // start extracting the result and get the actual values!
        for (const item of result["docs"]) {
            if (data.includes(item.sentiment.string) == false) {
                // this means that it doesn't exists
                data[item.sentiment] = {
                    name: item.sentiment,
                    sentiment: 1,
                };
            } else {
                console.log(data[item.sentiment]);
                data[item.sentiment].sentiment += 1;
            }
        }
    }
    if (data.length === 0) {
        return (
            <div>
                <h1>{message}</h1>
                <h2>{country}</h2>
            </div>
        );
    } else
        return (
            <div>
                <h1>{message}</h1>
                <h2>{country}</h2>
                <Recharts.ResponsiveContainer minWidth={150} minHeight={400}>
                    <Recharts.BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <Recharts.XAxis dataKey="name">
                            <Recharts.Label
                                value="Sentiment"
                                offset={0}
                                position="insideBottom"
                            />
                        </Recharts.XAxis>
                        <Recharts.Bar dataKey="sentiment" fill="#8884d8">
                            {data.map((entry, index) => (
                                <Recharts.Cell
                                    key={`cell-${index}`}
                                    fill={colors[index]}
                                />
                            ))}
                            <Recharts.LabelList
                                dataKey="sentiment"
                                position="top"
                                fill=""
                            />
                        </Recharts.Bar>
                    </Recharts.BarChart>
                </Recharts.ResponsiveContainer>
            </div>
        );
}
