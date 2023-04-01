import * as React from "react";
import PropTypes from "prop-types";
import { Col, Card, Row, Stack } from "react-bootstrap";
import { AiOutlineRetweet } from "react-icons/ai";
import { FcLike } from "react-icons/fc";

TweetBox.propTypes = {
    result: PropTypes.object.isRequired,
};

export default function TweetBox(props) {
    const result = props.result;
    console.log(result);
    if (Object.keys(result).length == 0) {
        return <div></div>;
    } else {
        return (
            <Stack gap={3}>
                <h2>List of Tweets from the selected ticker</h2>
                {
                    // start extracting the result and get the actual values!
                    result["docs"].map((item, index) => {
                        const date = new Date(item.post_date);
                        const formattedDate = date.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                            timeZone: "UTC",
                        });
                        return (
                            <Card key={index}>
                                <Row>
                                    <Col md="auto">
                                        <h4>{item.author}</h4>
                                    </Col>
                                    <Col md="auto">
                                        <p>{formattedDate}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>{item.raw_text}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="auto">
                                        <FcLike />
                                        <p>{item.like_num}</p>
                                    </Col>
                                    <Col md="auto">
                                        <AiOutlineRetweet />
                                        <p>{item.retweet_num}</p>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })
                }
            </Stack>
        );
    }
}
