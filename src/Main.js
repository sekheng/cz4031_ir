import * as React from "react";
import * as Recharts from "recharts";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
const colors = ["#D51010", "#0e42dd", "#1cc41c", "#ee851b"];

Main.propTypes = {
    result: PropTypes.object.isRequired,
};

export default function Main(props) {
    const result = props.result;
    let data = [];
    let subjectivityData = [];
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
            // almost the same for subjectivity
            let unableToFindSubjectivity = true;
            for (const sent of subjectivityData) {
                if (sent.name == item.subjectivity[0]) {
                    sent.subjectivity += 1;
                    unableToFindSubjectivity = false;
                    break;
                }
            }
            if (unableToFindSubjectivity) {
                subjectivityData.push({
                    name: item.subjectivity[0],
                    subjectivity: 1,
                });
            }
        }
    }
    if (data.length === 0) {
        return <div></div>;
    } else
        return (
            <div>
                <Row className="justify-content-md-center">
                    <Col className="justify-content-md-center">
                        <h3>Sentiment PieChart</h3>
                        <Recharts.PieChart width={400} height={400}>
                            <Recharts.Pie
                                data={data}
                                dataKey="sentiment"
                                nameKey="name"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Recharts.Cell
                                        key={`cell-${index}`}
                                        fill={colors[index]}
                                    />
                                ))}
                                <Recharts.LabelList
                                    dataKey="name"
                                    position="top"
                                />
                            </Recharts.Pie>
                            <Recharts.Legend verticalAlign="top" height={36} />
                            <Recharts.Tooltip />
                        </Recharts.PieChart>
                    </Col>
                    <Col>
                        <h3>Subjectivity PieChart</h3>
                        <Recharts.PieChart width={400} height={400}>
                            <Recharts.Pie
                                data={subjectivityData}
                                dataKey="subjectivity"
                                nameKey="name"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Recharts.Cell
                                        key={`cell-${index}`}
                                        fill={colors[index]}
                                    />
                                ))}
                                <Recharts.LabelList
                                    dataKey="name"
                                    position="top"
                                />
                            </Recharts.Pie>
                            <Recharts.Legend verticalAlign="top" />
                            <Recharts.Tooltip />
                        </Recharts.PieChart>
                    </Col>
                </Row>
            </div>
        );
}
