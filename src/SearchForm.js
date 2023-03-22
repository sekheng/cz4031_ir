import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Main from "./Main";
import SolrNode from "solr-node";
// import RangeSlider from "react-range-slider-input";
// import DrawMap from "./DrawMap";
import "react-range-slider-input/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class SearchForm extends React.Component {
    state = {
        message: "",
        country: "",
        sendMessage: "",
        sendCountry: "",
        startDate: new Date("2014/02/08"),
        endDate: new Date("2014/02/08"),
    };

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
        core: "testTweet",
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
        }${
            this.checkLocation(this.state.country)
                ? ""
                : '%0Alocation:"' + this.state.country + '"'
        }&q.op=AND&rows=10000`;
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
                        let timeSt = colList.map((val) => {
                            return new Date(val);
                        });
                        // i am also assuming that the timestamp is sorted
                        // you need this line otherwise compiler complains
                        this.listOfTimeStamp = timeSt;
                        this.setState({ timeSt: this.listOfTimeStamp });
                        // console.log(this.listOfTimeStamp);
                        this.setState({ [timeSt[0]]: this.state.startDate });
                        this.setState({ [timeSt[0]]: this.state.endDate });
                    }
                }
            }.bind(this)
        );
    }

    setSelectedDate(date) {
        console.log(date);
    }

    render() {
        // to spawn the options
        // let locOptions = this.listOfLocs.map((option, index) => (
        //     <option key={index}>{option}</option>
        // ));
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
                    {/* <FloatingLabel
                        controlId="floatingInput"
                        label="Country"
                        className="mb-3"
                    >
                        <Form.Select
                            value={this.state.country}
                            onChange={(e) =>
                                this.setState({ country: e.target.value })
                            }
                        >
                            {locOptions}
                        </Form.Select>
                    </FloatingLabel> */}
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={this.handleSubmit}
                    >
                        Search
                    </Button>
                </ButtonToolbar>
                <label htmlFor="range-slider">DateTime Slider</label>
                {/* <RangeSlider
                    name="range-slider"
                    minValue={
                        this.listOfTimeStamp.length > 0
                            ? this.listOfTimeStamp[0].getTime()
                            : 0
                    }
                    maxValue={
                        this.listOfTimeStamp.length > 0
                            ? this.listOfTimeStamp[
                                  this.listOfTimeStamp.length - 1
                              ].getTime()
                            : 100
                    }
                    step={10}
                /> */}
                <DatePicker
                    showIcon
                    selected={this.listOfTimeStamp[0]}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={(date) => this.setSelectedDate(date)}
                />
                <Main message={this.state.message} result={this.result} />
                {/* <DrawMap result={this.result} /> */}
            </div>
        );
    }
}
