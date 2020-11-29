import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import {Header, Icon, List} from "semantic-ui-react";

class App extends Component<any, any> {

    state = {
        values: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/values')
            .then(response => {
                this.setState({
                    values: response.data
                })
            }).catch(response => {
            if (response == null) {
                this.setState({
                    values: []
                })
            }
        })
    }

    render() {
        return (
            <div>
                <Header as='h2'>
                    <Icon name='plug'/>
                    <Header.Content>Reactivities</Header.Content>
                </Header>
                <List>
                    {this.state.values.map(((value: any) => (
                        <List.Item key={value.id}>{value.name}</List.Item>
                        )))}
                </List>
            </div>
        );
    }
}

export default App;
