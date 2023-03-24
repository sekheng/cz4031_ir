import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Main from "./Main";
import SolrNode from "solr-node";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";

export default class SearchForm extends React.Component {
    state = {
        message: "",
        country: "",
        sendMessage: "",
        sendCountry: "",
        startDate: new Date("2014/02/08"),
        endDate: new Date("2014/02/08"),
    };

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
        core: "mycore",
        protocol: "http",
    });

    result = {};
    handleSubmit = () => {
        // this will send the query to get data from SOLR
        this.setState({ sendMessage: this.state.message });
        this.setState({ sendCountry: this.state.country });
        let supposedStr = `q=clean_text:${
            this.state.message == "" || this.state.message == undefined
                ? "*"
                : `"` + this.state.message + `"`
        }&fq=post_date:[${this.state.startDate.toISOString()} TO ${this.state.endDate.toISOString()}]&q.op=AND&rows=10000`;
        console.log(supposedStr);
        this.client.search(
            supposedStr,
            function (err, result) {
                if (err) {
                    console.log(err);
                }
                const res = result.response;
                // then get the data from it!
                this.result = res;
                this.setState({ res: this.result });
            }.bind(this)
        );
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
                        this.setState({
                            startDate: this.listOfTimeStamp[0],
                        });
                        console.log(this.state.startDate);
                        this.setState({
                            endDate:
                                this.listOfTimeStamp[
                                    this.listOfTimeStamp.length - 1
                                ],
                        });
                        console.log(this.state.endDate);
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

    render() {
        // to spawn the options
        return (
            <div>
                <ButtonToolbar>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Ticker"
                        className="mb-3"
                    >
                        <Form.Control
                            className="me-auto"
                            placeholder="Type in your favourite ticker such as 'TSLA"
                            onChange={(e) =>
                                this.setState({ message: e.target.value })
                            }
                            value={this.state.message}
                        />
                    </FloatingLabel>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={this.handleSubmit}
                    >
                        Search
                    </Button>
                </ButtonToolbar>
                <label htmlFor="range-slider">
                    Select the Start Date and End Date
                </label>
                <DatePicker
                    showIcon
                    selected={
                        format(this.state.startDate, "yyyy-MM-dd") ==
                        this.defaultDate
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
                <Main message={this.state.message} result={this.result} />
                {/* <DrawMap result={this.result} /> */}
            </div>
        );
    }
}
