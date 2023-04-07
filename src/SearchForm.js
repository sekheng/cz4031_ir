import * as React from "react";
import Main from "./Main";
import SolrNode from "solr-node";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FloatingLabel,
    ButtonToolbar,
    Stack,
    Dropdown,
    DropdownButton,
    InputGroup,
} from "react-bootstrap";
import TweetBox from "./TweetBox";

export default class SearchForm extends React.Component {
    state = {
        message: "",
        country: "",
        sendMessage: "",
        sendCountry: "",
        startDate: new Date("2014/02/08"),
        endDate: new Date("2014/02/08"),
        listOfRecommended: ["AAPL", "TSLA", "META", "GOOG", "AMZN", "MSFT"],
        selectedTicker: "Select a ticker",
        clickedPieChartName: {},
    };

    handlePieChartClick(name) {
        this.setState({ clickedPieChartName: name });
    }

    defaultDate = format(new Date("2014/02/08"), "yyyy-MM-dd");

    checkLocation(location) {
        return (
            location == "" ||
            location == undefined ||
            location == this.listOfLocs[0]
        );
    }

    client = new SolrNode({
        host: "localhost",
        port: "8983",
        core: "stock_project_core",
        protocol: "http",
    });

    result = {};
    handleSubmit = () => {
        if (this.state.message.localeCompare(this.state.selectedTicker) !== 0) {
            this.setState({ selectedTicker: "Select a ticker" });
        }
        if (this.state.message.trim() === "") {
            // Input is empty, do not submit
            return;
        }
        // this will send the query to get data from SOLR
        this.setState({ sendMessage: this.state.message });
        this.setState({ sendCountry: this.state.country });
        this.setState({ clickedPieChartName: {} });
        // let supposedStr = `q=clean_text:${
        //     this.state.message == "" || this.state.message == undefined
        //         ? "*"
        //         : `"` + this.state.message + `"`
        // }&fq=post_date:[${this.state.startDate.toISOString()} TO ${this.state.endDate.toISOString()}]&q.op=AND&rows=10000`;
        // this.client.search(
        //     supposedStr,
        //     function (err, result) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         const res = result.response;
        //         // then get the data from it!
        //         this.result = res;
        //         this.setState({ res: this.result });
        //     }.bind(this)
        // );
        fetch("http://localhost:5000/querywithdate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "company",
                content: this.state.message,
                start_date: this.state.startDate.toISOString().substring(0, 10),
                end_date: this.state.endDate.toISOString().substring(0, 10),
                count: 10000,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.result = data;
                this.setState({ res: this.result });
            });
    };

    handleSelectTicker = (ticker) => {
        this.setState({ selectedTicker: ticker });
        this.setState({ message: ticker });
    };

    listOfTimeStamp = [];
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get the list of places
        const columnStr =
            "q=post_date:*&q.op=OR&facet=true&facet.field=post_date&facet.limit=-1&facet.mincount=1";
        this.client.search(
            columnStr,
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    // extract the list from result
                    const column =
                        result["facet_counts"]["facet_fields"]["post_date"];
                    if (column !== undefined) {
                        let colList = column.filter(
                            (val) => typeof val === "string"
                        );
                        let uniqueDate = new Set();
                        for (const timestam of colList) {
                            let date = new Date(timestam);
                            uniqueDate.add(format(date, "yyyy-MM-dd"));
                        }
                        // i am also assuming that the timestamp is sorted
                        // you need this line otherwise compiler complains
                        this.listOfTimeStamp = Array.from(uniqueDate).map(
                            (val) => {
                                return parseISO(val);
                            }
                        );
                        let lastDay = new Date(
                            this.listOfTimeStamp[
                                this.listOfTimeStamp.length - 1
                            ]
                        );
                        lastDay.setDate(lastDay.getDate() + 1);
                        this.listOfTimeStamp.push(lastDay);
                        this.setState({
                            startDate: this.listOfTimeStamp[0],
                        });
                        this.setState({
                            endDate:
                                this.listOfTimeStamp[
                                    this.listOfTimeStamp.length - 1
                                ],
                        });
                    }
                }
            }.bind(this)
        );
    }

    setSelectedDate(dates) {
        const [start, end] = dates;
        this.setState({
            startDate: start,
            endDate: end,
        });
    }

    setStartDate(date) {
        this.setState({
            startDate: date,
        });
    }

    setEndDate(date) {
        this.setState({
            endDate: date,
        });
    }

    render() {
        // to spawn the options
        return (
            <Container style={{ marginTop: "20px" }}>
                <Stack gap={3}>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h1>Twitter Stock Analysis</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <ButtonToolbar>
                                <InputGroup className="mb-3">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Ticker"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            className="me-auto"
                                            placeholder="Type in your favourite ticker such as 'TSLA"
                                            onChange={(e) =>
                                                this.setState({
                                                    message: e.target.value,
                                                })
                                            }
                                            value={this.state.message}
                                        />
                                    </FloatingLabel>
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title={this.state.selectedTicker}
                                        id="input-group-dropdown-2"
                                        align="end"
                                    >
                                        {this.state.listOfRecommended.map(
                                            (val, index) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={index}
                                                        as="button"
                                                        onClick={() =>
                                                            this.handleSelectTicker(
                                                                val
                                                            )
                                                        }
                                                    >
                                                        {val}
                                                    </Dropdown.Item>
                                                );
                                            }
                                        )}
                                    </DropdownButton>
                                </InputGroup>
                            </ButtonToolbar>
                        </Col>
                        <Col md="auto">
                            <Button
                                type="submit"
                                variant="primary"
                                onClick={this.handleSubmit}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <label style={{ fontWeight: "bold" }}>
                                Select the Start Date and End Date
                            </label>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <label style={{ fontWeight: "bold" }}>
                                Start Date
                            </label>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={(date) => this.setStartDate(date)}
                                selectsStart
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                includeDates={this.listOfTimeStamp}
                            />
                        </Col>
                        <Col md="auto">
                            <label style={{ fontWeight: "bold" }}>
                                End Date
                            </label>
                            <DatePicker
                                selected={this.state.endDate}
                                onChange={(date) => this.setEndDate(date)}
                                selectsEnd
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                minDate={this.state.startDate}
                                includeDates={this.listOfTimeStamp}
                            />
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <DatePicker
                                showIcon
                                selected={
                                    format(
                                        this.state.startDate,
                                        "yyyy-MM-dd"
                                    ) == this.defaultDate
                                        ? this.listOfTimeStamp[0]
                                        : this.state.startDate
                                }
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(date) => this.setSelectedDate(date)}
                                includeDates={this.listOfTimeStamp}
                                selectsRange
                                inline
                            />
                        </Col>
                    </Row>
                    <Main
                        result={this.result}
                        piecharClick={this.handlePieChartClick.bind(this)}
                    />
                    <TweetBox
                        result={this.result}
                        clickedPieChartName={this.state.clickedPieChartName}
                    />
                </Stack>
            </Container>
        );
    }
}
