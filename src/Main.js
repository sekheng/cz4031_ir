import * as React from "react";
import * as Recharts from "recharts";
import PropTypes from "prop-types";
import { Col, Row, Figure } from "react-bootstrap";
const colors = ["#D51010", "#0e42dd", "#1cc41c", "#ee851b", "#b75de5"];

Main.propTypes = {
    result: PropTypes.object.isRequired,
    piecharClick: PropTypes.func.isRequired,
};

export default function Main(props) {
    const result = props.result;
    const piecharClick = props.piecharClick;
    let data = [];
    let subjectivityData = [];
    let overallSentiment = -1;
    let overallSentimentNum = 0;
    let overallSubjectivity = 0;
    let overallSubjectivityNum = 0;
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
        // check overall sentiment by getting the highest value in the data
        for (const item of data) {
            if (item.sentiment > overallSentimentNum) {
                overallSentiment = item.name;
                overallSentimentNum = item.sentiment;
            }
        }
        for (const item of subjectivityData) {
            if (item.subjectivity > overallSubjectivityNum) {
                overallSubjectivity = item.name;
                overallSubjectivityNum = item.subjectivity;
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
                                        onClick={() =>
                                            piecharClick({
                                                sentiment: entry.name,
                                            })
                                        }
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
                                        onClick={() =>
                                            piecharClick({
                                                subjectivity: entry.name,
                                            })
                                        }
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
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Overall</h3>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Figure>
                            <Figure.Image
                                width={100}
                                height={100}
                                alt="Overall"
                                src={
                                    overallSentiment == -1
                                        ? "pictures/decrease.png"
                                        : overallSentiment == 0
                                        ? "pictures/neutral.png"
                                        : "pictures/increase.png"
                                }
                            />
                            <Figure.Caption>
                                <h4>
                                    {overallSentiment == -1
                                        ? "Bearish"
                                        : overallSentiment == 0
                                        ? "Neutral"
                                        : "Bullish"}
                                </h4>
                            </Figure.Caption>
                        </Figure>
                    </Col>
                    <Col md="auto">
                        <Figure>
                            <Figure.Image
                                width={50}
                                alt="Overall"
                                src={
                                    overallSubjectivity == 0
                                        ? "pictures/brainstorm.png"
                                        : "pictures/heart.png"
                                }
                            />
                            <Figure.Caption>
                                <h4>
                                    {overallSubjectivity == 0
                                        ? "Objective"
                                        : "Subjective"}
                                </h4>
                            </Figure.Caption>
                        </Figure>
                    </Col>
                </Row>
            </div>
        );
}
