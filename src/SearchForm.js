import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Main from "./Main";

class SearchForm extends React.Component {
    state = {
        message: "",
        country: "",
        sendMessage: "",
        sendCountry: "",
    };

    handleSubmit = () => {
        // this will send the query to get data from SOLR
        this.setState({ sendMessage: this.state.message });
        this.setState({ sendCountry: this.state.country });
    };

    render() {
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
                            <option value="">Select a country</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Indonesia">Indonesia</option>
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
                    message={this.state.sendMessage}
                    country={this.state.sendCountry}
                />
            </div>
        );
    }
}

export default SearchForm;
