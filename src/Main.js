import * as React from "react";
import * as Recharts from "recharts";
import PropTypes from "prop-types";

const colors = ["#D51010", "#0e42dd", "#1cc41c", "#ee851b"];

Main.propTypes = {
    message: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
};

export default function Main(props) {
    const message = props.message;
    const result = props.result;
    let data = [];
    if (Object.keys(result).length > 0) {
        // start extracting the result and get the actual values!
        for (const item of result["docs"]) {
            let unableToFindSentiment = true;
            for (const sent of data) {
                if (sent.name == item.sentiment[0]) {
                    sent.sentiment += 1;
                    unableToFindSentiment = false;
                    break;
                }
            }
            if (unableToFindSentiment) {
                data.push({
                    name: item.sentiment[0],
                    sentiment: 1,
                });
            }
        }
    }
    if (data.length === 0) {
        return (
            <div>
                <h1>{message}</h1>
            </div>
        );
    } else
        return (
            <div>
                <h1>{message}</h1>
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
