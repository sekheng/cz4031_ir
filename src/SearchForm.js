import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Main from "./Main";
import SolrNode from "solr-node";

export default class SearchForm extends React.Component {
    state = {
        message: "",
        country: "",
        sendMessage: "",
        sendCountry: "",
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
    listOfLocs = ["none"];
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get the list of places
        if (this.listOfLocs.length <= 1) {
            const columnStr =
                "q=*:*&q.op=OR&facet=true&facet.field=location&facet.limit=-1&facet.mincount=1";
            this.client.search(
                columnStr,
                function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        // extract the list from result
                        const column =
                            result["facet_counts"]["facet_fields"]["location"];
                        if (column !== undefined) {
                            let colList = column.filter(
                                (val) => typeof val === "string"
                            );
                            // you need this line otherwise compiler complains
                            this.listOfLocs = this.listOfLocs.concat(colList);
                            this.setState({ colList: this.listOfLocs });
                        }
                    }
                }.bind(this)
            );
        }
    }

    render() {
        // to spawn the options
        let locOptions = this.listOfLocs.map((option, index) => (
            <option key={index}>{option}</option>
        ));
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
                    <FloatingLabel
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
                    </FloatingLabel>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={this.handleSubmit}
                    >
                        Search
                    </Button>
                </ButtonToolbar>
                <Main
                    message={this.state.message}
                    country={this.state.country}
                    result={this.result}
                />
            </div>
        );
    }
}
